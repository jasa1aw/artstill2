import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale } from "@/lib/i18n";

/**
 * Корневой "/" в оригинале- это фактически ru-версия (index.html).
 * Отдельного app/layout.tsx на корне нет (см. app/[locale]/layout.tsx-
 * он и есть настоящий root layout), поэтому "/" сам по себе ни на что
 * не резолвится и нуждается в редиректе на дефолтную локаль.
 *
 * Next.js 16: файл называется proxy.ts (не middleware.ts- это
 * соглашение устарело, см. node_modules/next/dist/docs/.../proxy.md).
 */
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }
}

export const config = {
  matcher: "/",
};
