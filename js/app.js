import { fetchLatestReleaseManifest, applyManifestToButton } from './github.js';

document.addEventListener('DOMContentLoaded', () => {
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
});
