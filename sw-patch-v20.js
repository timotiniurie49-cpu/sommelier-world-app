/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SOMMELIER WORLD · PATCH v20                                    ║
 * ║                                                                  ║
 * ║  ✓ Carosello articoli — fetch da /api/articles + seed          ║
 * ║  ✓ Article reader — pagina intera con scroll elegante          ║
 * ║  ✓ Elite produttori — card speciale nel carosello              ║
 * ║  ✓ ? Help potenziato — tooltip su tutti i parametri            ║
 * ║  ✓ Admin panel — aggiungi/rimuovi articoli                     ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
(function () {
  'use strict';

  var SERVER = window._SW_SERVER ||
    'https://sommelier-server-production-8f92.up.railway.app';

  var _lang = function() {
    return (window.i18n && window.i18n.current) || localStorage.getItem('sw_lang') || 'it';
  };

  /* ═══════════════════════════════════════════════════════
     CSS
     ═══════════════════════════════════════════════════════ */
  var style = document.createElement('style');
  style.textContent = [

    /* ── Wrapper carosello ── */
    '#sw20-magazine{padding:0 0 8px;}',
    '#sw20-mag-header{',
      'display:flex;align-items:center;justify-content:space-between;',
      'padding:18px 14px 12px;',
    '}',
    '#sw20-mag-header .sw20-mag-title{',
      'font-family:Cinzel,serif;font-size:.6rem;letter-spacing:3px;',
      'color:rgba(212,175,55,.6);text-transform:uppercase;',
    '}',
    '#sw20-mag-header .sw20-mag-count{',
      'font-size:11px;color:rgba(245,239,226,.3);',
    '}',

    /* ── Scroll orizzontale ── */
    '#sw20-carousel{',
      'display:flex;gap:12px;',
      'overflow-x:auto;overflow-y:hidden;',
      'padding:0 14px 12px;',
      'scroll-snap-type:x mandatory;',
      '-webkit-overflow-scrolling:touch;',
      'scrollbar-width:none;',
    '}',
    '#sw20-carousel::-webkit-scrollbar{display:none;}',

    /* ── Card articolo ── */
    '.sw20-card{',
      'flex:0 0 260px;min-width:260px;',
      'scroll-snap-align:start;',
      'border-radius:10px;overflow:hidden;',
      'background:rgba(255,255,255,.04);',
      'border:1px solid rgba(212,175,55,.15);',
      'cursor:pointer;transition:all .22s;',
      'position:relative;',
    '}',
    '.sw20-card:hover{border-color:rgba(212,175,55,.4);transform:translateY(-2px);}',

    /* ── Card Elite produttore ── */
    '.sw20-card.sw20-elite{',
      'border-color:rgba(212,175,55,.45)!important;',
      'background:linear-gradient(160deg,rgba(74,4,4,.3),rgba(212,175,55,.08))!important;',
    '}',
    '.sw20-elite-badge{',
      'position:absolute;top:10px;right:10px;z-index:2;',
      'background:rgba(212,175,55,.9);color:#0A0705;',
      'font-family:Cinzel,serif;font-size:7px;font-weight:700;letter-spacing:2px;',
      'padding:3px 8px;border-radius:2px;text-transform:uppercase;',
    '}',

    /* ── Immagine card ── */
    '.sw20-card-img{',
      'width:100%;height:140px;object-fit:cover;',
      'display:block;background:#1A0A06;',
    '}',
    '.sw20-card-img-placeholder{',
      'width:100%;height:140px;',
      'background:linear-gradient(135deg,rgba(74,4,4,.4),rgba(10,7,5,.8));',
      'display:flex;align-items:center;justify-content:center;',
      'font-size:2rem;',
    '}',

    /* ── Body card ── */
    '.sw20-card-body{padding:12px 13px 14px;}',
    '.sw20-card-cat{',
      'font-size:9px;font-weight:700;letter-spacing:2px;',
      'color:rgba(212,175,55,.55);text-transform:uppercase;margin-bottom:5px;',
    '}',
    '.sw20-card-title{',
      'font-family:\'Playfair Display\',\'IM Fell English\',Georgia,serif;',
      'font-size:.92rem;font-weight:700;color:#F5EFE2;',
      'line-height:1.35;margin-bottom:7px;',
    '}',
    '.sw20-card-meta{',
      'font-size:10px;color:rgba(245,239,226,.3);',
      'display:flex;align-items:center;justify-content:space-between;',
    '}',
    '.sw20-card-ai{',
      'font-size:8px;background:rgba(125,218,138,.15);',
      'color:rgba(125,218,138,.7);padding:2px 6px;border-radius:3px;',
    '}',

    /* ── Reader pagina intera ── */
    '#sw20-reader{',
      'display:none;',
      'position:fixed;inset:0;z-index:999950;',
      'background:#0A0705;overflow-y:auto;',
      '-webkit-overflow-scrolling:touch;',
    '}',
    '#sw20-reader-inner{',
      'max-width:720px;margin:0 auto;',
      'padding:0 0 80px;',
    '}',

    /* ── Header reader ── */
    '#sw20-reader-nav{',
      'position:sticky;top:0;z-index:2;',
      'background:rgba(10,7,5,.97);backdrop-filter:blur(12px);',
      'border-bottom:1px solid rgba(212,175,55,.12);',
      'display:flex;align-items:center;gap:12px;',
      'padding:12px 16px;',
    '}',
    '#sw20-back-btn{',
      'width:36px;height:36px;border-radius:50%;flex-shrink:0;',
      'background:rgba(212,175,55,.1);border:1px solid rgba(212,175,55,.2);',
      'color:#D4AF37;font-size:18px;cursor:pointer;',
      'display:flex;align-items:center;justify-content:center;',
      'transition:all .2s;',
    '}',
    '#sw20-back-btn:hover{background:rgba(212,175,55,.2);}',
    '#sw20-reader-title-small{',
      'font-family:Cinzel,serif;font-size:.65rem;letter-spacing:2px;',
      'color:rgba(212,175,55,.6);text-overflow:ellipsis;',
      'overflow:hidden;white-space:nowrap;flex:1;',
    '}',

    /* ── Hero immagine ── */
    '#sw20-hero-img{',
      'width:100%;height:260px;object-fit:cover;display:block;',
    '}',

    /* ── Corpo articolo ── */
    '#sw20-article-body{padding:28px 20px 0;}',
    '.sw20-art-category{',
      'font-size:9px;font-weight:700;letter-spacing:3px;',
      'color:rgba(212,175,55,.5);text-transform:uppercase;margin-bottom:10px;',
    '}',
    '.sw20-art-h1{',
      'font-family:\'Playfair Display\',\'IM Fell English\',Georgia,serif;',
      'font-size:1.6rem;font-weight:700;line-height:1.25;',
      'color:#F5EFE2;margin-bottom:14px;',
    '}',
    '.sw20-art-meta{',
      'font-size:11px;color:rgba(245,239,226,.35);',
      'margin-bottom:24px;padding-bottom:16px;',
      'border-bottom:1px solid rgba(212,175,55,.12);',
      'display:flex;align-items:center;gap:8px;flex-wrap:wrap;',
    '}',
    '.sw20-art-badge-ai{',
      'background:rgba(125,218,138,.12);color:rgba(125,218,138,.7);',
      'font-size:9px;padding:2px 7px;border-radius:3px;',
    '}',
    '.sw20-art-text{',
      'font-family:\'Cormorant Garamond\',Georgia,serif;',
      'font-size:1.08rem;line-height:2;',
      'color:rgba(245,239,226,.85);',
    '}',
    '.sw20-art-text p{margin:0 0 22px;}',

    /* ── Produttore Elite nel reader ── */
    '#sw20-producer-card{',
      'margin:28px 20px 0;padding:20px;',
      'background:linear-gradient(135deg,rgba(74,4,4,.3),rgba(10,7,5,.9));',
      'border:1px solid rgba(212,175,55,.35);border-radius:10px;',
    '}',
    '#sw20-producer-card .sw20-prod-badge{',
      'display:inline-block;',
      'background:rgba(212,175,55,.15);border:1px solid rgba(212,175,55,.3);',
      'color:#D4AF37;font-size:8px;font-weight:700;letter-spacing:2px;',
      'padding:3px 8px;border-radius:3px;margin-bottom:10px;',
    '}',
    '#sw20-producer-card .sw20-prod-name{',
      'font-family:\'Playfair Display\',Georgia,serif;',
      'font-size:1.1rem;font-weight:700;color:#F5EFE2;margin-bottom:4px;',
    '}',
    '#sw20-producer-card .sw20-prod-region{',
      'font-size:11px;color:rgba(212,175,55,.6);margin-bottom:10px;',
    '}',
    '#sw20-producer-card .sw20-prod-desc{',
      'font-family:\'IM Fell English\',Georgia,serif;font-style:italic;',
      'font-size:.9rem;line-height:1.75;color:rgba(245,239,226,.65);',
    '}',
    '#sw20-producer-card .sw20-prod-link{',
      'display:inline-block;margin-top:12px;',
      'padding:8px 16px;background:rgba(212,175,55,.12);',
      'border:1px solid rgba(212,175,55,.3);border-radius:6px;',
      'color:#D4AF37;font-size:10px;font-weight:700;letter-spacing:2px;',
      'text-decoration:none;cursor:pointer;',
    '}',

    /* ── ? Help potenziato ── */
    '#sw20-help-panel{',
      'position:fixed;inset:0;z-index:999990;',
      'display:flex;align-items:flex-end;justify-content:center;',
      'background:rgba(5,3,1,.78);padding:12px;',
    '}',
    '.sw20-help-box{',
      'background:#1A0A06;',
      'border:1px solid rgba(212,175,55,.35);border-radius:10px 10px 10px 10px;',
      'max-width:500px;width:100%;padding:22px 20px 18px;',
      'box-shadow:0 -8px 40px rgba(0,0,0,.7);',
      'animation:sw20hi .3s ease;',
    '}',
    '@keyframes sw20hi{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}',
    '.sw20-help-title{',
      'font-family:Cinzel,serif;font-size:.75rem;letter-spacing:3px;',
      'color:var(--oro);margin-bottom:12px;',
    '}',
    '.sw20-help-text{',
      'font-family:\'Cormorant Garamond\',Georgia,serif;',
      'font-size:1.02rem;line-height:1.85;color:rgba(245,239,226,.82);',
    '}',
    '.sw20-help-examples{',
      'margin-top:12px;padding-top:10px;',
      'border-top:1px solid rgba(212,175,55,.12);',
      'font-size:11px;color:rgba(212,175,55,.55);line-height:1.8;',
    '}',
    '.sw20-help-close{',
      'position:absolute;top:14px;right:16px;',
      'background:none;border:none;color:rgba(212,175,55,.4);',
      'font-size:20px;cursor:pointer;line-height:1;',
    '}',

    /* ── Admin panel ── */
    '#sw20-admin{',
      'position:fixed;inset:0;z-index:999980;',
      'background:rgba(5,3,1,.95);overflow-y:auto;',
      'padding:20px 16px 60px;display:none;',
    '}',

  ].join('');
  document.head.appendChild(style);


  /* ═══════════════════════════════════════════════════════
     DATI — fetch dal server + seed di fallback locale
     ═══════════════════════════════════════════════════════ */
  var _articles  = [];
  var _producers = []; // produttori Elite

  /* Carica articoli dal server */
  async function fetchArticles() {
    try {
      var r = await fetch(SERVER + '/api/articles');
      if (r.ok) {
        _articles = await r.json();
        console.log('[SW-v20] Articoli caricati dal server:', _articles.length);
      }
    } catch(e) {
      console.warn('[SW-v20] Server non raggiungibile, uso articoli statici');
      // Fallback: legge articles.json dal sito
      try {
        var r2 = await fetch('./articles.json');
        if (r2.ok) {
          var data = await r2.json();
          // Compatibilità con vecchio formato articles.json
          _articles = data.map(function(a) {
            return {
              id: 'local-' + a.id,
              type: 'editorial',
              titolo_it: (a.it || {}).titolo || a.titolo || '',
              titolo_en: (a.en || {}).titolo || a.titolo || '',
              titolo_fr: (a.fr || {}).titolo || a.titolo || '',
              categoria_it: (a.it || {}).categoria || 'Magazine',
              categoria_en: (a.en || {}).categoria || 'Magazine',
              categoria_fr: (a.fr || {}).categoria || 'Magazine',
              testo_it: (a.it || {}).testo || '',
              testo_en: (a.en || {}).testo || '',
              testo_fr: (a.fr || {}).testo || '',
              immagine: a.immagine || '',
              autore: a.autore || '',
              data: a.data || '',
              generato_ai: false,
            };
          });
        }
      } catch(e2) {}
    }

    // Aggiungi articoli produttori Elite
    injectEliteProducerArticles();
    renderCarousel();
  }

  /* Inietta articoli speciali per i produttori Elite */
  function injectEliteProducerArticles() {
    // Legge i produttori Elite dal localStorage (salvati dal form)
    try {
      var prods = JSON.parse(localStorage.getItem('sw_elite_producers') || '[]');
      prods.forEach(function(p) {
        if (!p.nome || !p.descrizione) return;
        var existing = _articles.find(function(a) { return a.id === 'elite-' + p.id; });
        if (existing) return;
        _articles.unshift({
          id: 'elite-' + (p.id || Date.now()),
          type: 'producer',
          isElite: true,
          titolo_it: 'Cantina in Evidenza: ' + p.nome,
          titolo_en: 'Featured Winery: ' + p.nome,
          titolo_fr: 'Domaine en Vedette : ' + p.nome,
          categoria_it: '👑 Produttore Elite',
          categoria_en: '👑 Elite Producer',
          categoria_fr: '👑 Producteur Elite',
          testo_it: p.descrizione,
          testo_en: p.descrizione_en || p.descrizione,
          testo_fr: p.descrizione_fr || p.descrizione,
          immagine: p.immagine || '',
          autore: p.nome,
          data: p.data || '',
          producer: p,
          generato_ai: false,
        });
      });
    } catch(e) {}
  }


  /* ═══════════════════════════════════════════════════════
     CAROSELLO
     ═══════════════════════════════════════════════════════ */
  function getLangFields(art) {
    var l = _lang();
    return {
      titolo:    art['titolo_' + l]    || art.titolo_it    || '',
      categoria: art['categoria_' + l] || art.categoria_it || 'Magazine',
      testo:     art['testo_' + l]     || art.testo_it     || '',
    };
  }

  function renderCarousel() {
    var container = document.querySelector('#sw20-carousel');
    if (!container) return;
    container.innerHTML = '';

    if (!_articles.length) {
      container.innerHTML = '<div style="padding:20px;color:rgba(245,239,226,.3);font-size:13px;font-style:italic;">Caricamento articoli…</div>';
      return;
    }

    var countEl = document.querySelector('#sw20-mag-count');
    if (countEl) countEl.textContent = _articles.length + ' articoli';

    _articles.forEach(function(art) {
      var f = getLangFields(art);
      var card = document.createElement('div');
      card.className = 'sw20-card' + (art.isElite ? ' sw20-elite' : '');

      var imgHTML = art.immagine
        ? '<img class="sw20-card-img" src="' + art.immagine + '" loading="lazy" alt="" onerror="this.style.display=\'none\'">'
        : '<div class="sw20-card-img-placeholder">🍷</div>';

      card.innerHTML =
        (art.isElite ? '<div class="sw20-elite-badge">👑 ELITE</div>' : '') +
        imgHTML +
        '<div class="sw20-card-body">' +
          '<div class="sw20-card-cat">' + f.categoria + '</div>' +
          '<div class="sw20-card-title">' + (f.titolo || '—') + '</div>' +
          '<div class="sw20-card-meta">' +
            '<span>' + (art.data || '') + (art.autore ? ' · ' + art.autore : '') + '</span>' +
            (art.generato_ai ? '<span class="sw20-card-ai">✦ AI</span>' : '') +
          '</div>' +
        '</div>';

      card.addEventListener('click', function() { openReader(art); });
      container.appendChild(card);
    });
  }


  /* ═══════════════════════════════════════════════════════
     READER PAGINA INTERA
     ═══════════════════════════════════════════════════════ */
  function createReader() {
    if (document.querySelector('#sw20-reader')) return;

    var reader = document.createElement('div');
    reader.id = 'sw20-reader';
    reader.innerHTML =
      '<div id="sw20-reader-inner">' +
        '<nav id="sw20-reader-nav">' +
          '<button id="sw20-back-btn" onclick="SW20.closeReader()">←</button>' +
          '<div id="sw20-reader-title-small"></div>' +
        '</nav>' +
        '<img id="sw20-hero-img" src="" alt="" onerror="this.style.display=\'none\'">' +
        '<div id="sw20-article-body">' +
          '<div class="sw20-art-category" id="sw20-art-cat"></div>' +
          '<h1 class="sw20-art-h1" id="sw20-art-title"></h1>' +
          '<div class="sw20-art-meta" id="sw20-art-meta"></div>' +
          '<div class="sw20-art-text" id="sw20-art-text"></div>' +
        '</div>' +
        '<!-- Produttore Elite -->' +
        '<div id="sw20-producer-card" style="display:none;"></div>' +
        '<!-- FAQ / Curiosità -->' +
        '<div id="sw20-art-faq"></div>' +
      '</div>';

    document.body.appendChild(reader);
  }

  function openReader(art) {
    createReader();
    var f = getLangFields(art);
    var l = _lang();

    document.getElementById('sw20-hero-img').src          = art.immagine || '';
    document.getElementById('sw20-hero-img').style.display= art.immagine ? 'block' : 'none';
    document.getElementById('sw20-art-cat').textContent   = f.categoria;
    document.getElementById('sw20-art-title').textContent = f.titolo;
    document.getElementById('sw20-reader-title-small').textContent = f.titolo;

    /* Meta */
    var meta = document.getElementById('sw20-art-meta');
    meta.innerHTML =
      '<span>' + (art.data || '') + '</span>' +
      (art.autore ? '<span>·</span><span>' + art.autore + '</span>' : '') +
      (art.generato_ai ? '<span class="sw20-art-badge-ai">✦ Generato da AI</span>' : '');

    /* Testo — paragrafi separati da riga vuota */
    var textEl = document.getElementById('sw20-art-text');
    textEl.innerHTML = '';
    var paras = (f.testo || '').split(/\n\n+/);
    paras.forEach(function(p) {
      if (!p.trim()) return;
      var el = document.createElement('p');
      el.textContent = p.trim();
      textEl.appendChild(el);
    });

    /* Scheda produttore Elite */
    var prodCard = document.getElementById('sw20-producer-card');
    if (art.type === 'producer' && art.producer) {
      var p = art.producer;
      prodCard.style.display = 'block';
      prodCard.innerHTML =
        '<div class="sw20-prod-badge">👑 PRODUTTORE ELITE</div>' +
        '<div class="sw20-prod-name">' + (p.nome || '') + '</div>' +
        '<div class="sw20-prod-region">' + (p.denominazione || p.regione || '') + '</div>' +
        '<div class="sw20-prod-desc">' + (p.descrizione || '') + '</div>' +
        (p.sito ? '<a class="sw20-prod-link" href="' + p.sito + '" target="_blank">🌐 Visita il sito →</a>' : '') +
        (p.shop ? '<a class="sw20-prod-link" href="' + p.shop + '" target="_blank" style="margin-left:8px;">🛒 Shop online →</a>' : '');
    } else {
      prodCard.style.display = 'none';
    }

    /* FAQ/Curiosità (sezione ? per articolo) */
    renderArticleFAQ(art, l);

    /* Apri */
    var reader = document.getElementById('sw20-reader');
    reader.style.display = 'block';
    reader.scrollTop = 0;
    document.body.style.overflow = 'hidden';

    // Gestione tasto back
    try { history.pushState({ swReader: true }, ''); } catch(e) {}
  }

  function closeReader() {
    var reader = document.getElementById('sw20-reader');
    if (reader) { reader.style.display = 'none'; }
    document.body.style.overflow = '';
  }

  /* Chiudi con tasto back del browser */
  window.addEventListener('popstate', function(e) {
    var reader = document.getElementById('sw20-reader');
    if (reader && reader.style.display !== 'none') {
      closeReader();
    }
  });


  /* ═══════════════════════════════════════════════════════
     FAQ / CURIOSITÀ NELL'ARTICOLO (sezione ?)
     ═══════════════════════════════════════════════════════ */
  var FAQ_MAP = {
    'Annate':    [
      '❓ Come si capisce se un\'annata è buona?',
      '✅ L\'annata dipende da tre fattori: primavera senza gelate tardive, estate calda ma non torrida, autunno asciutto con escursioni termiche. Una sola settimana di pioggia a settembre può rovinare un\'annata che sembrava perfetta.',
    ],
    'Vitigni': [
      '❓ Cosa significa "vitigno autoctono"?',
      '✅ Un vitigno autoctono è originario di quel territorio e non si trova (o quasi non si trova) altrove. Il Nebbiolo nasce nelle Langhe, il Sangiovese in Toscana, il Nerello Mascalese sull\'Etna: impossibili da copiare altrove nello stesso modo.',
    ],
    'Tecnica': [
      '❓ A che temperatura si serve il vino rosso?',
      '✅ Contrariamente alla credenza popolare, "temperatura ambiente" nell\'era del riscaldamento centralizzato è spesso troppo alta. I rossi strutturati come il Barolo vanno serviti a 16-18°C; i rossi leggeri (Beaujolais, Pinot Nero) a 14-15°C.',
    ],
    'Terroir': [
      '❓ Cos\'è esattamente il terroir?',
      '✅ Il terroir è l\'insieme di suolo, sottosuolo, microclima, topografia e intervento umano che rende un vino irriproducibile altrove. Non è solo il suolo: due vigneti a 200 metri di distanza sullo stesso suolo possono dare vini completamente diversi.',
    ],
    'Abbinamenti': [
      '❓ Perché il vino bianco con il pesce?',
      '✅ Non è una regola assoluta: è che i tannini dei vini rossi interagiscono con i grassi del pesce creando una sensazione metallica sgradevole. Ma un Pinot Nero leggero con un salmone, o un Etna Rosso con i frutti di mare, funzionano benissimo.',
    ],
  };

  function renderArticleFAQ(art, l) {
    var faqEl = document.getElementById('sw20-art-faq');
    if (!faqEl) return;
    faqEl.innerHTML = '';

    var cat = art.categoria_it || '';
    var catKey = Object.keys(FAQ_MAP).find(function(k) { return cat.includes(k); });
    if (!catKey) { catKey = Object.keys(FAQ_MAP)[Math.floor(Math.random() * Object.keys(FAQ_MAP).length)]; }

    var faq = FAQ_MAP[catKey];
    if (!faq) return;

    faqEl.style.cssText = 'margin:28px 20px 0;padding:16px;background:rgba(212,175,55,.05);border-left:3px solid rgba(212,175,55,.3);border-radius:0 8px 8px 0;';
    faqEl.innerHTML =
      '<div style="font-family:Cinzel,serif;font-size:.55rem;letter-spacing:2px;color:rgba(212,175,55,.5);margin-bottom:8px;">✦ DA SAPERE</div>' +
      '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:.9rem;font-weight:700;color:#F5EFE2;margin-bottom:6px;">' + faq[0] + '</div>' +
      '<div style="font-family:\'Cormorant Garamond\',Georgia,serif;font-style:italic;font-size:.9rem;line-height:1.75;color:rgba(245,239,226,.65);">' + faq[1] + '</div>';
  }


  /* ═══════════════════════════════════════════════════════
     ? HELP POTENZIATO
     Sostituisce showParamHelp con versione migliorata
     ═══════════════════════════════════════════════════════ */
  var HELP_DATA = {
    'ACIDITÀ': {
      testo: 'L\'acidità è la "spina dorsale" del vino. Un vino ad alta acidità ti lascia una sensazione fresca e salivante, come mordere un limone. L\'acidità alta conserva il vino nel tempo e lo rende ottimo a tavola.',
      esempi: '🍋 Alta acidità: Riesling, Barolo, Champagne, Chablis\n🍑 Bassa acidità: Merlot, Viognier, vini del Sud caldi',
    },
    'MORBIDEZZA': {
      testo: 'La morbidezza indica quanto il vino è "rotondo" in bocca. Un vino molto morbido non ha spigoli — è avvolgente, quasi cremoso. I tannini bassi e l\'alcol contribuiscono alla morbidezza.',
      esempi: '🧸 Morbido: Merlot, Pinot Nero, Amarone maturo, Chardonnay barricato\n⚡ Poco morbido: Barolo giovane, Sagrantino, Nebbiolo',
    },
    'SAPIDITÀ': {
      testo: 'La sapidità è la "mineralità" del vino — quella sensazione quasi salata o di pietra bagnata. Un vino sapido è dissetante, vivo, territoriale. Dipende dal suolo: viti su roccia vulcanica danno vini molto sapidi.',
      esempi: '🧂 Molto sapido: Vermentino sardo, Assyrtiko di Santorini, Chablis, Muscadet\n🌸 Poco sapido: Gewurztraminer, Viognier, Moscato',
    },
    'STRUTTURA': {
      testo: 'La struttura è il "peso" del vino in bocca. Un vino leggero è delicato, scorrevole. Un vino pieno e concentrato riempie la bocca, ha tannini evidenti e alcol percettibile.',
      esempi: '🏋️ Pieno: Amarone, Barolo, Châteauneuf-du-Pape, Zinfandel\n🕊️ Leggero: Pinot Grigio, Beaujolais, Vinho Verde',
    },
  };

  window.showParamHelp = function(param, text) {
    /* Rimuovi panel precedente */
    var ex = document.getElementById('sw20-help-panel');
    if (ex) ex.remove();
    var ex2 = document.getElementById('paramHelpPanel');
    if (ex2) ex2.remove();

    var data = HELP_DATA[param] || { testo: text, esempi: '' };

    var panel = document.createElement('div');
    panel.id = 'sw20-help-panel';
    panel.addEventListener('click', function(e) {
      if (e.target === panel) panel.remove();
    });

    panel.innerHTML =
      '<div class="sw20-help-box" style="position:relative;">' +
        '<button class="sw20-help-close" onclick="document.getElementById(\'sw20-help-panel\').remove()">✕</button>' +
        '<div class="sw20-help-title">🍷 ' + param + '</div>' +
        '<div class="sw20-help-text">' + data.testo + '</div>' +
        (data.esempi ? '<div class="sw20-help-examples">' + data.esempi.replace(/\n/g, '<br>') + '</div>' : '') +
      '</div>';

    document.body.appendChild(panel);
  };


  /* ═══════════════════════════════════════════════════════
     ADMIN PANEL — aggiungi/rimuovi articoli
     Accessibile via URL ?admin=1
     ═══════════════════════════════════════════════════════ */
  function showAdminPanel() {
    var admin = document.querySelector('#sw20-admin');
    if (admin) { admin.style.display = 'block'; return; }

    admin = document.createElement('div');
    admin.id = 'sw20-admin';
    admin.style.display = 'block';

    function refreshList() {
      var list = admin.querySelector('#sw20-admin-list');
      if (!list) return;
      list.innerHTML = _articles.map(function(a) {
        return '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(212,175,55,.1);">' +
          '<div>' +
            '<div style="font-size:.75rem;color:#F5EFE2;">' + (a.titolo_it || '') + '</div>' +
            '<div style="font-size:10px;color:rgba(212,175,55,.4);">' + a.id + ' · ' + a.data + (a.generato_ai ? ' · AI' : '') + '</div>' +
          '</div>' +
          '<button onclick="SW20.adminDelete(\'' + a.id + '\')" style="background:rgba(220,50,50,.2);border:1px solid rgba(220,50,50,.3);color:#f77;padding:4px 10px;font-size:11px;cursor:pointer;border-radius:4px;">Rimuovi</button>' +
        '</div>';
      }).join('');
    }

    admin.innerHTML =
      '<div style="max-width:600px;margin:0 auto;">' +
        '<div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">' +
          '<button onclick="SW20.closeAdmin()" style="background:rgba(212,175,55,.1);border:1px solid rgba(212,175,55,.2);color:#D4AF37;padding:6px 14px;cursor:pointer;border-radius:6px;">← Torna al sito</button>' +
          '<div style="font-family:Cinzel,serif;font-size:.7rem;letter-spacing:3px;color:rgba(212,175,55,.6);">ADMIN ARTICOLI</div>' +
        '</div>' +

        /* Genera AI */
        '<div style="padding:14px;background:rgba(125,218,138,.08);border:1px solid rgba(125,218,138,.2);border-radius:8px;margin-bottom:16px;">' +
          '<div style="font-size:.65rem;letter-spacing:2px;color:rgba(125,218,138,.6);margin-bottom:8px;">✦ GENERA ARTICOLO AI</div>' +
          '<input id="sw20-admin-secret" type="password" placeholder="Admin secret (vedi Railway → ADMIN_SECRET)" style="width:100%;box-sizing:border-box;padding:8px 10px;background:rgba(255,255,255,.05);border:1px solid rgba(212,175,55,.2);border-radius:6px;color:#F5EFE2;font-size:13px;margin-bottom:8px;">' +
          '<button onclick="SW20.adminGenerate()" style="width:100%;padding:9px;background:rgba(125,218,138,.15);border:1px solid rgba(125,218,138,.3);color:rgba(125,218,138,.9);font-size:11px;font-weight:700;letter-spacing:2px;cursor:pointer;border-radius:6px;">✦ GENERA ORA</button>' +
          '<div id="sw20-admin-gen-status" style="font-size:11px;color:rgba(245,239,226,.4);margin-top:6px;text-align:center;"></div>' +
        '</div>' +

        /* Lista articoli */
        '<div style="font-size:.6rem;letter-spacing:2px;color:rgba(212,175,55,.4);margin-bottom:8px;">ARTICOLI ATTUALI</div>' +
        '<div id="sw20-admin-list"></div>' +
      '</div>';

    document.body.appendChild(admin);
    refreshList();

    /* Aggiorna la lista dopo delete */
    admin._refresh = refreshList;
  }

  async function adminGenerate() {
    var secret = (document.getElementById('sw20-admin-secret') || {}).value || '';
    var status = document.getElementById('sw20-admin-gen-status');
    if (status) status.textContent = '⏳ Generazione in corso…';
    try {
      var r = await fetch(SERVER + '/api/articles/generate', {
        method: 'POST',
        headers: { 'x-admin-secret': secret }
      });
      var data = await r.json();
      if (r.ok && data.ok) {
        _articles.unshift(data.article);
        renderCarousel();
        var adm = document.querySelector('#sw20-admin');
        if (adm && adm._refresh) adm._refresh();
        if (status) status.textContent = '✓ Articolo generato: ' + data.article.titolo_it;
      } else {
        if (status) status.textContent = '✗ ' + (data.error || 'Errore');
      }
    } catch(e) {
      if (status) status.textContent = '✗ ' + e.message;
    }
  }

  async function adminDelete(id) {
    if (!confirm('Rimuovere "' + id + '"?')) return;
    var secret = (document.getElementById('sw20-admin-secret') || {}).value || '';
    try {
      var r = await fetch(SERVER + '/api/articles/' + id, {
        method: 'DELETE',
        headers: { 'x-admin-secret': secret }
      });
      if (r.ok) {
        _articles = _articles.filter(function(a) { return a.id !== id; });
        renderCarousel();
        var adm = document.querySelector('#sw20-admin');
        if (adm && adm._refresh) adm._refresh();
      }
    } catch(e) { alert('Errore: ' + e.message); }
  }


  /* ═══════════════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════════════ */
  function injectMagazineSection() {
    /* Cerca il blog di sw12 per sostituirlo o affiancarlo */
    var blogEl = document.querySelector('#sw12-blog');
    if (!blogEl) {
      /* Crea la sezione nel corpo della home */
      var homeBody = document.querySelector('.home-body');
      if (!homeBody) return;

      var mag = document.createElement('div');
      mag.id = 'sw20-magazine';
      mag.innerHTML =
        '<div id="sw20-mag-header">' +
          '<div class="sw20-mag-title">✍️ Magazine</div>' +
          '<div id="sw20-mag-count" class="sw20-mag-count">…</div>' +
        '</div>' +
        '<div id="sw20-carousel"></div>';

      homeBody.appendChild(mag);
    } else {
      /* Sostituisce il blog esistente con il carosello */
      blogEl.id = 'sw20-magazine-wrapper';
      var header = blogEl.querySelector('.sw12-blog-title')?.closest('div');
      if (header) {
        var newHeader = document.createElement('div');
        newHeader.id = 'sw20-mag-header';
        newHeader.innerHTML =
          '<div class="sw20-mag-title">✍️ Magazine</div>' +
          '<div id="sw20-mag-count" class="sw20-mag-count">…</div>';
        header.parentNode.insertBefore(newHeader, header);
        header.style.display = 'none';
      }
      var carousel = document.createElement('div');
      carousel.id = 'sw20-carousel';
      blogEl.appendChild(carousel);
    }
  }

  function init() {
    console.log('[SW-v20] Magazine Carosello + Reader + ? Help potenziato');

    /* Sezione magazine nella home */
    injectMagazineSection();

    /* Carica articoli */
    fetchArticles();

    /* URL ?admin=1 → mostra admin panel */
    if (window.location.search.includes('admin=1')) {
      setTimeout(showAdminPanel, 1000);
    }

    /* Rirender quando cambia lingua */
    var _origSetLang = window.i18n?.setLang?.bind(window.i18n);
    if (_origSetLang) {
      window.i18n.setLang = function(lang) {
        _origSetLang(lang);
        setTimeout(renderCarousel, 150);
      };
    }
  }

  /* API pubblica */
  window.SW20 = {
    closeReader:   closeReader,
    openReader:    openReader,
    showAdmin:     showAdminPanel,
    closeAdmin:    function() { var a = document.querySelector('#sw20-admin'); if(a) a.style.display='none'; },
    adminGenerate: adminGenerate,
    adminDelete:   adminDelete,
    refresh:       fetchArticles,
  };

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();

})();
