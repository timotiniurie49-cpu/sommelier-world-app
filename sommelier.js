/**
 * SOMMELIER WORLD — sommelier.js v25
 * ─────────────────────────────────────────────────────────────
 * Tutte le funzioni sono window.xxx — nessun closure chiuso.
 * Tono narrativo e poetico. Zero terminologia accademica.
 * ─────────────────────────────────────────────────────────────
 */

var _SRV = 'https://sommelier-server-production-8f92.up.railway.app';

// ═══════════════════════════════════════════════════════════
// REGIONI DEL MONDO — popola la select "Paese"
// ═══════════════════════════════════════════════════════════
window.REGIONI = {
  'Italia':        ['Piemonte','Toscana','Veneto','Sicilia','Campania',
                    'Friuli-Venezia Giulia','Alto Adige','Sardegna','Umbria',
                    'Marche','Lombardia','Abruzzo','Puglia','Trentino','Lazio'],
  'Francia':       ['Borgogna','Bordeaux','Rodano','Alsazia','Champagne',
                    'Loira','Languedoc-Roussillon','Provenza','Beaujolais','Jura'],
  'Spagna':        ['Rioja','Ribera del Duero','Priorat','Rías Baixas',
                    'Jerez','Toro','Penedès','Bierzo'],
  'USA':           ['Napa Valley','Sonoma','Willamette Valley',
                    'Paso Robles','Santa Barbara','Finger Lakes'],
  'Germania':      ['Mosel','Rheingau','Pfalz','Baden','Rheinhessen','Nahe','Franken'],
  'Portogallo':    ['Douro','Alentejo','Vinho Verde','Dão','Bairrada','Lisboa'],
  'Argentina':     ['Mendoza','Salta','Patagonia','Uco Valley','San Juan'],
  'Cile':          ['Maipo','Colchagua','Casablanca','Elqui','Bío-Bío'],
  'Australia':     ['Barossa Valley','McLaren Vale','Clare Valley',
                    'Yarra Valley','Margaret River','Hunter Valley'],
  'Nuova Zelanda': ['Marlborough','Central Otago',"Hawke's Bay"],
  'Grecia':        ['Santorini','Naoussa','Nemea','Creta'],
  'Austria':       ['Wachau','Kamptal','Kremstal','Burgenland','Steiermark'],
  'Ungheria':      ['Tokaj','Eger','Villány'],
  'Georgia':       ['Kakheti','Kartli','Imereti'],
  'Sud Africa':    ['Stellenbosch','Swartland','Franschhoek','Walker Bay'],
};

// Esempi per il vincolo geografico nel prompt
var _ESEMPI_PAESE = {
  'Italia':       'Barolo (Gaja, Giacomo Conterno), Brunello di Montalcino (Biondi-Santi), Sassicaia, Amarone (Dal Forno)',
  'Francia':      'Romanée-Conti, Pétrus, Dom Pérignon, Hermitage (Chapoutier), Sauternes (Château d\'Yquem)',
  'Spagna':       'Rioja Gran Reserva (Muga, CVNE), Ribera del Duero (Vega Sicilia), Albariño Rías Baixas',
  'USA':          'Napa Cabernet (Opus One, Screaming Eagle, Stag\'s Leap), Willamette Pinot Noir',
  'Germania':     'Riesling Mosel (Egon Müller, JJ Prüm, Clemens Busch), Baden Spätburgunder',
  'Portogallo':   'Porto Vintage (Niepoort, Graham\'s), Douro Touriga Nacional, Vinho Verde Alvarinho',
  'Argentina':    'Mendoza Malbec (Catena Zapata, Achaval Ferrer), Salta Torrontés',
  'Cile':         'Almaviva, Don Melchor, Casas del Bosque, Concha y Toro Terrunyo',
  'Australia':    'Penfolds Grange, Henschke Hill of Grace, Torbreck RunRig, Grosset Polish Hill Riesling',
  'Nuova Zelanda':'Cloudy Bay Sauvignon Blanc, Felton Road Pinot Noir, Dog Point',
  'Grecia':       'Assyrtiko Santorini (Gaia, Hatzidakis, Sigalas), Xinomavro Naoussa (Kyr-Yianni)',
  'Austria':      'Wachau Grüner Veltliner (Hirtzberger, Knoll, Prager), Blaufränkisch (Pittnauer)',
  'Ungheria':     'Tokaji Aszú (Royal Tokaji, Oremus, Disznókő)',
  'Georgia':      "Kakheti Rkatsiteli in kvevri (Pheasant's Tears, Alaverdi Monastery)",
  'Sud Africa':   'Kanonkop Pinotage, Meerlust Rubicon, Sadie Family Wines',
};

