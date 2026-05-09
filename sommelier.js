/* sommelier.js v30-2026-05-07 */
console.log('%c sommelier.js v30-2026-05-07 ✅ ','background:#1a0a05;color:#90EE90;padding:2px 6px;');
/**
 * SOMMELIER WORLD — sommelier.js v30
 * ─────────────────────────────────────────────────────────────
 * NUOVO: Sistema di apprendimento adattivo (TasteMemory).
 *        Il Sommelier impara dai tuoi feedback e migliora nel tempo.
 * FIX:   Prompt Free corretto — risposta più precisa e professionale.
 * B2C:   Paywall 3 consultazioni/giorno, Elite illimitato €2.99/mese.
 * B2B:   Pacchetti cantina solo nella pagina Produttori (non qui).
 */

function _getSRV() {
  try { return window.SRV || 'https://hidden-term-f2d0.timotiniurie49.workers.dev'; }
  catch(e) { return 'https://hidden-term-f2d0.timotiniurie49.workers.dev'; }
}

// ═══════════════════════════════════════════════════════════
// REGIONI DEL MONDO
// ═══════════════════════════════════════════════════════════
window.REGIONI = {
  'Italia':       ['Piemonte','Toscana','Veneto','Sicilia','Campania','Friuli-Venezia Giulia',
                   'Alto Adige','Sardegna','Umbria','Marche','Lombardia','Abruzzo','Puglia','Trentino','Lazio'],
  'Francia':      ['Borgogna','Bordeaux','Rodano','Alsazia','Champagne','Loira',
                   'Languedoc-Roussillon','Provenza','Beaujolais','Jura'],
  'Spagna':       ['Rioja','Ribera del Duero','Priorat','Rías Baixas','Jerez','Toro','Penedès'],
  'USA':          ['Napa Valley','Sonoma','Willamette Valley','Paso Robles','Santa Barbara'],
  'Germania':     ['Mosel','Rheingau','Pfalz','Baden','Rheinhessen','Nahe'],
  'Portogallo':   ['Douro','Alentejo','Vinho Verde','Dão','Bairrada'],
  'Argentina':    ['Mendoza','Salta','Patagonia','Uco Valley'],
  'Cile':         ['Maipo','Colchagua','Casablanca','Elqui'],
  'Australia':    ['Barossa Valley','McLaren Vale','Clare Valley','Yarra Valley','Margaret River'],
  'Nuova Zelanda':["Marlborough","Central Otago","Hawke's Bay"],
  'Grecia':       ['Santorini','Naoussa','Nemea','Creta'],
  'Austria':      ['Wachau','Kamptal','Kremstal','Burgenland'],
  'Ungheria':     ['Tokaj','Eger','Villány'],
  'Georgia':      ['Kakheti','Kartli','Imereti'],
  'Sud Africa':   ['Stellenbosch','Swartland','Franschhoek'],
};

var _ESEMPI_PAESE = {
  'Italia':       'Barolo (Gaja, Giacomo Conterno, Mascarello), Brunello (Biondi-Santi), Sassicaia, Amarone (Dal Forno)',
  'Francia':      "Romanée-Conti, Pétrus, Dom Pérignon, Hermitage, Sauternes (Château d'Yquem)",
  'Spagna':       'Rioja Gran Reserva (Muga, CVNE), Ribera del Duero (Vega Sicilia), Albariño',
  'USA':          "Napa Cabernet (Opus One, Screaming Eagle, Stag's Leap), Willamette Pinot Noir",
  'Germania':     'Riesling Mosel (Egon Müller, JJ Prüm, Clemens Busch), Spätburgunder',
  'Portogallo':   "Porto Vintage (Niepoort, Graham's), Douro Touriga Nacional, Vinho Verde",
  'Argentina':    'Mendoza Malbec (Catena Zapata, Achaval Ferrer), Salta Torrontés',
  'Cile':         'Almaviva, Don Melchor, Concha y Toro Terrunyo',
  'Australia':    'Penfolds Grange, Henschke Hill of Grace, Grosset Polish Hill Riesling',
  'Nuova Zelanda':'Cloudy Bay Sauvignon Blanc, Felton Road Pinot Noir',
  'Grecia':       'Assyrtiko Santorini (Gaia, Sigalas), Xinomavro Naoussa (Kyr-Yianni)',
  'Austria':      'Wachau Grüner Veltliner (Hirtzberger, Knoll), Blaufränkisch',
  'Ungheria':     'Tokaji Aszú (Royal Tokaji, Oremus)',
  'Georgia':      "Kakheti Rkatsiteli in kvevri (Pheasant's Tears)",
  'Sud Africa':   'Kanonkop Pinotage, Meerlust Rubicon, Sadie Family',
};

// ═══════════════════════════════════════════════════════════
// ▌▌▌ TASTE MEMORY — IL SOMMELIER CHE IMPARA ▌▌▌
//
// Sistema di apprendimento adattivo basato su feedback.
// Ogni consulenza valutata positivamente diventa un "esempio"
// che il Sommelier usa nelle consulenze future come riferimento.
// Col tempo costruisce un profilo gusto personalizzato sempre
// più preciso — senza mai inviare dati a server esterni.
// Tutto rimane sul dispositivo dell'utente.
// ═══════════════════════════════════════════════════════════
window.TasteMemory = (function() {
  var KEY_SESSIONS  = 'sw_tm_sessions';   // storico sessioni
  var KEY_POSITIVE  = 'sw_tm_positive';   // abbinamenti approvati
  var KEY_NEGATIVE  = 'sw_tm_negative';   // abbinamenti bocciati
  var KEY_PREFS     = 'sw_tm_prefs';      // preferenze estratte
  var MAX_EXAMPLES  = 8;  // massimi esempi positivi in prompt

  function readJSON(k, def) {
    try { var v=localStorage.getItem(k); return v?JSON.parse(v):def; } catch(e){ return def; }
  }
  function writeJSON(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) {}
  }

  /* ── Struttura di una sessione ── */
  function makeSession(menu, budget, params, wine) {
    return {
      id:    Date.now(),
      ts:    new Date().toISOString(),
      menu:  menu.substring(0,200),
      wine:  wine.substring(0,100),
      budget:Number(budget)||50,
      paese: params.paese||'',
      profilo: params.acidita+'/'+params.morbidezza+'/'+params.struttura,
      vote:  0,  // +1 positivo, -1 negativo, 0 non votato
    };
  }

  /* ── Salva sessione corrente ── */
  function saveSession(sess) {
    var sessions = readJSON(KEY_SESSIONS, []);
    sessions.unshift(sess);
    if(sessions.length > 30) sessions = sessions.slice(0,30);
    writeJSON(KEY_SESSIONS, sessions);
    return sess.id;
  }

  /* ── Registra voto ── */
  function recordVote(sessId, vote) {
    var sessions = readJSON(KEY_SESSIONS, []);
    var sess = sessions.find(function(s){return s.id===sessId;});
    if(!sess) return;
    sess.vote = vote;
    writeJSON(KEY_SESSIONS, sessions);

    if(vote===1) {
      // Salva come esempio positivo
      var pos = readJSON(KEY_POSITIVE, []);
      pos.unshift({menu:sess.menu, wine:sess.wine, budget:sess.budget, paese:sess.paese});
      if(pos.length>MAX_EXAMPLES) pos=pos.slice(0,MAX_EXAMPLES);
      writeJSON(KEY_POSITIVE, pos);
      updatePreferences(sessions);
    } else if(vote===-1) {
      // Salva come esempio negativo
      var neg = readJSON(KEY_NEGATIVE, []);
      neg.unshift({menu:sess.menu, wine:sess.wine});
      if(neg.length>10) neg=neg.slice(0,10);
      writeJSON(KEY_NEGATIVE, neg);
    }
  }

  /* ── Estrae preferenze aggregate ── */
  function updatePreferences(sessions) {
    var pos = sessions.filter(function(s){return s.vote===1;});
    if(!pos.length) return;
    var paesi={}, budget=[], profili={};
    pos.forEach(function(s){
      if(s.paese) paesi[s.paese]=(paesi[s.paese]||0)+1;
      if(s.budget) budget.push(s.budget);
      if(s.profilo) profili[s.profilo]=(profili[s.profilo]||0)+1;
    });
    var topPaese = Object.keys(paesi).sort(function(a,b){return paesi[b]-paesi[a];})[0]||'';
    var avgBudget = budget.length
      ? Math.round(budget.reduce(function(a,b){return a+b;},0)/budget.length) : 50;
    var topProfilo = Object.keys(profili).sort(function(a,b){return profili[b]-profili[a];})[0]||'';
    writeJSON(KEY_PREFS, {topPaese:topPaese, avgBudget:avgBudget, topProfilo:topProfilo, totalVotes:pos.length});
  }

  /* ══════════════════════════════════════
     API PUBBLICA
     ══════════════════════════════════════ */
  return {

    /* Crea e salva sessione, ritorna ID */
    startSession: function(menu, budget, params) {
      var sess = makeSession(menu, budget, params, 'in attesa…');
      return saveSession(sess);
    },

    /* Aggiorna il vino scelto per una sessione */
    updateWine: function(sessId, wine) {
      var sessions = readJSON(KEY_SESSIONS, []);
      var sess = sessions.find(function(s){return s.id===sessId;});
      if(sess) { sess.wine = wine.substring(0,100); writeJSON(KEY_SESSIONS, sessions); }
    },

    /* Registra feedback positivo */
    upvote: function(sessId) { recordVote(sessId, 1); },

    /* Registra feedback negativo */
    downvote: function(sessId) { recordVote(sessId, -1); },

    /* Costruisce il contesto di apprendimento per il prompt AI */
    buildLearningContext: function(currentMenu) {
      var pos  = readJSON(KEY_POSITIVE, []);
      var neg  = readJSON(KEY_NEGATIVE, []);
      var prefs= readJSON(KEY_PREFS, {});
      var sessions = readJSON(KEY_SESSIONS, []);

      if(!sessions.length) return '';

      var lines = [];
      lines.push('');
      lines.push('╔══════════════════════════════════════════════════╗');
      lines.push('║  PROFILO APPRENDIMENTO OSPITE — DATI REALI      ║');
      lines.push('╚══════════════════════════════════════════════════╝');

      var totalVoted = sessions.filter(function(s){return s.vote!==0;}).length;
      if(totalVoted>0) lines.push('Consulenze con feedback: '+totalVoted+' sessioni');

      if(prefs.totalVotes>0){
        if(prefs.topPaese) lines.push('Paese preferito: '+prefs.topPaese+' (dalla storia reale)');
        if(prefs.avgBudget) lines.push('Budget abituale: €'+prefs.avgBudget+' (media storica)');
      }

      if(pos.length>0){
        lines.push('');
        lines.push('✅ ABBINAMENTI CHE QUESTO OSPITE HA APPREZZATO:');
        lines.push('(Usa questi come ispirazione per il tuo stile di consiglio)');
        pos.slice(0,4).forEach(function(p){
          lines.push('  Menu: "'+p.menu.substring(0,80)+'" → Vino: '+p.wine);
        });
        lines.push('ISTRUZIONE: ispirati a questi esempi per il tuo stile di consiglio.');
      }

      if(neg.length>0){
        lines.push('');
        lines.push('❌ ABBINAMENTI CHE QUESTO OSPITE NON HA APPREZZATO:');
        neg.slice(0,3).forEach(function(n){
          lines.push('  Menu: "'+n.menu.substring(0,60)+'" → '+n.wine+' (NON riproporre)');
        });
        lines.push('ISTRUZIONE: evita vini simili a quelli bocciati.');
      }

      lines.push('══════════════════════════════════════════════════');
      lines.push('Questo ospite ha un profilo gusto preciso — adatta le tue raccomandazioni.');
      lines.push('');

      return lines.join('\n');
    },

    /* Stats per il badge */
    getStats: function() {
      var sessions = readJSON(KEY_SESSIONS, []);
      var pos = readJSON(KEY_POSITIVE, []);
      return {
        total:    sessions.length,
        positivi: pos.length,
        prefs:    readJSON(KEY_PREFS, {}),
      };
    },

    /* Mostra popup con il profilo apprendimento */
    showLearningProfile: function() {
      var stats = this.getStats();
      var pos   = readJSON(KEY_POSITIVE, []);
      var neg   = readJSON(KEY_NEGATIVE, []);
      var prefs = stats.prefs;

      var ov = document.createElement('div');
      ov.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(5,2,1,.92);display:flex;align-items:center;justify-content:center;padding:20px;';
      ov.onclick = function(e){ if(e.target===ov) ov.remove(); };

      var paeseInfo = prefs.topPaese ? '🌍 Preferisce vini di <strong style="color:#F5EFE2">'+prefs.topPaese+'</strong>' : '';
      var budgetInfo= prefs.avgBudget? '💶 Budget medio <strong style="color:#F5EFE2">€'+prefs.avgBudget+'</strong>' : '';

      ov.innerHTML =
        '<div style="background:linear-gradient(160deg,#1a0a04,#0d0602);border:1px solid rgba(212,175,55,.4);'+
        'border-radius:16px;max-width:380px;width:100%;padding:28px 22px;pointer-events:auto;" onclick="event.stopPropagation()">'+

          '<div style="text-align:center;margin-bottom:20px;">'+
            '<div style="font-size:2rem;margin-bottom:8px;">🧠</div>'+
            '<div style="font-family:Cinzel,serif;font-size:.8rem;letter-spacing:3px;color:#D4AF37;">IL SOMMELIER CHE IMPARA</div>'+
            '<div style="font-family:\'IM Fell English\',serif;font-style:italic;font-size:.88rem;'+
              'color:rgba(245,239,226,.5);margin-top:6px;">Il tuo profilo gusto personale</div>'+
          '</div>'+

          '<div style="background:rgba(212,175,55,.06);border:1px solid rgba(212,175,55,.15);border-radius:10px;padding:16px;margin-bottom:16px;">'+
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;text-align:center;">'+
              '<div><div style="font-family:Cinzel,serif;font-size:1.4rem;font-weight:700;color:#D4AF37;">'+stats.total+'</div>'+
                '<div style="font-family:Cinzel,serif;font-size:.42rem;letter-spacing:1px;color:rgba(245,239,226,.4);">CONSULENZE</div></div>'+
              '<div><div style="font-family:Cinzel,serif;font-size:1.4rem;font-weight:700;color:#7dda8a;">'+stats.positivi+'</div>'+
                '<div style="font-family:Cinzel,serif;font-size:.42rem;letter-spacing:1px;color:rgba(245,239,226,.4);">PREFERITE</div></div>'+
            '</div>'+
          '</div>'+

          (paeseInfo||budgetInfo
            ? '<div style="font-family:\'Cormorant Garamond\',serif;font-size:.95rem;line-height:2;color:rgba(245,239,226,.75);margin-bottom:16px;">'+
                (paeseInfo?'<div>'+paeseInfo+'</div>':'')+
                (budgetInfo?'<div>'+budgetInfo+'</div>':'')+
              '</div>'
            : '')+

          (pos.length
            ? '<div style="margin-bottom:14px;">'+
                '<div style="font-family:Cinzel,serif;font-size:.48rem;letter-spacing:2px;color:rgba(212,175,55,.65);margin-bottom:8px;">✅ VINI CHE TI PIACCIONO</div>'+
                pos.slice(0,3).map(function(p){
                  return '<div style="font-family:\'Cormorant Garamond\',serif;font-size:.9rem;color:rgba(245,239,226,.65);'+
                    'padding:4px 0;border-bottom:1px solid rgba(212,175,55,.08);">'+p.wine+'</div>';
                }).join('')+
              '</div>'
            : '<div style="text-align:center;font-family:\'IM Fell English\',serif;font-style:italic;font-size:.9rem;color:rgba(245,239,226,.3);margin-bottom:14px;">'+
                'Usa il Sommelier e lascia feedback 👍 o 👎 per addestrarlo ai tuoi gusti.</div>')+

          (stats.total===0
            ? '<div style="background:rgba(212,175,55,.08);border:1px solid rgba(212,175,55,.2);border-radius:8px;padding:12px;text-align:center;margin-bottom:14px;">'+
                '<div style="font-family:Cinzel,serif;font-size:.52rem;letter-spacing:2px;color:#D4AF37;margin-bottom:4px;">COME FUNZIONA</div>'+
                '<div style="font-family:\'Cormorant Garamond\',serif;font-size:.88rem;color:rgba(245,239,226,.6);line-height:1.7;">'+
                  'Ogni volta che ricevi un consiglio, tocca 👍 o 👎.<br>'+
                  'Il Sommelier impara i tuoi gusti e diventa<br>sempre più preciso nel tempo.'+
                '</div>'+
              '</div>'
            : '')+

          '<button onclick="this.closest(\'div[style*=fixed]\').remove()" '+
            'style="width:100%;padding:12px;background:rgba(212,175,55,.14);border:1.5px solid rgba(212,175,55,.3);'+
            'border-radius:10px;color:#D4AF37;font-family:Cinzel,serif;font-size:.54rem;letter-spacing:2px;cursor:pointer;">'+
            'CHIUDI</button>'+

        '</div>';

      document.body.appendChild(ov);
    },

    /* Render badge in basso a destra */
    renderBadge: function() {
      var stats = this.getStats();
      var badge = document.getElementById('sw-memory-badge');
      if(!badge) {
        badge = document.createElement('button');
        badge.id = 'sw-memory-badge';
        badge.style.cssText = [
          'position:fixed','bottom:16px','left:12px','z-index:9998','background:rgba(10,6,4,.82)','border:1px solid rgba(212,175,55,.18)','border-radius:20px','padding:5px 11px','cursor:pointer','opacity:.55','font-family:Cinzel,serif','font-size:.48rem','color:rgba(212,175,55,.7)',
        ].join(';');
        badge.title = 'Il tuo Sommelier personale — toccami per il profilo apprendimento';
        badge.onclick = function(){ window.TasteMemory.showLearningProfile(); };
        badge.onmouseover = function(){ this.style.opacity='1'; };
        badge.onmouseout  = function(){ this.style.opacity='.55'; };
        document.body.appendChild(badge);
      }
      /* Aggiorna testo badge */
      badge.textContent = stats.total === 0 ? '🧠' : '🧠 '+stats.total;
    },

    /* Reset completo (per testing) */
    reset: function() {
      [KEY_SESSIONS,KEY_POSITIVE,KEY_NEGATIVE,KEY_PREFS].forEach(function(k){
        try{localStorage.removeItem(k);}catch(e){}
      });
      window.TasteMemory.renderBadge();
    },
  };
})();
// ═══════════════════════════════════════════════════════════
// REGIONI DEL MONDO
// ═══════════════════════════════════════════════════════════
window.REGIONI = {
  'Italia':       ['Piemonte','Toscana','Veneto','Sicilia','Campania','Friuli-Venezia Giulia',
                   'Alto Adige','Sardegna','Umbria','Marche','Lombardia','Abruzzo','Puglia','Trentino','Lazio'],
  'Francia':      ['Borgogna','Bordeaux','Rodano','Alsazia','Champagne','Loira',
                   'Languedoc-Roussillon','Provenza','Beaujolais','Jura'],
  'Spagna':       ['Rioja','Ribera del Duero','Priorat','Rías Baixas','Jerez','Toro','Penedès'],
  'USA':          ['Napa Valley','Sonoma','Willamette Valley','Paso Robles','Santa Barbara'],
  'Germania':     ['Mosel','Rheingau','Pfalz','Baden','Rheinhessen','Nahe'],
  'Portogallo':   ['Douro','Alentejo','Vinho Verde','Dão','Bairrada'],
  'Argentina':    ['Mendoza','Salta','Patagonia','Uco Valley'],
  'Cile':         ['Maipo','Colchagua','Casablanca','Elqui'],
  'Australia':    ['Barossa Valley','McLaren Vale','Clare Valley','Yarra Valley','Margaret River'],
  'Nuova Zelanda':["Marlborough","Central Otago","Hawke's Bay"],
  'Grecia':       ['Santorini','Naoussa','Nemea','Creta'],
  'Austria':      ['Wachau','Kamptal','Kremstal','Burgenland'],
  'Ungheria':     ['Tokaj','Eger','Villány'],
  'Georgia':      ['Kakheti','Kartli','Imereti'],
  'Sud Africa':   ['Stellenbosch','Swartland','Franschhoek'],
};

