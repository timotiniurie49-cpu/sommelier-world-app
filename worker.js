/**
 * SOMMELIER WORLD — Cloudflare Worker v4-CLEAN
 * AI Proxy: OpenAI primary per consulenza → Groq/Gemini fallback
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Pwd',
};

const FREE_DAILY_CONSULTS = 4;
const CLIENT_COOKIE_NAME = 'swcid';
const HOME_LAYOUT_KV_KEY = 'home_layout:live:v1';
const HOME_LAYOUT_ALLOWED_IDS = ['hero', 'news', 'sommelier', 'produttori'];

const SAFETY = `REGOLE FERREE:
- fillossera = insetto afide (NON fitoplasma, NON di origine asiatica)
- barolo = DOCG Nebbiolo 100%, Langhe (NON Monferrato)
- Non inventare fatti, date, produttori o vini
- Se non sei certo di qualcosa, dillo esplicitamente`;

const TERROIR_STATIC_SEED = {
  version: 1,
  countries: [
    { code: 'IT', labels: { it: 'Italia', en: 'Italy', fr: 'Italie', ru: 'Италия' } },
    { code: 'FR', labels: { it: 'Francia', en: 'France', fr: 'France', ru: 'Франция' } },
    { code: 'ES', labels: { it: 'Spagna', en: 'Spain', fr: 'Espagne', ru: 'Испания' } },
    { code: 'PT', labels: { it: 'Portogallo', en: 'Portugal', fr: 'Portugal', ru: 'Португалия' } },
    { code: 'DE', labels: { it: 'Germania', en: 'Germany', fr: 'Allemagne', ru: 'Германия' } },
    { code: 'US', labels: { it: 'USA', en: 'USA', fr: 'États-Unis', ru: 'США' } },
    { code: 'AR', labels: { it: 'Argentina', en: 'Argentina', fr: 'Argentine', ru: 'Аргентина' } },
    { code: 'CL', labels: { it: 'Cile', en: 'Chile', fr: 'Chili', ru: 'Чили' } }
  ],
  denominations: [
    { id: 'barolo', labels: { it: 'Barolo DOCG', en: 'Barolo DOCG', fr: 'Barolo DOCG', ru: 'Бароло DOCG' }, country: 'Italia', region: 'Piemonte' },
    { id: 'brunello', labels: { it: 'Brunello di Montalcino DOCG', en: 'Brunello di Montalcino DOCG', fr: 'Brunello di Montalcino DOCG', ru: 'Брунелло ди Монтальчино DOCG' }, country: 'Italia', region: 'Toscana' },
    { id: 'amarone', labels: { it: 'Amarone della Valpolicella DOCG', en: 'Amarone della Valpolicella DOCG', fr: 'Amarone della Valpolicella DOCG', ru: 'Амароне делла Вальполичелла DOCG' }, country: 'Italia', region: 'Veneto' },
    { id: 'franciacorta', labels: { it: 'Franciacorta DOCG', en: 'Franciacorta DOCG', fr: 'Franciacorta DOCG', ru: 'Франчакорта DOCG' }, country: 'Italia', region: 'Lombardia' },
    { id: 'champagne', labels: { it: 'Champagne AOC', en: 'Champagne AOC', fr: 'Champagne AOC', ru: 'Шампань AOC' }, country: 'Francia', region: 'Champagne' },
    { id: 'bourgogne', labels: { it: 'Bourgogne AOC', en: 'Bourgogne AOC', fr: 'Bourgogne AOC', ru: 'Бургонь AOC' }, country: 'Francia', region: 'Borgogna' },
    { id: 'chablis', labels: { it: 'Chablis AOC', en: 'Chablis AOC', fr: 'Chablis AOC', ru: 'Шабли AOC' }, country: 'Francia', region: 'Borgogna' },
    { id: 'rioja', labels: { it: 'Rioja DOCa', en: 'Rioja DOCa', fr: 'Rioja DOCa', ru: 'Риоха DOCa' }, country: 'Spagna', region: 'Rioja' }
  ],
  updatedAt: 0,
};

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

function getTavilyKey(env) {
  return readEnv(env, ['TAVILY_API_KEY', 'TAVILY_KEY']);
}

function getSerperKey(env) {
  return readEnv(env, ['SERPER_API_KEY', 'SERPER_KEY']);
}

function getStripeSecretKey(env) {
  return readEnv(env, ['STRIPE_SECRET_KEY', 'STRIPE_KEY']);
}

function getStripePriceId(env) {
  return readEnv(env, ['STRIPE_PRICE_ID', 'STRIPE_ELITE_PRICE_ID']);
}

function getStripeWebhookSecret(env) {
  return readEnv(env, ['STRIPE_WEBHOOK_SECRET']);
}

function getBrevoApiKey(env) {
  return readEnv(env, ['BREVO_API_KEY', 'BREVO_KEY']);
}

function getSendGridApiKey(env) {
  return readEnv(env, ['SENDGRID_API_KEY', 'SENDGRID_KEY']);
}

function getMailerFromEmail(env) {
  return readEnv(env, ['MAIL_FROM_EMAIL', 'SMTP_FROM_EMAIL']) || 'info@sommelierworld.vin';
}

function getMailerFromName(env) {
  return readEnv(env, ['MAIL_FROM_NAME', 'SMTP_FROM_NAME']) || 'SommelierWorld Maison';
}

function getAdminInbox(env) {
  return readEnv(env, ['ADMIN_EMAIL', 'MAIL_ADMIN_EMAIL', 'NOTIFY_EMAIL']) || 'info@sommelierworld.vin';
}

function getSmtpConfig(env) {
  return {
    host: readEnv(env, ['SMTP_HOST']),
    port: readEnv(env, ['SMTP_PORT']),
    user: readEnv(env, ['SMTP_USER', 'SMTP_USERNAME']),
    pass: readEnv(env, ['SMTP_PASS', 'SMTP_PASSWORD']),
    secure: readEnv(env, ['SMTP_SECURE']) || 'true',
  };
}

function getMailerStatus(env) {
  const brevo = getBrevoApiKey(env);
  const sendgrid = getSendGridApiKey(env);
  const smtp = getSmtpConfig(env);
  return {
    provider: brevo ? 'brevo' : (sendgrid ? 'sendgrid' : 'none'),
    configured: !!(brevo || sendgrid),
    from_email: !!getMailerFromEmail(env),
    admin_inbox: !!getAdminInbox(env),
    smtp_ready: !!(smtp.host && smtp.port && smtp.user && smtp.pass),
  };
}

function getAdminPassword(env) {
  return readEnv(env, ['ADMIN_PASSWORD']) || 'sommelier2026';
}

function getStateKV(env) {
  return (env && (env.APP_KV || env.SW_STATE_KV || env.SOMMELIER_KV || env.SOMMELIER_WORLD_STORAGE)) || null;
}

function normalizeHomeLayoutConfig(input) {
  const source = Array.isArray(input) ? input : [];
  const out = [];
  const seen = new Set();
  const sanitizeArticleIds = (list) => {
    if (!Array.isArray(list)) return [];
    const ids = [];
    for (const entry of list) {
      const value = trimText(entry, 120);
      if (!value || ids.includes(value)) continue;
      ids.push(value);
    }
    return ids.slice(0, 3);
  };
  const sanitizeProducerCards = (list) => {
    if (!Array.isArray(list)) return [];
    const cards = [];
    for (const card of list) {
      if (!card || typeof card !== 'object') continue;
      const next = {
        kicker: trimText(card.kicker, 80),
        title: trimText(card.title, 120),
        text: trimText(card.text, 320),
        image: trimText(card.image, 600),
        buttonLabel: trimText(card.buttonLabel, 60),
        buttonUrl: trimText(card.buttonUrl, 600),
      };
      if (!(next.kicker || next.title || next.text || next.image || next.buttonLabel || next.buttonUrl)) continue;
      cards.push(next);
    }
    return cards.slice(0, 6);
  };
  for (const item of source) {
    if (!item || !item.id || seen.has(item.id)) continue;
    const isBuiltin = HOME_LAYOUT_ALLOWED_IDS.includes(item.id);
    const isCustom = /^custom_[a-z0-9_-]{3,60}$/i.test(String(item.id || ''));
    if (!isBuiltin && !isCustom) continue;
    seen.add(item.id);
    if (isBuiltin) {
      out.push({
        id: item.id,
        kind: 'builtin',
        visible: item.visible !== false,
        kicker: trimText(item.kicker, 120),
        title: trimText(item.title, 180),
        text: trimText(item.text, 1500),
        extra: trimText(item.extra, 220),
        image: trimText(item.image, 600),
        buttonLabel: trimText(item.buttonLabel, 80),
        buttonUrl: trimText(item.buttonUrl, 600),
        buttonAltLabel: trimText(item.buttonAltLabel, 80),
        buttonAltUrl: trimText(item.buttonAltUrl, 600),
        articleIds: sanitizeArticleIds(item.articleIds),
        sapereArticleIds: sanitizeArticleIds(item.sapereArticleIds),
        producerCards: sanitizeProducerCards(item.producerCards),
      });
      continue;
    }
    out.push({
      id: String(item.id),
      kind: 'custom',
      blockType: ['article', 'button', 'producer', 'custom'].includes(String(item.blockType || '')) ? String(item.blockType) : 'custom',
      visible: item.visible !== false,
      title: trimText(item.title, 140),
      text: trimText(item.text, 1200),
      kicker: trimText(item.kicker, 80),
      image: trimText(item.image, 600),
      buttonLabel: trimText(item.buttonLabel, 60),
      buttonUrl: trimText(item.buttonUrl, 600),
    });
  }
  for (const id of HOME_LAYOUT_ALLOWED_IDS) {
    if (seen.has(id)) continue;
    out.push({ id, kind: 'builtin', visible: true });
  }
  return out;
}

async function getHomeLayoutConfig(env) {
  const kv = getStateKV(env);
  const fallback = normalizeHomeLayoutConfig(HOME_LAYOUT_ALLOWED_IDS.map((id) => ({ id, visible: true })));
  if (!kv) return { items: fallback, source: 'default', updatedAt: 0 };
  const stored = await kvGetJson(kv, HOME_LAYOUT_KV_KEY);
  if (!stored || !Array.isArray(stored.items)) {
    return { items: fallback, source: 'default', updatedAt: 0 };
  }
  return {
    items: normalizeHomeLayoutConfig(stored.items),
    source: 'kv',
    updatedAt: Number(stored.updatedAt || 0),
  };
}

async function saveHomeLayoutConfig(env, items) {
  const kv = getStateKV(env);
  if (!kv) throw new Error('KV non configurato');
  const payload = {
    items: normalizeHomeLayoutConfig(items),
    updatedAt: Date.now(),
  };
  await kvPutJson(kv, HOME_LAYOUT_KV_KEY, payload);
  return payload;
}

function parseCookies(request) {
  const raw = request.headers.get('Cookie') || '';
  const out = {};
  raw.split(';').forEach(function(part) {
    const idx = part.indexOf('=');
    if (idx <= 0) return;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key) out[key] = value;
  });
  return out;
}

function sanitizeClientId(value) {
  const v = String(value || '').trim();
  return /^[a-z0-9_-]{12,80}$/i.test(v) ? v : '';
}

async function sha256Hex(input) {
  const data = new TextEncoder().encode(String(input || ''));
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function getVisitorIdentity(request) {
  const cookies = parseCookies(request);
  let clientId = sanitizeClientId(cookies[CLIENT_COOKIE_NAME]);
  let isNewClientId = false;

  if (!clientId) {
    const headerId = sanitizeClientId(request.headers.get('X-SW-Client-Id') || '');
    clientId = headerId || ('sw_' + crypto.randomUUID().replace(/-/g, ''));
    isNewClientId = true;
  }

  const ip = String(request.headers.get('CF-Connecting-IP') || '').trim();
  const ua = String(request.headers.get('User-Agent') || '').trim().slice(0, 180);
  const fingerprint = ip ? await sha256Hex(ip + '|' + ua) : '';
  const keys = ['cid:' + clientId];
  if (fingerprint) keys.push('fp:' + fingerprint);

  return { clientId, fingerprint, keys, isNewClientId };
}

function buildClientCookieHeaders(identity) {
  if (!identity || !identity.clientId) return {};
  return {
    'Set-Cookie': `${CLIENT_COOKIE_NAME}=${identity.clientId}; Path=/; Max-Age=31536000; SameSite=Lax; Secure; HttpOnly`,
  };
}

function todayKeyUTC() {
  return new Date().toISOString().slice(0, 10);
}

async function kvGetJson(kv, key) {
  if (!kv || !key) return null;
  try {
    const raw = await kv.get(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}

async function kvPutJson(kv, key, value, options) {
  if (!kv || !key) return;
  await kv.put(key, JSON.stringify(value), options || {});
}

function normalizeEmailValue(input) {
  return String(input || '').trim().toLowerCase();
}

function isValidEmail(input) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(normalizeEmailValue(input));
}

function trimText(input, maxLen) {
  return String(input || '').trim().slice(0, maxLen || 500);
}

async function sendTransactionalEmail(env, payload) {
  const toEmail = trimText(payload && payload.to, 180);
  const subject = trimText(payload && payload.subject, 220);
  const html = String(payload && payload.html || '');
  const text = String(payload && payload.text || '');
  const replyTo = trimText(payload && payload.replyTo, 180);
  const toName = trimText(payload && payload.toName, 120);
  if (!toEmail || !subject) throw new Error('Email incompleta');

  const sender = { email: getMailerFromEmail(env), name: getMailerFromName(env) };
  const brevoKey = getBrevoApiKey(env);
  if (brevoKey) {
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoKey,
      },
      body: JSON.stringify({
        sender,
        to: [{ email: toEmail, name: toName || undefined }],
        replyTo: replyTo ? { email: replyTo } : undefined,
        subject,
        htmlContent: html,
        textContent: text,
      }),
    });
    const raw = await r.text().catch(() => '');
    if (!r.ok) throw new Error('Brevo mail ' + r.status + ': ' + raw.slice(0, 220));
    return { ok: true, provider: 'brevo' };
  }

  const sendGridKey = getSendGridApiKey(env);
  if (sendGridKey) {
    const r = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sendGridKey,
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: toEmail, name: toName || undefined }] }],
        from: sender,
        reply_to: replyTo ? { email: replyTo } : undefined,
        subject,
        content: [
          { type: 'text/plain', value: text || subject },
          { type: 'text/html', value: html || ('<p>' + subject + '</p>') },
        ],
      }),
    });
    const raw = await r.text().catch(() => '');
    if (!r.ok) throw new Error('SendGrid mail ' + r.status + ': ' + raw.slice(0, 220));
    return { ok: true, provider: 'sendgrid' };
  }

  throw new Error('Mailer non configurato: imposta BREVO_API_KEY o SENDGRID_API_KEY');
}

function buildWaitlistWelcomeEmail(lead) {
  const firstName = trimText(lead && lead.name, 80) || 'appassionato';
  const wineName = trimText(lead && lead.wine_name, 160) || 'una bottiglia della Private Collection';
  const subject = 'Benvenuto nella Waitlist Private Collection';
  const text =
    'Ciao ' + firstName + ',\n\n' +
    'sei entrato nella waitlist privata di SommelierWorld Maison.\n' +
    'Abbiamo registrato il tuo interesse per: ' + wineName + '.\n\n' +
    'Ti aggiorneremo appena la Private Collection aprira l accesso o rendera disponibile una prenotazione dedicata.\n\n' +
    'SommelierWorld Maison\ninfo@sommelierworld.vin';
  const html =
    '<div style="font-family:Georgia,serif;background:#0b0806;color:#f5efe2;padding:24px;">' +
      '<div style="max-width:620px;margin:0 auto;border:1px solid rgba(212,175,55,.18);border-radius:16px;padding:28px;background:linear-gradient(180deg,#1a100b,#0c0c0c);">' +
        '<div style="font-size:12px;letter-spacing:4px;color:#d4af37;margin-bottom:14px;">SOMMELIERWORLD MAISON</div>' +
        '<h1 style="margin:0 0 12px;font-size:30px;font-weight:400;color:#f5efe2;">Private Collection Waitlist</h1>' +
        '<p style="font-size:18px;line-height:1.7;color:rgba(245,239,226,.84);">Ciao ' + firstName + ', hai prenotato il tuo accesso esclusivo alla nostra Maison.</p>' +
        '<p style="font-size:18px;line-height:1.7;color:rgba(245,239,226,.78);">Abbiamo registrato il tuo interesse per <strong>' + wineName + '</strong>. Ti avviseremo non appena la Private Collection aprira il suo primo rilascio o rendera disponibile una prenotazione riservata.</p>' +
        '<p style="font-size:16px;line-height:1.7;color:rgba(212,175,55,.78);margin-top:18px;">Questa non e una mail automatica impersonale: e il primo passo dentro la cave privee SommelierWorld.</p>' +
        '<p style="font-size:14px;line-height:1.7;color:rgba(245,239,226,.55);margin-top:22px;">SommelierWorld Maison<br>info@sommelierworld.vin</p>' +
      '</div>' +
    '</div>';
  return { subject, text, html };
}

function buildAdminLeadEmail(lead) {
  const title = lead && lead.kind === 'private_collection_waitlist'
    ? 'Nuovo lead waitlist Private Collection'
    : 'Nuovo lead dal sito SommelierWorld';
  const lines = [
    'Tipo lead: ' + trimText(lead && lead.kind, 80),
    'Nome: ' + trimText(lead && lead.name, 120),
    'Email: ' + trimText(lead && lead.email, 180),
    'Vino: ' + trimText(lead && lead.wine_name, 180),
    'Wine ID: ' + trimText(lead && lead.wine_id, 80),
    'Origine UI: ' + trimText(lead && lead.source, 120),
    'Lingua: ' + trimText(lead && lead.lang, 12),
    'Messaggio: ' + trimText(lead && lead.message, 400),
    'Cantina: ' + trimText(lead && lead.company, 180),
    'Pacchetto: ' + trimText(lead && lead.package_label, 180),
    'Creato il: ' + new Date((lead && lead.createdAt) || Date.now()).toISOString(),
  ].filter((row) => !row.endsWith(': '));
  return {
    subject: title,
    text: lines.join('\n'),
    html: '<pre style="font-family:Consolas,monospace;white-space:pre-wrap;line-height:1.6;">' + lines.join('\n') + '</pre>',
  };
}

async function saveLeadRecord(env, payload) {
  const kv = getStateKV(env);
  const email = normalizeEmailValue(payload && payload.email);
  const wineId = trimText(payload && payload.wine_id, 80);
  const dedupeHash = await sha256Hex([payload && payload.kind || 'lead', email, wineId].join('|'));
  const dedupeKey = 'lead_map:' + dedupeHash;
  const now = Date.now();
  let record = null;

  if (kv) {
    const existingId = await kv.get(dedupeKey);
    if (existingId) record = await kvGetJson(kv, 'lead:' + existingId);
  }

  if (!record) {
    record = {
      id: 'lead_' + crypto.randomUUID(),
      createdAt: now,
      touchCount: 0,
    };
  }

  record.kind = trimText(payload && payload.kind, 80) || 'site_lead';
  record.name = trimText(payload && payload.name, 120);
  record.email = email;
  record.wine_id = wineId;
  record.wine_name = trimText(payload && payload.wine_name, 180);
  record.lang = trimText(payload && payload.lang, 12) || 'it';
  record.source = trimText(payload && payload.source, 120);
  record.message = trimText(payload && payload.message, 600);
  record.company = trimText(payload && payload.company, 180);
  record.package_label = trimText(payload && payload.package_label, 180);
  record.region = trimText(payload && payload.region, 120);
  record.updatedAt = now;
  record.touchCount = (record.touchCount || 0) + 1;
  record.status = 'active';

  if (kv) {
    await kvPutJson(kv, 'lead:' + record.id, record);
    await kv.put(dedupeKey, record.id, { expirationTtl: 60 * 60 * 24 * 365 });
  }

  return { record, kv_enabled: !!kv };
}

async function getEliteState(env, identity) {
  const kv = getStateKV(env);
  if (!kv || !identity) return { active: false, kv_enabled: !!kv };
  for (const key of identity.keys || []) {
    const rec = await kvGetJson(kv, 'elite:' + key);
    if (rec && rec.active) return { active: true, kv_enabled: true, record: rec, key };
  }
  return { active: false, kv_enabled: true };
}

async function getUsageState(env, identity, dateKey) {
  const kv = getStateKV(env);
  if (!kv || !identity) {
    return {
      kv_enabled: !!kv,
      free_limit: FREE_DAILY_CONSULTS,
      used: 0,
      remaining: FREE_DAILY_CONSULTS,
      blocked: false,
      date: dateKey || todayKeyUTC(),
    };
  }

  const dkey = dateKey || todayKeyUTC();
  let used = 0;
  for (const key of identity.keys || []) {
    const rec = await kvGetJson(kv, `usage:${dkey}:${key}`);
    const count = rec && Number.isFinite(rec.count) ? rec.count : parseInt(rec && rec.count || '0', 10);
    if (Number.isFinite(count)) used = Math.max(used, count || 0);
  }

  return {
    kv_enabled: true,
    free_limit: FREE_DAILY_CONSULTS,
    used,
    remaining: Math.max(0, FREE_DAILY_CONSULTS - used),
    blocked: used >= FREE_DAILY_CONSULTS,
    date: dkey,
  };
}

async function incrementUsageState(env, identity, currentState) {
  const kv = getStateKV(env);
  if (!kv || !identity) return currentState;
  const dkey = (currentState && currentState.date) || todayKeyUTC();
  const nextCount = Math.max(0, (currentState && currentState.used) || 0) + 1;
  const payload = { count: nextCount, updatedAt: Date.now(), date: dkey };
  for (const key of identity.keys || []) {
    await kvPutJson(kv, `usage:${dkey}:${key}`, payload, { expirationTtl: 60 * 60 * 24 * 3 });
  }
  return {
    kv_enabled: true,
    free_limit: FREE_DAILY_CONSULTS,
    used: nextCount,
    remaining: Math.max(0, FREE_DAILY_CONSULTS - nextCount),
    blocked: nextCount >= FREE_DAILY_CONSULTS,
    date: dkey,
  };
}

async function getConsultationQuota(env, request, identity) {
  const visitor = identity || await getVisitorIdentity(request);
  const eliteState = await getEliteState(env, visitor);
  const usageState = await getUsageState(env, visitor, todayKeyUTC());
  return {
    identity: visitor,
    elite: !!eliteState.active,
    kv_enabled: !!usageState.kv_enabled,
    free_limit: usageState.free_limit,
    used: usageState.used,
    remaining: eliteState.active ? null : usageState.remaining,
    blocked: !eliteState.active && usageState.blocked,
    date: usageState.date,
  };
}

async function saveEliteState(env, identity, meta) {
  const kv = getStateKV(env);
  if (!kv || !identity) return false;
  const payload = {
    active: true,
    updatedAt: Date.now(),
    session_id: meta && meta.session_id ? String(meta.session_id) : '',
    customer_email: meta && meta.customer_email ? String(meta.customer_email) : '',
    source: meta && meta.source ? String(meta.source) : 'stripe',
  };
  for (const key of identity.keys || []) {
    await kvPutJson(kv, 'elite:' + key, payload);
  }
  if (payload.customer_email) {
    await kvPutJson(kv, 'elite_email:' + payload.customer_email.toLowerCase(), payload);
  }
  return true;
}

function emptyLearningProfile() {
  return {
    updatedAt: 0,
    sessionsCount: 0,
    positiveCount: 0,
    negativeCount: 0,
    favoriteCountries: {},
    favoriteWineTypes: {},
    preferredTraits: {},
    recentLikedWines: [],
    recentDislikedWines: [],
    recentDishes: [],
  };
}

function normalizeLearningProfile(raw) {
  const base = emptyLearningProfile();
  const src = raw && typeof raw === 'object' ? raw : {};
  base.updatedAt = Number(src.updatedAt || 0) || 0;
  base.sessionsCount = Number(src.sessionsCount || 0) || 0;
  base.positiveCount = Number(src.positiveCount || 0) || 0;
  base.negativeCount = Number(src.negativeCount || 0) || 0;
  base.favoriteCountries = src.favoriteCountries && typeof src.favoriteCountries === 'object' ? src.favoriteCountries : {};
  base.favoriteWineTypes = src.favoriteWineTypes && typeof src.favoriteWineTypes === 'object' ? src.favoriteWineTypes : {};
  base.preferredTraits = src.preferredTraits && typeof src.preferredTraits === 'object' ? src.preferredTraits : {};
  base.recentLikedWines = Array.isArray(src.recentLikedWines) ? src.recentLikedWines.slice(0, 8) : [];
  base.recentDislikedWines = Array.isArray(src.recentDislikedWines) ? src.recentDislikedWines.slice(0, 8) : [];
  base.recentDishes = Array.isArray(src.recentDishes) ? src.recentDishes.slice(0, 8) : [];
  return base;
}

function bumpCounterMap(map, key, amount) {
  if (!key) return map || {};
  const out = { ...(map || {}) };
  const normKey = String(key).trim();
  if (!normKey) return out;
  out[normKey] = (Number(out[normKey] || 0) || 0) + (amount || 1);
  return out;
}

function pushUniqueRecent(list, item, limit, keyName) {
  const out = [];
  const seen = new Set();
  const items = [item].concat(Array.isArray(list) ? list : []);
  for (const entry of items) {
    if (!entry) continue;
    const key = String((entry && keyName && entry[keyName]) || entry.label || entry.wine || entry.name || '').toLowerCase().trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(entry);
    if (out.length >= (limit || 8)) break;
  }
  return out;
}

function getPrimaryIdentityKey(identity) {
  return identity && identity.keys && identity.keys[0] ? identity.keys[0] : '';
}

async function getLearningProfile(env, identity) {
  const kv = getStateKV(env);
  if (!kv || !identity) return emptyLearningProfile();
  for (const key of identity.keys || []) {
    const rec = await kvGetJson(kv, 'learning_profile:' + key);
    if (rec) return normalizeLearningProfile(rec);
  }
  return emptyLearningProfile();
}

async function putLearningProfile(env, identity, profile) {
  const kv = getStateKV(env);
  if (!kv || !identity) return;
  const normalized = normalizeLearningProfile(profile);
  normalized.updatedAt = Date.now();
  for (const key of identity.keys || []) {
    await kvPutJson(kv, 'learning_profile:' + key, normalized);
  }
}

async function getLearningSession(env, identity, sessionId) {
  const kv = getStateKV(env);
  const primaryKey = getPrimaryIdentityKey(identity);
  if (!kv || !primaryKey || !sessionId) return null;
  return await kvGetJson(kv, `learning_session:${primaryKey}:${sessionId}`);
}

async function putLearningSession(env, identity, sessionId, data) {
  const kv = getStateKV(env);
  const primaryKey = getPrimaryIdentityKey(identity);
  if (!kv || !primaryKey || !sessionId) return;
  await kvPutJson(kv, `learning_session:${primaryKey}:${sessionId}`, data, { expirationTtl: 60 * 60 * 24 * 30 });
}

function applyTraitCounters(map, traits) {
  let out = { ...(map || {}) };
  const src = traits && typeof traits === 'object' ? traits : {};
  Object.keys(src).forEach((key) => {
    const value = Number(src[key] || 0) || 0;
    if (value >= 3) out = bumpCounterMap(out, key, 1);
  });
  return out;
}

async function applyLearningEvent(env, identity, payload) {
  const event = payload && payload.event ? String(payload.event) : '';
  const data = payload && payload.data && typeof payload.data === 'object' ? payload.data : {};
  const sessionId = payload && payload.sessionId ? String(payload.sessionId) : '';
  let profile = await getLearningProfile(env, identity);

  if (event === 'session_start') {
    profile.sessionsCount += 1;
    if (data.paese) profile.favoriteCountries = bumpCounterMap(profile.favoriteCountries, data.paese, 1);
    if (data.wineType && data.wineType !== 'any') profile.favoriteWineTypes = bumpCounterMap(profile.favoriteWineTypes, data.wineType, 1);
    profile.preferredTraits = applyTraitCounters(profile.preferredTraits, data.dishTraits);
    if (data.dishSummary) {
      profile.recentDishes = pushUniqueRecent(profile.recentDishes, {
        label: String(data.dishSummary).slice(0, 140),
        ts: Date.now(),
      }, 8, 'label');
    }
    await putLearningProfile(env, identity, profile);
    if (sessionId) {
      await putLearningSession(env, identity, sessionId, {
        sessionId,
        startedAt: Date.now(),
        menuExcerpt: String(data.menuExcerpt || '').slice(0, 220),
        wineType: String(data.wineType || ''),
        paese: String(data.paese || ''),
        regione: String(data.regione || ''),
        budget: Number(data.budget || 0) || 0,
        dishSummary: String(data.dishSummary || '').slice(0, 180),
        dishTraits: data.dishTraits && typeof data.dishTraits === 'object' ? data.dishTraits : {},
        wine: '',
      });
    }
    return normalizeLearningProfile(profile);
  }

  if (event === 'wine_chosen' && sessionId) {
    const session = (await getLearningSession(env, identity, sessionId)) || { sessionId };
    session.wine = String(data.wine || '').slice(0, 120);
    await putLearningSession(env, identity, sessionId, session);
    return normalizeLearningProfile(profile);
  }

  if (event === 'feedback') {
    const vote = Number(data.vote || 0) || 0;
    const session = sessionId ? await getLearningSession(env, identity, sessionId) : null;
    const wine = String((data.wine || (session && session.wine) || '')).slice(0, 120);
    const wineType = String(data.wineType || (session && session.wineType) || '');
    const paese = String(data.paese || (session && session.paese) || '');
    const dishSummary = String(data.dishSummary || (session && session.dishSummary) || '').slice(0, 180);
    const dishTraits = data.dishTraits && typeof data.dishTraits === 'object'
      ? data.dishTraits
      : (session && session.dishTraits && typeof session.dishTraits === 'object' ? session.dishTraits : {});

    if (vote > 0) {
      profile.positiveCount += 1;
      if (wine) {
        profile.recentLikedWines = pushUniqueRecent(profile.recentLikedWines, { wine, ts: Date.now() }, 8, 'wine');
      }
      if (paese) profile.favoriteCountries = bumpCounterMap(profile.favoriteCountries, paese, 2);
      if (wineType && wineType !== 'any') profile.favoriteWineTypes = bumpCounterMap(profile.favoriteWineTypes, wineType, 2);
      profile.preferredTraits = applyTraitCounters(profile.preferredTraits, dishTraits);
    } else if (vote < 0) {
      profile.negativeCount += 1;
      if (wine) {
        profile.recentDislikedWines = pushUniqueRecent(profile.recentDislikedWines, { wine, ts: Date.now() }, 8, 'wine');
      }
    }
    if (dishSummary) {
      profile.recentDishes = pushUniqueRecent(profile.recentDishes, { label: dishSummary, ts: Date.now() }, 8, 'label');
    }
    await putLearningProfile(env, identity, profile);
    return normalizeLearningProfile(profile);
  }

  return normalizeLearningProfile(profile);
}

function slugifyKey(input) {
  return String(input || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function extractMenuLinesForWorker(menuText) {
  return String(menuText || '')
    .replace(/\r/g, '')
    .split('\n')
    .map(line => String(line || '').replace(/^[^A-Za-zÀ-ÿ0-9]+/, '').trim())
    .filter(line => line && line.length >= 3 && !/^(menu|antipasti|primi|secondi|contorni|dessert|dolci)\s*:?\s*$/i.test(line))
    .slice(0, 10);
}

function buildDishTechnicalSheet(dishName) {
  const name = String(dishName || '').trim();
  const lower = name.toLowerCase();
  const traits = {
    grassezza: 1,
    succulenza: 1,
    sapidita: 1,
    tendenza_dolce: 1,
    acidita: 1,
    aromaticita: 1,
  };
  const ingredients = [];
  const cooking = [];
  const counters = {
    grassezza: [/burro|fritto|frittura|panna|burrata|formaggio|guanciale|lardo|parmigiana|fonduta/i, 2],
    succulenza: [/carne|brasato|arrosto|ragu|ragù|hamburger|agnello|anatra|salsiccia|polpo|tartare/i, 2],
    sapidita: [/acciug|pecorino|parmigiano|capperi|baccala|baccalà|cozza|vongol|ostric|salmone affumicato/i, 2],
    tendenza_dolce: [/zucca|carota|cipolla|pomodorini|mais|castagna|miele|frutta/i, 2],
    acidita: [/pomodoro|agrumi|limone|lime|aceto|yogurt|marinato|citronette/i, 2],
    aromaticita: [/tartufo|funghi|rosmarino|salvia|basilico|menta|zafferano|erbe|spezi/i, 2],
  };

  Object.keys(counters).forEach((key) => {
    const [re, amount] = counters[key];
    if (re.test(lower)) traits[key] += amount;
  });

  [
    ['carne', /manzo|vitello|agnello|anatra|pollo|cinghiale|piccione|selvaggina/i],
    ['pesce', /branzino|orata|ricciola|tonno|salmone|gamber|scampi|polpo|seppia|baccal/i],
    ['burro', /burro/i],
    ['formaggio', /pecorino|parmigiano|burrata|gorgonzola|formaggio/i],
    ['pomodoro', /pomodoro|pomodorini/i],
    ['tartufo', /tartufo/i],
    ['funghi', /fung|porcini/i],
  ].forEach(([label, re]) => { if (re.test(lower)) ingredients.push(label); });

  [
    ['frittura', /fritto|frittura/i],
    ['brasatura', /brasato|stufato/i],
    ['griglia', /griglia|grigliato/i],
    ['forno', /forno|arrosto/i],
    ['mantecatura', /mantecato|risotto/i],
    ['crudo', /crudo|tartare|carpaccio/i],
  ].forEach(([label, re]) => { if (re.test(lower)) cooking.push(label); });

  Object.keys(traits).forEach((key) => {
    traits[key] = Math.max(1, Math.min(5, traits[key]));
  });

  const pairing = [];
  if (traits.grassezza >= 3) pairing.push('Servono acidita o bollicina per pulire il palato');
  if (traits.succulenza >= 3) pairing.push('Serve struttura e, se rosso, tannino ben dosato');
  if (traits.sapidita >= 3) pairing.push('Meglio evitare vini troppo duri o austero-amari');
  if (traits.tendenza_dolce >= 3) pairing.push('Occorre freschezza o sapidita per contrasto');
  if (traits.acidita >= 3) pairing.push('Non usare vini magri o troppo esili');
  if (traits.aromaticita >= 3) pairing.push('Serve coerenza aromatica o buona intensita olfattiva');

  return {
    id: 'dish_' + slugifyKey(name),
    dish: name,
    source: 'auto-heuristic',
    traits,
    ingredients,
    cooking,
    pairing_logic: pairing,
    labels: { it: name, en: name, fr: name, ru: name },
    updatedAt: Date.now(),
  };
}

async function getDishSheet(env, dishName) {
  const kv = getStateKV(env);
  const key = slugifyKey(dishName);
  if (!kv || !key) return null;
  return await kvGetJson(kv, 'dish_sheet:' + key);
}

async function saveDishSheet(env, dishName, sheet) {
  const kv = getStateKV(env);
  const key = slugifyKey(dishName);
  if (!kv || !key || !sheet) return;
  await kvPutJson(kv, 'dish_sheet:' + key, sheet);
}

async function getOrCreateDishSheets(env, menuText) {
  const dishes = extractMenuLinesForWorker(menuText);
  const sheets = [];
  for (const dish of dishes) {
    let sheet = await getDishSheet(env, dish);
    if (!sheet) {
      sheet = buildDishTechnicalSheet(dish);
      await saveDishSheet(env, dish, sheet);
    }
    if (sheet) sheets.push(sheet);
  }
  return dedupeByKey(sheets, item => item && item.dish);
}

function buildDishSheetsPrompt(sheets) {
  if (!Array.isArray(sheets) || !sheets.length) return '';
  const lines = ['\n\nSCHEDE TECNICHE PIATTI DAL DATABASE KV (usa queste prima di formulare l abbinamento):'];
  sheets.slice(0, 8).forEach((sheet) => {
    const traits = sheet.traits || {};
    lines.push(`- ${sheet.dish}: grassezza ${traits.grassezza || 1}/5, succulenza ${traits.succulenza || 1}/5, sapidita ${traits.sapidita || 1}/5, tendenza dolce ${traits.tendenza_dolce || 1}/5, acidita ${traits.acidita || 1}/5, aromaticita ${traits.aromaticita || 1}/5.`);
    if (Array.isArray(sheet.pairing_logic) && sheet.pairing_logic.length) lines.push(`  Logica: ${sheet.pairing_logic.join('; ')}`);
  });
  return lines.join('\n');
}

function extractMenuFromSommelierPrompt(userMsg) {
  const raw = String(userMsg || '');
  const idx = raw.indexOf('Menu:\n');
  if (idx < 0) return '';
  let out = raw.slice(idx + 6);
  ['\nPaese richiesto:', '\nParametri desiderati:', '\nTipologia preferita:', '\nSuggerimenti didattici'].forEach((marker) => {
    const p = out.indexOf(marker);
    if (p >= 0) out = out.slice(0, p);
  });
  return out.trim();
}

function isSommelierConsultation(system, userMsg) {
  return String(system || '').includes('Sommelier Digitale di SommelierWorld') && String(userMsg || '').includes('Menu:\n');
}

function bestLabel(labels, lang, fallback) {
  if (labels && labels[lang]) return labels[lang];
  if (labels && labels.it) return labels.it;
  return fallback || '';
}

function normalizeLang(lang) {
  const raw = String(lang || 'it').toLowerCase();
  if (raw.startsWith('en')) return 'en';
  if (raw.startsWith('fr')) return 'fr';
  if (raw.startsWith('ru')) return 'ru';
  return 'it';
}

function getKnowledgeTitleForLang(item, lang) {
  const language = normalizeLang(lang);
  const translations = item && item.translations && item.translations.title ? item.translations.title : null;
  return truncateText((translations && translations[language]) || item.title || '', 220);
}

function getKnowledgeTextForLang(item, lang) {
  const language = normalizeLang(lang);
  const translations = item && item.translations && item.translations.text ? item.translations.text : null;
  return truncateText((translations && translations[language]) || item.extractedText || item.notes || '', 700);
}

async function ensureTerroirStaticDB(env) {
  const kv = getStateKV(env);
  const key = 'terroir_static_db:v1';
  if (!kv) return { ...TERROIR_STATIC_SEED, updatedAt: Date.now() };
  const existing = await kvGetJson(kv, key);
  if (existing && existing.countries && existing.denominations) return existing;
  const seeded = { ...TERROIR_STATIC_SEED, updatedAt: Date.now() };
  await kvPutJson(kv, key, seeded);
  return seeded;
}

function buildTerroirResponse(db, lang) {
  const language = String(lang || 'it').toLowerCase();
  return {
    version: db.version || 1,
    countries: (db.countries || []).map(item => ({ code: item.code, label: bestLabel(item.labels, language, item.code), labels: item.labels || {} })),
    denominations: (db.denominations || []).map(item => ({ id: item.id, label: bestLabel(item.labels, language, item.id), labels: item.labels || {}, country: item.country, region: item.region })),
  };
}

function isAdminAuthorized(request, env) {
  const headerPwd = String(request.headers.get('X-Admin-Pwd') || '').trim();
  return !!headerPwd && headerPwd === getAdminPassword(env);
}

async function getKnowledgeItems(env) {
  const kv = getStateKV(env);
  if (!kv || typeof kv.list !== 'function') return [];
  const listing = await kv.list({ prefix: 'knowledge_item:' });
  const items = [];
  for (const item of listing.keys || []) {
    const record = await kvGetJson(kv, item.name);
    if (record) items.push(record);
  }
  items.sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0));
  return items;
}

async function getLeadItems(env) {
  const kv = getStateKV(env);
  if (!kv || typeof kv.list !== 'function') return [];
  const listing = await kv.list({ prefix: 'lead:' });
  const items = [];
  for (const item of listing.keys || []) {
    const record = await kvGetJson(kv, item.name);
    if (record) items.push(record);
  }
  items.sort((a, b) => Number(b.updatedAt || b.createdAt || 0) - Number(a.updatedAt || a.createdAt || 0));
  return items;
}

async function updateLeadRecord(env, leadId, fields) {
  const kv = getStateKV(env);
  if (!kv) throw new Error('KV non configurato');
  const key = 'lead:' + String(leadId || '').trim();
  const record = await kvGetJson(kv, key);
  if (!record) throw new Error('Lead non trovato');
  const allowed = {
    status: trimText(fields && fields.status, 40),
    admin_note: trimText(fields && fields.admin_note, 500),
    priority: trimText(fields && fields.priority, 40),
  };
  const next = {
    ...record,
    status: allowed.status || record.status || 'active',
    admin_note: typeof allowed.admin_note === 'string' ? allowed.admin_note : (record.admin_note || ''),
    priority: allowed.priority || record.priority || '',
    updatedAt: Date.now(),
  };
  await kvPutJson(kv, key, next);
  return next;
}

async function getValidatedKnowledgeContext(env, lang) {
  const items = await getKnowledgeItems(env);
  const approved = items.filter(item => item && item.status === 'validated').slice(0, 4);
  if (!approved.length) return '';
  return '\n\nCONOSCENZA PRIORITARIA VALIDATA DALL ADMIN:\n' +
    approved.map(item => `- ${getKnowledgeTitleForLang(item, lang)}: ${getKnowledgeTextForLang(item, lang)}`).join('\n');
}

async function extractKnowledgeText(env, title, notes, dataUrl, mimeType) {
  const safeNotes = String(notes || '').trim();
  if (safeNotes) return safeNotes;
  const mime = String(mimeType || '');
  if (/^image\//i.test(mime) && dataUrl && dataUrl.includes(',')) {
    const imageB64 = dataUrl.split(',')[1];
    const system = 'Sei un OCR professionale di ricette. Trascrivi solo contenuti realmente leggibili. Nessuna invenzione.';
    const user = 'Leggi questo documento culinario e restituisci testo pulito con ingredienti, preparazione, cotture e note di servizio. Se non leggibile, dillo chiaramente.';
    const result = await ai(env, system, user, 1600, imageB64, mime || 'image/jpeg');
    return String(result && result.text || '').slice(0, 5000);
  }
  return '';
}

async function createKnowledgeItem(env, payload) {
  const kv = getStateKV(env);
  if (!kv) throw new Error('KV non configurato');
  const title = String(payload.title || '').trim();
  const mimeType = String(payload.mimeType || '').trim();
  const dataUrl = String(payload.dataUrl || '').trim();
  const notes = String(payload.notes || '').trim();
  if (!title) throw new Error('Titolo obbligatorio');
  const extractedText = await extractKnowledgeText(env, title, notes, dataUrl, mimeType);
  const item = {
    id: 'kb_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    title,
    mimeType,
    status: extractedText ? 'validated' : 'pending_validation',
    sourceType: /^image\//i.test(mimeType) ? 'image' : (/pdf/i.test(mimeType) ? 'pdf' : 'file'),
    extractedText,
    notes,
    priority: 'max',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    translation_status: 'pending',
  };
  await enrichKnowledgeTranslations(env, item);
  await kvPutJson(kv, 'knowledge_item:' + item.id, item);
  return item;
}

async function updateKnowledgeStatus(env, itemId, status) {
  const kv = getStateKV(env);
  if (!kv) throw new Error('KV non configurato');
  const key = 'knowledge_item:' + String(itemId || '');
  const item = await kvGetJson(kv, key);
  if (!item) throw new Error('Voce knowledge non trovata');
  item.status = status;
  item.updatedAt = Date.now();
  await kvPutJson(kv, key, item);
  return item;
}

async function regenerateKnowledgeTranslations(env, itemId) {
  const kv = getStateKV(env);
  if (!kv) throw new Error('KV non configurato');
  const key = 'knowledge_item:' + String(itemId || '');
  const item = await kvGetJson(kv, key);
  if (!item) throw new Error('Voce knowledge non trovata');
  item.translation_status = 'pending';
  await enrichKnowledgeTranslations(env, item);
  await kvPutJson(kv, key, item);
  return item;
}

function truncateText(value, max) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max || 500);
}

async function generateKnowledgeTranslations(env, title, text) {
  const safeTitle = truncateText(title, 160);
  const safeText = truncateText(text, 1800);
  if (!safeTitle && !safeText) {
    return {
      title: { it: safeTitle, en: safeTitle, fr: safeTitle, ru: safeTitle },
      text: { it: safeText, en: safeText, fr: safeText, ru: safeText },
      provider: 'none',
    };
  }
  const system =
    'You are a professional wine and gastronomy translator. ' +
    'Return ONLY valid JSON with this schema: ' +
    '{"title":{"it":"","en":"","fr":"","ru":""},"text":{"it":"","en":"","fr":"","ru":""}}. ' +
    'Keep terminology precise and natural for wine, gastronomy, terroir and pairing. No markdown.';
  const user =
    'Translate/adapt the following knowledge record into Italian, English, French and Russian.\n\n' +
    'TITLE:\n' + safeTitle + '\n\n' +
    'TEXT:\n' + safeText;
  const result = await aiForTranslation(env, system, user, 2200);
  let parsed = null;
  try {
    parsed = JSON.parse(sanitizeJsonText(result && result.text || '{}'));
  } catch (_) {
    parsed = null;
  }
  if (!parsed || !parsed.title || !parsed.text) {
    return {
      title: { it: safeTitle, en: safeTitle, fr: safeTitle, ru: safeTitle },
      text: { it: safeText, en: safeText, fr: safeText, ru: safeText },
      provider: result && result.provider ? result.provider : 'fallback',
    };
  }
  return {
    title: {
      it: truncateText(parsed.title.it || safeTitle, 220),
      en: truncateText(parsed.title.en || safeTitle, 220),
      fr: truncateText(parsed.title.fr || safeTitle, 220),
      ru: truncateText(parsed.title.ru || safeTitle, 220),
    },
    text: {
      it: truncateText(parsed.text.it || safeText, 2400),
      en: truncateText(parsed.text.en || safeText, 2400),
      fr: truncateText(parsed.text.fr || safeText, 2400),
      ru: truncateText(parsed.text.ru || safeText, 2400),
    },
    provider: result && result.provider ? result.provider : 'unknown',
  };
}

async function enrichKnowledgeTranslations(env, item) {
  const sourceText = item && (item.extractedText || item.notes || '');
  if (!item) return item;
  try {
    const translations = await generateKnowledgeTranslations(env, item.title || '', sourceText || '');
    item.translations = translations;
    item.translation_status = 'ready';
    item.translation_provider = translations.provider || 'unknown';
  } catch (e) {
    item.translations = item.translations || null;
    item.translation_status = 'failed';
    item.translation_error = truncateText(e.message || 'translation-error', 180);
  }
  item.updatedAt = Date.now();
  return item;
}

function extractPromptTextFromKnowledgeItems(items, lang) {
  const list = Array.isArray(items) ? items : [];
  if (!list.length) return '';
  const lines = ['\n\nINFORMAZIONI WEB RECENTI NON ANCORA VALIDATE DALL ADMIN (usa con prudenza, senza presentarle come certezze assolute):'];
  list.slice(0, 3).forEach((item) => {
    lines.push(`- ${getKnowledgeTitleForLang(item, lang)}: ${getKnowledgeTextForLang(item, lang)}`);
  });
  return lines.join('\n');
}

async function searchWithTavily(env, query) {
  const apiKey = getTavilyKey(env);
  if (!apiKey) return [];
  const resp = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      topic: 'general',
      search_depth: 'basic',
      include_answer: true,
      include_raw_content: false,
      max_results: 3,
    }),
  });
  if (!resp.ok) throw new Error('Tavily ' + resp.status);
  const data = await resp.json();
  return (data.results || []).map((item) => ({
    title: truncateText(item.title || query, 140),
    url: item.url || '',
    snippet: truncateText(item.content || item.snippet || '', 500),
    source: 'tavily',
  }));
}

async function searchWithSerper(env, query) {
  const apiKey = getSerperKey(env);
  if (!apiKey) return [];
  const resp = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
    },
    body: JSON.stringify({ q: query, gl: 'it', hl: 'it', num: 3 }),
  });
  if (!resp.ok) throw new Error('Serper ' + resp.status);
  const data = await resp.json();
  return (data.organic || []).slice(0, 3).map((item) => ({
    title: truncateText(item.title || query, 140),
    url: item.link || '',
    snippet: truncateText(item.snippet || '', 500),
    source: 'serper',
  }));
}

async function searchWebAgent(env, query) {
  const errors = [];
  try {
    const tavilyResults = await searchWithTavily(env, query);
    if (tavilyResults.length) return { provider: 'tavily', results: tavilyResults };
  } catch (e) {
    errors.push(e.message || 'Tavily error');
  }
  try {
    const serperResults = await searchWithSerper(env, query);
    if (serperResults.length) return { provider: 'serper', results: serperResults };
  } catch (e) {
    errors.push(e.message || 'Serper error');
  }
  if (!getTavilyKey(env) && !getSerperKey(env)) return { provider: 'none', results: [], errors: ['Nessuna search API key configurata'] };
  return { provider: 'none', results: [], errors };
}

function buildWebLearningQuery(topic, kind) {
  const q = truncateText(topic, 140);
  if (kind === 'dish') return `${q} ingredients cooking technique wine pairing`;
  if (kind === 'terroir') return `${q} wine region terroir soils climate grapes`;
  return `${q} wine information reliable sources`;
}

async function findKnowledgeItemBySlug(env, slug) {
  const kv = getStateKV(env);
  if (!kv || !slug) return null;
  const itemId = await kv.get('knowledge_slug:' + slug);
  if (!itemId) return null;
  return await kvGetJson(kv, 'knowledge_item:' + itemId);
}

async function saveKnowledgeSlug(env, slug, itemId) {
  const kv = getStateKV(env);
  if (!kv || !slug || !itemId) return;
  await kv.put('knowledge_slug:' + slug, itemId);
}

async function createPendingWebKnowledge(env, topic, kind, searchResult) {
  const kv = getStateKV(env);
  if (!kv) throw new Error('KV non configurato');
  const slug = `${kind}:${slugifyKey(topic)}`;
  const existing = await findKnowledgeItemBySlug(env, slug);
  if (existing) return existing;
  const snippets = (searchResult.results || []).map((item, idx) =>
    `${idx + 1}. ${truncateText(item.title, 160)}\n${truncateText(item.snippet, 700)}\nFonte: ${item.url}`
  ).join('\n\n');
  const item = {
    id: 'kb_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    title: `${kind === 'dish' ? 'Studio piatto' : 'Studio terroir'}: ${truncateText(topic, 120)}`,
    mimeType: 'text/web-search',
    status: 'pending_validation',
    sourceType: 'web_search',
    sourceProvider: searchResult.provider || 'unknown',
    sourceQuery: buildWebLearningQuery(topic, kind),
    sourceUrls: (searchResult.results || []).map((item) => item.url).filter(Boolean).slice(0, 3),
    topic: truncateText(topic, 120),
    kind,
    extractedText: snippets,
    notes: '',
    priority: 'review',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    translation_status: 'pending',
  };
  await enrichKnowledgeTranslations(env, item);
  await kvPutJson(kv, 'knowledge_item:' + item.id, item);
  await saveKnowledgeSlug(env, slug, item.id);
  return item;
}

async function studyTopicFromWeb(env, topic, kind) {
  const cleanTopic = truncateText(topic, 140);
  if (!cleanTopic) return null;
  const slug = `${kind}:${slugifyKey(cleanTopic)}`;
  const existing = await findKnowledgeItemBySlug(env, slug);
  if (existing) return existing;
  const searchResult = await searchWebAgent(env, buildWebLearningQuery(cleanTopic, kind));
  if (!searchResult.results || !searchResult.results.length) return null;
  return await createPendingWebKnowledge(env, cleanTopic, kind, searchResult);
}

function extractRequestedOriginFromPrompt(userMsg) {
  const raw = String(userMsg || '');
  const countryMatch = raw.match(/Paese richiesto:\s*([^\n]+)/i);
  const regionMatch = raw.match(/Regione richiesta:\s*([^\n]+)/i);
  return {
    country: countryMatch ? truncateText(countryMatch[1], 80) : '',
    region: regionMatch ? truncateText(regionMatch[1], 80) : '',
  };
}

function terroirHasOrigin(db, country, region) {
  const countries = (db && db.countries) || [];
  const denoms = (db && db.denominations) || [];
  const normalizedCountry = slugifyKey(country);
  const normalizedRegion = slugifyKey(region);
  const countryExists = !normalizedCountry || countries.some((item) => slugifyKey(bestLabel(item.labels, 'it', item.code)) === normalizedCountry);
  const regionExists = !normalizedRegion || denoms.some((item) => slugifyKey(item.region) === normalizedRegion);
  return countryExists && regionExists;
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
  if (/clos vougeot|vougeot|bourgogne|burgundy|barolo|langhe|nebbiolo|brunello|montalcino|vigneto|vigna|vineyard|terroir|suolo|cru|estate/.test(t)) return 'vineyard';
  if (/decanter|caraffa/.test(t)) return 'decanter';
  if (/cavatappi|corkscrew/.test(t)) return 'corkscrew';
  if (/champagne|franciacorta|spumante|prosecco|sparkling/.test(t)) return 'sparkling';
  if (/sommelier|degust|tasting|calice/.test(t)) return 'sommelier';
  if (/cantina|barrique|barrels|cellar/.test(t)) return 'cellar';
  if (/vendemmia|harvest|grapes/.test(t)) return 'harvest';
  if (/bottiglia|bottle|label|etichetta/.test(t)) return 'wine';
  if (/bicchiere|glass/.test(t)) return 'glass';
  if (/uva|grape/.test(t)) return 'grapes';
  return 'wine';
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
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Pwd" ,
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
      const tavilyKey = getTavilyKey(env);
      const serperKey = getSerperKey(env);
      const stripeKey = getStripeSecretKey(env);
      const stripePrice = getStripePriceId(env);
      const kv = getStateKV(env);
      const mailer = getMailerStatus(env);
      return ok({
        ok: true,
        assets: !!env.ASSETS,
        groq:   !!groqKey,
        gpt4o:  !!openAiKey,
        gemini: !!geminiKey,
        vision: !!geminiKey,
        pexels: !!pexelsKey,
        tavily: !!tavilyKey,
        serper: !!serperKey,
        stripe: !!stripeKey,
        stripe_price: !!stripePrice,
        mailer: mailer.configured,
        mailer_provider: mailer.provider,
        smtp_ready: mailer.smtp_ready,
        kv: !!kv,
        free_daily_consults: FREE_DAILY_CONSULTS,
        project: 'hidden-term-f2d0',
        required_env: {
          text_ai_any_of: ['GROQ_API_KEY', 'OPENAI_API_KEY', 'GEMINI_API_KEY'],
          vision_requires: ['GEMINI_API_KEY'],
          images_preferred: ['PEXELS_API_KEY'],
          web_search_any_of: ['TAVILY_API_KEY', 'SERPER_API_KEY'],
          translations_ai_any_of: ['GROQ_API_KEY', 'OPENAI_API_KEY', 'GEMINI_API_KEY'],
          elite_payments: ['STRIPE_SECRET_KEY', 'STRIPE_PRICE_ID'],
          elite_quota_server_side: ['APP_KV o SOMMELIER_WORLD_STORAGE (binding consigliato)'],
          mailer_any_of: ['BREVO_API_KEY o SENDGRID_API_KEY'],
          mailer_from: ['MAIL_FROM_EMAIL opzionale, default info@sommelierworld.vin'],
          mailer_admin_notify: ['ADMIN_EMAIL opzionale, default info@sommelierworld.vin'],
          smtp_ready_fields: ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'],
        },
        knowledge_languages: ['it', 'en', 'fr', 'ru'],
        provider: openAiKey ? 'gpt-4o-mini' : (groqKey ? 'groq' : (geminiKey ? 'gemini' : 'none')),
        version: 'v49-2026-05-08',
        status: (groqKey || openAiKey || geminiKey)
          ? 'OK' : 'ERRORE: nessuna API key configurata',
      });
    }

    /* ── POST /api/create-elite-checkout ── */
    if (url.pathname === '/api/create-elite-checkout') {
      if (request.method !== 'POST') return ok({ error: 'Metodo non permesso' }, 405);
      try {
        const body = await request.json().catch(() => ({}));
        const result = await createEliteCheckoutSession(request, env, body);
        return ok(result);
      } catch (e) {
        return ok({ error: e.message || 'Errore checkout Stripe' }, 500);
      }
    }

    /* ── POST /api/create-wine-checkout ── */
    if (url.pathname === '/api/create-wine-checkout') {
      if (request.method !== 'POST') return ok({ error: 'Metodo non permesso' }, 405);
      try {
        const body = await request.json().catch(() => ({}));
        const result = await createWineCheckoutSession(request, env, body);
        return ok(result);
      } catch (e) {
        return ok({ error: e.message || 'Errore checkout bottiglia' }, 500);
      }
    }

    /* ── POST /api/private-collection-waitlist ── */
    if (url.pathname === '/api/private-collection-waitlist') {
      if (request.method !== 'POST') return ok({ error: 'Metodo non permesso' }, 405);
      try {
        const body = await request.json().catch(() => ({}));
        const result = await handleLeadCapture(env, {
          kind: 'private_collection_waitlist',
          name: body && body.name,
          email: body && body.email,
          wine_id: body && body.wine_id,
          wine_name: body && body.wine_name,
          lang: body && body.lang,
          source: body && body.source,
          message: body && body.message,
        });
        return ok(result);
      } catch (e) {
        return ok({ error: e.message || 'Errore waitlist Private Collection' }, 500);
      }
    }

    /* ── POST /api/site-lead ── */
    if (url.pathname === '/api/site-lead') {
      if (request.method !== 'POST') return ok({ error: 'Metodo non permesso' }, 405);
      try {
        const body = await request.json().catch(() => ({}));
        const result = await handleLeadCapture(env, {
          kind: trimText(body && body.kind, 80) || 'site_lead',
          name: body && body.name,
          email: body && body.email,
          wine_id: body && body.wine_id,
          wine_name: body && body.wine_name,
          lang: body && body.lang,
          source: body && body.source,
          message: body && body.message,
          company: body && body.company,
          package_label: body && body.package_label,
          region: body && body.region,
        });
        return ok(result);
      } catch (e) {
        return ok({ error: e.message || 'Errore lead sito' }, 500);
      }
    }

    /* ── GET /api/stripe-session-status ── */
    if (url.pathname === '/api/stripe-session-status') {
      try {
        const sessionId = (url.searchParams.get('session_id') || '').trim();
        if (!sessionId) return ok({ error: 'session_id mancante' }, 400);
        const identity = await getVisitorIdentity(request);
        const result = await getStripeSessionStatus(env, sessionId);
        if (result && result.active) {
          await saveEliteState(env, identity, {
            session_id: result.session_id,
            customer_email: result.customer_email,
            source: 'stripe-session-status',
          });
        }
        const quota = await getConsultationQuota(env, request, identity);
        return ok({ ...result, quota }, 200, buildClientCookieHeaders(identity));
      } catch (e) {
        return ok({ error: e.message || 'Errore verifica sessione Stripe' }, 500);
      }
    }

    /* ── GET /api/quota-status ── */
    if (url.pathname === '/api/quota-status') {
      try {
        const identity = await getVisitorIdentity(request);
        const quota = await getConsultationQuota(env, request, identity);
        return ok(quota, 200, buildClientCookieHeaders(identity));
      } catch (e) {
        return ok({ error: e.message || 'Errore quota status' }, 500);
      }
    }

    /* ── GET /api/learning-profile ── */
    if (url.pathname === '/api/learning-profile') {
      try {
        const identity = await getVisitorIdentity(request);
        const profile = await getLearningProfile(env, identity);
        return ok({ ok: true, profile }, 200, buildClientCookieHeaders(identity));
      } catch (e) {
        return ok({ error: e.message || 'Errore learning profile' }, 500);
      }
    }

    /* ── POST /api/learning-event ── */
    if (url.pathname === '/api/learning-event') {
      if (request.method !== 'POST') return ok({ error: 'Metodo non permesso' }, 405);
      try {
        const identity = await getVisitorIdentity(request);
        const body = await request.json().catch(() => ({}));
        const profile = await applyLearningEvent(env, identity, body);
        return ok({ ok: true, profile }, 200, buildClientCookieHeaders(identity));
      } catch (e) {
        return ok({ error: e.message || 'Errore learning event' }, 500);
      }
    }

    /* ── GET /api/terroir-static ── */
    if (url.pathname === '/api/terroir-static') {
      try {
        const db = await ensureTerroirStaticDB(env);
        const lang = url.searchParams.get('lang') || 'it';
        return ok({ ok: true, data: buildTerroirResponse(db, lang) });
      } catch (e) {
        return ok({ error: e.message || 'Errore terroir statico' }, 500);
      }
    }

    /* ── GET /api/home-layout ── */
    if (url.pathname === '/api/home-layout') {
      try {
        const layout = await getHomeLayoutConfig(env);
        return ok({ ok: true, items: layout.items, source: layout.source, updatedAt: layout.updatedAt });
      } catch (e) {
        return ok({ error: e.message || 'Errore lettura layout home' }, 500);
      }
    }

    /* ── GET /api/admin/knowledge-list ── */
    if (url.pathname === '/api/admin/knowledge-list') {
      if (!isAdminAuthorized(request, env)) return ok({ error: 'Non autorizzato' }, 401);
      try {
        const items = await getKnowledgeItems(env);
        return ok({ ok: true, items });
      } catch (e) {
        return ok({ error: e.message || 'Errore lista knowledge' }, 500);
      }
    }

    /* ── GET /api/admin/leads-list ── */
    if (url.pathname === '/api/admin/leads-list') {
      if (!isAdminAuthorized(request, env)) return ok({ error: 'Non autorizzato' }, 401);
      try {
        const items = await getLeadItems(env);
        const mailer = getMailerStatus(env);
        return ok({
          ok: true,
          items,
          mailer,
          stats: {
            total: items.length,
            waitlist: items.filter((item) => item.kind === 'private_collection_waitlist').length,
            site: items.filter((item) => item.kind !== 'private_collection_waitlist').length,
            new_count: items.filter((item) => !item.status || item.status === 'active' || item.status === 'new').length,
          },
        });
      } catch (e) {
        return ok({ error: e.message || 'Errore lista lead' }, 500);
      }
    }

    /* ── GET|POST /api/admin/home-layout ── */
    if (url.pathname === '/api/admin/home-layout') {
      if (!isAdminAuthorized(request, env)) return ok({ error: 'Non autorizzato' }, 401);
      try {
        if (request.method === 'GET') {
          const layout = await getHomeLayoutConfig(env);
          return ok({ ok: true, items: layout.items, source: layout.source, updatedAt: layout.updatedAt });
        }
        if (request.method !== 'POST') return ok({ error: 'Metodo non permesso' }, 405);
        const body = await request.json().catch(() => ({}));
        const saved = await saveHomeLayoutConfig(env, body && body.items);
        return ok({ ok: true, items: saved.items, updatedAt: saved.updatedAt, source: 'kv' });
      } catch (e) {
        return ok({ error: e.message || 'Errore salvataggio layout home' }, 500);
      }
    }

    /* ── POST /api/admin/lead-update ── */
    if (url.pathname === '/api/admin/lead-update') {
      if (request.method !== 'POST') return ok({ error: 'Metodo non permesso' }, 405);
      if (!isAdminAuthorized(request, env)) return ok({ error: 'Non autorizzato' }, 401);
      try {
        const body = await request.json().catch(() => ({}));
        const item = await updateLeadRecord(env, body && body.id, body || {});
        return ok({ ok: true, item });
      } catch (e) {
        return ok({ error: e.message || 'Errore aggiornamento lead' }, 500);
      }
    }

    /* ── POST /api/admin/knowledge-upload ── */
    if (url.pathname === '/api/admin/knowledge-upload') {
      if (request.method !== 'POST') return ok({ error: 'Metodo non permesso' }, 405);
      if (!isAdminAuthorized(request, env)) return ok({ error: 'Non autorizzato' }, 401);
      try {
        const body = await request.json().catch(() => ({}));
        const item = await createKnowledgeItem(env, body);
        return ok({ ok: true, item });
      } catch (e) {
        return ok({ error: e.message || 'Errore upload knowledge' }, 500);
      }
    }

    /* ── POST /api/admin/knowledge-validate ── */
    if (url.pathname === '/api/admin/knowledge-validate') {
      if (request.method !== 'POST') return ok({ error: 'Metodo non permesso' }, 405);
      if (!isAdminAuthorized(request, env)) return ok({ error: 'Non autorizzato' }, 401);
      try {
        const body = await request.json().catch(() => ({}));
        const status = body && body.status === 'validated' ? 'validated' : 'pending_validation';
        const item = await updateKnowledgeStatus(env, body.id, status);
        return ok({ ok: true, item });
      } catch (e) {
        return ok({ error: e.message || 'Errore validazione knowledge' }, 500);
      }
    }

    /* ── POST /api/admin/knowledge-translate ── */
    if (url.pathname === '/api/admin/knowledge-translate') {
      if (request.method !== 'POST') return ok({ error: 'Metodo non permesso' }, 405);
      if (!isAdminAuthorized(request, env)) return ok({ error: 'Non autorizzato' }, 401);
      try {
        const body = await request.json().catch(() => ({}));
        const item = await regenerateKnowledgeTranslations(env, body.id);
        return ok({ ok: true, item });
      } catch (e) {
        return ok({ error: e.message || 'Errore rigenerazione traduzioni' }, 500);
      }
    }

    /* ── POST /api/admin/web-learn ── */
    if (url.pathname === '/api/admin/web-learn') {
      if (request.method !== 'POST') return ok({ error: 'Metodo non permesso' }, 405);
      if (!isAdminAuthorized(request, env)) return ok({ error: 'Non autorizzato' }, 401);
      try {
        const body = await request.json().catch(() => ({}));
        const topic = String(body && body.topic || '').trim();
        const kind = String(body && body.kind || 'dish').trim();
        if (!topic) return ok({ error: 'topic obbligatorio' }, 400);
        const item = await studyTopicFromWeb(env, topic, kind);
        return ok({ ok: true, item, found: !!item });
      } catch (e) {
        return ok({ error: e.message || 'Errore web learn' }, 500);
      }
    }

    /* ── POST /api/stripe-webhook ── */
    if (url.pathname === '/api/stripe-webhook') {
      if (request.method !== 'POST') return ok({ error: 'Metodo non permesso' }, 405);
      const webhookSecret = getStripeWebhookSecret(env);
      const raw = await request.text().catch(() => '');
      return ok({
        ok: true,
        received: !!raw,
        webhook_configured: !!webhookSecret,
        note: 'Webhook base ricevuto. Per accesso persistente multi-dispositivo servira una fase successiva con database utenti.',
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
      const { system, userMsg, maxTokens, language } = body;
      if (!system || !userMsg) return ok({ error: 'system e userMsg obbligatori' }, 400);
      if (!hasAnyAiKey(env)) {
        return ok({
          error: 'Nessuna API key configurata nel Worker. Imposta almeno una tra GROQ_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY.',
        }, 503);
      }
      try {
        const identity = await getVisitorIdentity(request);
        const quota = await getConsultationQuota(env, request, identity);
        if (quota.kv_enabled && quota.blocked && !quota.elite) {
          return ok({
            error: `Limite giornaliero raggiunto. Hai usato ${quota.used} consultazioni su ${quota.free_limit}. Passa a Elite per consultazioni illimitate.`,
            limit_reached: true,
            upgrade_required: true,
            quota,
          }, 402, buildClientCookieHeaders(identity));
        }
        const uiLang = normalizeLang(language);
        let finalSystem = system;
        let finalUserMsg = userMsg;
        let dishSheets = [];
        let learnedWebItems = [];
        if (isSommelierConsultation(system, userMsg)) {
          const menuText = extractMenuFromSommelierPrompt(userMsg);
          dishSheets = await getOrCreateDishSheets(env, menuText);
          const weakDishTopics = dishSheets
            .filter((sheet) => sheet && sheet.source === 'auto-heuristic')
            .map((sheet) => sheet.dish)
            .slice(0, 2);
          for (const topic of weakDishTopics) {
            const item = await studyTopicFromWeb(env, topic, 'dish').catch(() => null);
            if (item) learnedWebItems.push(item);
          }
          const terroirDB = await ensureTerroirStaticDB(env);
          const origin = extractRequestedOriginFromPrompt(userMsg);
          const terroirTopic = origin.region || origin.country;
          if (terroirTopic && !terroirHasOrigin(terroirDB, origin.country, origin.region)) {
            const terroirItem = await studyTopicFromWeb(env, terroirTopic, 'terroir').catch(() => null);
            if (terroirItem) learnedWebItems.push(terroirItem);
          }
          finalSystem += '\n\nOBBLIGO DI SCOMPOSIZIONE GASTRONOMICA:\n' +
            '- Prima di suggerire il vino, analizza ingredienti e cottura del piatto.\n' +
            '- Estrai sempre questi parametri: Grassezza, Succulenza, Sapidita, Tendenza Dolce, Acidita, Aromaticita.\n' +
            '- Basa l abbinamento su contrapposizione e concordanza.\n' +
            '- Se una scheda tecnica e presente nel database KV, usala come priorita assoluta.\n' +
            '- Non saltare mai l analisi tecnica prima della proposta dei vini.\n' +
            '- Se usi dati web non ancora validati, trattali come supporto prudente e non come verita assoluta.';
          finalSystem += await getValidatedKnowledgeContext(env, uiLang);
          finalUserMsg += buildDishSheetsPrompt(dishSheets);
          finalUserMsg += extractPromptTextFromKnowledgeItems(learnedWebItems, uiLang);
        }
        const result = await ai(env, finalSystem, finalUserMsg, maxTokens || 1800);
        const nextQuota = (!quota.elite && quota.kv_enabled)
          ? await incrementUsageState(env, identity, quota)
          : quota;
        return ok({
          text: result.text,
          provider: result.provider,
          quota: nextQuota,
          dish_sheets_used: dishSheets.length,
          web_learning_items: learnedWebItems.map((item) => ({ id: item.id, title: item.title, status: item.status, sourceType: item.sourceType })),
        }, 200, buildClientCookieHeaders(identity));
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
      if (!imageB64 || String(imageB64).length < 800) {
        return ok({ error: 'Immagine mancante o incompleta nel payload di scansione.' }, 400);
      }
      if (imageB64 && !hasVisionKey(env)) {
        if (!getOpenAiKey(env)) {
          return ok({
            text: '{"readable":false,"needs_new_photo":true,"quality_note":"Vision non configurata nel worker","unreadable_lines":[],"antipasti":[],"primi":[],"secondi":[],"contorni":[],"dessert":[],"altro":[]}',
            provider: 'vision-disabled',
            warning: 'Vision non configurata: manca GEMINI_API_KEY o OpenAI vision disponibile',
          }, 200);
        }
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

  /* Vision (foto menu) → OpenAI prima, Gemini fallback */
  if (imageB64 && openAiKey) {
    try {
      return { text: await gpt4oVision(openAiKey, system, userMsg, imageB64, imageMime, maxTokens), provider: 'gpt-4o-mini-vision' };
    } catch (e) { errors.push('GPT-4o-vision: ' + e.message); }
  }

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
        return { text: await gpt4o(openAiKey, system, userMsg, maxTokens), provider: 'gpt-4o-mini' };
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
        return { text: await gpt4o(openAiKey, system, userMsg, maxTokens), provider: 'gpt-4o-mini' };
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
    `Scrivi un articolo completo, ricco e professionale sul vino.\n` +
    `LUNGHEZZA: almeno 500 parole reali.\n\n` +
    `STRUTTURA HTML OBBLIGATORIA:\n` +
    `- usa <h3>Introduzione</h3> seguito da 1-2 paragrafi in <p>\n` +
    `- usa <h3>Approfondimento Tecnico</h3> seguito da 2-3 paragrafi in <p>\n` +
    `- usa <h3>Curiosita Finale</h3> seguito da 1 paragrafo in <p>\n` +
    `- puoi evidenziare concetti chiave con <b>...</b>\n` +
    `- non usare markdown\n\n` +
    `CONTENUTO:\n` +
    `- l'introduzione deve aprire con contesto, territorio o storia\n` +
    `- il corpo tecnico deve spiegare vitigno, suolo, clima, vinificazione, profilo gustativo o servizio\n` +
    `- la curiosita finale deve aggiungere un dettaglio memorabile ma credibile\n` +
    `- tono professionale, concreto, elegante\n` +
    `- niente elenchi puntati\n\n` +
    `IMPORTANTE: il titolo deve essere completo, elegante, specifico, max 11 parole.\n\n` +
    `RISPONDI SOLO CON JSON (no markdown, no testo fuori):\n` +
    `{"titolo":"titolo completo qui","testo":"<h3>Introduzione</h3><p>...</p><h3>Approfondimento Tecnico</h3><p>...</p><p>...</p><h3>Curiosita Finale</h3><p>...</p>"}`;

  /* Tentativo 1: AI principale con maxTokens elevati per evitare troncamento */
  try {
    const { text } = await aiEditorial(env, 'Sei uno scrittore enologico professionale. Scrivi articoli completi, affidabili, leggibili e ben strutturati in HTML con tag <h3>, <p> e <b>. Rispondi SOLO con JSON valido completo. ' + SAFETY, prompt, 3200);
    const clean = text.replace(/```json|```/g, '').trim();
    const start = clean.indexOf('{');
    const endIdx = clean.lastIndexOf('}');
    if (start < 0 || endIdx < 0) throw new Error('JSON malformato');
    const jsonText = sanitizeJsonText(clean.slice(start, endIdx + 1));
    const j = JSON.parse(jsonText);
    if (!j.titolo || !j.testo) throw new Error('Campi mancanti');
    /* Verifica lunghezza minima per evitare articoli corti */
    const wordCount = String(j.testo || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    if (wordCount < 450) {
      console.warn('Articolo corto:', wordCount, 'parole. Riprovo.');
      throw new Error('Articolo troppo corto');
    }
    return ok({ titolo: j.titolo, testo: j.testo, image: await fetchPexelsImage(env, topic), image_query: simplifyImageQuery(topic), ok: true, words: wordCount });
  } catch (e) {
    console.error('handleArticle attempt 1:', e.message);
  }

  /* Tentativo 2: prompt semplificato ma ancora con vincolo lunghezza */
  try {
    const fallbackPrompt = `Scrivi in ${langName} un articolo professionale in HTML di MINIMO 500 parole su: "${topic}".\n\n` +
      `${EDITORIAL_VOICE}\n${SAFETY}\n\n` +
      `Struttura obbligatoria: <h3>Introduzione</h3><p>...</p><h3>Approfondimento Tecnico</h3><p>...</p><p>...</p><h3>Curiosita Finale</h3><p>...</p>.\n` +
      `Usa anche <b> per concetti chiave quando serve.\n` +
      `Rispondi solo con l'HTML dell'articolo, senza titolo.`;
    const { text } = await aiEditorial(env, 'Sei un grande autore di cultura del vino. Scrivi un articolo professionale in HTML, chiaro e ricco. ' + SAFETY, fallbackPrompt, 2600);
    const cleanText = text.trim();
    if (cleanText.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length < 420) throw new Error('Fallback troppo corto');
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
      model: 'gpt-4o-mini',
      max_tokens: maxTokens || 1600,
      temperature: 0.5,
      messages: [{ role: 'system', content: system }, { role: 'user', content: userMsg }],
    }),
  });
  if (!r.ok) {
    const err = await r.text().catch(() => r.status);
    throw new Error('GPT-4o-mini ' + r.status + ': ' + String(err).slice(0, 140));
  }
  const d = await r.json();
  const text = d.choices?.[0]?.message?.content || '';
  if (!text) throw new Error('GPT-4o-mini: risposta vuota');
  return text;
}

async function gpt4oVision(key, system, userMsg, imageB64, imageMime, maxTokens) {
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: maxTokens || 1800,
      temperature: 0.2,
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: String(system || '') + '\n\n' + String(userMsg || '') },
          { type: 'image_url', image_url: { url: `data:${imageMime || 'image/jpeg'};base64,${imageB64}` } }
        ]
      }],
    }),
  });
  if (!r.ok) {
    const err = await r.text().catch(() => r.status);
    throw new Error('GPT-4o-mini vision ' + r.status + ': ' + String(err).slice(0, 180));
  }
  const d = await r.json();
  const text = d.choices?.[0]?.message?.content || '';
  if (!text) throw new Error('GPT-4o-mini vision: risposta vuota');
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

