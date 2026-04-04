/**
 * SOMMELIER WORLD · PATCH v15 — Navigazione Back
 *
 * Problema: premendo Back sul browser si usciva dal sito.
 * Soluzione: usa l'History API per registrare ogni cambio di pagina.
 *   - Back del browser → torna alla pagina precedente DENTRO il sito
 *   - Funziona su iOS Safari, Android Chrome, desktop
 */
(function () {
  'use strict';

  var _ready = false;

  function init() {
    if (_ready) return;

    // Aspetta che showPage esista
    if (typeof window.showPage !== 'function') {
      setTimeout(init, 200);
      return;
    }

    _ready = true;

    /* 1. Salva la pagina iniziale nello stack del browser */
    var startPage = 'home';
    var activePage = document.querySelector('.page.active');
    if (activePage) {
      startPage = activePage.id.replace('page-', '');
    }
    // Sostituisce lo stato corrente (senza aggiungere un record vuoto)
    history.replaceState({ page: startPage }, '', '#' + startPage);

    /* 2. Intercetta showPage per registrare ogni navigazione */
    var _origShowPage = window.showPage;
    window.showPage = function (pageId) {
      _origShowPage(pageId);
      // Aggiunge un record nella cronologia del browser
      history.pushState({ page: pageId }, '', '#' + pageId);
    };

    /* 3. Intercetta il click sulle tab nav (data-page) */
    document.querySelectorAll('.ntab[data-page]').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var page = tab.dataset.page;
        if (page) window.showPage(page);
      });
    });

    /* 4. Ascolta il pulsante Back / Forward del browser */
    window.addEventListener('popstate', function (e) {
      var state = e.state;
      var pageId = (state && state.page) ? state.page : 'home';

      // Chiudi eventuali modali aperti
      ['#sw11-contact-page', '#sw12-art-modal', '#sw-wiz', '#sw-fp',
       '#articleReader', '#drawer']
        .forEach(function (sel) {
          var el = document.querySelector(sel);
          if (el) el.style.display = 'none';
        });
      document.body.style.overflow = '';

      // Naviga alla pagina richiesta SENZA aggiungere un nuovo record
      // (usiamo la funzione originale per evitare loop)
      _origShowPage(pageId);

      // Aggiorna la tab attiva nel nav
      document.querySelectorAll('.ntab').forEach(function (t) {
        t.classList.toggle('active', t.dataset.page === pageId);
      });
    });

    /* 5. Se l'URL contiene già un hash (#explore ecc.) naviga lì */
    var hash = window.location.hash.replace('#', '');
    var validPages = ['home', 'events', 'explore', 'compare',
                      'sommelier', 'producers', 'admin'];
    if (hash && validPages.includes(hash)) {
      _origShowPage(hash);
      document.querySelectorAll('.ntab').forEach(function (t) {
        t.classList.toggle('active', t.dataset.page === hash);
      });
    }

    console.log('[SW-v15] Navigazione Back attiva ✓');
  }

  /* Avvia quando il DOM è pronto */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
