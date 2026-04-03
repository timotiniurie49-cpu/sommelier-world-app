/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SOMMELIER WORLD · PATCH v11                                    ║
 * ║                                                                  ║
 * ║  ✓ Contatti → modale a pagina intera (non scroll)              ║
 * ║    Email inviata via server Railway (no mailto:)                ║
 * ║  ✓ Abbinamenti → filtri: acidità / morbidezza /                ║
 * ║    sapidità / paese — passano al prompt AI                      ║
 * ║  ✓ Protezione copia contenuti (testo e immagini)               ║
 * ║  ✓ Logo cliccabile → Home (già in v9, qui potenziato)          ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * Installazione in index.html prima di </body>:
 *   <script src="sw-patch-v6.js"></script>
 *   <script src="sw-patch-v9.js"></script>
 *   <script src="sw-patch-v10.js"></script>
 *   <script src="sw-patch-v11.js"></script>
 */

(function () {
  'use strict';

  /* ─── Costanti ───────────────────────────────────────── */
  var SERVER = (function() {
    // Prende il server URL già definito da sw-patch-v6.js se presente
    return window._SW_SERVER ||
      'https://sommelier-server-production-8f92.up.railway.app';
  })();

  /* ═══════════════════════════════════════════════════════
     CSS v11
     ═══════════════════════════════════════════════════════ */
  function injectCSS11() {
    if (document.querySelector('#sw11-css')) return;
    var s = document.createElement('style');
    s.id = 'sw11-css';
    s.textContent = [

      /* ── Contatti Modal Pagina ── */
      '#sw11-contact-page{',
        'display:none;position:fixed;inset:0;z-index:999980;',
        'background:#0A0705;overflow-y:auto;',
        'animation:sw11in .32s ease;}',
      '@keyframes sw11in{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}',

      '#sw11-cp-header{',
        'position:sticky;top:0;z-index:2;',
        'background:rgba(10,7,5,.97);backdrop-filter:blur(12px);',
        'border-bottom:1px solid rgba(212,175,55,.15);',
        'padding:14px 16px;',
        'display:flex;align-items:center;gap:12px;}',

      '#sw11-cp-back{',
        'width:36px;height:36px;border-radius:50%;',
        'background:rgba(212,175,55,.1);border:1px solid rgba(212,175,55,.25);',
        'color:#D4AF37;font-size:18px;cursor:pointer;',
        'display:flex;align-items:center;justify-content:center;',
        'flex-shrink:0;transition:all .2s;}',
      '#sw11-cp-back:hover{background:rgba(212,175,55,.2);}',

      '#sw11-cp-title{',
        'font-family:"Playfair Display",Georgia,serif;',
        'font-size:1.1rem;font-weight:700;color:#F5EFE2;flex:1;}',

      '#sw11-cp-body{max-width:560px;margin:0 auto;padding:24px 16px 60px;}',

      '.sw11-hero-contact{',
        'text-align:center;padding:24px 0 28px;}',
      '.sw11-hero-contact .sw11-tag{',
        'font-size:9px;font-weight:700;letter-spacing:3px;',
        'text-transform:uppercase;color:rgba(212,175,55,.5);',
        'margin-bottom:8px;}',
      '.sw11-hero-contact h2{',
        'font-family:"Playfair Display",Georgia,serif;',
        'font-size:1.6rem;font-weight:700;color:#F5EFE2;',
        'margin:0 0 8px;}',
      '.sw11-hero-contact p{',
        'font-size:13px;color:rgba(245,239,226,.45);',
        'line-height:1.8;margin:0;}',

      '.sw11-field{margin-bottom:14px;}',
      '.sw11-label{',
        'display:block;font-size:9px;font-weight:700;',
        'letter-spacing:2px;text-transform:uppercase;',
        'color:rgba(212,175,55,.55);margin-bottom:5px;}',
      '.sw11-input,.sw11-select,.sw11-textarea{',
        'width:100%;padding:11px 13px;box-sizing:border-box;',
        'background:rgba(255,255,255,.05);',
        'border:1px solid rgba(212,175,55,.2);',
        'border-radius:8px;color:#F5EFE2;',
        'font-family:"Lato",sans-serif;font-size:15px;',
        'transition:border-color .2s,background .2s;}',
      '.sw11-input:focus,.sw11-select:focus,.sw11-textarea:focus{',
        'border-color:rgba(212,175,55,.55);outline:none;',
        'background:rgba(255,255,255,.08);}',
      '.sw11-textarea{height:110px;resize:none;}',
      '.sw11-select{appearance:none;cursor:pointer;}',

      '.sw11-btn-send{',
        'width:100%;padding:13px;margin-top:8px;',
        'background:rgba(212,175,55,.15);',
        'border:1px solid rgba(212,175,55,.4);',
        'border-radius:8px;color:#D4AF37;',
        'font-family:"Lato",sans-serif;',
        'font-size:11px;font-weight:700;letter-spacing:3px;',
        'text-transform:uppercase;cursor:pointer;',
        'transition:all .22s;}',
      '.sw11-btn-send:hover:not(:disabled){',
        'background:rgba(212,175,55,.28);border-color:#D4AF37;',
        'transform:translateY(-1px);}',
      '.sw11-btn-send:disabled{opacity:.5;cursor:not-allowed;}',

      '.sw11-form-status{',
        'text-align:center;padding:16px;border-radius:8px;',
        'font-size:13px;margin-top:10px;display:none;}',
      '.sw11-form-status.ok{',
        'background:rgba(80,200,100,.12);',
        'border:1px solid rgba(80,200,100,.3);color:#7dda8a;}',
      '.sw11-form-status.err{',
        'background:rgba(220,60,60,.1);',
        'border:1px solid rgba(220,60,60,.25);color:#e87272;}',

      '.sw11-contact-direct{',
        'text-align:center;margin-top:22px;',
        'font-size:12px;color:rgba(245,239,226,.35);',
        'line-height:1.9;}',
      '.sw11-contact-direct a{',
        'color:rgba(212,175,55,.55);text-decoration:none;}',
      '.sw11-contact-direct a:hover{color:#D4AF37;}',

      /* ── Trigger Contatti nel nav/home ── */
      '.sw11-contact-trigger{',
        'display:inline-flex;align-items:center;gap:6px;',
        'padding:8px 16px;',
        'background:rgba(212,175,55,.1);',
        'border:1px solid rgba(212,175,55,.25);',
        'border-radius:20px;cursor:pointer;',
        'font-size:11px;font-weight:700;letter-spacing:2px;',
        'text-transform:uppercase;color:#D4AF37;',
        'transition:all .2s;white-space:nowrap;}',
      '.sw11-contact-trigger:hover{',
        'background:rgba(212,175,55,.2);border-color:#D4AF37;}',

      /* ── Filtri Abbinamento ── */
      '#sw11-abb-filters{',
        'padding:14px 14px 0;',
        'display:flex;flex-wrap:wrap;gap:8px;',
        'border-bottom:1px solid rgba(212,175,55,.1);',
        'margin-bottom:0;}',

      '.sw11-filter-group{flex:1;min-width:140px;}',
      '.sw11-filter-label{',
        'font-size:8px;font-weight:700;letter-spacing:2px;',
        'text-transform:uppercase;color:rgba(212,175,55,.5);',
        'margin-bottom:4px;display:block;}',
      '.sw11-filter-sel{',
        'width:100%;padding:7px 10px;',
        'background:rgba(255,255,255,.05);',
        'border:1px solid rgba(212,175,55,.2);',
        'border-radius:6px;color:#F5EFE2;',
        'font-size:12px;cursor:pointer;appearance:none;}',
      '.sw11-filter-sel:focus{',
        'border-color:rgba(212,175,55,.5);outline:none;}',

      /* ── Protezione copia ── */
      '.sw11-nocopy{user-select:none;-webkit-user-select:none;}',
      '.sw11-noimg img{pointer-events:none;-webkit-user-drag:none;}',

      /* ── Bottone Contatti fisso ── */
      '#sw11-fab-contact{',
        'position:fixed;bottom:22px;right:16px;z-index:800;',
        'width:50px;height:50px;border-radius:50%;',
        'background:rgba(10,7,5,.92);',
        'border:1px solid rgba(212,175,55,.4);',
        'color:#D4AF37;font-size:20px;cursor:pointer;',
        'display:flex;align-items:center;justify-content:center;',
        'box-shadow:0 4px 20px rgba(0,0,0,.5);',
        'transition:all .2s;backdrop-filter:blur(8px);}',
      '#sw11-fab-contact:hover{',
        'border-color:#D4AF37;transform:scale(1.08);}',

    ].join('');
    document.head.appendChild(s);
  }


  /* ═══════════════════════════════════════════════════════
     CONTATTI — Modal a pagina intera
     ═══════════════════════════════════════════════════════ */
  function buildContactPage() {
    if (document.querySelector('#sw11-contact-page')) return;

    var page = document.createElement('div');
    page.id = 'sw11-contact-page';
    page.innerHTML =
      /* Header con back button */
      '<div id="sw11-cp-header">' +
        '<div id="sw11-cp-back" onclick="SW11.closeContact()" title="Torna indietro">←</div>' +
        '<div id="sw11-cp-title">Contatti</div>' +
      '</div>' +

      '<div id="sw11-cp-body">' +

        /* Hero */
        '<div class="sw11-hero-contact">' +
          '<div class="sw11-tag">✉️ SCRIVICI</div>' +
          '<h2>Come possiamo aiutarti?</h2>' +
          '<p>Domande, collaborazioni con produttori,<br>segnalazione di errori nel database.<br>Risponderemo entro 48 ore.</p>' +
        '</div>' +

        /* Form */
        '<form id="sw11-contact-form" autocomplete="on" onsubmit="return false;">' +

          '<div class="sw11-field">' +
            '<label class="sw11-label" for="sw11-fn">Nome *</label>' +
            '<input class="sw11-input" id="sw11-fn" type="text" placeholder="Il tuo nome" autocomplete="name" required>' +
          '</div>' +

          '<div class="sw11-field">' +
            '<label class="sw11-label" for="sw11-fe">Email *</label>' +
            '<input class="sw11-input" id="sw11-fe" type="email" placeholder="la.tua@email.com" autocomplete="email" required>' +
          '</div>' +

          '<div class="sw11-field">' +
            '<label class="sw11-label" for="sw11-fs">Argomento</label>' +
            '<select class="sw11-select" id="sw11-fs">' +
              '<option value="">— Seleziona —</option>' +
              '<option value="Sono un produttore / cantina">🏭 Sono un produttore / cantina</option>' +
              '<option value="Collaborazione sommelier">🥂 Collaborazione sommelier</option>' +
              '<option value="Errore nel database">🛠 Segnalazione errore nel database</option>' +
              '<option value="Partnership">🤝 Partnership / pubblicità</option>' +
              '<option value="Altro">💬 Altro</option>' +
            '</select>' +
          '</div>' +

          '<div class="sw11-field">' +
            '<label class="sw11-label" for="sw11-fm">Messaggio *</label>' +
            '<textarea class="sw11-textarea" id="sw11-fm" placeholder="Scrivi qui il tuo messaggio..." required></textarea>' +
          '</div>' +

          '<button class="sw11-btn-send" id="sw11-send-btn" onclick="SW11.sendContact()">✦ INVIA MESSAGGIO ✦</button>' +

          '<div class="sw11-form-status" id="sw11-form-status"></div>' +

        '</form>' +

        /* Contatti diretti */
        '<div class="sw11-contact-direct">' +
          'Oppure scrivici direttamente a<br>' +
          '<a href="mailto:info@sommelierworld.vin">info@sommelierworld.vin</a>' +
          '<br><br>' +
          '<span style="font-size:10px;opacity:.7;">' +
            'Sommelier World · sommelierworld.vin<br>' +
            'Per produttori: listing gratuito nella directory, piani premium disponibili.' +
          '</span>' +
        '</div>' +

      '</div>';

    document.body.appendChild(page);
  }

  /* Apri / chiudi */
  function openContact() {
    buildContactPage();
    var page = document.querySelector('#sw11-contact-page');
    page.style.display = 'block';
    page.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    // Reset form
    var form = document.querySelector('#sw11-contact-form');
    if (form) form.reset();
    var status = document.querySelector('#sw11-form-status');
    if (status) { status.style.display = 'none'; status.textContent = ''; }
    var btn = document.querySelector('#sw11-send-btn');
    if (btn) { btn.disabled = false; btn.textContent = '✦ INVIA MESSAGGIO ✦'; }
  }

  function closeContact() {
    var page = document.querySelector('#sw11-contact-page');
    if (page) page.style.display = 'none';
    document.body.style.overflow = '';
  }

  /* Invio email via server Railway */
  async function sendContact() {
    var name    = (document.querySelector('#sw11-fn')?.value || '').trim();
    var email   = (document.querySelector('#sw11-fe')?.value || '').trim();
    var subject = document.querySelector('#sw11-fs')?.value || '';
    var message = (document.querySelector('#sw11-fm')?.value || '').trim();
    var status  = document.querySelector('#sw11-form-status');
    var btn     = document.querySelector('#sw11-send-btn');

    // Validazione
    if (!name || !email || !message) {
      showStatus('err', '⚠ Compila tutti i campi obbligatori (*)');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      showStatus('err', '⚠ Email non valida');
      return;
    }

    btn.disabled = true;
    btn.textContent = '⏳ Invio in corso…';
    if (status) status.style.display = 'none';

    try {
      var res = await fetch(SERVER + '/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      var data = await res.json();

      if (res.ok && data.ok) {
        showStatus('ok', '✓ Messaggio inviato! Ti risponderemo entro 48 ore.');
        document.querySelector('#sw11-contact-form').reset();
        btn.textContent = '✓ Inviato';
      } else {
        throw new Error(data.error || 'Errore sconosciuto');
      }
    } catch (err) {
      showStatus('err', '✗ ' + (err.message || 'Errore di rete. Riprova.'));
      btn.disabled = false;
      btn.textContent = '✦ INVIA MESSAGGIO ✦';
    }

    function showStatus(type, msg) {
      if (!status) return;
      status.className = 'sw11-form-status ' + type;
      status.textContent = msg;
      status.style.display = 'block';
    }
  }


  /* ═══════════════════════════════════════════════════════
     BOTTONE CONTATTI FISSO (FAB)
     ═══════════════════════════════════════════════════════ */
  function injectContactFAB() {
    if (document.querySelector('#sw11-fab-contact')) return;
    var fab = document.createElement('div');
    fab.id = 'sw11-fab-contact';
    fab.title = 'Contattaci';
    fab.textContent = '✉';
    fab.addEventListener('click', openContact);
    document.body.appendChild(fab);
  }

  /* Sostituisce il vecchio form contatti che faceva mailto: */
  function patchOldContactForms() {
    // Intercetta qualsiasi form/bottone con ID o classe contatto
    document.querySelectorAll(
      '#sw10-form-ok, #sw10-form-submit, .sw10-form-submit, [onclick*="mailto"], [href^="mailto"]'
    ).forEach(function(el) {
      if (el.dataset.sw11patched) return;
      el.dataset.sw11patched = '1';
      el.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openContact();
      });
    });

    // Rimuovi sezione contatti v10 scrollabile se presente
    var oldContact = document.querySelector('#sw10-contact');
    if (oldContact) {
      oldContact.style.display = 'none';
    }
  }


  /* ═══════════════════════════════════════════════════════
     FILTRI ABBINAMENTO
     Acidità / Morbidezza / Sapidità / Paese
     ═══════════════════════════════════════════════════════ */
  var FILTER_STATE = {
    acidita:    '',
    morbidezza: '',
    sapidita:   '',
    paese:      '',
  };

  function injectAbbFilters() {
    var somPage = document.querySelector('#page-sommelier');
    if (!somPage || document.querySelector('#sw11-abb-filters')) return;

    /* Inserisce i filtri prima del campo input principale */
    var inputArea = somPage.querySelector('textarea, input[type="text"], .field');
    if (!inputArea) return;
    var parent = inputArea.closest('form, .abb-form, .sommelier-body, #page-sommelier > div');
    if (!parent) parent = inputArea.parentElement;

    var filtersDiv = document.createElement('div');
    filtersDiv.id = 'sw11-abb-filters';
    filtersDiv.innerHTML =
      '<div class="sw11-filter-group">' +
        '<span class="sw11-filter-label">⚡ Acidità</span>' +
        '<select class="sw11-filter-sel" id="sw11-f-acidita" onchange="SW11.setFilter(\'acidita\',this.value)">' +
          '<option value="">Qualsiasi</option>' +
          '<option value="bassa">Bassa (vino morbido)</option>' +
          '<option value="media">Media (equilibrata)</option>' +
          '<option value="alta">Alta (vivace, fresca)</option>' +
        '</select>' +
      '</div>' +
      '<div class="sw11-filter-group">' +
        '<span class="sw11-filter-label">🌊 Morbidezza</span>' +
        '<select class="sw11-filter-sel" id="sw11-f-morbidezza" onchange="SW11.setFilter(\'morbidezza\',this.value)">' +
          '<option value="">Qualsiasi</option>' +
          '<option value="secco">Secco (tannini decisi)</option>' +
          '<option value="morbido">Morbido (vellutato)</option>' +
          '<option value="dolce">Dolce / amabile</option>' +
        '</select>' +
      '</div>' +
      '<div class="sw11-filter-group">' +
        '<span class="sw11-filter-label">🌊 Sapidità</span>' +
        '<select class="sw11-filter-sel" id="sw11-f-sapidita" onchange="SW11.setFilter(\'sapidita\',this.value)">' +
          '<option value="">Qualsiasi</option>' +
          '<option value="bassa">Bassa (delicata)</option>' +
          '<option value="media">Media</option>' +
          '<option value="alta">Alta (minerale, marina)</option>' +
        '</select>' +
      '</div>' +
      '<div class="sw11-filter-group">' +
        '<span class="sw11-filter-label">🌍 Paese</span>' +
        '<select class="sw11-filter-sel" id="sw11-f-paese" onchange="SW11.setFilter(\'paese\',this.value)">' +
          '<option value="">Qualsiasi</option>' +
          '<option value="Italia">🇮🇹 Italia</option>' +
          '<option value="Francia">🇫🇷 Francia</option>' +
          '<option value="Spagna">🇪🇸 Spagna</option>' +
          '<option value="Portogallo">🇵🇹 Portogallo</option>' +
          '<option value="Germania">🇩🇪 Germania</option>' +
          '<option value="Austria">🇦🇹 Austria</option>' +
          '<option value="Argentina">🇦🇷 Argentina</option>' +
          '<option value="Cile">🇨🇱 Cile</option>' +
          '<option value="Australia">🇦🇺 Australia</option>' +
          '<option value="USA">🇺🇸 USA</option>' +
          '<option value="Nuova Zelanda">🇳🇿 Nuova Zelanda</option>' +
          '<option value="Sud Africa">🇿🇦 Sud Africa</option>' +
          '<option value="Grecia">🇬🇷 Grecia</option>' +
          '<option value="Georgia">🇬🇪 Georgia</option>' +
        '</select>' +
      '</div>';

    parent.insertBefore(filtersDiv, inputArea);

    /* Inietta i filtri nel prompt AI intercettando doAbbinamento */
    if (typeof window.doAbbinamento === 'function') {
      var origDoAbb = window.doAbbinamento;
      window.doAbbinamento = function() {
        _injectFiltersIntoPrompt();
        return origDoAbb.apply(this, arguments);
      };
    }
  }

  function setFilter(key, val) {
    FILTER_STATE[key] = val;
  }

  /* Aggiunge i filtri al campo di testo se vuoto, o al system prompt */
  function _injectFiltersIntoPrompt() {
    var parts = [];
    if (FILTER_STATE.acidita)    parts.push('Acidità del vino: ' + FILTER_STATE.acidita);
    if (FILTER_STATE.morbidezza) parts.push('Struttura: ' + FILTER_STATE.morbidezza);
    if (FILTER_STATE.sapidita)   parts.push('Sapidità: ' + FILTER_STATE.sapidita);
    if (FILTER_STATE.paese)      parts.push('Paese di origine preferito: ' + FILTER_STATE.paese);

    if (parts.length === 0) return;

    var filterStr = '\n[Preferenze utente: ' + parts.join(', ') + ']';

    // Aggiunge al campo menu/input se esiste
    var menuField = document.querySelector('#menuInput, #menu, textarea');
    if (menuField && menuField.value && !menuField.value.includes('[Preferenze')) {
      menuField.value += filterStr;
    }

    // Salva in window per sw-patch-v6.js
    window._SW11_FILTER_STR = filterStr;
  }

  /* Intercetta le chiamate API da v6 per aggiungere i filtri */
  function patchV6AICall() {
    if (!window._SW11_FILTER_STR) return;
    // I filtri vengono già aggiunti al campo di testo in _injectFiltersIntoPrompt
    // Questo è solo un safety net
  }


  /* ═══════════════════════════════════════════════════════
     PROTEZIONE CONTENUTI
     ═══════════════════════════════════════════════════════ */
  function enableCopyProtection() {
    if (document.querySelector('#sw11-copy-prot')) return;

    var s = document.createElement('style');
    s.id = 'sw11-copy-prot';
    s.textContent =
      /* Disabilita selezione testo sugli articoli e denominazioni */
      '#sw9-arts, #sw10-winedb, .sw9-at, .sw9-ac, #sw9-mtxt, #sw9-msom, #sw10-winedb-list {' +
        'user-select:none;-webkit-user-select:none;' +
      '}' +
      /* Disabilita drag delle immagini */
      'img{-webkit-user-drag:none;pointer-events:none;}' +
      /* Cursore normale sui testi protetti */
      '#sw9-arts *, #sw10-winedb *{cursor:default;}';
    document.head.appendChild(s);

    /* Blocca menu contestuale su immagini */
    document.addEventListener('contextmenu', function(e) {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
      /* Mostra un messaggio sugli articoli */
      var artEl = e.target.closest('#sw9-arts, #sw10-winedb, #sw9-mi');
      if (artEl) {
        e.preventDefault();
        showCopyNotice(e.clientX, e.clientY);
        return false;
      }
    });

    /* Blocca Ctrl+C sulle sezioni protette */
    document.addEventListener('copy', function(e) {
      var sel = window.getSelection();
      if (!sel || sel.isCollapsed) return;
      var parent = sel.anchorNode && sel.anchorNode.parentElement;
      if (parent && parent.closest('#sw9-arts, #sw10-winedb')) {
        e.preventDefault();
        showCopyNotice();
      }
    });

    /* Blocca tasto PrintScreen (solo informativo) */
    document.addEventListener('keydown', function(e) {
      if (e.key === 'PrintScreen') {
        showCopyNotice();
      }
    });
  }

  var _copyNoticeTimer = null;
  function showCopyNotice(x, y) {
    var notice = document.querySelector('#sw11-copy-notice');
    if (!notice) {
      notice = document.createElement('div');
      notice.id = 'sw11-copy-notice';
      notice.style.cssText =
        'position:fixed;z-index:999999;' +
        'background:rgba(10,7,5,.95);border:1px solid rgba(212,175,55,.4);' +
        'color:#D4AF37;border-radius:8px;padding:10px 16px;' +
        'font-size:12px;font-family:"Lato",sans-serif;' +
        'pointer-events:none;box-shadow:0 4px 20px rgba(0,0,0,.5);' +
        'max-width:260px;text-align:center;line-height:1.5;';
      document.body.appendChild(notice);
    }
    notice.textContent = '© Sommelier World — contenuto protetto';
    notice.style.display = 'block';
    notice.style.top  = (y || window.innerHeight / 2) + 'px';
    notice.style.left = (x || window.innerWidth  / 2 - 130) + 'px';
    clearTimeout(_copyNoticeTimer);
    _copyNoticeTimer = setTimeout(function() {
      notice.style.display = 'none';
    }, 2000);
  }


  /* ═══════════════════════════════════════════════════════
     LOGO → HOME (rafforzato)
     ═══════════════════════════════════════════════════════ */
  function fixLogo11() {
    var logos = document.querySelectorAll('#navLogo, .nav-logo, .logo, [class*="logo"]');
    logos.forEach(function(logo) {
      if (logo.dataset.sw11) return;
      logo.dataset.sw11 = '1';
      logo.style.cursor = 'pointer';
      logo.addEventListener('click', function() {
        // Chiudi tutto
        ['#sw11-contact-page', '#sw9-modal', '#sw8-modal', '#sw-wiz', '#sw-fp']
          .forEach(function(sel) {
            var el = document.querySelector(sel);
            if (el) { el.style.display = 'none'; }
          });
        document.body.style.overflow = '';
        // Torna alla home
        var tab = document.querySelector('.ntab[data-page="home"]');
        if (tab) { tab.click(); }
        else {
          document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
          var h = document.querySelector('#page-home');
          if (h) h.classList.add('active');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }


  /* ═══════════════════════════════════════════════════════
     API PUBBLICA  window.SW11
     ═══════════════════════════════════════════════════════ */
  window.SW11 = {
    openContact:  openContact,
    closeContact: closeContact,
    sendContact:  sendContact,
    setFilter:    setFilter,
  };


  /* ═══════════════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════════════ */
  function init() {
    console.log('[SW-v11] Patch v11 — avvio');
    injectCSS11();
    buildContactPage();
    enableCopyProtection();

    var n = 0;
    function run() {
      injectContactFAB();
      patchOldContactForms();
      injectAbbFilters();
      fixLogo11();
      if (++n < 20) setTimeout(run, 400);
      else console.log('[SW-v11] Init completato ✓');
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run);
    } else {
      run();
    }
  }

  init();

})();
