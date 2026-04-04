/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SOMMELIER WORLD · PATCH v17                                    ║
 * ║                                                                  ║
 * ║  ✓ Traduzioni IT/EN/FR complete — tutto il sito                ║
 * ║  ✓ Articoli multilingua da articles.json                       ║
 * ║  ✓ Estensione dizionario i18n esistente                        ║
 * ║  ✓ Traduzioni dinamiche ai patch v11-v16                       ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════
     ESTENSIONE DIZIONARIO i18n
     Aggiunge le chiavi mancanti al sistema già esistente
     ═══════════════════════════════════════════════════════ */
  var EXTRA = {
    it: {
      /* Contatti */
      contactTitle:     'Contatti',
      contactHero:      'Come possiamo aiutarti?',
      contactSub:       'Produttori, collaborazioni, segnalazioni.\nRisponderemo entro 48 ore.',
      contactName:      'NOME *',
      contactEmail:     'EMAIL *',
      contactSubject:   'ARGOMENTO',
      contactMsg:       'MESSAGGIO *',
      contactSend:      '✦ INVIA MESSAGGIO ✦',
      contactSending:   '⏳ Invio…',
      contactOk:        '✓ Messaggio inviato! Ti risponderemo presto.',
      contactDirect:    'Oppure scrivi direttamente a',
      /* Argomenti contatto */
      cSubProducer:     '🏭 Sono un produttore / cantina',
      cSubSommelier:    '🥂 Collaborazione sommelier',
      cSubError:        '🛠 Segnalazione errore',
      cSubPartner:      '🤝 Partnership',
      cSubOther:        '💬 Altro',
      /* Blog / Magazine */
      blogTitle:        'Articoli & Approfondimenti',
      blogTag:          '✍️ MAGAZINE',
      readMore:         'Leggi →',
      backToMag:        '← Torna al Magazine',
      /* Terroir nuovo */
      terroirSelectCountry: '🌍 Seleziona il Paese',
      terroirSelectRegion:  '📍 Seleziona la Regione',
      terroirDenominations: '🍷 Denominazioni',
      terroirAllCountries:  '🌍 Tutti i paesi',
      /* Sommelier */
      somPlaceholder:   'Scrivi i piatti del tuo menu (uno per riga)…',
      somAcidity:       'ACIDITÀ',
      somSoftness:      'MORBIDEZZA',
      somSalinity:      'SAPIDITÀ',
      somBody:          'STRUTTURA',
      somOrigin:        'ORIGINE PREFERITA',
      somAnyCountry:    'Qualsiasi paese',
      somAnyRegion:     'Qualsiasi regione',
      somConsult:       '✦ CONSULTA IL SOMMELIER ✦',
      somThinking:      'Il Sommelier sta meditando…',
      /* Piani produttori */
      planFree:         'Base — Gratuito',
      planPremium:      'Premium — €15/mese',
      planElite:        'Elite — €50/mese',
      planChoose:       'Scegli il tuo piano',
      planSubtitle:     'Inizia gratis, passa a Premium quando vuoi.',
      /* Newsletter */
      nlTitle:          'Ricevi le novità del vino',
      nlSub:            'Una volta a settimana: scoperte, denominazioni rare, guide.',
      nlBtn:            'ISCRIVITI',
      nlOk:             '✓ Iscrizione confermata!',
      nlPlaceholder:    'la.tua@email.com',
      /* Errori AI */
      aiQuota:          '⏱ Limite API raggiunto — riprova tra qualche ora',
      ai429:            '⏱ Troppe richieste — aspetta 30 secondi e riprova',
      aiKeyError:       '🔑 Chiave API non valida — controlla Railway',
      aiNetError:       '📡 Server non raggiungibile — cold start ~30s',
      aiRetry:          '↺ Riprova',
      aiNotResponding:  'Il sommelier non risponde',
      aiWillReturn:     'Il sommelier tornerà presto operativo',
    },

    en: {
      contactTitle:     'Contact',
      contactHero:      'How can we help you?',
      contactSub:       'Producers, collaborations, reports.\nWe will reply within 48 hours.',
      contactName:      'NAME *',
      contactEmail:     'EMAIL *',
      contactSubject:   'SUBJECT',
      contactMsg:       'MESSAGE *',
      contactSend:      '✦ SEND MESSAGE ✦',
      contactSending:   '⏳ Sending…',
      contactOk:        '✓ Message sent! We will reply soon.',
      contactDirect:    'Or write directly to',
      cSubProducer:     '🏭 I am a producer / winery',
      cSubSommelier:    '🥂 Sommelier collaboration',
      cSubError:        '🛠 Report an error',
      cSubPartner:      '🤝 Partnership',
      cSubOther:        '💬 Other',
      blogTitle:        'Articles & In-Depth Guides',
      blogTag:          '✍️ MAGAZINE',
      readMore:         'Read →',
      backToMag:        '← Back to Magazine',
      terroirSelectCountry: '🌍 Select Country',
      terroirSelectRegion:  '📍 Select Region',
      terroirDenominations: '🍷 Appellations',
      terroirAllCountries:  '🌍 All countries',
      somPlaceholder:   'Write your menu dishes (one per line)…',
      somAcidity:       'ACIDITY',
      somSoftness:      'SOFTNESS',
      somSalinity:      'SALINITY',
      somBody:          'BODY',
      somOrigin:        'PREFERRED ORIGIN',
      somAnyCountry:    'Any country',
      somAnyRegion:     'Any region',
      somConsult:       '✦ ASK THE SOMMELIER ✦',
      somThinking:      'The Sommelier is contemplating…',
      planFree:         'Base — Free',
      planPremium:      'Premium — €15/month',
      planElite:        'Elite — €50/month',
      planChoose:       'Choose your plan',
      planSubtitle:     'Start free, upgrade to Premium when you\'re ready.',
      nlTitle:          'Get the latest wine news',
      nlSub:            'Once a week: discoveries, rare appellations, guides.',
      nlBtn:            'SUBSCRIBE',
      nlOk:             '✓ Subscription confirmed!',
      nlPlaceholder:    'your@email.com',
      aiQuota:          '⏱ API limit reached — try again in a few hours',
      ai429:            '⏱ Too many requests — wait 30 seconds and retry',
      aiKeyError:       '🔑 Invalid API key — check Railway',
      aiNetError:       '📡 Server unreachable — cold start ~30s',
      aiRetry:          '↺ Retry',
      aiNotResponding:  'The sommelier is not responding',
      aiWillReturn:     'The sommelier will be back soon',
    },

    fr: {
      contactTitle:     'Contact',
      contactHero:      'Comment pouvons-nous vous aider ?',
      contactSub:       'Producteurs, collaborations, signalements.\nNous répondrons sous 48 heures.',
      contactName:      'NOM *',
      contactEmail:     'EMAIL *',
      contactSubject:   'SUJET',
      contactMsg:       'MESSAGE *',
      contactSend:      '✦ ENVOYER LE MESSAGE ✦',
      contactSending:   '⏳ Envoi…',
      contactOk:        '✓ Message envoyé ! Nous vous répondrons bientôt.',
      contactDirect:    'Ou écrivez directement à',
      cSubProducer:     '🏭 Je suis un producteur / domaine',
      cSubSommelier:    '🥂 Collaboration sommelier',
      cSubError:        '🛠 Signaler une erreur',
      cSubPartner:      '🤝 Partenariat',
      cSubOther:        '💬 Autre',
      blogTitle:        'Articles & Approfondissements',
      blogTag:          '✍️ MAGAZINE',
      readMore:         'Lire →',
      backToMag:        '← Retour au Magazine',
      terroirSelectCountry: '🌍 Sélectionner le Pays',
      terroirSelectRegion:  '📍 Sélectionner la Région',
      terroirDenominations: '🍷 Appellations',
      terroirAllCountries:  '🌍 Tous les pays',
      somPlaceholder:   'Écrivez les plats de votre menu (un par ligne)…',
      somAcidity:       'ACIDITÉ',
      somSoftness:      'SOUPLESSE',
      somSalinity:      'SALINITÉ',
      somBody:          'CORPS',
      somOrigin:        'ORIGINE PRÉFÉRÉE',
      somAnyCountry:    'Tout pays',
      somAnyRegion:     'Toute région',
      somConsult:       '✦ CONSULTER LE SOMMELIER ✦',
      somThinking:      'Le Sommelier médite…',
      planFree:         'Base — Gratuit',
      planPremium:      'Premium — 15€/mois',
      planElite:        'Elite — 50€/mois',
      planChoose:       'Choisissez votre formule',
      planSubtitle:     'Commencez gratuitement, passez à Premium quand vous voulez.',
      nlTitle:          'Recevez les actualités du vin',
      nlSub:            'Une fois par semaine : découvertes, appellations rares, guides.',
      nlBtn:            'S\'ABONNER',
      nlOk:             '✓ Inscription confirmée !',
      nlPlaceholder:    'votre@email.com',
      aiQuota:          '⏱ Limite API atteinte — réessayez dans quelques heures',
      ai429:            '⏱ Trop de requêtes — attendez 30 secondes et réessayez',
      aiKeyError:       '🔑 Clé API invalide — vérifiez Railway',
      aiNetError:       '📡 Serveur injoignable — cold start ~30s',
      aiRetry:          '↺ Réessayer',
      aiNotResponding:  'Le sommelier ne répond pas',
      aiWillReturn:     'Le sommelier sera bientôt de retour',
    }
  };

  /* Merge nel dizionario i18n esistente */
  function mergeDict() {
    if (!window.i18n || !window.i18n.dict) {
      setTimeout(mergeDict, 300);
      return;
    }
    ['it','en','fr'].forEach(function(lang) {
      window.i18n.dict[lang] = Object.assign(
        window.i18n.dict[lang] || {},
        EXTRA[lang]
      );
    });
    console.log('[SW-v17] Dizionario esteso ✓');

    // Applica subito
    applyTranslations();

    // Intercetta setLang per applicare le nuove traduzioni
    var _orig = window.i18n.setLang.bind(window.i18n);
    window.i18n.setLang = function(lang) {
      _orig(lang);
      setTimeout(applyTranslations, 100);
      setTimeout(function() { loadArticlesMultilang(lang); }, 200);
    };
  }

  /* Traduzione rapida */
  function t(key) {
    if (!window.i18n) return key;
    return window.i18n.t(key);
  }

  function lang() {
    return (window.i18n && window.i18n.current) || 'it';
  }


  /* ═══════════════════════════════════════════════════════
     APPLICA TRADUZIONI AL DOM
     ═══════════════════════════════════════════════════════ */
  function applyTranslations() {
    var l = lang();

    /* ── Nav labels aggiuntive ── */
    var navMap = {
      'home':      'home',
      'events':    'events',
      'explore':   'terroir',
      'sommelier': 'sommelier',
      'producers': 'producers',
    };
    document.querySelectorAll('.ntab[data-page]').forEach(function(tab) {
      var pg  = tab.dataset.page;
      var lbl = tab.querySelector('.lbl');
      if (lbl && navMap[pg] && window.i18n) {
        lbl.textContent = window.i18n.t(navMap[pg]);
      }
    });

    /* ── Bottone sommelier ── */
    translateEl('.cta-btn[onclick*="doAbbinamento"]', t('somConsult'));

    /* ── Placeholder sommelier ── */
    translatePlaceholder('#menuInput', t('somPlaceholder'));
    translatePlaceholder('#foodInput', t('somPlaceholder'));

    /* ── Slider labels ── */
    translateSlider('acidita',    t('somAcidity'));
    translateSlider('morbidezza', t('somSoftness'));
    translateSlider('sapidita',   t('somSalinity'));
    translateSlider('struttura',  t('somBody'));

    /* ── Origine preferita ── */
    translateContaining('.wine-slider-row + *', 'ORIGINE', t('somOrigin'));
    translateOption('[id*="paese"] option:first-child, [id*="country"] option:first-child', t('somAnyCountry'));
    translateOption('[id*="regione"] option:first-child, [id*="region"] option:first-child', t('somAnyRegion'));

    /* ── Blog / Magazine ── */
    translateEl('#sw12-blog .sw12-blog-title', t('blogTitle'));
    translateEl('#sw12-blog .sw12-blog-tag',   t('blogTag'));

    /* ── Terroir nuovo (sw12) ── */
    translateEl('#sw12-step-paesi .sw12-step-hdr', t('terroirSelectCountry'));
    translateEl('#sw12-step-regioni .sw12-step-hdr', t('terroirSelectRegion'));
    translateEl('#sw12-step-dens .sw12-step-hdr', t('terroirDenominations'));

    /* ── Newsletter ── */
    translateEl('#sw13-newsletter h3', t('nlTitle'));
    translateEl('#sw13-newsletter p',  t('nlSub'));
    translateEl('#sw13-nl-btn',        t('nlBtn'));
    translatePlaceholder('#sw13-nl-email', t('nlPlaceholder'));

    /* ── Piani produttori ── */
    translateEl('#sw13-plans-wrap > div:first-child > div:last-child', t('planSubtitle'));
    translatePlan('base',    t('planFree'));
    translatePlan('premium', t('planPremium'));
    translatePlan('elite',   t('planElite'));

    /* ── Contatti modal sw16 ── */
    translateEl('#sw16-contact-modal #sw16-send', t('contactSend'));
    translateEl('.sw16-contact-title',            t('contactTitle'));

    /* ── Bottoni lingua — active state ── */
    ['it','en','fr'].forEach(function(code) {
      var btn = document.querySelector('#langBtn_' + code);
      if (btn) {
        btn.style.background = (code === l) ? 'rgba(191,155,74,.2)' : 'none';
        btn.style.color      = (code === l) ? 'var(--oro)' : 'rgba(191,155,74,.45)';
      }
    });
  }

  /* Helpers */
  function translateEl(sel, text) {
    var el = document.querySelector(sel);
    if (el && text) el.textContent = text;
  }

  function translatePlaceholder(sel, text) {
    var el = document.querySelector(sel);
    if (el && text) el.placeholder = text;
  }

  function translateOption(sel, text) {
    document.querySelectorAll(sel).forEach(function(el) {
      if (el && text) el.textContent = text;
    });
  }

  function translateSlider(id, label) {
    var row = document.querySelector('[id="' + id + '"]');
    if (!row) return;
    var lbl = row.closest('.wine-slider-row');
    if (!lbl) return;
    var span = lbl.querySelector('.wine-slider-label');
    if (!span) return;
    // Conserva il bottone ?
    var qBtn = span.querySelector('button');
    span.childNodes.forEach(function(n) {
      if (n.nodeType === 3) n.textContent = label;
    });
    if (!qBtn) span.firstChild.textContent = label;
  }

  function translateContaining(sel, contains, text) {
    document.querySelectorAll(sel).forEach(function(el) {
      if (el.textContent.includes(contains)) el.textContent = text;
    });
  }

  function translatePlan(id, text) {
    var el = document.querySelector('.sw13-plan[data-plan="' + id + '"] .sw13-plan-name');
    if (el) el.textContent = text;
  }


  /* ═══════════════════════════════════════════════════════
     ARTICOLI MULTILINGUA
     ═══════════════════════════════════════════════════════ */
  var _articlesData = null;

  function loadArticlesMultilang(targetLang) {
    targetLang = targetLang || lang();

    fetch('./articles.json?v=' + Date.now())
      .then(function(r) { return r.json(); })
      .then(function(data) {
        _articlesData = data;
        renderArticlesForLang(targetLang);
      })
      .catch(function() {
        console.warn('[SW-v17] articles.json non trovato');
      });
  }

  function renderArticlesForLang(l) {
    if (!_articlesData) return;

    var blog = document.querySelector('#sw12-blog');
    if (!blog) return;

    // Rimuovi le card esistenti
    blog.querySelectorAll('.sw12-article-card').forEach(function(c) { c.remove(); });

    _articlesData.forEach(function(art) {
      var version = art[l] || art['it'] || {};
      var card = document.createElement('div');
      card.className = 'sw12-article-card';
      card.innerHTML =
        '<img class="sw12-art-img" src="' + (art.immagine || '') + '" loading="lazy" alt="">' +
        '<div class="sw12-art-body">' +
          '<div class="sw12-art-cat">' + (version.categoria || '') + '</div>' +
          '<div class="sw12-art-title">' + (version.titolo || '') + '</div>' +
          '<div class="sw12-art-meta">' +
            (art.data || '') + (art.autore ? ' · ' + art.autore : '') +
          '</div>' +
        '</div>';
      card.addEventListener('click', function() {
        openArticleMultilang(art, l);
      });
      blog.appendChild(card);
    });
  }

  function openArticleMultilang(art, l) {
    l = l || lang();
    var version = art[l] || art['it'] || {};

    var modal = document.querySelector('#sw12-art-modal');
    if (!modal) return;

    var cat   = modal.querySelector('#sw12-am-cat');
    var img   = modal.querySelector('#sw12-am-img');
    var title = modal.querySelector('#sw12-am-title');
    var meta  = modal.querySelector('#sw12-am-meta');
    var text  = modal.querySelector('#sw12-am-text');
    var back  = modal.querySelector('#sw12-am-back div');

    if (cat)   cat.textContent   = version.categoria || '';
    if (img)   img.src            = art.immagine || '';
    if (title) title.textContent  = version.titolo || '';
    if (meta)  meta.textContent   = (art.data || '') + (art.autore ? '  ·  ' + art.autore : '');
    if (text)  text.textContent   = version.testo || '';
    if (back)  back.textContent   = t('backToMag') || '←';

    modal.style.display = 'block';
    modal.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }

  /* Esponi per sw12 */
  window.SW17 = {
    openArticle: openArticleMultilang,
    applyTranslations: applyTranslations,
  };


  /* ═══════════════════════════════════════════════════════
     INTERCETTA CLICK ARTICOLI sw12 PER USARE MULTILINGUA
     ═══════════════════════════════════════════════════════ */
  function patchArticleClicks() {
    // Osserva quando sw12 crea le card
    var observer = new MutationObserver(function() {
      if (!_articlesData) return;
      document.querySelectorAll('.sw12-article-card:not([data-v17])').forEach(function(card) {
        card.dataset.v17 = '1';
        // Trova l'articolo corrispondente per titolo
        var titleEl = card.querySelector('.sw12-art-title');
        if (!titleEl) return;
        var cardTitle = titleEl.textContent;
        var match = _articlesData.find(function(a) {
          return Object.values(a).some(function(v) {
            return v && v.titolo === cardTitle;
          });
        });
        if (match) {
          // Sostituisci il click handler
          var clone = card.cloneNode(true);
          clone.dataset.v17 = '1';
          clone.addEventListener('click', function() {
            openArticleMultilang(match, lang());
          });
          card.parentNode.replaceChild(clone, card);
        }
      });
    });
    var blog = document.querySelector('#sw12-blog');
    if (blog) observer.observe(blog, { childList: true });
  }


  /* ═══════════════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════════════ */
  function init() {
    console.log('[SW-v17] Patch v17 — Traduzioni complete + Articoli multilingua');

    // Aspetta il sistema i18n
    mergeDict();

    // Carica articoli multilingua
    setTimeout(function() {
      loadArticlesMultilang(lang());
      patchArticleClicks();
    }, 800);

    // Riapplica quando cambiano le pagine
    var n = 0;
    var run = setInterval(function() {
      applyTranslations();
      if (++n >= 15) clearInterval(run);
    }, 600);
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();

})();
