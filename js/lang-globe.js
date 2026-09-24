/* ============================================================
   CEEB SID — lang-globe.js
   Sélecteur de langue (globe) + bandeau partenaires
   (liens cliquables, pop-ups, tooltips).
   Les langues et la racine du site viennent de js/app.js.
   ============================================================ */

/* ============================================================
   DONNÉES DES PARTENAIRES — POP-UPS (8 partenaires principaux)
   ============================================================ */
const PARTNER_DATA = {
  'ratp': {
    logo: 'logo-ratp-color.webp',
    name: 'RATP',
    fullName: 'RATP — Régie Autonome des Transports Parisiens',
    category: 'TRANSPORT FERROVIAIRE URBAIN',
    description: 'La RATP est le premier opérateur de transport en commun d\'Île-de-France, exploitant le métro, le RER, les tramways et les bus. Partenaire historique de C.E.E.B., la RATP confie à nos équipes des missions d\'ingénierie Second Œuvre sur ses infrastructures ferroviaires et ses bâtiments techniques.',
    domains: ['Métro & RER', 'Signalisation', 'Courants faibles', 'Éclairage', 'Sécurité incendie'],
    website: 'https://www.ratp.fr/'
  },
  'adp': {
    logo: 'logo-adp.webp',
    name: 'Groupe ADP',
    fullName: 'Groupe ADP — Aéroports de Paris',
    category: 'INFRASTRUCTURE AÉROPORTUAIRE',
    description: 'Groupe ADP conçoit, aménage et gère des aéroports en France et dans le monde, dont Paris-Charles de Gaulle et Paris-Orly. C.E.E.B. intervient sur les systèmes d\'éclairage piste, les réseaux courants faibles et les installations de sécurité des terminaux.',
    domains: ['Éclairage piste', 'Courants faibles', 'Bagagerie', 'Sécurité incendie', 'BIM'],
    website: 'https://www.parisaeroport.fr/'
  },
  'eiffage': {
    logo: 'logo-eiffage-energie.webp',
    name: 'Eiffage',
    fullName: 'Eiffage Énergie Systèmes',
    category: 'CONSTRUCTION & ÉNERGIE',
    description: 'Eiffage Énergie Systèmes est la branche énergie et systèmes du groupe Eiffage, l\'un des leaders européens de la construction. C.E.E.B. collabore avec Eiffage sur des projets d\'ingénierie électrique, de courants faibles et de gestion technique du bâtiment pour des ouvrages d\'envergure.',
    domains: ['Ingénierie électrique', 'GTB/GTC', 'Courants faibles', 'Énergie renouvelable', 'MOE'],
    website: 'https://www.eiffage.com/'
  },
  'sofre-in': {
    logo: 'logo-sofre-in.webp',
    name: 'SOFRE-IN',
    fullName: 'SOFRE-IN — Ingénierie Ferroviaire & Aéroportuaire',
    category: 'INGÉNIERIE SPÉCIALISÉE',
    description: 'SOFRE-IN est un bureau d\'études spécialisé dans l\'ingénierie ferroviaire et aéroportuaire. Partenaire de longue date de C.E.E.B., SOFRE-IN intervient en tant que sous-traitant spécialisé Second Œuvre sur les projets de grande envergure en France et à l\'international.',
    domains: ['Ingénierie ferroviaire', 'Ingénierie aéroportuaire', 'BIM', 'MOE/MOA', 'Export'],
    website: 'https://sofre-in.fr/'
  },
  'crites': {
    logo: 'logo-crites.webp',
    name: 'CRITES',
    fullName: 'CRITES — Ingénierie Ferroviaire',
    category: 'INGÉNIERIE FERROVIAIRE',
    description: 'CRITES est un bureau d\'études spécialisé dans les systèmes ferroviaires, notamment la signalisation, les télécommunications et les équipements de voie. C.E.E.B. et CRITES collaborent sur des projets de modernisation des infrastructures ferroviaires en Île-de-France et en régions.',
    domains: ['Signalisation ferroviaire', 'Télécommunications', 'Caténaire', 'Voie', 'Études techniques'],
    website: 'https://crites.fr/'
  },
  'sogefra': {
    logo: 'logo-sogefra.webp',
    name: 'SOGEFRA',
    fullName: 'SOGEFRA — Ingénierie & Construction',
    category: 'INGÉNIERIE & CONSTRUCTION',
    description: 'SOGEFRA est une société d\'ingénierie et de construction spécialisée dans les travaux d\'infrastructure et de bâtiment. Partenaire de C.E.E.B. sur des projets tertiaires et industriels, SOGEFRA apporte son expertise en maîtrise d\'œuvre et en réalisation de travaux.',
    domains: ['Génie civil', 'Bâtiment tertiaire', 'Infrastructure', 'MOE', 'Travaux'],
    website: 'https://www.sogefra.com/'
  },
  'oger': {
    logo: 'logo-oger.webp',
    name: 'Oger International',
    fullName: 'Oger International — Architecture & Ingénierie',
    category: 'ARCHITECTURE & INGÉNIERIE INTERNATIONALE',
    description: 'Oger International est un groupe d\'ingénierie et d\'architecture de renommée mondiale, actif au Moyen-Orient, en Afrique et en Europe. C.E.E.B. intervient en tant que sous-traitant spécialisé Second Œuvre sur les projets export de grande envergure.',
    domains: ['Architecture', 'Ingénierie MEP', 'Projets export', 'Moyen-Orient', 'Afrique'],
    website: 'https://www.oger.international/'
  },
  'sncf': {
    logo: 'logo-sncf.webp',
    name: 'SNCF',
    fullName: 'SNCF — Société Nationale des Chemins de Fer',
    category: 'TRANSPORT FERROVIAIRE NATIONAL',
    description: 'La SNCF est l\'opérateur ferroviaire national français, gérant le réseau grande vitesse, les trains régionaux et le fret. C.E.E.B. intervient sur les gares et bâtiments techniques SNCF pour des missions d\'ingénierie électrique, de courants faibles et de sécurité incendie.',
    domains: ['Gares & bâtiments', 'Courants faibles', 'Éclairage', 'Sécurité incendie', 'Énergie'],
    website: 'https://www.groupe-sncf.com/fr'
  }
};

