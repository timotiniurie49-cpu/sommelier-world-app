/**
 * SOMMELIER WORLD — navigation.js v26
 * ─────────────────────────────────────────────────────────────
 * Tutte le funzioni sono window.xxx — nessun closure chiuso.
 * NUOVO: Paywall 3 consultazioni/giorno. Elite €2.99/mese illimitato.
 */

window.SRV        = 'https://hidden-term-f2d0.timotiniurie49.workers.dev'; /* Cloudflare Worker */
window.SERVER_URL = window.SRV; /* Worker Cloudflare — nessun Railway */

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
    ru: {
      home:'Главная', sommelier:'Сомелье', terroir:'Терруар', producers:'Производители',
      enciclopedia:'МИРОВАЯ ЭНЦИКЛОПЕДИЯ',
      newsLive:'🔴 НОВОСТИ ВИНА', newsArticoli:'статей',
      sapereTit:'О ВИНЕ',
      cardSomSub:'Подберите вино к меню', cardTerSub:'327 апелласьонов мира',
      cardProdSub:'Лучшие виноделы', cardSapSub:'Культура и любопытные факты',
      somTitle:'ИИ-Сомелье', somKicker:'✦ КОНСУЛЬТАЦИЯ СОМЕЛЬЕ ✦',
      somSubtitle:'Выберите идеальное вино для вашего меню',
      somMenuLbl:'ВАШЕ МЕНЮ', somMenuPh:'Опишите меню — хотя бы основное блюдо.',
      somBudgetLbl:'БЮДЖЕТ НА БУТЫЛКУ', somBudgetUnit:'за бутылку',
      somProfiloLbl:'ЖЕЛАЕМЫЙ ХАРАКТЕР ВИНА',
      somFreschLbl:'СВЕЖЕСТЬ', somCarattLbl:'ХАРАКТЕР', somCorpoLbl:'ТЕЛО',
      somOrigLbl:'ПРЕДПОЧТИТЕЛЬНОЕ ПРОИСХОЖДЕНИЕ',
      somPaeseOpt:'Любая страна', somRegioneOpt:'Любой регион',
      somBtn:'✦ КОНСУЛЬТАЦИЯ СОМЕЛЬЕ ✦',
      somLoading:'Сомелье размышляет…',
      somDisclaimer:'Рекомендации сгенерированы ИИ в информационных целях.',
      somFeedbackQ:'СОВЕТ БЫЛ ПОЛЕЗЕН?',
      somFbGraz:'✓ Спасибо!', somFbNote:'✓ Учтём ваш отзыв.',
      aiLang:'ОТВЕЧАЙ ИСКЛЮЧИТЕЛЬНО НА РУССКОМ ЯЗЫКЕ.',
      qmTit:'БЫСТРЫЕ МЕНЮ', qmPesce:'🐟 Рыба', qmCarne:'🥩 Мясо',
      qmVeg:'🌿 Вегетарианское', qmDeg:'🍽 Дегустация', qmFor:'🧀 Сыры',
      terroirTitle:'Мировой Терруар', terroirSub:'327 апелласьонов',
      terroirPh:'🔍  Поиск апелласьона, страны, сорта…',
      prodTitle:'Производители', prodSub:'Виноделы, определяющие вино мира',
      prodPkg:'ВЫБЕРИТЕ ПЛАН', prodBeta:'🎁 БЕТА — бесплатный доступ',
      copyright:'© 2026 SOMMELIER WORLD — ЗАРЕГИСТРИРОВАННЫЙ БРЕНД',
      allRights:'Все права защищены.',
      disclaimer:'Sommelier World — независимый редакционный проект.',
      privacyLnk:'Политика конфиденциальности', termsLnk:'Условия использования',
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
  if(!window.i18n || !window.i18n.dict[lang]) return;
  window.i18n.current = lang;
  try{ localStorage.setItem('sw_lang', lang); } catch(e){}

  /* 1. Aggiorna bottoni lingua */
  ['it','en','fr','ru'].forEach(function(l){
    var b = document.getElementById('lb_'+l); if(!b) return;
    var on = (l === lang);
    b.style.background  = on ? 'rgba(212,175,55,.18)' : 'rgba(255,255,255,.03)';
    b.style.color       = on ? '#D4AF37' : 'rgba(212,175,55,.4)';
    b.style.fontWeight  = on ? '700' : '400';
    b.style.borderColor = on ? 'rgba(212,175,55,.4)' : 'rgba(212,175,55,.18)';
  });

  /* 2. Aggiorna tutti i testi dell'interfaccia */
  window._applyI18n();

  /* 3. Aggiorna carousel con cache esistente (non aspetta AI) */
  if(window._arts && window._trCache) {
    window._arts.forEach(function(a){
      window._trCache.applyToArt(a, lang);
    });
  }
  if(typeof window.renderSlides === 'function') window.renderSlides();
  if(typeof window.renderSapere === 'function') window.renderSapere([]);

  /* 4. Avvia traduzione in background solo se AI disponibile */
  if(lang !== 'it' && typeof window.translateAndRefresh === 'function') {
    setTimeout(function(){ window.translateAndRefresh(lang); }, 400);
  }
};

window._applyI18n = function() {
  var lang = window.i18n ? window.i18n.current : 'it';
  var T = window.i18n ? window.i18n.dict[lang] : {};

  /* Testi data-i18n */
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var k = el.getAttribute('data-i18n');
    var v = T[k] || k;
    if(v !== k) el.textContent = v;
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(function(el){
    var k = el.getAttribute('data-i18n-ph');
    var v = T[k] || k;
    if(v !== k) el.placeholder = v;
  });

  /* Nav tabs */
  var NAV = {
    it:{home:'Home',sommelier:'Sommelier',terroir:'Terroir',producers:'Produttori',eventi:'Eventi'},
    en:{home:'Home',sommelier:'Sommelier',terroir:'Terroir',producers:'Producers',eventi:'Events'},
    fr:{home:'Accueil',sommelier:'Sommelier',terroir:'Terroir',producers:'Producteurs',eventi:'Événements'},
    ru:{home:'Главная',sommelier:'Сомелье',terroir:'Терруар',producers:'Производители',eventi:'События'},
  };
  var nl = NAV[lang] || NAV.it;
  document.querySelectorAll('.ntab').forEach(function(tab){
    var page = tab.getAttribute('data-page');
    var lbl  = tab.querySelector('.lbl');
    if(lbl && nl[page]) lbl.textContent = nl[page];
  });

  /* Home card sub-titoli */
  var HC = {
    it:{ter:'327 denominazioni mondiali',prod:"Cantine d'eccellenza",ev:'Agenda 2026',som:'Abbina il vino al menu'},
    en:{ter:'327 world appellations',prod:'Excellence wineries',ev:'Agenda 2026',som:'Pair wine with your menu'},
    fr:{ter:'327 appellations',prod:"Domaines d'excellence",ev:'Agenda 2026',som:'Accorder le menu'},
    ru:{ter:'327 апелласьонов',prod:'Лучшие виноделы',ev:'Программа 2026',som:'Подобрать вино к меню'},
  };
  var hc = HC[lang] || HC.it;
  var subs = document.querySelectorAll('.home-card-sub');
  /* Cerca per contenuto */
  subs.forEach(function(el){
    var t = el.textContent.trim();
    if(t.includes('denominaz')||t.includes('appellation')||t.includes('апелласьон')) el.textContent=hc.ter;
    else if(t.includes('Cantin')||t.includes('winer')||t.includes('виноделы')||t.includes('Domaine')) el.textContent=hc.prod;
    else if(t.includes('genda')||t.includes('Программ')) el.textContent=hc.ev;
    else if(t.includes('Abbina')||t.includes('Pair')||t.includes('Accord')||t.includes('Подобр')) el.textContent=hc.som;
  });

  /* Footer */
  var FT = {
    it:'© 2026 SOMMELIER WORLD — MARCHIO REGISTRATO',
    en:'© 2026 SOMMELIER WORLD — REGISTERED TRADEMARK',
    fr:'© 2026 SOMMELIER WORLD — MARQUE DÉPOSÉE',
    ru:'© 2026 SOMMELIER WORLD — ЗАРЕГИСТРИРОВАННЫЙ БРЕНД',
  };
  var fc = document.getElementById('footerCopyright');
  if(fc) {
    var onc = fc.getAttribute('onclick');
    fc.textContent = FT[lang] || FT.it;
    if(onc) fc.setAttribute('onclick', onc);
  }

  /* Sommelier page: titolo e kicker */
  var SOM = {
    it:{tit:'Sommelier AI',sub:'Il tuo sommelier personale per il menu'},
    en:{tit:'AI Sommelier',sub:'Your personal sommelier for the menu'},
    fr:{tit:'Sommelier IA',sub:'Votre sommelier personnel pour le menu'},
    ru:{tit:'ИИ-Сомелье',sub:'Ваш личный сомелье для меню'},
  };
  var sm = SOM[lang]||SOM.it;
  var st = document.querySelector('#page-sommelier [data-i18n="somTitle"]');
  if(st) st.textContent = sm.tit;
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
  if(pageId==='eventi'){
    setTimeout(function(){
      if(typeof window.renderEventi==='function') window.renderEventi('page');
    },60);
  }
};

window.goBack = function(){ window.showPage('home'); };

