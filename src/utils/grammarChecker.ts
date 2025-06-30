import nspell from 'nspell';

export interface GrammarError {
  text: string;
  type: 'spelling' | 'grammar' | 'punctuation';
  position: { start: number; end: number };
  suggestions: string[];
  message?: string;
}

// Initialize spell checker (in production, you'd load a proper dictionary)
let spellChecker: any = null;

async function initSpellChecker() {
  if (spellChecker) return spellChecker;
  
  // In production, load actual dictionary files
  // For now, we'll use a mock implementation
  spellChecker = {
    correct: (word: string) => {
      // Mock spell checking
      const commonErrors: { [key: string]: string[] } = {
        'recieve': ['receive'],
        'thier': ['their'],
        'occured': ['occurred'],
        'seperate': ['separate'],
        'definately': ['definitely'],
        'tommorow': ['tomorrow'],
        'accomodate': ['accommodate']
      };
      return !commonErrors[word.toLowerCase()];
    },
    suggest: (word: string) => {
      const commonErrors: { [key: string]: string[] } = {
        'recieve': ['receive'],
        'thier': ['their'],
        'occured': ['occurred'],
        'seperate': ['separate'],
        'definately': ['definitely'],
        'tommorow': ['tomorrow'],
        'accomodate': ['accommodate']
      };
      return commonErrors[word.toLowerCase()] || [];
    }
  };
  
  return spellChecker;
}

export async function checkGrammar(text: string): Promise<GrammarError[]> {
  const errors: GrammarError[] = [];
  const checker = await initSpellChecker();
  
  // Split text into words
  const words = text.match(/\b[\w']+\b/g) || [];
  let position = 0;
  
  for (const word of words) {
    const wordStart = text.indexOf(word, position);
    const wordEnd = wordStart + word.length;
    position = wordEnd;
    
    // Check spelling
    if (!checker.correct(word) && word.length > 2) {
      errors.push({
        text: word,
        type: 'spelling',
        position: { start: wordStart, end: wordEnd },
        suggestions: checker.suggest(word),
        message: `"${word}" may be misspelled`
      });
    }
  }
  
  // Basic grammar checks
  // Check for double spaces
  const doubleSpaceRegex = /  +/g;
  let match;
  while ((match = doubleSpaceRegex.exec(text)) !== null) {
    errors.push({
      text: match[0],
      type: 'grammar',
      position: { start: match.index, end: match.index + match[0].length },
      suggestions: [' '],
      message: 'Remove extra spaces'
    });
  }
  
  // Check for missing capital letters after periods
  const sentenceStartRegex = /\. +[a-z]/g;
  while ((match = sentenceStartRegex.exec(text)) !== null) {
    const letter = match[0].slice(-1);
    errors.push({
      text: letter,
      type: 'grammar',
      position: { start: match.index + match[0].length - 1, end: match.index + match[0].length },
      suggestions: [letter.toUpperCase()],
      message: 'Capitalize the first letter of the sentence'
    });
  }
  
  // Check for missing periods at end
  if (text.trim().length > 10 && !text.trim().match(/[.!?]$/)) {
    errors.push({
      text: '',
      type: 'punctuation',
      position: { start: text.length, end: text.length },
      suggestions: ['.'],
      message: 'Consider adding a period at the end'
    });
  }
  
  return errors;
}