/**
 * @fileoverview Landing page component for Email Radar
 * @description Main entry point showing product overview and sign-in option
 */

import Link from 'next/link';

/**
 * @description Landing page component that displays Email Radar overview
 * @returns {JSX.Element} The landing page with product description and CTA
 */
export default function HomePage(): JSX.Element {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Email Radar</h2>
          <div className="flex gap-6 items-center">
            <Link href="/editor" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
              Editor
            </Link>
            <Link href="#coming-soon" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
              Coming Soon
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white">
              Write Emails That
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mt-2">
                Get Results
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              AI-powered email analysis that goes beyond grammar. Understand your tone, 
              predict responses, and communicate with confidence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link 
                href="/editor" 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Try Editor Free
              </Link>
              <a 
                href="#features" 
                className="px-8 py-4 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-full hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-200"
              >
                Learn More
              </a>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No sign-up required
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                100% Free for MVP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-slate-900 dark:text-white">
            Three Layers of Intelligence
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Grammar Feature */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">Grammar & Punctuation</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Real-time spelling, grammar, and punctuation corrections. Click to fix errors instantly.
              </p>
            </div>

            {/* Tone Feature */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">Tone Analysis</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Visualize your email's emotional tone with color-coded insights and suggestions.
              </p>
            </div>

            {/* Response Feature */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">Response Prediction</h3>
              <p className="text-slate-600 dark:text-slate-300">
                See how your email might be received with AI-predicted responses and insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section id="coming-soon" className="py-20 px-4 bg-slate-100 dark:bg-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-slate-900 dark:text-white">
            Coming Soon: Smart Inbox
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Direct Gmail and Outlook integration. Manage your emails without leaving Email Radar.
          </p>
          <div className="bg-white dark:bg-slate-700 rounded-2xl p-8 shadow-lg max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Join the Waitlist</h3>
            <form className="space-y-4">
              <input 
                type="email" 
                placeholder="your@email.com" 
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit" 
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
              >
                Get Early Access
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-slate-500 dark:text-slate-400">
        <p>&copy; 2024 Email Radar. All rights reserved.</p>
      </footer>
    </main>
  );
} 