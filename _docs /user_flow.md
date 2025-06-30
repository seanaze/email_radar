# @fileoverview
# User Flow for Email Radar

## 1. Landing & Editor Access
1. User visits the Email Radar web app.
2. Landing page shows a concise value proposition and a prominent "Open Editor" (or "Get Started") button.
3. User clicks the button and is navigated to the editor view (authentication is optional and can be added later for saved preferences).

## 2. Text Entry
1. The editor provides a large, responsive text area (TipTap or simple `<textarea>`).
2. User pastes existing email text or writes a new draft directly in the editor.
3. Word count and a placeholder hint appear to guide the user.

## 3. Analyze (Three-Step AI Pipeline)
1. User clicks the "Analyze" button.
2. A loading indicator appears while the backend performs:
   - **Step 1 – Grammar & Punctuation Fix**: The engine returns a diff‐style corrected version of the text.
   - **Step 2 – Tone & Emotion Analysis**: The engine categorizes the overall tone (e.g., Friendly, Formal, Harsh) and assigns a color badge.
   - **Step 3 – Mirrored Response**: The engine produces a reply draft that mirrors the user's tone and context.
3. The API responds with a JSON payload `{ correctedText, toneLabel, toneColor, mirroredReply }`.

## 4. Results Display
1. Corrected text appears in a side-by-side diff view or replaces the original (with undo option).
2. Tone badge (colored chip) and a short description appear above the editor.
3. Mirrored response draft appears in a separate panel with a "Copy" button.
4. User can copy any of the outputs to the clipboard.

## 5. Optional Settings & Preferences
1. In a settings modal or page, user can:
   - Toggle tone color palette (e.g., pastel vs. vivid).
   - Adjust AI verbosity or creativity for the mirrored reply.
   - Enable/disable automatic grammar correction on type (future).
2. Settings persist locally (or to the user's profile once auth is added).

## 6. Session End
1. User can clear the editor, refresh, or close the tab—no sensitive data is stored server-side unless the user is authenticated in future versions.

---

This streamlined flow focuses on a single, high-value interaction: paste → analyze → improve. It removes the complexity and trust barriers of full inbox access while still delivering clear, AI-powered benefits.
