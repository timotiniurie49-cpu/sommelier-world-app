/**
 * SOMMELIER WORLD — app-logic.js
 * Versione: Tabula Rasa v1
 *
 * ✅ 5 notizie HARDCODED (vino, zero cani)
 * ✅ Sommelier: paese OBBLIGATORIO nel prompt
 * ✅ Placeholder #4a0404 se manca foto
 * ✅ Slideshow automatico Wine News
 * ✅ "Il Sapere del Vino" — 3 articoli che ruotano
 * ✅ Multilingua (IT / EN / FR)
 * ✅ Lingua persistente in localStorage
 */
(function(){
'use strict';

var SRV = 'https://sommelier-server-production-8f92.up.railway.app';
var BORDEAUX = '#4a0404';   /* placeholder quando manca foto — SEMPRE questo, mai animali */

/* ═══════════════════════════════════════
   IMMAGINI — 100% vino/vigne verificate
   Unsplash photo ID confermati a mano
   ═══════════════════════════════════════ */
/* ── Foto verificate 100% vino/vigne ── */
var W = {
  bottles:   'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=700&q=80&fit=crop',
  glass:     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80&fit=crop',
  glass2:    'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=700&q=80&fit=crop',
  vineyard:  'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=700&q=80&fit=crop',
  vineyard2: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=700&q=80&fit=crop',
  winery:    'https://images.unsplash.com/photo-1586370434639-0fe43b2d32e6?w=700&q=80&fit=crop',
  cellar:    'https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?w=700&q=80&fit=crop',
  grapes:    'https://images.unsplash.com/photo-1515779122185-2390ccdf060b?w=700&q=80&fit=crop',
  harvest:   'https://images.unsplash.com/photo-1596363470302-8d7c62a64c2d?w=700&q=80&fit=crop',
  champagne: 'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=700&q=80&fit=crop',
  sommelier: 'https://images.unsplash.com/photo-1574014671294-4b64eb4c68b4?w=700&q=80&fit=crop',
  tasting:   'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=700&q=80&fit=crop',
  red_glass: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=700&q=80&fit=crop',
  dry_vine:  'https://images.unsplash.com/photo-1586370434639-0fe43b2d32e6?w=700&q=80&fit=crop',
};

/*
 * smartPhoto — sistema foto intelligente per topic
 * Usa Unsplash con photo ID verificati + keyword params
 * Ogni categoria ha 3-5 varianti per non ripetere sempre la stessa foto
 */
/* ═══════════════════════════════════════════════════════
   FOTO VERIFICATE — ID Unsplash confermati come vino/vigne
   Rotazione giornaliera basata su seed (dayOfYear + index)
   ═══════════════════════════════════════════════════════ */
var VERIFIED_PHOTOS = {
  glass_red:   'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=700&q=85',
  glass_white: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=85',
  bottles:     'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=700&q=85',
  vineyard_a:  'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=700&q=85',
  vineyard_b:  'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=700&q=85',
  vineyard_c:  'https://images.unsplash.com/photo-1586370434639-0fe43b2d32e6?w=700&q=85',
  cellar_a:    'https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?w=700&q=85',
  harvest_a:   'https://images.unsplash.com/photo-1596363470302-8d7c62a64c2d?w=700&q=85',
  bubbles_a:   'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=700&q=85',
  sommelier_a: 'https://images.unsplash.com/photo-1574014671294-4b64eb4c68b4?w=700&q=85',
};

var TOPIC_PHOTOS = {
  champagne: ['bubbles_a','glass_white','vineyard_a'],
  sommelier: ['sommelier_a','glass_red','glass_white'],
  harvest:   ['harvest_a','vineyard_b','vineyard_a'],
  cellar:    ['cellar_a','vineyard_c','bottles'],
  red:       ['glass_red','bottles','vineyard_a'],
  white:     ['glass_white','bottles','vineyard_b'],
  vineyard:  ['vineyard_a','vineyard_b','vineyard_c'],
  news:      ['bottles','glass_red','vineyard_c'],
  winery:    ['cellar_a','vineyard_c','bottles'],
  default:   ['vineyard_a','glass_red','cellar_a','vineyard_b','glass_white'],
};

function getTopicPhoto(titolo, categoria, dayOffset){
  var t = ((titolo||'') + ' ' + (categoria||'')).toLowerCase();
  var seed = Math.floor(Date.now() / 86400000) + (dayOffset||0);
  var cat = 'default';
  if(t.match(/champagne|bollicin|spumant|prosecco|cava|franciacorta/)) cat='champagne';
  else if(t.match(/sommelier|degust|abbinament|calice|servizio|temperatura/)) cat='sommelier';
  else if(t.match(/vendemmia|harvest|raccolt|potatur|biodinam|viticolt/))     cat='harvest';
  else if(t.match(/cantina|barrique|barrel|botti|affinament|invecchiam/))     cat='cellar';
  else if(t.match(/rosso|nebbiolo|sangiovese|barolo|brunello|amarone|malbec|shiraz|grenach|pinot.*noir/)) cat='red';
  else if(t.match(/bianco|riesling|chardonnay|sauvignon|blanc|trebbiano|vermentino|assyrtiko/)) cat='white';
  else if(t.match(/vigna|vineyard|terroir|suolo|collin|etna|mosel|santorini|priorat|borgogna/)) cat='vineyard';
  else if(t.match(/notizia|mercato|prezzi|asta|award|record|consumo|trend|annata/)) cat='news';
  else if(t.match(/produttor|winery|domaine|cantina|maison|azienda/)) cat='winery';
  var keys = TOPIC_PHOTOS[cat] || TOPIC_PHOTOS.default;
  var key  = keys[seed % keys.length];
  return VERIFIED_PHOTOS[key] || VERIFIED_PHOTOS.vineyard_a;
}

/* Alias per compatibilità */
function smartPhoto(titolo, categoria, fallback, seed){
  return getTopicPhoto(titolo, categoria, seed);
}
/* Banner debug — sparisce dopo 2 secondi */
(function(){
  var b = document.createElement('div');
  b.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999999;background:#1a5c1a;' +
    'color:#fff;font-size:11px;text-align:center;padding:5px;font-family:monospace;pointer-events:none;';
  b.textContent = '✓ app-logic.js CARICATO — Tabula Rasa v1';
  document.body.appendChild(b);
  setTimeout(function(){ b.style.opacity='0'; b.style.transition='opacity .5s'; }, 1500);
  setTimeout(function(){ if(b.parentNode) b.remove(); }, 2100);
})();

/* ═══════════════════════════════════════
   CSS
   ═══════════════════════════════════════ */
(function(){
  var s = document.createElement('style');
  s.textContent = [
    /* WINE NEWS */
    '#al-news{background:#0A0705;border-bottom:1px solid rgba(191,155,74,.08);}',
    '#al-news-hd{display:flex;align-items:center;justify-content:space-between;padding:11px 14px 8px;}',
    '#al-news-lbl{font-family:Cinzel,serif;font-size:.6rem;letter-spacing:4px;color:var(--oro,#BF9B4A);display:flex;align-items:center;gap:8px;}',
    /* Slideshow */
    '#al-sw{position:relative;height:210px;overflow:hidden;background:#0d0202;}',
    '.al-sl{position:absolute;inset:0;display:flex;opacity:0;transition:opacity .7s ease;cursor:pointer;}',
    '.al-sl.on{opacity:1;z-index:1;}',
    '.al-sl-img{flex:0 0 38%;position:relative;overflow:hidden;}',
    '.al-sl-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}',
    '.al-sl-body{flex:1;padding:16px 14px;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;}',
    '.al-sl-cat{font-size:8px;font-weight:700;letter-spacing:2px;color:rgba(191,155,74,.5);text-transform:uppercase;margin-bottom:6px;}',
    '.al-sl-tit{font-family:"Playfair Display",Georgia,serif;font-size:1.05rem;font-weight:700;color:#F5EFE2;line-height:1.32;flex:1;}',
    '.al-sl-txt{font-family:"Cormorant Garamond",Georgia,serif;font-size:.88rem;color:rgba(245,239,226,.48);line-height:1.6;margin-top:8px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;}',
    '.al-sl-meta{font-size:9px;color:rgba(245,239,226,.25);margin-top:8px;}',
    '#al-dots{display:flex;justify-content:center;gap:6px;padding:8px 0;background:#0A0705;}',
    '.al-pg{width:5px;height:5px;border-radius:50%;background:rgba(191,155,74,.15);cursor:pointer;transition:background .25s;}',
    '.al-pg.on{background:rgba(191,155,74,.7);}',
    /* Accorcia heroSection per mostrare subito il Wine News */
    '#heroSection{max-height:260px!important;min-height:200px!important;}',
    '#al-tick{position:absolute!important;bottom:0!important;left:0!important;right:0!important;',
      'z-index:100!important;height:32px!important;overflow:hidden!important;',
      'background:rgba(10,7,5,.9)!important;border-top:1px solid rgba(191,155,74,.2)!important;}',
    '#al-tick-t{display:flex!important;align-items:center!important;height:32px!important;',
      'white-space:nowrap!important;animation:al-sc 52s linear infinite!important;}',
    '#al-tick-t:hover{animation-play-state:paused!important;}',
    '@keyframes al-sc{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}',
    '.al-ti{display:inline-flex!important;align-items:center!important;gap:6px!important;',
      'padding:0 18px!important;height:32px!important;cursor:pointer!important;flex-shrink:0!important;',
      'font-family:Cinzel,serif!important;font-size:.46rem!important;letter-spacing:.1em!important;',
      'color:rgba(245,239,226,.7)!important;border-right:1px solid rgba(191,155,74,.1)!important;}',
    '.al-ti:hover{color:#D4AF37!important;}',
    '.al-ti-d{width:4px!important;height:4px!important;border-radius:50%!important;flex-shrink:0!important;}',
    /* Il Sapere del Vino */
    '#al-sapere{background:#0A0705;border-top:1px solid rgba(191,155,74,.06);}',
    '#al-sapere-hd{display:flex;align-items:center;gap:8px;padding:14px 14px 10px;}',
    '.al-art{background:rgba(10,4,2,.98);border:1px solid rgba(191,155,74,.08);border-radius:10px;',
      'margin:0 14px 14px;cursor:pointer;overflow:hidden;transition:transform .2s,box-shadow .2s;}',
    '.al-art:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.55);}',
    '.al-art-img{width:100%;height:150px;object-fit:cover;display:block;}',
    '.al-art-ph{width:100%;height:150px;display:flex;align-items:center;justify-content:center;font-size:2.8rem;}',
    '.al-art-body{padding:16px 16px 18px;}',
    '.al-art-tag{font-size:8px;font-weight:700;letter-spacing:2px;color:rgba(191,155,74,.7);',
      'text-transform:uppercase;margin-bottom:8px;}',
    '.al-art-tit{font-family:"Playfair Display",Georgia,serif;font-size:1.16rem;font-weight:700;',
      'color:#FFFFFF;line-height:1.3;margin-bottom:10px;text-shadow:0 1px 4px rgba(0,0,0,.5);}',
    '.al-art-txt{font-family:"Cormorant Garamond",Georgia,serif;font-size:1.02rem;line-height:1.9;',
      'color:rgba(255,248,240,.85);}',
    '.al-art-foot{font-size:10px;color:rgba(245,239,226,.5);margin-top:12px;padding-top:10px;',
      'border-top:1px solid rgba(191,155,74,.15);}',
    /* Reader full screen */
    '#al-reader{display:none;position:fixed;inset:0;z-index:999950;background:#0A0705;overflow-y:auto;}',
    /* Filtri lifestyle sommelier */
    '#al-lifestyle{display:flex;gap:8px;padding:0 14px 10px;flex-wrap:wrap;}',
    '.al-ls{padding:7px 12px;border-radius:20px;border:1px solid rgba(191,155,74,.25);',
      'background:rgba(191,155,74,.08);color:rgba(245,239,226,.65);font-family:Cinzel,serif;',
      'font-size:.46rem;font-weight:700;letter-spacing:1px;cursor:pointer;transition:all .2s;}',
    '.al-ls.on{background:rgba(191,155,74,.25);border-color:rgba(191,155,74,.6);color:#BF9B4A;}',
    /* FAB */
    '#al-fab{position:fixed!important;bottom:20px!important;right:20px!important;z-index:99999!important;',
      'width:46px!important;height:46px!important;border-radius:50%!important;',
      'background:rgba(191,155,74,.16)!important;border:1.5px solid rgba(191,155,74,.32)!important;',
      'display:flex!important;align-items:center!important;justify-content:center!important;',
      'cursor:pointer!important;font-size:1.2rem!important;',
      'box-shadow:0 4px 14px rgba(0,0,0,.45)!important;transition:background .2s!important;}',
    '#al-fab:hover{background:rgba(191,155,74,.3)!important;}',
    /* Contatti */
    '#al-cp{display:none;position:fixed;inset:0;z-index:999900;background:#0A0705;overflow-y:auto;}',
    '.al-fi{width:100%;box-sizing:border-box;padding:11px 13px;background:rgba(255,255,255,.05);',
      'border:1px solid rgba(191,155,74,.2);border-radius:8px;color:#F5EFE2;',
      'font-family:Lato,sans-serif;font-size:15px;outline:none;display:block;}',
    '.al-fi:focus{border-color:rgba(191,155,74,.45);}',
    '.al-fl{display:block;font-size:9px;font-weight:700;letter-spacing:2px;',
      'color:rgba(191,155,74,.45);text-transform:uppercase;margin-bottom:5px;}',
    '.al-fb{width:100%;padding:13px;background:rgba(191,155,74,.16);',
      'border:1.5px solid rgba(191,155,74,.35);border-radius:8px;color:#BF9B4A;',
      'font-family:Cinzel,serif;font-size:.58rem;font-weight:700;letter-spacing:3px;cursor:pointer;}',
    '.al-fb:hover{background:rgba(191,155,74,.26);}',
  ].join('');
  document.head.appendChild(s);
})();

/* ═══════════════════════════════════════
   5 NOTIZIE HARDCODED — vino, zero cani
   ═══════════════════════════════════════ */
var NEWS5 = [
  { id:'n1', isNews:true,
    titolo_it:'Il segreto della Mosella: i Riesling più longevi del mondo',
    titolo_en:'The Mosel Secret: The World\'s Most Age-Worthy Rieslings',
    titolo_fr:'Le secret de la Moselle : les Rieslings les plus longévifs',
    categoria_it:'🌍 Terroir', categoria_en:'🌍 Terroir', categoria_fr:'🌍 Terroir',
    testo_it:'Perché i Riesling della Mosella sono i vini bianchi più longevi al mondo? Merito dell\'ardesia blu devoniana e dei vigneti "eroici" inclinati fino al 70%.\n\nL\'ardesia trattiene il calore di giorno e lo rilascia di notte: questa escursione termica estrema mantiene l\'acidità brillante anche nelle annate calde. Quella stessa acidità è il conservante naturale che permette ai Riesling Spätlese e Auslese di invecchiare 30, 40, persino 60 anni.\n\nEgon Müller (Scharzhofberger), JJ Prüm (Wehlener Sonnenuhr), Clemens Busch (Pündericher Marienburg): tre vigneti mitici su ardesia. Le annate 2020 e 2021 sono ancora accessibili — tra cinque anni non lo saranno più.',
    testo_en:'The Mosel\'s secret: blue Devonian slate and slopes up to 70% create extreme thermal variation, keeping acidity brilliant for 30-60 years of aging. Egon Müller, JJ Prüm, Clemens Busch: three mythical producers.',
    testo_fr:'Le secret de la Moselle : l\'ardoise bleue dévonienne et des pentes jusqu\'à 70% créent des variations thermiques extrêmes, maintenant l\'acidité pendant 30-60 ans. Egon Müller, JJ Prüm, Clemens Busch.',
    autore:'SW Editorial', data:'Aprile 2026', immagine:W.vineyard2 },

  { id:'n2', isNews:true,
    titolo_it:'Bollicine nello spazio: lo Champagne a gravità zero',
    titolo_en:'Bubbles in Space: Champagne at Zero Gravity',
    titolo_fr:'Bulles dans l\'espace : le Champagne en apesanteur',
    categoria_it:'✨ Curiosità', categoria_en:'✨ Curiosity', categoria_fr:'✨ Curiosité',
    testo_it:'Sapevi che lo Champagne è stato testato a gravità zero? La pressione interna di una bottiglia è di circa 6 atmosfere — tre volte quella di un pneumatico. A gravità zero, il perlage non sale verso l\'alto ma si distribuisce uniformemente nel liquido.\n\nNASA e CNES hanno studiato il fenomeno: senza gravità il bouquet aromatico risulta più intenso, perché le molecole odorose non vengono trascinate verso il basso. La bassa gravità sulla ISS accelera anche la fermentazione secondaria — un dettaglio curioso per il metodo classico.\n\nIl risultato pratico: la percezione dello Champagne nello spazio è completamente diversa da quella sulla Terra.',
    testo_en:'Champagne tested at zero gravity: internal pressure of 6 atmospheres creates uniform bubble distribution. NASA found aromatic molecules more intense without gravity. Fermentation also accelerates on the ISS.',
    testo_fr:'Le Champagne testé en apesanteur : une pression de 6 atmosphères crée une distribution uniforme des bulles. La NASA a trouvé les molécules aromatiques plus intenses. La fermentation s\'accélère sur l\'ISS.',
    autore:'SW Editorial', data:'Aprile 2026', immagine:W.glass },

  { id:'n3', isNews:false,
    titolo_it:'Vini vulcanici: dall\'Etna alle Canarie, il sapore della lava',
    titolo_en:'Volcanic Wines: From Etna to the Canaries, the Taste of Lava',
    titolo_fr:'Vins volcaniques : de l\'Etna aux Canaries, le goût de la lave',
    categoria_it:'🌋 Vulcani', categoria_en:'🌋 Volcanic', categoria_fr:'🌋 Volcanique',
    testo_it:'Dall\'Etna siciliana alle Canarie spagnole, passando per Santorini e la Wachau: i vini nati dalla lava hanno un sapore minerale e salino inconfondibile che i geologi chiamano "vulcanicità".\n\nLa lava è essenzialmente silice e feldspato — minerali che la vite assorbe attraverso radici che scendono fino a 10 metri. I suoli vulcanici drenano perfettamente, forzando la pianta sotto stress idrico: concentrazione garantita.\n\nProduttori da scoprire: Cornelissen e Terre Nere sull\'Etna, Gaia Wines a Santorini (Assyrtiko su pumice bianca), Los Bermejos a Lanzarote (Listán Negro su lava nera). Tutti esprimono una mineralità impossibile da ottenere su altri suoli.',
    testo_en:'From Etna to the Canaries via Santorini: volcanic wines have unmistakable mineral, saline character. Lava soils — silica and feldspar — force roots 10 meters deep, guaranteeing concentration and mineral intensity.',
    testo_fr:'De l\'Etna aux Canaries en passant par Santorin : les vins volcaniques ont une minéralité saline inimitable. Les sols de lave forcent les racines à 10 mètres de profondeur, garantissant concentration et intensité.',
    autore:'SW Editorial', data:'Aprile 2026', immagine:W.vineyard },

  { id:'n4', isNews:true,
    titolo_it:'2026: anno record per il rosato. La freschezza batte la struttura',
    titolo_en:'2026: Record Year for Rosé. Freshness Beats Structure',
    titolo_fr:'2026 : année record pour le rosé. La fraîcheur bat la structure',
    categoria_it:'🗞 Mercato', categoria_en:'🗞 Market', categoria_fr:'🗞 Marché',
    testo_it:'Il 2026 segna il record assoluto di consumo di vini rosati in stile Provenza: 3,4 miliardi di bottiglie vendute a livello mondiale, con crescita del 18% rispetto al 2024.\n\nIl fenomeno è guidato dai Millennial che privilegiano vini leggeri, fotogenici e versatili. Il blend Grenache/Cinsault/Mourvèdre con il suo colore rame palido e profumi di fragola e agrumi è diventato il simbolo di uno stile di vita.\n\nCuriosità tecnica: il rosato provenzale ha più acidità del bianco medio italiano (pH 3.1-3.3 contro 3.4-3.6), rendendolo sorprendentemente longevo. Alcune Riserve invecchiano 5-8 anni.',
    testo_en:'2026 all-time record: 3.4 billion bottles of Provençal rosé sold globally, +18% vs 2024. Millennial-driven. Provençal rosé has higher acidity (pH 3.1-3.3) than average Italian white, surprisingly age-worthy.',
    testo_fr:'Record absolu 2026 : 3,4 milliards de bouteilles de rosé provençal, +18% vs 2024. Le rosé de Provence a une acidité plus élevée (pH 3,1-3,3) que le blanc italien moyen, étonnamment longévif.',
    autore:'SW Editorial', data:'Aprile 2026', immagine:W.glass2 },

  { id:'n5', isNews:true,
    titolo_it:'Addio al sentore di tappo? Gli ultrasuoni salvano il sughero',
    titolo_en:'Goodbye Cork Taint? Ultrasound Saves Natural Cork',
    titolo_fr:'Adieu goût de bouchon ? Les ultrasons sauvent le liège naturel',
    categoria_it:'🔬 Innovazione', categoria_en:'🔬 Innovation', categoria_fr:'🔬 Innovation',
    testo_it:'Le nuove tecnologie a ultrasuoni stanno riducendo drasticamente il sentore di tappo. I laboratori portoghesi di Cork Supply Group trattano il sughero con cicli a 40 kHz in CO₂ supercritica: il TCA (tricloroanisolo, responsabile del difetto) si riduce del 98%.\n\nIl tasso di bottiglie difettate è sceso dallo storico 5-7% all\'attuale 0.2% nelle cantine che adottano questo processo. Krug e Salon hanno già migrato a questo standard.\n\nIl vantaggio sul tappo a vite: il sughero naturale permette un micro-scambio di ossigeno che favorisce l\'invecchiamento. Le capsule bloccano tutto l\'ossigeno, creando riduzioni nei vini longevi.',
    testo_en:'Ultrasound at 40 kHz in supercritical CO₂ reduces TCA by 98%. Cork taint rate dropped from 5-7% to 0.2%. Krug and Salon already use this standard. Natural cork still allows micro-oxygenation that screwcaps block.',
    testo_fr:'Ultrasons à 40 kHz en CO₂ supercritique : réduction du TCA de 98%. Le taux de bouchonnage est passé de 5-7% à 0,2%. Krug et Salon ont adopté ce standard. Le liège naturel permet encore la micro-oxygénation.',
    autore:'SW Editorial', data:'Aprile 2026', immagine:W.cellar },
];

/* Gradienti scuri premium */
var BG = ['linear-gradient(135deg,#1a0305,#0d0202)',
          'linear-gradient(135deg,#020614,#010309)',
          'linear-gradient(135deg,#020e06,#010603)',
          'linear-gradient(135deg,#100a02,#080502)',
          'linear-gradient(135deg,#08020e,#040108)'];

/* ═══════════════════════════════════════
   STATO
   ═══════════════════════════════════════ */
var _arts  = NEWS5.slice();
var _sIdx  = 0;
var _sTimer = null;
var _readerOpen = false;
var _lifestyle  = '';
var _3cache = { day: -1 };

/* ═══════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════ */
function getLang(){
  return (window.i18n && window.i18n.current) || localStorage.getItem('sw_lang') || 'it';
}
function tf(a, f){
  var l = getLang();
  return a[f+'_'+l] || a[f+'_it'] || a[f] || '';
}
function safeImg(url){
  /* Restituisce url se esiste, altrimenti null (usa BORDEAUX come bg) */
  return url && url.startsWith('http') ? url : null;
}

/* ═══════════════════════════════════════
   REGIONI per sommelier
   ═══════════════════════════════════════ */
var REGIONI = {
  'Italia':['Piemonte','Toscana','Veneto','Sicilia','Campania','Friuli-VG','Alto Adige','Sardegna','Umbria','Marche','Lombardia','Abruzzo','Puglia','Trentino','Lazio'],
  'Francia':['Borgogna','Bordeaux','Rodano','Alsazia','Champagne','Loira','Languedoc','Provenza','Beaujolais','Jura'],
  'Spagna':['Rioja','Ribera del Duero','Priorat','Rías Baixas','Jerez','Toro','Penedès','Bierzo','Navarra','Rueda'],
  'USA':['Napa Valley','Sonoma','Willamette Valley','Paso Robles','Santa Barbara','Columbia Valley','Finger Lakes'],
  'Germania':['Mosel','Rheingau','Pfalz','Baden','Rheinhessen','Nahe','Franken','Württemberg','Ahr'],
  'Portogallo':['Douro','Alentejo','Vinho Verde','Dão','Bairrada','Lisboa','Madeira'],
  'Argentina':['Mendoza','Salta','Uco Valley','Patagonia','San Juan'],
  'Cile':['Maipo','Colchagua','Casablanca','Elqui','Leyda'],
  'Australia':['Barossa Valley','McLaren Vale','Clare Valley','Yarra Valley','Hunter Valley','Margaret River'],
  'Nuova Zelanda':['Marlborough','Central Otago','Hawke\'s Bay'],
  'Grecia':['Santorini','Naoussa','Nemea','Creta','Samos'],
  'Austria':['Wachau','Kamptal','Kremstal','Burgenland','Steiermark'],
  'Ungheria':['Tokaj','Eger','Villány'],
  'Georgia':['Kakheti','Kartli','Imereti'],
  'Sud Africa':['Stellenbosch','Swartland','Franschhoek','Walker Bay'],
};
var ESEMPI = {
  'Germania':'Riesling Spätlese del Mosel (Egon Müller, JJ Prüm, Wehlener Sonnenuhr), Spätburgunder Ahr (Meyer-Näkel), Silvaner Franken',
  'Francia':'Bourgogne Pinot Noir, Chablis, Champagne, Châteauneuf-du-Pape, Sancerre Sauvignon Blanc',
  'Spagna':'Rioja Tempranillo (Muga), Ribera del Duero, Albariño Rías Baixas, Priorat Garnacha',
  'Austria':'Grüner Veltliner Smaragd Wachau (FX Pichler), Riesling Kamptal, Blaufränkisch Burgenland',
  'USA':'Napa Valley Cabernet (Opus One, Heitz), Willamette Pinot Noir, Finger Lakes Riesling',
  'Grecia':'Assyrtiko Santorini (Gaia, Hatzidakis), Xinomavro Naoussa (Thymiopoulos)',
  'Portogallo':'Douro Touriga Nacional (Niepoort, Ramos Pinto), Alentejo, Vinho Verde Alvarinho',
  'Argentina':'Mendoza Malbec (Catena Zapata, Achaval Ferrer), Salta Torrontés, Uco Valley',
  'Australia':'Barossa Shiraz (Penfolds Grange, Henschke), Clare Valley Riesling, Yarra Pinot Noir',
};

/* ═══════════════════════════════════════
   FIX SOMMELIER — paese OBBLIGATORIO
   ═══════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════
   TASTE ENGINE — Profilo Gusto Utente
   Salva e legge preferenze in localStorage.
   Chiave: 'sw_taste_profile'
   ═══════════════════════════════════════════════════════════ */
var TasteEngine = (function(){
  var KEY = 'sw_taste_v1';

  /* Profilo default */
  var DEFAULT = {
    sessions:    0,                    // quante volte ha usato il sommelier
    colore:      {},                   // es. {rosso:3, bianco:2, bollicine:1}
    paese:       {},                   // es. {Germania:2, Francia:1}
    budget:      [],                   // ultimi 5 budget usati (numeri)
    stileGusto:  {},                   // es. {acido:2, morbido:1, tannico:3}
    feedback:    { positivi:0, negativi:0 },
    ultimiVini:  [],                   // ultimi 5 vini consigliati (stringhe)
    lifestyle:   {},                   // es. {vegan:1, party:2}
  };

  function load(){
    try{
      var raw = localStorage.getItem(KEY);
      if (!raw) return Object.assign({}, DEFAULT);
      return Object.assign({}, DEFAULT, JSON.parse(raw));
    }catch(e){ return Object.assign({}, DEFAULT); }
  }

  function save(p){
    try{ localStorage.setItem(KEY, JSON.stringify(p)); }catch(e){}
  }

  function inc(obj, key, n){
    if (!key) return;
    obj[key] = (obj[key] || 0) + (n || 1);
  }

  return {
    /* Registra una sessione di abbinamento */
    recordSession: function(opts){
      var p = load();
      p.sessions++;
      if (opts.paese)   inc(p.paese, opts.paese);
      if (opts.lifestyle && opts.lifestyle !== '') inc(p.lifestyle, opts.lifestyle);
      if (opts.budget)  { p.budget.push(Number(opts.budget)); if (p.budget.length > 5) p.budget.shift(); }
      if (opts.acido)   inc(p.stileGusto, opts.acido);
      if (opts.struttura) inc(p.stileGusto, opts.struttura);
      save(p);
    },

    /* Registra un vino consigliato */
    recordWine: function(vineName){
      if (!vineName) return;
      var p = load();
      p.ultimiVini.unshift(vineName.substring(0,60));
      if (p.ultimiVini.length > 5) p.ultimiVini.pop();
      save(p);
    },

    /* Registra feedback 👍 / 👎 */
    recordFeedback: function(positive){
      var p = load();
      if (positive) p.feedback.positivi++;
      else          p.feedback.negativi++;
      save(p);
    },

    /* Costruisce il testo del profilo da inserire nel prompt AI */
    buildPromptContext: function(){
      var p = load();
      if (p.sessions < 1) return '';   // nessuna storia ancora

      var lines = [];
      lines.push('═══ PROFILO GUSTO UTENTE (memoria app) ═══');
      lines.push('Sessioni precedenti: ' + p.sessions);

      /* Paese preferito */
      var topPaese = Object.entries(p.paese).sort(function(a,b){return b[1]-a[1];})[0];
      if (topPaese) lines.push('Paese preferito: ' + topPaese[0] + ' (' + topPaese[1] + ' volte)');

      /* Budget medio */
      if (p.budget.length > 0){
        var avg = Math.round(p.budget.reduce(function(a,b){return a+b;},0) / p.budget.length);
        lines.push('Budget medio: €' + avg);
      }

      /* Stile gusto prevalente */
      var topStile = Object.entries(p.stileGusto).sort(function(a,b){return b[1]-a[1];})[0];
      if (topStile) lines.push('Profilo prevalente: ' + topStile[0]);

      /* Vini già consigliati (evita ripetizioni) */
      if (p.ultimiVini.length > 0)
        lines.push('Vini già consigliati in precedenza (evita di ripetere): ' + p.ultimiVini.join(', '));

      /* Feedback */
      if (p.feedback.negativi > p.feedback.positivi && p.feedback.negativi > 1)
        lines.push('NOTA: l\'utente ha valutato negativamente diversi consigli — sii più conservativo e chiedi la sua preferenza esplicitamente.');

      /* Lifestyle preferito */
      var topLs = Object.entries(p.lifestyle).sort(function(a,b){return b[1]-a[1];})[0];
      if (topLs) lines.push('Stile preferito: ' + topLs[0]);

      lines.push('Parla all\'utente come a qualcuno che conosci già. Personalizza il tono in base a questo profilo.');
      lines.push('═══════════════════════════════════════════');

      return '\n\n' + lines.join('\n');
    },

    /* Mostra badge sessioni nell'UI */
    renderBadge: function(){
      var p = load();
      if (p.sessions < 1) return;
      var badge = document.getElementById('al-taste-badge');
      if (!badge){
        badge = document.createElement('div');
        badge.id = 'al-taste-badge';
        badge.style.cssText = 'position:fixed;top:8px;right:60px;z-index:99998;' +
          'background:rgba(191,155,74,.18);border:1px solid rgba(191,155,74,.3);' +
          'border-radius:20px;padding:3px 10px;font-family:Cinzel,serif;' +
          'font-size:9px;color:#BF9B4A;letter-spacing:1px;cursor:pointer;';
        badge.title = 'Il tuo profilo gusto';
        badge.onclick = function(){ TasteEngine.showProfile(); };
        document.body.appendChild(badge);
      }
      badge.textContent = '🍷 ' + p.sessions + (p.sessions === 1 ? ' sessione' : ' sessioni');
    },

    /* Popup profilo */
    showProfile: function(){
      var p = load();
      var topPaese = Object.entries(p.paese).sort(function(a,b){return b[1]-a[1];}).slice(0,3);
      var avgBudget = p.budget.length
        ? '€' + Math.round(p.budget.reduce(function(a,b){return a+b;},0)/p.budget.length)
        : '—';
      var html2 =
        '<div style="position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;" onclick="this.remove()">' +
        '<div style="background:#0A0705;border:1px solid rgba(191,155,74,.3);border-radius:14px;padding:24px;max-width:320px;width:90%;pointer-events:auto;" onclick="event.stopPropagation()">' +
          '<div style="font-family:Cinzel,serif;font-size:.7rem;letter-spacing:3px;color:#BF9B4A;margin-bottom:16px;">🍷 IL TUO PROFILO GUSTO</div>' +
          '<div style="font-size:13px;color:rgba(245,239,226,.75);line-height:2;">' +
            '<div>📊 Sessioni: <strong style="color:#F5EFE2">'+p.sessions+'</strong></div>' +
            '<div>💶 Budget medio: <strong style="color:#F5EFE2">'+avgBudget+'</strong></div>' +
            (topPaese.length ? '<div>🌍 Paesi preferiti: <strong style="color:#F5EFE2">'+topPaese.map(function(x){return x[0];}).join(', ')+'</strong></div>' : '') +
            '<div>👍 Feedback positivi: <strong style="color:#7dda8a">'+p.feedback.positivi+'</strong></div>' +
            '<div>👎 Feedback negativi: <strong style="color:#f99">'+p.feedback.negativi+'</strong></div>' +
            (p.ultimiVini.length ? '<div style="margin-top:10px;font-size:11px;color:rgba(245,239,226,.4);">Ultimi vini: '+p.ultimiVini.join(', ')+'</div>' : '') +
          '</div>' +
          '<button onclick="this.closest(\'[style*=fixed]\').remove()" style="margin-top:18px;width:100%;padding:10px;background:rgba(191,155,74,.16);border:1.5px solid rgba(191,155,74,.35);border-radius:8px;color:#BF9B4A;font-family:Cinzel,serif;font-size:.55rem;letter-spacing:2px;cursor:pointer;">CHIUDI</button>' +
        '</div></div>';
      var d = document.createElement('div');
      d.innerHTML = html2;
      document.body.appendChild(d.firstChild);
    },

    reset: function(){
      try{ localStorage.removeItem(KEY); }catch(e){}
    }
  };
})();

/* ═══════════════════════════════════════════════════════════ */

function fixSommelier(){
  /* updateRegioni con lista completa */
  window.updateRegioni = function(){
    var paese = (document.getElementById('winePaese') || {}).value || '';
    var sel = document.getElementById('wineRegione');
    if (!sel) return;
    sel.innerHTML = '<option value="">Qualsiasi regione</option>';
    (REGIONI[paese] || []).forEach(function(r){
      var o = document.createElement('option');
      o.value = r; o.textContent = r;
      sel.appendChild(o);
    });
    sel.disabled = !paese;
  };
  var ps = document.getElementById('winePaese');
  if (ps){ ps.onchange = window.updateRegioni; if (ps.value) window.updateRegioni(); }

  /* Filtri lifestyle sopra il bottone sommelier */
  injectLifestyleFilters();

  /* doAbbinamento riscritta */
  window.doAbbinamento = async function(){
    var menu   = (document.getElementById('menuText') || {}).value || '';
    if (!menu && !window._photoB64){ alert('Inserisci il menu o fotografalo.'); return; }
    var budget = (document.getElementById('budget') || {}).value || '50';
    var paese  = (document.getElementById('winePaese') || {}).value || '';
    var regione= (document.getElementById('wineRegione') || {}).value || '';
    var lang   = getLang();
    var prefs  = Array.from(document.querySelectorAll('#prefPills .on')).map(function(b){return b.textContent;}).join(', ');

    /* Lingua */
    var LC = { it:'RISPONDI ESCLUSIVAMENTE IN ITALIANO.',
               en:'REPLY EXCLUSIVELY IN ENGLISH.',
               fr:'RÉPONDS EXCLUSIVEMENT EN FRANÇAIS.' };
    var langCmd = LC[lang] || LC.it;

    /* Lifestyle */
    var lsExtra = '';
    if (_lifestyle === 'vegan')
      lsExtra = '\n🌿 VEGAN OBBLIGATORIO: suggerisci solo vini certificati vegan, senza chiarificanti animali.';
    if (_lifestyle === 'budget')
      lsExtra = '\n💸 BUDGET: solo vini sotto €15. Indica il prezzo.';
    if (_lifestyle === 'party')
      lsExtra = '\n🎈 PARTY: solo bollicine e vini festosi. Prosecco, Champagne, Cava, Pétillant Naturel.';

    /* Vincolo geografico */
    var vincolo = '';
    if (paese){
      var esempi = ESEMPI[paese] || 'vini tipici di '+paese;
      vincolo = '\n\n' + '█'.repeat(44) + '\n' +
        '🔴 VINCOLO GEOGRAFICO ASSOLUTO\n' +
        '█'.repeat(44) + '\n' +
        'PAESE: "'+paese+'"'+(regione ? '\nREGIONE: "'+regione+'"' : '')+'\n\n' +
        '✅ Consiglia SOLO vini di '+paese+(regione ? ' — zona '+regione : '')+'\n' +
        '❌ VIETATO qualsiasi vino di altri paesi (inclusa Italia se paese≠Italia)\n' +
        '❌ VIETATO: Barolo, Brunello, Chianti, Amarone se paese≠Italia\n\n' +
        'Esempi di vini '+paese+': '+esempi+'\n' +
        '█'.repeat(44);
    }

    /* Profilo organolettico */
    var profile = '';
    try{
      var p = window.getWineParams ? window.getWineParams() : {};
      profile = '\n\nPROFILO:\n• Acidità: '+(p.acidita||'Media')+
        '\n• Morbidezza: '+(p.morbidezza||'Equilibrata')+
        '\n• Sapidità: '+(p.sapidita||'Media')+
        '\n• Struttura: '+(p.struttura||'Media');
    }catch(e){}

    /* Registra sessione nel profilo gusto */
    TasteEngine.recordSession({
      paese: paese, lifestyle: _lifestyle, budget: budget,
      acido: (window.getWineParams ? (window.getWineParams().acidita||'') : ''),
      struttura: (window.getWineParams ? (window.getWineParams().struttura||'') : ''),
    });

    /* Costruisce contesto profilo da inviare all'AI */
    var tasteContext = TasteEngine.buildPromptContext();

    /* ══════════════════════════════════════════════════════════════
       SOMMELIER AI — CONSULENZA NARRATIVA E POETICA
       ══════════════════════════════════════════════════════════════ */
    var system = langCmd + '\n\n' +

      'Sei un Maestro Sommelier con vent\'anni di esperienza tra le grandi tavole del mondo. ' +
      'Parli come un amico che conosce il vino come conosce la vita — con calore, precisione e poesia. ' +
      (paese ? '🔴 REGOLA ASSOLUTA: consiglia ESCLUSIVAMENTE vini di '+paese+(regione?'/'+regione:'')+'. Nessuna eccezione. ' : '') +

      '\n\nPRIMA DI RISPONDERE: leggi il piatto come leggeresti un racconto. ' +
      'Senti la sua anima — se è grasso, acido, dolce, speziato, succulento — ' +
      'e poi scegli il vino che gli risponde come un partner perfetto.\n\n' +

      'REGOLE FONDAMENTALI (mai da violare):\n' +
      '🍷 Pesce delicato chiama vini bianchi freschi e minerali — mai rossi tannici, che lascerebbero un retrogusto metallico. ' +
      'Eccezione: se l\'ospite vuole assolutamente un rosso, scegli il più leggero e poco tannico possibile.\n' +
      '🍷 Piatti grassi e ricchi vogliono vini con vivace acidità o bollicine — Champagne, Chablis, Vermentino — che puliscono il palato.\n' +
      '🍷 Carne rossa succulenta richiede un vino con corpo e struttura tannica — Barolo, Brunello, Cabernet — che bilanci e asciughi.\n' +
      '🍷 Il dolce vuole solo il dolce — un Sauternes, un Recioto, un Moscato — mai un secco che sembrerebbe acido e vuoto.\n' +
      '🍷 Spezie e aromi intensi si accordano con vini morbidi e fruttati, a bassa percentuale alcolica.\n\n' +

      'STRUTTURA DELLA RISPOSTA — racconta, non elencare:\n' +
      '① L\'ANIMA DEL PIATTO: in una frase, cattura il carattere sensoriale dominante di questo menu\n' +
      '② IL VINO IDEALE: Produttore + Denominazione + Vitigno + Annata — racconta perché è nato per questo piatto, ' +
      'quali sensazioni darà al primo sorso, al corpo e al finale. Indica il prezzo.\n' +
      '③ LA SCELTA INTELLIGENTE: un\'alternativa sotto i 20€ che rispetta la stessa logica di armonia\n' +
      '④ IL RITUALE DEL SERVIZIO: temperatura esatta, calice consigliato, decanter sì o no e perché\n' +
      '⑤ IL SEGRETO DEL SOMMELIER: un aneddoto, una storia o un dettaglio raro che trasforma la cena in un\'esperienza\n\n' +

      'TONO: elegante, diretto, caldo. Come Gualtiero Marchesi parlava di cucina. ' +
      'Nessun gergo tecnico fine a se stesso. Nessun "certamente" o "assolutamente". ' +
      'Se ricordi le preferenze dell\'ospite, usale naturalmente — senza dirlo, come farebbe un amico di lunga data.';

    var userMsg = 'Menu:\n'+menu+'\nBudget: €'+budget+vincolo+lsExtra+profile+tasteContext+(prefs?'\nPreferenze: '+prefs:'');

    document.getElementById('somLoad').style.display = 'block';
    document.getElementById('somResult').style.display = 'none';

    var renderResult = function(text){
      /* Google Analytics — traccia uso sommelier */
      if(window.swTrack){
        swTrack('sommelier_used', {
          paese: paese || 'Tutti',
          regione: regione || 'Tutte',
          lifestyle: _lifestyle || 'nessuno',
          budget: budget,
          language: lang,
        });
      }
      /* Estrae il primo nome di vino consigliato e lo registra */
      var vineMatch = text.match(/\*{0,2}([A-Z][^*\n]{5,50}(?:DOC|DOCG|AOC|QmP|Riserva|Superiore|Grand Cru|AVA)[^*\n]{0,30})\*{0,2}/);
      if (vineMatch) TasteEngine.recordWine(vineMatch[1]);

      var html3 = window.renderSomResult ? window.renderSomResult(text) :
        '<p>'+text.replace(/\n/g,'<br>')+'</p>';

      /* Aggiunge bottoni feedback */
      html3 += '<div id="al-feedback" style="display:flex;align-items:center;gap:10px;margin-top:16px;padding-top:14px;border-top:1px solid rgba(191,155,74,.1);">' +
        '<span style="font-size:11px;color:rgba(245,239,226,.4);font-family:Cinzel,serif;letter-spacing:1px;">IL CONSIGLIO TI HA AIUTATO?</span>' +
        '<button onclick="ALAPP.fbPos(this)" ' +
          'style="padding:6px 14px;border-radius:20px;border:1px solid rgba(125,218,138,.3);background:rgba(125,218,138,.1);color:#7dda8a;cursor:pointer;font-size:13px;">👍</button>' +
        '<button onclick="ALAPP.fbNeg(this)" ' +
          'style="padding:6px 14px;border-radius:20px;border:1px solid rgba(255,150,100,.3);background:rgba(255,100,100,.1);color:#f99;cursor:pointer;font-size:13px;">👎</button>' +
        '</div>';

      document.getElementById('somLoad').style.display = 'none';
      document.getElementById('somResult').innerHTML = html3;
      document.getElementById('somResult').style.display = 'block';
      var acts = document.getElementById('somActions');
      if (acts) acts.style.display = 'flex';
      TasteEngine.renderBadge();
    };

    try{
      var ctrl = new AbortController();
      setTimeout(function(){ ctrl.abort(); }, 30000); /* 30s — Railway freddo può essere lento */
      var r = await fetch(SRV+'/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system, userMsg, language: lang,
          paese, regione, maxTokens: 1400 }),
        signal: ctrl.signal
      });
      var data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Errore server');
      renderResult(data.text || '');
    }catch(e){
      try{
        var t2 = await window.callAPI(system, userMsg, window._photoB64||null, window._photoMime||null);
        renderResult(t2);
      }catch(e2){
        document.getElementById('somLoad').style.display = 'none';
        var errMsg = e2.message.includes('abort') ? 
          'Il server sta impiegando troppo tempo. Riprova tra qualche secondo — il server Railway può essere freddo al primo avvio.' :
          'Errore: '+e2.message+'. Verifica che il server Railway sia attivo su /api/debug';
        document.getElementById('somResult').innerHTML =
          '<p style="color:#f99;line-height:1.8;">⚠ '+errMsg+'</p>'+
          '<p style="margin-top:10px;"><button onclick="doAbbinamento()" style="padding:8px 16px;'+
          'background:rgba(191,155,74,.2);border:1px solid rgba(191,155,74,.4);border-radius:6px;'+
          'color:#BF9B4A;font-family:Cinzel,serif;font-size:.55rem;cursor:pointer;">↻ Riprova</button></p>';
        document.getElementById('somResult').style.display = 'block';
      }
    }
  };
  console.log('[AL] Sommelier fixato: paese + lifestyle + TasteEngine');
}

