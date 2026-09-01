# Project Rules & Guidelines

## RTK Command Guidelines
- **Git Operations**: Prefix `git` commands with `rtk` (e.g., `rtk git status`, `rtk git diff`, `rtk git log`, `rtk git commit`, `rtk git push`).
- **GitHub CLI**: Prefix `gh` commands with `rtk` (e.g., `rtk gh issue list | cat`, `rtk gh pr status | cat`). Always pipe `gh` commands to `cat` to bypass interactive pagers.
- **File & Directory Inspection**: Use `rtk ls`, `rtk tree`, `rtk find`, or `rtk read` when listing or reading files to get token-optimized output.
- **Searching**: Use `rtk grep` or `rtk rg` for line search pattern matching.
- **Build & Test Outputs**: Use `rtk err` or `rtk test` when running build/test commands to filter output to errors/failures only (e.g. `rtk test pio test -e native`).

## What To Do Next
- When asked "what to do next" (or similar), **always check the remote repository issues first** using `gh`:
  ```bash
  rtk gh issue list | cat
  ```

## GitHub Issue Creation Guidelines
When creating issues in this repository using `gh` / `rtk gh`:
- **Features / Enhancements**:
  - Title format: `[feat]: <description>`
  - Labels: `enhancement`
  - Example: `rtk gh issue create --title "[feat]: Add auto-reconnect" --label "enhancement" --body "..."`
- **Bugs / Fixes**:
  - Title format: `[bug] <description>`
  - Labels: `bug`
  - Example: `rtk gh issue create --title "[bug] Serial port disconnects abruptly" --label "bug" --body "..."`

# Product Definition: ESP32 Web Flasher

## Vision
A client-side static web application hosted on GitHub Pages that empowers users to flash ESP32 devices directly from their browser. Leveraging the ESP Web Tools library and Web Serial API, the application eliminates the need for complex local development environments. 

## Key Features
- **Dynamic Web Flashing**: Integration with the `<esp-web-install-button>` web component to interface with ESP32 devices over serial.
- **GitHub Integration**: Logic to query the GitHub REST API, fetch the latest releases of external ESP32 repositories, extract `.bin` asset URLs, and generate a dynamic `manifest.json` in memory.
- **Manual Uploads**: The ability for users to manually upload `.bin` files and specify custom memory addresses for flashing.
- **Dynamic Configuration**: Variables subject to change will be stored in external configuration files rather than hardcoded in the main logic.
- **Clean UI**: A minimal, aesthetically pleasing user interface styled strictly with the Catppuccin Mocha color palette.

## Technical Goals
- **Architecture**: Client-side only (HTML/JS/CSS).
- **Directory Structure**: A clean root directory with source and asset files neatly organized into subfolders.
- **Automation**: Use of `Taskfile.yml` (go-task) for local development tasks like code formatting and serving static files.
# Product Guidelines: ESP32 Web Flasher

## 1. Branding & Aesthetics
- **Theme**: Strictly utilize the **Catppuccin Mocha** color palette to provide a soothing, dark-mode-first aesthetic.
- **Design Language**: Minimalist and functional. Avoid unnecessary borders, complex gradients, or cluttered layouts. Let the content and interactive elements breathe.
- **Typography**: Clean, sans-serif fonts (e.g., Inter, Roboto) for high readability, with clear hierarchy between headings and body text.

## 2. Voice & Tone
- **Voice**: Technical yet accessible, precise, and helpful.
- **Tone**: Professional and straightforward. Error messages should be constructive (e.g., "Failed to connect to the serial port. Please ensure no other application is using it.") rather than vague (e.g., "Error 500").

