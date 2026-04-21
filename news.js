/**
 * SOMMELIER WORLD — news.js v25
 * ─────────────────────────────────────────────────────────────
 * Tutte le funzioni sono window.xxx — nessun closure chiuso.
 * Carousel home full-screen con immagini Unsplash per topic.
 * Integrazione Admin: articoli manuali appaiono in tempo reale.
 * ─────────────────────────────────────────────────────────────
 */

// ═══════════════════════════════════════════════════════════
// LIBRERIA FOTO UNSPLASH — ID verificati, 100% vino/vigne
// ═══════════════════════════════════════════════════════════
var _VP = {
  /* ══ ID UNSPLASH VERIFICATI — 100% vino e viticoltura ══
     Ogni ID è stato verificato manualmente.
     NON aggiungere nuovi ID senza verifica visiva. */

  /* Calici rossi */
  glass_red_a: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=900&q=90&fit=crop',
  glass_red_b: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&q=90&fit=crop',
  /* Calici bianchi */
  glass_wht_a: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=90&fit=crop',
  /* Degustazione */
  tasting_a:   'https://images.unsplash.com/photo-1574014671294-4b64eb4c68b4?w=900&q=90&fit=crop',
  /* Bottiglie */
  bottles_a:   'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=900&q=90&fit=crop',
  /* Vigneti — panoramici */
  vineyard_a:  'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=900&q=90&fit=crop',
  vineyard_b:  'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=900&q=90&fit=crop',
  vineyard_c:  'https://images.unsplash.com/photo-1586370434639-0fe43b2d32e6?w=900&q=90&fit=crop',
  vineyard_d:  'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=900&q=90&fit=crop',
  /* Cantina — botti e pietra */
  cellar_a:    'https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?w=900&q=90&fit=crop',
  cellar_b:    'https://images.unsplash.com/photo-1563220917-916e11d39a86?w=900&q=90&fit=crop',
  /* Vendemmia */
  harvest_a:   'https://images.unsplash.com/photo-1596363470302-8d7c62a64c2d?w=900&q=90&fit=crop',
  harvest_b:   'https://images.unsplash.com/photo-1515779122185-2390ccdf060b?w=900&q=90&fit=crop',
  /* Champagne e bollicine */
  bubbles_a:   'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=900&q=90&fit=crop',
  bubbles_b:   'https://images.unsplash.com/photo-1543268378-a8d0f9e0eff8?w=900&q=90&fit=crop',
  /* Sommelier */
  sommelier_a: 'https://images.unsplash.com/photo-1574014671294-4b64eb4c68b4?w=900&q=90&fit=crop',
};

/* Mappa topic/* Mappa topic → set di chiavi foto */
var _TP = {
  champagne: ['bubbles_a','bubbles_b','glass_wht_a','vineyard_a'],
  sommelier: ['sommelier_a','tasting_a','glass_red_a','glass_wht_a'],
  harvest:   ['harvest_a','harvest_b','vineyard_b','vineyard_c'],
  cellar:    ['cellar_a','cellar_b','vineyard_c','vineyard_d'],
  red:       ['glass_red_a','glass_red_b','vineyard_a','cellar_a'],
  white:     ['glass_wht_a','vineyard_b','bottles_a','harvest_b'],
  vineyard:  ['vineyard_a','vineyard_b','vineyard_c','vineyard_d'],
  news:      ['vineyard_a','glass_red_a','cellar_a','vineyard_c'],
  winery:    ['cellar_a','cellar_b','vineyard_c','vineyard_b'],
  def:       ['vineyard_a','vineyard_b','cellar_a','glass_red_a','bubbles_a','harvest_a'],
};

