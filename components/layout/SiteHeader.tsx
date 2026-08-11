import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { locales, localeLabels } from "@/lib/i18n";
import { layoutDictionary } from "@/lib/dictionaries/layout";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/site";
import { MobileMenu } from "@/components/layout/MobileMenu";

/**
 * Прозрачная шапка главной страницы (`position: absolute` поверх hero).
 * Разметка перенесена 1:1 из index.html/kk.html/en.html- порядок и
 * количество узлов важны для CSS (`.main-nav a:after`, `:hover` и т.д.).
 */
export function SiteHeader({ locale }: { locale: Locale }) {
  const t = layoutDictionary[locale];

  return (
    <header className="site-header">
      <div className="header-inner">
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

        <nav className="main-nav" aria-label={t.homeHeader.navAria}>
          {t.homeHeader.nav.map((item) =>
            item.href.startsWith("#") ? (
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

        <div
          className="language-switcher"
          aria-label={t.homeHeader.langSwitcherAria}
        >
          {locales.map((l) => (
            <Link
              key={l}
              className={l === locale ? "active" : ""}
              href={`/${l}`}
            >
              {localeLabels[l]}
            </Link>
          ))}
        </div>

        <MobileMenu
          navItems={t.homeHeader.nav}
          menuAria={t.menuAria}
          cta={t.homeHeader.cta}
        />
      </div>
    </header>
  );
}
