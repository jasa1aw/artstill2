import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Art Stil Architectural Decor",
    short_name: "Art Stil",
    description:
      "Проектирование, производство и монтаж архитектурного фасадного декора из стеклофибробетона.",
    start_url: "/ru",
    display: "standalone",
    background_color: "#f2efe8",
    theme_color: "#102c5c",
    lang: "ru",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
