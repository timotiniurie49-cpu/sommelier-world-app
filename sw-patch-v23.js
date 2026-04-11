/**
 * SOMMELIER WORLD — sw-patch-v23.js — REFACTORING TOTALE
 * 1. Rimozione "Gazzetta del Terroir" → "WINE NEWS"
 * 2. Sommelier: paese OBBLIGATORIO (Germania → vini tedeschi)
 * 3. Sommelier: risponde nella lingua del sito
 * 4. Slideshow automatico notizie con foto
 * 5. 3 articoli culturali (Il Sapere del Vino) con buona tipografia
 * 6. Curiosità in carosello separato, home only
 * 7. FAB email, contatti overlay, lingua persistente
 */
console.log('=== SW PATCH V23 ATTIVA ===');

(function(){
'use strict';

var SRV = 'https://sommelier-server-production-8f92.up.railway.app';

/* ══════════════════ CSS ══════════════════ */
(function(){
  var s = document.createElement('style');
  s.textContent = [
    /* Nasconde label "LA GAZZETTA DEL TERROIR" nell'hero */
    '#heroSection > div:last-child > div:first-child { display:none!important; }',

    /* Ticker nella hero */
    '#sw23-tick{position:absolute!important;bottom:0!important;left:0!important;right:0!important;',
      'z-index:100!important;height:34px!important;overflow:hidden!important;',
      'background:rgba(10,7,5,.9)!important;border-top:1px solid rgba(191,155,74,.25)!important;}',
    '#sw23-tick-t{display:flex!important;align-items:center!important;height:34px!important;',
      'white-space:nowrap!important;animation:sw23sc 52s linear infinite!important;}',
    '#sw23-tick-t:hover{animation-play-state:paused!important;}',
    '@keyframes sw23sc{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}',
    '.sw23-ti{display:inline-flex!important;align-items:center!important;gap:6px!important;',
      'padding:0 18px!important;height:34px!important;cursor:pointer!important;flex-shrink:0!important;',
      'font-family:Cinzel,serif!important;font-size:.47rem!important;letter-spacing:.12em!important;',
      'color:rgba(245,239,226,.72)!important;border-right:1px solid rgba(191,155,74,.1)!important;}',
    '.sw23-ti:hover{color:#D4AF37!important;}',
    '.sw23-dot{width:4px!important;height:4px!important;border-radius:50%!important;',
      'background:rgba(191,155,74,.65)!important;flex-shrink:0!important;}',
    '.sw23-dot-n{background:rgba(120,200,255,.8)!important;}',
    '.sw23-tick-lbl{display:inline-flex!important;align-items:center!important;',
      'padding:0 16px!important;height:34px!important;flex-shrink:0!important;',
      'font-family:Cinzel,serif!important;font-size:.44rem!important;letter-spacing:3px!important;',
      'color:rgba(191,155,74,.5)!important;border-right:1px solid rgba(191,155,74,.18)!important;}',

    /* WINE NEWS — slideshow */
    '#sw23-news{background:#0A0705!important;border-bottom:1px solid rgba(191,155,74,.1)!important;}',
    '#sw23-news-hd{display:flex!important;align-items:center!important;justify-content:space-between!important;',
      'padding:11px 14px 8px!important;}',
    '#sw23-news-label{font-family:Cinzel,serif!important;font-size:.6rem!important;',
      'letter-spacing:4px!important;color:var(--oro,#BF9B4A)!important;display:flex!important;',
      'align-items:center!important;gap:8px!important;}',
    '#sw23-slide-wrap{position:relative!important;height:230px!important;overflow:hidden!important;}',
    '.sw23-slide{position:absolute!important;inset:0!important;display:flex!important;',
      'opacity:0!important;transition:opacity .65s ease!important;cursor:pointer!important;}',
    '.sw23-slide.on{opacity:1!important;z-index:1!important;}',
    '.sw23-slide-img{width:38%!important;flex-shrink:0!important;object-fit:cover!important;',
      'display:block!important;}',
    '.sw23-slide-img-ph{width:38%!important;flex-shrink:0!important;display:flex!important;',
      'align-items:center!important;justify-content:center!important;font-size:2.8rem!important;}',
    '.sw23-slide-body{flex:1!important;padding:16px 14px!important;',
      'display:flex!important;flex-direction:column!important;justify-content:space-between!important;',
      'overflow:hidden!important;}',
    '.sw23-slide-cat{font-size:8px!important;font-weight:700!important;letter-spacing:2px!important;',
      'color:rgba(191,155,74,.55)!important;text-transform:uppercase!important;margin-bottom:7px!important;}',
    '.sw23-slide-tit{font-family:"Playfair Display",Georgia,serif!important;font-size:1.08rem!important;',
      'font-weight:700!important;color:#F5EFE2!important;line-height:1.35!important;flex:1!important;}',
    '.sw23-slide-txt{font-family:"Cormorant Garamond",Georgia,serif!important;font-size:.88rem!important;',
      'color:rgba(245,239,226,.5)!important;line-height:1.65!important;margin-top:8px!important;',
      'display:-webkit-box!important;-webkit-line-clamp:3!important;',
      '-webkit-box-orient:vertical!important;overflow:hidden!important;}',
    '.sw23-slide-meta{font-size:9px!important;color:rgba(245,239,226,.28)!important;',
      'margin-top:8px!important;display:flex!important;align-items:center!important;gap:6px!important;}',
    '.sw23-slide-ai{background:rgba(125,218,138,.12)!important;color:rgba(125,218,138,.65)!important;',
      'font-size:7px!important;padding:2px 5px!important;border-radius:3px!important;}',
    '#sw23-dots{display:flex!important;justify-content:center!important;gap:5px!important;',
      'padding:8px 0!important;background:#0A0705!important;}',
    '.sw23-pg{width:5px!important;height:5px!important;border-radius:50%!important;',
      'background:rgba(191,155,74,.18)!important;cursor:pointer!important;transition:background .2s!important;}',
    '.sw23-pg.on{background:rgba(191,155,74,.7)!important;}',

    /* IL SAPERE DEL VINO — 3 articoli fissi con buona tipografia */
    '#sw23-sapere{background:#0A0705!important;border-top:1px solid rgba(191,155,74,.08)!important;}',
    '#sw23-sapere-hd{padding:14px 14px 10px!important;display:flex!important;align-items:center!important;gap:8px!important;}',
    '.sw23-ac{background:rgba(12,5,2,.95)!important;border:1px solid rgba(191,155,74,.1)!important;',
      'border-radius:10px!important;overflow:hidden!important;margin:0 14px 14px!important;',
      'cursor:pointer!important;transition:transform .2s,box-shadow .2s!important;}',
    '.sw23-ac:hover{transform:translateY(-2px)!important;box-shadow:0 8px 24px rgba(0,0,0,.55)!important;}',
    '.sw23-ac-img{width:100%!important;height:150px!important;object-fit:cover!important;display:block!important;}',
    '.sw23-ac-img-ph{width:100%!important;height:150px!important;display:flex!important;',
      'align-items:center!important;justify-content:center!important;font-size:2.5rem!important;}',
    '.sw23-ac-body{padding:16px 16px 18px!important;}',
    '.sw23-ac-tag{font-size:8px!important;font-weight:700!important;letter-spacing:2px!important;',
      'color:rgba(191,155,74,.5)!important;text-transform:uppercase!important;margin-bottom:8px!important;}',
    /* TITOLO ARTICOLO — più grande e leggibile */
    '.sw23-ac-tit{font-family:"Playfair Display","IM Fell English",Georgia,serif!important;',
      'font-size:1.15rem!important;font-weight:700!important;',
      'color:#F5F0E8!important;line-height:1.35!important;margin-bottom:10px!important;}',
    /* TESTO ARTICOLO — font grande, alta leggibilità */
    '.sw23-ac-txt{font-family:"Cormorant Garamond",Georgia,serif!important;',
      'font-size:1rem!important;line-height:1.85!important;',
      'color:rgba(245,240,232,.75)!important;letter-spacing:.01em!important;}',
    '.sw23-ac-meta{font-size:10px!important;color:rgba(245,239,226,.25)!important;',
      'margin-top:12px!important;padding-top:10px!important;',
      'border-top:1px solid rgba(191,155,74,.08)!important;}',

    /* Curiosità — solo home */
    '#sw23-cur{background:#0A0705!important;border-top:1px solid rgba(191,155,74,.06)!important;}',
    '#sw23-cur-s{display:flex!important;gap:10px!important;overflow-x:auto!important;',
      'padding:0 14px 14px!important;scroll-snap-type:x mandatory!important;',
      '-webkit-overflow-scrolling:touch!important;scrollbar-width:none!important;}',
    '#sw23-cur-s::-webkit-scrollbar{display:none!important}',
    '.sw23-cc{flex:0 0 200px!important;min-width:200px!important;scroll-snap-align:start!important;',
      'border-radius:8px!important;overflow:hidden!important;cursor:pointer!important;',
      'border:1px solid rgba(191,155,74,.1)!important;transition:transform .2s!important;}',
    '.sw23-cc:hover{transform:translateY(-2px)!important;}',
    '.sw23-cc-b{padding:12px!important;}',

    /* Reader full screen */
    '#sw23-reader{display:none;position:fixed;inset:0;z-index:999950;background:#0A0705;overflow-y:auto;}',

    /* Contatti overlay */
    '#sw23-cp{display:none;position:fixed;inset:0;z-index:999900;background:#0A0705;overflow-y:auto;}',
    '.sw23-inp{width:100%;box-sizing:border-box;padding:11px 13px;background:rgba(255,255,255,.05);',
      'border:1px solid rgba(191,155,74,.2);border-radius:8px;color:#F5EFE2;',
      'font-family:Lato,sans-serif;font-size:15px;outline:none;display:block;}',
    '.sw23-inp:focus{border-color:rgba(191,155,74,.45);}',
    '.sw23-lbl{display:block;font-size:9px;font-weight:700;letter-spacing:2px;',
      'color:rgba(191,155,74,.5);text-transform:uppercase;margin-bottom:5px;}',
    '.sw23-btn{width:100%;padding:13px;background:rgba(191,155,74,.16);',
      'border:1.5px solid rgba(191,155,74,.38);border-radius:8px;color:#BF9B4A;',
      'font-family:Cinzel,serif;font-size:.58rem;font-weight:700;letter-spacing:3px;cursor:pointer;}',
    '.sw23-btn:hover{background:rgba(191,155,74,.26);}',

    /* FAB */
    '#sw23-fab{position:fixed!important;bottom:20px!important;right:20px!important;z-index:99999!important;',
      'width:46px!important;height:46px!important;border-radius:50%!important;',
      'background:rgba(191,155,74,.16)!important;border:1.5px solid rgba(191,155,74,.32)!important;',
      'display:flex!important;align-items:center!important;justify-content:center!important;',
      'cursor:pointer!important;font-size:1.2rem!important;',
      'box-shadow:0 4px 14px rgba(0,0,0,.4)!important;transition:background .2s!important;}',
    '#sw23-fab:hover{background:rgba(191,155,74,.3)!important;}',
  ].join('');
  document.head.appendChild(s);
})();

/* ══════════════════ DATI ══════════════════ */
var BG = [
  'linear-gradient(135deg,rgba(74,14,14,.95),rgba(30,4,4,.8))',
  'linear-gradient(135deg,rgba(4,40,74,.95),rgba(2,18,50,.8))',
  'linear-gradient(135deg,rgba(4,60,40,.95),rgba(2,32,22,.8))',
  'linear-gradient(135deg,rgba(60,40,4,.95),rgba(32,20,2,.8))',
  'linear-gradient(135deg,rgba(40,4,74,.95),rgba(20,2,45,.8))',
];

var IMGS = [
  'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80',
  'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=600&q=80',
  'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80',
  'https://images.unsplash.com/photo-1586370434639-0fe43b2d32e6?w=600&q=80',
  'https://images.unsplash.com/photo-1567529684892-09290a1b2d05?w=600&q=80',
  'https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?w=600&q=80',
];

var LOCAL_ARTS = [
  {id:'n1',isNews:true,categoria_it:'🗞 Notizie',categoria_en:'🗞 Wine News',categoria_fr:'🗞 Actualités',
   titolo_it:'Barolo 2019: prezzi in rialzo, annata storica',titolo_en:'Barolo 2019: Prices Rising, Historic Vintage',titolo_fr:'Barolo 2019 : hausse des prix, millésime historique',
   testo_it:'Il mercato internazionale del Barolo 2019 si sta scaldando. Valutazioni Vinous superiori a 95 punti per Giacomo Conterno, Bartolo Mascarello e Giovanni Rosso. Il prezzo en primeur è già salito del 25% rispetto al 2016.\n\nGli esperti di mercato di Wine-Searcher segnalano che le allocazioni più piccole sono esaurite in meno di 48 ore dall\'uscita. La finestra d\'acquisto è ancora aperta ma non per molto: tra due anni il 2019 sarà già inaccessibile come il 2016.',
   testo_en:'The international Barolo 2019 market is heating up. Vinous ratings above 95 points for Giacomo Conterno, Bartolo Mascarello and Giovanni Rosso. En primeur prices already up 25% versus 2016.',
   testo_fr:'Le marché international du Barolo 2019 s\'emballe. Évaluations Vinous supérieures à 95 points pour Giacomo Conterno, Bartolo Mascarello et Giovanni Rosso.',
   autore:'SW News',data:'Aprile 2026',immagine:IMGS[0]},
  {id:'n2',isNews:true,categoria_it:'🌍 Terroir',categoria_en:'🌍 Terroir',categoria_fr:'🌍 Terroir',
   titolo_it:'Riesling del Mosel: perché vale ogni euro',titolo_en:'Mosel Riesling: Why It\'s Worth Every Euro',titolo_fr:'Riesling de Moselle : pourquoi chaque euro compte',
   testo_it:'L\'ardesia blu devoniana del Mosel è il suolo più straordinario al mondo per il Riesling. Trattiene il calore di giorno e lo rilascia la notte, garantendo maturazione lenta e acidità intatta anche nelle annate calde.\n\nEgon Müller, JJ Prüm, Clemens Busch: tre nomi che valgono un viaggio in Renania. Le etichette Spätlese e Auslese 2020-2021 sono ancora accessibili. Tra cinque anni non sarà così.',
   testo_en:'The Devonian blue slate of Mosel is the world\'s most extraordinary soil for Riesling. Egon Müller, JJ Prüm, Clemens Busch: three names worth a trip to the Rhine.',
   testo_fr:'L\'ardoise bleue dévonienne de Moselle est le sol le plus extraordinaire au monde pour le Riesling.',
   autore:'SW Editorial',data:'Aprile 2026',immagine:IMGS[5]},
  {id:'n3',isNews:false,categoria_it:'🌋 Terroir',categoria_en:'🌋 Terroir',categoria_fr:'🌋 Terroir',
   titolo_it:'Etna: il vulcano che ha riscritto le regole',titolo_en:'Etna: The Volcano That Rewrote the Rules',titolo_fr:'Etna : le volcan qui a réécrit les règles',
   testo_it:'Le 133 contrade dell\'Etna identificano vigneti centenari ad alberello tra 400 e 1000 metri su sabbie laviche. Il Nerello Mascalese produce rossi trasparenti, quasi borgognoni, con una mineralità vulcanica inimitabile.\n\nCornelius Cornelissen, Terre Nere, Benanti, Passopisciaro: quattro nomi da seguire. La contrada Calderara Sottana, Feudo di Mezzo e Rampante esprimono caratteri completamente diversi — come i cru di Borgogna.',
   testo_en:'Etna\'s 133 contrade identify century-old vines between 400 and 1000 metres on lava soils.',
   testo_fr:'Les 133 contrade de l\'Etna identifient des vignes centenaires sur sols laviques entre 400 et 1000 mètres.',
   autore:'SW Editorial',data:'Aprile 2026',immagine:IMGS[2]},
  {id:'n4',isNews:false,categoria_it:'✨ Produttori',categoria_en:'✨ Producers',categoria_fr:'✨ Producteurs',
   titolo_it:'Champagne: come scegliere la bottiglia giusta',titolo_en:'Champagne: How to Choose the Right Bottle',titolo_fr:'Champagne : comment choisir la bonne bouteille',
   testo_it:'Tra 300 maison la chiave è sapere tre cose: tipologia (NV, Vintage, Prestige Cuvée), dosaggio (Brut Nature = 0g/l residuo zuccherino), categoria produttore (RM = solo uve proprie).\n\nI Récoltant-Manipulant da conoscere: Jacques Selosse (ossidativo, divisivo, geniale), Chartogne-Taillet, Bereche, Laherté-Frères, Dehours. Qualità comparabile alle grandi maison a prezzi 30-40% inferiori.',
   testo_en:'Among 300 houses the key is knowing three things: type, dosage, and producer category (RM = grower only).',
   testo_fr:'Parmi 300 maisons, la clé est de connaître trois choses : type, dosage et catégorie du producteur.',
   autore:'SW Editorial',data:'Marzo 2026',immagine:IMGS[3]},
  {id:'n5',isNews:false,categoria_it:'📚 Sommelier',categoria_en:'📚 Sommelier',categoria_fr:'📚 Sommelier',
   titolo_it:'I 10 abbinamenti cibo-vino che funzionano sempre',titolo_en:'The 10 Food-Wine Pairings That Always Work',titolo_fr:'Les 10 accords mets-vins qui fonctionnent toujours',
   testo_it:'La regola fondamentale è concordanza di intensità: un piatto delicato vuole un vino leggero, uno potente richiede struttura. L\'eccezione virtuosa è il contrasto: un piatto grasso vuole acidità o bollicine che "sgrassano".\n\nI 10 da memorizzare: Parmigiano 36 mesi + Lambrusco Metodo Classico, Gorgonzola + Sauternes 2015, Stilton + Porto Vintage, Pecorino Romano + Vermentino sardo, Brie + Champagne Blanc de Blancs, Ostriche + Muscadet Sur Lie, Salmone affumicato + Riesling Spätlese, Tartufo nero + Barolo 2015, Foie gras + Gewurztraminer Vendange Tardive, Cioccolato 80% + Banyuls Vintage.',
   testo_en:'The fundamental rule is intensity concordance: a delicate dish wants a light wine, a powerful one requires structure.',
   testo_fr:'La règle fondamentale est la concordance d\'intensité : un plat délicat veut un vin léger.',
   autore:'SW Editorial',data:'Febbraio 2026',immagine:IMGS[4]},
];

var CUR = [
  {ico:'🌱',t:'Viticoltura',h:'Il Ciclo della Vite',b:'La vite percorre 4 stagioni: germogliamento (marzo), fioritura (giugno), invaiatura (agosto), vendemmia (settembre-ottobre). Un giorno di pioggia fuori tempo può cambiare tutto.',img:IMGS[2]},
  {ico:'🔪',t:'Sommelier',h:'Come Aprire una Bottiglia',b:'Il sommelier taglia la capsula sotto il secondo anello, inserisce la vite al centro del sughero, ruota 6 volte e solleva con movimento fluido. Il sughero deve uscire in silenzio.',img:IMGS[0]},
  {ico:'🥂',t:'Bicchieri',h:'Perché il Calice ha lo Stelo',b:'Lo stelo evita che il calore della mano scaldi il vino. I grandi Borgogna si versano per un quarto del calice per lasciare spazio agli aromi.',img:IMGS[3]},
  {ico:'🌡️',t:'Servizio',h:'La Temperatura di Servizio',b:'Spumanti 6-8°C, bianchi leggeri 8-10°C, rosé 10-12°C, rossi leggeri 14-16°C, rossi strutturati 16-18°C. Mai oltre 18°C: l\'alcol copre tutto.',img:''},
  {ico:'🪨',t:'Terroir',h:'Il Calcare e la Mineralità',b:'Il calcare è il suolo del vino di qualità: drena bene, forza le radici in profondità, dona mineralità e freschezza. Borgogna, Champagne, Barolo, Chablis sono tutti su suoli calcarei.',img:IMGS[1]},
  {ico:'⚗️',t:'Enologia',h:'La Fermentazione Malolattica',b:'Trasforma l\'acido malico (aspro) in lattico (morbido). Nei rossi è quasi sempre completata; nei bianchi il produttore sceglie: completarla dà morbidezza, bloccarla conserva freschezza.',img:''},
  {ico:'🏺',t:'Storia',h:'8000 Anni di Vino',b:'I primi segni di vinificazione risalgono al 6000 a.C. in Georgia. Le anfore kvevri interrate conservano l\'uva fermentando — da qui nascono i vini arancioni moderni.',img:''},
  {ico:'💧',t:'Degustazione',h:'Le Lacrime del Vino',b:'Le lacrime sul calice non indicano qualità ma alcol. Più sono marcate, più il vino è alcolico. Si formano per il diverso tasso di evaporazione tra alcol e acqua.',img:''},
  {ico:'🎭',t:'Storia',h:'Napoleone e il Chambertin',b:'Napoleone portava il Chambertin in ogni battaglia. Durante la campagna di Russia del 1812, senza il suo vino, attribuì parte della sconfitta alla sua mancanza.',img:''},
  {ico:'🪵',t:'Enologia',h:'Rovere Francese vs Americano',b:'Rovere francese: grana fine, vaniglia e spezie eleganti. Rovere americano: grana larga, cocco e vaniglia intensa. I Rioja storici usano americano; i Barolo moderni il francese.',img:''},
  {ico:'🏔️',t:'Viticoltura',h:'Altitudine e Acidità',b:'In quota le temperature notturne scendono. L\'escursione termica aumenta complessità e mantiene acidità. I vini di montagna hanno una freschezza impossibile in pianura.',img:IMGS[6]},
  {ico:'🦟',t:'Storia',h:'La Fillossera che Cambiò Tutto',b:'Tra 1863 e 1900 la fillossera distrusse il 90% dei vigneti europei. La soluzione: innestare le viti su radici americane resistenti. Quasi tutte le viti del mondo sono ancora così.',img:''},
];

/* ══════════════════ STATO ══════════════════ */
var _arts = [];
var _slideIdx = 0;
var _slideTimer = null;
var _readerOpen = false;
var _3artCache = { day: -1, data: [] };
var REGIONI = {
  'Italia':['Piemonte','Toscana','Veneto','Sicilia','Campania','Friuli-Venezia Giulia','Alto Adige','Sardegna','Umbria','Marche','Lombardia','Abruzzo','Puglia','Trentino','Lazio','Calabria','Emilia-Romagna','Liguria'],
  'Francia':['Borgogna','Bordeaux','Rodano','Alsazia','Champagne','Loira','Languedoc','Provenza','Beaujolais','Jura','Savoia'],
  'Spagna':['Rioja','Ribera del Duero','Priorat','Rías Baixas','Jerez','Toro','Penedès','Bierzo','Jumilla','Navarra','Cava','Rueda'],
  'USA':['Napa Valley','Sonoma','Willamette Valley','Paso Robles','Santa Barbara','Columbia Valley','Finger Lakes'],
  'Germania':['Mosel','Rheingau','Pfalz','Baden','Rheinhessen','Nahe','Franken','Württemberg','Ahr'],
  'Portogallo':['Douro','Alentejo','Vinho Verde','Dão','Bairrada','Lisboa','Madeira'],
  'Argentina':['Mendoza','Salta','Patagonia','La Rioja','San Juan','Uco Valley'],
  'Cile':['Maipo','Colchagua','Casablanca','Elqui','Bío-Bío','Leyda'],
  'Australia':['Barossa Valley','McLaren Vale','Clare Valley','Yarra Valley','Hunter Valley','Margaret River'],
  'Nuova Zelanda':['Marlborough','Central Otago','Hawke\'s Bay','Martinborough'],
  'Grecia':['Santorini','Naoussa','Nemea','Creta','Samos'],
  'Austria':['Wachau','Kamptal','Kremstal','Burgenland','Steiermark'],
  'Ungheria':['Tokaj','Eger','Villány','Szekszárd'],
  'Georgia':['Kakheti','Kartli','Imereti'],
  'Sud Africa':['Stellenbosch','Swartland','Franschhoek','Walker Bay','Constantia'],
};

function getLang(){
  return (window.i18n&&window.i18n.current)||localStorage.getItem('sw_lang')||'it';
}
function tf(a,f){
  var l=getLang();
  return a[f+'_'+l]||a[f+'_it']||a[f]||'';
}
function getElite(){
  try{return JSON.parse(localStorage.getItem('sw_elite_producers')||'[]')
    .filter(function(p){return p.nome&&p.descrizione;})
    .map(function(p,i){return{id:'e'+i,isElite:true,
      titolo_it:'👑 '+p.nome,titolo_en:'👑 '+p.nome,titolo_fr:'👑 '+p.nome,
      categoria_it:'👑 Elite',testo_it:p.descrizione,
      autore:p.nome,data:p.data||'',immagine:p.immagine||IMGS[i%IMGS.length],producer:p};});
  }catch(e){return[];}
}

/* ══════════════════════════════════════════
   FIX 1: SOMMELIER — paese OBBLIGATORIO
   La vecchia doAbbinamento viene sostituita con una versione
   che costruisce un prompt con vincolo paese molto più forte
   e passa la lingua corretta al server.
   ══════════════════════════════════════════ */
function fixSommelier(){
  /* updateRegioni con tutti i 15 paesi */
  window.updateRegioni = function(){
    var paese = (document.getElementById('winePaese')||{}).value||'';
    var sel = document.getElementById('wineRegione');
    if(!sel) return;
    sel.innerHTML = '<option value="">Qualsiasi regione</option>';
    (REGIONI[paese]||[]).forEach(function(r){
      var o=document.createElement('option');o.value=r;o.textContent=r;sel.appendChild(o);
    });
    sel.disabled = !paese;
  };
  var ps = document.getElementById('winePaese');
  if(ps){ ps.onchange=window.updateRegioni; if(ps.value) window.updateRegioni(); }

  /* Sovrascrive doAbbinamento */
  window.doAbbinamento = async function(){
    var menu = (document.getElementById('menuText')||{}).value||'';
    if(!menu && !window._photoB64){ alert('Inserisci il menu o fotografalo.'); return; }

    var budget = (document.getElementById('budget')||{}).value||'50';
    var paese  = (document.getElementById('winePaese')||{}).value||'';
    var regione= (document.getElementById('wineRegione')||{}).value||'';
    var prefs  = Array.from(document.querySelectorAll('#prefPills .on')).map(function(b){return b.textContent;}).join(', ');
    var lang   = getLang();

    /* LINGUA → istruzione per il server */
    var langNames = {it:'italiano',en:'inglese',fr:'francese'};
    var langName   = langNames[lang]||'italiano';
    var langCmd    = lang==='it'?'Rispondi SOLO in italiano.':(lang==='en'?'Reply ONLY in English.':'Réponds UNIQUEMENT en français.');

    /* VINCOLO PAESE ASSOLUTO */
    var paeseVincolo = '';
    if(paese){
      var esempioVini = {
        'Germania':'Riesling Spätlese del Mosel, Spätburgunder dell\'Ahr, Silvaner del Franken',
        'Francia':'Bourgogne Pinot Noir, Bordeaux, Champagne, Rhône Syrah, Loire Chenin Blanc',
        'Spagna':'Rioja Tempranillo, Ribera del Duero, Albariño Rías Baixas, Priorat Garnacha',
        'USA':'Napa Cabernet, Willamette Pinot Noir, Finger Lakes Riesling',
        'Portogallo':'Douro Touriga Nacional, Vinho Verde Alvarinho, Alentejo',
        'Austria':'Grüner Veltliner Wachau, Riesling Kamptal, Blaufränkisch',
        'Grecia':'Assyrtiko di Santorini, Xinomavro Naoussa, Agiorgitiko Nemea',
      };
      var esempio = esempioVini[paese]||'vini tipici di '+paese;

      paeseVincolo = '\n\n'+'='.repeat(60)+
        '\n🔴 VINCOLO GEOGRAFICO ASSOLUTO — NON IGNORARE\n'+
        '='.repeat(60)+
        '\nL\'utente ha selezionato: PAESE = "'+paese+'"'+(regione?' REGIONE = "'+regione+'"':'')+
        '\n\n✅ Devi consigliare ESCLUSIVAMENTE vini prodotti in "'+paese+'"'+
        (regione?' nella zona "'+regione+'"':'')+
        '\n❌ È CATEGORICAMENTE VIETATO consigliare vini di altri paesi (inclusa l\'Italia).'+
        '\n\nAnche se il piatto è classicamente abbinato a vini italiani, DEVI trovare'+
        ' il miglior vino di '+paese+' per quel piatto.'+
        '\n\nEsempi di vini di '+paese+' che puoi usare: '+esempio+
        '\n'+'='.repeat(60);
    }

    /* Parametri organolettici */
    var profileStr = '\n\nPROFILO RICHIESTO DALL\'UTENTE:';
    try{
      var params = window.getWineParams ? window.getWineParams() : {};
      profileStr += '\n• Acidità: '+(params.acidita||'Media');
      profileStr += '\n• Morbidezza: '+(params.morbidezza||'Equilibrata');
      profileStr += '\n• Sapidità: '+(params.sapidita||'Media');
      profileStr += '\n• Struttura: '+(params.struttura||'Media');
    }catch(e){}

    /* System prompt corretto con lingua */
    var SOM_SYSTEM = langCmd+
      ' Sei un Master Sommelier AIS con 20 anni di esperienza internazionale.'+
      ' Il tuo stile: preciso, caldo, diretto come un esperto vero che parla a cena.'+
      ' Per ogni piatto scrivi un paragrafo naturale: vino consigliato (produttore, denominazione, vitigno, annata),'+
      ' perché è speciale per quel piatto, sensazioni in bocca, fascia prezzo e alternativa economica.'+
      ' Alla fine scrivi IL SEGRETO DEL SOMMELIER: una frase ispirata.'+
      (paese ? '\n🔴 VINCOLO ASSOLUTO: consiglia SOLO vini di '+paese+(regione?' — zona '+regione:'')+'. NESSUN vino di altri paesi è accettabile.' : '');

    document.getElementById('somLoad').style.display='block';
    document.getElementById('somResult').style.display='none';

    try{
      var userMsg = 'Menu:\n'+menu+'\nBudget: €'+budget+paeseVincolo+profileStr+(prefs?'\nPreferenze: '+prefs:'');

      /* Chiama il server passando anche la lingua */
      var r = await fetch(SRV+'/api/groq',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({system:SOM_SYSTEM, userMsg:userMsg, language:lang, maxTokens:1200})
      });
      var data = await r.json();
      if(!r.ok) throw new Error(data.error||'Errore server');
      var text = data.text||'';

      document.getElementById('somLoad').style.display='none';
      document.getElementById('somResult').innerHTML = window.renderSomResult ? window.renderSomResult(text) : '<p>'+text.replace(/\n/g,'<br>')+'</p>';
      document.getElementById('somResult').style.display='block';
    }catch(e){
      /* Fallback locale con callAPI */
      try{
        var text2 = await window.callAPI(SOM_SYSTEM, 'Menu:\n'+menu+'\nBudget: €'+budget+paeseVincolo+profileStr, window._photoB64||null, window._photoMime||null);
        document.getElementById('somLoad').style.display='none';
        document.getElementById('somResult').innerHTML = window.renderSomResult ? window.renderSomResult(text2) : text2;
        document.getElementById('somResult').style.display='block';
      }catch(e2){
        document.getElementById('somLoad').style.display='none';
        document.getElementById('somResult').innerHTML='<p style="color:#f99">Errore. Verifica la connessione.</p>';
        document.getElementById('somResult').style.display='block';
      }
    }
  };
  console.log('[v23] Sommelier fixato ✓ — paese OBBLIGATORIO, multilingua');
}

/* ══════════════════ TICKER hero ══════════════════ */
function buildTicker(){
  var hero = document.getElementById('heroSection');
  if(!hero) return;
  var old = document.getElementById('sw23-tick');
  if(old) old.remove();

  var arts = _arts.length ? _arts : LOCAL_ARTS;
  var bar = document.createElement('div'); bar.id='sw23-tick';
  var inner = document.createElement('div'); inner.id='sw23-tick-t';

  function makeBatch(list){
    var f=document.createDocumentFragment();
    var lbl=document.createElement('span'); lbl.className='sw23-tick-lbl';
    lbl.innerHTML='🍷 WINE NEWS'; f.appendChild(lbl);
    list.forEach(function(a){
      var tit=tf(a,'titolo')||a.titolo||''; if(!tit)return;
      var s=document.createElement('span'); s.className='sw23-ti'+(a.isNews?' sw23-ti-n':'');
      var d=document.createElement('span'); d.className='sw23-dot'+(a.isNews?' sw23-dot-n':'');
      s.appendChild(d); s.appendChild(document.createTextNode(tit));
      s.onclick=(function(art){return function(e){e.stopPropagation();openReader(art,0);};})(a);
      f.appendChild(s);
    });
    return f;
  }
  inner.appendChild(makeBatch(arts)); inner.appendChild(makeBatch(arts));
  bar.appendChild(inner);
  if(getComputedStyle(hero).position==='static') hero.style.position='relative';
  hero.appendChild(bar);
  requestAnimationFrame(function(){
    var w=inner.scrollWidth/2||2000;
    inner.style.animationDuration=Math.max(35,w/65)+'s';
  });
}

/* ══════════════════ WINE NEWS — slideshow ══════════════════ */
function injectNewsSection(){
  if(document.getElementById('sw23-news')) return;

  /* Nasconde vecchia sezione */
  document.querySelectorAll('.news-section-head,#newsContainer,#defaultHero').forEach(function(el){
    el.style.setProperty('display','none','important');
  });

  var sec=document.createElement('div'); sec.id='sw23-news';
  sec.innerHTML=
    '<div id="sw23-news-hd">'+
      '<div id="sw23-news-label"><span class="news-live-dot"></span>WINE NEWS</div>'+
      '<span id="sw23-news-cnt" style="font-size:10px;color:rgba(245,239,226,.3);">…</span>'+
    '</div>'+
    '<div id="sw23-slide-wrap"></div>'+
    '<div id="sw23-dots"></div>';

  var hb=document.querySelector('#page-home .home-body');
  if(hb) hb.insertBefore(sec,hb.firstChild);
}

function renderSlides(){
  var wrap=document.getElementById('sw23-slide-wrap');
  var dotsEl=document.getElementById('sw23-dots');
  var cnt=document.getElementById('sw23-news-cnt');
  if(!wrap||!dotsEl) return;

  var arts=(_arts.length?_arts:LOCAL_ARTS).slice(0,6);
  if(cnt) cnt.textContent=arts.length+' articoli';

  wrap.innerHTML=''; dotsEl.innerHTML='';

  arts.forEach(function(a,i){
    var tit=tf(a,'titolo')||a.titolo||'';
    var cat=tf(a,'categoria')||a.categoria||'';
    var txt=tf(a,'testo')||a.testo||'';
    var img=a.immagine||IMGS[i%IMGS.length];
    var bg=BG[i%BG.length];

    var card=document.createElement('div');
    card.className='sw23-slide'+(i===0?' on':'');
    card.innerHTML=
      '<div style="background:'+bg+';width:38%;flex-shrink:0;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;">'+
        '<img class="sw23-slide-img" src="'+img+'" loading="lazy" alt="" onerror="this.style.display=\'none\'">'+
      '</div>'+
      '<div class="sw23-slide-body">'+
        '<div>'+
          '<div class="sw23-slide-cat">'+cat+'</div>'+
          '<div class="sw23-slide-tit">'+tit+'</div>'+
          '<div class="sw23-slide-txt">'+txt.replace(/\n\n/g,' ').substring(0,220)+'</div>'+
        '</div>'+
        '<div class="sw23-slide-meta">'+
          (a.data?'<span>'+a.data+'</span>':'')+
          (a.autore?'<span>· '+a.autore+'</span>':'')+
          (a.generato_ai?'<span class="sw23-slide-ai">✦ AI</span>':'')+
        '</div>'+
      '</div>';
    card.onclick=(function(art,idx){return function(){openReader(art,idx);};})(a,i);
    wrap.appendChild(card);

    var dot=document.createElement('div');
    dot.className='sw23-pg'+(i===0?' on':'');
    dot.onclick=(function(idx){return function(){goSlide(idx);};})(i);
    dotsEl.appendChild(dot);
  });

  if(_slideTimer) clearInterval(_slideTimer);
  _slideIdx=0;
  _slideTimer=setInterval(function(){
    _slideIdx=(_slideIdx+1)%arts.length;
    goSlide(_slideIdx);
  },5000);
}

function goSlide(idx){
  document.querySelectorAll('.sw23-slide').forEach(function(c){c.classList.remove('on');});
  document.querySelectorAll('.sw23-pg').forEach(function(d){d.classList.remove('on');});
  var c=document.querySelectorAll('.sw23-slide')[idx];
  var d=document.querySelectorAll('.sw23-pg')[idx];
  if(c)c.classList.add('on');
  if(d)d.classList.add('on');
  _slideIdx=idx;
}

/* ══════════════════ IL SAPERE DEL VINO ══════════════════ */
var SAPERE_TESTI = [
  /* Viticoltura */
  {cat:'🌿 Viticoltura',ico:'🌱',img:IMGS[2],
   titoli:['La Potatura: il Gesto più Importante','Come si Alleva la Vite','La Vendemmia: Quando e Come Raccogliere','Il Diradamento dei Grappoli','La Cover Crop e la Biodiversità'],
   testi:[
     'La potatura invernale è il gesto più importante che un vignaiolo compie nell\'anno. Si esegue tra dicembre e febbraio, quando la vite è in riposo vegetativo. Ogni tralcio tagliato è una decisione: quante gemme lasciare, quanti grappoli potenziali permettere.\n\nNel sistema Guyot borgognone, un solo tralcio principale viene piegato orizzontalmente con gemme contate. A Bordeaux si usa il cordone di Royat. In Sicilia e a Santorini sopravvive l\'alberello, la forma ancestrale che lotta contro siccità e vento.\n\nUn vignaiolo esperto cammina ogni filare e prende decisioni diverse metro per metro, adattandosi al vigore di ogni vite. Non esistono regole universali: esiste l\'esperienza.',
     'L\'allevamento della vite — la forma con cui cresce e si sviluppa — determina tutto: esposizione al sole, ventilazione, produzione. Il Guyot è il sistema più diffuso in Borgogna e in molte aree del mondo: un unico tralcio portante, piegato orizzontalmente su un filo. Il cordone di Royat usa invece due braccia permanenti.\n\nL\'alberello, la forma più antica, cresce basso e compatto senza supporti. Lo troviamo ancora integro sulle pendici dell\'Etna, a Pantelleria, nelle vecchie vigne di Jerez. Resiste alla siccità perché le radici sono profondissime, e al vento perché la superficie esposta è minima.\n\nLa forma di allevamento influenza direttamente la qualità: meno produzione, più concentrazione.',
     'La vendemmia è il momento in cui tutto si decide. Raccogliere troppo presto significa acidità e mancanza di maturazione fenolica; troppo tardi significa perdita di acidità e vini piatti. Il vignaiolo aspetta l\'equilibrio perfetto tra zuccheri, acidità e maturazione dei polifenoli.\n\nLe aziende più attente effettuano analisi chimiche quotidiane nelle ultime settimane prima della raccolta. Vanno in vigna ogni mattina, assaggiano gli acini, valutano la consistenza delle bucce, guardano i vinaccioli. È una scienza che ha bisogno dell\'istinto.\n\nNelle grandi denominazioni come Barolo o Borgogna, la data di vendemmia è dichiarata — nessuno può raccogliere prima. Nelle zone più calde, con il cambiamento climatico, si vendemmia sempre più presto.',
     'Il diradamento dei grappoli (chiamato anche "vendemmia verde") è la pratica di tagliare i grappoli acerbi a luglio per concentrare la linfa sui grappoli rimasti. Una perdita programmata di quantità per guadagnare qualità.\n\nNei grandi vigneti di Barolo, Brunello e Bordeaux, il diradamento è la norma. In Borgogna i vignaioli più tradizionali lo evitano, preferendo gestire la produzione con la sola potatura. L\'obiettivo in entrambi i casi è lo stesso: ridurre la resa, aumentare la concentrazione.\n\nLa resa massima consentita dalle denominazioni varia enormemente: da 35 hl/ha del Barolo ai 90+ di alcune DOC generiche. I produttori più orientati alla qualità spesso si autolimitano ben al di sotto del massimo.',
     'La cover crop — l\'inerbimento tra i filari con erbe e fiori selezionati — è diventata la bandiera della viticoltura sostenibile. Ospita insetti benefici, contrasta l\'erosione del suolo, migliora la struttura del terreno e riduce i trattamenti chimici.\n\nI vignaioli biodinamici scelgono le piante con cura: alcune leguminose fissano azoto, altre attraggono api e insetti impollinatori, altre ancora competono con la vite per l\'acqua, che è esattamente l\'obiettivo in anni molto piovosi.\n\nIn un ettaro di vigna sana — con copertina erbosa, senza erbicidi — vivono più di un milione di organismi diversi: batteri, funghi, lombrichi, insetti, ragni. Questa biodiversità è la vera anima del terroir.'
   ]},
  /* Sommelier */
  {cat:'🎓 Sommelier',ico:'🔪',img:IMGS[0],
   titoli:['La Decantazione: Quando e Come','Il Rigetto della Bottiglia','La Temperatura di Servizio','Come Si Annusa il Vino','L\'Arte dell\'Abbinamento'],
   testi:[
     'La decantazione serve per due ragioni diverse e spesso confuse: eliminare i sedimenti dai vini vecchi, e ossigenare i vini giovani tannici.\n\nUn Barolo 2019, giovane e ancora chiuso, beneficia enormemente di 2-3 ore di decantazione in un ampio decanter. I tannini si ammorbidiscono, i profumi si aprono, la struttura si distende. Un Amarone può richiedere anche 4-5 ore.\n\nAl contrario, un vino bianco vecchio o un Borgogna maturo deve essere decantato con delicatezza — se ha dei sedimenti, si capovolge la bottiglia la sera prima, si lascia depositare, e si versa lentamente attraverso un colino. La decantazione aggressiva lo ossida e lo rovina in pochi minuti.',
     'Il rigetto di una bottiglia difettata è un diritto del cliente, non un capriccio. Il sommelier deve aprire e annusare il tappo: il TCA (tricloroanisolo) emette un odore inconfondibile di cantina umida, cartone bagnato, muffa. La bottiglia è "tappata" e il ristorante è obbligato a cambiarla.\n\nAltri difetti possibili: ossidazione (vino piatto, aranciato, con note di mela cotta), riduzione (odore di uova, gomma, aglio — a volte si risolve con l\'ossigenazione), Brett (odore di stalla, cuoio, sudore — può essere un difetto o una caratteristica, dipende dall\'intensità).\n\nUna bottiglia difettata non si paga. Se il ristorante non accetta il rigetto, si può insistere educatamente: è un diritto tutelato anche dalla normativa europea.',
     'La temperatura di servizio è uno degli elementi più trascurati e più importanti. Un Barolo servito a 22°C sembra alcolico e piatto — gli aromi volatili fuggono, i tannini sembrano secchi. Lo stesso vino a 16°C è completamente diverso: più fresco, più preciso, più elegante.\n\nLa regola semplice: bianchi e rosé dal frigorifero 20-30 minuti prima di servire, rossi leggeri (Pinot Nero, Barbera) dal frigo 15 minuti prima, rossi strutturati (Barolo, Brunello, Amarone) a 16-17°C cioè in una cantina fresca, non mai a temperatura ambiente di una casa moderna che in estate sale a 24°C.\n\nGli Champagne di pregio si servono a 10-12°C, non a 6°C: il freddo eccessivo sopprime i profumi.',
     'La prima annusata si fa a naso fermo, senza ruotare il calice: arrivano gli aromi primari, i più volatili. Frutta fresca, fiori, erbe aromatiche. Già questa prima impressione può dirci molto — se prevale la frutta rossa o nera, se c\'è floreale, se sentiamo mineralità.\n\nDopo aver ruotato il calice energicamente, si annusa subito: arrivano gli aromi secondari (fermentazione — pane, yogurt, lievito) e poi i terziari o aromi di invecchiamento (cuoio, tabacco, terra, muschio, tartufo, catrame nei grandi rossi).\n\nL\'ottanta per cento di quello che percepiamo come "sapore" è in realtà retrolfattivo — aromi che saliamo attraverso la via rinofaringea mentre beviamo. Per questo chi ha il naso chiuso percepisce pochissimo il vino.',
     'L\'abbinamento cibo-vino si basa su due principi fondamentali: concordanza e contrasto. La concordanza cerca similitudini: un piatto delicato e aromatico vuole un vino delicato e aromatico, un piatto potente e grasso vuole un vino strutturato e tannico.\n\nIl contrasto cerca equilibrio opposto: la frittura vuole le bollicine che sgrassano il palato, il foie gras grasso e ricco vuole il Sauternes che bilancia con dolcezza e acidità, i formaggi erborinati intensi vogliono vini dolci che si "scontrano" creando equilibrio.\n\nLa regola d\'oro del Master Sommelier: abbina prima la struttura, poi gli aromi. Un Barolo con un pesce delicato sbagliato non per i profumi, ma perché i tannini potenti distruggono la texture del pesce.'
   ]},
  /* Vitigni */
  {cat:'🍇 Vitigni del Mondo',ico:'🍇',img:IMGS[6],
   titoli:['Il Nebbiolo: Vitigno dei Re','Il Riesling: il più Longevo','Il Sangiovese e i suoi Cloni','Pinot Nero: l\'Impossibile','Il Grenache: il più Coltivato'],
   testi:[
     'Il Nebbiolo è probabilmente il vitigno più difficile d\'Italia da coltivare e da vinificare. Matura tardissimo — fine ottobre, a rischio gelate —, ama esclusivamente i suoli calcarei delle Langhe, e esprime il terroir con una precisione chirurgica che pochi altri vitigni riescono a eguagliare.\n\nA Barolo il Nebbiolo è austero, tannico, longevo, con profumi di violetta, rosa secca, catrame e spezie dopo anni di invecchiamento. A Barbaresco, su suoli più sabbiosi e profondi, è più elegante e accessibile giovane. A Gattinara, su porfido vulcanico, quasi borgognone nella trasparenza.\n\nIl grande Nebbiolo richiede almeno 10 anni per esprimersi pienamente. I migliori — Monfortino di Conterno, Mascarello Barolo, Quintarelli Valpolicella — ne richiedono 20 o 30.',
     'Il Riesling è il vitigno a bacca bianca più longevo del mondo. Un Trockenbeerenauslese del Mosel in un\'annata eccezionale può invecchiare 80-100 anni senza perdere la sua struttura. Bottiglie degli anni \'40 e \'50 del secolo scorso sono ancora magnifiche.\n\nIl segreto è l\'acidità: il Riesling conserva naturalmente livelli elevatissimi di acido tartarico e malico, che agiscono come conservante naturale nel lungo invecchiamento. Dopo vent\'anni sviluppa la "petroliosità" — idrocarburi nobili che i fan del vitigno considerano il suo massimo traguardo.\n\nArdesia del Mosel, granito dell\'Alsazia, calcare del Rheingau, phyllite del Wachau: ogni terreno firma il Riesling in modo diverso. La mineralità intensa che sentiamo viene letteralmente dal suolo assorbito dalle radici.',
     'Il Sangiovese non è un vitigno solo: è una famiglia. Il Sangiovese Grosso di Montalcino — il Brunello — è austero, longevo, con acidità tagliente e tannini potenti. Il Sangiovese Piccolo del Chianti è più fruttato, accessibile giovane. Il Prugnolo Gentile di Montepulciano ancora diverso.\n\nQuesti non sono solo nomi commerciali: sono cloni geneticamente diversi, selezioni secolare effettuate dai vignaioli nel corso dei secoli. Un Brunello di Montalcino e un Chianti Classico hanno lo stesso DNA di base ma sono vini completamente diversi per struttura, aromi e longevità.\n\nIl Sangiovese è il vitigno più coltivato d\'Italia: oltre 60.000 ettari. Nessun altro vitigno italiano si avvicina a questa diffusione.',
     'Il Pinot Nero è il vitigno più difficile al mondo. Richiede un microclima perfettamente equilibrato — troppo caldo e perde freschezza, troppo freddo e non matura. I suoi acini sottili e fitti in grappoli compatti lo rendono vulnerabile a quasi tutte le malattie fungine.\n\nEppure produce i vini più grandi del mondo. La Romanée-Conti vale 500.000 euro a bottiglia. Chambertin, Musigny, Richebourg: nomi che fanno tremare i collezionisti. In Borgogna questo vitigno ha trovato il suo habitat perfetto nel calcare kimmeridgiano della Côte d\'Or.\n\nFuori dalla Borgogna, il Pinot Nero riesce in pochi posti: Willamette Valley in Oregon, Central Otago in Nuova Zelanda, Ahr in Germania, l\'Etna in Sicilia dove il vulcano ricrea un microclima quasi alpino.',
     'Il Grenache (Garnacha in Spagna, Cannonau in Sardegna) è il vitigno a bacca rossa più coltivato al mondo — circa 200.000 ettari. È la base di Châteauneuf-du-Pape nel Rodano, del Priorat in Catalogna, e di molti rosati provenzali.\n\nNaturalmente alto in alcol (raggiunge facilmente 15-16°) ma basso in tannini, il Grenache ha bisogno di partner varietali per dare struttura: Syrah e Mourvèdre nel blend provenzale, Cariñena nel Priorat. Solo nelle vecchie vigne, da uve concentrate e poco produttive, dà grandi vini in purezza.\n\nIn Sardegna, il Cannonau delle vigne centenarie di Orgosolo e Oliena è tra le più straordinarie espressioni del vitigno: minerale, speziato, con tannini morbidi e una persistenza notevole. Giuseppe Sedilesu è il produttore di riferimento.'
   ]},
];

function inject3ArtSection(){
  if(document.getElementById('sw23-sapere')) return;
  /* Rimuove eventuale sezione curiosità duplicata */
  var old=document.getElementById('sw23-cur-old');if(old)old.remove();

  var footer=document.querySelector('footer');if(!footer)return;
  var sec=document.createElement('div');sec.id='sw23-sapere';
  sec.innerHTML=
    '<div id="sw23-sapere-hd">'+
      '<span style="font-size:1rem;">📖</span>'+
      '<span style="font-family:Cinzel,serif;font-size:.58rem;letter-spacing:4px;color:var(--vino,#8B0000);">IL SAPERE DEL VINO</span>'+
      '<span id="sw23-sapere-date" style="font-size:10px;color:rgba(245,239,226,.2);margin-left:auto;"></span>'+
    '</div>';
  footer.parentNode.insertBefore(sec,footer);
  render3Art();
}

function render3Art(){
  var sec=document.getElementById('sw23-sapere');if(!sec)return;

  var today=new Date();
  var dayN=Math.floor(Date.now()/86400000);
  var d=document.getElementById('sw23-sapere-date');
  if(d)d.textContent=today.toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long'});

  if(_3artCache.day===dayN){ return; }
  _3artCache.day=dayN;
  _3artCache.data=SAPERE_TESTI.map(function(S,i){
    var titoloIdx=(dayN+i)%S.titoli.length;
    var testoIdx=(dayN+i)%S.testi.length;
    return {cat:S.cat,ico:S.ico,img:S.img,titolo:S.titoli[titoloIdx],testo:S.testi[testoIdx]};
  });

  /* Rimuove le card precedenti */
  sec.querySelectorAll('.sw23-ac').forEach(function(el){el.remove();});

  _3artCache.data.forEach(function(art,i){
    var card=document.createElement('div');card.className='sw23-ac';
    card.style.borderColor=BG[i%BG.length].includes('74,14')
      ?'rgba(191,155,74,.15)':'rgba(191,155,74,.1)';
    card.innerHTML=
      (art.img
        ?'<img class="sw23-ac-img" src="'+art.img+'" loading="lazy" alt="" onerror="this.style.display=\'none\'">'
        :'<div class="sw23-ac-img-ph" style="background:'+BG[i%BG.length]+'">'+art.ico+'</div>')+
      '<div class="sw23-ac-body">'+
        '<div class="sw23-ac-tag">'+art.cat+'</div>'+
        '<div class="sw23-ac-tit">'+art.titolo+'</div>'+
        '<div class="sw23-ac-txt">'+art.testo.substring(0,320)+'…</div>'+
        '<div class="sw23-ac-meta">'+today.toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'})+' · Sommelier World Editorial</div>'+
      '</div>';
    card.onclick=(function(art,idx){return function(){
      openReader({titolo:art.titolo,categoria:art.cat,testo:art.testo,
        autore:'Sommelier World',data:today.toLocaleDateString('it-IT'),immagine:art.img||''},idx);
    };})(art,i);
    sec.appendChild(card);
  });
}

/* ══════════════════ CURIOSITÀ (home only, carosello) ══════════════════ */
function injectCuriosity(){
  if(document.getElementById('sw23-cur')) return;
  /* Rimuove la vecchia sezione curiosità del giorno se esiste */
  document.querySelectorAll('[id*="cur-old"],[id*="curiosit"]').forEach(function(el){
    el.style.setProperty('display','none','important');
  });

  var sec=document.createElement('div');sec.id='sw23-cur';
  sec.innerHTML=
    '<div style="display:flex;align-items:center;gap:8px;padding:12px 14px 10px;">'+
      '<span style="font-size:.85rem;">🎓</span>'+
      '<span style="font-family:Cinzel,serif;font-size:.52rem;letter-spacing:4px;color:rgba(191,155,74,.5);">CURIOSITÀ</span>'+
    '</div>'+
    '<div id="sw23-cur-s"></div>';

  var sapere=document.getElementById('sw23-sapere');
  if(sapere&&sapere.parentNode) sapere.parentNode.insertBefore(sec,sapere);
  else{ var footer=document.querySelector('footer');if(footer)footer.parentNode.insertBefore(sec,footer); }

  renderCuriosity();
}

function renderCuriosity(){
  var c=document.getElementById('sw23-cur-s');if(!c)return;
  var dayN=Math.floor(Date.now()/86400000);
  var shown=[];for(var i=0;i<6;i++)shown.push(CUR[(dayN+i)%CUR.length]);
  c.innerHTML='';
  shown.forEach(function(cur,i){
    var card=document.createElement('div');card.className='sw23-cc';
    card.style.background=BG[i%BG.length];
    card.innerHTML=
      '<div class="sw23-cc-b">'+
        (cur.img?'<div style="width:calc(100%+24px);margin:-12px -12px 10px;height:65px;overflow:hidden;">'+
          '<img src="'+cur.img+'" style="width:100%;height:65px;object-fit:cover;display:block;" loading="lazy" onerror="this.parentNode.style.display=\'none\'"></div>':'')+
        '<div style="font-size:1.2rem;margin-bottom:4px;">'+cur.ico+'</div>'+
        '<div style="font-size:7px;font-weight:700;letter-spacing:2px;color:rgba(191,155,74,.45);text-transform:uppercase;margin-bottom:4px;">'+cur.t+'</div>'+
        '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:.78rem;font-weight:700;color:#F5EFE2;line-height:1.28;margin-bottom:5px;">'+cur.h+'</div>'+
        '<div style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:.76rem;line-height:1.6;color:rgba(245,239,226,.55);">'+cur.b.substring(0,95)+'…</div>'+
      '</div>';
    card.onclick=(function(cur,i){return function(){
      openReader({titolo:cur.h,categoria:'🎓 '+cur.t,testo:cur.b,autore:'Sommelier World',
        data:new Date().toLocaleDateString('it-IT'),immagine:cur.img||''},i);
    };})(cur,i);
    c.appendChild(card);
  });
}

/* ══════════════════ READER ══════════════════ */
function openReader(art,idx){
  var tit=tf(art,'titolo')||art.titolo||'';
  var cat=tf(art,'categoria')||art.categoria||'';
  var txt=tf(art,'testo')||art.testo||'';
  var bg=BG[(idx||0)%BG.length];
  var img=art.immagine||IMGS[(idx||0)%IMGS.length];
  var paras=(txt||'').split(/\n\n+/).filter(Boolean)
    .map(function(p){return'<p style="margin:0 0 20px;font-size:1.08rem;line-height:2;">'+p.trim()+'</p>';}).join('');

  var r=document.getElementById('sw23-reader');
  if(!r){r=document.createElement('div');r.id='sw23-reader';document.body.appendChild(r);}
  r.innerHTML=
    '<div style="position:sticky;top:0;z-index:2;background:rgba(10,7,5,.97);backdrop-filter:blur(12px);'+
      'border-bottom:1px solid rgba(191,155,74,.12);display:flex;align-items:center;gap:12px;padding:12px 16px;">'+
      '<button onclick="SW23.closeReader()" style="width:36px;height:36px;border-radius:50%;background:rgba(191,155,74,.1);'+
        'border:1px solid rgba(191,155,74,.2);color:#BF9B4A;font-size:18px;cursor:pointer;'+
        'display:flex;align-items:center;justify-content:center;">←</button>'+
      '<div style="font-family:Cinzel,serif;font-size:.56rem;letter-spacing:2px;color:rgba(191,155,74,.6);'+
        'flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+tit+'</div>'+
    '</div>'+
    '<div style="max-width:720px;margin:0 auto;padding-bottom:80px;">'+
      '<div style="width:100%;height:210px;background:'+bg+';display:flex;align-items:center;'+
        'justify-content:center;font-size:3.5rem;position:relative;overflow:hidden;">'+
        '<img src="'+img+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" alt="" onerror="this.style.display=\'none\'">'+
        '<span style="position:relative;z-index:1;filter:drop-shadow(0 2px 12px rgba(0,0,0,.9));">🍷</span>'+
      '</div>'+
      '<div style="padding:24px 20px 0;">'+
        '<div style="font-size:9px;font-weight:700;letter-spacing:3px;color:rgba(191,155,74,.5);text-transform:uppercase;margin-bottom:10px;">'+cat+'</div>'+
        '<h1 style="font-family:\'Playfair Display\',Georgia,serif;font-size:1.6rem;font-weight:700;line-height:1.25;color:#F5EFE2;margin:0 0 14px;">'+tit+'</h1>'+
        '<div style="font-size:11px;color:rgba(245,239,226,.3);margin-bottom:24px;padding-bottom:14px;'+
          'border-bottom:1px solid rgba(191,155,74,.1);display:flex;gap:8px;flex-wrap:wrap;align-items:center;">'+
          (art.data?'<span>'+art.data+'</span>':'')+
          (art.autore?'<span>·</span><span>'+art.autore+'</span>':'')+
          (art.generato_ai?'<span style="background:rgba(125,218,138,.12);color:rgba(125,218,138,.7);font-size:9px;padding:2px 7px;border-radius:3px;">✦ AI</span>':'')+
        '</div>'+
        '<div style="font-family:\'Cormorant Garamond\',Georgia,serif;color:rgba(245,240,232,.82);">'+
          (paras||'<p>Contenuto non disponibile.</p>')+
        '</div>'+
      '</div>'+
    '</div>';

  r.style.display='block';r.scrollTop=0;
  document.body.style.overflow='hidden';_readerOpen=true;
  try{history.pushState({r:1},'');}catch(e){}
}

window.addEventListener('popstate',function(){
  if(_readerOpen){
    var r=document.getElementById('sw23-reader');if(r)r.style.display='none';
    document.body.style.overflow='';_readerOpen=false;
  }
});

/* ══════════════════ VISIBILITÀ HOME-ONLY ══════════════════ */
function checkVisibility(){
  var isHome=!!(document.querySelector('#page-home.active')||document.querySelector('#page-home[style*="block"]'));
  ['sw23-news','sw23-sapere','sw23-cur'].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.style.setProperty('display',isHome?'':'none','important');
  });
}

