/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SOMMELIER WORLD · PATCH v18                                    ║
 * ║                                                                  ║
 * ║  ✓ Fix sommelier — vincolo paese/regione ASSOLUTO              ║
 * ║    (Germania → solo vini tedeschi, senza eccezioni)            ║
 * ║  ✓ Descrizioni complete pre-scritte per tutte le               ║
 * ║    principali denominazioni, regioni e paesi                    ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════
     PARTE 1 — FIX SOMMELIER: VINCOLO PAESE ASSOLUTO
     Il paese viene messo IN TESTA al prompt, non in fondo
     ═══════════════════════════════════════════════════════ */

  /* Mappa paese → vini rappresentativi (usata per rafforzare il prompt) */
  var COUNTRY_WINES = {
    'Italia':       'Barolo, Brunello, Chianti Classico, Amarone, Prosecco, Vermentino, Etna Rosso',
    'Francia':      'Bordeaux, Bourgogne, Champagne, Châteauneuf-du-Pape, Sancerre, Vouvray',
    'Germania':     'Riesling Mosel, Rheingau Riesling, Spätburgunder, Grauburgunder, Silvaner Franken, Sekt',
    'Spagna':       'Rioja Tempranillo, Ribera del Duero, Priorat Garnacha, Albariño, Cava, Jerez',
    'Portogallo':   'Porto, Douro, Vinho Verde, Alentejo, Dão, Madeira',
    'Austria':      'Grüner Veltliner, Riesling Wachau, Blaufränkisch, Zweigelt',
    'USA':          'Napa Cabernet, Willamette Pinot Noir, Sonoma Chardonnay, Zinfandel',
    'Argentina':    'Malbec Mendoza, Torrontés Cafayate, Cabernet Franc Valle de Uco',
    'Cile':         'Carménère Colchagua, Cabernet Maipo, Sauvignon Blanc Casablanca',
    'Australia':    'Shiraz Barossa, Pinot Noir Yarra Valley, Riesling Clare Valley',
    'Nuova Zelanda':'Sauvignon Blanc Marlborough, Pinot Noir Central Otago',
    'Grecia':       'Assyrtiko Santorini, Xinomavro Naoussa, Agiorgitiko Nemea',
    'Ungheria':     'Tokaji Furmint, Egri Bikavér, Kékfrankos',
    'Georgia':      'Rkatsiteli, Saperavi, vini in kvevri',
    'Sud Africa':   'Chenin Blanc Stellenbosch, Pinotage, Syrah Swartland',
  };

  /* Mappa paese → regioni (per il vincolo regione) */
  var COUNTRY_REGIONS = {
    'Germania': ['Mosel', 'Rheingau', 'Pfalz', 'Nahe', 'Rheinhessen', 'Franken', 'Ahr', 'Baden', 'Württemberg'],
    'Italia':   ['Piemonte', 'Toscana', 'Veneto', 'Lombardia', 'Sicilia', 'Sardegna', 'Campania', 'Friuli', 'Trentino'],
    'Francia':  ['Bordeaux', 'Bourgogne', 'Champagne', 'Rhône', 'Loire', 'Alsazia', 'Provence', 'Languedoc'],
  };

  function buildSommConstraint(paese, regione) {
    if (!paese) return '';

    var wines = COUNTRY_WINES[paese] || paese + ' wines';
    var constraint = [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '🚨 VINCOLO GEOGRAFICO OBBLIGATORIO — NON DEROGABILE',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'Il cliente ha scelto esplicitamente: PAESE = ' + paese.toUpperCase(),
      'REGOLA ASSOLUTA: consiglia ESCLUSIVAMENTE vini di ' + paese + '.',
      'È VIETATO consigliare qualsiasi vino di altri paesi.',
      'Vini tipici di ' + paese + ': ' + wines + '.',
      '',
    ].join('\n');

    if (regione) {
      constraint += '⚠️ REGIONE SPECIFICATA: ' + regione + '. Dai priorità a vini di questa regione.\n';
    }

    constraint += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
    return constraint;
  }

  function patchSommelier() {
    // Aspetta che doAbbinamento sia definito
    if (typeof window.doAbbinamento !== 'function') {
      setTimeout(patchSommelier, 300);
      return;
    }

    var _orig = window.doAbbinamento;
    window.doAbbinamento = async function () {
      var paese   = (document.getElementById('winePaese')  || {}).value || '';
      var regione = (document.getElementById('wineRegione') || {}).value || '';

      // Se non è selezionato un paese, usa la funzione originale
      if (!paese) return _orig.apply(this, arguments);

      // Costruisce il vincolo forte
      var constraint = buildSommConstraint(paese, regione);

      // Legge menu e altri parametri come l'originale
      var menu   = (document.getElementById('menuText') || {}).value || '';
      var budget = (document.getElementById('budget')   || {}).value || '80';
      var prefs  = Array.from(document.querySelectorAll('#prefPills .on'))
                       .map(function(b) { return b.textContent; }).join(', ');

      // Legge parametri organolettici
      var params = typeof getWineParams === 'function' ? getWineParams() : {};

      var profileStr = '\nPROFILO ORGANOLETTICO:\n';
      if (params.acidita)   profileStr += '• Acidità: '   + params.acidita   + '\n';
      if (params.morbidezza)profileStr += '• Morbidezza: '+ params.morbidezza+ '\n';
      if (params.sapidita)  profileStr += '• Sapidità: '  + params.sapidita  + '\n';
      if (params.struttura) profileStr += '• Struttura: ' + params.struttura  + '\n';

      // Il vincolo geografico va IN TESTA al system prompt — non in fondo
      var SYS_CON = constraint + (window.SOM_SYS || '');

      // Il vincolo viene ripetuto anche nel messaggio utente
      var userMsg = '';
      if (paese)  userMsg += '⚠️ USA SOLO VINI DI ' + paese.toUpperCase() + '.\n';
      if (regione) userMsg += '⚠️ REGIONE: ' + regione + '.\n';
      userMsg += 'Menu:\n' + menu + '\nBudget: €' + budget + profileStr;
      if (prefs)  userMsg += '\nPreferenze: ' + prefs;

      // Mostra loading
      var loadEl   = document.getElementById('somLoad');
      var resultEl = document.getElementById('somResult');
      if (loadEl)   { loadEl.style.display   = 'block'; }
      if (resultEl) { resultEl.style.display = 'none';  }

      try {
        var text = await (window.callAPI || function() {})(SYS_CON, userMsg, null, null);
        if (loadEl)   loadEl.style.display   = 'none';
        if (resultEl) {
          resultEl.innerHTML = typeof renderSomResult === 'function'
            ? renderSomResult(text)
            : '<p>' + text.replace(/\n/g, '<br>') + '</p>';
          resultEl.style.display = 'block';
        }
      } catch (e) {
        if (loadEl)   loadEl.style.display  = 'none';
        if (resultEl) {
          resultEl.innerHTML = '<p style="color:#f99">Errore connessione. Riprova tra 30 secondi.</p>';
          resultEl.style.display = 'block';
        }
      }
    };

    console.log('[SW-v18] Sommelier patch applicato ✓');
  }


  /* ═══════════════════════════════════════════════════════
     PARTE 2 — DESCRIZIONI PRE-SCRITTE PER DENOMINAZIONI
     Oggetto con descrizioni complete per tutte le principali
     ═══════════════════════════════════════════════════════ */

  /* Struttura: { id_denominazione: { storia, terroir, vitigni, produzione, organolettico, abbinamenti, produttori } } */

  var DESC = {

    /* ════ ITALIA — PIEMONTE ════ */
    'barolo': {
      s: 'Riconosciuto con DOC nel 1961 e DOCG nel 1980, il Barolo è il vertice assoluto del Nebbiolo. Nasce nelle undici comuni delle Langhe, con Barolo, La Morra, Serralunga d\'Alba, Castiglione Falletto e Monforte d\'Alba come cuore produttivo. Cinque secoli di storia lo legano alla Casa Savoia.',
      t: 'Due grandi suoli separati dalla strada Alba-Barolo: le marne tortoniane (argille compatte, Serralunga) danno vini potenti e longevissimi; le marne elvetiane (più sabbiose, La Morra e Barolo) producono vini più eleganti e precocemente bevibili. Altitudine 150-400m, escursione termica fondamentale per conservare l\'acidità.',
      v: 'Nebbiolo in purezza (100%). Tre biotipi: Lampia, Michet, Rosé. Vitigno a maturazione tardiva, germogliamento precoce — soggetto alle gelate primaverili.',
      p: 'Affinamento minimo 38 mesi (18 in legno); Riserva 62 mesi. Tradizionalisti usano grandi botti di Slavonia (3-10 anni); modernisti le barriques francesi per ammorbidire i tannini più velocemente.',
      o: 'Colore granato con unghia aranciata dopo anni. Profumi di viola, rosa appassita, catrame, tabacco, liquirizia, spezie. Tannini potenti ma vellutati con l\'età. Acidità alta. Longevità 20-50 anni.',
      a: 'Brasato al Barolo, tartufo nero, selvaggina, stufati, formaggi stagionati di lunga maturazione. Servire a 18°C, decantare 2-3 ore.',
      pr: 'Giacomo Conterno (Monfortino), Bruno Giacosa, Bartolo Mascarello, Giuseppe Rinaldi, Luciano Sandrone, Elio Altare, Vietti, Paolo Scavino, Roberto Voerzio.',
    },

    'barbaresco': {
      s: 'DOCG dal 1980, il Barbaresco è il gemello raffinato del Barolo. Nasce in soli tre comuni: Barbaresco, Treiso e Neive. Angelo Gaja lo ha elevato a vino di fama mondiale negli anni \'70, sfidando i mercati internazionali con prezzi mai visti per un vino italiano.',
      t: 'Suoli di marne tortoniane e sabbie, più ricchi e profondi rispetto al Barolo. Altitudine 150-350m. Il fiume Tanaro mitiga il clima rendendolo leggermente più caldo. 66 MGA (Menzioni Geografiche Aggiuntive): Asili, Rabajà, Martinenga, Sori San Lorenzo tra i più celebri.',
      v: 'Nebbiolo in purezza. I tre biotipi (Lampia, Michet, Rosé) si esprimono con maggiore eleganza e precocità rispetto al Barolo.',
      p: 'Affinamento minimo 26 mesi (9 in legno); Riserva 50 mesi. Più accessibile giovane rispetto al Barolo pur mantenendo la stessa struttura di base.',
      o: 'Granato tendente all\'arancio. Floreale (rosa, violetta), fruttato (ciliegia, ribes), speziato (pepe, cannella), con note di cuoio e tabacco. Tannini eleganti, acidità vivace. Longevità 15-30 anni.',
      a: 'Selvaggina, agnello, brasati, tartufo bianco d\'Alba, formaggi maturi. Il più adatto tra i grandi piemontesi ai formaggi erborinati.',
      pr: 'Gaja (Sorì San Lorenzo, Sorì Tildìn), Bruno Giacosa, Produttori del Barbaresco, Roagna, Ceretto (Asij), Giuseppe Cortese.',
    },

    'alta_langa': {
      s: 'DOCG istituita nel 2011, è la risposta piemontese allo Champagne. Nasce sulle colline alte delle Langhe, oltre i 250 metri, dove il Pinot Nero e il Chardonnay trovano la freschezza necessaria per le bollicine.',
      t: 'Suoli calcareo-argillosi e sabbiosi delle alte Langhe. Altitudine 250-500m. Escursione termica elevata, fondamentale per preservare l\'acidità e gli aromi dei vitigni a bacca bianca e rossa usati per il metodo classico.',
      v: 'Pinot Nero e Chardonnay (min. 90%), con possibile presenza di Pinot Bianco e Pinot Grigio. Vendemmia anticipata per preservare l\'acidità.',
      p: 'Metodo Classico (rifermentazione in bottiglia). Minimo 30 mesi sui lieviti per la versione base; Riserva 60 mesi. Sboccatura con dosaggio variabile.',
      o: 'Perlage fine e persistente. Paglierino dorato. Aromi di crosta di pane, lievito, frutta bianca, agrumi, note floreali. Fresco, sapido, lungo finale.',
      a: 'Aperitivo, antipasti di pesce, crudo di pesce, fritto di paranza, risotto ai funghi, formaggi freschi piemontesi.',
      pr: 'Contratto (Giuseppe), Enrico Serafino, Ca\' del Baio, Ettore Germano, Cocito.',
    },

    /* ════ ITALIA — TOSCANA ════ */
    'brunello': {
      s: 'DOCG dal 1980, prima DOCG d\'Italia assieme ad Albana e Barolo. Nasce intorno alla città di Montalcino, in una zona collinare nel cuore della Toscana meridionale. Biondi Santi è considerato il padre: Ferruccio Biondi Santi selezionò il clone "Brunello" del Sangiovese negli anni 1870.',
      t: 'Suoli eterogenei: galestro (scisti argilloso-calcarei) e alberese (calcare compatto) sui versanti; argille sul fondovalle. Altitudine 120-600m su quattro versanti con microclimi diversi. Il versante nord è il più fresco; il sud il più caldo e precoce.',
      v: 'Sangiovese Grosso (Brunello) in purezza. Grappoli grandi, acino grosso, buccia spessa. Clone selezionato per longevità eccezionale.',
      p: 'Affinamento minimo 60 mesi (24 in legno di rovere, almeno 4 mesi in bottiglia); Riserva 72 mesi. Il più lungo affinamento obbligatorio tra le DOCG italiane.',
      o: 'Rubino tendente al granato. Aromi complessi: visciola, prugna secca, spezie orientali, tabacco, cuoio, balsamico, vaniglia. Tannini robusti ma levigati, acidità alta. Longevo 30-50 anni.',
      a: 'Cinghiale in salmì, bistecca alla Fiorentina, piccione, cacciagione, formaggi stagionati. Il vino da meditazione per eccellenza dell\'Italia.',
      pr: 'Biondi Santi, Soldera (Case Basse), Poggio di Sotto, Il Marroneto, Cerbaiona, Casanova di Neri, Fuligni.',
    },

    'chianti_classico': {
      s: 'La zona Classica del Chianti comprende i comuni tra Firenze e Siena. Il Gallo Nero, simbolo della Lega del Chianti medievale, è il marchio che contraddistingue questi vini. DOCG dal 1984. La Gran Selezione, introdotta nel 2014, rappresenta la cima qualitativa assoluta: uve da singolo vigneto, 30 mesi affinamento minimo.',
      t: 'Galestro (roccia friabile) e alberese (calcare) alternati. Altitudine 250-700m. Il clima è mediterraneo ma temperato dall\'altitudine. Le sottozone Panzano, Lamole, Castelnuovo Berardenga, Gaiole si distinguono nettamente per stile.',
      v: 'Sangiovese minimo 80%. Possibile aggiunta (max 20%) di vitigni autoctoni come Canaiolo e Colorino, o internazionali come Merlot e Cabernet.',
      p: 'Annata: 12 mesi affinamento minimo, immissione al commercio 1 ottobre anno successivo. Riserva: 24 mesi. Gran Selezione: 30 mesi, solo uve da singolo vigneto o selezione aziendale.',
      o: 'Rubino brillante. Ciliegia fresca, viola, spezie, cuoio e tabacco con l\'evoluzione. Acidità elevata, tannini presenti ma non aggressivi. Bevibilità immediata nelle versioni più giovani.',
      a: 'Bistecca alla Fiorentina, pappardelle al cinghiale, pollo alla cacciatora, pecorino toscano, ribollita. Temperatura di servizio 16-18°C.',
      pr: 'Fontodi, Isole e Olena, Fèlsina, Montevertine, Badia a Coltibuono, Castello dei Rampolla, Riecine.',
    },

    'bolgheri': {
      s: 'La DOC Bolgheri, sulla costa toscana in provincia di Livorno, è diventata celebre grazie al Sassicaia, nato dall\'intuizione del Marchese Incisa della Rocchetta negli anni \'40. Quando nel 1985 Parker diede 100/100 al Sassicaia 1985, Bolgheri divenne leggenda mondiale.',
      t: 'Suoli alluvionali profondi, argillosi e limosi, con ghiaia in profondità. Clima mediterraneo vero: caldo, asciutto, mitigato dalla brezza marina tirrenica. Quasi assenza di siccità estiva grazie alla falda acquifera.',
      v: 'Cabernet Sauvignon, Merlot, Cabernet Franc, Syrah, Petit Verdot. La DOC Bolgheri Sassicaia è l\'unica in Italia dedicata a una sola azienda.',
      p: 'Nessun disciplinare particolarmente restrittivo sull\'affinamento: ogni produttore sceglie la propria filosofia. Generalmente 12-18 mesi in barriques francesi.',
      o: 'Rosso rubino intenso. Ribes nero, cassis, prugna, cioccolato, menta, peperone verde nei giovani. Con l\'età: tabacco, cedrino, cuoio. Struttura potente, tannini densi.',
      a: 'Filetto di manzo, agnello arrosto, carni alla brace, selvaggina da pelo, tartufo nero. Vini da grande occasione.',
      pr: 'Tenuta San Guido (Sassicaia), Ornellaia, Masseto, Le Macchiole, Grattamacco, Guado al Tasso.',
    },

    'chianti': {
      s: 'La più grande DOCG italiana per estensione, il Chianti abbraccia quasi tutta la Toscana centrale in sette sottozone: Colli Fiorentini, Rufina, Colli Senesi, Colli Aretini, Colline Pisane, Montalbano, Montespertoli. DOCG dal 1984.',
      t: 'Terreni estremamente variabili a seconda della sottozona. Rufina (nord-est di Firenze) è la più fresca e longeva. Colli Senesi la più estesa. Galestro e alberese nelle zone classiche.',
      v: 'Sangiovese minimo 75%, con possibilità di aggiunta di altri vitigni autoctoni o internazionali fino al 25%.',
      p: 'Minimo 7 mesi affinamento. Riserva: 24 mesi. La produzione più vasta d\'Italia: quasi 100 milioni di bottiglie l\'anno.',
      o: 'Rubino vivace. Ciliegia, fragola, erbe aromatiche, spezie leggere. Acidità fresca, tannini leggeri. Piacevole e immediato nella maggior parte dei casi.',
      a: 'Pasta al ragù, pizza, carne alla brace, arista di maiale, formaggi di media stagionatura. Il vino da tavola toscano per eccellenza.',
      pr: 'Antinori, Frescobaldi, Brolio (Ricasoli), Ruffino, Melini.',
    },

    'nobile': {
      s: 'Il Vino Nobile di Montepulciano è tra le prime DOCG d\'Italia (1980). Ha origini medievali: già nel 1300 veniva servito ai papi avignonesi. Montepulciano è una cittadina rinascimentale straordinaria nel cuore della Val di Chiana.',
      t: 'Argille tuferee e calcaree su colline a 250-600m. Clima continentale con estati secche e calde. La Val di Chiana sottostante crea un microclima particolare con nebbie autunnali che rallentano la maturazione.',
      v: 'Prugnolo Gentile (clone locale del Sangiovese) minimo 70%, con Canaiolo e altri vitigni toscani.',
      p: 'Affinamento 24 mesi (12 in legno); Riserva 36 mesi (18 in legno).',
      o: 'Rubino intenso. Ciliegia matura, more, spezie, tabacco. Tannini decisi ma eleganti, acidità fresca. Buona longevità (10-20 anni).',
      a: 'Chianina ai ferri, pici all\'aglione, cinghiale in umido, peccorino stagionato, lenticchie di Castelluccio.',
      pr: 'Avignonesi, Poliziano, Boscarelli, Salcheto, La Braccesca.',
    },

    'amarone': {
      s: 'L\'Amarone della Valpolicella nasce da un errore fortunato: un Recioto dimenticato che fermentò completamente in secco, eliminando tutto lo zucchero. DOCG dal 2010. Il nome deriva da "amaro" in contrapposizione al dolce Recioto.',
      t: 'La Valpolicella si estende a ovest di Verona in tre zone: Classica (la più pregiata: Negrar, Marano, Fumane, Sant\'Ambrogio, San Pietro in Cariano), Valpantena ed Est. Suoli calcarei e argillosi.',
      v: 'Corvina Veronese (45-95%), Corvinone (fino al 50% in sostituzione), Rondinella (5-30%). Le uve vengono appassite su arele (graticci) per 90-120 giorni, perdendo il 30-40% del peso.',
      p: 'Dopo l\'appassimento, vinificazione lenta. Affinamento minimo 2 anni (1 in legno); Riserva 4 anni. Titolo alcolico tipico 15-17%.',
      o: 'Rubino cupo, quasi opaco. Aromi intensissimi: ciliegia sotto spirito, prugna secca, cioccolato fondente, spezie (cannella, noce moscata), caffè, tabacco, catrame. Tannini morbidi nonostante la struttura. Potente e longevo (15-30 anni).',
      a: 'Selvaggina, brasati, costine di manzo, formaggi stagionati a pasta dura. Anche da solo come vino da meditazione.',
      pr: 'Romano Dal Forno, Giuseppe Quintarelli, Masi (Costasera), Allegrini, Zenato, Tedeschi, Begali.',
    },

    'prosecco': {
      s: 'Il Prosecco Superiore DOCG nasce nella zona di Valdobbiadene-Conegliano, dichiarata Patrimonio UNESCO nel 2019. L\'area cartizze (107 ha) è il cru più pregiato. Il metodo Charmat (rifermentazione in autoclave) preserva gli aromi freschi e fruttati tipici del Glera.',
      t: 'Colline moreniche di origine glaciale tra i fiumi Piave e Livenza. Suoli argillosi, limosi e sabbiosi. Pendenze che rendono impossibile la meccanizzazione. Microclima fresco, umido, con nebbie autunnali che rallentano la vendemmia.',
      v: 'Glera minimo 85% (ex Prosecco, rinominato per tutelare la denominazione). Perera, Verdiso, Bianchetta e Glera lunga come vitigni complementari.',
      p: 'Metodo Charmat: seconda fermentazione in grandi autoclavi per 30 giorni minimo. Versioni: Brut Nature, Extra Brut, Brut, Extra Dry, Dry, Demi-Sec.',
      o: 'Paglierino con perlage fine. Mela verde, pesca, fiori bianchi (acacia, glicine), agrumi. Fresco, leggero, piacevolmente amabile (Extra Dry) o secco (Brut).',
      a: 'Aperitivo, antipasti delicati, salmone affumicato, sushi, risotto primavera, frittata alle erbe.',
      pr: 'Cartizze: Bisol, Nino Franco, Le Colture, Ruggeri. Valdobbiadene: Adami, Col Vetoraz, Sorelle Bronca.',
    },

    'franciacorta': {
      s: 'La Franciacorta DOCG, nata nel 1961 grazie all\'intuizione di Guido Berlucchi e Franco Ziliani, è l\'unico spumante italiano metodo classico con DOCG (dal 1995). Le uve devono provenire esclusivamente dalla Franciacorta, a sud del Lago d\'Iseo in Lombardia.',
      t: 'Morene glaciali depositate dall\'ultimo ghiacciaio che modellò il Lago d\'Iseo. Suoli morenici ghiaiosi e sabbiosi, perfetti per il drenaggio. Clima mitigato dal lago: inverni miti, estati fresche.',
      v: 'Chardonnay, Pinot Nero, Pinot Bianco (max 50%). Il Satèn è prodotto solo con uve a bacca bianca.',
      p: 'Metodo Classico con rifermentazione in bottiglia. Presa di spuma: minimo 18 mesi (Satèn e Rosé), 30 mesi per la versione base, 60 mesi per la Riserva. Dégorgement manuale o girobulles.',
      o: 'Perlage finissimo e persistente. Paglierino brillante. Crosta di pane, lievito, frutta secca, fiori bianchi, agrumi. Struttura e cremosità al palato.',
      a: 'Aperitivo d\'eccellenza, risotto allo zafferano, carpaccio di pesce, frittura di lago, tartufo bianco (Riserva).',
      pr: 'Ca\' del Bosco (Annamaria Clementi), Bellavista, Guido Berlucchi, Monte Rossa, Ricci Curbastro.',
    },

    /* ════ ITALIA — SUD E ISOLE ════ */
    'taurasi': {
      s: 'Il Barolo del Sud, DOCG dal 1993. Nasce nell\'Irpinia campana, in un territorio di 17 comuni nella provincia di Avellino. Mastroberardino ha fatto la storia di questo vino sin dagli anni \'40, poi altri produttori hanno contribuito alla sua rinascita.',
      t: 'Argille e marne calcaree su colline a 400-700m. Il clima è continentale, con inverni freddi e nevosi. L\'escursione termica estiva è elevata. Il terreno vulcanico antico è ricco di minerali.',
      v: 'Aglianico minimo 85% (di solito 100%). Vitigno a maturazione tardissima: vendemmia a fine ottobre-novembre. L\'Aglianico deve il suo nome agli antichi Greci (Hellenico).',
      p: 'Affinamento minimo 36 mesi (12 in legno); Riserva 48 mesi. I tannini dell\'Aglianico richiedono lunghi affinamenti per distendersi.',
      o: 'Rubino scuro, quasi nero nei giovani. Amarena, mora, pepe nero, tabacco, cioccolato, grafite. Tannini potentissimi e acidità marcata. Longevo 20-30 anni.',
      a: 'Agnello al forno, selvaggina, ragù napoletano, brasati, formaggi stagionati campani (Pecorino, Caciocavallo).',
      pr: 'Mastroberardino, Feudi di San Gregorio, Terredora, Di Prisco, Caggiano.',
    },

    'nerello': {
      s: 'La DOC Etna nasce nel 1968 ma la vera rinascita è degli anni 2000, quando produttori visionari come Marco de Grazia (Terre Nere) e Frank Cornelissen hanno riscoperto le viti centenarie ad alberello. Oggi è il terroir più emozionante d\'Italia.',
      t: 'Suoli vulcanici di lava nera basaltica. Altitudine 400-1000m sulle pendici dell\'Etna. L\'alberello centenario (molte viti pre-fillossera) cresce senza portainnesto su sabbie laviche. Le 133 contrade sono considerate equivalenti ai crus borgognoni.',
      v: 'Nerello Mascalese (rosso, elegante, fragile) e Nerello Cappuccio per i rossi; Carricante e Catarrato per i bianchi. Il Nerello Mascalese ricorda il Pinot Nero per finezza e trasparenza.',
      p: 'Nessun obbligo specifico, i produttori scelgono liberamente. Generalmente 12-24 mesi, spesso in botti grandi di legno neutro per rispettare il frutto.',
      o: 'Rosso: rubino trasparente, aranciato al bordo. Fragola, melograno, spezie, fiori rossi, vulcanico (pomice). Tannini fini, acidità vibrante. Bianco: floreale, agrumato, minerale vulcanico.',
      a: 'Pesce alla griglia, arancine, pasta alla norma, coniglio all\'agrodolce, pistacchio di Bronte (bianco).',
      pr: 'Cornelissen, Terre Nere (Marco de Grazia), Benanti, Passopisciaro, Cornelissen, Gulfi, Vivera.',
    },

    /* ════ ITALIA — SARDEGNA ════ */
    'vermentino_gallura': {
      s: 'Unica DOCG della Sardegna per vini bianchi. La Gallura è la zona nord-orientale dell\'isola, caratterizzata da un paesaggio di granito levigato dal vento e da un\'intensa aridità estiva. Il Vermentino in Gallura raggiunge la sua massima espressione mondiale.',
      t: 'Granito antico, profondamente alterato in sabbia (sabbia granitica, arenacea). Suoli poveri, permeabili, ben drenati. Il vento Maestrale asciuga e protegge i vigneti dalle malattie. Altitudine 300-500m.',
      v: 'Vermentino 95% minimo. Tipologia Superiore: minimo 14% alcolico.',
      p: 'Vinificazione in acciaio per preservare gli aromi freschi. Alcune versioni brevi a contatto con i lieviti o in botte piccola per la versione Superiore.',
      o: 'Paglierino brillante con riflessi dorati. Mandorla fresca, fiori bianchi, agrumi (lime, pompelmo), pesca, nota marina iodata. Sapidità pronunciata, acidità fresca, corpo pieno. Persistenza lunga.',
      a: 'Bottarga di muggine, aragosta alla catalana, triglie alla sarda, spaghetti alle arselle, agnello da latte (versione Superiore).',
      pr: 'Capichera, Surrau, Cantina Gallura, Piero Mancini, Masone Mannu.',
    },

    /* ════ FRANCIA — CHAMPAGNE ════ */
    'champagne': {
      s: 'Lo Champagne è il vino effervescente per eccellenza, nato nella regione omonima a est di Parigi. Dom Pérignon, il monaco benedettino di Hautvillers, è considerato il padre (sebbene la storia sia più complessa). AOC dal 1936, le 319 crus sono classificate in Premier Cru e Grand Cru (17 comuni).',
      t: 'Suoli cretacei calcarei dell\'era Cretacea (Belemniti, Micraster). La creta trattiene l\'acqua e la cede gradualmente alle radici. Clima al limite della maturazione viticola (media 11°C annua), che crea l\'acidità naturale caratteristica.',
      v: 'Pinot Nero (struttura, corpo), Chardonnay (finezza, acidità), Pinot Meunier (frutto). Blanc de Blancs: solo Chardonnay. Blanc de Noirs: solo Pinot Nero e/o Meunier. Rosé: aggiunta di vino rosso o saignée.',
      p: 'Méthode Traditionnelle (Champenoise). Seconda fermentazione in bottiglia. Non-vintage: minimo 15 mesi; Vintage: 36 mesi. Riddling, dégorgement, dosaggio (liqueur d\'expédition). Il residuo zuccherino definisce la tipologia: Brut Nature (0g/L) → Extra Brut → Brut → Extra Dry → Sec → Demi-sec.',
      o: 'Perlage finissimo e persistente. Dorato brillante. Crosta di pane, biscotto, lievito, frutta bianca, agrumi, fiori. Con l\'età: note di mandorla tostata, miele d\'acacia, tartufo bianco (Prestige Cuvée).',
      a: 'Aperitivo universale. Ostriche (Blanc de Blancs), tartufo bianco (Blanc de Blancs millesimé), salmone, caviale, aragosta. Rosé con fragole o salmone marinato.',
      pr: 'Krug, Dom Pérignon, Bollinger, Salon, Jacques Selosse, Roederer (Cristal), Taittinger (Comtes), Pol Roger.',
    },

    /* ════ FRANCIA — BORGOGNA ════ */
    'romanee_conti': {
      s: 'Un ettaro e 85 are a Vosne-Romanée. Il vino più costoso e ricercato al mondo. Prodotto da un\'unica parcella di Pinot Nero di proprietà del Domaine de la Romanée-Conti (DRC) dal 1869. Storicamente appartenuto al Principe di Conti nel 1760, da cui il nome.',
      t: 'Calcare di Comblanchien ricoperto da un sottile strato di argilla rossa. Esposizione est-sud-est. Posizione unica in mezzo alla Côte de Nuits, a metà pendio. Drenaggio perfetto. Le radici penetrano fino a 20 metri nella roccia.',
      v: 'Pinot Nero. Viti vecchie, molte pre-fillossera. DRC non pratica nessuna filtrazione né chiarifica.',
      p: 'Vendemmia manuale con selezione grappolo per grappolo. Fermentazione con steli interi. 18-24 mesi in barriques nuove al 100%. Nessuna filtrazione.',
      o: 'Rubino trasparente, quasi rosa-amaranto. Straordinaria complessità: violetta, rosa, ciliegia, framboise, spezie orientali, muschio, sottobosco, sangue, incenso. Setosità infinita. Persistenza oltre 60 secondi. Longevo 30-80 anni.',
      a: 'Meglio solo, come vino da meditazione. Se si abbina: tartufo nero, pernici al tartufo, piccione in crosta.',
      pr: 'Domaine de la Romanée-Conti (monopole assoluto).',
    },

    'gevrey': {
      s: 'Il comune di Gevrey-Chambertin nella Côte de Nuits ospita 9 Grands Crus: Chambertin, Clos de Bèze, Charmes, Chapelle, Griotte, Latricières, Mazis, Mazoyères, Ruchottes. Napoleone era un grande amante del Chambertin, lo portava sempre in battaglia.',
      t: 'Calcari oolitici mesozoici. Il Chambertin e il Clos de Bèze godono di argille più profonde. La pendenza naturale garantisce il drenaggio perfetto. Esposizione est.',
      v: 'Pinot Nero. I vini di Gevrey sono i più strutturati e tannici della Côte de Nuits, senza perdere l\'eleganza borgognona.',
      p: 'Vinificazione in rosso con macerazione classica. Affinamento 18-24 mesi in barriques di rovere francese (50-100% nuovo per i Grand Cru).',
      o: 'Rubino profondo. Frutta rossa e nera (ciliegia, mora, cassis), spezie, vaniglia, liquirizia, cuoio, selvatico. Struttura imponente nei Grand Cru. Longevità 15-30 anni.',
      a: 'Piccione al sangue, pernice alla crème, selvaggina, filetto di manzo con salsa al Chambertin.',
      pr: 'Domaine Rousseau (il riferimento assoluto), Denis Mortet, Rossignol-Trapet, Pierre Damoy, Leroy, Perrot-Minot.',
    },

    'chablis': {
      s: 'Il Chablis è il Chardonnay più austero e minerale del mondo. Nasce a nord della Borgogna, lontano dalla Côte d\'Or, in un clima quasi continentale. I 7 Grands Crus (Blanchot, Bougros, Grenouilles, Les Clos, Preuses, Valmur, Vaudésir) dominano la colline a nord della città.',
      t: 'Kimmeridgiano: calcare del Giurassico superiore ricco di fossili di ostriche (Exogyra virgula). Questo suolo unico conferisce la mineralità e la salinità caratteristica del Chablis. La vicinanza all\'antico mare tetideo crea un legame profondo con il sapore del mare.',
      v: 'Chardonnay 100%, non fatto maturare in legno (stile classico in acciaio o foudres grandi).',
      p: 'Affinamento in acciaio inox (stile Raveneau: in barriques usate). Nessuna malolattica in alcuni produttori per preservare l\'acidità.',
      o: 'Paglierino con riflessi verdognoli. Gesso, selce, mela verde, agrumi, fiori bianchi, ostriche. Acidità tagliente, mineralità assoluta, longevità sorprendente (10-20 anni nei GC).',
      a: 'Ostriche di Marennes-Oléron (abbinamento classico per antonomasia), fruits de mer, aragoste, branzino, sushi.',
      pr: 'Raveneau (il riferimento mondiale), Dauvissat, Long-Depaquit, William Fèvre, La Chablisienne.',
    },

    'meursault': {
      s: 'Meursault è la capitale mondiale dello Chardonnay bianco. Nessun Grand Cru (questione storica controversa), ma i 1ers Crus Perrières, Genevrières, Charmes, Poruzots sono tra i bianchi più grandi al mondo. La Paulée de Meursault è la festa più celebre della Borgogna.',
      t: 'Calcari ooliti della Côte de Beaune, con argille bianche in profondità. Perrières è il più minerale (vicino alla roccia); Genevrières il più grasso e ricco; Charmes il più fruttato e accessibile.',
      v: 'Chardonnay 100%. Vinificato generalmente con fermentazione in barrique e malolattica completa, che conferisce la caratteristica ricchezza e cremosità.',
      p: 'Fermentazione alcolica e malolattica in barriques (30-100% nuove). Affinamento 12-18 mesi. Bâtonnage (rimescolamento dei lieviti) per aumentare la complessità.',
      o: 'Dorato brillante. Burro fresco, nocciola, mandorla, fiori di tiglio, miele d\'acacia, vaniglia, tartufo bianco nell\'età. Corpo pieno, morbido, persistenza lunga.',
      a: 'Homard à la crème, Saint-Jacques, branzino in crosta, poulet de Bresse, foie gras. Temperatura 12-14°C.',
      pr: 'Coche-Dury (il più quotato al mondo), Comte Lafon, Bouchard Père, Jean-Marc Roulot, Patrick Javillier.',
    },

    /* ════ FRANCIA — BORDEAUX ════ */
    'pauillac': {
      s: 'Pauillac ospita tre dei cinque Premier Grand Cru Classé 1855: Château Latour, Château Lafite Rothschild, Château Mouton Rothschild. È il comune più importante di Bordeaux per numero di châteaux illustri.',
      t: 'Gravel profondo su argille calcaree. La ghiaia drena perfettamente e accumula calore durante il giorno, cedendolo di notte per completare la maturazione del Cabernet. Posizione privilegiata sulla riva sinistra della Gironda.',
      v: 'Cabernet Sauvignon dominante (70-85%), Merlot (10-20%), Cabernet Franc, Petit Verdot. Il Cabernet trova qui le condizioni perfette: terreni ben drenati, calore moderato.',
      p: 'Fermentazione in vasche di cemento o acciaio. Affinamento 18-24 mesi in barriques di rovere francese nuove (50-100%). Secondo vino commercializzato per le selezioni non incluse nel Grand Vin.',
      o: 'Rubino intenso. Ribes nero, cassis, cedro, menta, pepe, sigaro, tabacco. Tannini strutturati e longevi. Longevità eccezionale (20-50 anni).',
      a: 'Agnello del Pauillac (locale!), manzo alla griglia, selvaggina, formaggi stagionati. Decantazione obbligatoria 2-3 ore.',
      pr: 'Latour, Lafite Rothschild, Mouton Rothschild (I Premier), Pichon Baron, Pichon Lalande, Lynch-Bages.',
    },

    'sauternes': {
      s: 'Il Sauternes è il vino dolce secco più grande del mondo. Nasce dalla botrytis cinerea (muffa nobile) favorita dall\'incontro tra il freddo Ciron e il caldo Garonne, che crea le nebbie mattutine di ottobre. Château d\'Yquem è l\'unico Premier Cru Supérieur della classificazione 1855.',
      t: 'Argilla su calcare e ghiaia. La vicinanza al Ciron e alla Garonne crea un microclima unico con umidità mattutina (favorisce la botrytis) e asciutto pomeridiano (evita la muffa grigia).',
      v: 'Sémillon (80-90%), Sauvignon Blanc (5-20%), Muscadelle. Il Sémillon è ideale per la botrytization: buccia sottile, grappoli compatti.',
      p: 'Vendemmia in più passaggi (tries successives), raccogliendo solo i grappoli botritizzati. Fermentazione lenta in barriques. Affinamento 18-36 mesi in legno. Bassissime rese (9 hl/ha per d\'Yquem vs 50 hl/ha dei vini secchi).',
      o: 'Dorato-ambrato, sempre più intenso con gli anni. Miele, albicocca sciroppata, zafferano, vaniglia, arancio candito, bergamotto, noce moscata. Dolcezza bilanciata dall\'acidità del Sauvignon.',
      a: 'Foie gras (l\'abbinamento più iconico di Francia), Roquefort, dessert alla frutta, anche come aperitivo (freddo, 8°C).',
      pr: 'Château d\'Yquem, Rieussec, Suduiraut, Guiraud, Climens (Barsac), Raymond-Lafon.',
    },

    /* ════ FRANCIA — RODANO ════ */
    'chateauneuf': {
      s: 'Il Châteauneuf-du-Pape prende il nome dal nuovo palazzo papale costruito da Clemente V nel XIV secolo dopo il trasferimento della Santa Sede ad Avignone. È la più grande denominazione di qualità del Rodano meridionale, con 13 vitigni autorizzati.',
      t: 'Galets roulés: grosse pietre rotonde di quarzo che rivestono il suolo, accumulano calore durante il giorno e lo cedono di notte. Mistral (vento del nord) che asciuga i vigneti. Suoli di argilla rossa e sabbia sotto i galets.',
      v: 'Grenache Noir (base, almeno 70%), Syrah, Mourvèdre, Counoise, Cinsault, e altri 8 vitigni minori. Il Blanc (10% della produzione): Grenache Blanc, Clairette, Bourboulenc, Roussanne.',
      p: 'Vinificazione tradizionale. Nessun obbligo di barrique: molti usano grandi botti di legno (foudres). Minimo 12 mesi affinamento.',
      o: 'Rubino denso, quasi opaco. Prugna, mora, cuoio, timo, lavanda, pepe bianco, garrigue. Corpo pieno, 14-16% alcolici. Ricco e avvolgente. Longevo 15-25 anni.',
      a: 'Agnello alla provenzale, daube de boeuf (stufato), selvaggina, tapenade, formaggi di capra stagionati.',
      pr: 'Château Rayas (il più mistico), Château Beaucastel, Henri Bonneau, Clos des Papes, Château Fortia.',
    },

    /* ════ FRANCIA — LOIRA ════ */
    'sancerre': {
      s: 'Sancerre e il suo Sauvignon Blanc hanno rivoluzionato il mondo dei vini bianchi negli anni \'70-\'80. Questo piccolo comune della Loira centrale è diventato il parametro mondiale per i bianchi secchi aromatici. L\'appellation comprende 14 comuni sulle due rive della Loira.',
      t: 'Tre tipi di suolo: Terres Blanches (calcare del Kimmeridgiano, come Chablis — mineralità e longevità), Caillottes (calcare poroso — vini freschi e fruttati), Silex (selce — l\'aroma caratteristico di "pietra focaia"). I suoli silicei producono i vini più caratteristici.',
      v: 'Sauvignon Blanc (bianchi) e Pinot Nero (rossi e rosati, spesso sottovalutati).',
      p: 'Vinificazione in acciaio inox. Nessun legno (tranne rare eccezioni come Vacheron). Imbottigliamento precoce per preservare gli aromi varietali.',
      o: 'Paglierino verdognolo. Peperone verde, sambuco, pompelmo, ribes bianco, pietra focaia (silex). Freschezza vibrante, sapidità. Migliore nei 3 anni dall\'annata; con silex, fino a 10 anni.',
      a: 'Chèvre (formaggio di capra, abbinamento classicissimo), carpaccio di branzino, asparagi, sushi, ostriche di Bretagna.',
      pr: 'Henri Bourgeois, Domaine Vacheron, Lucien Crochet, Henri Pellé, François Cotat.',
    },

    /* ════ GERMANIA ════ */
    'mosel': {
      s: 'Il Mosel (Mosella) è il fiume sinuoso della Germania occidentale le cui pendici danno i Riesling più longevi e profondi del mondo. La viticoltura sul Mosel è eroica: pendenze fino all\'85°, totalmente a mano. Alcune viti hanno oltre 100 anni.',
      t: 'Ardesia blu devoniana (Blauschiefer): roccia scura che assorbe il calore del sole, lo accumula e lo riflette sulle viti nelle notti fredde, permettendo la maturazione a latitudini impossibili. Il fiume stesso riflette la luce del sole sulle pendici.',
      v: 'Riesling (85% della produzione). Müller-Thurgau e Elbling secondari. Il Riesling del Mosel è il più delicato, basso in alcol (7-9% nelle versioni Kabinett), ad altissima acidità.',
      p: 'Classificazione per livello zuccherino: Kabinett (più leggero), Spätlese, Auslese, Beerenauslese, Trockenbeerenauslese (TBA), Eiswein. Fermentazione lenta in grandi botti di Fuder (1000L).',
      o: 'Paglierino pallido con riflessi verdi. Pesca bianca, albicocca, fiori di tiglio, petrosello, agrumi, mela verde. Acidità vibrante, residuo zuccherino bilanciato, bassissimo alcol. Longevità incredibile: 20-50 anni.',
      a: 'Pesce delicato (salmone, trota del Mosel), crostacei, cucina asiatica, sushi, speck, formaggi semi-stagionati. Kabinett: aperitivo e antipasti. TBA: da solo o con foie gras.',
      pr: 'Egon Müller (Scharzhofberger TBA: il più costoso riesling), JJ Prüm (Wehlener Sonnenuhr), Fritz Haag, Clemens Busch, Mönchhof.',
    },

    'rheingau': {
      s: 'Il Rheingau è la regione del Reno più famosa per il Riesling di struttura e complessità. Schloss Johannisberg ha la storia del vino più documentata di Germania (730 d.C.). Qui nacque accidentalmente la vendemmia tardiva nel 1775 quando il corriere reale ritardò l\'autorizzazione alla vendemmia.',
      t: 'Il Reno scorre da est a ovest nella stretta piana tra Wiesbaden e Rüdesheim, con le colline esposte perfettamente a sud. Suoli di quarzite e ardesia, più ricchi rispetto al Mosel. Lago di calore creato dal fiume.',
      v: 'Riesling 78% — qui produce vini più strutturati e corposi rispetto al Mosel. Spätburgunder (Pinot Nero) 12% — i migliori rossi tedeschi nascono nelle sottozone di Assmannshausen.',
      p: 'Stesso sistema di classificazione del Mosel (Prädikatswein). Stile tendenzialmente più secco (Trocken) rispetto al Mosel, dove il frutto e l\'acidità dialogano senza zucchero residuo.',
      o: 'Dorato più intenso del Mosel. Pesca gialla, albicocca, limone, spezie, miele, petrosello. Corpo medio-pieno, acidità elegante. Trocken: secco, minerale, gastronomico. Longevo 10-20 anni.',
      a: 'Salmone in crosta di erbe, maiale arrosto, vitello alla crema, formaggi semistagionati (Trocken). Spätlese dolce: dessert al miele, foie gras.',
      pr: 'Schloss Johannisberg, Robert Weil (i Trocken da Kiedrich sono straordinari), Georg Breuer, Künstler, Leitz.',
    },

    'pfalz': {
      s: 'La Pfalz (Palatinato) è la seconda regione viticola tedesca per estensione, con il clima più caldo della Germania. La Weinstrasse (Strada del Vino) la attraversa da nord a sud per 85km. I vini sono più opulenti rispetto a Mosel e Rheingau.',
      t: 'Varietà di suoli: basalto, calcare, arenaria rossa, loess. I Mittelhaardt (centro) danno i Riesling migliori; il Südliche Weinstrasse i vini più fruttati e accessibili. Clima quasi mediterraneo: i cactus crescono lungo la Weinstrasse.',
      v: 'Riesling 24%, Müller-Thurgau, Dornfelder, Spätburgunder (Pinot Nero). In Pfalz si trova la maggior diversità di vitigni della Germania.',
      p: 'Come tutta la Germania: dal Kabinett al TBA. Ma qui lo stile Trocken è molto popolare. Il Grosses Gewächs (GG) è il livello top.',
      o: 'Riesling Pfalz: più grasso, esotico, mango, passion fruit, spezie. Meno minerale, più immediato del Mosel. Dornfelder: rosso fruttato e tannico.',
      a: 'Cucina regionale tedesca (Saumagen, Leberwurst, Bratwurst), porchetta, anatra, cucina alsaziana. Riesling Trocken: universale a tavola.',
      pr: 'A. Christmann (Grosses Gewächs di riferimento), Philipp Kuhn, Bassermann-Jordan, von Buhl, Reichsrat von Buhl.',
    },

    /* ════ SPAGNA ════ */
    'rioja': {
      s: 'La Rioja DOCa (Denominación de Origen Calificada, il livello massimo spagnolo) è la regione viticola più rinomata di Spagna. Tre sottozone molto diverse: Rioja Alta (la migliore, fresca, argilloso-calcareo), Rioja Alavesa (suoli calcarei, vini eleganti), Rioja Oriental (più calda, vini potenti).',
      t: 'La Sierra de Cantabria protegge la zona dal freddo atlantico. L\'Ebro e i suoi affluenti moderano il clima. Suoli argillosi e calcarei a ovest (Alta e Alavesa); ferrosi e sabbiosi a est (Oriental). Altitudine 300-700m.',
      v: 'Tempranillo (base, 90% nei Rioja migliori). Garnacha, Mazuelo (Carignan), Graciano come supporto. Bianchi: Viura, Malvasia, Garnacha Blanca.',
      p: 'Classificazione per invecchiamento: Genérico → Crianza (12 mesi in rovere, 6 in bottiglia) → Reserva (12 mesi rovere, 12 bottiglia) → Gran Reserva (24 mesi rovere, 36 bottiglia). Storicamente rovere americano; oggi molti usano il francese.',
      o: 'Rubino con unghia mattone nelle versioni mature. Ciliegia, fragola, cocco e vaniglia (rovere americano), tabacco, pelle. Con l\'età: spezie orientali, rabarbaro, terracotta. Gran Reserva: vini complessi, longevi 20-30 anni.',
      a: 'Agnello (cordero asado), chuletillas al sarmiento (costine bruciate con i sarmenti), cocido madrileño, formaggi Ibérico.',
      pr: 'Muga, CVNE (Viña Real, Imperial), Marqués de Murrieta, Artadi, López de Heredia (classicissimo), Roda, Palacios Remondo.',
    },

    'priorat': {
      s: 'Il Priorat DOCa (solo la seconda DOCa spagnola, dopo la Rioja) è tornato alla ribalta negli anni \'80-\'90 grazie ad Álvaro Palacios e René Barbier. Piccolo territorio (circa 2.000 ha) nel cuore della Catalogna, con vigne eroiche su pendici ripidissime.',
      t: 'La llicorella: ardesia scura e quarzitica (scisto metamorfico) — il suolo più caratteristico della viticoltura mondiale. Trattiene calore, drena perfettamente, costringe le radici a scendere in profondità. Altitudine 100-700m. Clima continentale con estati torride.',
      v: 'Garnacha Negra (dominant, viti centenarie), Cariñena (Carignan), Cabernet Sauvignon, Syrah, Merlot. Le viti vecchie di Garnacha danno rese bassissime (8-15 hl/ha) ma concentrazione straordinaria.',
      p: 'Vinificazione con macerazione classica. Affinamento generalmente 18-24 mesi in barriques francesi. I vini di cru (Clos) sono tra i più estratti e complessi di Spagna.',
      o: 'Rosso quasi nero, opaco. Mora, ribes, cioccolato, liquirizia, minerale (ardesia), terra, grafite. Potenza straordinaria (15-17% alcolici). Tannini densi. Longevità 15-25 anni.',
      a: 'Carni rosse alla brace, agnello, selvaggina, stufati, formaggi stagionati catalani (Garrotxa).',
      pr: 'Álvaro Palacios (Finca Dofí, L\'Ermita), Clos Mogador (René Barbier), Clos de l\'Obac, Mas Doix, Scala Dei.',
    },

    /* ════ PORTOGALLO ════ */
    'porto': {
      s: 'Il Porto nasce nel Douro, la regione viticola più ripida e arida del Portogallo (Patrimonio UNESCO 2001). Venne "inventato" dai mercanti inglesi nel XVIII secolo che aggiungevano acquavite al vino per preservarlo durante il trasporto verso l\'Inghilterra. Le Lodges a Vila Nova de Gaia invecchiano le pipe di Porto.',
      t: 'Scisto (xisto) e quarzite — roccia dura che le radici penetrano per trovare l\'acqua in profondità. Valle del Douro: clima continentale estremo (caldo estate, freddo inverno), semiarido. Terrazzamenti costruiti a mano nel corso dei secoli.',
      v: 'Tra le 80 varietà autorizzate, le principali: Touriga Nacional (il più nobile), Touriga Franca, Tinto Cão, Tinta Barroca, Tinta Roriz (Tempranillo). Lagar (vasche) dove si pigia a piedi.',
      p: 'Fermentazione interrotta con l\'aggiunta di aguardente (77% alc.) quando si raggiunge il punto zuccherino desiderato (brix target). Poi affinamento in pipe di legno (550L) o vat. Tipologie: Ruby (fruttato, giovane), Tawny (ossidativo, nocciola), LBV (Late Bottled Vintage), Vintage (il più pregiato).',
      o: 'Vintage: rosso intenso → ambrato con gli anni. Prugna secca, fico, noce, caramello, cioccolato, bergamotto (Tawny). Dolcezza bilanciata da acidità e tannini residui.',
      a: 'Tawny: dessert alla noce, crème brûlée, torta di mandorle. Vintage: formaggi erborinati (Stilton classicissimo). Ruby: cioccolato fondente.',
      pr: 'Graham\'s, Taylor\'s, Quinta do Noval (Nacional è leggendario), Fonseca, Ramos Pinto, Niepoort.',
    },
  };

  /* Descrizioni dei PAESI */
  var COUNTRY_DESC = {
    'Italia': 'L\'Italia è il paese con la maggiore biodiversità viticola al mondo: oltre 350 vitigni autoctoni registrati ufficialmente, distribuiti in 20 regioni. Dal Nebbiolo delle Langhe al Nero d\'Avola siciliano, ogni territorio esprime un\'identità irripetibile forgiata da secoli di cultura contadina e dalla varietà del territorio — Alpi, Appennino, pianure, isole vulcaniche.',
    'Francia': 'La Francia è il punto di riferimento assoluto della viticoltura mondiale, non per quantità ma per il sistema di classificazione (AOC dal 1936) e per l\'influenza culturale. Borgogna, Bordeaux, Champagne, Rodano, Loira, Alsazia: ogni regione ha codificato secoli di sapere enologico in appellation rigorose che legano il vino al territorio con un concetto unico — il terroir.',
    'Germania': 'La Germania produce i Riesling più longevi e complessi al mondo, su pendici eroiche che sfidano i limiti climatici della viticoltura. Il sistema di classificazione per livello zuccherino (Kabinett → TBA) è unico al mondo. Il paradosso tedesco: i vini con meno alcol (7-9%) possono invecchiare 50 anni.',
    'Spagna': 'La Spagna ha il più esteso vigneto del mondo (circa 1 milione di ettari) ma produce meno vino della Francia e dell\'Italia grazie alla bassa resa per ettaro. Il Tempranillo è il vitigno identitario. Rioja e Priorat sono le due DOCa. La rinascita del vino spagnolo negli ultimi 30 anni è stata straordinaria.',
    'Portogallo': 'Il Portogallo è la patria del Porto e dei vini atlantici autoctoni (Touriga Nacional, Alvarinho, Baga). Il Douro patrimonio UNESCO, il Vinho Verde e il Dão offrono profili completamente diversi. Paese di grande tradizione enologica rimasta fedele ai vitigni autoctoni.',
    'Austria': 'L\'Austria ha rilasciato il Grüner Veltliner e il Riesling Wachau nel canone internazionale. La classificazione DAC e il sistema Grosses Gewächs garantiscono la massima qualità. La Wachau, con i suoi terrazzamenti sul Danubio, produce i bianchi più eleganti dell\'Europa centrale.',
    'Germania': 'I vini tedeschi — primo tra tutti il Riesling — sono tra i più longevi e complessi al mondo. La classificazione per maturità delle uve (Kabinett, Spätlese, Auslese fino al Trockenbeerenauslese) permette stili che spaziano dal secco e minerale al dolce e botrizzato più prezioso. Mosel, Rheingau, Pfalz sono le aree più celebrate.',
    'USA': 'La California è il motore del vino americano: Napa Valley per il Cabernet Sauvignon, Sonoma per il Pinot Nero, Willamette Valley (Oregon) per il Pinot borgognone. Il Giudizio di Parigi del 1976 cambiò per sempre la storia del vino mondiale quando i vini californiani batterono i francesi alla cieca.',
    'Argentina': 'Il Malbec argentino è uno dei più grandi successi del vino mondiale degli ultimi decenni. Mendoza, con i vigneti a 900-1500m ai piedi delle Ande, è la capitale. Il Valle de Uco produce i vini più eleganti e freschi. Cafayate (Salta) raggiunge i 2500m per il Torrontés aromatico.',
    'Cile': 'Il Cile ha in Carménère il suo vitigno identitario — un vitigno bordolese dimenticato trovato nei vigneti cileni negli anni \'90. La valle di Maipo per il Cabernet, Colchagua per il Carménère, Casablanca per i bianchi freddi. Il paese più stretto del mondo ha anche la viticoltura più varia.',
    'Australia': 'Lo Shiraz australiano — specialmente il Penfolds Grange dell\'Henschke Hill of Grace — è considerato tra i 10 vini più grandi del mondo. Barossa Valley e McLaren Vale per lo Shiraz; Yarra Valley e Mornington Peninsula per i Pinot eleganti; Riesling di Clare Valley per longevità senza pari.',
    'Grecia': 'La Grecia è la culla della viticoltura occidentale. L\'Assyrtiko di Santorini su suolo vulcanico, lo Xinomavro di Naoussa (il Nebbiolo greco), l\'Agiorgitiko di Nemea: vitigni autoctoni millenari che la moderna enologia greca ha riportato alla grandezza internazionale negli ultimi 20 anni.',
  };

  /* ═══════════════════════════════════════════════════════
     PARTE 3 — RENDERING DESCRIZIONI NEL TERROIR
     Intercetta l\'espansione di una denominazione e aggiunge
     la scheda ricca pre-scritta
     ═══════════════════════════════════════════════════════ */

  var CSS_DESC = [
    '.sw18-desc{',
      'margin-top:10px;',
      'padding:14px 14px 10px;',
      'background:rgba(191,155,74,.04);',
      'border-top:1px solid rgba(191,155,74,.15);',
      'border-radius:0 0 8px 8px;',
    '}',
    '.sw18-desc-section{',
      'margin-bottom:10px;',
    '}',
    '.sw18-desc-label{',
      'font-family:Cinzel,serif;',
      'font-size:.55rem;',
      'letter-spacing:2px;',
      'color:rgba(191,155,74,.55);',
      'text-transform:uppercase;',
      'display:block;',
      'margin-bottom:3px;',
    '}',
    '.sw18-desc-text{',
      'font-family:\'IM Fell English\',\'Cormorant Garamond\',Georgia,serif;',
      'font-style:italic;',
      'font-size:.9rem;',
      'line-height:1.75;',
      'color:rgba(245,239,226,.7);',
    '}',
    '.sw18-prod-list{',
      'font-family:Lato,sans-serif;',
      'font-size:.82rem;',
      'color:rgba(191,155,74,.8);',
      'line-height:1.7;',
    '}',
    /* Descrizione paese */
    '.sw18-country-desc{',
      'margin:0 0 14px;',
      'padding:12px 14px;',
      'background:rgba(191,155,74,.06);',
      'border-left:3px solid rgba(191,155,74,.4);',
      'border-radius:0 8px 8px 0;',
      'font-family:\'IM Fell English\',Georgia,serif;',
      'font-style:italic;',
      'font-size:.92rem;',
      'line-height:1.75;',
      'color:rgba(245,239,226,.65);',
    '}',
  ].join('');

  function buildDescHTML(d) {
    if (!d) return '';
    var sections = [
      { lbl: '📜 Storia', key: 's' },
      { lbl: '🌍 Terroir e Suolo', key: 't' },
      { lbl: '🍇 Vitigni', key: 'v' },
      { lbl: '🏭 Produzione', key: 'p' },
      { lbl: '👁 Nel Bicchiere', key: 'o' },
      { lbl: '🍽 Abbinamenti', key: 'a' },
    ];
    var html = '<div class="sw18-desc">';
    sections.forEach(function(s) {
      if (d[s.key]) {
        html += '<div class="sw18-desc-section">';
        html += '<span class="sw18-desc-label">' + s.lbl + '</span>';
        html += '<span class="sw18-desc-text">' + d[s.key] + '</span>';
        html += '</div>';
      }
    });
    if (d.pr) {
      html += '<div class="sw18-desc-section">';
      html += '<span class="sw18-desc-label">🏅 Produttori di Riferimento</span>';
      html += '<div class="sw18-prod-list">' + d.pr + '</div>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function injectDescriptions() {
    /* Osserva quando vengono aperte le denominazioni nel drawer/terroir */
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        m.addedNodes.forEach(function(node) {
          if (!node.querySelectorAll) return;

          /* Trova le card denominazione aperte */
          var denCards = node.querySelectorAll ? node.querySelectorAll('[data-denom-id], .denom-card, .den-card') : [];
          denCards.forEach(checkCard);

          /* Controlla anche il nodo stesso */
          if (node.dataset && node.dataset.denomId) checkCard(node);
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    /* Intercetta il click su denominazioni per aggiungere la descrizione */
    document.addEventListener('click', function(e) {
      /* Click su denominazione nella lista explore o drawer */
      var card = e.target.closest('[data-id], .feat-row, .exp-denom-row, .denom-expand');
      if (!card) return;

      setTimeout(function() {
        var id = card.dataset.id || card.dataset.denomId || '';
        if (!id) return;

        /* Controlla se la descrizione è già stata iniettata */
        if (card.querySelector('.sw18-desc')) return;

        var desc = DESC[id];
        if (desc) {
          var existingDesc = card.querySelector('.sw18-desc');
          if (!existingDesc) {
            card.insertAdjacentHTML('beforeend', buildDescHTML(desc));
          }
        }
      }, 100);
    });

    /* Inietta descrizioni nei dettagli drawer (quando si apre) */
    var drawerObs = new MutationObserver(function() {
      var drawer = document.querySelector('#drawerContent');
      if (!drawer) return;

      /* Trova l\'ID della denominazione aperta */
      var titleEl = drawer.querySelector('[data-denom-id]') || drawer.querySelector('.dp-name');
      if (!titleEl) return;
      var denomId = titleEl.dataset.denomId || titleEl.dataset.id || '';
      if (!denomId) return;

      /* Non iniettare due volte */
      if (drawer.querySelector('.sw18-desc')) return;

      var desc = DESC[denomId];
      if (!desc) return;

      /* Trova dove inserire */
      var insertAfter = drawer.querySelector('.dp-sec-head') || drawer.querySelector('.dp-desc') || titleEl;
      if (insertAfter && insertAfter.parentNode) {
        insertAfter.insertAdjacentHTML('afterend', buildDescHTML(desc));
      }
    });

    var drawer = document.querySelector('#drawerContent');
    if (drawer) {
      drawerObs.observe(drawer, { childList: true, subtree: true, characterData: true });
    }
  }

  /* Inietta descrizione paese nella scheda terroir */
  function injectCountryDesc() {
    document.addEventListener('click', function(e) {
      /* Click su bottone paese nell'explore */
      var btn = e.target.closest('.exp-country-btn, [onclick*="flyToCountry"]');
      if (!btn) return;

      var countryName = btn.textContent.replace(/[🇮🇹🇫🇷🇩🇪🇪🇸🇵🇹🇦🇷🇦🇺🇺🇸🇬🇷🇦🇹🇳🇿🇨🇱🇿🇦🇬🇪🇭🇺]/g, '').trim();
      var desc = COUNTRY_DESC[countryName];
      if (!desc) return;

      setTimeout(function() {
        /* Trova il contenitore del paese */
        var countrySection = document.querySelector('#expCountriesHead, #expCountryInfo, #sw12-terroir-info');
        if (countrySection && !countrySection.querySelector('.sw18-country-desc')) {
          countrySection.insertAdjacentHTML('afterend', '<div class="sw18-country-desc">' + desc + '</div>');
        }
      }, 200);
    });
  }

  /* Patch del drawer per aggiungere descrizioni alle denominazioni */
  function patchDrawerDenoms() {
    var _origShowDrawer = window.showDenomDetails || window.openDenom || null;

    function addDescToDrawer(id) {
      setTimeout(function() {
        var drawer = document.querySelector('#drawerContent, #sw-drawer-body');
        if (!drawer || drawer.querySelector('.sw18-desc')) return;
        var desc = DESC[id];
        if (!desc) return;
        /* Inserisce dopo il primo elemento descrittivo */
        var anchor = drawer.querySelector('p, .dp-desc, .denom-text');
        if (anchor) {
          anchor.insertAdjacentHTML('afterend', buildDescHTML(desc));
        } else {
          drawer.insertAdjacentHTML('beforeend', buildDescHTML(desc));
        }
      }, 300);
    }

    /* Osserva quando si apre il drawer */
    var drawerEl = document.querySelector('#drawer, #sw-drawer');
    if (drawerEl) {
      new MutationObserver(function() {
        var open = drawerEl.classList.contains('open') ||
                   drawerEl.style.transform === 'translateY(0)' ||
                   drawerEl.style.display !== 'none';
        if (!open) return;

        var content = document.querySelector('#drawerContent');
        if (!content || content.querySelector('.sw18-desc')) return;

        /* Cerca l\'ID della denominazione dalle features della mappa */
        var nameEl = content.querySelector('[data-id], .dp-title, .dp-name, h2, h3');
        if (!nameEl) return;

        var id = nameEl.dataset.id || nameEl.dataset.denomId || '';
        if (!id) {
          /* Cerca per testo */
          var txt = nameEl.textContent.trim().toLowerCase().replace(/\s+/g, '_').replace(/[àáâ]/g,'a').replace(/[èé]/g,'e').replace(/[ùú]/g,'u').replace(/[ò]/g,'o').replace(/[ì]/g,'i');
          id = txt;
        }
        addDescToDrawer(id);
      }).observe(drawerEl, { attributes: true, childList: true, subtree: true });
    }
  }


  /* ═══════════════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════════════ */
  function init() {
    console.log('[SW-v18] Patch v18 — Fix Sommelier + Descrizioni Denominazioni');

    /* Inietta CSS */
    if (!document.querySelector('#sw18-css')) {
      var s = document.createElement('style');
      s.id = 'sw18-css';
      s.textContent = CSS_DESC;
      document.head.appendChild(s);
    }

    /* Patch sommelier (aspetta che sia definito) */
    patchSommelier();

    /* Inietta descrizioni */
    injectDescriptions();
    injectCountryDesc();

    setTimeout(patchDrawerDenoms, 1000);
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();

})();
