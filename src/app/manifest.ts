import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Daniel de Souza Advocacia e Consultoria Jurídica",
    short_name: "DS Advocacia",
    description:
      "Advocacia e consultoria jurídica nas áreas Previdenciária, Trabalhista, Tributária, Bancária e Direitos das Pessoas Autistas.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F3EE",
    theme_color: "#B65F4A",
    lang: "pt-BR",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