/* ============================================================
   CORRESPONDANCE LOGO → CLÉ DE POP-UP
   ============================================================ */
const LOGO_TO_PARTNER = {
  'logo-ratp.webp':            'ratp',
  'logo-ratp-color.webp':      'ratp',
  'logo-sofre-in.webp':        'sofre-in',
  'logo-sofrein.webp':         'sofre-in',
  'logo-adp.webp':             'adp',
  'logo-crites.webp':          'crites',
  'logo-eiffage-energie.webp': 'eiffage',
  'logo-sogefra.webp':         'sogefra',
  'logo-sogefra-2.webp':       'sogefra',
  'logo-oger.webp':            'oger',
  'logo-sncf.webp':            'sncf'
};

/* ============================================================
   LIENS DIRECTS POUR TOUS LES PARTENAIRES
   ============================================================ */
const PARTNER_LINKS = {
  'logo-ratp.webp':                'https://www.ratp.fr/',
  'logo-ratp-color.webp':          'https://www.ratp.fr/',
  'logo-sncf.webp':                'https://www.groupe-sncf.com/fr',
  'logo-adp.webp':                 'https://www.parisaeroport.fr/',
  'logo-air-france.webp':          'https://www.airfrance.fr/',
  'logo-vinci.webp':               'https://www.vinci.com/',
  'logo-eiffage-energie.webp':     'https://www.eiffage.com/',
  'logo-fayat.webp':               'https://fayat.com/',
  'logo-oger.webp':                'https://www.oger.international/',
  'logo-sofre-in.webp':            'https://sofre-in.fr/',
  'logo-sofrein.webp':             'https://sofre-in.fr/',
  'logo-alta.webp':                'https://www.alta-ingenierie.fr/',
  'logo-crealis.webp':             'https://www.crealis.fr/',
  'logo-crites.webp':              'https://crites.fr/',
  'logo-ingenica.webp':            'https://www.ingenica.fr/',
  'logo-vulcain.webp':             'https://www.vulcain-eng.com/',
  'logo-fondasol.webp':            'https://www.fondasol.fr/',
  'logo-leica.webp':               'https://leica-geosystems.com/',
  'logo-ministere-ecologie.webp':  'https://www.ecologie.gouv.fr/',
  'logo-ministere-justice.webp':   'https://www.justice.gouv.fr/',
  'logo-france-travail.webp':      'https://www.francetravail.fr/',
  'logo-icf-habitat.webp':         'https://www.icf-habitat.fr/',
  'logo-hauts-de-seine.webp':      'https://www.hauts-de-seine.fr/',
  'logo-sogefra.webp':             'https://www.sogefra.com/',
  'logo-sogefra-2.webp':           'https://www.sogefra.com/'
};

