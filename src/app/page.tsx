/**
 * @fileoverview
 * Landing page for Email Radar - AI-powered text analysis assistant.
 * Showcases the three-step analysis pipeline and provides CTA to open editor.
 */

import Link from "next/link";

// Professional icon components
const GrammarIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ToneIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
);

const SmartReplyIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden relative">
      {/* Background with noise texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 bg-noise opacity-[0.02]"></div>
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-4000"></div>

      {/* Hero Section */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="max-w-6xl w-full animate-fadeIn">
          {/* Main content card */}
          <div className="card-professional p-8 md:p-12 text-center">
            {/* Logo */}
            <div className="mb-8 inline-flex">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl shadow-glow animate-pulse-soft"></div>
            </div>

            <h1 className="mb-4 text-5xl md:text-7xl font-bold">
              <span className="text-gradient">Email Radar</span>
            </h1>
            <p className="mb-12 text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Transform your writing with AI-powered analysis that makes every word count
            </p>
            
            {/* Feature cards */}
            <div className="mb-12 grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
              {/* Grammar Perfection */}
              <div className="group card-professional p-6 hover:scale-105 transition-all duration-300">
                <div className="feature-icon mx-auto mb-4 text-primary-600 dark:text-primary-400">
                  <GrammarIcon />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                  Grammar Perfection
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Instant corrections with context-aware suggestions
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-primary-600">
                  <CheckIcon />
                  <span>99.9% accuracy</span>
                </div>
              </div>
              
              {/* Tone Analysis */}
              <div className="group card-professional p-6 hover:scale-105 transition-all duration-300">
                <div className="feature-icon mx-auto mb-4 text-secondary-600 dark:text-secondary-400">
                  <ToneIcon />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                  Tone Analysis
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Understand emotional impact with visual indicators
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-secondary-600">
                  <CheckIcon />
                  <span>12 tone types</span>
                </div>
              </div>
              
              {/* Smart Replies */}
              <div className="group card-professional p-6 hover:scale-105 transition-all duration-300">
                <div className="feature-icon mx-auto mb-4 text-purple-600 dark:text-purple-400">
                  <SmartReplyIcon />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                  Smart Replies
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  AI responses that match your unique voice
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-purple-600">
                  <CheckIcon />
                  <span>5 style options</span>
                </div>
              </div>
            </div>
            
            {/* CTA Button */}
            <Link
              href="/editor"
              className="btn-primary inline-flex items-center gap-3 text-lg group"
            >
              <span>Start Writing Better</span>
              <ArrowRightIcon />
            </Link>

            {/* Trust indicators */}
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No data stored
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                Used by 10K+ writers
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
                Free to start
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
            Three Steps to Better Writing
          </h2>
          <p className="mb-16 text-center text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Our AI analyzes your text in seconds, providing instant feedback and improvements
          </p>
          
          <div className="grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="relative group animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <div className="card-professional p-8 h-full hover:scale-105 transition-all duration-300">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 text-2xl font-bold text-primary-600 dark:text-primary-400 shadow-inner-light">
                  1
                </div>
                <h3 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
                  Write or Paste
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Start with your draft email, document, or any text you want to improve
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative group animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <div className="card-professional p-8 h-full hover:scale-105 transition-all duration-300">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-secondary-900/30 dark:to-secondary-800/30 text-2xl font-bold text-secondary-600 dark:text-secondary-400 shadow-inner-light">
                  2
                </div>
                <h3 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
                  AI Analysis
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Our AI performs comprehensive analysis: grammar, tone, clarity, and more
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative group animate-slideUp" style={{ animationDelay: '0.3s' }}>
              <div className="card-professional p-8 h-full hover:scale-105 transition-all duration-300">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/30 dark:to-success-800/30 text-2xl font-bold text-success-600 dark:text-success-400 shadow-inner-light">
                  3
                </div>
                <h3 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
                  Apply & Shine
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Apply suggestions with one click and send polished, professional content
                </p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <Link
              href="/editor"
              className="btn-secondary inline-flex items-center gap-2"
            >
              Try It Now - It's Free
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
} 