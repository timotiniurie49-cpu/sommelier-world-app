/**
 * SOMMELIER WORLD — sommelier.js v26
 * ─────────────────────────────────────────────────────────────
 * B2C: paywall 3 consultazioni/giorno (checkConsultazioneLibera da navigation.js)
 * B2B: pacchetti Basic €19 / Premium €49 / Elite €99
 * Elite producers: vengono consigliati prioritariamente dall'AI
 * Tono: narrativo, poetico, zero tecnicismi chimici.
 * ─────────────────────────────────────────────────────────────
 */

var _SRV = 'https://sommelier-server-production-8f92.up.railway.app';

// ═══════════════════════════════════════════════════════════
// REGIONI DEL MONDO — select Paese/Regione
// ═══════════════════════════════════════════════════════════
window.REGIONI = {
  'Italia':       ['Piemonte','Toscana','Veneto','Sicilia','Campania','Friuli-Venezia Giulia',
                   'Alto Adige','Sardegna','Umbria','Marche','Lombardia','Abruzzo','Puglia','Trentino','Lazio'],
  'Francia':      ['Borgogna','Bordeaux','Rodano','Alsazia','Champagne','Loira',
                   'Languedoc-Roussillon','Provenza','Beaujolais','Jura'],
  'Spagna':       ['Rioja','Ribera del Duero','Priorat','Rías Baixas','Jerez','Toro','Penedès','Bierzo'],
  'USA':          ['Napa Valley','Sonoma','Willamette Valley','Paso Robles','Santa Barbara','Finger Lakes'],
  'Germania':     ['Mosel','Rheingau','Pfalz','Baden','Rheinhessen','Nahe','Franken'],
  'Portogallo':   ['Douro','Alentejo','Vinho Verde','Dão','Bairrada','Lisboa'],
  'Argentina':    ['Mendoza','Salta','Patagonia','Uco Valley','San Juan'],
  'Cile':         ['Maipo','Colchagua','Casablanca','Elqui','Bío-Bío'],
  'Australia':    ['Barossa Valley','McLaren Vale','Clare Valley','Yarra Valley','Margaret River','Hunter Valley'],
  'Nuova Zelanda':["Marlborough","Central Otago","Hawke's Bay"],
  'Grecia':       ['Santorini','Naoussa','Nemea','Creta'],
  'Austria':      ['Wachau','Kamptal','Kremstal','Burgenland','Steiermark'],
  'Ungheria':     ['Tokaj','Eger','Villány'],
  'Georgia':      ['Kakheti','Kartli','Imereti'],
  'Sud Africa':   ['Stellenbosch','Swartland','Franschhoek','Walker Bay'],
};

