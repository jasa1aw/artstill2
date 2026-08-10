import type { Locale } from "@/lib/i18n";
import type { HomeDictionary } from "./types";
import { homeRu } from "./ru";
import { homeKk } from "./kk";
import { homeEn } from "./en";

export type { HomeDictionary };

export const homeDictionary: Record<Locale, HomeDictionary> = {
  ru: homeRu,
  kk: homeKk,
  en: homeEn,
};