// ═══════════════════════════════════════════════════════════
// HOME CARDS — GLOBALE
// ═══════════════════════════════════════════════════════════
window.buildHomeCards = function() {
  /* La home è ora statica in HTML — buildHomeCards non sovrascrive più */
  /* Aggiorna solo le etichette i18n se necessario */
  window._applyI18n();
  return; /* exit early — no dynamic card rebuild */
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

  /* ═══ ITALIA — estese ═══ */
  {id:'valpolicella',name:'Valpolicella',type:'DOC',country:'Italia',region:'Veneto',grapes:'Corvina, Corvinone, Rondinella',desc:'Base del Ripasso e dell\'Amarone. Fruttato, fresco, versatile nella sua versione classica.'},
  {id:'ripasso',name:'Valpolicella Ripasso',type:'DOC',country:'Italia',region:'Veneto',grapes:'Corvina, Corvinone, Rondinella',desc:'Il "povero uomo dell\'Amarone". Rifermentato sulle vinacce dell\'Amarone — struttura e profondità inattese.'},
  {id:'recioto',name:'Recioto della Valpolicella',type:'DOCG',country:'Italia',region:'Veneto',grapes:'Corvina, Rondinella',desc:'Vino dolce da appassimento. L\'Amarone nasce da una refermentazione accidentale di questo.'},
  {id:'montepulciano',name:'Montepulciano d\'Abruzzo',type:'DOC',country:'Italia',region:'Abruzzo',grapes:'Montepulciano',desc:'Potenza e calore adriatico. Produttori come Valentini lo hanno elevato a vino da meditazione.'},
  {id:'sagrantino',name:'Sagrantino di Montefalco',type:'DOCG',country:'Italia',region:'Umbria',grapes:'Sagrantino',desc:'Il vino con più tannini al mondo. 14-16g/l di polifenoli. Lunghissimo affinamento obbligatorio.'},
  {id:'verdicchio',name:'Verdicchio dei Castelli di Jesi',type:'DOC',country:'Italia',region:'Marche',grapes:'Verdicchio',desc:'Il grande bianco marchigiano. Mineralità salmastra, acidità brillante, lunghissimo affinamento possibile.'},
  {id:'nerelloetna',name:'Etna Rosso',type:'DOC',country:'Italia',region:'Sicilia',grapes:'Nerello Mascalese',desc:'Vigne pre-fillossera su lava basaltica. Eleganza borgognona con mineralità vulcanica unica.'},
  {id:'carricante',name:'Etna Bianco',type:'DOC',country:'Italia',region:'Sicilia',grapes:'Carricante',desc:'Bianco vulcanico straordinario. Acidità tagliente, mineralità basaltica, longevità inaspettata.'},
  {id:'cannonau',name:'Cannonau di Sardegna',type:'DOC',country:'Italia',region:'Sardegna',grapes:'Cannonau (Grenache)',desc:'Il vino dei centenari. Sardi tra la gente più longeva al mondo — correlazione studiata dai nutrizionisti.'},
  {id:'vernaccia',name:'Vernaccia di San Gimignano',type:'DOCG',country:'Italia',region:'Toscana',grapes:'Vernaccia',desc:'Il primo vino italiano a ottenere la DOC nel 1966. Bianco toscano con note amare e minerali.'},
  {id:'timorasso',name:'Colli Tortonesi Timorasso',type:'DOC',country:'Italia',region:'Piemonte',grapes:'Timorasso',desc:'Il "Riesling italiano". Bianco piemontese dalla struttura e longevità straordinarie. Walter Massa lo ha salvato dall\'estinzione.'},
  {id:'barberaasti',name:'Barbera d\'Asti',type:'DOCG',country:'Italia',region:'Piemonte',grapes:'Barbera',desc:'Il vino popolare del Piemonte diventato nobile. Acidità naturale elevatissima, profumi di ciliegia e viola.'},
  {id:'dolcetto',name:'Dolcetto d\'Alba',type:'DOC',country:'Italia',region:'Piemonte',grapes:'Dolcetto',desc:'Il vino quotidiano delle Langhe. Tannini morbidi, frutto immediato, bassa acidità. Perfetto con i tajarin.'},
  {id:'gavi',name:'Gavi',type:'DOCG',country:'Italia',region:'Piemonte',grapes:'Cortese',desc:'Il bianco elegante del Piemonte. Cortese su suolo argilloso-calcareo. Fresco, floreale, da aperitivo.'},
  {id:'roero',name:'Roero Arneis',type:'DOCG',country:'Italia',region:'Piemonte',grapes:'Arneis',desc:'Il "Barolo Bianco". Vitigno quasi estinto, salvato da Bruno Giacosa. Floreale, morbido, delicato.'},
  {id:'aglianico',name:'Aglianico del Vulture',type:'DOC',country:'Italia',region:'Basilicata',grapes:'Aglianico',desc:'Suolo vulcanico del Monte Vulture. Tannini possenti come il Taurasi, ma con mineralità lavica diversa.'},
  {id:'primitivo',name:'Primitivo di Manduria',type:'DOP',country:'Italia',region:'Puglia',grapes:'Primitivo (Zinfandel)',desc:'Lo stesso vitigno dello Zinfandel californiano. Caldo, ricco, alcolico. Da Manduria le versioni più concentrate.'},
  {id:'negro',name:'Negro Amaro',type:'IGT',country:'Italia',region:'Puglia',grapes:'Negroamaro',desc:'Il cuore rosso del Salento. Salice Salentino, Copertino: vini caldi e avvolgenti dall\'anima mediterranea.'},
  {id:'gewurz',name:'Alto Adige Gewürztraminer',type:'DOC',country:'Italia',region:'Alto Adige',grapes:'Gewürztraminer',desc:'Il vitigno ha origine in Tramin (Termeno) in Alto Adige. Profumi di rosa e litchi. Irresistibile e avvolgente.'},
  {id:'pinot_grigio',name:'Pinot Grigio delle Venezie',type:'DOC',country:'Italia',region:'Friuli-Venezia Giulia',grapes:'Pinot Grigio',desc:'Il bianco italiano più esportato al mondo. Fresco, leggero, versatile. Le migliori versioni in Friuli e Trentino.'},
  {id:'ribolla',name:'Ribolla Gialla',type:'DOC',country:'Italia',region:'Friuli-Venezia Giulia',grapes:'Ribolla Gialla',desc:'Il bianco friulano per eccellenza. Joško Gravner lo ha reso famoso in versione arancio con macerazione kvevri.'},
  {id:'tocai',name:'Tocai Friulano',type:'DOC',country:'Italia',region:'Friuli-Venezia Giulia',grapes:'Friulano',desc:'Il vino identitario del Friuli. Mandorlato, sapido, con finale amarognolo tipico. Un calice dopo l\'altro.'},

  /* ═══ FRANCIA — estese ═══ */
  {id:'pomerol',name:'Pomerol',type:'AOC',country:'Francia',region:'Bordeaux',grapes:'Merlot, Cabernet Franc',desc:'Pétrus nasce qui su argilla blu. Merlot su suolo pesante: vini opulenti e vellutati di potenza assoluta.'},
  {id:'stestephe',name:'Saint-Estèphe',type:'AOC',country:'Francia',region:'Bordeaux',grapes:'Cabernet Sauvignon, Merlot',desc:'Il più tannico e longevo dei comuni bordolesi. Cos d\'Estournel e Montrose: classicismo assoluto.'},
  {id:'pauillac',name:'Pauillac',type:'AOC',country:'Francia',region:'Bordeaux',grapes:'Cabernet Sauvignon',desc:'Tre Premiers Grands Crus: Lafite, Latour, Mouton Rothschild. Il Cabernet Sauvignon nella sua espressione più aristocratica.'},
  {id:'muscadet',name:'Muscadet',type:'AOC',country:'Francia',region:'Loira',grapes:'Melon de Bourgogne',desc:'Sur lie — affinato sui lieviti morti per mesi o anni. Il grande bianco atlantico, compagno insostituibile delle ostriche bretoni.'},
  {id:'vouvrай',name:'Vouvray',type:'AOC',country:'Francia',region:'Loira',grapes:'Chenin Blanc',desc:'Chenin Blanc sulla tuffeau della Loira. Secco, demi-sec o moelleux secondo l\'annata. Longevo come un grande Borgogna.'},
  {id:'alsace_ries',name:'Alsace Riesling',type:'AOC',country:'Francia',region:'Alsazia',grapes:'Riesling',desc:'Grand Cru Schlossberg e Rangen: il Riesling alsaziano è il più secco e strutturato. Terroir di granito e gneiss.'},
  {id:'alsace_gew',name:'Alsace Gewürztraminer',type:'AOC',country:'Francia',region:'Alsazia',grapes:'Gewürztraminer',desc:'La versione più esplosiva del vitigno. Profumi di litchi, rosa, spezie esotiche. Trimbach e Zind-Humbrecht tra i maestri.'},
  {id:'condrieu',name:'Condrieu',type:'AOC',country:'Francia',region:'Rodano',grapes:'Viognier',desc:'Il Viognier nella sua culla. Pendii di granito rosa. Profumi di albicocca e violetta. Poche bottiglie, prezzi stellari.'},
  {id:'gigondas',name:'Gigondas',type:'AOC',country:'Francia',region:'Rodano',grapes:'Grenache, Syrah',desc:'Il "piccolo Châteauneuf" alla portata di tutti. Suolo di argilla rossa e galets. Potente e caldo come il sole provenzale.'},
  {id:'coteaux',name:'Coteaux du Layon',type:'AOC',country:'Francia',region:'Loira',grapes:'Chenin Blanc',desc:'I grandi dolci della Loira. Botrytis nobile su Chenin Blanc — dolcezza e acidità in dialogo per decenni.'},

  /* ═══ SPAGNA — estese ═══ */
  {id:'albariño',name:'Rías Baixas Albariño',type:'DO',country:'Spagna',region:'Galizia',grapes:'Albariño',desc:'Il più grande bianco spagnolo. Atlantico, salino, con profumi di pesca bianca e agrumi. Perfetto con i frutti di mare galiziani.'},
  {id:'garnacha',name:'Campo de Borja Garnacha',type:'DO',country:'Spagna',region:'Aragona',grapes:'Garnacha',desc:'Vigne centenarie a piede franco su suolo argilloso. Garnacha potente e fruttata a prezzi ancora accessibili.'},
  {id:'verdejo',name:'Rueda Verdejo',type:'DO',country:'Spagna',region:'Castilla y León',grapes:'Verdejo',desc:'Il bianco secco e aromatico di Castiglia. Fresco, erbaceo, con note di finocchio selvatico. Da bere giovane.'},
  {id:'manzanilla',name:'Manzanilla de Sanlúcar',type:'DO',country:'Spagna',region:'Andalusia',grapes:'Palomino',desc:'Lo Sherry più salino e delicato. Affinato a Sanlúcar de Barrameda dove la flor di lieviti cresce più spessa per la brezza marina.'},
  {id:'vega_cava',name:'Cava',type:'DO',country:'Spagna',region:'Catalogna',grapes:'Macabeo, Xarel·lo, Parellada',desc:'Metodo classico spagnolo. La risposta iberica allo Champagne. Da Penedès con uva autoctona — fresco e vivace.'},

  /* ═══ GERMANIA — estese ═══ */
  {id:'spätburgunder',name:'Baden Spätburgunder',type:'QmP',country:'Germania',region:'Baden',grapes:'Spätburgunder (Pinot Noir)',desc:'Il Pinot Nero tedesco. Baden, al confine con l\'Alsazia, produce i rossi tedeschi più importanti — eleganti come i cugini borgognoni.'},
  {id:'troken_ries',name:'Pfalz Riesling Trocken',type:'Prädikat',country:'Germania',region:'Pfalz',grapes:'Riesling',desc:'Il Riesling secco e strutturato del Palatinato. Suolo di arenaria rossa e calcare. Müller-Catoir ne è il maestro.'},

  /* ═══ PORTOGALLO — estese ═══ */
  {id:'alentejo_tinto',name:'Alentejo Tinto',type:'DOC',country:'Portogallo',region:'Alentejo',grapes:'Aragonez, Trincadeira, Alicante Bouschet',desc:'Il rosso del Portogallo meridionale. Caldo e fruttato come il suo territorio. Herdade do Esporão e Mouchão tra i nomi di riferimento.'},
  {id:'verde_alv',name:'Vinho Verde Alvarinho',type:'DOC',country:'Portogallo',region:'Minho',grapes:'Alvarinho',desc:'La versione premium del Vinho Verde. Da Melgaço e Monção, al confine con la Galizia spagnola: struttura e longevità inattese.'},
  {id:'madeira',name:'Madeira',type:'DOC',country:'Portogallo',region:'Madeira',grapes:'Sercial, Verdelho, Bual, Malmsey',desc:'Il vino immortale. Riscaldato nelle estufas — sopravvive secoli. Bottiglie del 1800 ancora straordinarie. Unico al mondo.'},

  /* ═══ NUOVO MONDO ═══ */
  {id:'marlborough_sb',name:'Marlborough Sauvignon Blanc',type:'GI',country:'Nuova Zelanda',region:'Marlborough',grapes:'Sauvignon Blanc',desc:'Il Sauvignon Blanc che ha conquistato il mondo. Cloudy Bay nel 1985 ha cambiato tutto. Frutto tropicale e peperone verde.'},
  {id:'mcLaren',name:'McLaren Vale Shiraz',type:'GI',country:'Australia',region:'McLaren Vale',grapes:'Shiraz',desc:'Lo Shiraz del Sud Australia. Suolo di argilla rossa su calcare. D\'Arenberg e Clarendon Hills: diverso dalla potenza della Barossa, più elegante.'},
  {id:'malbec_alto',name:'Luján de Cuyo Malbec',type:'DOC',country:'Argentina',region:'Mendoza',grapes:'Malbec',desc:'La culla del Malbec argentino. Suolo alluvionale a 900m. Catena Zapata Adrianna Vineyard: il grand cru delle Ande.'},
  {id:'torrontes',name:'Cafayate Torrontés',type:'DOC',country:'Argentina',region:'Salta',grapes:'Torrontés',desc:'Il bianco autoctono argentino più interessante. Aromi di rosa e gelsomino. Ad alta quota a Cafayate esprime grande freschezza.'},
  {id:'pinotage',name:'Stellenbosch Pinotage',type:'WO',country:'Sud Africa',region:'Stellenbosch',grapes:'Pinotage',desc:'L\'incrocio sudafricano tra Pinot Noir e Cinsault. Kanonkop è il produttore di riferimento mondiale. Tabacco e frutti neri.'},
  {id:'chenin_sa',name:'Swartland Chenin Blanc',type:'WO',country:'Sud Africa',region:'Swartland',grapes:'Chenin Blanc',desc:'Le vigne vecchie del Swartland producono il Chenin Blanc più interessante fuori dalla Loira. Sadie Family wines ne è il simbolo.'},

  /* ═══ GRECIA — estese ═══ */
  {id:'nemea',name:'Nemea Agiorgitiko',type:'PDO',country:'Grecia',region:'Peloponneso',grapes:'Agiorgitiko',desc:'Il vitigno rosso greco più piantato. Vellutato, fruttato, facile da amare. Le migliori versioni invecchiano splendidamente.'},
  {id:'retsina',name:'Retsina',type:'PDO',country:'Grecia',region:'Attica',grapes:'Savatiano, Roditis',desc:'Il vino greco più antico: aromatizzato con resina di pino (terebinto). Un sapore che divide — ma con la cucina greca è perfetto.'},

  /* ═══ AUSTRIA — estese ═══ */
  {id:'grüner_kamptal',name:'Kamptal Grüner Veltliner',type:'DAC',country:'Austria',region:'Kamptal',grapes:'Grüner Veltliner',desc:'Il Grüner del Kamptal su suolo di loess e gneiss. Hirsch e Bründlmayer: bianchi secchi e longevissimi con note di pepe bianco.'},
  {id:'blaufrankisch',name:'Mittelburgenland Blaufränkisch',type:'DAC',country:'Austria',region:'Burgenland',grapes:'Blaufränkisch',desc:'Il grande rosso austriaco. Suolo di argilla blu. Acidità brillante, tannini presenti, profumi di frutti di bosco e spezie.'},
  {id:'steirische',name:'Steirische Klassik',type:'DAC',country:'Italia',region:'Steiermark',grapes:'Sauvignon Blanc, Welschriesling',desc:'I bianchi freschi della Stiria. Sauvignon Blanc erbaceo e preciso — più austero e meno tropicale della Nuova Zelanda.'},

  /* ═══ UNGHERIA — estese ═══ */
  {id:'egri_bikaver',name:'Egri Bikavér',type:'PDO',country:'Ungheria',region:'Eger',grapes:'Kadarka, Kékfrankos',desc:'"Sangue di Toro di Eger". Blend rosso ungherese storico. La leggenda dice che i soldati magiari lo bevessero prima delle battaglie.'},
  {id:'villany',name:'Villány Cabernet Franc',type:'PDO',country:'Ungheria',region:'Villány',grapes:'Cabernet Franc',desc:'Il Cabernet Franc più meridionale d\'Europa. Suolo di calcare. Bock e Gere producono versioni che reggono il confronto con la Loira.'},

  /* ═══ ITALIA — completamento ═══ */
  {id:'trento_doc',name:'Trento DOC',type:'DOC',country:'Italia',region:'Trentino',grapes:'Chardonnay, Pinot Nero',desc:'Il metodo classico delle Dolomiti. Ferrari è l\'ambasciatore mondiale — le bollicine servite alle Nazioni Unite. Acidità alpina e finezza irraggiungibili in pianura.'},
  {id:'valtellina',name:'Valtellina Superiore',type:'DOCG',country:'Italia',region:'Lombardia',grapes:'Nebbiolo (Chiavennasca)',desc:'Nebbiolo eroico su terrazze di granito a 300-700m. I terrazzamenti sono patrimonio UNESCO. Sassella, Grumello, Inferno, Valgella: quattro cru di grandissima personalità.'},
  {id:'sforzato',name:'Sforzato di Valtellina',type:'DOCG',country:'Italia',region:'Lombardia',grapes:'Nebbiolo',desc:'Nebbiolo appassito delle Alpi — l\'Amarone delle montagne. Minimo 14% alcol, struttura possente, longevità trentennale.'},
  {id:'lugana',name:'Lugana',type:'DOC',country:'Italia',region:'Lombardia/Veneto',grapes:'Turbiana',desc:'Il bianco del Lago di Garda. Turbiana su suolo argilloso glaciale — mineralità lacustre, freschezza alpina. Zenato e Ca\' dei Frati i produttori di riferimento.'},
  {id:'oltrepo',name:'Oltrepò Pavese Metodo Classico',type:'DOCG',country:'Italia',region:'Lombardia',grapes:'Pinot Nero',desc:'Il più grande areale italiano di Pinot Nero. Metodo classico poco conosciuto ma di grande qualità. Il Pinot Nero in purezza raggiunge qui espressioni sorprendenti.'},
  {id:'bardolino',name:'Bardolino',type:'DOC',country:'Italia',region:'Veneto',grapes:'Corvina, Rondinella, Molinara',desc:'Il vino leggero e fresco del Lago di Garda. Perfetto da bere giovane, in estate, a 14°C. Il Chiaretto è uno dei rosati più eleganti d\'Italia.'},
  {id:'custoza',name:'Bianco di Custoza',type:'DOC',country:'Italia',region:'Veneto',grapes:'Garganega, Trebbiano, Cortese',desc:'Il bianco fresco e floreale del Garda orientale. Blend aromatico di grande versatilità gastronomica — perfetto con antipasti di lago e pesce d\'acqua dolce.'},
  {id:'colli_euganei',name:'Colli Euganei',type:'DOC',country:'Italia',region:'Veneto',grapes:'Moscato, Merlot, Cabernet',desc:'I Colli Euganei, isole vulcaniche nella pianura veneta, producono vini varietali di grande personalità. Il Fior d\'Arancio Moscato è DOCG — dolce, profumato, unico.'},
  {id:'collio',name:'Collio',type:'DOC',country:'Italia',region:'Friuli-Venezia Giulia',grapes:'Pinot Grigio, Friulano, Ribolla',desc:'Il bianco più elegante del Friuli. Ponca — alternanza di marne e arenarie — costruisce bianchi di struttura e mineralità eccezionali. Schiopetto e Venica i maestri.'},
  {id:'ramandolo',name:'Ramandolo',type:'DOCG',country:'Italia',region:'Friuli-Venezia Giulia',grapes:'Verduzzo Friulano',desc:'Vino dolce naturale dai colli di Nimis. Verduzzo appassito su piante vecchie — ambra, miele, mandorla amara, acidità vibrante. Raro e prezioso.'},
  {id:'colli_orientali',name:'Colli Orientali del Friuli',type:'DOC',country:'Italia',region:'Friuli-Venezia Giulia',grapes:'Friulano, Schioppettino, Pignolo',desc:'La zona dei vitigni autoctoni friulani. Schioppettino speziato, Pignolo tannico e longevo, Friulano sapido: tre personalità irripetibili del Friuli storico.'},
  {id:'carso',name:'Carso',type:'DOC',country:'Italia',region:'Friuli-Venezia Giulia',grapes:'Vitovska, Terrano',desc:'Il vino del Carso triestino su roccia calcarea carsica. Vitovska bianco di grande mineralità. Terrano rosso ruvido e ferroso — il vino dei pastori del Carso.'},
  {id:'terlano',name:'Alto Adige Terlano',type:'DOC',country:'Italia',region:'Alto Adige',grapes:'Pinot Bianco, Sauvignon, Chardonnay',desc:'La cantina di Terlano vinifica dal 1893 e conserva bottiglie del 1955 ancora perfette. Il bianco più longevo d\'Italia — mineralità di porfido, freschezza alpina perenne.'},
  {id:'lagrein',name:'Alto Adige Lagrein',type:'DOC',country:'Italia',region:'Alto Adige',grapes:'Lagrein',desc:'Il rosso autoctono altoatesino per eccellenza. Colore violaceo intenso, profumi di mirtillo e cioccolato, tannini vellutati. Kretzer: la versione rosata di grande eleganza.'},
  {id:'santa_maddalena',name:'Santa Maddalena Classico',type:'DOC',country:'Italia',region:'Alto Adige',grapes:'Schiava',desc:'Il vino rosso più bevuto in Alto Adige. Schiava leggera e fruttata, da bere giovane e fresca. Accompagna la cucina tirolese con naturalezza secolare.'},
  {id:'valpantena',name:'Valpantena',type:'DOC',country:'Italia',region:'Veneto',grapes:'Corvina, Corvinone',desc:'La quarta valle della Valpolicella — meno nota ma ugualmente capace di grandi Amarone. Bertani vinifica qui dal 1858 con metodi tradizionali intoccabili.'},
  {id:'bianco_alcamo',name:'Alcamo',type:'DOC',country:'Italia',region:'Sicilia',grapes:'Catarratto, Grillo',desc:'Il bianco storico della Sicilia occidentale. Catarratto fresco e profumato, Grillo strutturato — oggi rinati grazie ai produttori moderni che puntano sulla freschezza.'},
  {id:'cerasuolo',name:'Cerasuolo di Vittoria',type:'DOCG',country:'Italia',region:'Sicilia',grapes:'Nero d\'Avola, Frappato',desc:'L\'unica DOCG siciliana. Nero d\'Avola strutturato + Frappato fresco e floreale = equilibrio raro. COS e Arianna Occhipinti ne sono i più famosi interpreti mondiali.'},
  {id:'nerello',name:'Nerello Cappuccio',type:'DOC',country:'Italia',region:'Sicilia',grapes:'Nerello Cappuccio',desc:'Il compagno del Nerello Mascalese sull\'Etna. Meno longevo ma più fruttato e morbido — aggiunge colore e rotondità agli assemblaggi etnei di grande carattere.'},
  {id:'fiano',name:'Fiano di Avellino',type:'DOCG',country:'Italia',region:'Campania',grapes:'Fiano',desc:'Il grande bianco dell\'Irpinia. Su suoli vulcanici ad Avellino sviluppa una complessità e longevità rare per un bianco meridionale — nocciola tostata, miele, zolfo nobile.'},
  {id:'greco_tufo',name:'Greco di Tufo',type:'DOCG',country:'Italia',region:'Campania',grapes:'Greco',desc:'Bianco campano su suolo di tufo vulcanico. Acidità viva, mineralità sulfurea, corpo pieno. Feudi di San Gregorio e Mastroberardino i produttori storici di riferimento.'},
  {id:'primitivo_salento',name:'Primitivo del Salento',type:'IGT',country:'Italia',region:'Puglia',grapes:'Primitivo',desc:'Il Salento più caldo d\'Italia produce Primitivo ricchi, intensi, avvolgenti. Diversi dal Manduria — meno strutturati ma più immediati e gourmand. Da bere giovani.'},
  {id:'castel_del_monte',name:'Castel del Monte',type:'DOC',country:'Italia',region:'Puglia',grapes:'Nero di Troia, Bombino Bianco',desc:'La denominazione del Castel del Monte federiciano. Nero di Troia: vitigno pugliese nobile e austero, tannico, capace di grande invecchiamento. Rivera il produttore storico.'},
  {id:'cirò',name:'Cirò',type:'DOC',country:'Italia',region:'Calabria',grapes:'Gaglioppo',desc:'Il vino più antico della Calabria — probabilmente il Krimisa offerto agli atleti olimpici greci. Gaglioppo su suolo argilloso: rustico da giovane, affascinante con gli anni.'},
  {id:'vermentino_gallura',name:'Vermentino di Gallura',type:'DOCG',country:'Italia',region:'Sardegna',grapes:'Vermentino',desc:'L\'unica DOCG sarda. Vermentino su granito della Gallura — il più strutturato e longevo d\'Italia. Capichera e Siddura producono versioni di livello internazionale.'},
  {id:'carignano',name:'Carignano del Sulcis',type:'DOC',country:'Italia',region:'Sardegna',grapes:'Carignano',desc:'Viti centenarie pre-fillossera nell\'isola di Sant\'Antioco. Il Carignano sardo produce vini di concentrazione e complessità straordinarie — Terre Brune di Santadi è il simbolo.'},
  {id:'morellino',name:'Morellino di Scansano',type:'DOCG',country:'Italia',region:'Toscana',grapes:'Sangiovese',desc:'Il Sangiovese della Maremma — più caldo, più morbido, più immediato del Chianti. Colori intensi, frutti neri, tannini rotondi. Da bere tra i 3 e i 10 anni.'},
  {id:'bolgheri',name:'Bolgheri',type:'DOC',country:'Italia',region:'Toscana',grapes:'Cabernet Sauvignon, Merlot, Cabernet Franc',desc:'La costa toscana dove nacquero i Super Tuscan. Sassicaia, Ornellaia, Masseto: i tre pilastri di un areale che nel 1972 non aveva denominazione e oggi è leggenda mondiale.'},
  {id:'montecucco',name:'Montecucco Sangiovese',type:'DOCG',country:'Italia',region:'Toscana',grapes:'Sangiovese',desc:'Alle pendici del Monte Amiata, Sangiovese su suoli vulcanici di grande mineralità. Il futuro della Toscana — prezzi ancora accessibili, qualità già altissima.'},
  {id:'nobile',name:'Vino Nobile di Montepulciano',type:'DOCG',country:'Italia',region:'Toscana',grapes:'Prugnolo Gentile',desc:'Sangiovese (detto Prugnolo) sulle colline di Montepulciano. Il terzo grande rosso toscano dopo Barolo... pardon: dopo Brunello e Chianti. Poliziano e Avignonesi i simboli.'},
  {id:'vernaccia_sardegna',name:'Vernaccia di Oristano',type:'DOC',country:'Italia',region:'Sardegna',grapes:'Vernaccia',desc:'Il vino sardo più antico e misterioso. Affinamento ossidativo in botti non colmate — sviluppa note di mandorla, curry, zafferano. Simile allo Sherry ma completamente sardo.'},

  /* ═══ DENOMINAZIONI MONDIALI AGGIUNTIVE ═══ */
  {id:'barossa_eden',name:'Eden Valley Riesling',type:'GI',country:'Australia',region:'Eden Valley',grapes:'Riesling',desc:'Il Riesling più freddo d\'Australia. Henschke Julius e Pewsey Vale: acidità tagliente, mineralità di ardesia, longevità trentennale. Rivaleggia con la Mosella.'},
  {id:'coonawarra',name:'Coonawarra Cabernet',type:'GI',country:'Australia',region:'South Australia',grapes:'Cabernet Sauvignon',desc:'Terra rossa su calcare — il suolo più famoso d\'Australia. Wynns e Penola producono Cabernet di struttura e eleganza che reggono vent\'anni di bottiglia.'},
  {id:'hunter_semillon',name:'Hunter Valley Sémillon',type:'GI',country:'Australia',region:'New South Wales',grapes:'Sémillon',desc:'Il bianco più originale d\'Australia. Vendemmiato presto a bassa gradazione, invecchia 20 anni sviluppando note tostate di straordinaria complessità. Tyrrells il maestro.'},
  {id:'central_otago',name:'Central Otago Pinot Noir',type:'GI',country:'Nuova Zelanda',region:'Central Otago',grapes:'Pinot Noir',desc:'Il Pinot Noir più meridionale del mondo. Clima continentale estremo, escursioni termiche di 25°C. Felton Road e Rippon producono i Pinot più eleganti del Nuovo Mondo.'},
  {id:'hawkes_bay',name:'Hawke\'s Bay Syrah',type:'GI',country:'Nuova Zelanda',region:'Hawke\'s Bay',grapes:'Syrah',desc:'La Côte-Rôtie della Nuova Zelanda. Syrah su suolo ghiaioso di origine fluviale — pepe bianco, olive nere, struttura elegante. Trinity Hill e Craggy Range i protagonisti.'},
  {id:'casablanca_valley',name:'Casablanca Valley',type:'DO',country:'Cile',region:'Casablanca',grapes:'Sauvignon Blanc, Chardonnay, Pinot Noir',desc:'La valle fresca cilena raffreddata dall\'Oceano Pacifico. Sauvignon Blanc erbaceo e minerale, Chardonnay elegante. Viña Casablanca e Concha y Toro i pionieri.'},
  {id:'colchagua',name:'Colchagua Valley',type:'DO',country:'Cile',region:'Valle Central',grapes:'Carménère, Cabernet Sauvignon',desc:'Il cuore del Carménère cileno. Vitigno bordolese creduto estinto in Europa, scoperto in Cile nel 1994. Casa Lapostolle Clos Apalta: uno dei 100 migliori vini del mondo.'},
  {id:'uco_valley',name:'Uco Valley',type:'DOC',country:'Argentina',region:'Mendoza',grapes:'Malbec, Cabernet Franc',desc:'L\'alta quota argentina a 1.000-1.500m. Gualtallary e Las Compuertas: i grand cru del Malbec mondiale. Escursioni di 20°C costruiscono acidità e tannini irripetibili.'},
  {id:'naoussa',name:'Naoussa',type:'PDO',country:'Grecia',region:'Macedonia',grapes:'Xinomavro',desc:'Il Barolo greco. Xinomavro su suolo calcareo a 350m — tannini possenti, acidità elevata, profumi di pomodoro secco e olive. Tsiakkas e Kyr-Yianni i produttori storici.'},
  {id:'mantinia',name:'Mantinia',type:'PDO',country:'Grecia',region:'Peloponneso',grapes:'Moschofilero',desc:'A 650m sull\'Altopiano dell\'Arcadia, il Moschofilero produce il bianco greco più aromatico. Profumi di rosa e litchi, acidità brillante, struttura delicata. Tselepos il maestro.'},
  {id:'alsace_pinot_gris',name:'Alsace Pinot Gris Grand Cru',type:'AOC',country:'Francia',region:'Alsazia',grapes:'Pinot Gris',desc:'Il Pinot Grigio nella sua massima espressione. Sui Grand Cru alsaziani — Schlossberg, Rangen — raggiunge complessità e longevità che lo rendono incomparabile al fratello italiano.'},
  {id:'saint_emilion',name:'Saint-Émilion Grand Cru',type:'AOC',country:'Francia',region:'Bordeaux',grapes:'Merlot, Cabernet Franc',desc:'La collina di Merlot: terroir argilloso su calcare dà vini morbidi e opulenti. Cheval Blanc e Ausone al vertice — due visioni opposte dello stesso terroir straordinario.'},
  {id:'graves',name:'Pessac-Léognan',type:'AOC',country:'Francia',region:'Bordeaux',grapes:'Cabernet Sauvignon, Sémillon',desc:'La zona dei grandi bianchi secchi di Bordeaux. Haut-Brion e La Mission Haut-Brion: rossi leggendari e bianchi di mineralità assoluta su ghiaia drenante.'},
  {id:'anjou',name:'Anjou Rouge',type:'AOC',country:'Francia',region:'Loira',grapes:'Cabernet Franc',desc:'Il Cabernet Franc della Loira — il territorio originale di questo vitigno. Chinon, Bourgueil, Saint-Nicolas: rossi freschi, vegetali in senso nobile, da bere freschi tra 10-16°C.'},
  {id:'st_joseph',name:'Saint-Joseph',type:'AOC',country:'Francia',region:'Rodano Settentrionale',grapes:'Syrah, Marsanne',desc:'Il Rodano settentrionale più accessibile. Syrah su granito — pepe bianco, violetta, olive nere — senza la potenza estrema di Hermitage. I rossi più eleganti del Rodano.'},
  {id:'crozes',name:'Crozes-Hermitage',type:'AOC',country:'Francia',region:'Rodano Settentrionale',grapes:'Syrah, Marsanne, Roussanne',desc:'Il grande fratello minore di Hermitage. Su suolo alluvionale produce Syrah dal rapporto qualità/prezzo imbattibile. Jaboulet Aîné e Chapoutier i produttori storici.'},
  {id:'bairrada',name:'Bairrada',type:'DOC',country:'Portogallo',region:'Beiras',grapes:'Baga',desc:'Il Baga — vitigno tannico e acido — su suolo argilloso-calcareo produce rossi di grande longevità. Luis Pato, il ribelle del Bairrada, ha rivoluzionato questa denominazione.'},
  {id:'dao_port',name:'Dão',type:'DOC',country:'Portogallo',region:'Centro',grapes:'Touriga Nacional, Encruzado',desc:'Circondato da montagne di granito, il Dão produce i rossi più eleganti del Portogallo continentale. Touriga Nacional sobria e fragrante. Encruzado bianco di grande struttura.'},
  {id:'moscatel_setubal',name:'Moscatel de Setúbal',type:'DOC',country:'Portogallo',region:'Setúbal',grapes:'Moscatel de Setúbal',desc:'Il grande dolce portoghese — il vino preferito di Napoleone. José Maria da Fonseca produce versioni con 20, 30, 40 anni di affinamento ossidativo. Magnifico con il cioccolato.'},
  {id:'ribeiro',name:'Ribeiro',type:'DO',country:'Spagna',region:'Galizia',grapes:'Treixadura, Godello, Lado',desc:'La Galizia bianca dell\'interno. Treixadura su granito fluviale — aromatico, fresco, minerale. Ancora poco conosciuto fuori dalla Spagna — grande scoperta per gli appassionati.'},
  {id:'bierzo',name:'Bierzo',type:'DO',country:'Spagna',region:'Castilla y León',grapes:'Mencía',desc:'Mencía su slate e quarzite a 500m. Álvaro Palacios ha scoperto qui viti centenarie che producono vini di eleganza borgognona a prezzi ancora ragionevoli. Da scoprire urgentemente.'},
  {id:'terra_alta',name:'Terra Alta',type:'DO',country:'Spagna',region:'Catalogna',grapes:'Garnacha Blanca',desc:'La Garnacha Bianca più importante della Spagna. A 500m di quota, in un paesaggio quasi lunare, produce bianchi di grande struttura e acidità — completamente dimenticati fuori dalla regione.'},
  {id:'la_mancha',name:'La Mancha',type:'DO',country:'Spagna',region:'Castilla-La Mancha',grapes:'Airén, Tempranillo',desc:'La più grande denominazione vinicola del mondo: 190.000 ettari. Airén — il vitigno più coltivato della Terra — produce bianchi leggeri e freschi. I migliori Tempranillo a prezzo imbattibile.'},
  {id:'wachau_gruner',name:'Wachau Grüner Veltliner Smaragd',type:'DAC',country:'Austria',region:'Wachau',grapes:'Grüner Veltliner',desc:'La massima espressione del Grüner Veltliner. Su terrazze di gneiss sul Danubio, Rudi Pichler e Hirtzberger producono bianchi di 40 anni di longevità. Pepe bianco, mineralità assoluta.'},
  {id:'kremstal',name:'Kremstal Riesling',type:'DAC',country:'Austria',region:'Kremstal',grapes:'Riesling',desc:'Il Riesling austriaco su suolo di loess e gneiss. Nigl produce il più famoso — Privat Riesling che rivaleggia con i Grand Cru della Mosella. Fresco, minerale, durevole.'},
  {id:'pfalz_ries',name:'Pfalz Riesling',type:'QmP',country:'Germania',region:'Pfalz',grapes:'Riesling',desc:'Il Pfalz è la regione vinicola più calda della Germania — Riesling più morbidi e fruttati del Mosel. Müller-Catoir produce versioni leggendarie da singoli vigneti storici.'},
  {id:'franken',name:'Franken Silvaner',type:'QmP',country:'Germania',region:'Franken',grapes:'Silvaner',desc:'Il Silvaner nella sua culla — in bottiglie Bocksbeutel, le uniche a forma piatta. Terroir di calcare di Keuper: vino terroso, minerale, austero. Juliusspital il produttore storico.'},
  {id:'pinotage_swart',name:'Swartland Pinotage',type:'WO',country:'Sud Africa',region:'Swartland',grapes:'Pinotage',desc:'Il Swartland, scoperto da Eben Sadie nel 2000, è oggi la zona più eccitante del Sud Africa. Viti vecchie di Pinotage su suolo di scisto — concentrazione e eleganza mai viste prima.'},
  {id:'elgin',name:'Elgin Pinot Noir',type:'WO',country:'Sud Africa',region:'Elgin',grapes:'Pinot Noir',desc:'La zona più fresca del Sud Africa a 250m di altitudine. La freschezza atlantica produce Pinot Noir di finezza borgognona — Paul Cluver il pioniere di questa valle di mele e vino.'},
  {id:'rkatsiteli_geo',name:'Kakheti Rkatsiteli Amber',type:'PDO',country:'Georgia',region:'Kakheti',grapes:'Rkatsiteli',desc:'Vino arancio in kvevri — 6 mesi di macerazione sulle bucce. Color ambra intenso, tannini bianchi, ossidazione controllata. Pheasant\'s Tears e Alaverdi lo portano nel mondo.'},
  {id:'mtsvane',name:'Kartli Mtsvane',type:'PDO',country:'Georgia',region:'Kartli',grapes:'Mtsvane',desc:'Vitigno autoctono georgiano di grande finezza. In Kartli, su suolo argilloso-calcareo, produce bianchi floreali e aromatici — una rarità quasi sconosciuta fuori dalla Georgia.'},
];

