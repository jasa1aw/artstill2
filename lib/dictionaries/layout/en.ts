/**
 * Тексты общих layout-компонентов- английская локаль.
 * Извлечено дословно из дампа en.html / en/*.html.
 */
import type { LayoutDictionary } from "./types";

export const layoutEn: LayoutDictionary = {
  homeHeader: {
    navAria: "Основная навигация",
    langSwitcherAria: "Choose language",
    nav: [
      { label: "Services", href: "#services" },
      { label: "Production", href: "#production" },
      { label: "Contacts", href: "#contacts" },
    ],
  },
  internalHeader: {
    home: { label: "Home", href: "/en" },
    nav: [],
    estimate: { key: "estimate", label: "Estimate", href: "/en/estimate" },
    mobileContacts: { label: "Contacts", href: "/en#contacts" },
  },
  footer: {
    tagline:
      "Architectural GRC decor: design, manufacturing, delivery and professional installation.",
    navTitle: "Navigation",
    nav: [
      { label: "Production", href: "/en#production" },
      { label: "Contacts", href: "/en#contacts" },
    ],
    contactTitle: "Contacts",
    languageTitle: "Language",
    legalPrivacy: "Privacy policy",
    credit: "Website by Nazia 8 Promo",
    rightsReserved: "All rights reserved.",
  },
  contact: {
    eyebrow: "Discuss your project",
    title: "Send us a facade photograph or architectural project",
    lead: "We will review the requirements, clarify the dimensions and provide an initial consultation on manufacturing and installation.",
    cta: "Contact us on WhatsApp",
    phoneLabel: "Phone and WhatsApp",
    areaLabel: "Service area",
    areaValue: "Almaty and all regions of Kazakhstan",
    hoursLabel: "Consultation hours",
    hoursValue: "Monday- Saturday",
    instagramLabel: "Instagram",
  },
  whatsappAria: "Contact Art Stil on WhatsApp",
  menuAria: "Menu",
};