/* ============================================================
   NOMS COMPLETS POUR LES TOOLTIPS
   ============================================================ */
const PARTNER_NAMES = {
  'logo-ratp.webp':               'RATP — Régie Autonome des Transports Parisiens',
  'logo-ratp-color.webp':         'RATP — Régie Autonome des Transports Parisiens',
  'logo-sncf.webp':               'SNCF — Société Nationale des Chemins de Fer',
  'logo-adp.webp':                'Groupe ADP — Aéroports de Paris',
  'logo-air-france.webp':         'Air France',
  'logo-vinci.webp':              'Vinci Construction',
  'logo-eiffage-energie.webp':    'Eiffage Énergie Systèmes',
  'logo-fayat.webp':              'Groupe Fayat',
  'logo-oger.webp':               'Oger International',
  'logo-sofre-in.webp':           'SOFRE-IN — Ingénierie Ferroviaire & Aéroportuaire',
  'logo-sofrein.webp':            'SOFRE-IN — Ingénierie Ferroviaire & Aéroportuaire',
  'logo-alta.webp':               'ALTA Ingénierie',
  'logo-crealis.webp':            'Créalis',
  'logo-crites.webp':             'CRITES — Ingénierie Ferroviaire',
  'logo-ingenica.webp':           'Ingenica',
  'logo-vulcain.webp':            'Vulcain Engineering',
  'logo-fondasol.webp':           'Fondasol — Géotechnique & Environnement',
  'logo-leica.webp':              'Leica Geosystems',
  'logo-ministere-ecologie.webp': 'Ministère de la Transition Écologique',
  'logo-ministere-justice.webp':  'Ministère de la Justice',
  'logo-france-travail.webp':     'France Travail',
  'logo-icf-habitat.webp':        'ICF Habitat',
  'logo-hauts-de-seine.webp':     'Département des Hauts-de-Seine',
  'logo-sogefra.webp':            'SOGEFRA — Ingénierie & Construction',
  'logo-sogefra-2.webp':          'SOGEFRA — Ingénierie & Construction',
  'logo-acf.webp':                'ACF',
  'logo-affaires-etrangeres.webp':'Ministère des Affaires Étrangères',
  'logo-ambassade-irlande.webp':  "Ambassade d'Irlande",
  'logo-civipol.webp':            'Civipol',
  'logo-codeel.webp':             'Codeel',
  'logo-derka.webp':              'Derka',
  'logo-detect-reseaux.webp':     'Détect Réseaux',
  'logo-eri.webp':                'ERI',
  'logo-foliateam.webp':          'Foliateam',
  'logofoliateam.webp':           'Foliateam',
  'logo-gemplus.webp':            'Gemplus',
  'logo-hologarde.webp':          'Hologarde',
  'logo-la-sabliere.webp':        'La Sablière',
  'logo-prevention-consultants.webp': 'Prévention Consultants',
  'logo-setrans.webp':            'Setrans',
  'logo-ville-de-roubaix.webp':   'Ville de Roubaix',
  'logo-ceeb.webp':               'C.E.E.B.'
};

