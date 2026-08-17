import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ArticleForm } from "@/components/admin/ArticleForm";

export const metadata: Metadata = {
  title: "Novo artigo | Administração",
  robots: { index: false, follow: false },
};

export default async function NovoArtigoPage() {
  const [categories, authors, faqs, allArticles] = await Promise.all([
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

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold text-brand-graphite">Novo artigo</h1>
      <ArticleForm categories={categories} authors={authors} faqs={faqs} allArticles={allArticles} />
    </div>
  );
}