var _ESEMPI_PAESE = {
  'Italia':       'Barolo (Gaja, Giacomo Conterno), Brunello di Montalcino (Biondi-Santi), Sassicaia, Amarone (Dal Forno)',
  'Francia':      "Romanée-Conti, Pétrus, Dom Pérignon, Hermitage (Chapoutier), Sauternes (Château d'Yquem)",
  'Spagna':       'Rioja Gran Reserva (Muga, CVNE), Ribera del Duero (Vega Sicilia), Albariño Rías Baixas',
  'USA':          "Napa Cabernet (Opus One, Screaming Eagle, Stag's Leap), Willamette Pinot Noir",
  'Germania':     'Riesling Mosel (Egon Müller, JJ Prüm, Clemens Busch), Baden Spätburgunder',
  'Portogallo':   "Porto Vintage (Niepoort, Graham's), Douro Touriga Nacional, Vinho Verde Alvarinho",
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
// QUICK MENUS
// ═══════════════════════════════════════════════════════════
window.quickMenu=function(type){
  var menus={
    pesce:
      'Antipasto — Carpaccio di gamberi rossi con lime e zenzero\n'+
      'Primo — Linguine alle vongole veraci\n'+
      'Secondo — Branzino al forno con erbe aromatiche\n'+
      'Contorno — Patate al vapore con prezzemolo fresco',
    carne:
      'Antipasto — Tagliere di salumi misti con lardo di Colonnata\n'+
      'Primo — Tagliatelle al ragù di cinghiale\n'+
      'Secondo — Costata di Fassona Piemontese al sangue\n'+
      'Contorno — Funghi porcini trifolati con aglio e nepitella',
    vegetariano:
      'Antipasto — Burrata con pomodorini datterini e basilico\n'+
      'Primo — Risotto ai funghi porcini con tartufo nero\n'+
      'Secondo — Melanzane alla parmigiana con fior di latte\n'+
      'Formaggi — Parmigiano Reggiano 36 mesi con mostarda di Cremona',
    degustazione:
      'Amuse-bouche — Tartare di tonno rosso con caviale di aringa\n'+
      'Primo — Tortelli di ricotta e spinaci al burro e salvia\n'+
      'Intermezzo — Granita al limone di Amalfi\n'+
      'Secondo — Piccione arrosto su salsa al Pinot Nero\n'+
      'Pre-dessert — Crème brûlée alla vaniglia del Madagascar\n'+
      'Dolce — Tiramisù al caffè espresso ristretto',
    formaggi:
      'Fresco — Burrata pugliese con olio extravergine\n'+
      'Semi-stagionato — Pecorino di Pienza DOP\n'+
      'Stagionato — Parmigiano Reggiano 36 mesi\n'+
      'Erborinato — Gorgonzola Piccante DOP\n'+
      "Capra — Chèvre frais della Loira con miele di acacia",
  };
  var ta=document.getElementById('menuText');
  if(ta&&menus[type]){ta.value=menus[type];ta.focus();}
};

// ═══════════════════════════════════════════════════════════
// SLIDER PROFILO
// ═══════════════════════════════════════════════════════════
window.updateSlider=function(id,labels,val){
  var lbl=document.getElementById(id+'Val');
  if(lbl) lbl.textContent=labels[parseInt(val)-1]||labels[2];
  var slider=document.getElementById(id);
  if(slider) slider.style.setProperty('--pct',((parseInt(val)-1)/4*100).toFixed(0)+'%');
};

window.getWineParams=function(){
  function getL(id,arr){var e=document.getElementById(id);return e?arr[parseInt(e.value)-1]:arr[2];}
  return {
    acidita:    getL('acidita',   ['Bassa','Medio-bassa','Media','Medio-alta','Alta']),
    morbidezza: getL('morbidezza',['Secco e asciutto','Poco morbido','Equilibrato','Morbido','Avvolgente']),
    struttura:  getL('struttura', ['Leggero e delicato','Medio-leggero','Equilibrato','Pieno','Potente e concentrato']),
    paese:  (document.getElementById('winePaese')  ||{}).value||'',
    regione:(document.getElementById('wineRegione')||{}).value||'',
  };
};

// ═══════════════════════════════════════════════════════════
// SELECT PAESE → REGIONE
// ═══════════════════════════════════════════════════════════
window.updateRegioni=function(){
  var paese=(document.getElementById('winePaese')||{}).value||'';
  var sel=document.getElementById('wineRegione');
  if(!sel) return;
  sel.innerHTML='<option value="">Qualsiasi regione</option>';
  (window.REGIONI[paese]||[]).forEach(function(r){
    var o=document.createElement('option'); o.value=r; o.textContent=r; sel.appendChild(o);
  });
  sel.disabled=!paese;
};

document.addEventListener('DOMContentLoaded',function(){
  var sel=document.getElementById('winePaese');
  if(!sel) return;
  Object.keys(window.REGIONI).forEach(function(p){
    var o=document.createElement('option'); o.value=p; o.textContent=p; sel.appendChild(o);
  });
  sel.onchange=window.updateRegioni;
  ['acidita','morbidezza','struttura'].forEach(function(id){
    var s=document.getElementById(id); if(s) s.style.setProperty('--pct','50%');
  });
  var regEl=document.getElementById('wineRegione'); if(regEl) regEl.disabled=true;
});


// ═══════════════════════════════════════════════════════════
// FOTO MENU — gestione upload + base64 per AI
// ═══════════════════════════════════════════════════════════
window._menuPhotoB64 = null;  // base64 della foto menu

window.handleMenuPhoto = function(input) {
  if(!input.files||!input.files[0]) return;
  var file = input.files[0];
  var reader = new FileReader();
  reader.onload = function(e) {
    var b64 = e.target.result; // data:image/jpeg;base64,...
    window._menuPhotoB64 = b64;
    var preview = document.getElementById('menuPhotoPreview');
    var img     = document.getElementById('menuPhotoImg');
    if(preview) preview.style.display = 'block';
    if(img)     img.src = b64;
  };
  reader.readAsDataURL(file);
};

window.clearMenuPhoto = function() {
  window._menuPhotoB64 = null;
  var preview = document.getElementById('menuPhotoPreview');
  var input   = document.getElementById('menuPhotoInput');
  var img     = document.getElementById('menuPhotoImg');
  if(preview) preview.style.display = 'none';
  if(input)   input.value = '';
  if(img)     img.src = '';
};

/* Costruisce il messaggio AI includendo la foto se disponibile */
window._buildMenuMessage = async function(textMenu, budget, vincolo, profilo, memoria) {
  var srv = window.SRV || window.SERVER_URL || _SRV;
  var base = 'Menu:\n'+textMenu+'\nBudget: €'+budget+vincolo+profilo+memoria;

  if(!window._menuPhotoB64) return { text: base };

  /* Se abbiamo la foto, chiediamo prima all'AI di descriverla */
  try {
    var imgDesc = await window.callAPI(
      'Sei un sommelier esperto. Guarda questa foto di un menu o di piatti e descrivi BREVEMENTE (max 3 righe) i piatti che vedi, in italiano.',
      'Analizza questa foto del menu: [IMMAGINE ALLEGATA]',
      'it'
    );
    return { text: base + '\n\nDescrizione visiva dal menu fotografato: ' + imgDesc };
  } catch(e) {
    return { text: base };
  }
};

// ═══════════════════════════════════════════════════════════
// TASTE ENGINE — memoria preferenze locali
// ═══════════════════════════════════════════════════════════
window.TasteEngine=(function(){
  var KEY='sw_taste_v3';
  var DEF={sessions:0,paese:{},budget:[],feedback:{pos:0,neg:0},ultimiVini:[]};
  function load(){try{var r=localStorage.getItem(KEY);return r?Object.assign({},DEF,JSON.parse(r)):Object.assign({},DEF);}catch(e){return Object.assign({},DEF);}}
  function save(p){try{localStorage.setItem(KEY,JSON.stringify(p));}catch(e){}}
  return {
    recordSession:function(opts){var p=load();p.sessions++;if(opts.paese)(p.paese[opts.paese]=(p.paese[opts.paese]||0)+1);if(opts.budget){p.budget.push(Number(opts.budget));if(p.budget.length>6)p.budget.shift();}save(p);},
    recordWine:function(name){if(!name)return;var p=load();p.ultimiVini.unshift(name.substring(0,60));if(p.ultimiVini.length>6)p.ultimiVini.pop();save(p);},
    recordFeedback:function(positive){var p=load();if(positive)p.feedback.pos=(p.feedback.pos||0)+1;else p.feedback.neg=(p.feedback.neg||0)+1;save(p);},
    buildPromptContext:function(){
      var p=load(); if(p.sessions<1)return '';
      var lines=['═══ MEMORIA GUSTO OSPITE ═══'];
      lines.push('Sessioni precedenti: '+p.sessions);
      var topP=Object.entries(p.paese||{}).sort(function(a,b){return b[1]-a[1];})[0];
      if(topP)lines.push('Paese preferito: '+topP[0]);
      if(p.budget&&p.budget.length){var avg=Math.round(p.budget.reduce(function(a,b){return a+b;},0)/p.budget.length);lines.push('Budget medio: €'+avg);}
      if(p.ultimiVini&&p.ultimiVini.length)lines.push('Vini già consigliati (non ripetere): '+p.ultimiVini.join(', '));
      lines.push('════════════════════════════');
      lines.push('Tratta questo ospite come un cliente affezionato — usa le sue preferenze con naturalezza.');
      return '\n\n'+lines.join('\n');
    },
    renderBadge:function(){
      var p=load(); if(p.sessions<1)return;
      var badge=document.getElementById('sw-taste-badge');
      if(!badge){badge=document.createElement('div');badge.id='sw-taste-badge';badge.style.cssText='position:fixed;bottom:80px;right:10px;z-index:99998;background:rgba(212,175,55,.14);border:1px solid rgba(212,175,55,.28);border-radius:20px;padding:4px 12px;font-family:Cinzel,serif;font-size:9px;color:#D4AF37;letter-spacing:1px;cursor:pointer;';badge.title='Il tuo profilo gusto';badge.onclick=function(){window.TasteEngine.showProfile();};document.body.appendChild(badge);}
      badge.textContent='🍷 '+p.sessions+(p.sessions===1?' sessione':' sessioni');
    },
    showProfile:function(){
      var p=load();
      var topP=Object.entries(p.paese||{}).sort(function(a,b){return b[1]-a[1];}).slice(0,3);
      var avgB=p.budget.length?'€'+Math.round(p.budget.reduce(function(a,b){return a+b;},0)/p.budget.length):'—';
      var ov=document.createElement('div');
      ov.style.cssText='position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;';
      ov.onclick=function(){ov.remove();};
      ov.innerHTML='<div style="background:#0A0A0A;border:1px solid rgba(212,175,55,.3);border-radius:14px;padding:24px;max-width:320px;width:90%;pointer-events:auto;" onclick="event.stopPropagation()">'+
        '<div style="font-family:Cinzel,serif;font-size:.7rem;letter-spacing:3px;color:#D4AF37;margin-bottom:16px;">🍷 IL TUO PROFILO GUSTO</div>'+
        '<div style="font-family:\'Cormorant Garamond\',serif;font-size:1rem;line-height:2.1;color:rgba(245,239,226,.8);">'+
          '<div>📊 Sessioni: <strong style="color:#F5EFE2">'+p.sessions+'</strong></div>'+
          '<div>💶 Budget medio: <strong style="color:#F5EFE2">'+avgB+'</strong></div>'+
          (topP.length?'<div>🌍 Paesi: <strong style="color:#F5EFE2">'+topP.map(function(x){return x[0];}).join(', ')+'</strong></div>':'')+
          '<div>👍 Positivi: <strong style="color:#7dda8a">'+(p.feedback.pos||0)+'</strong></div>'+
          '<div>👎 Da migliorare: <strong style="color:#f88">'+(p.feedback.neg||0)+'</strong></div>'+
          (p.ultimiVini.length?'<div style="margin-top:10px;font-size:.88rem;color:rgba(245,239,226,.35);">Ultimi vini: '+p.ultimiVini.join(', ')+'</div>':'')+
        '</div>'+
        '<button onclick="this.closest(\'div[style*=fixed]\').remove()" style="margin-top:16px;width:100%;padding:10px;background:rgba(212,175,55,.12);border:1.5px solid rgba(212,175,55,.28);border-radius:6px;color:#D4AF37;font-family:Cinzel,serif;font-size:.52rem;letter-spacing:2px;">CHIUDI</button>'+
      '</div>';
      document.body.appendChild(ov);
    },
  };
})();

// ═══════════════════════════════════════════════════════════
// PRODUTTORI ELITE — caricati per priorità AI
// ═══════════════════════════════════════════════════════════
window._eliteProducers = []; // cache produttori Elite

window._loadEliteProducers = async function() {
  try {
    var srv=window.SRV||window.SERVER_URL||_SRV;
    var r=await fetch(srv+'/api/producers/public');
    if(!r.ok) return;
    var data=await r.json();
    window._eliteProducers=(data.elite||[]).map(function(p){return p.name;}).filter(Boolean);
  } catch(e) {
    // silenzioso — i produttori Elite sono un bonus, non un requisito
  }
};

// Costruisce la sezione Elite per il prompt AI
window._buildEliteContext = function() {
  if(!window._eliteProducers.length) return '';
  return '\n\n' +
    '▓'.repeat(44)+'\n'+
    '★ PRODUTTORI ELITE SOMMELIER WORLD ★\n'+
    '▓'.repeat(44)+'\n'+
    'I seguenti produttori sono Membri Elite di Sommelier World.\n'+
    'Quando pertinenti al menu e al profilo dell\'ospite, CITALI\n'+
    'come prima scelta nei tuoi consigli, con entusiasmo autentico:\n\n'+
    window._eliteProducers.map(function(n){return '✦ '+n;}).join('\n')+'\n'+
    '▓'.repeat(44);
};

// ═══════════════════════════════════════════════════════════
// callAPI — proxy Railway
// ═══════════════════════════════════════════════════════════
window.callAPI=async function(system,userMsg,lang){
  var srv=window.SRV||window.SERVER_URL||_SRV;
  var ctrl=new AbortController();
  var t=setTimeout(function(){ctrl.abort();},32000);
  try{
    var r=await fetch(srv+'/api/groq',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({system:system,userMsg:userMsg,language:lang||(window.getLang?window.getLang():'it'),maxTokens:1600}),
      signal:ctrl.signal,
    });
    var d=await r.json();
    if(r.ok&&d.text) return d.text;
    throw new Error(d.error||'Errore server '+r.status);
  }catch(e){
    if(e.name==='AbortError') throw new Error('Timeout — il server è in avvio. Riprova tra 30 secondi.');
    throw e;
  }finally{clearTimeout(t);}
};