window.EFLAGS={
  'Italia':'🇮🇹','Francia':'🇫🇷','Spagna':'🇪🇸','USA':'🇺🇸',
  'Germania':'🇩🇪','Portogallo':'🇵🇹','Argentina':'🇦🇷','Cile':'🇨🇱',
  'Australia':'🇦🇺','Nuova Zelanda':'🇳🇿','Grecia':'🇬🇷','Austria':'🇦🇹',
  'Ungheria':'🇭🇺','Georgia':'🇬🇪','Sud Africa':'🇿🇦'
};

/* ══════════════════════════════════════════
   TERROIR ACCORDION — inizializza per ogni paese
   ══════════════════════════════════════════ */
window.renderExploreCountries = function() {
  var grid = document.getElementById('terroir-flag-grid');
  if(!grid) return;

  var PAESI = [
    {key:'Italia',      flag:'🇮🇹', bg:'rgba(0,100,50,.15)'},
    {key:'Francia',     flag:'🇫🇷', bg:'rgba(0,50,150,.15)'},
    {key:'Spagna',      flag:'🇪🇸', bg:'rgba(180,50,0,.15)'},
    {key:'Portogallo',  flag:'🇵🇹', bg:'rgba(0,100,50,.15)'},
    {key:'Germania',    flag:'🇩🇪', bg:'rgba(20,20,20,.3)'},
    {key:'Austria',     flag:'🇦🇹', bg:'rgba(180,0,30,.15)'},
    {key:'Grecia',      flag:'🇬🇷', bg:'rgba(0,70,160,.15)'},
    {key:'Ungheria',    flag:'🇭🇺', bg:'rgba(180,50,0,.15)'},
    {key:'Georgia',     flag:'🇬🇪', bg:'rgba(180,0,30,.12)'},
    {key:'USA',         flag:'🇺🇸', bg:'rgba(0,50,150,.15)'},
    {key:'Argentina',   flag:'🇦🇷', bg:'rgba(100,160,210,.12)'},
    {key:'Cile',        flag:'🇨🇱', bg:'rgba(180,0,30,.12)'},
    {key:'Australia',   flag:'🇦🇺', bg:'rgba(180,50,0,.15)'},
    {key:'Nuova Zelanda',flag:'🇳🇿',bg:'rgba(0,50,150,.12)'},
    {key:'Sud Africa',  flag:'🇿🇦', bg:'rgba(0,120,50,.12)'},
  ];

  /* Conta denominazioni per paese */
  var counts = {};
  (window._DENOM||[]).forEach(function(d){
    counts[d.country] = (counts[d.country]||0)+1;
  });

  grid.innerHTML = '';
  PAESI.forEach(function(p){
    var n = counts[p.key]||0;
    var btn = document.createElement('div');
    btn.style.cssText = [
      'background:'+p.bg,
      'border:1px solid rgba(212,175,55,.18)',
      'border-radius:8px',
      'padding:10px 4px',
      'text-align:center',
      'cursor:pointer',
      'transition:all .2s',
    ].join(';');
    btn.onmouseover = function(){ this.style.borderColor='rgba(212,175,55,.5)'; this.style.transform='translateY(-1px)'; };
    btn.onmouseout  = function(){ this.style.borderColor='rgba(212,175,55,.18)'; this.style.transform='none'; };
    /* Abbrevia nomi lunghi per la griglia 4x */
    var shortName = {
      'Italia':'Italia','Francia':'Francia','Spagna':'Spagna',
      'Portogallo':'Portog.','Germania':'Germania','Austria':'Austria',
      'Grecia':'Grecia','Ungheria':'Ungheria','Georgia':'Georgia',
      'USA':'USA','Argentina':'Argentina','Cile':'Cile',
      'Australia':'Australia','Nuova Zelanda':'N. Zelanda','Sud Africa':'Sud Africa',
    }[p.key] || p.key;
    btn.innerHTML =
      '<div style="font-size:1.6rem;line-height:1;margin-bottom:5px;">'+p.flag+'</div>'+
      '<div style="font-family:Cinzel,serif;font-size:.4rem;letter-spacing:.04em;'+
        'color:rgba(245,239,226,.85);line-height:1.3;word-break:break-word;">'+shortName+'</div>'+
      '<div style="font-family:Cinzel,serif;font-size:.36rem;color:rgba(212,175,55,.45);margin-top:3px;">'+
        (n>0?n:'—')+'</div>';
    (function(paese){ btn.onclick = function(){ window.openCountry(paese); }; })(p.key);
    grid.appendChild(btn);
  });
};

