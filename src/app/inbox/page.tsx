/**
 * @fileoverview Inbox page component for Email Radar
 * @description Displays user's Gmail inbox with filtering and email selection
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { loadEmailsThunk, setFilter } from '../../features/inbox/inboxSlice';
import { selectUser, selectIsAuthenticated } from '../../features/auth/authSlice';
import { Mail, Search, Filter, Plus, Settings, LogOut } from 'lucide-react';

/**
 * @description Inbox page component
 * @returns {JSX.Element} Inbox interface with email list and filters
 */
export default function InboxPage(): JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Selectors
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const { emails, isLoading, error, filters } = useAppSelector(state => state.inbox);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    // Load emails on mount
    if (user?.google_id) {
      dispatch(loadEmailsThunk({ userId: user.google_id }));
    }
  }, [isAuthenticated, user, dispatch, router]);

  /**
   * @description Handles email selection for editing
   */
  const handleEmailSelect = (emailId: string) => {
    router.push(`/editor/${emailId}`);
  };

  /**
   * @description Handles creating a new email
   */
  const handleNewEmail = () => {
    router.push('/editor/new');
  };

  /**
   * @description Handles filter changes
   */
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    dispatch(setFilter(newFilters));
  };

  /**
   * @description Handles user logout
   */
  const handleLogout = () => {
    // TODO: Implement logout logic
    router.push('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Navigation Header */}
      <header className="glass-surface border-b border-slate-400/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Email Radar
            </h1>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {user?.email}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/settings')}
              className="btn-secondary p-2"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={handleLogout}
              className="btn-secondary p-2"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Inbox
            </h2>
            
            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterChange({ status: 'all' })}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  filters.status === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'glass-surface text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange({ status: 'draft' })}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  filters.status === 'draft'
                    ? 'bg-primary-500 text-white'
                    : 'glass-surface text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80'
                }`}
              >
                Drafts
              </button>
              <button
                onClick={() => handleFilterChange({ status: 'sent' })}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  filters.status === 'sent'
                    ? 'bg-primary-500 text-white'
                    : 'glass-surface text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80'
                }`}
              >
                Sent
              </button>
            </div>
          </div>

          <button
            onClick={handleNewEmail}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Email
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search emails..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-3 glass-surface rounded-lg focus-ring border border-slate-400/20 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
          />
        </div>

        {/* Email List */}
        <div className="space-y-3">
          {isLoading ? (
            // Loading state
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="glass-surface rounded-lg p-4 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-300 dark:bg-slate-600 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            // Error state
            <div className="glass-surface rounded-lg p-8 text-center">
              <Mail className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                Error loading emails
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
              <button
                onClick={() => user?.google_id && dispatch(loadEmailsThunk({ userId: user.google_id }))}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          ) : emails.length === 0 ? (
            // Empty state
            <div className="glass-surface rounded-lg p-8 text-center">
              <Mail className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                No emails found
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Get started by composing your first email with AI assistance.
              </p>
              <button onClick={handleNewEmail} className="btn-primary">
                Compose Email
              </button>
            </div>
          ) : (
            // Email list
            emails.map((email) => (
              <div
                key={email.gmail_id}
                onClick={() => handleEmailSelect(email.gmail_id)}
                className="glass-surface rounded-lg p-4 cursor-pointer hover:bg-white/80 dark:hover:bg-slate-700/80 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-slate-900 dark:text-slate-100 truncate">
                        {email.subject || 'No Subject'}
                      </h3>
                      {email.is_draft && (
                        <span className="px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                      {email.original_body.substring(0, 100)}...
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      {new Date(email.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 