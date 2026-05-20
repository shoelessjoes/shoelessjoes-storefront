# scripts/package-theme.ps1
# Bundles the Shopify theme files into a clean zip for upload via Shopify Admin.
# Excludes non-theme folders (apps-script/, docs/, scripts/) and dev files (.env, .gitignore, etc.)
#
# Usage (from repo root):
#   .\scripts\package-theme.ps1
#
# Output:
#   theme-export-YYYYMMDD-HHMM.zip in the repo root
#
# Then upload via:
#   Shopify Admin → Online Store → Themes → Add theme → Upload zip

$ErrorActionPreference = "Stop"

# Resolve repo root (parent of /scripts)
$repoRoot = Split-Path -Parent $PSScriptRoot

# These are the only top-level folders that belong in a Shopify theme zip
$themeDirs = @(
    'assets',
    'blocks',
    'config',
    'layout',
    'locales',
    'sections',
    'snippets',
    'templates'
)

# Timestamped output zip
$timestamp = Get-Date -Format 'yyyyMMdd-HHmm'
$outputZip = Join-Path $repoRoot "theme-export-$timestamp.zip"

# Stage in a temp folder so we get a clean zip without our dev files
$staging = Join-Path $env:TEMP "sj-theme-stage-$(Get-Random)"
New-Item -ItemType Directory -Path $staging -Force | Out-Null

try {
    Write-Host ""
    Write-Host "Packaging theme..." -ForegroundColor Cyan

    foreach ($dir in $themeDirs) {
        $src = Join-Path $repoRoot $dir
        if (Test-Path $src) {
            $dest = Join-Path $staging $dir
            Copy-Item -Recurse -Path $src -Destination $dest
            $fileCount = (Get-ChildItem -Recurse -File $dest).Count
            Write-Host ("  + {0,-12} ({1} files)" -f $dir, $fileCount) -ForegroundColor Gray
        } else {
            Write-Host ("  - {0,-12} (skipped: not found)" -f $dir) -ForegroundColor DarkGray
        }
    }

    # Remove any stray dev artifacts that may have slipped in
    Get-ChildItem -Recurse -File $staging -Include '*.bak','*.tmp','.DS_Store','Thumbs.db' -Force |
        Remove-Item -Force -ErrorAction SilentlyContinue

    Write-Host ""
    Write-Host "Compressing..." -ForegroundColor Cyan
    Compress-Archive -Path (Join-Path $staging '*') -DestinationPath $outputZip -Force

    $sizeMB = [math]::Round((Get-Item $outputZip).Length / 1MB, 2)

    Write-Host ""
    Write-Host ("[OK] Theme packaged: theme-export-$timestamp.zip ({0} MB)" -f $sizeMB) -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Open Shopify Admin -> Online Store -> Themes"
    Write-Host "  2. Click 'Add theme' -> 'Upload zip file'"
    Write-Host "  3. Select: $outputZip"
    Write-Host "  4. Preview before publishing"
    Write-Host ""
}
finally {
    # Clean up staging folder
    if (Test-Path $staging) {
        Remove-Item -Recurse -Force $staging -ErrorAction SilentlyContinue
    }
}
