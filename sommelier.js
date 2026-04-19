/**
 * SOMMELIER WORLD — sommelier.js
 * Logica abbinamento AIS, TasteEngine, geografia
 */

// ── REGIONI DEL MONDO ──
window.REGIONI = {
  'Italia':['Piemonte','Toscana','Veneto','Sicilia','Campania','Friuli','Alto Adige','Sardegna','Umbria','Marche','Lombardia','Abruzzo','Puglia','Trentino','Lazio'],
  'Francia':['Borgogna','Bordeaux','Rodano','Alsazia','Champagne','Loira','Languedoc','Provenza','Beaujolais'],
  'Spagna':['Rioja','Ribera del Duero','Priorat','Rias Baixas','Jerez','Penedes'],
  'USA':['Napa Valley','Sonoma','Willamette Valley','Paso Robles','Santa Barbara','Finger Lakes'],
  'Germania':['Mosel','Rheingau','Pfalz','Baden','Rheinhessen','Nahe','Franken'],
  'Portogallo':['Douro','Alentejo','Vinho Verde','Dao','Bairrada'],
  'Argentina':['Mendoza','Salta','Patagonia','Uco Valley'],
  'Cile':['Maipo','Colchagua','Casablanca','Elqui'],
  'Australia':['Barossa Valley','McLaren Vale','Clare Valley','Yarra Valley','Margaret River'],
  'Nuova Zelanda':['Marlborough','Central Otago'],
  'Grecia':['Santorini','Naoussa','Nemea','Creta'],
  'Austria':['Wachau','Kamptal','Kremstal','Burgenland'],
  'Ungheria':['Tokaj','Eger','Villany'],
  'Georgia':['Kakheti','Kartli','Imereti'],
  'Sud Africa':['Stellenbosch','Swartland','Franschhoek'],
};

window.updateRegioni = function(){
  var paese = (document.getElementById('winePaese')||{}).value||'';
  var sel = document.getElementById('wineRegione');
  if(!sel) return;
  sel.innerHTML = '<option value="">Qualsiasi regione</option>';
  (REGIONI[paese]||[]).forEach(function(r){
    var o = document.createElement('option'); o.value=r; o.textContent=r; sel.appendChild(o);
  });
  sel.disabled = !paese;
};

// Popola select paese
document.addEventListener('DOMContentLoaded', function(){
  var sel = document.getElementById('winePaese');
  if(!sel) return;
  Object.keys(REGIONI).forEach(function(p){
    var o = document.createElement('option'); o.value=p; o.textContent=p; sel.appendChild(o);
  });
  sel.onchange = updateRegioni;
});

// ── SLIDER ──
window.updateSlider = function(id, labels, val){
  var lbl = document.getElementById(id+'Lbl');
  if(lbl) lbl.textContent = labels[parseInt(val)-1] || 'Media';
};

window.getWineParams = function(){
  var aciditaL = ['Bassa','Medio-bassa','Media','Medio-alta','Alta'];
  var morbidL  = ['Secco-tannico','Poco morbido','Equilibrato','Morbido','Molto morbido'];
  var struttL  = ['Leggero','Medio-leggero','Medio','Medio-pieno','Pieno e concentrato'];
  function getL(id,labels){ var e=document.getElementById(id); return e?labels[parseInt(e.value)-1]:labels[2]; }
  return {
    acidita:   getL('acidita',   aciditaL),
    morbidezza:getL('morbidezza',morbidL),
    struttura: getL('struttura', struttL),
    paese:(document.getElementById('winePaese')||{}).value||'',
    regione:(document.getElementById('wineRegione')||{}).value||'',
  };
};

