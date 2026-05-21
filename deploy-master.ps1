# ═══════════════════════════════════════════════════════
#  🍷 SOMMELIER WORLD - MASTER DEPLOY SCRIPT
#  Automatizza tutti i passaggi di deploy
# ═══════════════════════════════════════════════════════

param(
    [switch]$SkipFrontend,
    [switch]$SkipWorker,
    [switch]$TestOnly
)

# Colori
$ColorInfo = "Cyan"
$ColorSuccess = "Green"
$ColorWarning = "Yellow"
$ColorError = "Red"

# Banner
function Show-Banner {
    Write-Host @"

    ╔════════════════════════════════════════════════╗
    ║                                                ║
    ║    🍷  SOMMELIER WORLD - DEPLOY MASTER  🍷    ║
    ║                                                ║
    ║         Automated Deployment System            ║
    ║                                                ║
    ╚════════════════════════════════════════════════╝

"@ -ForegroundColor $ColorInfo
}

# Step counter
$global:StepNumber = 0
function Write-Step {
    param([string]$Message)
    $global:StepNumber++
    Write-Host "`n[$global:StepNumber] $Message" -ForegroundColor $ColorInfo
    Write-Host ("=" * 60) -ForegroundColor $ColorInfo
}

# Error handler
function Write-ErrorAndExit {
    param([string]$Message)
    Write-Host "`n❌ ERRORE: $Message" -ForegroundColor $ColorError
    Write-Host "Deploy interrotto." -ForegroundColor $ColorWarning
    exit 1
}

# Success message
function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor $ColorSuccess
}

# ═══════════════════════════════════════════════════════
#  MAIN EXECUTION
# ═══════════════════════════════════════════════════════

Show-Banner

# Verifica directory progetto
$ProjectPath = "C:\Users\timot\OneDrive\Desktop\SommelierWorld-MASTER"
if (-not (Test-Path $ProjectPath)) {
    Write-ErrorAndExit "Directory progetto non trovata: $ProjectPath"
}

Set-Location $ProjectPath
Write-Success "Directory progetto: $ProjectPath"

# ═══════════════════════════════════════════════════════
#  STEP 1: PRE-FLIGHT CHECKS
# ═══════════════════════════════════════════════════════

Write-Step "Pre-flight Checks"

# Verifica Git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-ErrorAndExit "Git non trovato. Installare Git prima di continuare."
}
Write-Success "Git trovato: $(git --version)"

# Verifica Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Warning "Node.js non trovato. Il deploy Worker potrebbe fallire."
} else {
    Write-Success "Node.js trovato: $(node --version)"
}

# Verifica Wrangler
if (-not (Get-Command wrangler -ErrorAction SilentlyContinue)) {
    Write-Warning "Wrangler CLI non trovato. Il deploy Worker non sarà possibile."
    Write-Host "Installare con: npm install -g wrangler" -ForegroundColor $ColorWarning
    $SkipWorker = $true
} else {
    Write-Success "Wrangler CLI trovato: $(wrangler --version)"
}

# Verifica file chiave
$requiredFiles = @("index.html", "worker.js", "navigation.js", "manifest.json")
foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        Write-ErrorAndExit "File mancante: $file"
    }
}
Write-Success "Tutti i file chiave presenti"

# ═══════════════════════════════════════════════════════
#  STEP 2: GIT STATUS
# ═══════════════════════════════════════════════════════

Write-Step "Git Status"

Write-Host "`nBranch corrente:" -ForegroundColor $ColorInfo
git branch --show-current

Write-Host "`nModifiche non committate:" -ForegroundColor $ColorInfo
git status --short

# Check se ci sono modifiche da committare
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Warning "Ci sono modifiche non committate"
    $commitNow = Read-Host "Vuoi committarle ora? (y/n)"
    
    if ($commitNow -eq "y") {
        git add -A
        $commitMsg = Read-Host "Messaggio commit (default: 'Deploy update')"
        if ([string]::IsNullOrWhiteSpace($commitMsg)) {
            $commitMsg = "🚀 Deploy update $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
        }
        git commit -m $commitMsg
        Write-Success "Commit eseguito: $commitMsg"
    }
} else {
    Write-Success "Working tree pulito"
}

# ═══════════════════════════════════════════════════════
#  STEP 3: INCREMENTA VERSIONE SERVICE WORKER
# ═══════════════════════════════════════════════════════

