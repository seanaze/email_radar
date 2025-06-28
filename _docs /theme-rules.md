# @fileoverview
# Theme Rules for Email Radar (Glassomorphic)

## Theme Philosophy

- **Glassomorphism**: Use frosted glass effects, translucency, and soft shadows to create depth and a modern, lightweight feel.
- **Vivid Accents**: Use a primary accent color for highlights, actions, and AI-powered features.
- **Dark & Light Modes**: Support both, with seamless transitions.

## Color Palette

- **Background (Glass)**: rgba(255,255,255,0.6) (light), rgba(30,41,59,0.6) (dark)
- **Surface**: #F8FAFC (light), #1E293B (dark)
- **Primary Accent**: #6366F1 (Indigo-500)
- **Secondary Accent**: #06B6D4 (Cyan-500)
- **Success**: #22C55E (Green-500)
- **Warning**: #F59E42 (Orange-400)
- **Error**: #EF4444 (Red-500)
- **Text Primary**: #0F172A (light), #F1F5F9 (dark)
- **Text Secondary**: #64748B (light), #94A3B8 (dark)
- **Border**: rgba(100,116,139,0.2)
- **Shadow**: 0 4px 32px rgba(30,41,59,0.12)

## Glassmorphic Effects

- **Frosted Glass**: Use `backdrop-blur-md` (Tailwind) on all glass surfaces.
- **Translucency**: Surfaces use semi-transparent backgrounds (see above).
- **Soft Borders**: 1px solid, low-opacity borders for separation.
- **Subtle Shadows**: Use soft, diffuse shadows for depth.

## Typography

- **Font**: Inter, system-ui, sans-serif
- **Font Weights**: 400 (normal), 600 (semibold), 700 (bold)
- **Letter Spacing**: Tight for headings, normal for body

## Iconography

- **Style**: Outline, minimal, consistent stroke width
- **Color**: Use accent colors for active/AI features, neutral for inactive

## Animations

- **Transitions**: Use Tailwind's `transition-all`, `duration-200` for interactive elements
- **Glass Fade**: Fade-in/fade-out for glass surfaces

## Example Tailwind Classes

- `bg-white/60 dark:bg-slate-800/60`
- `backdrop-blur-md`
- `border border-slate-400/20`
- `shadow-lg`
- `text-slate-900 dark:text-slate-100`
- `text-indigo-500`

---

These theme rules ensure a visually consistent, modern, and glassomorphic look across all components, leveraging Tailwind CSS for rapid, maintainable styling. 