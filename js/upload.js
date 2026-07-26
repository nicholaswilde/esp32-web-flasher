export async function createManifestFromFiles(partsData) {
  let parts = [];

  for (const part of partsData) {
    const fileUrl = URL.createObjectURL(part.file);
    parts.push({
      path: fileUrl,
      offset: parseInt(part.address, 16),
    });
  }

  return {
    name: "Local Manual Upload",
    version: "custom",
    builds: [
      {
        chipFamily: "ESP32",
        parts: parts,
      },
    ],
  };
}
