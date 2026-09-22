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
    var sortKey = state.ui && state.ui.sort ? state.ui.sort : 'name-asc';
    wines = sortWines(wines, sortKey);

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
      function drawWineCard4Rows(w) {
        /* ===== SCHEMA 4 RIGHE COME ESEMPIO UTENTE =====:
           1. Produttore (Frazione, Regione)
           2. Nome Cuvée  [dosaggio/badge]  Annata  € 299
           3. Vitigni · Metodo Classico · sur lie 96 mesi
           4. Coltivazione: Etica  ·  Lieviti: Indigeni
        */
        ensureSpace(52);
        var badges = getWineBadges(w);
        var x = colX();
        /* riga 1: produttore (frazione, regione) — con eventuale badge icona */
        var badgeOffset = 0;
        if (badges && badges.length) {
          var icone = (badges[0] === 'bio'?'🍃':badges[0] === 'biodinamico'?'🪨':badges[0] === 'etico'?'⚖️':badges[0] === 'piede_franco'?'🍇':badges[0] === 'anfora'?'🏺':badges[0] === 'triplea'?'🏅':badges[0] === 'relais_chateaux'?'🏨':'');
          if (icone) {
            doc.fontSize(10).fillColor('#0f172a').text(icone, x, colState.y + 1, { width: 12, continued: false });
            badgeOffset = 14;
          }
        }
        var prod = (w.producer || '').trim();
        var frac = getWineFrazione(w);
        var reg  = getWineRegion(w);
        var r1 = prod;
        var meta = [];
        if (frac) meta.push(frac);
        else if (reg) meta.push(reg);
        if (frac && reg && frac.toLowerCase().indexOf(reg.toLowerCase()) < 0) meta.push(reg);
        if (meta.length) r1 += prod ? ('  (' + meta.join(', ') + ')') : (meta.join(', '));
        if (r1) {
          doc.fontSize(10.5).font('Helvetica-Bold').fillColor('#0f172a').text(r1, x + badgeOffset, colState.y, { width: COL_W - badgeOffset });
          colState.y += 13;
        } else { colState.y += 8; }

        /* riga 2: Nome Cuvée [badge dosaggio] Annata € PREZZO (a 2 colonne con prezzo a dx) */
        var cuv = getWineCuvee(w) || (w.wine_name || '').trim();
        var dos = (w.dosaggio || '').trim();
        var ann = (w.vintage || '').trim();
        var prezzo = typeof w.price_sale === 'number' ? w.price_sale : 0;
        var leftStr = cuv || t('Etichetta','Label','Étiquette','Этикетка');
        if (dos) leftStr += '   [' + dos + ']';
        if (ann) leftStr += '   ' + String(ann);
        /* badgini altri nella riga */
        var altreIcone = [];
        for (var ib = badgeOffset?1:0; ib < (badges||[]).length; ib++) {
          var bb = badges[ib];
          if (bb === 'bio') altreIcone.push('🍃');
          else if (bb === 'biodinamico') altreIcone.push('🪨');
          else if (bb === 'etico') altreIcone.push('⚖️');
          else if (bb === 'piede_franco') altreIcone.push('🍇');
          else if (bb === 'anfora') altreIcone.push('🏺');
          else if (bb === 'triplea') altreIcone.push('🏅');
          else if (bb === 'relais_chateaux') altreIcone.push('🏨');
        }
        if (altreIcone.length) leftStr += '  ' + altreIcone.join('');
        var r2x = x + (badgeOffset?0:0);
        var leftW = Math.max(40, COL_W - 58);
        doc.fontSize(10.5).font('Helvetica').fillColor('#18181b').text(leftStr, r2x, colState.y, { width: leftW, continued: true });
        doc.fontSize(11).font('Helvetica-Bold').fillColor('#0f172a').text(fmtMoney(prezzo), { width: 52, align: 'right' });
        colState.y += 12;

        /* riga 3: vitigni · metodo · sur lie N mesi · note */
        var r3 = [];
        if (Array.isArray(w.grapes) && w.grapes.length) r3.push(w.grapes.join(', '));
        else if (typeof w.grapes === 'string' && w.grapes) r3.push(w.grapes);
        var metodo = getWineMetodo(w);
        if (metodo) r3.push(metodo);
        var mesi = getWineMesiSurLie(w);
        if (mesi) r3.push('sur lie ' + String(mesi) + ' ' + t('mesi','months','mois','мес'));
        if (r3.length) {
          doc.fontSize(8.5).font('Helvetica').fillColor('#52525b').text(r3.join('  ·  '), x, colState.y, { width: COL_W });
          colState.y += 11;
        } else { colState.y += 4; }

        /* riga 4: Coltivazione: X · Lieviti: Y */
        var r4 = [];
        var colt = getWineColtivazione(w);
        if (colt) r4.push(t('Coltivazione','Farming','Culture','Возделывание') + ': ' + colt);
        var liev = getWineLieviti(w);
        if (liev) r4.push(t('Lieviti','Yeasts','Levures','Дрожжи') + ': ' + liev);
        var af = getWineNoteAffinamento(w);
        if (af) r4.push(af.length > 40 ? (af.slice(0,38)+'…') : af);
        if (r4.length) {
          doc.fontSize(8).font('Helvetica').fillColor('#71717a').text(r4.join('   ·   '), x, colState.y, { width: COL_W });
          colState.y += 11;
        }
        colState.y += 8; /* spazio tra etichette */
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
    try { _syncWinesToServer().catch(function(){}); } catch(e){}
  }
  function _syncWinesToServer() { return Promise.resolve(true); }

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
      '<div class="swm-field"><label>'+t('Prezzo in carta (€)','List price (€)','Prix carte (€)','Цена в карте (€)')+'</label>'+inp('price_sale',getVal('price_sale')||0,'number','299')+'</div>',
      '<div class="swm-field"><label>'+t('Giacenza (bottiglie)','Stock (bottles)','Stock (bouteilles)','Остаток (шт.)')+'</label>'+inp('quantity_bottles',getVal('quantity_bottles')==null?6:getVal('quantity_bottles'),'number','6')+'</div>',
      '<div class="swm-field"><label>'+t('Soglia minima riordino','Min. reorder threshold','Seuil réappro mini','Мин. порог заказа')+'</label>'+inp('minimum_threshold',getVal('minimum_threshold')==null?3:getVal('minimum_threshold'),'number','3')+'</div>',
      '<div class="swm-field full"><label>'+t('Link acquisto fornitore (opzionale)','Supplier buy link (optional)','Lien achat (optionnel)','Ссылка покупки (необяз.)')+'</label>'+inp('purchase_url',getVal('purchase_url'),'url','https://www.tannico.it/...')+'</div>',
      '<div class="swm-field full" style="flex-direction:row;align-items:center;gap:10px;"><label style="white-space:nowrap;min-width:150px;">Stato Carta:</label><label style="display:flex;align-items:center;gap:6px;text-transform:none;font-size:.78rem;color:#111827;letter-spacing:0;font-weight:500;"><input type="checkbox" id="swm_onList" '+(getVal('onList')===false?'':'checked')+'> '+t('✅ Pubblica nella Carta dei Vini (altrimenti RISERVA)','✅ Publish on Wine List (else RESERVE)','✅ Publier sur Carte (sinon RÉSERVE)','✅ Публиковать в Винной Карте (иначе РЕЗЕРВ)')+'</label></div>'
    ].join('');
  }

  function _swCollectFormValues() {
    function v(id){ var el=document.getElementById('swm_'+id); if(!el) return ''; if (el.tagName==='SELECT') return el.value; return el.value; }
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
      price_sale:        +v('price_sale') || 0,
      quantity_bottles:  +v('quantity_bottles') || 0,
      minimum_threshold: +v('minimum_threshold') || 3,
      purchase_url:      String(v('purchase_url')||'').trim(),
      onList:            document.getElementById('swm_onList').checked
    };
    if (!wine.wine_name) { alert(t('Inserisci almeno il nome dell\'etichetta','Insert at least the wine label name','Entrez au moins le nom de l\'étiquette','Введите хотя бы название этикетки')); document.getElementById('swm_wine_name').focus(); return null; }
    return wine;
  }

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
    { id: 'winecard',   it: 'Carta dei Vini',   en: 'Wine List',        fr: 'Carte des Vins',       ru: 'Винная карта',  icon: '📖' },
    { id: 'inventory',  it: 'Inventario',       en: 'Inventory',        fr: 'Inventaire',           ru: 'Инвентарь',    icon: '🍷' },
    { id: 'orders',     it: 'Ordini Venduti',   en: 'Sold Orders',      fr: 'Commandes vendues',    ru: 'Продажи',       icon: '🧾' },
    { id: 'suppliers',  it: 'Distributori SW',  en: 'SW Suppliers',     fr: 'Fournisseurs SW',      ru: 'Поставщики SW', icon: '🛒' },
    { id: 'accounting', it: 'Contabilità',      en: 'Accounting',       fr: 'Comptabilité',         ru: 'Бухгалтерия',  icon: '📒' },
    { id: 'movements',  it: 'Movimenti',        en: 'Movements',        fr: 'Mouvements',           ru: 'Движения',      icon: '📋' },
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
      { _id:'bellevue-001', wine_type:'sparkling', tipo:'bollicine', wine_name:"La Grande Année", cuvée:"La Grande Année", producer:'Bollinger', appellation:'Champagne AOC', regione:'Champagne', region:'Champagne', country:'Francia', nazione:'Francia', village:'Ay', frazione:'Ay, Marne', vintage:'2015', grapes:['Pinot Noir','Chardonnay'], vitigni:['Pinot Noir','Chardonnay'], metodo_spumante:'Metodo Classico', sur_lie_mesi:96, mesi_sur_lie:96, dosaggio:"Brut", lieviti:"Selezionati", coltivazione:"Convenzionale", piede_franco:false, prezzo_listino:299, price_sale:299, quantity_bottles:4, minimum_threshold:2, certificazioni:[], onList:true, affinamento:"Affinamento sui lieviti 96 mesi in botte", note_terroir:"Pinot Noir e Chardonnay sur lie 96 mesi", purchase_url:'https://www.callmewine.com/it/bollinger/la-grande-annee-2015-champagne-aoc.html', status:'available' },
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
    if (state.activeSection === 'winecard')   subtitle = t('Carta dei vini pronta per i tavoli o da stampare', 'Wine list ready for tables or to print', 'Carte des vins prête pour les tables ou à imprimer', 'Винная карта готова для столов или для печати');
    if (state.activeSection === 'inventory')  subtitle = t('Gestisci la tua carta vini e le giacenze', 'Manage your wine list and stock', 'Gérez votre carte des vins et stocks', 'Управляйте винной картой и остатками');
    if (state.activeSection === 'orders')     subtitle = t('Tutti gli ordini e le vendite registrate', 'All orders and recorded sales', 'Toutes les commandes et ventes', 'Все заказы и продажи');
    if (state.activeSection === 'accounting') subtitle = t('Riepilogo ricavi, costi e margini', 'Revenue, costs and margins summary', 'Résumé revenus, coûts et marges', 'Доходы, расходы и маржа');
    if (state.activeSection === 'movements')  subtitle = t('Registro di tutti i movimenti di inventario', 'Log of all inventory movements', 'Journal de tous les mouvements', 'Журнал всех движений');
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
      case 'winecard':   return buildWineCardPrint();
      case 'inventory':  return buildInventory();
      case 'orders':     return buildOrders();
      case 'suppliers':  return buildSuppliersPanel();
      case 'accounting': return buildAccounting();
      case 'movements':  return buildMovements();
      case 'admin':      return buildSuperAdmin();
      default: return '';
    }
  }
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
    var head = getDashHeader({
      title: '🛒 ' + t('Distributori Partners Sommelier World', 'Sommelier World Partner Suppliers', 'Fournisseurs Partenaires SW', 'Партнерские Дистрибьюторы SW'),
      subtitle: t('Sconti esclusivi per ristoranti iscritti. Commissioni tracciate con link ref affiliato.', 'Exclusive discounts. Commission-tracked affiliate ref links.', 'Remises exclusives + liens affiliés.', 'Эксклюзивные скидки. Партнерские ссылки.'),
      sectionKey: 'suppliers'
    });
    var cards = DISTRIBUTORS.map(function(d){
      var link = _getAffiliateLink(d);
      var refPart = d.refCode || '';
      var badgeSconto = (d.discount && d.discount !== '-') ? ('<span class="sw-dash-badge sw-dash-badge-amber" style="margin-left:4px;">🎁 ' + d.discount + ' ' + t('SW','SW','SW','SW') + '</span>') : '';
      return [
        '<div class="sw-dash-card" style="padding:18px;border-left:3px solid #0f172a;">',
          '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">',
            '<div style="flex:1;min-width:0;">',
              '<div style="font-size:1.02rem;font-weight:700;color:#0f172a;line-height:1.3;">📦 ' + (d.name||'') + badgeSconto + '</div>',
              '<div style="font-size:.72rem;color:#71717a;margin-top:4px;">📍 ' + (d.zone||'—') + (d.tel && d.tel !== '-' ? ' · ☎️ ' + d.tel : '') + '</div>',
              (d.note ? '<div style="font-size:.76rem;color:#334155;margin-top:8px;line-height:1.45;">ℹ️ ' + d.note + '</div>' : ''),
              '<div style="font-size:.65rem;color:#9ca3af;margin-top:10px;word-break:break-all;line-height:1.4;background:#fafafa;border:1px solid #f4f4f5;border-radius:6px;padding:6px 8px;">🔗 <span style="color:#334155;">' + link + '</span></div>',
              (refPart ? '<div style="font-size:.65rem;color:#10b981;margin-top:4px;">✅ ' + t('Link tracciato SW - profitto tuo','SW-tracked link - your profit','Lien tracké SW - votre marge','SW-трекер - ваш профит') + '</div>' : ''),
            '</div>',
            '<div style="display:flex;flex-direction:column;gap:6px;align-items:stretch;min-width:140px;">',
              '<a href="' + link + '" target="_blank" rel="noopener noreferrer sponsored" class="sw-dash-btn sw-dash-btn-primary" style="text-align:center;text-decoration:none;justify-content:center;">🛒 ' + t('Vai al sito','Go to site','Voir le site','Перейти') + '</a>',
              '<button type="button" class="sw-dash-btn sw-dash-btn-ghost" onclick="navigator.clipboard && navigator.clipboard.writeText(\'' + link.replace(/'/g,'\\\'') + '\'); alert(\'' + t('Link copiato!','Link copied!','Lien copié!','Ссылка скопирована!') + '\');">📋 ' + t('Copia link','Copy link','Copier lien','Копировать') + '</button>',
            '</div>',
          '</div>',
        '</div>'
      ].join('');
    }).join('');

    var profitCard = [
      '<div class="sw-dash-card" style="padding:20px;border:1px solid #0f172a;background:linear-gradient(180deg,#0f172a 0%,#1e293b 100%);color:#fff;margin-bottom:18px;">',
        '<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;">',
          '<div style="font-size:2.2rem;">💶</div>',
          '<div style="flex:1;min-width:260px;">',
            '<div style="font-family:Cinzel,serif;letter-spacing:1.4px;font-size:.76rem;color:#cbd5e1;">PROFITTO SOMMELIER WORLD · LIVELLO 1</div>',
            '<div style="font-size:1.22rem;font-weight:700;margin-top:4px;">' + t('Come guadagno con i distributori?','How do I earn with suppliers?','Comment gagner de l\'argent ?','Как я зарабатываю?') + '</div>',
            '<div style="font-size:.8rem;color:#cbd5e1;line-height:1.6;margin-top:8px;">' + t('Ogni ordine fatto tramite i tuoi link tracciati ➡️ commissione 3-5% per TE. Più ordini dai ristoranti = più profitto.','Every order via tracked link = 3-5% commission for YOU.','Chaque commande via lien tracké = 3-5% pour VOUS.','Каждый заказ = 3-5% комиссии ВАМ.') + '</div>',
          '</div>',
          '<button class="sw-dash-btn" style="background:#fff;color:#0f172a;border:0;font-weight:700;padding:9px 16px;white-space:nowrap;" onclick="window.swDashShowDistributors()">📞 ' + t('Mostra tutti','Show all','Montrer tout','Показать все') + '</button>',
        '</div>',
      '</div>'
    ].join('');

    return [
      head,
      '<div style="max-width:980px;margin:0 auto;padding:20px 22px;">',
        profitCard,
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:14px;">',
          cards,
        '</div>',
        '<div style="margin-top:20px;padding:14px 16px;background:#fffbeb;border:1px solid #fde68a;border-radius:10px;font-size:.78rem;color:#713f12;line-height:1.55;">',
          '<strong>⚠️ ' + t('Prossimo passo per TE','Next step for YOU','Prochaine étape','Следующий шаг') + ':</strong><br>',
          t('Chiama Sarzi Amadei / Sagna e altri distributori, presentati come Sommelier World, e chiedi accordo commerciale: \"Noi portiamo clienti ristoranti qualificati, voi fate sconto 5% + commissione 4% sul fatturato tracciato con ?ref=SW-*.\"  Tutti i distributori accettano volentieri perché ottengono clienti nuovi.','Call suppliers now, ask for 5% partner discount + 4% commission on tracked ?ref=SW links. Every distributor accepts because you bring NEW customers.','Appelez les distributeurs, demandez remise 5% + commission 4%. Tous acceptent car vous apportez DE NOUVEAUX clients.','Звоните дистрибьюторам: скидка 5% партнерам SW + 4% комиссия. Все соглашаются т.к. вы приносите НОВЫХ клиентов.') + '<br>',
          t('Appena mi dici i tuoi distributori preferiti, ti aggiungo istantaneamente nel pannello.','Tell me your preferred suppliers, I add them instantly.','Dites-moi vos fournisseurs préférés, je les ajoute immédiatement.','Назовите ваших любимых поставщиков - добавлю моментально.') + ' 📩 info@sommelierworld.vin',
        '</div>',
      '</div>'
    ].join('');
  }

  /* ===================== OVERVIEW + PRIVACY CARD ===================== */
  function buildOverview() {
    var cards = [
      statCard('🍾', t('Bottiglie in inventario', 'Bottles in stock', 'Bouteilles en stock', 'Бутылок'), state.totals.inventoryCount.toLocaleString('it-IT'), fmtMoney(state.totals.inventoryValue) + ' ' + t('valore', 'value', 'valeur', 'стоимость'), 'tone-wine'),
      statCard('🧾', t('Vendite (30gg)', 'Sales (30d)', 'Ventes (30j)', 'Продажи (30д)'), state.totals.soldCount.toLocaleString('it-IT') + ' ' + t('pezzi', 'items', 'pièces', 'шт.'), fmtMoney(state.totals.soldValue), 'tone-gold'),
      statCard('⚠️', t('Scorte basse', 'Low stock', 'Stock faible', 'Мало на складе'), String(state.totals.lowStock), t('da ricontrollare', 'to recheck', 'à revérifier', 'проверить'), 'tone-orange'),
      statCard('⛔', t('Esauriti', 'Out of stock', 'En rupture', 'Закончилось'), String(state.totals.outOfStock), t('etichette finite', 'labels sold out', 'étiquettes épuisées', 'нет в наличии'), 'tone-red')
    ].join('');

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

    return [
      privacyCard,
      '<div class="sw-dash-stats-grid">' + cards + '</div>',
      '<div class="sw-dash-grid-2">',
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
      arr = sortWines(arr, sortKey);
      var rows = arr.map(function(w){
        var price = typeof w.price_sale === 'number' ? w.price_sale : 0;
        var q = typeof w.quantity_bottles === 'number' ? w.quantity_bottles : 0;
        if (q === 0) return '';
        var purchase = getPurchaseUrl(w);
        return [
          '<div class="sw-wc-row" data-cat="' + key + '">',
            '<div>',
              '<div class="sw-wc-name">' + (w.wine_name || '') + (w.vintage ? ' · ' + w.vintage : '') + '</div>',
              '<div class="sw-wc-meta">' + (w.producer || '') + (w.appellation ? ' · ' + w.appellation : '') + (getWineRegion(w) && w.appellation !== getWineRegion(w) ? ' · ' + getWineRegion(w) : '') + (getWineCountry(w) && getWineCountry(w) !== 'Italia' ? ' · ' + getWineCountry(w) : '') + (Array.isArray(w.grapes) && w.grapes.length ? ' · ' + w.grapes.join(', ') : '') + '</div>',
            '</div>',
            '<div style="display:flex;align-items:center;gap:10px;">',
              (purchase ? '<a href="' + purchase + '" target="_blank" rel="noopener noreferrer" style="font-size:.7rem;color:#111827;opacity:.6;text-decoration:none;border:1px solid #e5e7eb;padding:2px 6px;border-radius:4px;">🔗 ' + t('Acquista','Buy','Acheter','Купить') + '</a>' : ''),
              '<div class="sw-wc-price">' + fmtMoney(price) + '</div>',
            '</div>',
          '</div>'
        ].join('');
      }).filter(Boolean).join('');
      if (!rows) return '';
      return [
        '<div class="sw-dash-winecard-section" data-section-key="' + key + '">',
          '<h3>' + (m.icon ? (m.icon + ' ') : '') + t(m.it, m.en, m.fr, m.ru) + ' <span style="float:right;font-size:.62rem;font-weight:400;color:#71717a;letter-spacing:0;font-family:Inter,sans-serif;">n. ' + groups[key].length + '</span></h3>',
          rows,
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
      '<div class="sw-dash-winecard-head">',
        '<div style="font-family:Cinzel,serif;font-size:.76rem;letter-spacing:1.2px;color:#475569;">📖 ' + t('Carta ufficiale', 'Official list', 'Carte officielle', 'Официальная карта') + (state.restaurantSlug ? ' · slug: ' + state.restaurantSlug : '') + '</div>',
        '<div style="display:flex;gap:8px;flex-wrap:wrap;">',
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
      return '<tr data-idx="' + i + '"><td><strong>' + (w.wine_name || '—') + '</strong><div class="sw-dash-muted">' + (w.producer || '') + (w.appellation ? ' · ' + w.appellation : '') + (grapes ? ' · ' + grapes : '') + '</div></td><td>' + (w.vintage || '—') + '</td><td>' + catBadge + '<div class="sw-dash-muted" style="font-size:.62rem;margin-top:3px;">' + wineTypeLabel(w.wine_type) + '</div></td><td style="white-space:nowrap;"><div style="font-size:.72rem;color:#3f3f46;">' + countryCell + '</div><div class="sw-dash-muted" style="font-size:.62rem;">' + getWineCountry(w) + '</div></td><td class="sw-dash-num">' + fmtMoney(w.price_sale || 0) + '</td><td class="sw-dash-num">' + q + '</td><td>' + stBadge + '</td><td>' + onListBadge + '</td><td>' + linkCell + '</td><td style="display:flex;gap:4px;flex-wrap:wrap;align-items:center;"><button class="sw-dash-row-btn" onclick="window.swDashAdjust && window.swDashAdjust(' + i + ')">✏️ ' + t('Modifica', 'Edit', 'Modifier', 'Изменить') + '</button> <button class="sw-dash-row-btn sw-dash-row-btn-danger" onclick="if(confirm(\''+t('Eliminare definitivamente ','Delete permanently ','Supprimer définitivement ','Удалить навсегда: ').replace(/'/g,'\\\'')+(w.wine_name||'vino').replace(/'/g,'\\\'')+' ?\')){ window.swDashDeleteRow && window.swDashDeleteRow(' + i + '); }">🗑️</button> <button class="sw-dash-row-btn sw-dash-row-btn-primary" onclick="window.swDashPrintOne && window.swDashPrintOne(' + i + ')">🖨️ ' + t('Scheda', 'Card', 'Fiche', 'Карточка') + '</button></td></tr>';
    }).filter(Boolean).join('') : '';

    return [
      filterBar,
      '<div class="sw-dash-panel">',
        '<div class="sw-dash-panel-head">',
          '<h3>' + t('Carta vini completa', 'Full wine list', 'Carte des vins complète', 'Полная винная карта') + '</h3>',
          '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">',
            '<button type="button" class="sw-dash-btn sw-dash-btn-ghost" style="padding:5px 10px;font-size:.72rem;" onclick="window.swDashExportInventory && window.swDashExportInventory()">⬇️ CSV</button>',
            '<a class="sw-dash-link" onclick="window.swDashboardGo && window.swDashboardGo(\'winecard\')">📖 ' + t('Vai a Carta da Stampare →', 'Go to Printable Wine List →', 'Aller à la carte imprimable →', 'К печатной Винной Карте →') + '</a>',
            '<div class="sw-dash-search-wrap">',
              '<input type="search" id="swDashInvSearch" class="sw-dash-input" placeholder="' + t('Cerca per nome, produttore, denominazione…', 'Search by name, producer, appellation…', 'Rechercher…', 'Поиск…') + '">',
            '</div>',
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
              '<th class="sw-dash-num" style="min-width:80px;">' + t('Giacenza', 'Stock', 'Stock', 'Остаток') + '</th>',
              '<th>Stato</th>',
              '<th style="min-width:110px;">' + t('Carta', 'List', 'Carte', 'Карта') + '</th>',
              '<th style="min-width:92px;">🔗 ' + t('Acquisto', 'Buy', 'Achat', 'Покупка') + '</th>',
              '<th style="min-width:160px;">' + t('Azioni', 'Actions', 'Actions', 'Действия') + '</th>',
            '</tr></thead>',
            '<tbody id="swDashInvBody">' + (rows || '<tr><td colspan="10" class="sw-dash-empty">' + t('Nessuna etichetta. Clicca "Aggiungi vino" per iniziare.', 'No labels yet. Click "Add wine" to start.', 'Aucune étiquette. Cliquez sur "Ajouter".', 'Нет этикеток. Нажмите "Добавить вино".') + '</td></tr>') + '</tbody>',
          '</table>',
        '</div>',
        (visible.length !== state.wines.length ? '<div style="padding:8px 12px;font-size:.72rem;color:#71717a;border-top:1px solid #f4f4f5;">' + t('Mostrate','Showing','Affichés','Показано') + ' ' + visible.length + ' / ' + state.wines.length + ' ' + t('vini · Filtro attivo','wines · Active filter','vins · Filtre actif','вин · Активный фильтр') + ': <strong style="color:#18181b;">' + getCatIcon(catFilter) + ' ' + getCatLabel(catFilter) + '</strong></div>' : ''),
      '</div>'
    ].join('');
  }

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

  /* ===================== SUPER ADMIN - GESTIONE RISTORANTI ===================== */
  function buildSuperAdmin() {
    var rows = state.restaurants.map(function(r, i){
      var planBadge = r.plan === 'elite' ? '<span class="sw-dash-badge sw-dash-badge-gray">' + t('ELITE', 'ELITE', 'ÉLITE', 'ELITE') + '</span>' :
                     (r.plan === 'pro' ? '<span class="sw-dash-badge sw-dash-badge-blue">' + t('PRO', 'PRO', 'PRO', 'PRO') + '</span>' :
                                           '<span class="sw-dash-badge sw-dash-badge-green">' + t('START', 'START', 'START', 'START') + '</span>');
      return [
        '<div class="sw-r-row">',
          '<div class="sw-r-avatar">' + r.name.substring(0,1).toUpperCase() + '</div>',
          '<div>',
            '<div class="sw-r-name">' + r.name + '</div>',
            '<div class="sw-r-slug">' + r.slug + ' · ' + r.email + '</div>',
          '</div>',
          '<div class="sw-r-plan">' + planBadge + '</div>',
          '<div class="sw-r-n">' + r.wines + ' vini</div>',
          '<div style="display:flex;gap:6px;justify-content:flex-end;">',
            '<button class="sw-dash-row-btn" onclick="window.swDashImpersonate &amp;&amp; window.swDashImpersonate(\'' + r.slug + '\')">🔑 ' + t('Entra', 'Enter', 'Entrer', 'Войти') + '</button>',
            '<button class="sw-dash-row-btn" onclick="window.open(\'/r/' + r.slug + '\',\'_blank\');">🔗 QR</button>',
          '</div>',
        '</div>'
      ].join('');
    }).join('');

    var headCards = [
      statCard('🏢', t('Ristoranti attivi', 'Active Restaurants', 'Restaurants actifs', 'Активные рестораны'), String(state.restaurants.length), t('gestiti in piattaforma', 'managed on platform', 'gérés sur la plateforme', 'под управлением платформы'), 'tone-wine'),
      statCard('💎', t('Piano ELITE', 'ELITE Plan', 'Plan ÉLITE', 'Тариф ELITE'), String(state.restaurants.filter(function(r){return r.plan==='elite';}).length), t('clienti top', 'top clients', 'clients top', 'топ клиенты'), 'tone-gold'),
      statCard('🍇', t('Piano PRO', 'PRO Plan', 'Plan PRO', 'Тариф PRO'), String(state.restaurants.filter(function(r){return r.plan==='pro';}).length), '', 'tone-orange'),
      statCard('🌱', t('Piano START', 'START Plan', 'Plan START', 'Тариф START'), String(state.restaurants.filter(function(r){return r.plan==='start';}).length), '', 'tone-green')
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
          '<h3>' + t('Elenco Aree Personali Ristoranti', 'Restaurant Private Areas List', 'Liste des Espaces Privés Restaurants', 'Список Личных Кабинетов Ресторанов') + ' (' + state.restaurants.length + ')</h3>',
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

  /* HASH ROUTING veloce per entrare nel dashboard */
  var _dashboardInited = false;
  function ensureRoute() {
    var h = (window.location.hash || '').toLowerCase();
    var dashPage = document.getElementById('page-dashboard');
    if (h === '#dashboard' && dashPage) {
      if (window.showPage) window.showPage('dashboard');
      if (!_dashboardInited) {
        _dashboardInited = true;
        initDashboard();
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    ensureRoute();
    var p = document.getElementById('page-dashboard');
    if (p && p.classList.contains('active')) initDashboard();
  });
  window.addEventListener('hashchange', ensureRoute);
})();
/* v17 cache bust - inventory onList toggle + Carta column header */
