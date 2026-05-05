/**
 * SOMMELIER WORLD — Cloudflare Worker v4-CLEAN
 * AI Proxy: Groq primary → GPT-4o fallback → Gemini last
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const SAFETY = `REGOLE FERREE:
- fillossera = insetto afide (NON fitoplasma, NON di origine asiatica)
- barolo = DOCG Nebbiolo 100%, Langhe (NON Monferrato)
- Non inventare fatti, date, produttori o vini
- Se non sei certo di qualcosa, dillo esplicitamente`;

export default {
  async fetch(request, env) {

    /* CORS preflight */
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    const url = new URL(request.url);

    /* ── GET /ping ── */
    if (url.pathname === '/ping') {
      return ok({
        ok: true,
        groq:   !!env.GROQ_API_KEY,
        gpt4o:  !!env.OPENAI_API_KEY,
        gemini: !!env.GEMINI_API_KEY,
        provider: env.GROQ_API_KEY ? 'groq' : (env.OPENAI_API_KEY ? 'gpt-4o' : 'gemini'),
        version: 'v23-2026-05-04',
        status: (env.GROQ_API_KEY || env.OPENAI_API_KEY || env.GEMINI_API_KEY)
          ? 'OK' : 'ERRORE: nessuna API key configurata',
      });
    }

    /* ── POST /api/news ── */
    if (url.pathname === '/api/news') {
      return handleNews(env);
    }

    /* ── POST /api/article ── */
    if (url.pathname === '/api/article') {
      const b = await request.json().catch(() => ({}));
      return handleArticle(env, b.topic || '', b.lang || 'it');
    }

    /* ── POST /api/translate ── */
    if (url.pathname === '/api/translate') {
      const b = await request.json().catch(() => ({}));
      return handleTranslate(env, b.text || '', b.targetLang || 'en');
    }

    /* ── POST / — proxy generico (sommelier, ricerca vini, scan foto) ── */
    if (request.method !== 'POST') {
      return ok({ error: 'Metodo non permesso' }, 405);
    }

    try {
      const body = await request.json();
      const { system, userMsg, maxTokens, imageB64, imageMime } = body;
      if (!system || !userMsg) return ok({ error: 'system e userMsg obbligatori' }, 400);

      const result = await ai(env, system, userMsg, maxTokens || 1800, imageB64, imageMime);
      return ok({ text: result.text, provider: result.provider });
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
   MOTORE AI — Groq primo, poi GPT-4o, poi Gemini
   ══════════════════════════════════════════════════════ */
async function ai(env, system, userMsg, maxTokens, imageB64, imageMime) {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const errors = [];

  /* Vision (foto menu) → solo Gemini supporta immagini */
  if (imageB64 && env.GEMINI_API_KEY) {
    try {
      return { text: await geminiVision(env.GEMINI_API_KEY, system + '\n' + userMsg, imageB64, imageMime, maxTokens), provider: 'gemini-vision' };
    } catch (e) { errors.push('Gemini-vision: ' + e.message); }
  }

  /* 1. Gemini — generalmente più stabile per uso intenso */
  if (env.GEMINI_API_KEY) {
    for (let i = 0; i < 2; i++) {
      try {
        if (i > 0) await sleep(1500);
        return { text: await gemini(env.GEMINI_API_KEY, system + '\n\n' + userMsg, maxTokens), provider: 'gemini' };
      } catch (e) { errors.push('Gemini #' + (i+1) + ': ' + e.message); }
    }
  }

  /* 2. Groq — veloce, gratuito */
  if (env.GROQ_API_KEY) {
    for (let i = 0; i < 3; i++) {
      try {
        if (i > 0) await sleep(i * 1500);
        return { text: await groq(env.GROQ_API_KEY, system, userMsg, maxTokens), provider: 'groq' };
      } catch (e) {
        errors.push('Groq #' + (i+1) + ': ' + e.message);
        if (!e.message.includes('429') && !e.message.includes('503') && !e.message.includes('500')) break;
      }
    }
  }

  /* 3. GPT-4o — fallback finale a pagamento */
  if (env.OPENAI_API_KEY) {
    try {
      return { text: await gpt4o(env.OPENAI_API_KEY, system, userMsg, maxTokens), provider: 'gpt-4o' };
    } catch (e) { errors.push('GPT-4o: ' + e.message); }
  }

  throw new Error('Tutti i provider hanno fallito: ' + errors.join(' | '));
}

/* Traduzioni: usa Groq (economico) */
async function aiForTranslation(env, system, userMsg, maxTokens) {
  if (env.GROQ_API_KEY) {
    try { return { text: await groq(env.GROQ_API_KEY, system, userMsg, maxTokens), provider: 'groq' }; }
    catch (e) { console.error('Groq translate:', e.message); }
  }
  return ai(env, system, userMsg, maxTokens); /* fallback */
}

/* ══════════════════════════════════════════════════════
   HANDLERS
   ══════════════════════════════════════════════════════ */
async function handleNews(env) {
  const FEEDS = [
    { url: 'https://www.decanter.com/wine-news/feed/', source: 'Decanter' },
    { url: 'https://www.thedrinksbusiness.com/category/wine/feed/', source: 'The Drinks Business' },
    { url: 'https://www.wineenthusiast.com/feed/', source: 'Wine Enthusiast' },
  ];

  let rawItems = [];
  for (const feed of FEEDS) {
    try {
      const r = await fetch(feed.url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(5000) });
      if (!r.ok) continue;
      const xml = await r.text();
      const titles = [...xml.matchAll(/<title>(?:<!\[CDATA\[)?([^<\]]{15,200})(?:\]\]>)?<\/title>/g)]
        .map(m => m[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').trim())
        .filter(t => t && !t.includes('RSS') && !t.includes('Feed') && !t.includes('|'));
      const descs = [...xml.matchAll(/<description>(?:<!\[CDATA\[)?([^<\]]{30,500})(?:\]\]>)?<\/description>/g)]
        .map(m => m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim().slice(0, 300));
      titles.slice(0, 4).forEach((t, i) => rawItems.push({ source: feed.source, title: t, desc: descs[i] || '' }));
    } catch (_) {}
  }

  if (!rawItems.length) rawItems = fallbackItems();

  const CATS = ['🗞 Attualità del Vino', '🌿 Viticoltura Mondiale', '📚 Didattica per Neofiti'];
  const articles = [];

  for (let i = 0; i < Math.min(3, rawItems.length); i++) {
    const item = rawItems[i];
    const cat = CATS[i % CATS.length];
    try {
      const prompt = `Notizia reale di base:
FONTE: ${item.source}
TITOLO ORIGINALE: ${item.title}
TESTO ORIGINALE: ${item.desc}

${SAFETY}

Scrivi un articolo giornalistico approfondito in italiano basato su questa notizia.
REGOLE:
- Titolo: max 10 parole, completo, accattivante
- 4-5 paragrafi distinti, ognuno di 100-125 parole (TOTALE 500 PAROLE MINIMO)
- Stile professionale ma accessibile
- Contestualizza con dati storici/geografici reali
- Non inventare nomi, numeri o citazioni

JSON (zero testo fuori, zero markdown):
{"titolo":"titolo completo","categoria":"${cat}","testo":"par1 di 100-125 parole\n\npar2 di 100-125 parole\n\npar3 di 100-125 parole\n\npar4 di 100-125 parole\n\npar5 di 100-125 parole"}`;

      const { text } = await ai(env, 'Sei un giornalista enologico esperto. Rispondi SOLO con JSON valido contenente articoli approfonditi.', prompt, 2400);
      const clean = text.replace(/```json|```/g, '').trim();
      const j = JSON.parse(clean.slice(clean.indexOf('{'), clean.lastIndexOf('}') + 1));
      if (j.titolo && j.testo) {
        articles.push({
          id: 'rss_' + Date.now() + '_' + i,
          isNews: true, generato_ai: true, fonte: item.source,
          titolo_it: j.titolo, testo_it: j.testo,
          categoria_it: j.categoria || cat,
          titolo_en: '', testo_en: '', titolo_fr: '', testo_fr: '', titolo_ru: '', testo_ru: '',
          data: new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }),
          immagine: '',
        });
      }
    } catch (e) { console.error('Article', i, ':', e.message); }
  }

  return ok({ articles, count: articles.length });
}

