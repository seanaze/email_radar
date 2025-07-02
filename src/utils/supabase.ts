/**
 * @fileoverview Supabase client configuration
 * @description Creates and exports a Supabase client instance for authentication and database operations
 */

import { createClient } from '@supabase/supabase-js';

// Use dummy values during build time if environment variables are not set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);