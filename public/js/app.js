import { applyManifestToButton } from "./github.js?v=8";
import { createManifestFromFiles } from "./upload.js";
import { initConsole } from "./console.js";
import { loadConfig } from "./config.js";

export function isPrerelease(version) {
  if (!version || typeof version !== "string") {
    return false;
  }
  return (
    /-[0-9A-Za-z.-]+$/.test(version) ||
    /(?:alpha|beta|rc|dev|preview)/i.test(version)
  );
}

export function parseUrlParams(search = window.location.search) {
  const params = new URLSearchParams(search);
  const isTruthy = (value) =>
    typeof value === "string" &&
    (value === "1" || value.toLowerCase() === "true");
  return {
    repo: params.get("repo") || "",
    device: params.get("device") || "",
    version: params.get("version") || "",
    prerelease: isTruthy(params.get("prerelease")),
    autoload: isTruthy(params.get("autoload")),
    bootloaderAddress:
      params.get("bootloaderAddress") || params.get("bootloader_address") || "",
    firmwareAddress:
      params.get("firmwareAddress") || params.get("firmware_address") || "",
    partitionsAddress:
      params.get("partitionsAddress") || params.get("partitions_address") || "",
  };
}

export function resolveRepoParam(repoParam, availableRepos) {
  if (!repoParam || !Array.isArray(availableRepos)) {
    return "";
  }
  if (availableRepos.includes(repoParam)) {
    return repoParam;
  }
  const matches = availableRepos.filter(
    (repo) => repo.split("/")[1] === repoParam,
  );
  return matches.length === 1 ? matches[0] : "";
}

