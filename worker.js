/**
 * SOMMELIER WORLD — Cloudflare Worker v4-CLEAN
 * AI Proxy: OpenAI primary per consulenza → Groq/Gemini fallback
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const SAFETY = `REGOLE FERREE:
- fillossera = insetto afide (NON fitoplasma, NON di origine asiatica)
- barolo = DOCG Nebbiolo 100%, Langhe (NON Monferrato)
- Non inventare fatti, date, produttori o vini
- Se non sei certo di qualcosa, dillo esplicitamente`;

function hasAnyAiKey(env) {
  return !!(getGroqKey(env) || getOpenAiKey(env) || getGeminiKey(env));
}

function hasVisionKey(env) {
  return !!getGeminiKey(env);
}

function readEnv(env, names) {
  if (!env || !Array.isArray(names)) return '';
  for (const name of names) {
    const value = env[name];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function getOpenAiKey(env) {
  return readEnv(env, ['OPENAI_API_KEY', 'OPENAI_KEY']);
}

function getGroqKey(env) {
  return readEnv(env, ['GROQ_API_KEY', 'GROQ_KEY']);
}

function getGeminiKey(env) {
  return readEnv(env, ['GEMINI_API_KEY', 'GOOGLE_API_KEY', 'GEMINI_KEY']);
}

function getPexelsKey(env) {
  return readEnv(env, ['PEXELS_API_KEY', 'PEXELS_KEY']);
}

function cleanWineName(name) {
  try {
    return String(name || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  } catch(e) {
    return String(name || '').replace(/\s+/g, ' ').trim();
  }
}

function buildAffiliateLinks(wineName) {
  const q = encodeURIComponent(cleanWineName(wineName));
  return {
    tannico: `https://www.tannico.it/catalogsearch/result/?q=${q}`,
    vivino: `https://www.vivino.com/search/wines?q=${q}`,
  };
}

function sanitizeJsonText(s) {
  if (s == null) return '';
  return String(s)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\u2028|\u2029/g, '');
}

const DAILY_CURIOSITY_TOPICS = [
  { key: 'cavatappi', title: 'Storia del Cavatappi', search: 'Champagne' },
  { key: 'viticoltura-estrema', title: 'Viticoltura estrema', search: 'Etna Rosso' },
  { key: 'bicchieri-decanter', title: 'Bicchieri e Decanter', search: 'Champagne Brut' },
  { key: 'terroir-leggendari', title: 'Terroir leggendari', search: 'Barolo' },
  { key: 'aneddoti-storici', title: 'Aneddoti Storici', search: 'Tokaji Aszu' },
  { key: 'scienza-del-gusto', title: 'Scienza del Gusto', search: 'Chardonnay Borgogna' },
];

const DAILY_BEGINNER_TOPICS = [
  { key: 'uva-dalla-potatura-alla-raccolta', title: 'Dalla potatura alla raccolta', search: 'Chianti Classico' },
  { key: 'fermentazione-polifenoli-tannini', title: 'Fermentazione, tannini e polifenoli', search: 'Nebbiolo' },
  { key: 'vitigni-antociani-struttura', title: 'Vitigni, antociani e struttura', search: 'Syrah' },
  { key: 'macerazione-affinamento-equilibrio', title: 'Macerazione, affinamento ed equilibrio', search: 'Sangiovese' },
  { key: 'acidita-zuccheri-alcol', title: 'Acidita, zuccheri e alcol', search: 'Riesling' },
  { key: 'vinificazione-bianco-rosso-rosato', title: 'Bianco, rosso e rosato spiegati bene', search: 'Pinot Noir' },
];

const EDITORIAL_VOICE = `STILE EDITORIALE OBBLIGATORIO:
- Scrittura alta, evocativa, elegante, ma concreta e leggibile
- Ogni testo deve avere un'apertura diversa: mai iniziare tutti allo stesso modo
- Alterna frasi brevi e frasi ampie per creare ritmo
- Inserisci dettagli sensoriali, geografici e umani quando pertinenti
- Non scrivere come un riassunto scolastico o una scheda tecnica
- Non usare formule ripetitive tipo "In conclusione" o "Questo dimostra che"
- Ogni articolo deve sembrare unico, non un template riciclato`;

const LESSON_VOICE = `STILE LEZIONE PROFESSIONALE:
- Sembra una vera lezione in aula, tenuta da un docente autorevole ma chiaro
- Spiega i concetti in ordine logico, dal vigneto al bicchiere
- Introduci i termini tecnici e poi chiariscili con parole semplici
- Usa esempi concreti di vitigni, territori e stili di vino
- Il lettore deve sentire di aver imparato una lezione completa, non letto un post breve`;

const FALLBACK_EDITORIAL_IMAGE = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80&fit=crop';

function simplifyImageQuery(input) {
  const t = String(input || '').toLowerCase();
  if (/clos vougeot|vougeot|bourgogne|burgundy/.test(t)) return 'burgundy vineyard';
  if (/barolo|langhe|nebbiolo/.test(t)) return 'barolo vineyard';
  if (/brunello|montalcino/.test(t)) return 'tuscany vineyard';
  if (/decanter|caraffa/.test(t)) return 'wine decanter';
  if (/cavatappi|corkscrew/.test(t)) return 'corkscrew wine';
  if (/champagne|franciacorta|spumante|prosecco|sparkling/.test(t)) return 'sparkling wine';
  if (/sommelier|degust|tasting|calice/.test(t)) return 'sommelier wine';
  if (/cantina|barrique|barrels|cellar/.test(t)) return 'wine cellar';
  if (/vendemmia|harvest|grapes/.test(t)) return 'grape harvest';
  if (/vigneto|vigna|vineyard|terroir|suolo|cru|estate/.test(t)) return 'vineyard';
  return 'wine vineyard';
}

async function fetchPexelsImage(env, rawQuery) {
  const key = getPexelsKey(env);
  if (!key) return FALLBACK_EDITORIAL_IMAGE;
  const query = simplifyImageQuery(rawQuery);
  try {
    const r = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
      headers: { Authorization: key },
    });
    if (!r.ok) throw new Error('Pexels ' + r.status);
    const d = await r.json();
    const photo = d && d.photos && d.photos[0];
    const src = photo && photo.src ? (photo.src.landscape || photo.src.large2x || photo.src.large || photo.src.original) : '';
    return src || FALLBACK_EDITORIAL_IMAGE;
  } catch (_) {
    return FALLBACK_EDITORIAL_IMAGE;
  }
}

function dedupeByKey(items, keyFn) {
  const out = [];
  const seen = new Set();
  for (const item of items || []) {
    const key = String(keyFn(item) || '').toLowerCase().replace(/\s+/g, ' ').trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function seededPick(items, seedText, count) {
  const arr = items.slice();
  let seed = 0;
  for (let i = 0; i < seedText.length; i++) seed = (seed * 31 + seedText.charCodeAt(i)) >>> 0;
  for (let i = arr.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
  }
  return arr.slice(0, count);
}

export default {
  async fetch(request, env) {
    // 1. GESTIONE IMMAGINI E FILE (ASSETS) - Deve essere la prima cosa!
    if (request.method === "GET" || request.method === "HEAD" ) {
      if  (env.ASSETS) {
        const asset = await  env.ASSETS.fetch(request);
        if (asset.status !== 404) return  asset;
        try {
          const u = new URL(request.url);
          if (u.search) {
            u.search = "";
            const req2 = new Request(u.toString(), request);
            const asset2 = await env.ASSETS.fetch(req2);
            if (asset2.status !== 404) return asset2;
          }
          const accept = request.headers.get("accept") || "";
          const looksLikeFile = /\.[a-z0-9]+$/i.test(u.pathname);
          if (!looksLikeFile && accept.includes("text/html")) {
            const indexUrl = new URL("/index.html", u);
            const indexReq = new Request(indexUrl.toString(), request);
            const indexRes = await env.ASSETS.fetch(indexReq);
            if (indexRes.status !== 404) return indexRes;
          }
        } catch(e) {}
      }
    }

    // 2. ABILITA CORS (Per evitare i blocchi rossi nella console)
    const  corsHeaders = {
      "Access-Control-Allow-Origin": "*" ,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS" ,
      "Access-Control-Allow-Headers": "Content-Type, Authorization" ,
    };

    if (request.method === "OPTIONS" ) {
      return new Response(null, { headers : corsHeaders });
    }
    
    const url = new URL(request.url);

    /* ── GET /ping ── */
    if (url.pathname === '/ping') {
      const groqKey = getGroqKey(env);
      const openAiKey = getOpenAiKey(env);
      const geminiKey = getGeminiKey(env);
      const pexelsKey = getPexelsKey(env);
      return ok({
        ok: true,
        assets: !!env.ASSETS,
        groq:   !!groqKey,
        gpt4o:  !!openAiKey,
        gemini: !!geminiKey,
        vision: !!geminiKey,
        pexels: !!pexelsKey,
        required_env: {
          text_ai_any_of: ['GROQ_API_KEY', 'OPENAI_API_KEY', 'GEMINI_API_KEY'],
          vision_requires: ['GEMINI_API_KEY'],
          images_preferred: ['PEXELS_API_KEY'],
        },
        provider: openAiKey ? 'gpt-4o' : (groqKey ? 'groq' : (geminiKey ? 'gemini' : 'none')),
        version: 'v30-2026-05-07',
        status: (groqKey || openAiKey || geminiKey)
          ? 'OK' : 'ERRORE: nessuna API key configurata',
      });
    }

    /* ── POST /api/news ── */
    if (url.pathname === '/api/news') {
      return handleNews(request, env);
    }

    /* ── POST /api/article ── */
    if (url.pathname === '/api/article') {
      const b = await request.json().catch(() => ({}));
      if (!hasAnyAiKey(env)) return ok({ error: 'AI non configurata nel Worker (manca API key).', required: ['GROQ_API_KEY','OPENAI_API_KEY','GEMINI_API_KEY'] }, 503);
      return handleArticle(env, b.topic || '', b.lang || 'it');
    }

    /* ── POST /api/translate ── */
    if (url.pathname === '/api/translate') {
      const b = await request.json().catch(() => ({}));
      if (!hasAnyAiKey(env)) return ok({ error: 'AI non configurata nel Worker (manca API key).', required: ['GROQ_API_KEY','OPENAI_API_KEY','GEMINI_API_KEY'] }, 503);
      return handleTranslate(env, b.text || '', b.targetLang || 'en');
    }

    /* ── GET /api/curiosities ── */
    if (url.pathname === '/api/curiosities') {
      return handleCuriosities(request, env);
    }

    /* ── POST /api/ask ── */
    if (url.pathname === '/api/ask') {
      if (request.method !== 'POST') return ok({ error: 'Metodo non permesso' }, 405);
      const body = await request.json().catch(() => ({}));
      const { system, userMsg, maxTokens } = body;
      if (!system || !userMsg) return ok({ error: 'system e userMsg obbligatori' }, 400);
      if (!hasAnyAiKey(env)) {
        return ok({
          error: 'Nessuna API key configurata nel Worker. Imposta almeno una tra GROQ_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY.',
        }, 503);
      }
      try {
        const result = await ai(env, system, userMsg, maxTokens || 1800);
        return ok({ text: result.text, provider: result.provider });
      } catch (e) {
        return ok({ error: e.message || 'Errore sconosciuto', type: e.constructor ? e.constructor.name : 'Error' }, 500);
      }
    }

    /* ── POST /api/scan-menu ── */
    if (url.pathname === '/api/scan-menu') {
      if (request.method !== 'POST') return ok({ error: 'Metodo non permesso' }, 405);
      const body = await request.json().catch(() => ({}));
      const { system, userMsg, maxTokens, imageB64, imageMime } = body;
      if (!system || !userMsg) return ok({ error: 'system e userMsg obbligatori' }, 400);
      if (imageB64 && !hasVisionKey(env)) {
        return ok({
          text: '{"antipasti":[],"primi":[],"secondi":[],"contorni":[],"dessert":[],"altro":[]}',
          provider: 'vision-disabled',
          warning: 'Vision non configurata: manca GEMINI_API_KEY',
        }, 200);
      }
      if (!hasAnyAiKey(env)) {
        return ok({
          error: 'Nessuna API key configurata nel Worker. Imposta almeno una tra GROQ_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY.',
        }, 503);
      }
      try {
        const result = await ai(env, system, userMsg, maxTokens || 1800, imageB64, imageMime);
        return ok({ text: result.text, provider: result.provider });
      } catch (e) {
        return ok({ error: e.message || 'Errore sconosciuto', type: e.constructor ? e.constructor.name : 'Error' }, 500);
      }
    }

    /* Qualsiasi GET/HEAD non-asset e non-API → 404 (evita 405 in console) */
    if (request.method === "GET" || request.method === "HEAD") {
      return new Response('Not Found', { status: 404, headers: corsHeaders });
    }

    /* ── POST / — proxy generico (sommelier, ricerca vini, scan foto) ── */
    if (request.method !== 'POST') {
      return ok({ error: 'Metodo non permesso' }, 405);
    }

    try {
      const body = await request.json();
      const { system, userMsg, maxTokens, imageB64, imageMime } = body;
      if (!system || !userMsg) return ok({ error: 'system e userMsg obbligatori' }, 400);

      /* Vision (foto menu) senza chiave → non esplodere: ritorna JSON vuoto */
      if (imageB64 && !hasVisionKey(env)) {
        return ok({
          text: '{"antipasti":[],"primi":[],"secondi":[],"contorni":[],"dessert":[],"altro":[]}',
          provider: 'vision-disabled',
          warning: 'Vision non configurata: manca GEMINI_API_KEY',
        }, 200);
      }

      if (!hasAnyAiKey(env)) {
        return ok({
          error: 'Nessuna API key configurata nel Worker. Imposta almeno una tra GROQ_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY.',
        }, 503);
      }

      const result = await ai(env, system, userMsg, maxTokens || 1800, imageB64, imageMime);
      let outText = result.text;
      try {
        const isWineSearch = String(system || '').includes('Sommelier Digitale di SommelierWorld') &&
          /^Dimmi tutto su:\s*/i.test(String(userMsg || ''));
        if (isWineSearch) {
          let q = String(userMsg || '').replace(/^Dimmi tutto su:\s*/i, '');
          q = q.split('\n')[0];
          q = q.split('▓')[0];
          q = q.trim();
          if (q) {
            const links = buildAffiliateLinks(q);
            outText +=
              `\n\nAcquista online:\n` +
              `<a href="${links.tannico}" target="_blank" rel="noopener noreferrer">Tannico</a>\n` +
              `<a href="${links.vivino}" target="_blank" rel="noopener noreferrer">Vivino</a>`;
          }
        }
      } catch(e) {}
      return ok({ text: outText, provider: result.provider });
    } catch (e) {
      console.error('Worker error:', e.message, e.stack ? e.stack.slice(0,200) : '');
      return ok({ 
        error: e.message || 'Errore sconosciuto',
        type: e.constructor ? e.constructor.name : 'Error',
      }, 500);
    }
  }
};

