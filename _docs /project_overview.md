# @fileoverview
## Project Overview for Email Radar

Email Radar is a Grammarly-style assistant focused on email. ~~The goal is to build a web-based assistant that integrates with Gmail to deliver inline grammar/style corrections and AI-powered rewrites for email composition~~

Email Radar is a web-based assistant that gives users instant feedback on any email text they paste or write. It delivers a three-step analysis pipeline—(1) grammar & punctuation fixes, (2) tone/emotion analysis with color cues, and (3) an AI-generated mirrored reply—so users can send clearer, friendlier, and more effective messages.

## Core Use Cases

- Paste or type email text into the editor
- Instantly view grammar & punctuation corrections (Step 1)
- See a color-coded tone and emotion breakdown (Step 2)
- Receive a mirrored response draft tailored to the detected tone (Step 3)
- Copy corrected text or mirrored reply with one click

## Phase 1 – Baseline Assistant

~~Gmail OAuth (read, compose, send scopes).~~
Rich-text email editor with TipTap or similar.
Custom nspell grammar engine for corrections.
UI skeleton for tone analysis & mirrored reply panels.
Settings page (toggle colors & AI verbosity).

## Phase 2 – MVP Text Assistant

Implement the full three-step pipeline with hosted AI.
Add color palette and tone legend.
Add "Copy to clipboard" actions for each output.
Responsive design, light/dark mode, basic analytics.

## Phase 3 – Future Enhancements (Roadmap)

Smart Inbox integration (Gmail API) – list & edit real emails.
Template library and intent detection.
Account system with saved history.

## Phase 2 – AI Enhancement

Context-aware rewrites powered by an LLM
Personalized style recommendations based on user goals
Semantic search of past emails and corrections
Smart templates & auto-completion for quick replies

## Ultimate Goal

Deliver a next-generation email-writing assistant that surpasses traditional grammar tools by demonstrates how AI-first principles and modern language models can revolutionize writing assistance—surpassing the capabilities of traditional tools like Grammarly.

