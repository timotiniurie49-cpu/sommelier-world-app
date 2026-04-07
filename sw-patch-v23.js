/**
 * SOMMELIER WORLD — sw-patch-v23.js (versione definitiva)
 * Gazzetta AI in hero + Curiosità + Contatti con Newsletter + Mappa Dark
 */
(function () {
'use strict';

var SRV = 'https://sommelier-server-production-8f92.up.railway.app';

/* ── CSS ── */
var _css = document.createElement('style');
_css.textContent = [
  /* Scrollbar invisibile */
  '#sw23-carousel::-webkit-scrollbar,#sw23-curiosity-cards::-webkit-scrollbar{display:none}',

  /* Card notizie */
  '.sw23-card{flex:0 0 240px;min-width:240px;scroll-snap-align:start;border-radius:8px;',
    'overflow:hidden;cursor:pointer;background:rgba(15,6,3,.8);',
    'transition:transform .2s,box-shadow .2s;border:1px solid rgba(191,155,74,.12);}',
  '.sw23-card:active,.sw23-card:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.5);}',
  '.sw23-card-thumb{width:100%;height:120px;position:relative;overflow:hidden;',
    'display:flex;align-items:center;justify-content:center;font-size:2rem;}',
  '.sw23-card-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}',
  '.sw23-card-body{padding:10px 11px 12px;}',
  '.sw23-card-cat{font-size:8px;font-weight:700;letter-spacing:1.5px;',
    'color:rgba(191,155,74,.55);text-transform:uppercase;margin-bottom:3px;}',
  '.sw23-card-title{font-family:"Playfair Display","IM Fell English",Georgia,serif;',
    'font-size:.85rem;font-weight:700;color:#F5EFE2;line-height:1.3;margin-bottom:5px;}',
  '.sw23-card-meta{font-size:9px;color:rgba(245,239,226,.3);',
    'display:flex;align-items:center;justify-content:space-between;}',
  '.sw23-badge-ai{background:rgba(125,218,138,.15);color:rgba(125,218,138,.7);',
    'font-size:7px;padding:2px 5px;border-radius:3px;}',
  '.sw23-badge-elite{background:rgba(191,155,74,.85);color:#0A0705;font-family:Cinzel,serif;',
    'font-size:7px;font-weight:700;letter-spacing:2px;padding:2px 8px;text-align:center;}',
  '.sw23-badge-news{background:rgba(20,60,140,.55);color:rgba(180,220,255,.9);',
    'font-family:Cinzel,serif;font-size:7px;font-weight:700;letter-spacing:2px;',
    'padding:2px 8px;text-align:center;}',

  /* Card curiosità */
  '.sw23-cur{flex:0 0 210px;min-width:210px;scroll-snap-align:start;border-radius:8px;',
    'overflow:hidden;cursor:pointer;border:1px solid rgba(191,155,74,.12);',
    'transition:transform .2s,box-shadow .2s;}',
  '.sw23-cur:active,.sw23-cur:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.5);}',
  '.sw23-cur-body{padding:14px 12px;}',

  /* Reader */
  '#sw23-reader{display:none;position:fixed;inset:0;z-index:999950;',
    'background:#0A0705;overflow-y:auto;-webkit-overflow-scrolling:touch;}',

  /* Contatti overlay */
  '#sw23-cp{display:none;position:fixed;inset:0;z-index:999900;',
    'background:#0A0705;overflow-y:auto;-webkit-overflow-scrolling:touch;}',

  /* Input */
  '.sw23-inp{width:100%;box-sizing:border-box;padding:11px 13px;',
    'background:rgba(255,255,255,.05);border:1px solid rgba(191,155,74,.2);',
    'border-radius:8px;color:#F5EFE2;font-family:Lato,sans-serif;font-size:15px;',
    'outline:none;display:block;}',
  '.sw23-inp:focus{border-color:rgba(191,155,74,.5);}',
  '.sw23-lbl{display:block;font-size:9px;font-weight:700;letter-spacing:2px;',
    'color:rgba(191,155,74,.55);text-transform:uppercase;margin-bottom:5px;}',
  '.sw23-btn{width:100%;padding:13px;background:rgba(191,155,74,.18);',
    'border:1.5px solid rgba(191,155,74,.4);border-radius:8px;color:#BF9B4A;',
    'font-family:Cinzel,serif;font-size:.58rem;font-weight:700;letter-spacing:3px;',
    'cursor:pointer;transition:background .2s;}',
  '.sw23-btn:hover{background:rgba(191,155,74,.28);}',
].join('');
document.head.appendChild(_css);

/* ── UTILITÀ ── */
function lang(){return(window.i18n&&window.i18n.current)||localStorage.getItem('sw_lang')||'it';}
function tf(a,f){var l=lang();return a[f+'_'+l]||a[f+'_it']||a[f]||'';}
var BG=[
  'linear-gradient(135deg,rgba(74,14,14,.95),rgba(30,4,4,.8))',
  'linear-gradient(135deg,rgba(4,40,74,.95),rgba(2,18,50,.8))',
  'linear-gradient(135deg,rgba(4,60,40,.95),rgba(2,32,22,.8))',
  'linear-gradient(135deg,rgba(60,40,4,.95),rgba(32,20,2,.8))',
  'linear-gradient(135deg,rgba(40,4,74,.95),rgba(20,2,45,.8))',
  'linear-gradient(135deg,rgba(60,10,50,.95),rgba(32,5,28,.8))',
];

/* ── ARTICOLI LOCALI ── */
var LOCAL=[
  {id:'l1',isNews:true,
   titolo_it:'Barolo 2016: la Vendemmia del Secolo',titolo_en:'Barolo 2016: Vintage of the Century',titolo_fr:'Barolo 2016 : Millésime du Siècle',
   categoria_it:'🍷 Annate',categoria_en:'🍷 Vintages',categoria_fr:'🍷 Millésimes',
   testo_it:'Il 2016 è la più grande annata delle Langhe degli ultimi trent\'anni. Estate perfetta, nessuno stress idrico, escursioni termiche straordinarie.\n\nMonfortino di Giacomo Conterno, Rocche dell\'Annunziata di Paolo Scavino, Cerretta di Elio Grasso: capolavori da cinquant\'anni.\n\nSe lo trovi a prezzo ragionevole, compralo subito.',
   testo_en:'The 2016 vintage is the greatest in the Langhe for thirty years. These wines will last fifty years.',
   testo_fr:'Le 2016 est le plus grand millésime des Langhe depuis trente ans.',
   autore:'Timotin',data:'Aprile 2026'},
  {id:'l2',isNews:false,
   titolo_it:'Come Leggere un\'Etichetta del Vino',titolo_en:'How to Read a Wine Label',titolo_fr:'Comment Lire une Étiquette',
   categoria_it:'📚 Tecnica',categoria_en:'📚 Technique',categoria_fr:'📚 Technique',
   testo_it:'DOC, DOCG, IGT, AOC: capire la classificazione permette di scegliere in secondi.\n\nLa regola d\'oro: il nome del produttore viene prima della denominazione. Un grande produttore in una zona minore batte spesso un mediocre in una zona famosa.',
   testo_en:'DOC, DOCG, IGT, AOC: understanding classification lets you choose in seconds.',
   testo_fr:'Comprendre la classification permet de choisir en quelques secondes.',
   autore:'Timotin',data:'Aprile 2026'},
  {id:'l3',isNews:false,
   titolo_it:'Etna: il Vulcano che ha Cambiato il Vino',titolo_en:'Etna: The Volcano that Changed Wine',titolo_fr:'L\'Etna : Volcan qui a Changé le Vin',
   categoria_it:'🌍 Terroir',categoria_en:'🌍 Terroir',categoria_fr:'🌍 Terroir',
   testo_it:'Le 133 contrade dell\'Etna identificano vigneti centenari ad alberello su sabbie laviche tra 400 e 1000 metri.\n\nNerello Mascalese: rossi trasparenti vicini al Pinot Nero di Borgogna. Cornelissen, Terre Nere, Benanti, Passopisciaro.',
   testo_en:'Etna\'s 133 contrade identify century-old vines on volcanic soils.',
   testo_fr:'Les 133 contrade de l\'Etna identifient des vignes centenaires.',
   autore:'Timotin',data:'Marzo 2026'},
  {id:'l4',isNews:false,
   titolo_it:'Champagne: Scegliere la Bottiglia Giusta',titolo_en:'Champagne: Choose the Right Bottle',titolo_fr:'Champagne : Choisir la Bonne Bouteille',
   categoria_it:'✨ Guide',categoria_en:'✨ Guides',categoria_fr:'✨ Guides',
   testo_it:'Tra 300 produttori la chiave è capire: tipologia (NV, Vintage, Prestige), dosaggio, categoria produttore (RM vs NM).\n\nI Recoltant Manipulant producono solo con uve proprie: Selosse, Chartogne-Taillet, Bereche.',
   testo_en:'Among 300 producers the key is type, dosage and producer category.',
   testo_fr:'Parmi 300 producteurs, la clé est le type, le dosage et la catégorie.',
   autore:'Timotin',data:'Marzo 2026'},
  {id:'l5',isNews:false,
   titolo_it:'Vino e Formaggio: 10 Abbinamenti Perfetti',titolo_en:'Wine and Cheese: 10 Perfect Pairings',titolo_fr:'Vin et Fromage : 10 Accords',
   categoria_it:'🍽 Abbinamenti',categoria_en:'🍽 Pairings',categoria_fr:'🍽 Accords',
   testo_it:'Freschi con bianchi leggeri. Stagionati con rossi strutturati. Erborinati con vini dolci.\n\nI 10 da sapere: Parmigiano + Lambrusco, Gorgonzola + Sauternes, Stilton + Porto, Taleggio + Barbaresco.',
   testo_en:'Fresh cheeses with light whites. Aged with reds. Blue cheeses with sweet wines.',
   testo_fr:'Frais avec blancs légers. Affinés avec rouges. Bleus avec doux.',
   autore:'Timotin',data:'Febbraio 2026'},
];

/* ── CURIOSITÀ ── */
var CUR=[
  {ico:'🌱',t:'Viticoltura',h:'Il Ciclo della Vite',b:'La vite percorre 4 stagioni: germogliamento (marzo), fioritura (giugno), invaiatura - cambio colore acino (agosto), vendemmia (settembre-ottobre). Un giorno di pioggia fuori tempo può cambiare tutto.'},
  {ico:'🔪',t:'Sommelier',h:'Come Aprire una Bottiglia',b:'Il sommelier taglia la capsula sotto il secondo anello, inserisce la vite al centro del sughero, ruota 6 volte, aggancia le due leve e solleva con movimento fluido. Il sughero deve uscire in silenzio.'},
  {ico:'🥂',t:'Bicchieri',h:'Perché il Calice ha lo Stelo',b:'Lo stelo del calice esiste per evitare che il calore della mano scaldi il vino. Per i rossi strutturati si regge dallo stelo. Per i vini da meditazione si può reggere dalla coppa per scaldarli.'},
  {ico:'🌡️',t:'Servizio',h:'La Temperatura di Servizio',b:'Spumanti 6-8°C, bianchi leggeri 8-10°C, bianchi strutturati 10-12°C, rosé 10-12°C, rossi leggeri 14-16°C, rossi strutturati 16-18°C. Mai oltre 18°C: l\'alcol copre tutto.'},
  {ico:'🪨',t:'Terroir',h:'Il Calcare e la Mineralità',b:'Il calcare è il suolo del vino di qualità: drena bene, forza le radici in profondità, dona mineralità e freschezza. Borgogna, Champagne, Barolo, Chablis sono tutti su suoli calcarei.'},
  {ico:'⚗️',t:'Enologia',h:'La Fermentazione Malolattica',b:'Trasforma l\'acido malico (aspro) in lattico (morbido). Nei rossi è quasi sempre completata; nei bianchi il produttore sceglie: completarla dà morbidezza, bloccarla conserva freschezza.'},
  {ico:'🏺',t:'Storia',h:'8000 Anni di Vino',b:'I primi segni di vinificazione risalgono al 6000 a.C. in Georgia, dove si faceva fermentare l\'uva in anfore di argilla (kvevri) interrate nel terreno. Da questo metodo nascono oggi i vini arancioni.'},
  {ico:'💧',t:'Degustazione',h:'Le Lacrime del Vino',b:'Le lacrime che scendono lungo il calice non indicano qualità ma alcol. Più sono marcate, più il vino è alcolico. Si formano per il diverso tasso di evaporazione tra alcol e acqua.'},
  {ico:'🌊',t:'Terroir',h:'Il Vino e il Mare',b:'I vigneti vicino al mare producono vini sapidi e iodati. Vermentino sardo, Assyrtiko di Santorini, Muscadet: tutti mostrano quella mineralità marina inconfondibile.'},
  {ico:'🎭',t:'Storia',h:'Napoleone e il Chambertin',b:'Napoleone Bonaparte portava il Chambertin in ogni battaglia. Durante la campagna di Russia del 1812, quando rimase senza, attribuì parte dei fallimenti militari alla sua mancanza.'},
  {ico:'🪵',t:'Enologia',h:'Rovere Francese vs Americano',b:'Rovere francese: grana fine, vaniglia e spezie eleganti. Rovere americano: grana larga, cocco e vaniglia intensa. I Rioja storici usano americano; i Barolo moderni preferiscono il francese.'},
  {ico:'🏔️',t:'Viticoltura',h:'Altitudine e Acidità',b:'In quota le temperature notturne scendono e l\'escursione termica aumenta. Questo rallenta la maturazione e permette all\'uva di sviluppare zuccheri mantenendo l\'acidità.'},
  {ico:'🎨',t:'Degustazione',h:'Il Colore Racconta Tutto',b:'Un Barolo giovane è rubino con riflessi viola; a 10 anni granato; a 20 anni si tinge d\'arancio ai bordi. Nei bianchi l\'inverso: da paglierino verdognolo a dorato intenso.'},
  {ico:'💎',t:'Mercato',h:'Il Vino più Costoso del Mondo',b:'La Romanée-Conti 1945 è stata venduta per 558.000 dollari per bottiglia nel 2018 da Sotheby\'s. Probabilmente non è mai stata aperta. Il vino da collezione diventa un\'opera d\'arte.'},
  {ico:'👃',t:'Degustazione',h:'Come si Annusa il Vino',b:'Prima annusata a naso fermo: aromi primari (frutta, fiori). Poi ruota il calice e annusa subito dopo: aromi secondari e terziari (cuoio, tabacco, terra). Il naso racconta l\'80% del vino.'},
  {ico:'🌿',t:'Viticoltura',h:'La Potatura Invernale',b:'La potatura è il gesto più importante dell\'anno in vigna. Si esegue da dicembre a febbraio. Ogni tralcio tagliato è una scelta: quanti grappoli, quanto concentrata sarà l\'uva.'},
  {ico:'🧪',t:'Enologia',h:'I Solfiti nel Vino',b:'I solfiti sono conservanti naturali usati dai Romani. Tutti i vini ne contengono in piccole quantità. Non causano il mal di testa: è l\'alcol che lo provoca.'},
  {ico:'🏛️',t:'Storia',h:'Il Symposium Greco',b:'Nell\'antica Grecia il simposio era una cerimonia del vino. Si beveva sempre diluito (3 parti acqua, 1 vino). Bere vino puro era considerato barbaro. La moderazione era il valore supremo.'},
  {ico:'🎪',t:'Denominazioni',h:'DOCG: Solo 77 in Italia',b:'La DOCG è il livello massimo italiano. Esistono solo 77 DOCG. La prima fu assegnata nel 1980 a Barolo, Barbaresco, Brunello di Montalcino e Albana di Romagna.'},
  {ico:'📐',t:'Servizio',h:'Quanto Vino Versare',b:'La regola professionale: mai oltre un terzo del calice. Un Borgogna grande si versa per un quarto. Il vino deve respirare nel calice per sprigionare gli aromi.'},
  {ico:'🗺️',t:'Denominazioni',h:'La Classificazione del 1855',b:'Nel 1855 Napoleone III chiese di classificare i migliori Bordeaux. Nacquero i Premiers Crus: Lafite, Latour, Margaux, Haut-Brion. Solo nel 1973 fu aggiunto Mouton Rothschild.'},
  {ico:'🌬️',t:'Viticoltura',h:'Il Vento in Vigna',b:'Il vento è il primo alleato contro le malattie fungine: asciuga il grappolo dopo la pioggia. Il Mistral, il Maestrale, il Tramontano permettono meno trattamenti chimici.'},
  {ico:'🎻',t:'Storia',h:'Dom Perignon e il Mito',b:'Dom Pérignon non ha inventato lo Champagne. Il monaco cercava di ELIMINARE le bollicine, che rompevano le bottiglie. Erano un difetto. A inventare il metodo classico furono gli inglesi.'},
  {ico:'🐝',t:'Viticoltura',h:'La Biodiversità in Vigna',b:'Api, lombrichi, lucertole, ragni: ogni essere vivente contribuisce all\'equilibrio. In un ettaro di vigna sana vivono più di 1 milione di organismi diversi.'},
  {ico:'✨',t:'Sommelier',h:'L\'Esame AIS',b:'Per diventare Sommelier AIS ci vogliono 3 livelli: storia e geografia del vino, abbinamento cibo-vino, degustazione professionale. L\'esame finale include una degustazione alla cieca di 3 vini.'},
  {ico:'🌺',t:'Degustazione',h:'Il Vino e i 5 Sensi',b:'Vista: colore e limpidezza. Olfatto: prima e dopo la rotazione. Tatto: morbidezza e astringenza. Gusto: dolce, acido, amaro, sapido. Udito: il suono del tappo. Solo il vino coinvolge tutti e 5 i sensi.'},
  {ico:'🔑',t:'Sommelier',h:'Il Tastevin',b:'Il piccolo disco d\'argento che i sommelier portano al collo era usato nelle cantine buie per valutare il colore del vino alla luce di una candela. Oggi è un simbolo onorifico.'},
  {ico:'🌙',t:'Viticoltura',h:'La Viticoltura Biodinamica',b:'Il calendario biodinamico divide i giorni in: Radice (vinificazione), Fiore (bianchi), Frutto (rossi), Foglia (vino chiuso). Rudolf Steiner ha codificato questo sistema negli anni 20.'},
  {ico:'🦟',t:'Storia',h:'La Fillossera che Cambiò Tutto',b:'Tra 1863 e 1900 la fillossera distrusse il 90% dei vigneti europei. La soluzione: innestare le viti europee su radici americane resistenti. Quasi tutte le viti del mondo sono ancora così.'},
  {ico:'🎯',t:'Degustazione',h:'Il Retronaso',b:'Il retronaso è la sensazione olfattiva che sentiamo mentre beviamo, attraverso la via retronasale. È qui che percepiamo davvero il sapore del vino — non nella bocca, ma nel naso.'},
];

/* ── STATO ── */
var _arts=[], _readerOpen=false;

function getElite(){
  try{return JSON.parse(localStorage.getItem('sw_elite_producers')||'[]')
    .filter(function(p){return p.nome&&p.descrizione;})
    .map(function(p,i){return{id:'e'+i,isElite:true,
      titolo_it:'👑 '+p.nome,titolo_en:'👑 '+p.nome,titolo_fr:'👑 '+p.nome,
      categoria_it:'👑 Elite',categoria_en:'👑 Elite',categoria_fr:'👑 Elite',
      testo_it:p.descrizione,autore:p.nome,data:p.data||'',producer:p};});
  }catch(e){return[];}
}

/* ── CARICA ARTICOLI ── */
async function loadArts(){
  _arts=getElite().concat(LOCAL);
  renderMag();
  try{
    var ctrl=new AbortController();
    setTimeout(function(){ctrl.abort();},6000);
    var r=await fetch(SRV+'/api/articles',{signal:ctrl.signal});
    if(r.ok){
      var data=await r.json();
      if(data&&data.length){
        data.forEach(function(a){
          if(!a.titolo)a.titolo=a.titolo_it||a.titolo_en||'';
          if(!a.categoria)a.categoria=a.categoria_it||a.categoria_en||'';
          if(!a.testo)a.testo=a.testo_it||a.testo_en||'';
        });
        _arts=getElite().concat(data);
        renderMag();
        console.log('[v23] '+data.length+' articoli dal server Railway ✓');
      }
    }
  }catch(e){console.log('[v23] Locali ('+e.message+')');}
}

/* ── RENDER GAZZETTA CAROUSEL ── */
function renderMag(){
  var c=document.getElementById('sw23-carousel');
  if(!c)return;
  c.innerHTML='';
  var cnt=document.getElementById('sw23-art-count');
  if(cnt)cnt.textContent=_arts.length+' articoli';

  _arts.forEach(function(art,i){
    var tit=tf(art,'titolo')||art.titolo||'';
    var cat=tf(art,'categoria')||art.categoria||'Magazine';
    var isE=!!art.isElite,isN=!!art.isNews,isAI=!!art.generato_ai;
    var bg=BG[i%BG.length];
    var ico=isE?'👑':(isN?'🗞':['🍷','🌿','📚','🥂','🌍','✨'][i%6]);

    var card=document.createElement('div');
    card.className='sw23-card';
    card.style.borderColor=isE?'rgba(191,155,74,.5)':(isN?'rgba(100,180,255,.2)':'rgba(191,155,74,.12)');

    card.innerHTML=
      (isE?'<div class="sw23-badge-elite">👑 ELITE PRODUCER</div>':'')+
      (isN&&!isE?'<div class="sw23-badge-news">🗞 NOTIZIA DEL GIORNO</div>':'')+
      '<div class="sw23-card-thumb" style="background:'+bg+';">'+
        (art.immagine?'<img class="sw23-card-img" src="'+art.immagine+'" loading="lazy" onerror="this.style.display=\'none\'">':'')+
        '<span style="position:relative;z-index:1;filter:drop-shadow(0 2px 6px rgba(0,0,0,.9));">'+ico+'</span>'+
      '</div>'+
      '<div class="sw23-card-body">'+
        '<div class="sw23-card-cat">'+cat+'</div>'+
        '<div class="sw23-card-title">'+tit+'</div>'+
        '<div class="sw23-card-meta">'+
          '<span>'+(art.data||'')+(art.autore?' · '+art.autore:'')+'</span>'+
          (isAI?'<span class="sw23-badge-ai">✦ AI</span>':'')+
        '</div>'+
      '</div>';

    card.onclick=function(){openReader(art,i);};
    c.appendChild(card);
  });
}

/* ── READER ── */
function openReader(art,idx){
  var tit=tf(art,'titolo')||art.titolo||'';
  var cat=tf(art,'categoria')||art.categoria||'';
  var txt=tf(art,'testo')||art.testo||'';
  var bg=BG[(idx||0)%BG.length];
  var paras=(txt||'').split(/\n\n+/).filter(Boolean)
    .map(function(p){return'<p style="margin:0 0 20px;">'+p.trim()+'</p>';}).join('');

  var r=document.getElementById('sw23-reader');
  if(!r){r=document.createElement('div');r.id='sw23-reader';document.body.appendChild(r);}

  r.innerHTML=
    '<div style="position:sticky;top:0;z-index:2;background:rgba(10,7,5,.97);backdrop-filter:blur(12px);'+
      'border-bottom:1px solid rgba(191,155,74,.12);display:flex;align-items:center;gap:12px;padding:12px 16px;">'+
      '<button onclick="document.getElementById(\'sw23-reader\').style.display=\'none\';document.body.style.overflow=\'\'" '+
        'style="width:36px;height:36px;border-radius:50%;background:rgba(191,155,74,.1);'+
        'border:1px solid rgba(191,155,74,.2);color:#BF9B4A;font-size:18px;cursor:pointer;'+
        'display:flex;align-items:center;justify-content:center;flex-shrink:0;">←</button>'+
      '<div style="font-family:Cinzel,serif;font-size:.58rem;letter-spacing:2px;color:rgba(191,155,74,.6);'+
        'flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+tit+'</div>'+
    '</div>'+
    '<div style="max-width:720px;margin:0 auto;padding-bottom:80px;">'+
      '<div style="width:100%;height:200px;background:'+bg+';display:flex;align-items:center;justify-content:center;'+
        'font-size:3.5rem;position:relative;overflow:hidden;">'+
        (art.immagine?'<img src="'+art.immagine+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" onerror="this.style.display=\'none\'">':'')+
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
        '<div style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:1.05rem;line-height:2;color:rgba(245,239,226,.85);">'+
          (paras||'<p style="color:rgba(245,239,226,.4);">Contenuto non disponibile.</p>')+
        '</div>'+
        (art.isElite&&art.producer?buildElite(art.producer):'')+
      '</div>'+
    '</div>';

  r.style.display='block';r.scrollTop=0;
  document.body.style.overflow='hidden';_readerOpen=true;
  try{history.pushState({r:1},'');}catch(e){}
}

function buildElite(p){
  return '<div style="margin:24px 0;padding:18px;background:rgba(191,155,74,.06);border:1px solid rgba(191,155,74,.25);border-radius:10px;">'+
    '<div style="font-size:8px;font-weight:700;letter-spacing:2px;color:#BF9B4A;margin-bottom:8px;">👑 PRODUTTORE ELITE</div>'+
    '<div style="font-family:\'Playfair Display\',serif;font-size:1rem;font-weight:700;color:#F5EFE2;margin-bottom:4px;">'+(p.nome||'')+'</div>'+
    '<div style="font-size:11px;color:rgba(191,155,74,.6);margin-bottom:8px;">'+(p.denominazione||p.regione||'')+'</div>'+
    '<div style="font-family:\'IM Fell English\',serif;font-style:italic;font-size:.9rem;line-height:1.75;color:rgba(245,239,226,.65);">'+(p.descrizione||'')+'</div>'+
    (p.sito?'<a href="'+p.sito+'" target="_blank" style="display:inline-block;margin-top:12px;padding:8px 16px;background:rgba(191,155,74,.12);border:1px solid rgba(191,155,74,.3);border-radius:6px;color:#BF9B4A;font-size:10px;font-weight:700;text-decoration:none;">🌐 Visita il sito →</a>':'')+
  '</div>';
}

window.addEventListener('popstate',function(){
  if(_readerOpen){var r=document.getElementById('sw23-reader');if(r)r.style.display='none';document.body.style.overflow='';_readerOpen=false;}
});

/* ── CURIOSITÀ ── */
function renderCuriosity(){
  var c=document.getElementById('sw23-curiosity-cards');if(!c)return;
  var d=document.getElementById('sw23-cur-date');
  if(d)d.textContent=new Date().toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long'});
  var dayN=Math.floor(Date.now()/86400000);
  var shown=[];for(var i=0;i<8;i++)shown.push(CUR[(dayN+i)%CUR.length]);
  c.innerHTML='';
  shown.forEach(function(cur,i){
    var card=document.createElement('div');
    card.className='sw23-cur';
    card.style.background=BG[i%BG.length];
    card.innerHTML='<div class="sw23-cur-body">'+
      '<div style="font-size:1.6rem;margin-bottom:6px;">'+cur.ico+'</div>'+
      '<div style="font-size:7px;font-weight:700;letter-spacing:2px;color:rgba(191,155,74,.5);text-transform:uppercase;margin-bottom:5px;">'+cur.t+'</div>'+
      '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:.83rem;font-weight:700;color:#F5EFE2;line-height:1.3;margin-bottom:7px;">'+cur.h+'</div>'+
      '<div style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:.8rem;line-height:1.6;color:rgba(245,239,226,.6);">'+cur.b.substring(0,110)+'…</div>'+
    '</div>';
    card.onclick=function(){openReader({titolo:cur.h,categoria:'🎓 '+cur.t,testo:cur.b,autore:'Sommelier World',data:new Date().toLocaleDateString('it-IT')},i);};
    c.appendChild(card);
  });
}

/* ── PAGINA CONTATTI con NEWSLETTER ── */
window.sw23OpenContact=function(){
  document.querySelectorAll('.ntab').forEach(function(t){t.classList.remove('active');});
  var p=document.getElementById('sw23-cp');
  if(p){p.style.display='block';document.body.style.overflow='hidden';_resetContact();return;}
  p=document.createElement('div');p.id='sw23-cp';
  p.innerHTML=
    '<div style="position:sticky;top:0;z-index:2;background:rgba(10,7,5,.97);backdrop-filter:blur(12px);'+
      'border-bottom:1px solid rgba(191,155,74,.15);display:flex;align-items:center;gap:12px;padding:13px 16px;">'+
      '<button onclick="sw23CloseContact()" style="width:36px;height:36px;border-radius:50%;background:rgba(191,155,74,.1);'+
        'border:1px solid rgba(191,155,74,.2);color:#BF9B4A;font-size:18px;cursor:pointer;'+
        'display:flex;align-items:center;justify-content:center;flex-shrink:0;">←</button>'+
      '<div style="font-family:Cinzel,serif;font-size:.65rem;letter-spacing:3px;color:#F5EFE2;">CONTATTI</div>'+
    '</div>'+
    '<div style="max-width:540px;margin:0 auto;padding:24px 20px 80px;box-sizing:border-box;">'+

      /* FORM CONTATTI */
      '<div style="text-align:center;margin-bottom:24px;">'+
        '<div style="font-size:9px;font-weight:700;letter-spacing:3px;color:rgba(191,155,74,.5);text-transform:uppercase;margin-bottom:8px;">✉️ SCRIVICI</div>'+
        '<h2 style="font-family:\'Playfair Display\',serif;font-size:1.4rem;font-weight:700;color:#F5EFE2;margin:0 0 6px;">Come possiamo aiutarti?</h2>'+
        '<p style="font-size:12px;color:rgba(245,239,226,.4);line-height:1.7;margin:0;">Produttori, collaborazioni, segnalazioni. Risponderemo entro 48 ore.</p>'+
      '</div>'+

      '<div id="sw23-c-ok" style="display:none;text-align:center;padding:20px;background:rgba(125,218,138,.08);'+
        'border:1px solid rgba(125,218,138,.2);border-radius:10px;margin-bottom:16px;">'+
        '<div style="font-size:1.8rem;margin-bottom:6px;">✓</div>'+
        '<div style="font-family:\'Playfair Display\',serif;color:#7dda8a;">Messaggio inviato!</div>'+
      '</div>'+

      '<div id="sw23-c-form">'+
        '<div style="margin-bottom:14px;"><label class="sw23-lbl">NOME *</label>'+
          '<input id="sw23-cn" class="sw23-inp" type="text" placeholder="Il tuo nome" autocomplete="name"></div>'+
        '<div style="margin-bottom:14px;"><label class="sw23-lbl">EMAIL *</label>'+
          '<input id="sw23-ce" class="sw23-inp" type="email" placeholder="tua@email.com" autocomplete="email"></div>'+
        '<div style="margin-bottom:14px;"><label class="sw23-lbl">ARGOMENTO</label>'+
          '<select id="sw23-cs" class="sw23-inp" style="cursor:pointer;">'+
            '<option value="">— Seleziona —</option>'+
            '<option>🏭 Produttore / cantina</option>'+
            '<option>👑 Piano Elite</option>'+
            '<option>🥂 Collaborazione sommelier</option>'+
            '<option>🛠 Segnalazione errore</option>'+
            '<option>💬 Altro</option>'+
          '</select></div>'+
        '<div style="margin-bottom:14px;"><label class="sw23-lbl">MESSAGGIO *</label>'+
          '<textarea id="sw23-cm" class="sw23-inp" style="height:100px;resize:none;" placeholder="Scrivi qui..."></textarea></div>'+
        '<button onclick="sw23SendContact()" id="sw23-cbtn" class="sw23-btn">✦ INVIA MESSAGGIO ✦</button>'+
        '<div id="sw23-cerr" style="display:none;margin-top:8px;padding:10px;background:rgba(220,50,50,.15);'+
          'border:1px solid rgba(220,50,50,.3);border-radius:6px;font-size:12px;color:rgba(255,150,150,.9);text-align:center;"></div>'+
      '</div>'+

      /* DIVISORE */
      '<div style="margin:28px 0;border-top:1px solid rgba(191,155,74,.1);position:relative;">'+
        '<span style="position:absolute;top:-9px;left:50%;transform:translateX(-50%);'+
          'background:#0A0705;padding:0 12px;font-size:9px;font-weight:700;letter-spacing:3px;color:rgba(191,155,74,.3);">OPPURE</span>'+
      '</div>'+

      /* NEWSLETTER */
      '<div id="sw23-nl-wrap">'+
        '<div style="text-align:center;margin-bottom:16px;">'+
          '<div style="font-size:9px;font-weight:700;letter-spacing:3px;color:rgba(191,155,74,.5);text-transform:uppercase;margin-bottom:6px;">📰 NEWSLETTER</div>'+
          '<h3 style="font-family:\'Playfair Display\',serif;font-size:1.1rem;font-weight:700;color:#F5EFE2;margin:0 0 6px;">Ricevi le Notizie del Vino</h3>'+
          '<p style="font-size:12px;color:rgba(245,239,226,.4);line-height:1.6;margin:0;">Una volta a settimana: notizie, denominazioni rare, guide ai grandi vini.</p>'+
        '</div>'+
        '<div id="sw23-nl-ok" style="display:none;text-align:center;padding:16px;background:rgba(125,218,138,.08);'+
          'border:1px solid rgba(125,218,138,.2);border-radius:10px;margin-bottom:12px;">'+
          '<div style="font-size:1.4rem;margin-bottom:4px;">✓</div>'+
          '<div style="font-family:\'Playfair Display\',serif;color:#7dda8a;font-size:.9rem;">Iscritto con successo!</div>'+
        '</div>'+
        '<div id="sw23-nl-form" style="display:flex;gap:10px;">'+
          '<input id="sw23-nl-email" class="sw23-inp" type="email" placeholder="la.tua@email.com" style="flex:1;">'+
          '<button onclick="sw23Subscribe()" style="padding:11px 18px;background:rgba(191,155,74,.18);'+
            'border:1.5px solid rgba(191,155,74,.4);border-radius:8px;color:#BF9B4A;'+
            'font-family:Cinzel,serif;font-size:.55rem;font-weight:700;letter-spacing:2px;cursor:pointer;white-space:nowrap;">'+
            'ISCRIVITI</button>'+
        '</div>'+
        '<div id="sw23-nl-err" style="display:none;margin-top:8px;font-size:12px;color:rgba(255,150,150,.8);text-align:center;"></div>'+
      '</div>'+

      /* EMAIL DIRETTA */
      '<div style="text-align:center;margin-top:24px;padding-top:20px;border-top:1px solid rgba(191,155,74,.08);">'+
        '<div style="font-size:11px;color:rgba(245,239,226,.3);margin-bottom:5px;">Oppure scrivi a</div>'+
        '<a href="mailto:info@sommelierworld.vin" style="color:rgba(191,155,74,.6);font-size:13px;text-decoration:none;">info@sommelierworld.vin</a>'+
      '</div>'+
    '</div>';

  document.body.appendChild(p);
  p.style.display='block';
  document.body.style.overflow='hidden';
};

window.sw23CloseContact=function(){
  var p=document.getElementById('sw23-cp');if(p)p.style.display='none';
  document.body.style.overflow='';
  document.querySelectorAll('.ntab').forEach(function(t){t.classList.remove('active');});
  var h=document.querySelector('[data-page="home"]');if(h)h.classList.add('active');
};

function _resetContact(){
  ['sw23-cn','sw23-ce','sw23-cs','sw23-cm'].forEach(function(id){var e=document.getElementById(id);if(e)e.value='';});
  var ok=document.getElementById('sw23-c-ok'),frm=document.getElementById('sw23-c-form');
  if(ok)ok.style.display='none';if(frm)frm.style.display='block';
}

window.sw23SendContact=async function(){
  var n=(document.getElementById('sw23-cn')||{}).value||'';
  var e=(document.getElementById('sw23-ce')||{}).value||'';
  var s=(document.getElementById('sw23-cs')||{}).value||'';
  var m=(document.getElementById('sw23-cm')||{}).value||'';
  var err=document.getElementById('sw23-cerr'),btn=document.getElementById('sw23-cbtn');
  n=n.trim();e=e.trim();m=m.trim();
  function showE(t){if(err){err.textContent=t;err.style.display='block';}}
  if(!n)return showE('Inserisci il nome.');
  if(!e||!e.includes('@'))return showE('Email non valida.');
  if(m.length<4)return showE('Messaggio troppo corto.');
  if(err)err.style.display='none';
  if(btn){btn.disabled=true;btn.textContent='⏳ Invio...';}
  var sent=false;
  try{
    var ctrl=new AbortController();setTimeout(function(){ctrl.abort();},8000);
    var r=await fetch(SRV+'/api/contact',{method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name:n,email:e,subject:s,message:m}),signal:ctrl.signal});
    if(r.ok){var d=await r.json();sent=!!d.ok;}
  }catch(ex){}
  if(!sent)window.location.href='mailto:info@sommelierworld.vin?subject='+encodeURIComponent('[SW] '+(s||'Messaggio da '+n))+'&body='+encodeURIComponent('Da: '+n+'\nEmail: '+e+'\n\n'+m);
  var frm=document.getElementById('sw23-c-form'),ok=document.getElementById('sw23-c-ok');
  if(frm)frm.style.display='none';if(ok)ok.style.display='block';
  if(btn){btn.disabled=false;btn.textContent='✦ INVIA MESSAGGIO ✦';}
};

