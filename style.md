# Portfolio Style Guide

A comprehensive design system guide for building a minimal, elegant portfolio website. This guide contains all the specifications needed to replicate the design aesthetic.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Animations & Transitions](#animations--transitions)
7. [Responsive Design](#responsive-design)
8. [Special Effects](#special-effects)
9. [Code Syntax Highlighting](#code-syntax-highlighting)
10. [Interaction Patterns](#interaction-patterns)

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2+ | React framework with App Router |
| Tailwind CSS | 3.4+ | Utility-first styling |
| Geist Sans | 1.5+ | Primary typeface |
| Framer Motion | 12.4+ | Animation library |
| Radix UI | 1.1+ | Accessible UI primitives |
| Lucide React | 0.475+ | Icon library |
| Prism.js | - | Syntax highlighting |

---

## Color System

The palette is built on Tailwind's **stone** color family, creating a warm, neutral aesthetic.

### Light Mode

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| Background | `#f5f5f4` | stone-100 | Page background |
| Surface | `#fafaf9` | stone-50 | Cards, elevated elements |
| Text Primary | `#292524` | stone-900 | Headlines, important text |
| Text Secondary | `#78716c` | stone-600 | Body text |
| Text Tertiary | `#a8a29e` | stone-500 | Muted, helper text |
| Border | `#d6d3d1` | stone-300 | Dividers, borders |
| Grid Dots | `#e5e7eb` | gray-200 | Background pattern |

### Dark Mode

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| Background | `#000000` | black | Page background |
| Surface | `#1f1f1f` | neutral-900 | Cards, elevated elements |
| Text Primary | `#fafaf9` | stone-100 | Headlines, important text |
| Text Secondary | `#a8a29e` | stone-400 | Body text |
| Text Tertiary | `#78716c` | stone-500 | Muted, helper text |
| Border | `#57534e` | stone-700 | Dividers, borders |
| Grid Dots | `#1f2937` | gray-900 | Background pattern |

### Accent Colors

Used sparingly for syntax highlighting and interactive elements:

| Color | Light | Dark | Usage |
|-------|-------|------|-------|
| Purple | `#a21caf` | `#e879f9` | Tags, properties |
| Green | `#15803d` | `#4ade80` | Strings, success |
| Cyan | `#0369a1` | `#38bdf8` | Operators |
| Blue | `#0284c7` | `#0ea5e9` | Keywords, links |
| Amber | `#ca8a04` | `#fcd34d` | Functions |
| Orange | `#d97706` | `#fb923c` | Variables |

### Selection Colors

```css
/* Light mode */
::selection {
  background: #fef08a; /* yellow-200 */
}

/* Dark mode */
.dark ::selection {
  background: #713f12; /* yellow-800 */
}
```

---

## Typography

### Font Family

**Primary:** Geist Sans - A modern, geometric sans-serif optimized for readability.

```css
font-family: 'Geist Sans', system-ui, -apple-system, sans-serif;
```

**Monospace (code):**
```css
font-family: Consolas, Monaco, 'Ubuntu Mono', monospace;
```

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Extralight | 200 | Default body text |
| Medium | 500 | Emphasized text, links |
| Semibold | 600 | Section headers |

### Type Scale

| Name | Size | Line Height | Usage |
|------|------|-------------|-------|
| Micro | 10px (0.625rem) | 1.4 | Badges, labels |
| Small | 14px (0.875rem) | 1.5 | Secondary text, captions |
| Base | 16px (1rem) | 1.5 | Body text |
| Large | 20px (1.25rem) | 1.4 | Subheadings |
| XL | 24px (1.5rem) | 1.3 | Section titles |
| 2XL | 30px (1.875rem) | 1.2 | Page titles |
| 3XL | 36px (2.25rem) | 1.2 | Hero text |

### Heading Styles

```css
h1 {
  font-size: 2.25rem;    /* 36px */
  font-weight: 600;
  color: var(--text-primary);
  margin-top: 2rem;
}

h2 {
  font-size: 1.5rem;     /* 24px */
  font-weight: 600;
  color: var(--text-primary);
  margin-top: 2rem;
}

h3 {
  font-size: 1.25rem;    /* 20px */
  font-weight: 600;
  color: var(--text-primary);
  margin-top: 1.5rem;
}
```

---

## Spacing & Layout

### Base Unit

All spacing derives from a **4px base unit**.

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| 1 | 4px | Tight gaps |
| 2 | 8px | Small gaps, icon padding |
| 3 | 12px | - |
| 4 | 16px | Component gaps |
| 5 | 20px | Card padding |
| 6 | 24px | Section padding |
| 8 | 32px | Large sections |
| 10 | 40px | - |
| 12 | 48px | - |
| 16 | 64px | - |
| 20 | 80px | Desktop margins |

### Content Container

```css
.container {
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  padding: 24px;           /* Mobile */
}

@media (min-width: 768px) {
  .container {
    margin: 80px auto;
    margin-top: 60px;      /* Header offset */
  }
}
```

### Section Spacing

```css
.section {
  padding: 24px 20px;      /* py-6 px-5 */
}

.section + .section {
  margin-top: 16px;        /* gap-4 */
}
```

---

## Components

### Header

```
+----------------------------------------------------------+
|  [Logo/Name]     [Nav Links]     [Theme] [Cmd Palette]   |
+----------------------------------------------------------+
```

**Specifications:**
- Sticky positioning optional
- Nav gap: 8px mobile, 16px tablet, 24px desktop
- Theme toggle: icon button, 40x40px touch target
- Command palette trigger: shows "Cmd+K" hint

### Navigation Link

```css
.nav-link {
  color: #57534e;                    /* stone-700 */
  font-weight: 500;
  text-decoration: none;
  position: relative;
}

.nav-link.active {
  color: #292524;                    /* stone-900 */
}

/* Dark mode */
.dark .nav-link {
  color: #d6d3d1;                    /* stone-300 */
}

.dark .nav-link.active {
  color: #fafaf9;                    /* stone-100 */
}
```

**Animated underline (sweep effect):**
```css
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  animation: sweep 2s ease-in-out infinite;
}

@keyframes sweep {
  0% {
    transform: scaleX(0);
    transform-origin: left;
  }
  50% {
    transform: scaleX(1);
    transform-origin: left;
  }
  50.1% {
    transform: scaleX(1);
    transform-origin: right;
  }
  100% {
    transform: scaleX(0);
    transform-origin: right;
  }
}
```

### Project Card

```
+----------------------------------------+
|  [Project Image - 250px height]        |
|                                        |
|  Project Title              [Icons]    |
|  Description text...                   |
+----------------------------------------+
```

**Specifications:**
```css
.project-card {
  background: #f5f5f5;               /* neutral-100 */
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  transition: all 300ms ease;
}

.project-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
}

.dark .project-card {
  background: #1f1f1f;               /* neutral-900 */
}

.project-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  transition: height 300ms ease;
}

.project-card:hover .project-image {
  height: 275px;
}

.project-title {
  font-size: 1.5rem;                 /* 24px */
  font-weight: 500;
  color: #171717;                    /* neutral-900 */
}

.dark .project-title {
  color: #e5e5e5;                    /* neutral-200 */
}

.project-description {
  color: #525252;                    /* neutral-600 */
}
```

### Command Palette

```
+------------------------------------------+
|  [Search Icon]  Search...      [Esc]     |
+------------------------------------------+
|  Navigation                              |
|    Home                        Shift+H   |
|    Projects                    Shift+P   |
|    Writing                     Shift+W   |
+------------------------------------------+
|  Social                                  |
|    GitHub                      Shift+G   |
|    LinkedIn                    Shift+L   |
+------------------------------------------+
```

**Specifications:**
```css
.command-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  animation: fade-in 150ms ease;
}

.command-dialog {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 500px;
  background: #fafaf9;               /* stone-50 */
  border: 1px solid #d6d3d1;         /* stone-300 */
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
  animation: slide-down 150ms ease;
}

.dark .command-dialog {
  background: #0a0a0a;               /* neutral-950 */
  border-color: #292524;             /* stone-900 */
}

.command-input {
  width: 100%;
  padding: 12px 16px;
  padding-left: 40px;                /* Space for search icon */
  background: transparent;
  border: none;
  border-bottom: 1px solid #d6d3d1;
  outline: none;
}

.keyboard-hint {
  padding: 2px 6px;
  background: #e7e5e4;               /* stone-200 */
  border-radius: 4px;
  font-size: 12px;
}

.dark .keyboard-hint {
  background: #44403c;               /* stone-700 */
}
```

### Footer

```css
.footer {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e5e5;     /* neutral-200 */
}

.dark .footer {
  border-color: #262626;             /* neutral-800 */
}
```

**Social link with hover expansion:**
```css
.social-link {
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 500ms ease-out;
}

.social-link .icon {
  width: 20px;
  height: 20px;
  transition: transform 500ms ease-out;
}

.social-link:hover .icon {
  transform: scale(1.1);
}

.social-link .label {
  width: 0;
  opacity: 0;
  overflow: hidden;
  transition: all 500ms ease-out;
}

.social-link:hover .label {
  width: auto;
  opacity: 1;
  margin-left: 4px;
}
```

### Buttons

**Primary Button:**
```css
.button-primary {
  padding: 16px 24px;
  background: transparent;
  border: 1px solid #d6d3d1;         /* stone-300 */
  border-radius: 8px;
  font-weight: 200;                  /* extralight */
  transition: all 300ms ease;
}

.button-primary:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
}

.button-primary:active {
  transform: scale(0.98);
}
```

**Icon Button:**
```css
.button-icon {
  width: 20px;
  height: 20px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 4px;
  transition: background 200ms ease;
}

.button-icon:hover {
  background: #e7e5e4;               /* stone-200 */
}

.dark .button-icon:hover {
  background: #44403c;               /* stone-700 */
}
```

### List Items (Diamond Bullets)

```css
.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 0;
  transition: transform 200ms ease;
}

.list-item:hover {
  transform: translateX(4px);
}

.list-item::before {
  content: '';
  width: 6px;
  height: 6px;
  background: currentColor;
  transform: rotate(45deg);
}
```

---

## Animations & Transitions

### Keyframe Animations

```css
/* Fade In */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Down */
@keyframes slide-down {
  from {
    opacity: 0;
    transform: translate(-50%, -100%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

/* Sweep (Link Underline) */
@keyframes sweep {
  0% {
    transform: scaleX(0);
    transform-origin: left;
  }
  50% {
    transform: scaleX(1);
    transform-origin: left;
  }
  50.1% {
    transform: scaleX(1);
    transform-origin: right;
  }
  100% {
    transform: scaleX(0);
    transform-origin: right;
  }
}

/* Path Drawing (for SVG signatures) */
@keyframes draw {
  from {
    stroke-dashoffset: var(--path-length);
  }
  to {
    stroke-dashoffset: 0;
  }
}
```

### Utility Classes

```css
.animate-fade-in {
  animation: fade-in 150ms ease forwards;
}

.animate-slide-down {
  animation: slide-down 150ms ease forwards;
}
```

### Transition Presets

```css
/* Fast (hover feedback) */
.transition-fast {
  transition: all 150ms ease;
}

/* Default */
.transition-default {
  transition: all 200ms ease;
}

/* Smooth (content changes) */
.transition-smooth {
  transition: all 300ms ease;
}

/* Slow (elaborate effects) */
.transition-slow {
  transition: all 500ms ease-out;
}
```

### Hover Effects

| Element | Effect | Duration |
|---------|--------|----------|
| Links | Color change + underline sweep | 2s infinite |
| Cards | Scale 1.02x, shadow increase | 300ms |
| Icons | Scale 1.1x | 500ms |
| Buttons | Scale 1.02x (hover), 0.98x (active) | 300ms |
| List items | Translate X 4px | 200ms |
| Images | Height increase 25px | 300ms |

### Framer Motion (SVG Signature)

```jsx
const pathVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (delay) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        duration: 1.5,
        delay,
        ease: "easeInOut"
      },
      opacity: {
        duration: 0.5,
        delay
      }
    }
  })
};

// Usage with staggered delays: 0, 0.5s, 1s, 1.5s, etc.
```

---

## Responsive Design

### Breakpoints

| Name | Width | Usage |
|------|-------|-------|
| sm | 640px | Small tablets |
| md | 768px | Tablets, small laptops |
| lg | 1024px | Desktops |

### Mobile-First Approach

Always start with mobile styles, then add breakpoint overrides:

```css
/* Mobile (default) */
.element {
  margin: 24px;
  gap: 8px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .element {
    margin: 80px;
    gap: 24px;
  }
}
```

### Common Responsive Patterns

```css
/* Margins */
.container {
  margin: 24px;           /* m-6 */
}
@media (min-width: 768px) {
  .container {
    margin: 80px;         /* md:m-20 */
  }
}

/* Gaps */
.nav {
  gap: 8px;               /* gap-2 */
}
@media (min-width: 640px) {
  .nav {
    gap: 16px;            /* sm:gap-4 */
  }
}
@media (min-width: 768px) {
  .nav {
    gap: 24px;            /* md:gap-6 */
  }
}

/* Visibility */
.desktop-only {
  display: none;
}
@media (min-width: 768px) {
  .desktop-only {
    display: block;
  }
}
```

### Touch Targets

Minimum touch target size: **44px x 44px** for all interactive elements on mobile.

---

## Special Effects

### Dotted Grid Background

```css
body {
  background-color: #f5f5f4;
  background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
  background-size: 16px 16px;
}

.dark body {
  background-color: #000000;
  background-image: radial-gradient(#1f2937 1px, transparent 1px);
}
```

### Shadows

| Level | Shadow | Usage |
|-------|--------|-------|
| sm | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| md | `0 4px 6px -1px rgba(0,0,0,0.1)` | Cards default |
| lg | `0 10px 15px -3px rgba(0,0,0,0.1)` | Cards hover |
| xl | `0 20px 25px -5px rgba(0,0,0,0.1)` | Modals |
| 2xl | `0 25px 50px -12px rgba(0,0,0,0.25)` | Command palette |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| sm | 4px | Small elements, badges |
| default | 8px | Cards, buttons |
| lg | 12px | Modals, large cards |

### Custom Scrollbar

```css
/* Light mode */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f5f5f4;               /* stone-100 */
}

::-webkit-scrollbar-thumb {
  background: #d6d3d1;               /* stone-300 */
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a29e;               /* stone-400 */
}

/* Dark mode */
.dark ::-webkit-scrollbar-track {
  background: #292524;               /* stone-900 */
}

.dark ::-webkit-scrollbar-thumb {
  background: #44403c;               /* stone-700 */
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #57534e;               /* stone-600 */
}
```

---

## Code Syntax Highlighting

### Light Theme

```css
.token.comment { color: #78716c; }      /* stone-600 */
.token.punctuation { color: #57534e; }  /* stone-700 */
.token.property { color: #a21caf; }     /* fuchsia-700 */
.token.string { color: #15803d; }       /* green-700 */
.token.keyword { color: #0284c7; }      /* sky-600 */
.token.function { color: #ca8a04; }     /* amber-600 */
.token.variable { color: #d97706; }     /* orange-600 */
.token.operator { color: #0369a1; }     /* sky-700 */

pre[class*="language-"] {
  background: #f5f5f4;                  /* stone-100 */
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
}

code[class*="language-"] {
  font-family: Consolas, Monaco, 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
}
```

### Dark Theme

```css
.dark .token.comment { color: #a8a29e; }     /* stone-400 */
.dark .token.punctuation { color: #d6d3d1; } /* stone-300 */
.dark .token.property { color: #e879f9; }    /* fuchsia-400 */
.dark .token.string { color: #4ade80; }      /* green-400 */
.dark .token.keyword { color: #0ea5e9; }     /* sky-500 */
.dark .token.function { color: #fcd34d; }    /* amber-300 */
.dark .token.variable { color: #fb923c; }    /* orange-400 */
.dark .token.operator { color: #38bdf8; }    /* sky-400 */

.dark pre[class*="language-"] {
  background: #292524;                       /* stone-900 */
}
```

### Code Block Styling

```css
pre[class*="language-"] {
  margin: 8px 0;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  tab-size: 4;
}

/* Line numbers */
.line-number {
  display: inline-block;
  width: 2em;
  text-align: right;
  padding-right: 1em;
  color: #a8a29e;                           /* stone-400 */
  user-select: none;
}
```

---

## Interaction Patterns

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open command palette |
| `Escape` | Close command palette |
| `Shift + H` | Navigate to Home |
| `Shift + P` | Navigate to Projects |
| `Shift + W` | Navigate to Writing |
| `Shift + G` | Open GitHub |
| `Shift + L` | Open LinkedIn |
| `Shift + T` | Toggle theme |

### Focus States

```css
/* Visible focus ring for keyboard navigation */
:focus-visible {
  outline: 2px solid #0284c7;               /* sky-600 */
  outline-offset: 2px;
}

/* Remove default focus for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Theme Toggle

```javascript
// Check system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Apply theme
document.documentElement.classList.toggle('dark', isDark);

// Persist to localStorage
localStorage.setItem('theme', isDark ? 'dark' : 'light');
```

---

## Implementation Checklist

- [ ] Set up Next.js with App Router
- [ ] Install and configure Tailwind CSS
- [ ] Add Geist Sans font
- [ ] Configure color variables (stone palette)
- [ ] Implement theme toggle with localStorage
- [ ] Create dotted grid background
- [ ] Build navigation with sweep animation
- [ ] Create project card component
- [ ] Implement command palette (Cmd+K)
- [ ] Add Prism.js syntax highlighting
- [ ] Configure responsive breakpoints
- [ ] Add custom scrollbar styles
- [ ] Implement hover animations
- [ ] Test keyboard navigation

---

## Quick Reference

### Tailwind Config Essentials

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fade-in 150ms ease forwards',
        'slide-down': 'slide-down 150ms ease forwards',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translate(-50%, -100%)' },
          to: { opacity: '1', transform: 'translate(-50%, 0)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
```

### CSS Variables (Optional)

```css
:root {
  --color-bg: #f5f5f4;
  --color-surface: #fafaf9;
  --color-text-primary: #292524;
  --color-text-secondary: #78716c;
  --color-border: #d6d3d1;
  --content-width: 500px;
  --spacing-base: 4px;
}

.dark {
  --color-bg: #000000;
  --color-surface: #1f1f1f;
  --color-text-primary: #fafaf9;
  --color-text-secondary: #a8a29e;
  --color-border: #57534e;
}
```

---

*This style guide captures the design system of a minimal, elegant portfolio. The aesthetic emphasizes typography, whitespace, and subtle interactions over heavy visual elements.*
