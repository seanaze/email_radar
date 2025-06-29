# @fileoverview
Brief overview, user flow, tech stack, and conventions for the Email Radar project.

---

# Email Radar

Email Radar is a next-generation, AI-first assistant for email composition. It integrates directly with Gmail to deliver inline grammar/style corrections and AI-powered rewrites, surpassing traditional tools like Grammarly. The project is designed for modularity, scalability, and maximum compatibility with modern AI tools.

## Core Features
- Google OAuth sign-in and inbox listing
- Real-time grammar & spell checking (custom nspell engine)
- Inline accept/reject of fixes with diff UI
- Save updated drafts back to Gmail
- Context-aware rewrites powered by LLM (AI)
- Personalized style recommendations
- Semantic search of past emails and corrections
- Smart templates & auto-completion

## User Flow
1. **Authentication:** Sign in with Google (OAuth). Redirect to inbox on success.
2. **Inbox Browsing:** List, filter, and search emails. Select drafts or messages to edit.
3. **Editing:** Real-time grammar/spell check, inline suggestions, AI-powered rewrites.
4. **Saving/Sending:** Save drafts or send emails directly. Success/error feedback.
5. **Settings:** Adjust suggestion aggressiveness, language, and personalization.
6. **Logout:** Secure sign-out, clear sensitive data.

See [`_docs/user_flow.md`](./_docs/user_flow.md) for full details.

## Technology Stack
- **Frontend:** Next.js, JavaScript, Tailwind CSS
- **State Management:** Redux Toolkit
- **Backend/API:** Next.js API Routes, Node.js
- **Auth:** Firebase Authentication (Google OAuth)
- **Database:** Firebase Firestore
- **AI Engine:** OpenAI GPT-4 or Claude
- **Hosting:** Vercel
- **Testing:** Vitest, Playwright
- **CI/CD:** GitHub Actions, Vercel Preview

See [`_docs/tech_stack.md`](./_docs/tech_stack.md) for more details.

## Project Conventions
- **File Structure:** Organized by feature/domain (e.g., `inbox/`, `auth/`, `settings/`, `ai/`). Shared code in `components/`, `utils/`, `state/`.
- **File Size:** All files < 500 lines for AI compatibility.
- **Naming:** Descriptive, kebab-case or PascalCase. Hooks: `useX.ts`. Redux: `xSlice.ts`.
- **Documentation:** Every file starts with `@fileoverview`. All functions/components use JSDoc/TSDoc.
- **Code Style:** Functional, declarative, DRY. Descriptive variable names (e.g., `isLoading`). Throw errors, no fallback values.
- **UI/UX:** Mobile-first, accessible (WCAG 2.1 AA), glassmorphic design, animated feedback, clear error states.
- **Theme:** Light/dark mode, vivid accents, Tailwind CSS utility classes.
- **Testing:** Unit (Vitest) and e2e (Playwright) tests on critical flows.
- **CI/CD:** Automated with GitHub Actions and Vercel Preview.

See [`_docs/project-rules.md`](./_docs/project-rules.md) for all conventions and rules.

---

This project is modular, scalable, and optimized for both human and AI contributors. For more, see the `_docs/` directory.
