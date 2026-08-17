"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Checkbox, Input, Select, Textarea } from "@/components/ui/FormFields";

interface CategoryOpt {
  id: string;
  name: string;
  type: string;
}
interface AuthorOpt {
  id: string;
  name: string;
}
interface FaqOpt {
  id: string;
  question: string;
}
interface ArticleOpt {
  id: string;
  title: string;
}

export interface ArticleFormData {
  id?: string;
  title: string;
  subtitle: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  ogImage: string;
  keywords: string;
  metaTitle: string;
  metaDescription: string;
  status: string;
  categoryId: string;
  authorId?: string | null;
  featured: boolean;
  publishedAt?: string | null;
  scheduledAt?: string | null;
}

interface ArticleFormProps {
  article?: ArticleFormData;
  relatedIds?: string[];
  faqIds?: string[];
  categories: CategoryOpt[];
  authors: AuthorOpt[];
  faqs: FaqOpt[];
  allArticles: ArticleOpt[];
}

function seoScore(d: ArticleFormData): { label: string; tone: string } {
  let score = 0;
  if (d.title.length >= 30 && d.title.length <= 60) score += 2;
  if (d.metaDescription.length >= 120 && d.metaDescription.length <= 160) score += 2;
  if (d.keywords.trim().length > 0) score += 1;
  if (d.slug.length >= 3) score += 1;
  if (d.summary.trim().length >= 80) score += 1;
  if (d.coverImage.trim().length > 0) score += 1;

  if (score >= 7) return { label: "SEO avançado", tone: "bg-brand-deep text-white" };
  if (score >= 4) return { label: "SEO adequado", tone: "bg-brand-terracotta text-white" };
  return { label: "SEO básico", tone: "bg-brand-sand text-brand-gray" };
}

