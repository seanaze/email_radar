# @fileoverview
# Project Rules for Email Radar

This document defines the core rules for project structure, file naming, documentation, code style, UI/UX, theme, and non-functional requirements for the Email Radar codebase. All contributors must follow these rules to ensure a modular, scalable, and AI-first codebase that is easy to navigate and maintain.

---

## 1. Directory Structure

- Organize code by feature/domain (e.g., `inbox/`, `auth/`, `settings/`, `ai/`).
- Separate UI components, hooks, utilities, and state slices into their own subdirectories within each feature.
- Place global/shared components in `components/`, utilities in `utils/`, and Redux slices in `state/`.
- All files must be under 500 lines for maximum AI compatibility and maintainability.
- Example structure:

  ```
  src/
    components/
    features/
      inbox/
        InboxList.tsx
        inboxSlice.ts
        useInbox.ts
      auth/
        AuthButton.tsx
        authSlice.ts
        useAuth.ts
    state/
    utils/
    styles/
    pages/ (Next.js app router)
  ```

## 2. File Naming Conventions

- Use descriptive, kebab-case or PascalCase file names (e.g., `email-editor.tsx`, `InboxList.tsx`).
- Name files after the main export (e.g., `EmailEditor.tsx` for the `EmailEditor` component).
- Suffix hooks with `use` (e.g., `useInbox.ts`).
- Suffix Redux slices with `Slice` (e.g., `inboxSlice.ts`).
- Test files: `<name>.test.ts` or `<name>.spec.ts`.
- Styles: `<name>.module.css` or `<name>.ts` for Tailwind config.

## 3. Documentation & Commentation

- Every file must start with an `@fileoverview` comment summarizing its purpose.
- All functions, hooks, and components must have JSDoc/TSDoc block comments describing their purpose, parameters, and return values.
- Use clear, technical language and avoid ambiguous terms.
- Example:
  ```ts
  /**
   * @description Fetches the user's inbox from Gmail.
   * @param {string} userId - The user's unique identifier.
   * @returns {Promise<Email[]>} List of emails.
   */
  async function fetchInbox(userId: string): Promise<Email[]> { ... }
  ```

## 4. Code Style & Structure

- Use functional and declarative programming patterns; avoid classes.
- Prefer iteration and modularization over code duplication (DRY methods).
- Throw errors instead of adding fallback values.
- Use descriptive variable names (e.g., `isLoading`, `hasError`).
- All code must be concise, technical, and readable.
- Use Redux Toolkit for global state management; avoid local state for global features.
- All files must be under 500 lines.

## 5. UI/UX Rules

- Foreground AI-powered features (inline suggestions, context-aware rewrites, etc.).
- Design mobile-first and ensure full responsiveness.
- Prioritize clarity, simplicity, and minimal visual clutter.
- All components must meet WCAG 2.1 AA accessibility standards.
- Provide immediate, animated feedback for user actions.
- Use a consistent icon set and unified style guide for spacing, colors, and typography.
- Display clear, actionable error messages and non-blocking notifications.
- Use skeleton loaders and clear empty state illustrations/messages.
- Modals/dialogs only for critical confirmations, always dismissible.
- Touch targets: minimum 44x44px. Support keyboard shortcuts and focus management.
- Use Tailwind CSS transitions for smooth, non-distracting animations.

## 6. Theme & Design System

- Use glassomorphic design: frosted glass effects, translucency, soft shadows.
- Support both dark and light modes with seamless transitions.
- Use vivid accent colors for highlights and AI features.
- Follow the defined color palette and typography (see `theme-rules.md`).
- Use Tailwind CSS utility classes for rapid, maintainable styling.
- Example classes: `bg-white/60 dark:bg-slate-800/60`, `backdrop-blur-md`, `border border-slate-400/20`, `shadow-lg`, `text-indigo-500`.
- Iconography: outline, minimal, consistent stroke width, accent colors for active/AI features.
- Animations: Tailwind's `transition-all`, `duration-200`, glass fade for surfaces.

## 7. Non-Functional Requirements

- All services must operate on free tiers during development.
- Encrypted token storage; minimal OAuth scopes for least-privilege access.
- Grammar/spell check responses must be < 800 ms for emails ≤ 1,000 words.
- Full WCAG 2.1 AA compliance for all user-facing features.
- Comprehensive unit (Vitest) and e2e (Playwright) tests on critical flows.
- Automated CI/CD with GitHub Actions and Vercel Preview deployments on every push to main.

## 8. User Flow & Experience

- Follow the defined user flow for authentication, inbox navigation, email editing, AI features, saving/sending, settings, and logout (see `user_flow.md`).
- Ensure seamless, AI-first email writing experience with robust error handling and clear feedback at every step.

---

By following these rules, Email Radar will remain modular, scalable, and easy to understand—optimized for both human and AI contributors, and delivering a next-generation, AI-first user experience. 