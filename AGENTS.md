# Agent Guidelines: Konbata (Text-Data Converter Project)
## Project Overview
Konbata is a lightweight, client-side web tool designed to convert text-data between different formats, specifically JSON, YAML, and XML. The project aims to provide a fast, privacy-focused, and zero-dependency utility for developers to transform data structures instantly in the browser.
## Tech Stack
### Core Technologies (Mandatory)
- **HTML5**: Semantic markup, native form validation, and ARIA attributes for accessibility.
- **CSS3**: Modern layout (Grid, Flexbox) and Custom Properties for theming.
- **Vanilla JavaScript (ES6+)**: Pure DOM manipulation, no external frameworks or libraries.
- **Deno**: Used for the local development server, code formatting, and linting.
- **Makefile**: Task runner for common operations (`serve`, `fmt`, `lint`).
### Prohibited Technologies
- ❌ **React, Vue, Angular, or any JS frameworks**: Keep it framework-free.
- ❌ **Tailwind CSS, Bootstrap, or heavy CSS frameworks**: Use native CSS or a minimal classless framework.
- ❌ **TypeScript**: Use vanilla JavaScript for simplicity and zero build step.
- ❌ **Build tools (Webpack, Vite, etc.)**: No build process is required for this static site.
- ❌ **HTMX**: Not suitable for this static-site project.
## Core Architecture
The project follows a simple static-site structure focused on performance and maintainability:
```text
konbata/
├── web/                   # Website source files
│   ├── index.html         # Main entry point (UI structure)
│   ├── css/
│   │   ├── variables.css  # Global CSS variables (colours, spacing)
│   │   └── styles.css     # Main layout and component styling
│   ├── js/
│   │   ├── converter.js   # Core conversion logic (JSON, YAML, XML)
│   │   ├── theme.js       # Dark/Light mode logic (localStorage persisted)
│   │   └── utils.js       # Reusable helpers (toast, clipboard, formatting)
│   └── assets/
│       └── konbata.png    # Visual assets (logo, favicon)
├── AGENTS.md              # Project guidelines for AI agents
├── LICENSE                # Licence information (GNU GPL v3)
├── Makefile                # Task automation
├── README.md              # Documentation for developers
└── serve.ts               # Deno development server
```
### Module Responsibilities
- **`converter.js`**: Pure functions for converting between JSON, YAML, and XML. Handles real-time synchronisation and data validation.
- **`theme.js`**: Manages dark/light mode persistence and system preference detection.
- **`utils.js`**: Provides UI-agnostic helpers like `showToast`, `copyToClipboard`, and string formatting.
## Coding Standards
### Naming Conventions
- **HTML**: Use `kebab-case` for IDs and class names (e.g., `input-area`, `format-select`).
- **JavaScript**:
  - Use `camelCase` for variables, functions, and constants (e.g., `handleConvert`, `jsonData`).
  - Use descriptive names that reflect purpose (e.g., `sourceTextArea` vs `ta1`).
- **CSS**: Use simple semantic class naming or BEM (e.g., `editor-container`, `theme-toggle`).
### General Patterns
- **Functional Approach**: Prefer pure functions for data conversion; separate logic from DOM manipulation.
- **British English**: Use British English spelling (e.g., `colour`, `optimised`, `centre`) for both code comments and user-facing text.
- **No Build Step**: Do not add build tools or transpilers. The code must run directly in modern browsers.
- **Progressive Enhancement**: Ensure core functionality works without JavaScript; enhance with JS.
### Performance & Accessibility
- **Target Metrics**: Total page size < 100KB, FCP < 1.5s, TTI < 2.5s.
- **Accessibility**: Follow WCAG AA standards, ensuring high contrast, ARIA labels, and full keyboard navigation.
- **Manual Verification**: Test across mobile (< 768px), tablet (768px - 1024px), and desktop (> 1024px).
## Agent Constraints
### Dos
- ✅ **Use semantic HTML5**: Always use `<main>`, `<section>`, `<form>`, `<label>`, etc.
- ✅ **Mobile-first CSS**: Use Grid and Flexbox for responsive layouts.
- ✅ **Real-time Sync**: Ensure changes in source text reflect in the output format instantly.
- ✅ **JSDoc**: Add JSDoc comments for complex functions or non-obvious logic.
- ✅ **Error Handling**: Gracefully handle invalid data formats (e.g., malformed JSON) and show user-friendly error messages.
### Don'ts
- ❌ **No Frameworks**: Do not introduce any external JS or CSS frameworks.
- ❌ **No innerHTML**: Use `textContent` or `value` for displaying/editing data to prevent XSS.
- ❌ **No npm/Node**: Avoid `package.json` or `node_modules`. Stick to Deno for dev tasks.
- ❌ **No Absolute Paths**: Use relative paths for all internal assets and scripts.
- ❌ **No !important**: Avoid `!important` in CSS; use proper specificity.
### Mode-Specific Instructions
#### [CHAT]
- Provide architectural advice or explain project logic.
- Do not suggest external libraries or frameworks.
#### [CODE]
- All code changes must be validated with `make fmt` and `make lint` (if available).
- Ensure conversion accuracy between JSON, YAML, and XML.
- Maintain British English spelling in all comments and strings.
#### [SETUP]
- Ensure Deno is used for any server-side or build-related tasks.
- Do not introduce `package.json` or other Node.js-specific files.
## Version History
- **v1.0** (2026-03-06) - Initial guidelines established for the Konbata text-data converter project.
## Changelog
- Created `AGENTS.md` file based on patterns from sibling projects (`enkoda`, `fukuri`, `tokun`).
- Defined the tech stack as Vanilla JS, HTML, and CSS with Deno for dev tasks.
- Outlined the modular architecture and coding standards (British English).
---
**Last Updated:** 2026-03-06\
**Document Owner:** Project Team\
**Review Frequency:** As needed based on project evolution
