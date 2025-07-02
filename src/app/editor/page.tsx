/**
 * @fileoverview
 * Editor page for Email Radar - text analysis interface.
 * Provides text input area and displays analysis results.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import EmailEditor, { EmailEditorRef } from '@/components/EmailEditor';
import GrammarSuggestions from '@/components/GrammarSuggestions';
import ToneBadge from '@/components/ToneBadge';
import MirroredResponse from '@/components/MirroredResponse';
import KeyboardShortcuts from '@/components/KeyboardShortcuts';
import ReceiverModal, { type ReceiverProfile } from '@/components/ReceiverModal';
import CriticalReply from '@/components/CriticalReply';
import type { GrammarSuggestion } from '@/utils/grammarExtension';

const DRAFT_STORAGE_KEY = 'email-radar-draft';

// Sample templates
const SAMPLE_TEMPLATES = {
  businessEmail: `Dear [Recipient Name],

I hope this email finds you well. I wanted to reach out regarding our upcoming project deadline.

As we discussed in our last meeting, the deliverables for Phase 1 are due by the end of this month. I wanted to check in on the progress and see if there are any blockers or concerns we should address.

Please let me know if you need any additional resources or support from my end. I'm happy to schedule a call this week to discuss further.

Best regards,
[Your Name]`,
  
  coverLetter: `Dear Hiring Manager,

I am writing to express my strong interest in the [Position Title] role at [Company Name]. With my background in [relevant field] and passion for [relevant industry], I believe I would be a valuable addition to your team.

In my current role at [Current Company], I have successfully [key achievement]. This experience has prepared me well for the challenges and opportunities this position presents.

I am particularly drawn to [Company Name] because of [specific reason related to company]. I am excited about the possibility of contributing to [specific company goal or project].

Thank you for considering my application. I look forward to discussing how my skills and experience align with your needs.

Sincerely,
[Your Name]`,
  
  thankYouNote: `Dear [Name],

I wanted to take a moment to express my sincere gratitude for [specific reason].

Your [specific action/support/guidance] has made a significant impact on [specific outcome or feeling]. I truly appreciate the time and effort you put into [specific detail].

Thank you again for your kindness and support. It means more than you know.

Warm regards,
[Your Name]`
};

export default function EditorPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [originalText, setOriginalText] = useState<string>('');
  const [grammarSuggestions, setGrammarSuggestions] = useState<GrammarSuggestion[]>([]);
  const [showReceiverModal, setShowReceiverModal] = useState(false);
  const [criticalReply, setCriticalReply] = useState<{
    receiverSummary: string;
    criticalAnalysis: string[];
    suggestedReply: string;
    confidencePct: number;
  } | null>(null);
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
  const pendingTextRef = useRef<string>('');

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft && editorRef.current) {
      // We need to wait for editor to be ready
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.updateText(savedDraft);
        }
      }, 100);
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to analyze
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !isAnalyzing) {
        e.preventDefault();
        const editor = document.querySelector('.ProseMirror') as any;
        if (editor && editor.innerText?.trim()) {
          handleAnalyze(editor.innerText);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnalyzing]);

  const handleAnalyze = async (text: string) => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    // Store text and show receiver modal
    pendingTextRef.current = text;
    setShowReceiverModal(true);
  };

  const handleReceiverProfileSubmit = async (profile: ReceiverProfile) => {
    const text = pendingTextRef.current;
    
    // Store the original text for diff display
    setOriginalText(text);
    
    // Save draft to localStorage
    localStorage.setItem(DRAFT_STORAGE_KEY, text);
    
    setIsAnalyzing(true);
    setError(null);
    setResults(null);
    setGrammarSuggestions([]);
    setCriticalReply(null);

    try {
      // Parallel API calls for analysis and critical reply
      const [analysisResponse, criticalResponse] = await Promise.all([
        fetch('/api/analyzeText', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        }),
        fetch('/api/critical-reply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            text,
            relationship: profile.relationship,
            attitude: profile.attitude,
            formality: profile.formality 
          }),
        })
      ]);

      if (!analysisResponse.ok || !criticalResponse.ok) {
        throw new Error('Analysis failed');
      }

      const analysisData = await analysisResponse.json();
      const criticalData = await criticalResponse.json();
      
      // Set critical reply
      setCriticalReply(criticalData);
      
      // Convert corrected text to inline grammar suggestions
      if (analysisData.correctedText && analysisData.correctedText !== text) {
        const suggestions = extractGrammarSuggestions(text, analysisData.correctedText);
        setGrammarSuggestions(suggestions);
        
        // Apply suggestions to editor
        if (editorRef.current) {
          editorRef.current.applyGrammarSuggestions(suggestions);
        }
      }
      
      // Add mock data for demo purposes
      setResults({
        ...analysisData,
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

  /**
   * @description Extract grammar suggestions from original and corrected text
   * @param {string} original - Original text
   * @param {string} corrected - Corrected text
   * @returns {GrammarSuggestion[]} Array of grammar suggestions
   */
  const extractGrammarSuggestions = (original: string, corrected: string): GrammarSuggestion[] => {
    const suggestions: GrammarSuggestion[] = [];
    
    // Simple word-by-word comparison (can be improved with a proper diff algorithm)
    const originalWords = original.split(/\s+/);
    const correctedWords = corrected.split(/\s+/);
    
    let position = 0;
    for (let i = 0; i < Math.max(originalWords.length, correctedWords.length); i++) {
      const origWord = originalWords[i] || '';
      const corrWord = correctedWords[i] || '';
      
      if (origWord !== corrWord && origWord) {
        const from = original.indexOf(origWord, position);
        const to = from + origWord.length;
        
        suggestions.push({
          from,
          to,
          replacement: corrWord,
          message: `Change "${origWord}" to "${corrWord}"`,
          type: 'grammar'
        });
        
        position = to;
      } else {
        position += origWord.length + 1;
      }
    }
    
    return suggestions;
  };

  const handleApplyCorrections = (correctedText: string) => {
    // Update the editor with the corrected text
    if (editorRef.current) {
      editorRef.current.updateText(correctedText);
      setGrammarSuggestions([]);
    }
  };

  const handleTemplateSelect = (templateKey: keyof typeof SAMPLE_TEMPLATES) => {
    const template = SAMPLE_TEMPLATES[templateKey];
    if (editorRef.current) {
      editorRef.current.updateText(template);
      // Also save to localStorage
      localStorage.setItem(DRAFT_STORAGE_KEY, template);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background with gradient and noise */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 bg-noise opacity-[0.02]"></div>
      </div>

      {/* Keyboard shortcuts help */}
      <KeyboardShortcuts />

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
                  grammarSuggestions={grammarSuggestions}
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
              {/* Receiver Modal */}
              <ReceiverModal
                isOpen={showReceiverModal}
                onClose={() => setShowReceiverModal(false)}
                onSubmit={handleReceiverProfileSubmit}
              />

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
                  </div>
                </div>
              )}

              {/* Results Display */}
              {results && !isAnalyzing && (
                <>
                  {/* Critical Reply - Show First */}
                  {criticalReply && (
                    <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
                      <CriticalReply
                        receiverSummary={criticalReply.receiverSummary}
                        criticalAnalysis={criticalReply.criticalAnalysis}
                        suggestedReply={criticalReply.suggestedReply}
                        confidencePct={criticalReply.confidencePct}
                        originalText={originalText}
                      />
                    </div>
                  )}

                  {/* Writing Score Card */}
                  <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
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
                    <div className="animate-slideUp" style={{ animationDelay: '0.3s' }}>
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
                    <div className="animate-slideUp" style={{ animationDelay: '0.4s' }}>
                      <ToneBadge
                        tone={results.toneLabel}
                        color={results.toneColor}
                        description={results.toneDescription}
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
                      <button 
                        onClick={() => handleTemplateSelect('businessEmail')}
                        className="px-3 py-1.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        Business Email
                      </button>
                      <button 
                        onClick={() => handleTemplateSelect('coverLetter')}
                        className="px-3 py-1.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        Cover Letter
                      </button>
                      <button 
                        onClick={() => handleTemplateSelect('thankYouNote')}
                        className="px-3 py-1.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
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