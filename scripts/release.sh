#!/usr/bin/env bash
set -e

# Pull latest changes and tags
echo "Fetching latest tags and commits from origin..."
git fetch --tags origin
git pull --rebase origin main

# Extract and calculate next version
LATEST_TAG=$(git tag --sort=-v:refname | head -n 1)
CURRENT_VER=${LATEST_TAG#v}

IFS='.' read -ra VER_PARTS <<< "$CURRENT_VER"
PATCH=${VER_PARTS[2]}
NEW_PATCH=$((PATCH + 1))
NEW_VER="${VER_PARTS[0]}.${VER_PARTS[1]}.$NEW_PATCH"
NEW_TAG="v$NEW_VER"

echo "Current version: $LATEST_TAG"
echo "Target version: $NEW_TAG"

echo "Running pre-release validation (test)..."
task test

echo "Validation passed. Bumping versions in config.json, pyproject.toml, and uv.lock..."
# Update public/config.json
sed -i -E "s/\"version\": \"v[0-9]+\.[0-9]+\.[0-9]+\"/\"version\": \"$NEW_TAG\"/" public/config.json

# Update pyproject.toml
sed -i -E "s/^version = \"[0-9]+\.[0-9]+\.[0-9]+\"/version = \"$NEW_VER\"/" pyproject.toml

# Update uv.lock if uv is available
if command -v uv &> /dev/null; then
    uv lock
fi

git add public/config.json pyproject.toml
if [ -f uv.lock ]; then
    git add uv.lock
fi

git commit -m "chore(release): bump version to $NEW_TAG"

echo "Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    echo "Error: Working directory not clean after bumping version."
    exit 1
fi

echo "Tagging release..."
git tag -a "$NEW_TAG" -m "Release $NEW_TAG"

echo "Pushing atomically..."
git push --atomic origin main "$NEW_TAG"

echo "Release $NEW_TAG published successfully!"
