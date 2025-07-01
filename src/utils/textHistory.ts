/**
 * @fileoverview
 * Text history management utility for undo/redo functionality and analysis history
 */

import { supabase } from './supabase';

interface HistoryState {
  text: string;
  timestamp: number;
}

interface AnalysisResult {
  originalText: string;
  correctedText?: string;
  toneLabel?: string;
  toneColor?: string;
  mirroredResponse?: string;
}

export class TextHistory {
  private history: HistoryState[] = [];
  private currentIndex: number = -1;
  private maxHistory: number = 50;

  /**
   * @description Add a new state to the history
   * @param {string} text - The text to add to history
   */
  push(text: string): void {
    // Remove any forward history when adding new state
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    // Add new state
    this.history.push({
      text,
      timestamp: Date.now()
    });

    // Limit history size
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    } else {
      this.currentIndex++;
    }
  }

  /**
   * @description Undo to previous state
   * @returns {string | null} Previous text or null if no history
   */
  undo(): string | null {
    if (this.canUndo()) {
      this.currentIndex--;
      return this.history[this.currentIndex].text;
    }
    return null;
  }

  /**
   * @description Redo to next state
   * @returns {string | null} Next text or null if no forward history
   */
  redo(): string | null {
    if (this.canRedo()) {
      this.currentIndex++;
      return this.history[this.currentIndex].text;
    }
    return null;
  }

  /**
   * @description Check if undo is possible
   * @returns {boolean} True if can undo
   */
  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  /**
   * @description Check if redo is possible
   * @returns {boolean} True if can redo
   */
  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  /**
   * @description Clear all history
   */
  clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }

  /**
   * @description Get current state
   * @returns {string | null} Current text or null
   */
  getCurrent(): string | null {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return this.history[this.currentIndex].text;
    }
    return null;
  }
}

/**
 * @description Save analysis result to Supabase
 * @param {AnalysisResult} result - The analysis result to save
 * @returns {Promise<void>}
 */
export async function saveAnalysisHistory(result: AnalysisResult): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const record = {
      user_id: user?.id || null,
      original_text: result.originalText,
      corrected_text: result.correctedText,
      tone_label: result.toneLabel,
      tone_color: result.toneColor,
      mirrored_response: result.mirroredResponse,
      created_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('text_analysis_history')
      .insert(record);
      
    if (error) {
      console.error('Failed to save analysis history:', error);
    }
  } catch (error) {
    console.error('Error saving analysis history:', error);
  }
}

/**
 * @description Load user's analysis history from Supabase
 * @param {number} limit - Maximum number of records to return
 * @returns {Promise<AnalysisResult[]>} Array of analysis results
 */
export async function loadAnalysisHistory(limit: number = 10): Promise<AnalysisResult[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('text_analysis_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error || !data) {
      return [];
    }
    
    return data.map(record => ({
      originalText: record.original_text,
      correctedText: record.corrected_text,
      toneLabel: record.tone_label,
      toneColor: record.tone_color,
      mirroredResponse: record.mirrored_response
    }));
  } catch (error) {
    console.error('Error loading analysis history:', error);
    return [];
  }
} 