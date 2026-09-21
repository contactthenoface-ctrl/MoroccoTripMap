(function() {
  var currentLang = localStorage.getItem('site_lang') || 'en';
  var translations = {};

  window.setLanguage = function(lang) {
    currentLang = lang;
    localStorage.setItem('site_lang', lang);

    if (Object.keys(translations).length === 0) {
      fetchTranslations(function() {
        applyLanguage(lang);
      });
    } else {
      applyLanguage(lang);
    }
  };

  function fetchTranslations(callback) {
    fetch('translations.json')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        translations = data;
        if (callback) callback();
      })
      .catch(function(err) {
        console.error('Erreur chargement translations.json:', err);
      });
  }

  function applyLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

    if (lang === 'en' || !translations[lang]) {
      restoreOriginalText();
      return;
    }

    var dict = translations[lang];

    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    var node;
    while (node = walker.nextNode()) {
      var parent = node.parentElement;
      if (!parent || ['SCRIPT', 'STYLE', 'SELECT', 'CODE', 'NOSCRIPT'].includes(parent.tagName)) continue;
      if (parent.classList.contains('notranslate')) continue;

      if (!node.originalText) {
        node.originalText = node.nodeValue.trim();
      }

      var orig = node.originalText;
      if (orig && dict[orig]) {
        var leading = node.nodeValue.match(/^\s*/)[0];
        var trailing = node.nodeValue.match(/\s*$/)[0];
        node.nodeValue = leading + dict[orig] + trailing;
      }
    }

    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(function(el) {
      if (!el.dataset.origPlaceholder) {
        el.dataset.origPlaceholder = el.placeholder;
      }
      var origP = el.dataset.origPlaceholder;
      if (dict[origP]) {
        el.placeholder = dict[origP];
      }
    });

    if (document.title) {
      if (!window.origTitle) window.origTitle = document.title.trim();
      if (dict[window.origTitle]) document.title = dict[window.origTitle];
    }
  }

  function restoreOriginalText() {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    var node;
    while (node = walker.nextNode()) {
      if (node.originalText) {
        var leading = node.nodeValue.match(/^\s*/)[0];
        var trailing = node.nodeValue.match(/\s*$/)[0];
        node.nodeValue = leading + node.originalText + trailing;
      }
    }
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(function(el) {
      if (el.dataset.origPlaceholder) {
        el.placeholder = el.dataset.origPlaceholder;
      }
    });
    if (window.origTitle) document.title = window.origTitle;
  }

  // INTERCEPTION PRIORITAIRE EN PHASE DE CAPTURE (true)
  document.addEventListener('click', function(e) {
    var el = e.target.closest('a, button, [data-lang], option, li, div');
    if (!el) return;

    var lang = el.getAttribute('data-lang');
    var href = el.getAttribute('href') || '';
    var text = (el.textContent || '').trim().toLowerCase();

    if (!lang) {
      var match = href.match(/(?:^|\/)(fr|es|ar|en)(?:\/|\.html|$)/i);
      if (match) {
        lang = match[1].toLowerCase();
      } else if (['fr', 'es', 'ar', 'en', 'français', 'español', 'العربية', 'english'].includes(text)) {
        if (text === 'français' || text === 'fr') lang = 'fr';
        else if (text === 'español' || text === 'es') lang = 'es';
        else if (text === 'العربية' || text === 'ar') lang = 'ar';
        else if (text === 'english' || text === 'en') lang = 'en';
      }
    }

    if (lang && ['fr', 'es', 'ar', 'en'].includes(lang)) {
      e.preventDefault();
      e.stopPropagation();
      window.setLanguage(lang);
      return false;
    }
  }, true);

  document.addEventListener('DOMContentLoaded', function() {
    fetchTranslations(function() {
      if (currentLang !== 'en') {
        applyLanguage(currentLang);
      }
    });
  });
})();
