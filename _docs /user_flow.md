# @fileoverview
# User Flow for Email Radar

## 1. User Authentication
1. User visits the Email Radar web app.
2. Landing page displays a brief overview of the product and a prominent "Sign in with Google" button.
3. User clicks "Sign in with Google".
4. App requests Gmail OAuth permissions (read, compose, send).
5. Upon successful authentication, user is redirected to the inbox view.

## 2. Registration & Authentication
1. User clicks "Sign in with Google".
2. App initiates Gmail OAuth flow (requesting read, compose, send scopes).
3. If this is the user's first time, their account is registered in the system upon successful OAuth.
4. If authentication is successful, user is redirected to the inbox view.
5. If authentication fails or is denied:
   - User is shown an error message with options to retry or return to the landing page.

## 3. Navigation
1. The main navigation is accessible from all authenticated views (e.g., sidebar or top navigation bar):
   - Inbox
   - Settings
   - Logout
2. User can switch between inbox, settings, and logout at any time.
3. Navigation state is preserved (e.g., returning to the last viewed email or filter).

## 4. Inbox Browsing
1. User sees a list of emails (with filters: unread, drafts).
2. User can search, filter, and sort emails.
3. User selects a draft or an existing message to edit.
4. If the user tries to access the inbox without authentication, they are redirected to the landing page.

## 5. Rich Text Email Editing & Real-Time Assistance
1. The selected email opens in a TipTap rich text editor with formatting toolbar.
2. Real-time grammar and spell checking is performed using custom nspell-based engine.
3. Visual suggestion underlines appear as user types:
   - **Correctness** (red wavy): Spelling, capitalization, punctuation errors
   - **Clarity** (blue solid): Conciseness and clarity improvements  
   - **Engagement** (green solid): Vivid, compelling language suggestions
   - **Delivery** (purple solid): Tone, flow, and readability enhancements
4. Suggestion sidebar displays categorized suggestions with accept/reject controls.
5. User can click suggestions to highlight corresponding text in editor.
6. Auto-save functionality saves changes every 1 second while editing.
7. Writing score is calculated and displayed in real-time.

## 6. Suggestion Management & AI Features
1. User can accept individual suggestions with immediate text replacement.
2. User can dismiss suggestions to remove them from the sidebar.
3. AI-powered context-aware rewrites are available on-demand:
   - Tone adjustment (formal, casual, persuasive)
   - Clarity improvements (concise, clear writing)
   - Engagement enhancements (vivid, compelling language)
4. Suggestion highlighting shows exactly what text will be changed.
5. User can undo accepted suggestions if needed.

## 7. Saving, Sending & Feedback
1. User saves the updated draft back to Gmail (manual save or auto-save).
2. Optionally, user can send the corrected email directly from the app.
3. Success notifications confirm save/send actions.
4. If saving or sending fails, clear error messages are displayed with retry options.
5. User is redirected back to the inbox after successful send.

## 8. Settings & Preferences
1. User can access the settings page to:
   - Toggle suggestion categories on/off
   - Adjust AI suggestion aggressiveness
   - Change writing style preferences
   - Configure auto-save settings
2. Changes are saved automatically with clear feedback.
3. Settings persist across sessions.

## 9. Logout & Security
1. User clicks the "Logout" button in the navigation.
2. User is signed out and redirected to the landing page.
3. All sensitive data and suggestion cache is cleared from the client.
4. Auto-save is disabled during logout process.

---

This flow ensures a seamless, professional email editing experience with immediate grammar feedback, AI-powered enhancements, and robust suggestion management—delivering a next-generation writing assistant that surpasses traditional tools.
