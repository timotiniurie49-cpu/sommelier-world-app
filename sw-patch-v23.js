/* SOMMELIER WORLD — PATCH v23
   Carosello Magazine + Curiosita + Contatti
   File separato per sicurezza (errori non rompono il resto) */
(function() {
'use strict';

var SRV = 'https://sommelier-server-production-8f92.up.railway.app';

/* ── Lingua ── */
function lang() {
  return (window.i18n && window.i18n.current) ||
    localStorage.getItem('sw_lang') || 'it';
}
function tf(art, f) {
  var l = lang();
  return art[f + '_' + l] || art[f + '_it'] || art[f] || '';
}

/* ── Articoli locali ── */
var LOCAL = [
  { id:'a1', isNews:true,
    titolo_it:'Barolo 2016: la Vendemmia del Secolo',
    titolo_en:'Barolo 2016: Vintage of the Century',
    titolo_fr:'Barolo 2016 : Millésime du Siècle',
    categoria_it:'🍷 Annate', categoria_en:'🍷 Vintages', categoria_fr:'🍷 Millésimes',
    testo_it:'Il 2016 è l\'annata più grande delle Langhe degli ultimi trent\'anni. Estate perfetta, escursioni termiche straordinarie, acidità cristallina.\n\nMonfortino di Giacomo Conterno, Rocche dell\'Annunziata di Paolo Scavino, Cerretta di Elio Grasso: capolavori destinati a cinquant\'anni.\n\nSe lo trovi a prezzo ragionevole, compralo senza esitare.',
    testo_en:'The 2016 vintage is the greatest in the Langhe for thirty years. These wines will last fifty years.',
    testo_fr:'Le 2016 est le plus grand millésime des Langhe depuis trente ans.',
    autore:'Timotin', data:'Aprile 2026' },
  { id:'a2', isNews:false,
    titolo_it:'Come Leggere un\'Etichetta del Vino',
    titolo_en:'How to Read a Wine Label',
    titolo_fr:'Comment Lire une Étiquette',
    categoria_it:'📚 Tecnica', categoria_en:'📚 Technique', categoria_fr:'📚 Technique',
    testo_it:'DOC, DOCG, IGT, AOC: capire la classificazione permette di scegliere in secondi.\n\nRegola d\'oro: il nome del produttore viene prima della denominazione. Un grande produttore in una zona minore batte un mediocre in una zona famosa.\n\nL\'annata è il secondo elemento: cambia radicalmente il carattere del vino ogni anno.',
    testo_en:'Understanding classification lets you choose in seconds. Always look at the producer first.',
    testo_fr:'Comprendre la classification vous permet de choisir en quelques secondes.',
    autore:'Timotin', data:'Aprile 2026' },
  { id:'a3', isNews:false,
    titolo_it:'Etna: il Vulcano che ha Cambiato il Vino',
    titolo_en:'Etna: The Volcano that Changed Wine',
    titolo_fr:'L\'Etna : le Volcan qui a Changé le Vin',
    categoria_it:'🌍 Terroir', categoria_en:'🌍 Terroir', categoria_fr:'🌍 Terroir',
    testo_it:'Le 133 contrade dell\'Etna identificano vigneti centenari ad alberello su sabbie laviche tra 400 e 1000 metri.\n\nNerello Mascalese: rossi trasparenti vicini al Pinot Nero di Borgogna. Cornelissen, Terre Nere, Benanti, Passopisciaro.\n\nChi compra Etna oggi compra il futuro del vino italiano.',
    testo_en:'Etna\'s 133 contrade identify century-old vines on volcanic soils.',
    testo_fr:'Les 133 contrade de l\'Etna identifient des vignes centenaires.',
    autore:'Timotin', data:'Marzo 2026' },
  { id:'a4', isNews:false,
    titolo_it:'Champagne: Scegliere la Bottiglia Giusta',
    titolo_en:'Champagne: Choose the Right Bottle',
    titolo_fr:'Champagne : Choisir la Bonne Bouteille',
    categoria_it:'✨ Guide', categoria_en:'✨ Guides', categoria_fr:'✨ Guides',
    testo_it:'Tra 300 produttori la chiave è capire: tipologia (NV, Vintage, Prestige), dosaggio (Brut Nature a Demi-Sec), categoria (RM vs NM).\n\nI Recoltant Manipulant producono solo con uve proprie: Selosse, Chartogne-Taillet.\n\nRegola d\'oro: un buon NV da piccolo RM batte spesso le grandi maison alla stessa fascia.',
    testo_en:'Among 300 producers the key is type, dosage and producer category.',
    testo_fr:'Parmi 300 producteurs, la clé est le type, le dosage et la catégorie.',
    autore:'Timotin', data:'Marzo 2026' },
  { id:'a5', isNews:false,
    titolo_it:'Vino e Formaggio: 10 Abbinamenti Perfetti',
    titolo_en:'Wine and Cheese: 10 Perfect Pairings',
    titolo_fr:'Vin et Fromage : 10 Accords Parfaits',
    categoria_it:'🍽 Abbinamenti', categoria_en:'🍽 Pairings', categoria_fr:'🍽 Accords',
    testo_it:'Freschi con bianchi leggeri. Stagionati con rossi strutturati. Erborinati con vini dolci.\n\nI 10 da sapere: Parmigiano + Lambrusco, Pecorino + Vermentino, Gorgonzola + Sauternes, Brie + Blanc de Blancs, Stilton + Porto, Taleggio + Barbaresco.\n\nPartenza sicura: Champagne brut con qualsiasi formaggio.',
    testo_en:'Fresh cheeses with light whites. Aged with reds. Blue with sweet wines.',
    testo_fr:'Frais avec blancs légers. Affinés avec rouges. Bleus avec doux.',
    autore:'Timotin', data:'Febbraio 2026' },
];

/* ── 30 Curiosità ── */
var CUR = [
  { ico:'🌱', t:'Viticoltura', h:'Il Ciclo Annuale della Vite',
    b:'La vite percorre 4 stagioni: germogliamento (marzo), fioritura (giugno), invaiatura - cambio colore acino (agosto), vendemmia (settembre-ottobre). Un giorno di pioggia fuori tempo può cambiare tutto.' },
  { ico:'🔪', t:'Sommelier', h:'Come si Apre una Bottiglia',
    b:'Il sommelier taglia la capsula sotto il secondo anello, inserisce la vite al centro del sughero, ruota 6 volte, aggancia le due leve e solleva con movimento fluido. Il sughero deve uscire silenzioso.' },
  { ico:'🥂', t:'Bicchieri', h:'Perché il Calice ha lo Stelo',
    b:'Lo stelo esiste per evitare che il calore della mano scaldi il vino. Per i rossi strutturati si regge dallo stelo. Per i vini da meditazione si può reggere dalla coppa per scaldarli leggermente.' },
  { ico:'🌡️', t:'Servizio', h:'La Temperatura Giusta',
    b:'Spumanti 6-8°C, bianchi leggeri 8-10°C, bianchi strutturati 10-12°C, rosé 10-12°C, rossi leggeri 14-16°C, rossi strutturati 16-18°C. Mai oltre 18°C: l\'alcol copre tutto.' },
  { ico:'🦠', t:'Storia', h:'La Fillossera che Cambio Tutto',
    b:'Tra il 1863 e il 1900 la fillossera distrusse il 90% dei vigneti europei. La soluzione: innestare le viti europee su radici americane resistenti. Quasi tutte le viti del mondo sono ancora così oggi.' },
  { ico:'⚗️', t:'Enologia', h:'La Fermentazione Malolattica',
    b:'Trasforma l\'acido malico (aspro, mela verde) in lattico (morbido, latte). Nei rossi è quasi sempre completata; nei bianchi il produttore sceglie: completarla da morbidezza, bloccarla conserva freschezza.' },
  { ico:'🪨', t:'Terroir', h:'Il Calcare e la Mineralità',
    b:'Il calcare è il suolo del vino di qualità: drena bene, forza le radici in profondità, dona mineralità e freschezza. Borgogna, Champagne, Barolo, Chablis sono tutti su suoli calcarei.' },
  { ico:'🏺', t:'Storia', h:'8000 Anni di Vino',
    b:'I primi segni di vinificazione risalgono al 6000 a.C. in Georgia, dove si faceva fermentare l\'uva in anfore di argilla (kvevri) interrate nel terreno. Questo metodo produce oggi i vini arancioni.' },
  { ico:'💧', t:'Degustazione', h:'Le Lacrime del Vino',
    b:'Le lacrime che scendono lungo il calice non indicano qualità ma alcol. Più sono marcate, più il vino è alcolico. Si formano per il diverso tasso di evaporazione tra alcol e acqua.' },
  { ico:'🔑', t:'Sommelier', h:'Il Tastevin',
    b:'Il piccolo disco d\'argento che i sommelier portano al collo era usato nelle cantine buie per valutare il colore del vino alla luce di una candela. Oggi è un simbolo onorifico.' },
  { ico:'🌊', t:'Terroir', h:'Il Vino e il Mare',
    b:'I vigneti vicino al mare producono vini sapidi e iodati. Vermentino sardo, Assyrtiko di Santorini, Muscadet: tutti mostrano quella mineralità marina inconfondibile.' },
  { ico:'🎭', t:'Storia', h:'Napoleone e il Chambertin',
    b:'Napoleone Bonaparte portava il Chambertin in ogni battaglia. Durante la campagna di Russia del 1812, quando rimase senza, attribuì parte dei fallimenti militari alla mancanza di questo vino.' },
  { ico:'🪵', t:'Enologia', h:'Rovere Francese vs Americano',
    b:'Rovere francese: grana fine, vaniglia e spezie eleganti. Rovere americano: grana larga, cocco e vaniglia intensa. I Rioja storici usano americano; i Barolo moderni preferiscono il francese.' },
  { ico:'🏔️', t:'Viticoltura', h:'Altitudine e Acidità',
    b:'In quota le temperature notturne scendono e l\'escursione termica aumenta. Questo rallenta la maturazione e permette all\'uva di sviluppare zuccheri mantenendo l\'acidità. I migliori vini delle zone calde vengono da vigneti in quota.' },
  { ico:'🎨', t:'Degustazione', h:'Il Colore Racconta Tutto',
    b:'Un Barolo giovane è rubino intenso con riflessi viola; a 10 anni granato; a 20 anni si tinge d\'arancio ai bordi. Nei bianchi l\'inverso: da paglierino verdognolo a dorato intenso.' },
  { ico:'🌙', t:'Viticoltura', h:'La Viticoltura Biodinamica',
    b:'Il calendario biodinamico divide i giorni in: Radice (vinificazione), Fiore (bianchi), Frutto (rossi), Foglia (vino chiuso). Rudolf Steiner ha codificato questo sistema negli anni 20.' },
  { ico:'💎', t:'Mercato', h:'Il Vino più Costoso del Mondo',
    b:'La Romanée-Conti 1945 è stata venduta all\'asta per 558.000 dollari per bottiglia nel 2018. Probabilmente non è mai stata aperta. Il vino da collezione diventa un\'opera d\'arte.' },
  { ico:'🫁', t:'Degustazione', h:'Come si Annusa il Vino',
    b:'Prima annusata a naso fermo: aromi primari (frutta, fiori). Poi ruota il calice e annusa subito dopo: aromi secondari e terziari (cuoio, tabacco, terra). Il naso racconta l\'80% del vino.' },
  { ico:'🌿', t:'Viticoltura', h:'La Potatura Invernale',
    b:'La potatura è il gesto più importante dell\'anno in vigna. Si esegue da dicembre a febbraio. Ogni tralcio tagliato è una scelta: quanti grappoli, quanto concentrata l\'uva.' },
  { ico:'🧪', t:'Enologia', h:'I Solfiti nel Vino',
    b:'I solfiti sono conservanti naturali usati dai Romani. Tutti i vini ne contengono in piccole quantità. Non causano il mal di testa: è l\'alcol che lo provoca.' },
  { ico:'🏛️', t:'Storia', h:'Il Symposium Greco',
    b:'Nell\'antica Grecia il simposio era una cerimonia del vino. Si beveva sempre diluito (3 parti acqua, 1 vino). Bere vino puro era considerato barbaro. La moderazione era il valore supremo.' },
  { ico:'🎪', t:'Denominazioni', h:'DOCG: Solo 77 in Italia',
    b:'La DOCG è il livello massimo italiano. Esistono solo 77 DOCG. La prima fu assegnata nel 1980 a Barolo, Barbaresco, Brunello di Montalcino e Albana di Romagna.' },
  { ico:'📐', t:'Servizio', h:'Quanto Vino Versare',
    b:'La regola professionale: mai oltre un terzo del calice. Un Borgogna grande si versa per un quarto. Il vino deve respirare nel calice per sprigionare gli aromi.' },
  { ico:'🗺️', t:'Denominazioni', h:'La Classificazione del 1855',
    b:'Nel 1855 Napoleone III chiese di classificare i migliori Bordeaux. Nacquero i Premiers Crus: Lafite, Latour, Margaux, Haut-Brion. Solo nel 1973 fu aggiunto Mouton Rothschild.' },
  { ico:'🦠', t:'Enologia', h:'I Lieviti Selvaggi',
    b:'I lieviti indigeni vivono sulla buccia dell\'uva e nella cantina. La fermentazione spontanea produce vini con carattere unico. I lieviti commerciali garantiscono risultati stabili ma omologano i vini.' },
  { ico:'🌬️', t:'Viticoltura', h:'Il Vento in Vigna',
    b:'Il vento è il primo alleato contro le malattie fungine: asciuga il grappolo dopo la pioggia. Il Mistral in Provenza, il Maestrale in Sardegna, il Tramontano in Toscana: tutti permettono meno trattamenti.' },
  { ico:'🎻', t:'Storia', h:'Dom Perignon: il Mito',
    b:'Dom Pérignon non ha inventato lo Champagne. Il monaco di Hautvillers cercava di ELIMINARE le bollicine, che rompevano le bottiglie. Erano un difetto. A inventare il metodo classico furono gli inglesi.' },
  { ico:'🐝', t:'Viticoltura', h:'La Biodiversità in Vigna',
    b:'Api, lombrichi, lucertole, ragni: ogni essere vivente contribuisce all\'equilibrio. In un ettaro di vigna sana vivono più di 1 milione di organismi diversi.' },
  { ico:'✨', t:'Sommelier', h:'L\'Esame AIS',
    b:'Per diventare Sommelier AIS ci vogliono 3 livelli: storia e geografia del vino, abbinamento cibo-vino, degustazione professionale. L\'esame finale include una degustazione alla cieca di 3 vini.' },
  { ico:'🌺', t:'Degustazione', h:'Il Vino e i 5 Sensi',
    b:'Vista: colore e limpidezza. Olfatto: prima e dopo la rotazione. Tatto: morbidezza e astringenza. Gusto: dolce, acido, amaro, sapido. Udito: il suono del tappo. Solo il vino coinvolge tutti e 5 i sensi.' },
];

/* ── GRADIENTS ── */
var BG = [
  'linear-gradient(135deg,rgba(74,4,4,.9),rgba(40,2,2,.7))',
  'linear-gradient(135deg,rgba(4,40,74,.9),rgba(2,20,50,.7))',
  'linear-gradient(135deg,rgba(4,60,40,.9),rgba(2,35,25,.7))',
  'linear-gradient(135deg,rgba(60,40,4,.9),rgba(35,22,2,.7))',
  'linear-gradient(135deg,rgba(40,4,74,.9),rgba(22,2,45,.7))',
  'linear-gradient(135deg,rgba(60,10,50,.9),rgba(35,5,30,.7))',
];

/* ── CAROSELLO MAGAZINE ── */
var _arts = [];
var _readerOpen = false;

function getElite() {
  try {
    var p = JSON.parse(localStorage.getItem('sw_elite_producers') || '[]');
    return p.filter(function(x) { return x.nome && x.descrizione; })
      .map(function(x, i) {
        return {
          id: 'e' + i, isElite: true,
          titolo_it: '👑 ' + x.nome, titolo_en: '👑 ' + x.nome, titolo_fr: '👑 ' + x.nome,
          categoria_it: '👑 Elite', categoria_en: '👑 Elite', categoria_fr: '👑 Elite',
          testo_it: x.descrizione, autore: x.nome, data: x.data || '', producer: x,
        };
      });
  } catch(e) { return []; }
}

function renderCard(art, i, container) {
  var tit = tf(art, 'titolo') || art.titolo || '';
  var cat = tf(art, 'categoria') || art.categoria || 'Magazine';
  var isE = !!art.isElite, isN = !!art.isNews, isAI = !!art.generato_ai;
  var bg = BG[i % BG.length];
  var ico = isE ? '👑' : isN ? '🗞' : ['🍷','🌿','📚','🥂','🌍','✨'][i % 6];

  var card = document.createElement('div');
  card.style.cssText = [
    'flex:0 0 250px;min-width:250px;scroll-snap-align:start;',
    'border-radius:10px;overflow:hidden;cursor:pointer;',
    'background:rgba(20,10,5,.6);transition:transform .2s,box-shadow .2s;',
    'border:1px solid ' + (isE ? 'rgba(212,175,55,.5)' : isN ? 'rgba(100,180,255,.25)' : 'rgba(212,175,55,.12)') + ';',
  ].join('');

  var imgHtml = '';
  if (art.immagine && art.immagine.length > 10) {
    imgHtml = '<img src="' + art.immagine + '" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" loading="lazy" onerror="this.style.display=\'none\'">';
  }

  card.innerHTML =
    '<div style="width:100%;height:130px;background:' + bg + ';position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;">' +
      imgHtml +
      '<div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 30%,rgba(10,7,5,.6));"></div>' +
      '<span style="font-size:2rem;position:relative;z-index:1;filter:drop-shadow(0 2px 6px rgba(0,0,0,.9));">' + ico + '</span>' +
    '</div>' +
    (isE ? '<div style="background:rgba(212,175,55,.85);color:#0A0705;font-family:Cinzel,serif;font-size:7px;font-weight:700;letter-spacing:2px;padding:2px 10px;text-align:center;">👑 ELITE</div>' : '') +
    (isN && !isE ? '<div style="background:rgba(20,60,140,.6);color:rgba(180,220,255,.9);font-family:Cinzel,serif;font-size:7px;font-weight:700;letter-spacing:2px;padding:2px 10px;text-align:center;">🗞 NOTIZIA</div>' : '') +
    '<div style="padding:11px 12px 13px;">' +
      '<div style="font-size:8px;font-weight:700;letter-spacing:1.5px;color:rgba(212,175,55,.55);text-transform:uppercase;margin-bottom:4px;">' + cat + '</div>' +
      '<div style="font-family:\'Playfair Display\',\'IM Fell English\',Georgia,serif;font-size:.88rem;font-weight:700;color:#F5EFE2;line-height:1.3;margin-bottom:6px;">' + tit + '</div>' +
      '<div style="font-size:10px;color:rgba(245,239,226,.3);display:flex;align-items:center;justify-content:space-between;">' +
        '<span>' + (art.data || '') + (art.autore ? ' · ' + art.autore : '') + '</span>' +
        (isAI ? '<span style="font-size:8px;background:rgba(125,218,138,.15);color:rgba(125,218,138,.7);padding:2px 5px;border-radius:3px;">✦ AI</span>' : '') +
      '</div>' +
    '</div>';

  card.onmouseenter = function() { this.style.transform = 'translateY(-2px)'; this.style.boxShadow = '0 6px 20px rgba(0,0,0,.4)'; };
  card.onmouseleave = function() { this.style.transform = ''; this.style.boxShadow = ''; };
  card.onclick = function() { openReader(art, i); };
  container.appendChild(card);
}

function renderMag() {
  var c = document.getElementById('sw-carousel');
  if (!c) return;
  c.innerHTML = '';
  var cnt = document.getElementById('sw-art-count');
  if (cnt) cnt.textContent = _arts.length + ' articoli';
  _arts.forEach(function(art, i) { renderCard(art, i, c); });
}

async function loadArts() {
  _arts = getElite().concat(LOCAL);
  renderMag();
  try {
    var ctrl = new AbortController();
    setTimeout(function() { ctrl.abort(); }, 6000);
    var r = await fetch(SRV + '/api/articles', { signal: ctrl.signal });
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
  } catch(e) { console.log('[v23] Articoli locali (server non raggiungibile)'); }
}

/* ── READER ── */
function openReader(art, idx) {
  var tit = tf(art, 'titolo') || art.titolo || '';
  var cat = tf(art, 'categoria') || art.categoria || '';
  var txt = tf(art, 'testo') || art.testo || '';
  var bg = BG[(idx || 0) % BG.length];

  var paras = (txt || '').split(/\n\n+/).filter(Boolean)
    .map(function(p) { return '<p style="margin:0 0 20px;">' + p.trim() + '</p>'; }).join('');

  var r = document.getElementById('sw-reader');
  if (!r) {
    r = document.createElement('div');
    r.id = 'sw-reader';
    r.style.cssText = 'display:none;position:fixed;inset:0;z-index:999950;background:#0A0705;overflow-y:auto;-webkit-overflow-scrolling:touch;';
    document.body.appendChild(r);
  }

  r.innerHTML =
    '<div style="position:sticky;top:0;z-index:2;background:rgba(10,7,5,.97);backdrop-filter:blur(12px);border-bottom:1px solid rgba(212,175,55,.12);display:flex;align-items:center;gap:12px;padding:12px 16px;">' +
      '<button onclick="document.getElementById(\'sw-reader\').style.display=\'none\';document.body.style.overflow=\'\'" style="width:36px;height:36px;border-radius:50%;background:rgba(212,175,55,.1);border:1px solid rgba(212,175,55,.2);color:#D4AF37;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;">←</button>' +
      '<div style="font-family:Cinzel,serif;font-size:.6rem;letter-spacing:2px;color:rgba(212,175,55,.6);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + tit + '</div>' +
    '</div>' +
    '<div style="max-width:720px;margin:0 auto;padding-bottom:80px;">' +
      '<div style="width:100%;height:220px;background:' + bg + ';display:flex;align-items:center;justify-content:center;font-size:4rem;position:relative;overflow:hidden;">' +
        (art.immagine ? '<img src="' + art.immagine + '" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" onerror="this.style.display=\'none\'">' : '') +
        '<span style="position:relative;z-index:1;filter:drop-shadow(0 2px 12px rgba(0,0,0,.9));">🍷</span>' +
      '</div>' +
      '<div style="padding:24px 20px 0;">' +
        '<div style="font-size:9px;font-weight:700;letter-spacing:3px;color:rgba(212,175,55,.5);text-transform:uppercase;margin-bottom:10px;">' + cat + '</div>' +
        '<h1 style="font-family:\'Playfair Display\',Georgia,serif;font-size:1.5rem;font-weight:700;line-height:1.25;color:#F5EFE2;margin:0 0 14px;">' + tit + '</h1>' +
        '<div style="font-size:11px;color:rgba(245,239,226,.35);margin-bottom:22px;padding-bottom:14px;border-bottom:1px solid rgba(212,175,55,.1);display:flex;gap:8px;flex-wrap:wrap;align-items:center;">' +
          (art.data ? '<span>' + art.data + '</span>' : '') +
          (art.autore ? '<span>·</span><span>' + art.autore + '</span>' : '') +
          (art.generato_ai ? '<span style="background:rgba(125,218,138,.12);color:rgba(125,218,138,.7);font-size:9px;padding:2px 7px;border-radius:3px;">✦ AI</span>' : '') +
        '</div>' +
        '<div style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:1.05rem;line-height:2;color:rgba(245,239,226,.85);">' +
          (paras || '<p style="color:rgba(245,239,226,.4);">Contenuto non disponibile.</p>') +
        '</div>' +
      '</div>' +
    '</div>';

  r.style.display = 'block';
  r.scrollTop = 0;
  document.body.style.overflow = 'hidden';
  _readerOpen = true;
  try { history.pushState({ r: 1 }, ''); } catch(e) {}
}

window.addEventListener('popstate', function() {
  if (_readerOpen) {
    var r = document.getElementById('sw-reader');
    if (r) r.style.display = 'none';
    document.body.style.overflow = '';
    _readerOpen = false;
  }
});

/* ── CURIOSITÀ ── */
function renderCuriosity() {
  var c = document.getElementById('sw-curiosity-cards');
  if (!c) return;

  var d = document.getElementById('sw-cur-date');
  if (d) {
    d.textContent = new Date().toLocaleDateString('it-IT', { weekday:'long', day:'numeric', month:'long' });
  }

  var dayN = Math.floor(Date.now() / 86400000);
  var shown = [];
  for (var i = 0; i < 8; i++) shown.push(CUR[(dayN + i) % CUR.length]);

  c.innerHTML = '';
  shown.forEach(function(cur, i) {
    var card = document.createElement('div');
    card.style.cssText = [
      'flex:0 0 215px;min-width:215px;scroll-snap-align:start;',
      'border-radius:10px;overflow:hidden;cursor:pointer;',
      'background:' + BG[i % BG.length] + ';',
      'border:1px solid rgba(212,175,55,.15);transition:transform .2s,box-shadow .2s;',
    ].join('');

    card.innerHTML =
      '<div style="padding:16px 14px 14px;">' +
        '<div style="font-size:1.8rem;margin-bottom:8px;">' + cur.ico + '</div>' +
        '<div style="font-size:8px;font-weight:700;letter-spacing:2px;color:rgba(212,175,55,.5);text-transform:uppercase;margin-bottom:6px;">' + cur.t + '</div>' +
        '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:.85rem;font-weight:700;color:#F5EFE2;line-height:1.3;margin-bottom:8px;">' + cur.h + '</div>' +
        '<div style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:.82rem;line-height:1.6;color:rgba(245,239,226,.65);">' + cur.b.substring(0, 110) + '…</div>' +
      '</div>';

    card.onmouseenter = function() { this.style.transform = 'translateY(-2px)'; this.style.boxShadow = '0 6px 20px rgba(0,0,0,.4)'; };
    card.onmouseleave = function() { this.style.transform = ''; this.style.boxShadow = ''; };
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

/* ── INIETTA SEZIONI ── */
function injectMagazine() {
  /* Sostituisce newsContainer con carosello */
  var newsHead = document.querySelector('.news-section-head');
  var newsContainer = document.getElementById('newsContainer');
  if (!newsHead || !newsContainer) return;
  if (document.getElementById('sw-carousel')) return;

  /* Nasconde vecchi elementi */
  newsHead.style.display = 'none';
  newsContainer.style.display = 'none';

  /* Crea nuovo wrapper carosello */
  var wrap = document.createElement('div');
  wrap.id = 'sw-mag-wrap';
  wrap.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px 10px;">' +
      '<div style="display:flex;align-items:center;gap:8px;">' +
        '<span class="news-live-dot"></span>' +
        '<span style="font-family:Cinzel,serif;font-size:.6rem;letter-spacing:4px;color:var(--vino,#8B0000);">WINE NEWS &amp; MAGAZINE</span>' +
      '</div>' +
      '<span id="sw-art-count" style="font-size:11px;color:rgba(245,239,226,.3);">…</span>' +
    '</div>' +
    '<div id="sw-carousel" style="display:flex;gap:11px;overflow-x:auto;overflow-y:hidden;padding:0 14px 16px;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;"></div>';

  var style = document.createElement('style');
  style.textContent = '#sw-carousel::-webkit-scrollbar{display:none}';
  document.head.appendChild(style);

  newsContainer.parentNode.insertBefore(wrap, newsContainer);
}

function injectCuriosity() {
  if (document.getElementById('sw-curiosity-wrap')) return;

  var footer = document.querySelector('footer');
  if (!footer) return;

  var sec = document.createElement('div');
  sec.id = 'sw-curiosity-wrap';
  sec.style.cssText = 'background:#0A0705;padding:0 0 8px;border-top:1px solid rgba(212,175,55,.08);';
  sec.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 14px 10px;">' +
      '<div style="display:flex;align-items:center;gap:8px;">' +
        '<span style="font-size:.95rem;">🎓</span>' +
        '<span style="font-family:Cinzel,serif;font-size:.6rem;letter-spacing:4px;color:var(--vino,#8B0000);">IL SAPERE DEL VINO</span>' +
      '</div>' +
      '<span id="sw-cur-date" style="font-size:10px;color:rgba(245,239,226,.25);"></span>' +
    '</div>' +
    '<div id="sw-curiosity-cards" style="display:flex;gap:11px;overflow-x:auto;padding:0 14px 16px;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;"></div>';

  var style2 = document.createElement('style');
  style2.textContent = '#sw-curiosity-cards::-webkit-scrollbar{display:none}';
  document.head.appendChild(style2);

  footer.parentNode.insertBefore(sec, footer);
}

/* ── CONTATTI PAGINA ── */
window.swOpenContact = function() {
  document.querySelectorAll('.ntab').forEach(function(t) { t.classList.remove('active'); });

  var p = document.getElementById('sw-cp');
  if (p) {
    p.style.display = 'block';
    document.body.style.overflow = 'hidden';
    return;
  }

  var fld = 'width:100%;box-sizing:border-box;padding:11px 13px;background:rgba(255,255,255,.05);border:1px solid rgba(212,175,55,.2);border-radius:8px;color:#F5EFE2;font-family:Lato,sans-serif;font-size:15px;outline:none;display:block;';
  var lbl = 'display:block;font-size:9px;font-weight:700;letter-spacing:2px;color:rgba(212,175,55,.55);text-transform:uppercase;margin-bottom:5px;';

  p = document.createElement('div');
  p.id = 'sw-cp';
  p.style.cssText = 'display:block;position:fixed;inset:0;z-index:999900;background:#0A0705;overflow-y:auto;-webkit-overflow-scrolling:touch;';

  p.innerHTML =
    '<div style="position:sticky;top:0;z-index:2;background:rgba(10,7,5,.97);backdrop-filter:blur(12px);border-bottom:1px solid rgba(212,175,55,.15);display:flex;align-items:center;gap:12px;padding:13px 16px;">' +
      '<button onclick="document.getElementById(\'sw-cp\').style.display=\'none\';document.body.style.overflow=\'\';" style="width:36px;height:36px;border-radius:50%;background:rgba(212,175,55,.1);border:1px solid rgba(212,175,55,.2);color:#D4AF37;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;">←</button>' +
      '<div style="font-family:Cinzel,serif;font-size:.65rem;letter-spacing:3px;color:#F5EFE2;">CONTATTI</div>' +
    '</div>' +
    '<div style="max-width:540px;margin:0 auto;padding:28px 20px 80px;box-sizing:border-box;">' +
      '<div style="text-align:center;margin-bottom:28px;">' +
        '<div style="font-size:9px;font-weight:700;letter-spacing:3px;color:rgba(212,175,55,.5);text-transform:uppercase;margin-bottom:8px;">✉️ SCRIVICI</div>' +
        '<h2 style="font-family:\'Playfair Display\',serif;font-size:1.5rem;font-weight:700;color:#F5EFE2;margin:0 0 8px;">Come possiamo aiutarti?</h2>' +
        '<p style="font-size:13px;color:rgba(245,239,226,.4);line-height:1.7;margin:0;">Produttori, collaborazioni, segnalazioni.<br>Risponderemo entro 48 ore.</p>' +
      '</div>' +
      '<div id="sw-c-ok" style="display:none;text-align:center;padding:24px;background:rgba(125,218,138,.08);border:1px solid rgba(125,218,138,.2);border-radius:10px;margin-bottom:20px;">' +
        '<div style="font-size:2rem;margin-bottom:8px;">✓</div>' +
        '<div style="font-family:\'Playfair Display\',serif;color:#7dda8a;font-size:1rem;">Messaggio inviato!</div>' +
        '<div style="font-size:13px;color:rgba(245,239,226,.4);margin-top:6px;">Ti risponderemo entro 48 ore.</div>' +
      '</div>' +
      '<div id="sw-c-frm">' +
        '<div style="margin-bottom:16px;"><label style="' + lbl + '">NOME *</label><input id="sw-cn" type="text" placeholder="Il tuo nome" autocomplete="name" style="' + fld + '"></div>' +
        '<div style="margin-bottom:16px;"><label style="' + lbl + '">EMAIL *</label><input id="sw-ce" type="email" placeholder="tua@email.com" autocomplete="email" style="' + fld + '"></div>' +
        '<div style="margin-bottom:16px;"><label style="' + lbl + '">ARGOMENTO</label><select id="sw-cs" style="' + fld + 'cursor:pointer;"><option value="">— Seleziona —</option><option>🏭 Produttore / cantina</option><option>👑 Piano Elite</option><option>🥂 Collaborazione sommelier</option><option>🛠 Segnalazione errore</option><option>💬 Altro</option></select></div>' +
        '<div style="margin-bottom:16px;"><label style="' + lbl + '">MESSAGGIO *</label><textarea id="sw-cm" placeholder="Scrivi qui..." style="' + fld + 'height:110px;resize:none;"></textarea></div>' +
        '<button onclick="swSendContact()" id="sw-cbtn" style="width:100%;padding:14px;background:rgba(212,175,55,.18);border:1.5px solid rgba(212,175,55,.45);border-radius:8px;color:#D4AF37;font-family:Cinzel,serif;font-size:.6rem;font-weight:700;letter-spacing:3px;cursor:pointer;">✦ INVIA MESSAGGIO ✦</button>' +
        '<div id="sw-cerr" style="display:none;margin-top:10px;padding:10px;background:rgba(220,50,50,.15);border:1px solid rgba(220,50,50,.3);border-radius:6px;font-size:12px;color:rgba(255,150,150,.9);text-align:center;"></div>' +
      '</div>' +
      '<div style="text-align:center;margin-top:28px;padding-top:20px;border-top:1px solid rgba(212,175,55,.1);">' +
        '<div style="font-size:12px;color:rgba(245,239,226,.3);margin-bottom:6px;">Oppure scrivi a</div>' +
        '<a href="mailto:info@sommelierworld.vin" style="color:rgba(212,175,55,.6);font-size:13px;text-decoration:none;">info@sommelierworld.vin</a>' +
      '</div>' +
    '</div>';

  document.body.appendChild(p);
  document.body.style.overflow = 'hidden';
};

/* ── INVIA CONTATTO ── */
window.swSendContact = async function() {
  var n = (document.getElementById('sw-cn') || {}).value || '';
  var e = (document.getElementById('sw-ce') || {}).value || '';
  var s = (document.getElementById('sw-cs') || {}).value || '';
  var m = (document.getElementById('sw-cm') || {}).value || '';
  var err = document.getElementById('sw-cerr');
  var btn = document.getElementById('sw-cbtn');

  n = n.trim(); e = e.trim(); m = m.trim();

  function showErr(t) { if (err) { err.textContent = t; err.style.display = 'block'; } }
  if (!n) return showErr('Inserisci il nome.');
  if (!e || !e.includes('@')) return showErr('Email non valida.');
  if (m.length < 4) return showErr('Messaggio troppo corto.');

  if (err) err.style.display = 'none';
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Invio...'; }

  var sent = false;
  try {
    var ctrl = new AbortController();
    setTimeout(function() { ctrl.abort(); }, 8000);
    var r = await fetch(SRV + '/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: n, email: e, subject: s, message: m }),
      signal: ctrl.signal,
    });
    if (r.ok) { var d = await r.json(); sent = !!d.ok; }
  } catch(ex) {}

  if (!sent) {
    window.location.href = 'mailto:info@sommelierworld.vin?subject=' +
      encodeURIComponent('[SW] ' + (s || 'Messaggio da ' + n)) +
      '&body=' + encodeURIComponent('Da: ' + n + '\nEmail: ' + e + '\n\n' + m);
  }

  var frm = document.getElementById('sw-c-frm');
  var ok = document.getElementById('sw-c-ok');
  if (frm) frm.style.display = 'none';
  if (ok) ok.style.display = 'block';
};

/* ── KILL FAB DUPLICATO ── */
function killFAB() {
  document.querySelectorAll('#sw11-fab-contact, [id*="fab-contact"]')
    .forEach(function(el) { el.style.display = 'none'; });
  window.fixContactButton = function() {};
}

/* ── INIT ── */

/* ── MAPPA DARK (CartoDB Dark Matter) ── */
function fixDarkMap() {
  if (typeof L === 'undefined' || !window.TILES) return;
  window.TILES.street = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  window.TILES.topo   = 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png';
  console.log('[v23] Mappa dark impostata');
}

document.addEventListener('DOMContentLoaded', function() {
  killFAB();
  setTimeout(killFAB, 1000);
  setTimeout(killFAB, 3000);

  injectMagazine();
  injectCuriosity();
  loadArts();
  renderCuriosity();

  console.log('[SW v23] Inizializzato — Magazine + Curiosità + Contatti ✓');
});

})(); // fine IIFE
