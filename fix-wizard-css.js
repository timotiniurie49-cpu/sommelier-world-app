/**
 * fix-wizard-css.js — SommelierWorld
 * Metodo: inietta CSS override direttamente in dashboard.js
 * Esegui: node fix-wizard-css.js
 * Dalla cartella: SommelierWorld-MASTER
 */
const fs = require('fs');

const DASH = 'dashboard.js';
const IDX  = 'index.html';

let dash = fs.readFileSync(DASH, 'utf8');
let idx  = fs.readFileSync(IDX,  'utf8');
let changed = false;

// ── 1. Inietta CSS override per wizard (se non già presente) ──────────────
const CSS_MARKER = '/* SW-WIZARD-CSS-FIX */';

if (!dash.includes(CSS_MARKER)) {
  const cssInject = `

  // ${CSS_MARKER}
  // Fix visivo wizard configurazione ristorante
  (function injectWizardCSS() {
    if (document.getElementById('sw-wiz-fix')) return;
    var s = document.createElement('style');
    s.id = 'sw-wiz-fix';
    s.textContent = [
      /* Container wizard */
      'div[id*="overview"] .sw-dash-panel, .sw-dashboard-content .sw-dash-panel { color: #F5EFE2; }',

      /* Titolo wizard */
      '#wizTipoGroup, #wizFasciaGroup, #wizViniGroup { display:flex; flex-wrap:wrap; gap:8px; }',

      /* Tutti i bottoni del wizard */
      '#wizTipoGroup button, #wizFasciaGroup button, #wizViniGroup button {',
        'padding: 9px 16px !important;',
        'background: rgba(255,255,255,.08) !important;',
        'border: 1px solid rgba(212,175,55,.3) !important;',
        'border-radius: 8px !important;',
        'color: #F5EFE2 !important;',
        'font-size: .85rem !important;',
        'font-family: inherit !important;',
        'cursor: pointer !important;',
        'white-space: nowrap !important;',
        'transition: all .2s !important;',
      '}',

      /* Bottone selezionato */
      '#wizTipoGroup button[data-selected], #wizFasciaGroup button[data-selected], #wizViniGroup button[data-selected] {',
        'background: rgba(128,0,32,.65) !important;',
        'border-color: rgba(212,175,55,.8) !important;',
        'color: #FFD700 !important;',
        'font-weight: 700 !important;',
      '}',

      /* Labels del wizard */
      '#wizCopertiVal { color: #d4af37 !important; font-weight: 700 !important; }',

      /* Input fields */
      '#wizRegione, #wizCitta {',
        'background: rgba(0,0,0,.45) !important;',
        'border: 1px solid rgba(212,175,55,.25) !important;',
        'border-radius: 6px !important;',
        'color: #F5EFE2 !important;',
        'font-size: .85rem !important;',
        'padding: 10px 12px !important;',
        'width: 100% !important;',
        'box-sizing: border-box !important;',
      '}',
      '#wizRegione::placeholder, #wizCitta::placeholder { color: rgba(245,239,226,.35) !important; }',

      /* Slider */
      '#wizCoperti { accent-color: #d4af37 !important; width:100% !important; }',

      /* Bottone principale */
      'button[onclick*="swWizSalva"] {',
        'width: 100% !important;',
        'padding: 15px !important;',
        'background: rgba(128,0,32,.85) !important;',
        'color: #F5EFE2 !important;',
        'border: none !important;',
        'border-radius: 10px !important;',
        'font-family: Cinzel, serif !important;',
        'font-size: .48rem !important;',
        'letter-spacing: 2px !important;',
        'cursor: pointer !important;',
        'font-weight: 700 !important;',
      '}',
    ].join(' ');
    document.head && document.head.appendChild(s);
  })();
`;

  // Inserisce prima della chiusura dell'IIFE })();
  const IIFE_END = '})();';
  const lastIdx = dash.lastIndexOf(IIFE_END);
  if (lastIdx !== -1) {
    dash = dash.slice(0, lastIdx) + cssInject + '\n' + dash.slice(lastIdx);
    console.log('✅ CSS wizard iniettato in dashboard.js');
    changed = true;
  } else {
    console.log('⚠️  Fine IIFE non trovata — aggiunta in coda al file');
    dash += '\n' + cssInject;
    changed = true;
  }
} else {
  console.log('✅ CSS wizard già presente');
}

// ── 2. Fix swWizSetTipo/Fascia/Vini: aggiunge data-selected invece di style inline ──
// Questo approccio è più robusto — usa un attributo che il CSS intercetta
const SETTERS_MARKER = '/* SW-WIZARD-SETTERS-FIX */';
if (!dash.includes(SETTERS_MARKER)) {
  const settersCode = `

  // ${SETTERS_MARKER}
  // Override robusti per i bottoni di selezione wizard
  (function overrideWizSetters(){
    function makeWizSetter(groupId) {
      return function(btn, val) {
        if (typeof _wizData !== 'undefined') {
          if (groupId === 'wizTipoGroup')   _wizData.tipo   = val;
          if (groupId === 'wizFasciaGroup') _wizData.fascia = val;
          if (groupId === 'wizViniGroup')   _wizData.vini   = val;
        }
        var g = document.getElementById(groupId);
        if (!g) return;
        g.querySelectorAll('button').forEach(function(b){
          b.removeAttribute('data-selected');
          b.style.background   = '';
          b.style.borderColor  = '';
          b.style.color        = '';
          b.style.fontWeight   = '';
        });
        btn.setAttribute('data-selected', '1');
        btn.style.background  = 'rgba(128,0,32,.65)';
        btn.style.borderColor = 'rgba(212,175,55,.8)';
        btn.style.color       = '#FFD700';
        btn.style.fontWeight  = '700';
      };
    }
    window.swWizSetTipo   = makeWizSetter('wizTipoGroup');
    window.swWizSetFascia = makeWizSetter('wizFasciaGroup');
    window.swWizSetVini   = makeWizSetter('wizViniGroup');
  })();
`;

  const IIFE_END = '})();';
  const lastIdx2 = dash.lastIndexOf(IIFE_END);
  if (lastIdx2 !== -1) {
    dash = dash.slice(0, lastIdx2) + settersCode + '\n' + dash.slice(lastIdx2);
  } else {
    dash += '\n' + settersCode;
  }
  console.log('✅ Override swWizSet* aggiunti');
  changed = true;
} else {
  console.log('✅ Override setter già presenti');
}

// ── 3. Bump versione dashboard.js in index.html ───────────────────────────
const verPattern = /dashboard\.js\?v=\w+/;
if (verPattern.test(idx)) {
  const newVer = 'dashboard.js?v=20261016H';
  idx = idx.replace(verPattern, newVer);
  console.log('✅ Versione dashboard.js → ?v=20261016H');
  fs.writeFileSync(IDX, idx, 'utf8');
} else {
  console.log('⚠️  Pattern versione non trovato in index.html');
}

// ── 4. Scrivi dashboard.js ────────────────────────────────────────────────
if (changed) {
  fs.writeFileSync(DASH, dash, 'utf8');
  console.log('\n✅ dashboard.js aggiornato\n');
}

console.log('📦 Ora esegui:');
console.log('   git add -A');
console.log('   git commit -m "fix: wizard visual CSS override"');
console.log('   git push origin main');
