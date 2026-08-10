export type HomeDictionary = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    salesCopy: string;
    promise: string;
    ctaPrimary: string;
    ctaSecondary: string;
    facts: [string, string, string];
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
    cards: {
      title: string;
      text: string;
      alt: string;
      image: string;
      number: string;
    }[];
  };
  catalog: {
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
    items: { title: string; text: string; alt: string; image: string }[];
    note: string;
  };
  projects: {
    eyebrow: string;
    title: string;
    lead: string;
    link: string;
    cards: {
      number: string;
      category: string;
      title: string;
      alt: string;
      image: string;
      href: string;
      cta: string;
    }[];
  };
  facts: { value: string; label: string }[];
  production: {
    eyebrow: string;
    title: string;
    lead: string;
    photos: { alt: string; image: string }[];
    steps: { number: string; title: string; text: string }[];
  };
  installation: {
    eyebrow: string;
    title: string;
    lead: string;
    alt: string;
    image: string;
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
};
