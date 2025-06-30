# 🚀 MVP Phase 2 Implementation Prompt

Based on comprehensive codebase analysis, execute the following tasks to deliver a fully functional Email Radar MVP Phase 2. The foundation is 80% complete - you need to build the UI layer and integrate existing backend services.

## 🎯 **EXECUTION OBJECTIVE**
Transform the existing Email Radar foundation into a production-ready email assistant with:
- Complete Google OAuth authentication flow
- Rich text email editor with real-time grammar checking
- Gmail integration for inbox management
- AI-powered writing enhancements
- Mobile-responsive, accessible UI

---

## 📋 **CRITICAL TASKS - EXECUTE IN ORDER**

### **PHASE 1: FOUNDATION FIXES** *(BLOCKING - Must Complete First)*

#### 🔧 **Task 1.1: Fix Build Configuration**
```bash
# Issues to resolve:
# 1. next.config.js has deprecated appDir
# 2. Firebase build errors due to missing API keys
# 3. Environment variable template needed
```

**Actions:**
1. **Fix `next.config.js`** - Remove deprecated `experimental.appDir` configuration
2. **Create `.env.local.example`** with all required environment variables:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   NEXT_PUBLIC_GOOGLE_REDIRECT_URI=
   OPENAI_API_KEY=
   ```
3. **Add environment validation** in `src/utils/firebase.ts` with graceful fallbacks
4. **Verify build passes** with `npm run build`

#### 🔐 **Task 1.2: Authentication Implementation**

**Leverage existing:** `src/features/auth/authSlice.ts` (complete Redux state management)

**Create these components:**
1. **`src/components/auth/SignInButton.tsx`**
   - Google OAuth integration using Firebase Auth
   - Use existing `createUserThunk` and `loadUserThunk`
   - Handle loading states and errors
   - Redirect to `/inbox` on success

2. **`src/components/auth/AuthGuard.tsx`**
   - Protect routes requiring authentication
   - Use existing `selectIsAuthenticated` selector
   - Redirect to landing page if not authenticated

3. **`src/components/auth/UserProfile.tsx`**
   - Display user info from `selectUser`
   - Logout functionality using existing `logout` action

4. **Update `src/app/page.tsx`**
   - Connect Sign In button to actual OAuth flow
   - Add authentication state handling

#### 🧭 **Task 1.3: Navigation & Routing**

**Create authenticated app structure:**
1. **`src/app/(authenticated)/layout.tsx`**
   - Wrap with `AuthGuard`
   - Include navigation sidebar
   - Mobile-responsive design

2. **Route structure to create:**
   ```
   src/app/(authenticated)/
   ├── inbox/
   │   └── page.tsx
   ├── editor/
   │   ├── [emailId]/
   │   │   └── page.tsx
   │   └── page.tsx (new email)
   └── settings/
       └── page.tsx
   ```

3. **`src/components/layout/Navigation.tsx`**
   - Sidebar navigation with Inbox, Settings, Logout
   - Use glassomorphic styling from existing `globals.css`
   - Mobile hamburger menu

---

### **PHASE 2: EMAIL EDITOR CORE** *(HIGH PRIORITY)*

#### ✏️ **Task 2.1: TipTap Rich Text Editor**

**Leverage existing:** `textChecker.ts` (complete grammar engine), suggestion interfaces

**Create components:**
1. **`src/components/editor/EmailEditor.tsx`**
   - TipTap editor with toolbar (bold, italic, headings, lists)
   - Real-time integration with existing `checkText()` function
   - Debounced text analysis (200ms)
   - Auto-save every 1 second using existing `updateEmailThunk`

2. **`src/components/editor/FormatToolbar.tsx`**
   - Formatting controls for TipTap editor
   - Follow glassomorphic design system

3. **Custom ProseMirror extension for suggestion underlines:**
   - Red wavy: Spelling errors
   - Blue solid: Clarity issues  
   - Green solid: Engagement opportunities
   - Purple solid: Delivery improvements

#### 📝 **Task 2.2: Grammar Suggestion System**

**Leverage existing:** `Suggestion` interface, suggestion categorization

**Create components:**
1. **`src/components/editor/SuggestionSidebar.tsx`**
   - Display categorized suggestions from existing `checkText()`
   - Accept/reject controls using existing `applySuggestion()`
   - Real-time updates as user types

2. **`src/components/editor/SuggestionCard.tsx`**
   - Individual suggestion display with excerpt HTML
   - Candidate replacement options
   - Accept/reject buttons

3. **`src/components/editor/WritingScore.tsx`**
   - Calculate score based on suggestion counts
   - Visual progress indicator

#### 🔄 **Task 2.3: State Management Integration**

**Leverage existing:** Redux slices, Gmail API utilities

**Integration points:**
1. Connect editor to existing `selectCurrentEmail`
2. Use existing `updateCurrentEmailBody` for real-time updates
3. Integrate existing `updateEmailThunk` for auto-save
4. Use existing Gmail API functions for draft persistence

---

### **PHASE 3: INBOX MANAGEMENT** *(HIGH PRIORITY)*

#### 📥 **Task 3.1: Inbox Interface**

**Leverage existing:** `inboxSlice.ts`, `gmailApi.ts`

**Create components:**
1. **`src/components/inbox/InboxList.tsx`**
   - Email cards using existing `selectFilteredEmails`
   - Filter UI for existing `setFilter` action
   - Search with existing filter functionality

2. **`src/components/inbox/EmailCard.tsx`**
   - Display email subject, snippet, status
   - Draft/sent status badges
   - Click to navigate to editor

3. **`src/components/inbox/EmailFilters.tsx`**
   - Filter controls (all, drafts, sent, processing)
   - Search input with debounced updates

#### 🔗 **Task 3.2: Email Selection & Loading**

**Leverage existing:** Gmail API integration, loading states

**Implement:**
1. Email selection workflow (inbox → editor)
2. Use existing `loadEmailThunk` for email loading
3. Handle existing loading states (`selectEmailLoading`)
4. Error handling using existing error selectors

---

### **PHASE 4: AI ENHANCEMENT ENGINE** *(MEDIUM PRIORITY)*

#### 🤖 **Task 4.1: OpenAI Integration**

**Create new service:**
1. **`src/utils/aiService.ts`**
   - OpenAI client configuration
   - Context-aware rewrite prompts for clarity, engagement, delivery
   - Rate limiting and error handling

2. **Extend suggestion system:**
   - Add AI suggestions to existing `Suggestion` interface
   - Integrate with existing suggestion sidebar
   - Support for multiple rewrite candidates

#### 🎨 **Task 4.2: AI Features**

**Components to create:**
1. **`src/components/editor/AISuggestions.tsx`**
   - AI-powered rewrite suggestions
   - Tone adjustment controls (formal, casual, persuasive)
   - Preview functionality

2. **Integration with existing suggestion system:**
   - Extend existing suggestion categories
   - Use existing accept/reject workflow

---

### **PHASE 5: SETTINGS & POLISH** *(MEDIUM PRIORITY)*

#### ⚙️ **Task 5.1: Settings Page**

**Leverage existing:** `userSettings` Redux state

**Create:**
1. **`src/app/(authenticated)/settings/page.tsx`**
   - Use existing `selectUserSettings`
   - Update with existing `updateSettingsThunk`
   - Suggestion aggressiveness, language, AI features toggle

#### ✨ **Task 5.2: Production Polish**

**Enhancements:**
1. Loading states throughout app
2. Error boundaries and comprehensive error handling
3. Toast notification system
4. Mobile optimization
5. Keyboard shortcuts

---

## 🛠 **CRITICAL IMPLEMENTATION GUIDELINES**

### **Leverage Existing Code:**
- **DO NOT REWRITE** existing utilities (`textChecker.ts`, `gmailApi.ts`, Redux slices)
- **INTEGRATE WITH** existing interfaces (`Suggestion`, `Email`, `User`)
- **USE** existing styling system (glassomorphic classes in `globals.css`)
- **FOLLOW** existing file organization pattern

### **Key Integration Points:**
```typescript
// Use existing functions:
import { checkText, applySuggestion } from '@/utils/textChecker'
import { fetchGmailMessages, updateGmailDraft } from '@/utils/gmailApi'
import { useAppSelector, useAppDispatch } from '@/state/hooks'
import { selectCurrentEmail, updateCurrentEmailBody } from '@/features/inbox/inboxSlice'

