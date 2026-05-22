[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   FIX getStateKV - AGGIUNGI WINE_NEWS_KV      " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$ProjectPath = "C:\Users\timot\OneDrive\Desktop\SommelierWorld-MASTER"
Set-Location $ProjectPath

# ------------------------------------------------
Write-Host "[1] Backup worker.js..." -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
Copy-Item "worker.js" "worker.js.backup_kv_fix_$timestamp" -Force
Write-Host "OK - Backup: worker.js.backup_kv_fix_$timestamp" -ForegroundColor Green

# ------------------------------------------------
Write-Host ""
Write-Host "[2] Modifica getStateKV..." -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

$content = Get-Content "worker.js" -Raw -Encoding UTF8

# Trova la vecchia funzione getStateKV
$oldPattern = 'function getStateKV\(env\) \{[\s\S]*?return \(env && \(env\.APP_KV \|\| env\.SW_STATE_KV \|\| env\.SOMMELIER_KV \|\| env\.SOMMELIER_WORLD_STORAGE\)\) \|\| null;[\s\S]*?\}'

$newFunction = @'
function getStateKV(env) {
  return (env && (env.WINE_NEWS_KV || env.APP_KV || env.SW_STATE_KV || env.SOMMELIER_KV || env.SOMMELIER_WORLD_STORAGE)) || null;
}
'@

if ($content -match $oldPattern) {
    $content = $content -replace $oldPattern, $newFunction
    Write-Host "OK - getStateKV aggiornato (WINE_NEWS_KV aggiunto per primo)" -ForegroundColor Green
} else {
    Write-Host "ATTENZIONE - Pattern non trovato, cerco alternativa..." -ForegroundColor Yellow
    
    # Cerca una versione più semplice
    $simplePattern = 'return \(env && \(env\.APP_KV'
    if ($content -match $simplePattern) {
        $content = $content -replace 'return \(env && \(env\.APP_KV', 'return (env && (env.WINE_NEWS_KV || env.APP_KV'
        Write-Host "OK - WINE_NEWS_KV aggiunto all'inizio" -ForegroundColor Green
    } else {
        Write-Host "ERRORE - getStateKV non trovato!" -ForegroundColor Red
        Write-Host "Modifica manualmente la funzione getStateKV:" -ForegroundColor Yellow
        Write-Host "  return (env && (env.WINE_NEWS_KV || env.APP_KV || ...)) || null;" -ForegroundColor Cyan
        exit 1
    }
}

# ------------------------------------------------
Write-Host ""
Write-Host "[3] Salva worker.js..." -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

[System.IO.File]::WriteAllText((Resolve-Path "worker.js"), $content, [System.Text.Encoding]::UTF8)
Write-Host "OK - worker.js salvato" -ForegroundColor Green

# ------------------------------------------------
Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "   FIX COMPLETATO                              " -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "PROSSIMI STEP:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Deploy:" -ForegroundColor White
Write-Host "   wrangler deploy" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Test:" -ForegroundColor White
Write-Host "   curl -UseBasicParsing https://hidden-term-f2d0.timotiniurie49.workers.dev/api/daily-wine-news" -ForegroundColor Cyan
Write-Host ""

Write-Host "Script completato!" -ForegroundColor Green
