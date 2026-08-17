"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NewsletterItem {
  id: string;
  subject: string;
  title: string;
  status: string;
  scheduledAt: string | null;
  sentAt: string | null;
  updatedAt: string;
  _count: { articles: number };
}

interface NewsletterListProps {
  initial: NewsletterItem[];
}

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  DRAFT: { label: "Rascunho", cls: "bg-brand-sand text-brand-gray" },
  SCHEDULED: { label: "Programada", cls: "bg-brand-terracotta/10 text-brand-terracotta" },
  SENT: { label: "Enviada", cls: "bg-brand-deep/10 text-brand-deep" },
};

export function NewsletterList({ initial }: NewsletterListProps) {
  const router = useRouter();
  const [items, setItems] = useState(initial);

  async function refresh() {
    const res = await fetch("/api/admin/newsletters");
    if (res.ok) {
      const body = await res.json();
      setItems(body.newsletters);
      router.refresh();
    }
  }

  async function remove(n: NewsletterItem) {
    if (!confirm(`Excluir a newsletter "${n.subject}"?`)) return;
    await fetch(`/api/admin/newsletters/${n.id}`, { method: "DELETE" });
    await refresh();
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-brand-sand bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-brand-sand text-xs uppercase tracking-wider text-brand-gray">
          <tr>
            <th className="px-4 py-3">Newsletter</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Artigos</th>
            <th className="px-4 py-3">Atualização</th>
            <th className="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((n) => {
            const st = STATUS_LABEL[n.status] ?? STATUS_LABEL.DRAFT;
            return (
              <tr key={n.id} className="border-b border-brand-sand last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-brand-graphite">{n.subject}</p>
                  <p className="text-xs text-brand-gray">{n.title}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs ${st.cls}`}>{st.label}</span>
                </td>
                <td className="px-4 py-3 text-brand-gray">{n._count.articles}</td>
                <td className="px-4 py-3 text-xs text-brand-gray">{new Date(n.updatedAt).toLocaleString("pt-BR")}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/newsletters/${n.id}`} className="btn-secondary px-3 py-1.5 text-xs">
                      Editar
                    </Link>
                    <button type="button" onClick={() => remove(n)} className="rounded-sm bg-brand-deep px-3 py-1.5 text-xs text-white hover:opacity-90">
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {items.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-brand-gray">
                Nenhuma newsletter cadastrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
