# @fileoverview
# Technology Stack and Non-Functional Requirements for Email Radar

## Core Technology Stack

| Layer         | Technology                              | Role/Description                                                                 |
|-------------- |-----------------------------------------|---------------------------------------------------------------------------------|
| Frontend      | Next.js, JavaScript, Tailwind CSS        | UI rendering, routing, and styling for a fast, modern web experience             |
| Editor        | TipTap, ProseMirror                      | Rich text editor with custom extensions for suggestion underlining               |
| State Mgmt    | Redux Toolkit                            | Predictable, scalable state management across the app                            |
| Backend/API   | Next.js API Routes, Node.js              | Serverless API endpoints for business logic and integrations                     |
| Auth          | Firebase Authentication                  | Secure user authentication (Google OAuth)                                        |
| Database      | Firebase Firestore                       | Cloud-hosted, real-time NoSQL database for user and app data                     |
| Grammar       | nspell, Custom Rules                     | Client-side grammar and spell checking for real-time suggestions                 |
| AI Engine     | OpenAI GPT-4                            | AI-powered rewrites, tone adjustment, and style enhancements                     |
| Hosting       | Vercel                                   | Fast, scalable deployment and serverless hosting                                 |
| Testing       | Vitest, Playwright                       | Unit and end-to-end testing for reliability                                      |
| CI/CD         | GitHub Actions, Vercel Preview           | Automated testing and deployment on push to main                                 |

## Technology Descriptions

--Frontend-- 
- **Next.js**: React-based framework for SSR, routing, and API endpoints. (industry standard)
- **TipTap**: Modern rich text editor built on ProseMirror, perfect for custom suggestion underlining

--Editor & Grammar Engine--
- **TipTap**: Headless rich text editor with extensive customization and plugin system
- **ProseMirror Extensions**: Custom extensions for visual suggestion underlining and highlighting
- **nspell**: Fast, client-side spell checker using Hunspell dictionaries for real-time checking
- **Custom Grammar Rules**: Regex-based rules for capitalization, punctuation, and repeated words

--State Management-- 
- **Redux Toolkit**: Simplifies and standardizes state management.(industry standard) (predictable & scalable, widely adopted in React ecosystem)

--Backend/API--
- **Next.js API Routes**: Serverless, integrated with frontend, easy deployment on Vercel (industry standard)

--Authentication-- 
- **Firebase Authentication**: Handles secure OAuth sign-in and session management with Gmail API scopes (industry standard)

--Database-- 
- **Firebase Firestore**: Real-time, scalable NoSQL database for storing user data and app state (industry standard, managed by Google)

--Grammar Libraries--
- **nspell**: Hunspell-compatible spell checker for JavaScript
- **an-array-of-english-words**: English word list for spell checking dictionary

--AI Engine-- 
- **OpenAI GPT-4**: Provides advanced AI for context-aware rewrites, tone adjustment, and style suggestions

--Hosting-- 
- **Vercel**: Deploys and hosts the app with serverless scaling and preview environment

--Testing-- 
- **Vitest**: Fast, modern unit testing framework for JavaScript/TypeScript
- **Playwright**: Automated end-to-end browser testing for critical user flows

--CI/CD--
- **GitHub Actions**: Automates CI/CD pipelines, running tests and deploying previews on code changes.


--Language-- 
- **TypeScript**: Type-safe modern programming for better development experience

--Styling Framework-- 
- **Tailwind CSS**: Utility-first CSS for rapid, accessible UI development with glassomorphic design

## Non-Functional Requirements

- **Cost**: All services must operate on free tiers during development (zero cash outlay).
- **Security**: Encrypted token storage; minimal OAuth scopes for least-privilege access.
- **Performance**: Real-time grammar checking < 300ms, AI suggestions < 2s for optimal editing experience.
- **Editor**: Auto-save with 1-second debounce, suggestion highlighting, smooth animations.
- **Accessibility**: Full WCAG 2.1 AA compliance for all user-facing features.
- **Testing**: Comprehensive unit (Vitest) and e2e (Playwright) tests on critical flows.
- **CI/CD**: Automated with GitHub Actions and Vercel Preview deployments on every push to main.

---

This stack ensures Email Radar delivers a professional, real-time editing experience with immediate grammar feedback and AI-powered enhancements, similar to the polish of modern writing tools.
