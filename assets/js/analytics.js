/* Oak Park Construction — GA4 conversion EVENTS
   The base Google tag (gtag.js load + config) is installed INLINE in each page's
   <head> per Google's recommendation (so the tag is detectable). This file only
   adds conversion event listeners on top of the existing window.gtag:
     - generate_lead : any Web3Forms lead form submitted
     - click_to_call : any tel: link tapped
   Property "OPC CLAUDE" G-HKSQ4R7FC6. Wired 2026-06-24 (T-146). */
(function () {
  function gtagSafe() { if (typeof window.gtag === 'function') window.gtag.apply(window, arguments); }

  function wire() {
    document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
      a.addEventListener('click', function () {
        gtagSafe('event', 'click_to_call', {
          event_category: 'engagement',
          event_label: a.getAttribute('href').replace('tel:', '')
        });
      });
    });
    document.querySelectorAll('form').forEach(function (f) {
      var action = f.getAttribute('action') || '';
      if (action.indexOf('web3forms') > -1) {
        f.addEventListener('submit', function () {
          gtagSafe('event', 'generate_lead', {
            event_category: 'lead',
            event_label: location.pathname
          });
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
