import { createManifestFromFiles } from './upload.js';

export async function runUploadTests() {
    console.log("Running Upload tests...");
    try {
        const file = new File(["dummy content"], "app.bin", { type: "application/octet-stream" });
        const manifest = await createManifestFromFiles([file]);
        
        console.assert(manifest.name === "Local Manual Upload", "Manifest name should be correct");
        console.assert(manifest.builds[0].parts.length === 1, "Should have 1 part");
        console.assert(manifest.builds[0].parts[0].offset === 65536, "Offset should be 0x10000 (65536)");
        
        console.log("✅ Upload tests passed!");
    } catch (e) {
        console.error("❌ Upload tests failed:", e);
    }
}