if (-not $SkipFrontend) {
    Write-Step "Incrementa Versione Service Worker"
    
    $indexPath = "index.html"
    $content = Get-Content $indexPath -Raw
    
    if ($content -match 'data-sw-version="(\d+)"') {
        $currentVersion = [int]$matches[1]
        $newVersion = $currentVersion + 1
        $content = $content -replace 'data-sw-version="\d+"', "data-sw-version=`"$newVersion`""
        Set-Content -Path $indexPath -Value $content -NoNewline
        Write-Success "Service Worker version: $currentVersion → $newVersion"
    } else {
        Write-Warning "Versione Service Worker non trovata in index.html"
    }
}

# ═══════════════════════════════════════════════════════
#  STEP 4: DEPLOY FRONTEND (GitHub Pages)
# ═══════════════════════════════════════════════════════

if (-not $SkipFrontend -and -not $TestOnly) {
    Write-Step "Deploy Frontend (GitHub Pages)"
    
    Write-Host "📤 Push su GitHub..." -ForegroundColor $ColorInfo
    
    try {
        git add -A
        git commit -m "🏠 Home v2 deploy - $(Get-Date -Format 'yyyy-MM-dd HH:mm')" -ErrorAction SilentlyContinue
        git push origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Frontend deployed su GitHub Pages"
            Write-Host "🌐 App disponibile su: https://sommelierworld.vin" -ForegroundColor $ColorInfo
            Write-Host "⏱️  Attendi ~30 secondi per propagazione" -ForegroundColor $ColorWarning
        } else {
            Write-ErrorAndExit "Push GitHub fallito"
        }
    } catch {
        Write-ErrorAndExit "Errore durante push: $($_.Exception.Message)"
    }
}

# ═══════════════════════════════════════════════════════
#  STEP 5: DEPLOY WORKER (Cloudflare)
# ═══════════════════════════════════════════════════════

if (-not $SkipWorker -and -not $TestOnly) {
    Write-Step "Deploy Worker (Cloudflare)"
    
    # Test sintassi
    Write-Host "🔍 Test sintassi worker.js..." -ForegroundColor $ColorInfo
    node -c worker.js
    if ($LASTEXITCODE -ne 0) {
        Write-ErrorAndExit "Errore sintassi in worker.js"
    }
    Write-Success "Sintassi OK"
    
    # Deploy
    Write-Host "🚀 Deploy worker..." -ForegroundColor $ColorInfo
    wrangler deploy
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Worker deployed"
        Write-Host "🌐 API disponibile su: https://api.sommelierworld.vin" -ForegroundColor $ColorInfo
    } else {
        Write-ErrorAndExit "Deploy Worker fallito"
    }
}

# ═══════════════════════════════════════════════════════
#  STEP 6: TESTING ENDPOINTS
# ═══════════════════════════════════════════════════════

if ($TestOnly -or (-not $SkipWorker)) {
    Write-Step "Testing Endpoints"
    
    # Test /api/home-content
    Write-Host "📡 Testing GET /api/home-content..." -ForegroundColor $ColorInfo
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.sommelierworld.vin/api/home-content" -Method Get -TimeoutSec 10
        
        if ($response.success) {
            Write-Success "Endpoint risponde correttamente"
            Write-Host "📊 Contenuti:" -ForegroundColor $ColorInfo
            Write-Host "  - Notizie: $($response.content.news.Count)" -ForegroundColor $ColorInfo
            Write-Host "  - Articoli: $($response.content.articles.Count)" -ForegroundColor $ColorInfo
            Write-Host "  - Lezioni: $($response.content.lessons.Count)" -ForegroundColor $ColorInfo
        } else {
            Write-Warning "Endpoint risponde ma success=false"
        }
    } catch {
        Write-Warning "Errore chiamata API: $($_.Exception.Message)"
    }
}

# ═══════════════════════════════════════════════════════
#  STEP 7: POST-DEPLOY CLEANUP
# ═══════════════════════════════════════════════════════

Write-Step "Post-Deploy Cleanup"

# Clear local cache
Write-Host "🧹 Pulizia cache locale..." -ForegroundColor $ColorInfo
Write-Host "Eseguire in DevTools Console del browser:" -ForegroundColor $ColorWarning
Write-Host "  localStorage.clear();" -ForegroundColor $ColorWarning
Write-Host "  sessionStorage.clear();" -ForegroundColor $ColorWarning
Write-Host "  location.reload(true);" -ForegroundColor $ColorWarning

Write-Success "Cleanup completato"

# ═══════════════════════════════════════════════════════
#  FINAL REPORT
# ═══════════════════════════════════════════════════════

Write-Host "`n" -NoNewline
Write-Host @"

╔════════════════════════════════════════════════╗
║                                                ║
║         ✅  DEPLOY COMPLETATO  ✅             ║
║                                                ║
╚════════════════════════════════════════════════╝

"@ -ForegroundColor $ColorSuccess

# Summary
Write-Host "📊 SUMMARY:" -ForegroundColor $ColorInfo
Write-Host "─────────────────────────────────────────────────" -ForegroundColor $ColorInfo

if (-not $SkipFrontend -and -not $TestOnly) {
    Write-Host "✅ Frontend deployed:  https://sommelierworld.vin" -ForegroundColor $ColorSuccess
} else {
    Write-Host "⊘  Frontend skipped" -ForegroundColor $ColorWarning
}

if (-not $SkipWorker -and -not $TestOnly) {
    Write-Host "✅ Worker deployed:    https://api.sommelierworld.vin" -ForegroundColor $ColorSuccess
} else {
    Write-Host "⊘  Worker skipped" -ForegroundColor $ColorWarning
}

Write-Host "─────────────────────────────────────────────────" -ForegroundColor $ColorInfo

# Open browser
$openBrowser = Read-Host "`n🌐 Aprire il sito nel browser? (y/n)"
if ($openBrowser -eq "y") {
    Start-Process "https://sommelierworld.vin"
}

# Logs monitoring
$watchLogs = Read-Host "`n📊 Monitorare logs Worker in real-time? (y/n)"
if ($watchLogs -eq "y") {
    Write-Host "`n📡 Avvio wrangler tail..." -ForegroundColor $ColorInfo
    Write-Host "Premi CTRL+C per terminare`n" -ForegroundColor $ColorWarning
    wrangler tail
}

Write-Host "`n✅ Script completato!" -ForegroundColor $ColorSuccess
Write-Host "Grazie per aver usato SommelierWorld Deploy Master! 🍷`n" -ForegroundColor $ColorInfo
