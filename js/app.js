import { fetchLatestReleaseManifest, applyManifestToButton } from "./github.js";
import { createManifestFromFiles } from "./upload.js";
import { initConsole } from "./console.js";

document.addEventListener("DOMContentLoaded", () => {
  // GitHub logic
  const fetchBtn = document.getElementById("fetch-github-btn");
  if (fetchBtn) {
    fetchBtn.disabled = false;
    fetchBtn.addEventListener("click", async () => {
      try {
        fetchBtn.textContent = "Fetching...";
        const manifest = await fetchLatestReleaseManifest();
        applyManifestToButton(manifest);
        fetchBtn.textContent = "Loaded: " + manifest.version;
      } catch (e) {
        console.error(e);
        fetchBtn.textContent = "Error fetching release";
      }
    });
  }

  // Upload logic
  const bootloaderFile = document.getElementById("bootloader-file");
  const bootloaderAddress = document.getElementById("bootloader-address");
  const partitionsFile = document.getElementById("partitions-file");
  const partitionsAddress = document.getElementById("partitions-address");
  const firmwareFile = document.getElementById("firmware-file");
  const firmwareAddress = document.getElementById("firmware-address");
  const uploadBtn = document.getElementById("upload-btn");

  if (uploadBtn) {
    const fileInputs = [bootloaderFile, partitionsFile, firmwareFile].filter(
      Boolean,
    );

    const checkInputs = () => {
      const hasAnyFile = fileInputs.some(
        (input) => input.files && input.files.length > 0,
      );
      uploadBtn.disabled = !hasAnyFile;
      uploadBtn.textContent = "Prepare Files for Flashing";
    };

    fileInputs.forEach((input) =>
      input.addEventListener("change", checkInputs),
    );

    uploadBtn.addEventListener("click", async () => {
      try {
        const parts = [];
        if (bootloaderFile && bootloaderFile.files[0]) {
          parts.push({
            file: bootloaderFile.files[0],
            address: bootloaderAddress.value,
          });
        }
        if (partitionsFile && partitionsFile.files[0]) {
          parts.push({
            file: partitionsFile.files[0],
            address: partitionsAddress.value,
          });
        }
        if (firmwareFile && firmwareFile.files[0]) {
          parts.push({
            file: firmwareFile.files[0],
            address: firmwareAddress.value,
          });
        }

        const manifest = await createManifestFromFiles(parts);
        applyManifestToButton(manifest);
        uploadBtn.textContent = "Ready to Flash";
      } catch (e) {
        console.error(e);
        uploadBtn.textContent = "Error preparing files";
      }
    });
  }

  // Console logic
  initConsole();
});
