# Yogu.one Design System

A unified design reference for all projects in the Yogu.one ecosystem. All apps share the same foundational tokens, component patterns, and interaction conventions to ensure a consistent user experience across the suite.

---

## Table of Contents

1. [Design Principles](#design-principles)
2. [Colour Tokens](#colour-tokens)
3. [Typography](#typography)
4. [Spacing Scale](#spacing-scale)
5. [Border Radius](#border-radius)
6. [Shadows](#shadows)
7. [Transitions](#transitions)
8. [Buttons](#buttons)
9. [Form Elements](#form-elements)
10. [Layout & Container](#layout--container)
11. [Header Component](#header-component)
12. [Footer Component](#footer-component)
13. [Toast Notifications](#toast-notifications)
14. [Dark Mode](#dark-mode)
15. [Responsive Breakpoints](#responsive-breakpoints)
16. [Accessibility](#accessibility)
17. [Per-App Accent Colours](#per-app-accent-colours)
18. [CSS File Structure](#css-file-structure)
19. [HTML Conventions](#html-conventions)

---

## Design Principles

- **Simplicity first** — no frameworks, no bloat; vanilla HTML, CSS, and JS only
- **Performance** — minimal dependencies, system fonts as fallback, no cookies or trackers
- **Accessibility** — semantic HTML, ARIA labels, keyboard navigability, screen-reader support
- **Consistency** — shared tokens and component patterns across all apps
- **Privacy** — all processing client-side; no data leaves the browser

---

## Colour Tokens

All colours are defined as CSS custom properties in `variables.css`. The palette is based on the Tailwind CSS slate scale.

### Light Mode (`:root`)

| Token | Value | Usage |
|---|---|---|
| `--primary-colour` | `#0f172a` | Headings, primary text emphasis |
| `--accent-colour` | *per-app* | Interactive elements, highlights, accent bar |
| `--bg-main` | `#ffffff` | Page background |
| `--bg-subtle` | `#f8fafc` | Card/panel backgrounds |
| `--bg-input` | `#ffffff` | Input field backgrounds |
| `--text-main` | `#0f172a` | Body text |
| `--text-muted` | `#64748b` | Secondary labels, placeholders |
| `--text-secondary` | `#94a3b8` | Tertiary text, footer, metadata |
| `--border-colour` | `#e2e8f0` | Borders, dividers |
| `--border-input` | `#e2e8f0` | Input borders |
| `--shadow-color` | `rgb(0 0 0 / 0.1)` | Shadow base colour |
| `--error-colour` | `#ef4444` | Error states, destructive actions |
| `--success-colour` | `#22c55e` | Success states, confirmations |

> **Note:** Some apps swap `--bg-main` and `--bg-subtle` (e.g. konbata and tokun use `#f8fafc` as the page background and `#ffffff` for cards). Both approaches are valid — the key is that `--bg-subtle` is always slightly offset from `--bg-main`.

### Dark Mode (`[data-theme="dark"]`)

| Token | Value |
|---|---|
| `--primary-colour` | `#f8fafc` |
| `--bg-main` | `#0f172a` |
| `--bg-subtle` | `#1e293b` |
| `--bg-input` | `#1e293b` |
| `--text-main` | `#f8fafc` |
| `--text-muted` | `#94a3b8` |
| `--text-secondary` | `#64748b` |
| `--border-colour` | `#334155` |
| `--border-input` | `#334155` |
| `--shadow-color` | `rgb(0 0 0 / 0.25)` |

### Optional Tokens (used by calculator/chart apps)

| Token | Light | Dark |
|---|---|---|
| `--bg-range` | `#e2e8f0` | `#334155` |
| `--grid-line-color` | `var(--border-colour)` | `var(--border-colour)` |
| `--grid-line-bold-color` | `#cbd5e1` | `#475569` |

---

## Typography

```css
--font-family: "Inter", system-ui, -apple-system, sans-serif;
--font-mono:   "JetBrains Mono", "Fira Code", ui-monospace, monospace;
--font-size-base: 16px;
```

- **Inter** is loaded from Google Fonts with weights `400; 500; 600; 700; 800; 900`
- Monospace font (`--font-mono`) is used for code editors and textarea inputs containing structured data
- `line-height: 1.5` on `body`

### Type Scale

| Element | Size | Weight | Notes |
|---|---|---|---|
| `h1` (app title) | `1.875rem` | `800` | `letter-spacing: -0.025em` |
| `h1` (mobile) | `1.5rem` | `800` | Scales up at `768px` |
| `h2` (section) | `1.5rem` | `800` | |
| `h2` (hero) | `2.5rem` | `900` | yogu-one homepage only |
| `h3` (card title) | `1.25rem` | `700` | |
| Labels | `0.875rem` | `600–700` | Uppercase + `letter-spacing: 0.05em` for form labels |
| Body | `1rem` | `400` | |
| Small / meta | `0.875rem` | `400–500` | |
| Micro / footer | `0.75rem` | `500` | |

---

## Spacing Scale

All spacing uses a consistent rem-based scale:

```css
--spacing-xs:  0.25rem;   /*  4px */
--spacing-sm:  0.5rem;    /*  8px */
--spacing-md:  1rem;      /* 16px */
--spacing-lg:  1.5rem;    /* 24px */
--spacing-xl:  2rem;      /* 32px */
--spacing-2xl: 3rem;      /* 48px */
```

`--spacing-unit` is an alias for `--spacing-md` (`1rem`) and is used for legacy/shorthand calculations.

---

## Border Radius

```css
--border-radius-sm:  0.375rem;   /*  6px */
--border-radius-md:  0.5rem;     /*  8px */
--border-radius-lg:  0.75rem;    /* 12px */
--border-radius-xl:  1rem;       /* 16px */
--border-radius-2xl: 1.5rem;     /* 24px */
--border-radius-3xl: 2rem;       /* 32px */
```

**Usage guidelines:**
- `--border-radius-sm` — badges, status chips, small inline elements
- `--border-radius-md` — buttons, inputs, selects, small cards
- `--border-radius-lg` — editor panes, converter panels, standard cards
- `--border-radius-xl` — large inputs (calculator-style), prominent form fields
- `--border-radius-3xl` — results cards, large display panels

---

## Shadows

```css
--shadow-sm: 0 1px 2px 0 var(--shadow-color);
--shadow-md: 0 4px 6px -1px var(--shadow-color),
             0 2px 4px -2px var(--shadow-color);
```

- `--shadow-sm` — subtle lift for small elements
- `--shadow-md` — cards, panels, toasts, dropdowns

---

## Transitions

```css
--transition-speed: 0.2s;
```

All interactive elements use `transition: all var(--transition-speed)` or targeted property transitions (e.g. `background-color`, `border-color`, `color`). The body transitions `background-color` and `color` on theme change.

---

## Buttons

### Primary Button

Used for the main call-to-action (copy, download, submit).

```css
background-color: var(--btn-primary-bg);   /* = var(--accent-colour) */
color:            var(--btn-primary-text);  /* = #ffffff */
border:           none;
border-radius:    var(--border-radius-md);
padding:          0.5rem 1rem;
font-weight:      600;
cursor:           pointer;
transition:       background-color 0.2s, opacity 0.2s;
```

Hover: `opacity: 0.9`

### Secondary Button

Used for utility actions (swap, clear, reset).

```css
background-color: var(--btn-secondary-bg);     /* = var(--bg-subtle) */
color:            var(--btn-secondary-text);    /* = var(--text-main) */
border:           1px solid var(--btn-secondary-border); /* = var(--border-colour) */
border-radius:    var(--border-radius-md);
padding:          0.5rem 1rem;
font-weight:      600;
```

Hover: `background-color: var(--bg-main)`

### Header / Icon Button (`.header-btn`, `.theme-toggle`)

Used in the header for navigation and theme toggling.

```css
background:    none;
border:        2px solid var(--border-colour);
border-radius: var(--border-radius-md);
padding:       var(--spacing-sm);
color:         var(--text-muted);
display:       flex;
align-items:   center;
justify-content: center;
transition:    all var(--transition-speed);
```

Hover: `background-color: var(--bg-subtle); color: var(--primary-colour)`

### Icon-only Button (`.btn-icon`)

Borderless icon button used inline within content areas.

```css
background: none;
border:     none;
color:      var(--text-muted);
padding:    var(--spacing-xs);
cursor:     pointer;
transition: color var(--transition-speed), transform var(--transition-speed);
```

Hover: `color: var(--accent-colour); transform: scale(1.1)`

---

## Form Elements

### Text Inputs & Textareas

```css
width:            100%;
padding:          0.75rem;
border:           1px solid var(--border-colour);
border-radius:    var(--border-radius-md);
background-color: var(--bg-input);
color:            var(--text-main);
font-size:        0.9rem;
resize:           vertical;   /* textareas only */
transition:       border-color 0.2s;
```

Focus state:
```css
outline:    none;
border-color: var(--accent-colour);
box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
```

Error state:
```css
border-color: var(--error-colour);
box-shadow:   0 0 0 2px rgba(239, 68, 68, 0.1);
```

Textareas containing code or structured data use `--font-mono`.

### Select Dropdowns

```css
padding:          0.5rem;
border:           1px solid var(--border-colour);
border-radius:    var(--border-radius-md);
background-color: var(--bg-input);
color:            var(--text-main);
appearance:       none;
background-image: url("data:image/svg+xml,..."); /* chevron icon, slate-500 */
background-position: right 0.5rem center;
background-size:  1.5em 1.5em;
padding-right:    2.5rem;
```

Dark mode uses a lighter chevron (`#94a3b8`).

### Range Inputs

```css
width:        100%;
height:       0.375rem;
background:   var(--bg-range);
border-radius: var(--border-radius-lg);
appearance:   none;
accent-color: var(--accent-colour);
```

### Form Labels

```css
font-size:   0.875rem;
font-weight: 600–700;
```

For prominent calculator-style labels:
```css
text-transform: uppercase;
letter-spacing: 0.05em;
color:          var(--text-muted);
```

---

## Layout & Container

```css
.container {
  max-width: var(--container-max-width);
  width:     100%;
  margin:    0 auto;
}
```

Container max-widths by app type:

| App type | Max width |
|---|---|
| Full-width tools (enkoda, konbata, tokun) | `1152px` |
| Dashboard/calculator tools (fukuri, shouhizei) | `1152px` |
| Hub/portal (yogu-one) | `1024px` |

Body padding:
- Mobile: `var(--spacing-lg)` (`1.5rem`)
- Desktop (`≥1024px`): `var(--spacing-2xl)` (`3rem`)

---

## Header Component

Every app uses an identical header structure:

```html
<header>
  <div class="header-top">
    <div class="header-brand">
      <img src="assets/[app].png" alt="[App] Logo" class="logo" width="32" height="32">
      <h1>[App Name] — [Tagline]</h1>
    </div>
    <div class="header-actions">
      <!-- Optional: back-to-home link -->
      <a href="https://yogu.one" class="header-btn" title="Back to yogu.one" aria-label="Back to yogu.one">
        <!-- home SVG icon -->
      </a>
      <!-- Theme toggle -->
      <button id="theme-toggle" class="theme-toggle" aria-label="Toggle dark mode">
        <!-- sun SVG (shown in dark mode) -->
        <!-- moon SVG (shown in light mode) -->
      </button>
    </div>
  </div>
  <div class="header-accent"></div>
</header>
```

**Logo:** `2rem × 2rem` on mobile, `2.5rem × 2.5rem` on `≥768px`

**Accent bar (`.header-accent`):**
```css
height:           0.25rem;   /* 4px */
width:            5rem;      /* 80px */
background-color: var(--accent-colour);
margin-top:       var(--spacing-md);
```

The accent bar is the primary per-app colour identifier in the header.

**Theme toggle icon logic:**
- `.moon-icon` is hidden by default (light mode shows sun)
- `[data-theme="dark"] .sun-icon` → `display: none`
- `[data-theme="dark"] .moon-icon` → `display: block`

---

## Footer Component

```html
<footer>
  <p>&copy; 2026 [App Name]. Licensed under GNU GPL v3.</p>
</footer>
```

```css
footer {
  margin-top:   4rem;
  padding-top:  var(--spacing-xl);
  border-top:   1px solid var(--border-colour);
  text-align:   center;
  color:        var(--text-secondary);
  font-size:    0.75rem;
  font-weight:  500;
}
```

The yogu-one hub footer additionally includes a navigation link:
```html
<nav class="footer-nav">
  <a href="https://gitlab.com/yogu-one/">Project on GitLab</a>
</nav>
```

---

## Toast Notifications

Toasts appear fixed at the bottom-right of the viewport.

```html
<div id="toast-container"></div>
```

```css
#toast-container {
  position:        fixed;
  bottom:          2rem;
  right:           2rem;
  z-index:         1000;
  display:         flex;
  flex-direction:  column;
  gap:             0.5rem;
}

.toast {
  padding:          1rem 1.5rem;
  background-color: var(--bg-subtle);
  color:            var(--text-main);
  border-radius:    var(--border-radius-md);
  box-shadow:       var(--shadow-md);
  border-left:      4px solid var(--accent-colour);
  min-width:        250px;
  animation:        slideIn 0.3s ease-out;
}

.toast.success { border-left-color: var(--success-colour); }
.toast.error   { border-left-color: var(--error-colour); }
```

Entrance animation:
```css
@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}
```

Exit: add class `.toast-fade-out` → `opacity: 0; transform: translateX(1rem); transition: opacity 0.3s, transform 0.3s`

---

## Dark Mode

Dark mode is toggled by setting `data-theme="dark"` on the `<html>` element. Theme preference is persisted in `localStorage` under the key `"theme"`.

**Flash-of-unstyled-content (FOUC) prevention** — every app includes this inline script in `<head>` before any stylesheets:

```html
<script>
  (function () {
    const storedTheme = localStorage.getItem("theme");
    const theme = storedTheme ||
      (globalThis.matchMedia &&
          globalThis.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    document.documentElement.setAttribute("data-theme", theme);
  })();
</script>
```

Theme toggle logic lives in `js/theme.js` (shared pattern across all apps).

---

## Responsive Breakpoints

| Breakpoint | Value | Usage |
|---|---|---|
| Mobile (default) | `< 768px` | Single-column, stacked layouts |
| Tablet | `≥ 768px` | Logo size increase, h1 font size increase |
| Desktop | `≥ 1024px` | Multi-column layouts, increased body padding |

Media query pattern:
```css
/* Mobile-first */
@media (min-width: 768px) { ... }
@media (min-width: 1024px) { ... }
```

---

## Accessibility

- All interactive elements have `aria-label` attributes where the visible label is absent
- `lang="en-GB"` on `<html>` (British English)
- Screen-reader-only utility class:
  ```css
  .sr-only {
    position:   absolute;
    width:      1px;
    height:     1px;
    padding:    0;
    margin:     -1px;
    overflow:   hidden;
    clip:       rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
  ```
- Live regions: `aria-live="polite"` on error message containers
- Semantic HTML: `<header>`, `<main>`, `<footer>`, `<section>`, `<nav>`
- Print styles: hide controls and actions; remove shadows and backgrounds

---

## Per-App Accent Colours

Each app has a single accent colour that replaces `--accent-colour`. All other tokens remain identical.

| App | Accent Colour | Hex | Category |
|---|---|---|---|
| **yogu-one** | Emerald | `#10b981` | Hub |
| **enkoda** | Blue | `#2563eb` | Dev tools |
| **konbata** | Blue | `#2563eb` | Dev tools |
| **tokun** | Blue | `#2563eb` | Dev tools |
| **fukuri** | Emerald | `#10b981` | Financial tools |
| **shouhizei** | Emerald | `#10b981` | Financial tools |

The accent colour is used for:
- The header accent bar
- Input focus rings
- Primary button background
- Range input thumb (`accent-color`)
- Toast default border
- Link colours
- Hover states on icon buttons
- Chart/visualisation fills

---

## CSS File Structure

Every app follows the same two-file CSS structure:

```
web/css/
├── variables.css   ← all CSS custom properties (tokens)
└── styles.css      ← all component and layout styles
```

`variables.css` is loaded first, then `styles.css`. Both are linked from `<head>`:

```html
<link rel="stylesheet" href="css/variables.css">
<link rel="stylesheet" href="css/styles.css">
```

### `variables.css` structure

```css
:root {
  /* Colours */
  /* Typography */
  /* Spacing */
  /* Border radius */
  /* Shadows & transitions */
  /* Button tokens */
  /* Container */
}

[data-theme="dark"] {
  /* Colour overrides only */
}
```

### `styles.css` structure

1. Reset (`* { box-sizing: border-box; margin: 0; padding: 0; }`)
2. Base (`body`, `a`)
3. Container
4. Header
5. Main / app-specific layout and components
6. Footer
7. Utilities (`.hidden`, `.sr-only`)
8. Toast notifications
9. Print styles (`@media print`)

---

## HTML Conventions

- `<!DOCTYPE html>` with `lang="en-GB"`
- `<meta charset="UTF-8">` and `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- Favicon: `<link rel="icon" type="image/png" href="assets/[app].png">`
- Google Fonts preconnect before the font stylesheet
- FOUC-prevention inline script immediately before closing `</head>`
- JS scripts loaded at end of `<body>` in order: `theme.js`, `utils.js` (if present), app-specific JS
- SVG icons are inline (no external icon library dependency)
- All SVG icons use `stroke="currentColor"` for theme-aware colouring
- `width` and `height` attributes on `<img>` elements to prevent layout shift
