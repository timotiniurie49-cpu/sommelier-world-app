/* sw-patch-v6.js — STUB NEUTRO v2026
 * Neutralizza il vecchio sistema luxury restyling (Pexels hero, Gazzetta).
 * La mappa e le denominazioni sono in navigation.js + wine_regions.geojson
 */
(function(){
  'use strict';
  /* Blocca vecchie funzioni */
  ['injectHero','injectCSS','loadFonts','renderGazzetta','initGazzetta'].forEach(function(fn){
    window[fn] = function(){};
  });
  window.GazzettaEditor = { init:function(){}, generate:function(){}, render:function(){} };
  /* Rimuove vecchi elementi DOM */
  document.addEventListener('DOMContentLoaded', function(){
    ['sw-hero','sw7-hero','heroSection','gazzetta-section'].forEach(function(id){
      var el = document.getElementById(id);
      if(el) el.remove();
    });
    document.querySelectorAll('.sw7-slide,.sw7-dot,.sw7-hero,.gazzetta-hero').forEach(function(el){
      el.remove();
    });
  });
  console.log('[SW] sw-patch-v6 stub OK');
})();
