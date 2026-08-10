import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

/**
 * Каталог, проекты и "о компании" пока не перенесены (см.
 * MIGRATION-NEXTJS16-TAILWIND.md)- здесь только реально существующие
 * маршруты. Обновить список при добавлении новых страниц.
 */
const paths = ["", "/estimate", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
        ),
      },
    })),
  );
}
