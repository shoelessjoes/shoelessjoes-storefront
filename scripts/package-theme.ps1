# scripts/package-theme.ps1
# Bundles the Shopify theme files into a clean, Shopify-valid zip.
# Forces forward-slash path separators (Shopify rejects backslash zip entries
# produced by Compress-Archive), excludes non-theme folders, and writes the
# zip with theme folders at the archive root.
#
# Usage (from repo root):   .\scripts\package-theme.ps1
# Output:                   theme-export-YYYYMMDD-HHMM.zip in the repo root

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot

# Only these top-level folders belong in a Shopify theme zip.
$themeDirs = @('assets','blocks','config','layout','locales','sections','snippets','templates')

$timestamp = Get-Date -Format 'yyyyMMdd-HHmm'
$outputZip = Join-Path $repoRoot "theme-export-$timestamp.zip"

# Stage a clean copy so dev files never leak in.
$staging = Join-Path $env:TEMP "sj-theme-stage-$(Get-Random)"
New-Item -ItemType Directory -Path $staging -Force | Out-Null

try {
    Write-Host ""
    Write-Host "Packaging theme..." -ForegroundColor Cyan
    foreach ($dir in $themeDirs) {
        $src = Join-Path $repoRoot $dir
        if (Test-Path $src) {
            Copy-Item -Recurse -Path $src -Destination (Join-Path $staging $dir)
            $n = (Get-ChildItem -Recurse -File (Join-Path $staging $dir)).Count
            Write-Host ("  + {0,-12} ({1} files)" -f $dir, $n) -ForegroundColor Gray
        } else {
            Write-Host ("  - {0,-12} (not found, skipped)" -f $dir) -ForegroundColor DarkGray
        }
    }

    # Strip stray OS/editor cruft.
    Get-ChildItem -Recurse -File $staging -Include '*.bak','*.tmp','.DS_Store','Thumbs.db' -Force `
        | Remove-Item -Force -ErrorAction SilentlyContinue

    if (Test-Path $outputZip) { Remove-Item $outputZip -Force }

    Write-Host ""
    Write-Host "Compressing (forward-slash entries)..." -ForegroundColor Cyan

    # Build the zip manually so every entry name uses '/' — Shopify requires this.
    Add-Type -AssemblyName System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem

    $zip = [System.IO.Compression.ZipFile]::Open($outputZip, [System.IO.Compression.ZipArchiveMode]::Create)
    try {
        $base = (Resolve-Path $staging).Path.TrimEnd('\') + '\'
        Get-ChildItem -Recurse -File $staging | ForEach-Object {
            $entry = $_.FullName.Substring($base.Length).Replace('\','/')
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
                $zip, $_.FullName, $entry,
                [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
        }
    } finally {
        $zip.Dispose()
    }

    $sizeMB = [math]::Round((Get-Item $outputZip).Length / 1MB, 2)
    Write-Host ""
    Write-Host ("[OK] theme-export-$timestamp.zip ({0} MB)" -f $sizeMB) -ForegroundColor Green
    Write-Host ""
    Write-Host "Upload: Shopify Admin -> Online Store -> Themes -> Add theme -> Upload zip file" -ForegroundColor Yellow
    Write-Host "File:   $outputZip"
    Write-Host ""
}
finally {
    if (Test-Path $staging) { Remove-Item -Recurse -Force $staging -ErrorAction SilentlyContinue }
}
