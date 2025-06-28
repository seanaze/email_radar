---
description: Email Radar project rules and conventions for AI-first development
globs: "**/*.{ts,tsx,js,jsx}"
alwaysApply: true
---

# Email Radar Project Rules

You are an expert in JavaScript, TypeScript, Node.js, NextJS + App Router, React, Shadcn, Radix UI, Tailwind CSS and Redux Toolkit.

## Core Principles

- **AI-First Codebase**: Modular, scalable, and easy to understand. Optimized for compatibility with semantic and grep/regex searches.
- **File Size Limit**: ALWAYS keep files under 500 lines.
- **Documentation**: ALWAYS use `@fileoverview` at the top of every file to summarize its contents.
- **Naming**: ALWAYS use descriptive file and function names.
- **Comments**: ALWAYS use descriptive block comments for functions (JSDoc block w/ `@description`).
- **Variables**: ALWAYS use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).

## Code Style

- Write concise, technical code.
- Use functional and declarative programming patterns; avoid classes.
- Prefer iteration and modularization over code duplication (DRY methods).
- Throw errors instead of adding fallback values.
- Use Redux Toolkit for global state management.

## File Structure

- Organize by feature/domain (e.g., `features/inbox/`, `features/auth/`, `features/settings/`, `features/ai/`).
- Shared components in `components/`, utilities in `utils/`, state in `state/`.
- Hooks: suffix with `use` (e.g., `useInbox.ts`).
- Redux slices: suffix with `Slice` (e.g., `inboxSlice.ts`).

## UI/UX Requirements

- Mobile-first design with full responsiveness.
- WCAG 2.1 AA accessibility compliance.
- Glassomorphic design with translucency and soft shadows.
- Support dark/light modes.
- Use Tailwind CSS utility classes.
- Provide immediate, animated feedback for user actions.
- Touch targets minimum 44x44px.

## Example Tailwind Classes

- `bg-white/60 dark:bg-slate-800/60`
- `backdrop-blur-md`
- `border border-slate-400/20`
- `shadow-lg`
- `text-indigo-500` 