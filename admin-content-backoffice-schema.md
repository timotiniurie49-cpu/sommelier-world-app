# Admin Content Backoffice Schema

Questo documento definisce lo schema del backoffice per:

- notizie
- articoli
- lezioni

Obiettivo:
- usare la base admin gia presente nell'app
- permettere creazione manuale e generazione AI
- tenere il controllo editoriale finale nelle tue mani
- collegare il tutto al Worker e a KV in modo pulito

## 1. Base Esistente

L'app ha gia un pannello admin con:

- login admin
- tab multiple
- sezione `notizie`
- sezione `articoli`
- chiamate API admin gia presenti per i vini

Punti gia presenti nel progetto:

- [navigation.js](file:///c:/Users/timot/OneDrive/Desktop/SommelierWorld-MASTER/navigation.js)
- [news.js](file:///c:/Users/timot/OneDrive/Desktop/SommelierWorld-MASTER/news.js)

Quindi non conviene rifare tutto da zero.
Conviene estendere l'admin esistente con una struttura coerente.

## 2. Struttura Tab Consigliata

Tab admin consigliate:

- `notizie`
- `articoli`
- `lezioni`
- `media`
- `programmazione`
- `archivio`

Se vuoi restare piu leggero nella prima fase:

- `notizie`
- `articoli`
- `lezioni`

## 3. Struttura Sezione Notizie

### Lista

La sezione `notizie` deve mostrare:

- titolo
- data
- fonte
- stato
- lingua base
- immagine presente o no
- pulsanti `modifica`, `duplica`, `archivia`, `pubblica`

### Filtri

- oggi
- domani
- pubblicate
- draft
- review
- archiviate
- per fonte
- per lingua

### Azioni

- `Nuova Notizia`
- `Genera da titolo`
- `Genera da link/fonte`
- `Rigenera intro`
- `Traduci`
- `Pubblica`

## 4. Struttura Sezione Articoli

### Lista

La sezione `articoli` deve mostrare:

- titolo
- `region_bucket`
- `theme`
- `grape_focus`
- `reading_minutes`
- stato
- data
- immagine

### Filtri

- `france`
- `italy`
- `world`
- `terroir`
- `history`
- `technique`
- `service`
- `published`
- `draft`
- `review`

### Azioni

- `Nuovo Articolo`
- `Genera da titolo`
- `Genera da bozza`
- `Rigenera solo titolo`
- `Rigenera solo intro`
- `Rigenera solo corpo`
- `Traduci`
- `Pubblica`
- `Archivia`

## 5. Struttura Sezione Lezioni

### Lista

La sezione `lezioni` deve mostrare:

- titolo
- livello
- periodo attivo
- `rotation_days`
- stato
- immagine

### Filtri

- `level1`
- `level2`
- `level3`
- `draft`
- `review`
- `published`
- periodo corrente

### Azioni

- `Nuova Lezione`
- `Genera da titolo`
- `Genera da schema`
- `Traduci`
- `Pubblica`
- `Archivia`

## 6. Form Unificato Contenuti

Le tre sezioni possono usare uno schema comune con campi condivisi.

Campi base:

- `id`
- `type`
- `slug`
- `status`
- `published_at`
- `sort_order`
- `image_url`
- `image_alt`
- `image_keywords`
- `image_credit`
- `tags`

Traduzioni:

- `title_it`
- `intro_it`
- `body_it`
- `title_en`
- `intro_en`
- `body_en`
- `title_fr`
- `intro_fr`
- `body_fr`
- `title_ru`
- `intro_ru`
- `body_ru`

## 7. Campi Specifici Notizie

- `source_name`
- `source_url`
- `source_domain`
- `external_url`
- `category`
- `region_focus`
- `wine_focus`
- `opening_style`
- `fact_status`

## 8. Campi Specifici Articoli

- `region_bucket`
- `theme`
- `difficulty`
- `reading_minutes`
- `region_focus`
- `grape_focus`
- `wine_focus`
- `opening_style`
- `fact_status`

## 9. Campi Specifici Lezioni

- `level`
- `period_key`
- `rotation_days`
- `lesson_group`
- `study_goal`
- `exercise`
- `key_points`
- `opening_style`
- `fact_status`

## 10. Stati Editoriali

Ogni contenuto deve avere uno stato:

- `draft`
- `review`
- `published`
- `archived`

Regola:

- `draft`: creato ma non pronto
- `review`: generato o modificato, attende controllo
- `published`: visibile in app
- `archived`: non attivo ma conservato

## 11. Modalita Di Creazione

### Modalita A: Manuale

Tu compili il form a mano.

Uso ideale:

- contenuti importanti
- biografie
- articoli storici delicati
- lezioni

### Modalita B: Da Titolo

Tu scrivi solo il titolo o il topic.

Esempio:

```text
Bartolo Mascarello e il Barolo tradizionale
```

Il sistema genera:

- intro
- corpo
- tag
- metadati
- traduzioni

### Modalita C: Da Bozza

Tu scrivi appunti o un testo breve.
Il sistema lo trasforma in contenuto completo.

### Modalita D: Da Fonte

Per le notizie:

- incolli link
- incolli testo fonte
- incolli abstract

Il sistema costruisce la notizia nel tono Sommelier World.

## 12. Regole AI Nel Backoffice

L'AI non deve generare in modo libero senza freni.

Controlli obbligatori:

- niente fatti inventati
- niente date non verificate
- niente produttori inventati
- niente aperture troppo simili agli ultimi contenuti
- niente testi troppo lunghi

Campi di controllo automatico:

- `opening_style`
- `fact_status`
- `similarity_score`
- `needs_review`

## 13. Fact Status

Campo consigliato:

- `verified`
- `likely_verified`
- `needs_review`
- `rejected`

Regola:

- se il contenuto tratta storia, date, origine di un termine o biografie, e meglio non autopubblicarlo se non arriva almeno a `likely_verified`

## 14. Layout UI Consigliato

### Header Admin Sezione

- titolo sezione
- contatore contenuti
- filtri rapidi
- pulsante `Nuovo`
- pulsante `Genera`

### Colonna Sinistra

- lista contenuti
- ricerca
- filtri

### Colonna Destra

- editor contenuto
- metadati
- immagine
- traduzioni
- azioni finali

Su mobile:

- lista sopra
- editor sotto

## 15. Azioni Pulsanti Consigliate

Pulsanti principali per ogni contenuto:

- `Salva bozza`
- `Invia in review`
- `Pubblica`
- `Archivia`
- `Duplica`
- `Elimina`

Pulsanti AI:

- `Genera da titolo`
- `Genera da bozza`
- `Rigenera intro`
- `Rigenera titolo`
- `Traduci tutto`

## 16. Endpoint Worker Consigliati

### Pubblici

- `GET /api/home/content?lang=it`

### Admin Contenuti

- `GET /api/admin/content/list?type=article`
- `GET /api/admin/content/get?id=...`
- `POST /api/admin/content/create`
- `POST /api/admin/content/update`
- `POST /api/admin/content/delete`
- `POST /api/admin/content/publish`
- `POST /api/admin/content/archive`

### Admin AI

- `POST /api/admin/content/generate-from-title`
- `POST /api/admin/content/generate-from-draft`
- `POST /api/admin/content/generate-from-source`
- `POST /api/admin/content/translate`
- `POST /api/admin/content/validate`

## 17. Salvataggio KV Consigliato

Archivio admin:

- `content:item:{id}`
- `content:list:article`
- `content:list:news`
- `content:list:lesson`

Pubblicazione home:

- `home:daily-news:{date}`
- `home:daily-articles:{date}`
- `home:weekly-lessons:{period}`
- `home:content:{date}:{lang}`

## 18. Auto-Pubblicazione Controllata

Flusso consigliato:

1. il sistema genera i contenuti automatici
2. assegna `draft` o `review`
3. passa i controlli factuality e anti-ripetizione
4. pubblica solo se conforme
5. tu puoi sempre rimuovere o modificare

Per contenuti sensibili di tipo storico:

- meglio `review` prima di `published`

## 19. Consiglio Pratico Per La Fase 1

Per partire senza complicare troppo:

- tab `notizie`
- tab `articoli`
- tab `lezioni`
- lista + editor laterale
- pulsanti `manuale`, `da titolo`, `da bozza`

Eviterei subito:

- media manager complesso
- pianificazioni troppo avanzate
- analytics editoriali

## 20. Fase 2 Consigliata

Dopo la prima versione:

- preview home prima della pubblicazione
- controllo similarita automatico
- cronologia versioni
- cron job di generazione giornaliera
- sezione futura `Enciclopedia Vitigni`

## 21. Direzione Finale

La formula giusta per Sommelier World e:

- AI per accelerare
- dati strutturati per non perdere controllo
- pubblicazione automatica per dare vita al sito
- controllo tuo finale per mantenere qualita e verita
