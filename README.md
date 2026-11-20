# Halfy — Site Vitrine Officiel (`halfy.app`)

Site vitrine statique officiel de **Halfy** (édité par **Kër IT**, société en cours de formation), généré avec **Eleventy (11ty)** et conçu pour être déployé sur **GitHub Pages** (`halfy.app`).

- **Site vitrine :** [https://halfy.app](https://halfy.app/)
- **Page produit Halfy :** [https://halfy.app/halfy/](https://halfy.app/halfy/) (FR : [/fr/halfy/](https://halfy.app/fr/halfy/)) — redirection statique conservée depuis `/halfway/` et `/fr/halfway/`
- **Page produit SafeMeet by Halfy :** [https://halfy.app/safemeet/](https://halfy.app/safemeet/) (FR : [/fr/safemeet/](https://halfy.app/fr/safemeet/))
- **WebApp Halfy :** [https://app.halfy.app](https://app.halfy.app/)
- **WebApp SafeMeet :** [https://app.halfy.app/meet](https://app.halfy.app/meet)
- **Application Android Halfy :** [Google Play (`com.crankynx.halfy`)](https://play.google.com/store/apps/details?id=com.crankynx.halfy)

---

## Architecture des marques

- **Kër IT** : future société éditrice (actuellement en cours de formation).
- **Halfy** : application existante (Web et Android) pour trouver un lieu de rendez-vous à mi-chemin.
- **SafeMeet by Halfy** : outil de rencontre sans partage de point de départ (anciennement *Private Meet*).
- **SafeMeet Business** : déclinaison professionnelle de SafeMeet (offre en préparation).

---

## Architecture technique

- **Générateur statique :** Eleventy (`@11ty/eleventy` v3, templates Nunjucks `.njk`, sortie dans `_site/`).
- **Styles & scripts :** CSS mutualisé (`src/assets/styles/main.css`) sans framework externe, JS minimal accessible (`src/assets/scripts/main.js`).
- **Internationalisation :** Statique à la compilation — anglais à la racine (`/`), français sous `/fr/`.
- **Hébergement cible :** GitHub Pages avec domaine personnalisé (`CNAME: halfy.app`).
- **Adaptateur de prévisualisation (développement uniquement) :** `server.js` (Express) sert le répertoire `_site/` sur `0.0.0.0:3000` pour la prévisualisation locale et Google AI Studio. Il n’est **pas** requis en production.

---

## Structure du projet

```text
/
├── .github/workflows/pages.yml  # Workflow CI/CD (validation puis déploiement manuel)
├── assets/                      # Ressources officielles (Halfy, captures, kit SafeMeet)
├── docs/
│   ├── ARCHITECTURE.md          # Architecture détaillée, guide pages/i18n, audit GA4, déploiement
│   ├── BACKLOG_WEB_B2B.md       # Backlog complet du chantier WEB-B2B (01 à 10)
│   ├── BRAND_ASSETS.md          # Référentiel des assets graphiques Halfy & SafeMeet
│   └── EDITORIAL_GUIDELINES.md  # Charte éditoriale FR/EN
├── scripts/
│   ├── check.mjs                # Build + vérifications automatisées (liens, SEO, HTML, marques)
│   └── dev.mjs                  # Mode dev (serveur preview :3000 + Eleventy --watch)
├── src/
│   ├── _data/
│   │   ├── i18n.js              # Libellés communs EN/FR
│   │   ├── navigation.js        # Configuration centralisée & feature flags navigation
│   │   ├── routes.js            # Correspondances d'URLs EN <-> FR
│   │   └── site.js              # Métadonnées globales, GA4, URLs applicatives
│   ├── _includes/
│   │   ├── components/          # analytics.njk, footer.njk, head-seo.njk, header.njk, cartes
│   │   └── layouts/             # base.njk, home.njk, halfy.njk, safemeet.njk, legal.njk, redirect.njk
│   ├── assets/
│   │   ├── scripts/main.js      # Menu Produits et tiroir mobile accessibles (clavier + Escape)
│   │   └── styles/main.css      # Design system mutualisé Halfy
│   ├── pages/
│   │   ├── en/                  # index.njk, halfy.njk, safemeet.njk, privacy.njk, halfway.njk (redirect)
│   │   └── fr/                  # index.njk, halfy.njk, safemeet.njk, privacy.njk, halfway.njk (redirect)
│   ├── robots.njk               # Génère _site/robots.txt
│   └── sitemap.njk              # Génère _site/sitemap.xml depuis les routes canoniques actives
├── AGENTS.md                    # Règles de contribution et garde-fous pour agents/développeurs
├── CNAME                        # Domaine personnalisé GitHub Pages (halfy.app)
├── eleventy.config.js           # Configuration Eleventy
├── package.json
├── package-lock.json
└── server.js                    # Adaptateur Express dev/preview uniquement
```

---

## Commandes locales (Node.js 22+)

```bash
# Installer les dépendances de manière reproductible
npm ci

# Générer le site statique dans _site/
npm run build

# Lancer le mode développement (serveur preview :3000 + watch Eleventy)
npm run dev

# Construire puis prévisualiser _site/ sur http://localhost:3000
npm run preview

# Exécuter le build et toutes les vérifications (liens, assets, SEO, manifest, syntaxe JS)
npm run check
```

---

## Documentation complémentaire

- [Architecture, création de pages, audit Analytics & procédure GitHub Pages](docs/ARCHITECTURE.md)
- [Référentiel des assets graphiques Halfy & SafeMeet](docs/BRAND_ASSETS.md)
- [Charte éditoriale FR/EN](docs/EDITORIAL_GUIDELINES.md)
- [Backlog complet du chantier WEB-B2B](docs/BACKLOG_WEB_B2B.md)
- [Consignes de développement et contraintes du dépôt](AGENTS.md)
