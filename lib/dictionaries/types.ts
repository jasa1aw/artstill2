/**
 * Форма словаря переводов сайта. Наполняется по разделам в Спринте 4
 * (см. MIGRATION-NEXTJS16-TAILWIND.md §6). Здесь — только структура,
 * извлечённая из дампа (ru/kk/en HTML) и JS-чанка формы расчёта.
 */
export type Dictionary = {
  meta: {
    title: string;
    description: string;
    country: string;
  };
  nav: {
    home: string;
    services: string;
    catalog: string;
    projects: string;
    production: string;
    about: string;
    contacts: string;
    estimate: string;
    ariaMainNav: string;
    ariaLangSwitcher: string;
  };
  brand: {
    name: string;
    tagline: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    salesCopy: string;
    promise: string;
    ctaPrimary: string;
    ctaSecondary: string;
    facts: string[];
  };
  services: {
    eyebrow: string;
    title: string;
    lead: string;
    cards: { number: string; title: string; text: string }[];
  };
  objectTypes: {
    eyebrow: string;
    title: string;
    lead: string;
    cards: { title: string; text: string; image: string; number: string }[];
  };
  catalogSection: {
    eyebrow: string;
    title: string;
    lead: string;
    link: string;
    items: { number: string; title: string; text: string }[];
  };
  textures: {
    eyebrow: string;
    title: string;
    lead: string;
    items: { title: string; text: string; image: string }[];
    note: string;
  };
  projectsSection: {
    eyebrow: string;
    title: string;
    lead: string;
    link: string;
    cards: { number: string; title: string; location: string; image: string; href: string }[];
  };
  facts: { value: string; label: string }[];
  production: {
    eyebrow: string;
    title: string;
    lead: string;
    steps: { number: string; title: string; text: string }[];
  };
  installation: {
    eyebrow: string;
    title: string;
    lead: string;
    list: string[];
    cta: string;
  };
  b2b: {
    eyebrow: string;
    title: string;
    lead: string;
    list: string[];
    promise: string;
    cta: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    lead: string;
    cta: string;
    items: { index: string; label: string; value: string; href?: string }[];
    whatsappAria: string;
  };
  footer: {
    about: string;
    navTitle: string;
    contactTitle: string;
    langTitle: string;
    legal: { privacy: string };
    copyright: string;
  };
  estimateForm: {
    fields: {
      name: string;
      phone: string;
      city: string;
      objectType: string;
      service: string;
      stage: string;
      installation: string;
      deadline: string;
      description: string;
    };
    placeholders: {
      name: string;
      phone: string;
      city: string;
      description: string;
    };
    selectPlaceholder: string;
    options: {
      objectTypes: string[];
      services: string[];
      stages: string[];
      installation: string[];
      deadlines: string[];
    };
    consent: string;
    privacyLink: string;
    submit: string;
    sending: string;
    error: string;
    phoneError: string;
    success: string;
    message: {
      title: string;
      name: string;
      phone: string;
      city: string;
      objectType: string;
      service: string;
      stage: string;
      installation: string;
      deadline: string;
      description: string;
      empty: string;
    };
  };
  estimatePage: {
    eyebrow: string;
    title: string;
    lead: string;
    briefEyebrow: string;
    briefTitle: string;
    briefIntro: string;
    sidebar: {
      prepareTitle: string;
      prepareItems: string[];
      nextTitle: string;
      nextItems: string[];
      note: string;
    };
  };
  catalogPage: {
    eyebrow: string;
    title: string;
    lead: string;
    items: {
      id: string;
      number: string;
      title: string;
      text: string;
      footerLabel: string;
      footerItems: string[];
    }[];
    customProduction: {
      title: string;
      lead: string;
      steps: { number: string; title: string; text: string }[];
    };
  };
  projectsPage: {
    eyebrow: string;
    title: string;
    lead: string;
    cards: { number: string; title: string; location: string; text: string; image: string; href: string }[];
  };
  aboutPage: {
    eyebrow: string;
    title: string;
    lead: string;
    statistics: { value: string; label: string }[];
    storyTitle: string;
    storyParagraphs: string[];
    productionTitle: string;
    productionText: string;
    principles: { number: string; title: string; text: string }[];
  };
  privacyPage: {
    eyebrow: string;
    title: string;
    lead: string;
    updated: string;
    articles: { title: string; text: string }[];
  };
  notFound: {
    eyebrow: string;
    title: string;
    lead: string;
    ctaHome: string;
    ctaEstimate: string;
  };
};
