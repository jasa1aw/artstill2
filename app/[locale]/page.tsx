import type { Metadata } from "next";
import { isLocale, locales, ogLocale, type Locale } from "@/lib/i18n";
import { siteMeta } from "@/lib/dictionaries/meta";
import { PHONE_DISPLAY, SITE_URL } from "@/lib/site";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ContactArea } from "@/components/layout/ContactArea";
import { FloatingWhatsapp } from "@/components/layout/FloatingWhatsapp";

import { Hero } from "@/components/home/Hero";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ObjectTypesSection } from "@/components/home/ObjectTypesSection";
import { CatalogSection } from "@/components/home/CatalogSection";
import { TexturesSection } from "@/components/home/TexturesSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { FactsSection } from "@/components/home/FactsSection";
import { ProductionSection } from "@/components/home/ProductionSection";
import { InstallationSection } from "@/components/home/InstallationSection";
import { B2BSection } from "@/components/home/B2BSection";

type Params = { locale: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const meta = siteMeta[locale];
  const url = `${SITE_URL}/${locale}`;

  return {
    title: meta.title,
    description: meta.description,
    applicationName: "Art Stil",
    manifest: "/manifest.webmanifest",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: url,
      languages: {
        ru: `${SITE_URL}/ru`,
        kk: `${SITE_URL}/kk`,
        en: `${SITE_URL}/en`,
        "x-default": `${SITE_URL}/ru`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      siteName: "Art Stil",
      type: "website",
      locale: meta.ogLocale,
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => ogLocale[l]),
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "256x256", type: "image/x-icon" },
        { url: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      ],
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const meta = siteMeta[locale];

  return (
    <main className="home-page">
      <SiteHeader locale={locale} />
      <Hero locale={locale} />
      <ServicesSection locale={locale} />
      <ObjectTypesSection locale={locale} />
      <CatalogSection locale={locale} />
      <TexturesSection locale={locale} />
      <ProjectsSection locale={locale} />
      <FactsSection locale={locale} />
      <ProductionSection locale={locale} />
      <InstallationSection locale={locale} />
      <B2BSection locale={locale} />
      <ContactArea locale={locale} />
      <SiteFooter locale={locale} />
      <FloatingWhatsapp locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Art Stil",
            url: SITE_URL,
            telephone: PHONE_DISPLAY,
            description: meta.description,
            sameAs: ["https://www.instagram.com/artstil.kz/"],
            areaServed: { "@type": "Country", name: meta.areaServed },
            contactPoint: {
              "@type": "ContactPoint",
              telephone: PHONE_DISPLAY,
              contactType: "sales",
              availableLanguage: ["Russian", "Kazakh", "English"],
            },
          }),
        }}
      />
    </main>
  );
}
