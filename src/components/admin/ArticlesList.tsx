"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { formatDateShort } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Rascunho",
  SCHEDULED: "Programado",
  PUBLISHED: "Publicado",
  ARCHIVED: "Arquivado",
};

interface ArticleRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  publishedAt?: string | null;
  scheduledAt?: string | null;
  updatedAt: string;
  featured: boolean;
  category?: { name: string } | null;
}

interface ArticlesListProps {
  initialData: { articles: ArticleRow[]; total: number; page: number; totalPages: number };
}

export function ArticlesList({ initialData }: ArticlesListProps) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  async function load(filters: { status?: string; q?: string; page?: number }) {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.q) params.set("q", filters.q);
    if (filters.page && filters.page > 1) params.set("page", String(filters.page));
    const res = await fetch(`/api/admin/articles?${params.toString()}`);
    const body = await res.json();
    if (res.ok) setData(body);
    setLoading(false);
  }

  async function remove(article: ArticleRow) {
    if (!confirm(`Excluir o artigo "${article.title}"? Esta ação não pode ser desfeita.`)) return;
    const res = await fetch(`/api/admin/articles/${article.id}`, { method: "DELETE" });
    if (res.ok) await load({});
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {["", "DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => load({ status: status || undefined })}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                status === "" ? "bg-brand-terracotta text-white" : "border border-brand-sand bg-white text-brand-gray hover:text-brand-deep"
              }`}
            >
              {status === "" ? "Todos" : STATUS_LABEL[status]}
            </button>
          ))}
        </div>
        <Link href="/admin/artigos/novo" className="btn-primary px-4 py-2 text-xs">
          Novo artigo
        </Link>
      </div>

      {loading && <p className="text-sm text-brand-gray">Carregando…</p>}

      <div className="overflow-x-auto rounded-sm bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-brand-sand text-xs uppercase tracking-wider text-brand-gray">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-sand/60">
            {data.articles.map((article) => (
              <tr key={article.id}>
                <td className="px-4 py-3">
                  <Link href={`/admin/artigos/${article.id}`} className="font-medium text-brand-graphite hover:text-brand-deep">
                    {article.title}
                  </Link>
                  {article.featured && (
                    <span className="ml-2 rounded-full bg-brand-sand px-2 py-0.5 text-xs text-brand-gray">destaque</span>
                  )}
                </td>
                <td className="px-4 py-3 text-brand-gray">{article.category?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-brand-sand/60 px-2.5 py-1 text-xs font-medium text-brand-graphite">
                    {STATUS_LABEL[article.status] ?? article.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-brand-gray">
                  {formatDateShort(article.publishedAt ?? article.scheduledAt ?? article.updatedAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link href={`/admin/artigos/${article.id}`} className="text-brand-terracotta hover:text-brand-deep">
                      Editar
                    </Link>
                    <button type="button" onClick={() => remove(article)} className="text-brand-deep hover:underline">
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.articles.length === 0 && (
          <p className="p-6 text-center text-brand-gray">Nenhum artigo encontrado.</p>
        )}
      </div>

      {data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 text-sm">
          {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => load({ page: p })}
              className={`h-9 w-9 rounded-sm ${p === data.page ? "bg-brand-terracotta text-white" : "bg-white text-brand-graphite hover:bg-brand-sand"}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
