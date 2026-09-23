// i18n.js centralisé et garanti sans erreur de chargement
const translations = {
    en: {
        "seo.title": "MoroccoTripMap | Discover. Plan. Experience Morocco.",
        "nav.destinations": "Destinations",
        "nav.stays": "Stays",
        "nav.restaurants": "Restaurants",
        "nav.experiences": "Experiences",
        "nav.guides": "Guides",
        "nav.cities": "Cities & Destinations",
        "nav.blog": "Blog",
        "nav.contact": "Contact",
        "hero.badge": "Official Tourism Portal",
        "hero.title_line1": "Discover. Plan.",
        "hero.title_line2": "Experience Morocco.",
        "hero.description": "Your authentic directory and guide to hotels, riads, restaurants, desert adventures, and hidden gems across the Kingdom of Morocco.",
        "footer.about_text": "Discover. Plan. Experience Morocco.\nThe premier tourism directory and cultural travel guide for visitors exploring Morocco.",
        "footer.copyright": "© MoroccoTripMap. All rights reserved."
    },
    fr: {
        "seo.title": "MoroccoTripMap | Découvrir. Planifier. Vivre le Maroc.",
        "nav.destinations": "Destinations",
        "nav.stays": "Séjours",
        "nav.restaurants": "Restaurants",
        "nav.experiences": "Expériences",
        "nav.guides": "Guides",
        "nav.cities": "Villes & Destinations",
        "nav.blog": "Blog",
        "nav.contact": "Contact",
        "hero.badge": "Portail Touristique Officiel",
        "hero.title_line1": "Découvrir. Planifier.",
        "hero.title_line2": "Vivre le Maroc.",
        "hero.description": "Votre guide et annuaire authentique des hôtels, riads, restaurants, aventures dans le désert et trésors cachés à travers le Royaume du Maroc.",
        "footer.about_text": "Découvrir. Planifier. Vivre le Maroc.\nLe premier annuaire touristique et guide culturel pour les visiteurs explorant le Maroc.",
        "footer.copyright": "© MoroccoTripMap. Tous droits réservés."
    },
    es: {
        "seo.title": "MoroccoTripMap | Descubre. Planifica. Vive Marruecos.",
        "nav.destinations": "Destinos",
        "nav.stays": "Estancias",
        "nav.restaurants": "Restaurantes",
        "nav.experiences": "Experiencias",
        "nav.guides": "Guías",
        "nav.cities": "Ciudades y Destinos",
        "nav.blog": "Blog",
        "nav.contact": "Contacto",
        "hero.badge": "Portal Oficial de Turismo",
        "hero.title_line1": "Descubre. Planifica.",
        "hero.title_line2": "Vive Marruecos.",
        "hero.description": "Tu directorio y guía auténtica de hoteles, riads, restaurantes, aventuras en el desierto y joyas ocultas en todo el Reino de Marruecos.",
        "footer.about_text": "Descubre. Planifica. Vive Marruecos.\nEl principal directorio turístico y guía cultural para los visitantes que exploran Marruecos.",
        "footer.copyright": "© MoroccoTripMap. Todos los derechos reservados."
    },
    ar: {
        "seo.title": "MoroccoTripMap | اكتشف. خطط. عِش تجربة المغرب.",
        "nav.destinations": "الوجهات",
        "nav.stays": "الإقامة",
        "nav.restaurants": "المطاعم",
        "nav.experiences": "التجارب",
        "nav.guides": "الأدلة",
        "nav.cities": "المدن والوجهات",
        "nav.blog": "المدونة",
        "nav.contact": "اتصل بنا",
        "hero.badge": "البوابة الرسمية للسياحة",
        "hero.title_line1": "اكتشف. خطط.",
        "hero.title_line2": "عِش تجربة المغرب.",
        "hero.description": "دليلك الموثوق والرسیم للفنادق، الرياضات، المطاعم، مغامرات الصحراء، والكنوز المخفية في جميع أنحاء المملكة المغربية.",
        "footer.about_text": "اكتشف. خطط. عِش تجربة المغرب.\nالدليل السياحي والثقافي الأبرز للزوار الذين يستكشفون المغرب.",
        "footer.copyright": "© MoroccoTripMap. جميع الحقوق محفوظة."
    }
};

function setLanguage(lang) {
    localStorage.setItem('morocco_lang', lang);
    applyTranslations(lang);
    
    const dropdown = document.getElementById('lang-menu-dropdown');
    if (dropdown) dropdown.classList.add('hidden');
}

function applyTranslations(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    const label = document.getElementById('current-lang-label');
    if (label) label.textContent = lang.toUpperCase();

    const htmlTag = document.documentElement;
    if (lang === 'ar') {
        htmlTag.setAttribute('dir', 'rtl');
        htmlTag.setAttribute('lang', 'ar');
    } else {
        htmlTag.setAttribute('dir', 'ltr');
        htmlTag.setAttribute('lang', lang);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('morocco_lang') || 'en';
    applyTranslations(savedLang);

    const langButton = document.getElementById('lang-menu-button');
    const langDropdown = document.getElementById('lang-menu-dropdown');

    if (langButton && langDropdown) {
        langButton.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('hidden');
        });
        document.addEventListener('click', () => {
            langDropdown.classList.add('hidden');
        });
    }
});

