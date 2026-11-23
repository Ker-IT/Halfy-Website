# WEB-B2B-03.1 — Audit croisé des capacités SafeMeet Business

> État vérifié le 23 novembre 2026 dans les sources de `Halfy.Backend`, `Halfy.WebApp`, `Halfy.Mobile` et `Halfy.Website`. Cet audit ne valide pas la configuration d’exécution Production et ne transforme pas le démonstrateur statique en client de l’API.

## 1. Conclusion

SafeMeet Business dispose déjà d’une API B2B privée utilisable dans le cadre d’une intégration partenaire accompagnée. Un serveur partenaire authentifié peut créer une rencontre idempotente, recevoir deux liens bootstrap propres aux rôles, lire un statut non géographique et réémettre un lien tant que son rôle n’a pas été consommé. Les participants poursuivent ensuite le parcours SafeMeet sur le Web ou Android : saisie séparée des points de départ et des modes de déplacement, génération d’un snapshot de lieux, proposition, contre-proposition et acceptation.

Le produit ne fournit pas d’API publique en libre-service, de SDK public, de webhook, de callback, de notification partenaire ou d’environnement de staging. L’API partenaire ne restitue pas le lieu proposé ou accepté. Elle expose seulement l’état fonctionnel, l’expiration, la présence d’un snapshot, `acceptedAt` et les rôles dont le lien peut encore être réémis. La perte d’une capability après attribution est définitive.

Le démonstrateur commercial explique correctement le problème métier et la séparation des points de départ. Il reste explicitement simulé, sans réseau ni stockage. Cinq de ses sept étapes nécessitent néanmoins un ajustement avant publication commerciale : représentation des deux liens, signal de progression de l’autre participant, catégories et sémantique des lieux, affichage du propre point de départ après soumission, mécanisme d’acceptation et retour du lieu dans la messagerie.

## 2. Périmètre et niveaux de disponibilité

Quatre niveaux doivent rester distincts dans les contenus publics :

| Niveau | Définition | État actuel |
| --- | --- | --- |
| Démonstration simulée | Parcours statique avec données fictives, sans appel API, stockage ou géolocalisation. | Disponible sur `/business/demo/` et `/fr/business/demo/`, avec `noindex` et sans GA4. |
| API B2B privée | Trois endpoints serveur-à-serveur protégés par `X-Halfy-Partner-Key`. | Implémentée et documentée ; ce n’est pas une API publique en libre-service. |
| Intégration partenaire accompagnée | Provisionnement manuel, paramètres pilote convenus, remise des liens par le partenaire et validation coordonnée. | Techniquement possible ; acquisition du premier partenaire et validation E2E restent en cours. |
| Fonctionnalités futures | Retour du lieu dans la marketplace, notifications, webhook, callback, compte, récupération inter-appareils, portail ou souscription autonome. | Non disponibles. Ne pas les présenter comme incluses. |

## 3. Capacités réellement implémentées

### 3.1 Création d’une rencontre B2B

Le serveur partenaire appelle `POST /api/v1/partner/meetings` avec un `externalTransactionId` stable, sensible à la casse et limité à 200 caractères. La clé partenaire reste côté serveur. Le couple partenaire + identifiant externe constitue la clé d’idempotence.

- Première création : `201 Created`, `created=true`, un `meetingId` et deux URL bootstrap.
- Retry idempotent : `200 OK`, même `meetingId`, `created=false` et URL à `null`.
- Un retry ne recrée ni ne restitue les liens initiaux.
- Les refus liés au pilote sont des `403` distincts de l’authentification.
- Aucune clé partenaire ne doit entrer dans le Web, l’application Android ou un navigateur de marketplace.

Preuves principales :

- `Halfy.Backend/Halfy.Api/Controllers/PartnerMeetingsController.cs`
- `Halfy.Backend/Halfy.Application/Services/PartnerMeetingService.cs`
- `Halfy.Backend/Halfy.Application/DTOs/PartnerMeetingDtos.cs`
- `Halfy.Backend/docs/SafeMeet-Business-Integration.md`

### 3.2 Liens bootstrap et durées

La création initiale produit deux liens indépendants : un pour `creator`, un pour `participant`. Le token est placé dans le fragment `#token=...`, jamais dans le path ou la query. Chaque lien est à usage unique et n’est pas une preuve d’identité.

Le paramétrage actuel distingue trois durées :

| Horloge | Valeur actuelle | Règle |
| --- | --- | --- |
| Lien bootstrap | 60 minutes au maximum | Expire au plus tôt entre cette durée et l’expiration de la session. Une rotation invalide immédiatement l’ancien lien non consommé. |
| Session SafeMeet | 12 heures | `expiresAt` renvoyé par l’API fait foi pour la session et la capability. |
| Pilote partenaire | 30 jours | Démarre avec la première création réussie pour un partenaire `Pilot`. |

Ces nombres sont des paramètres actuels et non des limites universelles. Un rôle consommé ne peut pas être réémis. Si le client échange le bootstrap mais perd la réponse contenant la capability, cette capability n’est ni récupérable ni remplaçable.

