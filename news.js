/* news.js v30-2026-05-09 */
console.log('%c news.js v30-2026-05-09 ✅ — FORCE REFRESH ','background:#1a0a05;color:#87CEEB;padding:2px 6px;');
/**
 * SOMMELIER WORLD — news.js v29
 * ─────────────────────────────────────────────────────────────
 * LA GAZZETTA DEL SOMMELIER — il quotidiano del vino.
 * 30 articoli ruotano ogni giorno per sembrare sempre freschi.
 * Foto: solo ID Unsplash verificati al 100% — vigne, cantine, vendemmia.
 * ─────────────────────────────────────────────────────────────
 */

// ═══════════════════════════════════════════════════════════
// IMMAGINI REALI — professional wine images from public sources
// ═══════════════════════════════════════════════════════════

window._EDITORIAL_IMAGE_BANK = {
  default: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1600&q=80'
  ],
  vineyard: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1600&q=80'
  ],
  bottle: [
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=1600&q=80'
  ],
  cellar: [
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1600&q=80'
  ],
  service: [
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1600&q=80'
  ],
  tools: [
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=1600&q=80'
  ],
  sparkling: [
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=1600&q=80'
  ]
};

window._buildUnsplashTopicImage = function(queries, offset) {
  var text = (Array.isArray(queries) ? queries.join(' ') : String(queries || '')).toLowerCase();
  var group = 'default';
  if(/corkscrew|cavatappi|ah-so|opener|sommelier knife/.test(text)) group = 'tools';
  else if(/sommelier|service|glass|decanter|tasting|calice/.test(text)) group = 'service';
  else if(/bottle|bottiglia|label|etichetta|barolo bottle/.test(text)) group = 'bottle';
  else if(/cellar|cantina|barrique|oak barrels|botti/.test(text)) group = 'cellar';
  else if(/champagne|franciacorta|sparkling|spumant|prosecco|cava/.test(text)) group = 'sparkling';
  else if(/vineyard|vigna|terroir|hills|langhe|burgundy|montalcino|estate/.test(text)) group = 'vineyard';
  var list = (window._EDITORIAL_IMAGE_BANK[group] || window._EDITORIAL_IMAGE_BANK.default || []).filter(Boolean);
  if(!list.length) return '';
  var seed = window._daySeed ? window._daySeed() : Math.floor(Date.now()/86400000);
  var idx = Math.abs(seed + (offset || 0)) % list.length;
  return list[idx];
};

/* Restituisce un URL immagine contestuale al tema, non una foto vino generica */
window.getArticleImage = function(text, offset) {
  var t = String(text || '').toLowerCase();
  var keywords = '';
  var selected = [
    'vineyard wine estate hills',
    'burgundy vineyard rows',
    'langhe vineyard italy'
  ];

  if(/moscato|muscat/.test(t)) keywords = 'moscato white grape cluster italy';
  if(/nebbiolo|barolo|barbaresco/.test(t)) keywords = 'nebbiolo red grape langhe piedmont';
  if(/radici|roots|old vine|vecchie viti/.test(t)) keywords = 'old grapevine roots soil ancient';
  if(/foglie|leaves|germoglio/.test(t)) keywords = 'grapevine green leaves spring vineyard';
  if(/calice|bicchiere|glass/.test(t)) keywords = 'wine glass crystal elegant tasting';
  if(/flute|champagne glass/.test(t)) keywords = 'champagne flute glass sparkling';
  if(/anfora|kvevri|georgiano/.test(t)) keywords = 'clay amphora wine ancient georgia';
  if(/barrique|rovere|oak/.test(t)) keywords = 'oak barrique barrel wine aging';
  if(/tappo|sughero|cork/.test(t)) keywords = 'wine cork natural oak closeup';
  if(/etichetta|label/.test(t)) keywords = 'wine bottle label elegant closeup';
  if(/sommelier|degust/.test(t)) keywords = 'sommelier wine tasting professional';
  if(/vendemmia|harvest/.test(t)) keywords = 'grape harvest workers vineyard autumn';
  if(keywords) return 'https://source.unsplash.com/featured/1600x900/?' + encodeURIComponent(keywords) + '&sig=' + Date.now();

  if(/clos vougeot|clos de vougeot|vougeot|burgundy grand cru|bourgogne/.test(t)) {
    selected = [
      'clos vougeot vineyard burgundy france',
      'vougeot burgundy vineyard rows',
      'bourgogne vineyard grand cru'
    ];
  } else if(/barolo|langhe|la morra|serralunga|monforte|nebbiolo/.test(t)) {
    selected = [
      'barolo vineyard langhe piemonte',
      'langhe hills vineyard italy',
      'barolo bottle vineyard'
    ];
  } else if(/brunello|montalcino|sangiovese grosso/.test(t)) {
    selected = [
      'brunello montalcino vineyard tuscany',
      'montalcino tuscany vines',
      'tuscany vineyard cypress wine'
    ];
  } else if(/decanter|decantering|caraffa|caraffa da vino/.test(t)) {
    selected = [
      'wine decanter red wine glass',
      'decanter wine elegant table',
      'wine service decanter sommelier'
    ];
  } else if(/cavatappi|corkscrew|sommelier knife|ah-so|lever corkscrew|winged corkscrew/.test(t)) {
    selected = [
      'sommelier knife corkscrew wine opener',
      'lever corkscrew bottle opener',
      'winged corkscrew wine opener'
    ];
  } else if(/temperatura di servizio|servizio del vino|ice bucket|secchiello/.test(t)) {
    selected = [
      'wine bottle ice bucket service',
      'sommelier wine service table',
      'white wine bottle cooler'
    ];
  } else if(/calice|glassware|riedel|bicchiere/.test(t)) {
    selected = [
      'wine glasses tasting set',
      'wine glass table setting',
      'sommelier wine glassware'
    ];
  } else if(/champagne|franciacorta|spumant|bollicin|cava|prosecco/.test(t)) {
    selected = [
      'champagne bottle vineyard',
      'franciacorta vineyard sparkling wine',
      'sparkling wine glasses celebration'
    ];
  } else if(/sommelier|degust|abbinament|calice|servizio del vino|wine tasting/.test(t)) {
    selected = [
      'sommelier pouring wine tasting',
      'wine tasting elegant table',
      'restaurant sommelier wine service'
    ];
  } else if(/cantina|barrique|botti|affinament|invecchiam|bottaia|cellar/.test(t)) {
    selected = [
      'wine cellar oak barrels',
      'barrique winery cellar',
      'cantina botti vino'
    ];
  } else if(/vendemmia|harvest|raccolt|potatur|vigna in autunno|grapes picking/.test(t)) {
    selected = [
      'wine harvest vineyard grapes',
      'grape harvest winery',
      'vineyard workers grapes'
    ];
  } else if(/produttor|domaine|maison|chateau|château|tenuta|cantina storica|winery/.test(t)) {
    selected = [
      'winery estate vineyard',
      'domaine vineyard france',
      'wine estate building vines'
    ];
  } else if(/rosso|amarone|cabernet|syrah|shiraz|pinot nero/.test(t)) {
    selected = [
      'red wine bottle glass',
      'red wine vineyard hills',
      'wine cellar red wine'
    ];
  } else if(/bianco|riesling|chardonnay|sauvignon|assyrtiko|pinot bianco/.test(t)) {
    selected = [
      'white wine glass vineyard',
      'white wine bottle elegant table',
      'chardonnay vineyard sunshine'
    ];
  } else if(/vigna|vineyard|terroir|suolo|vigneto|colline|cru|parcella/.test(t)) {
    selected = [
      'vineyard rows hillside',
      'vineyard france countryside',
      'wine estate vines landscape'
    ];
  } else if(/notizia|mercato|prezzi|award|export|produzione|trend/.test(t)) {
    selected = [
      'vineyard estate aerial',
      'wine cellar bottles rows',
      'wine industry vineyard'
    ];
  } else if(/tappo|sughero|cork/.test(t)) {
    selected = [
      'wine cork bottle opener',
      'corks wine cellar table',
      'wine bottle cork detail'
    ];
  } else if(/bottiglia|bottle|etichetta|label/.test(t)) {
    selected = [
      'wine bottle label close up',
      'wine bottle elegant cellar',
      'barolo bottle table'
    ];
  }

  return window._buildUnsplashTopicImage(selected, offset || 0);
};

window.getTopicPhoto = function(titolo, categoria, offset) {
  var t = ((titolo||'')+' '+(categoria||'')).toLowerCase();
  return window.getArticleImage(t, offset || 0);
};


// ═══════════════════════════════════════════════════════════
// SISTEMA TRADUZIONE CON CACHE — traduzioni pre-generate
// Strategia: articoli tradotti in background la prima volta,
// poi sempre istantanei dalla cache localStorage.
// ═══════════════════════════════════════════════════════════

/* Chiave cache: sw_tr_{articleId}_{lang}_{field} */
window._trCache = {

  /* Salva traduzione nel cache */
  save: function(artId, lang, field, text) {
    try {
      var key = 'sw_tr_'+artId+'_'+lang+'_'+field;
      localStorage.setItem(key, text);
    } catch(e) {}
  },

  /* Legge traduzione dal cache */
  get: function(artId, lang, field) {
    try {
      return localStorage.getItem('sw_tr_'+artId+'_'+lang+'_'+field) || '';
    } catch(e) { return ''; }
  },

  /* Applica cache a un articolo */
  applyToArt: function(art, lang) {
    if(!art.id || lang==='it') return;
    var tit = this.get(art.id, lang, 'titolo');
    var txt = this.get(art.id, lang, 'testo');
    if(tit) art['titolo_'+lang] = tit;
    if(txt) art['testo_'+lang]  = txt;
  },

  /* Controlla se un articolo ha già la traduzione */
  has: function(artId, lang) {
    return !!(this.get(artId, lang, 'testo'));
  },
};

/**
 * translateAllArticles(arts, lang)
 * Traduce in background tutti gli articoli che non hanno ancora
 * la traduzione per la lingua richiesta.
 * Ogni articolo viene tradotto uno alla volta (per non sovraccaricare l'API).
 */
window.translateAllArticles = async function(arts, lang) {
  if(!lang || lang==='it') return;
  if(typeof window.callAPI !== 'function') return;

  var pending = arts.filter(function(a) {
    var txt = a.testo_it || a.testo || '';
    return a.id && txt && !window._trCache.has(a.id, lang);
  });

  if(!pending.length) return;

  var langName = {en:'inglese perfetto', fr:'francese perfetto', ru:'russo perfetto'}[lang] || lang;
  var sys = 'Sei un traduttore esperto di testi enologici e culturali di alto livello. '+
    'Traduci in '+langName+' il testo che ti invio. '+
    'Mantieni il tono poetico e narrativo. Solo la traduzione, senza commenti o prefazioni.';

  /* Traduce un articolo alla volta in background — non blocca l'UI */
  for(var i=0; i<pending.length; i++) {
    var art = pending[i];
    try {
      var srcTit = art.titolo_it || art.titolo || '';
      var srcTxt = art.testo_it  || art.testo  || '';
      if(!srcTxt) continue;

      /* Traduce titolo */
      var tit = await window.callAPI(
        'Traduci solo questo titolo in '+langName+'. Rispondi SOLO con il titolo tradotto, nessuna spiegazione:', srcTit, lang
      );
      if(tit && tit.trim()) {
        window._trCache.save(art.id, lang, 'titolo', tit.trim());
        art['titolo_'+lang] = tit.trim();
      }

      /* Traduce testo */
      var txt = await window.callAPI(sys, srcTxt, lang);
      if(txt && txt.trim()) {
        window._trCache.save(art.id, lang, 'testo', txt.trim());
        art['testo_'+lang] = txt.trim();
      }

      /* Aggiorna card se siamo già nella lingua tradotta */
      if(window.getLang() !== lang) { translateAllArticles(arts, lang); } {
        if(typeof window.renderSapere==='function') window.renderSapere([]);
        if(typeof window.renderSlides==='function') window.renderSlides();
      }

      /* Piccola pausa tra articoli per non sovraccaricare il server */
      await new Promise(function(r){ setTimeout(r, 300); });

    } catch(e) {
      /* Se fallisce un articolo, continua con il prossimo */
    }
  }

  /* Se siamo nella lingua tradotta, aggiorna il carousel con i nuovi testi */
  if(window.getLang && window.getLang()===lang) {
    window.renderSlides();
  }
};

/**
 * getArtInLang(art, lang)
 * Legge il testo di un articolo nella lingua richiesta.
 * Priorità: campo nativo → cache localStorage → fallback italiano.
 */
window.getArtInLang = function(art, lang, field) {
  /* 1. Campo nativo nell'articolo */
  var native = art[field+'_'+lang];
  if(native && native.trim()) return native.trim();

  /* 2. Cache localStorage */
  if(art.id) {
    var cached = window._trCache.get(art.id, lang, field);
    if(cached) {
      art[field+'_'+lang] = cached; /* scrivi nel cache dell'oggetto */
      return cached;
    }
  }

  /* 3. Fallback italiano */
  return art[field+'_it'] || art[field] || '';
};



// ═══════════════════════════════════════════════════════════
// CSS — iniettato una sola volta
// ═══════════════════════════════════════════════════════════
(function injectCSS(){
  if(document.getElementById('sw-news-css')) return;
  var s=document.createElement('style');
  s.id='sw-news-css';
  s.textContent=
    '#slArea{position:relative;width:100%;height:420px;overflow:hidden;background:#0d0202;}'+
    '#slArea .sw-slide{position:absolute;inset:0;opacity:0;transition:opacity .75s ease;pointer-events:none;}'+
    '#slArea .sw-slide.on{opacity:1;pointer-events:auto;}'+
    '#slArea .sw-slide .sw-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;display:block;}'+
    '#slArea .sw-slide .sw-grad{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(10,5,2,.08) 0%,rgba(10,5,2,.28) 40%,rgba(10,5,2,.9) 78%,rgba(10,5,2,.99) 100%);}'+
    '#slArea .sw-slide .sw-body{position:absolute;bottom:0;left:0;right:0;padding:22px 22px 26px;cursor:pointer;}'+
    '.sw-slide-date{font-family:Cinzel,serif;font-size:.38rem;letter-spacing:3px;color:rgba(212,175,55,.55);margin-bottom:4px;}'+
    '.sw-slide-cat{font-family:Cinzel,serif;font-size:.44rem;letter-spacing:3px;color:rgba(212,175,55,.95);font-weight:700;text-transform:uppercase;margin-bottom:7px;display:flex;align-items:center;gap:6px;}'+
    '.sw-slide-cat::before{content:"";display:inline-block;width:22px;height:1px;background:rgba(212,175,55,.6);}'+
    '.sw-slide-tit{font-family:"Playfair Display",Georgia,serif;font-size:1.46rem;font-weight:700;color:#FFFFFF;line-height:1.18;text-shadow:0 2px 12px rgba(0,0,0,.9);margin-bottom:9px;max-width:760px;}'+
    '.sw-slide-txt{font-family:"Cormorant Garamond",Georgia,serif;font-size:1rem;line-height:1.68;color:rgba(245,239,226,.74);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;max-width:760px;}'+
    '.sw-slide-read{display:inline-block;margin-top:8px;font-family:Cinzel,serif;font-size:.38rem;letter-spacing:2px;color:rgba(212,175,55,.7);border-bottom:1px solid rgba(212,175,55,.3);}'+
    '#slDots{display:flex;justify-content:center;gap:6px;padding:8px 0 5px;background:#0A0A0A;}'+
    '.sw-dot{width:5px;height:5px;border-radius:50%;background:rgba(212,175,55,.18);border:none;padding:0;cursor:pointer;transition:all .25s;}'+
    '.sw-dot.on{background:#D4AF37;width:16px;border-radius:3px;}'+
    '.sw-art{background:rgba(10,5,2,.98);border:1px solid rgba(212,175,55,.1);border-radius:10px;margin:0 14px 14px;cursor:pointer;overflow:hidden;transition:transform .2s,box-shadow .2s;}'+
    '.sw-art:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,.6);}'+
    '.sw-art-img{width:100%;height:180px;object-fit:cover;display:block;}'+
    '.sw-art-body{padding:14px 16px 18px;}'+
    '.sw-art-tag{font-family:Cinzel,serif;font-size:.42rem;font-weight:700;letter-spacing:2px;color:rgba(212,175,55,.75);text-transform:uppercase;margin-bottom:6px;}'+
    '.sw-art-tit{font-family:"Playfair Display",Georgia,serif;font-size:1.14rem;font-weight:700;color:#FFFFFF;line-height:1.22;margin-bottom:8px;}'+
    '.sw-art-txt{font-family:"Cormorant Garamond",Georgia,serif;font-size:.96rem;line-height:1.85;color:rgba(245,239,226,.72);}'+
    '.sw-art-foot{font-family:Cinzel,serif;font-size:.4rem;letter-spacing:1px;color:rgba(245,239,226,.25);margin-top:10px;padding-top:8px;border-top:1px solid rgba(212,175,55,.08);}'+
    '.sw-editorial-grid{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(280px,.7fr);gap:16px;}'+
    '.sw-editorial-lead,.sw-editorial-card{position:relative;overflow:hidden;border-radius:18px;border:1px solid rgba(212,175,55,.14);cursor:pointer;background:#0d0202;min-height:240px;}'+
    '.sw-editorial-lead:hover,.sw-editorial-card:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,0,0,.35);}'+
    '.sw-editorial-lead img,.sw-editorial-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;}'+
    '.sw-editorial-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,5,2,.1),rgba(10,5,2,.34) 45%,rgba(10,5,2,.96));}'+
    '.sw-editorial-copy{position:absolute;left:0;right:0;bottom:0;padding:20px 20px 22px;}'+
    '.sw-editorial-kicker{font-family:Cinzel,serif;font-size:.42rem;letter-spacing:3px;color:rgba(212,175,55,.82);margin-bottom:8px;text-transform:uppercase;}'+
    '.sw-editorial-title{font-family:"Playfair Display",Georgia,serif;font-size:1.36rem;line-height:1.15;color:#fff;margin-bottom:8px;}'+
    '.sw-editorial-text{font-family:"Cormorant Garamond",Georgia,serif;font-size:1rem;line-height:1.68;color:rgba(245,239,226,.76);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}'+
    '.sw-editorial-side{display:grid;grid-template-rows:1fr 1fr;gap:16px;}'+
    '.sw-editorial-card .sw-editorial-title{font-size:1.08rem;line-height:1.18;}'+
    '.sw-editorial-card .sw-editorial-text{-webkit-line-clamp:2;font-size:.96rem;}'+
    '@media (max-width:900px){#slArea{height:360px;}.sw-editorial-grid{grid-template-columns:1fr;}.sw-editorial-side{grid-template-rows:none;grid-template-columns:1fr;}.sw-editorial-title{font-size:1.14rem;}}';
  document.head.appendChild(s);
})();

