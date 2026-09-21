/* Dictionnaire de traduction natif pour MoroccoTripMap */
const dictionary = {
  fr: {
    "Discover. Plan. <br><span class=\"text-sable\">Experience Morocco.</span>": "Découvrez. Planifiez. <br><span class=\"text-sable\">Vivez le Maroc.</span>",
    "Discover. Plan. Experience Morocco.": "Découvrez. Planifiez. Vivez le Maroc.",
    "Your authentic directory and guide to hotels, riads, restaurants, desert adventures, and hidden gems across the Kingdom of Morocco.": "Votre annuaire et guide authentique pour les hôtels, riads, restaurants, excursions dans le désert et joyaux cachés du Maroc.",
    "Where do you want to go? (e.g. Marrakech, Riad, Desert)": "Où souhaitez-vous aller ? (ex. Marrakech, Riad, Désert)",
    "Search": "Rechercher",
    "Hotels & Riads": "Hôtels & Riads",
    "Restaurants": "Restaurants",
    "Desert Trips": "Excursions Désert",
    "Activities": "Activités",
    "Cities": "Villes",
    "Explore": "Explorer",
    "View Details": "Voir les détails",
    "Book Now": "Réserver maintenant",
    "Contact Us": "Contactez-nous",
    "Home": "Accueil",
    "About Us": "À propos",
    "Services": "Services",
    "All Rights Reserved": "Tous droits réservés"
  },
  es: {
    "Discover. Plan. <br><span class=\"text-sable\">Experience Morocco.</span>": "Descubre. Planifica. <br><span class=\"text-sable\">Vive Marruecos.</span>",
    "Discover. Plan. Experience Morocco.": "Descubre. Planifica. Vive Marruecos.",
    "Your authentic directory and guide to hotels, riads, restaurants, desert adventures, and hidden gems across the Kingdom of Morocco.": "Tu directorio y guía auténtica de hoteles, riads, restaurantes, excursiones al desierto y joyas ocultas en Marruecos.",
    "Where do you want to go? (e.g. Marrakech, Riad, Desert)": "¿A dónde quieres ir? (ej. Marrakech, Riad, Desierto)",
    "Search": "Buscar",
    "Hotels & Riads": "Hoteles y Riads",
    "Restaurants": "Restaurantes",
    "Desert Trips": "Excursiones al Desierto",
    "Activities": "Actividades",
    "Cities": "Ciudades",
    "Explore": "Explorar",
    "View Details": "Ver detalles",
    "Book Now": "Reservar ahora",
    "Contact Us": "Contáctanos",
    "Home": "Inicio",
    "About Us": "Sobre nosotros",
    "Services": "Servicios",
    "All Rights Reserved": "Todos los derechos reservados"
  },
  ar: {
    "Discover. Plan. <br><span class=\"text-sable\">Experience Morocco.</span>": "اكتشف. خطط. <br><span class=\"text-sable\">عش تجربة المغرب.</span>",
    "Discover. Plan. Experience Morocco.": "اكتشف. خطط. عش تجربة المغرب.",
    "Your authentic directory and guide to hotels, riads, restaurants, desert adventures, and hidden gems across the Kingdom of Morocco.": "دليلك الأصيل للفنادق والرياض والمطاعم ورحلات الصحراء والجواهر الخفية في جميع أنحاء المملكة المغربية.",
    "Where do you want to go? (e.g. Marrakech, Riad, Desert)": "إلى أين تريد الذهاب؟ (مثال: مراكش، رياض، صحراء)",
    "Search": "بحث",
    "Hotels & Riads": "الفنادق والرياض",
    "Restaurants": "المطاعم",
    "Desert Trips": "رحلات الصحراء",
    "Activities": "الأنشطة والفعاليات",
    "Cities": "المدن",
    "Explore": "استكشف",
    "View Details": "عرض التفاصيل",
    "Book Now": "احجز الآن",
    "Contact Us": "اتصل بنا",
    "Home": "الرئيسية",
    "About Us": "من نحن",
    "Services": "خدماتنا",
    "All Rights Reserved": "جميع الحقوق محفوظة"
  }
};

function translatePage(lang) {
  localStorage.setItem('site_lang', lang);

  // Direction RTL pour l'Arabe
  if (lang === 'ar') {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  } else {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = lang;
  }

  const dict = dictionary[lang] || {};

  // Restauration de l'anglais si demandé
  if (lang === 'en') {
    document.querySelectorAll('[data-en]').forEach(el => {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = el.dataset.en;
      } else {
        el.innerHTML = el.dataset.en;
      }
    });
    return;
  }

  // Traduction des éléments textuels
  const selectors = 'h1, h2, h3, h4, h5, h6, p, a, span, button, li, label, td, th, input[placeholder], textarea[placeholder]';
  document.querySelectorAll(selectors).forEach(el => {
    // Gestion des champs avec placeholder
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      if (!el.dataset.en && el.placeholder) {
        el.dataset.en = el.placeholder.trim();
      }
      const orig = el.dataset.en;
      if (orig && dict[orig]) {
        el.placeholder = dict[orig];
      }
    } else {
      // Gestion du contenu HTML/Texte
      if (!el.dataset.en && el.innerHTML.trim()) {
        el.dataset.en = el.innerHTML.trim();
      }
      const orig = el.dataset.en;
      if (orig && dict[orig]) {
        el.innerHTML = dict[orig];
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('site_lang') || 'en';

  // Synchronisation des menus déroulants de langue
  document.querySelectorAll('select').forEach(select => {
    select.removeAttribute('onchange');
    
    for (let i = 0; i < select.options.length; i++) {
      const val = select.options[i].value.toLowerCase();
      const txt = select.options[i].text.toLowerCase();
      if (val.includes(savedLang) || txt.includes(savedLang)) {
        select.selectedIndex = i;
        break;
      }
    }

    select.addEventListener('change', (e) => {
      const val = e.target.value.toLowerCase();
      const txt = e.target.options[e.target.selectedIndex].text.toLowerCase();
      let lang = 'en';

      if (val.includes('fr') || txt.includes('fr')) lang = 'fr';
      else if (val.includes('es') || txt.includes('es')) lang = 'es';
      else if (val.includes('ar') || txt.includes('ar')) lang = 'ar';
      else if (val.includes('en') || txt.includes('en')) lang = 'en';

      translatePage(lang);
    });
  });

  // Appliquer la langue enregistrée
  if (savedLang !== 'en') {
    translatePage(savedLang);
  }
});