async function createEliteCheckoutSession(request, env, body) {
  const stripeKey = getStripeSecretKey(env);
  const priceId = getStripePriceId(env);
  if (!stripeKey) throw new Error('Manca STRIPE_SECRET_KEY nel Worker');
  if (!priceId) throw new Error('Manca STRIPE_PRICE_ID nel Worker');

  const reqUrl = new URL(request.url);
  const origin = (body && body.origin && /^https?:\/\//i.test(body.origin)) ? body.origin : reqUrl.origin;
  const email = body && body.email ? String(body.email).trim() : '';

  const form = new URLSearchParams();
  form.set('mode', 'subscription');
  form.set('success_url', origin + '/?elite=success&session_id={CHECKOUT_SESSION_ID}');
  form.set('cancel_url', origin + '/?elite=cancel');
  form.set('line_items[0][price]', priceId);
  form.set('line_items[0][quantity]', '1');
  form.set('billing_address_collection', 'auto');
  form.set('allow_promotion_codes', 'true');
  if (email) form.set('customer_email', email);
  form.set('metadata[plan]', 'elite_2_99');
  form.set('metadata[source]', 'sommelierworld');

  const r = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  });

  const raw = await r.text().catch(() => '');
  if (!r.ok) throw new Error('Stripe checkout ' + r.status + ': ' + String(raw).slice(0, 220));

  const data = JSON.parse(raw);
  if (!data || !data.url || !data.id) throw new Error('Stripe checkout: risposta incompleta');
  return {
    ok: true,
    session_id: data.id,
    url: data.url,
  };
}

