/**
 * @fileoverview
 * Tone badge component for displaying emotional tone analysis
 */

'use client';

interface ToneBadgeProps {
  tone: string;
  color?: string;
  description?: string;
}

const toneConfig: Record<string, { gradient: string; icon: string; description: string }> = {
  friendly: {
    gradient: 'from-yellow-400 to-orange-500',
    icon: '😊',
    description: 'Warm and approachable tone that builds connection'
  },
  professional: {
    gradient: 'from-purple-500 to-purple-700',
    icon: '💼',
    description: 'Formal and business-appropriate communication'
  },
  casual: {
    gradient: 'from-blue-400 to-blue-600',
    icon: '👋',
    description: 'Relaxed and conversational style'
  },
  urgent: {
    gradient: 'from-red-500 to-red-700',
    icon: '🚨',
    description: 'Direct and action-oriented messaging'
  },
  empathetic: {
    gradient: 'from-pink-400 to-pink-600',
    icon: '💝',
    description: 'Understanding and compassionate approach'
  },
  confident: {
    gradient: 'from-green-500 to-green-700',
    icon: '💪',
    description: 'Assertive and self-assured communication'
  },
  neutral: {
    gradient: 'from-slate-400 to-slate-600',
    icon: '📝',
    description: 'Balanced and objective tone'
  }
};

/**
 * @description Displays tone analysis results with color-coded badge
 * @param {ToneBadgeProps} props - Component props
 * @returns {JSX.Element} Tone badge with label and description
 */
export default function ToneBadge({ tone, color, description }: ToneBadgeProps) {
  const config = toneConfig[tone.toLowerCase()] || toneConfig.neutral;
  const displayDescription = description || config.description;

  return (
    <div className="card-professional p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="feature-icon w-10 h-10">
          <svg className="w-5 h-5 text-secondary-600 dark:text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Tone Analysis
        </h3>
      </div>

      <div className="flex items-center gap-4">
        {/* Tone badge */}
        <div 
          className={`inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r ${config.gradient} text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-300`}
          style={color ? { background: color } : undefined}
        >
          <span className="text-xl">{config.icon}</span>
          <span className="text-lg capitalize">{tone}</span>
        </div>

        {/* Visual tone indicator */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`h-6 w-2 rounded-full transition-all duration-300 ${
                    level <= 3 
                      ? `bg-gradient-to-t ${config.gradient}` 
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Intensity: Medium
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {displayDescription}
          </p>
        </div>
      </div>

      {/* Additional insights */}
      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">87%</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Confidence</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">+12</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Positivity</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">A+</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Match</p>
          </div>
        </div>
      </div>
    </div>
  );
} 