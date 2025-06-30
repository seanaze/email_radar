/**
 * @fileoverview Grammar checking utilities using nspell
 * @description Provides real-time spell checking and basic grammar checking for email composition
 */

import NSpell from 'nspell';
import englishWords from 'an-array-of-english-words';

/**
 * @description Grammar suggestion interface
 */
export interface GrammarSuggestion {
  id: string;
  type: 'correctness' | 'clarity' | 'engagement' | 'delivery';
  category: string;
  original_text: string;
  suggested_text: string;
  alternatives?: string[];
  offset: number;
  length: number;
  confidence: number;
  explanation: string;
  rule_description: string;
}

/**
 * @description Grammar checker class for spell checking and basic grammar rules
 */
class GrammarChecker {
  private spellChecker: NSpell;
  private initialized: boolean = false;

  constructor() {
    // Initialize with empty dictionary, will be populated later
    this.spellChecker = NSpell([]);
    this.initializeSpellChecker();
  }

  /**
   * @description Initializes the spell checker with English dictionary
   */
  private async initializeSpellChecker() {
    try {
      // Use the simplified English words list
      const dictionary = englishWords.join('\n');
      this.spellChecker = NSpell(dictionary);
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize spell checker:', error);
    }
  }

  /**
   * @description Checks if the spell checker is ready
   */
  public isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * @description Checks text for spelling errors
   * @param {string} text - Text to check
   * @returns {GrammarSuggestion[]} Array of spelling suggestions
   */
  public checkSpelling(text: string): GrammarSuggestion[] {
    if (!this.initialized) {
      return [];
    }

    const suggestions: GrammarSuggestion[] = [];
    const words = this.extractWords(text);

    words.forEach(({ word, offset }) => {
      if (!this.spellChecker.correct(word)) {
        const alternatives = this.spellChecker.suggest(word).slice(0, 3);
        
        suggestions.push({
          id: `spell_${offset}_${Date.now()}`,
          type: 'correctness',
          category: 'spelling',
          original_text: word,
          suggested_text: alternatives[0] || word,
          alternatives,
          offset,
          length: word.length,
          confidence: 0.8,
          explanation: `"${word}" may be misspelled`,
          rule_description: 'Spell check',
        });
      }
    });

    return suggestions;
  }

  /**
   * @description Checks text for capitalization errors
   * @param {string} text - Text to check
   * @returns {GrammarSuggestion[]} Array of capitalization suggestions
   */
  public checkCapitalization(text: string): GrammarSuggestion[] {
    const suggestions: GrammarSuggestion[] = [];
    
    // Check sentence starts
    const sentences = text.split(/[.!?]+\s*/);
    let currentOffset = 0;

    sentences.forEach((sentence) => {
      const trimmed = sentence.trim();
      if (trimmed.length > 0 && trimmed[0] !== trimmed[0].toUpperCase()) {
        const corrected = trimmed[0].toUpperCase() + trimmed.slice(1);
        
        suggestions.push({
          id: `cap_${currentOffset}_${Date.now()}`,
          type: 'correctness',
          category: 'capitalization',
          original_text: trimmed[0],
          suggested_text: corrected[0],
          alternatives: [corrected[0]],
          offset: text.indexOf(trimmed, currentOffset),
          length: 1,
          confidence: 0.9,
          explanation: 'Sentences should start with a capital letter',
          rule_description: 'Sentence capitalization',
        });
      }
      currentOffset += sentence.length + 1;
    });

    return suggestions;
  }

