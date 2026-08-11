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
    cta: { label: "Leave a Request", href: "/en/estimate" },
  },
  internalHeader: {
    home: { label: "Home", href: "/en" },
    nav: [],
    estimate: { key: "estimate", label: "Estimate", href: "/en/estimate" },
    mobileContacts: { label: "Contacts", href: "/en#contacts" },
    mobileCta: { label: "Leave a Request", href: "/en/estimate" },
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
    cta: "Leave a request",
    phoneLabel: "Phone and WhatsApp",
    areaLabel: "Service area",
    areaValue: "Almaty and all regions of Kazakhstan",
    hoursLabel: "Consultation hours",
    hoursValue: "Monday- Saturday",
    instagramLabel: "Instagram",
  },
  leadModal: {
    eyebrow: "Quick request",
    title: "Get a consultation",
    lead: "Leave your name and number- our manager will message you on WhatsApp and answer any questions.",
    nameLabel: "Your name",
    namePlaceholder: "For example, Arman",
    phoneLabel: "Phone or WhatsApp",
    phonePlaceholder: "+7 (700) 000 00 00",
    submit: "Message on WhatsApp",
    note: "By submitting you agree to the processing of your personal data.",
    closeAria: "Close dialog",
    errors: {
      nameRequired: "Please tell us your name",
      phoneRequired: "Please enter a phone number",
      phoneInvalid: "Please check the phone number",
    },
    whatsappMessage:
      "Hello! My name is {name}. My number: {phone}. I would like a consultation about Art Stil facade decor.",
  },
  whatsappAria: "Contact Art Stil on WhatsApp",
  menuAria: "Menu",
};
