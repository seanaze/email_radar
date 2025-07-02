/**
 * @fileoverview Auth Provider component for Email Radar
 * @description Manages Supabase authentication state and provides it to the app
 */

'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../state/store';
import { supabase } from '../utils/supabase';
import { setUser, clearUser, loadUserProfile } from '../features/auth/authSlice';
import type { Session, AuthChangeEvent } from '@supabase/supabase-js';

/**
 * @description Auth Provider component that handles authentication state
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Children with auth context
 */
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      if (session?.user) {
        dispatch(setUser(session.user));
        dispatch(loadUserProfile(session.user.id) as any);
      }
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        dispatch(setUser(session.user));
        dispatch(loadUserProfile(session.user.id) as any);
      } else {
        dispatch(clearUser());
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
}