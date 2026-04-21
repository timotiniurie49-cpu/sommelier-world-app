/**
 * SOMMELIER WORLD — navigation.js v26
 * ─────────────────────────────────────────────────────────────
 * Tutte le funzioni sono window.xxx — nessun closure chiuso.
 * NUOVO: Paywall 3 consultazioni/giorno. Elite €2.99/mese illimitato.
 */

window.SRV        = 'https://sommelier-server-production-8f92.up.railway.app';
window.SERVER_URL = window.SRV;

// ═══════════════════════════════════════════════════════════
// I18N — Italiano come lingua madre
// ═══════════════════════════════════════════════════════════
window.i18n = {
  current: 'it',
  dict: {
    it: {
      home:'Home', sommelier:'Sommelier', terroir:'Terroir', producers:'Produttori',
      enciclopedia:"L'ENCICLOPEDIA MONDIALE",
      newsLive:'🔴 AGGIORNAMENTI', newsArticoli:'articoli',
      sapereTit:'IL SAPERE DEL VINO',
      cardSomSub:'Abbina il vino al menu', cardTerSub:'327 denominazioni mondiali',
      cardProdSub:'Cantine di eccellenza', cardSapSub:'Curiosità e cultura',
      somTitle:'Sommelier AI', somKicker:'✦ CONSULTA IL SOMMELIER ✦',
      somSubtitle:'Scegli il vino perfetto per il tuo menu',
      somMenuLbl:'IL TUO MENU',
      somMenuPh:'Descrivi il menu — anche solo il piatto principale.\nEs: Risotto ai funghi porcini con tartufo…',
      somBudgetLbl:'BUDGET PER BOTTIGLIA', somBudgetUnit:'per bottiglia',
      somProfiloLbl:'CARATTERE DEL VINO DESIDERATO',
      somFreschLbl:'FRESCHEZZA', somCarattLbl:'CARATTERE', somCorpoLbl:'CORPO',
      somOrigLbl:'ORIGINE PREFERITA (OPZIONALE)',
      somPaeseOpt:'Qualsiasi paese', somRegioneOpt:'Qualsiasi regione',
      somBtn:'✦ CONSULTA IL SOMMELIER ✦',
      somLoading:'Il Sommelier sta meditando…',
      somDisclaimer:"I consigli sono generati dall'intelligenza artificiale a scopo informativo e didattico.",
      somFeedbackQ:'IL CONSIGLIO TI HA AIUTATO?',
      somFbGraz:'✓ Grazie per il feedback!', somFbNote:'✓ Terremo conto del tuo parere.',
      aiLang:'RISPONDI ESCLUSIVAMENTE IN ITALIANO.',
      qmTit:'MENU RAPIDI', qmPesce:'🐟 Pesce', qmCarne:'🥩 Carne',
      qmVeg:'🌿 Vegetariano', qmDeg:'🍽 Degustazione', qmFor:'🧀 Formaggi',
      terroirTitle:'Terroir Mondiale', terroirSub:'327 denominazioni · cerca per nome, paese o vitigno',
      terroirPh:'🔍  Cerca denominazione, paese, vitigno…',
      prodTitle:'Produttori', prodSub:'Le cantine che definiscono il vino del mondo',
      prodPkg:'SCEGLI IL TUO PACCHETTO',
      prodBeta:'🎁 VERSIONE BETA — accesso gratuito',
      copyright:'© 2026 SOMMELIER WORLD — MARCHIO REGISTRATO',
      allRights:'Tutti i contenuti sono protetti. Riproduzione vietata.',
      disclaimer:'Sommelier World è un progetto editoriale indipendente. I contenuti sono generati a scopo informativo e didattico.',
      privacyLnk:'Privacy Policy', termsLnk:'Termini di Servizio',
    },
    en: {
      home:'Home', sommelier:'Sommelier', terroir:'Terroir', producers:'Producers',
      enciclopedia:'THE WORLD ENCYCLOPEDIA',
      newsLive:'🔴 WINE NEWS', newsArticoli:'articles',
      sapereTit:'WINE KNOWLEDGE',
      cardSomSub:'Pair wine with your menu', cardTerSub:'327 world appellations',
      cardProdSub:'Excellent wineries', cardSapSub:'Culture & curiosities',
      somTitle:'AI Sommelier', somKicker:'✦ CONSULT THE SOMMELIER ✦',
      somSubtitle:'Find the perfect wine for your menu',
      somMenuLbl:'YOUR MENU', somMenuPh:'Describe the menu — even just the main course.',
      somBudgetLbl:'BUDGET PER BOTTLE', somBudgetUnit:'per bottle',
      somProfiloLbl:'DESIRED WINE CHARACTER',
      somFreschLbl:'FRESHNESS', somCarattLbl:'CHARACTER', somCorpoLbl:'BODY',
      somOrigLbl:'PREFERRED ORIGIN (OPTIONAL)',
      somPaeseOpt:'Any country', somRegioneOpt:'Any region',
      somBtn:'✦ CONSULT THE SOMMELIER ✦',
      somLoading:'The Sommelier is contemplating…',
      somDisclaimer:'Recommendations are AI-generated for informational purposes only.',
      somFeedbackQ:'DID THIS ADVICE HELP YOU?',
      somFbGraz:'✓ Thank you!', somFbNote:'✓ Noted.',
      aiLang:'REPLY EXCLUSIVELY IN ENGLISH.',
      qmTit:'QUICK MENUS', qmPesce:'🐟 Fish', qmCarne:'🥩 Meat',
      qmVeg:'🌿 Vegetarian', qmDeg:'🍽 Tasting', qmFor:'🧀 Cheese',
      terroirTitle:'World Terroir', terroirSub:'327 appellations',
      terroirPh:'🔍  Search appellation, country, grape…',
      prodTitle:'Producers', prodSub:'The wineries that define wine worldwide',
      prodPkg:'CHOOSE YOUR PLAN', prodBeta:'🎁 BETA — free access',
      copyright:'© 2026 SOMMELIER WORLD — REGISTERED TRADEMARK',
      allRights:'All contents protected. Reproduction prohibited.',
      disclaimer:'Sommelier World is an independent editorial project.',
      privacyLnk:'Privacy Policy', termsLnk:'Terms of Service',
    },
    fr: {
      home:'Accueil', sommelier:'Sommelier', terroir:'Terroir', producers:'Producteurs',
      enciclopedia:"L'ENCYCLOPÉDIE MONDIALE",
      newsLive:'🔴 GAZETTE DU VIN', newsArticoli:'articles',
      sapereTit:'LE SAVOIR DU VIN',
      cardSomSub:'Accorder le menu', cardTerSub:'327 appellations',
      cardProdSub:'Domaines excellents', cardSapSub:'Culture et curiosités',
      somTitle:'Sommelier IA', somKicker:'✦ CONSULTER LE SOMMELIER ✦',
      somSubtitle:'Choisissez le vin parfait pour votre menu',
      somMenuLbl:'VOTRE MENU', somMenuPh:'Décrivez le menu — même juste le plat principal.',
      somBudgetLbl:'BUDGET PAR BOUTEILLE', somBudgetUnit:'par bouteille',
      somProfiloLbl:'CARACTÈRE DU VIN SOUHAITÉ',
      somFreschLbl:'FRAÎCHEUR', somCarattLbl:'CARACTÈRE', somCorpoLbl:'CORPS',
      somOrigLbl:'ORIGINE PRÉFÉRÉE (FACULTATIF)',
      somPaeseOpt:'Tout pays', somRegioneOpt:'Toute région',
      somBtn:'✦ CONSULTER LE SOMMELIER ✦',
      somLoading:'Le Sommelier médite…',
      somDisclaimer:'Les conseils sont générés par IA à des fins informatives.',
      somFeedbackQ:'CE CONSEIL VOUS A-T-IL AIDÉ ?',
      somFbGraz:'✓ Merci !', somFbNote:'✓ Noté.',
      aiLang:'RÉPONDS EXCLUSIVEMENT EN FRANÇAIS.',
      qmTit:'MENUS RAPIDES', qmPesce:'🐟 Poisson', qmCarne:'🥩 Viande',
      qmVeg:'🌿 Végétarien', qmDeg:'🍽 Dégustation', qmFor:'🧀 Fromages',
      terroirTitle:'Terroir Mondial', terroirSub:'327 appellations',
      terroirPh:'🔍  Chercher appellation, pays, cépage…',
      prodTitle:'Producteurs', prodSub:'Les domaines qui définissent le vin dans le monde',
      prodPkg:'CHOISISSEZ VOTRE FORMULE', prodBeta:'🎁 BÊTA — accès gratuit',
      copyright:'© 2026 SOMMELIER WORLD — MARQUE DÉPOSÉE',
      allRights:'Tous droits réservés.',
      disclaimer:"Sommelier World est un projet éditorial indépendant.",
      privacyLnk:'Politique de confidentialité', termsLnk:"Conditions d'utilisation",
    },
  },
  t: function(k) {
    return (this.dict[this.current]&&this.dict[this.current][k]!==undefined)
      ? this.dict[this.current][k]
      : (this.dict.it[k]!==undefined?this.dict.it[k]:k);
  },
};

