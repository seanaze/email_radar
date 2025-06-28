# @fileoverview
# Phase 2: MVP – Minimal Viable Product

This document defines the scope and deliverables for the MVP phase of Email Radar. The goal is to deliver a minimal, usable product that demonstrates the core value: AI-powered email grammar/style correction and Gmail integration.

---

## Scope
- Implement the essential features required for a user to sign in, view their inbox, edit emails, receive grammar/style suggestions, and save changes back to Gmail.
- Ensure the product is usable, reliable, and demonstrates the primary value proposition.

## Deliverables

### 1. Authentication & Onboarding
- [ ] Integrate Firebase Authentication with Google OAuth (read, compose, send scopes).
- [ ] Implement landing page with "Sign in with Google" button and product overview.
- [ ] Handle registration, login, logout, and error states.
- [ ] Redirect unauthenticated users to the landing page.

### 2. Inbox & Navigation
- [ ] Fetch and display user's Gmail inbox (drafts, unread, all emails).
- [ ] Implement sidebar or top navigation (Inbox, Settings, Logout).
- [ ] Support basic filtering (unread, drafts) and search.
- [ ] Preserve navigation state (e.g., last viewed email).

### 3. Email Editing & AI Suggestions
- [ ] Parse selected email (HTML-to-plaintext if needed).
- [ ] Integrate LanguageTool API for real-time grammar and spell checking.
- [ ] Display inline suggestions with accept/reject controls (diff UI).
- [ ] Allow user to apply accepted fixes to the draft.
- [ ] Prompt user before navigating away with unsaved changes.

### 4. Saving & Sending
- [ ] Save updated draft back to Gmail.
- [ ] Optionally, allow sending corrected email from the app.
- [ ] Show success/error notifications after save/send.

### 5. Settings & Personalization
- [ ] Implement settings page (toggle suggestion aggressiveness, change language).
- [ ] Save settings per user (local or Firestore).
- [ ] Provide feedback on save success/failure.

### 6. Testing & Quality
- [ ] Add unit tests for core logic (Vitest).
- [ ] Add e2e tests for critical flows (Playwright).
- [ ] Ensure accessibility (WCAG 2.1 AA) for all user-facing features.

---

By the end of Phase 2, Email Radar will be a functional MVP: users can sign in, view and edit emails, receive AI-powered suggestions, and save/send updates—all within a modern, accessible UI. 