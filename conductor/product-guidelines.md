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