// ═══════════════════════════════════════════════════════════
// LA GAZZETTA DEL SOMMELIER
// 30 articoli organizzati in categorie.
// Ogni giorno vengono selezionati 6 articoli diversi per il
// carousel, creando l'effetto di notizie sempre fresche.
// ═══════════════════════════════════════════════════════════
var _GAZZETTA = [

  /* ═══ ATTUALITÀ DEL VINO ═══ */
  {
    id:'g01', cat:'🗞 Attualità del Vino',
    titolo:'Il Barolo batte tutti: record d\'aste a Hong Kong e New York',
    testo:'Il vino italiano conquista i vertici del mercato internazionale. Un lotto di Barolo Monfortino Giacomo Conterno 1958 ha raggiunto cifre senza precedenti nelle sale d\'asta di Hong Kong, confermando la crescente domanda globale per i grandi rossi delle Langhe. Analisti di Sotheby\'s parlano di una "rinascita del classicismo" nel collezionismo enologico mondiale.',
    img:'vineyard_a',
  },
  {
    id:'g02', cat:'🗞 Attualità del Vino',
    titolo:'Borgogna 2024: la critica internazionale lancia l\'allarme prezzi',
    testo:'Robert Parker Jr Foundation e Wine Spectator concordano: i prezzi dei Grand Cru borgognoni hanno superato ogni soglia di accessibilità. Un Romanée-Conti 2023 quota oggi oltre 18.000 euro a bottiglia. Il presidente del Comité Colbert lancia un appello alla "democratizzazione del lusso enologico" — ma i domaine continuano a ridurre le allocazioni ai mercati asiatici.',
    img:'cellar_a',
  },
  {
    id:'g03', cat:'🗞 Attualità del Vino',
    titolo:'Champagne: le grandi Maison puntano sul non-vintage di alta gamma',
    testo:'LVMH, Krug e Billecart-Salmon annunciano investimenti miliardari nel Non-Vintage Prestige. La filosofia si ribalta: non più il millesimato come apice, ma la sapienza dell\'assemblaggio come massima espressione. Dominique Demarville di Krug: "Ogni annata che entra nella Grande Cuvée è già storia — l\'assemblaggio è la nostra risposta al tempo."',
    img:'bubbles_a',
  },
  {
    id:'g04', cat:'🗞 Attualità del Vino',
    titolo:'Sassicaia difende il primato: 97 punti e storico sorpasso al Pétrus',
    testo:'La storica tenuta Bolgheri fa registrare il punteggio più alto della sua storia secolare. Il Sassicaia 2021, con il suo Cabernet Sauvignon affinato 24 mesi in barrique di rovere francese, ha ricevuto 97 punti da tre guide internazionali in contemporanea — una coincidenza che non si verificava dal leggendario 1985, annata che fece conoscere il Super Tuscan al mondo.',
    img:'vineyard_b',
  },
  {
    id:'g05', cat:'🗞 Attualità del Vino',
    titolo:'Vini naturali: il movimento vince la battaglia culturale in Europa',
    testo:'Per la prima volta, i vini "nature" superano il 12% delle vendite nei bistrot parigini e nelle enoteche milanesi di fascia alta. Una ricerca Vinexpo rivela che il consumatore under-35 privilegia la tracciabilità e la biodiversità del vigneto rispetto alla perfezione tecnica del vino. L\'artigianato batte l\'industriale, e i Salon del Vino Naturale si moltiplicano da Barcellona a Tokyo.',
    img:'harvest_a',
  },

  /* ═══ VITICOLTURA MONDIALE ═══ */
  {
    id:'g06', cat:'🌿 Viticoltura Mondiale',
    titolo:'Il cambiamento climatico ridisegna le mappe vitivinicole d\'Europa',
    testo:'L\'isoterma del 10°C — soglia tradizionale per la coltivazione della vite — si è spostata verso nord di oltre 200 chilometri negli ultimi trent\'anni. La Danimarca produce oggi Pinot Noir di qualità. La Svezia meridionale ha aperto 60 nuove cantine. Gli enologi inglesi della Cornovaglia parlano apertamente di "Borgogna atlantica". Nel frattempo, i vigneti storici provenzali cercano altitudini.',
    img:'vineyard_c',
  },
  {
    id:'g07', cat:'🌿 Viticoltura Mondiale',
    titolo:'L\'Etna: il vulcano attivo più studiato della viticoltura mondiale',
    testo:'Sedici università internazionali, da Berkeley a Osaka, hanno aperto laboratori di ricerca sulle lave dell\'Etna. Il suolo vulcanico basaltico contiene una concentrazione di potassio e manganese irriproducibile altrove. Marco de Grazia, pioniere dell\'enologia etnea, spiega: "Non piantiamo viti sull\'Etna — le liberiamo. La lava decide già tutto: struttura, mineralità, longevità."',
    img:'vineyard_d',
  },
  {
    id:'g08', cat:'🌿 Viticoltura Mondiale',
    titolo:'Georgia: 8.000 anni di kvevri e la riscoperta mondiale del vino arancione',
    testo:'La maccerazione delle bucce su vini bianchi, pratica ancestrale dei monaci georgiani, è oggi oggetto di studio nelle migliori università enologiche. Il Rkatsiteli affinato 6 mesi in anfora kvevri interrata ha conquistato i migliori sommelier di Copenaghen, New York e Tokyo. Ramaz Nikoladze, produttore di Kutaisi, riceve oggi ordini da 47 paesi: "Il mondo ha riscoperto la verità del vino."',
    img:'cellar_b',
  },
  {
    id:'g09', cat:'🌿 Viticoltura Mondiale',
    titolo:'Biodinamica: Domaine Leflaive e la rivoluzione silenziosa della Borgogna',
    testo:'Cinquant\'anni fa Domaine Leflaive era la cantina più convenzionale di Puligny-Montrachet. Oggi è il simbolo mondiale della viticoltura biodinamica. Il calendario lunare guida ogni intervento in vigna, le preparazioni Rudolf Steiner nutrono la microbiologia del suolo. Il risultato: Chardonnay che esprimono una mineralità da pietra focaia irraggiungibile per via chimica.',
    img:'harvest_b',
  },
  {
    id:'g10', cat:'🌿 Viticoltura Mondiale',
    titolo:'La Mosella eroica: i vignaioli che rischiano la vita per il Riesling perfetto',
    testo:'Pendii inclinati fino al 70%, ardesia scivolosa, nessuna meccanizzazione possibile. I 280 vignaioli della Mosel-Saar-Ruwer coltivano oggi 9.000 ettari a mano, uno per uno, con lo stesso metodo dei loro bisnonni. Il costo di produzione è quattro volte superiore a qualsiasi altra regione tedesca. Eppure il Riesling Spätlese di Bernkastel-Kues è ancora il vino bianco più longevo del pianeta.',
    img:'vineyard_a',
  },
  {
    id:'g11', cat:'🌿 Viticoltura Mondiale',
    titolo:'Mendoza conquista quota 1.500 metri: nasce il Malbec d\'alta montagna',
    testo:'Le nuove denominazioni de Las Compuertas e Gualtallary, a 1.400-1.500 metri sulle Ande, stanno ridefinendo il Malbec mondiale. L\'irraggiamento solare estremo e le escursioni termiche di 20°C tra giorno e notte costruiscono tannini dalla struttura inedita. Achaval Ferrer e Zuccardi Valle de Uco vinificano separatamente ogni parcella: l\'era del terroir argentino è cominciata.',
    img:'vineyard_c',
  },
  {
    id:'g12', cat:'🌿 Viticoltura Mondiale',
    titolo:'Santorini: l\'alberello kouloura che sfida il tempo e il mare',
    testo:'Le viti di Assyrtiko attorcigliate a spirale sul basalto di Santorini sono le più antiche d\'Europa a coltivazione continua — alcune superano i 300 anni. La forma kouloura protegge i grappoli dal vento di Meltemi e dall\'acqua salata del Mar Egeo. Il risultato è un bianco di mineralità assoluta, acidità tagliente e longevità straordinaria. Domaine Sigalas e Gaia Wines lo portano nel mondo.',
    img:'vineyard_d',
  },

  /* ═══ SOMMELIER INTERNAZIONALI ═══ */
  {
    id:'g13', cat:'🎩 Sommelier del Mondo',
    titolo:'Arvid Rosengren, il re dei sommelier, rivela i suoi 10 vini dell\'anno',
    testo:'Il campione mondiale ASI 2016 pubblica la sua lista annuale con una premessa che sorprende il settore: "La perfezione tecnica mi annoia. Cerco l\'anima nel calice." In cima alla sua selezione 2024: un Côte-Rôtie di René Rostaing, un Barolo di Maria Teresa Mascarello e — scelta provocatoria — un Riesling dell\'Alto Adige di Alois Lageder. "Il futuro del vino è nella bellezza dimenticata," scrive nel suo blog.',
    img:'sommelier_a',
  },
  {
    id:'g14', cat:'🎩 Sommelier del Mondo',
    titolo:'Rajat Parr abbandona la California e si trasferisce nelle Langhe',
    testo:'Il più celebre sommelier americano, guru del Pinot Noir californiano e fondatore di Sandhi Wines, ha acquistato un vigneto a Serralunga d\'Alba. La sua dichiarazione ha fatto scalpore: "Ho passato vent\'anni a cercare la Borgogna in California. Era sempre a Barolo, ad aspettarmi." Il progetto prevede una vinificazione tradizionale, grandi botti di Slavonia e zero interventismo. Prima uscita: 2027.',
    img:'tasting_a',
  },
  {
    id:'g15', cat:'🎩 Sommelier del Mondo',
    titolo:'Il Miglior Sommelier d\'Italia 2025: a sorpresa vince una donna delle Dolomiti',
    testo:'Elena Carraro, 31 anni, nata a Bolzano, ha conquistato un prestigioso titolo nazionale di sommellerie con un punteggio record nella prova di analisi organolettica alla cieca. Ha identificato correttamente un Riesling Auslese della Mosella del 1990, un Barolo Riserva del 1988 e un Sauternes del 1983 dalla sola analisi visiva e olfattiva. "Il vino parla — io ascolto" è diventata la frase più citata del mondo enologico italiano.',
    img:'glass_red_a',
  },
  {
    id:'g16', cat:'🎩 Sommelier del Mondo',
    titolo:'Éric Beaumard: vent\'anni al Georges V, il servizio come arte assoluta',
    testo:'Il vice-campione mondiale ASI e direttore del ristorante del Four Seasons Paris compie vent\'anni di servizio nella cantina più celebre d\'Europa. 50.000 referenze, 600.000 bottiglie, una temperatura mantenuta costante a 14°C su tre piani sotterranei in boulevard du Temple. Nel suo nuovo libro "L\'Emozione nel Bicchiere" scrive: "Un grande sommelier non serve il vino. Racconta una storia."',
    img:'cellar_a',
  },
  {
    id:'g17', cat:'🎩 Sommelier del Mondo',
    titolo:'La nuova generazione: i sommelier under-30 che stanno cambiando il mondo del vino',
    testo:'Sei under-trenta selezionati da Wine Spectator come "Voices of Tomorrow": tre donne, tre uomini, cinque continenti. Li accomuna un approccio rivoluzionario: abolire il gergo tecnico, democratizzare il linguaggio, avvicinare il vino alla quotidianità. Parla Paz Levinson di Argentina: "Il vino non è un\'élite. È un\'emozione. E le emozioni appartengono a tutti."',
    img:'sommelier_a',
  },

  /* ═══ TERROIR ═══ */
  {
    id:'g18', cat:'🌍 Terroir',
    titolo:'Il suolo come destino: la rivoluzione della geologia nella viticultura moderna',
    testo:'Il calcare kimmeridgiano di Chablis, l\'ardesia del Mosel, il galestro toscano, la pomice di Santorini: la geologia è tornata al centro del discorso enologico mondiale. Claude Bourguignon, il più famoso microbiologo del suolo viticolo, spiega: "Un vigneto non si coltiva. Si ascolta. Il suolo sa già tutto — il vignaiolo deve solo imparare a tradurre." Il suo istituto LAMS analizza oggi oltre 2.000 suoli all\'anno.',
    img:'vineyard_b',
  },
  {
    id:'g19', cat:'🌍 Terroir',
    titolo:'Priorat: la llicorella nera e i vini che sembrano estratti dalla roccia',
    testo:'Novantadue ettari di scisto nero — la llicorella — che le radici della Grenache centenaria attraversano per 15 metri alla ricerca dell\'acqua. Il Priorat è il terroir più estremo della penisola iberica. René Barbier pioniere, Álvaro Palacios rivoluzionario: insieme hanno trasformato una denominazione dimenticata nel tesoro più cercato dai collezionisti iberofili. Prezzi decuplicati in vent\'anni.',
    img:'vineyard_c',
  },
  {
    id:'g20', cat:'🌍 Terroir',
    titolo:'Tokaj: il "Vino dei Re" ritrova la sua grandezza dopo il comunismo',
    testo:'Trent\'anni dopo la caduta del muro, i vigneti di Tokaj hanno ritrovato la loro identità. Royal Tokaji, fondato da Hugh Johnson nel 1990, e Oremus, acquistato da Vega Sicilia nel 1993, hanno riportato il Tokaji Aszú agli antichi splendori. I botrytis naturali sulle uve Furmint producono un\'acidità e una dolcezza in equilibrio impossibile da eguagliare. Sei puttonyos: l\'apice della nobiltà liquida.',
    img:'vineyard_d',
  },

  /* ═══ IL SAPERE DEL VINO ═══ */
  {
    id:'g21', cat:'🍷 Il Sapere del Vino',
    titolo:'Perché i grandi vini migliorano con l\'invecchiamento: la scienza della longevità',
    testo:'L\'invecchiamento del vino è un processo di straordinaria complessità che affascina scienziati e sommelier da secoli. I polifenoli si polimerizzano, gli esteri si formano, gli acidi si esterificano. Un Barolo giovane esprime potenza e ruvidezza — lo stesso vino a vent\'anni diventa seta. La chiave è l\'acidità naturale: senza di essa, il vino non invecchia, decade. Ecco perché il Riesling della Mosella dura sessant\'anni.',
    img:'cellar_b',
  },
  {
    id:'g22', cat:'🍷 Il Sapere del Vino',
    titolo:'Il decanter: quando e perché aerare il vino — la guida definitiva',
    testo:'Decantare un vino significa dargli l\'ossigeno necessario per aprirsi, per esprimere profumi sopiti. Un Barolo giovane ha bisogno di tre ore di decanter per liberare i suoi aromi di rosa appassita e catrame. Un Champagne non va mai decantato: perderebbe le sue bollicine preziose. Un Sauternes vecchio si decanta appena cinque minuti. L\'arte del sommelier sta nel saper ascoltare ogni bottiglia individualmente.',
    img:'tasting_a',
  },
  {
    id:'g23', cat:'🍷 Il Sapere del Vino',
    titolo:'I vitigni autoctoni italiani: 377 varietà uniche al mondo',
    testo:'L\'Italia è la nazione vitivinicola più ricca di biodiversità ampelografica del pianeta: 377 vitigni autoctoni documentati, una per ogni sfumatura di territorio. Dal Timorasso dei Colli Tortonesi al Carricante dell\'Etna, dal Vitovska del Carso al Pecorino abruzzese. La globalizzazione del Cabernet e dello Chardonnay ha rischiato di cancellarli. La nuova generazione di produttori li salva uno per uno.',
    img:'harvest_a',
  },
  {
    id:'g24', cat:'🍷 Il Sapere del Vino',
    titolo:'Il calice giusto: come la forma del vetro cambia il vino che beviamo',
    testo:'Georg Riedel ha rivoluzionato il modo di bere vino negli anni Cinquanta intuendo che forma e volume del calice modificano radicalmente la percezione sensoriale. Un Barolo nel calice da Borgogna esprime una complessità che nel calice standard sembrerebbe piatta. Un Riesling nel calice affusolato mantiene la freschezza che si disperderebbe in un\'apertura ampia. Il vetro non è un contenitore: è uno strumento di musica.',
    img:'glass_red_b',
  },
  {
    id:'g25', cat:'🍷 Il Sapere del Vino',
    titolo:'Abbinamento cibo-vino: cinque regole che i grandi sommelier non violano mai',
    testo:'Prima regola: il vino non deve mai essere più dolce del cibo. Seconda: i grassi chiedono acidità. Terza: i pesci delicati fuggono i rossi tannici. Quarta: i formaggi stagionati tollerano quasi tutto — il grande rosso strutturato è il loro partner ideale. Quinta: l\'abbinamento geografico raramente delude — il Chianti con la bistecca fiorentina non è una convenzione, è una verità millenaria.',
    img:'sommelier_a',
  },
  {
    id:'g26', cat:'🍷 Il Sapere del Vino',
    titolo:'Annate leggendarie: i vini che hanno cambiato la storia del collezionismo',
    testo:'Il 1945 in Borgogna, il 1961 a Bordeaux, il 1971 in Germania, il 1990 in Piemonte, il 1997 in Toscana: ogni generazione ha la sua annata del secolo. Dietro ogni leggenda c\'è una combinazione irripetibile di freddo invernale, siccità estiva e vendemmia tardiva. Robert Parker Jr. ha costruito la sua reputazione mondiale su queste coincidenze meteorologiche. Ma i grandi vignaioli sanno che anche le annate difficili producono capolavori.',
    img:'vineyard_b',
  },
  {
    id:'g27', cat:'🍷 Il Sapere del Vino',
    titolo:'Il metodo classico: perché lo Champagne è ancora il re delle bollicine',
    testo:'Presa di spuma, remuage, dégorgement, dosaggio: quattro parole che raccontano un processo lungo tre anni di pazienza certosina. Lo Champagne non è solo vino spumante — è un sistema di produzione unico al mondo, codificato nel 1811 da Madame Clicquot. La presa di spuma nella bottiglia crea bollicine da 0,3 millimetri di diametro che non si trovano in nessun altro metodo. La natura è irriproducibile.',
    img:'bubbles_b',
  },
  {
    id:'g28', cat:'🍷 Il Sapere del Vino',
    titolo:'Brunello di Montalcino: il vino che sfida il tempo con autorità assoluta',
    testo:'Il Sangiovese Grosso — chiamato Brunello dai contadini di Montalcino — produce il vino italiano dalla longevità più documentata. Un Brunello di Biondi-Santi 1891 degustato nel 1970 era ancora vivo, complesso, memorabile. La ferrugginosa galestro toscana, l\'altitudine di 500 metri, le brezze marine del Tirreno: tre fattori che costruiscono un\'acidità e una struttura tannica capaci di sfidare mezzo secolo.',
    img:'vineyard_a',
  },
  {
    id:'g29', cat:'🍷 Il Sapere del Vino',
    titolo:'Vini dolci: il grande equivoco del dessert wine nella cultura occidentale',
    testo:'Il Sauternes di Château d\'Yquem del 1811 è il vino più caro mai venduto all\'asta: 117.000 dollari a bottiglia nel 2011. Eppure in Occidente il vino dolce viene ancora servito a fine pasto quasi con scuse. In Giappone, in Cina, nel mondo arabo è considerato il massimo dell\'ospitalità. Tokaji, Trockenbeerenauslese, Recioto di Soave: l\'errore è bere i dolci solo a fine pasto. Sono vini da meditazione.',
    img:'glass_wht_a',
  },
  {
    id:'g30', cat:'🍷 Il Sapere del Vino',
    titolo:'Il Riesling: il vitigno più incompreso e più longevo del mondo',
    testo:'Snobbato dai neofiti per il nome tedesco, amato in modo assoluto da tutti i sommelier professionisti: il Riesling è il paradosso del vino mondiale. Non contiene quasi per niente solfiti aggiunti, si vinifica senza legno, esprime in modo straordinario il terroir. Un Riesling Auslese della Mosella invecchia 50 anni mantenendo un\'acidità cristallina e sviluppando aromi di miele, idrocarburi nobilissimi e fiori appassiti.',
    img:'vineyard_c',
  },
];

