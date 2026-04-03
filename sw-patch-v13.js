/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SOMMELIER WORLD · PATCH v13                                    ║
 * ║                                                                  ║
 * ║  ✓ Traduzioni IT / EN / FR — bottoni già presenti nel nav      ║
 * ║  ✓ Sistema Freemium Produttori — Base / Premium / Elite        ║
 * ║  ✓ Newsletter signup — raccolta email per monetizzazione        ║
 * ║  ✓ Badge "Produttore Verificato" nella directory               ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════
     DIZIONARIO TRADUZIONI
     Aggiungere qui nuove frasi — il sistema le applica in auto
     ═══════════════════════════════════════════════════════ */
  var LANG = {

    it: {
      /* Nav */
      'Home':           'Home',
      'Eventi':         'Eventi',
      'Terroir':        'Terroir',
      'Confronta':      'Confronta',
      'Sommelier':      'Sommelier',
      'Produttori':     'Produttori',
      'Contatti':       'Contatti',
      /* Sommelier page */
      'CONSULTA IL SOMMELIER': '✦ CONSULTA IL SOMMELIER ✦',
      'Profilo organolettico': 'Profilo organolettico del vino desiderato',
      'ACIDITÀ':        'ACIDITÀ',
      'MORBIDEZZA':     'MORBIDEZZA',
      'SAPIDITÀ':       'SAPIDITÀ',
      'STRUTTURA':      'STRUTTURA',
      'ORIGINE PREFERITA': 'ORIGINE PREFERITA',
      'Qualsiasi paese':  'Qualsiasi paese',
      'Qualsiasi regione':'Qualsiasi regione',
      'Budget':         'Budget per bottiglia',
      'Errore. Verifica la API Key.': 'Errore di connessione. Riprova.',
      /* Produttori */
      'Diventa Produttore': 'Diventa Produttore',
      'Piano Base':     'Piano Base — Gratuito',
      'Piano Premium':  'Piano Premium — €15/mese',
      'Piano Elite':    'Piano Elite — €50/mese',
      /* Newsletter */
      'newsletter_title': 'Ricevi le novità del vino',
      'newsletter_sub':   'Una volta a settimana: scoperte, denominazioni rare, guide.',
      'newsletter_btn':   'ISCRIVITI',
      'newsletter_ok':    '✓ Iscrizione confermata!',
    },

    en: {
      /* Nav */
      'Home':           'Home',
      'Eventi':         'Events',
      'Terroir':        'Terroir',
      'Confronta':      'Compare',
      'Sommelier':      'Sommelier',
      'Produttori':     'Producers',
      'Contatti':       'Contact',
      /* Sommelier page */
      'CONSULTA IL SOMMELIER': '✦ ASK THE SOMMELIER ✦',
      'Profilo organolettico': 'Desired wine profile',
      'ACIDITÀ':        'ACIDITY',
      'MORBIDEZZA':     'SOFTNESS',
      'SAPIDITÀ':       'SALINITY',
      'STRUTTURA':      'BODY',
      'ORIGINE PREFERITA': 'PREFERRED ORIGIN',
      'Qualsiasi paese':  'Any country',
      'Qualsiasi regione':'Any region',
      'Budget':         'Budget per bottle',
      'Errore. Verifica la API Key.': 'Connection error. Please retry.',
      /* Produttori */
      'Diventa Produttore': 'Become a Producer',
      'Piano Base':     'Base Plan — Free',
      'Piano Premium':  'Premium Plan — €15/month',
      'Piano Elite':    'Elite Plan — €50/month',
      /* Newsletter */
      'newsletter_title': 'Get the latest wine news',
      'newsletter_sub':   'Once a week: discoveries, rare appellations, guides.',
      'newsletter_btn':   'SUBSCRIBE',
      'newsletter_ok':    '✓ Subscription confirmed!',
    },

    fr: {
      /* Nav */
      'Home':           'Accueil',
      'Eventi':         'Événements',
      'Terroir':        'Terroir',
      'Confronta':      'Comparer',
      'Sommelier':      'Sommelier',
      'Produttori':     'Producteurs',
      'Contatti':       'Contact',
      /* Sommelier page */
      'CONSULTA IL SOMMELIER': '✦ CONSULTER LE SOMMELIER ✦',
      'Profilo organolettico': 'Profil organoleptique souhaité',
      'ACIDITÀ':        'ACIDITÉ',
      'MORBIDEZZA':     'SOUPLESSE',
      'SAPIDITÀ':       'SALINITÉ',
      'STRUTTURA':      'CORPS',
      'ORIGINE PREFERITA': 'ORIGINE PRÉFÉRÉE',
      'Qualsiasi paese':  'Tout pays',
      'Qualsiasi regione':'Toute région',
      'Budget':         'Budget par bouteille',
      'Errore. Verifica la API Key.': 'Erreur de connexion. Réessayez.',
      /* Produttori */
      'Diventa Produttore': 'Devenir Producteur',
      'Piano Base':     'Plan Base — Gratuit',
      'Piano Premium':  'Plan Premium — 15€/mois',
      'Piano Elite':    'Plan Elite — 50€/mois',
      /* Newsletter */
      'newsletter_title': 'Recevez les actualités du vin',
      'newsletter_sub':   'Une fois par semaine : découvertes, appellations rares, guides.',
      'newsletter_btn':   "S'ABONNER",
      'newsletter_ok':    '✓ Inscription confirmée !',
    },

  };

  var _lang = 'it';

  /* ─── Traduce una stringa ─── */
  function t(key) {
    return (LANG[_lang] && LANG[_lang][key]) || (LANG['it'] && LANG['it'][key]) || key;
  }

  /* ─── Applica traduzione al DOM ─── */
  function applyLang(lang) {
    _lang = lang;
    localStorage.setItem('sw_lang', lang);

    // Traduce elementi con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.dataset.i18n;
      el.textContent = t(key);
    });

    // Traduce placeholder
    document.querySelectorAll('[data-i18n-ph]').forEach(function(el) {
      el.placeholder = t(el.dataset.i18nPh);
    });

    // Aggiorna HTML lang
    document.documentElement.lang = lang;

    console.log('[SW-v13] Lingua impostata:', lang);
  }


  /* ═══════════════════════════════════════════════════════
     CSS v13
     ═══════════════════════════════════════════════════════ */
  function css13() {
    if (document.querySelector('#sw13-css')) return;
    var s = document.createElement('style');
    s.id = 'sw13-css';
    s.textContent = [

      /* ─ Lang buttons attivi ─ */
      '.lang-btn.sw13-active{',
        'color:#D4AF37!important;',
        'border-bottom:2px solid #D4AF37!important;',
        'opacity:1!important;}',

      /* ─ Newsletter box ─ */
      '#sw13-newsletter{',
        'margin:16px 12px;',
        'padding:18px 16px;',
        'background:linear-gradient(135deg,rgba(74,4,4,.25),rgba(10,7,5,.8));',
        'border:1px solid rgba(212,175,55,.25);',
        'border-radius:10px;text-align:center;}',
      '#sw13-newsletter h3{',
        'font-family:"Playfair Display",Georgia,serif;',
        'font-size:1rem;font-weight:700;color:#F5EFE2;margin:0 0 5px;}',
      '#sw13-newsletter p{',
        'font-size:12px;color:rgba(245,239,226,.45);',
        'line-height:1.6;margin:0 0 12px;}',
      '#sw13-nl-form{',
        'display:flex;gap:8px;max-width:400px;margin:0 auto;}',
      '#sw13-nl-email{',
        'flex:1;padding:9px 12px;',
        'background:rgba(255,255,255,.06);',
        'border:1px solid rgba(212,175,55,.25);',
        'border-radius:6px;color:#F5EFE2;font-size:14px;}',
      '#sw13-nl-btn{',
        'padding:9px 14px;',
        'background:rgba(212,175,55,.2);',
        'border:1px solid rgba(212,175,55,.4);',
        'border-radius:6px;color:#D4AF37;',
        'font-size:10px;font-weight:700;letter-spacing:2px;',
        'cursor:pointer;white-space:nowrap;transition:all .2s;}',
      '#sw13-nl-btn:hover{background:rgba(212,175,55,.35);}',
      '#sw13-nl-ok{color:#7dda8a;font-size:13px;display:none;}',

      /* ─ Piani Freemium ─ */
      '#sw13-plans{',
        'margin:16px 12px;',
        'display:grid;',
        'grid-template-columns:repeat(3,1fr);',
        'gap:8px;}',
      '@media(max-width:480px){#sw13-plans{grid-template-columns:1fr;}}',
      '.sw13-plan{',
        'padding:14px 10px;',
        'border-radius:10px;',
        'border:1px solid rgba(212,175,55,.2);',
        'text-align:center;',
        'cursor:pointer;transition:all .22s;',
        'background:rgba(255,255,255,.03);}',
      '.sw13-plan:hover{border-color:rgba(212,175,55,.45);transform:translateY(-2px);}',
      '.sw13-plan.sw13-recommended{',
        'border-color:rgba(212,175,55,.55);',
        'background:rgba(212,175,55,.08);}',
      '.sw13-plan-badge{',
        'font-size:8px;font-weight:700;letter-spacing:2px;',
        'text-transform:uppercase;color:rgba(212,175,55,.5);',
        'margin-bottom:6px;}',
      '.sw13-plan.sw13-recommended .sw13-plan-badge{color:#D4AF37;}',
      '.sw13-plan-ico{font-size:24px;margin-bottom:6px;}',
      '.sw13-plan-name{',
        'font-family:"Playfair Display",Georgia,serif;',
        'font-size:.9rem;font-weight:700;color:#F5EFE2;margin-bottom:4px;}',
      '.sw13-plan-price{',
        'font-size:1rem;font-weight:700;color:#D4AF37;margin-bottom:8px;}',
      '.sw13-plan-features{',
        'font-size:10px;color:rgba(245,239,226,.45);',
        'line-height:1.8;text-align:left;}',
      '.sw13-plan-btn{',
        'margin-top:10px;width:100%;',
        'padding:8px;border-radius:6px;',
        'background:rgba(212,175,55,.15);',
        'border:1px solid rgba(212,175,55,.3);',
        'color:#D4AF37;font-size:9px;',
        'font-weight:700;letter-spacing:1.5px;',
        'text-transform:uppercase;cursor:pointer;',
        'transition:all .2s;}',
      '.sw13-plan-btn:hover{background:rgba(212,175,55,.3);}',
      '.sw13-plan.sw13-recommended .sw13-plan-btn{',
        'background:rgba(212,175,55,.25);',
        'border-color:#D4AF37;}',

      /* ─ Badge Verificato ─ */
      '.sw13-verified{',
        'display:inline-flex;align-items:center;gap:4px;',
        'font-size:9px;font-weight:700;letter-spacing:1px;',
        'color:#D4AF37;',
        'background:rgba(212,175,55,.12);',
        'border:1px solid rgba(212,175,55,.3);',
        'border-radius:10px;padding:2px 7px;',
        'vertical-align:middle;margin-left:6px;}',

    ].join('');
    document.head.appendChild(s);
  }


  /* ═══════════════════════════════════════════════════════
     LINGUA — collega i bottoni IT/EN/FR già nel nav
     ═══════════════════════════════════════════════════════ */
  function setupLangButtons() {
    var saved = localStorage.getItem('sw_lang') || 'it';
    _lang = saved;

    // Bottoni IT/EN/FR già presenti nel nav
    document.querySelectorAll('[onclick*="setLang"], .lang-btn, [data-lang]').forEach(function(btn) {
      var lang = (btn.dataset.lang || btn.textContent.trim().toLowerCase()).substring(0, 2).toLowerCase();
      if (!lang || !['it','en','fr'].includes(lang)) return;

      // Sovrascrivi onclick
      btn.onclick = function() {
        document.querySelectorAll('[onclick*="setLang"], .lang-btn, [data-lang]').forEach(function(b) {
          b.classList.remove('sw13-active');
        });
        btn.classList.add('sw13-active');
        applyLang(lang);
      };

      if (lang === saved) btn.classList.add('sw13-active');
    });

    // Espone setLang globalmente (usato nell'HTML)
    window.setLang = function(lang) {
      if (['it','en','fr'].includes(lang)) applyLang(lang);
    };

    applyLang(saved);
  }


  /* ═══════════════════════════════════════════════════════
     NEWSLETTER
     ═══════════════════════════════════════════════════════ */
  function injectNewsletter() {
    if (document.querySelector('#sw13-newsletter')) return;
    var home = document.querySelector('#page-home .home-body');
    if (!home) return;

    var box = document.createElement('div');
    box.id = 'sw13-newsletter';
    box.innerHTML =
      '<h3 data-i18n="newsletter_title">' + t('newsletter_title') + '</h3>' +
      '<p data-i18n="newsletter_sub">' + t('newsletter_sub') + '</p>' +
      '<div id="sw13-nl-form">' +
        '<input id="sw13-nl-email" type="email" placeholder="la.tua@email.com">' +
        '<button id="sw13-nl-btn" onclick="SW13.nlSignup()" data-i18n="newsletter_btn">' + t('newsletter_btn') + '</button>' +
      '</div>' +
      '<div id="sw13-nl-ok" data-i18n="newsletter_ok">' + t('newsletter_ok') + '</div>';

    // Aggiunge dopo la sezione articoli o alla fine
    var blog = document.querySelector('#sw12-blog, #sw9-arts');
    if (blog && blog.nextSibling) home.insertBefore(box, blog.nextSibling);
    else home.appendChild(box);
  }

  function nlSignup() {
    var email = (document.querySelector('#sw13-nl-email')?.value || '').trim();
    if (!email || !email.includes('@')) return;

    // Salva in localStorage (in futuro si può mandare al server)
    var list = JSON.parse(localStorage.getItem('sw_newsletter') || '[]');
    if (!list.includes(email)) {
      list.push(email);
      localStorage.setItem('sw_newsletter', JSON.stringify(list));
    }

    // Tenta di inviare al server
    var SERVER = window._SW_SERVER || 'https://sommelier-server-production-8f92.up.railway.app';
    fetch(SERVER + '/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Newsletter',
        email: email,
        subject: 'Iscrizione Newsletter',
        message: 'Nuova iscrizione newsletter da: ' + email
      })
    }).catch(function(){});

    document.querySelector('#sw13-nl-form').style.display = 'none';
    document.querySelector('#sw13-nl-ok').style.display = 'block';
  }


  /* ═══════════════════════════════════════════════════════
     PIANI FREEMIUM — mostra nella pagina Produttori
     ═══════════════════════════════════════════════════════ */
  var PLANS = [
    {
      id: 'base',
      badge: 'GRATUITO',
      ico: '🌿',
      name: 'Base',
      price: '€0',
      recommended: false,
      features: [
        '✓ Profilo nella directory',
        '✓ Nome, indirizzo, 1 foto',
        '✓ Denominazione e vitigni',
        '✗ Link al sito web',
        '✗ Badge Verificato',
        '✗ Posizionamento prioritario',
      ],
      cta: 'Inizia Gratis',
    },
    {
      id: 'premium',
      badge: 'PIÙ POPOLARE',
      ico: '🥇',
      name: 'Premium',
      price: '€15/mese',
      recommended: true,
      features: [
        '✓ Tutto del piano Base',
        '✓ Link al sito/shop',
        '✓ Galleria foto (5 immagini)',
        '✓ Badge Verificato ✓',
        '✓ Posizione in alto',
        '✓ Statistiche visite',
      ],
      cta: 'Scegli Premium',
    },
    {
      id: 'elite',
      badge: 'MASSIMA VISIBILITÀ',
      ico: '👑',
      name: 'Elite',
      price: '€50/mese',
      recommended: false,
      features: [
        '✓ Tutto del piano Premium',
        '✓ Vetrina in Homepage',
        '✓ Intervista sul Magazine',
        '✓ Newsletter dedicata',
        '✓ QR Code personalizzato',
        '✓ Supporto prioritario',
      ],
      cta: 'Scegli Elite',
    },
  ];

  function injectPlans() {
    if (document.querySelector('#sw13-plans-wrap')) return;
    var prodPage = document.querySelector('#page-producers, #page-produttori');
    if (!prodPage) return;

    var wrap = document.createElement('div');
    wrap.id = 'sw13-plans-wrap';

    var hdr = document.createElement('div');
    hdr.style.cssText = 'padding:16px 14px 8px;';
    hdr.innerHTML =
      '<div style="font-size:8px;font-weight:700;letter-spacing:3px;color:rgba(212,175,55,.45);text-transform:uppercase;margin-bottom:5px;">💼 VISIBILITÀ</div>' +
      '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:1.05rem;color:#F5EFE2;">Scegli il tuo piano</div>' +
      '<div style="font-size:11px;color:rgba(245,239,226,.35);margin-top:4px;">Inizia gratis, passa a Premium quando vuoi.</div>';
    wrap.appendChild(hdr);

    var grid = document.createElement('div');
    grid.id = 'sw13-plans';

    PLANS.forEach(function(plan) {
      var card = document.createElement('div');
      card.className = 'sw13-plan' + (plan.recommended ? ' sw13-recommended' : '');
      card.innerHTML =
        '<div class="sw13-plan-badge">' + plan.badge + '</div>' +
        '<div class="sw13-plan-ico">' + plan.ico + '</div>' +
        '<div class="sw13-plan-name">' + plan.name + '</div>' +
        '<div class="sw13-plan-price">' + plan.price + '</div>' +
        '<div class="sw13-plan-features">' + plan.features.join('<br>') + '</div>' +
        '<button class="sw13-plan-btn" onclick="SW13.selectPlan(\'' + plan.id + '\')">' + plan.cta + '</button>';
      grid.appendChild(card);
    });

    wrap.appendChild(grid);

    // Info contatto sotto
    var info = document.createElement('div');
    info.style.cssText = 'text-align:center;padding:8px 14px 20px;font-size:11px;color:rgba(245,239,226,.3);';
    info.innerHTML = 'Per info e attivazione: <a href="mailto:info@sommelierworld.vin" style="color:rgba(212,175,55,.5);text-decoration:none;">info@sommelierworld.vin</a>';
    wrap.appendChild(info);

    prodPage.insertBefore(wrap, prodPage.firstChild);
  }

  function selectPlan(planId) {
    // Apre contatti con piano pre-selezionato
    var msg = {
      base:    'Vorrei registrare la mia cantina con il piano Base (gratuito).',
      premium: 'Sono interessato al piano Premium (€15/mese) per la mia cantina.',
      elite:   'Sono interessato al piano Elite (€50/mese) per la mia cantina.',
    }[planId] || '';

    if (window.SW11 && window.SW11.openContact) {
      window.SW11.openContact();
      setTimeout(function() {
        var fm = document.querySelector('#sw11-fm');
        var fs = document.querySelector('#sw11-fs');
        if (fm) fm.value = msg;
        if (fs) fs.value = 'Sono un produttore / cantina';
      }, 300);
    } else {
      window.location.href = 'mailto:info@sommelierworld.vin?subject=Piano ' + planId + '&body=' + encodeURIComponent(msg);
    }
  }


  /* ═══════════════════════════════════════════════════════
     BADGE VERIFICATO — aggiunge ai produttori premium
     ═══════════════════════════════════════════════════════ */
  function addVerifiedBadges() {
    // Lista produttori premium (si aggiorna aggiungendo ID qui)
    var PREMIUM_IDS = [];
    // Esempio: var PREMIUM_IDS = ['cantina-xyz', 'produttore-abc'];

    PREMIUM_IDS.forEach(function(id) {
      var el = document.querySelector('[data-producer-id="' + id + '"] .producer-name');
      if (el && !el.querySelector('.sw13-verified')) {
        el.innerHTML += '<span class="sw13-verified">✓ Verificato</span>';
      }
    });
  }


  /* ═══════════════════════════════════════════════════════
     API PUBBLICA
     ═══════════════════════════════════════════════════════ */
  window.SW13 = {
    setLang:    applyLang,
    nlSignup:   nlSignup,
    selectPlan: selectPlan,
  };


  /* ═══════════════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════════════ */
  function init() {
    console.log('[SW-v13] Patch v13 — Lang + Freemium + Newsletter — avvio');
    css13();
    setupLangButtons();

    var n = 0;
    function run() {
      injectNewsletter();
      injectPlans();
      addVerifiedBadges();
      if (++n < 20) setTimeout(run, 400);
      else console.log('[SW-v13] Init completato ✓');
    }

    document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', run)
      : run();
  }

  init();

})();