function hookShowPage(){
  if(window.__sw23h)return;
  var orig=window.showPage;
  if(!orig){setTimeout(hookShowPage,400);return;}
  window.showPage=function(pid){
    orig.call(this,pid);
    setTimeout(checkVisibility,60);
    if(pid==='home')setTimeout(buildTicker,120);
  };
  document.querySelectorAll('.ntab').forEach(function(t){
    t.addEventListener('click',function(){setTimeout(checkVisibility,100);},true);
  });
  window.__sw23h=true;
}

/* ══════════════════ FAB + CONTATTI ══════════════════ */
function addFAB(){
  if(document.getElementById('sw23-fab'))return;
  var fab=document.createElement('div');fab.id='sw23-fab';fab.title='Scrivici';fab.innerHTML='✉️';
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
    '<div style="position:sticky;top:0;z-index:2;background:rgba(10,7,5,.97);backdrop-filter:blur(12px);'+
      'border-bottom:1px solid rgba(191,155,74,.15);display:flex;align-items:center;gap:12px;padding:13px 16px;">'+
      '<button onclick="SW23.closeContact()" style="width:36px;height:36px;border-radius:50%;background:rgba(191,155,74,.1);'+
        'border:1px solid rgba(191,155,74,.2);color:#BF9B4A;font-size:18px;cursor:pointer;'+
        'display:flex;align-items:center;justify-content:center;">←</button>'+
      '<div style="font-family:Cinzel,serif;font-size:.65rem;letter-spacing:3px;color:#F5EFE2;">CONTATTI</div>'+
    '</div>'+
    '<div style="max-width:540px;margin:0 auto;padding:24px 20px 80px;box-sizing:border-box;">'+
      '<div style="text-align:center;margin-bottom:22px;">'+
        '<h2 style="font-family:\'Playfair Display\',serif;font-size:1.4rem;font-weight:700;color:#F5EFE2;margin:0 0 6px;">Come possiamo aiutarti?</h2>'+
        '<p style="font-size:12px;color:rgba(245,239,226,.4);line-height:1.7;margin:0;">Produttori, collaborazioni, segnalazioni. Risponderemo entro 48 ore.</p>'+
      '</div>'+
      '<div id="sw23-cok" style="display:none;text-align:center;padding:20px;background:rgba(125,218,138,.08);border:1px solid rgba(125,218,138,.2);border-radius:10px;margin-bottom:16px;">'+
        '<div style="font-size:1.8rem;">✓</div><div style="font-family:\'Playfair Display\',serif;color:#7dda8a;margin-top:4px;">Messaggio inviato!</div>'+
      '</div>'+
      '<div id="sw23-cfrm">'+
        '<div style="margin-bottom:14px;"><label class="sw23-lbl">NOME *</label><input id="sw23-cn" class="sw23-inp" type="text" placeholder="Il tuo nome" autocomplete="name"></div>'+
        '<div style="margin-bottom:14px;"><label class="sw23-lbl">EMAIL *</label><input id="sw23-ce" class="sw23-inp" type="email" placeholder="tua@email.com" autocomplete="email"></div>'+
        '<div style="margin-bottom:14px;"><label class="sw23-lbl">MESSAGGIO *</label><textarea id="sw23-cm" class="sw23-inp" style="height:100px;resize:none;" placeholder="Scrivi qui..."></textarea></div>'+
        '<button onclick="SW23.sendMsg()" class="sw23-btn">✦ INVIA MESSAGGIO ✦</button>'+
        '<div id="sw23-cerr" style="display:none;margin-top:8px;padding:10px;background:rgba(220,50,50,.12);border:1px solid rgba(220,50,50,.25);border-radius:6px;font-size:12px;color:rgba(255,150,150,.9);text-align:center;"></div>'+
      '</div>'+
      '<div style="margin:20px 0;border-top:1px solid rgba(191,155,74,.1);position:relative;">'+
        '<span style="position:absolute;top:-8px;left:50%;transform:translateX(-50%);background:#0A0705;padding:0 12px;font-size:9px;letter-spacing:3px;color:rgba(191,155,74,.3);">NEWSLETTER</span>'+
      '</div>'+
      '<div style="display:flex;gap:10px;">'+
        '<input id="sw23-nle" class="sw23-inp" type="email" placeholder="la.tua@email.com" style="flex:1;">'+
        '<button onclick="SW23.subscribe()" style="padding:11px 14px;background:rgba(191,155,74,.16);border:1.5px solid rgba(191,155,74,.35);border-radius:8px;color:#BF9B4A;font-family:Cinzel,serif;font-size:.5rem;font-weight:700;cursor:pointer;white-space:nowrap;">ISCRIVITI</button>'+
      '</div>'+
      '<div style="text-align:center;margin-top:18px;"><a href="mailto:info@sommelierworld.vin" style="color:rgba(191,155,74,.55);font-size:13px;text-decoration:none;">info@sommelierworld.vin</a></div>'+
    '</div>';
  document.body.appendChild(p);p.style.display='block';document.body.style.overflow='hidden';
};