function injectLifestyleFilters(){
  if (document.getElementById('al-lifestyle')) return;
  var somBtn = document.querySelector('.som-btn, #somBtn, [onclick*="doAbbinamento"]');
  if (!somBtn) return;
  var div = document.createElement('div');
  div.id = 'al-lifestyle';
  div.innerHTML =
    '<button class="al-ls" data-ls="vegan">🌿 Vegan</button>' +
    '<button class="al-ls" data-ls="budget">💸 Daily (< €15)</button>' +
    '<button class="al-ls" data-ls="party">🎈 Party</button>';
  somBtn.parentNode.insertBefore(div, somBtn);
  div.querySelectorAll('.al-ls').forEach(function(btn){
    btn.onclick = function(){
      var ls = btn.dataset.ls;
      if (_lifestyle === ls){ _lifestyle = ''; btn.classList.remove('on'); }
      else {
        _lifestyle = ls;
        div.querySelectorAll('.al-ls').forEach(function(b){ b.classList.remove('on'); });
        btn.classList.add('on');
      }
    };
  });
}

/* ═══════════════════════════════════════
   TICKER nella hero
   ═══════════════════════════════════════ */
function buildTicker(){
  var hero = document.getElementById('heroSection');
  if (!hero) return;
  var old = document.getElementById('al-tick');
  if (old) old.remove();

  var bar = document.createElement('div'); bar.id = 'al-tick';
  var inner = document.createElement('div'); inner.id = 'al-tick-t';

  function makeBatch(list){
    var f = document.createDocumentFragment();
    var lbl = document.createElement('span');
    lbl.style.cssText = 'display:inline-flex;align-items:center;padding:0 16px;height:32px;flex-shrink:0;font-family:Cinzel,serif;font-size:.44rem;letter-spacing:3px;color:rgba(191,155,74,.5);border-right:1px solid rgba(191,155,74,.15);';
    lbl.textContent = '🍷 WINE NEWS'; f.appendChild(lbl);
    list.forEach(function(a){
      var tit = tf(a,'titolo') || ''; if (!tit) return;
      var s = document.createElement('span'); s.className = 'al-ti';
      var d = document.createElement('span'); d.className = 'al-ti-d';
      d.style.background = a.isNews ? 'rgba(120,200,255,.7)' : 'rgba(191,155,74,.6)';
      s.appendChild(d); s.appendChild(document.createTextNode(tit));
      s.onclick = (function(a){ return function(e){ e.stopPropagation(); openReader(a, 0); }; })(a);
      f.appendChild(s);
    });
    return f;
  }
  inner.appendChild(makeBatch(_arts));
  inner.appendChild(makeBatch(_arts));
  bar.appendChild(inner);
  if (getComputedStyle(hero).position === 'static') hero.style.position = 'relative';
  hero.appendChild(bar);
  requestAnimationFrame(function(){
    var w = inner.scrollWidth / 2 || 2000;
    inner.style.animationDuration = Math.max(35, w/65) + 's';
  });
}

