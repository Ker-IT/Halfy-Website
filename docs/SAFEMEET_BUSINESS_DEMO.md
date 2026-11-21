# Documentation — Démonstrateur SafeMeet Business (`WEB-B2B-05.1` / `WEB-B2B-05.1.1`)

Ce document décrit le fonctionnement, les choix d'architecture, les données fictives, les évolutions UX et les limites du démonstrateur commercial simulé accessible sur `/business/demo/` et `/fr/business/demo/`.

---

## 1. Objectif commercial

Permettre à un prospect professionnel (fondateur de marketplace, directeur produit, product manager, responsable technique ou responsable UX) de comprendre en moins de deux minutes comment **SafeMeet by Halfy** pourrait s'insérer dans un parcours de remise en main propre entre acheteur et vendeur, sans imposer d'échange d'adresses personnelles dans la messagerie.

Depuis le lot `WEB-B2B-05.1.1`, toute référence interne de gestion de projet (`WEB-B2B-*`, backlog, audits internes ou identifiants techniques factices) a été retirée de l'interface visible au profit d'un parcours orienté prospect.

---

## 2. Scénario et données fictives

- **Marketplace fictive :** `Market Demo` (identité visuelle ardoise/neutre distincte de SafeMeet et de toute plateforme réelle).
- **Annonce fictive :** vélo de ville d'occasion (`250 €`), badges d'état et de remise en main propre (`Très bon état`, `Remise en main propre`, `Bruxelles`), vendeur fictif `Camille D.` (avatar `CD`, mention `Membre depuis 2023 (profil fictif)`).
- **Illustration du vélo :** SVG local amélioré (aucune photographie libre de droit ou autorisée de vélo n'étant présente dans `./assets/images/`). Une photographie autorisée pourra remplacer ce SVG lors d'un lot ultérieur.
- **Participants fictifs :**
  - Acheteur : `Lucas M.` (`LM`) — point de départ prédéfini `Uccle, Bruxelles` / `Uccle, Brussels`.
  - Vendeur : `Camille D.` (`CD`) — point de départ prédéfini `Schaerbeek, Bruxelles` / `Schaerbeek, Brussels`.
- **Modes de déplacement illustratifs :** `Voiture` / `Car`, `À pied` / `On foot`, `Vélo` / `Bike` (accompagnés d'icônes SVG locales).
- **Trois lieux publics fictifs :**
  1. `Café du Centre`
  2. `Place Centrale`
  3. `Entrée du parc` / `Park Entrance`

---

## 3. Les sept étapes du parcours et présentation UX

1. **Conversation marketplace :** fiche du vélo enrichie (état, profil vendeur `CD`), bulles de messagerie horodatées avec avatars, et encart naturel *Vous souhaitez vous retrouver ? / Organiser avec SafeMeet*.
2. **Invitation prête pour la rencontre :** ouverture du parcours associé à l'annonce, sans identifiant technique factice, avec précision discrète qu'aucune invitation réelle n'est envoyée.
3. **Parcours acheteur :** en-tête indiquant le rôle actif (`Acheteur (Lucas M.)`), question orientée utilisateur (*D'où partez-vous ?*, *Comment vous déplacez-vous ?*) et note de confidentialité.
4. **Parcours vendeur :** bascule de rôle dans le même navigateur (`Vendeur (Camille D.)`), encart positif confirmant que l'acheteur a renseigné son point de départ sans exposer son adresse, puis choix du mode de déplacement vendeur.
5. **Proposition de lieux :** carte urbaine schématique SVG locale (îlots, parcs, cours d'eau, rues, ellipse *Zone commune* / *Shared area*) affichant exclusivement les 3 lieux publics proposés, **sans afficher `Uccle`, `Schaerbeek` ni aucun point de départ** ; badge d'en-tête corrigé (`Zone de rencontre` / `Shared area`).
6. **Visualisation du résultat :** bascule interactive *Vue acheteur* / *Vue vendeur* montrant le lieu retenu et le badge explicite `Non communiqué` / `Not shared` pour l'autre participant, suivie d'une barre visuelle de confirmation à deux états (`En attente de confirmation (simulé)` -> `Rencontre confirmée (simulé)`). Toute modification ultérieure du lieu ou du mode de déplacement réinitialise cet état simulé afin d'éviter toute incohérence.
7. **Retour à la marketplace :** récapitulatif inséré dans la messagerie `Market Demo` reflétant l'état exact (proposé ou confirmé simulé), synthèse commerciale en trois points, bouton de réinitialisation et CTA *Parlons de votre intégration* / *Discuss your integration* (`mailto:contactus.kerit@gmail.com`).

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
- **Tests automatisés :** `scripts/test-demo.mjs` (`node:test`) et `scripts/check.mjs` (assertions HTML, CTA, exclusion GA4, absence de références internes et protection vie privée de la carte SVG).

---

## 5. Limitations actuelles et confidentialité technique

- **Statique uniquement :** aucune requête réseau, aucune API tierce, aucune géolocalisation navigateur, aucun cookie ni stockage navigateur (`localStorage` / `sessionStorage`).
- **Données en mémoire côté client :** la séparation entre vue acheteur et vue vendeur illustre le comportement visé ; dans cette démonstration statique, toutes les données fictives résident dans le navigateur.
- **Carte illustrative :** aucun calcul réel d'itinéraire, de temps de trajet ou de distance, ni horaires d'ouverture.
- **Visibilité contrôlée sans contrôle d'accès :** les balises `noindex, follow` et l'absence de liens publics limitent l'exposition, mais ne constituent pas une authentification ; aucune donnée sensible ou confidentielle ne doit figurer sur ces pages.

---

## 6. Hypothèses internes à vérifier (`WEB-B2B-03.1`) et évolution (`WEB-B2B-05.2`)

*(Section interne réservée à la documentation ; non exposée dans l'interface publique.)*

Avant toute évolution vers **WEB-B2B-05.2**, l'audit **WEB-B2B-03.1** (Backend, WebApp et Mobile) devra vérifier :
1. Les modes de transport réellement supportés et leur impact effectif sur les résultats.
2. Le cycle de vie réel des liens d'invitation SafeMeet et la possibilité d'associer une référence de transaction.
3. L'isolation serveur effective entre les données saisies par chaque participant.
4. L'existence ou non d'un mécanisme de confirmation mutuelle.
5. Les modalités réelles éventuelles de redirection ou de retour vers une plateforme tierce (sans promettre aujourd'hui de callback, webhook ou SDK).

---

## 7. Conditions pour une future publication commerciale

1. Achèvement de **WEB-B2B-03.1** et ajustement des messages dans **WEB-B2B-05.2**.
2. Création et validation de la page **SafeMeet Business** (`/business/` et `/fr/business/`, lot **WEB-B2B-04**).
3. Remplacement éventuel de l'illustration vélo SVG par une photographie autorisée.
4. Validation commerciale et éditoriale finale avant retrait éventuel de `noindex, follow`, réactivation de GA4 et intégration dans la navigation / `sitemap.xml`.
