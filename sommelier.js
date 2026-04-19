/**
 * SOMMELIER WORLD — sommelier.js v24-restored
 * Consulenza vino narrativa e poetica — senza tecnicismi accademici
 */

// ── REGIONI DEL MONDO ──
window.REGIONI = {
  'Italia':        ['Piemonte', 'Toscana', 'Veneto', 'Sicilia', 'Campania', 'Friuli-Venezia Giulia', 'Alto Adige', 'Sardegna', 'Umbria', 'Marche', 'Lombardia', 'Abruzzo', 'Puglia', 'Trentino', 'Lazio'],
  'Francia':       ['Borgogna', 'Bordeaux', 'Rodano', 'Alsazia', 'Champagne', 'Loira', 'Languedoc-Roussillon', 'Provenza', 'Beaujolais', 'Jura'],
  'Spagna':        ['Rioja', 'Ribera del Duero', 'Priorat', 'Rías Baixas', 'Jerez', 'Toro', 'Penedès', 'Bierzo'],
  'USA':           ['Napa Valley', 'Sonoma', 'Willamette Valley', 'Paso Robles', 'Santa Barbara', 'Finger Lakes'],
  'Germania':      ['Mosel', 'Rheingau', 'Pfalz', 'Baden', 'Rheinhessen', 'Nahe', 'Franken'],
  'Portogallo':    ['Douro', 'Alentejo', 'Vinho Verde', 'Dão', 'Bairrada', 'Lisboa'],
  'Argentina':     ['Mendoza', 'Salta', 'Patagonia', 'Uco Valley', 'San Juan'],
  'Cile':          ['Maipo', 'Colchagua', 'Casablanca', 'Elqui', 'Bío-Bío'],
  'Australia':     ['Barossa Valley', 'McLaren Vale', 'Clare Valley', 'Yarra Valley', 'Margaret River', 'Hunter Valley'],
  'Nuova Zelanda': ['Marlborough', 'Central Otago', "Hawke's Bay"],
  'Grecia':        ['Santorini', 'Naoussa', 'Nemea', 'Creta'],
  'Austria':       ['Wachau', 'Kamptal', 'Kremstal', 'Burgenland', 'Steiermark'],
  'Ungheria':      ['Tokaj', 'Eger', 'Villány'],
  'Georgia':       ['Kakheti', 'Kartli', 'Imereti'],
  'Sud Africa':    ['Stellenbosch', 'Swartland', 'Franschhoek', 'Walker Bay'],
};

// ── ESEMPI VINI PER PAESE ──
var ESEMPI = {
  'Germania':     'Riesling Mosel (Egon Müller, JJ Prüm), Spätburgunder Ahr (Meyer-Näkel)',
  'Francia':      'Bourgogne Pinot Noir, Chablis, Champagne, Châteauneuf-du-Pape',
  'Spagna':       'Rioja Tempranillo (Muga, CVNE), Ribera del Duero, Albariño Rías Baixas',
  'USA':          'Napa Cabernet Sauvignon (Opus One, Stag\'s Leap), Willamette Pinot Noir',
  'Grecia':       'Assyrtiko Santorini (Gaia, Hatzidakis), Xinomavro Naoussa',
  'Portogallo':   'Douro Touriga Nacional (Niepoort, Ramos Pinto), Alentejo, Vinho Verde',
  'Argentina':    'Mendoza Malbec (Catena Zapata, Achaval Ferrer), Salta Torrontés',
  'Australia':    'Barossa Shiraz (Penfolds Grange, Henschke), Clare Valley Riesling',
  'Cile':         'Maipo Cabernet (Don Melchor, Almaviva), Casablanca Sauvignon Blanc',
  'Austria':      'Wachau Grüner Veltliner (Hirtzberger, Knoll), Burgenland Blaufränkisch',
  'Nuova Zelanda':'Marlborough Sauvignon Blanc (Cloudy Bay), Central Otago Pinot Noir',
  'Sud Africa':   'Stellenbosch Cabernet (Kanonkop, Meerlust), Swartland Chenin Blanc',
};

