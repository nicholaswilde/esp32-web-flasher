---
name: add-repo
description: Adds a new GitHub repository to the project and downloads its firmware releases.
---

# add-repo

Use this skill when you need to add a new GitHub repository to the ESP32 Web Flasher project.

## Instructions
1. Run the script `scripts/add_repo.sh <org/repo>`.
   - `<org/repo>`: The GitHub repository to add (e.g., `nicholaswilde/cyd-media-player`).
2. The script will automatically update `config.json` and trigger a download of the latest firmware releases for the new repository.
3. It will also regenerate the `firmware/index.json` to make the new repository visible in the web app dropdowns.

## Example
```bash
bash scripts/add_repo.sh nicholaswilde/cyd-media-player
```
