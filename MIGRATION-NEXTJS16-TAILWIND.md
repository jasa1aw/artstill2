# Перенос artstil.kz на Next.js 16 + Tailwind CSS- пошаговый цикл 1:1

> Документ описывает полный цикл переноса статического дампа сайта
> (`C:\Рабочий стол\artstil.kz`) на актуальный стек **Next.js 16 (App Router) + Tailwind CSS v4**
> с сохранением пиксельной идентичности: те же стили, те же переходы, та же вёрстка,
> те же тексты и та же адаптивность.

---

## 0. Результаты аудита исходника (прочитать до начала работы)

Это **не обычный HTML-сайт**. Дамп- это отрендеренный вывод уже существующего
Next.js App Router проекта. Это радикально упрощает перенос.

| Что | Факт из дампа |
|---|---|
| Фреймворк оригинала | Next.js App Router + Turbopack (`_next/static/chunks/turbopack-*.js`) |
| CSS-движок | Tailwind CSS **v4**- в бандле есть `@layer theme` / `@layer base` с переменными `--font-sans`, `--default-font-family` (это preflight Tailwind v4) |
| Реальная стилизация | **99%- обычный семантический CSS** с классами `.site-header`, `.hero`, `.sales-object-card`. Утилит-классов Tailwind в разметке **нет ни одного** |
| Шрифты | Только системные: `Georgia, "Times New Roman", serif` для заголовков, `Arial, Helvetica, sans-serif` для текста. **Веб-шрифтов нет**- `next/font` не нужен |
| Анимации | `@keyframes`- **0 штук**. Только CSS `transition` (список в §11) |
| Клиентский JS | Одна интерактивная форма (`ProjectEstimateForm`) + `<details>` для мобильного меню. Остальное- Server Components |
| Локали | 3: `ru` (дефолт), `kk`, `en` |
| Изображения | `next/image` (`fill` + `sizes`) для контента, CSS `background-image` для декоративных подложек |
| Данные/бэкенд | Отсутствуют. Форма не отправляется на сервер- открывает `wa.me` deep link |

### Ключевой вывод

**Не пытайтесь переписывать CSS в утилиты Tailwind.** Стилевой бандл содержит
~1200 правил с `!important` и наслоением четырёх «патч-слоёв» друг на друга
(§2.2). Любая попытка «почистить» или «переписать в Tailwind» гарантированно
сломает пиксельность. Стратегия 1:1- **перенести CSS байт-в-байт в
`globals.css`, сохранив порядок**, а Tailwind использовать ровно так же, как в
оригинале: только ради preflight и как опция для будущих доработок.

---

## 1. Инвентарь: файлы дампа → маршруты Next.js 16

### 1.1 Карта страниц

| Файл дампа | Маршрут в Next.js | Файл в проекте |
|---|---|---|
| `index.html` | `/ru` | `app/[locale]/page.tsx` |
| `kk.html` | `/kk` | (тот же) |
| `en.html` | `/en` | (тот же) |
| `ru/catalog.html` + `kk/`, `en/` | `/[locale]/catalog` | `app/[locale]/catalog/page.tsx` |
| `ru/projects.html` + `kk/`, `en/` | `/[locale]/projects` | `app/[locale]/projects/page.tsx` |
| `ru/projects/classic-residence.html` | `/[locale]/projects/classic-residence` | `app/[locale]/projects/[slug]/page.tsx` |
| `ru/projects/grand-hall.html` | `/[locale]/projects/grand-hall` | (тот же) |
| `ru/projects/commercial-facade.html` | `/[locale]/projects/commercial-facade` | (тот же) |
| `ru/about.html` + `kk/`, `en/` | `/[locale]/about` | `app/[locale]/about/page.tsx` |
| `ru/estimate.html` + `kk/`, `en/` | `/[locale]/estimate` | `app/[locale]/estimate/page.tsx` |
| `ru/privacy.html` + `kk/`, `en/` | `/[locale]/privacy` | `app/[locale]/privacy/page.tsx` |
|- (стили `.not-found-page` есть в CSS) | 404 | `app/not-found.tsx` |
| `/` | редирект → `/ru` | `app/page.tsx` (redirect) |
| `manifest.webmanifest` | `/manifest.webmanifest` | `app/manifest.ts` |
| `robots.txt` | `/robots.txt` | `app/robots.ts` |
|- (упомянут в robots) | `/sitemap.xml` | `app/sitemap.ts` |

Итого: **8 файлов страниц** покрывают все 27 HTML-файлов дампа.

### 1.2 Секции главной страницы (порядок критичен!)

`<main class="home-page">` содержит строго в этом порядке:

```
1.  <header class="site-header">                       ← Header (прозрачный, поверх hero)
2.  <section class="hero">                             ← ВАЖНО: должен быть section:first-of-type
3.  <section class="services-section services-visual-section" id="services">
4.  <section class="sales-object-section" id="object-types">
5.  <section class="sales-catalog-section" id="catalog">
6.  <section class="sales-textures-section" id="textures">
7.  <section class="sales-projects-section" id="projects">
8.  <section class="sales-facts-section">
9.  <section class="sales-production-section" id="production">
10. <section class="sales-installation-section" id="installation">
11. <section class="sales-b2b-section" id="b2b">
12. <section class="contact-area" id="contacts">
13. <footer class="site-footer">
14. <a class="floating-whatsapp">                      ← вне footer, внутри main
```

> **Ловушка №1.** Последний слой CSS содержит селектор
> `.home-page > section:first-of-type`, который задаёт фоновую фотографию hero.
> Если между `<header>` и hero вставить любой другой `<section>`- фон главной
> страницы отвалится. `<header>`- это `header`, не `section`, поэтому порядок работает.

### 1.3 Секции внутренних страниц

Все внутренние страницы имеют общий каркас:
`<InternalHeader>` → контент → `<ContactArea>` → `<SiteFooter>` → `<FloatingWhatsapp>`.

