/**
 * @fileoverview
 * Grammar suggestions component for displaying corrected text with visual diff
 */

'use client';

import { useState } from 'react';
import TextDiff from './TextDiff';

interface GrammarSuggestionsProps {
  originalText: string;
  correctedText?: string;
  suggestions: Array<{
    type: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
  }>;
  onApplyCorrections?: (correctedText: string) => void;
}

export default function GrammarSuggestions({ originalText, correctedText, suggestions, onApplyCorrections }: GrammarSuggestionsProps) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'inline' | 'side-by-side'>('inline');
  const [showDiff, setShowDiff] = useState(true);
  const [isApplied, setIsApplied] = useState(false);

  const displayText = correctedText || originalText;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(displayText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleApply = () => {
    if (onApplyCorrections && correctedText) {
      onApplyCorrections(correctedText);
      setIsApplied(true);
      setTimeout(() => setIsApplied(false), 2000);
    }
  };

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

  return (
    <div className="card-professional p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="feature-icon w-10 h-10">
            <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Corrected Text
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          {correctedText && correctedText !== originalText && (
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setShowDiff(!showDiff)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  showDiff 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Show Diff
              </button>
              <button
                onClick={() => setShowDiff(false)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  !showDiff 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Final Text
              </button>
            </div>
          )}
          
          {/* View mode selector for diff */}
          {showDiff && correctedText && correctedText !== originalText && (
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('inline')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'inline' 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Inline
              </button>
              <button
                onClick={() => setViewMode('side-by-side')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'side-by-side' 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Side by Side
              </button>
            </div>
          )}
          
          <button
            onClick={copyToClipboard}
            className="btn-secondary flex items-center gap-2 !px-4 !py-2 text-sm"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Text display */}
      {showDiff && correctedText && correctedText !== originalText ? (
        <TextDiff 
          original={originalText} 
          corrected={correctedText} 
          viewMode={viewMode} 
        />
      ) : (
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 mb-4 border border-slate-200 dark:border-slate-700">
          <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
            {displayText}
          </p>
        </div>
      )}

      {/* Suggestions list */}
      {suggestions.length > 0 && (
        <div className="space-y-2 mt-4">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
            Suggestions for improvement:
          </p>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg border ${getSeverityStyles(suggestion.severity)}`}
            >
              <div className="mt-0.5">{getSeverityIcon(suggestion.severity)}</div>
              <div className="flex-1">
                <p className="text-sm font-medium capitalize">{suggestion.type}</p>
                <p className="text-sm mt-0.5 opacity-90">{suggestion.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statistics */}
      {correctedText && correctedText !== originalText && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{Math.abs(correctedText.length - originalText.length)} characters changed</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span>Grammar score improved</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handleApply}
          disabled={!onApplyCorrections || originalText === correctedText}
          className={`btn-primary flex items-center gap-2 ${
            (!onApplyCorrections || originalText === correctedText) ? 'btn-disabled' : ''
          }`}
        >
          {isApplied ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Applied!
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Apply Corrections
            </>
          )}
        </button>
        
        <button
          onClick={copyToClipboard}
          className="btn-secondary flex items-center gap-2"
        >
          {copied ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Corrected Text
            </>
          )}
        </button>

        {/* Info about undo */}
        {onApplyCorrections && (
          <p className="text-sm text-slate-500 dark:text-slate-500 ml-auto">
            Use Ctrl+Z to undo changes
          </p>
        )}
      </div>
    </div>
  );
} 