window.getLang = function() { return window.i18n.current; };

// ═══════════════════════════════════════════════════════════
// setLang — GLOBALE
// ═══════════════════════════════════════════════════════════
window.setLang = function(lang) {
  if(!window.i18n.dict[lang]) return;
  window.i18n.current = lang;
  try{localStorage.setItem('sw_lang',lang);}catch(e){}
  ['it','en','fr'].forEach(function(l){
    var b=document.getElementById('lb_'+l);
    if(!b) return;
    var on=(l===lang);
    b.style.background =on?'rgba(212,175,55,.18)':'rgba(255,255,255,.03)';
    b.style.color      =on?'#D4AF37':'rgba(212,175,55,.4)';
    b.style.borderColor=on?'rgba(212,175,55,.4)':'rgba(212,175,55,.2)';
  });
  window._applyI18n();
  document.documentElement.lang=lang;
  window.buildHomeCards();
  try{localStorage.removeItem('sw_arts_day');}catch(e){}
  if(typeof window.loadServerArts==='function') window.loadServerArts();
};

window._applyI18n = function() {
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var v=window.i18n.t(el.getAttribute('data-i18n'));
    if(v&&v!==el.getAttribute('data-i18n')) el.textContent=v;
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(function(el){
    var v=window.i18n.t(el.getAttribute('data-i18n-ph'));
    if(v&&v!==el.getAttribute('data-i18n-ph')) el.placeholder=v;
  });
};

// ═══════════════════════════════════════════════════════════
// showPage — GLOBALE
// ═══════════════════════════════════════════════════════════
window.showPage = function(pageId) {
  document.querySelectorAll('.page').forEach(function(p){
    p.classList.remove('active'); p.style.display='none';
  });
  var target=document.getElementById('page-'+pageId);
  if(target){target.style.display='block';target.classList.add('active');}
  document.querySelectorAll('.ntab').forEach(function(t){
    t.classList.toggle('active',t.dataset.page===pageId);
  });
  window.scrollTo(0,0);
  if(pageId==='explore'){
    setTimeout(function(){
      if(typeof window.renderExploreCountries==='function') window.renderExploreCountries();
    },60);
  }
  if(pageId==='admin'&&window.adminLogged){
    if(typeof window.adminLoadData==='function') window.adminLoadData();
  }
};

window.goBack = function(){ window.showPage('home'); };