/* ============================================================
   GLOBE SÉLECTEUR — CONSTRUCTION
   ============================================================ */
function buildGlobeSelector(currentLang) {
  document.querySelectorAll('.nav-lang').forEach(navLang => {
    navLang.innerHTML = '';
    const languages = Object.entries(CEEB_CONFIG.languages)
      .map(([code, name]) => ({ code, name }));
    const activeLang = languages.find(l => l.code === currentLang) || languages[0];

    const globeBtn = document.createElement('button');
    globeBtn.className = 'lang-globe-btn';
    globeBtn.setAttribute('aria-haspopup', 'listbox');
    globeBtn.setAttribute('aria-expanded', 'false');
    globeBtn.setAttribute('aria-label', 'Sélectionner la langue');
    globeBtn.innerHTML = `
      <svg class="lang-globe-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
      <span class="lang-globe-current">${activeLang.code.toUpperCase()}</span>
      <svg class="lang-globe-caret" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
        <path d="M1 1l4 4 4-4"/>
      </svg>
    `;

    const dropdown = document.createElement('div');
    dropdown.className = 'lang-dropdown';
    dropdown.setAttribute('role', 'listbox');
    dropdown.setAttribute('aria-label', 'Langues disponibles');

    const header = document.createElement('div');
    header.className = 'lang-dropdown-header';
    header.textContent = 'Choisir la langue';
    dropdown.appendChild(header);

    const list = document.createElement('ul');
    list.className = 'lang-dropdown-list';

    languages.forEach(lang => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.className = 'lang-dropdown-item' + (lang.code === currentLang ? ' active' : '');
      btn.setAttribute('role', 'option');
      btn.setAttribute('aria-selected', lang.code === currentLang ? 'true' : 'false');
      btn.setAttribute('data-lang', lang.code);
      btn.innerHTML = `
        <span class="lang-name">${lang.name}</span>
        <span class="lang-code-badge">${lang.code.toUpperCase()}</span>
        <span class="lang-check" aria-hidden="true">✓</span>
      `;
      btn.addEventListener('click', () => {
        changeLang(lang.code);
        closeAllDropdowns();
      });
      li.appendChild(btn);
      list.appendChild(li);
    });

    dropdown.appendChild(list);
    navLang.appendChild(globeBtn);
    navLang.appendChild(dropdown);

    globeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('open');
      closeAllDropdowns();
      if (!isOpen) {
        dropdown.classList.add('open');
        globeBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', closeAllDropdowns);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDropdowns();
  });
}

function closeAllDropdowns() {
  document.querySelectorAll('.lang-dropdown.open').forEach(d => {
    d.classList.remove('open');
    const btn = d.previousElementSibling;
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });
}

