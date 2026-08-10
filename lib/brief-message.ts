import type { EstimateFormDictionary } from "@/lib/dictionaries/estimate";
import type { Locale } from "@/lib/i18n";
import { WHATSAPP_NUMBER } from "@/lib/site";

export type BriefValues = {
  name: string;
  phone: string;
  city: string;
  objectType: string;
  stage: string;
  service: string;
  installation: string;
  deadline: string;
  description: string;
};

/** BCP-47 теги для Intl- htmlLang в lib/i18n даёт только короткий код. */
const intlLocale: Record<Locale, string> = {
  ru: "ru-RU",
  kk: "kk-KZ",
  en: "en-GB",
};

/**
 * WhatsApp понимает только *bold*, _italic_, ~strike~ и ```mono```.
 * Заголовки секций делаем жирными, значения оставляем обычными-
 * иначе на мобильном экране жирным становится всё и сканировать нечем.
 * Эмодзи здесь- маркеры секций в чате, а не иконки интерфейса.
 */
const SECTION_MARK = {
  contacts: "\u{1F464}",
  object: "\u{1F3DB}️",
  task: "\u{1F6E0}️",
  description: "\u{1F4DD}",
} as const;

function section(mark: string, title: string, rows: Array<[string, string]>): string {
  return [`${mark} *${title}*`, ...rows.map(([label, value]) => `• ${label}: ${value}`)].join("\n");
}

export function formatBriefTimestamp(locale: Locale, date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat(intlLocale[locale], {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "Asia/Almaty",
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 16).replace("T", " ");
  }
}

/** Текст, который уходит в WhatsApp. Он же показывается в предпросмотре шага 4. */
export function buildBriefMessage(
  t: EstimateFormDictionary,
  values: BriefValues,
  timestamp: string,
): string {
  const m = t.message;

  const blocks = [
    `*${m.title}*`,
    `_${m.source} · ${timestamp}_`,
    section(SECTION_MARK.contacts, m.sections.contacts, [
      [m.name, values.name],
      [m.phone, values.phone],
      [m.city, values.city],
    ]),
    section(SECTION_MARK.object, m.sections.object, [
      [m.objectType, values.objectType],
      [m.stage, values.stage],
    ]),
    section(SECTION_MARK.task, m.sections.task, [
      [m.service, values.service],
      [m.installation, values.installation],
      [m.deadline, values.deadline],
    ]),
    `${SECTION_MARK.description} *${m.sections.description}*\n${values.description.trim() || m.empty}`,
  ];

  return blocks.join("\n\n");
}

export function buildWhatsappUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
