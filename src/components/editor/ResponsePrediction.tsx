'use client';

import { useState, useEffect } from 'react';

interface ResponsePredictionProps {
  content: string;
}

export default function ResponsePrediction({ content }: ResponsePredictionProps) {
  const [prediction, setPrediction] = useState<string>('');
  const [highlights, setHighlights] = useState<{ positive: string[], concern: string[] }>({ positive: [], concern: [] });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!content.trim()) {
      setPrediction('');
      return;
    }

    const predictResponse = async () => {
      setIsAnalyzing(true);
      // Simulate AI response prediction - in production, this would call an AI API
      setTimeout(() => {
        // Mock predicted response
        setPrediction(`Hi John,

Thank you for following up on our discussion. I appreciate your proactive approach to the project timeline.

I'm happy to schedule a call to review the deliverables. Tuesday afternoon works well for me - would 2:30 PM be suitable for you?

Looking forward to our discussion.

Best regards,
Sarah`);

        // Mock highlights
        setHighlights({
          positive: ['Thank you for following up', 'appreciate your proactive approach', 'happy to schedule'],
          concern: ['timeline', 'deliverables']
        });

        setIsAnalyzing(false);
      }, 1500);
    };

    const debounceTimer = setTimeout(predictResponse, 1000);
    return () => clearTimeout(debounceTimer);
  }, [content]);

  if (!content.trim()) {
    return (
      <div className="text-center py-8 text-slate-400 dark:text-slate-500">
        Start typing to see predicted response
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="flex items-center justify-center py-8">
        <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Predicted Response */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
        <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
          {prediction}
        </p>
      </div>

      {/* Response Analysis */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Response Analysis
        </h4>
        
        {/* Positive Points */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Likely Positive Reception
            </p>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              {highlights.positive.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Points of Attention */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Areas That May Need Clarification
            </p>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              {highlights.concern.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">
          Key Insights
        </h4>
        <p className="text-sm text-green-700 dark:text-green-300">
          Your email is likely to receive a positive response. The recipient appreciates 
          the follow-up and is willing to engage. Consider being more specific about 
          agenda items to make the meeting more productive.
        </p>
      </div>
    </div>
  );
}