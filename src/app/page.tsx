/**
 * @fileoverview Landing page component for Email Radar
 * @description Main entry point showing product overview and sign-in option
 */

import AuthButton from '../components/AuthButton';

/**
 * @description Landing page component that displays Email Radar overview
 * @returns {JSX.Element} The landing page with product description and CTA
 */
export default function HomePage(): JSX.Element {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="glass-surface rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900 dark:text-slate-100">
            Email Radar
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            AI-first email composition assistant that integrates with Gmail for 
            grammar corrections and intelligent rewrites.
          </p>
          
          <div className="space-y-6">
            <AuthButton />
            
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Secure Gmail integration • Real-time grammar checking • AI-powered enhancements
            </p>
          </div>
        </div>
      </div>
    </main>
  )
} 