// ── TASTE ENGINE ──
window.TasteEngine = (function(){
  var KEY = 'sw_taste_v1';
  var DEF = {sessions:0,paese:{},budget:[],stileGusto:{},feedback:{pos:0,neg:0},ultimiVini:[],lifestyle:{}};
  function load(){ try{ var r=localStorage.getItem(KEY); return r?Object.assign({},DEF,JSON.parse(r)):Object.assign({},DEF); }catch(e){return Object.assign({},DEF);} }
  function save(p){ try{localStorage.setItem(KEY,JSON.stringify(p));}catch(e){} }
  function inc(obj,k){ if(k) obj[k]=(obj[k]||0)+1; }
  return {
    recordSession:function(opts){
      var p=load(); p.sessions++;
      if(opts.paese) inc(p.paese,opts.paese);
      if(opts.budget){ p.budget.push(Number(opts.budget)); if(p.budget.length>5)p.budget.shift(); }
      save(p);
    },
    recordWine:function(name){
      if(!name) return; var p=load();
      p.ultimiVini.unshift(name.substring(0,60));
      if(p.ultimiVini.length>5) p.ultimiVini.pop();
      save(p);
    },
    recordFeedback:function(positive){
      var p=load();
      if(positive) p.feedback.pos=(p.feedback.pos||0)+1;
      else p.feedback.neg=(p.feedback.neg||0)+1;
      save(p);
    },
    buildPromptContext:function(){
      var p=load(); if(p.sessions<1) return '';
      var lines=['═══ PROFILO GUSTO (memoria personale) ═══'];
      lines.push('Sessioni: '+p.sessions);
      var topP=Object.entries(p.paese||{}).sort(function(a,b){return b[1]-a[1];})[0];
      if(topP) lines.push('Paese preferito: '+topP[0]);
      if(p.budget&&p.budget.length) lines.push('Budget medio: €'+Math.round(p.budget.reduce(function(a,b){return a+b;},0)/p.budget.length));
      if(p.ultimiVini&&p.ultimiVini.length) lines.push('Vini già consigliati: '+p.ultimiVini.join(', '));
      lines.push('═══════════════════════════════════════════');
      return '\n\n'+lines.join('\n');
    },
  };
})();

// ── CHIAMATA API ──
window.callAPI = async function(system, userMsg, langue, budget){
  try{
    var ctrl = new AbortController();
    setTimeout(function(){ ctrl.abort(); }, 30000);
    var r = await fetch(SRV+'/api/groq', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        system: system,
        userMsg: userMsg,
        language: langue || getLang(),
        maxTokens: 1600,
      }),
      signal: ctrl.signal,
    });
    var d = await r.json();
    if(r.ok && d.text) return d.text;
    throw new Error(d.error||'Errore server');
  }catch(e){
    if(e.name==='AbortError') throw new Error('Il server sta impiegando troppo tempo. Riprova.');
    throw e;
  }
};