/* Seleziona la foto giusta in base al topic del titolo/categoria */
window.getTopicPhoto = function(titolo, categoria, offset) {
  var t = ((titolo||'')+' '+(categoria||'')).toLowerCase();
  var seed = Math.floor(Date.now()/86400000) + (offset||0);
  var cat = 'def';
  if(t.match(/champagne|bollicin|spumant|prosecco|cava|franciacorta|metodo\s*classico/)) cat='champagne';
  else if(t.match(/sommelier|degust|abbinament|calice|servizio|temperatura|tavola/)) cat='sommelier';
  else if(t.match(/vendemmia|harvest|raccolt|potatur|biodinam|viticolt|vigneron/)) cat='harvest';
  else if(t.match(/cantina|barrique|barrel|botti|affinament|invecchiam|quercia/)) cat='cellar';
  else if(t.match(/rosso|nebbiolo|sangiovese|barolo|brunello|amarone|malbec|shiraz|grenach|pinot\s*noir|syrah/)) cat='red';
  else if(t.match(/bianco|riesling|chardonnay|sauvignon|blanc|trebbiano|vermentino|assyrtiko|grüner/)) cat='white';
  else if(t.match(/vigna|vineyard|terroir|suolo|collin|etna|mosel|santorini|priorat|borgogna|vigneto/)) cat='vineyard';
  else if(t.match(/notizia|mercato|prezzi|asta|award|record|consumo|trend|export|produzione/)) cat='news';
  else if(t.match(/produttor|winery|domaine|cantina|maison|azienda|château/)) cat='winery';
  var keys = _TP[cat]||_TP.def;
  return _VP[keys[seed%keys.length]]||_VP.vineyard_a;
};

// ═══════════════════════════════════════════════════════════
// CSS CAROUSEL — iniettato una sola volta
// ═══════════════════════════════════════════════════════════
(function injectCSS(){
  if(document.getElementById('sw-news-css')) return;
  var s=document.createElement('style');
  s.id='sw-news-css';
  s.textContent=[
    /* Slide full-screen */
    '#slArea{position:relative;width:100%;height:320px;overflow:hidden;background:#0d0202;}',
    '#slArea .sw-slide{position:absolute;inset:0;opacity:0;transition:opacity .7s ease;pointer-events:none;}',
    '#slArea .sw-slide.on{opacity:1;pointer-events:auto;}',
    '#slArea .sw-slide img.sw-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;display:block;}',
    '#slArea .sw-slide .sw-grad{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(10,10,10,.05) 0%,rgba(10,10,10,.3) 45%,rgba(10,10,10,.92) 82%,rgba(10,10,10,.98) 100%);}',
    '#slArea .sw-slide .sw-body{position:absolute;bottom:0;left:0;right:0;padding:16px 16px 20px;cursor:pointer;}',
    '.sw-slide-cat{font-family:Cinzel,serif;font-size:.44rem;letter-spacing:3px;color:rgba(212,175,55,.9);font-weight:700;text-transform:uppercase;margin-bottom:6px;}',
    '.sw-slide-tit{font-family:"Playfair Display",Georgia,serif;font-size:1.12rem;font-weight:700;color:#FFFFFF;line-height:1.26;text-shadow:0 2px 8px rgba(0,0,0,.8);margin-bottom:6px;}',
    '.sw-slide-txt{font-family:"Cormorant Garamond",Georgia,serif;font-size:.9rem;line-height:1.6;color:rgba(245,239,226,.68);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}',
    /* Dots */
    '#slDots{display:flex;justify-content:center;gap:6px;padding:8px 0 4px;background:#0A0A0A;}',
    '.sw-dot{width:5px;height:5px;border-radius:50%;background:rgba(212,175,55,.18);border:none;padding:0;cursor:pointer;transition:background .25s;}',
    '.sw-dot.on{background:rgba(212,175,55,.78);}',
    /* Cards Sapere del Vino */
    '.sw-art{background:rgba(12,6,4,.98);border:1px solid rgba(212,175,55,.1);border-radius:10px;margin:0 14px 14px;cursor:pointer;overflow:hidden;transition:transform .2s,box-shadow .2s;}',
    '.sw-art:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.55);}',
    '.sw-art-ph{width:100%;height:130px;display:flex;align-items:center;justify-content:center;font-size:2.8rem;background:rgba(255,255,255,.02);}',
    '.sw-art-body{padding:14px 16px 18px;}',
    '.sw-art-tag{font-size:8px;font-weight:700;letter-spacing:2px;color:rgba(212,175,55,.7);text-transform:uppercase;margin-bottom:6px;}',
    '.sw-art-tit{font-family:"Playfair Display",Georgia,serif;font-size:1.08rem;font-weight:700;color:#FFFFFF;line-height:1.3;margin-bottom:8px;}',
    '.sw-art-txt{font-family:"Cormorant Garamond",Georgia,serif;font-size:.98rem;line-height:1.88;color:rgba(245,239,226,.78);}',
    '.sw-art-foot{font-size:9px;color:rgba(245,239,226,.3);margin-top:10px;padding-top:8px;border-top:1px solid rgba(212,175,55,.1);}',
  ].join('');
  document.head.appendChild(s);
})();

