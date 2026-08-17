import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

  const staticPages = [
    { path: "", lastModified: new Date(), priority: 1 },
    { path: "/quem-somos", lastModified: new Date(), priority: 0.8 },
    { path: "/areas-de-atuacao", lastModified: new Date(), priority: 0.9 },
    { path: "/artigos", lastModified: new Date(), priority: 0.8 },
    { path: "/newsletter", lastModified: new Date(), priority: 0.6 },
    { path: "/contato", lastModified: new Date(), priority: 0.8 },
    { path: "/faq", lastModified: new Date(), priority: 0.7 },
    { path: "/politica-de-privacidade", lastModified: new Date(), priority: 0.3 },
    { path: "/politica-de-cookies", lastModified: new Date(), priority: 0.3 },
    { path: "/aviso-juridico", lastModified: new Date(), priority: 0.3 },
  ];

  const [areas, articles] = await Promise.all([
    prisma.category.findMany({
      where: { type: "AREA", active: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true, publishedAt: true },
    }),
  ]);

  return [
    ...staticPages.map((page) => ({
      url: `${baseUrl}${page.path}`,
      lastModified: page.lastModified,
      changeFrequency: "daily" as const,
      priority: page.priority,
    })),
    ...areas.map((area) => ({
      url: `${baseUrl}/areas/${area.slug}`,
      lastModified: area.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...articles.map((article) => ({
      url: `${baseUrl}/artigos/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
