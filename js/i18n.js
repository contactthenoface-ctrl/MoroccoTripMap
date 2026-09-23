// Variable globale pour stocker les traductions chargées
let currentTranslations = {};

// 1. Fonction utilitaire pour lire les clés imbriquées (ex: "destinations.marrakech.title")
function getNestedTranslation(obj, path) {
  return path.split('.').reduce((prev, curr) => (prev ? prev[curr] : null), obj);
}

// 2. Fonction principale de mise à jour du DOM (Texte + Placeholders)
function updateLanguage(langData) {
  currentTranslations = langData;

  // Traduction du texte des éléments
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = getNestedTranslation(langData, key);
    if (translation !== null && translation !== undefined) {
      element.textContent = translation;
    }
  });

  // Traduction des placeholders (champs de recherche / formulaires)
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    const translation = getNestedTranslation(langData, key);
    if (translation !== null && translation !== undefined) {
      element.placeholder = translation;
    }
  });
}

// 3. Charger le fichier JSON de la langue demandée
async function loadLanguage(lang) {
  try {
    // Vérifiez que le chemin correspond à l'emplacement de vos fichiers JSON
    const response = await fetch('translations.json'); 
    const langData = await response.json();
    
    // Mettre à jour la direction d'affichage (RTL pour l'arabe, LTR pour le reste)
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    // Sauvegarder la langue dans le navigateur du visiteur
    localStorage.setItem('preferred_lang', lang);

    // Appliquer les traductions sur tout le document
    updateLanguage(langData);
  } catch (error) {
    console.error(`Erreur de chargement de la langue ${lang}:`, error);
  }
}

// 4. Initialisation et association des clics du menu déroulant
document.addEventListener('DOMContentLoaded', () => {
  // Charger la langue sauvegardée ou 'fr' par défaut au démarrage
  const savedLang = localStorage.getItem('preferred_lang') || 'fr';
  loadLanguage(savedLang);

  // Attacher l'événement de changement de langue sur les boutons du menu
  document.querySelectorAll('[data-lang]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedLang = button.getAttribute('data-lang');
      if (selectedLang) {
        loadLanguage(selectedLang);
      }
    });
  });
});
