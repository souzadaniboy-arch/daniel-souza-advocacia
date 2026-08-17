"use client";

import { useState } from "react";

interface LogItem {
  id: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  details: string | null;
  ip: string | null;
  createdAt: string;
  user: { name: string; email: string } | null;
}

interface AuditLogsProps {
  initial: { logs: LogItem[]; total: number; page: number; totalPages: number };
  actions: string[];
}

export function AuditLogs({ initial, actions }: AuditLogsProps) {
  const [state, setState] = useState(initial);
  const [action, setAction] = useState("");

  async function load(page = 1, a = action) {
    const params = new URLSearchParams();
    if (a) params.set("action", a);
    params.set("page", String(page));
    const res = await fetch(`/api/admin/audit?${params}`);
    if (res.ok) setState(await res.json());
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <select className="input w-64" value={action} onChange={(e) => { setAction(e.target.value); load(1, e.target.value); }}>
          <option value="">Todas as ações</option>
          {actions.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <span className="ml-auto text-sm text-brand-gray">{state.total} registro(s)</span>
      </div>

      <div className="overflow-x-auto rounded-sm border border-brand-sand bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-brand-sand text-xs uppercase tracking-wider text-brand-gray">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Usuário</th>
              <th className="px-4 py-3">Ação</th>
              <th className="px-4 py-3">Entidade</th>
              <th className="px-4 py-3">IP</th>
            </tr>
          </thead>
          <tbody>
            {state.logs.map((l) => (
              <tr key={l.id} className="border-b border-brand-sand last:border-0">
                <td className="whitespace-nowrap px-4 py-3 text-xs text-brand-gray">{new Date(l.createdAt).toLocaleString("pt-BR")}</td>
                <td className="px-4 py-3 text-brand-graphite">{l.user ? l.user.name : "—"}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-brand-sand/60 px-2 py-1 font-mono text-xs text-brand-deep">{l.action}</span>
                </td>
                <td className="px-4 py-3 text-xs text-brand-gray">
                  {l.entityType ? `${l.entityType}${l.entityId ? ` · ${l.entityId}` : ""}` : "—"}
                  {l.details && <div className="text-brand-gray/80">{l.details}</div>}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-brand-gray">{l.ip ?? "—"}</td>
              </tr>
            ))}
            {state.logs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-brand-gray">
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {state.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 text-sm">
          <button type="button" disabled={state.page <= 1} onClick={() => load(state.page - 1)} className="btn-secondary disabled:opacity-40">
            Anterior
          </button>
          <span className="text-brand-gray">Página {state.page} de {state.totalPages}</span>
          <button type="button" disabled={state.page >= state.totalPages} onClick={() => load(state.page + 1)} className="btn-secondary disabled:opacity-40">
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}
