/**
 * @fileoverview
 * Email text editor component with TipTap rich text editor.
 * Provides text input and triggers analysis on demand with undo/redo support.
 */

'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { TextHistory } from '@/utils/textHistory';
import { GrammarSuggestions, updateGrammarSuggestions, type GrammarSuggestion } from '@/utils/grammarExtension';

const DRAFT_STORAGE_KEY = 'email-radar-draft';

interface EmailEditorProps {
  onAnalyze: (text: string) => void;
  isAnalyzing?: boolean;
  grammarSuggestions?: GrammarSuggestion[];
}

export interface EmailEditorRef {
  updateText: (text: string) => void;
  applyGrammarSuggestions: (suggestions: GrammarSuggestion[]) => void;
}

/**
 * @description Rich text editor for email composition and analysis
 * @param {EmailEditorProps} props - Component props
 * @returns {JSX.Element} Editor component with analyze button
 */
const EmailEditor = forwardRef<EmailEditorRef, EmailEditorProps>(
  ({ onAnalyze, isAnalyzing = false, grammarSuggestions = [] }, ref) => {
    const historyRef = useRef(new TextHistory());
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const lastTextRef = useRef('');

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          history: false, // Disable built-in history to use our custom one
        }),
        Placeholder.configure({
          placeholder: 'Start typing your email or paste existing content...',
        }),
        CharacterCount.configure({
          limit: 10000,
        }),
        GrammarSuggestions.configure({
          suggestions: grammarSuggestions,
          onApplySuggestion: (suggestion: GrammarSuggestion) => {
            // Update history after applying suggestion
            const text = editor?.getText() || '';
            historyRef.current.push(text);
            updateHistoryState();
          },
        }),
      ],
      content: '',
      editorProps: {
        attributes: {
          class: 'prose prose-slate dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-6 text-slate-800 dark:text-slate-200',
        },
      },
      onUpdate: ({ editor }) => {
        const text = editor.getText();
        // Only add to history if text actually changed and after a small delay
        if (text !== lastTextRef.current) {
          lastTextRef.current = text;
          // Save draft to localStorage
          localStorage.setItem(DRAFT_STORAGE_KEY, text);
          setTimeout(() => {
            if (editor.getText() === text) {
              historyRef.current.push(text);
              updateHistoryState();
            }
          }, 500);
        }
      },
    });

    // Update grammar suggestions when they change
    useEffect(() => {
      if (editor && grammarSuggestions.length > 0) {
        updateGrammarSuggestions(editor, grammarSuggestions);
      }
    }, [editor, grammarSuggestions]);

    const updateHistoryState = () => {
      setCanUndo(historyRef.current.canUndo());
      setCanRedo(historyRef.current.canRedo());
    };

    const handleUndo = () => {
      if (!editor) return;
      const previousText = historyRef.current.undo();
      if (previousText !== null) {
        editor.commands.setContent(previousText);
        lastTextRef.current = previousText;
        updateHistoryState();
      }
    };

    const handleRedo = () => {
      if (!editor) return;
      const nextText = historyRef.current.redo();
      if (nextText !== null) {
        editor.commands.setContent(nextText);
        lastTextRef.current = nextText;
        updateHistoryState();
      }
    };

    // Expose updateText method to parent
    useImperativeHandle(ref, () => ({
      updateText: (text: string) => {
        if (!editor) return;
        editor.commands.setContent(text);
        lastTextRef.current = text;
        historyRef.current.push(text);
        updateHistoryState();
      },
      applyGrammarSuggestions: (suggestions: GrammarSuggestion[]) => {
        if (!editor) return;
        updateGrammarSuggestions(editor, suggestions);
      }
    }), [editor]);

    // Keyboard shortcuts
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
        } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
          e.preventDefault();
          handleRedo();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [editor]);

    const handleAnalyze = () => {
      if (!editor) return;
      
      const text = editor.getText();
      onAnalyze(text);
    };

    const handleClear = () => {
      if (!editor) return;
      editor.commands.clearContent();
      historyRef.current.clear();
      historyRef.current.push('');
      updateHistoryState();
    };

    const characterCount = editor?.storage.characterCount.characters() || 0;
    const wordCount = editor?.storage.characterCount.words() || 0;

    // Calculate reading time (average 200 words per minute)
    const readingTime = Math.ceil(wordCount / 200);

    return (
      <div className="flex flex-col gap-6">
        {/* Editor Header */}
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-4">
            {/* Undo/Redo buttons */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <button 
                onClick={handleUndo}
                disabled={!canUndo}
                className={`p-2 rounded-md transition-colors ${
                  canUndo 
                    ? 'hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400' 
                    : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                }`}
                title="Undo (Ctrl+Z)"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>
              <button 
                onClick={handleRedo}
                disabled={!canRedo}
                className={`p-2 rounded-md transition-colors ${
                  canRedo 
                    ? 'hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400' 
                    : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                }`}
                title="Redo (Ctrl+Y)"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                </svg>
              </button>
            </div>
            
            {/* Quick actions */}
            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Format text">
              <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Add template">
              <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Editor Container */}
        <div className="card-professional group">
          <div className="relative">
            {/* Editor toolbar placeholder */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white dark:from-slate-800 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
            
            {/* Main editor */}
            <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:border-primary-300 dark:hover:border-primary-700 focus-within:border-primary-500 dark:focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-500/20">
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>

        {/* Editor Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center divide-x divide-slate-300 dark:divide-slate-600 text-sm bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
            <div className="px-4 py-2 text-slate-600 dark:text-slate-400">
              <span className="font-medium">{wordCount}</span> Words
            </div>
            <div className="px-4 py-2 text-slate-600 dark:text-slate-400">
              <span className="font-medium">{characterCount}</span> Characters
            </div>
            {wordCount > 0 && (
              <div className="px-4 py-2 text-slate-600 dark:text-slate-400">
                <span className="font-medium">{readingTime}</span> min read
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleClear}
              disabled={characterCount === 0}
              className={`btn-secondary ${characterCount === 0 ? 'btn-disabled' : ''}`}
            >
              Clear
            </button>
            
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || characterCount === 0}
              className={`btn-primary flex items-center gap-3 ${isAnalyzing || characterCount === 0 ? 'btn-disabled' : ''}`}
            >
              {isAnalyzing ? (
                <>
                  <div className="loading-shimmer h-5 w-5 rounded-full"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>Analyze Text</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tips section */}
        {characterCount === 0 && (
          <div className="animate-fadeIn">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-4 border border-primary-200 dark:border-primary-800">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm">
                  <p className="font-medium text-primary-900 dark:text-primary-100 mb-1">Pro tip</p>
                  <p className="text-primary-700 dark:text-primary-300">
                    You can paste an email draft or start typing from scratch. Our AI will analyze grammar, tone, and suggest improvements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

EmailEditor.displayName = 'EmailEditor';

export default EmailEditor; 