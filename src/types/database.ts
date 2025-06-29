/**
 * @fileoverview Simplified database types for Email Radar Firestore collections
 * @description Defines TypeScript interfaces for essential database entities only
 */

/**
 * @description User document structure in Firestore
 */
export interface User {
  google_id: string;
  email: string;
  access_token: string;
  refresh_token: string;
  created_at: string; // ISO timestamp
}

/**
 * @description User settings document structure in Firestore
 */
export interface UserSettings {
  suggestion_aggressiveness: number; // 1-5 scale
  language: string; // e.g., 'en-US'
  ai_features_enabled: boolean;
}

/**
 * @description Email document structure in Firestore
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
 * @description Firestore collection names as constants
 */
export const COLLECTIONS = {
  USERS: 'users',
  USER_SETTINGS: 'user_settings',
  EMAILS: 'emails',
} as const;

/**
 * @description Type for collection names
 */
export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS]; 