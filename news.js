/**
 * SOMMELIER WORLD — news.js v24-restored
 * Slideshow notizie full-screen, articoli Sapere del Vino, foto verificate
 */

// ── FOTO VERIFICATE (ID Unsplash confermati come vino/vigne) ──
var VP = {
  glass_red:   'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=900&q=90&fit=crop',
  glass_white: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=90&fit=crop',
  bottles:     'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&q=90&fit=crop',
  vineyard_a:  'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=900&q=90&fit=crop',
  vineyard_b:  'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=900&q=90&fit=crop',
  vineyard_c:  'https://images.unsplash.com/photo-1586370434639-0fe43b2d32e6?w=900&q=90&fit=crop',
  cellar_a:    'https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?w=900&q=90&fit=crop',
  harvest_a:   'https://images.unsplash.com/photo-1596363470302-8d7c62a64c2d?w=900&q=90&fit=crop',
  bubbles_a:   'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=900&q=90&fit=crop',
  sommelier_a: 'https://images.unsplash.com/photo-1574014671294-4b64eb4c68b4?w=900&q=90&fit=crop',
  tasting:     'https://images.unsplash.com/photo-1515779122185-2390ccdf060b?w=900&q=90&fit=crop',
  harvest_b:   'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=900&q=90&fit=crop',
};

var TP = {
  champagne: ['bubbles_a','glass_white','vineyard_a'],
  sommelier: ['sommelier_a','glass_red','tasting'],
  harvest:   ['harvest_a','harvest_b','vineyard_b'],
  cellar:    ['cellar_a','vineyard_c','bottles'],
  red:       ['glass_red','bottles','vineyard_a'],
  white:     ['glass_white','bottles','vineyard_b'],
  vineyard:  ['vineyard_a','vineyard_b','vineyard_c'],
  news:      ['bottles','glass_red','vineyard_c'],
  winery:    ['cellar_a','vineyard_c','bottles'],
  def:       ['vineyard_a','glass_red','cellar_a','vineyard_b','glass_white'],
};

window.getTopicPhoto = function(titolo, categoria, offset) {
  var t = ((titolo || '') + ' ' + (categoria || '')).toLowerCase();
  var seed = Math.floor(Date.now() / 86400000) + (offset || 0);
  var cat = 'def';
  if (t.match(/champagne|bollicin|spumant|prosecco|cava|franciacorta/)) cat = 'champagne';
  else if (t.match(/sommelier|degust|abbinament|calice|servizio|temperatura/)) cat = 'sommelier';
  else if (t.match(/vendemmia|harvest|raccolt|potatur|biodinam/)) cat = 'harvest';
  else if (t.match(/cantina|barrique|barrel|botti|affinament/)) cat = 'cellar';
  else if (t.match(/rosso|nebbiolo|sangiovese|barolo|brunello|amarone|malbec|shiraz/)) cat = 'red';
  else if (t.match(/bianco|riesling|chardonnay|sauvignon|blanc|trebbiano/)) cat = 'white';
  else if (t.match(/vigna|vineyard|terroir|suolo|collin|etna|mosel|santorini/)) cat = 'vineyard';
  else if (t.match(/notizia|mercato|prezzi|asta|award|record|consumo/)) cat = 'news';
  else if (t.match(/produttor|winery|domaine|maison/)) cat = 'winery';
  var keys = TP[cat] || TP.def;
  return VP[keys[seed % keys.length]] || VP.vineyard_a;
};

