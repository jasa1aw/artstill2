import type { Locale } from "@/lib/i18n";
import type { PrivacyDictionary } from "./types";
import { privacyRu } from "./ru";
import { privacyKk } from "./kk";
import { privacyEn } from "./en";

export type { PrivacyDictionary };

export const privacyDictionary: Record<Locale, PrivacyDictionary> = {
  ru: privacyRu,
  kk: privacyKk,
  en: privacyEn,
};
