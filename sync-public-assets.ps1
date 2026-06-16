$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$publicDir = Join-Path $projectRoot "public-assets"

$files = @(
  "index.html",
  "reset.html",
  "manifest.json",
  "icon-192.png",
  "icon-512.png",
  "sw.js",
  "home-v2.js",
  "sommelier_tips.js",
  "navigation.js",
  "news.js",
  "sommelier.js",
  "sw-patch-v6.js",
  "app-finale-v1.js"
)

if (Test-Path $publicDir) {
  Remove-Item $publicDir -Recurse -Force
}

New-Item -ItemType Directory -Path $publicDir | Out-Null

foreach ($file in $files) {
  $source = Join-Path $projectRoot $file
  if (-not (Test-Path $source)) {
    throw "Missing required public file: $file"
  }
  Copy-Item $source -Destination (Join-Path $publicDir $file) -Force
}

Write-Host "Synced public assets to $publicDir"
