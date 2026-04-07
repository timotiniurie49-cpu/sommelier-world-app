/**
 * SOMMELIER WORLD — sw-patch-v23.js
 * Patch definitiva: Magazine Carousel + Curiosità + Contatti + Mappa Dark
 * Nessun errore di sintassi — file JS esterno separato
 */
(function () {
'use strict';

/* ════════════════════════════════════════════════
   CONFIG
   ════════════════════════════════════════════════ */
var CFG = {
  server: 'https://sommelier-server-production-8f92.up.railway.app',

  /* Multi-LLM: cambia qui il provider attivo */
  llm: {
    active: 'groq', /* 'groq' | 'gemini' | 'openai' | 'grok' */
    keys: {
      groq:   '',   /* opzionale: usa il server Railway */
      gemini: '',
      openai: '',
      grok:   '',
    }
  },

  /* Palette colori */
  colors: {
    bordeaux: '#4A0E0E',
    oro:      '#C5A059',
    oro2:     'rgba(197,160,89,.6)',
    sfondo:   '#0A0705',
    testo:    '#F5EFE2',
  }
};

/* ════════════════════════════════════════════════
   CSS DINAMICO
   ════════════════════════════════════════════════ */
(function injectCSS() {
  if (document.getElementById('sw23-css')) return;
  var s = document.createElement('style');
  s.id = 'sw23-css';
  s.textContent = [
    /* Scrollbar nascosta */
    '#sw-carousel::-webkit-scrollbar,',
    '#sw-curiosity-cards::-webkit-scrollbar { display:none }',

    /* Card magazine */
    '.sw23-card {',
      'flex:0 0 250px;min-width:250px;scroll-snap-align:start;',
      'border-radius:10px;overflow:hidden;cursor:pointer;',
      'background:rgba(20,8,4,.7);transition:transform .2s,box-shadow .2s;',
    '}',
    '.sw23-card:hover {',
      'transform:translateY(-2px);',
      'box-shadow:0 8px 24px rgba(0,0,0,.5);',
    '}',
    '.sw23-card-thumb {',
      'width:100%;height:130px;position:relative;overflow:hidden;',
      'display:flex;align-items:center;justify-content:center;',
    '}',
    '.sw23-card-ico {',
      'font-size:2.2rem;position:relative;z-index:1;',
      'filter:drop-shadow(0 2px 6px rgba(0,0,0,.9));',
    '}',
    '.sw23-card-img {',
      'position:absolute;inset:0;width:100%;height:100%;',
      'object-fit:cover;',
    '}',
    '.sw23-card-body { padding:11px 12px 13px; }',
    '.sw23-card-cat {',
      'font-size:8px;font-weight:700;letter-spacing:1.5px;',
      'color:rgba(197,160,89,.6);text-transform:uppercase;margin-bottom:4px;',
    '}',
    '.sw23-card-title {',
      'font-family:"Playfair Display","IM Fell English",Georgia,serif;',
      'font-size:.88rem;font-weight:700;color:#F5EFE2;',
      'line-height:1.3;margin-bottom:6px;',
    '}',
    '.sw23-card-meta {',
      'font-size:10px;color:rgba(245,239,226,.3);',
      'display:flex;align-items:center;justify-content:space-between;',
    '}',
    '.sw23-badge-ai {',
      'font-size:8px;background:rgba(125,218,138,.15);',
      'color:rgba(125,218,138,.7);padding:2px 5px;border-radius:3px;',
    '}',
    '.sw23-badge-elite {',
      'background:rgba(197,160,89,.9);color:#0A0705;',
      'font-family:Cinzel,serif;font-size:7px;font-weight:700;',
      'letter-spacing:2px;padding:3px 10px;text-align:center;',
    '}',
    '.sw23-badge-news {',
      'background:rgba(20,60,140,.6);',
      'color:rgba(180,220,255,.9);',
      'font-family:Cinzel,serif;font-size:7px;font-weight:700;',
      'letter-spacing:2px;padding:3px 10px;text-align:center;',
    '}',

    /* Card curiosità */
    '.sw23-cur-card {',
      'flex:0 0 215px;min-width:215px;scroll-snap-align:start;',
      'border-radius:10px;overflow:hidden;cursor:pointer;',
      'border:1px solid rgba(197,160,89,.15);',
      'transition:transform .2s,box-shadow .2s;',
    '}',
    '.sw23-cur-card:hover {',
      'transform:translateY(-2px);',
      'box-shadow:0 8px 24px rgba(0,0,0,.5);',
    '}',
    '.sw23-cur-body { padding:16px 14px 14px; }',
    '.sw23-cur-ico { font-size:1.8rem;margin-bottom:8px; }',
    '.sw23-cur-tema {',
      'font-size:8px;font-weight:700;letter-spacing:2px;',
      'color:rgba(197,160,89,.5);text-transform:uppercase;margin-bottom:6px;',
    '}',
    '.sw23-cur-title {',
      'font-family:"Playfair Display",Georgia,serif;',
      'font-size:.85rem;font-weight:700;color:#F5EFE2;',
      'line-height:1.3;margin-bottom:8px;',
    '}',
    '.sw23-cur-text {',
      'font-family:"Cormorant Garamond",Georgia,serif;',
      'font-size:.82rem;line-height:1.6;color:rgba(245,239,226,.65);',
    '}',

    /* Reader */
    '#sw23-reader {',
      'display:none;position:fixed;inset:0;z-index:999950;',
      'background:#0A0705;overflow-y:auto;-webkit-overflow-scrolling:touch;',
    '}',
    '#sw23-reader-nav {',
      'position:sticky;top:0;z-index:2;',
      'background:rgba(10,7,5,.97);backdrop-filter:blur(12px);',
      'border-bottom:1px solid rgba(197,160,89,.12);',
      'display:flex;align-items:center;gap:12px;padding:12px 16px;',
    '}',
    '.sw23-back-btn {',
      'width:36px;height:36px;border-radius:50%;flex-shrink:0;',
      'background:rgba(197,160,89,.1);border:1px solid rgba(197,160,89,.2);',
      'color:#C5A059;font-size:18px;cursor:pointer;',
      'display:flex;align-items:center;justify-content:center;',
    '}',

    /* Pagina contatti */
    '#sw23-contact-page {',
      'display:none;position:fixed;inset:0;z-index:999900;',
      'background:#0A0705;overflow-y:auto;-webkit-overflow-scrolling:touch;',
    '}',
    '.sw23-input {',
      'width:100%;box-sizing:border-box;padding:11px 13px;',
      'background:rgba(255,255,255,.05);',
      'border:1px solid rgba(197,160,89,.2);border-radius:8px;',
      'color:#F5EFE2;font-family:Lato,sans-serif;font-size:15px;',
      'outline:none;display:block;transition:border-color .2s;',
    '}',
    '.sw23-input:focus { border-color:rgba(197,160,89,.5); }',
    '.sw23-lbl {',
      'display:block;font-size:9px;font-weight:700;letter-spacing:2px;',
      'color:rgba(197,160,89,.55);text-transform:uppercase;margin-bottom:5px;',
    '}',
    '.sw23-send-btn {',
      'width:100%;padding:14px;',
      'background:rgba(197,160,89,.18);',
      'border:1.5px solid rgba(197,160,89,.45);border-radius:8px;',
      'color:#C5A059;font-family:Cinzel,serif;font-size:.6rem;',
      'font-weight:700;letter-spacing:3px;cursor:pointer;',
      'transition:background .2s;',
    '}',
    '.sw23-send-btn:hover { background:rgba(197,160,89,.28); }',
    '.sw23-send-btn:disabled { opacity:.5;cursor:default; }',
  ].join('');
  document.head.appendChild(s);
})();

/* ════════════════════════════════════════════════
   UTILITÀ
   ════════════════════════════════════════════════ */
function getLang() {
  return (window.i18n && window.i18n.current) ||
    localStorage.getItem('sw_lang') || 'it';
}
function tf(art, field) {
  var l = getLang();
  return art[field + '_' + l] || art[field + '_it'] || art[field] || '';
}

var BG = [
  'linear-gradient(135deg,rgba(74,14,14,.95),rgba(30,4,4,.8))',
  'linear-gradient(135deg,rgba(4,40,74,.95),rgba(2,18,50,.8))',
  'linear-gradient(135deg,rgba(4,60,40,.95),rgba(2,32,22,.8))',
  'linear-gradient(135deg,rgba(60,40,4,.95),rgba(32,20,2,.8))',
  'linear-gradient(135deg,rgba(40,4,74,.95),rgba(20,2,45,.8))',
  'linear-gradient(135deg,rgba(60,10,50,.95),rgba(32,5,28,.8))',
];

/* ════════════════════════════════════════════════
   ARTICOLI LOCALI (sempre disponibili)
   ════════════════════════════════════════════════ */
var LOCAL_ARTS = [
  {
    id:'l1', isNews:true,
    titolo_it:'Barolo 2016: la Vendemmia del Secolo',
    titolo_en:'Barolo 2016: Vintage of the Century',
    titolo_fr:'Barolo 2016 : Millésime du Siècle',
    categoria_it:'🍷 Annate', categoria_en:'🍷 Vintages', categoria_fr:'🍷 Millésimes',
    testo_it:'Il 2016 è la più grande annata delle Langhe degli ultimi trent\'anni. Estate perfetta, nessuno stress idrico, escursioni termiche straordinarie ad agosto e settembre.\n\nMonfortino di Giacomo Conterno, Rocche dell\'Annunziata di Paolo Scavino, Cerretta di Elio Grasso: capolavori destinati a durare cinquant\'anni.\n\nSe lo trovi ancora a prezzo ragionevole, compralo senza esitare.',
    testo_en:'The 2016 vintage is the greatest in the Langhe for thirty years. Perfect summer, no water stress, extraordinary temperature swings. These wines will last fifty years.',
    testo_fr:'Le 2016 est le plus grand millésime des Langhe depuis trente ans. Ces vins dureront cinquante ans.',
    autore:'Timotin', data:'Aprile 2026',
  },
  {
    id:'l2', isNews:false,
    titolo_it:'Come Leggere un\'Etichetta del Vino',
    titolo_en:'How to Read a Wine Label',
    titolo_fr:'Comment Lire une Étiquette',
    categoria_it:'📚 Tecnica', categoria_en:'📚 Technique', categoria_fr:'📚 Technique',
    testo_it:'DOC, DOCG, IGT, AOC: capire la classificazione permette di scegliere il vino giusto in secondi.\n\nRegola d\'oro dei professionisti: il nome del produttore viene prima della denominazione. Un grande produttore in una zona minore batte spesso un mediocre in una zona famosa.\n\nL\'annata è il secondo elemento da guardare: cambia radicalmente il carattere del vino ogni anno.',
    testo_en:'DOC, DOCG, IGT, AOC: understanding classification lets you choose correctly in seconds.',
    testo_fr:'Comprendre la classification vous permet de choisir correctement en quelques secondes.',
    autore:'Timotin', data:'Aprile 2026',
  },
  {
    id:'l3', isNews:false,
    titolo_it:'Etna: il Vulcano che ha Cambiato il Vino',
    titolo_en:'Etna: The Volcano that Changed Wine',
    titolo_fr:'L\'Etna : Volcan qui a Changé le Vin',
    categoria_it:'🌍 Terroir', categoria_en:'🌍 Terroir', categoria_fr:'🌍 Terroir',
    testo_it:'Le 133 contrade dell\'Etna identificano vigneti centenari ad alberello su sabbie laviche tra 400 e 1000 metri.\n\nNerello Mascalese: rossi trasparenti vicini al Pinot Nero di Borgogna. Cornelissen, Terre Nere, Benanti, Passopisciaro sono i nomi da conoscere.\n\nChi compra Etna oggi compra il futuro del vino italiano.',
    testo_en:'Etna\'s 133 contrade identify century-old vines on volcanic soils between 400 and 1000 metres.',
    testo_fr:'Les 133 contrade de l\'Etna identifient des vignes centenaires sur sols volcaniques.',
    autore:'Timotin', data:'Marzo 2026',
  },
  {
    id:'l4', isNews:false,
    titolo_it:'Champagne: Scegliere la Bottiglia Giusta',
    titolo_en:'Champagne: Choosing the Right Bottle',
    titolo_fr:'Champagne : Choisir la Bonne Bouteille',
    categoria_it:'✨ Guide', categoria_en:'✨ Guides', categoria_fr:'✨ Guides',
    testo_it:'Tra 300 produttori la chiave è capire: tipologia (NV, Vintage, Prestige), dosaggio (Brut Nature a Demi-Sec), categoria produttore (RM vs NM).\n\nI Recoltant Manipulant producono solo con uve proprie: Selosse, Chartogne-Taillet, Bereche.\n\nRegola d\'oro: un buon NV da piccolo RM batte spesso le grandi maison alla stessa fascia di prezzo.',
    testo_en:'Among 300 producers the key is type, dosage and producer category.',
    testo_fr:'Parmi 300 producteurs, la clé est le type, le dosage et la catégorie.',
    autore:'Timotin', data:'Marzo 2026',
  },
  {
    id:'l5', isNews:false,
    titolo_it:'Vino e Formaggio: 10 Abbinamenti Perfetti',
    titolo_en:'Wine and Cheese: 10 Perfect Pairings',
    titolo_fr:'Vin et Fromage : 10 Accords Parfaits',
    categoria_it:'🍽 Abbinamenti', categoria_en:'🍽 Pairings', categoria_fr:'🍽 Accords',
    testo_it:'Formaggi freschi con bianchi leggeri. Stagionati con rossi strutturati. Erborinati con vini dolci.\n\nI 10 da sapere: Parmigiano + Lambrusco, Pecorino + Vermentino, Gorgonzola + Sauternes, Brie + Blanc de Blancs, Stilton + Porto Vintage, Taleggio + Barbaresco.\n\nPartenza sicura: Champagne brut con qualsiasi formaggio.',
    testo_en:'Fresh cheeses with light whites. Aged with reds. Blue cheeses with sweet wines.',
    testo_fr:'Frais avec blancs légers. Affinés avec rouges. Bleus avec doux.',
    autore:'Timotin', data:'Febbraio 2026',
  },
];

/* ════════════════════════════════════════════════
   30 CURIOSITÀ
   ════════════════════════════════════════════════ */
var CUR = [
  {ico:'🌱',t:'Viticoltura',h:'Il Ciclo Annuale della Vite',b:'La vite percorre 4 stagioni: germogliamento (marzo), fioritura (giugno), invaiatura - cambio colore acino (agosto), vendemmia (settembre-ottobre). Un solo giorno di pioggia fuori tempo può cambiare tutto.'},
  {ico:'🔪',t:'Sommelier',h:'Come si Apre una Bottiglia',b:'Il sommelier taglia la capsula sotto il secondo anello, inserisce la vite al centro del sughero, ruota 6 volte, aggancia le due leve e solleva con movimento fluido. Il sughero deve uscire in silenzio.'},
  {ico:'🥂',t:'Bicchieri',h:'Perché il Calice ha lo Stelo',b:'Lo stelo del calice esiste per evitare che il calore della mano scaldi il vino. Per i rossi strutturati si regge dallo stelo. Per i vini da meditazione si può reggere dalla coppa per scaldarli.'},
  {ico:'🌡️',t:'Servizio',h:'La Temperatura di Servizio',b:'Spumanti 6-8°C, bianchi leggeri 8-10°C, bianchi strutturati 10-12°C, rosé 10-12°C, rossi leggeri 14-16°C, rossi strutturati 16-18°C. Mai oltre 18°C: l\'alcol copre tutto.'},
  {ico:'🦟',t:'Storia',h:'La Fillossera che Cambiò Tutto',b:'Tra 1863 e 1900 la fillossera distrusse il 90% dei vigneti europei. La soluzione: innestare le viti europee su radici americane resistenti. Quasi tutte le viti del mondo sono ancora così oggi.'},
  {ico:'⚗️',t:'Enologia',h:'La Fermentazione Malolattica',b:'Trasforma l\'acido malico (aspro) in lattico (morbido). Nei rossi è quasi sempre completata; nei bianchi il produttore sceglie: completarla dà morbidezza, bloccarla conserva freschezza.'},
  {ico:'🪨',t:'Terroir',h:'Il Calcare e la Mineralità',b:'Il calcare è il suolo del vino di qualità: drena bene, forza le radici in profondità, dona mineralità e freschezza. Borgogna, Champagne, Barolo, Chablis sono tutti su suoli calcarei.'},
  {ico:'🏺',t:'Storia',h:'8000 Anni di Vino',b:'I primi segni di vinificazione risalgono al 6000 a.C. in Georgia, dove si faceva fermentare l\'uva in anfore di argilla (kvevri) interrate nel terreno. Questo metodo produce ancora oggi i vini arancioni.'},
  {ico:'💧',t:'Degustazione',h:'Le Lacrime del Vino',b:'Le lacrime che scendono lungo il calice non indicano qualità ma alcol. Più sono marcate, più il vino è alcolico. Si formano per il diverso tasso di evaporazione tra alcol e acqua.'},
  {ico:'🔑',t:'Sommelier',h:'Il Tastevin',b:'Il piccolo disco d\'argento che i sommelier portano al collo era usato nelle cantine buie per valutare il colore del vino alla luce di una candela. Oggi è un simbolo onorifico.'},
  {ico:'🌊',t:'Terroir',h:'Il Vino e il Mare',b:'I vigneti vicino al mare producono vini sapidi e iodati. Vermentino sardo, Assyrtiko di Santorini, Muscadet: tutti mostrano quella mineralità marina inconfondibile.'},
  {ico:'🎭',t:'Storia',h:'Napoleone e il Chambertin',b:'Napoleone Bonaparte portava il Chambertin in ogni battaglia. Durante la campagna di Russia del 1812, quando rimase senza, attribuì parte dei fallimenti militari alla sua mancanza.'},
  {ico:'🪵',t:'Enologia',h:'Rovere Francese vs Americano',b:'Rovere francese: grana fine, vaniglia e spezie eleganti. Rovere americano: grana larga, cocco e vaniglia intensa. I Rioja storici usano americano; i Barolo moderni preferiscono il francese.'},
  {ico:'🏔️',t:'Viticoltura',h:'Altitudine e Acidità',b:'In quota le temperature notturne scendono e l\'escursione termica aumenta. Questo rallenta la maturazione e permette all\'uva di sviluppare zuccheri mantenendo l\'acidità. I migliori vini delle zone calde vengono da vigneti in quota.'},
  {ico:'🎨',t:'Degustazione',h:'Il Colore Racconta Tutto',b:'Un Barolo giovane è rubino con riflessi viola; a 10 anni granato; a 20 anni si tinge d\'arancio ai bordi. Nei bianchi l\'inverso: da paglierino verdognolo a dorato intenso.'},
  {ico:'🌙',t:'Viticoltura',h:'La Viticoltura Biodinamica',b:'Il calendario biodinamico divide i giorni in: Radice (vinificazione), Fiore (bianchi), Frutto (rossi), Foglia (vino chiuso). Rudolf Steiner ha codificato questo sistema negli anni 20.'},
  {ico:'💎',t:'Mercato',h:'Il Vino più Costoso del Mondo',b:'La Romanée-Conti 1945 è stata venduta per 558.000 dollari per bottiglia nel 2018 da Sotheby\'s. Probabilmente non è mai stata aperta. Il vino da collezione diventa un\'opera d\'arte.'},
  {ico:'👃',t:'Degustazione',h:'Come si Annusa il Vino',b:'Prima annusata a naso fermo: aromi primari (frutta, fiori). Poi ruota il calice e annusa subito dopo: aromi secondari e terziari (cuoio, tabacco, terra). Il naso racconta l\'80% del vino.'},
  {ico:'🌿',t:'Viticoltura',h:'La Potatura Invernale',b:'La potatura è il gesto più importante dell\'anno in vigna. Si esegue da dicembre a febbraio. Ogni tralcio tagliato è una scelta: quanti grappoli, quanto concentrata sarà l\'uva.'},
  {ico:'🧪',t:'Enologia',h:'I Solfiti nel Vino',b:'I solfiti sono conservanti naturali usati dai Romani. Tutti i vini ne contengono in piccole quantità. Non causano il mal di testa: è l\'alcol che lo provoca.'},
  {ico:'🏛️',t:'Storia',h:'Il Symposium Greco',b:'Nell\'antica Grecia il simposio era una cerimonia del vino. Si beveva sempre diluito (3 parti acqua, 1 vino). Bere vino puro era considerato barbaro. La moderazione era il valore supremo.'},
  {ico:'🎪',t:'Denominazioni',h:'DOCG: Solo 77 in Italia',b:'La DOCG è il livello massimo italiano. Esistono solo 77 DOCG. La prima fu assegnata nel 1980 a Barolo, Barbaresco, Brunello di Montalcino e Albana di Romagna.'},
  {ico:'📐',t:'Servizio',h:'Quanto Vino Versare',b:'La regola professionale: mai oltre un terzo del calice. Un Borgogna grande si versa per un quarto. Il vino deve respirare nel calice per sprigionare gli aromi.'},
  {ico:'🗺️',t:'Denominazioni',h:'La Classificazione del 1855',b:'Nel 1855 Napoleone III chiese di classificare i migliori Bordeaux. Nacquero i Premiers Crus: Lafite, Latour, Margaux, Haut-Brion. Solo nel 1973 fu aggiunto Mouton Rothschild.'},
  {ico:'🦠',t:'Enologia',h:'I Lieviti Selvaggi',b:'I lieviti indigeni vivono sulla buccia dell\'uva e nella cantina. La fermentazione spontanea produce vini con carattere unico. I lieviti commerciali garantiscono risultati stabili ma omologano i vini.'},
  {ico:'🌬️',t:'Viticoltura',h:'Il Vento in Vigna',b:'Il vento è il primo alleato contro le malattie fungine: asciuga il grappolo dopo la pioggia. Il Mistral, il Maestrale, il Tramontano: tutti permettono meno trattamenti chimici.'},
  {ico:'🎻',t:'Storia',h:'Dom Perignon e il Mito',b:'Dom Pérignon non ha inventato lo Champagne. Il monaco cercava di ELIMINARE le bollicine, che rompevano le bottiglie. Erano un difetto. A inventare il metodo classico furono gli inglesi.'},
  {ico:'🐝',t:'Viticoltura',h:'La Biodiversità in Vigna',b:'Api, lombrichi, lucertole, ragni: ogni essere vivente contribuisce all\'equilibrio. In un ettaro di vigna sana vivono più di 1 milione di organismi diversi.'},
  {ico:'✨',t:'Sommelier',h:'L\'Esame AIS',b:'Per diventare Sommelier AIS ci vogliono 3 livelli: storia e geografia del vino, abbinamento cibo-vino, degustazione professionale. L\'esame finale include una degustazione alla cieca di 3 vini.'},
  {ico:'🌺',t:'Degustazione',h:'Il Vino e i 5 Sensi',b:'Vista: colore e limpidezza. Olfatto: prima e dopo la rotazione. Tatto: morbidezza e astringenza. Gusto: dolce, acido, amaro, sapido. Udito: il suono del tappo. Solo il vino coinvolge tutti e 5 i sensi.'},
];

/* ════════════════════════════════════════════════
   STATO
   ════════════════════════════════════════════════ */
var _arts = [];
var _readerOpen = false;

/* ════════════════════════════════════════════════
   PRODUTTORI ELITE dal localStorage
   ════════════════════════════════════════════════ */
function getElite() {
  try {
    return JSON.parse(localStorage.getItem('sw_elite_producers') || '[]')
      .filter(function(p) { return p.nome && p.descrizione; })
      .map(function(p, i) {
        return {
          id: 'elite-' + i, isElite: true,
          titolo_it: '👑 ' + p.nome, titolo_en: '👑 ' + p.nome, titolo_fr: '👑 ' + p.nome,
          categoria_it: '👑 Elite Producer', categoria_en: '👑 Elite', categoria_fr: '👑 Elite',
          testo_it: p.descrizione, autore: p.nome, data: p.data || '', producer: p,
        };
      });
  } catch(e) { return []; }
}

/* ════════════════════════════════════════════════
   CARICA ARTICOLI DAL SERVER
   ════════════════════════════════════════════════ */
async function loadArts() {
  _arts = getElite().concat(LOCAL_ARTS);
  renderMag();

  try {
    var ctrl = new AbortController();
    setTimeout(function() { ctrl.abort(); }, 6000);
    var r = await fetch(CFG.server + '/api/articles', { signal: ctrl.signal });
    if (r.ok) {
      var data = await r.json();
      if (data && data.length) {
        data.forEach(function(a) {
          if (!a.titolo) a.titolo = a.titolo_it || a.titolo_en || '';
          if (!a.categoria) a.categoria = a.categoria_it || a.categoria_en || '';
          if (!a.testo) a.testo = a.testo_it || a.testo_en || '';
        });
        _arts = getElite().concat(data);
        renderMag();
        console.log('[v23] ' + data.length + ' articoli dal server');
      }
    }
  } catch(e) {
    console.log('[v23] Articoli locali (server: ' + e.message + ')');
  }
}

/* ════════════════════════════════════════════════
   RENDER CAROSELLO MAGAZINE
   ════════════════════════════════════════════════ */
function renderMag() {
  var c = document.getElementById('sw-carousel');
  if (!c) return;
  c.innerHTML = '';

  var cnt = document.getElementById('sw-art-count');
  if (cnt) cnt.textContent = _arts.length + ' articoli';

  _arts.forEach(function(art, i) {
    var tit = tf(art, 'titolo') || art.titolo || '';
    var cat = tf(art, 'categoria') || art.categoria || 'Magazine';
    var isE = !!art.isElite;
    var isN = !!art.isNews;
    var isAI = !!art.generato_ai;
    var bg = BG[i % BG.length];
    var ico = isE ? '👑' : (isN ? '🗞' : ['🍷','🌿','📚','🥂','🌍','✨'][i % 6]);

    var card = document.createElement('div');
    card.className = 'sw23-card';
    card.style.border = '1px solid ' + (isE ? 'rgba(197,160,89,.5)' : (isN ? 'rgba(100,180,255,.2)' : 'rgba(197,160,89,.1)'));

    card.innerHTML =
      (isE ? '<div class="sw23-badge-elite">👑 ELITE PRODUCER</div>' : '') +
      (isN && !isE ? '<div class="sw23-badge-news">🗞 NOTIZIA</div>' : '') +
      '<div class="sw23-card-thumb" style="background:' + bg + ';">' +
        (art.immagine ? '<img class="sw23-card-img" src="' + art.immagine + '" loading="lazy" onerror="this.style.display=\'none\'">' : '') +
        '<span class="sw23-card-ico">' + ico + '</span>' +
      '</div>' +
      '<div class="sw23-card-body">' +
        '<div class="sw23-card-cat">' + cat + '</div>' +
        '<div class="sw23-card-title">' + tit + '</div>' +
        '<div class="sw23-card-meta">' +
          '<span>' + (art.data || '') + (art.autore ? ' · ' + art.autore : '') + '</span>' +
          (isAI ? '<span class="sw23-badge-ai">✦ AI</span>' : '') +
        '</div>' +
      '</div>';

    card.onclick = function() { openReader(art, i); };
    c.appendChild(card);
  });
}

/* ════════════════════════════════════════════════
   ARTICLE READER
   ════════════════════════════════════════════════ */
function openReader(art, idx) {
  var tit = tf(art, 'titolo') || art.titolo || '';
  var cat = tf(art, 'categoria') || art.categoria || '';
  var txt = tf(art, 'testo') || art.testo || '';
  var bg = BG[(idx || 0) % BG.length];

  var paras = (txt || '').split(/\n\n+/).filter(Boolean)
    .map(function(p) { return '<p style="margin:0 0 20px;">' + p.trim() + '</p>'; })
    .join('');

  var r = document.getElementById('sw23-reader');
  if (!r) {
    r = document.createElement('div');
    r.id = 'sw23-reader';
    document.body.appendChild(r);
  }

  r.innerHTML =
    '<div id="sw23-reader-nav">' +
      '<button class="sw23-back-btn" onclick="document.getElementById(\'sw23-reader\').style.display=\'none\';document.body.style.overflow=\'\'">←</button>' +
      '<div style="font-family:Cinzel,serif;font-size:.6rem;letter-spacing:2px;color:rgba(197,160,89,.6);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + tit + '</div>' +
    '</div>' +
    '<div style="max-width:720px;margin:0 auto;padding-bottom:80px;">' +
      '<div style="width:100%;height:220px;background:' + bg + ';display:flex;align-items:center;justify-content:center;font-size:4rem;position:relative;overflow:hidden;">' +
        (art.immagine ? '<img src="' + art.immagine + '" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" onerror="this.style.display=\'none\'">' : '') +
        '<span style="position:relative;z-index:1;filter:drop-shadow(0 2px 12px rgba(0,0,0,.9));">🍷</span>' +
      '</div>' +
      '<div style="padding:24px 20px 0;">' +
        '<div style="font-size:9px;font-weight:700;letter-spacing:3px;color:rgba(197,160,89,.5);text-transform:uppercase;margin-bottom:10px;">' + cat + '</div>' +
        '<h1 style="font-family:\'Playfair Display\',Georgia,serif;font-size:1.5rem;font-weight:700;line-height:1.25;color:#F5EFE2;margin:0 0 14px;">' + tit + '</h1>' +
        '<div style="font-size:11px;color:rgba(245,239,226,.35);margin-bottom:22px;padding-bottom:14px;border-bottom:1px solid rgba(197,160,89,.1);display:flex;gap:8px;flex-wrap:wrap;align-items:center;">' +
          (art.data ? '<span>' + art.data + '</span>' : '') +
          (art.autore ? '<span>·</span><span>' + art.autore + '</span>' : '') +
          (art.generato_ai ? '<span style="background:rgba(125,218,138,.12);color:rgba(125,218,138,.7);font-size:9px;padding:2px 7px;border-radius:3px;">✦ AI</span>' : '') +
        '</div>' +
        '<div style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:1.05rem;line-height:2;color:rgba(245,239,226,.85);">' +
          (paras || '<p style="color:rgba(245,239,226,.4);">Contenuto non disponibile.</p>') +
        '</div>' +
        (art.isElite && art.producer ? buildEliteCard(art.producer) : '') +
      '</div>' +
    '</div>';

  r.style.display = 'block';
  r.scrollTop = 0;
  document.body.style.overflow = 'hidden';
  _readerOpen = true;
  try { history.pushState({ sw23r: 1 }, ''); } catch(e) {}
}

function buildEliteCard(p) {
  return '<div style="margin:24px 0;padding:18px;background:rgba(197,160,89,.06);border:1px solid rgba(197,160,89,.25);border-radius:10px;">' +
    '<div style="font-size:8px;font-weight:700;letter-spacing:2px;color:#C5A059;margin-bottom:8px;">👑 PRODUTTORE ELITE</div>' +
    '<div style="font-family:\'Playfair Display\',serif;font-size:1rem;font-weight:700;color:#F5EFE2;margin-bottom:4px;">' + (p.nome || '') + '</div>' +
    '<div style="font-size:11px;color:rgba(197,160,89,.6);margin-bottom:8px;">' + (p.denominazione || p.regione || '') + '</div>' +
    '<div style="font-family:\'IM Fell English\',serif;font-style:italic;font-size:.9rem;line-height:1.75;color:rgba(245,239,226,.65);">' + (p.descrizione || '') + '</div>' +
    (p.sito ? '<a href="' + p.sito + '" target="_blank" style="display:inline-block;margin-top:12px;padding:8px 16px;background:rgba(197,160,89,.12);border:1px solid rgba(197,160,89,.3);border-radius:6px;color:#C5A059;font-size:10px;font-weight:700;text-decoration:none;">🌐 Visita il sito →</a>' : '') +
  '</div>';
}

window.addEventListener('popstate', function() {
  if (_readerOpen) {
    var r = document.getElementById('sw23-reader');
    if (r) r.style.display = 'none';
    document.body.style.overflow = '';
    _readerOpen = false;
  }
});

/* ════════════════════════════════════════════════
   SEZIONE CURIOSITÀ
   ════════════════════════════════════════════════ */
function renderCuriosity() {
  var c = document.getElementById('sw-curiosity-cards');
  if (!c) return;

  var d = document.getElementById('sw-cur-date');
  if (d) d.textContent = new Date().toLocaleDateString('it-IT', { weekday:'long', day:'numeric', month:'long' });

  var dayN = Math.floor(Date.now() / 86400000);
  var shown = [];
  for (var i = 0; i < 8; i++) shown.push(CUR[(dayN + i) % CUR.length]);

  c.innerHTML = '';
  shown.forEach(function(cur, i) {
    var card = document.createElement('div');
    card.className = 'sw23-cur-card';
    card.style.background = BG[i % BG.length];

    card.innerHTML =
      '<div class="sw23-cur-body">' +
        '<div class="sw23-cur-ico">' + cur.ico + '</div>' +
        '<div class="sw23-cur-tema">' + cur.t + '</div>' +
        '<div class="sw23-cur-title">' + cur.h + '</div>' +
        '<div class="sw23-cur-text">' + cur.b.substring(0, 115) + '…</div>' +
      '</div>';

    card.onclick = function() {
      openReader({
        titolo: cur.h,
        categoria: '🎓 ' + cur.t,
        testo: cur.b,
        autore: 'Sommelier World',
        data: new Date().toLocaleDateString('it-IT'),
      }, i);
    };
    c.appendChild(card);
  });
}

/* ════════════════════════════════════════════════
   PAGINA CONTATTI
   ════════════════════════════════════════════════ */
window.swOpenContact = function() {
  document.querySelectorAll('.ntab').forEach(function(t) { t.classList.remove('active'); });

  var p = document.getElementById('sw23-contact-page');
  if (p) {
    p.style.display = 'block';
    document.body.style.overflow = 'hidden';
    return;
  }

  p = document.createElement('div');
  p.id = 'sw23-contact-page';

  p.innerHTML =
    '<div style="position:sticky;top:0;z-index:2;background:rgba(10,7,5,.97);backdrop-filter:blur(12px);border-bottom:1px solid rgba(197,160,89,.15);display:flex;align-items:center;gap:12px;padding:13px 16px;">' +
      '<button onclick="swCloseContact()" style="width:36px;height:36px;border-radius:50%;background:rgba(197,160,89,.1);border:1px solid rgba(197,160,89,.2);color:#C5A059;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;">←</button>' +
      '<div style="font-family:Cinzel,serif;font-size:.65rem;letter-spacing:3px;color:#F5EFE2;">CONTATTI</div>' +
    '</div>' +
    '<div style="max-width:540px;margin:0 auto;padding:28px 20px 80px;box-sizing:border-box;">' +
      '<div style="text-align:center;margin-bottom:28px;">' +
        '<div style="font-size:9px;font-weight:700;letter-spacing:3px;color:rgba(197,160,89,.5);text-transform:uppercase;margin-bottom:8px;">✉️ SCRIVICI</div>' +
        '<h2 style="font-family:\'Playfair Display\',serif;font-size:1.5rem;font-weight:700;color:#F5EFE2;margin:0 0 8px;">Come possiamo aiutarti?</h2>' +
        '<p style="font-size:13px;color:rgba(245,239,226,.4);line-height:1.7;margin:0;">Produttori, collaborazioni, segnalazioni.<br>Risponderemo entro 48 ore.</p>' +
      '</div>' +
      '<div id="sw23-c-ok" style="display:none;text-align:center;padding:24px;background:rgba(125,218,138,.08);border:1px solid rgba(125,218,138,.2);border-radius:10px;margin-bottom:20px;">' +
        '<div style="font-size:2rem;margin-bottom:8px;">✓</div>' +
        '<div style="font-family:\'Playfair Display\',serif;color:#7dda8a;font-size:1rem;">Messaggio inviato!</div>' +
        '<div style="font-size:13px;color:rgba(245,239,226,.4);margin-top:6px;">Ti risponderemo entro 48 ore.</div>' +
      '</div>' +
      '<div id="sw23-c-form">' +
        '<div style="margin-bottom:16px;"><label class="sw23-lbl">NOME *</label><input id="sw23-cn" class="sw23-input" type="text" placeholder="Il tuo nome" autocomplete="name"></div>' +
        '<div style="margin-bottom:16px;"><label class="sw23-lbl">EMAIL *</label><input id="sw23-ce" class="sw23-input" type="email" placeholder="tua@email.com" autocomplete="email"></div>' +
        '<div style="margin-bottom:16px;"><label class="sw23-lbl">ARGOMENTO</label>' +
          '<select id="sw23-cs" class="sw23-input" style="cursor:pointer;"><option value="">— Seleziona —</option><option>🏭 Produttore / cantina</option><option>👑 Piano Elite</option><option>🥂 Collaborazione sommelier</option><option>🛠 Segnalazione errore</option><option>💬 Altro</option></select>' +
        '</div>' +
        '<div style="margin-bottom:16px;"><label class="sw23-lbl">MESSAGGIO *</label><textarea id="sw23-cm" class="sw23-input" style="height:110px;resize:none;" placeholder="Scrivi qui..."></textarea></div>' +
        '<button onclick="swSendContact()" id="sw23-cbtn" class="sw23-send-btn">✦ INVIA MESSAGGIO ✦</button>' +
        '<div id="sw23-cerr" style="display:none;margin-top:10px;padding:10px;background:rgba(220,50,50,.15);border:1px solid rgba(220,50,50,.3);border-radius:6px;font-size:12px;color:rgba(255,150,150,.9);text-align:center;"></div>' +
      '</div>' +
      '<div style="text-align:center;margin-top:28px;padding-top:20px;border-top:1px solid rgba(197,160,89,.1);">' +
        '<div style="font-size:12px;color:rgba(245,239,226,.3);margin-bottom:6px;">Oppure scrivi a</div>' +
        '<a href="mailto:info@sommelierworld.vin" style="color:rgba(197,160,89,.6);font-size:13px;text-decoration:none;">info@sommelierworld.vin</a>' +
      '</div>' +
    '</div>';

  document.body.appendChild(p);
  p.style.display = 'block';
  document.body.style.overflow = 'hidden';
};

window.swCloseContact = function() {
  var p = document.getElementById('sw23-contact-page');
  if (p) p.style.display = 'none';
  document.body.style.overflow = '';
  document.querySelectorAll('.ntab').forEach(function(t) { t.classList.remove('active'); });
  var h = document.querySelector('[data-page="home"]');
  if (h) h.classList.add('active');
};

window.swSendContact = async function() {
  var n = (document.getElementById('sw23-cn') || {}).value || '';
  var e = (document.getElementById('sw23-ce') || {}).value || '';
  var s = (document.getElementById('sw23-cs') || {}).value || '';
  var m = (document.getElementById('sw23-cm') || {}).value || '';
  var err = document.getElementById('sw23-cerr');
  var btn = document.getElementById('sw23-cbtn');

  n = n.trim(); e = e.trim(); m = m.trim();

  function showErr(t) { if (err) { err.textContent = t; err.style.display = 'block'; } }
  if (!n) return showErr('Inserisci il tuo nome.');
  if (!e || !e.includes('@')) return showErr('Email non valida.');
  if (m.length < 4) return showErr('Messaggio troppo corto.');

  if (err) err.style.display = 'none';
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Invio in corso...'; }

  var sent = false;
  try {
    var ctrl = new AbortController();
    setTimeout(function() { ctrl.abort(); }, 8000);
    var r = await fetch(CFG.server + '/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: n, email: e, subject: s, message: m }),
      signal: ctrl.signal,
    });
    if (r.ok) { var d = await r.json(); sent = !!d.ok; }
  } catch(ex) {}

  if (!sent) {
    window.location.href = 'mailto:info@sommelierworld.vin' +
      '?subject=' + encodeURIComponent('[SW] ' + (s || 'Messaggio da ' + n)) +
      '&body=' + encodeURIComponent('Da: ' + n + '\nEmail: ' + e + '\n\n' + m);
  }

  var frm = document.getElementById('sw23-c-form');
  var ok = document.getElementById('sw23-c-ok');
  if (frm) frm.style.display = 'none';
  if (ok) ok.style.display = 'block';
};

/* ════════════════════════════════════════════════
   MAPPA DARK — CartoDB Dark Matter
   ════════════════════════════════════════════════ */
function applyDarkMap() {
  if (typeof L === 'undefined' || !window.TILES) return;
  window.TILES.street = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  window.TILES.topo   = 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png';
  console.log('[v23] Mappa dark applicata');
}

/* ════════════════════════════════════════════════
   KILL FAB DUPLICATO ✉
   ════════════════════════════════════════════════ */
function killFAB() {
  document.querySelectorAll('#sw11-fab-contact, [id*="fab-contact"]')
    .forEach(function(el) { el.style.display = 'none'; el.style.visibility = 'hidden'; });
  window.fixContactButton = function() {};
}

/* ════════════════════════════════════════════════
   INIT
   ════════════════════════════════════════════════ */
function init() {
  console.log('[SW v23] Avvio — Magazine + Curiosità + Contatti + Mappa Dark');

  /* CSS scrollbar curiosità */
  var s2 = document.createElement('style');
  s2.textContent = '#sw-curiosity-cards::-webkit-scrollbar{display:none}#sw-carousel::-webkit-scrollbar{display:none}';
  document.head.appendChild(s2);

  applyDarkMap();
  killFAB();
  setTimeout(killFAB, 1000);
  setTimeout(killFAB, 3000);

  loadArts();
  renderCuriosity();

  /* Rirender quando cambia lingua */
  var origSetLang = window.i18n && window.i18n.setLang && window.i18n.setLang.bind(window.i18n);
  if (origSetLang) {
    window.i18n.setLang = function(l) {
      origSetLang(l);
      setTimeout(renderMag, 200);
    };
  }
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();

})();
