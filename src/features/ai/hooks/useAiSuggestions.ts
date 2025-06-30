/**
 * @fileoverview Custom hook for AI suggestions management
 * @description Provides debounced AI suggestion generation with caching and error handling
 */

import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import {
  generateAiSuggestionThunk,
  acceptSuggestion,
  dismissSuggestion,
  removeSuggestion,
  clearSuggestions,
  selectAiSuggestions,
  selectActiveSuggestions,
  selectIsGenerating,
  selectAiError,
  selectAiPreferences,
} from '../aiSlice';
import { selectCurrentEmail } from '../../inbox/inboxSlice';
import { selectUser } from '../../auth/authSlice';
import { AiRequest, AiSuggestionType, AiTone } from '../types';

/**
 * @description Hook configuration options
 */
interface UseAiSuggestionsOptions {
  debounceMs?: number;
  autoGenerateThreshold?: number;
  enableCaching?: boolean;
}

/**
 * @description Custom hook for AI suggestions management
 * @param {UseAiSuggestionsOptions} options - Hook configuration
 * @returns {Object} AI suggestions state and actions
 */
export function useAiSuggestions(options: UseAiSuggestionsOptions = {}) {
  const {
    debounceMs = 600,
    autoGenerateThreshold = 50,
    enableCaching = true,
  } = options;

  const dispatch = useAppDispatch();
  
  // Selectors
  const suggestions = useAppSelector(selectAiSuggestions);
  const activeSuggestions = useAppSelector(selectActiveSuggestions);
  const isGenerating = useAppSelector(selectIsGenerating);
  const error = useAppSelector(selectAiError);
  const preferences = useAppSelector(selectAiPreferences);
  const currentEmail = useAppSelector(selectCurrentEmail);
  const user = useAppSelector(selectUser);

  // Local cache for debouncing
  const requestCache = useMemo(() => new Map<string, string>(), []);

  /**
   * @description Generates cache key for request deduplication
   */
  const getCacheKey = useCallback((text: string, type: AiSuggestionType, tone?: AiTone): string => {
    return `${type}_${tone || 'default'}_${text.substring(0, 100)}`;
  }, []);

  /**
   * @description Generates AI suggestion with debouncing and caching
   */
  const generateSuggestion = useCallback(
    async (text: string, type: AiSuggestionType, tone?: AiTone, context?: string) => {
      // Validate inputs
      if (!text.trim() || text.length < 10) {
        return;
      }

      // Check if AI is enabled
      if (!preferences?.enabled || !preferences.categories[type]) {
        return;
      }

      // Check cache for duplicate requests
      const cacheKey = getCacheKey(text, type, tone);
      if (enableCaching && requestCache.has(cacheKey)) {
        return;
      }

      // Add to cache
      if (enableCaching) {
        requestCache.set(cacheKey, text);
      }

             // Build request payload
       const request: AiRequest = {
         text,
         type,
         tone,
         context,
         user_preferences: preferences || undefined,
         email_context: currentEmail ? {
           subject: currentEmail.subject,
           recipient: 'unknown', // Email schema doesn't include recipient info
         } : undefined,
       };

      try {
        await dispatch(generateAiSuggestionThunk(request)).unwrap();
      } catch (error) {
        console.error('AI suggestion generation failed:', error);
        // Remove from cache on error so it can be retried
        if (enableCaching) {
          requestCache.delete(cacheKey);
        }
      }
    },
    [dispatch, preferences, currentEmail, getCacheKey, enableCaching, requestCache]
  );

  /**
   * @description Debounced version of generateSuggestion
   */
  const debouncedGenerateSuggestion = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      
      return (text: string, type: AiSuggestionType, tone?: AiTone, context?: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          generateSuggestion(text, type, tone, context);
        }, debounceMs);
      };
    })(),
    [generateSuggestion, debounceMs]
  );

  /**
   * @description Accepts a suggestion and applies it
   */
  const handleAcceptSuggestion = useCallback(
    (suggestionId: string) => {
      dispatch(acceptSuggestion(suggestionId));
      
      // Update analytics if preferences allow learning
      if (preferences?.learn_from_corrections) {
        // This would typically update user writing patterns
        console.log('Learning from accepted suggestion:', suggestionId);
      }
    },
    [dispatch, preferences]
  );

  /**
   * @description Dismisses a suggestion
   */
  const handleDismissSuggestion = useCallback(
    (suggestionId: string) => {
      dispatch(dismissSuggestion(suggestionId));
    },
    [dispatch]
  );

  /**
   * @description Removes a suggestion from the list
   */
  const handleRemoveSuggestion = useCallback(
    (suggestionId: string) => {
      dispatch(removeSuggestion(suggestionId));
    },
    [dispatch]
  );

  /**
   * @description Clears all suggestions
   */
  const handleClearSuggestions = useCallback(() => {
    dispatch(clearSuggestions());
    requestCache.clear();
  }, [dispatch, requestCache]);

  /**
   * @description Generates multiple suggestions for different types
   */
  const generateMultipleSuggestions = useCallback(
    async (text: string, types: AiSuggestionType[], tone?: AiTone) => {
      const enabledTypes = types.filter(type => 
        preferences?.categories[type] !== false
      );

      // Generate suggestions in parallel for better performance
      const promises = enabledTypes.map(type => 
        generateSuggestion(text, type, tone)
      );

      await Promise.allSettled(promises);
    },
    [generateSuggestion, preferences]
  );

  /**
   * @description Auto-generates suggestions based on text length threshold
   */
  const maybeAutoGenerateSuggestions = useCallback(
    (text: string, tone?: AiTone) => {
      if (text.length >= autoGenerateThreshold && preferences?.enabled) {
        // Generate the most important suggestion types first
        const priorityTypes: AiSuggestionType[] = ['clarity', 'tone'];
        generateMultipleSuggestions(text, priorityTypes, tone);
      }
    },
    [generateMultipleSuggestions, autoGenerateThreshold, preferences]
  );

  /**
   * @description Get suggestions by type
   */
  const getSuggestionsByType = useCallback(
    (type: AiSuggestionType) => {
      return activeSuggestions.filter(suggestion => suggestion.type === type);
    },
    [activeSuggestions]
  );

  /**
   * @description Check if suggestions are available for text
   */
  const hasSuggestionsForText = useCallback(
    (text: string) => {
      return activeSuggestions.some(suggestion => 
        suggestion.original.includes(text.substring(0, 50))
      );
    },
    [activeSuggestions]
  );

  // Cleanup effect
  useEffect(() => {
    return () => {
      requestCache.clear();
    };
  }, [requestCache]);

  return {
    // State
    suggestions,
    activeSuggestions,
    isGenerating,
    error,
    preferences,
    
    // Actions
    generateSuggestion,
    debouncedGenerateSuggestion,
    generateMultipleSuggestions,
    maybeAutoGenerateSuggestions,
    acceptSuggestion: handleAcceptSuggestion,
    dismissSuggestion: handleDismissSuggestion,
    removeSuggestion: handleRemoveSuggestion,
    clearSuggestions: handleClearSuggestions,
    
    // Utilities
    getSuggestionsByType,
    hasSuggestionsForText,
    
    // Configuration
    isEnabled: preferences?.enabled ?? false,
    enabledCategories: preferences?.categories ?? {},
  };
} 