// ═══════════════════════════════════════════════════════════
// NOTIZIE HARDCODED — fallback se server non risponde
// ═══════════════════════════════════════════════════════════
window.NEWS_FALLBACK = [
  /* ══ BARTOLO MASCARELLO — primo in carousel ══ */
  {
    isNews: true,
    titolo_it: 'Bartolo Mascarello: il Barolo con la coscienza',
    titolo_en: 'Bartolo Mascarello: The Barolo with a Conscience',
    titolo_fr: 'Bartolo Mascarello et le Barolo authentique',
    testo_it: 'Bartolo Mascarello è stato il più grande custode del Barolo tradizionale. Nella sua cantina di Castiglione Falletto, nessuna filtrazione, nessuna barrique francese, nessun compromesso: solo Nebbiolo che affina nelle grandi botti di rovere di Slavonia per tre o quattro anni. Le sue etichette dipinte a mano — con messaggi pacifisti — sono diventate opere d\'arte. Il suo Barolo Cannubi-San Lorenzo è uno dei grandi vini d\'Italia: profondo, austero, longevo oltre i trent\'anni.',
    testo_en: 'Bartolo Mascarello was the greatest custodian of traditional Barolo. In his Castiglione Falletto cellar: no filtration, no French barriques, no compromise. Only Nebbiolo aging in large Slavonian oak for three to four years. His hand-painted labels with pacifist messages became works of art. His Barolo Cannubi-San Lorenzo ages beyond thirty years.',
    testo_fr: 'Bartolo Mascarello fut le plus grand gardien du Barolo traditionnel. Dans sa cave de Castiglione Falletto: aucune filtration, aucune barrique française, aucun compromis. Nebbiolo vieilli en grandes barriques de chêne de Slavonie. Ses étiquettes peintes à la main avec des messages pacifistes sont devenues des oeuvres d\'art. Son Barolo vieillit au-delà de trente ans.',
    categoria_it: '🍷 Il Sapere del Vino',
    categoria_en: '🍷 Wine Knowledge',
    categoria_fr: '🍷 Savoir du Vin',
    immagine: '1776659883914.jpeg',
  },
  {
    isNews:true,
    titolo_it:'Il segreto della Mosella: i Riesling più longevi del mondo',
    titolo_en:"The Mosel Secret: The World's Most Age-Worthy Rieslings",
    titolo_fr:'Le secret de la Moselle : les Rieslings les plus longévifs',
    testo_it:'Ardesia blu devoniana e vigneti eroici inclinati fino al 70%: così nasce il vino bianco più longevo al mondo. L\'escursione termica estrema mantiene l\'acidità brillante per 60 anni. Egon Müller, JJ Prüm, Clemens Busch: tre nomi mitici su tre vigneti mitici.',
    testo_en:"Blue Devonian slate and heroic slopes up to 70% create the world's most age-worthy white wine. Extreme thermal variation keeps acidity brilliant for 60 years.",
    testo_fr:"L'ardoise bleue dévonienne et les pentes héroïques jusqu'à 70% créent le vin blanc le plus longévif au monde.",
    categoria_it:'🌍 Terroir', categoria_en:'🌍 Terroir', categoria_fr:'🌍 Terroir',
    immagine:'',
  },
  {
    isNews:true,
    titolo_it:'Champagne 2025: la vendemmia del secolo secondo la Commission',
    titolo_en:'Champagne 2025: The Vintage of the Century Says the Commission',
    titolo_fr:'Champagne 2025 : le millésime du siècle selon la Commission',
    testo_it:'La Commission del Champagne ha dichiarato il 2025 "straordinario" per equilibrio tra acidità brillante e concentrazione aromatica. Le riserve record di molte maison hanno permesso dosaggi inediti, aprendo una nuova era per il Blanc de Blancs.',
    testo_en:'The Champagne Commission declared 2025 extraordinary for its balance of acidity and aromatic concentration. Record reserves allowed unprecedented dosages.',
    testo_fr:"La Commission du Champagne a déclaré 2025 extraordinaire pour son équilibre entre acidité et concentration aromatique.",
    categoria_it:'🗞 Wine News', categoria_en:'🗞 Wine News', categoria_fr:'🗞 Wine News',
    immagine:'',
  },
  {
    isNews:false,
    titolo_it:'Vini vulcanici: dall\'Etna alle Canarie, il sapore della lava',
    titolo_en:'Volcanic Wines: From Etna to the Canaries, the Taste of Lava',
    titolo_fr:"Vins volcaniques : de l'Etna aux Canaries, le goût de la lave",
    testo_it:'Dall\'Etna alle Canarie via Santorini: i vini nati dalla lava hanno una mineralità salina inconfondibile. La lava costringe le radici a scendere fino a 10 metri, garantendo concentrazione e identità irripetibili. Cornelissen, Terre Nere, Gaia Wines, Los Bermejos.',
    testo_en:'From Etna to the Canaries via Santorini: volcanic wines have unmistakable saline mineral character. Lava forces roots 10 meters deep.',
    testo_fr:"De l'Etna aux Canaries en passant par Santorin : les vins volcaniques ont une minéralité saline inimitable.",
    categoria_it:'🌋 Terroir Vulcanico', categoria_en:'🌋 Volcanic Terroir', categoria_fr:'🌋 Terroir Volcanique',
    immagine:'',
  },
  {
    isNews:false,
    titolo_it:'La temperatura giusta: il dettaglio che cambia tutto nel calice',
    titolo_en:'The Right Temperature: The Detail That Changes Everything in the Glass',
    titolo_fr:'La bonne température : le détail qui change tout dans le verre',
    testo_it:'Un Barolo a 22°C sembra alcolico e piatto. Lo stesso vino a 16°C è fresco, preciso, con tannini setosi. Bianchi strutturati: 10-12°C. Rossi eleganti: 15-17°C. Champagne: 8-10°C. Nessun dettaglio impatta l\'esperienza del vino quanto questo.',
    testo_en:"A Barolo at 22°C seems alcoholic and flat. The same wine at 16°C is fresh and precise. No detail impacts the wine experience more than this.",
    testo_fr:"Un Barolo à 22°C semble alcooleux et plat. Le même vin à 16°C est frais et précis.",
    categoria_it:'🍷 Il Sapere del Vino', categoria_en:'🍷 Wine Knowledge', categoria_fr:'🍷 Savoir du Vin',
    immagine:'',
  },
  {
    isNews:true,
    titolo_it:'Pinot Nero: il Santo Graal della viticoltura mondiale',
    titolo_en:'Pinot Noir: The Holy Grail of World Viticulture',
    titolo_fr:'Pinot Noir : le Saint Graal de la viticulture mondiale',
    testo_it:'Il vitigno più difficile al mondo: buccia sottile, microclima perfetto, selezione monastica centenaria in Borgogna. Eppure produce i vini più poetici: Romanée-Conti, Chambertin, Musigny. Sul calcare kimmeridgiano ha trovato il suo habitat definitivo.',
    testo_en:"The world's most difficult grape: thin skin, perfect microclimate, centuries of monastic selection in Burgundy. Yet it produces the most poetic wines: Romanée-Conti, Chambertin, Musigny.",
    testo_fr:"Le cépage le plus difficile au monde : peau fine, microclimat parfait, sélection monastique centenaire en Bourgogne.",
    categoria_it:'🍇 Vitigni', categoria_en:'🍇 Grape Varieties', categoria_fr:'🍇 Cépages',
    immagine:'',
  },
];