export function resolveVersionParam(versionParam, availableVersions) {
  if (
    !versionParam ||
    !Array.isArray(availableVersions) ||
    availableVersions.length === 0
  ) {
    return "";
  }
  if (versionParam.toLowerCase() === "latest") {
    return availableVersions[0];
  }
  return availableVersions.includes(versionParam) ? versionParam : "";
}

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = parseUrlParams();
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
      document.getElementById("copyright-year").textContent =
        config.copyrightYear;
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
  const helpBtn = document.getElementById("help-github-btn");
  const repoSelect = document.getElementById("github-repo-select");
  const versionSelect = document.getElementById("github-version-select");
  const deviceSelect = document.getElementById("github-device-select");
  const prereleaseCheckbox = document.getElementById(
    "github-prerelease-checkbox",
  );

  if (fetchBtn && repoSelect && versionSelect && deviceSelect) {
    repoSelect.innerHTML = '<option value="">Select a repository...</option>';
    deviceSelect.innerHTML = '<option value="">Select a device...</option>';
    versionSelect.innerHTML = '<option value="">Select a version...</option>';
    deviceSelect.disabled = true;
    versionSelect.disabled = true;
    fetchBtn.disabled = true;
    if (helpBtn) {
      helpBtn.disabled = true;
    }

    let firmwareIndex = {};
    const applyGitHubUrlParams = () => {
      if (prereleaseCheckbox && urlParams.prerelease) {
        prereleaseCheckbox.checked = true;
      }
      const resolvedRepo = resolveRepoParam(
        urlParams.repo,
        Object.keys(firmwareIndex),
      );
      if (!resolvedRepo) {
        return;
      }
      repoSelect.value = resolvedRepo;
      repoSelect.dispatchEvent(new Event("change"));

      if (
        !urlParams.device ||
        !firmwareIndex[resolvedRepo]?.[urlParams.device]
      ) {
        return;
      }
      deviceSelect.value = urlParams.device;
      const allVersions = firmwareIndex[resolvedRepo][urlParams.device] || [];
      if (
        prereleaseCheckbox &&
        !prereleaseCheckbox.checked &&
        urlParams.version &&
        urlParams.version.toLowerCase() !== "latest" &&
        allVersions.includes(urlParams.version) &&
        isPrerelease(urlParams.version)
      ) {
        prereleaseCheckbox.checked = true;
      }
      populateVersions();

      const visibleVersions = Array.from(versionSelect.options)
        .map((opt) => opt.value)
        .filter(Boolean);
      const resolvedVersion = resolveVersionParam(
        urlParams.version,
        visibleVersions,
      );
      if (!resolvedVersion) {
        return;
      }
      versionSelect.value = resolvedVersion;
      updateFetchButton();
      if (urlParams.autoload && !fetchBtn.disabled) {
        fetchBtn.click();
      }
    };

    fetch("firmware/index.json")
      .then((res) => res.json())
      .then((data) => {
        firmwareIndex = data;
        Object.keys(firmwareIndex).forEach((repo) => {
          const opt = document.createElement("option");
          opt.value = repo;
          opt.textContent = repo;
          repoSelect.appendChild(opt);
        });
        applyGitHubUrlParams();
      })
      .catch((e) => console.error("Error loading firmware index:", e));

    const updateFetchButton = () => {
      fetchBtn.disabled =
        !repoSelect.value || !versionSelect.value || !deviceSelect.value;
    };

    const populateVersions = () => {
      const repo = repoSelect.value;
      const device = deviceSelect.value;
      const showPrereleases = prereleaseCheckbox
        ? prereleaseCheckbox.checked
        : false;
      const prevVersion = versionSelect.value;

      versionSelect.innerHTML = '<option value="">Select a version...</option>';
      if (!repo || !device || !firmwareIndex[repo]?.[device]) {
        versionSelect.disabled = true;
        updateFetchButton();
        return;
      }

      const allVersions = firmwareIndex[repo][device] || [];
      const versionsToShow = showPrereleases
        ? allVersions
        : allVersions.filter((v) => !isPrerelease(v));

      if (versionsToShow.length === 0) {
        versionSelect.disabled = true;
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent =
          allVersions.length > 0
            ? "No stable versions (enable Show pre-releases)"
            : "No versions available";
        opt.disabled = true;
        versionSelect.appendChild(opt);
      } else {
        versionSelect.disabled = false;
        versionsToShow.forEach((version) => {
          const opt = document.createElement("option");
          opt.value = version;
          opt.textContent = isPrerelease(version)
            ? `${version} (pre-release)`
            : version;
          versionSelect.appendChild(opt);
        });

        if (prevVersion && versionsToShow.includes(prevVersion)) {
          versionSelect.value = prevVersion;
        }
      }
      updateFetchButton();
    };

    repoSelect.addEventListener("change", () => {
      const repo = repoSelect.value;
      if (helpBtn) {
        helpBtn.disabled = !repo;
      }
      deviceSelect.innerHTML = '<option value="">Select a device...</option>';
      versionSelect.innerHTML = '<option value="">Select a version...</option>';
      versionSelect.disabled = true;
      if (!repo) {
        deviceSelect.disabled = true;
      } else {
        deviceSelect.disabled = false;
        Object.keys(firmwareIndex[repo] || {}).forEach((device) => {
          const opt = document.createElement("option");
          opt.value = device;
          opt.textContent = device;
          deviceSelect.appendChild(opt);
        });
      }
      updateFetchButton();
    });

    deviceSelect.addEventListener("change", populateVersions);

    if (prereleaseCheckbox) {
      prereleaseCheckbox.addEventListener("change", populateVersions);
    }

    versionSelect.addEventListener("change", updateFetchButton);

    fetchBtn.addEventListener("click", () => {
      try {
        fetchBtn.textContent = "Loading Release...";
        const repo = repoSelect.value;
        const version = versionSelect.value;
        const device = deviceSelect.value;

        const baseUrl = new URL(
          `firmware/${repo}/${device}/${version}`,
          window.location.href,
        ).href;

        const repoConfig = config.githubRepos?.[repo] || {};
        const addresses = repoConfig.addresses || config.defaultAddresses;

        const manifest = {
          name: repo.split("/")[1] || "ESP32 App",
          version: version,
          builds: [
            {
              chipFamily: "ESP32",
              parts: [
                {
                  path: `${baseUrl}/bootloader.bin`,
                  offset: parseInt(addresses.bootloader, 16),
                },
                {
                  path: `${baseUrl}/partitions.bin`,
                  offset: parseInt(addresses.partitions, 16),
                },
                {
                  path: `${baseUrl}/firmware.bin`,
                  offset: parseInt(addresses.app, 16),
                },
              ],
            },
          ],
        };

        applyManifestToButton(manifest);
        fetchBtn.textContent = "Loaded: " + manifest.version;
      } catch (e) {
        console.error(e);
        fetchBtn.textContent = "Error loading release";
      }
    });

    if (helpBtn) {
      helpBtn.addEventListener("click", () => {
        const repo = repoSelect.value;
        if (repo) {
          const repoConfig = config.githubRepos?.[repo];
          const helpUrl = repoConfig?.helpUrl || `https://github.com/${repo}`;
          window.open(helpUrl, "_blank", "noopener,noreferrer");
        }
      });
    }

    const clearGithubBtn = document.getElementById("clear-github-btn");
    if (clearGithubBtn) {
      clearGithubBtn.addEventListener("click", () => {
        repoSelect.value = "";
        deviceSelect.value = "";
        if (prereleaseCheckbox) {
          prereleaseCheckbox.checked = false;
        }
        versionSelect.innerHTML =
          '<option value="">Select a version...</option>';
        versionSelect.disabled = true;
        fetchBtn.disabled = true;
        if (helpBtn) {
          helpBtn.disabled = true;
        }
        fetchBtn.textContent = "Load Release";
        applyManifestToButton({ name: "", builds: [] });
      });
    }
  }

  // Upload logic
  const bootloaderFile = document.getElementById("bootloader-file");
  const bootloaderAddress = document.getElementById("bootloader-address");
  const partitionsFile = document.getElementById("partitions-file");
  const partitionsAddress = document.getElementById("partitions-address");
  const firmwareFile = document.getElementById("firmware-file");
  const firmwareAddress = document.getElementById("firmware-address");
  const uploadBtn = document.getElementById("upload-btn");

  if (urlParams.bootloaderAddress && bootloaderAddress) {
    bootloaderAddress.value = urlParams.bootloaderAddress;
  }
  if (urlParams.partitionsAddress && partitionsAddress) {
    partitionsAddress.value = urlParams.partitionsAddress;
  }
  if (urlParams.firmwareAddress && firmwareAddress) {
    firmwareAddress.value = urlParams.firmwareAddress;
  }

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

    const clearUploadBtn = document.getElementById("clear-upload-btn");
    if (clearUploadBtn) {
      clearUploadBtn.addEventListener("click", () => {
        if (bootloaderFile) bootloaderFile.value = "";
        if (partitionsFile) partitionsFile.value = "";
        if (firmwareFile) firmwareFile.value = "";

        checkInputs();
        uploadBtn.textContent = "Prepare Files for Flashing";
        applyManifestToButton({ name: "", builds: [] });
      });
    }
  }

  // Console logic
  initConsole();
});