window.SW23={
  closeReader:function(){var r=document.getElementById('sw23-reader');if(r)r.style.display='none';document.body.style.overflow='';_readerOpen=false;},
  closeContact:function(){
    var p=document.getElementById('sw23-cp');if(p)p.style.display='none';document.body.style.overflow='';
    document.querySelectorAll('.ntab').forEach(function(t){t.classList.remove('active');});
    var h=document.querySelector('.ntab[data-page="home"]');if(h)h.classList.add('active');
    checkVisibility();
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

/* ══════════════════ KILL FAB VECCHIO ══════════════════ */
function killOldFAB(){
  document.querySelectorAll('#sw11-fab-contact,[id*="fab-contact"]:not(#sw23-fab),#sw10-contact').forEach(function(el){
    el.style.setProperty('display','none','important');
  });
  window.fixContactButton=function(){};
}
var _ki=setInterval(function(){killOldFAB();},700);
setTimeout(function(){clearInterval(_ki);},8000);

/* Mappa dark */
var _mw=setInterval(function(){
  if(typeof L!=='undefined'&&window.TILES){
    window.TILES.street='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    clearInterval(_mw);
  }
},800);
setTimeout(function(){clearInterval(_mw);},15000);

/* ══════════════════ CARICA ARTICOLI ══════════════════ */
async function loadArts(){
  _arts=getElite().concat(LOCAL_ARTS);
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
          if(!a.immagine)a.immagine=IMGS[Math.floor(Math.random()*IMGS.length)];
        });
        _arts=getElite().concat(data);
        renderSlides();buildTicker();
        console.log('[v23] '+data.length+' articoli dal server ✓');
      }
    }
  }catch(e){console.log('[v23] Articoli locali ('+e.message+')');}
}