// ═══════════════════════════════════════════════════════════
// QUICK MENUS — GLOBALE
// ═══════════════════════════════════════════════════════════
window.quickMenu = function(type) {
  var menus = {
    pesce:
      'Antipasto — Carpaccio di gamberi rossi con lime e zenzero\n' +
      'Primo — Linguine alle vongole veraci\n' +
      'Secondo — Branzino al forno con erbe aromatiche\n' +
      'Contorno — Patate al vapore con prezzemolo fresco',
    carne:
      'Antipasto — Tagliere di salumi misti con lardo di Colonnata\n' +
      'Primo — Tagliatelle al ragù di cinghiale\n' +
      'Secondo — Costata di Fassona Piemontese al sangue\n' +
      'Contorno — Funghi porcini trifolati con aglio e nepitella',
    vegetariano:
      'Antipasto — Burrata con pomodorini datterini e basilico\n' +
      'Primo — Risotto ai funghi porcini con tartufo nero\n' +
      'Secondo — Melanzane alla parmigiana con fior di latte\n' +
      'Formaggi — Parmigiano Reggiano 36 mesi con mostarda di Cremona',
    degustazione:
      'Amuse-bouche — Tartare di tonno rosso con caviale di aringa\n' +
      'Primo — Tortelli di ricotta e spinaci al burro e salvia\n' +
      'Intermezzo — Granita al limone di Amalfi\n' +
      'Secondo — Piccione arrosto su salsa al Pinot Nero\n' +
      'Pre-dessert — Crème brûlée alla vaniglia del Madagascar\n' +
      'Dolce — Tiramisù al caffè espresso ristretto',
    formaggi:
      'Fresco — Burrata pugliese con olio extravergine\n' +
      'Semi-stagionato — Pecorino di Pienza DOP\n' +
      'Stagionato — Parmigiano Reggiano 36 mesi\n' +
      'Erborinato — Gorgonzola Piccante DOP\n' +
      "Capra — Chèvre frais della Loira con miele di acacia",
  };
  var ta = document.getElementById('menuText');
  if (ta && menus[type]) { ta.value = menus[type]; ta.focus(); }
};

// ═══════════════════════════════════════════════════════════
// SLIDER PROFILO — GLOBALE
// ═══════════════════════════════════════════════════════════
window.updateSlider = function(id, labels, val) {
  var lbl = document.getElementById(id + 'Val');
  if (lbl) lbl.textContent = labels[parseInt(val) - 1] || labels[2];
  var slider = document.getElementById(id);
  if (slider) {
    var pct = ((parseInt(val) - 1) / 4 * 100).toFixed(0);
    slider.style.setProperty('--pct', pct + '%');
  }
};

window.getWineParams = function() {
  function getL(id, arr) {
    var e = document.getElementById(id);
    return e ? arr[parseInt(e.value) - 1] : arr[2];
  }
  return {
    acidita:    getL('acidita',    ['Bassa','Medio-bassa','Media','Medio-alta','Alta']),
    morbidezza: getL('morbidezza', ['Secco e asciutto','Poco morbido','Equilibrato','Morbido','Avvolgente']),
    struttura:  getL('struttura',  ['Leggero e delicato','Medio-leggero','Equilibrato','Pieno','Potente e concentrato']),
    paese:   (document.getElementById('winePaese')   || {}).value || '',
    regione: (document.getElementById('wineRegione') || {}).value || '',
  };
};

// ═══════════════════════════════════════════════════════════
// POPOLA SELECT PAESE/REGIONE — GLOBALE
// ═══════════════════════════════════════════════════════════
window.updateRegioni = function() {
  var paese = (document.getElementById('winePaese') || {}).value || '';
  var sel   = document.getElementById('wineRegione');
  if (!sel) return;
  sel.innerHTML = '<option value="">Qualsiasi regione</option>';
  (window.REGIONI[paese] || []).forEach(function(r) {
    var o = document.createElement('option'); o.value = r; o.textContent = r; sel.appendChild(o);
  });
  sel.disabled = !paese;
};

document.addEventListener('DOMContentLoaded', function() {
  var sel = document.getElementById('winePaese');
  if (!sel) return;
  Object.keys(window.REGIONI).forEach(function(p) {
    var o = document.createElement('option'); o.value = p; o.textContent = p; sel.appendChild(o);
  });
  sel.onchange = window.updateRegioni;
  // Slider iniziali a centro
  ['acidita','morbidezza','struttura'].forEach(function(id) {
    var s = document.getElementById(id);
    if (s) s.style.setProperty('--pct','50%');
  });
  var regEl = document.getElementById('wineRegione');
  if (regEl) regEl.disabled = true;
});

