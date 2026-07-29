import { loadConfig } from "./config.js";

export async function fetchReleases(repo) {
  const response = await fetch(`https://api.github.com/repos/${repo}/releases`);
  if (!response.ok) {
    throw new Error("Failed to fetch releases from GitHub");
  }
  return await response.json();
}

export async function fetchReleaseManifest(repo, release, device) {
  const config = await loadConfig();

  // Filter assets by the selected device name if provided.
  let targetAssets = release.assets.filter((a) => a.name.match(/\.(bin|zip)$/i));
  if (device) {
    targetAssets = targetAssets.filter((a) => a.name.toLowerCase().includes(device.toLowerCase()));
  }

  if (targetAssets.length === 0) {
    throw new Error(`No firmware assets found for device ${device} in this release`);
  }

  let parts = [];
  
  const proxies = [
    url => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(url)}`,
    url => `https://thingproxy.freeboard.io/fetch/${url}`,
    url => `https://cors.eu.org/${url}`,
    url => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
  ];
  
  let workingProxy = proxies[0]; // Default for non-zip paths if needed
  
  const zipAsset = targetAssets.find(a => a.name.endsWith(".zip"));
  
  if (zipAsset) {
    console.log("Fetching and extracting zip asset:", zipAsset.name);
    let zipBuffer = null;
    
    for (const proxy of proxies) {
      try {
        console.log(`Trying proxy: ${proxy('URL')}`);
        const res = await fetch(proxy(zipAsset.browser_download_url));
        if (res.ok) {
          zipBuffer = await res.arrayBuffer();
          workingProxy = proxy; // Save the working proxy
          console.log("Successfully downloaded zip using proxy.");
          break;
        }
      } catch (e) {
        console.warn("Proxy failed:", e);
      }
    }
    
    if (!zipBuffer) {
      throw new Error("Failed to download zip file: all CORS proxies failed or were rate-limited.");
    }
    
    // JSZip is loaded globally in index.html
    const zip = await JSZip.loadAsync(zipBuffer);
    
    for (const [filename, file] of Object.entries(zip.files)) {
      if (filename.endsWith(".bin") && !file.dir) {
        const blob = await file.async("blob");
        const fileUrl = URL.createObjectURL(blob);
        
        let offset = config.defaultAddresses.app;
        if (filename.toLowerCase().includes("bootloader")) {
          offset = config.defaultAddresses.bootloader;
        } else if (filename.toLowerCase().includes("partition")) {
          offset = config.defaultAddresses.partitions;
        }
        parts.push({
          path: fileUrl,
          offset: parseInt(offset, 16),
        });
      }
    }
    
    if (parts.length === 0) {
      throw new Error("No .bin files found inside the zip archive");
    }
  } else {
    for (const asset of targetAssets) {
      if (!asset.name.endsWith(".bin")) continue;
      let offset = config.defaultAddresses.app;
      if (asset.name.toLowerCase().includes("bootloader")) {
        offset = config.defaultAddresses.bootloader;
      } else if (asset.name.toLowerCase().includes("partition")) {
        offset = config.defaultAddresses.partitions;
      }
      parts.push({
        path: workingProxy(asset.browser_download_url),
        offset: parseInt(offset, 16),
      });
    }
  }

  const manifest = {
    name: repo.split("/")[1] || "ESP32 App",
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