Preuves :

- `Halfy.Backend/Halfy.Application/Configuration/PartnerMeetingOptions.cs`
- `Halfy.Backend/Halfy.Api/appsettings.json`
- `Halfy.Backend/Halfy.Infrastructure/Repositories/PartnerMeetingStore.cs`
- `Halfy.Backend/docs/PartnerMeetings.md`

### 3.3 Parcours acheteur et vendeur sur le Web

`/meet/start` capture le fragment avant tout `await`, efface l’URL avec `history.replaceState`, échange le token dans le corps de `POST /api/v1/safe-meet/start` et stocke seulement la capability de rôle dans `localStorage`. Cette route ne charge pas Google Analytics et utilise des en-têtes CSP, `Referrer-Policy` et `Cache-Control` dédiés.

Après l’échange, chaque rôle suit le même parcours fonctionnel :

1. restaurer sa capability dans le même profil si elle existe encore ;
2. renseigner son propre point de départ et son mode ;
3. attendre que les deux rôles soient prêts ;
4. générer ou restaurer le snapshot ;
5. proposer, contre-proposer ou accepter selon la relation `you` / `other` ;
6. relire le lieu accepté jusqu’à l’expiration.

Le Web stocke la capability par rôle et par `publicId`. Il ne persiste ni origine, ni adresse, ni route, ni midpoint, ni snapshot, ni proposition. Il n’existe pas de liste « Mon rendez-vous », de compte ou de synchronisation inter-appareils.

Preuves :

- `Halfy.WebApp/src/services/safeMeetStartBootstrap.ts`
- `Halfy.WebApp/src/services/safeMeetStorage.ts`
- `Halfy.WebApp/src/services/safeMeet.ts`
- `Halfy.WebApp/src/components/SafeMeetOrigin.tsx`
- `Halfy.WebApp/src/components/SafeMeetCandidates.tsx`
- `Halfy.WebApp/docs/SafeMeet-Web.md`

### 3.4 Parcours Android

Android reconnaît les liens HTTPS `https://app.halfy.app/meet/...`, dont `/meet/start#token=...`, via React Native Linking et les App Links. Production et Preview utilisent des packages distincts mais le même domaine et le même Backend.

- Le token bootstrap reste en mémoire, est échangé une fois et n’entre pas dans les paramètres de navigation.
- La disponibilité de SecureStore est vérifiée avant consommation.
- La capability est enregistrée dans SecureStore ; AsyncStorage ne contient que `publicId`, rôle, expiration et pointeur créateur non secrets.
- Les doubles livraisons cold/warm sont filtrées pendant l’échange.
- Sans application ou si l’association Android ne s’applique pas, la route Web reste le fallback.
- L’APK Preview B2B-05.1 a été compilé et installé ; la validation E2E complète reste en cours.

Preuves :

- `Halfy.Mobile/services/safeMeetLinking.ts`
- `Halfy.Mobile/services/safeMeetStartFlow.ts`
- `Halfy.Mobile/services/safeMeetStorage.ts`
- `Halfy.Mobile/screens/SafeMeetSessionScreen.tsx`
- `Halfy.Mobile/docs/Architecture.md`
- `Halfy.Mobile/docs/android-preview-configuration.md`

### 3.5 Origines privées et transports individuels

Chaque capability autorise un rôle précis. Le participant envoie uniquement ses coordonnées et son mode parmi `walking`, `bicycling` et `driving`. L’adresse textuelle n’est pas envoyée au endpoint d’origine. Les modes des deux participants peuvent différer.

Le Backend persiste les coordonnées sous forme chiffrée authentifiée, dans des champs distincts par rôle, lorsque la persistance des origines est activée. Il ne possède pas de colonne de coordonnées en clair. L’autre origine, son mode, le midpoint et les routes ne sont jamais exposés aux participants ou au partenaire. Les clients effacent l’adresse et les coordonnées de leur état après soumission et ne les placent pas dans leur stockage SafeMeet.

Limite d’exploitation : le dépôt conserve `OriginPersistenceEnabled=false` dans la configuration de base. L’activation opérationnelle exige une surcharge et une clé de chiffrement valides. Cet audit n’a pas inspecté la configuration confidentielle Production.

Preuves :

- `Halfy.Backend/Halfy.Application/Services/SafeMeetService.cs`
- `Halfy.Backend/Halfy.Application/Security/SafeMeetOriginProtector.cs`
- `Halfy.Backend/Halfy.Infrastructure/Repositories/SafeMeetSessionStore.cs`
- `Halfy.Backend/docs/SafeMeet-Security.md`
- `Halfy.WebApp/src/components/SafeMeetOrigin.tsx`
- `Halfy.Mobile/components/SafeMeetOrigin.tsx`

### 3.6 Sélection et classement des lieux

La génération est explicite après readiness. Les seuls critères communs sont la catégorie et `openNowOnly`. Les catégories canoniques sont `bar`, `cafe`, `restaurant`, `cinema`, `museum` et `florist`. Le client ne choisit ni rayon ni mode commun.

