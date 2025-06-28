# @fileoverview
# User Flow for Email Radar

## 1. User Authentication
1. User visits the Email Radar web app.
2. Landing page displays a brief overview of the product and a prominent "Sign in with Google" button.
2. User clicks "Sign in with Google".
3. App requests Gmail OAuth permissions (read, compose, send).
4. Upon successful authentication, user is redirected to the inbox view.

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

## 5. Email Editing & Assistance
1. The selected email is parsed (HTML-to-plaintext if needed).
2. Real-time grammar and spell checking is performed via LanguageTool.
3. Inline suggestions are displayed (diff UI):
   - User can accept or reject each fix inline.
4. User can apply all accepted fixes to the draft.
5. If the user navigates away with unsaved changes, a confirmation prompt is shown.

## 6. AI-Powered Features (Phase 2)
1. User can request context-aware rewrites (powered by LLM).
2. Personalized style recommendations are shown based on user goals.
3. User can search past emails and corrections semantically.
4. Smart templates and auto-completion are available for quick replies.

## 7. Saving, Sending & Redirects
1. User saves the updated draft back to Gmail.
2. Optionally, user can send the corrected email directly from the app.
3. After saving or sending, user is redirected back to the inbox with a success notification.
4. If saving or sending fails, an error message is displayed with options to retry or return to editing.

## 8. Settings
1. User can access the settings page to:
   - Toggle suggestion aggressiveness
   - Change language
   - Adjust personalization options
2. Changes are saved automatically or with a save button, with feedback on success/failure.

## 9. Logout
1. User clicks the "Logout" button in the navigation.
2. User is signed out and redirected to the landing page.
3. All sensitive data is cleared from the client.

---

This flow =larifies all major user interactions, navigation, redirects, registration/login distinctions, and error handling, ensuring a robust and user-friendly experience for Email Radar. It ensures a seamless, AI-first email writing experience, integrating grammar, style, and smart productivity features directly into the user's Gmail workflow.
