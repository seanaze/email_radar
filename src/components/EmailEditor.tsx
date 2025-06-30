/**
 * @fileoverview TipTap rich text editor for email composition
 * @description Email editor with real-time grammar checking and AI suggestions
 */

'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Link from '@tiptap/extension-link';
import { 
  Bold, Italic, List, ListOrdered, Link as LinkIcon, 
  Save, Send, Sparkles, Settings 
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { updateCurrentEmailBody } from '../features/inbox/inboxSlice';
import { useAiSuggestions } from '../features/ai/hooks/useAiSuggestions';
import { Email } from '../types/database';

/**
 * @description Email editor component props
 */
interface EmailEditorProps {
  email: Email;
  onSave?: (content: string) => void;
  onSend?: (content: string) => void;
  className?: string;
}

/**
 * @description TipTap rich text editor component for email composition
 * @param {EmailEditorProps} props - Component props
 * @returns {JSX.Element} Rich text editor with toolbar and AI suggestions
 */
export default function EmailEditor({ 
  email, 
  onSave, 
  onSend, 
  className = '' 
}: EmailEditorProps): JSX.Element {
  const dispatch = useAppDispatch();
  const { suggestions, isGenerating, debouncedGenerateSuggestion } = useAiSuggestions();

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your email...',
      }),
      CharacterCount,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-500 underline hover:text-primary-600 transition-colors',
        },
      }),
    ],
    content: email.corrected_body || email.original_body,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      
      // Update Redux state
      dispatch(updateCurrentEmailBody({ 
        field: 'corrected_body', 
        value: content 
      }));

      // Generate AI suggestions for longer text
      const textContent = editor.getText();
      if (textContent.length > 10) {
        debouncedGenerateSuggestion(textContent, 'clarity');
      }
    },
  });

  /**
   * @description Handles text formatting commands
   */
  const handleFormat = useCallback((command: string) => {
    if (!editor) return;

    switch (command) {
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        editor.chain().focus().toggleItalic().run();
        break;
      case 'bulletList':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'orderedList':
        editor.chain().focus().toggleOrderedList().run();
        break;
      default:
        break;
    }
  }, [editor]);

  /**
   * @description Handles adding/removing links
   */
  const handleLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  /**
   * @description Handles save action
   */
  const handleSave = useCallback(() => {
    if (!editor) return;
    const content = editor.getHTML();
    onSave?.(content);
  }, [editor, onSave]);

  /**
   * @description Handles send action
   */
  const handleSend = useCallback(() => {
    if (!editor) return;
    const content = editor.getHTML();
    onSend?.(content);
  }, [editor, onSend]);

  /**
   * @description Auto-save functionality with debouncing
   */
  useEffect(() => {
    if (!editor) return;

    const timeoutId = setTimeout(() => {
      const content = editor.getHTML();
      onSave?.(content);
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [editor?.getHTML(), onSave]);

  // Calculate writing metrics
  const characterCount = editor?.storage.characterCount.characters() || 0;
  const wordCount = editor?.storage.characterCount.words() || 0;

  if (!editor) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-slate-300 dark:bg-slate-600 rounded mb-4"></div>
        <div className="h-64 bg-slate-300 dark:bg-slate-600 rounded"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Toolbar */}
      <div className="glass-surface rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Text formatting */}
          <button
            onClick={() => handleFormat('bold')}
            className={`p-2 rounded hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors ${
              editor.isActive('bold') ? 'bg-primary-500 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
            aria-label="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => handleFormat('italic')}
            className={`p-2 rounded hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors ${
              editor.isActive('italic') ? 'bg-primary-500 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
            aria-label="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-2" />

          {/* Lists */}
          <button
            onClick={() => handleFormat('bulletList')}
            className={`p-2 rounded hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors ${
              editor.isActive('bulletList') ? 'bg-primary-500 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
            aria-label="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => handleFormat('orderedList')}
            className={`p-2 rounded hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors ${
              editor.isActive('orderedList') ? 'bg-primary-500 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
            aria-label="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-2" />

          {/* Link */}
          <button
            onClick={handleLink}
            className={`p-2 rounded hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors ${
              editor.isActive('link') ? 'bg-primary-500 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
            aria-label="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
        </div>

        {/* AI Status */}
        <div className="flex items-center gap-3">
          {isGenerating && (
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Sparkles className="h-4 w-4 animate-pulse text-primary-500" />
              Analyzing...
            </div>
          )}
          
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {wordCount} words • {characterCount} characters
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <EditorContent
          editor={editor}
          className="glass-surface rounded-lg p-6 min-h-[300px] prose prose-slate dark:prose-invert max-w-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 focus-within:ring-offset-white dark:focus-within:ring-offset-slate-900 transition-all"
        />
        
        {/* AI Suggestions Overlay */}
        {suggestions.length > 0 && (
          <div className="absolute right-4 top-4">
            <div className="glass-surface rounded-lg p-3 w-64 space-y-2">
              <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary-500" />
                AI Suggestions
              </h4>
              
              {suggestions.slice(0, 3).map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="p-2 bg-white/50 dark:bg-slate-700/50 rounded text-sm"
                >
                  <div className="font-medium text-slate-800 dark:text-slate-200 mb-1">
                    {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-xs">
                    {suggestion.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Auto-saved • {suggestions.length} suggestions available
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="btn-secondary flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </button>
          
          <button
            onClick={handleSend}
            className="btn-primary flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
} 