/* ══════════════════════════════════════════════════════
   MOTORE AI — OpenAI primo per consulenza/schede, Gemini per vision
   ══════════════════════════════════════════════════════ */
async function ai(env, system, userMsg, maxTokens, imageB64, imageMime) {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const errors = [];
  const geminiKey = getGeminiKey(env);
  const groqKey = getGroqKey(env);
  const openAiKey = getOpenAiKey(env);

  /* Vision (foto menu) → solo Gemini supporta immagini */
  if (imageB64 && geminiKey) {
    try {
      return { text: await geminiVision(geminiKey, system + '\n' + userMsg, imageB64, imageMime, maxTokens), provider: 'gemini-vision' };
    } catch (e) { errors.push('Gemini-vision: ' + e.message); }
  }

  /* 1. OpenAI — consulenza sommelier e schede vino più concrete */
  if (openAiKey) {
    for (let i = 0; i < 2; i++) {
      try {
        if (i > 0) await sleep(1200);
        return { text: await gpt4o(openAiKey, system, userMsg, maxTokens), provider: 'gpt-4o' };
      } catch (e) {
        errors.push('GPT-4o #' + (i + 1) + ': ' + e.message);
        if (!String(e.message).includes('429') && !String(e.message).includes('503') && !String(e.message).includes('500')) break;
      }
    }
  }

  /* 2. Groq — fallback rapido */
  if (groqKey) {
    for (let i = 0; i < 3; i++) {
      try {
        if (i > 0) await sleep(i * 1500);
        return { text: await groq(groqKey, system, userMsg, maxTokens), provider: 'groq' };
      } catch (e) {
        errors.push('Groq #' + (i+1) + ': ' + e.message);
        if (!e.message.includes('429') && !e.message.includes('503') && !e.message.includes('500')) break;
      }
    }
  }

  /* 3. Gemini — fallback finale testo */
  if (geminiKey) {
    for (let i = 0; i < 2; i++) {
      try {
        if (i > 0) await sleep(1500);
        return { text: await gemini(geminiKey, system + '\n\n' + userMsg, maxTokens), provider: 'gemini' };
      } catch (e) { errors.push('Gemini #' + (i+1) + ': ' + e.message); }
    }
  }

  throw new Error('Tutti i provider hanno fallito: ' + errors.join(' | '));
}