Le Backend :

1. détermine un midpoint éphémère ; avec des modes différents, il utilise le midpoint géographique arithmétique ;
2. essaie les rayons 200, 500, 750 puis 1 000 mètres ;
3. déduplique les POI et s’arrête au premier rayon donnant au moins cinq candidats valides, ou conserve le résultat final ;
4. calcule une durée depuis chaque origine avec le mode individuel du rôle ;
5. classe par `max(duréeA, duréeB) + abs(duréeA - duréeB)`, puis durée maximale, puis ordre fournisseur ;
6. persiste au plus cinq POI publics dans un snapshot partagé et immuable.

Les durées et scores sont des entrées éphémères. Ils ne sont ni retournés ni persistés. Un candidat dont une route est inaccessible peut rester dans le snapshot avec un score interne infini ; il ne faut donc pas promettre que chaque lieu est accessible par les deux participants. Le chemin OSRM Table reste désactivé.

Web et Android affichent des cartes de POI et des liens de navigation. Le parcours SafeMeet Web ne réutilise pas la carte Search afin d’éviter d’exposer indirectement la géographie privée.

Preuves :

- `Halfy.Backend/Halfy.Application/Services/SafeMeetCandidateService.cs`
- `Halfy.Backend/docs/SafeMeet-Security.md`
- `Halfy.WebApp/src/components/SafeMeetCandidates.tsx`
- `Halfy.Mobile/components/SafeMeetCandidates.tsx`

### 3.7 Proposition, contre-proposition et acceptation

Une seule proposition est active par session. L’un ou l’autre rôle peut proposer un candidat du snapshot. Le même auteur peut répéter la même proposition de manière idempotente, mais ne peut pas remplacer seul sa proposition par un autre lieu. L’autre rôle peut créer une contre-proposition qui remplace atomiquement la proposition active.

Seul le rôle opposé au proposant actif peut accepter. L’auto-acceptation est rejetée. L’acceptation conserve le POI public accepté et `acceptedAt`. Ce mécanisme est un accord sur le lieu dans SafeMeet, pas une preuve de remise effectuée, de paiement, de transaction conclue ou de sécurité physique.

Les clients relisent périodiquement le statut : 7,5 secondes pour la négociation sur le Web, avec une logique équivalente sur Mobile. Il n’existe ni temps réel, ni notification push, ni historique public des propositions.

Preuves :

- `Halfy.Backend/Halfy.Application/Services/SafeMeetNegotiationService.cs`
- `Halfy.Backend/Halfy.Api/Controllers/SafeMeetController.cs`
- `Halfy.WebApp/src/components/SafeMeetCandidates.tsx`
- `Halfy.Mobile/components/SafeMeetCandidates.tsx`

### 3.8 Expiration et reprise

Une session encore valide peut être relue dans le même profil Web ou sur le même terminal Android si la capability de rôle est toujours présente. Une session acceptée reste consultable jusqu’à `expiresAt`. Les clients relisent le statut et le snapshot ; ils ne recalculent pas les lieux.

La reprise ne couvre pas :

- la perte ou l’effacement de la capability ;
- le passage à un autre navigateur ou terminal ;
- l’échange bootstrap consommé dont la réponse a été perdue ;
- une session expirée ;
- une liste de rencontres liée à un compte.

Après expiration logique, les actions sont refusées. Le worker supprime ensuite la session et ses données privées après le délai de rétention. Les marqueurs commerciaux non géographiques du `PartnerMeeting` survivent, sans rendre la session récupérable.

Preuves :

- `Halfy.Backend/docs/Data-Retention.md`
- `Halfy.WebApp/src/services/safeMeetStorage.ts`
- `Halfy.Mobile/services/safeMeetStorage.ts`

### 3.9 États et indicateurs accessibles au partenaire

`GET /api/v1/partner/meetings/{meetingId}` retourne :

- `meetingId` et `externalTransactionId` ;
- `functionalState` : `created`, `joined`, `ready`, `accepted` ou exceptionnellement `unavailable` ;
- `expired` ;
- `snapshotAvailable` ;
- `acceptedAt` ;
- `expiresAt` ;
- `reissuableRoles`.

Le statut partenaire ne retourne pas le `publicId`, le rôle ayant proposé, le candidat actif, le lieu accepté, les origines, les modes, les routes, les capabilities ou les liens bootstrap. Il n’existe pas de webhook : le partenaire doit effectuer une lecture explicite s’il a besoin de ce statut.

`MeetingQualified` n’est pas exposé par cette route. Cet événement interne signifie que le premier snapshot non vide éligible a été persisté. Il ne signifie ni acceptation, ni transaction conclue, ni remise effectuée.

Preuves :

- `Halfy.Backend/Halfy.Application/DTOs/PartnerMeetingDtos.cs`
- `Halfy.Backend/Halfy.Application/Services/PartnerMeetingService.cs`
- `Halfy.Backend/docs/PartnerUsageMetering.md`

### 3.10 Quotas du pilote et anti-abus