// Aggiunge immagini ai fallback
window.NEWS_FALLBACK.forEach(function(a, i) {
  if(!a.immagine) a.immagine = window.getTopicPhoto(a.titolo_it, a.categoria_it, i);
});

// ═══════════════════════════════════════════════════════════
// STATO CAROUSEL
// ═══════════════════════════════════════════════════════════
window._arts   = [];   // articoli correnti (dal server o fallback)
window._sIdx   = 0;    // slide corrente
window._sTimer = null; // timer auto-avanzamento

// ═══════════════════════════════════════════════════════════
// RENDER CAROUSEL FULL-SCREEN — GLOBALE
// ═══════════════════════════════════════════════════════════
window.renderSlides = function() {
  var area   = document.getElementById('slArea');
  var dotsEl = document.getElementById('slDots');
  var cntEl  = document.getElementById('newsCnt');
  if(!area) return;

  var lang = window.getLang?window.getLang():'it';
  var arts = window._arts.slice(0,7);
  if(!arts.length) arts = window.NEWS_FALLBACK.slice(0,5);

  if(cntEl) cntEl.textContent = arts.length+' '+(window.i18n?window.i18n.t('newsArticoli'):'articoli');

  // Ferma timer
  if(window._sTimer){ clearInterval(window._sTimer); window._sTimer=null; }

  // Genera slides
  area.innerHTML='';
  arts.forEach(function(a, i){
    var tit = a['titolo_'+lang]||a.titolo||'';
    var txt = a['testo_'+lang] ||a.testo ||'';
    var cat = a['categoria_'+lang]||a.categoria||'';
    var img = a.immagine||window.getTopicPhoto(tit,cat,i);

    var sl = document.createElement('div');
    sl.className = 'sw-slide'+(i===0?' on':'');

    // Immagine di sfondo
    var imgEl = document.createElement('img');
    imgEl.className='sw-bg'; imgEl.alt=''; imgEl.loading=i===0?'eager':'lazy'; imgEl.src=img;
    imgEl.onerror=function(){ this.style.display='none'; };

    // Gradiente overlay
    var grad=document.createElement('div'); grad.className='sw-grad';

    // Testo
    var body=document.createElement('div'); body.className='sw-body';
    body.innerHTML=
      '<div class="sw-slide-cat">'+cat+'</div>'+
      '<div class="sw-slide-tit">'+tit+'</div>'+
      '<div class="sw-slide-txt">'+txt.substring(0,130)+'…</div>';

    sl.appendChild(imgEl); sl.appendChild(grad); sl.appendChild(body);

    // Click → apre reader
    (function(art){ sl.addEventListener('click',function(){ window.openArticleReader(art); }); })(a);
    area.appendChild(sl);
  });

  // Dots
  if(dotsEl){
    dotsEl.innerHTML='';
    arts.forEach(function(_,i){
      var d=document.createElement('button');
      d.className='sw-dot'+(i===0?' on':'');
      d.setAttribute('aria-label','Slide '+(i+1));
      (function(idx){ d.addEventListener('click',function(){ window.goSlide(idx); }); })(i);
      dotsEl.appendChild(d);
    });
  }

  // Auto-avanzamento ogni 5 secondi
  window._sIdx=0;
  if(arts.length>1){
    window._sTimer=setInterval(function(){
      window._sIdx=(window._sIdx+1)%arts.length;
      window.goSlide(window._sIdx);
    },5000);
  }

  // Swipe touch
  var _tx=0;
  area.addEventListener('touchstart',function(e){ _tx=e.touches[0].clientX; },{passive:true});
  area.addEventListener('touchend',function(e){
    var dx=e.changedTouches[0].clientX-_tx;
    if(Math.abs(dx)>40){
      if(window._sTimer){ clearInterval(window._sTimer); window._sTimer=null; }
      window._sIdx=dx<0?(window._sIdx+1)%arts.length:(window._sIdx-1+arts.length)%arts.length;
      window.goSlide(window._sIdx);
      // Riprende auto-advance dopo 8s
      setTimeout(function(){
        if(!window._sTimer)
          window._sTimer=setInterval(function(){ window._sIdx=(window._sIdx+1)%arts.length; window.goSlide(window._sIdx); },5000);
      },8000);
    }
  },{passive:true});
};

