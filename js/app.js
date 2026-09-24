/* ============================================================
   CEEB SID — app.js
   Langues, traductions, images de carrousel par pays,
   carrousel et navigation mobile.
   ============================================================ */

const CEEB_CONFIG = {
  // Langues disponibles : code → libellé affiché dans le sélecteur
  languages: {
    fr: 'Français',
    en: 'English',
    pl: 'Polski',
    tr: 'Türkçe'
  },

  // Photos affichées pour chaque langue : dossier images/countries/<code>
  languageCountries: { fr: 'fr', en: 'gb', pl: 'pl', tr: 'tr' },

  // Langue par défaut selon le pays du visiteur ; anglais partout ailleurs
  countryLanguages: { FR: 'fr', PL: 'pl', TR: 'tr' },
  timezoneCountries: {
    'Europe/Paris': 'FR',
    'Europe/Warsaw': 'PL',
    'Europe/Istanbul': 'TR'
  },
  fallbackLang: 'en',

  storageKey: 'ceeb_lang',
  carouselAutoplay: 5000,
  slideshowInterval: 3500
};

// Racine du site, déduite de l'emplacement de ce script (js/app.js)
const SITE_ROOT = new URL('../', document.currentScript.src).href;

// Segment pays dans les chemins d'images : images/countries/<code>/...
const COUNTRY_PATH_SEGMENT = /\/countries\/[a-z]{2}\//;

let currentLang = CEEB_CONFIG.fallbackLang;
window.currentLang = currentLang;

// Registre des données chargées à la demande. Chaque fichier de données
// (lang/<code>.js, recruitment/jobs/<code>.js) est un script qui s'y
// enregistre : cela fonctionne aussi bien en ligne que depuis le disque
// (file://), là où fetch serait bloqué par le navigateur.
const CEEB_DATA = { translations: {}, jobs: {} };


/* ============================================================
   DÉTECTION DE LA LANGUE
   ============================================================ */

function isSupportedLang(lang) {
  return Object.prototype.hasOwnProperty.call(CEEB_CONFIG.languages, lang);
}

function getLangFromUrl() {
  const lang = new URLSearchParams(window.location.search).get('lang');
  return isSupportedLang(lang) ? lang : null;
}

function getSavedLang() {
  try {
    const lang = localStorage.getItem(CEEB_CONFIG.storageKey);
    return isSupportedLang(lang) ? lang : null;
  } catch (error) {
    return null;
  }
}

function saveLang(lang) {
  try {
    localStorage.setItem(CEEB_CONFIG.storageKey, lang);
  } catch (error) {
    // Stockage indisponible (navigation privée) : le choix vaut pour la page
  }
}

// Pays du visiteur, déduit du fuseau horaire du navigateur
function detectVisitorCountry() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return CEEB_CONFIG.timezoneCountries[timezone] || null;
}

// Langue dans laquelle le contenu d'une page s'affiche. Une page peut limiter
// ses langues avec <body data-languages="fr,en"> : en dehors, elle s'affiche
// dans la langue de repli (la langue choisie reste celle du site).
function getContentLang(lang) {
  const pageLangs = document.body.dataset.languages;
  if (!pageLangs || pageLangs.split(',').includes(lang)) return lang;
  return CEEB_CONFIG.fallbackLang;
}

function detectDefaultLang() {
  return (
    getLangFromUrl() ||
    getSavedLang() ||
    CEEB_CONFIG.countryLanguages[detectVisitorCountry()] ||
    CEEB_CONFIG.fallbackLang
  );
}


/* ============================================================
   TRADUCTIONS
   ============================================================ */

function loadDataScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => {
      script.remove();
      resolve();
    };
    script.onerror = () => {
      script.remove();
      reject(new Error(`Cannot load ${url}`));
    };
    document.head.appendChild(script);
  });
}

async function loadTranslations(lang) {
  if (!CEEB_DATA.translations[lang]) {
    try {
      await loadDataScript(`${SITE_ROOT}lang/${lang}.js`);
    } catch (error) {
      console.warn(`[CEEB] traduction ${lang} indisponible`, error);
      return lang === CEEB_CONFIG.fallbackLang
        ? {}
        : loadTranslations(CEEB_CONFIG.fallbackLang);
    }
  }

  return CEEB_DATA.translations[lang];
}

function getNestedValue(obj, path) {
  return path.split('.').reduce(
    (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
    obj
  );
}

function applyTranslations(t, lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const value = getNestedValue(t, el.getAttribute('data-i18n'));
    if (value !== undefined) el.innerHTML = value;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const value = getNestedValue(t, el.getAttribute('data-i18n-placeholder'));
    if (value !== undefined) el.placeholder = value;
  });

  document.documentElement.lang = lang;
}


