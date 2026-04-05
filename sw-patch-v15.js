/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SOMMELIER WORLD · PATCH v15                                    ║
 * ║                                                                  ║
 * ║  ✓ Tasto INDIETRO — naviga tra le pagine dell'app              ║
 * ║    invece di uscire dal sito                                     ║
 * ║  ✓ Diagnostica API — mostra errore chiaro se la chiave          ║
 * ║    non è configurata o il modello è sbagliato                   ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════
     NAVIGATION HISTORY — tasto indietro nell'app
     ═══════════════════════════════════════════════════════ */

  var _history = ['home'];  // Stack delle pagine visitate
  var _isNavigating = false;

  /* Intercetta ogni cambio di pagina e salva nella history */
  function patchNavigation() {
    /* Sovrascrive showPage globale */
    var _origShowPage = window.showPage;
    window.showPage = function(page, skipHistory) {
      if (!skipHistory && page !== _history[_history.length - 1]) {
        _history.push(page);
        // Aggiunge uno stato nella browser history
        try {
          history.pushState({ swPage: page, idx: _history.length - 1 }, '', '');
        } catch(e) {}
      }
      if (typeof _origShowPage === 'function') {
        return _origShowPage(page);
      }
    };

    /* Intercetta anche i click sui tab .ntab */
    document.addEventListener('click', function(e) {
      var tab = e.target.closest('.ntab[data-page]');
      if (tab && tab.dataset.page) {
        var page = tab.dataset.page;
        if (page !== _history[_history.length - 1]) {
          _history.push(page);
          try {
            history.pushState({ swPage: page, idx: _history.length - 1 }, '', '');
          } catch(e) {}
        }
      }
    }, true);

    /* Gestisce il tasto INDIETRO del browser */
    window.addEventListener('popstate', function(e) {
      if (_isNavigating) return;
      _isNavigating = true;

      // Rimuovi l'ultima pagina dalla nostra history
      if (_history.length > 1) {
        _history.pop();
        var prevPage = _history[_history.length - 1];

        // Chiudi modali/overlay aperti prima di navigare
        closeAllOverlays();

        // Torna alla pagina precedente nell'app
        setTimeout(function() {
          if (typeof _origShowPage === 'function') {
            _origShowPage(prevPage);
          }
          // Riaggiungi uno stato per il prossimo back
          try {
            history.pushState({ swPage: prevPage, idx: _history.length - 1 }, '', '');
          } catch(e) {}
          _isNavigating = false;
        }, 50);
      } else {
        // Siamo alla home — non uscire, rimani
        _history = ['home'];
        closeAllOverlays();
        if (typeof _origShowPage === 'function') {
          _origShowPage('home');
        }
        try {
          history.pushState({ swPage: 'home', idx: 0 }, '', '');
        } catch(e) {}
        _isNavigating = false;
      }
    });

    // Stato iniziale
    try {
      history.replaceState({ swPage: 'home', idx: 0 }, '', '');
    } catch(e) {}

    console.log('[SW-v15] Navigation history attivo ✓');
  }

  function closeAllOverlays() {
    // Chiudi modali aperte
    var overlays = [
      '#sw11-contact-page',
      '#sw12-art-modal',
      '#sw-wiz', '#sw-fp',
      '#drawer',
      '#prodModal',
      '#articleReader',
    ];
    overlays.forEach(function(sel) {
      var el = document.querySelector(sel);
      if (el && el.style.display !== 'none') {
        el.style.display = 'none';
      }
    });
    document.body.style.overflow = '';
  }


  /* ═══════════════════════════════════════════════════════
     API KEY DIAGNOSTICA
     Testa il server al caricamento e mostra errore chiaro
     ═══════════════════════════════════════════════════════ */

  var SERVER = window._SW_SERVER ||
    'https://sommelier-server-production-8f92.up.railway.app';

  function testAPI() {
    fetch(SERVER + '/', { method: 'GET' })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        console.log('[SW-v15] Server status:', data);

        if (data.key && data.key.includes('MANCANTE')) {
          showAPIBanner(
            '⚠ API Key mancante',
            'Vai su Railway → Variables → aggiungi GEMINI_API_KEY',
            '#c0392b'
          );
        } else if (data.status === 'ok') {
          console.log('[SW-v15] ✓ Server OK — modello:', data.model);
          // Banner successo (sparisce dopo 3s)
          showAPIBanner('✓ Server online — ' + (data.model || ''), '', '#1a6b2a', 3000);
        }
      })
      .catch(function(err) {
        console.warn('[SW-v15] Server non raggiungibile:', err.message);
        showAPIBanner(
          '⚠ Server non raggiungibile',
          'Railway potrebbe essere in cold-start. Riprova tra 30 secondi.',
          '#7f5300'
        );
      });
  }

  var _bannerTimer = null;
  function showAPIBanner(title, subtitle, color, autoHide) {
    var existing = document.querySelector('#sw15-banner');
    if (existing) existing.remove();

    var banner = document.createElement('div');
    banner.id = 'sw15-banner';
    banner.style.cssText = [
      'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);',
      'z-index:999990;',
      'background:' + (color || '#1a1108') + ';',
      'border:1px solid rgba(255,255,255,.2);',
      'border-radius:8px;padding:10px 16px;',
      'min-width:240px;max-width:min(340px,90vw);',
      'text-align:center;',
      'box-shadow:0 4px 20px rgba(0,0,0,.5);',
      'animation:sw15bi .3s ease;',
    ].join('');

    banner.innerHTML =
      '<style>@keyframes sw15bi{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}</style>' +
      '<div style="font-size:12px;font-weight:700;color:#fff;margin-bottom:' + (subtitle ? '3px' : '0') + ';">' + title + '</div>' +
      (subtitle ? '<div style="font-size:11px;color:rgba(255,255,255,.6);line-height:1.4;">' + subtitle + '</div>' : '') +
      '<div onclick="this.parentNode.remove()" style="position:absolute;top:6px;right:8px;color:rgba(255,255,255,.4);cursor:pointer;font-size:14px;">✕</div>';

    document.body.appendChild(banner);

    if (autoHide) {
      clearTimeout(_bannerTimer);
      _bannerTimer = setTimeout(function() {
        if (banner.parentNode) banner.remove();
      }, autoHide);
    }
  }

  /* Migliora il messaggio di errore nel sommelier */
  function patchErrorMessages() {
    // Osserva il div somResult per messaggi di errore
    var observer = new MutationObserver(function() {
      var res = document.querySelector('#somResult');
      if (!res) return;
      var html = res.innerHTML;
      if (html.includes('Verifica la API Key') || html.includes('Errore nella comunicazione')) {
        res.innerHTML =
          '<div style="text-align:center;padding:16px;">' +
          '<div style="font-size:1.2rem;margin-bottom:8px;">⚠️</div>' +
          '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:.9rem;color:#F5EFE2;margin-bottom:6px;">Il sommelier non risponde</div>' +
          '<div style="font-size:12px;color:rgba(245,239,226,.5);line-height:1.6;">' +
          'Il server sta partendo (cold-start ~30s) o la chiave API non è valida.<br>' +
          '<strong style="color:#D4AF37;">Riprova tra 30 secondi.</strong>' +
          '</div>' +
          '<button onclick="doAbbinamento && doAbbinamento()" style="margin-top:12px;padding:8px 20px;background:rgba(212,175,55,.15);border:1px solid rgba(212,175,55,.3);border-radius:6px;color:#D4AF37;font-size:11px;cursor:pointer;">↺ Riprova</button>' +
          '</div>';
      }
    });
    var somPage = document.querySelector('#page-sommelier');
    if (somPage) observer.observe(somPage, { childList: true, subtree: true });
  }


  /* ═══════════════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════════════ */
  function init() {
    console.log('[SW-v15] Patch v15 — Navigation + API diagnostica');

    // Aspetta che showPage sia definito
    var tries = 0;
    var wait = setInterval(function() {
      if (typeof window.showPage === 'function' || ++tries > 30) {
        clearInterval(wait);
        patchNavigation();
        patchErrorMessages();
        // Testa il server dopo 2 secondi
        setTimeout(testAPI, 2000);
      }
    }, 200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
