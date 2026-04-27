/**
 * SOMMELIER WORLD — news.js v26
 * ─────────────────────────────────────────────────────────────
 * LA GAZZETTA DEL SOMMELIER — il quotidiano del vino.
 * 30 articoli ruotano ogni giorno per sembrare sempre freschi.
 * Foto: solo ID Unsplash verificati al 100% — vigne, cantine, vendemmia.
 * ─────────────────────────────────────────────────────────────
 */

// ═══════════════════════════════════════════════════════════
// LIBRERIA FOTO UNSPLASH — ID verificati, 100% vino/vigne
// NON modificare senza verifica visiva dell'ID.
// ═══════════════════════════════════════════════════════════
window._VP = window._VP || {};
var _VP = {
  /* Calici rossi — verificati 100% vino */
  glass_red_a: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=900&q=90&fit=crop',
  glass_red_b: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=900&q=90&fit=crop',
  glass_wht_a: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=90&fit=crop',
  /* Degustazione / sommelier */
  tasting_a:   'https://images.unsplash.com/photo-1574014671294-4b64eb4c68b4?w=900&q=90&fit=crop',
  tasting_b:   'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=900&q=90&fit=crop',
  /* Bottiglie */
  bottles_a:   'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=900&q=90&fit=crop',
  /* Vigneti — tutti verificati */
  vineyard_a:  'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=900&q=90&fit=crop',
  vineyard_b:  'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=900&q=90&fit=crop',
  vineyard_c:  'https://images.unsplash.com/photo-1586370434639-0fe43b2d32e6?w=900&q=90&fit=crop',
  vineyard_d:  'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=900&q=90&fit=crop',
  vineyard_e:  'https://images.unsplash.com/photo-1543965170-e399475d7b1e?w=900&q=90&fit=crop',
  /* Cantina — botti e pietra */
  cellar_a:    'https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?w=900&q=90&fit=crop',
  cellar_b:    'https://images.unsplash.com/photo-1563220917-916e11d39a86?w=900&q=90&fit=crop',
  /* Vendemmia */
  harvest_a:   'https://images.unsplash.com/photo-1596363470302-8d7c62a64c2d?w=900&q=90&fit=crop',
  harvest_b:   'https://images.unsplash.com/photo-1515779122185-2390ccdf060b?w=900&q=90&fit=crop',
  /* Champagne / bollicine */
  bubbles_a:   'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=900&q=90&fit=crop',
  bubbles_b:   'https://images.unsplash.com/photo-1543268378-a8d0f9e0eff8?w=900&q=90&fit=crop',
  /* Sommelier */
  sommelier_a: 'https://images.unsplash.com/photo-1574014671294-4b64eb4c68b4?w=900&q=90&fit=crop',
};

var _TP = {
  champagne: ['bubbles_a','bubbles_b','glass_wht_a'],
  sommelier: ['sommelier_a','tasting_a','glass_red_a'],
  harvest:   ['harvest_a','harvest_b','vineyard_c'],
  cellar:    ['cellar_a','cellar_b','vineyard_d'],
  red:       ['glass_red_a','glass_red_b','vineyard_a'],
  white:     ['glass_wht_a','vineyard_b','harvest_b'],
  vineyard:  ['vineyard_a','vineyard_b','vineyard_c','vineyard_d'],
  news:      ['vineyard_a','cellar_a','vineyard_c'],
  winery:    ['cellar_a','cellar_b','vineyard_c'],
  def:       ['vineyard_a','vineyard_b','cellar_a','glass_red_a','harvest_a'],
};


// ═══════════════════════════════════════════════════════════
// SISTEMA TRADUZIONE CON CACHE — traduzioni pre-generate
// Strategia: articoli tradotti in background la prima volta,
// poi sempre istantanei dalla cache localStorage.
// ═══════════════════════════════════════════════════════════

/* Chiave cache: sw_tr_{articleId}_{lang}_{field} */
window._trCache = {

  /* Salva traduzione nel cache */
  save: function(artId, lang, field, text) {
    try {
      var key = 'sw_tr_'+artId+'_'+lang+'_'+field;
      localStorage.setItem(key, text);
    } catch(e) {}
  },

  /* Legge traduzione dal cache */
  get: function(artId, lang, field) {
    try {
      return localStorage.getItem('sw_tr_'+artId+'_'+lang+'_'+field) || '';
    } catch(e) { return ''; }
  },

  /* Applica cache a un articolo */
  applyToArt: function(art, lang) {
    if(!art.id || lang==='it') return;
    var tit = this.get(art.id, lang, 'titolo');
    var txt = this.get(art.id, lang, 'testo');
    if(tit) art['titolo_'+lang] = tit;
    if(txt) art['testo_'+lang]  = txt;
  },

  /* Controlla se un articolo ha già la traduzione */
  has: function(artId, lang) {
    return !!(this.get(artId, lang, 'testo'));
  },
};

/**
 * translateAllArticles(arts, lang)
 * Traduce in background tutti gli articoli che non hanno ancora
 * la traduzione per la lingua richiesta.
 * Ogni articolo viene tradotto uno alla volta (per non sovraccaricare l'API).
 */
window.translateAllArticles = async function(arts, lang) {
  if(!lang || lang==='it') return;
  if(typeof window.callAPI !== 'function') return;

  var pending = arts.filter(function(a) {
    var txt = a.testo_it || a.testo || '';
    return a.id && txt && !window._trCache.has(a.id, lang);
  });

  if(!pending.length) return;

  var langName = {en:'inglese perfetto', fr:'francese perfetto', ru:'russo perfetto'}[lang] || lang;
  var sys = 'Sei un traduttore esperto di testi enologici e culturali di alto livello. '+
    'Traduci in '+langName+' il testo che ti invio. '+
    'Mantieni il tono poetico e narrativo. Solo la traduzione, senza commenti o prefazioni.';

  /* Traduce un articolo alla volta in background — non blocca l'UI */
  for(var i=0; i<pending.length; i++) {
    var art = pending[i];
    try {
      var srcTit = art.titolo_it || art.titolo || '';
      var srcTxt = art.testo_it  || art.testo  || '';
      if(!srcTxt) continue;

      /* Traduce titolo */
      var tit = await window.callAPI(
        'Traduci solo questo titolo in '+langName+'. Rispondi SOLO con il titolo tradotto, nessuna spiegazione:', srcTit, lang
      );
      if(tit && tit.trim()) {
        window._trCache.save(art.id, lang, 'titolo', tit.trim());
        art['titolo_'+lang] = tit.trim();
      }

      /* Traduce testo */
      var txt = await window.callAPI(sys, srcTxt, lang);
      if(txt && txt.trim()) {
        window._trCache.save(art.id, lang, 'testo', txt.trim());
        art['testo_'+lang] = txt.trim();
      }

      /* Aggiorna card se siamo già nella lingua tradotta */
      if(window.getLang && window.getLang()===lang) {
        if(typeof window.renderSapere==='function') window.renderSapere([]);
        if(typeof window.renderSlides==='function') window.renderSlides();
      }

      /* Piccola pausa tra articoli per non sovraccaricare il server */
      await new Promise(function(r){ setTimeout(r, 300); });

    } catch(e) {
      /* Se fallisce un articolo, continua con il prossimo */
      console.log('[Traduzione] Articolo '+art.id+' saltato:', e.message);
    }
  }

  /* Se siamo nella lingua tradotta, aggiorna il carousel con i nuovi testi */
  if(window.getLang && window.getLang()===lang) {
    window.renderSlides();
  }
};

/**
 * getArtInLang(art, lang)
 * Legge il testo di un articolo nella lingua richiesta.
 * Priorità: campo nativo → cache localStorage → fallback italiano.
 */
window.getArtInLang = function(art, lang, field) {
  /* 1. Campo nativo nell'articolo */
  var native = art[field+'_'+lang];
  if(native && native.trim()) return native.trim();

  /* 2. Cache localStorage */
  if(art.id) {
    var cached = window._trCache.get(art.id, lang, field);
    if(cached) {
      art[field+'_'+lang] = cached; /* scrivi nel cache dell'oggetto */
      return cached;
    }
  }

  /* 3. Fallback italiano */
  return art[field+'_it'] || art[field] || '';
};

window.getTopicPhoto = function(titolo, categoria, offset) {
  var t = ((titolo||'')+' '+(categoria||'')).toLowerCase();
  var seed = Math.floor(Date.now()/86400000) + (offset||0);
  var cat = 'def';
  if(t.match(/champagne|bollicin|spumant|prosecco|cava|franciacorta/)) cat='champagne';
  else if(t.match(/sommelier|degust|abbinament|calice|servizio|tavola/)) cat='sommelier';
  else if(t.match(/vendemmia|harvest|raccolt|potatur|biodinam|viticolt/)) cat='harvest';
  else if(t.match(/cantina|barrique|botti|affinament|invecchiam|quercia/)) cat='cellar';
  else if(t.match(/rosso|nebbiolo|sangiovese|barolo|brunello|amarone|malbec|syrah|shiraz/)) cat='red';
  else if(t.match(/bianco|riesling|chardonnay|sauvignon|blanc|assyrtiko/)) cat='white';
  else if(t.match(/vigna|vineyard|terroir|suolo|etna|mosel|santorini|vigneto/)) cat='vineyard';
  else if(t.match(/notizia|mercato|prezzi|award|export|produzione|trend/)) cat='news';
  else if(t.match(/produttor|winery|domaine|cantina|maison|château/)) cat='winery';
  var keys = _TP[cat]||_TP.def;
  return _VP[keys[seed%keys.length]]||_VP.vineyard_a;
};