/* Apri paese → mostra denominazioni raggruppate per tipo */
window.openCountry = function(paese) {
  var detail  = document.getElementById('terroir-country-detail');
  var nameEl  = document.getElementById('terroir-country-name');
  var flagEl  = document.getElementById('terroir-country-flag');
  var statsEl = document.getElementById('terroir-country-stats');
  var listEl  = document.getElementById('terroir-denom-list');
  if(!detail||!listEl) return;

  var FLAGS = {'Italia':'🇮🇹','Francia':'🇫🇷','Spagna':'🇪🇸','Portogallo':'🇵🇹',
    'Germania':'🇩🇪','Austria':'🇦🇹','Grecia':'🇬🇷','Ungheria':'🇭🇺','Georgia':'🇬🇪',
    'USA':'🇺🇸','Argentina':'🇦🇷','Cile':'🇨🇱','Australia':'🇦🇺',
    'Nuova Zelanda':'🇳🇿','Sud Africa':'🇿🇦'};

  var denoms = (window._DENOM||[]).filter(function(d){ return d.country===paese; });

  /* Raggruppa per tipo */
  var byType = {};
  var typeOrder = ['DOCG','DOC','DOCa','DO','AOC','PDO','QmP','Prädikat','DAC','GI','AVA','WO','IGT','IGP'];
  denoms.forEach(function(d){
    if(!byType[d.type]) byType[d.type]=[]; byType[d.type].push(d);
  });

  /* Statistiche */
  var stats = typeOrder.filter(function(t){ return byType[t]&&byType[t].length; })
    .map(function(t){ return byType[t].length+' '+t; }).join(' · ');
  if(!stats) stats = denoms.length+' denominazioni';

  if(nameEl) nameEl.textContent = paese;
  if(flagEl) flagEl.textContent = FLAGS[paese]||'🌍';
  if(statsEl) statsEl.textContent = stats;

  /* Costruisce lista per tipo */
  listEl.innerHTML = '';
  typeOrder.forEach(function(tipo){
    var items = byType[tipo];
    if(!items||!items.length) return;

    /* Header tipo */
    var th = document.createElement('div');
    th.style.cssText = 'font-family:Cinzel,serif;font-size:.48rem;letter-spacing:3px;'+
      'color:rgba(212,175,55,.5);padding:10px 0 6px;border-bottom:1px solid rgba(212,175,55,.08);margin-bottom:8px;';
    th.textContent = tipo;
    listEl.appendChild(th);

    /* Card denominazione */
    items.forEach(function(d){
      var card = document.createElement('div');
      card.style.cssText = 'padding:12px 14px;margin-bottom:8px;'+
        'background:rgba(255,255,255,.03);border:1px solid rgba(212,175,55,.1);'+
        'border-left:3px solid rgba(212,175,55,.3);border-radius:6px;cursor:pointer;transition:background .18s;';
      card.onmouseover = function(){ this.style.background='rgba(128,0,32,.18)'; };
      card.onmouseout  = function(){ this.style.background='rgba(255,255,255,.03)'; };
      card.innerHTML =
        '<div style="font-family:Playfair Display,serif;font-size:1rem;font-weight:700;color:#fff;margin-bottom:3px;">'+d.name+'</div>'+
        '<div style="font-family:Cinzel,serif;font-size:.42rem;letter-spacing:1px;color:rgba(212,175,55,.5);margin-bottom:5px;">'+d.region+' · 🍇 '+d.grapes+'</div>'+
        '<div style="font-family:IM Fell English,serif;font-style:italic;font-size:.88rem;'+
          'color:rgba(245,239,226,.55);line-height:1.55;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">'+d.desc+'</div>';
      (function(denom){ card.onclick = function(){
        if(typeof window.openDenomDetail==='function') window.openDenomDetail(denom.id);
      };})(d);
      listEl.appendChild(card);
    });
  });

  detail.style.display = 'block';
  detail.scrollIntoView({behavior:'smooth',block:'start'});

  /* Highlight bottone paese selezionato */
  document.querySelectorAll('#terroir-flag-grid > div').forEach(function(b){
    b.style.borderColor='rgba(212,175,55,.18)';
  });
};

