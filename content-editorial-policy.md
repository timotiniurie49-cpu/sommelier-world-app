# Content Editorial Policy

Questa nota definisce le regole editoriali per notizie, articoli e lezioni della nuova home di Sommelier World.

Obiettivo:
- contenuti automatici ma credibili
- lettura piacevole, non troppo lunga
- niente fatti inventati
- niente aperture tutte uguali
- possibilita di intervento manuale dal pannello admin

## 1. Lunghezza Consigliata

### Notizie

- titolo: `55-85` caratteri
- intro card: `130-200` caratteri
- testo completo: `280-450` parole
- struttura: `3 paragrafi`

Le notizie devono essere rapide da leggere.
Non devono sembrare mini-articoli enciclopedici.

### Articoli

- titolo: `45-80` caratteri
- intro card: `140-220` caratteri
- testo completo: `420-700` parole
- struttura: `4 paragrafi`
- tempo lettura ideale: `3-5 minuti`

Gli articoli non devono essere troppo lunghi.
Devono insegnare qualcosa, ma senza stancare chi legge da telefono.

### Lezioni

- titolo: `40-75` caratteri
- intro card: `140-220` caratteri
- testo completo: `650-1000` parole
- struttura: `5 sezioni`

Le lezioni sono l unico blocco che puo essere piu lungo, perche serve allo studio.

## 2. Regola Verita Prima Di Tutto

I contenuti automatici devono parlare solo di cose verificabili.

Esempi di temi ammessi:
- quando nasce il metodo classico
- origine storica del Cremant
- perche si usa la dicitura Pas Dose
- Bartolo Mascarello e la storia del Barolo
- nascita e diffusione dello Champagne
- storia documentata di un vitigno o di una denominazione

Esempi di contenuti da evitare:
- aneddoti senza fonte
- date inventate
- produttori inventati
- frasi vaghe come se fossero fatti storici

Regola forte:
- se il sistema non e sicuro, il contenuto resta `draft`
- meglio nessun articolo che un articolo falso

## 3. Anti-Ripetizione

Problema da evitare:
- articoli diversi che iniziano tutti con le stesse frasi
- stessi giri di parole ripetuti ogni giorno

Il sistema deve usare uno `opening_style` per ogni contenuto:

- `storico`
- `tecnico`
- `geografico`
- `sensoriale`
- `produttore`
- `mercato`
- `aneddoto verificato`
- `domanda iniziale`

Regole:
- non riusare lo stesso `opening_style` troppe volte di fila
- confrontare i primi `200` caratteri con gli ultimi contenuti pubblicati
- se l apertura e troppo simile, rigenerare
- bloccare aperture deboli come:
- `Nel mondo del vino...`
- `Da sempre il vino...`
- `Il vino e una bevanda...`
- `La tradizione del vino...`

## 4. Strategia Quotidiana Articoli

Ripartizione consigliata:

- `2 france`
- `2 italy`
- `2 world`

Bilanciamento consigliato:

- almeno `2` articoli con `grape_focus`
- almeno `2` articoli su territorio, produttore o denominazione
- almeno `1` articolo tecnico
- almeno `1` articolo su storia o cultura del vino

Esempio:

- Francia: `Perche il calcare cambia lo Chardonnay`
- Francia: `Quando nasce il Cremant`
- Italia: `Bartolo Mascarello e il Barolo classico`
- Italia: `Perche il Nebbiolo chiede tempo`
- Mondo: `Tokaj e il ruolo del Furmint`
- Mondo: `Assyrtiko e l identita delle isole greche`

## 5. Foto

Le immagini non devono essere casuali.

Ogni contenuto deve avere:

- `image_keywords`
- `image_alt`
- `image_url`
- `image_credit`

Ordine di scelta immagini:

1. libreria tua o archivio interno
2. immagine assegnata manualmente
3. mappa controllata da keyword
4. fallback elegante

## 6. Flusso Automatico Ma Con Direttore

Il sistema migliore non e:
- pubblica tutto da solo senza controllo

Il sistema giusto e:
- genera in automatico
- pubblica se passa i controlli
- tu puoi sempre correggere, togliere o riscrivere

Stati contenuto:

- `draft`
- `review`
- `published`
- `archived`

## 7. Cosa Deve Fare L Admin

L area admin dovra permettere:

- creare notizia manuale
- creare articolo manuale
- creare lezione manuale
- generare da titolo
- generare da tua bozza
- rigenerare solo intro
- rigenerare solo titolo
- tradurre in `en/fr/ru`
- cambiare immagine
- salvare in `draft`
- pubblicare
- archiviare

## 8. Modalita Creazione Contenuti

### Modalita A: Manuale

Tu scrivi:
- titolo
- intro
- testo
- area
- tema
- vitigno

### Modalita B: Da Titolo

Tu scrivi:

```text
Bartolo Mascarello il re del Barolo
```

L AI genera:
- titolo rifinito
- intro
- testo completo
- metadati
- traduzioni

### Modalita C: Da Tuo Testo

Tu scrivi una bozza breve o note sparse.
L AI:
- ordina
- amplia
- ripulisce
- traduce

## 9. Regola Qualita Finale

Un contenuto si pubblica solo se:

- non contiene fatti palesemente inventati
- non apre come i contenuti precedenti
- ha una struttura chiara
- ha immagine
- ha traduzioni complete o almeno pronte per essere generate
- e leggibile da mobile

## 10. Linea Consigliata Finale

Per Sommelier World, la linea migliore e:

- `3 notizie` ogni mattina
- `6 articoli` al giorno: `2 france + 2 italy + 2 world`
- `3 lezioni` ogni 14 giorni
- articoli non troppo lunghi
- verita storica e tecnica prima dello stile
- AI come assistente
- tu come direttore editoriale
