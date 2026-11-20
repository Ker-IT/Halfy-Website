export default {
  // Progressive product navigation flags.
  // Enable each entry ONLY once its destination is actually available.
  products: [
    {
      key: "halfway",
      enabled: true,
      external: false,
      urls: { en: "/halfway/", fr: "/fr/halfway/" },
      labels: { en: "Halfway", fr: "Halfway" },
    },
    {
      key: "safemeet",
      enabled: true,
      external: false,
      urls: { en: "/safemeet/", fr: "/fr/safemeet/" },
      labels: { en: "SafeMeet", fr: "SafeMeet" },
    },
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
  headerCta: {
    href: "https://app.halfy.app/",
    labels: {
      en: "Open Halfy",
      fr: "Ouvrir Halfy",
    },
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
        en: "Halfy WebApp",
        fr: "WebApp Halfy",
      },
    },
    safeMeetApp: {
      href: "https://app.halfy.app/meet",
      labels: {
        en: "Create a SafeMeet",
        fr: "Créer un SafeMeet",
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
