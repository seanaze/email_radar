/**
 * @fileoverview AI feature types and interfaces
 * @description Defines types for AI suggestions, templates, user preferences, and enhancement features
 */

/**
 * @description AI suggestion categories matching project requirements
 */
export type AiSuggestionType = 'rewrite' | 'tone' | 'clarity' | 'engagement' | 'delivery';

/**
 * @description AI tone adjustment options
 */
export type AiTone = 'formal' | 'casual' | 'persuasive' | 'friendly' | 'professional' | 'concise';

/**
 * @description AI suggestion confidence levels
 */
export type AiConfidence = 'low' | 'medium' | 'high';

/**
 * @description Individual AI suggestion structure
 */
export interface AiSuggestion {
  id: string;
  type: AiSuggestionType;
  original: string;
  suggested: string;
  confidence: number; // 0-1 score
  confidenceLevel: AiConfidence;
  context: string;
  explanation: string;
  startOffset: number;
  endOffset: number;
  accepted?: boolean;
  dismissed?: boolean;
  createdAt: string; // ISO timestamp
}

/**
 * @description Smart email template structure
 */
export interface SmartTemplate {
  id: string;
  title: string;
  content: string;
  category: 'greeting' | 'closing' | 'follow-up' | 'request' | 'meeting' | 'response';
  context: string;
  usage_count: number;
  last_used: string; // ISO timestamp
  personalized: boolean;
}

/**
 * @description AI user preferences and learning data
 */
export interface AiPreferences {
  enabled: boolean;
  suggestion_aggressiveness: number; // 1-5 scale
  preferred_tone: AiTone;
  auto_apply_high_confidence: boolean;
  learn_from_corrections: boolean;
  categories: {
    rewrite: boolean;
    tone: boolean;
    clarity: boolean;
    engagement: boolean;
    delivery: boolean;
  };
  writing_style: {
    sentence_length: 'short' | 'medium' | 'long' | 'varied';
    formality: 'casual' | 'professional' | 'formal';
    vocabulary: 'simple' | 'moderate' | 'advanced';
  };
}

/**
 * @description AI enhancement request payload
 */
export interface AiRequest {
  text: string;
  type: AiSuggestionType;
  tone?: AiTone;
  context?: string;
  user_preferences?: Partial<AiPreferences>;
  email_context?: {
    subject?: string;
    recipient?: string;
    thread_history?: string[];
  };
}

/**
 * @description AI enhancement API response
 */
export interface AiResponse {
  suggestion: string;
  confidence: number;
  explanation: string;
  alternatives?: string[];
  metadata?: {
    model_used: string;
    processing_time: number;
    token_count: number;
  };
}

/**
 * @description Semantic search result
 */
export interface SemanticSearchResult {
  email_id: string;
  subject: string;
  snippet: string;
  relevance_score: number;
  created_at: string;
  correction_count: number;
}

/**
 * @description AI analytics and learning data
 */
export interface AiAnalytics {
  suggestions_generated: number;
  suggestions_accepted: number;
  suggestions_dismissed: number;
  acceptance_rate: number;
  most_used_types: AiSuggestionType[];
  writing_improvement_score: number;
  last_updated: string;
}

/**
 * @description Quick reply suggestion
 */
export interface QuickReply {
  id: string;
  text: string;
  context: string;
  confidence: number;
  category: 'acknowledgment' | 'question' | 'agreement' | 'scheduling' | 'closing';
}

/**
 * @description Auto-completion suggestion
 */
export interface AutoCompletion {
  id: string;
  trigger: string;
  completion: string;
  context: string;
  usage_frequency: number;
}

/**
 * @description AI state for Redux store
 */
export interface AiState {
  suggestions: AiSuggestion[];
  templates: SmartTemplate[];
  quickReplies: QuickReply[];
  autoCompletions: AutoCompletion[];
  userPreferences: AiPreferences | null;
  analytics: AiAnalytics | null;
  isGenerating: boolean;
  isLoadingTemplates: boolean;
  isLoadingPreferences: boolean;
  error: string | null;
  lastRequestId: string | null;
}

/**
 * @description AI cache entry for local storage
 */
export interface AiCacheEntry {
  id: string;
  request: AiRequest;
  response: AiResponse;
  timestamp: string;
  expiry: string;
}

/**
 * @description Template generation context
 */
export interface TemplateContext {
  email_type: 'reply' | 'forward' | 'new';
  recipient_relationship: 'colleague' | 'client' | 'manager' | 'external' | 'unknown';
  urgency: 'low' | 'medium' | 'high';
  formality: 'casual' | 'professional' | 'formal';
  purpose: 'information' | 'request' | 'update' | 'meeting' | 'follow-up';
} 