/**
 * @fileoverview Smart email templates API route
 * @description Generates contextual email templates based on email context and user preferences
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { SmartTemplate, TemplateContext } from '../../../../features/ai/types';

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
 * @description Template categories and their descriptions
 */
const TEMPLATE_CATEGORIES = {
  greeting: 'Professional email greetings and openers',
  closing: 'Professional email closings and sign-offs',
  'follow-up': 'Follow-up email templates for various situations',
  request: 'Templates for making requests professionally',
  meeting: 'Meeting invitation and scheduling templates',
  response: 'Response templates for different types of emails'
} as const;

/**
 * @description Builds context-aware template generation prompt
 */
function buildTemplatePrompt(context: TemplateContext): string {
  const basePrompt = `You are an expert email template generator. Generate 3-5 professional email templates based on the provided context.`;
  
  let contextPrompt = basePrompt;
  contextPrompt += ` Email type: ${context.email_type}.`;
  contextPrompt += ` Recipient relationship: ${context.recipient_relationship}.`;
  contextPrompt += ` Formality level: ${context.formality}.`;
  contextPrompt += ` Purpose: ${context.purpose}.`;
  contextPrompt += ` Urgency: ${context.urgency}.`;

  contextPrompt += ` 

Return ONLY a JSON array of template objects with this exact structure:
[
  {
    "title": "Brief descriptive title",
    "content": "Full email template text",
    "category": "greeting|closing|follow-up|request|meeting|response"
  }
]

Make templates concise, professional, and directly applicable. Include placeholders like [Name], [Company], [Date] where appropriate.`;

  return contextPrompt;
}

/**
 * @description Builds quick templates for common scenarios
 */
function getQuickTemplates(context: TemplateContext): SmartTemplate[] {
  const templates: SmartTemplate[] = [];
  const baseId = Date.now();

  // Common greeting templates
  if (context.formality === 'formal') {
    templates.push({
      id: `template_${baseId}_1`,
      title: 'Formal Greeting',
      content: 'Dear [Name],\n\nI hope this email finds you well.',
      category: 'greeting',
      context: 'Formal email opener',
      usage_count: 0,
      last_used: new Date().toISOString(),
      personalized: false
    });
  } else if (context.formality === 'casual') {
    templates.push({
      id: `template_${baseId}_2`,
      title: 'Casual Greeting',
      content: 'Hi [Name],\n\nHope you\'re doing well!',
      category: 'greeting',
      context: 'Casual email opener',
      usage_count: 0,
      last_used: new Date().toISOString(),
      personalized: false
    });
  }

  // Request templates
  if (context.purpose === 'request') {
    templates.push({
      id: `template_${baseId}_3`,
      title: 'Polite Request',
      content: 'I would appreciate your assistance with [specific request]. Would it be possible to [action needed] by [deadline]?',
      category: 'request',
      context: 'Professional request template',
      usage_count: 0,
      last_used: new Date().toISOString(),
      personalized: false
    });
  }

  // Meeting templates
  if (context.purpose === 'meeting') {
    templates.push({
      id: `template_${baseId}_4`,
      title: 'Meeting Request',
      content: 'I would like to schedule a meeting to discuss [topic]. Are you available [time options]? The meeting should take approximately [duration].',
      category: 'meeting',
      context: 'Meeting scheduling template',
      usage_count: 0,
      last_used: new Date().toISOString(),
      personalized: false
    });
  }

  // Closing templates
  templates.push({
    id: `template_${baseId}_5`,
    title: context.formality === 'formal' ? 'Formal Closing' : 'Professional Closing',
    content: context.formality === 'formal' 
      ? 'Thank you for your time and consideration.\n\nBest regards,\n[Your Name]'
      : 'Thanks!\n\nBest,\n[Your Name]',
    category: 'closing',
    context: `${context.formality} email closing`,
    usage_count: 0,
    last_used: new Date().toISOString(),
    personalized: false
  });

  return templates;
}

/**
 * @description POST handler for template generation
 */
export async function POST(request: NextRequest) {
  try {
    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured, using quick templates only');
      const body: TemplateContext = await request.json();
      const quickTemplates = getQuickTemplates(body);
      return NextResponse.json(quickTemplates);
    }

    // Parse request body
    const body: TemplateContext = await request.json();

    // Validate required fields
    if (!body.email_type || !body.purpose || !body.formality) {
      return NextResponse.json(
        { error: 'Missing required fields: email_type, purpose, formality' },
        { status: 400 }
      );
    }

    try {
      // Build prompt and call OpenAI
      const prompt = buildTemplatePrompt(body);
      const openai = getOpenAIClient();
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      });

      const response = completion.choices[0]?.message?.content?.trim();
      
      if (!response) {
        throw new Error('No templates generated');
      }

      // Parse AI response
      const aiTemplates = JSON.parse(response);
      
      // Convert to SmartTemplate format
      const templates: SmartTemplate[] = aiTemplates.map((template: any, index: number) => ({
        id: `ai_template_${Date.now()}_${index}`,
        title: template.title,
        content: template.content,
        category: template.category,
        context: `AI-generated for ${body.purpose} email`,
        usage_count: 0,
        last_used: new Date().toISOString(),
        personalized: true
      }));

      return NextResponse.json(templates);

    } catch (aiError) {
      // Fallback to quick templates if AI fails
      console.warn('AI template generation failed, using quick templates:', aiError);
      const quickTemplates = getQuickTemplates(body);
      return NextResponse.json(quickTemplates);
    }

  } catch (error) {
    console.error('Template generation error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * @description GET handler for retrieving template categories
 */
export async function GET() {
  try {
    return NextResponse.json({
      categories: Object.entries(TEMPLATE_CATEGORIES).map(([key, description]) => ({
        id: key,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        description
      }))
    });
  } catch (error) {
    console.error('Error fetching template categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 