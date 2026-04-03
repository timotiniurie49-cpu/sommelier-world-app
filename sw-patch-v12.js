/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SOMMELIER WORLD · PATCH v12                                    ║
 * ║                                                                  ║
 * ║  ✓ Terroir redesign: selettore Paese → Regione → Denominazione ║
 * ║    Pulito, mobile-friendly, non ingombrante                     ║
 * ║  ✓ Blog/Magazine: legge articles.json — aggiungi/togli         ║
 * ║    articoli direttamente da GitHub senza toccare il codice      ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * Installazione in index.html:
 *   <script src="sw-patch-v6.js"></script>
 *   <script src="sw-patch-v9.js"></script>
 *   <script src="sw-patch-v10.js"></script>
 *   <script src="sw-patch-v11.js"></script>
 *   <script src="sw-patch-v12.js"></script>
 */

(function () {
  'use strict';

  var SERVER = window._SW_SERVER ||
    'https://sommelier-server-production-8f92.up.railway.app';

  /* ═══════════════════════════════════════════════════════
     DATABASE TERROIR — Paese → Regioni → Denominazioni
     Per aggiungere un paese/regione: aggiungi qui
     ═══════════════════════════════════════════════════════ */
  var TERROIR_DB = {

    '🇮🇹 Italia': {
      'Piemonte': {
        info: 'La Borgogna italiana. 17 DOCG, Nebbiolo sovrano nelle Langhe.',
        img: 'https://images.pexels.com/photos/4113579/pexels-photo-4113579.jpeg?auto=compress&cs=tinysrgb&w=600',
        dens: [
          { n:'Barolo DOCG', u:'Nebbiolo', d:'Re dei vini. Tannini monumentali, invecchia 30-50 anni. La Morra, Serralunga, Barolo le zone principali. Giacomo Conterno, Gaja, Mascarello.' },
          { n:'Barbaresco DOCG', u:'Nebbiolo', d:'La Regina: più elegante del Barolo. MGA: Asili, Rabajà, Martinenga. Gaja, Bruno Giacosa, Produttori del Barbaresco.' },
          { n:'Barbera d\'Asti DOCG', u:'Barbera', d:'Ciliegia vivace, acidità croccante. La sottozona Nizza DOCG è il vertice. Braida, Coppo.' },
          { n:'Gavi DOCG', u:'Cortese', d:'Bianco elegante di Alessandria. Mandorla, agrumi, fiori bianchi. La Scolca, Villa Sparina.' },
          { n:'Moscato d\'Asti DOCG', u:'Moscato Bianco', d:'Dolce frizzante. Pesca, albicocca, fiori d\'acacia. 5,5% alcol. Ceretto, La Spinetta.' },
          { n:'Alta Langa DOCG', u:'Pinot Nero, Chardonnay', d:'Metodo Classico piemontese. Freschezza alpina. Contratto, Enrico Serafino.' },
          { n:'Asti DOCG', u:'Moscato Bianco', d:'Spumante dolce celebre nel mondo. Martini, Cinzano, Gancia.' },
          { n:'Brachetto d\'Acqui DOCG', u:'Brachetto', d:'Dolce rosato frizzante. Rosa, fragola, lampone. Braida.' },
          { n:'Dogliani DOCG', u:'Dolcetto', d:'Prugna, ciliegia nera, mandorla amara. Tannini secchi. Einaudi, Abbona.' },
          { n:'Ruché di Castagnole Monferrato DOCG', u:'Ruché', d:'Il più profumato del Piemonte. Rosa selvatica, geranio. Montalbera.' },
          { n:'Roero DOCG', u:'Nebbiolo, Arneis', d:'Riva sinistra del Tanaro. L\'Arneis bianco è la gemma locale. Matteo Correggia.' },
          { n:'Gattinara DOCG', u:'Nebbiolo (Spanna)', d:'Porfido vulcanico. Nebbiolo austero e minerale. Travaglini, Antoniolo.' },
          { n:'Langhe DOC', u:'Plurivitigno', d:'DOC ombrello delle Langhe. Base per molti grandi Nebbiolo d\'Alba.' },
          { n:'Colli Tortonesi DOC', u:'Timorasso, Barbera', d:'Casa del Timorasso (Derthona). Bianco longevo e minerale. Walter Massa.' },
        ]
      },
      'Toscana': {
        info: '11 DOCG. Sangiovese è il re: da Firenze a Montalcino, da Bolgheri alla Maremma.',
        img: 'https://images.pexels.com/photos/442116/pexels-photo-442116.jpeg?auto=compress&cs=tinysrgb&w=600',
        dens: [
          { n:'Brunello di Montalcino DOCG', u:'Sangiovese Grosso', d:'Il vino italiano più longevo. 50+ anni. Biondi-Santi, Soldera, Poggio di Sotto.' },
          { n:'Chianti Classico DOCG', u:'Sangiovese', d:'Gallo Nero tra Firenze e Siena. Gran Selezione il vertice. Antinori, Fèlsina, Isole e Olena.' },
          { n:'Chianti DOCG', u:'Sangiovese', d:'7 sottozone. Rufina la più longeva. Frescobaldi, Selvapiana.' },
          { n:'Vino Nobile di Montepulciano DOCG', u:'Prugnolo Gentile', d:'Citato dall\'800 d.C. Avignonesi, Poliziano, Boscarelli.' },
          { n:'Morellino di Scansano DOCG', u:'Sangiovese', d:'Maremma toscana. Tannini rotondi, bevibilità. Moris Farms, Rocca di Frassinello.' },
          { n:'Vernaccia di San Gimignano DOCG', u:'Vernaccia', d:'Prima DOC italiana (1966). Mandorla amara. Teruzzi, Panizzi.' },
          { n:'Carmignano DOCG', u:'Sangiovese, Cabernet', d:'Primo Cabernet in Italia. Villa di Capezzana.' },
          { n:'Bolgheri DOC', u:'Cabernet Sauvignon, Merlot', d:'I Supertuscan: Sassicaia, Ornellaia, Masseto.' },
          { n:'Rosso di Montalcino DOC', u:'Sangiovese', d:'Il Brunello giovane. Stesso territorio, affinamento più breve.' },
        ]
      },
      'Veneto': {
        info: 'Prima regione per volume. Dal Lago di Garda alle Dolomiti.',
        img: 'https://images.pexels.com/photos/2702805/pexels-photo-2702805.jpeg?auto=compress&cs=tinysrgb&w=600',
        dens: [
          { n:'Amarone della Valpolicella DOCG', u:'Corvina, Corvinone', d:'Appassimento 90-120 giorni. 15-17% alcol. Quintarelli, Dal Forno, Masi.' },
          { n:'Prosecco Superiore DOCG', u:'Glera', d:'Colline UNESCO 2019. Cartizze il cru assoluto. Bisol, Nino Franco.' },
          { n:'Soave Superiore DOCG', u:'Garganega', d:'Basalto vulcanico. Mandorla, fiori bianchi. Pieropan, Gini.' },
          { n:'Valpolicella Ripasso DOC', u:'Corvina', d:'Ripasso sulle vinacce dell\'Amarone. Struttura e complessità. Masi Campofiorin.' },
          { n:'Recioto della Valpolicella DOCG', u:'Corvina', d:'Vino dolce da appassimento. Cioccolato, prugna.' },
          { n:'Bardolino DOC', u:'Corvina, Rondinella', d:'Leggero, fresco. Chiaretto tra i migliori rosati. Guerrieri Rizzardi.' },
        ]
      },
      'Campania': {
        info: 'La Magna Grecia del vino. 4 DOCG irpine di assoluta eccellenza.',
        img: 'https://images.pexels.com/photos/1470171/pexels-photo-1470171.jpeg?auto=compress&cs=tinysrgb&w=600',
        dens: [
          { n:'Taurasi DOCG', u:'Aglianico', d:'Il Barolo del Sud. 400-700m, suoli vulcanici. Mastroberardino, Feudi di San Gregorio.' },
          { n:'Fiano di Avellino DOCG', u:'Fiano', d:'Miele, noce, pera Williams. Longevo 10+ anni. Ciro Picariello.' },
          { n:'Greco di Tufo DOCG', u:'Greco', d:'Mineralità sulfurea unica. Pesca bianca, idrocarburi. Benito Ferrara.' },
          { n:'Falanghina del Sannio DOC', u:'Falanghina', d:'Fresco e floreale. Frutto tropicale, agrumi. Mustilli.' },
        ]
      },
      'Sicilia': {
        info: 'Il vulcano, il sale africano, il sole. L\'Etna come nuova Borgogna.',
        img: 'https://images.pexels.com/photos/3532658/pexels-photo-3532658.jpeg?auto=compress&cs=tinysrgb&w=600',
        dens: [
          { n:'Etna DOC', u:'Nerello Mascalese, Carricante', d:'133 contrade vulcaniche. Cornelissen, Passopisciaro, Benanti, Terre Nere.' },
          { n:'Cerasuolo di Vittoria DOCG', u:'Nero d\'Avola, Frappato', d:'Unica DOCG siciliana. COS, Valle dell\'Acate.' },
          { n:'Passito di Pantelleria DOC', u:'Zibibbo', d:'Alberello pantesco UNESCO. Miele d\'arancio, fico. Ben\'Ryé di Donnafugata.' },
          { n:'Marsala DOC', u:'Grillo, Catarratto', d:'Vino liquoroso con sistema Solera. Florio, Pellegrino.' },
        ]
      },
      'Sardegna': {
        info: 'Cannonau longevo, Vermentino sapido su granito, Carignano centenario.',
        img: 'https://images.pexels.com/photos/442116/pexels-photo-442116.jpeg?auto=compress&cs=tinysrgb&w=600',
        dens: [
          { n:'Vermentino di Gallura DOCG', u:'Vermentino', d:'Unica DOCG sarda bianca. Graniti paleozoici. Capichera, Surrau.' },
          { n:'Cannonau di Sardegna DOC', u:'Cannonau (Grenache)', d:'Viti centenarie di Mamoiada. Giuseppe Sedilesu.' },
          { n:'Carignano del Sulcis DOC', u:'Carignano', d:'Alberello su sabbia pre-fillossera. Santadi "Terre Brune".' },
        ]
      },
      'Puglia': {
        info: 'Il tacco dello stivale. Primitivo e Negroamaro su terre rosse ferriche.',
        img: 'https://images.pexels.com/photos/442116/pexels-photo-442116.jpeg?auto=compress&cs=tinysrgb&w=600',
        dens: [
          { n:'Primitivo di Manduria DOC', u:'Primitivo (= Zinfandel)', d:'14-17% alcol. Gianfranco Fino "Es" il riferimento assoluto.' },
          { n:'Primitivo di Manduria Dolce Naturale DOCG', u:'Primitivo', d:'Passito straordinario. Prugna, fico, cioccolato fondente.' },
          { n:'Salice Salentino DOC', u:'Negroamaro', d:'Mora, prugna, tabacco. Taurino, Leone de Castris.' },
        ]
      },
      'Toscana — Maremma': {
        info: 'La costa toscana selvaggia tra Grosseto e il Tirreno.',
        img: 'https://images.pexels.com/photos/442116/pexels-photo-442116.jpeg?auto=compress&cs=tinysrgb&w=600',
        dens: [
          { n:'Maremma Toscana DOC', u:'Sangiovese, Vermentino, Syrah', d:'Terroir selvaggio. Rocca di Frassinello, Sassotondo.' },
          { n:'Montecucco Sangiovese DOCG', u:'Sangiovese', d:'Tra Montalcino e la costa. Collemassari, Basile.' },
        ]
      },
      'Lombardia': {
        info: '5 DOCG. Dalla Franciacorta alla Valtellina verticale.',
        img: 'https://images.pexels.com/photos/2702805/pexels-photo-2702805.jpeg?auto=compress&cs=tinysrgb&w=600',
        dens: [
          { n:'Franciacorta DOCG', u:'Chardonnay, Pinot Nero', d:'Metodo Classico italiano di eccellenza. Ca\' del Bosco, Bellavista.' },
          { n:'Valtellina Superiore DOCG', u:'Nebbiolo (Chiavennasca)', d:'Terrazzamenti verticali su granito. Sassella, Grumello, Inferno. Nino Negri, Arpepe.' },
          { n:'Lugana DOC', u:'Turbiana', d:'Riva sud del Lago di Garda. Ca\' dei Frati, Zenato.' },
        ]
      },
      'Friuli-Venezia Giulia': {
        info: 'La capitale italiana del vino bianco. I vini orange di Gravner e Radikon.',
        img: 'https://images.pexels.com/photos/2702805/pexels-photo-2702805.jpeg?auto=compress&cs=tinysrgb&w=600',
        dens: [
          { n:'Collio DOC', u:'Ribolla Gialla, Friulano', d:'Flysch di Cormons. Gravner, Radikon, Schiopetto.' },
          { n:'Ramandolo DOCG', u:'Verduzzo Friulano', d:'Passito dolce rarissimo. Giovanni Dri.' },
        ]
      },
      'Trentino-Alto Adige': {
        info: 'Dolomiti UNESCO. Ferrari, Teroldego, Gewürztraminer di Tramin.',
        img: 'https://images.pexels.com/photos/1579367/pexels-photo-1579367.jpeg?auto=compress&cs=tinysrgb&w=600',
        dens: [
          { n:'Trento DOC', u:'Chardonnay, Pinot Nero', d:'Metodo Classico alpino. Ferrari, Rotari.' },
          { n:'Teroldego Rotaliano DOC', u:'Teroldego', d:'Campo Rotaliano unico al mondo. Foradori, Mezzacorona.' },
          { n:'Alto Adige DOC', u:'Lagrein, Gewürztraminer, Pinot Grigio', d:'21 sottozone. Cantina Terlano. Alois Lageder.' },
        ]
      },
    },

    '🇫🇷 Francia': {
      'Borgogna': {
        info: 'I vini più costosi e copiati del mondo. Pinot Nero e Chardonnay su calcare.',
        img: 'https://images.pexels.com/photos/3741248/pexels-photo-3741248.jpeg?auto=compress&cs=tinysrgb&w=600',
        dens: [
          { n:'Gevrey-Chambertin AOC', u:'Pinot Noir', d:'9 Grand Crus. Il vino di Napoleone. Rousseau, Mortet, Drouhin.' },
          { n:'Vosne-Romanée AOC', u:'Pinot Noir', d:'La comune dei Grand Crus. Romanée-Conti, La Tâche, Richebourg. DRC.' },
          { n:'Chambolle-Musigny AOC', u:'Pinot Noir', d:'Il più femminile. Musigny Grand Cru. de Vogüé, Mugnier.' },
          { n:'Puligny-Montrachet AOC', u:'Chardonnay', d:'Capitale del Chardonnay bianco. Montrachet Grand Cru. Leflaive, Carillon.' },
          { n:'Meursault AOC', u:'Chardonnay', d:'Perrières, Genevrières, Charmes. Coche-Dury, Lafon.' },
          { n:'Chablis AOC', u:'Chardonnay', d:'Kimmeridgiano, mineralità pura. 7 Grand Crus. Raveneau, Dauvissat.' },
          { n:'Pommard AOC', u:'Pinot Noir', d:'Potente e strutturato. Argille pesanti. Mugnier, Billard-Gonnet.' },
          { n:'Volnay AOC', u:'Pinot Noir', d:'Eleganza femminile. Caillerets, Champans. Marquis d\'Angerville.' },
        ]
      },
      'Bordeaux': {
        info: 'Il sistema dei Grands Crus Classés. Cabernet Sauvignon e Merlot su ghiaie.',
        img: 'https://images.pexels.com/photos/2702805/pexels-photo-2702805.jpeg?auto=compress&cs=tinysrgb&w=600',
        dens: [
          { n:'Pauillac AOC', u:'Cabernet Sauvignon', d:'3 Premier GCC: Latour, Lafite-Rothschild, Mouton. Gravel profondo.' },
          { n:'Margaux AOC', u:'Cabernet Sauvignon', d:'Eleganza assoluta. Château Margaux Premier GCC.' },
          { n:'Saint-Émilion Grand Cru AOC', u:'Merlot, Cabernet Franc', d:'Cheval Blanc, Ausone, Pétrus (Pomerol). Côtes calcaree.' },
          { n:'Pomerol AOC', u:'Merlot', d:'Argilla blu di Pétrus. Le Pin. Il Merlot più costoso del mondo.' },
          { n:'Sauternes AOC', u:'Sémillon', d:'Botrytis cinerea. Château d\'Yquem Premier Cru Supérieur. Miele e zafferano.' },
          { n:'Saint-Julien AOC', u:'Cabernet Sauvignon', d:'11 GCC. Léoville Las Cases, Ducru-Beaucaillou.' },
        ]
      },
      'Champagne': {
        info: 'Suoli cretacei unici. Il metodo tradizionale per eccellenza.',
        img: 'https://images.pexels.com/photos/1579367/pexels-photo-1579367.jpeg?auto=compress&cs=tinysrgb&w=600',
        dens: [
          { n:'Champagne AOC', u:'Pinot Noir, Chardonnay, Meunier', d:'Krug, Dom Pérignon, Bollinger, Salon, Egly-Ouriet.' },
          { n:'Blanc de Blancs', u:'Chardonnay', d:'Solo Chardonnay. Côte des Blancs. Salon, Delamotte, Billecart-Salmon.' },
          { n:'Blanc de Noirs', u:'Pinot Noir, Meunier', d:'Da uve nere. Montagne de Reims. Egly-Ouriet, Benoit Lahaye.' },
        ]
      },
      'Rodano': {
        info: 'Syrah al nord, Grenache al sud. Da Côte-Rôtie a Châteauneuf-du-Pape.',
        img: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=600',
        dens: [
          { n:'Côte-Rôtie AOC', u:'Syrah, Viognier', d:'Côte Brune e Côte Blonde. Guigal La La La. Vino culto.' },
          { n:'Hermitage AOC', u:'Syrah, Marsanne', d:'Collina sacra del Rodano settentrionale. Chave, Jaboulet La Chapelle.' },
          { n:'Châteauneuf-du-Pape AOC', u:'Grenache, Syrah, Mourvèdre', d:'Galets roulés. 13 vitigni. Rayas, Bonneau, Beaucastel.' },
          { n:'Condrieu AOC', u:'Viognier', d:'Viognier al massimo. Solo 135 ha su granito. Guigal, Vernay.' },
        ]
      },
      'Alsazia': {
        info: 'Stile tedesco, territorio francese. 51 Grand Crus. Vini secchi e Vendange Tardive.',
        img: 'https://images.pexels.com/photos/442116/pexels-photo-442116.jpeg?auto=compress&cs=tinysrgb&w=600',
        dens: [
          { n:'Alsace Riesling Grand Cru AOC', u:'Riesling', d:'Schlossberg, Rangen. Trimbach, Weinbach, Zind-Humbrecht.' },
          { n:'Alsace Gewurztraminer AOC', u:'Gewürztraminer', d:'Rosa, litchi, spezie orientali. Vendange Tardive eccezionale.' },
          { n:'Alsace Pinot Gris AOC', u:'Pinot Gris', d:'Struttura e opulenza. Fumo, miele, spezie.' },
        ]
      },
      'Loira': {
        info: 'Sauvignon Blanc, Chenin Blanc, Cabernet Franc. Diversità assoluta.',
        img: 'https://images.pexels.com/photos/442116/pexels-photo-442116.jpeg?auto=compress&cs=tinysrgb&w=600',
        dens: [
          { n:'Sancerre AOC', u:'Sauvignon Blanc', d:'Silex, terres blanches. Vacheron, Henri Bourgeois, Dagueneau.' },
          { n:'Pouilly-Fumé AOC', u:'Sauvignon Blanc', d:'Silex sulla riva destra della Loire. Dagueneau Silex.' },
          { n:'Vouvray AOC', u:'Chenin Blanc', d:'Sec, Demi-sec, Moelleux. Huet, Foreau. Longevo 30+ anni.' },
          { n:'Chinon AOC', u:'Cabernet Franc', d:'Tuffeau e gravel. Elegant Cabernet Franc. Joguet, Baudry.' },
        ]
      },
    },

    '🇪🇸 Spagna': {
      'La Rioja': {
        info: 'Prima DOCa di Spagna. Tempranillo con classifica Crianza/Reserva/Gran Reserva.',
        img: 'https://images.pexels.com/photos/442116/pexels-photo-442116.jpeg?auto=compress&cs=tinysrgb&w=600',
        dens: [
          { n:'Rioja DOCa', u:'Tempranillo, Garnacha', d:'Rioja Alta (la migliore), Alavesa, Oriental. Muga, López de Heredia, CVNE.' },
          { n:'Rioja Alta Gran Reserva', u:'Tempranillo', d:'Minimo 5 anni affinamento. Muga Prado Enea, La Rioja Alta 904.' },
        ]
      },
      'Catalogna': {
        info: 'Priorat come Borgogna spagnola. Cava per il Metodo Classico.',
        img: 'https://images.pexels.com/photos/2702805/pexels-photo-2702805.jpeg?auto=compress&cs=tinysrgb&w=600',
        dens: [
          { n:'Priorat DOCa', u:'Garnacha, Cariñena', d:'Llicorella nera. Álvaro Palacios L\'Ermita, Clos Mogador.' },
          { n:'Cava DO', u:'Macabeo, Xarel-lo, Parellada', d:'Metodo Classico spagnolo. Recaredo, Agustí Torelló.' },
          { n:'Montsant DO', u:'Garnacha, Cariñena', d:'Circonda il Priorat. Simile, prezzi più bassi. Acústic.' },
        ]
      },
      'Castiglia e León': {
        info: 'Ribera del Duero contro Rioja. La grande rivalità spagnola.',
        img: 'https://images.pexels.com/photos/442116/pexels-photo-442116.jpeg?auto=compress&cs=tinysrgb&w=600',
        dens: [
          { n:'Ribera del Duero DO', u:'Tinto Fino (Tempranillo)', d:'Meseta 800-900m. Vega Sicilia Único, Pingus, Pesquera.' },
          { n:'Rueda DO', u:'Verdejo', d:'Bianco fresco e aromatico. Belondrade, Naia.' },
          { n:'Toro DO', u:'Tinta de Toro', d:'Sabbie anti-fillossera. Numanthia, Pintia.' },
        ]
      },
      'Galizia': {
        info: 'Costa atlantica. Albariño minerale, Godello strutturato.',
        img: 'https://images.pexels.com/photos/442116/pexels-photo-442116.jpeg?auto=compress&cs=tinysrgb&w=600',
        dens: [
          { n:'Rías Baixas DO', u:'Albariño', d:'Granito costiero, salinità atlantica. Pazo de Señorans, Mar de Frades.' },
          { n:'Valdeorras DO', u:'Godello', d:'La risposta galiziana al Riesling. Schisto ardesia. Guitián, Rafael Palacios.' },
        ]
      },
    },

    '🇩🇪 Germania': {
      'Mosella': {
        info: 'Ardesia blu devoniana. Riesling più longevo al mondo.',
        img: 'https://images.pexels.com/photos/4113579/pexels-photo-4113579.jpeg?auto=compress&cs=tinysrgb&w=600',
        dens: [
          { n:'Mosel QmP', u:'Riesling', d:'Steinfeder, Federspiel, Smaragd come classificazione. Egon Müller, JJ Prüm, Loosen.' },
          { n:'Scharzhofberg', u:'Riesling', d:'Il vigneto più famoso della Mosella. Egon Müller. TBA rari come oro.' },
          { n:'Wehlener Sonnenuhr', u:'Riesling', d:'La meridiana scolpita. JJ Prüm. Riesling Spätlese e Auslese eccezionali.' },
        ]
      },
      'Rheingau': {
        info: 'Versante sud sul Reno. Riesling nobile e Spätburgunder emergente.',
        img: 'https://images.pexels.com/photos/442116/pexels-photo-442116.jpeg?auto=compress&cs=tinysrgb&w=600',
        dens: [
          { n:'Rheingau QmP', u:'Riesling, Spätburgunder', d:'Schloss Johannisberg, Robert Weil. Riesling Kabinett e Spätlese classici.' },
        ]
      },
    },

    '🇵🇹 Portogallo': {
      'Douro': {
        info: 'Scisto verticale sul Douro. Porto e grandi vini da tavola.',
        img: 'https://images.pexels.com/photos/1470171/pexels-photo-1470171.jpeg?auto=compress&cs=tinysrgb&w=600',
        dens: [
          { n:'Porto DOC', u:'Touriga Nacional, Tinta Roriz', d:'Vintage, LBV, Tawny. Taylor\'s, Fonseca, Quinta do Noval Nacional.' },
          { n:'Douro DOC', u:'Touriga Nacional, Touriga Franca', d:'Barca Velha (il Sassicaia portoghese). Niepoort, Ramos Pinto.' },
        ]
      },
      'Vinho Verde': {
        info: 'Pergole tra Minho e Douro. Fresco, leggero, frizzante naturale.',
        img: 'https://images.pexels.com/photos/442116/pexels-photo-442116.jpeg?auto=compress&cs=tinysrgb&w=600',
        dens: [
          { n:'Vinho Verde DOC', u:'Alvarinho, Loureiro', d:'Monção e Melgaço per l\'Alvarinho migliore. Soalheiro, Anselmo Mendes.' },
        ]
      },
    },

    '🇦🇷 Argentina': {
      'Mendoza': {
        info: 'Ande a 900-1500m. Malbec identitario mondiale.',
        img: 'https://images.pexels.com/photos/442116/pexels-photo-442116.jpeg?auto=compress&cs=tinysrgb&w=600',
        dens: [
          { n:'Valle de Uco', u:'Malbec, Cabernet Franc', d:'1000-1500m. Fresco e minerale. Clos de los Siete, Zuccardi Concreto.' },
          { n:'Luján de Cuyo DOC', u:'Malbec', d:'Primo DOC argentino. 900-1100m su ghiaie. Achaval Ferrer Finca Bella Vista.' },
          { n:'Mendoza DOC', u:'Malbec, Torrontés', d:'Catena Zapata, Achaval Ferrer, Zuccardi Valle de Uco.' },
        ]
      },
    },

    '🇦🇺 Australia': {
      'South Australia': {
        info: 'Barossa Valley per Shiraz centenario. McLaren Vale, Clare Valley.',
        img: 'https://images.pexels.com/photos/1470171/pexels-photo-1470171.jpeg?auto=compress&cs=tinysrgb&w=600',
        dens: [
          { n:'Barossa Valley GI', u:'Shiraz, Grenache', d:'Shiraz centenario su terra rossa. Penfolds Grange, Henschke Hill of Grace.' },
          { n:'McLaren Vale GI', u:'Shiraz, Grenache', d:'d\'Arenberg, Wirra Wirra, Clarendon Hills.' },
          { n:'Clare Valley GI', u:'Riesling', d:'Riesling invecchia 20+ anni. Jim Barry, Grosset.' },
        ]
      },
    },

  };

  /* ═══════════════════════════════════════════════════════
     CSS v12
     ═══════════════════════════════════════════════════════ */
  function css12() {
    if (document.querySelector('#sw12-css')) return;
    var s = document.createElement('style');
    s.id = 'sw12-css';
    s.textContent = [

      /* ─ Terroir Explorer ─ */
      '#sw12-terroir{background:#0A0705;min-height:100%;}',

      /* Step header */
      '.sw12-step-hdr{',
        'padding:14px 14px 8px;',
        'font-size:8px;font-weight:700;letter-spacing:3px;',
        'text-transform:uppercase;color:rgba(212,175,55,.45);}',

      /* Paese grid */
      '#sw12-countries{',
        'display:grid;',
        'grid-template-columns:repeat(auto-fill,minmax(140px,1fr));',
        'gap:8px;padding:0 12px 16px;}',
      '.sw12-country-btn{',
        'display:flex;align-items:center;gap:8px;',
        'padding:10px 12px;',
        'background:rgba(255,255,255,.04);',
        'border:1px solid rgba(212,175,55,.15);',
        'border-radius:8px;cursor:pointer;',
        'transition:all .2s;',
        'font-size:13px;color:#F5EFE2;}',
      '.sw12-country-btn:hover,.sw12-country-btn.sw12-active{',
        'background:rgba(212,175,55,.12);',
        'border-color:rgba(212,175,55,.45);}',

      /* Regioni pills */
      '#sw12-regions{',
        'display:flex;flex-wrap:wrap;gap:6px;',
        'padding:0 12px 16px;',
        'animation:sw12fi .25s ease;}',
      '.sw12-region-btn{',
        'padding:7px 14px;',
        'background:rgba(255,255,255,.04);',
        'border:1px solid rgba(212,175,55,.2);',
        'border-radius:20px;cursor:pointer;',
        'font-size:11px;font-weight:700;',
        'letter-spacing:1.5px;text-transform:uppercase;',
        'color:rgba(212,175,55,.6);',
        'white-space:nowrap;transition:all .2s;}',
      '.sw12-region-btn:hover,.sw12-region-btn.sw12-active{',
        'background:rgba(212,175,55,.15);',
        'border-color:#D4AF37;color:#D4AF37;}',

      /* Regione card (immagine + info) */
      '#sw12-region-card{',
        'margin:0 12px 16px;border-radius:10px;overflow:hidden;',
        'border:1px solid rgba(212,175,55,.2);',
        'animation:sw12fi .25s ease;}',
      '#sw12-rc-img{',
        'width:100%;height:120px;object-fit:cover;',
        'filter:brightness(.6) saturate(1.2);display:block;}',
      '#sw12-rc-info{',
        'padding:12px 14px;',
        'background:linear-gradient(135deg,rgba(74,4,4,.2),transparent);}',
      '#sw12-rc-name{',
        'font-family:"Playfair Display",Georgia,serif;',
        'font-size:1rem;font-weight:700;color:#F5EFE2;margin-bottom:4px;}',
      '#sw12-rc-desc{',
        'font-size:11px;color:rgba(245,239,226,.5);',
        'font-style:italic;line-height:1.6;}',

      /* Lista denominazioni */
      '#sw12-dens{',
        'margin:0 12px 20px;',
        'animation:sw12fi .25s ease;}',
      '.sw12-den-item{',
        'padding:10px 12px;',
        'border-bottom:1px solid rgba(212,175,55,.08);',
        'cursor:pointer;transition:background .18s;',
        'border-radius:6px;margin-bottom:2px;}',
      '.sw12-den-item:hover,.sw12-den-item.sw12-open{',
        'background:rgba(212,175,55,.06);}',
      '.sw12-den-top{',
        'display:flex;align-items:center;gap:8px;}',
      '.sw12-den-nome{',
        'font-size:13px;font-weight:600;color:#F5EFE2;flex:1;}',
      '.sw12-den-uva{',
        'font-size:10px;color:#D4AF37;',
        'background:rgba(212,175,55,.1);',
        'border:1px solid rgba(212,175,55,.2);',
        'border-radius:4px;padding:2px 7px;',
        'flex-shrink:0;white-space:nowrap;}',
      '.sw12-den-arrow{color:rgba(212,175,55,.3);font-size:12px;}',
      '.sw12-den-desc{',
        'font-size:12px;color:rgba(245,239,226,.55);',
        'line-height:1.65;padding-top:8px;',
        'font-style:italic;display:none;}',
      '.sw12-den-item.sw12-open .sw12-den-desc{display:block;}',
      '.sw12-den-item.sw12-open .sw12-den-arrow{transform:rotate(90deg);}',
      '.sw12-den-arrow{transition:transform .2s;}',

      /* Breadcrumb */
      '#sw12-breadcrumb{',
        'display:flex;align-items:center;gap:6px;',
        'padding:10px 14px;',
        'font-size:10px;color:rgba(212,175,55,.4);',
        'letter-spacing:.5px;}',
      '.sw12-bc-item{cursor:pointer;transition:color .2s;}',
      '.sw12-bc-item:hover{color:#D4AF37;}',
      '.sw12-bc-sep{color:rgba(212,175,55,.25);}',

      /* ─ Blog Magazine ─ */
      '#sw12-blog{background:#0A0705;}',
      '.sw12-blog-hdr{',
        'padding:20px 14px 14px;',
        'border-top:1px solid rgba(212,175,55,.1);}',
      '.sw12-blog-tag{',
        'font-size:8px;font-weight:700;letter-spacing:3px;',
        'text-transform:uppercase;color:rgba(212,175,55,.45);margin-bottom:5px;}',
      '.sw12-blog-title{',
        'font-family:"Playfair Display",Georgia,serif;',
        'font-size:1.1rem;font-weight:700;color:#F5EFE2;}',

      '.sw12-article-card{',
        'margin:0 12px 12px;border-radius:10px;overflow:hidden;',
        'border:1px solid rgba(212,175,55,.14);',
        'cursor:pointer;transition:all .25s;}',
      '.sw12-article-card:hover{',
        'border-color:rgba(212,175,55,.4);',
        'transform:translateY(-2px);}',
      '.sw12-art-img{',
        'width:100%;height:150px;object-fit:cover;',
        'filter:brightness(.6) saturate(1.2);display:block;}',
      '.sw12-art-body{',
        'padding:14px;',
        'background:linear-gradient(135deg,rgba(74,4,4,.15),transparent);}',
      '.sw12-art-cat{',
        'font-size:8px;font-weight:700;letter-spacing:2.5px;',
        'text-transform:uppercase;color:#D4AF37;margin-bottom:6px;}',
      '.sw12-art-title{',
        'font-family:"Playfair Display",Georgia,serif;',
        'font-size:.95rem;font-weight:700;color:#F5EFE2;',
        'line-height:1.3;margin-bottom:5px;}',
      '.sw12-art-meta{',
        'font-size:10px;color:rgba(245,239,226,.35);',
        'letter-spacing:.5px;}',

      /* Modal articolo */
      '#sw12-art-modal{',
        'display:none;position:fixed;inset:0;z-index:999985;',
        'background:#0A0705;overflow-y:auto;',
        'animation:sw12fi .3s ease;}',
      '#sw12-am-back{',
        'position:sticky;top:0;z-index:2;',
        'background:rgba(10,7,5,.97);backdrop-filter:blur(12px);',
        'padding:12px 14px;',
        'display:flex;align-items:center;gap:10px;',
        'border-bottom:1px solid rgba(212,175,55,.12);}',
      '#sw12-am-back-btn{',
        'width:34px;height:34px;border-radius:50%;',
        'background:rgba(212,175,55,.1);',
        'border:1px solid rgba(212,175,55,.25);',
        'color:#D4AF37;font-size:16px;cursor:pointer;',
        'display:flex;align-items:center;justify-content:center;}',
      '#sw12-am-cat{',
        'font-size:8px;font-weight:700;letter-spacing:2px;',
        'text-transform:uppercase;color:rgba(212,175,55,.5);}',
      '#sw12-am-img{',
        'width:100%;height:clamp(180px,45vw,320px);',
        'object-fit:cover;display:block;',
        'filter:brightness(.7) saturate(1.2);}',
      '#sw12-am-body{padding:20px 16px 50px;max-width:680px;margin:0 auto;}',
      '#sw12-am-title{',
        'font-family:"Playfair Display",Georgia,serif;',
        'font-size:clamp(1.3rem,5vw,1.8rem);',
        'font-weight:700;color:#F5EFE2;',
        'line-height:1.3;margin-bottom:10px;}',
      '#sw12-am-meta{',
        'font-size:11px;color:rgba(212,175,55,.45);',
        'letter-spacing:.5px;margin-bottom:18px;',
        'padding-bottom:16px;border-bottom:1px solid rgba(212,175,55,.12);}',
      '#sw12-am-text{',
        'font-size:15px;color:rgba(245,239,226,.78);',
        'line-height:1.9;white-space:pre-line;}',

      '@keyframes sw12fi{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}',

    ].join('');
    document.head.appendChild(s);
  }


  /* ═══════════════════════════════════════════════════════
     TERROIR REDESIGN
     Stato: paese → regione → denominazioni
     ═══════════════════════════════════════════════════════ */
  var T = { paese: null, regione: null };

  function buildTerroir() {
    var page = document.querySelector('#page-explore');
    if (!page || document.querySelector('#sw12-terroir')) return;

    // Nascondi versioni precedenti
    ['#sw9-den','#sw8-den','#sw7-italia','#sw10-winedb'].forEach(function(sel){
      var el = document.querySelector(sel);
      if (el) el.style.display = 'none';
    });

    var wrap = document.createElement('div');
    wrap.id = 'sw12-terroir';

    /* Hero semplice */
    wrap.innerHTML =
      '<div style="position:relative;height:130px;overflow:hidden;">' +
        '<img src="https://images.pexels.com/photos/442116/pexels-photo-442116.jpeg?auto=compress&cs=tinysrgb&w=900&h=400&dpr=1"' +
        ' style="width:100%;height:100%;object-fit:cover;filter:brightness(.45) saturate(1.2);" loading="lazy" alt="">' +
        '<div style="position:absolute;inset:0;background:linear-gradient(rgba(74,4,4,.2),rgba(10,7,5,.9));' +
          'display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:14px;">' +
          '<div style="font-size:9px;font-weight:700;letter-spacing:3px;color:rgba(212,175,55,.6);text-transform:uppercase;margin-bottom:4px;">🌍 TERROIR MONDIALE</div>' +
          '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:1.2rem;font-weight:700;color:#fff;">Denominazioni del Mondo</div>' +
        '</div>' +
      '</div>' +

      /* Breadcrumb */
      '<div id="sw12-breadcrumb"></div>' +

      /* Step 1 — Paesi */
      '<div id="sw12-step-paesi">' +
        '<div class="sw12-step-hdr">🌍 Seleziona il Paese</div>' +
        '<div id="sw12-countries"></div>' +
      '</div>' +

      /* Step 2 — Regioni (nascosto) */
      '<div id="sw12-step-regioni" style="display:none;">' +
        '<div class="sw12-step-hdr">📍 Seleziona la Regione</div>' +
        '<div id="sw12-regions"></div>' +
      '</div>' +

      /* Regione card (nascosto) */
      '<div id="sw12-region-card" style="display:none;">' +
        '<img id="sw12-rc-img" src="" alt="">' +
        '<div id="sw12-rc-info">' +
          '<div id="sw12-rc-name"></div>' +
          '<div id="sw12-rc-desc"></div>' +
        '</div>' +
      '</div>' +

      /* Step 3 — Denominazioni (nascosto) */
      '<div id="sw12-step-dens" style="display:none;">' +
        '<div class="sw12-step-hdr">🍷 Denominazioni</div>' +
        '<div id="sw12-dens"></div>' +
      '</div>';

    /* Inserisci all'inizio della pagina explore */
    var firstChild = page.firstElementChild;
    if (firstChild) page.insertBefore(wrap, firstChild);
    else page.appendChild(wrap);

    renderCountries();
  }

  function renderCountries() {
    var grid = document.querySelector('#sw12-countries');
    if (!grid) return;
    grid.innerHTML = '';

    Object.keys(TERROIR_DB).forEach(function(paese) {
      var btn = document.createElement('div');
      btn.className = 'sw12-country-btn' + (T.paese === paese ? ' sw12-active' : '');
      btn.innerHTML = '<span style="font-size:18px;">' + paese.split(' ')[0] + '</span>' +
        '<span style="font-size:12px;">' + paese.split(' ').slice(1).join(' ') + '</span>';
      btn.addEventListener('click', function() { selectCountry(paese); });
      grid.appendChild(btn);
    });
  }

  function selectCountry(paese) {
    T.paese = paese;
    T.regione = null;

    // Aggiorna active
    document.querySelectorAll('.sw12-country-btn').forEach(function(b) {
      b.classList.toggle('sw12-active', b.textContent.replace(/\s+/g,' ').trim().replace(/(.)\s/,'$1 ') === paese ||
        b.textContent.includes(paese.split(' ')[1]));
    });

    // Mostra regioni
    renderRegions();
    document.querySelector('#sw12-step-regioni').style.display = 'block';
    document.querySelector('#sw12-region-card').style.display = 'none';
    document.querySelector('#sw12-step-dens').style.display = 'none';
    updateBreadcrumb();
    document.querySelector('#sw12-step-regioni').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderRegions() {
    var cont = document.querySelector('#sw12-regions');
    if (!cont) return;
    cont.innerHTML = '';
    var regioni = TERROIR_DB[T.paese] || {};
    Object.keys(regioni).forEach(function(reg) {
      var btn = document.createElement('div');
      btn.className = 'sw12-region-btn';
      btn.textContent = reg;
      btn.addEventListener('click', function() { selectRegion(reg); });
      cont.appendChild(btn);
    });
  }

  function selectRegion(reg) {
    T.regione = reg;

    document.querySelectorAll('.sw12-region-btn').forEach(function(b) {
      b.classList.toggle('sw12-active', b.textContent === reg);
    });

    var data = TERROIR_DB[T.paese][reg];

    // Regione card
    var card = document.querySelector('#sw12-region-card');
    document.querySelector('#sw12-rc-img').src = data.img;
    document.querySelector('#sw12-rc-name').textContent = reg;
    document.querySelector('#sw12-rc-desc').textContent = data.info;
    card.style.display = 'block';

    // Denominazioni
    renderDens(data.dens);
    document.querySelector('#sw12-step-dens').style.display = 'block';
    updateBreadcrumb();
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderDens(dens) {
    var cont = document.querySelector('#sw12-dens');
    if (!cont) return;
    cont.innerHTML = '';
    dens.forEach(function(d) {
      var item = document.createElement('div');
      item.className = 'sw12-den-item';
      item.innerHTML =
        '<div class="sw12-den-top">' +
          '<div class="sw12-den-nome">🍷 ' + d.n + '</div>' +
          '<div class="sw12-den-uva">' + d.u + '</div>' +
          '<div class="sw12-den-arrow">›</div>' +
        '</div>' +
        '<div class="sw12-den-desc">' + d.d + '</div>';
      item.addEventListener('click', function() {
        item.classList.toggle('sw12-open');
      });
      cont.appendChild(item);
    });
  }

  function updateBreadcrumb() {
    var bc = document.querySelector('#sw12-breadcrumb');
    if (!bc) return;
    var parts = [];
    if (T.paese) {
      parts.push('<span class="sw12-bc-item" onclick="SW12.resetTo(\'paese\')">🌍 Tutti i paesi</span>');
      parts.push('<span class="sw12-bc-sep">›</span>');
      parts.push('<span class="sw12-bc-item" onclick="SW12.resetTo(\'regione\')">' + T.paese + '</span>');
    }
    if (T.regione) {
      parts.push('<span class="sw12-bc-sep">›</span>');
      parts.push('<span style="color:rgba(245,239,226,.6);">' + T.regione + '</span>');
    }
    bc.innerHTML = parts.join('');
  }

  function resetTo(step) {
    if (step === 'paese') {
      T.paese = null; T.regione = null;
      document.querySelector('#sw12-step-regioni').style.display = 'none';
      document.querySelector('#sw12-region-card').style.display = 'none';
      document.querySelector('#sw12-step-dens').style.display = 'none';
      document.querySelectorAll('.sw12-country-btn').forEach(function(b){ b.classList.remove('sw12-active'); });
    } else if (step === 'regione') {
      T.regione = null;
      document.querySelector('#sw12-region-card').style.display = 'none';
      document.querySelector('#sw12-step-dens').style.display = 'none';
      document.querySelectorAll('.sw12-region-btn').forEach(function(b){ b.classList.remove('sw12-active'); });
    }
    updateBreadcrumb();
    document.querySelector('#sw12-step-paesi').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }


  /* ═══════════════════════════════════════════════════════
     BLOG — legge articles.json da GitHub Pages
     ═══════════════════════════════════════════════════════ */
  var _articles = [];
  var _blogBuilt = false;

  function buildBlog() {
    if (_blogBuilt) return;
    _blogBuilt = true;

    // Modal lettore articoli
    if (!document.querySelector('#sw12-art-modal')) {
      var modal = document.createElement('div');
      modal.id = 'sw12-art-modal';
      modal.innerHTML =
        '<div id="sw12-am-back">' +
          '<div id="sw12-am-back-btn" onclick="SW12.closeArticle()">←</div>' +
          '<div id="sw12-am-cat"></div>' +
        '</div>' +
        '<img id="sw12-am-img" src="" alt="" loading="lazy">' +
        '<div id="sw12-am-body">' +
          '<div id="sw12-am-title"></div>' +
          '<div id="sw12-am-meta"></div>' +
          '<div id="sw12-am-text"></div>' +
        '</div>';
      document.body.appendChild(modal);
    }

    loadArticles();
  }

  function loadArticles() {
    fetch('./articles.json?v=' + Date.now())
      .then(function(r) { return r.json(); })
      .then(function(data) {
        _articles = data || [];
        renderBlog();
      })
      .catch(function() {
        // Fallback: nessun articolo
        renderBlog();
      });
  }

  function renderBlog() {
    // Cerca la sezione blog esistente o crea nuova
    var page = document.querySelector('#page-home .home-body, #page-blog, #page-magazine');
    if (!page) return;

    var existing = document.querySelector('#sw12-blog');
    if (existing) existing.remove();

    if (_articles.length === 0) return;

    var sec = document.createElement('div');
    sec.id = 'sw12-blog';

    sec.innerHTML =
      '<div class="sw12-blog-hdr">' +
        '<div class="sw12-blog-tag">✍️ MAGAZINE</div>' +
        '<div class="sw12-blog-title">Articoli & Approfondimenti</div>' +
      '</div>';

    _articles.forEach(function(art) {
      var card = document.createElement('div');
      card.className = 'sw12-article-card';
      card.innerHTML =
        '<img class="sw12-art-img" src="' + (art.immagine || '') + '" alt="' + art.titolo + '" loading="lazy">' +
        '<div class="sw12-art-body">' +
          '<div class="sw12-art-cat">' + (art.categoria || 'Magazine') + '</div>' +
          '<div class="sw12-art-title">' + art.titolo + '</div>' +
          '<div class="sw12-art-meta">' + (art.data || '') + (art.autore ? ' · ' + art.autore : '') + '</div>' +
        '</div>';
      card.addEventListener('click', function() { openArticle(art); });
      sec.appendChild(card);
    });

    // Aggiungi dopo gli articoli rotanti (sw9-arts) o alla fine della home
    var sw9 = document.querySelector('#sw9-arts');
    if (sw9 && sw9.nextSibling) {
      page.insertBefore(sec, sw9.nextSibling);
    } else {
      page.appendChild(sec);
    }
  }

  function openArticle(art) {
    document.querySelector('#sw12-am-cat').textContent = art.categoria || 'Magazine';
    document.querySelector('#sw12-am-img').src = art.immagine || '';
    document.querySelector('#sw12-am-title').textContent = art.titolo;
    document.querySelector('#sw12-am-meta').textContent =
      (art.data || '') + (art.autore ? '  ·  ' + art.autore : '');
    document.querySelector('#sw12-am-text').textContent = art.testo || '';
    var modal = document.querySelector('#sw12-art-modal');
    modal.style.display = 'block';
    modal.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }

  function closeArticle() {
    var modal = document.querySelector('#sw12-art-modal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
  }


  /* ═══════════════════════════════════════════════════════
     API PUBBLICA
     ═══════════════════════════════════════════════════════ */
  window.SW12 = {
    resetTo:      resetTo,
    closeArticle: closeArticle,
  };


  /* ═══════════════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════════════ */
  function init() {
    console.log('[SW-v12] Patch v12 — Terroir + Blog — avvio');
    css12();

    var n = 0;
    function run() {
      buildTerroir();
      buildBlog();
      if (++n < 20) setTimeout(run, 400);
      else console.log('[SW-v12] Init completato ✓');
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run);
    } else {
      run();
    }
  }

  init();

})();