| Страница | Секции контента |
|---|---|
| catalog | `.catalog-page-hero` → `.catalog-page-list` (6 × `.catalog-page-item` с id `cornices`, `columns`, `window-surrounds`, `balustrades`, `facade-panels`, `custom-products`) → `.custom-production-section` (4 шага) |
| projects | `.projects-page-hero.projects-page-hero-real` → `.real-projects-archive` (3 × `.real-project-card`) |
| projects/[slug] | `.real-project-detail-hero` → `.project-detail-content` → `.real-project-gallery` (1 большая + 2 малых figure) → `.project-detail-action` |
| about | `.about-page-hero` → `.about-statistics` (4) → `.about-story` → `.about-production` (+ `.about-principles`) |
| estimate | `.estimate-page-hero` → `.estimate-section` (форма + `.estimate-sidebar`) |
| privacy | `.legal-page-hero` → `.legal-page-content` (article-ы) |

---

## 2. Дизайн-система: токены, типографика, слои

### 2.1 CSS-переменные (4 набора, все обязательны)

```css
/* Базовый набор- используется большинством компонентов */
:root {
  --background: #f2efe8;
  --surface:    #faf8f3;
  --navy:       #102c5c;
  --navy-dark:  #081a37;
  --gold:       #b89045;
  --gold-light: #d9bd7b;
  --text:       #172033;
  --muted:      #626979;
  --line:       #102c5c29;
  --white:      #fff;
}

/* Слой «premium»- перекрашивает секции продаж */
:root {
  --premium-ivory:        #f4f0e8;
  --premium-stone:        #e9e1d4;
  --premium-white:        #fcfbf8;
  --premium-graphite:     #20262a;
  --premium-navy:         #10202c;
  --premium-bronze:       #b08a57;
  --premium-bronze-hover: #c39a63;
  --premium-text:         #182027;
  --premium-muted:        #696e70;
  --premium-line:         #18202721;
}

/* Слой «polish»- финальная полировка */
:root {
  --polish-ink:          #121a20;
  --polish-navy:         #14232d;
  --polish-graphite:     #20272b;
  --polish-stone:        #e9e1d4;
  --polish-ivory:        #f5f1e9;
  --polish-bronze:       #b18a55;
  --polish-bronze-light: #d5b47e;
  --polish-border:       #1820271f;
}
```

Плюс Tailwind v4 `@layer theme` c `--font-sans` / `--font-mono` (приходит из `@import "tailwindcss"`).

### 2.2 Порядок слоёв CSS- САМОЕ ВАЖНОЕ

Бандл `1g2snlkp6isx6.css`- это конкатенация в строго этом порядке. Слои
переопределяют друг друга через `!important`, поэтому **менять порядок нельзя**:

| # | Диапазон | Содержимое |
|---|---|---|
| 1 | нач. | `.hero-sales-*`, `.sales-*`- базовые стили продающих секций |
| 2 | | `:root{--premium-*}` + `!important`-перекраска секций в «премиум»-палитру |
| 3 | | `:root{--polish-*}` + hover-эффекты, градиенты, тени, фон hero |
| 4 | | Tailwind v4 `@layer theme` + `@layer base` (preflight) |
| 5 | | Основной `globals`: `:root` токены, `.site-header`, `.hero`, `.button`, `.services-section` |
| 6 | | Легаси-блок `.catalog-*`, `.project-*`, `.production-*`, `.b2b-*` (**в разметке не используется**, но оставить для 1:1) |
| 7 | | `.mobile-menu`, `.contact-area`, `.site-footer`, `.floating-whatsapp`, `.not-found-page` |
| 8 | | `.internal-header`, `.projects-page-*`, `.project-detail-*`, `.catalog-page-*`, `.about-*` |
| 9 | | `.internal-estimate-link`, `.estimate-*` (форма) |
| 10 | | `.estimate-privacy-link`, `.footer-legal-links`, `.legal-page-*` |
| 11 | | `.brand-mark-image`, `.home-page > section:first-of-type` (фото-фон hero) |
| 12 | конец | `.projects-page-hero-real`, `.real-project-*` (фото-версия проектов) |

### 2.3 Типографика

| Роль | Значение |
|---|---|
| Body | `Arial, Helvetica, sans-serif`, `color: var(--text)` |
| Все `h1`–`h3` | `Georgia, "Times New Roman", serif`, `font-weight: 400` |
| H1 hero (главная) | `clamp(54px, 4.2vw, 76px)`, `letter-spacing: -2.5px`, `line-height: .98` |
| H1 внутренних hero | `clamp(56–60px, 7.5–8vw, 108–116px)`, `letter-spacing: -5px`, `line-height: .94–.95` |
| H2 секций | `clamp(42px, 5vw, 72px)`, `letter-spacing: -2.6px`, `line-height: 1.03` |
| `.eyebrow` | `11px/700`, `letter-spacing: 2.4px`, `uppercase`, цвет `var(--polish-bronze)` |
| Тело абзацев | 13–18px, `line-height: 1.7–1.85`, цвет `var(--muted)` |
| Кнопка `.button` | `12px/700`, `uppercase`, `letter-spacing: 1px`, `min-height: 56px`, `padding: 0 27px` |

> `font-weight: 400` на заголовках- обязательно. Tailwind preflight сбрасывает
> `font-weight` у h1–h6 в `inherit`, а `<strong>`/`<b>` получают `bolder`.

### 2.4 Сетка-контейнер

Универсальный паттерн внутренних отступов секций:

```css
padding: 115px max(24px, 50vw - 690px);   /* контейнер 1380px, центрированный */
```

Хедеры: `width: min(1380px, 100% - 48px); margin: 0 auto;`

---

## 3. Шаг 1- создание проекта

```bash
npx create-next-app@latest artstil-next --typescript --app --tailwind --eslint --src-dir=false --import-alias "@/*"
```

Проверьте, что установлены `next@16`, `tailwindcss@4`, `@tailwindcss/postcss@4`.

`postcss.config.mjs`:

```js
export default { plugins: { "@tailwindcss/postcss": {} } }
```

`next.config.ts`:

```ts
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
    // Next 16 ограничивает допустимые quality; оригинал использует q=75
    qualities: [75],
  },
}

export default nextConfig
```

Целевая структура:

