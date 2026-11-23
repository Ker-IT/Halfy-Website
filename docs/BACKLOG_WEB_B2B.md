# Backlog Chantier WEB-B2B — Site Vitrine Halfy

Ce backlog encadre l'évolution progressive du site vitrine `Ker-IT/Halfy-Website` vers une présentation multiproduit **Halfy / SafeMeet by Halfy / SafeMeet Business** (édité par **Kër IT**, société en cours de formation).

| Lot | Titre | Dépendances | Statut |
|---|---|---|---|
| **WEB-B2B-01** | Architecture, design system et navigation (Eleventy, i18n, SEO structurel, assets, CI) | Aucune | Implémenté (socle en place) |
| **WEB-B2B-02** | Nouvelle page d'accueil multiproduit (`/`, `/fr/`) et pages produit Halfy | WEB-B2B-01 | Implémenté |
| **WEB-B2B-02.1** | Charte éditoriale (`docs/EDITORIAL_GUIDELINES.md`) et révision des contenus FR/EN | WEB-B2B-02 | Implémenté |
| **WEB-B2B-03** | Landing page SafeMeet B2C (`/safemeet/`, `/fr/safemeet/`) et intégration du kit logos | WEB-B2B-01, WEB-B2B-02.1 | Implémenté |
| **WEB-B2B-03.2** | Harmonisation des marques Halfy, SafeMeet et Kër IT + routes `/halfy/`, `/fr/halfy/` | WEB-B2B-03 | Implémenté |
| **WEB-B2B-03.3** | Simplification du header (navigation directe Halfy / SafeMeet) et CTA contextuels | WEB-B2B-03.2 | Implémenté |
| **WEB-B2B-03.1** | Inventaire des capacités B2B réelles (audit croisé WebApp, Backend, Mobile & roadmap) | WEB-B2B-01 | Implémenté |
| **WEB-B2B-04** | Pages SafeMeet Business (`/business/`, `/fr/business/`) | WEB-B2B-03, WEB-B2B-03.1 | Implémenté |
| **WEB-B2B-05.1** | Démonstrateur commercial interactif simulé (`/business/demo/`, `/fr/business/demo/`) | WEB-B2B-03.3 | Implémenté (noindex, hors navigation publique) |
| **WEB-B2B-05.1.1** | Amélioration commerciale, UX, confidentialité carte et opt-out GA4 du démonstrateur | WEB-B2B-05.1 | Implémenté (noindex, hors navigation publique) |
| **WEB-B2B-05.2** | Adaptation du démonstrateur aux capacités B2B réelles après `WEB-B2B-03.1` | WEB-B2B-03.1, WEB-B2B-05.1.1 | Implémenté |
| **WEB-B2B-06** | Acquisition de prospects professionnels (`/business/contact/`) | WEB-B2B-04, choix routage formulaire | À faire |
| **WEB-B2B-07** | SEO avancé, plan de marquage GA4, conformité consentement / mentions légales | WEB-B2B-02 à WEB-B2B-06 | À faire |
| **WEB-B2B-08** | Documentation développeurs publique (`/developers/`) | WEB-B2B-03.1, WEB-B2B-04 | À faire |
| **WEB-B2B-09** | Tarification (`/business/pricing/`) | WEB-B2B-03.1, WEB-B2B-04, grille validée | À faire |
| **WEB-B2B-10** | Souscription professionnelle (lien/onboarding vers backend B2B opérationnel) | WEB-B2B-08, WEB-B2B-09, backend B2B prêt | À faire |

## Règles transverses pour les lots suivants
1. **WEB-B2B-03.1 est un prérequis strict** avant toute promesse technique ou commerciale sur `WEB-B2B-04`, `08`, `09` et `10`.
2. Ne jamais activer un lien dans `src/_data/navigation.js` tant que les deux versions EN et FR de la page ne sont pas livrées et vérifiées.
3. Ne pas présenter d'intégration IA, de réduction de fraude chiffrée ou d'API publique comme disponibles avant livraison effective en production.

## Décision produit et routage de WEB-B2B-04

- **Halfy** reste l'application principale. **SafeMeet** est un module de Halfy accessible directement aux particuliers.
- **SafeMeet Business** désigne l'intégration de SafeMeet dans les services d'une entreprise. Les marketplaces constituent le premier marché cible, pas une offre ni une marque distincte.
- Les routes `/business/marketplaces/` et `/fr/business/marketplaces/` restent reportées. Elles ne doivent apparaître ni dans la navigation, ni dans le sitemap, ni dans les CTA.
- En attendant `WEB-B2B-06`, la prise de contact professionnelle reste assurée par email, sans formulaire ni souscription autonome.