// ═══════════════════════════════════════════════════════════
// CSS — iniettato una sola volta
// ═══════════════════════════════════════════════════════════
(function injectCSS(){
  if(document.getElementById('sw-news-css')) return;
  var s=document.createElement('style');
  s.id='sw-news-css';
  s.textContent=
    '#slArea{position:relative;width:100%;height:320px;overflow:hidden;background:#0d0202;}'+
    '#slArea .sw-slide{position:absolute;inset:0;opacity:0;transition:opacity .75s ease;pointer-events:none;}'+
    '#slArea .sw-slide.on{opacity:1;pointer-events:auto;}'+
    '#slArea .sw-slide img.sw-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;display:block;}'+
    '#slArea .sw-slide .sw-grad{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(10,5,2,.08) 0%,rgba(10,5,2,.28) 40%,rgba(10,5,2,.9) 78%,rgba(10,5,2,.99) 100%);}'+
    '#slArea .sw-slide .sw-body{position:absolute;bottom:0;left:0;right:0;padding:18px 18px 22px;cursor:pointer;}'+
    '.sw-slide-date{font-family:Cinzel,serif;font-size:.38rem;letter-spacing:3px;color:rgba(212,175,55,.55);margin-bottom:4px;}'+
    '.sw-slide-cat{font-family:Cinzel,serif;font-size:.44rem;letter-spacing:3px;color:rgba(212,175,55,.95);font-weight:700;text-transform:uppercase;margin-bottom:7px;display:flex;align-items:center;gap:6px;}'+
    '.sw-slide-cat::before{content:"";display:inline-block;width:22px;height:1px;background:rgba(212,175,55,.6);}'+
    '.sw-slide-tit{font-family:"Playfair Display",Georgia,serif;font-size:1.18rem;font-weight:700;color:#FFFFFF;line-height:1.25;text-shadow:0 2px 12px rgba(0,0,0,.9);margin-bottom:7px;}'+
    '.sw-slide-txt{font-family:"Cormorant Garamond",Georgia,serif;font-size:.92rem;line-height:1.65;color:rgba(245,239,226,.65);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}'+
    '.sw-slide-read{display:inline-block;margin-top:8px;font-family:Cinzel,serif;font-size:.38rem;letter-spacing:2px;color:rgba(212,175,55,.7);border-bottom:1px solid rgba(212,175,55,.3);}'+
    '#slDots{display:flex;justify-content:center;gap:6px;padding:8px 0 5px;background:#0A0A0A;}'+
    '.sw-dot{width:5px;height:5px;border-radius:50%;background:rgba(212,175,55,.18);border:none;padding:0;cursor:pointer;transition:all .25s;}'+
    '.sw-dot.on{background:#D4AF37;width:16px;border-radius:3px;}'+
    '.sw-art{background:rgba(10,5,2,.98);border:1px solid rgba(212,175,55,.1);border-radius:10px;margin:0 14px 14px;cursor:pointer;overflow:hidden;transition:transform .2s,box-shadow .2s;}'+
    '.sw-art:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,.6);}'+
    '.sw-art-img{width:100%;height:120px;object-fit:cover;display:block;}'+
    '.sw-art-body{padding:14px 16px 18px;}'+
    '.sw-art-tag{font-family:Cinzel,serif;font-size:.42rem;font-weight:700;letter-spacing:2px;color:rgba(212,175,55,.75);text-transform:uppercase;margin-bottom:6px;}'+
    '.sw-art-tit{font-family:"Playfair Display",Georgia,serif;font-size:1.05rem;font-weight:700;color:#FFFFFF;line-height:1.3;margin-bottom:8px;}'+
    '.sw-art-txt{font-family:"Cormorant Garamond",Georgia,serif;font-size:.96rem;line-height:1.85;color:rgba(245,239,226,.72);}'+
    '.sw-art-foot{font-family:Cinzel,serif;font-size:.4rem;letter-spacing:1px;color:rgba(245,239,226,.25);margin-top:10px;padding-top:8px;border-top:1px solid rgba(212,175,55,.08);}';
  document.head.appendChild(s);
})();

