# Sommelier World Knowledge Base

Questa cartella e la base locale del sistema di conoscenza di `Sommelier World`.

Scopo:
- conservare seed affidabili del dominio vino;
- documentare le fonti approvate;
- preparare il passaggio a un sistema RAG piu completo;
- avere una copia locale leggibile di cio che poi finisce in `Cloudflare KV`.

Strategia:
1. `KV` resta la memoria attiva del worker.
2. Questa cartella e il seed leggibile e versionabile del progetto.
3. Le ricette validate dall admin e le schede tecniche piatto possono essere riversate qui anche in futuro.

Moduli previsti:
- `sources.json`: fonti approvate e prioritarie.
- `terroir_seed.json`: base locale per paesi, regioni e denominazioni.
- in futuro: `recipes/`, `disciplines/`, `producers/`, `vintages/`.