/* Cambia slide — GLOBALE */
window.goSlide = function(idx) {
  window._sIdx=idx;
  var slides=document.querySelectorAll('#slArea .sw-slide');
  var dots  =document.querySelectorAll('#slDots .sw-dot');
  slides.forEach(function(s,j){ s.classList.toggle('on',j===idx); });
  dots.forEach(function(d,k){   d.classList.toggle('on',k===idx); });
};

// ═══════════════════════════════════════════════════════════
// SEZIONE "IL SAPERE DEL VINO" — card didattiche
// ═══════════════════════════════════════════════════════════
window.renderSapere = function(arts) {
  var container=document.getElementById('sapereCards');
  if(!container) return;
  var lang=window.getLang?window.getLang():'it';
  var items=arts.filter(function(a){return !a.isNews;}).slice(0,3);
  if(!items.length) items=window.NEWS_FALLBACK.filter(function(a){return !a.isNews;}).slice(0,3);
  container.innerHTML='';
  items.forEach(function(a,i){
    var tit=a['titolo_'+lang]||a.titolo||'';
    var txt=a['testo_'+lang] ||a.testo ||'';
    var cat=a['categoria_'+lang]||a.categoria||'';
    var ico=['🍷','🌿','🍇','🏔','🍾'][i%5];
    var today=new Date().toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'});

    var card=document.createElement('div');
    card.className='sw-art';
    card.innerHTML=
      '<div class="sw-art-ph">'+ico+'</div>'+
      '<div class="sw-art-body">'+
        '<div class="sw-art-tag">'+cat+'</div>'+
        '<div class="sw-art-tit">'+tit+'</div>'+
        '<div class="sw-art-txt">'+txt.substring(0,240)+'…</div>'+
        '<div class="sw-art-foot">'+today+'</div>'+
      '</div>';
    (function(art){ card.addEventListener('click',function(){ window.openArticleReader(art); }); })(a);
    container.appendChild(card);
  });
};

