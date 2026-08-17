import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ArticlesList } from "@/components/admin/ArticlesList";

export const metadata: Metadata = {
  title: "Artigos | Administração",
  robots: { index: false, follow: false },
};

const TAKE = 50;

export default async function AdminArtigosPage() {
  const total = await prisma.article.count();
  const articles = (
    await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        publishedAt: true,
        scheduledAt: true,
        updatedAt: true,
        featured: true,
        category: { select: { name: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: TAKE,
    })
  ).map((a) => ({
    ...a,
    publishedAt: a.publishedAt?.toISOString() ?? null,
    scheduledAt: a.scheduledAt?.toISOString() ?? null,
    updatedAt: a.updatedAt.toISOString(),
  }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold text-brand-graphite">Artigos</h1>
        <a href="/admin/artigos/novo" className="btn-primary px-4 py-2 text-xs">
          Novo artigo
        </a>
      </div>
      <ArticlesList
        initialData={{ articles, total, page: 1, totalPages: Math.ceil(total / TAKE) }}
      />
    </div>
  );
}
