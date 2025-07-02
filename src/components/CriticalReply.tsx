/**
 * @fileoverview
 * Component to display critical reply analysis based on receiver perspective
 */

'use client';

import { useState } from 'react';

interface CriticalReplyProps {
  receiverSummary: string;
  criticalAnalysis: string[];
  suggestedReply: string;
  confidencePct: number;
  originalText: string;
}

/**
 * @description Displays critical analysis and suggested reply
 * @param {CriticalReplyProps} props - Component props
 * @returns {JSX.Element} Critical reply UI
 */
export default function CriticalReply({
  receiverSummary,
  criticalAnalysis,
  suggestedReply,
  confidencePct,
  originalText
}: CriticalReplyProps) {
  const [copied, setCopied] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(suggestedReply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getConfidenceColor = (pct: number) => {
    if (pct >= 80) return 'text-success-600 dark:text-success-400';
    if (pct >= 60) return 'text-warning-600 dark:text-warning-400';
    return 'text-error-600 dark:text-error-400';
  };

  return (
    <div className="space-y-4">
      {/* Suggested Reply - Positioned Above Original */}
      <div className="card-professional p-6 border-2 border-primary-200 dark:border-primary-800">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
              Critical Reply
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {receiverSummary}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-slate-500 dark:text-slate-500">Confidence</p>
              <p className={`text-lg font-bold ${getConfidenceColor(confidencePct)}`}>
                {confidencePct}%
              </p>
            </div>
            <button
              onClick={copyToClipboard}
              className="btn-secondary !px-3 !py-2 text-sm"
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

        {/* Suggested Reply Text */}
        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 mb-4">
          <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            {suggestedReply}
          </p>
        </div>

        {/* Critical Analysis Toggle */}
        <button
          onClick={() => setShowAnalysis(!showAnalysis)}
          className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
        >
          <svg 
            className={`w-4 h-4 transition-transform ${showAnalysis ? 'rotate-90' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Why this reply?
        </button>

        {/* Critical Analysis Details */}
        {showAnalysis && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 animate-slideDown">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Critical Analysis:
            </h4>
            <ul className="space-y-2">
              {criticalAnalysis.map((point, index) => (
                <li key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                  <span className="text-primary-500 mt-0.5">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Original Text Display */}
      <div className="card-professional p-6">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Your Original Message:
        </h4>
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
            {originalText}
          </p>
        </div>
      </div>

      {/* Warning for unclear emails */}
      {criticalAnalysis.some(point => point.toLowerCase().includes('unclear') || point.toLowerCase().includes('missing')) && (
        <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-warning-600 dark:text-warning-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="text-sm">
              <p className="font-medium text-warning-900 dark:text-warning-100 mb-1">
                Email may be unclear
              </p>
              <p className="text-warning-700 dark:text-warning-300">
                Review the analysis above to improve clarity before sending.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 