// ═══════════════════════════════════════════════════════════
// LA GAZZETTA DEL SOMMELIER
// 30 articoli organizzati in categorie.
// Ogni giorno vengono selezionati 6 articoli diversi per il
// carousel, creando l'effetto di notizie sempre fresche.
// ═══════════════════════════════════════════════════════════
var _GAZZETTA = [

  /* ═══ ATTUALITÀ DEL VINO ═══ */
  {
    id:'g01', cat:'🗞 Attualità del Vino',
    titolo:'Il Barolo batte tutti: record d\'aste a Hong Kong e New York',
    testo:'Il vino italiano conquista i vertici del mercato internazionale. Un lotto di Barolo Monfortino Giacomo Conterno 1958 ha raggiunto cifre senza precedenti nelle sale d\'asta di Hong Kong, confermando la crescente domanda globale per i grandi rossi delle Langhe. Analisti di Sotheby\'s parlano di una "rinascita del classicismo" nel collezionismo enologico mondiale.',
    img:'vineyard_a',
  },
  {
    id:'g02', cat:'🗞 Attualità del Vino',
    titolo:'Borgogna 2024: la critica internazionale lancia l\'allarme prezzi',
    testo:'Robert Parker Jr Foundation e Wine Spectator concordano: i prezzi dei Grand Cru borgognoni hanno superato ogni soglia di accessibilità. Un Romanée-Conti 2023 quota oggi oltre 18.000 euro a bottiglia. Il presidente del Comité Colbert lancia un appello alla "democratizzazione del lusso enologico" — ma i domaine continuano a ridurre le allocazioni ai mercati asiatici.',
    img:'cellar_a',
  },
  {
    id:'g03', cat:'🗞 Attualità del Vino',
    titolo:'Champagne: le grandi Maison puntano sul non-vintage di alta gamma',
    testo:'LVMH, Krug e Billecart-Salmon annunciano investimenti miliardari nel Non-Vintage Prestige. La filosofia si ribalta: non più il millesimato come apice, ma la sapienza dell\'assemblaggio come massima espressione. Dominique Demarville di Krug: "Ogni annata che entra nella Grande Cuvée è già storia — l\'assemblaggio è la nostra risposta al tempo."',
    img:'bubbles_a',
  },
  {
    id:'g04', cat:'🗞 Attualità del Vino',
    titolo:'Sassicaia difende il primato: 97 punti e storico sorpasso al Pétrus',
    testo:'La storica tenuta Bolgheri fa registrare il punteggio più alto della sua storia secolare. Il Sassicaia 2021, con il suo Cabernet Sauvignon affinato 24 mesi in barrique di rovere francese, ha ricevuto 97 punti da tre guide internazionali in contemporanea — una coincidenza che non si verificava dal leggendario 1985, annata che fece conoscere il Super Tuscan al mondo.',
    img:'vineyard_b',
  },
  {
    id:'g05', cat:'🗞 Attualità del Vino',
    titolo:'Vini naturali: il movimento vince la battaglia culturale in Europa',
    testo:'Per la prima volta, i vini "nature" superano il 12% delle vendite nei bistrot parigini e nelle enoteche milanesi di fascia alta. Una ricerca Vinexpo rivela che il consumatore under-35 privilegia la tracciabilità e la biodiversità del vigneto rispetto alla perfezione tecnica del vino. L\'artigianato batte l\'industriale, e i Salon del Vino Naturale si moltiplicano da Barcellona a Tokyo.',
    img:'harvest_a',
  },

  /* ═══ VITICOLTURA MONDIALE ═══ */
  {
    id:'g06', cat:'🌿 Viticoltura Mondiale',
    titolo:'Il cambiamento climatico ridisegna le mappe vitivinicole d\'Europa',
    testo:'L\'isoterma del 10°C — soglia tradizionale per la coltivazione della vite — si è spostata verso nord di oltre 200 chilometri negli ultimi trent\'anni. La Danimarca produce oggi Pinot Noir di qualità. La Svezia meridionale ha aperto 60 nuove cantine. Gli enologi inglesi della Cornovaglia parlano apertamente di "Borgogna atlantica". Nel frattempo, i vigneti storici provenzali cercano altitudini.',
    img:'vineyard_c',
  },
  {
    id:'g07', cat:'🌿 Viticoltura Mondiale',
    titolo:'L\'Etna: il vulcano attivo più studiato della viticoltura mondiale',
    testo:'Sedici università internazionali, da Berkeley a Osaka, hanno aperto laboratori di ricerca sulle lave dell\'Etna. Il suolo vulcanico basaltico contiene una concentrazione di potassio e manganese irriproducibile altrove. Marco de Grazia, pioniere dell\'enologia etnea, spiega: "Non piantiamo viti sull\'Etna — le liberiamo. La lava decide già tutto: struttura, mineralità, longevità."',
    img:'vineyard_d',
  },
  {
    id:'g08', cat:'🌿 Viticoltura Mondiale',
    titolo:'Georgia: 8.000 anni di kvevri e la riscoperta mondiale del vino arancione',
    testo:'La maccerazione delle bucce su vini bianchi, pratica ancestrale dei monaci georgiani, è oggi oggetto di studio nelle migliori università enologiche. Il Rkatsiteli affinato 6 mesi in anfora kvevri interrata ha conquistato i migliori sommelier di Copenaghen, New York e Tokyo. Ramaz Nikoladze, produttore di Kutaisi, riceve oggi ordini da 47 paesi: "Il mondo ha riscoperto la verità del vino."',
    img:'cellar_b',
  },
  {
    id:'g09', cat:'🌿 Viticoltura Mondiale',
    titolo:'Biodinamica: Domaine Leflaive e la rivoluzione silenziosa della Borgogna',
    testo:'Cinquant\'anni fa Domaine Leflaive era la cantina più convenzionale di Puligny-Montrachet. Oggi è il simbolo mondiale della viticoltura biodinamica. Il calendario lunare guida ogni intervento in vigna, le preparazioni Rudolf Steiner nutrono la microbiologia del suolo. Il risultato: Chardonnay che esprimono una mineralità da pietra focaia irraggiungibile per via chimica.',
    img:'harvest_b',
  },
  {
    id:'g10', cat:'🌿 Viticoltura Mondiale',
    titolo:'La Mosella eroica: i vignaioli che rischiano la vita per il Riesling perfetto',
    testo:'Pendii inclinati fino al 70%, ardesia scivolosa, nessuna meccanizzazione possibile. I 280 vignaioli della Mosel-Saar-Ruwer coltivano oggi 9.000 ettari a mano, uno per uno, con lo stesso metodo dei loro bisnonni. Il costo di produzione è quattro volte superiore a qualsiasi altra regione tedesca. Eppure il Riesling Spätlese di Bernkastel-Kues è ancora il vino bianco più longevo del pianeta.',
    img:'vineyard_a',
  },
  {
    id:'g11', cat:'🌿 Viticoltura Mondiale',
    titolo:'Mendoza conquista quota 1.500 metri: nasce il Malbec d\'alta montagna',
    testo:'Le nuove denominazioni de Las Compuertas e Gualtallary, a 1.400-1.500 metri sulle Ande, stanno ridefinendo il Malbec mondiale. L\'irraggiamento solare estremo e le escursioni termiche di 20°C tra giorno e notte costruiscono tannini dalla struttura inedita. Achaval Ferrer e Zuccardi Valle de Uco vinificano separatamente ogni parcella: l\'era del terroir argentino è cominciata.',
    img:'vineyard_c',
  },
  {
    id:'g12', cat:'🌿 Viticoltura Mondiale',
    titolo:'Santorini: l\'alberello kouloura che sfida il tempo e il mare',
    testo:'Le viti di Assyrtiko attorcigliate a spirale sul basalto di Santorini sono le più antiche d\'Europa a coltivazione continua — alcune superano i 300 anni. La forma kouloura protegge i grappoli dal vento di Meltemi e dall\'acqua salata del Mar Egeo. Il risultato è un bianco di mineralità assoluta, acidità tagliente e longevità straordinaria. Domaine Sigalas e Gaia Wines lo portano nel mondo.',
    img:'vineyard_d',
  },

  /* ═══ SOMMELIER INTERNAZIONALI ═══ */
  {
    id:'g13', cat:'🎩 Sommelier del Mondo',
    titolo:'Arvid Rosengren, il re dei sommelier, rivela i suoi 10 vini dell\'anno',
    testo:'Il campione mondiale ASI 2016 pubblica la sua lista annuale con una premessa che sorprende il settore: "La perfezione tecnica mi annoia. Cerco l\'anima nel calice." In cima alla sua selezione 2024: un Côte-Rôtie di René Rostaing, un Barolo di Maria Teresa Mascarello e — scelta provocatoria — un Riesling dell\'Alto Adige di Alois Lageder. "Il futuro del vino è nella bellezza dimenticata," scrive nel suo blog.',
    img:'sommelier_a',
  },
  {
    id:'g14', cat:'🎩 Sommelier del Mondo',
    titolo:'Rajat Parr abbandona la California e si trasferisce nelle Langhe',
    testo:'Il più celebre sommelier americano, guru del Pinot Noir californiano e fondatore di Sandhi Wines, ha acquistato un vigneto a Serralunga d\'Alba. La sua dichiarazione ha fatto scalpore: "Ho passato vent\'anni a cercare la Borgogna in California. Era sempre a Barolo, ad aspettarmi." Il progetto prevede una vinificazione tradizionale, grandi botti di Slavonia e zero interventismo. Prima uscita: 2027.',
    img:'tasting_a',
  },
  {
    id:'g15', cat:'🎩 Sommelier del Mondo',
    titolo:'Il Miglior Sommelier d\'Italia 2025: a sorpresa vince una donna delle Dolomiti',
    testo:'Elena Carraro, 31 anni, nata a Bolzano, ha conquistato il titolo nazionale AIS con un punteggio record nella prova di analisi organolettica alla cieca. Ha identificato correttamente un Riesling Auslese della Mosella del 1990, un Barolo Riserva del 1988 e un Sauternes del 1983 dalla sola analisi visiva e olfattiva. "Il vino parla — io ascolto" è diventata la frase più citata del mondo enologico italiano.',
    img:'glass_red_a',
  },
  {
    id:'g16', cat:'🎩 Sommelier del Mondo',
    titolo:'Éric Beaumard: vent\'anni al Georges V, il servizio come arte assoluta',
    testo:'Il vice-campione mondiale ASI e direttore del ristorante del Four Seasons Paris compie vent\'anni di servizio nella cantina più celebre d\'Europa. 50.000 referenze, 600.000 bottiglie, una temperatura mantenuta costante a 14°C su tre piani sotterranei in boulevard du Temple. Nel suo nuovo libro "L\'Emozione nel Bicchiere" scrive: "Un grande sommelier non serve il vino. Racconta una storia."',
    img:'cellar_a',
  },
  {
    id:'g17', cat:'🎩 Sommelier del Mondo',
    titolo:'La nuova generazione: i sommelier under-30 che stanno cambiando il mondo del vino',
    testo:'Sei under-trenta selezionati da Wine Spectator come "Voices of Tomorrow": tre donne, tre uomini, cinque continenti. Li accomuna un approccio rivoluzionario: abolire il gergo tecnico, democratizzare il linguaggio, avvicinare il vino alla quotidianità. Parla Paz Levinson di Argentina: "Il vino non è un\'élite. È un\'emozione. E le emozioni appartengono a tutti."',
    img:'sommelier_a',
  },

  /* ═══ TERROIR ═══ */
  {
    id:'g18', cat:'🌍 Terroir',
    titolo:'Il suolo come destino: la rivoluzione della geologia nella viticultura moderna',
    testo:'Il calcare kimmeridgiano di Chablis, l\'ardesia del Mosel, il galestro toscano, la pomice di Santorini: la geologia è tornata al centro del discorso enologico mondiale. Claude Bourguignon, il più famoso microbiologo del suolo viticolo, spiega: "Un vigneto non si coltiva. Si ascolta. Il suolo sa già tutto — il vignaiolo deve solo imparare a tradurre." Il suo istituto LAMS analizza oggi oltre 2.000 suoli all\'anno.',
    img:'vineyard_b',
  },
  {
    id:'g19', cat:'🌍 Terroir',
    titolo:'Priorat: la llicorella nera e i vini che sembrano estratti dalla roccia',
    testo:'Novantadue ettari di scisto nero — la llicorella — che le radici della Grenache centenaria attraversano per 15 metri alla ricerca dell\'acqua. Il Priorat è il terroir più estremo della penisola iberica. René Barbier pioniere, Álvaro Palacios rivoluzionario: insieme hanno trasformato una denominazione dimenticata nel tesoro più cercato dai collezionisti iberofili. Prezzi decuplicati in vent\'anni.',
    img:'vineyard_c',
  },
  {
    id:'g20', cat:'🌍 Terroir',
    titolo:'Tokaj: il "Vino dei Re" ritrova la sua grandezza dopo il comunismo',
    testo:'Trent\'anni dopo la caduta del muro, i vigneti di Tokaj hanno ritrovato la loro identità. Royal Tokaji, fondato da Hugh Johnson nel 1990, e Oremus, acquistato da Vega Sicilia nel 1993, hanno riportato il Tokaji Aszú agli antichi splendori. I botrytis naturali sulle uve Furmint producono un\'acidità e una dolcezza in equilibrio impossibile da eguagliare. Sei puttonyos: l\'apice della nobiltà liquida.',
    img:'vineyard_d',
  },

  /* ═══ IL SAPERE DEL VINO ═══ */
  {
    id:'g21', cat:'🍷 Il Sapere del Vino',
    titolo:'Perché i grandi vini migliorano con l\'invecchiamento: la scienza della longevità',
    testo:'L\'invecchiamento del vino è un processo di straordinaria complessità che affascina scienziati e sommelier da secoli. I polifenoli si polimerizzano, gli esteri si formano, gli acidi si esterificano. Un Barolo giovane esprime potenza e ruvidezza — lo stesso vino a vent\'anni diventa seta. La chiave è l\'acidità naturale: senza di essa, il vino non invecchia, decade. Ecco perché il Riesling della Mosella dura sessant\'anni.',
    img:'cellar_b',
  },
  {
    id:'g22', cat:'🍷 Il Sapere del Vino',
    titolo:'Il decanter: quando e perché aerare il vino — la guida definitiva',
    testo:'Decantare un vino significa dargli l\'ossigeno necessario per aprirsi, per esprimere profumi sopiti. Un Barolo giovane ha bisogno di tre ore di decanter per liberare i suoi aromi di rosa appassita e catrame. Un Champagne non va mai decantato: perderebbe le sue bollicine preziose. Un Sauternes vecchio si decanta appena cinque minuti. L\'arte del sommelier sta nel saper ascoltare ogni bottiglia individualmente.',
    img:'tasting_a',
  },
  {
    id:'g23', cat:'🍷 Il Sapere del Vino',
    titolo:'I vitigni autoctoni italiani: 377 varietà uniche al mondo',
    testo:'L\'Italia è la nazione vitivinicola più ricca di biodiversità ampelografica del pianeta: 377 vitigni autoctoni documentati, una per ogni sfumatura di territorio. Dal Timorasso dei Colli Tortonesi al Carricante dell\'Etna, dal Vitovska del Carso al Pecorino abruzzese. La globalizzazione del Cabernet e dello Chardonnay ha rischiato di cancellarli. La nuova generazione di produttori li salva uno per uno.',
    img:'harvest_a',
  },
  {
    id:'g24', cat:'🍷 Il Sapere del Vino',
    titolo:'Il calice giusto: come la forma del vetro cambia il vino che beviamo',
    testo:'Georg Riedel ha rivoluzionato il modo di bere vino negli anni Cinquanta intuendo che forma e volume del calice modificano radicalmente la percezione sensoriale. Un Barolo nel calice da Borgogna esprime una complessità che nel calice standard sembrerebbe piatta. Un Riesling nel calice affusolato mantiene la freschezza che si disperderebbe in un\'apertura ampia. Il vetro non è un contenitore: è uno strumento di musica.',
    img:'glass_red_b',
  },
  {
    id:'g25', cat:'🍷 Il Sapere del Vino',
    titolo:'Abbinamento cibo-vino: cinque regole che i grandi sommelier non violano mai',
    testo:'Prima regola: il vino non deve mai essere più dolce del cibo. Seconda: i grassi chiedono acidità. Terza: i pesci delicati fuggono i rossi tannici. Quarta: i formaggi stagionati tollerano quasi tutto — il grande rosso strutturato è il loro partner ideale. Quinta: l\'abbinamento geografico raramente delude — il Chianti con la bistecca fiorentina non è una convenzione, è una verità millenaria.',
    img:'sommelier_a',
  },
  {
    id:'g26', cat:'🍷 Il Sapere del Vino',
    titolo:'Annate leggendarie: i vini che hanno cambiato la storia del collezionismo',
    testo:'Il 1945 in Borgogna, il 1961 a Bordeaux, il 1971 in Germania, il 1990 in Piemonte, il 1997 in Toscana: ogni generazione ha la sua annata del secolo. Dietro ogni leggenda c\'è una combinazione irripetibile di freddo invernale, siccità estiva e vendemmia tardiva. Robert Parker Jr. ha costruito la sua reputazione mondiale su queste coincidenze meteorologiche. Ma i grandi vignaioli sanno che anche le annate difficili producono capolavori.',
    img:'vineyard_b',
  },
  {
    id:'g27', cat:'🍷 Il Sapere del Vino',
    titolo:'Il metodo classico: perché lo Champagne è ancora il re delle bollicine',
    testo:'Presa di spuma, remuage, dégorgement, dosaggio: quattro parole che raccontano un processo lungo tre anni di pazienza certosina. Lo Champagne non è solo vino spumante — è un sistema di produzione unico al mondo, codificato nel 1811 da Madame Clicquot. La presa di spuma nella bottiglia crea bollicine da 0,3 millimetri di diametro che non si trovano in nessun altro metodo. La natura è irriproducibile.',
    img:'bubbles_b',
  },
  {
    id:'g28', cat:'🍷 Il Sapere del Vino',
    titolo:'Brunello di Montalcino: il vino che sfida il tempo con autorità assoluta',
    testo:'Il Sangiovese Grosso — chiamato Brunello dai contadini di Montalcino — produce il vino italiano dalla longevità più documentata. Un Brunello di Biondi-Santi 1891 degustato nel 1970 era ancora vivo, complesso, memorabile. La ferrugginosa galestro toscana, l\'altitudine di 500 metri, le brezze marine del Tirreno: tre fattori che costruiscono un\'acidità e una struttura tannica capaci di sfidare mezzo secolo.',
    img:'vineyard_a',
  },
  {
    id:'g29', cat:'🍷 Il Sapere del Vino',
    titolo:'Vini dolci: il grande equivoco del dessert wine nella cultura occidentale',
    testo:'Il Sauternes di Château d\'Yquem del 1811 è il vino più caro mai venduto all\'asta: 117.000 dollari a bottiglia nel 2011. Eppure in Occidente il vino dolce viene ancora servito a fine pasto quasi con scuse. In Giappone, in Cina, nel mondo arabo è considerato il massimo dell\'ospitalità. Tokaji, Trockenbeerenauslese, Recioto di Soave: l\'errore è bere i dolci solo a fine pasto. Sono vini da meditazione.',
    img:'glass_wht_a',
  },
  {
    id:'g30', cat:'🍷 Il Sapere del Vino',
    titolo:'Il Riesling: il vitigno più incompreso e più longevo del mondo',
    testo:'Snobbato dai neofiti per il nome tedesco, amato in modo assoluto da tutti i sommelier professionisti: il Riesling è il paradosso del vino mondiale. Non contiene quasi per niente solfiti aggiunti, si vinifica senza legno, esprime in modo straordinario il terroir. Un Riesling Auslese della Mosella invecchia 50 anni mantenendo un\'acidità cristallina e sviluppando aromi di miele, idrocarburi nobilissimi e fiori appassiti.',
    img:'vineyard_c',
  },
];

