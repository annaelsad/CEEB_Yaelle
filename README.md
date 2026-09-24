# Site C.E.E.B. — guide du développeur

Site vitrine statique de C.E.E.B. (bureau d'études d'ingénierie Second Œuvre) :
HTML, CSS et JavaScript sans dépendance, sans framework et sans étape de build.
Ce guide décrit l'architecture, les conventions et les procédures courantes
pour reprendre le site sans connaître son historique.

## Sommaire

1. [Démarrer](#1-démarrer)
2. [Arborescence](#2-arborescence)
3. [Architecture](#3-architecture)
4. [Langues et traductions](#4-langues-et-traductions)
5. [Photos par pays et carrousels](#5-photos-par-pays-et-carrousels)
6. [Page Carrières et offres d'emploi](#6-page-carrières-et-offres-demploi)
7. [Section Réseau global (accueil)](#7-section-réseau-global-accueil)
8. [Autres composants](#8-autres-composants)
9. [Feuille de style](#9-feuille-de-style)
10. [Procédures courantes](#10-procédures-courantes)
11. [Mise en ligne et cache](#11-mise-en-ligne-et-cache)
12. [Contrôles avant livraison](#12-contrôles-avant-livraison)
13. [Points d'attention et pistes](#13-points-dattention-et-pistes)

## 1. Démarrer

Aucune installation. Deux façons d'ouvrir le site :

- **Depuis le disque** : double-cliquer sur `index.html`. Tout fonctionne ainsi,
  y compris les traductions et les offres d'emploi, parce que les données sont
  des scripts et non des fichiers chargés par `fetch`.
  Sur macOS, si Chrome ouvre la page sans style, c'est que Chrome n'a pas
  l'accès au dossier « Documents » (Réglages Système → Confidentialité et
  sécurité → Fichiers et dossiers).
- **Avec un serveur local**, depuis le dossier du site :

  ```bash
  python3 -m http.server 8765
  ```

  puis ouvrir `http://localhost:8765/`. Le fichier `.claude/launch.json`
  lance ce même serveur depuis l'aperçu de l'application Claude.

Forcer une langue pour tester : ajouter `?lang=fr`, `?lang=en`, `?lang=pl`
ou `?lang=tr` à l'adresse.

## 2. Arborescence

```
index.html                 Accueil
about/index.html           À propos
expertise/index.html       Expertises
recruitment/index.html     Carrières (offres d'emploi)
contact/index.html         Contact
css/styles.css             Toute la mise en forme (une seule feuille)
js/app.js                  Cœur : configuration, langues, traductions, images par pays,
                           carrousel, diaporamas, menu mobile, cartes retournables
js/lang-globe.js           Sélecteur de langue (globe) et bandeau partenaires (pop-ups)
js/global-network.js       Section « Réseau global » de l'accueil (pays, fiche, galerie)
recruitment/app-rec.js     Offres d'emploi : filtres, recherche, fiche, candidature
recruitment/jobs/fr.js     Offres en français (postes en France)
recruitment/jobs/en.js     Offres en anglais (toutes les offres)
lang/fr.js  en.js  pl.js  tr.js   Textes du site, une langue par fichier
images/countries/<pays>/1..12.webp   12 photos par pays (fr gb pl tr de it es sa)
images/about/construction/          Photos du diaporama « construction du siège »
images/expertise/references/        Photos des encarts « Projets de référence »
images/testimonials/                Logos recadrés des témoignages
images/partners/                    Logos du bandeau partenaires et des pop-ups
images/{about,expertise,expertise-photos,icons,logo,services,values}/   Autres visuels
sitemap.xml                Plan du site (5 pages × 4 langues)
```

Les scripts sont chargés en fin de page avec `defer`, dans cet ordre :
`app.js`, `lang-globe.js`, puis `global-network.js` (accueil) ou `app-rec.js`
(Carrières). `app.js` doit rester en premier : les autres scripts utilisent
ses variables globales (`CEEB_CONFIG`, `CEEB_DATA`, `SITE_ROOT`,
`loadDataScript`, `getNestedValue`).

## 3. Architecture

### Principes

- **Une page = un fichier HTML complet.** Pas de gabarit partagé : l'en-tête,
  la navigation et le pied de page sont répétés dans chaque page. Une
  modification de navigation ou de pied de page se fait donc dans les 5 fichiers.
- **Le HTML contient les textes français.** Chaque texte traduisible porte un
  attribut `data-i18n="cle.du.texte"` (ou `data-i18n-placeholder` pour un
  champ de formulaire). Au chargement, `app.js` remplace le contenu par la
  valeur de la langue courante. La balise `<title>` est traduite de la même façon.
- **Les données sont des scripts, pas des JSON.** `lang/<code>.js` et
  `recruitment/jobs/<code>.js` sont des fichiers JavaScript qui affectent un
  objet JSON à `CEEB_DATA.translations.<code>` ou `CEEB_DATA.jobs.<code>`.
  `app.js` les charge à la demande en insérant une balise `<script>`
  (`loadDataScript`). Cela fonctionne en `file://`, là où `fetch` est bloqué.
- **Racine du site déduite du script** : `SITE_ROOT` est calculé depuis
  l'emplacement de `js/app.js`. Le site peut être servi à la racine d'un
  domaine ou dans un sous-dossier sans rien changer.
- **Aucun style en ligne dans les pages.** Toute la mise en forme est dans
  `css/styles.css`.

### `app.js` en un coup d'œil

| Bloc | Rôle |
| --- | --- |
| `CEEB_CONFIG` | Langues, pays associés, langue de repli, clé de stockage, durées des carrousels |
| Détection de la langue | `detectDefaultLang`, `detectVisitorCountry`, `getContentLang` |
| Traductions | `loadTranslations`, `applyTranslations`, `getNestedValue` |
| Images par pays | `localizeCarouselImages` |
| Changement de langue | `applyLanguage`, `changeLang` (émet l'événement `ceeb:langChanged`) |
| Composants | `initCarousel`, `initSlideshows`, `initMobileNavigation`, `initFlipCards` |
| Formulaire de contact | `prefillContactForm` (objet présélectionné via `?subject=`) |

L'événement `ceeb:langChanged` porte `{ lang, contentLang }` : `lang` est la
langue choisie par le visiteur, `contentLang` celle dans laquelle la page
s'affiche (voir « pages limitées à certaines langues »). Les autres scripts
s'y abonnent pour se mettre à jour.

## 4. Langues et traductions

### Langues disponibles

`fr`, `en`, `pl`, `tr`, déclarées dans `CEEB_CONFIG.languages` (`js/app.js`).
Le sélecteur globe et tout le reste du site lisent cette liste ; il n'y en a pas d'autre.

### Langue à l'arrivée

Ordre de priorité, dans `detectDefaultLang` :

1. paramètre d'URL `?lang=xx` ;
2. choix mémorisé du visiteur (`localStorage`, clé `ceeb_lang`, écrit seulement
   quand le visiteur choisit une langue dans le globe) ;
3. pays du visiteur, déduit du fuseau horaire du navigateur
   (`timezoneCountries` puis `countryLanguages`) : France → `fr`,
   Pologne → `pl`, Turquie → `tr` ;
4. anglais partout ailleurs (`fallbackLang`).

### Pages limitées à certaines langues

Les pages Carrières et Contact n'existent qu'en français et en anglais :
leur balise `<body>` porte `data-languages="fr,en"`. Pour un visiteur
polonais ou turc, elles s'affichent en anglais ; le globe continue d'afficher
PL ou TR et les photos restent celles de son pays. Retirer l'attribut suffit
pour réactiver les traductions polonaise et turque, qui existent dans les
fichiers de langue.

### Fichiers de langue

Les 4 fichiers ont exactement les mêmes clés, organisées par page puis par
section (`nav`, `hero`, `aboutPage`, `expertisePage`, `recruitmentPage`,
`contactPage`, `map`, `testimonials`, `pageTitle`, `footer`…). Les valeurs
peuvent contenir du HTML simple (`<strong>`, `<br>`), injecté tel quel.

Quelques clés sont utilisées par les scripts et non par un `data-i18n` :

- `map.countries.<pays>.{name,desc,item1..item4}` (Réseau global) ;
- `recruitmentPage.jobs.*` (interface des offres : filtres, boutons, fiche,
  message « aucun résultat », objet du mail de candidature) ;
- `recruitmentPage.cta.mailSubject` et `recruitmentPage.spontaneous.mailSubject`
  (objets des mails de candidature générale, via l'attribut `data-mail-subject`).

Une clé absente laisse le texte français du HTML en place : c'est le filet de
sécurité, mais aussi le symptôme d'un oubli de traduction.

### Balises de référencement

Chaque page déclare ses versions linguistiques (`<link rel="alternate" hreflang>`),
reprises dans `sitemap.xml`. Ajouter une langue implique de compléter ces deux endroits.

## 5. Photos par pays et carrousels

`images/countries/<code>/1.webp` … `12.webp` : 12 photos d'infrastructures par
pays. Codes : `fr` France, `gb` Royaume-Uni et Irlande, `pl` Pologne,
`tr` Turquie, `de` Allemagne, `it` Italie, `es` Espagne, `sa` Arabie saoudite.

Deux usages :

- **Carrousels et vignettes** : les pages référencent la version française
  (`images/countries/fr/N.webp`). `localizeCarouselImages` remplace le code
  pays selon la langue (`CEEB_CONFIG.languageCountries` : `fr` → `fr`,
  `en` → `gb`, `pl` → `pl`, `tr` → `tr`), avec repli sur le pays de la langue
  par défaut si une image manque. Sont concernées les images du carrousel
  d'en-tête (`.hero-carousel img`) et les vignettes `.expertise-card-img` et
  `.why-card-img`. Les autres images du site ne changent pas avec la langue.
- **Section Réseau global** : galerie des 12 photos du pays choisi.

Le carrousel d'en-tête (`initCarousel`) est purement HTML : une `div.carousel-slide`
par diapositive avec son image et sa légende traduisible, autant de
`button.carousel-dot` que de diapositives. Les 5 pages en ont 12 (2 sur Contact).

## 6. Page Carrières et offres d'emploi

### Données

`recruitment/jobs/fr.js` et `recruitment/jobs/en.js`, même structure :

```js
CEEB_DATA.jobs.fr = {
  "categories": [{ "id": "engineering", "name": "Ingénierie" }, ...],
  "sectors": [{ "id": "railway", "name": "Ferroviaire" }, ...],
  "experienceLevels": [{ "id": "senior", "name": "5+ ans" }, ...],
  "jobs": [{
    "jobHeading": "Ingénieur Électrique Senior",
    "reference": "IES-104",          // code unique, identique dans toutes les langues
    "jobType": "CDI",
    "location": "Fontenay-sous-Bois (94)",
    "country": "FR",                 // pays du lieu de travail, code ISO
    "categoryId": "engineering",
    "sectorIds": ["railway", "airport"],
    "experienceLevelId": "senior",   // ou null si non précisé
    "description": "…",
    "skills": ["Électricité", "Ingénierie"],
    "missions": ["…"],               // optionnel : liste affichée dans la fiche
    "profile": ["…"]                 // optionnel : idem
  }]
};
```

### Règles d'affichage (`recruitment/app-rec.js`)

- Filtre « Zone géographique » (`SCOPES`) : **Toutes les zones** affiche
  toutes les offres en anglais ; **France** les offres dont `country` vaut
  `FR`, en français ; **International** les offres hors de France, en anglais.
  Une offre à l'étranger n'a donc besoin d'exister que dans `en.js`.
- Les libellés de l'interface viennent de `recruitmentPage.jobs` dans les
  fichiers de langue (langue de la page), les contenus des offres du fichier
  d'offres (langue de la zone).
- La recherche porte sur le titre, le lieu, la référence et les compétences.
- La fiche détaillée affiche `missions` et `profile` si présents, sinon des
  rubriques génériques (responsabilités, avantages).
- **Candidature par mail** : les boutons « Postuler » ouvrent
  `mailto:` vers `APPLY_EMAIL` (constante en tête de `app-rec.js`) avec
  l'objet « Candidature CODE – Intitulé ». Les boutons « Envoyer ma
  candidature » et « Candidature spontanée » utilisent la même adresse avec
  un objet général traduit (`data-mail-subject`).

## 7. Section Réseau global (accueil)

`js/global-network.js` construit les onglets pays à partir de la constante
`COUNTRIES` (code et drapeau) et des textes `map.countries.<code>` ; au clic,
la fiche affiche la photo 1 du pays, sa description et ses 4 projets clés ;
le bouton de la photo ouvre la galerie des 12 photos (flèches, touches ← →,
Échap). Sur téléphone, les onglets défilent horizontalement et les flèches
passent au pays suivant.

Ajouter un pays : un dossier `images/countries/<code>/` avec 12 photos, une
entrée dans `COUNTRIES`, et les 6 textes `map.countries.<code>.*` dans les 4
fichiers de langue.

## 8. Autres composants

- **Sélecteur de langue et partenaires** (`js/lang-globe.js`) : le globe est
  généré dans chaque `li.nav-lang` ; le bandeau partenaires transforme chaque
  logo en lien ou en pop-up selon `PARTNER_DATA`, `PARTNER_LINKS` et
  `PARTNER_NAMES` (textes en français uniquement).
- **Diaporamas** (`initSlideshows`) : tout bloc `[data-slideshow]` fait
  défiler ses `<img>` en fondu (intervalle `slideshowInterval`). Utilisé pour
  la construction du siège sur la page À propos.
- **Cartes retournables** (`initFlipCards`, page Expertises, encarts
  Synergies) : retournement au survol sur ordinateur, boutons + et − au
  toucher et au clavier.
- **Témoignages** (accueil) : 4 cartes statiques dans `index.html`, textes
  dans `testimonials.itemN`, logos recadrés dans `images/testimonials/`.
- **Menu mobile** : replié (burger) jusqu'à 1024 px pour garder le choix de
  langue accessible sur tablette en portrait.
- **Formulaire de contact** : `?subject=<valeur d'option>` présélectionne
  l'objet. Le formulaire n'a pas de traitement d'envoi côté serveur ; à
  brancher sur le service de votre choix (`form-success` et `form-error`
  sont prêts pour les messages).

## 9. Feuille de style

`css/styles.css`, un seul fichier organisé par sections commentées : variables
(`:root`), base, navigation, carrousel, sections génériques, puis une section
par page, les composants ajoutés (réseau global, témoignages, synergies,
diaporama, galerie), les classes issues des anciens styles en ligne, et les
règles responsives (`@media`, points de rupture 1280, 1024, 768, 480 px).

Conventions :

- couleurs, rayons, ombres et transitions passent par les variables de `:root`
  (`--color-primary`, `--color-accent`, `--border-radius-lg`, `--shadow-md`…) ;
- une classe par composant, modificateurs avec `--` (`.synergy-badge--ceeb`),
  pas d'`id` pour le style ;
- attention à la spécificité dans les règles responsives : un sélecteur
  `:first-child` d'un point de rupture large bat un `> *` d'un point de rupture
  étroit, même placé après (cas déjà rencontré sur le pied de page).

## 10. Procédures courantes

**Modifier un texte** : trouver sa clé dans la page (`data-i18n`), puis
changer la valeur dans les 4 fichiers `lang/`. Mettre aussi à jour le texte
français du HTML pour cohérence.

**Ajouter une offre d'emploi** : ajouter l'objet dans `recruitment/jobs/en.js`
(et dans `fr.js` si le poste est en France), avec une `reference` unique et
un `country`. Rien d'autre à faire.

**Ajouter une langue** : déclarer le code dans `CEEB_CONFIG.languages` et,
si besoin, le pays associé dans `languageCountries` ; créer `lang/<code>.js`
avec toutes les clés ; ajouter les balises `hreflang` dans les 5 pages et
dans `sitemap.xml`. Le globe se met à jour seul.

**Ajouter des photos de chantier** (diaporama du siège) : déposer les fichiers
dans `images/about/construction/` et ajouter une balise `<img>` par photo
dans le bloc `data-slideshow` de `about/index.html`.

**Changer un témoignage** : texte dans `testimonials.itemN.quote` et
`testimonials.itemN.role` des 4 langues, initiales et logo dans `index.html`.

**Changer l'adresse de candidature** : `APPLY_EMAIL` dans
`recruitment/app-rec.js`.

**Remplacer les photos d'un pays** : 12 fichiers `1.webp` … `12.webp` dans
`images/countries/<code>/`, format paysage, 1600 px de large conseillés.

## 11. Mise en ligne et cache

Le site se déploie par simple copie des fichiers (hébergement statique, GitHub
Pages, FTP). Le dépôt GitHub `annaelsad/CEEB_Yaelle` sert de référence ;
travailler sur une branche, puis fusionner dans `main`.

Les liens vers `styles.css` et les scripts portent un numéro de version
(`?v=20260924c`) dans les 5 pages. **À chaque modification de CSS ou de JS,
incrémenter ce numéro dans les 5 pages**, sinon les visiteurs peuvent garder
une ancienne version en cache.

## 12. Contrôles avant livraison

- Ouvrir chaque page avec `?lang=fr`, `?lang=en`, `?lang=pl`, `?lang=tr` :
  textes traduits, photos du bon pays, aucun texte français résiduel en
  anglais.
- Vérifier la largeur téléphone (390 px) : pas de défilement horizontal, pied
  de page sur une colonne, cartes d'offres centrées.
- Ouvrir la console du navigateur : aucune erreur, aucune ressource en 404.
- Page Carrières : les trois zones du filtre, une recherche par code
  (ex. `STMO-511`), un mail de candidature.
- Numéro de version des liens CSS/JS incrémenté.

## 13. Points d'attention et pistes

- Les textes des témoignages, des pays du Réseau global et de certaines
  légendes de carrousel ont été rédigés pour la maquette : à faire valider par
  C.E.E.B.
- Les traductions polonaise et turque n'ont pas été relues par un locuteur natif.
- Plusieurs photos des dossiers `gb` et `fr` sont en basse définition pour un
  bandeau plein écran.
- Le formulaire de contact n'envoie rien (voir section 8).
- Le bandeau partenaires (`lang-globe.js`) n'est pas traduit.
- Pistes : factoriser en-tête et pied de page si le nombre de pages augmente ;
  minifier CSS et JS au déploiement ; ajouter des tests de non-régression
  visuels (captures à 390 et 1280 px).
