/**
 * @fileoverview OpenAI enhancement API route
 * @description Handles AI-powered text enhancement requests using GPT-4
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { AiRequest, AiResponse, AiSuggestionType } from '../../../../features/ai/types';

// Initialize OpenAI client only when needed to avoid build-time errors
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

/**
 * @description System prompts for different enhancement types
 */
const SYSTEM_PROMPTS: Record<AiSuggestionType, string> = {
  rewrite: `You are an expert email writing assistant. Your task is to rewrite the provided text to improve clarity, professionalism, and effectiveness while maintaining the original intent and tone. Keep the rewrite concise and natural.`,
  
  tone: `You are an expert in email tone adjustment. Adjust the tone of the provided text according to the specified style (formal, casual, persuasive, etc.) while preserving the core message and meaning.`,
  
  clarity: `You are an expert editor focused on clarity and conciseness. Improve the provided text by making it clearer, more concise, and easier to understand while preserving all important information.`,
  
  engagement: `You are an expert in persuasive and engaging writing. Enhance the provided text to be more compelling, vivid, and engaging while maintaining professionalism and the original message.`,
  
  delivery: `You are an expert in email flow and readability. Improve the structure, flow, and readability of the provided text to ensure smooth delivery and better comprehension.`
};

/**
 * @description Generates context-aware prompts based on email context
 */
function buildPrompt(request: AiRequest): string {
  const basePrompt = SYSTEM_PROMPTS[request.type];
  let contextualPrompt = basePrompt;

  // Add tone specification if provided
  if (request.tone) {
    contextualPrompt += ` The desired tone is: ${request.tone}.`;
  }

  // Add email context if available
  if (request.email_context) {
    if (request.email_context.subject) {
      contextualPrompt += ` Email subject: "${request.email_context.subject}".`;
    }
    if (request.email_context.recipient) {
      contextualPrompt += ` Recipient context: ${request.email_context.recipient}.`;
    }
  }

  // Add user preferences if available
  if (request.user_preferences?.writing_style) {
    const style = request.user_preferences.writing_style;
    contextualPrompt += ` Writing preferences: ${style.formality} formality, ${style.sentence_length} sentences, ${style.vocabulary} vocabulary.`;
  }

  contextualPrompt += ` Provide only the improved text without explanations or additional commentary.`;

  return contextualPrompt;
}

/**
 * @description Calculates confidence score based on text characteristics
 */
function calculateConfidence(original: string, enhanced: string): number {
  // Simple heuristic for confidence calculation
  const lengthDiff = Math.abs(enhanced.length - original.length) / original.length;
  const wordCountDiff = Math.abs(enhanced.split(' ').length - original.split(' ').length) / original.split(' ').length;
  
  // Lower confidence for dramatic changes
  let confidence = 0.8;
  if (lengthDiff > 0.5) confidence -= 0.2;
  if (wordCountDiff > 0.4) confidence -= 0.1;
  
  // Higher confidence for moderate improvements
  if (lengthDiff < 0.2 && enhanced.length > original.length * 0.8) {
    confidence += 0.1;
  }

  return Math.max(0.3, Math.min(0.95, confidence));
}

/**
 * @description POST handler for AI enhancement requests
 */
export async function POST(request: NextRequest) {
  try {
    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Parse request body
    const body: AiRequest = await request.json();

    // Validate required fields
    if (!body.text || !body.type) {
      return NextResponse.json(
        { error: 'Missing required fields: text and type' },
        { status: 400 }
      );
    }

    // Validate enhancement type
    if (!Object.keys(SYSTEM_PROMPTS).includes(body.type)) {
      return NextResponse.json(
        { error: 'Invalid enhancement type' },
        { status: 400 }
      );
    }

    // Build contextual prompt
    const systemPrompt = buildPrompt(body);

    // Call OpenAI API
    const startTime = Date.now();
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: body.text }
      ],
      temperature: 0.7,
      max_tokens: Math.min(4000, body.text.length * 2), // Reasonable token limit
    });

    const processingTime = Date.now() - startTime;

    // Extract enhanced text
    const enhancedText = completion.choices[0]?.message?.content?.trim();
    
    if (!enhancedText) {
      return NextResponse.json(
        { error: 'No enhancement generated' },
        { status: 500 }
      );
    }

    // Calculate confidence score
    const confidence = calculateConfidence(body.text, enhancedText);

    // Generate explanation based on enhancement type
    const explanations: Record<AiSuggestionType, string> = {
      rewrite: 'Improved overall clarity and professionalism',
      tone: `Adjusted tone to be more ${body.tone || 'appropriate'}`,
      clarity: 'Enhanced clarity and conciseness',
      engagement: 'Made more compelling and engaging',
      delivery: 'Improved flow and readability'
    };

    // Build response
    const response: AiResponse = {
      suggestion: enhancedText,
      confidence,
      explanation: explanations[body.type],
      metadata: {
        model_used: 'gpt-4',
        processing_time: processingTime,
        token_count: completion.usage?.total_tokens || 0,
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('AI enhancement error:', error);
    
    // Handle OpenAI specific errors
    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again in a moment.' },
          { status: 429 }
        );
      }
      
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'API quota exceeded. Please check your OpenAI account.' },
          { status: 402 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 