// Formatta markdown → HTML
function _fmt(text){
  return text
    .replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g,'<em>$1</em>')
    .split('\n').map(function(l){return l||'<br>';}).join('<br>');
}

// ═══════════════════════════════════════════════════════════
// FEEDBACK
// ═══════════════════════════════════════════════════════════
window.swFbPos=function(btn){window.TasteEngine.recordFeedback(true);if(btn&&btn.parentNode)btn.parentNode.innerHTML='<span style="color:#7dda8a;font-family:Cinzel,serif;font-size:.52rem;letter-spacing:1px;">✓ Grazie per il feedback!</span>';};
window.swFbNeg=function(btn){window.TasteEngine.recordFeedback(false);if(btn&&btn.parentNode)btn.parentNode.innerHTML='<span style="color:#D4AF37;font-family:Cinzel,serif;font-size:.52rem;letter-spacing:1px;">✓ Terremo conto del tuo parere.</span>';};

// ═══════════════════════════════════════════════════════════
// ABBINAMENTO MENU — B2C con paywall
// ═══════════════════════════════════════════════════════════
window.doAbbinamento=async function(){
  /* ── PAYWALL B2C ── */
  if(typeof window.checkConsultazioneLibera==='function'){
    if(!window.checkConsultazioneLibera()) return; // mostra popup e blocca
  }

  var menu=(document.getElementById('menuText')||{}).value||'';
  if(!menu.trim()){alert('Descrivi il menu per ricevere il consiglio.');return;}

  var budget=(document.getElementById('budget')||{}).value||'50';
  var params=window.getWineParams();
  var isElite=typeof window.isEliteUser==='function'?window.isEliteUser():false;

  window.TasteEngine.recordSession({paese:params.paese,budget:budget});
  var memoria=window.TasteEngine.buildPromptContext();
  var eliteCtx=window._buildEliteContext();

  /* ── Vincolo geografico ── */
  var vincolo='';
  if(params.paese){
    vincolo='\n\n'+'▓'.repeat(44)+'\n'+
      '🔴 VINCOLO GEOGRAFICO ASSOLUTO\n'+'▓'.repeat(44)+'\n'+
      'PAESE: "'+params.paese+'"'+(params.regione?'\nREGIONE: "'+params.regione+'"':'')+'\n'+
      '✅ Consiglia SOLO vini di '+params.paese+(params.regione?' — '+params.regione:'')+'\n'+
      '❌ VIETATO consigliare vini di qualsiasi altro paese\n\n'+
      'Produttori e vini di riferimento:\n'+(_ESEMPI_PAESE[params.paese]||'vini tipici di '+params.paese)+'\n'+
      '▓'.repeat(44);
  }

  var profilo='\n\nProfilo desiderato: '+params.acidita+' di freschezza, carattere '+params.morbidezza+', corpo '+params.struttura+'.';

  /* ── Lunghezza risposta in base al piano ── */
  var lunghezza=isElite
    ? 'Rispondi con una descrizione LUNGA, POETICA e COMPLETA. Minimo 400 parole. Ogni sezione deve essere un\'esperienza letteraria. Non risparmiare dettagli — l\'ospite Elite merita il massimo.'
    : 'Rispondi in modo CONCISO ma elegante. Massimo 200 parole. Indica il vino principale, perché si abbina, temperatura e un\'alternativa economica. Tono sobrio ma colto.';

  /* ── System prompt narrativo ── */
  var system='RISPONDI ESCLUSIVAMENTE IN ITALIANO. Lingua: italiano colto e letterario.\n\n'+
    'Sei un Maestro Sommelier con vent\'anni tra le tavole più celebrate del mondo. '+
    'Parli con il calore di un amico fidato e la precisione di un orologiaio svizzero. '+
    'Non sei un manuale — sei un narratore che conosce il vino come conosce la vita.\n\n'+
    lunghezza+
    (params.paese?'\n\n🔴 REGOLA ASSOLUTA: consiglia ESCLUSIVAMENTE vini di '+params.paese+(params.regione?' / '+params.regione:'')+'. Nessuna eccezione.':'')+
    eliteCtx+

    '\n\n━━━ LE ARMONIE FONDAMENTALI ━━━\n'+
    '🍷 Il mare chiede bianchi freschi e minerali — un rosso tannico lascerebbe un retrogusto metallico insopportabile.\n'+
    '🍷 I piatti grassi vogliono vini vivaci — bollicine, bianchi sapidi — che puliscano il palato ad ogni boccone.\n'+
    '🍷 La carne rossa abbraccia vini con struttura e calore — Barolo, Brunello, Cabernet — che bilancino la ricchezza.\n'+
    '🍷 Ogni dessert dolce merita solo un vino dolce — mai un secco che sembrerebbe acido e vuoto al confronto.\n\n'+

    (isElite
      ? '━━━ STRUTTURA RISPOSTA ELITE — NARRATIVA COMPLETA ━━━\n'+
        '① L\'ANIMA DEL PIATTO — in una frase, l\'essenza sensoriale del menu.\n'+
        '② IL VINO IDEALE — produttore + denominazione + vitigno + annata. Racconta perché è nato per questo piatto, le emozioni dal primo sorso al finale. Prezzo medio.\n'+
        '③ LA SCELTA INTELLIGENTE — alternativa sotto €20 con spiegazione.\n'+
        '④ IL RITUALE DEL SERVIZIO — temperatura esatta, calice ideale, decanter: sì/no e perché.\n'+
        '⑤ IL SEGRETO DEL SOMMELIER — un aneddoto storico o curiosità rara che trasforma questo pasto in un ricordo.'
      : '━━━ STRUTTURA RISPOSTA FREE — CONCISA E ELEGANTE ━━━\n'+
        'Indica: 1) Il vino consigliato (produttore, denominazione, perché si abbina). 2) Un\'alternativa economica. 3) Temperatura di servizio.\n'+
        'Fine risposta: aggiungi una breve nota che invita a scoprire la versione Elite per consulenze complete e poetiche.'
    );

  var userMsg='Menu:\n'+menu+'\nBudget: €'+budget+vincolo+profilo+memoria;
  /* Se c'è una foto del menu, aggiunge nota visiva */
  if(window._menuPhotoB64){
    userMsg += '\n\n[L\'utente ha caricato una foto del menu. Considera che potrebbero esserci piatti non descritti nel testo]';
  }

  var loadEl=document.getElementById('somLoad');
  var resEl =document.getElementById('somResult');
  if(loadEl)loadEl.style.display='block';
  if(resEl) resEl.style.display='none';

  try{
    var res=await window.callAPI(system,userMsg,'it');
    if(loadEl)loadEl.style.display='none';
    if(resEl){
      resEl.innerHTML=_fmt(res)+
        '<div style="display:flex;align-items:center;gap:10px;margin-top:18px;padding-top:14px;border-top:1px solid rgba(212,175,55,.1);">'+
          '<span style="font-family:Cinzel,serif;font-size:.48rem;letter-spacing:1px;color:rgba(245,239,226,.35);">IL CONSIGLIO TI HA AIUTATO?</span>'+
          '<button onclick="swFbPos(this)" style="padding:6px 14px;border-radius:20px;border:1px solid rgba(40,200,100,.3);background:rgba(40,200,100,.1);color:#5dde8a;font-size:14px;">👍</button>'+
          '<button onclick="swFbNeg(this)" style="padding:6px 14px;border-radius:20px;border:1px solid rgba(220,80,80,.3);background:rgba(220,80,80,.1);color:#f88;font-size:14px;">👎</button>'+
        '</div>'+
        (!isElite
          ? '<div style="margin-top:16px;padding:12px 14px;background:rgba(212,175,55,.06);border:1px solid rgba(212,175,55,.18);border-radius:8px;text-align:center;">'+
              '<div style="font-family:Cinzel,serif;font-size:.52rem;letter-spacing:2px;color:#D4AF37;margin-bottom:6px;">✦ VUOI DI PIÙ?</div>'+
              '<div style="font-family:\'Cormorant Garamond\',serif;font-size:.92rem;color:rgba(245,239,226,.65);margin-bottom:10px;">'+
                'I Membri Elite ricevono descrizioni poetiche complete, abbinamenti storici e il rituale del servizio. €2.99/mese.'+
              '</div>'+
              '<button onclick="window.showPaywallPopup&&window.showPaywallPopup()" style="padding:8px 18px;background:rgba(212,175,55,.16);border:1.5px solid rgba(212,175,55,.35);border-radius:6px;color:#D4AF37;font-family:Cinzel,serif;font-size:.52rem;letter-spacing:2px;cursor:pointer;">DIVENTA ELITE ✦</button>'+
            '</div>'
          : '')+
        '</div>';
      resEl.style.display='block';
      resEl.scrollIntoView({behavior:'smooth',block:'nearest'});
      var m=res.match(/([A-Z][^\n*]{5,50}(?:DOCG?|AOC|Riserva|Grand Cru|Vintage|AVA)[^\n*]{0,35})/);
      if(m) window.TasteEngine.recordWine(m[1]);
      window.TasteEngine.renderBadge();
    }
  }catch(e){
    if(loadEl)loadEl.style.display='none';
    if(resEl){
      resEl.innerHTML='<p style="color:#f88;line-height:1.8;font-family:\'Cormorant Garamond\',serif;font-size:1rem;">⚠ '+e.message+'</p>'+
        '<p style="margin-top:12px;"><button onclick="doAbbinamento()" style="padding:9px 18px;background:rgba(212,175,55,.14);border:1px solid rgba(212,175,55,.36);border-radius:6px;color:#D4AF37;font-family:Cinzel,serif;font-size:.54rem;letter-spacing:1px;">↻ Riprova</button></p>';
      resEl.style.display='block';
    }
  }
};

