/* Dictionnaire de traduction complet pour MoroccoTripMap */
const dictionary = {
  fr: {
    "OFFICIAL TOURISM PORTAL": "PORTAIL TOURISTIQUE OFFICIEL",
    "Discover. Plan. <br><span class=\"text-sable\">Experience Morocco.</span>": "Découvrez. Planifiez. <br><span class=\"text-sable\">Vivez le Maroc.</span>",
    "Your authentic directory and guide to hotels, riads, restaurants, desert adventures, and hidden gems across the Kingdom of Morocco.": "Votre annuaire et guide authentique pour les hôtels, riads, restaurants, excursions dans le désert et joyaux cachés du Maroc.",
    "Where do you want to go? (e.g. Marrakech, Riad, Desert)": "Où souhaitez-vous aller ? (ex. Marrakech, Riad, Désert)",
    "Search": "Rechercher",
    "EXPLORE BY CATEGORY": "EXPLORER PAR CATÉGORIE",
    "Gastronomy": "Gastronomie",
    "Restaurants & Cafes": "Restaurants & Cafés",
    "Stays & Riads": "Hébergements & Riads",
    "Hotels & Riads": "Hôtels & Riads",
    "Desert Trips": "Excursions Désert",
    "Sahara & Camps": "Sahara & Bivouacs",
    "Activities": "Activités",
    "Tours & Experiences": "Tours & Expériences",
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
    "OFFICIAL TOURISM PORTAL": "PORTAL TURÍSTICO OFICIAL",
    "Discover. Plan. <br><span class=\"text-sable\">Experience Morocco.</span>": "Descubre. Planifica. <br><span class=\"text-sable\">Vive Marruecos.</span>",
    "Your authentic directory and guide to hotels, riads, restaurants, desert adventures, and hidden gems across the Kingdom of Morocco.": "Tu directorio y guía auténtica de hoteles, riads, restaurantes, excursiones al desierto y joyas ocultas en Marruecos.",
    "Where do you want to go? (e.g. Marrakech, Riad, Desert)": "¿A dónde quieres ir? (ej. Marrakech, Riad, Desierto)",
    "Search": "Buscar",
    "EXPLORE BY CATEGORY": "EXPLORAR POR CATEGORÍA",
    "Gastronomy": "Gastronomía",
    "Restaurants & Cafes": "Restaurantes y Cafés",
    "Stays & Riads": "Alojamientos y Riads",
    "Hotels & Riads": "Hoteles y Riads",
    "Desert Trips": "Excursiones al Desierto",
    "Sahara & Camps": "Sáhama y Campamentos",
    "Activities": "Actividades",
    "Tours & Experiences": "Tours y Experiencias",
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
    "OFFICIAL TOURISM PORTAL": "البوابة السياحية الرسمية",
    "Discover. Plan. <br><span class=\"text-sable\">Experience Morocco.</span>": "اكتشف. خطط. <br><span class=\"text-sable\">عش تجربة المغرب.</span>",
    "Your authentic directory and guide to hotels, riads, restaurants, desert adventures, and hidden gems across the Kingdom of Morocco.": "دليلك الأصيل للفنادق والرياض والمطاعم ورحلات الصحراء والجواهر الخفية في جميع أنحاء المملكة المغربية.",
    "Where do you want to go? (e.g. Marrakech, Riad, Desert)": "إلى أين تريد الذهاب؟ (مثال: مراكش، رياض، صحراء)",
    "Search": "بحث",
    "EXPLORE BY CATEGORY": "استكشف حسب الفئة",
    "Gastronomy": "المأكولات والطعام",
    "Restaurants & Cafes": "المطاعم والمقاهي",
    "Stays & Riads": "الإقامة والرياض",
    "Hotels & Riads": "الفنادق والرياض",
    "Desert Trips": "رحلات الصحراء",
    "Sahara & Camps": "الصحراء والمخيمات",
    "Activities": "الأنشطة والفعاليات",
    "Tours & Experiences": "الجولات والتجارب",
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

  if (lang === 'ar') {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  } else {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = lang;
  }

  const dict = dictionary[lang] || {};

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

  const selectors = 'h1, h2, h3, h4, h5, h6, p, a, span, button, div, li, label, td, th, input[placeholder], textarea[placeholder]';
  document.querySelectorAll(selectors).forEach(el => {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      if (!el.dataset.en && el.placeholder) {
        el.dataset.en = el.placeholder.trim();
      }
      const orig = el.dataset.en;
      if (orig && dict[orig]) {
        el.placeholder = dict[orig];
      }
    } else {
      // Ignorer les conteneurs qui ont des enfants complexes
      if (el.children.length > 0 && !el.querySelector('span')) return;

      const trimmedText = el.innerHTML.trim();
      if (!el.dataset.en && trimmedText) {
        el.dataset.en = trimmedText;
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

  if (savedLang !== 'en') {
    translatePage(savedLang);
  }
});
