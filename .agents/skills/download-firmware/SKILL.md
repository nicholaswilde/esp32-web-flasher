---
name: download-firmware
description: Downloads and extracts firmware releases from GitHub into the local firmware/ directory.
---

# download-firmware

Use this skill when you need to download firmware releases from GitHub and extract them locally.

## Instructions
1. Run the script `scripts/download_releases.sh [repo] [limit]`.
   - `repo`: The GitHub repository (e.g., `nicholaswilde/cyd-weather-station`). Default: `nicholaswilde/cyd-weather-station`.
   - `limit`: The number of recent releases to download. Default: 5.
2. The script will use `rtk gh release download` and extract the `.zip` artifacts into `firmware/<repo>/<device>/<version>/`.
3. Verify the files are correctly extracted in the `firmware/` directory.

## Example
```bash
bash scripts/download_releases.sh nicholaswilde/cyd-weather-station 5
```
