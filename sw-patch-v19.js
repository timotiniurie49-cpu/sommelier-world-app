/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SOMMELIER WORLD · PATCH v19                                    ║
 * ║                                                                  ║
 * ║  ✓ Fix CRITICO: getWineParams() sovrascritta da funzione rotta ║
 * ║  ✓ Fix CRITICO: updateRegioni() sovrascritta con console.log   ║
 * ║  ✓ Fix: CSS appare come testo nel risultato sommelier           ║
 * ║  ✓ Regioni complete per tutti i paesi                           ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════
     REGIONI COMPLETE PER TUTTI I PAESI
     ═══════════════════════════════════════════════════════ */
  var REGIONI_COMPLETE = {
    'Italia': [
      'Piemonte','Valle d\'Aosta','Liguria','Lombardia','Trentino-Alto Adige',
      'Friuli-Venezia Giulia','Veneto','Emilia-Romagna','Toscana','Marche',
      'Umbria','Lazio','Abruzzo','Molise','Campania','Puglia',
      'Basilicata','Calabria','Sicilia','Sardegna'
    ],
    'Francia': [
      'Borgogna','Bordeaux','Champagne','Rodano','Loira','Alsazia',
      'Languedoc','Roussillon','Provenza','Beaujolais','Jura','Savoia',
      'Périgord','Sud-Ouest','Corsica'
    ],
    'Germania': [
      'Mosel','Rheingau','Pfalz','Rheinhessen','Nahe','Franken',
      'Ahr','Baden','Württemberg','Mittelrhein','Sachsen','Saale-Unstrut',
      'Hessische Bergstraße'
    ],
    'Spagna': [
      'Rioja','Ribera del Duero','Priorat','Rías Baixas','Jerez','Toro',
      'Penedès','Bierzo','Jumilla','Navarra','Rueda','Valdepeñas',
      'Cava (Catalogna)','Yecla','Campo de Borja','Montilla-Moriles',
      'Alicante','Terra Alta','Empordà'
    ],
    'Portogallo': [
      'Douro','Porto','Alentejo','Vinho Verde','Dão','Bairrada',
      'Lisboa','Setúbal','Madeira','Algarve','Colares'
    ],
    'Austria': [
      'Wachau','Kamptal','Kremstal','Traisental','Weinviertel',
      'Neusiedlersee','Mittelburgenland','Südburgenland','Steiermark',
      'Wien (Vienna)'
    ],
    'USA': [
      'Napa Valley (CA)','Sonoma (CA)','Willamette Valley (OR)',
      'Paso Robles (CA)','Santa Barbara (CA)','Columbia Valley (WA)',
      'Walla Walla (WA)','Finger Lakes (NY)','Anderson Valley (CA)',
      'Sta. Rita Hills (CA)','Alexander Valley (CA)'
    ],
    'Argentina': [
      'Mendoza','Luján de Cuyo','Valle de Uco','Salta - Cafayate',
      'Patagonia - Neuquén','Río Negro','San Juan','La Rioja'
    ],
    'Cile': [
      'Maipo','Colchagua','Casablanca','Leyda','Elqui','Limarí',
      'Aconcagua','Valle del Bío-Bío','Valle del Itata','Rapel'
    ],
    'Australia': [
      'Barossa Valley','McLaren Vale','Clare Valley','Eden Valley',
      'Yarra Valley','Mornington Peninsula','Hunter Valley',
      'Margaret River','Coonawarra','Adelaide Hills','Heathcote',
      'Grampians','Tasmania'
    ],
    'Nuova Zelanda': [
      'Marlborough','Central Otago','Hawke\'s Bay','Martinborough',
      'Nelson','Waipara','Gisborne'
    ],
    'Grecia': [
      'Santorini','Naoussa','Nemea','Creta','Monemvasia',
      'Mantinia','Rapsani','Samos','Limnos'
    ],
    'Ungheria': ['Tokaj','Eger','Villány','Szekszárd','Sopron','Balatonfüred'],
    'Georgia': ['Kakheti','Kartli','Imereti','Racha-Lechkhumi'],
    'Sud Africa': [
      'Stellenbosch','Swartland','Franschhoek','Walker Bay',
      'Constantia','Elgin','Hemel-en-Aarde','Robertson','Paarl','Darling'
    ],
  };

  /* ═══════════════════════════════════════════════════════
     FIX 1: updateRegioni — sovrascrive la versione rotta
     (alla fine di index.html c'è una versione che fa solo
     console.log invece di popolare il select)
     ═══════════════════════════════════════════════════════ */
  window.updateRegioni = function () {
    var paese = (document.getElementById('winePaese') || {}).value || '';
    var sel   = document.getElementById('wineRegione');
    if (!sel) return;

    sel.innerHTML = '<option value="">Qualsiasi regione</option>';
    var regioni = REGIONI_COMPLETE[paese] || [];

    regioni.forEach(function (r) {
      var opt = document.createElement('option');
      opt.value = r;
      opt.textContent = r;
      sel.appendChild(opt);
    });

    sel.disabled = !paese;
    console.log('[SW-v19] Regioni caricate per', paese, '→', regioni.length, 'regioni');
  };


  /* ═══════════════════════════════════════════════════════
     FIX 2: getWineParams — sovrascrive la versione rotta
     (alla fine di index.html c'è una versione che restituisce
     solo { food: ... } invece di tutti i parametri)
     ═══════════════════════════════════════════════════════ */
  window.getWineParams = function () {
    var aciditaLabels    = ['Bassa','Medio-bassa','Media','Medio-alta','Alta'];
    var morbidezzaLabels = ['Secco-tannico','Poco morbido','Equilibrato','Morbido','Molto morbido'];
    var sapidLabels      = ['Bassa','Poco sapido','Sapido','Molto sapido','Minerale-salino'];
    var strutturaLabels  = ['Leggero','Medio-leggero','Medio','Medio-pieno','Pieno e concentrato'];

    function getLabel(id, labels) {
      var el = document.getElementById(id);
      return el ? labels[parseInt(el.value) - 1] : labels[2];
    }

    var paese   = (document.getElementById('winePaese')   || {}).value || '';
    var regione = (document.getElementById('wineRegione') || {}).value || '';

    return {
      acidita:    getLabel('acidita',    aciditaLabels),
      morbidezza: getLabel('morbidezza', morbidezzaLabels),
      sapidita:   getLabel('sapidita',   sapidLabels),
      struttura:  getLabel('struttura',  strutturaLabels),
      paese:   paese,
      regione: regione,
    };
  };


  /* ═══════════════════════════════════════════════════════
     FIX 3: renderSomResult — il CSS finisce nel testo
     Il bug: il regex wineMatch viene applicato su testo già
     convertito in HTML, e matcha parti del CSS inline
     (es. "Cinzel,serif;font-size:.88em...")
     Soluzione: strip HTML prima di cercare il match,
     poi sostituiamo nel testo originale
     ═══════════════════════════════════════════════════════ */
  window.renderSomResult = function (rawText) {
    if (!rawText) return '';

    /* ── Pulizia markdown base ── */
    var text = rawText
      .replace(/#{1,6}\s*/g, '')
      .replace(/---+/g, '<hr style="border:none;border-top:1px solid rgba(191,155,74,.15);margin:16px 0;">')
      .trim();

    var wrap = document.createElement('div');
    wrap.style.cssText = 'font-family:\'Cormorant Garamond\',Georgia,serif;';

    /* Separa i blocchi (paragrafo per piatto + segreto finale) */
    var blocks = text.split(/\n\s*\n/).filter(function(b) { return b.trim(); });

    blocks.forEach(function(block, i) {
      block = block.trim();
      if (!block) return;

      var isSecret = /il segreto del sommelier|segreto:/i.test(block);

      /* ── Box Segreto del Sommelier ── */
      if (isSecret) {
        var d = document.createElement('div');
        d.style.cssText = 'margin-top:22px;padding:16px 18px;background:rgba(191,155,74,.08);border-top:2px solid rgba(191,155,74,.25);border-bottom:2px solid rgba(191,155,74,.25);';
        var lbl = document.createElement('div');
        lbl.style.cssText = 'font-family:Cinzel,serif;font-size:.58rem;letter-spacing:.25em;color:var(--oro);margin-bottom:10px;';
        lbl.textContent = '✦ IL SEGRETO DEL SOMMELIER';
        var txt = document.createElement('div');
        txt.style.cssText = 'font-family:\'IM Fell English\',serif;font-style:italic;font-size:1.08rem;line-height:1.9;color:rgba(245,239,226,.85);';
        txt.textContent = block
          .replace(/il segreto del sommelier:?\s*/i, '')
          .replace(/segreto:?\s*/i, '')
          .replace(/\*\*/g, '')
          .replace(/\*/g, '')
          .trim();
        d.appendChild(lbl);
        d.appendChild(txt);
        wrap.appendChild(d);
        return;
      }

      /* ── Card vino normale ── */
      var card = document.createElement('div');
      card.style.cssText = 'padding:16px 0;border-bottom:1px solid rgba(191,155,74,.1);';
      if (i === 0) card.style.paddingTop = '4px';

      var lines = block.split('\n').filter(function(l) { return l.trim(); });

      /* ── Prima riga: nome piatto ── */
      var dishLine = '';
      var bodyLines = lines;
      if (lines.length > 1) {
        var first = lines[0];
        var isShort = first.length < 80;
        var isIntro = /^per |^col |^con |^al |^alla |^agli |^\*\*|^📍|^🍽|^➤|^→/i.test(first);
        if (isShort || isIntro) {
          dishLine = first;
          bodyLines = lines.slice(1);
        }
      }

      if (dishLine) {
        var dh = document.createElement('div');
        dh.style.cssText = 'font-family:Cinzel,serif;font-size:.7rem;letter-spacing:.15em;color:var(--oro);margin-bottom:10px;padding-bottom:7px;border-bottom:1px solid rgba(191,155,74,.12);';
        /* Rimuovi markdown dal titolo piatto */
        dh.textContent = dishLine
          .replace(/\*\*/g, '')
          .replace(/\*/g, '')
          .replace(/^[-•*→➤]+\s*/, '')
          .replace(/:$/, '')
          .trim()
          .toUpperCase();
        card.appendChild(dh);
      }

      /* ── Corpo del paragrafo ── */
      var body = document.createElement('div');
      body.style.cssText = 'font-size:1.02rem;line-height:1.9;color:rgba(245,239,226,.88);';

      /* Unisci le righe in un unico testo */
      var fullText = bodyLines.join(' ').trim();

      /* ── FIX: applica la formattazione markdown DOPO aver trovato i match ── */
      /* Prima cerca il vino nel testo PULITO (senza tag HTML) */
      var cleanText = fullText.replace(/\*\*/g, '').replace(/\*/g, '');

      /* Cerca il nome del vino con produttore (pattern: Parola Maiuscola anno o "Produttore — Denominazione") */
      var wineMatch = cleanText.match(
        /([A-Z][a-zA-Zàèéìòùâêîôûäëïöü][\w\s\-\'àèéìòùâêîôûäëïöü]{4,40}(?:\s+\d{4})?)/
      );

      /* Ora applica la formattazione markdown al testo pulito */
      var formattedText = cleanText
        .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong style="color:var(--crema);">$1</strong>')
        .replace(/\*([^*]+)\*/g,     '<em>$1</em>');

      /* Evidenzia il vino trovato (nel testo già formattato) */
      if (wineMatch && wineMatch[0].length > 5) {
        var wineSpan = '<span style="font-family:Cinzel,serif;font-size:.92rem;font-weight:600;color:#F5EFE2;">' +
          wineMatch[0].replace(/[<>]/g, '') + '</span>';
        /* Sostituisce solo la prima occorrenza del match nel testo */
        formattedText = formattedText.replace(wineMatch[0], wineSpan);
      }

      /* Gestisci liste puntate */
      formattedText = formattedText
        .replace(/^[-•]\s+(.+)/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/gs,
          '<ul style="margin:6px 0 10px;padding-left:18px;color:rgba(245,239,226,.82);line-height:1.8;list-style:disc;">$1</ul>');

      body.innerHTML = formattedText;
      card.appendChild(body);
      wrap.appendChild(card);
    });

    return wrap.innerHTML ||
      '<div style="color:rgba(245,239,226,.7);font-size:1rem;line-height:1.9;">' + rawText + '</div>';
  };


  /* ═══════════════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════════════ */
  function init() {
    console.log('[SW-v19] Fix getWineParams + updateRegioni + renderSomResult ✓');

    /* Assicura che il select regione sia disabilitato all\'inizio */
    var regEl = document.getElementById('wineRegione');
    if (regEl && !document.getElementById('winePaese').value) {
      regEl.disabled = true;
    }

    /* Ricollegare il change event al select paese con la funzione corretta */
    var paeseEl = document.getElementById('winePaese');
    if (paeseEl) {
      /* Rimuovi e ricrea il listener */
      paeseEl.removeAttribute('onchange');
      paeseEl.addEventListener('change', function () {
        window.updateRegioni();
      });
    }
  }

  /* Aspetta che il DOM sia pronto */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    /* Esegui subito, ma anche dopo che tutti gli altri script sono caricati */
    init();
    /* Seconda esecuzione dopo 500ms per sovrascrivere i conflitti */
    setTimeout(init, 500);
  }

})();
