/**
 * Тексты общих layout-компонентов (header/footer/contact/whatsapp)- русская локаль.
 * Извлечено дословно из дампа index.html / ru/*.html.
 */
import type { LayoutDictionary } from "./types";

export const layoutRu: LayoutDictionary = {
  homeHeader: {
    navAria: "Основная навигация",
    langSwitcherAria: "Выбор языка",
    nav: [
      { label: "Услуги", href: "#services" },
      { label: "Производство", href: "#production" },
      { label: "Контакты", href: "#contacts" },
    ],
  },
  internalHeader: {
    home: { label: "Главная", href: "/ru" },
    nav: [],
    estimate: { key: "estimate", label: "Рассчитать", href: "/ru/estimate" },
    mobileContacts: { label: "Контакты", href: "/ru#contacts" },
  },
  footer: {
    tagline:
      "Архитектурный декор из стеклофибробетона: проектирование, производство, доставка и монтаж.",
    navTitle: "Навигация",
    nav: [
      { label: "Производство", href: "/ru#production" },
      { label: "Контакты", href: "/ru#contacts" },
    ],
    contactTitle: "Контакты",
    /** Всегда "Language"- так в исходнике на всех 3 локалях. */
    languageTitle: "Language",
    legalPrivacy: "Политика конфиденциальности",
    credit: "Разработка сайта- Nazia 8 Promo",
    rightsReserved: "Все права защищены.",
  },
  contact: {
    eyebrow: "Обсудим ваш объект",
    title: "Отправьте фотографию фасада или архитектурный проект",
    lead: "Мы изучим задачу, уточним размеры и подготовим предварительную консультацию по производству и монтажу элементов.",
    cta: "Написать в WhatsApp",
    phoneLabel: "Телефон и WhatsApp",
    areaLabel: "География работы",
    areaValue: "Алматы и весь Казахстан",
    hoursLabel: "Время консультаций",
    hoursValue: "Понедельник- суббота",
    instagramLabel: "Instagram",
  },
  whatsappAria: "Написать Art Stil в WhatsApp",
  menuAria: "Menu",
};
