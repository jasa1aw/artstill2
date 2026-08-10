import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, ogLocale, type Locale } from "@/lib/i18n";
import { siteMeta } from "@/lib/dictionaries/meta";
import { estimateDictionary } from "@/lib/dictionaries/estimate";
import { SITE_URL } from "@/lib/site";

import { InternalHeader } from "@/components/layout/InternalHeader";
import { ContactArea } from "@/components/layout/ContactArea";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FloatingWhatsapp } from "@/components/layout/FloatingWhatsapp";
import { ProjectEstimateForm } from "@/components/estimate/ProjectEstimateForm";

type Params = { locale: string };
const PAGE_PATH = "estimate";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const page = estimateDictionary[locale].meta;
  // og/twitter намеренно берутся из общесайтовых meta, а не со страницы-
  // так было и в оригинале (см. MIGRATION-NEXTJS16-TAILWIND.md, находка Шага 4).
  const site = siteMeta[locale];
  const url = `${SITE_URL}/${locale}/${PAGE_PATH}`;

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: url,
      languages: {
        ru: `${SITE_URL}/ru/${PAGE_PATH}`,
        kk: `${SITE_URL}/kk/${PAGE_PATH}`,
        en: `${SITE_URL}/en/${PAGE_PATH}`,
        "x-default": `${SITE_URL}/ru/${PAGE_PATH}`,
      },
    },
    openGraph: {
      title: site.title,
      description: site.description,
      url: `${SITE_URL}/${locale}`,
      siteName: "Art Stil",
      type: "website",
      locale: site.ogLocale,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
    },
    twitter: {
      card: "summary_large_image",
      title: site.title,
      description: site.description,
    },
  };
}

export default async function EstimatePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const t = estimateDictionary[locale];

  return (
    <main>
      <InternalHeader locale={locale} path={PAGE_PATH} />

      <section className="estimate-page-hero">
        <div className="estimate-page-heading">
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1>{t.hero.title}</h1>
          <p>{t.hero.lead}</p>
        </div>
        <div className="estimate-page-decoration" aria-hidden="true">
          <div className="estimate-decoration-circle"></div>
          <div className="estimate-decoration-building">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </section>

      <section className="estimate-section">
        <div className="estimate-form-column">
          <p className="eyebrow">{t.brief.eyebrow}</p>
          <h2>{t.brief.title}</h2>
          <p className="estimate-form-introduction">{t.brief.intro}</p>
          <ProjectEstimateForm privacyHref={`/${locale}/privacy`} t={t.formFields} />
        </div>
        <aside className="estimate-sidebar">
          <article>
            <span className="estimate-sidebar-number">01</span>
            <h3>{t.sidebar.prepareTitle}</h3>
            <ul>
              {t.sidebar.prepareItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article>
            <span className="estimate-sidebar-number">02</span>
            <h3>{t.sidebar.nextTitle}</h3>
            <ol>
              {t.sidebar.nextItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </article>
          <p className="estimate-sidebar-note">{t.sidebar.note}</p>
        </aside>
      </section>

      <ContactArea locale={locale} />
      <SiteFooter locale={locale} />
      <FloatingWhatsapp locale={locale} />
    </main>
  );
}
