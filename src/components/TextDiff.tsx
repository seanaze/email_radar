/**
 * @fileoverview
 * Text diff component for displaying visual differences between original and corrected text
 */

'use client';

import { useMemo } from 'react';

interface TextDiffProps {
  original: string;
  corrected: string;
  viewMode?: 'inline' | 'side-by-side';
}

/**
 * @description Computes the differences between two strings
 * @param {string} original - Original text
 * @param {string} corrected - Corrected text
 * @returns {Array} Array of diff segments
 */
function computeDiff(original: string, corrected: string) {
  // Simple word-based diff for MVP - can be enhanced with better algorithms
  const originalWords = original.split(/(\s+)/);
  const correctedWords = corrected.split(/(\s+)/);
  
  const diff = [];
  let i = 0, j = 0;
  
  while (i < originalWords.length || j < correctedWords.length) {
    if (i >= originalWords.length) {
      // Remaining corrected words are additions
      diff.push({ type: 'add', value: correctedWords.slice(j).join('') });
      break;
    }
    
    if (j >= correctedWords.length) {
      // Remaining original words are deletions
      diff.push({ type: 'remove', value: originalWords.slice(i).join('') });
      break;
    }
    
    if (originalWords[i] === correctedWords[j]) {
      // Same word
      diff.push({ type: 'same', value: originalWords[i] });
      i++;
      j++;
    } else {
      // Find next matching word
      let found = false;
      
      // Check if current original word appears later in corrected
      for (let k = j + 1; k < Math.min(j + 5, correctedWords.length); k++) {
        if (originalWords[i] === correctedWords[k]) {
          // Add the corrected words before the match
          diff.push({ type: 'add', value: correctedWords.slice(j, k).join('') });
          j = k;
          found = true;
          break;
        }
      }
      
      if (!found) {
        // Check if current corrected word appears later in original
        for (let k = i + 1; k < Math.min(i + 5, originalWords.length); k++) {
          if (correctedWords[j] === originalWords[k]) {
            // Remove the original words before the match
            diff.push({ type: 'remove', value: originalWords.slice(i, k).join('') });
            i = k;
            found = true;
            break;
          }
        }
      }
      
      if (!found) {
        // Words are different, show as remove + add
        diff.push({ type: 'remove', value: originalWords[i] });
        diff.push({ type: 'add', value: correctedWords[j] });
        i++;
        j++;
      }
    }
  }
  
  return diff;
}

export default function TextDiff({ original, corrected, viewMode = 'inline' }: TextDiffProps) {
  const diff = useMemo(() => computeDiff(original, corrected), [original, corrected]);
  
  if (viewMode === 'side-by-side') {
    return (
      <div className="grid grid-cols-2 gap-4">
        {/* Original Text */}
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
          <h4 className="text-sm font-medium text-red-700 dark:text-red-300 mb-2">Original</h4>
          <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {diff.map((segment, index) => {
              if (segment.type === 'remove' || segment.type === 'same') {
                return (
                  <span
                    key={index}
                    className={segment.type === 'remove' ? 'bg-red-200 dark:bg-red-800/50 text-red-800 dark:text-red-200 px-1 rounded' : ''}
                  >
                    {segment.value}
                  </span>
                );
              }
              return null;
            })}
          </div>
        </div>
        
        {/* Corrected Text */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
          <h4 className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">Corrected</h4>
          <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {diff.map((segment, index) => {
              if (segment.type === 'add' || segment.type === 'same') {
                return (
                  <span
                    key={index}
                    className={segment.type === 'add' ? 'bg-green-200 dark:bg-green-800/50 text-green-800 dark:text-green-200 px-1 rounded' : ''}
                  >
                    {segment.value}
                  </span>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    );
  }
  
  // Inline view
  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {diff.map((segment, index) => {
          switch (segment.type) {
            case 'remove':
              return (
                <span
                  key={index}
                  className="line-through bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-1 rounded"
                >
                  {segment.value}
                </span>
              );
            case 'add':
              return (
                <span
                  key={index}
                  className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1 rounded font-medium"
                >
                  {segment.value}
                </span>
              );
            default:
              return <span key={index}>{segment.value}</span>;
          }
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-200 dark:bg-red-800/50 rounded"></div>
          <span className="text-slate-600 dark:text-slate-400">Removed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-200 dark:bg-green-800/50 rounded"></div>
          <span className="text-slate-600 dark:text-slate-400">Added</span>
        </div>
      </div>
    </div>
  );
} 