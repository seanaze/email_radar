/**
 * @fileoverview Redux slice for AI enhancement state management
 * @description Handles AI suggestions, templates, user preferences, and enhancement operations
 */

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import {
  AiState,
  AiSuggestion,
  AiRequest,
  AiResponse,
  SmartTemplate,
  AiPreferences,
  QuickReply,
  TemplateContext,
  AiAnalytics,
} from './types';

/**
 * @description Initial AI state
 */
const initialState: AiState = {
  suggestions: [],
  templates: [],
  quickReplies: [],
  autoCompletions: [],
  userPreferences: null,
  analytics: null,
  isGenerating: false,
  isLoadingTemplates: false,
  isLoadingPreferences: false,
  error: null,
  lastRequestId: null,
};

/**
 * @description Async thunk to generate AI suggestion
 * @param {AiRequest} payload - AI enhancement request
 */
export const generateAiSuggestionThunk = createAsyncThunk(
  'ai/generateSuggestion',
  async (payload: AiRequest) => {
    const response = await fetch('/api/ai/enhance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`AI suggestion failed: ${response.statusText}`);
    }

    const data: AiResponse = await response.json();
    
    // Create suggestion object
    const suggestion: AiSuggestion = {
      id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: payload.type,
      original: payload.text,
      suggested: data.suggestion,
      confidence: data.confidence,
      confidenceLevel: data.confidence > 0.8 ? 'high' : data.confidence > 0.5 ? 'medium' : 'low',
      context: payload.context || '',
      explanation: data.explanation,
      startOffset: 0, // Will be set by editor integration
      endOffset: payload.text.length,
      createdAt: new Date().toISOString(),
    };

    return suggestion;
  }
);

/**
 * @description Async thunk to load smart templates
 * @param {TemplateContext} context - Template generation context
 */
export const loadSmartTemplatesThunk = createAsyncThunk(
  'ai/loadTemplates',
  async (context: TemplateContext) => {
    const response = await fetch('/api/ai/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(context),
    });

    if (!response.ok) {
      throw new Error(`Template loading failed: ${response.statusText}`);
    }

    const templates: SmartTemplate[] = await response.json();
    return templates;
  }
);

/**
 * @description Async thunk to load user AI preferences
 * @param {string} userId - User's Firebase Auth UID
 */
export const loadAiPreferencesThunk = createAsyncThunk(
  'ai/loadPreferences',
  async (userId: string) => {
    const response = await fetch(`/api/ai/preferences?userId=${userId}`);

    if (!response.ok) {
      throw new Error(`Preferences loading failed: ${response.statusText}`);
    }

    const preferences: AiPreferences = await response.json();
    return preferences;
  }
);

/**
 * @description Async thunk to update user AI preferences
 * @param {Object} payload - Preferences update payload
 * @param {string} payload.userId - User's Firebase Auth UID
 * @param {Partial<AiPreferences>} payload.updates - Preferences to update
 */
export const updateAiPreferencesThunk = createAsyncThunk(
  'ai/updatePreferences',
  async ({ userId, updates }: { userId: string; updates: Partial<AiPreferences> }) => {
    const response = await fetch('/api/ai/preferences', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, updates }),
    });

    if (!response.ok) {
      throw new Error(`Preferences update failed: ${response.statusText}`);
    }

    return updates;
  }
);

/**
 * @description Async thunk to generate quick replies
 * @param {Object} payload - Quick reply request
 * @param {string} payload.emailContent - Email content for context
 * @param {string} payload.emailSubject - Email subject for context
 */
export const generateQuickRepliesThunk = createAsyncThunk(
  'ai/generateQuickReplies',
  async ({ emailContent, emailSubject }: { emailContent: string; emailSubject: string }) => {
    const response = await fetch('/api/ai/quick-replies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailContent, emailSubject }),
    });

    if (!response.ok) {
      throw new Error(`Quick replies generation failed: ${response.statusText}`);
    }

    const quickReplies: QuickReply[] = await response.json();
    return quickReplies;
  }
);

/**
 * @description AI Redux slice
 */