// Follow existing patterns:
// - Redux Toolkit for state management
// - Tailwind with glassomorphic design
// - TypeScript interfaces for type safety
// - Mobile-first responsive design
```

### **UI Requirements (from ui-rules.md):**
- **Mobile-first responsive design**
- **Glassomorphic theme with backdrop blur**
- **WCAG 2.1 AA accessibility standards**
- **44x44px minimum touch targets**
- **Focus ring styling for keyboard navigation**
- **Smooth transitions using Tailwind CSS**

### **Technical Requirements:**
- Real-time grammar checking with 200ms debounce
- Auto-save every 1 second while editing
- Support for 4 suggestion categories with visual distinction
- Gmail API integration for actual email workflow
- Error handling with user-friendly messages

---

## 🎯 **SUCCESS CRITERIA**

Upon completion, the app should:
1. ✅ **Authenticate users** via Google OAuth with Gmail scopes
2. ✅ **Load real Gmail emails** (drafts and sent) in inbox
3. ✅ **Edit emails** with rich text formatting and real-time grammar suggestions
4. ✅ **Save changes** back to Gmail as drafts
5. ✅ **Send emails** directly from the app
6. ✅ **Provide AI-powered** writing enhancements
7. ✅ **Work flawlessly** on mobile and desktop
8. ✅ **Handle errors gracefully** with clear user feedback

**Target outcome:** A polished, functional email assistant that users can immediately use to improve their Gmail writing workflow, demonstrating clear value through grammar checking and AI enhancements.

---

## 🚨 **CRITICAL SUCCESS FACTORS**

1. **Start with Phase 1** - Fix build issues first
2. **Use existing code** - Don't reinvent the wheel
3. **Follow user flow** document for UX guidance  
4. **Test incrementally** - Verify each phase works before moving on
5. **Focus on core value** - Grammar checking + AI enhancement
6. **Mobile-first design** - Ensure excellent mobile experience

Execute these tasks in order to deliver a production-ready Email Radar MVP Phase 2!