/**
 * @fileoverview
 * Modal component for selecting receiver archetype
 */

'use client';

import { useState } from 'react';

interface ReceiverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (profile: ReceiverProfile) => void;
}

export interface ReceiverProfile {
  relationship: 'Knows me' | 'Doesn\'t know me';
  attitude: 'Friendly' | 'Neutral' | 'Hostile';
  formality: 'Casual' | 'Formal';
}

/**
 * @description Modal for selecting receiver profile
 * @param {ReceiverModalProps} props - Component props
 * @returns {JSX.Element} Modal UI
 */
export default function ReceiverModal({ isOpen, onClose, onSubmit }: ReceiverModalProps) {
  const [profile, setProfile] = useState<ReceiverProfile>({
    relationship: 'Doesn\'t know me',
    attitude: 'Neutral',
    formality: 'Formal'
  });

  const handleSubmit = () => {
    onSubmit(profile);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative card-professional p-6 max-w-md w-full animate-scaleIn">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          Who's receiving this email?
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Help us provide better analysis by describing your recipient
        </p>

        {/* Questions */}
        <div className="space-y-6">
          {/* Relationship */}
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              1. Relationship with recipient:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setProfile(p => ({ ...p, relationship: 'Knows me' }))}
                className={`p-3 rounded-lg border transition-all ${
                  profile.relationship === 'Knows me'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                Knows me
              </button>
              <button
                onClick={() => setProfile(p => ({ ...p, relationship: 'Doesn\'t know me' }))}
                className={`p-3 rounded-lg border transition-all ${
                  profile.relationship === 'Doesn\'t know me'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                Doesn't know me
              </button>
            </div>
          </div>

          {/* Attitude */}
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              2. Their likely attitude:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setProfile(p => ({ ...p, attitude: 'Friendly' }))}
                className={`p-3 rounded-lg border transition-all ${
                  profile.attitude === 'Friendly'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                😊 Friendly
              </button>
              <button
                onClick={() => setProfile(p => ({ ...p, attitude: 'Neutral' }))}
                className={`p-3 rounded-lg border transition-all ${
                  profile.attitude === 'Neutral'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                😐 Neutral
              </button>
              <button
                onClick={() => setProfile(p => ({ ...p, attitude: 'Hostile' }))}
                className={`p-3 rounded-lg border transition-all ${
                  profile.attitude === 'Hostile'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                😠 Hostile
              </button>
            </div>
          </div>

          {/* Formality */}
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              3. Expected formality:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setProfile(p => ({ ...p, formality: 'Casual' }))}
                className={`p-3 rounded-lg border transition-all ${
                  profile.formality === 'Casual'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                Casual
              </button>
              <button
                onClick={() => setProfile(p => ({ ...p, formality: 'Formal' }))}
                className={`p-3 rounded-lg border transition-all ${
                  profile.formality === 'Formal'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                Formal
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary flex-1"
          >
            Analyze
          </button>
        </div>
      </div>
    </div>
  );
} 