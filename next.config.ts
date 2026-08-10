import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
    // Оригинал (Next.js на artstil-website.vercel.app) отдавал изображения с q=75
    qualities: [75],
  },
  experimental: {
    // Root layout здесь — app/[locale]/layout.tsx (динамический сегмент),
    // поэтому обычный app/not-found.tsx не может отрендерить <html>/<body>
    // для по-настоящему несматченных путей. См. node_modules/next/dist/docs/
    // .../file-conventions/not-found.md, раздел про global-not-found.js.
    globalNotFound: true,
  },
};

export default nextConfig;