async function aiEditorial(env, system, userMsg, maxTokens) {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const errors = [];
  const openAiKey = getOpenAiKey(env);
  const groqKey = getGroqKey(env);

  if (openAiKey) {
    for (let i = 0; i < 2; i++) {
      try {
        if (i > 0) await sleep(1200);
        return { text: await gpt4o(openAiKey, system, userMsg, maxTokens), provider: 'gpt-4o' };
      } catch (e) {
        errors.push('GPT-4o #' + (i + 1) + ': ' + e.message);
        if (!String(e.message).includes('429') && !String(e.message).includes('503') && !String(e.message).includes('500')) break;
      }
    }
  }

  if (groqKey) {
    for (let i = 0; i < 3; i++) {
      try {
        if (i > 0) await sleep(i * 1200);
        return { text: await groq(groqKey, system, userMsg, maxTokens), provider: 'groq' };
      } catch (e) {
        errors.push('Groq #' + (i + 1) + ': ' + e.message);
        if (!String(e.message).includes('429') && !String(e.message).includes('503') && !String(e.message).includes('500')) break;
      }
    }
  }

  throw new Error('Provider editoriali falliti: ' + errors.join(' | '));
}

/* Traduzioni: usa Groq (economico) */
async function aiForTranslation(env, system, userMsg, maxTokens) {
  const groqKey = getGroqKey(env);
  if (groqKey) {
    try { return { text: await groq(groqKey, system, userMsg, maxTokens), provider: 'groq' }; }
    catch (e) { console.error('Groq translate:', e.message); }
  }
  return ai(env, system, userMsg, maxTokens); /* fallback */
}

