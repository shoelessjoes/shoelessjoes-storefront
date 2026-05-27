#!/bin/bash
# scripts/package-theme.sh
# Bundles the Shopify theme files into a clean, Shopify-valid zip.
# Uses forward-slash path separators (Shopify requirement).
#
# Usage (from repo root):   bash scripts/package-theme.sh
# Output:                   theme-export-YYYYMMDD-HHMM.zip in the repo root

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
THEME_DIRS=('assets' 'blocks' 'config' 'layout' 'locales' 'sections' 'snippets' 'templates')

TIMESTAMP=$(date +%Y%m%d-%H%M)
OUTPUT_ZIP="$REPO_ROOT/theme-export-$TIMESTAMP.zip"

# Create temporary staging directory
STAGING=$(mktemp -d)
trap "rm -rf $STAGING" EXIT

echo ""
echo "Packaging theme..."

for dir in "${THEME_DIRS[@]}"; do
    SRC="$REPO_ROOT/$dir"
    if [ -d "$SRC" ]; then
        cp -r "$SRC" "$STAGING/$dir"
        COUNT=$(find "$STAGING/$dir" -type f | wc -l)
        printf "  + %-12s (%d files)\n" "$dir" "$COUNT"
    else
        printf "  - %-12s (not found, skipped)\n" "$dir"
    fi
done

# Remove stray OS/editor files
find "$STAGING" \( -name '*.bak' -o -name '*.tmp' -o -name '.DS_Store' -o -name 'Thumbs.db' \) -delete

echo ""
echo "Compressing (forward-slash entries)..."

# Create zip with forward slashes
cd "$STAGING"
zip -r -q "$OUTPUT_ZIP" . || true
cd - > /dev/null

SIZE=$(du -h "$OUTPUT_ZIP" | cut -f1)

echo ""
echo "[OK] theme-export-$TIMESTAMP.zip ($SIZE)"
echo ""
echo "Upload: Shopify Admin -> Online Store -> Themes -> Add theme -> Upload zip file"
echo "File:   $OUTPUT_ZIP"
echo ""
