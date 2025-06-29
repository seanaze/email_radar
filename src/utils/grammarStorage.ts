/**
 * @fileoverview Local storage utilities for grammar corrections
 * @description Manages grammar corrections in browser storage for fast, ephemeral access
 */

/**
 * @description Grammar correction structure for local storage
 */
export interface GrammarCorrection {
  id: string;
  original_text: string;
  suggested_text: string;
  rule_id: string;
  offset: number;
  length: number;
  accepted?: boolean;
  applied_at?: string; // ISO timestamp
  context?: string;
}

/**
 * @description AI enhancement structure for local storage
 */
export interface AiEnhancement {
  id: string;
  type: 'rewrite' | 'template' | 'completion' | 'style';
  input_text: string;
  output_text: string;
  context?: string;
  accepted?: boolean;
  created_at: string; // ISO timestamp
}

/**
 * @description Gets grammar corrections for an email from local storage
 * @param {string} emailId - Email identifier
 * @returns {GrammarCorrection[]} Array of grammar corrections
 */
export function getGrammarCorrections(emailId: string): GrammarCorrection[] {
  try {
    const stored = localStorage.getItem(`grammar_${emailId}`);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to parse grammar corrections from localStorage:', error);
    return [];
  }
}

/**
 * @description Saves grammar corrections for an email to local storage
 * @param {string} emailId - Email identifier
 * @param {GrammarCorrection[]} corrections - Array of corrections to save
 */
export function saveGrammarCorrections(emailId: string, corrections: GrammarCorrection[]): void {
  try {
    localStorage.setItem(`grammar_${emailId}`, JSON.stringify(corrections));
  } catch (error) {
    console.error('Failed to save grammar corrections to localStorage:', error);
  }
}

/**
 * @description Adds a new grammar correction for an email
 * @param {string} emailId - Email identifier
 * @param {Omit<GrammarCorrection, 'id'>} correction - Correction data without ID
 * @returns {string} Generated correction ID
 */
export function addGrammarCorrection(
  emailId: string, 
  correction: Omit<GrammarCorrection, 'id'>
): string {
  const corrections = getGrammarCorrections(emailId);
  const id = `correction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const newCorrection: GrammarCorrection = {
    ...correction,
    id,
  };
  
  corrections.push(newCorrection);
  saveGrammarCorrections(emailId, corrections);
  
  return id;
}

/**
 * @description Updates a grammar correction (e.g., mark as accepted)
 * @param {string} emailId - Email identifier
 * @param {string} correctionId - Correction ID to update
 * @param {Partial<GrammarCorrection>} updates - Fields to update
 */
export function updateGrammarCorrection(
  emailId: string,
  correctionId: string,
  updates: Partial<GrammarCorrection>
): void {
  const corrections = getGrammarCorrections(emailId);
  const index = corrections.findIndex(c => c.id === correctionId);
  
  if (index !== -1) {
    corrections[index] = { ...corrections[index], ...updates };
    if (updates.accepted) {
      corrections[index].applied_at = new Date().toISOString();
    }
    saveGrammarCorrections(emailId, corrections);
  }
}

/**
 * @description Gets AI enhancements for an email from local storage
 * @param {string} emailId - Email identifier
 * @returns {AiEnhancement[]} Array of AI enhancements
 */
export function getAiEnhancements(emailId: string): AiEnhancement[] {
  try {
    const stored = localStorage.getItem(`ai_${emailId}`);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to parse AI enhancements from localStorage:', error);
    return [];
  }
}

/**
 * @description Saves AI enhancements for an email to local storage
 * @param {string} emailId - Email identifier
 * @param {AiEnhancement[]} enhancements - Array of enhancements to save
 */
export function saveAiEnhancements(emailId: string, enhancements: AiEnhancement[]): void {
  try {
    localStorage.setItem(`ai_${emailId}`, JSON.stringify(enhancements));
  } catch (error) {
    console.error('Failed to save AI enhancements to localStorage:', error);
  }
}

/**
 * @description Adds a new AI enhancement for an email
 * @param {string} emailId - Email identifier
 * @param {Omit<AiEnhancement, 'id'>} enhancement - Enhancement data without ID
 * @returns {string} Generated enhancement ID
 */
export function addAiEnhancement(
  emailId: string,
  enhancement: Omit<AiEnhancement, 'id'>
): string {
  const enhancements = getAiEnhancements(emailId);
  const id = `enhancement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const newEnhancement: AiEnhancement = {
    ...enhancement,
    id,
  };
  
  enhancements.push(newEnhancement);
  saveAiEnhancements(emailId, enhancements);
  
  return id;
}

/**
 * @description Updates an AI enhancement (e.g., mark as accepted)
 * @param {string} emailId - Email identifier
 * @param {string} enhancementId - Enhancement ID to update
 * @param {Partial<AiEnhancement>} updates - Fields to update
 */
export function updateAiEnhancement(
  emailId: string,
  enhancementId: string,
  updates: Partial<AiEnhancement>
): void {
  const enhancements = getAiEnhancements(emailId);
  const index = enhancements.findIndex(e => e.id === enhancementId);
  
  if (index !== -1) {
    enhancements[index] = { ...enhancements[index], ...updates };
    saveAiEnhancements(emailId, enhancements);
  }
}

/**
 * @description Clears all grammar corrections and AI enhancements for an email
 * @param {string} emailId - Email identifier
 */
export function clearEmailSuggestions(emailId: string): void {
  localStorage.removeItem(`grammar_${emailId}`);
  localStorage.removeItem(`ai_${emailId}`);
}

/**
 * @description Clears all stored suggestions (useful for logout/cleanup)
 */
export function clearAllSuggestions(): void {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('grammar_') || key.startsWith('ai_')) {
      localStorage.removeItem(key);
    }
  });
} 