/* ══════════════════════════════════════════════════════
   HANDLERS
   ══════════════════════════════════════════════════════ */
async function handleNews(request, env) {
  const url = new URL(request.url);
  const dateParam = (url.searchParams.get('date') || '').trim();
  const limitParam = parseInt(url.searchParams.get('limit') || '5', 10);
  const limit = Number.isFinite(limitParam) ? Math.max(1, Math.min(5, limitParam)) : 5;

  const dateKey = /^\d{4}-\d{2}-\d{2}$/.test(dateParam) ? dateParam : new Date().toISOString().slice(0, 10);
  const dateObj = new Date(dateKey + 'T12:00:00Z');

  /* Cache Cloudflare: 30 minuti (evita rate limit) */
  try {
    if (request.method === 'GET' && typeof caches !== 'undefined' && caches.default) {
      const cacheUrl = new URL(request.url);
      cacheUrl.searchParams.delete('ts');
      const cacheKey = new Request(cacheUrl.toString(), { method: 'GET', headers: { 'Accept': 'application/json' } });
      const hit = await caches.default.match(cacheKey);
      if (hit) return hit;
    }
  } catch (_) {}

  const FEEDS = [
    { url: 'https://www.decanter.com/wine-news/feed/', source: 'Decanter' },
    { url: 'https://www.thedrinksbusiness.com/category/wine/feed/', source: 'The Drinks Business' },
    { url: 'https://www.wineenthusiast.com/feed/', source: 'Wine Enthusiast' },
  ];

  const decode = (s) => {
    if (!s) return '';
    return String(s)
      .replace(/<!\[CDATA\[/g, '')
      .replace(/\]\]>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#8217;|&#x2019;/g, "'")
      .replace(/&#8211;|&#x2013;/g, '–')
      .replace(/&#8212;|&#x2014;/g, '—')
      .replace(/&#8230;|&#x2026;/g, '…')
      .trim();
  };

  let rawItems = [];
  for (const feed of FEEDS) {
    try {
      const r = await fetch(feed.url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(5000) });
      if (!r.ok) continue;
      const xml = await r.text();
      const items = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
      for (let i = 0; i < Math.min(6, items.length); i++) {
        const it = items[i];
        const tMatch = it.match(/<title>([\s\S]*?)<\/title>/i);
        const dMatch = it.match(/<description>([\s\S]*?)<\/description>/i);
        const title = decode(tMatch ? tMatch[1] : '').replace(/<[^>]+>/g, '').trim();
        const desc = decode(dMatch ? dMatch[1] : '').replace(/<[^>]+>/g, '').trim().slice(0, 320);
        if (!title || title.length < 8) continue;
        rawItems.push({ source: feed.source, title: title.slice(0, 180), desc });
      }
    } catch (_) {}
  }

  if (!rawItems.length) rawItems = fallbackItems();

  const uniq = new Map();
  for (const it of rawItems) {
    const k = (it.title || '').toLowerCase().replace(/\s+/g, ' ').trim();
    if (!k || uniq.has(k)) continue;
    uniq.set(k, it);
  }
  rawItems = [...uniq.values()];

  let seed = 0;
  for (let i = 0; i < dateKey.length; i++) seed = (seed * 31 + dateKey.charCodeAt(i)) >>> 0;
  for (let i = rawItems.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    const tmp = rawItems[i]; rawItems[i] = rawItems[j]; rawItems[j] = tmp;
  }

  const CATS = ['🗞 Attualità del Vino', '🌿 Viticoltura Mondiale', '🎩 Sommelier del Mondo', '🌍 Terroir', '📚 Didattica per Neofiti'];
  const articles = [];

  /* Se non ci sono API key → ritorna notizie “safe” senza AI (no 500/503) */
  if (!hasAnyAiKey(env)) {
    const picked = rawItems.slice(0, limit);
    const safeArticles = picked.map((it, i) => {
      const cat = CATS[i % CATS.length];
      const title = (it.title || 'Notizie del vino').trim().slice(0, 90);
      const desc = (it.desc || '').trim();
      const txt =
        `Panoramica\n\n` +
        `Oggi nel mondo del vino si parla di: ${title}. ${desc ? ('Sintesi disponibile: ' + desc + '. ') : ''}` +
        `Di seguito una contestualizzazione prudente basata esclusivamente sulle informazioni visibili nel titolo e nella breve descrizione.\n\n` +
        `Contesto\n\n` +
        `Nel settore vitivinicolo, notizie di questo tipo impattano spesso su produzione, distribuzione e percezione del consumatore. ` +
        `Senza dati completi, è corretto leggere queste informazioni come un segnale da monitorare, non come un verdetto.\n\n` +
        `Cosa significa per produttori e appassionati\n\n` +
        `Per i produttori: attenzione a comunicazione, posizionamento e canali. Per il pubblico: verificare sempre la fonte primaria e ` +
        `confrontare più testate prima di trarre conclusioni.\n\n` +
        `Consigli pratici\n\n` +
        `Se il tema riguarda prezzi o disponibilità, valuta alternative regionali equivalenti. Se riguarda clima o vendemmie, osserva ` +
        `le tendenze su più annate e denominazioni. Se riguarda personaggi o eventi, cerca dichiarazioni ufficiali e contesto.\n\n` +
        `Fonti\n\n` +
        `Fonte indicata: ${it.source || 'N/D'} — Titolo/estratto RSS.`;
      return {
        id: 'rss_fallback_' + dateKey + '_' + i,
        isNews: true,
        generato_ai: false,
        fonte: it.source || '',
        titolo_it: title,
        testo_it: txt,
        categoria_it: cat,
        titolo_en: '', testo_en: '', titolo_fr: '', testo_fr: '', titolo_ru: '', testo_ru: '',
        data: dateObj.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }),
        immagine: FALLBACK_EDITORIAL_IMAGE,
      };
    });
    return ok({ articles: safeArticles, count: safeArticles.length, fallback: true, reason: 'no_api_keys' });
  }

  const makeSafe = (it, i, cat) => {
    const title = (it.title || 'Notizie del vino').trim().slice(0, 90);
    const desc = (it.desc || '').trim();
    const txt =
      `Panoramica\n\n` +
      `Oggi nel mondo del vino si parla di: ${title}. ${desc ? ('Sintesi disponibile: ' + desc + '. ') : ''}` +
      `Di seguito una contestualizzazione prudente basata esclusivamente sulle informazioni visibili nel titolo e nella breve descrizione.\n\n` +
      `Contesto\n\n` +
      `Nel settore vitivinicolo, notizie di questo tipo impattano spesso su produzione, distribuzione e percezione del consumatore. ` +
      `Senza dati completi, è corretto leggere queste informazioni come un segnale da monitorare, non come un verdetto.\n\n` +
      `Cosa significa per produttori e appassionati\n\n` +
      `Per i produttori: attenzione a comunicazione, posizionamento e canali. Per il pubblico: verificare sempre la fonte primaria e ` +
      `confrontare più testate prima di trarre conclusioni.\n\n` +
      `Consigli pratici\n\n` +
      `Se il tema riguarda prezzi o disponibilità, valuta alternative regionali equivalenti. Se riguarda clima o vendemmie, osserva ` +
      `le tendenze su più annate e denominazioni. Se riguarda personaggi o eventi, cerca dichiarazioni ufficiali e contesto.\n\n` +
      `Fonti\n\n` +
      `Fonte indicata: ${it.source || 'N/D'} — Titolo/estratto RSS.`;
    return {
      id: 'rss_safe_' + dateKey + '_' + i,
      isNews: true,
      generato_ai: false,
      fonte: it.source || '',
      titolo_it: title,
      testo_it: txt,
      categoria_it: cat,
      titolo_en: '', testo_en: '', titolo_fr: '', testo_fr: '', titolo_ru: '', testo_ru: '',
      data: dateObj.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }),
      immagine: '',
    };
  };

  for (let i = 0; i < Math.min(limit, rawItems.length); i++) {
    const item = rawItems[i];
    const cat = CATS[i % CATS.length];
    try {
      const prompt = `Notizia reale di base:
FONTE: ${item.source}
TITOLO ORIGINALE: ${item.title}
TESTO ORIGINALE: ${item.desc}

${SAFETY}

${EDITORIAL_VOICE}

Scrivi un articolo giornalistico approfondito in italiano basato su questa notizia.
REGOLE:
- Titolo: max 10 parole, completo, accattivante
- 6 paragrafi distinti, ognuno di 110-150 parole (TOTALE 700 PAROLE MINIMO)
- Stile professionale, narrativo, autorevole
- Contestualizza con dati storici/geografici reali
- Non inventare nomi, numeri o citazioni
- Ogni paragrafo deve aggiungere un angolo nuovo: scenario, contesto, protagonisti, implicazioni, lettura critica, prospettiva finale
- Evita tono generico da agenzia: deve sembrare un pezzo editoriale di alto livello

JSON (zero testo fuori, zero markdown):
{"titolo":"titolo completo","categoria":"${cat}","testo":"par1 di 110-150 parole\n\npar2 di 110-150 parole\n\npar3 di 110-150 parole\n\npar4 di 110-150 parole\n\npar5 di 110-150 parole\n\npar6 di 110-150 parole"}`;

      const parseJson = (raw) => {
        const clean = String(raw || '').replace(/```json|```/g, '').trim();
        const start = clean.indexOf('{');
        const end = clean.lastIndexOf('}');
        if (start < 0 || end < 0) throw new Error('JSON malformato');
        const jsonText = sanitizeJsonText(clean.slice(start, end + 1));
        const j = JSON.parse(jsonText);
        if (!j || typeof j !== 'object') throw new Error('JSON non-oggetto');
        if (!j.titolo || !j.testo) throw new Error('Campi mancanti');
        const wc = String(j.testo).trim().split(/\s+/).filter(Boolean).length;
        if (wc < 550) throw new Error('Testo troppo corto');
        return j;
      };

      let j;
      try {
        const { text } = await aiEditorial(env, 'Sei un grande giornalista enologico e autore di longform. Scrivi testi originali, mai stereotipati, con voce narrativa e precisione fattuale. Rispondi SOLO con JSON valido.', prompt, 2400);
        j = parseJson(text);
      } catch (e1) {
        const retryPrompt =
          `REGOLE ASSOLUTE:\n` +
          `- Rispondi SOLO con un JSON valido, senza markdown e senza testo fuori.\n` +
          `- Campi: titolo, categoria, testo.\n` +
          `- Testo: 6 paragrafi separati da doppia riga vuota, 700 parole minimo.\n` +
          `- Voce editoriale alta, elegante, narrativa, senza formule ripetitive.\n\n` +
          `DATI NOTIZIA:\n` +
          `Fonte: ${item.source}\nTitolo: ${item.title}\nEstratto: ${item.desc}\n\n` +
          `${SAFETY}\n\n` +
          `JSON:\n{"titolo":"...","categoria":"${cat}","testo":"..."}\n`;
        const { text: t2 } = await aiEditorial(env, 'Sei un editor enologico senior. Return ONLY valid JSON with rich, elegant longform writing.', retryPrompt, 2600);
        j = parseJson(t2);
      }

      if (j && j.titolo && j.testo) {
        articles.push({
          id: 'rss_' + Date.now() + '_' + i,
          isNews: true, generato_ai: true, fonte: item.source,
          titolo_it: j.titolo, testo_it: j.testo,
          categoria_it: j.categoria || cat,
          titolo_en: '', testo_en: '', titolo_fr: '', testo_fr: '', titolo_ru: '', testo_ru: '',
          data: dateObj.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }),
          immagine: await fetchPexelsImage(env, item.title + ' ' + item.desc),
        });
      }
    } catch (e) {
      console.error('Article', i, ':', e.message);
      articles.push(makeSafe(item, i, cat));
    }
  }

  if (articles.length < limit) {
    for (let i = articles.length; i < limit && i < rawItems.length; i++) {
      const item = rawItems[i];
      const cat = CATS[i % CATS.length];
      articles.push(makeSafe(item, i, cat));
    }
  }

  const out = ok({ articles, count: articles.length }, 200, { 'Cache-Control': 'public, max-age=1800' });
  try {
    if (request.method === 'GET' && typeof caches !== 'undefined' && caches.default) {
      const cacheUrl = new URL(request.url);
      cacheUrl.searchParams.delete('ts');
      const cacheKey = new Request(cacheUrl.toString(), { method: 'GET', headers: { 'Accept': 'application/json' } });
      await caches.default.put(cacheKey, out.clone());
    }
  } catch (_) {}
  return out;
}

