/**
 * @fileoverview Simplified Firestore utilities for Email Radar
 * @description Provides type-safe CRUD operations for essential database entities only
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from './firebase';
import { User, UserSettings, Email, COLLECTIONS } from '../types/database';

/**
 * @description Creates or updates a user document
 * @param {string} uid - User's Firebase Auth UID
 * @param {User} userData - User data to store
 * @returns {Promise<void>}
 */
export async function createUser(uid: string, userData: User): Promise<void> {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  await setDoc(userRef, userData);
}

/**
 * @description Retrieves a user document by UID
 * @param {string} uid - User's Firebase Auth UID
 * @returns {Promise<User | null>} User data or null if not found
 */
export async function getUser(uid: string): Promise<User | null> {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? (userSnap.data() as User) : null;
}

/**
 * @description Updates user tokens after OAuth refresh
 * @param {string} uid - User's Firebase Auth UID
 * @param {string} accessToken - New access token
 * @param {string} refreshToken - New refresh token
 * @returns {Promise<void>}
 */
export async function updateUserTokens(
  uid: string,
  accessToken: string,
  refreshToken: string
): Promise<void> {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  await updateDoc(userRef, {
    access_token: accessToken,
    refresh_token: refreshToken,
  });
}

/**
 * @description Creates or updates user settings
 * @param {string} uid - User's Firebase Auth UID
 * @param {UserSettings} settings - User settings to store
 * @returns {Promise<void>}
 */
export async function createUserSettings(
  uid: string,
  settings: UserSettings
): Promise<void> {
  const settingsRef = doc(db, COLLECTIONS.USER_SETTINGS, uid);
  await setDoc(settingsRef, settings);
}

/**
 * @description Retrieves user settings by UID
 * @param {string} uid - User's Firebase Auth UID
 * @returns {Promise<UserSettings | null>} User settings or null if not found
 */
export async function getUserSettings(uid: string): Promise<UserSettings | null> {
  const settingsRef = doc(db, COLLECTIONS.USER_SETTINGS, uid);
  const settingsSnap = await getDoc(settingsRef);
  return settingsSnap.exists() ? (settingsSnap.data() as UserSettings) : null;
}

/**
 * @description Updates user settings
 * @param {string} uid - User's Firebase Auth UID
 * @param {Partial<UserSettings>} updates - Settings to update
 * @returns {Promise<void>}
 */
export async function updateUserSettings(
  uid: string,
  updates: Partial<UserSettings>
): Promise<void> {
  const settingsRef = doc(db, COLLECTIONS.USER_SETTINGS, uid);
  await updateDoc(settingsRef, updates);
}

/**
 * @description Creates a new email document
 * @param {string} emailId - Unique email document ID
 * @param {Email} emailData - Email data to store
 * @returns {Promise<void>}
 */
export async function createEmail(emailId: string, emailData: Email): Promise<void> {
  const emailRef = doc(db, COLLECTIONS.EMAILS, emailId);
  await setDoc(emailRef, emailData);
}

/**
 * @description Retrieves an email document by ID
 * @param {string} emailId - Email document ID
 * @returns {Promise<Email | null>} Email data or null if not found
 */
export async function getEmail(emailId: string): Promise<Email | null> {
  const emailRef = doc(db, COLLECTIONS.EMAILS, emailId);
  const emailSnap = await getDoc(emailRef);
  return emailSnap.exists() ? (emailSnap.data() as Email) : null;
}

/**
 * @description Retrieves all emails for a user
 * @param {string} userId - User's Firebase Auth UID
 * @param {number} maxResults - Maximum number of emails to return
 * @returns {Promise<Email[]>} Array of user's emails
 */
export async function getUserEmails(
  userId: string,
  maxResults: number = 50
): Promise<Email[]> {
  const emailsRef = collection(db, COLLECTIONS.EMAILS);
  const q = query(
    emailsRef,
    where('user_id', '==', userId),
    orderBy('created_at', 'desc'),
    limit(maxResults)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Email);
}

/**
 * @description Updates an email document
 * @param {string} emailId - Email document ID
 * @param {Partial<Email>} updates - Email fields to update
 * @returns {Promise<void>}
 */
export async function updateEmail(
  emailId: string,
  updates: Partial<Email>
): Promise<void> {
  const emailRef = doc(db, COLLECTIONS.EMAILS, emailId);
  await updateDoc(emailRef, updates);
}

/**
 * @description Deletes all user data (for account deletion)
 * @param {string} uid - User's Firebase Auth UID
 * @returns {Promise<void>}
 */
export async function deleteUserData(uid: string): Promise<void> {
  // Delete user document
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  await deleteDoc(userRef);

  // Delete user settings
  const settingsRef = doc(db, COLLECTIONS.USER_SETTINGS, uid);
  await deleteDoc(settingsRef);

  // Note: In production, you'd also need to delete all user's emails
  // This would require a cloud function or batch operation
} 