/**
 * SOMMELIER WORLD · PATCH v16
 * ✓ Fix contatti — bottone ✉ apre sempre il modal correttamente
 * ✓ Errori AI più leggibili (quota, rete, ecc.)
 */
(function () {
  'use strict';

  /* ── CSS aggiuntivo ───────────────────────────────── */
  var s = document.createElement('style');
  s.textContent = [
    /* Bottone ✉ sempre visibile e funzionante */
    '#sw11-fab-contact{',
      'position:fixed!important;bottom:22px!important;right:16px!important;',
      'z-index:999900!important;',
      'width:52px!important;height:52px!important;border-radius:50%!important;',
      'background:rgba(10,7,5,.95)!important;',
      'border:1.5px solid rgba(212,175,55,.5)!important;',
      'color:#D4AF37!important;font-size:22px!important;',
      'display:flex!important;align-items:center!important;justify-content:center!important;',
      'cursor:pointer!important;box-shadow:0 4px 20px rgba(0,0,0,.6)!important;',
      'backdrop-filter:blur(8px)!important;}',

    /* Modal contatti sempre sopra tutto */
    '#sw11-contact-page{z-index:999980!important;}',
  ].join('');
  document.head.appendChild(s);

  /* ── Crea/ricrea il bottone contatti ─────────────── */
  function fixContactButton() {
    /* Rimuovi vecchio FAB se esiste */
    var old = document.querySelector('#sw11-fab-contact');
    if (old) old.remove();

    /* Crea nuovo FAB affidabile */
    var fab = document.createElement('div');
    fab.id = 'sw11-fab-contact';
    fab.innerHTML = '✉';
    fab.title = 'Contattaci';
    fab.setAttribute('role', 'button');
    fab.setAttribute('aria-label', 'Apri contatti');

    fab.addEventListener('click', function(e) {
      e.stopPropagation();
      openContactModal();
    });

    document.body.appendChild(fab);
  }

  /* ── Modal contatti standalone ───────────────────── */
  function openContactModal() {
    /* Se esiste già SW11, usa quello */
    if (window.SW11 && typeof window.SW11.openContact === 'function') {
      window.SW11.openContact();
      return;
    }

    /* Altrimenti crea un modal semplice autonomo */
    var existing = document.querySelector('#sw16-contact-modal');
    if (existing) {
      existing.style.display = 'block';
      existing.scrollTop = 0;
      document.body.style.overflow = 'hidden';
      resetForm();
      return;
    }

    var modal = document.createElement('div');
    modal.id = 'sw16-contact-modal';
    modal.style.cssText = [
      'display:block;position:fixed;inset:0;z-index:999980;',
      'background:#0A0705;overflow-y:auto;',
      'animation:sw16in .3s ease;',
    ].join('');

    modal.innerHTML = [
      '<style>@keyframes sw16in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}</style>',

      /* Header */
      '<div style="position:sticky;top:0;z-index:2;background:rgba(10,7,5,.97);backdrop-filter:blur(12px);',
        'border-bottom:1px solid rgba(212,175,55,.15);padding:14px 16px;',
        'display:flex;align-items:center;gap:12px;">',
        '<div onclick="document.querySelector(\'#sw16-contact-modal\').style.display=\'none\';document.body.style.overflow=\'\'" ',
          'style="width:36px;height:36px;border-radius:50%;background:rgba(212,175,55,.1);',
          'border:1px solid rgba(212,175,55,.25);color:#D4AF37;font-size:18px;cursor:pointer;',
          'display:flex;align-items:center;justify-content:center;flex-shrink:0;">←</div>',
        '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:1.1rem;font-weight:700;color:#F5EFE2;">Contatti</div>',
      '</div>',

      /* Body */
      '<div style="max-width:560px;margin:0 auto;padding:24px 16px 60px;">',

        '<div style="text-align:center;padding:20px 0 24px;">',
          '<div style="font-size:9px;font-weight:700;letter-spacing:3px;color:rgba(212,175,55,.5);text-transform:uppercase;margin-bottom:8px;">✉️ SCRIVICI</div>',
          '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:1.5rem;font-weight:700;color:#F5EFE2;">Come possiamo aiutarti?</div>',
          '<div style="font-size:12px;color:rgba(245,239,226,.4);margin-top:8px;line-height:1.7;">',
            'Produttori, collaborazioni, segnalazioni.<br>Risponderemo entro 48 ore.',
          '</div>',
        '</div>',

        '<div id="sw16-form-ok" style="display:none;text-align:center;padding:20px;color:#7dda8a;font-size:13px;">',
          '✓ Messaggio inviato! Ti risponderemo presto.',
        '</div>',

        '<form id="sw16-form" onsubmit="return false;" style="display:block;">',

          field('sw16-fn', 'text',  'NOME *',     'Il tuo nome',         'name'),
          field('sw16-fe', 'email', 'EMAIL *',    'la.tua@email.com',    'email'),

          '<div style="margin-bottom:14px;">',
            '<label style="display:block;font-size:9px;font-weight:700;letter-spacing:2px;',
              'text-transform:uppercase;color:rgba(212,175,55,.55);margin-bottom:5px;">ARGOMENTO</label>',
            '<select id="sw16-fs" style="',inp(),'appearance:none;cursor:pointer;">',
              '<option value="">— Seleziona —</option>',
              '<option value="Sono un produttore">🏭 Sono un produttore / cantina</option>',
              '<option value="Collaborazione sommelier">🥂 Collaborazione sommelier</option>',
              '<option value="Errore nel database">🛠 Segnalazione errore</option>',
              '<option value="Partnership">🤝 Partnership</option>',
              '<option value="Altro">💬 Altro</option>',
            '</select>',
          '</div>',

          '<div style="margin-bottom:14px;">',
            '<label style="display:block;font-size:9px;font-weight:700;letter-spacing:2px;',
              'text-transform:uppercase;color:rgba(212,175,55,.55);margin-bottom:5px;">MESSAGGIO *</label>',
            '<textarea id="sw16-fm" style="',inp(),'height:110px;resize:none;" ',
              'placeholder="Scrivi qui il tuo messaggio..."></textarea>',
          '</div>',

          '<button id="sw16-send" onclick="SW16.send()" style="',
            'width:100%;padding:13px;background:rgba(212,175,55,.15);',
            'border:1px solid rgba(212,175,55,.4);border-radius:8px;',
            'color:#D4AF37;font-size:11px;font-weight:700;letter-spacing:3px;',
            'text-transform:uppercase;cursor:pointer;',
            'font-family:\'Lato\',sans-serif;">✦ INVIA MESSAGGIO ✦</button>',

        '</form>',

        '<div style="text-align:center;margin-top:22px;font-size:12px;color:rgba(245,239,226,.35);line-height:1.9;">',
          'Oppure scrivi direttamente a<br>',
          '<a href="mailto:info@sommelierworld.vin" style="color:rgba(212,175,55,.55);text-decoration:none;">info@sommelierworld.vin</a>',
        '</div>',

      '</div>',
    ].join('');

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
  }

  function field(id, type, label, placeholder, autocomplete) {
    return [
      '<div style="margin-bottom:14px;">',
        '<label style="display:block;font-size:9px;font-weight:700;letter-spacing:2px;',
          'text-transform:uppercase;color:rgba(212,175,55,.55);margin-bottom:5px;">' + label + '</label>',
        '<input id="' + id + '" type="' + type + '" placeholder="' + placeholder + '"',
          (autocomplete ? ' autocomplete="' + autocomplete + '"' : ''),
          ' style="' + inp() + '">',
      '</div>',
    ].join('');
  }

  function inp() {
    return [
      'width:100%;padding:11px 13px;box-sizing:border-box;',
      'background:rgba(255,255,255,.05);',
      'border:1px solid rgba(212,175,55,.2);border-radius:8px;',
      'color:#F5EFE2;font-family:\'Lato\',sans-serif;font-size:15px;',
    ].join('');
  }

  function resetForm() {
    var form = document.querySelector('#sw16-form, #sw11-contact-form');
    if (form) form.reset();
    var ok = document.querySelector('#sw16-form-ok');
    if (ok) ok.style.display = 'none';
    var f = document.querySelector('#sw16-form');
    if (f) f.style.display = 'block';
    var btn = document.querySelector('#sw16-send');
    if (btn) { btn.disabled = false; btn.textContent = '✦ INVIA MESSAGGIO ✦'; }
  }

  /* ── Invio form ──────────────────────────────────── */
  async function sendContact() {
    var name    = (document.querySelector('#sw16-fn')?.value || '').trim();
    var email   = (document.querySelector('#sw16-fe')?.value || '').trim();
    var subject = document.querySelector('#sw16-fs')?.value || '';
    var message = (document.querySelector('#sw16-fm')?.value || '').trim();
    var btn     = document.querySelector('#sw16-send');

    if (!name || !email || !message) {
      alert('Compila i campi obbligatori (*)');
      return;
    }

    if (btn) { btn.disabled = true; btn.textContent = '⏳ Invio…'; }

    var SERVER = window._SW_SERVER ||
      'https://sommelier-server-production-8f92.up.railway.app';

    try {
      var r = await fetch(SERVER + '/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });
      var data = await r.json();
      if (r.ok && data.ok) {
        var form = document.querySelector('#sw16-form');
        var ok   = document.querySelector('#sw16-form-ok');
        if (form) form.style.display = 'none';
        if (ok)   ok.style.display   = 'block';
      } else {
        throw new Error(data.error || 'Errore server');
      }
    } catch(err) {
      // Fallback mailto
      var body = encodeURIComponent('Da: ' + name + '\nEmail: ' + email + '\n\n' + message);
      window.location.href = 'mailto:info@sommelierworld.vin?subject=' +
        encodeURIComponent('[SW] ' + (subject || 'Messaggio')) + '&body=' + body;
      if (btn) { btn.disabled = false; btn.textContent = '✦ INVIA MESSAGGIO ✦'; }
    }
  }

  /* ── Errori AI più chiari ────────────────────────── */
  function watchAIErrors() {
    var ERROR_MAP = {
      'quota':           '⏱ Limite API raggiunto — riprova tra qualche ora',
      '429':             '⏱ Troppe richieste — aspetta 30 secondi e riprova',
      'Too Many':        '⏱ Troppe richieste — aspetta e riprova',
      'API key':         '🔑 Chiave API non valida — controlla Railway',
      'not found':       '⚙️ Modello AI non trovato — controlla GEMINI_MODEL',
      'Failed to fetch': '📡 Server non raggiungibile — cold start ~30s',
      'Verifica la API': '⚙️ Problema di connessione — riprova tra 30 secondi',
    };

    function cleanError(el) {
      if (!el || !el.textContent) return;
      var txt = el.textContent;
      for (var key in ERROR_MAP) {
        if (txt.includes(key)) {
          el.innerHTML =
            '<div style="text-align:center;padding:16px 8px;">' +
              '<div style="font-size:1.5rem;margin-bottom:8px;">😔</div>' +
              '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:.95rem;color:#F5EFE2;margin-bottom:8px;">' +
                ERROR_MAP[key] +
              '</div>' +
              '<div style="font-size:11px;color:rgba(245,239,226,.4);margin-bottom:14px;">Il sommelier tornerà presto operativo</div>' +
              '<button onclick="doAbbinamento&&doAbbinamento()" style="padding:8px 18px;' +
                'background:rgba(212,175,55,.15);border:1px solid rgba(212,175,55,.3);' +
                'border-radius:6px;color:#D4AF37;font-size:11px;cursor:pointer;">↺ Riprova</button>' +
            '</div>';
          break;
        }
      }
    }

    // Osserva i div risultato
    var targets = ['#somResult','#wsRes','.dai-load'];
    targets.forEach(function(sel) {
      var el = document.querySelector(sel);
      if (!el) return;
      new MutationObserver(function() { cleanError(el); })
        .observe(el, { childList: true, subtree: true, characterData: true });
    });

    // Pulisci anche quelli già visibili
    targets.forEach(function(sel) {
      cleanError(document.querySelector(sel));
    });
  }

  /* ── API pubblica ────────────────────────────────── */
  window.SW16 = { send: sendContact, open: openContactModal };

  /* ── Init ────────────────────────────────────────── */
  function init() {
    fixContactButton();
    watchAIErrors();

    // Osserva se il DOM cambia (SPA navigation)
    new MutationObserver(function() {
      if (!document.querySelector('#sw11-fab-contact') &&
          !document.querySelector('#sw16-contact-modal')) {
        fixContactButton();
      }
    }).observe(document.body, { childList: true });

    console.log('[SW-v16] Fix contatti + errori AI ✓');
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();

})();