// ── ABBINAMENTO SOMMELIER AIS ──
window.doAbbinamento = async function(){
  var menu = (document.getElementById('menuText')||{}).value||'';
  if(!menu.trim()){ alert('Inserisci il menu.'); return; }
  var budget = (document.getElementById('budget')||{}).value||'80';
  var params = getWineParams();
  var lang = getLang();
  var tasteCtx = TasteEngine.buildPromptContext();

  TasteEngine.recordSession({paese: params.paese, budget: budget});

  var langCmd = {
    it:'Rispondi SEMPRE e SOLO in italiano.',
    en:'Reply ALWAYS and ONLY in English.',
    fr:'Réponds TOUJOURS et UNIQUEMENT en français.'
  }[lang]||'Rispondi in italiano.';

  var vincolo = '';
  if(params.paese && params.paese !== ''){
    var esempiMap = {
      'Germania':'Riesling Mosel (Egon Muller, JJ Prum), Spatburgunder Ahr (Meyer-Nakel)',
      'Francia':'Bourgogne Pinot Noir, Chablis, Champagne, Chateauneuf-du-Pape',
      'Spagna':'Rioja Tempranillo (Muga, CVNE), Ribera del Duero, Albarino Rias Baixas',
      'USA':'Napa Cabernet Sauvignon (Opus One), Willamette Pinot Noir',
      'Grecia':'Assyrtiko Santorini (Gaia, Hatzidakis), Xinomavro Naoussa',
      'Portogallo':'Douro Touriga Nacional (Niepoort, Ramos Pinto), Alentejo',
      'Argentina':'Mendoza Malbec (Catena Zapata, Achaval Ferrer), Salta Torrontes',
      'Australia':'Barossa Shiraz (Penfolds Grange, Henschke), Clare Valley Riesling',
    };
    vincolo = '\n\n'+'█'.repeat(42)+'\nVINCOLO GEOGRAFICO ASSOLUTO\n'+'█'.repeat(42)+'\n'+
      'PAESE: "'+params.paese+'"'+(params.regione?'\nREGIONE: "'+params.regione+'"':'')+'\n'+
      'OBBLIGATORIO: consiglia SOLO vini di '+params.paese+'\n'+
      'VIETATO: qualsiasi vino di altri paesi\n'+
      'Esempi: '+(esempiMap[params.paese]||'vini tipici di '+params.paese)+'\n'+
      '█'.repeat(42);
  }

  var system = langCmd+'\n\n'+
    'Sei un Master Sommelier AIS diplomato con 20 anni di esperienza internazionale. '+
    'Parli come un amico esperto che conosce il cliente — caldo, preciso, mai pomposo.\n\n'+

    '═══ METODOLOGIA AIS — 6 PARAMETRI DEL PIATTO ═══\n'+
    'Prima di rispondere analizza: TENDENZA DOLCE, GRASSEZZA, SAPIDITÀ, TENDENZA ACIDA, SUCCULENZA, UNTUOSITÀ.\n\n'+

    '═══ REGOLE CHIMICHE INVIOLABILI ═══\n'+
    '🔴 TANNINO + PESCE = VIETATO (sapore metallico). Unica eccezione: Pinot Nero giovane o Schiava se richiesto esplicitamente.\n'+
    '🔴 PIATTO GRASSO → acidità o bollicine obbligatorie per pulire il palato (Chablis, Champagne, Vermentino).\n'+
    '🔴 CARNE ROSSA SUCCULENTA → tannino + alcol per asciugare (Barolo, Brunello, Cabernet).\n'+
    '🔴 DESSERT → SOLO vino dolce (Sauternes, TBA, Recioto, Moscato). Mai vino secco.\n'+
    '🔴 SPEZIATO → vino morbido e fruttato, basso alcol (Riesling Kabinett, Gewurztraminer).\n\n'+

    '═══ STRUTTURA RISPOSTA OBBLIGATORIA ═══\n'+
    '① ANALISI AIS del piatto (1-2 frasi)\n'+
    '② VINO CONSIGLIATO: Produttore + Denominazione + Vitigno + Annata + Perché (chimica) + Sensazioni + Prezzo\n'+
    '③ ALTERNATIVA ECONOMICA (sotto €20)\n'+
    '④ TEMPERATURA e servizio (gradi esatti, decanter sì/no)\n'+
    '⑤ IL SEGRETO DEL SOMMELIER: fatto sorprendente\n\n'+

    (params.paese ? '🔴 VINCOLO ASSOLUTO: SOLO vini di '+params.paese+(params.regione?'/'+params.regione:'')+'. Zero deroghe.\n' : '')+
    'Profilo organolettico desiderato: Acidità '+params.acidita+', Morbidezza '+params.morbidezza+', Struttura '+params.struttura+'.';

  var userMsg = 'Menu:\n'+menu+'\nBudget massimo: €'+budget+vincolo+tasteCtx;

  var loadEl = document.getElementById('somLoad');
  var resEl  = document.getElementById('somResult');
  if(loadEl) loadEl.style.display = 'block';
  if(resEl)  resEl.style.display  = 'none';

  try{
    var res = await callAPI(system, userMsg, lang, budget);
    if(loadEl) loadEl.style.display='none';
    if(resEl){
      resEl.innerHTML =
        res.split('\n').map(function(line){
          line = line.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
          line = line.replace(/\*([^*]+)\*/g,'<em>$1</em>');
          return line||'<br>';
        }).join('<br>');

      // Feedback
      resEl.innerHTML +=
        '<div style="display:flex;align-items:center;gap:10px;margin-top:18px;padding-top:14px;border-top:1px solid rgba(191,155,74,.1);">'+
        '<span style="font-size:11px;color:rgba(245,239,226,.4);font-family:Cinzel,serif;letter-spacing:1px;">IL CONSIGLIO TI HA AIUTATO?</span>'+
        '<button onclick="swFbPos(this)" style="padding:6px 14px;border-radius:20px;border:1px solid rgba(125,218,138,.3);background:rgba(125,218,138,.1);color:#7dda8a;cursor:pointer;">👍</button>'+
        '<button onclick="swFbNeg(this)" style="padding:6px 14px;border-radius:20px;border:1px solid rgba(255,150,100,.3);background:rgba(255,100,100,.1);color:#f99;cursor:pointer;">👎</button>'+
        '</div>';

      resEl.style.display='block';
      var m = res.match(/\*{0,2}([A-Z][^*\n]{5,50}(?:DOC|DOCG|AOC|Riserva|Superiore|Grand Cru)[^*\n]{0,30})\*{0,2}/);
      if(m) TasteEngine.recordWine(m[1]);
    }
  }catch(e){
    if(loadEl) loadEl.style.display='none';
    if(resEl){
      resEl.innerHTML='<p style="color:#f99;">⚠ '+e.message+'</p>'+
        '<p style="margin-top:10px;"><button onclick="doAbbinamento()" style="padding:8px 16px;background:rgba(191,155,74,.2);border:1px solid rgba(191,155,74,.4);border-radius:6px;color:#BF9B4A;font-family:Cinzel,serif;font-size:.55rem;cursor:pointer;">↻ Riprova</button></p>';
      resEl.style.display='block';
    }
  }
};

