/**
 * @fileoverview
 * Core API route for text analysis pipeline.
 * Implements three-step analysis: grammar correction, tone analysis, and mirrored response.
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { saveAnalysisHistory } from '@/utils/textHistory';
import { createClient } from '@supabase/supabase-js';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Supabase client for server-side operations (if configured)
const supabaseAdmin = process.env.NEXT_PUBLIC_SUPABASE_URL 
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )
  : null;

// Tone color mapping
const TONE_COLORS: Record<string, string> = {
  friendly: '#10B981', // Green
  formal: '#3B82F6', // Blue
  neutral: '#6B7280', // Gray
  urgent: '#EF4444', // Red
  casual: '#F59E0B', // Amber
  empathetic: '#EC4899', // Pink
  assertive: '#8B5CF6', // Purple
  professional: '#1F2937', // Dark gray
};

/**
 * @description Analyzes text through three-step pipeline
 * @param {NextRequest} req - Request containing text to analyze
 * @returns {Promise<NextResponse>} Analysis results with corrections, tone, and mirrored reply
 */
export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Step 1: Grammar & Punctuation Correction
    const grammarResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a grammar and punctuation expert. Correct any grammar, spelling, or punctuation errors in the text. 
          Return ONLY the corrected text without any explanations or comments.`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const correctedText = grammarResponse.choices[0]?.message?.content || text;

    // Step 2: Tone & Emotion Analysis
    const toneResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Analyze the tone and emotion of this text. 
          Return a JSON object with exactly two fields:
          - "tone": one word from [friendly, formal, neutral, urgent, casual, empathetic, assertive, professional]
          - "description": a brief description of the tone (max 20 words)
          Return ONLY the JSON object.`,
        },
        {
          role: 'user',
          content: correctedText,
        },
      ],
      temperature: 0.5,
      max_tokens: 100,
    });

    let toneLabel = 'neutral';
    let toneDescription = 'Neutral and balanced';
    
    try {
      const toneData = JSON.parse(toneResponse.choices[0]?.message?.content || '{}');
      toneLabel = toneData.tone || 'neutral';
      toneDescription = toneData.description || 'Neutral and balanced';
    } catch (e) {
      console.error('Failed to parse tone response:', e);
    }

    const toneColor = TONE_COLORS[toneLabel] || TONE_COLORS.neutral;

    // Step 3: Mirrored Response Generation
    const mirrorResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Generate a response to this email that mirrors the sender's tone and addresses their key points.
          Keep the response concise and appropriate to the context.
          The response should feel natural and match the energy/formality of the original message.`,
        },
        {
          role: 'user',
          content: correctedText,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const mirroredReply = mirrorResponse.choices[0]?.message?.content || '';

    // Save analysis history to Supabase (non-blocking)
    saveAnalysisHistory({
      originalText: text,
      correctedText,
      toneLabel,
      toneColor,
      mirroredResponse: mirroredReply,
    }).catch(err => console.error('Failed to save analysis history:', err));

    // Return all three results
    return NextResponse.json({
      correctedText,
      toneLabel,
      toneColor,
      toneDescription,
      mirroredReply,
    });

  } catch (error) {
    console.error('Error in text analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze text' },
      { status: 500 }
    );
  }
} 