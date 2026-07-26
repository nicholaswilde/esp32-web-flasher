import { loadConfig } from './config.js';

export async function createManifestFromFiles(files) {
    const config = await loadConfig();
    let parts = [];
    
    for (const file of files) {
        let offset = config.defaultAddresses.app;
        if (file.name.toLowerCase().includes('bootloader')) {
            offset = config.defaultAddresses.bootloader;
        } else if (file.name.toLowerCase().includes('partition')) {
            offset = config.defaultAddresses.partitions;
        }
        
        const fileUrl = URL.createObjectURL(file);
        parts.push({
            path: fileUrl,
            offset: parseInt(offset, 16)
        });
    }

    return {
        name: "Local Manual Upload",
        version: "custom",
        builds: [
            {
                chipFamily: "ESP32",
                parts: parts
            }
        ]
    };
}
