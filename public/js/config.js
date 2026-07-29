let configCache = null;

export async function loadConfig() {
  if (configCache) return configCache;
  const response = await fetch(`./config.json?t=${Date.now()}`);
  if (!response.ok) {
    throw new Error("Failed to load configuration");
  }
  configCache = await response.json();
  return configCache;
}
