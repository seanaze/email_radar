/**
 * @fileoverview
 * Supabase client configuration for Email Radar.
 * Provides authenticated client access to Supabase services.
 */

import { createClient } from '@supabase/supabase-js';

// Environment variables should be set in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

/**
 * @description Supabase client instance for authentication and database operations
 * Will be null if environment variables are not configured
 */
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any; // Type assertion to maintain compatibility

/**
 * @description Helper to get current user session
 * @returns Current user session or null
 */
export async function getCurrentUser() {
  if (!supabase) {
    console.warn('Supabase client not initialized');
    return null;
  }
  
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  return user;
}
 