// ── AGGIORNA SELECT REGIONI ──
window.updateRegioni = function() {
  var paese = (document.getElementById('winePaese') || {}).value || '';
  var sel = document.getElementById('wineRegione');
  if (!sel) return;
  sel.innerHTML = '<option value="">Qualsiasi regione</option>';
  (REGIONI[paese] || []).forEach(function(r) {
    var o = document.createElement('option');
    o.value = r; o.textContent = r;
    sel.appendChild(o);
  });
  sel.disabled = !paese;
};

// Popola select paese
document.addEventListener('DOMContentLoaded', function() {
  var sel = document.getElementById('winePaese');
  if (!sel) return;
  Object.keys(REGIONI).forEach(function(p) {
    var o = document.createElement('option');
    o.value = p; o.textContent = p;
    sel.appendChild(o);
  });
  sel.onchange = updateRegioni;
});

// ── SLIDER PROFILO ORGANOLETTICO ──
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
  var aciditaL =    ['Bassa', 'Medio-bassa', 'Media', 'Medio-alta', 'Alta'];
  var morbidL =     ['Secco e asciutto', 'Poco morbido', 'Equilibrato', 'Morbido', 'Avvolgente'];
  var sapidL =      ['Bassa', 'Poco sapido', 'Sapido', 'Molto sapido', 'Minerale-salino'];
  var struttL =     ['Leggero e delicato', 'Medio-leggero', 'Equilibrato', 'Pieno', 'Potente e concentrato'];

  function getL(id, labels) {
    var e = document.getElementById(id);
    return e ? labels[parseInt(e.value) - 1] : labels[2];
  }
  return {
    acidita:    getL('acidita',    aciditaL),
    morbidezza: getL('morbidezza', morbidL),
    sapidita:   getL('sapidita',   sapidL),
    struttura:  getL('struttura',  struttL),
    paese:   (document.getElementById('winePaese')  || {}).value || '',
    regione: (document.getElementById('wineRegione') || {}).value || '',
  };
};

