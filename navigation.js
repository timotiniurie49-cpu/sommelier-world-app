/**
 * SOMMELIER WORLD — navigation.js
 * Routing pagine, i18n, home cards
 */

// ── SERVER URL ──
window.SRV = 'https://sommelier-server-production-8f92.up.railway.app';

// ── I18N ──
window.i18n = {
  dict: {
    it: {
      home:'Home', newsTab:'News', terroir:'Terroir', sommelier:'Sommelier', producers:'Produttori',
      mastSub:"L'enciclopedia mondiale — dal suolo al bicchiere",
      newsTitle:'NOTIZIE DEL VINO', newsLive:'🔴 WINE NEWS', newsArticoli:'articoli',
      sapereTit:'IL SAPERE DEL VINO',
      somTitle:'Sommelier AI', somConsulta:'✦ CONSULTA IL SOMMELIER ✦',
      somLoading:'Il Sommelier sta meditando…',
      somSectionMenu:'ABBINAMENTO MENU', somSectionBudget:'BUDGET PER BOTTIGLIA',
      somCountryLabel:'PAESE', somRegionLabel:'REGIONE',
      copyright:'© 2026 SOMMELIER WORLD — MARCHIO REGISTRATO',
      aiLang:'Rispondi SEMPRE e SOLO in italiano.',
      cardSom:'Sommelier AI', cardSomSub:'Abbina il menu',
      cardTerroir:'Terroir', cardTerroirSub:'327 denominazioni',
      cardProd:'Produttori', cardProdSub:'Cantine eccellenti',
      cardNews:'News', cardNewsSub:'Dal mondo del vino',
      terroirTitle:'Denominazioni del Mondo',
      terroirSub:'327 denominazioni · Tocca un paese per esplorare',
      producers:'Produttori',
    },
    en: {
      home:'Home', newsTab:'News', terroir:'Terroir', sommelier:'Sommelier', producers:'Producers',
      mastSub:'The world encyclopedia — from soil to glass',
      newsTitle:'WINE NEWS', newsLive:'🔴 WINE NEWS', newsArticoli:'articles',
      sapereTit:'WINE KNOWLEDGE',
      somTitle:'AI Sommelier', somConsulta:'✦ CONSULT THE SOMMELIER ✦',
      somLoading:'The Sommelier is contemplating…',
      somSectionMenu:'MENU PAIRING', somSectionBudget:'BUDGET PER BOTTLE',
      somCountryLabel:'COUNTRY', somRegionLabel:'REGION',
      copyright:'© 2026 SOMMELIER WORLD — REGISTERED TRADEMARK',
      aiLang:'Reply ALWAYS and ONLY in English.',
      cardSom:'AI Sommelier', cardSomSub:'Pair your menu',
      cardTerroir:'Terroir', cardTerroirSub:'327 appellations',
      cardProd:'Producers', cardProdSub:'World wineries',
      cardNews:'News', cardNewsSub:'Wine world news',
      terroirTitle:'World Appellations',
      terroirSub:'327 appellations · Tap a country to explore',
      producers:'Producers',
    },
    fr: {
      home:'Accueil', newsTab:'News', terroir:'Terroir', sommelier:'Sommelier', producers:'Producteurs',
      mastSub:"L'encyclopédie mondiale — du sol au verre",
      newsTitle:'ACTUALITÉS DU VIN', newsLive:'🔴 GAZETTE DU VIN', newsArticoli:'articles',
      sapereTit:'LE SAVOIR DU VIN',
      somTitle:'Sommelier IA', somConsulta:'✦ CONSULTER LE SOMMELIER ✦',
      somLoading:'Le Sommelier médite…',
      somSectionMenu:'ACCORD METS-VINS', somSectionBudget:'BUDGET PAR BOUTEILLE',
      somCountryLabel:'PAYS', somRegionLabel:'RÉGION',
      copyright:'© 2026 SOMMELIER WORLD — MARQUE DÉPOSÉE',
      aiLang:'Réponds TOUJOURS et UNIQUEMENT en français.',
      cardSom:'Sommelier IA', cardSomSub:'Accorder le menu',
      cardTerroir:'Terroir', cardTerroirSub:'327 appellations',
      cardProd:'Producteurs', cardProdSub:"Domaines d'excellence",
      cardNews:'Actualités', cardNewsSub:'Du monde du vin',
      producers:'Producteurs',
    }
  },
  current: 'it',
  t: function(k){ return (this.dict[this.current]||{})[k] || (this.dict.en||{})[k] || k; },
};