// ═══════════════════════════════════════════════════════════
// TASTE ENGINE — memoria locale preferenze
// ═══════════════════════════════════════════════════════════
window.TasteEngine = (function() {
  var KEY = 'sw_taste_v3';
  var DEF = { sessions:0, paese:{}, budget:[], feedback:{pos:0,neg:0}, ultimiVini:[] };

  function load() {
    try { var r=localStorage.getItem(KEY); return r?Object.assign({},DEF,JSON.parse(r)):Object.assign({},DEF); }
    catch(e){ return Object.assign({},DEF); }
  }
  function save(p){ try{localStorage.setItem(KEY,JSON.stringify(p));}catch(e){} }
  function inc(obj,k){ if(k) obj[k]=(obj[k]||0)+1; }

  return {
    recordSession: function(opts){
      var p=load(); p.sessions++;
      if(opts.paese) inc(p.paese,opts.paese);
      if(opts.budget){ p.budget.push(Number(opts.budget)); if(p.budget.length>6) p.budget.shift(); }
      save(p);
    },
    recordWine: function(name){
      if(!name) return; var p=load();
      p.ultimiVini.unshift(name.substring(0,60));
      if(p.ultimiVini.length>6) p.ultimiVini.pop();
      save(p);
    },
    recordFeedback: function(positive){
      var p=load();
      if(positive) p.feedback.pos=(p.feedback.pos||0)+1;
      else         p.feedback.neg=(p.feedback.neg||0)+1;
      save(p);
    },
    buildPromptContext: function(){
      var p=load(); if(p.sessions<1) return '';
      var lines=['═══ MEMORIA GUSTO ═══'];
      lines.push('Sessioni: '+p.sessions);
      var topP=Object.entries(p.paese||{}).sort(function(a,b){return b[1]-a[1];})[0];
      if(topP) lines.push('Paese preferito: '+topP[0]);
      if(p.budget&&p.budget.length){
        var avg=Math.round(p.budget.reduce(function(a,b){return a+b;},0)/p.budget.length);
        lines.push('Budget medio: €'+avg);
      }
      if(p.ultimiVini&&p.ultimiVini.length)
        lines.push('Vini già consigliati (evita di ripetere): '+p.ultimiVini.join(', '));
      lines.push('════════════════════');
      lines.push('Tratta questo ospite come un vecchio amico — conosci già le sue preferenze.');
      return '\n\n'+lines.join('\n');
    },
    renderBadge: function(){
      var p=load(); if(p.sessions<1) return;
      var badge=document.getElementById('sw-taste-badge');
      if(!badge){
        badge=document.createElement('div'); badge.id='sw-taste-badge';
        badge.style.cssText='position:fixed;top:8px;right:62px;z-index:99998;'+
          'background:rgba(212,175,55,.14);border:1px solid rgba(212,175,55,.28);'+
          'border-radius:20px;padding:3px 10px;font-family:Cinzel,serif;font-size:9px;'+
          'color:#D4AF37;letter-spacing:1px;cursor:pointer;';
        badge.title='Il tuo profilo gusto personale';
        badge.onclick=function(){ window.TasteEngine.showProfile(); };
        document.body.appendChild(badge);
      }
      badge.textContent='🍷 '+p.sessions+(p.sessions===1?' sessione':' sessioni');
    },
    showProfile: function(){
      var p=load();
      var topP=Object.entries(p.paese||{}).sort(function(a,b){return b[1]-a[1];}).slice(0,3);
      var avgB=p.budget.length?'€'+Math.round(p.budget.reduce(function(a,b){return a+b;},0)/p.budget.length):'—';
      var overlay=document.createElement('div');
      overlay.style.cssText='position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;';
      overlay.onclick=function(){overlay.remove();};
      overlay.innerHTML=
        '<div style="background:#0A0A0A;border:1px solid rgba(212,175,55,.3);border-radius:14px;'+
        'padding:24px;max-width:320px;width:90%;pointer-events:auto;" onclick="event.stopPropagation()">'+
          '<div style="font-family:Cinzel,serif;font-size:.7rem;letter-spacing:3px;color:#D4AF37;margin-bottom:16px;">🍷 IL TUO PROFILO GUSTO</div>'+
          '<div style="font-family:\'Cormorant Garamond\',serif;font-size:1rem;line-height:2.1;color:rgba(245,239,226,.8);">'+
            '<div>📊 Sessioni: <strong style="color:#F5EFE2">'+p.sessions+'</strong></div>'+
            '<div>💶 Budget medio: <strong style="color:#F5EFE2">'+avgB+'</strong></div>'+
            (topP.length?'<div>🌍 Paesi: <strong style="color:#F5EFE2">'+topP.map(function(x){return x[0];}).join(', ')+'</strong></div>':'')+
            '<div>👍 Positivi: <strong style="color:#7dda8a">'+(p.feedback.pos||0)+'</strong></div>'+
            '<div>👎 Da migliorare: <strong style="color:#f88">'+(p.feedback.neg||0)+'</strong></div>'+
            (p.ultimiVini.length?'<div style="margin-top:10px;font-size:.88rem;color:rgba(245,239,226,.35);">Ultimi vini: '+p.ultimiVini.join(', ')+'</div>':'')+
          '</div>'+
          '<button onclick="this.closest(\'div[style*=fixed]\').remove()" '+
            'style="margin-top:16px;width:100%;padding:10px;background:rgba(212,175,55,.12);'+
            'border:1.5px solid rgba(212,175,55,.28);border-radius:6px;color:#D4AF37;'+
            'font-family:Cinzel,serif;font-size:.52rem;letter-spacing:2px;">CHIUDI</button>'+
        '</div>';
      document.body.appendChild(overlay);
    },
  };
})();

// ═══════════════════════════════════════════════════════════
// callAPI — proxy Railway  — GLOBALE
// ═══════════════════════════════════════════════════════════
window.callAPI = async function(system, userMsg, lang) {
  var srv = window.SRV || window.SERVER_URL || _SRV;
  var ctrl = new AbortController();
  var t = setTimeout(function(){ ctrl.abort(); }, 32000);
  try {
    var r = await fetch(srv+'/api/groq', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ system:system, userMsg:userMsg, language:lang||(window.getLang?window.getLang():'it'), maxTokens:1600 }),
      signal:ctrl.signal,
    });
    var d = await r.json();
    if(r.ok && d.text) return d.text;
    throw new Error(d.error||'Errore server '+r.status);
  } catch(e) {
    if(e.name==='AbortError') throw new Error('Timeout — Railway potrebbe essere in avvio. Riprova tra 30 secondi.');
    throw e;
  } finally { clearTimeout(t); }
};

// Helper — markdown base → HTML
function _fmt(text) {
  return text
    .replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g,'<em>$1</em>')
    .split('\n').map(function(l){return l||'<br>';}).join('<br>');
}

// ═══════════════════════════════════════════════════════════
// FEEDBACK — GLOBALE
// ═══════════════════════════════════════════════════════════
window.swFbPos = function(btn) {
  window.TasteEngine.recordFeedback(true);
  if(btn&&btn.parentNode) btn.parentNode.innerHTML='<span style="color:#7dda8a;font-family:Cinzel,serif;font-size:.52rem;letter-spacing:1px;">✓ Grazie per il feedback!</span>';
};
window.swFbNeg = function(btn) {
  window.TasteEngine.recordFeedback(false);
  if(btn&&btn.parentNode) btn.parentNode.innerHTML='<span style="color:#D4AF37;font-family:Cinzel,serif;font-size:.52rem;letter-spacing:1px;">✓ Terremo conto del tuo parere.</span>';
};