// ── NOTIZIE HARDCODED (fallback se server non risponde) ──
var NEWS_FALLBACK = [
  {
    titolo_it: 'Il segreto della Mosella: i Riesling più longevi del mondo',
    titolo_en: 'The Mosel Secret: The World\'s Most Age-Worthy Rieslings',
    titolo_fr: 'Le secret de la Moselle : les Rieslings les plus longévifs',
    testo_it: 'Perché i Riesling della Mosella invecchiano 60 anni senza perdere freschezza? Merito dell\'ardesia blu devoniana e dei vigneti "eroici" inclinati fino al 70%. L\'ardesia accumula calore di giorno e lo rilascia di notte: questa escursione termica mantiene l\'acidità brillante, il conservante naturale che sfida il tempo.',
    testo_en: 'The Mosel\'s blue Devonian slate and slopes up to 70% create extreme thermal variation, keeping acidity brilliant for 30-60 years. Egon Müller, JJ Prüm, Clemens Busch: three mythical producers on mythical vineyards.',
    testo_fr: 'L\'ardoise bleue dévonienne de la Moselle et des pentes jusqu\'à 70% créent des variations thermiques extrêmes, maintenant l\'acidité pendant 30-60 ans. Egon Müller, JJ Prüm, Clemens Busch.',
    categoria_it: '🌍 Terroir', categoria_en: '🌍 Terroir', categoria_fr: '🌍 Terroir',
    immagine: '', isNews: true
  },
  {
    titolo_it: 'Champagne 2025: la vendemmia del secolo',
    titolo_en: 'Champagne 2025: The Vintage of the Century',
    titolo_fr: 'Champagne 2025 : le millésime du siècle',
    testo_it: 'La Commissione Champagne ha dichiarato il 2025 "straordinario" per equilibrio tra acidità e concentrazione aromatica. Le riserve raggiunte in molte maison hanno permesso dosaggi inediti, aprendo una nuova era per il Blanc de Blancs.',
    testo_en: 'The Champagne Committee declared 2025 extraordinary for its balance of acidity and aromatic concentration. Record reserves have allowed unprecedented dosages, opening a new era for Blanc de Blancs.',
    testo_fr: 'La Commission Champagne a déclaré 2025 extraordinaire pour l\'équilibre entre acidité et concentration aromatique. Des réserves record ont permis des dosages inédits.',
    categoria_it: '🗞 Wine News', categoria_en: '🗞 Wine News', categoria_fr: '🗞 Wine News',
    immagine: '', isNews: true
  },
  {
    titolo_it: 'Vini vulcanici: dall\'Etna alle Canarie, il sapore della lava',
    titolo_en: 'Volcanic Wines: From Etna to the Canaries, the Taste of Lava',
    titolo_fr: 'Vins volcaniques : de l\'Etna aux Canaries, le goût de la lave',
    testo_it: 'Dall\'Etna alle Canarie via Santorini: i vini nati dalla lava hanno una mineralità salina inconfondibile. La lava è essenzialmente silice e feldspato — minerali che la vite assorbe attraverso radici che scendono fino a 10 metri, garantendo concentrazione e identità irripetibili.',
    testo_en: 'From Etna to the Canaries via Santorini: volcanic wines carry unmistakable mineral, saline character. Lava soils force roots 10 meters deep, guaranteeing concentration and identity impossible to replicate.',
    testo_fr: 'De l\'Etna aux Canaries en passant par Santorin : les vins volcaniques ont une minéralité saline inimitable. Les sols de lave forcent les racines à 10 mètres de profondeur.',
    categoria_it: '🌋 Vulcani', categoria_en: '🌋 Volcanic', categoria_fr: '🌋 Volcanique',
    immagine: '', isNews: false
  },
  {
    titolo_it: 'Temperatura di servizio: il dettaglio che cambia tutto',
    titolo_en: 'Serving Temperature: The Detail That Changes Everything',
    titolo_fr: 'Température de service : le détail qui change tout',
    testo_it: 'Un Barolo a 22°C sembra alcolico e piatto. Lo stesso vino a 16°C è fresco, preciso, con tannini setosi. La temperatura di servizio è il dettaglio più trascurato e più impattante sull\'esperienza del vino. Bianchi strutturati: 10-12°C. Rossi eleganti: 15-17°C. Champagne: 8-10°C.',
    testo_en: 'A Barolo at 22°C seems alcoholic and flat. The same wine at 16°C is fresh and precise, with silky tannins. Serving temperature is the most neglected yet most impactful element of the wine experience.',
    testo_fr: 'Un Barolo à 22°C semble alcooleux et plat. Le même vin à 16°C est frais et précis, avec des tanins soyeux. La température de service est l\'élément le plus négligé de l\'expérience.',
    categoria_it: '🍷 Il Sapere del Vino', categoria_en: '🍷 Wine Knowledge', categoria_fr: '🍷 Savoir du Vin',
    immagine: '', isNews: false
  },
  {
    titolo_it: 'Pinot Nero: il Santo Graal della viticoltura mondiale',
    titolo_en: 'Pinot Noir: The Holy Grail of World Viticulture',
    titolo_fr: 'Pinot Noir : le Saint Graal de la viticulture mondiale',
    testo_it: 'Il Pinot Nero è il vitigno più difficile al mondo. Richiede microclima perfetto e la sua buccia sottile lo espone a ogni capriccio del tempo. Eppure produce i vini più poetici: Romanée-Conti, Chambertin, Musigny. In Borgogna, su calcare kimmeridgiano, ha trovato il suo habitat ideale dopo secoli di selezione monastica.',
    testo_en: 'Pinot Noir is the world\'s most demanding grape. It requires a perfect microclimate. Yet it produces the most poetic wines: Romanée-Conti, Chambertin, Musigny. In Burgundy, on Kimmeridgian limestone, it found its ideal home.',
    testo_fr: 'Le Pinot Noir est le cépage le plus exigeant au monde. Il nécessite un microclimat parfait. Et pourtant, il produit les vins les plus poétiques : Romanée-Conti, Chambertin, Musigny.',
    categoria_it: '🍇 Vitigni', categoria_en: '🍇 Grape Varieties', categoria_fr: '🍇 Cépages',
    immagine: '', isNews: false
  },
];