/* Chiudi dettaglio paese */
window.closeCountry = function() {
  var d = document.getElementById('terroir-country-detail');
  if(d) d.style.display='none';
  var g = document.getElementById('terroir-flag-grid');
  if(g) g.scrollIntoView({behavior:'smooth',block:'start'});
};

/* Ricerca */
window._terroirSearch = function(q) {
  var results = document.getElementById('terroirResults');
  var section = document.getElementById('terroir-countries-section');
  if(!q||q.trim().length<2){
    if(results) results.innerHTML='';
    if(section) section.style.display='block';
    return;
  }
  if(section) section.style.display='none';
  window.filterTerroir(q);
};


window.toggleCountry = function(key) {
  var list  = document.getElementById('list-'+key);
  var arrow = document.getElementById('arr-'+key);
  if(!list) return;
  var open = list.style.display !== 'none';
  /* Chiudi tutti gli altri */
  document.querySelectorAll('.tc-list').forEach(function(l){ l.style.display='none'; });
  document.querySelectorAll('.tc-arrow').forEach(function(a){ a.classList.remove('open'); });
  if(!open) {
    list.style.display='block';
    if(arrow) arrow.classList.add('open');
    /* Scroll per vedere la lista */
    setTimeout(function(){list.scrollIntoView({behavior:'smooth',block:'nearest'});},60);
  }
};