// ── TASTE ENGINE ──
window.TasteEngine = (function() {
  var KEY = 'sw_taste_v2';
  var DEF = { sessions: 0, paese: {}, budget: [], feedback: { pos: 0, neg: 0 }, ultimiVini: [], lifestyle: {} };

  function load() {
    try { var r = localStorage.getItem(KEY); return r ? Object.assign({}, DEF, JSON.parse(r)) : Object.assign({}, DEF); }
    catch(e) { return Object.assign({}, DEF); }
  }
  function save(p) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch(e) {} }
  function inc(obj, k) { if (k) obj[k] = (obj[k] || 0) + 1; }

  return {
    recordSession: function(opts) {
      var p = load(); p.sessions++;
      if (opts.paese) inc(p.paese, opts.paese);
      if (opts.budget) { p.budget.push(Number(opts.budget)); if (p.budget.length > 6) p.budget.shift(); }
      save(p);
    },
    recordWine: function(name) {
      if (!name) return;
      var p = load();
      p.ultimiVini.unshift(name.substring(0, 60));
      if (p.ultimiVini.length > 6) p.ultimiVini.pop();
      save(p);
    },
    recordFeedback: function(positive) {
      var p = load();
      if (positive) p.feedback.pos = (p.feedback.pos || 0) + 1;
      else p.feedback.neg = (p.feedback.neg || 0) + 1;
      save(p);
    },
    buildPromptContext: function() {
      var p = load();
      if (p.sessions < 1) return '';
      var lines = ['═══ PROFILO GUSTO (memoria personale) ═══'];
      lines.push('Sessioni: ' + p.sessions);
      var topP = Object.entries(p.paese || {}).sort(function(a, b) { return b[1] - a[1]; })[0];
      if (topP) lines.push('Preferisce vini di: ' + topP[0]);
      if (p.budget && p.budget.length) lines.push('Budget tipico: €' + Math.round(p.budget.reduce(function(a, b) { return a + b; }, 0) / p.budget.length));
      if (p.ultimiVini && p.ultimiVini.length) lines.push('Vini già consigliati (evita di ripetere): ' + p.ultimiVini.join(', '));
      lines.push('═══════════════════════════════════════════');
      return '\n\n' + lines.join('\n');
    },
    renderBadge: function() {
      var p = load();
      if (p.sessions < 1) return;
      var badge = document.getElementById('al-taste-badge');
      if (!badge) {
        badge = document.createElement('div');
        badge.id = 'al-taste-badge';
        badge.style.cssText = 'position:fixed;top:8px;right:60px;z-index:99998;background:rgba(191,155,74,.15);border:1px solid rgba(191,155,74,.28);border-radius:20px;padding:3px 10px;font-family:Cinzel,serif;font-size:9px;color:#BF9B4A;letter-spacing:1px;cursor:pointer;';
        badge.title = 'Il tuo profilo gusto';
        badge.onclick = function() { TasteEngine.showProfile(); };
        document.body.appendChild(badge);
      }
      badge.textContent = '🍷 ' + p.sessions + (p.sessions === 1 ? ' sessione' : ' sessioni');
    },
    showProfile: function() {
      var p = load();
      var topPaese = Object.entries(p.paese).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 3);
      var avgBudget = p.budget.length ? '€' + Math.round(p.budget.reduce(function(a, b) { return a + b; }, 0) / p.budget.length) : '—';
      var overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;';
      overlay.onclick = function() { overlay.remove(); };
      overlay.innerHTML = '<div style="background:#0A0705;border:1px solid rgba(191,155,74,.3);border-radius:14px;padding:24px;max-width:320px;width:90%;pointer-events:auto;" onclick="event.stopPropagation()">' +
        '<div style="font-family:Cinzel,serif;font-size:.7rem;letter-spacing:3px;color:#BF9B4A;margin-bottom:16px;">🍷 IL TUO PROFILO GUSTO</div>' +
        '<div style="font-size:13px;color:rgba(245,239,226,.75);line-height:2;">' +
          '<div>📊 Sessioni: <strong style="color:#F5EFE2">' + p.sessions + '</strong></div>' +
          '<div>💶 Budget medio: <strong style="color:#F5EFE2">' + avgBudget + '</strong></div>' +
          (topPaese.length ? '<div>🌍 Paesi preferiti: <strong style="color:#F5EFE2">' + topPaese.map(function(x) { return x[0]; }).join(', ') + '</strong></div>' : '') +
          '<div>👍 Positivi: <strong style="color:#7dda8a">' + p.feedback.pos + '</strong></div>' +
          '<div>👎 Da migliorare: <strong style="color:#f99">' + p.feedback.neg + '</strong></div>' +
          (p.ultimiVini.length ? '<div style="margin-top:10px;font-size:11px;color:rgba(245,239,226,.4);">Ultimi vini: ' + p.ultimiVini.join(', ') + '</div>' : '') +
        '</div>' +
        '<button onclick="this.closest(\'div[style*=fixed]\').remove()" style="margin-top:16px;width:100%;padding:10px;background:rgba(191,155,74,.15);border:1.5px solid rgba(191,155,74,.32);border-radius:8px;color:#BF9B4A;font-family:Cinzel,serif;font-size:.54rem;letter-spacing:2px;cursor:pointer;">CHIUDI</button>' +
      '</div>';
      document.body.appendChild(overlay);
    }
  };
})();

