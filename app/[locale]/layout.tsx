import { locales, htmlLang, type Locale } from "@/lib/i18n";
import "../globals.css";

/**
 * Настоящий root layout проекта. Отдельного app/layout.tsx нет —
 * весь сайт живёт под /[locale], а "/" редиректится в proxy.ts
 * на дефолтную локаль (см. соответствующий комментарий там же).
 *
 * dynamicParams = false вместо ручного notFound(): невалидная локаль
 * (например /xx) не попадёт в generateStaticParams → Next отдаёт 404
 * ДО вызова этого layout, так что срабатывает app/global-not-found.tsx
 * (см. его комментарий — без этого layout сам не мог бы отрисовать
 * <html>/<body> для страницы ошибки, потому что сам является источником
 * невалидной локали).
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={htmlLang[locale as Locale]}>
      <body>{children}</body>
    </html>
  );
}
