"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input, Select, Textarea } from "@/components/ui/FormFields";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
  active: boolean;
  categoryId: string | null;
  category: { name: string } | null;
}
interface CategoryOpt {
  id: string;
  name: string;
}
interface FaqManagerProps {
  initial: FaqItem[];
  categories: CategoryOpt[];
}

interface FormState {
  id: string | null;
  question: string;
  answer: string;
  categoryId: string;
  order: number;
  active: boolean;
}

const emptyForm: FormState = { id: null, question: "", answer: "", categoryId: "", order: 0, active: true };

export function FaqManager({ initial, categories }: FaqManagerProps) {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FaqItem[]>(initial);
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const visible = filter
    ? faqs.filter((f) => (filter === "sem-categoria" ? !f.categoryId : f.categoryId === filter))
    : faqs;

  async function refresh() {
    const res = await fetch("/api/admin/faqs");
    if (res.ok) {
      const body = await res.json();
      setFaqs(body.faqs);
      router.refresh();
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = { ...form, categoryId: form.categoryId || null, order: Number(form.order) || 0 };
    const res = form.id
      ? await fetch(`/api/admin/faqs/${form.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      : await fetch("/api/admin/faqs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const body = await res.json().catch(() => ({}));
    setSaving(false);
    if (res.ok) {
      setForm(emptyForm);
      await refresh();
    } else {
      setError(body.error ?? "Não foi possível salvar.");
    }
  }

  async function toggleActive(f: FaqItem) {
    await fetch(`/api/admin/faqs/${f.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: f.question, answer: f.answer, categoryId: f.categoryId, order: f.order, active: !f.active }),
    });
    await refresh();
  }

  async function remove(f: FaqItem) {
    if (!confirm(`Excluir a pergunta "${f.question}"?`)) return;
    await fetch(`/api/admin/faqs/${f.id}`, { method: "DELETE" });
    await refresh();
  }

  return (
    <div className="space-y-8">
      {error && <p role="alert" className="rounded-sm bg-brand-deep/10 p-4 text-sm text-brand-deep">{error}</p>}

      {/* Formulário */}
      <form onSubmit={submit} className="rounded-sm border border-brand-sand bg-white p-5">
        <h2 className="mb-4 font-serif text-xl font-semibold text-brand-graphite">
          {form.id ? "Editar pergunta" : "Nova pergunta"}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Pergunta" required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
          <Select label="Categoria" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
            <option value="">Sem categoria</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </div>
        <div className="mt-4">
          <Textarea label="Resposta" required rows={5} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <label htmlFor="faq-order" className="text-sm text-brand-graphite">Ordem</label>
            <input id="faq-order" type="number" min={0} className="input w-24" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) || 0 })} />
          </div>
          <label className="flex items-center gap-2 text-sm text-brand-graphite">
            <input type="checkbox" className="h-4 w-4 accent-brand-terracotta" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            Ativa
          </label>
        </div>
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

      {/* Lista */}
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <label htmlFor="faq-filter" className="text-sm text-brand-gray">Filtrar:</label>
          <select id="faq-filter" className="input w-64" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">Todas as categorias</option>
            <option value="sem-categoria">Sem categoria</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <span className="text-sm text-brand-gray">{visible.length} pergunta(s)</span>
        </div>
        <ul className="space-y-3">
          {visible.map((f) => (
            <li key={f.id} className="rounded-sm border border-brand-sand bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-brand-graphite">{f.question}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-brand-gray">{f.answer}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-brand-sand/60 px-2 py-1 text-brand-gray">{f.category?.name ?? "Sem categoria"}</span>
                    <span className={`rounded-full px-2 py-1 ${f.active ? "bg-brand-deep/10 text-brand-deep" : "bg-brand-deep/10 text-brand-gray"}`}>
                      {f.active ? "Ativa" : "Inativa"}
                    </span>
                    <span className="rounded-full bg-brand-sand/60 px-2 py-1 text-brand-gray">ordem {f.order}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setForm({ id: f.id, question: f.question, answer: f.answer, categoryId: f.categoryId ?? "", order: f.order, active: f.active })} className="btn-secondary px-3 py-1.5 text-xs">
                    Editar
                  </button>
                  <button type="button" onClick={() => toggleActive(f)} className="btn-secondary px-3 py-1.5 text-xs">
                    {f.active ? "Desativar" : "Ativar"}
                  </button>
                  <button type="button" onClick={() => remove(f)} className="rounded-sm bg-brand-deep px-3 py-1.5 text-xs text-white hover:opacity-90">
                    Excluir
                  </button>
                </div>
              </div>
            </li>
          ))}
          {visible.length === 0 && (
            <li className="rounded-sm border border-brand-sand bg-white p-6 text-center text-sm text-brand-gray">
              Nenhuma pergunta encontrada.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