window.sw23Subscribe=async function(){
  var email=(document.getElementById('sw23-nl-email')||{}).value||'';
  var err=document.getElementById('sw23-nl-err');
  email=email.trim();
  if(!email||!email.includes('@')){if(err){err.textContent='Inserisci un\'email valida.';err.style.display='block';}return;}
  if(err)err.style.display='none';

  /* Salva in localStorage per riferimento futuro */
  try{
    var subs=JSON.parse(localStorage.getItem('sw_newsletter')||'[]');
    if(!subs.includes(email)){subs.push(email);localStorage.setItem('sw_newsletter',JSON.stringify(subs));}
  }catch(ex){}

  /* Prova anche il server */
  try{
    await fetch(SRV+'/api/contact',{method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name:'Newsletter',email:email,subject:'Iscrizione Newsletter',message:'Iscrizione newsletter da sommelierworld.vin'})});
  }catch(ex){}

  var frm=document.getElementById('sw23-nl-form'),ok=document.getElementById('sw23-nl-ok');
  if(frm)frm.style.display='none';if(ok)ok.style.display='block';
  console.log('[v23] Newsletter: '+email+' iscritto ✓');
};

/* ── MAPPA DARK ── */
function applyDarkMap(){
  if(typeof L==='undefined'||!window.TILES)return;
  window.TILES.street='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  window.TILES.topo='https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png';
}

/* ── KILL FAB ── */
function killFAB(){
  document.querySelectorAll('#sw11-fab-contact,[id*="fab-contact"]')
    .forEach(function(el){el.style.display='none';el.style.visibility='hidden';});
  window.fixContactButton=function(){};
}

/* ── INIT ── */
function init(){
  console.log('[v23] Avvio — Gazzetta AI + Newsletter + Mappa Dark');
  applyDarkMap();
  killFAB();
  setTimeout(killFAB,1000);
  setTimeout(killFAB,3000);
  loadArts();
  renderCuriosity();
  var origLang=window.i18n&&window.i18n.setLang&&window.i18n.setLang.bind(window.i18n);
  if(origLang){window.i18n.setLang=function(l){origLang(l);setTimeout(renderMag,200);};}
}

document.readyState==='loading'
  ?document.addEventListener('DOMContentLoaded',init)
  :init();

})();