```
app/
  layout.tsx                     ← <html> без локали, только базовые метаданные
  page.tsx                       ← redirect('/ru')
  not-found.tsx
  manifest.ts
  robots.ts
  sitemap.ts
  globals.css                    ← весь перенесённый CSS
  [locale]/
    layout.tsx                   ← lang, alternates, generateStaticParams
    page.tsx                     ← главная (11 секций)
    catalog/page.tsx
    projects/page.tsx
    projects/[slug]/page.tsx
    about/page.tsx
    estimate/page.tsx
    privacy/page.tsx
components/
  layout/  SiteHeader.tsx  InternalHeader.tsx  SiteFooter.tsx
           ContactArea.tsx  FloatingWhatsapp.tsx  LanguageSwitcher.tsx  MobileMenu.tsx
  home/    Hero.tsx  ServicesSection.tsx  ObjectTypesSection.tsx  CatalogSection.tsx
           TexturesSection.tsx  ProjectsSection.tsx  FactsSection.tsx
           ProductionSection.tsx  InstallationSection.tsx  B2BSection.tsx
  forms/   ProjectEstimateForm.tsx     ← 'use client'
lib/
  i18n.ts        ← locales, defaultLocale, тип Locale
  dictionaries/  ru.ts  kk.ts  en.ts
  site.ts        ← SITE_URL, WHATSAPP_NUMBER, PHONE, INSTAGRAM
  projects.ts    ← данные 3 проектов
public/
  images/...
  icon.svg  favicon.ico
```

---

## 4. Шаг 2- перенос CSS (критический шаг)

### 4.1 Извлечь оригинальный CSS без потерь

```bash
node -e "const fs=require('fs');const s=fs.readFileSync('_next/static/chunks/1g2snlkp6isx6.css','utf8');fs.writeFileSync('extracted.css',s)"
```

Для читаемости отформатируйте (Prettier / `npx prettier --parser css`), но
**не меняйте порядок правил и не удаляйте `!important`**.

### 4.2 Собрать `app/globals.css`

```css
@import "tailwindcss";

/* ===== СЛОЙ 1: базовые стили продающих секций ===== */
/* ...вставить блок 1 из §2.2... */

/* ===== СЛОЙ 2: premium ===== */
/* ... */

/* ===== СЛОЙ 3: polish ===== */
/* ... */

/* СЛОЙ 4 (Tailwind preflight) уже подключён через @import выше-
   его отдельно копировать НЕ нужно */

/* ===== СЛОЙ 5: основной globals ===== */
/* ... */

/* ===== СЛОИ 6–12 ===== */
/* ... в порядке из таблицы §2.2 ... */
```

> **Ловушка №2.** В оригинале preflight стоит физически в середине файла, но это
> не влияет на каскад: `@layer theme`/`@layer base` всегда проигрывают
> неслоёным правилам. Поэтому `@import "tailwindcss"` в самом верху даёт
> идентичный результат.

### 4.3 Поправить пути к фоновым изображениям

CSS ссылается на:

```
/images/hero/hero-arch.webp
/images/texture/grain.png
/images/projects/public-arch.webp        /images/projects/grand-building.webp
/images/projects/night-arch.webp
/images/showcase/process-elements-v2.webp /images/showcase/process-scaffolding-v2.webp
/images/showcase/object-private-house-v2.webp
/images/showcase/object-facade-panels-v2.webp
/images/showcase/texture-natural-stone-v2.webp
/images/catalog/columns-capitals.jpg
/images/catalog-unique/{facade-details,window-facade,arch-entry,arch-entry-v2,
                        balustrade,balustrade-v2,custom-facade,custom-elements-v2}.jpg
```

Все эти файлы **уже есть** в дампе в папке `images/`- просто скопируйте её в
`public/images/`. Пути в CSS менять не нужно.

### 4.4 Убрать `!important`-костыли?- Нет

Файл содержит правила вроде `.hero-sales-promise span { display: none !important }`
и `.home-page > section:first-of-type > :last-child { display: none !important }`.
Второе **скрывает `.hero-scroll-line`** («ARTSTIL · ALMATY» с чёрточкой) на главной.
Это не баг вёрстки, а осознанный результат последнего слоя- при переносе 1:1
разметку `.hero-scroll-line` нужно оставить в HTML, но она будет невидима.

---

## 5. Шаг 3- ассеты

### 5.1 Прямое копирование

```bash
cp -r "images"                                        "artstil-next/public/images"
cp "icon.svg%3Ficon.389fl63xl8du5.svg"                "artstil-next/public/icon.svg"
cp "favicon.ico%3Ffavicon.2vob68tjqpejf.ico"          "artstil-next/public/favicon.ico"
```

### 5.2 Восстановление изображений, которых нет в `images/`

Разметка ссылается на 23 картинки, а в `images/` их только 9. Остальные лежат
только в кэше оптимизатора: файлы вида
`_next/image%3Furl=%2Fimages%2Fproduction%2Fdecor-elements.webp&w=3840&q=75`.

Недостающие оригиналы:

```
/images/brand/artstil-logo.png
/images/production/{decor-elements,installation,scaffolding}.webp
/images/projects/{classic-columns,private-residence,theatre}.webp
/images/showcase/{object-commercial-building-v2,object-small-architecture-v2,
                  installation-building-v2,texture-bespoke-v2,
                  texture-integral-colour-v2,texture-sandstone-v2,
                  texture-smooth-facade-v2,texture-travertine-v2}.webp
```

**Вариант A (предпочтительный).** Скачать оригиналы с живого сайта-
пути известны точно:

```bash
curl -o public/images/production/decor-elements.webp \
     https://artstil-website.vercel.app/images/production/decor-elements.webp
```

**Вариант B (fallback из кэша).** PowerShell-скрипт: берёт самый большой вариант
каждой картинки, декодирует имя, определяет реальный формат по сигнатуре
и раскладывает по `public/images/`.

