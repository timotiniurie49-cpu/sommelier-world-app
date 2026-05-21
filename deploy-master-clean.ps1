param(
    [switch]$SkipFrontend,
    [switch]$SkipWorker,
    [switch]$TestOnly
)

Write-Host "" 
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   SOMMELIER WORLD - DEPLOY MASTER             " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$ProjectPath = "C:\Users\timot\OneDrive\Desktop\SommelierWorld-MASTER"

if (-not (Test-Path $ProjectPath)) {
    Write-Host "ERRORE: Directory non trovata: $ProjectPath" -ForegroundColor Red
    exit 1
}

Set-Location $ProjectPath
Write-Host "OK - Directory: $ProjectPath" -ForegroundColor Green

# ------------------------------------------------
Write-Host ""
Write-Host "[1] Controlli iniziali..." -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "ERRORE: Git non trovato" -ForegroundColor Red
    exit 1
}
Write-Host "OK - Git trovato" -ForegroundColor Green

$wranglerOk = $true
if (-not (Get-Command wrangler -ErrorAction SilentlyContinue)) {
    Write-Host "ATTENZIONE: Wrangler non trovato - Worker skippato" -ForegroundColor Yellow
    $wranglerOk = $false
    $SkipWorker = $true
} else {
    Write-Host "OK - Wrangler trovato" -ForegroundColor Green
}

foreach ($f in @("index.html","worker.js","navigation.js")) {
    if (-not (Test-Path $f)) {
        Write-Host "ERRORE: File mancante: $f" -ForegroundColor Red
        exit 1
    }
}
Write-Host "OK - File chiave presenti" -ForegroundColor Green

# ------------------------------------------------
Write-Host ""
Write-Host "[2] Git Status..." -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

Write-Host "Branch corrente: $(git branch --show-current)" -ForegroundColor White
git status --short

$gs = git status --porcelain
if ($gs) {
    Write-Host ""
    $r = Read-Host "Ci sono modifiche. Committare ora? (y/n)"
    if ($r -eq "y") {
        git add -A
        $msg = Read-Host "Messaggio commit (invio = 'Deploy update')"
        if ([string]::IsNullOrWhiteSpace($msg)) {
            $msg = "Deploy update $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
        }
        git commit -m $msg
        Write-Host "OK - Commit eseguito" -ForegroundColor Green
    }
} else {
    Write-Host "OK - Working tree pulito" -ForegroundColor Green
}

# ------------------------------------------------
if (-not $SkipFrontend) {
    Write-Host ""
    Write-Host "[3] Incrementa versione Service Worker..." -ForegroundColor Cyan
    Write-Host "------------------------------------------------" -ForegroundColor Cyan

    $indexPath = "index.html"
    $content = Get-Content $indexPath -Raw
    if ($content -match 'data-sw-version="(\d+)"') {
        $currentV = [int]$matches[1]
        $newV = $currentV + 1
        $content = $content -replace 'data-sw-version="\d+"', "data-sw-version=`"$newV`""
        [System.IO.File]::WriteAllText((Resolve-Path $indexPath), $content)
        Write-Host "OK - Service Worker version: $currentV -> $newV" -ForegroundColor Green
    } else {
        Write-Host "ATTENZIONE: versione SW non trovata in index.html" -ForegroundColor Yellow
    }
}

# ------------------------------------------------
if (-not $SkipFrontend -and -not $TestOnly) {
    Write-Host ""
    Write-Host "[4] Deploy Frontend (GitHub Pages)..." -ForegroundColor Cyan
    Write-Host "------------------------------------------------" -ForegroundColor Cyan

    git add -A
    git commit -m "Home v2 deploy $(Get-Date -Format 'yyyy-MM-dd HH:mm')" 2>$null
    git push origin main

    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK - Frontend deployed" -ForegroundColor Green
        Write-Host "    URL: https://sommelierworld.vin" -ForegroundColor White
        Write-Host "    Attendi ~30 secondi per propagazione" -ForegroundColor Yellow
    } else {
        Write-Host "ERRORE: Push GitHub fallito" -ForegroundColor Red
        exit 1
    }
}

# ------------------------------------------------
if (-not $SkipWorker -and -not $TestOnly -and $wranglerOk) {
    Write-Host ""
    Write-Host "[5] Deploy Worker (Cloudflare)..." -ForegroundColor Cyan
    Write-Host "------------------------------------------------" -ForegroundColor Cyan

    wrangler deploy

    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK - Worker deployed" -ForegroundColor Green
        Write-Host "    API: https://api.sommelierworld.vin" -ForegroundColor White
    } else {
        Write-Host "ERRORE: Deploy Worker fallito" -ForegroundColor Red
    }
}

# ------------------------------------------------
Write-Host ""
Write-Host "[6] Test endpoint..." -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

try {
    $resp = Invoke-RestMethod -Uri "https://api.sommelierworld.vin/api/home-content" -Method Get -TimeoutSec 10
    if ($resp.success) {
        Write-Host "OK - API risponde correttamente" -ForegroundColor Green
        Write-Host "    Notizie:  $($resp.content.news.Count)" -ForegroundColor White
        Write-Host "    Articoli: $($resp.content.articles.Count)" -ForegroundColor White
        Write-Host "    Lezioni:  $($resp.content.lessons.Count)" -ForegroundColor White
    } else {
        Write-Host "ATTENZIONE: API risponde ma success=false" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ATTENZIONE: API non raggiungibile - $($_.Exception.Message)" -ForegroundColor Yellow
}

# ------------------------------------------------
Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "   DEPLOY COMPLETATO                           " -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: https://sommelierworld.vin" -ForegroundColor White
Write-Host "API:      https://api.sommelierworld.vin" -ForegroundColor White
Write-Host ""
Write-Host "Per pulire cache browser, esegui in DevTools Console:" -ForegroundColor Yellow
Write-Host "  localStorage.clear(); sessionStorage.clear(); location.reload(true);" -ForegroundColor Yellow
Write-Host ""

$ob = Read-Host "Aprire il sito nel browser? (y/n)"
if ($ob -eq "y") {
    Start-Process "https://sommelierworld.vin"
}

$wl = Read-Host "Monitorare logs Worker in real-time? (y/n)"
if ($wl -eq "y") {
    Write-Host "Premi CTRL+C per terminare" -ForegroundColor Yellow
    wrangler tail
}

Write-Host ""
Write-Host "Script completato!" -ForegroundColor Green