window.getLang = function(){ return i18n.current; };

window.setLang = function(lang){
  if(!i18n.dict[lang]) return;
  i18n.current = lang;
  try{ localStorage.setItem('sw_lang', lang); }catch(e){}
  // Aggiorna bottoni lingua
  ['it','en','fr'].forEach(function(l){
    var b = document.getElementById('lb_'+l);
    if(b){ b.classList.toggle('active', l===lang); }
  });
  // Traduce il DOM
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var v = i18n.t(el.getAttribute('data-i18n'));
    if(v) el.textContent = v;
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(function(el){
    var v = i18n.t(el.getAttribute('data-i18n-ph'));
    if(v) el.placeholder = v;
  });
  document.documentElement.lang = lang;
  // Rigenera cards con nuova lingua
  buildHomeCards();
  // Ricarica articoli dal server nella nuova lingua
  try{ localStorage.removeItem('sw_arts_day'); }catch(e){}
  if(typeof loadServerArts === 'function') loadServerArts();
};

// ── NAVIGAZIONE ──
window.showPage = function(pageId){
  document.querySelectorAll('.page').forEach(function(p){
    p.classList.remove('active');
    p.style.display = 'none';
  });
  var target = document.getElementById('page-'+pageId);
  if(target){ target.style.display = 'block'; target.classList.add('active'); }
  document.querySelectorAll('.ntab').forEach(function(t){
    t.classList.toggle('active', t.dataset.page === pageId);
  });
  window.scrollTo(0,0);
  if(pageId==='explore' && typeof renderExploreCountries==='function') renderExploreCountries();
  if(pageId==='admin' && window.adminLogged) loadAdminData();
};

// Click sui tab
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.ntab').forEach(function(tab){
    tab.addEventListener('click', function(){
      showPage(this.dataset.page);
    });
  });
});

// ── ADMIN URL TRIGGER ──
if(window.location.search.includes('admin=1')){
  document.addEventListener('DOMContentLoaded', function(){ showPage('admin'); });
}

window.closeReader = function(){
  var r = document.getElementById('al-reader');
  if(r) r.style.display = 'none';
  document.body.style.overflow = '';
};

window.openReader = function(art){
  var r = document.getElementById('al-reader');
  if(!r) return;
  var lang = getLang();
  var tit = art['titolo_'+lang] || art.titolo || '';
  var txt = art['testo_'+lang] || art.testo || '';
  var cat = art['categoria_'+lang] || art.categoria || '';
  var img = art.immagine || '';

  document.getElementById('readerTag').textContent  = cat;
  document.getElementById('readerTag2').textContent = cat;
  document.getElementById('readerTitle').textContent = tit;
  document.getElementById('readerText').innerHTML =
    txt.split(/\n\n+/).map(function(p){
      return '<p>'+p.replace(/\n/g,'<br>')+'</p>';
    }).join('');

  var heroEl = document.getElementById('readerHero');
  if(img && img.startsWith('http')){ heroEl.src=img; heroEl.style.display='block'; }
  else { heroEl.style.display='none'; }

  r.style.display = 'block';
  r.scrollTop = 0;
  document.body.style.overflow = 'hidden';
};