/* ============================================================
   IMAGES PAR LANGUE
   Les carrousels et vignettes utilisent les photos du pays associé
   à la langue (images/countries/<code>/N.webp). Repli sur le pays
   de la langue par défaut si une image manque.
   ============================================================ */

function localizeCarouselImages(lang) {
  const country = CEEB_CONFIG.languageCountries[lang];
  const fallbackCountry = CEEB_CONFIG.languageCountries[CEEB_CONFIG.fallbackLang];

  document.querySelectorAll('.hero-carousel img, img.expertise-card-img, img.why-card-img').forEach(img => {
    if (!img.dataset.countrySrc) {
      img.dataset.countrySrc = img.getAttribute('src');
    }

    const pathFor = code =>
      img.dataset.countrySrc.replace(COUNTRY_PATH_SEGMENT, `/countries/${code}/`);

    img.onerror = country === fallbackCountry
      ? null
      : () => {
          img.onerror = null;
          img.src = pathFor(fallbackCountry);
        };

    img.src = pathFor(country);
  });
}


/* ============================================================
   FORMULAIRE DE CONTACT
   Objet pré-sélectionné depuis l'URL : ?subject=<objet>
   ============================================================ */

function prefillContactForm() {
  const subject = document.querySelector('#contactForm #subject');
  const wanted = new URLSearchParams(window.location.search).get('subject');
  if (!subject || !wanted) return;

  if ([...subject.options].some(option => option.value === wanted)) {
    subject.value = wanted;
  }
}


/* ============================================================
   CHANGEMENT DE LANGUE
   ============================================================ */

async function applyLanguage(lang) {
  currentLang = lang;
  window.currentLang = lang;

  const contentLang = getContentLang(lang);
  applyTranslations(await loadTranslations(contentLang), contentLang);
  localizeCarouselImages(lang);

  document.dispatchEvent(
    new CustomEvent('ceeb:langChanged', { detail: { lang, contentLang } })
  );
}

async function changeLang(lang) {
  if (!isSupportedLang(lang) || lang === currentLang) return;

  saveLang(lang);
  await applyLanguage(lang);
}


/* ============================================================
   CARROUSEL
   ============================================================ */

function initCarousel() {
  const carousel = document.querySelector('.hero-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel-track');
  const slides = carousel.querySelectorAll('.carousel-slide');
  const dots = carousel.querySelectorAll('.carousel-dot');
  const total = slides.length;
  let current = 0;
  let autoplay = null;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  function startAutoplay() {
    stopAutoplay();
    autoplay = setInterval(() => goTo(current + 1), CEEB_CONFIG.carouselAutoplay);
  }

  function stopAutoplay() {
    clearInterval(autoplay);
  }

  carousel.querySelector('.carousel-btn.prev')
    ?.addEventListener('click', () => goTo(current - 1));
  carousel.querySelector('.carousel-btn.next')
    ?.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);

  // Balayage tactile
  let startX = 0;
  carousel.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  }, { passive: true });

  goTo(0);
  startAutoplay();
}


/* ============================================================
   DIAPORAMAS
   Bloc [data-slideshow] : ses images s'affichent l'une après l'autre.
   ============================================================ */

function initSlideshows() {
  document.querySelectorAll('[data-slideshow]').forEach(block => {
    const images = block.querySelectorAll('img');
    if (images.length < 2) return;

    let index = 0;
    setInterval(() => {
      images[index].classList.remove('active');
      index = (index + 1) % images.length;
      images[index].classList.add('active');
    }, CEEB_CONFIG.slideshowInterval);
  });
}


/* ============================================================
   NAVIGATION MOBILE
   ============================================================ */

function initMobileNavigation() {
  const hamburger = document.querySelector('.nav-hamburger');
  const navMenu = document.querySelector('.nav-menu');
  if (!hamburger || !navMenu) return;

  if (!navMenu.id) navMenu.id = 'navMenu';

  const closeNav = () => {
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', event => {
    event.stopPropagation();
    const isOpen = navMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('click', event => {
    if (!navMenu.contains(event.target) && !hamburger.contains(event.target)) {
      closeNav();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeNav();
  });
}


/* ============================================================
   INITIALISATION
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  await applyLanguage(detectDefaultLang());
  prefillContactForm();
  initCarousel();
  initSlideshows();
  initMobileNavigation();
});