/* ═══════════════════════════════════════
   WINE NEWS — slideshow automatico
   ═══════════════════════════════════════ */

/* ── 4 Card accesso rapido nella home ── */
function injectHomeCards(){
  if(document.getElementById('al-home-cards')) return;
  var hb = document.querySelector('#page-home .home-body');
  if(!hb) return;

  var div = document.createElement('div');
  div.id = 'al-home-cards';
  div.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:14px 14px 6px;';

  /* Label card per lingua — hardcoded per sicurezza totale */
  var _cl = getLang();
  var _labels = {
    it: [
      {ico:'🍷', label:'Sommelier AI',  sub:'Abbina il menu',      page:'sommelier', bg:'linear-gradient(135deg,#3d0a0a,#1a0505)', border:'rgba(200,80,80,.4)'},
      {ico:'🌿', label:'Terroir',       sub:'327 denominazioni',    page:'explore',   bg:'linear-gradient(135deg,#0a2010,#051408)', border:'rgba(80,160,80,.35)'},
      {ico:'🏆', label:'Produttori',    sub:'Cantine eccellenti',   page:'producers',bg:'linear-gradient(135deg,#2a1a00,#1a0e00)', border:'rgba(191,155,74,.4)'},
      {ico:'⚖️', label:'Confronta',     sub:'Vini a confronto',     page:'compare',   bg:'linear-gradient(135deg,#0a0520,#050210)', border:'rgba(120,90,220,.35)'},
    ],
    en: [
      {ico:'🍷', label:'AI Sommelier',  sub:'Pair your menu',       page:'sommelier', bg:'linear-gradient(135deg,#3d0a0a,#1a0505)', border:'rgba(200,80,80,.4)'},
      {ico:'🌿', label:'Terroir',       sub:'327 appellations',     page:'explore',   bg:'linear-gradient(135deg,#0a2010,#051408)', border:'rgba(80,160,80,.35)'},
      {ico:'🏆', label:'Producers',     sub:'World wineries',        page:'producers',bg:'linear-gradient(135deg,#2a1a00,#1a0e00)', border:'rgba(191,155,74,.4)'},
      {ico:'⚖️', label:'Compare',       sub:'Wines side by side',   page:'compare',   bg:'linear-gradient(135deg,#0a0520,#050210)', border:'rgba(120,90,220,.35)'},
    ],
    fr: [
      {ico:'🍷', label:'Sommelier IA',  sub:'Accorder le menu',     page:'sommelier', bg:'linear-gradient(135deg,#3d0a0a,#1a0505)', border:'rgba(200,80,80,.4)'},
      {ico:'🌿', label:'Terroir',       sub:'327 appellations',     page:'explore',   bg:'linear-gradient(135deg,#0a2010,#051408)', border:'rgba(80,160,80,.35)'},
      {ico:'🏆', label:'Producteurs',   sub:'Domaines d\'excellence',page:'producers',bg:'linear-gradient(135deg,#2a1a00,#1a0e00)', border:'rgba(191,155,74,.4)'},
      {ico:'⚖️', label:'Comparer',      sub:'Vins comparés',        page:'compare',   bg:'linear-gradient(135deg,#0a0520,#050210)', border:'rgba(120,90,220,.35)'},
    ],
  };
  var cards = _labels[_cl] || _labels.it;

  cards.forEach(function(c){
    var card = document.createElement('div');
    card.style.cssText = 'border-radius:12px;background:'+c.bg+';'+
      'border:1.5px solid '+(c.border||'rgba(191,155,74,.22)')+';'+
      'padding:18px 14px 16px;cursor:pointer;transition:transform .18s,box-shadow .18s;'+
      'box-shadow:0 2px 12px rgba(0,0,0,.4);';
    card.innerHTML =
      '<div style="font-size:1.6rem;margin-bottom:8px;">'+c.ico+'</div>'+
      '<div style="font-family:Cinzel,serif;font-size:.62rem;font-weight:700;letter-spacing:2px;'+
        'color:#BF9B4A;margin-bottom:4px;">'+c.label+'</div>'+
      '<div style="font-family:Cormorant Garamond,Georgia,serif;font-size:.85rem;'+
        'color:rgba(245,239,226,.45);">'+c.sub+'</div>';
    card.onmouseenter = function(){ this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,.5)'; };
    card.onmouseleave = function(){ this.style.transform=''; this.style.boxShadow=''; };
    card.onclick = (function(page, label){
      return function(){
        if(window.swTrack) swTrack('home_card_click', { card: label, destination: page });
        /* Prova showPage prima, poi click sul tab */
        if(typeof showPage === 'function'){
          showPage(page);
        } else {
          var tab = document.querySelector('.ntab[data-page="'+page+'"]');
          if(tab){ tab.click(); }
        }
        /* Scorri in cima */
        window.scrollTo({top:0, behavior:'smooth'});
      };
    })(c.page, c.label);
    div.appendChild(card);
  });

  /* Inserisce PRIMA del Wine News */
  var news = document.getElementById('al-news');
  if(news) hb.insertBefore(div, news);
  else hb.insertBefore(div, hb.firstChild);
}

