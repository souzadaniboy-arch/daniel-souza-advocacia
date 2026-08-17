"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input, Select, Textarea } from "@/components/ui/FormFields";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  whatsappMessage: string | null;
  type: string;
  order: number;
  active: boolean;
  _count: { articles: number; faqs: number };
}

interface CategoryManagerProps {
  initial: CategoryItem[];
}

interface FormState {
  id: string | null;
  name: string;
  slug: string;
  description: string;
  whatsappMessage: string;
  type: string;
  order: number;
  active: boolean;
}

const emptyForm: FormState = { id: null, name: "", slug: "", description: "", whatsappMessage: "", type: "AREA", order: 0, active: true };

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "");
}

export function CategoryManager({ initial }: CategoryManagerProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryItem[]>(initial);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function refresh() {
    const res = await fetch("/api/admin/categories");
    if (res.ok) {
      const body = await res.json();
      setCategories(body.categories);
      router.refresh();
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
      description: form.description || "",
      whatsappMessage: form.whatsappMessage || "",
      order: Number(form.order) || 0,
    };
    const res = form.id
      ? await fetch(`/api/admin/categories/${form.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      : await fetch("/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const body = await res.json().catch(() => ({}));
    setSaving(false);
    if (res.ok) {
      setForm(emptyForm);
      await refresh();
    } else {
      setError(body.error ?? "Não foi possível salvar.");
    }
  }

  async function remove(c: CategoryItem) {
    if (!confirm(`Excluir a categoria "${c.name}"?`)) return;
    const res = await fetch(`/api/admin/categories/${c.id}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      alert(body.error ?? "Não foi possível excluir.");
      return;
    }
    await refresh();
  }

  return (
    <div className="space-y-8">
      {error && <p role="alert" className="rounded-sm bg-brand-deep/10 p-4 text-sm text-brand-deep">{error}</p>}

      <form onSubmit={submit} className="rounded-sm border border-brand-sand bg-white p-5">
        <h2 className="mb-4 font-serif text-xl font-semibold text-brand-graphite">
          {form.id ? "Editar categoria" : "Nova categoria"}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Nome" required value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); if (!form.slug) setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) }); }} />
          <Input label="Slug" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <Select label="Tipo" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="AREA">Área de atuação (página própria)</option>
            <option value="ARTICLE">Categoria de artigos</option>
          </Select>
          <Input label="Ordem" type="number" min={0} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) || 0 })} />
        </div>
        <div className="mt-4">
          <Textarea label="Descrição" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="mt-4">
          <Textarea
            label="Mensagem do WhatsApp (área de atuação)"
            rows={2}
            hint="Usada pelo botão flutuante quando o visitante está nesta área."
            value={form.whatsappMessage}
            onChange={(e) => setForm({ ...form, whatsappMessage: e.target.value })}
          />
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-brand-graphite">
          <input type="checkbox" className="h-4 w-4 accent-brand-terracotta" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
          Ativa (visível no site)
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
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Artigos</th>
              <th className="px-4 py-3">FAQs</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-brand-sand last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-brand-graphite">{c.name}</p>
                  <p className="text-xs text-brand-gray">/{c.slug}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-brand-sand/60 px-2 py-1 text-xs">{c.type === "AREA" ? "Área" : "Artigos"}</span>
                </td>
                <td className="px-4 py-3 text-brand-gray">{c._count.articles}</td>
                <td className="px-4 py-3 text-brand-gray">{c._count.faqs}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs ${c.active ? "bg-brand-deep/10 text-brand-deep" : "bg-brand-sand text-brand-gray"}`}>
                    {c.active ? "Ativa" : "Inativa"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setForm({ id: c.id, name: c.name, slug: c.slug, description: c.description ?? "", whatsappMessage: c.whatsappMessage ?? "", type: c.type, order: c.order, active: c.active })} className="btn-secondary px-3 py-1.5 text-xs">
                      Editar
                    </button>
                    <button type="button" onClick={() => remove(c)} className="rounded-sm bg-brand-deep px-3 py-1.5 text-xs text-white hover:opacity-90">
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-brand-gray">
                  Nenhuma categoria cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
