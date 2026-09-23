document.addEventListener('DOMContentLoaded', () => {
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
        });
    });
});

async function switchLanguage(lang) {
    try {
        // Ajustez le chemin vers votre fichier translations.json si nécessaire
        const response = await fetch('translations.json');
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
                    el.innerHTML = value; // Utilise innerHTML pour supporter les balises comme <strong>
                }
            }
        });

        // 2. Mettre à jour le titre de la page (SEO) si défini dans le JSON
        if (data[lang].seo && data[lang].seo.title) {
            document.title = data[lang].seo.title;
        }

        // 3. Gérer le sens de lecture pour l'arabe (RTL / LTR)
        document.documentElement.lang = lang;
        document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

    } catch (error) {
        console.error('Erreur lors du chargement des traductions :', error);
    }
}

