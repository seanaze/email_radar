/**
 * @fileoverview
 * Toast notification component for displaying temporary messages
 */

import { useEffect } from 'react';

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

/**
 * @description Toast notification component with auto-dismiss
 * @param {ToastProps} props - Toast configuration
 * @returns {JSX.Element} Toast UI element
 */
export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300',
    error: 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300',
    info: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-700 dark:text-indigo-300'
  }[type];

  const icon = {
    success: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }[type];

  return (
    <div className={`
      fixed bottom-4 right-4 max-w-md p-4 rounded-lg border backdrop-blur-md
      shadow-lg animate-slide-up ${bgColor}
    `}>
      <div className="flex items-center gap-3">
        {icon}
        <p className="flex-1">{message}</p>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
} 