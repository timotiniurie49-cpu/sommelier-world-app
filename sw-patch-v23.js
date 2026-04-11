/**
 * SOMMELIER WORLD — sw-patch-v23.js — ALL FIXES
 * ✓ Sommelier: paese OBBLIGATORIO nel prompt (Germania → vini tedeschi)
 * ✓ Slideshow automatico (auto-avanza) per le notizie
 * ✓ 3 articoli fissi IA sotto la Gazzetta (cambiano ogni giorno)
 * ✓ Ticker nella Gazzetta del Terroir con notizie AI
 * ✓ Denominazioni: ri-triggera sw-patch-v6
 * ✓ Lingua: ri-genera contenuto in lingua selezionata
 * ✓ FAB email basso destra
 * ✓ Curiosità solo in home
 */
console.log('=== SW PATCH V23 ATTIVA ===');

(function () {
'use strict';

var SRV = 'https://sommelier-server-production-8f92.up.railway.app';
var _arts = [];
var _slideIdx = 0;
var _slideTimer = null;
var _readerOpen = false;

/* ════════════════════════════════════════
   DEBUG BANNER
   ════════════════════════════════════════ */
(function(){
  var b=document.createElement('div');
  b.style.cssText='position:fixed;top:0;left:0;right:0;z-index:9999999;background:#1a5c1a;color:#fff;'+
    'font-family:Cinzel,serif;font-size:.5rem;font-weight:700;letter-spacing:3px;'+
    'text-align:center;padding:6px;transition:opacity .6s;pointer-events:none;';
  b.textContent='✓ PATCH V23 ATTIVA';
  document.body.appendChild(b);
  setTimeout(function(){b.style.opacity='0';},2000);
  setTimeout(function(){if(b.parentNode)b.remove();},2700);
})();

/* ════════════════════════════════════════
   CSS
   ════════════════════════════════════════ */
(function(){
  var s=document.createElement('style');
  s.id='sw23-css';
  s.textContent=[
    /* Ticker */
    '#sw23-tick{position:absolute!important;bottom:0!important;left:0!important;right:0!important;',
      'z-index:100!important;height:36px!important;overflow:hidden!important;display:block!important;',
      'background:rgba(10,7,5,.88)!important;border-top:1px solid rgba(191,155,74,.3)!important;}',
    '#sw23-tick-t{display:flex!important;align-items:center!important;height:36px!important;',
      'white-space:nowrap!important;animation:sw23sc 50s linear infinite!important;',
      'will-change:transform!important;}',
    '#sw23-tick-t:hover{animation-play-state:paused!important;}',
    '@keyframes sw23sc{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}',
    '.sw23-ti{display:inline-flex!important;align-items:center!important;gap:7px!important;',
      'padding:0 20px!important;height:36px!important;cursor:pointer!important;flex-shrink:0!important;',
      'font-family:Cinzel,serif!important;font-size:.48rem!important;letter-spacing:.1em!important;',
      'color:rgba(245,239,226,.75)!important;border-right:1px solid rgba(191,155,74,.12)!important;}',
    '.sw23-ti:hover{color:#D4AF37!important;}',
    '.sw23-ti-d{width:5px!important;height:5px!important;border-radius:50%!important;',
      'background:rgba(191,155,74,.7)!important;flex-shrink:0!important;}',
    '.sw23-ti-dn{background:rgba(120,200,255,.8)!important;}',
    '.sw23-ti-lbl{display:inline-flex!important;align-items:center!important;',
      'padding:0 18px!important;height:36px!important;flex-shrink:0!important;',
      'font-family:Cinzel,serif!important;font-size:.46rem!important;letter-spacing:3px!important;',
      'color:rgba(191,155,74,.55)!important;border-right:1px solid rgba(191,155,74,.2)!important;}',

    /* SLIDESHOW notizie */
    '#sw23-slide-wrap{background:#0A0705!important;border-bottom:1px solid rgba(191,155,74,.1)!important;overflow:hidden!important;}',
    '#sw23-slide-head{display:flex!important;align-items:center!important;justify-content:space-between!important;padding:10px 14px 8px!important;}',
    '#sw23-slide{position:relative!important;height:220px!important;overflow:hidden!important;}',
    '.sw23-slide-card{position:absolute!important;inset:0!important;display:flex!important;cursor:pointer!important;',
      'opacity:0!important;transition:opacity .6s!important;}',
    '.sw23-slide-card.active{opacity:1!important;z-index:1!important;}',
    '.sw23-slide-img{width:140px!important;flex-shrink:0!important;object-fit:cover!important;}',
    '.sw23-slide-body{flex:1!important;padding:14px!important;display:flex!important;flex-direction:column!important;justify-content:space-between!important;overflow:hidden!important;}',
    '.sw23-slide-cat{font-size:8px!important;font-weight:700!important;letter-spacing:2px!important;color:rgba(191,155,74,.55)!important;text-transform:uppercase!important;margin-bottom:6px!important;}',
    '.sw23-slide-tit{font-family:"Playfair Display",Georgia,serif!important;font-size:1.05rem!important;font-weight:700!important;color:#F5EFE2!important;line-height:1.3!important;flex:1!important;}',
    '.sw23-slide-txt{font-family:"Cormorant Garamond",Georgia,serif!important;font-size:.82rem!important;color:rgba(245,239,226,.55)!important;line-height:1.6!important;margin-top:8px!important;display:-webkit-box!important;-webkit-line-clamp:3!important;-webkit-box-orient:vertical!important;overflow:hidden!important;}',
    '.sw23-slide-meta{font-size:9px!important;color:rgba(245,239,226,.3)!important;margin-top:8px!important;display:flex!important;align-items:center!important;gap:6px!important;}',
    '.sw23-slide-ai{background:rgba(125,218,138,.15)!important;color:rgba(125,218,138,.7)!important;font-size:7px!important;padding:2px 5px!important;border-radius:3px!important;}',
    '.sw23-slide-nb{background:rgba(20,60,140,.55)!important;color:rgba(180,220,255,.9)!important;font-family:Cinzel,serif!important;font-size:7px!important;padding:2px 8px!important;}',
    '#sw23-slide-dots{display:flex!important;justify-content:center!important;gap:5px!important;padding:8px 0!important;background:#0A0705!important;}',
    '.sw23-dot{width:5px!important;height:5px!important;border-radius:50%!important;background:rgba(191,155,74,.2)!important;cursor:pointer!important;transition:background .2s!important;}',
    '.sw23-dot.on{background:rgba(191,155,74,.7)!important;}',

    /* 3 articoli IA fissi */
    '#sw23-3art{background:#0A0705!important;border-top:1px solid rgba(191,155,74,.08)!important;}',
    '.sw23-art-card{background:rgba(15,6,3,.9)!important;border:1px solid rgba(191,155,74,.12)!important;',
      'border-radius:8px!important;overflow:hidden!important;cursor:pointer!important;',
      'transition:transform .2s,box-shadow .2s!important;margin:0 14px 10px!important;}',
    '.sw23-art-card:hover{transform:translateY(-2px)!important;box-shadow:0 6px 22px rgba(0,0,0,.5)!important;}',
    '.sw23-art-img{width:100%!important;height:120px!important;object-fit:cover!important;display:block!important;}',
    '.sw23-art-img-ph{width:100%!important;height:120px!important;display:flex!important;align-items:center!important;justify-content:center!important;font-size:2rem!important;}',
    '.sw23-art-body{padding:12px!important;}',
    '.sw23-art-tag{font-size:8px!important;font-weight:700!important;letter-spacing:2px!important;color:rgba(191,155,74,.55)!important;text-transform:uppercase!important;margin-bottom:5px!important;}',
    '.sw23-art-tit{font-family:"Playfair Display",Georgia,serif!important;font-size:.92rem!important;font-weight:700!important;color:#F5EFE2!important;line-height:1.3!important;margin-bottom:6px!important;}',
    '.sw23-art-txt{font-family:"Cormorant Garamond",Georgia,serif!important;font-size:.82rem!important;color:rgba(245,239,226,.55)!important;line-height:1.65!important;}',

    /* Curiosità */
    '#sw23-cur{background:#0A0705!important;padding:0 0 6px!important;border-top:1px solid rgba(191,155,74,.08)!important;}',
    '#sw23-cur-s{display:flex!important;gap:10px!important;overflow-x:auto!important;',
      'padding:0 14px 14px!important;scroll-snap-type:x mandatory!important;',
      '-webkit-overflow-scrolling:touch!important;scrollbar-width:none!important;}',
    '#sw23-cur-s::-webkit-scrollbar{display:none!important}',
    '.sw23-cc{flex:0 0 210px!important;min-width:210px!important;scroll-snap-align:start!important;',
      'border-radius:8px!important;overflow:hidden!important;cursor:pointer!important;',
      'border:1px solid rgba(191,155,74,.12)!important;transition:transform .2s!important;}',
    '.sw23-cc:hover{transform:translateY(-3px)!important;}',
    '.sw23-cc-body{padding:13px 12px!important;}',

    /* Reader */
    '#sw23-reader{display:none;position:fixed;inset:0;z-index:999950;background:#0A0705;overflow-y:auto;}',

    /* Contatti */
    '#sw23-cp{display:none;position:fixed;inset:0;z-index:999900;background:#0A0705;overflow-y:auto;}',
    '.sw23-inp{width:100%;box-sizing:border-box;padding:11px 13px;background:rgba(255,255,255,.05);',
      'border:1px solid rgba(191,155,74,.2);border-radius:8px;color:#F5EFE2;font-family:Lato,sans-serif;',
      'font-size:15px;outline:none;display:block;}',
    '.sw23-inp:focus{border-color:rgba(191,155,74,.5);}',
    '.sw23-lbl2{display:block;font-size:9px;font-weight:700;letter-spacing:2px;color:rgba(191,155,74,.55);',
      'text-transform:uppercase;margin-bottom:5px;}',
    '.sw23-btn{width:100%;padding:13px;background:rgba(191,155,74,.18);border:1.5px solid rgba(191,155,74,.4);',
      'border-radius:8px;color:#BF9B4A;font-family:Cinzel,serif;font-size:.58rem;font-weight:700;',
      'letter-spacing:3px;cursor:pointer;}',
    '.sw23-btn:hover{background:rgba(191,155,74,.28);}',

    /* FAB */
    '#sw23-fab{position:fixed!important;bottom:20px!important;right:20px!important;z-index:99999!important;',
      'width:46px!important;height:46px!important;border-radius:50%!important;',
      'background:rgba(191,155,74,.18)!important;border:1.5px solid rgba(191,155,74,.35)!important;',
      'display:flex!important;align-items:center!important;justify-content:center!important;',
      'cursor:pointer!important;font-size:1.2rem!important;',
      'box-shadow:0 4px 14px rgba(0,0,0,.4)!important;transition:background .2s!important;}',
    '#sw23-fab:hover{background:rgba(191,155,74,.32)!important;}',
  ].join('');
  document.head.appendChild(s);
})();

/* ════════════════════════════════════════
   DATI
   ════════════════════════════════════════ */
var BG=[
  'linear-gradient(135deg,rgba(74,14,14,.95),rgba(30,4,4,.8))',
  'linear-gradient(135deg,rgba(4,40,74,.95),rgba(2,18,50,.8))',
  'linear-gradient(135deg,rgba(4,60,40,.95),rgba(2,32,22,.8))',
  'linear-gradient(135deg,rgba(60,40,4,.95),rgba(32,20,2,.8))',
  'linear-gradient(135deg,rgba(40,4,74,.95),rgba(20,2,45,.8))',
  'linear-gradient(135deg,rgba(60,10,50,.95),rgba(32,5,28,.8))',
];

var UNSPLASH=[
  'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80',
  'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=600&q=80',
  'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80',
  'https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?w=600&q=80',
  'https://images.unsplash.com/photo-1567529684892-09290a1b2d05?w=600&q=80',
  'https://images.unsplash.com/photo-1586370434639-0fe43b2d32e6?w=600&q=80',
];

var LOCAL=[
  {id:'l1',isNews:true,titolo_it:'Barolo 2019: annata storica, prezzi ancora accessibili',titolo_en:'Barolo 2019: historic vintage, still affordable',titolo_fr:'Barolo 2019 : millésime historique',categoria_it:'🍷 Annate',categoria_en:'🍷 Vintages',categoria_fr:'🍷 Millésimes',testo_it:'Il 2019 si sta rivelando la sorpresa più bella del decennio. Maturazione perfetta, acidità intatta, profumi di viola e rosa impressionanti già giovani.\n\nProduttori da seguire: Giacomo Conterno con Cascina Francia, Bartolo Mascarello, Giovanni Rosso nel Serralunga.\n\nFinestra d\'acquisto aperta: tra 3-5 anni sarà già inaccessibile come il 2016.',testo_en:'The 2019 vintage is revealing itself as the biggest surprise of the decade.',testo_fr:'Le 2019 se révèle la plus belle surprise de la décennie.',autore:'Timotin Niurie',data:'Aprile 2026',immagine:'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80'},
  {id:'l2',isNews:true,titolo_it:'Riesling del Mosel: perché i tedeschi valgono ogni euro',titolo_en:'Mosel Riesling: why German wines are worth every euro',titolo_fr:'Riesling de Moselle : pourquoi les allemands valent chaque euro',categoria_it:'🌍 Terroir',categoria_en:'🌍 Terroir',categoria_fr:'🌍 Terroir',testo_it:'L\'ardesia blu del Mosel è il suolo più straordinario del mondo per il Riesling. Trattiene il calore di giorno, lo rilascia di notte — il vino guadagna complessità senza perdere freschezza.\n\nEgon Müller, JJ Prüm, Clemens Busch: tre nomi che valgono un viaggio in Renania.\n\nEtichette da cercare: Spätlese e Auslese 2020-2021 che si trovano ancora a prezzi ragionevoli.',testo_en:'The blue slate of Mosel is the most extraordinary soil for Riesling.',testo_fr:'L\'ardoise bleue de Moselle est le sol le plus extraordinaire pour le Riesling.',autore:'Timotin Niurie',data:'Aprile 2026',immagine:'https://images.unsplash.com/photo-1586370434639-0fe43b2d32e6?w=600&q=80'},
  {id:'l3',isNews:false,titolo_it:'Etna, il vulcano che ha cambiato tutto',titolo_en:'Etna, the volcano that changed everything',titolo_fr:'Etna, le volcan qui a tout changé',categoria_it:'🌍 Vulcano',categoria_en:'🌍 Volcano',categoria_fr:'🌍 Volcan',testo_it:'Le 133 contrade dell\'Etna identificano vigneti centenari ad alberello su sabbie laviche tra 400 e 1000 metri.\n\nNerello Mascalese: rossi trasparenti, quasi borgognoni. Cornelissen, Terre Nere, Benanti, Passopisciaro.\n\nLa sfida è capire quale contrada comprare — Calderara Sottana, Feudo di Mezzo, Rampante hanno caratteri completamente diversi.',testo_en:'Etna\'s 133 contrade identify century-old vines on volcanic soils.',testo_fr:'Les 133 contrade de l\'Etna identifient des vignes centenaires sur sols volcaniques.',autore:'Timotin Niurie',data:'Marzo 2026',immagine:'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&q=80'},
  {id:'l4',isNews:false,titolo_it:'Champagne: la guida per scegliere bene',titolo_en:'Champagne: the guide to choosing wisely',titolo_fr:'Champagne : le guide pour bien choisir',categoria_it:'✨ Bollicine',categoria_en:'✨ Sparkling',categoria_fr:'✨ Bulles',testo_it:'Tra 300 produttori la chiave è capire tre cose: tipologia (NV, Vintage, Prestige), dosaggio (Brut Nature vs Extra Brut), e chi ha fatto il vino (RM ha solo uve proprie).\n\nI Recoltant Manipulant da conoscere: Selosse, Chartogne-Taillet, Bereche, Laherté-Frères.\n\nPrezzo e qualità: Gaston Chiquet e Dehours offrono complessità da 30 euro.',testo_en:'Among 300 producers the key is type, dosage and who made the wine.',testo_fr:'Parmi 300 producteurs, la clé est le type, le dosage et qui a fait le vin.',autore:'Timotin Niurie',data:'Marzo 2026',immagine:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'},
  {id:'l5',isNews:false,titolo_it:'Vino e formaggio: i 10 abbinamenti che funzionano sempre',titolo_en:'Wine and cheese: 10 pairings that always work',titolo_fr:'Vin et fromage : 10 accords qui marchent toujours',categoria_it:'🍽 Abbinamenti',categoria_en:'🍽 Pairings',categoria_fr:'🍽 Accords',testo_it:'La regola di base: concordanza di intensità. Un formaggio delicato vuole un vino leggero. Un erborinato potente vuole qualcosa di dolce.\n\nI 10 abbinamenti: Parmigiano + Lambrusco Metodo Classico, Gorgonzola + Sauternes, Stilton + Porto Vintage, Pecorino Romano + Vermentino, Brie + Champagne Blanc de Blancs.\n\nSegreto: evitare i vini tannici con i formaggi — i tannini si scontrano con le proteine.',testo_en:'The basic rule: concordance of intensity. A delicate cheese wants a light wine.',testo_fr:'La règle de base : concordance d\'intensité.',autore:'Timotin Niurie',data:'Febbraio 2026',immagine:'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80'},
];

var CUR=[
  {ico:'🌱',t:'Viticoltura',h:'Il Ciclo della Vite',b:'La vite percorre 4 stagioni: germogliamento (marzo), fioritura (giugno), invaiatura (agosto), vendemmia (settembre-ottobre). Un giorno di pioggia fuori tempo può cambiare tutto.',img:'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&q=70'},
  {ico:'🔪',t:'Sommelier',h:'Come Aprire una Bottiglia',b:'Il sommelier taglia la capsula sotto il secondo anello, inserisce la vite al centro del sughero, ruota 6 volte e solleva con movimento fluido. Il sughero deve uscire in silenzio.',img:'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=70'},
  {ico:'🥂',t:'Bicchieri',h:'Perché il Calice ha lo Stelo',b:'Lo stelo esiste per evitare che il calore della mano scaldi il vino. Per i rossi strutturati si regge dallo stelo. Per i vini da meditazione dalla coppa per scaldarli.',img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70'},
  {ico:'🌡️',t:'Servizio',h:'La Temperatura di Servizio',b:'Spumanti 6-8°C, bianchi leggeri 8-10°C, rosé 10-12°C, rossi leggeri 14-16°C, rossi strutturati 16-18°C. Mai oltre 18°C: l\'alcol copre tutto.',img:''},
  {ico:'🪨',t:'Terroir',h:'Il Calcare e la Mineralità',b:'Il calcare è il suolo del vino di qualità: drena bene, forza le radici in profondità, dona mineralità e freschezza. Borgogna, Champagne, Barolo, Chablis sono tutti su suoli calcarei.',img:'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=400&q=70'},
  {ico:'⚗️',t:'Enologia',h:'La Fermentazione Malolattica',b:'Trasforma l\'acido malico (aspro) in lattico (morbido). Nei rossi è quasi sempre completata; nei bianchi il produttore sceglie: completarla dà morbidezza, bloccarla conserva freschezza.',img:''},
  {ico:'🏺',t:'Storia',h:'8000 Anni di Vino',b:'I primi segni di vinificazione risalgono al 6000 a.C. in Georgia, dove si faceva fermentare l\'uva in anfore di argilla (kvevri) interrate nel terreno. Da qui nascono i vini arancioni.',img:''},
  {ico:'💧',t:'Degustazione',h:'Le Lacrime del Vino',b:'Le lacrime che scendono lungo il calice non indicano qualità ma alcol. Più sono marcate, più il vino è alcolico. Si formano per il diverso tasso di evaporazione tra alcol e acqua.',img:''},
  {ico:'🌊',t:'Terroir',h:'Il Vino e il Mare',b:'I vigneti vicino al mare producono vini sapidi e iodati. Vermentino sardo, Assyrtiko di Santorini, Muscadet: tutti mostrano quella mineralità marina inconfondibile.',img:'https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?w=400&q=70'},
  {ico:'🎭',t:'Storia',h:'Napoleone e il Chambertin',b:'Napoleone Bonaparte portava il Chambertin in ogni battaglia. Durante la campagna di Russia del 1812, quando rimase senza, attribuì parte dei fallimenti militari alla sua mancanza.',img:''},
  {ico:'🪵',t:'Enologia',h:'Rovere Francese vs Americano',b:'Rovere francese: grana fine, vaniglia e spezie eleganti. Rovere americano: grana larga, cocco e vaniglia intensa. I Rioja storici usano americano; i Barolo moderni preferiscono il francese.',img:''},
  {ico:'🏔️',t:'Viticoltura',h:'Altitudine e Acidità',b:'In quota le temperature notturne scendono e l\'escursione termica aumenta. Questo rallenta la maturazione e permette all\'uva di sviluppare zuccheri mantenendo l\'acidità.',img:'https://images.unsplash.com/photo-1567529684892-09290a1b2d05?w=400&q=70'},
  {ico:'🎨',t:'Degustazione',h:'Il Colore Racconta Tutto',b:'Un Barolo giovane è rubino con riflessi viola; a 10 anni granato; a 20 anni si tinge d\'arancio ai bordi. Nei bianchi l\'inverso: da paglierino verdognolo a dorato intenso.',img:''},
  {ico:'💎',t:'Mercato',h:'Il Vino più Costoso del Mondo',b:'La Romanée-Conti 1945 è stata venduta per 558.000 dollari per bottiglia nel 2018. Probabilmente non è mai stata aperta. Il vino da collezione diventa un\'opera d\'arte.',img:''},
  {ico:'👃',t:'Degustazione',h:'Come si Annusa il Vino',b:'Prima annusata a naso fermo: aromi primari (frutta, fiori). Poi ruota il calice e annusa subito dopo: aromi secondari e terziari (cuoio, tabacco, terra). Il naso racconta l\'80% del vino.',img:''},
  {ico:'🌿',t:'Viticoltura',h:'La Potatura Invernale',b:'La potatura è il gesto più importante dell\'anno in vigna. Si esegue da dicembre a febbraio. Ogni tralcio tagliato è una scelta: quanti grappoli, quanto concentrata sarà l\'uva.',img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70'},
  {ico:'🧪',t:'Enologia',h:'I Solfiti nel Vino',b:'I solfiti sono conservanti naturali usati dai Romani. Tutti i vini ne contengono in piccole quantità. Non causano il mal di testa: è l\'alcol che lo provoca.',img:''},
  {ico:'🏛️',t:'Storia',h:'Il Symposium Greco',b:'Nell\'antica Grecia il simposio era una cerimonia del vino. Si beveva sempre diluito (3 parti acqua, 1 vino). Bere vino puro era considerato barbaro.',img:''},
  {ico:'✨',t:'Sommelier',h:'L\'Esame AIS',b:'Per diventare Sommelier AIS ci vogliono 3 livelli: storia e geografia del vino, abbinamento cibo-vino, degustazione professionale. L\'esame finale include una degustazione alla cieca di 3 vini.',img:'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=70'},
  {ico:'🌺',t:'Degustazione',h:'Il Vino e i 5 Sensi',b:'Vista: colore e limpidezza. Olfatto: prima e dopo la rotazione. Tatto: morbidezza e astringenza. Gusto: dolce, acido, amaro, sapido. Udito: il suono del tappo.',img:''},
  {ico:'🌙',t:'Viticoltura',h:'La Viticoltura Biodinamica',b:'Il calendario biodinamico divide i giorni in: Radice (vinificazione), Fiore (bianchi), Frutto (rossi), Foglia (vino chiuso). Rudolf Steiner ha codificato questo sistema negli anni 20.',img:''},
  {ico:'🦟',t:'Storia',h:'La Fillossera che Cambiò Tutto',b:'Tra 1863 e 1900 la fillossera distrusse il 90% dei vigneti europei. La soluzione: innestare le viti europee su radici americane resistenti. Quasi tutte le viti del mondo sono ancora così.',img:''},
  {ico:'🎯',t:'Degustazione',h:'Il Retronaso',b:'Il retronaso è la sensazione olfattiva che sentiamo mentre beviamo, attraverso la via retronasale. È qui che percepiamo davvero il sapore del vino — non nella bocca, ma nel naso.',img:''},
  {ico:'🔑',t:'Sommelier',h:'Il Tastevin',b:'Il piccolo disco d\'argento che i sommelier portano al collo era usato nelle cantine buie per valutare il colore del vino alla luce di una candela. Oggi è un simbolo onorifico.',img:''},
  {ico:'🐝',t:'Viticoltura',h:'La Biodiversità in Vigna',b:'Api, lombrichi, lucertole, ragni: ogni essere vivente contribuisce all\'equilibrio. In un ettaro di vigna sana vivono più di 1 milione di organismi diversi.',img:'https://images.unsplash.com/photo-1474722883778,792e7990302f?w=400&q=70'},
  {ico:'📐',t:'Servizio',h:'Quanto Vino Versare',b:'La regola professionale: mai oltre un terzo del calice. Un Borgogna grande si versa per un quarto. Il vino deve respirare nel calice per sprigionare gli aromi.',img:''},
  {ico:'🗺️',t:'Denominazioni',h:'La Classificazione del 1855',b:'Nel 1855 Napoleone III chiese di classificare i migliori Bordeaux. Nacquero i Premiers Crus: Lafite, Latour, Margaux, Haut-Brion. Solo nel 1973 fu aggiunto Mouton Rothschild.',img:''},
  {ico:'🌬️',t:'Viticoltura',h:'Il Vento in Vigna',b:'Il vento è il primo alleato contro le malattie fungine: asciuga il grappolo dopo la pioggia. Il Mistral, il Maestrale, il Tramontano permettono meno trattamenti chimici.',img:''},
  {ico:'🎻',t:'Storia',h:'Dom Perignon e il Mito',b:'Dom Pérignon non ha inventato lo Champagne. Il monaco cercava di ELIMINARE le bollicine, che rompevano le bottiglie. A inventare il metodo classico furono gli inglesi.',img:''},
  {ico:'🎪',t:'Denominazioni',h:'DOCG: Solo 77 in Italia',b:'La DOCG è il livello massimo italiano. Esistono solo 77 DOCG. La prima fu assegnata nel 1980 a Barolo, Barbaresco, Brunello di Montalcino e Albana di Romagna.',img:''},
];

function getLang(){return (window.i18n&&window.i18n.current)||localStorage.getItem('sw_lang')||'it';}
function tf(a,f){var l=getLang();return a[f+'_'+l]||a[f+'_it']||a[f]||'';}
function getElite(){
  try{return JSON.parse(localStorage.getItem('sw_elite_producers')||'[]')
    .filter(function(p){return p.nome&&p.descrizione;})
    .map(function(p,i){return{id:'e'+i,isElite:true,
      titolo_it:'👑 '+p.nome,titolo_en:'👑 '+p.nome,titolo_fr:'👑 '+p.nome,
      categoria_it:'👑 Elite',testo_it:p.descrizione,
      autore:p.nome,data:p.data||'',immagine:p.immagine||UNSPLASH[i%UNSPLASH.length],
      producer:p};});}catch(e){return[];}
}

/* REGIONI COMPLETE per updateRegioni */
var REGIONI={
  'Italia':['Piemonte','Toscana','Veneto','Sicilia','Campania','Friuli-Venezia Giulia','Alto Adige','Sardegna','Umbria','Marche','Lombardia','Abruzzo','Puglia','Trentino','Lazio','Calabria','Basilicata','Emilia-Romagna','Liguria','Valle d\'Aosta'],
  'Francia':['Borgogna','Bordeaux','Rodano','Alsazia','Champagne','Loira','Languedoc-Roussillon','Provenza','Beaujolais','Jura','Savoia','Sud-Ovest','Corsica'],
  'Spagna':['Rioja','Ribera del Duero','Priorat','Rías Baixas','Jerez','Toro','Penedès','Bierzo','Jumilla','Navarra','Cava','Rueda'],
  'USA':['Napa Valley','Sonoma','Willamette Valley (Oregon)','Paso Robles','Santa Barbara','Columbia Valley (Washington)','Finger Lakes (New York)'],
  'Germania':['Mosel','Rheingau','Pfalz','Baden','Rheinhessen','Nahe','Franken','Württemberg','Ahr'],
  'Portogallo':['Douro','Alentejo','Vinho Verde','Dão','Bairrada','Lisboa','Madeira'],
  'Argentina':['Mendoza','Salta','Patagonia','La Rioja','San Juan'],
  'Cile':['Maipo','Colchagua','Casablanca','Elqui','Bío-Bío','Leyda','Uco Valley'],
  'Australia':['Barossa Valley','McLaren Vale','Clare Valley','Yarra Valley','Hunter Valley','Margaret River','Eden Valley'],
  'Nuova Zelanda':['Marlborough','Central Otago','Hawke\'s Bay','Martinborough','Nelson'],
  'Grecia':['Santorini','Naoussa','Nemea','Creta','Samos'],
  'Austria':['Wachau','Kamptal','Kremstal','Burgenland','Steiermark','Wien'],
  'Ungheria':['Tokaj','Eger','Villány','Szekszárd'],
  'Georgia':['Kakheti','Kartli','Imereti'],
  'Sud Africa':['Stellenbosch','Swartland','Franschhoek','Walker Bay','Constantia'],
};

/* ════════════════════════════════════════
   FIX 1: SOMMELIER — PAESE OBBLIGATORIO
   ════════════════════════════════════════ */
function fixSommelier(){
  /* Sovrascrive updateRegioni con versione corretta */
  window.updateRegioni=function(){
    var paese=(document.getElementById('winePaese')||{}).value||'';
    var sel=document.getElementById('wineRegione');
    if(!sel)return;
    sel.innerHTML='<option value="">Qualsiasi regione</option>';
    (REGIONI[paese]||[]).forEach(function(r){
      var o=document.createElement('option');o.value=r;o.textContent=r;sel.appendChild(o);
    });
    sel.disabled=!paese;
  };
  var ps=document.getElementById('winePaese');
  if(ps){ps.onchange=window.updateRegioni;if(ps.value)window.updateRegioni();}

  /* Sovrascrive doAbbinamento con versione che impone il paese nel prompt */
  var origAbbin=window.doAbbinamento;
  window.doAbbinamento=async function(){
    var menu=(document.getElementById('menuText')||{}).value||'';
    if(!menu&&!window._photoB64){alert('Inserisci il menu o fotografalo.');return;}
    var budget=(document.getElementById('budget')||{}).value||'50';
    var paese=(document.getElementById('winePaese')||{}).value||'';
    var regione=(document.getElementById('wineRegione')||{}).value||'';
    var prefs=Array.from(document.querySelectorAll('#prefPills .on')).map(function(b){return b.textContent;}).join(', ');

    /* Costruisce vincolo paese ULTRA FORTE */
    var vincolo='';
    if(paese){
      vincolo='\n\n🔴 VINCOLO GEOGRAFICO ASSOLUTO E INDEROGABILE: '+
        'L\'utente ha selezionato il paese "'+paese+'"'+(regione?' e la regione "'+regione+'"':'')+'. '+
        'DEVI consigliare ESCLUSIVAMENTE vini prodotti in '+paese+
        (regione?' nella regione '+regione:'')+'. '+
        'È VIETATO consigliare vini italiani, francesi o di qualsiasi altro paese diverso da '+paese+'. '+
        'Anche se il piatto è tipicamente abbinato a vini di un altro paese, DEVI trovare il miglior vino di '+paese+' per quel piatto. '+
        'ESEMPIO: se il paese è Germania e il piatto è bistecca, consiglia un Spätburgunder (Pinot Nero) dell\'Ahr o un Lemberger del Württemberg, non un Barolo.';
    }

    var profileStr='\n\nPROFILO ORGANOLETTICO:';
    try{
      var params=window.getWineParams?window.getWineParams():{};
      profileStr+='\n• Acidità: '+(params.acidita||'Media');
      profileStr+='\n• Morbidezza: '+(params.morbidezza||'Equilibrata');
      profileStr+='\n• Sapidità: '+(params.sapidita||'Media');
      profileStr+='\n• Struttura: '+(params.struttura||'Media');
    }catch(e){}

    document.getElementById('somLoad').style.display='block';
    document.getElementById('somResult').style.display='none';

    try{
      var text=await window.callAPI(
        window.SOM_SYS||'Sei un Master Sommelier AIS.',
        'Menu:\n'+menu+'\nBudget: €'+budget+vincolo+profileStr+(prefs?'\nPreferenze: '+prefs:''),
        window._photoB64||null,
        window._photoMime||null
      );
      document.getElementById('somLoad').style.display='none';
      document.getElementById('somResult').innerHTML=window.renderSomResult?window.renderSomResult(text):text;
      document.getElementById('somResult').style.display='block';
    }catch(e){
      document.getElementById('somLoad').style.display='none';
      document.getElementById('somResult').innerHTML='<p style="color:#f99">Errore. Verifica la API Key.</p>';
      document.getElementById('somResult').style.display='block';
    }
  };
  console.log('[v23] Sommelier fixato — paese OBBLIGATORIO ✓');
}

/* ════════════════════════════════════════
   TICKER nella Gazzetta
   ════════════════════════════════════════ */
function buildTicker(){
  var hero=document.getElementById('heroSection');
  if(!hero)return;
  var old=document.getElementById('sw23-tick');if(old)old.remove();
  var arts=_arts.length?_arts:LOCAL;

  var bar=document.createElement('div');bar.id='sw23-tick';
  var inner=document.createElement('div');inner.id='sw23-tick-t';

  function makeBatch(list){
    var f=document.createDocumentFragment();
    var lbl=document.createElement('span');lbl.className='sw23-ti-lbl';
    lbl.innerHTML='🍷&nbsp;&nbsp;LA GAZZETTA DEL TERROIR';f.appendChild(lbl);
    list.forEach(function(art){
      var tit=tf(art,'titolo')||art.titolo||'';if(!tit)return;
      var s=document.createElement('span');
      s.className='sw23-ti'+(art.isNews?' sw23-ti-news':'');
      var d=document.createElement('span');d.className='sw23-ti-d'+(art.isNews?' sw23-ti-dn':'');
      s.appendChild(d);s.appendChild(document.createTextNode(tit));
      s.onclick=(function(a){return function(e){e.stopPropagation();openReader(a,0);};})(art);
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
   FIX 2: SLIDESHOW AUTO (non carosello)
   ════════════════════════════════════════ */
function injectSlideshow(){
  if(document.getElementById('sw23-slide-wrap'))return;
  document.querySelectorAll('.news-section-head,#newsContainer,#defaultHero').forEach(function(el){
    el.style.setProperty('display','none','important');
  });

  var wrap=document.createElement('div');
  wrap.id='sw23-slide-wrap';
  wrap.innerHTML=
    '<div id="sw23-slide-head">'+
      '<div style="display:flex;align-items:center;gap:8px;">'+
        '<span class="news-live-dot"></span>'+
        '<span style="font-family:Cinzel,serif;font-size:.55rem;letter-spacing:4px;color:var(--oro,#BF9B4A);">WINE NEWS &amp; MAGAZINE</span>'+
      '</div>'+
      '<span id="sw23-slide-cnt" style="font-size:10px;color:rgba(245,239,226,.3);">…</span>'+
    '</div>'+
    '<div id="sw23-slide"></div>'+
    '<div id="sw23-slide-dots"></div>';

  var hb=document.querySelector('#page-home .home-body');
  if(hb)hb.insertBefore(wrap,hb.firstChild);
}

function renderSlideshow(){
  var c=document.getElementById('sw23-slide');
  var dots=document.getElementById('sw23-slide-dots');
  var cnt=document.getElementById('sw23-slide-cnt');
  if(!c||!dots)return;

  var arts=(_arts.length?_arts:LOCAL).slice(0,8);
  if(cnt)cnt.textContent=arts.length+' articoli';

  c.innerHTML='';dots.innerHTML='';
  arts.forEach(function(art,i){
    var tit=tf(art,'titolo')||art.titolo||'';
    var cat=tf(art,'categoria')||art.categoria||'';
    var txt=tf(art,'testo')||art.testo||'';
    var img=art.immagine||UNSPLASH[i%UNSPLASH.length];
    var bg=BG[i%BG.length];

    var card=document.createElement('div');
    card.className='sw23-slide-card'+(i===0?' active':'');
    card.innerHTML=
      (art.isNews?'<div class="sw23-slide-nb">🗞 NOTIZIA</div>':'')+
      '<div style="width:140px;flex-shrink:0;background:'+bg+';display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;">'+
        '<img class="sw23-slide-img" src="'+img+'" loading="lazy" alt="" onerror="this.parentNode.style.background=\''+bg+'\'">'+
      '</div>'+
      '<div class="sw23-slide-body">'+
        '<div>'+
          '<div class="sw23-slide-cat">'+cat+'</div>'+
          '<div class="sw23-slide-tit">'+tit+'</div>'+
          '<div class="sw23-slide-txt">'+txt.replace(/\n\n/g,' ').substring(0,200)+'</div>'+
        '</div>'+
        '<div class="sw23-slide-meta">'+
          (art.data?'<span>'+art.data+'</span>':'')+
          (art.autore?'<span>· '+art.autore+'</span>':'')+
          (art.generato_ai?'<span class="sw23-slide-ai">✦ AI</span>':'')+
        '</div>'+
      '</div>';
    card.onclick=(function(a,idx){return function(){openReader(a,idx);};})(art,i);
    c.appendChild(card);

    var dot=document.createElement('div');
    dot.className='sw23-dot'+(i===0?' on':'');
    dot.onclick=(function(idx){return function(){goSlide(idx);};})(i);
    dots.appendChild(dot);
  });

  /* Auto-avanza ogni 5 secondi */
  if(_slideTimer)clearInterval(_slideTimer);
  _slideIdx=0;
  _slideTimer=setInterval(function(){
    _slideIdx=(_slideIdx+1)%(arts.length);
    goSlide(_slideIdx);
  },5000);
}

function goSlide(idx){
  var cards=document.querySelectorAll('.sw23-slide-card');
  var dots2=document.querySelectorAll('.sw23-dot');
  cards.forEach(function(c){c.classList.remove('active');});
  dots2.forEach(function(d){d.classList.remove('on');});
  if(cards[idx])cards[idx].classList.add('active');
  if(dots2[idx])dots2[idx].classList.add('on');
  _slideIdx=idx;
}

/* ════════════════════════════════════════
   FIX 3: 3 ARTICOLI FISSI AI (cambiano ogni giorno)
   ════════════════════════════════════════ */
var _3artTopics=[
  {cat:'🌿 Viticoltura',ico:'🌿',img:'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&q=80'},
  {cat:'🎓 Sommelier',ico:'🎓',img:'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80'},
  {cat:'🍇 Vitigni',ico:'🍇',img:'https://images.unsplash.com/photo-1567529684892-09290a1b2d05?w=600&q=80'},
];

var _3artTexts=[
  /* Viticoltura — 10 testi che ruotano */
  ['La potatura a Guyot è il sistema più diffuso in Borgogna: un solo tralcio principale piegato orizzontalmente, gemme contate. Ogni gemma è un grappolo potenziale — il vignaiolo decide quanti.',
   'La vendemmia in verde consiste nel tagliare grappoli acerbi a luglio per concentrare i nutrienti sui grappoli rimasti. Una perdita programmata di quantità per guadagnare qualità.',
   'Il diradamento fogliare espone il grappolo al sole e all\'aria. Troppo sole brucia le uve; troppa ombra rallenta la maturazione. Il vignaiolo cammina ogni filare e decide lato per lato.',
   'Il sistema ad alberello siciliano e greco alleva la vite bassa, vicina al suolo, che riflette il calore di notte. Resiste alla siccità e al vento — è la forma ancestrale della viticoltura mediterranea.',
   'La cover crop (inerbimento) tra i filari ospita insetti benefici e contrasta l\'erosione. I vignaioli biodinamici scelgono le piante con cura: alcune fissano azoto, altre attraggono api.'],
  /* Sommelier */
  ['Il servizio del vino inizia dalla temperatura: un Barolo troppo caldo (oltre 18°C) perde aromaticità e sembra alcolico. Il consiglio pratico: toglierlo dal caldo 30 minuti prima, non dal frigo.',
   'La decantazione serve per due ragioni: eliminare i sedimenti dai vini vecchi, e ossigenare i vini giovani tannici. Un Barolo giovane beneficia di 2-3 ore di decantazione. Un Amarone ne vuole anche 4.',
   'Il rigetto di una bottiglia è un diritto. Il sommelier deve aprire e odorare il tappo: se puzza di cantina umida (TCA), la bottiglia è difettata. Il ristorante è obbligato a cambiarla.',
   'L\'abbinamento per concordanza cerca similitudini: un piatto delicato vuole un vino delicato. L\'abbinamento per contrasto cerca equilibrio: un piatto grasso vuole un vino acido o frizzante che lo pulisce.',
   'Il calice a tulipano concentra gli aromi verso il naso. Un calice troppo largo li disperde; uno troppo chiuso li soffoca. La forma influenza davvero la percezione del vino.'],
  /* Vitigni */
  ['Il Nebbiolo è il vitigno più difficile d\'Italia: matura tardissimo (ottobre), ama i suoli calcarei, esprime terroir con precisione chirurgica. A Barolo è austero; a Barbaresco più elegante; a Gattinara quasi borgognone.',
   'Il Riesling è il vitigno più longevo del mondo: una bottiglia di Trockenbeerenauslese del Mosel può invecchiare 100 anni. L\'ardesia del Mosel dona idrocarburi e una mineralità che non si trova altrove.',
   'Il Sangiovese ha cloni diversissimi: il Brunello di Montalcino è il clone Grosso, longevo e austero. Il Chianti usa il Piccolo, più fruttato e accessibile. Lo stesso vitigno, due caratteri opposti.',
   'Il Grenache (Garnacha in Spagna) è il vitigno più coltivato al mondo — è la base di Châteauneuf-du-Pape, Priorat, e di molti rosati provenzali. Dà struttura alcolica ma poca tannicità.',
   'La Malvasia è in realtà una famiglia di vitigni diversi, non uno solo. La Malvasia di Candia è aromatica; la Malvasia Istriana è neutra e sapida; la Malmsey di Madeira è l\'uva del grande vino ossidativo.'],
];

function inject3Art(){
  if(document.getElementById('sw23-3art'))return;
  var footer=document.querySelector('footer');if(!footer)return;
  var sec=document.createElement('div');
  sec.id='sw23-3art';
  sec.innerHTML=
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 14px 10px;">'+
      '<div style="display:flex;align-items:center;gap:8px;">'+
        '<span style="font-size:.9rem;">📖</span>'+
        '<span style="font-family:Cinzel,serif;font-size:.55rem;letter-spacing:4px;color:var(--vino,#8B0000);">IL SAPERE DEL VINO</span>'+
      '</div>'+
      '<span id="sw23-3date" style="font-size:10px;color:rgba(245,239,226,.2);"></span>'+
    '</div>';
  footer.parentNode.insertBefore(sec,footer);
  render3Art();
}

function render3Art(){
  var sec=document.getElementById('sw23-3art');if(!sec)return;
  var d=document.getElementById('sw23-3date');
  var today=new Date();
  if(d)d.textContent=today.toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long'});

  /* Indice basato sul giorno dell'anno → 3 testi diversi ogni giorno */
  var dayOfYear=Math.floor((today-new Date(today.getFullYear(),0,0))/86400000);

  /* Rimuove card precedenti */
  sec.querySelectorAll('.sw23-art-card').forEach(function(el){el.remove();});

  _3artTopics.forEach(function(topic,ti){
    var texts=_3artTexts[ti];
    var txt=texts[(dayOfYear+ti)%texts.length];

    /* Titoli rotativi per categoria */
    var titlesVit=['Come si Alleva la Vite','Il Lavoro in Vigna','La Vendemmia: Quando e Come','Potatura e Qualità','La Vigna in Inverno'];
    var titlesSom=['La Temperatura di Servizio','Come Decanare un Vino','Il Rigetto della Bottiglia','L\'Arte dell\'Abbinamento','Il Calice Giusto'];
    var titlesVig=['Il Nebbiolo: Vitigno dei Re','Il Riesling: il più Longevo','Il Sangiovese e i suoi Cloni','Il Grenache: il più Diffuso','La Famiglia Malvasia'];
    var allTitles=[titlesVit,titlesSom,titlesVig];
    var tit=allTitles[ti][(dayOfYear+ti)%allTitles[ti].length];

    var card=document.createElement('div');
    card.className='sw23-art-card';
    card.innerHTML=
      '<img class="sw23-art-img" src="'+topic.img+'" loading="lazy" alt="" onerror="this.style.display=\'none\'">'+
      '<div class="sw23-art-body">'+
        '<div class="sw23-art-tag">'+topic.cat+'</div>'+
        '<div class="sw23-art-tit">'+tit+'</div>'+
        '<div class="sw23-art-txt">'+txt+'</div>'+
      '</div>';
    card.onclick=(function(t,tx,ti2){return function(){
      openReader({titolo:t,categoria:topic.cat,testo:tx,autore:'Sommelier World',
        data:today.toLocaleDateString('it-IT'),immagine:topic.img},ti2);
    };})(tit,txt,ti);
    sec.appendChild(card);
  });
}

/* ════════════════════════════════════════
   FIX 4: DENOMINAZIONI — ri-triggera v6
   ════════════════════════════════════════ */
function fixDenominazioni(){
  /* Se la pagina explore è vuota, ri-esegue l'iniezione di v6 */
  var page=document.getElementById('page-explore');
  if(!page)return;
  if(document.getElementById('sw10-winedb'))return;

  /* Aspetta che sw-patch-v6 sia caricato */
  var attempts=0;
  var check=setInterval(function(){
    attempts++;
    /* Cerca di triggerare la funzione di iniezione di v6 */
    if(typeof window.injectWineDB==='function'){window.injectWineDB();clearInterval(check);return;}
    /* In alternativa, simula il click sulla pagina explore per forzare il render */
    var exploreBtn=document.querySelector('.ntab[data-page="explore"]');
    if(exploreBtn&&!document.getElementById('sw10-winedb')){
      if(attempts>5){
        /* Forzatura diretta: re-esegue v6 */
        var s6=document.querySelector('script[src*="sw-patch-v6"]');
        if(s6){var n=document.createElement('script');n.src=s6.src+'?v='+Date.now();document.head.appendChild(n);}
        clearInterval(check);
      }
    }else{clearInterval(check);}
    if(attempts>10)clearInterval(check);
  },400);
}

/* ════════════════════════════════════════
   READER
   ════════════════════════════════════════ */
function openReader(art,idx){
  var tit=tf(art,'titolo')||art.titolo||'';
  var cat=tf(art,'categoria')||art.categoria||'';
  var txt=tf(art,'testo')||art.testo||'';
  var bg=BG[(idx||0)%BG.length];
  var img=art.immagine||UNSPLASH[(idx||0)%UNSPLASH.length];
  var paras=(txt||'').split(/\n\n+/).filter(Boolean)
    .map(function(p){return'<p style="margin:0 0 18px;line-height:2;">'+p.trim()+'</p>';}).join('');

  var r=document.getElementById('sw23-reader');
  if(!r){r=document.createElement('div');r.id='sw23-reader';document.body.appendChild(r);}
  r.innerHTML=
    '<div style="position:sticky;top:0;z-index:2;background:rgba(10,7,5,.97);backdrop-filter:blur(12px);'+
      'border-bottom:1px solid rgba(191,155,74,.12);display:flex;align-items:center;gap:12px;padding:12px 16px;">'+
      '<button onclick="SW23.closeReader()" style="width:36px;height:36px;border-radius:50%;background:rgba(191,155,74,.1);'+
        'border:1px solid rgba(191,155,74,.2);color:#BF9B4A;font-size:18px;cursor:pointer;'+
        'display:flex;align-items:center;justify-content:center;">←</button>'+
      '<div style="font-family:Cinzel,serif;font-size:.58rem;letter-spacing:2px;color:rgba(191,155,74,.6);'+
        'flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+tit+'</div>'+
    '</div>'+
    '<div style="max-width:720px;margin:0 auto;padding-bottom:80px;">'+
      '<div style="width:100%;height:200px;background:'+bg+';display:flex;align-items:center;'+
        'justify-content:center;font-size:3.5rem;position:relative;overflow:hidden;">'+
        '<img src="'+img+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" alt="" onerror="this.style.display=\'none\'">'+
        '<span style="position:relative;z-index:1;filter:drop-shadow(0 2px 12px rgba(0,0,0,.9));">🍷</span>'+
      '</div>'+
      '<div style="padding:22px 20px 0;">'+
        '<div style="font-size:9px;font-weight:700;letter-spacing:3px;color:rgba(191,155,74,.5);text-transform:uppercase;margin-bottom:10px;">'+cat+'</div>'+
        '<h1 style="font-family:\'Playfair Display\',Georgia,serif;font-size:1.5rem;font-weight:700;line-height:1.25;color:#F5EFE2;margin:0 0 14px;">'+tit+'</h1>'+
        '<div style="font-size:11px;color:rgba(245,239,226,.35);margin-bottom:22px;padding-bottom:14px;'+
          'border-bottom:1px solid rgba(191,155,74,.1);display:flex;gap:8px;flex-wrap:wrap;align-items:center;">'+
          (art.data?'<span>'+art.data+'</span>':'')+
          (art.autore?'<span>·</span><span>'+art.autore+'</span>':'')+
          (art.generato_ai?'<span style="background:rgba(125,218,138,.12);color:rgba(125,218,138,.7);font-size:9px;padding:2px 7px;border-radius:3px;">✦ AI</span>':'')+
        '</div>'+
        '<div style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:1.05rem;color:rgba(245,239,226,.85);">'+
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

/* ════════════════════════════════════════
   CURIOSITÀ — SOLO HOME
   ════════════════════════════════════════ */
function injectCuriosity(){
  if(document.getElementById('sw23-cur'))return;
  var footer=document.querySelector('footer');if(!footer)return;
  var sec=document.createElement('div');sec.id='sw23-cur';
  sec.innerHTML=
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 14px 10px;">'+
      '<div style="display:flex;align-items:center;gap:8px;">'+
        '<span style="font-size:.9rem;">🎓</span>'+
        '<span style="font-family:Cinzel,serif;font-size:.55rem;letter-spacing:4px;color:rgba(191,155,74,.55);">CURIOSITÀ DEL GIORNO</span>'+
      '</div>'+
    '</div>'+
    '<div id="sw23-cur-s"></div>';
  footer.parentNode.insertBefore(sec,footer);
  renderCuriosity();
}

function renderCuriosity(){
  var c=document.getElementById('sw23-cur-s');if(!c)return;
  var dayN=Math.floor(Date.now()/86400000);
  var shown=[];for(var i=0;i<8;i++)shown.push(CUR[(dayN+i)%CUR.length]);
  c.innerHTML='';
  shown.forEach(function(cur,i){
    var card=document.createElement('div');card.className='sw23-cc';
    card.style.background=BG[i%BG.length];
    card.innerHTML=
      '<div class="sw23-cc-body">'+
        (cur.img?'<div style="width:calc(100%+24px);margin:-13px -12px 10px;height:70px;overflow:hidden;">'+
          '<img src="'+cur.img+'" style="width:100%;height:70px;object-fit:cover;display:block;" loading="lazy" onerror="this.parentNode.style.display=\'none\'">'+
        '</div>':'')+
        '<div style="font-size:1.3rem;margin-bottom:4px;">'+cur.ico+'</div>'+
        '<div style="font-size:7px;font-weight:700;letter-spacing:2px;color:rgba(191,155,74,.5);text-transform:uppercase;margin-bottom:4px;">'+cur.t+'</div>'+
        '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:.8rem;font-weight:700;color:#F5EFE2;line-height:1.3;margin-bottom:5px;">'+cur.h+'</div>'+
        '<div style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:.77rem;line-height:1.6;color:rgba(245,239,226,.6);">'+cur.b.substring(0,100)+'…</div>'+
      '</div>';
    card.onclick=(function(cur,i){return function(){
      openReader({titolo:cur.h,categoria:'🎓 '+cur.t,testo:cur.b,
        autore:'Sommelier World',data:new Date().toLocaleDateString('it-IT'),immagine:cur.img||''},i);
    };})(cur,i);
    c.appendChild(card);
  });
}

function checkVisibility(){
  var isHome=!!(document.querySelector('#page-home.active')||document.querySelector('#page-home[style*="block"]'));
  ['sw23-3art','sw23-cur','sw23-slide-wrap'].forEach(function(id){
    var el=document.getElementById(id);
    if(el)el.style.setProperty('display',isHome?'':'none','important');
  });
}

function hookShowPage(){
  if(window.__sw23h)return;
  var orig=window.showPage;
  if(!orig){setTimeout(hookShowPage,400);return;}
  window.showPage=function(pid){
    orig.call(this,pid);
    setTimeout(checkVisibility,60);
    if(pid==='explore')setTimeout(fixDenominazioni,300);
    if(pid==='home')setTimeout(buildTicker,120);
  };
  document.querySelectorAll('.ntab').forEach(function(t){
    t.addEventListener('click',function(){setTimeout(checkVisibility,100);},true);
  });
  window.__sw23h=true;
}

/* ════════════════════════════════════════
   FAB EMAIL + CONTATTI
   ════════════════════════════════════════ */
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
        '<div style="font-size:9px;font-weight:700;letter-spacing:3px;color:rgba(191,155,74,.5);text-transform:uppercase;margin-bottom:8px;">✉️ SCRIVICI</div>'+
        '<h2 style="font-family:\'Playfair Display\',serif;font-size:1.4rem;font-weight:700;color:#F5EFE2;margin:0 0 6px;">Come possiamo aiutarti?</h2>'+
        '<p style="font-size:12px;color:rgba(245,239,226,.4);line-height:1.7;margin:0;">Produttori, collaborazioni, segnalazioni.</p>'+
      '</div>'+
      '<div id="sw23-cok" style="display:none;text-align:center;padding:20px;background:rgba(125,218,138,.08);border:1px solid rgba(125,218,138,.2);border-radius:10px;margin-bottom:16px;">'+
        '<div style="font-size:1.8rem;margin-bottom:6px;">✓</div><div style="font-family:\'Playfair Display\',serif;color:#7dda8a;">Messaggio inviato!</div>'+
      '</div>'+
      '<div id="sw23-cfrm">'+
        '<div style="margin-bottom:14px;"><label class="sw23-lbl2">NOME *</label><input id="sw23-cn" class="sw23-inp" type="text" placeholder="Il tuo nome"></div>'+
        '<div style="margin-bottom:14px;"><label class="sw23-lbl2">EMAIL *</label><input id="sw23-ce" class="sw23-inp" type="email" placeholder="tua@email.com"></div>'+
        '<div style="margin-bottom:14px;"><label class="sw23-lbl2">MESSAGGIO *</label><textarea id="sw23-cm" class="sw23-inp" style="height:100px;resize:none;" placeholder="Scrivi qui..."></textarea></div>'+
        '<button onclick="SW23.sendMsg()" id="sw23-cbtn" class="sw23-btn">✦ INVIA MESSAGGIO ✦</button>'+
        '<div id="sw23-cerr" style="display:none;margin-top:8px;padding:10px;background:rgba(220,50,50,.15);border:1px solid rgba(220,50,50,.3);border-radius:6px;font-size:12px;color:rgba(255,150,150,.9);text-align:center;"></div>'+
      '</div>'+
      '<div style="margin:22px 0;border-top:1px solid rgba(191,155,74,.1);position:relative;"><span style="position:absolute;top:-9px;left:50%;transform:translateX(-50%);background:#0A0705;padding:0 12px;font-size:9px;font-weight:700;letter-spacing:3px;color:rgba(191,155,74,.3);">NEWSLETTER</span></div>'+
      '<div style="display:flex;gap:10px;">'+
        '<input id="sw23-nle" class="sw23-inp" type="email" placeholder="la.tua@email.com" style="flex:1;">'+
        '<button onclick="SW23.subscribe()" style="padding:11px 14px;background:rgba(191,155,74,.18);border:1.5px solid rgba(191,155,74,.4);border-radius:8px;color:#BF9B4A;font-family:Cinzel,serif;font-size:.5rem;font-weight:700;cursor:pointer;">ISCRIVITI</button>'+
      '</div>'+
      '<div style="text-align:center;margin-top:18px;"><a href="mailto:info@sommelierworld.vin" style="color:rgba(191,155,74,.6);font-size:13px;text-decoration:none;">info@sommelierworld.vin</a></div>'+
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
    var err=document.getElementById('sw23-cerr'),btn=document.getElementById('sw23-cbtn');
    n=n.trim();e=e.trim();m=m.trim();
    function se(t){if(err){err.textContent=t;err.style.display='block';}}
    if(!n)return se('Inserisci il nome.');if(!e||!e.includes('@'))return se('Email non valida.');
    if(m.length<4)return se('Messaggio troppo corto.');if(err)err.style.display='none';
    if(btn){btn.disabled=true;btn.textContent='⏳ Invio...';}
    var sent=false;
    try{var ctrl=new AbortController();setTimeout(function(){ctrl.abort();},8000);
      var r=await fetch(SRV+'/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name:n,email:e,subject:'Messaggio',message:m}),signal:ctrl.signal});
      if(r.ok){var d=await r.json();sent=!!d.ok;}
    }catch(ex){}
    if(!sent)window.location.href='mailto:info@sommelierworld.vin?subject=[SW]&body='+encodeURIComponent('Da: '+n+'\nEmail: '+e+'\n\n'+m);
    var frm=document.getElementById('sw23-cfrm'),ok=document.getElementById('sw23-cok');
    if(frm)frm.style.display='none';if(ok)ok.style.display='block';
    if(btn){btn.disabled=false;btn.textContent='✦ INVIA MESSAGGIO ✦';}
  },
  subscribe:async function(){
    var email=(document.getElementById('sw23-nle')||{}).value||'';email=email.trim();
    if(!email||!email.includes('@'))return;
    try{var sl=JSON.parse(localStorage.getItem('sw_nl')||'[]');if(!sl.includes(email)){sl.push(email);localStorage.setItem('sw_nl',JSON.stringify(sl));}}catch(ex){}
    try{await fetch(SRV+'/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Newsletter',email:email,subject:'Newsletter',message:'Iscrizione'})});}catch(ex){}
    var nl=document.getElementById('sw23-nle');if(nl){nl.value='';nl.placeholder='✓ Iscritto!';}
  }
};

/* Kill FAB vecchio */
function killOldFAB(){
  document.querySelectorAll('#sw11-fab-contact,[id*="fab-contact"]:not(#sw23-fab),#sw10-contact').forEach(function(el){
    el.style.setProperty('display','none','important');
  });
  window.fixContactButton=function(){};
}
var _ki=setInterval(function(){killOldFAB();},600);
setTimeout(function(){clearInterval(_ki);},8000);

/* Mappa dark */
var _mw=setInterval(function(){
  if(typeof L!=='undefined'&&window.TILES){
    window.TILES.street='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    clearInterval(_mw);
  }
},800);
setTimeout(function(){clearInterval(_mw);},15000);

/* ════════════════════════════════════════
   CARICA ARTICOLI DAL SERVER
   ════════════════════════════════════════ */
async function loadArts(){
  _arts=getElite().concat(LOCAL);
  renderSlideshow();buildTicker();

  try{
    var lang=getLang();
    var ctrl=new AbortController();setTimeout(function(){ctrl.abort();},6000);
    var r=await fetch(SRV+'/api/articles',{signal:ctrl.signal});
    if(r.ok){
      var data=await r.json();
      if(data&&data.length){
        data.forEach(function(a){
          if(!a.titolo)a.titolo=a['titolo_'+lang]||a.titolo_it||a.titolo_en||'';
          if(!a.categoria)a.categoria=a['categoria_'+lang]||a.categoria_it||a.categoria_en||'';
          if(!a.testo)a.testo=a['testo_'+lang]||a.testo_it||a.testo_en||'';
          if(!a.immagine)a.immagine=UNSPLASH[Math.floor(Math.random()*UNSPLASH.length)];
        });
        _arts=getElite().concat(data);
        renderSlideshow();buildTicker();
        console.log('[v23] '+data.length+' articoli ✓');
      }
    }
  }catch(e){console.log('[v23] Locali ('+e.message+')');}
}

/* ════════════════════════════════════════
   FIX 5: LINGUA — ri-carica contenuti
   ════════════════════════════════════════ */
function hookLang(){
  var origLang=window.i18n&&window.i18n.setLang&&window.i18n.setLang.bind(window.i18n);
  if(!origLang)return;
  window.i18n.setLang=function(l){
    origLang(l);
    /* Ri-renderizza con la nuova lingua */
    setTimeout(function(){
      renderSlideshow();buildTicker();render3Art();
    },200);
  };
}

/* ════════════════════════════════════════
   INIT
   ════════════════════════════════════════ */
function init(){
  console.log('[v23] Init avviato');
  killOldFAB();
  fixSommelier();
  addContactTab();addFAB();
  injectSlideshow();
  inject3Art();
  injectCuriosity();
  hookShowPage();
  hookLang();
  checkVisibility();
  loadArts();
  console.log('[v23] Init completato ✓');
}

document.readyState==='loading'
  ? document.addEventListener('DOMContentLoaded',init)
  : init();

})();