function injectNews(){
  if (document.getElementById('al-news')) return;
  document.querySelectorAll('.news-section-head,#newsContainer,#defaultHero').forEach(function(el){
    el.style.setProperty('display','none','important');
  });
  var sec = document.createElement('div'); sec.id = 'al-news';
  sec.innerHTML =
    '<div id="al-news-hd"><div id="al-news-lbl"><span class="news-live-dot"></span>WINE NEWS</div>' +
    '<span id="al-cnt" style="font-size:10px;color:rgba(245,239,226,.3);"></span></div>' +
    '<div id="al-sw"></div><div id="al-dots"></div>';
  var hb = document.querySelector('#page-home .home-body');
  if (hb) hb.insertBefore(sec, hb.firstChild);
}

function renderSlides(){
  var area   = document.getElementById('al-sw');
  var dotsEl = document.getElementById('al-dots');
  var cntEl  = document.getElementById('al-cnt');
  if (!area || !dotsEl) return;

  var arts = _arts.slice(0, 7);
  if (cntEl) cntEl.textContent = arts.length + ' articoli';
  area.innerHTML = ''; dotsEl.innerHTML = '';

  arts.forEach(function(a, i){
    var tit = tf(a,'titolo') || '';
    var cat = tf(a,'categoria') || '';
    var txt = tf(a,'testo') || '';
    /* Usa foto dall'articolo (Unsplash Source query specifica dal server)
       oppure smartPhoto come fallback */
    var _rawImg = a.immagine || '';
    var img = (_rawImg && _rawImg.startsWith('http'))
      ? _rawImg
      : smartPhoto(tf(a,'titolo')||a.titolo, tf(a,'categoria')||a.categoria, null, i);
    var bg  = BG[i % BG.length];

    var card = document.createElement('div');
    card.className = 'al-sl' + (i===0?' on':'');
    card.innerHTML =
      '<div class="al-sl-img" style="background:'+(img ? bg : BORDEAUX)+';">' +
        (img ? '<img src="'+img+'" loading="lazy" alt="" onerror="this.parentNode.style.background=\''+BORDEAUX+'\';this.remove()">' :
               '<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:3rem;">🍷</div>') +
      '</div>' +
      '<div class="al-sl-body">' +
        '<div>' +
          '<div class="al-sl-cat">'+cat+'</div>' +
          '<div class="al-sl-tit">'+tit+'</div>' +
          '<div class="al-sl-txt">'+txt.replace(/\n\n/g,' ').substring(0,230)+'</div>' +
        '</div>' +
        '<div class="al-sl-meta">'+(a.data||'')+(a.autore?' · '+a.autore:'')+'</div>' +
      '</div>';
    card.onclick = (function(a,i){ return function(){ openReader(a,i); }; })(a, i);
    area.appendChild(card);

    var dot = document.createElement('div');
    dot.className = 'al-pg' + (i===0?' on':'');
    dot.onclick = (function(i){ return function(){ goSlide(i); }; })(i);
    dotsEl.appendChild(dot);
  });

  if (_sTimer) clearInterval(_sTimer);
  _sIdx = 0;
  _sTimer = setInterval(function(){
    _sIdx = (_sIdx + 1) % arts.length;
    goSlide(_sIdx);
  }, 5500);

  /* ── Touch/Swipe support ── */
  var _tx = 0;
  area.addEventListener('touchstart', function(e){
    _tx = e.touches[0].clientX;
    if (_sTimer){ clearInterval(_sTimer); _sTimer = null; }
  }, {passive:true});
  area.addEventListener('touchend', function(e){
    var dx = e.changedTouches[0].clientX - _tx;
    if (Math.abs(dx) > 40){
      var n = _arts.slice(0,7).length;
      _sIdx = dx < 0 ? (_sIdx+1)%n : (_sIdx-1+n)%n;
      goSlide(_sIdx);
    }
    /* Riprende auto-avanzamento dopo 8 secondi di pausa */
    setTimeout(function(){
      if (!_sTimer){
        var n2 = _arts.slice(0,7).length;
        _sTimer = setInterval(function(){ _sIdx=(_sIdx+1)%n2; goSlide(_sIdx); }, 5500);
      }
    }, 8000);
  }, {passive:true});
  /* Click sui dots = scelta manuale */
  dotsEl.querySelectorAll('.al-pg').forEach(function(dot, i){
    dot.addEventListener('click', function(){
      if (_sTimer){ clearInterval(_sTimer); _sTimer = null; }
      goSlide(i);
      setTimeout(function(){
        if (!_sTimer){
          var n3 = _arts.slice(0,7).length;
          _sTimer = setInterval(function(){ _sIdx=(_sIdx+1)%n3; goSlide(_sIdx); }, 5500);
        }
      }, 8000);
    });
  });
}