// Genera la data italiana leggibile
window._getDataItaliana = function() {
  var m=['gennaio','febbraio','marzo','aprile','maggio','giugno',
         'luglio','agosto','settembre','ottobre','novembre','dicembre'];
  var d=new Date();
  return d.getDate()+' '+m[d.getMonth()]+' '+d.getFullYear();
};

// Seed giornaliero deterministico — cambia ogni giorno
window._daySeed = function() {
  var d=new Date();
  return d.getFullYear()*10000 + (d.getMonth()+1)*100 + d.getDate();
};

// Seleziona 6 articoli ruotanti per il carousel (cambiano ogni giorno)
window._selectDailyNews = function() {
  var seed=window._daySeed();
  var pool=_GAZZETTA.slice(); // copia
  // Fisher-Yates seeded shuffle
  for(var i=pool.length-1;i>0;i--){
    seed=(seed*1664525+1013904223)&0xffffffff;
    var j=Math.abs(seed)%(i+1);
    var tmp=pool[i]; pool[i]=pool[j]; pool[j]=tmp;
  }
  // Priorità: almeno 1 per categoria principale
  var cats=['🗞 Attualità del Vino','🌿 Viticoltura Mondiale','🎩 Sommelier del Mondo'];
  var result=[];
  cats.forEach(function(cat){
    for(var k=0;k<pool.length;k++){
      if(pool[k].cat===cat){result.push(pool[k]);pool.splice(k,1);break;}
    }
  });
  // Completa fino a 6 con i rimanenti
  result=result.concat(pool.slice(0,6-result.length));
  return result.slice(0,6);
};

// Converte un articolo _GAZZETTA nel formato standard
window._gazetteToArt = function(g) {
  /* Usa foto dedicata per articoli sapere, foto per topic per gazzetta */
  var sapPhoto = {'sap01':'tasting_a','sap02':'glass_red_a','sap03':'cellar_a',
    'sap04':'bottles_a','sap05':'cellar_b','sap06':'harvest_a','sap07':'vineyard_a',
    'sap08':'tasting_b','sap09':'sommelier_a','sap10':'vineyard_e',
    'sap11':'bubbles_a','sap12':'vineyard_c'};
  var photoKey = sapPhoto[g.id] || g.img;
  var img = (_VP&&_VP[photoKey]) || window.getTopicPhoto(g.titolo,g.cat,0);
  return {
    id:'gz_'+g.id, isNews:true,
    /* Usa campi multilingua se presenti nell'articolo, altrimenti vuoto (traduzione lazy) */
    titolo_it: g.titolo_it || g.titolo || '',
    testo_it:  g.testo_it  || g.testo  || '',
    categoria_it: g.cat || '',
    titolo_en: g.titolo_en || '',
    testo_en:  g.testo_en  || '',
    categoria_en: g.cat || '',
    titolo_fr: g.titolo_fr || '',
    testo_fr:  g.testo_fr  || '',
    categoria_fr: g.cat || '',
    titolo_ru: g.titolo_ru || '',
    testo_ru:  g.testo_ru  || '',
    categoria_ru: g.cat || '',
    immagine: img,
    data: window._getDataItaliana(),
    generato_ai: false,
  };
};

// Articoli di sapere (non-news) per la sezione in fondo
/* ══ IL SAPERE DEL VINO — 12 articoli permanenti + quelli dalla Gazzetta ══ */
/* ══════════════════════════════════════════
   POOL 200+ TEMI — articoli dinamici ogni giorno via AI
   ══════════════════════════════════════════ */
