# Documentation d'architecture & exploitation — Halfy Website

## 1. Architecture technique retenue

### Choix du générateur statique : Eleventy (11ty v3)
- **Entrée (`src/`) → Sortie (`_site/`)** configurée dans `eleventy.config.js`.
- **Passthrough copy** :
  - `./assets` → `_site/assets` (icônes, favicons, manifest, captures d'écran officielles).
  - `./src/assets` → `_site/assets` (feuille de style `main.css` et script `main.js`).
  - `./CNAME` → `_site/CNAME` (préservation du domaine `halfy.app`).
- **Moteur de templates :** Nunjucks (`.njk`), permettant de séparer strictement les données (`src/_data/`), les composants (`src/_includes/components/`), les layouts (`src/_includes/layouts/`) et les pages (`src/pages/`).

### Rôle de `server.js` (Express)
- `server.js` est un **adaptateur de prévisualisation limité au développement local et à Google AI Studio**.
- Il sert le contenu statique réel de `_site/` sur `0.0.0.0:3000`.
- Il n'est **pas** exécuté sur GitHub Pages ni inclus dans `_site/`.

---

## 2. Inventaire des assets (`./assets/`)

| Ressource | Rôle | Statut |
|---|---|---|
| `assets/favicon.ico` | Favicon multi-résolution (16×16, 32×32) | Actif (`head-seo.njk`) |
| `assets/icon-192.png`, `assets/icon-512.png` | Icônes PNG officielles | Actif (`head-seo.njk`) |
| `assets/icon-192-maskable.png`, `assets/icon-512-maskable.png` | Icônes maskables disponibles | Conservé |
| `assets/apple-touch-icon.png` | Icône Apple Touch (180×180) | Actif (`head-seo.njk`) |
| `assets/web-app-manifest-192x192.png`, `assets/web-app-manifest-512x512.png` | Icônes PWA référencées par `site.webmanifest` | Actif (`site.webmanifest`) |
| `assets/site.webmanifest` | Manifeste PWA (chemins corrigés en `/assets/...`) | Actif |
| `assets/images/screen_1.png` | Capture écran principale affichée dans le Hero | Actif (`index.njk`, `halfy.njk`) |
| `assets/images/screen_2.png` | Seconde capture écran officielle (détail d'un lieu) | Actif (`halfy.njk`) |
| `assets/safemeet-logos/` | Kit officiel de logos SafeMeet (SVG, PNG web, OG 1200×630, exports mobiles) | Actif (`index.njk`, `halfy.njk`, `safemeet.njk`) — voir [`docs/BRAND_ASSETS.md`](BRAND_ASSETS.md) |
| `assets/safemeet-logos-preview.png` | Planche d'aperçu visuelle du kit SafeMeet | Référence uniquement (ne pas afficher sur le site) |
| `*_old.*`, `logo_old.png` | Anciennes variantes historiques (`favicon_old.*`, `favicon-96x96_old.png`, `apple-touch-icon_old.png`, `web-app-manifest-*_old.png`) | Conservé sans suppression (non référencé) |

---

## 3. Guide : créer une nouvelle page et sa version localisée

### Étape 1 — Déclarer la route dans `src/_data/routes.js`
Ajouter une clé unique avec les chemins complets EN et FR (utiliser un dossier avec `index.html` pour les URLs propres GitHub Pages) :

```js
safemeet: {
  en: "/safemeet/",
  fr: "/fr/safemeet/",
},
```

### Étape 2 — Créer la page anglaise dans `src/pages/en/`
Exemple `src/pages/en/safemeet.njk` :

```njk
---
layout: layouts/base.njk
permalink: /safemeet/index.html
lang: en
routeKey: safemeet
title: "SafeMeet by Halfy - ..."
description: "..."
---
<!-- Contenu HTML/Nunjucks -->
```

### Étape 3 — Créer la page française dans `src/pages/fr/`
Exemple `src/pages/fr/safemeet.njk` :

```njk
---
layout: layouts/base.njk
permalink: /fr/safemeet/index.html
lang: fr
routeKey: safemeet
title: "SafeMeet by Halfy - ..."
description: "..."
---
<!-- Contenu localisé FR -->
```

### Étape 4 — Activer l'entrée de navigation (si applicable)
Dans `src/_data/navigation.js`, passer `enabled: true` uniquement lorsque les deux versions (EN et FR) sont prêtes. Le sélecteur de langue, les balises `canonical`, `hreflang` (`en`, `fr`, `x-default`) et `sitemap.xml` sont alors générés automatiquement.

### Navigation directe du header et CTA contextuels (`WEB-B2B-03.3`)
- **Desktop :** `src/_includes/components/header.njk` affiche directement les entrées `navigation.products` actives (`Halfy` et `SafeMeet`) avec leurs icônes officielles, un séparateur vertical conditionnel (`.nav-separator`) avant `navigation.sections` (`Business`, actif vers `/business/` et `/fr/business/`), l'état actif `aria-current="page"` sur la route correspondante, le sélecteur de langue et le CTA principal.
- **Mobile (`<= 980 px`) :** le tiroir `#mobile-navigation-drawer` reprend la même source de vérité `navigation.products` / `navigation.sections` sans regroupement imbriqué inutile, avec descriptions courtes et CTA contextuel.
- **CTA contextuels centralisés :** `navigation.js` définit `headerCtaDefault`, `headerCtas` (`halfy`, `safemeet`, `business` et `businessDemo`) et `headerCtaByRouteKey`. Les pages Business et le démonstrateur proposent un contact professionnel par email en attendant `WEB-B2B-06`. `header.njk` résout ce CTA en un point unique pour le desktop et le mobile.

### Architecture produit SafeMeet Business (`WEB-B2B-04`)

- Halfy est l'application principale ; SafeMeet est l'un de ses modules et reste accessible directement aux particuliers.
- SafeMeet Business permet aux entreprises d'intégrer SafeMeet dans leurs propres services au moyen de l'API B2B privée et d'une intégration accompagnée.
- Les marketplaces sont le premier cas d'utilisation présenté. Elles ne constituent ni une marque ni une offre distincte.
- Seules les routes `/business/` et `/fr/business/` sont publiques et indexables. Les routes marketplace envisagées restent reportées.

### Étape 5 — Vérifier
Exécuter `npm run check` et contrôler le rendu dans `_site/` aux résolutions 375 px, 768 px et 1440 px.

---

## 4. Audit Analytics (GA4) et confidentialité (prérequis avant WEB-B2B-07)

- **Intégration actuelle :** Google Analytics 4 (`G-YYH1720STZ`) est centralisé dans `src/_includes/components/analytics.njk`. Le layout peut l’exclure avec `disableAnalytics: true`.
- **Exclusions :** les pages SafeMeet Business `/business/` et `/fr/business/`, ainsi que les démonstrateurs `/business/demo/` et `/fr/business/demo/`, utilisent cette exclusion. Leur HTML généré ne contient ni chargement de `gtag.js`, ni appel `gtag('config', ...)`.
- **Périmètre restant :** les autres pages publiques continuent à charger GA4. Ce comportement reste un sujet de conformité à traiter ; l’exclusion des quatre routes Business et démonstration ne constitue pas une conformité RGPD globale du site.
- **Points identifiés à traiter avant d'ajouter le tracking de conversion B2B (`WEB-B2B-07`) :**
  1. **Consentement (RGPD / ePrivacy) :** sur les autres pages publiques, `gtag.js` est chargé et exécuté sans bannière de consentement préalable (`Consent Mode v2` / CMP). En Europe/France, le dépôt des cookies analytiques GA4 (`_ga`, `_ga_*`) sans consentement ou configuration strictement exemptée (ou alternative sans cookies) constitue un point de non-conformité à régulariser.
  2. **Cohérence avec les mentions légales :** `/privacy.html` et `/fr/privacy.html` détaillent les données de localisation de la recherche à mi-chemin Halfy et de SafeMeet mais **ne mentionnent pas Google Analytics / les cookies de mesure d'audience**, ni le traitement des futurs formulaires de contact B2B (`WEB-B2B-06`).
  3. **Action recommandée :** avant `WEB-B2B-06` et `WEB-B2B-07`, décider soit d'intégrer une gestion de consentement (Consent Mode v2), soit de basculer vers une mesure sans cookies respectueuse par défaut, et mettre à jour la politique de confidentialité avec validation juridique.

### Redirections statiques de compatibilité
- Les anciennes routes `/halfway/` (`src/pages/en/halfway.njk`) et `/fr/halfway/` (`src/pages/fr/halfway.njk`) sont générées avec `layouts/redirect.njk` (`noindex, follow`, `canonical` vers `/halfy/` et `/fr/halfy/`, balise `<meta http-equiv="refresh">`, repli JS et lien accessible). Elles sont exclues de `sitemap.xml` via `sitemapIgnore: true`.

---

## 5. Génération et déploiement GitHub Pages

### État actuel
- Le domaine personnalisé GitHub Pages est conservé par le fichier `/CNAME` (`halfy.app`), copié dans `_site/CNAME`.
- La publication utilise le workflow `.github/workflows/pages.yml` et reste une action manuelle.

### Workflow préparé (`.github/workflows/pages.yml`)
- **Job `validate`** : sur `push` ou `pull_request` vers `main`, il exécute `npm ci` et `npm run check`, puis prépare l'artefact `_site`.
- **Job `deploy`** : il s’exécute uniquement lorsque le workflow est lancé manuellement avec `workflow_dispatch`.
- Un push sur `main` valide le site mais **ne le déploie pas**. Aucun déclenchement automatique de publication n’est configuré.

### Procédure de mise en production (à exécuter manuellement après validation)
1. Valider localement : `npm ci`, `npm run check`, `npm run lint` et `git diff --check`, puis vérifier visuellement `_site/` lorsque les changements affectent le rendu.
2. Fusionner les modifications vers la branche cible (`main`) après revue.
3. Dans GitHub Actions, ouvrir le workflow **Validate and Deploy Halfy Website**, choisir **Run workflow**, sélectionner la branche ou le tag validé et lancer manuellement `workflow_dispatch`.
4. Attendre la réussite des jobs `validate` et `deploy`. Ne pas considérer le push sur `main` comme une publication.
5. Vérifier en production : `https://halfy.app/`, `https://halfy.app/fr/`, `https://halfy.app/privacy.html`, `https://halfy.app/fr/privacy.html`, `https://halfy.app/sitemap.xml`, `https://halfy.app/robots.txt`, ainsi que le certificat HTTPS du domaine personnalisé.

### Procédure de retour arrière (Rollback)
1. Identifier le dernier commit ou tag dont l’artefact a été validé.
2. Rendre cette révision sélectionnable par `workflow_dispatch` au moyen d’un tag ou d’une branche de rollback, ou effectuer un `git revert` du changement problématique sur `main` après revue.
3. Lancer manuellement le workflow **Validate and Deploy Halfy Website** sur cette référence.
4. Vérifier la réussite des jobs `validate` et `deploy`, puis contrôler les routes publiques, le `CNAME`, le sitemap et le certificat HTTPS.

Cette procédure remplace le site publié par un nouvel artefact `_site` issu d’une révision connue. Elle ne nécessite pas de changer la source GitHub Pages ni de restaurer manuellement d’anciens fichiers HTML à la racine.
