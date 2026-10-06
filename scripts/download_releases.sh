#!/bin/bash
# Usage: ./scripts/download_releases.sh [repo] [limit] OR ./scripts/download_releases.sh [limit]

if ! command -v jq &> /dev/null; then
    echo "jq is required but not installed."
    exit 1
fi

if [[ -n "$1" && "$1" =~ ^[0-9]+$ ]]; then
  LIMIT=$1
  REPOS=$(jq -r '.githubRepos | keys[]' public/config.json)
elif [[ -n "$1" ]]; then
  REPOS="$1"
  LIMIT=${2:-5}
else
  LIMIT=5
  REPOS=$(jq -r '.githubRepos | keys[]' public/config.json)
fi

for REPO in $REPOS; do
  BASE_DIR="public/firmware/$REPO"
  PROJECT_NAME=$(echo "$REPO" | cut -d'/' -f2)
  VERSIONS=$(gh release list --repo "$REPO" -L "$LIMIT" --json tagName --jq '.[].tagName' | cat)

  for VERSION in $VERSIONS; do
    ASSETS=$(gh release view "$VERSION" --repo "$REPO" --json assets --jq '.assets[].name' | cat)
    for ASSET in $ASSETS; do
      if [[ $ASSET == *.zip && $ASSET != *host* ]]; then
        CLEAN_VERSION="${VERSION#v}"
        if [[ $ASSET =~ .*-($VERSION|$CLEAN_VERSION)-(.*)\.zip ]]; then
          DEVICE="${BASH_REMATCH[2]}"
        else
          DEVICE="${ASSET%.zip}"
        fi
        
        # Override device name for side-eye
        if [[ $PROJECT_NAME == "side-eye" && $DEVICE == "firmware" ]]; then
          DEVICE="ESP32-C6"
        fi
        
        TARGET_DIR="$BASE_DIR/$DEVICE/$VERSION"
        mkdir -p "$TARGET_DIR"
        
        if [ ! -f "$TARGET_DIR/$ASSET" ]; then
          echo "Downloading $ASSET..."
          gh release download "$VERSION" --repo "$REPO" --pattern "$ASSET" --dir "$TARGET_DIR" || echo "Failed to download $ASSET"
        else
          echo "Using cached $ASSET"
        fi
        
        if [ -f "$TARGET_DIR/$ASSET" ]; then
          unzip -q -o "$TARGET_DIR/$ASSET" -d "$TARGET_DIR/"
        fi
      fi
    done
  done
done

echo "Generating firmware index..."
uv run python scripts/generate_firmware_index.py
echo "Done!"