Les paramètres de provisionnement actuels sont 30 jours, 150 créations et un seuil de 100 `MeetingQualified`. Ils sont copiés sur le partenaire et peuvent différer. La période UTC est semi-ouverte et démarre avec la première création réussie. Le seuil de qualification bloque seulement les nouvelles créations ; les rencontres déjà créées continuent.

La limitation anti-abus est distincte : 30 tentatives d’authentification partenaire par fenêtre fixe de 60 secondes et par adresse IP résolue dans la configuration actuelle. Une saturation produit `429 PARTNER_RATE_LIMITED` sans `Retry-After` contractuel.

Les valeurs 30/150/100 ne doivent pas être publiées comme limites universelles ou comme tarification.

Preuves :

- `Halfy.Backend/Halfy.Application/Configuration/PartnerPilotOptions.cs`
- `Halfy.Backend/Halfy.Infrastructure/Repositories/PartnerMeetingStore.cs`
- `Halfy.Backend/Halfy.Api/Security/PartnerAuthenticationRateLimiter.cs`
- `Halfy.Backend/docs/PartnerPilotQuotas.md`

### 3.11 Limites fonctionnelles et techniques

- Pas de webhook, callback, push, chat, annulation, historique public des propositions ou retour automatique vers une marketplace.
- Pas de compte participant, de liste « Mon rendez-vous », de récupération cross-device ou de récupération d’une capability perdue.
- Pas de SDK public, portail partenaire, souscription en ligne, tarification publique ou environnement de staging.
- Pas d’accord préalable des deux rôles sur les critères communs : le premier snapshot gagne et devient immuable.
- Pas de rayon client ; maximum cinq candidats, dans les catégories prises en charge.
- Pas de carte SafeMeet sur le Web ; affichage par cartes de lieux publics.
- Polling et retry borné, sans SignalR, Redis ou file de messages.
- Le propriétaire d’une génération reste lié à sa requête HTTP. Une annulation peut rendre la tentative reprenable.
- Le modèle de confiance du proxy Railway pour un partitionnement IP fiable reste documenté comme non résolu.
- La validation E2E B2B-05.1 complète, notamment Web ↔ Android, est encore en cours.

## 4. Audit des sept étapes du démonstrateur WEB-B2B-05.1.1

Les statuts ci-dessous évaluent la fidélité au produit actuel, pas la qualité graphique du démonstrateur.

| Étape | Statut | Comparaison avec le produit réel | Action recommandée pour WEB-B2B-05.2 |
| --- | --- | --- | --- |
| 1. Conversation et CTA « Organiser avec SafeMeet » | **Simplification acceptable pour une simulation** | Le CTA appartient à la marketplace partenaire, pas aux clients Halfy. L’API privée permet au serveur de créer la rencontre au moment choisi par la marketplace. Le texte sur l’alternative au partage d’adresse est justifié ; aucune hausse d’engagement n’est démontrée. | Conserver le déclenchement simulé. Ajouter dans le panneau que la marketplace appelle son serveur, lequel crée la rencontre via l’API privée. |
| 2. « Invitation prête » | **Écart nécessitant une correction** | Le produit ne crée pas une invitation commune. Il renvoie deux liens bootstrap distincts, un par rôle, avec une durée limitée. La bascule directe vers l’acheteur dans le même navigateur reste une convention de simulation. | Remplacer « invitation » au singulier par « liens de démarrage » et expliquer que la marketplace remet séparément le lien acheteur et le lien vendeur. Conserver la mention qu’aucun lien réel n’est envoyé. |
| 3. Point de départ et mode de l’acheteur | **Conforme au produit actuel** | Chaque rôle fournit séparément une origine et choisit `walking`, `bicycling` ou `driving`. L’autre rôle ne reçoit pas ces données. La simulation reconnaît correctement que les modes n’influencent pas ses résultats fictifs. | Conserver l’étape. Retirer « l’acheteur s’engage plus facilement », qui est un bénéfice comportemental non mesuré. Préférer : « L’acheteur peut poursuivre sans transmettre son point de départ au vendeur. » |
| 4. Point de départ du vendeur et message « l’acheteur a renseigné » | **Fonctionnalité non implémentée** pour le signal individuel ; saisie vendeur conforme | Le statut protégé expose seulement `bothOriginsReady`. Avant sa propre soumission, le vendeur ne reçoit pas un indicateur individuel confirmant que l’acheteur a terminé. Les deux rôles saisissent bien leur origine séparément. | Remplacer l’encart par une indication de simulation, ou par « Chaque participant remplit son étape séparément ». Ne pas promettre un indicateur de progression par personne. |
| 5. Carte et choix de trois lieux | **Écart nécessitant une correction** | Le Backend propose jusqu’à cinq POI dans six catégories et les classe à partir des temps de trajet individuels. Le Web affiche des cartes, pas une carte SafeMeet. `Place Centrale` et `Entrée du parc` ne correspondent pas aux catégories actuelles. La sélection d’un lieu est une proposition, pas encore un choix commun. | Conserver la carte comme illustration locale clairement signalée. Utiliser trois POI fictifs appartenant aux catégories prises en charge. Remplacer « situé à mi-chemin » par « classé pour équilibrer les trajets » et « sélectionner » par « proposer ». |
| 6. Vues participant et confirmation | **Écart nécessitant une correction** | Le lieu proposé ou accepté est partagé et l’autre origine reste masquée. En revanche, les clients effacent l’origine après soumission et ne la réaffichent pas dans le résultat. L’accord réel est une proposition acceptée par l’autre rôle, pas une confirmation mutuelle abstraite en un clic. | Retirer le propre point de départ de la vue résultat. Montrer « proposition de l’acheteur » puis « acceptée par le vendeur », ou une contre-proposition puis acceptation. Garder les vues alternées comme artifice de simulation. |
| 7. Retour du lieu dans la conversation | **Fonctionnalité non implémentée** | Aucun callback ou webhook ne renvoie le lieu. Le statut partenaire peut indiquer `accepted` et `acceptedAt`, mais il ne contient pas le POI accepté. La marketplace ne peut donc pas afficher ce lieu à partir de l’API actuelle. L’acceptation SafeMeet ne conclut pas la transaction commerciale. | Présenter cette vue comme une **projection future** distincte, ou limiter le retour simulé à un état « lieu accepté dans SafeMeet » sans afficher le nom du lieu. Remplacer « la transaction se conclut » par une formulation sur l’organisation de la remise. |