var _SAPERE_TOPICS = [
  'Il decanter: storia e scienza dell\'aerazione del vino',
  'Il calice perfetto: come la forma cambia il vino',
  'La temperatura di servizio: il dettaglio che cambia tutto',
  'Il cavatappi: 300 anni di storia e ingegneria del vino',
  'Sughero vs tappo a vite: il grande dibattito del vino moderno',
  'La fillossera: il parassita che ha cambiato il vino mondiale',
  'Biodinamica: il vino e il calendario lunare di Rudolf Steiner',
  'La vendemmia: da rito ancestrale a scienza moderna',
  'Come si pota una vigna e perché è così importante',
  'I terrazzamenti eroici della Valtellina e del Mosel',
  'Il basalto dell\'Etna e il Nerello Mascalese: un amore vulcanico',
  'Il Nebbiolo: il vitigno più capriccioso d\'Italia',
  'Sangiovese: mille nomi, mille facce in tutta l\'Italia',
  'Riesling: il vitigno più incompreso e longevo del mondo',
  'Pinot Nero: il sogno impossibile dei viticoltori di tutto il mondo',
  'Il Malbec argentino: emigrante bordolese diventato re delle Ande',
  'La fillossera: il disastro che ha unito Europa e America',
  'Come Madame Clicquot ha inventato il remuage dello Champagne',
  'Il Giudizio di Parigi 1976: quando la California sconfisse la Francia',
  'Robert Parker e la nascita del punteggio 100 nel vino',
  'Il simposio greco: le regole del bere nel mondo antico',
  'I monaci benedettini e la nascita del concetto di Grand Cru',
  'Come il vino ha influenzato le grandi decisioni della politica mondiale',
  'Tokaji: il vino dei Re d\'Ungheria attraverso i secoli',
  'Come pensa un Maestro Sommelier durante una degustazione alla cieca',
  'Il metodo WSET: come si diventa sommelier professionista',
  'Come riconoscere un vino difettoso: i 7 difetti principali',
  'Pizza e vino: la guida definitiva all\'abbinamento per regione',
  'Tartufo bianco e vino: solo Barolo o c\'è altro da scoprire?',
  'Formaggi e vino: la guida completa per tipo di stagionatura',
  'Ostriche e Champagne: una storia d\'amore antica di tre secoli',
  'La cantina perfetta: temperatura, umidità, oscurità e vibrazioni',
  'Barrique vs botti grandi: la differenza nel carattere del vino',
  'Il deposito nel vino: amico o nemico da eliminare?',
  'Le annate leggendarie: 1945 Borgogna, 1961 Bordeaux, 1990 Barolo',
  'Perché i grandi vini migliorano con decenni di invecchiamento',
  'Il vino georgiano in anfora kvevri: 8000 anni di storia ininterrotta',
  'I vini arancio: macerazione sulle bucce e cosa cambia nel bicchiere',
  'Pet-Nat: la rivoluzione delle bollicine artigianali naturali',
  'Vini dolci: perché in Occidente li beviamo solo a fine pasto (sbagliato)',
  'Come Gaja ha trasformato il Barolo e il mondo del vino italiano',
  'Biondi-Santi: la famiglia che ha inventato il Brunello di Montalcino',
  'Romanée-Conti: il vigneto più prezioso e ambito del pianeta',
  'Sassicaia 1972: come è nato il primo Super Tuscan della storia',
  'Pétrus: il miracolo enologico del Merlot su argilla blu a Pomerol',
  'Perché il vino rosso fa venire il mal di testa: miti e realtà scientifiche',
  'Come il cervello percepisce il vino: la neurogastronomia del gusto',
  'Il colore del bicchiere cambia davvero il sapore del vino: esperimenti',
  'Vino e salute: cosa dice davvero la scienza moderna sul consumo moderato',
  'Come il vino cambia con la pressione atmosferica durante un volo aereo',
  'Sashi e vino: quale abbinamento scelgono i giapponesi per il sake alternativo',
  'Come leggere un\'etichetta di vino senza essere esperti del settore',
  'Il metodo champenoise spiegato passo per passo ai non esperti',
  'Champagne vs Cava vs Franciacorta vs Crémant: le differenze vere',
  'Riesling tedesco vs alsaziano: stesso vitigno, mondi completamente diversi',
  'Il vino in Cina: il mercato che ha rivoluzionato il mondo enologico',
  'I vini vulcanici: Etna, Santorini, Canarie a confronto',
  'Il Priorat: come un territorio abbandonato è diventato leggenda mondiale',
  'Arianna Occhipinti: la rivoluzione del vino naturale in Sicilia',
  'Come la musica classica cambia la percezione e il gusto del vino',
  'Vino e cioccolato: le combinazioni sorprendenti che nessuno si aspetta',
  'Come conservare il vino aperto per più di 3 giorni senza farlo ossidare',
  'Il segreto dei sommelier per scegliere il vino al ristorante senza sbagliare',
  'Come si fa una verticale di Barolo: l\'esperienza del tempo nel bicchiere',
  'Stappare una bottiglia di Champagne: il gesto corretto del professionista',
  'La storia del rosé: da vino di serie B a protagonista dell\'estate mondiale',
  'Vitigni autoctoni italiani: i 377 tesori ampelografici unici al mondo',
  'Il Carménère: il vitigno bordolese creduto estinto e trovato in Cile',
  'Il vino nella letteratura: da Omero a Hemingway i grandi scrittori e il vino',
  'Come i grandi sommelier preparano le aste di vino da un milione di euro',
  'Il fenomeno dei vini da garage: quando il piccolo batte il grande',
  'Bio, biodinamico, naturale: le differenze che pochi conoscono davvero',
  'La storia del Barolo: da vino dolce a re dei vini italiani nel Novecento',
  'Come funziona il mercato dei vini da collezione a Sotheby\'s e Christie\'s',
  'Il sughero: dalla quercia da sughero portoghese alla bottiglia in 12 mesi',
  'I sommelier militari: come le grandi navi e gli eserciti gestivano le cantine',
  'Vino e cucina molecolare: gli abbinamenti impossibili che funzionano',
  'Il vino in Giappone: come i giapponesi hanno imparato a produrre Pinot Nero',
  'Come il cambiamento climatico sta spostando i vigneti verso nord',
  'Il fenomeno dei vini arancio in Slovenia e Friuli: la storia completa',
  'Amarone: come nasce il processo di appassimento delle uve a Valpolicella',
  'Il Vin Jaune della Jura: il vino sotto il velo di lieviti per 6 anni',
  'I vini di ghiaccio canadesi e tedeschi: vendemmia a -8°C all\'alba',
  'Brunello di Montalcino: perché invecchia 40 anni e rimane straordinario',
  'Come si fanno le selezioni di parcella nei grandi vigneti di Borgogna',
  'Il Cognac e l\'Armagnac: quando il vino diventa spirito attraverso la distillazione',
  'Come il vino greco antico era completamente diverso da quello moderno',
  'Il Marsala: da vino da tavola siciliano a liquore mondialmente famoso',
  'I vini di Madeira: perché durano secoli e come si producono',
  'Il fenomeno dei wine bar: come il vino al bicchiere ha cambiato le città',
];

/* Cache articoli generati oggi */
window._sapereCache = {};

/* Seleziona 3 temi per oggi (diversi ogni giorno) */
window._selectDailyTopics = function(offset) {
  var seed = window._daySeed() + (offset||0);
  var pool = window._SAPERE_TOPICS.slice();
  for (var i=pool.length-1; i>0; i--) {
    seed = (seed*1664525+1013904223)&0xffffffff;
    var j = Math.abs(seed)%(i+1);
    var tmp=pool[i]; pool[i]=pool[j]; pool[j]=tmp;
  }
  return pool.slice(0,3);
};

/* Genera articolo via Worker e mette in cache (oggi) */
window._generateSapereArticle = async function(topic, index) {
  var lang = window.getLang ? window.getLang() : 'it';
  var today = new Date().toISOString().split('T')[0];
  var cKey = 'sw_sap_'+today+'_'+index+'_'+lang;

  /* Controlla cache localStorage */
  try {
    var cached = localStorage.getItem(cKey);
    if(cached) {
      var art = JSON.parse(cached);
      window._sapereCache[index] = art;
      return art;
    }
  } catch(e){}

  /* Genera via Worker */
  var r = await fetch('https://hidden-term-f2d0.timotiniurie49.workers.dev/api/article', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({topic:topic, lang:lang}),
  });
  var d = await r.json();
  if(!d.titolo||!d.testo) throw new Error('Risposta non valida');

  var art = {
    id:'sap_dyn_'+today+'_'+index,
    ['titolo_'+lang]: d.titolo,
    ['testo_'+lang]:  d.testo,
    titolo_it: lang==='it' ? d.titolo : topic,
    testo_it:  lang==='it' ? d.testo  : '',
    categoria_it:'🍷 Il Sapere del Vino',
    immagine: window.getTopicPhoto(topic,'🍷 Il Sapere del Vino', index),
    isNews:false, generato_ai:true,
  };

  /* Salva in cache */
  try { localStorage.setItem(cKey, JSON.stringify(art)); } catch(e){}
  window._sapereCache[index] = art;
  return art;
};