// ═══════════════════════════════════════════════════════════
// CARICA ARTICOLI DAL SERVER — GLOBALE
// Integra anche gli articoli manuali aggiunti dall'Admin
// ═══════════════════════════════════════════════════════════
window.loadServerArts = async function() {
  try {
    var ctrl=new AbortController();
    setTimeout(function(){ctrl.abort();},9000);
    var srv=window.SRV||window.SERVER_URL||'https://sommelier-server-production-8f92.up.railway.app';
    var r=await fetch(srv+'/api/articles',{signal:ctrl.signal});
    if(!r.ok) throw new Error('HTTP '+r.status);
    var data=await r.json();
    if(!data||!data.length) throw new Error('Nessun articolo');

    var lang=window.getLang?window.getLang():'it';
    data.forEach(function(a,i){
      // Sovrascrive sempre con foto verificate (evita foto non pertinenti dal server)
      a.immagine=window.getTopicPhoto(
        a['titolo_'+lang]||a.titolo||'',
        a['categoria_'+lang]||a.categoria||'',
        i
      );
    });

    window._arts=data;
    window.renderSlides();
    window.renderSapere(data);
    console.log('[News] '+data.length+' articoli caricati dal server ✓');
  } catch(e) {
    console.log('[News] Fallback hardcoded ('+e.message+')');
    // Se non ci sono articoli server, usa fallback
    if(!window._arts.length){
      window._arts=[];
      window.renderSlides();
      window.renderSapere(window.NEWS_FALLBACK);
    }
  }
};

// ═══════════════════════════════════════════════════════════
// SINCRONIZZA DOPO SALVATAGGIO ADMIN — GLOBALE
// Chiamata da adminSaveArt() in navigation.js dopo il salvataggio
// ═══════════════════════════════════════════════════════════
window.syncAfterAdminSave = function() {
  setTimeout(function(){
    window.loadServerArts();
  }, 1200);
};

/* Il collegamento Admin → Carousel è gestito direttamente in navigation.js:
   adminSaveArt chiama window.syncAfterAdminSave() che è definita qui sopra.
   Non serve polling — la comunicazione è esplicita e stabile. */

// ═══════════════════════════════════════════════════════════
// INIT — render immediato con fallback, poi carica dal server
// ═══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function() {
  // Render immediato con notizie hardcoded
  window.renderSlides();
  window.renderSapere(window.NEWS_FALLBACK);
  // Poi carica dal server
  setTimeout(window.loadServerArts, 600);
});
