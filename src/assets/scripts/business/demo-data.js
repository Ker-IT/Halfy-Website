export const DEMO_STEPS = [1, 2, 3, 4, 5, 6, 7];

export const DEMO_ROLES = ["buyer", "seller"];

export const DEMO_TRANSPORTS = ["car", "walk", "bike"];

export const DEMO_VENUES = [
  {
    id: "cafe-centre",
    mapX: 162,
    mapY: 118,
  },
  {
    id: "place-centrale",
    mapX: 256,
    mapY: 160,
  },
  {
    id: "entree-parc",
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
        "cafe-centre": {
          name: "Café du Centre",
          area: "Quartier central",
          summary: "Lieu public fréquenté en journée.",
        },
        "place-centrale": {
          name: "Place Centrale",
          area: "Esplanade piétonne",
          summary: "Espace ouvert facile à repérer.",
        },
        "entree-parc": {
          name: "Entrée du parc",
          area: "Accès principal",
          summary: "Point de rendez-vous dégagé pour remettre un vélo.",
        },
      },
    },
    ui: {
      progressLabel: "Progression de la démonstration",
      stepPrefix: "Étape",
      stepOf: "sur",
      stepTitles: [
        "Messagerie",
        "Invitation",
        "Acheteur",
        "Vendeur",
        "Lieux",
        "Résultat",
        "Retour",
      ],
      headerContexts: {
        1: "Annonce et messagerie",
        2: "Invitation SafeMeet",
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
        heading: "Invitation prête pour la rencontre",
        listingLine: "Vélo de ville d'occasion · 250 €",
        note: "La marketplace ouvre un parcours dédié entre l'acheteur et le vendeur. Dans cette démonstration simulée, aucune invitation réelle n'est envoyée.",
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
        buyerDoneTitle: "L'acheteur a renseigné son point de départ.",
        buyerDoneNote: "Son adresse reste confidentielle et n'apparaît pas ici.",
        locationLabel: "Votre point de départ (fictif)",
        transportHeading: "Comment vous déplacez-vous ?",
        staticNote: "Démonstration statique : les données sont fictives et les modes de déplacement n'influencent pas les résultats simulés.",
        viewBuyerBtn: "Revoir l'étape acheteur",
        cta: "Voir les lieux proposés",
      },
      step5: {
        heading: "Choisissez un lieu de rencontre",
        lead: "Sélectionnez l'un des trois lieux publics situés dans une zone équilibrée pour les deux participants.",
        mapAriaLabel: "Carte urbaine illustrative présentant trois lieux publics dans une zone commune",
        mapSharedZoneLabel: "Zone commune",
        transportNotice: "Les modes de déplacement n'influencent pas cette liste simulée. Carte illustrative locale sans service cartographique externe.",
        cta: "Voir le résultat partagé",
      },
      step6: {
        heading: "Ce que voit chaque participant",
        toggleLabel: "Basculer de vue :",
        buyerViewBtn: "Vue acheteur",
        sellerViewBtn: "Vue vendeur",
        selectedVenueLabel: "Lieu de rencontre choisi",
        ownOriginLabel: "Votre point de départ",
        otherOriginLabel: "Point de départ de l'autre participant",
        otherOriginHidden: "Non communiqué",
        confirmHeading: "Confirmation mutuelle (simulée)",
        confirmPending: "En attente de confirmation (simulé)",
        confirmDone: "Rencontre confirmée (simulé)",
        confirmBtn: "Simuler la confirmation",
        confirmedBtn: "Confirmation simulée enregistrée",
        cta: "Revenir à la marketplace",
      },
      step7: {
        heading: "Retour sur Market Demo",
        summaryHeading: "Lieu de rencontre proposé via SafeMeet",
        summaryStatusConfirmed: "Rencontre confirmée (simulé)",
        summaryStatusPending: "Lieu proposé, en attente de confirmation (simulé)",
        summaryNote: "Aucun point de départ n'apparaît dans la messagerie. Ce retour dans la conversation est simulé ; les modalités d'intégration restent à confirmer.",
        conclusionTitle: "L'essentiel pour votre marketplace",
        takeaways: [
          "Les acheteurs et vendeurs organisent leur remise en main propre.",
          "Ils n'ont pas besoin d'échanger leur adresse personnelle dans le chat.",
          "Ils disposent d'une proposition de lieu public commun.",
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
            "Vous proposez une alternative simple au partage d'adresses personnelles par message, au moment précis où la remise en main propre se décide.",
        },
        2: {
          title: "Ouvrir un espace de rencontre dédié",
          explanation:
            "Le participant quitte la négociation libre pour entrer dans un parcours guidé associé à son achat.",
          forMarketplace:
            "Le parcours reste centré sur la transaction sans demander aux utilisateurs de créer un nouveau compte externe.",
        },
        3: {
          title: "Recueillir le point de départ de l'acheteur",
          explanation:
            "L'acheteur confirme d'où il part et son mode de déplacement, sans que ces informations soient visibles par le vendeur.",
          forMarketplace:
            "L'acheteur s'engage plus facilement sur une remise en main propre lorsqu'il n'a pas à divulguer son quartier dès le premier échange.",
        },
        4: {
          title: "Recueillir celui du vendeur séparément",
          explanation:
            "Le vendeur voit uniquement que l'acheteur a rempli sa part, puis indique son propre point de départ.",
          forMarketplace:
            "Les deux participants renseignent leur point de départ séparément, sans avoir à se faire confiance sur leur adresse.",
        },
        5: {
          title: "Suggérer des lieux publics intermédiaires",
          explanation:
            "Trois lieux publics situés à mi-chemin sont affichés sans montrer d'où vient l'autre personne.",
          forMarketplace:
            "Vos utilisateurs passent directement à un choix concret de lieu public plutôt que de négocier un quartier pendant plusieurs messages.",
        },
        6: {
          title: "Afficher le lieu commun sans exposer les départs",
          explanation:
            "Chaque participant retrouve uniquement le lieu retenu et son propre départ, puis peut simuler la confirmation.",
          forMarketplace:
            "Chacun repart avec la même information de rendez-vous claire tout en gardant son point de départ privé.",
        },
        7: {
          title: "Retrouver le rendez-vous dans la conversation",
          explanation:
            "Le lieu choisi s'affiche dans la messagerie Market Demo comme rappel de la remise en main propre.",
          forMarketplace:
            "La transaction se conclut dans votre environnement habituel, avec un lieu public prêt pour le jour du rendez-vous.",
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
        "cafe-centre": {
          name: "Café du Centre",
          area: "Central neighbourhood",
          summary: "Busy public café during the day.",
        },
        "place-centrale": {
          name: "Place Centrale",
          area: "Pedestrian square",
          summary: "Open public square that is easy to spot.",
        },
        "entree-parc": {
          name: "Park Entrance",
          area: "Main gate",
          summary: "Spacious spot suited to handing over a bicycle.",
        },
      },
    },
    ui: {
      progressLabel: "Demo progress",
      stepPrefix: "Step",
      stepOf: "of",
      stepTitles: [
        "Chat",
        "Invite",
        "Buyer",
        "Seller",
        "Places",
        "Outcome",
        "Return",
      ],
      headerContexts: {
        1: "Listing and chat",
        2: "SafeMeet invitation",
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
        heading: "Meetup link ready",
        listingLine: "Used city bike · €250",
        note: "The marketplace opens a dedicated flow between buyer and seller. In this simulated demo, no real invitation is created or sent.",
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
        buyerDoneTitle: "The buyer has entered their starting point.",
        buyerDoneNote: "Their address stays private and is not shown here.",
        locationLabel: "Your starting point (fictional)",
        transportHeading: "How are you travelling?",
        staticNote: "Static demo: all data is fictional and travel modes do not alter the simulated results.",
        viewBuyerBtn: "Review buyer step",
        cta: "See suggested places",
      },
      step5: {
        heading: "Choose a meeting place",
        lead: "Select one of the three public places in a balanced area for both participants.",
        mapAriaLabel: "Illustrative city map showing three public places in a shared area",
        mapSharedZoneLabel: "Shared area",
        transportNotice: "Travel modes do not alter this simulated list. Local schematic map with no external mapping service.",
        cta: "View participant outcome",
      },
      step6: {
        heading: "What each participant sees",
        toggleLabel: "Switch view:",
        buyerViewBtn: "Buyer view",
        sellerViewBtn: "Seller view",
        selectedVenueLabel: "Selected meeting place",
        ownOriginLabel: "Your starting point",
        otherOriginLabel: "Other participant's starting point",
        otherOriginHidden: "Not shared",
        confirmHeading: "Mutual confirmation (simulated)",
        confirmPending: "Awaiting confirmation (simulated)",
        confirmDone: "Meetup confirmed (simulated)",
        confirmBtn: "Simulate confirmation",
        confirmedBtn: "Simulated confirmation recorded",
        cta: "Return to marketplace",
      },
      step7: {
        heading: "Back on Market Demo",
        summaryHeading: "Meeting place suggested via SafeMeet",
        summaryStatusConfirmed: "Meetup confirmed (simulated)",
        summaryStatusPending: "Place suggested, awaiting confirmation (simulated)",
        summaryNote: "No starting points appear in the chat. This return message is simulated; technical integration details remain to be confirmed.",
        conclusionTitle: "Key takeaways for your marketplace",
        takeaways: [
          "Buyers and sellers arrange an in-person handoff.",
          "They do not need to share their home addresses in chat.",
          "They agree on one shared public place.",
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
            "You offer a practical alternative to trading home addresses in messages right at the handoff stage.",
        },
        2: {
          title: "Open a dedicated meetup flow",
          explanation:
            "The user moves smoothly from open-ended messaging into a guided step linked to the item.",
          forMarketplace:
            "The handoff stays focused on the sale without asking your users to register for a separate account.",
        },
        3: {
          title: "Collect the buyer's starting point",
          explanation:
            "The buyer confirms their starting point and travel mode without exposing them to the seller.",
          forMarketplace:
            "Buyers can arrange an in-person pickup without revealing their neighbourhood on the first exchange.",
        },
        4: {
          title: "Collect the seller's starting point",
          explanation:
            "The seller sees only that the buyer has completed their step, then enters their own starting point.",
          forMarketplace:
            "Both people contribute their starting point separately, without having to disclose private addresses to each other.",
        },
        5: {
          title: "Suggest public places in between",
          explanation:
            "Three public spots in a shared middle area are shown without displaying either starting address.",
          forMarketplace:
            "Users move straight to picking a concrete public venue instead of going back and forth over neighbourhoods.",
        },
        6: {
          title: "Confirm the venue privately",
          explanation:
            "Each participant sees the chosen venue alongside only their own starting point, then can simulate confirmation.",
          forMarketplace:
            "Both participants get clear meetup details while keeping their own starting points private.",
        },
        7: {
          title: "Show the agreed spot in chat",
          explanation:
            "The selected venue appears back inside the Market Demo thread as a clear reminder for the handoff.",
          forMarketplace:
            "The sale wraps up inside your usual interface, with a public meeting spot ready for pickup day.",
        },
      },
    },
  },
};