// Aggiunge foto ai fallback
NEWS_FALLBACK.forEach(function(a, i) {
  if (!a.immagine) a.immagine = getTopicPhoto(a.titolo_it, a.categoria_it, i);
});

// ── STATO SLIDESHOW ──
var _arts = [];
var _sIdx = 0;
var _sTimer = null;

// ── CSS SLIDESHOW FULL-SCREEN ──
(function() {
  var s = document.createElement('style');
  s.textContent = [
    /* Wrapper slideshow */
    '#slArea{position:relative;width:100%;height:260px;overflow:hidden;background:#0d0202;}',
    /* Ogni slide copre tutto */
    '#slArea .sw-slide{',
      'position:absolute;inset:0;',
      'opacity:0;transition:opacity .7s ease;',
      'pointer-events:none;cursor:pointer;',
    '}',
    '#slArea .sw-slide.on{opacity:1;pointer-events:auto;}',
    /* Immagine a tutto schermo */
    '#slArea .sw-slide img{',
      'position:absolute;inset:0;width:100%;height:100%;',
      'object-fit:cover;object-position:center;display:block;',
    '}',
    /* Gradiente overlay */
    '#slArea .sw-slide .sw-overlay{',
      'position:absolute;inset:0;',
      'background:linear-gradient(',
        'to bottom,',
        'rgba(10,7,5,.05) 0%,',
        'rgba(10,7,5,.25) 45%,',
        'rgba(10,7,5,.88) 80%,',
        'rgba(10,7,5,.97) 100%',
      ');',
    '}',
    /* Testo in basso */
    '#slArea .sw-slide .sw-body{',
      'position:absolute;bottom:0;left:0;right:0;',
      'padding:16px 16px 20px;',
    '}',
    '.sw-slide-cat{',
      'font-family:Cinzel,serif;font-size:.44rem;letter-spacing:3px;',
      'color:rgba(191,155,74,.85);font-weight:700;',
      'text-transform:uppercase;margin-bottom:6px;',
    '}',
    '.sw-slide-tit{',
      'font-family:"Playfair Display",Georgia,serif;',
      'font-size:1.12rem;font-weight:700;color:#FFFFFF;',
      'line-height:1.28;text-shadow:0 2px 8px rgba(0,0,0,.7);',
      'margin-bottom:6px;',
    '}',
    '.sw-slide-txt{',
      'font-family:"Cormorant Garamond",Georgia,serif;',
      'font-size:.93rem;line-height:1.65;',
      'color:rgba(245,239,226,.72);',
      'display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;',
    '}',
    /* Dots */
    '#slDots{display:flex;justify-content:center;gap:6px;padding:8px 0 4px;background:#0A0705;}',
    '.news-dot{width:5px;height:5px;border-radius:50%;background:rgba(191,155,74,.18);cursor:pointer;transition:background .25s;border:none;padding:0;}',
    '.news-dot.on{background:rgba(191,155,74,.75);}',
    /* News count label */
    '#newsCnt{font-family:Cinzel,serif;font-size:.46rem;letter-spacing:2px;color:rgba(191,155,74,.45);}',
    /* Cards Sapere del Vino */
    '.al-art{background:rgba(12,6,4,.98);border:1px solid rgba(191,155,74,.1);border-radius:10px;',
      'margin:0 14px 14px;cursor:pointer;overflow:hidden;transition:transform .2s,box-shadow .2s;}',
    '.al-art:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.55);}',
    '.al-art-ph{width:100%;height:140px;display:flex;align-items:center;justify-content:center;font-size:2.8rem;background:rgba(255,255,255,.02);}',
    '.al-art-body{padding:14px 16px 18px;}',
    '.al-art-tag{font-size:8px;font-weight:700;letter-spacing:2px;color:rgba(191,155,74,.7);text-transform:uppercase;margin-bottom:6px;}',
    '.al-art-tit{font-family:"Playfair Display",Georgia,serif;font-size:1.08rem;font-weight:700;color:#FFFFFF;line-height:1.3;margin-bottom:8px;}',
    '.al-art-txt{font-family:"Cormorant Garamond",Georgia,serif;font-size:.98rem;line-height:1.88;color:rgba(245,239,226,.78);}',
    '.al-art-foot{font-size:9px;color:rgba(245,239,226,.35);margin-top:10px;padding-top:8px;border-top:1px solid rgba(191,155,74,.12);}',
    /* Reader */
    '#al-reader{display:none;position:fixed;inset:0;z-index:99999;background:#080503;overflow-y:auto;}',
    '.al-reader-head{position:sticky;top:0;z-index:10;background:rgba(8,5,3,.97);border-bottom:1px solid rgba(191,155,74,.2);padding:12px 16px;display:flex;align-items:center;gap:10px;}',
    '.al-reader-back{background:none;border:1px solid rgba(191,155,74,.3);color:var(--oro,#BF9B4A);font-family:Cinzel,serif;font-size:.56rem;letter-spacing:2px;cursor:pointer;padding:6px 12px;}',
    '.al-reader-content{max-width:680px;margin:0 auto;padding:24px 18px 60px;}',
    '.al-reader-cat{font-family:Cinzel,serif;font-size:.5rem;letter-spacing:4px;color:var(--oro,#BF9B4A);margin-bottom:10px;}',
    '.al-reader-title{font-family:"Playfair Display",Georgia,serif;font-size:clamp(1.4rem,5vw,2.1rem);font-weight:700;color:#F5EFE2;line-height:1.22;margin-bottom:16px;}',
    '.al-reader-img{width:100%;max-height:300px;object-fit:cover;margin-bottom:22px;display:block;}',
    '.al-reader-body{font-family:"Cormorant Garamond",Georgia,serif;font-size:1.1rem;line-height:1.95;color:rgba(245,239,226,.88);}',
    '.al-reader-body p{margin-bottom:20px;}',
  ].join('');
  document.head.appendChild(s);
})();