function fallbackItems() {
  return [
    { source: 'Wine World', title: 'Mercato del vino: nuovi record internazionali', desc: 'Il commercio enologico mondiale mostra dati positivi.' },
    { source: 'Decanter', title: 'Vendemmia 2025: qualità eccezionale in Italia', desc: 'I produttori italiani annunciano una delle migliori annate.' },
    { source: 'Vinography', title: 'Vini naturali: boom in Europa e Asia', desc: 'La domanda di vini biologici continua a crescere.' },
    { source: 'Wine Spectator', title: 'Borgogna: prezzi e accessibilità sotto pressione', desc: 'Il mercato dei Grand Cru continua a correre, mentre cresce il dibattito sull’accessibilità.' },
    { source: 'Wine Business', title: 'Clima e viticoltura: nuove aree emergenti nel Nord Europa', desc: 'Temperature medie in aumento e nuove sperimentazioni spostano il baricentro della viticoltura.' },
  ];
}

async function handleCuriosities(request, env) {
  const url = new URL(request.url);
  const dateKey = /^\d{4}-\d{2}-\d{2}$/.test((url.searchParams.get('date') || '').trim())
    ? url.searchParams.get('date').trim()
    : new Date().toISOString().slice(0, 10);

  try {
    if (request.method === 'GET' && typeof caches !== 'undefined' && caches.default) {
      const cacheUrl = new URL(request.url);
      cacheUrl.searchParams.delete('ts');
      const cacheKey = new Request(cacheUrl.toString(), { method: 'GET', headers: { 'Accept': 'application/json' } });
      const hit = await caches.default.match(cacheKey);
      if (hit) return hit;
    }
  } catch (_) {}

  const chosen = seededPick(DAILY_CURIOSITY_TOPICS, 'curiosita-' + dateKey, 2);
  const lesson = seededPick(DAILY_BEGINNER_TOPICS, 'lezione-' + dateKey, 1)[0];
  const dateLabel = new Date(dateKey + 'T12:00:00Z').toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
  const items = [];
  const editorialPlan = chosen.map(function(t){ return { mode: 'curiosity', topic: t }; });
  if (lesson) editorialPlan.push({ mode: 'lesson', topic: lesson });

  for (let i = 0; i < editorialPlan.length; i++) {
    const entry = editorialPlan[i];
    const topic = entry.topic;
    try {
      const prompt = entry.mode === 'lesson'
        ? (
          `DATA-SEED: ${dateKey}\n` +
          `LEZIONE DEL GIORNO: ${topic.title}\n` +
          `AMBITO: corso professionale sul vino per principianti, scritto in modo autorevole ma accessibile.\n\n` +
          `${SAFETY}\n\n` +
          `${LESSON_VOICE}\n\n` +
          `Scrivi una lezione giornaliera per neofiti del vino in italiano.\n` +
          `REGOLE:\n` +
          `- Tono chiaro, didattico, coinvolgente, come un docente professionista durante una lezione vera.\n` +
          `- 6 paragrafi lunghi separati da doppia riga vuota.\n` +
          `- 1200-1600 parole totali.\n` +
          `- Spiega in modo semplice ma corretto termini come fermentazione, polifenoli, tannini, antociani, acidita, maturazione quando pertinenti.\n` +
          `- Se il tema riguarda l'uva, racconta il ciclo dalla potatura alla raccolta, poi vinificazione e conseguenze nel bicchiere.\n` +
          `- Collega sempre teoria e degustazione: spiega come quei fenomeni si ritrovano in colore, profumo, gusto e struttura.\n` +
          `- Inserisci esempi reali di vitigni e territori per chiarire i concetti.\n` +
          `- Chiudi con una sezione finale chiamata "Cosa ricordare da questa lezione".\n` +
          `- Titolo: massimo 10 parole.\n\n` +
          `RISPONDI SOLO CON JSON:\n` +
          `{"titolo":"...","testo":"par1\\n\\npar2\\n\\npar3\\n\\npar4\\n\\npar5\\n\\npar6\\n\\nCosa ricordare da questa lezione: ...","wine_query":"${topic.search}"}`
        )
        : (
          `DATA-SEED: ${dateKey}\n` +
          `TEMA SCELTO: ${topic.title}\n` +
          `AMBITO: vino mondiale, Champagne, terroir, servizio, cultura materiale del vino.\n\n` +
          `${SAFETY}\n\n` +
          `${EDITORIAL_VOICE}\n\n` +
          `Scrivi una curiosità del giorno in italiano.\n` +
          `REGOLE:\n` +
          `- Deve essere chiaramente diversa dalle altre curiosita del giorno per tema, apertura e sviluppo.\n` +
          `- Tono brillante, misterioso, coinvolgente e professionale.\n` +
          `- 5 paragrafi separati da doppia riga vuota.\n` +
          `- 700-950 parole totali.\n` +
          `- Niente invenzioni: usa solo fatti plausibili e prudenti, meglio una formulazione prudente che un dettaglio incerto.\n` +
          `- Fai sentire il paesaggio, il tempo, i gesti, le persone e la materia del vino.\n` +
          `- Chiudi con una mini riga finale chiamata "Perché conta oggi".\n` +
          `- Titolo: massimo 9 parole.\n\n` +
          `RISPONDI SOLO CON JSON:\n` +
          `{"titolo":"...","testo":"par1\\n\\npar2\\n\\npar3\\n\\npar4\\n\\npar5\\n\\nPerché conta oggi: ...","wine_query":"${topic.search}"}`
        );
      const { text, provider } = await aiEditorial(
        env,
        entry.mode === 'lesson'
          ? 'Sei un docente professionale di altissimo livello specializzato nel vino. Scrivi lezioni lunghe, profonde, ordinate, memorabili e comprensibili. Rispondi SOLO con JSON valido.'
          : 'Sei un autore editoriale di cultura del vino. Scrivi curiosità autentiche, eleganti, narrative e mai ripetitive. Rispondi SOLO con JSON valido.',
        prompt,
        entry.mode === 'lesson' ? 4200 : 3000
      );
      const clean = String(text || '').replace(/```json|```/g, '').trim();
      const start = clean.indexOf('{');
      const end = clean.lastIndexOf('}');
      if (start < 0 || end < 0) throw new Error('JSON malformato curiosità');
      const j = JSON.parse(sanitizeJsonText(clean.slice(start, end + 1)));
      if (!j.titolo || !j.testo) throw new Error('Campi curiosità mancanti');
      items.push({
        id: 'curiosita_' + dateKey + '_' + i,
        title: j.titolo,
        text: j.testo,
        category: entry.mode === 'lesson' ? '📚 Lezione del Giorno' : '✨ Curiosità del Giorno',
        topic: topic.title,
        date: dateLabel,
        image: await fetchPexelsImage(env, topic.search || j.wine_query || topic.title),
        image_query: topic.search || j.wine_query || topic.title,
        wine_query: j.wine_query || topic.search || topic.title,
        provider,
      });
    } catch (e) {
      items.push({
        id: 'curiosita_fallback_' + dateKey + '_' + i,
        title: topic.title,
        text: entry.mode === 'lesson'
          ? `${topic.title}\n\nIn ogni lezione sul vino conviene partire dalla vigna, perché tutto ciò che sentiamo nel bicchiere nasce prima dell'ingresso in cantina. Potatura, gestione della chioma, maturazione fenolica, scelta della data di raccolta e stato sanitario dell'uva determinano acidita, zuccheri, tannini, aromi e longevita. Un neofita spesso pensa che il vino si faccia solo in cantina, ma un sommelier sa che il primo capitolo si scrive tra i filari.\n\nDopo la raccolta entrano in scena pigiatura, macerazione, fermentazione alcolica e, per alcuni vini, fermentazione malolattica. Qui si sviluppano struttura, profilo aromatico, colore e morbidezza. I polifenoli comprendono tannini e antociani: i primi incidono su trama e asciughezza, i secondi sul colore dei rossi giovani. Ogni vitigno risponde in modo diverso: Nebbiolo e Sagrantino hanno patrimonio tannico importante, Pinot Nero lavora su finezza e trasparenza, Chardonnay si presta a molte letture tecniche.\n\nCosa ricordare da questa lezione: il vino non nasce da una sola fase, ma dall'equilibrio tra vigna, raccolta e cantina; capire questi passaggi aiuta a leggere meglio ogni bottiglia.`
          : `${topic.title}\n\nOgni grande storia del vino nasce da un dettaglio tecnico o umano che resiste al tempo. Questo tema racconta come il gesto, il luogo o il materiale trasformino la degustazione in cultura: dal cavatappi alle vigne impossibili, dai calici al suolo delle colline storiche. Nel dubbio, qui privilegiamo una lettura prudente e affidabile, senza trasformare la curiosità in leggenda non verificata.\n\nNel vino mondiale il fascino conta, ma conta ancora di più il contesto. Un decanter non cambia per magia ogni bottiglia: aiuta quando ossigenazione, sedimento e temperatura lo richiedono. Un terroir leggendario non è solo marketing: è una sintesi di suolo, esposizione, clima, acqua e mano umana. Persino gli aromi che chiamiamo pietra focaia o vaniglia sono il risultato di processi reali, non formule poetiche casuali.\n\nPerché conta oggi: capire questi dettagli rende più intelligente ogni scelta, dal calice giusto a una bottiglia di Champagne o Barolo selezionata con maggiore consapevolezza.`,
        category: entry.mode === 'lesson' ? '📚 Lezione del Giorno' : '✨ Curiosità del Giorno',
        topic: topic.title,
        date: dateLabel,
        image: await fetchPexelsImage(env, topic.search || topic.title),
        image_query: topic.search,
        wine_query: topic.search,
        provider: 'fallback',
      });
    }
  }

  const uniqueItems = dedupeByKey(items, function(item){
    return (item.topic || '') + '|' + (item.title || '');
  }).slice(0, 3);

  const out = ok({ items: uniqueItems, count: uniqueItems.length, date: dateKey }, 200, { 'Cache-Control': 'public, max-age=86400' });
  try {
    if (request.method === 'GET' && typeof caches !== 'undefined' && caches.default) {
      const cacheUrl = new URL(request.url);
      cacheUrl.searchParams.delete('ts');
      const cacheKey = new Request(cacheUrl.toString(), { method: 'GET', headers: { 'Accept': 'application/json' } });
      await caches.default.put(cacheKey, out.clone());
    }
  } catch (_) {}
  return out;
}