var _ESEMPI_PAESE = {
  'Italia':       'Barolo (Gaja, Giacomo Conterno, Mascarello), Brunello (Biondi-Santi), Sassicaia, Amarone (Dal Forno)',
  'Francia':      "Romanée-Conti, Pétrus, Dom Pérignon, Hermitage, Sauternes (Château d'Yquem)",
  'Spagna':       'Rioja Gran Reserva (Muga, CVNE), Ribera del Duero (Vega Sicilia), Albariño',
  'USA':          "Napa Cabernet (Opus One, Screaming Eagle, Stag's Leap), Willamette Pinot Noir",
  'Germania':     'Riesling Mosel (Egon Müller, JJ Prüm, Clemens Busch), Spätburgunder',
  'Portogallo':   "Porto Vintage (Niepoort, Graham's), Douro Touriga Nacional, Vinho Verde",
  'Argentina':    'Mendoza Malbec (Catena Zapata, Achaval Ferrer), Salta Torrontés',
  'Cile':         'Almaviva, Don Melchor, Concha y Toro Terrunyo',
  'Australia':    'Penfolds Grange, Henschke Hill of Grace, Grosset Polish Hill Riesling',
  'Nuova Zelanda':'Cloudy Bay Sauvignon Blanc, Felton Road Pinot Noir',
  'Grecia':       'Assyrtiko Santorini (Gaia, Sigalas), Xinomavro Naoussa (Kyr-Yianni)',
  'Austria':      'Wachau Grüner Veltliner (Hirtzberger, Knoll), Blaufränkisch',
  'Ungheria':     'Tokaji Aszú (Royal Tokaji, Oremus)',
  'Georgia':      "Kakheti Rkatsiteli in kvevri (Pheasant's Tears)",
  'Sud Africa':   'Kanonkop Pinotage, Meerlust Rubicon, Sadie Family',
};

// ═══════════════════════════════════════════════════════════
// ▌▌▌ TASTE MEMORY — IL SOMMELIER CHE IMPARA ▌▌▌
//
// Sistema di apprendimento adattivo ibrido.
// Tiene una cache locale per velocita e usa Cloudflare KV
// come memoria principale per storico, feedback e profilo gusto.
// ═══════════════════════════════════════════════════════════
window.TasteMemory = (function() {
  var KEY_SESSIONS  = 'sw_tm_sessions';
  var KEY_POSITIVE  = 'sw_tm_positive';
  var KEY_NEGATIVE  = 'sw_tm_negative';
  var KEY_PREFS     = 'sw_tm_prefs';
  var MAX_EXAMPLES  = 8;
  var serverProfile = null;
  var syncPromise = null;

  function readJSON(k, def) {
    try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch(e){ return def; }
  }
  function writeJSON(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) {}
  }
  function emptyProfile() {
    return {
      sessionsCount:0, positiveCount:0, negativeCount:0,
      favoriteCountries:{}, favoriteWineTypes:{}, preferredTraits:{},
      recentLikedWines:[], recentDislikedWines:[], recentDishes:[]
    };
  }
  function normalizeProfile(raw) {
    var p = raw && typeof raw === 'object' ? raw : {};
    return {
      sessionsCount:Number(p.sessionsCount||0)||0,
      positiveCount:Number(p.positiveCount||0)||0,
      negativeCount:Number(p.negativeCount||0)||0,
      favoriteCountries:(p.favoriteCountries&&typeof p.favoriteCountries==='object')?p.favoriteCountries:{},
      favoriteWineTypes:(p.favoriteWineTypes&&typeof p.favoriteWineTypes==='object')?p.favoriteWineTypes:{},
      preferredTraits:(p.preferredTraits&&typeof p.preferredTraits==='object')?p.preferredTraits:{},
      recentLikedWines:Array.isArray(p.recentLikedWines)?p.recentLikedWines.slice(0,8):[],
      recentDislikedWines:Array.isArray(p.recentDislikedWines)?p.recentDislikedWines.slice(0,8):[],
      recentDishes:Array.isArray(p.recentDishes)?p.recentDishes.slice(0,8):[]
    };
  }
  function topKey(map) {
    var keys = Object.keys(map || {});
    if(!keys.length) return '';
    keys.sort(function(a,b){ return (map[b]||0) - (map[a]||0); });
    return keys[0] || '';
  }
  function syncPrefsFromProfile(profile) {
    var p = normalizeProfile(profile);
    writeJSON(KEY_PREFS, {
      topPaese: topKey(p.favoriteCountries),
      topWineType: topKey(p.favoriteWineTypes),
      topTrait: topKey(p.preferredTraits),
      totalVotes: p.positiveCount,
      avgBudget: readJSON(KEY_PREFS, {}).avgBudget || 50
    });
  }
  function makeSession(menu, budget, params, dishAnalysis) {
    return {
      id:'sess_'+Date.now()+'_'+Math.random().toString(36).slice(2,8),
      ts:new Date().toISOString(),
      menu:String(menu||'').substring(0,220),
      wine:'in attesa…',
      budget:Number(budget)||50,
      paese:params.paese||'',
      regione:params.regione||'',
      profilo:params.acidita+'/'+params.morbidezza+'/'+params.struttura,
      wineType:(window._selectedWineType || 'any'),
      dishSummary:dishAnalysis && dishAnalysis.summary ? dishAnalysis.summary : '',
      dishTraits:dishAnalysis && dishAnalysis.traits ? dishAnalysis.traits : {},
      vote:0
    };
  }
  function saveSession(sess) {
    var sessions = readJSON(KEY_SESSIONS, []);
    sessions.unshift(sess);
    if(sessions.length > 30) sessions = sessions.slice(0,30);
    writeJSON(KEY_SESSIONS, sessions);
    return sess.id;
  }
  function getSession(sessId) {
    var sessions = readJSON(KEY_SESSIONS, []);
    return sessions.find(function(s){ return s.id===sessId; }) || null;
  }
  function updateLocalPreferences() {
    var sessions = readJSON(KEY_SESSIONS, []);
    var pos = sessions.filter(function(s){ return s.vote===1; });
    var paesi={}, budget=[], wineTypes={};
    pos.forEach(function(s){
      if(s.paese) paesi[s.paese]=(paesi[s.paese]||0)+1;
      if(s.budget) budget.push(s.budget);
      if(s.wineType && s.wineType!=='any') wineTypes[s.wineType]=(wineTypes[s.wineType]||0)+1;
    });
    writeJSON(KEY_PREFS, {
      topPaese: topKey(paesi),
      avgBudget: budget.length ? Math.round(budget.reduce(function(a,b){ return a+b; },0)/budget.length) : 50,
      topWineType: topKey(wineTypes),
      totalVotes: pos.length
    });
  }
  async function fetchServerProfile() {
    if(syncPromise) return syncPromise;
    syncPromise = fetch(_getSRV() + '/api/learning-profile', { headers:{'Accept':'application/json'} })
      .then(function(r){ return r.json().then(function(d){ return {ok:r.ok, data:d}; }); })
      .then(function(x){
        if(x.ok && x.data && x.data.profile) {
          serverProfile = normalizeProfile(x.data.profile);
          window._swLearningProfile = serverProfile;
          syncPrefsFromProfile(serverProfile);
        }
        return serverProfile || normalizeProfile(window._swLearningProfile || emptyProfile());
      })
      .catch(function(){ return serverProfile || normalizeProfile(window._swLearningProfile || emptyProfile()); })
      .finally(function(){ syncPromise = null; });
    return syncPromise;
  }
  function postLearningEvent(eventName, sessionId, data) {
    return fetch(_getSRV() + '/api/learning-event', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ event:eventName, sessionId:sessionId, data:data||{} })
    })
    .then(function(r){ return r.json().then(function(d){ return {ok:r.ok, data:d}; }); })
    .then(function(x){
      if(x.ok && x.data && x.data.profile) {
        serverProfile = normalizeProfile(x.data.profile);
        window._swLearningProfile = serverProfile;
        syncPrefsFromProfile(serverProfile);
      }
      return x;
    })
    .catch(function(){ return {ok:false}; });
  }
  function recordVoteLocal(sessId, vote) {
    var sessions = readJSON(KEY_SESSIONS, []);
    var sess = sessions.find(function(s){return s.id===sessId;});
    if(!sess) return null;
    sess.vote = vote;
    writeJSON(KEY_SESSIONS, sessions);
    if(vote===1) {
      var pos = readJSON(KEY_POSITIVE, []);
      pos.unshift({menu:sess.menu, wine:sess.wine, budget:sess.budget, paese:sess.paese, wineType:sess.wineType});
      if(pos.length > MAX_EXAMPLES) pos = pos.slice(0,MAX_EXAMPLES);
      writeJSON(KEY_POSITIVE, pos);
    } else if(vote===-1) {
      var neg = readJSON(KEY_NEGATIVE, []);
      neg.unshift({menu:sess.menu, wine:sess.wine});
      if(neg.length > 10) neg = neg.slice(0,10);
      writeJSON(KEY_NEGATIVE, neg);
    }
    updateLocalPreferences();
    return sess;
  }

  return {
    syncServerProfile: function() {
      return fetchServerProfile();
    },

    startSession: async function(menu, budget, params, dishAnalysis) {
      var sess = makeSession(menu, budget, params, dishAnalysis);
      saveSession(sess);
      postLearningEvent('session_start', sess.id, {
        menuExcerpt: sess.menu,
        budget: sess.budget,
        paese: sess.paese,
        regione: sess.regione,
        wineType: sess.wineType,
        dishSummary: sess.dishSummary,
        dishTraits: sess.dishTraits
      });
      return sess.id;
    },

    updateWine: function(sessId, wine) {
      var sessions = readJSON(KEY_SESSIONS, []);
      var sess = sessions.find(function(s){return s.id===sessId;});
      if(sess) {
        sess.wine = String(wine || '').substring(0,100);
        writeJSON(KEY_SESSIONS, sessions);
        postLearningEvent('wine_chosen', sessId, { wine:sess.wine });
      }
    },

    upvote: function(sessId) {
      var sess = recordVoteLocal(sessId, 1);
      if(sess) {
        postLearningEvent('feedback', sessId, {
          vote: 1,
          wine: sess.wine,
          wineType: sess.wineType,
          paese: sess.paese,
          dishSummary: sess.dishSummary,
          dishTraits: sess.dishTraits
        });
      }
    },

    downvote: function(sessId) {
      var sess = recordVoteLocal(sessId, -1);
      if(sess) {
        postLearningEvent('feedback', sessId, {
          vote: -1,
          wine: sess.wine,
          wineType: sess.wineType,
          paese: sess.paese,
          dishSummary: sess.dishSummary,
          dishTraits: sess.dishTraits
        });
      }
    },

    buildLearningContext: async function(currentMenu, dishAnalysis) {
      var pos  = readJSON(KEY_POSITIVE, []);
      var neg  = readJSON(KEY_NEGATIVE, []);
      var prefs= readJSON(KEY_PREFS, {});
      var server = await fetchServerProfile();
      var lines = [];

      if(!(pos.length || neg.length || server.sessionsCount)) return '';

      lines.push('');
      lines.push('╔══════════════════════════════════════════════════╗');
      lines.push('║  PROFILO APPRENDIMENTO OSPITE — DATI REALI      ║');
      lines.push('╚══════════════════════════════════════════════════╝');
      if(server.sessionsCount) lines.push('Storico totale memorizzato: '+server.sessionsCount+' consulenze');
      if(server.positiveCount) lines.push('Feedback positivi memorizzati: '+server.positiveCount);
      if(server.negativeCount) lines.push('Feedback negativi memorizzati: '+server.negativeCount);
      if(prefs.topPaese) lines.push('Paese preferito: '+prefs.topPaese);
      if(prefs.topWineType) lines.push('Tipologia preferita: '+prefs.topWineType);
      if(prefs.avgBudget) lines.push('Budget abituale: €'+prefs.avgBudget);

      var topTrait = topKey(server.preferredTraits);
      if(topTrait) lines.push('Tratto sensoriale ricorrente gradito: '+topTrait);

      if(dishAnalysis && dishAnalysis.summary) {
        lines.push('');
        lines.push('ANALISI TECNICA PIATTI ATTUALI: '+dishAnalysis.summary);
      }

      if(server.recentLikedWines && server.recentLikedWines.length) {
        lines.push('');
        lines.push('✅ VINI APPREZZATI DI RECENTE:');
        server.recentLikedWines.slice(0,4).forEach(function(x){
          lines.push('  - '+x.wine);
        });
      } else if(pos.length) {
        lines.push('');
        lines.push('✅ ABBINAMENTI LOCALI APPREZZATI:');
        pos.slice(0,4).forEach(function(p){
          lines.push('  Menu: "'+p.menu.substring(0,80)+'" → Vino: '+p.wine);
        });
      }

      if(server.recentDislikedWines && server.recentDislikedWines.length) {
        lines.push('');
        lines.push('❌ VINI DA EVITARE O RIDURRE:');
        server.recentDislikedWines.slice(0,3).forEach(function(x){
          lines.push('  - '+x.wine);
        });
      } else if(neg.length) {
        lines.push('');
        lines.push('❌ ABBINAMENTI NON APPREZZATI:');
        neg.slice(0,3).forEach(function(n){
          lines.push('  Menu: "'+n.menu.substring(0,60)+'" → '+n.wine+' (NON riproporre)');
        });
      }

      lines.push('ISTRUZIONE: personalizza il consiglio in base a questo profilo reale, ma senza forzare abbinamenti incoerenti con il piatto attuale.');
      lines.push('');
      return lines.join('\n');
    },

    getStats: function() {
      var sessions = readJSON(KEY_SESSIONS, []);
      var pos = readJSON(KEY_POSITIVE, []);
      var prefs = readJSON(KEY_PREFS, {});
      var server = normalizeProfile(serverProfile || window._swLearningProfile || emptyProfile());
      return {
        total: Math.max(sessions.length, server.sessionsCount || 0),
        positivi: Math.max(pos.length, server.positiveCount || 0),
        negativi: server.negativeCount || 0,
        prefs: prefs,
        server: server
      };
    },

    showLearningProfile: async function() {
      await fetchServerProfile();
      var stats = this.getStats();
      var server = stats.server || emptyProfile();
      var ov = document.createElement('div');
      ov.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(5,2,1,.92);display:flex;align-items:center;justify-content:center;padding:20px;';
      ov.onclick = function(e){ if(e.target===ov) ov.remove(); };
      ov.innerHTML =
        '<div style="background:linear-gradient(160deg,#1a0a04,#0d0602);border:1px solid rgba(212,175,55,.4);border-radius:16px;max-width:400px;width:100%;padding:28px 22px;pointer-events:auto;" onclick="event.stopPropagation()">'+
          '<div style="text-align:center;margin-bottom:20px;">'+
            '<div style="font-size:2rem;margin-bottom:8px;">🧠</div>'+
            '<div style="font-family:Cinzel,serif;font-size:.8rem;letter-spacing:3px;color:#D4AF37;">PROFILO SOMMELIER PERSONALE</div>'+
            '<div style="font-family:\'IM Fell English\',serif;font-style:italic;font-size:.88rem;color:rgba(245,239,226,.5);margin-top:6px;">Memoria gusti e storico tecnico</div>'+
          '</div>'+
          '<div style="background:rgba(212,175,55,.06);border:1px solid rgba(212,175,55,.15);border-radius:10px;padding:16px;margin-bottom:16px;">'+
            '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;text-align:center;">'+
              '<div><div style="font-family:Cinzel,serif;font-size:1.2rem;font-weight:700;color:#D4AF37;">'+stats.total+'</div><div style="font-family:Cinzel,serif;font-size:.4rem;color:rgba(245,239,226,.4);">SESSIONI</div></div>'+
              '<div><div style="font-family:Cinzel,serif;font-size:1.2rem;font-weight:700;color:#7dda8a;">'+stats.positivi+'</div><div style="font-family:Cinzel,serif;font-size:.4rem;color:rgba(245,239,226,.4);">LIKE</div></div>'+
              '<div><div style="font-family:Cinzel,serif;font-size:1.2rem;font-weight:700;color:#f0a0a0;">'+stats.negativi+'</div><div style="font-family:Cinzel,serif;font-size:.4rem;color:rgba(245,239,226,.4);">NO</div></div>'+
            '</div>'+
          '</div>'+
          '<div style="font-family:\'Cormorant Garamond\',serif;font-size:.95rem;line-height:1.8;color:rgba(245,239,226,.78);margin-bottom:16px;">'+
            (stats.prefs.topPaese ? '<div>🌍 Paese preferito: <strong style="color:#F5EFE2">'+stats.prefs.topPaese+'</strong></div>' : '')+
            (stats.prefs.topWineType ? '<div>🍷 Tipologia favorita: <strong style="color:#F5EFE2">'+stats.prefs.topWineType+'</strong></div>' : '')+
            (topKey(server.preferredTraits) ? '<div>🧪 Tendenza sensoriale ricorrente: <strong style="color:#F5EFE2">'+topKey(server.preferredTraits)+'</strong></div>' : '')+
          '</div>'+
          (server.recentLikedWines.length
            ? '<div style="margin-bottom:14px;"><div style="font-family:Cinzel,serif;font-size:.48rem;letter-spacing:2px;color:rgba(212,175,55,.65);margin-bottom:8px;">✅ VINI APPREZZATI</div>'+
              server.recentLikedWines.slice(0,4).map(function(p){
                return '<div style="font-family:\'Cormorant Garamond\',serif;font-size:.9rem;color:rgba(245,239,226,.65);padding:4px 0;border-bottom:1px solid rgba(212,175,55,.08);">'+p.wine+'</div>';
              }).join('')+'</div>'
            : '<div style="text-align:center;font-family:\'IM Fell English\',serif;font-style:italic;font-size:.9rem;color:rgba(245,239,226,.3);margin-bottom:14px;">Usa il Sommelier e lascia feedback per far crescere il tuo profilo.</div>')+
          '<button onclick="this.closest(\'div[style*=fixed]\').remove()" style="width:100%;padding:12px;background:rgba(212,175,55,.14);border:1.5px solid rgba(212,175,55,.3);border-radius:10px;color:#D4AF37;font-family:Cinzel,serif;font-size:.54rem;letter-spacing:2px;cursor:pointer;">CHIUDI</button>'+
        '</div>';
      document.body.appendChild(ov);
    },

    renderBadge: function() {
      var stats = this.getStats();
      var badge = document.getElementById('sw-memory-badge');
      if(!badge) {
        badge = document.createElement('button');
        badge.id = 'sw-memory-badge';
        badge.style.cssText = [
          'position:fixed','bottom:76px','right:12px','z-index:9998',
          'background:rgba(10,6,4,.92)','border:1px solid rgba(212,175,55,.3)',
          'border-radius:24px','padding:6px 14px','display:flex','align-items:center','gap:6px',
          'cursor:pointer','transition:all .22s','box-shadow:0 4px 20px rgba(0,0,0,.5)',
          'font-family:Cinzel,serif','font-size:.5rem','letter-spacing:0','color:rgba(212,175,55,.6)'
        ].join(';');
        badge.onclick = function(){ window.TasteMemory.showLearningProfile(); };
        badge.onmouseover = function(){ this.style.opacity='1'; };
        badge.onmouseout  = function(){ this.style.opacity='.55'; };
        document.body.appendChild(badge);
      }
      badge.textContent = stats.total === 0 ? '🧠' : '🧠 '+stats.total;
      badge.title = stats.total === 0
        ? 'Il Sommelier impara dai tuoi gusti'
        : 'Profilo attivo: '+stats.total+' sessioni, '+stats.positivi+' feedback positivi';
    },

    reset: function() {
      [KEY_SESSIONS,KEY_POSITIVE,KEY_NEGATIVE,KEY_PREFS].forEach(function(k){
        try{localStorage.removeItem(k);}catch(e){}
      });
      serverProfile = null;
      window._swLearningProfile = null;
      window.TasteMemory.renderBadge();
    },
  };
})();