// ── CHIAMATA API ──
window.callAPI = async function(system, userMsg, language, budget) {
  try {
    var ctrl = new AbortController();
    setTimeout(function() { ctrl.abort(); }, 30000);
    var r = await fetch((window.SRV || 'https://sommelier-server-production-8f92.up.railway.app') + '/api/groq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system: system,
        userMsg: userMsg,
        language: language || (window.getLang ? getLang() : 'it'),
        maxTokens: 1600,
      }),
      signal: ctrl.signal,
    });
    var d = await r.json();
    if (r.ok && d.text) return d.text;
    throw new Error(d.error || 'Errore server');
  } catch(e) {
    if (e.name === 'AbortError') throw new Error('Il server sta impiegando troppo tempo. Riprova tra qualche secondo.');
    throw e;
  }
};

// ── ABBINAMENTO SOMMELIER ──
window.doAbbinamento = async function() {
  var menu = (document.getElementById('menuText') || {}).value || '';
  if (!menu.trim()) { alert('Inserisci il menu per procedere.'); return; }

  var budget  = (document.getElementById('budget')     || {}).value || '50';
  var lang    = (window.getLang ? getLang() : 'it');
  var params  = getWineParams();

  // Registra sessione
  TasteEngine.recordSession({ paese: params.paese, budget: budget });
  var tasteCtx = TasteEngine.buildPromptContext();

  // Comando lingua
  var langCmd = { it: 'RISPONDI ESCLUSIVAMENTE IN ITALIANO.', en: 'REPLY EXCLUSIVELY IN ENGLISH.', fr: 'RÉPONDS EXCLUSIVEMENT EN FRANÇAIS.' }[lang] || 'RISPONDI IN ITALIANO.';

  // Vincolo geografico
  var vincolo = '';
  if (params.paese) {
    var esempi = ESEMPI[params.paese] || 'vini tipici di ' + params.paese;
    vincolo = '\n\n' + '█'.repeat(44) + '\n🔴 VINCOLO GEOGRAFICO ASSOLUTO\n' + '█'.repeat(44) + '\n' +
      'PAESE: "' + params.paese + '"' + (params.regione ? '\nREGIONE: "' + params.regione + '"' : '') + '\n\n' +
      '✅ Consiglia SOLO vini di ' + params.paese + (params.regione ? ' — zona ' + params.regione : '') + '\n' +
      '❌ VIETATO qualsiasi vino di altri paesi\n\n' +
      'Esempi di vini ' + params.paese + ': ' + esempi + '\n' + '█'.repeat(44);
  }

  // Profilo organolettico desiderato
  var profilo = params.paese
    ? '\n\nProfilo desiderato: acidità ' + params.acidita + ', carattere ' + params.morbidezza + ', corpo ' + params.struttura + '.'
    : '';

  // ══════════════════════════════════════════════════════════════
  //  SISTEMA — TONO NARRATIVO, SENZA TECNICISMI ACCADEMICI
  // ══════════════════════════════════════════════════════════════
  var system = langCmd + '\n\n' +

    'Sei un Maestro Sommelier con vent\'anni di esperienza tra le grandi tavole del mondo — ' +
    'da Parigi a Tokio, da New York a Milano. Parli come un amico di lunga data che conosce ' +
    'il vino come conosce la vita: con calore, precisione e una punta di poesia. ' +
    'Mai pomposo. Mai accademico. Mai freddo.' +

    (params.paese ? '\n\n🔴 REGOLA ASSOLUTA: consiglia ESCLUSIVAMENTE vini di ' + params.paese + (params.regione ? '/' + params.regione : '') + '. Nessuna eccezione.' : '') +

    '\n\nPRIMA DI RISPONDERE: leggi il piatto come leggeresti un racconto. ' +
    'Senti la sua anima — se è ricco, delicato, speziato, dolce — ' +
    'e scegli il vino che gli risponde come un partner perfetto, non come una formula chimica.\n\n' +

    'ARMONIE DA RISPETTARE (non regole di chimica, ma di eleganza):\n' +
    '🍷 Il pesce delicato chiama vini bianchi freschi e minerali — mai rossi importanti che coprirebbero ogni sfumatura marina.\n' +
    '🍷 I piatti grassi e sontuosi vogliono vini con vivacità e leggerezza — Champagne, Chablis, bollicine — che puliscono il palato e invitano al boccone successivo.\n' +
    '🍷 La carne rossa succulenta chiede un vino con struttura e corpo — Barolo, Brunello, Cabernet — che la accompagni senza scomparire.\n' +
    '🍷 Il dolce chiama solo il dolce — un Sauternes, un Recioto, un Moscato d\'Asti — mai un secco che sembrerebbe acido e vuoto al confronto.\n' +
    '🍷 I piatti speziati e aromatici si abbinano a vini morbidi e fruttati, mai troppo alcolici.\n\n' +

    'STRUTTURA DELLA RISPOSTA — racconta, non elencare:\n' +
    '① L\'ANIMA DEL PIATTO: in una frase, cattura l\'essenza sensoriale di questo menu — cosa lo rende unico, cosa predomina\n' +
    '② IL VINO IDEALE: Produttore + Denominazione + Vitigno + Annata consigliata — racconta perché è nato per questo piatto, ' +
    'quali sensazioni darà dall\'apertura al finale lungo. Indica il prezzo medio di mercato.\n' +
    '③ LA SCELTA INTELLIGENTE: un\'alternativa sotto i 20€ che rispetta la stessa logica di armonia — perché funziona ugualmente\n' +
    '④ IL RITUALE DEL SERVIZIO: temperatura esatta in gradi, calice ideale, decanter sì o no e perché\n' +
    '⑤ IL SEGRETO DEL SOMMELIER: un aneddoto, una storia o un dettaglio inaspettato che trasforma la cena in un\'esperienza da ricordare\n\n' +

    'TONO: caldo come una buona conversazione a tavola. Preciso come un orologiaio svizzero. ' +
    'Evita il gergo tecnico fine a se stesso. Se conosci già le preferenze dell\'ospite dal profilo, usale naturalmente — ' +
    'senza dirlo esplicitamente, come farebbe un sommelier di fiducia.';

  var userMsg = 'Menu:\n' + menu + '\nBudget massimo: €' + budget + vincolo + profilo + tasteCtx;

  var loadEl = document.getElementById('somLoad');
  var resEl  = document.getElementById('somResult');
  if (loadEl) loadEl.style.display = 'block';
  if (resEl)  resEl.style.display  = 'none';

  try {
    var res = await callAPI(system, userMsg, lang, budget);

    if (loadEl) loadEl.style.display = 'none';
    if (resEl) {
      // Converti markdown basilare in HTML
      var html = res
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');

      resEl.innerHTML = html.split('\n').map(function(line) {
        return line || '<br>';
      }).join('<br>') +
        '<div style="display:flex;align-items:center;gap:10px;margin-top:18px;padding-top:14px;border-top:1px solid rgba(191,155,74,.1);">' +
          '<span style="font-size:10px;color:rgba(245,239,226,.38);font-family:Cinzel,serif;letter-spacing:1px;">IL CONSIGLIO TI HA AIUTATO?</span>' +
          '<button onclick="swFbPos(this)" style="padding:6px 14px;border-radius:20px;border:1px solid rgba(125,218,138,.3);background:rgba(125,218,138,.1);color:#7dda8a;cursor:pointer;font-size:14px;">👍</button>' +
          '<button onclick="swFbNeg(this)" style="padding:6px 14px;border-radius:20px;border:1px solid rgba(255,150,100,.3);background:rgba(255,100,100,.1);color:#f99;cursor:pointer;font-size:14px;">👎</button>' +
        '</div>';

      resEl.style.display = 'block';
      resEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Registra vino nel profilo
      var m = res.match(/\*{0,2}([A-Z][^*\n]{5,50}(?:DOC|DOCG|AOC|Riserva|Superiore|Grand Cru|AVA)[^*\n]{0,30})\*{0,2}/);
      if (m) TasteEngine.recordWine(m[1]);
      TasteEngine.renderBadge();
    }
  } catch(e) {
    if (loadEl) loadEl.style.display = 'none';
    if (resEl) {
      resEl.innerHTML =
        '<p style="color:#f99;line-height:1.8;">⚠ ' + e.message + '</p>' +
        '<p style="margin-top:10px;"><button onclick="doAbbinamento()" style="padding:8px 18px;background:rgba(191,155,74,.18);border:1px solid rgba(191,155,74,.38);border-radius:6px;color:#BF9B4A;font-family:Cinzel,serif;font-size:.54rem;letter-spacing:1px;cursor:pointer;">↻ Riprova</button></p>';
      resEl.style.display = 'block';
    }
  }
};

