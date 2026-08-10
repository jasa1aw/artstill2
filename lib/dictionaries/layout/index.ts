import type { Locale } from "@/lib/i18n";
import type { LayoutDictionary } from "./types";
import { layoutRu } from "./ru";
import { layoutKk } from "./kk";
import { layoutEn } from "./en";

export type { LayoutDictionary };

export const layoutDictionary: Record<Locale, LayoutDictionary> = {
  ru: layoutRu,
  kk: layoutKk,
  en: layoutEn,
};
