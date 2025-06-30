/**
 * @fileoverview Email editor page component
 * @description Page for editing individual emails with AI assistance
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { loadEmailThunk, updateEmailThunk, createEmailThunk } from '../../../features/inbox/inboxSlice';
import { selectUser, selectIsAuthenticated } from '../../../features/auth/authSlice';
import EmailEditor from '../../../components/EmailEditor';
import { Email } from '../../../types/database';
import { ArrowLeft, Settings, LogOut } from 'lucide-react';

/**
 * @description Email editor page component
 * @returns {JSX.Element} Email editing interface
 */
export default function EmailEditorPage(): JSX.Element {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  
  const emailId = params.emailId as string;
  const isNewEmail = emailId === 'new';
  
  // Selectors
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const { currentEmail, isLoadingEmail, isSaving, error } = useAppSelector(state => state.inbox);
  
  // Local state for new email
  const [newEmailData, setNewEmailData] = useState<Partial<Email>>({
    subject: '',
    original_body: '',
    corrected_body: '',
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    // Load existing email or prepare new email
    if (!isNewEmail && emailId) {
      dispatch(loadEmailThunk(emailId));
    } else if (isNewEmail && user) {
      // Setup new email data
      const newEmail: Email = {
        user_id: user.google_id,
        gmail_id: `draft_${Date.now()}`, // Temporary ID for new emails
        subject: '',
        original_body: '',
        corrected_body: '',
        status: 'draft',
        is_draft: true,
        created_at: new Date().toISOString(),
      };
      setNewEmailData(newEmail);
    }
  }, [isAuthenticated, isNewEmail, emailId, user, dispatch, router]);

  /**
   * @description Handles saving email draft
   */
  const handleSave = async (content: string) => {
    if (!user) return;

    try {
      if (isNewEmail) {
        // Create new email
        const emailData: Email = {
          ...newEmailData as Email,
          corrected_body: content,
          original_body: newEmailData.original_body || content,
        };
        
        await dispatch(createEmailThunk({ 
          emailId: emailData.gmail_id, 
          emailData 
        })).unwrap();
        
        // Redirect to the new email
        router.push(`/editor/${emailData.gmail_id}`);
      } else if (currentEmail) {
        // Update existing email
        await dispatch(updateEmailThunk({
          emailId: currentEmail.gmail_id,
          updates: { corrected_body: content }
        })).unwrap();
      }
    } catch (error) {
      console.error('Failed to save email:', error);
    }
  };

  /**
   * @description Handles sending email
   */
  const handleSend = async (content: string) => {
    if (!user) return;

    try {
      // Save first, then update status to sent
      await handleSave(content);
      
      if (currentEmail) {
        await dispatch(updateEmailThunk({
          emailId: currentEmail.gmail_id,
          updates: { 
            status: 'sent',
            is_draft: false,
            corrected_body: content
          }
        })).unwrap();
      }
      
      // Redirect to inbox
      router.push('/inbox');
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  /**
   * @description Handles navigation back to inbox
   */
  const handleBackToInbox = () => {
    router.push('/inbox');
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

  const emailToEdit = isNewEmail ? (newEmailData as Email) : currentEmail;

  if (!emailToEdit && !isNewEmail) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* Header */}
        <header className="glass-surface border-b border-slate-400/20 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={handleBackToInbox}
              className="btn-secondary flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Inbox
            </button>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-8">
          {isLoadingEmail ? (
            <div className="text-center">
              <p className="text-slate-600 dark:text-slate-400">Loading email...</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-slate-600 dark:text-slate-400">Email not found</p>
              <button
                onClick={handleBackToInbox}
                className="btn-primary mt-4"
              >
                Return to Inbox
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="glass-surface border-b border-slate-400/20 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToInbox}
              className="btn-secondary flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Inbox
            </button>
            
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {isNewEmail ? 'New Email' : (emailToEdit?.subject || 'Edit Email')}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {user?.email}
              </p>
            </div>
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {emailToEdit && (
          <>
            {/* Subject Field */}
            <div className="mb-6">
              <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={emailToEdit.subject || ''}
                onChange={(e) => {
                  if (isNewEmail) {
                    setNewEmailData(prev => ({ ...prev, subject: e.target.value }));
                  }
                  // TODO: Update subject for existing emails
                }}
                placeholder="Enter email subject..."
                className="w-full px-4 py-3 glass-surface rounded-lg focus-ring border border-slate-400/20 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
              />
            </div>

            {/* Email Editor */}
            <EmailEditor
              email={emailToEdit}
              onSave={handleSave}
              onSend={handleSend}
              className="mb-6"
            />

            {/* Status */}
            {isSaving && (
              <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                Saving...
              </div>
            )}
            
            {error && (
              <div className="glass-surface border-red-400/40 bg-red-50/60 dark:bg-red-900/20 p-4 rounded-lg">
                <p className="text-red-700 dark:text-red-300 text-sm">
                  Error: {error}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 