// Genera la data italiana leggibile
window._getDataItaliana = function() {
  var m=['gennaio','febbraio','marzo','aprile','maggio','giugno',
         'luglio','agosto','settembre','ottobre','novembre','dicembre'];
  var d=new Date();
  return d.getDate()+' '+m[d.getMonth()]+' '+d.getFullYear();
};

// Seed giornaliero deterministico — cambia ogni giorno
window._daySeed = function() {
  var d=new Date();
  return d.getFullYear()*10000 + (d.getMonth()+1)*100 + d.getDate();
};

/* ═══════════════════════════════════════════════════════════════
   SISTEMA TRADUZIONI GIORNALIERE — SommelierWorld v15
   • Pre-genera IT/EN/FR/RU ogni mattina con AI
   • Salva in localStorage con chiave seed+lingua
   • Caricamento istantaneo al cambio lingua
   ═══════════════════════════════════════════════════════════════ */

/* Dizionario statico: termini fissi che non cambiano mai */
window.SW_FIXED_TRANS = {
  it: {
    docg:'Denominazione di Origine Controllata e Garantita',
    doc:'Denominazione di Origine Controllata',
    igt:'Indicazione Geografica Tipica',
    vitigno:'Vitigno', produttore:'Produttore',
    metodo_classico:'Metodo Classico', metodo_charmat:'Metodo Charmat',
    rosso:'Rosso', bianco:'Bianco', rosato:'Rosato',
    bollicine:'Bollicine', dolce:'Dolce',
    annata:'Annata', denominazione:'Denominazione',
    terroir:'Terroir', assemblaggio:'Assemblaggio',
  },
  en: {
    docg:'Controlled & Guaranteed Designation of Origin',
    doc:'Controlled Designation of Origin',
    igt:'Typical Geographic Indication',
    vitigno:'Grape Variety', produttore:'Producer',
    metodo_classico:'Traditional Method', metodo_charmat:'Charmat Method',
    rosso:'Red', bianco:'White', rosato:'Rosé',
    bollicine:'Sparkling', dolce:'Sweet',
    annata:'Vintage', denominazione:'Appellation',
    terroir:'Terroir', assemblaggio:'Blend',
  },
  fr: {
    docg:'Appellation d\'Origine Contrôlée et Garantie',
    doc:'Appellation d\'Origine Contrôlée',
    igt:'Indication Géographique Typique',
    vitigno:'Cépage', produttore:'Producteur',
    metodo_classico:'Méthode Traditionnelle', metodo_charmat:'Méthode Charmat',
    rosso:'Rouge', bianco:'Blanc', rosato:'Rosé',
    bollicine:'Pétillant', dolce:'Doux',
    annata:'Millésime', denominazione:'Appellation',
    terroir:'Terroir', assemblaggio:'Assemblage',
  },
  ru: {
    docg:'Контролируемое и Гарантированное Наименование Происхождения',
    doc:'Контролируемое Наименование Происхождения',
    igt:'Типичное Географическое Указание',
    vitigno:'Сорт Винограда', produttore:'Производитель',
    metodo_classico:'Традиционный Метод', metodo_charmat:'Метод Шарма',
    rosso:'Красное', bianco:'Белое', rosato:'Розе',
    bollicine:'Игристое', dolce:'Сладкое',
    annata:'Урожай', denominazione:'Апелласьон',
    terroir:'Терруар', assemblaggio:'Купаж',
  }
};

/* Recupera termine fisso nella lingua corrente */
window.swFixed = function(key) {
  var lang = window.getLang ? window.getLang() : 'it';
  var d = window.SW_FIXED_TRANS[lang] || window.SW_FIXED_TRANS.it;
  return d[key] || key;
};

/* ── Stato sistema traduzioni ── */
window._swTransState = {
  running:  false,   /* traduzione in corso */
  doneToday: false,  /* già fatto oggi */
};

/* ── Pre-genera traduzioni per i 3 articoli di oggi in EN/FR/RU ──
   Viene chiamata una volta al mattino al primo caricamento        */
window.swPreTranslateDaily = async function() {
  if(window._swTransState.running || window._swTransState.doneToday) return;

  var lang = window.getLang ? window.getLang() : 'it';
  /* Se l'utente ha IT selezionato, pre-genera solo EN (priorità) */
  /* Se ha già una lingua straniera, quella è già generata        */
  var TODAY = new Date().toISOString().slice(0,10);
  var LANGS = ['en','fr','ru'];

  /* Controlla se almeno EN è già in cache per oggi */
  var enKey = 'sw_trans_'+TODAY+'_en_0';
  if(localStorage.getItem(enKey)) {
    window._swTransState.doneToday = true;
    return; /* già fatto oggi */
  }

  window._swTransState.running = true;
  console.log('[Trans] Inizio pre-traduzione giornaliera...');

  /* Recupera i 3 temi di oggi */
  var topics = typeof window._selectDailyTopics === 'function'
    ? window._selectDailyTopics(0)
    : [];
  if(!topics.length) { window._swTransState.running=false; return; }

  /* Genera EN/FR/RU in sequenza (evita rate limit) */
  for(var li=0; li<LANGS.length; li++) {
    var tLang = LANGS[li];
    for(var ti=0; ti<topics.length; ti++) {
      var cKey = 'sw_trans_'+TODAY+'_'+tLang+'_'+ti;
      if(localStorage.getItem(cKey)) continue; /* già in cache */

      var LANG_NAME = {en:'English',fr:'français',ru:'русский'}[tLang];
      try {
        /* Usa /api/translate con Groq — non spreca GPT-4o per le traduzioni */
        var srcArt = window._sapereCache && window._sapereCache[ti];
        var srcText = srcArt ? (srcArt.testo_it || '') : '';
        if(!srcText) { result = null; } else {
          try {
            var ctrl2 = new AbortController();
            var t2 = setTimeout(function(){ ctrl2.abort(); }, 22000);
            var tr = await fetch((window.SRV||'https://hidden-term-f2d0.timotiniurie49.workers.dev')+'/api/translate', {
              method:'POST', headers:{'Content-Type':'application/json'},
              body: JSON.stringify({ text: srcText, targetLang: tLang, context: 'wine encyclopedia article' }),
              signal: ctrl2.signal,
            });
            clearTimeout(t2);
            var td = await tr.json();
            var result = td.translated || null;
          } catch(fe) { var result = null; }
        }
        if(result) {
          localStorage.setItem(cKey, JSON.stringify({
            titolo: topics[ti],
            testo: result,
            lang: tLang,
            data: TODAY,
          }));
        }
        await new Promise(function(r){ setTimeout(r, 800); });
      } catch(e) {
        console.warn('[Trans] Errore per',tLang,topics[ti],':',e.message);
      }
    }
  }

  window._swTransState.running  = false;
  window._swTransState.doneToday = true;
  console.log('[Trans] Pre-traduzione completata per oggi.');
};

/* Recupera articolo tradotto dalla cache (o fallback IT) */
window.swGetTranslated = function(index, fallbackArt) {
  var lang = window.getLang ? window.getLang() : 'it';
  if(lang === 'it') return fallbackArt;
  var TODAY = new Date().toISOString().slice(0,10);
  var cKey = 'sw_trans_'+TODAY+'_'+lang+'_'+index;
  try {
    var cached = localStorage.getItem(cKey);
    if(cached) {
      var t = JSON.parse(cached);
      return Object.assign({}, fallbackArt, {
        titolo_it: t.titolo,
        testo_it: t.testo,
        titolo_en: lang==='en'?t.titolo:fallbackArt.titolo_en,
        testo_en: lang==='en'?t.testo:fallbackArt.testo_en,
        titolo_fr: lang==='fr'?t.titolo:fallbackArt.titolo_fr,
        testo_fr: lang==='fr'?t.testo:fallbackArt.testo_fr,
        titolo_ru: lang==='ru'?t.titolo:fallbackArt.titolo_ru,
        testo_ru: lang==='ru'?t.testo:fallbackArt.testo_ru,
      });
    }
  } catch(e) {}
  return fallbackArt;
};

// Seleziona 6 articoli ruotanti per il carousel (cambiano ogni giorno)
window._selectDailyNews = function() {
  var seed=window._daySeed();
  var pool=_GAZZETTA.slice(); // copia
  // Fisher-Yates seeded shuffle
  for(var i=pool.length-1;i>0;i--){
    seed=(seed*1664525+1013904223)&0xffffffff;
    var j=Math.abs(seed)%(i+1);
    var tmp=pool[i]; pool[i]=pool[j]; pool[j]=tmp;
  }
  // Priorità: almeno 1 per categoria principale
  var cats=['🗞 Attualità del Vino','🌿 Viticoltura Mondiale','🎩 Sommelier del Mondo'];
  var result=[];
  cats.forEach(function(cat){
    for(var k=0;k<pool.length;k++){
      if(pool[k].cat===cat){result.push(pool[k]);pool.splice(k,1);break;}
    }
  });
  // Completa fino a 6 con i rimanenti
  result=result.concat(pool.slice(0,6-result.length));
  return result.slice(0,6);
};

// Converte un articolo _GAZZETTA nel formato standard
window._gazetteToArt = function(g) {
  /* Usa foto dedicata per articoli sapere, foto per topic per gazzetta */
  var sapPhoto = {'sap01':'tasting_a','sap02':'glass_red_a','sap03':'cellar_a',
    'sap04':'bottles_a','sap05':'cellar_b','sap06':'harvest_a','sap07':'vineyard_a',
    'sap08':'tasting_b','sap09':'sommelier_a','sap10':'vineyard_e',
    'sap11':'bubbles_a','sap12':'vineyard_c'};
  var photoKey = sapPhoto[g.id] || g.img;
  var img = '';
  if(typeof photoKey === 'string' && photoKey.indexOf('http') === 0) {
    img = photoKey;
  } else {
    img = window.getTopicPhoto((g.titolo||'')+' '+(g.cat||'')+' '+(photoKey||''), g.cat, 0);
  }
  return {
    id:'gz_'+g.id, isNews:true,
    /* Usa campi multilingua se presenti nell'articolo, altrimenti vuoto (traduzione lazy) */
    titolo_it: g.titolo_it || g.titolo || '',
    testo_it:  g.testo_it  || g.testo  || '',
    categoria_it: g.cat || '',
    titolo_en: g.titolo_en || '',
    testo_en:  g.testo_en  || '',
    categoria_en: g.cat || '',
    titolo_fr: g.titolo_fr || '',
    testo_fr:  g.testo_fr  || '',
    categoria_fr: g.cat || '',
    titolo_ru: g.titolo_ru || '',
    testo_ru:  g.testo_ru  || '',
    categoria_ru: g.cat || '',
    immagine: img,
    data: window._getDataItaliana(),
    generato_ai: false,
  };
};

// Articoli di sapere (non-news) per la sezione in fondo
/* ══ IL SAPERE DEL VINO — 12 articoli permanenti + quelli dalla Gazzetta ══ */
/* ══════════════════════════════════════════
   POOL 200+ TEMI — articoli dinamici ogni giorno via AI
   ══════════════════════════════════════════ */
