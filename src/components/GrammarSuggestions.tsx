/**
 * @fileoverview Grammar suggestions display component
 * @description Shows grammar suggestions with categorization and accept/reject controls
 */

'use client';

import { useState } from 'react';
import { Check, X, AlertCircle, BookOpen, Lightbulb, Sparkles } from 'lucide-react';
import { GrammarSuggestion } from '../utils/grammarChecker';

/**
 * @description Props for GrammarSuggestions component
 */
interface GrammarSuggestionsProps {
  suggestions: GrammarSuggestion[];
  onAccept: (suggestionId: string) => void;
  onDismiss: (suggestionId: string) => void;
  className?: string;
}

/**
 * @description Category configuration for different suggestion types
 */
const CATEGORY_CONFIG = {
  spelling: {
    icon: AlertCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    label: 'Spelling',
  },
  capitalization: {
    icon: BookOpen,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
    label: 'Capitalization',
  },
  punctuation: {
    icon: AlertCircle,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    label: 'Punctuation',
  },
  spacing: {
    icon: BookOpen,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    label: 'Spacing',
  },
  repeated_word: {
    icon: Lightbulb,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    label: 'Repeated Words',
  },
  default: {
    icon: Sparkles,
    color: 'text-slate-500',
    bgColor: 'bg-slate-50 dark:bg-slate-900/20',
    borderColor: 'border-slate-200 dark:border-slate-800',
    label: 'Grammar',
  },
};

/**
 * @description Individual suggestion item component
 */
interface SuggestionItemProps {
  suggestion: GrammarSuggestion;
  onAccept: (id: string) => void;
  onDismiss: (id: string) => void;
}

function SuggestionItem({ suggestion, onAccept, onDismiss }: SuggestionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = CATEGORY_CONFIG[suggestion.category as keyof typeof CATEGORY_CONFIG] || CATEGORY_CONFIG.default;
  const Icon = config.icon;

  return (
    <div className={`glass-surface rounded-lg p-4 border ${config.borderColor} ${config.bgColor}`}>
      <div className="flex items-start gap-3">
        <div className={`p-1 rounded ${config.color}`}>
          <Icon className="h-4 w-4" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-medium ${config.color} uppercase tracking-wide`}>
              {config.label}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {Math.round(suggestion.confidence * 100)}% confidence
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-slate-600 dark:text-slate-400">Change "</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {suggestion.original_text}
              </span>
              <span className="text-slate-600 dark:text-slate-400">" to "</span>
              <span className="font-medium text-green-700 dark:text-green-300">
                {suggestion.suggested_text}
              </span>
              <span className="text-slate-600 dark:text-slate-400">"</span>
            </div>
            
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {suggestion.explanation}
            </p>
            
            {isExpanded && suggestion.alternatives && suggestion.alternatives.length > 1 && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Other suggestions:
                </p>
                                 <div className="flex flex-wrap gap-1">
                   {suggestion.alternatives.slice(1).map((alt: string, index: number) => (
                     <button
                       key={index}
                       onClick={() => {
                         // Could implement alternative selection
                         console.log('Alternative selected:', alt);
                       }}
                       className="px-2 py-1 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                     >
                       {alt}
                     </button>
                   ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => onAccept(suggestion.id)}
            className="p-1.5 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors"
            aria-label="Accept suggestion"
          >
            <Check className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onDismiss(suggestion.id)}
            className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
            aria-label="Dismiss suggestion"
          >
            <X className="h-4 w-4" />
          </button>
          
          {suggestion.alternatives && suggestion.alternatives.length > 1 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded transition-colors"
              aria-label={isExpanded ? "Show less" : "Show more"}
            >
              <svg 
                className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * @description Grammar suggestions panel component
 * @param {GrammarSuggestionsProps} props - Component props
 * @returns {JSX.Element} Grammar suggestions display
 */
export default function GrammarSuggestions({
  suggestions,
  onAccept,
  onDismiss,
  className = ''
}: GrammarSuggestionsProps): JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Group suggestions by type
  const suggestionsByType = suggestions.reduce((acc, suggestion) => {
    const type = suggestion.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(suggestion);
    return acc;
  }, {} as Record<string, GrammarSuggestion[]>);

  // Filter suggestions based on selected category
  const filteredSuggestions = selectedCategory === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.type === selectedCategory);

  // Get unique categories
  const categories = ['all', ...Object.keys(suggestionsByType)];

  if (suggestions.length === 0) {
    return (
      <div className={`glass-surface rounded-lg p-6 text-center ${className}`}>
        <Check className="h-8 w-8 text-green-500 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
          No issues found
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Your text looks good! Keep writing.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Grammar Suggestions
        </h3>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {filteredSuggestions.length} suggestion{filteredSuggestions.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-500 text-white'
                  : 'glass-surface text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80'
              }`}
            >
              {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
              {category !== 'all' && suggestionsByType[category] && (
                <span className="ml-1 text-xs opacity-75">
                  {suggestionsByType[category].length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Suggestions List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredSuggestions.map((suggestion) => (
          <SuggestionItem
            key={suggestion.id}
            suggestion={suggestion}
            onAccept={onAccept}
            onDismiss={onDismiss}
          />
        ))}
      </div>

      {/* Actions */}
      {filteredSuggestions.length > 1 && (
        <div className="flex gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={() => filteredSuggestions.forEach(s => onAccept(s.id))}
            className="btn-primary text-sm flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Accept All
          </button>
          <button
            onClick={() => filteredSuggestions.forEach(s => onDismiss(s.id))}
            className="btn-secondary text-sm flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Dismiss All
          </button>
        </div>
      )}
    </div>
  );
} 