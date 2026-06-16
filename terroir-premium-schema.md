# Terroir Premium Schema

Questo schema definisce la struttura consigliata per le schede `Terroir` premium.

Obiettivi:
- mantenere dati stabili e verificabili
- distinguere dati ufficiali da letture stilistiche
- supportare traduzioni fisse in `it`, `en`, `fr`, `ru`
- permettere crescita graduale per paesi e denominazioni

## Principi

- Le denominazioni principali restano il cuore del catalogo:
  - `DOCG`
  - `DOC`
  - `AOC`
  - `AOP`
  - `PDO`
  - `DAC`
  - equivalenti territoriali forti
- Le `IGT` o equivalenti vanno inserite solo se davvero didatticamente importanti.
- I produttori vanno selezionati, non accumulati in liste infinite.
- Il profilo del vino va espresso con livelli qualitativi, non con numeri fissi troppo rigidi.

## Campi Consigliati

### 1. Identita Base

Campi minimi obbligatori:

```js
{
  id: 'barolo',
  name: 'Barolo DOCG',
  type: 'DOCG',
  country: 'Italia',
  region: 'Piemonte',
  grapes: 'Nebbiolo'
}
```

Note:
- `id` deve essere stabile e unico
- `name` puo contenere il nome completo ufficiale
- `type` identifica la classificazione

### 2. Testi Tradotti Fissi

Testi editoriali principali:

```js
{
  desc_i18n: {
    it: '...',
    en: '...',
    fr: '...',
    ru: '...'
  },
  terroir_note_i18n: {
    it: '...',
    en: '...',
    fr: '...',
    ru: '...'
  },
  history_note_i18n: {
    it: '...',
    en: '...',
    fr: '...',
    ru: '...'
  },
  vinification_note_i18n: {
    it: '...',
    en: '...',
    fr: '...',
    ru: '...'
  }
}
```

Uso consigliato:
- `desc_i18n`: sintesi breve e chiara
- `terroir_note_i18n`: suoli, altitudine, esposizione, clima
- `history_note_i18n`: origine, riconoscimento, evoluzione storica
- `vinification_note_i18n`: pratiche tipiche del territorio

### 3. Suoli

Forma semplice gia compatibile con la UI attuale:

```js
{
  soils: ['clay', 'limestone', 'volcanic']
}
```

Valori standard consigliati:

```js
[
  'clay',
  'limestone',
  'volcanic',
  'sandy',
  'gravel',
  'schist',
  'alluvial',
  'granite'
]
```

Estensione futura:

```js
{
  soils_detail_i18n: {
    it: 'Marne calcareo-argillose con banchi sabbiosi.',
    en: 'Calcareous clay marls with sandy layers.',
    fr: 'Marnes argilo-calcaires avec bancs sableux.',
    ru: 'Известково-глинистые мергели с песчаными прослойками.'
  }
}
```

### 4. Profilo Stilistico

Questo e il punto giusto dove esprimere struttura, acidita e stile del vino.

Meglio usare livelli qualitativi:

```js
{
  style_profile: {
    body: 'full',
    acidity: 'high',
    tannin: 'high',
    alcohol: 'medium-high',
    ageing: 'long'
  }
}
```

Valori consigliati:

```js
body: ['light', 'medium', 'medium-full', 'full']
acidity: ['low', 'medium', 'medium-high', 'high']
tannin: ['low', 'medium', 'medium-high', 'high']
alcohol: ['low', 'medium', 'medium-high', 'high']
ageing: ['short', 'medium', 'long', 'very-long']
```

Nota:
- meglio evitare numeri secchi tipo `14.5%` come dato principale
- se serve, aggiungere una fascia:

```js
{
  alcohol_range: '13.5-15.5'
}
```

### 5. Classificazione Del Territorio

Per non mischiare troppo `DOCG` e `IGT`, conviene avere anche un tag strutturato:

```js
{
  classification_family: 'classic-appellation'
}
```

Valori utili:

```js
[
  'classic-appellation',
  'territorial-indication',
  'historic-subzone',
  'sparkling-origin'
]
```

### 6. Produttori

Conviene distinguere due gruppi:

```js
{
  benchmark_producers: [
    'Produttore 1',
    'Produttore 2',
    'Produttore 3'
  ],
  notable_small_producers: [
    'Produttore A',
    'Produttore B'
  ]
}
```

Regole:
- `benchmark_producers`: 2-4 nomi
- `notable_small_producers`: 1-3 nomi
- niente liste troppo lunghe

### 7. Studio Didattico

Campi utili per far studiare meglio:

```js
{
  climate_note_i18n: {
    it: '...',
    en: '...',
    fr: '...',
    ru: '...'
  },
  service_note_i18n: {
    it: '...',
    en: '...',
    fr: '...',
    ru: '...'
  },
  pairing_note_i18n: {
    it: '...',
    en: '...',
    fr: '...',
    ru: '...'
  }
}
```

Questi campi sono opzionali e possono arrivare in una seconda fase.

## Schema Completo Consigliato

```js
{
  id: 'barolo',
  name: 'Barolo DOCG',
  type: 'DOCG',
  classification_family: 'classic-appellation',
  country: 'Italia',
  region: 'Piemonte',
  grapes: 'Nebbiolo',
  soils: ['clay', 'limestone'],
  alcohol_range: '13.5-15.0',
  style_profile: {
    body: 'full',
    acidity: 'high',
    tannin: 'high',
    alcohol: 'medium-high',
    ageing: 'very-long'
  },
  benchmark_producers: [
    'Produttore 1',
    'Produttore 2'
  ],
  notable_small_producers: [
    'Produttore A'
  ],
  desc_i18n: {
    it: '...',
    en: '...',
    fr: '...',
    ru: '...'
  },
  terroir_note_i18n: {
    it: '...',
    en: '...',
    fr: '...',
    ru: '...'
  },
  history_note_i18n: {
    it: '...',
    en: '...',
    fr: '...',
    ru: '...'
  },
  vinification_note_i18n: {
    it: '...',
    en: '...',
    fr: '...',
    ru: '...'
  }
}
```

## Fonti Consigliate

Priorita fonti:

1. disciplinari ufficiali
2. consorzi e enti ufficiali della denominazione
3. istituzioni nazionali di riferimento
4. documentazione ufficiale dei produttori
5. libri e guide autorevoli come supporto interpretativo

Esempi di uso corretto:
- disciplinare: vitigni, area, affinamento minimo, classificazione
- consorzio: territorio, storia ufficiale, sottozone
- produttori: esempi reali di vinificazione e stile
- guide/libri: lettura stilistica, confronto, nomi di riferimento

## Regole Editoriali

- Non inventare produttori.
- Non inventare combinazioni produttore-denominazione.
- Non trattare come universali pratiche che variano molto da azienda ad azienda.
- Scrivere la vinificazione come `tipica`, non come assoluta.
- Inserire `IGT` solo se hanno vero peso territoriale o culturale.

## Priorita Di Implementazione

Ordine consigliato:

1. campi base + testi tradotti
2. suoli
3. vinificazione
4. style_profile
5. produttori di riferimento
6. piccoli produttori notevoli
7. campi didattici extra

## Decisione Operativa

Per il progetto attuale conviene procedere cosi:

- mantenere attivi ora:
  - `desc_i18n`
  - `terroir_note_i18n`
  - `history_note_i18n`
  - `vinification_note_i18n`
  - `soils`
- introdurre nel prossimo blocco:
  - `style_profile`
  - `benchmark_producers`
  - `notable_small_producers`
- aggiungere `IGT` solo selezionate, una per volta, se davvero iconiche o didattiche