```powershell
$src = "C:\Рабочий стол\artstil.kz\_next"
$dst = "C:\путь\artstil-next\public"

Get-ChildItem $src -File | Where-Object { $_.Name -like 'image%3Furl=*' } |
  ForEach-Object {
    if ($_.Name -match 'url=([^&]+)&w=(\d+)') {
      [pscustomobject]@{
        Path  = [uri]::UnescapeDataString($matches[1])
        Width = [int]$matches[2]
        File  = $_.FullName
      }
    }
  } |
  Group-Object Path |
  ForEach-Object {
    $best = $_.Group | Sort-Object Width -Descending | Select-Object -First 1
    $out  = Join-Path $dst ($best.Path -replace '/', '\').TrimStart('\')
    New-Item -ItemType Directory -Force (Split-Path $out) | Out-Null
    Copy-Item $best.File $out -Force
    # определить реальный формат
    $fs = [IO.File]::OpenRead($out); $b = New-Object byte[] 12
    $fs.Read($b,0,12) | Out-Null; $fs.Close()
    $fmt = if ($b[0] -eq 0xFF -and $b[1] -eq 0xD8) { 'JPEG' }
           elseif ($b[0] -eq 0x89) { 'PNG' }
           elseif ((($b[8..11] | % {[char]$_}) -join '') -eq 'WEBP') { 'WEBP' }
           else { 'UNKNOWN' }
    "{0,-6} {1}" -f $fmt, $best.Path
  }
```

> **Ловушка №3.** Кэш оптимизатора отдал **JPEG** под расширением `.webp`
> (20 из 22 файлов). Браузер это переварит (определяет формат по сигнатуре, а
> Next пересжимает при отдаче), но качество будет хуже оригинала и вес выше.
> Поэтому вариант A предпочтительнее.

### 5.3 Логотип

`.brand-mark.brand-mark-image`- круглый контейнер 58×58 (мобилка 48×48) с
`object-fit: cover` и `box-shadow: 0 0 0 1px #d9bd7b73, 0 12px 35px #0003`.
В разметке- `<Image width={64} height={64} />`, отдаётся 1x/2x.

---

## 6. Шаг 4- i18n

Без библиотек. Оригинал использует статический словарь + сегмент `[locale]`.

`lib/i18n.ts`:

```ts
export const locales = ["ru", "kk", "en"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "ru"

export const localeLabels: Record<Locale, string> = {
  ru: "РУС", kk: "ҚАЗ", en: "ENG",
}

export const htmlLang: Record<Locale, string> = {
  ru: "ru", kk: "kk", en: "en",
}
```

`app/[locale]/layout.tsx`:

```tsx
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children, params,
}: { children: React.ReactNode; params: Promise<{ locale: Locale }> }) {
  const { locale } = await params        // ← в Next 15+/16 params- Promise
  if (!locales.includes(locale)) notFound()
  return children
}
```

> **Ловушка №4.** В Next.js 16 `params` и `searchParams` асинхронные.
> `const { locale } = params` без `await`- ошибка типов и рантайма.

### Как наполнять словари

Тексты **не переписывать вручную**- извлечь дословно из HTML дампа:

- `ru` → `index.html`, `ru/*.html`
- `kk` → `kk.html`, `kk/*.html`
- `en` → `en.html`, `en/*.html`

Полный набор строк для формы расчёта уже восстанавливается один-в-один из
чанка `_next/static/chunks/3hhu--9v5alow.js`- там лежит объект-словарь со
всеми тремя локалями (`fields`, `placeholders`, `selectPlaceholder`, `options`,
`consent`, `privacyLink`, `submit`, `sending`, `error`, `phoneError`,
`success`, `message`).

Структура словаря по разделам:

```ts
type Dictionary = {
  nav: { services, catalog, projects, production, about, contacts, home, estimate }
  brand: { name: "ART STIL"; tagline: "Architectural decor" }
  hero: { eyebrow, title, description, salesCopy, promise, ctaPrimary, ctaSecondary, facts: string[] }
  services: { eyebrow, title, lead, cards: { number, title, text }[] }   // 3
  objectTypes: { eyebrow, title, lead, cards: { title, text, image }[] } // 4
  catalog: { eyebrow, title, lead, link, items: { title, text }[] }      // 6
  textures: { eyebrow, title, lead, items: {...}[], note }               // 6
  projects: { eyebrow, title, lead, link, cards: {...}[] }               // 3
  facts: { value, label }[]                                              // 4
  production: { eyebrow, title, lead, steps: { number, title, text }[] } // 6
  installation: { eyebrow, title, lead, list: string[], cta }            // 5
  b2b: { eyebrow, title, lead, list: string[], promise, cta }            // 6
  contact: { eyebrow, title, lead, cta, items: { index, label, value, href? }[] } // 4
  footer: { about, navTitle, contactTitle, langTitle, legal, copyright }
  estimateForm: { ...из JS-чанка... }
  // + catalogPage, projectsPage, aboutPage, privacyPage, notFound
}
```

---

## 7. Шаг 5- layout и метаданные

### 7.1 `app/layout.tsx`

```tsx
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html><body>{children}</body></html>
}
```

Атрибут `lang` устанавливается в `[locale]/layout.tsx`- либо вынесите `<html>`
в локальный layout, либо задайте `lang` через `generateMetadata`/middleware.
Оригинал отдаёт `<html lang="ru">`, `lang="kk"`, `lang="en"`- воспроизвести обязательно.

### 7.2 `generateMetadata`- полный набор из дампа

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale } = await params
  const t = dictionaries[locale]
  const url = `${SITE_URL}/${locale}`

  return {
    title: t.meta.title,
    description: t.meta.description,
    applicationName: "Art Stil",
    manifest: "/manifest.webmanifest",
    robots: {
      index: true, follow: true,
      googleBot: { index: true, follow: true, "max-video-preview": -1,
                   "max-image-preview": "large", "max-snippet": -1 },
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
      title: t.meta.title, description: t.meta.description,
      url, siteName: "Art Stil", type: "website",
      locale: { ru: "ru_RU", kk: "kk_KZ", en: "en_US" }[locale],
      alternateLocale: ["ru_RU", "kk_KZ", "en_US"].filter(l => l !== ...),
    },
    twitter: { card: "summary_large_image",
               title: t.meta.title, description: t.meta.description },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "256x256", type: "image/x-icon" },
        { url: "/icon.svg",    sizes: "any",     type: "image/svg+xml" },
      ],
    },
  }
}
```

### 7.3 JSON-LD (Organization)

Вставляется в конец `<main>` главной страницы:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Art Stil",
    url: SITE_URL,
    telephone: "+7 747 811 89 03",
    description: t.meta.description,
    sameAs: ["https://www.instagram.com/artstil.kz/"],
    areaServed: { "@type": "Country", name: t.meta.country },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+7 747 811 89 03",
      contactType: "sales",
      availableLanguage: ["Russian", "Kazakh", "English"],
    },
  })}}
/>
```