### Inventaire synthétique des écarts

1. Un lien générique est montré alors que deux liens bootstrap de rôle sont créés.
2. Le vendeur reçoit un signal individuel de progression que le contrat n’expose pas.
3. Deux des trois lieux fictifs ne correspondent pas aux catégories actuelles.
4. Le démonstrateur parle de « mi-chemin » et de choix commun avant la proposition/acceptation.
5. Le propre point de départ est réaffiché après soumission alors que les clients réels l’effacent.
6. La confirmation simulée ne représente pas la règle « proposition de l’un, acceptation par l’autre ».
7. Le lieu accepté est réinjecté dans la conversation sans mécanisme produit disponible.
8. Deux formulations commerciales sont trop fortes : engagement supposé plus facile et transaction présentée comme conclue.

## 5. Matrice des capacités et formulations commerciales

| Affirmation envisagée | Justification et source | État | Formulation publique autorisée | Réserve nécessaire |
| --- | --- | --- | --- | --- |
| « Simplifiez l’organisation d’une remise en main propre. » | Parcours origine → lieux → proposition → acceptation. `SafeMeetController`, clients Web/Mobile. | **Disponible** | « Aidez acheteurs et vendeurs à organiser leur lieu de remise en main propre. » | Ne pas promettre la conclusion de la vente ou de la remise. |
| « Les participants n’ont pas besoin d’échanger leur point de départ. » | Origines chiffrées par rôle, réponses sans géographie privée. `SafeMeetService`, `SafeMeetOriginProtector`. | **Disponible** | « Chaque participant renseigne son point de départ séparément, sans le communiquer à l’autre. » | Dire « point de départ » plutôt que garantir qu’il s’agit toujours d’une adresse personnelle ou du domicile. |
| « Chacun choisit son mode de déplacement. » | Modes individuels `walking`, `bicycling`, `driving`. | **Disponible** | « Chacun choisit son propre mode de déplacement : à pied, à vélo ou en voiture. » | Pas de transports en commun. |
| « Halfy propose des lieux équilibrés pour les deux trajets. » | Classement par temps maximal et écart de durées. `SafeMeetCandidateService`. | **Disponible** | « SafeMeet classe des lieux publics pour mieux équilibrer les temps de trajet des deux participants. » | Ne pas dire « exactement à mi-chemin », « optimal » ou « accessible à tous ». |
| « Jusqu’à cinq lieux publics sont proposés. » | Snapshot de cinq POI maximum et six catégories. | **Disponible** | « SafeMeet propose jusqu’à cinq lieux publics dans les catégories disponibles. » | Une recherche peut retourner moins de cinq lieux, voire aucun. |
| « Les participants peuvent proposer, contre-proposer et accepter un lieu. » | `SafeMeetNegotiationService`, composants Web/Mobile. | **Disponible** | Formulation identique autorisée. | Une seule proposition active ; l’auteur ne peut pas accepter sa propre proposition. |
| « Le parcours fonctionne sur le Web et Android. » | `/meet/start`, fallback Web, Android App Links, clients complets. | **Partiel** | « Le parcours est disponible sur le Web et dans l’application Android. » | Ajouter en contexte pilote que la validation E2E de la version B2B-05.1 est en cours. Ne pas promettre iOS natif. |
| « Aucun compte Halfy supplémentaire n’est requis. » | Autorisation par capabilities de rôle, sans entité compte. | **Disponible** | « Les participants ouvrent leur lien dans Halfy sans créer de compte Halfy. » | Ils utilisent le Web ou l’application Halfy ; la marketplace reste responsable de l’identité et de la remise du bon lien. |
| « Une API B2B existe pour créer et suivre les rencontres. » | Trois endpoints `/api/v1/partner/meetings`. | **Disponible, privée** | « Une API B2B privée est disponible dans le cadre d’une intégration partenaire accompagnée. » | Ne pas écrire « API publique », « inscrivez-vous » ou « self-service ». |
| « La création est idempotente. » | Unicité partenaire + `externalTransactionId`, retry sans nouveaux liens. | **Disponible** | Formulation adaptée à une section technique : « Un identifiant de transaction stable permet de retenter la création sans créer une seconde rencontre. » | Le retry ne restitue jamais les liens ; récupération par rotation seulement pour les rôles non consommés. |
| « Le partenaire peut suivre l’état de la rencontre. » | `functionalState`, expiration, snapshot, `acceptedAt`. | **Partiel** | « Le serveur partenaire peut lire l’état fonctionnel et l’expiration d’une rencontre. » | Pas de push, webhook, participant détaillé ou lieu accepté. Lecture par polling raisonné uniquement si nécessaire. |
| « Le lieu accepté revient automatiquement dans la marketplace. » | Aucun endpoint ou callback ne retourne ce lieu au partenaire. | **Non disponible** | Aucune formulation au présent. | Peut être présenté uniquement comme piste d’intégration future clairement étiquetée. |
| « Une rencontre reste accessible après fermeture de l’application. » | Capability persistée localement et statut restauré. | **Partiel** | « Une rencontre encore valide peut être reprise sur le même navigateur ou terminal si sa capability est toujours présente. » | Pas de récupération inter-appareils, après perte de stockage ou expiration. |
| « Les liens peuvent être renvoyés. » | Réémission atomique des rôles non consommés. | **Partiel** | « Le serveur partenaire peut faire tourner un lien tant que le rôle correspondant n’a pas été attribué. » | Un rôle consommé ne peut jamais être réémis ; une capability perdue n’est pas récupérable. |
| « Le pilote comprend 30 jours, 150 créations et 100 qualifications. » | `PartnerPilotOptions`, quotas persistés. | **Disponible comme paramétrage actuel** | À réserver aux échanges contractuels : « Les paramètres du pilote sont convenus avec chaque partenaire. » | Ne pas publier 30/150/100 comme offre universelle, prix ou droit permanent. |
| « Une rencontre qualifiée est une transaction conclue. » | `MeetingQualified` = premier snapshot non vide éligible. | **Non disponible / faux** | Ne pas utiliser cette équivalence. | Employer seulement la définition technique interne si nécessaire. |
| « SafeMeet réduit la fraude. » | Aucune mesure ou fonctionnalité de preuve de transaction. | **Non disponible** | Aucune promesse de réduction de fraude. | Expliquer uniquement la confidentialité des points de départ et le parcours encadré. |
| « SafeMeet garantit une rencontre sûre. » | Aucun contrôle de sécurité physique ou garantie de personne/lieu. | **Non disponible** | « SafeMeet aide à choisir un lieu public sans partager les points de départ. » | Ne jamais promettre une sécurité physique ou absolue. |
| « La marketplace reçoit des notifications en temps réel. » | Polling client, aucun SignalR, webhook ou callback. | **Non disponible** | Aucune formulation au présent. | Une évolution demanderait une décision produit et d’architecture. |
| « Une intégration prête à installer ou un SDK sont disponibles. » | Guide et exemple serveur .NET, mais aucun SDK public. | **Partiel** | « Halfy fournit un guide d’intégration et accompagne le pilote technique. » | L’exemple .NET n’est pas un SDK publié ou versionné. |

