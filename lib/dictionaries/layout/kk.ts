/**
 * Тексты общих layout-компонентов- казахская локаль.
 * Извлечено дословно из дампа kk.html / kk/*.html.
 * Внимание: "Навигация" и aria-label шапки в оригинале НЕ переведены
 * на казахский (сохранено намеренно- так в исходнике).
 */
import type { LayoutDictionary } from "./types";

export const layoutKk: LayoutDictionary = {
  homeHeader: {
    navAria: "Основная навигация",
    langSwitcherAria: "Тілді таңдау",
    nav: [
      { label: "Қызметтер", href: "#services" },
      { label: "Өндіріс", href: "#production" },
      { label: "Байланыс", href: "#contacts" },
    ],
    cta: { label: "Өтінім қалдыру", href: "/kk/estimate" },
  },
  internalHeader: {
    home: { label: "Басты бет", href: "/kk" },
    nav: [],
    estimate: { key: "estimate", label: "Есептеу", href: "/kk/estimate" },
    mobileContacts: { label: "Байланыс", href: "/kk#contacts" },
    mobileCta: { label: "Өтінім қалдыру", href: "/kk/estimate" },
  },
  footer: {
    tagline:
      "Шыныталшықты бетоннан сәулеттік декор: жобалау, өндіру, жеткізу және монтаж.",
    navTitle: "Навигация",
    nav: [
      { label: "Өндіріс", href: "/kk#production" },
      { label: "Байланыс", href: "/kk#contacts" },
    ],
    contactTitle: "Байланыс",
    languageTitle: "Тіл",
    legalPrivacy: "Құпиялық саясаты",
    credit: "Сайтты әзірлеген- Nazia 8 Promo",
    rightsReserved: "Барлық құқықтар қорғалған.",
  },
  contact: {
    eyebrow: "Нысаныңызды талқылайық",
    title: "Қасбеттің фотосуретін немесе сәулеттік жобаны жіберіңіз",
    lead: "Тапсырманы зерттеп, өлшемдерді нақтылап, элементтерді өндіру және монтаждау бойынша алдын ала кеңес береміз.",
    cta: "Өтінім қалдыру",
    phoneLabel: "Телефон және WhatsApp",
    areaLabel: "Жұмыс географиясы",
    areaValue: "Алматы және бүкіл Қазақстан",
    hoursLabel: "Кеңес беру уақыты",
    hoursValue: "Дүйсенбі- сенбі",
    instagramLabel: "Instagram",
  },
  leadModal: {
    eyebrow: "Жылдам өтінім",
    title: "Кеңес алу",
    lead: "Атыңыз бен нөміріңізді қалдырыңыз- менеджер WhatsApp арқылы жазып, сұрақтарыңызға жауап береді.",
    nameLabel: "Атыңыз",
    namePlaceholder: "Мысалы, Арман",
    phoneLabel: "Телефон немесе WhatsApp",
    phonePlaceholder: "+7 (700) 000 00 00",
    submit: "WhatsApp арқылы жазу",
    note: "Түймені басу арқылы дербес деректерді өңдеуге келісім бересіз.",
    closeAria: "Терезені жабу",
    errors: {
      nameRequired: "Атыңызды көрсетіңіз",
      phoneRequired: "Телефон нөмірін көрсетіңіз",
      phoneInvalid: "Телефон нөмірін тексеріңіз",
    },
    whatsappMessage:
      "Сәлеметсіз бе! Менің атым {name}. Нөмірім: {phone}. Art Stil қасбет декоры бойынша кеңес алғым келеді.",
  },
  whatsappAria: "Art Stil компаниясына WhatsApp арқылы жазу",
  menuAria: "Menu",
};