// ═══════════════════════════════════════════════════════════
// QUICK MENUS
// ═══════════════════════════════════════════════════════════
window.quickMenu = function(type) {
  var menus = {
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
  var ta = document.getElementById('menuText');
  if(ta && menus[type]) { ta.value = menus[type]; ta.focus(); }
};

// ═══════════════════════════════════════════════════════════
// SLIDER PROFILO
// ═══════════════════════════════════════════════════════════
window.updateSlider = function(id, labels, val) {
  var lbl = document.getElementById(id+'Val');
  if(lbl) lbl.textContent = labels[parseInt(val)-1]||labels[2];
  var s = document.getElementById(id);
  if(s) s.style.setProperty('--pct', ((parseInt(val)-1)/4*100).toFixed(0)+'%');
};

window.getWineParams = function() {
  function getL(id,arr){ var e=document.getElementById(id); return e?arr[parseInt(e.value)-1]:arr[2]; }
  return {
    acidita:    getL('acidita',   ['Bassa','Medio-bassa','Media','Medio-alta','Alta']),
    morbidezza: getL('morbidezza',['Secco e asciutto','Poco morbido','Equilibrato','Morbido','Avvolgente']),
    struttura:  getL('struttura', ['Leggero e delicato','Medio-leggero','Equilibrato','Pieno','Potente e concentrato']),
    paese:  (document.getElementById('winePaese')  ||{}).value||'',
    regione:(document.getElementById('wineRegione')||{}).value||'',
  };
};

function _extractMenuDishLinesForAnalysis(menu){
  return String(menu || '')
    .replace(/\r/g,'')
    .split('\n')
    .map(function(line){ return String(line || '').replace(/^[^A-Za-zÀ-ÿ0-9]+/,'').trim(); })
    .filter(function(line){
      if(!line) return false;
      if(/^(antipasti|primi|secondi|contorni|dessert|dolci|menu|selezionato dalla foto)\s*:?\s*$/i.test(line)) return false;
      return line.length >= 3;
    })
    .slice(0, 12);
}

function _buildDishTechnicalAnalysis(menu){
  var lines = _extractMenuDishLinesForAnalysis(menu);
  var traits = {
    grassezza:1, untuosita:1, succulenza:1, sapidita:1,
    tendenzaDolce:1, amarognolo:1, speziatura:1, aromaticita:1, persistenza:1
  };
  var rules = [
    { re:/burro|fritto|fritta|frittura|panna|formaggio|fonduta|carbonara|guanciale|maionese|lardo|burrata|parmigiana/i, key:'grassezza', add:2 },
    { re:/olio|crema|vellutata|mantecato|risotto|ragu|ragù|brasato|stufato/i, key:'untuosita', add:2 },
    { re:/carne|manzo|vitello|agnello|anatra|piccione|cinghiale|selvaggina|costata|arrosto|tartare|brasato/i, key:'succulenza', add:2 },
    { re:/acciug|baccala|baccalà|caviale|ostrica|cozza|vongol|pecorino|parmigiano|sapido/i, key:'sapidita', add:2 },
    { re:/zucca|carota|pomodorini|cipolla caramellata|mais|miele|frutta|castagna/i, key:'tendenzaDolce', add:2 },
    { re:/radicchio|carciofo|cacao|amaro|scarola|puntarelle/i, key:'amarognolo', add:2 },
    { re:/pepe|peperoncino|curry|paprika|spezi|zenzero/i, key:'speziatura', add:2 },
    { re:/tartufo|funghi|erbe|agrumi|lime|limone|rosmarino|salvia|basilico|menta|zafferano/i, key:'aromaticita', add:2 },
    { re:/selvaggina|tartufo|brasato|riduzione|affumicat|stagionat|ragu|ragù|porcini/i, key:'persistenza', add:2 }
  ];

  lines.forEach(function(line){
    rules.forEach(function(rule){
      if(rule.re.test(line)) traits[rule.key] += rule.add;
    });
  });

  Object.keys(traits).forEach(function(k){
    traits[k] = Math.max(1, Math.min(5, traits[k]));
  });

  var dominantDish = '';
  var bestScore = -1;
  lines.forEach(function(line){
    var score = 0;
    rules.forEach(function(rule){ if(rule.re.test(line)) score += rule.add; });
    if(score > bestScore) { bestScore = score; dominantDish = line; }
  });
  if(!dominantDish) dominantDish = lines[0] || 'Piatto non determinato';

  function level(v){
    if(v >= 5) return 'molto alta';
    if(v >= 4) return 'alta';
    if(v >= 3) return 'media';
    if(v >= 2) return 'medio-bassa';
    return 'bassa';
  }

  var summary =
    'Piatto guida: ' + dominantDish + '. ' +
    'Grassezza ' + level(traits.grassezza) + ', untuosita ' + level(traits.untuosita) + ', succulenza ' + level(traits.succulenza) + ', sapidita ' + level(traits.sapidita) + ', aromaticita ' + level(traits.aromaticita) + ', persistenza ' + level(traits.persistenza) + '.';

  var prompt =
    '\n\nANALISI TECNICA PIATTI (generata dal sistema, usa questa base prima di scegliere i vini):\n' +
    '- Piatto guida: ' + dominantDish + '\n' +
    '- Grassezza: ' + traits.grassezza + '/5\n' +
    '- Untuosita: ' + traits.untuosita + '/5\n' +
    '- Succulenza: ' + traits.succulenza + '/5\n' +
    '- Sapidita: ' + traits.sapidita + '/5\n' +
    '- Tendenza dolce: ' + traits.tendenzaDolce + '/5\n' +
    '- Amarognolo: ' + traits.amarognolo + '/5\n' +
    '- Speziatura: ' + traits.speziatura + '/5\n' +
    '- Aromaticita: ' + traits.aromaticita + '/5\n' +
    '- Persistenza: ' + traits.persistenza + '/5\n' +
    '- Piatti letti: ' + (lines.length ? lines.join(' | ') : 'nessuno');

  return {
    dishes: lines,
    dominantDish: dominantDish,
    traits: traits,
    summary: summary,
    prompt: prompt
  };
}

// ═══════════════════════════════════════════════════════════
// SELECT PAESE → REGIONE
// ═══════════════════════════════════════════════════════════
window.REGIONI_LABELS = window.REGIONI_LABELS || {};

window.loadTerroirStaticData = async function() {
  try {
    var lang = window.getLang ? window.getLang() : 'it';
    var resp = await fetch((window.SRV || window.location.origin) + '/api/terroir-static?lang=' + encodeURIComponent(lang), {
      headers:{'Accept':'application/json'}
    });
    var data = await resp.json();
    if(!resp.ok || !data || !data.data) return;
    var db = data.data;
    (db.countries || []).forEach(function(c){
      if(c && c.labels && c.labels.it) {
        window.REGIONI_LABELS[c.labels.it] = c.label || c.labels.it;
        if(!window.REGIONI[c.labels.it]) window.REGIONI[c.labels.it] = [];
      }
    });
  } catch(e) {}
};

window.renderCountrySelector = function() {
  var sel = document.getElementById('winePaese');
  if(!sel) return;
  sel.innerHTML = '<option value="">Qualsiasi paese</option>';
  Object.keys(window.REGIONI).forEach(function(p){
    var o = document.createElement('option');
    o.value = p;
    o.textContent = (window.REGIONI_LABELS && window.REGIONI_LABELS[p]) ? window.REGIONI_LABELS[p] : p;
    sel.appendChild(o);
  });
  sel.onchange = window.updateRegioni;
};

window.updateRegioni = function() {
  var paese = (document.getElementById('winePaese')||{}).value||'';
  var sel   = document.getElementById('wineRegione');
  if(!sel) return;
  sel.innerHTML = '<option value="">Qualsiasi regione</option>';
  (window.REGIONI[paese]||[]).forEach(function(r){
    var o=document.createElement('option'); o.value=r; o.textContent=r; sel.appendChild(o);
  });
  sel.disabled = !paese;
};

document.addEventListener('DOMContentLoaded', function() {
  window.renderCountrySelector();
  window.loadTerroirStaticData().then(function(){
    window.renderCountrySelector();
  });
  ['acidita','morbidezza','struttura'].forEach(function(id){
    var s=document.getElementById(id); if(s) s.style.setProperty('--pct','50%');
  });
  var regEl=document.getElementById('wineRegione'); if(regEl) regEl.disabled=true;

  // Badge apprendimento
  window.TasteMemory.renderBadge();
});

// ═══════════════════════════════════════════════════════════
// PRODUTTORI ELITE — priorità AI
// ═══════════════════════════════════════════════════════════
window._eliteProducers = [];

window._loadEliteProducers = async function() {
  /* Senza server: legge produttori Elite dal localStorage */
  try {
    var prods = JSON.parse(localStorage.getItem('sw_producers')||'[]');
    window._eliteProducers = prods
      .filter(function(p){ return p.package==='elite' && p.approved; })
      .map(function(p){ return p.name; })
      .filter(Boolean);
  } catch(e) { window._eliteProducers = []; }
};

window._buildEliteContext = function() {
  if(!window._eliteProducers.length) return '';
  return '\n\n★ PRODUTTORI ELITE SOMMELIER WORLD (cita prioritariamente quando pertinenti):\n'+
    window._eliteProducers.map(function(n){ return '  ✦ '+n; }).join('\n');
};

// ═══════════════════════════════════════════════════════════
// callAPI
// ═══════════════════════════════════════════════════════════
window.callAPI = async function(system, userMsg, lang) {
  /* Chiama il Worker Cloudflare — la API key è protetta lì */
  var ctrl = new AbortController();
  var t = setTimeout(function(){ ctrl.abort(); }, 35000);
  try {
    var r = await fetch(_getSRV() + '/api/ask', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        system:   system,
        userMsg:  userMsg,
        language: lang||(window.getLang?window.getLang():'it'),
        maxTokens:1800,
      }),
      signal:ctrl.signal,
    });
    var d = await r.json();
    if(d && d.quota && typeof window.applyServerQuotaState === 'function') {
      window.applyServerQuotaState(d.quota);
    }
    if(r.ok && d.text) return d.text;
    if(r.status === 402 && d && d.limit_reached) {
      if(typeof window.showPaywallPopup === 'function') window.showPaywallPopup();
    }
    throw new Error(d.error||'Errore AI '+r.status);
  } catch(e) {
    if(e.name==='AbortError') throw new Error('Timeout — riprova tra 30 secondi.');
    throw e;
  } finally { clearTimeout(t); }
};

function _fmt(text) {
  return text
    .replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g,'<em>$1</em>')
    .split('\n').map(function(l){return l||'<br>';}).join('<br>');
}

function _splitSommelierNarrativeAndTechnical(text){
  var raw = String(text || '').replace(/\r/g,'').trim();
  if(!raw) return { primary:'', technical:'' };
  var lines = raw.split('\n');
  var techStart = -1;
  var techEnd = lines.length;

  for(var i = 0; i < lines.length; i++){
    if(/analisi tecnica|piatto guida|grassezza|succulenza|sapidita|aromaticita|persistenza/i.test(lines[i])) {
      techStart = i;
      break;
    }
  }
  if(techStart >= 0){
    for(var j = techStart + 1; j < lines.length; j++){
      if(/🥇|🥈|🥉|1° scelta|2° scelta|3° scelta|selezione 3 vini|progressione/i.test(lines[j])) {
        techEnd = j;
        break;
      }
    }
  }

  if(techStart < 0) return { primary:raw, technical:'' };

  var primaryLines = lines.slice(0, techStart).concat(lines.slice(techEnd));
  return {
    primary: primaryLines.join('\n').trim(),
    technical: lines.slice(techStart, techEnd).join('\n').trim()
  };
}

function _buildSommelierResultHtml(text){
  var parts = _splitSommelierNarrativeAndTechnical(text);
  var icons = '';
  if(/🥇|🥈|🥉|bollicine|bianco|rosso/i.test(String(text || ''))) {
    icons =
      '<div class="som-result-icons">'+
        '<span>🥇 Prima scelta</span>'+
        '<span>🥈 Seconda scelta</span>'+
        '<span>🥉 Terza scelta</span>'+
      '</div>';
  }
  return (
    icons +
    '<div style="font-family:\'Cormorant Garamond\',serif;font-size:1.04rem;line-height:1.86;color:#F5EFE2;">'+_fmt(parts.primary || text || '')+'</div>' +
    (parts.technical
      ? '<details class="luxury-accordion" style="margin-top:16px;">'+
          '<summary><span>' + ((window.i18n && window.i18n.t && window.i18n.t('somTechnicalDetails')) || 'DETTAGLI TECNICI') + '</span></summary>'+
          '<div class="luxury-accordion-body" style="padding-top:14px;font-family:\'Cormorant Garamond\',serif;font-size:1rem;line-height:1.78;color:rgba(245,239,226,.72);">'+_fmt(parts.technical)+'</div>'+
        '</details>'
      : '')
  );
}

// ═══════════════════════════════════════════════════════════
// FOTO MENU
// ═══════════════════════════════════════════════════════════
window._menuPhotoB64 = null;
window._menuPhotoMeta = null;

window._scannedDishes = null; // {antipasti:[], primi:[], secondi:[], dessert:[], altro:[]}

function _setMenuPhotoStatus(text, tone){
  var el = document.getElementById('menuPhotoStatus');
  if(!el) return;
  var color = 'rgba(212,175,55,.55)';
  if(tone === 'bad') color = 'rgba(245,120,120,.75)';
  if(tone === 'good') color = 'rgba(145,220,170,.72)';
  el.style.color = color;
  el.textContent = text || '';
}

function _estimateImageSharpness(ctx, w, h){
  try {
    var sampleW = Math.max(32, Math.min(220, w));
    var sampleH = Math.max(32, Math.min(220, h));
    var tmp = document.createElement('canvas');
    tmp.width = sampleW;
    tmp.height = sampleH;
    var tctx = tmp.getContext('2d');
    tctx.drawImage(ctx.canvas, 0, 0, sampleW, sampleH);
    var data = tctx.getImageData(0, 0, sampleW, sampleH).data;
    var total = 0;
    var count = 0;
    for(var y = 0; y < sampleH - 1; y++){
      for(var x = 0; x < sampleW - 1; x++){
        var i = (y * sampleW + x) * 4;
        var right = i + 4;
        var down = i + sampleW * 4;
        var p = data[i];
        var dx = Math.abs(p - data[right]);
        var dy = Math.abs(p - data[down]);
        total += dx + dy;
        count++;
      }
    }
    return count ? (total / count) : 0;
  } catch(e) {
    return 0;
  }
}

window.handleMenuPhoto = function(input) {
  if(!input.files||!input.files[0]) return;
  var file = input.files[0];

  function applyDataUrl(dataUrl, meta) {
    window._menuPhotoB64 = dataUrl;
    window._menuPhotoMeta = meta || null;
    window._scannedDishes = null;
    var preview = document.getElementById('menuPhotoPreview');
    var img     = document.getElementById('menuPhotoImg');
    if(preview) preview.style.display='block';
    if(img)     img.src = dataUrl;
    var scanBtn = document.getElementById('menuScanBtn');
    if(scanBtn) scanBtn.style.display='block';
    var scanRes = document.getElementById('menuScanResult');
    if(scanRes) scanRes.style.display='none';
    if(meta && meta.isLikelyBlurry){
      _setMenuPhotoStatus('Foto potenzialmente sfocata: meglio rifarla piu vicina, dritta e luminosa.', 'bad');
    } else if(meta) {
      _setMenuPhotoStatus('Foto caricata correttamente. Puoi avviare la scansione del menu.', 'good');
    } else {
      _setMenuPhotoStatus('Foto caricata.', 'good');
    }
  }

  function fallbackReader() {
    var reader = new FileReader();
    reader.onload = function(e) {
      applyDataUrl(e.target.result, {
        originalName: file.name || '',
        originalType: file.type || 'image/*',
        originalBytes: file.size || 0,
        width: 0,
        height: 0,
        processedBytes: String(e.target.result || '').length,
        sharpness: 0,
        isLikelyBlurry: false
      });
    };
    reader.readAsDataURL(file);
  }

  try {
    var objUrl = URL.createObjectURL(file);
    var im = new Image();
    im.onload = function() {
      try {
        var w = im.naturalWidth || im.width || 0;
        var h = im.naturalHeight || im.height || 0;
        if(!w || !h) { fallbackReader(); return; }
        var maxW = 1800;
        var maxH = 1800;
        var scale = Math.min(1, maxW / w, maxH / h);
        var cw = Math.max(1, Math.round(w * scale));
        var ch = Math.max(1, Math.round(h * scale));
        var c = document.createElement('canvas');
        c.width = cw; c.height = ch;
        var ctx = c.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, cw, ch);
        try { ctx.filter = 'grayscale(100%) contrast(145%) brightness(112%)'; } catch(_) {}
        ctx.drawImage(im, 0, 0, cw, ch);
        try { ctx.filter = 'none'; } catch(_) {}
        var sharpness = _estimateImageSharpness(ctx, cw, ch);
        var dataUrl = c.toDataURL('image/jpeg', 0.94);
        applyDataUrl(dataUrl, {
          originalName: file.name || '',
          originalType: file.type || 'image/*',
          originalBytes: file.size || 0,
          width: w,
          height: h,
          processedWidth: cw,
          processedHeight: ch,
          processedBytes: dataUrl.length,
          sharpness: sharpness,
          isLikelyBlurry: (cw < 900 || ch < 900 || sharpness < 18)
        });
      } catch(e) {
        fallbackReader();
      } finally {
        try { URL.revokeObjectURL(objUrl); } catch(e) {}
      }
    };
    im.onerror = function() {
      try { URL.revokeObjectURL(objUrl); } catch(e) {}
      fallbackReader();
    };
    im.src = objUrl;
  } catch(e) {
    fallbackReader();
  }
};

window.clearMenuPhoto = function() {
  window._menuPhotoB64 = null;
  window._menuPhotoMeta = null;
  window._scannedDishes = null;
  var preview = document.getElementById('menuPhotoPreview');
  var input   = document.getElementById('menuPhotoInput');
  var img     = document.getElementById('menuPhotoImg');
  var scanBtn = document.getElementById('menuScanBtn');
  var scanRes = document.getElementById('menuScanResult');
  if(preview) preview.style.display='none';
  if(input)   input.value='';
  if(img)     img.src='';
  if(scanBtn) scanBtn.style.display='none';
  if(scanRes) scanRes.style.display='none';
  _setMenuPhotoStatus('');
};

function _normalizeMenuLine(s){
  return String(s || '')
    .replace(/\s+/g,' ')
    .replace(/^[\s\-–—•*]+/,'')
    .replace(/\b€?\s?\d{1,3}(?:[.,]\d{2})?\b/g,'')
    .replace(/\s{2,}/g,' ')
    .trim();
}

function _extractDishesFromText(rawText){
  var out = { antipasti:[], primi:[], secondi:[], contorni:[], dessert:[], altro:[] };
  var lines = String(rawText || '')
    .replace(/\r/g,'')
    .split('\n')
    .map(_normalizeMenuLine)
    .filter(Boolean);
  var current = 'altro';

  function setCat(line){
    var l = line.toLowerCase();
    if(/antipast/.test(l)) return 'antipasti';
    if(/primi|primo/.test(l)) return 'primi';
    if(/secondi|secondo/.test(l)) return 'secondi';
    if(/contorni|contorno/.test(l)) return 'contorni';
    if(/dessert|dolci|dolce/.test(l)) return 'dessert';
    return '';
  }

  lines.forEach(function(line){
    var cat = setCat(line);
    if(cat) { current = cat; return; }
    if(/ristorante|menu|pranzo|cena|tel\.|italia|www\.|info@|02\.05\.2026/i.test(line)) return;
    if(line.length < 3) return;
    if(out[current].indexOf(line) === -1) out[current].push(line);
  });
  return out;
}

function _normalizeScannedDishes(raw){
  var out = { antipasti:[], primi:[], secondi:[], contorni:[], dessert:[], altro:[] };
  var keyMap = {
    antipasti:'antipasti', antipasto:'antipasti', starters:'antipasti', starter:'antipasti',
    primi:'primi', primo:'primi', 'primi piatti':'primi', first:'primi',
    secondi:'secondi', secondo:'secondi', 'secondi piatti':'secondi', mains:'secondi', main:'secondi',
    contorni:'contorni', contorno:'contorni', sides:'contorni', side:'contorni',
    dessert:'dessert', dolci:'dessert', dolce:'dessert', sweets:'dessert',
    altro:'altro', other:'altro', varie:'altro'
  };

  function pushMany(target, arr){
    if(!arr) return;
    if(typeof arr === 'string') arr = arr.split(/\n|;|\|/g);
    if(!Array.isArray(arr)) return;
    arr.forEach(function(x){
      var v = _normalizeMenuLine(x);
      if(!v) return;
      if(/^(antipasti?|primi?|secondi?|dessert|dolci|contorni?|altro)$/i.test(v)) return;
      if(out[target].indexOf(v) === -1) out[target].push(v);
    });
  }

  if(raw && typeof raw === 'object'){
    Object.keys(raw).forEach(function(k){
      var nk = keyMap[String(k || '').toLowerCase().trim()];
      if(!nk) return;
      pushMany(nk, raw[k]);
    });
  }

  return out;
}

function _countScannedDishes(dishes){
  var total = 0;
  ['antipasti','primi','secondi','contorni','dessert','altro'].forEach(function(k){
    total += ((dishes && dishes[k]) ? dishes[k].length : 0);
  });
  return total;
}

