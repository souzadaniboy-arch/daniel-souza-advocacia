"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface MessageItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  consent: boolean;
  status: string;
  createdAt: string;
}

interface MessagesManagerProps {
  initial: { messages: MessageItem[]; total: number; page: number; totalPages: number };
}

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  NEW: { label: "Nova", cls: "bg-brand-terracotta/10 text-brand-terracotta" },
  READ: { label: "Lida", cls: "bg-brand-sand text-brand-gray" },
  ARCHIVED: { label: "Arquivada", cls: "bg-brand-deep/10 text-brand-deep" },
};

export function MessagesManager({ initial }: MessagesManagerProps) {
  const router = useRouter();
  const [state, setState] = useState(initial);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  async function load(page = 1, st = status, q = search) {
    const params = new URLSearchParams();
    if (st) params.set("status", st);
    if (q) params.set("search", q);
    params.set("page", String(page));
    const res = await fetch(`/api/admin/messages?${params}`);
    if (res.ok) {
      setState(await res.json());
      router.refresh();
    }
  }

  async function changeStatus(id: string, next: string) {
    await fetch(`/api/admin/messages/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: next }) });
    await load(state.page, status, search);
  }

  async function remove(id: string) {
    if (!confirm("Excluir esta mensagem?")) return;
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    await load(state.page, status, search);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <select className="input w-48" value={status} onChange={(e) => { setStatus(e.target.value); load(1, e.target.value, search); }}>
          <option value="">Todos os status</option>
          <option value="NEW">Novas</option>
          <option value="READ">Lidas</option>
          <option value="ARCHIVED">Arquivadas</option>
        </select>
        <input
          className="input w-64"
          placeholder="Buscar nome, e-mail ou conteúdo…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") load(1, status, search); }}
        />
        <button type="button" onClick={() => load(1, status, search)} className="btn-secondary px-4 py-2 text-xs">
          Buscar
        </button>
        <span className="ml-auto text-sm text-brand-gray">{state.total} mensagem(ns)</span>
      </div>

      <ul className="space-y-3">
        {state.messages.map((m) => {
          const st = STATUS_LABEL[m.status] ?? STATUS_LABEL.NEW;
          const isOpen = openId === m.id;
          return (
            <li key={m.id} className="rounded-sm border border-brand-sand bg-white p-4">
              <button type="button" className="w-full text-left" onClick={() => setOpenId(isOpen ? null : m.id)}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${m.status === "NEW" ? "bg-brand-terracotta" : "bg-brand-sand"}`} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-brand-graphite">
                      {m.name} <span className="ml-2 text-sm font-normal text-brand-gray">{m.email}</span>
                    </p>
                    {m.subject && <p className="truncate text-sm text-brand-gray">{m.subject}</p>}
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs ${st.cls}`}>{st.label}</span>
                  <span className="text-xs text-brand-gray">{new Date(m.createdAt).toLocaleString("pt-BR")}</span>
                </div>
              </button>
              {isOpen && (
                <div className="mt-3 border-t border-brand-sand pt-3">
                  {m.phone && <p className="mb-1 text-sm text-brand-gray"><strong>Telefone:</strong> {m.phone}</p>}
                  <p className="whitespace-pre-wrap text-sm text-brand-graphite">{m.message}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {m.status !== "READ" && (
                      <button type="button" onClick={() => changeStatus(m.id, "READ")} className="btn-secondary px-3 py-1.5 text-xs">
                        Marcar como lida
                      </button>
                    )}
                    {m.status !== "ARCHIVED" && (
                      <button type="button" onClick={() => changeStatus(m.id, "ARCHIVED")} className="btn-secondary px-3 py-1.5 text-xs">
                        Arquivar
                      </button>
                    )}
                    <a href={`mailto:${m.email}`} className="btn-primary px-3 py-1.5 text-xs">
                      Responder
                    </a>
                    <button type="button" onClick={() => remove(m.id)} className="rounded-sm bg-brand-deep px-3 py-1.5 text-xs text-white hover:opacity-90">
                      Excluir
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
        {state.messages.length === 0 && (
          <li className="rounded-sm border border-brand-sand bg-white p-6 text-center text-sm text-brand-gray">
            Nenhuma mensagem encontrada.
          </li>
        )}
      </ul>

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
