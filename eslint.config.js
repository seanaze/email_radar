/**
 * @fileoverview
 * ESLint configuration for Next.js with ESLint 9.x flat config
 */

const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const path = require('path');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  // Ignore common directories
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/public/**',
      '**/.git/**',
      '**/dist/**',
      '**/build/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  // Base configuration for all files
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  // Custom rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // Next.js specific
      '@next/next/no-img-element': 'off',
      
      // React hooks
      'react-hooks/exhaustive-deps': 'warn',
      
      // TypeScript
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // General
      'no-unused-vars': 'off', // Handled by @typescript-eslint/no-unused-vars
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
]; 