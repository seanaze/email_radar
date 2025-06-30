/**
 * @fileoverview Landing page component for Email Radar
 * @description Main entry point showing text analysis tool with 3-step feedback process
 */

'use client';

import React, { useState } from 'react';

/**
 * @description Landing page component that displays Email Radar text analysis interface
 * @returns {JSX.Element} The landing page with text editor and analysis panels
 */
export default function HomePage(): JSX.Element {
  const [text, setText] = useState('');
  const [activeStep, setActiveStep] = useState(1);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">ER</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Email Radar</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
            Settings
          </button>
          <button className="btn-primary px-4 py-2 text-sm">
            Sign In
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900 dark:text-white">
            Perfect Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Email Communication</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            Get instant AI-powered feedback on your emails with grammar corrections, tone analysis, and response insights. 
            Paste your text and watch the magic happen.
          </p>
        </div>

        {/* Main Editor Interface */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Text Editor */}
          <div className="lg:col-span-2">
            <div className="glass-surface rounded-2xl p-6 h-96">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Your Email Text</h3>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {text.length} characters
                </div>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your email text here or start typing... 

Try something like: 'Hi John, I wanted to follow up on our meeting yesterday. I think we should move forward with the proposal but I'm not sure about the timeline. Let me know what you think.'"
                className="w-full h-72 p-4 border-0 bg-transparent resize-none text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-base leading-relaxed"
              />
            </div>
          </div>

          {/* Analysis Steps Preview */}
          <div className="space-y-4">
            {/* Step 1: Grammar */}
            <div className={`glass-surface rounded-xl p-4 cursor-pointer transition-all ${activeStep === 1 ? 'ring-2 ring-blue-500' : ''}`} 
                 onClick={() => setActiveStep(1)}>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">1</span>
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white">Grammar & Punctuation</h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                Automatic spelling, grammar, and punctuation corrections
              </p>
              {text.length > 0 && (
                <div className="text-xs bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-2 rounded">
                  ✓ Found 3 suggestions
                </div>
              )}
            </div>

            {/* Step 2: Tone Analysis */}
            <div className={`glass-surface rounded-xl p-4 cursor-pointer transition-all ${activeStep === 2 ? 'ring-2 ring-green-500' : ''}`}
                 onClick={() => setActiveStep(2)}>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">2</span>
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white">Tone Analysis</h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                Color-coded emotional feedback and tone indicators
              </p>
              {text.length > 0 && (
                <div className="flex space-x-2">
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">Professional</span>
                  <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded">Uncertain</span>
                </div>
              )}
            </div>

            {/* Step 3: Response Preview */}
            <div className={`glass-surface rounded-xl p-4 cursor-pointer transition-all ${activeStep === 3 ? 'ring-2 ring-purple-500' : ''}`}
                 onClick={() => setActiveStep(3)}>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">3</span>
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white">Response Preview</h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                See how your email might be received and potential responses
              </p>
              {text.length > 0 && (
                <div className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 p-2 rounded">
                  📝 Sample response generated
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-16 text-center">
          <div className="glass-surface rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              🚀 Smart Inbox - Coming Soon
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Direct Gmail integration for automatic email analysis and smart response suggestions. 
              Be the first to know when it's ready!
            </p>
            <div className="flex max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email for updates"
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-l-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button className="btn-primary px-6 py-2 rounded-l-none">
                Notify Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 