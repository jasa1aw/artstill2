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
  },
  internalHeader: {
    home: { label: "Басты бет", href: "/kk" },
    nav: [],
    estimate: { key: "estimate", label: "Есептеу", href: "/kk/estimate" },
    mobileContacts: { label: "Байланыс", href: "/kk#contacts" },
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
    languageTitle: "Language",
    legalPrivacy: "Құпиялық саясаты",
    credit: "Сайтты әзірлеген- Nazia 8 Promo",
    rightsReserved: "Барлық құқықтар қорғалған.",
  },
  contact: {
    eyebrow: "Нысаныңызды талқылайық",
    title: "Қасбеттің фотосуретін немесе сәулеттік жобаны жіберіңіз",
    lead: "Тапсырманы зерттеп, өлшемдерді нақтылап, элементтерді өндіру және монтаждау бойынша алдын ала кеңес береміз.",
    cta: "WhatsApp арқылы жазу",
    phoneLabel: "Телефон және WhatsApp",
    areaLabel: "Жұмыс географиясы",
    areaValue: "Алматы және бүкіл Қазақстан",
    hoursLabel: "Кеңес беру уақыты",
    hoursValue: "Дүйсенбі- сенбі",
    instagramLabel: "Instagram",
  },
  whatsappAria: "Art Stil компаниясына WhatsApp арқылы жазу",
  menuAria: "Menu",
};