### 7.4 `app/manifest.ts`

```ts
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Art Stil Architectural Decor",
    short_name: "Art Stil",
    description: "Проектирование, производство и монтаж архитектурного фасадного декора из стеклофибробетона.",
    start_url: "/ru",
    display: "standalone",
    background_color: "#f2efe8",
    theme_color: "#102c5c",
    lang: "ru",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  }
}
```

### 7.5 `app/robots.ts`

```ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
```

---

## 8. Шаг 6- общие компоненты

Переносить разметку **дословно**, включая пустые `<span></span>`,
`aria-hidden="true"` и порядок вложенности: CSS активно использует
`:first-child`, `:nth-child()`, `:last-child`, `>` и `:before/:after`.

### 8.1 `SiteHeader` (только главная)

```tsx
<header className="site-header">
  <div className="header-inner">
    <Link className="brand" aria-label="Art Stil" href={`/${locale}`}>
      <span className="brand-mark brand-mark-image">
        <Image src="/images/brand/artstil-logo.png" alt="Art Stil" width={64} height={64} />
      </span>
      <span className="brand-text"><strong>ART STIL</strong><small>Architectural decor</small></span>
    </Link>
    <nav className="main-nav" aria-label={t.nav.aria}>{/* 6 ссылок */}</nav>
    <div className="language-switcher" aria-label={t.nav.langAria}>{/* 3 ссылки */}</div>
    <details className="mobile-menu">
      <summary aria-label="Menu"><span/><span/><span/></summary>
      <nav>{/* те же 6 ссылок */}</nav>
    </details>
  </div>
</header>
```

Особенности: `position: absolute` поверх hero, `backdrop-filter: blur(16px)`,
градиентный фон `linear-gradient(90deg,#0f191ffa,#14232df5)`,
подчёркивание при hover через `:after` со `scaleX(.35) → scaleX(1)`.

### 8.2 `InternalHeader` (все остальные страницы)

Отличия от `SiteHeader`: `position: relative`, сплошной фон `#07172f`,
класс `.internal-navigation`, у пункта «Рассчитать» класс
`.internal-estimate-link` (рамка бронза, при hover/active заливается золотом),
активный пункт получает класс `active`.

### 8.3 `MobileMenu`- без JavaScript

Оригинал использует нативный `<details>/<summary>`. **Не заменяйте на
`useState`**- визуально и по поведению это другое (нет `::marker`-сброса,
другая анимация). Обязательны:

```css
.mobile-menu summary { list-style: none }
.mobile-menu summary::-webkit-details-marker { display: none }
```

Показывается на `@media (max-width: 1050px)`.

### 8.4 `ContactArea`- идентична на всех страницах

Золотой градиент `linear-gradient(115deg,#b89045f7,#d9bd7bf5)`, 4 карточки
контактов с индексами `01`–`04`, кнопка WhatsApp `.contact-main-button` с
кружком `.whatsapp-dot`.

### 8.5 `SiteFooter`

Сетка `1.55fr .75fr .75fr .75fr` → на 1050px `1.4fr 1fr 1fr` → на 760px `1fr 1fr`
→ на 480px `1fr`. Внутри: бренд-колонка, навигация, контакты, языки,
`.footer-bottom` с `.footer-legal-links`.

### 8.6 `FloatingWhatsapp`

```tsx
<a className="floating-whatsapp" href={`https://wa.me/${WHATSAPP_NUMBER}`}
   target="_blank" rel="noreferrer" aria-label={t.whatsappAria}>
  <span>WA</span>
</a>
```

`position: fixed; bottom: 24px; right: 24px; z-index: 40`, круг 62×62 (мобилка 56×56).
Фон `#1d7b55`, но последний CSS-слой перекрывает его на `#25d366 !important`
(селектор `a[aria-label*=WhatsApp]`)- **зависит от того, содержит ли
`aria-label` подстроку «WhatsApp»**. В `ru`- да («Написать Art Stil в WhatsApp»),
поэтому кнопка зелёная. Сохраните тексты `aria-label` дословно, иначе цвет изменится.

---

## 9. Шаг 7- страницы

### 9.1 Главная

Каждая секция- отдельный серверный компонент, принимающий срез словаря.
Ключевые моменты 1:1:

**Hero.** Разметка содержит декоративный `.hero-visual` (солнечный диск + колонны)
и `.hero-scroll-line`. Оба перекрыты последними слоями CSS
(`.hero-visual` сжат до `max-width: 850px` контейнера, `.hero-scroll-line`
скрыт через `display: none !important`). Разметку оставить как есть.
Нумерованный кружок `.hero-sales-promise span` тоже скрыт- вместо него
работает бронзовая полоска `border-left: 2px solid`.

**ServicesSection.** 3 карточки. Фото приходят **из CSS** через
`article:nth-child(n):before`- в JSX картинок нет, только `<span>`, `<h3>`, `<p>`.
Класс секции обязательно `services-section services-visual-section`.

**ObjectTypesSection.** 4 карточки, `<Image fill sizes="(max-width: 760px) 100vw, 25vw" />`,
затем пустой `<span></span>` (градиентная шторка) и `<strong>01</strong>`.

**CatalogSection.** 6 карточек, картинок в JSX **нет**- фон через
`article:nth-child(n):before` (см. §4.3, список `catalog-unique/*.jpg`).

**TexturesSection.** 6 плиток, `sizes="(max-width: 760px) 50vw, 17vw"`, плюс
`.sales-texture-note` внизу.

**ProjectsSection.** 3 карточки высотой 500px (1050px → 580px, 760px → 440px).

**FactsSection.** 4 `<article><strong>…</strong><span>…</span></article>`- без обёрток.

**ProductionSection.** Сетка `.92fr 1.08fr`: слева 2 `<figure>` с фото
(690px и 470px min-height), справа 6 шагов.

