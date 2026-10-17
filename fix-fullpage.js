/**
 * fix-fullpage.js
 * Rende il wizard e il contenuto del dashboard a tutta pagina
 * node fix-fullpage.js
 */
const fs = require('fs');

let dash = fs.readFileSync('dashboard.js', 'utf8');
let idx  = fs.readFileSync('index.html', 'utf8');
let ok = [];

// ── 1. Rimuovi max-width dal container wizard ─────────────────────────────
// Il wizard ha "max-width:560px;margin:24px auto" che lo tiene piccolo
const patterns = [
  ['max-width:560px;margin:24px auto;padding:0 16px;color:#F5EFE2;background:#1A130A;border-radius:14px;',
   'width:100%;color:#F5EFE2;background:#1A130A;border-radius:0;padding:32px;'],
  ['max-width:560px;margin:24px auto;padding:24px;color:#F5EFE2;background:#1A130A;border-radius:14px;',
   'width:100%;color:#F5EFE2;background:#1A130A;border-radius:0;padding:32px;'],
  ['max-width:560px;margin:24px auto;',
   'width:100%;'],
  ['"max-width:560px;margin:0 auto;',
   '"width:100%;'],
];

patterns.forEach(function(p) {
  if (dash.includes(p[0])) {
    dash = dash.split(p[0]).join(p[1]);
    ok.push('✅ Rimosso max-width wizard: ' + p[0].slice(0, 40));
  }
});

// ── 2. Layout dashboard: flex con contenuto full-width ─────────────────────
// Cerca il wrapper del layout e assicura flex + no max-width sul contenuto
const layoutPatterns = [
  // Rimuovi max-width dal wrapper principale del dashboard
  ['class="sw-dash-layout" style="max-width:', 'class="sw-dash-layout" style="width:100%;max-width:9999px;'],
  // Assicura che sw-dashboard-content prenda tutto lo spazio
  ['"sw-dashboard-content" style="', '"sw-dashboard-content" style="flex:1;min-width:0;'],
];
layoutPatterns.forEach(function(p) {
  if (dash.includes(p[0])) {
    dash = dash.replace(p[0], p[1]);
    ok.push('✅ Layout fix: ' + p[0].slice(0, 40));
  }
});

// ── 3. CSS in index.html: full-width garantito ───────────────────────────
const CSS_ID = 'sw-fullpage-fix';
if (!idx.includes(CSS_ID)) {
  const css = `
<style id="${CSS_ID}">
/* Dashboard: contenuto sempre a tutta larghezza */
.sw-dash-layout {
  display: flex !important;
  width: 100% !important;
  max-width: 100% !important;
  min-height: 100vh !important;
}
.sw-dashboard-content,
.sw-dash-content {
  flex: 1 !important;
  min-width: 0 !important;
  max-width: 100% !important;
  overflow-y: auto !important;
}
/* Wizard: sempre full width, no card centrata */
.sw-dashboard-content > div[style*="560px"],
.sw-dash-content > div[style*="560px"],
#page-dashboard [style*="max-width:560px"],
#page-dashboard [style*="max-width: 560px"] {
  max-width: 100% !important;
  margin: 0 !important;
  border-radius: 0 !important;
}
/* Sidebar: stessa dimensione e stessa icona per tutti */
.sw-dash-sidebar .sw-dash-nav-item,
.sw-dash-sidebar [onclick*="goSection"] {
  padding: 10px 16px !important;
  border-radius: 0 !important;
  font-size: .83rem !important;
}
/* Responsive */
@media (max-width: 768px) {
  .sw-dash-layout { flex-direction: column !important; }
  .sw-dash-sidebar { width: 100% !important; min-height: auto !important; }
}
</style>`;
  idx = idx.replace('</head>', css + '\n</head>');
  ok.push('✅ CSS full-page aggiunto in index.html');
}

// ── 4. Bump versione ──────────────────────────────────────────────────────
idx = idx.replace(/dashboard\.js\?v=\w+/g, 'dashboard.js?v=20261017A');
ok.push('✅ Versione → 20261017A');

fs.writeFileSync('dashboard.js', dash, 'utf8');
fs.writeFileSync('index.html',   idx,  'utf8');

console.log('\n' + ok.join('\n'));
if (ok.length === 0) {
  console.log('⚠️  Nessun pattern trovato. Il wizard potrebbe usare variabili o template literal.');
  console.log('   Cerca manualmente "560px" in dashboard.js e rimuovi il max-width.');
}
console.log('\n📦 Ora esegui:');
console.log('   git add -A');
console.log('   git commit -m "fix: wizard e contenuto a tutta pagina"');
console.log('   git push origin main');
