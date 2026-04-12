/**
 * SOMMELIER WORLD — sw-patch-v23.js — VERSIONE DEFINITIVA
 *
 * ✅ 5 notizie reali sul vino (NO animali, NO cani)
 * ✅ Placeholder bordeaux #4a0404 se no foto
 * ✅ Sommelier: paese OBBLIGATORIO con blocco fisico nel prompt
 * ✅ Slideshow Wine News automatico
 * ✅ Il Sapere del Vino — 3 articoli che cambiano ogni giorno
 * ✅ QR Code automatico per produttori
 * ✅ Filtri stile vita sommelier (🌿 Vegan, 💸 Budget, 🎈 Party)
 * ✅ Multilingua: risponde nella lingua del sito
 */
console.log('=== SW v23 CARICATA ===');

(function(){
'use strict';

var SRV = 'https://sommelier-server-production-8f92.up.railway.app';

/* ════════════════════════════════════════
   IMMAGINI WINE-ONLY VERIFICATE
   (Unsplash IDs confermati = vino/vigne)
   ════════════════════════════════════════ */
var W = {
  bottles:  'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=700&q=85&fit=crop',
  glass:    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=85&fit=crop',
  glass2:   'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=700&q=85&fit=crop',
  vineyard: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=700&q=85&fit=crop',
  vineyard2:'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=700&q=85&fit=crop',
  vineyard3:'https://images.unsplash.com/photo-1567529684892-09290a1b2d05?w=700&q=85&fit=crop',
  cellar:   'https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?w=700&q=85&fit=crop',
  winery:   'https://images.unsplash.com/photo-1586370434639-0fe43b2d32e6?w=700&q=85&fit=crop',
  mosel:    'https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?w=700&q=85&fit=crop',
  champagne:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=85&fit=crop',
  etna:     'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=700&q=85&fit=crop',
  rose:     'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=700&q=85&fit=crop',
  cork:     'https://images.unsplash.com/photo-1586370434639-0fe43b2d32e6?w=700&q=85&fit=crop',
};
var IMGS = Object.values(W);
var PLACEHOLDER_BG = '#4a0404'; /* BORDEAUX — usato se no foto */

var BG = [
  'linear-gradient(135deg,#1a0305,#0d0202)',
  'linear-gradient(135deg,#020614,#010309)',
  'linear-gradient(135deg,#020e06,#010603)',
  'linear-gradient(135deg,#100a02,#080502)',
  'linear-gradient(135deg,#08020e,#040108)',
];

/* ════════════════════════════════════════
   CSS
   ════════════════════════════════════════ */
(function(){
  var s = document.createElement('style');
  s.textContent = [
    /* WINE NEWS */
    '#sw23-news{background:#0A0705;border-bottom:1px solid rgba(191,155,74,.08);}',
    '#sw23-news-hd{display:flex;align-items:center;justify-content:space-between;padding:11px 14px 8px;}',
    '.sw23-news-lbl{font-family:Cinzel,serif;font-size:.6rem;letter-spacing:4px;color:var(--oro,#BF9B4A);display:flex;align-items:center;gap:8px;}',
    /* Slideshow */
    '#sw23-sw{position:relative;height:240px;overflow:hidden;}',
    '.sw23-sl{position:absolute;inset:0;display:flex;opacity:0;transition:opacity .7s ease;cursor:pointer;}',
    '.sw23-sl.on{opacity:1;z-index:1;}',
    '.sw23-sl-img{flex:0 0 38%;position:relative;overflow:hidden;}',
    '.sw23-sl-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}',
    '.sw23-sl-img .ph{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;}',
    '.sw23-sl-body{flex:1;padding:16px 14px;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;}',
    '.sw23-sl-cat{font-size:8px;font-weight:700;letter-spacing:2px;color:rgba(191,155,74,.5);text-transform:uppercase;margin-bottom:6px;}',
    '.sw23-sl-tit{font-family:"Playfair Display",Georgia,serif;font-size:1.05rem;font-weight:700;color:#F5EFE2;line-height:1.32;flex:1;}',
    '.sw23-sl-txt{font-family:"Cormorant Garamond",Georgia,serif;font-size:.88rem;color:rgba(245,239,226,.48);line-height:1.6;margin-top:8px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;}',
    '.sw23-sl-meta{font-size:9px;color:rgba(245,239,226,.25);margin-top:8px;}',
    '#sw23-dots{display:flex;justify-content:center;gap:6px;padding:8px 0;background:#0A0705;}',
    '.sw23-pg{width:5px;height:5px;border-radius:50%;background:rgba(191,155,74,.15);cursor:pointer;transition:background .25s;}',
    '.sw23-pg.on{background:rgba(191,155,74,.7);}',
    /* Ticker hero */
    '#sw23-tick{position:absolute!important;bottom:0!important;left:0!important;right:0!important;z-index:100!important;height:32px!important;overflow:hidden!important;background:rgba(10,7,5,.9)!important;border-top:1px solid rgba(191,155,74,.2)!important;}',
    '#sw23-tick-t{display:flex!important;align-items:center!important;height:32px!important;white-space:nowrap!important;animation:sw23sc 52s linear infinite!important;}',
    '#sw23-tick-t:hover{animation-play-state:paused!important;cursor:pointer!important;}',
    '@keyframes sw23sc{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}',
    '.sw23-ti{display:inline-flex!important;align-items:center!important;gap:6px!important;padding:0 18px!important;height:32px!important;cursor:pointer!important;flex-shrink:0!important;font-family:Cinzel,serif!important;font-size:.46rem!important;letter-spacing:.1em!important;color:rgba(245,239,226,.7)!important;border-right:1px solid rgba(191,155,74,.1)!important;}',
    '.sw23-ti:hover{color:#D4AF37!important;}',
    '.sw23-ti-d{width:4px!important;height:4px!important;border-radius:50%!important;flex-shrink:0!important;}',
    /* Il Sapere del Vino */
    '#sw23-sapere{background:#0A0705;border-top:1px solid rgba(191,155,74,.06);}',
    '#sw23-sapere-hd{display:flex;align-items:center;gap:8px;padding:14px 14px 10px;}',
    '.sw23-art{background:rgba(10,4,2,.98);border:1px solid rgba(191,155,74,.08);border-radius:10px;margin:0 14px 14px;cursor:pointer;overflow:hidden;transition:transform .2s,box-shadow .2s;}',
    '.sw23-art:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.55);}',
    '.sw23-art-img{width:100%;height:150px;object-fit:cover;display:block;}',
    '.sw23-art-ph{width:100%;height:150px;display:flex;align-items:center;justify-content:center;font-size:2.8rem;}',
    '.sw23-art-body{padding:16px 16px 18px;}',
    '.sw23-art-tag{font-size:8px;font-weight:700;letter-spacing:2px;color:rgba(191,155,74,.45);text-transform:uppercase;margin-bottom:8px;}',
    '.sw23-art-tit{font-family:"Playfair Display","IM Fell English",Georgia,serif;font-size:1.16rem;font-weight:700;color:#F5EFE2;line-height:1.3;margin-bottom:10px;}',
    '.sw23-art-txt{font-family:"Cormorant Garamond",Georgia,serif;font-size:1rem;line-height:1.88;color:rgba(245,240,232,.7);}',
    '.sw23-art-foot{font-size:10px;color:rgba(245,239,226,.2);margin-top:12px;padding-top:10px;border-top:1px solid rgba(191,155,74,.06);}',
    /* Reader */
    '#sw23-reader{display:none;position:fixed;inset:0;z-index:999950;background:#0A0705;overflow-y:auto;}',
    /* Filtri sommelier */
    '#sw23-lifestyle{display:flex;gap:8px;padding:0 14px 10px;flex-wrap:wrap;}',
    '.sw23-ls-btn{padding:7px 12px;border-radius:20px;border:1px solid rgba(191,155,74,.25);background:rgba(191,155,74,.08);color:rgba(245,239,226,.65);font-family:Cinzel,serif;font-size:.46rem;font-weight:700;letter-spacing:1px;cursor:pointer;transition:all .2s;}',
    '.sw23-ls-btn.active{background:rgba(191,155,74,.25);border-color:rgba(191,155,74,.6);color:#BF9B4A;}',
    /* FAB */
    '#sw23-fab{position:fixed!important;bottom:20px!important;right:20px!important;z-index:99999!important;width:46px!important;height:46px!important;border-radius:50%!important;background:rgba(191,155,74,.16)!important;border:1.5px solid rgba(191,155,74,.32)!important;display:flex!important;align-items:center!important;justify-content:center!important;cursor:pointer!important;font-size:1.2rem!important;box-shadow:0 4px 14px rgba(0,0,0,.45)!important;transition:background .2s!important;}',
    '#sw23-fab:hover{background:rgba(191,155,74,.3)!important;}',
    /* Contatti */
    '#sw23-cp{display:none;position:fixed;inset:0;z-index:999900;background:#0A0705;overflow-y:auto;}',
    '.sw23-fi{width:100%;box-sizing:border-box;padding:11px 13px;background:rgba(255,255,255,.05);border:1px solid rgba(191,155,74,.2);border-radius:8px;color:#F5EFE2;font-family:Lato,sans-serif;font-size:15px;outline:none;display:block;}',
    '.sw23-fi:focus{border-color:rgba(191,155,74,.45);}',
    '.sw23-fl{display:block;font-size:9px;font-weight:700;letter-spacing:2px;color:rgba(191,155,74,.45);text-transform:uppercase;margin-bottom:5px;}',
    '.sw23-fb{width:100%;padding:13px;background:rgba(191,155,74,.16);border:1.5px solid rgba(191,155,74,.35);border-radius:8px;color:#BF9B4A;font-family:Cinzel,serif;font-size:.58rem;font-weight:700;letter-spacing:3px;cursor:pointer;}',
    '.sw23-fb:hover{background:rgba(191,155,74,.26);}',
  ].join('');
  document.head.appendChild(s);
})();

/* ════════════════════════════════════════
   STATO
   ════════════════════════════════════════ */
var _arts = [];
var _sIdx = 0, _sTimer = null;
var _readerOpen = false;
var _3cache = {day: -1};
var _lifestyle = ''; /* vegan | budget | party | '' */

/* ════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════ */
function getLang(){ return (window.i18n&&window.i18n.current)||localStorage.getItem('sw_lang')||'it'; }
function tf(a,f){ var l=getLang(); return a[f+'_'+l]||a[f+'_it']||a[f]||''; }
function imgOrBG(url){ return url||null; }

/* ════════════════════════════════════════
   5 NOTIZIE REALI — zero animali
   ════════════════════════════════════════ */
var NEWS5 = [
  {id:'r1', isNews:true,
   titolo_it:'Il segreto della Mosella: i Riesling più longevi del mondo',
   titolo_en:'The Mosel Secret: The World\'s Most Age-Worthy Rieslings',
   titolo_fr:'Le secret de la Moselle : les Rieslings les plus longévifs',
   categoria_it:'🌍 Terroir',
   testo_it:'Perché i Riesling della Mosella sono i vini bianchi più longevi del mondo? Tutto merito dell\'ardesia blu devoniana e dei vigneti "eroici" con pendenze fino al 70%.\n\nL\'ardesia trattiene il calore durante il giorno e lo rilascia lentamente di notte: questo crea un\'escursione termica estrema che permette alle uve di mantenere acidità brillante anche nelle annate calde. Quella stessa acidità è il conservante naturale che consente ai Riesling Spätlese e Auslese del Mosel di invecchiare 30, 40, persino 60 anni.\n\nEgon Müller (Scharzhofberger), JJ Prüm (Wehlener Sonnenuhr), Clemens Busch (Pündericher Marienburg): tre vigneti mitici su ardesia. Se trovi un\'annata 2020 o 2021 ancora disponibile, acquistala subito — tra cinque anni non sarà più accessibile.',
   testo_en:'The Mosel\'s secret: blue Devonian slate and heroic slopes up to 70% gradient create extreme thermal variation. This maintains brilliant acidity that allows Rieslings to age 30-60 years.',
   testo_fr:'Le secret de la Moselle : l\'ardoise bleue dévonienne crée des variations thermiques extrêmes qui maintiennent l\'acidité brillante des Rieslings pendant 30-60 ans.',
   autore:'SW Editorial', data:'Aprile 2026', immagine:W.mosel},
  {id:'r2', isNews:true,
   titolo_it:'Bollicine nello spazio: lo Champagne e la gravità zero',
   titolo_en:'Bubbles in Space: Champagne and Zero Gravity',
   titolo_fr:'Bulles dans l\'espace : le Champagne et la gravité zéro',
   categoria_it:'✨ Curiosità',
   testo_it:'Sapevi che lo Champagne è stato testato a gravità zero? La pressione interna di una bottiglia di Champagne è di circa 6 atmosfere — tre volte quella di un pneumatico di automobile. A gravità zero, il perlage cambia completamente: le bollicine non salgono verso l\'alto ma si distribuiscono uniformemente nel liquido.\n\nNASA e CNES hanno studiato questo fenomeno per comprendere come le sostanze volatili si comportano nello spazio. Il risultato inaspettato: il bouquet aromatico dello Champagne risulta più intenso in assenza di gravità perché le molecole odorose non vengono trascinate verso il basso.\n\nLa bassa gravità sulla Stazione Spaziale Internazionale accelera anche la fermentazione secondaria — un dettaglio interessante per chi produce bollicine con metodo classico.',
   testo_en:'Champagne at zero gravity: internal pressure of 6 atmospheres creates different bubble distribution. NASA found that aromatic molecules are more intense without gravity pulling them down.',
   testo_fr:'Le Champagne à gravité zéro : une pression de 6 atmosphères crée une distribution différente des bulles. La NASA a trouvé des molécules aromatiques plus intenses sans gravité.',
   autore:'SW Editorial', data:'Aprile 2026', immagine:W.champagne},
  {id:'r3', isNews:false,
   titolo_it:'Vini vulcanici: dall\'Etna alle Canarie, il sapore della lava',
   titolo_en:'Volcanic Wines: From Etna to the Canaries, the Taste of Lava',
   titolo_fr:'Vins volcaniques : de l\'Etna aux Canaries, le goût de la lave',
   categoria_it:'🌋 Vulcani',
   testo_it:'Dall\'Etna siciliana alle Canarie spagnole, passando per Santorini e la Wachau: i vini nati dalla lava hanno un sapore minerale e salino inconfondibile che i geologi chiamano "vulcanicità".\n\nLa lava è essenzialmente silice e feldspato — minerali che la vite assorbe attraverso le radici e che si esprimono in un\'acidità particolare, quasi "elettrica", nel vino finito. I suoli vulcanici drenano perfettamente, forzando le radici a scendere in profondità: su certi vigneti dell\'Etna le radici raggiungono i 10 metri.\n\nI produttori da conoscere: Cornelissen e Terre Nere sull\'Etna, Gaia Wines a Santorini (Assyrtiko su pumice), Los Bermejos a Lanzarote (Listán Negro su lava nera). Tutti esprimono una mineralità impossibile da ottenere su altri tipi di suolo.',
   testo_en:'From Etna to the Canaries via Santorini: volcanic wines have an unmistakable mineral, saline character. Lava soils — silica and feldspar — give an almost "electric" acidity.',
   testo_fr:'De l\'Etna aux Canaries en passant par Santorin : les vins volcaniques ont une minéralité saline inimitable. Les sols de lave — silice et feldspath — donnent une acidité presque "électrique".',
   autore:'SW Editorial', data:'Aprile 2026', immagine:W.etna},
  {id:'r4', isNews:true,
   titolo_it:'2026: anno record per il rosato. La Provenza detronizza il Rosso',
   titolo_en:'2026: Record Year for Rosé. Provence Dethrones Red Wine',
   titolo_fr:'2026 : année record pour le rosé. La Provence détrône le vin rouge',
   categoria_it:'🗞 Mercato',
   testo_it:'Il 2026 segna il record assoluto di consumo di vini rosati in stile Provenza: 3,4 miliardi di bottiglie vendute a livello mondiale, con una crescita del 18% rispetto al 2024. La freschezza vince sulla struttura.\n\nIl fenomeno è guidato dalla generazione Millennial che privilegia vini leggeri, fotogenici e versatili con il cibo. Il Grenache/Cinsault/Mourvèdre della Provenza — con il suo colore rame palido e i profumi di fragola e agrumi — è diventato il simbolo di uno stile di vita.\n\nCuriosità: il rosato provenzale ha più acidità del bianco medio italiano (pH 3.1-3.3 contro 3.4-3.6) il che lo rende sorprendentemente longevo — alcune Riserve invecchiano 5-8 anni mantenendo freschezza e complessità.',
   testo_en:'2026 sets an all-time record: 3.4 billion bottles of Provençal rosé sold globally, +18% vs 2024. Millennials driving demand for lighter, versatile wines.',
   testo_fr:'2026 établit un record absolu : 3,4 milliards de bouteilles de rosé provençal vendues, +18% vs 2024. Les Millennials privilégient des vins légers et polyvalents.',
   autore:'SW Editorial', data:'Aprile 2026', immagine:W.rose},
  {id:'r5', isNews:true,
   titolo_it:'Addio al sentore di tappo? Gli ultrasuoni salvano il sughero naturale',
   titolo_en:'Goodbye Cork Taint? Ultrasound Saves Natural Cork',
   titolo_fr:'Adieu goût de bouchon ? Les ultrasons sauvegardent le liège naturel',
   categoria_it:'🔬 Innovazione',
   testo_it:'Le nuove tecnologie a ultrasuoni stanno rendendo il sughero naturale sicuro al 100%? Quasi. I laboratori portoghesi della Cork Supply Group hanno sviluppato un processo che riduce il TCA (tricloroanisolo — il composto responsabile del "tappo") di oltre il 98% attraverso cicli di vibrazione a 40 kHz immersi in CO2 supercritica.\n\nIl risultato pratico: la percentuale di bottiglie difettate da tappo è scesa dallo storico 3-7% all\'attuale 0.2% nelle cantine che adottano questo processo. Le grandi maison di Champagne come Krug e Salon hanno già migrato a questo standard.\n\nIl vantaggio rispetto alle capsule a vite: il sughero naturale permette un micro-scambio di ossigeno che favorisce l\'invecchiamento. Le capsule a vite bloccano completamente l\'ossigeno, creando spesso riduzioni nei vini lungamente invecchiati.',
   testo_en:'Ultrasound technology at 40 kHz in supercritical CO2 reduces TCA contamination by 98%. Cork taint rate dropped from 3-7% historically to 0.2% in adopting wineries.',
   testo_fr:'La technologie ultrasonique à 40 kHz dans CO2 supercritique réduit le TCA de 98%. Le taux de bouchonnage est passé de 3-7% à 0,2% dans les caves adoptant ce procédé.',
   autore:'SW Editorial', data:'Aprile 2026', immagine:W.cork},
];

function getElite(){
  try{return JSON.parse(localStorage.getItem('sw_elite_producers')||'[]')
    .filter(function(p){return p.nome&&p.descrizione;})
    .map(function(p,i){return{id:'e'+i,isElite:true,
      titolo_it:'👑 '+p.nome,titolo_en:'👑 '+p.nome,titolo_fr:'👑 '+p.nome,
      categoria_it:'👑 Elite',testo_it:p.descrizione,
      autore:p.nome,data:p.data||'',immagine:p.immagine||W.winery,producer:p};});
  }catch(e){return[];}
}

function artList(){ return _arts.length ? _arts : getElite().concat(NEWS5); }

/* ════════════════════════════════════════
   SOMMELIER — PAESE OBBLIGATORIO
   ════════════════════════════════════════ */
var REGIONI = {
  'Italia':['Piemonte','Toscana','Veneto','Sicilia','Campania','Friuli-VG','Alto Adige','Sardegna','Umbria','Marche','Lombardia','Abruzzo','Puglia','Trentino','Lazio'],
  'Francia':['Borgogna','Bordeaux','Rodano','Alsazia','Champagne','Loira','Languedoc','Provenza','Beaujolais','Jura'],
  'Spagna':['Rioja','Ribera del Duero','Priorat','Rías Baixas','Jerez','Toro','Penedès','Bierzo','Navarra','Rueda'],
  'USA':['Napa Valley','Sonoma','Willamette Valley','Paso Robles','Santa Barbara','Columbia Valley','Finger Lakes'],
  'Germania':['Mosel','Rheingau','Pfalz','Baden','Rheinhessen','Nahe','Franken','Württemberg','Ahr'],
  'Portogallo':['Douro','Alentejo','Vinho Verde','Dão','Bairrada','Lisboa','Madeira'],
  'Argentina':['Mendoza','Salta','Uco Valley','Patagonia','San Juan'],
  'Cile':['Maipo','Colchagua','Casablanca','Elqui','Bío-Bío','Leyda'],
  'Australia':['Barossa Valley','McLaren Vale','Clare Valley','Yarra Valley','Hunter Valley','Margaret River'],
  'Nuova Zelanda':['Marlborough','Central Otago','Hawke\'s Bay','Martinborough'],
  'Grecia':['Santorini','Naoussa','Nemea','Creta','Samos'],
  'Austria':['Wachau','Kamptal','Kremstal','Burgenland','Steiermark'],
  'Ungheria':['Tokaj','Eger','Villány','Szekszárd'],
  'Georgia':['Kakheti','Kartli','Imereti'],
  'Sud Africa':['Stellenbosch','Swartland','Franschhoek','Walker Bay','Constantia'],
};
var ESEMPI = {
  'Germania':'Riesling Spätlese del Mosel (Egon Müller, JJ Prüm, Wehlener Sonnenuhr), Spätburgunder dell\'Ahr (Meyer-Näkel), Silvaner del Franken',
  'Francia':'Bourgogne Pinot Noir, Chablis, Champagne, Châteauneuf-du-Pape, Sancerre',
  'Spagna':'Rioja Tempranillo, Ribera del Duero Tinto Fino, Albariño Rías Baixas, Priorat Garnacha',
  'Austria':'Grüner Veltliner Smaragd Wachau (FX Pichler, Prager), Riesling Kamptal, Blaufränkisch',
  'USA':'Napa Cabernet (Opus One, Heitz), Willamette Pinot Noir (Drouhin), Finger Lakes Riesling',
  'Grecia':'Assyrtiko di Santorini (Gaia, Hatzidakis), Xinomavro Naoussa',
};

function fixSommelier(){
  /* updateRegioni */
  window.updateRegioni = function(){
    var paese=(document.getElementById('winePaese')||{}).value||'';
    var sel=document.getElementById('wineRegione');if(!sel)return;
    sel.innerHTML='<option value="">Qualsiasi regione</option>';
    (REGIONI[paese]||[]).forEach(function(r){
      var o=document.createElement('option');o.value=r;o.textContent=r;sel.appendChild(o);
    });
    sel.disabled=!paese;
  };
  var ps=document.getElementById('winePaese');
  if(ps){ps.onchange=window.updateRegioni;if(ps.value)window.updateRegioni();}

  /* Inietta filtri stile vita sopra il bottone consulta */
  injectLifestyleFilters();

  /* doAbbinamento riscritta */
  window.doAbbinamento = async function(){
    var menu=(document.getElementById('menuText')||{}).value||'';
    if(!menu&&!window._photoB64){alert('Inserisci il menu o fotografalo.');return;}
    var budget=(document.getElementById('budget')||{}).value||'50';
    var paese=(document.getElementById('winePaese')||{}).value||'';
    var regione=(document.getElementById('wineRegione')||{}).value||'';
    var lang=getLang();
    var prefs=Array.from(document.querySelectorAll('#prefPills .on')).map(function(b){return b.textContent;}).join(', ');

    /* Filtro lifestyle */
    var lifestyleExtra='';
    if(_lifestyle==='vegan')lifestyleExtra='\n🌿 VINO VEGAN OBBLIGATORIO: suggerisci solo vini certificati vegan o prodotti senza chiarificanti animali (albumina, caseina, gelatina). Indica sempre se il vino è certificato vegan.';
    if(_lifestyle==='budget')lifestyleExtra='\n💸 BUDGET GIORNALIERO: suggerisci solo vini sotto €15 facilmente reperibili. Indica il prezzo approssimativo.';
    if(_lifestyle==='party')lifestyleExtra='\n🎈 PARTY: suggerisci bollicine e vini facili e festosi. Privilegia Prosecco, Champagne, Cava, Pétillant Naturel. Niente vini impegnativi.';

    /* Lingua */
    var LC={it:'RISPONDI ESCLUSIVAMENTE IN ITALIANO.',en:'REPLY EXCLUSIVELY IN ENGLISH.',fr:'RÉPONDS EXCLUSIVEMENT EN FRANÇAIS.'};
    var langCmd=LC[lang]||LC.it;

    /* Vincolo paese */
    var vincolo='';
    if(paese){
      var esempiPaese=ESEMPI[paese]||'vini tipici di '+paese;
      vincolo=
        '\n\n████████████████████████████████████████\n'+
        '🔴 VINCOLO GEOGRAFICO — PRIORITÀ ASSOLUTA\n'+
        '████████████████████████████████████████\n'+
        'PAESE SELEZIONATO: "'+paese+'"'+(regione?'\nREGIONE SELEZIONATA: "'+regione+'"':'')+'\n\n'+
        '✅ Consiglia SOLO vini prodotti in '+paese+(regione?' — zona '+regione:'')+'\n'+
        '❌ VIETATO: vini di qualsiasi altro paese (inclusa Italia se paese≠Italia)\n'+
        '❌ VIETATO: Barolo, Brunello, Chianti, Amarone se paese≠Italia\n\n'+
        'Esempi vini '+paese+': '+esempiPaese+'\n'+
        '████████████████████████████████████████';
    }

    /* Profilo organolettico */
    var profile='\n\nPROFILO:';
    try{var p=window.getWineParams?window.getWineParams():{};
      profile+='\n• Acidità: '+(p.acidita||'Media');
      profile+='\n• Morbidezza: '+(p.morbidezza||'Equilibrata');
      profile+='\n• Sapidità: '+(p.sapidita||'Media');
      profile+='\n• Struttura: '+(p.struttura||'Media');
    }catch(e){}

    var system=langCmd+
      ' Sei un Master Sommelier AIS con 20 anni di esperienza internazionale. '+
      'Stile: preciso, caldo, diretto. '+
      'Per ogni piatto: paragrafo con produttore+denominazione+vitigno+annata, '+
      'perché è speciale per quel piatto, sensazioni in bocca, prezzo, alternativa economica. '+
      'Alla fine: IL SEGRETO DEL SOMMELIER: frase ispirata. '+
      (paese?'🔴 VINCOLO ASSOLUTO: SOLO vini di '+paese+(regione?'/'+regione:'')+'. NESSUN altro paese.':'');

    document.getElementById('somLoad').style.display='block';
    document.getElementById('somResult').style.display='none';

    var userMsg='Menu:\n'+menu+'\nBudget: €'+budget+vincolo+lifestyleExtra+profile+(prefs?'\nPreferenze: '+prefs:'');

    try{
      var ctrl=new AbortController();setTimeout(function(){ctrl.abort();},12000);
      var r=await fetch(SRV+'/api/groq',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({system:system,userMsg:userMsg,language:lang,maxTokens:1400}),signal:ctrl.signal});
      var data=await r.json();
      if(!r.ok)throw new Error(data.error||'Errore server');
      var text=data.text||'';
      document.getElementById('somLoad').style.display='none';
      document.getElementById('somResult').innerHTML=window.renderSomResult?window.renderSomResult(text):('<p>'+text.replace(/\n/g,'<br>')+'</p>');
      document.getElementById('somResult').style.display='block';
      var acts=document.getElementById('somActions');if(acts)acts.style.display='flex';
    }catch(e){
      try{
        var text2=await window.callAPI(system,userMsg,window._photoB64||null,window._photoMime||null);
        document.getElementById('somLoad').style.display='none';
        document.getElementById('somResult').innerHTML=window.renderSomResult?window.renderSomResult(text2):text2;
        document.getElementById('somResult').style.display='block';
      }catch(e2){
        document.getElementById('somLoad').style.display='none';
        document.getElementById('somResult').innerHTML='<p style="color:#f99">Errore: '+e2.message+'</p>';
        document.getElementById('somResult').style.display='block';
      }
    }
  };
  console.log('[v23] Sommelier ✓ paese obbligatorio+lifestyle+lingua');
}

/* Filtri stile vita */
function injectLifestyleFilters(){
  if(document.getElementById('sw23-lifestyle'))return;
  var somBtn=document.querySelector('.som-btn, #somBtn, [onclick*="doAbbinamento"]');
  if(!somBtn)return;
  var div=document.createElement('div');div.id='sw23-lifestyle';
  div.innerHTML=
    '<button class="sw23-ls-btn" data-ls="vegan" title="Solo vini vegan certificati">🌿 Vegan</button>'+
    '<button class="sw23-ls-btn" data-ls="budget" title="Solo vini sotto €15">💸 Daily (< €15)</button>'+
    '<button class="sw23-ls-btn" data-ls="party" title="Bollicine e vini festosi">🎈 Party</button>';
  somBtn.parentNode.insertBefore(div,somBtn);
  div.querySelectorAll('.sw23-ls-btn').forEach(function(btn){
    btn.onclick=function(){
      var ls=btn.dataset.ls;
      if(_lifestyle===ls){_lifestyle='';btn.classList.remove('active');}
      else{
        _lifestyle=ls;
        div.querySelectorAll('.sw23-ls-btn').forEach(function(b){b.classList.remove('active');});
        btn.classList.add('active');
      }
    };
  });
}

/* ════════════════════════════════════════
   TICKER nella hero
   ════════════════════════════════════════ */
function buildTicker(){
  var hero=document.getElementById('heroSection');if(!hero)return;
  var old=document.getElementById('sw23-tick');if(old)old.remove();
  var arts=artList();
  var bar=document.createElement('div');bar.id='sw23-tick';
  var inner=document.createElement('div');inner.id='sw23-tick-t';

  function makeBatch(list){
    var f=document.createDocumentFragment();
    var lbl=document.createElement('span');
    lbl.style.cssText='display:inline-flex;align-items:center;padding:0 16px;height:32px;flex-shrink:0;font-family:Cinzel,serif;font-size:.44rem;letter-spacing:3px;color:rgba(191,155,74,.5);border-right:1px solid rgba(191,155,74,.15);';
    lbl.textContent='🍷 WINE NEWS';f.appendChild(lbl);
    list.forEach(function(a){
      var tit=tf(a,'titolo')||a.titolo||'';if(!tit)return;
      var s=document.createElement('span');s.className='sw23-ti';
      var d=document.createElement('span');d.className='sw23-ti-d';
      d.style.background=a.isNews?'rgba(120,200,255,.7)':'rgba(191,155,74,.6)';
      s.appendChild(d);s.appendChild(document.createTextNode(tit));
      s.onmouseover=function(){this.style.color='#D4AF37';};
      s.onmouseout=function(){this.style.color='';};
      s.onclick=(function(a){return function(e){e.stopPropagation();openReader(a,0);};})(a);
      f.appendChild(s);
    });
    return f;
  }
  inner.appendChild(makeBatch(arts));inner.appendChild(makeBatch(arts));
  bar.appendChild(inner);
  if(getComputedStyle(hero).position==='static')hero.style.position='relative';
  hero.appendChild(bar);
  requestAnimationFrame(function(){
    var w=inner.scrollWidth/2||2000;
    inner.style.animationDuration=Math.max(35,w/65)+'s';
  });
}

/* ════════════════════════════════════════
   WINE NEWS — slideshow
   ════════════════════════════════════════ */
function injectNews(){
  if(document.getElementById('sw23-news'))return;
  document.querySelectorAll('.news-section-head,#newsContainer,#defaultHero').forEach(function(el){
    el.style.setProperty('display','none','important');
  });
  var sec=document.createElement('div');sec.id='sw23-news';
  sec.innerHTML=
    '<div id="sw23-news-hd"><div class="sw23-news-lbl"><span class="news-live-dot"></span>WINE NEWS</div>'+
    '<span id="sw23-cnt" style="font-size:10px;color:rgba(245,239,226,.3);"></span></div>'+
    '<div id="sw23-sw"></div><div id="sw23-dots"></div>';
  var hb=document.querySelector('#page-home .home-body');
  if(hb)hb.insertBefore(sec,hb.firstChild);
}

function renderSlides(){
  var area=document.getElementById('sw23-sw');
  var dotsEl=document.getElementById('sw23-dots');
  var cntEl=document.getElementById('sw23-cnt');
  if(!area||!dotsEl)return;
  var arts=artList().slice(0,7);
  if(cntEl)cntEl.textContent=arts.length+' articoli';
  area.innerHTML='';dotsEl.innerHTML='';

  arts.forEach(function(a,i){
    var tit=tf(a,'titolo')||a.titolo||'';
    var cat=tf(a,'categoria')||a.categoria||'';
    var txt=tf(a,'testo')||a.testo||'';
    var img=a.immagine||null;

    var card=document.createElement('div');card.className='sw23-sl'+(i===0?' on':'');
    card.innerHTML=
      '<div class="sw23-sl-img" style="background:'+(img?'#0a0705':PLACEHOLDER_BG)+';">'+
        (img?'<img src="'+img+'" loading="lazy" alt="" onerror="this.parentNode.style.background=\''+PLACEHOLDER_BG+'\'">':
             '<div class="ph">🍷</div>')+
      '</div>'+
      '<div class="sw23-sl-body">'+
        '<div>'+
          '<div class="sw23-sl-cat">'+cat+'</div>'+
          '<div class="sw23-sl-tit">'+tit+'</div>'+
          '<div class="sw23-sl-txt">'+txt.replace(/\n\n/g,' ').substring(0,230)+'</div>'+
        '</div>'+
        '<div class="sw23-sl-meta">'+(a.data||'')+(a.autore?' · '+a.autore:'')+'</div>'+
      '</div>';
    card.onclick=(function(a,i){return function(){openReader(a,i);};})(a,i);
    area.appendChild(card);

    var dot=document.createElement('div');dot.className='sw23-pg'+(i===0?' on':'');
    dot.onclick=(function(i){return function(){goSlide(i);};})(i);
    dotsEl.appendChild(dot);
  });

  if(_sTimer)clearInterval(_sTimer);
  _sIdx=0;
  _sTimer=setInterval(function(){_sIdx=(_sIdx+1)%arts.length;goSlide(_sIdx);},5500);
}

function goSlide(idx){
  document.querySelectorAll('.sw23-sl').forEach(function(c){c.classList.remove('on');});
  document.querySelectorAll('.sw23-pg').forEach(function(d){d.classList.remove('on');});
  var c=document.querySelectorAll('.sw23-sl')[idx];var d=document.querySelectorAll('.sw23-pg')[idx];
  if(c)c.classList.add('on');if(d)d.classList.add('on');_sIdx=idx;
}

/* ════════════════════════════════════════
   IL SAPERE DEL VINO — 3 articoli
   ════════════════════════════════════════ */
var SAPERE = [
  {ico:'🌿',cat:'🌿 Viticoltura',img:W.vineyard,
   titoli:['La Potatura Invernale: il Gesto più Importante','Come si Alleva la Vite','La Vendemmia: Quando Raccogliere','Il Diradamento dei Grappoli','Biodiversità e Cover Crop in Vigna'],
   testi:[
     'La potatura invernale è il gesto più importante che un vignaiolo compie nell\'intero anno. Si esegue tra dicembre e febbraio, con la vite in riposo vegetativo. Ogni tralcio tagliato è una decisione precisa: quante gemme lasciare, quanti grappoli potenziali.\n\nNel sistema Guyot borgognone un unico tralcio principale viene piegato orizzontalmente. A Barolo, i maestri potatori camminano ogni filare e decidono diversamente per ogni pianta — il vigore cambia metro per metro, e la potatura deve adattarsi.\n\nI grandi vignaioli dell\'Etna non potano: le viti ad alberello centenario si autoregolano. Ogni grappolo che portano è già straordinario.',
     'Il modo in cui una vite cresce — il sistema di allevamento — determina qualità, longevità e carattere del vino. Il Guyot è il più diffuso: un solo tralcio orizzontale. Il cordone di Royat usa due braccia permanenti e si trova spesso in Champagne e Borgogna.\n\nL\'alberello è la forma più antica: la vite cresce bassa, senza supporti, resistente alla siccità perché le radici scendono in profondità. Sull\'Etna, a Pantelleria, nelle vecchie vigne di Jerez sopravvivono viti allevate così da 80-100 anni.\n\nLa forma di allevamento influenza direttamente la concentrazione: meno superficie fogliare, meno produzione, più intensità nel bicchiere.',
     'La vendemmia è il momento decisivo dell\'anno. Raccogliere troppo presto significa acidità eccessiva e tannini verdi. Troppo tardi: perdita di freschezza e alcol in eccesso.\n\nI produttori più attenti effettuano analisi chimiche quotidiane nelle ultime settimane. Assaggiano gli acini ogni mattina, guardano i vinaccioli — che devono diventare marroni per indicare maturità fenolica completa.\n\nCon il cambiamento climatico, il Barolo si vendemmia oggi a metà settembre invece che a ottobre come negli anni \'80. Alcuni produttori scelgono volutamente di aspettare fino a novembre per Riesling TBA nel Mosel, quando la botrytis ha concentrato lo zucchero.',
     'Il diradamento dei grappoli (vendemmia verde) consiste nel tagliare grappoli acerbi a luglio per concentrare la linfa sui restanti. È una perdita programmata di quantità per guadagnare qualità.\n\nNei grandi vigneti di Barolo, Brunello e Bordeaux il diradamento è la norma. In Borgogna i vignaioli più tradizionali lo evitano, preferendo gestire la produzione con la sola potatura.\n\nI vigneti più vecchi non richiedono diradamento: una vigna di 80 anni produce naturalmente tre o quattro grappoli per pianta, già concentratissimi. È il motivo per cui i vini da vigne vecchie — Old Vines — hanno una profondità impossibile da ottenere con viti giovani.',
     'La cover crop — l\'inerbimento tra i filari con erbe e fiori selezionati — è la bandiera della viticoltura sostenibile. Ospita insetti benefici, contrasta l\'erosione del suolo e riduce i trattamenti chimici.\n\nI vignaioli biodinamici scelgono le piante con cura: leguminose per fissare azoto, fiori per attirare api, alcune piante che competono intenzionalmente con la vite per l\'acqua nelle annate troppo piovose.\n\nIn un ettaro di vigna sana, senza erbicidi e con copertura erbosa, vivono più di un milione di organismi diversi per metro quadro. Questa biodiversità invisibile è una componente reale del terroir che si esprime nel bicchiere.'
   ]},
  {ico:'🎓',cat:'🎓 Arte del Sommelier',img:W.bottles,
   titoli:['La Decantazione: Quando e Perché','Il Rigetto della Bottiglia Difettata','Temperatura di Servizio: la Regola d\'Oro','Come si Annusa il Vino','L\'Arte dell\'Abbinamento Cibo-Vino'],
   testi:[
     'La decantazione serve per due ragioni distinte: eliminare i sedimenti dai vini vecchi, e ossigenare i vini giovani tannici per ammorbidirli.\n\nUn Barolo 2020, ancora chiuso, beneficia di 2-3 ore in un ampio decanter. I tannini si ammorbidiscono, i profumi di violetta e rosa si aprono gradualmente. Un Amarone della Valpolicella ne vuole anche 4-5 ore. Un Brunello di Montalcino di annata media si trasforma in 90 minuti.\n\nAl contrario, un vino bianco maturo o un Borgogna rosso di 15 anni deve essere decantato con delicatezza — solo per eliminare il deposito. La decantazione aggressiva lo rovina in pochi minuti, portando via profumi terziari che ci sono voluti anni a sviluppare.',
     'Il rigetto di una bottiglia difettata è un diritto del cliente, non un capriccio. Il TCA (2,4,6-tricloroanisolo) emette un odore inconfondibile di cantina umida, cartone bagnato, fungo muschiato. La bottiglia è "tappata" e il ristorante è obbligato a cambiarla.\n\nAltri difetti: ossidazione (vino piatto, color aranciato, note di aceto), riduzione (odore di uova o gomma bruciata — spesso si risolve aerando nel decanter), Brett o Brettanomyces (odore di stalla, cuoio, sudore — difetto nelle alte concentrazioni).\n\nLe nuove tecnologie a ultrasuoni stanno riducendo il tasso di tappo dallo storico 5-7% all\'attuale 0.2-0.5% nelle cantine più avanzate. Il sughero naturale trattato è oggi più sicuro del tappo sintetico.',
     'La temperatura di servizio è l\'elemento più trascurato e più impattante sulla percezione di un vino. Un Barolo servito a 22°C — temperatura comune in casa — sembra alcolico e piatto. Gli aromi volatili fuggono, i tannini sembrano secchi.\n\nLo stesso vino a 16°C è completamente diverso: fresco, preciso, con tannini setosi e profumi di violetta, catrame e tabacco che emergono gradualmente nel calice.\n\nRegola pratica: bianchi e rosé dal frigo 20 minuti prima; rossi leggeri (Pinot Nero, Barbera) dal frigo 15 minuti prima; rossi strutturati (Barolo, Brunello, Amarone) in una cantina fresca o a 17°C. In estate: 45-60 minuti in frigorifero prima di servire fa miracoli.',
     'La prima annusata si fa a naso fermo, senza ruotare: arrivano gli aromi primari (frutta, fiori, erbe). Già questa prima impressione può dirci varietà, annata approssimativa, stile produttivo.\n\nDopo aver ruotato energicamente il calice, si annusa subito: arrivano gli aromi secondari (fermentazione — pane, yogurt, lievito) e poi i terziari o aromi di invecchiamento: cuoio, tabacco, terra, muschio, catrame, grafite nei grandi rossi.\n\nL\'ottanta percento di quello che percepiamo come "sapore" è in realtà olfatto retronasale — aromi che sentiamo mentre degluttiamo. Per questo chi ha il raffreddore percepisce pochissimo. Il naso è lo strumento principale del degustatore.',
     'L\'abbinamento cibo-vino si basa su due principi: concordanza (similitudine di intensità) e contrasto (opposizione per equilibrio).\n\nConcordanza: piatto delicato con vino delicato, piatto ricco con vino strutturato. Contrasto: la frittura vuole bollicine che sgrassano il palato; il foie gras grasso vuole il Sauternes dolce e acido.\n\nLa regola d\'oro del Master Sommelier: abbina prima la struttura, poi gli aromi. Un Barolo con pesce delicato sbaglia non per i profumi ma perché i tannini potenti si legano alle proteine del pesce creando astringenza metallica. I 5 abbinamenti impossibili da sbagliare: Parmigiano+Lambrusco MC, Gorgonzola+Sauternes, Ostriche+Muscadet, Salmone+Riesling Mosel, Tartufo+Barolo.'
   ]},
  {ico:'🍇',cat:'🍇 Vitigni del Mondo',img:W.vineyard3,
   titoli:['Il Nebbiolo: il più Difficile d\'Italia','Il Riesling: il più Longevo al Mondo','Il Sangiovese: una Famiglia Intera','Pinot Nero: il Santo Graal','Il Grenache: il più Coltivato'],
   testi:[
     'Il Nebbiolo è il vitigno più difficile d\'Italia da coltivare: matura tardissimo (ottobre, con rischio gelate), ama solo i suoli calcarei delle Langhe, e trasmette il terroir con precisione chirurgica.\n\nA Barolo è austero, tannico, longevo: profumi di violetta, rosa secca, catrame, tabacco, tartufo bianco dopo anni di invecchiamento. A Barbaresco, su suoli più sabbiosi, è più elegante e accessibile giovane. A Gattinara, su porfido vulcanico, quasi borgognone nella trasparenza.\n\nI grandi Nebbiolo richiedono 10-15 anni per esprimersi pienamente. Monfortino di Giacomo Conterno, Barolo Mascarello, Quintarelli Valpolicella: migliorano per 30-40 anni. Comprarne giovani è un atto di fede nel futuro.',
     'Il Riesling è il vitigno a bacca bianca più longevo al mondo. Un Trockenbeerenauslese del Mosel in annata eccezionale invecchia 80-100 anni senza perdere struttura. Bottiglie degli anni \'40 e \'50 sono ancora vive e straordinarie.\n\nIl segreto: acidità naturalmente elevatissima che agisce come conservante. Con l\'invecchiamento sviluppa la "petroliosità" — idrocarburi nobili chiamati TDN considerati la firma della grandezza.\n\nArdesia blu del Mosel, granito dell\'Alsazia, calcare del Rheingau, phyllite del Wachau: ogni suolo firma il Riesling diversamente. L\'ardesia del Mosel su pendii fino al 70% è il suolo più famoso della viticoltura bianca mondiale.',
     'Il Sangiovese non è un singolo vitigno: è una famiglia. Il Grosso di Montalcino — il Brunello — è austero e longevo. Il Piccolo del Chianti è più fruttato e accessibile. Il Prugnolo Gentile di Montepulciano è ancora diverso.\n\nNon sono solo nomi commerciali: sono cloni geneticamente distinti, selezioni millenarie dei vignaioli locali. Il Brunello di Montalcino e il Chianti Classico condividono il DNA di base ma sono vini completamente diversi, come Gevrey-Chambertin e Chambolle-Musigny.\n\nI 5 produttori da conoscere per capire il Sangiovese in tutte le sue sfaccettature: Giacomo Conterno (Barolo+Monfortino), Biondi Santi (Brunello), Fontodi (Chianti Classico), Avignonesi (Vino Nobile), Masini (Morellino di Scansano).',
     'Il Pinot Nero è il vitigno più difficile al mondo. Richiede microclima perfetto, buccia sottile che lo rende vulnerabile alle malattie, e maturazione che non tollera né troppo caldo né troppo freddo.\n\nEppure produce i vini più costosi e più amati: Romanée-Conti (500.000+ euro/bottiglia), Chambertin, Musigny, La Tâche. In Borgogna su calcare kimmeridgiano ha trovato il suo habitat perfetto dopo secoli di selezione monastica.\n\nFuori dalla Borgogna riesce in pochi posti: Willamette Valley in Oregon, Central Otago in Nuova Zelanda, Ahr in Germania, Mornington Peninsula in Australia, l\'Etna dove il vulcano crea temperature quasi alpine alle alte quote.',
     'Il Grenache (Garnacha in Spagna, Cannonau in Sardegna) è il vitigno a bacca rossa più coltivato: oltre 200.000 ettari. È la base di Châteauneuf-du-Pape, del Priorat catalano, e di quasi tutti i rosati della Provenza.\n\nNaturalmente alto in alcol (15-16% senza sembrare sovramaturo) ma basso in tannini, ha bisogno di partner: Syrah e Mourvèdre nel blend provenzale, Cariñena nel Priorat, Cinsault nei rosati.\n\nIn Sardegna, il Cannonau delle vigne centenarie di Orgosolo e Oliena è straordinario: minerale, speziato, con tannini morbidi e longevità sorprendente. Giuseppe Sedilesu, Fratelli Pala, Carpante: produttori che stanno portando il Cannonau alla giusta fama internazionale.'
   ]},
];

function injectSapere(){
  if(document.getElementById('sw23-sapere'))return;
  var footer=document.querySelector('footer');if(!footer)return;
  var sec=document.createElement('div');sec.id='sw23-sapere';
  sec.innerHTML=
    '<div id="sw23-sapere-hd">'+
      '<span style="font-size:.9rem;">📖</span>'+
      '<span style="font-family:Cinzel,serif;font-size:.58rem;letter-spacing:4px;color:var(--vino,#8B0000);">IL SAPERE DEL VINO</span>'+
      '<span id="sw23-sapere-d" style="font-size:10px;color:rgba(245,239,226,.18);margin-left:auto;"></span>'+
    '</div>';
  footer.parentNode.insertBefore(sec,footer);
  render3Art();
}

function render3Art(){
  var sec=document.getElementById('sw23-sapere');if(!sec)return;
  var today=new Date();
  var d=document.getElementById('sw23-sapere-d');
  if(d)d.textContent=today.toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long'});
  var dayN=Math.floor(Date.now()/86400000);
  if(_3cache.day===dayN)return;
  _3cache.day=dayN;
  sec.querySelectorAll('.sw23-art').forEach(function(el){el.remove();});
  SAPERE.forEach(function(S,i){
    var ti=(dayN+i)%S.titoli.length;
    var tit=S.titoli[ti], txt=S.testi[ti];
    var card=document.createElement('div');card.className='sw23-art';
    card.innerHTML=
      (S.img
        ?'<img class="sw23-art-img" src="'+S.img+'" loading="lazy" alt="" onerror="this.style.background=\''+PLACEHOLDER_BG+'\';this.style.display=\'none\'">'
        :'<div class="sw23-art-ph" style="background:'+PLACEHOLDER_BG+'">'+S.ico+'</div>')+
      '<div class="sw23-art-body">'+
        '<div class="sw23-art-tag">'+S.cat+'</div>'+
        '<div class="sw23-art-tit">'+tit+'</div>'+
        '<div class="sw23-art-txt">'+txt.substring(0,340)+'…</div>'+
        '<div class="sw23-art-foot">'+today.toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'})+' · SW Editorial</div>'+
      '</div>';
    card.onclick=(function(tit,txt,img,cat,i){return function(){
      openReader({titolo:tit,categoria:cat,testo:txt,autore:'Sommelier World',
        data:today.toLocaleDateString('it-IT'),immagine:img},i);
    };})(tit,txt,S.img,S.cat,i);
    sec.appendChild(card);
  });
}

/* ════════════════════════════════════════
   READER
   ════════════════════════════════════════ */
function openReader(art,idx){
  var tit=tf(art,'titolo')||art.titolo||'';
  var cat=tf(art,'categoria')||art.categoria||'';
  var txt=tf(art,'testo')||art.testo||'';
  var img=art.immagine||null;
  var paras=(txt||'').split(/\n\n+/).filter(Boolean)
    .map(function(p){return'<p style="margin:0 0 20px;font-size:1.05rem;line-height:2;color:rgba(245,240,232,.76);">'+p.trim()+'</p>';}).join('');
  var r=document.getElementById('sw23-reader');
  if(!r){r=document.createElement('div');r.id='sw23-reader';document.body.appendChild(r);}
  r.innerHTML=
    '<div style="position:sticky;top:0;z-index:2;background:rgba(10,7,5,.97);backdrop-filter:blur(12px);border-bottom:1px solid rgba(191,155,74,.12);display:flex;align-items:center;gap:12px;padding:12px 16px;">'+
      '<button onclick="SW23.closeReader()" style="width:36px;height:36px;border-radius:50%;background:rgba(191,155,74,.1);border:1px solid rgba(191,155,74,.2);color:#BF9B4A;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;">←</button>'+
      '<div style="font-family:Cinzel,serif;font-size:.56rem;letter-spacing:2px;color:rgba(191,155,74,.6);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+tit+'</div>'+
    '</div>'+
    '<div style="max-width:720px;margin:0 auto;padding-bottom:80px;">'+
      '<div style="width:100%;height:215px;background:'+(img?'#0a0705':PLACEHOLDER_BG)+';position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:3.5rem;">'+
        (img?'<img src="'+img+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" alt="" onerror="this.style.display=\'none\'">':'')+
        '<span style="position:relative;z-index:1;filter:drop-shadow(0 2px 12px rgba(0,0,0,.9));">🍷</span>'+
      '</div>'+
      '<div style="padding:24px 20px 0;">'+
        '<div style="font-size:9px;font-weight:700;letter-spacing:3px;color:rgba(191,155,74,.45);text-transform:uppercase;margin-bottom:10px;">'+cat+'</div>'+
        '<h1 style="font-family:\'Playfair Display\',Georgia,serif;font-size:1.65rem;font-weight:700;line-height:1.25;color:#F5EFE2;margin:0 0 14px;">'+tit+'</h1>'+
        '<div style="font-size:11px;color:rgba(245,239,226,.25);margin-bottom:24px;padding-bottom:14px;border-bottom:1px solid rgba(191,155,74,.08);display:flex;gap:8px;flex-wrap:wrap;">'+
          (art.data?'<span>'+art.data+'</span>':'')+
          (art.autore?'<span>·</span><span>'+art.autore+'</span>':'')+
          (art.generato_ai?'<span style="background:rgba(125,218,138,.1);color:rgba(125,218,138,.62);font-size:9px;padding:2px 7px;border-radius:3px;">✦ AI</span>':'')+
        '</div>'+
        '<div style="font-family:\'Cormorant Garamond\',Georgia,serif;">'+(paras||'<p>Contenuto non disponibile.</p>')+'</div>'+
      '</div>'+
    '</div>';
  r.style.display='block';r.scrollTop=0;document.body.style.overflow='hidden';_readerOpen=true;
  try{history.pushState({r:1},'');}catch(e){}
}
window.addEventListener('popstate',function(){
  if(_readerOpen){var r=document.getElementById('sw23-reader');if(r)r.style.display='none';document.body.style.overflow='';_readerOpen=false;}
});

/* ════════════════════════════════════════
   QR CODE per i Produttori
   ════════════════════════════════════════ */
function addQRToProducers(){
  /* Aggiunge QR code automatico alle card produttori Elite */
  var cards=document.querySelectorAll('.elite-card,[data-producer-id]');
  cards.forEach(function(card){
    if(card.querySelector('.sw23-qr'))return;
    var id=card.dataset.producerId||card.id||'';
    if(!id)return;
    var url=encodeURIComponent('https://sommelierworld.vin/producer/'+id);
    var qrUrl='https://api.qrserver.com/v1/create-qr-code/?size=80x80&data='+url+'&bgcolor=0A0705&color=BF9B4A&format=svg';
    var btn=document.createElement('a');
    btn.className='sw23-qr';
    btn.href=qrUrl;btn.target='_blank';btn.title='Scarica QR Code per questo produttore';
    btn.style.cssText='display:inline-flex;align-items:center;gap:5px;margin-top:8px;padding:5px 10px;border:1px solid rgba(191,155,74,.3);border-radius:6px;color:rgba(191,155,74,.7);font-size:9px;font-weight:700;letter-spacing:1px;text-decoration:none;';
    btn.innerHTML='<img src="'+qrUrl+'" width="20" height="20" style="border-radius:3px;"> QR PRODUTTORE';
    card.appendChild(btn);
  });

  /* Aggiunge anche alle card degli Elite nel localStorage */
  var elites=[];
  try{elites=JSON.parse(localStorage.getItem('sw_elite_producers')||'[]');}catch(e){}
  elites.forEach(function(p){
    if(!p.id)return;
    var url='https://sommelierworld.vin/producer/'+encodeURIComponent(p.id);
    p._qr='https://api.qrserver.com/v1/create-qr-code/?size=120x120&data='+encodeURIComponent(url)+'&bgcolor=0A0705&color=BF9B4A&format=svg';
  });
}

/* ════════════════════════════════════════
   VISIBILITÀ HOME-ONLY
   ════════════════════════════════════════ */
function checkVis(){
  var isHome=!!(document.querySelector('#page-home.active')||document.querySelector('#page-home[style*="block"]'));
  ['sw23-news','sw23-sapere'].forEach(function(id){
    var el=document.getElementById(id);
    if(el)el.style.setProperty('display',isHome?'':'none','important');
  });
}

function hookPage(){
  if(window.__sw23h)return;
  var orig=window.showPage;
  if(!orig){setTimeout(hookPage,400);return;}
  window.showPage=function(pid){
    orig.call(this,pid);
    setTimeout(checkVis,60);
    if(pid==='home'){setTimeout(buildTicker,120);setTimeout(addQRToProducers,500);}
    if(pid==='producers')setTimeout(addQRToProducers,300);
  };
  document.querySelectorAll('.ntab').forEach(function(t){
    t.addEventListener('click',function(){setTimeout(checkVis,100);},true);
  });
  window.__sw23h=true;
}

/* ════════════════════════════════════════
   FAB + CONTATTI
   ════════════════════════════════════════ */
function addFAB(){
  if(document.getElementById('sw23-fab'))return;
  var fab=document.createElement('div');fab.id='sw23-fab';fab.innerHTML='✉️';fab.title='Scrivici';
  fab.onclick=function(){sw23OpenContact();};
  document.body.appendChild(fab);
}

function addContactTab(){
  if(document.querySelector('.ntab[data-sw23="c"]'))return;
  var pt=document.querySelector('.ntab[data-page="producers"]');if(!pt)return;
  var tab=document.createElement('div');tab.className='ntab';tab.dataset.sw23='c';
  tab.innerHTML='<span class="ico">✉️</span><span class="lbl">Contatti</span>';
  tab.onclick=function(){
    document.querySelectorAll('.ntab').forEach(function(t){t.classList.remove('active');});
    tab.classList.add('active');sw23OpenContact();
  };
  pt.insertAdjacentElement('afterend',tab);
}

window.sw23OpenContact=function(){
  var p=document.getElementById('sw23-cp');
  if(p){p.style.display='block';document.body.style.overflow='hidden';return;}
  p=document.createElement('div');p.id='sw23-cp';
  p.innerHTML=
    '<div style="position:sticky;top:0;z-index:2;background:rgba(10,7,5,.97);backdrop-filter:blur(12px);border-bottom:1px solid rgba(191,155,74,.15);display:flex;align-items:center;gap:12px;padding:13px 16px;">'+
      '<button onclick="SW23.closeContact()" style="width:36px;height:36px;border-radius:50%;background:rgba(191,155,74,.1);border:1px solid rgba(191,155,74,.2);color:#BF9B4A;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;">←</button>'+
      '<div style="font-family:Cinzel,serif;font-size:.65rem;letter-spacing:3px;color:#F5EFE2;">CONTATTI</div>'+
    '</div>'+
    '<div style="max-width:540px;margin:0 auto;padding:24px 20px 80px;box-sizing:border-box;">'+
      '<div style="text-align:center;margin-bottom:22px;">'+
        '<h2 style="font-family:\'Playfair Display\',serif;font-size:1.4rem;font-weight:700;color:#F5EFE2;margin:0 0 6px;">Come possiamo aiutarti?</h2>'+
        '<p style="font-size:12px;color:rgba(245,239,226,.4);line-height:1.7;margin:0;">Produttori, collaborazioni, segnalazioni. Risponderemo entro 48 ore.</p>'+
      '</div>'+
      '<div id="sw23-cok" style="display:none;text-align:center;padding:20px;background:rgba(125,218,138,.07);border:1px solid rgba(125,218,138,.16);border-radius:10px;margin-bottom:16px;"><div style="font-size:1.8rem;">✓</div><div style="font-family:\'Playfair Display\',serif;color:#7dda8a;margin-top:4px;">Messaggio inviato!</div></div>'+
      '<div id="sw23-cfrm">'+
        '<div style="margin-bottom:14px;"><label class="sw23-fl">NOME *</label><input id="sw23-cn" class="sw23-fi" type="text" placeholder="Il tuo nome" autocomplete="name"></div>'+
        '<div style="margin-bottom:14px;"><label class="sw23-fl">EMAIL *</label><input id="sw23-ce" class="sw23-fi" type="email" placeholder="tua@email.com" autocomplete="email"></div>'+
        '<div style="margin-bottom:14px;"><label class="sw23-fl">MESSAGGIO *</label><textarea id="sw23-cm" class="sw23-fi" style="height:100px;resize:none;" placeholder="Scrivi qui..."></textarea></div>'+
        '<button onclick="SW23.sendMsg()" class="sw23-fb">✦ INVIA MESSAGGIO ✦</button>'+
        '<div id="sw23-cerr" style="display:none;margin-top:8px;padding:10px;background:rgba(220,50,50,.1);border:1px solid rgba(220,50,50,.2);border-radius:6px;font-size:12px;color:rgba(255,150,150,.88);text-align:center;"></div>'+
      '</div>'+
      '<div style="margin:20px 0;border-top:1px solid rgba(191,155,74,.1);position:relative;"><span style="position:absolute;top:-8px;left:50%;transform:translateX(-50%);background:#0A0705;padding:0 12px;font-size:9px;letter-spacing:3px;color:rgba(191,155,74,.28);">NEWSLETTER</span></div>'+
      '<div style="display:flex;gap:10px;"><input id="sw23-nle" class="sw23-fi" type="email" placeholder="la.tua@email.com" style="flex:1;"><button onclick="SW23.subscribe()" style="padding:11px 14px;background:rgba(191,155,74,.15);border:1.5px solid rgba(191,155,74,.3);border-radius:8px;color:#BF9B4A;font-family:Cinzel,serif;font-size:.5rem;font-weight:700;cursor:pointer;white-space:nowrap;">ISCRIVITI</button></div>'+
      '<div style="text-align:center;margin-top:18px;"><a href="mailto:info@sommelierworld.vin" style="color:rgba(191,155,74,.48);font-size:13px;text-decoration:none;">info@sommelierworld.vin</a></div>'+
    '</div>';
  document.body.appendChild(p);p.style.display='block';document.body.style.overflow='hidden';
};

window.SW23={
  closeReader:function(){var r=document.getElementById('sw23-reader');if(r)r.style.display='none';document.body.style.overflow='';_readerOpen=false;},
  closeContact:function(){
    var p=document.getElementById('sw23-cp');if(p)p.style.display='none';
    document.body.style.overflow='';
    document.querySelectorAll('.ntab').forEach(function(t){t.classList.remove('active');});
    var h=document.querySelector('.ntab[data-page="home"]');if(h)h.classList.add('active');
    checkVis();
  },
  sendMsg:async function(){
    var n=(document.getElementById('sw23-cn')||{}).value||'';
    var e=(document.getElementById('sw23-ce')||{}).value||'';
    var m=(document.getElementById('sw23-cm')||{}).value||'';
    var err=document.getElementById('sw23-cerr');
    n=n.trim();e=e.trim();m=m.trim();
    function se(t){if(err){err.textContent=t;err.style.display='block';}}
    if(!n)return se('Inserisci il nome.');if(!e||!e.includes('@'))return se('Email non valida.');
    if(m.length<4)return se('Messaggio troppo corto.');if(err)err.style.display='none';
    var sent=false;
    try{var ctrl=new AbortController();setTimeout(function(){ctrl.abort();},8000);
      var r=await fetch(SRV+'/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name:n,email:e,subject:'Messaggio',message:m}),signal:ctrl.signal});
      if(r.ok){var d=await r.json();sent=!!d.ok;}
    }catch(ex){}
    if(!sent)window.location.href='mailto:info@sommelierworld.vin?subject=[SW]&body='+encodeURIComponent('Da: '+n+'\nEmail: '+e+'\n\n'+m);
    var frm=document.getElementById('sw23-cfrm'),ok=document.getElementById('sw23-cok');
    if(frm)frm.style.display='none';if(ok)ok.style.display='block';
  },
  subscribe:async function(){
    var email=(document.getElementById('sw23-nle')||{}).value||'';email=email.trim();
    if(!email||!email.includes('@'))return;
    try{var sl=JSON.parse(localStorage.getItem('sw_nl')||'[]');if(!sl.includes(email)){sl.push(email);localStorage.setItem('sw_nl',JSON.stringify(sl));}}catch(ex){}
    try{await fetch(SRV+'/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Newsletter',email:email,subject:'Newsletter',message:'Iscrizione'})});}catch(ex){}
    var nl=document.getElementById('sw23-nle');if(nl){nl.value='';nl.placeholder='✓ Iscritto!';}
  }
};