/* ══════════════════ LINGUA ══════════════════ */
function hookLang(){
  var origLang=window.i18n&&window.i18n.setLang&&window.i18n.setLang.bind(window.i18n);
  if(!origLang)return;
  window.i18n.setLang=function(l){
    origLang(l);
    /* Salva subito in localStorage (il sistema originale già lo fa, ma per sicurezza) */
    try{localStorage.setItem('sw_lang',l);}catch(e){}
    /* Ri-renderizza tutto nella nuova lingua */
    setTimeout(function(){
      renderSlides();buildTicker();render3Art();
    },200);
  };
}

/* ══════════════════ INIT ══════════════════ */
function init(){
  console.log('[v23] Init...');

  /* 1. Sommelier fix (il più critico) */
  fixSommelier();

  /* 2. UI */
  addContactTab();addFAB();
  killOldFAB();

  /* 3. Sezioni home */
  injectNewsSection();
  inject3ArtSection();
  injectCuriosity();

  /* 4. Navigation hook */
  hookShowPage();
  hookLang();
  checkVisibility();

  /* 5. Dati */
  loadArts();

  /* 6. Lingua persistente — riapplica la lingua salvata */
  setTimeout(function(){
    var saved=localStorage.getItem('sw_lang');
    if(saved&&saved!=='it'&&window.i18n) window.i18n.setLang(saved);
  },500);

  console.log('[v23] ✓ Patch installata — Sommelier multilingua, paese obbligatorio');
}

document.readyState==='loading'
  ? document.addEventListener('DOMContentLoaded',init)
  : init();

})();
