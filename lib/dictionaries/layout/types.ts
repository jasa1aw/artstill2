export type NavItem = { label: string; href: string };

export type InternalNavKey = "catalog" | "projects" | "about" | "estimate";
export type InternalNavItem = { key: InternalNavKey; label: string; href: string };

export type LayoutDictionary = {
  homeHeader: {
    navAria: string;
    langSwitcherAria: string;
    nav: NavItem[];
    cta: NavItem;
  };
  internalHeader: {
    home: NavItem;
    nav: InternalNavItem[];
    estimate: InternalNavItem;
    mobileContacts: NavItem;
    mobileCta: NavItem;
  };
  footer: {
    tagline: string;
    navTitle: string;
    nav: NavItem[];
    contactTitle: string;
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
  /**
   * Быстрая заявка: короткая модалка (имя + телефон) вместо полного брифа.
   * Отправка ничего не шлёт на сервер- собирает текст и открывает wa.me,
   * так же как ProjectEstimateForm (см. lib/brief-message.ts).
   */
  leadModal: {
    eyebrow: string;
    title: string;
    lead: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    submit: string;
    note: string;
    closeAria: string;
    errors: {
      nameRequired: string;
      phoneRequired: string;
      phoneInvalid: string;
    };
    /** Шаблон сообщения в WhatsApp: {name} и {phone} подставляются. */
    whatsappMessage: string;
  };
  whatsappAria: string;
  menuAria: string;
};
