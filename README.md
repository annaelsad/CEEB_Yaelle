# Site C.E.E.B.

Site statique multilingue : HTML, CSS et JavaScript sans dépendance ni étape de build.

## Langues

Quatre langues : français (`fr`), anglais (`en`), polonais (`pl`), turc (`tr`).
Les textes sont dans `lang/<code>.js` (un objet JSON affecté à
`CEEB_DATA.translations.<code>`), appliqués via les attributs `data-i18n`.

Langue affichée au chargement, par ordre de priorité :

1. paramètre d'URL `?lang=xx` ;
2. choix mémorisé du visiteur (`localStorage`, clé `ceeb_lang`) ;
3. pays du visiteur d'après le fuseau horaire du navigateur :
   France → `fr`, Pologne → `pl`, Turquie → `tr` ;
4. anglais partout ailleurs.

Les pages Carrières et Contact n'existent qu'en français et en anglais
(`data-languages="fr,en"` sur leur balise `<body>`) : en polonais ou en
turc, elles s'affichent en anglais ; la langue choisie reste celle du site.

Pour ajouter une langue : déclarer son code dans `CEEB_CONFIG.languages`
(`js/app.js`), créer `lang/<code>.js` et `images/carousel/<code>/`,
puis ajouter les balises `hreflang` dans les cinq pages et `sitemap.xml`.

## Photos par pays et carrousels

`images/countries/<code>/1.webp … 12.webp` contient 12 photos d'infrastructures
par pays (`fr`, `gb`, `pl`, `tr`, `de`, `it`, `es`, `sa`). Elles servent à la
section « Réseau global » de l'accueil (galerie par pays) et aux carrousels,
qui affichent les photos du pays associé à la langue (`languageCountries`
dans `js/app.js` : `fr` → France, `en` → Royaume-Uni/Irlande, `pl` → Pologne,
`tr` → Turquie).

Les pages référencent la version `fr` (`images/countries/fr/N.webp`) ;
`js/app.js` remplace le code pays au chargement et à chaque changement de
langue, avec repli sur le pays de la langue par défaut si une image manque.
Les vignettes des pages Expertises et Recrutement suivent la même règle.

## Offres d'emploi

Les offres sont dans `recruitment/jobs/<code>.js`, en français et en anglais
uniquement : site en français → offres en français ; toute autre langue
(anglais, polonais, turc) → offres en anglais. Chaque offre a un titre, un code
(`reference`, identique dans toutes les langues), un type de contrat, un lieu,
une catégorie, des secteurs, un niveau d'expérience, une description et des
compétences. Les champs optionnels `missions` et `profile` enrichissent la
fiche détaillée ; sans eux, la fiche affiche les rubriques génériques
(responsabilités, avantages).

Chaque offre porte le pays de son lieu de travail (`country`, code ISO,
`FR` pour la France). Le filtre « Zone géographique » affiche par défaut
toutes les offres en anglais ; « France » affiche les postes en France, en
français (`recruitment/jobs/fr.js`) ; « International » les postes hors de
France, en anglais. Une offre à l'étranger n'a donc besoin d'exister que
dans `recruitment/jobs/en.js`.

Le bouton « Postuler » (carte et fiche) ouvre un mail vers l'adresse définie
par `APPLY_EMAIL` dans `recruitment/app-rec.js`, avec le code et l'intitulé
du poste en objet. Les boutons « Envoyer ma candidature » et « Candidature
spontanée » ouvrent un mail vers la même adresse avec un objet général
(`mailSubject` dans les fichiers de langue).

## Tester en local

Les données (traductions, offres) sont des scripts et non des fichiers
chargés par `fetch` : le site fonctionne aussi ouvert directement depuis le
disque (double-clic sur `index.html`). Pour un test en HTTP, depuis le
dossier du site :

```bash
python3 -m http.server 8765
```

Le fichier `.claude/launch.json` lance ce même serveur depuis l'aperçu de
l'application Claude.

## Organisation des styles

Toute la mise en forme est dans `css/styles.css`, sans style en ligne dans
les pages. Les classes ajoutées lors du nettoyage sont regroupées en fin de
fichier, par page.

## Diaporama de la construction du siège (page À propos)

Les photos sont dans `images/about/construction/` et listées dans
`about/index.html` (une balise `<img>` par photo dans le bloc
`data-slideshow`). Les deux photos actuelles sont provisoires, en attendant
les photos de chantier. Le texte de l'encart est dans
`aboutPage.history.building` des fichiers de langue.

## Témoignages (accueil)

Quatre cartes dans `index.html` (section `#testimonials`) : logo client,
citation courte et initiales seulement. Textes dans `testimonials.itemN`
des fichiers de langue ; les citations actuelles sont des exemples à
remplacer par des témoignages réels validés par les clients.

## Scripts

- `js/app.js` : configuration des langues, détection, traductions,
  images par langue, carrousel, menu mobile.
- `js/lang-globe.js` : sélecteur de langue (globe) et bandeau partenaires.
- `recruitment/app-rec.js` : offres d'emploi (filtres, recherche, fiche détaillée).