// ── HOME CARDS ──
window.buildHomeCards = function(){
  var container = document.getElementById('homeCards');
  if(!container) return;
  var T = i18n.t.bind(i18n);
  var cards = [
    {ico:'🍷', title:T('cardSom'),     sub:T('cardSomSub'),     page:'sommelier', bg:'linear-gradient(135deg,#3d0a0a,#1a0505)', border:'rgba(200,80,80,.35)'},
    {ico:'🌿', title:T('cardTerroir'), sub:T('cardTerroirSub'), page:'explore',   bg:'linear-gradient(135deg,#0a2010,#051408)', border:'rgba(80,160,80,.3)'},
    {ico:'🏆', title:T('cardProd'),    sub:T('cardProdSub'),    page:'producers', bg:'linear-gradient(135deg,#2a1a00,#1a0e00)', border:'rgba(191,155,74,.35)'},
    {ico:'📰', title:T('cardNews'),    sub:T('cardNewsSub'),    page:'news',      bg:'linear-gradient(135deg,#0a0520,#050210)', border:'rgba(120,90,220,.3)'},
  ];
  container.innerHTML = '';
  cards.forEach(function(c){
    var d = document.createElement('div');
    d.className = 'home-card';
    d.style.background = c.bg;
    d.style.borderColor = c.border;
    d.innerHTML =
      '<div class="home-card-ico">'+c.ico+'</div>'+
      '<div class="home-card-title">'+c.title+'</div>'+
      '<div class="home-card-sub">'+c.sub+'</div>';
    d.onclick = (function(page){ return function(){
      var tab = document.querySelector('.ntab[data-page="'+page+'"]');
      if(tab){ tab.click(); }
      else showPage(page);
    }; })(c.page);
    container.appendChild(d);
  });
};

// ── ADMIN ──
window.ADMIN_PWD = 'sommelier2026';
window.adminLogged = false;

window.checkAdmin = function(){
  var pwd = document.getElementById('adminPwd').value;
  if(pwd === ADMIN_PWD){
    adminLogged = true;
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadAdminData();
    adminLoadArticles();
  } else {
    document.getElementById('adminErr').style.display = 'block';
  }
};

window.adminLogout = function(){
  adminLogged = false;
  document.getElementById('adminPanel').style.display = 'none';
  document.getElementById('adminLogin').style.display = 'block';
  document.getElementById('adminPwd').value = '';
};

window.adminTab = function(tab){
  var isProd = tab === 'prod';
  document.getElementById('adminSecProd').style.display = isProd ? '' : 'none';
  document.getElementById('adminSecArt').style.display = isProd ? 'none' : '';
  document.getElementById('aTabProd').className = 'admin-tab-btn' + (isProd ? ' on' : '');
  document.getElementById('aTabArt').className = 'admin-tab-btn' + (!isProd ? ' on' : '');
  if(!isProd) adminLoadArticles();
};

window.loadAdminData = function(){
  // stub — caricato dal sistema produttori originale se presente
};

window.adminGenArts = async function(){
  var st = document.getElementById('adminGenStatus');
  if(st){ st.textContent = '⏳ Generazione in corso (2-3 minuti)…'; st.style.color='rgba(245,239,226,.4)'; }
  try{
    var r = await fetch(SRV+'/api/articles/generate?secret='+ADMIN_PWD);
    var d = await r.json();
    if(r.ok){ if(st){ st.style.color='#7dda8a'; st.textContent='✓ '+d.count+' articoli generati!'; } adminLoadArticles(); }
    else { if(st){ st.style.color='#f99'; st.textContent='✗ '+d.error; } }
  }catch(e){ if(st){ st.style.color='#f99'; st.textContent='✗ '+e.message; } }
};

