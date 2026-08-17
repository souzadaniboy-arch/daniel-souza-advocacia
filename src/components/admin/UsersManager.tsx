"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/FormFields";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

interface UsersManagerProps {
  initial: UserItem[];
  currentUserId: string;
}

interface FormState {
  id: string | null;
  name: string;
  email: string;
  role: string;
  active: boolean;
  password: string;
}

const emptyForm: FormState = { id: null, name: "", email: "", role: "EDITOR", active: true, password: "" };

export function UsersManager({ initial, currentUserId }: UsersManagerProps) {
  const router = useRouter();
  const [users, setUsers] = useState<UserItem[]>(initial);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function refresh() {
    const res = await fetch("/api/admin/users");
    if (res.ok) {
      const body = await res.json();
      setUsers(body.users);
      router.refresh();
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = { name: form.name, email: form.email, role: form.role, active: form.active, ...(form.password ? { password: form.password } : {}) };
    const res = form.id
      ? await fetch(`/api/admin/users/${form.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      : await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const body = await res.json().catch(() => ({}));
    setSaving(false);
    if (res.ok) {
      setForm(emptyForm);
      await refresh();
    } else {
      setError(body.error ?? "Não foi possível salvar.");
    }
  }

  async function remove(u: UserItem) {
    if (!confirm(`Excluir o usuário "${u.email}"?`)) return;
    const res = await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(body.error ?? "Não foi possível excluir.");
      return;
    }
    await refresh();
  }

  return (
    <div className="space-y-8">
      {error && <p role="alert" className="rounded-sm bg-brand-deep/10 p-4 text-sm text-brand-deep">{error}</p>}

      <form onSubmit={submit} className="rounded-sm border border-brand-sand bg-white p-5">
        <h2 className="mb-4 font-serif text-xl font-semibold text-brand-graphite">
          {form.id ? "Editar usuário" : "Novo usuário"}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Nome" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="E-mail" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <div>
            <label htmlFor="user-role" className="label">Perfil</label>
            <select id="user-role" className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="EDITOR">Editor</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
          <Input
            label={form.id ? "Nova senha (deixe vazio para manter)" : "Senha"}
            type="password"
            required={!form.id}
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-brand-graphite">
          <input type="checkbox" className="h-4 w-4 accent-brand-terracotta" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
          Usuário ativo
        </label>
        <div className="mt-5 flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? "Salvando…" : form.id ? "SALVAR ALTERAÇÕES" : "ADICIONAR"}
          </button>
          {form.id && (
            <button type="button" onClick={() => setForm(emptyForm)} className="btn-secondary">
              Cancelar edição
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto rounded-sm border border-brand-sand bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-brand-sand text-xs uppercase tracking-wider text-brand-gray">
            <tr>
              <th className="px-4 py-3">Usuário</th>
              <th className="px-4 py-3">Perfil</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Último acesso</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-brand-sand last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-brand-graphite">{u.name} {u.id === currentUserId && <span className="text-xs text-brand-terracotta">(você)</span>}</p>
                  <p className="text-xs text-brand-gray">{u.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-brand-sand/60 px-2 py-1 text-xs">{u.role === "ADMIN" ? "Administrador" : "Editor"}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs ${u.active ? "bg-brand-deep/10 text-brand-deep" : "bg-brand-sand text-brand-gray"}`}>
                    {u.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-brand-gray">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString("pt-BR") : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setForm({ id: u.id, name: u.name, email: u.email, role: u.role, active: u.active, password: "" })} className="btn-secondary px-3 py-1.5 text-xs">
                      Editar
                    </button>
                    {u.id !== currentUserId && (
                      <button type="button" onClick={() => remove(u)} className="rounded-sm bg-brand-deep px-3 py-1.5 text-xs text-white hover:opacity-90">
                        Excluir
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