function goSlide(idx){
  document.querySelectorAll('.al-sl').forEach(function(c){ c.classList.remove('on'); });
  document.querySelectorAll('.al-pg').forEach(function(d){ d.classList.remove('on'); });
  var c = document.querySelectorAll('.al-sl')[idx];
  var d = document.querySelectorAll('.al-pg')[idx];
  if (c) c.classList.add('on');
  if (d) d.classList.add('on');
  _sIdx = idx;
}

/* ═══════════════════════════════════════
   IL SAPERE DEL VINO — 3 articoli
   ═══════════════════════════════════════ */
var SAPERE = [
  { ico:'🌿', cat:'🌿 Viticoltura', img: W.vineyard,
    titoli:['La Potatura: il Gesto più Importante','Come si Alleva la Vite','La Vendemmia: Quando Raccogliere','Il Diradamento dei Grappoli','Biodiversità in Vigna'],
    testi:[
      'La potatura invernale è il gesto più importante che un vignaiolo compie nell\'anno. Si esegue tra dicembre e febbraio, con la vite in riposo. Ogni tralcio tagliato è una decisione: quante gemme lasciare, quanti grappoli potenziali.\n\nNel sistema Guyot borgognone un unico tralcio principale viene piegato orizzontalmente. I maestri potatori di Barolo camminano ogni filare e decidono diversamente per ogni pianta. Non esistono regole universali.\n\nSull\'Etna le viti ad alberello centenario si autoregolano: ogni grappolo che portano è già straordinario.',
      'L\'allevamento della vite — la forma con cui cresce — determina qualità, longevità e carattere del vino. Il Guyot è il più diffuso. Il cordone di Royat usa due braccia permanenti e si trova in Champagne.\n\nL\'alberello è la forma più antica: bassa, senza supporti, resistente alla siccità perché le radici scendono in profondità fino a 10 metri. Lo troviamo sull\'Etna, a Pantelleria, nelle vecchie vigne di Jerez.\n\nLa forma di allevamento influenza direttamente la concentrazione: meno superficie fogliare, meno produzione, più intensità nel bicchiere.',
      'La vendemmia è il momento decisivo dell\'anno. Raccogliere troppo presto significa acidità eccessiva e tannini verdi. Troppo tardi: perdita di freschezza e alcol eccessivo.\n\nI produttori più attenti effettuano analisi chimiche quotidiane. Assaggiano gli acini ogni mattina e guardano i vinaccioli — che devono diventare marroni per indicare maturità fenolica completa.\n\nCon il cambiamento climatico il Barolo si vendemmia oggi a metà settembre invece che a ottobre come negli anni \'80.',
      'Il diradamento (vendemmia verde) consiste nel tagliare grappoli acerbi a luglio per concentrare la linfa sui restanti. Perdita programmata di quantità per guadagnare qualità.\n\nNei grandi vigneti di Barolo, Brunello e Bordeaux è la norma. I vigneti più vecchi non lo richiedono: una vigna di 80 anni produce tre o quattro grappoli per pianta, già concentratissimi.\n\nÈ il motivo per cui i vini da vigne vecchie — Old Vines — hanno una profondità impossibile da ottenere con viti giovani.',
      'La cover crop — erbe e fiori tra i filari — è la bandiera della viticoltura sostenibile. Ospita insetti benefici, contrasta l\'erosione e riduce i trattamenti chimici.\n\nI vignaioli biodinamici scelgono le piante con cura: leguminose per fissare azoto, fiori per le api.\n\nIn un ettaro di vigna sana, senza erbicidi, vivono più di un milione di organismi per metro quadro. Questa biodiversità invisibile è una componente reale del terroir che si esprime nel bicchiere.'
    ]
  },
  { ico:'🎓', cat:'🎓 Sommelier', img: W.bottles,
    titoli:['Decantazione: Quando e Perché','Il Rigetto della Bottiglia','Temperatura di Servizio','Come si Annusa il Vino','Arte dell\'Abbinamento Cibo-Vino'],
    testi:[
      'La decantazione serve per due ragioni: eliminare i sedimenti dai vini vecchi, e ossigenare i vini giovani tannici.\n\nUn Barolo 2020 beneficia di 2-3 ore in un ampio decanter. I tannini si ammorbidiscono, i profumi si aprono. Un Amarone ne vuole 4-5 ore. Un Borgogna rosso di 15 anni va decantato con delicatezza: la decantazione aggressiva lo rovina in pochi minuti.',
      'Il rigetto di una bottiglia difettata è un diritto del cliente. Il TCA (2,4,6-tricloroanisolo) emette un odore inconfondibile di cantina umida, cartone bagnato, fungo muschiato. Il ristorante è obbligato a cambiarla.\n\nAltri difetti: ossidazione (vino piatto, aranciato, aceto), riduzione (uova, gomma bruciata — spesso si risolve aerando), Brett (stalla, cuoio — difetto nelle alte concentrazioni).\n\nUna bottiglia difettata non si paga. È un diritto tutelato dalle normative europee sulla vendita di beni difettosi.',
      'La temperatura è l\'elemento più trascurato e più impattante. Un Barolo a 22°C sembra alcolico e piatto. Lo stesso vino a 16°C è fresco, preciso, con tannini setosi.\n\nRegola pratica: bianchi e rosé dal frigo 20 minuti prima; rossi leggeri dal frigo 15 minuti prima; rossi strutturati (Barolo, Brunello, Amarone) in una cantina fresca o a 17°C. In estate: 45 minuti in frigorifero prima di servire fa miracoli.',
      'La prima annusata si fa a naso fermo: arrivano gli aromi primari (frutta, fiori, erbe). Dopo aver ruotato il calice, si annusa subito: arrivano gli aromi secondari (fermentazione) e i terziari (cuoio, tabacco, catrame nei grandi rossi).\n\nL\'ottanta percento di quello che percepiamo come "sapore" è olfatto retronasale — aromi che sentiamo mentre degluttiamo. Chi ha il raffreddore percepisce pochissimo. Il naso è lo strumento principale.',
      'L\'abbinamento si basa su due principi: concordanza (similitudine di intensità) e contrasto (equilibrio opposto).\n\nConcordanza: piatto delicato con vino delicato. Contrasto: la frittura vuole bollicine che sgrassano il palato; il foie gras grasso vuole il Sauternes dolce e acido.\n\nRegola d\'oro: abbina prima la struttura, poi gli aromi. Un Barolo con pesce delicato sbaglia perché i tannini si legano alle proteine del pesce creando astringenza metallica.'
    ]
  },
  { ico:'🍇', cat:'🍇 Vitigni del Mondo', img: W.vineyard3,
    titoli:['Il Nebbiolo: il più Difficile d\'Italia','Il Riesling: il più Longevo al Mondo','Il Sangiovese: una Famiglia Intera','Pinot Nero: il Santo Graal','Grenache: il più Coltivato al Mondo'],
    testi:[
      'Il Nebbiolo è il vitigno più difficile d\'Italia: matura tardissimo, ama solo i suoli calcarei delle Langhe, e trasmette il terroir con precisione chirurgica.\n\nA Barolo è austero, tannico, longevo: violetta, rosa secca, catrame, tabacco, tartufo bianco dopo anni. A Barbaresco, su suoli più sabbiosi, è più elegante e accessibile giovane.\n\nI grandi Nebbiolo richiedono 10-15 anni per esprimersi pienamente. Monfortino di Conterno, Barolo Mascarello: migliorano per 30-40 anni.',
      'Il Riesling è il vitigno a bacca bianca più longevo al mondo. Un Trockenbeerenauslese del Mosel in annata eccezionale invecchia 80-100 anni. Bottiglie degli anni \'40 sono ancora vive e straordinarie.\n\nIl segreto: acidità naturale elevatissima che agisce da conservante. Con l\'invecchiamento sviluppa la "petroliosità" — idrocarburi nobili considerati la firma della grandezza.\n\nArdesia blu del Mosel, granito dell\'Alsazia, calcare del Rheingau: ogni suolo firma il Riesling diversamente.',
      'Il Sangiovese non è un singolo vitigno: è una famiglia. Il Grosso di Montalcino — il Brunello — è austero e longevo. Il Piccolo del Chianti è più fruttato e accessibile. Il Prugnolo Gentile di Montepulciano ancora diverso.\n\nSono cloni geneticamente distinti, selezioni millenarie. Brunello e Chianti Classico condividono il DNA ma sono vini completamente diversi — come Gevrey e Chambolle in Borgogna.\n\nIl Sangiovese è il vitigno più coltivato d\'Italia: oltre 65.000 ettari.',
      'Il Pinot Nero è il vitigno più difficile al mondo. Richiede microclima perfetto, buccia sottile che lo rende vulnerabile alle malattie.\n\nEppure produce i vini più costosi: Romanée-Conti, Chambertin, Musigny. In Borgogna su calcare kimmeridgiano ha trovato il suo habitat perfetto dopo secoli di selezione monastica.\n\nFuori dalla Borgogna riesce pochi posti: Willamette Valley Oregon, Central Otago Nuova Zelanda, Ahr Germania, Etna Sicilia.',
      'Il Grenache (Garnacha in Spagna, Cannonau in Sardegna) è il vitigno a bacca rossa più coltivato: oltre 200.000 ettari. Base di Châteauneuf-du-Pape, del Priorat, e di quasi tutti i rosati della Provenza.\n\nNaturalmente alto in alcol (15-16%) ma basso in tannini, ha bisogno di partner: Syrah e Mourvèdre nel blend provenzale, Cariñena nel Priorat.\n\nIn Sardegna, il Cannonau delle vigne centenarie di Orgosolo è straordinario: minerale, speziato, longevità sorprendente. Giuseppe Sedilesu e Fratelli Pala sono i riferimenti.'
    ]
  },
];