function sanitizeWineCheckoutPayload(body) {
  const src = body && typeof body === 'object' ? body : {};
  const quantity = Math.max(1, Math.min(6, parseInt(src.quantity || '1', 10) || 1));
  const unitAmount = Math.round(Number(src.unit_amount || src.price_cents || 0));
  const wineName = String(src.wine_name || src.name || '').trim().slice(0, 120);
  const producer = String(src.producer || '').trim().slice(0, 120);
  const wineId = String(src.wine_id || '').trim().slice(0, 80);
  const quantityInStore = Math.max(0, parseInt(src.in_store_quantity || '0', 10) || 0);

  if (!wineName) throw new Error('wine_name obbligatorio');
  if (!Number.isFinite(unitAmount) || unitAmount < 299) throw new Error('Prezzo bottiglia non valido');
  if (quantityInStore < 1) throw new Error('Bottiglia non disponibile in magazzino');

  return { quantity, unitAmount, wineName, producer, wineId, quantityInStore };
}

async function createWineCheckoutSession(request, env, body) {
  const stripeKey = getStripeSecretKey(env);
  if (!stripeKey) throw new Error('Manca STRIPE_SECRET_KEY nel Worker');

  const payload = sanitizeWineCheckoutPayload(body);
  const reqUrl = new URL(request.url);
  const origin = (body && body.origin && /^https?:\/\//i.test(body.origin)) ? body.origin : reqUrl.origin;

  const form = new URLSearchParams();
  form.set('mode', 'payment');
  form.set('success_url', origin + '/?order=success&session_id={CHECKOUT_SESSION_ID}');
  form.set('cancel_url', origin + '/?order=cancel');
  form.set('line_items[0][price_data][currency]', 'eur');
  form.set('line_items[0][price_data][unit_amount]', String(payload.unitAmount));
  form.set('line_items[0][price_data][product_data][name]', payload.wineName);
  if (payload.producer) form.set('line_items[0][price_data][product_data][description]', payload.producer);
  form.set('line_items[0][quantity]', String(payload.quantity));
  form.set('billing_address_collection', 'required');
  form.set('shipping_address_collection[allowed_countries][0]', 'IT');
  form.set('phone_number_collection[enabled]', 'true');
  form.set('metadata[order_kind]', 'wine_inventory');
  form.set('metadata[source]', 'sommelierworld_inventory');
  form.set('metadata[wine_name]', payload.wineName);
  form.set('metadata[wine_id]', payload.wineId);
  form.set('metadata[producer]', payload.producer);
  form.set('metadata[in_store_quantity]', String(payload.quantityInStore));

  const r = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  });

  const raw = await r.text().catch(() => '');
  if (!r.ok) throw new Error('Stripe wine checkout ' + r.status + ': ' + String(raw).slice(0, 220));

  const data = JSON.parse(raw);
  if (!data || !data.url || !data.id) throw new Error('Stripe wine checkout: risposta incompleta');
  return {
    ok: true,
    mode: 'payment',
    session_id: data.id,
    url: data.url,
  };
}

