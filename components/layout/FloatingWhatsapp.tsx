import type { Locale } from "@/lib/i18n";
import { layoutDictionary } from "@/lib/dictionaries/layout";
import { WHATSAPP_HREF } from "@/lib/site";

/**
 * position: fixed кнопка. Цвет (#25d366) задаётся в globals.css через
 * селектор `a[aria-label*=WhatsApp]`- важно, чтобы aria-label на всех
 * локалях содержал подстроку "WhatsApp" (проверено: ru/kk/en- содержат).
 */
export function FloatingWhatsapp({ locale }: { locale: Locale }) {
  const t = layoutDictionary[locale];

  return (
    <a
      className="floating-whatsapp"
      href={WHATSAPP_HREF}
      target="_blank"
      rel="noreferrer"
      aria-label={t.whatsappAria}
    >
      <span>WA</span>
    </a>
  );
}