async function handleArticle(env, topic, lang) {
  const LANGS = { it: 'italiano', en: 'English', fr: 'français', ru: 'русский' };
  const langName = LANGS[lang] || 'italiano';

  /* PROMPT 1: Articolo strutturato JSON */
  const prompt =
    `Lingua di scrittura: ${langName}\n` +
    `TEMA DELL'ARTICOLO: "${topic}"\n\n${SAFETY}\n\n${EDITORIAL_VOICE}\n\n` +
    `Scrivi un grande articolo narrativo-enciclopedico sul vino, nello stile di un longform culturale di alta gamma.\n` +
    `Non deve sembrare una scheda tecnica né un tema scolastico.\n` +
    `Deve avere anima, paesaggio, persone, storia, geologia, materia e tempo.\n\n` +
    `LUNGHEZZA: MINIMO 1100 PAROLE TOTALI.\n\n` +
    `STRUTTURA:\n` +
    `- 6 sezioni/paragrafi lunghi, separati da doppia riga vuota\n` +
    `- ogni sezione deve avere una funzione diversa: apertura evocativa, territorio/storia, lavoro umano, tecnica/terroir, identita sensoriale, presente e significato\n` +
    `- puoi usare frasi brevi isolate per dare ritmo, ma il testo deve restare sostanzioso\n` +
    `- evita ripetizioni e formule uguali da un articolo all'altro\n\n` +
    `CONTENUTO:\n` +
    `- Inserisci dettagli reali e verificabili: luoghi, suoli, vitigni, personaggi, pratiche, denominazioni\n` +
    `- Se pertinente, fai sentire nebbia, luce, freddo, terra, mani, silenzio, cantina, vendemmia\n` +
    `- Spiega anche il lato tecnico quando serve, ma dentro una narrazione elegante\n` +
    `- Chiudi con un finale memorabile, non didascalico\n\n` +
    `IMPORTANTE: il titolo deve essere completo, elegante, specifico, max 11 parole.\n\n` +
    `RISPONDI SOLO CON JSON (no markdown, no testo fuori):\n` +
    `{"titolo":"titolo completo qui","testo":"sezione 1\\n\\nsezione 2\\n\\nsezione 3\\n\\nsezione 4\\n\\nsezione 5\\n\\nsezione 6"}`;

  /* Tentativo 1: AI principale con maxTokens elevati per evitare troncamento */
  try {
    const { text } = await aiEditorial(env, 'Sei uno scrittore enologico, storico del vino e autore di longform letterari. Scrivi testi profondi, eleganti, diversi tra loro, con forza narrativa e precisione. Rispondi SOLO con JSON valido completo. ' + SAFETY, prompt, 4800);
    const clean = text.replace(/```json|```/g, '').trim();
    const start = clean.indexOf('{');
    const endIdx = clean.lastIndexOf('}');
    if (start < 0 || endIdx < 0) throw new Error('JSON malformato');
    const jsonText = sanitizeJsonText(clean.slice(start, endIdx + 1));
    const j = JSON.parse(jsonText);
    if (!j.titolo || !j.testo) throw new Error('Campi mancanti');
    /* Verifica lunghezza minima per evitare articoli corti */
    const wordCount = j.testo.split(/\s+/).length;
    if (wordCount < 850) {
      console.warn('Articolo corto:', wordCount, 'parole. Riprovo.');
      throw new Error('Articolo troppo corto');
    }
    return ok({ titolo: j.titolo, testo: j.testo, image: await fetchPexelsImage(env, topic), image_query: simplifyImageQuery(topic), ok: true, words: wordCount });
  } catch (e) {
    console.error('handleArticle attempt 1:', e.message);
  }

  /* Tentativo 2: prompt semplificato ma ancora con vincolo lunghezza */
  try {
    const fallbackPrompt = `Scrivi in ${langName} un articolo lungo e molto ben scritto di MINIMO 900 parole su: "${topic}".\n\n` +
      `${EDITORIAL_VOICE}\n${SAFETY}\n\n` +
      `Struttura in 6 paragrafi separati da doppia interlinea.\n` +
      `Dentro il testo fai convivere storia, paesaggio, tecnica, persone, sensazioni e attualita.\n` +
      `Non scrivere da manuale: voglio un testo vivo, elegante, unico, leggibile come un grande articolo di rivista.\n` +
      `Rispondi solo con il testo dell'articolo, senza titolo. Inizia direttamente con il primo paragrafo.`;
    const { text } = await aiEditorial(env, 'Sei un grande autore di cultura del vino. Scrivi un longform autentico, ricco e non ripetitivo. ' + SAFETY, fallbackPrompt, 4200);
    const cleanText = text.trim();
    if (cleanText.split(/\s+/).length < 700) throw new Error('Fallback troppo corto');
    /* Genera titolo dal topic */
    let titolo = topic;
    if (titolo.length > 80) titolo = titolo.slice(0, 77) + '...';
    return ok({ titolo: titolo, testo: cleanText, image: await fetchPexelsImage(env, topic), image_query: simplifyImageQuery(topic), ok: true, fallback: true });
  } catch (e2) {
    return ok({ error: 'Servizio temporaneamente non disponibile. ' + e2.message }, 503);
  }
}

