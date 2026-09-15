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

  /* ===================== EXPORT CSV (Excel readable UTF-8 BOM) ===================== */
  function _csvEscape(v) {
    var s = (v == null) ? '' : String(v);
    if (/[;"\n,\t]/.test(s)) return '"' + s.replace(/"/g,'""') + '"';
    return s;
  }
  function _downloadBlob(filename, content) {
    var blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    var BOM = '\uFEFF';
    var blobBom = new Blob([BOM, blob], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blobBom);
    var a = document.createElement('a');
    a.href = url; a.download = filename; a.style.display = 'none';
    document.body.appendChild(a); a.click();
    setTimeout(function(){ document.body.removeChild(a); URL.revokeObjectURL(url); }, 250);
  }
  function swDashExportInventory() {
    if (!state.wines || !state.wines.length) { alert(t('Nessun vino in inventario.', 'No wines in inventory.', 'Aucun vin en inventaire.', 'Нет вин в инвентаре.')); return; }
    var headers = ['Etichetta','Annata','Produttore','Regione','Paese','Categoria','Tipologia','Vitigni','Prezzo (€)','Giacenza','Soglia Min.','Stato','In Carta','Link Acquisto'];
    var rows = [headers.join(';')];
    var sorted = sortWines(state.wines, state.ui.sort);
    sorted.forEach(function(w){
      var q = typeof w.quantity_bottles === 'number' ? w.quantity_bottles : 0;
      var minTh = typeof w.minimum_threshold === 'number' ? w.minimum_threshold : 3;
      var st = w.status || (q === 0 ? t('Esaurito','Out of Stock','Rupture de stock','Распродано') : (q <= minTh ? t('Scorte basse','Low Stock','Stock bas','Низкий остаток') : t('Disponibile','Available','Disponibile','В наличии')));
      var catK = categorizeWine(w);
      rows.push([
        _csvEscape(w.wine_name||''),
        _csvEscape(w.vintage||''),
        _csvEscape(w.producer||''),
        _csvEscape(getWineRegion(w)),
        _csvEscape(getWineCountry(w)),
        _csvEscape(getCatLabel(catK)),
        _csvEscape(getWineTipo(w)),
        _csvEscape(Array.isArray(w.grapes) ? w.grapes.join(', ') : (w.grapes||'')),
        _csvEscape(+(w.price_sale||0).toFixed(2)),
        _csvEscape(q),
        _csvEscape(minTh),
        _csvEscape(st),
        _csvEscape(w.onList === false ? t('RISERVA','RESERVE','RÉSERVE','РЕЗЕРВ') : t('IN CARTA','ON LIST','EN CARTE','В КАРТЕ')),
        _csvEscape(getPurchaseUrl(w))
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

  var sections = [
    { id: 'overview',   it: 'Panoramica',       en: 'Overview',         fr: 'Aperçu',               ru: 'Обзор',         icon: '📊' },
    { id: 'winecard',   it: 'Carta dei Vini',   en: 'Wine List',        fr: 'Carte des Vins',       ru: 'Винная карта',  icon: '📖' },
    { id: 'inventory',  it: 'Inventario',       en: 'Inventory',        fr: 'Inventaire',           ru: 'Инвентарь',    icon: '🍷' },
    { id: 'orders',     it: 'Ordini Venduti',   en: 'Sold Orders',      fr: 'Commandes vendues',    ru: 'Продажи',       icon: '🧾' },
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
      newWines.forEach(function(w) {
        var match = saved.find(function(s) {
          return (s._id && w._id && s._id === w._id) ||
                 ((s.wine_name || '') === (w.wine_name || '') && String(s.vintage || '') === String(w.vintage || ''));
        });
        if (!match) return;
        if (typeof match.onList === 'boolean') w.onList = match.onList;
        if (typeof match.purchase_url === 'string' && match.purchase_url.length) w.purchase_url = match.purchase_url;
        if (typeof match.tipo === 'string' && match.tipo.length) w.tipo = match.tipo;
        if (typeof match.country === 'string' && match.country.length) w.country = match.country;
        if (typeof match.region === 'string' && match.region.length) w.region = match.region;
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
      { _id:'sample-001', wine_type:'sparkling', tipo:'bollicine', wine_name:'Champagne Brut Grande Cuvée', producer:'Bollinger', appellation:'Champagne AOC', region:'Champagne', country:'Francia', vintage:'2015', grapes:['Pinot Noir','Chardonnay','Pinot Meunier'], price_sale:149, quantity_bottles:6, minimum_threshold:3, purchase_url:'https://www.callmewine.com/it/bollinger/brut-grande-cuvee-champagne-aoc_75cl.html' },
      { _id:'sample-002', wine_type:'sparkling', tipo:'bollicine', wine_name:'Trento DOC Brut Riserva', producer:'Ferrari', appellation:'Trento DOC', region:'Trentino', country:'Italia', vintage:'2019', grapes:['Chardonnay','Pinot Nero'], price_sale:38, quantity_bottles:18, minimum_threshold:6, purchase_url:'https://www.tannico.it/ferrari-trento-doc-brut-riserva-perle-2015.html' },
      { _id:'sample-003', wine_type:'white', tipo:'bianco', wine_name:'Chardonnay Alto Adige DOC', producer:'Elena Walch', appellation:'Alto Adige DOC', region:'Alto Adige', country:'Italia', vintage:'2023', grapes:['Chardonnay'], price_sale:29, quantity_bottles:12, minimum_threshold:3, purchase_url:'https://www.tannico.it/elena-walch-chardonnay-alto-adige-doc-2022.html' },
      { _id:'sample-004', wine_type:'white', tipo:'bianco', wine_name:'Sauvignon Blanc DOC', producer:'Hofstätter', appellation:'Alto Adige DOC', region:'Alto Adige', country:'Italia', vintage:'2023', grapes:['Sauvignon Blanc'], price_sale:26, quantity_bottles:9, minimum_threshold:3, purchase_url:'https://www.callmewine.com/it/hofstatter/sauvignon-alto-adige-doc.html' },
      { _id:'sample-005', wine_type:'white', tipo:'bianco', wine_name:'Pinot Grigio DOC', producer:'Alois Lageder', appellation:'Alto Adige DOC', region:'Alto Adige', country:'Italia', vintage:'2023', grapes:['Pinot Grigio'], price_sale:22, quantity_bottles:15, minimum_threshold:6, purchase_url:'https://www.eataly.com/it-it/vino/pinot-grigio-alto-adige-doc.html' },
      { _id:'sample-006', wine_type:'white', tipo:'bianco', wine_name:'Vermentino di Gallura DOCG', producer:'Argiolas', appellation:'Vermentino di Gallura DOCG', region:'Sardegna', country:'Italia', vintage:'2023', grapes:['Vermentino'], price_sale:24, quantity_bottles:8, minimum_threshold:3 },
      { _id:'sample-007', wine_type:'rose', tipo:'rosato', wine_name:'Chiaretto di Bardolino DOC', producer:'Le Fraghe', appellation:'Bardolino DOC Chiaretto', region:'Veneto', country:'Italia', vintage:'2023', grapes:['Corvina','Rondinella','Molinara'], price_sale:18, quantity_bottles:7, minimum_threshold:3 },
      { _id:'sample-008', wine_type:'red', tipo:'rosso', wine_name:'Barolo DOCG', producer:'Gaja', appellation:'Barbaresco DOCG', region:'Piemonte', country:'Italia', vintage:'2019', grapes:['Nebbiolo'], price_sale:420, quantity_bottles:3, minimum_threshold:2, purchase_url:'https://www.callmewine.com/it/gaja/barbaresco-docg.html' },
      { _id:'sample-009', wine_type:'red', tipo:'rosso', wine_name:'Barbera d\'Alba DOC', producer:'Pio Cesare', appellation:'Barbera d\'Alba DOC', region:'Piemonte', country:'Italia', vintage:'2021', grapes:['Barbera'], price_sale:54, quantity_bottles:0, minimum_threshold:3, purchase_url:'https://www.tannico.it/pio-cesare-barbera-d-alba-doc-2021.html' },
      { _id:'sample-010', wine_type:'red', tipo:'rosso', wine_name:'Brunello di Montalcino DOCG', producer:'Casanova di Neri', appellation:'Brunello di Montalcino DOCG', region:'Toscana', country:'Italia', vintage:'2018', grapes:['Sangiovese'], price_sale:110, quantity_bottles:6, minimum_threshold:3, purchase_url:'https://www.callmewine.com/it/casanova-di-neri/brunello-di-montalcino-docg.html' },
      { _id:'sample-011', wine_type:'red', tipo:'rosso', wine_name:'Amarone della Valpolicella DOCG', producer:'Allegrini', appellation:'Amarone della Valpolicella DOCG Classico', region:'Veneto', country:'Italia', vintage:'2018', grapes:['Corvina','Corvinone','Rondinella'], price_sale:89, quantity_bottles:5, minimum_threshold:2 },
      { _id:'sample-012', wine_type:'red', tipo:'rosso', wine_name:'Montepulciano d\'Abruzzo DOC', producer:'Valentini', appellation:'Montepulciano d\'Abruzzo DOC', region:'Abruzzo', country:'Italia', vintage:'2020', grapes:['Montepulciano'], price_sale:34, quantity_bottles:14, minimum_threshold:6 },
      { _id:'sample-013', wine_type:'red', tipo:'rosso', wine_name:'Morey-Saint-Denis 1er Cru', producer:'Domaine Dujac', appellation:'Morey-Saint-Denis 1er Cru AOC', region:'Borgogna', country:'Francia', vintage:'2020', grapes:['Pinot Noir'], price_sale:275, quantity_bottles:3, minimum_threshold:1, purchase_url:'https://www.vinatis.com/fr/acheter-vin-bourgogne/33637-domaine-dujac-morey-saint-denis-1er-cru.html' },
      { _id:'sample-014', wine_type:'white', tipo:'bianco', wine_name:'Puligny-Montrachet Village', producer:'Domaine Leflaive', appellation:'Puligny-Montrachet Village AOC', region:'Borgogna', country:'Francia', vintage:'2021', grapes:['Chardonnay'], price_sale:185, quantity_bottles:2, minimum_threshold:1, purchase_url:'https://www.vinatis.com/fr/31504-domaine-leflaive-puligny-montrachet-village.html' },
      { _id:'sample-015', wine_type:'red', tipo:'rosso', wine_name:'Cabernet Sauvignon Monte Bello', producer:'Ridge Vineyards', appellation:'Santa Cruz Mountains AVA', region:'California', country:'USA', vintage:'2019', grapes:['Cabernet Sauvignon'], price_sale:165, quantity_bottles:4, minimum_threshold:2, purchase_url:'https://www.wine-searcher.com/find/ridge+monte+bello+santa+cruz+mountains+ava+california+usa' },
      { _id:'sample-016', wine_type:'white', tipo:'bianco', wine_name:'Sauvignon Blanc Marlborough', producer:'Cloudy Bay', appellation:'Marlborough', region:'Marlborough', country:'Nuova Zelanda', vintage:'2023', grapes:['Sauvignon Blanc'], price_sale:49, quantity_bottles:10, minimum_threshold:4 },
      { _id:'sample-017', wine_type:'white', tipo:'bianco', wine_name:'Riesling trocken Grosse Lage', producer:'Weingut Keller', appellation:'Rheinhessen Grosse Lage', region:'Rheinhessen', country:'Germania', vintage:'2021', grapes:['Riesling'], price_sale:78, quantity_bottles:3, minimum_threshold:2 },
      { _id:'sample-018', wine_type:'white', tipo:'dolce', wine_name:'Recioto di Soave DOCG', producer:'Suavia', appellation:'Recioto di Soave DOCG Classico', region:'Veneto', country:'Italia', vintage:'2020', grapes:['Garganega'], price_sale:44, quantity_bottles:6, minimum_threshold:2 }
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
      return '<tr data-idx="' + i + '"><td><strong>' + (w.wine_name || '—') + '</strong><div class="sw-dash-muted">' + (w.producer || '') + (w.appellation ? ' · ' + w.appellation : '') + (grapes ? ' · ' + grapes : '') + '</div></td><td>' + (w.vintage || '—') + '</td><td>' + catBadge + '<div class="sw-dash-muted" style="font-size:.62rem;margin-top:3px;">' + wineTypeLabel(w.wine_type) + '</div></td><td style="white-space:nowrap;"><div style="font-size:.72rem;color:#3f3f46;">' + countryCell + '</div><div class="sw-dash-muted" style="font-size:.62rem;">' + getWineCountry(w) + '</div></td><td class="sw-dash-num">' + fmtMoney(w.price_sale || 0) + '</td><td class="sw-dash-num">' + q + '</td><td>' + stBadge + '</td><td>' + onListBadge + '</td><td>' + linkCell + '</td><td><button class="sw-dash-row-btn" onclick="window.swDashAdjust && window.swDashAdjust(' + i + ')">' + t('Modifica', 'Edit', 'Modifier', 'Изменить') + '</button> <button class="sw-dash-row-btn sw-dash-row-btn-primary" onclick="window.swDashPrintOne && window.swDashPrintOne(' + i + ')">🖨️ ' + t('Scheda', 'Card', 'Fiche', 'Карточка') + '</button></td></tr>';
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
      var steps = [
        { k:'wine_name',        lbl:t('* Etichetta / Nome vino:','* Wine label / Name:','* Nom du vin :','* Название вина:'), def:'' },
        { k:'vintage',          lbl:t('Annata (es. 2020):','Vintage (e.g. 2020):','Millésime :','Год:'), def:new Date().getFullYear()-2+'' },
        { k:'producer',         lbl:t('Produttore:','Producer:','Producteur :','Производитель:'), def:'' },
        { k:'region',           lbl:t('Regione / Appellation:','Region / Appellation:','Région / Appellation :','Регион / Аппелласьон:'), def:'' },
        { k:'country',          lbl:t('Paese (Italia / Francia / USA ...):','Country (Italy / France ...):','Pays :','Страна:'), def:'Italia' },
        { k:'tipo',             lbl:t('Tipologia: bianco / rosso / rosato / bollicine / dolce','Type: white / red / rosé / sparkling / sweet','Type : blanc / rouge / rosé / effervescent / doux','Тип: белое / красное / розовое / игристое / десертное'), def:'rosso' },
        { k:'grapes',           lbl:t('Vitigni (separati da virgola):','Grapes (comma separated):','Cépages :','Сорта винограда:'), def:'' },
        { k:'price_sale',       lbl:t('Prezzo al cliente (€):','Price to customer (€):','Prix client (€):','Цена для гостя (€):'), def:'0' },
        { k:'quantity_bottles',lbl:t('Giacenza iniziale (bottiglie):','Initial stock (bottles):','Stock initial :','Начальный остаток (шт.):'), def:'6' },
        { k:'minimum_threshold',lbl:t('Soglia minima riordino:','Min. restock threshold:','Seuil min. réappro:','Мин. порог:'), def:'3' },
        { k:'purchase_url',     lbl:t('Link acquisto fornitore (opzionale):','Supplier link (optional):','Lien achat (optionnel):','Ссылка покупки (необяз.):'), def:'' }
      ];
      var newWine = { _id: 'w_'+Date.now(), onList: true, status: 'available', currency:'EUR', created_at: new Date().toISOString() };
      var ok = true;
      steps.forEach(function(s){
        if (!ok) return;
        var v = prompt(s.lbl, s.def==null?'':String(s.def));
        if (v === null) { ok = false; return; }
        if (s.k === 'grapes') {
          newWine.grapes = v.split(/[,;]/).map(function(x){return x.trim();}).filter(Boolean);
        } else if (s.k === 'quantity_bottles' || s.k === 'minimum_threshold') {
          newWine[s.k] = isNaN(+v) ? 0 : (+v);
        } else if (s.k === 'price_sale') {
          newWine[s.k] = isNaN(+v) ? 0 : (+v);
        } else {
          newWine[s.k] = v.trim();
        }
      });
      if (!ok || !newWine.wine_name) return;
      state.wines.unshift(newWine);
      saveState();
      computeTotals();
      renderDashboard();
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
    if (cardPdf) cardPdf.addEventListener('click', function(){
      alert(t('Anteprima: poi CTRL+P = Stampa / Salva PDF. Il layout di stampa nasconde menu e sidebar.', 'Preview: then CTRL+P = Print / Save as PDF. Print layout hides nav & sidebar.', 'Aperçu : puis CTRL+P = Imprimer / Enregistrer PDF. La mise en page de l\'impression masque navigation & sidebar.', 'Предпросмотр: далее CTRL+P = Печать / Сохранить PDF. Макет печати скрывает меню и сайдбар.'));
      setTimeout(printWineCard, 350);
    });
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
    var w = state.wines[i|0];
    if (!w) return;
    var title = (w.wine_name||'Vino') + (w.vintage ? ' ('+w.vintage+')' : '');
    var steps = [
      { k:'wine_name',        lbl:t('Etichetta / Nome vino:','Wine label / Name:','Nom du vin :','Название вина:'), def:w.wine_name||'' },
      { k:'vintage',          lbl:t('Annata (es. 2019):','Vintage (e.g. 2019):','Millésime :','Год:'), def:w.vintage||'' },
      { k:'producer',         lbl:t('Produttore:','Producer:','Producteur :','Производитель:'), def:w.producer||'' },
      { k:'region',           lbl:t('Regione / Appellation:','Region / Appellation:','Région / Appellation :','Регион / Аппелласьон:'), def:getWineRegion(w) },
      { k:'country',          lbl:t('Paese (Italia / Francia / USA ...):','Country (Italy / France ...):','Pays (Italie / France ...):','Страна:'), def:getWineCountry(w) },
      { k:'tipo',             lbl:t('Tipologia (bianco / rosso / rosato / bollicine / dolce):','Type (white / red / rosé / sparkling / sweet):','Type (blanc / rouge / rosé / effervescent / doux):','Тип (белое / красное / розовое / игристое / десертное):'), def:getWineTipo(w) },
      { k:'grapes',           lbl:t('Vitigni (separati da virgola):','Grapes (comma separated):','Cépages (séparés par virgule):','Сорта винограда (через запятую):'), def:Array.isArray(w.grapes)?w.grapes.join(', '):(w.grapes||'') },
      { k:'price_sale',       lbl:t('Prezzo al cliente (€):','Price to customer (€):','Prix client (€):','Цена для гостя (€):'), def:w.price_sale||'' },
      { k:'quantity_bottles', lbl:t('Giacenza (n. bottiglie):','Stock (n. bottles):','Stock (n. bouteilles):','Остаток (шт.):'), def:w.quantity_bottles },
      { k:'minimum_threshold',lbl:t('Soglia minima riordino:','Min. restock threshold:','Seuil min. réappro:','Мин. порог заказ:'), def:w.minimum_threshold||3 },
      { k:'purchase_url',     lbl:t('Link acquisto fornitore (https://...):','Supplier purchase link (https://...):','Lien achat fournisseur :','Ссылка покупки (https://...):'), def:getPurchaseUrl(w) }
    ];
    var ok = true;
    steps.forEach(function(s){
      if (!ok) return;
      var v = prompt(s.lbl, s.def==null?'':String(s.def));
      if (v === null) { ok = false; return; }
      if (s.k === 'grapes') {
        w.grapes = v.split(/[,;]/).map(function(x){return x.trim();}).filter(Boolean);
      } else if (s.k === 'quantity_bottles' || s.k === 'minimum_threshold') {
        w[s.k] = isNaN(+v) ? 0 : (+v);
      } else if (s.k === 'price_sale') {
        w[s.k] = isNaN(+v) ? 0 : (+v);
      } else if (s.k === 'vintage') {
        w[s.k] = v.trim();
      } else {
        w[s.k] = v.trim();
      }
    });
    if (!ok) return;
    saveState();
    renderDashboard();
  };
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
