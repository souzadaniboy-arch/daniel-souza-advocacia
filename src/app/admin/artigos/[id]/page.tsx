import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArticleForm, type ArticleFormData } from "@/components/admin/ArticleForm";

export const metadata: Metadata = {
  title: "Editar artigo | Administração",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarArtigoPage({ params }: PageProps) {
  const { id } = await params;
  const [article, categories, authors, faqs, allArticles] = await Promise.all([
    prisma.article.findUnique({
      where: { id },
      include: {
        faqs: { select: { faqId: true } },
        relatedFrom: { select: { articleBId: true } },
        relatedTo: { select: { articleAId: true } },
      },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true, type: true } }),
    prisma.author.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.faq.findMany({ where: { active: true }, orderBy: { order: "asc" }, select: { id: true, question: true } }),
    prisma.article.findMany({
      where: { status: { in: ["PUBLISHED", "SCHEDULED", "DRAFT"] } },
      orderBy: { title: "asc" },
      select: { id: true, title: true },
      take: 200,
    }),
  ]);

  if (!article) notFound();

  const formData: ArticleFormData = {
    id: article.id,
    title: article.title,
    subtitle: article.subtitle ?? "",
    slug: article.slug,
    summary: article.summary ?? "",
    content: article.content,
    coverImage: article.coverImage ?? "",
    ogImage: article.ogImage ?? "",
    keywords: article.keywords ?? "",
    metaTitle: article.metaTitle ?? "",
    metaDescription: article.metaDescription ?? "",
    status: article.status,
    categoryId: article.categoryId,
    authorId: article.authorId,
    featured: article.featured,
    publishedAt: article.publishedAt ? article.publishedAt.toISOString() : null,
    scheduledAt: article.scheduledAt ? article.scheduledAt.toISOString() : null,
  };

  const relatedIds = [
    ...article.relatedFrom.map((r) => r.articleBId),
    ...article.relatedTo.map((r) => r.articleAId),
  ];
  const faqIds = article.faqs.map((f) => f.faqId);

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold text-brand-graphite">Editar artigo</h1>
      <ArticleForm
        article={formData}
        relatedIds={relatedIds}
        faqIds={faqIds}
        categories={categories}
        authors={authors}
        faqs={faqs}
        allArticles={allArticles}
      />
    </div>
  );
}