function updateGlobeDisplay(langCode) {
  document.querySelectorAll('.lang-globe-current').forEach(el => {
    el.textContent = langCode.toUpperCase();
  });
  document.querySelectorAll('.lang-dropdown-item').forEach(item => {
    const isActive = item.getAttribute('data-lang') === langCode;
    item.classList.toggle('active', isActive);
    item.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
}

/* ============================================================
   BANDEAU PARTENAIRES — LIENS + TOOLTIPS + POP-UPS
   ============================================================ */
function buildPartnerBandeau() {
  document.querySelectorAll('.partners-list').forEach((list, listIndex) => {
    const items = list.querySelectorAll('li');
    items.forEach(li => {
      const img = li.querySelector('.partner-logo');
      if (!img) return;

      const filename = (img.getAttribute('src') || '').split('/').pop();
      const partnerKey = LOGO_TO_PARTNER[filename];
      const partnerName = PARTNER_NAMES[filename] || img.getAttribute('alt') || '';
      const partnerUrl = PARTNER_LINKS[filename] || null;

      const wrapper = document.createElement('div');
      wrapper.className = 'partner-item';

      // Tooltip
      if (partnerName) {
        const tooltip = document.createElement('span');
        tooltip.className = 'partner-tooltip';
        tooltip.textContent = partnerName;
        tooltip.setAttribute('role', 'tooltip');
        wrapper.appendChild(tooltip);
      }

      const newImg = img.cloneNode(true);

      if (partnerKey && PARTNER_DATA[partnerKey]) {
        // Bouton pop-up (partenaires principaux)
        const btn = document.createElement('button');
        btn.className = 'partner-logo-btn';
        btn.setAttribute('type', 'button');
        btn.setAttribute('aria-label', 'En savoir plus sur ' + PARTNER_DATA[partnerKey].name);
        btn.setAttribute('data-partner', partnerKey);
        btn.appendChild(newImg);
        wrapper.appendChild(btn);
        btn.addEventListener('click', () => openPartnerModal(partnerKey));
      } else if (partnerUrl) {
        // Lien direct (autres partenaires)
        const link = document.createElement('a');
        link.href = partnerUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'partner-logo-btn';
        link.setAttribute('aria-label', 'Visiter le site de ' + (partnerName || img.alt));
        link.appendChild(newImg);
        wrapper.appendChild(link);
      } else {
        // Pas de lien
        wrapper.appendChild(newImg);
      }

      li.innerHTML = '';
      li.appendChild(wrapper);
    });
  });
}

/* ============================================================
   POP-UP PARTENAIRE
   ============================================================ */
function openPartnerModal(partnerKey) {
  const data = PARTNER_DATA[partnerKey];
  if (!data) return;

  // Supprimer une pop-up éventuellement déjà ouverte
  const existing = document.querySelector('.partner-modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'partner-modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'partnerModalName');

  const domainsHTML = data.domains.map(d =>
    '<span class="partner-domain-tag">' + d + '</span>'
  ).join('');

  overlay.innerHTML = `
    <div class="partner-modal">
      <button class="partner-modal-close" aria-label="Fermer">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
          <path d="M1 1l12 12M13 1L1 13"/>
        </svg>
      </button>
      <div class="partner-modal-header">
        <img class="partner-modal-logo"
             src="${SITE_ROOT}images/partners/${data.logo}"
             alt="Logo ${data.name}"
             onerror="this.style.display='none'">
        <div>
          <div class="partner-modal-name" id="partnerModalName">${data.fullName}</div>
          <div class="partner-modal-category">${data.category}</div>
        </div>
      </div>
      <div class="partner-modal-body">
        <p class="partner-modal-desc">${data.description}</p>
        <div class="partner-modal-domains-title">Domaines d'activité</div>
        <div class="partner-modal-domains">${domainsHTML}</div>
        <div class="partner-modal-actions">
          <a class="partner-modal-link"
             href="${data.website}"
             target="_blank"
             rel="noopener noreferrer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Visiter le site officiel
          </a>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.add('open');
    });
  });

  const closeBtn = overlay.querySelector('.partner-modal-close');
  closeBtn.addEventListener('click', () => closePartnerModal(overlay));
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePartnerModal(overlay);
  });

  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closePartnerModal(overlay);
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
  closeBtn.focus();
}

function closePartnerModal(overlay) {
  overlay.classList.remove('open');
  setTimeout(() => {
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }, 300);
}

/* ============================================================
   ÉCOUTER LES CHANGEMENTS DE LANGUE
   ============================================================ */
document.addEventListener('ceeb:langChanged', (e) => {
  updateGlobeDisplay(e.detail.lang);
});

/* ============================================================
   INITIALISATION
   ============================================================ */
function initGlobeAndPartners() {
  buildGlobeSelector(window.currentLang);
  buildPartnerBandeau();
}

document.addEventListener('DOMContentLoaded', initGlobeAndPartners);
