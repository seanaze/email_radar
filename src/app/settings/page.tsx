/**
 * @fileoverview
 * Settings page for Email Radar preferences.
 * Provides user customization options with professional UI and persistence.
 */

'use client';

import { useState, useEffect } from 'react';
import { loadSettings, saveSettings, getDefaultSettings } from '@/utils/settingsStorage';

export default function SettingsPage() {
  const defaults = getDefaultSettings();
  const [activeSetting, setActiveSetting] = useState(defaults.activeSetting);
  const [toneIntensity, setToneIntensity] = useState(defaults.toneIntensity);
  const [responseStyle, setResponseStyle] = useState(defaults.responseStyle);
  const [colorTheme, setColorTheme] = useState(defaults.colorTheme);
  const [toneCategories, setToneCategories] = useState(defaults.toneCategories);
  const [creativityLevel, setCreativityLevel] = useState(defaults.creativityLevel);
  const [hasChanges, setHasChanges] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        const saved = await loadSettings();
        if (saved.activeSetting !== undefined) setActiveSetting(saved.activeSetting);
        if (saved.toneIntensity !== undefined) setToneIntensity(saved.toneIntensity);
        if (saved.responseStyle !== undefined) setResponseStyle(saved.responseStyle);
        if (saved.colorTheme !== undefined) setColorTheme(saved.colorTheme);
        if (saved.toneCategories !== undefined) setToneCategories(saved.toneCategories);
        if (saved.creativityLevel !== undefined) setCreativityLevel(saved.creativityLevel);
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };

    loadUserSettings();
  }, []);

  // Auto-save when settings change
  useEffect(() => {
    if (hasChanges) {
      const autoSave = async () => {
        try {
          const settings = {
            activeSetting,
            toneIntensity,
            responseStyle,
            colorTheme,
            toneCategories,
            creativityLevel
          };
          await saveSettings(settings);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        } catch (error) {
          console.error('Failed to auto-save settings:', error);
        }
      };

      autoSave();
    }
  }, [activeSetting, toneIntensity, responseStyle, colorTheme, toneCategories, creativityLevel, hasChanges]);

  const handleToneCategoryToggle = (category: string) => {
    setToneCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    setHasChanges(true);
  };

  const settingsNav = [
    { id: 'tone', label: 'Tone Analysis', icon: '🎨' },
    { id: 'ai', label: 'AI Response', icon: '🤖' },
    { id: 'theme', label: 'Appearance', icon: '🎨' },
    { id: 'advanced', label: 'Advanced', icon: '⚙️' },
  ];

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 bg-noise opacity-[0.02]"></div>
      </div>

      {/* Decorative orbs */}
      <div className="absolute top-40 -right-20 w-80 h-80 bg-primary-300/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 -left-20 w-64 h-64 bg-secondary-300/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-3">
              Settings
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Customize Email Radar to match your writing style
            </p>
          </div>
          
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Settings Navigation */}
            <div className="lg:col-span-1 animate-slideIn">
              <div className="card-professional p-4">
                <nav className="space-y-1">
                  {settingsNav.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSetting(item.id);
                        setHasChanges(true);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        activeSetting === item.id
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3 animate-slideUp">
              <div className="card-professional p-6 lg:p-8">
                {/* Tone Analysis Settings */}
                {activeSetting === 'tone' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                        Tone Analysis
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400">
                        Configure how Email Radar analyzes emotional tone in your writing
                      </p>
                    </div>

                    {/* Sensitivity Slider */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                        Detection Sensitivity
                      </label>
                      <div className="relative">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={toneIntensity}
                          onChange={(e) => {
                            setToneIntensity(Number(e.target.value));
                            setHasChanges(true);
                          }}
                          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${(toneIntensity - 1) * 25}%, #e2e8f0 ${(toneIntensity - 1) * 25}%, #e2e8f0 100%)`
                          }}
                        />
                        <div className="flex justify-between mt-2 text-xs text-slate-500">
                          <span>Subtle</span>
                          <span>Balanced</span>
                          <span>Detailed</span>
                        </div>
                      </div>
                    </div>

                    {/* Tone Categories */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                        Enabled Tone Categories
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Professional', 'Friendly', 'Urgent', 'Casual', 'Empathetic', 'Confident'].map((tone) => (
                          <label key={tone} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                            <input 
                              type="checkbox" 
                              checked={toneCategories.includes(tone)}
                              onChange={() => handleToneCategoryToggle(tone)}
                              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500" 
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300">{tone}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Response Settings */}
                {activeSetting === 'ai' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                        AI Response Style
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400">
                        Customize how AI generates responses based on your preferences
                      </p>
                    </div>

                    {/* Response Style */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                        Default Response Style
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'concise', label: 'Concise', desc: 'Brief and to the point' },
                          { id: 'balanced', label: 'Balanced', desc: 'Natural length' },
                          { id: 'detailed', label: 'Detailed', desc: 'Comprehensive responses' }
                        ].map((style) => (
                          <button
                            key={style.id}
                            onClick={() => {
                              setResponseStyle(style.id);
                              setHasChanges(true);
                            }}
                            className={`p-4 rounded-xl border transition-all duration-200 ${
                              responseStyle === style.id
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            <p className="font-medium text-slate-900 dark:text-white mb-1">{style.label}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">{style.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Creativity Level */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                        Creativity Level
                      </label>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Conservative</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={creativityLevel}
                          onChange={(e) => {
                            setCreativityLevel(Number(e.target.value));
                            setHasChanges(true);
                          }}
                          className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer"
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Creative</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Theme Settings */}
                {activeSetting === 'theme' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                        Appearance
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400">
                        Personalize the look and feel of Email Radar
                      </p>
                    </div>

                    {/* Color Theme */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                        Color Theme
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { id: 'vibrant', label: 'Vibrant', colors: ['bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500'] },
                          { id: 'pastel', label: 'Pastel', colors: ['bg-pink-300', 'bg-yellow-300', 'bg-green-300', 'bg-blue-300'] },
                          { id: 'monochrome', label: 'Monochrome', colors: ['bg-slate-700', 'bg-slate-600', 'bg-slate-500', 'bg-slate-400'] },
                          { id: 'nature', label: 'Nature', colors: ['bg-green-600', 'bg-green-500', 'bg-blue-500', 'bg-yellow-600'] }
                        ].map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => {
                              setColorTheme(theme.id);
                              setHasChanges(true);
                            }}
                            className={`p-4 rounded-xl border transition-all duration-200 ${
                              colorTheme === theme.id
                                ? 'border-primary-500 shadow-md'
                                : 'border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <div className="flex gap-2 mb-3">
                              {theme.colors.map((color, i) => (
                                <div key={i} className={`w-8 h-8 rounded-full ${color}`}></div>
                              ))}
                            </div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{theme.label}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Advanced Settings */}
                {activeSetting === 'advanced' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                        Advanced Settings
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400">
                        Fine-tune Email Radar for power users
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-6 border border-primary-200 dark:border-primary-800">
                      <p className="text-center text-slate-600 dark:text-slate-400">
                        Advanced features coming soon...
                      </p>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-500">
                    {saved ? '✓ Settings saved' : 'Changes are saved automatically'}
                  </p>
                  <button 
                    onClick={async () => {
                      try {
                        const settings = {
                          activeSetting,
                          toneIntensity,
                          responseStyle,
                          colorTheme,
                          toneCategories,
                          creativityLevel
                        };
                        await saveSettings(settings);
                        setSaved(true);
                        setTimeout(() => setSaved(false), 2000);
                      } catch (error) {
                        console.error('Failed to save settings:', error);
                      }
                    }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 