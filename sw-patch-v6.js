/**
 * sw-patch-v7.js — patch compatibilità
 * Aggiornato: forzata nuova versione per cache clear
 */

/* Blocca funzioni Railway legacy */
window.fetchLiveNews = function(){ return Promise.resolve(null); };
window.generateEvergreenNews = function(){ return Promise.resolve(null); };
window.GazzettaEditor = {
  init: function(){},
  generate: function(){ return Promise.resolve(); },
  render: function(){}
};

/* Force cache refresh */
if('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(var r of registrations) {
      r.update();
    }
  });
}
