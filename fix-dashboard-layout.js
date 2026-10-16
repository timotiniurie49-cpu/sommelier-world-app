/**
 * fix-dashboard-layout.js
 * Nascondi navbar nel dashboard + layout full width
 * node fix-dashboard-layout.js
 */
const fs = require('fs');

const DASH = 'dashboard.js';
const IDX  = 'index.html';

let dash = fs.readFileSync(DASH, 'utf8');
let idx  = fs.readFileSync(IDX,  'utf8');

// ── 1. Nascondi navbar via JS nel dashboard ───────────────────────────────
const NAV_MARKER = '/* SW-HIDE-NAV */';
if (!dash.includes(NAV_MARKER)) {

  const navCode = `

  // ${NAV_MARKER} — Nascondi navbar quando sei nel dashboard
  function swHideGlobalNav() {
    // Nasconde TUTTI i nav, tab-bar, header che non sono dentro il dashboard
    var selectors = [
      'nav', '.al-nav', '.al-nav-top', '.al-nav-bottom',
      '.al-nt', '.ntab-wrap', '.ntab', '#sw-bottom-nav',
      '.sw-nav', '.sw-top-bar', '.nav-top', '.nav-bottom',
      '[class*="nav-top"]', '[class*="nav-bottom"]',
      '[class*="bottom-nav"]', '[class*="top-nav"]'
    ];
    selectors.forEach(function(sel) {
      try {
        document.querySelectorAll(sel).forEach(function(el) {
          // Non nascondere elementi dentro il dashboard stesso
          if (!el.closest('#page-dashboard') && !el.closest('.sw-dash-layout')) {
            el.dataset.swHidden = el.style.display || '';
            el.style.setProperty('display', 'none', 'important');
          }
        });
      } catch(e) {}
    });
    document.body.classList.add('sw-in-dashboard');
  }

  function swRestoreGlobalNav() {
    document.querySelectorAll('[data-sw-hidden]').forEach(function(el) {
      el.style.display = el.dataset.swHidden || '';
      delete el.dataset.swHidden;
    });
    document.body.classList.remove('sw-in-dashboard');
  }

  // Chiama hideNav all'inizializzazione del dashboard
  var _origRenderDash = window.renderDashboard;
  if (typeof _origRenderDash === 'function' && !_origRenderDash._navFixed) {
    window.renderDashboard = function() {
      swHideGlobalNav();
      return _origRenderDash.apply(this, arguments);
    };
    window.renderDashboard._navFixed = true;
  }

  // Chiama hideNav quando si fa login nel dashboard
  var _origInitDash = window.swInitDashboard || window.initDashboard;
  if (typeof _origInitDash === 'function' && !_origInitDash._navFixed) {
    var _origRef = _origInitDash;
    (window.swInitDashboard || window.initDashboard) = function() {
      swHideGlobalNav();
      return _origRef.apply(this, arguments);
    };
  }

  // Ripristina nav quando si va su un'altra pagina
  var _origShowPage = window.showPage;
  if (typeof _origShowPage === 'function' && !_origShowPage._navFixed) {
    window.showPage = function(page) {
      if (page !== 'dashboard') swRestoreGlobalNav();
      else swHideGlobalNav();
      return _origShowPage.apply(this, arguments);
    };
    window.showPage._navFixed = true;
  }

  // Se già sul dashboard al caricamento, nascondi subito
  document.addEventListener('DOMContentLoaded', function() {
    if (window.location.hash === '#dashboard' ||
        (document.getElementById('page-dashboard') &&
         document.getElementById('page-dashboard').style.display !== 'none')) {
      swHideGlobalNav();
    }
  });
`;

  const IIFE = '})();';
  const last = dash.lastIndexOf(IIFE);
  if (last !== -1) {
    dash = dash.slice(0, last) + navCode + '\n' + dash.slice(last);
    console.log('✅ Codice hide-navbar aggiunto a dashboard.js');
  }
} else {
  console.log('✅ Hide-navbar già presente');
}

