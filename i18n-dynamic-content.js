/**
 * i18n-dynamic-content.js — Traduzione Contenuto Dinamico
 * Versione: 2.0 — 2026-05
 * 
 * Traduce TUTTO il contenuto dinamico in tempo reale:
 * - Articoli del carousel
 * - Descrizioni denominazioni/vini
 * - Badge e label dinamiche
 * - Qualsiasi testo generato runtime
 * 
 * Carica DOPO i18n-patch.js
 * 
 * Aggiunta in index.html (dopo i18n-patch.js):
 *   <script src="i18n-dynamic-content.js"></script>
 */
(function() {
  'use strict';

  /* ═══════════════════════════════════════════════════════════
     DIZIONARIO UI DINAMICO
     ═══════════════════════════════════════════════════════════ */
  var DYNAMIC_UI = {
    it: {
      selezEditorialeBadge: 'SELEZIONE EDITORIALE',
      bottigliaEvidenza: 'BOTTIGLIA IN EVIDENZA',
      altriArticoli: 'ALTRI ARTICOLI →',
      leggiArticolo: 'LEGGI ARTICOLO',
      scopriDenominazione: 'SCOPRI LA DENOMINAZIONE',
      apriScheda: 'APRI SCHEDA',
      caratteristiche: 'CARATTERISTICHE',
      abbinamenti: 'ABBINAMENTI SUGGERITI',
      temperatura: 'TEMPERATURA DI SERVIZIO',
      bicchiere: 'BICCHIERE CONSIGLIATO',
      vitigni: 'VITIGNI PRINCIPALI',
      produzione: 'ZONA DI PRODUZIONE',
      disciplinare: 'DISCIPLINARE',
      noteWine: 'Note sul vino',
      storiaWine: 'Storia della denominazione',
      carattereWine: 'Carattere organolettico',
    },
    en: {
      selezEditorialeBadge: 'EDITORIAL SELECTION',
      bottigliaEvidenza: 'FEATURED BOTTLE',
      altriArticoli: 'MORE ARTICLES →',
      leggiArticolo: 'READ ARTICLE',
      scopriDenominazione: 'DISCOVER THE APPELLATION',
      apriScheda: 'OPEN PROFILE',
      caratteristiche: 'CHARACTERISTICS',
      abbinamenti: 'SUGGESTED PAIRINGS',
      temperatura: 'SERVING TEMPERATURE',
      bicchiere: 'RECOMMENDED GLASS',
      vitigni: 'MAIN GRAPES',
      produzione: 'PRODUCTION AREA',
      disciplinare: 'REGULATIONS',
      noteWine: 'Wine notes',
      storiaWine: 'Appellation history',
      carattereWine: 'Organoleptic profile',
    },
    fr: {
      selezEditorialeBadge: 'SÉLECTION ÉDITORIALE',
      bottigliaEvidenza: 'BOUTEILLE VEDETTE',
      altriArticoli: 'PLUS D\'ARTICLES →',
      leggiArticolo: 'LIRE L\'ARTICLE',
      scopriDenominazione: 'DÉCOUVRIR L\'APPELLATION',
      apriScheda: 'OUVRIR LA FICHE',
      caratteristiche: 'CARACTÉRISTIQUES',
      abbinamenti: 'ACCORDS SUGGÉRÉS',
      temperatura: 'TEMPÉRATURE DE SERVICE',
      bicchiere: 'VERRE RECOMMANDÉ',
      vitigni: 'CÉPAGES PRINCIPAUX',
      produzione: 'ZONE DE PRODUCTION',
      disciplinare: 'RÉGLEMENTATION',
      noteWine: 'Notes sur le vin',
      storiaWine: 'Histoire de l\'appellation',
      carattereWine: 'Profil organoleptique',
    },
    ru: {
      selezEditorialeBadge: 'РЕДАКЦИОННЫЙ ВЫБОР',
      bottigliaEvidenza: 'ИЗБРАННАЯ БУТЫЛКА',
      altriArticoli: 'ЕЩЁ СТАТЬИ →',
      leggiArticolo: 'ЧИТАТЬ СТАТЬЮ',
      scopriDenominazione: 'УЗНАТЬ ОБ АПЕЛЛАСЬОНЕ',
      apriScheda: 'ОТКРЫТЬ ПРОФИЛЬ',
      caratteristiche: 'ХАРАКТЕРИСТИКИ',
      abbinamenti: 'РЕКОМЕНДУЕМЫЕ СОЧЕТАНИЯ',
      temperatura: 'ТЕМПЕРАТУРА ПОДАЧИ',
      bicchiere: 'РЕКОМЕНДУЕМЫЙ БОКАЛ',
      vitigni: 'ОСНОВНЫЕ СОРТА',
      produzione: 'ЗОНА ПРОИЗВОДСТВА',
      disciplinare: 'РЕГЛАМЕНТ',
      noteWine: 'Заметки о вине',
      storiaWine: 'История апелласьона',
      carattereWine: 'Органолептический профиль',
    },
  };

  /* Merge nel dict principale */
  function mergeDynamicUI() {
    if (!window.i18n || !window.i18n.dict) return;
    ['it','en','fr','ru'].forEach(function(lang) {
      var target = window.i18n.dict[lang];
      var source = DYNAMIC_UI[lang] || {};
      if (!target) return;
      for (var k in source) {
        if (!target[k]) target[k] = source[k];
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════
     TRADUZIONE BADGE/LABEL DINAMICHE
     ═══════════════════════════════════════════════════════════ */
  function translateDynamicLabels() {
    var lang = (window.i18n && window.i18n.current) || 'it';
    var dict = (window.i18n && window.i18n.dict[lang]) || {};

    function t(k) {
      return dict[k] || (DYNAMIC_UI[lang] && DYNAMIC_UI[lang][k]) || k;
    }

    /* Badge "SELEZIONE EDITORIALE" */
    var badges = document.querySelectorAll('[style*="SELEZIONE EDITORIALE"]');
    badges.forEach(function(el) {
      if (el.textContent.includes('SELEZIONE EDITORIALE')) {
        el.textContent = t('selezEditorialeBadge');
      }
    });

    /* homeNewsPromoKicker */
    var promoKicker = document.getElementById('homeNewsPromoKicker');
    if (promoKicker && promoKicker.textContent === 'SELEZIONE EDITORIALE') {
      promoKicker.textContent = t('selezEditorialeBadge');
    }

    /* homeBottleBadge */
    var bottleBadge = document.getElementById('homeBottleBadge');
    if (bottleBadge && bottleBadge.textContent === 'SELEZIONE EDITORIALE') {
      bottleBadge.textContent = t('selezEditorialeBadge');
    }

    /* homeBottleKicker */
    var bottleKicker = document.getElementById('homeBottleKicker');
    if (bottleKicker && bottleKicker.textContent === 'BOTTIGLIA IN EVIDENZA') {
      bottleKicker.textContent = t('bottigliaEvidenza');
    }

    /* Link "ALTRI ARTICOLI" */
    var moreLinks = document.querySelectorAll('a[onclick*="showPage"]');
    moreLinks.forEach(function(a) {
      if (a.textContent.includes('ALTRI ARTICOLI') || 
          a.textContent.includes('MORE ARTICLES') ||
          a.textContent.includes('PLUS D\'ARTICLES') ||
          a.textContent.includes('ЕЩЁ СТАТЬИ')) {
        a.textContent = t('altriArticoli');
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════
     FORZA RITRADUZIONE ARTICOLI AL CAMBIO LINGUA
     ═══════════════════════════════════════════════════════════ */
  function forceArticleRetranslation() {
    var lang = (window.i18n && window.i18n.current) || 'it';
    
    /* Se siamo in IT, niente da fare — contenuto originale */
    if (lang === 'it') {
      /* Ricarica articoli originali */
      if (typeof window.renderSlides === 'function') {
        window.renderSlides();
      }
      return;
    }

    /* Per altre lingue: applica cache esistente e richiedi nuove traduzioni */
    if (window._arts && window._trCache) {
      window._arts.forEach(function(art) {
        /* Applica cache se esiste */
        window._trCache.applyToArt(art, lang);
      });
      /* Rendering immediato con cache */
      if (typeof window.renderSlides === 'function') {
        window.renderSlides();
      }
    }

    /* Traduci articoli mancanti in background */
    setTimeout(function() {
      if (typeof window.translateAndRefresh === 'function') {
        window.translateAndRefresh(lang);
      }
    }, 200);
  }

  /* ═══════════════════════════════════════════════════════════
     TRADUZIONE DENOMINAZIONI
     ═══════════════════════════════════════════════════════════
     
     Le denominazioni utilizzano il sistema di traduzione esistente
     dell'app (translateAndRefresh) che gestisce già la cache e l'API.
     Non serve duplicare la logica qui.
     ═══════════════════════════════════════════════════════════ */

  /* ═══════════════════════════════════════════════════════════
     HOOK SETLANG PER REFRESH COMPLETO
     ═══════════════════════════════════════════════════════════ */
  function enhanceSetLang() {
    if (!window.setLang || window.__dynContentHooked) return;
    window.__dynContentHooked = true;

    var _origSetLang = window.setLang;
    window.setLang = function(lang) {
      /* Chiama originale */
      _origSetLang(lang);

      /* Refresh completo contenuti dinamici */
      setTimeout(function() {
        translateDynamicLabels();
        forceArticleRetranslation();
      }, 100);
    };
  }

  /* ═══════════════════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════════════════ */
  function init() {
    if (!window.i18n || !window.i18n.dict) {
      setTimeout(init, 80);
      return;
    }

    /* 1. Merge dict */
    mergeDynamicUI();

    /* 2. Hook funzioni */
    enhanceSetLang();

    /* 3. Applica subito */
    translateDynamicLabels();
    forceArticleRetranslation();

    /* 4. Reapplica dopo caricamenti */
    setTimeout(translateDynamicLabels, 800);
    setTimeout(forceArticleRetranslation, 1200);
  }

  /* Avvia */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Reapplica anche su load completo */
  window.addEventListener('load', function() {
    setTimeout(function() {
      translateDynamicLabels();
      forceArticleRetranslation();
    }, 500);
  });

})();
