import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

/**
 * global-not-found.js обязателен для этой архитектуры: root layout —
 * app/[locale]/layout.tsx (динамический сегмент), поэтому у страницы
 * ошибки нет доступа к params и она не может знать локаль запроса.
 * Текста для 404 не было в исходном дампе (crawler его не поймал) —
 * копия написана заново на русском (локаль по умолчанию), в стиле
 * остального сайта. Стили — из .not-found-page/.not-found-* в globals.css.
 */
export const metadata: Metadata = {
  title: "Страница не найдена — Art Stil",
  description: "Запрошенная страница не найдена или была перемещена.",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="ru">
      <body>
        <div className="not-found-page">
          <div className="not-found-content">
            <p className="eyebrow">Ошибка 404</p>
            <h1>Страница не найдена</h1>
            <p>
              Возможно, ссылка устарела или страница была перемещена.
              Вернитесь на главную или оставьте заявку — мы поможем найти
              нужный раздел.
            </p>
            <div className="not-found-actions">
              <Link className="button button-primary" href="/ru">
                На главную
              </Link>
              <Link className="button button-secondary" href="/ru/estimate">
                Оставить заявку
              </Link>
            </div>
          </div>
          <div className="not-found-decoration" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </body>
    </html>
  );
}