// ═══════════════════════════════════════════════════════════
// ABBINAMENTO MENU — GLOBALE  ← onclick="doAbbinamento()"
// ═══════════════════════════════════════════════════════════
window.doAbbinamento = async function() {
  var menu   = (document.getElementById('menuText')||{}).value||'';
  if(!menu.trim()){ alert('Descrivi il menu per ricevere il consiglio.'); return; }

  var budget = (document.getElementById('budget')||{}).value||'50';
  var lang   = window.getLang?window.getLang():'it';
  var params = window.getWineParams();

  window.TasteEngine.recordSession({paese:params.paese, budget:budget});
  var memoria = window.TasteEngine.buildPromptContext();

  var langCmd = {
    it:'RISPONDI ESCLUSIVAMENTE IN ITALIANO. Lingua: italiano perfetto.',
    en:'REPLY EXCLUSIVELY IN ENGLISH.',
    fr:'RÉPONDS EXCLUSIVEMENT EN FRANÇAIS.',
  }[lang]||'RISPONDI IN ITALIANO.';

  // Vincolo geografico
  var vincolo = '';
  if(params.paese) {
    vincolo = '\n\n'+'▓'.repeat(46)+'\n'+
      '🔴 VINCOLO GEOGRAFICO ASSOLUTO\n'+'▓'.repeat(46)+'\n'+
      'PAESE: "'+params.paese+'"'+(params.regione?'\nREGIONE: "'+params.regione+'"':'')+'\n\n'+
      '✅ Consiglia SOLO vini di '+params.paese+(params.regione?' — '+params.regione:'')+'\n'+
      '❌ È VIETATO consigliare vini di qualsiasi altro paese\n\n'+
      'Produttori e vini di riferimento:\n'+(_ESEMPI_PAESE[params.paese]||'vini tipici di '+params.paese)+'\n'+
      '▓'.repeat(46);
  }

  var profilo = '\n\nProfilo desiderato: '+params.acidita+' di freschezza, carattere '+params.morbidezza+', corpo '+params.struttura+'.';

  // System prompt narrativo — nessun tecnicismo
  var system = langCmd+'\n\n'+
    'Sei un Maestro Sommelier con vent\'anni tra le tavole più celebrate del mondo — '+
    'dal Noma di Copenaghen all\'Osteria Francescana, dal French Laundry di Napa a Robuchon. '+
    'Parli con il calore di un vecchio amico e la precisione di un orologiaio svizzero. '+
    'Non sei un manuale. Sei una persona che ama il vino come si ama la vita.'+
    (params.paese?'\n\n🔴 REGOLA ASSOLUTA: consiglia ESCLUSIVAMENTE vini di '+params.paese+(params.regione?' / '+params.regione:'')+'. Nessuna eccezione.':'')+

    '\n\n━━━ COME LEGGERE UN PIATTO ━━━\n'+
    'Prima di rispondere, ascolta il piatto come ascolteresti un racconto. '+
    'Senti la sua anima — se è ricco o delicato, marino o terroso, speziato o dolce. '+
    'Poi scegli il vino che risponde come un partner perfetto, non come una formula.\n\n'+

    '━━━ LE ARMONIE FONDAMENTALI ━━━\n'+
    '🍷 I sapori del mare (pesce, crostacei) chiedono bianchi freschi e minerali. Un rosso tannico lascerebbe un retrogusto metallico insopportabile.\n'+
    '🍷 Piatti grassi e opulenti vogliono vini con vivacità — bollicine, Champagne, bianchi sapidi — che puliscano il palato dopo ogni boccone.\n'+
    '🍷 La carne rossa succulenta abbraccia vini con struttura e calore — Barolo, Brunello, Cabernet — che bilancino la ricchezza del piatto.\n'+
    '🍷 Ogni dessert dolce merita solo un vino dolce — Sauternes, Recioto, Tokaji, Moscato d\'Asti — mai un secco che sembrerebbe acido e vuoto.\n'+
    '🍷 Piatti molto speziati si accordano con vini morbidi e aromatici a bassa gradazione.\n\n'+

    '━━━ STRUTTURA DELLA RISPOSTA — NARRATIVA ━━━\n'+
    '① L\'ANIMA DEL PIATTO\n'+
    'In una frase, cattura l\'essenza sensoriale di questo menu.\n\n'+
    '② IL VINO IDEALE\n'+
    'Produttore + Denominazione + Vitigno + Annata consigliata. '+
    'Racconta perché è nato per questo piatto, quali emozioni darà dal primo sorso al finale lungo. '+
    'Indica il prezzo medio di mercato.\n\n'+
    '③ LA SCELTA INTELLIGENTE\n'+
    'Un\'alternativa sotto €20 che rispetta la stessa logica di armonia — e perché funziona.\n\n'+
    '④ IL RITUALE DEL SERVIZIO\n'+
    'Temperatura esatta in gradi. Calice ideale. Decanter: sì o no e perché, per quanto tempo.\n\n'+
    '⑤ IL SEGRETO DEL SOMMELIER\n'+
    'Un aneddoto storico, un fatto raro, una curiosità che trasforma questo pasto in un\'esperienza da ricordare.\n\n'+
    'TONO: Elegante come Gualtiero Marchesi parlava di cucina. Zero "certamente" o "assolutamente". '+
    'Se conosci le preferenze di questo ospite dalla memoria, usale con naturalezza — senza dirtelo, come un grande sommelier.';

  var userMsg = 'Menu:\n'+menu+'\nBudget: €'+budget+vincolo+profilo+memoria;

  var loadEl=document.getElementById('somLoad');
  var resEl =document.getElementById('somResult');
  if(loadEl) loadEl.style.display='block';
  if(resEl)  resEl.style.display='none';

  try {
    var res = await window.callAPI(system, userMsg, lang);
    if(loadEl) loadEl.style.display='none';
    if(resEl){
      resEl.innerHTML = _fmt(res)+
        '<div style="display:flex;align-items:center;gap:10px;margin-top:18px;padding-top:14px;border-top:1px solid rgba(212,175,55,.1);">'+
          '<span style="font-family:Cinzel,serif;font-size:.48rem;letter-spacing:1px;color:rgba(245,239,226,.35);">IL CONSIGLIO TI HA AIUTATO?</span>'+
          '<button onclick="swFbPos(this)" style="padding:6px 14px;border-radius:20px;border:1px solid rgba(40,200,100,.3);background:rgba(40,200,100,.1);color:#5dde8a;font-size:14px;">👍</button>'+
          '<button onclick="swFbNeg(this)" style="padding:6px 14px;border-radius:20px;border:1px solid rgba(220,80,80,.3);background:rgba(220,80,80,.1);color:#f88;font-size:14px;">👎</button>'+
        '</div>';
      resEl.style.display='block';
      resEl.scrollIntoView({behavior:'smooth',block:'nearest'});
      var m=res.match(/([A-Z][^\n*]{5,50}(?:DOCG?|AOC|Riserva|Grand Cru|Vintage|AVA|Prädikat)[^\n*]{0,35})/);
      if(m) window.TasteEngine.recordWine(m[1]);
      window.TasteEngine.renderBadge();
    }
  } catch(e) {
    if(loadEl) loadEl.style.display='none';
    if(resEl){
      resEl.innerHTML='<p style="color:#f88;line-height:1.8;font-family:\'Cormorant Garamond\',serif;font-size:1rem;">⚠ '+e.message+'</p>'+
        '<p style="margin-top:12px;"><button onclick="doAbbinamento()" style="padding:9px 18px;background:rgba(212,175,55,.14);border:1px solid rgba(212,175,55,.36);border-radius:6px;color:#D4AF37;font-family:Cinzel,serif;font-size:.54rem;letter-spacing:1px;">↻ Riprova</button></p>';
      resEl.style.display='block';
    }
  }
};