function _cleanWineQueryLocal(s){
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/[^\w\s]/g,' ')
    .replace(/\s+/g,' ')
    .trim();
}

function _escapeHtmlLite(text){
  return String(text || '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

function _formatEuro(value){
  var n = Number(value || 0);
  if(!Number.isFinite(n) || n <= 0) return '';
  return '€' + n.toFixed(2);
}

function _getCommerceMode(){
  try { return localStorage.getItem('sw_commerce_mode') || 'prelaunch'; }
  catch(e) { return 'prelaunch'; }
}

function _isInternalStoreLive(){
  return _getCommerceMode() === 'live';
}

window.getCommerceMode = _getCommerceMode;
window.setCommerceMode = function(mode){
  try { localStorage.setItem('sw_commerce_mode', mode === 'live' ? 'live' : 'prelaunch'); } catch(e) {}
};

function _getWineInventoryState(wine){
  var qty = parseInt(wine && wine.in_store_quantity, 10);
  var price = Number(wine && wine.sw_price);
  var threshold = parseInt(wine && wine.low_stock_threshold, 10);
  qty = Number.isFinite(qty) && qty > 0 ? qty : 0;
  price = Number.isFinite(price) && price > 0 ? Math.round(price * 100) / 100 : 0;
  threshold = Number.isFinite(threshold) && threshold >= 0 ? threshold : 2;
  return {
    quantity: qty,
    price: price,
    lowStockThreshold: threshold,
    available: qty > 0 && price > 0
  };
}

function _isOwnedSommelierWorldWine(wine){
  return !!(wine && wine.owned_by_sw);
}

function _isPrivateCollectionWine(wine){
  return !!(wine && wine.private_collection);
}

function _pickWineMediaUrl(wine, preferStillLife, highRes){
  if(!wine) return '';
  var hdStill = String(wine.still_life_image_hd || '').trim();
  var still = String(wine.still_life_image || '').trim();
  var hdGeneric = String(wine.generic_image_hd || '').trim();
  var generic = String(wine.generic_image || '').trim();
  if(preferStillLife) {
    if(highRes && hdStill) return hdStill;
    if(still) return still;
    if(highRes && hdGeneric) return hdGeneric;
    if(generic) return generic;
  }
  if(highRes && hdGeneric) return hdGeneric;
  if(generic) return generic;
  if(highRes && hdStill) return hdStill;
  if(still) return still;
  return '';
}

window.getWineMediaForUI = function(wine, preferStillLife, highRes){
  return _pickWineMediaUrl(wine, !!preferStillLife, !!highRes);
};

function _buildWineVisualBlock(wine, preferStillLife, compact){
  var img = _pickWineMediaUrl(wine, preferStillLife, !compact);
  var label = _isPrivateCollectionWine(wine)
    ? 'PRIVATE COLLECTION'
    : (_isOwnedSommelierWorldWine(wine) ? 'SOMMELIERWORLD SELECTION' : 'ARCHIVIO ENOLOGICO');
  if(img) {
    return '<div style="position:relative;overflow:hidden;border-radius:'+(compact?'12px':'14px')+';margin-bottom:14px;background:#120905;border:1px solid rgba(212,175,55,.12);">'+
      '<img src="'+_escapeHtmlLite(img)+'" alt="'+_escapeHtmlLite((wine && wine.nome) || 'wine')+'" loading="lazy" style="display:block;width:100%;height:'+(compact?'160px':'280px')+';object-fit:cover;">'+
      '<div style="position:absolute;left:10px;bottom:10px;padding:6px 10px;border-radius:999px;background:rgba(10,8,6,.82);border:1px solid rgba(212,175,55,.22);font-family:Cinzel,serif;font-size:.4rem;letter-spacing:2px;color:#D4AF37;">'+label+'</div>'+
    '</div>';
  }
  return '<div style="position:relative;overflow:hidden;border-radius:'+(compact?'12px':'14px')+';margin-bottom:14px;background:linear-gradient(135deg,rgba(34,18,8,.96),rgba(12,12,12,.98));border:1px solid rgba(212,175,55,.12);height:'+(compact?'160px':'280px')+';">'+
    '<div style="position:absolute;inset:0;background:radial-gradient(circle at 25% 20%,rgba(212,175,55,.14),transparent 36%),linear-gradient(180deg,rgba(212,175,55,.06),rgba(10,10,10,.12));"></div>'+
    '<div style="position:absolute;left:14px;right:14px;bottom:14px;">'+
      '<div style="font-family:Cinzel,serif;font-size:.4rem;letter-spacing:2px;color:#D4AF37;margin-bottom:8px;">'+label+'</div>'+
      '<div style="font-family:\'IM Fell English\',serif;font-style:italic;color:rgba(245,239,226,.52);font-size:'+(compact?'.9rem':'1rem')+';">Still-life professionale disponibile appena collegata la media library dedicata.</div>'+
    '</div>'+
  '</div>';
}

function _buildWineLuxuryBadges(w){
  var badges = [];
  if(_isPrivateCollectionWine(w)) badges.push('Esclusiva SommelierWorld');
  else if(_isOwnedSommelierWorldWine(w)) badges.push('Vino proprio SommelierWorld');
  if(w && w.featured_selection) badges.push('Selezione SommelierWorld');
  return badges.length
    ? '<div style="display:flex;gap:8px;flex-wrap:wrap;margin:0 0 10px;">'+badges.map(function(b){
        return '<span style="padding:5px 10px;border-radius:999px;border:1px solid rgba(212,175,55,.22);background:rgba(212,175,55,.08);font-family:Cinzel,serif;font-size:.4rem;letter-spacing:1px;color:#D4AF37;">'+b+'</span>';
      }).join('')+'</div>'
    : '';
}

function _buildAffiliateLinks(query, wine){
  var safeQuery = encodeURIComponent((query || (wine && wine.nome) || '').trim());
  var affiliateUrl = wine && wine.affiliate_url ? String(wine.affiliate_url).trim() : '';
  var links = [];
  if(affiliateUrl) {
    links.push('<a href="'+affiliateUrl+'" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-right:8px;padding:8px 14px;border:1px solid rgba(212,175,55,.35);color:#D4AF37;text-decoration:none;border-radius:6px;">Partner selezionato</a>');
  } else {
    links.push('<a href="https://www.tannico.it/catalogsearch/result/?q='+safeQuery+'" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-right:8px;padding:8px 14px;border:1px solid rgba(212,175,55,.35);color:#D4AF37;text-decoration:none;border-radius:6px;">Tannico</a>');
    links.push('<a href="https://www.bernabei.it/catalogsearch/result/?q='+safeQuery+'" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-right:8px;padding:8px 14px;border:1px solid rgba(212,175,55,.35);color:#D4AF37;text-decoration:none;border-radius:6px;">Bernabei</a>');
  }
  links.push('<a href="https://www.vivino.com/search/wines?q='+safeQuery+'" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:8px 14px;border:1px solid rgba(212,175,55,.35);color:#D4AF37;text-decoration:none;border-radius:6px;">Vivino</a>');
  return links.join('');
}

function _buildWineCommerceButtons(wine, query, compact){
  var inventory = _getWineInventoryState(wine);
  var meta = compact ? 'font-size:.72rem;' : 'font-size:.92rem;';
  var html = '';
  var isOwned = _isOwnedSommelierWorldWine(wine);
  var isStoreLive = _isInternalStoreLive();
  if(isOwned && !isStoreLive) {
    var isPrivate = _isPrivateCollectionWine(wine);
    var story = String((wine && wine.collection_story) || '').trim();
    var waitlistId = _escapeHtmlLite(wine && wine.id);
    html += '<div style="margin-top:14px;padding:12px;border-radius:8px;background:linear-gradient(135deg,rgba(30,18,0,.5),rgba(10,10,10,.72));border:1px solid rgba(212,175,55,.22);">';
    html += '<div style="font-family:Cinzel,serif;font-size:.44rem;letter-spacing:2px;color:rgba(212,175,55,.72);margin-bottom:6px;">'+(isPrivate ? 'PRIVATE COLLECTION SOMMELIERWORLD' : 'SELEZIONE PRIVATA SOMMELIERWORLD')+'</div>';
    html += '<div style="font-family:\'Cormorant Garamond\',serif;line-height:1.55;color:#F5EFE2;'+meta+'">'+(isPrivate
      ? 'Una delle 12 bottiglie simbolo della maison SommelierWorld. La vendita diretta non e ancora attiva: questa scheda costruisce identita, desiderio e posizionamento prima dell apertura del magazzino.'
      : 'Questa etichetta appartiene alla futura enoteca SommelierWorld, ma la vendita diretta non e ancora attiva. La sezione resta in pre-launch finche il magazzino reale non verra avviato.')+'</div>';
    if(story) html += '<div style="margin-top:8px;font-family:\'Cormorant Garamond\',serif;line-height:1.55;color:rgba(245,239,226,.72);'+meta+'">'+story+'</div>';
    html += '<div style="margin-top:10px;">';
    if(isPrivate) {
      html += '<button onclick="window.openPrivateCollectionWaitlist&&window.openPrivateCollectionWaitlist(\''+waitlistId+'\',\'sommelier-result\')" style="display:inline-block;margin-right:8px;padding:9px 14px;background:rgba(212,175,55,.12);border:1px solid rgba(212,175,55,.3);color:#D4AF37;border-radius:6px;cursor:pointer;font-family:Cinzel,serif;font-size:.42rem;letter-spacing:1px;">Prenota accesso esclusivo</button>';
      html += '<button onclick="window.openSwCollectionBottle&&window.openSwCollectionBottle(\''+waitlistId+'\')" style="display:inline-block;padding:8px 14px;border:1px solid rgba(255,255,255,.18);color:rgba(245,239,226,.85);background:transparent;border-radius:6px;cursor:pointer;">Apri la scheda</button>';
    } else {
      html += '<button onclick="window.openSwSelectionHome&&window.openSwSelectionHome()" style="display:inline-block;margin-right:8px;padding:9px 14px;background:rgba(212,175,55,.12);border:1px solid rgba(212,175,55,.3);color:#D4AF37;border-radius:6px;cursor:pointer;font-family:Cinzel,serif;font-size:.42rem;letter-spacing:1px;">Scopri la selezione</button>';
      html += '<a href="mailto:info@sommelierworld.vin?subject=Selezione%20SommelierWorld" style="display:inline-block;padding:8px 14px;border:1px solid rgba(255,255,255,.18);color:rgba(245,239,226,.85);text-decoration:none;border-radius:6px;">Contattaci</a>';
    }
    html += '</div></div>';
    return html;
  }
  if(inventory.available && isStoreLive) {
    var safeId = _escapeHtmlLite(wine && wine.id);
    var priceLabel = _formatEuro(inventory.price);
    var stockText = inventory.quantity <= inventory.lowStockThreshold
      ? 'Ultime bottiglie disponibili: ' + inventory.quantity
      : 'Disponibile ora nel magazzino SommelierWorld: ' + inventory.quantity + ' bottiglie';
    html += '<div style="margin-top:14px;padding:12px;border-radius:8px;background:rgba(94,166,92,.08);border:1px solid rgba(94,166,92,.22);">';
    html += '<div style="font-family:Cinzel,serif;font-size:.44rem;letter-spacing:2px;color:rgba(126,214,122,.72);margin-bottom:6px;">SOMMELIERWORLD IN PRONTA CONSEGNA</div>';
    html += '<div style="font-family:\'Cormorant Garamond\',serif;line-height:1.55;color:#F5EFE2;'+meta+'">'+stockText+(priceLabel ? ' · prezzo diretto ' + priceLabel : '')+(isOwned ? ' · spedito direttamente da SommelierWorld con cura.' : '')+'</div>';
    html += '<div style="margin-top:10px;">';
    html += '<button onclick="window.startWineCheckout(\''+safeId+'\')" style="display:inline-block;margin-right:8px;padding:9px 14px;background:rgba(212,175,55,.18);border:1px solid rgba(212,175,55,.38);color:#D4AF37;border-radius:6px;cursor:pointer;font-family:Cinzel,serif;font-size:.42rem;letter-spacing:1px;">Acquista ora da SommelierWorld'+(priceLabel ? ' · ' + priceLabel : '')+'</button>';
    html += '<a href="https://www.vivino.com/search/wines?q='+encodeURIComponent((query || (wine && wine.nome) || '').trim())+'" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:8px 14px;border:1px solid rgba(255,255,255,.18);color:rgba(245,239,226,.85);text-decoration:none;border-radius:6px;">Confronta online</a>';
    html += '</div></div>';
    return html;
  }

  html += '<div style="margin-top:14px;padding:12px;border-radius:8px;background:rgba(212,175,55,.05);border:1px solid rgba(212,175,55,.18);">';
  html += '<div style="font-family:Cinzel,serif;font-size:.44rem;letter-spacing:2px;color:rgba(212,175,55,.5);margin-bottom:6px;">AFFILIAZIONE INTELLIGENTE</div>';
  html += '<div style="font-family:\'Cormorant Garamond\',serif;line-height:1.55;color:#F5EFE2;'+meta+'">Questo vino non e disponibile nella Maison SommelierWorld. Ti apro canali partner selezionati per acquisto o confronto, senza interrompere l esperienza di consultazione.</div>';
  html += '<div style="margin-top:10px;">'+_buildAffiliateLinks(query, wine)+'</div>';
  html += '</div>';
  return html;
}

function _buildOwnedWinePromptContext(params, wineTypePrefs, bollicineSubtype){
  if(typeof window.WINE_DB==='undefined' || !window.WINE_DB || typeof window.WINE_DB.getOwnedInventory !== 'function') return '';
  var isStoreLive = _isInternalStoreLive();
  var wines = window.WINE_DB.getOwnedInventory().filter(function(w){
    if(w.esaurito) return false;
    if(params && params.paese && w.paese && w.paese.toLowerCase().indexOf(String(params.paese).toLowerCase()) < 0) return false;
    if(params && params.regione && w.regione && w.regione.toLowerCase().indexOf(String(params.regione).toLowerCase()) < 0) return false;
    if(wineTypePrefs && wineTypePrefs !== 'any') {
      if(wineTypePrefs === 'bollicine' && w.tipo !== 'bollicine') return false;
      if(wineTypePrefs !== 'bollicine' && w.tipo !== wineTypePrefs) return false;
      if(wineTypePrefs === 'bollicine' && bollicineSubtype === 'classico') {
        var combined = _cleanWineQueryLocal([w.nome, w.denominazione, w.regione].join(' '));
        if(!/champagne|franciacorta|trento|alta langa|metodo classico/.test(combined)) return false;
      }
      if(wineTypePrefs === 'bollicine' && bollicineSubtype === 'charmat') {
        var combined2 = _cleanWineQueryLocal([w.nome, w.denominazione, w.regione].join(' '));
        if(/champagne|franciacorta|trento|alta langa|metodo classico/.test(combined2)) return false;
      }
    }
    return true;
  }).slice(0, 6);
  if(!wines.length) return '';
  var privateCollection = wines.filter(function(w){ return _isPrivateCollectionWine(w); }).slice(0, 4);
  var coreOwned = wines.filter(function(w){ return !_isPrivateCollectionWine(w); }).slice(0, 6);
  var renderLine = function(w){
    var inventory = _getWineInventoryState(w);
    var price = inventory.price ? _formatEuro(inventory.price) : '';
    return '- ' + [w.nome, w.produttore, w.regione].filter(Boolean).join(' | ') +
      (w.annata && w.annata !== 's.a.' ? ' | ' + w.annata : '') +
      (isStoreLive && price ? ' | prezzo diretto ' + price : '') +
      (isStoreLive && inventory.quantity > 0 ? ' | pronta consegna ' + inventory.quantity + ' bt.' : '') +
      ' | ' + (_isPrivateCollectionWine(w)
        ? 'SCELTA DELLA MAISON / PRIVATE COLLECTION: usala come selezione di massimo prestigio quando il match tecnico e centrato.'
        : (isStoreLive ? 'spedito direttamente da SommelierWorld con cura.' : 'selezione privata SommelierWorld in pre-launch.'));
  };
  var parts = [];
  if(privateCollection.length) {
    parts.push('\n\nPRIVATE COLLECTION SOMMELIERWORLD — SCELTE DELLA MAISON:\n' + privateCollection.map(renderLine).join('\n'));
  }
  if(coreOwned.length) {
    parts.push('\n\nVINI PROPRI SOMMELIERWORLD:\n' + coreOwned.map(renderLine).join('\n'));
  }
  return parts.join('');
}

window.startWineCheckout = async function(wineId){
  try {
    if(!_isInternalStoreLive()) throw new Error('La cantina SommelierWorld e in modalita pre-launch');
    if(typeof window.WINE_DB==='undefined' || !window.WINE_DB || typeof window.WINE_DB.getById !== 'function') {
      throw new Error('Database vini non disponibile');
    }
    var wine = window.WINE_DB.getById(wineId);
    if(!wine) throw new Error('Vino non trovato');
    var inventory = _getWineInventoryState(wine);
    if(!inventory.available) throw new Error('Questa bottiglia non e disponibile in pronta consegna');

    var resp = await fetch(_getSRV() + '/api/create-wine-checkout', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        origin: window.location.origin,
        wine_id: wine.id,
        wine_name: [wine.nome, wine.produttore].filter(Boolean).join(' — '),
        producer: wine.produttore || '',
        unit_amount: Math.round(inventory.price * 100),
        in_store_quantity: inventory.quantity,
        quantity: 1
      })
    });
    var data = await resp.json().catch(function(){ return {}; });
    if(!resp.ok || !data || !data.url) throw new Error((data && data.error) || ('Errore checkout ' + resp.status));
    window.location.href = data.url;
  } catch(e) {
    alert('Checkout bottiglia non disponibile: ' + (e && e.message ? e.message : 'errore sconosciuto'));
  }
};

function _buildLocalWineCard(w, query){
  var title = [w.nome, w.produttore].filter(Boolean).join(' — ');
  var vit = (w.vitigni && w.vitigni.length) ? w.vitigni.join(', ') : 'Vitigni non specificati';
  var note = w.note || 'Informazione non presente nel database tecnico.';
  var visual = _buildWineVisualBlock(w, true, false);
  var badges = _buildWineLuxuryBadges(w);
  var desc =
    '<p><strong>Identita.</strong> '+(w.denominazione || w.nome || 'Vino in archivio')+
    (w.regione ? ' nasce in '+w.regione : '')+
    (w.paese ? ', '+w.paese : '')+
    (w.annata && w.annata !== 's.a.' ? ', annata '+w.annata : '')+'.</p>'+
    '<p><strong>Profilo.</strong> Tipo '+(w.tipo || 'vino')+'. Vitigni: '+vit+'. '+note+'</p>'+
    (_isPrivateCollectionWine(w) ? '<p><strong>Maison Selection.</strong> Dalla nostra Riserva Privata, questa etichetta incarna il lato piu esclusivo della selezione SommelierWorld.</p>' : '')+
    (_isPrivateCollectionWine(w) && w.collection_story ? '<p><strong>Private Collection.</strong> '+w.collection_story+'</p>' : '')+
    '<p><strong>Acquisto.</strong> Il motore commerciale ora da priorita al magazzino interno SommelierWorld e usa i partner esterni solo come fallback.</p>'+
    _buildWineCommerceButtons(w, query, false);
  return {
    title: title || query,
    html:
      '<div style="background:linear-gradient(135deg,rgba(24,12,8,.96),rgba(10,10,10,.98));border:1px solid rgba(212,175,55,.2);border-radius:16px;padding:14px 16px;box-shadow:0 18px 42px rgba(0,0,0,.28);">'+
      '<div style="font-family:Cinzel,serif;font-size:.44rem;letter-spacing:2px;color:rgba(212,175,55,.5);margin-bottom:8px;">📚 ARCHIVIO VINI SOMMELIERWORLD</div>'+
      visual+
      badges+
      '<div style="font-family:Cinzel,serif;font-size:.76rem;color:#F5EFE2;margin-bottom:10px;">'+title+'</div>'+
      '<div style="font-family:\'Cormorant Garamond\',serif;font-size:1rem;line-height:1.75;color:#F5EFE2;">'+desc+'</div>'+
      '</div>'
  };
}

function _mergeScannedDishes(a, b){
  var out = _normalizeScannedDishes(a || {});
  var extra = _normalizeScannedDishes(b || {});
  ['antipasti','primi','secondi','contorni','dessert','altro'].forEach(function(cat){
    (extra[cat] || []).forEach(function(item){
      if(out[cat].indexOf(item) === -1) out[cat].push(item);
    });
  });
  return out;
}

