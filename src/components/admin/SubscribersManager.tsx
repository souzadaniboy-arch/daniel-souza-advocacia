"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SubscriberItem {
  id: string;
  name: string;
  email: string;
  status: string;
  consent: boolean;
  consentAt: string | null;
  unsubscribedAt: string | null;
  createdAt: string;
}

interface SubscribersManagerProps {
  initial: { subscribers: SubscriberItem[]; total: number; page: number; totalPages: number };
}

export function SubscribersManager({ initial }: SubscribersManagerProps) {
  const router = useRouter();
  const [state, setState] = useState(initial);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  async function load(page = 1, st = status, q = search) {
    const params = new URLSearchParams();
    if (st) params.set("status", st);
    if (q) params.set("search", q);
    params.set("page", String(page));
    const res = await fetch(`/api/admin/subscribers?${params}`);
    if (res.ok) {
      setState(await res.json());
      router.refresh();
    }
  }

  async function remove(id: string, email: string) {
    if (!confirm(`Remover o inscrito "${email}"?`)) return;
    await fetch(`/api/admin/subscribers/${id}`, { method: "DELETE" });
    await load(state.page, status, search);
  }

  function exportCsv() {
    const rows = state.subscribers.map((s) => [s.name, s.email, s.status, s.consentAt ?? "", s.createdAt]);
    const csv = [["nome", "email", "status", "data_consentimento", "data_inscricao"], ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "inscritos-newsletter.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <select className="input w-48" value={status} onChange={(e) => { setStatus(e.target.value); load(1, e.target.value, search); }}>
          <option value="">Todos os status</option>
          <option value="ACTIVE">Ativos</option>
          <option value="UNSUBSCRIBED">Descadastrados</option>
        </select>
        <input
          className="input w-64"
          placeholder="Buscar nome ou e-mail…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") load(1, status, search); }}
        />
        <button type="button" onClick={() => load(1, status, search)} className="btn-secondary px-4 py-2 text-xs">
          Buscar
        </button>
        <button type="button" onClick={exportCsv} className="btn-secondary px-4 py-2 text-xs">
          Exportar CSV
        </button>
        <span className="ml-auto text-sm text-brand-gray">{state.total} inscrito(s)</span>
      </div>

      <div className="overflow-x-auto rounded-sm border border-brand-sand bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-brand-sand text-xs uppercase tracking-wider text-brand-gray">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Consentimento</th>
              <th className="px-4 py-3">Inscrição</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {state.subscribers.map((s) => (
              <tr key={s.id} className="border-b border-brand-sand last:border-0">
                <td className="px-4 py-3 font-medium text-brand-graphite">{s.name}</td>
                <td className="px-4 py-3 text-brand-gray">{s.email}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs ${s.status === "ACTIVE" ? "bg-brand-deep/10 text-brand-deep" : "bg-brand-sand text-brand-gray"}`}>
                    {s.status === "ACTIVE" ? "Ativo" : "Descadastrado"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-brand-gray">{s.consent ? (s.consentAt ? new Date(s.consentAt).toLocaleString("pt-BR") : "Sim") : "Não"}</td>
                <td className="px-4 py-3 text-xs text-brand-gray">{new Date(s.createdAt).toLocaleString("pt-BR")}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <button type="button" onClick={() => remove(s.id, s.email)} className="rounded-sm bg-brand-deep px-3 py-1.5 text-xs text-white hover:opacity-90">
                      Remover
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {state.subscribers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-brand-gray">
                  Nenhum inscrito encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {state.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 text-sm">
          <button type="button" disabled={state.page <= 1} onClick={() => load(state.page - 1, status, search)} className="btn-secondary disabled:opacity-40">
            Anterior
          </button>
          <span className="text-brand-gray">
            Página {state.page} de {state.totalPages}
          </span>
          <button type="button" disabled={state.page >= state.totalPages} onClick={() => load(state.page + 1, status, search)} className="btn-secondary disabled:opacity-40">
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}