export function ArticleForm({ article, relatedIds = [], faqIds = [], categories, authors, faqs, allArticles }: ArticleFormProps) {
  const router = useRouter();
  const [data, setData] = useState<ArticleFormData>(
    article ?? {
      title: "",
      subtitle: "",
      slug: "",
      summary: "",
      content: "",
      coverImage: "",
      ogImage: "",
      keywords: "",
      metaTitle: "",
      metaDescription: "",
      status: "DRAFT",
      categoryId: "",
      authorId: null,
      featured: false,
      publishedAt: null,
      scheduledAt: null,
    }
  );
  const [selRelated, setSelRelated] = useState<string[]>(relatedIds);
  const [selFaqs, setSelFaqs] = useState<string[]>(faqIds);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const score = seoScore(data);

  function set<K extends keyof ArticleFormData>(key: K, value: ArticleFormData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function autoSlug(title: string) {
    if (!data.slug || data.slug === slugify(data.title)) {
      set("slug", slugify(title));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      ...data,
      authorId: data.authorId || null,
      featured: data.featured,
      publishedAt: data.status === "PUBLISHED" ? data.publishedAt || null : null,
      scheduledAt: data.status === "SCHEDULED" ? data.scheduledAt || null : null,
      relatedIds: selRelated,
      faqIds: selFaqs,
    };

    try {
      const res = data.id
        ? await fetch(`/api/admin/articles/${data.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/articles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        router.push("/admin/artigos");
        router.refresh();
      } else {
        setError(body.error ?? "Não foi possível salvar o artigo.");
      }
    } catch {
      setError("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <p role="alert" className="rounded-sm bg-brand-deep/10 p-4 text-sm text-brand-deep">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 rounded-sm bg-brand-sand/40 p-4">
        <span className="text-sm text-brand-gray">Indicador de SEO (auxiliar):</span>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${score.tone}`}>{score.label}</span>
      </div>

      {/* Conteúdo principal */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-5 lg:col-span-2">
          <Input
            label="Título"
            name="title"
            required
            value={data.title}
            onChange={(e) => {
              set("title", e.target.value);
              autoSlug(e.target.value);
            }}
          />
          <Input
            label="Subtítulo"
            name="subtitle"
            value={data.subtitle}
            onChange={(e) => set("subtitle", e.target.value)}
          />
          <Input
            label="Slug"
            name="slug"
            required
            hint="URL amigável do artigo — /artigos/[slug]"
            value={data.slug}
            onChange={(e) => set("slug", e.target.value)}
          />
          <Textarea
            label="Resumo"
            name="summary"
            rows={3}
            hint="Exibido nos cards de listagem (até ~500 caracteres)"
            value={data.summary}
            onChange={(e) => set("summary", e.target.value)}
          />
          <div className="space-y-1.5">
            <label htmlFor="content" className="label">
              Conteúdo (Markdown) <span className="text-brand-terracotta">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={18}
              className="input min-h-72 font-mono text-sm leading-relaxed"
              placeholder={"# Título da seção\n\nTexto do parágrafo. Use **negrito**, *itálico* e [links](https://exemplo.com).\n\n## Subtítulo\n\n- item de lista"}
              value={data.content}
              onChange={(e) => set("content", e.target.value)}
            />
            <p className="text-xs text-brand-gray">
              Formatação suportada: # títulos, **negrito**, *itálico*, listas, citações (&gt;) e links. Conteúdo
              será publicado apenas após revisão humana.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <Select
            label="Categoria"
            name="categoryId"
            required
            value={data.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
          >
            <option value="">Selecione…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <Select
            label="Autor"
            name="authorId"
            value={data.authorId ?? ""}
            onChange={(e) => set("authorId", e.target.value || null)}
          >
            <option value="">Sem autor</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </Select>
          <Select
            label="Status"
            name="status"
            required
            value={data.status}
            onChange={(e) => set("status", e.target.value)}
          >
            <option value="DRAFT">Rascunho</option>
            <option value="SCHEDULED">Programado</option>
            <option value="PUBLISHED">Publicado</option>
            <option value="ARCHIVED">Arquivado</option>
          </Select>
          {data.status === "SCHEDULED" && (
            <Input
              label="Data de publicação programada"
              name="scheduledAt"
              type="datetime-local"
              required
              value={data.scheduledAt?.slice(0, 16) ?? ""}
              onChange={(e) => set("scheduledAt", e.target.value ? new Date(e.target.value).toISOString() : null)}
            />
          )}
          <div className="flex items-center gap-3 rounded-sm border border-brand-sand p-4">
            <input
              id="featured"
              name="featured"
              type="checkbox"
              className="h-4 w-4 accent-brand-terracotta"
              checked={data.featured}
              onChange={(e) => set("featured", e.target.checked)}
            />
            <label htmlFor="featured" className="text-sm text-brand-graphite">
              Destacar artigo (aparece em &ldquo;Artigos em destaque&rdquo;)
            </label>
          </div>
        </div>

        {/* SEO */}
        <div className="space-y-5">
          <Input
            label="Imagem de capa (URL)"
            name="coverImage"
            value={data.coverImage}
            onChange={(e) => set("coverImage", e.target.value)}
          />
          <Input
            label="Imagem Open Graph (URL)"
            name="ogImage"
            hint="1200x630 recomendado"
            value={data.ogImage}
            onChange={(e) => set("ogImage", e.target.value)}
          />
          <Input
            label="Palavras-chave"
            name="keywords"
            value={data.keywords}
            onChange={(e) => set("keywords", e.target.value)}
          />
          <Input
            label="Meta title"
            name="metaTitle"
            hint="Ideal: 50–60 caracteres"
            value={data.metaTitle}
            onChange={(e) => set("metaTitle", e.target.value)}
          />
          <Textarea
            label="Meta description"
            name="metaDescription"
            rows={3}
            hint="Ideal: 120–160 caracteres"
            value={data.metaDescription}
            onChange={(e) => set("metaDescription", e.target.value)}
          />
        </div>

        {/* Relações */}
        <div className="space-y-5 lg:col-span-2">
          <div>
            <p className="label">Artigos relacionados</p>
            <select
              multiple
              className="input min-h-32"
              value={selRelated}
              onChange={(e) =>
                setSelRelated(Array.from(e.target.selectedOptions, (o) => o.value))
              }
            >
              {allArticles.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-brand-gray">Segure Ctrl (Cmd no Mac) para selecionar vários.</p>
          </div>
          <div>
            <p className="label">FAQ relacionada</p>
            <select
              multiple
              className="input min-h-32"
              value={selFaqs}
              onChange={(e) => setSelFaqs(Array.from(e.target.selectedOptions, (o) => o.value))}
            >
              {faqs.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.question}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? "Salvando…" : "SALVAR ARTIGO"}
        </button>
        <button type="button" onClick={() => router.push("/admin/artigos")} className="btn-secondary">
          Cancelar
        </button>
      </div>
    </form>
  );
}

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
