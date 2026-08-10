import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { locales, localeLabels } from "@/lib/i18n";
import { layoutDictionary } from "@/lib/dictionaries/layout";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/site";

type Props = {
  locale: Locale;
  /**
   * Путь текущей страницы без локали, например "catalog",
   * "projects", "projects/classic-residence", "about", "estimate", "privacy".
   * Используется и для подсветки активного пункта меню, и для переключателя языков.
   */
  path: string;
};

/**
 * Непрозрачная шапка внутренних страниц. Разметка 1:1 из ru/estimate.html
 * (и аналогов kk/en)- включая класс `internal-estimate-link`, у которого
 * своя стилизация (рамка/заливка), отдельная от остальных пунктов меню.
 */
export function InternalHeader({ locale, path }: Props) {
  const t = layoutDictionary[locale];
  const section = path.split("/")[0];

  return (
    <header className="internal-header">
      <div className="internal-header-inner">
        <Link className="brand" aria-label="Art Stil" href={`/${locale}`}>
          <span className="brand-mark brand-mark-image">
            <Image
              src="/images/brand/artstil-logo.png"
              alt="Art Stil"
              width={64}
              height={64}
            />
          </span>
          <span className="brand-text">
            <strong>{BRAND_NAME}</strong>
            <small>{BRAND_TAGLINE}</small>
          </span>
        </Link>

        <nav className="internal-navigation">
          <Link href={t.internalHeader.home.href}>
            {t.internalHeader.home.label}
          </Link>
          {t.internalHeader.nav.map((item) => (
            <Link
              key={item.key}
              className={section === item.key ? "active" : ""}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
          <Link
            className={`internal-estimate-link ${
              section === t.internalHeader.estimate.key ? "active" : ""
            }`}
            href={t.internalHeader.estimate.href}
          >
            {t.internalHeader.estimate.label}
          </Link>
        </nav>

        <div className="internal-language-switcher">
          {locales.map((l) => (
            <Link
              key={l}
              className={l === locale ? "active" : ""}
              href={`/${l}/${path}`}
            >
              {localeLabels[l]}
            </Link>
          ))}
        </div>

        <details className="internal-mobile-menu">
          <summary aria-label={t.menuAria}>
            <span></span>
            <span></span>
            <span></span>
          </summary>
          <nav>
            <Link href={t.internalHeader.home.href}>
              {t.internalHeader.home.label}
            </Link>
            {t.internalHeader.nav.map((item) => (
              <Link key={item.key} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href={t.internalHeader.estimate.href}>
              {t.internalHeader.estimate.label}
            </Link>
            <a href={t.internalHeader.mobileContacts.href}>
              {t.internalHeader.mobileContacts.label}
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}
