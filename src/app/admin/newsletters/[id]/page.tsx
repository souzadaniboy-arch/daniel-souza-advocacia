import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NewsletterForm, type NewsletterFormData } from "@/components/admin/NewsletterForm";

export const metadata: Metadata = {
  title: "Editar newsletter | Administração",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarNewsletterPage({ params }: PageProps) {
  const { id } = await params;
  const [newsletter, articles] = await Promise.all([
    prisma.newsletter.findUnique({ where: { id }, include: { articles: { select: { articleId: true } } } }),
    prisma.article.findMany({
      where: { status: { in: ["PUBLISHED", "SCHEDULED", "DRAFT"] } },
      orderBy: { title: "asc" },
      select: { id: true, title: true },
      take: 200,
    }),
  ]);

  if (!newsletter) notFound();

  const formData: NewsletterFormData = {
    id: newsletter.id,
    subject: newsletter.subject,
    title: newsletter.title,
    intro: newsletter.intro ?? "",
    content: newsletter.content,
    ctaLabel: newsletter.ctaLabel ?? "",
    ctaUrl: newsletter.ctaUrl ?? "",
    status: newsletter.status,
    scheduledAt: newsletter.scheduledAt ? newsletter.scheduledAt.toISOString() : null,
  };

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold text-brand-graphite">Editar newsletter</h1>
      <NewsletterForm newsletter={formData} articleIds={newsletter.articles.map((a) => a.articleId)} articles={articles} />
    </div>
  );
}