var _SAPERE_TOPICS = [
  'Il decanter: storia e scienza dell\'aerazione del vino',
  'Il calice perfetto: come la forma cambia il vino',
  'La temperatura di servizio: il dettaglio che cambia tutto',
  'Il cavatappi: 300 anni di storia e ingegneria del vino',
  'Sughero vs tappo a vite: il grande dibattito del vino moderno',
  'La fillossera: il parassita che ha cambiato il vino mondiale',
  'Biodinamica: il vino e il calendario lunare di Rudolf Steiner',
  'La vendemmia: da rito ancestrale a scienza moderna',
  'Come si pota una vigna e perché è così importante',
  'I terrazzamenti eroici della Valtellina e del Mosel',
  'Il basalto dell\'Etna e il Nerello Mascalese: un amore vulcanico',
  'Il Nebbiolo: il vitigno più capriccioso d\'Italia',
  'Sangiovese: mille nomi, mille facce in tutta l\'Italia',
  'Riesling: il vitigno più incompreso e longevo del mondo',
  'Pinot Nero: il sogno impossibile dei viticoltori di tutto il mondo',
  'Il Malbec argentino: emigrante bordolese diventato re delle Ande',
  'La fillossera: il disastro che ha unito Europa e America',
  'Come Madame Clicquot ha inventato il remuage dello Champagne',
  'Il Giudizio di Parigi 1976: quando la California sconfisse la Francia',
  'Robert Parker e la nascita del punteggio 100 nel vino',
  'Il simposio greco: le regole del bere nel mondo antico',
  'I monaci benedettini e la nascita del concetto di Grand Cru',
  'Come il vino ha influenzato le grandi decisioni della politica mondiale',
  'Tokaji: il vino dei Re d\'Ungheria attraverso i secoli',
  'Come pensa un Maestro Sommelier durante una degustazione alla cieca',
  'Il metodo WSET: come si diventa sommelier professionista',
  'Come riconoscere un vino difettoso: i 7 difetti principali',
  'Pizza e vino: la guida definitiva all\'abbinamento per regione',
  'Tartufo bianco e vino: solo Barolo o c\'è altro da scoprire?',
  'Formaggi e vino: la guida completa per tipo di stagionatura',
  'Ostriche e Champagne: una storia d\'amore antica di tre secoli',
  'La cantina perfetta: temperatura, umidità, oscurità e vibrazioni',
  'Barrique vs botti grandi: la differenza nel carattere del vino',
  'Il deposito nel vino: amico o nemico da eliminare?',
  'Le annate leggendarie: 1945 Borgogna, 1961 Bordeaux, 1990 Barolo',
  'Perché i grandi vini migliorano con decenni di invecchiamento',
  'Il vino georgiano in anfora kvevri: 8000 anni di storia ininterrotta',
  'I vini arancio: macerazione sulle bucce e cosa cambia nel bicchiere',
  'Pet-Nat: la rivoluzione delle bollicine artigianali naturali',
  'Vini dolci: perché in Occidente li beviamo solo a fine pasto (sbagliato)',
  'Come Gaja ha trasformato il Barolo e il mondo del vino italiano',
  'Biondi-Santi: la famiglia che ha inventato il Brunello di Montalcino',
  'Romanée-Conti: il vigneto più prezioso e ambito del pianeta',
  'Sassicaia 1972: come è nato il primo Super Tuscan della storia',
  'Pétrus: il miracolo enologico del Merlot su argilla blu a Pomerol',
  'Perché il vino rosso fa venire il mal di testa: miti e realtà scientifiche',
  'Come il cervello percepisce il vino: la neurogastronomia del gusto',
  'Il colore del bicchiere cambia davvero il sapore del vino: esperimenti',
  'Vino e salute: cosa dice davvero la scienza moderna sul consumo moderato',
  'Come il vino cambia con la pressione atmosferica durante un volo aereo',
  'Sashi e vino: quale abbinamento scelgono i giapponesi per il sake alternativo',
  'Come leggere un\'etichetta di vino senza essere esperti del settore',
  'Il metodo champenoise spiegato passo per passo ai non esperti',
  'Champagne vs Cava vs Franciacorta vs Crémant: le differenze vere',
  'Riesling tedesco vs alsaziano: stesso vitigno, mondi completamente diversi',
  'Il vino in Cina: il mercato che ha rivoluzionato il mondo enologico',
  'I vini vulcanici: Etna, Santorini, Canarie a confronto',
  'Il Priorat: come un territorio abbandonato è diventato leggenda mondiale',
  'Arianna Occhipinti: la rivoluzione del vino naturale in Sicilia',
  'Come la musica classica cambia la percezione e il gusto del vino',
  'Vino e cioccolato: le combinazioni sorprendenti che nessuno si aspetta',
  'Come conservare il vino aperto per più di 3 giorni senza farlo ossidare',
  'Il segreto dei sommelier per scegliere il vino al ristorante senza sbagliare',
  'Come si fa una verticale di Barolo: l\'esperienza del tempo nel bicchiere',
  'Stappare una bottiglia di Champagne: il gesto corretto del professionista',
  'La storia del rosé: da vino di serie B a protagonista dell\'estate mondiale',
  'Vitigni autoctoni italiani: i 377 tesori ampelografici unici al mondo',
  'Il Carménère: il vitigno bordolese creduto estinto e trovato in Cile',
  'Il vino nella letteratura: da Omero a Hemingway i grandi scrittori e il vino',
  'Come i grandi sommelier preparano le aste di vino da un milione di euro',
  'Il fenomeno dei vini da garage: quando il piccolo batte il grande',
  'Bio, biodinamico, naturale: le differenze che pochi conoscono davvero',
  'La storia del Barolo: da vino dolce a re dei vini italiani nel Novecento',
  'Come funziona il mercato dei vini da collezione a Sotheby\'s e Christie\'s',
  'Il sughero: dalla quercia da sughero portoghese alla bottiglia in 12 mesi',
  'I sommelier militari: come le grandi navi e gli eserciti gestivano le cantine',
  'Vino e cucina molecolare: gli abbinamenti impossibili che funzionano',
  'Il vino in Giappone: come i giapponesi hanno imparato a produrre Pinot Nero',
  'Come il cambiamento climatico sta spostando i vigneti verso nord',
  'Il fenomeno dei vini arancio in Slovenia e Friuli: la storia completa',
  'Amarone: come nasce il processo di appassimento delle uve a Valpolicella',
  'Il Vin Jaune della Jura: il vino sotto il velo di lieviti per 6 anni',
  'I vini di ghiaccio canadesi e tedeschi: vendemmia a -8°C all\'alba',
  'Brunello di Montalcino: perché invecchia 40 anni e rimane straordinario',
  'Come si fanno le selezioni di parcella nei grandi vigneti di Borgogna',
  'Il Cognac e l\'Armagnac: quando il vino diventa spirito attraverso la distillazione',
  'Come il vino greco antico era completamente diverso da quello moderno',
  'Il Marsala: da vino da tavola siciliano a liquore mondialmente famoso',
  'I vini di Madeira: perché durano secoli e come si producono',
  'Il fenomeno dei wine bar: come il vino al bicchiere ha cambiato le città',
];

/* Cache articoli generati oggi */
window._sapereCache = {};
window._sapereLoadToken = 0;

window._dedupeArticles = function(items) {
  var out = [];
  var seen = {};
  (items || []).forEach(function(item){
    if(!item) return;
    var key = [
      String(item.titolo_it || item.titolo || item.title || '').toLowerCase().replace(/\s+/g,' ').trim(),
      String(item.categoria_it || item.categoria || item.category || '').toLowerCase().replace(/\s+/g,' ').trim()
    ].join('|');
    if(!key || seen[key]) return;
    seen[key] = 1;
    out.push(item);
  });
  return out;
};

