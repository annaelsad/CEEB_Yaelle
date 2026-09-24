/* ============================================================
   CEEB SID — app-rec.js
   Offres d'emploi : chargement des données par langue d'offre,
   filtres, recherche, cartes et fiche détaillée.
   Données : recruitment/jobs/<code>.js. Libellés de l'interface :
   recruitmentPage.jobs dans lang/<code>.js.
   ============================================================ */

// Filtre de zone, d'après le pays du lieu de travail de chaque offre
// (champ « country ») : toutes les offres en anglais, les postes en France
// en français, les postes à l'international en anglais.
const SCOPES = {
  all: { dataLang: "en", matches: () => true },
  france: { dataLang: "fr", matches: job => job.country === "FR" },
  abroad: { dataLang: "en", matches: job => job.country !== "FR" }
};
const DEFAULT_SCOPE = "all";
let currentScope = DEFAULT_SCOPE;

// Adresse qui reçoit les candidatures
const APPLY_EMAIL = "cv@ceeb.fr";

let ui = {};
let recruitmentData = {};
let currentJobs = [];

const jobsGrid = document.getElementById("jobsGrid");
const jobsCount = document.getElementById("jobsCount");
const modalOverlay = document.getElementById("jobModal");
const modalBody = document.getElementById("jobModalBody");
const categorySelect = document.getElementById("filterCategory");
const sectorSelect = document.getElementById("filterSector");
const levelSelect = document.getElementById("filterLevel");
const scopeSelect = document.getElementById("filterScope");
const searchInput = document.getElementById("jobSearch");
const searchBtn = document.getElementById("jobSearchBtn");
const resetBtn = document.getElementById("filterReset");
const modalCloseBtn = document.querySelector("#jobModal .modal-close");

const SEARCH_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

function t(key) {
  return ui[key] || "";
}


/* ============================================================
   CHARGEMENT DES DONNÉES
   ============================================================ */

async function showOffers(scope) {
  currentScope = scope;
  const offerLang = SCOPES[scope].dataLang;

  if (!CEEB_DATA.jobs[offerLang]) {
    try {
      await loadDataScript(`${SITE_ROOT}recruitment/jobs/${offerLang}.js`);
    } catch (error) {
      console.error(error);
      return;
    }
  }

  recruitmentData = CEEB_DATA.jobs[offerLang];
  fillFilters();
  render();
}

function applyUiTranslations() {
  searchInput.placeholder = t("searchPlaceholder");
  searchBtn.innerHTML = SEARCH_ICON;
  resetBtn.textContent = t("reset");
  scopeSelect.setAttribute("aria-label", t("scope"));
  scopeSelect.options[0].textContent = t("scopeAll");
  scopeSelect.options[1].textContent = t("scopeFrance");
  scopeSelect.options[2].textContent = t("scopeAbroad");
}

function fillSelect(select, allLabel, options) {
  const selected = select.value;
  select.innerHTML =
    `<option value="">${allLabel}</option>` +
    options.map(o => `<option value="${o.id}">${o.name}</option>`).join("");
  select.value = options.some(o => o.id === selected) ? selected : "";
}

function fillFilters() {
  fillSelect(categorySelect, t("allCategories"), recruitmentData.categories || []);
  fillSelect(sectorSelect, t("allSectors"), recruitmentData.sectors || []);
  fillSelect(levelSelect, t("allLevels"), recruitmentData.experienceLevels || []);
}


/* ============================================================
   FILTRES ET CARTES
   ============================================================ */

function matchesFilters(job) {
  const category = categorySelect.value;
  const sector = sectorSelect.value;
  const level = levelSelect.value;
  const query = searchInput.value.trim().toLowerCase();

  if (!SCOPES[currentScope].matches(job)) return false;
  if (category && job.categoryId !== category) return false;
  if (sector && !(job.sectorIds || []).includes(sector)) return false;
  if (level && job.experienceLevelId !== level) return false;

  if (query) {
    const haystack = [job.jobHeading, job.location, job.reference, ...(job.skills || [])]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  }

  return true;
}

