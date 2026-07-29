# ESP32 Web Flasher

A static, client-side web application to flash ESP32 devices directly from your browser using the Web Serial API and [ESP Web Tools](https://esphome.github.io/esp-web-tools/).

## Features

- **Local Firmware Library:** Browse and flash pre-downloaded firmware releases from the local `firmware/` directory via a simple dropdown interface.
- **Direct Web Flashing:** Flash your ESP32 device directly from the browser without needing the Arduino IDE or command-line tools.
- **Manual Firmware Upload:** Select individual `.bin` files (Bootloader, Firmware App, and Partitions) and upload them to custom hex memory addresses (defaults to `0x1000`, `0x10000`, and `0x8000`).
- **Web Serial Console:** A built-in live terminal to view output logs straight from the ESP32. Extremely useful for verifying successful boots and debugging without needing external serial monitors.
- **Cross-Platform:** Works entirely locally on any Web Serial-compatible browser (Google Chrome, Microsoft Edge, Opera).

## Usage

Since this is a client-side application, it can be run by serving the directory locally or hosting it on any static web server (like GitHub Pages). To populate the firmware library, use the provided download script.

### Downloading Firmware

The application reads available releases from `firmware/index.json`. To download recent releases from all configured GitHub repositories and generate the index, run:

```bash
task download
```
*(This script uses the `gh` CLI to download releases and extracts them into the `firmware/` directory).*

### Adding Repositories

To add a new repository to the firmware library, run:

```bash
task add-repo -- <org/repo>
```

This updates `config.json` and automatically downloads its available releases.

### Per-Repository Addresses

By default, the web flasher uses standard ESP32 flash addresses (Bootloader: `0x1000`, Partitions: `0x8000`, App: `0x10000`). If a specific repository requires custom flash offsets, you can override them in `config.json` under `githubRepos`:

```json
  "githubRepos": {
    "nicholaswilde/custom-project": {
      "addresses": {
        "bootloader": "0x0000",
        "partitions": "0x8000",
        "app": "0x10000"
      }
    }
  }
```


### Running Locally

You can use Python to spin up a quick local web server:

```bash
task serve
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
