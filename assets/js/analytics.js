/* Oak Park Construction — GA4 analytics + conversion tracking
   Property: "OPC CLAUDE"  ·  Measurement ID: G-HKSQ4R7FC6
   Loaded on every production page. Tracks:
     - generate_lead   : any Web3Forms lead form submitted
     - click_to_call   : any tel: link tapped
   Wired 2026-06-24 (T-146). */
(function () {
  var GA_ID = 'G-HKSQ4R7FC6';

  // --- load gtag.js ---
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);

  // --- conversion events ---
  function wire() {
    // click-to-call
    document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
      a.addEventListener('click', function () {
        gtag('event', 'click_to_call', {
          event_category: 'engagement',
          event_label: a.getAttribute('href').replace('tel:', '')
        });
      });
    });
    // lead form submit (Web3Forms forms only)
    document.querySelectorAll('form').forEach(function (f) {
      var action = f.getAttribute('action') || '';
      if (action.indexOf('web3forms') > -1) {
        f.addEventListener('submit', function () {
          gtag('event', 'generate_lead', {
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
