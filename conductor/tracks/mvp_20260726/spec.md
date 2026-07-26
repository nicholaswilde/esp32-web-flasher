# Specification: MVP/Initial Implementation

## Overview
Bootstrapping the ESP32 Web Flasher project as a static client-side web application. This MVP will establish the core architecture (HTML/JS/CSS), integrate the ESP Web Tools library (`<esp-web-install-button>`), and provide the foundational user interface styled with the Catppuccin Mocha color palette.

## Functional Requirements
- **Web Flashing UI**: Render the `<esp-web-install-button>` to interface with ESP32 devices via the Web Serial API.
- **GitHub Integration**: Fetch the latest releases from a configured GitHub repository using the GitHub REST API and extract `.bin` asset URLs.
- **Manual Upload**: Provide a file input for users to manually upload `.bin` files for flashing.
- **Dynamic Configuration**: Load runtime settings (e.g., GitHub repository target, default memory addresses) from an external `config.json` file.
- **Dynamic Manifest**: Generate an in-memory `manifest.json` based on either the GitHub release assets or the manually uploaded files.

## Non-Functional Requirements
- **Architecture**: 100% Client-side (HTML/Vanilla JS/CSS). No frontend framework (e.g., React, Vue) should be used.
- **Styling**: Utilize CSS variables (custom properties) in a central `style.css` file to implement the Catppuccin Mocha color palette.
- **Automation**: Setup local development scripts using `Taskfile.yml` for serving the application.

## Acceptance Criteria
- User can open the application in a Web Serial API compatible browser (e.g., Chrome/Edge).
- Application successfully fetches and parses `config.json` on load.
- UI is styled consistently using Catppuccin Mocha colors.
- User can connect an ESP32 device and see the install button.
- User can flash a `.bin` file obtained automatically from a GitHub release.
- User can flash a `.bin` file uploaded manually from their computer.

## Out of Scope
- Support for browsers without Web Serial API (e.g., Safari/Firefox).
- Advanced flashing options beyond standard firmware uploads.
- Theming other than Catppuccin Mocha.