async function handleTranslate(env, text, targetLang) {
  const LNAMES = { en: 'English', fr: 'French', ru: 'Russian' };
  try {
    const { text: translated } = await aiForTranslation(env,
      'Professional wine translator. Return ONLY the translated text.',
      `Translate to ${LNAMES[targetLang] || targetLang}:\n\n${text}`,
      1200
    );
    return ok({ translated, lang: targetLang });
  } catch (e) {
    return ok({ error: e.message }, 503);
  }
}

/* ══════════════════════════════════════════════════════
   AI PROVIDERS
   ══════════════════════════════════════════════════════ */
async function groq(key, system, userMsg, maxTokens) {
  const models = (maxTokens && maxTokens > 3000)
    ? ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant']
    : ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile'];
  let lastError = 'Groq non disponibile';

  for (const model of models) {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model,
        max_tokens: Math.min(maxTokens || 1600, 8000),
        temperature: 0.6,
        messages: [{ role: 'system', content: system }, { role: 'user', content: userMsg }],
      }),
    });
    if (!r.ok) {
      const err = await r.text().catch(() => r.status);
      lastError = 'Groq ' + r.status + ': ' + String(err).slice(0, 140);
      if (r.status === 429 || r.status === 503) continue;
      throw new Error(lastError);
    }
    let d;
    try { d = await r.json(); } 
    catch(je) { throw new Error('Groq: risposta non-JSON — ' + je.message); }
    const text = d.choices?.[0]?.message?.content || '';
    if (!text) throw new Error('Groq: risposta vuota. Response: ' + JSON.stringify(d).slice(0,100));
    return text;
  }

  throw new Error(lastError);
}

