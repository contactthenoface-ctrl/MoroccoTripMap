// Fonction d'initialisation des traductions
function initI18n() {
    // Récupérer la langue enregistrée ou utiliser l'anglais par défaut
    const currentLang = localStorage.getItem('morocco_lang') || 'en';
    switchLanguage(currentLang);

    // Écouter les clics sur tous les boutons de changement de langue
    document.querySelectorAll('[data-lang]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLang = button.getAttribute('data-lang');
            localStorage.setItem('morocco_lang', selectedLang);
            switchLanguage(selectedLang);

            // Fermer le menu déroulant desktop s'il est ouvert
            const desktopDropdown = document.getElementById('lang-menu-dropdown');
            if (desktopDropdown) {
                desktopDropdown.classList.add('hidden');
            }

            // Fermer le menu mobile s'il est ouvert
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
        });
    });
}

// Exécuter immédiatement si le DOM est déjà chargé, sinon attendre
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
} else {
    initI18n();
}

async function switchLanguage(lang) {
    try {
        // Détection automatique du chemin de translations.json peu importe la profondeur de la page
        const scriptEl = document.querySelector('script[src*="i18n.js"]');
        let jsonPath = 'translations.json';
        if (scriptEl) {
            const src = scriptEl.getAttribute('src');
            const lastSlash = src.lastIndexOf('/');
            if (lastSlash !== -1) {
                jsonPath = src.substring(0, lastSlash + 1) + 'translations.json';
            }
        }

        const response = await fetch(jsonPath);
        const data = await response.json();

        if (!data[lang]) return;

        // 1. Traduire tous les éléments avec l'attribut data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const keys = el.getAttribute('data-i18n').split('.');
            let value = data[lang];
            
            for (const key of keys) {
                value = value ? value[key] : null;
            }

            if (value !== null && value !== undefined) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = value;
                } else {
                    el.innerHTML = value;
                }
            }
        });

        // 2. Mettre à jour le label du texte de langue (ex: EN -> FR)
        const langLabel = document.getElementById('current-lang-label');
        if (langLabel) {
            langLabel.textContent = lang.toUpperCase();
        }

        // 3. Mettre à jour l'image du drapeau si vous avez un élément avec l'ID "current-lang-flag"
        const langFlag = document.getElementById('current-lang-flag');
        if (langFlag) {
            // Adaptez le chemin selon l'emplacement de vos images de drapeaux (ex: 'images/flag-fr.svg')
            langFlag.src = `images/flag-${lang}.svg`; 
            langFlag.alt = lang.toUpperCase();
        }

        // 4. Mettre à jour le titre de la page (SEO) si défini dans le JSON
        if (data[lang].seo && data[lang].seo.destinations_title) {
            document.title = data[lang].seo.destinations_title;
        }

        // 5. Gérer le sens de lecture pour l'arabe (RTL / LTR)
        document.documentElement.lang = lang;
        document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

    } catch (error) {
        console.error('Erreur lors du chargement des traductions :', error);
    }
}
