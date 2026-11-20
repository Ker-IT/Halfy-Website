export default {
  // Progressive product navigation flags.
  // Enable each entry ONLY once its destination is actually available.
  products: [
    {
      key: "halfy",
      enabled: true,
      external: false,
      urls: { en: "/halfy/", fr: "/fr/halfy/" },
      labels: { en: "Halfy", fr: "Halfy" },
      descriptions: {
        en: "Find a place to meet halfway.",
        fr: "Trouvez où vous retrouver à mi-chemin.",
      },
      logoSrc: "/assets/icon-192.png",
      logoWidth: 26,
      logoHeight: 26,
      logoClass: "nav-item-icon nav-item-icon--halfy",
    },
    {
      key: "safemeet",
      enabled: true,
      external: false,
      urls: { en: "/safemeet/", fr: "/fr/safemeet/" },
      labels: { en: "SafeMeet", fr: "SafeMeet" },
      descriptions: {
        en: "Meet without sharing your address.",
        fr: "Rencontrez-vous sans partager votre adresse.",
      },
      logoSrc: "/assets/safemeet-logos/svg/logo-symbol.svg",
      logoWidth: 35,
      logoHeight: 24,
      logoClass: "nav-item-icon",
    },
  ],
  sections: [
    {
      key: "business",
      enabled: false,
      external: false,
      urls: { en: "/business/", fr: "/fr/business/" },
      labels: { en: "Business", fr: "Entreprises" },
    },
    {
      key: "developers",
      enabled: false,
      external: false,
      urls: { en: "/developers/", fr: "/fr/developers/" },
      labels: { en: "Developers", fr: "Développeurs" },
    },
    {
      key: "pricing",
      enabled: false,
      external: false,
      urls: { en: "/business/pricing/", fr: "/fr/business/pricing/" },
      labels: { en: "Pricing", fr: "Tarifs" },
    },
  ],
  // Centralized contextual CTA configuration resolved from page routeKey.
  headerCtaDefault: "halfy",
  headerCtas: {
    halfy: {
      enabled: true,
      href: "https://app.halfy.app/",
      external: false,
      labels: {
        en: "Open Halfy",
        fr: "Ouvrir Halfy",
      },
    },
    safemeet: {
      enabled: true,
      href: "https://app.halfy.app/meet",
      external: false,
      labels: {
        en: "Create a meetup",
        fr: "Créer une rencontre",
      },
    },
    business: {
      enabled: false,
      urls: {
        en: "/business/contact/",
        fr: "/fr/business/contact/",
      },
      external: false,
      labels: {
        en: "Request a demo",
        fr: "Demander une démo",
      },
    },
  },
  headerCtaByRouteKey: {
    home: "halfy",
    halfy: "halfy",
    safemeet: "safemeet",
    privacy: "halfy",
    // Future mapping once /business/ routes are implemented:
    // business: "business",
  },
  footer: {
    businessAnchor: {
      urls: { en: "/#business", fr: "/fr/#business" },
      labels: { en: "SafeMeet Business", fr: "SafeMeet Business" },
    },
    businessContact: {
      urls: {
        en: "mailto:contactus.kerit@gmail.com?subject=SafeMeet%20Business%20-%20Partnership%20inquiry",
        fr: "mailto:contactus.kerit@gmail.com?subject=SafeMeet%20Business%20-%20Demande%20de%20partenariat",
      },
      labels: { en: "Business contact", fr: "Contact professionnel" },
    },
    contact: {
      href: "mailto:contactus.kerit@gmail.com",
      labels: {
        en: "Contact Kër IT",
        fr: "Contacter Kër IT",
      },
    },
    privacy: {
      routeKey: "privacy",
      labels: {
        en: "Privacy Policy",
        fr: "Politique de confidentialité",
      },
    },
    webApp: {
      href: "https://app.halfy.app/",
      labels: {
        en: "Open Halfy (WebApp)",
        fr: "Ouvrir Halfy (WebApp)",
      },
    },
    safeMeetApp: {
      href: "https://app.halfy.app/meet",
      labels: {
        en: "Create a meetup",
        fr: "Créer une rencontre",
      },
    },
    androidApp: {
      href: "https://play.google.com/store/apps/details?id=com.crankynx.halfy",
      labels: {
        en: "Android App (Google Play)",
        fr: "Application Android (Google Play)",
      },
    },
  },
};