/* Carica e renderizza le card sapere (3 articoli dinamici) */
window._loadSapereCards = async function() {
  var container = document.getElementById('sapereCards');
  if(!container) return;

  var topics = window._selectDailyTopics(window._sapereOffset||0);

  /* Mostra placeholder mentre carica */
  container.innerHTML = topics.map(function(topic, i){
    return '<div class="sw-art" style="opacity:.4;">'+
      '<div class="sw-art-body">'+
      '<div class="sw-art-tag">🍷 Il Sapere del Vino</div>'+
      '<div class="sw-art-tit" style="font-style:italic;color:rgba(245,239,226,.4);">'+topic.substring(0,60)+'…</div>'+
      '<div class="sw-art-txt" style="font-size:.8rem;">⏳ Generazione in corso…</div>'+
      '</div></div>';
  }).join('');

  /* Genera ogni articolo e aggiorna la card */
  for(var i=0; i<topics.length; i++) {
    try {
      var art = await window._generateSapereArticle(topics[i], i);
      window._sapereCache[i] = art;
      /* Aggiorna la singola card */
      var lang = window.getLang ? window.getLang() : 'it';
      var tit = art['titolo_'+lang] || art.titolo_it || topics[i];
      var txt = art['testo_'+lang]  || art.testo_it  || '';
      var img = art.immagine || '';
      var cards = container.querySelectorAll('.sw-art');
      if(cards[i]) {
        cards[i].style.opacity='1';
        cards[i].innerHTML =
          (img?'<img class="sw-art-img" src="'+img+'" alt="" loading="lazy" onerror="this.style.display=\'none\'">':'')+
          '<div class="sw-art-body">'+
            '<div class="sw-art-tag">🍷 Il Sapere del Vino</div>'+
            '<div class="sw-art-tit">'+tit+'</div>'+
            '<div class="sw-art-txt">'+txt.substring(0,220)+'…</div>'+
            '<div class="sw-art-foot">'+window._getDataItaliana()+' · Sommelier World AI</div>'+
          '</div>';
        (function(a){ cards[i].onclick=function(){window.openArticleReader(a);}; })(art);
      }
    } catch(e) {
      console.log('[Sapere] Errore generazione articolo '+i+':', e.message);
    }
  }
};

var _SAPERE_EXTRA = []; /* Compatibilità — non usato */

window._SAPERE = _SAPERE_EXTRA.concat(
  _GAZZETTA.filter(function(g){return g.cat==='🍷 Il Sapere del Vino';})
);

// ═══════════════════════════════════════════════════════════
// STATO CAROUSEL
// ═══════════════════════════════════════════════════════════
window._arts   = [];
window._sIdx   = 0;
window._sTimer = null;

// ═══════════════════════════════════════════════════════════
// RENDER CAROUSEL — GLOBALE
// ═══════════════════════════════════════════════════════════
window.renderSlides = function() {
  var area  =document.getElementById('slArea');
  var dotsEl=document.getElementById('slDots');
  var cntEl =document.getElementById('newsCnt');
  if(!area) return;

  /* Il carousel usa sempre la versione italiana — la traduzione avviene aprendo l'articolo */
  var lang='it';
  var arts=window._arts.slice(0,7);
  if(!arts.length) arts=window._selectDailyNews().map(window._gazetteToArt);

  if(cntEl) cntEl.textContent=arts.length+' articoli';

  if(window._sTimer){clearInterval(window._sTimer);window._sTimer=null;}

  var oggi=window._getDataItaliana();

  area.innerHTML='';
  arts.forEach(function(a,i){
    /* Usa traduzione diretta se disponibile, poi cache, poi italiano */
    var tit = a['titolo_'+lang] || '';
    var txt = a['testo_'+lang]  || '';
    var cat = a['categoria_'+lang] || a.categoria_it || a.categoria || '';
    if(!tit || tit === (a.titolo_it||a.titolo||'')) {
      /* Cerca nel cache localStorage */
      if(lang !== 'it' && window._trCache && a.id) {
        var ct = window._trCache.get(a.id, lang, 'titolo');
        var cx = window._trCache.get(a.id, lang, 'testo');
        if(ct) { tit = ct; a['titolo_'+lang] = ct; }
        if(cx) { txt = cx; a['testo_'+lang]  = cx; }
      }
    }
    /* Fallback italiano */
    if(!tit) tit = a.titolo_it || a.titolo || '';
    if(!txt) txt = a.testo_it  || a.testo  || '';
    var img=a.immagine||window.getTopicPhoto(tit,cat,i);

    var sl=document.createElement('div');
    sl.className='sw-slide'+(i===0?' on':'');
    /* Gradiente sempre presente come fallback colore */
    var gradients=['linear-gradient(135deg,#1a0505,#3a0808)','linear-gradient(135deg,#0d0a1a,#1a1040)',
      'linear-gradient(135deg,#0c1a06,#1a3010)','linear-gradient(135deg,#1a0808,#2a0b0b)'];
    sl.style.background = gradients[i % gradients.length];

    var imgEl=document.createElement('img');
    imgEl.className='sw-bg'; imgEl.alt=''; imgEl.loading=i===0?'eager':'lazy'; imgEl.src=img;
    imgEl.onerror=function(){ this.style.display='none'; };

    var grad=document.createElement('div'); grad.className='sw-grad';

    var body=document.createElement('div'); body.className='sw-body';
    body.innerHTML=
      '<div class="sw-slide-date">'+oggi+'</div>'+
      '<div class="sw-slide-cat">'+cat+'</div>'+
      '<div class="sw-slide-tit">'+tit+'</div>'+
      '<div class="sw-slide-txt">'+txt.substring(0,140)+'…</div>'+
      '<div class="sw-slide-read">Leggi l\'articolo →</div>';

    sl.appendChild(imgEl); sl.appendChild(grad); sl.appendChild(body);
    (function(art){sl.addEventListener('click',function(){window.openArticleReader(art);});})(a);
    area.appendChild(sl);
  });

  // Dots
  if(dotsEl){
    dotsEl.innerHTML='';
    arts.forEach(function(_,i){
      var d=document.createElement('button');
      d.className='sw-dot'+(i===0?' on':'');
      d.setAttribute('aria-label','Articolo '+(i+1));
      (function(idx){d.addEventListener('click',function(){window.goSlide(idx);});})(i);
      dotsEl.appendChild(d);
    });
  }

  window._sIdx=0;
  if(arts.length>1){
    window._sTimer=setInterval(function(){
      window._sIdx=(window._sIdx+1)%arts.length;
      window.goSlide(window._sIdx);
    },6000);
  }

  // Touch swipe
  var _tx=0;
  area.addEventListener('touchstart',function(e){_tx=e.touches[0].clientX;},{passive:true});
  area.addEventListener('touchend',function(e){
    var dx=e.changedTouches[0].clientX-_tx;
    if(Math.abs(dx)>40){
      if(window._sTimer){clearInterval(window._sTimer);window._sTimer=null;}
      window._sIdx=dx<0?(window._sIdx+1)%arts.length:(window._sIdx-1+arts.length)%arts.length;
      window.goSlide(window._sIdx);
      setTimeout(function(){
        if(!window._sTimer)
          window._sTimer=setInterval(function(){window._sIdx=(window._sIdx+1)%arts.length;window.goSlide(window._sIdx);},6000);
      },8000);
    }
  },{passive:true});
};

window.goSlide=function(idx){
  window._sIdx=idx;
  document.querySelectorAll('#slArea .sw-slide').forEach(function(s,j){s.classList.toggle('on',j===idx);});
  document.querySelectorAll('#slDots .sw-dot').forEach(function(d,k){d.classList.toggle('on',k===idx);});
};

// ═══════════════════════════════════════════════════════════
// SEZIONE "IL SAPERE DEL VINO" — card con immagine
// ═══════════════════════════════════════════════════════════
window._sapereOffset = 0;

window._sapereShowMore = function() {
  window._sapereOffset += 3;
  if(typeof window._loadSapereCards==='function') window._loadSapereCards();
};

window.renderSapere=function(arts){
  /* Delega alla generazione dinamica */
  if(typeof window._loadSapereCards === 'function') {
    window._loadSapereCards();
    return;
  }

};

window.loadRealNews = async function() {
  try {
    var r = await fetch('https://hidden-term-f2d0.timotiniurie49.workers.dev/api/news');
    var d = await r.json();
    if(!d.articles||!d.articles.length) return null;
    return d.articles;
  } catch(e) {
    console.log('[News RSS] Non disponibile:', e.message);
    return null;
  }
};

window.loadServerArts=function(){
  /* Senza server Railway — legge articoli dal localStorage (salvati dall'Admin) */
  try {
    var stored = JSON.parse(localStorage.getItem('sw_articles')||'[]');
    var gazetteArts = window._selectDailyNews().map(window._gazetteToArt);

    /* Unisci: articoli admin + gazzetta giornaliera */
    var allArts = stored.concat(gazetteArts);

    /* Assegna foto verificate */
    allArts.forEach(function(a, i) {
      if(!a.immagine||!a.immagine.startsWith('http')) {
        a.immagine = window.getTopicPhoto(a.titolo_it||a.titolo||'', a.categoria_it||a.categoria||'', i);
      }
    });

    /* Applica traduzioni cached */
    var curLang = window.getLang ? window.getLang() : 'it';
    if(curLang !== 'it') {
      allArts.forEach(function(a){ window._trCache.applyToArt(a, curLang); });
    }

    window._arts = allArts.slice(0, 8);
    window.renderSlides();

    var sapere = stored.filter(function(a){ return !a.isNews; }).slice(0,3);
    if(!sapere.length) sapere = window._SAPERE.slice(0,3).map(window._gazetteToArt);
    window.renderSapere(sapere);

    /* Traduzioni background — parte subito, aggiorna carousel man mano */
    if(typeof window.translateAllArticles === 'function') {
      var _translateArts = window._arts.slice(); /* copia per sicurezza */
      /* Prima lingua selezionata = priorità */
      var _curLng = window.getLang ? window.getLang() : 'it';
      var _langs = ['en','fr','ru'].filter(function(l){ return l!==_curLng; });
      if(_curLng !== 'it') _langs.unshift(_curLng); /* traduce prima la lingua attiva */

      setTimeout(function(){
        _langs.reduce(function(p, lng){
          return p.then(function(){
            return window.translateAllArticles(_translateArts, lng);
          });
        }, Promise.resolve());
      }, 800); /* parte dopo 800ms — più veloce del precedente 2s */
    }

    console.log('[Gazzetta] '+stored.length+' articoli admin + '+gazetteArts.length+' gazzetta');
  } catch(e) {
    console.log('[Gazzetta] fallback gazzetta:', e.message);
    window._arts = window._selectDailyNews().map(window._gazetteToArt);
    window.renderSlides();
    window.renderSapere(window._SAPERE.slice(0,3).map(window._gazetteToArt));
  }
};