function _extractJsonBlock(text){
  var clean = String(text || '').replace(/```json|```/gi,'').trim();
  var start = clean.indexOf('{');
  var end = clean.lastIndexOf('}');
  if(start < 0 || end < 0 || end <= start) return '';
  return clean.slice(start, end + 1);
}

function _parseScannedMenuResponse(text){
  var clean = String(text || '').replace(/```json|```/gi,'').trim();
  var dishes = { antipasti:[], primi:[], secondi:[], contorni:[], dessert:[], altro:[] };
  var jsonBlock = _extractJsonBlock(clean);
  var meta = { readable:true, needsNewPhoto:false, qualityNote:'', unreadableLines:[] };

  if(jsonBlock) {
    try {
      var parsed = JSON.parse(jsonBlock);
      dishes = _mergeScannedDishes(dishes, _normalizeScannedDishes(parsed));
      if(parsed && typeof parsed === 'object'){
        if(parsed.readable === false) meta.readable = false;
        if(parsed.needs_new_photo === true || parsed.needsNewPhoto === true) meta.needsNewPhoto = true;
        if(parsed.quality_note) meta.qualityNote = String(parsed.quality_note);
        if(Array.isArray(parsed.unreadable_lines)) meta.unreadableLines = parsed.unreadable_lines.map(_normalizeMenuLine).filter(Boolean);
      }
    } catch(e) {}
  }

  if(_countScannedDishes(dishes) === 0) {
    dishes = _mergeScannedDishes(dishes, _extractDishesFromText(clean));
  }

  return { dishes:dishes, meta:meta, raw:clean };
}

function _scoreLocalWineMatch(w, query){
  var q = _cleanWineQueryLocal(query);
  if(!q || !w) return 0;

  var name = _cleanWineQueryLocal(w.nome);
  var producer = _cleanWineQueryLocal(w.produttore);
  var denom = _cleanWineQueryLocal(w.denominazione);
  var region = _cleanWineQueryLocal(w.regione);
  var country = _cleanWineQueryLocal(w.paese);
  var notes = _cleanWineQueryLocal(w.note);
  var grapes = _cleanWineQueryLocal((w.vitigni || []).join(' '));
  var combined = [name, producer, denom, region, country, grapes, notes].join(' ');
  var tokens = q.split(' ').filter(function(tok){ return tok && tok.length > 1; });
  var score = 0;
  var searchableFields = [name, producer, denom, region, country, grapes, notes];

  if(name === q) score += 1200;
  if(denom === q) score += 1050;
  if(producer === q) score += 900;
  if(name.indexOf(q) >= 0) score += 700;
  if(denom.indexOf(q) >= 0) score += 560;
  if(producer.indexOf(q) >= 0) score += 460;
  if((name + ' ' + producer).indexOf(q) >= 0) score += 220;

  var matchedTokens = 0;
  tokens.forEach(function(tok){
    var tokenHit = false;
    if(name.indexOf(tok) >= 0) { score += 120; tokenHit = true; }
    if(producer.indexOf(tok) >= 0) { score += 85; tokenHit = true; }
    if(denom.indexOf(tok) >= 0) { score += 75; tokenHit = true; }
    if(grapes.indexOf(tok) >= 0) { score += 34; tokenHit = true; }
    if(region.indexOf(tok) >= 0 || country.indexOf(tok) >= 0) { score += 20; tokenHit = true; }
    if(notes.indexOf(tok) >= 0) { score += 12; tokenHit = true; }
    if(tokenHit) matchedTokens++;
  });

  var tokenCoverage = tokens.length ? (matchedTokens / tokens.length) : 0;
  if(tokens.length >= 2 && tokenCoverage < 0.6) return 0;
  if(tokens.length >= 3 && tokenCoverage < 0.75) return 0;
  if(tokens.length === 1) {
    var single = tokens[0];
    var exactFieldHit = searchableFields.some(function(f){ return f === single; });
    var strongFieldHit = name.indexOf(single) >= 0 || producer.indexOf(single) >= 0 || denom.indexOf(single) >= 0;
    if(!exactFieldHit && !strongFieldHit && score < 220) return 0;
  }

  if(tokens.length > 1 && matchedTokens === tokens.length) score += 180;
  if(combined.indexOf(q) >= 0) score += 120;
  if(tokenCoverage >= 0.9) score += 90;
  if(w.esaurito) score -= 40;

  return score;
}

function _isSuspiciousWineRecord(w){
  if(!w) return false;
  var producer = _cleanWineQueryLocal(w.produttore);
  var name = _cleanWineQueryLocal(w.nome);
  var region = _cleanWineQueryLocal(w.regione);
  var country = _cleanWineQueryLocal(w.paese);
  if(producer.indexOf('d arapri') >= 0 && (region === 'champagne' || country === 'francia')) return true;
  if(/[0-9]{4}\s*euro|€/.test(String(w.produttore || ''))) return true;
  if(name.length < 3 || producer.length < 2) return true;
  return false;
}

function _scoreWineForRecommendation(w, dishAnalysis, params, wineTypePrefs, bollicineSubtype, learningStats){
  if(!w) return -9999;
  if(_isSuspiciousWineRecord(w)) return -2500;

  var score = 0;
  var name = _cleanWineQueryLocal(w.nome);
  var producer = _cleanWineQueryLocal(w.produttore);
  var region = _cleanWineQueryLocal(w.regione);
  var country = _cleanWineQueryLocal(w.paese);
  var grapes = _cleanWineQueryLocal((w.vitigni || []).join(' '));
  var notes = _cleanWineQueryLocal(w.note);
  var combined = [name, producer, region, country, grapes, notes].join(' ');
  var type = _cleanWineQueryLocal(w.tipo);
  var traits = (dishAnalysis && dishAnalysis.traits) || {};
  var prefStats = (learningStats && learningStats.server) || {};
  var topCountry = learningStats && learningStats.prefs ? _cleanWineQueryLocal(learningStats.prefs.topPaese) : '';
  var topType = learningStats && learningStats.prefs ? _cleanWineQueryLocal(learningStats.prefs.topWineType) : '';

  if(params && params.paese) {
    var askedCountry = _cleanWineQueryLocal(params.paese);
    if(country === askedCountry) score += 220;
    else if(askedCountry) score -= 180;
  }
  if(params && params.regione) {
    var askedRegion = _cleanWineQueryLocal(params.regione);
    if(region === askedRegion) score += 260;
    else if(askedRegion) score -= 140;
  }

  if(wineTypePrefs && wineTypePrefs !== 'any') {
    if(type === wineTypePrefs) score += 260;
    else score -= 240;
    if(wineTypePrefs === 'bollicine' && bollicineSubtype === 'classico') {
      if(/champagne|franciacorta|trento|alta langa|metodo classico|blanc de blancs|blanc de noirs/.test(combined)) score += 190;
      else score -= 110;
    }
    if(wineTypePrefs === 'bollicine' && bollicineSubtype === 'charmat') {
      if(/prosecco|asti|charmat|glera/.test(combined)) score += 170;
      if(/champagne|franciacorta|trento|alta langa/.test(combined)) score -= 90;
    }
  }

  var grassezza = traits.grassezza || 1;
  var succulenza = traits.succulenza || 1;
  var sapidita = traits.sapidita || 1;
  var tendenzaDolce = traits.tendenzaDolce || 1;
  var aciditaPiatto = traits.acidita || 1;
  var aromaticita = traits.aromaticita || 1;
  var persistenza = traits.persistenza || 1;

  if(grassezza >= 3) {
    if(type === 'bollicine') score += 170;
    if(type === 'bianco') score += 95;
    if(/extra brut|brut|riesling|champagne|franciacorta|trento|alta langa|chardonnay|blanc de blancs/.test(combined)) score += 90;
  }
  if(succulenza >= 3) {
    if(type === 'rosso') score += 180;
    if(/nebbiolo|sangiovese|pinot noir|syrah|barolo|barbaresco|brunello|chianti|amarone/.test(combined)) score += 95;
  }
  if(sapidita >= 3) {
    if(type === 'bianco' || type === 'bollicine') score += 100;
    if(/sagrantino|tannino/.test(combined)) score -= 45;
  }
  if(tendenzaDolce >= 3) {
    if(/riesling|sauvignon|champagne|franciacorta|vermentino|garganega|timorasso/.test(combined)) score += 65;
  }
  if(aciditaPiatto >= 3) {
    if(type === 'rosso' && /nebbiolo|sangiovese|pinot noir/.test(combined)) score += 60;
    if(type === 'bianco' && /riesling|sauvignon|chardonnay/.test(combined)) score += 55;
  }
  if(aromaticita >= 3) {
    if(/gewurztraminer|riesling|sauvignon|viognier|traminer|pinot noir|syrah/.test(combined)) score += 80;
  }
  if(persistenza >= 4) {
    if(type === 'rosso') score += 80;
    if(/riserva|barolo|brunello|amarone|sassicaia|ornellaia/.test(combined)) score += 70;
  }

  if(topCountry && country === topCountry) score += 45;
  if(topType && type === topType) score += 55;
  if(prefStats.preferredTraits && prefStats.preferredTraits.sapida && sapidita >= 3) score += 18;
  if(prefStats.preferredTraits && prefStats.preferredTraits.grassa && grassezza >= 3) score += 18;
  if(_isPrivateCollectionWine(w) && score >= 120) score += 520;
  if(_isOwnedSommelierWorldWine(w) && _getWineInventoryState(w).available) score += 85;
  if(_isOwnedSommelierWorldWine(w) && w.featured_selection) score += 30;

  return score;
}

function _buildTechnicalWineRankingContext(menu, dishAnalysis, params, wineTypePrefs, bollicineSubtype){
  if(typeof window.WINE_DB === 'undefined' || !window.WINE_DB.all) return '';
  var learningStats = (window.TasteMemory && typeof window.TasteMemory.getStats === 'function') ? window.TasteMemory.getStats() : null;
  var wines = [];
  try { wines = window.WINE_DB.all() || []; } catch(e) { wines = []; }
  if(!wines.length) return '';

  var ranked = wines
    .map(function(w){
      return { wine:w, score:_scoreWineForRecommendation(w, dishAnalysis, params, wineTypePrefs, bollicineSubtype, learningStats) };
    })
    .filter(function(x){ return x.score > -900; })
    .sort(function(a,b){ return b.score - a.score; })
    .slice(0, 8);

  if(!ranked.length) return '';
  var lines = [];
  lines.push('\n\nSHORTLIST TECNICA PRE-RANKED SOMMELIERWORLD (database locale, ordinata per compatibilita):');
  ranked.forEach(function(item, idx){
    var w = item.wine;
    lines.push((idx + 1)+'. '+[w.nome, w.produttore, w.regione, w.paese].filter(Boolean).join(' — ')+' | tipo: '+(w.tipo || 'vino')+' | score: '+item.score+(_isPrivateCollectionWine(w)?' | PRIVATE COLLECTION / ESCLUSIVA SOMMELIERWORLD':''));
  });
  lines.push('ISTRUZIONE: usa questa shortlist come base prioritaria, ma mantieni rigore tecnico e non scegliere record incoerenti col piatto.');
  return lines.join('\n');
}

function _findLocalWineMatches(query, limit){
  if(typeof window.WINE_DB === 'undefined' || !window.WINE_DB || typeof window.WINE_DB.all !== 'function') return [];
  var max = limit || 6;
  var q = _cleanWineQueryLocal(query);
  return window.WINE_DB.all()
    .map(function(w){
      return { wine:w, score:_scoreLocalWineMatch(w, query) };
    })
    .filter(function(entry){
      if(entry.score <= 0) return false;
      if(!q) return false;
      if(entry.score >= 900) return true;
      if(q.split(' ').length >= 2) return entry.score >= 260;
      return entry.score >= 320;
    })
    .sort(function(a, b){
      if(b.score !== a.score) return b.score - a.score;
      var ay = parseInt(a.wine.annata, 10) || 0;
      var by = parseInt(b.wine.annata, 10) || 0;
      return by - ay;
    })
    .slice(0, max)
    .map(function(entry){ return entry.wine; });
}

function _buildLocalWineMatchesCard(matches, query){
  if(!matches || matches.length < 2) return '';
  var items = matches.slice(1, 4).map(function(w){
    var inventory = _getWineInventoryState(w);
    var status = inventory.available
      ? '<span style="color:rgba(126,214,122,.82);">SommelierWorld '+_formatEuro(inventory.price)+' · '+inventory.quantity+' bt.</span>'
      : '<span style="color:rgba(212,175,55,.78);">Solo acquisto esterno</span>';
    var visual = _buildWineVisualBlock(w, true, true);
    return '<div style="padding:8px 0;border-top:1px solid rgba(212,175,55,.08);">'+
      visual+
      _buildWineLuxuryBadges(w)+
      '<div style="color:#F5EFE2;font-size:.92rem;">'+[w.nome, w.produttore].filter(Boolean).join(' — ')+'</div>'+
      '<div style="color:rgba(245,239,226,.45);font-size:.78rem;margin-top:2px;">'+
        [w.regione, w.paese, (w.annata && w.annata !== 's.a.') ? w.annata : ''].filter(Boolean).join(' · ')+
      '</div>'+
      '<div style="margin-top:6px;font-size:.76rem;">'+status+'</div>'+
      _buildWineCommerceButtons(w, w.nome || query, true)+
    '</div>';
  }).join('');

  return '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(212,175,55,.12);border-radius:10px;padding:12px 14px;margin-bottom:16px;">'+
    '<div style="font-family:Cinzel,serif;font-size:.42rem;letter-spacing:2px;color:rgba(212,175,55,.48);margin-bottom:6px;">ALTRE CORRISPONDENZE NEL DATABASE</div>'+
    '<div style="font-family:\'Cormorant Garamond\',serif;font-size:1rem;line-height:1.55;color:#F5EFE2;">'+items+'</div>'+
  '</div>';
}

function _buildOnlineSearchCard(query, foundLocally){
  var title = foundLocally ? 'Link rapidi per approfondire o acquistare' : 'Non trovato in archivio: ricerca online pronta';
  var text = foundLocally
    ? 'Il vino e stato trovato nel database locale, ma non e in pronta consegna nel magazzino SommelierWorld.'
    : 'Questo nome non ha ancora una scheda precisa nel database locale. L app ti lascia comunque una ricerca pronta per acquisto e confronto online.';

  return '<div style="background:rgba(212,175,55,.05);border:1px solid rgba(212,175,55,.18);border-radius:10px;padding:14px 16px;margin-bottom:16px;">'+
    '<div style="font-family:Cinzel,serif;font-size:.44rem;letter-spacing:2px;color:rgba(212,175,55,.5);margin-bottom:8px;">🔎 ACQUISTO E CONFRONTO</div>'+
    '<div style="font-family:Cinzel,serif;font-size:.72rem;color:#F5EFE2;margin-bottom:8px;">'+title+'</div>'+
    '<div style="font-family:\'Cormorant Garamond\',serif;font-size:1rem;line-height:1.7;color:#F5EFE2;">'+text+'</div>'+
    '<p style="margin-top:14px;">'+_buildAffiliateLinks(query, null)+'</p>'+
  '</div>';
}

function _looksLikeSpecificWine(query){
  var q = _cleanWineQueryLocal(query);
  if(!q) return false;
  if(q.split(' ').length >= 2) return true;
  return /(docg|doc|igt|champagne|franciacorta|barolo|barbaresco|brunello|amarone|prosecco|riesling|chardonnay|nebbiolo)/.test(q);
}

/* ═══════════════════════════════════════════════════════════
   SCANSIONE INTELLIGENTE MENU
   Legge la foto → estrae piatti per portata → checkboxes
   ═══════════════════════════════════════════════════════════ */
window.scanMenu = async function() {
  if(!window._menuPhotoB64) return;
  var scanBtn = document.getElementById('menuScanBtn');
  var scanRes = document.getElementById('menuScanResult');
  if(!scanRes) return;

  /* UI loading */
  if(scanBtn) { scanBtn.disabled=true; scanBtn.textContent='⏳ Analisi in corso...'; }
  scanRes.style.display='block';
  scanRes.innerHTML = '<div style="text-align:center;padding:20px;font-family:Cinzel,serif;font-size:.52rem;color:rgba(212,175,55,.6);letter-spacing:2px;">'+
    '⏳ IL SOMMELIER LEGGE IL MENU...</div>';

  /* Prepara immagine per il worker */
  var b64 = window._menuPhotoB64.split(',')[1];
  var mime = window._menuPhotoB64.split(';')[0].replace('data:','');
  var lang = window.getLang ? window.getLang() : 'it';
  var photoMeta = window._menuPhotoMeta || {};
  if(!b64 || b64.length < 800) {
    scanRes.innerHTML = '<div style="padding:14px;background:rgba(200,50,50,.08);border:1px solid rgba(200,50,50,.2);border-radius:6px;font-family:Cinzel,serif;font-size:.5rem;color:rgba(245,100,100,.7);">⚠ Il file immagine non e arrivato correttamente alla scansione. Ricarica la foto e riprova.</div>';
    if(scanBtn) { scanBtn.disabled=false; scanBtn.textContent='🔍 SCANSIONA MENU'; }
    return;
  }

  /* Reset previous scan result to avoid showing old data */
  window._scannedDishes = null;
  var scanRes2 = document.getElementById('menuScanResult');
  if(scanRes2) scanRes2.innerHTML = '';

  var sysPrompt = 'Sei un OCR professionale specializzato in menu di ristoranti. REGOLA ASSOLUTA: NON INVENTARE PIATTI. '+
    'Analizza solo quelli realmente presenti nell immagine caricata. '+
    'Se il testo e sfocato, tagliato, troppo lontano o ambiguo, devi segnalarlo e chiedere una nuova foto. '+
    'Non interpretare, non completare, non indovinare ingredienti o nomi mancanti. Restituisci SOLO JSON valido.';
  var userPrompt = 'Trascrivi QUESTA immagine del menu. '+
    'REGOLE FERREE (NESSUNA DEVIAZIONE): '+
    '1. TRASCRIZIONE LETTERALE: copia i nomi dei piatti ESATTAMENTE come sono scritti nella foto, inclusi accenti, punteggiatura, maiuscole e minuscole. '+
    '2. NESSUNA INTERPRETAZIONE: non inventare ingredienti, non abbellire, non cambiare nomi. '+
    '3. CATEGORIE ESATTE: usa solo queste chiavi JSON: antipasti, primi, secondi, contorni, dessert, altro. '+
    '4. METTI SOLO I PIATTI: escludi vini, bevande, prezzi, date, indirizzi, telefoni, loghi, nomi del ristorante. '+
    '5. SE UN PIATTO HA DUE RIGHE: uniscile in una sola stringa. '+
    '6. NESSUN TESTO FUORI DAL JSON: rispondi solo con JSON, zero altre parole. '+
    '7. Se leggi "PRIMI PIATTI" mettili in "primi"; se leggi "DESSERT" o "DOLCI" mettili in "dessert". '+
    '8. Se una voce non e leggibile NON inventarla: mettila in unreadable_lines o lascia la categoria vuota. '+
    '9. Se la foto non e abbastanza nitida per leggere davvero il menu, imposta readable=false e needs_new_photo=true. '+
    'INFORMAZIONI IMMAGINE: nome file='+(photoMeta.originalName || 'menu')+', mime='+(photoMeta.originalType || mime)+', dimensioni='+(photoMeta.width || '?')+'x'+(photoMeta.height || '?')+', sharpness='+(photoMeta.sharpness || 0)+'. '+
    'JSON da restituire: {"readable":true,"needs_new_photo":false,"quality_note":"","unreadable_lines":[],"antipasti":["..."],"primi":["..."],"secondi":["..."],"contorni":[],"dessert":["..."],"altro":[]}';

  try {
    async function requestScan(systemPrompt, userPromptText, maxTokens){
      var ctrl = new AbortController();
      var t = setTimeout(function(){ ctrl.abort(); }, 40000);
      try {
        var r = await fetch(_getSRV() + '/api/scan-menu', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({
            system: systemPrompt,
            userMsg: userPromptText,
            imageB64: b64,
            imageMime: mime,
            maxTokens: maxTokens || 1200,
          }),
          signal: ctrl.signal,
        });
        var d = await r.json();
        if(!r.ok) throw new Error(d.error || ('Errore server ' + r.status));
        if(!d.text) throw new Error(d.error || 'Risposta vuota');
        return String(d.text || '');
      } finally {
        clearTimeout(t);
      }
    }

    var rawPrimary = await requestScan(sysPrompt, userPrompt, 1500);
    var primaryParsed = _parseScannedMenuResponse(rawPrimary);
    var dishes = primaryParsed.dishes;
    var scanMeta = primaryParsed.meta || {};

    if((scanMeta.needsNewPhoto || scanMeta.readable === false) && _countScannedDishes(dishes) === 0) {
      throw new Error(scanMeta.qualityNote || 'Foto troppo sfocata o poco leggibile: rifalla piu frontale, vicina e luminosa.');
    }

    if(_countScannedDishes(dishes) === 0) {
      var fallbackSystem = 'Sei un OCR professionale di menu. NON INVENTARE PIATTI. Se non leggi bene una riga, omettila o segnala [ILLEGIBILE]. Restituisci solo testo letto, una riga per voce.';
      var fallbackPrompt = 'Leggi la foto del menu e restituisci SOLO testo OCR pulito, senza JSON. '+
        'Metti una riga per titolo di sezione e una riga per ogni piatto. '+
        'Escludi prezzi, indirizzi, telefoni, sito web, bevande e nomi del ristorante. '+
        'NON COMPLETARE MAI parole mancanti.';
      var rawFallback = await requestScan(fallbackSystem, fallbackPrompt, 1600);
      dishes = _mergeScannedDishes(dishes, _extractDishesFromText(String(rawFallback || '').replace(/\[ILLEGIBILE\].*/g,'')));
    }

    if(_countScannedDishes(dishes) === 0) {
      throw new Error('Nessun piatto riconosciuto automaticamente dalla foto');
    }

    window._scannedDishes = dishes;
    window.renderDishCheckboxes(dishes);
    if(scanMeta.unreadableLines && scanMeta.unreadableLines.length) {
      scanRes.insertAdjacentHTML('afterbegin',
        '<div style="margin-bottom:10px;padding:10px 12px;background:rgba(212,175,55,.05);border:1px solid rgba(212,175,55,.15);border-radius:8px;font-family:\'Cormorant Garamond\',serif;color:rgba(245,239,226,.75);line-height:1.6;">'+
        '<strong style="color:#D4AF37;">Voci poco leggibili:</strong> '+
        scanMeta.unreadableLines.slice(0,4).map(function(x){ return x.replace(/</g,'&lt;').replace(/>/g,'&gt;'); }).join(' · ')+
        '</div>');
    }
  } catch(err) {
    scanRes.innerHTML =
      '<div style="padding:14px;background:rgba(200,50,50,.08);border:1px solid rgba(200,50,50,.2);border-radius:6px;font-family:Cinzel,serif;font-size:.5rem;color:rgba(245,100,100,.7);">'+
      '⚠ Non riesco a leggere il menu dalla foto.<br><span style="font-size:.8rem;font-family:serif;font-style:italic;color:rgba(245,239,226,.4);">'+
      (err && err.message ? ('<br><br>Dettaglio: '+String(err.message).replace(/</g,'&lt;').replace(/>/g,'&gt;')) : '')+
      'Prova a scrivere i piatti manualmente nel campo testo sopra, oppure carica una foto più nitida.</span></div>';
  }
  if(scanBtn) { scanBtn.disabled=false; scanBtn.textContent='🔍 SCANSIONA MENU'; }
};