window.adminSaveArt = async function(){
  var tit = (document.getElementById('artTit')||{}).value||'';
  var txt = (document.getElementById('artTxt')||{}).value||'';
  var cat = (document.getElementById('artCat')||{}).value||'';
  var img = (document.getElementById('artImg')||{}).value||'';
  var isNews = (document.getElementById('artIsNews')||{}).checked||false;
  var st  = document.getElementById('adminSaveStatus');
  if(!tit.trim()||!txt.trim()){ if(st){ st.style.color='#f99'; st.textContent='Titolo e testo obbligatori.'; } return; }
  if(st){ st.style.color='rgba(245,239,226,.4)'; st.textContent='Salvataggio…'; }
  var art = {
    id:'manual_'+Date.now(), generato_ai:false, isNews:isNews,
    titolo_it:tit, titolo_en:tit, titolo_fr:tit,
    categoria_it:cat, categoria_en:cat, categoria_fr:cat,
    testo_it:txt, testo_en:txt, testo_fr:txt,
    autore:'Sommelier World Editorial',
    data:new Date().toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'}),
    immagine:img||''
  };
  try{
    var r = await fetch(SRV+'/api/articles/save?secret='+ADMIN_PWD,{
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(art)
    });
    var d = await r.json();
    if(r.ok){ if(st){ st.style.color='#7dda8a'; st.textContent='✓ Pubblicato!'; } adminLoadArticles(); }
    else { if(st){ st.style.color='#f99'; st.textContent='✗ '+d.error; } }
  }catch(e){ if(st){ st.style.color='#f99'; st.textContent='✗ '+e.message; } }
};

window.adminLoadArticles = async function(){
  var el = document.getElementById('adminArtList');
  if(!el) return;
  try{
    var r = await fetch(SRV+'/api/articles');
    var arts = r.ok ? await r.json() : [];
    if(!arts.length){ el.textContent='Nessun articolo.'; return; }
    el.innerHTML = arts.map(function(a){
      var tit = a.titolo_it||a.titolo||'';
      return '<div style="display:flex;align-items:center;gap:10px;padding:10px;margin-bottom:6px;'+
        'background:rgba(255,255,255,.03);border:1px solid rgba(191,155,74,.08);border-radius:6px;">'+
        '<span style="flex:1;font-size:13px;color:rgba(245,239,226,.7);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+(a.generato_ai?'🤖 ':'✍️ ')+tit+'</span>'+
        '<button onclick="adminDelArt(\''+a.id+'\')" style="padding:4px 10px;background:rgba(220,50,50,.1);border:1px solid rgba(220,50,50,.3);border-radius:4px;color:#f99;font-size:10px;cursor:pointer;flex-shrink:0;">🗑</button>'+
      '</div>';
    }).join('');
  }catch(e){ el.textContent='Errore: '+e.message; }
};

window.adminDelArt = async function(id){
  if(!confirm('Eliminare?')) return;
  try{
    var r = await fetch(SRV+'/api/articles/delete/'+id+'?secret='+ADMIN_PWD,{method:'DELETE'});
    if(r.ok) adminLoadArticles();
  }catch(e){ alert(e.message); }
};

// ── INIT ──
document.addEventListener('DOMContentLoaded', function(){
  // Lingua salvata
  try{
    var saved = localStorage.getItem('sw_lang');
    if(saved && i18n.dict[saved]) setLang(saved);
    else setLang('it');
  }catch(e){ setLang('it'); }
  // Titoli hero random
  var titles = ['Il Tempio del Vino','La Memoria della Terra','Il Sangue della Vigna','Dal Suolo al Calice'];
  var h = document.getElementById('heroTitle');
  if(h) h.textContent = titles[Math.floor(Math.random()*titles.length)];
  // 4 card home
  buildHomeCards();
  // Protezione contenuti
  ['contextmenu','selectstart','dragstart'].forEach(function(ev){
    document.addEventListener(ev, function(e){
      if(!e.target.closest('input,textarea,select')) e.preventDefault();
    });
  });
});

// ── MAPPA TERROIR ──
window._mapObj = null;

