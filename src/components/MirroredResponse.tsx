/**
 * @fileoverview
 * Mirrored response component for displaying AI-generated replies
 */

'use client';

import { useState } from 'react';

interface MirroredResponseProps {
  response: string;
}

export default function MirroredResponse({ response }: MirroredResponseProps) {
  const [copied, setCopied] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('default');

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const responseStyles = [
    { id: 'default', label: 'Default', icon: '✏️' },
    { id: 'formal', label: 'More Formal', icon: '👔' },
    { id: 'friendly', label: 'More Friendly', icon: '😊' },
    { id: 'concise', label: 'More Concise', icon: '📝' },
    { id: 'detailed', label: 'More Detailed', icon: '📋' },
  ];

  return (
    <div className="card-professional p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="feature-icon w-10 h-10">
            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            AI-Generated Response
          </h3>
        </div>
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

      {/* Style selector */}
      <div className="mb-4">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
          Adjust response style:
        </p>
        <div className="flex flex-wrap gap-2">
          {responseStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                selectedStyle === style.id
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{style.icon}</span>
              <span>{style.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Response display */}
      <div className="relative">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          {/* Quote decoration */}
          <svg className="absolute top-4 left-4 w-8 h-8 text-purple-300 dark:text-purple-700 opacity-50" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          
          <p className="relative z-10 whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
            {response}
          </p>

          {/* Signature */}
          <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-700">
            <p className="text-sm text-purple-600 dark:text-purple-400">
              Generated with your writing style in mind
            </p>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-xl opacity-20"></div>
      </div>

      {/* Quick actions */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          <button className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Regenerate
          </button>
          <button className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          AI confidence: 94%
        </div>
      </div>
    </div>
  );
} 