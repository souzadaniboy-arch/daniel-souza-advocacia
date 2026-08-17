import type { Metadata } from "next";
import { getSiteData } from "./settings";

export const DEFAULT_OG = "/og-default.jpg";

export async function buildMetadata({
  title,
  description,
  path,
  ogImage,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string | null;
  noIndex?: boolean;
}): Promise<Metadata> {
  const { settings, seo } = await getSiteData();
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const siteTitle = settings?.name ?? "Daniel de Souza Advocacia e Consultoria Jurídica";
  const url = path ? `${baseUrl}${path}` : baseUrl;

  const finalTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const finalDescription = description ?? seo?.siteDescription ?? "";

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: { canonical: url },
    robots: {
      index: noIndex ? false : true,
      follow: noIndex ? false : true,
      googleBot: {
        index: noIndex ? false : true,
        follow: noIndex ? false : true,
      },
    },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url,
      siteName: siteTitle,
      locale: "pt_BR",
      type: "website",
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: title ?? siteTitle }]
        : [{ url: seo?.ogImage ?? DEFAULT_OG, width: 1200, height: 630, alt: siteTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
    },
  };
}

export function jsonLdScript(schema: Record<string, unknown>): string {
  return JSON.stringify({ "@context": "https://schema.org", ...schema });
}

export async function organizationSchema() {
  const { settings, seo } = await getSiteData();
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return {
    "@type": "LegalService",
    name: settings?.name ?? "Daniel de Souza Advocacia e Consultoria Jurídica",
    description: seo?.siteDescription ?? "",
    url: baseUrl,
    logo: settings?.logo ? `${baseUrl}${settings.logo}` : undefined,
    image: seo?.ogImage ? `${baseUrl}${seo.ogImage}` : undefined,
    telephone: settings?.phone || undefined,
    email: settings?.email || undefined,
    address: settings?.address ? { "@type": "PostalAddress", streetAddress: settings.address } : undefined,
    sameAs: settings?.instagram
      ? [settings.instagram.startsWith("http") ? settings.instagram : `https://www.instagram.com/${settings.instagram.replace(/^@/, "")}/`]
      : undefined,
  };
}

export function personSchema(name?: string, url?: string) {
  return {
    "@type": "Person",
    name: name ?? "Daniel de Souza",
    url,
  };
}

export function articleSchema(article: {
  title: string;
  description?: string | null;
  slug: string;
  publishedAt?: Date | string | null;
  updatedAt: Date | string;
  author?: { name: string } | null;
  category?: { name: string } | null;
  image?: string | null;
}) {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return {
    "@type": "Article",
    headline: article.title,
    description: article.description ?? undefined,
    image: article.image ? `${baseUrl}${article.image}` : undefined,
    datePublished: article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined,
    dateModified: new Date(article.updatedAt).toISOString(),
    author: { "@type": "Person", name: article.author?.name ?? "Daniel de Souza" },
    publisher: { "@type": "Organization", name: "Daniel de Souza Advocacia e Consultoria Jurídica" },
    mainEntityOfPage: `${baseUrl}/artigos/${article.slug}`,
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.path}`,
    })),
  };
}
