# @fileoverview
# UI Rules for Email Radar

## Design Principles

- **AI-First Experience**: All UI should foreground AI-powered features (inline suggestions, context-aware rewrites, etc.) and make them discoverable and easy to use.
- **Mobile-First & Responsive**: Design for mobile screens first, then scale up to desktop. All layouts, components, and interactions must be fully responsive.
- **Clarity & Simplicity**: Prioritize clear, concise interfaces. Use whitespace, clear typography, and minimal visual clutter.
- **Accessibility**: All components must meet WCAG 2.1 AA standards. Use semantic HTML, ARIA attributes, and ensure keyboard navigation.
- **Feedback & Animation**: Provide immediate, animated feedback for user actions (e.g., button presses, loading states, inline suggestions). Use subtle transitions for state changes.
- **Iconography**: Use a consistent icon set for actions, statuses, and navigation. Icons should be descriptive and support tooltips for clarity.
- **Consistency**: All components should follow a unified style guide for spacing, colors, and typography.
- **Error Handling**: Display clear, actionable error messages. Use non-blocking toasts or banners for notifications.
- **State Management**: UI state should be predictable and managed via Redux Toolkit. Avoid local component state for global features.

## Component Behaviors

- **Navigation**: Persistent sidebar or top nav, always accessible. Navigation state is preserved (e.g., last viewed email).
- **Inbox List**: Supports filtering, searching, and sorting. List items are tappable, with clear affordances for selection.
- **Email Editor**: Inline grammar/style suggestions with accept/reject controls. Unsaved changes prompt before navigation.
- **Settings**: Accessible from all views. Changes are saved with clear feedback.
- **Loading & Empty States**: Use skeleton loaders and clear empty state illustrations/messages.
- **Modals/Dialogs**: Use for critical confirmations only. Always provide a clear way to dismiss.

## Interaction Guidelines

- **Touch Targets**: Minimum 44x44px for all interactive elements.
- **Keyboard Shortcuts**: Support for power users (e.g., send, save, navigate).
- **Focus Management**: Always indicate focus for accessibility.
- **Animations**: Use Tailwind CSS transitions for smooth, non-distracting animations.

---

These rules ensure a modern, accessible, and AI-first user experience, optimized for both mobile and desktop users. 