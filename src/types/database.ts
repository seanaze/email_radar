/**
 * @fileoverview Database types for Email Radar Supabase tables
 * @description Defines TypeScript interfaces for essential database entities
 */

/**
 * @description User document structure in database
 */
export interface User {
  google_id: string;
  email: string;
  access_token: string;
  refresh_token: string;
  created_at: string; // ISO timestamp
}

/**
 * @description User settings structure
 */
export interface UserSettings {
  suggestion_aggressiveness: number; // 1-5 scale
  language: string; // e.g., 'en-US'
  ai_features_enabled: boolean;
}

/**
 * @description Email document structure in database
 */
export interface Email {
  user_id: string;
  gmail_id: string;
  thread_id?: string;
  subject?: string;
  original_body: string;
  corrected_body?: string;
  status: 'draft' | 'sent' | 'processing';
  is_draft: boolean;
  created_at: string; // ISO timestamp
}

/**
 * @description Supabase table names as constants
 */
export const TABLES = {
  PROFILES: 'profiles',
  EMAILS: 'emails',
} as const;

/**
 * @description Type for table names
 */
export type TableName = typeof TABLES[keyof typeof TABLES]; 