// ═══════════════════════════════════════════════════════════
// HOME CARDS — GLOBALE
// ═══════════════════════════════════════════════════════════
window.buildHomeCards = function() {
  var container=document.getElementById('homeCards');
  if(!container) return;
  var T=function(k){return window.i18n.t(k);};
  var cards=[
    {ico:'🍷',title:T('sommelier'),sub:T('cardSomSub'),page:'sommelier',
     bg:'linear-gradient(135deg,#2a0505,#1a0202)',accent:'rgba(128,0,32,.5)'},
    {ico:'🌍',title:T('terroir'),sub:T('cardTerSub'),page:'explore',
     bg:'linear-gradient(135deg,#061508,#030c04)',accent:'rgba(40,130,60,.35)'},
    {ico:'🏆',title:T('producers'),sub:T('cardProdSub'),page:'producers',
     bg:'linear-gradient(135deg,#1e1200,#130c00)',accent:'rgba(212,175,55,.35)'},
    {ico:'📖',title:T('sapereTit'),sub:T('cardSapSub'),page:'explore',
     bg:'linear-gradient(135deg,#08031a,#05020e)',accent:'rgba(100,70,200,.3)'},
  ];
  container.innerHTML='';
  cards.forEach(function(c){
    var d=document.createElement('div');
    d.className='home-card';
    d.style.background=c.bg;
    d.style.borderRight='1px solid '+c.accent;
    d.style.borderBottom='1px solid '+c.accent;
    d.innerHTML='<div class="home-card-ico">'+c.ico+'</div>'+
      '<div class="home-card-tit">'+c.title+'</div>'+
      '<div class="home-card-sub">'+c.sub+'</div>';
    (function(page){d.addEventListener('click',function(){window.showPage(page);});})(c.page);
    container.appendChild(d);
  });
};

// ═══════════════════════════════════════════════════════════
// ▌▌▌ PAYWALL — 3 consultazioni gratuite al giorno ▌▌▌
// ═══════════════════════════════════════════════════════════

/* Chiave giornaliera in localStorage */
window._getTodayKey = function(){
  return 'sw_cons_'+new Date().toISOString().split('T')[0];
};

/* Legge stato Elite dal localStorage */
window.isEliteUser = function(){
  try{return localStorage.getItem('sw_elite')==='1';}catch(e){return false;}
};

/* Legge contatore giornaliero */
window.getConsultazioniOggi = function(){
  try{return parseInt(localStorage.getItem(window._getTodayKey())||'0');}catch(e){return 0;}
};

/**
 * checkConsultazioneLibera()
 * Ritorna TRUE → la consultazione è permessa.
 * Ritorna FALSE → limite raggiunto, mostra il popup paywall.
 * Chiamata da doAbbinamento() e searchWine() in sommelier.js.
 */
window.checkConsultazioneLibera = function(){
  if(window.isEliteUser()) return true; // Elite: illimitato
  var n=window.getConsultazioniOggi();
  if(n>=3){window.showPaywallPopup();return false;}
  try{localStorage.setItem(window._getTodayKey(),n+1);}catch(e){}
  return true;
};

/* Popup paywall elegante */
window.showPaywallPopup = function(){
  var old=document.getElementById('sw-paywall');
  if(old) old.remove();

  var overlay=document.createElement('div');
  overlay.id='sw-paywall';
  overlay.style.cssText=[
    'position:fixed','inset:0','z-index:99999',
    'background:rgba(5,2,1,.9)',
    'backdrop-filter:blur(8px)','-webkit-backdrop-filter:blur(8px)',
    'display:flex','align-items:center','justify-content:center','padding:20px',
  ].join(';');

  overlay.innerHTML=
    '<div id="sw-pw-box" style="background:linear-gradient(160deg,#1c0a04,#0e0502);'+
      'border:1px solid rgba(212,175,55,.45);border-radius:18px;'+
      'max-width:380px;width:100%;padding:36px 26px;text-align:center;'+
      'box-shadow:0 32px 96px rgba(0,0,0,.8);">'+

      /* Calice decorativo */
      '<div style="font-size:2.6rem;margin-bottom:18px;filter:drop-shadow(0 4px 12px rgba(212,175,55,.3));">🍷</div>'+

      /* Titolo */
      '<div style="font-family:Cinzel,serif;font-size:.85rem;letter-spacing:4px;'+
        'color:#D4AF37;margin-bottom:14px;text-shadow:0 2px 8px rgba(212,175,55,.2);">'+
        'IL TUO PALATO MERITA DI PIÙ</div>'+

      /* Corpo */
      '<div style="font-family:\'IM Fell English\',serif;font-style:italic;'+
        'font-size:1.05rem;color:rgba(245,239,226,.78);line-height:1.82;margin-bottom:26px;">'+
        'Hai affinato il tuo palato per oggi.<br>'+
        'Le tue <strong style="color:#fff;font-style:normal;">3 consultazioni gratuite</strong> sono esaurite.<br><br>'+
        'Diventa <strong style="color:#D4AF37;font-style:normal;">Membro Elite</strong> per consultazioni '+
        'illimitate, descrizioni poetiche complete e accesso all\'intero archivio mondiale.'+
      '</div>'+

      /* Prezzo */
      '<div style="background:rgba(212,175,55,.08);border:1px solid rgba(212,175,55,.2);'+
        'border-radius:10px;padding:14px;margin-bottom:22px;">'+
        '<div style="font-family:Cinzel,serif;font-size:1.8rem;font-weight:700;color:#fff;">€2.99'+
          '<span style="font-size:.65rem;color:rgba(212,175,55,.5);"> /mese</span></div>'+
        '<div style="font-family:\'Cormorant Garamond\',serif;font-size:.88rem;'+
          'color:rgba(245,239,226,.45);margin-top:4px;">'+
          'Consultazioni illimitate · Risposte poetiche complete · Nessun limite'+
        '</div>'+
      '</div>'+

      /* CTA principale */
      '<button onclick="window.attivaElite()" '+
        'style="width:100%;padding:16px;background:var(--oro,#D4AF37);color:#0A0A0A;'+
        'font-family:Cinzel,serif;font-size:.68rem;letter-spacing:3px;border:none;'+
        'border-radius:10px;cursor:pointer;font-weight:700;margin-bottom:10px;'+
        'transition:opacity .2s;" onmouseover="this.style.opacity=\'.88\'" onmouseout="this.style.opacity=\'1\'">'+
        '✦ DIVENTA MEMBRO ELITE ✦'+
      '</button>'+

      /* Chiudi */
      '<button onclick="document.getElementById(\'sw-paywall\').remove()" '+
        'style="width:100%;padding:11px;background:transparent;color:rgba(212,175,55,.4);'+
        'font-family:Cinzel,serif;font-size:.52rem;letter-spacing:2px;'+
        'border:1px solid rgba(212,175,55,.18);border-radius:10px;cursor:pointer;">'+
        'Torna domani — consultazioni gratuite reset alle 00:00'+
      '</button>'+

      '<div style="margin-top:14px;font-size:.68rem;color:rgba(245,239,226,.18);'+
        'font-family:\'IM Fell English\',serif;font-style:italic;">'+
        'Il piano si rinnova automaticamente. Annulla in qualsiasi momento.'+
      '</div>'+
    '</div>';

  document.body.appendChild(overlay);
  overlay.addEventListener('click',function(e){if(e.target===overlay)overlay.remove();});
};

