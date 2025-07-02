/**
 * @fileoverview Firebase configuration and initialization for Email Radar
 * @description Configures Firebase app, auth, and firestore using environment variables
 */

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

/**
 * @description Firebase configuration object using environment variables
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

/**
 * @description Initialize Firebase app
 * Temporarily disabled - using Supabase for authentication
 */
// const app = initializeApp(firebaseConfig)

/**
 * @description Firebase Authentication instance
 * Temporarily disabled - using Supabase for authentication
 */
// export const auth = getAuth(app)

/**
 * @description Firestore database instance
 * Temporarily disabled - using Supabase for authentication
 */
// export const db = getFirestore(app)

// export default app

// Temporary exports to prevent import errors
export const auth = null as any
export const db = null as any
const app = null as any
export default app