/* Colori e icone per portata */
var _COURSE_CONFIG = {
  antipasti: { label:'Antipasti',  emoji:'🥗', color:'rgba(200,160,80,.3)',  bg:'rgba(200,160,80,.06)', border:'rgba(200,160,80,.25)' },
  primi:     { label:'Primi',      emoji:'🍝', color:'rgba(180,120,60,.3)',  bg:'rgba(180,120,60,.06)', border:'rgba(180,120,60,.25)' },
  secondi:   { label:'Secondi',    emoji:'🥩', color:'rgba(160,80,80,.3)',   bg:'rgba(160,80,80,.06)',  border:'rgba(160,80,80,.25)'  },
  contorni:  { label:'Contorni',   emoji:'🥦', color:'rgba(80,140,80,.3)',   bg:'rgba(80,140,80,.06)',  border:'rgba(80,140,80,.25)'  },
  dessert:   { label:'Dolci',      emoji:'🍮', color:'rgba(180,140,200,.3)', bg:'rgba(180,140,200,.06)',border:'rgba(180,140,200,.25)' },
  altro:     { label:'Altro',      emoji:'🍽', color:'rgba(150,150,150,.3)', bg:'rgba(150,150,150,.06)',border:'rgba(150,150,150,.25)' },
};

/* ═══════════════════════════════════════════════════════════
   SELEZIONE PIATTI — tocca/clicca per selezionare
   ═══════════════════════════════════════════════════════════ */
window._dishSelected = {};
window._dishData     = {};

window.renderDishCheckboxes = function(dishes) {
  var scanRes = document.getElementById('menuScanResult');
  if(!scanRes) return;

  /* Reset stato */
  window._dishSelected = {};
  window._dishData = dishes;

  var ORDER = ['antipasti','primi','secondi','contorni','dessert','altro'];
  var LABEL = {antipasti:'Antipasti',primi:'Primi',secondi:'Secondi',
               contorni:'Contorni',dessert:'Dolci',altro:'Altro'};
  var EMOJI = {antipasti:'🥗',primi:'🍝',secondi:'🥩',
               contorni:'🥦',dessert:'🍮',altro:'🍽'};
  var COLORS = {
    antipasti:'#c8a050', primi:'#b47c3c', secondi:'#a05050',
    contorni:'#507850',  dessert:'#907898', altro:'#787878'
  };

  var totalDishes = 0;
  ORDER.forEach(function(cat) {
    var items = dishes[cat];
    if(!items||!items.length) return;
    items.forEach(function(dish,di){ window._dishSelected[cat+'__'+di] = false; });
    totalDishes += items.length;
  });

  /* Costruisce HTML */
  var H = '';
  H += '<div style="margin-top:10px;">';

  /* Istruzione */
  H += '<div style="font-family:Cinzel,serif;font-size:.52rem;letter-spacing:2px;color:#D4AF37;'+
       'text-align:center;padding:10px 0 8px;border-bottom:1px solid rgba(212,175,55,.2);margin-bottom:10px;">'+
       '👆 TOCCA I PIATTI CHE HAI ORDINATO</div>';

  if(totalDishes === 0) {
    H += '<p style="text-align:center;color:rgba(245,239,226,.4);font-style:italic;padding:16px;">'+
         'Nessun piatto trovato — scrivi il menu manualmente.</p>';
  } else {
    var first = true;
    ORDER.forEach(function(cat) {
      var items = dishes[cat];
      if(!items||!items.length) return;
      var col = COLORS[cat];

      /* Separatore orizzontale tra sezioni */
      if(!first) {
        H += '<div style="height:1px;background:linear-gradient(to right,transparent,rgba(212,175,55,.25),transparent);'+
             'margin:12px 0;"></div>';
      }
      first = false;

      /* Header sezione */
      H += '<div style="display:flex;align-items:center;gap:8px;padding:6px 0 8px;">';
      H += '<span style="font-size:1.2rem;">'+EMOJI[cat]+'</span>';
      H += '<span style="font-family:Cinzel,serif;font-size:.56rem;letter-spacing:3px;'+
           'color:'+col+';font-weight:bold;">'+LABEL[cat].toUpperCase()+'</span>';
      H += '<div style="flex:1;height:1px;background:linear-gradient(to right,'+col+'66,transparent);margin-left:6px;"></div>';
      H += '</div>';

      /* Piatti */
      H += '<div style="display:flex;flex-direction:column;gap:6px;padding-bottom:2px;">';
      items.forEach(function(dish,di) {
        var key = cat+'__'+di;
        H += '<div id="swdish__'+key+'" ';
        H += '<div id="swdish__'+key+'" data-swkey="'+key+'" ';
        H += 'onclick="window.swToggle(this.dataset.swkey)" ';
        H += 'style="display:flex;align-items:center;gap:12px;padding:12px 14px;';
        H += 'background:rgba(255,255,255,.04);border:2px solid rgba(255,255,255,.07);';
        H += 'border-radius:10px;cursor:pointer;-webkit-tap-highlight-color:transparent;">';
        H += '<div id="swcheck__'+key+'" ';
        H += 'style="width:24px;height:24px;border-radius:50%;border:2px solid rgba(212,175,55,.35);';
        H += 'background:transparent;flex-shrink:0;display:flex;align-items:center;justify-content:center;';
        H += 'font-size:14px;font-weight:bold;color:#1a0a05;transition:all .15s;"></div>';
        /* Nome piatto */
        H += '<span style="font-size:1rem;color:rgba(245,239,226,.85);line-height:1.3;">'+dish+'</span>';
        H += '</div>';
      });
      H += '</div>';
    });

    /* Contatore selezionati */
    H += '<div id="sw_dish_count" style="font-family:Cinzel,serif;font-size:.5rem;letter-spacing:1px;'+
         'color:rgba(212,175,55,.5);text-align:center;padding:10px 0 4px;margin-top:8px;'+
         'border-top:1px solid rgba(212,175,55,.15);">0 piatti selezionati</div>';

    /* Pulsanti */
    H += '<div style="display:flex;gap:8px;margin-top:6px;">';
    H += '<button onclick="swSelAll(true)" ';
    H += 'style="flex:1;padding:10px;font-family:Cinzel,serif;font-size:.44rem;letter-spacing:1px;';
    H += 'background:rgba(255,255,255,.05);border:1px solid rgba(212,175,55,.25);';
    H += 'color:rgba(212,175,55,.7);border-radius:8px;cursor:pointer;">✓ TUTTI</button>';
    H += '<button onclick="swSelAll(false)" ';
    H += 'style="flex:1;padding:10px;font-family:Cinzel,serif;font-size:.44rem;letter-spacing:1px;';
    H += 'background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.1);';
    H += 'color:rgba(245,239,226,.4);border-radius:8px;cursor:pointer;">✕ NESSUNO</button>';
    H += '</div>';
    H += '<button onclick="swUseSel()" ';
    H += 'style="width:100%;margin-top:8px;padding:15px;font-family:Cinzel,serif;font-size:.56rem;';
    H += 'letter-spacing:2px;background:linear-gradient(135deg,rgba(180,30,30,.85),rgba(120,10,10,.75));';
    H += 'border:2px solid rgba(212,100,80,.6);color:#fff;border-radius:10px;cursor:pointer;';
    H += '-webkit-tap-highlight-color:transparent;">'+
         '🍷 ABBINA IL VINO — CONSULTA IL SOMMELIER</button>';
  }

  H += '</div>';
  scanRes.innerHTML = H;
};

/* Toggle singolo piatto */
window.swToggle = function(key) {
  window._dishSelected[key] = !window._dishSelected[key];
  var sel = window._dishSelected[key];

  var row   = document.getElementById('swdish__'+key);
  var check = document.getElementById('swcheck__'+key);

  if(row) {
    row.style.background   = sel ? 'rgba(212,175,55,.13)' : 'rgba(255,255,255,.04)';
    row.style.borderColor  = sel ? 'rgba(212,175,55,.55)' : 'rgba(255,255,255,.07)';
  }
  if(check) {
    check.style.background  = sel ? '#D4AF37' : 'transparent';
    check.style.borderColor = sel ? '#D4AF37'  : 'rgba(212,175,55,.35)';
    check.textContent       = sel ? '✓' : '';
  }

  var count = Object.values(window._dishSelected).filter(Boolean).length;
  var cEl = document.getElementById('sw_dish_count');
  if(cEl) {
    cEl.textContent = count === 0
      ? '0 piatti selezionati'
      : count + ' piatt'+(count===1?'o':'i')+' selezionat'+(count===1?'o':'i')+' ✓';
    cEl.style.color = count > 0 ? 'rgba(212,175,55,.8)' : 'rgba(212,175,55,.5)';
  }
};

/* Seleziona / deseleziona tutti */
window.swSelAll = function(val) {
  Object.keys(window._dishSelected).forEach(function(key) {
    window._dishSelected[key] = false; /* reset */
    var row   = document.getElementById('swdish__'+key);
    var check = document.getElementById('swcheck__'+key);
    if(row)   { row.style.background='rgba(255,255,255,.04)'; row.style.borderColor='rgba(255,255,255,.07)'; }
    if(check) { check.style.background='transparent'; check.style.borderColor='rgba(212,175,55,.35)'; check.textContent=''; }
  });
  var cEl = document.getElementById('sw_dish_count');
  if(cEl) cEl.textContent = '0 piatti selezionati';
  if(val) {
    Object.keys(window._dishSelected).forEach(function(key){ window.swToggle(key); });
  }
};

/* Aliases retrocompatibilità */
window.toggleDish = window.swToggle;
window.selectAllDishes = window.swSelAll;