/* Istruzioni attivazione Elite */
window.attivaElite = function(){
  var box=document.getElementById('sw-pw-box');
  if(!box) return;
  box.innerHTML=
    '<div style="font-size:2rem;margin-bottom:18px;">✉️</div>'+
    '<div style="font-family:Cinzel,serif;font-size:.78rem;letter-spacing:3px;color:#D4AF37;margin-bottom:14px;">ATTIVAZIONE ELITE</div>'+
    '<div style="font-family:\'Cormorant Garamond\',serif;font-size:1.02rem;color:rgba(245,239,226,.78);line-height:1.85;margin-bottom:22px;">'+
      'Scrivi a <strong style="color:#D4AF37;">elite@sommelierworld.vin</strong><br>'+
      'con oggetto <em style="color:rgba(245,239,226,.6);">"Attiva Elite €2.99"</em>.<br><br>'+
      'Riceverai le istruzioni per attivare il tuo accesso illimitato entro poche ore.'+
    '</div>'+
    '<a href="mailto:elite@sommelierworld.vin?subject=Attiva%20Elite%20%E2%82%AC2.99" '+
      'style="display:block;width:100%;padding:14px;background:rgba(212,175,55,.18);'+
      'border:1.5px solid rgba(212,175,55,.4);border-radius:10px;color:#D4AF37;'+
      'font-family:Cinzel,serif;font-size:.6rem;letter-spacing:2px;text-align:center;'+
      'text-decoration:none;margin-bottom:10px;">✉ SCRIVI ORA</a>'+
    '<button onclick="document.getElementById(\'sw-paywall\').remove()" '+
      'style="width:100%;padding:10px;background:transparent;color:rgba(212,175,55,.35);'+
      'font-family:Cinzel,serif;font-size:.5rem;letter-spacing:2px;'+
      'border:1px solid rgba(212,175,55,.15);border-radius:8px;cursor:pointer;">CHIUDI</button>';
};

/* Attiva/disattiva elite da admin o da codice */
window.setEliteUser = function(active){
  try{localStorage.setItem('sw_elite',active?'1':'0');}catch(e){}
  var badge=document.getElementById('sw-elite-badge');
  if(active&&!badge){
    badge=document.createElement('div');
    badge.id='sw-elite-badge';
    badge.style.cssText='position:fixed;top:8px;right:8px;z-index:9999;'+
      'background:rgba(212,175,55,.18);border:1px solid rgba(212,175,55,.4);'+
      'border-radius:20px;padding:4px 12px;font-family:Cinzel,serif;font-size:.48rem;'+
      'color:#D4AF37;letter-spacing:1px;cursor:pointer;';
    badge.textContent='👑 ELITE';
    badge.title='Membro Elite attivo';
    badge.onclick=function(){if(confirm('Disattivare Elite?'))window.setEliteUser(false);};
    document.body.appendChild(badge);
  } else if(!active&&badge){
    badge.remove();
  }
};

// ═══════════════════════════════════════════════════════════
// TERROIR — renderExploreCountries & filterTerroir
// ═══════════════════════════════════════════════════════════
var _PAESI=[
  {f:'🇮🇹',n:'Italia'},{f:'🇫🇷',n:'Francia'},{f:'🇪🇸',n:'Spagna'},
  {f:'🇺🇸',n:'USA'},{f:'🇩🇪',n:'Germania'},{f:'🇵🇹',n:'Portogallo'},
  {f:'🇦🇷',n:'Argentina'},{f:'🇦🇺',n:'Australia'},{f:'🇬🇷',n:'Grecia'},
  {f:'🇦🇹',n:'Austria'},{f:'🇳🇿',n:'Nuova Zelanda'},{f:'🇨🇱',n:'Cile'},
  {f:'🇬🇪',n:'Georgia'},{f:'🇭🇺',n:'Ungheria'},{f:'🇿🇦',n:'Sud Africa'},
];

