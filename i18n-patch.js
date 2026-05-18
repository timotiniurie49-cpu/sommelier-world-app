/**
 * i18n-patch.js — SommelierWorld Complete Translation Patch
 * Versione: 1.0 — 2026-05
 *
 * Carica DOPO navigation.js.
 * Estende window.i18n con le chiavi mancanti e copre TUTTE le pagine:
 * Home, Sommelier, Terroir, Boutique, Eventi, Privacy, Termini,
 * ArticleReader, CollectionReader, ManifestoPanel.
 *
 * Aggiunta in index.html (prima di </body>):
 *   <script src="i18n-patch.js"></script>
 */
(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════
     DIZIONARIO COMPLETO — tutte le chiavi mancanti per lingua
     ═══════════════════════════════════════════════════════════ */
  var PATCH = {

    /* ── ITALIANO ── */
    it: {
      /* Bottoni universali */
      back: '← INDIETRO',
      backCollection: '← TORNA ALLA COLLECTION',
      backManifesto: '← TORNA ALLA COLLECTION',

      /* Reader */
      readerBack: '← INDIETRO',
      privateCollTag: 'PRIVATE COLLECTION',
      exclusiveTag: 'ESCLUSIVA SOMMELIERWORLD',

      /* Pagina Eventi */
      evKicker: '✦ AGENDA INTERNAZIONALE ✦',
      evTitle: 'Eventi del Vino 2026',
      evSub: 'Fiere · Aste · Festival · Degustazioni nel mondo',
      evFilterAll: '🌍 Tutti',
      evFilterIT: '🇮🇹 Italia',
      evFilterFR: '🇫🇷 Francia',
      evFilterUS: '🇺🇸 USA',
      evFilterIntl: '✈️ Internazionale',
      evOpenLink: 'SITO UFFICIALE →',
      evClose: 'CHIUDI',

      /* Pagina Boutique / Produttori */
      prodKicker: '✦ BOUTIQUE VINO ✦',
      prodLead: 'Per ora SommelierWorld non vende con un proprio magazzino. Questa pagina diventa una boutique curatoriale: orienta la scelta, apre partner esterni e tiene i progetti proprietari fuori dalla vetrina finché non saranno davvero pronti.',
      prodWhereBuy: 'DOVE COMPRARE',
      prodWhereSub: 'Una vetrina credibile, prima delle affiliazioni',
      prodBackHome: 'TORNA ALLA HOME',
      prodPriority: 'PRIORITÀ',
      prodVerify: 'VERIFY',
      prodTannicoTitle: 'Partner di partenza consigliato',
      prodTannicoDesc: 'La scelta più coerente per avviare la Boutique: percezione premium, ricerca semplice e struttura ideale da trasformare poi in affiliazione reale.',
      prodBernabeiTitle: 'Canale secondario da confermare',
      prodBernabeiDesc: 'Molto interessante per ampiezza catalogo e ricerca, ma trattato come partner in osservazione finché non si ottiene conferma business o partnership.',
      metricPartner: 'Partner',
      metricPartnerSub: 'ACCESSO ESTERNO SELEZIONATO',
      metricSearch: 'Ricerca',
      metricSearchSub: 'VINO, PREZZO, DISPONIBILITÀ',
      metricTransp: 'Trasparenza',
      metricTranspSub: 'NESSUN FALSO STOCK INTERNO',

      /* Privacy */
      privacyTitle: 'PRIVACY POLICY',
      privacyDate: 'Ultimo aggiornamento: Aprile 2026',
      privacyHTML: '<h3>1. Titolare del trattamento</h3><p>Sommelier World è un progetto editoriale indipendente. Contatti: info@sommelierworld.vin</p><h3>2. Dati raccolti</h3><p>Il sito raccoglie esclusivamente i dati inseriti volontariamente nel modulo produttori (nome cantina, email). Nessun dato di navigazione viene tracciato o venduto.</p><h3>3. Cookie e localStorage</h3><p>Utilizziamo localStorage per preferenze locali (lingua, cache articoli). I dati rimangono sul dispositivo dell\'utente e non vengono trasmessi a server esterni.</p><h3>4. Servizi terzi</h3><p>Groq API (elaborazione AI), CartoDB (tiles mappa). Nessuno di questi servizi riceve dati personali degli utenti finali.</p><h3>5. Diritti GDPR</h3><p>Hai diritto di accesso, rettifica e cancellazione dei tuoi dati. Contattaci a info@sommelierworld.vin</p>',

      /* Termini */
      termsTitle: 'TERMINI DI SERVIZIO',
      termsDate: 'Ultimo aggiornamento: Aprile 2026',
      termsHTML: '<h3>1. Descrizione del servizio</h3><p>Sommelier World è una piattaforma enciclopedica dedicata al mondo del vino. I contenuti sono generati con il supporto dell\'intelligenza artificiale a scopo informativo e didattico.</p><h3>2. Limitazione di responsabilità</h3><p>I consigli del Sommelier AI non costituiscono consulenza professionale enologica o commerciale. Per decisioni d\'acquisto, verifica sempre fonti ufficiali e produttori certificati.</p><h3>3. Proprietà intellettuale</h3><p>Il codice, il design e i contenuti originali di Sommelier World sono protetti. Le denominazioni vitivinicole citate sono di dominio pubblico.</p><h3>4. Legge applicabile</h3><p>I presenti termini sono regolati dalla legge italiana. Per qualsiasi controversia è competente il Foro del domicilio del gestore.</p>',
    },

    /* ── ENGLISH ── */
    en: {
      back: '← BACK',
      backCollection: '← BACK TO COLLECTION',
      backManifesto: '← BACK TO COLLECTION',
      readerBack: '← BACK',
      privateCollTag: 'PRIVATE COLLECTION',
      exclusiveTag: 'SOMMELIERWORLD EXCLUSIVE',

      evKicker: '✦ INTERNATIONAL AGENDA ✦',
      evTitle: 'Wine Events 2026',
      evSub: 'Fairs · Auctions · Festivals · Tastings worldwide',
      evFilterAll: '🌍 All',
      evFilterIT: '🇮🇹 Italy',
      evFilterFR: '🇫🇷 France',
      evFilterUS: '🇺🇸 USA',
      evFilterIntl: '✈️ International',
      evOpenLink: 'OFFICIAL WEBSITE →',
      evClose: 'CLOSE',

      prodKicker: '✦ WINE BOUTIQUE ✦',
      prodLead: 'SommelierWorld currently does not hold its own wine stock. This page acts as a curatorial boutique: it guides your choice, opens external partner platforms and keeps proprietary projects off the shelf until they are truly ready.',
      prodWhereBuy: 'WHERE TO BUY',
      prodWhereSub: 'A credible showcase, ahead of affiliations',
      prodBackHome: 'BACK TO HOME',
      prodPriority: 'PRIORITY',
      prodVerify: 'VERIFY',
      prodTannicoTitle: 'Recommended starting partner',
      prodTannicoDesc: 'The most coherent choice to launch the Boutique: premium perception, simple search and an ideal structure to later convert into a real affiliate relationship.',
      prodBernabeiTitle: 'Secondary channel to confirm',
      prodBernabeiDesc: 'Very interesting for catalogue breadth and search quality, but treated as a partner under observation until business confirmation is obtained.',
      metricPartner: 'Partners',
      metricPartnerSub: 'SELECTED EXTERNAL ACCESS',
      metricSearch: 'Search',
      metricSearchSub: 'WINE, PRICE, AVAILABILITY',
      metricTransp: 'Transparency',
      metricTranspSub: 'NO FAKE INTERNAL STOCK',

      privacyTitle: 'PRIVACY POLICY',
      privacyDate: 'Last updated: April 2026',
      privacyHTML: '<h3>1. Data Controller</h3><p>Sommelier World is an independent editorial project. Contact: info@sommelierworld.vin</p><h3>2. Data Collected</h3><p>The site collects only data voluntarily submitted through the producers form (winery name, email). No browsing data is tracked or sold.</p><h3>3. Cookies and localStorage</h3><p>We use localStorage for local preferences (language, article cache). Data remains on the user\'s device and is never transmitted to external servers.</p><h3>4. Third-party Services</h3><p>Groq API (AI processing), CartoDB (map tiles). None of these services receives personal data from end users.</p><h3>5. GDPR Rights</h3><p>You have the right to access, correct and delete your data. Contact us at info@sommelierworld.vin</p>',

      termsTitle: 'TERMS OF SERVICE',
      termsDate: 'Last updated: April 2026',
      termsHTML: '<h3>1. Service Description</h3><p>Sommelier World is an encyclopaedic platform dedicated to wine. Content is AI-assisted for informational and educational purposes.</p><h3>2. Limitation of Liability</h3><p>AI Sommelier recommendations do not constitute professional oenological or commercial advice. Always verify purchases with official sources and certified producers.</p><h3>3. Intellectual Property</h3><p>The code, design and original content of Sommelier World are protected. Wine appellations cited are in the public domain.</p><h3>4. Governing Law</h3><p>These terms are governed by Italian law. Any dispute shall be subject to the jurisdiction of the manager\'s domicile.</p>',

      /* Chiavi mancanti nel dict EN principale */
      somFeedbackQ: 'DID THIS ADVICE HELP YOU?',
      somFbGraz: '✓ Thank you!',
      somFbNote: '✓ Noted.',
      newsArticoli: 'articles',
      newsLive: '🔴 WINE NEWS',
      homeSapereTitle: 'WINE KNOWLEDGE',
      homeMoreArts: 'MORE ARTICLES →',
      prodBeta: '🎁 BETA — free access',
      somPaesePh: 'Any country',
      somMenuPh: 'Describe your menu — at least the main course.\nEx: Mushroom risotto with black truffle…',
    },

    /* ── FRANÇAIS ── */
    fr: {
      back: '← RETOUR',
      backCollection: '← RETOUR À LA COLLECTION',
      backManifesto: '← RETOUR À LA COLLECTION',
      readerBack: '← RETOUR',
      privateCollTag: 'COLLECTION PRIVÉE',
      exclusiveTag: 'EXCLUSIVITÉ SOMMELIERWORLD',

      evKicker: '✦ AGENDA INTERNATIONAL ✦',
      evTitle: 'Événements Vinicoles 2026',
      evSub: 'Foires · Ventes aux enchères · Festivals · Dégustations',
      evFilterAll: '🌍 Tous',
      evFilterIT: '🇮🇹 Italie',
      evFilterFR: '🇫🇷 France',
      evFilterUS: '🇺🇸 USA',
      evFilterIntl: '✈️ International',
      evOpenLink: 'SITE OFFICIEL →',
      evClose: 'FERMER',

      prodKicker: '✦ BOUTIQUE VIN ✦',
      prodLead: 'SommelierWorld ne possède pas encore son propre stock. Cette page fonctionne comme une boutique curatoriale : elle guide votre choix, ouvre des plateformes partenaires et garde les projets propriétaires hors vitrine jusqu\'à ce qu\'ils soient vraiment prêts.',
      prodWhereBuy: 'OÙ ACHETER',
      prodWhereSub: 'Une vitrine crédible, avant les affiliations',
      prodBackHome: 'RETOUR À L\'ACCUEIL',
      prodPriority: 'PRIORITÉ',
      prodVerify: 'VÉRIFIER',
      prodTannicoTitle: 'Partenaire de départ recommandé',
      prodTannicoDesc: 'Le choix le plus cohérent pour lancer la Boutique : perception premium, recherche simple et structure idéale à transformer ensuite en affiliation réelle.',
      prodBernabeiTitle: 'Canal secondaire à confirmer',
      prodBernabeiDesc: 'Très intéressant pour la largeur du catalogue, mais traité comme partenaire en observation jusqu\'à confirmation business.',
      metricPartner: 'Partenaires',
      metricPartnerSub: 'ACCÈS EXTERNE SÉLECTIONNÉ',
      metricSearch: 'Recherche',
      metricSearchSub: 'VIN, PRIX, DISPONIBILITÉ',
      metricTransp: 'Transparence',
      metricTranspSub: 'AUCUN FAUX STOCK INTERNE',

      privacyTitle: 'POLITIQUE DE CONFIDENTIALITÉ',
      privacyDate: 'Dernière mise à jour : Avril 2026',
      privacyHTML: '<h3>1. Responsable du traitement</h3><p>Sommelier World est un projet éditorial indépendant. Contact : info@sommelierworld.vin</p><h3>2. Données collectées</h3><p>Le site ne collecte que les données saisies volontairement dans le formulaire producteurs (nom de la cave, email). Aucune donnée de navigation n\'est tracée ou vendue.</p><h3>3. Cookies et localStorage</h3><p>Nous utilisons localStorage pour les préférences locales (langue, cache articles). Les données restent sur l\'appareil de l\'utilisateur et ne sont pas transmises à des serveurs externes.</p><h3>4. Services tiers</h3><p>Groq API (traitement IA), CartoDB (tuiles de carte). Aucun de ces services ne reçoit de données personnelles des utilisateurs finaux.</p><h3>5. Droits RGPD</h3><p>Vous avez le droit d\'accéder, de corriger et de supprimer vos données. Contactez-nous à info@sommelierworld.vin</p>',

      termsTitle: 'CONDITIONS D\'UTILISATION',
      termsDate: 'Dernière mise à jour : Avril 2026',
      termsHTML: '<h3>1. Description du service</h3><p>Sommelier World est une plateforme encyclopédique dédiée au vin. Les contenus sont générés avec l\'aide de l\'IA à des fins informatives et éducatives.</p><h3>2. Limitation de responsabilité</h3><p>Les conseils du Sommelier IA ne constituent pas un avis professionnel œnologique ou commercial. Vérifiez toujours vos achats auprès de sources officielles et de producteurs certifiés.</p><h3>3. Propriété intellectuelle</h3><p>Le code, le design et les contenus originaux de Sommelier World sont protégés. Les appellations viticoles citées appartiennent au domaine public.</p><h3>4. Droit applicable</h3><p>Les présentes conditions sont régies par le droit italien. Tout litige relève de la compétence du tribunal du domicile du gestionnaire.</p>',

      /* Chiavi mancanti nel dict FR principale */
      newsLive: '🔴 ACTUALITÉS VIN',
      somDisclaimer: 'Les recommandations sont générées par IA à des fins informatives.',
      somFeedbackQ: 'CE CONSEIL VOUS A-T-IL AIDÉ ?',
      somFbQ: 'CE CONSEIL ÉTAIT-IL UTILE ?',
      somFbGraz: '✓ Merci !',
      somFbNote: '✓ Votre avis a été pris en compte.',
      somMenuLbl: 'VOTRE MENU',
      somMenuPh: 'Décrivez le menu — au moins le plat principal.\nEx : Risotto aux champignons porcini avec truffe…',
      somBtn: '✦ CONSULTER LE SOMMELIER ✦',
      somLoading: 'Le Sommelier réfléchit…',
      somLoadMsg: 'Le Sommelier réfléchit…',
      somProfiloLbl: 'CARACTÈRE DU VIN SOUHAITÉ',
      somBudgetLbl: 'BUDGET PAR BOUTEILLE',
      newsArticoli: 'articles',
      qmTit: 'MENUS RAPIDES',
      qmPesce: '🐟 Poisson',
      qmCarne: '🥩 Viande',
      qmVeg: '🌿 Végétarien',
      qmDeg: '🍽 Dégustation',
      qmFor: '🧀 Fromages',
      qmParty: '🎉 Fête',
      terroirTitle: 'Terroir Mondial',
      terroirSub: '327 appellations · recherche par nom, pays ou cépage',
      terroirPh: '🔍  Rechercher appellation, pays, cépage…',
      prodTitle: 'Boutique Vin',
      prodSub: 'Achat guidé via cavistes et plateformes partenaires',
      prodPkg: 'CHOISIR UN PLAN',
      prodBeta: '🎁 BÊTA — accès gratuit',
      allRights: 'Tous droits réservés.',
      disclaimer: 'Sommelier World est un projet éditorial indépendant.',
      privacyLnk: 'Politique de confidentialité',
      termsLnk: 'Conditions d\'utilisation',
      waitlistLoading: 'Inscription en cours...',
      waitlistInvalid: 'Veuillez saisir un email valide.',
      waitlistSuccess: 'Accès exclusif enregistré. Nous vous écrirons dès que la Maison ouvrira son premier lancement.',
    },

    /* ── РУССКИЙ ── */
    ru: {
      back: '← НАЗАД',
      backCollection: '← НАЗАД К КОЛЛЕКЦИИ',
      backManifesto: '← НАЗАД К КОЛЛЕКЦИИ',
      readerBack: '← НАЗАД',
      privateCollTag: 'ПРИВАТНАЯ КОЛЛЕКЦИЯ',
      exclusiveTag: 'ЭКСКЛЮЗИВ SOMMELIERWORLD',

      evKicker: '✦ МЕЖДУНАРОДНАЯ АФИША ✦',
      evTitle: 'Винные события 2026',
      evSub: 'Ярмарки · Аукционы · Фестивали · Дегустации в мире',
      evFilterAll: '🌍 Все',
      evFilterIT: '🇮🇹 Италия',
      evFilterFR: '🇫🇷 Франция',
      evFilterUS: '🇺🇸 США',
      evFilterIntl: '✈️ Международные',
      evOpenLink: 'ОФИЦИАЛЬНЫЙ САЙТ →',
      evClose: 'ЗАКРЫТЬ',

      prodKicker: '✦ ВИННЫЙ БУТИК ✦',
      prodLead: 'SommelierWorld пока не имеет собственного склада. Эта страница работает как кураторский бутик: помогает сделать выбор, открывает платформы партнёров и держит собственные проекты вне витрины до их реальной готовности.',
      prodWhereBuy: 'ГДЕ КУПИТЬ',
      prodWhereSub: 'Достоверная витрина, до партнёрских соглашений',
      prodBackHome: 'НА ГЛАВНУЮ',
      prodPriority: 'ПРИОРИТЕТ',
      prodVerify: 'ПРОВЕРИТЬ',
      prodTannicoTitle: 'Рекомендуемый стартовый партнёр',
      prodTannicoDesc: 'Наиболее подходящий выбор для запуска Бутика: премиальное восприятие, простой поиск и идеальная структура для последующей аффилиации.',
      prodBernabeiTitle: 'Дополнительный канал для подтверждения',
      prodBernabeiDesc: 'Интересен широтой каталога, но рассматривается как партнёр под наблюдением до получения бизнес-подтверждения.',
      metricPartner: 'Партнёры',
      metricPartnerSub: 'ВНЕШНИЙ ОТОБРАННЫЙ ДОСТУП',
      metricSearch: 'Поиск',
      metricSearchSub: 'ВИНО, ЦЕНА, НАЛИЧИЕ',
      metricTransp: 'Прозрачность',
      metricTranspSub: 'НИКАКОГО ЛОЖНОГО СКЛАДА',

      privacyTitle: 'ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ',
      privacyDate: 'Последнее обновление: апрель 2026',
      privacyHTML: '<h3>1. Оператор данных</h3><p>Sommelier World — независимый редакционный проект. Контакт: info@sommelierworld.vin</p><h3>2. Собираемые данные</h3><p>Сайт собирает только данные, добровольно введённые в форме для производителей (название винодельни, email). Данные навигации не отслеживаются и не продаются.</p><h3>3. Cookies и localStorage</h3><p>Мы используем localStorage для локальных предпочтений (язык, кэш статей). Данные остаются на устройстве пользователя и не передаются на внешние серверы.</p><h3>4. Сторонние сервисы</h3><p>Groq API (обработка ИИ), CartoDB (тайлы карты). Ни один из этих сервисов не получает личных данных конечных пользователей.</p><h3>5. Права по GDPR</h3><p>Вы имеете право на доступ, исправление и удаление своих данных. Свяжитесь с нами по адресу info@sommelierworld.vin</p>',

      termsTitle: 'УСЛОВИЯ ИСПОЛЬЗОВАНИЯ',
      termsDate: 'Последнее обновление: апрель 2026',
      termsHTML: '<h3>1. Описание сервиса</h3><p>Sommelier World — энциклопедическая платформа, посвящённая вину. Контент создаётся с поддержкой искусственного интеллекта в информационных и образовательных целях.</p><h3>2. Ограничение ответственности</h3><p>Рекомендации Sommelier AI не являются профессиональной энологической или коммерческой консультацией. Всегда проверяйте покупки у официальных источников и сертифицированных производителей.</p><h3>3. Интеллектуальная собственность</h3><p>Код, дизайн и оригинальные материалы Sommelier World защищены. Упомянутые винные апелласьоны находятся в открытом доступе.</p><h3>4. Применимое право</h3><p>Настоящие условия регулируются итальянским законодательством. Все споры рассматриваются в суде по месту жительства управляющего.</p>',

      /* Chiavi mancanti nel dict RU principale */
      somFeedbackQ: 'СОВЕТ БЫЛ ПОЛЕЗЕН?',
      somFbGraz: '✓ Спасибо!',
      somFbNote: '✓ Учтём ваш отзыв.',
      newsArticoli: 'статей',
      somMenuLbl: 'ВАШЕ МЕНЮ',
      somMenuPh: 'Опишите меню — хотя бы основное блюдо.',
      newsLive: '🔴 НОВОСТИ ВИНА',
      homeSapereTitle: 'О ВИНЕ',
      homeMoreArts: 'ЕЩЁ СТАТЬИ →',
      prodBeta: '🎁 БЕТА — бесплатный доступ',
      somPaesePh: 'Любая страна',
    },
  };

  /* ═══════════════════════════════════════════════════════════
     PATCH — attende window.i18n poi esegue
     ═══════════════════════════════════════════════════════════ */
  function runPatch() {
    if (!window.i18n || !window.i18n.dict) {
      setTimeout(runPatch, 60);
      return;
    }

    /* 1. Merge chiavi mancanti in ogni lingua */
    ['it', 'en', 'fr', 'ru'].forEach(function (lang) {
      var target = window.i18n.dict[lang];
      var source = PATCH[lang] || {};
      if (!target) { window.i18n.dict[lang] = {}; target = window.i18n.dict[lang]; }
      for (var k in source) {
        /* Non sovrascrivere se già esiste nel dict principale */
        if (target[k] === undefined) {
          target[k] = source[k];
        }
      }
    });

    /* 2. Estende _applyI18n wrappando l'originale */
    var _orig = window._applyI18n;
    window._applyI18n = function () {
      if (typeof _orig === 'function') _orig.call(window);
      _applyExtended();
    };

    /* 3. Applica subito e poi all'init */
    _applyExtended();
    setTimeout(_applyExtended, 500); /* secondo pass dopo render dinamico */
  }

  /* ─── Applica traduzioni extra al DOM ─────────────────────── */
  function _applyExtended() {
    var lang = (window.i18n && window.i18n.current) || 'it';
    var dict = (window.i18n && window.i18n.dict[lang]) || PATCH.it;

    function t(k) {
      return (dict && dict[k] !== undefined) ? dict[k]
           : (PATCH[lang] && PATCH[lang][k] !== undefined) ? PATCH[lang][k]
           : (PATCH.it && PATCH.it[k] !== undefined) ? PATCH.it[k]
           : k;
    }

    /* ── Bottoni back universali ── */
    var artBack = document.querySelector('#articleReader .reader-back');
    if (artBack) artBack.textContent = t('readerBack');

    var colBack = document.getElementById('collectionReaderBackBtn');
    if (colBack) colBack.textContent = t('backCollection');

    var manBack = document.getElementById('manifestoBackBtn');
    if (manBack) manBack.textContent = t('backManifesto');

    /* ── Pagina Privacy ── */
    _updateLegalPage('page-privacy', lang, t);

    /* ── Pagina Termini ── */
    _updateLegalPage('page-terms', lang, t);

    /* ── Pagina Eventi ── */
    _updateEventiPage(lang, t);

    /* ── Pagina Boutique / Produttori ── */
    _updateProducersPage(lang, t);
  }

  /* ─── Pagine legali (Privacy / Termini) ─────────────────── */
  function _updateLegalPage(pageId, lang, t) {
    var page = document.getElementById(pageId);
    if (!page) return;
    var content = page.querySelector('.legal-content');
    if (!content) return;

    /* Bottone indietro */
    var btn = content.querySelector('button');
    if (btn) btn.textContent = t('back');

    /* Titolo */
    var isPrivacy = (pageId === 'page-privacy');
    var titleKey  = isPrivacy ? 'privacyTitle' : 'termsTitle';
    var dateKey   = isPrivacy ? 'privacyDate'  : 'termsDate';
    var htmlKey   = isPrivacy ? 'privacyHTML'  : 'termsHTML';

    var titleEl = content.querySelector('[style*="letter-spacing:3px"]');
    if (titleEl) titleEl.textContent = t(titleKey);

    var dateEl = content.querySelector('[style*="italic"]');
    if (dateEl) dateEl.textContent = t(dateKey);

    /* Corpo — sostituisce h3/p con la traduzione */
    var bodyHTML = t(htmlKey);
    if (bodyHTML && bodyHTML !== htmlKey) {
      /* Rimuovi vecchi h3/p, li rifà */
      var oldH3 = content.querySelectorAll('h3');
      var oldP  = content.querySelectorAll('p');
      oldH3.forEach(function (el) { el.remove(); });
      oldP.forEach(function (el) { el.remove(); });

      var tmp = document.createElement('div');
      tmp.innerHTML = bodyHTML;
      while (tmp.firstChild) {
        content.appendChild(tmp.firstChild);
      }
    }
  }

  /* ─── Pagina Events ─────────────────────────────────────── */
  function _updateEventiPage(lang, t) {
    var heroBlock = document.getElementById('eventiBlock_hero');
    if (!heroBlock) return;

    /* Kicker */
    var kicker = heroBlock.querySelector('[style*="letter-spacing:.4em"]');
    if (kicker) kicker.textContent = t('evKicker');

    /* Titolo */
    var title = heroBlock.querySelector('[style*="1.8rem"]');
    if (title) title.textContent = t('evTitle');

    /* Sottotitolo */
    var sub = heroBlock.querySelector('[style*="italic"]');
    if (sub) sub.textContent = t('evSub');

    /* Filtri */
    var filterMap = [
      { fn: 'tutti',          key: 'evFilterAll'  },
      { fn: 'Italia',         key: 'evFilterIT'   },
      { fn: 'Francia',        key: 'evFilterFR'   },
      { fn: 'USA',            key: 'evFilterUS'   },
      { fn: 'internazionale', key: 'evFilterIntl' },
    ];
    document.querySelectorAll('#page-eventi .ev-filter').forEach(function (btn) {
      var onclick = btn.getAttribute('onclick') || '';
      filterMap.forEach(function (m) {
        if (onclick.indexOf(m.fn) !== -1) {
          btn.textContent = t(m.key);
        }
      });
    });
  }

  /* ─── Pagina Boutique / Produttori ─────────────────────── */
  function _updateProducersPage(lang, t) {
    /* Kicker hero */
    var prodHero = document.getElementById('producersBlock_hero');
    if (prodHero) {
      var kicker = prodHero.querySelector('[style*="letter-spacing:.4em"]');
      if (kicker) kicker.textContent = t('prodKicker');

      /* Testo lead */
      var lead = prodHero.querySelector('.producers-lead');
      if (lead) lead.textContent = t('prodLead');

      /* Metriche */
      var metrics = prodHero.querySelectorAll('.producers-metric');
      var metricData = [
        { strong: t('metricPartner'), span: t('metricPartnerSub') },
        { strong: t('metricSearch'),  span: t('metricSearchSub')  },
        { strong: t('metricTransp'),  span: t('metricTranspSub')  },
      ];
      metrics.forEach(function (m, i) {
        var mData = metricData[i];
        if (!mData) return;
        var strong = m.querySelector('strong');
        var span   = m.querySelector('span');
        if (strong) strong.textContent = mData.strong;
        if (span)   span.textContent   = mData.span;
      });
    }

    /* Showcase "dove comprare" */
    var showcase = document.getElementById('producersBlock_wherebuy');
    if (showcase) {
      /* Kicker "DOVE COMPRARE" */
      var dovEl = showcase.querySelector('[style*="letter-spacing:3px"]');
      if (dovEl) dovEl.textContent = t('prodWhereBuy');

      /* Titolo showcase */
      var showTitle = showcase.querySelector('[style*="1.28rem"]');
      if (showTitle) showTitle.textContent = t('prodWhereSub');

      /* Bottone torna home */
      var backBtn = showcase.querySelector('button[onclick*="showPage(\'home\')"]');
      if (backBtn) backBtn.textContent = t('prodBackHome');

      /* Cards partner Tannico / Bernabei */
      var partnerCards = showcase.querySelectorAll('a[href]');
      partnerCards.forEach(function (card) {
        var href = card.getAttribute('href') || '';
        var isTannico   = href.indexOf('tannico') !== -1;
        var isBernabei  = href.indexOf('bernabei') !== -1;
        if (!isTannico && !isBernabei) return;

        /* Badge priorità / verify */
        var badge = card.querySelector('[style*="border-radius:999px"]');
        if (badge) {
          if (isTannico)  badge.textContent = t('prodPriority');
          if (isBernabei) badge.textContent = t('prodVerify');
        }

        /* Titolo card */
        var cardTitle = card.querySelector('[style*="1.12rem"]');
        if (cardTitle) {
          if (isTannico)  cardTitle.textContent = t('prodTannicoTitle');
          if (isBernabei) cardTitle.textContent = t('prodBernabeiTitle');
        }

        /* Descrizione card */
        var cardDesc = card.querySelector('[style*="1rem"]');
        if (cardDesc) {
          if (isTannico)  cardDesc.textContent = t('prodTannicoDesc');
          if (isBernabei) cardDesc.textContent = t('prodBernabeiDesc');
        }
      });
    }
  }

  /* ═══════════════════════════════════════════════════════════
     HOOK: aggiorna pagina corrente al cambio lingua
     ═══════════════════════════════════════════════════════════ */
  var _origSetLang = null;
  function hookSetLang() {
    if (!window.setLang) { setTimeout(hookSetLang, 80); return; }
    if (window.__i18nPatchHooked) return;
    window.__i18nPatchHooked = true;
    _origSetLang = window.setLang;
    window.setLang = function (lang) {
      _origSetLang(lang);
      /* Breve delay per lasciare che il DOM originale si aggiorni */
      setTimeout(_applyExtended, 80);
    };
  }

  /* ═══════════════════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════════════════ */
  /* Avvia appena possibile */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      runPatch();
      hookSetLang();
    });
  } else {
    runPatch();
    hookSetLang();
  }

  /* Terzo pass al caricamento completo */
  window.addEventListener('load', function () {
    setTimeout(_applyExtended, 300);
  });

})();
