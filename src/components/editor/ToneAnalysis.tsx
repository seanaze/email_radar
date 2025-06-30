'use client';

import { useState, useEffect } from 'react';

interface ToneData {
  tone: string;
  percentage: number;
  color: string;
  description: string;
}

interface ToneAnalysisProps {
  content: string;
}

export default function ToneAnalysis({ content }: ToneAnalysisProps) {
  const [tones, setTones] = useState<ToneData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!content.trim()) {
      setTones([]);
      return;
    }

    const analyzeTone = async () => {
      setIsAnalyzing(true);
      // Simulate tone analysis - in production, this would call an AI API
      setTimeout(() => {
        const mockTones: ToneData[] = [
          { 
            tone: 'Professional', 
            percentage: 45, 
            color: 'bg-blue-500',
            description: 'Formal and business-appropriate'
          },
          { 
            tone: 'Friendly', 
            percentage: 30, 
            color: 'bg-green-500',
            description: 'Warm and approachable'
          },
          { 
            tone: 'Urgent', 
            percentage: 15, 
            color: 'bg-orange-500',
            description: 'Conveys time sensitivity'
          },
          { 
            tone: 'Assertive', 
            percentage: 10, 
            color: 'bg-red-500',
            description: 'Direct and confident'
          }
        ];
        setTones(mockTones);
        setIsAnalyzing(false);
      }, 1000);
    };

    const debounceTimer = setTimeout(analyzeTone, 800);
    return () => clearTimeout(debounceTimer);
  }, [content]);

  if (!content.trim()) {
    return (
      <div className="text-center py-8 text-slate-400 dark:text-slate-500">
        Start typing to analyze email tone
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="flex items-center justify-center py-8">
        <svg className="animate-spin h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tone Bars */}
      <div className="space-y-3">
        {tones.map((tone, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {tone.tone}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {tone.percentage}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
              <div 
                className={`${tone.color} h-2.5 rounded-full transition-all duration-500`}
                style={{ width: `${tone.percentage}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {tone.description}
            </p>
          </div>
        ))}
      </div>

      {/* Overall Assessment */}
      <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-2">
          Overall Tone Assessment
        </h4>
        <p className="text-sm text-purple-700 dark:text-purple-300">
          Your email strikes a good balance between professionalism and friendliness. 
          The tone is appropriate for business communication while remaining approachable.
        </p>
      </div>

      {/* Tips */}
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Tips to Adjust Tone
        </h4>
        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-0.5">•</span>
            <span>Add "please" and "thank you" to increase friendliness</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-0.5">•</span>
            <span>Use shorter sentences for more urgency</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-0.5">•</span>
            <span>Include specific deadlines to convey importance</span>
          </li>
        </ul>
      </div>
    </div>
  );
}