window._DENOM=[
  {id:'barolo',name:'Barolo',type:'DOCG',country:'Italia',region:'Piemonte',grapes:'Nebbiolo',desc:'Il Re dei vini italiani. Nebbiolo sulle Langhe calcaree — tannini possenti, longevità leggendaria.'},
  {id:'barbaresco',name:'Barbaresco',type:'DOCG',country:'Italia',region:'Piemonte',grapes:'Nebbiolo',desc:'Nebbiolo elegante e femminile. La sorella nobile del Barolo.'},
  {id:'brunello',name:'Brunello di Montalcino',type:'DOCG',country:'Italia',region:'Toscana',grapes:'Sangiovese Grosso',desc:'Sangiovese Grosso in purezza. Longevo, austero, maestoso.'},
  {id:'chianti',name:'Chianti Classico',type:'DOCG',country:'Italia',region:'Toscana',grapes:'Sangiovese',desc:'Sangiovese nel cuore della Toscana storica tra Firenze e Siena.'},
  {id:'amarone',name:'Amarone della Valpolicella',type:'DOCG',country:'Italia',region:'Veneto',grapes:'Corvina, Rondinella',desc:'Uva appassita, concentrazione assoluta, potenza tannica unica.'},
  {id:'soave',name:'Soave Classico',type:'DOC',country:'Italia',region:'Veneto',grapes:'Garganega',desc:'Garganega minerale su basalto — fresco, sorprendente, sottovalutato.'},
  {id:'etna',name:'Etna',type:'DOC',country:'Italia',region:'Sicilia',grapes:'Nerello Mascalese',desc:'Nerello sul vulcano — il terroir più unico al mondo.'},
  {id:'franciacorta',name:'Franciacorta',type:'DOCG',country:'Italia',region:'Lombardia',grapes:'Chardonnay, Pinot Nero',desc:'Il metodo classico italiano. Il vero rivale dello Champagne.'},
  {id:'taurasi',name:'Taurasi',type:'DOCG',country:'Italia',region:'Campania',grapes:'Aglianico',desc:'Il Barolo del Sud. Aglianico potente e tannico — invecchia 40 anni.'},
  {id:'champagne',name:'Champagne',type:'AOC',country:'Francia',region:'Champagne',grapes:'Chardonnay, Pinot Nero, Meunier',desc:'Metodo classico su calcare cretaceo. Il vino della celebrazione per definizione.'},
  {id:'bourgogne',name:'Bourgogne Rosso',type:'AOC',country:'Francia',region:'Borgogna',grapes:'Pinot Noir',desc:'Pinot Noir sui Grand Cru calcarei di Beaune. La perfezione nel bicchiere.'},
  {id:'chablis',name:'Chablis',type:'AOC',country:'Francia',region:'Borgogna',grapes:'Chardonnay',desc:'Chardonnay su kimmeridgiano. Mineralità assoluta, acidità tagliente.'},
  {id:'bordeaux',name:'Bordeaux',type:'AOC',country:'Francia',region:'Bordeaux',grapes:'Cabernet Sauvignon, Merlot',desc:'Cabernet e Merlot sulla Gironde. La leggenda enologica mondiale.'},
  {id:'cdp',name:'Châteauneuf-du-Pape',type:'AOC',country:'Francia',region:'Rodano',grapes:'Grenache, Syrah, Mourvèdre',desc:'Grenache su galets roulés. Potenza solare, calore mediterraneo.'},
  {id:'sauternes',name:'Sauternes',type:'AOC',country:'Francia',region:'Bordeaux',grapes:'Sémillon, Sauvignon',desc:'Botrytis nobile, concentrazione dolce inarrivabile. Il grande dessert wine.'},
  {id:'rioja',name:'Rioja',type:'DOCa',country:'Spagna',region:'Rioja',grapes:'Tempranillo',desc:'Tempranillo con invecchiamento in botti americane. Gran Reserva leggendario.'},
  {id:'ribera',name:'Ribera del Duero',type:'DO',country:'Spagna',region:'Castilla y León',grapes:'Tempranillo',desc:'Tempranillo in altura. Struttura imponente, concentrazione intensa.'},
  {id:'priorat',name:'Priorat',type:'DOCa',country:'Spagna',region:'Catalogna',grapes:'Grenache, Carignan',desc:'Grenache centenaria su llicorella scura. Potenza tellurica inarrivabile.'},
  {id:'mosel',name:'Mosel Riesling',type:'Prädikat',country:'Germania',region:'Mosel',grapes:'Riesling',desc:'Ardesia blu devoniana, pendii eroici al 70%. I Riesling più longevi: 60 anni.'},
  {id:'rheingau',name:'Rheingau Riesling',type:'Prädikat',country:'Germania',region:'Rheingau',grapes:'Riesling',desc:'Riesling secco su quarzite. Eleganza renana, acidità cristallina.'},
  {id:'napa',name:'Napa Valley Cabernet',type:'AVA',country:'USA',region:'California',grapes:'Cabernet Sauvignon',desc:'Il Cabernet che sconfisse Bordeaux nel 1976. Opulento, ricco, storico.'},
  {id:'oregon',name:'Willamette Valley Pinot',type:'AVA',country:'USA',region:'Oregon',grapes:'Pinot Noir',desc:'Pinot Noir elegante nel Nuovo Mondo. Borgogna oltreoceano.'},
  {id:'mendoza',name:'Mendoza Malbec',type:'DOC',country:'Argentina',region:'Mendoza',grapes:'Malbec',desc:'Malbec delle Ande a 900-1500m. Tannini unici per irraggiamento estremo.'},
  {id:'porto',name:'Porto Vintage',type:'DOC',country:'Portogallo',region:'Douro',grapes:'Touriga Nacional',desc:'Il vino fortificato più nobile. Vintage dichiarato solo in anni eccezionali.'},
  {id:'vinhov',name:'Vinho Verde',type:'DOC',country:'Portogallo',region:'Minho',grapes:'Alvarinho, Loureiro',desc:'Leggermente frizzante, fresco e leggero. Il bianco atlantico portoghese.'},
  {id:'assyrtiko',name:'Santorini Assyrtiko',type:'PDO',country:'Grecia',region:'Santorini',grapes:'Assyrtiko',desc:'Alberello su pomice vulcanica. Mineralità marina assoluta. Vino immortale.'},
  {id:'xinomavro',name:'Naoussa Xinomavro',type:'PDO',country:'Grecia',region:'Naoussa',grapes:'Xinomavro',desc:'Il Barolo greco. Tannini possenti, acidità elevata, longevità straordinaria.'},
  {id:'wachau',name:'Wachau Grüner Veltliner',type:'DAC',country:'Austria',region:'Wachau',grapes:'Grüner Veltliner',desc:'Smaragd: la categoria più alta. Bianco austriaco di straordinaria complessità.'},
  {id:'barossa',name:'Barossa Shiraz',type:'GI',country:'Australia',region:'Barossa Valley',grapes:'Shiraz',desc:'Viti centenarie pre-fillossera. Lo Shiraz più ricco e concentrato del pianeta.'},
  {id:'tokaj',name:'Tokaji Aszú',type:'PDO',country:'Ungheria',region:'Tokaj',grapes:'Furmint, Hárslevelű',desc:'"Vino dei Re, Re dei Vini". Botrytis nobile, dolcezza e acidità immortali.'},
  {id:'kakheti',name:'Kakheti Rkatsiteli',type:'PDO',country:'Georgia',region:'Kakheti',grapes:'Rkatsiteli',desc:'Vino in anfora kvevri. 8000 anni di storia — la culla della civiltà del vino.'},
];

window.EFLAGS={
  'Italia':'🇮🇹','Francia':'🇫🇷','Spagna':'🇪🇸','USA':'🇺🇸',
  'Germania':'🇩🇪','Portogallo':'🇵🇹','Argentina':'🇦🇷','Cile':'🇨🇱',
  'Australia':'🇦🇺','Nuova Zelanda':'🇳🇿','Grecia':'🇬🇷','Austria':'🇦🇹',
  'Ungheria':'🇭🇺','Georgia':'🇬🇪','Sud Africa':'🇿🇦'
};