// ═══════════════════════════════════════════════════════════
// RICERCA UNIVERSALE VINI — GLOBALE
// Iniettata nella pagina Sommelier la prima volta che viene aperta
// ═══════════════════════════════════════════════════════════
window.injectWineSearch = function() {
  var wrap = document.querySelector('.som-wrap');
  if(!wrap || document.getElementById('wineSearchSection')) return;

  var section = document.createElement('div');
  section.id = 'wineSearchSection';
  section.innerHTML =
    '<div style="margin-top:28px;padding-top:24px;border-top:1px solid rgba(212,175,55,.12);">'+
      '<div style="font-family:Cinzel,serif;font-size:.58rem;letter-spacing:3px;color:rgba(212,175,55,.55);margin-bottom:10px;text-align:center;">✦ CERCA OGNI VINO DEL MONDO ✦</div>'+
      '<div style="font-family:\'IM Fell English\',serif;font-style:italic;font-size:.88rem;color:rgba(245,239,226,.38);text-align:center;margin-bottom:14px;line-height:1.6;">'+
        'Digita un nome, una denominazione, un produttore, un\'annata.<br>'+
        'Riceverai storia, terroir e carattere — come li racconta un sommelier.</div>'+
      '<div style="display:flex;gap:8px;">'+
        '<input type="search" id="wineSearchInput" '+
          'style="flex:1;padding:12px 14px;background:rgba(255,255,255,.05);border:1px solid rgba(212,175,55,.25);'+
          'border-radius:6px;color:#F5EFE2;font-family:Cinzel,serif;font-size:.56rem;letter-spacing:.06em;outline:none;" '+
          'placeholder="Es: Sassicaia, Barolo Bricco Boschis, Romanée-Conti, Penfolds Grange…" '+
          'onkeydown="if(event.key===\'Enter\') window.searchWine()">'+
        '<button onclick="window.searchWine()" '+
          'style="padding:12px 16px;background:rgba(128,0,32,.25);border:1.5px solid rgba(128,0,32,.5);'+
          'border-radius:6px;color:#F5EFE2;font-family:Cinzel,serif;font-size:.52rem;letter-spacing:1px;white-space:nowrap;">'+
          '🔍 SCOPRI</button>'+
      '</div>'+
      '<div id="wineSearchLoad" style="display:none;text-align:center;padding:18px;">'+
        '<div style="font-family:Cinzel,serif;font-size:.5rem;letter-spacing:3px;color:rgba(212,175,55,.4);margin-bottom:10px;">Consultando l\'archivio mondiale…</div>'+
        '<span class="som-dot"></span><span class="som-dot"></span><span class="som-dot"></span>'+
      '</div>'+
      '<div id="wineSearchResult" style="display:none;margin-top:16px;'+
        'background:rgba(10,4,2,.97);border:1px solid rgba(212,175,55,.15);border-radius:8px;'+
        'padding:18px 16px 20px;font-family:\'Cormorant Garamond\',serif;font-size:1.02rem;'+
        'line-height:1.9;color:rgba(245,239,226,.88);"></div>'+
    '</div>';
  wrap.appendChild(section);
};

