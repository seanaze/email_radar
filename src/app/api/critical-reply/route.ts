/**
 * @fileoverview
 * API route for generating critical replies based on receiver archetype
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Simple in-memory vector store for demo
const knowledgeBase = {
  archetypes: '',
  critiqueRules: '',
  stylePresets: ''
};

// Load knowledge base on startup
async function loadKnowledgeBase() {
  try {
    knowledgeBase.archetypes = await fs.readFile(
      path.join(process.cwd(), 'docs/archetypes.md'), 
      'utf-8'
    );
    knowledgeBase.critiqueRules = await fs.readFile(
      path.join(process.cwd(), 'docs/critique_rules.md'), 
      'utf-8'
    );
    knowledgeBase.stylePresets = await fs.readFile(
      path.join(process.cwd(), 'docs/style_presets.md'), 
      'utf-8'
    );
  } catch (error) {
    console.error('Error loading knowledge base:', error);
  }
}

// Load on startup
loadKnowledgeBase();

/**
 * @description Retrieve relevant context based on receiver profile
 */
function retrieveContext(relationship: string, attitude: string, formality: string) {
  // Simple retrieval - in production, use vector similarity
  const archetypeSection = knowledgeBase.archetypes
    .split('\n')
    .filter(line => 
      line.toLowerCase().includes(relationship.toLowerCase()) ||
      line.toLowerCase().includes(attitude.toLowerCase())
    )
    .slice(0, 10)
    .join('\n');

  return {
    archetype: archetypeSection || 'No specific archetype guidance found.',
    critiqueRules: knowledgeBase.critiqueRules.slice(0, 1000),
    stylePresets: knowledgeBase.stylePresets.slice(0, 500)
  };
}

/**
 * @description Build system prompt with RAG context
 */
function buildSystemPrompt(
  relationship: string, 
  attitude: string, 
  formality: string,
  context: any
) {
  return `You are **Response-Emulator-v1**, a seasoned communicator replying as the person
who RECEIVES the email below.

────────────────────────────────────────
# 1. Situation
Relationship : ${relationship}       # Knows me | Doesn't know me
Attitude    : ${attitude}            # Friendly | Neutral | Hostile
Formality   : ${formality}           # Casual   | Formal

# 2. Knowledge (RAG chunks)
<<ArchetypeGuidance>>
${context.archetype}

<<CritiqueRules>>
${context.critiqueRules}

<<StylePreset>>
${context.stylePresets}

────────────────────────────────────────
# 3. Internal Reflection — answer SILENTLY before writing
• What is the sender's explicit objective?  
• What implied concerns or emotions are present?  
• Where is the message ambiguous or incomplete?  
• Does fulfilling the sender's request require new content not in the email?  
  → If yes, generate concise, context-appropriate content and label it "(Proposed)".  
• How should tone & formality shift given Relationship / Attitude / Formality?

────────────────────────────────────────
# 4. Draft the Output (JSON ONLY)

\`\`\`json
{
  "receiverSummary": "<1-2 sentences: how the receiver interprets the email>",
  "criticalAnalysis": [
    "- Key strength …",
    "- Tone mismatch …",
    "- Missing detail … (ask clarifying question here if needed)"
  ],
  "suggestedReply": "<concise reply, shorter than sender's email; match requested formality>",
  "confidencePct": <integer 0-100>
}
\`\`\``;
}

export async function POST(request: NextRequest) {
  try {
    const { text, relationship, attitude, formality } = await request.json();

    if (!text || !relationship || !attitude || !formality) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Retrieve relevant context
    const context = retrieveContext(relationship, attitude, formality);
    
    // Build system prompt
    const systemPrompt = buildSystemPrompt(relationship, attitude, formality, context);

    // For demo purposes, return a mock response
    // In production, call OpenAI/Claude API here
    const mockResponse = {
      receiverSummary: `The receiver sees this as a ${attitude.toLowerCase()} ${formality.toLowerCase()} communication that ${relationship === 'Knows me' ? 'leverages existing relationship context' : 'requires establishing credibility'}.`,
      criticalAnalysis: [
        `- Key strength: Clear main message in the opening`,
        `- Tone consideration: The ${formality} tone ${attitude === 'Hostile' ? 'may need more empathy' : 'matches expectations'}`,
        `- Missing detail: Consider adding specific timeline or next steps`
      ],
      suggestedReply: `Thank you for your message. ${relationship === 'Knows me' ? 'I appreciate you reaching out about this.' : 'I appreciate you taking the time to contact me.'} ${attitude === 'Hostile' ? 'I understand your concerns and would like to address them.' : 'I\'m happy to help with this matter.'} Could you please clarify the timeline you have in mind? I'll be able to provide a more detailed response once I understand your specific needs.`,
      confidencePct: 85
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('Critical reply error:', error);
    return NextResponse.json(
      { error: 'Failed to generate critical reply' },
      { status: 500 }
    );
  }
} 