// ── RENDER FULL-SCREEN SLIDESHOW ──
function renderSlides() {
  var area = document.getElementById('slArea');
  var dotsEl = document.getElementById('slDots');
  var cntEl = document.getElementById('newsCnt');
  if (!area) return;

  var lang = (window.getLang ? getLang() : 'it');
  var arts = _arts.slice(0, 7);
  if (!arts.length) arts = NEWS_FALLBACK.slice(0, 5);

  if (cntEl) cntEl.textContent = arts.length + ' ' + (window.i18n ? i18n.t('newsArticoli') : 'articoli');

  // Ferma timer precedente
  if (_sTimer) { clearInterval(_sTimer); _sTimer = null; }

  // Crea slides
  area.innerHTML = '';
  arts.forEach(function(a, i) {
    var tit = a['titolo_' + lang] || a.titolo || '';
    var txt = a['testo_' + lang] || a.testo || '';
    var cat = a['categoria_' + lang] || a.categoria || '';
    var img = a.immagine || getTopicPhoto(tit, cat, i);

    var sl = document.createElement('div');
    sl.className = 'sw-slide' + (i === 0 ? ' on' : '');

    var imgEl = document.createElement('img');
    imgEl.src = img;
    imgEl.alt = '';
    imgEl.loading = i === 0 ? 'eager' : 'lazy';
    imgEl.onerror = function() { this.style.display = 'none'; };

    var overlay = document.createElement('div');
    overlay.className = 'sw-overlay';

    var body = document.createElement('div');
    body.className = 'sw-body';
    body.innerHTML =
      '<div class="sw-slide-cat">' + cat + '</div>' +
      '<div class="sw-slide-tit">' + tit + '</div>' +
      '<div class="sw-slide-txt">' + txt.substring(0, 130) + '…</div>';

    sl.appendChild(imgEl);
    sl.appendChild(overlay);
    sl.appendChild(body);
    sl.addEventListener('click', (function(art) { return function() { openArticleReader(art); }; })(a));
    area.appendChild(sl);
  });

  // Dots
  if (dotsEl) {
    dotsEl.innerHTML = '';
    arts.forEach(function(_, i) {
      var d = document.createElement('button');
      d.className = 'news-dot' + (i === 0 ? ' on' : '');
      d.setAttribute('aria-label', 'Slide ' + (i + 1));
      d.addEventListener('click', (function(idx) { return function() { goSlide(idx); }; })(i));
      dotsEl.appendChild(d);
    });
  }

  function goSlide(idx) {
    _sIdx = idx;
    var slides = area.querySelectorAll('.sw-slide');
    var dots = dotsEl ? dotsEl.querySelectorAll('.news-dot') : [];
    slides.forEach(function(s, j) {
      s.classList.toggle('on', j === idx);
    });
    dots.forEach(function(d, k) {
      d.classList.toggle('on', k === idx);
    });
  }

  // Auto-avanzamento
  _sIdx = 0;
  if (arts.length > 1) {
    _sTimer = setInterval(function() {
      _sIdx = (_sIdx + 1) % arts.length;
      goSlide(_sIdx);
    }, 5500);
  }

  // Swipe touch
  var _tx = 0;
  area.addEventListener('touchstart', function(e) { _tx = e.touches[0].clientX; }, { passive: true });
  area.addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].clientX - _tx;
    if (Math.abs(dx) > 40) {
      if (_sTimer) { clearInterval(_sTimer); _sTimer = null; }
      _sIdx = dx < 0 ? (_sIdx + 1) % arts.length : (_sIdx - 1 + arts.length) % arts.length;
      goSlide(_sIdx);
      setTimeout(function() {
        if (!_sTimer) _sTimer = setInterval(function() { _sIdx = (_sIdx + 1) % arts.length; goSlide(_sIdx); }, 5500);
      }, 8000);
    }
  }, { passive: true });
}