window.searchWine = async function() {
  var query = ((document.getElementById('wineSearchInput')||{}).value||'').trim();
  if(!query) return;
  var lang   = window.getLang?window.getLang():'it';
  var loadEl = document.getElementById('wineSearchLoad');
  var resEl  = document.getElementById('wineSearchResult');
  if(loadEl) loadEl.style.display='block';
  if(resEl)  resEl.style.display='none';

  var langCmd={it:'RISPONDI ESCLUSIVAMENTE IN ITALIANO.',en:'REPLY EXCLUSIVELY IN ENGLISH.',fr:'RÉPONDS EXCLUSIVEMENT EN FRANÇAIS.'}[lang]||'RISPONDI IN ITALIANO.';

  var system = langCmd+'\n\n'+
    'Sei un enologo narratore, storico del vino e sommelier di fama internazionale. '+
    'Scrivi una scheda enciclopedica lunga e appassionante sul vino, produttore o denominazione richiesta. '+
    'Minimo 350 parole. Tono letterario ed elegante — come un saggio per Decanter o Wine Spectator.\n\n'+
    '━━━ STRUTTURA OBBLIGATORIA ━━━\n'+
    '🌍 IL TERROIR\n'+
    'Dove nasce questo vino. Come è fatto il suolo. Che clima lo plasma. '+
    'Altitudini, esposizioni, microclimi fondamentali. Due o tre paragrafi narrativi.\n\n'+
    '📜 LA STORIA\n'+
    'Come è nato. Chi lo ha creato. Quali momenti storici lo hanno reso leggendario. '+
    'Un aneddoto che sorprenda — una degustazione storica, un personaggio famoso, un anno cruciale.\n\n'+
    '🍷 IL CARATTERE NEL CALICE\n'+
    'L\'esperienza sensoriale descritta in modo poetico: colore, profumi, sapore al primo sorso, '+
    'come evolve in bocca, il finale. Come cambia con gli anni.\n\n'+
    '🍽 ABBINAMENTI\n'+
    'Un abbinamento classico che ogni sommelier conosce a memoria e un abbinamento inaspettato che sorprende.\n\n'+
    '✦ IL DETTAGLIO CHE SORPRENDE\n'+
    'Un fatto rarissimo, tecnico o storico, che quasi nessuno conosce.\n\n'+
    'Nessuna lista di punti — solo paragrafi fluenti come un racconto.';

  try {
    var res = await window.callAPI(system,'Dimmi tutto su: '+query, lang);
    if(loadEl) loadEl.style.display='none';
    if(resEl){
      resEl.innerHTML=
        '<div style="font-family:Cinzel,serif;font-size:.62rem;letter-spacing:3px;color:#D4AF37;margin-bottom:16px;">✦ '+query.toUpperCase()+'</div>'+
        _fmt(res);
      resEl.style.display='block';
      resEl.scrollIntoView({behavior:'smooth',block:'nearest'});
    }
  } catch(e) {
    if(loadEl) loadEl.style.display='none';
    if(resEl){
      resEl.innerHTML='<p style="color:#f88;font-family:\'Cormorant Garamond\',serif;">⚠ '+e.message+'</p>';
      resEl.style.display='block';
    }
  }
};

// Inietta ricerca quando la pagina sommelier si apre
(function(){
  var _orig = window.showPage;
  if(typeof _orig === 'function'){
    window.showPage = function(pageId){
      _orig(pageId);
      if(pageId==='sommelier'){
        setTimeout(window.injectWineSearch, 100);
        window.TasteEngine.renderBadge();
      }
    };
  }
  // Se sommelier è già la pagina attiva
  document.addEventListener('DOMContentLoaded', function(){
    var p = document.getElementById('page-sommelier');
    if(p && p.classList.contains('active')) window.injectWineSearch();
    window.TasteEngine.renderBadge();
  });
})();

// ═══════════════════════════════════════════════════════════
// PRODUTTORI — PACCHETTI & FORM (TUTTI GLOBALI)
// ═══════════════════════════════════════════════════════════
var _PKGS = {
  basic:   { label:'BASIC',   emoji:'🍷', prezzo:'€19/mese', importo:19,
             features:'1 vino · Profilo cantina · Contatti' },
  premium: { label:'PREMIUM', emoji:'⭐', prezzo:'€49/mese', importo:49,
             features:'5 vini · Galleria fotografica · Link sito web · Badge Premium' },
  elite:   { label:'ELITE',   emoji:'👑', prezzo:'€99/mese', importo:99,
             features:'Vini illimitati · Scheda AI · Priorità assoluta · Statistiche · Badge Eccellenza' },
};

window._selectedPkg = null;

window.selectPkg = function(pkg) {
  window._selectedPkg = pkg;

  // Feedback visivo sulle card
  Object.keys(_PKGS).forEach(function(p){
    var el=document.getElementById('pkg_'+p);
    if(!el) return;
    var sel=(p===pkg);
    el.style.opacity    = sel?'1':'0.5';
    el.style.transform  = sel?'scale(1.02)':'scale(1)';
    el.style.boxShadow  = sel?'0 8px 32px rgba(0,0,0,.6)':'none';
    el.style.borderColor= sel?(p==='elite'?'#D4AF37':'rgba(212,175,55,.45)'):'rgba(212,175,55,.15)';
  });

  // Badge nel form
  var badge=document.getElementById('prodFormBadge');
  if(badge){
    var info=_PKGS[pkg];
    badge.textContent=info.emoji+' '+info.label+' — '+info.prezzo;
    badge.style.background=pkg==='elite'?'rgba(212,175,55,.22)':'rgba(212,175,55,.1)';
    badge.style.borderColor=pkg==='elite'?'rgba(212,175,55,.6)':'rgba(212,175,55,.3)';
  }

  // Mostra form e scrolla
  var form=document.getElementById('prodForm');
  if(form){
    form.style.display='block';
    setTimeout(function(){ form.scrollIntoView({behavior:'smooth',block:'nearest'}); }, 80);
  }
};

