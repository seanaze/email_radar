/**
 * @fileoverview Example usage of local storage grammar utilities
 * @description Demonstrates the new approach for handling grammar corrections
 */

import {
  getGrammarCorrections,
  addGrammarCorrection,
  updateGrammarCorrection,
  getAiEnhancements,
  addAiEnhancement,
  updateAiEnhancement,
  clearEmailSuggestions,
} from '../utils/grammarStorage';

/**
 * @description Example workflow for handling grammar corrections
 */
export async function exampleGrammarWorkflow() {
  const emailId = 'email_123';
  const originalText = 'Hi, how are you? We need to schedule a meeting for next week.';

  // 1. Get grammar suggestions from LanguageTool API (not stored in database)
  const languageToolResponse = await fetch('https://api.languagetool.org/v2/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      text: originalText,
      language: 'en-US',
    }),
  });
  
  const result = await languageToolResponse.json();

  // 2. Store corrections in local storage (fast, ephemeral)
  result.matches?.forEach((match: any) => {
    addGrammarCorrection(emailId, {
      original_text: match.context.text.substring(match.context.offset, match.context.offset + match.context.length),
      suggested_text: match.replacements[0]?.value || '',
      rule_id: match.rule.id,
      offset: match.offset,
      length: match.length,
      context: match.message,
    });
  });

  // 3. Get corrections from local storage
  const corrections = getGrammarCorrections(emailId);
  console.log('Grammar corrections:', corrections);

  // 4. User accepts a correction
  if (corrections.length > 0) {
    updateGrammarCorrection(emailId, corrections[0].id, { accepted: true });
  }

  // 5. Apply accepted corrections to text
  const acceptedCorrections = getGrammarCorrections(emailId).filter(c => c.accepted);
  let correctedText = originalText;
  
  // Apply corrections in reverse order to maintain offsets
  acceptedCorrections
    .sort((a, b) => b.offset - a.offset)
    .forEach(correction => {
      correctedText = 
        correctedText.substring(0, correction.offset) +
        correction.suggested_text +
        correctedText.substring(correction.offset + correction.length);
    });

  // 6. Save final corrected email to database (only the result, not the corrections)
  await updateEmail(emailId, {
    original_body: originalText,
    corrected_body: correctedText,
  });

  // 7. Optional: Clear suggestions after saving (they're ephemeral)
  clearEmailSuggestions(emailId);

  return correctedText;
}

/**
 * @description Example workflow for AI enhancements
 */
export async function exampleAiWorkflow() {
  const emailId = 'email_123';
  const inputText = 'Hi, how are you doing? We need to schedule a meeting for next week.';

  // 1. Get AI enhancement from OpenAI (expensive, so maybe cache)
  const aiResponse = await fetch('/api/ai/enhance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: inputText,
      type: 'rewrite',
      tone: 'professional',
    }),
  });

  const enhancement = await aiResponse.json();

  // 2. Store in local storage for user review
  const enhancementId = addAiEnhancement(emailId, {
    type: 'rewrite',
    input_text: inputText,
    output_text: enhancement.result,
    context: 'Professional tone enhancement',
    created_at: new Date().toISOString(),
  });

  // 3. User can accept/reject
  const enhancements = getAiEnhancements(emailId);
  console.log('AI enhancements:', enhancements);

  // 4. If user accepts, apply to email
  updateAiEnhancement(emailId, enhancementId, { accepted: true });

  // 5. Save final result to database
  await updateEmail(emailId, {
    corrected_body: enhancement.result,
  });

  return enhancement.result;
}

// Mock functions for example (you'd import these from your actual utils)
async function updateEmail(emailId: string, updates: any) {
  console.log(`Updating email ${emailId}:`, updates);
} 