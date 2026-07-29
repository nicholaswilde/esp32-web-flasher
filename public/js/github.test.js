import { fetchLatestReleaseManifest, applyManifestToButton } from "./github.js";

export async function runGitHubTests() {
  console.log("Running GitHub tests...");

  const originalFetch = window.fetch;

  window.fetch = async (url) => {
    if (url.includes("config.json")) {
      return {
        ok: true,
        json: async () => ({
          githubRepo: "test/repo",
          defaultAddresses: {
            bootloader: "0x1000",
            partitions: "0x8000",
            app: "0x10000",
          },
        }),
      };
    }
    if (url.includes("api.github.com")) {
      return {
        ok: true,
        json: async () => ({
          tag_name: "v1.0.0",
          assets: [
            {
              name: "firmware.bin",
              browser_download_url: "http://example.com/fw.bin",
            },
            {
              name: "bootloader.bin",
              browser_download_url: "http://example.com/bl.bin",
            },
          ],
        }),
      };
    }
  };

  try {
    const manifest = await fetchLatestReleaseManifest();
    console.assert(manifest.name === "repo", "Manifest name should be 'repo'");
    console.assert(
      manifest.builds[0].parts.length === 2,
      "Should have 2 parts",
    );

    const fakeButton = document.createElement("esp-web-install-button");
    document.body.appendChild(fakeButton);
    const url = applyManifestToButton(manifest);
    console.assert(
      fakeButton.getAttribute("manifest") === url,
      "Manifest URL should be set",
    );

    console.log("✅ GitHub tests passed!");
  } catch (e) {
    console.error("❌ GitHub tests failed:", e);
  } finally {
    window.fetch = originalFetch;
  }
}
