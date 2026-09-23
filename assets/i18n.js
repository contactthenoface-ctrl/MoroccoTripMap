// i18n.js - Gestionnaire de traduction asynchrone depuis /assets/translations.json

let translations = {};

// Chargement initial du fichier JSON des traductions
async function loadTranslations() {
    try {
        // Ajustez le chemin vers votre fichier JSON selon l'emplacement de i18n.js
        const response = await fetch('assets/translations.json');
        if (!response.ok) {
            throw new Error('Erreur lors du chargement de translations.json');
        }
        translations = await response.json();
        
        // Appliquer la langue enregistrée ou l'anglais par défaut au chargement
        const savedLang = localStorage.getItem('preferred_lang') || 'en';
        changeLanguage(savedLang);
    } catch (error) {
        console.error('Erreur i18n :', error);
    }
}

// Fonction globale pour changer de langue
function changeLanguage(lang) {
    localStorage.setItem('preferred_lang', lang);

    // Mettre à jour le label du sélecteur si présent
    const langLabel = document.getElementById('current-lang-label');
    if (langLabel) {
        langLabel.textContent = lang.toUpperCase();
    }

    // Mettre à jour le drapeau visuel si la fonction UI existe
    updateFlagUI(lang);

    // Fermer le menu déroulant des langues s'il est ouvert
    const langDropdown = document.getElementById('lang-menu-dropdown');
    if (langDropdown) {
        langDropdown.classList.add('hidden');
    }

    if (!translations[lang]) {
        console.warn(`Traductions introuvables pour la langue : ${lang}`);
        return;
    }

    const data = translations[lang];
    const htmlTag = document.documentElement;

    // Gestion du sens d'écriture (RTL pour l'arabe, LTR pour les autres)
    if (lang === 'ar') {
        htmlTag.setAttribute('dir', 'rtl');
        htmlTag.setAttribute('lang', 'ar');
    } else {
        htmlTag.setAttribute('dir', 'ltr');
        htmlTag.setAttribute('lang', lang);
    }

    // Traduction des éléments avec l'attribut data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const keys = element.getAttribute('data-i18n').split('.');
        let value = data;
        keys.forEach(key => {
            if (value) value = value[key];
        });

        if (value !== undefined) {
            if (element.innerHTML.includes('<') && typeof value === 'string') {
                element.innerHTML = value;
            } else {
                element.textContent = value;
            }
        }
    });

    // Traduction des placeholders (champs de recherche, formulaires...)
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const keys = element.getAttribute('data-i18n-placeholder').split('.');
        let value = data;
        keys.forEach(key => {
            if (value) value = value[key];
        });
        if (value !== undefined) {
            element.placeholder = value;
        }
    });
}

// Mise à jour visuelle du drapeau dans le bouton du sélecteur
function updateFlagUI(lang) {
    const langButton = document.getElementById('lang-menu-button');
    const flags = {
        en: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="20" height="15" class="rounded-sm shadow-sm"><clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><clipPath id="t"><path d="M30,15 h30 v15 z v-15 h-30 z h-30 v-15 z v15 h30 z"/></clipPath><g clip-path="url(#s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#t)" stroke="#C8102E" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></g></svg>',
        fr: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" width="20" height="15" class="rounded-sm shadow-sm"><rect width="3" height="2" fill="#ED2939"/><rect width="2" height="2" fill="#fff"/><rect width="1" height="2" fill="#002395"/></svg>',
        es: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 500" width="20" height="15" class="rounded-sm shadow-sm"><rect width="750" height="500" fill="#c60b1e"/><rect y="125" width="750" height="250" fill="#ffc400"/></svg>',
        ar: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="20" height="15" class="rounded-sm shadow-sm"><rect width="900" height="600" fill="#c1272d"/><polygon fill="none" stroke="#006233" stroke-width="15" points="450,170 361,441 593,273 307,273 639,441"/></svg>'
    };

    if (langButton && flags[lang]) {
        const svgElement = langButton.querySelector('svg');
        if (svgElement) {
            svgElement.outerHTML = flags[lang];
        }
    }
}

// Lancement au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    loadTranslations();
});