## 6. Architecture de contenu proposée pour WEB-B2B-04

WEB-B2B-04 doit créer quatre pages statiques :

- `/business/` et `/fr/business/` : entrée SafeMeet Business pour les décideurs produit et dirigeants ;
- `/business/marketplaces/` et `/fr/business/marketplaces/` : cas d’usage détaillé pour les marketplaces et responsables techniques.

La promesse principale commune est : **simplifier l’organisation d’une remise en main propre**. La confidentialité des points de départ et le parcours mieux encadré sont des bénéfices complémentaires, pas des garanties de sécurité.

### 6.1 Page `/business/` et `/fr/business/`

| Section | Contenu français | Contenu anglais britannique | Preuve ou CTA |
| --- | --- | --- | --- |
| Hero | « Simplifiez l’organisation des remises en main propre. » | “Make in-person handoffs easier to organise.” | Sous-titre factuel : SafeMeet aide deux personnes à choisir un lieu public sans communiquer leurs points de départ. CTA principal : « Demander un pilote » / “Request a pilot”. |
| Problème métier | Les utilisateurs négocient encore adresse, quartier et lieu dans une messagerie libre. | Users still negotiate addresses, areas and meeting places in an open chat thread. | Ne pas inventer de métrique de friction, conversion ou fraude. |
| Fonctionnement | 1. La plateforme crée une rencontre. 2. Chaque participant ouvre son lien et renseigne son point de départ. 3. Ils proposent puis acceptent un lieu. | Même structure, adaptée naturellement en anglais britannique. | Schéma sobre utilisant les assets SafeMeet officiels. |
| Bénéfices utilisateurs | Moins de données de départ échangées ; modes individuels ; lieu public commun ; reprise locale tant que la capability existe. | Reprendre les mêmes bénéfices vérifiés dans une rédaction anglaise naturelle. | Réserves visibles sur l’expiration et la reprise locale. |
| Bénéfices plateformes | Déclenchement lié à une transaction, création idempotente, statut non géographique, intégration accompagnée. | Reprendre les mêmes capacités vérifiées sans surpromesse. | Ne pas annoncer le retour du POI, des webhooks ou des notifications. |
| Démonstration | Présenter le parcours comme une simulation avec données fictives. | “View the simulated marketplace demo.” | Lien vers la route de langue correspondante ; garder la page démo `noindex` jusqu’à WEB-B2B-05.2 et validation commerciale. |
| Intégration technique | API privée serveur-à-serveur, deux liens de rôle, Web et Android, guide et exemple .NET. | “Private server-to-server API, supported through an accompanied pilot.” | Ne pas exposer les quotas, en-têtes, limites anti-abus ou détails opérationnels confidentiels sur la page marketing. |
| CTA final | « Parlez-nous de votre parcours de remise en main propre. » | “Tell us about your in-person handoff flow.” | `mailto:` actuel ou future page de contact après décision WEB-B2B-06. |

