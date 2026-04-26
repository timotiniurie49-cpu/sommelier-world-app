/**
 * sw-patch-v6.js — patch di compatibilità
 * Neutralizza vecchie funzioni Railway.
 * Il sito usa ora Cloudflare Worker per le chiamate AI.
 */

/* Blocca fetchLiveNews legacy */
window.fetchLiveNews = function(){ return Promise.resolve(null); };
window.generateEvergreenNews = function(){ return Promise.resolve(null); };

/* Blocca GazzettaEditor legacy */
window.GazzettaEditor = {
  init: function(){},
  generate: function(){ return Promise.resolve(); },
  render: function(){}
};

/* NON sovrascrivere window.callAPI — è già definita in sommelier.js
   e punta al Worker Cloudflare corretto */
console.log('[SW Patch v6] Caricato — Railway neutralizzato, Cloudflare Worker attivo');
