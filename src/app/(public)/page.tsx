import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteData } from "@/lib/settings";
import { buildMetadata, jsonLdScript, organizationSchema, faqSchema } from "@/lib/seo";
import { Hero } from "@/components/sections/Hero";
import { InstitutionalPhrase } from "@/components/sections/InstitutionalPhrase";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { Pillars } from "@/components/sections/Pillars";
import { AreasPreview } from "@/components/sections/AreasPreview";
import { Authority } from "@/components/sections/Authority";
import { RecentArticles } from "@/components/sections/RecentArticles";
import { FaqPreview } from "@/components/sections/FaqPreview";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { ContactSection } from "@/components/sections/ContactSection";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    description:
      "Advocacia e consultoria jurídica nas áreas Previdenciária, Trabalhista, Tributária, Bancária e Direitos das Pessoas Autistas. Direito com estratégia, conhecimento e proximidade.",
  });
}

export default async function HomePage() {
  const { settings } = await getSiteData();

  const [areas, articles, faqs] = await Promise.all([
    prisma.category.findMany({
      where: { type: "AREA", active: true },
      select: { slug: true, name: true, description: true },
      orderBy: { order: "asc" },
    }),
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: {
        slug: true,
        title: true,
        subtitle: true,
        summary: true,
        coverImage: true,
        publishedAt: true,
        readingTime: true,
        category: { select: { name: true } },
      },
      orderBy: { publishedAt: "desc" },
      take: 6,
    }),
    prisma.faq.findMany({
      where: { active: true },
      select: { question: true, answer: true },
      orderBy: { order: "asc" },
      take: 6,
    }),
  ]);

  const orgSchema = await organizationSchema();
  const faqSchemaData = faqSchema(faqs.map((f) => ({ question: f.question, answer: f.answer })));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqSchemaData) }} />

      <Hero
        title={settings?.heroTitle ?? "Direito com estratégia, conhecimento e proximidade."}
        subtitle={settings?.heroSubtitle ?? "Daniel de Souza Advocacia e Consultoria Jurídica"}
        text={
          settings?.heroText ??
          "Atuação jurídica nas áreas Previdenciária, Trabalhista, Tributária, Bancária e na proteção dos direitos das pessoas autistas."
        }
      />

      <InstitutionalPhrase phrase={settings?.institutionalPhrase} />

      <AboutPreview
        name={settings?.name ?? "Daniel de Souza Advocacia e Consultoria Jurídica"}
        lawyerName={settings?.lawyerName}
        formation={settings?.lawyerFormation}
        specializations={settings?.lawyerSpecializations}
        oab={settings?.oab}
        photo={settings?.lawyerPhoto}
      />

      <Pillars />

      <AreasPreview areas={areas} />

      <Authority />

      <RecentArticles articles={articles} />

      <FaqPreview items={faqs} />

      <NewsletterSection />

      <ContactSection
        whatsapp={settings?.whatsapp}
        whatsappMessage={settings?.whatsappMessage ?? ""}
        instagram={settings?.instagram}
      />
    </>
  );
}
