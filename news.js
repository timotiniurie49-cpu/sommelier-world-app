/**
 * SOMMELIER WORLD — news.js
 * Slideshow notizie, articoli Sapere del Vino, foto verificate
 */

window.BORDEAUX = '#4a0404';

// ── FOTO VERIFICATE (ID Unsplash confermati come vino/vigne) ──
var VP = {
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

var TP = {
  champagne:['bubbles_a','glass_white','vineyard_a'],
  sommelier:['sommelier_a','glass_red','glass_white'],
  harvest:  ['harvest_a','vineyard_b','vineyard_a'],
  cellar:   ['cellar_a','vineyard_c','bottles'],
  red:      ['glass_red','bottles','vineyard_a'],
  white:    ['glass_white','bottles','vineyard_b'],
  vineyard: ['vineyard_a','vineyard_b','vineyard_c'],
  news:     ['bottles','glass_red','vineyard_c'],
  winery:   ['cellar_a','vineyard_c','bottles'],
  def:      ['vineyard_a','glass_red','cellar_a','vineyard_b','glass_white'],
};

window.getTopicPhoto = function(titolo, categoria, offset){
  var t = ((titolo||'')+' '+(categoria||'')).toLowerCase();
  var seed = Math.floor(Date.now()/86400000) + (offset||0);
  var cat = 'def';
  if(t.match(/champagne|bollicin|spumant|prosecco|cava|franciacorta/)) cat='champagne';
  else if(t.match(/sommelier|degust|abbinament|calice|servizio|temperatura/)) cat='sommelier';
  else if(t.match(/vendemmia|harvest|raccolt|potatur|biodinam/)) cat='harvest';
  else if(t.match(/cantina|barrique|barrel|botti|affinament/)) cat='cellar';
  else if(t.match(/rosso|nebbiolo|sangiovese|barolo|brunello|amarone|malbec|shiraz/)) cat='red';
  else if(t.match(/bianco|riesling|chardonnay|sauvignon|blanc|trebbiano/)) cat='white';
  else if(t.match(/vigna|vineyard|terroir|suolo|collin|etna|mosel|santorini/)) cat='vineyard';
  else if(t.match(/notizia|mercato|prezzi|asta|award|record|consumo/)) cat='news';
  else if(t.match(/produttor|winery|domaine|maison/)) cat='winery';
  var keys = TP[cat]||TP.def;
  return VP[keys[seed%keys.length]] || VP.vineyard_a;
};

// ── NOTIZIE HARDCODED (fallback se server non risponde) ──
var NEWS_FALLBACK = [
  {titolo_it:'Champagne 2025: la vendemmia del secolo', titolo_en:'Champagne 2025: the vintage of the century', titolo_fr:'Champagne 2025: le millésime du siècle',
   testo_it:'La Commissione Champagne ha definito la vendemmia 2025 "straordinaria" per acidità e concentrazione aromatica. Le riserve raggiunte in molte maison hanno permesso dosaggi inediti.',
   testo_en:'The Champagne Commission has defined the 2025 harvest as extraordinary for acidity and aromatic concentration. Record reserves have allowed unprecedented dosages.',
   testo_fr:'La Commission Champagne a qualifié la vendange 2025 d\'extraordinaire pour son acidité et sa concentration aromatique.',
   categoria_it:'🗞 Wine News', immagine: '', isNews:true},
  {titolo_it:'Etna: il vulcano che cambia il vino', titolo_en:'Etna: the volcano that changes wine', titolo_fr:"L'Etna: le volcan qui change le vin",
   testo_it:'Le 133 contrade dell\'Etna producono vini unici al mondo. Il suolo vulcanico ricco di minerali regala al Nerello Mascalese una struttura e una complessità impossibili da replicare altrove.',
   testo_en:"Etna's 133 contrade produce wines unique in the world. The volcanic mineral-rich soil gives Nerello Mascalese a structure impossible to replicate elsewhere.",
   testo_fr:"Les 133 contrade de l'Etna produisent des vins uniques au monde. Le sol volcanique minéral confère au Nerello Mascalese une structure irréplicable.",
   categoria_it:'🌍 Terroir', immagine:'', isNews:true},
  {titolo_it:'Come si alleva la Vite', titolo_en:'How the Vine is Trained', titolo_fr:'Comment on élève la Vigne',
   testo_it:'L\'allevamento della vite — la forma con cui cresce — determina qualità, longevità e carattere del vino. Il Guyot è il sistema più diffuso in Champagne e Borgogna. Il cordone speronato è preferito in Italia per i rossi strutturati. L\'alberello — la forma più antica — produce vini di straordinaria concentrazione in suoli poveri e caldi come Pantelleria e Santorini.',
   testo_en:"The vine training system determines quality, longevity and wine character. Guyot is most common in Champagne and Burgundy. Spur cordon is preferred in Italy for structured reds. Bush vine — the oldest form — produces extraordinary concentration in poor, warm soils.",
   testo_fr:"Le système de conduite de la vigne détermine la qualité, la longévité et le caractère du vin. Le Guyot est le plus répandu en Champagne et en Bourgogne.",
   categoria_it:'🍇 Viticoltura', immagine:'', isNews:false},
  {titolo_it:'Temperatura di Servizio', titolo_en:'Serving Temperature', titolo_fr:'Température de Service',
   testo_it:'Un Barolo a 22°C sembra alcolico e piatto. Lo stesso vino a 16°C è fresco, preciso, con tannini setosi. La temperatura di servizio è l\'elemento più trascurato e più impattante. Bianchi e rosé dal frigo 15 minuti prima; rossi leggeri dal frigo 20 minuti prima; rossi strutturati da cantina fresca.',
   testo_en:"A Barolo at 22°C seems alcoholic and flat. The same wine at 16°C is fresh and precise. Serving temperature is the most neglected yet most impactful element.",
   testo_fr:"Un Barolo à 22°C semble alcooleux et plat. Le même vin à 16°C est frais et précis. La température de service est l'élément le plus négligé.",
   categoria_it:'📚 Sommelier', immagine:'', isNews:false},
  {titolo_it:'Pinot Nero: il Santo Graal', titolo_en:'Pinot Noir: the Holy Grail', titolo_fr:'Pinot Noir: le Saint Graal',
   testo_it:'Il Pinot Nero è il vitigno più difficile al mondo. Richiede microclima perfetto, buccia sottile che lo rende vulnerabile alle malattie. Eppure produce i vini più costosi: Romanée-Conti, Chambertin, Musigny. In Borgogna su calcare kimmeridgiano ha trovato il suo habitat perfetto dopo due secoli di selezione monastica.',
   testo_en:"Pinot Noir is the world's most difficult grape. It requires perfect microclimate and has a thin skin vulnerable to disease. Yet it produces the most expensive wines: Romanée-Conti, Chambertin, Musigny.",
   testo_fr:"Le Pinot Noir est le cépage le plus difficile au monde. Il nécessite un microclimat parfait et sa peau fine le rend vulnérable aux maladies.",
   categoria_it:'🍷 Vitigni', immagine:'', isNews:false},
];

// Aggiunge foto ai fallback
NEWS_FALLBACK.forEach(function(a, i){
  a.immagine = getTopicPhoto(a.titolo_it, a.categoria_it, i);
});

// ── STATO SLIDESHOW ──
var _arts = []; // articoli correnti
var _sIdx = 0;
var _sTimer = null;

// ── SLIDESHOW ──
function renderSlides(){
  var area = document.getElementById('slArea');
  var dotsEl = document.getElementById('slDots');
  var cntEl = document.getElementById('newsCnt');
  if(!area) return;

  var lang = getLang();
  var arts = _arts.slice(0, 7);
  if(!arts.length) arts = NEWS_FALLBACK.slice(0,5);

  if(cntEl) cntEl.textContent = arts.length+' '+(i18n.t('newsArticoli')||'articoli');

  // Crea slides
  area.innerHTML = '';
  arts.forEach(function(a, i){
    var tit = a['titolo_'+lang]||a.titolo||'';
    var txt = a['testo_'+lang]||a.testo||'';
    var cat = a['categoria_'+lang]||a.categoria||'';
    var img = a.immagine||getTopicPhoto(tit, cat, i);

    var sl = document.createElement('div');
    sl.style.cssText = 'position:absolute;inset:0;opacity:'+(i===0?'1':'0')+';transition:opacity .6s;pointer-events:'+(i===0?'auto':'none')+';cursor:pointer;';
    sl.innerHTML =
      '<img src="'+img+'" style="width:100%;height:100%;object-fit:cover;" alt="" loading="'+(i===0?'eager':'lazy')+'" onerror="this.style.display=\'none\'">'+
      '<div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(10,7,5,.05) 30%,rgba(10,7,5,.92) 100%);"></div>'+
      '<div style="position:absolute;bottom:0;left:0;right:0;padding:16px;">'+
        '<div class="al-sl-tag">'+cat+'</div>'+
        '<div class="al-sl-tit">'+tit+'</div>'+
        '<div class="al-sl-txt">'+txt.substring(0,120)+'…</div>'+
      '</div>';
    sl.onclick = (function(art){ return function(){ openReader(art); }; })(a);
    area.appendChild(sl);
  });

  // Dots
  if(dotsEl){
    dotsEl.innerHTML = '';
    arts.forEach(function(_, i){
      var d = document.createElement('div');
      d.className = 'news-dot'+(i===0?' on':'');
      d.onclick = (function(idx){ return function(){ goSlide(idx); }; })(i);
      dotsEl.appendChild(d);
    });
  }

  function goSlide(idx){
    _sIdx = idx;
    var slides = area.children;
    var dots = dotsEl ? dotsEl.children : [];
    for(var j=0;j<slides.length;j++){
      slides[j].style.opacity = j===idx?'1':'0';
      slides[j].style.pointerEvents = j===idx?'auto':'none';
    }
    for(var k=0;k<dots.length;k++){
      dots[k].className = 'news-dot'+(k===idx?' on':'');
    }
  }

  // Auto-avanzamento
  if(_sTimer) clearInterval(_sTimer);
  _sIdx = 0;
  if(arts.length > 1){
    _sTimer = setInterval(function(){
      _sIdx = (_sIdx+1) % arts.length;
      goSlide(_sIdx);
    }, 5500);
  }

  // Swipe touch
  var _tx = 0;
  area.addEventListener('touchstart', function(e){ _tx = e.touches[0].clientX; }, {passive:true});
  area.addEventListener('touchend', function(e){
    var dx = e.changedTouches[0].clientX - _tx;
    if(Math.abs(dx) > 40){
      if(_sTimer){ clearInterval(_sTimer); _sTimer = null; }
      _sIdx = dx<0 ? (_sIdx+1)%arts.length : (_sIdx-1+arts.length)%arts.length;
      goSlide(_sIdx);
      setTimeout(function(){
        if(!_sTimer) _sTimer = setInterval(function(){ _sIdx=(_sIdx+1)%arts.length; goSlide(_sIdx); }, 5500);
      }, 8000);
    }
  }, {passive:true});
}

// ── SAPERE DEL VINO ──
function renderSapere(arts){
  var container = document.getElementById('sapereCards');
  if(!container) return;
  var lang = getLang();
  var items = arts.filter(function(a){ return !a.isNews; }).slice(0,3);
  if(!items.length) items = NEWS_FALLBACK.filter(function(a){ return !a.isNews; }).slice(0,3);
  container.innerHTML = '';
  items.forEach(function(a, i){
    var tit = a['titolo_'+lang]||a.titolo||'';
    var txt = a['testo_'+lang]||a.testo||'';
    var cat = a['categoria_'+lang]||a.categoria||'';
    var ico = ['🍷','🌿','🍇','🏔','🍾'][i%5];

    var card = document.createElement('div');
    card.className = 'al-art';
    card.innerHTML =
      '<div class="al-art-ph">'+ico+'</div>'+
      '<div class="al-art-body">'+
        '<div class="al-art-tag">'+cat+'</div>'+
        '<div class="al-art-tit">'+tit+'</div>'+
        '<div class="al-art-txt">'+txt.substring(0,280)+'…</div>'+
        '<div class="al-art-foot">'+new Date().toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'})+'</div>'+
      '</div>';
    card.onclick = (function(art){ return function(){ openReader(art); }; })(a);
    container.appendChild(card);
  });
}

// ── NEWS PAGE (tab News) ──
window.syncNewsPage = function(){
  var cont = document.getElementById('newsPageList');
  if(!cont) return;
  var lang = getLang();
  var arts = _arts.length ? _arts : NEWS_FALLBACK;
  cont.innerHTML = arts.map(function(a, i){
    var tit = a['titolo_'+lang]||a.titolo||'';
    var txt = a['testo_'+lang]||a.testo||'';
    var cat = a['categoria_'+lang]||a.categoria||'';
    return '<div onclick="openReader(window._arts_all['+i+']||window._fallback['+i+'])" '+
      'style="margin-bottom:14px;padding:14px;background:rgba(255,255,255,.04);border:1px solid rgba(191,155,74,.1);border-radius:10px;cursor:pointer;">'+
      '<div style="font-family:Cinzel,serif;font-size:.5rem;letter-spacing:2px;color:rgba(191,155,74,.5);margin-bottom:6px;">'+cat+'</div>'+
      '<div style="font-family:Playfair Display,serif;font-size:1.05rem;font-weight:700;color:#fff;margin-bottom:8px;">'+tit+'</div>'+
      '<div style="font-size:.9rem;color:rgba(245,239,226,.65);line-height:1.5;">'+txt.substring(0,160)+'…</div>'+
    '</div>';
  }).join('');
  window._arts_all = arts;
  window._fallback  = NEWS_FALLBACK;
};

// ── CARICA DAL SERVER ──
window.loadServerArts = async function(){
  try{
    var todayKey = new Date().toISOString().split('T')[0];
    var ctrl = new AbortController();
    setTimeout(function(){ ctrl.abort(); }, 8000);
    var r = await fetch(SRV+'/api/articles', {signal: ctrl.signal});
    if(!r.ok) return;
    var data = await r.json();
    if(!data || !data.length) return;
    var lang = getLang();
    data.forEach(function(a, i){
      if(!a.immagine) a.immagine = getTopicPhoto(a['titolo_'+lang]||a.titolo||'', a['categoria_'+lang]||a.categoria||'', i);
    });
    _arts = data;
    try{ localStorage.setItem('sw_arts_day', todayKey); }catch(e){}
    renderSlides();
    renderSapere(data);
    console.log('[SW] '+data.length+' articoli dal server ✓');
  }catch(e){
    console.log('[SW] Fallback hardcoded ('+e.message+')');
  }
};

// ── INIT ──
document.addEventListener('DOMContentLoaded', function(){
  // Prima renderizza con hardcoded
  renderSlides();
  renderSapere(NEWS_FALLBACK);
  // Poi carica dal server
  setTimeout(loadServerArts, 500);
});
