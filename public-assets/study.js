(function(){
  var API_BASE = (function(){
    try {
      var fallback = 'https://api.sommelierworld.vin';
      if (window.SRV) return String(window.SRV).replace(/\/+$/, '');
      var h = (window.location && window.location.hostname) ? window.location.hostname : '';
      if (h && (h === 'sommelierworld.vin' || /\.sommelierworld\.vin$/i.test(h) || /\.workers\.dev$/i.test(h) || /\.pages\.dev$/i.test(h))) {
        return String(window.location.origin || fallback).replace(/\/+$/, '');
      }
      return fallback;
    }
    catch(e) { return 'https://api.sommelierworld.vin'; }
  })();

  var STORAGE_USER_KEY = 'sw_study_user_key';
  var STORAGE_PROGRESS = 'sw_study_progress_v1';
  var STORAGE_LAST_LESSON = 'sw_study_last_lesson';

    var FALLBACK_MODULES = [
    {
      id: 'modulo_1_fondamenti_del_vino',
      title: 'Modulo 1 - Fondamenti del vino',
      intro: 'Catalogo locale ridotto. Per i contenuti completi della formazione, l app usa il backend Study.',
      premium_ready: true,
      lesson_count: 10,
      quiz_count: 10,
      glossary: [],
      lessons: [
        { id:'lesson_vine_origins', sort_order:1, level:'level1', title:'La vite, Vitis vinifera e le basi della viticoltura moderna', intro:'Carica la lezione dal backend Study.', reading_minutes:0, study_goal:'', quiz_count:0 },
        { id:'lesson_grape_maturity', sort_order:2, level:'level1', title:'La maturazione dell uva: oltre il semplice zucchero', intro:'Carica la lezione dal backend Study.', reading_minutes:0, study_goal:'', quiz_count:0 },
        { id:'lesson_harvest_timing', sort_order:3, level:'level1', title:'La vendemmia: scegliere il momento giusto della raccolta', intro:'Carica la lezione dal backend Study.', reading_minutes:0, study_goal:'', quiz_count:0 },
        { id:'lesson_fermentazione_04', sort_order:4, level:'level1', title:'La fermentazione alcolica: quando il mosto diventa vino', intro:'Carica la lezione dal backend Study.', reading_minutes:0, study_goal:'', quiz_count:0 },
        { id:'lesson_vinification_05', sort_order:5, level:'level1', title:'Vinificazione in bianco, in rosso e in rosato', intro:'Carica la lezione dal backend Study.', reading_minutes:0, study_goal:'', quiz_count:0 },
        { id:'lesson_aging_vessels_06', sort_order:6, level:'level1', title:'Affinamento e contenitori: acciaio, legno, cemento e anfora', intro:'Carica la lezione dal backend Study.', reading_minutes:0, study_goal:'', quiz_count:0 },
        { id:'lesson_tasting_foundation', sort_order:7, level:'level1', title:'Introduzione alla degustazione', intro:'Carica la lezione dal backend Study.', reading_minutes:0, study_goal:'', quiz_count:0 },
        { id:'lesson_balance_structure_08', sort_order:8, level:'level1', title:'Equilibrio, struttura e stile del vino', intro:'Carica la lezione dal backend Study.', reading_minutes:0, study_goal:'', quiz_count:0 },
        { id:'lesson_sparkling_wines_09', sort_order:9, level:'level1', title:'Spumanti: presa di spuma, metodo classico e metodo Martinotti', intro:'Carica la lezione dal backend Study.', reading_minutes:0, study_goal:'', quiz_count:0 },
        { id:'lesson_label_service_10', sort_order:10, level:'level1', title:'Classificazioni italiane, etichetta e servizio del vino', intro:'Carica la lezione dal backend Study.', reading_minutes:0, study_goal:'', quiz_count:0 }
      ]
    }
  ];

  var FALLBACK_LESSONS = {};
  var STUDY_LESSON_ENHANCEMENTS = {};
  var STUDY_MODULE_QUIZ_POOLS = {};
  var STUDY_LESSON_STUDY_NOTES = {};
  var STUDY_MODULE_GLOSSARIES = {};
  var STUDY_LESSON_QUICK_REVIEWS = {};

  function getLongerText(primary, secondary) {
    var a = String(primary || '');
    var b = String(secondary || '');
    return a.length >= b.length ? a : b;
  }

  function mergeLessonTranslations(rawTx, extraTx) {
    var raw = rawTx && rawTx.it ? rawTx.it : {};
    var extra = extraTx && extraTx.it ? extraTx.it : {};
    return {
      it: {
        title: extra.title || raw.title || '',
        intro: getLongerText(extra.intro, raw.intro),
        body: getLongerText(extra.body, raw.body)
      }
    };
  }

  function getEnhancedLesson(lessonId, rawLesson) {
    var raw = rawLesson && typeof rawLesson === 'object' ? rawLesson : (FALLBACK_LESSONS[lessonId] || null);
    if (!raw) return null;
    var languages = ['it', 'en', 'fr', 'ru'];
    var normalizedTranslations = {};
    languages.forEach(function(lang){
      var tx = raw.translations && raw.translations[lang] ? raw.translations[lang] : {};
      normalizedTranslations[lang] = {
        title: String(tx.title || ''),
        intro: String(tx.intro || ''),
        body: String(tx.body || '')
      };
    });
    return Object.assign({}, raw, {
      id: raw.id || lessonId || '',
      level: raw.level || '',
      reading_minutes: Number(raw.reading_minutes || 0),
      quiz: Array.isArray(raw.quiz) ? raw.quiz : [],
      study_notes: raw.study_notes || null,
      quick_review: raw.quick_review || null,
      illustrations: Array.isArray(raw.illustrations) ? raw.illustrations : [],
      translations: normalizedTranslations
    });
  }

  function enhanceModuleCatalog(modules) {
    return (modules || []).map(function(module){
      var next = Object.assign({}, module);
      next.glossary = Array.isArray(module && module.glossary) ? module.glossary.slice() : [];
      next.lessons = (module.lessons || []).map(function(lesson){
        return Object.assign({}, lesson, {
          intro: String(lesson && lesson.intro || ''),
          reading_minutes: Number(lesson && lesson.reading_minutes || 0),
          quiz_count: Number(lesson && lesson.quiz_count || 0)
        });
      });
      next.lesson_count = next.lessons.length;
      next.quiz_count = Number(module && module.quiz_count || (next.lessons.length ? 10 : 0));
      return next;
    });
  }

  function shuffleArray(list) {
    var arr = (list || []).slice();
    for (var i = arr.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function buildModuleQuizQuestions(module) {
    return [];
  }

  var state = {
    userKey: '',
    modules: [],
    progress: { user_key:'', lessons_completed:[], quiz_results:[], updated_at:'' },
    activeModuleId: '',
    activeLessonId: '',
    activeLesson: null,
    activeView: 'lesson',
    lessonPages: [],
    lessonPageIndex: 0,
    moduleQuizSession: null,
    lessonCache: {},
    quizFeedback: null,
    activeGlossaryTerm: '',
    lessonQuickReview: { lessonId:'', selectedIndex:null, submitted:false },
    syncStatus: 'idle',
    syncMessage: '',
    ready: false,
    loading: false,
    lastError: ''
  };

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeRegex(value) {
    return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function ensureUserKey() {
    var existing = '';
    try { existing = localStorage.getItem(STORAGE_USER_KEY) || ''; } catch(e) {}
    if (existing) return existing;
    var created = 'study_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    try { localStorage.setItem(STORAGE_USER_KEY, created); } catch(e) {}
    return created;
  }

  function loadLocalProgress() {
    try {
      var raw = localStorage.getItem(STORAGE_PROGRESS);
      return raw ? JSON.parse(raw) : { user_key: state.userKey, lessons_completed: [], quiz_results: [], updated_at: '' };
    } catch(e) {
      return { user_key: state.userKey, lessons_completed: [], quiz_results: [], updated_at: '' };
    }
  }

  function saveLocalProgress(progress) {
    try { localStorage.setItem(STORAGE_PROGRESS, JSON.stringify(progress || {})); } catch(e) {}
  }

  function getModuleById(id) {
    return state.modules.find(function(module){ return module.id === id; }) || null;
  }

  function getCurrentModule() {
    return getModuleById(state.activeModuleId) || state.modules[0] || null;
  }

  function getCurrentLessonMeta() {
    var module = getCurrentModule();
    if (!module) return null;
    return module.lessons.find(function(lesson){ return lesson.id === state.activeLessonId; }) || module.lessons[0] || null;
  }

  function getQuizResultForLesson(lessonId) {
    return (state.progress.quiz_results || []).find(function(entry){ return entry.lesson_id === lessonId; }) || null;
  }

  function getLessonPayload(lessonId) {
    if (state.activeLesson && state.activeLesson.id === lessonId) return state.activeLesson;
    return getEnhancedLesson(lessonId, state.lessonCache[lessonId] || null);
  }

  function getModuleGlossaryItems(moduleId) {
    var module = getModuleById(moduleId) || getCurrentModule();
    return Array.isArray(module && module.glossary) ? module.glossary : [];
  }

  function getModuleQuizResult(moduleId) {
    return (state.progress.quiz_results || []).find(function(entry){
      return entry.lesson_id === ('module_quiz:' + moduleId);
    }) || null;
  }

  function getModuleQuizDoneCount() {
    return (state.progress.quiz_results || []).filter(function(entry){
      return /^module_quiz:/.test(String(entry.lesson_id || ''));
    }).length;
  }

  function isLessonCompleted(lessonId) {
    return (state.progress.lessons_completed || []).indexOf(lessonId) >= 0;
  }

  function getCompletedLessonsCountForModule(moduleId) {
    var module = getModuleById(moduleId);
    if (!module || !Array.isArray(module.lessons)) return 0;
    return module.lessons.filter(function(lesson){
      return isLessonCompleted(lesson.id);
    }).length;
  }

  function canStartModuleQuiz(moduleId) {
    var module = getModuleById(moduleId);
    if (!module || !Array.isArray(module.lessons) || !module.lessons.length) return false;
    return getCompletedLessonsCountForModule(moduleId) >= module.lessons.length;
  }

  function normalizeHeadingKey(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/\r\n?/g, '\n')
      .replace(/\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function getHeadingAnchorKey(value) {
    var text = String(value || '').trim();
    var sectionMatch = text.match(/^(\d+)\./);
    if (sectionMatch) return 'section_' + sectionMatch[1];
    return normalizeHeadingKey(text);
  }

  function getStudyLang() {
    var lang = 'it';
    try {
      lang = (window.getLang && window.getLang()) || (window.i18n && window.i18n.current) || document.documentElement.lang || 'it';
    } catch(e) {}
    lang = String(lang || 'it').toLowerCase();
    return /^(it|en|fr|ru)$/.test(lang) ? lang : 'it';
  }

  function getLocalizedStudyValue(map, lang) {
    if (!map || typeof map !== 'object') return '';
    return map[lang] || map.it || map.en || map.fr || map.ru || '';
  }

  function getLocalizedStudyCaption(caption, lang) {
    var value = caption && typeof caption === 'object' ? (caption[lang] || caption.it || caption.en || caption.fr || caption.ru || {}) : {};
    return {
      title: String(value.title || ''),
      text: String(value.text || '')
    };
  }

  function getIllustrationSourceLabel(lang) {
    var labels = { it: 'fonte', en: 'source', fr: 'source', ru: 'источник' };
    return labels[lang] || labels.it;
  }

  function renderIllustrationCallouts(item, lang) {
    var entries = Array.isArray(item && item.callouts) ? item.callouts : [];
    if (!entries.length) return '';
    return [
      '<ol class="sw-study-figure-callouts">',
      entries.map(function(entry){
        return '<li><span class="sw-study-figure-callout-num">' + esc(String(entry.number || '')) + '</span><span class="sw-study-figure-callout-text">' + esc(getLocalizedStudyValue(entry.text || {}, lang)) + '</span></li>';
      }).join(''),
      '</ol>'
    ].join('');
  }

  function getLessonIllustrations(lessonId) {
    var lesson = getLessonPayload(lessonId);
    return lesson && Array.isArray(lesson.illustrations) ? lesson.illustrations : [];
  }

  function renderLessonIllustrationsAfterHeading(lessonId, heading) {
    var lang = getStudyLang();
    var items = getLessonIllustrations(lessonId).filter(function(item){
      return getHeadingAnchorKey(item.after_heading) === getHeadingAnchorKey(heading);
    });
    if (!items.length) return '';
    return items.map(function(item){
      var caption = item && item.caption ? item.caption : {};
      var alt = item && item.alt ? item.alt : {};
      var localizedCaption = getLocalizedStudyCaption(caption, lang);
      var captionTitle = localizedCaption.title;
      var captionText = localizedCaption.text;
      var credit = String(item.credit || '').trim();
      var sourceUrl = String(item.source_url || '').trim();
      return [
        '<figure class="sw-study-figure">',
          '<img src="', esc(item.url || ''), '" alt="', esc(String(getLocalizedStudyValue(alt, lang) || captionTitle || heading || '').trim()), '" loading="lazy" decoding="async">',
          '<figcaption>',
            captionTitle ? '<div class="sw-study-figure-title">' + esc(captionTitle) + '</div>' : '',
            captionText ? '<div class="sw-study-figure-text">' + esc(captionText) + '</div>' : '',
            renderIllustrationCallouts(item, lang),
            (credit || sourceUrl) ? '<div class="sw-study-figure-credit">' + (credit ? esc(credit) : '') + (credit && sourceUrl ? ' - ' : '') + (sourceUrl ? '<a href="' + esc(sourceUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(getIllustrationSourceLabel(lang)) + '</a>' : '') + '</div>' : '',
          '</figcaption>',
        '</figure>'
      ].join('');
    }).join('');
  }

  function getBaseUrl() {
    return API_BASE;
  }

  function setStudySync(status, message) {
    state.syncStatus = status || 'idle';
    state.syncMessage = message || '';
  }

  async function studyFetch(path, options) {
    var url = getBaseUrl() + path;
    var opts = options || {};
    var headers = Object.assign({ 'Accept': 'application/json' }, opts.headers || {});
    if (opts.json) {
      headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(opts.json);
    }
    opts.headers = headers;
    var response = await fetch(url, opts);
    var data = await response.json().catch(function(){ return {}; });
    if (!response.ok) throw new Error((data && data.error) || ('HTTP ' + response.status));
    return data;
  }

  function injectStudyCss() {
    if (document.getElementById('sw-study-css')) return;
    var style = document.createElement('style');
    style.id = 'sw-study-css';
    style.textContent = [
      '#page-study{padding-top:88px;min-height:100vh;background:linear-gradient(180deg,#110c09 0%,#090605 100%);}',
      'body.sw-os-windows #page-study{padding-top:132px;}',
      '.sw-study-wrap{max-width:1180px;margin:0 auto;padding:22px 16px 110px;color:#f5efe2;}',
      '.sw-study-hero{padding:10px 0 18px;border-bottom:1px solid rgba(212,175,55,.08);margin-bottom:18px;}',
      '.sw-study-kicker{font-family:Cinzel,serif;font-size:.52rem;letter-spacing:3px;color:rgba(212,175,55,.68);margin-bottom:10px;}',
      '.sw-study-title{font-family:"Playfair Display",Georgia,serif;font-size:clamp(2rem,4vw,3.2rem);line-height:1.08;color:#f5efe2;margin:0 0 10px;}',
      '.sw-study-sub{font-family:"Cormorant Garamond",serif;font-size:1.15rem;line-height:1.7;color:rgba(245,239,226,.78);max-width:820px;}',
      '.sw-study-stats{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;}',
      '.sw-study-topactions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px;}',
      '.sw-study-pill{padding:7px 11px;border:1px solid rgba(212,175,55,.12);background:rgba(255,255,255,.015);border-radius:999px;font-family:Cinzel,serif;font-size:.44rem;letter-spacing:1.8px;color:rgba(212,175,55,.74);}',
      '.sw-study-grid{display:grid;grid-template-columns:minmax(250px,300px) minmax(0,1fr);gap:28px;align-items:start;}',
      '.sw-study-panel{background:rgba(255,255,255,.02);border:1px solid rgba(212,175,55,.08);border-radius:18px;padding:18px;}',
      '.sw-study-panel h3{margin:0 0 10px;font-family:Cinzel,serif;font-size:.66rem;letter-spacing:3px;color:#d4af37;}',
      '.sw-study-module{padding:12px 0 14px;border:0;border-bottom:1px solid rgba(212,175,55,.1);border-radius:0;background:transparent;cursor:pointer;transition:opacity .18s ease;margin-bottom:8px;}',
      '.sw-study-module.active{opacity:1;}',
      '.sw-study-module-title{font-family:"Playfair Display",Georgia,serif;font-size:1.14rem;color:#f5efe2;margin-bottom:5px;}',
      '.sw-study-module-intro{font-family:"Cormorant Garamond",serif;font-size:1rem;line-height:1.5;color:rgba(245,239,226,.62);}',
      '.sw-study-module-meta{margin-top:8px;font-family:Cinzel,serif;font-size:.4rem;letter-spacing:1.7px;color:rgba(212,175,55,.56);}',
      '.sw-study-lesson-item{padding:12px 0;border-top:1px solid rgba(212,175,55,.08);cursor:pointer;}',
      '.sw-study-lesson-item:first-child{border-top:0;}',
      '.sw-study-lesson-item.active{background:transparent;}',
      '.sw-study-lesson-row{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;}',
      '.sw-study-lesson-title{font-family:"Playfair Display",Georgia,serif;font-size:1.01rem;color:#f5efe2;}',
      '.sw-study-lesson-state{font-family:Cinzel,serif;font-size:.4rem;letter-spacing:1.8px;color:rgba(212,175,55,.68);white-space:nowrap;}',
      '.sw-study-lesson-intro{display:none;}',
      '.sw-study-reader{padding:12px 0 0;background:transparent;border:0;}',
      '.sw-study-reader-shell{max-width:760px;margin:0 auto;padding:8px 6px 0;}',
      '.sw-study-reader-meta{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:16px;font-family:Cinzel,serif;font-size:.45rem;letter-spacing:2px;color:rgba(212,175,55,.56);}',
      '.sw-study-reader-title{font-family:"Playfair Display",Georgia,serif;font-size:clamp(2.1rem,4vw,3.35rem);line-height:1.04;color:#f5efe2;margin:0 0 16px;text-wrap:balance;}',
      '.sw-study-reader-intro{font-family:"Cormorant Garamond",serif;font-size:1.34rem;line-height:1.8;color:rgba(245,239,226,.82);font-style:italic;margin-bottom:28px;}',
      '.sw-study-reader-body p{margin:0 0 1.28em;font-family:"Cormorant Garamond",serif;font-size:1.24rem;line-height:1.92;color:rgba(245,239,226,.9);text-align:justify;}',
      '.sw-study-reader-body h4{margin:1.9em 0 .7em;font-family:"Playfair Display",Georgia,serif;font-size:1.55rem;color:#f5efe2;}',
      '.sw-study-reader-body ul{margin:0 0 1.3em 1.35em;padding:0;}',
      '.sw-study-reader-body li{margin:0 0 .56em;font-family:"Cormorant Garamond",serif;font-size:1.18rem;line-height:1.82;color:rgba(245,239,226,.86);}',
      '.sw-study-figure{margin:1.3rem 0 2rem;}',
      '.sw-study-figure img{display:block;width:100%;height:auto;border-radius:18px;box-shadow:0 18px 34px rgba(0,0,0,.22);}',
      '.sw-study-figure figcaption{margin-top:.8rem;padding:0 .2rem;}',
      '.sw-study-figure-title{font-family:"Playfair Display",Georgia,serif;font-size:1.06rem;color:#f5efe2;margin-bottom:.2rem;}',
      '.sw-study-figure-text{font-family:"Cormorant Garamond",serif;font-size:1.06rem;line-height:1.62;color:rgba(245,239,226,.72);}',
      '.sw-study-figure-callouts{list-style:none;margin:.85rem 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:.45rem .9rem;}',
      '.sw-study-figure-callouts li{margin:0;display:flex;align-items:flex-start;gap:.55rem;font-family:"Cormorant Garamond",serif;font-size:1.02rem;line-height:1.5;color:rgba(245,239,226,.76);}',
      '.sw-study-figure-callout-num{flex:0 0 auto;min-width:1.55rem;height:1.55rem;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;background:rgba(212,175,55,.14);border:1px solid rgba(212,175,55,.28);font-family:Cinzel,serif;font-size:.76rem;color:#d4af37;}',
      '.sw-study-figure-callout-text{display:block;padding-top:.05rem;}',
      '.sw-study-figure-credit{margin-top:.34rem;font-family:Cinzel,serif;font-size:.38rem;letter-spacing:1.4px;color:rgba(212,175,55,.58);text-transform:uppercase;}',
      '.sw-study-inline-term{display:inline;color:#f5efe2;background:transparent;border:0;padding:0;margin:0;text-decoration:underline dotted rgba(212,175,55,.45);text-underline-offset:3px;cursor:pointer;font:inherit;vertical-align:baseline;}',
      '.sw-study-inline-term:hover,.sw-study-inline-term.is-active{color:#fff0bf;text-decoration-color:rgba(212,175,55,.75);}',
      '.sw-study-inline-term-note{display:none;}',
      '.sw-study-lesson-notes{display:grid;gap:14px;margin-top:34px;padding-top:22px;border-top:1px solid rgba(212,175,55,.08);}',
      '.sw-study-note-card{padding:16px 16px 14px;border-radius:16px;border:1px solid rgba(212,175,55,.12);background:rgba(255,255,255,.02);}',
      '.sw-study-note-title{margin:0 0 10px;font-family:Cinzel,serif;font-size:.56rem;letter-spacing:2px;color:#d4af37;}',
      '.sw-study-note-card p,.sw-study-note-card li{font-family:"Cormorant Garamond",serif;font-size:1.05rem;line-height:1.68;color:rgba(245,239,226,.84);}',
      '.sw-study-note-card ul{margin:0 0 0 1.1em;padding:0;}',
      '.sw-study-term-chips{display:flex;gap:8px;flex-wrap:wrap;}',
      '.sw-study-term-chip{padding:7px 10px;border-radius:999px;border:1px solid rgba(212,175,55,.16);background:rgba(212,175,55,.06);font-family:Cinzel,serif;font-size:.42rem;letter-spacing:1.6px;color:rgba(245,239,226,.82);}',
      '.sw-study-quick-review{margin-top:24px;padding:18px;border-radius:18px;border:1px solid rgba(212,175,55,.12);background:rgba(255,255,255,.02);}',
      '.sw-study-quick-review-title{margin:0 0 8px;font-family:Cinzel,serif;font-size:.62rem;letter-spacing:2px;color:#d4af37;}',
      '.sw-study-quick-review-sub{font-family:"Cormorant Garamond",serif;font-size:1.05rem;line-height:1.62;color:rgba(245,239,226,.74);margin-bottom:14px;}',
      '.sw-study-quick-review-question{font-family:"Playfair Display",Georgia,serif;font-size:1.14rem;color:#f5efe2;margin-bottom:12px;}',
      '.sw-study-quick-review-options{display:grid;gap:8px;}',
      '.sw-study-quick-review-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px;}',
      '.sw-study-quick-review-feedback{margin-top:14px;padding:12px 14px;border-radius:14px;border:1px solid rgba(212,175,55,.12);background:rgba(212,175,55,.05);font-family:"Cormorant Garamond",serif;font-size:1.04rem;line-height:1.62;color:rgba(245,239,226,.82);}',
      '.sw-study-quick-review-feedback.is-ok{border-color:rgba(90,180,120,.28);background:rgba(90,180,120,.06);}',
      '.sw-study-quick-review-feedback.is-ko{border-color:rgba(212,175,55,.18);background:rgba(212,175,55,.05);}',
      '.sw-study-actions{display:flex;gap:10px;flex-wrap:wrap;margin:0 0 26px;}',
      '.sw-study-btn{padding:10px 14px;border-radius:999px;border:1px solid rgba(212,175,55,.16);background:rgba(212,175,55,.06);color:#d4af37;font-family:Cinzel,serif;font-size:.46rem;letter-spacing:1.9px;cursor:pointer;}',
      '.sw-study-btn.alt{background:transparent;color:rgba(245,239,226,.72);}',
      '.sw-study-quiz{margin-top:24px;padding-top:18px;border-top:1px solid rgba(212,175,55,.1);}',
      '.sw-study-quiz h4{margin:0 0 10px;font-family:Cinzel,serif;font-size:.66rem;letter-spacing:3px;color:#d4af37;}',
      '.sw-study-quiz-sub{font-family:"Cormorant Garamond",serif;font-size:1.05rem;line-height:1.6;color:rgba(245,239,226,.7);margin-bottom:16px;}',
      '.sw-study-question{padding:16px 16px 12px;margin-bottom:14px;border:1px solid rgba(212,175,55,.1);border-radius:16px;background:rgba(255,255,255,.02);}',
      '.sw-study-question-title{font-family:"Playfair Display",Georgia,serif;font-size:1.08rem;color:#f5efe2;margin-bottom:10px;}',
      '.sw-study-option{display:flex;gap:12px;align-items:flex-start;padding:11px 12px;margin-bottom:8px;border:1px solid rgba(212,175,55,.08);border-radius:12px;background:rgba(255,255,255,.015);font-family:"Cormorant Garamond",serif;font-size:1.08rem;line-height:1.55;color:rgba(245,239,226,.88);cursor:pointer;transition:border-color .18s ease, background .18s ease;}',
      '.sw-study-option:hover{border-color:rgba(212,175,55,.24);background:rgba(212,175,55,.035);}',
      '.sw-study-option input[type="radio"]{flex:0 0 auto;width:18px;height:18px;margin-top:.2em;accent-color:#d4af37;cursor:pointer;}',
      '.sw-study-feedback{margin:20px 0 0;padding:16px;border-radius:18px;background:rgba(212,175,55,.06);border:1px solid rgba(212,175,55,.12);}',
      '.sw-study-feedback strong{display:block;font-family:Cinzel,serif;font-size:.5rem;letter-spacing:2px;color:#d4af37;margin-bottom:8px;}',
      '.sw-study-feedback p,.sw-study-feedback li{font-family:"Cormorant Garamond",serif;font-size:1.05rem;line-height:1.65;color:rgba(245,239,226,.82);}',
      '.sw-study-feedback-list{display:grid;gap:12px;margin-top:14px;}',
      '.sw-study-feedback-item{padding:14px;border-radius:14px;border:1px solid rgba(212,175,55,.12);background:rgba(255,255,255,.02);}',
      '.sw-study-feedback-item.is-ok{border-color:rgba(90,180,120,.28);background:rgba(90,180,120,.06);}',
      '.sw-study-feedback-item.is-ko{border-color:rgba(212,175,55,.18);background:rgba(212,175,55,.05);}',
      '.sw-study-feedback-q{font-family:"Playfair Display",Georgia,serif;font-size:1.06rem;color:#f5efe2;margin-bottom:8px;}',
      '.sw-study-feedback-meta{font-family:"Cormorant Garamond",serif;font-size:1rem;line-height:1.6;color:rgba(245,239,226,.82);}',
      '.sw-study-notice{margin:0 0 18px;padding:12px 14px;border:1px solid rgba(212,175,55,.14);border-radius:14px;background:rgba(255,255,255,.018);font-family:"Cormorant Garamond",serif;font-size:1rem;line-height:1.58;color:rgba(245,239,226,.76);}',
      '.sw-study-notice strong{color:#f5efe2;}',
      /* LIBRO KINDLE STAGE + NAV PULSANTI (aggiunti 24.09.2026) */
      '.sw-book-stage{position:relative;margin:0 auto;max-width:860px;}',
      '.sw-book{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:0;background:linear-gradient(180deg,#f8efd8 0%,#f3e8c5 100%);border-radius:14px;padding:34px 30px 36px;box-shadow:0 30px 70px rgba(0,0,0,.45), inset 0 0 0 1px rgba(200,150,70,.28);}',
      '.sw-book-page{position:relative;min-height:420px;padding:14px 14px 20px;}',
      '.sw-book-page-left{border-right:1px solid rgba(170,120,55,.28);}',
      '.sw-book-spine{display:none;}',
      '.sw-book-pagenum{position:absolute;bottom:6px;left:0;right:0;text-align:center;font-family:Cinzel,serif;font-size:.38rem;letter-spacing:3px;color:rgba(120,85,35,.6);}',
      '.sw-book-page h4{font-family:"Playfair Display",Georgia,serif;font-size:1.28rem;color:#3a230a;margin:0 0 10px;}',
      '.sw-book-page p{font-family:"Cormorant Garamond",serif;font-size:1.08rem;line-height:1.78;color:#3d2610;margin:0 0 1em;text-align:justify;}',
      '.sw-book-nav{position:relative !important;top:auto !important;left:auto !important;right:auto !important;z-index:1 !important;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-top:18px;max-width:860px;margin-left:auto;margin-right:auto;padding:12px 4px;}',
      '.sw-book-nav button{padding:10px 16px;border-radius:999px;border:1px solid rgba(212,175,55,.28);background:rgba(212,175,55,.08);color:#d4af37;font-family:Cinzel,serif;font-size:.43rem;letter-spacing:2.2px;cursor:pointer;transition:all .18s ease;margin:0;}',
      '.sw-book-nav button:hover{background:rgba(212,175,55,.18);border-color:rgba(212,175,55,.55);}',
      '.sw-book-nav-back { background: rgba(255,255,255,.02) !important; color: rgba(245,239,226,.78) !important; border-color: rgba(212,175,55,.18) !important; }',
      '.sw-book-nav-flow{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end;}',
      '@media (max-width: 980px){.sw-book{grid-template-columns:1fr;}.sw-book-page-left{border-right:0;border-bottom:1px solid rgba(170,120,55,.28);}}',
      '.sw-study-module-quiz{user-select:none;-webkit-user-select:none;}',
      '.sw-study-quiz-kicker{font-family:Cinzel,serif;font-size:.5rem;letter-spacing:2px;color:rgba(212,175,55,.7);margin-bottom:8px;}',
      '.sw-study-quiz-progress{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin:10px 0 16px;font-family:Cinzel,serif;font-size:.46rem;letter-spacing:2px;color:rgba(212,175,55,.72);}',
      '.sw-study-quiz-guard{margin:0 0 16px;padding:10px 12px;border:1px dashed rgba(212,175,55,.2);border-radius:12px;background:rgba(255,255,255,.015);font-family:"Cormorant Garamond",serif;font-size:1rem;line-height:1.55;color:rgba(245,239,226,.7);}',
      '.sw-study-quiz-guard strong{color:#f5efe2;}',
      '.sw-study-quiz-guard-note{min-height:1.4em;color:rgba(212,175,55,.82);}',
      '.sw-study-quiz-step{padding:18px;border:1px solid rgba(212,175,55,.1);border-radius:18px;background:rgba(255,255,255,.018);}',
      '.sw-study-quiz-step .sw-study-question{margin-bottom:0;}',
      '.sw-study-empty{font-family:"Cormorant Garamond",serif;font-size:1.1rem;line-height:1.7;color:rgba(245,239,226,.64);}',
      '@media (min-width: 981px){body.sw-desktop .sw-study-wrap{max-width:1260px;padding:28px 24px 120px;}body.sw-os-windows .sw-study-wrap{max-width:1320px;padding:30px 26px 120px;}body.sw-os-windows .sw-study-grid{grid-template-columns:minmax(260px,300px) minmax(0,1fr);gap:34px;}body.sw-os-windows .sw-study-reader-shell{max-width:780px;}body.sw-os-windows .sw-study-reader-title{font-size:clamp(2.35rem,4vw,3.6rem);}body.sw-os-windows .sw-study-reader-body p{font-size:1.28rem;line-height:1.96;}}',
      '@media (max-width: 980px){.sw-study-grid{grid-template-columns:1fr;}.sw-study-reader{padding:8px 0 0;}.sw-study-reader-shell{max-width:none;padding:0;}.sw-study-reader-title{font-size:clamp(1.9rem,9vw,2.5rem);}.sw-study-reader-body p{font-size:1.16rem;line-height:1.82;text-align:left;}.sw-study-reader-body li{font-size:1.12rem;}}'
    ].join('');
    document.head.appendChild(style);
  }

  function findGlossaryItem(moduleId, term) {
    var items = getModuleGlossaryItems(moduleId);
    var wanted = String(term || '').toLowerCase();
    for (var i = 0; i < items.length; i += 1) {
      if (String(items[i].term || '').toLowerCase() === wanted) return items[i];
    }
    return null;
  }

  function addInlineGlossaryLinks(text, moduleId) {
    var items = getModuleGlossaryItems(moduleId).slice().sort(function(a, b){
      return String(b.term || '').length - String(a.term || '').length;
    });
    var html = esc(text || '');
    items.forEach(function(item){
      var term = String(item.term || '').trim();
      if (!term) return;
      var rx = new RegExp('(^|[^\\w>])(' + escapeRegex(term) + ')(?=[^\\w<]|$)', 'gi');
      html = html.replace(rx, function(match, prefix, found){
        var safeFound = esc(found);
        return prefix + '<button type="button" class="sw-study-inline-term' + (String(state.activeGlossaryTerm || '').toLowerCase() === String(term).toLowerCase() ? ' is-active' : '') + '" onclick="window.studyShowGlossaryTerm&&window.studyShowGlossaryTerm(\'' + esc(term) + '\')" title="Apri definizione: ' + esc(term) + '">' + safeFound + '</button>';
      });
    });
    return html;
  }

  function formatLessonBody(text, moduleId, lessonId) {
    var normalized = String(text || '')
      .replace(/\r\n?/g, '\n')
      .replace(/\\n/g, '\n')
      .replace(/\u00a0/g, ' ');
    var parts = normalized.split(/\n\s*\n/).map(function(part){ return part.trim(); }).filter(Boolean);
    if (!parts.length) return '<p class="sw-study-empty">Lezione in arrivo.</p>';
    return parts.map(function(part){
      var lines = part.split('\n').map(function(line){ return line.trim(); }).filter(Boolean);
      if (!lines.length) return '';
      if (lines.length > 1 && lines.every(function(line){ return /^- /.test(line); })) {
        return '<ul>' + lines.map(function(line){ return '<li>' + addInlineGlossaryLinks(line.replace(/^- /, ''), moduleId) + '</li>'; }).join('') + '</ul>';
      }
      if (/^\d+\./.test(lines[0])) return '<h4>' + addInlineGlossaryLinks(lines.join(' '), moduleId) + '</h4>' + renderLessonIllustrationsAfterHeading(lessonId, lines.join(' '));
      if (lines.length === 1 && /^(Introduzione|Nota per il Sommelier|Conclusione|Sintesi finale)$/i.test(lines[0])) {
        return '<h4>' + addInlineGlossaryLinks(lines[0], moduleId) + '</h4>' + renderLessonIllustrationsAfterHeading(lessonId, lines[0]);
      }
      return '<p>' + addInlineGlossaryLinks(lines.join(' '), moduleId) + '</p>';
    }).join('');
  }

  function renderActiveGlossaryNote(moduleId) {
    var item = findGlossaryItem(moduleId, state.activeGlossaryTerm);
    if (!item) return '';
    return [
      '<div class="sw-study-inline-term-note">',
        '<div class="sw-study-inline-term-note-title">Definizione Rapida</div>',
        '<div class="sw-study-inline-term-note-term">', esc(item.term || ''), '</div>',
        '<div class="sw-study-inline-term-note-desc">', esc(item.description || ''), '</div>',
      '</div>'
    ].join('');
  }

  function showGlossaryTerm(term) {
    state.activeGlossaryTerm = String(term || '').trim();
    renderStudy();
  }

  function renderLessonStudyNotes(lessonId) {
    var lesson = getLessonPayload(lessonId);
    var notes = lesson && lesson.study_notes ? lesson.study_notes : null;
    if (!notes) return '';
    return [
      '<section class="sw-study-lesson-notes">',
        '<div class="sw-study-note-card">',
          '<div class="sw-study-note-title">Cosa Devi Ricordare</div>',
          '<ul>',
            (notes.takeaways || []).map(function(item){ return '<li>' + esc(item) + '</li>'; }).join(''),
          '</ul>',
        '</div>',
        '<div class="sw-study-note-card">',
          '<div class="sw-study-note-title">Errore Comune</div>',
          '<p>', esc(notes.common_mistake || ''), '</p>',
        '</div>',
        '<div class="sw-study-note-card">',
          '<div class="sw-study-note-title">Termini Chiave</div>',
          '<div class="sw-study-term-chips">',
            (notes.terms || []).map(function(item){ return '<span class="sw-study-term-chip">' + esc(item) + '</span>'; }).join(''),
          '</div>',
        '</div>',
      '</section>'
    ].join('');
  }

  function getQuickReviewState(lessonId) {
    if (state.lessonQuickReview && state.lessonQuickReview.lessonId === lessonId) return state.lessonQuickReview;
    return { lessonId: lessonId, selectedIndex: null, submitted: false };
  }

  function renderLessonQuickReview(lessonId) {
    var lesson = getLessonPayload(lessonId);
    var review = lesson && lesson.quick_review ? lesson.quick_review : null;
    if (!review) return '';
    var current = getQuickReviewState(lessonId);
    var isAnswered = typeof current.selectedIndex === 'number' && current.selectedIndex >= 0;
    var isCorrect = current.selectedIndex === Number(review.correct_index);
    return [
      '<section class="sw-study-quick-review">',
        '<div class="sw-study-quick-review-title">Ripasso Veloce</div>',
        '<div class="sw-study-quick-review-sub">Una domanda secca per fissare subito il concetto principale della lezione appena letta.</div>',
        '<div class="sw-study-quick-review-question">', esc(review.question || ''), '</div>',
        '<div class="sw-study-quick-review-options">',
          (review.options || []).map(function(option, index){
            var inputId = 'study_quick_review_' + lessonId + '_' + index;
            return [
              '<label class="sw-study-option" for="', esc(inputId), '">',
                '<input id="', esc(inputId), '" type="radio" name="study_quick_review_', esc(lessonId), '" value="', index, '" ',
                  (current.selectedIndex === index ? 'checked ' : ''),
                  'onchange="window.studyAnswerQuickReview&&window.studyAnswerQuickReview(\'', esc(lessonId), '\',', index, ')">',
                '<span>', esc(option), '</span>',
              '</label>'
            ].join('');
          }).join(''),
        '</div>',
        '<div class="sw-study-quick-review-actions">',
          '<button type="button" class="sw-study-btn" onclick="window.studySubmitQuickReview&&window.studySubmitQuickReview(\'', esc(lessonId), '\')">Verifica la risposta</button>',
          '<button type="button" class="sw-study-btn alt" onclick="window.studyResetQuickReview&&window.studyResetQuickReview(\'', esc(lessonId), '\')">Riprova</button>',
        '</div>',
        (current.submitted && isAnswered) ? [
          '<div class="sw-study-quick-review-feedback ', isCorrect ? 'is-ok' : 'is-ko', '">',
            '<b>', isCorrect ? 'Risposta corretta.' : 'Risposta da ripassare.', '</b> ',
            esc(review.explanation || ''),
          '</div>'
        ].join('') : (current.submitted ? '<div class="sw-study-quick-review-feedback is-ko"><b>Seleziona una risposta.</b> Scegli una sola opzione prima di verificare.</div>' : ''),
      '</section>'
    ].join('');
  }

  function renderModuleGlossary(moduleId) {
    var items = getModuleGlossaryItems(moduleId);
    if (!items.length) return '';
    return [
      '<div class="sw-study-glossary">',
        '<h3>Glossario del modulo</h3>',
        '<div class="sw-study-glossary-list">',
          items.map(function(item){
            return [
              '<div class="sw-study-glossary-item">',
                '<div class="sw-study-glossary-term">', esc(item.term || ''), '</div>',
                '<div class="sw-study-glossary-desc">', esc(item.description || ''), '</div>',
              '</div>'
            ].join('');
          }).join(''),
        '</div>',
      '</div>'
    ].join('');
  }

  function renderQuizBlock(lesson) {
    var quiz = Array.isArray(lesson && lesson.quiz) ? lesson.quiz : [];
    if (!quiz.length) return '';
    var savedResult = getQuizResultForLesson(lesson.id);
    var feedback = state.quizFeedback && state.quizFeedback.lessonId === lesson.id ? state.quizFeedback : null;
    var result = feedback || (savedResult ? {
      lessonId: lesson.id,
      score: savedResult.score,
      total: savedResult.total,
      correctAnswers: savedResult.correct_answers,
      explanations: []
    } : null);
    return [
      '<section class="sw-study-quiz">',
        '<h4>Quiz della lezione</h4>',
        '<div class="sw-study-quiz-sub">Ogni domanda ha una sola risposta corretta. Se leggi bene la lezione, il quiz diventa un vero ripasso ragionato e non un gioco a indovinare.</div>',
        '<form id="studyQuizForm">',
          quiz.map(function(question, index){
            return [
              '<div class="sw-study-question">',
                '<div class="sw-study-question-title">', esc((index + 1) + '. ' + question.question), '</div>',
                (question.options || []).map(function(option, optionIndex){
                  var inputId = 'study_q_' + index + '_' + optionIndex;
                  return [
                    '<label class="sw-study-option" for="', esc(inputId), '">',
                      '<input id="', esc(inputId), '" type="radio" name="study_q_', index, '" value="', optionIndex, '">',
                      '<span>', esc(option), '</span>',
                    '</label>'
                  ].join('');
                }).join(''),
              '</div>'
            ].join('');
          }).join(''),
        '</form>',
        '<div class="sw-study-actions">',
          '<button type="button" class="sw-study-btn" onclick="window.studySubmitQuiz&&window.studySubmitQuiz()">Correggi il quiz</button>',
          '<button type="button" class="sw-study-btn alt" onclick="window.studyResetQuiz&&window.studyResetQuiz()">Nuovo tentativo</button>',
        '</div>',
        result ? renderQuizFeedback(result, lesson) : '',
      '</section>'
    ].join('');
  }

  function renderQuizFeedback(result, lesson) {
    var quiz = Array.isArray(lesson && lesson.quiz) ? lesson.quiz : [];
    var explanations = Array.isArray(result.explanations) ? result.explanations : [];
    return [
      '<div class="sw-study-feedback">',
        '<strong>Risultato quiz</strong>',
        '<p>Hai risposto correttamente a <b>', esc(String(result.correctAnswers || 0)), '</b> domande su <b>', esc(String(result.total || quiz.length)), '</b>. Punteggio: <b>', esc(String(result.score || 0)), '%</b>.</p>',
        explanations.length ? '<div class="sw-study-feedback-list">' + explanations.map(function(item, index){
          if (typeof item === 'string') return '<div class="sw-study-feedback-item is-ko"><div class="sw-study-feedback-q">' + esc(String(index + 1)) + '</div><div class="sw-study-feedback-meta">' + esc(item) + '</div></div>';
          return [
            '<div class="sw-study-feedback-item ', item.ok ? 'is-ok' : 'is-ko', '">',
              '<div class="sw-study-feedback-q">', esc(String(index + 1) + '. ' + (item.question || '')), '</div>',
              '<div class="sw-study-feedback-meta"><b>', item.ok ? 'Corretta' : 'Da ripassare', '</b><br>La tua risposta: ', esc(item.selected || 'Nessuna risposta'), '<br>Risposta corretta: ', esc(item.correct || ''), (item.explanation ? '<br>Spiegazione: ' + esc(item.explanation) : ''), '</div>',
            '</div>'
          ].join('');
        }).join('') + '</div>' : '',
      '</div>'
    ].join('');
  }

  function renderModuleQuizResult(session) {
    var result = session && session.result ? session.result : null;
    if (!result) return '';
    return [
      '<div class="sw-study-feedback">',
        '<strong>Esito finale del quiz</strong>',
        '<p>Hai completato il quiz finale del modulo. Risposte corrette: <b>', esc(String(result.correctAnswers || 0)), '</b> su <b>', esc(String(result.total || 0)), '</b>. Punteggio finale: <b>', esc(String(result.score || 0)), '%</b>.</p>',
        '<div class="sw-study-feedback-list">',
          (result.details || []).map(function(item, index){
            return [
              '<div class="sw-study-feedback-item ', item.ok ? 'is-ok' : 'is-ko', '">',
                '<div class="sw-study-feedback-q">', esc(String(index + 1) + '. ' + (item.question || '')), '</div>',
                '<div class="sw-study-feedback-meta"><b>', item.ok ? 'Corretta' : 'Sbagliata', '</b><br>Lezione: ', esc(item.lessonTitle || ''), '<br>La tua risposta: ', esc(item.selected || 'Nessuna risposta'), '<br>Risposta corretta: ', esc(item.correct || ''), (item.explanation ? '<br>Spiegazione: ' + esc(item.explanation) : ''), '</div>',
              '</div>'
            ].join('');
          }).join(''),
        '</div>',
      '</div>'
    ].join('');
  }

  function renderModuleQuiz(module) {
    var session = state.moduleQuizSession;
    var result = session && session.result ? session.result : null;
    var current = session && !result ? session.questions[session.currentIndex] : null;
    var selected = current && session.answers ? session.answers[current.id] : null;
    return [
      '<div id="studyModuleQuiz" class="sw-study-module-quiz" oncopy="return false" oncut="return false" onpaste="return false" oncontextmenu="return false" ondragstart="return false">',
        '<div class="sw-study-quiz-kicker">QUIZ FINALE DEL MODULO</div>',
        '<h2 class="sw-study-reader-title">Verifica finale: ', esc(module.title || ''), '</h2>',
        '<div class="sw-study-reader-intro">Dieci domande, una alla volta, costruite a partire dalle dieci lezioni del modulo. Alla fine trovi il risultato completo con risposte corrette, sbagliate e spiegazioni.</div>',
        '<div class="sw-study-notice"><strong>Nota editoriale:</strong> questo quiz serve come verifica interna di ripasso. Non rappresenta esame ufficiale, certificazione professionale o parere tecnico-normativo.</div>',
        '<div class="sw-study-quiz-guard"><strong>Modalita studio protetta:</strong> in questa schermata blocco selezione, copia e menu contestuale del quiz. <span id="studyQuizGuardNote" class="sw-study-quiz-guard-note"></span></div>',
        session && session.loading ? '<div class="sw-study-empty">Caricamento quiz finale in corso...</div>' : '',
        session && !session.loading && session.error ? '<div class="sw-study-empty">' + esc(session.error) + '</div>' : '',
        result ? renderModuleQuizResult(session) : [
          (!session || session.loading || session.error || !(session.questions || []).length) ? '' : '<div class="sw-study-quiz-progress"><span>Domanda ' + esc(String((session.currentIndex || 0) + 1)) + ' / ' + esc(String((session.questions || []).length)) + '</span><span>' + esc(current && (current.lesson_title || current.lessonTitle) ? (current.lesson_title || current.lessonTitle) : '') + '</span></div>',
          '<div class="sw-study-quiz-step">',
            current && !session.loading && !session.error ? [
              '<div class="sw-study-question">',
                '<div class="sw-study-question-title">', esc(current.question || ''), '</div>',
                (current.options || []).map(function(option, optionIndex){
                  var inputId = 'module_quiz_' + String(session.currentIndex || 0) + '_' + String(optionIndex);
                  return [
                    '<label class="sw-study-option" for="', esc(inputId), '">',
                      '<input id="', esc(inputId), '" type="radio" name="module_quiz_answer" value="', esc(String(optionIndex)), '" ', Number(selected) === optionIndex ? 'checked' : '', ' onchange="window.studyAnswerModuleQuiz&&window.studyAnswerModuleQuiz(', optionIndex, ')">',
                      '<span>', esc(option), '</span>',
                    '</label>'
                  ].join('');
                }).join(''),
              '</div>'
            ].join('') : '',
          '</div>',
          '<div class="sw-study-actions">',
            '<button type="button" class="sw-study-btn alt" onclick="window.studyOpenLesson&&window.studyOpenLesson(\'', esc((module.lessons && module.lessons[0] && module.lessons[0].id) || ''), '\')">Torna alle lezioni</button>',
            (!session || session.loading || session.error || !(session.questions || []).length) ? '' : '<button type="button" class="sw-study-btn alt" onclick="window.studyPrevModuleQuiz&&window.studyPrevModuleQuiz()" ' + ((session.currentIndex || 0) <= 0 ? 'disabled' : '') + '>Domanda precedente</button>',
            (!session || session.loading || session.error || !(session.questions || []).length)
              ? ''
              : ((session.currentIndex || 0) < (session.questions || []).length - 1
                ? '<button type="button" class="sw-study-btn" onclick="window.studyNextModuleQuiz&&window.studyNextModuleQuiz()">Domanda successiva</button>'
                : '<button type="button" class="sw-study-btn" onclick="window.studyFinishModuleQuiz&&window.studyFinishModuleQuiz()">Concludi il quiz</button>'),
          '</div>'
        ].join(''),
        result ? '<div class="sw-study-actions"><button type="button" class="sw-study-btn" onclick="window.studyRestartModuleQuiz&&window.studyRestartModuleQuiz()">Ricomincia il quiz</button><button type="button" class="sw-study-btn alt" onclick="window.studyOpenLesson&&window.studyOpenLesson(\'' + esc((module.lessons && module.lessons[0] && module.lessons[0].id) || '') + '\')">Torna alle lezioni</button></div>' : '',
      '</div>'
    ].join('');
  }

  function showQuizGuardMessage(message) {
    var el = document.getElementById('studyQuizGuardNote');
    if (!el) return;
    el.textContent = message || '';
  }

  function bindModuleQuizGuards() {
    if (window.__swStudyQuizGuardsBound) return;
    window.__swStudyQuizGuardsBound = true;
    document.addEventListener('keydown', function(ev){
      if (state.activeView !== 'moduleQuiz') return;
      var key = String(ev.key || '').toLowerCase();
      var blockedCombo = (ev.ctrlKey || ev.metaKey) && ['c', 'u', 's', 'p'].indexOf(key) >= 0;
      var blockedPrint = key === 'printscreen';
      if (blockedCombo || blockedPrint) {
        ev.preventDefault();
        showQuizGuardMessage('Copia rapida e scorciatoie bloccate in questa schermata di verifica.');
      }
    }, true);
    document.addEventListener('copy', function(ev){
      if (state.activeView !== 'moduleQuiz') return;
      ev.preventDefault();
      showQuizGuardMessage('Copia del testo quiz non disponibile in questa modalita.');
    }, true);
    document.addEventListener('contextmenu', function(ev){
      if (state.activeView !== 'moduleQuiz') return;
      ev.preventDefault();
      showQuizGuardMessage('Menu contestuale disattivato durante il quiz finale.');
    }, true);
  }

  async function startModuleQuiz(moduleId) {
    var module = getModuleById(moduleId) || getCurrentModule();
    if (!module) return;
    if (!canStartModuleQuiz(module.id)) return;
    state.activeModuleId = module.id;
    state.activeView = 'moduleQuiz';
    state.moduleQuizSession = {
      moduleId: module.id,
      currentIndex: 0,
      questions: [],
      answers: {},
      result: null,
      loading: true,
      error: ''
    };
    bindModuleQuizGuards();
    renderStudy();
    try {
      var data = await studyFetch('/api/study/module-quiz?id=' + encodeURIComponent(module.id));
      var questions = Array.isArray(data && data.questions) ? data.questions : [];
      state.moduleQuizSession = {
        moduleId: module.id,
        currentIndex: 0,
        questions: questions.map(function(item, index){
          return Object.assign({ id: 'mq_' + module.id + '_' + index }, item);
        }),
        answers: {},
        result: null,
        loading: false,
        error: questions.length ? '' : 'Quiz del modulo non disponibile in questo momento.'
      };
      if (state.syncStatus !== 'local_only') setStudySync('remote_ok', '');
    } catch(e) {
      state.moduleQuizSession = {
        moduleId: module.id,
        currentIndex: 0,
        questions: [],
        answers: {},
        result: null,
        loading: false,
        error: 'Quiz finale non disponibile senza connessione al backend Study.'
      };
      state.lastError = e && e.message ? e.message : 'Quiz finale non disponibile';
      setStudySync('local_only', 'Quiz finale disponibile solo dal backend remoto. Se il worker non risponde, il test finale viene temporaneamente disattivato.');
    }
    renderStudy();
  }

  function answerModuleQuiz(optionIndex) {
    if (!state.moduleQuizSession || state.activeView !== 'moduleQuiz') return;
    var session = state.moduleQuizSession;
    var current = session.questions[session.currentIndex];
    if (!current) return;
    session.answers[current.id] = Number(optionIndex);
  }

  function prevModuleQuizQuestion() {
    if (!state.moduleQuizSession || state.activeView !== 'moduleQuiz') return;
    if (state.moduleQuizSession.currentIndex > 0) state.moduleQuizSession.currentIndex -= 1;
    renderStudy();
  }

  function nextModuleQuizQuestion() {
    if (!state.moduleQuizSession || state.activeView !== 'moduleQuiz') return;
    var current = state.moduleQuizSession.questions[state.moduleQuizSession.currentIndex];
    if (current && typeof state.moduleQuizSession.answers[current.id] !== 'number') {
      showQuizGuardMessage('Prima scegli una delle quattro risposte.');
      return;
    }
    if (state.moduleQuizSession.currentIndex < state.moduleQuizSession.questions.length - 1) state.moduleQuizSession.currentIndex += 1;
    renderStudy();
  }

  async function finishModuleQuiz() {
    if (!state.moduleQuizSession || state.activeView !== 'moduleQuiz') return;
    var session = state.moduleQuizSession;
    var current = session.questions[session.currentIndex];
    if (current && typeof session.answers[current.id] !== 'number') {
      showQuizGuardMessage('Seleziona una risposta prima di concludere il quiz.');
      return;
    }
    var correctAnswers = 0;
    var details = session.questions.map(function(question){
      var answerIndex = typeof session.answers[question.id] === 'number' ? session.answers[question.id] : -1;
      var ok = answerIndex === Number(question.correct_index);
      if (ok) correctAnswers += 1;
      return {
        lessonTitle: question.lesson_title,
        question: question.question,
        ok: ok,
        selected: answerIndex >= 0 && question.options[answerIndex] ? question.options[answerIndex] : 'Nessuna risposta',
        correct: question.options[Number(question.correct_index)] || '',
        explanation: question.explanation || ''
      };
    });
    var score = session.questions.length ? Math.round((correctAnswers / session.questions.length) * 100) : 0;
    session.result = {
      correctAnswers: correctAnswers,
      total: session.questions.length,
      score: score,
      details: details
    };
    await saveProgress({
      quiz_result: {
        lesson_id: 'module_quiz:' + session.moduleId,
        score: score,
        total: session.questions.length,
        correct_answers: correctAnswers,
        completed_at: new Date().toISOString()
      }
    });
    renderStudy();
  }

  function restartModuleQuiz() {
    var module = getCurrentModule();
    if (!module) return;
    startModuleQuiz(module.id);
  }

  function renderStudy() {
    var root = document.getElementById('studyApp');
    if (!root) return;
    injectStudyCss();
    var currentModule = getCurrentModule();
    var currentLessonMeta = getCurrentLessonMeta();
    var completedCount = (state.progress.lessons_completed || []).length;
    var quizDoneCount = getModuleQuizDoneCount();
    var currentModuleCompletedCount = currentModule ? getCompletedLessonsCountForModule(currentModule.id) : 0;
    var currentModuleQuizReady = currentModule ? canStartModuleQuiz(currentModule.id) : false;
    var studyLang = getStudyLang();
    function tx4(it,en,fr,ru){ var o = {it:it,en:en,fr:fr,ru:ru}; return o[studyLang] || o.it; }
    var headTag = tx4('Manuale del Sommelier','Sommelier Handbook','Manuel du Sommelier','Учебник сомелье');
    var headSub = tx4(
      currentModule ? (currentModule.title || '') : 'Scegli un modulo e inizia a studiare',
      currentModule ? (currentModule.title_en || currentModule.title || '') : 'Pick a module and start studying',
      currentModule ? (currentModule.title_fr || currentModule.title || '') : 'Choisissez un module et commencez a etudier',
      currentModule ? (currentModule.title_ru || currentModule.title || '') : 'Выберите модуль и начните обучение'
    );
    var backLabel = tx4('← Torna alla Home','← Back to Home','← Retour a l accueil','← На главную');
    var lockMsg = tx4('Completa tutte le 10 lezioni per sbloccare','Complete all 10 lessons to unlock','Terminez les 10 lecons pour deverrouiller','Завершите все 10 лекций, чтобы разблокировать');
    var unlockMsg = tx4('Modulo completato — avvia la verifica','Module complete — start the review','Module termine — commencez la revision','Модуль завершён — начните итоговый тест');
    var completedLabel = tx4('studiata','completed','etudiee','изучено');
    var todoLabel = tx4('da iniziare','to start','a commencer','к изучению');
    var emptyMsg = tx4(
      'Scegli una lezione dall indice a sinistra, oppure inizia dalla numero 1.',
      'Choose a lesson from the table of contents on the left, or start with lesson 1.',
      'Choisissez une lecon dans la table des matieres a gauche, ou commencez par la lecon 1.',
      'Выберите лекцию в оглавлении слева или начните с лекции 1.'
    );
    var prevLabel = tx4('← Lezione precedente','← Previous lesson','← Lecon precedente','← Предыдущая лекция');
    var nextLabel = tx4('Prossima lezione →','Next lesson →','Lecon suivante →','Следующая лекция →');
    var completeLabel = tx4('Segna come studiata','Mark as studied','Marquer comme etudiee','Отметить как изученное');
    var quizLabel = tx4('Vai alla verifica finale →','Go to final review →','Vers la revision finale →','К итоговому тесту →');

    var leftPageHtml = '';
    var rightPageHtml = '';

    if (currentModule) {
      function lessonSubtitles(lid){
        var map = {
          'lesson_vine_origins': tx4(
            'Origine della vite, le principali regole di coltivazione in vigna.',
            'Origins of the vine and the main vineyard cultivation rules.',
            'Origine de la vigne et les principales regles de culture au vignoble.',
            'Происхождение виноградной лозы и основные правила ухода за виноградником.'
          ),
          'lesson_grape_maturity': tx4(
            'Zuccheri, acidi e aromi: come matura l\'acino e quando conviene raccogliere.',
            'Sugars, acids and aromas: how the grape ripens and when to harvest.',
            'Sucres, acides et aromes : comment murit le raisin et quand recolter.',
            'Сахара, кислоты и ароматы: как созревает ягода и когда собирать урожай.'
          ),
          'lesson_harvest_timing': tx4(
            'La scelta del giorno di vendemmia tra maturazione tecnica e aromatica.',
            'Choosing harvest day between technical and aromatic ripeness.',
            'Choisir le jour des vendanges entre maturite technique et aromatique.',
            'Выбор дня сбора урожая: техническая и ароматическая спелость.'
          ),
          'lesson_fermentazione_04': tx4(
            'La fermentazione alcolica: da mosto a vino, cosa fanno i lieviti e come si guida il processo.',
            'Alcoholic fermentation: from must to wine, what yeasts do and how to guide the process.',
            'La fermentation alcoolique : du moitin au vin, ce que font les levures.',
            'Спиртовое брожение: от сусла к вину, что делают дрожжи.'
          ),
          'lesson_vinificazione_05': tx4(
            'Le differenze pratiche tra vinificazione in bianco, in rosso e in rosato.',
            'Practical differences between white, red and rose winemaking.',
            'Differences pratiques entre vinification en blanc, en rouge et en rose.',
            'Практические отличия белого, красного и розового виноделия.'
          ),
          'lesson_aging_vessels_06': tx4(
            'Acciaio, legno, cemento, anfora: come cambia il vino durante l\'affinamento in ogni recipiente.',
            'Steel, wood, concrete, amphora: how wine changes during aging in each vessel.',
            'Acier, bois, beton, amphore : comment le vin evolue selon le recipient.',
            'Сталь, дерево, бетон, амфора: как меняется вино при выдержке.'
          ),
          'lesson_tasting_foundation': tx4(
            'Analisi visiva, olfattiva e gustativa: le basi semplici della degustazione professionale.',
            'Visual, olfactory and taste analysis: the simple basics of professional tasting.',
            'Analyse visuelle, olfactive et gustative : les bases de la degustation.',
            'Визуальный, обонятельный и вкусовой анализ: основы профессиональной дегустации.'
          ),
          'lesson_balance_structure_08': tx4(
            'Alcol, acidi, tannini e zucchero: come si costruiscono equilibrio e struttura in un vino.',
            'Alcohol, acids, tannins and sugar: how balance and structure are built in a wine.',
            'Alcool, acides, tanins et sucre : comment construire equilibre et structure.',
            'Спирт, кислоты, танины и сахар: как строятся баланс и структура вина.'
          ),
          'lesson_sparkling_wines_09': tx4(
            'Spumanti Metodo Classico e Metodo Charmat-Martinotti: fasi, differenze e punti chiave.',
            'Sparkling wines Traditional Method and Charmat-Martinotti: steps, differences and key points.',
            'Effervescents Methode Classique et Charmat-Martinotti : etapes et differences.',
            'Игристое вино: Классический метод и Шарма-Мартинотти — этапы и отличия.'
          ),
          'lesson_label_service_10': tx4(
            'DOC, DOCG, IGT: come leggere l\'etichetta e le regole del servizio in sala.',
            'DOC, DOCG, IGT: how to read the label and the rules of table service.',
            'DOC, DOCG, IGT : lire l\'etiquette et les regles du service en salle.',
            'DOC, DOCG, IGT: как читать этикетку и правила подачи за столом.'
          )
        };
        return map[lid] || '';
      }
      var tocRows = currentModule.lessons.map(function(lesson){
        var active = state.activeLessonId === lesson.id && state.activeView !== 'moduleQuiz';
        var done = isLessonCompleted(lesson.id);
        var stateTxt = done ? completedLabel : todoLabel;
        var order = String(lesson.sort_order || '').padStart(2,'0');
        var sub = lessonSubtitles(lesson.id);
        return '<li class="sw-book-toc-item ' + (active?'active':'') + (done?' done':'') + '" onclick="window.studyOpenLesson&&window.studyOpenLesson(\'' + esc(lesson.id) + '\')">' +
          '<div class="sw-book-toc-row">' +
            '<span class="sw-book-toc-num">' + order + '</span>' +
            '<span class="sw-book-toc-title">' + esc(lesson.title || '') + '</span>' +
            '<span class="sw-book-toc-state">' + esc(stateTxt) + '</span>' +
          '</div>' +
          (sub ? '<div class="sw-book-toc-sub">' + esc(sub) + '</div>' : '') +
        '</li>';
      }).join('');
      var quizLocked = !currentModuleQuizReady;
      var quizActive = state.activeView === 'moduleQuiz';
      var quizTitle = tx4('Verifica finale del modulo','Module Final Review','Revision finale du module','Итоговый тест модуля');
      var quizDesc = quizLocked ? lockMsg : unlockMsg;
      var quizRow = '<div class="sw-book-quiz-entry ' + (quizLocked?'sw-book-quiz-entry-locked':'') + (quizActive?' active':'') + '"' +
        (quizLocked ? '' : ' onclick="window.studyStartModuleQuiz&&window.studyStartModuleQuiz(\'' + esc(currentModule.id) + '\')"') + '>' +
        '<div class="sw-book-quiz-title">★ ' + esc(quizTitle) + '</div>' +
        '<div class="sw-book-quiz-desc">' + esc(quizDesc) + ' (' + esc(currentModuleCompletedCount + '/' + currentModule.lessons.length) + ')</div>' +
      '</div>';

      leftPageHtml = [
        '<div class="sw-book-cover-label">' + esc(headTag) + '</div>',
        '<h2 class="sw-book-cover-title">' + esc(currentModule.title || '') + '</h2>',
        '<div class="sw-book-cover-divider"></div>',
        '<p class="sw-book-cover-sub">' + esc(currentModule.intro || '') + '</p>',
        '<h4 style="font-family:Cinzel,serif;font-size:.68rem;letter-spacing:3px;text-transform:uppercase;color:#5a3e20;text-align:center;margin:0 0 10px 0;opacity:.9;">' +
          esc(tx4('Indice delle Lezioni','Lesson Index','Table des Matieres','Содержание лекций')) +
        '</h4>',
        '<ol class="sw-book-toc">',
          tocRows,
        '</ol>',
        quizRow
      ].join('');
    } else {
      leftPageHtml = [
        '<div class="sw-book-cover-label">' + esc(headTag) + '</div>',
        '<h2 class="sw-book-cover-title">Sommelier World</h2>',
        '<div class="sw-book-cover-divider"></div>',
        '<p class="sw-book-cover-sub">' + esc(headSub) + '</p>',
        '<div style="text-align:center;opacity:.7;font-family:Cormorant Garamond,serif;font-style:italic;">' +
          esc(tx4('Caricamento dei moduli in corso…','Loading modules…','Chargement des modules…','Загрузка модулей…')) +
        '</div>'
      ].join('');
    }

    if (state.activeView === 'moduleQuiz' && currentModule) {
      rightPageHtml = '<div class="sw-book-lesson-prose" style="padding-top:6px;">' + renderModuleQuiz(currentModule) + '</div>';
    } else if (currentLessonMeta) {
      rightPageHtml = renderBookLessonReader(currentLessonMeta, {
        completeLabel: completeLabel,
        prevLabel: prevLabel,
        nextLabel: nextLabel,
        quizLabel: quizLabel
      });
    } else {
      rightPageHtml = [
        '<div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100%;min-height:420px;text-align:center;">',
          '<div style="font-family:Cinzel,serif;font-size:.72rem;letter-spacing:4px;color:#5a3e20;opacity:.88;text-transform:uppercase;margin-bottom:14px;">FOLIO 0 · ' + esc(headTag) + '</div>',
          '<h3 style="font-family:Playfair Display,serif;font-weight:700;font-size:1.55rem;line-height:1.25;color:#1a0c04;margin:0 0 14px 0;">' +
            esc(headSub) +
          '</h3>',
          '<div class="sw-book-lesson-divider"></div>',
          '<p style="font-family:Cormorant Garamond,serif;font-size:1.05rem;line-height:1.6;color:rgba(42,28,16,.75);max-width:80%;margin:0 auto;">' +
            esc(emptyMsg) +
          '</p>',
        '</div>'
      ].join('');
    }

    var currentLessonIdx = -1;
    if (currentModule && currentLessonMeta) {
      currentLessonIdx = currentModule.lessons.findIndex(function(l){ return l.id === currentLessonMeta.id; });
    }
    var hasPrev = currentLessonIdx > 0;
    var hasNext = currentModule && currentLessonIdx >= 0 && currentLessonIdx < currentModule.lessons.length - 1;
    var prevLesson = hasPrev ? currentModule.lessons[currentLessonIdx - 1] : null;
    var nextLesson = hasNext ? currentModule.lessons[currentLessonIdx + 1] : null;
    var moduleQuizReadyNav = currentModule && !hasNext && canStartModuleQuiz(currentModule.id);

    root.innerHTML = [
      '<div class="sw-book-shell">',
        '<header class="sw-book-head">',
          '<div class="sw-book-head-tag">', esc(headTag), '</div>',
          '<h1 class="sw-book-head-title">', esc(tx4('Manuale di Studio del Sommelier','Sommelier Study Handbook','Manuel d Etude du Sommelier','Учебное пособие сомелье')), '</h1>',
          '<p class="sw-book-head-sub">', esc(headSub), ' · ' + esc(String(currentModuleCompletedCount) + '/' + String((currentModule && currentModule.lessons && currentModule.lessons.length) || 0)) + ' ' + esc(tx4('lezioni svolte','lessons completed','lecons faites','лекций завершено')) + '</p>',
        '</header>',
        '<div class="sw-book-stage">',
          '<div class="sw-book">',
            '<div class="sw-book-page sw-book-page-left">',
              '<span class="sw-book-pagenum">I</span>',
              leftPageHtml,
            '</div>',
            '<div class="sw-book-spine" aria-hidden="true"></div>',
            '<div class="sw-book-page sw-book-page-right">',
              '<span class="sw-book-pagenum">II</span>',
              rightPageHtml,
            '</div>',
          '</div>',
        '</div>',
        '<nav class="sw-book-nav">',
          '<button type="button" class="sw-book-nav-back" onclick="window.showPage&&window.showPage(\'home\')">', esc(backLabel), '</button>',
          '<div class="sw-book-nav-flow" style="display:flex;gap:10px;">',
            hasPrev && prevLesson ? '<button type="button" onclick="window.studyOpenLesson&&window.studyOpenLesson(\'' + esc(prevLesson.id) + '\')">' + esc(prevLabel) + '</button>' : '',
            state.activeView !== 'moduleQuiz' && currentLessonMeta ? '<button type="button" onclick="window.studyCompleteLesson&&window.studyCompleteLesson()">' + esc(completeLabel) + '</button>' : '',
            hasNext && nextLesson ? '<button type="button" onclick="window.studyOpenLesson&&window.studyOpenLesson(\'' + esc(nextLesson.id) + '\')">' + esc(nextLabel) + '</button>' : '',
            moduleQuizReadyNav ? '<button type="button" onclick="window.studyStartModuleQuiz&&window.studyStartModuleQuiz(\'' + esc(currentModule.id) + '\')">' + esc(quizLabel) + '</button>' : '',
          '</div>',
        '</nav>',
      '</div>'
    ].join('');
  }

  function buildCharmatDiagramSvg(lang) {
    function tx4(it,en,fr,ru){ var o={it:it,en:en,fr:fr,ru:ru}; return o[lang]||o.it; }
    function tank1(cx,cy,w,h){
      return [
        '<path d="M',cx-w/2,',',cy-h/2,' h',w,' v',h-14,' q0,14 -',w/2,',14 q-',w/2,',0 -',w/2,',-14 z" fill="url(#chTankSteel)" stroke="#5a5a5a" stroke-width="1.6"/>',
        '<ellipse cx="',cx,'" cy="',cy-h/2,'" rx="',w/2,'" ry="8" fill="#e8e8e8" stroke="#5a5a5a" stroke-width="1.6"/>',
        '<rect x="',cx-w/2+3,'" y="',cy-h/2+8+10,'" width="',w-6,'" height="',Math.max(8,h*0.48),'" fill="url(#chWine)" opacity="0.78"/>',
        '<line x1="',cx,'" y1="',cy-h/2-10,'" x2="',cx,'" y2="',cy-h/2-20,'" stroke="#4a4a4a" stroke-width="1.4"/>',
        '<circle cx="',cx,'" cy="',cy-h/2-24,'" r="4" fill="#4a4a4a" opacity="0.7"/>'
      ].join('');
    }
    function labelBox(cx,cy,tx,txt){
      var txtLen = String(txt).length;
      var estW = Math.max(150, Math.min(260, 40 + txtLen * (tx >= 15 ? 8.4 : 7.8)));
      var h = 34;
      var rx = cx - estW/2, ry = cy - h/2;
      return [
        '<rect x="',rx,'" y="',ry,'" width="',estW,'" height="',h,'" rx="9" fill="#ffffff" stroke="#5a3e20" stroke-width="1.8" opacity="0.99"/>',
        '<line x1="',rx+10,'" y1="',ry+7,'" x2="',rx+10+22,'" y2="',ry+7,'" stroke="#9c7a46" stroke-width="2" stroke-linecap="round" opacity="0.85"/>',
        '<text x="',cx,'" y="',cy+6,'" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-size="',tx,'" font-weight="700" fill="#2a1c10">',txt,'</text>'
      ].join('');
    }
    function arrowH(x1,y1,x2,y2,dashed){
      var dash = dashed ? ' stroke-dasharray="6,4"' : '';
      return [
        '<line x1="',x1,'" y1="',y1,'" x2="',x2,'" y2="',y2,'" stroke="#6b4a1e" stroke-width="2.2" fill="none"',dash,'/>',
        '<polygon points="',x2,',',y2,' ',x2-8,',',y2-4.5,' ',x2-8,',',y2+4.5,'" fill="#6b4a1e"/>'
      ].join('');
    }
    function bottlesRow(){
      var arr = [];
      var bx = 808;
      for (var i = 0; i < 4; i++) {
        arr.push(
          '<g transform="translate('+bx+',186)">'+
            '<rect x="-3" y="0" width="6" height="6" rx="1" fill="#73624a"/>'+
            '<rect x="-5" y="6" width="10" height="6" fill="#b09574"/>'+
            '<path d="M-9,12 L9,12 L11,50 L-11,50 Z" fill="#7a9e3c" opacity="0.85" stroke="#5a7a2e" stroke-width="1.1"/>'+
            '<ellipse cx="0" cy="50" rx="11" ry="2.4" fill="#5a7a2e" opacity="0.9"/>'+
          '</g>'
        );
        bx += 18;
      }
      return arr.join('');
    }

    var phase1Txt = tx4('Vino Base','Base Wine','Vin de Base','Основное Вино');
    var phase2Txt = tx4('Liqueur de Tirage','Tirage Liqueur','Liqueur de Tirage','Ликёр де Тираж');
    var phase3Txt = tx4('Autoclave · Rifermentazione','Autoclave · 2nd Fermentation','Autoclave · 2e Fermentation','Автоклав · 2-е Брожение');
    var phase4Txt = tx4('Filtrazione · Imbottigliamento','Filtration · Bottling','Filtration · Mise en Bouteille','Фильтрация · Розлив');

    return [
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 420" role="img" aria-label="Diagramma Metodo Charmat Martinotti">',
        '<defs>',
          '<linearGradient id="chTankSteel" x1="0" x2="1" y1="0" y2="1">',
            '<stop offset="0" stop-color="#fafafa"/>',
            '<stop offset="0.5" stop-color="#d9d9d9"/>',
            '<stop offset="1" stop-color="#b0b0b0"/>',
          '</linearGradient>',
          '<linearGradient id="chAutoclave" x1="0" x2="1" y1="0" y2="1">',
            '<stop offset="0" stop-color="#e8eef2"/>',
            '<stop offset="0.55" stop-color="#b8c6cf"/>',
            '<stop offset="1" stop-color="#8799a3"/>',
          '</linearGradient>',
          '<linearGradient id="chWine" x1="0" x2="0" y1="0" y2="1">',
            '<stop offset="0" stop-color="#f4e2c0"/>',
            '<stop offset="1" stop-color="#c9a46a"/>',
          '</linearGradient>',
          '<linearGradient id="chLiquidGold" x1="0" x2="1" y1="0" y2="0">',
            '<stop offset="0" stop-color="#d4af37"/>',
            '<stop offset="1" stop-color="#f0d77d"/>',
          '</linearGradient>',
        '</defs>',
        '<rect x="0" y="0" width="900" height="420" fill="#fbf9f5"/>',
        '<rect x="0" y="400" width="900" height="20" fill="#efe7d4" opacity="0.9"/>',

        tank1(80,180,64,170),
        tank1(160,180,64,170),
        tank1(80,320,64,120),
        tank1(160,320,64,120),
        labelBox(120, 398, 15, phase1Txt),

        '<line x1="112" y1="265" x2="112" y2="280" stroke="#4a4a4a" stroke-width="1.6"/>',
        '<line x1="192" y1="265" x2="192" y2="280" stroke="#4a4a4a" stroke-width="1.6"/>',
        '<line x1="112" y1="280" x2="240" y2="280" stroke="#4a4a4a" stroke-width="1.8"/>',
        '<line x1="192" y1="380" x2="240" y2="380" stroke="#4a4a4a" stroke-width="1.8"/>',
        '<line x1="112" y1="380" x2="192" y2="380" stroke="#4a4a4a" stroke-width="1.8"/>',
        '<line x1="240" y1="280" x2="240" y2="380" stroke="#4a4a4a" stroke-width="1.8"/>',
        arrowH(252,330,312,210,true),

        '<rect x="312" y="170" width="80" height="82" rx="8" fill="url(#chTankSteel)" stroke="#5a5a5a" stroke-width="1.8"/>',
        '<ellipse cx="352" cy="170" rx="32" ry="7" fill="#e8e8e8" stroke="#5a5a5a" stroke-width="1.6"/>',
        '<rect x="320" y="185" width="64" height="56" rx="4" fill="url(#chLiquidGold)" opacity="0.28"/>',
        '<rect x="328" y="160" width="48" height="10" rx="3" fill="#d4af37" opacity="0.75"/>',
        '<circle cx="352" cy="152" r="4" fill="#5a3e20" opacity="0.7"/>',
        labelBox(352, 298, 15, phase2Txt),
        arrowH(394,210,458,210,false),

        '<g>',
          '<rect x="458" y="120" width="200" height="182" rx="26" fill="url(#chAutoclave)" stroke="#4b5a62" stroke-width="2.4"/>',
          '<rect x="470" y="140" width="176" height="144" rx="18" fill="none" stroke="#6d7e86" stroke-width="1" stroke-dasharray="2,3" opacity="0.6"/>',
          '<circle cx="508" cy="210" r="16" fill="none" stroke="#3f4c54" stroke-width="2" opacity="0.85"/>',
          '<line x1="508" y1="210" x2="508" y2="198" stroke="#5a3e20" stroke-width="1.6" stroke-linecap="round"/>',
          '<circle cx="508" cy="210" r="2" fill="#3f4c54"/>',
          '<line x1="480" y1="284" x2="636" y2="284" stroke="#3f4c54" stroke-width="1.8"/>',
          '<path d="M478,170 q28,-14 60,-14 q80,0 120,14" fill="none" stroke="#3f4c54" stroke-width="1.4" opacity="0.8"/>',
          '<path d="M478,260 q28,14 60,14 q80,0 120,-14" fill="none" stroke="#3f4c54" stroke-width="1.4" opacity="0.8"/>',
          '<rect x="460" y="124" width="12" height="172" rx="3" fill="#7a8b94" opacity="0.8"/>',
          '<rect x="644" y="124" width="12" height="172" rx="3" fill="#7a8b94" opacity="0.8"/>',
        '</g>',
        labelBox(558, 346, 15, phase3Txt),
        arrowH(660,210,722,210,false),

        '<rect x="722" y="180" width="48" height="62" rx="4" fill="#e5eef3" stroke="#5e7280" stroke-width="1.6"/>',
        '<rect x="726" y="188" width="40" height="10" fill="#8aa6b5" opacity="0.55"/>',
        '<rect x="726" y="204" width="40" height="10" fill="#8aa6b5" opacity="0.55"/>',
        '<rect x="726" y="220" width="40" height="10" fill="#8aa6b5" opacity="0.55"/>',
        arrowH(770,211,800,211,true),

        '<line x1="800" y1="211" x2="880" y2="211" stroke="#6b4a1e" stroke-width="2.2"/>',
        bottlesRow(),
        labelBox(830, 308, 15, phase4Txt),

        '<line x1="0" y1="400" x2="900" y2="400" stroke="#bba570" stroke-width="1" opacity="0.55"/>',
      '</svg>'
    ].join('');
  }

  function renderCharmatDiagramBlock(lang) {
    function tx4(it,en,fr,ru){ var o={it:it,en:en,fr:fr,ru:ru}; return o[lang]||o.it; }
    var captionTitle = tx4(
      'Schema Metodo Charmat / Martinotti',
      'Charmat / Martinotti Method Diagram',
      'Schema de la Methode Charmat / Martinotti',
      'Схема метода Шарма / Мартинотти'
    );
    var captionSub = tx4(
      'Le 4 fasi tecniche della rifermentazione in autoclave: ogni blocco riporta direttamente il nome della fase nella lingua selezionata.',
      'The 4 technical steps of autoclave secondary fermentation: each block shows the phase name directly in the selected language.',
      'Les 4 phases techniques de la fermentation secondaire en autoclave : chaque bloc indique directement le nom de la phase dans la langue selectionnee.',
      '4 технических этапа вторичного брожения в автоклаве: каждый блок показывает название стадии на выбранном языке.'
    );
    var rows = [
      {
        it:'I serbatoi del vino base (cuvée): le partite possono essere assemblate da più vini base o blocchi di vitigno.',
        en:'Still base wine tanks (cuvée): batches can be blended from multiple base wines or grape lots.',
        fr:'Cuves de vin de base tranquille (cuvée) : les lots peuvent etre assembles a partir de plusieurs vins de base ou parcelles.',
        ru:'Резервуары с основным вином (кюве): партии составляются из нескольких базовых вин или партий винограда.'
      },
      {
        it:'Aggiunta di liqueur de tirage: zucchero, lieviti selezionati, sostanze nutritive e chiarificanti. Preparazione per la presa di spuma.',
        en:'Addition of liqueur de tirage: sugar, selected yeasts, nutrients and clarifying agents. Preparation for the second fermentation.',
        fr:'Ajout de liqueur de tirage : sucre, levains selectionnes, nutriments et clarifiants. Preparation pour la prise de mousse.',
        ru:'Добавление ликёр де тираж: сахар, селективные дрожжи, питательные вещества и осветлители — подготовка к газированию.'
      },
      {
        it:'Rifermentazione in autoclave chiusa, pressurizzata e termocontrollata (14-16 °C). La CO2 non si disperde e si scioglie nel vino: presa di spuma isobarica.',
        en:'Secondary fermentation in a closed, pressurized, temperature-controlled autoclave (14-16 °C). CO2 is trapped and dissolves into the wine — isobaric sparkling process.',
        fr:'Fermentation secondaire en autoclave ferme, pressurisee et thermoregulee (14-16 °C). Le CO2 est retenu et se dissout dans le vin : prise de mousse isobare.',
        ru:'Вторичное брожение в закрытом автоклаве под давлением и термоконтролем (14-16 °C). CO₂ запирается и растворяется в вине — изобарическое газирование.'
      },
      {
        it:'Filtrazione isobarica (per mantenere la pressione), stabilizzazione tartrica a freddo, dosaggio della liqueur d\'expedition e imbottigliamento definitivo sotto pressione.',
        en:'Isobaric filtration (to preserve pressure), cold tartrate stabilization, liqueur d\'expedition dosage and final bottling under pressure.',
        fr:'Filtration isobare (preservation de la pression), stabilisation tartrique a froid, dosage de la liqueur d\'expedition et mise en bouteille finale sous pression.',
        ru:'Изобарическая фильтрация (с сохранением давления), холодная тартратная стабилизация, дозирование ликёр д экспедисьон и финальный розлив под давлением.'
      }
    ];
    return [
      '<figure class="sw-study-figure" style="margin:1.9rem 0 2.3rem;">',
        buildCharmatDiagramSvg(lang),
        '<figcaption style="margin-top:0.9rem;">',
          '<div style="font-family:Cinzel,serif;font-size:.58rem;letter-spacing:2.5px;text-transform:uppercase;color:#5a3e20;margin:0 0 .35rem;">',
            esc(tx4('Schema Tecnico · 4 Fasi','Technical Diagram · 4 Steps','Schema Technique · 4 Phases','Техническая схема · 4 этапа')),
          '</div>',
          '<div class="sw-study-figure-title">' + esc(captionTitle) + '</div>',
          captionSub ? '<div class="sw-study-figure-text">' + esc(captionSub) + '</div>' : '',
        '</figcaption>',
        '<div class="sw-book-legend" style="margin-top:14px;">',
          '<div style="font-family:Cinzel,serif;font-size:.56rem;letter-spacing:2px;text-transform:uppercase;color:#5a3e20;margin-bottom:6px;">',
            esc(tx4('Note Tecniche','Technical Notes','Notes Techniques','Технические заметки')),
          '</div>',
          rows.map(function(r, i){
            return '<div class="sw-book-legend-row">' +
              '<span class="sw-book-legend-num">' + String(i + 1) + '.</span>' +
              '<span>' + esc(String(tx4(r.it,r.en,r.fr,r.ru))) + '</span>' +
            '</div>';
          }).join(''),
        '</div>',
      '</figure>'
    ].join('');
  }

  function renderBookLessonReader(lessonMeta, labels) {
    function tx4(it,en,fr,ru){ var o={it:it,en:en,fr:fr,ru:ru}; return o[getStudyLang()]||o.it; }
    var lesson = state.activeLesson || state.lessonCache[lessonMeta.id] || null;
    var currentModule = getCurrentModule();
    var lang = getStudyLang();
    var pagePrevLbl = tx4('← Pagina precedente','← Previous page','← Page precedente','← Предыдущая страница');
    var pageNextLbl = tx4('Prossima pagina →','Next page →','Page suivante →','Следующая страница →');

    function splitProseByHeadings(proseHtml) {
      var tmp = document.createElement('div');
      tmp.innerHTML = proseHtml || '';
      var children = Array.prototype.slice.call(tmp.children || []);
      var groups = [];
      var current = [];
      function flush(){ if (current.length) { groups.push(current); current = []; } }
      for (var i = 0; i < children.length; i++) {
        var el = children[i];
        var tag = (el.tagName || '').toLowerCase();
        if (tag === 'h4' || tag === 'h3' || tag === 'h2' || tag === 'h5' || tag === 'h6') {
          flush();
          current.push(el.outerHTML);
        } else {
          current.push(el.outerHTML);
        }
      }
      flush();
      return groups.map(function(group){ return group.join(''); });
    }

    function buildLessonPages() {
      var pages = [];
      if (!lesson) {
        var fallbackHeader = [
          '<div class="sw-book-lesson-ctx">' + esc(String(lessonMeta.reading_minutes || 0) + ' MIN · ' + (lessonMeta.level || '')) + '</div>',
          '<h2 class="sw-book-lesson-title">' + esc(lessonMeta.title) + '</h2>',
          '<div class="sw-book-lesson-divider"></div>',
          '<p class="sw-book-lesson-intro">' + esc(lessonMeta.intro || '') + '</p>',
          '<div class="sw-book-lesson-callout"><h4>AVVISO</h4><p>' + esc(state.syncStatus === 'local_only' ? 'Lezione completa non disponibile senza backend Study.' : 'Caricamento lezione in corso...') + '</p></div>'
        ].join('');
        pages.push(fallbackHeader);
        return pages;
      }
      var currentTx = lesson.translations && lesson.translations[lang] ? lesson.translations[lang] : {};
      var baseTx = lesson.translations && lesson.translations.it ? lesson.translations.it : {};
      var tx = {
        title: String(currentTx.title || baseTx.title || lessonMeta.title || ''),
        intro: String(currentTx.intro || baseTx.intro || lessonMeta.intro || ''),
        body: String(currentTx.body || baseTx.body || '')
      };
      var disclaimerTitle = tx4('Nota','Notice','Note','Примечание');
      var disclaimer = tx4(
        'Queste lezioni sono contenuti introduttivi interni a Sommelier World. Non sostituiscono percorsi ufficiali, manuali normativi, consulenza enologica, medica o legale. Per lo studio professionale servono sempre verifica su fonti autorevoli: disciplinari ufficiali, OIV, testi universitari, consorzi o enti qualificati.',
        'These lessons are introductory content internal to Sommelier World. They do not replace official paths, regulatory manuals, enological, medical or legal advice. For professional study always verify on authoritative sources: official specifications, OIV, academic texts, consortia or qualified bodies.',
        'Ces lecons sont des contenus introductifs internes a Sommelier World. Elles ne remplacent ni les parcours officiels, ni les manuels reglementaires, ni les conseils oenologiques, medicaux ou juridiques. Pour une etude professionnelle, verifiez toujours sur des sources autorisees : cahiers des charges officiels, OIV, textes academiques, consortiums ou organismes qualifies.',
        'Эти лекции являются вводными материалами Sommelier World. Они не заменяют официальные программы, нормативные руководства, консультации специалистов. Для профессионального обучения всегда проверяйте информацию в авторитетных источниках: официальных правилах, OIV, научных изданиях, консорциумах или уполномоченных органах.'
      );
      var lessonCtx = tx4(
        (currentModule ? (currentModule.title + ' · ') : '') + 'Capitolo ' + String(lessonMeta.sort_order || ''),
        (currentModule ? ((currentModule.title_en || currentModule.title) + ' · ') : '') + 'Chapter ' + String(lessonMeta.sort_order || ''),
        (currentModule ? ((currentModule.title_fr || currentModule.title) + ' · ') : '') + 'Chapitre ' + String(lessonMeta.sort_order || ''),
        (currentModule ? ((currentModule.title_ru || currentModule.title) + ' · ') : '') + 'Глава ' + String(lessonMeta.sort_order || '')
      );
      var charmatBlock = String(lessonMeta.id || '') === 'lesson_sparkling_wines_09' ? renderCharmatDiagramBlock(lang) : '';

      var headerHtml = [
        '<div class="sw-book-lesson-ctx">' + esc(lessonCtx) + ' · ' + esc(String(lesson.reading_minutes || lessonMeta.reading_minutes || 0) + ' MIN') + '</div>',
        '<h2 class="sw-book-lesson-title">' + esc(tx.title || lessonMeta.title || '') + '</h2>',
        '<div class="sw-book-lesson-divider"></div>',
        '<p class="sw-book-lesson-intro">' + esc(tx.intro || lessonMeta.intro || '') + '</p>',
        '<div class="sw-book-lesson-callout">',
          '<h4>' + esc(disclaimerTitle) + '</h4>',
          '<p style="margin:0;">' + esc(disclaimer) + '</p>',
        '</div>'
      ].join('');
      pages.push(headerHtml);

      var formattedProse = formatLessonBody(tx.body || '', currentModule && currentModule.id || '', lessonMeta.id);
      var proseGroups = splitProseByHeadings(formattedProse);
      if (proseGroups.length === 0 && formattedProse && formattedProse.trim()) {
        pages.push('<div class="sw-book-lesson-prose">' + formattedProse + '</div>');
      } else {
        for (var i = 0; i < proseGroups.length; i++) {
          pages.push('<div class="sw-book-lesson-prose">' + proseGroups[i] + '</div>');
        }
      }

      if (charmatBlock) {
        pages.push('<div class="sw-book-lesson-prose" style="padding-top:6px;">' + charmatBlock + '</div>');
      }
      pages.push('<div style="margin-top:6px;">' + renderLessonStudyNotes(lessonMeta.id) + '</div>');
      return pages;
    }

    var pages = buildLessonPages();
    state.lessonPages = pages.slice();
    var totalPages = state.lessonPages.length;
    var idx = Math.max(0, Math.min(state.lessonPageIndex, Math.max(0, totalPages - 1)));
    state.lessonPageIndex = idx;
    var hasPrev = idx > 0;
    var hasNext = idx < totalPages - 1;

    function navBtn(label, dir, disabled) {
      if (disabled) {
        return '<button type="button" disabled style="opacity:.32;cursor:not-allowed">' + esc(label) + '</button>';
      }
      return '<button type="button" onclick="window.studyGotoLessonPage&&window.studyGotoLessonPage(' + (idx + dir) + ')">' + esc(label) + '</button>';
    }

    var pageCounterHtml = '<div class="sw-book-page-counter">' +
      esc(tx4('Pagina ' + String(idx+1) + ' di ' + String(totalPages),
               'Page ' + String(idx+1) + ' of ' + String(totalPages),
               'Page ' + String(idx+1) + ' sur ' + String(totalPages),
               'Страница ' + String(idx+1) + ' из ' + String(totalPages))) +
      '</div>';

    return [
      state.lessonPages[idx],
      '<div class="sw-book-lesson-internal-nav">',
        '<div class="sw-book-lesson-internal-nav-row">',
          navBtn(pagePrevLbl, -1, !hasPrev),
          pageCounterHtml,
          navBtn(pageNextLbl, +1, !hasNext),
        '</div>',
      '</div>'
    ].join('');
  }

  function getNextLesson(lessonId) {
    var module = getCurrentModule();
    if (!module) return null;
    var index = module.lessons.findIndex(function(lesson){ return lesson.id === lessonId; });
    if (index < 0 || index >= module.lessons.length - 1) return null;
    return module.lessons[index + 1];
  }

  async function loadCatalog() {
    try {
      var data = await studyFetch('/api/study/catalog');
      state.modules = enhanceModuleCatalog(Array.isArray(data && data.modules) ? data.modules : FALLBACK_MODULES.slice());
      if (state.syncStatus !== 'local_only') setStudySync('remote_ok', '');
    } catch(e) {
      state.modules = enhanceModuleCatalog(FALLBACK_MODULES.slice());
      state.lastError = e && e.message ? e.message : 'Catalogo non disponibile';
      setStudySync('local_only', 'Catalogo remoto non raggiungibile. Uso solo una struttura locale minima del modulo.');
    }
    if (!state.activeModuleId && state.modules[0]) state.activeModuleId = state.modules[0].id;
    var currentModule = getCurrentModule();
    if (currentModule && !state.activeLessonId && currentModule.lessons[0]) state.activeLessonId = currentModule.lessons[0].id;
  }

  async function loadProgress() {
    var localProgress = loadLocalProgress();
    localProgress.user_key = state.userKey;
    try {
      var data = await studyFetch('/api/study/progress?user_key=' + encodeURIComponent(state.userKey));
      state.progress = data && data.progress ? data.progress : localProgress;
      if (state.syncStatus !== 'local_only') setStudySync('remote_ok', '');
    } catch(e) {
      state.progress = localProgress;
      setStudySync('local_only', 'Progressi e quiz vengono salvati in locale su questo dispositivo finche il backend Study non risponde.');
    }
    if (!Array.isArray(state.progress.lessons_completed)) state.progress.lessons_completed = [];
    if (!Array.isArray(state.progress.quiz_results)) state.progress.quiz_results = [];
    state.progress.user_key = state.userKey;
    saveLocalProgress(state.progress);
  }

  async function saveProgress(payload) {
    var next = Object.assign({}, state.progress);
    if (payload.lesson_id && payload.completed) {
      if (next.lessons_completed.indexOf(payload.lesson_id) === -1) next.lessons_completed.push(payload.lesson_id);
    }
    if (payload.quiz_result) {
      var idx = next.quiz_results.findIndex(function(entry){ return entry.lesson_id === payload.quiz_result.lesson_id; });
      if (idx >= 0) next.quiz_results[idx] = payload.quiz_result;
      else next.quiz_results.push(payload.quiz_result);
    }
    next.user_key = state.userKey;
    next.updated_at = new Date().toISOString();
    state.progress = next;
    saveLocalProgress(next);
    try {
      await studyFetch('/api/study/progress', {
        method: 'POST',
        json: Object.assign({ user_key: state.userKey }, payload)
      });
      setStudySync('remote_ok', '');
    } catch(e) {
      setStudySync('local_only', 'Salvataggio remoto non disponibile: il risultato resta comunque memorizzato in locale su questo browser.');
    }
  }

  async function openLesson(lessonId) {
    state.activeView = 'lesson';
    state.moduleQuizSession = null;
    state.activeLessonId = lessonId;
    state.activeGlossaryTerm = '';
    state.lessonQuickReview = { lessonId: lessonId, selectedIndex: null, submitted: false };
    state.lessonPageIndex = 0;
    state.lessonPages = [];
    try { localStorage.setItem(STORAGE_LAST_LESSON, lessonId); } catch(e) {}
    state.quizFeedback = null;
    state.activeLesson = getEnhancedLesson(lessonId, state.lessonCache[lessonId] || null);
    renderStudy();
    if (state.lessonCache[lessonId]) {
      state.activeLesson = getEnhancedLesson(lessonId, state.lessonCache[lessonId]);
      renderStudy();
      return;
    }
    try {
      var data = await studyFetch('/api/study/lesson?id=' + encodeURIComponent(lessonId));
      state.activeLesson = getEnhancedLesson(lessonId, data && data.item ? data.item : null);
      if (state.activeLesson) state.lessonCache[lessonId] = state.activeLesson;
      if (state.syncStatus !== 'local_only') setStudySync('remote_ok', '');
    } catch(e) {
      state.activeLesson = getEnhancedLesson(lessonId, null);
      state.lastError = e && e.message ? e.message : 'Lezione non disponibile';
      setStudySync('local_only', 'Lezione completa non disponibile: il backend Study remoto non e raggiungibile al momento.');
    }
    renderStudy();
  }

  function selectModule(moduleId) {
    state.activeModuleId = moduleId;
    state.activeView = 'lesson';
    state.moduleQuizSession = null;
    state.activeGlossaryTerm = '';
    state.lessonQuickReview = { lessonId:'', selectedIndex:null, submitted:false };
    var module = getCurrentModule();
    if (module && module.lessons[0]) {
      state.activeLessonId = module.lessons[0].id;
      openLesson(state.activeLessonId);
      return;
    }
    renderStudy();
  }

  async function completeCurrentLesson() {
    var lesson = getCurrentLessonMeta();
    if (!lesson) return;
    await saveProgress({ lesson_id: lesson.id, completed: true });
    renderStudy();
  }

  function answerQuickReview(lessonId, index) {
    state.lessonQuickReview = {
      lessonId: lessonId,
      selectedIndex: Number(index),
      submitted: false
    };
  }

  function submitQuickReview(lessonId) {
    var current = getQuickReviewState(lessonId);
    state.lessonQuickReview = {
      lessonId: lessonId,
      selectedIndex: current.selectedIndex,
      submitted: true
    };
    renderStudy();
  }

  function resetQuickReview(lessonId) {
    state.lessonQuickReview = {
      lessonId: lessonId,
      selectedIndex: null,
      submitted: false
    };
    renderStudy();
  }

  async function submitQuiz() {
    var lessonMeta = getCurrentLessonMeta();
    var lesson = state.activeLesson;
    var form = document.getElementById('studyQuizForm');
    if (!lessonMeta || !lesson || !form) return;
    var quiz = Array.isArray(lesson.quiz) ? lesson.quiz : [];
    if (!quiz.length) return;
    var correctAnswers = 0;
    var explanations = [];
    quiz.forEach(function(question, index){
      var checked = form.querySelector('input[name="study_q_' + index + '"]:checked');
      var answer = checked ? Number(checked.value) : -1;
      var ok = answer === Number(question.correct_index);
      var options = Array.isArray(question.options) ? question.options : [];
      if (ok) correctAnswers += 1;
      explanations.push({
        question: question.question,
        ok: ok,
        selected: answer >= 0 && options[answer] ? options[answer] : 'Nessuna risposta',
        correct: options[Number(question.correct_index)] || '',
        explanation: question.explanation || ''
      });
    });
    var score = Math.round((correctAnswers / quiz.length) * 100);
    state.quizFeedback = {
      lessonId: lessonMeta.id,
      correctAnswers: correctAnswers,
      total: quiz.length,
      score: score,
      explanations: explanations
    };
    await saveProgress({
      lesson_id: lessonMeta.id,
      completed: true,
      quiz_result: {
        lesson_id: lessonMeta.id,
        score: score,
        total: quiz.length,
        correct_answers: correctAnswers,
        completed_at: new Date().toISOString()
      }
    });
    renderStudy();
  }

  function resetQuiz() {
    var form = document.getElementById('studyQuizForm');
    if (form) form.reset();
    state.quizFeedback = null;
    renderStudy();
  }

  async function initStudyArea() {
    if (state.loading) return;
    state.loading = true;
    state.userKey = ensureUserKey();
    await loadCatalog();
    await loadProgress();
    var remembered = '';
    try { remembered = localStorage.getItem(STORAGE_LAST_LESSON) || ''; } catch(e) {}
    if (remembered) {
      var foundModule = state.modules.find(function(module){
        return (module.lessons || []).some(function(lesson){ return lesson.id === remembered; });
      });
      if (foundModule) {
        state.activeModuleId = foundModule.id;
        state.activeLessonId = remembered;
      }
    }
    state.ready = true;
    state.loading = false;
    renderStudy();
    if (state.activeLessonId) await openLesson(state.activeLessonId);
  }

  function gotoLessonPage(pageIdx) {
    if (typeof pageIdx !== 'number') return;
    if (!Array.isArray(state.lessonPages) || state.lessonPages.length === 0) return;
    state.lessonPageIndex = Math.max(0, Math.min(state.lessonPages.length - 1, pageIdx | 0));
    renderStudy();
  }

  window.studySelectModule = selectModule;
  window.studyOpenLesson = openLesson;
  window.studyGotoLessonPage = gotoLessonPage;
  window.studyNextLessonPage = function(){ gotoLessonPage(state.lessonPageIndex + 1); };
  window.studyPrevLessonPage = function(){ gotoLessonPage(state.lessonPageIndex - 1); };
  window.studyAnswerQuickReview = answerQuickReview;
  window.studySubmitQuickReview = submitQuickReview;
  window.studyResetQuickReview = resetQuickReview;
  window.studyShowGlossaryTerm = showGlossaryTerm;
  window.studyCompleteLesson = completeCurrentLesson;
  window.studyStartModuleQuiz = startModuleQuiz;
  window.studyAnswerModuleQuiz = answerModuleQuiz;
  window.studyPrevModuleQuiz = prevModuleQuizQuestion;
  window.studyNextModuleQuiz = nextModuleQuizQuestion;
  window.studyFinishModuleQuiz = finishModuleQuiz;
  window.studyRestartModuleQuiz = restartModuleQuiz;
  window.studySubmitQuiz = submitQuiz;
  window.studyResetQuiz = resetQuiz;
  window.studyRefreshI18n = function() {
    renderStudy();
  };
  window.loadStudyArea = function() {
    initStudyArea();
  };

  document.addEventListener('DOMContentLoaded', function(){
    var page = document.getElementById('page-study');
    if (!page) return;
    if (page.classList.contains('active')) initStudyArea();
  });
})();