async function getStripeSessionStatus(env, sessionId) {
  const stripeKey = getStripeSecretKey(env);
  if (!stripeKey) throw new Error('Manca STRIPE_SECRET_KEY nel Worker');

  const r = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
    headers: { Authorization: `Bearer ${stripeKey}` },
  });
  const raw = await r.text().catch(() => '');
  if (!r.ok) throw new Error('Stripe session ' + r.status + ': ' + String(raw).slice(0, 220));

  const data = JSON.parse(raw);
  const paid = data && data.payment_status === 'paid' && (data.status === 'complete' || data.status === 'open');
  return {
    ok: true,
    active: !!paid,
    session_id: data.id || sessionId,
    status: data.status || '',
    payment_status: data.payment_status || '',
    customer_email: data.customer_details && data.customer_details.email ? data.customer_details.email : '',
    mode: data.mode || '',
  };
}

async function handleLeadCapture(env, body) {
  const email = normalizeEmailValue(body && body.email);
  if (!isValidEmail(email)) throw new Error('Email non valida');

  const payload = {
    kind: trimText(body && body.kind, 80) || 'site_lead',
    name: trimText(body && body.name, 120),
    email,
    wine_id: trimText(body && body.wine_id, 80),
    wine_name: trimText(body && body.wine_name, 180),
    lang: trimText(body && body.lang, 12) || 'it',
    source: trimText(body && body.source, 120),
    message: trimText(body && body.message, 600),
    company: trimText(body && body.company, 180),
    package_label: trimText(body && body.package_label, 180),
    region: trimText(body && body.region, 120),
  };

  const stored = await saveLeadRecord(env, payload);
  const record = stored.record;
  const mailer = getMailerStatus(env);
  const out = {
    ok: true,
    lead_id: record.id,
    deduped: (record.touchCount || 0) > 1,
    kv_enabled: stored.kv_enabled,
    mailer_configured: mailer.configured,
    mailer_provider: mailer.provider,
    smtp_ready: mailer.smtp_ready,
  };

  const adminEmail = getAdminInbox(env);
  const adminMail = buildAdminLeadEmail(record);
  let adminNotification = { sent: false, error: '', provider: mailer.provider };
  let welcomeNotification = { sent: false, error: '', provider: mailer.provider };

  if (mailer.configured) {
    if (record.kind === 'private_collection_waitlist') {
      try {
        const welcome = buildWaitlistWelcomeEmail(record);
        const sent = await sendTransactionalEmail(env, {
          to: record.email,
          toName: record.name,
          subject: welcome.subject,
          html: welcome.html,
          text: welcome.text,
        });
        welcomeNotification = { sent: true, provider: sent.provider || mailer.provider };
      } catch (e) {
        welcomeNotification = { sent: false, error: e.message || 'Errore welcome email', provider: mailer.provider };
      }
    }

    try {
      const sentAdmin = await sendTransactionalEmail(env, {
        to: adminEmail,
        subject: adminMail.subject,
        html: adminMail.html,
        text: adminMail.text,
        replyTo: record.email,
      });
      adminNotification = { sent: true, provider: sentAdmin.provider || mailer.provider };
    } catch (e) {
      adminNotification = { sent: false, error: e.message || 'Errore notifica admin', provider: mailer.provider };
    }
  }

  if (stored.kv_enabled) {
    const kv = getStateKV(env);
    await kvPutJson(kv, 'lead_status:' + record.id, {
      updatedAt: Date.now(),
      welcomeNotification,
      adminNotification,
    });
  }

  out.notifications = {
    welcome: welcomeNotification,
    admin: adminNotification,
  };
  return out;
}

function ok(data, status = 200, extraHeaders) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json', ...(extraHeaders || {}) },
  });
}