**InstallationSection.** Сетка `1.1fr .9fr`, фото слева + `<span>` шторка,
справа копия с `<ul>` (маркер `◆` через `li:before`).

**B2BSection.** Сетка `.9fr 1.1fr` на фоне из двух grid-градиентов 76×76px.

### 9.2 `/[locale]/catalog`

6 `<article className="catalog-page-item" id="…">`. У каждой- три колонки:
`.catalog-page-item-heading` / `.catalog-page-item-visual` / `.catalog-page-item-footer`.
Визуалы- **чистый CSS-арт** из пустых `<span>`:

| Модификатор | Разметка |
|---|---|
| `catalog-page-cornice` | 3 `<span>` (столбиком, разной ширины/высоты) |
| `catalog-page-column` | 3 `<span>` 25×180 |
| `catalog-page-window` | 1 большой `<span>` 160×190 + несколько линий 195×1 |
| `catalog-page-balustrade` | несколько `<span>` 27×130 |
| `catalog-page-panel` | grid 2×2 из `<span>` 95×95 |
| `catalog-page-custom` | 3 `<span>` с `rotate(25deg)`, `rotate(-18deg)`, `border-radius: 50%` |

Число `<span>` внутри критично- CSS адресуется через `:nth-child()`.
Скопируйте из `ru/catalog.html` дословно.

### 9.3 `/[locale]/projects` и `/[locale]/projects/[slug]`

```ts
// lib/projects.ts
export const projectSlugs = ["classic-residence", "grand-hall", "commercial-facade"] as const
export function generateStaticParams() {
  return locales.flatMap(l => projectSlugs.map(slug => ({ locale: l, slug })))
}
```

На листинге: `.real-projects-grid`- 2 колонки, но **третья карточка**
(`:last-child`) занимает `grid-column: 1 / -1` и `width: calc(50% - 14px)`.
На 760px это сбрасывается. Порядок карточек менять нельзя.

Деталь проекта: hero `.85fr 1.15fr`, затем `.project-detail-intro`
(`.35fr 1.65fr`), `.project-detail-information` (2 колонки, `<ul>` с `◆`),
галерея `.real-project-gallery`- grid `1.45fr .75fr` / `repeat(2, 310px)`,
где `.real-gallery-main` занимает `grid-row: 1/3`.

### 9.4 `/[locale]/about`

`.about-statistics`- 4 колонки на золотом фоне `var(--gold)`.
`.about-page-architecture`- CSS-арт: `<div>` (круг 420×420) + несколько `<span>` (колонны).

### 9.5 `/[locale]/privacy`

`.legal-page-content` использует **другой контейнер**: `max(24px, 50vw - 590px)`
(уже, чем остальные секции- 1180px вместо 1380px). Не унифицировать!

### 9.6 `app/not-found.tsx`

Стили `.not-found-page`, `.not-found-content`, `.not-found-actions`,
`.not-found-decoration` (круг 620×620 с 4 `<span>`-лучами под 0°/45°/90°/135°)
в CSS есть- страницы в дампе нет, восстановить по стилям.

---

## 10. Шаг 8- единственный клиентский компонент

`components/forms/ProjectEstimateForm.tsx`- восстанавливается один-в-один из
чанка `3hhu--9v5alow.js`. Логика:

```tsx
"use client"

export function ProjectEstimateForm({ locale, whatsappNumber }: Props) {
  const t = estimateDictionary[locale]
  const [error, setError]     = useState("")
  const [success, setSuccess] = useState(false)
  const [sending, setSending] = useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(""); setSuccess(false)

    const form = event.currentTarget
    if (!form.reportValidity()) { setError(t.error); return }

    const data  = new FormData(form)
    const get   = (k: string) => String(data.get(k) ?? "").trim()
    const phone = get("phone")

    if (phone.replace(/\D/g, "").length < 7) { setError(t.phoneError); return }

    setSending(true)
    const message =
      `*${t.message.title}*\n\n` +
      `*${t.message.name}:* ${get("name")}\n` +
      `*${t.message.phone}:* ${phone}\n` +
      `*${t.message.city}:* ${get("city")}\n` +
      `*${t.message.objectType}:* ${get("objectType")}\n` +
      `*${t.message.service}:* ${get("service")}\n` +
      `*${t.message.stage}:* ${get("stage")}\n` +
      `*${t.message.installation}:* ${get("installation")}\n` +
      `*${t.message.deadline}:* ${get("deadline")}\n` +
      `*${t.message.description}:* ${get("description") || t.message.empty}`

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank", "noopener,noreferrer",
    )
    setSending(false); setSuccess(true)
  }

  return <form className="estimate-form" onSubmit={handleSubmit} noValidate>…</form>
}
```

Поля (порядок обязателен- сетка 2 колонки):
`name` (text) · `phone` (tel, `inputMode="tel"`) · `city` (text) ·
`objectType` (select, 6 опций) · `service` (select, 8) · `stage` (select, 6) ·
`installation` (select, 4) · `deadline` (select, 5) ·
`description` (textarea, `rows={6}`, класс `estimate-field estimate-field-wide`).

Каждое поле обёрнуто в `<label className="estimate-field">` со `<span>` +
`<strong aria-hidden="true">*</strong>` для обязательных.

Селекты: `defaultValue=""` + первая `<option value="" disabled>`- так браузер
покажет плейсхолдер и заблокирует пустую отправку.

Чекбокс согласия- `.estimate-consent` со ссылкой на `/[locale]/privacy`.
Кнопка- `.button.estimate-submit-button` с кружком `.estimate-submit-icon`
(текст «WA»), `disabled={sending}`.

Сообщения об ошибке/успехе- `<p className="estimate-message estimate-error">`
и `estimate-success` (стили уже в CSS).

> **Ловушка №5.** Атрибут `noValidate` на `<form>` в сочетании с ручным
> `form.reportValidity()`- намеренно: браузер не показывает нативные тултипы
> при сабмите, но валидацию мы вызываем сами. Не убирайте `noValidate`.

---

## 11. Полный реестр анимаций и переходов

`@keyframes` в проекте нет. Все эффекты- `transition`. Список для проверки:

| Элемент | Свойство | Длительность | Эффект |
|---|---|---|---|
| `.home-page a`, `.home-page button` | color, background, border-color, transform | `.22s` | базовый |
| `.main-nav a:after` | transform | `.22s` | `scaleX(0) → scaleX(1)`, `transform-origin` меняется `100% → 0` |
| `.home-page .site-header nav a:after` | opacity, transform | `.22s` | `scaleX(.35)/opacity 0 → scaleX(1)/opacity 1` |
| `.button` | transform, background-color, border-color | `.18s` | hover: `translateY(-2px)` |
| `.services-visual-section article` | transform, box-shadow | `.3s` | hover: `translateY(-6px)` + тень `0 28px 65px #181e201c` |
| `.sales-object-card` | transform, box-shadow | `.3s` | hover: `translateY(-5px)` + `0 24px 55px #181e201a` |
| `.sales-catalog-grid article` | transform, box-shadow | `.3s` | hover: `translateY(-6px)` + `0 26px 60px #181e201c` |
| `.sales-object-image img` | transform | `.65s` | hover карточки: `scale(1.04)` |
| `.sales-texture-image img` | transform | `.65s` | hover: `scale(1.035)` |
| `.sales-project-image img` | transform, filter | `.75s` | hover: `scale(1.035)` + `saturate(.94) contrast(1.05)` |
| `.real-project-media img` | transform | `.7s` | hover карточки: `scale(1.035)` |
| `.real-project-gallery img` | transform | `.7s` | hover figure: `scale(1.025)` |
| `.sales-facts-section article` | background | `.25s` | hover: `#ffffff6b` |
| `.sales-production-steps article` | padding-left, background | `.24s` | hover: `padding-left: 12px` + градиент слева |
| `.catalog-card` | background-color, transform | `.22s` | hover: `translateY(-4px)` |
| `.footer-navigation a` и др. | color | `.18s` | → `var(--gold-light)` |
| `.footer-legal-links a` | color | `.18s` | → `var(--gold-light)` |
| `.floating-whatsapp` | transform, box-shadow | `.18s` | hover: `translateY(-4px)` |
| `.estimate-field input/select/textarea` | border-color, box-shadow | `.18s` | focus: рамка `var(--gold)` + `0 0 0 3px #b890451f` |
| `.catalog-page-hero` и др. |- |- | статичные декоративные круги, без анимации |

Глобально: `html { scroll-behavior: smooth }`- работает для якорей
`#services`, `#catalog`, `#projects`, `#production`, `#contacts` и т.д.

**Отключение эффектов на мобильных** (`max-width: 760px`)- обязательно перенести:

```css
.services-visual-section article:hover,
.sales-object-card:hover,
.sales-catalog-grid article:hover { transform: none }
.sales-production-steps article:hover { padding-left: 0 }
```

Постоянные фильтры на изображениях (не hover):

```css
.sales-object-image img, .sales-texture-image img, .sales-project-image img,
.sales-production-photos img, .sales-installation-image img,
.services-visual-section article:before, .sales-catalog-grid article:before {
  filter: saturate(.88) contrast(1.03);
}
```

---

## 12. Адаптив

Три брейкпоинта + два точечных. Медиа-запросы **только `max-width`**- mobile-last,
не mobile-first. Не переводите на Tailwind-брейкпоинты (`sm:`/`md:`)- логика инвертирована.

| Брейкпоинт | Что меняется |
|---|---|
| `max-width: 1100px` | только estimate: hero в 1 колонку, `.estimate-sidebar` → `position: static` + 2 колонки |
| `max-width: 1050px` | `.main-nav` и `.internal-navigation` → `display: none`; `.mobile-menu`/`.internal-mobile-menu` → `display: block`; все двухколоночные сетки → 1 колонка; `.sales-object-grid`/`.sales-textures-grid` → 2 колонки; `.sales-catalog-grid` → 2 колонки; `.about-statistics` → 2 колонки |
| `max-width: 1000px` | `.projects-page-hero-real`, `.real-project-detail-hero` → 1 колонка |
| `max-width: 760px` | основной мобильный слой: все сетки → 1 колонка, вертикальные кнопки на всю ширину, отступы секций `20px`, отключение hover-трансформаций, `h1` → `clamp(43px, 12.5vw, 60px)`, `h2` → `clamp(28px, 7.7vw, 39px)` + `hyphens: auto` + `overflow-wrap: anywhere` |
| `max-width: 480px` | `.brand-text strong` → 15px; `.footer-main` → 1 колонка; `.internal-header .brand-text` → `display: none` |

> **Ловушка №6.** Заголовки на мобильных получают `hyphens: auto` и
> `overflow-wrap: anywhere`- без них длинные русские/казахские слова
> («стеклофибробетона», «Многоэтажные») вылезают за экран.
> Плюс `html, body { overflow-x: hidden }`.

---

## 13. Шаг 9- верификация пиксельности

Итеративный цикл. Повторять для каждой страницы × каждой локали × каждого брейкпоинта.

### 13.1 Поднять эталон и копию рядом

```bash
npx serve "C:\Рабочий стол\artstil.kz" -l 4000    # эталон
npm run dev                                        # копия на :3000
```

### 13.2 Скриншот-дифф

```bash
npm i -D playwright pixelmatch pngjs
npx playwright install chromium
```

Скрипт `scripts/visual-diff.mjs`: для каждой пары URL снимает `fullPage`
скриншоты при ширинах **1440 / 1280 / 1050 / 900 / 760 / 480 / 375**
и сравнивает `pixelmatch` с порогом `0.1`.

Матрица проверки: 8 страниц × 3 локали × 7 ширин = **168 сравнений**.

### 13.3 Чек-лист ручной проверки (то, что скриншот не ловит)

- [ ] Hover на каждом типе карточки (5 разных: services, object, catalog, project, real-project)
- [ ] Подчёркивание пунктов главного меню (`scaleX`, направление роста слева)
- [ ] Открытие/закрытие `<details>` мобильного меню
- [ ] Focus-ring на всех полях формы (золотая рамка + `box-shadow`)
- [ ] Отправка формы → корректный текст сообщения в WhatsApp на всех 3 локалях
- [ ] Валидация: пустые поля → `t.error`; телефон < 7 цифр → `t.phoneError`
- [ ] Плавный скролл по всем якорям главной
- [ ] Sticky-поведение `.estimate-sidebar` (`top: 30px`) на ширине > 1100px
- [ ] Цвет `.floating-whatsapp` = `#25d366` (проверить `aria-label`, §8.6)
- [ ] Переключатель языков сохраняет текущую страницу (`/ru/catalog` → `/en/catalog`)
- [ ] Класс `active` на текущем пункте `.internal-navigation`

