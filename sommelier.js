/**
 * SOMMELIER WORLD — sommelier.js v27
 * ─────────────────────────────────────────────────────────────
 * NUOVO: Sistema di apprendimento adattivo (TasteMemory).
 *        Il Sommelier impara dai tuoi feedback e migliora nel tempo.
 * FIX:   Prompt Free corretto — risposta più precisa e professionale.
 * B2C:   Paywall 3 consultazioni/giorno, Elite illimitato €2.99/mese.
 * B2B:   Pacchetti cantina solo nella pagina Produttori (non qui).
 */

var _SRV = 'https://hidden-term-f2d0.timotiniurie49.workers.dev'; /* Cloudflare Worker — key sicura */

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
          'position:fixed','bottom:76px','right:12px','z-index:9998',
          'background:rgba(10,6,4,.92)',
          'border:1px solid rgba(212,175,55,.3)',
          'border-radius:24px','padding:6px 14px',
          'display:flex','align-items:center','gap:6px',
          'cursor:pointer','transition:all .22s',
          'box-shadow:0 4px 20px rgba(0,0,0,.5)',
          'font-family:Cinzel,serif','font-size:.5rem','letter-spacing:0','color:rgba(212,175,55,.6)',
        ].join(';');
        badge.title = 'Il tuo Sommelier personale — vedi il profilo apprendimento';
        badge.onclick = function(){ window.TasteMemory.showLearningProfile(); };
        badge.onmouseover = function(){ this.style.opacity='1'; };
        badge.onmouseout  = function(){ this.style.opacity='.55'; };
        document.body.appendChild(badge);
      }
      /* Badge minimalista: solo icona + numero sessioni */
      badge.textContent = stats.total === 0 ? '🧠' : '🧠 '+stats.total;
      badge.title = stats.total === 0
        ? 'Il Sommelier impara dai tuoi gusti — toccami per saperne di più'
        : 'Il tuo Sommelier personale: '+stats.total+' sessioni, '+stats.positivi+' preferiti';
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

