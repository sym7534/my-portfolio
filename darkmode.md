# Dark Mode Guide

## Overview

- Tailwind runs in class-based dark mode (`darkMode: "class"`).
- A `ThemeProvider` stores the current theme, persists it in `localStorage`, and toggles the `dark` class on `<html>`.
- Components use Tailwind `dark:*` utilities to switch colors.
- The Header button and Command Palette both call `toggleTheme()`.

## 1) Tailwind configuration

`v2/tailwind.config.js` enables class-based dark mode:

```js
module.exports = {
  darkMode: "class",
  // ...
};
```

This means any `dark:*` utility is activated when the `dark` class is present on the root element.

## 2) ThemeProvider (state + persistence)

`v2/src/app/components/ThemeProvider.js`:

- Initializes theme state to `light`.
- On mount, checks `localStorage` and `prefers-color-scheme`.
- Adds/removes the `dark` class on `document.documentElement`.
- Persists the selection to `localStorage`.
- Updates the favicon based on theme.

Key behaviors:

- If `localStorage` contains `theme`, it wins.
- Otherwise, OS preference (`prefers-color-scheme: dark`) sets the initial theme.

## 3) App wiring

`v2/src/app/layout.js` wraps the app:

```jsx
<ThemeProvider>
  <main className="... dark:bg-black ...">
    ...
  </main>
  <CommandPalette />
</ThemeProvider>
```

This ensures dark mode classes apply across the app.

## 4) Toggle button

`v2/src/app/components/Header.js` uses `useTheme()`:

- Button calls `toggleTheme`.
- Icon swaps between `Sun` and `Moon` based on `theme`.
- Button styles use `dark:*` utilities for hover and colors.

## 5) Command Palette toggle

`v2/src/app/components/CommandPalette.js` also calls `toggleTheme()` and labels the entry based on `theme`.

## 6) Styling + transitions

Most transitions are done via Tailwind utilities on individual elements, for example:

- `transition-colors` for text/background changes.
- `transition-all` for mixed effects.

There is no global theme transition; instead, components opt-in with transition classes where desired.

## Quick reference

- Config: `v2/tailwind.config.js`
- Provider: `v2/src/app/components/ThemeProvider.js`
- Toggle button: `v2/src/app/components/Header.js`
- Command palette toggle: `v2/src/app/components/CommandPalette.js`
- Global dark styles: `v2/src/app/layout.js`

