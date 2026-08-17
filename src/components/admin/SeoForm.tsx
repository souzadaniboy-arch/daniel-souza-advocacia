"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea } from "@/components/ui/FormFields";

export interface SeoData {
  siteTitle: string;
  siteDescription: string;
  ogImage: string;
  twitterHandle: string;
  robots: string;
}

interface SeoFormProps {
  initial: Partial<SeoData>;
}

export function SeoForm({ initial }: SeoFormProps) {
  const router = useRouter();
  const [data, setData] = useState<SeoData>({
    siteTitle: "",
    siteDescription: "",
    ogImage: "",
    twitterHandle: "",
    robots: "index,follow",
    ...initial,
  });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  function set<K extends keyof SeoData>(key: K, value: string) {
    setData((d) => ({ ...d, [key]: value }));
    setSaved(false);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setSaved(true);
        router.refresh();
      } else {
        setError(body.error ?? "Não foi possível salvar.");
      }
    } catch {
      setError("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {error && <p role="alert" className="rounded-sm bg-brand-deep/10 p-4 text-sm text-brand-deep">{error}</p>}
      {saved && <p className="rounded-sm bg-brand-deep/10 p-4 text-sm text-brand-deep">SEO salvo com sucesso.</p>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input label="Título do site (title)" required value={data.siteTitle} onChange={(e) => set("siteTitle", e.target.value)} />
        <Input label="Imagem Open Graph (URL, 1200x630)" value={data.ogImage} onChange={(e) => set("ogImage", e.target.value)} />
      </div>
      <Textarea
        label="Descrição do site (meta description)"
        required
        rows={3}
        hint={`Ideal: 120–160 caracteres. Atual: ${data.siteDescription.length}.`}
        value={data.siteDescription}
        onChange={(e) => set("siteDescription", e.target.value)}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input label="Twitter handle (sem @)" value={data.twitterHandle} onChange={(e) => set("twitterHandle", e.target.value)} />
        <div>
          <label htmlFor="seo-robots" className="label">Robots global</label>
          <select id="seo-robots" className="input" value={data.robots} onChange={(e) => set("robots", e.target.value)}>
            <option value="index,follow">index,follow</option>
            <option value="noindex,follow">noindex,follow</option>
            <option value="noindex,nofollow">noindex,nofollow</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? "Salvando…" : "SALVAR SEO"}
        </button>
      </div>
    </form>
  );
}
