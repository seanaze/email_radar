/**
 * @fileoverview
 * Settings storage utility for persisting user preferences to Supabase or localStorage
 */

import { supabase } from './supabase';

interface SettingsData {
  toneIntensity: number;
  responseStyle: string;
  colorTheme: string;
  activeSetting: string;
  toneCategories: string[];
  creativityLevel: number;
}

const SETTINGS_KEY = 'email-radar-settings';

/**
 * @description Load settings from Supabase or localStorage
 * @returns {Promise<Partial<SettingsData>>} Saved settings or empty object
 */
export async function loadSettings(): Promise<Partial<SettingsData>> {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Load from Supabase
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error || !data) {
        return getDefaultSettings();
      }
      
      return {
        toneIntensity: data.suggestion_aggressiveness || 3,
        responseStyle: data.ai_verbosity || 'balanced',
        colorTheme: data.tone_color_palette || 'vibrant',
        activeSetting: 'tone',
        toneCategories: ['Professional', 'Friendly', 'Urgent', 'Casual', 'Empathetic', 'Confident'],
        creativityLevel: 50
      };
    }
    
    // Fallback to localStorage for anonymous users
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error('Failed to load settings:', error);
    return {};
  }
}

/**
 * @description Save settings to Supabase or localStorage
 * @param {Partial<SettingsData>} settings - Settings to save
 */
export async function saveSettings(settings: Partial<SettingsData>): Promise<void> {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Save to Supabase
      const updates = {
        user_id: user.id,
        suggestion_aggressiveness: settings.toneIntensity,
        ai_verbosity: settings.responseStyle,
        tone_color_palette: settings.colorTheme,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('user_settings')
        .upsert(updates);
        
      if (error) {
        console.error('Failed to save settings to Supabase:', error);
      }
    } else {
      // Fallback to localStorage for anonymous users
      const current = localStorage.getItem(SETTINGS_KEY);
      const currentSettings = current ? JSON.parse(current) : {};
      const updated = { ...currentSettings, ...settings };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    }
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

/**
 * @description Clear all saved settings
 */
export async function clearSettings(): Promise<void> {
  try {
    localStorage.removeItem(SETTINGS_KEY);
    
    // If user is authenticated, reset to defaults in Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await saveSettings(getDefaultSettings());
    }
  } catch (error) {
    console.error('Failed to clear settings:', error);
  }
}

/**
 * @description Get default settings
 * @returns {SettingsData} Default settings object
 */
export function getDefaultSettings(): SettingsData {
  return {
    toneIntensity: 3,
    responseStyle: 'balanced',
    colorTheme: 'vibrant',
    activeSetting: 'tone',
    toneCategories: ['Professional', 'Friendly', 'Urgent', 'Casual', 'Empathetic', 'Confident'],
    creativityLevel: 50
  };
} 