window._plainPreviewText = function(html) {
  return String(html || '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>/gi, ' ')
    .replace(/<\/li>/gi, ' ')
    .replace(/<\/h3>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

window._buildEditorialImage = function(query, offset) {
  return window._buildUnsplashTopicImage([query], 200 + (offset || 0));
};

window._buildEditorialGallery = function(items, offset) {
  return (items || []).map(function(item, idx){
    return {
      src: window._buildEditorialImage(item.query, (offset || 0) + idx + 1),
      caption: item.caption || ''
    };
  });
};

var _SAPERE_EDITORIALS = [
  {
    id:'ed01',
    categoria_it:'🍷 Guida pratica',
    titolo_it:'Il cavatappi giusto cambia tutto: 4 modelli davvero utili e quando usarli',
    testo_it:
      '<p>Il cavatappi sembra un dettaglio, ma e uno degli strumenti che cambiano di piu il rapporto con la bottiglia. Se usi il modello sbagliato, il rischio non e solo estetico: puoi spezzare il tappo, agitare un vino vecchio, sporcare il servizio e partire male ancora prima del primo bicchiere.</p>'+
      '<p>La regola utile e semplice: un vino giovane e facile da aprire non richiede lo stesso gesto di una vecchia annata con sughero secco o fragile. Per questo i modelli davvero utili non sono tanti, ma ognuno ha il suo campo giusto.</p>'+
      '<h3>I quattro modelli che vale la pena conoscere</h3>'+
      '<ul>'+
        '<li><strong>Amico del cameriere.</strong> E il migliore per quasi tutto: lama per la capsula, spirale precisa, doppia leva e controllo vero in mano. E il modello da comprare per primo.</li>'+
        '<li><strong>A leve.</strong> Comodo in casa, specie per chi vuole meno fatica. Funziona bene sui vini giovani, ma e meno raffinato e meno preciso nel servizio.</li>'+
        '<li><strong>A farfalla.</strong> Diffusissimo e intuitivo, ma quando il tappo e lungo, duro o gia stanco diventa meno affidabile di quanto sembri.</li>'+
        '<li><strong>Ah-So.</strong> E lo strumento da avere se ami bottiglie mature: le due lame entrano ai lati del tappo e lo estraggono senza perforarlo.</li>'+
      '</ul>'+
      '<h3>Quale comprare davvero</h3>'+
      '<p>Se vuoi un solo strumento, scegli un buon amico del cameriere con lama seghettata, spirale sottile e doppio snodo. E quello che usa anche chi lavora bene in sala perche apre veloce, pulito e con eleganza. Se invece apri spesso vecchie annate, aggiungi un Ah-So: non e un vezzo, e una protezione concreta per tappi fragili.</p>'+
      '<p>Le tre regole da ricordare sono sempre le stesse: capsula tagliata sotto il cercine, spirale perfettamente al centro, estrazione lenta e silenziosa. Un vino aperto bene entra nel bicchiere con piu precisione; un tappo maltrattato racconta subito un servizio mediocre.</p>',
    image_query:'sommelier knife corkscrew wine opener',
    gallery_specs:[
      { query:'sommelier knife corkscrew wine opener', caption:'Amico del cameriere: il piu completo e il piu professionale per uso quotidiano.' },
      { query:'lever corkscrew bottle opener', caption:'Cavatappi a leve: ottimo in casa, rapido e confortevole.' },
      { query:'winged corkscrew wine opener', caption:'Cavatappi a farfalla: semplice, ma meno preciso sui tappi fragili.' },
      { query:'ah so wine opener cork puller', caption:'Ah-So: la scelta migliore per bottiglie vecchie e sugheri delicati.' }
    ]
  },
  {
    id:'ed02',
    categoria_it:'🍷 Servizio del vino',
    titolo_it:'Decanter: quando serve davvero e quando invece rovina il vino',
    testo_it:
      '<p>Il decanter non e un gesto teatrale da fare sempre, ma uno strumento da usare quando ha una funzione precisa. Le funzioni vere sono due: separare una bottiglia matura dal deposito oppure aiutare un rosso giovane, duro e compresso ad aprirsi meglio nel bicchiere.</p>'+
      '<p>L errore piu comune e pensare che piu aria significhi automaticamente piu qualita. Non e cosi. Alcuni vini migliorano molto, altri perdono velocemente le note piu fini proprio quando cominciano a respirare troppo.</p>'+
      '<h3>Quando ha senso usarlo</h3>'+
      '<ul>'+
        '<li><strong>Barolo, Brunello, Aglianico giovani:</strong> spesso escono da una fase serrata e guadagnano spazio aromatico e tannino piu leggibile.</li>'+
        '<li><strong>Bottiglie vecchie con deposito:</strong> il travaso lento aiuta a separare il vino limpido dal fondo senza scuotere troppo il contenuto.</li>'+
        '<li><strong>Rossi potenti appena stappati:</strong> quando al primo assaggio risultano compatti, ridotti o schiacciati, il decanter puo dare ordine e respiro.</li>'+
      '</ul>'+
      '<h3>I casi in cui spesso non serve</h3>'+
      '<p>Champagne delicati, bianchi tesi, vini aromatici sottili o rossi gia in equilibrio non vanno decantati in automatico. Il rischio e perdere proprio le sfumature che rendono interessante la bottiglia. Un servizio serio non dice mai “si fa sempre cosi”.</p>'+
      '<p>La domanda corretta e una sola: il vino ha bisogno di aria o ha bisogno di protezione? Se e gia aperto e leggibile, il calice basta. Se invece appare chiuso oppure sporco di deposito, il decanter puo davvero cambiare l esperienza in meglio.</p>',
    image_query:'wine decanter red wine glass',
    gallery_specs:[
      { query:'wine decanter red wine glass', caption:'Decanter classico per ossigenare rossi giovani e strutturati.' },
      { query:'decanter wine elegant table', caption:'Servizio in sala: il decanter deve accompagnare, non sovrastare il vino.' },
      { query:'wine service decanter sommelier', caption:'Per bottiglie mature il travaso deve essere lento e controllato.' }
    ]
  },
  {
    id:'ed03',
    categoria_it:'🍷 Guida pratica',
    titolo_it:'Il calice non e un dettaglio: quale forma scegliere per rosso, bianco e bollicine',
    testo_it:
      '<p>Il calice cambia davvero il modo in cui il vino si presenta: concentra o disperde i profumi, allarga o stringe il sorso, rende piu evidente l alcol oppure la freschezza. Non compie miracoli, ma incide abbastanza da farti pensare che la stessa bottiglia sia cambiata.</p>'+
      '<p>La buona notizia e che non servono dieci modelli diversi. Bastano poche forme sensate per leggere molto meglio rosso, bianco e bollicine senza riempire la cucina di vetro inutile.</p>'+
      '<h3>Tre forme utili da conoscere</h3>'+
      '<ul>'+
        '<li><strong>Calice ampio tipo Borgogna:</strong> ideale per Pinot Nero, Nebbiolo e rossi che vivono soprattutto di profumo e sfumature.</li>'+
        '<li><strong>Calice piu verticale tipo Bordeaux:</strong> regge bene struttura, alcol e tannino di Cabernet, Syrah e rossi piu muscolari.</li>'+
        '<li><strong>Calice piu affusolato per bianchi:</strong> mantiene precisione, tensione e freschezza su Riesling, Sauvignon Blanc e bianchi tesi.</li>'+
      '</ul>'+
      '<h3>Bollicine: la flute non basta sempre</h3>'+
      '<p>Per Prosecco giovane e bollicina immediata la flute puo ancora avere senso. Ma con Champagne seri o Metodo Classico complessi, un calice un po piu largo permette di capire molto meglio profumi, tessitura e profondita, non solo la spinta delle bolle.</p>'+
      '<p>Se devi comprare solo due modelli, parti da un buon calice universale e da un calice ampio per rossi importanti. E la combinazione piu intelligente per leggere quasi tutto bene senza inseguire collezioni inutili.</p>',
    image_query:'wine glasses tasting set',
    gallery_specs:[
      { query:'wine glasses tasting set', caption:'Set di calici da degustazione: la forma orienta profumi e ampiezza del sorso.' },
      { query:'sommelier wine glassware', caption:'Calice ampio per Pinot Nero, Nebbiolo e rossi che vivono di profumo.' },
      { query:'wine glass table setting', caption:'Calice piu slanciato per bianchi tesi, aromatici e servizio preciso.' }
    ]
  },
  {
    id:'ed04',
    categoria_it:'🍷 Servizio del vino',
    titolo_it:'Temperatura di servizio: il dettaglio che fa sembrare un vino mediocre o grandissimo',
    testo_it:
      '<p>La temperatura cambia tutto: profumo, percezione dell alcol, sensazione tattile e persino equilibrio tra freschezza e morbidezza. Un rosso troppo caldo appare pesante e alcolico. Un bianco troppo freddo diventa muto. Per questo servire bene il vino non significa solo scegliere la bottiglia giusta, ma presentarla alla temperatura corretta.</p>'+
      '<h3>Riferimenti pratici da ricordare</h3>'+
      '<ul>'+
        '<li><strong>Spumanti e Champagne:</strong> 6-8 gradi per i piu freschi, 8-10 per cuvee piu complesse.</li>'+
        '<li><strong>Bianchi leggeri e aromatici:</strong> 8-10 gradi.</li>'+
        '<li><strong>Bianchi strutturati e macerati:</strong> 10-12 gradi.</li>'+
        '<li><strong>Rossi eleganti:</strong> 14-16 gradi.</li>'+
        '<li><strong>Rossi importanti:</strong> 16-18 gradi, non oltre.</li>'+
      '</ul>'+
      '<p>La vecchia idea del rosso servito a temperatura ambiente nasceva in case piu fredde delle nostre. Oggi una stanza a 23-24 gradi appiattisce quasi ogni rosso importante. Meglio partire leggermente piu freschi e lasciare che il calice accompagni l apertura.</p>'+
      '<p>Il servizio corretto fa sembrare il vino piu preciso, piu pulito e piu costoso. E uno dei dettagli meno spettacolari da vedere, ma uno dei piu decisivi da sentire.</p>',
    image_query:'wine bottle ice bucket service',
    gallery_specs:[
      { query:'wine bottle ice bucket service', caption:'Secchiello e ghiaccio: utili, ma da usare con controllo e non come frigorifero aggressivo.' },
      { query:'white wine bottle cooler', caption:'Bianchi e bollicine rendono meglio quando il freddo non anestetizza il profumo.' },
      { query:'sommelier wine service table', caption:'Il servizio corretto accompagna il vino mentre cambia nel bicchiere.' }
    ]
  },
  {
    id:'ed05',
    categoria_it:'🍷 Cultura del vino',
    titolo_it:'Sughero, tappo tecnico o vite: non esiste un vincitore assoluto, ma scelte diverse',
    testo_it:
      '<p>Il dibattito tra sughero e tappo a vite e spesso ideologico, mentre dovrebbe essere pratico. Il sughero naturale conserva fascino, ritualita e una certa permeabilita all ossigeno che puo accompagnare alcuni affinamenti. Il tappo a vite offre regolarita, precisione e una drastica riduzione del rischio di sentore di tappo.</p>'+
      '<h3>Cosa cambia davvero</h3>'+
      '<ul>'+
        '<li><strong>Sughero naturale:</strong> identita classica, ma variabilita tra pezzi e rischio TCA.</li>'+
        '<li><strong>Tappo tecnico:</strong> compromesso industriale piu regolare e spesso molto sensato.</li>'+
        '<li><strong>Tappo a vite:</strong> eccellente per pulizia aromatica, export e vini da bere con precisione.</li>'+
      '</ul>'+
      '<p>Non e vero che il tappo a vite significhi bassa qualita. In paesi come Australia e Nuova Zelanda protegge vini serissimi, soprattutto bianchi e aromatici. Allo stesso modo non e vero che il sughero renda automaticamente un vino piu nobile: dipende dal progetto enologico e dal tempo di vita desiderato.</p>'+
      '<p>La domanda giusta quindi non e quale tappo sia piu romantico, ma quale chiusura sia piu adatta allo stile del vino, al mercato e all orizzonte di consumo pensato dal produttore.</p>',
    image_query:'wine cork bottle opener',
    gallery_specs:[
      { query:'wine cork bottle opener', caption:'Sughero naturale: tradizione, ritualita e una parte di imprevedibilita.' },
      { query:'wine bottle screw cap', caption:'Tappo a vite: precisione, costanza e protezione aromatica.' },
      { query:'wine corks cellar table', caption:'Tappo tecnico: spesso la soluzione piu razionale nel mezzo.' }
    ]
  },
  {
    id:'ed06',
    categoria_it:'🏠 Cantina domestica',
    titolo_it:'La cantina perfetta a casa non deve essere enorme: deve essere stabile',
    testo_it:
      '<p>Molti pensano alla cantina ideale come a un seminterrato da collezionista, ma per conservare bene il vino contano soprattutto stabilita e assenza di stress. Le tre parole chiave sono temperatura costante, umidita equilibrata e buio. Tutto il resto viene dopo.</p>'+
      '<h3>I parametri da non sbagliare</h3>'+
      '<ul>'+
        '<li><strong>Temperatura:</strong> meglio 12-16 gradi stabili che continui sbalzi.</li>'+
        '<li><strong>Umidita:</strong> intorno al 60-75% per non seccare i tappi.</li>'+
        '<li><strong>Luce:</strong> meno possibile, soprattutto niente esposizione diretta e prolungata.</li>'+
        '<li><strong>Vibrazioni:</strong> da evitare, specie per bottiglie da lungo affinamento.</li>'+
      '</ul>'+
      '<p>Un piccolo armadio climatizzato ben impostato vale piu di una stanza improvvisata in garage. E anche importante separare le bottiglie da bere presto da quelle da attendere: ordine e tracciabilita aiutano a non dimenticare il vino nel posto sbagliato o aprirlo troppo tardi.</p>'+
      '<p>La vera cantina domestica perfetta non e scenografica: e affidabile. Se il vino riposa bene, il bicchiere se ne accorge molto prima dell ospite.</p>',
    image_query:'wine cellar oak barrels',
    gallery_specs:[
      { query:'wine cellar oak barrels', caption:'Ambiente buio e stabile: la base di ogni buona conservazione.' },
      { query:'wine cellar bottles rows', caption:'Ordine e catalogazione aiutano a gestire annate e finestre di beva.' },
      { query:'cantina botti vino', caption:'La cantina ideale non e la piu grande: e quella piu regolare nel tempo.' }
    ]
  }
];

window._HOME_MANAGED_DEFAULTS = [
  {
    id:'home_news_01',
    isNews:true,
    generato_ai:false,
    managed_seed:true,
    titolo_it:'Borgogna: il vero valore oggi sta nei village seri, non solo nei nomi irraggiungibili',
    titolo_en:'Burgundy: the real value today lies in serious village wines, not just unreachable names',
    titolo_fr:'Bourgogne: la vraie valeur aujourd\'hui se trouve dans les villages sérieux, pas seulement les grands noms',
    titolo_ru:'Бургундия: настоящая ценность сегодня — в серьёзных village, а не только в недостижимых именах',
    categoria_it:'🗞 Attualità del Vino',
    categoria_en:'🗞 Wine News',
    categoria_fr:'🗞 Actualité du Vin',
    categoria_ru:'🗞 Новости Вина',
    testo_it:
      '<p>La Borgogna piu desiderata continua a far rumore, ma per molti appassionati il ragionamento sta cambiando. Oggi il vero acquisto intelligente non e inseguire per forza l etichetta iconica introvabile: e cercare village e premier cru di produttori affidabili, dove il terroir si legge ancora bene e il prezzo non e solo un trofeo da lista.</p>'+
      '<p>Chi compra con criterio guarda meno il nome che impressiona e di piu la mano del domaine, la precisione di parcella e la coerenza stilistica. In questo momento, il lusso vero in Borgogna non e pagare qualsiasi cifra: e saper distinguere dove esiste ancora piacere reale, non solo prestigio automatico.</p>',
    testo_en:
      '<p>The most sought-after Burgundy continues to make headlines, but for many enthusiasts the conversation is shifting. Today, the truly intelligent purchase is not chasing the iconic, unobtainable label: it is seeking village and premier cru wines from reliable producers, where the terroir still speaks clearly and the price is not merely a trophy on a list.</p>'+
      '<p>The discerning buyer looks less at the impressive name and more at the hand of the domaine, the precision of the parcel and the stylistic consistency. Right now, true luxury in Burgundy is not about paying any price asked: it is knowing how to distinguish where genuine pleasure still exists, beyond automatic prestige.</p>',
    testo_fr:
      '<p>La Bourgogne la plus convoitée continue de faire parler d\'elle, mais pour de nombreux amateurs la réflexion évolue. Aujourd\'hui, le vrai achat intelligent n\'est pas de courir après l\'étiquette iconique introuvable: c\'est chercher des village et premier cru de producteurs fiables, où le terroir se lit encore clairement et le prix n\'est pas seulement un trophée de liste.</p>'+
      '<p>L\'acheteur averti regarde moins le nom qui impressionne et davantage la main du domaine, la précision de la parcelle et la cohérence stylistique. En ce moment, le vrai luxe en Bourgogne n\'est pas de payer n\'importe quelle somme: c\'est savoir distinguer où existe encore un vrai plaisir, et non un simple prestige automatique.</p>',
    testo_ru:
      '<p>Самая желанная Бургундия не перестаёт привлекать внимание, но для многих ценителей логика покупки меняется. Сегодня по-настоящему умная покупка — это не погоня за недостижимой культовой этикеткой, а поиск village и premier cru у надёжных производителей, где терруар читается ясно, а цена не является лишь строчкой в престижном списке.</p>'+
      '<p>Взыскательный покупатель смотрит меньше на впечатляющее имя и больше на руку домена, точность участка и стилистическую последовательность. Сейчас настоящая роскошь в Бургундии — не в том, чтобы платить любую сумму, а в умении различить, где ещё существует подлинное удовольствие, а не просто автоматический престиж.</p>',
    image_hint:'burgundy vineyard rows village premier cru',
    immagine:'',
    data: window._getDataItaliana(),
    autore:'Sommelier World'
  },
  {
    id:'home_news_02',
    isNews:true,
    generato_ai:false,
    managed_seed:true,
    titolo_it:'Viticoltura eroica: perche Mosella, Valtellina e Douro costano piu di quanto sembrano',
    titolo_en:'Heroic viticulture: why Mosel, Valtellina and Douro cost more than they seem',
    titolo_fr:'Viticulture héroïque: pourquoi la Moselle, la Valtellina et le Douro coûtent plus qu\'on ne croit',
    titolo_ru:'Героическое виноделие: почему Мозель, Вальтеллина и Дору стоят дороже, чем кажется',
    categoria_it:'🌿 Viticoltura Mondiale',
    categoria_en:'🌿 World Viticulture',
    categoria_fr:'🌿 Viticulture Mondiale',
    categoria_ru:'🌿 Мировое Виноделие',
    testo_it:
      '<p>Parlare di viticoltura eroica non significa usare una formula romantica. Significa parlare di pendenze vere, muretti da mantenere, vendemmie quasi interamente manuali, rese contenute e tempi di lavoro che in pianura sarebbero impensabili. Mosella, Valtellina e Douro non sono solo belli da fotografare: sono difficili da coltivare ogni giorno.</p>'+
      '<p>Per questo alcune bottiglie costano piu di quanto un confronto superficiale farebbe pensare. Non sempre il prezzo copre solo il marchio: a volte remunera una fatica agricola reale, un rischio maggiore e una precisione di lavoro che il vigneto semplice non richiede. Il territorio, qui, pesa sul vino molto prima del bicchiere.</p>',
    testo_en:
      '<p>Talking about heroic viticulture does not mean reaching for a romantic formula. It means talking about real gradients, dry-stone walls to maintain, harvests that are almost entirely manual, contained yields and working hours that would be unthinkable on flat land. Mosel, Valtellina and Douro are not just beautiful to photograph: they are genuinely difficult to farm every single day.</p>'+
      '<p>This is why certain bottles cost more than a superficial comparison would suggest. The price does not always reflect just the brand: sometimes it compensates for real agricultural hardship, greater risk and a precision of work that a simple vineyard does not demand. The territory here leaves its mark on the wine long before it reaches the glass.</p>',
    testo_fr:
      '<p>Parler de viticulture héroïque ne signifie pas employer une formule romantique. Cela signifie parler de vraies pentes, de murets à entretenir, de vendanges presque entièrement manuelles, de rendements maîtrisés et de temps de travail qui seraient impensables en plaine. La Moselle, la Valtellina et le Douro ne sont pas seulement beaux à photographier: ils sont difficiles à cultiver au quotidien.</p>'+
      '<p>C\'est pourquoi certaines bouteilles coûtent plus qu\'une comparaison superficielle ne le laisserait penser. Le prix ne couvre pas toujours uniquement la marque: il rémunère parfois une vraie fatigue agricole, un risque plus élevé et une précision de travail que le vignoble simple n\'exige pas. Le territoire, ici, pèse sur le vin bien avant le verre.</p>',
    testo_ru:
      '<p>Говорить о героическом виноделии — не значит прибегать к романтической формуле. Это значит говорить о реальных склонах, о каменных террасах, требующих постоянного ухода, о почти полностью ручном сборе урожая, об ограниченных урожаях и о рабочих часах, которые на равнине были бы немыслимы. Мозель, Вальтеллина и Дору — это не просто красивые пейзажи для фотографий: это территории, которые каждый день с трудом возделываются.</p>'+
      '<p>Именно поэтому некоторые бутылки стоят дороже, чем может показаться при поверхностном сравнении. Цена не всегда отражает только имя бренда: порой она компенсирует реальный сельскохозяйственный труд, повышенный риск и точность работы, которой простой виноградник не требует. Территория здесь оставляет след на вине задолго до того, как оно попадает в бокал.</p>',
    image_hint:'mosel vineyard steep slope heroic viticulture',
    immagine:'',
    data: window._getDataItaliana(),
    autore:'Sommelier World'
  },
  {
    id:'home_news_03',
    isNews:true,
    generato_ai:false,
    managed_seed:true,
    titolo_it:'Carta vini 2026: i sommelier giovani semplificano il linguaggio senza banalizzare il vino',
    titolo_en:'Wine list 2026: young sommeliers simplify language without dumbing down wine',
    titolo_fr:'Carte des vins 2026: les jeunes sommeliers simplifient le langage sans banaliser le vin',
    titolo_ru:'Карта вин 2026: молодые сомелье упрощают язык, не опошляя вино',
    categoria_it:'🎩 Sommelier del Mondo',
    categoria_en:'🎩 World Sommeliers',
    categoria_fr:'🎩 Sommeliers du Monde',
    categoria_ru:'🎩 Сомелье Мира',
    testo_it:
      '<p>Le carte vini piu convincenti non sono piu quelle che intimidiscono con cento pagine e descrizioni pensate solo per addetti ai lavori. Una nuova generazione di sommelier sta costruendo carte piu chiare, piu leggibili e piu orientate allo stile del vino, al momento di consumo e all abbinamento vero al tavolo.</p>'+
      '<p>Non e semplificazione povera: e mediazione intelligente. Quando il cliente capisce se un vino e teso, morbido, salino o adatto a un certo piatto, sceglie meglio e si sente guidato invece che escluso. E una delle trasformazioni piu sane del vino contemporaneo, perche rende la cultura piu accessibile senza svuotarla.</p>',
    testo_en:
      '<p>The most convincing wine lists are no longer those that intimidate with a hundred pages and descriptions written only for insiders. A new generation of sommeliers is building lists that are clearer, more readable and more oriented towards wine style, the moment of consumption and genuine food pairing at the table.</p>'+
      '<p>This is not poor simplification: it is intelligent mediation. When the guest understands whether a wine is taut, soft, saline or suited to a particular dish, they choose better and feel guided rather than excluded. It is one of the healthiest transformations in contemporary wine, because it makes culture more accessible without hollowing it out.</p>',
    testo_fr:
      '<p>Les cartes des vins les plus convaincantes ne sont plus celles qui intimident avec cent pages et des descriptions pensées uniquement pour les initiés. Une nouvelle génération de sommeliers construit des cartes plus claires, plus lisibles et plus orientées vers le style du vin, le moment de consommation et l\'accord véritable à table.</p>'+
      '<p>Ce n\'est pas une simplification appauvrie: c\'est une médiation intelligente. Quand le client comprend si un vin est tendu, souple, salin ou adapté à un plat précis, il choisit mieux et se sent guidé plutôt qu\'exclu. C\'est l\'une des transformations les plus saines du vin contemporain, parce qu\'elle rend la culture plus accessible sans la vider de son sens.</p>',
    testo_ru:
      '<p>Самые убедительные карты вин сегодня — уже не те, что пугают сотней страниц и описаниями, написанными исключительно для специалистов. Новое поколение сомелье создаёт карты более ясные, более читаемые и более ориентированные на стиль вина, момент потребления и настоящее гастрономическое сочетание за столом.</p>'+
      '<p>Это не бедное упрощение: это умная медиация. Когда гость понимает, является ли вино напряжённым, мягким, солёным или подходящим к определённому блюду, он выбирает лучше и чувствует себя ведомым, а не исключённым. Это одно из самых здоровых преобразований в современном виноделии, потому что оно делает культуру доступнее, не опустошая её.</p>',
    image_hint:'young sommelier wine service restaurant',
    immagine:'',
    data: window._getDataItaliana(),
    autore:'Sommelier World'
  },
  {
    id:'home_art_01',
    isNews:false,
    generato_ai:false,
    managed_seed:true,
    titolo_it:'Il cavatappi giusto cambia tutto: 4 modelli davvero utili e quando usarli',
    categoria_it:'🍷 Guida pratica',
    testo_it:_SAPERE_EDITORIALS[0].testo_it,
    image_hint:'sommelier knife corkscrew wine opener',
    immagine:'',
    data: window._getDataItaliana(),
    autore:'Sommelier World'
  },
  {
    id:'home_art_02',
    isNews:false,
    generato_ai:false,
    managed_seed:true,
    titolo_it:'Decanter: quando serve davvero e quando invece rovina il vino',
    categoria_it:'🍷 Servizio del vino',
    testo_it:_SAPERE_EDITORIALS[1].testo_it,
    image_hint:'wine decanter red wine glass',
    immagine:'',
    data: window._getDataItaliana(),
    autore:'Sommelier World'
  },
  {
    id:'home_art_03',
    isNews:false,
    generato_ai:false,
    managed_seed:true,
    titolo_it:'Il calice non e un dettaglio: quale forma scegliere per rosso, bianco e bollicine',
    categoria_it:'🍷 Guida pratica',
    testo_it:_SAPERE_EDITORIALS[2].testo_it,
    image_hint:'wine glasses tasting set',
    immagine:'',
    data: window._getDataItaliana(),
    autore:'Sommelier World'
  },
  {
    id:'home_art_04',
    isNews:false,
    generato_ai:false,
    managed_seed:true,
    titolo_it:'La cantina perfetta a casa non deve essere enorme: deve essere stabile',
    categoria_it:'🏠 Cantina domestica',
    testo_it:_SAPERE_EDITORIALS[5].testo_it,
    image_hint:'wine cellar oak barrels',
    immagine:'',
    data: window._getDataItaliana(),
    autore:'Sommelier World'
  }
];

window._ensureManagedArticleStore = function(){
  try {
    var key = 'sw_articles_seed_v56';
    var oldSeedTitles = [
      'Borgogna 2024: prezzi in tensione e allocazioni sempre piu ristrette',
      'Mosella, Valtellina, Douro: la viticoltura eroica torna al centro del racconto mondiale',
      'I sommelier under 30 cambiano il linguaggio del vino in sala e online'
    ];
    var current = JSON.parse(localStorage.getItem('sw_articles') || '[]');
    if(!Array.isArray(current)) current = [];
    var byId = {};
    current.forEach(function(item){
      if(item && item.id) byId[item.id] = item;
    });
    var managedIds = window._HOME_MANAGED_DEFAULTS.map(function(item){ return item.id; });
    if(localStorage.getItem(key) === '1' && current.length) return current;
    var seeded = window._HOME_MANAGED_DEFAULTS.map(function(item, idx){
      var existing = byId[item.id];
      var preserve = !!(existing && (
        existing.updated_manually ||
        (existing.titolo_it && oldSeedTitles.indexOf(existing.titolo_it) === -1 && existing.titolo_it !== item.titolo_it)
      ));
      var base = preserve ? Object.assign({}, item, existing) : Object.assign({}, item);
      base.immagine = base.immagine || window.getArticleImage((base.image_hint || base.titolo_it || '') + ' ' + (base.categoria_it || ''), idx + 40);
      return base;
    });
    var extras = current.filter(function(item){
      return item && managedIds.indexOf(item.id) === -1;
    });
    var finalData = window._dedupeArticles(seeded.concat(extras));
    localStorage.setItem('sw_articles', JSON.stringify(finalData));
    localStorage.setItem(key, '1');
    return finalData;
  } catch(e) {
    return window._HOME_MANAGED_DEFAULTS.map(function(item, idx){
      return Object.assign({}, item, {
        immagine: item.immagine || window.getArticleImage((item.image_hint || item.titolo_it || '') + ' ' + (item.categoria_it || ''), idx + 40)
      });
    });
  }
};

/* Seleziona 3 temi per oggi (diversi ogni giorno) */
window._selectDailyTopics = function(offset) {
  var seed = window._daySeed() + (offset||0);
  var pool = window._SAPERE_TOPICS.slice();
  for (var i=pool.length-1; i>0; i--) {
    seed = (seed*1664525+1013904223)&0xffffffff;
    var j = Math.abs(seed)%(i+1);
    var tmp=pool[i]; pool[i]=pool[j]; pool[j]=tmp;
  }
  return pool.slice(0,3);
};

/* Genera articolo via Worker e mette in cache (oggi) */
window._generateSapereArticle = async function(topic, index) {
  var lang = window.getLang ? window.getLang() : 'it';
  var today = new Date().toISOString().split('T')[0];
  var cKey = 'sw_sap_'+today+'_'+index+'_'+lang;
  /* Ogni lingua ha il suo cache separato */

  /* Controlla cache localStorage */
  try {
    var cached = localStorage.getItem(cKey);
    if(cached) {
      var art = JSON.parse(cached);
      window._sapereCache[index] = art;
      return art;
    }
  } catch(e){}

  /* Genera via Worker */
  /* Timeout 20s */
  var WORKER = (function(){
    try {
      if(window.SRV) return window.SRV;
      var h = (window.location && window.location.hostname) ? window.location.hostname : '';
      if(h && (h === 'sommelierworld.vin' || h.endsWith('.sommelierworld.vin'))) return window.location.origin;
    } catch(e) {}
    return 'https://hidden-term-f2d0.timotiniurie49.workers.dev';
  })();
  var d = await window._aiCallWithRetry(async function(){
    var ctrl = new AbortController();
    var timer = setTimeout(function(){ ctrl.abort(); }, 18000);
    try {
      var r = await fetch(WORKER+'/api/article', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({topic:topic, lang:lang||'it'}),
        signal:ctrl.signal,
      });
      clearTimeout(timer);
      var resp = await r.json();
      if(!resp||!resp.titolo||!resp.testo) throw new Error(resp.error||'Risposta non valida');
      return resp;
    } catch(e){ clearTimeout(timer); throw e; }
  }, 1);

  var art = {
    id:'sap_dyn_'+today+'_'+index,
    ['titolo_'+lang]: d.titolo,
    ['testo_'+lang]:  d.testo,
    titolo_it: lang==='it' ? d.titolo : topic,
    testo_it:  lang==='it' ? d.testo  : '',
    categoria_it:'🍷 Il Sapere del Vino',
    immagine: d.image || window.getTopicPhoto(topic,'🍷 Il Sapere del Vino', index),
    isNews:false, generato_ai:true,
  };

  /* Salva in cache */
  try { localStorage.setItem(cKey, JSON.stringify(art)); } catch(e){}
  window._sapereCache[index] = art;
  return art;
};

/* Carica e renderizza le card sapere (3 articoli dinamici) */
/* Wrapper AI con retry dopo pausa — gestisce rate limit automaticamente */
window._aiCallWithRetry = async function(fetchFn, maxRetries) {
  maxRetries = maxRetries || 2;
  for (var attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      var result = await fetchFn();
      return result;
    } catch(e) {
      if (attempt < maxRetries) {
        /* Aspetta prima di riprovare: 3s primo retry, 6s secondo */
        await new Promise(function(r){ setTimeout(r, 3000 * (attempt + 1)); });
      } else {
        throw e;
      }
    }
  }
};

window._selectDailyEditorials = function(offset, count) {
  var pool = _SAPERE_EDITORIALS.slice();
  var seed = window._daySeed();
  var out = [];
  count = count || 3;
  offset = offset || 0;
  for (var i=pool.length-1; i>0; i--) {
    seed = (seed*1664525+1013904223)&0xffffffff;
    var j = Math.abs(seed)%(i+1);
    var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
  }
  for (var k=0; k<count && k<pool.length; k++) {
    var item = pool[(offset + k) % pool.length];
    out.push({
      id: item.id,
      isNews: false,
      titolo_it: item.titolo_it,
      testo_it: item.testo_it,
      categoria_it: item.categoria_it,
      titolo_en: '',
      testo_en: '',
      categoria_en: '',
      titolo_fr: '',
      testo_fr: '',
      categoria_fr: '',
      titolo_ru: '',
      testo_ru: '',
      categoria_ru: '',
      immagine: window._buildEditorialImage(item.image_query, k + offset),
      gallery: window._buildEditorialGallery(item.gallery_specs, (offset * 10) + (k * 4)),
      data: window._getDataItaliana(),
      generato_ai: false
    });
  }
  return out;
};

window._shuffleEditorialPool = function(items, salt) {
  var pool = (items || []).filter(Boolean).slice();
  var seed = (window._daySeed ? window._daySeed() : 1) + (salt || 0);
  for (var i = pool.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    var j = Math.abs(seed) % (i + 1);
    var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
  }
  return pool;
};

window._getAutoHomeNewsSelection = function(count) {
  count = count || 3;
  var pool = [];
  if(typeof window._getHomeSelectableArticles === 'function') {
    try {
      pool = window._getHomeSelectableArticles().filter(function(a){ return a && a.isNews; });
    } catch(e) {}
  }
  if(!pool.length && Array.isArray(window._arts)) pool = window._arts.filter(function(a){ return a && a.isNews; });
  pool = window._dedupeArticles(pool);
  return window._shuffleEditorialPool(pool, 21).slice(0, count);
};

window._getAutoHomeSapereSelection = function(count) {
  count = count || 3;
  var map = {};
  function add(item){
    if(!item || !item.id || item.isNews || map[item.id]) return;
    map[item.id] = item;
  }
  if(typeof window._getHomeSelectableArticles === 'function') {
    try { window._getHomeSelectableArticles().forEach(add); } catch(e) {}
  }
  if(typeof window._selectDailyEditorials === 'function') {
    try { window._selectDailyEditorials(0, 6).forEach(add); } catch(e2) {}
  }
  var pool = window._dedupeArticles(Object.keys(map).map(function(id){ return map[id]; }));
  return window._shuffleEditorialPool(pool, 77).slice(0, count);
};

window._migrateLegacyFixedHomeEditorialSelection = function() {
  try {
    var key = 'sw_home_auto_rotation_v57';
    if(localStorage.getItem(key) === '1') return;
    if(typeof window.getHomeLayoutConfig !== 'function' || typeof window.saveHomeLayoutConfig !== 'function') return;
    var cfg = window.getHomeLayoutConfig({ mode:'draft' });
    var changed = false;
    cfg = cfg.map(function(item){
      if(!item || item.id !== 'news') return item;
      var sameNews = JSON.stringify((item.articleIds || []).slice(0,3)) === JSON.stringify(['home_news_01','home_news_02','home_news_03']);
      var sameArts = JSON.stringify((item.sapereArticleIds || []).slice(0,3)) === JSON.stringify(['home_art_01','home_art_02','home_art_03']);
      if(!sameNews && !sameArts) return item;
      changed = true;
      return Object.assign({}, item, {
        articleIds: sameNews ? [] : item.articleIds,
        sapereArticleIds: sameArts ? [] : item.sapereArticleIds
      });
    });
    if(changed) window.saveHomeLayoutConfig(cfg, 'Rotazione editoriale automatica riattivata per la Home.');
    localStorage.setItem(key, '1');
  } catch(e) {}
};

window.renderHomeEditorialGrid = function() {
  var host = document.getElementById('homeEditorialGrid');
  if(!host) return;
  var newsPool = (window._arts && window._arts.length ? window._arts.slice() : []);
  var layoutItem = typeof window._getHomeLayoutItem === 'function' ? window._getHomeLayoutItem('news') : null;
  var configuredIds = (layoutItem && Array.isArray(layoutItem.articleIds)) ? layoutItem.articleIds.filter(Boolean) : [];
  var lead = null;
  var side = [];
  host.style.display = '';
  if(configuredIds.length) {
    var poolMap = {};
    function addToPool(art){
      if(!art || !art.id || poolMap[art.id]) return;
      poolMap[art.id] = art;
    }
    newsPool.forEach(addToPool);
    side.forEach(addToPool);
    if(typeof window._getHomeSelectableArticles === 'function') {
      window._getHomeSelectableArticles().forEach(addToPool);
    }
    var picked = configuredIds.map(function(id){ return poolMap[id] || null; }).filter(Boolean);
    if(picked.length) {
      lead = picked[0] || lead;
      side = picked.slice(1, 3);
      if(side.length < 2) {
        var fallback = newsPool.filter(function(art){
          return art && (!lead || art.id !== lead.id) && !side.some(function(sel){ return sel && sel.id === art.id; });
        });
        while(side.length < 2 && fallback.length) side.push(fallback.shift());
      }
    }
  } else {
    var autoPicked = window._getAutoHomeNewsSelection(3);
    lead = autoPicked[0] || null;
    side = autoPicked.slice(1, 3);
  }
  if(!lead) { host.innerHTML = ''; return; }

  function makeBlock(art, cls){
    var _lang = window.getLang ? window.getLang() : 'it';
    var tit = art['titolo_'+_lang] || art.titolo_it || art.titolo || '';
    var txt = window._plainPreviewText(art['testo_'+_lang] || art.testo_it || art.testo || '');
    var cat = art['categoria_'+_lang] || art.categoria_it || art.categoria || '';
    var img = art.immagine || window.getTopicPhoto(tit, cat, 0);
    return '<article class="'+cls+'" data-artid="'+(art.id || '')+'">'+
      '<img src="'+img+'" alt="" loading="lazy" onerror="this.style.display=\'none\';">'+
      '<div class="sw-editorial-overlay"></div>'+
      '<div class="sw-editorial-copy">'+
        '<div class="sw-editorial-kicker">'+cat+'</div>'+
        '<div class="sw-editorial-title">'+tit+'</div>'+
        '<div class="sw-editorial-text">'+txt.substring(0, cls === 'sw-editorial-lead' ? 210 : 150)+'…</div>'+
      '</div>'+
    '</article>';
  }

  host.innerHTML =
    '<div class="sw-editorial-grid">'+
      makeBlock(lead, 'sw-editorial-lead')+
      '<div class="sw-editorial-side">'+side.map(function(a){ return makeBlock(a, 'sw-editorial-card'); }).join('')+'</div>'+
    '</div>';

  var cards = host.querySelectorAll('[data-artid]');
  cards.forEach(function(node, idx){
    var art = idx === 0 ? lead : side[idx - 1];
    if(!art) return;
    node.onclick = function(){ window.openArticleReader && window.openArticleReader(art); };
  });
};

window._loadSapereCards = async function() {
  var container = document.getElementById('sapereCards');
  if(!container) return;
  var loadToken = ++window._sapereLoadToken;
  container.innerHTML = '';
  var lang = window.getLang ? window.getLang() : 'it';
  window._sapereCache = [];
  var items = window._getAutoHomeSapereSelection(3);
  var layoutItem = typeof window._getHomeLayoutItem === 'function' ? window._getHomeLayoutItem('news') : null;
  var configuredIds = (layoutItem && Array.isArray(layoutItem.sapereArticleIds)) ? layoutItem.sapereArticleIds.filter(Boolean) : [];
  if(configuredIds.length && typeof window._getHomeSelectableArticles === 'function') {
    var pool = {};
    window._getHomeSelectableArticles().forEach(function(art){
      if(art && art.id && !pool[art.id]) pool[art.id] = art;
    });
    var picked = configuredIds.map(function(id){ return pool[id] || null; }).filter(Boolean);
    if(picked.length) items = picked;
  }
  if(loadToken !== window._sapereLoadToken) return;

  for(var i=0; i<Math.min(3, items.length); i++) {
    var art = items[i];
    window._sapereCache[i] = art;
    var tit = art['titolo_'+lang] || art.titolo_it;
    var txt = art['testo_'+lang] || art.testo_it;
    var txtPreview = window._plainPreviewText(txt);
    var img = art.immagine;
    var card = document.createElement('div');
    card.className = 'sw-art';
    var imgHtml = '<img class="sw-art-img" src="'+img+'" alt="" loading="lazy" onerror="this.style.display=\'none\';">';
    card.innerHTML =
      imgHtml+
      '<div class="sw-art-body">'+
        '<div class="sw-art-tag">'+art.categoria_it+'</div>'+
        '<div class="sw-art-tit">'+tit+'</div>'+
        '<div class="sw-art-txt">'+txtPreview.substring(0,220)+'…</div>'+
        '<div class="sw-art-foot">'+(art.data || window._getDataItaliana())+'</div>'+
      '</div>';
    (function(a){ card.onclick=function(){window.openArticleReader(a);}; })(art);
    container.appendChild(card);
  }
};

var _SAPERE_EXTRA = [];

window._loadCuriositaAndTecnica = function() {
  _SAPERE_EXTRA = [];
  
  if(window.WINE_CURIOSITA) {
    for(var key in window.WINE_CURIOSITA) {
      var item = window.WINE_CURIOSITA[key];
      _SAPERE_EXTRA.push({
        id: 'cur_' + key,
        cat: '✨ Curiosità',
        titolo: item.titolo,
        testo: item.testo,
        immagine: item.immagine
      });
    }
  }
  
  if(window.WINE_TECNICA) {
    for(var key in window.WINE_TECNICA) {
      var item = window.WINE_TECNICA[key];
      _SAPERE_EXTRA.push({
        id: 'tec_' + key,
        cat: '🍷 Il Sapere del Vino',
        titolo: item.titolo,
        testo: item.testo,
        immagine: item.immagine
      });
    }
  }
};

window._loadCuriositaAndTecnica();

window._SAPERE = _SAPERE_EDITORIALS.concat(_SAPERE_EXTRA).concat(
  _GAZZETTA.filter(function(g){return g.cat==='🍷 Il Sapere del Vino';})
);

// ═══════════════════════════════════════════════════════════
// STATO CAROUSEL
// ═══════════════════════════════════════════════════════════
window._arts   = [];
window._sIdx   = 0;
window._sTimer = null;

// ═══════════════════════════════════════════════════════════
// RENDER CAROUSEL — GLOBALE
// ═══════════════════════════════════════════════════════════
window.renderSlides = function() {
  var area  =document.getElementById('slArea');
  var dotsEl=document.getElementById('slDots');
  var cntEl =document.getElementById('newsCnt');
  if(!area) return;

  /* Il carousel usa sempre la versione italiana — la traduzione avviene aprendo l'articolo */
  var lang=(window.getLang?window.getLang():'it');
  var arts=window._arts.slice(0,7);
  if(!arts.length) arts=window._ensureManagedArticleStore().filter(function(a){ return !!a.isNews; }).slice(0,7);

  if(cntEl) cntEl.textContent=arts.length+' articoli';

  if(window._sTimer){clearInterval(window._sTimer);window._sTimer=null;}

  var oggi=window._getDataItaliana();

  area.innerHTML='';
  arts.forEach(function(a,i){
    /* Usa traduzione diretta se disponibile, poi cache, poi italiano */
    var tit = a['titolo_'+lang] || '';
    var txt = a['testo_'+lang]  || '';
    var cat = a['categoria_'+lang] || a.categoria_it || a.categoria || '';
    if(!tit || tit === (a.titolo_it||a.titolo||'')) {
      /* Cerca nel cache localStorage */
      if(lang !== 'it' && window._trCache && a.id) {
        var ct = window._trCache.get(a.id, lang, 'titolo');
        var cx = window._trCache.get(a.id, lang, 'testo');
        if(ct) { tit = ct; a['titolo_'+lang] = ct; }
        if(cx) { txt = cx; a['testo_'+lang]  = cx; }
      }
    }
    /* Fallback italiano */
    if(!tit) tit = a.titolo_it || a.titolo || '';
    if(!txt) txt = a.testo_it  || a.testo  || '';
    var txtPreview = window._plainPreviewText(txt);
    var img=a.immagine||window.getTopicPhoto(tit,cat,i);

    var sl=document.createElement('div');
    sl.className='sw-slide'+(i===0?' on':'');

    /* Rendering immagine: sempre URL reale */
    var imgEl=document.createElement('img');
    imgEl.className='sw-bg'; imgEl.alt=''; imgEl.loading=i===0?'eager':'lazy'; imgEl.src=img;
    imgEl.onerror=function(){
      this.style.display='none';
      this.parentNode.style.background='linear-gradient(160deg,#0f0505 0%,#1a0808 50%,#250d0d 100%)';
    };

    var grad=document.createElement('div'); grad.className='sw-grad';

    var body=document.createElement('div'); body.className='sw-body';
    body.innerHTML=
      '<div class="sw-slide-date">'+oggi+'</div>'+
      '<div class="sw-slide-cat">'+cat+'</div>'+
      '<div class="sw-slide-tit">'+tit+'</div>'+
      '<div class="sw-slide-txt">'+txtPreview.substring(0,140)+'…</div>'+
      '<div class="sw-slide-read">Leggi l\'articolo →</div>';

    sl.appendChild(imgEl); sl.appendChild(grad); sl.appendChild(body);
    (function(art){sl.addEventListener('click',function(){window.openArticleReader(art);});})(a);
    area.appendChild(sl);
  });

  // Dots
  if(dotsEl){
    dotsEl.innerHTML='';
    arts.forEach(function(_,i){
      var d=document.createElement('button');
      d.className='sw-dot'+(i===0?' on':'');
      d.setAttribute('aria-label','Articolo '+(i+1));
      (function(idx){d.addEventListener('click',function(){window.goSlide(idx);});})(i);
      dotsEl.appendChild(d);
    });
  }

  window._sIdx=0;
  if(arts.length>1){
    window._sTimer=setInterval(function(){
      window._sIdx=(window._sIdx+1)%arts.length;
      window.goSlide(window._sIdx);
    },6000);
  }

  // Touch swipe
  var _tx=0;
  area.addEventListener('touchstart',function(e){_tx=e.touches[0].clientX;},{passive:true});
  area.addEventListener('touchend',function(e){
    var dx=e.changedTouches[0].clientX-_tx;
    if(Math.abs(dx)>40){
      if(window._sTimer){clearInterval(window._sTimer);window._sTimer=null;}
      window._sIdx=dx<0?(window._sIdx+1)%arts.length:(window._sIdx-1+arts.length)%arts.length;
      window.goSlide(window._sIdx);
      setTimeout(function(){
        if(!window._sTimer)
          window._sTimer=setInterval(function(){window._sIdx=(window._sIdx+1)%arts.length;window.goSlide(window._sIdx);},6000);
      },8000);
    }
  },{passive:true});
};

window.goSlide=function(idx){
  window._sIdx=idx;
  document.querySelectorAll('#slArea .sw-slide').forEach(function(s,j){s.classList.toggle('on',j===idx);});
  document.querySelectorAll('#slDots .sw-dot').forEach(function(d,k){d.classList.toggle('on',k===idx);});
};

// ═══════════════════════════════════════════════════════════
// SEZIONE "IL SAPERE DEL VINO" — card con immagine
// ═══════════════════════════════════════════════════════════
window._sapereOffset = 0;

window._sapereShowMore = function() {
  window._sapereOffset += 3;
  if(typeof window._loadSapereCards==='function') window._loadSapereCards();
};

window.renderSapere=function(arts){
  /* Delega alla generazione dinamica */
  if(typeof window._loadSapereCards === 'function') {
    window._loadSapereCards();
    return;
  }

};

window.loadRealNews = async function() {
  try {
    var today = new Date().toISOString().slice(0,10);
    var base = (window.SRV||'https://hidden-term-f2d0.timotiniurie49.workers.dev');
    var r = await fetch(base+'/api/news?date='+encodeURIComponent(today)+'&limit=5&ts='+(Date.now()));
    var d = await r.json();
    if(!d.articles||!d.articles.length) return null;
    return d.articles;
  } catch(e) {
    return null;
  }
};

/* ─── Svuota TUTTO il cache articoli (localStorage) ─── */
window.swNuclearClear = function() {
  try {
    var keys = Object.keys(localStorage);
    var removed = 0;
    keys.forEach(function(k) {
      if(k.startsWith('sw_sap_') || k.startsWith('sw_news') || k.startsWith('sw_trans_')) {
        localStorage.removeItem(k);
        removed++;
      }
    });
    console.log('[News] Nuclear clear: rimossi '+removed+' elementi da localStorage');
    return removed;
  } catch(e) { return 0; }
};

window.loadServerArts=function(){
  /* Mantieni i contenuti editoriali: resetta solo cache temporanee se serve */
  try { window._migrateLegacyFixedHomeEditorialSelection(); } catch(_migrErr) {}
  try {
    var BUILD = '2026-05-09-v56';
    var savedBuild = localStorage.getItem('sw_build');
    if(savedBuild !== BUILD) {
      window.swNuclearClear();
      localStorage.setItem('sw_build', BUILD);
      console.log('[News] Reset cache temporanee — BUILD '+BUILD);
    }
  } catch(e) {}
  /* Contenuti Home gestiti dall'Admin/localStorage */
  try {
    var stored = window._ensureManagedArticleStore();
    var allArts = window._dedupeArticles(stored);
    var newsOnly = allArts.filter(function(a){ return !!a.isNews; });
    var sapereOnly = allArts.filter(function(a){ return !a.isNews; });

    /* Assegna immagini contestuali solo se mancanti */
    allArts.forEach(function(a, i) {
      if(!a.immagine||!a.immagine.startsWith('http')) {
        a.immagine = window.getTopicPhoto(a.titolo_it||a.titolo||'', a.categoria_it||a.categoria||'', i);
      }
    });

    /* Applica traduzioni cached — PRIMA di qualsiasi render! */
    var curLang = window.getLang ? window.getLang() : 'it';
    allArts.forEach(function(a){
      if(curLang !== 'it') {
        window._trCache.applyToArt(a, curLang);
      }
    });

    window._arts = newsOnly.slice(0, 8);
    window.renderSlides();
    if(typeof window.renderHomeEditorialGrid === 'function') window.renderHomeEditorialGrid();

    var sapere = window._dedupeArticles(sapereOnly).slice(0,3);
    if(!sapere.length) sapere = window._selectDailyEditorials(0,3);
    sapere.forEach(function(a){
      if(curLang !== 'it') {
        window._trCache.applyToArt(a, curLang);
      }
    });
    window.renderSapere(sapere);

    /* Auto-traduzione DISABILITATA all'avvio per evitare rate limit Groq.
       La traduzione parte solo quando l'utente cambia lingua manualmente. */
  } catch(e) {
    var fallback = window._ensureManagedArticleStore();
    window._arts = fallback.filter(function(a){ return !!a.isNews; }).slice(0, 8);
    var curLang = window.getLang ? window.getLang() : 'it';
    if(curLang !== 'it') {
      window._arts.forEach(function(a){ window._trCache.applyToArt(a, curLang); });
    }
    window.renderSlides();
    if(typeof window.renderHomeEditorialGrid === 'function') window.renderHomeEditorialGrid();
    var sapere = fallback.filter(function(a){ return !a.isNews; }).slice(0,3);
    sapere.forEach(function(a){
      if(curLang !== 'it') {
        window._trCache.applyToArt(a, curLang);
      }
    });
    window.renderSapere(sapere);
  }
};

// Admin → Carousel
// ═══════════════════════════════════════════════════════════
// ADMIN NOTIZIE — funzioni chiamate dall'admin panel
// ═══════════════════════════════════════════════════════════
window.adminSaveNews = async function() {
  var editId = ((document.getElementById('newsAdminEditId')||{}).value||'').trim();
  var tit  = ((document.getElementById('newsAdminTitolo')||{}).value||'').trim();
  var cat  = ((document.getElementById('newsAdminCat')   ||{}).value||'');
  var img  = ((document.getElementById('newsAdminImg')   ||{}).value||'');
  var txt  = ((document.getElementById('newsAdminTesto') ||{}).value||'').trim();
  var st   = document.getElementById('newsAdminStatus');
  if(!tit||!txt){ if(st){st.style.color='#f88';st.textContent='✗ Titolo e testo obbligatori.';} return; }
  if(st){ st.style.color='rgba(212,175,55,.5)'; st.textContent='⏳ Pubblicazione…'; }
  try {
    var today=new Date().toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'});
    var art={
      id:editId||('news_'+Date.now()), generato_ai:false, isNews:true,
      titolo_it:tit, titolo_en:tit, titolo_fr:tit,
      testo_it:txt, testo_en:txt, testo_fr:txt,
      categoria_it:cat, categoria_en:cat, categoria_fr:cat,
      immagine:img||'', autore:'Sommelier World', data:today, updated_manually:true
    };
    var arts = window._adminGetStoredArticles ? window._adminGetStoredArticles() : JSON.parse(localStorage.getItem('sw_articles')||'[]');
    var idx = arts.findIndex(function(item){ return item.id === art.id; });
    if(idx >= 0) arts[idx] = Object.assign({}, arts[idx], art);
    else arts.unshift(art);
    if(window._adminSetStoredArticles) window._adminSetStoredArticles(arts);
    else localStorage.setItem('sw_articles', JSON.stringify(arts));
    if(st){ st.style.color='#5dde8a'; st.textContent=editId ? '✓ Notizia aggiornata nella Home!' : '✓ Notizia pubblicata nel carousel!'; }
    if(typeof window.adminResetNewsForm==='function') window.adminResetNewsForm();
    if(typeof window.adminRefreshEditorialWorkspace==='function') window.adminRefreshEditorialWorkspace({ immediate:true });
    else window.loadServerArts();
  } catch(e) { if(st){ st.style.color='#f88'; st.textContent='✗ '+e.message; } }
};

window.adminGenNews = async function() {
  var btn = document.getElementById('btnGenNews');
  var st  = document.getElementById('newsAdminStatus');
  if(btn) btn.disabled=true;
  if(st)  { st.style.color='rgba(212,175,55,.5)'; st.textContent='⏳ Generazione con AI…'; }
  if(typeof window.callAPI !== 'function') {
    if(st){ st.style.color='#f88'; st.textContent='✗ AI non ancora caricata. Riprova.'; }
    if(btn) btn.disabled=false; return;
  }
  try {
    var sys = 'Sei un giornalista enologico di livello alto. Scrivi come un grande articolo di rivista: elegante, narrativo, preciso, mai generico, mai ripetitivo. '+
      'Ogni testo deve avere un taglio diverso e una voce diversa dagli altri. '+
      'IMPORTANTE: Usa SOLO dati verificati dal nostro database wine_database.js. Non inventare fatti, nomi, o date. '+
      'Rispondi SOLO con JSON valido: {"titolo":"...","categoria":"🗞 Attualità del Vino","testo":"...","image_keywords":"3-4 parole inglese descrittive foto specifica es: burgundy pinot noir vineyard rows"}. '+
      'IL TESTO DEVE ESSERE LUNGO: ALMENO 900-1200 PAROLE, DIVISO IN 6 PARAGRAFI RICCHI. Ogni paragrafo deve avere un tema chiaro e contenere dettagli reali, contesto, atmosfera, spiegazione e conseguenze. Nessun testo fuori dal JSON.';
    var count = 0;
    for(var i=0; i<3; i++) {
      try {
        var res = await window.callAPI(sys, 'Genera notizia vino numero '+(i+1)+' su un tema diverso dagli altri.', 'it');
        var json = JSON.parse(res.replace(/```json|```/g,'').trim());
        if(json.titolo && json.testo) {
          var keywords = json.image_keywords || 'wine vineyard italy';
          var art = {
            id:'gen_'+Date.now()+'_'+i, isNews:true, generato_ai:true,
            titolo_it:json.titolo, testo_it:json.testo, categoria_it:json.categoria||'🗞 Attualità del Vino',
            titolo_en:'', testo_en:'', categoria_en:json.categoria||'Wine News',
            titolo_fr:'', testo_fr:'', categoria_fr:json.categoria||'Actualité du Vin',
            immagine:'https://source.unsplash.com/featured/1600x900/?' + encodeURIComponent(keywords) + '&sig=' + Date.now(), autore:'AI', data:new Date().toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'}),
          };
          var arts = JSON.parse(localStorage.getItem('sw_articles')||'[]');
          arts.unshift(art);
          localStorage.setItem('sw_articles', JSON.stringify(arts));
          count++;
        }
      } catch(e2) { }
    }
    if(st){ st.style.color='#5dde8a'; st.textContent='✓ '+count+' notizie generate!'; }
    if(typeof window.adminRefreshEditorialWorkspace==='function') window.adminRefreshEditorialWorkspace({ immediate:true });
    else window.loadServerArts();
  } catch(e) {
    if(st){ st.style.color='#f88'; st.textContent='✗ '+e.message; }
  } finally { if(btn) btn.disabled=false; }
};

window.adminLoadNews = function() {
  var el = document.getElementById('adminNewsList');
  if(!el) return;
  var data = [];
  try {
    if(typeof window._getHomeSelectableArticles === 'function') data = window._getHomeSelectableArticles();
    else data = (window._adminGetStoredArticles ? window._adminGetStoredArticles() : JSON.parse(localStorage.getItem('sw_articles') || '[]'));
  } catch(e) {}
  data = (data || []).filter(function(a){ return !!(a && a.isNews); }).filter(function(item, idx, arr){
    return item && item.id && arr.findIndex(function(other){ return other && other.id === item.id; }) === idx;
  });
  if(!data.length) {
    el.innerHTML = '<p style="color:rgba(245,239,226,.3);font-style:italic;padding:10px 0;">Nessuna notizia salvata.</p>';
    return;
  }

  el.innerHTML = '';
  data.forEach(function(a){
    var row = document.createElement('div');
    row.style.cssText = 'padding:12px 14px;margin-bottom:8px;background:rgba(255,255,255,.03);border:1px solid rgba(212,175,55,.08);border-radius:8px;';
    row.innerHTML =
      '<div style="display:flex;align-items:center;gap:10px;">'+
        '<div style="flex:1;min-width:0;">'+
          '<div style="font-family:Cinzel,serif;font-size:.62rem;color:#F5EFE2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+(a.titolo_it||'(senza titolo)')+'</div>'+
          '<div style="font-size:11px;color:rgba(212,175,55,.45);margin-top:4px;">'+(a.categoria_it||'🗞 Attualità del Vino')+' · '+(a.data||'')+'</div>'+
        '</div>'+
        '<button data-addhome="'+a.id+'" style="padding:6px 10px;background:rgba(93,222,138,.12);border:1px solid rgba(93,222,138,.34);border-radius:4px;color:#5dde8a;font-size:11px;cursor:pointer;">In Home</button>'+
        '<button data-newsid="'+a.id+'" style="padding:6px 10px;background:rgba(212,175,55,.1);border:1px solid rgba(212,175,55,.3);border-radius:4px;color:#D4AF37;font-size:11px;cursor:pointer;">Modifica</button>'+
        '<button data-delnews="'+a.id+'" style="padding:6px 10px;background:rgba(200,50,50,.1);border:1px solid rgba(200,50,50,.3);border-radius:4px;color:#f88;font-size:11px;cursor:pointer;">Elimina</button>'+
      '</div>'+
      '<div style="margin-top:8px;font-size:12px;color:rgba(245,239,226,.55);line-height:1.6;">'+String(a.testo_it||'').slice(0,220)+'...</div>';

    var homeBtn = row.querySelector('[data-addhome]');
    if(homeBtn) {
      homeBtn.onclick = function() {
        if(typeof window.adminAddArticleToHome === 'function') window.adminAddArticleToHome(a.id, 'news');
      };
    }

    var editBtn = row.querySelector('[data-newsid]');
    if(editBtn) {
      editBtn.onclick = function() {
        if(typeof window.adminEditNewsItem === 'function') window.adminEditNewsItem(a.id);
      };
    }

    var delBtn = row.querySelector('[data-delnews]');
    if(delBtn) {
      delBtn.onclick = function() {
        if(!confirm('Eliminare questa notizia?')) return;
        try {
          var all = window._adminGetStoredArticles ? window._adminGetStoredArticles() : JSON.parse(localStorage.getItem('sw_articles') || '[]');
          all = all.filter(function(item){ return item.id !== a.id; });
          if(window._adminSetStoredArticles) window._adminSetStoredArticles(all);
          else localStorage.setItem('sw_articles', JSON.stringify(all));
          if(typeof window.adminRefreshEditorialWorkspace==='function') window.adminRefreshEditorialWorkspace({ immediate:true });
          else if(typeof window.loadServerArts==='function') window.loadServerArts();
        } catch(e) {}
      };
    }

    el.appendChild(row);
  });
  if(typeof window.adminRenderHomeContentLists==='function') window.adminRenderHomeContentLists();
};

/* Traduce articoli in lingua corrente e aggiorna le card immediatamente */
window.translateAndRefresh = async function(lang) {
  /* Lingua italiana: render immediato senza traduzione */
  if(!lang || lang==='it') {
    if(typeof window.renderSlides==='function') window.renderSlides();
    if(typeof window.renderSapere==='function') window.renderSapere([]);
    if(typeof window.translateUI === 'function') window.translateUI(lang || 'it');
    if(window._currentOpenArticle && typeof window.openArticleReader === 'function') {
      window.openArticleReader(window._currentOpenArticle);
    }
    return;
  }
  if(typeof window.translateAllArticles !== 'function') {
    /* callAPI non ancora caricato: render con italiano */
    if(typeof window.renderSlides==='function') window.renderSlides();
    if(typeof window.renderSapere==='function') window.renderSapere([]);
    return;
  }

  /* Costruisce lista articoli da tradurre */
  var allArts = [];
  /* Articoli carousel */
  if(window._arts) allArts = allArts.concat(window._arts);
  /* Articoli sapere — converti in formato standard */
  if(window._SAPERE) {
    window._SAPERE.forEach(function(s){
      var tit = s.titolo_it || s.titolo || '';
      var txt = s.testo_it || s.testo || '';
      if(s.id && txt) allArts.push({id:s.id, titolo_it:tit, testo_it:txt});
    });
  }

  /* Render immediato con quello che c'è in cache */
  if(typeof window.renderSlides==='function') window.renderSlides();
  if(typeof window.renderSapere==='function') window.renderSapere([]);

  /* Controlla se ci sono articoli senza traduzione */
  var needsTrans = allArts.filter(function(a){
    return a.id && !window._trCache.has(a.id, lang);
  });

  if(!needsTrans.length) return; /* tutto in cache — già fatto */

  /* Mostra ⏳ nel FAB e spinner nelle card */
  if(typeof window._showTranslating==='function') window._showTranslating(true);
  var sapC = document.getElementById('sapereCards');
  if(sapC && sapC.children.length) {
    var loader = document.createElement('div');
    loader.style.cssText='text-align:center;padding:12px;font-family:Cinzel,serif;'+
      'font-size:.44rem;letter-spacing:2px;color:rgba(212,175,55,.4);';
    loader.textContent='⏳ Traduzione in corso…';
    sapC.insertBefore(loader, sapC.firstChild);
  }

  try {
    await window.translateAllArticles(allArts, lang);
    if (typeof window.translateUI === 'function') window.translateUI(lang);
    if (window._currentOpenArticle && typeof window.openArticleReader === 'function') {
      window.openArticleReader(window._currentOpenArticle);
    }
    /* Aggiorna tutto con le traduzioni appena generate */
    if(typeof window.renderSlides==='function') window.renderSlides();
    if(typeof window.renderSapere==='function') window.renderSapere([]);
  } catch(e) {
  } finally {
    if(typeof window._showTranslating==='function') window._showTranslating(false);
  }
};

window.syncAfterAdminSave=function(){
  setTimeout(function(){window.loadServerArts();},1200);
};


// ═══════════════════════════════════════════════════════════
// EVENTI DEL VINO 2026 — render nella home
// ═══════════════════════════════════════════════════════════
window._EVENTI = [
  {
    data:'15–18 Maggio 2026', luogo:'Bordeaux, Francia',
    nome:'Vinexpo Bordeaux 2026',
    desc:'Il salone internazionale del vino più antico d\'Europa. 1.000 espositori, 25.000 professionisti del settore da 100 paesi. Masterclass con i maestri di Château Pétrus e Domaine de la Romanée-Conti.',
    url:'https://vinexpo.com', tag:'🌍 Internazionale', colore:'rgba(160,200,255,.8)',
  },
  {
    data:'22–25 Maggio 2026', luogo:'Verona, Italia',
    nome:'Vinitaly 2026',
    desc:'La più grande fiera del vino italiano nel mondo. 4.000 espositori, 100.000 visitatori. Focus speciale su Barolo, Brunello, Amarone e i nuovi vitigni autoctoni.',
    url:'https://vinitaly.com', tag:'🇮🇹 Italia', colore:'rgba(212,175,55,.85)',
  },
  {
    data:'6–8 Giugno 2026', luogo:'Napa Valley, USA',
    nome:'Napa Valley Wine Auction',
    desc:'L\'asta di beneficenza più famosa del mondo del vino. I grandi Cabernet Sauvignon di Napa battuti all\'asta per cifre record. Accesso su invito per i collezionisti internazionali.',
    url:'https://napavalleyvintners.com', tag:'🇺🇸 USA', colore:'rgba(255,170,120,.8)',
  },
  {
    data:'12–14 Settembre 2026', luogo:'Champagne, Francia',
    nome:'Les Journées du Champagne',
    desc:'Le cantine più riservate della Champagne aprono al pubblico per tre giorni straordinari. Degustazioni in cantina con i chef de cave delle grandi Maison: Krug, Dom Pérignon, Roederer.',
    url:'https://champagne.fr', tag:'🍾 Champagne', colore:'rgba(220,220,180,.8)',
  },
  {
    data:'18–20 Settembre 2026', luogo:'Barolo, Italia',
    nome:'Collisioni — Agrifood Music Festival',
    desc:'Musica, arte e il grande vino delle Langhe. Il festival che unisce cultura e viticoltura nel cuore del Barolo. Concerti tra i filari, degustazioni verticali con i produttori storici.',
    url:'https://collisioni.it', tag:'🍷 Langhe', colore:'rgba(212,175,55,.85)',
  },
  {
    data:'3–5 Ottobre 2026', luogo:'Barcellona, Spagna',
    nome:'Barcelona Wine Week 2026',
    desc:'Tre giorni di celebrazione dei vini catalani e iberici. Il Priorat e la Ribera del Duero in primo piano. Seminari con sommelier internazionali e degustazioni di Gran Reserva storici.',
    url:'https://barcelonawineforum.com', tag:'🇪🇸 Spagna', colore:'rgba(255,180,120,.8)',
  },
  {
    data:'14–17 Novembre 2026', luogo:'Tokyo, Giappone',
    nome:'Decanter World Wine Awards — Tokyo Edition',
    desc:'Per la prima volta, i Decanter Awards sbarcano in Asia. I migliori 100 vini del mondo degustati davanti a sommelier e collezionisti giapponesi. Una serata da leggenda.',
    url:'https://decanter.com', tag:'🌏 Asia', colore:'rgba(200,160,220,.8)',
  },
];

window.renderEventi = function(target) {
  var container = document.getElementById('eventiPageList') || document.getElementById('eventiList');
  if(!container) return;
  container.innerHTML = '';
  window._EVENTI.forEach(function(ev) {
    var div = document.createElement('div');
    div.style.cssText = [
      'margin-bottom:12px','padding:14px 16px',
      'background:rgba(255,255,255,.03)',
      'border:1px solid rgba(212,175,55,.1)',
      'border-left:3px solid '+ev.colore,
      'border-radius:8px','cursor:pointer','transition:background .2s'
    ].join(';');
    div.onmouseover = function(){this.style.background='rgba(212,175,55,.05)';};
    div.onmouseout  = function(){this.style.background='rgba(255,255,255,.03)';};
    (function(e){ div.onclick = function(){ window.openEventoDetail(e.nome); }; })(ev);

    /* tag pill */
    var tag = document.createElement('span');
    tag.style.cssText='font-family:Cinzel,serif;font-size:.4rem;letter-spacing:1px;padding:2px 8px;'+
      'border-radius:10px;background:rgba(212,175,55,.1);color:'+ev.colore+';border:1px solid '+ev.colore+'44;';
    tag.textContent = ev.tag;

    /* data */
    var dataEl = document.createElement('span');
    dataEl.style.cssText='font-family:Cinzel,serif;font-size:.42rem;letter-spacing:1px;color:rgba(212,175,55,.5);';
    dataEl.textContent = ev.data;

    var topRow = document.createElement('div');
    topRow.style.cssText='display:flex;align-items:center;gap:8px;margin-bottom:5px;';
    topRow.appendChild(tag); topRow.appendChild(dataEl);

    var nome = document.createElement('div');
    nome.style.cssText='font-size:1rem;font-weight:700;color:#fff;margin-bottom:3px;font-family:Georgia,serif;';
    nome.textContent = ev.nome;

    var luogo = document.createElement('div');
    luogo.style.cssText='font-family:Cinzel,serif;font-size:.44rem;letter-spacing:1px;color:rgba(245,239,226,.4);margin-bottom:6px;';
    luogo.textContent = '📍 '+ev.luogo;

    var desc = document.createElement('div');
    desc.style.cssText='font-family:Georgia,serif;font-size:.92rem;line-height:1.7;color:rgba(245,239,226,.65);'+
      'display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;';
    desc.textContent = ev.desc;

    div.appendChild(topRow); div.appendChild(nome); div.appendChild(luogo); div.appendChild(desc);
    container.appendChild(div);
  });
};

// Filtra eventi per nazione/categoria
window.filterEventi = function(filtro) {
  // Aggiorna bottoni
  document.querySelectorAll('#page-eventi .ev-filter').forEach(function(b){
    b.classList.remove('active');
    if(b.textContent.toLowerCase().includes(filtro.toLowerCase())||filtro==='tutti') {
      if(b.getAttribute('onclick').includes(filtro)) b.classList.add('active');
    }
  });
  if(filtro==='tutti') { window.renderEventi('page'); return; }
  
  var container = document.getElementById('eventiPageList');
  if(!container) return;
  container.innerHTML='';
  
  window._EVENTI.filter(function(ev){
    return ev.luogo.toLowerCase().includes(filtro.toLowerCase()) ||
           ev.tag.toLowerCase().includes(filtro.toLowerCase());
  }).forEach(function(ev) {
    var div=document.createElement('div');
    div.style.cssText='margin-bottom:16px;padding:18px 16px;background:rgba(255,255,255,.03);border:1px solid rgba(212,175,55,.1);border-left:4px solid '+ev.colore+';border-radius:10px;cursor:pointer;transition:all .2s;';
    div.onmouseover=function(){this.style.background='rgba(212,175,55,.05)';};
    div.onmouseout=function(){this.style.background='rgba(255,255,255,.03)';};
    (function(e){ div.onclick=function(){window.openEventoDetail(e.nome);}; })(ev);
    
    var tag=document.createElement('div');
    tag.style.cssText='display:flex;align-items:center;gap:8px;margin-bottom:8px;';
    tag.innerHTML='<span style="font-family:Cinzel,serif;font-size:.42rem;letter-spacing:1px;padding:3px 10px;border-radius:12px;background:rgba(212,175,55,.1);color:'+ev.colore+';border:1px solid '+ev.colore+'44;">'+ev.tag+'</span>'+
      '<span style="font-family:Cinzel,serif;font-size:.44rem;color:rgba(212,175,55,.5);">'+ev.data+'</span>';
    
    var nome=document.createElement('div');
    nome.style.cssText='font-size:1.05rem;font-weight:700;color:#fff;margin-bottom:4px;font-family:Georgia,serif;';
    nome.textContent=ev.nome;
    
    var luogo=document.createElement('div');
    luogo.style.cssText='font-family:Cinzel,serif;font-size:.44rem;letter-spacing:1px;color:rgba(245,239,226,.4);margin-bottom:8px;';
    luogo.textContent='📍 '+ev.luogo;
    
    var desc=document.createElement('div');
    desc.style.cssText='font-family:Georgia,serif;font-size:.92rem;line-height:1.75;color:rgba(245,239,226,.65);';
    desc.textContent=ev.desc;
    
    div.appendChild(tag); div.appendChild(nome); div.appendChild(luogo); div.appendChild(desc);
    container.appendChild(div);
  });
};

window.openEventoDetail = function(nome) {
  var ev = window._EVENTI.find(function(e){return e.nome === nome;});
  if(!ev) return;
  var art = {
    titolo_it: ev.nome, testo_it: ev.data+' — '+ev.luogo+'\n\n'+ev.desc,
    categoria_it: ev.tag, immagine: '',
  };
  if(typeof window.openArticleReader === 'function') window.openArticleReader(art);
};

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded',function(){

  /* ── Pulisci cache articoli del giorno precedente ── */
  try {
    var today = new Date().toISOString().split('T')[0];
    var keysToDelete = [];
    for(var ki=0; ki<localStorage.length; ki++){
      var k = localStorage.key(ki);
      if(k && k.startsWith('sw_sap_') && !k.includes(today)) {
        keysToDelete.push(k);
      }
    }
    keysToDelete.forEach(function(k){ localStorage.removeItem(k); });
    /* Reset flag caricamento */
    window._sapereLoadPromise = null;
  } catch(e){}

  /* ── Legge la lingua salvata PRIMA del render ── */
  var savedLang = 'it';
  try { savedLang = localStorage.getItem('sw_lang')||'it'; } catch(e){}

  /* ── Home editoriale gestita: niente reiniezione automatica legacy/RSS ── */
  if(typeof window.loadServerArts === 'function') window.loadServerArts();

  /* ── Se mancano traduzioni, genera in background ── */
  if(savedLang !== 'it') {
    setTimeout(function(){
      if(typeof window.translateAndRefresh === 'function') {
        window.translateAndRefresh(savedLang);
      }
    }, 1500);
  }

  /* ── Render eventi ── */
  if(typeof window.renderEventi==='function') window.renderEventi('page');
});