## 3. User Experience (UX) Principles
- **Frictionless Onboarding**: The primary action (flashing the device) should be immediately visible and require as few clicks as possible.
- **Clear Feedback**: Always provide visual feedback for state changes (e.g., connecting, downloading manifest, flashing in progress, success/failure).
- **Graceful Degradation**: If the Web Serial API is unsupported by the browser, display a clear, friendly message indicating compatibility requirements rather than failing silently.
- **Flexibility without Clutter**: Advanced options (like manual `.bin` uploads and memory address configuration) should be easily accessible but not detract from the default, automated flow.
# Technology Stack: ESP32 Web Flasher

## Core Technologies
- **Frontend Core**: Vanilla HTML, JavaScript, and CSS (no heavy framework required).
- **Styling**: Custom CSS implementing the Catppuccin Mocha color palette.

## Libraries & APIs
- **ESP Web Tools**: For the `<esp-web-install-button>` web component and serial communication protocols.
- **Web Serial API**: Browser-native API required to communicate with the ESP32 via USB.
- **GitHub REST API**: Used via `fetch()` in JavaScript to dynamically resolve the latest releases and `.bin` URLs.

## Development & Automation
- **Task Runner**: `go-task` (`Taskfile.yml`) to orchestrate local development commands.
- **Local Server**: Python's `http.server` module (`python3 -m http.server`) for serving static files locally during development.
- **Hosting**: GitHub Pages for production deployment.
# General Code Style Principles

This document outlines general coding principles that apply across all languages
and frameworks used in this project.

## Readability

-   Code should be easy to read and understand by humans.
-   Avoid overly clever or obscure constructs.

## Consistency

-   Follow existing patterns in the codebase.
-   Maintain consistent formatting, naming, and structure.

## Simplicity

-   Prefer simple solutions over complex ones.
-   Break down complex problems into smaller, manageable parts.

## Maintainability

-   Write code that is easy to modify and extend.
-   Minimize dependencies and coupling.

## Documentation

-   Document *why* something is done, not just *what*.
-   Keep documentation up-to-date with code changes.
# Google HTML/CSS Style Guide Summary

This document summarizes key rules and best practices from the Google HTML/CSS
Style Guide.

## 1. General Rules

-   **Protocol:** Use HTTPS for all embedded resources.
-   **Indentation:** Indent by 2 spaces. Do not use tabs.
-   **Capitalization:** Use only lowercase for all code (element names,
    attributes, selectors, properties).
-   **Trailing Whitespace:** Remove all trailing whitespace.
-   **Encoding:** Use UTF-8 (without a BOM). Specify `<meta charset="utf-8">` in
    HTML.

## 2. HTML Style Rules

-   **Document Type:** Use `<!doctype html>`.
-   **HTML Validity:** Use valid HTML.
-   **Semantics:** Use HTML elements according to their intended purpose (e.g.,
    use `<p>` for paragraphs, not for spacing).
-   **Multimedia Fallback:** Provide `alt` text for images and
    transcripts/captions for audio/video.
-   **Separation of Concerns:** Strictly separate structure (HTML), presentation
    (CSS), and behavior (JavaScript). Link to CSS and JS from external files.
-   **`type` Attributes:** Omit `type` attributes for stylesheets (`<link>`) and
    scripts (`<script>`).

## 3. HTML Formatting Rules

-   **General:** Use a new line for every block, list, or table element, and
    indent its children.
-   **Quotation Marks:** Use double quotation marks (`""`) for attribute values.

## 4. CSS Style Rules

-   **CSS Validity:** Use valid CSS.
-   **Class Naming:** Use meaningful, generic names. Separate words with a
    hyphen (`-`).
    -   **Good:** `.video-player`, `.site-navigation`
    -   **Bad:** `.vid`, `.red-text`
-   **ID Selectors:** Avoid using ID selectors for styling. Prefer class
    selectors.
-   **Shorthand Properties:** Use shorthand properties where possible (e.g.,
    `padding`, `font`).
-   **`0` and Units:** Omit units for `0` values (e.g., `margin: 0;`).
-   **Leading `0`s:** Always include leading `0`s for decimal values (e.g.,
    `font-size: 0.8em;`).