function fallbackItems() {
  return [
    { source: 'Wine World', title: 'Mercato del vino: nuovi record internazionali', desc: 'Il commercio enologico mondiale mostra dati positivi.' },
    { source: 'Decanter', title: 'Vendemmia 2025: qualità eccezionale in Italia', desc: 'I produttori italiani annunciano una delle migliori annate.' },
    { source: 'Vinography', title: 'Vini naturali: boom in Europa e Asia', desc: 'La domanda di vini biologici continua a crescere.' },
  ];
}

async function handleArticle(env, topic, lang) {
  const LANGS = { it: 'italiano', en: 'English', fr: 'français', ru: 'русский' };
  const langName = LANGS[lang] || 'italiano';

  /* PROMPT 1: Articolo strutturato JSON */
  const prompt =
    `Lingua di scrittura: ${langName}\n` +
    `TEMA DELL'ARTICOLO: "${topic}"\n\n${SAFETY}\n\n` +
    `Scrivi un articolo enciclopedico professionale di MINIMO 700 PAROLE TOTALI.\n\n` +
    `Devi scrivere ESATTAMENTE 5 PARAGRAFI, ognuno di MINIMO 140 parole:\n\n` +
    `Paragrafo 1 — STORIA: origini documentate del soggetto, anni precisi, luoghi reali, personaggi storici verificabili. Almeno 140 parole.\n` +
    `Paragrafo 2 — TECNICA: scienza, viticoltura, vinificazione, terroir, processi chimici. Almeno 140 parole.\n` +
    `Paragrafo 3 — ANEDDOTO: storia curiosa documentata con nomi e date reali. Almeno 140 parole.\n` +
    `Paragrafo 4 — ATTUALITÀ: produttori famosi contemporanei, denominazioni, riconoscimenti recenti. Almeno 140 parole.\n` +
    `Paragrafo 5 — CONSIGLI: consigli pratici degustazione, abbinamenti, conservazione, temperature. Almeno 140 parole.\n\n` +
    `IMPORTANTE: il titolo deve essere COMPLETO (mai troncato), max 10 parole, accattivante e specifico.\n\n` +
    `RISPONDI SOLO CON JSON (no markdown, no testo fuori):\n` +
    `{"titolo":"titolo completo qui","testo":"paragrafo 1 di 140+ parole\\n\\nparagrafo 2 di 140+ parole\\n\\nparagrafo 3 di 140+ parole\\n\\nparagrafo 4 di 140+ parole\\n\\nparagrafo 5 di 140+ parole"}`;

  /* Tentativo 1: AI principale con maxTokens elevati per evitare troncamento */
  try {
    const { text } = await ai(env, 'Sei un esperto enologo e storico del vino. Scrivi articoli enciclopedici approfonditi. Rispondi SOLO con JSON valido completo. ' + SAFETY, prompt, 4000);
    const clean = text.replace(/```json|```/g, '').trim();
    const start = clean.indexOf('{');
    const endIdx = clean.lastIndexOf('}');
    if (start < 0 || endIdx < 0) throw new Error('JSON malformato');
    const j = JSON.parse(clean.slice(start, endIdx + 1));
    if (!j.titolo || !j.testo) throw new Error('Campi mancanti');
    /* Verifica lunghezza minima per evitare articoli corti */
    const wordCount = j.testo.split(/\s+/).length;
    if (wordCount < 400) {
      console.warn('Articolo corto:', wordCount, 'parole. Riprovo.');
      throw new Error('Articolo troppo corto');
    }
    return ok({ titolo: j.titolo, testo: j.testo, ok: true, words: wordCount });
  } catch (e) {
    console.error('handleArticle attempt 1:', e.message);
  }

  /* Tentativo 2: prompt semplificato ma ancora con vincolo lunghezza */
  try {
    const fallbackPrompt = `Scrivi in ${langName} un articolo dettagliato di MINIMO 600 parole su: "${topic}".\n\n` +
      `Struttura in 5 paragrafi separati da doppia interlinea, ciascuno di almeno 120 parole.\n` +
      `Includi: storia, dati tecnici, aneddoti, produttori reali, consigli pratici.\n` +
      `${SAFETY}\n\nRispondi solo con il testo dell'articolo, senza titolo. Inizia direttamente con il primo paragrafo.`;
    const { text } = await ai(env, 'Esperto enologo che scrive articoli approfonditi. ' + SAFETY, fallbackPrompt, 3500);
    const cleanText = text.trim();
    if (cleanText.split(/\s+/).length < 200) throw new Error('Fallback troppo corto');
    /* Genera titolo dal topic */
    let titolo = topic;
    if (titolo.length > 80) titolo = titolo.slice(0, 77) + '...';
    return ok({ titolo: titolo, testo: cleanText, ok: true, fallback: true });
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
  /* Usa il modello più capace per richieste lunghe (>1000 tokens), 8b per quelle brevi */
  const model = (maxTokens && maxTokens > 1500) ? 'llama-3.3-70b-versatile' : 'llama-3.1-8b-instant';
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
    throw new Error('Groq ' + r.status + ': ' + String(err).slice(0, 100));
  }
  let d;
  try { d = await r.json(); } 
  catch(je) { throw new Error('Groq: risposta non-JSON — ' + je.message); }
  const text = d.choices?.[0]?.message?.content || '';
  if (!text) throw new Error('Groq: risposta vuota. Response: ' + JSON.stringify(d).slice(0,100));
  return text;
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
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: imageMime || 'image/jpeg', data: imageB64 } }] }],
        generationConfig: { maxOutputTokens: maxTokens || 600, temperature: 0.2 },
      }),
    }
  );
  if (!r.ok) throw new Error('Gemini Vision ' + r.status);
  const d = await r.json();
  const text = d.candidates?.[0]?.content?.parts?.[0]?.text || '';
  if (!text) throw new Error('Gemini Vision: risposta vuota');
  return text;
}

async function gemini(key, prompt, maxTokens) {
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: maxTokens || 1600, temperature: 0.6 },
      }),
    }
  );
  if (!r.ok) throw new Error('Gemini ' + r.status);
  const d = await r.json();
  const text = d.candidates?.[0]?.content?.parts?.[0]?.text || '';
  if (!text) throw new Error('Gemini: risposta vuota');
  return text;
}

function ok(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}
