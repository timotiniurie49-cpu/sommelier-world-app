[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "   DEPLOY PATCH v24.1: Daily News Frontend (FIX API URL)      " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$MasterPath = "C:\Users\timot\OneDrive\Desktop\SommelierWorld-MASTER"
Set-Location $MasterPath

# ------------------------------------------------
Write-Host "[1] Verifica file patch..." -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

if (-not (Test-Path "patch-v24-daily-news-frontend.js")) {
    Write-Host "ERRORE: patch-v24-daily-news-frontend.js non trovato!" -ForegroundColor Red
    Write-Host "Scaricalo prima dalla conversazione!" -ForegroundColor Yellow
    exit 1
}

$patchSize = (Get-Item "patch-v24-daily-news-frontend.js").Length
Write-Host "OK - Patch trovato ($patchSize bytes)" -ForegroundColor Green

# ------------------------------------------------
Write-Host ""
Write-Host "[2] Backup index.html..." -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
Copy-Item "index.html" "index.html.backup_v24_$timestamp" -Force
Write-Host "OK - Backup: index.html.backup_v24_$timestamp" -ForegroundColor Green

# ------------------------------------------------
Write-Host ""
Write-Host "[3] Leggi index.html..." -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

$html = Get-Content "index.html" -Raw -Encoding UTF8
Write-Host "OK - File letto ($($html.Length) caratteri)" -ForegroundColor Green

# ------------------------------------------------
Write-Host ""
Write-Host "[4] Verifica patch gia presente..." -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

if ($html -match "PATCH v24") {
    Write-Host "ATTENZIONE: Patch v24 gia presente!" -ForegroundColor Yellow
    $response = Read-Host "Vuoi ri-deployare con v24.1 (FIX API)? (s/n)"
    if ($response -ne 's') {
        Write-Host "Deploy annullato." -ForegroundColor Yellow
        exit 0
    }
    
    # Rimuovi vecchio patch
    $html = $html -replace '(?s)<script[^>]*>.*?PATCH v24.*?</script>', ''
    Write-Host "OK - Vecchio patch rimosso" -ForegroundColor Green
}

# ------------------------------------------------
Write-Host ""
Write-Host "[5] Aggiungi patch v24..." -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

$patchContent = Get-Content "patch-v24-daily-news-frontend.js" -Raw -Encoding UTF8

$patchScript = "`n<!-- PATCH v24.1: Daily News Frontend + Admin Panel (FIX API URL) -->`n<script>`n$patchContent`n</script>`n</body>"

$html = $html -replace '</body>', $patchScript

Write-Host "OK - Patch v24 aggiunto" -ForegroundColor Green

# ------------------------------------------------
Write-Host ""
Write-Host "[6] Salva index.html..." -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

[System.IO.File]::WriteAllText((Resolve-Path "index.html"), $html, [System.Text.Encoding]::UTF8)
Write-Host "OK - index.html salvato ($($html.Length) caratteri)" -ForegroundColor Green

# ------------------------------------------------
Write-Host ""
Write-Host "[7] Commit e push a GitHub..." -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

git add index.html
git commit -m "Deploy patch v24.1: Daily News Frontend - FIX API URL to worker"

Write-Host "Pushing to GitHub..." -ForegroundColor Gray
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "OK - Push completato!" -ForegroundColor Green
} else {
    Write-Host "ATTENZIONE: Push fallito (verifica credenziali)" -ForegroundColor Yellow
}

# ------------------------------------------------
Write-Host ""
Write-Host "================================================================" -ForegroundColor Green
Write-Host "   DEPLOY COMPLETATO - PATCH v24.1                             " -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "FIX APPLICATO:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  - API URL aggiornato a worker diretto" -ForegroundColor White
Write-Host "  - Risolto errore 404 su /api/daily-wine-news" -ForegroundColor White
Write-Host "  - Notizia quotidiana ora carica correttamente" -ForegroundColor White
Write-Host ""
Write-Host "NOVITA PATCH v24.1:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  - Notizia quotidiana da Worker API" -ForegroundColor White
Write-Host "  - Sostituisce card ALTO in 'Il Sapere del Vino'" -ForegroundColor White
Write-Host "  - Traduzioni: ITA/ENG/FRA/RUS complete" -ForegroundColor White
Write-Host "  - Admin panel per gestire notizie/articoli/lezioni" -ForegroundColor White
Write-Host "  - Override manuale notizie AI" -ForegroundColor White
Write-Host ""
Write-Host "ACCESSO ADMIN PANEL:" -ForegroundColor Yellow
Write-Host "  https://sommelierworld.vin/?admin=1" -ForegroundColor Cyan
Write-Host ""
Write-Host "ATTENDI 30-60 SECONDI PER GITHUB PAGES..." -ForegroundColor Yellow
Write-Host ""
Write-Host "POI TESTA:" -ForegroundColor Yellow
Write-Host "  1. Apri: https://sommelierworld.vin" -ForegroundColor Cyan
Write-Host "  2. Vai a 'Il Sapere del Vino'" -ForegroundColor Cyan
Write-Host "  3. Verifica notizia quotidiana" -ForegroundColor Cyan
Write-Host "  4. Prova admin: https://sommelierworld.vin/?admin=1" -ForegroundColor Cyan
Write-Host ""
Write-Host "SE NON VEDI CAMBIAMENTI:" -ForegroundColor Yellow
Write-Host "  - Hard refresh: Ctrl+Shift+R" -ForegroundColor Cyan
Write-Host "  - Oppure: DevTools > Application > Clear storage" -ForegroundColor Cyan
Write-Host ""

Write-Host "Script completato!" -ForegroundColor Green
