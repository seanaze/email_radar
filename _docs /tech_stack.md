# @fileoverview
# Technology Stack and Non-Functional Requirements for Email Radar

## Core Technology Stack

| Layer         | Technology                              | Role/Description                                                                 |
|-------------- |-----------------------------------------|---------------------------------------------------------------------------------|
| Frontend      | Next.js, JavaScript, Tailwind CSS        | UI rendering, routing, and styling for a fast, modern web experience             |
| State Mgmt    | Redux Toolkit                            | Predictable, scalable state management across the app                            |
| Backend/API   | Next.js API Routes, Node.js              | Serverless API endpoints for business logic and integrations                     |
| Auth          | Firebase Authentication                  | Secure user authentication (Google OAuth)                                        |
| Database      | Firebase Firestore                       | Cloud-hosted, real-time NoSQL database for user and app data                     |
| AI Engine     | OpenAI GPT-4 or Claude                   | AI-powered grammar, style, and rewrite suggestions                               |
| Hosting       | Vercel                                   | Fast, scalable deployment and serverless hosting                                 |
| Testing       | Vitest, Playwright                       | Unit and end-to-end testing for reliability                                      |
| CI/CD         | GitHub Actions, Vercel Preview           | Automated testing and deployment on push to main                                 |

## Technology Descriptions

--Frontend-- 
- **Next.js**: React-based framework for SSR, routing, and API endpoints. (industry standard)
- Vite + React (Faster dev build, more flexible but less opinionated than Next.js) (popular alternative)

--State Management-- 
- **Redux Toolkit**: Simplifies and standardizes state management.(industry standard) (predictable & scalable, widely adopted in React ecosystem)
- Recoil (popular alternative) (simpler, more React-like, good for local and global state) 

--Backend/API--
- **Next.js API**: Routes (Serverless, intergrated with frontend, easy for smll/medium apps, easy to deploy serverless funciton especially on Vercel) (industry standard)
Express.js (Classic Node.js framework, more control, widely used for REST APIs) (popular alternative)

--Authentication-- 
- **Firebase Authentication**: Handles secure OAuth sign-in and session management. (Easy OAuth, social logins, managed service) (industry Standard)
- Auth0 (Enterprice-ready, more customizable, supports many providers) (popular alternative) 

--Database-- 
- **Firebase Firestore**: Real-time, scalable NoSQL database for storing user data and app state. (industry standard, managed by google)
- MongoDB Atlas (NoSQL, flexible schema, managed cloud service)

--AI Engine-- 
- **OpenAI GPT-4 / Claude**: Provides advanced AI for grammar, style, and rewrite features.

--Hosting-- 
- **Vercel**: Deploys and hosts the app with serverless scaling and preview environment

--Testing-- 
- **Vitest**: Fast, modern unit testing framework for JavaScript/TypeScript.
- **Playwright**: Automated end-to-end browser testing for critical user flows.

--CI/CD--
- **GitHub Actions**: Automates CI/CD pipelines, running tests and deploying previews on code changes.


--Language-- 
- **JavaScript / TypeScript**: Type-safe modern programming language options 

--Styling Framework-- 
- **Tailwind CSS**: Utility-first CSS for rapid, accessible UI dev. 

## Non-Functional Requirements

- **Cost**: All services must operate on free tiers during development (zero cash outlay).
- **Security**: Encrypted token storage; minimal OAuth scopes for least-privilege access.
- **Performance**: Grammar/spell check responses must be < 800 ms for emails ≤ 1,000 words.
- **Accessibility**: Full WCAG 2.1 AA compliance for all user-facing features.
- **Testing**: Comprehensive unit (Vitest) and e2e (Playwright) tests on critical flows.
- **CI/CD**: Automated with GitHub Actions and Vercel Preview deployments on every push to main.

---

This stack and requirements ensure Email Radar is modern, secure, scalable, and accessible, with a strong focus on developer velocity and user experience.
