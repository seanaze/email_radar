/**
 * @fileoverview AI Suggestions Panel component
 * @description Displays AI suggestions with accept/reject controls and categorized grouping
 */

import React, { useState } from 'react';
import { Check, X, Sparkles, Lightbulb } from 'lucide-react';
import { useAiSuggestions } from '../hooks/useAiSuggestions';
import { AiSuggestion, AiSuggestionType } from '../types';

/**
 * @description Component props interface
 */
interface AiSuggestionsPanelProps {
  className?: string;
  compact?: boolean;
  showCategories?: boolean;
  maxSuggestions?: number;
}

/**
 * @description Category icons and colors mapping
 */
const CATEGORY_CONFIG: Record<AiSuggestionType, { icon: React.ElementType; color: string; label: string }> = {
  rewrite: { icon: Sparkles, color: 'text-indigo-500', label: 'Rewrite' },
  tone: { icon: Lightbulb, color: 'text-purple-500', label: 'Tone' },
  clarity: { icon: Check, color: 'text-blue-500', label: 'Clarity' },
  engagement: { icon: Sparkles, color: 'text-green-500', label: 'Engagement' },
  delivery: { icon: Lightbulb, color: 'text-orange-500', label: 'Delivery' },
};

/**
 * @description Individual suggestion item component
 */
interface SuggestionItemProps {
  suggestion: AiSuggestion;
  onAccept: (id: string) => void;
  onDismiss: (id: string) => void;
  compact?: boolean;
}

function SuggestionItem({ suggestion, onAccept, onDismiss, compact = false }: SuggestionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = CATEGORY_CONFIG[suggestion.type];
  const IconComponent = config.icon;

  const confidenceColor = {
    high: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    low: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  }[suggestion.confidenceLevel];

  return (
    <div className="group relative">
      {/* Suggestion Card */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-400/20 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <IconComponent className={`w-4 h-4 ${config.color}`} />
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {config.label}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${confidenceColor}`}>
              {Math.round(suggestion.confidence * 100)}%
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onAccept(suggestion.id)}
              className="p-1.5 rounded-md bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/40 text-green-600 dark:text-green-400 transition-colors duration-200"
              title="Accept suggestion"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDismiss(suggestion.id)}
              className="p-1.5 rounded-md bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 transition-colors duration-200"
              title="Dismiss suggestion"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Preview */}
        <div className="mt-3">
          {compact ? (
            <div className="text-sm text-slate-600 dark:text-slate-400 truncate">
              {suggestion.suggested}
            </div>
          ) : (
            <>
              {/* Original Text */}
              <div className="text-sm text-slate-500 dark:text-slate-500 mb-2">
                <span className="font-medium">Original:</span>
                <div className="mt-1 p-2 bg-slate-100/50 dark:bg-slate-700/50 rounded border-l-2 border-slate-300 dark:border-slate-600">
                  {suggestion.original}
                </div>
              </div>

              {/* Suggested Text */}
              <div className="text-sm text-slate-600 dark:text-slate-400">
                <span className="font-medium">Suggested:</span>
                <div className={`mt-1 p-2 bg-gradient-to-r from-${config.color.split('-')[1]}-50/50 to-transparent dark:from-${config.color.split('-')[1]}-900/20 dark:to-transparent rounded border-l-2 ${config.color.replace('text-', 'border-')}`}>
                  {suggestion.suggested}
                </div>
              </div>

              {/* Explanation */}
              {suggestion.explanation && (
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-200"
                  >
                    {isExpanded ? 'Hide' : 'Show'} explanation
                  </button>
                  {isExpanded && (
                    <div className="mt-1 p-2 bg-slate-50/50 dark:bg-slate-800/50 rounded text-xs">
                      {suggestion.explanation}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * @description Main AI Suggestions Panel component
 */
export function AiSuggestionsPanel({
  className = '',
  compact = false,
  showCategories = true,
  maxSuggestions = 5,
}: AiSuggestionsPanelProps) {
  const {
    activeSuggestions,
    isGenerating,
    error,
    acceptSuggestion,
    dismissSuggestion,
    clearSuggestions,
    getSuggestionsByType,
    isEnabled,
  } = useAiSuggestions();

  const [selectedCategory, setSelectedCategory] = useState<AiSuggestionType | 'all'>('all');

  // Filter suggestions based on selected category
  const filteredSuggestions = selectedCategory === 'all' 
    ? activeSuggestions.slice(0, maxSuggestions)
    : getSuggestionsByType(selectedCategory).slice(0, maxSuggestions);

  // Group suggestions by type for category view
  const suggestionsByType = showCategories 
    ? Object.keys(CATEGORY_CONFIG).reduce((acc, type) => {
        const typedType = type as AiSuggestionType;
        const suggestions = getSuggestionsByType(typedType);
        if (suggestions.length > 0) {
          acc[typedType] = suggestions;
        }
        return acc;
      }, {} as Record<AiSuggestionType, AiSuggestion[]>)
    : {};

  if (!isEnabled) {
    return (
      <div className={`bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-400/20 rounded-lg p-4 shadow-lg ${className}`}>
        <div className="text-center text-slate-500 dark:text-slate-400">
          <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">AI suggestions are disabled</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-400/20 rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-400/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              AI Suggestions
            </h3>
            {isGenerating && (
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            )}
          </div>

          {activeSuggestions.length > 0 && (
            <button
              onClick={clearSuggestions}
              className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors duration-200"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Category Filter */}
        {showCategories && activeSuggestions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-400'
              }`}
            >
              All ({activeSuggestions.length})
            </button>
                         {Object.entries(suggestionsByType).map(([type, suggestions]) => {
               const config = CATEGORY_CONFIG[type as AiSuggestionType];
               const typedSuggestions = suggestions as AiSuggestion[];
              return (
                <button
                  key={type}
                  onClick={() => setSelectedCategory(type as AiSuggestionType)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                    selectedCategory === type
                      ? `bg-${config.color.split('-')[1]}-500 text-white`
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-400'
                  }`}
                                 >
                   {config.label} ({typedSuggestions.length})
                 </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Error State */}
        {error && (
          <div className="mb-4 p-3 bg-red-50/50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isGenerating && activeSuggestions.length === 0 && (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Generating AI suggestions...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isGenerating && activeSuggestions.length === 0 && !error && (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
              No suggestions yet
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Start typing to get AI-powered writing suggestions
            </p>
          </div>
        )}

        {/* Suggestions List */}
        {filteredSuggestions.length > 0 && (
          <div className="space-y-3">
            {filteredSuggestions.map((suggestion) => (
              <SuggestionItem
                key={suggestion.id}
                suggestion={suggestion}
                onAccept={acceptSuggestion}
                onDismiss={dismissSuggestion}
                compact={compact}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 