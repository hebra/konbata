# Konbata (Text-Data Converter)

Konbata is a lightweight, client-side web tool designed to convert text-data
between different formats: JSON, YAML, XML, Properties, and TOML. It is built
with vanilla technologies (HTML5, CSS3, ES6+) and aims to provide a fast,
privacy-focused, and zero-dependency utility for developers.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://konbata.yogu.one)
[![Licence: GPL v3](https://img.shields.io/badge/Licence-GPLv3-blue.svg)](LICENSE)

## Features

- **Format Conversion**: Instantly convert between JSON, YAML, XML, Properties
  (.properties), and TOML.
- **Privacy-First**: All conversions happen in the browser. No data is sent to a
  server.
- **Zero-Dependency**: No external JS or CSS frameworks are used.
- **Dark/Light Mode**: Respects system preferences and allows manual override.
- **Responsive Design**: Optimised for mobile, tablet, and desktop.
- **Accessibility**: Follows WCAG AA standards.

## Tech Stack

- **HTML5**: Semantic markup and accessibility.
- **CSS3**: Modern layouts using Grid and Flexbox.
- **Vanilla JavaScript**: Pure DOM manipulation and logic.
- **Deno**: Development server, formatting, and linting.
- **Makefile**: Task runner for common operations.

## Development

### Prerequisites

- [Deno](https://deno.land/) installed.
- `make` installed.

### Commands

- `make serve`: Start the local development server.
- `make fmt`: Format source files using Deno.
- `make lint`: Lint source files using Deno.

## Licence

This project is licensed under the GNU GPL v3. See the [LICENSE](LICENSE) file
for details.