function injectSapere(){
  if (document.getElementById('al-sapere')) return;
  var footer = document.querySelector('footer'); if (!footer) return;
  var sec = document.createElement('div'); sec.id = 'al-sapere';
  sec.innerHTML =
    '<div id="al-sapere-hd"><span style="font-size:.9rem;">📖</span>' +
    '<span style="font-family:Cinzel,serif;font-size:.58rem;letter-spacing:4px;color:var(--vino,#8B0000);">IL SAPERE DEL VINO</span>' +
    '<span id="al-sapere-d" style="font-size:10px;color:rgba(245,239,226,.18);margin-left:auto;"></span></div>';
  footer.parentNode.insertBefore(sec, footer);
  render3Art();
}

function render3Art(forceArts){
  var sec = document.getElementById('al-sapere'); if (!sec) return;
  var today = new Date();
  var d = document.getElementById('al-sapere-d');
  if (d) d.textContent = today.toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long'});
  var dayN = Math.floor(Date.now() / 86400000);
  if (!forceArts && _3cache.day === dayN) return;
  _3cache.day = dayN;
  sec.querySelectorAll('.al-art').forEach(function(el){ el.remove(); });

  SAPERE.forEach(function(S, i){
    var ti  = (dayN + i) % S.titoli.length;
    var tit = S.titoli[ti];
    var txt = S.testi[ti];
    /* Solo bordeaux + icona — niente foto Unsplash per il Sapere del Vino */
    var card = document.createElement('div'); card.className = 'al-art';
    card.innerHTML =
      '<div class="al-art-ph" style="background:linear-gradient(135deg,#3a0404,#1a0202);">'+S.ico+'</div>' +
      '<div class="al-art-body">' +
        '<div class="al-art-tag">'+S.cat+'</div>' +
        '<div class="al-art-tit">'+tit+'</div>' +
        '<div class="al-art-txt">'+txt.substring(0,340)+'…</div>' +
        '<div class="al-art-foot">'+today.toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'})+' · SW Editorial</div>' +
      '</div>';
    card.onclick = (function(tit,txt,img,cat,i){ return function(){
      openReader({ titolo:tit, categoria:cat, testo:txt,
        autore:'Sommelier World', data:today.toLocaleDateString('it-IT'), immagine:img||'' }, i);
    }; })(tit, txt, S.img, S.cat, i);
    sec.appendChild(card);
  });
}

/* ═══════════════════════════════════════
   READER FULL SCREEN
   ═══════════════════════════════════════ */
function openReader(art, idx){
  var tit = tf(art,'titolo') || art.titolo || '';
  var cat = tf(art,'categoria') || art.categoria || '';
  var txt = tf(art,'testo') || art.testo || '';
  var img = safeImg(art.immagine);
  var paras = (txt||'').split(/\n\n+/).filter(Boolean)
    .map(function(p){ return '<p style="margin:0 0 20px;font-size:1.06rem;line-height:2;color:rgba(245,240,232,.76);">'+p.trim()+'</p>'; }).join('');

  var r = document.getElementById('al-reader');
  if (!r){ r = document.createElement('div'); r.id = 'al-reader'; document.body.appendChild(r); }
  r.innerHTML =
    '<div style="position:sticky;top:0;z-index:2;background:rgba(10,7,5,.97);backdrop-filter:blur(12px);'+
      'border-bottom:1px solid rgba(191,155,74,.12);display:flex;align-items:center;gap:12px;padding:12px 16px;">' +
      '<button onclick="ALAPP.closeReader()" style="width:36px;height:36px;border-radius:50%;'+
        'background:rgba(191,155,74,.1);border:1px solid rgba(191,155,74,.2);color:#BF9B4A;'+
        'font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;">←</button>' +
      '<div style="font-family:Cinzel,serif;font-size:.56rem;letter-spacing:2px;color:rgba(191,155,74,.6);'+
        'flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+tit+'</div>' +
    '</div>' +
    '<div style="max-width:720px;margin:0 auto;padding-bottom:80px;">' +
      '<div style="width:100%;height:215px;background:'+(img?'#0a0705':BORDEAUX)+';position:relative;'+
        'overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:3.5rem;">' +
        (img ? '<img src="'+img+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" alt="" onerror="this.parentNode.style.background=\''+BORDEAUX+'\';this.remove()">' : '') +
        '<span style="position:relative;z-index:1;filter:drop-shadow(0 2px 12px rgba(0,0,0,.9));">🍷</span>' +
      '</div>' +
      '<div style="padding:24px 20px 0;">' +
        '<div style="font-size:9px;font-weight:700;letter-spacing:3px;color:rgba(191,155,74,.45);text-transform:uppercase;margin-bottom:10px;">'+cat+'</div>' +
        '<h1 style="font-family:\'Playfair Display\',Georgia,serif;font-size:1.6rem;font-weight:700;line-height:1.25;color:#F5EFE2;margin:0 0 14px;">'+tit+'</h1>' +
        '<div style="font-size:11px;color:rgba(245,239,226,.25);margin-bottom:24px;padding-bottom:14px;'+
          'border-bottom:1px solid rgba(191,155,74,.08);display:flex;gap:8px;flex-wrap:wrap;">' +
          (art.data ? '<span>'+art.data+'</span>' : '') +
          (art.autore ? '<span>·</span><span>'+art.autore+'</span>' : '') +
          (art.generato_ai ? '<span style="background:rgba(125,218,138,.1);color:rgba(125,218,138,.62);font-size:9px;padding:2px 7px;border-radius:3px;">✦ AI</span>' : '') +
        '</div>' +
        '<div style="font-family:\'Cormorant Garamond\',Georgia,serif;">' +
          (paras || '<p>Contenuto non disponibile.</p>') +
        '</div>' +
      '</div>' +
    '</div>';
  r.style.display = 'block'; r.scrollTop = 0;
  /* GA — traccia articolo aperto */
  if(window.swTrack){
    swTrack('article_read', {
      article_title: tit.substring(0, 100),
      article_category: cat,
      is_ai: !!(art && art.generato_ai),
    });
  }
  document.body.style.overflow = 'hidden'; _readerOpen = true;
  try{ history.pushState({r:1}, ''); }catch(e){}
}
window.addEventListener('popstate', function(){
  if (_readerOpen){
    var r = document.getElementById('al-reader');
    if (r) r.style.display = 'none';
    document.body.style.overflow = ''; _readerOpen = false;
  }
});

/* ═══════════════════════════════════════
   VISIBILITÀ HOME-ONLY
   ═══════════════════════════════════════ */
function checkVis(){
  var isHome = !!(
    document.querySelector('#page-home.active') ||
    document.querySelector('#page-home[style*="block"]')
  );
  ['al-news','al-sapere'].forEach(function(id){
    var el = document.getElementById(id);
    if (el) el.style.setProperty('display', isHome ? '' : 'none', 'important');
  });
}
function hookPage(){
  if (window.__al_hooked) return;
  var orig = window.showPage;
  if (!orig){ setTimeout(hookPage, 400); return; }
  window.showPage = function(pid){
    orig.call(this, pid);
    setTimeout(checkVis, 60);
    if (pid === 'home') setTimeout(buildTicker, 120);
    if (pid === 'admin') setTimeout(injectAdminArticlesPanel, 200);
  };
  document.querySelectorAll('.ntab').forEach(function(t){
    t.addEventListener('click', function(){ setTimeout(checkVis, 100); }, true);
  });
  window.__al_hooked = true;
}

/* ═══════════════════════════════════════
   FAB + CONTATTI
   ═══════════════════════════════════════ */
function addFAB(){
  if (document.getElementById('al-fab')) return;
  var fab = document.createElement('div'); fab.id = 'al-fab'; fab.title = 'Scrivici';
  fab.innerHTML = '✉️';
  fab.onclick = function(){ ALAPP.openContact(); };
  document.body.appendChild(fab);
}

