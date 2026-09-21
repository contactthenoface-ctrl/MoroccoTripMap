(function() {
  var currentLang = localStorage.getItem('site_lang') || 'en';
  var translations = {};

  function fetchTranslations() {
    fetch('/translations.json')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        translations = data;
        if (currentLang !== 'en') {
          applyLanguage(currentLang);
        }
      })
      .catch(function(err) {
        console.error('Erreur de chargement de translations.json:', err);
      });
  }

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('site_lang', lang);

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

  // Intercepte les clics sur les liens de menu et sélecteurs de langue
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a');
    if (!link) return;

    var href = link.getAttribute('href') || '';
    var lang = link.getAttribute('data-lang');

    if (!lang) {
      var match = href.match(/(?:^|\/)(fr|es|ar|en)(?:\/|\.html|$)/i);
      if (match) {
        lang = match[1].toLowerCase();
      } else {
        var text = link.textContent.trim().toLowerCase();
        if (['fr', 'es', 'ar', 'en'].includes(text)) {
          lang = text;
        }
      }
    }

    if (lang && ['fr', 'es', 'ar', 'en'].includes(lang)) {
      e.preventDefault();
      applyLanguage(lang);
    }
  });

  document.addEventListener('DOMContentLoaded', fetchTranslations);
})();
