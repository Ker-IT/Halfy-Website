# Halfy — Site Vitrine Officiel (`halfy.app`)

Site vitrine statique officiel de **Halfy** (édité par **Kër IT**), généré avec **Eleventy (11ty)** et conçu pour être déployé sur **GitHub Pages** (`halfy.app`).

- **Site vitrine :** [https://halfy.app](https://halfy.app/)
- **WebApp Halfy / Halfway :** [https://app.halfy.app](https://app.halfy.app/)
- **Expérience Private Meet / SafeMeet :** [https://app.halfy.app/meet](https://app.halfy.app/meet)
- **Application Android :** [Google Play (`com.crankynx.halfy`)](https://play.google.com/store/apps/details?id=com.crankynx.halfy)

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
├── assets/                      # Ressources officielles (logos, icônes, captures, manifest)
├── docs/
│   ├── ARCHITECTURE.md          # Architecture détaillée, guide pages/i18n, audit GA4, déploiement
│   └── BACKLOG_WEB_B2B.md       # Backlog complet du chantier WEB-B2B (01 à 10)
├── scripts/
│   ├── check.mjs                # Build + vérifications automatisées (liens, SEO, HTML, manifest)
│   └── dev.mjs                  # Mode dev (Eleventy --watch + serveur preview _site/)
├── src/
│   ├── _data/
│   │   ├── i18n.js              # Libellés communs EN/FR
│   │   ├── navigation.js        # Configuration centralisée & feature flags navigation
│   │   ├── routes.js            # Correspondances d'URLs EN <-> FR
│   │   └── site.js              # Métadonnées globales, GA4, URLs applicatives
│   ├── _includes/
│   │   ├── components/          # analytics.njk, footer.njk, head-seo.njk, header.njk
│   │   └── layouts/             # base.njk, home.njk, legal.njk
│   ├── assets/
│   │   ├── scripts/main.js      # Menu mobile accessible (clavier + Escape)
│   │   └── styles/main.css      # Design system mutualisé Halfy
│   ├── pages/
│   │   ├── en/                  # index.njk (/), privacy.njk (/privacy.html)
│   │   └── fr/                  # index.njk (/fr/), privacy.njk (/fr/privacy.html)
│   ├── robots.njk               # Génère _site/robots.txt
│   └── sitemap.njk              # Génère _site/sitemap.xml depuis les routes actives
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

# Lancer le mode développement (watch Eleventy + prévisualisation _site/ sur :3000)
npm run dev

# Construire puis prévisualiser _site/ sur http://localhost:3000
npm run preview

# Exécuter le build et toutes les vérifications (liens, assets, SEO, manifest, syntaxe JS)
npm run check
```

---

## Documentation complémentaire

- [Architecture, création de pages, audit Analytics & procédure GitHub Pages](docs/ARCHITECTURE.md)
- [Backlog complet du chantier WEB-B2B](docs/BACKLOG_WEB_B2B.md)
- [Consignes de développement et contraintes du dépôt](AGENTS.md)
