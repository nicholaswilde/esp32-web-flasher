#!/bin/bash
# Usage: ./scripts/download_releases.sh [limit]
LIMIT=${1:-5}

if ! command -v jq &> /dev/null; then
    echo "jq is required but not installed."
    exit 1
fi

REPOS=$(jq -r '.githubRepos | keys[]' public/config.json)

for REPO in $REPOS; do
  BASE_DIR="public/firmware/$REPO"
  PROJECT_NAME=$(echo "$REPO" | cut -d'/' -f2)
  VERSIONS=$(rtk gh release list --repo "$REPO" -L "$LIMIT" | awk '{print $1}')

  for VERSION in $VERSIONS; do
    ASSETS=$(rtk gh release view "$VERSION" --repo "$REPO" --json assets --jq '.assets[].name')
    for ASSET in $ASSETS; do
      if [[ $ASSET == *.zip ]]; then
        PREFIX="$PROJECT_NAME-$VERSION-"
        DEVICE=${ASSET#$PREFIX}
        DEVICE=${DEVICE%.zip}
        
        TARGET_DIR="$BASE_DIR/$DEVICE/$VERSION"
        mkdir -p "$TARGET_DIR"
        echo "Downloading $ASSET..."
        rtk gh release download "$VERSION" --repo "$REPO" --pattern "$ASSET" --dir "$TARGET_DIR" || echo "Failed to download $ASSET"
        
        if [ -f "$TARGET_DIR/$ASSET" ]; then
          unzip -q -o "$TARGET_DIR/$ASSET" -d "$TARGET_DIR/"
          rm "$TARGET_DIR/$ASSET"
        fi
      fi
    done
  done
done

echo "Generating firmware index..."
uv run python scripts/generate_firmware_index.py
echo "Done!"
