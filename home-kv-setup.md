# Home KV Setup

Questa nota serve per pubblicare in modo stabile i contenuti della nuova home.

## Binding Worker

Nel Worker deve esistere una binding KV chiamata:

```text
HOME_CONTENT_KV
```

Il Worker ora controlla questa binding anche in `/ping`.

Quando avrai il `namespace_id` reale, in `wrangler.json` andra aggiunta una sezione come questa:

```json
{
  "kv_namespaces": [
    {
      "binding": "HOME_CONTENT_KV",
      "id": "IL_TUO_NAMESPACE_ID"
    }
  ]
}
```

Nota:
- non l ho inserita adesso per non mettere un id inventato
- i secrets `GROQ_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `ADMIN_PASSWORD` vanno gestiti come secret Cloudflare, non in `wrangler.json`

## Chiavi Supportate

Il Worker legge i contenuti home in questo ordine:

1. payload aggregato per lingua

```text
home:content:2026-06-12:it
home:content:2026-06-12:en
home:content:2026-06-12:fr
home:content:2026-06-12:ru
```

2. payload aggregato generico

```text
home:content:2026-06-12:all
```

3. blocchi separati

```text
home:daily-news:2026-06-12
home:daily-articles:2026-06-12
home:weekly-lessons:2026-W24
```

Se nessuna chiave e presente, il Worker usa il fallback runtime.

## Test Rapidi

Controllo binding:

```text
GET /ping
```

Deve mostrare:

```json
{
  "homeKv": true
}
```

Controllo endpoint home:

```text
GET /api/home/content?lang=it
GET /api/home/content?lang=en
GET /api/home/content?lang=fr
GET /api/home/content?lang=ru
```

## Obiettivo

Per andare online bene, vogliamo arrivare a questo stato:

- `homeKv: true`
- `GET /api/home/content` risponde con contenuti reali
- `home-v2.js` legge il backend nuovo
- il fallback resta solo come sicurezza, non come fonte principale
