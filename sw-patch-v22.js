/**
 * SOMMELIER WORLD · PATCH v22 — FIX DEFINITIVO
 *
 * Risolve tutti i problemi visibili nel video:
 * ✓ Rimuove articoli vecchi in basso
 * ✓ Carosello Magazine con articoli AI aggiornati + click → reader
 * ✓ Un solo bottone Contatti (rimuove il FAB ✉ duplicato)
 * ✓ Tab Contatti nel nav apre pagina intera
 * ✓ Produttori Elite appaiono nel carosello
 * ✓ Articoli dal server aggiornati ogni giorno
 */
(function () {
  'use strict';

  var SERVER = 'https://sommelier-server-production-8f92.up.railway.app';

  /* ─── Lingua corrente ─── */
  function getLang() {
    return (window.i18n && window.i18n.current) || localStorage.getItem('sw_lang') || 'it';
  }
  function tf(art, field) {
    var l = getLang();
    return art[field + '_' + l] || art[field + '_it'] || art[field] || '';
  }

  /* ══════════════════════════════════════════════════════
     1. KILL VECCHI ELEMENTI DUPLICATI
     ══════════════════════════════════════════════════════ */
  function killOldStuff() {
    /* Rimuove bottone FAB ✉ (ora c'è tab nel nav) */
    function removeFAB() {
      document.querySelectorAll('#sw11-fab-contact, #sw16-fab-contact, [id*="fab-contact"]')
        .forEach(function(el) { el.remove(); });
    }
    removeFAB();

    /* Disabilita il MutationObserver di v16 che ricrea il FAB
       sovrascrivendo fixContactButton con no-op */
    window.fixContactButton = function() {};
    if (window.SW16) window.SW16.open = function() { SW22.openContact(); };

    /* Nasconde vecchi articoli iniettati da sw12 */
    ['#sw12-blog', '#sw20-magazine', '#sw20-magazine-wrapper', '#sw21-magazine'].forEach(function(sel) {
      var el = document.querySelector(sel);
      if (el) el.style.display = 'none';
    });

    /* Impedisce a v20 di creare il suo carosello */
    if (window.SW20) {
      window.SW20.refresh = function() {};
    }

    /* Ricontrolla dopo che altri script possono aver ricreato il FAB */
    setTimeout(removeFAB, 800);
    setTimeout(removeFAB, 2000);
    setTimeout(removeFAB, 4000);

    console.log('[v22] Pulizia elementi duplicati ✓');
  }


  /* ══════════════════════════════════════════════════════
     2. TAB CONTATTI NEL NAV
     ══════════════════════════════════════════════════════ */
  function addContactTab() {
    if (document.querySelector('[data-page="contact"]')) return;
    var prodTab = document.querySelector('[data-page="producers"]');
    if (!prodTab) return;

    var tab = document.createElement('div');
    tab.className = 'ntab';
    tab.dataset.page = 'contact';
    tab.innerHTML = '<span class="ico">✉️</span><span class="lbl">Contatti</span>';
    tab.addEventListener('click', function() {
      document.querySelectorAll('.ntab').forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      openContactPage();
    });
    prodTab.insertAdjacentElement('afterend', tab);
    console.log('[v22] Tab Contatti nel nav ✓');
  }


  /* ══════════════════════════════════════════════════════
     3. PAGINA CONTATTI
     ══════════════════════════════════════════════════════ */
  function openContactPage() {
    var p = document.getElementById('v22-contact');
    if (p) { p.style.display = 'block'; document.body.style.overflow = 'hidden'; resetForm(); return; }

    p = document.createElement('div');
    p.id = 'v22-contact';
    p.style.cssText = 'display:block;position:fixed;inset:0;z-index:999900;background:#0A0705;overflow-y:auto;-webkit-overflow-scrolling:touch;';

    p.innerHTML = nav22('CONTATTI', 'SW22.closeContact()') +
      '<div style="max-width:540px;margin:0 auto;padding:28px 20px 80px;box-sizing:border-box;">' +
        '<div style="text-align:center;margin-bottom:28px;">' +
          '<div style="font-size:9px;font-weight:700;letter-spacing:3px;color:rgba(212,175,55,.5);text-transform:uppercase;margin-bottom:8px;">✉️ SCRIVICI</div>' +
          '<h2 style="font-family:\'Playfair Display\',Georgia,serif;font-size:1.5rem;font-weight:700;color:#F5EFE2;margin:0 0 8px;">Come possiamo aiutarti?</h2>' +
          '<p style="font-size:13px;color:rgba(245,239,226,.4);line-height:1.7;margin:0;">Produttori, collaborazioni, segnalazioni.<br>Risponderemo entro 48 ore.</p>' +
        '</div>' +
        '<div id="v22-ok" style="display:none;text-align:center;padding:24px;background:rgba(125,218,138,.08);border:1px solid rgba(125,218,138,.2);border-radius:10px;margin-bottom:20px;">' +
          '<div style="font-size:2rem;">✓</div>' +
          '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:1rem;color:#7dda8a;margin-top:8px;">Messaggio inviato!</div>' +
          '<div style="font-size:13px;color:rgba(245,239,226,.4);margin-top:6px;">Ti risponderemo entro 48 ore.</div>' +
        '</div>' +
        '<div id="v22-form">' +
          inp22('v22-name', 'text', 'NOME *', 'Il tuo nome', 'name') +
          inp22('v22-email', 'email', 'EMAIL *', 'tua@email.com', 'email') +
          '<div style="margin-bottom:16px;"><label style="' + lbl22() + '">ARGOMENTO</label>' +
          '<select id="v22-subj" style="' + field22() + 'cursor:pointer;">' +
            '<option value="">— Seleziona —</option>' +
            '<option>🏭 Sono un produttore / cantina</option>' +
            '<option>👑 Piano Premium / Elite</option>' +
            '<option>🥂 Collaborazione sommelier</option>' +
            '<option>🛠 Segnalazione errore</option>' +
            '<option>🤝 Partnership</option>' +
            '<option>💬 Altro</option>' +
          '</select></div>' +
          '<div style="margin-bottom:16px;"><label style="' + lbl22() + '">MESSAGGIO *</label>' +
          '<textarea id="v22-msg" placeholder="Scrivi qui..." style="' + field22() + 'height:110px;resize:none;"></textarea></div>' +
          '<button onclick="SW22.send()" style="width:100%;padding:14px;background:rgba(212,175,55,.18);border:1.5px solid rgba(212,175,55,.45);border-radius:8px;color:#D4AF37;font-family:Cinzel,serif;font-size:.6rem;font-weight:700;letter-spacing:3px;cursor:pointer;">✦ INVIA MESSAGGIO ✦</button>' +
          '<div id="v22-err" style="display:none;margin-top:10px;padding:10px;background:rgba(220,50,50,.15);border:1px solid rgba(220,50,50,.3);border-radius:6px;font-size:12px;color:rgba(255,150,150,.9);text-align:center;"></div>' +
        '</div>' +
        '<div style="text-align:center;margin-top:28px;padding-top:20px;border-top:1px solid rgba(212,175,55,.1);">' +
          '<div style="font-size:12px;color:rgba(245,239,226,.3);margin-bottom:6px;">Oppure scrivi a</div>' +
          '<a href="mailto:info@sommelierworld.vin" style="color:rgba(212,175,55,.6);font-size:13px;text-decoration:none;">info@sommelierworld.vin</a>' +
        '</div>' +
      '</div>';

    document.body.appendChild(p);
    document.body.style.overflow = 'hidden';
  }

  function lbl22() { return 'display:block;font-size:9px;font-weight:700;letter-spacing:2px;color:rgba(212,175,55,.55);text-transform:uppercase;margin-bottom:5px;'; }
  function field22() { return 'width:100%;box-sizing:border-box;padding:11px 13px;background:rgba(255,255,255,.05);border:1px solid rgba(212,175,55,.2);border-radius:8px;color:#F5EFE2;font-family:Lato,sans-serif;font-size:15px;outline:none;display:block;'; }
  function inp22(id, type, label, ph, ac) {
    return '<div style="margin-bottom:16px;"><label style="' + lbl22() + '">' + label + '</label>' +
      '<input id="' + id + '" type="' + type + '" placeholder="' + ph + '"' + (ac ? ' autocomplete="' + ac + '"' : '') + ' style="' + field22() + '"></div>';
  }
  function nav22(title, closeCall) {
    return '<div style="position:sticky;top:0;z-index:2;background:rgba(10,7,5,.97);backdrop-filter:blur(12px);border-bottom:1px solid rgba(212,175,55,.15);display:flex;align-items:center;gap:12px;padding:13px 16px;">' +
      '<button onclick="' + closeCall + '" style="width:36px;height:36px;border-radius:50%;background:rgba(212,175,55,.1);border:1px solid rgba(212,175,55,.2);color:#D4AF37;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;">←</button>' +
      '<div style="font-family:Cinzel,serif;font-size:.65rem;letter-spacing:3px;color:#F5EFE2;">' + title + '</div>' +
    '</div>';
  }

  function closeContactPage() {
    var p = document.getElementById('v22-contact');
    if (p) p.style.display = 'none';
    document.body.style.overflow = '';
    document.querySelectorAll('.ntab').forEach(function(t) { t.classList.remove('active'); });
    var homeTab = document.querySelector('[data-page="home"]');
    if (homeTab) homeTab.classList.add('active');
  }

  function resetForm() {
    ['v22-name','v22-email','v22-subj','v22-msg'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
    var ok  = document.getElementById('v22-ok');
    var frm = document.getElementById('v22-form');
    var err = document.getElementById('v22-err');
    if (ok)  ok.style.display  = 'none';
    if (frm) frm.style.display = 'block';
    if (err) err.style.display = 'none';
  }

  async function sendContact() {
    var name  = (document.getElementById('v22-name')?.value  || '').trim();
    var email = (document.getElementById('v22-email')?.value || '').trim();
    var subj  = (document.getElementById('v22-subj')?.value  || '').trim();
    var msg   = (document.getElementById('v22-msg')?.value   || '').trim();
    var err   = document.getElementById('v22-err');

    function showErr(t) { if (err) { err.textContent = t; err.style.display = 'block'; } }

    if (!name)                    return showErr('Inserisci il tuo nome.');
    if (!email || !email.includes('@')) return showErr('Email non valida.');
    if (msg.length < 4)           return showErr('Messaggio troppo corto.');

    if (err) err.style.display = 'none';

    var ok = false;
    try {
      var ctrl = new AbortController();
      setTimeout(function() { ctrl.abort(); }, 8000);
      var r = await fetch(SERVER + '/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, email: email, subject: subj, message: msg }),
        signal: ctrl.signal,
      });
      if (r.ok) { var d = await r.json(); ok = !!d.ok; }
    } catch(e) {}

    if (!ok) {
      /* Fallback mailto */
      window.location.href = 'mailto:info@sommelierworld.vin?subject=' +
        encodeURIComponent('[SW] ' + (subj || 'Messaggio da ' + name)) +
        '&body=' + encodeURIComponent('Da: ' + name + '\nEmail: ' + email + '\n\n' + msg);
    }

    var frm = document.getElementById('v22-form');
    var okEl = document.getElementById('v22-ok');
    if (frm) frm.style.display = 'none';
    if (okEl) okEl.style.display = 'block';
  }


  /* ══════════════════════════════════════════════════════
     4. MAGAZINE CAROSELLO — articoli dal server + locali
     ══════════════════════════════════════════════════════ */

  var IMGS = [
    'https://images.pexels.com/photos/4113579/pexels-photo-4113579.jpeg?auto=compress&w=800',
    'https://images.pexels.com/photos/3532658/pexels-photo-3532658.jpeg?auto=compress&w=800',
    'https://images.pexels.com/photos/3850838/pexels-photo-3850838.jpeg?auto=compress&w=800',
    'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&w=800',
    'https://images.pexels.com/photos/2664149/pexels-photo-2664149.jpeg?auto=compress&w=800',
    'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&w=800',
    'https://images.pexels.com/photos/2702805/pexels-photo-2702805.jpeg?auto=compress&w=800',
    'https://images.pexels.com/photos/2425434/pexels-photo-2425434.jpeg?auto=compress&w=800',
  ];

  var LOCAL_ARTS = [
    { id:'loc1', titolo_it:'Barolo 2016: la Vendemmia del Secolo', titolo_en:'Barolo 2016: Vintage of the Century', titolo_fr:'Barolo 2016 : Millésime du Siècle', categoria_it:'🍷 Annate', categoria_en:'🍷 Vintages', categoria_fr:'🍷 Millésimes', testo_it:'Il 2016 è l\'annata più grande delle Langhe degli ultimi trent\'anni. Estate perfetta, escursioni termiche straordinarie, acidità cristallina.\n\nMonfortino di Giacomo Conterno, Rocche dell\'Annunziata di Paolo Scavino, Cerretta di Elio Grasso: capolavori destinati a durare cinquant\'anni.\n\nSe lo trovi a prezzo ragionevole, compralo senza esitare.', testo_en:'The 2016 vintage is the greatest in the Langhe for thirty years. These wines will last fifty years.', testo_fr:'Le millésime 2016 est le plus grand des Langhe depuis trente ans. Ces vins dureront cinquante ans.', immagine:IMGS[0], autore:'Timotin', data:'Aprile 2026' },
    { id:'loc2', titolo_it:'Come Leggere un\'Etichetta del Vino', titolo_en:'How to Read a Wine Label', titolo_fr:'Comment Lire une Étiquette', categoria_it:'📚 Tecnica', categoria_en:'📚 Technique', categoria_fr:'📚 Technique', testo_it:'DOC, DOCG, IGT, AOC: capire la classificazione permette di scegliere in secondi.\n\nLa regola d\'oro: il nome del produttore prima della denominazione. Un grande produttore in una zona minore batte un mediocre in una zona famosa.\n\nL\'annata è il secondo elemento: cambia radicalmente il carattere del vino ogni anno.', testo_en:'Understanding classification lets you choose correctly in seconds. Always look at the producer\'s name first.', testo_fr:'Comprendre la classification vous permet de choisir en quelques secondes.', immagine:IMGS[1], autore:'Timotin', data:'Aprile 2026' },
    { id:'loc3', titolo_it:'Etna: il Vulcano che ha Cambiato il Vino Italiano', titolo_en:'Etna: The Volcano that Changed Italian Wine', titolo_fr:'L\'Etna : le Volcan qui a Changé le Vin Italien', categoria_it:'🌍 Terroir', categoria_en:'🌍 Terroir', categoria_fr:'🌍 Terroir', testo_it:'In pochi anni l\'Etna è diventato il terroir più discusso del vino mondiale. Le 133 contrade identificano vigneti centenari ad alberello su sabbie laviche tra 400 e 1000 metri.\n\nNerello Mascalese: rossi trasparenti e profumati vicini al Pinot Nero di Vosne-Romanée. Cornelissen, Terre Nere, Benanti, Passopisciaro.\n\nChi compra Etna oggi compra il futuro del vino italiano.', testo_en:'Etna has become the world\'s most talked-about wine terroir. Its 133 contrade identify century-old alberello vines.', testo_fr:'L\'Etna est devenu le terroir le plus discuté du monde du vin.', immagine:IMGS[2], autore:'Timotin', data:'Marzo 2026' },
    { id:'loc4', titolo_it:'Champagne: Come Scegliere la Bottiglia Giusta', titolo_en:'Champagne: How to Choose the Right Bottle', titolo_fr:'Champagne : Comment Choisir la Bonne Bouteille', categoria_it:'✨ Guide', categoria_en:'✨ Guides', categoria_fr:'✨ Guides', testo_it:'Tra 300 produttori e migliaia di etichette orientarsi sembra impossibile. La chiave: capire tipologia (NV, Vintage, Prestige), dosaggio (Brut Nature → Demi-Sec) e categoria produttore (RM vs NM).\n\nI Récoltant Manipulant producono solo con proprie uve: Selosse, Chartogne-Taillet, Bérêche. I Négociant grandi case comprano da altri: Krug, Bollinger, Roederer.\n\nRegola d\'oro: un buon NV da piccolo produttore batte spesso un grande marchio alla stessa fascia di prezzo.', testo_en:'Among 300 producers, the key is understanding type, dosage, and producer category.', testo_fr:'Parmi 300 producteurs, la clé est de comprendre le type, le dosage et la catégorie de producteur.', immagine:IMGS[3], autore:'Timotin', data:'Marzo 2026' },
    { id:'loc5', titolo_it:'Abbinamento Vino e Formaggio: 10 Combinazioni Perfette', titolo_en:'Wine & Cheese: 10 Perfect Pairings', titolo_fr:'Vin et Fromage : 10 Accords Parfaits', categoria_it:'🍽 Abbinamenti', categoria_en:'🍽 Pairings', categoria_fr:'🍽 Accords', testo_it:'La regola base: formaggi freschi con bianchi leggeri e acidi; stagionati con rossi strutturati; erborinati con vini dolci.\n\nDieci da conoscere: Parmigiano + Lambrusco, Pecorino + Vermentino, Gorgonzola + Sauternes, Brie + Blanc de Blancs, Comté + Vin Jaune, Manchego + Rioja, Stilton + Porto Vintage, Mozzarella + Fiano, Taleggio + Barbaresco, Roquefort + Banyuls.\n\nPartenza sicura: sempre Champagne brut con qualsiasi formaggio — non sbaglia mai.', testo_en:'The golden rule: fresh cheeses with light whites; aged with structured reds; blue with sweet wines.', testo_fr:'La règle d\'or : fromages frais avec blancs légers ; affinés avec rouges structurés ; bleus avec vins doux.', immagine:IMGS[4], autore:'Timotin', data:'Febbraio 2026' },
  ];

  var _arts = [];
  var _readerOpen = false;

  async function loadArticles() {
    /* Prima mostra quelli locali */
    _arts = getEliteArts().concat(LOCAL_ARTS);
    renderCarousel();

    /* Poi carica dal server */
    try {
      var ctrl = new AbortController();
      setTimeout(function() { ctrl.abort(); }, 6000);
      var r = await fetch(SERVER + '/api/articles', { signal: ctrl.signal });
      if (r.ok) {
        var data = await r.json();
        if (data && data.length) {
          /* Assegna immagine fallback */
          data.forEach(function(a, i) {
            if (!a.immagine || a.immagine.includes('placeholder') || a.immagine.includes('via.placeholder')) {
              a.immagine = IMGS[i % IMGS.length];
            }
          });
          _arts = getEliteArts().concat(data);
          renderCarousel();
          console.log('[v22] ' + data.length + ' articoli dal server');
        }
      }
    } catch(e) {
      console.log('[v22] Articoli locali (server non raggiungibile)');
    }
  }

  /* Produttori Elite dal localStorage */
  function getEliteArts() {
    try {
      var prods = JSON.parse(localStorage.getItem('sw_elite_producers') || '[]');
      return prods.filter(function(p) { return p.nome && p.descrizione; }).map(function(p) {
        return {
          id: 'elite-' + (p.id || p.nome),
          isElite: true,
          titolo_it: 'Cantina in Evidenza: ' + p.nome,
          titolo_en: 'Featured Winery: ' + p.nome,
          titolo_fr: 'Domaine en Vedette : ' + p.nome,
          categoria_it: '👑 Elite', categoria_en: '👑 Elite', categoria_fr: '👑 Elite',
          testo_it: p.descrizione || '',
          immagine: p.immagine || IMGS[0],
          autore: p.nome, data: p.data || '',
          producer: p,
        };
      });
    } catch(e) { return []; }
  }

  /* ─── Render carosello ─── */
  function renderCarousel() {
    var c = document.getElementById('v22-carousel');
    if (!c) return;
    c.innerHTML = '';

    var cnt = document.getElementById('v22-count');
    if (cnt) cnt.textContent = _arts.length + ' articoli';

    _arts.forEach(function(art, i) {
      var img = art.immagine || IMGS[i % IMGS.length];
      var cat = tf(art, 'categoria');
      var tit = tf(art, 'titolo');
      var isElite = art.isElite;
      var isNews  = art.isNews;
      var isAI    = art.generato_ai;

      var card = document.createElement('div');
      card.style.cssText = [
        'flex:0 0 255px;min-width:255px;scroll-snap-align:start;',
        'border-radius:10px;overflow:hidden;cursor:pointer;',
        'background:rgba(255,255,255,.04);transition:transform .2s,border-color .2s;',
        'border:1.5px solid ' + (isElite ? 'rgba(212,175,55,.5)' : isNews ? 'rgba(100,180,255,.25)' : 'rgba(212,175,55,.12)') + ';',
      ].join('');

      card.innerHTML = [
        isElite ? '<div style="background:rgba(212,175,55,.85);color:#0A0705;font-family:Cinzel,serif;font-size:7px;font-weight:700;letter-spacing:2px;padding:3px 10px;text-align:center;">👑 PRODUTTORE ELITE</div>' : '',
        isNews  ? '<div style="background:rgba(100,180,255,.2);color:rgba(180,220,255,.9);font-family:Cinzel,serif;font-size:7px;font-weight:700;letter-spacing:2px;padding:3px 10px;text-align:center;">🗞 NOTIZIA DEL GIORNO</div>' : '',
        '<img src="' + img + '" style="width:100%;height:140px;object-fit:cover;display:block;background:#1A0A06;" loading="lazy" alt="" onerror="this.src=\'' + IMGS[(i+1)%IMGS.length] + '\'">',
        '<div style="padding:11px 12px 13px;">',
          '<div style="font-size:9px;font-weight:700;letter-spacing:1.5px;color:rgba(212,175,55,.55);text-transform:uppercase;margin-bottom:4px;">' + (cat || '') + '</div>',
          '<div style="font-family:\'Playfair Display\',\'IM Fell English\',Georgia,serif;font-size:.88rem;font-weight:700;color:#F5EFE2;line-height:1.3;margin-bottom:7px;">' + (tit || '') + '</div>',
          '<div style="font-size:10px;color:rgba(245,239,226,.3);display:flex;align-items:center;justify-content:space-between;gap:6px;">',
            '<span>' + (art.data || '') + (art.autore ? ' · ' + art.autore : '') + '</span>',
            isAI ? '<span style="font-size:8px;background:rgba(125,218,138,.15);color:rgba(125,218,138,.7);padding:2px 5px;border-radius:3px;white-space:nowrap;">✦ AI</span>' : '',
          '</div>',
        '</div>',
      ].join('');

      card.addEventListener('mouseenter', function() { this.style.transform = 'translateY(-2px)'; this.style.borderColor = 'rgba(212,175,55,.4)'; });
      card.addEventListener('mouseleave', function() { this.style.transform = ''; this.style.borderColor = isElite ? 'rgba(212,175,55,.5)' : isNews ? 'rgba(100,180,255,.25)' : 'rgba(212,175,55,.12)'; });
      card.addEventListener('click', function() { openReader(art, i); });
      c.appendChild(card);
    });
  }


  /* ─── Sezione magazine nella home ─── */
  function injectMagazine() {
    if (document.getElementById('v22-magazine')) return;

    var sec = document.createElement('div');
    sec.id = 'v22-magazine';
    sec.innerHTML = [
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:18px 14px 12px;">',
        '<div style="font-family:Cinzel,serif;font-size:.6rem;letter-spacing:3px;color:rgba(212,175,55,.6);text-transform:uppercase;">✍️ Magazine</div>',
        '<div id="v22-count" style="font-size:11px;color:rgba(245,239,226,.3);">…</div>',
      '</div>',
      '<div id="v22-carousel" style="display:flex;gap:12px;overflow-x:auto;overflow-y:hidden;padding:0 14px 14px;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;">',
        '<style>#v22-carousel::-webkit-scrollbar{display:none}</style>',
      '</div>',
    ].join('');

    /* Inserisce dopo newsletter, o in fondo alla home */
    var homeBody = document.querySelector('#page-home .home-body') || document.querySelector('.home-body');
    if (!homeBody) return;

    var nl = homeBody.querySelector('#sw13-newsletter');
    if (nl) nl.insertAdjacentElement('afterend', sec);
    else    homeBody.appendChild(sec);

    console.log('[v22] Sezione Magazine iniettata ✓');
  }


  /* ══════════════════════════════════════════════════════
     5. ARTICLE READER
     ══════════════════════════════════════════════════════ */
  function openReader(art, idx) {
    var img  = art.immagine || IMGS[(idx||0) % IMGS.length];
    var cat  = tf(art, 'categoria');
    var tit  = tf(art, 'titolo');
    var txt  = tf(art, 'testo');

    var paras = (txt || '').split(/\n\n+/).filter(function(p) { return p.trim(); })
      .map(function(p) { return '<p style="margin:0 0 22px;">' + p.trim() + '</p>'; }).join('');

    var r = document.getElementById('v22-reader');
    if (!r) {
      r = document.createElement('div');
      r.id = 'v22-reader';
      r.style.cssText = 'display:none;position:fixed;inset:0;z-index:999950;background:#0A0705;overflow-y:auto;-webkit-overflow-scrolling:touch;';
      document.body.appendChild(r);
    }

    r.innerHTML = [
      nav22(cat || 'Articolo', 'SW22.closeReader()'),
      '<div style="max-width:720px;margin:0 auto;padding-bottom:80px;">',
        '<img src="' + img + '" style="width:100%;height:240px;object-fit:cover;display:block;background:#1A0A06;" alt="" onerror="this.style.display=\'none\'">',
        '<div style="padding:26px 20px 0;">',
          '<div style="font-size:9px;font-weight:700;letter-spacing:3px;color:rgba(212,175,55,.5);text-transform:uppercase;margin-bottom:10px;">' + (cat || '') + '</div>',
          '<h1 style="font-family:\'Playfair Display\',Georgia,serif;font-size:1.6rem;font-weight:700;line-height:1.25;color:#F5EFE2;margin:0 0 14px;">' + (tit || '') + '</h1>',
          '<div style="font-size:11px;color:rgba(245,239,226,.35);margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid rgba(212,175,55,.1);display:flex;align-items:center;gap:8px;flex-wrap:wrap;">',
            (art.data ? '<span>' + art.data + '</span>' : ''),
            (art.autore ? '<span>·</span><span>' + art.autore + '</span>' : ''),
            (art.generato_ai ? '<span style="background:rgba(125,218,138,.12);color:rgba(125,218,138,.7);font-size:9px;padding:2px 7px;border-radius:3px;">✦ AI</span>' : ''),
            (art.fonte ? '<span>· Fonte: ' + art.fonte + '</span>' : ''),
          '</div>',
          '<div style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:1.08rem;line-height:2;color:rgba(245,239,226,.85);">' +
            (paras || '<p style="color:rgba(245,239,226,.4);">Contenuto non disponibile.</p>') +
          '</div>',
          /* Scheda produttore Elite */
          art.isElite && art.producer ? eliteCard(art.producer) : '',
        '</div>',
      '</div>',
    ].join('');

    r.style.display = 'block';
    r.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    _readerOpen = true;
    try { history.pushState({ v22reader: true }, ''); } catch(e) {}
  }

  function eliteCard(p) {
    return '<div style="margin:28px 0 0;padding:20px;background:linear-gradient(135deg,rgba(74,4,4,.3),rgba(10,7,5,.9));border:1px solid rgba(212,175,55,.35);border-radius:10px;">' +
      '<div style="display:inline-block;background:rgba(212,175,55,.15);border:1px solid rgba(212,175,55,.3);color:#D4AF37;font-size:8px;font-weight:700;letter-spacing:2px;padding:3px 8px;border-radius:3px;margin-bottom:10px;">👑 PRODUTTORE ELITE</div>' +
      '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:1.1rem;font-weight:700;color:#F5EFE2;margin-bottom:4px;">' + (p.nome || '') + '</div>' +
      '<div style="font-size:11px;color:rgba(212,175,55,.6);margin-bottom:10px;">' + (p.denominazione || p.regione || '') + '</div>' +
      '<div style="font-family:\'IM Fell English\',Georgia,serif;font-style:italic;font-size:.9rem;line-height:1.75;color:rgba(245,239,226,.65);">' + (p.descrizione || '') + '</div>' +
      (p.sito ? '<a href="' + p.sito + '" target="_blank" style="display:inline-block;margin-top:12px;padding:8px 16px;background:rgba(212,175,55,.12);border:1px solid rgba(212,175,55,.3);border-radius:6px;color:#D4AF37;font-size:10px;font-weight:700;letter-spacing:2px;text-decoration:none;">🌐 Visita il sito →</a>' : '') +
    '</div>';
  }

  function closeReader() {
    var r = document.getElementById('v22-reader');
    if (r) r.style.display = 'none';
    document.body.style.overflow = '';
    _readerOpen = false;
  }

  window.addEventListener('popstate', function() {
    if (_readerOpen) closeReader();
  });


  /* ══════════════════════════════════════════════════════
     API PUBBLICA
     ══════════════════════════════════════════════════════ */
  window.SW22 = {
    openContact:  openContactPage,
    closeContact: closeContactPage,
    send:         sendContact,
    closeReader:  closeReader,
    refresh:      loadArticles,
  };


  /* ══════════════════════════════════════════════════════
     INIT
     ══════════════════════════════════════════════════════ */
  function init() {
    console.log('[v22] Patch v22 avviata');

    killOldStuff();
    addContactTab();
    injectMagazine();
    loadArticles();

    /* Ricarica quando cambia lingua */
    var _orig = window.i18n?.setLang?.bind(window.i18n);
    if (_orig) {
      window.i18n.setLang = function(l) {
        _orig(l);
        setTimeout(renderCarousel, 200);
      };
    }

    /* Ritenta dopo 2s per catturare elementi tardivi */
    setTimeout(function() {
      killOldStuff();
      addContactTab();
      if (!document.getElementById('v22-magazine')) {
        injectMagazine();
        loadArticles();
      }
    }, 2000);
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();

})();
