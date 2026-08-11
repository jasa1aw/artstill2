import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { layoutDictionary } from "@/lib/dictionaries/layout";
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  INSTAGRAM_URL,
  PHONE_DISPLAY,
  PHONE_HREF,
  WHATSAPP_HREF,
} from "@/lib/site";

const LOCALE_LABEL: Record<Locale, string> = {
  ru: "Русский",
  kk: "Қазақша",
  en: "English",
};

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = layoutDictionary[locale];
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand-column">
          <Link className="footer-brand" aria-label="Art Stil" href={`/${locale}`}>
            <span className="footer-brand-mark">AS</span>
            <span>
              <strong>{BRAND_NAME}</strong>
              <small>{BRAND_TAGLINE}</small>
            </span>
          </Link>
          <p>{t.footer.tagline}</p>
        </div>

        <div className="footer-navigation">
          <p>{t.footer.navTitle}</p>
          <nav>
            {t.footer.nav.map((item) =>
              item.href.includes("#") ? (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ) : (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </div>

        <div className="footer-contact-column">
          <p>{t.footer.contactTitle}</p>
          <div>
            <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
            <a href={WHATSAPP_HREF} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
              Instagram
            </a>
          </div>
        </div>

        <div className="footer-language-column">
          <p>{t.footer.languageTitle}</p>
          <div>
            {locales.map((l) => (
              <Link
                key={l}
                className={l === locale ? "active" : ""}
                href={`/${l}`}
              >
                {LOCALE_LABEL[l]}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          © {year} Art Stil. {t.footer.rightsReserved}
        </span>
        <div className="footer-legal-links">
          <Link href={`/${locale}/privacy`}>{t.footer.legalPrivacy}</Link>
          <span>{t.footer.credit}</span>
        </div>
      </div>
    </footer>
  );
}
