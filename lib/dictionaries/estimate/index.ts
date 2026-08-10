import type { Locale } from "@/lib/i18n";
import type { EstimateDictionary } from "./types";
import { estimateRu } from "./ru";
import { estimateKk } from "./kk";
import { estimateEn } from "./en";

export type { EstimateDictionary, EstimateFormDictionary } from "./types";

export const estimateDictionary: Record<Locale, EstimateDictionary> = {
  ru: estimateRu,
  kk: estimateKk,
  en: estimateEn,
};