window.swFbPos = function(btn) {
  TasteEngine.recordFeedback(true);
  if (btn && btn.parentNode) btn.parentNode.innerHTML = '<span style="color:#7dda8a;">✓ Grazie per il feedback!</span>';
};
window.swFbNeg = function(btn) {
  TasteEngine.recordFeedback(false);
  if (btn && btn.parentNode) btn.parentNode.innerHTML = '<span style="color:#BF9B4A;">✓ Terremo conto del tuo parere.</span>';
};

// ── QUICK MENU SUGGERITI ──
var QUICK_MENUS = {
  pesce:       'Antipasto — Carpaccio di gamberi rossi con lime e zenzero\nPrimo — Linguine alle vongole veraci\nSecondo — Branzino al forno con erbe aromatiche\nContorno — Patate al vapore con prezzemolo',
  carne:       'Antipasto — Tagliere di salumi misti con lardo di Colonnata\nPrimo — Tagliatelle al ragù di cinghiale\nSecondo — Costata di Fassona Piemontese al sangue\nContorno — Funghi porcini trifolati',
  vegetariano: 'Antipasto — Burrata con pomodorini ciliegino e basilico\nPrimo — Risotto ai funghi porcini con tartufo\nSecondo — Melanzane alla parmigiana\nFormaggi — Parmigiano Reggiano 36 mesi con mostarda',
  degustazione:'Amuse-bouche — Tartare di tonno con caviale\nPrimo — Tortelli di ricotta e spinaci al burro\nIntermezzo — Granita al limone di Amalfi\nSecondo — Piccione arrosto con salsa al vino\nPre-dessert — Crème brûlée alla vaniglia\nDolce — Tiramisù al caffè espresso',
  formaggi:    'Fresco — Burrata pugliese\nSemi-stagionato — Pecorino toscano\nStagionato — Parmigiano Reggiano 36 mesi\nErborinato — Gorgonzola piccante DOP\nCapra — Chèvre della Loira'
};