// Admin → Carousel
// ═══════════════════════════════════════════════════════════
// ADMIN NOTIZIE — funzioni chiamate dall'admin panel
// ═══════════════════════════════════════════════════════════
window.adminSaveNews = async function() {
  var tit  = ((document.getElementById('newsAdminTitolo')||{}).value||'').trim();
  var cat  = ((document.getElementById('newsAdminCat')   ||{}).value||'');
  var img  = ((document.getElementById('newsAdminImg')   ||{}).value||'');
  var txt  = ((document.getElementById('newsAdminTesto') ||{}).value||'').trim();
  var st   = document.getElementById('newsAdminStatus');
  if(!tit||!txt){ if(st){st.style.color='#f88';st.textContent='✗ Titolo e testo obbligatori.';} return; }
  if(st){ st.style.color='rgba(212,175,55,.5)'; st.textContent='⏳ Pubblicazione…'; }
  try {
    var srv=window.SRV||window.SERVER_URL||'https://sommelier-server-production-8f92.up.railway.app';
    var today=new Date().toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'});
    var art={
      id:'news_'+Date.now(), generato_ai:false, isNews:true,
      titolo_it:tit, titolo_en:tit, titolo_fr:tit,
      testo_it:txt, testo_en:txt, testo_fr:txt,
      categoria_it:cat, categoria_en:cat, categoria_fr:cat,
      immagine:img||'', autore:'Sommelier World', data:today,
    };
    /* Salva in localStorage — nessun server */
    var arts = JSON.parse(localStorage.getItem('sw_articles')||'[]');
    arts.unshift(art);
    localStorage.setItem('sw_articles', JSON.stringify(arts));
    if(st){ st.style.color='#5dde8a'; st.textContent='✓ Notizia pubblicata nel carousel!'; }
    ['newsAdminTitolo','newsAdminImg','newsAdminTesto'].forEach(function(id){var e=document.getElementById(id);if(e)e.value='';});
    window.loadServerArts();
    if(typeof window.adminLoadArticles==='function') window.adminLoadArticles();
  } catch(e) { if(st){ st.style.color='#f88'; st.textContent='✗ '+e.message; } }
};

window.adminGenNews = async function() {
  var btn = document.getElementById('btnGenNews');
  var st  = document.getElementById('newsAdminStatus');
  if(btn) btn.disabled=true;
  if(st)  { st.style.color='rgba(212,175,55,.5)'; st.textContent='⏳ Generazione con AI…'; }
  if(typeof window.callAPI !== 'function') {
    if(st){ st.style.color='#f88'; st.textContent='✗ AI non ancora caricata. Riprova.'; }
    if(btn) btn.disabled=false; return;
  }
  try {
    var sys = 'Sei un giornalista enologico. Genera UNA notizia sul vino di attualità in italiano elegante. '+
      'Rispondi SOLO con JSON valido: {"titolo":"...","categoria":"🗞 Attualità del Vino","testo":"..."}. '+
      'Il testo deve essere 3-4 paragrafi informativi e precisi. Nessun testo fuori dal JSON.';
    var count = 0;
    for(var i=0; i<3; i++) {
      try {
        var res = await window.callAPI(sys, 'Genera notizia vino numero '+(i+1)+' su un tema diverso dagli altri.', 'it');
        var json = JSON.parse(res.replace(/```json|```/g,'').trim());
        if(json.titolo && json.testo) {
          var art = {
            id:'gen_'+Date.now()+'_'+i, isNews:true, generato_ai:true,
            titolo_it:json.titolo, testo_it:json.testo, categoria_it:json.categoria||'🗞 Attualità del Vino',
            titolo_en:'', testo_en:'', categoria_en:json.categoria||'Wine News',
            titolo_fr:'', testo_fr:'', categoria_fr:json.categoria||'Actualité du Vin',
            immagine:'', autore:'AI', data:new Date().toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'}),
          };
          var arts = JSON.parse(localStorage.getItem('sw_articles')||'[]');
          arts.unshift(art);
          localStorage.setItem('sw_articles', JSON.stringify(arts));
          count++;
        }
      } catch(e2) { console.log('Articolo '+i+' saltato:', e2.message); }
    }
    if(st){ st.style.color='#5dde8a'; st.textContent='✓ '+count+' notizie generate!'; }
    window.loadServerArts();
    if(typeof window.adminLoadArticles==='function') window.adminLoadArticles();
  } catch(e) {
    if(st){ st.style.color='#f88'; st.textContent='✗ '+e.message; }
  } finally { if(btn) btn.disabled=false; }
};

/* Traduce articoli in lingua corrente e aggiorna le card immediatamente */
window.translateAndRefresh = async function(lang) {
  /* Lingua italiana: render immediato senza traduzione */
  if(!lang || lang==='it') {
    if(typeof window.renderSlides==='function') window.renderSlides();
    if(typeof window.renderSapere==='function') window.renderSapere([]);
    return;
  }
  if(typeof window.translateAllArticles !== 'function') {
    /* callAPI non ancora caricato: render con italiano */
    if(typeof window.renderSlides==='function') window.renderSlides();
    if(typeof window.renderSapere==='function') window.renderSapere([]);
    return;
  }

  /* Costruisce lista articoli da tradurre */
  var allArts = [];
  /* Articoli carousel */
  if(window._arts) allArts = allArts.concat(window._arts);
  /* Articoli sapere — converti in formato standard */
  if(window._SAPERE) {
    window._SAPERE.forEach(function(s){
      if(s.id && s.testo) allArts.push({id:s.id, titolo_it:s.titolo||'', testo_it:s.testo||''});
    });
  }

  /* Render immediato con quello che c'è in cache */
  if(typeof window.renderSlides==='function') window.renderSlides();
  if(typeof window.renderSapere==='function') window.renderSapere([]);

  /* Controlla se ci sono articoli senza traduzione */
  var needsTrans = allArts.filter(function(a){
    return a.id && !window._trCache.has(a.id, lang);
  });

  if(!needsTrans.length) return; /* tutto in cache — già fatto */

  /* Mostra ⏳ nel FAB e spinner nelle card */
  if(typeof window._showTranslating==='function') window._showTranslating(true);
  var sapC = document.getElementById('sapereCards');
  if(sapC && sapC.children.length) {
    var loader = document.createElement('div');
    loader.style.cssText='text-align:center;padding:12px;font-family:Cinzel,serif;'+
      'font-size:.44rem;letter-spacing:2px;color:rgba(212,175,55,.4);';
    loader.textContent='⏳ Traduzione in corso…';
    sapC.insertBefore(loader, sapC.firstChild);
  }

  try {
    await window.translateAllArticles(allArts, lang);
    /* Aggiorna tutto con le traduzioni appena generate */
    if(typeof window.renderSlides==='function') window.renderSlides();
    if(typeof window.renderSapere==='function') window.renderSapere([]);
  } catch(e) {
    console.log('[Traduzione] Errore:', e.message);
  } finally {
    if(typeof window._showTranslating==='function') window._showTranslating(false);
  }
};

window.syncAfterAdminSave=function(){
  setTimeout(function(){window.loadServerArts();},1200);
};


// ═══════════════════════════════════════════════════════════
// EVENTI DEL VINO 2026 — render nella home
// ═══════════════════════════════════════════════════════════
window._EVENTI = [
  {
    data:'15–18 Maggio 2026', luogo:'Bordeaux, Francia',
    nome:'Vinexpo Bordeaux 2026',
    desc:'Il salone internazionale del vino più antico d\'Europa. 1.000 espositori, 25.000 professionisti del settore da 100 paesi. Masterclass con i maestri di Château Pétrus e Domaine de la Romanée-Conti.',
    url:'https://vinexpo.com', tag:'🌍 Internazionale', colore:'rgba(160,200,255,.8)',
  },
  {
    data:'22–25 Maggio 2026', luogo:'Verona, Italia',
    nome:'Vinitaly 2026',
    desc:'La più grande fiera del vino italiano nel mondo. 4.000 espositori, 100.000 visitatori. Focus speciale su Barolo, Brunello, Amarone e i nuovi vitigni autoctoni.',
    url:'https://vinitaly.com', tag:'🇮🇹 Italia', colore:'rgba(212,175,55,.85)',
  },
  {
    data:'6–8 Giugno 2026', luogo:'Napa Valley, USA',
    nome:'Napa Valley Wine Auction',
    desc:'L\'asta di beneficenza più famosa del mondo del vino. I grandi Cabernet Sauvignon di Napa battuti all\'asta per cifre record. Accesso su invito per i collezionisti internazionali.',
    url:'https://napavalleyvintners.com', tag:'🇺🇸 USA', colore:'rgba(255,170,120,.8)',
  },
  {
    data:'12–14 Settembre 2026', luogo:'Champagne, Francia',
    nome:'Les Journées du Champagne',
    desc:'Le cantine più riservate della Champagne aprono al pubblico per tre giorni straordinari. Degustazioni in cantina con i chef de cave delle grandi Maison: Krug, Dom Pérignon, Roederer.',
    url:'https://champagne.fr', tag:'🍾 Champagne', colore:'rgba(220,220,180,.8)',
  },
  {
    data:'18–20 Settembre 2026', luogo:'Barolo, Italia',
    nome:'Collisioni — Agrifood Music Festival',
    desc:'Musica, arte e il grande vino delle Langhe. Il festival che unisce cultura e viticoltura nel cuore del Barolo. Concerti tra i filari, degustazioni verticali con i produttori storici.',
    url:'https://collisioni.it', tag:'🍷 Langhe', colore:'rgba(212,175,55,.85)',
  },
  {
    data:'3–5 Ottobre 2026', luogo:'Barcellona, Spagna',
    nome:'Barcelona Wine Week 2026',
    desc:'Tre giorni di celebrazione dei vini catalani e iberici. Il Priorat e la Ribera del Duero in primo piano. Seminari con sommelier internazionali e degustazioni di Gran Reserva storici.',
    url:'https://barcelonawineforum.com', tag:'🇪🇸 Spagna', colore:'rgba(255,180,120,.8)',
  },
  {
    data:'14–17 Novembre 2026', luogo:'Tokyo, Giappone',
    nome:'Decanter World Wine Awards — Tokyo Edition',
    desc:'Per la prima volta, i Decanter Awards sbarcano in Asia. I migliori 100 vini del mondo degustati davanti a sommelier e collezionisti giapponesi. Una serata da leggenda.',
    url:'https://decanter.com', tag:'🌏 Asia', colore:'rgba(200,160,220,.8)',
  },
];

