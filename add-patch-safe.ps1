[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "   AGGIUNGI PATCH NOTIZIE - METODO SICURO                      " -ForegroundColor Cyan
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

Write-Host "OK - Patch trovato" -ForegroundColor Green

# ------------------------------------------------
Write-Host ""
Write-Host "[2] Backup index.html..." -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
Copy-Item "index.html" "index.html.backup_safe_$timestamp" -Force
Write-Host "OK - Backup: index.html.backup_safe_$timestamp" -ForegroundColor Green

# ------------------------------------------------
Write-Host ""
Write-Host "[3] Leggi index.html..." -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

$html = Get-Content "index.html" -Raw -Encoding UTF8
$originalLength = $html.Length
Write-Host "OK - File letto ($originalLength caratteri)" -ForegroundColor Green

# ------------------------------------------------
Write-Host ""
Write-Host "[4] Verifica patch non gia presente..." -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

if ($html.Contains("PATCH v24")) {
    Write-Host "ATTENZIONE: Patch v24 gia presente!" -ForegroundColor Yellow
    Write-Host "Il sito funziona gia. Non serve ri-deployare." -ForegroundColor Yellow
    exit 0
}

Write-Host "OK - Nessun patch v24 presente" -ForegroundColor Green

# ------------------------------------------------
Write-Host ""
Write-Host "[5] Carica patch..." -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

$patchContent = Get-Content "patch-v24-daily-news-frontend.js" -Raw -Encoding UTF8
Write-Host "OK - Patch caricato ($($patchContent.Length) caratteri)" -ForegroundColor Green

# ------------------------------------------------
Write-Host ""
Write-Host "[6] Inserisci patch PRIMA di </body>..." -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

# METODO SICURO: Split su </body>, inserisci patch, ricombina
$parts = $html -split '</body>', 2

if ($parts.Count -ne 2) {
    Write-Host "ERRORE: </body> non trovato nel file!" -ForegroundColor Red
    exit 1
}

$beforeBody = $parts[0]
$afterBody = $parts[1]

$patchBlock = "`n<!-- PATCH v24.1: Daily News Frontend + Admin Panel -->`n<script>`n$patchContent`n</script>`n"

$newHtml = $beforeBody + $patchBlock + "</body>" + $afterBody

Write-Host "OK - Patch inserito prima di </body>" -ForegroundColor Green

# ------------------------------------------------
Write-Host ""
Write-Host "[7] Verifica dimensione risultato..." -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

$newLength = $newHtml.Length
$difference = $newLength - $originalLength

Write-Host "Originale: $originalLength caratteri" -ForegroundColor Gray
Write-Host "Nuovo:     $newLength caratteri" -ForegroundColor Gray
Write-Host "Differenza: +$difference caratteri" -ForegroundColor Gray

if ($newLength -lt $originalLength) {
    Write-Host "ERRORE: File risultante piu piccolo! Operazione annullata!" -ForegroundColor Red
    exit 1
}

if ($difference -lt 10000) {
    Write-Host "ATTENZIONE: Differenza troppo piccola! Verifica patch." -ForegroundColor Yellow
    $response = Read-Host "Continuare comunque? (s/n)"
    if ($response -ne 's') {
        Write-Host "Operazione annullata." -ForegroundColor Yellow
        exit 0
    }
}

Write-Host "OK - Dimensione verificata" -ForegroundColor Green

# ------------------------------------------------
Write-Host ""
Write-Host "[8] Salva nuovo index.html..." -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

[System.IO.File]::WriteAllText((Resolve-Path "index.html"), $newHtml, [System.Text.Encoding]::UTF8)
Write-Host "OK - File salvato ($newLength caratteri)" -ForegroundColor Green

# ------------------------------------------------
Write-Host ""
Write-Host "[9] Commit e push..." -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

git add index.html
git commit -m "Add patch v24.1: Daily News Frontend (safe method)"

Write-Host "Pushing to GitHub..." -ForegroundColor Gray
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "OK - Push completato!" -ForegroundColor Green
} else {
    Write-Host "ATTENZIONE: Push fallito" -ForegroundColor Yellow
}

# ------------------------------------------------
Write-Host ""
Write-Host "================================================================" -ForegroundColor Green
Write-Host "   PATCH AGGIUNTO CON SUCCESSO                                 " -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "STATISTICHE:" -ForegroundColor Yellow
Write-Host "  File originale: $originalLength caratteri" -ForegroundColor White
Write-Host "  File finale:    $newLength caratteri" -ForegroundColor White
Write-Host "  Patch aggiunto: +$difference caratteri" -ForegroundColor White
Write-Host ""
Write-Host "FUNZIONALITA AGGIUNTE:" -ForegroundColor Yellow
Write-Host "  - Notizia quotidiana da Worker API" -ForegroundColor White
Write-Host "  - Sostituisce card ALTO in 'Il Sapere del Vino'" -ForegroundColor White
Write-Host "  - Traduzioni: ITA/ENG/FRA/RUS" -ForegroundColor White
Write-Host "  - Admin panel: https://sommelierworld.vin/?admin=1" -ForegroundColor White
Write-Host ""
Write-Host "ATTENDI 30-60 SECONDI PER GITHUB PAGES..." -ForegroundColor Yellow
Write-Host ""
Write-Host "POI TESTA:" -ForegroundColor Yellow
Write-Host "  1. https://sommelierworld.vin" -ForegroundColor Cyan
Write-Host "  2. Hard refresh: Ctrl+Shift+R" -ForegroundColor Cyan
Write-Host "  3. Vai a 'Il Sapere del Vino'" -ForegroundColor Cyan
Write-Host "  4. Verifica notizia 'Vini di Tenerife'" -ForegroundColor Cyan
Write-Host ""

Write-Host "Script completato!" -ForegroundColor Green
