/**
 * SOMMELIER WORLD — sw-patch-v23.js
 * Design premium: WINE NEWS slideshow, articoli culturali, immagini certificate vino
 * Sommelier: paese OBBLIGATORIO nel prompt
 */
console.log('=== SW PATCH V23 ATTIVA ===');

(function(){
'use strict';

var SRV = 'https://sommelier-server-production-8f92.up.railway.app';

/* ═══════════════════════════════════════════
   IMMAGINI — 100% verificate wine/vineyard
   Fonte: Unsplash photo IDs confermati
   ═══════════════════════════════════════════ */
var W = {
  // Bottiglie e vino
  bottles:  'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=700&q=85&fit=crop',
  glass:    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=85&fit=crop',
  glass2:   'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=700&q=85&fit=crop',
  // Vigne e paesaggi
  vineyard: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=700&q=85&fit=crop',
  vineyard2:'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=700&q=85&fit=crop',
  vineyard3:'https://images.unsplash.com/photo-1567529684892-09290a1b2d05?w=700&q=85&fit=crop',
  // Cantina e produzione
  cellar:   'https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?w=700&q=85&fit=crop',
  winery:   'https://images.unsplash.com/photo-1586370434639-0fe43b2d32e6?w=700&q=85&fit=crop',
};

var IMGS = [W.bottles, W.vineyard, W.glass, W.cellar, W.vineyard2, W.glass2, W.vineyard3, W.winery];

/* ═══════════════════════════════════════════
   CSS MINIMO — non sovrascrive stili esistenti
   ═══════════════════════════════════════════ */
(function(){
  var s = document.createElement('style');
  s.textContent = [
    /* Nasconde completamente il div Gazzetta nell'hero se rimasto */
    '#heroSection [style*="Gazzetta"]{display:none!important}',
    /* WINE NEWS label */
    '#sw23-news-hd{display:flex;align-items:center;justify-content:space-between;padding:11px 14px 8px;background:#0A0705;}',
    '#sw23-news-lbl{font-family:Cinzel,serif;font-size:.6rem;letter-spacing:4px;color:var(--oro,#BF9B4A);display:flex;align-items:center;gap:8px;}',
    '#sw23-cnt{font-size:10px;color:rgba(245,239,226,.3);}',
    /* Slideshow */
    '#sw23-slide-area{position:relative;height:235px;overflow:hidden;background:#0A0705;}',
    '.sw23-slide{position:absolute;inset:0;display:flex;opacity:0;transition:opacity .7s ease;cursor:pointer;}',
    '.sw23-slide.on{opacity:1;z-index:1;}',
    '.sw23-slide-img-col{flex:0 0 38%;position:relative;overflow:hidden;}',
    '.sw23-slide-img-col img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}',
    '.sw23-slide-img-col .sw23-ph{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;}',
    '.sw23-slide-txt{flex:1;padding:16px 14px;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;}',
    '.sw23-slide-cat{font-size:8px;font-weight:700;letter-spacing:2px;color:rgba(191,155,74,.5);text-transform:uppercase;margin-bottom:6px;}',
    '.sw23-slide-tit{font-family:"Playfair Display",Georgia,serif;font-size:1.06rem;font-weight:700;color:#F5EFE2;line-height:1.32;flex:1;}',
    '.sw23-slide-sum{font-family:"Cormorant Garamond",Georgia,serif;font-size:.87rem;color:rgba(245,239,226,.48);line-height:1.6;margin-top:8px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;}',
    '.sw23-slide-meta{font-size:9px;color:rgba(245,239,226,.27);margin-top:8px;}',
    '#sw23-dots{display:flex;justify-content:center;gap:6px;padding:8px 0;background:#0A0705;border-bottom:1px solid rgba(191,155,74,.08);}',
    '.sw23-pg{width:5px;height:5px;border-radius:50%;background:rgba(191,155,74,.15);cursor:pointer;transition:background .25s;}',
    '.sw23-pg.on{background:rgba(191,155,74,.7);}',
    /* Articoli culturali */
    '#sw23-sapere{background:#0A0705;border-top:1px solid rgba(191,155,74,.08);}',
    '#sw23-sapere-hd{display:flex;align-items:center;gap:8px;padding:14px 14px 10px;}',
    '.sw23-art{background:rgba(10,4,2,.98);border:1px solid rgba(191,155,74,.1);border-radius:10px;margin:0 14px 14px;cursor:pointer;overflow:hidden;transition:transform .2s,box-shadow .2s;}',
    '.sw23-art:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.55);}',
    '.sw23-art-img{width:100%;height:155px;object-fit:cover;display:block;}',
    '.sw23-art-img-ph{width:100%;height:155px;display:flex;align-items:center;justify-content:center;font-size:3rem;}',
    '.sw23-art-body{padding:16px 16px 18px;}',
    '.sw23-art-tag{font-size:8px;font-weight:700;letter-spacing:2px;color:rgba(191,155,74,.48);text-transform:uppercase;margin-bottom:8px;}',
    /* Titolo grande e leggibile */
    '.sw23-art-tit{font-family:"Playfair Display","IM Fell English",Georgia,serif;font-size:1.18rem;font-weight:700;color:#F5EFE2;line-height:1.32;margin-bottom:10px;}',
    /* Corpo articolo — alta leggibilità */
    '.sw23-art-txt{font-family:"Cormorant Garamond",Georgia,serif;font-size:1.02rem;line-height:1.9;color:rgba(245,240,232,.72);letter-spacing:.01em;}',
    '.sw23-art-foot{font-size:10px;color:rgba(245,239,226,.22);margin-top:12px;padding-top:10px;border-top:1px solid rgba(191,155,74,.06);}',
    /* Curiosità carosello */
    '#sw23-cur{background:#0A0705;border-top:1px solid rgba(191,155,74,.06);}',
    '#sw23-cur-s{display:flex;gap:10px;overflow-x:auto;padding:0 14px 14px;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;}',
    '#sw23-cur-s::-webkit-scrollbar{display:none}',
    '.sw23-cc{flex:0 0 200px;min-width:200px;scroll-snap-align:start;border-radius:8px;overflow:hidden;cursor:pointer;border:1px solid rgba(191,155,74,.1);transition:transform .2s;}',
    '.sw23-cc:hover{transform:translateY(-2px);}',
    '.sw23-cc-b{padding:12px;}',
    /* Reader */
    '#sw23-reader{display:none;position:fixed;inset:0;z-index:999950;background:#0A0705;overflow-y:auto;-webkit-overflow-scrolling:touch;}',
    /* Contatti */
    '#sw23-cp{display:none;position:fixed;inset:0;z-index:999900;background:#0A0705;overflow-y:auto;}',
    '.sw23-fi{width:100%;box-sizing:border-box;padding:11px 13px;background:rgba(255,255,255,.05);border:1px solid rgba(191,155,74,.2);border-radius:8px;color:#F5EFE2;font-family:Lato,sans-serif;font-size:15px;outline:none;display:block;}',
    '.sw23-fi:focus{border-color:rgba(191,155,74,.45);}',
    '.sw23-fl{display:block;font-size:9px;font-weight:700;letter-spacing:2px;color:rgba(191,155,74,.48);text-transform:uppercase;margin-bottom:5px;}',
    '.sw23-fb{width:100%;padding:13px;background:rgba(191,155,74,.16);border:1.5px solid rgba(191,155,74,.36);border-radius:8px;color:#BF9B4A;font-family:Cinzel,serif;font-size:.58rem;font-weight:700;letter-spacing:3px;cursor:pointer;}',
    '.sw23-fb:hover{background:rgba(191,155,74,.26);}',
    /* FAB */
    '#sw23-fab{position:fixed!important;bottom:20px!important;right:20px!important;z-index:99999!important;width:46px!important;height:46px!important;border-radius:50%!important;background:rgba(191,155,74,.16)!important;border:1.5px solid rgba(191,155,74,.32)!important;display:flex!important;align-items:center!important;justify-content:center!important;cursor:pointer!important;font-size:1.2rem!important;box-shadow:0 4px 14px rgba(0,0,0,.45)!important;transition:background .2s!important;}',
    '#sw23-fab:hover{background:rgba(191,155,74,.3)!important;}',
  ].join('');
  document.head.appendChild(s);
})();

/* ═══════════════════════════════════════════
   GRADIENTI SCURI PREMIUM
   ═══════════════════════════════════════════ */
var BG = [
  'linear-gradient(135deg,#1a0305,#0d0202)',
  'linear-gradient(135deg,#020614,#010309)',
  'linear-gradient(135deg,#020e06,#010603)',
  'linear-gradient(135deg,#100a02,#080502)',
  'linear-gradient(135deg,#08020e,#040108)',
];

/* ═══════════════════════════════════════════
   STATO
   ═══════════════════════════════════════════ */
var _arts = [];
var _sIdx = 0;
var _sTimer = null;
var _readerOpen = false;
var _3cache = {day:-1};

/* ═══════════════════════════════════════════
   REGIONI per sommelier
   ═══════════════════════════════════════════ */
var REGIONI = {
  'Italia':['Piemonte','Toscana','Veneto','Sicilia','Campania','Friuli-Venezia Giulia','Alto Adige','Sardegna','Umbria','Marche','Lombardia','Abruzzo','Puglia','Trentino','Lazio'],
  'Francia':['Borgogna','Bordeaux','Rodano','Alsazia','Champagne','Loira','Languedoc','Provenza','Beaujolais','Jura'],
  'Spagna':['Rioja','Ribera del Duero','Priorat','Rías Baixas','Jerez','Toro','Penedès','Bierzo','Navarra','Rueda'],
  'USA':['Napa Valley','Sonoma','Willamette Valley','Paso Robles','Santa Barbara','Columbia Valley','Finger Lakes'],
  'Germania':['Mosel','Rheingau','Pfalz','Baden','Rheinhessen','Nahe','Franken','Württemberg','Ahr'],
  'Portogallo':['Douro','Alentejo','Vinho Verde','Dão','Bairrada','Lisboa','Madeira'],
  'Argentina':['Mendoza','Salta','Patagonia','La Rioja','San Juan','Uco Valley'],
  'Cile':['Maipo','Colchagua','Casablanca','Elqui','Bío-Bío','Leyda'],
  'Australia':['Barossa Valley','McLaren Vale','Clare Valley','Yarra Valley','Hunter Valley','Margaret River'],
  'Nuova Zelanda':['Marlborough','Central Otago','Hawke\'s Bay','Martinborough'],
  'Grecia':['Santorini','Naoussa','Nemea','Creta','Samos'],
  'Austria':['Wachau','Kamptal','Kremstal','Burgenland','Steiermark'],
  'Ungheria':['Tokaj','Eger','Villány','Szekszárd'],
  'Georgia':['Kakheti','Kartli','Imereti'],
  'Sud Africa':['Stellenbosch','Swartland','Franschhoek','Walker Bay','Constantia'],
};

var ESEMPI_VINI = {
  'Germania':'Riesling Spätlese del Mosel (Egon Müller, JJ Prüm), Spätburgunder dell\'Ahr (Meyer-Näkel), Silvaner del Franken',
  'Francia':'Bourgogne Pinot Noir, Chablis, Champagne, Châteauneuf-du-Pape, Sancerre Sauvignon Blanc',
  'Spagna':'Rioja Tempranillo, Ribera del Duero Tinto Fino, Albariño Rías Baixas, Priorat Garnacha',
  'USA':'Napa Cabernet Sauvignon, Willamette Pinot Noir, Finger Lakes Riesling',
  'Austria':'Grüner Veltliner Wachau, Riesling Kamptal, Blaufränkisch Burgenland',
  'Portogallo':'Douro Touriga Nacional, Alentejo Aragonez, Vinho Verde Alvarinho',
  'Grecia':'Assyrtiko di Santorini, Xinomavro Naoussa, Agiorgitiko Nemea',
  'Argentina':'Mendoza Malbec, Salta Torrontés, Uco Valley Cabernet Franc',
  'Australia':'Barossa Shiraz (Penfolds), Clare Valley Riesling, Yarra Valley Pinot Noir',
};

function getLang(){ return (window.i18n&&window.i18n.current)||localStorage.getItem('sw_lang')||'it'; }
function tf(a,f){ var l=getLang(); return a[f+'_'+l]||a[f+'_it']||a[f]||''; }
function getElite(){
  try{return JSON.parse(localStorage.getItem('sw_elite_producers')||'[]')
    .filter(function(p){return p.nome&&p.descrizione;})
    .map(function(p,i){return{id:'e'+i,isElite:true,
      titolo_it:'👑 '+p.nome,titolo_en:'👑 '+p.nome,titolo_fr:'👑 '+p.nome,
      categoria_it:'👑 Elite',testo_it:p.descrizione,
      autore:p.nome,data:p.data||'',immagine:p.immagine||W.winery,producer:p};});
  }catch(e){return[];}
}

/* ═══════════════════════════════════════════
   FIX SOMMELIER — paese OBBLIGATORIO
   ═══════════════════════════════════════════ */
function fixSommelier(){
  /* updateRegioni con regioni complete */
  window.updateRegioni = function(){
    var paese = (document.getElementById('winePaese')||{}).value||'';
    var sel = document.getElementById('wineRegione');
    if(!sel) return;
    sel.innerHTML = '<option value="">Qualsiasi regione</option>';
    (REGIONI[paese]||[]).forEach(function(r){
      var o=document.createElement('option');o.value=r;o.textContent=r;sel.appendChild(o);
    });
    sel.disabled = !paese;
  };
  var ps=document.getElementById('winePaese');
  if(ps){ ps.onchange=window.updateRegioni; if(ps.value)window.updateRegioni(); }

  /* doAbbinamento riscritta completamente */
  window.doAbbinamento = async function(){
    var menu=(document.getElementById('menuText')||{}).value||'';
    if(!menu&&!window._photoB64){alert('Inserisci il menu o fotografalo.');return;}

    var budget=(document.getElementById('budget')||{}).value||'50';
    var paese=(document.getElementById('winePaese')||{}).value||'';
    var regione=(document.getElementById('wineRegione')||{}).value||'';
    var lang=getLang();
    var prefs=Array.from(document.querySelectorAll('#prefPills .on')).map(function(b){return b.textContent;}).join(', ');

    /* LINGUA */
    var LC={it:'RISPONDI ESCLUSIVAMENTE IN ITALIANO.',en:'REPLY EXCLUSIVELY IN ENGLISH.',fr:'RÉPONDS EXCLUSIVEMENT EN FRANÇAIS.'};
    var langCmd=LC[lang]||LC.it;

    /* VINCOLO PAESE — costruito in modo blindato */
    var vincolo='';
    if(paese){
      var esempiPaese=ESEMPI_VINI[paese]||'vini tipici di '+paese;
      vincolo='\n\n'+
        '██████████████████████████████████████████\n'+
        '🔴 VINCOLO GEOGRAFICO — PRIORITÀ ASSOLUTA\n'+
        '██████████████████████████████████████████\n'+
        'PAESE SELEZIONATO DALL\'UTENTE: '+paese+(regione?' — ZONA: '+regione:'')+'\n\n'+
        '✅ OBBLIGATORIO: Consiglia SOLO vini prodotti fisicamente in '+paese+(regione?' nella zona '+regione:'')+'\n'+
        '❌ VIETATO: Qualsiasi vino di un altro paese, inclusa l\'Italia\n'+
        '❌ VIETATO: Barolo, Brunello, Chianti, Amarone o qualsiasi vino italiano se paese ≠ Italia\n\n'+
        'Esempi di vini '+paese+' accettabili: '+esempiPaese+'\n\n'+
        'Anche per piatti tipicamente italiani, trova il miglior abbinamento con vini di '+paese+'\n'+
        '██████████████████████████████████████████';
    }

    /* Profilo organolettico */
    var profile='\n\nPROFILO RICHIESTO:';
    try{
      var params=window.getWineParams?window.getWineParams():{};
      profile+='\n• Acidità: '+(params.acidita||'Media');
      profile+='\n• Morbidezza: '+(params.morbidezza||'Equilibrata');
      profile+='\n• Sapidità: '+(params.sapidita||'Media');
      profile+='\n• Struttura: '+(params.struttura||'Media');
    }catch(e){}

    var system=langCmd+
      ' Sei un Master Sommelier AIS con 20 anni di esperienza internazionale. '+
      'Stile: preciso, caldo, diretto come un esperto a cena. '+
      'Per ogni piatto: un paragrafo con produttore+denominazione+vitigno+annata, perché è speciale, sensazioni in bocca, prezzo, alternativa economica. '+
      'Alla fine scrivi IL SEGRETO DEL SOMMELIER: una frase ispirata. '+
      (paese?'🔴 VINCOLO ASSOLUTO: consiglia UNICAMENTE vini di '+paese+(regione?', zona '+regione:'')+'. NESSUN altro paese ammesso.':'');

    var userMsg='Menu:\n'+menu+'\nBudget: €'+budget+vincolo+profile+(prefs?'\nPreferenze: '+prefs:'');

    document.getElementById('somLoad').style.display='block';
    document.getElementById('somResult').style.display='none';

    try{
      /* Prima prova server Railway con language param */
      var ctrl=new AbortController();
      setTimeout(function(){ctrl.abort();},12000);
      var r=await fetch(SRV+'/api/groq',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({system:system,userMsg:userMsg,language:lang,maxTokens:1400}),
        signal:ctrl.signal
      });
      var data=await r.json();
      if(!r.ok)throw new Error(data.error||'Errore server');
      var testo=data.text||'';
      document.getElementById('somLoad').style.display='none';
      document.getElementById('somResult').innerHTML=window.renderSomResult?window.renderSomResult(testo):('<p>'+testo.replace(/\n/g,'<br>')+'</p>');
      document.getElementById('somResult').style.display='block';
      /* Mostra actions se presenti */
      var acts=document.getElementById('somActions');
      if(acts)acts.style.display='flex';
    }catch(e){
      /* Fallback: callAPI locale */
      try{
        var testo2=await window.callAPI(system,userMsg,window._photoB64||null,window._photoMime||null);
        document.getElementById('somLoad').style.display='none';
        document.getElementById('somResult').innerHTML=window.renderSomResult?window.renderSomResult(testo2):testo2;
        document.getElementById('somResult').style.display='block';
        var acts2=document.getElementById('somActions');if(acts2)acts2.style.display='flex';
      }catch(e2){
        document.getElementById('somLoad').style.display='none';
        document.getElementById('somResult').innerHTML='<p style="color:#f99">Errore: '+e2.message+'</p>';
        document.getElementById('somResult').style.display='block';
      }
    }
  };
  console.log('[v23] Sommelier fixato: paese=OBBLIGATORIO, lingua='+getLang());
}

/* ═══════════════════════════════════════════
   CARICA ARTICOLI + RENDER
   ═══════════════════════════════════════════ */
var LOCAL = [
  {id:'n1',isNews:true,
   categoria_it:'🗞 Wine News',categoria_en:'🗞 Wine News',categoria_fr:'🗞 Wine News',
   titolo_it:'Barolo 2019: prezzi in rialzo dopo i 97 punti Vinous',
   titolo_en:'Barolo 2019: Prices Rising After 97 Vinous Points',
   titolo_fr:'Barolo 2019 : hausse des prix après 97 points Vinous',
   testo_it:'Il 2019 si conferma la grande sorpresa del decennio nel Barolo. Giacomo Conterno con Francia ha ricevuto 97 punti su Vinous, Bartolo Mascarello 96, Beppe Rinaldi 95. Il mercato risponde: i prezzi en primeur sono già saliti del 22% rispetto al 2016.\n\nGli analisti di Wine-Searcher segnalano allocazioni esaurite in 24 ore per i produttori più piccoli. Per i collezionisti, la finestra d\'acquisto è ancora aperta ma si chiuderà entro l\'estate 2026.\n\nNovità: tre nuovi produttori di Serralunga d\'Alba hanno ottenuto valutazioni eccellenti per la prima volta — segno che l\'intera denominazione è in ascesa qualitativa.',
   testo_en:'2019 confirms itself as the decade\'s great Barolo surprise. Giacomo Conterno Francia received 97 Vinous points, Bartolo Mascarello 96. Market prices are up 22% vs 2016.',
   testo_fr:'2019 confirme d\'être la grande surprise de la décennie à Barolo. Conterno Francia reçoit 97 points Vinous.',
   autore:'SW Editorial',data:'Aprile 2026',immagine:W.vineyard3},
  {id:'n2',isNews:true,
   categoria_it:'🗞 Wine News',categoria_en:'🗞 Wine News',categoria_fr:'🗞 Wine News',
   titolo_it:'Mosel 2023: un\'annata fredda che ha sorpreso tutti',
   titolo_en:'Mosel 2023: A Cool Vintage That Surprised Everyone',
   titolo_fr:'Moselle 2023 : un millésime frais qui a surpris tout le monde',
   testo_it:'L\'annata 2023 nel Mosel è stata inizialmente sottovalutata per il clima fresco. I vini usciti in commercio a inizio 2026 stanno invece ricevendo valutazioni eccellenti: acidità brillante, estratto minerale straordinario, profumi di pesca bianca e ardesia.\n\nEgon Müller ha dichiarato che il suo Scharzhofberger Auslese 2023 è tra i migliori della carriera. JJ Prüm e Clemens Busch confermano la valutazione.\n\nI Kabinett e Spätlese 2023 sono ancora accessibili a prezzi ragionevoli — acquisto consigliato prima che la critica internazionale li scopra completamente.',
   testo_en:'The cool 2023 Mosel vintage was initially undervalued. Wines released in early 2026 are receiving excellent scores with brilliant acidity and extraordinary mineral extract.',
   testo_fr:'Le millésime 2023 de Moselle était initialement sous-estimé pour son climat frais. Les vins sont maintenant excellents.',
   autore:'SW Editorial',data:'Aprile 2026',immagine:W.vineyard2},
  {id:'n3',isNews:false,
   categoria_it:'🌋 Terroir',categoria_en:'🌋 Terroir',categoria_fr:'🌋 Terroir',
   titolo_it:'Etna: il vulcano che ha riscritto il concetto di terroir',
   titolo_en:'Etna: The Volcano That Rewrote the Concept of Terroir',
   titolo_fr:'Etna : le volcan qui a réécrit le concept de terroir',
   testo_it:'Le 133 contrade dell\'Etna sono diventate il riferimento mondiale per la viticoltura vulcanica. Ogni contrada ha un carattere distinto determinato dall\'esposizione, dall\'altitudine (tra 400 e 1000 metri) e dalla composizione della lava.\n\nCalderara Sottana, a nord del vulcano, produce vini eleganti e freschi con profumi floreali. Feudo di Mezzo e Rampante, sul versante est più caldo, danno struttura e speziatura. Come i grands crus di Borgogna, la differenza si assaggia nel bicchiere.\n\nCornelius Cornelissen, Terre Nere, Benanti, Passopisciaro: quattro filosofie diverse sullo stesso vulcano. Cosa li unisce è la mineralità lavica inconfondibile del Nerello Mascalese.',
   testo_en:'Etna\'s 133 contrade have become the world reference for volcanic viticulture. Each has a distinct character from altitude, exposure and lava composition.',
   testo_fr:'Les 133 contrade de l\'Etna sont devenues la référence mondiale pour la viticulture volcanique.',
   autore:'SW Editorial',data:'Aprile 2026',immagine:W.vineyard},
  {id:'n4',isNews:false,
   categoria_it:'✨ Champagne',categoria_en:'✨ Champagne',categoria_fr:'✨ Champagne',
   titolo_it:'Come scegliere lo Champagne: la guida definitiva',
   titolo_en:'How to Choose Champagne: The Definitive Guide',
   titolo_fr:'Comment choisir le Champagne : le guide définitif',
   testo_it:'Tra 300 maison e migliaia di etichette, il metodo per orientarsi è semplice: capire tre parametri.\n\nPrimo, il dosaggio: Brut Nature (0g/l residuo zuccherino) è il più secco e preciso; Extra Brut è leggermente più ricco; Brut è il classico. Il Demi-Sec è ingiustamente dimenticato con i dolci.\n\nSecondo, la categoria del produttore: NM (Négociant-Manipulant) compra uve da terzi — le grandi maison sono quasi tutte NM. RM (Récoltant-Manipulant) usa solo uve proprie — questi sono i veri "vignerons" dello Champagne.\n\nTerzo, la tipologia: Non Vintage è il blend di riferimento; Vintage è solo nelle annate eccezionali; Prestige Cuvée è il massimo.',
   testo_en:'Among 300 houses, knowing three parameters helps: dosage, producer category (NM vs RM), and wine type (NV, Vintage, Prestige).',
   testo_fr:'Parmi 300 maisons, trois paramètres suffisent : dosage, catégorie producteur (NM vs RM), et type de vin.',
   autore:'SW Editorial',data:'Marzo 2026',immagine:W.glass},
  {id:'n5',isNews:false,
   categoria_it:'📚 Abbinamenti',categoria_en:'📚 Pairings',categoria_fr:'📚 Accords',
   titolo_it:'I 10 abbinamenti che ogni sommelier ha memorizzato',
   titolo_en:'The 10 Pairings Every Sommelier Memorizes',
   titolo_fr:'Les 10 accords que chaque sommelier a mémorisés',
   testo_it:'La regola fondamentale è la concordanza di intensità: un piatto delicato vuole un vino leggero. L\'eccezione è il contrasto — un piatto grasso vuole acidità o bollicine.\n\nI 10 imprescindibili: Parmigiano 36 mesi + Lambrusco Metodo Classico (Moretto); Gorgonzola + Sauternes 2015 (Château d\'Yquem); Stilton + Porto Vintage (Taylor\'s); Brie + Champagne Blanc de Blancs; Ostriche + Muscadet Sur Lie.\n\nAltri cinque: Salmone affumicato + Riesling Spätlese del Mosel; Tartufo nero + Barolo 2015 (Conterno); Foie gras + Gewurztraminer Vendange Tardive (Trimbach); Cioccolato 80% + Banyuls Vintage; Agnello arrosto + Brunello 2016.',
   testo_en:'The fundamental rule is intensity concordance. Ten essential pairings from Parmigiano + Lambrusco to dark chocolate + Banyuls Vintage.',
   testo_fr:'La règle fondamentale : concordance d\'intensité. Dix accords essentiels du Parmesan + Lambrusco au chocolat noir + Banyuls.',
   autore:'SW Editorial',data:'Marzo 2026',immagine:W.glass2},
];

function artList(){ return _arts.length ? _arts : getElite().concat(LOCAL); }

async function loadArts(){
  _arts=getElite().concat(LOCAL);
  renderSlides(); buildTicker();
  try{
    var lang=getLang();
    var ctrl=new AbortController();setTimeout(function(){ctrl.abort();},6000);
    var r=await fetch(SRV+'/api/articles',{signal:ctrl.signal});
    if(r.ok){
      var data=await r.json();
      if(data&&data.length){
        data.forEach(function(a){
          if(!a.titolo)a.titolo=a['titolo_'+lang]||a.titolo_it||a.titolo_en||'';
          if(!a.categoria)a.categoria=a['categoria_'+lang]||a.categoria_it||'';
          if(!a.testo)a.testo=a['testo_'+lang]||a.testo_it||'';
          // USA SOLO immagini verificate wine se l'articolo non ha immagine
          if(!a.immagine||a.immagine==='')a.immagine=IMGS[Math.floor(Math.random()*IMGS.length)];
        });
        _arts=getElite().concat(data);
        renderSlides();buildTicker();
        console.log('[v23] '+data.length+' articoli server ✓');
      }
    }
  }catch(e){console.log('[v23] Locali ('+e.message+')');}
}

/* ═══════════════════════════════════════════
   TICKER (hero section)
   ═══════════════════════════════════════════ */
function buildTicker(){
  var hero=document.getElementById('heroSection');if(!hero)return;
  var old=document.getElementById('sw23-tick');if(old)old.remove();
  var arts=artList();
  var bar=document.createElement('div');
  bar.id='sw23-tick';
  bar.style.cssText='position:absolute;bottom:0;left:0;right:0;z-index:100;height:32px;overflow:hidden;background:rgba(10,7,5,.9);border-top:1px solid rgba(191,155,74,.2);';
  var inner=document.createElement('div');
  inner.style.cssText='display:flex;align-items:center;height:32px;white-space:nowrap;animation:sw23sc 52s linear infinite;will-change:transform;';
  inner.id='sw23-tick-t';

  var style=document.createElement('style');
  style.textContent='@keyframes sw23sc{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}#sw23-tick-t:hover{animation-play-state:paused;cursor:pointer;}';
  document.head.appendChild(style);

  function makeBatch(list){
    var f=document.createDocumentFragment();
    var lbl=document.createElement('span');
    lbl.style.cssText='display:inline-flex;align-items:center;padding:0 16px;height:32px;flex-shrink:0;font-family:Cinzel,serif;font-size:.44rem;letter-spacing:3px;color:rgba(191,155,74,.5);border-right:1px solid rgba(191,155,74,.15);';
    lbl.textContent='🍷 WINE NEWS';f.appendChild(lbl);
    list.forEach(function(a){
      var tit=tf(a,'titolo')||a.titolo||'';if(!tit)return;
      var s=document.createElement('span');
      s.style.cssText='display:inline-flex;align-items:center;gap:6px;padding:0 18px;height:32px;cursor:pointer;flex-shrink:0;font-family:Cinzel,serif;font-size:.46rem;letter-spacing:.1em;color:rgba(245,239,226,.7);border-right:1px solid rgba(191,155,74,.1);transition:color .15s;';
      var d=document.createElement('span');
      d.style.cssText='width:4px;height:4px;border-radius:50%;flex-shrink:0;background:'+(a.isNews?'rgba(120,200,255,.7)':'rgba(191,155,74,.6)')+';';
      s.appendChild(d);s.appendChild(document.createTextNode(tit));
      s.onmouseover=function(){this.style.color='#D4AF37';};
      s.onmouseout=function(){this.style.color='rgba(245,239,226,.7)';};
      s.onclick=(function(art){return function(e){e.stopPropagation();openReader(art,0);};})(a);
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

/* ═══════════════════════════════════════════
   WINE NEWS — slideshow
   ═══════════════════════════════════════════ */
function injectNews(){
  if(document.getElementById('sw23-news'))return;
  document.querySelectorAll('.news-section-head,#newsContainer,#defaultHero').forEach(function(el){
    el.style.setProperty('display','none','important');
  });
  var sec=document.createElement('div');
  sec.id='sw23-news';
  sec.style.cssText='background:#0A0705;border-bottom:1px solid rgba(191,155,74,.08);';
  sec.innerHTML=
    '<div id="sw23-news-hd"><div id="sw23-news-lbl"><span class="news-live-dot"></span>WINE NEWS</div>'+
    '<span id="sw23-cnt"></span></div>'+
    '<div id="sw23-slide-area"></div>'+
    '<div id="sw23-dots"></div>';
  var hb=document.querySelector('#page-home .home-body');
  if(hb)hb.insertBefore(sec,hb.firstChild);
}

function renderSlides(){
  var area=document.getElementById('sw23-slide-area');
  var dotsEl=document.getElementById('sw23-dots');
  var cntEl=document.getElementById('sw23-cnt');
  if(!area||!dotsEl)return;

  var arts=artList().slice(0,6);
  if(cntEl)cntEl.textContent=arts.length+' articoli';
  area.innerHTML='';dotsEl.innerHTML='';

  arts.forEach(function(a,i){
    var tit=tf(a,'titolo')||a.titolo||'';
    var cat=tf(a,'categoria')||a.categoria||'';
    var txt=tf(a,'testo')||a.testo||'';
    var img=a.immagine||IMGS[i%IMGS.length];
    var bg=BG[i%BG.length];

    var card=document.createElement('div');
    card.className='sw23-slide'+(i===0?' on':'');
    card.innerHTML=
      '<div class="sw23-slide-img-col" style="background:'+bg+';">'+
        '<img src="'+img+'" loading="lazy" alt="" onerror="this.style.display=\'none\'">'+
      '</div>'+
      '<div class="sw23-slide-txt">'+
        '<div>'+
          '<div class="sw23-slide-cat">'+cat+'</div>'+
          '<div class="sw23-slide-tit">'+tit+'</div>'+
          '<div class="sw23-slide-sum">'+txt.replace(/\n\n/g,' ').substring(0,230)+'</div>'+
        '</div>'+
        '<div class="sw23-slide-meta">'+(a.data||'')+(a.autore?' · '+a.autore:'')+'</div>'+
      '</div>';
    card.onclick=(function(a,i){return function(){openReader(a,i);};})(a,i);
    area.appendChild(card);

    var dot=document.createElement('div');
    dot.className='sw23-pg'+(i===0?' on':'');
    dot.onclick=(function(i){return function(){goSlide(i);};})(i);
    dotsEl.appendChild(dot);
  });

  if(_sTimer)clearInterval(_sTimer);
  _sIdx=0;
  _sTimer=setInterval(function(){
    _sIdx=(_sIdx+1)%arts.length;
    goSlide(_sIdx);
  },5500);
}

function goSlide(idx){
  document.querySelectorAll('.sw23-slide').forEach(function(c){c.classList.remove('on');});
  document.querySelectorAll('.sw23-pg').forEach(function(d){d.classList.remove('on');});
  var c=document.querySelectorAll('.sw23-slide')[idx];
  var d=document.querySelectorAll('.sw23-pg')[idx];
  if(c)c.classList.add('on');
  if(d)d.classList.add('on');
  _sIdx=idx;
}

/* ═══════════════════════════════════════════
   IL SAPERE DEL VINO — 3 articoli fissi
   ═══════════════════════════════════════════ */
var SAPERE = [
  {ico:'🌿',cat:'🌿 Viticoltura',img:W.vineyard,
   titoli:['La Potatura Invernale: il gesto più importante','Come si alleva la vite','La vendemmia: quando e come raccogliere','Il diradamento dei grappoli','La copertina erbosa e la biodiversità'],
   testi:[
     'La potatura invernale è il gesto più importante che un vignaiolo compie nell\'anno intero. Si esegue tra dicembre e febbraio, quando la vite è in riposo vegetativo. Ogni tralcio tagliato è una decisione precisa: quante gemme lasciare, quanti grappoli potenziali consentire.\n\nNel sistema Guyot borgognone — il più diffuso al mondo — un unico tralcio principale viene piegato orizzontalmente e legato al filo, con un numero di gemme contato. Ogni gemma produrrà un grappolo. Lasciarne 6 significa sei grappoli potenziali; lasciarne 10 significa più produzione ma meno concentrazione.\n\nI grandi vignaioli del Barolo e della Borgogna spesso parlano di "ascoltare la vite" durante la potatura: ogni pianta è diversa, ha un vigore diverso, ha bisogno di scelte diverse. Non esistono regole universali.',
     'L\'allevamento della vite determina tutto: esposizione al sole, ventilazione, produzione, longevità della pianta. Il sistema Guyot è il più diffuso in Borgogna, Bordeaux e in molte aree del mondo: un unico tralcio portante piegato orizzontalmente. Il cordone di Royat usa due braccia permanenti e si trova spesso in Champagne.\n\nL\'alberello — la forma più antica — cresce basso e compatto senza supporti artificiali. Lo troviamo sulle pendici dell\'Etna, a Pantelleria, nelle vecchie vigne di Jerez. Resiste alla siccità perché le radici sono profondissime, e al vento perché la superficie esposta è minima.\n\nSull\'Etna, le viti allevate ad alberello su suoli vulcanici hanno spesso 80-100 anni. Producono pochissimo — tre o quattro grappoli per pianta — ma con una concentrazione e una complessità che i vigneti giovani non possono eguagliare.',
     'La vendemmia è il momento in cui tutto si decide. Raccogliere troppo presto significa acidità eccessiva e mancanza di maturazione fenolica — i tannini resteranno verdi e astringenti. Raccogliere troppo tardi significa perdita di acidità, alcol eccessivo e vini piatti senza freschezza.\n\nI produttori più attenti effettuano analisi chimiche quotidiane nelle ultime settimane. Vanno in vigna ogni mattina, assaggiano gli acini, valutano la consistenza delle bucce e la maturazione dei vinaccioli — che devono diventare marroni. È una scienza che ha bisogno dell\'istinto.\n\nNelle grandi denominazioni come Barolo e Brunello, il clima ha imposto vendemmie sempre più precoci. Negli anni \'80 si raccoglieva in ottobre; oggi spesso a metà settembre. Il cambiamento climatico sta ridisegnando i calendari storici.',
     'Il diradamento dei grappoli, chiamato anche "vendemmia verde", consiste nel tagliare grappoli ancora acerbi a luglio per concentrare la linfa sui grappoli rimasti. È una perdita programmata di quantità per guadagnare qualità.\n\nNei grandi vigneti di Barolo, Brunello, Bordeaux e Borgogna il diradamento è la norma. Il rapporto tra grappoli eliminati e grappoli rimasti varia: nelle annate molto produttive si può arrivare a eliminare il 50% della produzione.\n\nL\'obiettivo è la stessa concentrazione che si otterrebbe naturalmente con una vigna vecchia e poco produttiva. Le viti centenarie producono così poco che non richiedono diradamento — ogni grappolo che portano è già straordinario.',
     'La cover crop — l\'inerbimento tra i filari con erbe e fiori — è diventata la bandiera della viticoltura sostenibile moderna. Ospita insetti benefici, contrasta l\'erosione, migliora la struttura del suolo e riduce l\'uso di erbicidi chimici.\n\nI vignaioli biodinamici scelgono le piante con cura: le leguminose fissano azoto nel suolo, le fioriture attraggono api e insetti impollinatori, alcune piante competono intenzionalmente con la vite per l\'acqua, utile nelle annate piovose.\n\nIn un ettaro di vigna sana — con copertura erbosa e senza pesticidi — vivono più di un milione di organismi diversi per metro quadro: batteri, funghi, lombrichi, insetti, ragni, nematodi. Questa biodiversità invisibile è una componente reale del terroir.'
   ]},
  {ico:'🎓',cat:'🎓 Sommelier',img:W.bottles,
   titoli:['La decantazione: quando e perché','Il rigetto della bottiglia difettata','La temperatura di servizio','Come si annusa il vino','L\'arte dell\'abbinamento cibo-vino'],
   testi:[
     'La decantazione serve per due ragioni diverse e spesso confuse tra loro: eliminare i sedimenti dai vini vecchi, e ossigenare i vini giovani tannici per ammorbidirli.\n\nUn Barolo 2019, giovane e ancora chiuso, beneficia enormemente di 2-3 ore in un ampio decanter. I tannini si ammorbidiscono, i profumi si aprono. Un Amarone della Valpolicella ne vuole anche 4-5. Un Brunello di Montalcino di annata media si trasforma in 90 minuti.\n\nAl contrario, un vino bianco maturo o un Borgogna di 15 anni deve essere decantato con estrema delicatezza — solo per eliminare il deposito, senza ossigenarlo eccessivamente. La decantazione aggressiva in questi casi lo rovina in pochi minuti, portando via i profumi terziari che ci sono voluti anni a sviluppare.',
     'Il rigetto di una bottiglia difettata è un diritto del cliente, non un capriccio o un\'imposizione. Il sommelier deve aprire la bottiglia e annusare il tappo: il TCA (2,4,6-tricloroanisolo) emette un odore inconfondibile di cantina umida, cartone bagnato, fungo. La bottiglia è "tappata" e il ristorante è obbligato a cambiarla senza discussioni.\n\nAltri difetti possibili: ossidazione (vino piatto, color aranciato, note di mela cotta o aceto), riduzione (odore di uova, gomma bruciata, aglio — a volte si risolve con l\'ossigenazione nel decanter), Brett o Brettanomyces (odore di stalla, cuoio, sudore — difetto nelle concentrazioni elevate ma caratteristica apprezzata a basse dosi).\n\nUna bottiglia difettata non si paga. Se il ristorante non accetta il rigetto, si può insistere educatamente: è un diritto tutelato da normative europee sulla vendita di beni difettosi.',
     'La temperatura di servizio è uno degli elementi più trascurati e più impattanti sulla percezione di un vino. Un Barolo servito a 22°C — temperatura comune in casa o in un ristorante non climatizzato — sembra alcolico e piatto: gli aromi volatili fuggono via, i tannini si percepiscono duri e secchi.\n\nLo stesso vino a 16°C è completamente diverso: più fresco, più preciso, con i tannini morbidi e i profumi di viola e catrame che emergono gradualmente nel calice.\n\nLa regola pratica per casa: bianchi e rosé dal frigorifero 20-25 minuti prima di servire; rossi leggeri (Pinot Nero, Barbera giovane) dal frigo 15 minuti prima; rossi strutturati (Barolo, Brunello, Amarone) semplicemente in una cantina fresca o in una stanza a 17-18°C. In estate, un\'ora in frigorifero prima di servire fa miracoli.',
     'La prima annusata si fa a naso fermo, senza ruotare il calice: arrivano gli aromi primari, i più volatili e delicati. Frutta fresca, fiori, erbe aromatiche. Già questa prima impressione distingue un bianco da un rosso, un giovane da un maturo.\n\nDopo aver ruotato energicamente il calice, si annusa subito: arrivano gli aromi secondari (fermentazione — pane, yogurt, lievito) e poi i terziari o aromi di invecchiamento: cuoio, tabacco, terra, muschio, tartufo, catrame, grafite nei grandi rossi di montagna.\n\nL\'ottanta per cento di quello che percepiamo come "gusto" è in realtà olfatto retronasale — aromi che saliamo attraverso il passaggio rinofaringeo mentre beviamo e deglutissimo. Per questo chi ha il raffreddore percepisce pochissimo del vino. Il naso è lo strumento principale del degustatore.',
     'L\'abbinamento cibo-vino si basa su due principi: concordanza e contrasto. La concordanza cerca similitudini di intensità e sapore — un piatto delicato con un vino delicato, uno ricco e grasso con un vino strutturato e tannico.\n\nIl contrasto cerca equilibrio opposto: la frittura di pesce vuole le bollicine che "sgrassano" il palato con la loro acidità e le bollicine fisiche; il foie gras grasso e dolciastro vuole il Sauternes che bilancia con dolcezza e acidità; gli erborinati intensi (Gorgonzola, Roquefort) vogliono vini dolci che si "oppongono" alla sapidità.\n\nLa regola d\'oro del Master Sommelier: abbina prima la struttura, poi gli aromi. Un Barolo con un pesce delicato è sbagliato non per i profumi (Barolo + pesce in teoria compatibili) ma perché i tannini potenti si legano alle proteine del pesce e creano un\'astringenza metallica sgradevole.'
   ]},
  {ico:'🍇',cat:'🍇 Vitigni',img:W.vineyard3,
   titoli:['Il Nebbiolo: il più difficile d\'Italia','Il Riesling: il più longevo al mondo','Il Sangiovese e la sua famiglia','Pinot Nero: perché è così difficile','Il Grenache: il più coltivato al mondo'],
   testi:[
     'Il Nebbiolo è probabilmente il vitigno più difficile d\'Italia da coltivare e da vinificare. Matura tardissimo — fine ottobre in Barolo, con rischio gelate — ama quasi esclusivamente i suoli calcarei e argillosi delle Langhe, ed esprime il terroir con una precisione chirurgica che pochi altri vitigni possono eguagliare.\n\nA Barolo è austero, tannico, longevo. Profumi di violetta, rosa secca, catrame, tabacco, liquirizia. Dopo 10-15 anni in bottiglia si aprono note di tartufo bianco e cuoio. A Barbaresco, su suoli più sabbiosi, è più elegante e accessibile giovane. A Gattinara, su porfido vulcanico, assomiglia quasi ai Pinot Nero di Borgogna nella trasparenza.\n\nIl grande Nebbiolo richiede almeno 10 anni per esprimersi pienamente. I migliori — Monfortino di Giacomo Conterno, Mascarello Barolo, Quintarelli Valpolicella — migliorano per 30-40 anni.',
     'Il Riesling è il vitigno a bacca bianca più longevo del mondo. Un Trockenbeerenauslese del Mosel in un\'annata eccezionale invecchia 80-100 anni conservando struttura e freschezza. Bottiglie degli anni \'40 e \'50 sono ancora magnifiche — qualcosa che quasi nessun altro vino bianco può permettersi.\n\nIl segreto è l\'acidità: il Riesling conserva naturalmente livelli elevatissimi di acido tartarico e malico, che agiscono come conservanti naturali. Con l\'invecchiamento sviluppa la "petroliosità" — idrocarburi nobili chiamati TDN che i fan del vitigno considerano la firma della grandezza.\n\nArdesia blu del Mosel, granito dell\'Alsazia, calcare del Rheingau, phyllite del Wachau: ogni suolo firma il Riesling con una mineralità diversa. L\'ardesia del Mosel è probabilmente il suolo più famoso per la viticoltura bianca al mondo.',
     'Il Sangiovese non è un singolo vitigno: è una famiglia numerosa di cloni selezionati nei secoli dai vignaioli. Il Sangiovese Grosso di Montalcino — il Brunello — è austero, longevo, con acidità tagliente e tannini potenti. Il Sangiovese Piccolo del Chianti è più fruttato e accessibile. Il Prugnolo Gentile di Montepulciano è ancora un carattere distinto.\n\nQuesti non sono solo nomi commerciali: sono cloni geneticamente diversi, selezioni millenarie. Un Brunello di Montalcino e un Chianti Classico condividono il DNA di base ma sono vini completamente diversi — come il Pinot Nero di Gevrey-Chambertin e quello di Chambolle-Musigny.\n\nIl Sangiovese è il vitigno più coltivato d\'Italia con oltre 65.000 ettari. Nessun altro vitigno italiano si avvicina a questa diffusione. Ha bisogno di suoli calcarei, caldo ma non eccessivo, e di vignaioli pazienti: difficile da vinificare, ricompensa chi sa aspettarlo.',
     'Il Pinot Nero è il vitigno più difficile al mondo. Richiede un microclima perfettamente equilibrato — troppo caldo e perde l\'acidità che lo rende grande; troppo freddo e non matura abbastanza. I suoi acini piccoli, con la buccia sottile, in grappoli fitti e compatti lo rendono vulnerabile a quasi tutte le malattie fungine.\n\nEppure produce i vini più grandi e più costosi del mondo. La Romanée-Conti vale 500.000-800.000 euro a bottiglia. Chambertin, Musigny, Richebourg, La Tâche: nomi che fanno tremare i collezionisti. In Borgogna, su calcare kimmeridgiano della Côte d\'Or, ha trovato il suo habitat perfetto dopo secoli di selezione monastica.\n\nFuori dalla Borgogna riesce in pochissimi posti: Willamette Valley in Oregon, Central Otago in Nuova Zelanda, Ahr in Germania dove il microclima della valle fluviale crea condizioni uniche, e l\'Etna dove il vulcano ricrea temperature quasi alpine alle alte quote.',
     'Il Grenache (Garnacha in Spagna, Cannonau in Sardegna, Cannonau in altri dialetti) è il vitigno a bacca rossa più coltivato al mondo — circa 200.000 ettari totali. È la base di Châteauneuf-du-Pape nel Rodano meridionale, del Priorat in Catalogna, e di quasi tutti i rosati della Provenza.\n\nNaturalmente alto in alcol — raggiunge facilmente 15-16% senza che l\'uva sembri sovramatura — ma basso in tannini, il Grenache ha bisogno di partner varietali per dare struttura nei blend: Syrah e Mourvèdre nel blend provenzale classico, Cariñena nel Priorat, Cinsault nei rosati.\n\nIn Sardegna, il Cannonau coltivato nei villaggi interni come Orgosolo, Oliena e Mamoiada su vigne di 80-100 anni è tra le espressioni più straordinarie del vitigno al mondo: minerale, speziato, con tannini morbidi e una longevità sorprendente. Giuseppe Sedilesu e Fratelli Pala sono i produttori di riferimento.'
   ]},
];

function injectSapere(){
  if(document.getElementById('sw23-sapere'))return;
  var footer=document.querySelector('footer');if(!footer)return;
  var sec=document.createElement('div');sec.id='sw23-sapere';
  sec.innerHTML=
    '<div id="sw23-sapere-hd"><span style="font-size:.9rem;">📖</span>'+
    '<span style="font-family:Cinzel,serif;font-size:.58rem;letter-spacing:4px;color:var(--vino,#8B0000);">IL SAPERE DEL VINO</span>'+
    '<span id="sw23-sapere-d" style="font-size:10px;color:rgba(245,239,226,.2);margin-left:auto;"></span></div>';
  footer.parentNode.insertBefore(sec,footer);
  render3Art();
}

function render3Art(){
  var sec=document.getElementById('sw23-sapere');if(!sec)return;
  var today=new Date();
  var d=document.getElementById('sw23-sapere-d');
  if(d)d.textContent=today.toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long'});
  var dayN=Math.floor(Date.now()/86400000);
  if(_3cache.day===dayN)return;
  _3cache.day=dayN;
  sec.querySelectorAll('.sw23-art').forEach(function(el){el.remove();});

  SAPERE.forEach(function(S,i){
    var ti=(dayN+i)%S.titoli.length;
    var tit=S.titoli[ti];
    var txt=S.testi[ti];

    var card=document.createElement('div');card.className='sw23-art';
    card.innerHTML=
      (S.img
        ?'<img class="sw23-art-img" src="'+S.img+'" loading="lazy" alt="" onerror="this.style.display=\'none\'">'
        :'<div class="sw23-art-img-ph" style="background:'+BG[i%BG.length]+'">'+S.ico+'</div>')+
      '<div class="sw23-art-body">'+
        '<div class="sw23-art-tag">'+S.cat+'</div>'+
        '<div class="sw23-art-tit">'+tit+'</div>'+
        '<div class="sw23-art-txt">'+txt.substring(0,340)+'…</div>'+
        '<div class="sw23-art-foot">'+today.toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'})+' · Sommelier World Editorial</div>'+
      '</div>';
    card.onclick=(function(tit,txt,img,cat,i){return function(){
      openReader({titolo:tit,categoria:cat,testo:txt,autore:'Sommelier World',
        data:today.toLocaleDateString('it-IT'),immagine:img},i);
    };})(tit,txt,S.img,S.cat,i);
    sec.appendChild(card);
  });
}

/* ═══════════════════════════════════════════
   CURIOSITÀ (home only)
   ═══════════════════════════════════════════ */
var CUR=[
  {ico:'🌱',t:'Viticoltura',h:'Il Ciclo della Vite',b:'La vite percorre 4 stagioni: germogliamento (marzo), fioritura (giugno), invaiatura (agosto), vendemmia (settembre-ottobre). Un giorno di pioggia fuori tempo può cambiare un\'intera annata.',img:W.vineyard},
  {ico:'🔪',t:'Sommelier',h:'Come Aprire una Bottiglia',b:'Il sommelier taglia la capsula sotto il secondo anello, inserisce la vite al centro del sughero, ruota 6 volte e solleva con movimento fluido. Il sughero deve uscire in silenzio.',img:W.bottles},
  {ico:'🥂',t:'Bicchieri',h:'Perché il Calice ha lo Stelo',b:'Lo stelo evita che il calore della mano scaldi il vino. I grandi Borgogna si versano per un quarto del calice per lasciare spazio agli aromi di svilupparsi.',img:W.glass},
  {ico:'🌡️',t:'Servizio',h:'La Temperatura di Servizio',b:'Spumanti 6-8°C, bianchi 8-12°C, rosé 10-12°C, rossi leggeri 14-16°C, rossi strutturati 16-18°C. Mai oltre 18°C: l\'alcol copre tutti gli aromi.',img:''},
  {ico:'🪨',t:'Terroir',h:'Il Calcare e la Mineralità',b:'Il calcare drena bene, scalda rapidamente, forza le radici in profondità. Borgogna, Champagne, Barolo, Chablis, Mosel: tutti su suoli calcarei. Non è un caso.',img:W.vineyard2},
  {ico:'💧',t:'Degustazione',h:'Le Lacrime del Vino',b:'Le lacrime sul calice non indicano qualità ma alcol. Più sono marcate, più il vino è alcolico. Si formano per il diverso tasso di evaporazione tra alcol e acqua.',img:''},
  {ico:'🎭',t:'Storia',h:'Napoleone e il Chambertin',b:'Napoleone portava il Chambertin in ogni campagna militare. Durante la ritirata di Russia del 1812, senza il suo vino, attribuì parte della sconfitta alla sua assenza.',img:''},
  {ico:'🦟',t:'Storia',h:'La Fillossera che Cambiò Tutto',b:'Tra 1863 e 1900 la fillossera distrusse il 90% dei vigneti europei. La soluzione: innestare le viti europee su radici americane resistenti. Ancora oggi è così.',img:''},
];

function injectCuriosity(){
  if(document.getElementById('sw23-cur'))return;
  var sapere=document.getElementById('sw23-sapere');
  var ref=sapere||document.querySelector('footer');if(!ref)return;
  var sec=document.createElement('div');sec.id='sw23-cur';
  sec.innerHTML=
    '<div style="display:flex;align-items:center;gap:8px;padding:12px 14px 10px;">'+
      '<span style="font-size:.85rem;">🎓</span>'+
      '<span style="font-family:Cinzel,serif;font-size:.52rem;letter-spacing:4px;color:rgba(191,155,74,.45);">CURIOSITÀ</span>'+
    '</div>'+
    '<div id="sw23-cur-s"></div>';
  if(sapere)sapere.parentNode.insertBefore(sec,sapere);
  else ref.parentNode.insertBefore(sec,ref);
  renderCuriosity();
}

function renderCuriosity(){
  var c=document.getElementById('sw23-cur-s');if(!c)return;
  var dayN=Math.floor(Date.now()/86400000);
  var shown=[];for(var i=0;i<6;i++)shown.push(CUR[(dayN+i)%CUR.length]);
  c.innerHTML='';
  shown.forEach(function(cur,i){
    var card=document.createElement('div');card.className='sw23-cc';
    card.style.background=BG[i%BG.length];
    card.innerHTML=
      '<div class="sw23-cc-b">'+
        (cur.img?'<div style="margin:-12px -12px 10px;height:60px;overflow:hidden;width:calc(100%+24px);">'+
          '<img src="'+cur.img+'" style="width:100%;height:60px;object-fit:cover;" loading="lazy" onerror="this.parentNode.style.display=\'none\'"></div>':'')+
        '<div style="font-size:1.2rem;margin-bottom:4px;">'+cur.ico+'</div>'+
        '<div style="font-size:7px;font-weight:700;letter-spacing:2px;color:rgba(191,155,74,.42);text-transform:uppercase;margin-bottom:4px;">'+cur.t+'</div>'+
        '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:.78rem;font-weight:700;color:#F5EFE2;line-height:1.28;margin-bottom:5px;">'+cur.h+'</div>'+
        '<div style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:.76rem;line-height:1.58;color:rgba(245,239,226,.52);">'+cur.b.substring(0,90)+'…</div>'+
      '</div>';
    card.onclick=(function(cur,i){return function(){
      openReader({titolo:cur.h,categoria:'🎓 '+cur.t,testo:cur.b,autore:'Sommelier World',
        data:new Date().toLocaleDateString('it-IT'),immagine:cur.img||''},i);
    };})(cur,i);
    c.appendChild(card);
  });
}

/* ═══════════════════════════════════════════
   READER
   ═══════════════════════════════════════════ */
function openReader(art,idx){
  var tit=tf(art,'titolo')||art.titolo||'';
  var cat=tf(art,'categoria')||art.categoria||'';
  var txt=tf(art,'testo')||art.testo||'';
  var img=art.immagine||IMGS[(idx||0)%IMGS.length];
  var bg=BG[(idx||0)%BG.length];
  var paras=(txt||'').split(/\n\n+/).filter(Boolean)
    .map(function(p){return'<p style="margin:0 0 20px;font-size:1.08rem;line-height:2.0;color:rgba(245,240,232,.78);">'+p.trim()+'</p>';}).join('');

  var r=document.getElementById('sw23-reader');
  if(!r){r=document.createElement('div');r.id='sw23-reader';document.body.appendChild(r);}
  r.innerHTML=
    '<div style="position:sticky;top:0;z-index:2;background:rgba(10,7,5,.97);backdrop-filter:blur(12px);border-bottom:1px solid rgba(191,155,74,.12);display:flex;align-items:center;gap:12px;padding:12px 16px;">'+
      '<button onclick="SW23.closeReader()" style="width:36px;height:36px;border-radius:50%;background:rgba(191,155,74,.1);border:1px solid rgba(191,155,74,.2);color:#BF9B4A;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;">←</button>'+
      '<div style="font-family:Cinzel,serif;font-size:.56rem;letter-spacing:2px;color:rgba(191,155,74,.6);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+tit+'</div>'+
    '</div>'+
    '<div style="max-width:720px;margin:0 auto;padding-bottom:80px;">'+
      '<div style="width:100%;height:215px;background:'+bg+';position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:3.5rem;">'+
        '<img src="'+img+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" alt="" onerror="this.style.display=\'none\'">'+
        '<span style="position:relative;z-index:1;filter:drop-shadow(0 2px 12px rgba(0,0,0,.9));">🍷</span>'+
      '</div>'+
      '<div style="padding:24px 20px 0;">'+
        '<div style="font-size:9px;font-weight:700;letter-spacing:3px;color:rgba(191,155,74,.48);text-transform:uppercase;margin-bottom:10px;">'+cat+'</div>'+
        '<h1 style="font-family:\'Playfair Display\',Georgia,serif;font-size:1.65rem;font-weight:700;line-height:1.25;color:#F5EFE2;margin:0 0 14px;">'+tit+'</h1>'+
        '<div style="font-size:11px;color:rgba(245,239,226,.28);margin-bottom:24px;padding-bottom:14px;border-bottom:1px solid rgba(191,155,74,.1);display:flex;gap:8px;flex-wrap:wrap;">'+
          (art.data?'<span>'+art.data+'</span>':'')+
          (art.autore?'<span>·</span><span>'+art.autore+'</span>':'')+
          (art.generato_ai?'<span style="background:rgba(125,218,138,.1);color:rgba(125,218,138,.65);font-size:9px;padding:2px 7px;border-radius:3px;">✦ AI</span>':'')+
        '</div>'+
        '<div style="font-family:\'Cormorant Garamond\',Georgia,serif;">'+
          (paras||'<p>Contenuto non disponibile.</p>')+
        '</div>'+
      '</div>'+
    '</div>';
  r.style.display='block';r.scrollTop=0;
  document.body.style.overflow='hidden';_readerOpen=true;
  try{history.pushState({r:1},'');}catch(e){}
}

window.addEventListener('popstate',function(){
  if(_readerOpen){var r=document.getElementById('sw23-reader');if(r)r.style.display='none';document.body.style.overflow='';_readerOpen=false;}
});

/* ═══════════════════════════════════════════
   VISIBILITÀ HOME-ONLY
   ═══════════════════════════════════════════ */
function checkVis(){
  var isHome=!!(document.querySelector('#page-home.active')||document.querySelector('#page-home[style*="block"]'));
  ['sw23-news','sw23-sapere','sw23-cur'].forEach(function(id){
    var el=document.getElementById(id);
    if(el)el.style.setProperty('display',isHome?'':'none','important');
  });
}

function hookPage(){
  if(window.__sw23h)return;
  var orig=window.showPage;
  if(!orig){setTimeout(hookPage,400);return;}
  window.showPage=function(pid){
    orig.call(this,pid);
    setTimeout(checkVis,60);
    if(pid==='home')setTimeout(buildTicker,120);
  };
  document.querySelectorAll('.ntab').forEach(function(t){
    t.addEventListener('click',function(){setTimeout(checkVis,100);},true);
  });
  window.__sw23h=true;
}

/* ═══════════════════════════════════════════
   FAB + CONTATTI
   ═══════════════════════════════════════════ */
function addFAB(){
  if(document.getElementById('sw23-fab'))return;
  var fab=document.createElement('div');fab.id='sw23-fab';fab.title='Scrivici ✉️';fab.innerHTML='✉️';
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
    '<div style="position:sticky;top:0;z-index:2;background:rgba(10,7,5,.97);backdrop-filter:blur(12px);border-bottom:1px solid rgba(191,155,74,.15);display:flex;align-items:center;gap:12px;padding:13px 16px;">'+
      '<button onclick="SW23.closeContact()" style="width:36px;height:36px;border-radius:50%;background:rgba(191,155,74,.1);border:1px solid rgba(191,155,74,.2);color:#BF9B4A;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;">←</button>'+
      '<div style="font-family:Cinzel,serif;font-size:.65rem;letter-spacing:3px;color:#F5EFE2;">CONTATTI</div>'+
    '</div>'+
    '<div style="max-width:540px;margin:0 auto;padding:24px 20px 80px;box-sizing:border-box;">'+
      '<div style="text-align:center;margin-bottom:22px;">'+
        '<h2 style="font-family:\'Playfair Display\',serif;font-size:1.4rem;font-weight:700;color:#F5EFE2;margin:0 0 6px;">Come possiamo aiutarti?</h2>'+
        '<p style="font-size:12px;color:rgba(245,239,226,.4);line-height:1.7;margin:0;">Produttori, collaborazioni, segnalazioni. Risponderemo entro 48 ore.</p>'+
      '</div>'+
      '<div id="sw23-cok" style="display:none;text-align:center;padding:20px;background:rgba(125,218,138,.07);border:1px solid rgba(125,218,138,.18);border-radius:10px;margin-bottom:16px;">'+
        '<div style="font-size:1.8rem;">✓</div><div style="font-family:\'Playfair Display\',serif;color:#7dda8a;margin-top:4px;">Messaggio inviato!</div>'+
      '</div>'+
      '<div id="sw23-cfrm">'+
        '<div style="margin-bottom:14px;"><label class="sw23-fl">NOME *</label><input id="sw23-cn" class="sw23-fi" type="text" placeholder="Il tuo nome" autocomplete="name"></div>'+
        '<div style="margin-bottom:14px;"><label class="sw23-fl">EMAIL *</label><input id="sw23-ce" class="sw23-fi" type="email" placeholder="tua@email.com" autocomplete="email"></div>'+
        '<div style="margin-bottom:14px;"><label class="sw23-fl">MESSAGGIO *</label><textarea id="sw23-cm" class="sw23-fi" style="height:100px;resize:none;" placeholder="Scrivi qui..."></textarea></div>'+
        '<button onclick="SW23.sendMsg()" class="sw23-fb">✦ INVIA MESSAGGIO ✦</button>'+
        '<div id="sw23-cerr" style="display:none;margin-top:8px;padding:10px;background:rgba(220,50,50,.1);border:1px solid rgba(220,50,50,.22);border-radius:6px;font-size:12px;color:rgba(255,150,150,.88);text-align:center;"></div>'+
      '</div>'+
      '<div style="margin:20px 0;border-top:1px solid rgba(191,155,74,.1);position:relative;"><span style="position:absolute;top:-8px;left:50%;transform:translateX(-50%);background:#0A0705;padding:0 12px;font-size:9px;letter-spacing:3px;color:rgba(191,155,74,.28);">NEWSLETTER</span></div>'+
      '<div style="display:flex;gap:10px;">'+
        '<input id="sw23-nle" class="sw23-fi" type="email" placeholder="la.tua@email.com" style="flex:1;">'+
        '<button onclick="SW23.subscribe()" style="padding:11px 14px;background:rgba(191,155,74,.15);border:1.5px solid rgba(191,155,74,.32);border-radius:8px;color:#BF9B4A;font-family:Cinzel,serif;font-size:.5rem;font-weight:700;cursor:pointer;white-space:nowrap;">ISCRIVITI</button>'+
      '</div>'+
      '<div style="text-align:center;margin-top:18px;"><a href="mailto:info@sommelierworld.vin" style="color:rgba(191,155,74,.5);font-size:13px;text-decoration:none;">info@sommelierworld.vin</a></div>'+
    '</div>';
  document.body.appendChild(p);p.style.display='block';document.body.style.overflow='hidden';
};

window.SW23={
  closeReader:function(){var r=document.getElementById('sw23-reader');if(r)r.style.display='none';document.body.style.overflow='';_readerOpen=false;},
  closeContact:function(){
    var p=document.getElementById('sw23-cp');if(p)p.style.display='none';
    document.body.style.overflow='';
    document.querySelectorAll('.ntab').forEach(function(t){t.classList.remove('active');});
    var h=document.querySelector('.ntab[data-page="home"]');if(h)h.classList.add('active');
    checkVis();
  },
  sendMsg:async function(){
    var n=(document.getElementById('sw23-cn')||{}).value||'';
    var e=(document.getElementById('sw23-ce')||{}).value||'';
    var m=(document.getElementById('sw23-cm')||{}).value||'';
    var err=document.getElementById('sw23-cerr');
    n=n.trim();e=e.trim();m=m.trim();
    function se(t){if(err){err.textContent=t;err.style.display='block';}}
    if(!n)return se('Inserisci il nome.');
    if(!e||!e.includes('@'))return se('Email non valida.');
    if(m.length<4)return se('Messaggio troppo corto.');
    if(err)err.style.display='none';
    var sent=false;
    try{var ctrl=new AbortController();setTimeout(function(){ctrl.abort();},8000);
      var r=await fetch(SRV+'/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name:n,email:e,subject:'Messaggio',message:m}),signal:ctrl.signal});
      if(r.ok){var d=await r.json();sent=!!d.ok;}
    }catch(ex){}
    if(!sent)window.location.href='mailto:info@sommelierworld.vin?subject=[SW]&body='+encodeURIComponent('Da: '+n+'\nEmail: '+e+'\n\n'+m);
    var frm=document.getElementById('sw23-cfrm'),ok=document.getElementById('sw23-cok');
    if(frm)frm.style.display='none';if(ok)ok.style.display='block';
  },
  subscribe:async function(){
    var email=(document.getElementById('sw23-nle')||{}).value||'';email=email.trim();
    if(!email||!email.includes('@'))return;
    try{var sl=JSON.parse(localStorage.getItem('sw_nl')||'[]');if(!sl.includes(email)){sl.push(email);localStorage.setItem('sw_nl',JSON.stringify(sl));}}catch(ex){}
    try{await fetch(SRV+'/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Newsletter',email:email,subject:'Newsletter',message:'Iscrizione'})});}catch(ex){}
    var nl=document.getElementById('sw23-nle');if(nl){nl.value='';nl.placeholder='✓ Iscritto!';}
  }
};

/* Kill FAB vecchi */
function killOld(){
  document.querySelectorAll('#sw11-fab-contact,[id*="fab-contact"]:not(#sw23-fab),#sw10-contact').forEach(function(el){
    el.style.setProperty('display','none','important');
  });
  window.fixContactButton=function(){};
}
var _ki=setInterval(function(){killOld();},700);
setTimeout(function(){clearInterval(_ki);},8000);

/* Mappa dark */
var _mw=setInterval(function(){
  if(typeof L!=='undefined'&&window.TILES){
    window.TILES.street='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    clearInterval(_mw);
  }
},800);
setTimeout(function(){clearInterval(_mw);},15000);

/* ═══════════════════════════════════════════
   LINGUA
   ═══════════════════════════════════════════ */
function hookLang(){
  var orig=window.i18n&&window.i18n.setLang&&window.i18n.setLang.bind(window.i18n);
  if(!orig)return;
  window.i18n.setLang=function(l){
    orig(l);try{localStorage.setItem('sw_lang',l);}catch(e){}
    setTimeout(function(){renderSlides();buildTicker();render3Art();},200);
  };
}

/* ═══════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════ */
function init(){
  killOld();
  fixSommelier();   // FIX PRINCIPALE: paese obbligatorio
  addContactTab();addFAB();
  injectNews();injectSapere();injectCuriosity();
  hookPage();hookLang();checkVis();
  loadArts();
  /* Lingua persistente */
  setTimeout(function(){
    var saved=localStorage.getItem('sw_lang');
    if(saved&&saved!=='it'&&window.i18n)window.i18n.setLang(saved);
  },600);
  console.log('[v23] ✓ Init completato');
}

document.readyState==='loading'
  ? document.addEventListener('DOMContentLoaded',init)
  : init();

})();