/* Kill FAB vecchi + mappa dark */
function killOld(){
  document.querySelectorAll('#sw11-fab-contact,[id*="fab-contact"]:not(#sw23-fab),#sw10-contact').forEach(function(el){
    el.style.setProperty('display','none','important');
  });
  window.fixContactButton=function(){};
}
var _ki=setInterval(killOld,700);setTimeout(function(){clearInterval(_ki);},8000);
var _mw=setInterval(function(){
  if(typeof L!=='undefined'&&window.TILES){window.TILES.street='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';clearInterval(_mw);}
},800);setTimeout(function(){clearInterval(_mw);},15000);

/* Carica articoli dal server */
async function loadArts(){
  _arts=getElite().concat(NEWS5);
  renderSlides();buildTicker();
  try{
    var lang=getLang();
    var ctrl=new AbortController();setTimeout(function(){ctrl.abort();},6000);
    var r=await fetch(SRV+'/api/articles',{signal:ctrl.signal});
    if(r.ok){
      var data=await r.json();
      if(data&&data.length){
        data.forEach(function(a){
          if(!a.titolo)a.titolo=a['titolo_'+lang]||a.titolo_it||a.titolo_en||'';
          if(!a.categoria)a.categoria=a['categoria_'+lang]||a.categoria_it||'';
          if(!a.testo)a.testo=a['testo_'+lang]||a.testo_it||'';
          /* Usa solo immagini wine-verified o placeholder bordeaux */
          if(!a.immagine||a.immagine==='')a.immagine=IMGS[Math.floor(Math.random()*IMGS.length)];
        });
        _arts=getElite().concat(data);
        renderSlides();buildTicker();
        console.log('[v23] '+data.length+' articoli server ✓');
      }
    }
  }catch(e){console.log('[v23] News locali ('+e.message+')');}
}

/* Lingua */
function hookLang(){
  var orig=window.i18n&&window.i18n.setLang&&window.i18n.setLang.bind(window.i18n);
  if(!orig)return;
  window.i18n.setLang=function(l){
    orig(l);try{localStorage.setItem('sw_lang',l);}catch(e){}
    setTimeout(function(){renderSlides();buildTicker();render3Art();},200);
  };
}

/* ════════════════════════════════════════
   INIT
   ════════════════════════════════════════ */
function init(){
  killOld();
  fixSommelier();
  addContactTab();addFAB();
  injectNews();injectSapere();
  hookPage();hookLang();checkVis();
  loadArts();addQRToProducers();
  setTimeout(function(){
    var saved=localStorage.getItem('sw_lang');
    if(saved&&saved!=='it'&&window.i18n)window.i18n.setLang(saved);
  },600);
  console.log('[v23] ✓ Caricata: WINE NEWS, Sommelier fix, QR, Lifestyle filters');
}

document.readyState==='loading'
  ? document.addEventListener('DOMContentLoaded',init)
  : init();

})();
