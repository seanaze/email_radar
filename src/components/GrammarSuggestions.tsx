/**
 * @fileoverview
 * Grammar suggestions component for displaying writing score and suggestions list
 * Inline grammar corrections are handled directly in the editor
 */

'use client';

interface Suggestion {
  type: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  before?: string;
  after?: string;
}

interface GrammarSuggestionsProps {
  originalText: string;
  correctedText?: string;
  suggestions: Suggestion[];
  onApplyCorrections?: (correctedText: string) => void;
}

/**
 * @description Displays writing score and suggestions for improvement
 * @param {GrammarSuggestionsProps} props - Component props
 * @returns {JSX.Element} Writing score panel with suggestions
 */
export default function GrammarSuggestions({ 
  originalText, 
  correctedText, 
  suggestions, 
  onApplyCorrections 
}: GrammarSuggestionsProps) {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'bg-error-100 dark:bg-error-900/20 border-error-300 dark:border-error-700 text-error-700 dark:text-error-300';
      case 'warning':
        return 'bg-warning-50 dark:bg-warning-900/20 border-warning-300 dark:border-warning-700 text-warning-700 dark:text-warning-300';
      default:
        return 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const handleApplyAll = () => {
    if (onApplyCorrections && correctedText) {
      onApplyCorrections(correctedText);
    }
  };

  return (
    <div className="card-professional p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="feature-icon w-10 h-10">
            <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Suggestions for Improvement
          </h3>
        </div>
        
        {correctedText && correctedText !== originalText && onApplyCorrections && (
          <button
            onClick={handleApplyAll}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Apply All Corrections
          </button>
        )}
      </div>

      {/* Info message about inline corrections */}
      {correctedText && correctedText !== originalText && (
        <div className="mb-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm">
              <p className="font-medium text-primary-900 dark:text-primary-100 mb-1">
                Grammar corrections are now shown inline
              </p>
              <p className="text-primary-700 dark:text-primary-300">
                Look for underlined text in the editor. Hover to see suggestions, then press space to apply.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions list */}
      {suggestions.length > 0 ? (
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg border ${getSeverityStyles(suggestion.severity)}`}
            >
              <div className="mt-0.5">{getSeverityIcon(suggestion.severity)}</div>
              <div className="flex-1">
                <p className="text-sm font-medium capitalize">{suggestion.type}</p>
                <p className="text-sm mt-0.5 opacity-90">{suggestion.message}</p>
                
                {/* Show before/after snippet if available */}
                {suggestion.before && suggestion.after && (
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 bg-white/50 dark:bg-black/20 rounded line-through opacity-75">
                      {suggestion.before}
                    </span>
                    <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span className="px-2 py-1 bg-white/50 dark:bg-black/20 rounded font-medium">
                      {suggestion.after}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-success-100 to-success-200 dark:from-success-900/30 dark:to-success-800/30 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-success-600 dark:text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Great job! No major issues found.
          </p>
        </div>
      )}
    </div>
  );
} 