window.renderExploreCountries=function(){
  var cont=document.getElementById('expCountries');
  if(!cont) return;
  cont.innerHTML='<div style="font-family:Cinzel,serif;font-size:.5rem;letter-spacing:3px;color:rgba(212,175,55,.5);margin-bottom:12px;">ESPLORA PER PAESE</div>'+
    '<div style="display:flex;flex-wrap:wrap;gap:7px;">'+
    _PAESI.map(function(p){
      return '<button style="padding:8px 13px;background:rgba(212,175,55,.07);border:1px solid rgba(212,175,55,.22);'+
        'border-radius:20px;color:rgba(245,239,226,.78);font-size:.82rem;cursor:pointer;transition:all .2s;'+
        'font-family:Cinzel,serif;letter-spacing:.05em;" '+
        'onclick="filterTerroir(\''+p.n+'\')" '+
        'onmouseover="this.style.background=\'rgba(128,0,32,.25)\';this.style.borderColor=\'rgba(212,175,55,.6)\'" '+
        'onmouseout="this.style.background=\'rgba(212,175,55,.07)\';this.style.borderColor=\'rgba(212,175,55,.22)\'">' +
        p.f+' '+p.n+'</button>';
    }).join('')+'</div>';
};

window.filterTerroir=function(query){
  var res=document.getElementById('terroirResults');
  if(!res) return;
  if(!query||query.trim().length<2){res.innerHTML='';return;}
  var q=query.toLowerCase().trim();
  var results=window._DENOM.filter(function(d){
    return d.name.toLowerCase().includes(q)||d.country.toLowerCase().includes(q)||
           d.region.toLowerCase().includes(q)||d.grapes.toLowerCase().includes(q)||
           d.type.toLowerCase().includes(q)||d.desc.toLowerCase().includes(q);
  });
  if(!results.length){
    res.innerHTML='<p style="color:rgba(245,239,226,.4);font-style:italic;padding:12px 4px;font-family:\'Cormorant Garamond\',serif;font-size:.95rem;line-height:1.7;">Nessun risultato per "<em>'+query+'</em>".<br>Prova: Barolo · Champagne · Napa · Mosel · Tokaj…</p>';
    return;
  }
  var tc={DOCG:'#D4AF37',DOC:'rgba(212,175,55,.7)',AOC:'#a0c8ff',DOCa:'#ffb080',
          PDO:'#b0ffb0',AVA:'#ffaaaa',Prädikat:'#d0aaff',DAC:'#ffe08a',GI:'#aaddff'};
  res.innerHTML='<div style="font-family:Cinzel,serif;font-size:.48rem;letter-spacing:3px;color:rgba(212,175,55,.5);margin-bottom:12px;">'+
    results.length+' RISULTAT'+(results.length===1?'O':'I')+'</div>'+
    results.map(function(d){
      var c=tc[d.type]||'rgba(212,175,55,.6)';
      return '<div style="padding:14px 14px 12px;margin-bottom:8px;background:rgba(255,255,255,.03);'+
        'border:1px solid rgba(212,175,55,.12);border-radius:8px;cursor:pointer;transition:background .18s;" '+
        'onclick="window.openDenomDetail&&window.openDenomDetail(\''+d.id+'\')" '+
        'onmouseover="this.style.background=\'rgba(128,0,32,.18)\'" '+
        'onmouseout="this.style.background=\'rgba(255,255,255,.03)\'">'+
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;">'+
          '<span style="font-family:Cinzel,serif;font-size:.42rem;letter-spacing:1px;padding:2px 8px;background:'+c+'1a;color:'+c+';border:1px solid '+c+'55;border-radius:10px;">'+d.type+'</span>'+
          '<strong style="font-family:\'Playfair Display\',serif;font-size:1.05rem;color:#fff;">'+d.name+'</strong>'+
        '</div>'+
        '<div style="font-family:Cinzel,serif;font-size:.44rem;letter-spacing:1px;color:rgba(212,175,55,.55);margin-bottom:5px;">'+(window.EFLAGS[d.country]||'🌍')+' '+d.country+' · '+d.region+'</div>'+
        '<div style="font-family:\'IM Fell English\',serif;font-style:italic;font-size:.9rem;color:rgba(245,239,226,.6);line-height:1.55;">'+d.desc+'</div>'+
        '<div style="margin-top:6px;font-family:Cinzel,serif;font-size:.42rem;letter-spacing:1px;color:rgba(212,175,55,.38);">🍇 '+d.grapes+'</div>'+
      '</div>';
    }).join('');
};

// ═══════════════════════════════════════════════════════════
// COOKIE CONSENT
// ═══════════════════════════════════════════════════════════
window.acceptCookies=function(){try{localStorage.setItem('sw_cookie','1');}catch(e){}var b=document.getElementById('cookieBanner');if(b)b.style.display='none';};
window.rejectCookies=function(){var b=document.getElementById('cookieBanner');if(b)b.style.display='none';};

// ═══════════════════════════════════════════════════════════
// ADMIN (tutto GLOBALE)
// ═══════════════════════════════════════════════════════════
window.ADMIN_PWD=''; window.adminLogged=false;

window.checkAdmin=function(){
  var pwd=(document.getElementById('adminPwd')||{}).value||'';
  if(pwd==='sommelier2026'){
    window.ADMIN_PWD=pwd; window.adminLogged=true;
    var login=document.getElementById('adminLogin'); var panel=document.getElementById('adminPanel');
    if(login)login.style.display='none'; if(panel)panel.style.display='block';
    window.adminLoadData();
  }else{
    var err=document.getElementById('adminErr');
    if(err){err.style.display='block';setTimeout(function(){err.style.display='none';},3000);}
  }
};

window.adminLogout=function(){
  window.adminLogged=false; window.ADMIN_PWD='';
  var login=document.getElementById('adminLogin'); var panel=document.getElementById('adminPanel');
  if(login)login.style.display='block'; if(panel)panel.style.display='none';
};