window.submitProd = async function() {
  var nome    = ((document.getElementById('prodNome')   ||{}).value||'').trim();
  var vino    = ((document.getElementById('prodVino')   ||{}).value||'').trim();
  var regione = ((document.getElementById('prodRegione')||{}).value||'').trim();
  var email   = ((document.getElementById('prodEmail')  ||{}).value||'').trim();
  var st      = document.getElementById('prodStatus');

  if(!nome||!email){
    if(st){st.style.color='#f88';st.textContent='✗ Nome cantina ed email sono obbligatori.';}
    return;
  }
  if(!email.includes('@')||!email.includes('.')){
    if(st){st.style.color='#f88';st.textContent='✗ Inserisci un indirizzo email valido.';}
    return;
  }

  var pkg  = window._selectedPkg||'premium';
  var info = _PKGS[pkg];
  if(st){st.style.color='rgba(212,175,55,.5)';st.textContent='⏳ Invio in corso…';}

  var body = {
    name:    nome,
    email:   email,
    package: pkg,
    subject: '[Sommelier World] Nuova iscrizione: '+nome+' — '+info.label+' ('+info.prezzo+')',
    message: [
      'CANTINA: '+nome,
      'VINO DI PUNTA: '+(vino   ||'—'),
      'REGIONE: '+(regione||'—'),
      'PACCHETTO: '+info.label+' '+info.prezzo,
      'IMPORTO: €'+info.importo+'/mese',
      'FEATURES: '+info.features,
      'EMAIL: '+email,
    ].join('\n'),
  };

  try {
    var srv=window.SRV||window.SERVER_URL||_SRV;
    var r=await fetch(srv+'/api/contact',{
      method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),
    });
    var d=await r.json();
    if(r.ok||d.ok){
      // Feedback ORO
      if(st){
        st.style.cssText='color:#D4AF37;font-family:Cinzel,serif;font-size:.56rem;letter-spacing:2px;text-align:center;';
        st.textContent='✓ Richiesta inviata — ti contatteremo a '+email+' entro 24 ore.';
      }
      // Gold flash
      var flash=document.createElement('div');
      flash.className='gold-flash-overlay';
      document.body.appendChild(flash);
      setTimeout(function(){flash.remove();},2000);
      // Reset form
      ['prodNome','prodVino','prodRegione','prodEmail'].forEach(function(id){
        var el=document.getElementById(id); if(el) el.value='';
      });
      // Reset card dopo 3s
      setTimeout(function(){
        window._selectedPkg=null;
        Object.keys(_PKGS).forEach(function(p){
          var el=document.getElementById('pkg_'+p);
          if(el){el.style.opacity='1';el.style.transform='scale(1)';el.style.boxShadow='none';el.style.borderColor='rgba(212,175,55,.15)';}
        });
      },3000);
    } else {
      if(st){st.style.color='#f88';st.textContent='✗ Errore: '+(d.error||'Riprova o scrivi a info@sommelierworld.vin');}
    }
  } catch(e){
    if(st){st.style.color='#f88';st.textContent='✗ Errore di connessione: '+e.message;}
  }
};

// ═══════════════════════════════════════════════════════════
// TERROIR — scheda AI profonda per denominazione
// Usata da navigation.js via window.openDenomDetail
// ═══════════════════════════════════════════════════════════
window._denomCache = {};

