export const locales = ["ru", "kk", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ru";

export const localeLabels: Record<Locale, string> = {
  ru: "РУС",
  kk: "ҚАЗ",
  en: "ENG",
};

export const htmlLang: Record<Locale, string> = {
  ru: "ru",
  kk: "kk",
  en: "en",
};

export const ogLocale: Record<Locale, string> = {
  ru: "ru_RU",
  kk: "kk_KZ",
  en: "en_US",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
