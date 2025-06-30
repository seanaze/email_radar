# @fileoverview
# Phase 2: MVP – Text Analysis Assistant

This document defines the scope and deliverables for the MVP phase of Email Radar. The goal is to deliver a presentable, functional text-analysis assistant that demonstrates clear value: grammar correction, tone analysis, and an AI-generated mirrored reply, similar in polish to Quillbot or Grammarly.

---

## Scope
- Build a complete text-entry and analysis experience
- Implement custom grammar checking (nspell-based or AI fallback)
- Add tone & emotion analysis with color legend
- Generate mirrored response drafts with LLM
- Create a presentable UI that feels professional and polished

## Deliverables

### 1. Landing & Navigation
- [ ] Polished landing page with value proposition and "Open Editor" CTA
- [ ] Minimal top bar navigation (Home, Editor, Settings)

### 2. Text Editor
- [ ] Large responsive editor (TipTap or `<textarea>`)
- [ ] Word/character counter & placeholder text

### 3. Three-Step Analysis Pipeline
- [ ] Grammar & punctuation correction with diff UI (Step 1)
- [ ] Tone & emotion analysis returning `{toneLabel, toneColor}` (Step 2)
- [ ] Mirrored response draft using OpenAI/Claude LLM (Step 3)
- [ ] Single API route `POST /api/analyzeText` orchestrates the steps

### 4. Results Display
- [ ] Side-by-side diff or in-place correction with undo
- [ ] Color-coded tone badge with description tooltip
- [ ] Mirrored reply panel with copy button

### 5. Settings & Preferences
- [ ] Toggle tone color palette and AI verbosity
- [ ] Persist settings locally (or to DB once auth exists)

### 6. Polished User Experience
- [ ] Responsive design with glassomorphic theme
- [ ] Loading states, empty states, and error handling
- [ ] Smooth animations and transitions

---

**Target Outcome:** A polished, functional text-analysis assistant that users can rely on to improve their email writing without granting inbox access. The app should feel professional and demonstrate clear value through its three-step AI pipeline. 