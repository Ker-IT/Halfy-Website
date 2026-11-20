# Référentiel des assets graphiques — Halfy & SafeMeet

Ce document recense de manière factuelle les ressources visuelles présentes dans `./assets/` et précise leurs règles d'utilisation sur le site vitrine **Halfy** (`Ker-IT/Halfy-Website`).

---

## 1. Architecture de marque

- **Halfy** est la marque principale (site vitrine, WebApp, application Android, éditeur Kër IT).
- **Halfway** désigne la recherche à mi-chemin entre deux adresses connues.
- **SafeMeet by Halfy** désigne l'outil de rencontre sans partage de point de départ entre participants.
- **SafeMeet Business** désigne l'offre professionnelle en préparation. **Il n'existe pas encore de logo distinct dédié à SafeMeet Business dans les assets actuels** : sur fond sombre (`#111827`), on associe la version blanche du logo SafeMeet (`logo-symbol-white.svg` ou `logo-lockup-white.svg`) avec une mention textuelle explicite (`SafeMeet Business`, badge `En préparation` / `In preparation`).

---

## 2. Assets Halfy d'origine (`./assets/`)

| Fichier | Format / Usage observé | Statut |
|---|---|---|
| `assets/favicon.ico` | Favicon multi-résolution Halfy (`H.` bleu `#2563EB` + point `#EF4444`) | Actif (`head-seo.njk`) |
| `assets/icon-192.png`, `assets/icon-512.png` | Icônes officielles Halfy (192×192, 512×512) | Actif (`head-seo.njk`, carte Halfway) |
| `assets/icon-192-maskable.png`, `assets/icon-512-maskable.png` | Icônes maskables PWA | Conservé |
| `assets/apple-touch-icon.png` | Icône Apple Touch (180×180) | Actif (`head-seo.njk`) |
| `assets/web-app-manifest-192x192.png`, `assets/web-app-manifest-512x512.png` | Icônes déclarées dans `assets/site.webmanifest` | Actif |
| `assets/images/screen_1.png` | Capture écran Halfway (1080×2400 — itinéraires Bordeaux et lieu à mi-chemin) | Actif (Accueil) |
| `assets/images/screen_2.png` | Capture écran Halfway (1080×2400 — fiche établissement Bruxelles) | Actif (`/halfway/`, `/fr/halfway/`) |
| `*_old.*`, `logo_old.png` | Anciennes variantes historiques conservées sans suppression | Non référencé sur le site |

---

## 3. Kit officiel SafeMeet (`./assets/safemeet-logos/`)

### Informations vérifiées dans `assets/safemeet-logos/README.md` et les sources SVG
- **Couleurs extraites du kit :** bleu `#2665EC`, rouge `#EE4949`.
- **Origine technique :** les fichiers SVG et exports ont été vectorisés à partir d'un visuel PNG de 1448 px fourni en amont (pas depuis le fichier vectoriel natif d'origine). Pour des supports imprimés ou grand format définitifs, demander le fichier source d'origine.
- **Planches d'aperçu (`assets/safemeet-logos-preview.png`, `assets/safemeet-logos/preview-sheet.png`) :** documents de référence uniquement. **Ne jamais les intégrer comme logos dans les pages publiques.**

### Variantes vectorielles (`assets/safemeet-logos/svg/`)

| Fichier | ViewBox / Proportion | Fonds adaptés | Usage recommandé sur le site |
|---|---|---|---|
| `logo-lockup.svg` | `299.75 167.50 850.50 488.00` (~1,74:1) | Fonds clairs (`#FFFFFF`, `#F9FAFB`) | Hero de `/safemeet/` et `/fr/safemeet/` |
| `logo-lockup-white.svg` | `299.75 167.50 850.50 488.00` (~1,74:1) | Fonds sombres (`#111827`) | Passerelle SafeMeet Business sur fond `#111827` |
| `logo-symbol.svg` | `501.00 167.50 446.25 303.25` (~1,47:1) | Fonds clairs (`#FFFFFF`, `#F9FAFB`) | Carte produit SafeMeet (Accueil), passerelle SafeMeet (page Halfway) |
| `logo-symbol-white.svg` | `501.00 167.50 446.25 303.25` (~1,47:1) | Fonds sombres (`#111827`) | Bandeau SafeMeet Business (Accueil) |
| `logo-wordmark.svg`, `logo-wordmark-white.svg` | Typographie « SafeMeet » seule | Clair / Sombre | Disponible si besoin sans icône |
| `logo-symbol-mono-black.svg`, `logo-symbol-mono-white.svg` | Symbole monochrome | Impression / contraintes monochromes | Disponible en réserve |

### Exports web, social et plateformes (`assets/safemeet-logos/web/` et sous-dossiers)

| Emplacement | Fichiers principaux | Usage |
|---|---|---|
| `web/` (logos PNG) | `logo-lockup-{400,800,1600}.png`, `logo-lockup-white-{400,800,1600}.png`, `logo-symbol-{128,256,512,1024}.png`, `logo-symbol-white-{128,256,512,1024}.png`, `logo-wordmark-*.png` | Emails, documents, fallback PNG |
| `web/og-image-1200x630.png` | Image Open Graph 1200×630 opaque sur fond blanc | `og:image` et `twitter:image` sur `/safemeet/` et `/fr/safemeet/` |
| `web/favicon*`, `icon-*`, `apple-touch-icon.png` | Kit favicons/PWA propre à SafeMeet | Réservé si une WebApp dédiée SafeMeet en a besoin ; le site vitrine `halfy.app` conserve les favicons Halfy |
| `ios/`, `android/`, `expo/` | Icônes mobiles, adaptatives, notification et splash | Ressources destinées aux applications mobiles (non référencées dans le site vitrine) |

---

## 4. Règles d'intégration et de contraste

1. **Toujours utiliser des chemins racine absolus** (`/assets/...`).
2. **Ne jamais modifier les fichiers sources** dans `./assets/`.
3. **Ne pas déformer les proportions** : conserver les attributs `width`/`height` proportionnels aux `viewBox` (ex. `48×33` pour `logo-symbol*.svg`, `160×92` ou `140×80` pour `logo-lockup*.svg`).
4. **Ne pas utiliser les captures Halfway (`screen_1.png`, `screen_2.png`) pour illustrer SafeMeet**, afin de ne pas confondre les deux parcours.
5. **Respecter le contraste** : variantes couleur sur `#FFFFFF`/`#F9FAFB`, variantes `-white` exclusivement sur `#111827` ou `#1F2937`.
