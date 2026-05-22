Write-Host "SOMMELIER WORLD - FIX ENCODING" -ForegroundColor Cyan
Write-Host "Ripristino versione pulita senza emoji..." -ForegroundColor Yellow
Write-Host ""

$ProjectPath = "C:\Users\timot\OneDrive\Desktop\SommelierWorld-MASTER"
Set-Location $ProjectPath

# Cerca ultimo backup
$backups = Get-ChildItem "index.html.backup_*" | Sort-Object Name -Descending
if ($backups.Count -gt 0) {
    $lastBackup = $backups[0].Name
    Write-Host "Ripristino da: $lastBackup" -ForegroundColor Green
    Copy-Item $lastBackup "index.html" -Force
    Write-Host "OK - index.html ripristinato" -ForegroundColor Green
} else {
    Write-Host "ERRORE - Nessun backup trovato!" -ForegroundColor Red
    exit 1
}

# Rimuovi CSS rotto
if (Test-Path "styles-elegant.css") {
    Remove-Item "styles-elegant.css" -Force
    Write-Host "OK - CSS rotto rimosso" -ForegroundColor Green
}

Write-Host ""
Write-Host "RIPRISTINO COMPLETATO" -ForegroundColor Green
Write-Host ""
Write-Host "Il sito e tornato alla versione precedente." -ForegroundColor White
Write-Host "Aspetta che preparo una versione SENZA EMOJI..." -ForegroundColor Yellow
Write-Host ""

$open = Read-Host "Aprire index.html nel browser per verificare? (y/n)"
if ($open -eq "y") { Start-Process "index.html" }

Write-Host ""
Write-Host "Script completato!" -ForegroundColor Green