window.useSelectedDishes = function() {
  var selected = [];
  var byCategory = {};
  /* Legge da _dishSelected + _dishData (non da checkbox nativi) */
  Object.keys(window._dishSelected||{}).forEach(function(key) {
    if(!window._dishSelected[key]) return;
    var sep  = key.indexOf('__');
    var cat  = key.slice(0, sep);
    var di   = parseInt(key.slice(sep+2));
    var dish = (window._dishData&&window._dishData[cat]) ? window._dishData[cat][di] : '';
    if(!dish) return;
    selected.push(dish);
    if(!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(dish);
  });

  if(!selected.length) {
    alert('Seleziona almeno un piatto!');
    return;
  }

  /* Componi testo menu per il sommelier */
  var LABELS = {antipasti:'Antipasti',primi:'Primi',secondi:'Secondi',contorni:'Contorni',dessert:'Dessert',altro:'Altro'};
  var menuText = 'Menu selezionato dalla foto:\n';
  Object.keys(byCategory).forEach(function(cat){
    menuText += LABELS[cat]+': '+byCategory[cat].join(', ')+'\n';
  });

  /* Popola il textarea CORRETTO (id=menuText) */
  var ta = document.getElementById('menuText');
  if(!ta) ta = document.getElementById('menuInput'); /* fallback */
  if(ta) {
    ta.value = menuText;
    ta.style.borderColor = 'rgba(212,175,55,.5)';
    /* Trigger evento input per aggiornare eventuali listener */
    ta.dispatchEvent(new Event('input', {bubbles:true}));
  }

  /* Feedback nel box scansione */
  var scanRes = document.getElementById('menuScanResult');
  if(scanRes) {
    var count = selected.length;
    scanRes.insertAdjacentHTML('beforeend',
      '<div style="margin-top:10px;padding:12px;background:rgba(122,200,80,.08);'+
      'border:2px solid rgba(122,200,80,.3);border-radius:8px;font-family:Cinzel,serif;'+
      'font-size:.52rem;letter-spacing:1px;color:#7acc50;text-align:center;">'+
      '✓ '+count+' piatt'+(count===1?'o':'i')+' selezionat'+(count===1?'o':'i')+
      ' — avvio Sommelier AI…</div>');
  }

  /* Avvia il Sommelier dopo breve pausa */
  setTimeout(function() {
    if(typeof window.doAbbinamento === 'function') {
      window.doAbbinamento();
    }
  }, 500);
};

/* swUseSel: alias chiamato dal bottone nel render della scansione */
window.swUseSel = window.useSelectedDishes;

function _askSommelierPreferenceFirst(message){
  var resEl = document.getElementById('somResult');
  var loadEl = document.getElementById('somLoad');
  if(loadEl) loadEl.style.display='none';
  if(resEl) {
    resEl.innerHTML =
      '<div style="padding:14px 16px;background:rgba(212,175,55,.05);border:1px solid rgba(212,175,55,.18);border-radius:8px;">'+
      '<div style="font-family:Cinzel,serif;font-size:.56rem;letter-spacing:2px;color:#D4AF37;margin-bottom:8px;">PRIMA UNA PREFERENZA</div>'+
      '<div style="font-family:\'Cormorant Garamond\',serif;font-size:1rem;line-height:1.7;color:#F5EFE2;">'+
      (message || 'Prima di suggerirti i vini, dimmi se preferisci bollicine, bianchi fermi, rossi strutturati o nessuna preferenza.')+
      '</div></div>';
    resEl.style.display='block';
    try { resEl.scrollIntoView({behavior:'smooth', block:'nearest'}); } catch(e) {}
  }
  var selector = document.getElementById('wineTypeSelector');
  if(selector) {
    try { selector.scrollIntoView({behavior:'smooth', block:'center'}); } catch(e) {}
    try {
      selector.style.boxShadow = '0 0 0 2px rgba(212,175,55,.28)';
      setTimeout(function(){ selector.style.boxShadow=''; }, 2200);
    } catch(e) {}
  }
}



// ═══════════════════════════════════════════════════════════
// FEEDBACK con TasteMemory
window._currentSessId = null;

window.swFbPos = function(btn) {
  if(window._currentSessId) window.TasteMemory.upvote(window._currentSessId);
  window.TasteMemory.renderBadge();
  if(btn&&btn.parentNode)
    btn.parentNode.innerHTML='<span style="color:#7dda8a;font-family:Cinzel,serif;font-size:.52rem;letter-spacing:1px;">✓ Grazie! Il Sommelier ha imparato qualcosa di nuovo su di te. 🧠</span>';
};
window.swFbNeg = function(btn) {
  if(window._currentSessId) window.TasteMemory.downvote(window._currentSessId);
  window.TasteMemory.renderBadge();
  if(btn&&btn.parentNode)
    btn.parentNode.innerHTML='<span style="color:#D4AF37;font-family:Cinzel,serif;font-size:.52rem;letter-spacing:1px;">✓ Capito. Il Sommelier non riproporrà vini simili. 🧠</span>';
};

// ═══════════════════════════════════════════════════════════
// ▌▌▌ ABBINAMENTO MENU — CUORE DEL SOMMELIER ▌▌▌
// FIX QUALITÀ: prompt riscritto per abbinamenti professionali.
// Menu degustazione → 2-3 vini in progressione.
// Piccione → Pinot Nero/Barolo, non Vermentino.
// ═══════════════════════════════════════════════════════════
window.doAbbinamento = async function() {

  /* Evita chiamate multiple */
  /* Reset se bloccato da più di 30 secondi */
  if(window._abbinamentoInCorso) {
    var now = Date.now();
    if(!window._abbinamentoStart || (now - window._abbinamentoStart) > 30000) {
      window._abbinamentoInCorso = false; /* Force reset */
      console.log('[Sommelier] Flag bloccato resettato');
    } else {
      return; /* Chiamata legittimamente in corso */
    }
  }
  window._abbinamentoInCorso = true;
  window._abbinamentoStart = Date.now();

  var wineTypePrefs = (document.getElementById('selectedWineType')||{}).value || window._selectedWineType || 'any';
  var bollicineSubtype = window._selectedBollicineType || '';
  if(!window._wineTypeTouched) {
    window._abbinamentoInCorso = false;
    _askSommelierPreferenceFirst('Prima di consigliarti il vino, scegli la tua preferenza: bollicine, bianchi fermi, rossi strutturati oppure nessuna preferenza.');
    return;
  }
  if(wineTypePrefs === 'bollicine' && !bollicineSubtype) {
    window._abbinamentoInCorso = false;
    _askSommelierPreferenceFirst('Hai scelto bollicine: dimmi se preferisci Metodo Classico o Metodo Charmat prima del consiglio.');
    return;
  }

  /* Paywall B2C */
  if(typeof window.checkConsultazioneLibera==='function'){
    if(!window.checkConsultazioneLibera()) {
      window._abbinamentoInCorso = false; /* Reset se paywall blocca */
      return;
    }
  }

  /* Legge tipo vino selezionato dall'utente */
  var menu = (document.getElementById('menuText')||{}).value||'';
  var hasPhoto = !!window._menuPhotoB64;
  if(!menu.trim() && !hasPhoto){
    alert('Descrivi il menu o scatta una foto del menu.');
    return;
  }
  /* Se c'è solo la foto, aggiungi testo descrittivo */
  if(!menu.trim() && hasPhoto){
    menu = 'Menu fotografato — analizza la foto allegata e consiglia il vino più adatto.';
  }

  var budget  = (document.getElementById('budget')||{}).value||'50';
  var params  = window.getWineParams();
  var isElite = typeof window.isEliteUser==='function' ? window.isEliteUser() : false;
  var dishAnalysis = _buildDishTechnicalAnalysis(menu);

  /* Avvia sessione TasteMemory */
  window._currentSessId = await window.TasteMemory.startSession(menu, budget, params, dishAnalysis);

  /* Contesti */
  var learningCtx = await window.TasteMemory.buildLearningContext(menu, dishAnalysis);
  var eliteCtx    = window._buildEliteContext();

  /* Vincolo geografico */
  var vincolo = '';
  if(params.paese) {
    vincolo = '\n\n'+'▓'.repeat(44)+'\n'+
      '🔴 VINCOLO GEOGRAFICO ASSOLUTO — '+params.paese+
      (params.regione?' / '+params.regione:'')+'\n'+
      '✅ Consiglia SOLO vini di '+params.paese+'\n'+
      '❌ Vietato consigliare vini di altri paesi\n'+
      'Riferimenti: '+(_ESEMPI_PAESE[params.paese]||'vini tipici')+'\n'+
      '▓'.repeat(44);
  }

  var profilo = '\nProfilo richiesto: freschezza '+params.acidita+
    ', carattere '+params.morbidezza+', corpo '+params.struttura+'.';

  /* ══════════════════════════════════════════════
     SYSTEM PROMPT — RISCRITTO PER QUALITÀ
     Regole enologiche fondamentali codificate
     per eliminare abbinamenti discutibili.
     ══════════════════════════════════════════════ */
  var ARMONIE = [
    'ANALIZZA SEMPRE: grassezza, untuosita, succulenza, sapidita, tendenza dolce, tendenza amarognola, speziatura, aromaticita, persistenza e struttura del piatto.',
    'BILANCIA per contrapposizione e concordanza: acidita/effervescenza contro grassezza e untuosita; morbidezza contro sapidita e speziatura; struttura contro succulenza e persistenza.',
    'Se il piatto e complesso, dichiara quale elemento domina davvero il boccone finale e costruisci li sopra l abbinamento.',
    '🐟 PESCE E FRUTTI DI MARE: sempre bianchi, rosati o bollicine. MAI rossi tannici (creano retrogusto ferroso). Eccezioni: tonno e salmone possono reggere un Pinot Noir leggero.',
    '🥩 CARNI ROSSE E SELVAGGINA (piccione, cinghiale, anatra, fagiano): OBBLIGATORIAMENTE rossi strutturati — Barolo, Barbaresco, Brunello, Châteauneuf, Syrah, Cabernet. Un bianco sarebbe troppo debole.',
    '🍄 TARTUFO E FUNGHI PORCINI: vini con complessità terziaria — Barolo, Borgogna rossa, Brunello, Hermitage. Evitare vini troppo fruttati.',
    '🍽 MENU DEGUSTAZIONE (6+ portate): NON esiste un solo vino per tutto il menu. Proponi 2-3 vini in progressione: 1 bianco/bollicine per antipasti e primi di mare, 1 rosso elegante per i piatti di carne, 1 dolce per il dessert.',
    '🧀 FORMAGGI STAGIONATI: rossi strutturati o bianchi ossidativi (Sauternes, Marsala). Il grande rosso va sempre bene.',
    '🌿 PIATTI VEGETARIANI DELICATI: bianchi freschi, Pinot Grigio, Vermentino, Soave.',
    '🍮 DESSERT: SOLO vini dolci — Sauternes, Moscato, Recioto, Tokaji. Mai un secco a fine pasto.',
    '🌶 SPEZIATO: vini morbidi e aromatici, bassa gradazione — Riesling Kabinett, Gewürztraminer.',
  ].join('\n');

  var qualitaCheck = [
    'PRIMA di rispondere, richiama in una riga la preferenza dell utente: bollicine, bianchi fermi, rossi strutturati o nessuna preferenza.',
    'PRIMA di rispondere, identifica il piatto più importante del menu (solitamente il secondo).',
    'Scegli il vino in base a QUEL piatto, poi verifica la coerenza con gli altri.',
    'Se il menu include selvaggina o carne rossa, non proporre mai un bianco come vino principale.',
    'Se il menu ha 5+ portate, proponi una progressione di vini.',
    'Ogni vino consigliato DEVE avere un produttore specifico reale e un\'annata indicativa.',
  ].join('\n');

  var lunghezza = isElite
    ? 'Rispondi con descrizione COMPLETA ed elegante. Minimo 400 parole. Struttura in sezioni. 1) PREFERENZA DELL UTENTE. 2) ANALISI TECNICA DEL PIATTO: valuta grassezza, succulenza, sapidita, aromaticita e struttura. 3) 3 VINI IN FASCE DI PREZZO: proponi 3 vini in ordine di preferenza: 🥉 ECONOMICO (€10-25), 🥈 MEDIO (€25-50), 🥇 PRESTIGIOSO (€50+). Per ogni vino: denominazione + produttore reale + annata + vitigno/i + motivazione tecnica precisa sull armonia con il piatto + temperatura di servizio + eventuale calice o decanter.'
    : 'Rispondi in modo CONCISO ma PRECISO. 1) PREFERENZA DELL UTENTE. 2) ANALISI TECNICA DEL PIATTO: grassezza, succulenza, sapidita, aromaticita e struttura. 3) 3 VINI IN FASCE DI PREZZO: proponi 3 vini in ordine di preferenza: 🥉 ECONOMICO (€10-25), 🥈 MEDIO (€25-50), 🥇 PRESTIGIOSO (€50+). Per ogni vino: denominazione + produttore reale + annata + vitigno/i + motivazione tecnica precisa sull armonia con il piatto + temperatura di servizio. Non essere generico.';

    /* Lingua della risposta AI = lingua UI */
  var uiLang = window.getLang ? window.getLang() : 'it';
  var LANG_INSTR = {
    it:'RISPONDI ESCLUSIVAMENTE IN ITALIANO. Lingua colta e letteraria.',
    en:'RESPOND EXCLUSIVELY IN ENGLISH. Sophisticated literary English.',
    fr:'RÉPONDS EXCLUSIVEMENT EN FRANÇAIS. Français élégant et littéraire.',
    ru:'ОТВЕЧАЙ ИСКЛЮЧИТЕЛЬНО НА РУССКОМ ЯЗЫКЕ. Изысканный литературный русский.',
  }[uiLang]||'RISPONDI IN ITALIANO.';

  var PRODUCER_CHECK =
    'PRECISIONE PRODUTTORI (regola assoluta): '+
    'Ogni produttore citato deve esistere REALMENTE in quella zona. '+
    'Non confondere mai: Gaja fa Barolo E Barbaresco; Sassicaia = Tenuta San Guido; '+
    'Petrus = Moueix; Conterno = Monforte. Se incerto, cita solo la denominazione.';

  /* Dizionario sicurezza dal navigation.js */
  var safetyCtx = (typeof window.getSafetyDictPrompt==='function') ? window.getSafetyDictPrompt() : '';
  var HARD_RULES = ''; /* defined locally - searchWine has its own */
  var system =
    HARD_RULES+LANG_INSTR+'\n\n'+safetyCtx+
    'Sei il Sommelier Digitale di SommelierWorld, un professionista della sommellerie di alto livello. REGOLA ASSOLUTA: cita SOLO vini reali con produttore e denominazione verificabili. Non inventare mai vini, produttori o abbinamenti. Se non sei certo, dì esplicitamente quale vino preferisci e perché. '+
    'La tua identità si basa su PRECISIONE TECNICA, rispetto dei disciplinari ufficiali DOCG/DOC e descrizioni didattiche. Ragiona come un professionista dell abbinamento cibo-vino.\n'+
    PRODUCER_CHECK+'\n\n'+
    '━━━ REGOLE ENOLOGICHE (mai violarle) ━━━\n'+
    ARMONIE+'\n\n'+
    '━━━ PROCESSO DI RAGIONAMENTO ━━━\n'+
    qualitaCheck+'\n'+
    (params.paese?'\\n🔴 SOLO vini di '+params.paese+(params.regione?' / '+params.regione:'')+'.':'')+
    eliteCtx+'\\n\\n'+

    lunghezza+'\\n\\n'+
    '━━━ STRUTTURA RISPOSTA ━━━\\n'+
    (isElite
      ? '① ANIMA DEL PIATTO — sintesi sensoriale poetica del menu.\\n'+
        '② PREFERENZA DEL CLIENTE — richiama la preferenza selezionata e spiega come condiziona la scelta.\\n'+
        '③ SELEZIONE 3 VINI in ordine di preferenza:\\n'+
        '   🥇 1° SCELTA — produttore verificato + denominazione + annata + vitigni + motivazione tecnica ed elegante + temperatura + calice.\\n'+
        '   🥈 2° SCELTA — stessa logica, stile o origine diversi.\\n'+
        '   🥉 3° SCELTA — denominazione alternativa, vitigno o terroir diverso.\\n'+
        '④ IL SEGRETO — aneddoto raro sul vino o produttore preferito.'
      : '① PREFERENZA DEL CLIENTE.\\n'+
        '🥇 1° SCELTA — denominazione + produttore reale + annata + vitigni. Motivazione tecnica precisa. Temperatura e decanter.\\n'+
        '🥈 2° SCELTA — denominazione + produttore reale + annata + vitigni. Motivazione tecnica. Temperatura.\\n'+
        '🥉 3° SCELTA — denominazione alternativa (diversa regione o vitigno). Motivazione breve ma concreta.');
  /* Contesto archivio enologico — filtrato per tipo scelto dall'utente */
  var wineCtx = '';
  if(typeof window.WINE_DB !== 'undefined') {
    var dbOpts = {paese: params.paese, regione: params.regione};
    if(wineTypePrefs !== 'any') {
      if(wineTypePrefs === 'bollicine' && bollicineSubtype === 'classico') {
        dbOpts.tipoFilter = function(w){ return w.tipo==='bollicine' && (w.regione==='Champagne'||w.denominazione&&(w.denominazione.includes('Franciacorta')||w.denominazione.includes('Trento')||w.denominazione.includes('Alta Langa')||w.denominazione.includes('Metodo Classico'))); };
      } else if(wineTypePrefs === 'bollicine' && bollicineSubtype === 'charmat') {
        dbOpts.tipoFilter = function(w){ return w.tipo==='bollicine' && w.regione!=='Champagne' && !(w.denominazione&&w.denominazione.includes('Franciacorta')); };
      } else {
        dbOpts.tipoFilter = function(w){ return w.tipo===wineTypePrefs; };
      }
    }
    wineCtx = window.WINE_DB.buildContext(menu, budget, params.paese, params.regione, dbOpts.tipoFilter);
  }
  var rankedWineCtx = _buildTechnicalWineRankingContext(menu, dishAnalysis, params, wineTypePrefs, bollicineSubtype);
  var ownedWineCtx = _buildOwnedWinePromptContext(params, wineTypePrefs, bollicineSubtype);

  /* Consigli personalizzati dell'admin */
  var tipsCtx = '';
  if(typeof window.SOMMELIER_TIPS !== 'undefined') {
    tipsCtx = window.SOMMELIER_TIPS.buildPromptSection();
  }

  /* Vincolo tipo vino */
  var wineTypeRule = '';
  if(wineTypePrefs !== 'any') {
    var typeNames = {rosso:'ROSSO',bianco:'BIANCO',bollicine:'BOLLICINE/SPUMANTE'};
    wineTypeRule = '\n\n🔴 VINCOLO TIPO: L\'utente vuole ESCLUSIVAMENTE un vino '+
      (typeNames[wineTypePrefs]||wineTypePrefs.toUpperCase())+
      (bollicineSubtype==='classico'?' (solo Metodo Classico: Champagne, Franciacorta, Trento DOC)':'')+
      (bollicineSubtype==='charmat'?' (solo Metodo Charmat: Prosecco, Asti, ecc.)':'')+
      '. NON proporre altri tipi anche se tecnicamente migliori per l\'abbinamento.';
  }

  /* Regola precisione archivio enologico */
  system +=
    '\n\nDATABASE VINI - REGOLA PRECISIONE:\n'+
    'Se ricevi dati dall\'archivio enologico SommelierWorld, usali come riferimento tecnico VERIFICATO.\n'+
    'Puoi consigliare qualsiasi vino al mondo — l\'archivio è un riferimento enciclopedico, non esclusivo.\n'+
    'Se trovi una sezione "VINI PROPRI SOMMELIERWORLD", trattala come cantina privata interna. Se il sistema e in pre-launch, presentala come selezione privata in allestimento senza promettere vendita immediata. Se il sistema e live, valorizzala prima dei link esterni e dillo chiaramente con formula simile a "spedito direttamente da SommelierWorld con cura".\n'+
    'Se trovi una sezione "PRIVATE COLLECTION SOMMELIERWORLD — SCELTE DELLA MAISON", considerala la massima espressione curatoriale del brand. Quando uno di questi vini coincide davvero con il piatto, puoi introdurlo con tono alto, per esempio: "Dalla nostra Riserva Privata, ho selezionato un etichetta che incarna..." oppure "Tra le Scelte della Maison, questa bottiglia..." senza trasformare la risposta in pubblicita.\n'+
    'PRECISIONE OBBLIGATORIA: Clairet "Ottin Elio" = ROSSO LEGGERO Valle d Aosta (Nebbiolo + Neyret autoctono).\n'+
    'NON è un vino francese. NON è della Champagne. NON è un rosato provenzale.\n'+
    'Verifica SEMPRE: produttore + denominazione + regione + vitigno prima di descrivere qualsiasi vino.\n'+
    'Se non sei certo al 100% di un vino, cita solo la denominazione senza inventare storie.';

  var userMsg = 'Menu:\n'+menu+vincolo+profilo+wineTypeRule+wineCtx+ownedWineCtx+rankedWineCtx+tipsCtx+(dishAnalysis && dishAnalysis.prompt ? dishAnalysis.prompt : '');
  if(window._menuPhotoB64) userMsg += '\n\n[L\'utente ha caricato una foto del menu — considera che potrebbero esserci piatti non descritti nel testo]';
  if(learningCtx) userMsg += learningCtx;

  /* UI */
  var loadEl = document.getElementById('somLoad');
  var resEl  = document.getElementById('somResult');
  if(loadEl) loadEl.style.display='block';
  if(resEl)  resEl.style.display='none';

  try {
    var res = await window.callAPI(system, userMsg, uiLang);

    /* Estrae il vino menzionato e aggiorna TasteMemory */
    var wineMatch = res.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+){0,3}(?:\s(?:DOCG?|DOC|AOC|IGT|Riserva|Grand Cru|Vintage|AVA|Prädikat))[^\n]{0,40})/);
    if(wineMatch && window._currentSessId) {
      window.TasteMemory.updateWine(window._currentSessId, wineMatch[1]);
    }

    if(loadEl) loadEl.style.display='none';
    if(resEl) {
      resEl.innerHTML = _buildSommelierResultHtml(res)+
        '<div style="display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin-top:20px;'+
          'padding-top:14px;border-top:1px solid rgba(212,175,55,.1);">'+
          '<span style="font-family:Cinzel,serif;font-size:.48rem;letter-spacing:1px;color:rgba(245,239,226,.35);">IL CONSIGLIO TI HA AIUTATO?</span>'+
          '<button onclick="swFbPos(this)" style="padding:7px 16px;border-radius:20px;border:1px solid rgba(40,200,100,.35);background:rgba(40,200,100,.1);color:#5dde8a;font-size:15px;">👍</button>'+
          '<button onclick="swFbNeg(this)" style="padding:7px 16px;border-radius:20px;border:1px solid rgba(220,80,80,.35);background:rgba(220,80,80,.1);color:#f88;font-size:15px;">👎</button>'+
          '<span style="font-family:Cinzel,serif;font-size:.38rem;letter-spacing:1px;color:rgba(212,175,55,.3);">🧠 aiuti il Sommelier a conoscerti meglio</span>'+
        '</div>'+
        (!isElite
          ? '<div style="margin-top:14px;padding:10px 14px;background:rgba(212,175,55,.05);'+
              'border:1px solid rgba(212,175,55,.15);border-radius:8px;display:flex;align-items:center;gap:10px;">'+
              '<div style="flex:1;font-family:\'Cormorant Garamond\',serif;font-size:.9rem;color:rgba(245,239,226,.55);">'+
                'I Membri Elite ricevono la consulenza completa con storia del vino, progressione di abbinamenti e rituale di servizio.'+
              '</div>'+
              '<button onclick="window.showPaywallPopup&&window.showPaywallPopup()" '+
                'style="padding:8px 14px;background:rgba(212,175,55,.18);border:1.5px solid rgba(212,175,55,.38);'+
                'border-radius:8px;color:#D4AF37;font-family:Cinzel,serif;font-size:.48rem;letter-spacing:1px;white-space:nowrap;cursor:pointer;">'+
                '👑 Elite →</button>'+
            '</div>'
          : '');
      resEl.style.display='block';
      resEl.scrollIntoView({behavior:'smooth',block:'nearest'});
      window.TasteMemory.renderBadge();
      window._abbinamentoInCorso = false; /* Reset su successo */
    }
  } catch(e) {
    window._abbinamentoInCorso = false;
    if(loadEl) loadEl.style.display='none';
    /* Messaggio errore user-friendly */
    var errMsg = e.message||'Errore sconosciuto';
    if(errMsg.includes('500')||errMsg.includes('Internal Server')||errMsg.includes('503')) {
      errMsg = 'Servizio momentaneamente occupato. Riprova tra qualche secondo. ↻';
    }
    if(resEl) {
      resEl.innerHTML='<p style="color:#f88;line-height:1.8;font-family:\'Cormorant Garamond\',serif;font-size:1rem;">⚠ '+errMsg+'</p>'+
        '<p style="margin-top:12px;"><button onclick="doAbbinamento()" style="padding:9px 18px;background:rgba(212,175,55,.14);border:1px solid rgba(212,175,55,.36);border-radius:6px;color:#D4AF37;font-family:Cinzel,serif;font-size:.54rem;letter-spacing:1px;">↻ Riprova</button></p>';
      resEl.style.display='block';
    }
  }
};