### 13.4 Диагностика расхождений

| Симптом | Причина |
|---|---|
| Слетел фон hero главной | hero не является `section:first-of-type` внутри `.home-page` |
| Пропали фото в services/catalog | не скопированы `images/catalog-unique/*`, или сломан порядок `:nth-child` |
| Другой цвет секции | нарушен порядок слоёв CSS (§2.2) |
| Заголовки жирные | потерян `font-weight: 400`, preflight выставил `inherit` |
| Кнопка не бронзовая | не перенесён слой `body .button.button-primary { … !important }` |
| Съехали отступы секций | заменён `max(24px, 50vw - 690px)` на Tailwind-контейнер |
| Мобильное меню с треугольником | не перенесён сброс `::-webkit-details-marker` |
| Третья карточка проектов на всю ширину | это НОРМА- `:last-child { grid-column: 1/-1; width: calc(50% - 14px) }` |

---

## 14. Шаг 10- конфигурация и деплой

### 14.1 `app/sitemap.ts`

```ts
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/catalog", "/projects", "/about", "/estimate", "/privacy",
                 ...projectSlugs.map(s => `/projects/${s}`)]
  return locales.flatMap(locale =>
    paths.map(p => ({
      url: `${SITE_URL}/${locale}${p}`,
      lastModified: new Date(),
      alternates: { languages: Object.fromEntries(
        locales.map(l => [l, `${SITE_URL}/${l}${p}`])) },
    })))
}
```

### 14.2 Корневой редирект

```ts
// app/page.tsx
import { redirect } from "next/navigation"
export default function Root() { redirect("/ru") }
```

### 14.3 Сборка и статика

Проект полностью статический (нет БД, нет серверных экшенов). Можно включить
`output: "export"`, но тогда потеряется оптимизатор `next/image`- придётся
добавить `images: { unoptimized: true }`. Для Vercel оставьте обычный SSG:
все страницы предрендерятся через `generateStaticParams`.

```bash
npm run build       # проверить: все маршруты помечены ● (SSG)
npm run start
```

---

## 15. Финальный чек-лист приёмки

**Структура**
- [ ] 8 файлов страниц покрывают все 27 HTML дампа
- [ ] `generateStaticParams` для `[locale]` и `[locale]/projects/[slug]`
- [ ] `/` → `/ru`, `<html lang>` корректен на всех 3 локалях

**Стили**
- [ ] `globals.css` содержит все 12 слоёв в исходном порядке
- [ ] Ни одно `!important` не удалено
- [ ] Все 4 набора CSS-переменных на месте
- [ ] Georgia/Arial, `font-weight: 400` на заголовках
- [ ] Легаси-блок (слой 6) перенесён, даже если не используется

**Ассеты**
- [ ] 23 изображения в `public/images/` (9 из дампа + 14 восстановленных)
- [ ] `icon.svg`, `favicon.ico`, `grain.png`
- [ ] CSS-пути к фонам работают (проверить DevTools → Network, нет 404)

**Поведение**
- [ ] Все 20 переходов из §11 воспроизводятся
- [ ] `@keyframes` в проекте по-прежнему 0
- [ ] Мобильное меню на `<details>`, не на state
- [ ] Форма формирует идентичное WhatsApp-сообщение (сравнить URL посимвольно)

**SEO**
- [ ] canonical + 4 hreflang (ru, kk, en, x-default) на каждой странице
- [ ] OG + Twitter карточки
- [ ] JSON-LD Organization на главной
- [ ] manifest, robots, sitemap отдаются

**Верификация**
- [ ] 168 скриншот-диффов пройдены с порогом ≤ 0.1
- [ ] Lighthouse не хуже эталона

---

## 16. Сводка ловушек

1. **Hero должен быть `section:first-of-type`**- иначе слетает фото-фон главной.
2. **`@import "tailwindcss"` вверху**- preflight в `@layer`, каскад не ломает.
3. **Кэш `_next/image` содержит JPEG под именами `.webp`**- качайте оригиналы.
4. **`params` в Next 16- Promise**, нужен `await`.
5. **`noValidate` + `reportValidity()`**- намеренная комбинация, не убирать.
6. **`hyphens: auto` на мобильных заголовках**- иначе горизонтальный скролл.
7. **`aria-label` кнопки WhatsApp влияет на её цвет** (селектор `a[aria-label*=WhatsApp]`).
8. **`.legal-page-content` имеет свой, более узкий контейнер** (`50vw - 590px`).
9. **`.hero-scroll-line` намеренно скрыт** последним слоем- разметку оставить.
10. **Порядок и количество `<span>` в CSS-арте** (`catalog-page-*`, `about-page-architecture`, `building-columns`) критичны для `:nth-child`.

---

## 17. Рекомендуемый порядок работ (спринты)

| Спринт | Задачи | Проверка |
|---|---|---|
| **1. Каркас** | create-next-app, `globals.css` (все 12 слоёв), `public/images`, i18n-скелет | На пустой странице подгружаются шрифты и переменные |
| **2. Общие блоки** | SiteHeader, InternalHeader, SiteFooter, ContactArea, FloatingWhatsapp, MobileMenu | Дифф хедера/футера на всех ширинах |
| **3. Главная** | 11 секций + JSON-LD + метаданные | Дифф `/ru` на 7 ширинах |
| **4. Локали** | Словари `kk`, `en`, hreflang, переключатель | Дифф `/kk`, `/en` |
| **5. Внутренние** | catalog, projects, projects/[slug], about, privacy | Дифф всех внутренних × 3 локали |
| **6. Форма** | ProjectEstimateForm + словарь из JS-чанка | Посимвольное сравнение `wa.me` URL |
| **7. Финал** | not-found, manifest, robots, sitemap, редирект `/`, сборка | Полная матрица 168 диффов + Lighthouse |
