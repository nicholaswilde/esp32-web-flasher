import { loadConfig } from "./config.js";

export async function fetchLatestReleaseManifest() {
  const config = await loadConfig();
  const repo = config.githubRepo;

  const response = await fetch(
    `https://api.github.com/repos/${repo}/releases/latest`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch latest release from GitHub");
  }
  const release = await response.json();

  const binAssets = release.assets.filter((a) => a.name.endsWith(".bin"));
  if (binAssets.length === 0) {
    throw new Error("No .bin assets found in the latest release");
  }

  let parts = [];
  for (const asset of binAssets) {
    let offset = config.defaultAddresses.app;
    if (asset.name.toLowerCase().includes("bootloader")) {
      offset = config.defaultAddresses.bootloader;
    } else if (asset.name.toLowerCase().includes("partition")) {
      offset = config.defaultAddresses.partitions;
    }
    parts.push({
      path: asset.browser_download_url,
      offset: parseInt(offset, 16),
    });
  }

  const manifest = {
    name: config.githubRepo.split("/")[1] || "ESP32 App",
    version: release.tag_name,
    builds: [
      {
        chipFamily: "ESP32",
        parts: parts,
      },
    ],
  };

  return manifest;
}

export function applyManifestToButton(manifest) {
    const manifestStr = JSON.stringify(manifest);
    const manifestUrl = 'data:application/json;charset=utf-8,' + encodeURIComponent(manifestStr);
    let button = document.querySelector('esp-web-install-button');
    if (!button) {
        button = document.createElement('esp-web-install-button');
        const container = document.getElementById('install-container');
        if (container) {
            container.appendChild(button);
        }
    }
    button.setAttribute('manifest', manifestUrl);
    return manifestUrl;
}
