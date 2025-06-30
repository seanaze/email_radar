'use client';

import { useEffect, useRef } from 'react';

interface EmailEditorProps {
  content: string;
  onChange: (content: string) => void;
  isAnalyzing?: boolean;
}

export default function EmailEditor({ content, onChange, isAnalyzing }: EmailEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste or type your email here... 

Example:
Hi Sarah,

I hope this email finds you well. I wanted to follow up on our discussion from last week about the project timeline.

Could we schedule a quick call to review the deliverables? I'm available Tuesday or Wednesday afternoon.

Best regards,
John"
        className="w-full min-h-[400px] p-6 text-base leading-relaxed resize-none border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
        disabled={isAnalyzing}
      />
      
      {isAnalyzing && (
        <div className="absolute inset-0 bg-white/50 dark:bg-slate-800/50 rounded-xl flex items-center justify-center">
          <div className="flex items-center gap-3">
            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-slate-600 dark:text-slate-300">Analyzing...</span>
          </div>
        </div>
      )}
    </div>
  );
}