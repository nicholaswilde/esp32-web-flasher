# ESP32 Web Flasher

A static, client-side web application to flash ESP32 devices directly from your browser using the Web Serial API and [ESP Web Tools](https://esphome.github.io/esp-web-tools/).

## Features

- **Direct Web Flashing:** Flash your ESP32 device directly from the browser without needing the Arduino IDE or command-line tools.
- **Manual Firmware Upload:** Select individual `.bin` files (Bootloader, Firmware App, and Partitions) and upload them to custom hex memory addresses (defaults to `0x1000`, `0x10000`, and `0x8000`).
- **Web Serial Console:** A built-in live terminal to view output logs straight from the ESP32. Extremely useful for verifying successful boots and debugging without needing external serial monitors.
- **Cross-Platform:** Works entirely locally on any Web Serial-compatible browser (Google Chrome, Microsoft Edge, Opera).

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

MIT License
