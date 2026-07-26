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
