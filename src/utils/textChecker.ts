/**
 * @fileoverview Custom text checker using nspell for grammar and spell checking
 * @description Implements spelling, capitalization, punctuation, and repeated word checking
 */

import wordList from "an-array-of-english-words"
import nspell from "nspell"

/** --------------------------------------------------------------
 *  Dictionary – loaded once and reused
 * --------------------------------------------------------------*/
// Build a minimal Hunspell‐style dictionary for nspell using the
// existing word list. We generate a simple affix file that only
// defines the required UTF-8 encoding and pass all words (one per
// line) as the dictionary body. The first line of the dictionary
// encodes the word count as required by the Hunspell format.

const WORD_ARRAY = Array.from(new Set(wordList.map((w) => w.toLowerCase())))

// Minimal affix: just declare UTF-8 so nspell is happy.
const AFFIX_DATA = "SET UTF-8\n"

// Hunspell dictionaries start with a line that indicates how many
// entries follow. We concatenate the unique words afterwards.
const DICT_DATA = `${WORD_ARRAY.length}\n${WORD_ARRAY.join("\n")}`

// Create the nspell instance once and reuse it for every invocation.
const SPELLER = nspell({ aff: AFFIX_DATA, dic: DICT_DATA })

/** --------------------------------------------------------------
 *  Regex helpers
 * --------------------------------------------------------------*/