// ── READER ARTICOLO ──
function openArticleReader(art) {
  var r = document.getElementById('al-reader');
  if (!r) {
    r = document.createElement('div');
    r.id = 'al-reader';
    r.innerHTML =
      '<div class="al-reader-head">' +
        '<button class="al-reader-back" onclick="closeArticleReader()">← INDIETRO</button>' +
        '<span id="readerTag" style="font-family:Cinzel,serif;font-size:.46rem;letter-spacing:3px;color:rgba(191,155,74,.5);"></span>' +
      '</div>' +
      '<div class="al-reader-content">' +
        '<div class="al-reader-cat" id="readerTag2"></div>' +
        '<div class="al-reader-title" id="readerTitle"></div>' +
        '<img class="al-reader-img" id="readerHero" src="" alt="" style="display:none;">' +
        '<div class="al-reader-body" id="readerText"></div>' +
      '</div>';
    document.body.appendChild(r);
  }

  var lang = (window.getLang ? getLang() : 'it');
  var tit = art['titolo_' + lang] || art.titolo || '';
  var txt = art['testo_' + lang] || art.testo || '';
  var cat = art['categoria_' + lang] || art.categoria || '';
  var img = art.immagine || '';

  var tagEl = r.querySelector('#readerTag');
  var tag2El = r.querySelector('#readerTag2');
  var titleEl = r.querySelector('#readerTitle');
  var heroEl = r.querySelector('#readerHero');
  var bodyEl = r.querySelector('#readerText');

  if (tagEl) tagEl.textContent = cat;
  if (tag2El) tag2El.textContent = cat;
  if (titleEl) titleEl.textContent = tit;
  if (bodyEl) bodyEl.innerHTML = txt.split(/\n\n+/).map(function(p) {
    return '<p>' + p.replace(/\n/g, '<br>') + '</p>';
  }).join('');
  if (heroEl) {
    if (img && img.startsWith('http')) { heroEl.src = img; heroEl.style.display = 'block'; }
    else { heroEl.style.display = 'none'; }
  }

  r.style.display = 'block';
  r.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

window.closeArticleReader = function() {
  var r = document.getElementById('al-reader');
  if (r) r.style.display = 'none';
  document.body.style.overflow = '';
};

// Mantieni retrocompatibilità
window.openReader = window.openReader || openArticleReader;

// ── SAPERE DEL VINO ──
function renderSapere(arts) {
  var container = document.getElementById('sapereCards');
  if (!container) return;
  var lang = (window.getLang ? getLang() : 'it');
  var items = arts.filter(function(a) { return !a.isNews; }).slice(0, 3);
  if (!items.length) items = NEWS_FALLBACK.filter(function(a) { return !a.isNews; }).slice(0, 3);
  container.innerHTML = '';
  items.forEach(function(a, i) {
    var tit = a['titolo_' + lang] || a.titolo || '';
    var txt = a['testo_' + lang] || a.testo || '';
    var cat = a['categoria_' + lang] || a.categoria || '';
    var ico = ['🍷', '🌿', '🍇', '🏔', '🍾'][i % 5];

    var card = document.createElement('div');
    card.className = 'al-art';
    card.innerHTML =
      '<div class="al-art-ph">' + ico + '</div>' +
      '<div class="al-art-body">' +
        '<div class="al-art-tag">' + cat + '</div>' +
        '<div class="al-art-tit">' + tit + '</div>' +
        '<div class="al-art-txt">' + txt.substring(0, 240) + '…</div>' +
        '<div class="al-art-foot">' + new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }) + '</div>' +
      '</div>';
    card.addEventListener('click', (function(art) { return function() { openArticleReader(art); }; })(a));
    container.appendChild(card);
  });
}