// ═══════════════════════════════════════════════════════════
// RICERCA VINO UNIVERSALE — DATABASE FIRST, AI ENRICHMENT
// ═══════════════════════════════════════════════════════════
window.searchWine = async function() {
  if(typeof window.checkConsultazioneLibera==='function'){
    if(!window.checkConsultazioneLibera()) return;
  }

  var query = ((document.getElementById('wineSearchInput')||{}).value||'').trim();
  if(!query) return;
  var isElite = typeof window.isEliteUser==='function' ? window.isEliteUser() : false;
  var uiLang = window.getLang ? window.getLang() : 'it';

  var loadEl = document.getElementById('wineSearchLoad');
  var resEl  = document.getElementById('wineSearchResult');
  if(loadEl) loadEl.style.display='block';
  if(resEl)  resEl.style.display='none';

  /* ── STEP 0: Fatti verificati — massima priorità ── */
  var verifiedFact = null;
  if(typeof window.getVerifiedFact === 'function') {
    verifiedFact = window.getVerifiedFact(query);
  }

  /* ── STEP 1: Cerca nel database locale con ranking robusto ── */
  var localMatches = _findLocalWineMatches(query, 6);
  var dbWine = localMatches.length ? localMatches[0] : null;
  var strictSpecificQuery = _looksLikeSpecificWine(query);
  if(dbWine && strictSpecificQuery && localMatches.length > 1) {
    var topScore = _scoreLocalWineMatch(localMatches[0], query);
    var secondScore = _scoreLocalWineMatch(localMatches[1], query);
    if(topScore < 900 && (topScore - secondScore) < 140) dbWine = null;
  }

  /* ── STEP 2: Costruisci contesto AUTORITATIVO dal DB ── */
  var dbContext = '';
  var dbCard = '';
  var dbMatchesCard = '';
  /* Merge verifiedFact into dbWine data (verifiedFact wins on region/country) */
  if(verifiedFact && dbWine) {
    if(verifiedFact.regione) dbWine = Object.assign({}, dbWine, {regione: verifiedFact.regione});
    if(verifiedFact.paese)   dbWine = Object.assign({}, dbWine, {paese: verifiedFact.paese});
    if(verifiedFact.vitigni && verifiedFact.vitigni.length) dbWine = Object.assign({}, dbWine, {vitigni: verifiedFact.vitigni});
  }
  /* Se solo verifiedFact (non in DB): crea wine sintetico */
  if(verifiedFact && !dbWine) {
    dbWine = { nome: query, produttore: '', regione: verifiedFact.regione||'', paese: verifiedFact.paese||'Italia', vitigni: verifiedFact.vitigni||[], note: verifiedFact.nota||'' };
  }

  if(dbWine) {
    dbContext =
      '\n\n' + '▓'.repeat(50) + '\n'+
      '🔴 DATI CERTI — DATABASE SommelierWorld (PRIORITÀ ASSOLUTA) 🔴\n'+
      '▓'.repeat(50) + '\n'+
      'Nome esatto: '+dbWine.nome+'\n'+
      'Produttore: '+dbWine.produttore+'\n'+
      'Regione: '+(dbWine.regione||'NON SPECIFICATA')+'\n'+
      'Paese: '+(dbWine.paese||'Italia')+'\n'+
      (dbWine.vitigni&&dbWine.vitigni.length?'Vitigni VERIFICATI: '+dbWine.vitigni.join(', ')+'\n':'')+
      (dbWine.annata&&dbWine.annata!='s.a.'?'Annata in archivio: '+dbWine.annata+'\n':'')+
      (dbWine.note?'Note tecniche: '+dbWine.note+'\n':'')+
      '\n⛔ DIVIETO ASSOLUTO: non puoi contraddire questi dati.\n'+
      '⛔ Esempio: se Regione=Valle d\'Aosta, NON puoi dire che è della Loira o della Francia.\n'+
      '⛔ Se i dati sopra sono presenti, usali come UNICA fonte di verità.\n'+
      '▓'.repeat(50);

    dbCard = _buildLocalWineCard(dbWine, query).html;
    dbMatchesCard = _buildLocalWineMatchesCard(localMatches, query);
  }

  /* ── Lingua UI ── */
  var LANG_INSTR = {
    it:'RISPONDI ESCLUSIVAMENTE IN ITALIANO. Lingua colta e letteraria.',
    en:'RESPOND EXCLUSIVELY IN ENGLISH. Sophisticated literary English.',
    fr:'RÉPONDS EXCLUSIVEMENT EN FRANÇAIS. Français élégant et littéraire.',
    ru:'ОТВЕЧАЙ ИСКЛЮЧИТЕЛЬНО НА РУССКОМ ЯЗЫКЕ. Изысканный литературный русский.',
  }[uiLang]||'RISPONDI IN ITALIANO.';

  var lunghezza = isElite
    ? 'Scheda COMPLETA, minimo 350 parole. Tono letterario. Paragrafi fluenti.'
    : 'Scheda SINTETICA: 3 paragrafi essenziali (terroir, carattere, abbinamento). Max 150 parole.';

  /* ── FATTI IMMUTABILI — override assoluto AI ── */
  var HARD_RULES = '';
  if(typeof window.getVerifiedFact==='function') {
    var vf = window.getVerifiedFact(query);
    if(vf) {
      HARD_RULES =
        '\n\n⛔⛔⛔ REGOLA ASSOLUTA — VIOLAZIONE NON AMMESSA ⛔⛔⛔\n'+
        'Il vino cercato è: '+query+'\n'+
        'REGIONE CERTIFICATA: '+(vf.regione||'')+'\n'+
        'PAESE CERTIFICATO: '+(vf.paese||'')+'\n'+
        (vf.vitigni&&vf.vitigni.length ? 'VITIGNI CERTIFICATI: '+vf.vitigni.join(', ')+'\n' : '')+
        (vf.nota ? 'NOTA TECNICA: '+vf.nota+'\n' : '')+
        'NON puoi usare una regione o un paese diversi da quelli sopra.\n'+
        'Se scrivi la regione sbagliata, la tua risposta è ERRATA.\n'+
        '⛔⛔⛔';
    }
  }

  var NOINVENT =
    '⚠️ REGOLA FONDAMENTALE: sei un archivio enciclopedico, non un romanziere.\n'+
    'NON inventare mai vitigni, produttori, denominazioni o annate.\n'+
    'Se i dati non sono certi al 100%, dillo esplicitamente con: "Informazione non presente nel database tecnico".\n'+
    'Se il vino non esiste nel tuo sapere verificato, usa la formula:\n'+
    '"Informazione non presente nel database tecnico. Ecco una descrizione generale basata sulla denominazione:\n'+
    '[descrizione basata sul disciplinare ufficiale della denominazione]"';

  var system =
    LANG_INSTR+'\n\n'+
    'Sei il Sommelier Digitale di SommelierWorld — enciclopedia enologica mondiale, come Jancis Robinson o Hugh Johnson. '+lunghezza+'\n\n'+
    '📖 OBIETTIVO: Scheda enciclopedica pura. NON dare consigli di acquisto, NON menzionare prezzi, NON consigliare abbinamenti con piatti specifici (quello è il Sommelier AI).\n\n'+
    '📚 STRUTTURA SCHEDA ENCICLOPEDICA:\n'+
    '  📍 IDENTITÀ — denominazione, regione, paese, produttore (usa solo dati verificati DB)\n'+
    '  🍇 VITIGNI — varietà, storia ampelografica del vitigno, caratteristiche genetiche\n'+
    '  🌍 TERROIR — geologia del suolo, microclima, altitudine, esposizione\n'+
    '  📜 STORIA — origine storica documentata, evoluzione nel tempo, fatti reali\n'+
    '  🍷 NEL CALICE — profilo organolettico: colore, profumi primari/secondari/terziari, struttura\n'+
    '  💡 GLOSSARIO: quando usi termini tecnici spiegali in parentesi:\n'+
    '     tannino (sostanza che dà struttura e astringenza), acidità (freschezza e longevità),\n'+
    '     minerale (sentori di pietra/gesso/salsedine), sapido (persistenza con note salmastre),\n'+
    '     macerazione (contatto bucce-mosto), malolattia (conversione acido malico in lattico)\n\n'+
    NOINVENT+'\n\n'+
    '🌍 TERROIR — suolo, clima, altitudine (basandoti sui dati verificati).\n'+
    '📜 STORIA — fatti storici reali e documentati. Niente invenzioni.\n'+
    '🍷 NEL CALICE — colore, profumi, struttura, finale. Basato sui vitigni reali.\n'+
    '🍽 ABBINAMENTI — classico e inaspettato.\n'+
    (isElite?'✦ IL DETTAGLIO RARO — curiosità documentata, non inventata.\n':'');

  var userMsg = 'Dimmi tutto su: '+query+dbContext;

  try {
    var res = await window.callAPI(system, userMsg, uiLang);
    if(loadEl) loadEl.style.display='none';
    if(resEl) {
      resEl.innerHTML=
        '<div style="font-family:Cinzel,serif;font-size:.62rem;letter-spacing:3px;color:#D4AF37;margin-bottom:16px;">📖 '+query.toUpperCase()+'</div>'+
        dbCard+
        dbMatchesCard+
        _buildOnlineSearchCard(query, !!dbWine)+
        _fmt(res);
      resEl.style.display='block';
      resEl.scrollIntoView({behavior:'smooth',block:'nearest'});
    }
  } catch(e) {
    if(loadEl) loadEl.style.display='none';
    if(resEl) {
      var errMsg = e.message||'';
      var friendly = errMsg.includes('503')||errMsg.includes('occupato')
        ? 'Servizio momentaneamente occupato — riprova tra qualche secondo.'
        : errMsg.includes('500')
          ? 'Errore del server. Premi ↻ Riprova.'
          : 'Informazione non trovata. Prova con un nome diverso o più specifico.';
      resEl.innerHTML =
        '<div style="font-family:Cinzel,serif;font-size:.62rem;letter-spacing:3px;color:#D4AF37;margin-bottom:16px;">📖 '+query.toUpperCase()+'</div>'+
        (dbCard || '')+
        (dbMatchesCard || '')+
        _buildOnlineSearchCard(query, !!dbWine)+
        (dbWine
          ? '<div style="padding:12px 14px;border-radius:8px;background:rgba(212,175,55,.05);border:1px solid rgba(212,175,55,.14);font-family:\'Cormorant Garamond\',serif;line-height:1.8;color:rgba(245,239,226,.72);">Descrizione AI momentaneamente non disponibile. Intanto trovi qui sopra la scheda locale del database e i link per acquistare o confrontare il vino online.</div>'
          : '<p style="color:#f88;font-family:\'Cormorant Garamond\',serif;line-height:1.8;">⚠ '+friendly+'</p>'+
            '<button onclick="window.searchWine&&window.searchWine()" style="margin-top:10px;padding:8px 16px;'+
            'background:rgba(212,175,55,.1);border:1px solid rgba(212,175,55,.3);color:#D4AF37;'+
            'font-family:Cinzel,serif;font-size:.48rem;border-radius:6px;cursor:pointer;">↻ Riprova</button>');
      resEl.style.display='block';
    }
  }
};

window.searchWineWorldwide = window.searchWine;

// ═══════════════════════════════════════════════════════════
// TERROIR — scheda AI profonda
// ═══════════════════════════════════════════════════════════
window._denomCache = {};

window.openDenomDetail = function(id) {
  var denom = (window._DENOM||[]).find(function(d){return d.id===id;});
  if(!denom) return;
  var detail = document.getElementById('expDetail');
  if(!detail) return;
  detail.style.display='block';
  var flag = (window.EFLAGS||{})[denom.country]||'🌍';
  var imgs = {
    'Italia':'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=900&q=90&fit=crop',
    'Francia':'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=900&q=90&fit=crop',
    'Spagna':'https://images.unsplash.com/photo-1586370434639-0fe43b2d32e6?w=900&q=90&fit=crop',
    'Germania':'https://images.unsplash.com/photo-1563220917-916e11d39a86?w=900&q=90&fit=crop',
    'USA':'https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?w=900&q=90&fit=crop',
    'default':'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=900&q=90&fit=crop',
  };
  var heroImg = imgs[denom.country]||imgs.default;
  var tc = {DOCG:'#D4AF37',DOC:'rgba(212,175,55,.75)',AOC:'#a0c8ff',DOCa:'#ffb080',
            PDO:'#b0ffb0',AVA:'#ffaaaa',Prädikat:'#d0aaff',DAC:'#ffe08a',GI:'#aaddff'}[denom.type]||'rgba(212,175,55,.65)';

  var heroHtml =
    '<div style="position:relative;height:200px;overflow:hidden;background:#0d0202;">'+
      '<img src="'+heroImg+'" style="width:100%;height:100%;object-fit:cover;display:block;" loading="eager">'+
      '<div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(10,10,10,.1),rgba(10,10,10,.72));"></div>'+
      '<div style="position:absolute;bottom:0;left:0;right:0;padding:14px 16px;">'+
        '<div style="font-family:Cinzel,serif;font-size:.44rem;letter-spacing:2px;color:rgba(212,175,55,.85);margin-bottom:4px;">'+flag+' '+denom.country+' &middot; '+denom.type+'</div>'+
        '<div style="font-family:Georgia,serif;font-size:1.35rem;font-weight:700;color:#fff;line-height:1.2;">'+denom.name+'</div>'+
      '</div>'+
    '</div>';

  detail.innerHTML = heroHtml+
    '<div style="position:sticky;top:102px;z-index:50;background:rgba(10,10,10,.97);border-bottom:1px solid rgba(212,175,55,.2);padding:12px 16px;display:flex;align-items:center;gap:10px;">'+
      '<button onclick="window.closeDenomDetail()" style="background:none;border:1px solid rgba(212,175,55,.3);color:#D4AF37;font-family:Cinzel,serif;font-size:.52rem;letter-spacing:2px;padding:6px 12px;">← INDIETRO</button>'+
      '<div>'+
        '<div style="font-family:Cinzel,serif;font-size:.7rem;letter-spacing:2px;color:#fff;">'+denom.name+'</div>'+
        '<div style="font-family:Cinzel,serif;font-size:.48rem;color:rgba(212,175,55,.5);">'+flag+' '+denom.country+' · '+denom.region+'</div>'+
      '</div>'+
    '</div>'+
    '<div style="padding:18px 16px;">'+
      '<span style="font-family:Cinzel,serif;font-size:.5rem;letter-spacing:2px;padding:4px 12px;background:'+tc+'1a;border:1px solid '+tc+'55;color:'+tc+';border-radius:20px;">'+denom.type+'</span>'+
      '<div style="font-family:Georgia,serif;font-size:1.55rem;font-weight:700;color:#fff;line-height:1.2;margin:12px 0 8px;">'+denom.name+'</div>'+
      '<div style="font-family:\'IM Fell English\',serif;font-style:italic;font-size:1.05rem;color:rgba(245,239,226,.65);line-height:1.75;margin-bottom:16px;">'+denom.desc+'</div>'+
      '<div style="margin-bottom:18px;">'+
        '<div style="font-family:Cinzel,serif;font-size:.5rem;letter-spacing:2px;color:rgba(212,175,55,.5);margin-bottom:8px;">VITIGNI</div>'+
        '<div style="display:flex;flex-wrap:wrap;gap:6px;">'+
        denom.grapes.split(',').map(function(g){
          return '<span style="font-family:Cinzel,serif;font-size:.5rem;letter-spacing:1px;padding:4px 11px;'+
            'border:1px solid rgba(212,175,55,.28);color:rgba(212,175,55,.8);border-radius:2px;background:rgba(212,175,55,.06);">🍇 '+g.trim()+'</span>';
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

window.closeDenomDetail = function() {
  var d = document.getElementById('expDetail'); if(d) d.style.display='none';
};

window._loadDenomScheda = async function(denom) {
  var cont = document.getElementById('denomSchedaContent');
  if(!cont) return;
  var system = 'RISPONDI ESCLUSIVAMENTE IN ITALIANO.\n\n'+
    'Sei un enologo narratore, ampelografo e storico del vino. '+
    'Scheda enciclopedica LUNGA e APPASSIONANTE. Minimo 500 parole. '+
    'Paragrafi fluenti, mai liste di punti.\n\n'+
    '📜 STORIA E ORIGINI\n🌍 IL TERROIR\n🍇 I VITIGNI\n'+
    '🍷 NEL CALICE (colore, profumi, struttura, finale, longevità)\n'+
    '🏡 PRODUTTORI DI RIFERIMENTO (almeno 4)\n'+
    '🍽 ABBINAMENTI (3 classici + 1 inaspettato)\n'+
    '✦ LA CURIOSITÀ RARA';
  try {
    var text = await window.callAPI(system,
      'Scheda per: '+denom.name+' ('+denom.country+', '+denom.region+')\nVitigni: '+denom.grapes+'\n'+denom.desc,
      'it');
    var html = text
      .replace(/\*\*([^*]+)\*\*/g,'<strong style="color:#F5EFE2;font-style:normal;">$1</strong>')
      .replace(/\*([^*]+)\*/g,'<em>$1</em>')
      .split(/\n\n+/).map(function(p){
        return '<p style="font-family:\'Cormorant Garamond\',serif;font-size:1.02rem;line-height:1.92;color:rgba(245,239,226,.85);margin-bottom:16px;font-style:normal;">'+p.replace(/\n/g,'<br>')+'</p>';
      }).join('');
    window._denomCache[denom.id] = html;
    if(cont) cont.innerHTML = html;
  } catch(e) {
    if(cont) cont.innerHTML =
      '<p style="font-family:\'Cormorant Garamond\',serif;font-size:.95rem;line-height:1.85;color:rgba(245,239,226,.55);font-style:normal;">'+denom.desc+'</p>'+
      '<p style="font-family:\'IM Fell English\',serif;font-style:italic;font-size:.85rem;color:rgba(212,175,55,.35);margin-top:10px;">Scheda non disponibile. Riprova tra 30 secondi.</p>';
  }
};

// ═══════════════════════════════════════════════════════════
// PACCHETTI B2B — solo per pagina Produttori
// ═══════════════════════════════════════════════════════════
var _PKGS = {
  basic:   {label:'BASIC',   emoji:'🍷', prezzo:'€19/mese', importo:19, features:'1 vino · Profilo cantina · Contatti'},
  premium: {label:'PREMIUM', emoji:'⭐', prezzo:'€49/mese', importo:49, features:'5 vini · Galleria fotografica · Link sito web · Badge Premium'},
  elite:   {label:'ELITE',   emoji:'👑', prezzo:'€99/mese', importo:99, features:'Vini illimitati · Scheda AI · Priorità assoluta · Statistiche · Badge Eccellenza'},
};
window._selectedPkg = null;

window.selectPkg = function(pkg) {
  window._selectedPkg = pkg;
  Object.keys(_PKGS).forEach(function(p){
    var el = document.getElementById('pkg_'+p)||document.getElementById('som_pkg_'+p);
    if(!el) return;
    var sel = (p===pkg);
    el.style.opacity    = sel?'1':'0.5';
    el.style.transform  = sel?'scale(1.02)':'scale(1)';
    el.style.boxShadow  = sel?'0 8px 32px rgba(0,0,0,.6)':'none';
    el.style.borderColor= sel?(p==='elite'?'#D4AF37':'rgba(212,175,55,.45)'):'rgba(212,175,55,.15)';
  });
  var badge = document.getElementById('prodFormBadge');
  if(badge) {
    var info=_PKGS[pkg];
    badge.textContent = info.emoji+' '+info.label+' — '+info.prezzo;
  }
  var form = document.getElementById('prodForm');
  if(form){
    form.style.display='block';
    setTimeout(function(){form.scrollIntoView({behavior:'smooth',block:'nearest'});},80);
  }
};

window.submitProd = async function() {
  var nome    = ((document.getElementById('prodNome')   ||{}).value||'').trim();
  var vino    = ((document.getElementById('prodVino')   ||{}).value||'').trim();
  var regione = ((document.getElementById('prodRegione')||{}).value||'').trim();
  var email   = ((document.getElementById('prodEmail')  ||{}).value||'').trim();
  var st      = document.getElementById('prodStatus');
  if(!nome||!email){if(st){st.style.color='#f88';st.textContent='✗ Nome cantina ed email obbligatori.';}return;}
  var pkg=window._selectedPkg||'premium'; var info=_PKGS[pkg];

  if(st){st.style.color='rgba(212,175,55,.5)';st.textContent='⏳ Invio in corso…';}

  try {
    var r = await fetch(_getSRV() + '/api/site-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        kind: 'producer_request',
        name: nome,
        email: email,
        company: nome,
        region: regione || '—',
        wine_name: vino || '—',
        package_label: info.label + ' ' + info.prezzo,
        source: 'producer-form',
        lang: (window.i18n && window.i18n.getCurrentLang ? window.i18n.getCurrentLang() : 'it'),
        message: 'Nuova iscrizione produttore SommelierWorld\n'+
                 'Cantina: '+nome+'\n'+
                 'Vino: '+(vino||'—')+'\n'+
                 'Regione: '+(regione||'—')+'\n'+
                 'Pacchetto: '+info.label+' '+info.prezzo+'\n'+
                 'Email: '+email,
      }),
    });

    var d = await r.json().catch(function(){ return {}; });

    if(r.ok && d.ok !== false) {
      /* Salva anche in localStorage per l'admin */
      try {
        var prods = JSON.parse(localStorage.getItem('sw_producers')||'[]');
        prods.unshift({
          id:'prod_'+Date.now(), name:nome, email:email,
          vino:vino, regione:regione, package:pkg,
          prezzo:info.prezzo, approved:false,
          ts:new Date().toISOString(),
        });
        localStorage.setItem('sw_producers', JSON.stringify(prods));
      } catch(e2){}

      if(st){
        st.style.color='#D4AF37';
        st.style.fontFamily='Cinzel,serif';
        st.style.fontSize='.56rem';
        st.textContent='✓ Richiesta inviata! Ti contatteremo a '+email+' entro 24 ore.';
      }
      var flash=document.createElement('div');
      flash.className='gold-flash-overlay';
      document.body.appendChild(flash);
      setTimeout(function(){flash.remove();},2000);
      ['prodNome','prodVino','prodRegione','prodEmail'].forEach(function(id){
        var e=document.getElementById(id);if(e)e.value='';
      });
    } else {
      /* Worker o mailer non hanno accettato — usa mailto come fallback */
      var subject = encodeURIComponent('[SW] '+nome+' — '+info.label);
      var body = encodeURIComponent('Cantina: '+nome+'\nEmail: '+email+'\nPacchetto: '+info.label);
      window.open('mailto:info@sommelierworld.vin?subject='+subject+'&body='+body);
      if(st){st.style.color='#f88';st.textContent='✗ Errore invio: '+(d.error||'riprova');}
    }
  } catch(e) {
    /* Fallback mailto se rete non disponibile */
    if(st){st.style.color='#f88';st.textContent='✗ Connessione assente — apertura email…';}
    var subject2 = encodeURIComponent('[SW] '+nome+' — '+info.label);
    var body2 = encodeURIComponent('Cantina: '+nome+'\nEmail: '+email+'\nPacchetto: '+info.label);
    window.open('mailto:info@sommelierworld.vin?subject='+subject2+'&body='+body2);
  }
};

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function() {
  window.TasteMemory.renderBadge();
  if(window.TasteMemory && typeof window.TasteMemory.syncServerProfile === 'function') {
    window.TasteMemory.syncServerProfile().then(function(){
      window.TasteMemory.renderBadge();
    });
  }
  window._loadEliteProducers();
});