// ═══════════════════════════════════════════════════════════
// RICERCA VINO — in cima alla pagina Sommelier
// Il div #wineSearchInput è statico nell'HTML
// ═══════════════════════════════════════════════════════════
window.searchWine=async function(){
  /* ── PAYWALL: la ricerca conta come consultazione ── */
  if(typeof window.checkConsultazioneLibera==='function'){
    if(!window.checkConsultazioneLibera()) return;
  }

  var query=((document.getElementById('wineSearchInput')||{}).value||'').trim();
  if(!query) return;
  var isElite=typeof window.isEliteUser==='function'?window.isEliteUser():false;

  var loadEl=document.getElementById('wineSearchLoad');
  var resEl =document.getElementById('wineSearchResult');
  if(loadEl)loadEl.style.display='block';
  if(resEl) resEl.style.display='none';

  var lunghezza=isElite
    ? 'Rispondi con una scheda LUNGA e APPASSIONANTE, minimo 350 parole. Tono letterario, evocativo, da Decanter o Wine Spectator.'
    : 'Rispondi in modo CONCISO: 3-4 paragrafi essenziali su terroir, carattere, abbinamento. Massimo 150 parole. Termina invitando a scoprire la versione Elite per la scheda completa.';

  var system='RISPONDI ESCLUSIVAMENTE IN ITALIANO.\n\n'+
    'Sei un enologo narratore, storico del vino e sommelier di fama internazionale.\n'+
    lunghezza+'\n\n'+
    '━━━ STRUTTURA ━━━\n'+
    '🌍 IL TERROIR — dove nasce, suolo, clima, altitudine (narrativo, non tecnico).\n'+
    '📜 LA STORIA — origini, momenti storici, personaggi leggendari, aneddoto sorprendente.\n'+
    '🍷 NEL CALICE — colore, profumi, struttura al palato, finale, longevità (linguaggio poetico).\n'+
    '🍽 ABBINAMENTI — uno classico e uno inaspettato.\n'+
    '✦ IL DETTAGLIO RARO — una curiosità che quasi nessuno conosce.\n\n'+
    'Paragrafi fluenti. Mai liste di punti. Come scrivere un racconto sul vino.';

  try{
    var res=await window.callAPI(system,'Dimmi tutto su: '+query,'it');
    if(loadEl)loadEl.style.display='none';
    if(resEl){
      resEl.innerHTML=
        '<div style="font-family:Cinzel,serif;font-size:.62rem;letter-spacing:3px;color:#D4AF37;margin-bottom:16px;">✦ '+query.toUpperCase()+'</div>'+
        _fmt(res)+
        (!isElite
          ? '<div style="margin-top:18px;padding:10px 14px;background:rgba(212,175,55,.06);border:1px solid rgba(212,175,55,.15);border-radius:6px;text-align:center;font-family:\'IM Fell English\',serif;font-style:italic;font-size:.88rem;color:rgba(245,239,226,.5);">'+
              'Sei curioso di saperne di più? I Membri Elite ricevono la scheda enciclopedica completa. '+
              '<span onclick="window.showPaywallPopup&&window.showPaywallPopup()" style="color:#D4AF37;cursor:pointer;text-decoration:underline;font-style:normal;">Diventa Elite →</span>'+
            '</div>'
          : '');
      resEl.style.display='block';
      resEl.scrollIntoView({behavior:'smooth',block:'nearest'});
    }
  }catch(e){
    if(loadEl)loadEl.style.display='none';
    if(resEl){
      resEl.innerHTML='<p style="color:#f88;font-family:\'Cormorant Garamond\',serif;">⚠ '+e.message+'</p>';
      resEl.style.display='block';
    }
  }
};

