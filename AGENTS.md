# AGENTS.md — Règles de développement pour `Ker-IT/Halfy-Website`

Ce document définit les règles techniques et éditoriales à respecter lors de toute évolution du site vitrine **Halfy**.

## 1. Principes d'architecture

- **Générateur statique :** Eleventy (`@11ty/eleventy` v3) avec templates Nunjucks (`.njk`), source dans `src/`, sortie dans `_site/`.
- **Aucune application SPA ni serveur de production :** ne pas introduire React, Vite, Next.js, Vue, Angular, Firebase, Cloud Run ou d'API IA côté site vitrine.
- **Adaptateur de prévisualisation :** `server.js` (Express) existe uniquement pour servir `_site/` en développement local et dans Google AI Studio sur le port `3000`. Ne jamais en faire une dépendance de production.
- **Hébergement cible :** GitHub Pages sur le domaine personnalisé `halfy.app` (`CNAME` copié dans `_site/CNAME`).

## 2. Identité visuelle et assets

- **Charte Halfy à préserver :**
  - Police : `Inter`
  - Couleurs : `--primary: #2563eb`, `--primary-dark: #1d4ed8`, `--logo-accent: #ef4444`, `--dark: #111827`, `--gray: #6b7280`, `--light: #f3f4f6`, `--bg: #f9fafb`, `--border: #e5e7eb`, `--white: #ffffff`.
- **Assets :**
  - Les ressources officielles se trouvent dans `./assets/`.
  - Ne pas générer de nouveau logo, ne pas altérer les couleurs/proportions du logo, ne pas remplacer les captures réelles (`screen_1.png`, `screen_2.png`) par des illustrations fictives.
  - Ne pas supprimer les fichiers `*_old.*` sans vérification préalable de leur historique et absence d'usage externe.
  - Toujours référencer les assets par des chemins racine absolus (`/assets/...`).

## 3. Internationalisation et navigation

- **Anglais par défaut à la racine** (`/`), **français sous `/fr/`**.
- **Aucune traduction dynamique côté navigateur :** chaque page doit exister statiquement en EN et FR.
- **Correspondances de routes :** toute nouvelle route doit être déclarée dans `src/_data/routes.js` avec ses clés `en` et `fr` afin d'alimenter automatiquement le sélecteur de langue, les balises `canonical`, `hreflang` et `sitemap.xml`.
- **Navigation progressive :** activer une entrée dans `src/_data/navigation.js` (`enabled: true`) **uniquement** lorsque les pages cibles EN et FR sont effectivement créées et validées. Ne jamais exposer de lien mort ou de page vide.

## 4. Charte éditoriale, véracité produit et contenus

- **Règle obligatoire pour tout agent de développement (Gemini, Codex, Claude ou tout futur outil) :** avant toute création ou modification de contenu destiné aux utilisateurs (pages, titres SEO, métadonnées, libellés de navigation, textes alternatifs, formulaires), consulter et respecter intégralement [`docs/EDITORIAL_GUIDELINES.md`](docs/EDITORIAL_GUIDELINES.md).
- **Architecture officielle des marques (règle permanente) :**
  - **Halfy** est le nom officiel de l'application (Web et Android), et non uniquement une marque ombrelle.
  - **Halfway** est uniquement un terme descriptif anglais (ex. *Meet halfway with Halfy*) et ne doit plus être utilisé comme marque ou nom de produit indépendant.
  - **SafeMeet** (*SafeMeet by Halfy*) est le nom officiel actuel de l'ancien produit *Private Meet* ; ne plus exposer *Private Meet* sur les pages publiques (et ne pas formuler les CTA comme « Créer un SafeMeet » / *« Create a SafeMeet »*, utiliser « Créer une rencontre » / *« Create a meetup »*).
  - **SafeMeet Business** est la déclinaison professionnelle de SafeMeet.
  - **Kër IT** est la future société éditrice, actuellement **en cours de formation** (ne pas la présenter comme déjà immatriculée ni inventer d'identifiants légaux).
- Ne jamais présenter une fonctionnalité future (API B2B, widget marketplace, IA, facturation) comme déjà disponible en production.
- Ne jamais promettre de garantie de sécurité absolue, de réduction de fraude ou de résultat commercial non démontré.
- Ne jamais modifier le fond des politiques de confidentialité (`/privacy.html`, `/fr/privacy.html`) sans validation explicite.

## 5. Vérifications obligatoires avant commit

Exécuter systématiquement :

```bash
npm run check
npm run lint
```

Vérifier visuellement `_site/` aux largeurs `375px`, `768px` et `1440px` (absence de débordement horizontal, lisibilité, navigation clavier).