window.openDenomDetail = function(id) {
  var denom=(window._DENOM||[]).find(function(d){return d.id===id;});
  if(!denom) return;
  var detail=document.getElementById('expDetail');
  if(!detail) return;
  detail.style.display='block';

  var flag=(window.EFLAGS||{})[denom.country]||'🌍';
  var tc={ DOCG:'#D4AF37',DOC:'rgba(212,175,55,.75)',AOC:'#a0c8ff',DOCa:'#ffb080',
           PDO:'#b0ffb0',AVA:'#ffaaaa',Prädikat:'#d0aaff',DAC:'#ffe08a',GI:'#aaddff' }[denom.type]||'rgba(212,175,55,.65)';

  detail.innerHTML=
    '<div style="position:sticky;top:102px;z-index:50;background:rgba(10,10,10,.97);border-bottom:1px solid rgba(212,175,55,.2);padding:12px 16px;display:flex;align-items:center;gap:10px;">'+
      '<button onclick="window.closeDenomDetail()" style="background:none;border:1px solid rgba(212,175,55,.3);color:#D4AF37;font-family:Cinzel,serif;font-size:.52rem;letter-spacing:2px;padding:6px 12px;">← INDIETRO</button>'+
      '<div>'+
        '<div style="font-family:Cinzel,serif;font-size:.7rem;letter-spacing:2px;color:#fff;">'+denom.name+'</div>'+
        '<div style="font-family:Cinzel,serif;font-size:.48rem;color:rgba(212,175,55,.5);">'+flag+' '+denom.country+' · '+denom.region+'</div>'+
      '</div>'+
    '</div>'+
    '<div style="padding:18px 16px;">'+
      '<span style="font-family:Cinzel,serif;font-size:.5rem;letter-spacing:2px;padding:4px 12px;background:'+tc+'1a;border:1px solid '+tc+'55;color:'+tc+';border-radius:20px;">'+denom.type+'</span>'+
      '<div style="font-family:\'Playfair Display\',serif;font-size:1.55rem;font-weight:700;color:#fff;line-height:1.2;margin:12px 0 8px;">'+denom.name+'</div>'+
      '<div style="font-family:\'IM Fell English\',serif;font-style:italic;font-size:1.05rem;color:rgba(245,239,226,.65);line-height:1.75;margin-bottom:16px;">'+denom.desc+'</div>'+
      '<div style="margin-bottom:18px;">'+
        '<div style="font-family:Cinzel,serif;font-size:.5rem;letter-spacing:2px;color:rgba(212,175,55,.5);margin-bottom:8px;">VITIGNI</div>'+
        '<div style="display:flex;flex-wrap:wrap;gap:6px;">'+
        denom.grapes.split(',').map(function(g){
          return '<span style="font-family:Cinzel,serif;font-size:.5rem;letter-spacing:1px;padding:4px 11px;border:1px solid rgba(212,175,55,.28);color:rgba(212,175,55,.8);border-radius:2px;background:rgba(212,175,55,.06);">🍇 '+g.trim()+'</span>';
        }).join('')+
        '</div>'+
      '</div>'+
      '<div style="font-family:Cinzel,serif;font-size:.56rem;letter-spacing:3px;color:rgba(212,175,55,.7);margin-bottom:12px;">📖 SCHEDA ENCICLOPEDICA</div>'+
      '<div id="denomSchedaContent" style="font-family:\'IM Fell English\',serif;font-style:italic;font-size:.9rem;color:rgba(212,175,55,.4);">'+
      (window._denomCache[id]||'Caricamento scheda approfondita…')+
      '</div>'+
    '</div>';

  detail.scrollIntoView({behavior:'smooth',block:'start'});
  if(!window._denomCache[id]) window._loadDenomScheda(denom);
};

window.closeDenomDetail = function(){
  var d=document.getElementById('expDetail');
  if(d) d.style.display='none';
};

window._loadDenomScheda = async function(denom){
  var cont=document.getElementById('denomSchedaContent');
  if(!cont) return;
  var lang=window.getLang?window.getLang():'it';
  var langCmd={it:'RISPONDI ESCLUSIVAMENTE IN ITALIANO.',en:'REPLY EXCLUSIVELY IN ENGLISH.',fr:'RÉPONDS EXCLUSIVEMENT EN FRANÇAIS.'}[lang]||'RISPONDI IN ITALIANO.';

  var system=langCmd+'\n\n'+
    'Sei un enologo narratore, ampelografo e storico del vino. '+
    'Scrivi una scheda enciclopedica LUNGA e APPASSIONANTE sulla denominazione indicata. '+
    'Minimo 500 parole. Tono letterario, poetico e preciso. '+
    'Struttura narrativa:\n\n'+
    '📜 STORIA E ORIGINI — secoli, monasteri, famiglie, momenti storici che l\'hanno forgiata.\n\n'+
    '🌍 IL TERROIR — suolo geologico, clima, altitudine, esposizione. Come si traduce nel vino.\n\n'+
    '🍇 I VITIGNI — perché si adattano perfettamente, cosa esprimono di unico in questo luogo.\n\n'+
    '🍷 NEL CALICE — colore, profumi, struttura al palato, finale, longevità. Descrizione evocativa.\n\n'+
    '🏡 PRODUTTORI DI RIFERIMENTO — almeno 4 produttori iconici con frase su cosa li rende speciali.\n\n'+
    '🍽 ABBINAMENTI IDEALI — 3 classici e 1 inaspettato.\n\n'+
    '✦ LA CURIOSITÀ RARA — un fatto sorprendente che quasi nessuno conosce.\n\n'+
    'Paragrafi fluenti, mai liste di punti. Come scrivessi per Decanter o Wine Spectator.';

  try {
    var text=await window.callAPI(system,
      'Scheda completa per: '+denom.name+' ('+denom.country+', '+denom.region+')\nVitigni: '+denom.grapes+'\nDescrizione base: '+denom.desc,
      lang);
    var html=text
      .replace(/\*\*([^*]+)\*\*/g,'<strong style="color:#F5EFE2;font-style:normal;">$1</strong>')
      .replace(/\*([^*]+)\*/g,'<em>$1</em>')
      .split(/\n\n+/)
      .map(function(p){
        return '<p style="font-family:\'Cormorant Garamond\',serif;font-size:1.02rem;line-height:1.92;color:rgba(245,239,226,.85);margin-bottom:16px;font-style:normal;">'+p.replace(/\n/g,'<br>')+'</p>';
      }).join('');
    window._denomCache[denom.id]=html;
    if(cont) cont.innerHTML=html;
  } catch(e){
    if(cont) cont.innerHTML=
      '<p style="font-family:\'Cormorant Garamond\',serif;font-size:.95rem;line-height:1.85;color:rgba(245,239,226,.55);font-style:normal;">'+denom.desc+'</p>'+
      '<p style="font-family:\'IM Fell English\',serif;font-style:italic;font-size:.85rem;color:rgba(212,175,55,.35);margin-top:10px;">Scheda approfondita non disponibile. Riprova tra 30 secondi.</p>';
  }
};