window.swFbPos = function(btn){
  TasteEngine.recordFeedback(true);
  if(btn&&btn.parentNode) btn.parentNode.innerHTML='<span style="color:#7dda8a;">✓ Grazie per il feedback!</span>';
};
window.swFbNeg = function(btn){
  TasteEngine.recordFeedback(false);
  if(btn&&btn.parentNode) btn.parentNode.innerHTML='<span style="color:#BF9B4A;">✓ Terremo conto del feedback.</span>';
};

// ── TERROIR PAESI ──
window.renderExploreCountries = function(){
  var cont = document.getElementById('expCountries');
  if(!cont||cont.dataset.loaded) return;
  cont.dataset.loaded = '1';
  cont.innerHTML = '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;">'+
    Object.keys(REGIONI).map(function(p){
      return '<button onclick="alert(\''+p+'\')" style="padding:8px 14px;background:rgba(191,155,74,.1);border:1px solid rgba(191,155,74,.2);border-radius:6px;color:#BF9B4A;font-family:Cinzel,serif;font-size:.56rem;letter-spacing:1px;cursor:pointer;">'+p+'</button>';
    }).join('')+
  '</div>';
};

// ── PRODUTTORI ──
window._selectedPkg = 'premium';

window.selectPkg = function(pkg){
  window._selectedPkg = pkg;
  ['basic','premium','elite'].forEach(function(p){
    var el = document.getElementById('pkg_'+p);
    if(!el) return;
    el.style.opacity = p===pkg ? '1' : '0.5';
    el.style.transform = p===pkg ? 'scale(1.03)' : 'scale(1)';
  });
  document.getElementById('prodForm').style.display = 'block';
  document.getElementById('prodForm').scrollIntoView({behavior:'smooth',block:'nearest'});
};

window.submitProd = async function(){
  var nome   = (document.getElementById('prodNome')||{}).value||'';
  var vino   = (document.getElementById('prodVino')||{}).value||'';
  var email  = (document.getElementById('prodEmail')||{}).value||'';
  var st     = document.getElementById('prodStatus');
  if(!nome.trim()||!email.trim()){ if(st){st.style.color='#f99';st.textContent='Nome cantina ed email obbligatori.';} return; }
  if(st){ st.style.color='rgba(245,239,226,.4)'; st.textContent='Invio in corso…'; }
  var pkg   = window._selectedPkg || 'premium';
  var prezzi = {basic:'€19/mese',premium:'€49/mese',elite:'€99/mese'};
  var body = {
    name: nome, email: email,
    subject: 'Nuova iscrizione produttore: '+nome+' ('+pkg+')',
    message: 'Cantina: '+nome+' | Vino: '+vino+' | Pacchetto: '+pkg+' '+prezzi[pkg]+' | Email: '+email
  };
  try{
    var r = await fetch(SRV+'/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    var d = await r.json();
    if(r.ok||d.ok){
      if(st){st.style.color='#7dda8a';st.textContent='✓ Richiesta inviata! Ti contatteremo entro 24 ore.';}
      document.getElementById('prodNome').value='';
      document.getElementById('prodVino').value='';
      document.getElementById('prodEmail').value='';
    } else { if(st){st.style.color='#f99';st.textContent='Errore invio. Scrivi a info@sommelierworld.vin';} }
  }catch(e){ if(st){st.style.color='#f99';st.textContent='Errore: '+e.message;} }
};
