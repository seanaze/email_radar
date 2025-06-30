# Email Radar - Phase 2 MVP Implementation Prompt

## Context
You are implementing Phase 2 MVP for Email Radar, an AI-first email composition assistant. The Phase 1 infrastructure is complete with Firebase setup, Redux store, Gmail API utilities, and a custom nspell-based text checker. Your task is to build the complete MVP experience.

## Current State
- **Completed**: Firebase config, Redux slices (auth/inbox), Gmail API utilities, text checker engine, basic landing page
- **Dependencies Installed**: TipTap editor, Firebase, Redux Toolkit, OpenAI, nspell, Tailwind CSS
- **Missing**: All user-facing features, authentication flow, editor integration, UI components

## Implementation Requirements

### 1. Authentication & OAuth Flow
**Files to create/modify:**
- `src/app/auth/signin/page.tsx` - Google OAuth sign-in page
- `src/components/auth/GoogleSignInButton.tsx` - OAuth button component
- `src/hooks/useAuth.ts` - Authentication hook
- `src/middleware.ts` - Next.js middleware for protected routes

**Implementation details:**
- Implement Google OAuth with Firebase Auth
- Request Gmail API scopes: `gmail.readonly`, `gmail.compose`, `gmail.send`
- Store access/refresh tokens in Firestore via existing `authSlice`
- Handle authentication states with loading spinners
- Redirect to `/inbox` after successful sign-in

### 2. App Layout & Navigation
**Files to create:**
- `src/components/layout/AppLayout.tsx` - Main app layout with sidebar
- `src/components/layout/Sidebar.tsx` - Navigation sidebar
- `src/components/layout/Header.tsx` - App header with user info

**Implementation details:**
- Glassomorphic design following ui-rules.md
- Persistent sidebar with: Inbox, Settings, Logout
- User avatar and email in header
- Responsive mobile-first design

### 3. Inbox View & Email Management
**Files to create:**
- `src/app/inbox/page.tsx` - Inbox listing page
- `src/components/inbox/EmailList.tsx` - Email list component
- `src/components/inbox/EmailListItem.tsx` - Individual email item
- `src/components/inbox/EmailFilters.tsx` - Filter controls
- `src/hooks/useGmail.ts` - Gmail API hook

**Implementation details:**
- Fetch emails using existing `gmailApi.ts` utilities
- Display emails with subject, snippet, date
- Filters: All, Unread, Drafts
- Search functionality
- Click email to open in editor
- Loading states with skeleton loaders

### 4. Rich Text Email Editor
**Files to create:**
- `src/app/editor/[id]/page.tsx` - Email editor page
- `src/components/editor/EmailEditor.tsx` - TipTap editor wrapper
- `src/components/editor/EditorToolbar.tsx` - Formatting toolbar
- `src/components/editor/SuggestionUnderline.tsx` - Custom ProseMirror decoration
- `src/extensions/SuggestionExtension.ts` - TipTap extension for underlines

**Implementation details:**
- TipTap editor with starter-kit extensions
- Toolbar: Bold, Italic, Headings, Lists, Link
- Real-time text checking using `textChecker.ts`
- Visual underlines for suggestions:
  - Red wavy: Spelling/grammar (Correctness)
  - Blue solid: Clarity improvements
  - Green solid: Engagement suggestions
  - Purple solid: Delivery enhancements
- Auto-save every 1 second (debounced)
- Writing score calculation

### 5. Suggestion Sidebar & Management
**Files to create:**
- `src/components/editor/SuggestionSidebar.tsx` - Sidebar for suggestions
- `src/components/editor/SuggestionCard.tsx` - Individual suggestion
- `src/components/editor/WritingScore.tsx` - Score display
- `src/hooks/useSuggestions.ts` - Suggestion management hook

**Implementation details:**
- Categorized suggestions (Correctness, Clarity, Engagement, Delivery)
- Accept/Reject buttons for each suggestion
- Click suggestion to highlight text in editor
- Apply suggestion with text replacement
- Dismissible suggestions
- Real-time updates as user types

### 6. AI Enhancement Integration
**Files to create:**
- `src/utils/aiEnhancer.ts` - OpenAI integration
- `src/components/editor/AIRewritePanel.tsx` - AI rewrite controls

**Implementation details:**
- OpenAI GPT-4 integration for rewrites
- Context-aware suggestions based on email content
- Tone adjustments (formal, casual, persuasive)
- One-click enhancements for clarity/engagement
- Loading states during AI processing

### 7. Email Save & Send
**Files to create:**
- `src/components/editor/EmailActions.tsx` - Save/Send buttons
- `src/hooks/useEmailActions.ts` - Email action handlers

**Implementation details:**
- Save draft back to Gmail using `gmailApi.ts`
- Send email functionality
- Success/error notifications
- Redirect to inbox after send
- Prevent navigation with unsaved changes

### 8. Settings Page
**Files to create:**
- `src/app/settings/page.tsx` - Settings page
- `src/components/settings/SettingsForm.tsx` - Settings form

**Implementation details:**
- Toggle suggestion categories on/off
- AI aggressiveness slider (1-5)
- Writing style preferences
- Auto-save toggle
- Settings persist to Firestore

### 9. UI Components & Styling
**Files to create:**
- `src/components/ui/Button.tsx` - Reusable button
- `src/components/ui/Card.tsx` - Glass card component
- `src/components/ui/Toast.tsx` - Notification toasts
- `src/components/ui/Skeleton.tsx` - Loading skeletons
- `src/components/ui/EmptyState.tsx` - Empty states

**Implementation details:**
- Consistent glassomorphic theme
- Tailwind CSS with custom utilities
- Smooth transitions and animations
- Accessible components (ARIA labels)
- Dark mode support

### 10. Error Handling & Loading States
**Implementation across all components:**
- Try-catch blocks for API calls
- User-friendly error messages
- Loading spinners and skeletons
- Empty states with illustrations
- Network error recovery

## Technical Constraints
1. Use existing utilities - don't recreate what's in `src/utils/`
2. Follow TypeScript strict mode
3. Use Redux Toolkit for all global state
4. Implement proper error boundaries
5. Mobile-first responsive design
6. Follow the project's file structure conventions

## Success Criteria
- User can sign in with Google and grant Gmail permissions
- Emails load in inbox with working filters
- Rich text editor with real-time grammar checking
- Visual suggestion underlines appear as user types
- Suggestions can be accepted/rejected
- AI rewrites work on demand
- Emails can be saved as drafts and sent
- Settings persist across sessions
- Professional, polished UI matching Marketing Quill quality

## Priority Order
1. Authentication flow (blocking everything else)
2. Inbox view and email listing
3. Basic editor with TipTap
4. Grammar checking integration
5. Suggestion sidebar
6. Save/Send functionality
7. AI enhancements
8. Settings page
9. Polish and animations

Start with authentication and work through each feature systematically. Each feature should be fully functional before moving to the next.