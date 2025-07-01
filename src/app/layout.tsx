/**
 * @fileoverview
 * Root layout component for the Email Radar application.
 * Provides navigation, Redux provider, and global styles.
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import ReduxProvider from '../components/ReduxProvider';
import AuthProvider from '../components/AuthProvider';
import AuthButton from '../components/AuthButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Email Radar - AI-Powered Text Analysis',
  description: 'Transform your emails with AI-powered grammar correction, tone analysis, and smart replies',
};

// Navigation items
const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Editor', path: '/editor' },
  { label: 'Settings', path: '/settings' }
];

/**
 * @description Root layout component that wraps all pages
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} Layout wrapper with navigation
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="smooth-scroll">
      <body className={`${inter.className} min-h-screen`}>
        <ReduxProvider>
          <AuthProvider>
            {/* Professional Navigation Bar */}
          <nav className="fixed top-0 z-50 w-full glass-surface border-b border-glass-border dark:border-glass-borderDark">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
              {/* Logo and Brand */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/30 transition-all duration-300 group-hover:scale-105"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl blur opacity-50 group-hover:opacity-70 transition-opacity"></div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  Email Radar
                </span>
              </Link>
              
              {/* Navigation Links */}
              <div className="hidden sm:flex items-center gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="relative px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/50 dark:hover:bg-white/10"
                  >
                    {item.label}
                  </Link>
                ))}
                <AuthButton />
              </div>

              {/* Mobile Menu Button */}
              <button className="sm:hidden p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-colors">
                <svg className="w-6 h-6 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </nav>
          
          {/* Main Content with proper spacing */}
          <main className="pt-16 min-h-screen">
            {children}
          </main>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
