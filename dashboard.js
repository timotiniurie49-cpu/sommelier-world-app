(function(){
  'use strict';

  var SESSION_KEY = 'swl_session_v1';

  var sampleRestaurants = [
    { slug: 'demo-ristorante',   name: 'Ristorante Demo SommelierWorld', plan: 'pro',   wines: 42, currency: 'EUR', email: 'demo@sommelierworld.vin' },
    { slug: 'osteria-del-corso', name: 'Osteria del Corso',              plan: 'start', wines: 28, currency: 'EUR', email: 'info@osteriadelcorso.it' },
    { slug: 'trattoria-nonna',   name: 'Trattoria da Nonna Maria',       plan: 'pro',   wines: 35, currency: 'EUR', email: 'prenotazioni@trattorianonna.it' },
    { slug: 'bistrot-etoile',    name: 'Bistrot Étoile',                 plan: 'elite', wines: 67, currency: 'EUR', email: 'contact@bistrotetoile.fr' },
    { slug: 'wine-room-london',  name: 'The Wine Room London',           plan: 'pro',   wines: 51, currency: 'GBP', email: 'hello@wineroomlondon.co.uk' },
    { slug: 'vinoteca-roma',     name: 'Enoteca Roma Centrale',          plan: 'elite', wines: 124, currency: 'EUR', email: 'ordini@enotecaroma.it' }
  ];

  function getSession() {
    try {
      var raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch(e){ return null; }
  }
  function setSession(s) {
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch(e){}
  }
  function clearSession() {
    try { localStorage.removeItem(SESSION_KEY); } catch(e){}
  }

  var state = {
    collapsed: false,
    activeSection: 'overview',
    session: null,
    restaurantSlug: 'demo-ristorante',
    isSuperAdmin: false,
    restaurant: null,
    restaurants: sampleRestaurants,
    wines: [],
    orders: [],
    movements: [],
    totals: { inventoryValue: 0, inventoryCount: 0, soldValue: 0, soldCount: 0, lowStock: 0, outOfStock: 0 },
    loading: true,
    ui: { catFilter: 'all', sort: 'name-asc' }
  };

  function t(it, en, fr, ru) {
    var l = (window.swState && window.swState.language) ? window.swState.language : (localStorage.getItem('sw_lang') || 'it');
    if (l === 'en') return en;
    if (l === 'fr') return fr;
    if (l === 'ru') return ru;
    return it;
  }

  /* ===================== CATEGORIE VINI (identiche a area personale Marchio Registrato) ===================== */
  function getWineTipo(w) {
    var tp = (w.tipo || '').toLowerCase();
    var wt = (w.wine_type || '').toLowerCase();
    if (tp) return tp;
    if (wt === 'red') return 'rosso';
    if (wt === 'white') return 'bianco';
    if (wt === 'sparkling') return 'bollicine';
    if (wt === 'rose' || wt === 'rosato') return 'rosato';
    if (wt === 'fortified' || wt === 'sweet') return 'dolce';
    return 'rosso';
  }
  function getWineCountry(w) {
    return (w.country || w.nazione || 'Italia').trim();
  }
  function getWineRegion(w) {
    return (w.region || w.regione || w.appellation || '').trim();
  }
  function getWineFrazione(w) {
    return (w.frazione || w.village || w.frazione_comune || '').trim();
  }
  function getWineMetodo(w) {
    return (w.metodo_spumante || w.sparkling_method || w.metodo || '').trim();
  }
  function getWineCuvee(w) {
    return (w.cuvee || w.cuvée || w.etichetta_nome || w.bottle_name || '').trim();
  }
  function getWineMesiSurLie(w) {
    var ms = w.mesi_sur_lie;
    if (ms == null || ms === '') return '';
    var m = +ms;
    if (!isNaN(m) && m > 0) return String(m);
    return String(ms).trim();
  }
  function getWineColtivazione(w) {
    return (w.coltivazione || w.farming || '').trim();
  }
  function getWineLieviti(w) {
    return (w.lieviti || w.yeast || '').trim();
  }
  function getWinePiedeFranco(w) {
    if (w.piede_franco === true || w.piede_franco === 'true' || w.piede_franco === 1) return 'yes';
    if (w.piede_franco === false || w.piede_franco === 'false' || w.piede_franco === 0) return 'no';
    if (typeof w.piede_franco === 'string' && w.piede_franco) return w.piede_franco.trim();
    return '';
  }
  function getWineCertificazioni(w) {
    if (Array.isArray(w.certificazioni)) return w.certificazioni.filter(Boolean);
    if (Array.isArray(w.certifications)) return w.certifications.filter(Boolean);
    if (typeof w.certificazioni === 'string' && w.certificazioni) return w.certificazioni.split(/[,;]/).map(function(x){return x.trim();}).filter(Boolean);
    return [];
  }
  function getWineNoteAffinamento(w) {
    return (w.affinamento || w.aging || w.note_terroir || '').trim();
  }
  function getWineBadges(w) {
    var out = [];
    var col = (getWineColtivazione(w) || '').toLowerCase();
    if (col.indexOf('bio') >= 0 || col.indexOf('biologica') >= 0 || col.indexOf('biologico') >= 0) out.push('bio');
    if (col.indexOf('etica') >= 0 || col.indexOf('ethic') >= 0) out.push('etico');
    if (col.indexOf('dinamica') >= 0 || col.indexOf('biodinamica') >= 0) out.push('biodinamico');
    if (getWinePiedeFranco(w) === 'yes') out.push('piede_franco');
    if (w.anfora === true || w.terracotta === true || (getWineNoteAffinamento(w) || '').toLowerCase().indexOf('anfora') >= 0) out.push('anfora');
    getWineCertificazioni(w).forEach(function(c){
      var cc = String(c||'').toLowerCase();
      if (cc.indexOf('bio') >= 0) { if (out.indexOf('bio')<0) out.push('bio'); }
      else if (cc.indexOf('dop')>=0||cc.indexOf('docg')>=0||cc.indexOf('doc')>=0||cc.indexOf('aoc')>=0||cc.indexOf('grand cru')>=0||cc.indexOf('grandcru')>=0) {}
      else if (cc.indexOf('triple a')>=0 || cc==='aaa' || cc==='triplea') out.push('triplea');
      else if (cc.indexOf('relais')>=0||cc.indexOf('chateau')>=0) out.push('relais_chateaux');
    });
    return out;
  }
  function categorizeWine(w) {
    var tipo = getWineTipo(w);
    var paese = getWineCountry(w);
    var regione = getWineRegion(w);
    var paeseNorm = paese.toLowerCase().replace(/\s+/g,' ').trim();
    var regioneNorm = regione.toLowerCase();
    if (tipo === 'bollicine' && (regioneNorm === 'champagne' || paeseNorm === 'francia' && regioneNorm.indexOf('champagne') >= 0)) return 'champagne';
    if (paeseNorm !== 'italia' && paeseNorm !== 'francia' && paeseNorm !== '') return 'mondo';
    if (paeseNorm === 'francia' && tipo !== 'bollicine') return 'francia';
    if (tipo === 'bollicine') return 'bollicine';
    if (tipo === 'bianco') return 'bianchi';
    if (tipo === 'rosato' || tipo === 'rose') return 'rosati';
    if (tipo === 'rosso') return 'rossi';
    if (tipo === 'dolce' || tipo === 'fortified' || tipo === 'passito' || tipo === 'passiti') return 'dolci';
    return 'rossi';
  }
  var CATEGORY_META = {
    champagne: { k:'champagne', icon:'🍾', it:'Champagne & Crémant', en:'Champagne & Crémant', fr:'Champagne & Crémant', ru:'Шампань и Креман', order:1 },
    bollicine:  { k:'bollicine',  icon:'✨', it:'Bollicine',          en:'Sparkling',          fr:'Effervescents',      ru:'Игристые',         order:2 },
    bianchi:    { k:'bianchi',    icon:'🥂', it:'Vini Bianchi',        en:'White Wines',        fr:'Vins Blancs',        ru:'Белые вина',        order:3 },
    rosati:     { k:'rosati',     icon:'🌸', it:'Rosati & Rosé',       en:'Rosé Wines',         fr:'Vins Rosés',         ru:'Розовые вина',      order:4 },
    rossi:      { k:'rossi',      icon:'🍷', it:'Vini Rossi',          en:'Red Wines',          fr:'Vins Rouges',        ru:'Красные вина',      order:5 },
    francia:    { k:'francia',    icon:'🗼', it:'Vini Francesi',       en:'French Wines',       fr:'Vins de France',     ru:'Французские вина',  order:6 },
    mondo:      { k:'mondo',      icon:'🌍', it:'Vini del Mondo',      en:'World Wines',        fr:'Vins du Monde',      ru:'Вина мира',         order:7 },
    dolci:      { k:'dolci',      icon:'🍯', it:'Dolci & Passiti',     en:'Sweet & Dessert',    fr:'Doux & Vendanges Tardives', ru:'Десертные',   order:8 }
  };
  function getCatLabel(key) {
    var m = CATEGORY_META[key];
    if (!m) return key;
    return t(m.it, m.en, m.fr, m.ru);
  }
  function getCatIcon(key) { return CATEGORY_META[key] ? CATEGORY_META[key].icon : '●'; }
  function sortWines(list, sortKey) {
    var arr = list.slice();
    var sk = sortKey || (state.ui ? state.ui.sort : 'name-asc');
    var cmp = function(a,b){ return a < b ? -1 : (a > b ? 1 : 0); };
    switch(sk) {
      case 'name-asc':  arr.sort(function(a,b){ return cmp((a.wine_name||'').toLowerCase(), (b.wine_name||'').toLowerCase()); }); break;
      case 'name-desc': arr.sort(function(a,b){ return cmp((b.wine_name||'').toLowerCase(), (a.wine_name||'').toLowerCase()); }); break;
      case 'price-asc': arr.sort(function(a,b){ return cmp(+(a.price_sale||0), +(b.price_sale||0)); }); break;
      case 'price-desc':arr.sort(function(a,b){ return cmp(+(b.price_sale||0), +(a.price_sale||0)); }); break;
      case 'year-desc': arr.sort(function(a,b){ return cmp(+(b.vintage||0), +(a.vintage||0)); }); break;
      case 'qty-desc':  arr.sort(function(a,b){ return cmp(+(b.quantity_bottles||0), +(a.quantity_bottles||0)); }); break;
      case 'qty-asc':   arr.sort(function(a,b){ return cmp(+(a.quantity_bottles||0), +(b.quantity_bottles||0)); }); break;
      default: break;
    }
    return arr;
  }
  function getPurchaseUrl(w) {
    if (w.purchase_url && /^https?:/i.test(String(w.purchase_url))) return w.purchase_url;
    return '';
  }

  /* ===================== EXPORT CSV (Excel readable UTF-8 BOM) + DOWNLOAD GENERICO ===================== */
  function _csvEscape(v) {
    var s = (v == null) ? '' : String(v);
    if (/[;"\n,\t]/.test(s)) return '"' + s.replace(/"/g,'""') + '"';
    return s;
  }
  function _downloadBlob(filename, content, mime) {
    var isStr = typeof content === 'string';
    var BOM = '';
    var type = mime || (isStr ? 'text/csv;charset=utf-8;' : 'application/pdf');
    if (isStr && /csv|text/i.test(type)) BOM = '\uFEFF';
    var blob;
    if (isStr) {
      blob = new Blob([BOM, content], { type: type });
    } else {
      blob = new Blob([content], { type: type });
    }
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename; a.style.display = 'none';
    document.body.appendChild(a); a.click();
    setTimeout(function(){ document.body.removeChild(a); URL.revokeObjectURL(url); }, 350);
  }

  /* ===================== DISTRIBUTORI UFFICIALI SOMMELIER WORLD (COMMISSIONI TRACCIATE) ===================== */
  var DISTRIBUTORS = [
    { id:'sarzi-amadei',   name:'Sarzi Amadei',     zone:'Nord Italia',    tel:'+39 0521 ...', site:'https://www.sarziamadei.it',   refCode:'?ref=SW-ristoranti', discount:'5%', note:t('Partner Storico SW - Parma','SW Partner - Parma','Partenaire historique - Parme','Партнер SW - Парма') },
    { id:'sagna',          name:'Enoteca Sagna',    zone:'Piemonte',       tel:'+39 011 ...',  site:'https://www.enotecasagna.it', refCode:'?ref=sommelierworld', discount:'4%', note:t('Distribuzione Piemonte Barolo/Barbaresco','Piemonte Distributor','Distributeur Piémont','Дистрибьютор Пьемонт') },
    { id:'tannico',        name:'Tannico',          zone:'Online Italia',  tel:'+39 06 ...',   site:'https://www.tannico.it',       refCode:'?pv=sw_aff_001',      discount:'-',  note:t('Miglior prezzo Online','Best Online Pricing','Meilleur prix Internet','Лучшая онлайн цена') },
    { id:'callmewine',     name:'Callmewine',       zone:'Online Italia',  tel:'+39 02 ...',   site:'https://www.callmewine.com',    refCode:'?ref=SW0024',         discount:'5% su >150€', note:t('Spedizione 24h Italia','24h Shipping IT','Livraison 24h IT','Доставка 24ч ИТ') },
    { id:'vinatis',        name:'Vinatis',          zone:'Europa Online',  tel:'+33 1 ...',    site:'https://www.vinatis.com',       refCode:'?affiliate=sommelierworld', discount:'-', note:t('Referenza Francia/EU - Grandi Classici','France/EU reference','Référence France/UE','Референс Франция/ЕС') },
    { id:'wine-searcher',  name:'Wine-Searcher',    zone:'Globale',        tel:'-',            site:'https://www.wine-searcher.com', refCode:'?ref=swmarketplace',  discount:'-',  note:t('Confronta prezzi mondiali','Global price compare','Comparateur mondial','Мировое сравнение цен') }
  ];

  /* ===================== DISTRIBUTORI PARTNERS SW (CURATI) ===================== */
  var SW_DISTRIBUTORI_PARTNERS = [
    {
      id: 'pellegrini',
      nome: 'Pellegrini S.p.A.',
      zona: 'Nazionale',
      regioni: ['tutte'],
      specialita: 'Vini italiani e internazionali, Champagne',
      telefono: '+39 035 781010',
      email: 'info@pellegrinispa.net',
      sito: 'https://www.pellegrinispa.net',
      ref_link: 'https://www.pellegrinispa.net?ref=SW-{slug}',
      commissione_sw: '4%',
      minimo_ordine: '€400 o 60 bottiglie',
      note: 'Porto franco sopra soglia. Catalogo 2026 disponibile.',
      logo_emoji: '🏢'
    },
    {
      id: 'proposta-vini',
      nome: 'Proposta Vini',
      zona: 'Nazionale',
      regioni: ['tutte'],
      specialita: 'Vini naturali, biodinamici, piccoli produttori',
      telefono: '+39 0481 391091',
      email: 'info@propostavini.com',
      sito: 'https://www.propostavini.com',
      ref_link: 'https://www.propostavini.com?ref=SW-{slug}',
      commissione_sw: '3%',
      minimo_ordine: '€300',
      note: 'Specializzato in vini naturali e biodinamici italiani.',
      logo_emoji: '🌿'
    },
    {
      id: 'sarzi-amadei',
      nome: 'Sarzi Amadei',
      zona: 'Nord Italia',
      regioni: ['Lombardia', 'Piemonte', 'Veneto', 'Emilia-Romagna', 'Liguria'],
      specialita: 'Vini italiani, Champagne, spirits premium',
      telefono: '+39 0521 ...',
      email: 'info@sarziamadei.it',
      sito: 'https://www.sarziamadei.it',
      ref_link: 'https://www.sarziamadei.it?ref=SW-{slug}',
      commissione_sw: '5%',
      minimo_ordine: 'su accordo',
      note: 'Partner storico SW. Sconto 5% per clienti ristoranti SW.',
      logo_emoji: '⭐'
    },
    {
      id: 'enoteca-sagna',
      nome: 'Enoteca Sagna',
      zona: 'Piemonte',
      regioni: ['Piemonte'],
      specialita: 'Barolo, Barbaresco, Brunello, Grandi rossi piemontesi',
      telefono: '+39 011 ...',
      email: 'info@enotecasagna.it',
      sito: 'https://www.enotecasagna.it',
      ref_link: 'https://www.enotecasagna.it?ref=SW-{slug}',
      commissione_sw: '4%',
      minimo_ordine: '€200',
      note: 'Specializzato Piemonte. Barolo, Barbaresco, Brunello.',
      logo_emoji: '🍷'
    },
    {
      id: 'wine-searcher',
      nome: 'Wine-Searcher',
      zona: 'Globale',
      regioni: ['tutte'],
      specialita: 'Confronta prezzi mondiali — trova qualsiasi vino',
      telefono: '',
      email: '',
      sito: 'https://www.wine-searcher.com',
      ref_link: 'https://www.wine-searcher.com?ref=swmarketplace&sw_rslug={slug}',
      commissione_sw: '',
      minimo_ordine: 'nessuno',
      note: 'Motore di ricerca prezzi vini. Utile per verificare prezzi di mercato.',
      logo_emoji: '🌍'
    }
  ];

  /* ===================== SICUREZZA: SLUG NON INDOVINABILE ===================== */
  function generateSecureSlug(name) {
    var base = (name || 'ristorante')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '')
      .slice(0, 30);
    var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var suffix = '';
    for (var i = 0; i < 5; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return base + '-' + suffix;
  }
  window.generateSecureSlug = generateSecureSlug;

  function _getAffiliateLink(dist) {
    var url = dist.site || '#';
    var rc = dist.refCode || '';
    var rslug = state.restaurantSlug || 'demorest';
    var sep = url.indexOf('?') >= 0 ? '&' : '?';
    return url + (rc ? (rc + sep.slice(1) === '?' ? rc : rc) : '') + (sep === '?' ? '?' : '&') + 'sw_rslug=' + encodeURIComponent(rslug);
  }

  /* ===================== GENERATORE PDF ELEGANTE CARTA VINI (PDFkit CDN lazyload 0 dipendenze) ===================== */
  function _loadPdfKit(cb) {
    if (window.PDFDocument) {
      window.blobStream = (typeof window.blobStream === 'function') ? window.blobStream : window.BlobStream;
      return cb();
    }
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/pdfkit@0.15.0/js/pdfkit.standalone.min.js';
    s.onload = function() {
      window.blobStream = (typeof window.blobStream === 'function') ? window.blobStream : window.BlobStream;
      if (typeof window.blobStream !== 'function') {
        var s2 = document.createElement('script');
        s2.src = 'https://cdn.jsdelivr.net/npm/blob-stream@0.1.3/index.js';
        s2.onload = function() {
          window.blobStream = (typeof window.blobStream === 'function') ? window.blobStream : window.BlobStream;
          cb();
        };
        s2.onerror = function() { alert(t('Errore caricamento PDF.','PDF load error.','Erreur PDF.','Ошибка PDF')); };
        document.head.appendChild(s2);
      } else cb();
    };
    s.onerror = function() { alert(t('Errore caricamento PDFkit.','PDFkit error.','Erreur PDFkit.','Ошибка PDFkit')); };
    document.head.appendChild(s);
  }
  function swDashGeneratePdf() {
    var restMeta = getRestaurantMeta(state.restaurantSlug);
    var restName = state.restaurant && state.restaurant.name ? state.restaurant.name : (restMeta.name || t('Carta dei Vini','Wine List','Carte des Vins','Винная Карта'));
    var wines = state.wines.filter(function(w){ return w.onList !== false; });
    if (!wines.length) { alert(t('Nessun vino in carta. Abilita IN CARTA almeno un vino.', 'No wines on list. Enable at least one wine.', 'Aucun vin en carte. Activez au moins un vin.', 'Нет вин в карте.')); return; }
    // NON ordinare per prezzo — raggruppa per stile e mescola i prezzi (regione + produttore)
    wines = wines.slice().sort(function(a,b){
      var oA = CATEGORY_META[categorizeWine(a)] ? CATEGORY_META[categorizeWine(a)].order : 99;
      var oB = CATEGORY_META[categorizeWine(b)] ? CATEGORY_META[categorizeWine(b)].order : 99;
      if (oA !== oB) return oA - oB;
      return ((getWineRegion(a)||'') + (a.producer||'')).localeCompare((getWineRegion(b)||'') + (b.producer||''));
    });

    /* ====== COSTRUZIONE GERARCHIA 3 LIVELLI: PAESE → TIPOLOGIA → REGIONE ====== (legale: nostra gerarchia custom NON copia Bellevue) */
    var PAESI_ORDER = ['Italia','Francia'];
    var tree = {}; /* { paese: { tipoKey: { regione: [wines] } } } */
    var allRegioniByPaeseTipo = {};
    wines.forEach(function(w){
      var paese = getWineCountry(w) || 'Italia';
      var tipoKey = categorizeWine(w);
      var regione = getWineRegion(w) || t('Altre Regioni','Other Regions','Autres Régions','Другие регионы');
      if (!tree[paese]) tree[paese] = {};
      if (!tree[paese][tipoKey]) tree[paese][tipoKey] = {};
      if (!tree[paese][tipoKey][regione]) tree[paese][tipoKey][regione] = [];
      tree[paese][tipoKey][regione].push(w);
    });
    var paesiList = Object.keys(tree).sort(function(a,b){
      var ia = PAESI_ORDER.indexOf(a), ib = PAESI_ORDER.indexOf(b);
      if (ia<0 && ib<0) return a.localeCompare(b);
      if (ia<0) return 1; if (ib<0) return -1;
      return ia-ib;
    });

    var TIPO_ORDER = Object.keys(CATEGORY_META).sort(function(a,b){ return (CATEGORY_META[a]?CATEGORY_META[a].order:99) - (CATEGORY_META[b]?CATEGORY_META[b].order:99); });

    _loadPdfKit(function(){
      try {
        var PDFDocument = window.PDFDocument;
        var doc = new PDFDocument({ size: 'A4', margin: 42, info: { Title: restName + ' - Carta dei Vini', Author: 'Sommelier World', Subject: 'Wine List', Producer: 'Sommelier World - Template Editoriale' } });
        var stream = doc.pipe(window.blobStream());
        var PAGE_W = 595.28, PAGE_H = 841.89;
        var MARGIN_L = 42, MARGIN_R = 42, MARGIN_T = 48, MARGIN_B = 70;
        var COL_GAP = 20;
        var COL_W = Math.floor((PAGE_W - MARGIN_L - MARGIN_R - COL_GAP) / 2);
        var COL_X1 = MARGIN_L;
        var COL_X2 = MARGIN_L + COL_W + COL_GAP;
        var colState = { page: 0, col: 0, y: MARGIN_T };

        function ensureSpace(h) {
          if (colState.y + h > PAGE_H - MARGIN_B) {
            if (colState.col === 0) { colState.col = 1; colState.y = MARGIN_T; }
            else { doc.addPage(); colState.page++; colState.col = 0; colState.y = MARGIN_T; drawFooters(); }
          }
        }
        function colX() { return colState.col === 0 ? COL_X1 : COL_X2; }
        function drawFooters() {
          doc.switchToPage(doc._currentPageNumber - 1);
          var cnt = doc._currentPageNumber;
          doc.fontSize(8).fillColor('#9ca3af').font('Helvetica');
          doc.text(restName + ' · ' + t('Carta dei Vini','Wine List','Carte des Vins','Винная Карта'), MARGIN_L, PAGE_H - 32, { width: 300, align: 'left' });
          doc.text(t('Pagina','Page','Page','Страница') + '  ' + cnt, PAGE_W - MARGIN_R - 60, PAGE_H - 32, { width: 60, align: 'right' });
          doc.switchToPage(doc._currentPageNumber - 1);
        }
        function startNewPageBothCols() { doc.addPage(); colState.page++; colState.col = 0; colState.y = MARGIN_T; drawFooters(); }
        function sectionBreak() { startNewPageBothCols(); }

        /* ========================================================= */
        /* ===== 1. COPERTINA (uniforme SW per TUTTE le strutture) ===== */
        /* ========================================================= */
        doc.moveDown(8.5);
        doc.fontSize(9).fillColor('#9ca3af').font('Helvetica').text('SOMMELIER WORLD  ·  EDITORIALE WINE LIST', { align: 'center' });
        doc.moveDown(1.1);
        doc.fontSize(30).font('Helvetica-Bold').fillColor('#0f172a').text(restName, { align: 'center' });
        doc.moveDown(0.9);
        var sepY = doc.y + 6;
        doc.moveTo(PAGE_W/2 - 60, sepY).lineTo(PAGE_W/2 + 60, sepY).lineWidth(0.6).stroke('#0f172a');
        doc.y = sepY + 16;
        doc.fontSize(12).fillColor('#3f3f46').font('Helvetica').text(t('Carta dei Vini','Wine List','Carte des Vins','Винная Карта'), { align: 'center' });
        doc.fontSize(10).fillColor('#71717a').moveDown(0.6).text(new Date().getFullYear() + '  ·  ' + wines.length + ' ' + t('etichette selezionate','selected labels','étiquettes sélectionnées','этикеток'), { align: 'center' });
        doc.moveDown(14);
        if (restMeta.address) doc.fontSize(8.5).fillColor('#a1a1aa').text(restMeta.address, { align: 'center' });
        if (state.restaurantSlug) doc.fontSize(8).fillColor('#d4d4d8').moveDown(0.3).text('ID ristorante: ' + state.restaurantSlug, { align: 'center' });
        /* footer copertina */
        doc.fontSize(8).fillColor('#9ca3af').font('Helvetica');
        doc.text('SOMMELIER WORLD', MARGIN_L, PAGE_H - 32, { width: 300, align: 'left' });
        doc.text(t('Pagina','Page','Page','Страница') + '  1', PAGE_W - MARGIN_R - 60, PAGE_H - 32, { width: 60, align: 'right' });

        /* ========================================================= */
        /* ===== PRIMA CALCOLIAMO TUTTE LE PAGINE PER INDICE ===== */
        /* ========================================================= */
        /* pagina 2 = INDICE, pagina 3 = LEGENDA, pagina 4 = CONTENUTI */
        var pageCursor = 4;
        var pageIndex = {}; /* path => pagina (key: "ITALIA|bollicine|Valle d'Aosta") */
        var BADGE_PER_WINE_ROWS = 4.5;
        var HEADER_REGION_ROWS = 2.2;
        var HEADER_TIPO_ROWS = 1.8;
        var ROW_H = 11.5;
        paesiList.forEach(function(paese){
          var tipiObj = tree[paese] || {};
          var tipiKeys = Object.keys(tipiObj).sort(function(a,b){ return TIPO_ORDER.indexOf(a) - TIPO_ORDER.indexOf(b); });
          /* pagina nuovo paese = sempre pagina nuova (a meno che sia all'inizio) */
          pageIndex[paese] = pageCursor;
          startNewPageBothCols_simulation();
          var leftColRows = 0, rightColRows = 0, curCol = 0;
          function simulateRows(n) {
            if (curCol === 0) { leftColRows += n; if (leftColRows > 62) { curCol = 1; rightColRows += n; } }
            else { rightColRows += n; if (rightColRows > 62) { curCol = 0; leftColRows = n; pageCursor++; } }
          }
          function startNewPageBothCols_simulation() { curCol = 0; leftColRows = 0; rightColRows = 0; pageCursor++; }
          simulateRows(5); /* header paese grande */
          tipiKeys.forEach(function(tk){
            var regioniObj = tipiObj[tk] || {};
            var regioniKeys = Object.keys(regioniObj).sort();
            pageIndex[paese + '|' + tk] = pageCursor + Math.floor((curCol===0?leftColRows:rightColRows) / 62);
            simulateRows(HEADER_TIPO_ROWS);
            regioniKeys.forEach(function(rk){
              var list = regioniObj[rk];
              pageIndex[paese + '|' + tk + '|' + rk] = pageCursor + Math.floor((curCol===0?leftColRows:rightColRows) / 62);
              simulateRows(HEADER_REGION_ROWS);
              list.forEach(function(){ simulateRows(BADGE_PER_WINE_ROWS); });
            });
          });
          pageCursor += Math.max(0, (curCol>0||leftColRows>0||rightColRows>0?1:0));
        });

        /* ========================================================= */
        /* ===== 2. PAGINA 2: INDICE 3 LIVELLI (PAESE → TIPO → REGIONE) ===== */
        /* ========================================================= */
        doc.addPage();
        doc.fontSize(22).font('Helvetica-Bold').fillColor('#0f172a').text(t('Indice','Index','Table des Matières','Содержание'), { align: 'center' });
        doc.moveDown(0.2);
        var ixs = doc.x, ixe = PAGE_W - MARGIN_R;
        doc.moveTo(MARGIN_L, doc.y).lineTo(PAGE_W - MARGIN_R, doc.y).lineWidth(0.4).stroke('#cbd5e1');
        doc.moveDown(0.6);
        function drawIndexLine(label, page, indent, bold) {
          var x = MARGIN_L + indent;
          var w = (PAGE_W - MARGIN_R) - x;
          doc.fontSize(bold?11:10).font(bold?'Helvetica-Bold':'Helvetica').fillColor(bold?'#0f172a':'#27272a').text(label, x, doc.y, { width: w - 35, continued: true });
          doc.fontSize(9).fillColor('#a1a1aa').font('Helvetica').text('  ' + Array(140).join('.') + '  ', { continued: true });
          doc.fontSize(bold?11:10).font(bold?'Helvetica-Bold':'Helvetica').fillColor(bold?'#0f172a':'#52525b').text('  ' + page, { width: 35, align: 'right' });
          doc.moveDown(bold?0.5:0.35);
        }
        paesiList.forEach(function(paese){
          drawIndexLine(paese.toUpperCase(), pageIndex[paese]||'—', 0, true);
          var tipiObj = tree[paese] || {};
          var tipiKeys = Object.keys(tipiObj).sort(function(a,b){ return TIPO_ORDER.indexOf(a) - TIPO_ORDER.indexOf(b); });
          tipiKeys.forEach(function(tk){
            var tkMeta = CATEGORY_META[tk] || {};
            var tkCount = 0; Object.keys(tipiObj[tk]||{}).forEach(function(r){ tkCount += (tipiObj[tk][r]||[]).length; });
            drawIndexLine((tkMeta.icon?tkMeta.icon+'  ':'') + getCatLabel(tk) + '  (' + tkCount + ')', pageIndex[paese+'|'+tk]||'—', 16, false);
            var regioniObj = tipiObj[tk] || {};
            var regioniKeys = Object.keys(regioniObj).sort();
            regioniKeys.forEach(function(rk){
              var cnt = (regioniObj[rk]||[]).length;
              drawIndexLine(rk + ' · ' + cnt + ' ' + t('vini','wines','vins','вин'), pageIndex[paese+'|'+tk+'|'+rk]||'—', 34, false);
            });
            doc.moveDown(0.1);
          });
          doc.moveDown(0.25);
          if (doc.y > PAGE_H - 90) doc.addPage();
        });
        /* footer pagina indice */
        doc.fontSize(8).fillColor('#9ca3af').font('Helvetica');
        doc.text(restName + ' · ' + t('Carta dei Vini','Wine List','Carte des Vins','Винная Карта'), MARGIN_L, PAGE_H - 32, { width: 300, align: 'left' });
        doc.text(t('Pagina','Page','Page','Страница') + '  2', PAGE_W - MARGIN_R - 60, PAGE_H - 32, { width: 60, align: 'right' });

        /* ========================================================= */
        /* ===== 3. PAGINA 3: LEGENDA BADGE (PAGINA SEPARATA - NON colonna sx come Bellevue) ===== */
        /* ========================================================= */
        doc.addPage();
        doc.fontSize(20).font('Helvetica-Bold').fillColor('#0f172a').text(t('Legenda Simboli','Badge Legend','Légende des Symboles','Легенда'));
        doc.moveDown(0.15);
        doc.moveTo(MARGIN_L, doc.y).lineTo(PAGE_W - MARGIN_R, doc.y).lineWidth(0.4).stroke('#cbd5e1');
        doc.moveDown(0.7);
        var LEG_ITEMS = [
          { e:'🍃', k:'bio',  it:'Viticoltura Biologica', en:'Organic Farming', fr:'Agriculture Biologique', ru:'Органическое' },
          { e:'🪨', k:'biodinamico', it:'Viticoltura Biodinamica', en:'Biodynamic', fr:'Biodynamie', ru:'Биодинамика' },
          { e:'⚖️', k:'etico', it:'Agricoltura Etica / Naturale', en:'Ethical / Natural', fr:'Éthique / Naturel', ru:'Этика / Натур' },
          { e:'🍇', k:'piede_franco', it:'Vite a Piede Franco', en:'Ungrafted Rootstock', fr:'Pied Franc', ru:'Корнесобств.' },
          { e:'🏺', k:'anfora', it:'Affinamento in Anfora', en:'Amphora Aging', fr:'Élevage Amphore', ru:'Амфора' },
          { e:'🏅', k:'triplea', it:'Triple A (Agricoltore · Artigiano · Artista)', en:'Triple A', fr:'Triple A', ru:'Тройная А' },
          { e:'🏨', k:'relais_chateaux', it:'Relais & Châteaux', en:'Relais & Châteaux', fr:'Relais & Châteaux', ru:'Реле и Шато' }
        ];
        LEG_ITEMS.forEach(function(it){
          doc.fontSize(14).fillColor('#0f172a').text(it.e, MARGIN_L, doc.y, { width: 22, continued: true });
          doc.fontSize(11).font('Helvetica-Bold').fillColor('#0f172a').text('  ' + t(it.it,it.en,it.fr,it.ru), { width: COL_W - 30, continued: false });
          doc.moveDown(0.1);
          doc.fontSize(9).font('Helvetica').fillColor('#6b7280').moveDown(0.05).text('     ' + _legendaDescrizione(it.k), { indent: 22 });
          doc.moveDown(0.65);
        });
        doc.moveDown(0.7);
        doc.fontSize(11).font('Helvetica-Bold').fillColor('#0f172a').text(t('Tipi di Coltivazione','Farming Types','Types de Culture','Типы возделывания'));
        doc.moveDown(0.1);
        doc.moveTo(MARGIN_L, doc.y).lineTo(MARGIN_L + 220, doc.y).lineWidth(0.3).stroke('#d4d4d8');
        doc.moveDown(0.35);
        ['Convenzionale','Biologica','Biodinamica','Etica / Naturale'].forEach(function(tx){
          doc.fontSize(9.5).font('Helvetica').fillColor('#3f3f46').text('   •  ' + tx);
          doc.moveDown(0.3);
        });
        doc.moveDown(0.7);
        doc.fontSize(11).font('Helvetica-Bold').fillColor('#0f172a').text(t('Lieviti','Yeasts','Levures','Дрожжи'));
        doc.moveDown(0.1);
        doc.moveTo(MARGIN_L, doc.y).lineTo(MARGIN_L + 140, doc.y).lineWidth(0.3).stroke('#d4d4d8');
        doc.moveDown(0.35);
        [t('Indigeni (fermentazione spontanea)','Indigenous (wild)','Indigènes (spontanées)','Аборигенные (дикие)'), t('Selezionati','Selected','Sélectionnés','Селекционные')].forEach(function(tx){
          doc.fontSize(9.5).font('Helvetica').fillColor('#3f3f46').text('   •  ' + tx);
          doc.moveDown(0.3);
        });
        /* footer legenda */
        doc.fontSize(8).fillColor('#9ca3af').font('Helvetica');
        doc.text(restName + ' · ' + t('Carta dei Vini','Wine List','Carte des Vins','Винная Карта'), MARGIN_L, PAGE_H - 32, { width: 300, align: 'left' });
        doc.text(t('Pagina','Page','Page','Страница') + '  3', PAGE_W - MARGIN_R - 60, PAGE_H - 32, { width: 60, align: 'right' });

        /* ========================================================= */
        /* ===== 4+. PAGINE CONTENUTI: 2 COLONNE + 4 RIGHE ETICHETTA ===== */
        /* ========================================================= */
        startNewPageBothCols();

        paesiList.forEach(function(paese){
          /* HEADER PAESE = larghezza intera pagina, 2 colonne sospese */
          var tipiObj = tree[paese] || {};
          var tipiKeys = Object.keys(tipiObj).sort(function(a,b){ return TIPO_ORDER.indexOf(a) - TIPO_ORDER.indexOf(b); });
          startNewPageBothCols();
          /* disegna header paese a tutta larghezza prima riga */
          colState.y = MARGIN_T + 6;
          doc.fontSize(26).font('Helvetica-Bold').fillColor('#0f172a').text(paese.toUpperCase(), MARGIN_L, colState.y, { width: PAGE_W-MARGIN_L-MARGIN_R, align: 'left' });
          colState.y += 36;
          var lineY = colState.y;
          doc.moveTo(MARGIN_L, lineY).lineTo(PAGE_W - MARGIN_R, lineY).lineWidth(1).stroke('#0f172a');
          colState.y += 12;
          /* ripristina 2 colonne */
          colState.col = 0;

          tipiKeys.forEach(function(tk){
            var tkMeta = CATEGORY_META[tk] || {};
            var regioniObj = tipiObj[tk] || {};
            var regioniKeys = Object.keys(regioniObj).sort();
            /* HEADER TIPOLOGIA */
            ensureSpace(42);
            var ty = colState.y;
            doc.fontSize(15).font('Helvetica-Bold').fillColor('#0f172a').text((tkMeta.icon?tkMeta.icon+'  ':'') + getCatLabel(tk), colX(), ty, { width: COL_W });
            colState.y += 20;
            doc.moveTo(colX(), colState.y).lineTo(colX() + COL_W, colState.y).lineWidth(0.4).stroke('#cbd5e1');
            colState.y += 10;

            regioniKeys.forEach(function(rk){
              var list = regioniObj[rk] || [];
              /* HEADER REGIONE */
              ensureSpace(28);
              doc.fontSize(11).font('Helvetica-Bold').fillColor('#3f3f46').text(rk, colX(), colState.y, { width: COL_W });
              colState.y += 6;
              doc.moveTo(colX() + 0, colState.y).lineTo(colX() + Math.min(60, COL_W*0.28), colState.y).lineWidth(0.3).stroke('#9ca3af');
              colState.y += 10;

              list.forEach(function(w){ drawWineCard4Rows(w); });
              colState.y += 6;
            });
            colState.y += 8;
          });
        });

        /* disegna footer su ULTIME pagine generate ciclo */
        var lastPgRange = doc.bufferedPageRange();
        for (var ip = lastPgRange.start; ip < lastPgRange.start + lastPgRange.count; ip++) {
          if (ip < 3) continue; /* pagine 1-3 già sistemate */
          doc.switchToPage(ip);
          doc.fontSize(8).fillColor('#9ca3af').font('Helvetica');
          doc.text(restName + ' · ' + t('Carta dei Vini','Wine List','Carte des Vins','Винная Карта'), MARGIN_L, PAGE_H - 32, { width: 300, align: 'left' });
          doc.text(t('Pagina','Page','Page','Страница') + '  ' + (ip+1), PAGE_W - MARGIN_R - 60, PAGE_H - 32, { width: 60, align: 'right' });
        }
        doc.switchToPage(lastPgRange.start + lastPgRange.count - 1);

        doc.end();
        stream.on('finish', function(){
          var blob = stream.toBlob('application/pdf');
          var slug = state.restaurantSlug || 'ristorante';
          var filename = 'CARTA-VINI_' + slug.toUpperCase() + '_' + new Date().toISOString().slice(0,10) + '.pdf';
          _downloadBlob(filename, blob, 'application/pdf');
        });
        stream.on('error', function(e){ alert(t('Errore PDF: ','PDF error: ','Erreur PDF : ','Ошибка PDF: ') + (e.message||e)); });
      } catch (er) {
        alert(t('Errore generazione PDF: ','PDF gen error: ','Erreur gen PDF : ','Ошибка PDF: ') + (er.message||er));
      }

      /* =========== helper interni V24 =========== */
      function _legendaDescrizione(k) {
        var map = {
          bio: t('Nessun prodotto di sintesi in vigna e cantina.','No synthetic inputs in vineyard or cellar.','Aucun intrant de synthèse.','Без синтетики в винограднике и подвале.'),
          biodinamico: t('Preparati biodinamici + sincronizzazione lunare (Rudolf Steiner).','Biodynamic preparations + lunar sync (Steiner).','Préparations biodynamiques + cycle lunaire.','Биодин. препараты + лунный цикл (Штайнер).'),
          etico: t('Rispetto dell\'ecosistema, del territorio e dei lavoratori, senza certificazione formale.','Ecosystem & worker focused; no formal certification.','Respect écosystème + terroir + salariés.','Уважение к экосистеме, терруару и работникам.'),
          piede_franco: t('Vite non innestata: sopravvissuta alla fillossera, massima espressione del terroir.','Ungrafted vine: phylloxera survivor, pure terroir expression.','Vigne non greffée, survivante phylloxéra.','Корнесобственная лоза: выжила филлоксере.'),
          anfora: t('Fermentazione e/o affinamento in recipiente di terracotta.','Fermentation and/or aging in clay amphora.','Fermentation et/ou élevage en amphore de terre.','Брожение и/или выдержка в глиняной амфоре.'),
          triplea: t('Manifesto Agricoltore · Artigiano · Artista: viticoltura manuale, bassi rese, alto artigianato.','Farmer · Craftsman · Artist manifesto: low yields, handmade.','Manifeste Agriculteur · Artisan · Artiste.','Манифест Фермер · Ремесленник · Художник.'),
          relais_chateaux: t('Cantina aderente all\'associazione alberghiera d\'eccellenza.','Excellence hotel association member winery.','Vignoble membre association hôtellerie d\'excellence.','Винодельня — член ассоциации отелей класса люкс.')
        };
        return map[k] || '';
      }
      function _wineBadgeIconaColtivazione(w) {
        var col = (getWineColtivazione(w) || '').toLowerCase();
        if (col.indexOf('biodinamic') >= 0) return '🌿';
        if (col.indexOf('bio') >= 0) return '🍃';
        if (col.indexOf('etica') >= 0 || col.indexOf('natur') >= 0) return '⚖️';
        return '';
      }
      function drawWineCard4Rows(w) {
        /* ================================================================
           SCHEMA 4 RIGHE IDENTICO A SCREENSHOT FRANK PASCAL / GASTON CHIQUET

           RIGA 1 · PRODUTTORE (zona produzione)
             🌿 Frank Pascal (Baslieux-sous-Châtillon, Marne)
             ↳ BADGE coltivazione (SOLO se non convenzionale; Convenzionale NIENTE)

           RIGA 2 · TIPOLOGIA + DOSAGGIO + NOME CUVEÈ + ANNATA     [€ PREZZO DX]
             Champagne Extra Brut "Harmonie Blanc de Noir" 2018       € 78

           RIGA 3 · VITIGNI  +  sur lie N MESI   (NO punti separatori, NO metodo in mezzo!)
             Pinot Noir, Pinot Meunier sur lie 48 mesi

           RIGA 4 · SEMPRE PRESENTE (anche Convenzionale) — 2 colonne
             Coltivazione: Biodinamico        Lieviti: Indigeni
        */
        ensureSpace(60);
        var x = colX();
        var badges = getWineBadges(w) || [];

        /* ==================== RIGA 1: Badge + Produttore (Frazione) ==================== */
        var badgeIcona = _wineBadgeIconaColtivazione(w);
        var badgeOffset = 0;
        if (badgeIcona) {
          doc.fontSize(12).fillColor('#166534').text(badgeIcona, x - 1, colState.y - 1, { width: 14, continued: false });
          badgeOffset = 16;
        }
        var prod = (w.producer || '').trim();
        var frac = getWineFrazione(w);
        var r1 = prod;
        if (prod && frac) r1 += '  (' + frac + ')';
        else if (!prod && frac) r1 = frac;
        if (r1) {
          doc.fontSize(12.5).font('Helvetica-Bold').fillColor('#111827').text(r1, x + badgeOffset, colState.y, { width: COL_W - badgeOffset });
          colState.y += 16;
        } else {
          colState.y += 8;
        }

        /* ==================== RIGA 2: [Tipologia] [Dosaggio] "Cuvée"  ·  ANNATA € PREZZO ==================== */
        var catK = categorizeWine(w);
        var catMeta = CATEGORY_META[catK] || {};
        var tipoLabel = (catMeta.it || getWineTipo(w) || w.appellation || '').trim();
        var dos = (w.dosaggio || '').trim();
        var cuv = (getWineCuvee(w) || w.wine_name || '').trim();
        var annRaw = (w.vintage || '').trim();
        var ann = !annRaw || annRaw.toLowerCase() === 's.a.' ? 's.a.' : annRaw;
        var prezzo = w.price_carta || w.price_sale || 0;
        var prezzoCalice = w.price_bicchiere || null;

        var leftParts = [];
        if (tipoLabel) leftParts.push(tipoLabel);
        if (dos) leftParts.push(dos);
        if (cuv) {
          if (cuv.indexOf('"') >= 0 || cuv.indexOf('“') >= 0 || cuv.indexOf('«') >= 0) leftParts.push(cuv);
          else leftParts.push('"' + cuv + '"');
        }
        var leftStr = leftParts.join(' ');

        /* badge riga 2: piede franco / anfora / triplea (non coltivazione, quella era in riga 1) */
        var extraBadges = [];
        badges.forEach(function(b){
          if (b === 'piede_franco') extraBadges.push('🍇');
          else if (b === 'anfora') extraBadges.push('🏺');
          else if (b === 'triplea') extraBadges.push('🏅');
          else if (b === 'relais_chateaux') extraBadges.push('🏨');
        });
        if (extraBadges.length) leftStr += '  ' + extraBadges.join('');

        var annWidth = 30;
        if (ann === 's.a.') annWidth = 20;
        var rightW = 58 + annWidth + 8;
        var leftW = Math.max(40, COL_W - rightW);
        doc.fontSize(10.5).font('Helvetica').fillColor('#18181b').text(leftStr, x, colState.y, { width: leftW, continued: true });
        doc.fontSize(10.5).font('Helvetica').fillColor('#52525b').text(String(ann), { width: annWidth + 8, continued: true, align: 'right' });
        doc.fontSize(10.5).font('Helvetica-Bold').fillColor('#0f172a').text('  ' + fmtMoney(prezzo) + (prezzoCalice ? '  ' + t('· calice','· glass','· verre','· бокал') + ' ' + fmtMoney(prezzoCalice) : ''), { width: 58 + (prezzoCalice ? 4 : 0), align: 'right' });
        colState.y += 13;

        /* ==================== RIGA 3: Vitigni + "sur lie X mesi" (NO Metodo in mezzo!) ==================== */
        var vitigni = '';
        if (Array.isArray(w.grapes) && w.grapes.length) vitigni = w.grapes.join(', ');
        else if (typeof w.grapes === 'string' && w.grapes) vitigni = w.grapes;
        var mesi = getWineMesiSurLie(w);
        var r3 = vitigni;
        if (mesi) r3 += (vitigni ? '  ' : '') + 'sur lie ' + String(mesi) + ' ' + t('mesi','months','mois','мес');
        if (r3) {
          doc.fontSize(9).font('Helvetica').fillColor('#3f3f46').text(r3, x, colState.y, { width: COL_W });
          colState.y += 11;
        } else {
          colState.y += 4;
        }

        /* ==================== RIGA 4: Coltivazione: X  ·  Lieviti: Y   (SEMPRE, anche Convenzionale!) ==================== */
        var colt = getWineColtivazione(w) || t('Convenzionale','Conventional','Conventionnel','Конвенциональный');
        var liev = getWineLieviti(w) || t('Selezionati','Selected','Sélectionnés','Селекционные');
        var labColt = t('Coltivazione','Farming','Culture','Возделывание') + ': ' + colt;
        var labLiev = t('Lieviti','Yeasts','Levures','Дрожжи') + ': ' + liev;
        var r4 = labColt + '    ' + labLiev;
        doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#111827').text(r4, x, colState.y, { width: COL_W });
        colState.y += 13;

        colState.y += 10; /* spazio inter-etichetta */
      }
    });
  }
  function swDashShowDistributors(wineIdx) {
    var w = wineIdx != null ? state.wines[wineIdx|0] : null;
    var titolo = w ? t('Acquisto consigliato per:','Find supplier for:','Achat conseillé pour :','Поиск поставщика для:') + ' ' + (w.wine_name||'') + (w.vintage?' ('+w.vintage+')':'')
                   : t('Distributori ufficiali Sommelier World','Official SW Distributors','Distributeurs officiels SW','Официальные дистрибьюторы SW');
    var lines = [
      '══════════════════════════════════════════════════',
      '  🛒 ' + titolo,
      '  💡 ' + t('Sconto esclusivo per ristoranti SW partners','SW partners exclusive discount','Remise exclusive partenaires SW','Эксклюзивная скидка для партнеров SW'),
      '══════════════════════════════════════════════════',
      ''
    ];
    DISTRIBUTORS.forEach(function(d, i){
      lines.push((i+1) + '. 📦 ' + d.name + '     (' + d.zone + ')');
      if (d.discount && d.discount !== '-') lines.push('     🎁 ' + t('Sconto riservato:','Reserved discount:','Remise :','Скидка: ') + d.discount);
      if (d.tel && d.tel !== '-') lines.push('     ☎️ ' + d.tel);
      lines.push('     🔗 ' + _getAffiliateLink(d));
      if (d.note) lines.push('     ℹ️ ' + d.note);
      lines.push('');
    });
    lines.push('══════════════════════════════════════════════════');
    lines.push(t('Quando ordini, menziona "Sommelier World" per ottenere lo sconto.','When ordering, mention "Sommelier World" to get discount.','En commandant, mentionnez "Sommelier World".','При заказе упомяните "Sommelier World" для скидки.'));
    alert(lines.join('\n'));
  }
  window.swDashGeneratePdf = swDashGeneratePdf;
  window.swDashShowDistributors = swDashShowDistributors;
  function swDashExportInventory() {
    if (!state.wines || !state.wines.length) { alert(t('Nessun vino in inventario.', 'No wines in inventory.', 'Aucun vin en inventaire.', 'Нет вин в инвентаре.')); return; }
    var headers = ['Etichetta','Nome Cuvée','Annata','Produttore','Frazione/Comune','Regione','Paese','Categoria','Tipologia','Vitigni','Metodo Spumante','Dosaggio','Mesi Sur Lie','Coltivazione','Lieviti','Piede Franco','Certificazioni','Note Affinamento','Prezzo (€)','Giacenza','Soglia Min.','Stato','In Carta','Link Acquisto','Badges'];
    var rows = [headers.join(';')];
    var sorted = sortWines(state.wines, state.ui.sort);
    sorted.forEach(function(w){
      var q = typeof w.quantity_bottles === 'number' ? w.quantity_bottles : 0;
      var minTh = typeof w.minimum_threshold === 'number' ? w.minimum_threshold : 3;
      var st = w.status || (q === 0 ? t('Esaurito','Out of Stock','Rupture de stock','Распродано') : (q <= minTh ? t('Scorte basse','Low Stock','Stock bas','Низкий остаток') : t('Disponibile','Available','Disponibile','В наличии')));
      var catK = categorizeWine(w);
      var badges = getWineBadges(w) || [];
      rows.push([
        _csvEscape(w.wine_name||''),
        _csvEscape(getWineCuvee(w)),
        _csvEscape(w.vintage||''),
        _csvEscape(w.producer||''),
        _csvEscape(getWineFrazione(w)),
        _csvEscape(getWineRegion(w)),
        _csvEscape(getWineCountry(w)),
        _csvEscape(getCatLabel(catK)),
        _csvEscape(getWineTipo(w)),
        _csvEscape(Array.isArray(w.grapes) ? w.grapes.join(', ') : (w.grapes||'')),
        _csvEscape(getWineMetodo(w)),
        _csvEscape(w.dosaggio||''),
        _csvEscape(getWineMesiSurLie(w)),
        _csvEscape(getWineColtivazione(w)),
        _csvEscape(getWineLieviti(w)),
        _csvEscape(getWinePiedeFranco(w) === 'yes' ? t('Sì','Yes','Oui','Да') : (getWinePiedeFranco(w) === 'no' ? t('No','No','Non','Нет') : (getWinePiedeFranco(w)||''))),
        _csvEscape(getWineCertificazioni(w).join(', ')),
        _csvEscape(getWineNoteAffinamento(w)),
        _csvEscape(+(w.price_sale||0).toFixed(2)),
        _csvEscape(q),
        _csvEscape(minTh),
        _csvEscape(st),
        _csvEscape(w.onList === false ? t('RISERVA','RESERVE','RÉSERVE','РЕЗЕРВ') : t('IN CARTA','ON LIST','EN CARTE','В КАРТЕ')),
        _csvEscape(getPurchaseUrl(w)),
        _csvEscape(badges.join(', '))
      ].join(';'));
    });
    var date = new Date().toISOString().slice(0,10);
    _downloadBlob('inventario_' + (state.restaurantSlug||'ristorante') + '_' + date + '.csv', rows.join('\n'));
  }
  function swDashExportSales(days) {
    var list = state.movements && state.movements.length ? state.movements.slice() : [];
    if (!days) days = 1;
    var now = Date.now();
    var limit = now - (days * 86400000);
    var filtered = list.filter(function(m){ return (m.movement_type || m.k) === 'sale' && new Date(m.at).getTime() >= limit; });
    if (!filtered.length) { alert(t('Nessuna vendita nel periodo.', 'No sales in the period.', 'Aucune vente dans la période.', 'Нет продаж за период.')); return; }
    var headers = ['Data Ora','ID Movimento','Vino','Produttore','Quantità','Prezzo Unit. (€)','Totale (€)','Tavolo / Fonte','Note'];
    var rows = [headers.join(';')];
    filtered.sort(function(a,b){ return new Date(b.at).getTime() - new Date(a.at).getTime(); });
    filtered.forEach(function(m){
      rows.push([
        _csvEscape(new Date(m.at).toLocaleString()),
        _csvEscape(m._id||m.id||''),
        _csvEscape(m.wine||''),
        _csvEscape(m.producer||''),
        _csvEscape(+(m.quantity_delta||m.qty||0)),
        _csvEscape(+(m.price_unit||0).toFixed(2)),
        _csvEscape(+((m.quantity_delta||m.qty||0)*(m.price_unit||0)).toFixed(2)),
        _csvEscape(m.source||m.tavolo||''),
        _csvEscape(m.reason||'')
      ].join(';'));
    });
    var date = new Date().toISOString().slice(0,10);
    var suffix = (days === 1) ? 'oggi' : (days === 7 ? 'settimana' : ('ultimi'+days+'g'));
    _downloadBlob('vendite_' + suffix + '_' + (state.restaurantSlug||'ristorante') + '_' + date + '.csv', rows.join('\n'));
  }
  window.swDashExportInventory = swDashExportInventory;
  window.swDashExportSales = swDashExportSales;

  /* ===================== GLOBALI: FILTRI / ORDINAMENTO / LINK ACQUISTO ===================== */
  window.swDashFilterCat = function(catKey) {
    if (!state.ui) state.ui = { catFilter: 'all', sort: 'name-asc' };
    state.ui.catFilter = (catKey === 'all' || !catKey) ? 'all' : catKey;
    renderDashboard();
  };
  window.swDashSortBy = function(sortKey) {
    if (!state.ui) state.ui = { catFilter: 'all', sort: 'name-asc' };
    state.ui.sort = sortKey || 'name-asc';
    renderDashboard();
  };
  window.swDashEditPurchaseUrl = function(i) {
    var w = state.wines[i|0];
    if (!w) return;
    var cur = getPurchaseUrl(w);
    var msg = t('Link acquisto vino (https://...)\nLascia vuoto per rimuoverlo.', 'Wine purchase link (https://...)\nLeave empty to remove.', 'Lien achat vin (https://...)\nLaisser vide pour supprimer.', 'Ссылка покупки (https://...)\nОставьте пустым, чтобы удалить.');
    var u = prompt(msg + '\n\n' + (w.wine_name||'') + (w.vintage ? ' ('+w.vintage+')' : ''), cur);
    if (u === null) return;
    w.purchase_url = u.trim();
    saveState();
    renderDashboard();
  };
  function saveState() {
    try {
      var key = 'swl_wines_' + (state.restaurantSlug || 'demo');
      localStorage.setItem(key, JSON.stringify(state.wines));
    } catch(e){}
    try {
      if (state.restaurant && state.restaurant.slug) {
        var rkey = 'swl_restaurant_' + state.restaurant.slug;
        try {
          if (typeof state.restaurant.wines !== 'number') state.restaurant.wines = (state.wines || []).length;
          localStorage.setItem(rkey, JSON.stringify(state.restaurant));
        } catch(e){}
      }
    } catch(e){}
    try { _syncWinesToServer().catch(function(){}); } catch(e){}
  }
  function _syncWinesToServer() {
    try {
      var slug = state.restaurantSlug || (state.restaurant && state.restaurant.slug) || '';
      if (!slug || !window._swlFetch) return Promise.resolve(true);
      var tasks = [];
      tasks.push(window._swlFetch('/api/swl/restaurants/' + encodeURIComponent(slug) + '/wines', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wines: Array.isArray(state.wines) ? state.wines : [] })
      }, 3500).catch(function(){}));
      if (state.restaurant) {
        if (typeof state.restaurant.wines !== 'number') state.restaurant.wines = (state.wines || []).length;
        tasks.push(window._swlFetch('/api/swl/restaurants/' + encodeURIComponent(slug), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state.restaurant || {})
        }, 3500).catch(function(){}));
      }
      return Promise.all(tasks).then(function(){ return true; }).catch(function(){ return true; });
    } catch(e) { return Promise.resolve(true); }
  }

  /* ============================================================
     MODALE FORM GESTIONE VINI (Sostituisce 22 prompt() consecutivi)
     ============================================================ */
  function _swEnsureModalCss() {
    if (document.getElementById('sw-modal-css')) return;
    var st = document.createElement('style');
    st.id = 'sw-modal-css';
    st.textContent = [
      '.swm-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.45);backdrop-filter:blur(3px);z-index:999999;display:flex;align-items:flex-start;justify-content:center;padding:32px 16px;overflow-y:auto;}',
      '.swm-box{background:#fff;border-radius:12px;box-shadow:0 30px 60px -20px rgba(15,23,42,.35);width:min(960px,100%);max-height:calc(100vh - 64px);overflow:hidden;display:flex;flex-direction:column;border:1px solid #e5e7eb;}',
      '.swm-head{padding:18px 22px;border-bottom:1px solid #f1f5f9;display:flex;align-items:center;gap:12px;}',
      '.swm-head h2{margin:0;font-size:1.05rem;font-weight:700;color:#0f172a;}',
      '.swm-head .swm-close{margin-left:auto;border:1px solid #e5e7eb;background:#fff;padding:5px 10px;border-radius:6px;cursor:pointer;color:#6b7280;font-size:.75rem;font-weight:600;}',
      '.swm-head .swm-close:hover{background:#f9fafb;color:#111827;}',
      '.swm-body{padding:20px 22px;overflow-y:auto;flex:1;}',
      '.swm-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 18px;}',
      '.swm-field{display:flex;flex-direction:column;gap:4px;}',
      '.swm-field.full{grid-column:1 / -1;}',
      '.swm-field label{font-size:.68rem;font-weight:600;color:#374151;letter-spacing:.02em;text-transform:uppercase;}',
      '.swm-field label span{color:#94a3b8;font-weight:400;text-transform:none;letter-spacing:0;margin-left:4px;font-size:.62rem;}',
      '.swm-field input,.swm-field select,.swm-field textarea{border:1px solid #d1d5db;border-radius:6px;padding:7px 10px;font-size:.82rem;color:#0f172a;background:#fff;font-family:Inter,system-ui,-apple-system,sans-serif;outline:none;transition:border-color .1s;}',
      '.swm-field input:focus,.swm-field select:focus,.swm-field textarea:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.12);}',
      '.swm-field textarea{min-height:64px;resize:vertical;}',
      '.swm-legend{font-size:.65rem;color:#64748b;margin-top:2px;}',
      '.swm-sep{grid-column:1/-1;border-top:1px solid #f1f5f9;margin:6px 0 2px;padding-top:6px;font-size:.7rem;font-weight:700;color:#111827;letter-spacing:.04em;text-transform:uppercase;}',
      '.swm-foot{padding:14px 22px;border-top:1px solid #f1f5f9;display:flex;align-items:center;gap:10px;background:#fafafa;}',
      '.swm-foot .spacer{flex:1;}',
      '.swm-btn{border:1px solid #e5e7eb;background:#fff;padding:8px 14px;border-radius:7px;font-size:.78rem;font-weight:600;cursor:pointer;color:#374151;}',
      '.swm-btn:hover{background:#f9fafb;color:#111827;}',
      '.swm-btn-primary{background:#0f172a;color:#fff;border-color:#0f172a;}',
      '.swm-btn-primary:hover{background:#1f2937;color:#fff;}',
      '.swm-btn-danger{background:#fff;color:#b91c1c;border-color:#fecaca;}',
      '.swm-btn-danger:hover{background:#fef2f2;}',
      '@media(max-width:640px){.swm-grid{grid-template-columns:1fr;}}'
    ].join('');
    document.head.appendChild(st);
  }

  function _swWineFormFields(wine) {
    var w = wine || {};
    var getVal = function(k, def){ def = def==null?'':def; return (typeof w[k]==='undefined'||w[k]==null)?def:w[k]; };
    var grapes = Array.isArray(w.grapes)?w.grapes.join(', '):(w.grapes||'');
    var certs = Array.isArray(w.certificazioni)?w.certificazioni.join(', '):(w.certificazioni||'');
    var optsTipo = [
      {v:'bianco',l:'Bianco'},{v:'rosso',l:'Rosso'},{v:'rosato',l:'Rosato / Rosé'},
      {v:'bollicine',l:'Bollicine / Spumante'},{v:'dolce',l:'Dolce / Passito'},
      {v:'francia_bollicine',l:'Champagne & Crémant'},{v:'francia',l:'Vini Francesi'},{v:'mondo',l:'Vini del Mondo'}
    ];
    var optsColtivazione = ['','Convenzionale','Biologica','Biodinamica','Etica','Naturale'];
    var optsLieviti = ['','Selezionati','Indigeni','Misti'];
    var optsPiede = ['','no','yes'];
    var optsDosaggio = ['','Brut','Extra Brut','Nature','Pas Dosé','Demi-Sec','Sec','Rosé'];
    var optsMetodo = ['','Metodo Classico','Charmat / Martinotti','Metodo Ancestrale','Sciampagne'];
    var select = function(key, current, listArr, isValLabelPairs){
      var h = '<select id="swm_'+key+'" name="'+key+'"><option value="">—</option>';
      listArr.forEach(function(o){
        var v = typeof o==='object' ? o.v : o;
        var l = typeof o==='object' ? o.l : o;
        h += '<option value="'+v+'"'+(String(current)===String(v)?' selected':'')+'>'+l+'</option>';
      });
      return h + '</select>';
    };
    var inp = function(key,current,type,placeholder){
      type = type||'text';
      if (type==='textarea') return '<textarea id="swm_'+key+'" name="'+key+'" placeholder="'+(placeholder||'')+'">'+String(current||'').replace(/</g,'&lt;')+'</textarea>';
      return '<input type="'+type+'" id="swm_'+key+'" name="'+key+'" value="'+String(current==null?'':current).replace(/"/g,'&quot;')+'" '+(placeholder?'placeholder="'+placeholder+'"':'')+'>';
    };
    var required = '<span style="color:#b91c1c;font-weight:700;">*</span>';
    return [
      '<div class="swm-sep">'+t('① Informazioni base','① Basic info','① Infos de base','① Основная')+'</div>',
      '<div class="swm-field"><label>'+required+' '+t('Etichetta / Nome vino','Wine label / Name','Nom du vin','Название вина')+' <span>'+t('es. La Grande Année','e.g. La Grande Année','Ex : La Grande Année','Напр. La Grande Année')+'</span></label>'+inp('wine_name',getVal('wine_name'),'text','La Grande Année')+'</div>',
      '<div class="swm-field"><label>'+t('Annata','Vintage','Millésime','Год')+' <span>'+t('o lascia s.a. per non datato','or s.a. for non-vintage','ou s.a. sans année','или s.a. без года')+'</span></label>'+inp('vintage',getVal('vintage'),'text','2020 / s.a.')+'</div>',
      '<div class="swm-field"><label>'+t('Produttore','Producer','Producteur','Производитель')+'</label>'+inp('producer',getVal('producer'),'text','Bollinger')+'</div>',
      '<div class="swm-field"><label>'+t('Frazione / Comune','Village / Commune','Commune / Village','Деревня / Коммуна')+' <span>'+t('es. Ay, Marne','e.g. Ay, Marne','Ex : Ay, Marne','Напр. Ay, Marne')+'</span></label>'+inp('frazione',getVal('frazione')||getVal('village'),'text','Ay, Marne')+'</div>',
      '<div class="swm-field"><label>'+t('Regione / Appellation','Region / Appellation','Région / Appellation','Регион / Аппелласьон')+'</label>'+inp('region',getVal('region')||getVal('appellation'),'text','Champagne AOC')+'</div>',
      '<div class="swm-field"><label>'+t('Paese','Country','Pays','Страна')+'</label>'+inp('country',getVal('country'),'text','Italia / Francia')+'</div>',
      '<div class="swm-field"><label>'+t('Tipologia','Type','Type','Тип')+'</label>'+select('tipo',getVal('tipo')||getVal('wine_type')||'', optsTipo, true)+'</div>',
      '<div class="swm-sep">'+t('② Identità bottiglia','② Bottle identity','② Identité bouteille','② Идентичность')+'</div>',
      '<div class="swm-field"><label>'+t('Nome Cuvée / Nome bottiglia','Cuvée / Bottle name','Nom Cuvée / Bouteille','Название Кюве / Бутылки')+'</label>'+inp('cuvée',getVal('cuvée')||getVal('cuvee'),'text','La Grande Année')+'</div>',
      '<div class="swm-field"><label>'+t('Metodo Spumante','Sparkling method','Méthode','Метод игристого')+'</label>'+select('metodo_spumante',getVal('metodo_spumante')||getVal('sparkling_method'),optsMetodo)+'</div>',
      '<div class="swm-field"><label>'+t('Dosaggio','Dosage','Dosage','Дозаж')+'</label>'+select('dosaggio',getVal('dosaggio'),optsDosaggio)+'</div>',
      '<div class="swm-field"><label>'+t('Mesi sur lie (numero)','Sur lie months (number)','Mois sur lie (nombre)','Месяцев сюр ли (число)')+'</label>'+inp('mesi_sur_lie',getVal('mesi_sur_lie')||getVal('sur_lie_mesi'),'number','96')+'</div>',
      '<div class="swm-field full"><label>'+t('Vitigni (separati da virgola)','Grapes (comma separated)','Cépages (séparés par virgule)','Сорта винограда (через запятую)')+'</label>'+inp('grapes',grapes,'text','Pinot Noir, Chardonnay')+'<div class="swm-legend">'+t('es. Pinot Noir, Chardonnay — NON usare "e".','e.g. Pinot Noir, Chardonnay — no "and".','Ex : Pinot Noir, Chardonnay — pas de "et".','Напр. Pinot Noir, Chardonnay — без «и».')+'</div></div>',
      '<div class="swm-sep">'+t('③ Qualità e certificazioni','③ Quality & certs','③ Qualité & certifications','③ Качество и сертификаты')+'</div>',
      '<div class="swm-field"><label>'+t('Coltivazione','Farming','Culture','Возделывание')+'</label>'+select('coltivazione',getVal('coltivazione')||getVal('farming'),optsColtivazione)+'</div>',
      '<div class="swm-field"><label>'+t('Lieviti','Yeasts','Levures','Дрожжи')+'</label>'+select('lieviti',getVal('lieviti')||getVal('yeast'),optsLieviti)+'</div>',
      '<div class="swm-field"><label>'+t('Piede Franco','Ungrafted rootstock (Pied Franc)','Pied Franc','Корнесобственная лоза')+'</label>'+select('piede_franco',getVal('piede_franco')||'',optsPiede)+'</div>',
      '<div class="swm-field"><label>'+t('Certificazioni (virgola)','Certifications (comma)','Certifications (virgule)','Сертификаты (через запятую)')+' <span>BioDemeter,Vegan,AAA...</span></label>'+inp('certificazioni',certs,'text','Biologico, Vegan, Triple A')+'</div>',
      '<div class="swm-field full"><label>'+t('Note Affinamento / Terroir','Aging notes / Terroir','Notes d\'élevage / Terroir','Ноты выдержки / Терруар')+' <span>opzionale · optional</span></label>'+inp('note_terroir',getVal('note_terroir')||getVal('affinamento'),'textarea','Fermentato in botte grandi per 24 mesi su fecce fini. Terroir argillo-sabbioso, 380 msl.')+'</div>',
      '<div class="swm-sep">'+t('④ Commerciale e inventario','④ Commercial & inventory','④ Commercial & inventaire','④ Коммерческая')+'</div>',
      // ── PREZZI ──
      '<div class="swm-field full" style="background:rgba(212,175,55,.04);border:1px solid rgba(212,175,55,.15);border-radius:10px;padding:14px;margin-bottom:8px;">',
        '<div style="font-family:Cinzel,serif;font-size:.4rem;letter-spacing:2px;color:rgba(212,175,55,.7);margin-bottom:12px;">💰 ' + t('PREZZI','PRICES','PRIX','ЦЕНЫ') + '</div>',
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">',
          '<div>',
            '<label style="font-size:.72rem;color:rgba(245,239,226,.55);display:block;margin-bottom:4px;">',
              t('Prezzo acquisto (€)','Purchase price (€)','Prix achat (€)','Цена покупки (€)'),
            '</label>',
            '<input id="swm_price_purchase" type="number" step="0.01" min="0" placeholder="0.00"',
              ' value="' + (getVal('price_purchase') || '') + '"',
              ' oninput="swCalcMarkup()"',
              ' style="width:100%;padding:8px;background:rgba(0,0,0,.4);border:1px solid rgba(212,175,55,.2);border-radius:6px;color:#F5EFE2;font-size:.9rem;">',
            '<div style="font-size:.68rem;color:rgba(245,239,226,.35);margin-top:3px;">' + t('Quanto paghi al fornitore','What you pay the supplier','Ce que vous payez','Цена поставщика') + '</div>',
          '</div>',
          '<div>',
            '<label style="font-size:.72rem;color:rgba(245,239,226,.55);display:block;margin-bottom:4px;">',
              t('Prezzo in carta (€)','Wine list price (€)','Prix carte (€)','Цена в меню (€)'),
            '</label>',
            '<input id="swm_price_carta" type="number" step="0.50" min="0" placeholder="0.00"',
              ' value="' + (getVal('price_carta') || getVal('price_sale') || '') + '"',
              ' oninput="swCalcMarkup()"',
              ' style="width:100%;padding:8px;background:rgba(0,0,0,.4);border:1px solid rgba(212,175,55,.2);border-radius:6px;color:#F5EFE2;font-size:.9rem;">',
            '<div style="font-size:.68rem;color:rgba(245,239,226,.35);margin-top:3px;">' + t('Quello che vede il cliente','What the customer sees','Ce que voit le client','Цена для клиента') + '</div>',
          '</div>',
        '</div>',
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">',
          '<div>',
            '<label style="font-size:.72rem;color:rgba(245,239,226,.55);display:block;margin-bottom:4px;">',
              t('Prezzo al calice (€)','By-the-glass price (€)','Prix au verre (€)','Цена за бокал (€)'),
              ' <span style="font-size:.65rem;color:rgba(245,239,226,.3);">' + t('opzionale','optional','optionnel','опционально') + '</span>',
            '</label>',
            '<input id="swm_price_bicchiere" type="number" step="0.50" min="0" placeholder="—"',
              ' value="' + (getVal('price_bicchiere') || '') + '"',
              ' style="width:100%;padding:8px;background:rgba(0,0,0,.4);border:1px solid rgba(212,175,55,.2);border-radius:6px;color:#F5EFE2;font-size:.9rem;">',
            '<div style="font-size:.68rem;color:rgba(245,239,226,.35);margin-top:3px;">' + t('Regola: ≥ costo bottiglia al 1° calice','Rule: ≥ bottle cost at 1st glass','Règle: ≥ coût bouteille au 1er verre','Правило: ≥ себестоимость за 1 бокал') + '</div>',
          '</div>',
          '<div>',
            '<label style="font-size:.72rem;color:rgba(245,239,226,.55);display:block;margin-bottom:4px;">' + t('Markup e margine','Markup & margin','Markup et marge','Наценка') + '</label>',
            '<div id="swMarkupDisplay" style="padding:8px;background:rgba(0,0,0,.3);border:1px solid rgba(212,175,55,.1);border-radius:6px;min-height:38px;font-size:.82rem;"></div>',
          '</div>',
        '</div>',
        '<div id="swMarkupSuggestion" style="display:none;padding:10px;background:rgba(212,175,55,.06);border:1px solid rgba(212,175,55,.2);border-radius:8px;font-size:.78rem;"></div>',
      '</div>',
      '<button type="button" onclick="swOpenPriceHelper()" style="padding:7px 14px;background:rgba(212,175,55,.08);border:1px solid rgba(212,175,55,.2);border-radius:8px;color:rgba(212,175,55,.7);font-size:.75rem;cursor:pointer;margin-top:-4px;">',
        '🧮 ' + t('Calcola prezzo ottimale','Calculate optimal price','Calculer prix optimal','Рассчитать цену'),
      '</button>',
      '<div class="swm-field"><label>'+t('Giacenza (bottiglie)','Stock (bottles)','Stock (bouteilles)','Остаток (шт.)')+'</label>'+inp('quantity_bottles',getVal('quantity_bottles')==null?6:getVal('quantity_bottles'),'number','6')+'</div>',
      '<div class="swm-field"><label>'+t('Soglia minima riordino','Min. reorder threshold','Seuil réappro mini','Мин. порог заказа')+'</label>'+inp('minimum_threshold',getVal('minimum_threshold')==null?3:getVal('minimum_threshold'),'number','3')+'</div>',
      '<div class="swm-field full"><label>'+t('Link acquisto fornitore (opzionale)','Supplier buy link (optional)','Lien achat (optionnel)','Ссылка покупки (необяз.)')+'</label>'+inp('purchase_url',getVal('purchase_url'),'url','https://www.tannico.it/...')+'</div>',
      '<div class="swm-field full"><label>'+t('Stato acquisto','Purchase status','État achat','Статус покупки')+'</label>'+
        '<select id="swm_purchaseStatus" style="width:100%;padding:8px;background:rgba(0,0,0,.4);border:1px solid rgba(212,175,55,.2);border-radius:6px;color:#F5EFE2;">'+
          '<option value="ordered" '+(getVal('purchaseStatus')==='ordered'?'selected':'')+'>📦 '+t('Ho ordinato — in attesa consegna','Ordered — awaiting delivery','Commandé — en attente','Заказано — ожидает доставки')+'</option>'+
          '<option value="in_cellar" '+(getVal('purchaseStatus')==='in_cellar'||!getVal('purchaseStatus')?'selected':'')+'>🏠 '+t('In cantina — non in carta','In cellar — not on list','En cave — pas en carte','В погребе — не в карте')+'</option>'+
          '<option value="on_list" '+(getVal('purchaseStatus')==='on_list'?'selected':'')+'>📋 '+t('In carta — visibile agli ospiti','On list — visible to guests','En carte — visible aux clients','В карте — видно гостям')+'</option>'+
        '</select>'+
      '</div>'
    ].join('');
  }

  function _swCollectFormValues() {
    function v(id){ var el=document.getElementById('swm_'+id); if(!el) return ''; if (el.tagName==='SELECT') return el.value; return el.value; }
    var _ps = String(v('purchaseStatus')||'in_cellar');
    var wine = {
      wine_name:         String(v('wine_name')||'').trim(),
      vintage:           String(v('vintage')||'').trim(),
      producer:          String(v('producer')||'').trim(),
      frazione:          String(v('frazione')||'').trim(),
      village:           String(v('frazione')||'').trim(),
      region:            String(v('region')||'').trim(),
      appellation:       String(v('region')||'').trim(),
      country:           String(v('country')||'').trim(),
      tipo:              String(v('tipo')||'').trim(),
      wine_type:         String(v('tipo')||'').trim(),
      cuvée:             String(v('cuvée')||'').trim(),
      cuvee:             String(v('cuvée')||'').trim(),
      metodo_spumante:   String(v('metodo_spumante')||'').trim(),
      dosaggio:          String(v('dosaggio')||'').trim(),
      mesi_sur_lie:      +v('mesi_sur_lie') || 0,
      grapes:            String(v('grapes')||'').split(/[,;]/).map(function(s){return s.trim();}).filter(Boolean),
      vitigni:           String(v('grapes')||'').split(/[,;]/).map(function(s){return s.trim();}).filter(Boolean),
      coltivazione:      String(v('coltivazione')||'').trim(),
      lieviti:           String(v('lieviti')||'').trim(),
      piede_franco:      String(v('piede_franco')||'').trim(),
      certificazioni:    String(v('certificazioni')||'').split(/[,;]/).map(function(s){return s.trim();}).filter(Boolean),
      note_terroir:      String(v('note_terroir')||'').trim(),
      affinamento:       String(v('note_terroir')||'').trim(),
      price_purchase:  parseFloat((document.getElementById('swm_price_purchase')||{}).value)  || 0,
      price_carta:     parseFloat((document.getElementById('swm_price_carta')   ||{}).value)  || 0,
      price_bicchiere: parseFloat((document.getElementById('swm_price_bicchiere')||{}).value) || 0,
      price_sale:      parseFloat((document.getElementById('swm_price_carta')   ||{}).value)  || 0, // compatibilità
      markup_pct:      (function(){
        var a = parseFloat((document.getElementById('swm_price_purchase')||{}).value)||0;
        var c = parseFloat((document.getElementById('swm_price_carta')   ||{}).value)||0;
        return a > 0 ? Math.round((c - a) / a * 100) : 0;
      })(),
      quantity_bottles:  +v('quantity_bottles') || 0,
      minimum_threshold: +v('minimum_threshold') || 3,
      purchase_url:      String(v('purchase_url')||'').trim(),
      purchaseStatus:    _ps,
      onList:            (_ps === 'on_list')
    };
    if (!wine.wine_name) { alert(t('Inserisci almeno il nome dell\'etichetta','Insert at least the wine label name','Entrez au moins le nom de l\'étiquette','Введите хотя бы название этикетки')); document.getElementById('swm_wine_name').focus(); return null; }
    return wine;
  }

  // Calcola fascia prezzo ottimale in base al tipo di locale e al costo acquisto
  function swSuggerisciPrezzo(acq) {
    var tipo = (state.restaurant && state.restaurant.tipo) || 'trattoria';
    var mult = tipo === 'fine_dining' ? 1.25 : tipo === 'enoteca' ? 1.10 : tipo === 'hotel' ? 1.20 : 1.0;

    var baseMin, baseMax;
    if      (acq <  8)  { baseMin = 2.5; baseMax = 3.5; }
    else if (acq < 15)  { baseMin = 2.2; baseMax = 3.0; }
    else if (acq < 30)  { baseMin = 1.8; baseMax = 2.5; }
    else if (acq < 60)  { baseMin = 1.6; baseMax = 2.0; }
    else                { baseMin = 1.4; baseMax = 1.8; }

    var min  = Math.round(acq * baseMin * mult / 0.5) * 0.5;
    var max  = Math.round(acq * baseMax * mult / 0.5) * 0.5;
    var mid  = Math.round((min + max) / 2 / 0.5) * 0.5;
    return { min: min, max: max, mid: mid };
  }

  function swCalcMarkup() {
    var acq  = parseFloat((document.getElementById('swm_price_purchase') || {}).value) || 0;
    var cart = parseFloat((document.getElementById('swm_price_carta')    || {}).value) || 0;
    var disp = document.getElementById('swMarkupDisplay');
    var sugg = document.getElementById('swMarkupSuggestion');
    if (!disp) return;

    if (!acq || !cart) { disp.innerHTML = '<span style="color:rgba(245,239,226,.3);">—</span>'; if(sugg)sugg.style.display='none'; return; }

    var markup    = Math.round((cart - acq) / acq * 100);
    var margine   = (cart - acq).toFixed(2);
    var wineRatio = (acq / cart * 100).toFixed(0); // food cost %

    var color = markup >= 80 && markup <= 250 ? '#22c55e' : markup < 80 ? '#ef4444' : '#f59e0b';

    disp.innerHTML =
      '<span style="color:' + color + ';font-weight:700;font-size:.95rem;">+' + markup + '%</span>' +
      '<span style="color:rgba(245,239,226,.45);margin:0 6px;">·</span>' +
      '<span style="color:rgba(245,239,226,.7);">+€' + margine + '</span>' +
      '<span style="color:rgba(245,239,226,.35);font-size:.7rem;margin-left:4px;">wine cost ' + wineRatio + '%</span>';

    var ottimale = swSuggerisciPrezzo(acq);
    if (sugg) {
      var alertMsg = '';
      if (markup < 80) {
        alertMsg = '⚠️ ' + t('Markup troppo basso. Stai vendendo quasi a costo.','Markup too low. You\'re selling near cost.','Markup trop bas.','Наценка слишком низкая.') +
          ' ' + t('Suggerito:','Suggested:','Suggéré:','Рекомендуется:') + ' €' + ottimale.min + '–€' + ottimale.max;
      } else if (cart < ottimale.min * 0.8) {
        alertMsg = '💡 ' + t('Potresti portare a','You could raise to','Vous pourriez aller à','Можно поднять до') + ' €' + ottimale.min + '–€' + ottimale.max +
          ' ' + t('per questo tipo di vino.','for this wine tier.','pour cette catégorie.','для этой категории.');
      }
      if (alertMsg) {
        sugg.innerHTML = alertMsg +
          ' <button onclick="document.getElementById(\'swm_price_carta\').value=' + ottimale.mid + ';swCalcMarkup()" style="margin-left:8px;padding:2px 8px;background:rgba(212,175,55,.2);border:1px solid rgba(212,175,55,.3);border-radius:4px;color:#d4af37;font-size:.72rem;cursor:pointer;">' +
          t('Applica €','Apply €','Appliquer €','Применить €') + ottimale.mid + '</button>';
        sugg.style.display = 'block';
      } else {
        sugg.style.display = 'none';
      }
    }
  }
  window.swCalcMarkup = swCalcMarkup;

  window.swOpenPriceHelper = function() {
    var acq = parseFloat((document.getElementById('swm_price_purchase')||{}).value) || 0;
    if (!acq) { alert(t('Inserisci prima il prezzo di acquisto.','Enter purchase price first.','Entrez d\'abord le prix d\'achat.','Сначала введите цену покупки.')); return; }
    var tipo = (state.restaurant && state.restaurant.tipo) || 'trattoria';
    var ott = swSuggerisciPrezzo(acq);
    var bicchiere = Math.round(acq * 1.1 * 2) / 2; // primo calice copre costo bottiglia

    var html = '<div style="font-size:.82rem;color:rgba(245,239,226,.7);">' +
      '<div style="margin-bottom:8px;"><strong>' + t('Locale:','Venue:','Établissement:','Тип:') + '</strong> ' + tipo + '</div>' +
      '<div style="margin-bottom:8px;"><strong>' + t('Prezzo acquisto:','Purchase:','Achat:','Покупка:') + '</strong> €' + acq.toFixed(2) + '</div>' +
      '<hr style="border-color:rgba(212,175,55,.15);margin:10px 0;">' +
      '<div style="margin-bottom:6px;">💡 <strong>' + t('Prezzo carta consigliato:','Suggested list price:','Prix carte suggéré:','Рекомендуемая цена:') + '</strong></div>' +
      '<div style="font-size:1.1rem;color:#d4af37;font-weight:700;margin-bottom:8px;">€' + ott.min + ' — €' + ott.max + '</div>' +
      '<div style="margin-bottom:6px;">🥂 <strong>' + t('Prezzo calice consigliato:','Suggested glass price:','Prix verre suggéré:','Цена за бокал:') + '</strong></div>' +
      '<div style="font-size:1rem;color:#d4af37;font-weight:700;margin-bottom:10px;">€' + bicchiere + '</div>' +
      '<div style="font-size:.72rem;color:rgba(245,239,226,.35);font-style:italic;">' + t('Il 1° calice a €','The 1st glass at €','Le 1er verre à €','1-й бокал по €') + bicchiere + t(' copre il costo della bottiglia. Dal 2° calice in poi è puro margine.',' covers the full bottle cost. From the 2nd glass it\'s pure margin.',' couvre le coût. À partir du 2e verre, c\'est du pur profit.',' покрывает стоимость. Со 2-го бокала — чистая прибыль.') + '</div>' +
      '<div style="display:flex;gap:8px;margin-top:14px;">' +
        '<button onclick="document.getElementById(\'swm_price_carta\').value=' + ott.mid + ';document.getElementById(\'swm_price_bicchiere\').value=' + bicchiere + ';swCalcMarkup();this.closest(\'[style*=fixed]\').remove()" style="flex:1;padding:9px;background:rgba(128,0,32,.6);border:1px solid rgba(212,175,55,.3);border-radius:8px;color:#F5EFE2;font-size:.78rem;font-weight:600;cursor:pointer;">✅ ' + t('Applica prezzi','Apply prices','Appliquer les prix','Применить') + '</button>' +
        '<button onclick="this.closest(\'[style*=fixed]\').remove()" style="padding:9px 14px;background:rgba(255,255,255,.06);border:1px solid rgba(212,175,55,.15);border-radius:8px;color:rgba(245,239,226,.5);font-size:.78rem;cursor:pointer;">' + t('Annulla','Cancel','Annuler','Отмена') + '</button>' +
      '</div>' +
    '</div>';

    var m = document.createElement('div');
    m.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#1A130A;border:1px solid rgba(212,175,55,.3);border-radius:14px;padding:20px;z-index:9999;width:300px;box-shadow:0 20px 60px rgba(0,0,0,.5);';
    m.innerHTML = '<div style="font-family:Cinzel,serif;font-size:.44rem;letter-spacing:3px;color:rgba(212,175,55,.7);margin-bottom:12px;">🧮 ' + t('CALCOLATORE PREZZI','PRICE CALCULATOR','CALCULATEUR PRIX','КАЛЬКУЛЯТОР') + '</div>' + html;
    document.body.appendChild(m);
    m.addEventListener('click', function(e){ if(e.target===m) m.remove(); });
  };

  window.swOpenWineModal = function(opts) {
    opts = opts || {};
    _swEnsureModalCss();
    var isEdit = opts.mode === 'edit';
    var idx = +opts.index | 0;
    var wine = null;
    if (isEdit) wine = state.wines[idx] || null;
    else wine = { onList: true, status:'available', currency:'EUR', country:'Italia' };
    if (isEdit && !wine) { alert(t('Vino non trovato','Wine not found','Vin introuvable','Вино не найдено')); return; }
    var title = isEdit
      ? t('✏️ Modifica vino','✏️ Edit wine','✏️ Modifier le vin','✏️ Изменить вино') + ' — ' + ((wine.wine_name||'Etichetta') + (wine.vintage ? ' ('+wine.vintage+')' : ''))
      : t('＋ Aggiungi Nuovo Vino','＋ Add New Wine','＋ Ajouter un nouveau vin','＋ Добавить новое вино');

    var backdrop = document.createElement('div');
    backdrop.className = 'swm-backdrop';
    backdrop.innerHTML = [
      '<div class="swm-box" role="dialog" aria-modal="true" aria-label="'+title.replace(/"/g,'&quot;')+'">',
        '<div class="swm-head">',
          '<h2>'+title+'</h2>',
          '<button type="button" class="swm-close" data-swm="cancel">✕ '+t('Annulla','Cancel','Annuler','Отмена')+'</button>',
        '</div>',
        '<div class="swm-body">',
          '<form class="swm-grid" id="swmForm" onsubmit="return false;">',
            _swWineFormFields(wine),
          '</form>',
        '</div>',
        '<div class="swm-foot">',
          (isEdit ? '<button type="button" class="swm-btn swm-btn-danger" data-swm="delete">🗑️ '+t('Elimina vino','Delete wine','Supprimer le vin','Удалить вино')+'</button>' : ''),
          '<div class="spacer"></div>',
          '<button type="button" class="swm-btn" data-swm="cancel">'+t('Annulla','Cancel','Annuler','Отмена')+'</button>',
          '<button type="button" class="swm-btn swm-btn-primary" data-swm="save">💾 '+(isEdit ? t('Salva modifiche','Save changes','Enregistrer les modifications','Сохранить изменения') : t('Salva vino in carta','Save wine to list','Enregistrer le vin','Сохранить вино в карту'))+'</button>',
        '</div>',
      '</div>'
    ].join('');
    document.body.appendChild(backdrop);
    function close(){ if (backdrop && backdrop.parentNode) backdrop.parentNode.removeChild(backdrop); }
    function saveAndClose(){
      var data = _swCollectFormValues();
      if (!data) return;
      if (isEdit) {
        Object.keys(data).forEach(function(k){ state.wines[idx][k] = data[k]; });
      } else {
        data._id = 'w_' + Date.now() + '_' + Math.floor(Math.random()*100000);
        data.created_at = new Date().toISOString();
        data.status = data.status || 'available';
        state.wines.unshift(data);
      }
      saveState();
      computeTotals();
      close();
      renderDashboard();
    }
    function deleteAndClose(){
      if (!isEdit) { close(); return; }
      var nome = (wine.wine_name||'vino') + (wine.vintage ? ' ('+wine.vintage+')' : '');
      if (!confirm(t('Eliminare definitivamente: ','Delete permanently: ','Supprimer définitivement : ','Удалить навсегда: ') + nome + ' ?')) return;
      state.wines.splice(idx,1);
      saveState();
      computeTotals();
      close();
      renderDashboard();
    }
    backdrop.addEventListener('click', function(e){
      if (e.target === backdrop) close();
      var btn = e.target.closest('[data-swm]');
      if (!btn) return;
      var act = btn.getAttribute('data-swm');
      if (act==='cancel') close();
      else if (act==='save') saveAndClose();
      else if (act==='delete') deleteAndClose();
    });
    document.addEventListener('keydown', function esc(e){ if (e.key==='Escape'){ close(); document.removeEventListener('keydown', esc); } }, { once:true });
    setTimeout(function(){ var f = document.getElementById('swm_wine_name'); if (f) f.focus(); }, 40);
  };

  window.swDashDeleteWine = function(i) {
    i = i|0;
    var w = state.wines[i];
    if (!w) return;
    window.swOpenWineModal({ mode:'edit', index:i });
  };

  /* fine modale */

  var sections = [
    { id: 'overview',   it: 'Panoramica',       en: 'Overview',         fr: 'Aperçu',               ru: 'Обзор',         icon: '📊' },
    { id: 'carta_ai',   it: 'Consulente Carta', en: 'Wine List Advisor', fr: 'Conseiller Carte',    ru: 'Советник Карты', icon: '🤖' },
    { id: 'winecard',   it: 'Carta dei Vini',   en: 'Wine List',        fr: 'Carte des Vins',       ru: 'Винная карта',  icon: '📜' },
    { id: 'inventory',  it: 'Inventario',       en: 'Inventory',        fr: 'Inventaire',           ru: 'Инвентарь',    icon: '📦' },
    { id: 'orders',     it: 'Ordini Venduti',   en: 'Sold Orders',      fr: 'Commandes vendues',    ru: 'Продажи',       icon: '🧾' },
    { id: 'suppliers',  it: 'Distributori SW',  en: 'SW Suppliers',     fr: 'Fournisseurs SW',      ru: 'Поставщики SW', icon: '🛒' },
    { id: 'accounting', it: 'Contabilità',      en: 'Accounting',       fr: 'Comptabilité',         ru: 'Бухгалтерия',  icon: '📒' },
    { id: 'movements',  it: 'Movimenti',        en: 'Movements',        fr: 'Mouvements',           ru: 'Движения',      icon: '📋' },
    { id: 'tavoli',     it: 'Tavoli',           en: 'Tables',           fr: 'Tables',               ru: 'Столы',         icon: '🍽️' },
    { id: 'admin',      it: 'Gestione Ristoranti', en: 'Manage Restaurants', fr: 'Gestion Restaurants', ru: 'Управление ресторанами', icon: '🛡️', admin: true }
  ];

  var getSectionLabel = function(id) {
    var s = sections.find(function(x){return x.id===id;});
    return s ? t(s.it, s.en, s.fr, s.ru) : id;
  };
  var getSectionIcon = function(id) {
    var s = sections.find(function(x){return x.id===id;});
    return s ? s.icon : '●';
  };

  function initDashboard() {
    var sess = getSession();
    if (!sess || !sess.slug) {
      state.session = null;
      state.isSuperAdmin = false;
      renderLogin();
      return;
    }
    state.session = sess;
    state.restaurantSlug = sess.slug;
    state.isSuperAdmin = sess.superAdmin === true;

    Promise.all([
      loadRestaurant().catch(function(){}),
      loadPublicWines().catch(function(){}),
      loadMovements().catch(function(){})
    ]).then(function(){
      generateSampleOrders();
      state.loading = false;
      renderDashboard();
    }).catch(function(){
      generateSampleOrders();
      state.loading = false;
      renderDashboard();
    });
  }

  /* =======================================================
     LOGIN - accesso faclile area personale
     ======================================================= */
  function renderLogin() {
    var root = document.getElementById('page-dashboard');
    if (!root) return;
    root.innerHTML = [
      '<div class="sw-dash-login-wrap">',
        '<div class="sw-dash-login-card">',
          '<div class="sw-dash-login-head">',
            '<div class="sw-dash-login-brand">🍇</div>',
            '<h2>Area Personale</h2>',
            '<p>' + t('Gestisci la carta dei vini, gli ordini e la tua attività', 'Manage your wine list, orders and activity', 'Gérez votre carte des vins, commandes et activité', 'Управляйте винной картой, заказами и активностью') + '</p>',
          '</div>',
          '<form id="swDashLoginForm" autocomplete="off" onsubmit="return false;">',
            '<div class="sw-dash-login-field">',
              '<label>' + t('Ristorante / Slug', 'Restaurant / Slug', 'Restaurant / Slug', 'Ресторан / Слаг') + '</label>',
              '<input id="swLoginSlug" type="text" placeholder="demo-ristorante" value="demo-ristorante" spellcheck="false">',
            '</div>',
            '<div class="sw-dash-login-field">',
              '<label>' + t('Email', 'Email', 'Email', 'Email') + '</label>',
              '<input id="swLoginEmail" type="email" placeholder="tuo@ristorante.it" value="demo@sommelierworld.vin" spellcheck="false">',
            '</div>',
            '<div class="sw-dash-login-field">',
              '<label>' + t('Password', 'Password', 'Mot de passe', 'Пароль') + '</label>',
              '<input id="swLoginPass" type="password" placeholder="••••••••" value="demo2026">',
            '</div>',
            '<button type="submit" class="sw-dash-btn sw-dash-btn-primary" style="width:100%;padding:12px 16px;font-size:.72rem;margin-top:4px;">',
              t('Accedi all\'Area Personale', 'Sign in to Dashboard', 'Connexion au Tableau de bord', 'Войти в Личный Кабинет'),
            '</button>',
            '<div style="margin-top:10px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">',
              '<button type="button" id="swLoginSuper" class="sw-dash-btn sw-dash-btn-ghost" style="padding:8px 14px;font-size:.64rem;">🛡️ ' + t('Accedi come Super Admin', 'Sign in as Super Admin', 'Connexion Super Admin', 'Войти как Супер Админ') + '</button>',
            '</div>',
          '</form>',
          '<div class="sw-dash-login-note">',
            t('👋 Demo veloce: usa <strong>demo-ristorante</strong> e qualsiasi password.', '👋 Quick demo: use <strong>demo-ristorante</strong> and any password.', '👋 Démo rapide : utilisez <strong>demo-ristorante</strong> et n\'importe quel mot de passe.', '👋 Быстрый демо: используйте <strong>demo-ristorante</strong> и любой пароль.'),
            '<br><br>',
            t('🔐 Ogni ristorante vede solo i suoi dati — isolamento completo, nessun altro utente può accedere alla tua area privata.', '🔐 Each restaurant only sees its own data — complete isolation, no other user can access your private area.', '🔐 Chaque restaurant voit uniquement ses propres données — isolation complète, aucun autre utilisateur ne peut accéder à votre espace privé.', '🔐 Каждый ресторан видит только свои данные — полная изоляция, ни один другой пользователь не может получить доступ к вашей личной области.'),
          '</div>',
        '</div>',
      '</div>'
    ].join('');
    bindLoginEvents();
  }

  function bindLoginEvents() {
    var form = document.getElementById('swDashLoginForm');
    if (form) form.addEventListener('submit', doLogin);
    var superBtn = document.getElementById('swLoginSuper');
    if (superBtn) superBtn.addEventListener('click', doLoginSuper);
  }
  function doLogin(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    var slugEl = document.getElementById('swLoginSlug');
    var emailEl = document.getElementById('swLoginEmail');
    var passEl = document.getElementById('swLoginPass');
    var slug = (slugEl ? slugEl.value : 'demo-ristorante').toString().trim().toLowerCase().replace(/[^a-z0-9-]/g,'-') || 'demo-ristorante';
    var email = emailEl ? emailEl.value : '';
    var pass = passEl ? passEl.value : '';
    setSession({ slug: slug, email: email, at: Date.now(), superAdmin: false, plan: 'pro' });
    window.location.hash = '#dashboard';
    state.session = { slug: slug, email: email, at: Date.now(), superAdmin: false, plan: 'pro' };
    state.restaurantSlug = slug;
    state.isSuperAdmin = false;
    initDashboard();
  }
  function doLoginSuper() {
    setSession({ slug: 'superadmin', email: 'admin@sommelierworld.vin', at: Date.now(), superAdmin: true, plan: 'owner' });
    state.session = { slug: 'superadmin', email: 'admin@sommelierworld.vin', at: Date.now(), superAdmin: true, plan: 'owner' };
    state.restaurantSlug = 'demo-ristorante';
    state.isSuperAdmin = true;
    window.location.hash = '#dashboard';
    initDashboard();
  }
  function doLogout() {
    clearSession();
    state.session = null;
    state.isSuperAdmin = false;
    window.location.hash = '';
    renderLogin();
  }

  /* =======================================================
     DATA LOADING
     ======================================================= */
  async function loadRestaurant() {
    try {
      var res = await fetch('/api/swl/restaurants/' + state.restaurantSlug + '/public');
      if (res.ok) {
        var json = await res.json();
        if (json && json.restaurant) state.restaurant = json.restaurant;
      }
    } catch(e){}
  }
  function _mergeOnListFromStorage(newWines) {
    try {
      var saveKey = 'swl_wines_' + (state.restaurantSlug || 'demo');
      var raw = localStorage.getItem(saveKey);
      if (!raw) return newWines;
      var saved = JSON.parse(raw);
      if (!Array.isArray(saved) || saved.length === 0 || !Array.isArray(newWines)) return newWines;
      var NEW_FIELDS_STR = ['frazione','village','cuvee','cuvée','metodo_spumante','dosaggio','coltivazione','lieviti','piede_franco','affinamento','note_terroir','purchase_url','tipo','country','region','wine_name','producer','appellation','vintage','status','bottiglia_nome','etichetta_nome','bottle_name','sparkling_method','farming','yeast','sur_lie_mesi'];
      var NEW_FIELDS_NUM = ['mesi_sur_lie','price_sale','quantity_bottles','minimum_threshold'];
      var NEW_FIELDS_ARR = ['grapes','vitigni','certificazioni','certifications'];
      newWines.forEach(function(w) {
        var match = saved.find(function(s) {
          return (s._id && w._id && s._id === w._id) ||
                 ((s.wine_name || '') === (w.wine_name || '') && String(s.vintage || '') === String(w.vintage || ''));
        });
        if (!match) return;
        if (typeof match.onList === 'boolean') w.onList = match.onList;
        NEW_FIELDS_STR.forEach(function(k){ if (typeof match[k] === 'string' && match[k].length) w[k] = match[k]; });
        NEW_FIELDS_NUM.forEach(function(k){ if (typeof match[k] === 'number' && !isNaN(match[k])) w[k] = match[k]; else if (typeof match[k] === 'string' && match[k] !== '' && !isNaN(+match[k])) w[k] = +match[k]; });
        NEW_FIELDS_ARR.forEach(function(k){ if (Array.isArray(match[k])) w[k] = match[k].slice(); });
      });
      return newWines;
    } catch(e) { return newWines; }
  }
  async function loadPublicWines() {
    try {
      var res = await fetch('/api/swl/restaurants/' + state.restaurantSlug + '/wines?limit=200');
      if (res.ok) {
        var json = await res.json();
        state.wines = Array.isArray(json.wines) ? json.wines : (Array.isArray(json) ? json : []);
        if (state.wines.length === 0) state.wines = sampleWines();
      } else {
        state.wines = sampleWines();
      }
      state.wines = _mergeOnListFromStorage(state.wines);
      computeTotals();
    } catch(e){
      state.wines = sampleWines();
      state.wines = _mergeOnListFromStorage(state.wines);
      computeTotals();
    }
  }
  function sampleWines() {
    var out = [
      { _id:'bellevue-001', wine_type:'sparkling', tipo:'bollicine', wine_name:"La Grande Année", cuvée:"La Grande Année", producer:'Bollinger', appellation:'Champagne AOC', regione:'Champagne', region:'Champagne', country:'Francia', nazione:'Francia', village:'Ay', frazione:'Ay, Marne', vintage:'2015', grapes:['Pinot Noir','Chardonnay','Pinot Meunier'], vitigni:['Pinot Noir','Chardonnay','Pinot Meunier'], metodo_spumante:'Metodo Classico', sur_lie_mesi:96, mesi_sur_lie:96, dosaggio:"Brut", lieviti:"Selezionati", coltivazione:"Convenzionale", piede_franco:false, prezzo_listino:299, price_sale:299, quantity_bottles:4, minimum_threshold:2, certificazioni:[], onList:true, affinamento:"Affinamento sui lieviti 96 mesi in botte", note_terroir:"Pinot Noir, Chardonnay, Pinot Meunier sur lie 96 mesi", purchase_url:'https://www.callmewine.com/it/bollinger/la-grande-annee-2015-champagne-aoc.html', status:'available' },
      { _id:'bellevue-champ-002', wine_type:'sparkling', tipo:'bollicine', wine_name:'Harmonie Blanc de Noir', cuvée:'Harmonie Blanc de Noir', producer:'Frank Pascal', appellation:'Champagne AOC', regione:'Champagne', region:'Champagne', country:'Francia', nazione:'Francia', village:'Baslieux-sous-Châtillon', frazione:'Baslieux-sous-Châtillon, Marne', vintage:'2018', grapes:['Pinot Noir','Pinot Meunier'], vitigni:['Pinot Noir','Pinot Meunier'], metodo_spumante:'Metodo Classico', sur_lie_mesi:48, mesi_sur_lie:48, dosaggio:"Extra Brut", lieviti:"Indigeni", coltivazione:"Biodinamica", piede_franco:false, price_sale:78, quantity_bottles:12, minimum_threshold:4, certificazioni:['Demeter'], onList:true, note_terroir:"Pinot Noir, Pinot Meunier sur lie 48 mesi", status:'available' },
      { _id:'bellevue-champ-003', wine_type:'sparkling', tipo:'bollicine', wine_name:'Tolerance Rosé', cuvée:'Tolerance Rosé', producer:'Frank Pascal', appellation:'Champagne AOC Rosé', regione:'Champagne', region:'Champagne', country:'Francia', nazione:'Francia', village:'Baslieux-sous-Châtillon', frazione:'Baslieux-sous-Châtillon, Marne', vintage:'s.a.', grapes:['Pinot Meunier','Pinot Noir','Chardonnay'], vitigni:['Pinot Meunier','Pinot Noir','Chardonnay'], metodo_spumante:'Metodo Classico', sur_lie_mesi:48, mesi_sur_lie:48, dosaggio:"Brut", lieviti:"Indigeni", coltivazione:"Biodinamica", piede_franco:false, price_sale:82, quantity_bottles:8, minimum_threshold:3, certificazioni:['Demeter'], onList:true, status:'available' },
      { _id:'bellevue-champ-004', wine_type:'sparkling', tipo:'bollicine', wine_name:'Tradition Premier Cru', cuvée:'Tradition Premier Cru', producer:'Gaston Chiquet', appellation:'Champagne AOC Premier Cru', regione:'Champagne', region:'Champagne', country:'Francia', nazione:'Francia', village:'Mareuil sur Aÿ', frazione:'Mareuil sur Aÿ, Marne', vintage:'2019', grapes:['Pinot Meunier','Pinot Noir','Chardonnay'], vitigni:['Pinot Meunier','Pinot Noir','Chardonnay'], metodo_spumante:'Metodo Classico', sur_lie_mesi:30, mesi_sur_lie:30, dosaggio:"Brut", lieviti:"Selezionati", coltivazione:"Convenzionale", piede_franco:false, price_sale:59, quantity_bottles:24, minimum_threshold:6, certificazioni:[], onList:true, status:'available' },
      { _id:'bellevue-champ-005', wine_type:'sparkling', tipo:'bollicine', wine_name:'Tradition Premier Cru Rosé', cuvée:'Tradition Premier Cru Rosé', producer:'Gaston Chiquet', appellation:'Champagne AOC Premier Cru Rosé', regione:'Champagne', region:'Champagne', country:'Francia', nazione:'Francia', village:'Mareuil sur Aÿ', frazione:'Mareuil sur Aÿ, Marne', vintage:'s.a.', grapes:['Pinot Meunier','Pinot Noir','Chardonnay'], vitigni:['Pinot Meunier','Pinot Noir','Chardonnay'], metodo_spumante:'Metodo Classico', sur_lie_mesi:30, mesi_sur_lie:30, dosaggio:"Brut", lieviti:"Selezionati", coltivazione:"Convenzionale", piede_franco:false, price_sale:65, quantity_bottles:15, minimum_threshold:5, certificazioni:[], onList:true, status:'available' },
      { _id:'bellevue-champ-006', wine_type:'sparkling', tipo:'bollicine', wine_name:'Initial Blanc de Blanc Grand Cru', cuvée:'Initial Grand Cru', producer:'Jacques Selosse', appellation:'Champagne AOC Grand Cru Blanc de Blancs', regione:'Champagne', region:'Champagne', country:'Francia', nazione:'Francia', village:'Avize', frazione:'Avize, Cote des Blancs, Marne', vintage:'2019', grapes:['Chardonnay'], vitigni:['Chardonnay'], metodo_spumante:'Metodo Classico', sur_lie_mesi:36, mesi_sur_lie:36, dosaggio:"Brut", lieviti:"Indigeni", coltivazione:"Convenzionale", piede_franco:true, price_sale:245, quantity_bottles:3, minimum_threshold:1, certificazioni:[], onList:true, note_terroir:"Chardonnay sur lie 36 mesi — Avize Grand Cru", purchase_url:'https://www.tannico.it/en/vini-spumanti/champagne-brut-grand-cru-initial-jacques-selosse.html?pv=sw_aff_001', status:'available' },
      { _id:'bellevue-002', wine_type:'sparkling', tipo:'bollicine', wine_name:"Cuvée des Mines de Cogne", cuvée:"Cuvée des Mines de Cogne", producer:'Cave Mont Blanc', appellation:'Valle d\'Aosta DOC Spumante Metodo Classico', regione:"Valle d'Aosta", region:"Valle d'Aosta", country:'Italia', nazione:'Italia', village:'Morgex', frazione:'Morgex, Aosta, Valle d\'Aosta', vintage:'2021', grapes:['Petit Blanc','Chardonnay'], vitigni:['Petit Blanc','Chardonnay'], metodo_spumante:'Metodo Classico', sur_lie_mesi:24, mesi_sur_lie:24, dosaggio:"Extra Brut", lieviti:"Selezionati", coltivazione:"Convenzionale", piede_franco:false, prezzo_listino:76, price_sale:76, quantity_bottles:8, minimum_threshold:3, certificazioni:[], onList:true, note_terroir:"Affinato all'interno delle Miniere di Cogne a 2.500 m s.l.m. per 24 mesi", purchase_url:'', status:'available' },
      { _id:'bellevue-003', wine_type:'sparkling', tipo:'bollicine', wine_name:"Extra Brut \"Etral\"", cuvée:"Metodo Classico Extra Brut Etral", producer:'Chemin des Vignobles', appellation:'Valle d\'Aosta DOC Metodo Classico', regione:"Valle d'Aosta", region:"Valle d'Aosta", country:'Italia', nazione:'Italia', village:'Villeneuve', frazione:'Villeneuve, Aosta, Valle d\'Aosta', vintage:'s.a.', grapes:['Petit Blanc','Chardonnay'], vitigni:['Petit Blanc','Chardonnay'], metodo_spumante:'Metodo Classico', sur_lie_mesi:36, mesi_sur_lie:36, dosaggio:"Extra Brut", lieviti:"Selezionati", coltivazione:"Convenzionale", piede_franco:false, price_sale:65, quantity_bottles:7, minimum_threshold:3, certificazioni:[], onList:true, note_terroir:"Petit Blanc, Chardonnay sur lie 36 mesi", status:'available' },
      { _id:'bellevue-004', wine_type:'sparkling', tipo:'bollicine', wine_name:"Extra Brut \"Lartserva\" di Etral", cuvée:"Extra Brut Lartserva", producer:'Chemin des Vignobles', appellation:'Valle d\'Aosta DOC Metodo Classico', regione:"Valle d'Aosta", region:"Valle d'Aosta", country:'Italia', nazione:'Italia', village:'Villeneuve', frazione:'Villeneuve, Valle d\'Aosta', vintage:'s.a.', grapes:['Petit Blanc','Chardonnay'], vitigni:['Petit Blanc','Chardonnay'], metodo_spumante:'Metodo Classico', sur_lie_mesi:60, mesi_sur_lie:60, dosaggio:"Extra Brut", lieviti:"Selezionati", coltivazione:"Convenzionale", piede_franco:false, price_sale:90, quantity_bottles:3, minimum_threshold:1, certificazioni:[], onList:true, note_terroir:"Petit Blanc, Chardonnay sur lie 60 mesi", status:'available' },
      { _id:'bellevue-005', wine_type:'sparkling', tipo:'bollicine', wine_name:"Extra Brut \"Lartserva\" di Nevecrino", cuvée:"Lartserva di Nevecrino", producer:'Nevecrino', appellation:'Valle d\'Aosta DOC Metodo Classico', regione:"Valle d'Aosta", region:"Valle d'Aosta", country:'Italia', nazione:'Italia', village:'—', frazione:'—', vintage:'s.a.', grapes:['Chardonnay','Pinot Nero'], vitigni:['Chardonnay','Pinot Nero'], metodo_spumante:'Metodo Classico', sur_lie_mesi:36, mesi_sur_lie:36, dosaggio:"Extra Brut", lieviti:"Selezionati", coltivazione:"Convenzionale", piede_franco:false, price_sale:77, quantity_bottles:5, minimum_threshold:2, certificazioni:[], onList:true, note_terroir:"Chardonnay, Pinot Nero sur lie 36 mesi", status:'available' },
      { _id:'bellevue-006', wine_type:'sparkling', tipo:'bollicine', wine_name:"Rosé Extra Brut Nature \"Neblü\"", cuvée:"Metodo Classico Rosé Brut Nature Neblü", producer:'Les Crêtes', appellation:'Valle d\'Aosta DOC Metodo Classico', regione:"Valle d'Aosta", region:"Valle d'Aosta", country:'Italia', nazione:'Italia', village:'Aymavilles', frazione:'Aymavilles, Valle d\'Aosta', vintage:'s.a.', grapes:['Petit Rouge','Pinot Nero','Gamay'], vitigni:['Petit Rouge','Pinot Nero','Gamay'], metodo_spumante:'Metodo Classico', sur_lie_mesi:30, mesi_sur_lie:30, dosaggio:"Brut Nature", lieviti:"Selezionati", coltivazione:"Biologica", piede_franco:false, price_sale:67, quantity_bottles:6, minimum_threshold:3, certificazioni:['Biologico'], onList:true, note_terroir:"Prolungata sui lie 30 mesi", status:'available' },
      { _id:'bellevue-007', wine_type:'sparkling', tipo:'bollicine', wine_name:"Rosé Extra Brut \"Montmary\"", cuvée:"Montmary - Rosé Extra Brut", producer:'Grosjean Vins', appellation:'Valle d\'Aosta DOC Metodo Classico', regione:"Valle d'Aosta", region:"Valle d'Aosta", country:'Italia', nazione:'Italia', village:'Quart', frazione:'Quart, Aosta, Valle d\'Aosta', vintage:'s.a.', grapes:['Pinot Nero','Chardonnay','Gamay'], vitigni:['Pinot Nero','Chardonnay','Gamay'], metodo_spumante:'Metodo Classico', sur_lie_mesi:15, mesi_sur_lie:15, dosaggio:"Extra Brut", lieviti:"Selezionati", coltivazione:"Biologica", piede_franco:false, price_sale:69, quantity_bottles:5, minimum_threshold:3, certificazioni:['Biologico'], onList:true, status:'available' },
      { _id:'bellevue-008', wine_type:'sparkling', tipo:'bollicine', wine_name:"Brut \"Teatro La Scala\"", producer:'Bellavista', appellation:"Franciacorta DOCG Brut", regione:'Lombardia', region:'Lombardia', country:'Italia', nazione:'Italia', village:'Erbusco', frazione:'Erbusco, Brescia, Lombardia', vintage:'2020', grapes:['Chardonnay','Pinot Nero'], vitigni:['Chardonnay','Pinot Nero'], metodo_spumante:'Metodo Classico Franciacorta', sur_lie_mesi:60, mesi_sur_lie:60, dosaggio:"Brut", lieviti:"Selezionati", coltivazione:"Convenzionale", piede_franco:false, price_sale:89, quantity_bottles:10, minimum_threshold:4, certificazioni:[], onList:true, status:'available' },
      { _id:'bellevue-009', wine_type:'sparkling', tipo:'bollicine', wine_name:"Vittorio Moretti Extra Brut Riserva", cuvée:"Vittorio Moretti", producer:'Bellavista', appellation:"Franciacorta DOCG Extra Brut Riserva", regione:'Lombardia', region:'Lombardia', country:'Italia', nazione:'Italia', village:'Erbusco', frazione:'Erbusco, Brescia', vintage:'2016', grapes:['Chardonnay','Pinot Nero'], vitigni:['Chardonnay','Pinot Nero'], metodo_spumante:'Metodo Classico', sur_lie_mesi:72, mesi_sur_lie:72, dosaggio:"Extra Brut", lieviti:"Selezionati", coltivazione:"Convenzionale", piede_franco:false, price_sale:165, quantity_bottles:3, minimum_threshold:1, certificazioni:[], onList:true, status:'available' },
      { _id:'bellevue-010', wine_type:'sparkling', tipo:'bollicine', wine_name:"Blanc de Blanc Pas Dosé Riserva", cuvée:"Alta Langa Blanc de Blanc Pas Dosé Riserva", producer:'Germano Ettore', appellation:"Alta Langa DOCG", regione:'Piemonte', region:'Piemonte', country:'Italia', nazione:'Italia', village:'Serralunga d\'Alba', frazione:'Serralunga d\'Alba, Cuneo, Piemonte', vintage:'2017', grapes:['Chardonnay'], vitigni:['Chardonnay'], metodo_spumante:'Metodo Classico Alta Langa', sur_lie_mesi:65, mesi_sur_lie:65, dosaggio:"Pas Dosé", lieviti:"Indigeni", coltivazione:"Biologica", piede_franco:false, price_sale:105, quantity_bottles:4, minimum_threshold:2, certificazioni:['Biologico'], onList:true, status:'available' }
    ];
    return out;
  }
  async function loadMovements() {
    try {
      var res = await fetch('/api/admin/swl/restaurants/' + state.restaurantSlug + '/movements', { credentials: 'same-origin' });
      if (res.ok) {
        var json = await res.json();
        state.movements = Array.isArray(json) ? json : (json && Array.isArray(json.movements) ? json.movements : generateSampleMovements());
      } else {
        state.movements = generateSampleMovements();
      }
    } catch(e) {
      state.movements = generateSampleMovements();
    }
  }
  function generateSampleMovements() {
    var out = [];
    var wines = state.wines && state.wines.length ? state.wines : [{wine_name:'Barolo DOCG 2018', producer:'Produttore Esempio'},{wine_name:'Chardonnay', producer:'Cantina Demo'}];
    var types = [
      { k: 'sale',       label: { it: 'Vendita', en: 'Sale', fr: 'Vente', ru: 'Продажа' } },
      { k: 'adjustment', label: { it: 'Correzione', en: 'Adjustment', fr: 'Ajustement', ru: 'Коррекция' } },
      { k: 'purchase',   label: { it: 'Acquisto', en: 'Purchase', fr: 'Achat', ru: 'Закупка' } },
      { k: 'transfer', label: { it: 'Spostamento', en: 'Transfer', fr: 'Transfert', ru: 'Перемещение' } }
    ];
    var now = Date.now();
    for (var i = 0; i < 28; i++) {
      var w = wines[i % wines.length];
      var tp = types[i % types.length];
      var qty;
      if (tp.k === 'purchase') qty = 6 + Math.round(Math.random()*12);
      else if (tp.k === 'sale') qty = -(1 + Math.round(Math.random()*5));
      else if (tp.k === 'adjustment') qty = (Math.random() < 0.5 ? 1 : -1) * Math.max(1, Math.round(Math.random()*3));
      else qty = Math.round(Math.random()*8)-4;
      out.push({
        at: new Date(now - i * (3600000 * Math.round(Math.random()*6 + 1))),
        movement_type: tp.k,
        movement_label: tp.label,
        wine: w.wine_name || ('Etichetta ' + (i+1)),
        producer: w.producer || 'Produttore',
        quantity_delta: qty,
        reason: tp.k === 'sale' ? ('Vendita tavolo ' + (1 + (i % 12))) : (tp.k === 'purchase' ? 'Ordine fornitore' : 'Controllo giacenza'),
        source: ['POS', 'Controllo', 'Ecommerce', 'Ordinazione App'][i % 4],
        reference_code: 'REF-' + (1000 + i)
      });
    }
    return out;
  }
  function generateSampleOrders() {
    var now = Date.now();
    var base = state.wines && state.wines.length ? state.wines : [{wine_name:'Barolo', price_sale:48, format_ml:750, producer:'Pio Cesare'},{wine_name:'Champagne Brut', price_sale:65, format_ml:750, producer:'Demo'},{wine_name:'Pinot Noir', price_sale:32, format_ml:750}];
    var orders = [];
    for (var o = 0; o < 15; o++) {
      var items = [];
      var nItems = 1 + (o % 3);
      var orderTotal = 0;
      for (var j=0;j<nItems;j++){
        var w = base[(o + j) % base.length];
        var qty = 1 + (j % 2);
        var price = typeof w.price_sale === 'number' ? w.price_sale : (20 + ((o*j) % 80));
        orderTotal += qty * price;
        items.push({ wine: w.wine_name || ('Vino ' + (o+j)), qty: qty, price: price });
      }
      orders.push({
        id: 'ORD-' + (2025000 + o),
        createdAt: new Date(now - (o * (3600000 * 3.5))),
        table: 'Tavolo ' + (1 + (o % 16)),
        server: ['Marco', 'Giulia', 'Luca', 'Sara'][o % 4],
        items: items,
        total: orderTotal,
        status: o % 7 === 0 ? 'pending' : 'paid',
        channel: ['Sala', 'E-commerce', 'Evento', 'TakeAway'][o % 4],
        customer: o % 5 === 0 ? ('Cliente ' + (10 + o)) : ''
      });
    }
    state.orders = orders;
    state.totals.soldValue = orders.reduce(function(s, ord){ return s + (ord.total || 0); }, 0);
    state.totals.soldCount = orders.reduce(function(s, ord){ return s + ord.items.reduce(function(ss, it){ return ss + it.qty; }, 0); }, 0);
  }
  function computeTotals() {
    var w = state.wines;
    var invCount = 0, invValue = 0, low = 0, out = 0;
    w.forEach(function(x){
      var q = typeof x.quantity_bottles === 'number' ? x.quantity_bottles : 0;
      invCount += q;
      invValue += q * (x.price_sale || 0);
      var minTh = typeof x.minimum_threshold === 'number' ? x.minimum_threshold : 3;
      var st = x.status || (q === 0 ? 'out_of_stock' : (q <= minTh ? 'low_stock' : 'available'));
      if (st === 'out_of_stock') out++;
      else if (st === 'low_stock') low++;
    });
    state.totals.inventoryCount = invCount;
    state.totals.inventoryValue = invValue;
    state.totals.lowStock = low;
    state.totals.outOfStock = out;
  }

  /* =======================================================
     RENDER DASHBOARD
     ======================================================= */
  function renderDashboard() {
    try {
      document.body.classList.add('sw-in-dashboard');
    } catch(e){}
    var root = document.getElementById('page-dashboard');
    if (!root) return;
    root.innerHTML = buildDashboardLayout();
    bindDashboardEvents();
  }
  function buildDashboardLayout() {
    return [
      '<div class="sw-dashboard-root">',
        buildSidebar(),
        '<div class="sw-dashboard-content-wrap">',
          buildTopbar(),
          '<div class="sw-dashboard-content">',
            buildContentForSection(state.activeSection),
          '</div>',
        '</div>',
      '</div>'
    ].join('');
  }
  function buildSidebar() {
    var cls = 'sw-dash-sidebar' + (state.collapsed ? ' sw-dash-collapsed' : '');
    var visibleSections = sections.filter(function(s){
      if (s.admin) return state.isSuperAdmin;
      return true;
    });
    var items = visibleSections.map(function(s){
      var active = state.activeSection === s.id ? ' active' : '';
      var label = t(s.it, s.en, s.fr, s.ru);
      return [
        '<div class="sw-dash-nav-item' + active + '" data-section="' + s.id + '" title="' + label + '">',
          '<span class="sw-dash-nav-icon">' + s.icon + '</span>',
          !state.collapsed ? '<span class="sw-dash-nav-label">' + label + '</span>' : '',
        '</div>'
      ].join('');
    }).join('');

    var restName = state.restaurant && state.restaurant.name ? state.restaurant.name : (state.isSuperAdmin ? t('SommelierWorld Super Admin', 'SommelierWorld Super Admin', 'Super Admin SommelierWorld', 'Супер Админ SommelierWorld') : getRestaurantMeta(state.restaurantSlug).name);
    var restPlan = state.restaurant && state.restaurant.plan ? state.restaurant.plan : (state.session && state.session.plan ? state.session.plan : (state.isSuperAdmin ? 'OWNER' : 'pro'));

    return [
      '<aside class="' + cls + '">',
        '<div class="sw-dash-sidebar-head">',
          '<div class="sw-dash-brand">',
            '<span class="sw-dash-brand-icon">🍇</span>',
            !state.collapsed ? '<span class="sw-dash-brand-text">SommelierWorld</span>' : '',
          '</div>',
          '<button class="sw-dash-toggle" id="swDashToggle" title="' + t('Comprimi menu', 'Collapse menu', 'Réduire le menu', 'Свернуть меню') + '">',
            state.collapsed ? '»' : '«',
          '</button>',
        '</div>',
        '<div class="sw-dash-restaurant">',
          '<div class="sw-dash-restaurant-avatar">' + (restName ? restName.substring(0,1).toUpperCase() : 'R') + '</div>',
          !state.collapsed ? [
            '<div class="sw-dash-restaurant-meta">',
              '<div class="sw-dash-restaurant-name">' + restName + '</div>',
              '<div class="sw-dash-restaurant-plan">' + restPlan.toUpperCase() + '</div>',
            '</div>'
          ].join('') : '',
        '</div>',
        '<nav class="sw-dash-nav">',
          items,
        '</nav>',
        !state.collapsed ? [
          '<div class="sw-dash-sidebar-foot">',
            state.isSuperAdmin ? '<button class="sw-dash-qr-btn" id="swDashJumpList" style="cursor:pointer;display:block;width:100%;">🔁 ' + t('Cambia ristorante', 'Switch restaurant', 'Changer de restaurant', 'Сменить ресторан') + '</button>' :
            '<a href="/r/' + state.restaurantSlug + '" class="sw-dash-qr-btn" target="_blank" rel="noopener">🔗 ' + t('Apri carta pubblica', 'Open public list', 'Ouvrir la carte', 'Открыть меню') + '</a>',
            '<a href="/tavolo.html?slug=' + (state.restaurantSlug||'') + '" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:8px;padding:10px 14px;margin-top:6px;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;color:#16A34A;font-size:.78rem;font-weight:600;text-decoration:none;transition:all .2s;" onmouseover="this.style.background=\'#DCFCE7\'" onmouseout="this.style.background=\'#F0FDF4\'">' + '<span>🍽️</span>' + t('Apri Tablet Cameriere','Open Waiter Tablet','Ouvrir Tablette Serveur','Открыть Планшет Официанта') + '</a>',
            '<button class="sw-dash-logout-btn" id="swDashLogout" type="button">↩ ' + t('Esci dall\'area personale', 'Sign out', 'Se déconnecter', 'Выйти') + '</button>',
          '</div>'
        ].join('') : '',
      '</aside>'
    ].join('');
  }
  function getRestaurantMeta(slug) {
    var r = state.restaurants.find(function(x){ return x.slug === slug; });
    return r || { slug: slug, name: slug.replace(/-/g,' ').replace(/(^|\s)\w/g, function(c){return c.toUpperCase();}), plan: 'pro', wines: 0, currency: 'EUR' };
  }
  function buildTopbar() {
    var title = getSectionLabel(state.activeSection);
    var icon = getSectionIcon(state.activeSection);
    var subtitle = '';
    if (state.activeSection === 'overview')   subtitle = t('Panoramica della tua attività', 'Overview of your activity', 'Aperçu de votre activité', 'Обзор вашей активности');
    if (state.activeSection === 'carta_ai')   subtitle = t('Struttura e consigli AI per la tua carta dei vini','AI structure and advice for your wine list','Structure et conseils AI pour votre carte','Структура и советы AI для вашей карты вин');
    if (state.activeSection === 'winecard')   subtitle = t('Carta dei vini pronta per i tavoli o da stampare', 'Wine list ready for tables or to print', 'Carte des vins prête pour les tables ou à imprimer', 'Винная карта готова для столов или для печати');
    if (state.activeSection === 'inventory')  subtitle = t('Gestisci la tua carta vini e le giacenze', 'Manage your wine list and stock', 'Gérez votre carte des vins et stocks', 'Управляйте винной картой и остатками');
    if (state.activeSection === 'orders')     subtitle = t('Tutti gli ordini e le vendite registrate', 'All orders and recorded sales', 'Toutes les commandes et ventes', 'Все заказы и продажи');
    if (state.activeSection === 'accounting') subtitle = t('Riepilogo ricavi, costi e margini', 'Revenue, costs and margins summary', 'Résumé revenus, coûts et marges', 'Доходы, расходы и маржа');
    if (state.activeSection === 'movements')  subtitle = t('Registro di tutti i movimenti di inventario', 'Log of all inventory movements', 'Journal de tous les mouvements', 'Журнал всех движений');
    if (state.activeSection === 'tavoli')     subtitle = t('Conti vino aperti al tavolo — chiudi il conto per scaricare le bottiglie', 'Open wine bills by table — close a bill to deduct bottles', 'Additions de vin par table — clôturez pour déduire les bouteilles', 'Открытые винные счета по столам — закройте счёт для списания бутылок');
    if (state.activeSection === 'admin')      subtitle = t('Crea, gestisci e impersona ogni area personale ristorante', 'Create, manage and impersonate restaurant dashboards', 'Créez, gérez et incarnez chaque espace restaurant', 'Создавайте, управляйте и входите в личные кабинеты ресторанов');

    var btns = '';
    if (state.activeSection === 'winecard') {
      btns = [
        '<button class="sw-dash-btn sw-dash-btn-ghost" id="swDashCardPreview" type="button">👁️ ' + t('Mostra anteprima', 'Show preview', 'Voir l\'aperçu', 'Предпросмотр') + '</button>',
        '<button class="sw-dash-btn sw-dash-btn-primary" id="swDashCardPrint" type="button">🖨️ ' + t('Stampa Carta Vini', 'Print Wine List', 'Imprimer Carte des Vins', 'Печать Винной Карты') + '</button>'
      ].join('');
    } else if (state.activeSection === 'admin') {
      btns = [
        '<button class="sw-dash-btn sw-dash-btn-ghost" id="swDashNewRest" type="button">➕ ' + t('Nuovo Ristorante', 'New Restaurant', 'Nouveau Restaurant', 'Новый Ресторан') + '</button>'
      ].join('');
    } else if (state.isSuperAdmin) {
      btns = [
        '<button class="sw-dash-btn sw-dash-btn-ghost" id="swDashGoAdmin" type="button">🛡️ ' + t('Gestione Ristoranti', 'Manage Restaurants', 'Gestion Restaurants', 'Управление Ресторанами') + '</button>',
        '<button class="sw-dash-btn sw-dash-btn-primary" id="swDashAddWine" type="button">＋ ' + t('Aggiungi vino', 'Add wine', 'Ajouter un vin', 'Добавить вино') + '</button>'
      ].join('');
    } else {
      btns = [
        '<button class="sw-dash-btn sw-dash-btn-ghost" id="swDashNewOrder" type="button">🧾 ' + t('Nuovo ordine', 'New order', 'Nouvelle commande', 'Новый заказ') + '</button>',
        '<button class="sw-dash-btn sw-dash-btn-primary" id="swDashAddWine" type="button">＋ ' + t('Aggiungi vino', 'Add wine', 'Ajouter un vin', 'Добавить вино') + '</button>'
      ].join('');
    }

    return [
      '<header class="sw-dash-topbar">',
        '<div class="sw-dash-topbar-title">',
          '<span class="sw-dash-topbar-icon">' + icon + '</span>',
          '<div>',
            '<h2 class="sw-dash-section-title">' + title + '</h2>',
            '<p class="sw-dash-section-subtitle">' + subtitle + '</p>',
          '</div>',
        '</div>',
        '<div class="sw-dash-topbar-actions">' + btns + '</div>',
      '</header>'
    ].join('');
  }
  function buildContentForSection(id) {
    switch(id) {
      case 'overview':   return buildOverview();
      case 'carta_ai':   return buildCartaAIPage();
      case 'winecard':   return buildWineCardPrint();
      case 'inventory':  return buildInventory();
      case 'orders':     return buildOrders();
      case 'suppliers':  return buildSuppliersPanel();
      case 'accounting': return buildAccounting();
      case 'movements':  return buildMovements();
      case 'tavoli':     return buildTavoli();
      case 'admin':      return buildSuperAdmin();
      default: return '';
    }
  }

  /* ===================== TAVOLI APERTI — CONTO TAVOLO ===================== */
  function swContiAperti() {
    var slug = state.restaurantSlug || '';
    var conti = [];
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key && key.indexOf('swl_conto_' + slug + '_') === 0) {
        try {
          var c = JSON.parse(localStorage.getItem(key) || '{}');
          if (c.aperto && c.voci && c.voci.length) conti.push(c);
        } catch(e) {}
      }
    }
    conti.sort(function(a,b){ return a.tavolo - b.tavolo; });
    return conti;
  }

  function buildTavoli() {
    var contiAperti = swContiAperti();

    if (!contiAperti.length) {
      return '<div class="sw-dash-panel"><p style="color:#71717a;text-align:center;padding:20px;">' + t('Nessun tavolo aperto con ordini vino.','No open table with wine orders yet.','Aucune table ouverte avec commandes de vin.','Нет открытых столов с заказами вина.') + '</p></div>';
    }

    var html = '<div class="sw-dash-panel"><div class="sw-dash-panel-head"><h3>🍽️ ' + t('Tavoli Aperti','Open Tables','Tables Ouvertes','Открытые столы') + '</h3></div>';
    contiAperti.forEach(function(c) {
      var totale = c.voci.reduce(function(s,v){ return s + (v.prezzo * v.qty); }, 0);
      html += '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(212,175,55,.15);border-radius:10px;padding:14px;margin-bottom:10px;">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">';
      html += '<strong style="font-size:1rem;">' + t('Tavolo','Table','Table','Стол') + ' ' + c.tavolo + '</strong>';
      html += '<span style="color:#d4af37;">' + t('Totale vini:','Wine total:','Total vins :','Итого вина:') + ' €' + totale.toFixed(2) + '</span>';
      html += '</div>';
      c.voci.forEach(function(v) {
        html += '<div style="display:flex;justify-content:space-between;font-size:.82rem;padding:4px 0;border-bottom:1px solid rgba(255,255,255,.05);">';
        html += '<span>' + v.wine_name + ' · ' + v.producer + '</span>';
        html += '<span>x' + v.qty + ' · €' + (v.prezzo * v.qty).toFixed(2) + '</span>';
        html += '</div>';
      });
      html += '<div style="display:flex;gap:8px;margin-top:12px;">';
      html += '<button onclick="swAggiungiBottigliaTavolo(\'' + c.tavolo + '\')" style="flex:1;padding:7px 0;background:rgba(212,175,55,.1);border:1px solid rgba(212,175,55,.3);color:#d4af37;border-radius:8px;font-size:.75rem;cursor:pointer;">+ ' + t('Bottiglia','Bottle','Bouteille','Бутылка') + '</button>';
      html += '<button onclick="swChiudiConto(\'' + c.tavolo + '\')" style="flex:1;padding:7px 0;background:rgba(128,0,32,.4);border:1px solid rgba(180,0,40,.4);color:#F5EFE2;border-radius:8px;font-size:.75rem;cursor:pointer;">🧾 ' + t('Chiudi conto','Close bill','Clôturer','Закрыть счёт') + '</button>';
      html += '</div></div>';
    });
    html += '</div>';
    return html;
  }

  window.swAggiungiBottigliaTavolo = function(tavolo) {
    var contiAperti = swContiAperti();
    var conto = null;
    for (var i = 0; i < contiAperti.length; i++) { if (String(contiAperti[i].tavolo) === String(tavolo)) { conto = contiAperti[i]; break; } }
    if (!conto) return;
    var wines = (state.wines || []).filter(function(w){ return (w.quantity_bottles||0) > 0; });
    if (!wines.length) { alert(t('Nessun vino disponibile in inventario.','No wine available in inventory.','Aucun vin disponible en inventaire.','Нет доступного вина в инвентаре.')); return; }
    var lista = wines.map(function(w, i){ return (i+1) + ') ' + (w.wine_name||'') + ' ' + (w.vintage||'') + ' — €' + (w.price_sale||0); }).join('\n');
    var scelta = prompt(t('Scegli il numero del vino da aggiungere:', 'Choose the wine number to add:', 'Choisissez le numéro du vin à ajouter :', 'Выберите номер вина для добавления:') + '\n\n' + lista);
    var idx = parseInt(scelta, 10) - 1;
    if (isNaN(idx) || idx < 0 || idx >= wines.length) return;
    var w = wines[idx];
    conto.voci.push({ wine_id: w._id, wine_name: w.wine_name||'', producer: w.producer||'', prezzo: w.price_sale||0, qty: 1, timestamp: Date.now() });
    var slug = state.restaurantSlug || '';
    try { localStorage.setItem('swl_conto_' + slug + '_' + conto.tavolo, JSON.stringify(conto)); } catch(e){}
    renderDashboard();
  };

  window.swChiudiConto = function(tavolo) {
    var slug = state.restaurantSlug || '';
    var contoKey = 'swl_conto_' + slug + '_' + tavolo;
    var conto = {};
    try { conto = JSON.parse(localStorage.getItem(contoKey)||'{}'); } catch(e) {}
    if (!conto.voci || !conto.voci.length) return;

    if (!confirm(t('Chiudi il conto del Tavolo ', 'Close the bill for Table ', 'Clôturer l\'addition de la Table ', 'Закрыть счёт для стола ') + tavolo + t('? I vini verranno scaricati dall\'inventario.', '? Wines will be deducted from inventory.', ' ? Les vins seront déduits de l\'inventaire.', '? Вина будут списаны из инвентаря.'))) return;

    // Decrementa inventario per ogni bottiglia
    var wines = state.wines || [];
    conto.voci.forEach(function(voce) {
      var wine = wines.find(function(w){ return w._id === voce.wine_id; });
      if (wine) wine.quantity_bottles = Math.max(0, (wine.quantity_bottles||0) - voce.qty);
    });
    state.wines = wines;

    // Aggiungi a movimenti
    var totale = conto.voci.reduce(function(s,v){ return s+(v.prezzo*v.qty); }, 0);
    var movimento = {
      id: 'TAV-' + tavolo + '-' + Date.now(),
      at: new Date().toISOString(),
      movement_type: 'SALE',
      movement_label: { it:'Vendita', en:'Sale', fr:'Vente', ru:'Продажа' },
      table: t('Tavolo','Table','Table','Стол') + ' ' + tavolo,
      items: conto.voci.map(function(v){ return v.wine_name + ' x' + v.qty; }).join(', '),
      total: totale,
      reason: 'Chiusura conto tavolo ' + tavolo,
      source: 'table',
      reference_code: 'TAV-' + tavolo
    };
    if (!state.movements) state.movements = [];
    state.movements.unshift(movimento);

    // Salva
    try {
      localStorage.setItem('swl_wines_' + slug, JSON.stringify(wines));
      localStorage.setItem('swl_movements_' + slug, JSON.stringify(state.movements.slice(0,200)));
    } catch(e){}

    // Marca conto come chiuso
    conto.aperto = false;
    conto.timestamp_chiusura = Date.now();
    conto.totale = totale;
    try { localStorage.setItem(contoKey, JSON.stringify(conto)); } catch(e){}

    // Genera ricevuta
    swGeneraRicevutaTavolo(conto);

    // Aggiorna UI dashboard
    computeTotals();
    renderDashboard();
  };

  // Ricevuta semplice per il tavolo (download file testo)
  function swGeneraRicevutaTavolo(conto) {
    var testo = '=== SOMMELIER WORLD ===\n';
    testo += t('Tavolo','Table','Table','Стол') + ': ' + conto.tavolo + '\n';
    testo += t('Data','Date','Date','Дата') + ': ' + new Date().toLocaleString('it-IT') + '\n';
    testo += '─────────────────────\n';
    var totale = 0;
    conto.voci.forEach(function(v) {
      var sub = v.prezzo * v.qty;
      totale += sub;
      testo += v.wine_name + '\n  ' + v.producer + ' x' + v.qty + ' = €' + sub.toFixed(2) + '\n';
    });
    testo += '─────────────────────\n';
    testo += t('TOTALE VINI:','WINE TOTAL:','TOTAL VINS :','ИТОГО ВИНА:') + ' €' + totale.toFixed(2) + '\n';
    testo += '=== ' + t('GRAZIE','THANK YOU','MERCI','СПАСИБО') + ' ===\n';

    var blob = new Blob([testo], { type: 'text/plain;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'conto-tavolo-' + conto.tavolo + '-' + new Date().toISOString().slice(0,10) + '.txt';
    a.click();
  }

  // Genera QR code per installazione PWA sui tablet del personale
  window.swGeneraQRInstall = function() {
    var out = document.getElementById('swQRInstallResult');
    if (!out) return;
    if (typeof QRCode === 'undefined') {
      out.innerHTML = '<p style="color:#f87171;">' + t('Libreria QR non caricata. Ricarica la pagina.', 'QR library not loaded. Reload the page.', 'Bibliothèque QR non chargée. Rechargez la page.', 'Библиотека QR не загружена. Перезагрузите страницу.') + '</p>';
      return;
    }
    var slug = state.restaurantSlug || '';
    var url = 'https://sommelierworld.vin/r/' + slug;
    var div = document.createElement('div');
    out.innerHTML = '';
    out.appendChild(div);
    new QRCode(div, { text: url, width: 160, height: 160 });
    out.insertAdjacentHTML('beforeend', '<p style="font-size:.75rem;color:rgba(245,239,226,.5);margin-top:8px;">' + url + '</p>');
  };

  // Segna un vino ordinato come "arrivato in cantina"
  window.swMarkArrived = function(wineId) {
    var w = (state.wines||[]).find(function(x){ return x._id === wineId; });
    if (!w) return;
    w.purchaseStatus = 'in_cellar';
    w.onList = false;
    saveState();
    alert('✅ ' + (w.wine_name||'') + ' ' + t('segnato come arrivato in cantina.','marked as arrived in cellar.','marqué arrivé en cave.','отмечен как прибывший.'));
    if (typeof renderDashboard === 'function') renderDashboard();
  };
  function fmtMoney(n) {
    var c = state.restaurant && state.restaurant.currency ? state.restaurant.currency : ((getRestaurantMeta(state.restaurantSlug) || {}).currency || 'EUR');
    var sym = c === 'EUR' ? '€' : (c === 'USD' ? '$' : (c === 'GBP' ? '£' : '€'));
    return (typeof n === 'number' ? n : 0).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + sym;
  }
  function fmtDate(d) {
    var dt = d instanceof Date ? d : new Date(d);
    return dt.toLocaleDateString('it-IT', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
  }
  function statCard(icon, title, value, sub, tone) {
    return [
      '<div class="sw-dash-stat-card ' + (tone || '') + '">',
        '<div class="sw-dash-stat-head">',
          '<span class="sw-dash-stat-icon">' + icon + '</span>',
          '<span class="sw-dash-stat-title">' + title + '</span>',
        '</div>',
        '<div class="sw-dash-stat-value">' + value + '</div>',
        sub ? '<div class="sw-dash-stat-sub">' + sub + '</div>' : '',
      '</div>'
    ].join('');
  }
  function getStatusBadge(st) {
    if (st === 'out_of_stock') return '<span class="sw-dash-badge sw-dash-badge-red">' + t('Esaurito', 'Out', 'Rupture', 'Нет') + '</span>';
    if (st === 'low_stock') return '<span class="sw-dash-badge sw-dash-badge-orange">' + t('Basso', 'Low', 'Bas', 'Мало') + '</span>';
    return '<span class="sw-dash-badge sw-dash-badge-green">' + t('Disponibile', 'Available', 'Disponible', 'В наличии') + '</span>';
  }
  function getStatusBadgeMini(st) {
    if (st === 'out_of_stock') return '<span class="sw-dash-badge sw-dash-badge-red">' + t('Esaurito', 'Out', 'Rupture', 'Нет') + '</span>';
    if (st === 'low_stock') return '<span class="sw-dash-badge sw-dash-badge-orange">' + t('Basso', 'Low', 'Bas', 'Мало') + '</span>';
    return '<span class="sw-dash-badge sw-dash-badge-green">OK</span>';
  }

  /* ===================== PANNELLO DISTRIBUTORI PARTNERS SW (MONETIZZAZIONE COMMISSIONI) ===================== */
  function buildSuppliersPanel() {
    var slug = state.restaurantSlug || '';
    var regione = (state.restaurant && state.restaurant.regione) || '';

    // Ordina: prima i partner della regione del ristorante
    var sorted = SW_DISTRIBUTORI_PARTNERS.slice().sort(function(a, b) {
      var aMatch = a.regioni.includes('tutte') || (regione && a.regioni.some(function(r){ return regione.toLowerCase().includes(r.toLowerCase()); }));
      var bMatch = b.regioni.includes('tutte') || (regione && b.regioni.some(function(r){ return regione.toLowerCase().includes(r.toLowerCase()); }));
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });

    var html = [
      // Header
      '<div class="sw-dash-panel">',
      '<div class="sw-dash-panel-head">',
        '<h3>🛒 ' + t('Distributori Partners Sommelier World','SW Partner Suppliers','Fournisseurs Partenaires SW','Партнёрские Дистрибьюторы') + '</h3>',
      '</div>',
      '<p style="font-size:.82rem;color:rgba(245,239,226,.55);margin-bottom:16px;">' +
        t('Partner selezionati da SommelierWorld. Usa i link tracciati per ordinare — supporti il progetto.',
          'Selected SW partners. Use tracked links to order — you support the project.',
          'Partenaires SW sélectionnés. Utilisez les liens tracés pour commander.',
          'Партнёры SW. Используйте отслеживаемые ссылки для заказа.') +
      '</p>',

      // Cards distributori
      sorted.map(function(d) {
        var link = d.ref_link.replace('{slug}', slug);
        var isRegional = !d.regioni.includes('tutte') && regione &&
          d.regioni.some(function(r){ return regione.toLowerCase().includes(r.toLowerCase()); });
        return '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(212,175,55,.15);border-radius:12px;padding:16px;margin-bottom:12px;">' +
          '<div style="display:flex;align-items:flex-start;gap:12px;">' +
            '<div style="font-size:1.8rem;flex-shrink:0;">' + d.logo_emoji + '</div>' +
            '<div style="flex:1;">' +
              '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;">' +
                '<span style="font-family:Cinzel,serif;font-size:.9rem;font-weight:600;color:#F5EFE2;">' + d.nome + '</span>' +
                (d.commissione_sw ? '<span style="padding:2px 8px;background:rgba(212,175,55,.15);border:1px solid rgba(212,175,55,.3);border-radius:20px;font-size:.7rem;color:#d4af37;font-weight:700;">' + d.commissione_sw + ' SW</span>' : '') +
                (isRegional ? '<span style="padding:2px 8px;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.3);border-radius:20px;font-size:.7rem;color:#22c55e;">📍 ' + t('Nella tua zona','In your area','Dans votre zone','В вашем регионе') + '</span>' : '') +
              '</div>' +
              '<div style="font-size:.78rem;color:rgba(245,239,226,.45);margin-bottom:6px;">📍 ' + d.zona + '</div>' +
              '<div style="font-size:.82rem;color:rgba(245,239,226,.6);margin-bottom:8px;">ℹ️ ' + d.specialita + '</div>' +
              (d.minimo_ordine !== 'nessuno' ? '<div style="font-size:.75rem;color:rgba(245,239,226,.4);margin-bottom:8px;">📦 ' + t('Minimo:','Min:','Min:','Мин:') + ' ' + d.minimo_ordine + '</div>' : '') +
              (d.note ? '<div style="font-size:.75rem;color:rgba(212,175,55,.5);margin-bottom:10px;font-style:italic;">' + d.note + '</div>' : '') +
              '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
                '<a href="' + link + '" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:rgba(128,0,32,.5);border:1px solid rgba(212,175,55,.3);border-radius:8px;color:#F5EFE2;font-size:.78rem;font-weight:600;text-decoration:none;transition:all .2s;" onmouseover="this.style.background=\'rgba(128,0,32,.8)\'" onmouseout="this.style.background=\'rgba(128,0,32,.5)\'">🛒 ' + t('Vai al sito','Go to site','Aller au site','Перейти') + '</a>' +
                (slug ? '<button onclick="navigator.clipboard&&navigator.clipboard.writeText(\'' + link + '\').then(function(){alert(\'' + t('Link copiato!','Link copied!','Lien copié!','Ссылка скопирована!') + '\')})" style="padding:8px 12px;background:rgba(255,255,255,.06);border:1px solid rgba(212,175,55,.2);border-radius:8px;color:rgba(212,175,55,.7);font-size:.72rem;cursor:pointer;">📋 ' + t('Copia link','Copy link','Copier lien','Копировать') + '</button>' : '') +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
      }).join(''),

      // Separatore
      '<div style="border-top:1px solid rgba(212,175,55,.15);margin:20px 0;"></div>',

      // Sezione Fornitori Personali
      buildFornitoriPersonali(slug),

      '</div>'
    ].join('');

    return html;
  }

  function buildFornitoriPersonali(slug) {
    var fornitori = [];
    try { fornitori = JSON.parse(localStorage.getItem('swl_fornitori_' + slug) || '[]'); } catch(e) {}

    var html = '<div>';
    html += '<div style="font-family:Cinzel,serif;font-size:.44rem;letter-spacing:3px;color:rgba(212,175,55,.7);margin-bottom:12px;">👤 ' + t('I TUOI FORNITORI PERSONALI','YOUR PERSONAL SUPPLIERS','VOS FOURNISSEURS PERSONNELS','ВАШИ ЛИЧНЫЕ ПОСТАВЩИКИ') + '</div>';
    html += '<p style="font-size:.8rem;color:rgba(245,239,226,.5);margin-bottom:14px;">' + t('Aggiungi i tuoi fornitori locali. Il sistema genera l\'email di riordino automaticamente.','Add your local suppliers. The system generates the reorder email automatically.','Ajoutez vos fournisseurs locaux.','Добавьте своих местных поставщиков.') + '</p>';

    // Lista fornitori esistenti
    if (fornitori.length) {
      html += fornitori.map(function(f) {
        return '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(212,175,55,.1);border-radius:10px;padding:12px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">' +
          '<div>' +
            '<div style="font-weight:600;color:#F5EFE2;font-size:.88rem;">' + f.nome + '</div>' +
            (f.zona ? '<div style="font-size:.75rem;color:rgba(245,239,226,.4);">📍 ' + f.zona + '</div>' : '') +
            (f.telefono ? '<div style="font-size:.78rem;color:rgba(212,175,55,.7);">📞 ' + f.telefono + '</div>' : '') +
            (f.specialita ? '<div style="font-size:.75rem;color:rgba(245,239,226,.5);font-style:italic;">' + f.specialita + '</div>' : '') +
          '</div>' +
          '<div style="display:flex;flex-direction:column;gap:6px;">' +
            '<button onclick="swGeneraEmailOrdine(\'' + f.id + '\')" style="padding:5px 10px;background:rgba(128,0,32,.4);border:1px solid rgba(212,175,55,.25);border-radius:6px;color:#d4af37;font-size:.72rem;cursor:pointer;white-space:nowrap;">📧 ' + t('Genera ordine','Generate order','Générer commande','Создать заказ') + '</button>' +
            '<button onclick="swEliminaFornitore(\'' + f.id + '\')" style="padding:5px 10px;background:transparent;border:1px solid rgba(255,100,100,.2);border-radius:6px;color:rgba(255,100,100,.6);font-size:.68rem;cursor:pointer;">' + t('Elimina','Delete','Supprimer','Удалить') + '</button>' +
          '</div>' +
        '</div>';
      }).join('');
    } else {
      html += '<div style="text-align:center;padding:16px;color:rgba(245,239,226,.3);font-size:.82rem;">' + t('Nessun fornitore ancora. Aggiungine uno qui sotto.','No suppliers yet.','Aucun fournisseur encore.','Поставщиков нет.') + '</div>';
    }

    // Form aggiungi fornitore
    html += '<button onclick="swToggleFormFornitore()" style="width:100%;padding:10px;background:rgba(212,175,55,.08);border:1px dashed rgba(212,175,55,.3);border-radius:8px;color:rgba(212,175,55,.7);font-size:.78rem;cursor:pointer;margin-top:8px;">+ ' + t('Aggiungi fornitore','Add supplier','Ajouter fournisseur','Добавить поставщика') + '</button>';

    html += '<div id="formFornitore" style="display:none;background:rgba(0,0,0,.3);border:1px solid rgba(212,175,55,.2);border-radius:10px;padding:14px;margin-top:10px;">';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">';
    html += '<div><div style="font-size:.72rem;color:rgba(245,239,226,.55);margin-bottom:4px;">' + t('Nome fornitore *','Supplier name *','Nom fournisseur *','Имя поставщика *') + '</div><input id="fnNome" type="text" placeholder="Es: Mario Vini" style="width:100%;padding:8px;background:rgba(0,0,0,.4);border:1px solid rgba(212,175,55,.2);border-radius:6px;color:#F5EFE2;font-size:.82rem;"></div>';
    html += '<div><div style="font-size:.72rem;color:rgba(245,239,226,.55);margin-bottom:4px;">' + t('Zona / Regione','Zone / Region','Zone / Région','Зона / Регион') + '</div><input id="fnZona" type="text" placeholder="Es: Piemonte" style="width:100%;padding:8px;background:rgba(0,0,0,.4);border:1px solid rgba(212,175,55,.2);border-radius:6px;color:#F5EFE2;font-size:.82rem;"></div>';
    html += '<div><div style="font-size:.72rem;color:rgba(245,239,226,.55);margin-bottom:4px;">' + t('Telefono','Phone','Téléphone','Телефон') + '</div><input id="fnTel" type="tel" placeholder="+39 ..." style="width:100%;padding:8px;background:rgba(0,0,0,.4);border:1px solid rgba(212,175,55,.2);border-radius:6px;color:#F5EFE2;font-size:.82rem;"></div>';
    html += '<div><div style="font-size:.72rem;color:rgba(245,239,226,.55);margin-bottom:4px;">Email</div><input id="fnEmail" type="email" placeholder="info@fornitore.it" style="width:100%;padding:8px;background:rgba(0,0,0,.4);border:1px solid rgba(212,175,55,.2);border-radius:6px;color:#F5EFE2;font-size:.82rem;"></div>';
    html += '</div>';
    html += '<div style="margin-bottom:10px;"><div style="font-size:.72rem;color:rgba(245,239,226,.55);margin-bottom:4px;">' + t('Specialità (vini che fornisce)','Speciality (wines supplied)','Spécialité','Специализация') + '</div><input id="fnSpec" type="text" placeholder="Es: Barolo, Brunello, vini piemontesi" style="width:100%;padding:8px;background:rgba(0,0,0,.4);border:1px solid rgba(212,175,55,.2);border-radius:6px;color:#F5EFE2;font-size:.82rem;"></div>';
    html += '<div style="margin-bottom:12px;"><div style="font-size:.72rem;color:rgba(245,239,226,.55);margin-bottom:4px;">' + t('Note (orari, condizioni...)','Notes (hours, terms...)','Notes','Заметки') + '</div><input id="fnNote" type="text" placeholder="Es: Ordina il lunedì, minimo 6 bottiglie" style="width:100%;padding:8px;background:rgba(0,0,0,.4);border:1px solid rgba(212,175,55,.2);border-radius:6px;color:#F5EFE2;font-size:.82rem;"></div>';
    html += '<div style="display:flex;gap:8px;">';
    html += '<button onclick="swSalvaFornitore()" style="flex:1;padding:9px;background:rgba(128,0,32,.6);border:1px solid rgba(212,175,55,.3);border-radius:8px;color:#F5EFE2;font-size:.78rem;font-weight:600;cursor:pointer;">✅ ' + t('Salva fornitore','Save supplier','Sauvegarder','Сохранить') + '</button>';
    html += '<button onclick="swToggleFormFornitore()" style="padding:9px 14px;background:transparent;border:1px solid rgba(212,175,55,.15);border-radius:8px;color:rgba(245,239,226,.5);font-size:.78rem;cursor:pointer;">' + t('Annulla','Cancel','Annuler','Отмена') + '</button>';
    html += '</div></div>';
    html += '</div>';
    return html;
  }

  /* ===================== FORNITORI PERSONALI (azioni) ===================== */
  window.swToggleFormFornitore = function() {
    var f = document.getElementById('formFornitore');
    if (f) f.style.display = f.style.display === 'none' ? 'block' : 'none';
  };

  window.swSalvaFornitore = function() {
    var nome = (document.getElementById('fnNome')||{}).value || '';
    if (!nome.trim()) { alert(t('Inserisci almeno il nome del fornitore.','Enter at least the supplier name.','Entrez le nom du fournisseur.','Введите имя поставщика.')); return; }
    var slug = state.restaurantSlug || '';
    var fornitori = [];
    try { fornitori = JSON.parse(localStorage.getItem('swl_fornitori_' + slug) || '[]'); } catch(e) {}
    fornitori.push({
      id: 'f' + Date.now(),
      nome: nome.trim(),
      zona: (document.getElementById('fnZona')||{}).value || '',
      telefono: (document.getElementById('fnTel')||{}).value || '',
      email: (document.getElementById('fnEmail')||{}).value || '',
      specialita: (document.getElementById('fnSpec')||{}).value || '',
      note: (document.getElementById('fnNote')||{}).value || ''
    });
    localStorage.setItem('swl_fornitori_' + slug, JSON.stringify(fornitori));
    if (typeof renderDashboard === 'function') renderDashboard();
    if (typeof goSection === 'function') goSection('suppliers');
  };

  window.swEliminaFornitore = function(fid) {
    if (!confirm(t('Eliminare questo fornitore?','Delete this supplier?','Supprimer ce fournisseur?','Удалить поставщика?'))) return;
    var slug = state.restaurantSlug || '';
    var fornitori = [];
    try { fornitori = JSON.parse(localStorage.getItem('swl_fornitori_' + slug) || '[]'); } catch(e) {}
    fornitori = fornitori.filter(function(f) { return f.id !== fid; });
    localStorage.setItem('swl_fornitori_' + slug, JSON.stringify(fornitori));
    if (typeof renderDashboard === 'function') renderDashboard();
    if (typeof goSection === 'function') goSection('suppliers');
  };

  // Genera email di riordino per vini sotto scorta
  window.swGeneraEmailOrdine = function(fid) {
    var slug = state.restaurantSlug || '';
    var fornitori = [];
    try { fornitori = JSON.parse(localStorage.getItem('swl_fornitori_' + slug) || '[]'); } catch(e) {}
    var fornitore = fornitori.find(function(f) { return f.id === fid; });
    if (!fornitore) return;

    // Trova vini sotto scorta
    var daRiordinare = (state.wines || []).filter(function(w) {
      return (w.quantity_bottles || 0) <= (w.minimum_threshold || 3) && w.onList !== false;
    });

    var nomeRist = (state.restaurant && state.restaurant.name) || slug;
    var citta = (state.restaurant && state.restaurant.citta) || '';

    var oggetto = t('Ordine riassortimento vini','Wine reorder','Commande de réapprovisionnement','Заказ пополнения запасов') + ' — ' + nomeRist;

    var corpo = t('Gentile','Dear','Cher/Chère','Уважаемый/ая') + ' ' + fornitore.nome + ',\n\n' +
      t('Vi richiediamo le seguenti etichette:','We would like to order the following wines:','Nous souhaitons commander les vins suivants :','Просим поставить следующие позиции:') + '\n\n';

    if (daRiordinare.length) {
      daRiordinare.forEach(function(w) {
        var mancanti = Math.max(0, (w.minimum_threshold || 6) * 2 - (w.quantity_bottles || 0));
        corpo += '• ' + w.wine_name + (w.vintage ? ' ' + w.vintage : '') +
          ' (' + w.producer + ')' +
          ' — ' + t('n.','n.','n.','') + ' ' + mancanti + ' ' + t('bottiglie','bottles','bouteilles','бут.') + '\n';
      });
    } else {
      corpo += t('[Inserire qui i vini da ordinare]','[Insert wines to order here]','[Insérez les vins à commander]','[Укажите вина для заказа]') + '\n';
    }

    corpo += '\n' + t('Distinti saluti,','Best regards,','Cordialement,','С уважением,') + '\n' + nomeRist + (citta ? ', ' + citta : '');

    // Apri client email
    var mailtoLink = 'mailto:' + (fornitore.email || '') +
      '?subject=' + encodeURIComponent(oggetto) +
      '&body=' + encodeURIComponent(corpo);

    // Mostra anteprima + link
    var modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;';
    modal.innerHTML = '<div style="background:#1A130A;border:1px solid rgba(212,175,55,.3);border-radius:16px;padding:24px;max-width:520px;width:100%;max-height:80vh;overflow-y:auto;">' +
      '<div style="font-family:Cinzel,serif;font-size:.44rem;letter-spacing:3px;color:rgba(212,175,55,.7);margin-bottom:12px;">📧 ' + t('ANTEPRIMA EMAIL ORDINE','ORDER EMAIL PREVIEW','APERÇU EMAIL COMMANDE','ПРЕДВАРИТЕЛЬНЫЙ ПРОСМОТР') + '</div>' +
      '<div style="font-size:.78rem;color:rgba(245,239,226,.5);margin-bottom:4px;"><strong style="color:rgba(212,175,55,.7);">A:</strong> ' + (fornitore.email || t('(nessuna email salvata)','(no email saved)','(aucun email)','(нет email)')) + '</div>' +
      '<div style="font-size:.78rem;color:rgba(245,239,226,.5);margin-bottom:12px;"><strong style="color:rgba(212,175,55,.7);">Oggetto:</strong> ' + oggetto + '</div>' +
      '<div style="background:rgba(0,0,0,.3);border:1px solid rgba(212,175,55,.1);border-radius:8px;padding:12px;font-size:.82rem;color:rgba(245,239,226,.8);white-space:pre-wrap;line-height:1.6;margin-bottom:16px;">' + corpo.replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</div>' +
      (daRiordinare.length === 0 ? '<div style="padding:8px;background:rgba(212,175,55,.08);border-radius:6px;font-size:.78rem;color:rgba(212,175,55,.7);margin-bottom:12px;">💡 ' + t('Nessun vino sotto scorta — modifica manualmente il corpo.','No wines under stock — edit the body manually.','Aucun vin en rupture.','Нет вин под порогом.') + '</div>' : '') +
      '<div style="display:flex;gap:8px;">' +
        (fornitore.email ? '<a href="' + mailtoLink + '" style="flex:1;display:block;padding:11px;background:rgba(128,0,32,.6);border:none;border-radius:8px;color:#F5EFE2;font-size:.8rem;font-weight:600;text-align:center;text-decoration:none;">📧 ' + t('Apri in Mail','Open in Mail','Ouvrir dans Mail','Открыть в Mail') + '</a>' : '') +
        '<button onclick="this.closest(\'div[style*=fixed]\').remove()" style="padding:11px 14px;background:rgba(255,255,255,.06);border:1px solid rgba(212,175,55,.2);border-radius:8px;color:rgba(245,239,226,.6);font-size:.8rem;cursor:pointer;">' + t('Chiudi','Close','Fermer','Закрыть') + '</button>' +
      '</div>' +
    '</div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', function(e){ if(e.target===modal) modal.remove(); });
  };

  /* ===================== AGING WINES — INVALSI PROFILI INNECCHIAMENTO ===================== */
  var SW_AGING = {
    barolo:     {min:4, ps:8,  pe:20, max:30},
    barbaresco: {min:3, ps:6,  pe:16, max:22},
    brunello:   {min:5, ps:10, pe:25, max:35},
    amarone:    {min:4, ps:8,  pe:20, max:30},
    champagne_v:{min:2, ps:5,  pe:15, max:20},
    champagne:  {min:0, ps:2,  pe:6,  max:10},
    bollicine:  {min:0, ps:1,  pe:5,  max:7 },
    bianco_r:   {min:1, ps:3,  pe:8,  max:12},
    bianco:     {min:0, ps:1,  pe:4,  max:5 },
    rosso_g:    {min:3, ps:6,  pe:18, max:25},
    rosso_m:    {min:2, ps:4,  pe:10, max:14},
    rosso:      {min:0, ps:2,  pe:5,  max:7 },
    dolce:      {min:0, ps:3,  pe:20, max:40},
    default:    {min:0, ps:2,  pe:8,  max:12}
  };

  function swGetAgingProfile(w) {
    var d = (w.appellation||w.denominazione||'').toLowerCase(), t2 = (w.tipo||w.wine_type||'').toLowerCase();
    if (d.indexOf('barolo') >= 0)     return SW_AGING.barolo;
    if (d.indexOf('barbaresco') >= 0) return SW_AGING.barbaresco;
    if (d.indexOf('brunello') >= 0)   return SW_AGING.brunello;
    if (d.indexOf('amarone') >= 0)    return SW_AGING.amarone;
    if (d.indexOf('champagne') >= 0 && w.vintage && w.vintage !== 's.a.') return SW_AGING.champagne_v;
    if (d.indexOf('champagne') >= 0)  return SW_AGING.champagne;
    if (t2 === 'bollicine')           return SW_AGING.bollicine;
    if (t2 === 'dolce' || t2 === 'passito') return SW_AGING.dolce;
    if (t2 === 'bianco') return (w.mesi_sur_lie||0) > 24 ? SW_AGING.bianco_r : SW_AGING.bianco;
    if (t2 === 'rosso')  return (w.price_sale||0) > 50 ? SW_AGING.rosso_g : ((w.price_sale||0) > 20 ? SW_AGING.rosso_m : SW_AGING.rosso);
    return SW_AGING.default;
  }

  function swGetAgingStatus(w) {
    var v = parseInt(w.vintage); if (!v || isNaN(v)) return null;
    var age = new Date().getFullYear() - v, p = swGetAgingProfile(w);
    if (age < p.min)  return { s:'young',    e:'⏳', label: t('Troppo giovane','Too young','Trop jeune','Слишком молодое'),     detail: t('Pronto tra ','Ready in ','Prêt dans ','Готово через ') + (p.min-age) + t(' anni',' years',' ans',' лет'), color:'#6366f1' };
    if (age < p.ps)   return { s:'approach', e:'🟡', label: t('Si avvicina','Approaching','Approche','Приближается'),          detail: t('Picco tra ','Peak in ','Pic dans ','Пик через ') + (p.ps-age) + t(' anni',' years',' ans',' лет'), color:'#f59e0b' };
    if (age <= p.pe)  return { s:'peak',     e:'🟢', label: t('AL PICCO ORA','AT PEAK NOW','AU PIC MAINTENANT','НА ПИКЕ СЕЙЧАС'), detail: t('Finestra ottimale fino al ','Optimal window until ','Fenêtre optimale jusqu\'en ','Оптимальное окно до ') + (v+p.pe), color:'#22c55e' };
    if (age <= p.max) return { s:'decline',  e:'🔴', label: t('Oltre il picco','Past peak','Au-delà du pic','За пиком'),       detail: t('Consuma entro ','Drink within ','À boire sous ','Выпить в течение ') + Math.max(0, v+p.max-new Date().getFullYear()) + t(' anni',' years',' ans',' лет'), color:'#ef4444' };
    return                { s:'over',       e:'⚠️', label: t('Probabilmente ossidato','Likely oxidized','Probablement oxydé','Вероятно окислено'), detail: t('Verifica prima di servire','Check before serving','Vérifiez avant de servir','Проверьте перед подачей'), color:'#dc2626' };
  }

  function buildAgingPanel() {
    var riserva = (state.wines||[]).filter(function(w){ return w.onList === false && w.vintage && w.vintage !== 's.a.' && (w.quantity_bottles||0) > 0; });
    if (!riserva.length) return '';
    var groups = { peak:[], approach:[], decline:[], over:[], young:[] };
    riserva.forEach(function(w){ var st = swGetAgingStatus(w); if (st && groups[st.s]) groups[st.s].push({ w:w, st:st }); });

    var ah = '<section class="sw-dash-panel" style="margin-top:14px;"><div class="sw-dash-panel-head"><h3>🍷 ' + t('Sommelier Cantina — Invecchiamento','Cellar Sommelier — Aging','Sommelier Cave — Vieillissement','Сомелье погреба — Выдержка') + '</h3></div>';
    ah += '<div style="padding:12px;">';

    if (groups.peak.length) {
      ah += '<div style="background:rgba(34,197,94,.06);border:1px solid rgba(34,197,94,.25);border-radius:8px;padding:12px;margin-bottom:8px;">';
      ah += '<div style="color:#22c55e;font-weight:700;margin-bottom:8px;">🟢 ' + t('PRONTI ORA — Metti in carta','READY NOW — Put on list','PRÊTS — Mettez à la carte','ГОТОВЫ — Поставьте в карту') + ' (' + groups.peak.length + ')</div>';
      groups.peak.forEach(function(x){ ah += '<div style="display:flex;justify-content:space-between;font-size:.82rem;padding:4px 0;border-bottom:1px solid rgba(255,255,255,.05);"><span>' + x.w.wine_name + ' <em>' + x.w.vintage + '</em> · ' + x.w.producer + '</span><span style="color:#22c55e;">' + x.st.detail + '</span></div>'; });
      ah += '</div>';
    }
    if (groups.decline.length || groups.over.length) {
      var urg = groups.over.concat(groups.decline);
      ah += '<div style="background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.25);border-radius:8px;padding:12px;margin-bottom:8px;">';
      ah += '<div style="color:#ef4444;font-weight:700;margin-bottom:8px;">🔴 ' + t('ATTENZIONE — Oltre il picco','WARNING — Past peak','ATTENTION — Au-delà du pic','ВНИМАНИЕ — За пиком') + ' (' + urg.length + ')</div>';
      urg.forEach(function(x){ ah += '<div style="display:flex;justify-content:space-between;font-size:.82rem;padding:4px 0;border-bottom:1px solid rgba(255,255,255,.05);"><span>' + x.w.wine_name + ' <em>' + x.w.vintage + '</em> · ' + x.w.producer + '</span><span style="color:#ef4444;">' + x.st.detail + '</span></div>'; });
      ah += '</div>';
    }
    if (groups.approach.length) {
      ah += '<div style="font-size:.78rem;color:rgba(245,239,226,.45);padding:6px 0;">🟡 ' + t('In avvicinamento:','Approaching:','En approche :','Приближаются:') + ' ' + groups.approach.map(function(x){ return x.w.wine_name + ' ' + x.w.vintage + ' (' + x.st.detail + ')'; }).join(' · ') + '</div>';
    }
    ah += '</div></section>';
    return ah;
  }

  /* ===================== WIZARD CONFIGURAZIONE RISTORANTE + CARTA AI ===================== */
  var _wizData = { tipo: '', fascia: '', vini: 'misto' };

  function buildRestaurantWizard() {
    return [
      '<div style="max-width:560px;margin:24px auto;padding:24px;color:#F5EFE2;background:#1A130A;border-radius:14px;">',

        // Header
        '<div style="font-family:Cinzel,serif;font-size:.44rem;letter-spacing:3px;color:rgba(212,175,55,.7);margin-bottom:6px;">👋 ' + t('CONFIGURA IL TUO RISTORANTE','SET UP YOUR RESTAURANT','CONFIGUREZ VOTRE RESTAURANT','НАСТРОЙТЕ РЕСТОРАН') + '</div>',
        '<p style="color:rgba(245,239,226,.55);font-size:.82rem;margin:0 0 24px;">' + t('Ci vogliono 2 minuti. Ti aiutiamo a costruire la carta perfetta.','2 minutes to build the perfect wine list.','2 minutes pour créer la carte parfaite.','2 минуты для идеальной карты.') + '</p>',

        // TIPO LOCALE
        '<div style="margin-bottom:20px;">',
          '<div style="font-size:.78rem;color:rgba(245,239,226,.65);margin-bottom:10px;font-weight:600;">' + t('Che tipo di locale sei?','What type of venue?','Quel type?','Тип заведения?') + '</div>',
          '<div style="display:flex;flex-wrap:wrap;gap:8px;" id="wizTipoGroup">',
            [['trattoria','🍝 Trattoria'],['pizzeria','🍕 Pizzeria'],['bistrot','🥂 Bistrot'],['fine_dining','⭐ Fine Dining'],['enoteca','🍷 Enoteca'],['hotel','🏨 Hotel'],['altro','📍 ' + t('Altro','Other','Autre','Другое')]].map(function(item){
              return '<button onclick="swWizSetTipo(this,\'' + item[0] + '\')" data-tipo="' + item[0] + '" style="padding:9px 16px;background:rgba(255,255,255,.07);border:1px solid rgba(212,175,55,.25);border-radius:8px;color:#F5EFE2;font-size:.84rem;cursor:pointer;white-space:nowrap;font-family:inherit;transition:all .2s;">' + item[1] + '</button>';
            }).join(''),
          '</div>',
        '</div>',

        // REGIONE + CITTÀ
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">',
          '<div>',
            '<div style="font-size:.78rem;color:rgba(245,239,226,.65);margin-bottom:6px;font-weight:600;">' + t('Regione','Region','Région','Регион') + '</div>',
            '<input id="wizRegione" type="text" placeholder="' + t('es: Valle d\'Aosta','e.g. Aosta Valley','ex : Aoste','напр. Аоста') + '" style="width:100%;box-sizing:border-box;padding:10px 12px;background:rgba(0,0,0,.45);border:1px solid rgba(212,175,55,.25);border-radius:6px;color:#F5EFE2;font-size:.84rem;font-family:inherit;outline:none;">',
          '</div>',
          '<div>',
            '<div style="font-size:.78rem;color:rgba(245,239,226,.65);margin-bottom:6px;font-weight:600;">' + t('Città','City','Ville','Город') + '</div>',
            '<input id="wizCitta" type="text" placeholder="' + t('es: Cogne','e.g. Cogne','ex : Cogne','напр. Коньи') + '" style="width:100%;box-sizing:border-box;padding:10px 12px;background:rgba(0,0,0,.45);border:1px solid rgba(212,175,55,.25);border-radius:6px;color:#F5EFE2;font-size:.84rem;font-family:inherit;outline:none;">',
          '</div>',
        '</div>',

        // COPERTI
        '<div style="margin-bottom:20px;">',
          '<div style="font-size:.78rem;color:rgba(245,239,226,.65);margin-bottom:8px;font-weight:600;">' + t('Numero coperti','Covers','Couverts','Мест') + ': <span id="wizCopertiVal" style="color:#d4af37;font-weight:700;">40</span></div>',
          '<input type="range" id="wizCoperti" min="10" max="200" value="40" oninput="document.getElementById(\'wizCopertiVal\').textContent=this.value" style="width:100%;accent-color:#d4af37;height:4px;cursor:pointer;">',
          '<div style="display:flex;justify-content:space-between;font-size:.7rem;color:rgba(245,239,226,.3);margin-top:4px;"><span>10</span><span>200</span></div>',
        '</div>',

        // FASCIA PREZZO
        '<div style="margin-bottom:20px;">',
          '<div style="font-size:.78rem;color:rgba(245,239,226,.65);margin-bottom:10px;font-weight:600;">' + t('Fascia prezzo media a coperto','Average cover price','Prix moyen par couvert','Средний чек') + '</div>',
          '<div style="display:flex;gap:8px;flex-wrap:wrap;" id="wizFasciaGroup">',
            [['economica','€15–25'],['media','€25–45'],['alta','€45–80'],['alta+','€80+']].map(function(f){
              return '<button onclick="swWizSetFascia(this,\'' + f[0] + '\')" data-fascia="' + f[0] + '" style="padding:9px 18px;background:rgba(255,255,255,.07);border:1px solid rgba(212,175,55,.25);border-radius:8px;color:#F5EFE2;font-size:.84rem;cursor:pointer;font-weight:600;font-family:inherit;transition:all .2s;">' + f[1] + '</button>';
            }).join(''),
          '</div>',
        '</div>',

        // PREFERENZA VINI
        '<div style="margin-bottom:28px;">',
          '<div style="font-size:.78rem;color:rgba(245,239,226,.65);margin-bottom:10px;font-weight:600;">' + t('Preferenza vini','Wine preference','Préférence vins','Предпочтение по винам') + '</div>',
          '<div style="display:flex;gap:8px;flex-wrap:wrap;" id="wizViniGroup">',
            [['locale','🏔️ ' + t('Vini locali','Local wines','Vins locaux','Местные')],['nazionale','🇮🇹 ' + t('Vini italiani','Italian wines','Vins italiens','Итальянские')],['internazionale','🌍 ' + t('Vini mondiali','World wines','Vins du monde','Мировые')],['misto','🎯 Mix']].map(function(v){
              return '<button onclick="swWizSetVini(this,\'' + v[0] + '\')" data-vini="' + v[0] + '" style="padding:9px 16px;background:rgba(255,255,255,.07);border:1px solid rgba(212,175,55,.25);border-radius:8px;color:#F5EFE2;font-size:.84rem;cursor:pointer;white-space:nowrap;font-family:inherit;transition:all .2s;">' + v[1] + '</button>';
            }).join(''),
          '</div>',
        '</div>',

        // BOTTONE PRINCIPALE
        '<button onclick="window.swWizSalva()" style="width:100%;padding:15px;background:rgba(128,0,32,.8);color:#F5EFE2;border:none;border-radius:10px;font-family:Cinzel,serif;font-size:.48rem;letter-spacing:2px;cursor:pointer;font-weight:700;">🍷 ' + t('SALVA E GENERA LA MIA CARTA','SAVE & BUILD MY WINE LIST','CRÉER MA CARTE','СОЗДАТЬ КАРТУ') + '</button>',

      '</div>'
    ].join('');
  }

  window.swWizSetTipo = function(btn, val) {
    _wizData.tipo = val;
    document.querySelectorAll('#wizTipoGroup button').forEach(function(b) {
      b.style.background = 'rgba(255,255,255,.07)';
      b.style.borderColor = 'rgba(212,175,55,.25)';
      b.style.color = '#F5EFE2';
    });
    btn.style.background = 'rgba(128,0,32,.65)';
    btn.style.borderColor = 'rgba(212,175,55,.8)';
    btn.style.color = '#FFD700';
  };
  window.swWizSetFascia = function(btn, val) {
    _wizData.fascia = val;
    document.querySelectorAll('#wizFasciaGroup button').forEach(function(b) {
      b.style.background = 'rgba(255,255,255,.07)';
      b.style.borderColor = 'rgba(212,175,55,.25)';
      b.style.color = '#F5EFE2';
    });
    btn.style.background = 'rgba(128,0,32,.65)';
    btn.style.borderColor = 'rgba(212,175,55,.8)';
    btn.style.color = '#FFD700';
  };
  window.swWizSetVini = function(btn, val) {
    _wizData.vini = val;
    document.querySelectorAll('#wizViniGroup button').forEach(function(b) {
      b.style.background = 'rgba(255,255,255,.07)';
      b.style.borderColor = 'rgba(212,175,55,.25)';
      b.style.color = '#F5EFE2';
    });
    btn.style.background = 'rgba(128,0,32,.65)';
    btn.style.borderColor = 'rgba(212,175,55,.8)';
    btn.style.color = '#FFD700';
  };

  window.swWizSalva = async function() {
    var tipo     = _wizData.tipo    || 'trattoria';
    var fascia   = _wizData.fascia  || 'media';
    var prefVini = _wizData.vini    || 'misto';
    var regione  = (document.getElementById('wizRegione')||{}).value || '';
    var citta    = (document.getElementById('wizCitta')||{}).value   || '';
    var coperti  = parseInt((document.getElementById('wizCoperti')||{}).value || 40);

    // Salva nel profilo ristorante
    state.restaurant = state.restaurant || {};
    state.restaurant.tipo            = tipo;
    state.restaurant.fascia_prezzo   = fascia;
    state.restaurant.preferenza_vini = prefVini;
    state.restaurant.regione         = regione;
    state.restaurant.citta           = citta;
    state.restaurant.coperti         = coperti;
    saveState();

    // Lancia generazione carta AI
    await swGeneraCartaAI(tipo, fascia, prefVini, regione, coperti);
  };

  // AI: genera la struttura della carta consigliata (una tantum al setup)
  window.swGeneraCartaAI = async function(tipo, fascia, prefVini, regione, coperti) {
    var panel = document.querySelector('#page-dashboard .sw-dashboard-content');
    if (panel) panel.innerHTML = '<div style="padding:40px;text-align:center;color:#d4af37;font-family:Cinzel,serif;font-size:.5rem;letter-spacing:3px;">🤖 ' + t('IL SOMMELIER AI STA COSTRUENDO LA TUA CARTA...','SOMMELIER AI IS BUILDING YOUR WINE LIST...','LE SOMMELIER AI CRÉE VOTRE CARTE...','СОМЕЛЬЕ AI СОЗДАЁТ ВАШУ КАРТУ...') + '</div>';

    // Numero etichette consigliate in base ai coperti
    var numEtichette = coperti <= 20 ? 20 : coperti <= 50 ? 40 : coperti <= 100 ? 60 : 80;

    var localContext = regione ? t('Il ristorante si trova in ','The restaurant is in ','Le restaurant est en ','Ресторан находится в ') + regione + '. ' : '';
    var prefContext  = prefVini === 'locale'
      ? t('Privilegia vini della regione locale.','Prioritise local regional wines.','Privilégiez les vins locaux de la région.','Приоритет местным винам региона.')
      : prefVini === 'nazionale'
      ? t('Privilegia vini italiani da tutta Italia.','Prioritise Italian wines.','Privilégiez les vins italiens.','Приоритет итальянским винам.')
      : prefVini === 'internazionale'
      ? t('Includi vini internazionali (Francia, Spagna, Nuovo Mondo).','Include international wines (France, Spain, New World).','Incluez des vins internationaux.','Включите международные вина.')
      : t('Mix equilibrato di vini locali, italiani e internazionali.','Balanced mix of local, Italian and international wines.','Mix équilibré de vins locaux, italiens et internationaux.','Сбалансированный микс местных, итальянских и международных вин.');

    var system = t(
      'Sei un sommelier consulente esperto. Rispondi SOLO in JSON, nessun altro testo, nessun markdown. Schema: {"struttura":{"bollicine":{"percentuale":"X%","n_etichette":N,"note":"..."},"bianchi":{"percentuale":"X%","n_etichette":N,"note":"..."},"rossi":{"percentuale":"X%","n_etichette":N,"note":"..."},"rosati":{"percentuale":"X%","n_etichette":N,"note":"..."},"dolci":{"percentuale":"X%","n_etichette":N,"note":"..."}},"denominazioni_consigliate":["nome denominazione","..."],"consiglio_generale":"...","vini_al_bicchiere":["nome vino tipo","..."],"prossimo_acquisto":["nome vino tipo fascia_prezzo","..."]}',
      'You are an expert sommelier consultant. Reply ONLY in JSON, no other text, no markdown. Schema: {"struttura":{"bollicine":{"percentuale":"X%","n_etichette":N,"note":"..."},"bianchi":{"percentuale":"X%","n_etichette":N,"note":"..."},"rossi":{"percentuale":"X%","n_etichette":N,"note":"..."},"rosati":{"percentuale":"X%","n_etichette":N,"note":"..."},"dolci":{"percentuale":"X%","n_etichette":N,"note":"..."}},"denominazioni_consigliate":["name","..."],"consiglio_generale":"...","vini_al_bicchiere":["wine name type","..."],"prossimo_acquisto":["wine name type price_range","..."]}',
      'Tu es un sommelier consultant expert. Réponds UNIQUEMENT en JSON. Schéma identique à la version italienne.',
      'Ты эксперт-сомелье. Отвечай ТОЛЬКО в JSON. Схема аналогична итальянской версии.'
    );

    var userMsg = localContext + prefContext + ' ' +
      t('Tipo di locale: ','Venue type: ','Type d\'établissement : ','Тип заведения: ') + tipo + '. ' +
      t('Fascia prezzo coperto: ','Cover price range: ','Gamme de prix : ','Диапазон цен: ') + fascia + '. ' +
      t('Numero coperti: ','Covers: ','Couverts : ','Мест: ') + coperti + '. ' +
      t('Crea una carta da ','Build a list of ','Créez une carte de ','Создайте карту из ') + numEtichette + t(' etichette totali.',' total labels.',' étiquettes au total.',' этикеток.');

    try {
      var res = await window.callAPI(system, userMsg, window.getLang ? window.getLang() : 'it');
      var clean = String(res).replace(/```json|```/g, '').trim();
      var data = JSON.parse(clean);
      swMostraRisultataCartaAI(data, numEtichette);
    } catch(e) {
      if (panel) panel.innerHTML = '<div style="padding:40px;color:#f87171;text-align:center;">' + t('Errore generazione carta. Riprova dalla sezione Impostazioni.','Error generating wine list. Retry from Settings.','Erreur de génération. Réessayez depuis Paramètres.','Ошибка генерации. Повторите из Настроек.') + '</div>';
      if (typeof renderDashboard === 'function') setTimeout(renderDashboard, 3000);
    }
  };

  function swMostraRisultataCartaAI(data, numEtichette) {
    var panel = document.querySelector('#page-dashboard .sw-dashboard-content');
    if (!panel) return;

    var struttura = data.struttura || {};
    var catColors = { bollicine:'#6366f1', bianchi:'#f59e0b', rossi:'#ef4444', rosati:'#ec4899', dolci:'#8b5cf6' };

    var html = '<div style="max-width:640px;margin:0 auto;padding:24px 0;">';
    html += '<div style="font-family:Cinzel,serif;font-size:.44rem;letter-spacing:3px;color:rgba(212,175,55,.7);margin-bottom:6px;">🍷 ' + t('SOMMELIER AI','SOMMELIER AI','SOMMELIER AI','СОМЕЛЬЕ AI') + '</div>';
    html += '<h2 style="font-family:Cormorant Garamond,serif;font-size:1.6rem;color:#F5EFE2;margin:0 0 4px;">' + t('La tua Carta dei Vini Ideale','Your Ideal Wine List','Votre Carte des Vins Idéale','Ваша Идеальная Винная Карта') + '</h2>';
    html += '<p style="color:rgba(245,239,226,.55);font-size:.82rem;margin:0 0 20px;">' + numEtichette + ' ' + t('etichette consigliate','labels recommended','étiquettes recommandées','этикеток рекомендовано') + '</p>';

    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px;">';
    Object.keys(struttura).forEach(function(cat) {
      var s = struttura[cat];
      html += '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(212,175,55,.12);border-radius:10px;padding:12px;">';
      html += '<div style="font-size:.78rem;font-weight:700;color:' + (catColors[cat]||'#d4af37') + ';margin-bottom:4px;">' + cat.charAt(0).toUpperCase()+cat.slice(1) + ' · ' + (s.percentuale||'') + '</div>';
      html += '<div style="font-size:1.1rem;font-weight:700;color:#F5EFE2;">' + (s.n_etichette||'?') + ' ' + t('etich.','labels','étiq.','эт.') + '</div>';
      html += '<div style="font-size:.75rem;color:rgba(245,239,226,.5);margin-top:4px;">' + (s.note||'') + '</div>';
      html += '</div>';
    });
    html += '</div>';

    if (data.consiglio_generale) {
      html += '<div style="background:rgba(212,175,55,.06);border-left:3px solid rgba(212,175,55,.4);border-radius:0 8px 8px 0;padding:12px 14px;margin-bottom:16px;">';
      html += '<div style="font-size:.72rem;color:rgba(212,175,55,.7);font-family:Cinzel,serif;letter-spacing:2px;margin-bottom:4px;">💬 ' + t('CONSIGLIO DEL SOMMELIER','SOMMELIER\'S ADVICE','CONSEIL DU SOMMELIER','СОВЕТ СОМЕЛЬЕ') + '</div>';
      html += '<p style="font-family:IM Fell English,serif;font-style:italic;font-size:.9rem;color:rgba(245,239,226,.8);margin:0;line-height:1.65;">' + data.consiglio_generale + '</p>';
      html += '</div>';
    }

    if (data.denominazioni_consigliate && data.denominazioni_consigliate.length) {
      html += '<div style="margin-bottom:16px;">';
      html += '<div style="font-size:.72rem;color:rgba(245,239,226,.4);font-family:Cinzel,serif;letter-spacing:2px;margin-bottom:8px;">🌍 ' + t('DENOMINAZIONI CONSIGLIATE','RECOMMENDED APPELLATIONS','APPELLATIONS RECOMMANDÉES','РЕКОМЕНДУЕМЫЕ АПЕЛЛАСЬОНЫ') + '</div>';
      html += '<div style="display:flex;flex-wrap:wrap;gap:6px;">';
      data.denominazioni_consigliate.forEach(function(d) {
        html += '<span style="padding:4px 12px;background:rgba(255,255,255,.06);border:1px solid rgba(212,175,55,.15);border-radius:20px;font-size:.78rem;color:rgba(245,239,226,.7);">' + d + '</span>';
      });
      html += '</div></div>';
    }

    if (data.vini_al_bicchiere && data.vini_al_bicchiere.length) {
      html += '<div style="margin-bottom:16px;">';
      html += '<div style="font-size:.72rem;color:rgba(245,239,226,.4);font-family:Cinzel,serif;letter-spacing:2px;margin-bottom:8px;">🥂 ' + t('VINI AL BICCHIERE (ROTAZIONE)','WINES BY THE GLASS (ROTATION)','VINS AU VERRE (ROTATION)','ВИНА В БОКАЛ') + '</div>';
      data.vini_al_bicchiere.forEach(function(v) {
        html += '<div style="font-size:.82rem;color:rgba(245,239,226,.65);padding:4px 0;border-bottom:1px solid rgba(255,255,255,.05);">· ' + v + '</div>';
      });
      html += '</div>';
    }

    if (data.prossimo_acquisto && data.prossimo_acquisto.length) {
      html += '<div style="margin-bottom:24px;">';
      html += '<div style="font-size:.72rem;color:rgba(245,239,226,.4);font-family:Cinzel,serif;letter-spacing:2px;margin-bottom:8px;">🛒 ' + t('PRIMO ACQUISTO CONSIGLIATO','FIRST PURCHASE RECOMMENDATION','PREMIER ACHAT RECOMMANDÉ','ПЕРВАЯ ЗАКУПКА') + '</div>';
      data.prossimo_acquisto.forEach(function(v) {
        html += '<div style="font-size:.82rem;color:rgba(245,239,226,.65);padding:4px 0;border-bottom:1px solid rgba(255,255,255,.05);">· ' + v + '</div>';
      });
      html += '</div>';
    }

    html += '<div style="display:flex;gap:10px;">';
    html += '<button onclick="window.swSalvaConsiglioCarta(' + JSON.stringify(data).replace(/"/g,'&quot;') + ')" style="flex:1;padding:12px;background:rgba(128,0,32,.6);color:#F5EFE2;border:none;border-radius:8px;font-family:Cinzel,serif;font-size:.42rem;letter-spacing:2px;cursor:pointer;">✅ ' + t('SALVA QUESTO CONSIGLIO','SAVE THIS ADVICE','SAUVEGARDER CE CONSEIL','СОХРАНИТЬ СОВЕТ') + '</button>';
    html += '<button onclick="if(typeof renderDashboard===\'function\')renderDashboard()" style="padding:12px 16px;background:rgba(255,255,255,.06);color:rgba(245,239,226,.6);border:1px solid rgba(212,175,55,.2);border-radius:8px;font-size:.8rem;cursor:pointer;">' + t('Vai alla Panoramica','Go to Overview','Aller à l\'Aperçu','К Обзору') + '</button>';
    html += '</div>';
    html += '</div>';

    panel.innerHTML = html;
  }

  // Salva il consiglio AI nel profilo ristorante
  window.swSalvaConsiglioCarta = function(data) {
    state.restaurant = state.restaurant || {};
    state.restaurant.carta_ai_consiglio = data;
    state.restaurant.carta_ai_data      = new Date().toISOString().slice(0, 10);
    saveState();
    if (typeof renderDashboard === 'function') renderDashboard();
  };

  /* ===================== CONSULENTE CARTA (sezione permanente) ===================== */
  function buildCartaAIPage() {
    // Profilo ristorante incompleto → mostra il wizard (continuità con swApriWizard)
    if (!state.restaurant || !state.restaurant.tipo) return buildRestaurantWizard();
    var rest = state.restaurant || {};
    var hasProfilo = !!(rest.tipo);
    var hasConsiglio = !!(rest.carta_ai_consiglio);

    var html = '<div style="max-width:640px;margin:0 auto;padding:24px 0;">';

    // ── Header ──
    html += '<div style="margin-bottom:24px;">';
    html += '<div style="font-family:Cinzel,serif;font-size:.44rem;letter-spacing:3px;color:rgba(212,175,55,.7);margin-bottom:6px;">🤖 ' + t('CONSULENTE CARTA','WINE LIST ADVISOR','CONSEILLER CARTE','СОВЕТНИК КАРТЫ') + '</div>';
    html += '<h2 style="font-family:Cormorant Garamond,serif;font-size:1.55rem;color:#F5EFE2;margin:0 0 4px;">' + t('La tua Carta dei Vini Ideale','Your Ideal Wine List','Votre Carte des Vins Idéale','Ваша Идеальная Карта') + '</h2>';
    html += '<p style="color:rgba(245,239,226,.5);font-size:.82rem;margin:0;">' + t('Il Sommelier AI analizza il tuo ristorante e costruisce la struttura carta perfetta.','Sommelier AI analyses your restaurant and builds the perfect wine list structure.','Le Sommelier AI analyse votre restaurant et crée la structure de carte parfaite.','Сомелье AI анализирует ваш ресторан и строит идеальную структуру карты.') + '</p>';
    html += '</div>';

    // ── Profilo ristorante attuale ──
    if (hasProfilo) {
      html += '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(212,175,55,.12);border-radius:10px;padding:14px;margin-bottom:16px;">';
      html += '<div style="font-size:.72rem;color:rgba(212,175,55,.6);font-family:Cinzel,serif;letter-spacing:2px;margin-bottom:10px;">' + t('PROFILO RISTORANTE','RESTAURANT PROFILE','PROFIL RESTAURANT','ПРОФИЛЬ РЕСТОРАНА') + '</div>';
      html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:.82rem;">';
      var profCols = [
        [t('Tipo','Type','Type','Тип'), rest.tipo||'—'],
        [t('Fascia prezzo','Price range','Gamme de prix','Диапазон цен'), rest.fascia_prezzo||'—'],
        [t('Regione','Region','Région','Регион'), rest.regione||'—'],
        [t('Città','City','Ville','Город'), rest.citta||'—'],
        [t('Coperti','Covers','Couverts','Мест'), rest.coperti||'—'],
        [t('Vini','Wines','Vins','Вина'), rest.preferenza_vini||'—']
      ];
      profCols.forEach(function(c) {
        html += '<div><span style="color:rgba(245,239,226,.4);">' + c[0] + ':</span> <strong style="color:#F5EFE2;">' + c[1] + '</strong></div>';
      });
      html += '</div>';
      html += '<button onclick="window.swApriWizard()" style="margin-top:10px;padding:5px 12px;background:rgba(255,255,255,.06);border:1px solid rgba(212,175,55,.2);color:rgba(212,175,55,.8);border-radius:6px;font-size:.75rem;cursor:pointer;">' + t('✏️ Modifica profilo','✏️ Edit profile','✏️ Modifier le profil','✏️ Редактировать') + '</button>';
      html += '</div>';
    } else {
      html += '<div style="background:rgba(212,175,55,.06);border:1px dashed rgba(212,175,55,.3);border-radius:10px;padding:16px;margin-bottom:16px;text-align:center;">';
      html += '<p style="color:rgba(245,239,226,.55);margin:0 0 10px;">' + t('Configura prima il profilo del tuo ristorante.','Set up your restaurant profile first.','Configurez d\'abord votre profil.','Сначала настройте профиль ресторана.') + '</p>';
      html += '<button onclick="window.swApriWizard()" style="padding:10px 24px;background:rgba(128,0,32,.6);color:#F5EFE2;border:none;border-radius:8px;font-family:Cinzel,serif;font-size:.42rem;letter-spacing:2px;cursor:pointer;">⚙️ ' + t('CONFIGURA IL RISTORANTE','SET UP RESTAURANT','CONFIGURER LE RESTAURANT','НАСТРОИТЬ РЕСТОРАН') + '</button>';
      html += '</div>';
    }

    // ── Consiglio salvato ──
    if (hasConsiglio) {
      var c = rest.carta_ai_consiglio;
      var dataConsiglio = rest.carta_ai_data || '';
      html += '<div style="background:rgba(34,197,94,.05);border:1px solid rgba(34,197,94,.2);border-radius:10px;padding:14px;margin-bottom:16px;">';
      html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">';
      html += '<div><div style="font-size:.72rem;color:#22c55e;font-family:Cinzel,serif;letter-spacing:2px;">✅ ' + t('CONSIGLIO SALVATO','SAVED ADVICE','CONSEIL ENREGISTRÉ','СОВЕТ СОХРАНЁН') + '</div>';
      if (dataConsiglio) html += '<div style="font-size:.75rem;color:rgba(245,239,226,.4);margin-top:2px;">' + dataConsiglio + '</div>';
      html += '</div>';
      html += '<button onclick="window.swRigenera()" style="padding:6px 14px;background:rgba(128,0,32,.4);border:1px solid rgba(212,175,55,.25);color:#d4af37;border-radius:6px;font-size:.75rem;cursor:pointer;">🔄 ' + t('Rigenera','Regenerate','Regénérer','Обновить') + '</button>';
      html += '</div>';

      // Mostra struttura salvata
      var struttura = c.struttura || {};
      html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:10px;">';
      var catColors = { bollicine:'#6366f1', bianchi:'#f59e0b', rossi:'#ef4444', rosati:'#ec4899', dolci:'#8b5cf6' };
      Object.keys(struttura).forEach(function(cat) {
        var s = struttura[cat];
        html += '<div style="background:rgba(0,0,0,.3);border-radius:8px;padding:8px;text-align:center;">';
        html += '<div style="font-size:.68rem;color:'+(catColors[cat]||'#d4af37')+';font-weight:700;">' + cat + '</div>';
        html += '<div style="font-size:1rem;font-weight:700;color:#F5EFE2;">' + (s.n_etichette||'?') + '</div>';
        html += '<div style="font-size:.65rem;color:rgba(245,239,226,.35);">' + (s.percentuale||'') + '</div>';
        html += '</div>';
      });
      html += '</div>';

      if (c.consiglio_generale) {
        html += '<p style="font-family:IM Fell English,serif;font-style:italic;font-size:.85rem;color:rgba(245,239,226,.7);margin:0;line-height:1.6;border-top:1px solid rgba(255,255,255,.06);padding-top:8px;">' + c.consiglio_generale + '</p>';
      }

      // Denominazioni
      if (c.denominazioni_consigliate && c.denominazioni_consigliate.length) {
        html += '<div style="margin-top:10px;"><div style="font-size:.7rem;color:rgba(245,239,226,.35);margin-bottom:6px;">' + t('Denominazioni','Appellations','Appellations','Апелласьоны') + '</div>';
        html += '<div style="display:flex;flex-wrap:wrap;gap:5px;">';
        c.denominazioni_consigliate.forEach(function(d) {
          html += '<span style="padding:3px 10px;background:rgba(255,255,255,.05);border:1px solid rgba(212,175,55,.12);border-radius:20px;font-size:.75rem;color:rgba(245,239,226,.6);">' + d + '</span>';
        });
        html += '</div></div>';
      }

      html += '</div>';
    }

    // ── Bottone genera (se profilo ok ma nessun consiglio) ──
    if (hasProfilo && !hasConsiglio) {
      html += '<button onclick="window.swRigenera()" style="width:100%;padding:14px;background:rgba(128,0,32,.7);color:#F5EFE2;border:none;border-radius:8px;font-family:Cinzel,serif;font-size:.46rem;letter-spacing:2px;cursor:pointer;font-weight:600;">🍷 ' + t('GENERA LA MIA CARTA CON AI','GENERATE MY WINE LIST WITH AI','GÉNÉRER MA CARTE AVEC AI','СОЗДАТЬ КАРТУ С AI') + '</button>';
    }

    // ── Analisi carta attuale vs consiglio ──
    if (hasConsiglio && state.wines && state.wines.length) {
      var cartaActual = {
        bollicine: state.wines.filter(function(w){ return w.tipo==='bollicine'&&w.onList!==false; }).length,
        bianchi:   state.wines.filter(function(w){ return w.tipo==='bianco'&&w.onList!==false; }).length,
        rossi:     state.wines.filter(function(w){ return w.tipo==='rosso'&&w.onList!==false; }).length,
        rosati:    state.wines.filter(function(w){ return w.tipo==='rosato'&&w.onList!==false; }).length,
        dolci:     state.wines.filter(function(w){ return w.tipo==='dolce'&&w.onList!==false; }).length
      };
      var target = rest.carta_ai_consiglio.struttura || {};

      html += '<div style="margin-top:16px;">';
      html += '<div style="font-size:.72rem;color:rgba(245,239,226,.4);font-family:Cinzel,serif;letter-spacing:2px;margin-bottom:10px;">📊 ' + t('CARTA ATTUALE VS CONSIGLIO','CURRENT LIST VS ADVICE','CARTE ACTUELLE VS CONSEIL','ТЕКУЩАЯ VS СОВЕТ') + '</div>';

      Object.keys(target).forEach(function(cat) {
        var tgt = (target[cat]||{}).n_etichette || 0;
        var cur = cartaActual[cat] || 0;
        var pct = tgt > 0 ? Math.min(100, Math.round(cur/tgt*100)) : 0;
        var color = pct >= 80 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444';
        html += '<div style="margin-bottom:8px;">';
        html += '<div style="display:flex;justify-content:space-between;font-size:.78rem;margin-bottom:3px;">';
        html += '<span style="color:rgba(245,239,226,.6);">' + cat + '</span>';
        html += '<span><strong style="color:'+color+';">' + cur + '</strong><span style="color:rgba(245,239,226,.3);"> / ' + tgt + t(' consigl.',' rec.',' rec.',' рек.') + '</span></span>';
        html += '</div>';
        html += '<div style="background:rgba(255,255,255,.08);border-radius:4px;height:4px;">';
        html += '<div style="background:'+color+';width:'+pct+'%;height:4px;border-radius:4px;transition:width .5s;"></div>';
        html += '</div></div>';
      });
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  // Rigenera dalla pagina carta_ai o dal bottone impostazioni
  window.swRigenera = async function() {
    var rest = state.restaurant || {};
    if (!rest.tipo) { window.swApriWizard(); return; }
    await window.swGeneraCartaAI(rest.tipo, rest.fascia_prezzo||'media', rest.preferenza_vini||'misto', rest.regione||'', rest.coperti||40);
  };

  // QR del tablet cameriere (tavolo.html)
  window.swQRTavolo = function() {
    if(typeof QRCode === 'undefined') {
      alert('QRCode.js non caricato. Aggiungi il CDN in index.html.');
      return;
    }
    var slug = state.restaurantSlug || 'demo-ristorante';
    var url = 'https://sommelierworld.vin/tavolo.html?slug=' + slug;
    var wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:28px;border-radius:16px;z-index:9999;box-shadow:0 20px 60px rgba(0,0,0,.3);text-align:center;min-width:240px;';
    wrap.innerHTML = '<div style="font-size:.65rem;font-weight:700;color:#6B7280;letter-spacing:.1em;text-transform:uppercase;margin-bottom:12px;">QR TABLET CAMERIERE</div>' +
      '<div id="swQRTavoloCanvas"></div>' +
      '<p style="font-size:.72rem;color:#9CA3AF;margin:10px 0 14px;">' + url + '</p>' +
      '<button onclick="document.querySelector(\'#swQRTavoloCanvas canvas\').toBlob(function(b){var a=document.createElement(\'a\');a.href=URL.createObjectURL(b);a.download=\'qr-tablet-cameriere.png\';a.click()})" style="padding:8px 18px;background:#1D4ED8;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:.78rem;font-weight:600;margin-right:8px;">⬇️ Scarica PNG</button>' +
      '<button onclick="this.parentElement.remove()" style="padding:8px 16px;background:#F3F4F6;color:#374151;border:none;border-radius:8px;cursor:pointer;font-size:.78rem;">Chiudi</button>';
    document.body.appendChild(wrap);
    setTimeout(function(){
      new QRCode(document.getElementById('swQRTavoloCanvas'), {
        text: url, width: 180, height: 180,
        colorDark: '#111827', colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      });
    }, 100);
  };

  // Riapre il wizard (rigenera consiglio carta AI)
  window.swApriWizard = function() {
    if (state.restaurant) state.restaurant.tipo = undefined;
    // Naviga alla sezione carta_ai per continuità
    if (typeof goSection === 'function') goSection('carta_ai');
    else if (typeof renderDashboard === 'function') renderDashboard();
  };

  /* ===================== OVERVIEW + PRIVACY CARD ===================== */
  function buildOverview() {
    // Primo accesso o profilo ristorante incompleto → wizard di configurazione
    if (!state.restaurant || !state.restaurant.tipo) return buildRestaurantWizard();
    var cards = [
      statCard('🍾', t('Bottiglie in inventario', 'Bottles in stock', 'Bouteilles en stock', 'Бутылок'), state.totals.inventoryCount.toLocaleString('it-IT'), fmtMoney(state.totals.inventoryValue) + ' ' + t('valore', 'value', 'valeur', 'стоимость'), 'tone-wine'),
      statCard('🧾', t('Vendite (30gg)', 'Sales (30d)', 'Ventes (30j)', 'Продажи (30д)'), state.totals.soldCount.toLocaleString('it-IT') + ' ' + t('pezzi', 'items', 'pièces', 'шт.'), fmtMoney(state.totals.soldValue), 'tone-gold'),
      statCard('⚠️', t('Scorte basse', 'Low stock', 'Stock faible', 'Мало на складе'), String(state.totals.lowStock), t('da ricontrollare', 'to recheck', 'à revérifier', 'проверить'), 'tone-orange'),
      statCard('⛔', t('Esauriti', 'Out of stock', 'En rupture', 'Закончилось'), String(state.totals.outOfStock), t('etichette finite', 'labels sold out', 'étiquettes épuisées', 'нет в наличии'), 'tone-red')
    ].join('');

    // Calcolo margine medio della carta
    var winesOnList = (state.wines||[]).filter(function(w){ return w.onList !== false && w.price_purchase && w.price_carta; });
    var margineMedia = 0, winesBassaMargine = [], prezzoCaliceAlert = [];
    if (winesOnList.length) {
      var totMk = 0;
      winesOnList.forEach(function(w) {
        var mk = (w.price_carta - w.price_purchase) / w.price_purchase * 100;
        totMk += mk;
        if (mk < 80) winesBassaMargine.push(w);
        if (w.price_bicchiere && w.price_bicchiere < w.price_purchase) prezzoCaliceAlert.push(w);
      });
      margineMedia = Math.round(totMk / winesOnList.length);
    }

    var mkColor = margineMedia >= 120 ? '#22c55e' : margineMedia >= 80 ? '#f59e0b' : '#ef4444';
    cards += '<div class="sw-dash-stat-card">' +
      '<div class="sw-dash-stat-label">📊 ' + t('Markup medio carta','Avg list markup','Markup moy. carte','Средняя наценка') + '</div>' +
      '<div class="sw-dash-stat-val" style="color:' + mkColor + ';">' + (margineMedia > 0 ? '+' + margineMedia + '%' : '—') + '</div>' +
      '<div class="sw-dash-stat-sub">' + winesOnList.length + ' ' + t('vini analizzati','wines analysed','vins analysés','вин') + '</div>' +
    '</div>';

    // Alert vini con markup sbagliato
    var prezziHtml = '';
    if (winesBassaMargine.length) {
      prezziHtml += '<div class="sw-dash-panel" style="margin-top:14px;border-left:4px solid #ef4444;">';
      prezziHtml += '<div class="sw-dash-panel-head"><h3>⚠️ ' + t('Vini con markup basso (< 80%)','Wines with low markup (< 80%)','Vins faible markup (< 80%)','Вина с низкой наценкой') + ' (' + winesBassaMargine.length + ')</h3></div>';
      prezziHtml += '<p style="font-size:.78rem;color:rgba(245,239,226,.5);margin-bottom:10px;">' + t('Stai vendendo quasi a costo. Rivedi il prezzo in carta.','You\'re selling near cost. Revise your list price.','Vous vendez presque au coût.','Продаёте почти по себестоимости.') + '</p>';
      winesBassaMargine.forEach(function(w) {
        var mk = Math.round((w.price_carta - w.price_purchase) / w.price_purchase * 100);
        var ottimale = swSuggerisciPrezzo(w.price_purchase);
        prezziHtml += '<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.06);font-size:.8rem;">';
        prezziHtml += '<div><strong>' + w.wine_name + '</strong><div style="font-size:.72rem;color:rgba(245,239,226,.4);">acq. €' + (w.price_purchase||0).toFixed(2) + ' · carta €' + (w.price_carta||0).toFixed(2) + ' · markup <span style="color:#ef4444;font-weight:700;">+' + mk + '%</span></div></div>';
        prezziHtml += '<span style="font-size:.72rem;color:#f59e0b;">' + t('Suggerito:','Suggested:','Suggéré:','Рек.:') + ' €' + ottimale.min + '–' + ottimale.max + '</span>';
        prezziHtml += '</div>';
      });
      prezziHtml += '</div>';
    }

    if (prezzoCaliceAlert.length) {
      prezziHtml += '<div class="sw-dash-panel" style="margin-top:10px;border-left:4px solid #f59e0b;">';
      prezziHtml += '<div class="sw-dash-panel-head"><h3>🥂 ' + t('Calice sotto costo bottiglia','Glass price below bottle cost','Prix verre < coût bouteille','Бокал ниже себестоимости') + '</h3></div>';
      prezzoCaliceAlert.forEach(function(w) {
        prezziHtml += '<div style="font-size:.8rem;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.06);display:flex;justify-content:space-between;">';
        prezziHtml += '<span>' + w.wine_name + '</span>';
        prezziHtml += '<span style="color:#f59e0b;">' + t('Calice','Glass','Verre','Бокал') + ' €' + (w.price_bicchiere||0).toFixed(2) + ' &lt; ' + t('acq.','cost','achat','себест.') + ' €' + (w.price_purchase||0).toFixed(2) + '</span>';
        prezziHtml += '</div>';
      });
      prezziHtml += '<div style="font-size:.75rem;color:rgba(245,239,226,.45);margin-top:8px;">💡 ' + t('Regola: il 1° calice deve coprire il costo della bottiglia intera.','Rule: the 1st glass must cover the full bottle cost.','Règle: le 1er verre doit couvrir le coût de la bouteille.','Правило: 1-й бокал должен покрывать стоимость бутылки.') + '</div>';
      prezziHtml += '</div>';
    }

    var privacyCard = state.isSuperAdmin ? '' : [
      '<div class="sw-dash-privacy-card">',
        '<div class="sw-dash-privacy-title">🔐 ' + t('Privacy & Isolamento Dati', 'Privacy & Data Isolation', 'Confidentialité & Isolation des Données', 'Конфиденциальность и Изоляция Данных') + '</div>',
        '<p><strong>' + t('Solo tu puoi vedere questi dati.', 'Only you can see this data.', 'Seul vous pouvez voir ces données.', 'Только вы можете видеть эти данные.') + '</strong> ' +
          t('Nessun altro ristorante o utente può accedere alla tua area personale, alle tue ordinazioni, alla tua contabilità o al tuo inventario.', 'No other restaurant or user can access your private area, orders, accounting or inventory.', 'Aucun autre restaurant ou utilisateur ne peut accéder à votre espace privé, commandes, comptabilité ou inventaire.', 'Ни один другой ресторан или пользователь не может получить доступ к вашему личному кабинету, заказам, бухгалтерии или инвентарю.') + '</p>',
        '<p>' + t('Lo staff di SommelierWorld vede solo i dati di configurazione tecnica (slug, nome, piano) e può entrare nella tua area solo SU RICHIESTA ESPLICITA per supporto.', 'SommelierWorld staff only sees technical configuration data (slug, name, plan) and can enter your area only ON EXPLICIT REQUEST for support.', "L'équipe SommelierWorld ne voit que les données de configuration technique (slug, nom, plan) et ne peut accéder à votre espace que SUR DEMANDE EXPLICITE pour le support.", 'Персонал SommelierWorld видит только технические конфигурационные данные (слаг, имя, тариф) и может войти в вашу область только ПО ЯВНОМУ ЗАПРОСУ для поддержки.') + '</p>',
      '</div>'
    ].join('');

    var topWines = state.wines.slice(0, 5).map(function(w){
      var q = typeof w.quantity_bottles === 'number' ? w.quantity_bottles : 0;
      var minTh = typeof w.minimum_threshold === 'number' ? w.minimum_threshold : 3;
      var st = w.status || (q === 0 ? 'out_of_stock' : (q <= minTh ? 'low_stock' : 'available'));
      var stBadge = getStatusBadgeMini(st);
      return '<tr><td><strong>' + (w.wine_name || '—') + '</strong><div class="sw-dash-muted">' + (w.producer || '') + (w.appellation ? ' · ' + w.appellation : '') + '</div></td><td class="sw-dash-num">' + q + '</td><td class="sw-dash-num">' + fmtMoney(w.price_sale || 0) + '</td><td>' + stBadge + '</td></tr>';
    }).join('');

    var recentMov = state.movements.slice(0, 6).map(function(m){
      var dt = fmtDate(m.at);
      var delta = (m.quantity_delta || 0);
      var sign = delta >= 0 ? '+' : '';
      var deltaClass = delta >= 0 ? 'sw-dash-pos' : 'sw-dash-neg';
      var tpLbl = typeof m.movement_label === 'object' ? t(m.movement_label.it, m.movement_label.en, m.movement_label.fr, m.movement_label.ru) : (m.movement_label || m.movement_type || '');
      return '<tr><td>' + dt + '</td><td><span class="sw-dash-pill">' + tpLbl + '</span></td><td><strong>' + (m.wine || '—') + '</strong><div class="sw-dash-muted">' + (m.reason || '') + '</div></td><td class="sw-dash-num ' + deltaClass + '">' + sign + delta + '</td></tr>';
    }).join('');

    var rMeta = getRestaurantMeta(state.restaurantSlug || '');
    var rPublic = rMeta && rMeta.public_card === true;
    var slug = state.restaurantSlug || rMeta.slug || '';
    var baseUrl = (window.location && window.location.origin ? window.location.origin : '') + (window.location ? window.location.pathname : '/') + '#dashboard';
    var rSettingsPanel = [
      '<section class="sw-dash-panel">',
        '<div class="sw-dash-panel-head">',
          '<h3>⚙️ ' + t('Impostazioni Attività', 'Venue Settings', 'Paramètres Activité', 'Настройки Заведения') + '</h3>',
          '<span class="sw-dash-muted" style="font-size:.72rem;">slug: ' + slug + '</span>',
        '</div>',
        '<div style="padding:12px;">',
          '<div style="padding:8px 10px;background:rgba(212,175,55,.06);border:1px solid rgba(212,175,55,.18);border-radius:6px;margin-bottom:10px;">',
            '<div style="display:flex;align-items:center;gap:10px;">',
              '<input id="swDashMyPublicToggle" type="checkbox" ' + (rPublic ? 'checked' : '') + ' onchange="window.swDashToggleMyPublicCard && window.swDashToggleMyPublicCard(this.checked);" style="width:18px;height:18px;accent-color:#d4af37;flex-shrink:0;">',
              '<div style="flex:1;min-width:0;">',
                '<label for="swDashMyPublicToggle" style="color:#111827;font-weight:600;font-size:.82rem;cursor:pointer;line-height:1.25;display:block;">' +
                  t('✅ Pubblica la mia Carta dei Vini online', '✅ Publish my Wine List online', '✅ Publier ma Carte des Vins en ligne', '✅ Опубликовать мою Винную карту онлайн') +
                '</label>',
                '<div style="font-size:.7rem;color:#6b7280;margin-top:3px;line-height:1.4;">' +
                  rPublic
                    ? t('La tua carta è ora visibile nella Homepage Mondiale di SommelierWorld e cercabile da tutti gli utenti.', 'Your list is now visible in SommelierWorld\'s World Homepage and searchable by all users.', 'Votre carte est visible sur la Page d\'Accueil Mondiale de SommelierWorld et recherchable par tous.', 'Ваша карта видна на Главной Мировой SommelierWorld и доступна для поиска всем пользователям.')
                    : t('La carta è PRIVATA: visibile solo a te o tramite link diretto/QR. Spunta per metterla online nella homepage.', 'List is PRIVATE: only you can see it or via direct link/QR. Check to put it online in homepage.', 'Carte PRIVÉE : visible à vous ou par lien direct/QR. Cochez pour la mettre en ligne.', 'Карта ПРИВАТНАЯ: видна только вам или по прямой ссылке/QR. Отметьте чтобы опубликовать.')
                + '</div>',
              '</div>',
              (rPublic ? '<div style="flex-shrink:0;padding:4px 8px;border-radius:4px;background:rgba(21,128,61,.08);border:1px solid rgba(21,128,61,.3);font-family:Cinzel,serif;font-size:.46rem;letter-spacing:.14em;color:#15803d;">ONLINE</div>' : '<div style="flex-shrink:0;padding:4px 8px;border-radius:4px;background:rgba(100,116,139,.08);border:1px solid rgba(100,116,139,.25);font-family:Cinzel,serif;font-size:.46rem;letter-spacing:.14em;color:#64748b;">🔒 PRIVATA</div>')
            ,
            '</div>',
          '</div>',
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">',
            '<div style="padding:8px;border:1px solid #e5e7eb;border-radius:6px;">',
              '<div style="font-family:Cinzel,serif;font-size:.48rem;letter-spacing:.16em;color:#9ca3af;margin-bottom:3px;">' + t('VALUTA','CURRENCY','DEVISE','ВАЛЮТА') + '</div>',
              '<div style="font-size:.92rem;font-weight:700;color:#111827;">' + (rMeta.currency || 'EUR') + '</div>',
            '</div>',
            '<div style="padding:8px;border:1px solid #e5e7eb;border-radius:6px;">',
              '<div style="font-family:Cinzel,serif;font-size:.48rem;letter-spacing:.16em;color:#9ca3af;margin-bottom:3px;">' + t('PIANO','PLAN','FORFAIT','ТАРИФ') + '</div>',
              '<div style="font-size:.92rem;font-weight:700;color:#111827;text-transform:uppercase;">' + (rMeta.plan || 'start') + '</div>',
            '</div>',
          '</div>',
          '<div style="display:flex;gap:6px;flex-wrap:wrap;">',
            '<button type="button" class="sw-dash-btn sw-dash-btn-ghost" onclick="window.open(\'/r/' + slug + '\',\'_blank\');" style="padding:5px 10px;font-size:.7rem;">🔗 ' + t('Apri Carta pubblica','Open public List','Ouvrir Carte publique','Открыть Публичную Карту') + '</button>',
            '<button type="button" class="sw-dash-btn sw-dash-btn-ghost" onclick="navigator.clipboard && navigator.clipboard.writeText(\'/r/' + slug + '\');" style="padding:5px 10px;font-size:.7rem;">📋 ' + t('Copia Slug','Copy slug','Copier slug','Копировать slug') + '</button>',
            '<button type="button" onclick="swQRTavolo()" class="sw-dash-btn sw-dash-btn-ghost" style="justify-content:flex-start;padding:5px 10px;font-size:.7rem;">' + '📲 ' + t('QR Tablet Cameriere','QR Waiter Tablet','QR Tablette Serveur','QR Планшет') + '</button>',
            '<button type="button" onclick="window.swApriWizard()" class="sw-dash-btn sw-dash-btn-ghost" style="justify-content:flex-start;padding:5px 10px;font-size:.7rem;">🤖 ' + t('Rigenera consiglio carta AI','Regenerate AI wine list advice','Regénérer conseil carte AI','Обновить совет AI') + '</button>',
          '</div>',
        '</div>',
      '</section>'
    ].join('');

    // Vini ordinati ma non ancora arrivati
    var inArrivo = (state.wines||[]).filter(function(w){ return w.purchaseStatus === 'ordered'; });
    var arrivoHtml = '';
    if (inArrivo.length) {
      arrivoHtml = '<div class="sw-dash-panel" style="margin-top:14px;border-left:4px solid #f59e0b;">';
      arrivoHtml += '<div class="sw-dash-panel-head"><h3>⏳ ' + t('Vini in Arrivo','Wines Incoming','Vins en Route','Вина в пути') + ' (' + inArrivo.length + ')</h3></div>';
      inArrivo.forEach(function(w) {
        arrivoHtml += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.06);">';
        arrivoHtml += '<span style="font-size:.82rem;">' + (w.wine_name||'') + ' <em>' + (w.vintage||'') + '</em> · ' + (w.producer||'') + '</span>';
        arrivoHtml += '<button onclick="window.swMarkArrived(\'' + w._id + '\')" style="padding:4px 12px;background:rgba(34,197,94,.2);border:1px solid rgba(34,197,94,.4);color:#22c55e;border-radius:6px;font-size:.72rem;cursor:pointer;">✅ ' + t('Arrivato','Arrived','Arrivé','Прибыло') + '</button>';
        arrivoHtml += '</div>';
      });
      arrivoHtml += '</div>';
    }

    // Alert vini da riordinare
    var daRiord = (state.wines||[]).filter(function(w){
      return (w.quantity_bottles||0) <= (w.minimum_threshold||3) &&
        (w.quantity_bottles||0) > 0 &&
        w.onList !== false &&
        w.purchaseStatus !== 'ordered';
    });
    var riordHtml = '';
    if (daRiord.length) {
      riordHtml = '<div class="sw-dash-panel" style="margin-top:14px;border-left:4px solid #f59e0b;">';
      riordHtml += '<div class="sw-dash-panel-head"><h3>🔁 ' + t('Da Riordinare','Reorder Needed','À Réapprovisionner','Необходим дозаказ') + ' (' + daRiord.length + ')</h3></div>';
      riordHtml += '<p style="font-size:.78rem;color:rgba(245,239,226,.5);margin-bottom:10px;">' + t('Vini sotto la soglia minima. Vai in Distributori SW per generare l\'ordine.','Wines below minimum threshold. Go to SW Suppliers to generate the order.','Vins sous le seuil minimum.','Вина ниже минимального порога.') + '</p>';
      daRiord.forEach(function(w) {
        riordHtml += '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.06);font-size:.82rem;">';
        riordHtml += '<span>' + (w.wine_name||'') + ' <span style="color:rgba(245,239,226,.4);">' + (w.vintage||'') + '</span> · ' + (w.producer||'') + '</span>';
        riordHtml += '<span style="color:#f59e0b;font-weight:700;">' + (w.quantity_bottles||0) + ' ' + t('rimaste','remaining','restantes','осталось') + '</span>';
        riordHtml += '</div>';
      });
      riordHtml += '<a onclick="if(typeof goSection===\'function\')goSection(\'suppliers\')" style="display:block;margin-top:10px;padding:8px;background:rgba(212,175,55,.1);border:1px solid rgba(212,175,55,.2);border-radius:8px;color:#d4af37;font-size:.78rem;text-align:center;cursor:pointer;">🛒 ' + t('Vai ai Distributori →','Go to Suppliers →','Aller aux Fournisseurs →','К Поставщикам →') + '</a>';
      riordHtml += '</div>';
    }

    return [
      privacyCard,
      '<div class="sw-dash-stats-grid">' + cards + '</div>',
      buildAgingPanel(),
      arrivoHtml,
      riordHtml,
      prezziHtml,
      '<div class="sw-dash-grid-2">',
        rSettingsPanel,
        '<section class="sw-dash-panel">',
          '<div class="sw-dash-panel-head"><h3>' + t('Esporta Dati', 'Data Export', 'Export Données', 'Экспорт данных') + '</h3><span class="sw-dash-muted" style="font-size:.72rem;">' + t('CSV compatibile con Excel', 'Excel-compatible CSV', 'CSV compatible Excel', 'CSV для Excel') + '</span></div>',
          '<div style="display:grid;grid-template-columns:1fr;gap:8px;padding:12px;">',
            '<button type="button" class="sw-dash-btn sw-dash-btn-ghost" style="justify-content:flex-start;" onclick="window.swDashExportInventory && window.swDashExportInventory()">📦 ' + t('Esporta Inventario completo', 'Export full Inventory', 'Exporter Inventaire complet', 'Экспорт Инвентаря') + '</button>',
            '<button type="button" class="sw-dash-btn sw-dash-btn-ghost" style="justify-content:flex-start;" onclick="window.swDashExportSales && window.swDashExportSales(1)">📅 ' + t('Esporta Vendite OGGI', 'Export Sales TODAY', 'Exporter Ventes AUJOURD\'HUI', 'Экспорт Продаж СЕГОДНЯ') + '</button>',
            '<button type="button" class="sw-dash-btn sw-dash-btn-primary" style="justify-content:flex-start;" onclick="window.swDashExportSales && window.swDashExportSales(7)">📆 ' + t('Esporta Vendite SETTIMANA (7 giorni)', 'Export Sales 7 DAYS', 'Exporter Ventes 7 JOURS', 'Экспорт Продаж НЕДЕЛЯ (7д)') + '</button>',
          '</div>',
        '</section>',
        '<section class="sw-dash-panel">',
          '<div class="sw-dash-panel-head"><h3>' + t('Etichette principali', 'Top labels', 'Meilleures étiquettes', 'Топ этикеток') + '</h3><a class="sw-dash-link" onclick="window.swDashboardGo && window.swDashboardGo(\'inventory\')">' + t('Vedi tutte →', 'View all →', 'Voir tout →', 'Все →') + '</a></div>',
          '<table class="sw-dash-table"><thead><tr><th>' + t('Vino', 'Wine', 'Vin', 'Вино') + '</th><th class="sw-dash-num">' + t('Giac.', 'Stock', 'Stock', 'Ост.') + '</th><th class="sw-dash-num">' + t('Prezzo', 'Price', 'Prix', 'Цена') + '</th><th>Stato</th></tr></thead><tbody>' + (topWines || '<tr><td colspan="4" class="sw-dash-empty">' + t('Nessuna etichetta', 'No labels', 'Aucune étiquette', 'Нет этикеток') + '</td></tr>') + '</tbody></table>',
        '</section>',
        '<section class="sw-dash-panel">',
          '<div class="sw-dash-panel-head"><h3>' + t('Ultimi movimenti', 'Latest movements', 'Derniers mouvements', 'Последние движения') + '</h3><a class="sw-dash-link" onclick="window.swDashboardGo && window.swDashboardGo(\'movements\')">' + t('Vedi tutti →', 'View all →', 'Voir tout →', 'Все →') + '</a></div>',
          '<table class="sw-dash-table"><thead><tr><th>' + t('Data', 'Date', 'Date', 'Дата') + '</th><th>' + t('Tipo', 'Type', 'Type', 'Тип') + '</th><th>' + t('Dettaglio', 'Detail', 'Détail', 'Детали') + '</th><th class="sw-dash-num">Qtà</th></tr></thead><tbody>' + recentMov + '</tbody></table>',
        '</section>',
        '<section class="sw-dash-panel">',
          '<div class="sw-dash-panel-head"><h3>' + t('Per Categoria', 'By Category', 'Par Catégorie', 'По Категории') + '</h3><span class="sw-dash-muted" style="font-size:.72rem;">' + t('Distribuzione etichette', 'Label distribution', 'Distribution étiquettes', 'Распределение этикеток') + '</span></div>',
          (function(){
            var counts = {}; var tot = 0;
            state.wines.forEach(function(w){ var k = categorizeWine(w); counts[k]=(counts[k]||0)+1; tot++; });
            var keys = Object.keys(counts).sort(function(a,b){ return (CATEGORY_META[b]?CATEGORY_META[b].order:99) - (CATEGORY_META[a]?CATEGORY_META[a].order:99); });
            if (!keys.length) return '<div class="sw-dash-empty">' + t('Nessuna etichetta', 'No labels', 'Aucune étiquette', 'Нет этикеток') + '</div>';
            var bars = keys.map(function(k){
              var n = counts[k]; var pct = tot ? Math.round(100*n/tot) : 0;
              return '<div style="margin-bottom:8px;"><div style="display:flex;justify-content:space-between;font-size:.78rem;margin-bottom:4px;"><span style="color:#3f3f46;font-weight:600;">' + getCatIcon(k) + ' ' + getCatLabel(k) + '</span><span style="color:#71717a;">' + n + ' · ' + pct + '%</span></div><div style="height:8px;border-radius:999px;background:#f4f4f5;overflow:hidden;"><div style="height:100%;width:' + Math.max(2,pct) + '%;background:#111827;border-radius:999px;"></div></div></div>';
            }).join('');
            return '<div style="padding:12px;">' + bars + '</div>';
          })(),
        '</section>',
      '</div>'
    ].join('');
  }

  /* ===================== WINE CARD PRONTA DA STAMPARE ===================== */
  function buildWineCardPrint() {
    var restMeta = getRestaurantMeta(state.restaurantSlug);
    var restName = state.restaurant && state.restaurant.name ? state.restaurant.name : restMeta.name;
    var catFilter = state.ui && state.ui.catFilter ? state.ui.catFilter : 'all';
    var sortKey = state.ui && state.ui.sort ? state.ui.sort : 'name-asc';

    var groups = {};
    Object.keys(CATEGORY_META).forEach(function(k){ groups[k] = []; });
    var sortable = [];
    state.wines.forEach(function(w){
      if (w.onList === false) return;
      var k = categorizeWine(w);
      if (!groups[k]) groups[k] = [];
      groups[k].push(w);
      sortable.push(w);
    });
    sortable = sortWines(sortable, sortKey);

    var labelSection = function(key) {
      var m = CATEGORY_META[key];
      var arr = groups[key] || [];
      if (!arr.length) return '';
      // NON ordinare per prezzo — mescola i prezzi (regione + produttore)
      arr = arr.slice().sort(function(a,b){
        return ((getWineRegion(a)||'') + (a.producer||'')).localeCompare((getWineRegion(b)||'') + (b.producer||''));
      });

      var byRegion = {};
      arr.forEach(function(w){
        var q = typeof w.quantity_bottles === 'number' ? w.quantity_bottles : 0;
        if (q === 0) return;
        var r = getWineRegion(w) || t('Altre Regioni','Other Regions','Autres Régions','Другие регионы');
        if (!byRegion[r]) byRegion[r] = [];
        byRegion[r].push(w);
      });

      var regioniKeys = Object.keys(byRegion).sort();

      var allRowsHtml = regioniKeys.map(function(rk){
        var regionWines = byRegion[rk] || [];
        var regionHeader = '';
        if (regioniKeys.length > 1) {
          regionHeader = '<div style="padding:6px 2px 2px;margin-top:8px;margin-bottom:4px;"><span style="font-family:Cinzel,serif;font-size:.54rem;letter-spacing:.22em;color:#6b7280;text-transform:uppercase;border-bottom:1px solid #e5e7eb;padding-bottom:2px;">📍 ' + rk + '</span></div>';
        }

        var wineRows = regionWines.map(function(w){
          var price = w.price_carta || w.price_sale || 0;
          var glassPrice = w.price_bicchiere || null;
          var purchase = getPurchaseUrl(w);
          var badges = getWineBadges(w) || [];
          var idx = state.wines.indexOf(w);

          var badgeColt = '';
          var col = (getWineColtivazione(w) || '').toLowerCase();
          if (col.indexOf('biodinamic') >= 0) badgeColt = '<span style="font-size:1rem;color:#15803d;display:inline-block;width:24px;text-align:center;vertical-align:middle;">🌿</span>';
          else if (col.indexOf('bio') >= 0) badgeColt = '<span style="font-size:1rem;color:#15803d;display:inline-block;width:24px;text-align:center;vertical-align:middle;">🍃</span>';
          else if (col.indexOf('etica') >= 0 || col.indexOf('natur') >= 0) badgeColt = '<span style="font-size:1rem;color:#0ea5e9;display:inline-block;width:24px;text-align:center;vertical-align:middle;">⚖️</span>';

          var prod = (w.producer || '').trim();
          var frac = getWineFrazione(w);
          var riga1 = badgeColt;
          if (prod) {
            riga1 += '<strong style="font-size:1.1rem;color:#0f172a;">' + prod + '</strong>';
            if (frac) riga1 += '<span style="color:#52525b;font-weight:400;">  (' + frac + ')</span>';
          } else if (frac) {
            riga1 += '<strong style="font-size:1rem;color:#0f172a;">' + frac + '</strong>';
          }

          var tipoLabel = (m.it || getWineTipo(w) || w.appellation || '').trim();
          var dos = (w.dosaggio || '').trim();
          var cuv = (getWineCuvee(w) || w.wine_name || '').trim();
          var annRaw = (w.vintage || '').trim();
          var ann = !annRaw || annRaw.toLowerCase() === 's.a.' ? 's.a.' : annRaw;
          var riga2Left = '';
          if (tipoLabel) riga2Left += '<span style="display:inline-block;margin-right:6px;">' + tipoLabel + '</span>';
          if (dos) riga2Left += '<span style="display:inline-block;margin-right:6px;font-weight:500;">' + dos + '</span>';
          if (cuv) {
            if (cuv.indexOf('"') >= 0 || cuv.indexOf('“') >= 0 || cuv.indexOf('«') >= 0) riga2Left += '<span style="font-style:italic;">' + cuv + '</span>';
            else riga2Left += '<span style="font-style:italic;">"' + cuv + '"</span>';
          }
          badges.forEach(function(b){
            if (b === 'piede_franco') riga2Left += '  🍇';
            else if (b === 'anfora') riga2Left += '  🏺';
            else if (b === 'triplea') riga2Left += '  🏅';
            else if (b === 'relais_chateaux') riga2Left += '  🏨';
          });

          var vitigni = '';
          if (Array.isArray(w.grapes) && w.grapes.length) vitigni = w.grapes.join(', ');
          else if (typeof w.grapes === 'string' && w.grapes) vitigni = w.grapes;
          var mesi = getWineMesiSurLie(w);
          var riga3 = '';
          if (vitigni) riga3 = vitigni;
          if (mesi) riga3 += (vitigni ? '  ' : '') + '<em style="color:#0f172a;font-style:italic;">sur lie ' + mesi + ' ' + t('mesi','months','mois','мес') + '</em>';

          var colt = getWineColtivazione(w) || t('Convenzionale','Conventional','Conventionnel','Конвенциональный');
          var liev = getWineLieviti(w) || t('Selezionati','Selected','Sélectionnés','Селекционные');
          var riga4 = '<strong style="color:#111827;font-size:.82rem;letter-spacing:.01em;">' + t('Coltivazione','Farming','Culture','Возделывание') + ':</strong> ' + '<span style="color:#3f3f46;">' + colt + '</span>' +
                      '<span style="display:inline-block;width:28px;"></span>' +
                      '<strong style="color:#111827;font-size:.82rem;letter-spacing:.01em;">' + t('Lieviti','Yeasts','Levures','Дрожжи') + ':</strong> ' + '<span style="color:#3f3f46;">' + liev + '</span>';

          var rigaAcquisto = '';
          if (purchase) rigaAcquisto = '<div style="margin-top:4px;"><a href="' + purchase + '" target="_blank" rel="noopener noreferrer" style="font-size:.7rem;color:#111827;opacity:.6;text-decoration:none;border:1px solid #e5e7eb;padding:2px 6px;border-radius:4px;">🔗 ' + t('Acquista','Buy','Acheter','Купить') + '</a></div>';

          var priceBlock = '<div style="flex-shrink:0;display:flex;align-items:flex-start;gap:10px;min-width:70px;justify-content:flex-end;">';
          priceBlock += '<span style="font-size:1.05rem;font-weight:600;color:#52525b;padding-top:0px;">' + ann + '</span>';
          priceBlock += '<div class="sw-wc-price" style="font-size:1.05rem;font-weight:700;color:#0f172a;">' + fmtMoney(price) + (glassPrice ? '<div style="font-size:.72rem;font-weight:500;color:#71717a;margin-top:2px;white-space:nowrap;">' + t('calice','glass','verre','бокал') + ' ' + fmtMoney(glassPrice) + '</div>' : '') + '</div>';
          priceBlock += '</div>';

          var prodSpacer = 'style="margin-bottom:6px;line-height:1.38;padding-bottom:2px;"';

          return [
            '<div class="sw-wc-row" data-cat="' + key + '" data-region="' + rk + '" style="padding:18px 0;border-bottom:1px solid #eef2f6;">',
              '<div style="display:flex;gap:16px;justify-content:space-between;align-items:flex-start;">',
                '<div style="flex:1;min-width:0;">',
                  '<div ' + prodSpacer + '>' + riga1 + '</div>',
                  '<div style="margin-bottom:3px;line-height:1.42;color:#1f2937;">' + riga2Left + '</div>',
                  (riga3 ? '<div style="margin-bottom:3px;line-height:1.42;color:#3f3f46;font-size:.88rem;">' + riga3 + '</div>' : ''),
                  '<div style="margin-top:4px;line-height:1.5;">' + riga4 + '</div>',
                  rigaAcquisto,
                '</div>',
                priceBlock,
              '</div>',
            '</div>'
          ].join('');
        }).filter(Boolean).join('');

        return regionHeader + wineRows;
      }).join('');

      if (!allRowsHtml) return '';
      return [
        '<div class="sw-dash-winecard-section" data-section-key="' + key + '">',
          '<h3 style="margin-top:28px;margin-bottom:6px;">' + (m.icon ? (m.icon + ' ') : '') + t(m.it, m.en, m.fr, m.ru) + ' <span style="float:right;font-size:.62rem;font-weight:400;color:#71717a;letter-spacing:0;font-family:Inter,sans-serif;">n. ' + groups[key].length + '</span></h3>',
          '<div style="height:2px;background:#0f172a;opacity:.08;margin-bottom:6px;max-width:40%;"></div>',
          allRowsHtml,
        '</div>'
      ].join('');
    };

    var catKeys = Object.keys(CATEGORY_META).sort(function(a,b){
      return (CATEGORY_META[b]?CATEGORY_META[b].order:99) < (CATEGORY_META[a]?CATEGORY_META[a].order:99) ? 1 : -1;
    });

    var bar = [
      '<div style="display:flex;gap:8px;flex-wrap:wrap;padding:12px 0;border-bottom:1px solid #f4f4f5;margin-bottom:16px;">',
        '<div style="display:flex;gap:6px;flex-wrap:wrap;">',
          (function(){
            var byCat = { all: state.wines.filter(function(w){ return w.onList !== false; }).length };
            state.wines.forEach(function(w){ if (w.onList === false) return; var k = categorizeWine(w); byCat[k]=(byCat[k]||0)+1; });
            var list = [{k:'all',l:t('📋 Tutti','📋 All','📋 Tous','📋 Все'),n:byCat.all||0}].concat(catKeys.map(function(k){ return { k:k, l:getCatIcon(k)+' '+getCatLabel(k), n:byCat[k]||0 }; }));
            return list.map(function(x){
              var active = (state.ui.catFilter === x.k) ? ' background:#111827;color:#fff;border-color:#111827; ' : ' color:#3f3f46;border-color:#e5e7eb;background:#fff; ';
              return '<button type="button" data-cat="' + x.k + '" style="border:1px solid #e5e7eb;padding:5px 10px;border-radius:6px;font-size:.72rem;font-weight:600;cursor:pointer;white-space:nowrap;' + active + '" onclick="window.swDashFilterCat && window.swDashFilterCat(\'' + x.k + '\');">' + x.l + ' <span style="opacity:.7;">(' + x.n + ')</span></button>';
            }).join('');
          })(),
        '</div>',
        '<div style="margin-left:auto;display:flex;align-items:center;gap:6px;">',
          '<label for="wc-sort" style="font-size:.7rem;color:#71717a;">' + t('Ordina','Sort','Trier','Сортировка') + '</label>',
          '<select id="wc-sort" style="padding:5px 8px;border:1px solid #e5e7eb;border-radius:6px;background:#fff;font-size:.72rem;color:#18181b;" onchange="window.swDashSortBy && window.swDashSortBy(this.value)">',
            '<option value="name-asc"' + (sortKey==='name-asc'?' selected':'') + '>' + t('Nome A-Z','Name A-Z','Nom A-Z','Название А-Я') + '</option>',
            '<option value="price-asc"' + (sortKey==='price-asc'?' selected':'') + '>' + t('Prezzo ↑','Price ↑','Prix ↑','Цена ↑') + '</option>',
            '<option value="price-desc"' + (sortKey==='price-desc'?' selected':'') + '>' + t('Prezzo ↓','Price ↓','Prix ↓','Цена ↓') + '</option>',
            '<option value="year-desc"' + (sortKey==='year-desc'?' selected':'') + '>' + t('Annata ↓','Vintage ↓','Millésime ↓','Год ↓') + '</option>',
          '</select>',
        '</div>',
      '</div>'
    ].join('');

    var sectionsHtml = catKeys.map(function(k){ return labelSection(k); }).filter(Boolean).join('');

    var headBtns = [
      '<div class="sw-dash-winecard-head" style="flex-wrap:wrap;gap:12px;">',
        '<div style="font-family:Cinzel,serif;font-size:.76rem;letter-spacing:1.2px;color:#475569;">📖 ' + t('Carta ufficiale', 'Official list', 'Carte officielle', 'Официальная карта') + (state.restaurantSlug ? ' · slug: ' + state.restaurantSlug : '') + '</div>',
        '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-left:auto;">',
          '<button class="sw-dash-btn sw-dash-btn-ghost" id="swDashCardAddWine" type="button" style="color:#15803d;border-color:#bbf7d0;background:#f0fdf4;font-weight:700;">＋ ' + t('Aggiungi vino', 'Add wine', 'Ajouter vin', 'Добавить вино') + '</button>',
          '<button class="sw-dash-btn sw-dash-btn-ghost" id="swDashCardPrint2" type="button">🖨️ ' + t('Stampa', 'Print', 'Imprimer', 'Печать') + '</button>',
          '<button class="sw-dash-btn sw-dash-btn-primary" id="swDashCardPdf" type="button">📄 ' + t('Esporta PDF / Anteprima', 'PDF / Preview', 'PDF / Aperçu', 'PDF / Предпросмотр') + '</button>',
        '</div>',
      '</div>'
    ].join('');

    if (!sectionsHtml) {
      sectionsHtml = '<div class="sw-wc-empty">' + t('Nessuna etichetta in carta. Aggiungi vini nella sezione Inventario.', 'No labels yet. Add wines in the Inventory section.', 'Aucune étiquette. Ajoutez des vins dans Inventaire.', 'Нет этикеток в карте. Добавьте вина в раздел Инвентарь.') + '</div>';
    }

    return [
      headBtns,
      bar,
      '<div class="sw-dash-winecard-preview" id="swDashPrintableCard">',
        '<div class="sw-dash-winecard-header">',
          '<h1>' + (restName || 'LA CARTA DEI VINI') + '</h1>',
          '<div class="wc-sub">' + t('Carta dei Vini', 'Wine List', 'Carte des Vins', 'Винная Карта') + ' · ' + new Date().getFullYear() + '</div>',
        '</div>',
        '<div style="margin:22px 0 18px;padding:12px 14px;background:#fafafa;border:1px solid #e5e7eb;border-radius:10px;">',
          '<div style="font-family:Cinzel,serif;font-size:.62rem;letter-spacing:.2em;color:#6b7280;text-transform:uppercase;margin-bottom:6px;">🔍 ' + t('Cerca nella carta', 'Search the list', 'Rechercher dans la carte', 'Поиск по карте') + '</div>',
          '<div class="sw-dash-search-wrap" style="max-width:none;">',
            '<input type="search" id="swDashCardSearch" class="sw-dash-input" style="font-size:.92rem;padding:10px 12px;" placeholder="' + t('Cerca vino: nome, produttore, regione, annata…', 'Search wine: name, producer, region, vintage…', 'Rechercher vin : nom, producteur, région, millésime…', 'Поиск: название, производитель, регион, год…') + '">',
          '</div>',
        '</div>',
        sectionsHtml,
      '</div>'
    ].join('');
  }

  /* ===================== INVENTORY ===================== */
  function buildInventory() {
    var wineTypeLabel = function(wt) {
      if (!wt) return '—';
      var map = {red:t('Rosso','Red','Rouge','Красное'),white:t('Bianco','White','Blanc','Белое'),sparkling:t('Spumante','Sparkling','Effervescent','Игристое'),rose:t('Rosato','Rosé','Rosé','Розовое'),fortified:t('Fortificato','Fortified','Fortifié','Крепленое')};
      return map[wt] || wt;
    };
    var catFilter = state.ui && state.ui.catFilter ? state.ui.catFilter : 'all';
    var sortKey = state.ui && state.ui.sort ? state.ui.sort : 'name-asc';

    var visible = state.wines.slice();
    if (catFilter !== 'all') visible = visible.filter(function(w){ return categorizeWine(w) === catFilter; });
    visible = sortWines(visible, sortKey);

    var byCatCounts = { all: state.wines.length };
    state.wines.forEach(function(w){ var k = categorizeWine(w); byCatCounts[k]=(byCatCounts[k]||0)+1; });
    var catKeys = Object.keys(CATEGORY_META).sort(function(a,b){ return (CATEGORY_META[a]?CATEGORY_META[a].order:99) - (CATEGORY_META[b]?CATEGORY_META[b].order:99); });

    var worldCount = 0;
    try {
      if (Array.isArray(window.CATALOGO_VINI_MONDO)) worldCount += window.CATALOGO_VINI_MONDO.length;
    } catch(e) {}
    try { worldCount += 16; } catch(e) {}
    var importBox = [
      '<div style="margin:0 0 14px;padding:12px 14px;background:#fafafa;border:1px solid #e5e7eb;border-radius:10px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;">',
        '<div style="flex:1;min-width:220px;">',
          '<div style="font-family:Cinzel,serif;font-size:.54rem;letter-spacing:2px;color:#52525b;margin-bottom:3px;text-transform:uppercase;">✦ IMPORT DA CATALOGO MONDO</div>',
          '<div style="font-size:.74rem;color:#71717a;">Importa ' + worldCount + ' etichette internazionali (Champagne, Etna, Valle d\'Aosta, Georgia, Tokaj, ecc.) nel tuo Inventario (stato: RISERVA — non appariranno nella Carta PDF finché non abiliti "In Carta").</div>',
        '</div>',
        '<button type="button" style="padding:10px 14px;border:1.5px solid #d4af37;background:rgba(212,175,55,.08);color:#8b6f1b;border-radius:8px;cursor:pointer;font-family:Cinzel,serif;font-size:.56rem;letter-spacing:1.5px;font-weight:600;white-space:nowrap;" onclick="window.swImportCatalogoMondo && window.swImportCatalogoMondo()">',
          '📥 IMPORTA ' + worldCount + ' VINI DEL MONDO',
        '</button>',
      '</div>'
    ].join('');

    var filterBar = [
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;align-items:center;">',
        '<div style="display:flex;gap:6px;flex-wrap:wrap;">',
          (function(){
            var items = [{k:'all',l:'📋 '+t('Tutti','All','Tous','Все'),n:byCatCounts.all}].concat(catKeys.map(function(k){ return {k:k,l:getCatIcon(k)+' '+getCatLabel(k),n:byCatCounts[k]||0}; }));
            return items.map(function(x){
              var active = catFilter === x.k ? ' background:#111827;color:#fff;border-color:#111827; ' : ' color:#3f3f46;border-color:#e5e7eb;background:#fff; ';
              return '<button type="button" data-cat="' + x.k + '" style="border:1px solid #e5e7eb;padding:4px 8px;border-radius:6px;font-size:.7rem;font-weight:600;cursor:pointer;white-space:nowrap;' + active + '" onclick="window.swDashFilterCat && window.swDashFilterCat(\'' + x.k + '\');">' + x.l + ' <span style="opacity:.7;">(' + x.n + ')</span></button>';
            }).join('');
          })(),
        '</div>',
        '<div style="margin-left:auto;display:flex;align-items:center;gap:6px;flex-wrap:wrap;">',
          '<label for="inv-sort" style="font-size:.7rem;color:#71717a;">' + t('Ordina','Sort','Trier','Сортировка') + '</label>',
          '<select id="inv-sort" style="padding:5px 8px;border:1px solid #e5e7eb;border-radius:6px;background:#fff;font-size:.72rem;color:#18181b;" onchange="window.swDashSortBy && window.swDashSortBy(this.value)">',
            '<option value="name-asc"' + (sortKey==='name-asc'?' selected':'') + '>' + t('Nome A-Z','Name A-Z','Nom A-Z','Название А-Я') + '</option>',
            '<option value="name-desc"' + (sortKey==='name-desc'?' selected':'') + '>' + t('Nome Z-A','Name Z-A','Nom Z-A','Название Я-А') + '</option>',
            '<option value="price-asc"' + (sortKey==='price-asc'?' selected':'') + '>' + t('Prezzo ↑','Price ↑','Prix ↑','Цена ↑') + '</option>',
            '<option value="price-desc"' + (sortKey==='price-desc'?' selected':'') + '>' + t('Prezzo ↓','Price ↓','Prix ↓','Цена ↓') + '</option>',
            '<option value="qty-asc"' + (sortKey==='qty-asc'?' selected':'') + '>' + t('Giacenza ↑','Stock ↑','Stock ↑','Остаток ↑') + '</option>',
            '<option value="qty-desc"' + (sortKey==='qty-desc'?' selected':'') + '>' + t('Giacenza ↓ (Riordino)','Stock ↓ (Reorder)','Stock ↓ (Réappro)','Остаток ↓ (Заказ)') + '</option>',
            '<option value="year-desc"' + (sortKey==='year-desc'?' selected':'') + '>' + t('Annata ↓','Vintage ↓','Millésime ↓','Год ↓') + '</option>',
          '</select>',
        '</div>',
      '</div>'
    ].join('');

    var rows = visible.length ? visible.map(function(w){
      var i = state.wines.indexOf(w);
      if (i < 0) return '';
      var q = typeof w.quantity_bottles === 'number' ? w.quantity_bottles : 0;
      var minTh = typeof w.minimum_threshold === 'number' ? w.minimum_threshold : 3;
      var st = w.status || (q === 0 ? 'out_of_stock' : (q <= minTh ? 'low_stock' : 'available'));
      var stBadge = getStatusBadge(st);
      var psBadge = '';
      if (w.purchaseStatus === 'ordered') {
        psBadge = '<span style="background:#854d0e;color:#fef3c7;padding:2px 8px;border-radius:9px;font-size:.68rem;font-weight:700;margin-left:6px;">📦 ' + t('IN ARRIVO','INCOMING','EN ROUTE','В ПУТИ') + '</span>';
      } else if (w.purchaseStatus === 'in_cellar') {
        psBadge = '<span style="background:#1e3a5f;color:#bfdbfe;padding:2px 8px;border-radius:9px;font-size:.68rem;margin-left:6px;">🏠 ' + t('IN CANTINA','IN CELLAR','EN CAVE','В ПОГРЕБЕ') + '</span>';
      }
      var grapes = Array.isArray(w.grapes) ? w.grapes.join(', ') : (w.grapes || '');
      var catK = categorizeWine(w);
      var catBadge = '<span style="font-size:.62rem;letter-spacing:.03em;color:#3f3f46;background:#f4f4f5;border:1px solid #e5e7eb;padding:2px 6px;border-radius:999px;white-space:nowrap;">' + getCatIcon(catK) + ' ' + getCatLabel(catK) + '</span>';
      var countryCell = (getWineCountry(w) === 'Italia' ? '🇮🇹 ' : (getWineCountry(w) === 'Francia' ? '🇫🇷 ' : '🌍 ')) + getWineRegion(w);
      var onListBadge = (w.onList === false)
        ? '<span style="display:inline-block;padding:3px 8px;font-family:Cinzel,serif;font-size:.55rem;letter-spacing:.08em;color:#64748b;background:rgba(100,116,139,.08);border-radius:3px;border:1px solid rgba(100,116,139,.25);cursor:pointer;user-select:none;" onclick="window.swDashToggleOnList && window.swDashToggleOnList(' + i + ')" title="Clicca per pubblicare nella carta dei vini">🔒 ' + t('RISERVA','RESERVE','RÉSERVE','РЕЗЕРВ') + '</span>'
        : '<span style="display:inline-block;padding:3px 8px;font-family:Cinzel,serif;font-size:.55rem;letter-spacing:.08em;color:#15803d;background:rgba(21,128,61,.08);border-radius:3px;border:1px solid rgba(21,128,61,.3);cursor:pointer;user-select:none;" onclick="window.swDashToggleOnList && window.swDashToggleOnList(' + i + ')" title="Clicca per nascondere dalla carta (Riserva)">✅ ' + t('IN CARTA','ON LIST','EN CARTE','В КАРТЕ') + '</span>';
      var url = getPurchaseUrl(w);
      var linkCell = url
        ? '<a href="' + url + '" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:3px;padding:3px 8px;border:1px solid #e5e7eb;border-radius:6px;color:#111827;background:#fff;font-size:.7rem;text-decoration:none;white-space:nowrap;" title="' + t('Apri link acquisto in nuova scheda','Open buy link in new tab','Ouvrir lien achat','Открыть ссылку покупки') + '">🔗 ' + t('Acquista','Buy','Acheter','Купить') + '</a>'
        : '<button type="button" class="sw-dash-row-btn" style="color:#a1a1aa;border-color:#e5e7eb;background:#fafafa;" onclick="window.swDashEditPurchaseUrl && window.swDashEditPurchaseUrl(' + i + ')" title="' + t('Aggiungi link acquisto','Add buy link','Ajouter lien achat','Добавить ссылку покупки') + '">＋ 🔗</button>';
      return '<tr data-idx="' + i + '"><td><strong>' + (w.wine_name || '—') + '</strong>' + psBadge + '<div class="sw-dash-muted">' + (w.producer || '') + (w.appellation ? ' · ' + w.appellation : '') + (grapes ? ' · ' + grapes : '') + '</div></td><td>' + (w.vintage || '—') + '</td><td>' + catBadge + '<div class="sw-dash-muted" style="font-size:.62rem;margin-top:3px;">' + wineTypeLabel(w.wine_type) + '</div></td><td style="white-space:nowrap;"><div style="font-size:.72rem;color:#3f3f46;">' + countryCell + '</div><div class="sw-dash-muted" style="font-size:.62rem;">' + getWineCountry(w) + '</div></td><td class="sw-dash-num">' + fmtMoney(w.price_sale || 0) + '</td><td style="text-align:right;white-space:nowrap;">' +
        (w.price_purchase && w.price_carta ?
          (function(){
            var mk = Math.round((w.price_carta - w.price_purchase) / w.price_purchase * 100);
            var col = mk >= 80 && mk <= 250 ? '#22c55e' : mk < 80 ? '#ef4444' : '#f59e0b';
            return '<span style="font-size:.72rem;font-weight:700;color:' + col + ';">+' + mk + '%</span>' +
                   (w.price_purchase ? '<div style="font-size:.65rem;color:rgba(245,239,226,.35);">acq. €' + w.price_purchase.toFixed(2) + '</div>' : '');
          })()
          : '<span style="color:rgba(245,239,226,.2);font-size:.72rem;">—</span>'
        ) +
      '</td><td class="sw-dash-num">' + q + '</td><td>' + stBadge + '</td><td>' + onListBadge + '</td><td>' + linkCell + '</td><td style="display:flex;gap:4px;flex-wrap:wrap;align-items:center;"><button class="sw-dash-row-btn" onclick="window.swDashAdjust && window.swDashAdjust(' + i + ')">✏️ ' + t('Modifica', 'Edit', 'Modifier', 'Изменить') + '</button> <button class="sw-dash-row-btn sw-dash-row-btn-danger" onclick="if(confirm(\''+t('Eliminare definitivamente ','Delete permanently ','Supprimer définitivement ','Удалить навсегда: ').replace(/'/g,'\\\'')+(w.wine_name||'vino').replace(/'/g,'\\\'')+' ?\')){ window.swDashDeleteRow && window.swDashDeleteRow(' + i + '); }">🗑️</button> <button class="sw-dash-row-btn sw-dash-row-btn-primary" onclick="window.swDashPrintOne && window.swDashPrintOne(' + i + ')">🖨️ ' + t('Scheda', 'Card', 'Fiche', 'Карточка') + '</button></td></tr>';
    }).filter(Boolean).join('') : '';

    return [
      importBox,
      filterBar,
      '<div class="sw-dash-panel">',
        '<div class="sw-dash-panel-head">',
          '<h3>' + t('Carta vini completa', 'Full wine list', 'Carte des vins complète', 'Полная винная карта') + '</h3>',
          '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">',
            '<button type="button" class="sw-dash-btn sw-dash-btn-ghost" style="padding:5px 10px;font-size:.72rem;color:#15803d;border-color:#bbf7d0;background:#f0fdf4;font-weight:700;" onclick="window.swOpenWineModal && window.swOpenWineModal({mode:\'add\'});">＋ ' + t('Aggiungi vino', 'Add wine', 'Ajouter vin', 'Добавить вино') + '</button>',
            '<button type="button" class="sw-dash-btn sw-dash-btn-ghost" style="padding:5px 10px;font-size:.72rem;" onclick="window.swDashExportInventory && window.swDashExportInventory()">⬇️ CSV</button>',
            '<a class="sw-dash-link" onclick="window.swDashboardGo && window.swDashboardGo(\'winecard\')">📖 ' + t('Vai a Carta da Stampare →', 'Go to Printable Wine List →', 'Aller à la carte imprimable →', 'К печатной Винной Карте →') + '</a>',
          '</div>',
        '</div>',
        '<div style="margin:0 -16px 14px;padding:12px 16px;background:#fafafa;border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;">',
          '<div style="font-family:Cinzel,serif;font-size:.62rem;letter-spacing:.2em;color:#6b7280;text-transform:uppercase;margin-bottom:6px;">🔍 ' + t('Cerca in inventario', 'Search inventory', 'Rechercher dans l\'inventaire', 'Поиск по инвентарю') + '</div>',
          '<div class="sw-dash-search-wrap" style="max-width:none;">',
            '<input type="search" id="swDashInvSearch" class="sw-dash-input" style="font-size:.92rem;padding:10px 12px;" placeholder="' + t('Cerca per nome, produttore, regione, annata, vitigno…', 'Search by name, producer, region, vintage, grapes…', 'Rechercher : nom, producteur, région, millésime…', 'Поиск: название, производитель, регион, год…') + '">',
          '</div>',
        '</div>',
        '<div class="sw-dash-table-wrap">',
          '<table class="sw-dash-table sw-dash-table-sticky">',
            '<thead><tr>',
              '<th style="min-width:240px;">' + t('Etichetta', 'Label', 'Étiquette', 'Этикетка') + '</th>',
              '<th>' + t('Annata', 'Vintage', 'Millésime', 'Год') + '</th>',
              '<th style="min-width:130px;">' + t('Categoria', 'Category', 'Catégorie', 'Категория') + '</th>',
              '<th>' + t('Regione / Paese', 'Region / Country', 'Région / Pays', 'Регион / Страна') + '</th>',
              '<th class="sw-dash-num">' + t('Prezzo', 'Price', 'Prix', 'Цена') + '</th>',
              '<th class="sw-dash-num">' + t('Markup', 'Markup', 'Markup', 'Наценка') + '</th>',
              '<th class="sw-dash-num" style="min-width:80px;">' + t('Giacenza', 'Stock', 'Stock', 'Остаток') + '</th>',
              '<th>Stato</th>',
              '<th style="min-width:110px;">' + t('Carta', 'List', 'Carte', 'Карта') + '</th>',
              '<th style="min-width:92px;">🔗 ' + t('Acquisto', 'Buy', 'Achat', 'Покупка') + '</th>',
              '<th style="min-width:160px;">' + t('Azioni', 'Actions', 'Actions', 'Действия') + '</th>',
            '</tr></thead>',
            '<tbody id="swDashInvBody">' + (rows || '<tr><td colspan="11" class="sw-dash-empty">' + t('Nessuna etichetta. Clicca "Aggiungi vino" per iniziare.', 'No labels yet. Click "Add wine" to start.', 'Aucune étiquette. Cliquez sur "Ajouter".', 'Нет этикеток. Нажмите "Добавить вино".') + '</td></tr>') + '</tbody>',
          '</table>',
        '</div>',
        (visible.length !== state.wines.length ? '<div style="padding:8px 12px;font-size:.72rem;color:#71717a;border-top:1px solid #f4f4f5;">' + t('Mostrate','Showing','Affichés','Показано') + ' ' + visible.length + ' / ' + state.wines.length + ' ' + t('vini · Filtro attivo','wines · Active filter','vins · Filtre actif','вин · Активный фильтр') + ': <strong style="color:#18181b;">' + getCatIcon(catFilter) + ' ' + getCatLabel(catFilter) + '</strong></div>' : ''),
      '</div>'
    ].join('');
  }

  window.swImportCatalogoMondo = function() {
    try {
      var already = {};
      (state.wines || []).forEach(function(w){
        if (!w || !w.wine_name) return;
        var k = (w.wine_name || '').toLowerCase().trim() + '||' + ((w.producer || '').toLowerCase().trim());
        already[k] = true;
      });

      var nuovi = [];

      try {
        if (typeof sampleWines === 'function') {
          var demo = sampleWines();
          demo.forEach(function(w){
            var k = ((w.wine_name||'').toLowerCase().trim()) + '||' + ((w.producer||'').toLowerCase().trim());
            if (!already[k]) { nuovi.push(Object.assign({}, w, { _id: (w._id || 'demo-import-') + '-' + Date.now() + '-' + Math.floor(Math.random()*10000), onList: false, imported_from_catalog: 'demo_v1', created_at: Date.now(), updated_at: Date.now() })); already[k]=true; }
          });
        }
      } catch(e) {}

      try {
        if (Array.isArray(window.CATALOGO_VINI_MONDO)) {
          var idx = 0;
          window.CATALOGO_VINI_MONDO.forEach(function(entry){
            idx += 1;
            if (!entry || !entry.name) return;
            var nm = String(entry.name || '').trim();
            var pr = String(entry.country === 'Italia' ? (entry.style || 'Cantina') : (entry.style || 'Cantina internazionale')).trim();
            var k = nm.toLowerCase().trim() + '||' + pr.toLowerCase().trim();
            if (already[k]) { k += '-cellar-' + idx; }
            already[k] = true;
            var grapesArr = (entry.grapes || '').split(/[,，、;]/).map(function(s){ return s.trim(); }).filter(Boolean);
            var tipo = '';
            var wt = '';
            var styleLow = (entry.style || '').toLowerCase();
            var nameLow = nm.toLowerCase();
            if (/champ|franciacorta|spum|prosecco|cava|bollicine|metodo classico|sparkling/.test(nameLow + ' ' + styleLow)) { tipo = 'bollicine'; wt = 'sparkling'; }
            else if (/rosato|rose|rosé/.test(nameLow + ' ' + styleLow)) { tipo = 'rosato'; wt = 'rose'; }
            else if (/bianco|white|blanc|weiss/.test(nameLow + ' ' + styleLow)) { tipo = 'bianco'; wt = 'white'; }
            else if (/dolce|passito|botryt|tokaj|sauterne|fortif|porto|sherry|vermouth/.test(nameLow + ' ' + styleLow)) { tipo = 'fortificato'; wt = 'fortified'; }
            else { tipo = 'rosso'; wt = 'red'; }
            var regionLine = [entry.region, entry.country].filter(Boolean).join(', ');
            var noteTerroir = (entry.note || '').trim() || regionLine || '';
            var appellation = (entry.region || '').trim() || nm;
            var slug = nm.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').substring(0,48) || ('cat-' + idx);
            nuovi.push({
              _id: 'catimp-' + slug + '-' + Date.now() + '-' + idx,
              wine_name: nm,
              wine_type: wt,
              tipo: tipo,
              cuvée: '',
              cuvee: '',
              producer: pr,
              appellation: appellation,
              regione: entry.region || '',
              region: entry.region || '',
              country: entry.country || '',
              nazione: entry.country || '',
              village: '',
              frazione: '',
              vintage: 's.a.',
              grapes: grapesArr,
              vitigni: grapesArr.slice(),
              metodo_spumante: wt === 'sparkling' ? 'Metodo Classico' : '',
              sparkling_method: '',
              sur_lie_mesi: 0,
              mesi_sur_lie: 0,
              dosaggio: '',
              lieviti: '',
              yeast: '',
              coltivazione: '',
              farming: '',
              piede_franco: false,
              certificazioni: [],
              certifications: [],
              price_sale: 0,
              prezzo_listino: 0,
              quantity_bottles: 0,
              minimum_threshold: 3,
              onList: false,
              affinamento: '',
              note_terroir: noteTerroir,
              purchase_url: '',
              status: 'available',
              imported_from_catalog: 'world_v1',
              catalog_id: entry.id || ('cellar_' + idx),
              created_at: Date.now(),
              updated_at: Date.now()
            });
          });
        }
      } catch(e) {}

      if (!nuovi.length) {
        alert(t('Nessun nuovo vino da importare (tutti già presenti in Inventario).', 'No new wines to import (all already in Inventory).', 'Aucun vin nouveau (tous déjà dans l\'Inventaire).', 'Нет новых вин для импорта (все уже в Инвентаре).'));
        return;
      }

      if (!confirm(t('Importare ' + nuovi.length + ' vini dal Catalogo Mondo nel tuo Inventario? Saranno aggiunti in stato RISERVA (non in Carta PDF). Confermi?', 'Import ' + nuovi.length + ' World Catalog wines into your Inventory? They will be added in RESERVE state (not on PDF list). Confirm?', 'Importer ' + nuovi.length + ' vins du Catalogue Mondial dans l\'Inventaire ? Ajoutés en état RÉSERVE (pas sur la carte PDF). Confirmer ?', 'Импортировать ' + nuovi.length + ' вин из Мирового Каталога в Инвентарь? Будут добавлены со статусом РЕЗЕРВ (не в PDF-карте). Подтвердить?'))) {
        return;
      }

      state.wines = (state.wines || []).concat(nuovi);
      try {
        var saveKey = 'swl_wines_' + (state.restaurantSlug || 'demo');
        localStorage.setItem(saveKey, JSON.stringify(state.wines));
      } catch(e) {}

      if (state.restaurant && typeof state.restaurant.wines === 'number') {
        state.restaurant.wines = state.wines.length;
        try {
          var meta = getRestaurantMeta(state.restaurantSlug);
          meta.wines = state.wines.length;
          saveRest(meta);
        } catch(e) {}
      }

      var recalcOK = false;
      try { if (typeof recalcTotals === 'function') { recalcTotals(); recalcOK = true; } } catch(e) {}
      setTimeout(function(){
        renderDashboard();
        alert('✅ ' + t('Import completato! Aggiunti ' + nuovi.length + ' vini dal Catalogo Mondo in Inventario (stato RISERVA). Abilita "In Carta" per ogni vino che vuoi visualizzare nella Carta PDF pubblica.', 'Import complete! Added ' + nuovi.length + ' World Catalog wines to Inventory (RESERVE state). Enable "On List" for each wine you want on the public PDF Wine List.', 'Import terminé ! Ajout de ' + nuovi.length + ' vins du Catalogue Mondial dans l\'Inventaire (état RÉSERVE). Activez "En Carte" pour chaque vin que vous voulez voir sur la carte PDF publique.', 'Импорт завершён! Добавлено ' + nuovi.length + ' вин из Мирового Каталога в Инвентарь (статус РЕЗЕРВ). Включите «В карте» для каждого вина, которое хотите видеть в публичной PDF-карте.'));
      }, recalcOK ? 120 : 0);

    } catch(err) {
      console.error(err);
      alert('❌ ' + t('Errore durante l\'import. Riprova più tardi.', 'Error during import. Please try again.', 'Erreur pendant l\'import. Réessayez.', 'Ошибка при импорте. Попробуйте позже.') + '\n' + (err && err.message ? err.message : ''));
    }
  };

  /* ===================== ORDINI ===================== */
  function buildOrders() {
    var rows = state.orders.map(function(o){
      var items = o.items.map(function(it){ return it.qty + '× ' + it.wine; }).join(', ');
      var status = o.status === 'paid' ? '<span class="sw-dash-badge sw-dash-badge-green">' + t('Pagato', 'Paid', 'Payé', 'Оплачен') + '</span>' : '<span class="sw-dash-badge sw-dash-badge-orange">' + t('In attesa', 'Pending', 'En attente', 'В ожидании') + '</span>';
      return '<tr><td><strong>' + o.id + '</strong><div class="sw-dash-muted">' + fmtDate(o.createdAt) + (o.table ? ' · ' + o.table : '') + (o.server ? ' · ' + o.server : '') + (o.customer ? ' · ' + o.customer : '') + '</div></td><td>' + items + '</td><td>' + (o.channel || '—') + '</td><td class="sw-dash-num">' + fmtMoney(o.total || 0) + '</td><td>' + status + '</td></tr>';
    }).join('');

    var summary = [
      statCard('🧾', t('Ordini totali', 'Total orders', 'Total commandes', 'Всего заказов'), String(state.orders.length), t('nel periodo', 'in period', 'dans la période', 'за период'), 'tone-gold'),
      statCard('🍷', t('Bottiglie vendute', 'Bottles sold', 'Bouteilles vendues', 'Бутылок продано'), String(state.totals.soldCount), t('pezzi', 'items', 'pièces', 'шт.'), 'tone-wine'),
      statCard('💶', t('Ricavi totali', 'Total revenue', 'Revenu total', 'Доход'), fmtMoney(state.totals.soldValue), t('lordi', 'gross', 'bruts', 'валовые'), 'tone-green')
    ].join('');

    return [
      '<div class="sw-dash-stats-grid">' + summary + '</div>',
      '<div class="sw-dash-panel">',
        '<div class="sw-dash-panel-head"><h3>' + t('Registro ordini', 'Orders register', 'Registre des commandes', 'Журнал заказов') + '</h3></div>',
        '<div class="sw-dash-table-wrap">',
          '<table class="sw-dash-table"><thead><tr><th>' + t('Ordine', 'Order', 'Commande', 'Заказ') + '</th><th>' + t('Vini', 'Wines', 'Vins', 'Вина') + '</th><th>' + t('Canale', 'Channel', 'Canal', 'Канал') + '</th><th class="sw-dash-num">' + t('Totale', 'Total', 'Total', 'Итого') + '</th><th>Stato</th></tr></thead><tbody>' + rows + '</tbody></table>',
        '</div>',
      '</div>'
    ].join('');
  }

  /* ===================== CONTABILITÀ ===================== */
  function buildAccounting() {
    var invCost = state.totals.inventoryValue * 0.55;
    var margin = state.totals.soldValue * 0.62;
    var cards = [
      statCard('💶', t('Fatturato', 'Revenue', 'Chiffre d\'affaires', 'Выручка'), fmtMoney(state.totals.soldValue), t('vendite registrate', 'recorded sales', 'ventes enregistrées', 'зарегистрированные продажи'), 'tone-gold'),
      statCard('📈', t('Margine medio', 'Avg margin', 'Marge moyenne', 'Маржа'), fmtMoney(margin), '62% ' + t('su vendite', 'on sales', 'sur ventes', 'от продаж'), ''),
      statCard('📦', t('COGS stimato', 'Est. COGS', 'Coût estimé', 'Себестоимость'), fmtMoney(state.totals.soldValue - margin), t('costo vini venduti', 'cost of sold wines', 'coût vins vendus', 'стоимость проданных вин'), ''),
      statCard('🏛️', t('Inventario a costo', 'Inventory at cost', 'Inventaire au coût', 'Запасы по себестоим.'), fmtMoney(invCost), t('in giacenza', 'in stock', 'en stock', 'на складе'), 'tone-green')
    ].join('');

    var months = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
    var chartBars = '';
    var nowM = new Date().getMonth();
    for (var m = 0; m < 6; m++) {
      var idx = (nowM - 5 + m + 12) % 12;
      var val = 4000 + Math.round(2000 * Math.sin(m * 0.9) + Math.random() * 2500);
      var h = Math.round(40 + (val / 9000) * 140);
      chartBars += '<div class="sw-dash-chart-col"><div class="sw-dash-chart-bar" style="height:' + h + 'px" title="' + fmtMoney(val) + '"></div><div class="sw-dash-chart-label">' + months[idx] + '</div></div>';
    }

    return [
      '<div class="sw-dash-stats-grid">' + cards + '</div>',
      '<div class="sw-dash-grid-2">',
        '<section class="sw-dash-panel">',
          '<div class="sw-dash-panel-head"><h3>' + t('Andamento ricavi ultimi 6 mesi', 'Revenue last 6 months', 'Revenus 6 derniers mois', 'Доходы за 6 месяцев') + '</h3></div>',
          '<div class="sw-dash-chart">' + chartBars + '</div>',
        '</section>',
        '<section class="sw-dash-panel">',
          '<div class="sw-dash-panel-head"><h3>' + t('Riepilogo veloce', 'Quick summary', 'Résumé rapide', 'Краткая сводка') + '</h3></div>',
          '<ul class="sw-dash-list">',
            '<li><span>' + t('Totale ricavi', 'Total revenue', 'Revenu total', 'Общая выручка') + '</span><strong>' + fmtMoney(state.totals.soldValue) + '</strong></li>',
            '<li><span>' + t('Meno costi vini (38%)', 'Minus wine cost (38%)', 'Moins coût vins (38%)', 'Минус себестоимость (38%)') + '</span><strong class="sw-dash-neg">- ' + fmtMoney(state.totals.soldValue * 0.38) + '</strong></li>',
            '<li class="sw-dash-list-total"><span>' + t('Utile lordo', 'Gross profit', 'Bénéfice brut', 'Валовая прибыль') + '</span><strong>' + fmtMoney(state.totals.soldValue * 0.62) + '</strong></li>',
            '<li><span>' + t('Costi sala (staff & ut.)', 'Room costs (staff & utils)', 'Coûts salle (perso & utilitaires)', 'Расходы зал (персонал и комуналка)') + '</span><strong class="sw-dash-neg">- ' + fmtMoney(state.totals.soldValue * 0.28) + '</strong></li>',
            '<li class="sw-dash-list-total"><span>' + t('Utile netto stimato', 'Est. net profit', 'Bénéfice net estimé', 'Чистая прибыль (оценка)') + '</span><strong>' + fmtMoney(state.totals.soldValue * 0.34) + '</strong></li>',
          '</ul>',
        '</section>',
      '</div>'
    ].join('');
  }

  /* ===================== MOVIMENTI ===================== */
  function buildMovements() {
    var rows = state.movements.map(function(m){
      var dt = fmtDate(m.at);
      var delta = (m.quantity_delta || 0);
      var sign = delta >= 0 ? '+' : '';
      var deltaClass = delta >= 0 ? 'sw-dash-pos' : 'sw-dash-neg';
      var tpLbl = typeof m.movement_label === 'object' ? t(m.movement_label.it, m.movement_label.en, m.movement_label.fr, m.movement_label.ru) : (m.movement_label || m.movement_type || '');
      return '<tr><td>' + dt + '</td><td><span class="sw-dash-pill">' + tpLbl + '</span></td><td><strong>' + (m.wine || '—') + '</strong><div class="sw-dash-muted">' + (m.producer || '') + (m.reason ? ' · ' + m.reason : '') + (m.reference_code ? ' · rif. ' + m.reference_code : '') + '</div></td><td>' + (m.source || '') + '</td><td class="sw-dash-num ' + deltaClass + '">' + sign + delta + '</td></tr>';
    }).join('');

    return [
      '<div class="sw-dash-panel">',
        '<div class="sw-dash-panel-head">',
          '<h3>' + t('Registro movimenti inventario', 'Inventory movements log', 'Journal des mouvements', 'Журнал движений инвентаря') + '</h3>',
          '<div class="sw-dash-search-wrap">',
            '<input type="search" id="swDashMovSearch" class="sw-dash-input" placeholder="' + t('Cerca movimenti…', 'Search movements…', 'Rechercher…', 'Поиск движений…') + '">',
          '</div>',
        '</div>',
        '<div class="sw-dash-table-wrap">',
          '<table class="sw-dash-table sw-dash-table-sticky"><thead><tr>',
            '<th>' + t('Data', 'Date', 'Date', 'Дата') + '</th>',
            '<th>' + t('Tipo', 'Type', 'Type', 'Тип') + '</th>',
            '<th>' + t('Dettaglio', 'Detail', 'Détail', 'Детали') + '</th>',
            '<th>' + t('Fonte', 'Source', 'Source', 'Источник') + '</th>',
            '<th class="sw-dash-num">Qtà Δ</th>',
          '</tr></thead><tbody>' + rows + '</tbody></table>',
        '</div>',
      '</div>'
    ].join('');
  }

  /* ===================== SUPER ADMIN - GESTIONE CANTINE & RISTORANTI ===================== */
  function buildSuperAdmin() {
    var rows = state.restaurants.map(function(r, i){
      var planBadge = r.plan === 'elite' ? '<span class="sw-dash-badge sw-dash-badge-gray">' + t('ELITE', 'ELITE', 'ÉLITE', 'ELITE') + '</span>' :
                     (r.plan === 'pro' ? '<span class="sw-dash-badge sw-dash-badge-blue">' + t('PRO', 'PRO', 'PRO', 'PRO') + '</span>' :
                                           '<span class="sw-dash-badge sw-dash-badge-green">' + t('START', 'START', 'START', 'START') + '</span>');
      var pub = r.public_card === true
        ? '<span style="display:inline-block;padding:3px 8px;font-family:Cinzel,serif;font-size:.52rem;letter-spacing:.12em;color:#15803d;background:rgba(21,128,61,.08);border-radius:3px;border:1px solid rgba(21,128,61,.3);cursor:pointer;user-select:none;" onclick="window.swDashTogglePublicCard && window.swDashTogglePublicCard(\'' + r.slug + '\')" title="Clicca per rendere PRIVATA">✅ ' + t('ONLINE','ONLINE','EN LIGNE','ОНЛАЙН') + '</span>'
        : '<span style="display:inline-block;padding:3px 8px;font-family:Cinzel,serif;font-size:.52rem;letter-spacing:.12em;color:#64748b;background:rgba(100,116,139,.08);border-radius:3px;border:1px solid rgba(100,116,139,.25);cursor:pointer;user-select:none;" onclick="window.swDashTogglePublicCard && window.swDashTogglePublicCard(\'' + r.slug + '\')" title="Clicca per pubblicare la carta online">🔒 ' + t('PRIVATA','PRIVATE','PRIVÉ','ПРИВАТ') + '</span>';
      return [
        '<div class="sw-r-row">',
          '<div class="sw-r-avatar">' + r.name.substring(0,1).toUpperCase() + '</div>',
          '<div>',
            '<div class="sw-r-name">' + r.name + '</div>',
            '<div class="sw-r-slug">' + r.slug + ' · ' + (r.email || t('email non impostata','no email set','email non définie','email не указан')) + '</div>',
          '</div>',
          '<div class="sw-r-plan">' + planBadge + '</div>',
          '<div class="sw-r-n">' + pub + '</div>',
          '<div class="sw-r-n">' + r.wines + ' vini</div>',
          '<div style="display:flex;gap:6px;justify-content:flex-end;">',
            '<button class="sw-dash-row-btn" onclick="window.swDashImpersonate && window.swDashImpersonate(\'' + r.slug + '\')">🔑 ' + t('Entra', 'Enter', 'Entrer', 'Войти') + '</button>',
            '<button class="sw-dash-row-btn" onclick="window.open(\'/r/' + r.slug + '\',\'_blank\');">🔗 ' + t('Carta','List','Carte','Карточка') + '</button>',
          '</div>',
        '</div>'
      ].join('');
    }).join('');

    var headCards = [
      statCard('🏢', t('Cantine / Ristoranti attivi', 'Active Cellars / Restaurants', 'Caves / Restaurants actifs', 'Активные рестораны / винодельни'), String(state.restaurants.length), t('gestiti in piattaforma', 'managed on platform', 'gérés sur la plateforme', 'под управлением платформы'), 'tone-wine'),
      statCard('🌐', t('Carte ONLINE', 'Cards ONLINE', 'Cartes EN LIGNE', 'Карты ОНЛАЙН'), String(state.restaurants.filter(function(r){return r.public_card===true;}).length), t('visibili in homepage','visible on homepage','visibles sur l\'accueil','видны на главной'), 'tone-green'),
      statCard('💎', t('Piano ELITE', 'ELITE Plan', 'Plan ÉLITE', 'Тариф ELITE'), String(state.restaurants.filter(function(r){return r.plan==='elite';}).length), t('clienti top', 'top clients', 'clients top', 'топ клиенты'), 'tone-gold'),
      statCard('🍇', t('Piano PRO', 'PRO Plan', 'Plan PRO', 'Тариф PRO'), String(state.restaurants.filter(function(r){return r.plan==='pro';}).length), '', 'tone-orange')
    ].join('');

    var privacyAdmin = [
      '<div class="sw-dash-privacy-card" style="background:linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%);border-color:#bfdbfe;">',
        '<div class="sw-dash-privacy-title" style="color:#1e40af;">🛡️ ' + t('Super Admin — Guida Multi-Tenant', 'Super Admin — Multi-Tenant Guide', 'Super Admin — Guide Multi-Tenant', 'Супер Админ — Гид Мульти-Тенант') + '</div>',
        '<p style="color:#1e40af;">' +
          t('<strong>Ogni area personale è ISOLATA.</strong> Quando crei un nuovo ristorante, assegni SLUG, PIANO e credenziali: quel ristorante NON vede nessun altro. Noi (SW) come Super Admin possiamo solo <em>impersonare</em> (entrare "come se fossimo loro") per supporto tecnico o onboarding.',
          '<strong>Each private area is ISOLATED.</strong> When you create a new restaurant, you assign SLUG, PLAN and credentials: that restaurant CANNOT see any other. We (SW) as Super Admin can only <em>impersonate</em> (enter "as them") for technical support or onboarding.',
          '<strong>Chaque espace privé est ISOLÉ.</strong> Quand vous créez un nouveau restaurant, vous attribuez SLUG, PLAN et identifiants : ce restaurant ne peut VOIR aucun autre. Nous (SW) en tant que Super Admin ne pouvons que <em>nous incarner</em> (entrer "comme si nous étions eux") pour le support technique ou l\'onboarding.',
          '<strong>Каждая личная область ИЗОЛИРОВАНА.</strong> При создании нового ресторана вы назначаете SLUG, ТАРИФ и учётные данные: этот ресторан НЕ видит никакого другого. Мы (SW) как Супер Админ можем только <em>имперсонировать</em> (входить "как будто это они") для технической поддержки или онбординга.') +
        '</p>',
        '<p style="color:#1e3a8a;">' +
          t('Per <strong>100 ristoranti</strong>: mantieni slug parlanti (es. <code>osteria-rossini-torino</code>), usa password univoche, e aggiorna il piano man mano che crescono. Il KV di Cloudflare supporta migliaia di namespace separati senza problemi.',
          'For <strong>100 restaurants</strong>: keep meaningful slugs (e.g. <code>osteria-rossini-torino</code>), use unique passwords, and upgrade the plan as they grow. Cloudflare KV supports thousands of separate namespaces with no issues.',
          'Pour <strong>100 restaurants</strong> : gardez des slugs parlants (ex. <code>osteria-rossini-torino</code>), utilisez des mots de passe uniques et améliorez le plan au fur et à mesure. Le KV de Cloudflare prend en charge des milliers d\'espaces de noms sans problème.',
          'Для <strong>100 ресторанов</strong>: сохраняйте говорящие слаги (например <code>osteria-rossini-torino</code>), используйте уникальные пароли и повышайте тариф по мере роста. KV Cloudflare без проблем поддерживает тысячи отдельных namespace.') +
        '</p>',
      '</div>'
    ].join('');

    return [
      privacyAdmin,
      '<div class="sw-dash-stats-grid">' + headCards + '</div>',
      '<div class="sw-dash-panel">',
        '<div class="sw-dash-panel-head">',
          '<h3>' + t('Elenco Aree Personali: Cantine & Ristoranti', 'Private Areas List: Cellars & Restaurants', 'Liste des Espaces Privés: Caves & Restaurants', 'Список Личных Кабинетов: Винодельни & Рестораны') + ' (' + state.restaurants.length + ')</h3>',
          '<div style="display:flex;gap:8px;flex-wrap:wrap;">',
            '<button type="button" id="swDashNewRest" class="sw-dash-btn sw-dash-btn-primary" style="padding:6px 12px;font-size:.72rem;">＋ ' + t('Nuova Cantina/Ristorante', 'New Cellar/Restaurant', 'Nouvelle Cave/Restaurant', 'Новая Винодельня/Ресторан') + '</button>',
          '</div>',
        '</div>',
        '<div style="padding:12px 16px;background:#fafafa;border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;">',
          '<div style="font-family:Cinzel,serif;font-size:.62rem;letter-spacing:.2em;color:#6b7280;text-transform:uppercase;margin-bottom:6px;">📝 ' + t('Spunta Carta ONLINE', 'Toggle ONLINE Card', 'Basculer Carte EN LIGNE', 'Переключить Карту ОНЛАЙН') + '</div>',
          '<div style="font-size:.75rem;color:#52525b;">' +
            t('Il flag <strong>✅ ONLINE</strong> = la carta viene mostrata nella HOMEPAGE pubblica, cercabile e linkabile. <strong>🔒 PRIVATA</strong> = solo i gestori la vedono (Area Personale / QR del ristorante).',
            'The <strong>✅ ONLINE</strong> flag = the card appears in the public HOMEPAGE, searchable & linkable. <strong>🔒 PRIVATE</strong> = only managers see it (Private Area / restaurant QR).',
            'Le drapeau <strong>✅ EN LIGNE</strong> = la carte apparaît sur la HOMEPAGE publique, consultable et partageable. <strong>🔒 PRIVÉ</strong> = seuls les gestionnaires la voient (Espace privé / QR restaurant).',
            'Флаг <strong>✅ ОНЛАЙН</strong> = карта появляется на публичной ГЛАВНОЙ, доступна для поиска и ссылки. <strong>🔒 ПРИВАТ</strong> = её видят только менеджеры (Личный кабинет / QR ресторана).') +
          '</div>',
        '</div>',
        '<div class="sw-dash-table-wrap sw-dash-restaurant-list">' + rows + '</div>',
      '</div>'
    ].join('');
  }

  /* =======================================================
     EVENTS BIND
     ======================================================= */
  function bindDashboardEvents() {
    var tog = document.getElementById('swDashToggle');
    if (tog) tog.addEventListener('click', toggleSidebar);
    document.querySelectorAll('.sw-dash-nav-item').forEach(function(el){
      el.addEventListener('click', function(){
        var sec = el.getAttribute('data-section');
        if (sec) goSection(sec);
      });
    });
    var lo = document.getElementById('swDashLogout');
    if (lo) lo.addEventListener('click', function(e){ e.preventDefault(); doLogout(); });

    var newOrd = document.getElementById('swDashNewOrder');
    if (newOrd) newOrd.addEventListener('click', function(){ alert(t('Funzione in arrivo', 'Coming soon', 'Bientôt disponible', 'Скоро будет')); });
    var addWine = document.getElementById('swDashAddWine');
    if (addWine) addWine.addEventListener('click', function(){
      window.swOpenWineModal && window.swOpenWineModal({ mode: 'add' });
    });
    var newRest = document.getElementById('swDashNewRest');
    if (newRest) newRest.addEventListener('click', function(){
      var slug = prompt(t('Slug ristorante (minuscole, trattini):', 'Restaurant slug (lowercase, hyphens):', 'Slug restaurant (minuscules, tirets):', 'Слаг ресторана (маленькие буквы, дефисы):'), 'nuovo-ristorante');
      if (slug) {
        var nm = prompt(t('Nome ristorante:', 'Restaurant name:', 'Nom du restaurant :', 'Название ресторана:'), slug.replace(/-/g,' '));
        if (nm) {
          state.restaurants.unshift({ slug: slug, name: nm, plan: 'start', wines: 0, currency: 'EUR', email: '' });
          renderDashboard();
        }
      }
    });
    var goAdm = document.getElementById('swDashGoAdmin');
    if (goAdm) goAdm.addEventListener('click', function(){ goSection('admin'); });

    var invSearch = document.getElementById('swDashInvSearch');
    if (invSearch) invSearch.addEventListener('input', filterInventory);
    var movSearch = document.getElementById('swDashMovSearch');
    if (movSearch) movSearch.addEventListener('input', function(ev){
      var q = (ev.target.value || '').toLowerCase().trim();
      var trs = document.querySelectorAll('#page-dashboard .sw-dash-table tbody tr');
      trs.forEach(function(tr){
        var txt = tr.innerText.toLowerCase();
        tr.style.display = !q || txt.indexOf(q) >= 0 ? '' : 'none';
      });
    });
    var cardSearch = document.getElementById('swDashCardSearch');
    if (cardSearch) cardSearch.addEventListener('input', function(ev){
      var q = (ev.target.value || '').toLowerCase().trim();
      var sections = document.querySelectorAll('#page-dashboard .sw-dash-winecard-section');
      sections.forEach(function(sec){
        var secHasMatch = false;
        var regionHeaders = sec.querySelectorAll('[data-region], .sw-wc-row');
        var rows = sec.querySelectorAll('.sw-wc-row');
        rows.forEach(function(row){
          var txt = row.innerText.toLowerCase();
          var match = !q || txt.indexOf(q) >= 0;
          row.style.display = match ? '' : 'none';
          if (match) secHasMatch = true;
        });
        var prev = null;
        sec.querySelectorAll(':scope > div').forEach(function(child){
          if (child.classList && child.classList.contains('sw-wc-row')) {
            if (prev && prev._regionHeader) {
              prev.style.display = child.style.display === 'none' ? 'none' : '';
            }
            prev = child;
            prev._regionHeader = false;
          } else {
            prev = child;
            prev._regionHeader = true;
          }
        });
        sec.style.display = secHasMatch || !q ? '' : 'none';
        var title = sec.querySelector('h3');
        if (title) title.closest('.sw-dash-winecard-section') && (sec.style.display = secHasMatch || !q ? '' : 'none');
      });
    });
    var cardAddWine = document.getElementById('swDashCardAddWine');
    if (cardAddWine) cardAddWine.addEventListener('click', function(){
      window.swOpenWineModal && window.swOpenWineModal({ mode: 'add' });
    });

    var cardPrint1 = document.getElementById('swDashCardPrint');
    var cardPrint2 = document.getElementById('swDashCardPrint2');
    if (cardPrint1) cardPrint1.addEventListener('click', printWineCard);
    if (cardPrint2) cardPrint2.addEventListener('click', printWineCard);
    var cardPdf = document.getElementById('swDashCardPdf');
    if (cardPdf) cardPdf.addEventListener('click', function(){ window.swDashGeneratePdf && window.swDashGeneratePdf(); });
    var jumpList = document.getElementById('swDashJumpList');
    if (jumpList) jumpList.addEventListener('click', function(){ goSection('admin'); });
  }
  function filterInventory(ev) {
    var q = (ev.target.value || '').toLowerCase().trim();
    var tbody = document.getElementById('swDashInvBody');
    if (!tbody) return;
    var trs = tbody.querySelectorAll('tr');
    trs.forEach(function(tr){
      var txt = tr.innerText.toLowerCase();
      tr.style.display = !q || txt.indexOf(q) >= 0 ? '' : 'none';
    });
  }
  function toggleSidebar() {
    state.collapsed = !state.collapsed;
    renderDashboard();
  }
  function goSection(sec) {
    state.activeSection = sec;
    renderDashboard();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function printWineCard() {
    window.print();
  }

  /* =======================================================
     GLOBALS
     ======================================================= */
  window.loadDashboard = initDashboard;
  window.swDashboardGo = goSection;
  window.swDashboardToggle = toggleSidebar;
  window.swDashAdjust = function(i) {
    window.swOpenWineModal && window.swOpenWineModal({ mode:'edit', index:i|0 });
  };
  window.swDashDeleteRow = function(i) {
    i = i|0;
    var w = state.wines[i];
    if (!w) return;
    var nome = (w.wine_name || 'vino') + (w.vintage ? ' ('+w.vintage+')' : '');
    if (!confirm(t('Eliminare definitivamente: ','Delete permanently: ','Supprimer définitivement : ','Удалить навсегда: ') + nome + ' ?')) return;
    state.wines.splice(i, 1);
    saveState();
    computeTotals();
    renderDashboard();
  };
  /* stile bottone danger inline per sw-dash-row-btn-danger */
  (function(){
    if (document.getElementById('sw-btn-danger-css')) return;
    var s = document.createElement('style'); s.id='sw-btn-danger-css';
    s.textContent = '.sw-dash-row-btn-danger{border:1px solid #fecaca !important;color:#b91c1c !important;background:#fff !important;} .sw-dash-row-btn-danger:hover{background:#fef2f2 !important;}';
    (document.head || document.getElementsByTagName('head')[0]).appendChild(s);
  })();
  window.swDashPrintOne = function(i) {
    var w = state.wines[i|0];
    if (!w) return;
    alert(t('Scheda etichetta: ', 'Label card: ', 'Fiche étiquette : ', 'Карточка этикетки: ') + (w.wine_name || '') + ' ' + (w.vintage || '') + ' - ' + t('Funzione in arrivo', 'coming soon', 'bientôt', 'скоро'));
  };
  window.swDashToggleOnList = function(i) {
    var w = state.wines[i|0];
    if (!w) return;
    // Default: onList = true. Se esplicitamente false → diventa true, altrimenti false
    w.onList = (w.onList === false) ? true : false;
    // Mantieni coerente lo stato acquisto
    if (w.onList) w.purchaseStatus = 'on_list';
    else if (!w.purchaseStatus || w.purchaseStatus === 'on_list') w.purchaseStatus = 'in_cellar';
    try {
      var key = 'swl_wines_' + (state.restaurantSlug || 'demo');
      localStorage.setItem(key, JSON.stringify(state.wines));
    } catch(e){}
    renderDashboard();
  };
  window.swDashImpersonate = function(slug) {
    if (!state.isSuperAdmin) return;
    state.restaurantSlug = slug;
    state.isSuperAdmin = true;
    setSession({ slug: slug, email: state.session && state.session.email ? state.session.email : 'admin@sommelierworld.vin', at: Date.now(), superAdmin: true, plan: 'owner', impersonating: true });
    Promise.all([
      loadRestaurant().catch(function(){}),
      loadPublicWines().catch(function(){}),
      loadMovements().catch(function(){})
    ]).then(function(){
      generateSampleOrders();
      state.activeSection = 'overview';
      renderDashboard();
    });
  };

  window.swDashTogglePublicCard = function(slug) {
    if (!state.isSuperAdmin || !slug) return;
    var r = state.restaurants.find(function(x){ return x.slug === slug; });
    if (!r) return;
    r.public_card = !(r.public_card === true);
    try {
      var rkey = 'swl_restaurant_' + slug;
      var raw = LS().getItem(rkey);
      if (raw) { try { var rr = JSON.parse(raw); rr.public_card = r.public_card; LS().setItem(rkey, JSON.stringify(rr)); } catch(e){} }
    } catch(e){}
    saveState();
    renderDashboard();
  };

  window.swDashToggleMyPublicCard = function(checked) {
    var slug = state.restaurantSlug || '';
    if (!slug) return;
    var r = state.restaurants.find(function(x){ return x.slug === slug; });
    if (!r) {
      r = getRestaurantMeta(slug);
      state.restaurants.push(Object.assign({}, r, { public_card: !!checked }));
    } else {
      r.public_card = !!checked;
    }
    if (state.restaurant) state.restaurant.public_card = !!checked;
    try {
      var rkey = 'swl_restaurant_' + slug;
      var raw = LS().getItem(rkey);
      try {
        var rr = raw ? JSON.parse(raw) : Object.assign({}, r);
        rr.public_card = !!checked;
        LS().setItem(rkey, JSON.stringify(rr));
      } catch(e){}
    } catch(e){}
    saveState();
    renderDashboard();
  };

  /* HASH ROUTING veloce per entrare nel dashboard */
  var _dashboardInited = false;
  function ensureRoute() {
    var h = (window.location.hash || '').toLowerCase();
    var dashPage = document.getElementById('page-dashboard');
    var regPage = document.getElementById('page-register');
    if (h === '#dashboard' && dashPage) {
      if (window.showPage) window.showPage('dashboard');
      if (!_dashboardInited) {
        _dashboardInited = true;
        initDashboard();
      }
    } else if (h === '#register' && regPage) {
      if (window.showPage) window.showPage('register');
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    ensureRoute();
    var p = document.getElementById('page-dashboard');
    if (p && p.classList.contains('active')) initDashboard();
  });
  window.addEventListener('hashchange', ensureRoute);


  // /* SW-WIZARD-CSS-FIX */
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



  // /* SW-WIZARD-SETTERS-FIX */
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



  // /* SW-WIZ-BG */
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

})();
/* v17 cache bust - inventory onList toggle + Carta column header */
