/**
 * @fileoverview
 * Auth provider component that listens to Supabase auth state changes
 * and updates Redux store accordingly
 */

'use client';

import { useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { useAppDispatch } from '@/state/hooks';
import { setUser, clearUser, loadUserProfile } from '@/features/auth/authSlice';

/**
 * @description Auth provider that syncs Supabase auth state with Redux
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Children with auth state management
 */
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Skip if supabase is not configured
    if (!supabase) {
      console.warn('Supabase client not initialized - auth features disabled');
      return;
    }

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        dispatch(setUser(session.user));
        dispatch(loadUserProfile(session.user.id));
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        dispatch(setUser(session.user));
        dispatch(loadUserProfile(session.user.id));
      } else if (event === 'SIGNED_OUT') {
        dispatch(clearUser());
      } else if (event === 'USER_UPDATED' && session?.user) {
        dispatch(setUser(session.user));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return <>{children}</>;
} 