  /**
   * @description Checks text for punctuation errors
   * @param {string} text - Text to check
   * @returns {GrammarSuggestion[]} Array of punctuation suggestions
   */
  public checkPunctuation(text: string): GrammarSuggestion[] {
    const suggestions: GrammarSuggestion[] = [];
    
    // Check for missing periods at end of sentences
    const sentences = text.split('\n').filter(line => line.trim().length > 0);
    
    sentences.forEach((sentence, index) => {
      const trimmed = sentence.trim();
      if (trimmed.length > 10 && !/[.!?]$/.test(trimmed)) {
        suggestions.push({
          id: `punct_${index}_${Date.now()}`,
          type: 'correctness',
          category: 'punctuation',
          original_text: trimmed,
          suggested_text: trimmed + '.',
          alternatives: [trimmed + '.'],
          offset: text.indexOf(trimmed),
          length: trimmed.length,
          confidence: 0.7,
          explanation: 'Consider ending the sentence with punctuation',
          rule_description: 'Sentence punctuation',
        });
      }
    });

    // Check for double spaces
    const doubleSpaceRegex = /  +/g;
    let match;
    while ((match = doubleSpaceRegex.exec(text)) !== null) {
      suggestions.push({
        id: `space_${match.index}_${Date.now()}`,
        type: 'correctness',
        category: 'spacing',
        original_text: match[0],
        suggested_text: ' ',
        alternatives: [' '],
        offset: match.index,
        length: match[0].length,
        confidence: 0.9,
        explanation: 'Remove extra spaces',
        rule_description: 'Double spacing',
      });
    }

    return suggestions;
  }

  /**
   * @description Checks text for repeated words
   * @param {string} text - Text to check
   * @returns {GrammarSuggestion[]} Array of repeated word suggestions
   */
  public checkRepeatedWords(text: string): GrammarSuggestion[] {
    const suggestions: GrammarSuggestion[] = [];
    const words = this.extractWords(text);
    
    for (let i = 0; i < words.length - 1; i++) {
      const currentWord = words[i].word.toLowerCase();
      const nextWord = words[i + 1].word.toLowerCase();
      
      if (currentWord === nextWord && currentWord.length > 2) {
        const fullMatch = `${words[i].word} ${words[i + 1].word}`;
        
        suggestions.push({
          id: `repeat_${words[i].offset}_${Date.now()}`,
          type: 'correctness',
          category: 'repeated_word',
          original_text: fullMatch,
          suggested_text: words[i].word,
          alternatives: [words[i].word],
          offset: words[i].offset,
          length: fullMatch.length,
          confidence: 0.8,
          explanation: `"${currentWord}" is repeated`,
          rule_description: 'Repeated words',
        });
      }
    }

    return suggestions;
  }

  /**
   * @description Performs comprehensive grammar checking
   * @param {string} text - Text to check
   * @returns {GrammarSuggestion[]} Array of all grammar suggestions
   */
  public checkText(text: string): GrammarSuggestion[] {
    if (!text.trim()) {
      return [];
    }

    const suggestions: GrammarSuggestion[] = [
      ...this.checkSpelling(text),
      ...this.checkCapitalization(text),
      ...this.checkPunctuation(text),
      ...this.checkRepeatedWords(text),
    ];

    // Sort by offset to maintain text order
    return suggestions.sort((a, b) => a.offset - b.offset);
  }

  /**
   * @description Extracts words from text with their positions
   * @param {string} text - Text to extract words from
   * @returns {Array} Array of word objects with word and offset
   */
  private extractWords(text: string): Array<{ word: string; offset: number }> {
    const words: Array<{ word: string; offset: number }> = [];
    const wordRegex = /\b[a-zA-Z]+\b/g;
    let match;

    while ((match = wordRegex.exec(text)) !== null) {
      words.push({
        word: match[0],
        offset: match.index,
      });
    }

    return words;
  }
}

// Export singleton instance
export const grammarChecker = new GrammarChecker();

/**
 * @description Quick function to check text for grammar issues
 * @param {string} text - Text to check
 * @returns {Promise<GrammarSuggestion[]>} Array of grammar suggestions
 */
export async function checkGrammar(text: string): Promise<GrammarSuggestion[]> {
  // Wait for initialization if needed
  let attempts = 0;
  while (!grammarChecker.isInitialized() && attempts < 10) {
    await new Promise(resolve => setTimeout(resolve, 100));
    attempts++;
  }

  if (!grammarChecker.isInitialized()) {
    console.warn('Grammar checker not initialized');
    return [];
  }

  return grammarChecker.checkText(text);
} 