window.ALAPP = {
  /* Aggiorna testi dinamici al cambio lingua */
  applyLang: function(lang){
    /* Rigenera cards con la nuova lingua (label hardcoded per lingua) */
    var old = document.getElementById('al-home-cards');
    if(old){ old.remove(); }
    setTimeout(injectHomeCards, 50);
    /* Aggiorna news cnt */
    var cnt = document.getElementById('al-cnt');
    if(cnt && window.i18n){
      var n = cnt.textContent.match(/\d+/);
      if(n) cnt.textContent = n[0]+' '+window.i18n.t('newsArticoli');
    }
  },
  fbPos: function(btn){
    TasteEngine.recordFeedback(true);
    if(window.swTrack) swTrack('sommelier_feedback', {type:'positive'});
    if(btn && btn.parentNode) btn.parentNode.innerHTML = '<span style="color:#7dda8a;font-size:13px;">✓ Grazie per il feedback!</span>';
  },
  fbNeg: function(btn){
    TasteEngine.recordFeedback(false);
    if(window.swTrack) swTrack('sommelier_feedback', {type:'negative'});
    if(btn && btn.parentNode) btn.parentNode.innerHTML = '<span style="color:#BF9B4A;font-size:13px;">✓ Terremo conto del feedback.</span>';
  },
  closeReader: function(){
    var r = document.getElementById('al-reader');
    if (r) r.style.display = 'none';
    document.body.style.overflow = ''; _readerOpen = false;
  },
  openContact: function(){
    var p = document.getElementById('al-cp');
    if (p){ p.style.display = 'block'; document.body.style.overflow = 'hidden'; return; }
    p = document.createElement('div'); p.id = 'al-cp';
    p.innerHTML =
      '<div style="position:sticky;top:0;z-index:2;background:rgba(10,7,5,.97);backdrop-filter:blur(12px);'+
        'border-bottom:1px solid rgba(191,155,74,.15);display:flex;align-items:center;gap:12px;padding:13px 16px;">' +
        '<button onclick="ALAPP.closeContact()" style="width:36px;height:36px;border-radius:50%;'+
          'background:rgba(191,155,74,.1);border:1px solid rgba(191,155,74,.2);color:#BF9B4A;'+
          'font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;">←</button>' +
        '<div style="font-family:Cinzel,serif;font-size:.65rem;letter-spacing:3px;color:#F5EFE2;">CONTATTI</div>' +
      '</div>' +
      '<div style="max-width:540px;margin:0 auto;padding:24px 20px 80px;box-sizing:border-box;">' +
        '<div style="text-align:center;margin-bottom:22px;">' +
          '<h2 style="font-family:\'Playfair Display\',serif;font-size:1.4rem;font-weight:700;color:#F5EFE2;margin:0 0 6px;">Come possiamo aiutarti?</h2>' +
          '<p style="font-size:12px;color:rgba(245,239,226,.4);line-height:1.7;margin:0;">Produttori, collaborazioni, segnalazioni. Risponderemo entro 48 ore.</p>' +
        '</div>' +
        '<div id="al-cok" style="display:none;text-align:center;padding:20px;background:rgba(125,218,138,.07);border:1px solid rgba(125,218,138,.16);border-radius:10px;margin-bottom:16px;">' +
          '<div style="font-size:1.8rem;">✓</div>' +
          '<div style="font-family:\'Playfair Display\',serif;color:#7dda8a;margin-top:4px;">Messaggio inviato!</div>' +
        '</div>' +
        '<div id="al-cfrm">' +
          '<div style="margin-bottom:14px;"><label class="al-fl">NOME *</label><input id="al-cn" class="al-fi" type="text" placeholder="Il tuo nome"></div>' +
          '<div style="margin-bottom:14px;"><label class="al-fl">EMAIL *</label><input id="al-ce" class="al-fi" type="email" placeholder="tua@email.com"></div>' +
          '<div style="margin-bottom:14px;"><label class="al-fl">MESSAGGIO *</label><textarea id="al-cm" class="al-fi" style="height:100px;resize:none;" placeholder="Scrivi qui..."></textarea></div>' +
          '<button onclick="ALAPP.sendMsg()" class="al-fb">✦ INVIA MESSAGGIO ✦</button>' +
          '<div id="al-cerr" style="display:none;margin-top:8px;padding:10px;background:rgba(220,50,50,.1);border:1px solid rgba(220,50,50,.2);border-radius:6px;font-size:12px;color:rgba(255,150,150,.88);text-align:center;"></div>' +
        '</div>' +
        '<div style="margin:20px 0;border-top:1px solid rgba(191,155,74,.1);position:relative;">' +
          '<span style="position:absolute;top:-8px;left:50%;transform:translateX(-50%);background:#0A0705;padding:0 12px;font-size:9px;letter-spacing:3px;color:rgba(191,155,74,.28);">NEWSLETTER</span>' +
        '</div>' +
        '<div style="display:flex;gap:10px;">' +
          '<input id="al-nle" class="al-fi" type="email" placeholder="la.tua@email.com" style="flex:1;">' +
          '<button onclick="ALAPP.subscribe()" style="padding:11px 14px;background:rgba(191,155,74,.15);border:1.5px solid rgba(191,155,74,.3);border-radius:8px;color:#BF9B4A;font-family:Cinzel,serif;font-size:.5rem;font-weight:700;cursor:pointer;white-space:nowrap;">ISCRIVITI</button>' +
        '</div>' +
        '<div style="text-align:center;margin-top:18px;"><a href="mailto:info@sommelierworld.vin" style="color:rgba(191,155,74,.5);font-size:13px;text-decoration:none;">info@sommelierworld.vin</a></div>' +
      '</div>';
    document.body.appendChild(p);
    p.style.display = 'block'; document.body.style.overflow = 'hidden';
  },
  closeContact: function(){
    var p = document.getElementById('al-cp');
    if (p) p.style.display = 'none';
    document.body.style.overflow = '';
    document.querySelectorAll('.ntab').forEach(function(t){ t.classList.remove('active'); });
    var h = document.querySelector('.ntab[data-page="home"]');
    if (h) h.classList.add('active');
    checkVis();
  },
  sendMsg: async function(){
    var n = (document.getElementById('al-cn')||{}).value||'';
    var e = (document.getElementById('al-ce')||{}).value||'';
    var m = (document.getElementById('al-cm')||{}).value||'';
    var err = document.getElementById('al-cerr');
    n=n.trim(); e=e.trim(); m=m.trim();
    function se(t){ if(err){err.textContent=t;err.style.display='block';} }
    if (!n) return se('Inserisci il nome.');
    if (!e || !e.includes('@')) return se('Email non valida.');
    if (m.length < 4) return se('Messaggio troppo corto.');
    if (err) err.style.display = 'none';
    var sent = false;
    try{
      var ctrl = new AbortController();
      setTimeout(function(){ ctrl.abort(); }, 8000);
      var r = await fetch(SRV+'/api/contact',{method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name:n,email:e,subject:'Messaggio',message:m}),
        signal:ctrl.signal});
      if (r.ok){ var d = await r.json(); sent = !!d.ok; }
    }catch(ex){}
    if (!sent)
      window.location.href = 'mailto:info@sommelierworld.vin?subject=[SW]&body='+
        encodeURIComponent('Da: '+n+'\nEmail: '+e+'\n\n'+m);
    var frm=document.getElementById('al-cfrm'), ok=document.getElementById('al-cok');
    if (frm) frm.style.display = 'none';
    if (ok) ok.style.display = 'block';
  },
  subscribe: async function(){
    var email = (document.getElementById('al-nle')||{}).value||''; email=email.trim();
    if (!email || !email.includes('@')) return;
    try{ await fetch(SRV+'/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name:'Newsletter',email,subject:'Newsletter',message:'Iscrizione'})}); }catch(ex){}
    var nl = document.getElementById('al-nle');
    if (nl){ nl.value=''; nl.placeholder='✓ Iscritto!'; }
  }
};

/* ═══════════════════════════════════════
   LINGUA PERSISTENTE
   ═══════════════════════════════════════ */
function hookLang(){
  var orig = window.i18n && window.i18n.setLang && window.i18n.setLang.bind(window.i18n);
  if (!orig) return;
  window.i18n.setLang = function(l){
    orig(l);
    try{ localStorage.setItem('sw_lang', l); }catch(e){}
    setTimeout(function(){
      /* Aggiorna tutti i testi dinamici con la nuova lingua */
      renderSlides();
      buildTicker();
      render3Art();
      /* Aggiorna testo placeholder del sommelier */
      var ph = document.getElementById('menuText');
      var phMap = {
        it: 'Es: Risotto ai funghi porcini, Tagliata di manzo, Tiramisù…',
        en: 'E.g.: Mushroom risotto, Beef tagliata, Tiramisu…',
        fr: 'Ex : Risotto aux champignons, Tagliata de bœuf, Tiramisu…'
      };
      if(ph && ph.placeholder) ph.placeholder = phMap[l] || phMap.it;
      /* Ricarica articoli dal server nella nuova lingua */
      _3cache.day = -1;
      loadServerArts();
    }, 200);
  };
}

/* Kill FAB vecchi + mappa dark */
function cleanup(){
  document.querySelectorAll(
    '#sw11-fab-contact,[id*="fab-contact"]:not(#al-fab),#sw10-contact'
  ).forEach(function(el){ el.style.setProperty('display','none','important'); });
  window.fixContactButton = function(){};
  var _mw = setInterval(function(){
    if (typeof L !== 'undefined' && window.TILES){
      window.TILES.street = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      clearInterval(_mw);
    }
  }, 800);
  setTimeout(function(){ clearInterval(_mw); }, 15000);
}

/* ═══════════════════════════════════════
   CARICA ARTICOLI DAL SERVER (opzionale)
   ═══════════════════════════════════════ */
async function loadServerArts(){
  /* Controlla se è un nuovo giorno — se sì svuota cache locale articoli */
  var todayKey = new Date().toISOString().split('T')[0];
  var lastDay = '';
  try{ lastDay = localStorage.getItem('sw_arts_day')||''; }catch(e){}
  if(lastDay !== todayKey){
    try{ localStorage.removeItem('sw_arts_cache'); localStorage.setItem('sw_arts_day', todayKey); }catch(e){}
    console.log('[AL] Nuovo giorno ('+todayKey+') — richiedo articoli freschi al server');
  }
  try{
    var lang = getLang();
    var ctrl = new AbortController();
    setTimeout(function(){ ctrl.abort(); }, 8000);
    var r = await fetch(SRV+'/api/articles', { signal: ctrl.signal });
    if (!r.ok) return;
    var data = await r.json();
    if (!data || !data.length) return;

    /* Divide: news (isNews:true) per Wine News, culturali per Sapere */
    var news     = [];
    var culturali= [];
    data.forEach(function(a, i){
      /* Niente foto Unsplash — bordeaux+icona gestito in render */
      a.immagine = '';  /* forza placeholder bordeaux */
      if (!a.titolo)    a.titolo    = a['titolo_'+lang]    || a.titolo_it    || a.titolo_en    || '';
      if (!a.categoria) a.categoria = a['categoria_'+lang] || a.categoria_it || '';
      if (!a.testo)     a.testo     = a['testo_'+lang]     || a.testo_it     || '';
      if (a.isNews) news.push(a); else culturali.push(a);
    });

    /* Aggiorna Wine News slideshow:
       Combina hardcoded NEWS5 + news dal server
       per garantire sempre almeno 5 notizie */
    var combined = [];
    /* Prima le news del server (fresche) */
    if (news.length) combined = combined.concat(news);
    /* Poi aggiunge le hardcoded che non siano duplicate */
    var serverIds = new Set(combined.map(function(a){return a.id;}));
    NEWS5.forEach(function(n){
      if(!serverIds.has(n.id)) combined.push(n);
    });
    _arts = combined.slice(0, 8); /* max 8 nel carousel */
    renderSlides(); buildTicker();

    /* Aggiorna Sapere del Vino con articoli culturali AI */
    if (culturali.length >= 3){
      _3cache.day = -1; /* forza re-render */
      renderSapereFromServer(culturali.slice(0, 3));
    }

    console.log('[AL] Server: '+news.length+' news + '+culturali.length+' culturali ✓');
  }catch(e){
    console.log('[AL] Fallback hardcoded ('+e.message+')');
  }
}

/* Renderizza il Sapere del Vino usando articoli AI dal server */
function renderSapereFromServer(arts){
  var sec = document.getElementById('al-sapere'); if (!sec) return;
  sec.querySelectorAll('.al-art').forEach(function(el){ el.remove(); });
  var today = new Date();
  var SAFE_ICONS = ['🍷','🌿','🍇','🏔','🍾','🌾'];
  arts.forEach(function(a, i){
    var tit  = a.titolo || '';
    var txt  = a.testo  || '';
    var cat  = a.categoria || '';

    /* Immagine da URL Unsplash Source (query specifica) o bordeaux fallback */
    var artImg = a.immagine || '';
    var isUnsplash = artImg.indexOf('source.unsplash.com') > -1 || artImg.indexOf('unsplash.com/photo-') > -1;

    var card = document.createElement('div'); card.className = 'al-art';
    var _ph = '<div class="al-art-ph" style="background:linear-gradient(135deg,#3a0404,#1a0202);">'+ SAFE_ICONS[i % SAFE_ICONS.length] +'</div>';
    var _img = isUnsplash ? '<img class="al-art-img" src="'+artImg+'" loading="lazy" alt="" onerror="this.style.display=&quot;none&quot;">'+_ph.replace('display:none','').replace('</div>','') : _ph;
    card.innerHTML = _img +
      '<div class="al-art-body">' +
        '<div class="al-art-tag">'+cat+'</div>' +
        '<div class="al-art-tit">'+tit+'</div>' +
        '<div class="al-art-txt">'+txt.substring(0, 340)+'…</div>' +
        '<div class="al-art-foot">'+
          today.toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'})+
          ' · '+( a.generato_ai ? '✦ Sommelier World AI' : (a.autore||'SW Editorial'))+
        '</div>' +
      '</div>';
    card.onclick = (function(tit,txt,img,cat,i){ return function(){
      openReader({titolo:tit, categoria:cat, testo:txt,
        autore: a.generato_ai ? 'Sommelier World AI' : (a.autore||''),
        data: today.toLocaleDateString('it-IT'), immagine: img,
        generato_ai: a.generato_ai}, i);
    };})(tit, txt, img, cat, i);
    sec.appendChild(card);
  });
  /* Aggiorna data */
  var d = document.getElementById('al-sapere-d');
  if (d) d.textContent = today.toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long'});
}

/* ═══════════════════════════════════════
   INIT
   ═══════════════════════════════════════ */

/* ════════════════════════════════════════════════════════
   ADMIN ARTICOLI — pannello per aggiungere/rimuovere
   Si attiva dal pannello admin esistente (password: ADMIN_SECRET)
   ════════════════════════════════════════════════════════ */
function injectAdminArticlesPanel(){
  /* Cerca il pannello admin esistente */
  var adminPage = document.getElementById('page-admin') || document.querySelector('[id*="admin"]');
  if(!adminPage) return;

  if(document.getElementById('al-admin-arts')) return;

  var panel = document.createElement('div');
  panel.id = 'al-admin-arts';
  panel.style.cssText = 'margin-top:24px;padding:0 16px 40px;';
  panel.innerHTML =
    '<div style="font-family:Cinzel,serif;font-size:.65rem;letter-spacing:4px;color:#BF9B4A;'+
      'border-bottom:1px solid rgba(191,155,74,.2);padding-bottom:10px;margin-bottom:16px;">'+
      '📝 GESTIONE ARTICOLI'+
    '</div>'+

    /* Stats */
    '<div id="al-art-stats" style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;"></div>'+

    /* Genera nuovi */
    '<div style="background:rgba(191,155,74,.06);border:1px solid rgba(191,155,74,.15);border-radius:8px;padding:14px;margin-bottom:16px;">'+
      '<div style="font-family:Cinzel,serif;font-size:.58rem;letter-spacing:2px;color:rgba(191,155,74,.7);margin-bottom:10px;">⚡ GENERA ARTICOLI AI</div>'+
      '<p style="font-size:12px;color:rgba(245,239,226,.5);margin:0 0 10px;line-height:1.6;">'+
        'Genera 6 nuovi articoli AI per oggi. Il server sceglierà argomenti dal pool mondiale.'+
      '</p>'+
      '<button onclick="ALAPP.adminGenerateArts()" style="padding:10px 18px;background:rgba(191,155,74,.2);'+
        'border:1.5px solid rgba(191,155,74,.4);border-radius:6px;color:#BF9B4A;'+
        'font-family:Cinzel,serif;font-size:.55rem;letter-spacing:2px;cursor:pointer;width:100%;">'+
        '✦ GENERA ARTICOLI ORA ✦'+
      '</button>'+
      '<div id="al-gen-status" style="margin-top:8px;font-size:11px;color:rgba(245,239,226,.4);text-align:center;"></div>'+
    '</div>'+

    /* Scrivi tu un articolo */
    '<div style="background:rgba(10,4,2,.8);border:1px solid rgba(191,155,74,.15);border-radius:8px;padding:14px;margin-bottom:16px;">'+
      '<div style="font-family:Cinzel,serif;font-size:.58rem;letter-spacing:2px;color:rgba(191,155,74,.7);margin-bottom:10px;">✍️ SCRIVI ARTICOLO MANUALE</div>'+
      '<div style="margin-bottom:10px;">'+
        '<label style="display:block;font-size:9px;font-weight:700;letter-spacing:2px;color:rgba(191,155,74,.4);text-transform:uppercase;margin-bottom:4px;">TITOLO *</label>'+
        '<input id="al-admin-tit" type="text" placeholder="Es: Il Barolo 2019 è straordinario" '+
          'style="width:100%;box-sizing:border-box;padding:9px;background:rgba(255,255,255,.05);'+
          'border:1px solid rgba(191,155,74,.2);border-radius:6px;color:#F5EFE2;font-size:14px;outline:none;">'+
      '</div>'+
      '<div style="margin-bottom:10px;">'+
        '<label style="display:block;font-size:9px;font-weight:700;letter-spacing:2px;color:rgba(191,155,74,.4);text-transform:uppercase;margin-bottom:4px;">CATEGORIA</label>'+
        '<select id="al-admin-cat" style="width:100%;padding:9px;background:rgba(10,7,5,.9);border:1px solid rgba(191,155,74,.2);border-radius:6px;color:#F5EFE2;font-size:14px;outline:none;">'+
          '<option value="🗞 Wine News">🗞 Wine News</option>'+
          '<option value="🌍 Terroir">🌍 Terroir</option>'+
          '<option value="📚 Sommelier">📚 Sommelier</option>'+
          '<option value="🍇 Viticoltura">🍇 Viticoltura</option>'+
          '<option value="🍷 Vitigni">🍷 Vitigni</option>'+
          '<option value="✨ Curiosità">✨ Curiosità</option>'+
        '</select>'+
      '</div>'+
      '<div style="margin-bottom:10px;">'+
        '<label style="display:block;font-size:9px;font-weight:700;letter-spacing:2px;color:rgba(191,155,74,.4);text-transform:uppercase;margin-bottom:4px;">TESTO ARTICOLO *</label>'+
        '<textarea id="al-admin-txt" rows="8" placeholder="Scrivi qui il tuo articolo..." '+
          'style="width:100%;box-sizing:border-box;padding:9px;background:rgba(255,255,255,.05);'+
          'border:1px solid rgba(191,155,74,.2);border-radius:6px;color:#F5EFE2;font-size:14px;'+
          'outline:none;resize:vertical;font-family:Cormorant Garamond,Georgia,serif;line-height:1.8;"></textarea>'+
      '</div>'+
      '<button onclick="ALAPP.adminSaveArt()" style="padding:10px 18px;background:rgba(125,218,138,.15);'+
        'border:1.5px solid rgba(125,218,138,.3);border-radius:6px;color:#7dda8a;'+
        'font-family:Cinzel,serif;font-size:.55rem;letter-spacing:2px;cursor:pointer;width:100%;">'+
        '✓ SALVA E PUBBLICA ARTICOLO'+
      '</button>'+
      '<div id="al-save-status" style="margin-top:8px;font-size:11px;color:rgba(245,239,226,.4);text-align:center;"></div>'+
    '</div>'+

    /* Lista articoli esistenti */
    '<div id="al-arts-list">'+
      '<div style="font-family:Cinzel,serif;font-size:.56rem;letter-spacing:3px;color:rgba(191,155,74,.5);margin-bottom:10px;">ARTICOLI PUBBLICATI</div>'+
      '<div id="al-arts-items" style="font-size:12px;color:rgba(245,239,226,.4);">Caricamento...</div>'+
    '</div>';

  adminPage.appendChild(panel);
  ALAPP.adminLoadArts();
}

/* Estende ALAPP con funzioni admin */
Object.assign(window.ALAPP || (window.ALAPP={}), {
  adminLoadArts: async function(){
    var el = document.getElementById('al-arts-items');
    var stats = document.getElementById('al-art-stats');
    if(!el) return;
    try{
      var r = await fetch(SRV+'/api/articles');
      var data = r.ok ? await r.json() : [];
      
      /* Stats */
      if(stats){
        var ai = data.filter(function(a){return a.generato_ai;}).length;
        stats.innerHTML = [
          ['📰', data.length, 'Totali'],
          ['🤖', ai, 'AI'],
          ['✍️', data.length-ai, 'Manuali'],
        ].map(function(s){
          return '<div style="background:rgba(191,155,74,.08);border:1px solid rgba(191,155,74,.12);'+
            'border-radius:8px;padding:10px 16px;text-align:center;flex:1;">'+
            '<div style="font-size:1.3rem;">'+s[0]+'</div>'+
            '<div style="font-family:Cinzel,serif;font-size:1.1rem;color:#BF9B4A;">'+s[1]+'</div>'+
            '<div style="font-size:9px;color:rgba(245,239,226,.35);letter-spacing:2px;">'+s[2]+'</div>'+
          '</div>';
        }).join('');
      }

      /* Lista */
      if(!data.length){ el.textContent = 'Nessun articolo ancora.'; return; }
      el.innerHTML = data.map(function(a,i){
        var tit = a.titolo_it || a.titolo || '(senza titolo)';
        return '<div style="display:flex;align-items:center;gap:10px;padding:10px;margin-bottom:6px;'+
          'background:rgba(255,255,255,.03);border:1px solid rgba(191,155,74,.08);border-radius:6px;">'+
          '<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:rgba(245,239,226,.7);">'+
            (a.generato_ai?'🤖 ':'✍️ ')+tit+
          '</span>'+
          '<span style="font-size:10px;color:rgba(191,155,74,.4);">'+( a.data||'')+' </span>'+
          '<button onclick="ALAPP.adminDeleteArt(&quot;'+a.id+'&quot;)" style="padding:4px 10px;'+
            'background:rgba(220,50,50,.1);border:1px solid rgba(220,50,50,.3);border-radius:4px;'+
            'color:#f99;font-size:10px;cursor:pointer;flex-shrink:0;">🗑</button>'+
        '</div>';
      }).join('');
    }catch(e){
      el.textContent = 'Errore caricamento: '+e.message;
    }
  },

  adminGenerateArts: async function(){
    var btn = document.querySelector('[onclick*="adminGenerateArts"]');
    var st = document.getElementById('al-gen-status');
    if(btn) btn.disabled = true;
    if(st) st.textContent = '⏳ Generazione in corso... (può richiedere 2-3 minuti)';
    try{
      var secret = prompt('Password admin:');
      if(!secret) return;
      var r = await fetch(SRV+'/api/articles/generate?secret='+encodeURIComponent(secret));
      var d = await r.json();
      if(st) st.textContent = r.ok ? '✓ '+d.count+' articoli generati con successo!' : '✗ Errore: '+d.error;
      if(r.ok) { setTimeout(function(){ ALAPP.adminLoadArts(); }, 1000); }
    }catch(e){
      if(st) st.textContent = '✗ Errore: '+e.message;
    }finally{
      if(btn) btn.disabled = false;
    }
  },

  adminSaveArt: async function(){
    var tit = (document.getElementById('al-admin-tit')||{}).value||'';
    var cat = (document.getElementById('al-admin-cat')||{}).value||'';
    var txt = (document.getElementById('al-admin-txt')||{}).value||'';
    var st  = document.getElementById('al-save-status');
    if(!tit.trim() || !txt.trim()){ if(st) st.textContent='✗ Titolo e testo obbligatori'; return; }
    try{
      var secret = prompt('Password admin:');
      if(!secret) return;
      if(st) st.textContent='⏳ Salvataggio...';
      var today = new Date().toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'});
      var art = {
        id: 'manual_'+Date.now(),
        generato_ai: false,
        titolo_it: tit, titolo_en: tit, titolo_fr: tit,
        categoria_it: cat, categoria_en: cat, categoria_fr: cat,
        testo_it: txt, testo_en: txt, testo_fr: txt,
        autore: 'Sommelier World',
        data: today,
        immagine: smartPhoto(tit, cat),
        isNews: cat.includes('News'),
      };
      var r = await fetch(SRV+'/api/articles/save?secret='+encodeURIComponent(secret), {
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(art)
      });
      var d = await r.json();
      if(r.ok){
        if(st) st.textContent='✓ Articolo pubblicato!';
        document.getElementById('al-admin-tit').value='';
        document.getElementById('al-admin-txt').value='';
        setTimeout(function(){ ALAPP.adminLoadArts(); loadServerArts(); }, 800);
      } else {
        if(st) st.textContent='✗ '+d.error;
      }
    }catch(e){
      if(st) st.textContent='✗ '+e.message;
    }
  },

  adminDeleteArt: async function(id){
    if(!confirm('Eliminare questo articolo?')) return;
    try{
      var secret = prompt('Password admin:');
      if(!secret) return;
      var r = await fetch(SRV+'/api/articles/delete/'+id+'?secret='+encodeURIComponent(secret), {method:'DELETE'});
      var d = await r.json();
      if(r.ok) ALAPP.adminLoadArts(); 
      else alert('Errore: '+d.error);
    }catch(e){ alert(e.message); }
  }
});

function init(){
  cleanup();
  fixSommelier();
  addFAB();
  injectHomeCards();
  injectNews();
  injectSapere();
  hookPage();
  hookLang();
  checkVis();

  /* Render immediato con news hardcoded */
  renderSlides();
  buildTicker();
  render3Art();

  /* Poi prova a caricare dal server (non blocca il render) */
  loadServerArts();

  /* Lingua persistente */
  setTimeout(function(){
    var saved = localStorage.getItem('sw_lang');
    if (saved && saved !== 'it' && window.i18n) window.i18n.setLang(saved);
  }, 600);

  console.log('[AL] ✓ app-finale-v1.js inizializzato — Tabula Rasa v1 + TasteEngine');
  TasteEngine.renderBadge();
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();

})();
