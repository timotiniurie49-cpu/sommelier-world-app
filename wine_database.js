/**
 * SOMMELIER WORLD — Wine Database v1.0
 * Estratto dalla carta dei vini 2026
 * Struttura editabile dall'Admin
 *
 * Ogni voce: { id, nome, produttore, denominazione, vitigni[], annata, prezzo, tipo, regione, paese, note }
 * tipo: 'rosso' | 'bianco' | 'bollicine' | 'rosato' | 'dolce'
 */

window.WINE_DB = (function() {

  /* ══════════════════════════════════════════
     VINI IN CARTA — 150 vini rappresentativi
     Aggiungibili dall'Admin in qualsiasi momento
     ══════════════════════════════════════════ */
  var _db = [

    /* ── BAROLO ── */
    {id:'b001',nome:'Barolo',produttore:'Bartolo Mascarello',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2012',tipo:'rosso',regione:'Piemonte',paese:'Italia',note:'Etichette dipinte a mano. Tradizionalista puro.'},
    {id:'b002',nome:'Barolo Cannubi',produttore:'E. Pira di Chiara Boschis',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2019',tipo:'rosso',regione:'Piemonte',paese:'Italia',note:'Cru Cannubi, modernista elegante.'},
    {id:'b003',nome:'Barolo Brunate',produttore:'Rinaldi Giuseppe',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2011',tipo:'rosso',regione:'Piemonte',paese:'Italia',note:'Vigneto Brunate, cru storico di La Morra.'},
    {id:'b004',nome:'Barolo "Rocche Rivera"',produttore:'Rinaldi Giuseppe',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2017',tipo:'rosso',regione:'Piemonte',paese:'Italia',note:''},
    {id:'b005',nome:'Barolo "Carobric"',produttore:'Scavino Paolo',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2014',tipo:'rosso',regione:'Piemonte',paese:'Italia',note:'Castiglione Falletto.'},
    {id:'b006',nome:'Barolo Riserva "Novantesimo"',produttore:'Scavino Paolo',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2011',tipo:'rosso',regione:'Piemonte',paese:'Italia',note:'Riserva 90° anniversario.'},
    {id:'b007',nome:'Barolo Brunate "Tre Tine"',produttore:'Scavino Paolo',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2013',tipo:'rosso',regione:'Piemonte',paese:'Italia',note:''},
    {id:'b008',nome:'Barolo "Bric del Fiasc"',produttore:'Scavino Paolo',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2020',tipo:'rosso',regione:'Piemonte',paese:'Italia',note:''},
    {id:'b009',nome:'Barolo Bussia',produttore:'Scavino Paolo',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2019',tipo:'rosso',regione:'Piemonte',paese:'Italia',note:''},
    {id:'b010',nome:'Barolo "Conteisa"',produttore:'Gaja',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2013',tipo:'rosso',regione:'Piemonte',paese:'Italia',note:'Grinzane Cavour. Gaja produce Barolo E Barbaresco.'},
    {id:'b011',nome:'Barolo Bussia "Colonnello"',produttore:'Poderi Aldo Conterno',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2011',tipo:'rosso',regione:'Piemonte',paese:'Italia',note:'Monforte d\'Alba.'},
    {id:'b012',nome:'Barolo Bussia "Romirasco"',produttore:'Poderi Aldo Conterno',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2005',tipo:'rosso',regione:'Piemonte',paese:'Italia',note:'Monforte d\'Alba. Annata leggendaria.'},
    {id:'b013',nome:'Barolo "Ciabot Mentin"',produttore:'Poderi Aldo Conterno',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2011',tipo:'rosso',regione:'Piemonte',paese:'Italia',note:''},
    {id:'b014',nome:'Barolo "Percristina"',produttore:'Poderi Aldo Conterno',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2014',tipo:'rosso',regione:'Piemonte',paese:'Italia',note:''},
    {id:'b015',nome:'Barolo "Pajana"',produttore:'Poderi Aldo Conterno',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2019',tipo:'rosso',regione:'Piemonte',paese:'Italia',note:''},
    {id:'b016',nome:'Barolo "Santo Stefano di Perno"',produttore:'Mascarello Giuseppe',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2014',tipo:'rosso',regione:'Piemonte',paese:'Italia'},
    {id:'b017',nome:'Barolo "Monprivato"',produttore:'Mascarello Giuseppe',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2014',tipo:'rosso',regione:'Piemonte',paese:'Italia',note:'Cru storico di Castiglione Falletto.'},
    {id:'b018',nome:'Barolo Riserva Bussia "Oro"',produttore:'Parusso',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2013',tipo:'rosso',regione:'Piemonte',paese:'Italia'},
    {id:'b019',nome:'Barolo Prapò',produttore:'Ceretto',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2018',tipo:'rosso',regione:'Piemonte',paese:'Italia'},
    {id:'b020',nome:'Barolo "Arborina"',produttore:'Elio Altare',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2014',tipo:'rosso',regione:'Piemonte',paese:'Italia',note:'La Morra. Modernista.'},
    {id:'b021',nome:'Barolo "Cascina Nuova"',produttore:'Elvio Cogno',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2018',tipo:'rosso',regione:'Piemonte',paese:'Italia'},
    {id:'b022',nome:'Barolo "Ravera"',produttore:'Elvio Cogno',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2018',tipo:'rosso',regione:'Piemonte',paese:'Italia'},
    {id:'b023',nome:'Barolo Falletto',produttore:'Giacosa Bruno',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2012',tipo:'rosso',regione:'Piemonte',paese:'Italia'},
    {id:'b024',nome:'Barolo Riserva "Le Rocche del Falletto"',produttore:'Giacosa Bruno',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2007',tipo:'rosso',regione:'Piemonte',paese:'Italia',note:'Una delle Riserve più famose al mondo.'},
    {id:'b025',nome:'Barolo "Aeroplanservaj"',produttore:'Domenico Clerico',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2019',tipo:'rosso',regione:'Piemonte',paese:'Italia'},
    {id:'b026',nome:'Barolo Parafada',produttore:'Massolino',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2011',tipo:'rosso',regione:'Piemonte',paese:'Italia'},
    {id:'b027',nome:'Barolo "Campé"',produttore:'La Spinetta',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2013',tipo:'rosso',regione:'Piemonte',paese:'Italia'},
    {id:'b028',nome:'Barolo "Gattera"',produttore:'Bovio Gianfranco',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2016',tipo:'rosso',regione:'Piemonte',paese:'Italia'},
    {id:'b029',nome:'Barolo Castelletto',produttore:'Podere Rocche dei Manzoni',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2018',tipo:'rosso',regione:'Piemonte',paese:'Italia'},
    {id:'b030',nome:'Barolo di Serralunga',produttore:'Germano Ettore',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2019',tipo:'rosso',regione:'Piemonte',paese:'Italia'},
    {id:'b031',nome:'Barolo Prapò',produttore:'Germano Ettore',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2017',tipo:'rosso',regione:'Piemonte',paese:'Italia'},
    {id:'b032',nome:'Barolo Vigna Rionda',produttore:'Germano Ettore',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2017',tipo:'rosso',regione:'Piemonte',paese:'Italia'},
    {id:'b033',nome:'Barolo "Monvigliero"',produttore:'Antica Casa Vinicola Scarpa',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2018',tipo:'rosso',regione:'Piemonte',paese:'Italia'},
    {id:'b034',nome:'Barolo Cannubi',produttore:'Francesco Rinaldi & Figli',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2019',tipo:'rosso',regione:'Piemonte',paese:'Italia'},

    /* ── BARBARESCO ── */
    {id:'ba001',nome:'Barbaresco "Costa Russi"',produttore:'Gaja',denominazione:'Barbaresco DOCG',vitigni:['Nebbiolo'],annata:'1990',tipo:'rosso',regione:'Piemonte',paese:'Italia',note:'Annata storica. Gaja è il produttore più famoso di Barbaresco.'},
    {id:'ba002',nome:'Barbaresco "Sorì Tildin"',produttore:'Gaja',denominazione:'Barbaresco DOCG',vitigni:['Nebbiolo'],annata:'2013',tipo:'rosso',regione:'Piemonte',paese:'Italia'},
    {id:'ba003',nome:'Barbaresco',produttore:'Bruno Rocca',denominazione:'Barbaresco DOCG',vitigni:['Nebbiolo'],annata:'2021',tipo:'rosso',regione:'Piemonte',paese:'Italia'},
    {id:'ba004',nome:'Barbaresco "Rabajà"',produttore:'Bruno Rocca',denominazione:'Barbaresco DOCG',vitigni:['Nebbiolo'],annata:'2022',tipo:'rosso',regione:'Piemonte',paese:'Italia',note:'Cru Rabajà di Barbaresco.'},
    {id:'ba005',nome:'Barbaresco Riserva "Currà"',produttore:'Bruno Rocca',denominazione:'Barbaresco DOCG',vitigni:['Nebbiolo'],annata:'2012',tipo:'rosso',regione:'Piemonte',paese:'Italia'},
    {id:'ba006',nome:'Barbaresco Riserva "Asili"',produttore:'Caʼ del Baio',denominazione:'Barbaresco DOCG',vitigni:['Nebbiolo'],annata:'2007',tipo:'rosso',regione:'Piemonte',paese:'Italia',note:'Cru Asili, annata eccezionale.'},
    {id:'ba007',nome:'Barbaresco Riserva "Asili"',produttore:'Caʼ del Baio',denominazione:'Barbaresco DOCG',vitigni:['Nebbiolo'],annata:'2019',tipo:'rosso',regione:'Piemonte',paese:'Italia'},
    {id:'ba008',nome:'Barbaresco Riserva "Autinbej"',produttore:'Caʼ del Baio',denominazione:'Barbaresco DOCG',vitigni:['Nebbiolo'],annata:'2022',tipo:'rosso',regione:'Piemonte',paese:'Italia'},
    {id:'ba009',nome:'Barbaresco "Asili"',produttore:'Ceretto',denominazione:'Barbaresco DOCG',vitigni:['Nebbiolo'],annata:'2012',tipo:'rosso',regione:'Piemonte',paese:'Italia'},
    {id:'ba010',nome:'Barbaresco "Roncaglie Masseria"',produttore:'Vietti',denominazione:'Barbaresco DOCG',vitigni:['Nebbiolo'],annata:'2013',tipo:'rosso',regione:'Piemonte',paese:'Italia'},
    {id:'ba011',nome:'Barbaresco "Starderi"',produttore:'La Spinetta',denominazione:'Barbaresco DOCG',vitigni:['Nebbiolo'],annata:'2013',tipo:'rosso',regione:'Piemonte',paese:'Italia'},
    {id:'ba012',nome:'Barbaresco "Vanotu"',produttore:'La Spinetta',denominazione:'Barbaresco DOCG',vitigni:['Nebbiolo'],annata:'2020',tipo:'rosso',regione:'Piemonte',paese:'Italia'},
    {id:'ba013',nome:'Barbaresco Riserva "Santo Stefano Albesani"',produttore:'Castello di Neive',denominazione:'Barbaresco DOCG',vitigni:['Nebbiolo'],annata:'2017',tipo:'rosso',regione:'Piemonte',paese:'Italia'},
    {id:'ba014',nome:'Barbaresco Montefico "Vecchie Viti"',produttore:'Caʼ del Baio',denominazione:'Barbaresco DOCG',vitigni:['Nebbiolo'],annata:'2010',tipo:'rosso',regione:'Piemonte',paese:'Italia'},
    {id:'ba015',nome:'Barbaresco Pajé "Vecchie Viti"',produttore:'Caʼ del Baio',denominazione:'Barbaresco DOCG',vitigni:['Nebbiolo'],annata:'2010',tipo:'rosso',regione:'Piemonte',paese:'Italia',note:'Rarissimo, viti ultracentenarie.'},

    /* ── BRUNELLO DI MONTALCINO ── */
    {id:'br001',nome:'Brunello di Montalcino',produttore:'Biondi-Santi',denominazione:'Brunello di Montalcino DOCG',vitigni:['Sangiovese Grosso'],annata:'2011',tipo:'rosso',regione:'Toscana',paese:'Italia',note:'La cantina che ha inventato il Brunello nel 1888.'},
    {id:'br002',nome:'Brunello di Montalcino',produttore:'Casanova di Neri',denominazione:'Brunello di Montalcino DOCG',vitigni:['Sangiovese'],annata:'2017',tipo:'rosso',regione:'Toscana',paese:'Italia'},
    {id:'br003',nome:'Brunello di Montalcino "Cerretalto"',produttore:'Casanova di Neri',denominazione:'Brunello di Montalcino DOCG',vitigni:['Sangiovese'],annata:'2012',tipo:'rosso',regione:'Toscana',paese:'Italia'},
    {id:'br004',nome:'Brunello di Montalcino Riserva',produttore:'Poggio Antico',denominazione:'Brunello di Montalcino DOCG',vitigni:['Sangiovese'],annata:'2012',tipo:'rosso',regione:'Toscana',paese:'Italia'},
    {id:'br005',nome:'Brunello di Montalcino',produttore:'Col dʼOrcia',denominazione:'Brunello di Montalcino DOCG',vitigni:['Sangiovese'],annata:'2017',tipo:'rosso',regione:'Toscana',paese:'Italia'},
    {id:'br006',nome:'Brunello di Montalcino "Madonna delle Grazie"',produttore:"Il Marroneto",denominazione:'Brunello di Montalcino DOCG',vitigni:['Sangiovese'],annata:'2017',tipo:'rosso',regione:'Toscana',paese:'Italia'},

    /* ── BOLLICINE ITALIANE ── */
    {id:'sp001',nome:'Metodo Classico "Cuvée des Mines de Cogne"',produttore:'Cave Mont Blanc',denominazione:'Valle d\'Aosta DOC',vitigni:['Pinot Noir'],annata:'2021',tipo:'bollicine',regione:'Valle d\'Aosta',paese:'Italia'},
    {id:'sp002',nome:'Franciacorta Extra Brut Riserva "Vittorio Moretti"',produttore:'Bellavista',denominazione:'Franciacorta DOCG',vitigni:['Chardonnay','Pinot Nero'],annata:'2016',tipo:'bollicine',regione:'Lombardia',paese:'Italia',note:'La Franciacorta più iconica.'},
    {id:'sp003',nome:'Franciacorta Brut Nature "Cabochon Doppio Zero"',produttore:'Monte Rossa',denominazione:'Franciacorta DOCG',vitigni:['Chardonnay'],annata:'2018',tipo:'bollicine',regione:'Lombardia',paese:'Italia'},
    {id:'sp004',nome:'Trento Brut Riserva "Methius"',produttore:'Dorigati',denominazione:'Trento DOC',vitigni:['Chardonnay'],annata:'2011',tipo:'bollicine',regione:'Trentino',paese:'Italia'},
    {id:'sp005',nome:'Alta Langa Extra Brut "Vino Biologico"',produttore:'Giulio Cocchi',denominazione:'Alta Langa DOCG',vitigni:['Pinot Nero'],annata:'2019',tipo:'bollicine',regione:'Piemonte',paese:'Italia'},

    /* ── CHAMPAGNE ── */
    {id:'ch001',nome:'Champagne Brut "Cuvée Sir Winston Churchill"',produttore:'Pol Roger',denominazione:'Champagne AOC',vitigni:['Pinot Noir','Chardonnay'],annata:'2015',tipo:'bollicine',regione:'Champagne',paese:'Francia',note:'Il Champagne preferito di Churchill.'},
    {id:'ch002',nome:'Champagne Dom Pérignon',produttore:'Moët & Chandon',denominazione:'Champagne AOC',vitigni:['Chardonnay','Pinot Noir'],annata:'2013',tipo:'bollicine',regione:'Champagne',paese:'Francia'},
    {id:'ch003',nome:'Champagne Cristal',produttore:'Louis Roederer',denominazione:'Champagne AOC',vitigni:['Chardonnay','Pinot Noir'],annata:'2015',tipo:'bollicine',regione:'Champagne',paese:'Francia'},
    {id:'ch004',nome:'Champagne Blanc de Blancs Grand Cru',produttore:'Billecart-Salmon',denominazione:'Champagne AOC',vitigni:['Chardonnay'],annata:'2012',tipo:'bollicine',regione:'Champagne',paese:'Francia'},
    {id:'ch005',nome:'Champagne Krug Grande Cuvée',produttore:'Krug',denominazione:'Champagne AOC',vitigni:['Pinot Noir','Meunier','Chardonnay'],annata:'s.a.',tipo:'bollicine',regione:'Champagne',paese:'Francia'},

    /* ── BIANCHI ITALIANI ── */
    {id:'w001',nome:'Soave Classico "Vigneti di Foscarino"',produttore:'Inama',denominazione:'Soave DOC',vitigni:['Garganega'],annata:'2021',tipo:'bianco',regione:'Veneto',paese:'Italia'},
    {id:'w002',nome:'Vintage Tunina',produttore:'Jermann',denominazione:'IGT Venezia Giulia',vitigni:['Sauvignon Blanc','Chardonnay','Ribolla Gialla','Malvasia'],annata:'2006',tipo:'bianco',regione:'Friuli-Venezia Giulia',paese:'Italia',note:'Uno dei bianchi italiani più famosi al mondo.'},
    {id:'w003',nome:'Trebbiano dʼAbruzzo',produttore:'Valentini Edoardo',denominazione:'Trebbiano d\'Abruzzo DOC',vitigni:['Trebbiano'],annata:'2016',tipo:'bianco',regione:'Abruzzo',paese:'Italia',note:'Il Trebbiano più famoso e longevo d\'Italia.'},
    {id:'w004',nome:'Colli Orientali del Friuli "Abbazia di Rosazzo"',produttore:'Movia',denominazione:'Colli Orientali del Friuli DOC',vitigni:['Friulano'],annata:'2021',tipo:'bianco',regione:'Friuli-Venezia Giulia',paese:'Italia'},
    {id:'w005',nome:'Vulcaia Fumè Sauvignon',produttore:'Inama',denominazione:'IGT Veneto',vitigni:['Sauvignon'],annata:'2021',tipo:'bianco',regione:'Veneto',paese:'Italia'},
    {id:'w006',nome:'Fumin Bianco',produttore:'Anselmet',denominazione:'Valle d\'Aosta DOC',vitigni:['Prié Blanc'],annata:'2022',tipo:'bianco',regione:'Valle d\'Aosta',paese:'Italia'},

    /* ── VINI VALDOSTANI ── */
    {id:'va001',nome:'Fumin',produttore:'Anselmet',denominazione:'Valle d\'Aosta DOC',vitigni:['Fumin'],annata:'2020',tipo:'rosso',regione:'Valle d\'Aosta',paese:'Italia',note:'Vitigno autoctono valdostano. Speziato e austero.'},
    {id:'va002',nome:'Torrette Superiore',produttore:'Les Crêtes',denominazione:'Valle d\'Aosta DOC',vitigni:['Petit Rouge'],annata:'2021',tipo:'rosso',regione:'Valle d\'Aosta',paese:'Italia'},
    {id:'va003',nome:'Chardonnay "Cuvée Bois"',produttore:'Les Crêtes',denominazione:'Valle d\'Aosta DOC',vitigni:['Chardonnay'],annata:'2021',tipo:'bianco',regione:'Valle d\'Aosta',paese:'Italia'},

    /* ── SUPERTUSCAN & TOSCANA ── */
    {id:'st001',nome:'Sassicaia',produttore:'Tenuta San Guido',denominazione:'Bolgheri Sassicaia DOC',vitigni:['Cabernet Sauvignon','Cabernet Franc'],annata:'2019',tipo:'rosso',regione:'Toscana',paese:'Italia',note:'Il primo Super Tuscan della storia (1968). NON è di Antinori.'},
    {id:'st002',nome:'Ornellaia',produttore:'Ornellaia',denominazione:'Bolgheri Superiore DOC',vitigni:['Cabernet Sauvignon','Merlot','Petit Verdot'],annata:'2019',tipo:'rosso',regione:'Toscana',paese:'Italia'},
    {id:'st003',nome:'Chianti Classico Riserva',produttore:'Fontodi',denominazione:'Chianti Classico DOCG',vitigni:['Sangiovese'],annata:'2018',tipo:'rosso',regione:'Toscana',paese:'Italia'},
    {id:'st004',nome:'Chianti Classico Gran Selezione "Vigna del Sorbo"',produttore:'Fontodi',denominazione:'Chianti Classico DOCG',vitigni:['Sangiovese'],annata:'2016',tipo:'rosso',regione:'Toscana',paese:'Italia'},
    {id:'st005',nome:'Vino Nobile di Montepulciano',produttore:'Poliziano',denominazione:'Vino Nobile di Montepulciano DOCG',vitigni:['Prugnolo Gentile'],annata:'2018',tipo:'rosso',regione:'Toscana',paese:'Italia'},

    /* ── AMARONE & VENETO ── */
    {id:'am001',nome:'Amarone della Valpolicella Classico',produttore:'Bertani',denominazione:'Amarone della Valpolicella DOCG',vitigni:['Corvina','Corvinone','Rondinella'],annata:'2012',tipo:'rosso',regione:'Veneto',paese:'Italia',note:'Produzione dal 1857. Amarone più longevo del mercato.'},
    {id:'am002',nome:'Amarone della Valpolicella "Dal Forno"',produttore:'Dal Forno Romano',denominazione:'Amarone della Valpolicella DOCG',vitigni:['Corvina','Corvinone','Oseleta'],annata:'2013',tipo:'rosso',regione:'Veneto',paese:'Italia',note:'L\'Amarone più ricercato al mondo.'},
    {id:'am003',nome:'Amarone della Valpolicella Classico',produttore:'Allegrini',denominazione:'Amarone della Valpolicella DOCG',vitigni:['Corvina','Rondinella'],annata:'2017',tipo:'rosso',regione:'Veneto',paese:'Italia'},

    /* ── PIEMONTE ALTRO ── */
    {id:'pi001',nome:'Gattinara',produttore:'Conterno Cantine Nervi',denominazione:'Gattinara DOCG',vitigni:['Nebbiolo'],annata:'2016',tipo:'rosso',regione:'Piemonte',paese:'Italia',note:'Nord Piemonte. Proprietà Sperino.'},
    {id:'pi002',nome:'Barolo "Francia"',produttore:'Giacomo Conterno',denominazione:'Barolo DOCG',vitigni:['Nebbiolo'],annata:'2012',tipo:'rosso',regione:'Piemonte',paese:'Italia',note:'Giacomo Conterno — diverso da Poderi Aldo Conterno. Maschio di Serralunga.'},
    {id:'pi003',nome:'Barbaresco Riserva "Gaiun Martinenga"',produttore:'Marchesi di Gresy',denominazione:'Barbaresco DOCG',vitigni:['Nebbiolo'],annata:'2017',tipo:'rosso',regione:'Piemonte',paese:'Italia'},
    {id:'pi004',nome:'Barbaresco Riserva "Camp Gros Martinenga"',produttore:'Marchesi di Gresy',denominazione:'Barbaresco DOCG',vitigni:['Nebbiolo'],annata:'2018',tipo:'rosso',regione:'Piemonte',paese:'Italia'},

    /* ── VINI ESTERI ── */
    {id:'ext001',nome:'Château Pétrus',produttore:'Pétrus',denominazione:'Pomerol AOC',vitigni:['Merlot'],annata:'2010',tipo:'rosso',regione:'Bordeaux',paese:'Francia',note:'Il Merlot più famoso al mondo. Produttore: Moueix (NON Rothschild).'},
    {id:'ext002',nome:'Château Margaux',produttore:'Château Margaux',denominazione:'Margaux AOC',vitigni:['Cabernet Sauvignon'],annata:'2015',tipo:'rosso',regione:'Bordeaux',paese:'Francia'},
    {id:'ext003',nome:'Châteauneuf-du-Pape "Château Rayas"',produttore:'Château Rayas',denominazione:'Châteauneuf-du-Pape AOC',vitigni:['Grenache'],annata:'2015',tipo:'rosso',regione:'Rodano',paese:'Francia',note:'Il Châteauneuf più leggendario.'},
    {id:'ext004',nome:'Côte-Rôtie "La Mouline"',produttore:'E. Guigal',denominazione:'Côte-Rôtie AOC',vitigni:['Syrah'],annata:'2017',tipo:'rosso',regione:'Rodano',paese:'Francia'},
    {id:'ext005',nome:'Hermitage Rouge',produttore:'Jean-Louis Chave',denominazione:'Hermitage AOC',vitigni:['Syrah'],annata:'2016',tipo:'rosso',regione:'Rodano',paese:'Francia'},
    {id:'ext006',nome:'Chablis Grand Cru "Les Clos"',produttore:'William Fèvre',denominazione:'Chablis Grand Cru AOC',vitigni:['Chardonnay'],annata:'2019',tipo:'bianco',regione:'Borgogna',paese:'Francia'},
    {id:'ext007',nome:'Riesling Smaragd "Singerriedel"',produttore:'F.X. Pichler',denominazione:'Wachau DAC',vitigni:['Riesling'],annata:'2020',tipo:'bianco',regione:'Wachau',paese:'Austria'},
  ];

  /* ══════════════════════════════════════════
     API PUBBLICA
     ══════════════════════════════════════════ */

  function _load() {
    try {
      var saved = localStorage.getItem('sw_wine_db_extra');
      if(saved) {
        var extra = JSON.parse(saved);
        return _db.concat(extra);
      }
    } catch(e) {}
    return _db.slice();
  }

  function _save(db) {
    var built_in_ids = _db.map(function(w){ return w.id; });
    var extra = db.filter(function(w){ return built_in_ids.indexOf(w.id) < 0; });
    try { localStorage.setItem('sw_wine_db_extra', JSON.stringify(extra)); } catch(e) {}
  }

  return {

    /* Tutti i vini */
    all: function() { return _load(); },

    /* Cerca per nome / produttore / vitigno */
    search: function(query) {
      var q = (query||'').toLowerCase();
      if(!q) return [];
      return _load().filter(function(w){
        return w.nome.toLowerCase().includes(q) ||
               w.produttore.toLowerCase().includes(q) ||
               (w.vitigni||[]).some(function(v){ return v.toLowerCase().includes(q); }) ||
               w.denominazione.toLowerCase().includes(q);
      });
    },

    /* Filtra per tipo + budget */
    filter: function(opts) {
      var db = _load();
      return db.filter(function(w){
        if(opts.tipo && w.tipo !== opts.tipo) return false;
        if(opts.regione && w.regione !== opts.regione) return false;
        if(opts.paese && w.paese !== opts.paese) return false;
        if(opts.budget && w.prezzo > opts.budget) return false;
        if(opts.maxPrezzo && w.prezzo > opts.maxPrezzo) return false;
        return true;
      });
    },

    /* ══════════════════════════════════════
       Costruisce contesto produttori per l'AI
       IMPORTANTE: non è una prigione — l'AI
       usa questi dati come RIFERIMENTO per
       garantire precisione sui produttori,
       ma può suggerire anche altri vini dello
       stesso livello disponibili sul mercato.
       ══════════════════════════════════════ */
    buildContext: function(menu, budget, paese, regione) {
      var db = _load();

      /* Filtra per budget e origine se specificati */
      var relevant = db.filter(function(w){
        if(budget && w.prezzo > budget * 1.5) return false;
        if(paese && w.paese && !w.paese.toLowerCase().includes(paese.toLowerCase())) return false;
        if(regione && w.regione && !w.regione.toLowerCase().includes(regione.toLowerCase())) return false;
        return true;
      });

      if(!relevant.length) relevant = budget ? db.filter(function(w){ return w.prezzo <= budget*1.5; }) : db;
      relevant = relevant.slice(0,20);
      if(!relevant.length) return '';

      /* Lista vini di riferimento */
      var wineLines = relevant.map(function(w){
        return '• '+w.nome+' | '+w.produttore+' | '+w.denominazione+' | '+(w.annata||'s.a.')+
               (w.note?' | '+w.note:'');
      });

      /* Lista produttori estratti dalla carta (per precisione) */
      var allProds = window.PRODUCERS_DB || [];
      var prodByRegion = {};
      allProds.forEach(function(p){
        var r = p.regione;
        if(!prodByRegion[r]) prodByRegion[r] = [];
        if(prodByRegion[r].length < 6) prodByRegion[r].push(p.nome);
      });
      var prodLines = Object.keys(prodByRegion).slice(0,8).map(function(r){
        return r+': '+prodByRegion[r].join(', ');
      });

      return '\n\n━━━ RIFERIMENTO CARTA DEI VINI ━━━\n'+
             'Questi sono i vini e produttori presenti nella nostra carta.\n'+
             'Usali come INFORMAZIONI SUI PRODUTTORI della zona.\n'+
             'Il Sommelier è libero di consigliare qualsiasi vino mondiale\n'+
             'di qualità — la carta serve solo a conoscere i produttori\n'+
             'del territorio e lo stile dei vini serviti.\n\n'+
             'VINI IN CARTA:\n'+wineLines.join('\n')+
             '\n\nPRODUTTORI IN CARTA PER REGIONE:\n'+prodLines.join('\n')+
             '\n━━━ FINE RIFERIMENTO ━━━';
    },

    /* Aggiunge un vino (da Admin) */
    add: function(wine) {
      var db = _load();
      wine.id = 'custom_'+Date.now();
      db.push(wine);
      _save(db);
      return wine.id;
    },

    /* Rimuove un vino */
    remove: function(id) {
      var db = _load();
      var filtered = db.filter(function(w){ return w.id !== id; });
      _save(filtered);
    },

    /* Contatori */
    count: function() { return _load().length; },
    countByType: function(tipo) { return _load().filter(function(w){ return w.tipo===tipo; }).length; },
  };

})();

/* ══════════════════════════════════════════
   REGIONI ITALIA — tutte e 20
   ══════════════════════════════════════════ */
window.REGIONI = {
  'Italia': [
    'Valle d\'Aosta','Piemonte','Lombardia','Trentino-Alto Adige',
    'Veneto','Friuli-Venezia Giulia','Liguria','Emilia-Romagna',
    'Toscana','Umbria','Marche','Lazio','Abruzzo','Molise',
    'Campania','Basilicata','Puglia','Calabria','Sicilia','Sardegna'
  ],
  'Francia':     ['Bordeaux','Borgogna','Champagne','Rodano','Alsazia','Loira','Provenza','Languedoc'],
  'Spagna':      ['Rioja','Ribera del Duero','Priorat','Rueda','Penedès','Bierzo','Rías Baixas'],
  'Portogallo':  ['Douro','Alentejo','Vinho Verde','Dão','Bairrada','Setúbal'],
  'Germania':    ['Mosel','Rheingau','Pfalz','Baden','Franken','Nahe'],
  'Austria':     ['Wachau','Kamptal','Kremstal','Burgenland','Südsteiermark'],
  'USA':         ['Napa Valley','Sonoma','Willamette Valley','Central Coast','Paso Robles'],
  'Argentina':   ['Mendoza','San Juan','Salta','Patagonia','Luján de Cuyo'],
  'Cile':        ['Maipo','Colchagua','Casablanca','Elqui','Aconcagua'],
  'Australia':   ['Barossa Valley','Eden Valley','McLaren Vale','Hunter Valley','Margaret River'],
  'Nuova Zelanda':['Marlborough','Central Otago','Hawke\'s Bay','Martinborough'],
  'Sud Africa':  ['Stellenbosch','Franschhoek','Walker Bay','Swartland','Constantia'],
  'Grecia':      ['Santorini','Naoussa','Nemea','Mantinia','Creta'],
  'Ungheria':    ['Tokaj','Eger','Villány','Sopron','Szekszárd'],
  'Georgia':     ['Kakheti','Kartli','Racha-Lechkhumi','Adjara'],
};


/* Tutti i produttori in carta (255) */
window.PRODUCERS_DB = [
  {nome:'Cave Mont Blanc',citta:'Morgex',regione:'Valle d\'Aosta'},
  {nome:'La Crotta di Vegneron',citta:'Chambave',regione:'Valle d\'Aosta'},
  {nome:'Les Crêtes',citta:'Aymavilles',regione:'Valle d\'Aosta'},
  {nome:'Antica Fratta',citta:'Monticelli Brusati',regione:'Lombardia'},
  {nome:'Maley',citta:'Brissogne',regione:'Valle d\'Aosta'},
  {nome:'Cascina Baricchi',citta:'Neviglie',regione:'Piemonte'},
  {nome:'Giulio Cocchi',citta:'Cocconato',regione:'Piemonte'},
  {nome:'Cavalleri',citta:'Ebrusco',regione:'Lombardia'},
  {nome:'Derbusco Cives',citta:'Ebrusco',regione:'Lombardia'},
  {nome:'Ferghettina',citta:'Adro',regione:'Lombardia'},
  {nome:'Monte Rossa',citta:'Cazzago San Martino',regione:'Lombardia'},
  {nome:'DUBL di Feudi Di San Gregorio',citta:'Sorbo Serpico',regione:'Campania'},
  {nome:'D\'Araprì',citta:'San Severo',regione:'Puglia'},
  {nome:'Sorelle Bronca',citta:'Colbertaldo di Vidor',regione:'Veneto'},
  {nome:'Anselmet',citta:'Villeneuve',regione:'Valle d\'Aosta'},
  {nome:'Grosjean Vins',citta:'Quart',regione:'Valle d\'Aosta'},
  {nome:'Cave Gargantua',citta:'Gressan',regione:'Valle d\'Aosta'},
  {nome:'Di Barrò',citta:'Saint-Pierre',regione:'Valle d\'Aosta'},
  {nome:'Domaine Quinson',citta:'Morgex',regione:'Valle d\'Aosta'},
  {nome:'La Vrille',citta:'Verrayes',regione:'Valle d\'Aosta'},
  {nome:'Rosset Terroir',citta:'Quart',regione:'Valle d\'Aosta'},
  {nome:'Ca\' del Baio',citta:'Treiso',regione:'Piemonte'},
  {nome:'Ceretto',citta:'Alba',regione:'Piemonte'},
  {nome:'Spertino Luigi',citta:'Mombercelli',regione:'Piemonte'},
  {nome:'Mura Mura',citta:'Montegrosso d\'Asti',regione:'Piemonte'},
  {nome:'Cantina Gnavi Carlo',citta:'Caluso',regione:'Piemonte'},
  {nome:'La Mesma',citta:'Novi Ligure',regione:'Piemonte'},
  {nome:'Ca\' dei Frati',citta:'Sirmione',regione:'Lombardia'},
  {nome:'Ca\' del Bosco',citta:'Ebrusco',regione:'Lombardia'},
  {nome:'Ladeger Alois',citta:'Magrè',regione:'Alto Adige'},
  {nome:'Montelio',citta:'Codevilla',regione:'Lombardia'},
  {nome:'Patrizia Cadore',citta:'Pozzolengo',regione:'Lombardia'},
  {nome:'San Michele Appiano',citta:'Appiano',regione:'Alto Adige'},
  {nome:'Cantina Toblino',citta:'Madruzzo',regione:'Trentino'},
  {nome:'Tenuta San Leonardo',citta:'Avio',regione:'Trentino'},
  {nome:'Castello di Lispida',citta:'Monselice',regione:'Veneto'},
  {nome:'Bertani Cav. G. B.',citta:'Grezzana',regione:'Veneto'},
  {nome:'Inama',citta:'San Bonifacio',regione:'Veneto'},
  {nome:'La Biancara - Angiolino Maule',citta:'Gambellara',regione:'Veneto'},
  {nome:'Lis Neris',citta:'San Lorenzo Isontino',regione:'Friuli-Venezia Giulia'},
  {nome:'Paraschos Evangelos',citta:'San Floriano del Collio',regione:'Friuli-Venezia Giulia'},
  {nome:'Ronchi di Cialla',citta:'Prepotto',regione:'Friuli-Venezia Giulia'},
  {nome:'Roncùs',citta:'Capriva del Friuli',regione:'Friuli-Venezia Giulia'},
  {nome:'Bio Vio',citta:'Albenga',regione:'Liguria'},
  {nome:'Santa Caterina',citta:'Sarzana',regione:'Liguria'},
  {nome:'Bruna',citta:'Ranzo',regione:'Liguria'},
  {nome:'Selvadolce',citta:'Bordighera',regione:'Liguria'},
  {nome:'Campogrande di Elio Altare',citta:'Riomaggiore',regione:'Liguria'},
  {nome:'Enoteca Bisson',citta:'Chiavari',regione:'Liguria'},
  {nome:'La Bettigna',citta:'Sarzana',regione:'Liguria'},
  {nome:'La Stoppa',citta:'Rivergaro',regione:'Emilia Romagna'},
  {nome:'San Patrignano',citta:'Coriano',regione:'Emilia Romagna'},
  {nome:'Tedeschi Alberto',citta:'Zola Pedrosa',regione:'Emilia Romagna'},
  {nome:'Montenidoli',citta:'San Gimignano',regione:'Toscana'},
  {nome:'Querciabella',citta:'Greve in Chianti',regione:'Toscana'},
  {nome:'Tanganelli Carlo',citta:'Castiglion Fiorentino',regione:'Toscana'},
  {nome:'Allevi Maria Letizia',citta:'Castorano',regione:'Marche'},
  {nome:'Bucci',citta:'Ostra Vetere',regione:'Marche'},
  {nome:'Fattoria La Monacesca',citta:'Matelica',regione:'Marche'},
  {nome:'Fattoria San Lorenzo',citta:'Matelica',regione:'Marche'},
  {nome:'Falesco',citta:'Montefiascone',regione:'Lazio'},
  {nome:'Velenosi Vini',citta:'Ascoli Piceno',regione:'Marche'},
  {nome:'Agriverde',citta:'Villa Caldari',regione:'Abruzzo'},
  {nome:'Castello di Semivicoli',citta:'Casacanditella',regione:'Abruzzo'},
  {nome:'Masciarelli',citta:'San Martino sulla Marrucina',regione:'Abruzzo'},
  {nome:'Pepe Emidio',citta:'Torano Nuovo',regione:'Abruzzo'},
  {nome:'Valentini Edoardo',citta:'Loreto Aprutino',regione:'Abruzzo'},
  {nome:'Di Majo Norante',citta:'Campomarino',regione:'Molise'},
  {nome:'Scala Fenicia',citta:'Capri',regione:'Campania'},
  {nome:'De Bartoli Marco',citta:'Marsala',regione:'Sicilia'},
  {nome:'Spiriti Ebbri',citta:'Spezzano Piccolo',regione:'Calabria'},
  {nome:'Graci',citta:'Castiglione di Sicilia',regione:'Sicilia'},
  {nome:'Azienda Agricola Milazzo',citta:'Campobello di Licata',regione:'Sicilia'},
  {nome:'Hauner',citta:'Santa Marina Salina',regione:'Sicilia'},
  {nome:'Benanti',citta:'Viagrande',regione:'Sicilia'},
  {nome:'COS',citta:'Vittoria',regione:'Sicilia'},
  {nome:'Caravaglio Antonio',citta:'Malfa',regione:'Sicilia'},
  {nome:'Tenuta delle Terre Nere',citta:'Randazzo',regione:'Sicilia'},
  {nome:'Pala',citta:'Serdiana',regione:'Sardegna'},
  {nome:'Vinicola Cherchi',citta:'Usini',regione:'Sardegna'},
  {nome:'Bressan Mastri Vinai',citta:'Farra d\'Isonzo',regione:'Friuli-Venezia Giulia'},
  {nome:'Cantina di Soliera',citta:'Soliera',regione:'Emilia Romagna'},
  {nome:'Azienda Agricola Bulichella',citta:'Suvereto',regione:'Toscana'},
  {nome:'Piantagrossa',citta:'Donnas',regione:'Valle d\'Aosta'},
  {nome:'Morella',citta:'Manduria',regione:'Puglia'},
  {nome:'Azienda Agricola Eubea',citta:'Rionero in Vulture',regione:'Basilicata'},
  {nome:'Ceraudo',citta:'Strongoli',regione:'Calabria'},
  {nome:'IGreco',citta:'Cariati',regione:'Calabria'},
  {nome:'Cave Cooperative de l\'Enfer',citta:'Arvier',regione:'Valle d\'Aosta'},
  {nome:'Feudo di San Maurizio',citta:'Sarre',regione:'Valle d\'Aosta'},
  {nome:'Cave Monaja',citta:'Sarre',regione:'Valle d\'Aosta'},
  {nome:'Lo Triolet',citta:'Introd',regione:'Valle d\'Aosta'},
  {nome:'Priod Fabrizio',citta:'Issogne',regione:'Valle d\'Aosta'},
  {nome:'Cantine del Castello Conti',citta:'Maggiora',regione:'Piemonte'},
  {nome:'Conterno Cantine Nervi',citta:'Gattinara',regione:'Piemonte'},
  {nome:'Travaglini',citta:'Gattinara',regione:'Piemonte'},
  {nome:'Coutandin Daniele',citta:'Perosa Argentina',regione:'Piemonte'},
  {nome:'Gaja',citta:'Barbaresco',regione:'Piemonte'},
  {nome:'Giacosa Bruno',citta:'Neive',regione:'Piemonte'},
  {nome:'Bruno Rocca',citta:'Barbaresco',regione:'Piemonte'},
  {nome:'Tenuta Cisa Asinari dei Marchesi di Gresy',citta:'Barbaresco',regione:'Piemonte'},
  {nome:'Antica Casa Vinicola Scarpa',citta:'Nizza Monferrato',regione:'Piemonte'},
  {nome:'Castello di Neive',citta:'Neive',regione:'Piemonte'},
  {nome:'La Spinetta',citta:'Grinzane Cavour',regione:'Piemonte'},
  {nome:'Nada Fiorenzo',citta:'Treiso',regione:'Piemonte'},
  {nome:'Bartolo Mascarello',citta:'Barolo',regione:'Piemonte'},
  {nome:'E. Pira di Chiara Boschis',citta:'Barolo',regione:'Piemonte'},
  {nome:'Rinaldi Giuseppe',citta:'Barolo',regione:'Piemonte'},
  {nome:'Scavino Paolo',citta:'Castiglione Falletto',regione:'Piemonte'},
  {nome:'Elio Altare',citta:'La Morra',regione:'Piemonte'},
  {nome:'Bovio Gianfranco',citta:'La Morra',regione:'Piemonte'},
  {nome:'Eraldo Viberti',citta:'La Morra',regione:'Piemonte'},
  {nome:'Domenico Clerico',citta:'Monforte d\'Alba',regione:'Piemonte'},
  {nome:'Mauro Veglio',citta:'La Morra',regione:'Piemonte'},
  {nome:'Mascarello Giuseppe',citta:'Monchiero',regione:'Piemonte'},
  {nome:'Parusso',citta:'Monforte d\'Alba',regione:'Piemonte'},
  {nome:'Prunotto',citta:'Alba',regione:'Piemonte'},
  {nome:'Elvio Cogno',citta:'Novello',regione:'Piemonte'},
  {nome:'Manzone Paolo',citta:'Serralunga d\'Alba',regione:'Piemonte'},
  {nome:'Massolino',citta:'Serralunga d\'Alba',regione:'Piemonte'},
  {nome:'E.Pira di Chiara Boschis',citta:'Barolo',regione:'Piemonte'},
  {nome:'Conterno Giacomo',citta:'Monforte d\'Alba',regione:'Piemonte'},
  {nome:'Matteo Correggia',citta:'Canale',regione:'Piemonte'},
  {nome:'Marziano Abbona',citta:'Canale',regione:'Piemonte'},
  {nome:'Podere Rocche dei Manzoni',citta:'Monforte d\'Alba',regione:'Piemonte'},
  {nome:'Braida di G. Bologna',citta:'Rocchetta Tanaro',regione:'Piemonte'},
  {nome:'Poderi Aldo Conterno',citta:'Monforte d\'Alba',regione:'Piemonte'},
  {nome:'Coppo',citta:'Canelli',regione:'Piemonte'},
  {nome:'G.D. Vajra',citta:'Barolo',regione:'Piemonte'},
  {nome:'Accornero Giulio e Figli',citta:'Vignale Monferrato',regione:'Piemonte'},
  {nome:'Conte Vistarino - Tenuta Rocca de\' Giorgi',citta:'Pietra de\' Giorgi',regione:'Lombardia'},
  {nome:'Podere Il Santo',citta:'Rivanazzano',regione:'Lombardia'},
  {nome:'Rainoldi Aldo',citta:'Chiuro',regione:'Lombardia'},
  {nome:'Zadra Augusto',citta:'Revò',regione:'Trentino'},
  {nome:'Alois Lageder',citta:'Magrè',regione:'Alto Adige'},
  {nome:'Joseph Hofstätter',citta:'Montagna',regione:'Alto Adige'},
  {nome:'Giuseppe Quintarelli',citta:'Negran',regione:'Veneto'},
  {nome:'Secondo Marco',citta:'Fumane',regione:'Veneto'},
  {nome:'Dal Forno Romano',citta:'Cellore d\'Illasi',regione:'Veneto'},
  {nome:'Monte dei Ragni',citta:'Fumane',regione:'Veneto'},
  {nome:'Serafini & Vidotto',citta:'Nervesa della Battaglia',regione:'Veneto'},
  {nome:'Jermann',citta:'Dolegna del Collio',regione:'Friuli-Venezia Giulia'},
  {nome:'Felluga Livio',citta:'Cormons',regione:'Friuli-Venezia Giulia'},
  {nome:'Michele Moschioni',citta:'Cividiale del Friuli',regione:'Friuli-Venezia Giulia'},
  {nome:'Drei Donà - Tenuta La Palazza',citta:'Forlì',regione:'Emilia Romagna'},
  {nome:'Fattoria Zerbina',citta:'Faenza',regione:'Emilia Romagna'},
  {nome:'Casanova di Neri',citta:'Montalcino',regione:'Toscana'},
  {nome:'Casanova delle Cerbaie',citta:'Montalcino',regione:'Toscana'},
  {nome:'Ciacci Piccolomini d\'Aragona',citta:'Castelnuovo dell\'Abate',regione:'Toscana'},
  {nome:'Le Chiuse di Sotto di Gianni Brunelli',citta:'Montalcino',regione:'Toscana'},
  {nome:'Pieve Santa Restituita - Gaja',citta:'Montalcino',regione:'Toscana'},
  {nome:'Siro Pacenti',citta:'Montalcino',regione:'Toscana'},
  {nome:'San Polo - Allegrini',citta:'Montalcino',regione:'Toscana'},
  {nome:'Badia a Coltibuono',citta:'Gaiole in Chianti',regione:'Toscana'},
  {nome:'Barone Ricasoli',citta:'Gaiole in Chianti',regione:'Toscana'},
  {nome:'Campino',citta:'San Gimignano',regione:'Toscana'},
  {nome:'Castell\'in Villa',citta:'Castelnuovo Berardenga',regione:'Toscana'},
  {nome:'Castello di Ama',citta:'Gaiole in Chianti',regione:'Toscana'},
  {nome:'Ampeleia',citta:'Roccastrada',regione:'Toscana'},
  {nome:'Baracchi',citta:'Cortona',regione:'Toscana'},
  {nome:'Bindella',citta:'Montepulciano',regione:'Toscana'},
  {nome:'Isole e Olena',citta:'Barberino Val d\'Elsa',regione:'Toscana'},
  {nome:'Frescobaldi',citta:'Ponzano in Chianti',regione:'Toscana'},
  {nome:'Guido Gualandi',citta:'Movntespertoli',regione:'Toscana'},
  {nome:'Masseto',citta:'Bolgheri',regione:'Toscana'},
  {nome:'Il Borro',citta:'San Giustino Valdarno',regione:'Toscana'},
  {nome:'Le Terre Diverse',citta:'Colle di Val d\'Elsa',regione:'Toscana'},
  {nome:'Petra',citta:'Suvereto',regione:'Toscana'},
  {nome:'Terra di Casole - Paolo Caciorgna',citta:'Casole d\'Elsa',regione:'Toscana'},
  {nome:'Podere Concori',citta:'Gallicano',regione:'Toscana'},
  {nome:'Podere Grattamacco',citta:'Castagneto Carducci',regione:'Toscana'},
  {nome:'Poliziano',citta:'Montepulciano',regione:'Toscana'},
  {nome:'Tenuta di Valgiano',citta:'Capannori',regione:'Toscana'},
  {nome:'Ruffino',citta:'Pontassieve',regione:'Toscana'},
  {nome:'Tenuta San Guido',citta:'Bolgheri',regione:'Toscana'},
  {nome:'Oasi degli Angeli',citta:'Cupra Marittima',regione:'Marche'},
  {nome:'Umani Ronchi',citta:'Osimo',regione:'Marche'},
  {nome:'Lungarotti',citta:'Torgiano',regione:'Umbria'},
  {nome:'Paolo Bea',citta:'Montefalco',regione:'Umbria'},
  {nome:'Casale del Giglio',citta:'Le Ferriere',regione:'Lazio'},
  {nome:'Ottaviano Pasquale',citta:'Prezza',regione:'Abruzzo'},
  {nome:'Cianfagna',citta:'Acquaviva Collecroce',regione:'Molise'},
  {nome:'Luigi Tecce',citta:'Sessa Arunca',regione:'Campania'},
  {nome:'Mastroberardino',citta:'Atripalda',regione:'Campania'},
  {nome:'Nanni Copé',citta:'Vitulazio',regione:'Campania'},
  {nome:'Gianfranco Fino',citta:'Sava',regione:'Puglia'},
  {nome:'Masseria Cuturi',citta:'Manduria',regione:'Puglia'},
  {nome:'Enopolis Costa Viola',citta:'Scilla',regione:'Calabria'},
  {nome:'Luigi Viola',citta:'Saracena',regione:'Calabria'},
  {nome:'Sergio Arcuri',citta:'Cirò Marina',regione:'Calabria'},
  {nome:'Idda - Gaja e Graci',citta:'Biancavilla',regione:'Sicilia'},
  {nome:'I Vigneri di Salvo Foti',citta:'Randazzo',regione:'Sicilia'},
  {nome:'Argiolas',citta:'Serdiana',regione:'Sardegna'},
  {nome:'Giovanni Montisci',citta:'Mamoiada',regione:'Sardegna'},
  {nome:'Dettori',citta:'Sennori',regione:'Sardegna'},
  {nome:'Vini Biondi',citta:'Trecastvagni',regione:'Sicilia'},
  {nome:'Mesa',citta:'Sant\'Anna Arresi',regione:'Sardegna'},
  {nome:'Pane Vino',citta:'Nurri',regione:'Sardegna'},
  {nome:'Quartomoro',citta:'Arborea',regione:'Sardegna'},
  {nome:'Santadi',citta:'Santadi',regione:'Sardegna'},
  {nome:'Cerruti Ezio',citta:'Castiglione Tinella',regione:'Piemonte'},
  {nome:'Conterno Fantino',citta:'Serralunga d\'Alba',regione:'Piemonte'},
  {nome:'Forteto della Luja',citta:'Loazzolo',regione:'Piemonte'},
  {nome:'Saracco Paolo',citta:'Castiglione Tinella',regione:'Piemonte'},
  {nome:'Negri Nino',citta:'Chiuro',regione:'Lombardia'},
  {nome:'Tallarini',citta:'Gandosso',regione:'Lombardia'},
  {nome:'Anselmi Roberto',citta:'Monteforte d\'Alpone',regione:'Veneto'},
  {nome:'Maculan',citta:'Breganze',regione:'Veneto'},
  {nome:'Donatella Cinelli Colombini',citta:'Montalcino',regione:'Toscana'},
  {nome:'Bea Paolo',citta:'Montefalco',regione:'Umbria'},
  {nome:'Felsina',citta:'Castelnuovo Berardenga',regione:'Toscana'},
  {nome:'Castello della Sala di Antinori',citta:'Ficulle',regione:'Umbria'},
  {nome:'San Felice',citta:'Castelnuovo Berardenga',regione:'Toscana'},
  {nome:'Tenuta Giardini Arimei',citta:'Forio',regione:'Campania'},
  {nome:'Fino Gianfranco',citta:'Lama',regione:'Puglia'},
  {nome:'Donnafugata',citta:'Marsala',regione:'Sicilia'},
  {nome:'Cantine del Notaio',citta:'Rionero in Vulture',regione:'Basilicata'},
  {nome:'Viola Luigi',citta:'Saracena',regione:'Calabria'},
  {nome:'Columbu G.B.',citta:'Bosa',regione:'Sardegna'},
  {nome:'Murana Salvatore',citta:'Pantelleria',regione:'Sicilia'},
  {nome:'Viteadovest',citta:'Marsala',regione:'Sicilia'},
  {nome:'Chemin des Vignobles',citta:'Villeneuve',regione:'Valle d\'Aosta'},
  {nome:'Bellavista',citta:'Ebrusco',regione:'Lombardia'},
  {nome:'Marchesi Antinori - Tenuta Montesina',citta:'Calino',regione:'Lombardia'},
  {nome:'Venica',citta:'Dolegna del Collio',regione:'Friuli-Venezia Giulia'},
  {nome:'Malvirà',citta:'Canale',regione:'Piemonte'},
  {nome:'Capannelle',citta:'Gaiole in Chianti',regione:'Toscana'},
  {nome:'L\'Atoueyo',citta:'Aymavilles',regione:'Valle d\'Aosta'},
  {nome:'Caves Cooperatives de Donnas',citta:'Donnas',regione:'Valle d\'Aosta'},
  {nome:'Correggia Matteo',citta:'Canale',regione:'Piemonte'},
  {nome:'Germano Ettore',citta:'Serralunga d\'Alba',regione:'Piemonte'},
  {nome:'Tenuta dell\'Ornellaia',citta:'Bolgheri',regione:'Toscana'},
  {nome:'Antonelli San Marco',citta:'Montefalco',regione:'Umbria'},
  {nome:'AgriPunica',citta:'Santadi',regione:'Sardegna'},
  {nome:'Frescobaldi - Gorgona',citta:'Isola di Gorgona',regione:'Toscana'},
  {nome:'Planeta',citta:'Menfi',regione:'Sicilia'},
  {nome:'Abbona Marziano',citta:'Dogliani',regione:'Piemonte'},
  {nome:'Boglietti Enzo',citta:'La Morra',regione:'Piemonte'},
  {nome:'Pira Luigi',citta:'Serralunga d\'Alba',regione:'Piemonte'},
  {nome:'Paolo Scavino',citta:'Castiglione Falletto',regione:'Piemonte'},
  {nome:'Mascarello Bartolo',citta:'Barolo',regione:'Piemonte'},
  {nome:'Voerzio Roberto',citta:'La Morra',regione:'Piemonte'},
  {nome:'Travaglini Giancarlo',citta:'Gattinara',regione:'Piemonte'},
  {nome:'Boscarelli',citta:'Montepulciano',regione:'Toscana'},
  {nome:'Ca\' Marcanda di A. Gaja',citta:'Castagneto Carducci',regione:'Toscana'},
  {nome:'Campo alle Comete',citta:'Castagneto Carducci',regione:'Toscana'},
  {nome:'Ornellaia',citta:'Bolgheri',regione:'Toscana'},
  {nome:'Tenuta di Sesta',citta:'Castelnuovo dell\'Abate',regione:'Toscana'},
  {nome:'Tiezzi',citta:'Montalcino',regione:'Toscana'},
  {nome:'Tua Rita',citta:'Suvereto',regione:'Toscana'},
  {nome:'Château La Nerthe',citta:'Châteauneuf-du-Pape',regione:'Francia'},
  {nome:'Girolamo Russo',citta:'Castiglione di Sicilia',regione:'Sicilia'},
  {nome:'Le Plan - Famille Vermeersch',citta:'Suze-la-Rousse',regione:'Francia'},
  {nome:'Pietradolce',citta:'Solicchiata',regione:'Sicilia'},
  {nome:'Couly - Dutheil',citta:'Chinon',regione:'Francia'},
];
