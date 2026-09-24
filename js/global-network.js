/* ============================================================
   CEEB SID — global-network.js
   Section « Réseau global » de l'accueil : choix d'un pays, fiche
   (photo, description, projets clés) et galerie des 12 photos du
   pays (images/countries/<code>/N.webp). Textes : map.countries.<code>
   dans lang/<code>.js.
   ============================================================ */

const COUNTRIES = [
  { code: 'fr', flag: '🇫🇷' },
  { code: 'gb', flag: '🇬🇧' },
  { code: 'pl', flag: '🇵🇱' },
  { code: 'tr', flag: '🇹🇷' },
  { code: 'de', flag: '🇩🇪' },
  { code: 'it', flag: '🇮🇹' },
  { code: 'es', flag: '🇪🇸' },
  { code: 'sa', flag: '🇸🇦' }
];
const PHOTOS_PER_COUNTRY = 12;
const PROJECTS_PER_COUNTRY = 4;

const tabs = document.getElementById('countryTabs');
const photo = document.getElementById('countryPhoto');
const nameEl = document.getElementById('countryName');
const descEl = document.getElementById('countryDesc');
const projectsEl = document.getElementById('countryProjects');
const galleryBtn = document.getElementById('countryGalleryBtn');
const gallery = document.getElementById('galleryOverlay');
const galleryImg = document.getElementById('galleryImg');
const galleryCounter = document.getElementById('galleryCounter');

let texts = {};
let current = COUNTRIES[0];
let galleryIndex = 0;

function photoPath(country, index) {
  return `${SITE_ROOT}images/countries/${country.code}/${index}.webp`;
}

function countryText(country, key) {
  return getNestedValue(texts, `countries.${country.code}.${key}`) || '';
}


/* ============================================================
   ONGLETS ET FICHE PAYS
   ============================================================ */

function buildTabs() {
  tabs.innerHTML = COUNTRIES.map(country => `
    <button class="country-tab" type="button" role="tab" data-country="${country.code}"
            aria-selected="${country === current}">
      <span class="country-tab-flag" aria-hidden="true">${country.flag}</span>
      <span>${countryText(country, 'name')}</span>
    </button>
  `).join('');
}

function showCountry(country) {
  current = country;

  tabs.querySelectorAll('.country-tab').forEach(tab => {
    const selected = tab.dataset.country === country.code;
    tab.setAttribute('aria-selected', String(selected));
    if (selected) centerTab(tab);
  });

  photo.src = photoPath(country, 1);
  photo.alt = countryText(country, 'name');
  nameEl.textContent = `${country.flag} ${countryText(country, 'name')}`;
  descEl.textContent = countryText(country, 'desc');
  projectsEl.innerHTML = Array.from({ length: PROJECTS_PER_COUNTRY }, (_, i) =>
    `<li>${countryText(country, `item${i + 1}`)}</li>`
  ).join('');
}


// Fait défiler le carrousel des pays pour centrer l'onglet actif
function centerTab(tab) {
  tabs.scrollTo({
    left: tab.offsetLeft - (tabs.clientWidth - tab.offsetWidth) / 2,
    behavior: 'smooth'
  });
}

function showSiblingCountry(step) {
  const index = COUNTRIES.indexOf(current);
  showCountry(COUNTRIES[(index + step + COUNTRIES.length) % COUNTRIES.length]);
}


/* ============================================================
   GALERIE
   ============================================================ */

function showPhoto(index) {
  galleryIndex = (index + PHOTOS_PER_COUNTRY) % PHOTOS_PER_COUNTRY;
  galleryImg.src = photoPath(current, galleryIndex + 1);
  galleryImg.alt = `${countryText(current, 'name')} ${galleryIndex + 1}/${PHOTOS_PER_COUNTRY}`;
  galleryCounter.textContent = `${countryText(current, 'name')} — ${galleryIndex + 1} / ${PHOTOS_PER_COUNTRY}`;
}

function openGallery() {
  showPhoto(0);
  gallery.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeGallery() {
  gallery.classList.remove('open');
  document.body.style.overflow = '';
}


/* ============================================================
   ÉVÉNEMENTS
   ============================================================ */

tabs.addEventListener('click', event => {
  const tab = event.target.closest('.country-tab');
  if (tab) showCountry(COUNTRIES.find(c => c.code === tab.dataset.country));
});

document.getElementById('countryPrev').addEventListener('click', () => showSiblingCountry(-1));
document.getElementById('countryNext').addEventListener('click', () => showSiblingCountry(1));

galleryBtn.addEventListener('click', openGallery);
document.getElementById('galleryClose').addEventListener('click', closeGallery);
document.getElementById('galleryPrev').addEventListener('click', () => showPhoto(galleryIndex - 1));
document.getElementById('galleryNext').addEventListener('click', () => showPhoto(galleryIndex + 1));
gallery.addEventListener('click', event => {
  if (event.target === gallery) closeGallery();
});
document.addEventListener('keydown', event => {
  if (!gallery.classList.contains('open')) return;
  if (event.key === 'Escape') closeGallery();
  if (event.key === 'ArrowLeft') showPhoto(galleryIndex - 1);
  if (event.key === 'ArrowRight') showPhoto(galleryIndex + 1);
});

document.addEventListener('ceeb:langChanged', event => {
  texts = CEEB_DATA.translations[event.detail.contentLang]?.map || {};
  buildTabs();
  showCountry(current);
});