window.searchWineWorldwide=window.searchWine;

// ═══════════════════════════════════════════════════════════
// PRODUTTORI B2B — Pacchetti Basic / Premium / Elite
// "Porta il tuo vino" RIMOSSO
// ═══════════════════════════════════════════════════════════
var _PKGS = {
  basic:   {label:'BASIC',   emoji:'🍷', prezzo:'€19/mese', importo:19,
            features:'1 vino · Profilo cantina · Contatti'},
  premium: {label:'PREMIUM', emoji:'⭐', prezzo:'€49/mese', importo:49,
            features:'5 vini · Galleria fotografica · Link sito web · Badge Premium'},
  elite:   {label:'ELITE',   emoji:'👑', prezzo:'€99/mese', importo:99,
            features:'Vini illimitati · Scheda AI · Priorità assoluta · Statistiche · Badge Eccellenza · Citazioni prioritarie AI'},
};

window._selectedPkg=null;

window.selectPkg=function(pkg){
  window._selectedPkg=pkg;
  Object.keys(_PKGS).forEach(function(p){
    var el=document.getElementById('pkg_'+p)||document.getElementById('som_pkg_'+p);
    if(!el) return;
    var sel=(p===pkg);
    el.style.opacity   =sel?'1':'0.5';
    el.style.transform =sel?'scale(1.02)':'scale(1)';
    el.style.boxShadow =sel?'0 8px 32px rgba(0,0,0,.6)':'none';
    el.style.borderColor=sel?(p==='elite'?'#D4AF37':'rgba(212,175,55,.45)'):'rgba(212,175,55,.15)';
  });
  var badge=document.getElementById('prodFormBadge');
  if(badge){
    var info=_PKGS[pkg];
    badge.textContent=info.emoji+' '+info.label+' — '+info.prezzo;
    badge.style.background=pkg==='elite'?'rgba(212,175,55,.22)':'rgba(212,175,55,.1)';
    badge.style.borderColor=pkg==='elite'?'rgba(212,175,55,.6)':'rgba(212,175,55,.3)';
  }
  var form=document.getElementById('prodForm');
  if(form){
    form.style.display='block';
    setTimeout(function(){form.scrollIntoView({behavior:'smooth',block:'nearest'});},80);
  }
};

