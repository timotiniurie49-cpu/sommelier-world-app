# Home Content Model v1

Questo file definisce il modello dati consigliato per la nuova home di Sommelier World.

Obiettivi:
- una struttura unica per notizie, articoli e lezioni
- traduzioni complete `it/en/fr/ru`
- immagini coerenti e controllate
- aggiornamenti automatici lato Worker + KV
- frontend semplice: la home legge contenuti gia pronti

## 1. Struttura Aggregata

Endpoint consigliato:

```text
GET /api/home/content?lang=it
```

Risposta consigliata:

```json
{
  "version": "home-content-v1",
  "lang": "it",
  "generated_at": "2026-06-12T06:00:00.000Z",
  "date_key": "2026-06-12",
  "lesson_period_key": "2026-W24",
  "news": [],
  "articles": [],
  "lessons": []
}
```

Note:
- `date_key` governa `news` e `articles`
- `lesson_period_key` governa la rotazione delle lezioni
- `lang` puo essere usato dal frontend per leggere subito la lingua giusta

## 2. Campi Comuni

Ogni item della home dovrebbe usare questa base:

```json
{
  "id": "news_2026-06-12_01",
  "type": "news",
  "slug": "borgogna-vendemmia-monitoraggio",
  "status": "published",
  "sort_order": 1,
  "tags": ["borgogna", "vendemmia", "francia"],
  "image_keywords": ["burgundy vineyard", "harvest", "wine rows"],
  "image": {
    "mode": "library",
    "url": "https://cdn.example.com/home/burgundy-harvest-01.jpg",
    "alt": {
      "it": "Filari in Borgogna durante il monitoraggio della vendemmia",
      "en": "Rows in Burgundy during harvest monitoring",
      "fr": "Rangs en Bourgogne pendant le suivi des vendanges",
      "ru": "Виноградники Бургундии во время наблюдения за сбором урожая"
    },
    "credit": "Sommelier World Archive",
    "license": "internal"
  },
  "translations": {
    "it": {
      "title": "",
      "intro": "",
      "body": ""
    },
    "en": {
      "title": "",
      "intro": "",
      "body": ""
    },
    "fr": {
      "title": "",
      "intro": "",
      "body": ""
    },
    "ru": {
      "title": "",
      "intro": "",
      "body": ""
    }
  }
}
```

Campi obbligatori per tutti:
- `id`
- `type`
- `slug`
- `status`
- `sort_order`
- `image_keywords`
- `translations.it.title`
- `translations.it.intro`
- `translations.it.body`

## 3. Modello Notizie

Tipo:

```json
{
  "id": "news_2026-06-12_01",
  "type": "news",
  "slug": "borgogna-vendemmia-monitoraggio",
  "status": "published",
  "sort_order": 1,
  "published_at": "2026-06-12T06:00:00.000Z",
  "source_kind": "rss_plus_editorial",
  "source_name": "Decanter",
  "source_url": "https://www.decanter.com/example-news",
  "source_domain": "decanter.com",
  "external_url": "https://www.decanter.com/example-news",
  "category": "Mercati e Vendemmia",
  "region_focus": ["Francia", "Borgogna"],
  "wine_focus": ["Pinot Noir", "Chardonnay"],
  "tags": ["borgogna", "vendemmia", "mercato"],
  "image_keywords": ["burgundy vineyard", "harvest", "wine rows"],
  "image": {},
  "translations": {
    "it": {
      "title": "Borgogna 2026: maturazione sotto osservazione",
      "intro": "La settimana si apre con un monitoraggio serrato dei vigneti nelle zone collinari.",
      "body": "Testo lungo in 4-5 paragrafi."
    },
    "en": {},
    "fr": {},
    "ru": {}
  }
}
```

Regole notizie:
- 3 item al giorno in home
- titolo elegante, max 80-90 caratteri
- `intro` breve da card
- `body` lungo per overlay
- `source_*` sempre presenti se arriva da fonte esterna

## 4. Modello Articoli

Tipo:

```json
{
  "id": "article_2026-06-12_01",
  "type": "article",
  "slug": "perche-il-calcare-cambia-lo-chardonnay",
  "status": "published",
  "sort_order": 1,
  "published_at": "2026-06-12T06:10:00.000Z",
  "source_kind": "editorial_ai_curated",
  "region_bucket": "france",
  "theme": "terroir",
  "difficulty": "intermediate",
  "reading_minutes": 6,
  "region_focus": ["Francia", "Borgogna"],
  "grape_focus": ["Chardonnay"],
  "wine_focus": ["Chardonnay"],
  "tags": ["calcare", "chardonnay", "terroir"],
  "image_keywords": ["limestone vineyard", "chardonnay", "white wine terroir"],
  "image": {},
  "translations": {
    "it": {
      "title": "Perche il calcare cambia lo Chardonnay",
      "intro": "Il suolo non aggiunge aromi come un ingrediente, ma cambia ritmo e tensione del vino.",
      "body": "Testo lungo in 4-6 paragrafi."
    },
    "en": {},
    "fr": {},
    "ru": {}
  }
}
```

