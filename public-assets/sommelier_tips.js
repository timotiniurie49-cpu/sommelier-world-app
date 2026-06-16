/**
 * SOMMELIER WORLD — Sommelier Tips v1.0
 * Consigli personalizzati dell'admin iniettati nel prompt AI.
 * Modificabili dall'area Admin senza toccare il codice.
 */

window.SOMMELIER_TIPS = (function() {

  /* Consigli predefiniti — modificabili dall'admin */
  var DEFAULT_TIPS = [
    {
      id: 'tip001',
      categoria: 'Abbinamento',
      testo: 'Con la carne rossa valdostana (carbonade, cotoletta valdostana) privilegia sempre i vini autoctoni della Valle d\'Aosta: Fumin, Cornalin, Petit Rouge. Sono i pairing più autentici del territorio.',
      attivo: true
    },
    {
      id: 'tip002',
      categoria: 'Budget',
      testo: 'Quando il budget è sotto €50 a bottiglia, priorità ai vini locali valdostani o ai Barolo "entry level" come Germano Ettore o Bovio Gianfranco. Eccellente qualità/prezzo.',
      attivo: true
    },
    {
      id: 'tip003',
      categoria: 'Temperatura',
      testo: 'I vini serviti in alta montagna vanno sempre portati 2°C sopra la temperatura ideale standard, perché il freddo del ristorante li raffredda rapidamente nel bicchiere.',
      attivo: true
    },
    {
      id: 'tip004',
      categoria: 'Bollicine',
      testo: 'Con l\'antipasto valdostano (lardo, jambon de Bosses, fontina) proponi sempre un metodo classico italiano (Trento DOC o Alta Langa) piuttosto che il Champagne — il territorio parla.',
      attivo: true
    },
    {
      id: 'tip005',
      categoria: 'Barolo',
      testo: 'Il Barolo va sempre decantato almeno 2 ore per le annate giovani (2015-2020), 30 minuti per le annate mature (2008-2012). Le Riserve vecchie NON si decantano — si ossigenano lentamente nel calice.',
      attivo: true
    },
    {
      id: 'tip006',
      categoria: 'Servizio',
      testo: 'Il calice da Borgogna largo (Burgundy bowl) è preferibile per i grandi rossi italiani strutturati: Barolo, Brunello, Amarone. Non usare calici troppo stretti che soffocano i profumi.',
      attivo: true
    },
    {
      id: 'tip007',
      categoria: 'Stagionalità',
      testo: 'In estate proponi sempre vini più freschi e leggeri: Sauvignon, Vermentino, Soave, Rosato. D\'inverno privilegia struttura e calore: Barolo, Brunello, Amarone, Châteauneuf.',
      attivo: true
    },
    {
      id: 'tip008',
      categoria: 'Prezzi',
      testo: 'Non proporre mai un vino sopra il budget indicato, anche se tecnicamente sarebbe l\'abbinamento perfetto. Rispetta sempre il limite. Se non esiste nulla di adeguato sotto budget, comunicalo chiaramente.',
      attivo: true
    },
  ];

  function _load() {
    try {
      var saved = localStorage.getItem('sw_sommelier_tips');
      if(saved) return JSON.parse(saved);
    } catch(e) {}
    return DEFAULT_TIPS.slice();
  }

  function _save(tips) {
    try { localStorage.setItem('sw_sommelier_tips', JSON.stringify(tips)); } catch(e) {}
  }

  return {

    /* Tutti i consigli attivi */
    getActive: function() {
      return _load().filter(function(t){ return t.attivo; });
    },

    /* Tutti (per admin) */
    getAll: function() { return _load(); },

    /* Costruisce il testo da iniettare nel prompt AI */
    buildPromptSection: function() {
      var active = this.getActive();
      if(!active.length) return '';
      var lines = active.map(function(t){
        return '• ['+t.categoria+'] '+t.testo;
      });
      return '\n\n━━━ CONSIGLI DEL SOMMELIER (applica sempre) ━━━\n'+lines.join('\n')+'\n━━━ FINE CONSIGLI ━━━';
    },

    /* Admin: aggiunge un consiglio */
    add: function(cat, testo) {
      var tips = _load();
      var tip = { id:'tip_'+Date.now(), categoria:cat, testo:testo, attivo:true };
      tips.push(tip);
      _save(tips);
      return tip.id;
    },

    /* Admin: aggiorna */
    update: function(id, fields) {
      var tips = _load();
      tips = tips.map(function(t){
        return t.id===id ? Object.assign({},t,fields) : t;
      });
      _save(tips);
    },

    /* Admin: elimina */
    remove: function(id) {
      var tips = _load().filter(function(t){ return t.id!==id; });
      _save(tips);
    },

    /* Admin: toggle attivo/inattivo */
    toggle: function(id) {
      var tips = _load().map(function(t){
        return t.id===id ? Object.assign({},t,{attivo:!t.attivo}) : t;
      });
      _save(tips);
    },

    /* Reset ai default */
    reset: function() {
      _save(DEFAULT_TIPS.slice());
    },

    count: function() { return _load().length; },
  };

})();