window.submitProd=async function(){
  var nome   =((document.getElementById('prodNome')   ||{}).value||'').trim();
  var vino   =((document.getElementById('prodVino')   ||{}).value||'').trim();
  var regione=((document.getElementById('prodRegione')||{}).value||'').trim();
  var email  =((document.getElementById('prodEmail')  ||{}).value||'').trim();
  var st     =document.getElementById('prodStatus');
  if(!nome||!email){if(st){st.style.color='#f88';st.textContent='✗ Nome cantina ed email sono obbligatori.';}return;}
  if(!email.includes('@')||!email.includes('.')){if(st){st.style.color='#f88';st.textContent='✗ Inserisci un email valida.';}return;}
  var pkg=window._selectedPkg||'premium';
  var info=_PKGS[pkg];
  if(st){st.style.color='rgba(212,175,55,.5)';st.textContent='⏳ Invio in corso…';}
  var body={
    name:nome, email:email, package:pkg,
    subject:'[Sommelier World] Nuova iscrizione: '+nome+' — '+info.label+' ('+info.prezzo+')',
    message:['CANTINA: '+nome,'VINO DI PUNTA: '+(vino||'—'),'REGIONE: '+(regione||'—'),
             'PACCHETTO: '+info.label+' '+info.prezzo,'IMPORTO: €'+info.importo+'/mese',
             'FEATURES: '+info.features,'EMAIL: '+email].join('\n'),
  };
  try{
    var srv=window.SRV||window.SERVER_URL||_SRV;
    var r=await fetch(srv+'/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    var d=await r.json();
    if(r.ok||d.ok){
      if(st){st.style.cssText='color:#D4AF37;font-family:Cinzel,serif;font-size:.56rem;letter-spacing:2px;text-align:center;';st.textContent='✓ Richiesta inviata — ti contatteremo a '+email+' entro 24 ore.';}
      var flash=document.createElement('div'); flash.className='gold-flash-overlay'; document.body.appendChild(flash); setTimeout(function(){flash.remove();},2000);
      ['prodNome','prodVino','prodRegione','prodEmail'].forEach(function(id){var e=document.getElementById(id);if(e)e.value='';});
      setTimeout(function(){window._selectedPkg=null;Object.keys(_PKGS).forEach(function(p){var el=document.getElementById('pkg_'+p)||document.getElementById('som_pkg_'+p);if(el){el.style.opacity='1';el.style.transform='scale(1)';el.style.boxShadow='none';el.style.borderColor='rgba(212,175,55,.15)';}});},3000);
    }else{if(st){st.style.color='#f88';st.textContent='✗ Errore: '+(d.error||'Riprova o scrivi a info@sommelierworld.vin');}}
  }catch(e){if(st){st.style.color='#f88';st.textContent='✗ Errore di connessione: '+e.message;}}
};

// ═══════════════════════════════════════════════════════════
// TERROIR — scheda AI profonda per denominazione
// ═══════════════════════════════════════════════════════════
window._denomCache={};

window.openDenomDetail=function(id){
  var denom=(window._DENOM||[]).find(function(d){return d.id===id;});
  if(!denom) return;
  var detail=document.getElementById('expDetail');
  if(!detail) return;
  detail.style.display='block';
  var flag=(window.EFLAGS||{})[denom.country]||'🌍';
  var imgs={
    'Italia':'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=900&q=90&fit=crop',
    'Francia':'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=900&q=90&fit=crop',
    'Spagna':'https://images.unsplash.com/photo-1586370434639-0fe43b2d32e6?w=900&q=90&fit=crop',
    'Germania':'https://images.unsplash.com/photo-1563220917-916e11d39a86?w=900&q=90&fit=crop',
    'USA':'https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?w=900&q=90&fit=crop',
    'Grecia':'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=900&q=90&fit=crop',
    'default':'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=900&q=90&fit=crop',
  };
  var heroImg=imgs[denom.country]||imgs.default;
  var tc={DOCG:'#D4AF37',DOC:'rgba(212,175,55,.75)',AOC:'#a0c8ff',DOCa:'#ffb080',
          PDO:'#b0ffb0',AVA:'#ffaaaa',Prädikat:'#d0aaff',DAC:'#ffe08a',GI:'#aaddff'}[denom.type]||'rgba(212,175,55,.65)';

  var heroHtml='<div style="position:relative;height:200px;overflow:hidden;background:#0d0202;">'+
    '<img src="'+heroImg+'" style="width:100%;height:100%;object-fit:cover;display:block;" loading="eager">'+
    '<div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(10,10,10,.1),rgba(10,10,10,.72));"></div>'+
    '<div style="position:absolute;bottom:0;left:0;right:0;padding:14px 16px;">'+
      '<div style="font-family:Cinzel,serif;font-size:.44rem;letter-spacing:2px;color:rgba(212,175,55,.85);margin-bottom:4px;">'+flag+' '+denom.country+' &middot; '+denom.type+'</div>'+
      '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:1.35rem;font-weight:700;color:#fff;line-height:1.2;">'+denom.name+'</div>'+
    '</div>'+
  '</div>';

  detail.innerHTML=heroHtml+
    '<div style="position:sticky;top:102px;z-index:50;background:rgba(10,10,10,.97);border-bottom:1px solid rgba(212,175,55,.2);padding:12px 16px;display:flex;align-items:center;gap:10px;">'+
      '<button onclick="window.closeDenomDetail()" style="background:none;border:1px solid rgba(212,175,55,.3);color:#D4AF37;font-family:Cinzel,serif;font-size:.52rem;letter-spacing:2px;padding:6px 12px;">← INDIETRO</button>'+
      '<div><div style="font-family:Cinzel,serif;font-size:.7rem;letter-spacing:2px;color:#fff;">'+denom.name+'</div>'+
      '<div style="font-family:Cinzel,serif;font-size:.48rem;color:rgba(212,175,55,.5);">'+flag+' '+denom.country+' · '+denom.region+'</div></div>'+
    '</div>'+
    '<div style="padding:18px 16px;">'+
      '<span style="font-family:Cinzel,serif;font-size:.5rem;letter-spacing:2px;padding:4px 12px;background:'+tc+'1a;border:1px solid '+tc+'55;color:'+tc+';border-radius:20px;">'+denom.type+'</span>'+
      '<div style="font-family:\'Playfair Display\',serif;font-size:1.55rem;font-weight:700;color:#fff;line-height:1.2;margin:12px 0 8px;">'+denom.name+'</div>'+
      '<div style="font-family:\'IM Fell English\',serif;font-style:italic;font-size:1.05rem;color:rgba(245,239,226,.65);line-height:1.75;margin-bottom:16px;">'+denom.desc+'</div>'+
      '<div style="margin-bottom:18px;"><div style="font-family:Cinzel,serif;font-size:.5rem;letter-spacing:2px;color:rgba(212,175,55,.5);margin-bottom:8px;">VITIGNI</div>'+
      '<div style="display:flex;flex-wrap:wrap;gap:6px;">'+
      denom.grapes.split(',').map(function(g){return '<span style="font-family:Cinzel,serif;font-size:.5rem;letter-spacing:1px;padding:4px 11px;border:1px solid rgba(212,175,55,.28);color:rgba(212,175,55,.8);border-radius:2px;background:rgba(212,175,55,.06);">🍇 '+g.trim()+'</span>';}).join('')+
      '</div></div>'+
      '<div style="font-family:Cinzel,serif;font-size:.56rem;letter-spacing:3px;color:rgba(212,175,55,.7);margin-bottom:12px;">📖 SCHEDA ENCICLOPEDICA</div>'+
      '<div id="denomSchedaContent" style="font-family:\'IM Fell English\',serif;font-style:italic;font-size:.9rem;color:rgba(212,175,55,.4);">'+(window._denomCache[id]||'Caricamento scheda approfondita…')+'</div>'+
    '</div>';

  detail.scrollIntoView({behavior:'smooth',block:'start'});
  if(!window._denomCache[id]) window._loadDenomScheda(denom);
};

window.closeDenomDetail=function(){var d=document.getElementById('expDetail');if(d)d.style.display='none';};

window._loadDenomScheda=async function(denom){
  var cont=document.getElementById('denomSchedaContent');
  if(!cont) return;
  var system='RISPONDI ESCLUSIVAMENTE IN ITALIANO.\n\n'+
    'Sei un enologo narratore, ampelografo e storico del vino. '+
    'Scrivi una scheda enciclopedica LUNGA e APPASSIONANTE. Minimo 500 parole. '+
    'Tono letterario, poetico e preciso. Paragrafi fluenti, mai liste di punti.\n\n'+
    '📜 STORIA E ORIGINI — secoli, famiglie, monasteri, momenti storici.\n'+
    '🌍 IL TERROIR — suolo, clima, altitudine, come si traduce nel vino.\n'+
    '🍇 I VITIGNI — perché si adattano perfettamente a questo luogo.\n'+
    '🍷 NEL CALICE — colore, profumi, struttura, finale, longevità. Descrizione evocativa.\n'+
    '🏡 PRODUTTORI DI RIFERIMENTO — almeno 4 produttori iconici.\n'+
    '🍽 ABBINAMENTI — 3 classici e 1 inaspettato.\n'+
    '✦ LA CURIOSITÀ RARA — un fatto che quasi nessuno conosce.';
  try{
    var text=await window.callAPI(system,'Scheda completa per: '+denom.name+' ('+denom.country+', '+denom.region+')\nVitigni: '+denom.grapes+'\nDescrizione: '+denom.desc,'it');
    var html=text.replace(/\*\*([^*]+)\*\*/g,'<strong style="color:#F5EFE2;font-style:normal;">$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>')
      .split(/\n\n+/).map(function(p){return '<p style="font-family:\'Cormorant Garamond\',serif;font-size:1.02rem;line-height:1.92;color:rgba(245,239,226,.85);margin-bottom:16px;font-style:normal;">'+p.replace(/\n/g,'<br>')+'</p>';}).join('');
    window._denomCache[denom.id]=html;
    if(cont)cont.innerHTML=html;
  }catch(e){
    if(cont)cont.innerHTML='<p style="font-family:\'Cormorant Garamond\',serif;font-size:.95rem;line-height:1.85;color:rgba(245,239,226,.55);font-style:normal;">'+denom.desc+'</p>'+
      '<p style="font-family:\'IM Fell English\',serif;font-style:italic;font-size:.85rem;color:rgba(212,175,55,.35);margin-top:10px;">Scheda approfondita non disponibile. Riprova tra 30 secondi.</p>';
  }
};

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded',function(){
  window.TasteEngine.renderBadge();
  // Carica produttori Elite per priorità AI
  window._loadEliteProducers();
});
