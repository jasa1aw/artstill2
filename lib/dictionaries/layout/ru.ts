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
    cta: { label: "Оставить заявку", href: "/ru/estimate" },
  },
  internalHeader: {
    home: { label: "Главная", href: "/ru" },
    nav: [],
    estimate: { key: "estimate", label: "Рассчитать", href: "/ru/estimate" },
    mobileContacts: { label: "Контакты", href: "/ru#contacts" },
    mobileCta: { label: "Оставить заявку", href: "/ru/estimate" },
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
    languageTitle: "Язык",
    legalPrivacy: "Политика конфиденциальности",
    credit: "Разработка сайта- Nazia 8 Promo",
    rightsReserved: "Все права защищены.",
  },
  contact: {
    eyebrow: "Обсудим ваш объект",
    title: "Отправьте фотографию фасада или архитектурный проект",
    lead: "Мы изучим задачу, уточним размеры и подготовим предварительную консультацию по производству и монтажу элементов.",
    cta: "Оставить заявку",
    phoneLabel: "Телефон и WhatsApp",
    areaLabel: "География работы",
    areaValue: "Алматы и весь Казахстан",
    hoursLabel: "Время консультаций",
    hoursValue: "Понедельник- суббота",
    instagramLabel: "Instagram",
  },
  leadModal: {
    eyebrow: "Быстрая заявка",
    title: "Получить консультацию",
    lead: "Оставьте имя и номер- менеджер напишет в WhatsApp и ответит на вопросы по проекту.",
    nameLabel: "Ваше имя",
    namePlaceholder: "Например, Арман",
    phoneLabel: "Телефон или WhatsApp",
    phonePlaceholder: "+7 (700) 000 00 00",
    submit: "Написать в WhatsApp",
    note: "Нажимая кнопку, вы соглашаетесь на обработку персональных данных.",
    closeAria: "Закрыть окно",
    errors: {
      nameRequired: "Укажите, как к вам обращаться",
      phoneRequired: "Укажите номер телефона",
      phoneInvalid: "Проверьте номер телефона",
    },
    whatsappMessage:
      "Здравствуйте! Меня зовут {name}. Мой номер: {phone}. Хочу получить консультацию по фасадному декору Art Stil.",
  },
  whatsappAria: "Написать Art Stil в WhatsApp",
  menuAria: "Menu",
};
