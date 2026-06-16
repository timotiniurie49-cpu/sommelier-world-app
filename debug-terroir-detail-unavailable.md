# Debug Session: terroir-detail-unavailable

Status: OPEN

## Sintomo
- Nel dettaglio `Terroir` compare ancora `Scheda non disponibile` oppure non appare la descrizione attesa.

## Ipotesi iniziali
1. Il dettaglio trova l'`id` ma una proprietà secondaria della scheda genera un errore runtime durante il render.
2. Il dataset curato non viene caricato correttamente nella preview locale e il dettaglio usa dati parziali o vecchi.
3. La vista dettaglio viene aperta, ma un errore JavaScript interrompe l'assegnazione di `innerHTML`.
4. La preview locale sta servendo una versione non aggiornata di uno script rispetto ai file modificati.
5. Il problema è riproducibile solo su alcune denominazioni o solo in alcune lingue.

## Piano
- Aggiungere sola strumentazione runtime.
- Riprodurre il problema in locale.
- Analizzare i log e confermare o scartare le ipotesi.
- Applicare una fix minima solo dopo evidenza.

## Evidenza Raccolta
- `index.html` carica `navigation.js` prima di `sommelier.js`.
- `navigation.js` definisce `window.openDenomDetail` moderno.
- `sommelier.js` ridefiniva di nuovo `window.openDenomDetail` con un renderer legacy AI.
- Il renderer legacy inseriva sia il fallback `Scheda non disponibile. Riprova tra 30 secondi.` sia il layout con titolo/classificazione ripetuti.

## Fix Applicata
- In `sommelier.js` la definizione legacy di `window.openDenomDetail` ora viene registrata solo se non esiste gia una versione precedente.
- In `index.html` e stato rialzato il build query param e mantenuto il blocco del service worker in locale per evitare asset vecchi.