// ── NEWS PAGE (tab News) ──
window.syncNewsPage = function() {
  var cont = document.getElementById('newsPageList');
  if (!cont) return;
  var lang = (window.getLang ? getLang() : 'it');
  var arts = (_arts && _arts.length) ? _arts : NEWS_FALLBACK;
  window._news_arts = arts;
  cont.innerHTML = arts.map(function(a, i) {
    var tit = a['titolo_' + lang] || a.titolo || '';
    var txt = a['testo_' + lang] || a.testo || '';
    var cat = a['categoria_' + lang] || a.categoria || '';
    var img = a.immagine || getTopicPhoto(tit, cat, i);
    return '<div onclick="openArticleReader(window._news_arts[' + i + '])" ' +
      'style="margin-bottom:16px;border-radius:10px;overflow:hidden;cursor:pointer;border:1px solid rgba(191,155,74,.1);">' +
      '<div style="position:relative;height:185px;">' +
        '<img src="' + img + '" style="width:100%;height:100%;object-fit:cover;display:block;" loading="lazy" alt="">' +
        '<div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(10,7,5,.05) 35%,rgba(10,7,5,.9) 100%);"></div>' +
        '<div style="position:absolute;bottom:0;left:0;right:0;padding:12px 14px;">' +
          '<div style="font-family:Cinzel,serif;font-size:.44rem;letter-spacing:2px;color:rgba(191,155,74,.85);margin-bottom:4px;">' + cat + '</div>' +
          '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:1rem;font-weight:700;color:#fff;line-height:1.25;">' + tit + '</div>' +
        '</div>' +
      '</div>' +
      '<div style="padding:12px 14px;background:rgba(255,255,255,.02);">' +
        '<div style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:.95rem;color:rgba(245,239,226,.6);line-height:1.6;">' + txt.substring(0, 160) + '…</div>' +
      '</div>' +
    '</div>';
  }).join('');
};

// ── CARICA DAL SERVER ──
window.loadServerArts = async function() {
  try {
    var ctrl = new AbortController();
    setTimeout(function() { ctrl.abort(); }, 8000);
    var r = await fetch((window.SRV || 'https://sommelier-server-production-8f92.up.railway.app') + '/api/articles', { signal: ctrl.signal });
    if (!r.ok) return;
    var data = await r.json();
    if (!data || !data.length) return;
    var lang = (window.getLang ? getLang() : 'it');
    data.forEach(function(a, i) {
      a.immagine = getTopicPhoto(a['titolo_' + lang] || a.titolo || '', a['categoria_' + lang] || a.categoria || '', i);
    });
    _arts = data;
    renderSlides();
    renderSapere(data);
    if (typeof syncNewsPage === 'function') syncNewsPage();
    console.log('[SW News] ' + data.length + ' articoli dal server ✓');
  } catch(e) {
    console.log('[SW News] Fallback hardcoded (' + e.message + ')');
  }
};

// ── INIT ──
document.addEventListener('DOMContentLoaded', function() {
  // Render immediato con hardcoded
  renderSlides();
  renderSapere(NEWS_FALLBACK);
  // Poi carica dal server
  setTimeout(loadServerArts, 600);
});