async function gpt4o(key, system, userMsg, maxTokens) {
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: maxTokens || 1600,
      temperature: 0.5,
      messages: [{ role: 'system', content: system }, { role: 'user', content: userMsg }],
    }),
  });
  if (!r.ok) {
    const err = await r.text().catch(() => r.status);
    throw new Error('GPT-4o ' + r.status + ': ' + String(err).slice(0, 100));
  }
  const d = await r.json();
  const text = d.choices?.[0]?.message?.content || '';
  if (!text) throw new Error('GPT-4o: risposta vuota');
  return text;
}

async function geminiVision(key, prompt, imageB64, imageMime, maxTokens) {
  const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest'];
  let lastError = 'Gemini Vision non disponibile';
  for (const model of models) {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: imageMime || 'image/jpeg', data: imageB64 } }] }],
          generationConfig: { maxOutputTokens: maxTokens || 600, temperature: 0.2 },
        }),
      }
    );
    if (r.ok) {
      const d = await r.json();
      const text = d.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!text) throw new Error('Gemini Vision: risposta vuota');
      return text;
    }
    lastError = 'Gemini Vision ' + r.status + ': ' + String(await r.text().catch(() => r.status)).slice(0, 220);
  }
  throw new Error(lastError);
}

async function gemini(key, prompt, maxTokens) {
  const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest'];
  let lastError = 'Gemini non disponibile';
  for (const model of models) {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: maxTokens || 1600, temperature: 0.6 },
        }),
      }
    );
    if (r.ok) {
      const d = await r.json();
      const text = d.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!text) throw new Error('Gemini: risposta vuota');
      return text;
    }
    lastError = 'Gemini ' + r.status + ': ' + String(await r.text().catch(() => r.status)).slice(0, 220);
  }
  throw new Error(lastError);
}

function ok(data, status = 200, extraHeaders) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json', ...(extraHeaders || {}) },
  });
}