window.adminSwitchTab=function(tab){
  ['produttori','articoli'].forEach(function(t){
    var sec=document.getElementById('adminSec_'+t); var btn=document.getElementById('adminBtn_'+t);
    var on=t===tab;
    if(sec)sec.style.display=on?'block':'none';
    if(btn){btn.style.background=on?'rgba(212,175,55,.18)':'transparent';
            btn.style.color=on?'#D4AF37':'rgba(212,175,55,.4)';
            btn.style.borderBottom=on?'2px solid #D4AF37':'2px solid transparent';}
  });
};

window.adminLoadData=async function(){
  try{
    var rp=await fetch(window.SERVER_URL+'/api/producers?secret='+window.ADMIN_PWD);
    var dp=rp.ok?await rp.json():{pending:[],approved:[]};
    var pending=dp.pending||[], approved=dp.approved||[];
    var statsEl=document.getElementById('adminStatsProd');
    if(statsEl)statsEl.innerHTML=[{ico:'📋',val:pending.length,lab:'In attesa'},{ico:'✅',val:approved.length,lab:'Approvati'},{ico:'👥',val:pending.length+approved.length,lab:'Totale'}].map(function(s){return '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(212,175,55,.15);border-radius:8px;padding:12px;text-align:center;flex:1;"><div style="font-size:1.2rem;">'+s.ico+'</div><div style="font-family:Cinzel,serif;font-size:1.1rem;color:#D4AF37;">'+s.val+'</div><div style="font-size:9px;letter-spacing:2px;color:rgba(245,239,226,.3);">'+s.lab+'</div></div>';}).join('');
    var pEl=document.getElementById('adminPending');
    if(pEl)pEl.innerHTML=pending.length?pending.map(function(p){return '<div style="display:flex;align-items:center;gap:10px;padding:10px;margin-bottom:6px;background:rgba(255,255,255,.03);border:1px solid rgba(212,175,55,.1);border-radius:6px;"><div style="flex:1;"><div style="font-family:Cinzel,serif;font-size:.68rem;color:#F5EFE2;">'+(p.name||'')+'</div><div style="font-size:.8rem;color:rgba(245,239,226,.4);">'+(p.email||'')+' · '+(p.package||'')+'</div></div><button onclick="window.adminApprove(\''+p.id+'\')" style="padding:5px 10px;background:rgba(40,180,80,.1);border:1px solid rgba(40,180,80,.3);border-radius:4px;color:#5dde8a;font-size:11px;cursor:pointer;">✓</button><button onclick="window.adminReject(\''+p.id+'\')" style="padding:5px 10px;background:rgba(200,50,50,.1);border:1px solid rgba(200,50,50,.3);border-radius:4px;color:#f88;font-size:11px;cursor:pointer;">✗</button></div>';}).join(''):'<p style="color:rgba(245,239,226,.3);font-style:italic;padding:10px 0;">Nessuna richiesta in attesa.</p>';
    var aEl=document.getElementById('adminApproved');
    if(aEl)aEl.innerHTML=approved.length?approved.map(function(p){return '<div style="display:flex;align-items:center;gap:10px;padding:9px;margin-bottom:5px;background:rgba(40,180,80,.04);border:1px solid rgba(40,180,80,.12);border-radius:6px;"><div style="flex:1;font-family:Cinzel,serif;font-size:.65rem;color:rgba(245,239,226,.75);">'+(p.name||'')+'</div><span style="font-family:Cinzel,serif;font-size:.42rem;letter-spacing:1px;padding:2px 8px;border-radius:10px;background:rgba(212,175,55,.12);color:rgba(212,175,55,.7);">'+(p.package||'')+'</span></div>';}).join(''):'<p style="color:rgba(245,239,226,.3);font-style:italic;padding:10px 0;">Nessun produttore ancora.</p>';
  }catch(e){console.warn('[Admin]',e.message);}
  window.adminLoadArticles();
};

window.adminLoadArticles=async function(){
  var el=document.getElementById('adminArtList'); var stats=document.getElementById('adminArtStats');
  if(!el)return;
  try{
    var r=await fetch(window.SERVER_URL+'/api/articles');
    var data=r.ok?await r.json():[];
    var ai=data.filter(function(a){return a.generato_ai;}).length;
    if(stats)stats.innerHTML=[{ico:'📰',val:data.length,lab:'Totali'},{ico:'🤖',val:ai,lab:'AI'},{ico:'✍️',val:data.length-ai,lab:'Manuali'}].map(function(s){return '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(212,175,55,.15);border-radius:8px;padding:12px;text-align:center;flex:1;"><div style="font-size:1.2rem;">'+s.ico+'</div><div style="font-family:Cinzel,serif;font-size:1.1rem;color:#D4AF37;">'+s.val+'</div><div style="font-size:9px;letter-spacing:2px;color:rgba(245,239,226,.3);">'+s.lab+'</div></div>';}).join('');
    if(!data.length){el.innerHTML='<p style="color:rgba(245,239,226,.3);font-style:italic;padding:10px 0;">Nessun articolo ancora.</p>';return;}
    el.innerHTML=data.map(function(a){var tit=a.titolo_it||a.titolo||'(senza titolo)';return '<div style="display:flex;align-items:center;gap:10px;padding:10px;margin-bottom:6px;background:rgba(255,255,255,.03);border:1px solid rgba(212,175,55,.08);border-radius:6px;"><span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:rgba(245,239,226,.75);font-size:13px;">'+(a.generato_ai?'🤖 ':'✍️ ')+tit+'</span><span style="font-size:10px;color:rgba(212,175,55,.35);flex-shrink:0;">'+(a.data||'')+'</span><button onclick="window.adminDeleteArt(\''+a.id+'\')" style="padding:4px 10px;background:rgba(200,50,50,.1);border:1px solid rgba(200,50,50,.3);border-radius:4px;color:#f88;font-size:10px;cursor:pointer;flex-shrink:0;">🗑</button></div>';}).join('');
  }catch(e){el.textContent='Errore: '+e.message;}
};

