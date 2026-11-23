export const DEMO_STEPS = [1, 2, 3, 4, 5, 6, 7];

export const DEMO_ROLES = ["buyer", "seller"];

export const DEMO_TRANSPORTS = ["car", "walk", "bike"];

export const DEMO_SUPPORTED_CATEGORIES = [
  "bar",
  "cafe",
  "restaurant",
  "cinema",
  "museum",
  "florist",
];

export const DEMO_VENUES = [
  {
    id: "cafe-arcades",
    category: "cafe",
    mapX: 162,
    mapY: 118,
  },
  {
    id: "restaurant-passage",
    category: "restaurant",
    mapX: 256,
    mapY: 160,
  },
  {
    id: "musee-objets",
    category: "museum",
    mapX: 336,
    mapY: 96,
  },
];

export const DEMO_COPY = {
  fr: {
    lang: "fr",
    marketplace: {
      brandName: "Market Demo",
      brandTag: "Marketplace fictive",
      roleLabels: {
        buyer: "Acheteur",
        seller: "Vendeur",
      },
      buyerInitials: "LM",
      sellerInitials: "CD",
      buyerName: "Lucas M.",
      sellerName: "Camille D.",
      sellerMemberSince: "Membre depuis 2023 (profil fictif)",
      buyerLocation: "Uccle, Bruxelles",
      sellerLocation: "Schaerbeek, Bruxelles",
      listing: {
        title: "Vélo de ville d'occasion",
        price: "250 €",
        condition: "Très bon état",
        handoff: "Remise en main propre",
        city: "Bruxelles",
        imageAlt: "Illustration d'un vélo de ville d'occasion",
      },
      conversation: [
        { authorRole: "buyer", time: "10:14", text: "Bonjour, votre vélo est toujours disponible ?" },
        { authorRole: "seller", time: "10:16", text: "Oui, je suis disponible samedi." },
        { authorRole: "buyer", time: "10:18", text: "Où pouvons-nous nous retrouver ?" },
      ],
      transports: {
        car: { label: "Voiture" },
        walk: { label: "À pied" },
        bike: { label: "Vélo" },
      },
      venues: {
        "cafe-arcades": {
          name: "Café des Arcades",
          categoryLabel: "Café",
          summary: "Établissement fictif.",
        },
        "restaurant-passage": {
          name: "Restaurant du Passage",
          categoryLabel: "Restaurant",
          summary: "Établissement fictif.",
        },
        "musee-objets": {
          name: "Musée des Objets",
          categoryLabel: "Musée",
          summary: "Établissement fictif.",
        },
      },
    },
    ui: {
      progressLabel: "Progression de la démonstration",
      stepPrefix: "Étape",
      stepOf: "sur",
      stepTitles: [
        "Messagerie",
        "Liens",
        "Acheteur",
        "Vendeur",
        "Lieux",
        "Résultat",
        "Retour",
      ],
      headerContexts: {
        1: "Annonce et messagerie",
        2: "Liens de démarrage SafeMeet",
        5: "Zone de rencontre",
        7: "Conversation mise à jour",
      },
      backButton: "Étape précédente",
      restartButton: "Recommencer la démonstration",
      activeRoleLabel: "Rôle actif :",
      roleBuyerLabel: "Acheteur (Lucas M.)",
      roleSellerLabel: "Vendeur (Camille D.)",
      step1: {
        heading: "Conversation sur l'annonce",
        promptTitle: "Vous souhaitez vous retrouver ?",
        promptText: "Choisissez un lieu sans partager vos adresses.",
        cta: "Organiser avec SafeMeet",
      },
      step2: {
        heading: "Deux liens de démarrage distincts",
        listingLine: "Vélo de ville d'occasion · 250 €",
        buyerLinkLabel: "Lien acheteur",
        sellerLinkLabel: "Lien vendeur",
        simulatedLinkText: "Lien simulé, non opérationnel",
        deliveryNote: "La marketplace remet séparément le bon lien à chaque participant. Aucun token, lien réel ou secret n'est créé dans cette démonstration.",
        platformNote: "Le parcours est disponible sur le Web et dans l'application Android. La validation E2E de la version B2B est encore en cours.",
        cta: "Poursuivre en tant qu'acheteur",
      },
      step3: {
        heading: "D'où partez-vous ?",
        locationLabel: "Votre point de départ (fictif)",
        privacyNote: "Ce point sert uniquement à situer la recherche. Il n'est pas communiqué au vendeur.",
        transportHeading: "Comment vous déplacez-vous ?",
        transportNote: "Dans cette simulation, les modes de déplacement n'influencent pas la liste des lieux.",
        cta: "Continuer vers le vendeur",
      },
      step4: {
        heading: "D'où partez-vous ?",
        separateFlowTitle: "Chaque participant remplit cette étape séparément.",
        separateFlowNote: "SafeMeet ne montre pas au vendeur si l'acheteur a terminé individuellement.",
        locationLabel: "Votre point de départ (fictif)",
        transportHeading: "Comment vous déplacez-vous ?",
        staticNote: "Démonstration statique : les données sont fictives et les modes de déplacement n'influencent pas les résultats simulés.",
        viewBuyerBtn: "Revoir l'étape acheteur",
        cta: "Voir les lieux proposés",
      },
      step5: {
        heading: "Proposez un lieu de rencontre",
        lead: "Ces établissements fictifs sont classés pour mieux équilibrer les temps de trajet des deux participants, sans garantir un mi-chemin exact ni une accessibilité identique.",
        mapAriaLabel: "Carte urbaine schématique présentant trois établissements fictifs classés",
        mapSharedZoneLabel: "Carte fictive",
        transportNotice: "Illustration locale : aucun itinéraire, temps de trajet ou service cartographique externe n'est utilisé dans cette simulation.",
        cta: "Proposer ce lieu",
      },
      step6: {
        heading: "Proposition et acceptation",
        toggleLabel: "Basculer de vue :",
        buyerViewBtn: "Vue acheteur",
        sellerViewBtn: "Vue vendeur",
        proposedVenueLabel: "Lieu proposé par l'acheteur",
        originsRemovedNote: "Les points de départ ne sont plus affichés après leur soumission.",
        negotiationHeading: "État de la proposition",
        proposalSent: "Proposition envoyée par l'acheteur",
        proposalReceived: "Proposition reçue du côté vendeur",
        proposalAccepted: "Proposition acceptée par le vendeur",
        switchToSellerBtn: "Passer à la vue vendeur",
        acceptBtn: "Accepter la proposition",
        acceptedBtn: "Proposition acceptée",
        cta: "Revenir à la marketplace",
      },
      step7: {
        heading: "Retour sur Market Demo",
        summaryHeading: "État SafeMeet",
        summaryStatusAccepted: "Lieu accepté dans SafeMeet",
        summaryNote: "Simulation illustrative : la marketplace ne reçoit ici qu'un statut non géographique. Aucun nom de lieu, adresse ou point de départ n'est retourné, et aucun appel API, webhook, callback ou notification automatique n'est effectué.",
        conclusionTitle: "L'essentiel pour votre marketplace",
        takeaways: [
          "Les acheteurs et vendeurs organisent leur remise en main propre.",
          "Ils n'ont pas besoin d'échanger leur point de départ dans le chat.",
          "Ils proposent puis acceptent un lieu public dans SafeMeet.",
        ],
        contactCta: "Parlons de votre intégration",
        contactHref:
          "mailto:contactus.kerit@gmail.com?subject=SafeMeet%20Business%20-%20%C3%89change%20sur%20l%27int%C3%A9gration%20marketplace",
        contactNote: "Kër IT (société en cours de formation). Échange direct par courriel.",
      },
      errors: {
        missingInvitation: "Lancez d'abord la proposition SafeMeet depuis la conversation.",
        missingBuyerTransport: "Choisissez un mode de déplacement pour l'acheteur.",
        missingSellerTransport: "Choisissez un mode de déplacement pour le vendeur.",
        missingVenue: "Sélectionnez l'un des trois lieux proposés pour continuer.",
        missingAcceptance: "Le vendeur doit accepter la proposition avant le retour à la marketplace.",
        invalidStep: "Complétez d'abord les étapes précédentes.",
      },
    },
    panel: {
      stepLabel: "Étape",
      forMarketplaceLabel: "Pour votre marketplace",
      steps: {
        1: {
          title: "Proposer un rendez-vous dès la messagerie",
          explanation:
            "Au moment de fixer le rendez-vous, l'acheteur clique sur « Organiser avec SafeMeet » directement depuis la conversation.",
          forMarketplace:
            "Votre serveur crée la rencontre via une API B2B privée, dans le cadre d'une intégration partenaire accompagnée.",
        },
        2: {
          title: "Remettre un lien propre à chaque rôle",
          explanation:
            "La marketplace reçoit un lien acheteur et un lien vendeur distincts, puis remet chacun séparément.",
          forMarketplace:
            "Le parcours reste centré sur la transaction sans demander aux utilisateurs de créer un nouveau compte externe.",
        },
        3: {
          title: "Recueillir le point de départ de l'acheteur",
          explanation:
            "L'acheteur confirme d'où il part et son mode de déplacement, sans que ces informations soient visibles par le vendeur.",
          forMarketplace:
            "L'acheteur peut poursuivre sans transmettre son point de départ au vendeur.",
        },
        4: {
          title: "Recueillir celui du vendeur séparément",
          explanation:
            "Le vendeur indique son propre point de départ et son mode, sans indicateur détaillé sur la progression de l'acheteur.",
          forMarketplace:
            "Les deux participants renseignent leur point de départ séparément, sans avoir à se faire confiance sur leur adresse.",
        },
        5: {
          title: "Classer des lieux publics compatibles",
          explanation:
            "SafeMeet classe des lieux publics pour mieux équilibrer les temps de trajet, sans promettre un mi-chemin exact.",
          forMarketplace:
            "Vos utilisateurs passent directement à un choix concret de lieu public plutôt que de négocier un quartier pendant plusieurs messages.",
        },
        6: {
          title: "Proposer puis accepter un lieu",
          explanation:
            "L'acheteur propose un lieu et le vendeur l'accepte. Aucun point de départ n'est réaffiché.",
          forMarketplace:
            "Chacun repart avec la même information de rendez-vous claire tout en gardant son point de départ privé.",
        },
        7: {
          title: "Lire un statut non géographique",
          explanation:
            "La marketplace peut lire un état accepté, sans recevoir le nom ni l'adresse du lieu.",
          forMarketplace:
            "Cette vue illustre un retour de statut uniquement ; elle ne clôt pas la transaction et ne simule aucune notification automatique.",
        },
      },
    },
  },
  en: {
    lang: "en",
    marketplace: {
      brandName: "Market Demo",
      brandTag: "Fictional marketplace",
      roleLabels: {
        buyer: "Buyer",
        seller: "Seller",
      },
      buyerInitials: "LM",
      sellerInitials: "CD",
      buyerName: "Lucas M.",
      sellerName: "Camille D.",
      sellerMemberSince: "Member since 2023 (fictional profile)",
      buyerLocation: "Uccle, Brussels",
      sellerLocation: "Schaerbeek, Brussels",
      listing: {
        title: "Used city bike",
        price: "€250",
        condition: "Very good condition",
        handoff: "In-person handoff",
        city: "Brussels",
        imageAlt: "Illustrative drawing of a used city bicycle",
      },
      conversation: [
        { authorRole: "buyer", time: "10:14", text: "Hello, is your bike still available?" },
        { authorRole: "seller", time: "10:16", text: "Yes, I am available on Saturday." },
        { authorRole: "buyer", time: "10:18", text: "Where could we meet?" },
      ],
      transports: {
        car: { label: "Car" },
        walk: { label: "On foot" },
        bike: { label: "Bike" },
      },
      venues: {
        "cafe-arcades": {
          name: "Arcades Café",
          categoryLabel: "Café",
          summary: "Fictional establishment.",
        },
        "restaurant-passage": {
          name: "Passage Restaurant",
          categoryLabel: "Restaurant",
          summary: "Fictional establishment.",
        },
        "musee-objets": {
          name: "Museum of Objects",
          categoryLabel: "Museum",
          summary: "Fictional establishment.",
        },
      },
    },
    ui: {
      progressLabel: "Demo progress",
      stepPrefix: "Step",
      stepOf: "of",
      stepTitles: [
        "Chat",
        "Links",
        "Buyer",
        "Seller",
        "Places",
        "Outcome",
        "Return",
      ],
      headerContexts: {
        1: "Listing and chat",
        2: "SafeMeet start links",
        5: "Shared area",
        7: "Updated chat",
      },
      backButton: "Previous step",
      restartButton: "Restart demo",
      activeRoleLabel: "Active role:",
      roleBuyerLabel: "Buyer (Lucas M.)",
      roleSellerLabel: "Seller (Camille D.)",
      step1: {
        heading: "Listing conversation",
        promptTitle: "Ready to meet?",
        promptText: "Find a place to meet without sharing your addresses.",
        cta: "Arrange with SafeMeet",
      },
      step2: {
        heading: "Two separate start links",
        listingLine: "Used city bike · €250",
        buyerLinkLabel: "Buyer link",
        sellerLinkLabel: "Seller link",
        simulatedLinkText: "Simulated link, not operational",
        deliveryNote: "The marketplace gives each participant their role-specific link separately. This demo creates no real token, link or secret.",
        platformNote: "The flow is available on the Web and in the Android app. End-to-end validation of the B2B version is still in progress.",
        cta: "Continue as buyer",
      },
      step3: {
        heading: "Where are you starting from?",
        locationLabel: "Your starting point (fictional)",
        privacyNote: "This is only used to define the search area. It is not shared with the seller.",
        transportHeading: "How are you travelling?",
        transportNote: "In this simulation, travel modes do not change the places shown.",
        cta: "Continue to seller",
      },
      step4: {
        heading: "Where are you starting from?",
        separateFlowTitle: "Each participant completes this step separately.",
        separateFlowNote: "SafeMeet does not tell the seller whether the buyer has individually completed their step.",
        locationLabel: "Your starting point (fictional)",
        transportHeading: "How are you travelling?",
        staticNote: "Static demo: all data is fictional and travel modes do not alter the simulated results.",
        viewBuyerBtn: "Review buyer step",
        cta: "See suggested places",
      },
      step5: {
        heading: "Propose a meeting place",
        lead: "These fictional establishments are ranked to better balance both participants' journey times, without guaranteeing an exact halfway point or equal access.",
        mapAriaLabel: "Schematic city map showing three ranked fictional establishments",
        mapSharedZoneLabel: "Fictional map",
        transportNotice: "Local illustration: this simulation uses no routes, journey times or external mapping service.",
        cta: "Propose this place",
      },
      step6: {
        heading: "Proposal and acceptance",
        toggleLabel: "Switch view:",
        buyerViewBtn: "Buyer view",
        sellerViewBtn: "Seller view",
        proposedVenueLabel: "Place proposed by the buyer",
        originsRemovedNote: "Starting points are no longer displayed after submission.",
        negotiationHeading: "Proposal status",
        proposalSent: "Proposal sent by the buyer",
        proposalReceived: "Proposal received by the seller",
        proposalAccepted: "Proposal accepted by the seller",
        switchToSellerBtn: "Switch to seller view",
        acceptBtn: "Accept proposal",
        acceptedBtn: "Proposal accepted",
        cta: "Return to marketplace",
      },
      step7: {
        heading: "Back on Market Demo",
        summaryHeading: "SafeMeet status",
        summaryStatusAccepted: "Place accepted in SafeMeet",
        summaryNote: "Illustrative simulation: the marketplace receives only a non-geographic status here. No place name, address or starting point is returned, and no API call, webhook, callback or automatic notification is made.",
        conclusionTitle: "Key takeaways for your marketplace",
        takeaways: [
          "Buyers and sellers arrange an in-person handoff.",
          "They do not need to share their starting points in chat.",
          "They propose and accept a public place in SafeMeet.",
        ],
        contactCta: "Discuss your integration",
        contactHref:
          "mailto:contactus.kerit@gmail.com?subject=SafeMeet%20Business%20-%20Marketplace%20integration%20enquiry",
        contactNote: "Kër IT (company in formation). Direct email contact.",
      },
      errors: {
        missingInvitation: "Start the SafeMeet suggestion from the conversation first.",
        missingBuyerTransport: "Choose a travel mode for the buyer.",
        missingSellerTransport: "Choose a travel mode for the seller.",
        missingVenue: "Select one of the three places to continue.",
        missingAcceptance: "The seller must accept the proposal before returning to the marketplace.",
        invalidStep: "Complete the previous steps first.",
      },
    },
    panel: {
      stepLabel: "Step",
      forMarketplaceLabel: "For your marketplace",
      steps: {
        1: {
          title: "Offer a meetup option inside chat",
          explanation:
            "When it is time to meet, the buyer selects 'Arrange with SafeMeet' straight from the conversation.",
          forMarketplace:
            "Your server creates the meetup through a private B2B API as part of a partner integration supported by Halfy.",
        },
        2: {
          title: "Give each role its own link",
          explanation:
            "The marketplace receives separate buyer and seller links, then gives each one to the right participant.",
          forMarketplace:
            "The handoff stays focused on the sale without asking your users to register for a separate account.",
        },
        3: {
          title: "Collect the buyer's starting point",
          explanation:
            "The buyer confirms their starting point and travel mode without exposing them to the seller.",
          forMarketplace:
            "The buyer can continue without giving their starting point to the seller.",
        },
        4: {
          title: "Collect the seller's starting point",
          explanation:
            "The seller enters their own starting point and mode without a detailed indicator of the buyer's progress.",
          forMarketplace:
            "Both people contribute their starting point separately, without having to disclose private addresses to each other.",
        },
        5: {
          title: "Rank compatible public places",
          explanation:
            "SafeMeet ranks public places to better balance journey times without promising an exact halfway point.",
          forMarketplace:
            "Users move straight to picking a concrete public venue instead of going back and forth over neighbourhoods.",
        },
        6: {
          title: "Propose and accept a place",
          explanation:
            "The buyer proposes a place and the seller accepts it. Starting points are not shown again.",
          forMarketplace:
            "Both participants get clear meetup details while keeping their own starting points private.",
        },
        7: {
          title: "Read a non-geographic status",
          explanation:
            "The marketplace can read an accepted state without receiving the place name or address.",
          forMarketplace:
            "This view illustrates status only; it does not close the transaction or simulate an automatic notification.",
        },
      },
    },
  },
};
