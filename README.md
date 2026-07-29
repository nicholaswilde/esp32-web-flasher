# ESP32 Web Flasher

A static, client-side web application to flash ESP32 devices directly from your browser using the Web Serial API and [ESP Web Tools](https://esphome.github.io/esp-web-tools/).

## Features

- **Automatic GitHub Releases:** Dynamically fetch and extract `.zip` firmware from GitHub releases via a simple configurable dropdown interface.
- **Direct Web Flashing:** Flash your ESP32 device directly from the browser without needing the Arduino IDE or command-line tools.
- **Manual Firmware Upload:** Select individual `.bin` files (Bootloader, Firmware App, and Partitions) and upload them to custom hex memory addresses (defaults to `0x1000`, `0x10000`, and `0x8000`).
- **Web Serial Console:** A built-in live terminal to view output logs straight from the ESP32. Extremely useful for verifying successful boots and debugging without needing external serial monitors.
- **Cross-Platform:** Works entirely locally on any Web Serial-compatible browser (Google Chrome, Microsoft Edge, Opera).

## Automatic GitHub Release & CORS Limitations

This app can fetch firmware directly from GitHub Releases by selecting a repository, version, and device. This feature utilizes an array of free public CORS proxies to bypass the browser's CORS restrictions when downloading release assets (like `.zip` files). 

**Important Note on CORS Proxies:**
Because free CORS proxies often impose strict rate limits or block large files (e.g., >1MB) to save bandwidth, you might occasionally encounter `429 Too Many Requests` or `403 Forbidden` errors in the console, causing the "Load Release" action to fail. 
- **Temporary Fix:** If you hit a `429` rate limit, simply wait a few minutes for your IP to be unblocked and try again. The app is programmed to automatically fall back through multiple proxies to maximize reliability.
- **Production Solution 1 (Recommended):** Host your raw `.bin` files directly on a `gh-pages` branch instead of GitHub Releases. GitHub Pages natively serves files with the proper CORS headers, completely eliminating the need for a proxy.
- **Production Solution 2:** Deploy your own free Cloudflare Worker to act as a private, unrestricted CORS proxy, and update the proxy list in `js/github.js`.

## Usage

Since this is a client-side application, it can be run by serving the directory locally or hosting it on any static web server (like GitHub Pages).

### Running Locally

You can use Python to spin up a quick local web server:

```bash
python3 -m http.server 8000
```

1. Open your browser and navigate to `http://localhost:8000`.
2. Connect your ESP32 device via USB.
3. Select your `.bin` files and click **Prepare Files for Flashing**, then click **Connect** to flash the firmware.
4. Use the **Serial Console** section to connect and view live logs.

## Tech Stack

- HTML5
- Vanilla CSS (Themed with [Catppuccin Mocha](https://github.com/catppuccin/catppuccin))
- Vanilla JavaScript
- [ESP Web Tools](https://esphome.github.io/esp-web-tools/)

## License

Apache-2.0 License
