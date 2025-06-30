/**
 * @fileoverview Google OAuth authentication button component
 * @description Handles Google OAuth sign-in with Gmail API scopes using Firebase Auth
 */

'use client';

import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '../utils/firebase';
import { useAppDispatch } from '../state/hooks';
import { createUserThunk } from '../features/auth/authSlice';
import { User } from '../types/database';

/**
 * @description Google OAuth authentication button component
 * @returns {JSX.Element} Sign in button with loading and error states
 */
export default function AuthButton(): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();

  /**
   * @description Handles Google OAuth sign-in process
   */
  const handleSignIn = async () => {
    if (!auth) {
      setError('Authentication not configured');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Configure Google Auth Provider with Gmail scopes
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
      provider.addScope('https://www.googleapis.com/auth/gmail.compose');
      provider.addScope('https://www.googleapis.com/auth/gmail.send');
      
      // Sign in with popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const credential = GoogleAuthProvider.credentialFromResult(result);
      
      if (!credential?.accessToken) {
        throw new Error('Failed to get access token');
      }

      // Create user data for Firestore
      const userData: User = {
        google_id: user.uid,
        email: user.email!,
        access_token: credential.accessToken,
        refresh_token: '', // Will be obtained via token refresh
        created_at: new Date().toISOString(),
      };

      // Save user to Firestore
      await dispatch(createUserThunk({ 
        uid: user.uid, 
        userData 
      })).unwrap();

      // Redirect to inbox
      router.push('/inbox');
      
    } catch (error: any) {
      console.error('Sign-in error:', error);
      
      // Handle specific error cases
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-in was cancelled');
      } else if (error.code === 'auth/popup-blocked') {
        setError('Popup was blocked. Please allow popups for this site.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        setError('Sign-in was cancelled');
      } else {
        setError('Failed to sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleSignIn}
        disabled={isLoading}
        className="btn-primary text-lg px-8 py-4 focus-ring disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
        aria-label="Sign in with Google to access Gmail"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Signing in...
          </span>
        ) : (
          'Sign in with Google'
        )}
      </button>
      
      {error && (
        <div className="glass-surface border-red-400/40 bg-red-50/60 dark:bg-red-900/20 p-4 rounded-lg">
          <p className="text-red-700 dark:text-red-300 text-sm">
            {error}
          </p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-red-600 dark:text-red-400 text-xs underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
} 