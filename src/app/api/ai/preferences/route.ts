/**
 * @fileoverview AI user preferences API route
 * @description Handles AI preferences storage and retrieval in Firestore
 */

import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../utils/firebase';
import { AiPreferences } from '../../../../features/ai/types';

/**
 * @description Default AI preferences for new users
 */
const DEFAULT_AI_PREFERENCES: AiPreferences = {
  enabled: true,
  suggestion_aggressiveness: 3,
  preferred_tone: 'professional',
  auto_apply_high_confidence: false,
  learn_from_corrections: true,
  categories: {
    rewrite: true,
    tone: true,
    clarity: true,
    engagement: true,
    delivery: true,
  },
  writing_style: {
    sentence_length: 'varied',
    formality: 'professional',
    vocabulary: 'moderate',
  },
};

/**
 * @description GET handler for retrieving user AI preferences
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    // Get preferences from Firestore
    const preferencesRef = doc(db, 'ai_preferences', userId);
    const preferencesDoc = await getDoc(preferencesRef);

    if (!preferencesDoc.exists()) {
      // Create default preferences for new user
      await setDoc(preferencesRef, DEFAULT_AI_PREFERENCES);
      return NextResponse.json(DEFAULT_AI_PREFERENCES);
    }

    const preferences = preferencesDoc.data() as AiPreferences;
    return NextResponse.json(preferences);

  } catch (error) {
    console.error('Error fetching AI preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * @description PUT handler for updating user AI preferences
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, updates } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { error: 'Missing or invalid updates object' },
        { status: 400 }
      );
    }

    // Validate updates against AiPreferences interface
    const validFields = [
      'enabled',
      'suggestion_aggressiveness',
      'preferred_tone',
      'auto_apply_high_confidence',
      'learn_from_corrections',
      'categories',
      'writing_style'
    ];

    const invalidFields = Object.keys(updates).filter(
      field => !validFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return NextResponse.json(
        { error: `Invalid fields: ${invalidFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Update preferences in Firestore
    const preferencesRef = doc(db, 'ai_preferences', userId);
    
    // Check if document exists
    const preferencesDoc = await getDoc(preferencesRef);
    
    if (!preferencesDoc.exists()) {
      // Create with defaults and apply updates
      const newPreferences = { ...DEFAULT_AI_PREFERENCES, ...updates };
      await setDoc(preferencesRef, newPreferences);
      return NextResponse.json(updates);
    } else {
      // Update existing preferences
      await updateDoc(preferencesRef, updates);
      return NextResponse.json(updates);
    }

  } catch (error) {
    console.error('Error updating AI preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * @description POST handler for resetting preferences to defaults
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    // Reset to default preferences
    const preferencesRef = doc(db, 'ai_preferences', userId);
    await setDoc(preferencesRef, DEFAULT_AI_PREFERENCES);

    return NextResponse.json(DEFAULT_AI_PREFERENCES);

  } catch (error) {
    console.error('Error resetting AI preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 