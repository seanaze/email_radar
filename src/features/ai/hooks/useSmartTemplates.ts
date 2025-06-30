/**
 * @fileoverview Custom hook for smart email templates management
 * @description Provides template generation, caching, and usage tracking
 */

import { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import {
  loadSmartTemplatesThunk,
  addCustomTemplate,
  updateTemplateUsage,
  selectSmartTemplates,
  selectIsLoadingTemplates,
  selectAiError,
  selectTemplatesByCategory,
  selectMostUsedTemplates,
} from '../aiSlice';
import { selectCurrentEmail } from '../../inbox/inboxSlice';
import { selectUser } from '../../auth/authSlice';
import { SmartTemplate, TemplateContext } from '../types';

/**
 * @description Hook configuration options
 */
interface UseSmartTemplatesOptions {
  enableAutoSuggestions?: boolean;
  maxTemplates?: number;
  cacheTemplates?: boolean;
}

/**
 * @description Custom hook for smart templates management
 * @param {UseSmartTemplatesOptions} options - Hook configuration
 * @returns {Object} Smart templates state and actions
 */
export function useSmartTemplates(options: UseSmartTemplatesOptions = {}) {
  const {
    enableAutoSuggestions = true,
    maxTemplates = 10,
    cacheTemplates = true,
  } = options;

  const dispatch = useAppDispatch();
  
  // Selectors
  const templates = useAppSelector(selectSmartTemplates);
  const isLoading = useAppSelector(selectIsLoadingTemplates);
  const error = useAppSelector(selectAiError);
  const currentEmail = useAppSelector(selectCurrentEmail);
  const user = useAppSelector(selectUser);
  const mostUsedTemplates = useAppSelector(selectMostUsedTemplates);

  // Local state for template context
  const templateContext = useMemo((): TemplateContext => {
    if (!currentEmail) {
      return {
        email_type: 'new',
        recipient_relationship: 'unknown',
        urgency: 'medium',
        formality: 'professional',
        purpose: 'information',
      };
    }

    // Infer context from current email
    const isDraft = currentEmail.is_draft;
    const hasSubject = Boolean(currentEmail.subject);
    
    return {
      email_type: isDraft ? 'new' : 'reply',
      recipient_relationship: 'colleague', // Could be inferred from email content
      urgency: hasSubject && currentEmail.subject?.toLowerCase().includes('urgent') ? 'high' : 'medium',
      formality: 'professional', // Could be inferred from email content
      purpose: inferPurposeFromSubject(currentEmail.subject),
    };
  }, [currentEmail]);

  /**
   * @description Infers email purpose from subject line
   */
  function inferPurposeFromSubject(subject?: string): TemplateContext['purpose'] {
    if (!subject) return 'information';
    
    const lowerSubject = subject.toLowerCase();
    
    if (lowerSubject.includes('meeting') || lowerSubject.includes('schedule')) {
      return 'meeting';
    }
    if (lowerSubject.includes('follow') || lowerSubject.includes('update')) {
      return 'follow-up';
    }
    if (lowerSubject.includes('request') || lowerSubject.includes('need')) {
      return 'request';
    }
    
    return 'information';
  }

  /**
   * @description Loads templates for current context
   */
  const loadTemplates = useCallback(
    async (customContext?: Partial<TemplateContext>) => {
      const context = customContext ? { ...templateContext, ...customContext } : templateContext;
      
      try {
        await dispatch(loadSmartTemplatesThunk(context)).unwrap();
      } catch (error) {
        console.error('Failed to load templates:', error);
      }
    },
    [dispatch, templateContext]
  );

  /**
   * @description Creates a custom template
   */
  const createCustomTemplate = useCallback(
    (template: Omit<SmartTemplate, 'id' | 'usage_count' | 'last_used'>) => {
      const newTemplate: SmartTemplate = {
        ...template,
        id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        usage_count: 0,
        last_used: new Date().toISOString(),
      };
      
      dispatch(addCustomTemplate(newTemplate));
      return newTemplate;
    },
    [dispatch]
  );

  /**
   * @description Uses a template and tracks usage
   */
  const useTemplate = useCallback(
    (templateId: string) => {
      const template = templates.find(t => t.id === templateId);
      if (!template) return null;
      
      // Update usage count
      dispatch(updateTemplateUsage(templateId));
      
      return template;
    },
    [dispatch, templates]
  );

  /**
   * @description Gets templates by category
   */
  const getTemplatesByCategory = useCallback(
    (category: SmartTemplate['category']) => {
      return templates.filter(t => t.category === category).slice(0, maxTemplates);
    },
    [templates, maxTemplates]
  );

  /**
   * @description Gets greeting templates based on formality
   */
  const getGreetingTemplates = useCallback(() => {
    const greetings = getTemplatesByCategory('greeting');
    return greetings.filter(t => {
      const isFormMatch = templateContext.formality === 'formal' 
        ? t.content.includes('Dear') 
        : t.content.includes('Hi');
      return isFormMatch;
    });
  }, [getTemplatesByCategory, templateContext.formality]);

  /**
   * @description Gets closing templates based on formality
   */
  const getClosingTemplates = useCallback(() => {
    const closings = getTemplatesByCategory('closing');
    return closings.filter(t => {
      const isFormMatch = templateContext.formality === 'formal'
        ? t.content.includes('regards') || t.content.includes('sincerely')
        : t.content.includes('thanks') || t.content.includes('best');
      return isFormMatch;
    });
  }, [getTemplatesByCategory, templateContext.formality]);

  /**
   * @description Gets contextual templates for current purpose
   */
  const getContextualTemplates = useCallback(() => {
    const purposeTemplates = getTemplatesByCategory(templateContext.purpose as SmartTemplate['category']);
    return purposeTemplates.length > 0 ? purposeTemplates : getTemplatesByCategory('response');
  }, [getTemplatesByCategory, templateContext.purpose]);

  /**
   * @description Searches templates by text content
   */
  const searchTemplates = useCallback(
    (query: string) => {
      const lowerQuery = query.toLowerCase();
      return templates.filter(t => 
        t.title.toLowerCase().includes(lowerQuery) ||
        t.content.toLowerCase().includes(lowerQuery) ||
        t.context.toLowerCase().includes(lowerQuery)
      );
    },
    [templates]
  );

  /**
   * @description Gets template suggestions based on email content
   */
  const getTemplatesSuggestions = useCallback(
    (emailText: string) => {
      if (!enableAutoSuggestions || !emailText.trim()) return [];
      
      const lowerText = emailText.toLowerCase();
      const suggestions: SmartTemplate[] = [];
      
      // Suggest greetings if email is short
      if (emailText.length < 50) {
        suggestions.push(...getGreetingTemplates().slice(0, 2));
      }
      
      // Suggest based on keywords
      if (lowerText.includes('meeting') || lowerText.includes('schedule')) {
        suggestions.push(...getTemplatesByCategory('meeting').slice(0, 2));
      }
      
      if (lowerText.includes('follow') || lowerText.includes('update')) {
        suggestions.push(...getTemplatesByCategory('follow-up').slice(0, 2));
      }
      
      if (lowerText.includes('request') || lowerText.includes('need')) {
        suggestions.push(...getTemplatesByCategory('request').slice(0, 2));
      }
      
      // Always suggest closing if email is longer
      if (emailText.length > 100) {
        suggestions.push(...getClosingTemplates().slice(0, 1));
      }
      
      // Remove duplicates and limit results
      const uniqueSuggestions = suggestions.filter((template, index, arr) => 
        arr.findIndex(t => t.id === template.id) === index
      );
      
      return uniqueSuggestions.slice(0, 3);
    },
    [enableAutoSuggestions, getGreetingTemplates, getClosingTemplates, getTemplatesByCategory]
  );

  /**
   * @description Auto-loads templates when context changes
   */
  useEffect(() => {
    if (enableAutoSuggestions && templates.length === 0) {
      loadTemplates();
    }
  }, [loadTemplates, enableAutoSuggestions, templates.length]);

  return {
    // State
    templates,
    isLoading,
    error,
    templateContext,
    mostUsedTemplates,
    
    // Actions
    loadTemplates,
    createCustomTemplate,
    useTemplate,
    
    // Getters
    getTemplatesByCategory,
    getGreetingTemplates,
    getClosingTemplates,
    getContextualTemplates,
    searchTemplates,
    getTemplatesSuggestions,
    
    // Configuration
    isEnabled: enableAutoSuggestions,
    maxTemplates,
  };
} 