/* Ricerca nel terroir — mostra/nasconde countries-section */
window._terroirSearch = function(q) {
  var results  = document.getElementById('terroirResults');
  var section  = document.getElementById('terroir-countries-section');
  if(!q || q.trim().length < 2) {
    if(results) results.innerHTML='';
    if(section) section.style.display='block';
    return;
  }
  if(section) section.style.display='none';
  /* Filtra denominazioni */
  window.filterTerroir(q);
};

/* Override filterTerroir per nascondere countries-section */
var _origFilter = window.filterTerroir;
window.filterTerroir = function(query) {
  var section = document.getElementById('terroir-countries-section');
  if(!query||query.trim().length<2) {
    if(section) section.style.display='block';
  } else {
    if(section) section.style.display='none';
  }
  if(_origFilter) _origFilter(query);
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
  ['notizie','produttori','articoli'].forEach(function(t){
    var sec=document.getElementById('adminSec_'+t); var btn=document.getElementById('adminBtn_'+t);
    var on=t===tab;
    if(sec)sec.style.display=on?'block':'none';
    if(btn){btn.style.background=on?'rgba(212,175,55,.18)':'transparent';
            btn.style.color=on?'#D4AF37':'rgba(212,175,55,.4)';
            btn.style.borderBottom=on?'2px solid #D4AF37':'2px solid transparent';}
  });
};

