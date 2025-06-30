'use client';

import { useState, useEffect } from 'react';
import { checkGrammar, type GrammarError } from '@/utils/grammarChecker';

interface GrammarPanelProps {
  content: string;
}

export default function GrammarPanel({ content }: GrammarPanelProps) {
  const [errors, setErrors] = useState<GrammarError[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!content.trim()) {
      setErrors([]);
      return;
    }

    const checkContent = async () => {
      setIsChecking(true);
      try {
        const grammarErrors = await checkGrammar(content);
        setErrors(grammarErrors);
      } catch (error) {
        console.error('Grammar check failed:', error);
      } finally {
        setIsChecking(false);
      }
    };

    const debounceTimer = setTimeout(checkContent, 500);
    return () => clearTimeout(debounceTimer);
  }, [content]);

  if (!content.trim()) {
    return (
      <div className="text-center py-8 text-slate-400 dark:text-slate-500">
        Start typing to see grammar suggestions
      </div>
    );
  }

  if (isChecking) {
    return (
      <div className="flex items-center justify-center py-8">
        <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (errors.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-2 text-green-600 dark:text-green-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">No grammar issues found!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {errors.map((error, index) => (
        <div 
          key={index} 
          className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer"
        >
          <div className="flex items-start gap-3">
            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
              error.type === 'spelling' ? 'bg-red-500' : 
              error.type === 'grammar' ? 'bg-blue-500' : 
              'bg-yellow-500'
            }`} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {error.type === 'spelling' ? 'Spelling' : 
                   error.type === 'grammar' ? 'Grammar' : 
                   'Punctuation'}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                "<span className="line-through text-red-600 dark:text-red-400">{error.text}</span>" 
                {error.suggestions.length > 0 && (
                  <span> → "<span className="text-green-600 dark:text-green-400">{error.suggestions[0]}</span>"</span>
                )}
              </p>
              {error.message && (
                <p className="text-xs text-slate-500 dark:text-slate-500">{error.message}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}