### 6.2 Page `/business/marketplaces/` et `/fr/business/marketplaces/`

| Section | Objectif | Contenu autorisé |
| --- | --- | --- |
| Hero vertical | Nommer le cas d’usage. | « Un parcours de rencontre pour vos acheteurs et vendeurs. » / “A meetup flow for your buyers and sellers.” |
| Situation actuelle | Partir de la conversation d’une annonce et de la remise locale. | Pas d’affirmation chiffrée ou universelle sur la fraude, la confiance ou la conversion. |
| Parcours détaillé | Montrer le déclenchement serveur, les deux liens, les deux saisies séparées, les lieux classés, la proposition et l’acceptation. | Le retour dans la marketplace doit être limité au statut disponible ou signalé comme évolution future. |
| Frontières de responsabilité | Clarifier plateforme, Halfy et participants. | La marketplace associe transaction et rôles, remet les liens et gère l’identité ; Halfy exécute SafeMeet ; les participants choisissent et acceptent le lieu. |
| Confidentialité | Expliquer ce qui n’est pas partagé. | Points de départ non exposés à l’autre rôle ou au partenaire ; ne pas dévoiler de détails de configuration ou de clés. |
| Capacité technique | Présenter l’intégration accompagnée. | Création idempotente, statut, réémission avant consommation, Web/Android. Liste courte des limites : pas de webhook, pas de récupération de capability. |
| Démonstration | Donner accès au scénario simulé après corrections WEB-B2B-05.2. | Badge permanent « Démonstration simulée » / “Simulated demo”. |
| Pilote | Qualifier le prospect. | « Demander un pilote » et questions sur volume, parcours de remise, canaux de remise des liens et contraintes techniques. Aucune tarification inventée. |

### 6.3 Intégration Eleventy, i18n, SEO et navigation

1. Ajouter `business` et `businessMarketplaces` dans `src/_data/routes.js`, avec routes EN et FR.
2. Créer les quatre pages Nunjucks sous `src/pages/en/business/` et `src/pages/fr/business/`.
3. Réutiliser `layouts/base.njk` ou créer un layout Business partagé seulement si les deux pages ont une structure réellement commune.
4. Utiliser les composants de header, footer, SEO et CTA existants. Ne pas dupliquer les chaînes de navigation dans les pages.
5. Activer `navigation.sections.business` uniquement lorsque les quatre pages, les traductions et les liens sont validés. Ajouter `headerCtaByRouteKey.business` et le mapping marketplace vers le CTA Business existant.
6. Conserver des permalinks avec `index.html`, les canonical, `hreflang`, `x-default` et sitemap générés depuis `routeKey`.
7. Utiliser les logos officiels dans `/assets/safemeet-logos/` sans créer de logo SafeMeet Business distinct. Variante couleur sur fond clair, variante blanche sur fond sombre.
8. Rédiger séparément FR et EN. Employer l’orthographe britannique : `organise`, `centre`, `neighbourhood`. Éviter les traductions littérales et la casse de titre systématique.
9. Prévoir des titres SEO factuels. Exemples :
   - FR Business : `SafeMeet Business — Organiser les remises en main propre` ;
   - EN Business : `SafeMeet Business — Organise in-person handoffs` ;
   - FR Marketplaces : `SafeMeet pour les marketplaces — Parcours acheteur et vendeur` ;
   - EN Marketplaces : `SafeMeet for marketplaces — Buyer and seller meetup flow`.
10. Garder la démonstration hors navigation principale et `noindex` tant que les écarts de la section 4 ne sont pas corrigés et validés.

## 7. Décisions nécessaires avant développement

