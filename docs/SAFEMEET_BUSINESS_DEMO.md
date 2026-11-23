# Documentation — Démonstrateur SafeMeet Business (`WEB-B2B-05.2`)

Ce document décrit le fonctionnement, les choix d'architecture, les données fictives et les limites du démonstrateur commercial simulé accessible sur `/business/demo/` et `/fr/business/demo/`. Son contenu est aligné sur les capacités vérifiées dans `docs/WEB-B2B-03.1.md`.

---

## 1. Objectif commercial

Permettre à un prospect professionnel (fondateur de marketplace, directeur produit, product manager, responsable technique ou responsable UX) de comprendre en moins de deux minutes comment **SafeMeet by Halfy** pourrait s'insérer dans un parcours de remise en main propre entre acheteur et vendeur, sans imposer d'échange d'adresses personnelles dans la messagerie.

Les références internes de gestion de projet (`WEB-B2B-*`, backlog, audits internes ou identifiants techniques factices) restent absentes de l'interface visible, qui présente uniquement le parcours destiné au prospect.

---

## 2. Scénario et données fictives

- **Marketplace fictive :** `Market Demo` (identité visuelle ardoise/neutre distincte de SafeMeet et de toute plateforme réelle).
- **Annonce fictive :** vélo de ville d'occasion (`250 €`), badges d'état et de remise en main propre (`Très bon état`, `Remise en main propre`, `Bruxelles`), vendeur fictif `Camille D.` (avatar `CD`, mention `Membre depuis 2023 (profil fictif)`).
- **Illustration du vélo :** SVG local amélioré (aucune photographie libre de droit ou autorisée de vélo n'étant présente dans `./assets/images/`). Une photographie autorisée pourra remplacer ce SVG lors d'un lot ultérieur.
- **Participants fictifs :**
  - Acheteur : `Lucas M.` (`LM`) — point de départ prédéfini `Uccle, Bruxelles` / `Uccle, Brussels`.
  - Vendeur : `Camille D.` (`CD`) — point de départ prédéfini `Schaerbeek, Bruxelles` / `Schaerbeek, Brussels`.
- **Modes de déplacement illustratifs :** `Voiture` / `Car`, `À pied` / `On foot`, `Vélo` / `Bike` (accompagnés d'icônes SVG locales).
- **Trois établissements fictifs appartenant aux catégories prises en charge :**
  1. `Café des Arcades` / `Arcades Café` (`cafe`)
  2. `Restaurant du Passage` / `Passage Restaurant` (`restaurant`)
  3. `Musée des Objets` / `Museum of Objects` (`museum`)

---

## 3. Les sept étapes du parcours et présentation UX

1. **Conversation marketplace :** fiche du vélo enrichie (état, profil vendeur `CD`), bulles de messagerie horodatées avec avatars, et encart naturel *Vous souhaitez vous retrouver ? / Organiser avec SafeMeet*.
2. **Liens de démarrage :** représentation distincte d'un lien acheteur et d'un lien vendeur, remis séparément par la marketplace. Aucun token, fragment secret ni lien opérationnel n'est créé. Le Web et Android sont mentionnés avec la réserve sur la validation E2E B2B encore en cours.
3. **Parcours acheteur :** en-tête indiquant le rôle actif (`Acheteur (Lucas M.)`), question orientée utilisateur (*D'où partez-vous ?*, *Comment vous déplacez-vous ?*) et note de confidentialité.
4. **Parcours vendeur :** bascule de rôle dans le même navigateur (`Vendeur (Camille D.)`) et saisie séparée du point de départ et du mode. Aucun indicateur ne révèle au vendeur que l'acheteur a terminé individuellement.
5. **Proposition de lieux :** carte urbaine schématique SVG locale affichant exclusivement les trois établissements fictifs, **sans afficher `Uccle`, `Schaerbeek` ni aucun point de départ**. Les lieux sont présentés comme classés pour mieux équilibrer les temps de trajet, sans garantie de mi-chemin exact ni d'accessibilité bilatérale. L'action est « Proposer un lieu ».
6. **Proposition et acceptation :** l'acheteur propose le lieu sélectionné, puis le vendeur l'accepte depuis sa vue. Les points de départ, y compris celui du rôle actif, ne sont plus affichés après soumission. Une modification ultérieure du lieu ou du mode invalide l'acceptation simulée.
7. **Retour à la marketplace :** la messagerie `Market Demo` affiche uniquement le statut non géographique « Lieu accepté dans SafeMeet » / “Place accepted in SafeMeet”. Le nom, l'adresse et la catégorie du POI n'y figurent pas. Ce retour est illustratif : aucun appel API, webhook, callback, notification automatique ou clôture de transaction n'est simulé.

### Panneau explicatif latéral simplifié

Le panneau de droite affiche uniquement le numéro d'étape, un titre concret, une explication courte du fonctionnement et un bloc unique **Pour votre marketplace** / **For your marketplace**.

---

## 4. Architecture, header contextuel, scroll et analytics

- `src/pages/en/business/demo.njk` et `src/pages/fr/business/demo.njk` : pages statiques EN (`/business/demo/`) et FR (`/fr/business/demo/`), configurées avec `robots: "noindex, follow"`, `sitemapIgnore: true` et `routeKey: businessDemo`.
- `src/_includes/layouts/business-demo.njk` : gabarit partagé conservant le header/footer Halfy, le logo officiel SafeMeet (`/assets/safemeet-logos/svg/logo-lockup.svg`), le bandeau permanent de transparence commerciale, `bodyClass: page-business-demo` et `disableAnalytics: true`.
- **CTA contextuel du header (`businessDemo`) :** uniquement sur `/business/demo/` et `/fr/business/demo/`, le bouton principal du header affiche `Contact professionnel` / `Business enquiries` pointant vers `mailto:contactus.kerit@gmail.com` (`src/_data/navigation.js`). Les autres pages du site conservent strictement leurs CTA respectifs.
- **Désactivation de GA4 sur les pages de démonstration :** `src/_includes/components/analytics.njk` n'injecte pas `G-YYH1720STZ` lorsque `disableAnalytics: true` est actif, afin d'éviter que les essais internes ou revues commerciales d'une URL `noindex` ne polluent les statistiques publiques.
- **Correction du chevauchement du header collant :** `scroll-padding-top: 96px` sur `html`, `scroll-margin-top: 96px` sur les conteneurs de démonstration, et utilisation de `heading.focus({ preventScroll: true })` avec recalage maîtrisé dans `demo-marketplace.js` (`scrollStageIntoViewIfObscured`).
- **Modules JS statiques :** `src/assets/scripts/business/demo-data.js`, `src/assets/scripts/business/demo-simulation.js`, `src/assets/scripts/business/demo-marketplace.js`.
- **Tests automatisés :** `scripts/test-demo.mjs` (`node:test`) et `scripts/check.mjs` vérifient notamment les deux liens de rôle, les catégories, l'absence de progression individuelle, la suppression des origines dans le résultat, la proposition suivie de l'acceptation, l'absence de POI dans le retour marketplace, `noindex` et l'exclusion de GA4.

---

## 5. Limitations actuelles et confidentialité technique

- **Statique uniquement :** aucune requête réseau, aucune API tierce, aucune géolocalisation navigateur, aucun cookie ni stockage navigateur (`localStorage` / `sessionStorage`).
- **Données en mémoire côté client :** la séparation entre vue acheteur et vue vendeur illustre le comportement visé ; dans cette démonstration statique, toutes les données fictives résident dans le navigateur.
- **Carte illustrative :** aucun calcul réel d'itinéraire, de temps de trajet ou de distance, ni horaires d'ouverture.
- **Visibilité contrôlée sans contrôle d'accès :** les balises `noindex, follow` et l'absence de liens publics limitent l'exposition, mais ne constituent pas une authentification ; aucune donnée sensible ou confidentielle ne doit figurer sur ces pages.

---

## 6. Capacités vérifiées et limites conservées

L'audit `WEB-B2B-03.1` établit les limites représentées par le démonstrateur :

1. L'API B2B est privée et utilisée dans le cadre d'une intégration partenaire accompagnée.
2. La création initiale fournit deux liens bootstrap distincts, un par rôle. Le démonstrateur n'en reproduit ni le format ni les secrets.
3. Chaque participant transmet séparément son point de départ et choisit la marche, le vélo ou la voiture. Les origines ne sont pas exposées à l'autre rôle ou au partenaire.
4. SafeMeet classe jusqu'à cinq lieux parmi les catégories `bar`, `cafe`, `restaurant`, `cinema`, `museum` et `florist`. La carte du démonstrateur reste une illustration fictive de trois résultats.
5. Le parcours réel prend en charge proposition, contre-proposition et acceptation. Le scénario simplifié montre une proposition de l'acheteur acceptée par le vendeur.
6. Le partenaire peut lire un statut fonctionnel non géographique. Il ne reçoit pas le lieu accepté et ne dispose d'aucun webhook, callback ou notification automatique.
7. Le parcours est disponible sur le Web et Android ; la validation E2E de la version B2B-05.1 reste en cours.

---

## 7. Articulation avec les pages commerciales

1. Les pages **SafeMeet Business** (`/business/` et `/fr/business/`) présentent désormais l'offre d'intégration et renvoient vers ce démonstrateur dans la langue correspondante.
2. Remplacement éventuel de l'illustration vélo SVG par une photographie autorisée.
3. Le démonstrateur reste en `noindex, follow`, hors sitemap et sans GA4. Seules les pages commerciales sont ajoutées à la navigation publique et au sitemap.