window.initMap = function(){
  if(window._mapObj) return;
  var mapEl = document.getElementById('map');
  if(!mapEl || typeof L === 'undefined') return;

  window._mapObj = L.map('map', { zoomControl:true, attributionControl:false }).setView([30, 10], 2);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom:18, subdomains:'abcd'
  }).addTo(window._mapObj);

  /* Carica wine_regions.geojson */
  fetch('wine_regions.geojson')
    .then(function(r){ return r.json(); })
    .then(function(data){
      L.geoJSON(data, {
        style: function(){ return {color:'#BF9B4A', weight:1.5, fillColor:'#4a0404', fillOpacity:0.4}; },
        onEachFeature: function(feature, layer){
          var p = feature.properties;
          layer.bindPopup('<strong style="font-family:Cinzel,serif;color:#BF9B4A;">'+p.name+'</strong><br><small>'+( p.type||'')+'</small>');
          layer.on('click', function(){
            layer.openPopup();
          });
        }
      }).addTo(window._mapObj);
    })
    .catch(function(e){ console.warn('geojson non caricato:', e.message); });
};

/* Paesi per il Terroir */
var TERROIR_COUNTRIES = [
  {flag:'🇮🇹', name:'Italia'},   {flag:'🇫🇷', name:'Francia'},
  {flag:'🇪🇸', name:'Spagna'},   {flag:'🇺🇸', name:'USA'},
  {flag:'🇩🇪', name:'Germania'}, {flag:'🇵🇹', name:'Portogallo'},
  {flag:'🇦🇷', name:'Argentina'},{flag:'🇦🇺', name:'Australia'},
  {flag:'🇬🇷', name:'Grecia'},   {flag:'🇦🇹', name:'Austria'},
  {flag:'🇳🇿', name:'Nuova Zelanda'},{flag:'🇨🇱', name:'Cile'},
  {flag:'🇬🇪', name:'Georgia'},  {flag:'🇭🇺', name:'Ungheria'},
  {flag:'🇿🇦', name:'Sud Africa'},
];

window.renderExploreCountries = function(){
  var cont = document.getElementById('expCountries');
  if(!cont) return;
  cont.innerHTML =
    '<div style="font-family:Cinzel,serif;font-size:.52rem;letter-spacing:3px;color:rgba(191,155,74,.5);margin-bottom:10px;">ESPLORA PER PAESE</div>'+
    '<div style="display:flex;flex-wrap:wrap;gap:8px;">'+
    TERROIR_COUNTRIES.map(function(c){
      return '<button onclick="filterTerroir(this.dataset.q)" data-q="'+c.name+'" '+
        'style="padding:8px 12px;background:rgba(191,155,74,.08);border:1px solid rgba(191,155,74,.2);'+
        'border-radius:20px;color:rgba(245,239,226,.75);font-size:.82rem;cursor:pointer;transition:all .2s;"'+
        c.flag+' '+c.name+'</button>';
    }).join('')+
    '</div>';
  setTimeout(initMap, 200);
};

