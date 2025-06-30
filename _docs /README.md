# @fileoverview
Brief overview, user flow, tech stack, and conventions for the Email Radar project.

---

# Email Radar

Email Radar is a next-generation, AI-first assistant for email composition. It delivers three levels of AI assistance inside a beautiful text editor—grammar & punctuation correction, tone & emotion analysis with color feedback, and a mirrored response suggestion—surpassing traditional writing helpers like Grammarly and Quillbot.

## Core Features
- Responsive rich-text editor where users can paste or write email content
- One-click grammar & punctuation correction with diff UI (Step 1)
- Color-coded tone and emotion analysis (Step 2)
- AI-generated mirrored response draft that matches the user's tone and context (Step 3)
- Optional profile & settings to save preferences
- Roadmap: Smart Inbox (Gmail integration) and template library (coming soon)

## User Flow
1. **Visit Site:** User lands on Email Radar and clicks "Open Editor".
2. **Compose / Paste:** User writes or pastes their email text into the editor.
3. **Analyze:** User clicks the "Analyze" button to run the three-step AI pipeline.
4. **Review Results:** Corrected text, tone badge, and mirrored reply appear with copy/download actions.
5. **Settings (optional):** User can adjust tone colors, AI verbosity, and other preferences.

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
- **File Structure:** Organized by feature/domain (e.g., `editor/`, `settings/`, `ai/`). Shared code in `components/`, `utils/`, `state/`.
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
