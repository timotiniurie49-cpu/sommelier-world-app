Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   SOMMELIER WORLD - ROLLBACK COMPLETO         " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$ProjectPath = "C:\Users\timot\OneDrive\Desktop\SommelierWorld-MASTER"
Set-Location $ProjectPath

# ------------------------------------------------
Write-Host "[1] Ripristino index.html funzionante..." -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

# Trova il backup più vecchio (quello funzionante)
$backups = Get-ChildItem "index.html.backup_*" | Sort-Object Name
if ($backups.Count -gt 0) {
    $oldestBackup = $backups[0].Name
    Write-Host "Ripristino da: $oldestBackup" -ForegroundColor Yellow
    Copy-Item $oldestBackup "index.html" -Force
    Write-Host "OK - index.html ripristinato" -ForegroundColor Green
} else {
    Write-Host "ERRORE - Nessun backup trovato" -ForegroundColor Red
    exit 1
}

# ------------------------------------------------
Write-Host ""
Write-Host "[2] Rimuovi file temporanei..." -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

$filesToDelete = @(
    "styles-elegant.css",
    "sommelier-section-clean.html",
    "home-section-new.html",
    "home-elegant.html",
    "home-content-loader.js",
    "home-loader-elegant.js",
    "styles-home-v2.css",
    "styles-elegant-bordeaux.css"
)

$deleted = 0
foreach ($file in $filesToDelete) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "Rimosso: $file" -ForegroundColor Gray
        $deleted++
    }
}

Write-Host "OK - $deleted file temporanei rimossi" -ForegroundColor Green

# ------------------------------------------------
Write-Host ""
Write-Host "[3] Git commit e push..." -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

git add -A
git commit -m "Rollback to stable version - remove broken files"

Write-Host ""
$push = Read-Host "Pushare su GitHub? (y/n)"
if ($push -eq "y") {
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK - Push completato" -ForegroundColor Green
        Write-Host ""
        Write-Host "Attendi 30 secondi per propagazione GitHub Pages..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    }
}

# ------------------------------------------------
Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "   ROLLBACK COMPLETATO                         " -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Il sito e tornato alla versione stabile." -ForegroundColor White
Write-Host ""
Write-Host "Per vedere il sito aggiornato:" -ForegroundColor Yellow
Write-Host "  1. Vai su https://sommelierworld.vin" -ForegroundColor White
Write-Host "  2. Premi CTRL+SHIFT+R (hard refresh)" -ForegroundColor White
Write-Host "  3. Pulisci cache (F12 > Console):" -ForegroundColor White
Write-Host ""
Write-Host "     navigator.serviceWorker.getRegistrations().then(r => r.forEach(x => x.unregister()));" -ForegroundColor Cyan
Write-Host "     caches.keys().then(k => k.forEach(x => caches.delete(x)));" -ForegroundColor Cyan
Write-Host "     localStorage.clear(); location.reload(true);" -ForegroundColor Cyan
Write-Host ""

$open = Read-Host "Aprire il sito nel browser? (y/n)"
if ($open -eq "y") {
    Start-Process "https://sommelierworld.vin"
}

Write-Host ""
Write-Host "Script completato!" -ForegroundColor Green
Write-Host ""
Write-Host "Questo script si auto-elimina tra 3 secondi..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
Remove-Item $PSCommandPath -Force -ErrorAction SilentlyContinue
