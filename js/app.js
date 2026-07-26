import { fetchLatestReleaseManifest, applyManifestToButton } from './github.js';
import { createManifestFromFiles } from './upload.js';

document.addEventListener('DOMContentLoaded', () => {
    // GitHub logic
    const fetchBtn = document.getElementById('fetch-github-btn');
    if (fetchBtn) {
        fetchBtn.disabled = false;
        fetchBtn.addEventListener('click', async () => {
            try {
                fetchBtn.textContent = 'Fetching...';
                const manifest = await fetchLatestReleaseManifest();
                applyManifestToButton(manifest);
                fetchBtn.textContent = 'Loaded: ' + manifest.version;
            } catch (e) {
                console.error(e);
                fetchBtn.textContent = 'Error fetching release';
            }
        });
    }

    // Upload logic
    const fileInput = document.getElementById('manual-upload');
    const uploadBtn = document.getElementById('upload-btn');
    
    if (fileInput && uploadBtn) {
        // We use 'multiple' to allow uploading app, bootloader, and partition bins together
        fileInput.setAttribute('multiple', 'multiple');
        fileInput.disabled = false;
        
        fileInput.addEventListener('change', () => {
            uploadBtn.disabled = fileInput.files.length === 0;
            uploadBtn.textContent = 'Upload & Flash';
        });
        
        uploadBtn.addEventListener('click', async () => {
            try {
                const manifest = await createManifestFromFiles(fileInput.files);
                applyManifestToButton(manifest);
                uploadBtn.textContent = 'Ready to Flash';
            } catch (e) {
                console.error(e);
                uploadBtn.textContent = 'Error preparing files';
            }
        });
    }
});