window.adminLoadData=function(){
  /* Legge produttori dal localStorage (nessun server) */
  var allProds = [];
  try { allProds = JSON.parse(localStorage.getItem('sw_producers')||'[]'); } catch(e){}
  var pending  = allProds.filter(function(p){ return !p.approved; });
  var approved = allProds.filter(function(p){ return  p.approved; });

  var statsEl=document.getElementById('adminStatsProd');
  if(statsEl) statsEl.innerHTML=[
    {ico:'📋',val:pending.length,lab:'In attesa'},
    {ico:'✅',val:approved.length,lab:'Approvati'},
    {ico:'👥',val:allProds.length,lab:'Totale'}
  ].map(function(s){return '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(212,175,55,.15);border-radius:8px;padding:12px;text-align:center;flex:1;"><div style="font-size:1.2rem;">'+s.ico+'</div><div style="font-family:Cinzel,serif;font-size:1.1rem;color:#D4AF37;">'+s.val+'</div><div style="font-size:9px;letter-spacing:2px;color:rgba(245,239,226,.3);">'+s.lab+'</div></div>';}).join('');

  var pEl=document.getElementById('adminPending');
  if(pEl){
    pEl.innerHTML='';
    if(!pending.length){
      pEl.innerHTML='<p style="color:rgba(245,239,226,.3);font-style:italic;padding:10px 0;">Nessuna richiesta in attesa.</p>';
    } else {
      pending.forEach(function(p){
        var div=document.createElement('div');
        div.style.cssText='display:flex;align-items:center;gap:10px;padding:10px;margin-bottom:6px;background:rgba(255,255,255,.03);border:1px solid rgba(212,175,55,.1);border-radius:6px;';
        var info=document.createElement('div'); info.style.flex='1';
        info.innerHTML='<div style="font-family:Cinzel,serif;font-size:.68rem;color:#F5EFE2;">'+(p.name||'')+'</div><div style="font-size:.8rem;color:rgba(245,239,226,.4);">'+(p.email||'')+' · '+(p.package||'')+'</div>';
        var btnOk=document.createElement('button');
        btnOk.textContent='✓'; btnOk.style.cssText='padding:5px 10px;background:rgba(40,180,80,.1);border:1px solid rgba(40,180,80,.3);border-radius:4px;color:#5dde8a;font-size:11px;cursor:pointer;';
        (function(id){btnOk.onclick=function(){window.adminApprove(id);};})(p.id);
        var btnNo=document.createElement('button');
        btnNo.textContent='✗'; btnNo.style.cssText='padding:5px 10px;background:rgba(200,50,50,.1);border:1px solid rgba(200,50,50,.3);border-radius:4px;color:#f88;font-size:11px;cursor:pointer;';
        (function(id){btnNo.onclick=function(){window.adminReject(id);};})(p.id);
        div.appendChild(info); div.appendChild(btnOk); div.appendChild(btnNo);
        pEl.appendChild(div);
      });
    }
  }

  var aEl=document.getElementById('adminApproved');
  if(aEl) aEl.innerHTML=approved.length?approved.map(function(p){
    return '<div style="display:flex;align-items:center;gap:10px;padding:9px;margin-bottom:5px;background:rgba(40,180,80,.04);border:1px solid rgba(40,180,80,.12);border-radius:6px;">'+
      '<div style="flex:1;font-family:Cinzel,serif;font-size:.65rem;color:rgba(245,239,226,.75);">'+(p.name||'')+'</div>'+
      '<span style="font-family:Cinzel,serif;font-size:.42rem;letter-spacing:1px;padding:2px 8px;border-radius:10px;background:rgba(212,175,55,.12);color:rgba(212,175,55,.7);">'+(p.package||'')+'</span>'+
    '</div>';
  }).join(''):'<p style="color:rgba(245,239,226,.3);font-style:italic;padding:10px 0;">Nessun produttore ancora.</p>';

  window.adminLoadArticles();
};

window.adminLoadArticleswindow.adminLoadArticles=function(){
  var el=document.getElementById('adminArtList');
  var stats=document.getElementById('adminArtStats');
  if(!el) return;
  var data=[];
  try{ data=JSON.parse(localStorage.getItem('sw_articles')||'[]'); }catch(e){}
  var ai=data.filter(function(a){return a.generato_ai;}).length;
  if(stats) stats.innerHTML=[
    {ico:'📰',val:data.length,lab:'Totali'},
    {ico:'🤖',val:ai,lab:'AI'},
    {ico:'✍️',val:data.length-ai,lab:'Manuali'}
  ].map(function(s){return '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(212,175,55,.15);border-radius:8px;padding:12px;text-align:center;flex:1;"><div style="font-size:1.2rem;">'+s.ico+'</div><div style="font-family:Cinzel,serif;font-size:1.1rem;color:#D4AF37;">'+s.val+'</div><div style="font-size:9px;letter-spacing:2px;color:rgba(245,239,226,.3);">'+s.lab+'</div></div>';}).join('');
  if(!data.length){el.innerHTML='<p style="color:rgba(245,239,226,.3);font-style:italic;padding:10px 0;">Nessun articolo ancora.</p>';return;}
  el.innerHTML='';
  data.forEach(function(a){
    var tit=a.titolo_it||a.titolo||'(senza titolo)';
    var row=document.createElement('div');
    row.style.cssText='display:flex;align-items:center;gap:10px;padding:10px;margin-bottom:6px;background:rgba(255,255,255,.03);border:1px solid rgba(212,175,55,.08);border-radius:6px;';
    var sp1=document.createElement('span'); sp1.style.cssText='flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:rgba(245,239,226,.75);font-size:13px;';
    sp1.textContent=(a.generato_ai?'🤖 ':'✍️ ')+tit;
    var sp2=document.createElement('span'); sp2.style.cssText='font-size:10px;color:rgba(212,175,55,.35);flex-shrink:0;';
    sp2.textContent=a.data||'';
    var btn=document.createElement('button');
    btn.textContent='🗑'; btn.style.cssText='padding:4px 10px;background:rgba(200,50,50,.1);border:1px solid rgba(200,50,50,.3);border-radius:4px;color:#f88;font-size:10px;cursor:pointer;flex-shrink:0;';
    (function(id){btn.onclick=function(){window.adminDeleteArt(id);};})(a.id);
    row.appendChild(sp1); row.appendChild(sp2); row.appendChild(btn);
    el.appendChild(row);
  });
};

window.adminGenArtswindow.adminGenArts=async function(){
  /* Redireziona al generatore di news.js che usa callAPI → Worker */
  if(typeof window.adminGenNews==='function'){
    window.adminSwitchTab('notizie');
    setTimeout(window.adminGenNews, 200);
  }
};

window.adminSaveArtwindow.adminSaveArt=async function(){
  var tit=(document.getElementById('artTitolo')||{}).value||'';
  var cat=(document.getElementById('artCat')||{}).value||'';
  var img=(document.getElementById('artImg')||{}).value||'';
  var txt=(document.getElementById('artTesto')||{}).value||'';
  var st=document.getElementById('adminSaveStatus');
  if(!tit.trim()||!txt.trim()){if(st){st.style.color='#f88';st.textContent='✗ Titolo e testo obbligatori.';}return;}
  if(st){st.style.color='rgba(212,175,55,.5)';st.textContent='⏳ Salvataggio…';}
  var today=new Date().toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'});
  var art={
    id:'manual_'+Date.now(), generato_ai:false,
    titolo_it:tit, titolo_en:'', titolo_fr:'',
    categoria_it:cat, categoria_en:cat, categoria_fr:cat,
    testo_it:txt, testo_en:'', testo_fr:'',
    immagine:img||'', autore:'Sommelier World', data:today,
    isNews:cat.toLowerCase().includes('news'),
  };
  try {
    var arts=JSON.parse(localStorage.getItem('sw_articles')||'[]');
    arts.unshift(art);
    localStorage.setItem('sw_articles',JSON.stringify(arts));
    if(st){st.style.color='#5dde8a';st.textContent='✓ Articolo pubblicato!';}
    ['artTitolo','artImg','artTesto'].forEach(function(id){var e=document.getElementById(id);if(e)e.value='';});
    window.adminLoadArticles();
    if(typeof window.syncAfterAdminSave==='function') window.syncAfterAdminSave();
    else if(typeof window.loadServerArts==='function') window.loadServerArts();
  } catch(e){
    if(st){st.style.color='#f88';st.textContent='✗ '+e.message;}
  }
};