window.adminGenArts=async function(){
  var btn=document.getElementById('btnGenArts'); var st=document.getElementById('adminGenStatus');
  if(btn)btn.disabled=true; if(st)st.textContent='⏳ Generazione in corso… (2-3 minuti)';
  try{
    var r=await fetch(window.SERVER_URL+'/api/articles/generate?secret='+window.ADMIN_PWD);
    var d=await r.json();
    if(st)st.textContent=r.ok?'✓ '+d.count+' articoli generati!':'✗ Errore: '+(d.error||r.status);
    if(r.ok)setTimeout(function(){window.adminLoadArticles();if(typeof window.loadServerArts==='function')window.loadServerArts();},1000);
  }catch(e){if(st)st.textContent='✗ '+e.message;}
  finally{if(btn)btn.disabled=false;}
};

window.adminSaveArt=async function(){
  var tit=(document.getElementById('artTitolo')||{}).value||'';
  var cat=(document.getElementById('artCat')||{}).value||'';
  var img=(document.getElementById('artImg')||{}).value||'';
  var txt=(document.getElementById('artTesto')||{}).value||'';
  var st=document.getElementById('adminSaveStatus');
  if(!tit.trim()||!txt.trim()){if(st){st.style.color='#f88';st.textContent='✗ Titolo e testo obbligatori.';}return;}
  try{
    if(st){st.style.color='rgba(212,175,55,.5)';st.textContent='⏳ Salvataggio…';}
    var today=new Date().toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'});
    var art={id:'manual_'+Date.now(),generato_ai:false,
      titolo_it:tit,titolo_en:tit,titolo_fr:tit,
      categoria_it:cat,categoria_en:cat,categoria_fr:cat,
      testo_it:txt,testo_en:txt,testo_fr:txt,
      immagine:img||'',autore:'Sommelier World',data:today,
      isNews:cat.toLowerCase().includes('news')};
    var r=await fetch(window.SERVER_URL+'/api/articles/save?secret='+window.ADMIN_PWD,
      {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(art)});
    var d=await r.json();
    if(r.ok){
      if(st){st.style.color='#5dde8a';st.textContent='✓ Articolo pubblicato!';}
      ['artTitolo','artImg','artTesto'].forEach(function(id){var e=document.getElementById(id);if(e)e.value='';});
      setTimeout(function(){
        window.adminLoadArticles();
        if(typeof window.syncAfterAdminSave==='function')window.syncAfterAdminSave();
        else if(typeof window.loadServerArts==='function')window.loadServerArts();
      },800);
    }else{if(st){st.style.color='#f88';st.textContent='✗ '+(d.error||'Errore server');}}
  }catch(e){if(st){st.style.color='#f88';st.textContent='✗ '+e.message;}}
};

window.adminDeleteArt=async function(id){
  if(!confirm('Eliminare? Operazione irreversibile.'))return;
  try{
    var r=await fetch(window.SERVER_URL+'/api/articles/delete/'+id+'?secret='+window.ADMIN_PWD,{method:'DELETE'});
    if(r.ok)window.adminLoadArticles();
    else{var d=await r.json();alert('Errore: '+(d.error||r.status));}
  }catch(e){alert(e.message);}
};

window.adminApprove=async function(id){try{await fetch(window.SERVER_URL+'/api/producers/approve/'+id+'?secret='+window.ADMIN_PWD,{method:'POST'});window.adminLoadData();}catch(e){alert(e.message);}};
window.adminReject=async function(id){try{await fetch(window.SERVER_URL+'/api/producers/reject/'+id+'?secret='+window.ADMIN_PWD,{method:'POST'});window.adminLoadData();}catch(e){alert(e.message);}};

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded',function(){
  try{var saved=localStorage.getItem('sw_lang');if(saved&&window.i18n.dict[saved])window.i18n.current=saved;else window.i18n.current='it';}catch(e){window.i18n.current='it';}

  ['it','en','fr'].forEach(function(l){
    var b=document.getElementById('lb_'+l); if(!b)return;
    var on=(l===window.i18n.current);
    b.style.background=on?'rgba(212,175,55,.18)':'rgba(255,255,255,.03)';
    b.style.color=on?'#D4AF37':'rgba(212,175,55,.4)';
    b.style.borderColor=on?'rgba(212,175,55,.4)':'rgba(212,175,55,.2)';
  });

  window._applyI18n();
  window.buildHomeCards();

  ['acidita','morbidezza','struttura'].forEach(function(id){var s=document.getElementById(id);if(s)s.style.setProperty('--pct','50%');});
  var regEl=document.getElementById('wineRegione');if(regEl)regEl.disabled=true;

  try{if(!localStorage.getItem('sw_cookie')){var b=document.getElementById('cookieBanner');if(b)b.style.display='block';}}catch(e){}

  /* Elite badge se già attivo */
  if(window.isEliteUser()) window.setEliteUser(true);

  /* Fade-up */
  if(window.IntersectionObserver){
    var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});},{threshold:.1,rootMargin:'0px 0px -30px 0px'});
    document.querySelectorAll('.fade-up').forEach(function(el){io.observe(el);});
    if(window.MutationObserver){new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType!==1)return;if(n.classList&&n.classList.contains('fade-up'))io.observe(n);if(n.querySelectorAll)n.querySelectorAll('.fade-up:not(.visible)').forEach(function(el){io.observe(el);});});});}).observe(document.body,{childList:true,subtree:true});}
  }

  /* 7 tap sul copyright → Admin */
  var _ft=0,_fT=null;
  var fc=document.getElementById('footerCopyright');
  if(fc){
    fc.style.cursor='default';
    fc.addEventListener('click',function(){
      _ft++;clearTimeout(_fT);_fT=setTimeout(function(){_ft=0;},2500);
      if(_ft>=7){_ft=0;var tab=document.getElementById('adminTab');if(tab){var h=(tab.style.display==='none'||tab.style.display==='');tab.style.display=h?'flex':'none';if(h)window.showPage('admin');}}
    });
  }

  if(window.location.search.includes('admin=1')){var aTab=document.getElementById('adminTab');if(aTab)aTab.style.display='flex';setTimeout(function(){window.showPage('admin');},300);}

  window.openReader  =function(art){if(typeof openArticleReader==='function')openArticleReader(art);};
  window.closeArticle=function(){if(typeof closeArticleReader==='function')closeArticleReader();};
  window.goBack      =function(){window.showPage('home');};

  console.log('[SW] navigation.js v26 — lingua:',window.i18n.current,'— elite:',window.isEliteUser());
});