const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    /**
     * @description Accepts an AI suggestion
     */
    acceptSuggestion: (state, action: PayloadAction<string>) => {
      const suggestion = state.suggestions.find(s => s.id === action.payload);
      if (suggestion) {
        suggestion.accepted = true;
      }
    },

    /**
     * @description Dismisses an AI suggestion
     */
    dismissSuggestion: (state, action: PayloadAction<string>) => {
      const suggestion = state.suggestions.find(s => s.id === action.payload);
      if (suggestion) {
        suggestion.dismissed = true;
      }
    },

    /**
     * @description Removes a suggestion from the list
     */
    removeSuggestion: (state, action: PayloadAction<string>) => {
      state.suggestions = state.suggestions.filter(s => s.id !== action.payload);
    },

    /**
     * @description Clears all suggestions
     */
    clearSuggestions: (state) => {
      state.suggestions = [];
    },

    /**
     * @description Clears any AI errors
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * @description Sets the last request ID for tracking
     */
    setLastRequestId: (state, action: PayloadAction<string>) => {
      state.lastRequestId = action.payload;
    },

    /**
     * @description Updates analytics data locally
     */
    updateAnalytics: (state, action: PayloadAction<Partial<AiAnalytics>>) => {
      if (state.analytics) {
        state.analytics = { ...state.analytics, ...action.payload };
      }
    },

    /**
     * @description Adds a custom template
     */
    addCustomTemplate: (state, action: PayloadAction<SmartTemplate>) => {
      state.templates.push(action.payload);
    },

    /**
     * @description Updates template usage count
     */
    updateTemplateUsage: (state, action: PayloadAction<string>) => {
      const template = state.templates.find(t => t.id === action.payload);
      if (template) {
        template.usage_count += 1;
        template.last_used = new Date().toISOString();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate AI suggestion cases
      .addCase(generateAiSuggestionThunk.pending, (state) => {
        state.isGenerating = true;
        state.error = null;
      })
      .addCase(generateAiSuggestionThunk.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.suggestions.push(action.payload);
      })
      .addCase(generateAiSuggestionThunk.rejected, (state, action) => {
        state.isGenerating = false;
        state.error = action.error.message || 'Failed to generate AI suggestion';
      })

      // Load templates cases
      .addCase(loadSmartTemplatesThunk.pending, (state) => {
        state.isLoadingTemplates = true;
        state.error = null;
      })
      .addCase(loadSmartTemplatesThunk.fulfilled, (state, action) => {
        state.isLoadingTemplates = false;
        state.templates = action.payload;
      })
      .addCase(loadSmartTemplatesThunk.rejected, (state, action) => {
        state.isLoadingTemplates = false;
        state.error = action.error.message || 'Failed to load templates';
      })

      // Load preferences cases
      .addCase(loadAiPreferencesThunk.pending, (state) => {
        state.isLoadingPreferences = true;
        state.error = null;
      })
      .addCase(loadAiPreferencesThunk.fulfilled, (state, action) => {
        state.isLoadingPreferences = false;
        state.userPreferences = action.payload;
      })
      .addCase(loadAiPreferencesThunk.rejected, (state, action) => {
        state.isLoadingPreferences = false;
        state.error = action.error.message || 'Failed to load AI preferences';
      })

      // Update preferences cases
      .addCase(updateAiPreferencesThunk.fulfilled, (state, action) => {
        if (state.userPreferences) {
          state.userPreferences = { ...state.userPreferences, ...action.payload };
        }
      })
      .addCase(updateAiPreferencesThunk.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update AI preferences';
      })

      // Generate quick replies cases
      .addCase(generateQuickRepliesThunk.fulfilled, (state, action) => {
        state.quickReplies = action.payload;
      })
      .addCase(generateQuickRepliesThunk.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to generate quick replies';
      });
  },
});

export const {
  acceptSuggestion,
  dismissSuggestion,
  removeSuggestion,
  clearSuggestions,
  clearError,
  setLastRequestId,
  updateAnalytics,
  addCustomTemplate,
  updateTemplateUsage,
} = aiSlice.actions;

export default aiSlice.reducer;

/**
 * @description Selectors for AI state
 */
export const selectAiSuggestions = (state: { ai: AiState }) => state.ai.suggestions;
export const selectSmartTemplates = (state: { ai: AiState }) => state.ai.templates;
export const selectQuickReplies = (state: { ai: AiState }) => state.ai.quickReplies;
export const selectAiPreferences = (state: { ai: AiState }) => state.ai.userPreferences;
export const selectAiAnalytics = (state: { ai: AiState }) => state.ai.analytics;
export const selectIsGenerating = (state: { ai: AiState }) => state.ai.isGenerating;
export const selectIsLoadingTemplates = (state: { ai: AiState }) => state.ai.isLoadingTemplates;
export const selectIsLoadingPreferences = (state: { ai: AiState }) => state.ai.isLoadingPreferences;
export const selectAiError = (state: { ai: AiState }) => state.ai.error;
export const selectLastRequestId = (state: { ai: AiState }) => state.ai.lastRequestId;

/**
 * @description Filtered suggestions selectors
 */
export const selectActiveSuggestions = (state: { ai: AiState }) =>
  state.ai.suggestions.filter(s => !s.accepted && !s.dismissed);

export const selectAcceptedSuggestions = (state: { ai: AiState }) =>
  state.ai.suggestions.filter(s => s.accepted);

export const selectHighConfidenceSuggestions = (state: { ai: AiState }) =>
  state.ai.suggestions.filter(s => s.confidenceLevel === 'high' && !s.dismissed);

/**
 * @description Template selectors by category
 */
export const selectTemplatesByCategory = (category: SmartTemplate['category']) => 
  (state: { ai: AiState }) => state.ai.templates.filter(t => t.category === category);

export const selectMostUsedTemplates = (state: { ai: AiState }) =>
  [...state.ai.templates].sort((a, b) => b.usage_count - a.usage_count).slice(0, 5); 