-   **Hexadecimal Notation:** Use 3-character hex notation where possible (e.g.,
    `#fff`).
-   **`!important`:** Avoid using `!important`.

## 5. CSS Formatting Rules

-   **Declaration Order:** Alphabetize declarations within a rule.
-   **Indentation:** Indent all block content.
-   **Semicolons:** Use a semicolon after every declaration.
-   **Spacing:**
    -   Use a space after a property name's colon (`font-weight: bold;`).
    -   Use a space between the last selector and the opening brace (`.foo {`).
    -   Start a new line for each selector and declaration.
-   **Rule Separation:** Separate rules with a new line.
-   **Quotation Marks:** Use single quotes (`''`) for attribute selectors and
    property values (e.g., `[type='text']`).

**BE CONSISTENT.** When editing code, match the existing style.

*Source:
[Google HTML/CSS Style Guide](https://google.github.io/styleguide/htmlcssguide.html)*
# Google JavaScript Style Guide Summary

This document summarizes key rules and best practices from the Google JavaScript
Style Guide.

## 1. Source File Basics

-   **File Naming:** All lowercase, with underscores (`_`) or dashes (`-`).
    Extension must be `.js`.
-   **File Encoding:** UTF-8.
-   **Whitespace:** Use only ASCII horizontal spaces (0x20). Tabs are forbidden
    for indentation.

## 2. Source File Structure

-   New files should be ES modules (`import`/`export`).
-   **Exports:** Use named exports (`export {MyClass};`). **Do not use default
    exports.**
-   **Imports:** Do not use line-wrapped imports. The `.js` extension in import
    paths is mandatory.

## 3. Formatting

-   **Braces:** Required for all control structures (`if`, `for`, `while`,
    etc.), even single-line blocks. Use K&R style ("Egyptian brackets").
-   **Indentation:** +2 spaces for each new block.
-   **Semicolons:** Every statement must be terminated with a semicolon.
-   **Column Limit:** 80 characters.
-   **Line-wrapping:** Indent continuation lines at least +4 spaces.
-   **Whitespace:** Use single blank lines between methods. No trailing
    whitespace.

## 4. Language Features

-   **Variable Declarations:** Use `const` by default, `let` if reassignment is
    needed. **`var` is forbidden.**
-   **Array Literals:** Use trailing commas. Do not use the `Array` constructor.
-   **Object Literals:** Use trailing commas and shorthand properties. Do not
    use the `Object` constructor.
-   **Classes:** Do not use JavaScript getter/setter properties (`get name()`).
    Provide ordinary methods instead.
-   **Functions:** Prefer arrow functions for nested functions to preserve
    `this` context.
-   **String Literals:** Use single quotes (`'`). Use template literals (`` `
    ``) for multi-line strings or complex interpolation.
-   **Control Structures:** Prefer `for-of` loops. `for-in` loops should only be
    used on dict-style objects.
-   **`this`:** Only use `this` in class constructors, methods, or in arrow
    functions defined within them.
-   **Equality Checks:** Always use identity operators (`===` / `!==`).

## 5. Disallowed Features

-   `with` keyword.
-   `eval()` or `Function(...string)`.
-   Automatic Semicolon Insertion.
-   Modifying builtin objects (`Array.prototype.foo = ...`).

## 6. Naming

-   **Classes:** `UpperCamelCase`.
-   **Methods & Functions:** `lowerCamelCase`.
-   **Constants:** `CONSTANT_CASE` (all uppercase with underscores).
-   **Non-constant Fields & Variables:** `lowerCamelCase`.

## 7. JSDoc

-   JSDoc is used on all classes, fields, and methods.
-   Use `@param`, `@return`, `@override`, `@deprecated`.
-   Type annotations are enclosed in braces (e.g., `/** @param {string} userName
    */`).

*Source:
[Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)*