const RE_SENTENCE = /[^.!?]+[.!?]*/g // rough sentence splitter
const RE_REPEAT = /\b(\w+)\b\s+\1\b/gi
const RE_WORD = /\b[a-zA-Z']+\b/g

/**
 * @description Grammar issue interface
 */
export interface Issue {
  type: "Spelling" | "Capitalisation" | "Repeated word" | "Punctuation" | "Sentence start"
  index: number // 0-based character offset
  length: number // length of the problematic text
  message: string
}

/**
 * @description Suggestion interface for UI components
 */
export interface Suggestion {
  id: string
  category: "Correctness" | "Clarity" | "Engagement" | "Delivery"
  title: string
  excerpt: string // simple HTML snippet
  candidates?: string[] // optional replacement list for spelling
  /** 0-based character offset of the start of the problematic word */
  index: number
  /** length of the problematic text */
  length: number
}

/** --------------------------------------------------------------
 *  Grammar checking functions
 * --------------------------------------------------------------*/

/**
 * @description Run all grammar checks against plain text and return Issue objects
 * @param {string} text - Text to check
 * @returns {Issue[]} Array of grammar issues found
 */
function grammarCheck(text: string): Issue[] {
  const issues: Issue[] = []

  /* repeated words --------------------------------------------------*/
  let m: RegExpExecArray | null
  while ((m = RE_REPEAT.exec(text))) {
    issues.push({
      type: "Repeated word",
      index: m.index,
      length: m[0].length,
      message: `Repeated word "${m[1]}".`,
    })
  }

  /* sentence must start with capital --------------------------------*/
  const sentences = text.match(RE_SENTENCE) ?? []
  let cursor = 0
  sentences.forEach((s) => {
    const firstIdx = s.search(/\S/)
    const firstCh = s[firstIdx]
    if (firstCh && firstCh === firstCh.toLowerCase()) {
      issues.push({
        type: "Sentence start",
        index: cursor + firstIdx,
        length: 1,
        message: "Sentence should start with a capital letter.",
      })
    }
    cursor += s.length
  })

  /* trailing punctuation -------------------------------------------*/
  if (!/[.!?]\s*$/.test(text) && text.trim() !== "") {
    issues.push({
      type: "Punctuation",
      index: text.length - 1,
      length: 1,
      message: "Add a period, question mark, or exclamation point.",
    })
  }

  return issues
}

/**
 * @description Check spelling in text
 * @param {string} text - Text to check
 * @returns {Issue[]} Array of spelling issues found
 */
function spellingCheck(text: string): Issue[] {
  const issues: Issue[] = []
  let m: RegExpExecArray | null
  while ((m = RE_WORD.exec(text))) {
    const word = m[0]
    const lower = word.toLowerCase()

    if (!SPELLER.correct(lower)) {
      issues.push({
        type: "Spelling",
        index: m.index,
        length: word.length,
        message: `"${word}" may be misspelled.`,
      })
    }
  }
  return issues
}

/**
 * @description Check capitalization in text
 * @param {string} text - Text to check
 * @returns {Issue[]} Array of capitalization issues found
 */
function capitalisationCheck(text: string): Issue[] {
  const issues: Issue[] = []
  let m: RegExpExecArray | null
  while ((m = RE_WORD.exec(text))) {
    const idx = m.index
    const word = m[0]

    // Determine if start of sentence (previous non-space char)
    const prev = text.slice(0, idx).trimEnd().slice(-1)
    const isStartOfSentence = !prev || /[.!?]/.test(prev)
    if (isStartOfSentence) continue

    const isAllCaps = word === word.toUpperCase()
    const isMixed = !isAllCaps && word !== word.toLowerCase()

    const lower = word.toLowerCase()

    if (isMixed) {
      issues.push({
        type: "Capitalisation",
        index: idx,
        length: word.length,
        message: `Unexpected casing in "${word}".`,
      })
      continue
    }

    if (word[0] === word[0].toUpperCase() && !isAllCaps && SPELLER.correct(lower)) {
      issues.push({
        type: "Capitalisation",
        index: idx,
        length: word.length,
        message: `"${word}" should be lowercase here.`,
      })
    }
  }
  return issues
}

/**
 * @description Get closest word suggestions using Levenshtein distance
 * @param {string} word - Misspelled word
 * @param {number} limit - Maximum number of suggestions
 * @returns {string[]} Array of suggested words
 */
function getClosestWords(word: string, limit = 3): string[] {
  const lower = word.toLowerCase()

  // If the word is known, nothing to suggest.
  if (SPELLER.correct(lower)) return []

  // nspell already returns suggestions ranked by edit distance and
  // other heuristics. Simply take the top results.
  return SPELLER.suggest(lower).slice(0, limit)
}

/**
 * @description Main text checking function that converts issues to suggestions
 * @param {string} text - Text to check
 * @returns {Suggestion[]} Array of suggestions for UI
 */
export function checkText(text: string): Suggestion[] {
  const issues = [
    ...spellingCheck(text),
    ...grammarCheck(text),
    ...capitalisationCheck(text),
  ]

  return issues.map((iss) => {
    let excerpt = iss.message
    let candidates: string[] | undefined

    // Provide replacement preview for sentence capitalisation so the editor can auto-fix it
    if (iss.type === "Sentence start") {
      // Extract the word starting at the issue index
      const tail = text.slice(iss.index)
      const match = tail.match(RE_WORD)
      if (match) {
        const original = match[0]
        const replacement = original.charAt(0).toUpperCase() + original.slice(1)
        excerpt = `<del>${original}</del> → <strong>${replacement}</strong>`
        candidates = [replacement]
      }
    }

    if (iss.type === "Spelling") {
      // Extract the word for candidates
      const word = text.slice(iss.index, iss.index + iss.length)
      candidates = getClosestWords(word, 3)
      if (candidates.length > 0) {
        excerpt = `<del>${word}</del> → <strong>${candidates[0]}</strong>`
      }
    } else if (iss.type === "Punctuation") {
      candidates = [".", "?", "!"]
    } else if (iss.type === "Capitalisation") {
      // Generate case options
      const word = text.slice(iss.index, iss.index + iss.length)
      const lower = word.toLowerCase()
      const proper = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      const upper = word.toUpperCase()
      candidates = Array.from(new Set([lower, proper, upper])).filter((w) => w !== word)

      // Build excerpt replacing current word with lowercase as primary fix
      const primary = candidates[0] ?? lower
      excerpt = `<del>${word}</del> → <strong>${primary}</strong>`
    }

    return {
      id: `${iss.type}-${iss.index}`,
      category: "Correctness", // map all basic errors to Correctness
      title: iss.type,
      excerpt,
      candidates,
      index: iss.index,
      length: iss.length,
    }
  })
}

/**
 * @description Apply a suggestion to text
 * @param {string} text - Original text
 * @param {Suggestion} suggestion - Suggestion to apply
 * @param {string} replacement - Replacement text
 * @returns {string} Updated text
 */
export function applySuggestion(
  text: string, 
  suggestion: Suggestion, 
  replacement: string
): string {
  return (
    text.substring(0, suggestion.index) +
    replacement +
    text.substring(suggestion.index + suggestion.length)
  )
} 