Regole articoli:
- 6 card in home
- aggiornamento giornaliero o ogni 2 giorni
- archivio in KV, non solo contenuti usa-e-getta
- usare sempre `region_bucket`, `theme`, `difficulty`, `reading_minutes`
- usare `grape_focus` quando l articolo aiuta a studiare uno o piu vitigni
- ripartizione consigliata: `2 france + 2 italy + 2 world`
- evitare 6 articoli tutti uguali: mescolare terroir, tecnica, produttori, storia e servizio
- lunghezza consigliata: `420-700` parole, con lettura da `3-5 minuti`
- factuality prima di tutto: se una data o un fatto non e verificabile, il contenuto resta `draft`

## 5. Modello Lezioni

Tipo:

```json
{
  "id": "lesson_2026_w24_level1",
  "type": "lesson",
  "slug": "introduzione-alla-degustazione",
  "status": "published",
  "sort_order": 1,
  "period_key": "2026-W24",
  "rotation_days": 14,
  "level": "level1",
  "lesson_group": "degustazione",
  "study_goal": "Imparare a leggere vista, naso e bocca in modo ordinato.",
  "tags": ["degustazione", "metodo", "base"],
  "image_keywords": ["wine tasting", "glass analysis", "sommelier notebook"],
  "image": {},
  "translations": {
    "it": {
      "title": "Introduzione alla degustazione",
      "intro": "Un modulo essenziale per costruire un metodo chiaro.",
      "body": "Testo lungo strutturato per studio."
    },
    "en": {},
    "fr": {},
    "ru": {}
  }
}
```

Regole lezioni:
- 3 card in home
- una per livello
- rotazione ogni `7` o `14` giorni
- consigliato `14` giorni per permettere studio vero

## 6. Modello Immagini

Per evitare risultati brutti o casuali, ogni contenuto deve avere:

```json
{
  "image_keywords": ["burgundy vineyard", "harvest", "wine rows"],
  "image": {
    "mode": "library",
    "url": "https://cdn.example.com/home/burgundy-harvest-01.jpg",
    "alt": {
      "it": "Filari in Borgogna durante il monitoraggio della vendemmia",
      "en": "Rows in Burgundy during harvest monitoring",
      "fr": "Rangs en Bourgogne pendant le suivi des vendanges",
      "ru": "Виноградники Бургундии во время наблюдения за сбором урожая"
    },
    "credit": "Sommelier World Archive",
    "license": "internal"
  }
}
```

Modalita supportate:
- `library`: immagini curate da te o interne
- `manual_url`: immagine assegnata manualmente
- `generated_map`: URL scelto da una mappa controllata per keyword
- `fallback`: immagine editoriale sicura

Ordine consigliato:
- prima `library`
- poi `manual_url`
- poi `generated_map`
- infine `fallback`

## 7. Chiavi KV Consigliate

Chiavi semplici e stabili:

```text
home:daily-news:2026-06-12
home:daily-articles:2026-06-12
home:weekly-lessons:2026-W24
home:image-library:v1
home:content:2026-06-12:it
home:content:2026-06-12:en
home:content:2026-06-12:fr
home:content:2026-06-12:ru
```

Oppure struttura ibrida:
- salvi i blocchi base una volta sola
- generi `home:content:*:lang` come payload aggregato pronto per il frontend

## 8. Endpoint Consigliati

Pubblici:

```text
GET /api/home/content?lang=it
GET /api/home/news?lang=it&date=2026-06-12
GET /api/home/articles?lang=it&date=2026-06-12
GET /api/home/lessons?lang=it&period=2026-W24
```

Admin:

```text
POST /api/admin/home/generate-news
POST /api/admin/home/generate-articles
POST /api/admin/home/generate-lessons
POST /api/admin/home/publish
GET  /api/admin/home/preview?lang=it
```

## 9. Flusso Automatico Consigliato

Ogni mattina:
- raccogli fonti reali per le notizie
- genera 3 notizie lunghe con struttura completa
- genera 6 articoli o selezionali da archivio + aggiorna quelli del giorno
- traduci tutto in `en/fr/ru`
- assegna immagini
- salva in KV

Ogni 14 giorni:
- genera o seleziona 3 nuove lezioni
- una per livello
- traduci
- assegna immagini
- salva in KV

## 10. Qualita e Controllo

Per avere un risultato davvero alto:
- niente pubblicazione diretta senza controllo
- usare stato `draft` prima di `published`
- validare sempre:
- testo minimo
- immagine presente
- 4 lingue complete
- niente duplicati di titolo
- niente keyword immagine vuote

## 11. Risposta Pronta Per La Home

Payload finale ideale per `home-v2.js`:

```json
{
  "version": "home-content-v1",
  "lang": "it",
  "generated_at": "2026-06-12T06:00:00.000Z",
  "date_key": "2026-06-12",
  "lesson_period_key": "2026-W24",
  "news": [
    {
      "id": "news_2026-06-12_01",
      "title": "Borgogna 2026: maturazione sotto osservazione",
      "intro": "La settimana si apre con un monitoraggio serrato dei vigneti nelle zone collinari.",
      "body": "Testo lungo...",
      "source_name": "Decanter",
      "source_url": "https://www.decanter.com/example-news",
      "image_url": "https://cdn.example.com/home/burgundy-harvest-01.jpg",
      "image_alt": "Filari in Borgogna durante il monitoraggio della vendemmia"
    }
  ],
  "articles": [],
  "lessons": []
}
```

Questo e il formato piu semplice per il frontend:
- nessuna logica complessa
- nessuna traduzione da comporre lato client
- nessuna scelta immagine improvvisata nel browser
