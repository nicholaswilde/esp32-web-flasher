import { loadConfig } from "./config.js";

export async function runConfigTests() {
  console.log("Running config tests...");
  const originalFetch = window.fetch;

  // Mock fetch for testing
  window.fetch = async () => ({
    ok: true,
    json: async () => ({
      githubRepo: "test/repo",
      defaultAddresses: {
        bootloader: "0x1000",
        partitions: "0x8000",
        app: "0x10000",
      },
    }),
  });

  try {
    const config = await loadConfig();
    console.assert(
      config.githubRepo === "test/repo",
      "Config should load mock githubRepo",
    );
    console.log("✅ Config tests passed!");
  } catch (e) {
    console.error("❌ Config tests failed:", e);
  } finally {
    window.fetch = originalFetch;
  }
}