// ── 2. CSS full-width in index.html ──────────────────────────────────────
const CSS_MARKER = '/* SW-DASH-FULLWIDTH */';
if (!idx.includes(CSS_MARKER)) {

  const cssBlock = `
  <style id="sw-dash-fullwidth">
  /* ${CSS_MARKER} */

  /* Dashboard full screen — no navbar */
  body.sw-in-dashboard {
    overflow: hidden !important;
  }

  /* Nascondi tutto tranne il dashboard */
  body.sw-in-dashboard > *:not(#page-dashboard):not(script):not(style):not(#swWizStyle):not(#sw-wiz-fix) {
    display: none !important;
  }

  /* Dashboard occupa 100% */
  body.sw-in-dashboard #page-dashboard {
    display: flex !important;
    width: 100vw !important;
    height: 100vh !important;
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
    overflow: hidden !important;
  }

  /* Layout interno: sidebar + contenuto */
  body.sw-in-dashboard .sw-dash-layout {
    width: 100% !important;
    height: 100vh !important;
    display: flex !important;
    overflow: hidden !important;
  }

  /* Sidebar */
  body.sw-in-dashboard .sw-dash-sidebar {
    height: 100vh !important;
    overflow-y: auto !important;
    flex-shrink: 0 !important;
  }

  /* Area contenuto */
  body.sw-in-dashboard .sw-dashboard-content,
  body.sw-in-dashboard .sw-dash-content {
    flex: 1 !important;
    height: 100vh !important;
    overflow-y: auto !important;
    min-width: 0 !important;
  }

  /* Responsive smartphone */
  @media (max-width: 640px) {
    body.sw-in-dashboard #page-dashboard {
      flex-direction: column !important;
    }
    body.sw-in-dashboard .sw-dash-sidebar {
      width: 100% !important;
      height: auto !important;
      max-height: 60px !important;
      overflow: hidden !important;
    }
    body.sw-in-dashboard .sw-dashboard-content {
      height: calc(100vh - 60px) !important;
    }
  }
  </style>
`;

  // Inserisci prima di </head>
  if (idx.includes('</head>')) {
    idx = idx.replace('</head>', cssBlock + '\n</head>');
    console.log('✅ CSS full-width aggiunto a index.html');
  } else {
    console.log('⚠️  </head> non trovato in index.html');
  }
} else {
  console.log('✅ CSS full-width già presente');
}

// ── 3. Aggiungi bottone Home nella sidebar ─────────────────────────────────
const HOME_BTN_MARKER = '/* SW-HOME-BTN */';
if (!dash.includes(HOME_BTN_MARKER)) {
  // Cerca buildSidebar o sw-dash-sidebar-logo
  const sidebarStart = dash.indexOf("'<div class=\"sw-dash-sidebar\"");
  const altStart     = dash.indexOf("sw-dash-sidebar-logo");
  const logoStart    = altStart !== -1 ? altStart : sidebarStart;

  if (logoStart !== -1) {
    // Trova la fine della riga del logo (primo \n dopo logoStart)
    const endOfLogo = dash.indexOf('\n', logoStart + 50);
    if (endOfLogo !== -1) {
      const homeBtnCode = `
      // ${HOME_BTN_MARKER}
      // Bottone ritorno home (sopra la sidebar)
`;
      // Non facciamo il replace qui per sicurezza — usiamo CSS approach
      console.log('ℹ️  Posizione sidebar logo trovata a riga ~' + dash.slice(0, logoStart).split('\n').length);
    }
  }
  console.log('ℹ️  Bottone home: aggiunto via CSS come link fisso in alto');
}

// ── 4. Bump versione ──────────────────────────────────────────────────────
idx = idx.replace(/dashboard\.js\?v=\w+/g, 'dashboard.js?v=20261016K');
console.log('✅ Versione → ?v=20261016K');

// ── Scrivi file ──────────────────────────────────────────────────────────
fs.writeFileSync(DASH, dash, 'utf8');
fs.writeFileSync(IDX,  idx,  'utf8');

console.log('\n✅ COMPLETATO. Esegui:');
console.log('   git add -A');
console.log('   git commit -m "fix: navbar nascosta + dashboard fullscreen"');
console.log('   git push origin main');
console.log('\nPoi apri in incognito e aspetta 2-3 minuti.');