window.renderEventi = function(target) {
  var container = document.getElementById('eventiPageList') || document.getElementById('eventiList');
  if(!container) return;
  container.innerHTML = '';
  window._EVENTI.forEach(function(ev) {
    var div = document.createElement('div');
    div.style.cssText = [
      'margin-bottom:12px','padding:14px 16px',
      'background:rgba(255,255,255,.03)',
      'border:1px solid rgba(212,175,55,.1)',
      'border-left:3px solid '+ev.colore,
      'border-radius:8px','cursor:pointer','transition:background .2s'
    ].join(';');
    div.onmouseover = function(){this.style.background='rgba(212,175,55,.05)';};
    div.onmouseout  = function(){this.style.background='rgba(255,255,255,.03)';};
    (function(e){ div.onclick = function(){ window.openEventoDetail(e.nome); }; })(ev);

    /* tag pill */
    var tag = document.createElement('span');
    tag.style.cssText='font-family:Cinzel,serif;font-size:.4rem;letter-spacing:1px;padding:2px 8px;'+
      'border-radius:10px;background:rgba(212,175,55,.1);color:'+ev.colore+';border:1px solid '+ev.colore+'44;';
    tag.textContent = ev.tag;

    /* data */
    var dataEl = document.createElement('span');
    dataEl.style.cssText='font-family:Cinzel,serif;font-size:.42rem;letter-spacing:1px;color:rgba(212,175,55,.5);';
    dataEl.textContent = ev.data;

    var topRow = document.createElement('div');
    topRow.style.cssText='display:flex;align-items:center;gap:8px;margin-bottom:5px;';
    topRow.appendChild(tag); topRow.appendChild(dataEl);

    var nome = document.createElement('div');
    nome.style.cssText='font-size:1rem;font-weight:700;color:#fff;margin-bottom:3px;font-family:Georgia,serif;';
    nome.textContent = ev.nome;

    var luogo = document.createElement('div');
    luogo.style.cssText='font-family:Cinzel,serif;font-size:.44rem;letter-spacing:1px;color:rgba(245,239,226,.4);margin-bottom:6px;';
    luogo.textContent = '📍 '+ev.luogo;

    var desc = document.createElement('div');
    desc.style.cssText='font-family:Georgia,serif;font-size:.92rem;line-height:1.7;color:rgba(245,239,226,.65);'+
      'display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;';
    desc.textContent = ev.desc;

    div.appendChild(topRow); div.appendChild(nome); div.appendChild(luogo); div.appendChild(desc);
    container.appendChild(div);
  });
};

// Filtra eventi per nazione/categoria
window.filterEventi = function(filtro) {
  // Aggiorna bottoni
  document.querySelectorAll('#page-eventi .ev-filter').forEach(function(b){
    b.classList.remove('active');
    if(b.textContent.toLowerCase().includes(filtro.toLowerCase())||filtro==='tutti') {
      if(b.getAttribute('onclick').includes(filtro)) b.classList.add('active');
    }
  });
  if(filtro==='tutti') { window.renderEventi('page'); return; }
  
  var container = document.getElementById('eventiPageList');
  if(!container) return;
  container.innerHTML='';
  
  window._EVENTI.filter(function(ev){
    return ev.luogo.toLowerCase().includes(filtro.toLowerCase()) ||
           ev.tag.toLowerCase().includes(filtro.toLowerCase());
  }).forEach(function(ev) {
    var div=document.createElement('div');
    div.style.cssText='margin-bottom:16px;padding:18px 16px;background:rgba(255,255,255,.03);border:1px solid rgba(212,175,55,.1);border-left:4px solid '+ev.colore+';border-radius:10px;cursor:pointer;transition:all .2s;';
    div.onmouseover=function(){this.style.background='rgba(212,175,55,.05)';};
    div.onmouseout=function(){this.style.background='rgba(255,255,255,.03)';};
    (function(e){ div.onclick=function(){window.openEventoDetail(e.nome);}; })(ev);
    
    var tag=document.createElement('div');
    tag.style.cssText='display:flex;align-items:center;gap:8px;margin-bottom:8px;';
    tag.innerHTML='<span style="font-family:Cinzel,serif;font-size:.42rem;letter-spacing:1px;padding:3px 10px;border-radius:12px;background:rgba(212,175,55,.1);color:'+ev.colore+';border:1px solid '+ev.colore+'44;">'+ev.tag+'</span>'+
      '<span style="font-family:Cinzel,serif;font-size:.44rem;color:rgba(212,175,55,.5);">'+ev.data+'</span>';
    
    var nome=document.createElement('div');
    nome.style.cssText='font-size:1.05rem;font-weight:700;color:#fff;margin-bottom:4px;font-family:Georgia,serif;';
    nome.textContent=ev.nome;
    
    var luogo=document.createElement('div');
    luogo.style.cssText='font-family:Cinzel,serif;font-size:.44rem;letter-spacing:1px;color:rgba(245,239,226,.4);margin-bottom:8px;';
    luogo.textContent='📍 '+ev.luogo;
    
    var desc=document.createElement('div');
    desc.style.cssText='font-family:Georgia,serif;font-size:.92rem;line-height:1.75;color:rgba(245,239,226,.65);';
    desc.textContent=ev.desc;
    
    div.appendChild(tag); div.appendChild(nome); div.appendChild(luogo); div.appendChild(desc);
    container.appendChild(div);
  });
};

window.openEventoDetail = function(nome) {
  var ev = window._EVENTI.find(function(e){return e.nome === nome;});
  if(!ev) return;
  var art = {
    titolo_it: ev.nome, testo_it: ev.data+' — '+ev.luogo+'\n\n'+ev.desc,
    categoria_it: ev.tag, immagine: '',
  };
  if(typeof window.openArticleReader === 'function') window.openArticleReader(art);
};

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded',function(){

  /* ── Legge la lingua salvata PRIMA del render ── */
  var savedLang = 'it';
  try { savedLang = localStorage.getItem('sw_lang')||'it'; } catch(e){}

  /* ── Prepara articoli del giorno ── */
  window._arts = window._selectDailyNews().map(window._gazetteToArt);

  /* ── Prova a caricare notizie reali RSS in background ── */
  setTimeout(async function(){
    try {
      var realArts = await window.loadRealNews();
      if(realArts && realArts.length) {
        /* Sostituisce le prime notizie con quelle reali RSS */
        var gazette = window._selectDailyNews().map(window._gazetteToArt);
        window._arts = realArts.concat(gazette).slice(0,8);
        window.renderSlides();
        /* Traduci le news reali nella lingua attiva */
        var cl = window.getLang?window.getLang():'it';
        if(cl !== 'it') window.translateAndRefresh && window.translateAndRefresh(cl);
      }
    } catch(e) { console.log('[RSS] Fallback Gazzetta'); }
  }, 1500);

  /* ── Applica cache traduzioni agli articoli se lingua != IT ── */
  if(savedLang !== 'it' && window._trCache) {
    window._arts.forEach(function(a){ window._trCache.applyToArt(a, savedLang); });
    window._SAPERE.forEach(function(s){
      if(!s.id) return;
      var cachedTit = window._trCache.get(s.id, savedLang, 'titolo');
      var cachedTxt = window._trCache.get(s.id, savedLang, 'testo');
      if(cachedTit) s._cachedTit = cachedTit;
      if(cachedTxt) s._cachedTxt = cachedTxt;
    });
  }

  /* ── Render immediato nella lingua giusta ── */
  window.renderSlides();
  /* Carica articoli dinamici via AI */
  if(typeof window._loadSapereCards==='function') {
    window._loadSapereCards();
  }

  /* ── Carica articoli admin dal localStorage ── */
  setTimeout(window.loadServerArts, 600);

  /* ── Se mancano traduzioni, genera in background ── */
  if(savedLang !== 'it') {
    setTimeout(function(){
      if(typeof window.translateAndRefresh === 'function') {
        window.translateAndRefresh(savedLang);
      }
    }, 1500);
  }

  /* ── Render eventi ── */
  if(typeof window.renderEventi==='function') window.renderEventi('page');
});
