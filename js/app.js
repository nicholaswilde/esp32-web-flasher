import { fetchReleases, fetchReleaseManifest, applyManifestToButton } from "./github.js?v=5";
import { createManifestFromFiles } from "./upload.js";
import { initConsole } from "./console.js";
import { loadConfig } from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
  let config = {};
  try {
    config = await loadConfig();
    const repoLink = document.getElementById("repo-link");
    if (config.githubRepo && repoLink) {
      repoLink.href = `https://github.com/${config.githubRepo}`;
      document.getElementById("repo-name").textContent = config.githubRepo;
      repoLink.style.display = "flex";
    }
    
    if (config.copyrightOwner) {
      const ownerEl = document.getElementById("copyright-owner");
      if (config.copyrightLink) {
        ownerEl.innerHTML = `<a href="${config.copyrightLink}" target="_blank" rel="noopener noreferrer">${config.copyrightOwner}</a>`;
      } else {
        ownerEl.textContent = config.copyrightOwner;
      }
    }
    if (config.copyrightYear) {
      document.getElementById("copyright-year").textContent = config.copyrightYear;
    }
    if (config.version) {
      document.getElementById("app-version").textContent = config.version;
    }
    
    const bugLink = document.getElementById("bug-report-link");
    if (config.githubRepo && bugLink) {
      bugLink.href = `https://github.com/${config.githubRepo}/issues/new`;
      bugLink.style.display = "inline";
    }
  } catch (e) {
    console.error("Config load error", e);
  }

  // GitHub logic
  const fetchBtn = document.getElementById("fetch-github-btn");
  const repoSelect = document.getElementById("github-repo-select");
  const versionSelect = document.getElementById("github-version-select");
  const deviceSelect = document.getElementById("github-device-select");
  let currentReleases = [];

  if (fetchBtn && repoSelect && versionSelect && deviceSelect && config.githubRepos) {
    config.githubRepos.forEach(repo => {
      const opt = document.createElement("option");
      opt.value = repo;
      opt.textContent = repo;
      repoSelect.appendChild(opt);
    });

    if (config.devices) {
      config.devices.forEach(device => {
        const opt = document.createElement("option");
        opt.value = device;
        opt.textContent = device;
        deviceSelect.appendChild(opt);
      });
    }

    const loadVersions = async () => {
      const repo = repoSelect.value;
      if (!repo) return;
      versionSelect.disabled = true;
      versionSelect.innerHTML = "<option>Loading...</option>";
      fetchBtn.disabled = true;
      
      try {
        currentReleases = await fetchReleases(repo);
        versionSelect.innerHTML = "";
        currentReleases.forEach(r => {
          const opt = document.createElement("option");
          opt.value = r.tag_name;
          opt.textContent = r.tag_name;
          versionSelect.appendChild(opt);
        });
        versionSelect.disabled = false;
        fetchBtn.disabled = false;
      } catch (e) {
        console.error(e);
        versionSelect.innerHTML = "<option>Error loading versions</option>";
      }
    };

    repoSelect.addEventListener("change", loadVersions);
    
    if (config.githubRepos.length > 0) {
      loadVersions();
    }

    fetchBtn.addEventListener("click", async () => {
      try {
        fetchBtn.textContent = "Loading Release...";
        const repo = repoSelect.value;
        const version = versionSelect.value;
        const device = deviceSelect.value;
        
        const release = currentReleases.find(r => r.tag_name === version);
        if (!release) throw new Error("Release not found");

        const manifest = await fetchReleaseManifest(repo, release, device);
        applyManifestToButton(manifest);
        fetchBtn.textContent = "Loaded: " + manifest.version;
      } catch (e) {
        console.error(e);
        fetchBtn.textContent = "Error loading release";
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
