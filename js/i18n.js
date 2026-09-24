// Variable globale pour stocker les traductions chargées
let currentTranslations = {};
let allTranslations = {}; // cache du fichier complet

// 1. Fonction utilitaire pour lire les clés imbriquées (ex: "nav.destinations")
function getNestedTranslation(obj, path) {
  return path.split('.').reduce((prev, curr) => (prev ? prev[curr] : null), obj);
}

// 2. Fonction principale de mise à jour du DOM (Texte + Placeholders)
function updateLanguage(langData) {
  currentTranslations = langData;

  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = getNestedTranslation(langData, key);
    if (translation !== null && translation !== undefined) {
      element.textContent = translation;
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    const translation = getNestedTranslation(langData, key);
    if (translation !== null && translation !== undefined) {
      element.placeholder = translation;
    }
  });
}

// 3. Charger (une seule fois) le fichier JSON complet, puis appliquer la langue
async function loadLanguage(lang) {
  try {
    // On ne re-télécharge le fichier que s'il n'est pas déjà en cache
    if (Object.keys(allTranslations).length === 0) {
      const response = await fetch('js/translations.json');
      allTranslations = await response.json();
    }

    const langData = allTranslations[lang]; // ✅ on descend au niveau de la langue
    if (!langData) {
      console.error(`Langue "${lang}" introuvable dans translations.json`);
      return;
    }

    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('preferred_lang', lang);

    updateLanguage(langData);
  } catch (error) {
    console.error(`Erreur de chargement de la langue ${lang}:`, error);
  }
}

// 4. Fonction appelée par ton HTML (onclick="switchLanguage('fr')")
function changeLanguage(lang) {
  loadLanguage(lang);
}

// 5. Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('preferred_lang') || 'fr';
  loadLanguage(savedLang);
});
