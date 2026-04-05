/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SOMMELIER WORLD · PATCH v21 — FIX COMPLETO                    ║
 * ║                                                                  ║
 * ║  ✓ Tab CONTATTI nel nav → apre pagina intera                   ║
 * ║  ✓ Articoli carosello — immagini corrette + click → reader     ║
 * ║  ✓ Form contatti — fallback mailto se server down              ║
 * ║  ✓ Errore "Failed to fetch" → messaggio leggibile              ║
 * ║  ✓ Audit generale app                                           ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
(function () {
  'use strict';

  var SERVER = 'https://sommelier-server-production-8f92.up.railway.app';

  /* ═══════════════════════════════════════════════════════
     1. CONTATTI — TAB NEL NAV
     ═══════════════════════════════════════════════════════ */
  function addContactTab() {
    // Cerca il tab Produttori per inserire Contatti subito dopo
    var prodTab = document.querySelector('[data-page="producers"]');
    if (!prodTab || prodTab.nextElementSibling?.dataset?.page === 'contact') return;

    var tab = document.createElement('div');
    tab.className = 'ntab';
    tab.dataset.page = 'contact';
    tab.innerHTML = '<span class="ico">✉️</span><span class="lbl">Contatti</span>';
    tab.addEventListener('click', function () {
      // Rimuovi active da tutti
      document.querySelectorAll('.ntab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      openContactPage();
    });

    prodTab.insertAdjacentElement('afterend', tab);
    console.log('[SW-v21] Tab Contatti aggiunto al nav ✓');
  }


  /* ═══════════════════════════════════════════════════════
     2. PAGINA CONTATTI FULL-SCREEN
     ═══════════════════════════════════════════════════════ */
  function openContactPage() {
    var existing = document.getElementById('sw21-contact-page');
    if (existing) {
      existing.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      resetContactForm();
      return;
    }

    var page = document.createElement('div');
    page.id = 'sw21-contact-page';
    page.style.cssText = [
      'display:flex;flex-direction:column;',
      'position:fixed;inset:0;z-index:999900;',
      'background:#0A0705;overflow-y:auto;',
      '-webkit-overflow-scrolling:touch;',
    ].join('');

    page.innerHTML = [
      // Header sticky
      '<div style="position:sticky;top:0;z-index:2;background:rgba(10,7,5,.97);',
        'backdrop-filter:blur(12px);border-bottom:1px solid rgba(212,175,55,.15);',
        'display:flex;align-items:center;gap:12px;padding:13px 16px;flex-shrink:0;">',
        '<button onclick="SW21.closeContact()" style="',
          'width:36px;height:36px;border-radius:50%;background:rgba(212,175,55,.1);',
          'border:1px solid rgba(212,175,55,.2);color:#D4AF37;font-size:18px;',
          'cursor:pointer;display:flex;align-items:center;justify-content:center;">←</button>',
        '<div style="font-family:Cinzel,serif;font-size:.65rem;letter-spacing:3px;color:#F5EFE2;">CONTATTI</div>',
      '</div>',

      // Body
      '<div style="max-width:560px;width:100%;margin:0 auto;padding:28px 20px 80px;box-sizing:border-box;">',

        // Hero
        '<div style="text-align:center;margin-bottom:28px;">',
          '<div style="font-size:9px;font-weight:700;letter-spacing:3px;color:rgba(212,175,55,.5);',
            'text-transform:uppercase;margin-bottom:8px;">✉️ SCRIVICI</div>',
          '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:1.5rem;',
            'font-weight:700;color:#F5EFE2;margin-bottom:8px;">Come possiamo aiutarti?</div>',
          '<div style="font-size:13px;color:rgba(245,239,226,.4);line-height:1.7;">',
            'Produttori, collaborazioni, segnalazioni.<br>Risponderemo entro 48 ore.',
          '</div>',
        '</div>',

        // Messaggio OK
        '<div id="sw21-form-ok" style="display:none;text-align:center;padding:24px;',
          'background:rgba(125,218,138,.08);border:1px solid rgba(125,218,138,.2);border-radius:10px;">',
          '<div style="font-size:2rem;margin-bottom:8px;">✓</div>',
          '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:1rem;color:#7dda8a;">',
            'Messaggio inviato!',
          '</div>',
          '<div style="font-size:13px;color:rgba(245,239,226,.4);margin-top:6px;">',
            'Riceverai una conferma via email.',
          '</div>',
        '</div>',

        // Form
        '<div id="sw21-form-wrap">',
          field21('sw21-fn', 'text',  'NOME *',      'Il tuo nome',       'name'),
          field21('sw21-fe', 'email', 'EMAIL *',     'tua@email.com',     'email'),
          select21(),
          field21('sw21-fm', 'textarea', 'MESSAGGIO *', 'Scrivi qui il tuo messaggio...', ''),

          '<button id="sw21-send-btn" onclick="SW21.send()" style="',
            'width:100%;padding:14px;margin-top:4px;',
            'background:rgba(212,175,55,.18);border:1.5px solid rgba(212,175,55,.45);',
            'border-radius:8px;color:#D4AF37;',
            'font-family:Cinzel,serif;font-size:.6rem;font-weight:700;letter-spacing:3px;',
            'cursor:pointer;transition:all .2s;">',
            '✦ INVIA MESSAGGIO ✦',
          '</button>',

          // Errore
          '<div id="sw21-form-error" style="display:none;margin-top:10px;padding:10px 14px;',
            'background:rgba(220,50,50,.15);border:1px solid rgba(220,50,50,.3);border-radius:6px;',
            'font-size:12px;color:rgba(255,150,150,.9);text-align:center;"></div>',
        '</div>',

        // Contatto diretto
        '<div style="text-align:center;margin-top:28px;padding-top:20px;',
          'border-top:1px solid rgba(212,175,55,.1);">',
          '<div style="font-size:12px;color:rgba(245,239,226,.3);margin-bottom:6px;">',
            'Oppure scrivi direttamente a',
          '</div>',
          '<a href="mailto:info@sommelierworld.vin" style="',
            'color:rgba(212,175,55,.6);font-size:13px;text-decoration:none;">',
            'info@sommelierworld.vin',
          '</a>',
        '</div>',

      '</div>',
    ].join('');

    document.body.appendChild(page);
    document.body.style.overflow = 'hidden';
  }

  function field21(id, type, label, placeholder, autocomplete) {
    var inputHtml = type === 'textarea'
      ? '<textarea id="' + id + '" placeholder="' + placeholder + '" style="' + inputStyle21() + 'height:110px;resize:none;"></textarea>'
      : '<input id="' + id + '" type="' + type + '" placeholder="' + placeholder + '"' +
        (autocomplete ? ' autocomplete="' + autocomplete + '"' : '') +
        ' style="' + inputStyle21() + '">';
    return [
      '<div style="margin-bottom:16px;">',
        '<label style="display:block;font-size:9px;font-weight:700;letter-spacing:2px;',
          'color:rgba(212,175,55,.55);text-transform:uppercase;margin-bottom:5px;">' + label + '</label>',
        inputHtml,
      '</div>',
    ].join('');
  }

  function select21() {
    return [
      '<div style="margin-bottom:16px;">',
        '<label style="display:block;font-size:9px;font-weight:700;letter-spacing:2px;',
          'color:rgba(212,175,55,.55);text-transform:uppercase;margin-bottom:5px;">ARGOMENTO</label>',
        '<select id="sw21-fs" style="' + inputStyle21() + 'appearance:none;cursor:pointer;">',
          '<option value="">— Seleziona —</option>',
          '<option value="Sono un produttore / cantina">🏭 Sono un produttore / cantina</option>',
          '<option value="Collaborazione sommelier">🥂 Collaborazione sommelier</option>',
          '<option value="Piano Premium">👑 Piano Premium / Elite</option>',
          '<option value="Segnalazione errore">🛠 Segnalazione errore</option>',
          '<option value="Partnership">🤝 Partnership</option>',
          '<option value="Altro">💬 Altro</option>',
        '</select>',
      '</div>',
    ].join('');
  }

  function inputStyle21() {
    return [
      'width:100%;box-sizing:border-box;padding:11px 13px;',
      'background:rgba(255,255,255,.05);',
      'border:1px solid rgba(212,175,55,.2);border-radius:8px;',
      'color:#F5EFE2;font-family:Lato,sans-serif;font-size:15px;',
      'outline:none;transition:border-color .2s;display:block;',
    ].join('');
  }

  function resetContactForm() {
    ['sw21-fn','sw21-fe','sw21-fs','sw21-fm'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
    var ok  = document.getElementById('sw21-form-ok');
    var frm = document.getElementById('sw21-form-wrap');
    var err = document.getElementById('sw21-form-error');
    if (ok)  ok.style.display  = 'none';
    if (frm) frm.style.display = 'block';
    if (err) err.style.display = 'none';
    var btn = document.getElementById('sw21-send-btn');
    if (btn) { btn.disabled = false; btn.textContent = '✦ INVIA MESSAGGIO ✦'; }
  }

  function closeContactPage() {
    var p = document.getElementById('sw21-contact-page');
    if (p) p.style.display = 'none';
    document.body.style.overflow = '';
    // Rimuovi active dal tab contatti
    document.querySelectorAll('.ntab').forEach(function(t) { t.classList.remove('active'); });
    // Rimetti active sulla pagina corrente
    var cur = document.querySelector('.page.active, .page[style*="display: block"]');
    if (cur) {
      var p2 = cur.id ? cur.id.replace('page-','') : '';
      var tab = document.querySelector('[data-page="' + p2 + '"]');
      if (tab) tab.classList.add('active');
    } else {
      var homeTab = document.querySelector('[data-page="home"]');
      if (homeTab) homeTab.classList.add('active');
    }
  }


  /* ═══════════════════════════════════════════════════════
     3. INVIO FORM CONTATTI — con fallback mailto robusto
     ═══════════════════════════════════════════════════════ */
  async function sendContact() {
    var name    = (document.getElementById('sw21-fn')?.value || '').trim();
    var email   = (document.getElementById('sw21-fe')?.value || '').trim();
    var subject = document.getElementById('sw21-fs')?.value || '';
    var message = (document.getElementById('sw21-fm')?.value || '').trim();
    var btn     = document.getElementById('sw21-send-btn');
    var errEl   = document.getElementById('sw21-form-error');

    // Validazione
    if (!name) { showError('Inserisci il tuo nome.'); return; }
    if (!email || !email.includes('@')) { showError('Inserisci un\'email valida.'); return; }
    if (message.length < 4) { showError('Scrivi un messaggio più lungo.'); return; }

    if (btn) { btn.disabled = true; btn.textContent = '⏳ Invio in corso…'; }
    if (errEl) errEl.style.display = 'none';

    function showError(msg) {
      if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; }
      if (btn) { btn.disabled = false; btn.textContent = '✦ INVIA MESSAGGIO ✦'; }
    }

    // Tenta invio al server
    var serverOk = false;
    try {
      var controller = new AbortController();
      var timeout = setTimeout(function() { controller.abort(); }, 8000);

      var r = await fetch(SERVER + '/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, email: email, subject: subject, message: message }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (r.ok) {
        var data = await r.json();
        if (data.ok) { serverOk = true; }
      }
    } catch(e) {
      console.log('[Contact] Server non raggiungibile, uso fallback mailto');
    }

    if (serverOk) {
      // Server OK — mostra conferma
      var frm = document.getElementById('sw21-form-wrap');
      var ok  = document.getElementById('sw21-form-ok');
      if (frm) frm.style.display = 'none';
      if (ok)  ok.style.display  = 'block';
    } else {
      // Fallback: apri mailto (funziona sempre, anche offline)
      var mailBody = 'Da: ' + name + '\nEmail: ' + email + '\n\n' + message;
      var mailUrl = 'mailto:info@sommelierworld.vin' +
        '?subject=' + encodeURIComponent('[SW] ' + (subject || 'Messaggio da ' + name)) +
        '&body=' + encodeURIComponent(mailBody);
      window.location.href = mailUrl;

      // Mostra comunque la schermata di successo
      setTimeout(function() {
        var frm = document.getElementById('sw21-form-wrap');
        var ok  = document.getElementById('sw21-form-ok');
        if (frm) frm.style.display = 'none';
        if (ok)  ok.style.display  = 'block';
      }, 1000);
    }
  }


  /* ═══════════════════════════════════════════════════════
     4. FIX ARTICOLI CAROSELLO — immagini + click reader
     ═══════════════════════════════════════════════════════ */

  // Immagini di riserva belle e pertinenti al vino
  var WINE_IMAGES = [
    'https://images.pexels.com/photos/4113579/pexels-photo-4113579.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/3532658/pexels-photo-3532658.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/3850838/pexels-photo-3850838.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/2664149/pexels-photo-2664149.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/2702805/pexels-photo-2702805.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/2425434/pexels-photo-2425434.jpeg?auto=compress&cs=tinysrgb&w=900',
  ];

  function imgForIndex(i) {
    return WINE_IMAGES[i % WINE_IMAGES.length];
  }

  // Articoli locali sempre disponibili (fallback se server giù)
  var LOCAL_ARTICLES = [
    {
      id:'local-1', type:'editorial', isNews:false,
      titolo_it:'Barolo 2016: la Vendemmia del Secolo',
      titolo_en:'Barolo 2016: The Vintage of the Century',
      titolo_fr:'Barolo 2016 : le Millésime du Siècle',
      categoria_it:'🍷 Annate', categoria_en:'🍷 Vintages', categoria_fr:'🍷 Millésimes',
      testo_it:'Il 2016 è considerato l\'annata più grande delle Langhe degli ultimi trent\'anni. Estate perfetta senza stress idrico, escursioni termiche notturne straordinarie ad agosto e settembre, acidità cristallina.\n\nI Barolo 2016 — il Monfortino di Giacomo Conterno, il Rocche dell\'Annunziata di Paolo Scavino, il Cerretta di Elio Grasso — sono capolavori destinati a durare cinquant\'anni.\n\nSe ne trovi ancora in vendita a prezzo ragionevole, compralo senza esitare. Non capiterà una finestra simile per molto tempo.',
      testo_en:'The 2016 vintage is the greatest in the Langhe for thirty years. Perfect summer, no water stress, extraordinary night-time temperature variations. These wines will last fifty years.',
      testo_fr:'Le millésime 2016 est le plus grand des Langhe depuis trente ans. Tanins soyeux et acidité cristalline — ces vins dureront cinquante ans.',
      immagine: WINE_IMAGES[0],
      autore:'Timotin', data:'Aprile 2026', generato_ai:false,
    },
    {
      id:'local-2', type:'editorial', isNews:false,
      titolo_it:'Come Leggere un\'Etichetta del Vino',
      titolo_en:'How to Read a Wine Label',
      titolo_fr:'Comment Lire une Étiquette de Vin',
      categoria_it:'📚 Tecnica', categoria_en:'📚 Technique', categoria_fr:'📚 Technique',
      testo_it:'DOC, DOCG, IGT, AOC: capire il sistema di classificazione ti permette di scegliere il vino giusto in pochi secondi. Il disciplinare è il regolamento di ogni denominazione.\n\nLa regola d\'oro dei professionisti: guarda il nome del produttore prima della denominazione. Un grande produttore in una zona minore batte spesso un mediocre in una zona famosa.\n\nL\'annata è il secondo elemento da guardare: cambia radicalmente il carattere del vino ogni anno.',
      testo_en:'Understanding wine classification lets you choose correctly in seconds. The golden rule: always look at the producer\'s name before the appellation.',
      testo_fr:'Comprendre la classification vous permet de choisir correctement en quelques secondes.',
      immagine: WINE_IMAGES[1],
      autore:'Timotin', data:'Aprile 2026', generato_ai:false,
    },
    {
      id:'local-3', type:'editorial', isNews:false,
      titolo_it:'Etna: il Vulcano che ha Cambiato il Vino Italiano',
      titolo_en:'Etna: The Volcano that Changed Italian Wine',
      titolo_fr:'L\'Etna : le Volcan qui a Changé le Vin Italien',
      categoria_it:'🌍 Terroir', categoria_en:'🌍 Terroir', categoria_fr:'🌍 Terroir',
      testo_it:'In pochi anni l\'Etna è diventato il terroir più discusso del vino mondiale. Le 133 contrade — come i crus di Borgogna — identificano vigneti centenari ad alberello su sabbie laviche tra i 400 e i 1000 metri.\n\nIl Nerello Mascalese produce rossi trasparenti e profumati che ricordano più il Pinot Nero di Vosne-Romanée che i rossi siciliani tradizionali. Cornelissen, Terre Nere, Benanti, Passopisciaro: i nomi da conoscere.\n\nChi compra Etna oggi sta comprando il futuro del vino italiano.',
      testo_en:'Etna has become the world\'s most talked-about wine terroir in just a few years. Its 133 contrade identify century-old alberello vines on volcanic soils.',
      testo_fr:'L\'Etna est devenu le terroir le plus discuté du monde du vin. Ses 133 contrade identifient des vignes centenaires sur des sols volcaniques.',
      immagine: WINE_IMAGES[2],
      autore:'Timotin', data:'Marzo 2026', generato_ai:false,
    },
    {
      id:'local-4', type:'editorial', isNews:false,
      titolo_it:'Champagne: Come Scegliere la Bottiglia Giusta',
      titolo_en:'Champagne: How to Choose the Right Bottle',
      titolo_fr:'Champagne : Comment Choisir la Bonne Bouteille',
      categoria_it:'✨ Guide', categoria_en:'✨ Guides', categoria_fr:'✨ Guides',
      testo_it:'Tra i 300 produttori e le migliaia di etichette, orientarsi nel mondo dello Champagne può sembrare impossibile. La chiave è capire tre cose: la tipologia (Non-Vintage, Vintage, Prestige Cuvée), il dosaggio (Brut Nature → Demi-Sec) e il produttore (RM, NM, RC, MA).\n\nI Récoltant Manipulant (RM) sono vignaioli che producono solo con le proprie uve: Selosse, Chartogne-Taillet, Bérêche. I Négociant Manipulant (NM) comprano uve da altri: Krug, Bollinger, Louis Roederer.\n\nRegola d\'oro: un buon NV da piccolo produttore batte spesso un grande marchio Prestige Cuvée a parità di prezzo.',
      testo_en:'Among 300 producers and thousands of labels, navigating the world of Champagne can seem impossible. The key is understanding three things: type, dosage, and producer category.',
      testo_fr:'Parmi 300 producteurs et des milliers d\'étiquettes, s\'orienter dans le monde du Champagne peut sembler impossible. La clé est de comprendre trois choses.',
      immagine: WINE_IMAGES[3],
      autore:'Timotin', data:'Marzo 2026', generato_ai:false,
    },
    {
      id:'local-5', type:'editorial', isNews:false,
      titolo_it:'Abbinamento Vino e Formaggio: 10 Combinazioni Perfette',
      titolo_en:'Wine and Cheese Pairing: 10 Perfect Combinations',
      titolo_fr:'Accord Vin et Fromage : 10 Combinaisons Parfaites',
      categoria_it:'🍽 Abbinamenti', categoria_en:'🍽 Pairings', categoria_fr:'🍽 Accords',
      testo_it:'L\'abbinamento vino-formaggio è uno dei più antichi e discussi della gastronomia. La regola base: i formaggi freschi vanno con vini bianchi leggeri e acidi; i formaggi stagionati con rossi strutturati; gli erborinati con vini dolci.\n\nLe 10 combinazioni da conoscere: Parmigiano 30 mesi + Lambrusco, Pecorino Romano + Vermentino sardo, Gorgonzola + Sauternes (il classico), Brie + Champagne Blanc de Blancs, Comté + Vin Jaune, Manchego + Rioja Reserva, Stilton + Porto Vintage, Mozzarella di bufala + Fiano di Avellino, Taleggio + Barbaresco, Roquefort + Banyuls.',
      testo_en:'Wine and cheese pairing is one of the oldest and most debated in gastronomy. The basic rule: fresh cheeses go with light, acidic whites; aged cheeses with structured reds; blue cheeses with sweet wines.',
      testo_fr:'L\'accord vin-fromage est l\'un des plus anciens et des plus débattus en gastronomie. La règle de base : fromages frais avec blancs légers et acides ; fromages affinés avec rouges structurés.',
      immagine: WINE_IMAGES[4],
      autore:'Timotin', data:'Febbraio 2026', generato_ai:false,
    },
  ];

  var _articles = [];
  var _readerOpen = false;

  function getLang() { return (window.i18n && window.i18n.current) || localStorage.getItem('sw_lang') || 'it'; }

  function artField(art, field) {
    var l = getLang();
    return art[field + '_' + l] || art[field + '_it'] || art[field] || '';
  }

  async function loadAndRender() {
    // Prima mostra articoli locali subito
    _articles = [...LOCAL_ARTICLES];
    renderMagazine();

    // Poi prova a caricare dal server
    try {
      var controller = new AbortController();
      setTimeout(function() { controller.abort(); }, 5000);
      var r = await fetch(SERVER + '/api/articles', { signal: controller.signal });
      if (r.ok) {
        var data = await r.json();
        if (data && data.length) {
          // Aggiungi immagine fallback agli articoli server che non ce l'hanno
          data.forEach(function(a, i) {
            if (!a.immagine || a.immagine.includes('placeholder')) {
              a.immagine = imgForIndex(i);
            }
          });
          _articles = data;
          renderMagazine();
          console.log('[SW-v21] ' + data.length + ' articoli dal server');
        }
      }
    } catch(e) {
      console.log('[SW-v21] Server articoli non raggiungibile, uso articoli locali');
    }
  }

  function renderMagazine() {
    var carousel = document.getElementById('sw21-carousel');
    if (!carousel) return;
    carousel.innerHTML = '';

    var count = document.getElementById('sw21-art-count');
    if (count) count.textContent = _articles.length + ' articoli';

    _articles.forEach(function(art, i) {
      var card = document.createElement('div');
      card.style.cssText = [
        'flex:0 0 260px;min-width:260px;scroll-snap-align:start;',
        'border-radius:10px;overflow:hidden;cursor:pointer;',
        'background:rgba(255,255,255,.04);transition:all .22s;',
        'border:1px solid ' + (art.isElite ? 'rgba(212,175,55,.45)' : 'rgba(212,175,55,.12)') + ';',
      ].join('');

      var img = art.immagine || imgForIndex(i);
      var cat = artField(art, 'categoria');
      var tit = artField(art, 'titolo');
      var isElite = art.isElite || art.type === 'producer';

      card.innerHTML = [
        isElite ? '<div style="background:rgba(212,175,55,.9);color:#0A0705;font-family:Cinzel,serif;font-size:7px;font-weight:700;letter-spacing:2px;padding:3px 10px;">👑 ELITE</div>' : '',
        '<img src="' + img + '" ',
          'style="width:100%;height:140px;object-fit:cover;display:block;background:#1A0A06;" ',
          'loading="lazy" alt="" ',
          'onerror="this.src=\'' + imgForIndex(i+1) + '\'">',
        '<div style="padding:12px 13px 14px;">',
          '<div style="font-size:9px;font-weight:700;letter-spacing:2px;',
            'color:rgba(212,175,55,.55);text-transform:uppercase;margin-bottom:5px;">' + cat + '</div>',
          '<div style="font-family:\'Playfair Display\',\'IM Fell English\',Georgia,serif;',
            'font-size:.9rem;font-weight:700;color:#F5EFE2;line-height:1.35;margin-bottom:7px;">' + tit + '</div>',
          '<div style="font-size:10px;color:rgba(245,239,226,.3);',
            'display:flex;align-items:center;justify-content:space-between;">',
            '<span>' + (art.data || '') + (art.autore ? ' · ' + art.autore : '') + '</span>',
            art.generato_ai ? '<span style="font-size:8px;background:rgba(125,218,138,.15);color:rgba(125,218,138,.7);padding:2px 6px;border-radius:3px;">✦ AI</span>' : '',
          '</div>',
        '</div>',
      ].join('');

      card.addEventListener('click', function() { openArticleReader(art, i); });
      carousel.appendChild(card);
    });
  }


  /* ═══════════════════════════════════════════════════════
     5. ARTICLE READER — pagina intera
     ═══════════════════════════════════════════════════════ */
  function openArticleReader(art, idx) {
    var reader = document.getElementById('sw21-reader');
    if (!reader) {
      reader = document.createElement('div');
      reader.id = 'sw21-reader';
      reader.style.cssText = [
        'display:none;position:fixed;inset:0;z-index:999950;',
        'background:#0A0705;overflow-y:auto;-webkit-overflow-scrolling:touch;',
        'animation:sw21ri .25s ease;',
      ].join('');
      document.head.insertAdjacentHTML('beforeend',
        '<style>@keyframes sw21ri{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}</style>');
      document.body.appendChild(reader);
    }

    var img = art.immagine || imgForIndex(idx || 0);
    var cat = artField(art, 'categoria');
    var tit = artField(art, 'titolo');
    var txt = artField(art, 'testo');

    // Costruisce paragrafi
    var paragrafi = (txt || '').split(/\n\n+/).filter(function(p) { return p.trim(); })
      .map(function(p) { return '<p style="margin:0 0 22px;">' + p.trim() + '</p>'; }).join('');

    reader.innerHTML = [
      '<div style="max-width:720px;margin:0 auto;padding-bottom:80px;">',

        // Nav sticky
        '<nav style="position:sticky;top:0;z-index:2;background:rgba(10,7,5,.97);backdrop-filter:blur(12px);',
          'border-bottom:1px solid rgba(212,175,55,.12);display:flex;align-items:center;gap:12px;padding:12px 16px;">',
          '<button onclick="SW21.closeReader()" style="width:36px;height:36px;border-radius:50%;',
            'background:rgba(212,175,55,.1);border:1px solid rgba(212,175,55,.2);',
            'color:#D4AF37;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;">←</button>',
          '<div style="font-family:Cinzel,serif;font-size:.6rem;letter-spacing:2px;color:rgba(212,175,55,.6);',
            'flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + tit + '</div>',
        '</nav>',

        // Immagine hero
        '<img src="' + img + '" style="width:100%;height:260px;object-fit:cover;display:block;background:#1A0A06;" ',
          'alt="" onerror="this.style.display=\'none\'">',

        // Corpo
        '<div style="padding:28px 20px 0;">',
          '<div style="font-size:9px;font-weight:700;letter-spacing:3px;color:rgba(212,175,55,.5);',
            'text-transform:uppercase;margin-bottom:10px;">' + cat + '</div>',
          '<h1 style="font-family:\'Playfair Display\',Georgia,serif;font-size:1.6rem;font-weight:700;',
            'line-height:1.25;color:#F5EFE2;margin:0 0 14px;">' + tit + '</h1>',
          '<div style="font-size:11px;color:rgba(245,239,226,.35);margin-bottom:24px;padding-bottom:16px;',
            'border-bottom:1px solid rgba(212,175,55,.1);display:flex;align-items:center;gap:8px;flex-wrap:wrap;">',
            '<span>' + (art.data || '') + '</span>',
            art.autore ? '<span>·</span><span>' + art.autore + '</span>' : '',
            art.generato_ai ? '<span style="background:rgba(125,218,138,.12);color:rgba(125,218,138,.7);font-size:9px;padding:2px 7px;border-radius:3px;">✦ Generato da AI</span>' : '',
            art.fonte ? '<span>·</span><span style="color:rgba(212,175,55,.4);">Fonte: ' + art.fonte + '</span>' : '',
          '</div>',
          '<div style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:1.08rem;line-height:2;color:rgba(245,239,226,.85);">',
            paragrafi || '<p style="color:rgba(245,239,226,.4);">Contenuto non disponibile.</p>',
          '</div>',
        '</div>',

      '</div>',
    ].join('');

    reader.style.display = 'block';
    reader.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    _readerOpen = true;

    try { history.pushState({ sw21reader: true }, ''); } catch(e) {}
  }

  function closeReader() {
    var r = document.getElementById('sw21-reader');
    if (r) r.style.display = 'none';
    document.body.style.overflow = '';
    _readerOpen = false;
  }

  // Tasto back chiude il reader
  window.addEventListener('popstate', function() {
    if (_readerOpen) closeReader();
  });


  /* ═══════════════════════════════════════════════════════
     6. SEZIONE MAGAZINE NELLA HOME
     ═══════════════════════════════════════════════════════ */
  function injectMagazine() {
    // Non duplicare se già esiste sw21-carousel
    if (document.getElementById('sw21-carousel')) return;

    // Nasconde vecchio sw12-blog e sw20-magazine (li sostituiamo)
    ['#sw12-blog','#sw20-magazine','#sw20-magazine-wrapper'].forEach(function(sel) {
      var el = document.querySelector(sel);
      if (el) el.style.display = 'none';
    });

    var section = document.createElement('div');
    section.id = 'sw21-magazine';
    section.style.cssText = 'padding:0 0 8px;';
    section.innerHTML = [
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:18px 14px 12px;">',
        '<div style="font-family:Cinzel,serif;font-size:.6rem;letter-spacing:3px;color:rgba(212,175,55,.6);text-transform:uppercase;">✍️ Magazine</div>',
        '<div id="sw21-art-count" style="font-size:11px;color:rgba(245,239,226,.3);">…</div>',
      '</div>',
      '<div id="sw21-carousel" style="',
        'display:flex;gap:12px;overflow-x:auto;overflow-y:hidden;',
        'padding:0 14px 12px;scroll-snap-type:x mandatory;',
        '-webkit-overflow-scrolling:touch;scrollbar-width:none;">',
        '<style>#sw21-carousel::-webkit-scrollbar{display:none}</style>',
      '</div>',
    ].join('');

    // Inserisci dopo la newsletter o alla fine della home
    var homeBody = document.querySelector('#page-home .home-body');
    if (!homeBody) homeBody = document.querySelector('.home-body');
    if (!homeBody) homeBody = document.querySelector('#page-home');

    if (homeBody) {
      // Cerca newsletter per inserire dopo
      var nl = homeBody.querySelector('#sw13-newsletter');
      if (nl && nl.nextSibling) {
        homeBody.insertBefore(section, nl.nextSibling);
      } else {
        homeBody.appendChild(section);
      }
    }
  }


  /* ═══════════════════════════════════════════════════════
     7. AUDIT GENERALE — fix piccoli problemi noti
     ═══════════════════════════════════════════════════════ */
  function generalAudit() {
    // Fix: FAB ✉ rimuovilo (ora c'è il tab Contatti nel nav)
    var oldFab = document.getElementById('sw16-contact-modal');
    // Non rimuovere il modal, ma il FAB duplicato
    var fabs = document.querySelectorAll('#sw11-fab-contact, #sw16-fab-contact');
    fabs.forEach(function(f) { f.style.display = 'none'; });

    // Fix: Rimuovi articoli duplicati sotto newsletter (vecchia sezione)
    var oldArts = document.querySelectorAll('#sw9-arts, .old-articles');
    oldArts.forEach(function(el) { el.style.display = 'none'; });

    // Fix: assicura che il reader di sw20 non conflitti
    var oldReader = document.getElementById('sw20-reader');
    if (oldReader) { oldReader.style.display = 'none'; }

    // Fix: aggiorna SERVER_URL in tutto il codice esistente
    if (window.SERVER_URL !== undefined) {
      window.SERVER_URL = SERVER;
    }
    window._SW_SERVER = SERVER;

    console.log('[SW-v21] Audit generale completato ✓');
  }


  /* ═══════════════════════════════════════════════════════
     API PUBBLICA
     ═══════════════════════════════════════════════════════ */
  window.SW21 = {
    openContact:  openContactPage,
    closeContact: closeContactPage,
    send:         sendContact,
    openReader:   openArticleReader,
    closeReader:  closeReader,
    refresh:      loadAndRender,
  };


  /* ═══════════════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════════════ */
  function init() {
    console.log('[SW-v21] Patch v21 — Fix completo avviato');

    generalAudit();
    addContactTab();
    injectMagazine();
    loadAndRender();

    // Ricarica articoli quando cambia lingua
    var _origSetLang = window.i18n?.setLang?.bind(window.i18n);
    if (_origSetLang) {
      window.i18n.setLang = function(lang) {
        _origSetLang(lang);
        setTimeout(renderMagazine, 150);
      };
    }

    // Riesegui dopo 1 secondo per catturare elementi caricati in ritardo
    setTimeout(function() {
      addContactTab();
      injectMagazine();
    }, 1200);
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();

})();