// ═══════════════════════════════════════════════════════════
// SELECT PAESE → REGIONE
// ═══════════════════════════════════════════════════════════
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
  var sel = document.getElementById('winePaese');
  if(sel) {
    Object.keys(window.REGIONI).forEach(function(p){
      var o=document.createElement('option'); o.value=p; o.textContent=p; sel.appendChild(o);
    });
    sel.onchange = window.updateRegioni;
  }
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
    var r = await fetch('https://hidden-term-f2d0.timotiniurie49.workers.dev', {
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
    if(r.ok && d.text) return d.text;
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

// ═══════════════════════════════════════════════════════════
// FOTO MENU
// ═══════════════════════════════════════════════════════════
window._menuPhotoB64 = null;

window._scannedDishes = null; // {antipasti:[], primi:[], secondi:[], dessert:[], altro:[]}

window.handleMenuPhoto = function(input) {
  if(!input.files||!input.files[0]) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    window._menuPhotoB64 = e.target.result;
    window._scannedDishes = null;
    var preview = document.getElementById('menuPhotoPreview');
    var img     = document.getElementById('menuPhotoImg');
    if(preview) preview.style.display='block';
    if(img)     img.src = e.target.result;
    /* Mostra bottone scansione */
    var scanBtn = document.getElementById('menuScanBtn');
    if(scanBtn) scanBtn.style.display='block';
    /* Nascondi risultati precedenti */
    var scanRes = document.getElementById('menuScanResult');
    if(scanRes) scanRes.style.display='none';
  };
  reader.readAsDataURL(input.files[0]);
};

window.clearMenuPhoto = function() {
  window._menuPhotoB64 = null;
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
};

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

  var sysPrompt = 'Sei un sommelier esperto di cucina. Analizza il menu nella foto e restituisci SOLO un JSON valido.';
  var userPrompt = 'Analizza questa immagine del menu ristorante. Estrai SOLO i piatti di cibo e classificali per portata.'+
    'REGOLE OBBLIGATORIE: '+
    '1. Includi SOLO piatti di cibo (antipasti, pasta, risotti, carni, pesce, dolci). '+
    '2. ESCLUDI ASSOLUTAMENTE: vini, bevande, cocktail, acqua, birra, liquori, digestivi, caffè. '+
    '3. Mantieni il nome esatto del piatto come scritto nel menu. '+
    '4. Non aggiungere commenti, prezzi o descrizioni. Solo il nome del piatto. '+
    'Rispondi SOLO con questo JSON (nessun testo fuori, no markdown):\n'+
    '{"antipasti":["nome piatto"],"primi":["nome piatto"],"secondi":["nome piatto"],"contorni":[],"dessert":[],"altro":[]}\n'+
    'Se una categoria non ha piatti, metti array vuoto [].';

  try {
    /* Usa callAPI con immagine embedded */
    var ctrl = new AbortController();
    var t = setTimeout(function(){ ctrl.abort(); }, 40000);
    var r = await fetch('https://hidden-term-f2d0.timotiniurie49.workers.dev', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        system: sysPrompt,
        userMsg: userPrompt,
        imageB64: b64,
        imageMime: mime,
        maxTokens: 600,
      }),
      signal: ctrl.signal,
    });
    clearTimeout(t);
    var d = await r.json();
    if(!d.text) throw new Error('Risposta vuota');

    var clean = d.text.replace(/```json|```/g,'').trim();
    var start = clean.indexOf('{');
    var end = clean.lastIndexOf('}');
    var dishes = JSON.parse(clean.slice(start, end+1));
    window._scannedDishes = dishes;
    window.renderDishCheckboxes(dishes);

  } catch(err) {
    /* Fallback: chiedi descrizione testuale */
    scanRes.innerHTML =
      '<div style="padding:14px;background:rgba(200,50,50,.08);border:1px solid rgba(200,50,50,.2);border-radius:6px;font-family:Cinzel,serif;font-size:.5rem;color:rgba(245,100,100,.7);">'+
      '⚠ Non riesco a leggere il menu dalla foto.<br><span style="font-size:.8rem;font-family:serif;font-style:italic;color:rgba(245,239,226,.4);">'+
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

/* Stato selezione piatti — oggetto globale {cat_idx: true/false} */
window._dishSelected = {};

window.renderDishCheckboxes = function(dishes) {
  var scanRes = document.getElementById('menuScanResult');
  if(!scanRes) return;
  window._dishSelected = {};
  window._dishData = dishes;
  var ORDER = ['antipasti','primi','secondi','contorni','dessert','altro'];

  var totalDishes = 0;
  ORDER.forEach(function(cat) {
    var items = dishes[cat];
    if(!items||!items.length) return;
    items.forEach(function(dish, di) {
      var key = cat+'_'+di;
      window._dishSelected[key] = false;
    });
    totalDishes += items.length;
  });

  var html = '<div style="margin-top:10px;">';

  /* Titolo */
  html += '<div style="font-family:Cinzel,serif;font-size:.54rem;letter-spacing:3px;color:#D4AF37;'+
    'padding:10px 0 10px;text-align:center;border-top:1px solid rgba(212,175,55,.2);'+
    'border-bottom:1px solid rgba(212,175,55,.1);margin-bottom:12px;">'+
    'TOCCA I PIATTI PER SELEZIONARLI</div>';

  if(totalDishes === 0) {
    html += '<div style="padding:16px;text-align:center;color:rgba(245,239,226,.4);'+
      'font-style:italic;font-size:.9rem;">Nessun piatto trovato.<br>Scrivi il menu manualmente.</div>';
  } else {
    ORDER.forEach(function(cat) {
      var items = dishes[cat];
      if(!items||!items.length) return;
      var cfg = _COURSE_CONFIG[cat];

      /* Header portata */
      html += '<div style="background:'+cfg.bg+';padding:8px 14px;display:flex;align-items:center;gap:8px;'+
        'border-left:3px solid '+cfg.border.replace('.25','.6')+';margin-bottom:2px;margin-top:8px;">';
      html += '<span style="font-size:1.3rem;">'+cfg.emoji+'</span>';
      html += '<span style="font-family:Cinzel,serif;font-size:.58rem;letter-spacing:2px;'+
        'color:rgba(245,239,226,.9);font-weight:bold;">'+cfg.label.toUpperCase()+'</span>';
      html += '</div>';

      /* Piatti come pill selezionabili */
      html += '<div style="display:flex;flex-direction:column;gap:4px;margin-bottom:4px;">';
      items.forEach(function(dish, di) {
        var key = cat+'_'+di;
        var safeId = 'dp_'+key;
        var safeDish = dish.replace(/'/g,"\'").replace(/"/g,'&quot;');
        html += '<div id="'+safeId+'" ';
        html += 'onclick="window.toggleDish(this)" ';
        html += 'data-dish="'+safeDish+'" data-cat="'+cat+'" data-key="'+key+'" data-selected="0" ';
          'style="display:flex;align-items:center;gap:14px;padding:11px 14px;'+
          'background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);'+
          'border-radius:8px;cursor:pointer;user-select:none;-webkit-user-select:none;'+
          'transition:all .2s;">';
        /* Cerchio toggle */
        html += '<div class="dish-check-'+key+'" style="width:22px;height:22px;border-radius:50%;'+
          'border:2px solid rgba(212,175,55,.4);background:transparent;flex-shrink:0;'+
          'display:flex;align-items:center;justify-content:center;font-size:.9rem;"></div>';
        html += '<span style="font-size:1rem;color:rgba(245,239,226,.85);">'+dish+'</span>';
        html += '</div>';
      });
      html += '</div>';
    });

    /* Contatore + azione */
    html += '<div id="dishCounter" style="font-family:Cinzel,serif;font-size:.48rem;letter-spacing:1px;'+
      'color:rgba(212,175,55,.5);text-align:center;padding:8px 0 4px;">'+
      '0 piatti selezionati</div>';

    html += '<div style="display:flex;gap:8px;margin-top:6px;">';
    html += '<button onclick="window.selectAllDishes(true)" '+
      'style="flex:1;padding:10px;font-family:Cinzel,serif;font-size:.44rem;letter-spacing:1px;'+
      'background:rgba(255,255,255,.05);border:1px solid rgba(212,175,55,.25);'+
      'color:rgba(212,175,55,.7);border-radius:6px;cursor:pointer;">'+
      '✓ TUTTI</button>';
    html += '<button onclick="window.selectAllDishes(false)" '+
      'style="flex:1;padding:10px;font-family:Cinzel,serif;font-size:.44rem;letter-spacing:1px;'+
      'background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.1);'+
      'color:rgba(245,239,226,.4);border-radius:6px;cursor:pointer;">'+
      '✕ NESSUNO</button>';
    html += '</div>';
    html += '<button onclick="window.useSelectedDishes()" '+
      'style="width:100%;margin-top:8px;padding:14px;font-family:Cinzel,serif;font-size:.54rem;'+
      'letter-spacing:2px;background:linear-gradient(135deg,rgba(180,30,30,.7),rgba(120,10,10,.6));'+
      'border:1px solid rgba(212,100,80,.4);color:#fff;border-radius:8px;cursor:pointer;">'+
      '🍷 ABBINA IL VINO AI PIATTI SELEZIONATI</button>';
  }

  html += '</div>';
  scanRes.innerHTML = html;
};

/* Toggle singolo piatto — funziona su tap mobile e click desktop */
window.toggleDish = function(el) {
  var key  = el.dataset.key;
  var dish = el.dataset.dish;
  var cat  = el.dataset.cat;
  window._dishSelected[key] = !window._dishSelected[key];
  var sel = window._dishSelected[key];
  var el = document.getElementById('dp_'+key);
  var check = el ? el.querySelector('.dish-check-'+key) : null;

  if(el) {
    el.style.background    = sel ? 'rgba(212,175,55,.15)' : 'rgba(255,255,255,.04)';
    el.style.border        = sel ? '1px solid rgba(212,175,55,.5)' : '1px solid rgba(255,255,255,.08)';
    el.setAttribute('data-selected', sel ? '1' : '0');
  }
  if(check) {
    check.style.background   = sel ? '#D4AF37' : 'transparent';
    check.style.borderColor  = sel ? '#D4AF37' : 'rgba(212,175,55,.4)';
    check.textContent        = sel ? '✓' : '';
    check.style.color        = '#1a0a05';
    check.style.fontWeight   = 'bold';
  }

  /* Aggiorna contatore */
  var count = Object.values(window._dishSelected).filter(Boolean).length;
  var cEl = document.getElementById('dishCounter');
  if(cEl) cEl.textContent = count + ' piatt'+(count===1?'o':'i')+' selezionat'+(count===1?'o':'i');
};

window.selectAllDishes = function(checked) {
  Object.keys(window._dishSelected).forEach(function(key) {
    var parts = key.split('_');
    var cat = parts[0];
    var di = parts[1];
    var dishes = window._dishData && window._dishData[cat];
    var dish = dishes ? dishes[di] : '';
    window._dishSelected[key] = false; /* reset first */
    if(checked) {
      var elem = document.getElementById('dp_'+key);
      if(elem) window.toggleDish(elem);
    }
    else {
      /* Force deselect visual */
      var el = document.getElementById('dp_'+key);
      var check = el ? el.querySelector('.dish-check-'+key) : null;
      if(el) { el.style.background='rgba(255,255,255,.04)'; el.style.border='1px solid rgba(255,255,255,.08)'; }
      if(check) { check.style.background='transparent'; check.style.borderColor='rgba(212,175,55,.4)'; check.textContent=''; }
    }
  });
  if(!checked) {
    var cEl = document.getElementById('dishCounter');
    if(cEl) cEl.textContent = '0 piatti selezionati';
  }
};

window.useSelectedDishes = function() {
  var selected = [];
  var byCategory = {};
  /* Legge da _dishSelected + _dishData (non da checkbox nativi) */
  Object.keys(window._dishSelected||{}).forEach(function(key) {
    if(!window._dishSelected[key]) return;
    var parts = key.split('_');
    var cat = parts[0];
    var di  = parseInt(parts[1]);
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

  /* Popola il textarea del menu */
  var ta = document.getElementById('menuInput');
  if(ta) { ta.value = menuText; ta.style.borderColor='rgba(212,175,55,.4)'; }

  /* Scroll al bottone e avvia abbinamento */
  var btn = document.querySelector('button[onclick*="doAbbinamento"]');
  if(btn) { btn.scrollIntoView({behavior:'smooth',block:'center'}); }

  /* Feedback visivo */
  var scanRes = document.getElementById('menuScanResult');
  if(scanRes) {
    var count = selected.length;
    var extra = '<div style="margin-top:10px;padding:10px;background:rgba(122,200,80,.08);border:1px solid rgba(122,200,80,.2);border-radius:6px;font-family:Cinzel,serif;font-size:.5rem;letter-spacing:1px;color:rgba(122,200,80,.8);">'+
      '✓ '+count+' piatt'+(count===1?'o':'i')+' selezionat'+(count===1?'o':'i')+' — ora clicca CONSULTA IL SOMMELIER</div>';
    scanRes.insertAdjacentHTML('beforeend', extra);
  }
};



// ═══════════════════════════════════════════════════════════
// FEEDBACK con TasteMemory
// ═══════════════════════════════════════════════════════════
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
  if(window._abbinamentoInCorso) return;
  window._abbinamentoInCorso = true;

  /* Paywall B2C */
  if(typeof window.checkConsultazioneLibera==='function'){
    if(!window.checkConsultazioneLibera()) return;
  }

  /* Legge tipo vino selezionato dall'utente */
  var wineTypePrefs = (document.getElementById('selectedWineType')||{}).value || window._selectedWineType || 'any';
  var bollicineSubtype = window._selectedBollicineType || '';

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

  /* Avvia sessione TasteMemory */
  window._currentSessId = window.TasteMemory.startSession(menu, budget, params);

  /* Contesti */
  var learningCtx = window.TasteMemory.buildLearningContext(menu);
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
    'PRIMA di rispondere, identifica il piatto più importante del menu (solitamente il secondo).',
    'Scegli il vino in base a QUEL piatto, poi verifica la coerenza con gli altri.',
    'Se il menu include selvaggina o carne rossa, non proporre mai un bianco come vino principale.',
    'Se il menu ha 5+ portate, proponi una progressione di vini.',
    'Ogni vino consigliato DEVE avere un produttore specifico reale e un\'annata indicativa.',
  ].join('\n');

  var lunghezza = isElite
    ? 'Rispondi con descrizione COMPLETA e POETICA. Minimo 350 parole. Struttura in sezioni. Proponi esattamente 3 vini in ordine di preferenza.'
    : 'Rispondi in modo CONCISO ma PRECISO. Proponi esattamente 3 vini consigliati in ordine di preferenza. Per ogni vino: denominazione + produttore + annata + motivazione tecnica precisa + temperatura di servizio. Non menzionare mai prezzi. Non essere generico — sii specifico come un sommelier professionista.';

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

  var system =
    HARD_RULES+LANG_INSTR+'\n\n'+
    'Sei il Sommelier Digitale di SommelierWorld — archivio enologico mondiale. '+
    'La tua identità si basa su PRECISIONE TECNICA, rispetto dei disciplinari ufficiali DOCG/DOC e descrizioni didattiche.\n'+
    PRODUCER_CHECK+'\n\n'+
    '━━━ REGOLE ENOLOGICHE (mai violarle) ━━━\n'+
    ARMONIE+'\n\n'+
    '━━━ PROCESSO DI RAGIONAMENTO ━━━\n'+
    qualitaCheck+'\n'+
    (params.paese?'\\n🔴 SOLO vini di '+params.paese+(params.regione?' / '+params.regione:'')+'.':'')+
    eliteCtx+'\\n\\n'+
    '⚠️ REGOLA ASSOLUTA: Non menzionare MAI prezzi, costi o fasce di budget. Il prezzo non è un criterio di selezione professionale.\\n\\n'+
    lunghezza+'\\n\\n'+
    '━━━ STRUTTURA RISPOSTA ━━━\\n'+
    (isElite
      ? '① ANIMA DEL PIATTO — sintesi sensoriale poetica del menu.\\n'+
        '② SELEZIONE 3 VINI in ordine di preferenza:\\n'+
        '   🥇 1° SCELTA — produttore verificato + denominazione + annata + motivazione poetica + temperatura + calice.\\n'+
        '   🥈 2° SCELTA — stessa logica, stile o origine diversi.\\n'+
        '   🥉 3° SCELTA — denominazione alternativa, vitigno o terroir diverso.\\n'+
        '③ IL SEGRETO — aneddoto raro sul vino o produttore preferito.'
      : '🥇 1° SCELTA — denominazione + produttore reale + annata. Motivazione tecnica precisa. Temperatura e decanter.\\n'+
        '🥈 2° SCELTA — denominazione + produttore reale + annata. Motivazione tecnica. Temperatura.\\n'+
        '🥉 3° SCELTA — denominazione alternativa (diversa regione o vitigno). Motivazione breve.');
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
    'PRECISIONE OBBLIGATORIA: Clairet "Ottin Elio" = ROSSO LEGGERO Valle d Aosta (Nebbiolo + Neyret autoctono).\n'+
    'NON è un vino francese. NON è della Champagne. NON è un rosato provenzale.\n'+
    'Verifica SEMPRE: produttore + denominazione + regione + vitigno prima di descrivere qualsiasi vino.\n'+
    'Se non sei certo al 100% di un vino, cita solo la denominazione senza inventare storie.';

  var userMsg = 'Menu:\n'+menu+vincolo+profilo+wineTypeRule+wineCtx+tipsCtx;
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
      resEl.innerHTML = _fmt(res)+
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

  /* ── STEP 1: Cerca nel database locale ── */
  var dbWine = null;
  if(typeof window.WINE_DB !== 'undefined') {
    var all = window.WINE_DB.all();
    var q = query.toLowerCase();
    /* Cerca per nome esatto prima, poi produttore, poi denominazione */
    dbWine = all.find(function(w){ return (w.nome||'').toLowerCase() === q; }) ||
             all.find(function(w){ return (w.produttore||'').toLowerCase() === q; }) ||
             all.find(function(w){ return (w.nome||'').toLowerCase().includes(q); }) ||
             all.find(function(w){ return (w.produttore||'').toLowerCase().includes(q); }) ||
             all.find(function(w){ return (w.denominazione||'').toLowerCase().includes(q); });
  }

  /* ── STEP 2: Costruisci contesto AUTORITATIVO dal DB ── */
  var dbContext = '';
  var dbCard = '';
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

    /* Mini-card DB da mostrare prima della risposta AI */
    dbCard =
      '<div style="background:rgba(212,175,55,.06);border:1px solid rgba(212,175,55,.2);border-radius:8px;padding:12px 14px;margin-bottom:16px;">'+
      '<div style="font-family:Cinzel,serif;font-size:.44rem;letter-spacing:2px;color:rgba(212,175,55,.5);margin-bottom:6px;">📋 IN CARTA — DATO VERIFICATO</div>'+
      '<div style="font-family:Cinzel,serif;font-size:.7rem;color:#F5EFE2;">'+dbWine.nome+'</div>'+
      '<div style="font-size:.82rem;color:rgba(212,175,55,.6);margin-top:3px;">'+dbWine.produttore+(dbWine.annata&&dbWine.annata!='s.a.'?' · '+dbWine.annata:'')+'</div>'+
      (dbWine.denominazione?'<div style="font-size:.75rem;color:rgba(245,239,226,.4);margin-top:2px;">'+dbWine.denominazione+(dbWine.regione?' · '+dbWine.regione:'')+'</div>':'')+
      (dbWine.vitigni&&dbWine.vitigni.length?'<div style="font-size:.72rem;color:rgba(245,239,226,.35);margin-top:2px;">🍇 '+dbWine.vitigni.join(', ')+'</div>':'')+
      '</div>';
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
        _fmt(res);
      resEl.style.display='block';
      resEl.scrollIntoView({behavior:'smooth',block:'nearest'});
    }
  } catch(e) {
    if(loadEl) loadEl.style.display='none';
    if(resEl) {
      var errMsg = e.message||'';
      var friendly = (errMsg.includes('500')||errMsg.includes('503'))
        ? 'Servizio momentaneamente occupato. Riprova tra qualche secondo. ↻'
        : 'Mi dispiace, non ho potuto recuperare le informazioni. Scrivi a info@sommelierworld.vin per supporto.';
      resEl.innerHTML='<p style="color:#f88;font-family:\'Cormorant Garamond\',serif;line-height:1.8;">⚠ '+friendly+'</p>';
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
    /* Invia a Formspree — arriva direttamente in Gmail */
    var r = await fetch('https://formspree.io/f/xnjlygnn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        cantina:  nome,
        email:    email,
        vino:     vino    || '—',
        foto:     foto    || '—',
        regione:  regione || '—',
        pacchetto:info.label + ' ' + info.prezzo,
        message:  'Nuova iscrizione Sommelier World\n'+
                  'Cantina: '+nome+'\n'+
                  'Vino: '+(vino||'—')+'\n'+
                  'Regione: '+(regione||'—')+'\n'+
                  'Pacchetto: '+info.label+' '+info.prezzo+'\n'+
                  'Email: '+email,
      }),
    });

    var d = await r.json();

    if(r.ok && d.ok !== false) {
      /* Salva anche in localStorage per l'admin */
      try {
        var prods = JSON.parse(localStorage.getItem('sw_producers')||'[]');
        prods.unshift({
          id:'prod_'+Date.now(), name:nome, email:email,
          vino:vino, foto:foto, regione:regione, package:pkg,
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
      /* Formspree ha rifiutato — usa mailto come fallback */
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
  window._loadEliteProducers();
});
