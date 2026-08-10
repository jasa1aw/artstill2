export type NavItem = { label: string; href: string };

export type InternalNavKey = "catalog" | "projects" | "about" | "estimate";
export type InternalNavItem = { key: InternalNavKey; label: string; href: string };

export type LayoutDictionary = {
  homeHeader: {
    navAria: string;
    langSwitcherAria: string;
    nav: NavItem[];
  };
  internalHeader: {
    home: NavItem;
    nav: InternalNavItem[];
    estimate: InternalNavItem;
    mobileContacts: NavItem;
  };
  footer: {
    tagline: string;
    navTitle: string;
    nav: NavItem[];
    contactTitle: string;
    /** Всегда "Language" — так в исходнике на всех 3 локалях. */
    languageTitle: string;
    legalPrivacy: string;
    credit: string;
    rightsReserved: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    lead: string;
    cta: string;
    phoneLabel: string;
    areaLabel: string;
    areaValue: string;
    hoursLabel: string;
    hoursValue: string;
    instagramLabel: string;
  };
  whatsappAria: string;
  menuAria: string;
};
