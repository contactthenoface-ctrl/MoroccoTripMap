(function () {
  function getCookie(name) {
    var m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return m ? decodeURIComponent(m[2]) : null;
  }

  function setCookie(name, value, days) {
    var expires = '';
    if (days) {
      var d = new Date();
      d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + d.toUTCString();
    }
    document.cookie = name + '=' + value + expires + '; path=/';
  }

  // Fonction appelée par le <select onchange="setLanguage(this.value)">
  window.setLanguage = function (lang) {
    localStorage.setItem('site_lang', lang);
    if (lang === 'en') {
      setCookie('googtrans', '', -1);
    } else {
      setCookie('googtrans', '/en/' + lang);
    }
    window.location.reload();
  };

  // Réapplique la langue mémorisée à chaque chargement de page
  var savedLang = localStorage.getItem('site_lang');
  if (savedLang && savedLang !== 'en') {
    setCookie('googtrans', '/en/' + savedLang);
  }

  // Cache le bandeau moche de Google Translate + son widget
  var style = document.createElement('style');
  style.textContent =
    '.goog-te-banner-frame, .goog-te-gadget-icon { display: none !important; }' +
    'body { top: 0 !important; }' +
    '.goog-tooltip, .goog-tooltip:hover { display: none !important; }' +
    '.goog-text-highlight { background: none !important; box-shadow: none !important; }' +
    '#google_translate_element { display: none !important; }';
  document.head.appendChild(style);

  window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement(
      { pageLanguage: 'en', includedLanguages: 'fr,es,ar', autoDisplay: false },
      'google_translate_element'
    );
  };

  document.addEventListener('DOMContentLoaded', function () {
    var div = document.createElement('div');
    div.id = 'google_translate_element';
    document.body.appendChild(div);

    var script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(script);

    // Synchronise le sélecteur avec la langue active
    var current = getCookie('googtrans');
    var currentLang = 'en';
    if (current) {
      var parts = current.split('/').filter(Boolean);
      if (parts.length === 2) currentLang = parts[1];
    }
    document.querySelectorAll('select[onchange*="setLanguage"]').forEach(function (sel) {
      sel.value = currentLang;
    });
    if (currentLang === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    }
  });
})();
