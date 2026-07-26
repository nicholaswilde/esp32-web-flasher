# Implementation Plan: MVP/Initial Implementation

## Phase 1: Project Setup and Automation [checkpoint: 1e71f2c]
- [x] Task: Initialize project structure (directories for css, js).
- [x] Task: Create `Taskfile.yml` for local development (serve, format, lint).
- [x] Task: Write initial `index.html` structure.
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 2: Configuration & Theming
- [ ] Task: Write Tests for configuration loading logic.
- [ ] Task: Create `config.json` and implementation in `js/config.js` to fetch and parse it on load.
- [ ] Task: Create `css/style.css` defining Catppuccin Mocha CSS variables and apply to basic layout.
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 3: ESP Web Tools Integration & Core UI
- [ ] Task: Write Tests for ESP Web Tools initialization and DOM presence.
- [ ] Task: Import `<esp-web-install-button>` script and add the component to `index.html`.
- [ ] Task: Style the UI layout, including placeholders for GitHub fetch and manual upload sections.
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 4: GitHub Integration & Dynamic Manifest
- [ ] Task: Write Tests mocking GitHub REST API responses and manifest generation.
- [ ] Task: Implement `js/github.js` to fetch latest releases of repositories defined in `config.json`.
- [ ] Task: Implement logic to extract `.bin` asset URLs and dynamically generate `manifest.json`.
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 5: Manual Uploads
- [ ] Task: Write Tests for file input handling and reading `.bin` files.
- [ ] Task: Implement `js/upload.js` to handle manual file uploads and dynamically generate manifest.
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)