window.adminDeleteArtwindow.adminDeleteArt=function(id){
  if(!confirm('Eliminare? Operazione irreversibile.')) return;
  try {
    var arts=JSON.parse(localStorage.getItem('sw_articles')||'[]');
    arts=arts.filter(function(a){return a.id!==id;});
    localStorage.setItem('sw_articles',JSON.stringify(arts));
    window.adminLoadArticles();
    window.loadServerArts();
  } catch(e){ alert(e.message); }
};

window.adminApprovewindow.adminApprove=function(id){
  try {
    var prods=JSON.parse(localStorage.getItem('sw_producers')||'[]');
    prods=prods.map(function(p){if(p.id===id)p.approved=true;return p;});
    localStorage.setItem('sw_producers',JSON.stringify(prods));
    window.adminLoadData();
  } catch(e){alert(e.message);}
};
window.adminReject=function(id){
  if(!confirm('Rimuovere questa richiesta?')) return;
  try {
    var prods=JSON.parse(localStorage.getItem('sw_producers')||'[]');
    prods=prods.filter(function(p){return p.id!==id;});
    localStorage.setItem('sw_producers',JSON.stringify(prods));
    window.adminLoadData();
  } catch(e){alert(e.message);}
};

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded',function(){
  /* Usa la lingua già letta nell'<head> per coerenza */
  try{
    var saved = window._swInitLang || localStorage.getItem('sw_lang') || 'it';
    window.i18n.current = window.i18n.dict[saved] ? saved : 'it';
  }catch(e){window.i18n.current='it';}

  ['it','en','fr','ru'].forEach(function(l){
    var b=document.getElementById('lb_'+l); if(!b)return;
    var on=(l===window.i18n.current);
    b.style.background=on?'rgba(212,175,55,.18)':'rgba(255,255,255,.03)';
    b.style.color=on?'#D4AF37':'rgba(212,175,55,.4)';
    b.style.borderColor=on?'rgba(212,175,55,.4)':'rgba(212,175,55,.2)';
  });

  /* Applica lingua salvata PRIMA di qualsiasi render */
  window._applyI18n();

  /* Aggiorna bottoni lingua subito con lingua corrente */
  ['it','en','fr','ru'].forEach(function(l){
    var b=document.getElementById('lb_'+l); if(!b)return;
    var on=(l===window.i18n.current);
    b.style.background =on?'rgba(212,175,55,.18)':'rgba(255,255,255,.03)';
    b.style.color      =on?'#D4AF37':'rgba(212,175,55,.4)';
    b.style.fontWeight =on?'700':'400';
  });

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

/* ══ DETTAGLIO DENOMINAZIONE ══ */
window.openDenomDetail=function(id){
  var d=(window._DENOM||[]).find(function(x){return x.id===id;});
  if(!d) return;
  var det=document.getElementById('expDetail');
  if(!det) return;

  /* Nascondi TUTTO il contenuto terroir */
  var main=document.getElementById('terroir-main');
  if(main) main.style.display='none';
  /* Nascondi anche country detail se aperto */
  var cd=document.getElementById('terroir-country-detail');
  if(cd) cd.style.display='none';
  /* Mostra il dettaglio denominazione */
  det.style.display='block';
  /* Scrolla in cima alla pagina */
  var pg=document.getElementById('page-explore');
  if(pg) { pg.scrollTo(0,0); pg.scrollTop=0; }
  setTimeout(function(){ window.scrollTo(0,0); det.scrollIntoView({block:'start'}); },50);

  /* Costruisce la scheda */
  var grapes = (d.grapes||'').split(',').map(function(g){
    return '<span style="font-family:Cinzel,serif;font-size:.44rem;letter-spacing:1px;padding:3px 10px;'+
      'background:rgba(212,175,55,.1);border:1px solid rgba(212,175,55,.25);border-radius:12px;'+
      'color:rgba(212,175,55,.8);white-space:nowrap;">'+g.trim()+'</span>';
  }).join(' ');

  var bg = {
    'Italia':'linear-gradient(160deg,#080d02,#0f1a04)',
    'Francia':'linear-gradient(160deg,#020810,#040f1a)',
    'Spagna':'linear-gradient(160deg,#100504,#1a0a04)',
    'Germania':'linear-gradient(160deg,#0a0a0a,#141414)',
    'Austria':'linear-gradient(160deg,#100204,#1a0308)',
    'USA':'linear-gradient(160deg,#020510,#040a1a)',
  }[d.country] || 'linear-gradient(160deg,#080808,#101010)';

  det.innerHTML =
    '<div style="background:'+bg+';padding:20px 16px 16px;border-bottom:1px solid rgba(212,175,55,.15);">'+
      '<button onclick="window._closeDenomDetail()" style="font-family:Cinzel,serif;font-size:.48rem;'+
        'letter-spacing:1px;padding:6px 14px;background:rgba(212,175,55,.08);border:1px solid rgba(212,175,55,.25);'+
        'color:rgba(212,175,55,.65);border-radius:4px;cursor:pointer;margin-bottom:14px;">'+
        '← INDIETRO</button>'+
      '<div style="font-family:Cinzel,serif;font-size:.44rem;letter-spacing:2px;'+
        'color:rgba(212,175,55,.5);margin-bottom:4px;">'+d.country+' · '+d.region+'</div>'+
      '<div style="font-family:Cinzel,serif;font-size:.52rem;letter-spacing:2px;padding:3px 10px;'+
        'background:rgba(212,175,55,.1);border:1px solid rgba(212,175,55,.22);border-radius:3px;'+
        'color:rgba(212,175,55,.7);display:inline-block;margin-bottom:12px;">'+d.type+'</div>'+
      '<h1 style="font-family:Cinzel,serif;font-size:1.6rem;font-weight:700;color:#fff;'+
        'margin:0 0 6px;line-height:1.2;">'+d.name+'</h1>'+
      '<div style="font-family:IM Fell English,serif;font-style:italic;font-size:.92rem;'+
        'color:rgba(245,239,226,.6);margin-bottom:16px;">'+d.desc+'</div>'+
      '<div style="font-family:Cinzel,serif;font-size:.44rem;letter-spacing:2px;'+
        'color:rgba(212,175,55,.4);margin-bottom:8px;">VITIGNI</div>'+
      '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px;">'+grapes+'</div>'+
    '</div>'+
    /* Scheda enciclopedica */
    '<div style="padding:16px;">'+
      '<div style="font-family:Cinzel,serif;font-size:.44rem;letter-spacing:3px;'+
        'color:rgba(212,175,55,.4);margin-bottom:10px;">■ SCHEDA ENCICLOPEDICA</div>'+
      '<div style="font-family:IM Fell English,serif;font-size:.96rem;line-height:1.75;'+
        'color:rgba(245,239,226,.75);margin-bottom:16px;">'+d.desc+'</div>'+
      '<div id="denomAIExpand" style="font-family:IM Fell English,serif;font-style:italic;'+
        'font-size:.82rem;color:rgba(212,175,55,.4);">'+
        'Scheda non disponibile. Riprova tra 30 secondi.</div>'+
    '</div>'+
    /* Rimanda al terroir */
    '<div style="padding:0 16px 20px;border-top:1px solid rgba(212,175,55,.08);margin-top:8px;">'+
      '<div style="font-family:Cinzel,serif;font-size:.46rem;letter-spacing:.3em;'+
        'color:rgba(212,175,55,.55);text-align:center;padding:14px 0 10px;">'+
        '✦ ENCICLOPEDIA DEL TERROIR ✦</div>'+
    '</div>';

  /* Genera descrizione AI in background */
  if(typeof window.callAPI==='function'){
    var sys='Sei un enologo e storico del vino. Scrivi una scheda enciclopedica completa e appassionante.';
    var prompt='Scrivi una scheda enciclopedica di 3-4 paragrafi sulla denominazione '+d.name+
      ' ('+d.type+', '+d.country+', '+d.region+'). Vitigni: '+d.grapes+'. '+
      'Includi storia, caratteristiche del suolo, produttori emblematici, annate leggendarie. '+
      'Tono narrativo e colto. Solo il testo, nessun titolo.';
    window.callAPI(sys, prompt, window.getLang?window.getLang():'it')
      .then(function(txt){
        var el=document.getElementById('denomAIExpand');
        if(el){ var ps=txt.split('\n\n').filter(function(s){return s.trim();});
          el.innerHTML=ps.map(function(p){return '<p style="margin-bottom:10px;line-height:1.7;">'+p.trim()+'</p>';}).join(''); }
      }).catch(function(){});
  }
};

window.closeDetail=function(){ window._closeDenomDetail(); };
window._closeDenomDetail=function(){
  var det=document.getElementById('expDetail');
  if(det){ det.style.display='none'; det.innerHTML=''; }
  /* Ripristina terroir-main */
  var main=document.getElementById('terroir-main');
  if(main) main.style.display='block';
  /* Ripristina country detail se era aperto */
  var cd=document.getElementById('terroir-country-detail');
  if(cd) cd.style.display='block';
  /* Scroll alla lista denominazioni del paese */
  var dl=document.getElementById('terroir-denom-list');
  if(dl) dl.scrollIntoView({behavior:'smooth',block:'start'});
};