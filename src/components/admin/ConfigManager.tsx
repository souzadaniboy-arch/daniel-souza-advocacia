"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/FormFields";

interface ConfigItem {
  key: string;
  value: string | null;
  type: string;
  updatedAt: string;
}

interface ConfigManagerProps {
  initial: ConfigItem[];
  prefixes: { value: string; label: string }[];
  defaultPrefix?: string;
}

export function ConfigManager({ initial, prefixes, defaultPrefix = "" }: ConfigManagerProps) {
  const router = useRouter();
  const [items, setItems] = useState<ConfigItem[]>(initial);
  const [prefix, setPrefix] = useState(defaultPrefix);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load(p = prefix) {
    const params = new URLSearchParams();
    if (p) params.set("prefix", p);
    const res = await fetch(`/api/admin/config?${params}`);
    if (res.ok) {
      const body = await res.json();
      setItems(body.configs);
      router.refresh();
    }
  }

  async function saveItem(key: string, value: string) {
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    const body = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(body.error ?? "Não foi possível salvar.");
      return;
    }
    setEditingKey(null);
    await load();
  }

  async function addItem(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: newKey, value: newValue }),
    });
    const body = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(body.error ?? "Não foi possível salvar.");
      return;
    }
    setNewKey("");
    setNewValue("");
    await load();
  }

  return (
    <div className="space-y-6">
      {error && <p role="alert" className="rounded-sm bg-brand-deep/10 p-4 text-sm text-brand-deep">{error}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="config-prefix" className="text-sm text-brand-gray">Filtrar:</label>
        <select
          id="config-prefix"
          className="input w-64"
          value={prefix}
          onChange={(e) => {
            setPrefix(e.target.value);
            load(e.target.value);
          }}
        >
          <option value="">Todos</option>
          {prefixes.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
        <span className="text-sm text-brand-gray">{items.length} configuração(ões)</span>
      </div>

      <div className="overflow-x-auto rounded-sm border border-brand-sand bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-brand-sand text-xs uppercase tracking-wider text-brand-gray">
            <tr>
              <th className="px-4 py-3">Chave</th>
              <th className="px-4 py-3">Valor</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.key} className="border-b border-brand-sand last:border-0">
                <td className="px-4 py-3 align-top">
                  <code className="text-xs text-brand-deep">{c.key}</code>
                  {c.type === "json" && (
                    <span className="ml-2 rounded-full bg-brand-terracotta/10 px-2 py-0.5 text-[10px] uppercase text-brand-terracotta">JSON</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingKey === c.key ? (
                    <textarea
                      className="input min-h-24 font-mono text-xs"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                    />
                  ) : (
                    <pre className="max-h-40 overflow-auto whitespace-pre-wrap font-mono text-xs text-brand-graphite">{c.value ?? ""}</pre>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {editingKey === c.key ? (
                      <>
                        <button type="button" onClick={() => saveItem(c.key, editingValue)} disabled={saving} className="btn-primary px-3 py-1.5 text-xs disabled:opacity-60">
                          Salvar
                        </button>
                        <button type="button" onClick={() => setEditingKey(null)} className="btn-secondary px-3 py-1.5 text-xs">
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingKey(c.key);
                          setEditingValue(c.value ?? "");
                        }}
                        className="btn-secondary px-3 py-1.5 text-xs"
                      >
                        Editar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-brand-gray">
                  Nenhuma configuração encontrada para este filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <form onSubmit={addItem} className="rounded-sm border border-brand-sand bg-white p-5">
        <h2 className="mb-4 font-serif text-xl font-semibold text-brand-graphite">Nova configuração</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Chave" required placeholder="ex.: cookies.bannerText" value={newKey} onChange={(e) => setNewKey(e.target.value)} />
        </div>
        <div className="mt-4">
          <label htmlFor="config-new-value" className="label">Valor</label>
          <textarea id="config-new-value" required rows={4} className="input font-mono text-sm" value={newValue} onChange={(e) => setNewValue(e.target.value)} />
        </div>
        <div className="mt-4">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? "Salvando…" : "ADICIONAR"}
          </button>
        </div>
      </form>
    </div>
  );
}
