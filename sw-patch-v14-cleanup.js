/**
 * SOMMELIER WORLD · PATCH v14 — Cleanup
 *
 * ✓ Nasconde i vecchi piani produttori (€19/€49/€99) — rimangono solo i nuovi (€0/€15/€50)
 * ✓ Nasconde gli articoli duplicati sotto la newsletter in homepage
 * ✓ Nasconde la lista produttori registrati vuota
 */
(function () {

  var CSS = [
    /* ── Vecchi piani produttori (BASIC €19, PREMIUM €49, ELITE €99) ── */
    '#pkgCard_basic, #pkgCard_premium, #pkgCard_elite,',
    '#procediProdBtn, #pkgPageHint,',
    /* Header "SCEGLI IL PACCHETTO" vecchio */
    '#page-producers > div:nth-child(2) > div:first-child,',
    /* Lista produttori registrati vuota */
    '#allProdsContainer,',
    /* ── Articoli sw12 sotto la newsletter in home ── */
    /* Li sposta sopra: li nascondiamo qui e basta */
    '#sw12-blog',
    '{ display: none !important; }'
  ].join('\n');

  var style = document.createElement('style');
  style.id = 'sw14-cleanup';
  style.textContent = CSS;
  document.head.appendChild(style);

  /* Sposta gli articoli SOPRA la newsletter invece di nasconderli
     (opzionale — decommentare se preferisci tenerli visibili prima della newsletter) */
  /*
  function moveBlogAboveNewsletter() {
    var blog = document.querySelector('#sw12-blog');
    var nl   = document.querySelector('#sw13-newsletter');
    if (blog && nl && nl.parentNode) {
      nl.parentNode.insertBefore(blog, nl);
      blog.style.display = '';
    }
  }
  setTimeout(moveBlogAboveNewsletter, 1000);
  */

  console.log('[SW-v14] Cleanup applicato ✓');

})();
