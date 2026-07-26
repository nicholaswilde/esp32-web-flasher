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