function mailtoUrl(subject) {
  return `mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

// Lien de candidature : mail avec le code et l'intitulé du poste en objet
function applyUrl(job) {
  return mailtoUrl(`${t("applySubject")} ${job.reference} – ${job.jobHeading}`);
}

// Boutons de candidature générale (objet traduit : attribut data-mail-subject)
function applyGeneralMailLinks(translations) {
  document.querySelectorAll("a[data-mail-subject]").forEach(link => {
    link.href = mailtoUrl(getNestedValue(translations, link.dataset.mailSubject) || "");
  });
}

function applyButton(job) {
  return `<a class="job-btn-apply" href="${applyUrl(job)}">${t("apply")}</a>`;
}

function render() {
  currentJobs = (recruitmentData.jobs || []).filter(matchesFilters);

  jobsCount.textContent = `${t("displaying")} ${currentJobs.length} ${t("jobOffers")}`;

  if (currentJobs.length === 0) {
    jobsGrid.innerHTML = `<div class="job-card job-card-empty"><p>${t("noResults")}</p></div>`;
    return;
  }

  jobsGrid.innerHTML = currentJobs.map((job, index) => `
    <article class="job-card">
      <div class="job-card-header">
        <div class="job-title">${job.jobHeading}</div>
        <span class="job-badge">${job.jobType}</span>
      </div>
      <div class="job-location">📍 ${job.location}</div>
      <div class="job-ref">${t("reference")} ${job.reference}</div>
      <p class="job-desc">${job.description}</p>
      <div class="job-tags">
        ${(job.skills || []).map(skill => `<span class="job-tag">${skill}</span>`).join("")}
      </div>
      <div class="job-actions">
        <button class="job-btn-detail" type="button" data-job-index="${index}">${t("seeDetails")}</button>
        ${applyButton(job)}
      </div>
    </article>
  `).join("");
}


/* ============================================================
   FICHE DÉTAILLÉE
   ============================================================ */

function renderList(title, items) {
  if (!items || items.length === 0) return "";
  return `
    <div class="section-title">${title}</div>
    <ul class="job-modal-list">${items.map(item => `<li>${item}</li>`).join("")}</ul>
  `;
}

function openModal(index) {
  const job = currentJobs[index];
  if (!job) return;

  const hasDetails = job.missions || job.profile;

  modalBody.innerHTML = `
    <h2>${job.jobHeading}</h2>
    <p class="job-modal-meta">📍 ${job.location} &nbsp;|&nbsp; 💼 ${job.jobType} &nbsp;|&nbsp; ${t("reference")} ${job.reference}</p>
    <div class="section-title">${t("about")}</div>
    <p class="job-modal-text">${job.description}</p>
    ${renderList(t("skills"), job.skills)}
    ${hasDetails
      ? renderList(t("missions"), job.missions) + renderList(t("profile"), job.profile)
      : renderList(t("responsibilities"), [t("workRealProjects"), t("collaborateTeams"), t("deliverQuality")]) +
        renderList(t("weOffer"), [t("permanentContract"), t("careerGrowth"), t("competitiveSalary")])}
    <div class="job-modal-actions">${applyButton(job)}</div>
  `;

  modalOverlay.classList.add("open");
}

function closeModal() {
  modalOverlay.classList.remove("open");
}

function resetFilters() {
  categorySelect.value = "";
  sectorSelect.value = "";
  levelSelect.value = "";
  searchInput.value = "";
  scopeSelect.value = DEFAULT_SCOPE;
  showOffers(DEFAULT_SCOPE);
}


/* ============================================================
   ÉVÉNEMENTS
   ============================================================ */

[categorySelect, sectorSelect, levelSelect].forEach(select => {
  select.addEventListener("change", render);
});
scopeSelect.addEventListener("change", () => showOffers(scopeSelect.value));
searchInput.addEventListener("input", render);
searchBtn.addEventListener("click", render);
resetBtn.addEventListener("click", resetFilters);

jobsGrid.addEventListener("click", event => {
  const button = event.target.closest(".job-btn-detail");
  if (button) openModal(Number(button.dataset.jobIndex));
});

modalCloseBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", event => {
  if (event.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModal();
});

// La langue du site change les libellés de l'interface ; les offres
// restent celles de la zone choisie.
document.addEventListener("ceeb:langChanged", event => {
  const translations = CEEB_DATA.translations[event.detail.contentLang];
  ui = getNestedValue(translations, "recruitmentPage.jobs") || {};
  applyUiTranslations();
  applyGeneralMailLinks(translations);
  showOffers(scopeSelect.value || DEFAULT_SCOPE);
});
