# Bullet Points + Hover Effects

This guide documents how the rotating diamond bullets and subtle text shift are implemented in this repo. It is written for Tailwind + React/Next.js, with a plain CSS fallback.

## Where this pattern appears

- Primary example: `v2/src/app/page.js`
- Reference notes: `v2/STYLE_GUIDE.md` (List Items / Diamond Bullets)

## Tailwind implementation (recommended)

### 1) List item structure

Use a `li` that is `relative` and `group`, then position the diamond bullet absolutely.

```jsx
<li className="group relative flex items-start gap-4 pl-4 hover:translate-x-1 transition-transform duration-200">
  <div className="absolute left-0 top-[10px] w-[6px] h-[6px] bg-stone-800 dark:bg-stone-200 rotate-45 transform transition-all duration-300 group-hover:rotate-90 group-hover:scale-110" />
  <span className="text-stone-600 dark:text-stone-400">
    Your list item text goes here.
  </span>
</li>
```

### 2) Class responsibilities (what each does)

- `group`: allows the bullet to react to the parent hover state.
- `relative` + `absolute`: anchors the diamond at the left edge of the list item.
- `pl-4`: creates space so the text does not overlap the bullet.
- `hover:translate-x-1 transition-transform duration-200`: subtle text shift on hover.
- `w-[6px] h-[6px] rotate-45`: draws a small diamond by rotating a square.
- `transition-all duration-300 group-hover:rotate-90 group-hover:scale-110`: rotate + scale the diamond on hover.

### 3) Spacing and alignment

- `top-[10px]` aligns the bullet with the text baseline for 16px body text.
- Adjust the `top` value if the line height or font size changes.

## Plain CSS implementation (fallback)

If you do not want Tailwind utilities, the same effect can be built with classes and CSS.

### HTML

```html
<ul class="diamond-list">
  <li class="diamond-item">
    <span class="diamond-text">Your list item text goes here.</span>
  </li>
</ul>
```

### CSS

```css
.diamond-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.diamond-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding-left: 16px;
  transition: transform 200ms ease;
}

.diamond-item:hover {
  transform: translateX(4px);
}

.diamond-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 10px;
  width: 6px;
  height: 6px;
  background: currentColor;
  transform: rotate(45deg);
  transition: transform 300ms ease;
}

.diamond-item:hover::before {
  transform: rotate(90deg) scale(1.1);
}
```

## Notes and variants

- Keep animations short to feel responsive: 200ms for text shift, 300ms for bullet.
- If you are using `text-stone-*` colors, ensure the bullet uses the same color by default (`bg-stone-800` / `dark:bg-stone-200`) or `currentColor` in plain CSS.
- On tight layouts, reduce the hover translate (e.g., `translateX(2px)`) to avoid reflow with adjacent elements.

