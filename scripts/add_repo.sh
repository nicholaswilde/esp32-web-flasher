#!/bin/bash
# Usage: ./scripts/add_repo.sh <repo>
REPO=$1

if [ -z "$REPO" ]; then
  echo "Usage: $0 <org/repo>"
  exit 1
fi

if ! command -v jq &> /dev/null; then
    echo "jq is required but not installed."
    exit 1
fi

# Add repo to config.json if not already there
jq --arg repo "$REPO" '.githubRepos |= (if has($repo) then . else . + { ($repo): { "addresses": .defaultAddresses } } end)' public/config.json > public/config.tmp.json && mv public/config.tmp.json public/config.json

echo "Added $REPO to config.json"
echo "Running download to fetch releases..."
bash scripts/download_releases.sh