window.filterTerroir = function(query){
  var res = document.getElementById('terroirResults');
  if(!res) return;
  if(!query || query.length < 2){ res.innerHTML=''; return; }
  var q = query.toLowerCase();
  var DENOM = {
    'Italia': [
      {name:'Barolo',type:'DOCG',region:'Piemonte',desc:'Nebbiolo sulle Langhe — il Re dei vini italiani'},
      {name:'Barbaresco',type:'DOCG',region:'Piemonte',desc:'Nebbiolo elegante, sorelle del Barolo'},
      {name:'Brunello di Montalcino',type:'DOCG',region:'Toscana',desc:'Sangiovese Grosso — longevo e maestoso'},
      {name:'Chianti Classico',type:'DOCG',region:'Toscana',desc:'Sangiovese nel cuore della Toscana'},
      {name:'Amarone della Valpolicella',type:'DOCG',region:'Veneto',desc:'Appassimento eroico, concentrazione assoluta'},
      {name:'Soave Classico',type:'DOC',region:'Veneto',desc:'Garganega minerale, fresco e sorprendente'},
      {name:'Etna',type:'DOC',region:'Sicilia',desc:'Nerello Mascalese sul vulcano — terroir unico'},
      {name:'Franciacorta',type:'DOCG',region:'Lombardia',desc:'Metodo classico italiano — rivale dello Champagne'},
      {name:'Taurasi',type:'DOCG',region:'Campania',desc:'Aglianico potente — il Barolo del Sud'},
    ],
    'Francia': [
      {name:'Champagne',type:'AOC',region:'Champagne',desc:'Metodo classico su calcare cretaceo'},
      {name:'Bourgogne Rouge',type:'AOC',region:'Borgogna',desc:'Pinot Noir sui Grands Crus calcarei'},
      {name:'Chablis',type:'AOC',region:'Borgogna',desc:'Chardonnay su kimmeridgiano — mineralità assoluta'},
      {name:'Bordeaux',type:'AOC',region:'Bordeaux',desc:'Cabernet e Merlot sulle rive della Gironde'},
      {name:'Châteauneuf-du-Pape',type:'AOC',region:'Rodano',desc:'Grenache su galets roulés — potenza e calore'},
    ],
    'Spagna': [
      {name:'Rioja',type:'DOCa',region:'Rioja',desc:'Tempranillo con invecchiamento — Gran Reserva'},
      {name:'Ribera del Duero',type:'DO',region:'Castilla y León',desc:'Tempranillo in altura — struttura e concentrazione'},
      {name:'Priorat',type:'DOCa',region:'Catalogna',desc:'Grenache centenaria su llicorella scura'},
    ],
  };
  var results = [];
  Object.entries(DENOM).forEach(function(entry){
    var paese = entry[0], denoms = entry[1];
    if(paese.toLowerCase().includes(q)){
      results = results.concat(denoms.map(function(d){ return Object.assign({paese:paese},d); }));
    } else {
      denoms.forEach(function(d){
        if(d.name.toLowerCase().includes(q)||d.region.toLowerCase().includes(q)||
           (d.desc&&d.desc.toLowerCase().includes(q))){
          results.push(Object.assign({paese:paese},d));
        }
      });
    }
  });
  if(!results.length){ res.innerHTML='<p style="color:rgba(245,239,226,.4);font-style:italic;padding:10px 0;">Nessun risultato per "'+query+'"</p>'; return; }
  res.innerHTML = '<div style="font-family:Cinzel,serif;font-size:.52rem;letter-spacing:3px;color:rgba(191,155,74,.5);margin-bottom:12px;">'+results.length+' RISULTATI</div>'+
    results.map(function(d){
      return '<div style="padding:14px;margin-bottom:8px;background:rgba(255,255,255,.03);border:1px solid rgba(191,155,74,.1);border-radius:8px;">'+
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">'+
          '<span style="font-family:Cinzel,serif;font-size:.5rem;letter-spacing:1px;background:rgba(191,155,74,.15);color:#BF9B4A;padding:2px 8px;border-radius:10px;">'+d.type+'</span>'+
          '<strong style="font-size:1rem;color:#fff;">'+d.name+'</strong>'+
        '</div>'+
        '<div style="font-size:.82rem;color:rgba(191,155,74,.6);">'+d.paese+' · '+d.region+'</div>'+
        '<div style="font-size:.9rem;color:rgba(245,239,226,.55);margin-top:4px;font-style:italic;">'+d.desc+'</div>'+
      '</div>';
    }).join('');
};

/* Inizializza mappa quando si va su Terroir */
document.addEventListener('DOMContentLoaded', function(){
  var origShow = window.showPage;
  window.showPage = function(pageId){
    origShow(pageId);
    if(pageId === 'explore'){
      setTimeout(function(){
        initMap();
        renderExploreCountries();
      }, 100);
    }
  };
});
