import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, ogLocale, type Locale } from "@/lib/i18n";
import { siteMeta } from "@/lib/dictionaries/meta";
import { privacyDictionary } from "@/lib/dictionaries/privacy";
import { SITE_URL } from "@/lib/site";

import { InternalHeader } from "@/components/layout/InternalHeader";
import { ContactArea } from "@/components/layout/ContactArea";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FloatingWhatsapp } from "@/components/layout/FloatingWhatsapp";

type Params = { locale: string };
const PAGE_PATH = "privacy";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const page = privacyDictionary[locale].meta;
  // og/twitter намеренно берутся из общесайтовых meta — так было в оригинале.
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

export default async function PrivacyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const t = privacyDictionary[locale];

  return (
    <main>
      <InternalHeader locale={locale} path={PAGE_PATH} />

      <section className="legal-page-hero">
        <div>
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1>{t.hero.title}</h1>
          <p>{t.hero.lead}</p>
          <small>
            {t.hero.updatedLabel}: {t.hero.updatedDate}
          </small>
        </div>
        <div className="legal-page-decoration" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </section>

      <section className="legal-page-content">
        {t.articles.map((article) => (
          <article key={article.title}>
            <h2>{article.title}</h2>
            <div>
              {article.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}
      </section>

      <ContactArea locale={locale} />
      <SiteFooter locale={locale} />
      <FloatingWhatsapp locale={locale} />
    </main>
  );
}
