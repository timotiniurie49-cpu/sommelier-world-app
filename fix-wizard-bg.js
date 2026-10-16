/**
 * fix-wizard-bg.js — SommelierWorld
 * Fix: aggiunge sfondo scuro al container del wizard
 * Esegui: node fix-wizard-bg.js
 */
const fs = require('fs');
const DASH = 'dashboard.js';
const IDX  = 'index.html';

let dash = fs.readFileSync(DASH, 'utf8');
let idx  = fs.readFileSync(IDX,  'utf8');

// ── Fix 1: Aggiungi sfondo scuro al container wizard ──────────────────────
// Il wizard usa color:#F5EFE2 (testo crema) ma manca lo sfondo scuro
// Cerchiamo il div container del wizard e aggiungiamo background
const OLD_CONTAINER = 'max-width:560px;margin:24px auto;padding:0 16px;color:#F5EFE2;';
const NEW_CONTAINER = 'max-width:560px;margin:24px auto;padding:24px;color:#F5EFE2;background:#1A130A;border-radius:14px;';

if (dash.includes(OLD_CONTAINER)) {
  dash = dash.replace(OLD_CONTAINER, NEW_CONTAINER);
  console.log('✅ Sfondo scuro aggiunto al container wizard');
} else {
  // Prova pattern alternativo (senza padding:0 16px)
  const ALT_OLD = 'max-width:560px;margin:24px auto;';
  if (dash.includes(ALT_OLD)) {
    // Cerca la prima occorrenza di questo pattern nel contesto del wizard
    const idx2 = dash.indexOf(ALT_OLD);
    const before = dash.slice(Math.max(0, idx2 - 200), idx2 + 200);
    console.log('Contesto trovato:', before.slice(0, 150));
    // Aggiungi background alla prima occorrenza
    dash = dash.replace(ALT_OLD, 'max-width:560px;margin:24px auto;background:#1A130A;border-radius:14px;padding:24px;');
    console.log('✅ Sfondo scuro aggiunto (pattern alternativo)');
  } else {
    console.log('⚠️  Container wizard non trovato con pattern esatto');
    console.log('   Cerco buildRestaurantWizard...');
    const wizIdx = dash.indexOf('function buildRestaurantWizard');
    if (wizIdx !== -1) {
      // Trova il primo div style dopo la funzione
      const startSearch = dash.indexOf('<div style=', wizIdx);
      if (startSearch !== -1 && startSearch < wizIdx + 2000) {
        const divContent = dash.slice(startSearch, startSearch + 300);
        console.log('   Primo div nel wizard:', divContent.slice(0, 150));
      }
    }
    console.log('   Aggiunta CSS globale come fallback...');
  }
}

// ── Fix 2: CSS globale come ulteriore protezione ─────────────────────────
const CSS_TAG = '/* SW-WIZ-BG */';
if (!dash.includes(CSS_TAG)) {
  const cssBlock = `

  // ${CSS_TAG}
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function injectWizStyle() {
      if (document.getElementById('swWizStyle')) return;
      var el = document.createElement('style');
      el.id = 'swWizStyle';
      el.textContent =
        /* Sfondo scuro per il wizard — testo crema visibile */
        '.sw-dashboard-content > div[style*="560px"], ' +
        '.sw-dash-panel [style*="560px"] { ' +
          'background: #1A130A !important; ' +
          'border-radius: 14px !important; ' +
          'padding: 20px !important; ' +
        '}' +

        /* Testo bianco leggibile su sfondo scuro */
        '#wizTipoGroup button, #wizFasciaGroup button, #wizViniGroup button {' +
          'color: #F5EFE2 !important;' +
          'background: rgba(255,255,255,.08) !important;' +
          'border: 1px solid rgba(212,175,55,.3) !important;' +
          'font-size: .85rem !important;' +
          'padding: 9px 16px !important;' +
          'white-space: nowrap !important;' +
          'font-family: inherit !important;' +
          'border-radius: 8px !important;' +
          'cursor: pointer !important;' +
        '}' +

        /* Label visibili */
        '#wizCopertiVal { color: #d4af37 !important; font-weight: 700 !important; }' +

        /* Input fields */
        '#wizRegione, #wizCitta {' +
          'background: rgba(255,255,255,.05) !important;' +
          'border: 1px solid rgba(212,175,55,.3) !important;' +
          'color: #F5EFE2 !important;' +
          'padding: 10px 12px !important;' +
          'border-radius: 6px !important;' +
          'width: 100% !important; box-sizing: border-box !important;' +
        '}' +
        '#wizRegione::placeholder, #wizCitta::placeholder { color: rgba(245,239,226,.4) !important; }';
      document.head.appendChild(el);
    }, 100);

    // Re-inietta quando il DOM cambia (il wizard è dinamico)
    var obs = new MutationObserver(function() { injectWizStyle(); });
    obs.observe(document.body, { childList: true, subtree: true });
    function injectWizStyle() {
      var el = document.getElementById('swWizStyle');
      if (!el) {
        el = document.createElement('style');
        el.id = 'swWizStyle';
        el.textContent = '/* stili wizard */';
        document.head.appendChild(el);
      }
    }
  });
`;

  // Inserisci prima della fine dell'IIFE
  const IIFE = '})();';
  const last = dash.lastIndexOf(IIFE);
  if (last !== -1) {
    dash = dash.slice(0, last) + cssBlock + '\n' + dash.slice(last);
    console.log('✅ CSS globale aggiunto come fallback');
  }
}

// ── Fix 3: Bump versione ──────────────────────────────────────────────────
idx = idx.replace(/dashboard\.js\?v=\w+/, 'dashboard.js?v=20261016J');
console.log('✅ Versione → ?v=20261016J');

fs.writeFileSync(DASH, dash, 'utf8');
fs.writeFileSync(IDX,  idx,  'utf8');

console.log('\n✅ FATTO. Ora esegui:');
console.log('   git add -A');
console.log('   git commit -m "fix: wizard background scuro + testo visibile"');
console.log('   git push origin main');