1. **Positionnement public de l’API** : valider la formulation recommandée « API B2B privée disponible dans le cadre d’une intégration partenaire accompagnée ».
2. **Correction du démonstrateur** : décider si l’étape 7 devient une projection future explicite ou un simple statut d’acceptation sans nom de lieu.
3. **Disponibilité Android** : décider si les pages publiques mentionnent Android immédiatement ou seulement après clôture de la validation E2E B2B-05.1.
4. **CTA pilote** : conserver temporairement le `mailto:` ou prioriser `/business/contact/` dans WEB-B2B-06 avant publication des pages.
5. **Paramètres commerciaux** : confirmer que 30/150/100 restent hors des pages publiques et sont convenus pendant le pilote.
6. **Revue éditoriale et juridique** : valider les formulations de confidentialité, le statut de Kër IT en cours de formation et la stratégie GA4/consentement avant toute acquisition mesurée.

## 8. Fichiers consultés et preuves

### Backend

- `README.md`
- `docs/SafeMeet.md`
- `docs/SafeMeet-Security.md`
- `docs/SafeMeet-Business-Integration.md`
- `docs/PartnerMeetings.md`
- `docs/PartnerPilotQuotas.md`
- `docs/PartnerUsageMetering.md`
- `docs/Data-Retention.md`
- `docs/B2B-Operations.md`
- `Halfy.Api/Controllers/PartnerMeetingsController.cs`
- `Halfy.Api/Controllers/SafeMeetController.cs`
- `Halfy.Api/Security/PartnerAuthenticationRateLimiter.cs`
- `Halfy.Api/appsettings.json`
- `Halfy.Application/DTOs/PartnerMeetingDtos.cs`
- `Halfy.Application/DTOs/SafeMeetDtos.cs`
- `Halfy.Application/Services/PartnerMeetingService.cs`
- `Halfy.Application/Services/SafeMeetService.cs`
- `Halfy.Application/Services/SafeMeetCandidateService.cs`
- `Halfy.Application/Services/SafeMeetNegotiationService.cs`
- `Halfy.Infrastructure/Repositories/PartnerMeetingStore.cs`
- `Halfy.Infrastructure/Repositories/SafeMeetSessionStore.cs`

### WebApp

- `README.md`
- `docs/SafeMeet-Web.md`
- `src/services/safeMeet.ts`
- `src/services/safeMeetStartBootstrap.ts`
- `src/services/safeMeetStorage.ts`
- `src/components/SafeMeetOrigin.tsx`
- `src/components/SafeMeetCandidates.tsx`
- tests associés aux services, origines et candidats.

### Mobile

- `README.md`
- `docs/Architecture.md`
- `docs/android-preview-configuration.md`
- `docs/V2.md`
- `services/safeMeetContracts.ts`
- `services/safeMeetService.ts`
- `services/safeMeetLinking.ts`
- `services/safeMeetStartFlow.ts`
- `services/safeMeetStorage.ts`
- `services/safeMeetCandidateGeneration.ts`
- `screens/SafeMeetSessionScreen.tsx`
- `components/SafeMeetOrigin.tsx`
- `components/SafeMeetCandidates.tsx`
- `components/SafeMeetAcceptedState.tsx`

### Website

- `AGENTS.md`
- `docs/EDITORIAL_GUIDELINES.md`
- `docs/ARCHITECTURE.md`
- `docs/BACKLOG_WEB_B2B.md`
- `docs/SAFEMEET_BUSINESS_DEMO.md`
- `docs/BRAND_ASSETS.md`
- `src/_data/routes.js`
- `src/_data/navigation.js`
- `src/pages/en/business/demo.njk`
- `src/pages/fr/business/demo.njk`
- `src/_includes/layouts/business-demo.njk`
- `src/assets/scripts/business/demo-data.js`
- `src/assets/scripts/business/demo-simulation.js`
- `src/assets/scripts/business/demo-marketplace.js`
- `scripts/test-demo.mjs`

## 9. Incertitudes et validations

### Incertitudes conservées

- La configuration confidentielle Production n’a pas été lue. L’activation réelle de la persistance chiffrée des origines, des clés et des fournisseurs n’est pas déduite de `appsettings.json`.
- La validation E2E B2B-05.1 sur l’environnement unique reste annoncée en cours dans les documents opérationnels.
- Aucun test Production, test de charge, création de rencontre réelle ou inspection de données n’a été effectué.
- Le site ne possède pas encore les pages WEB-B2B-04 ; la structure proposée n’est pas une implémentation.

### Validations exécutées

- Démonstrateur Website : 8/8 tests réussis avec `node --test scripts/test-demo.mjs`.
- SafeMeet Web ciblé : 98/98 tests réussis sur les services bootstrap/stockage/API et les composants origines/candidats.
- Mobile : 36/36 tests réussis avec `npm test`, dont App Links, échange bootstrap, absence de logs de secrets et polling B2B-05.1.
- Relecture croisée des DTO, contrôleurs, services, clients et documents listés ci-dessus.
- Aucun appel réseau applicatif, déploiement, écriture Production ou modification de code applicatif.
