# @fileoverview
# Phase 1: Setup – Barebones Framework

This document defines the scope and deliverables for the initial setup phase of Email Radar. The goal is to establish a minimal, running framework that lays the foundation for all future development. This phase does not deliver a usable product, but ensures the project is ready for rapid iteration.

---

## Scope
- Establish a working codebase with the essential structure, tools, and configuration required for development.
- No user-facing features or business logic are included in this phase.

## Deliverables

### 1. Repository & Tooling
- [ ] Initialize Git repository and push to remote (GitHub).
- [ ] Add README with project overview and tech stack.
- [ ] Set up .gitignore and basic project structure (`src/`, `components/`, `features/`, etc.).
- [ ] Configure Prettier, ESLint, and basic linting rules.
- [ ] Add initial CI workflow (GitHub Actions) for linting and test stubs.

### 2. Framework & Core Dependencies
- [ ] Scaffold Next.js app with App Router and TypeScript.
- [ ] Install and configure Tailwind CSS.
- [ ] Set up Redux Toolkit for state management.
- [ ] Add Vitest and Playwright for testing (with example test files).
- [ ] Add basic Vercel deployment configuration.

### 3. Project Rules & Documentation
- [ ] Add `_docs/` directory with project-rules.md, tech-stack.md, and other foundational docs.
- [ ] Add @fileoverview headers to all new files.
- [ ] Document directory structure and naming conventions in project-rules.md.

---

By the end of Phase 1, the project will have a clean, modular foundation with all core tools and structure in place, ready for feature development in the MVP phase. 