"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input, Select, Textarea } from "@/components/ui/FormFields";

interface ArticleOpt {
  id: string;
  title: string;
}

export interface NewsletterFormData {
  id?: string;
  subject: string;
  title: string;
  intro: string;
  content: string;
  ctaLabel: string;
  ctaUrl: string;
  status: string;
  scheduledAt?: string | null;
}

interface NewsletterFormProps {
  newsletter?: NewsletterFormData;
  articleIds?: string[];
  articles: ArticleOpt[];
}

export function NewsletterForm({ newsletter, articleIds = [], articles }: NewsletterFormProps) {
  const router = useRouter();
  const [data, setData] = useState<NewsletterFormData>(
    newsletter ?? { subject: "", title: "", intro: "", content: "", ctaLabel: "", ctaUrl: "", status: "DRAFT", scheduledAt: null }
  );
  const [selArticles, setSelArticles] = useState<string[]>(articleIds);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set<K extends keyof NewsletterFormData>(key: K, value: NewsletterFormData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = { ...data, articleIds: selArticles, scheduledAt: data.scheduledAt || null };

    try {
      const res = data.id
        ? await fetch(`/api/admin/newsletters/${data.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/newsletters", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        router.push("/admin/newsletters");
        router.refresh();
      } else {
        setError(body.error ?? "Não foi possível salvar a newsletter.");
      }
    } catch {
      setError("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p role="alert" className="rounded-sm bg-brand-deep/10 p-4 text-sm text-brand-deep">{error}</p>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input label="Assunto (e-mail)" required value={data.subject} onChange={(e) => set("subject", e.target.value)} />
        <Input label="Título interno" required value={data.title} onChange={(e) => set("title", e.target.value)} />
      </div>
      <Textarea label="Introdução (trecho de pré-visualização)" rows={3} value={data.intro} onChange={(e) => set("intro", e.target.value)} />
      <div className="space-y-1.5">
        <label htmlFor="newsletter-content" className="label">
          Conteúdo (Markdown) <span className="text-brand-terracotta">*</span>
        </label>
        <textarea
          id="newsletter-content"
          required
          rows={14}
          className="input min-h-56 font-mono text-sm leading-relaxed"
          value={data.content}
          onChange={(e) => set("content", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input label="Texto do botão de ação" value={data.ctaLabel} onChange={(e) => set("ctaLabel", e.target.value)} />
        <Input label="URL do botão de ação" value={data.ctaUrl} onChange={(e) => set("ctaUrl", e.target.value)} />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Select label="Status" value={data.status} onChange={(e) => set("status", e.target.value)}>
          <option value="DRAFT">Rascunho</option>
          <option value="SCHEDULED">Programada</option>
          <option value="SENT">Enviada</option>
        </Select>
        {data.status === "SCHEDULED" && (
          <Input
            label="Agendamento"
            type="datetime-local"
            required
            value={data.scheduledAt?.slice(0, 16) ?? ""}
            onChange={(e) => set("scheduledAt", e.target.value ? new Date(e.target.value).toISOString() : null)}
          />
        )}
      </div>
      <div>
        <p className="label">Artigos inclusos</p>
        <select
          multiple
          className="input min-h-32"
          value={selArticles}
          onChange={(e) => setSelArticles(Array.from(e.target.selectedOptions, (o) => o.value))}
        >
          {articles.map((a) => (
            <option key={a.id} value={a.id}>{a.title}</option>
          ))}
        </select>
        <p className="mt-1 text-xs text-brand-gray">Segure Ctrl (Cmd no Mac) para selecionar vários.</p>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? "Salvando…" : "SALVAR NEWSLETTER"}
        </button>
        <button type="button" onClick={() => router.push("/admin/newsletters")} className="btn-secondary">
          Cancelar
        </button>
      </div>
    </form>
  );
}
