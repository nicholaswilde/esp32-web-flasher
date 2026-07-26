export function initConsole() {
  const connectBtn = document.getElementById("console-connect-btn");
  const toggleBtn = document.getElementById("console-toggle-btn");
  const clearBtn = document.getElementById("console-clear-btn");
  const terminal = document.getElementById("console-terminal");

  if (!connectBtn || !terminal) return;

  let port;
  let reader;
  let readableStreamClosed;
  let keepReading = true;

  // Add initial message
  terminal.textContent = "Serial console ready. Click 'Connect to Console' to begin.\n";

  connectBtn.addEventListener("click", async () => {
    if (port) {
      await disconnect();
      return;
    }

    try {
      port = await navigator.serial.requestPort();
      await port.open({ baudRate: 115200 }); // standard for ESP32

      connectBtn.textContent = "Disconnect";
      clearBtn.disabled = false;
      
      // Auto-show terminal on connect
      if (terminal.style.display === "none" && toggleBtn) {
        terminal.style.display = "block";
        toggleBtn.textContent = "Hide Logs";
      }

      terminal.textContent += "\n--- Connected ---\n";
      
      keepReading = true;
      readLoop();
    } catch (e) {
      console.error(e);
      terminal.textContent += `\nError connecting: ${e.message}\n`;
      port = null;
    }
  });

  clearBtn.addEventListener("click", () => {
    terminal.textContent = "";
  });

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      if (terminal.style.display === "none") {
        terminal.style.display = "block";
        toggleBtn.textContent = "Hide Logs";
      } else {
        terminal.style.display = "none";
        toggleBtn.textContent = "Show Logs";
      }
    });
  }

  async function readLoop() {
    while (port && port.readable && keepReading) {
      const textDecoder = new TextDecoderStream();
      readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      reader = textDecoder.readable.getReader();

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }
          if (value) {
            terminal.textContent += value;
            terminal.scrollTop = terminal.scrollHeight; // auto-scroll
          }
        }
      } catch (error) {
        console.error(error);
        terminal.textContent += `\nError reading: ${error.message}\n`;
      } finally {
        reader.releaseLock();
      }
    }
  }

  async function disconnect() {
    keepReading = false;
    if (reader) {
      try {
        await reader.cancel();
      } catch (e) {
        // Ignore if already released
      }
    }
    if (readableStreamClosed) {
      try {
        await readableStreamClosed.catch(() => {});
      } catch (e) {}
    }
    if (port) {
      try {
        await port.close();
      } catch (e) {
        console.error("Error closing port:", e);
      }
      port = null;
    }
    connectBtn.textContent = "Connect to Console";
    clearBtn.disabled = true;
    terminal.textContent += "\n--- Disconnected ---\n";
  }
}
