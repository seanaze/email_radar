/**
 * @fileoverview
 * Editor page for Email Radar - text analysis interface.
 * Provides text input area and displays analysis results.
 */

'use client';

import { useState, useRef } from 'react';
import EmailEditor, { EmailEditorRef } from '@/components/EmailEditor';
import GrammarSuggestions from '@/components/GrammarSuggestions';
import ToneBadge from '@/components/ToneBadge';
import MirroredResponse from '@/components/MirroredResponse';

export default function EditorPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [originalText, setOriginalText] = useState<string>('');
  const [results, setResults] = useState<{
    correctedText?: string;
    toneLabel?: string;
    toneColor?: string;
    toneDescription?: string;
    mirroredReply?: string;
    score?: number;
    suggestions?: Array<{
      type: string;
      message: string;
      severity: 'error' | 'warning' | 'info';
    }>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<EmailEditorRef | null>(null);

  const handleAnalyze = async (text: string) => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    // Store the original text for diff display
    setOriginalText(text);
    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/analyzeText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      // Add mock data for demo purposes
      setResults({
        ...data,
        score: Math.floor(Math.random() * 20) + 80,
        suggestions: [
          { type: 'grammar', message: 'Consider using active voice', severity: 'warning' },
          { type: 'clarity', message: 'This sentence could be clearer', severity: 'info' },
        ]
      });
    } catch (err) {
      setError('Failed to analyze text. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyCorrections = (correctedText: string) => {
    // Update the editor with the corrected text
    if (editorRef.current) {
      editorRef.current.updateText(correctedText);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background with gradient and noise */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 bg-noise opacity-[0.02]"></div>
      </div>

      {/* Floating orbs for visual interest */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary-300/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-300/20 rounded-full blur-3xl animate-float animation-delay-2000"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 text-center animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-3">
              Email Analyzer
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Transform your writing with AI-powered insights
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Editor Section */}
            <div className="animate-slideIn">
              <div className="card-professional p-6 lg:p-8 h-full">
                <EmailEditor 
                  ref={editorRef}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                />
                
                {/* Error Message */}
                {error && (
                  <div className="mt-4 animate-slideUp">
                    <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-error-600 dark:text-error-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-error-700 dark:text-error-300">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {/* Loading State */}
              {isAnalyzing && (
                <div className="card-professional p-8 animate-scaleIn">
                  <div className="flex flex-col items-center justify-center h-96">
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-primary-200 dark:border-primary-800 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-primary-500 rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 animate-pulse-soft">
                      Analyzing your text...
                    </p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">
                      This usually takes 2-3 seconds
                    </p>
                  </div>
                </div>
              )}

              {/* Results Display */}
              {results && !isAnalyzing && (
                <>
                  {/* Writing Score Card */}
                  <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
                    <div className="card-professional p-6 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200 dark:border-primary-800">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                            Writing Score
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            Overall quality assessment
                          </p>
                        </div>
                        <div className="text-5xl font-bold text-primary-600 dark:text-primary-400">
                          {results.score || 92}
                        </div>
                      </div>
                      
                      {/* Progress bars */}
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600 dark:text-slate-400">Clarity</span>
                            <span className="text-slate-900 dark:text-white font-medium">95%</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-bar-fill" style={{ width: '95%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600 dark:text-slate-400">Engagement</span>
                            <span className="text-slate-900 dark:text-white font-medium">88%</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-bar-fill" style={{ width: '88%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600 dark:text-slate-400">Grammar</span>
                            <span className="text-slate-900 dark:text-white font-medium">92%</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-bar-fill" style={{ width: '92%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grammar Corrections */}
                  {results.correctedText && (
                    <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
                      <GrammarSuggestions
                        originalText={originalText}
                        correctedText={results.correctedText}
                        suggestions={results.suggestions || []}
                        onApplyCorrections={handleApplyCorrections}
                      />
                    </div>
                  )}

                  {/* Tone Analysis */}
                  {results.toneLabel && (
                    <div className="animate-slideUp" style={{ animationDelay: '0.3s' }}>
                      <ToneBadge
                        tone={results.toneLabel}
                        color={results.toneColor}
                        description={results.toneDescription}
                      />
                    </div>
                  )}

                  {/* Mirrored Reply */}
                  {results.mirroredReply && (
                    <div className="animate-slideUp" style={{ animationDelay: '0.4s' }}>
                      <MirroredResponse
                        response={results.mirroredReply}
                      />
                    </div>
                  )}
                </>
              )}

              {/* Empty State */}
              {!isAnalyzing && !results && (
                <div className="card-professional p-12 text-center animate-fadeIn">
                  <div className="mx-auto w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Ready to analyze
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                    Type or paste your text on the left, then click "Analyze Text" to see insights
                  </p>
                  
                  {/* Sample templates */}
                  <div className="mt-8">
                    <p className="text-sm text-slate-500 dark:text-slate-500 mb-3">Try a sample:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <button className="px-3 py-1.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        Business Email
                      </button>
                      <button className="px-3 py-1.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        Cover Letter
                      </button>
                      <button className="px-3 py-1.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        Thank You Note
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}