window.quickMenu = function(type) {
  var menu = QUICK_MENUS[type];
  if (!menu) return;
  var ta = document.getElementById('menuText');
  if (ta) { ta.value = menu; ta.focus(); }
};

// ── PACCHETTI PRODUTTORI ──
window._selectedPkg = null; // null = nessuno selezionato

var PKG_INFO = {
  basic:   { label: 'BASIC',   prezzo: '€19/mese', emoji: '🍷',  features: '1 vino · Profilo cantina · Contatti' },
  premium: { label: 'PREMIUM', prezzo: '€49/mese', emoji: '⭐',  features: '5 vini · Galleria foto · Link sito' },
  elite:   { label: 'ELITE 👑',prezzo: '€99/mese', emoji: '👑',  features: 'Illimitato · Scheda AI · Badge Elite · Priorità assoluta' },
};

window.selectPkg = function(pkg) {
  window._selectedPkg = pkg;

  /* Feedback visivo sulle card */
  Object.keys(PKG_INFO).forEach(function(p) {
    var el = document.getElementById('pkg_' + p);
    if (!el) return;
    var isSelected = p === pkg;
    el.style.opacity = isSelected ? '1' : '0.52';
    el.style.transform = isSelected ? 'scale(1.02)' : 'scale(1)';
    el.style.borderColor = isSelected
      ? (p === 'elite' ? '#BF9B4A' : 'rgba(191,155,74,.55)')
      : (p === 'elite' ? 'rgba(191,155,74,.55)' : 'rgba(191,155,74,.14)');
    el.style.boxShadow = isSelected ? '0 8px 28px rgba(0,0,0,.55)' : 'none';
  });

  /* Aggiorna badge nel form */
  var badge = document.getElementById('prodFormPkgBadge');
  if (badge) {
    var info = PKG_INFO[pkg];
    badge.textContent = info.emoji + ' ' + info.label + ' — ' + info.prezzo;
  }

  /* Mostra form e scrolla */
  var form = document.getElementById('prodForm');
  if (form) {
    form.style.display = 'block';
    setTimeout(function() {
      form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 80);
  }
};

window.submitProd = async function() {
  var nome    = ((document.getElementById('prodNome')    || {}).value || '').trim();
  var vino    = ((document.getElementById('prodVino')    || {}).value || '').trim();
  var regione = ((document.getElementById('prodRegione') || {}).value || '').trim();
  var email   = ((document.getElementById('prodEmail')   || {}).value || '').trim();
  var st      = document.getElementById('prodStatus');

  /* Validazione */
  if (!nome || !email) {
    if (st) { st.style.color = '#f99'; st.textContent = 'Nome cantina ed email sono obbligatori.'; }
    return;
  }
  if (!email.includes('@')) {
    if (st) { st.style.color = '#f99'; st.textContent = 'Inserisci un indirizzo email valido.'; }
    return;
  }

  var pkg  = window._selectedPkg || 'premium';
  var info = PKG_INFO[pkg];

  if (st) { st.style.color = 'rgba(191,155,74,.5)'; st.textContent = 'Invio in corso…'; }

  var body = {
    name:    nome,
    email:   email,
    package: pkg,
    subject: 'Nuova iscrizione produttore: ' + nome + ' — ' + info.label + ' (' + info.prezzo + ')',
    message: [
      'CANTINA: ' + nome,
      'VINO DI PUNTA: ' + (vino || 'non specificato'),
      'REGIONE: ' + (regione || 'non specificata'),
      'PACCHETTO: ' + info.label + ' ' + info.prezzo,
      'FEATURES: ' + info.features,
      'EMAIL: ' + email,
    ].join('\n'),
  };

  try {
    var r = await fetch(
      (window.SRV || window.SERVER_URL || 'https://sommelier-server-production-8f92.up.railway.app') + '/api/contact',
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    );
    var d = await r.json();
    if (r.ok || d.ok) {
      if (st) {
        st.style.color = '#7dda8a';
        st.textContent = '✓ Richiesta inviata. Ti contatteremo a ' + email + ' entro 24 ore.';
      }
      /* Reset form */
      ['prodNome', 'prodVino', 'prodRegione', 'prodEmail'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.value = '';
      });
      /* Reset selezione visiva dopo 2s */
      setTimeout(function() {
        window._selectedPkg = null;
        Object.keys(PKG_INFO).forEach(function(p) {
          var el = document.getElementById('pkg_' + p);
          if (el) { el.style.opacity='1'; el.style.transform='scale(1)'; el.style.boxShadow='none'; }
        });
      }, 2000);
    } else {
      if (st) { st.style.color = '#f99'; st.textContent = 'Errore nell\'invio. Scrivi a info@sommelierworld.vin'; }
    }
  } catch(e) {
    if (st) { st.style.color = '#f99'; st.textContent = 'Errore di connessione: ' + e.message; }
  }
};
