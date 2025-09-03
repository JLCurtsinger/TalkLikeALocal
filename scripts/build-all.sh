#!/usr/bin/env bash
set -euo pipefail

# 1) Build Vite app
npm run build

# 2) Build Astro blog
npm --prefix ./blog run build

# 3) Merge /blog into /dist
mkdir -p dist/blog
cp -R blog/dist/* dist/blog
