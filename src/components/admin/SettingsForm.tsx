"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea } from "@/components/ui/FormFields";

export interface SettingsData {
  name: string;
  shortName: string;
  tagline: string;
  logo: string;
  favicon: string;
  oab: string;
  phone: string;
  whatsapp: string;
  whatsappMessage: string;
  instagram: string;
  instagramProfile: string;
  email: string;
  address: string;
  hours: string;
  heroTitle: string;
  heroSubtitle: string;
  heroText: string;
  institutionalPhrase: string;
  lawyerName: string;
  lawyerPhoto: string;
  lawyerBio: string;
  lawyerFormation: string;
  lawyerSpecializations: string;
  lawyerExperience: string;
  lawyerTrajectory: string;
}

interface SettingsFormProps {
  initial: Partial<SettingsData>;
}

export function SettingsForm({ initial }: SettingsFormProps) {
  const router = useRouter();
  const [data, setData] = useState<SettingsData>({
    name: "",
    shortName: "",
    tagline: "",
    logo: "",
    favicon: "",
    oab: "",
    phone: "",
    whatsapp: "",
    whatsappMessage: "",
    instagram: "",
    instagramProfile: "",
    email: "",
    address: "",
    hours: "",
    heroTitle: "",
    heroSubtitle: "",
    heroText: "",
    institutionalPhrase: "",
    lawyerName: "",
    lawyerPhoto: "",
    lawyerBio: "",
    lawyerFormation: "",
    lawyerSpecializations: "",
    lawyerExperience: "",
    lawyerTrajectory: "",
    ...initial,
  });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  function set<K extends keyof SettingsData>(key: K, value: string) {
    setData((d) => ({ ...d, [key]: value }));
    setSaved(false);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
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
    <form onSubmit={submit} className="space-y-8">
      {error && <p role="alert" className="rounded-sm bg-brand-deep/10 p-4 text-sm text-brand-deep">{error}</p>}
      {saved && <p className="rounded-sm bg-brand-deep/10 p-4 text-sm text-brand-deep">Configurações salvas com sucesso.</p>}

      <section>
        <h2 className="mb-4 font-serif text-xl font-semibold text-brand-graphite">Identidade</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Nome do escritório" required value={data.name} onChange={(e) => set("name", e.target.value)} />
          <Input label="Nome curto (menu/rodapé)" required value={data.shortName} onChange={(e) => set("shortName", e.target.value)} />
          <Input label="Tagline" required value={data.tagline} onChange={(e) => set("tagline", e.target.value)} />
          <Input label="OAB" value={data.oab} onChange={(e) => set("oab", e.target.value)} />
          <Input
            label="Logo (URL da imagem, ex.: /logo.png)"
            placeholder="/logo.png"
            value={data.logo}
            onChange={(e) => set("logo", e.target.value)}
          />
          <Input
            label="Favicon (URL da imagem 32x32 ou 64x64)"
            placeholder="/favicon.png"
            value={data.favicon}
            onChange={(e) => set("favicon", e.target.value)}
          />
        </div>
        {data.logo && (
          <div className="mt-4 flex items-center gap-3 rounded-sm border border-brand-sand bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.logo} alt="Prévia do logo" className="h-12 w-auto max-w-40 object-contain" />
            <span className="text-xs text-brand-gray">Prévia do logo</span>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-serif text-xl font-semibold text-brand-graphite">Contato</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Telefone" value={data.phone} onChange={(e) => set("phone", e.target.value)} />
          <Input label="WhatsApp (somente números, ex.: 5511999998888)" value={data.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
          <Input label="E-mail" type="email" value={data.email} onChange={(e) => set("email", e.target.value)} />
          <Input label="Instagram (URL completa)" value={data.instagram} onChange={(e) => set("instagram", e.target.value)} />
          <Input label="Usuário do Instagram (sem @)" value={data.instagramProfile} onChange={(e) => set("instagramProfile", e.target.value)} />
          <Input label="Endereço" value={data.address} onChange={(e) => set("address", e.target.value)} />
          <Input label="Horário de atendimento" value={data.hours} onChange={(e) => set("hours", e.target.value)} />
        </div>
        <div className="mt-4">
          <Textarea label="Mensagem padrão do WhatsApp (botão flutuante)" rows={2} value={data.whatsappMessage} onChange={(e) => set("whatsappMessage", e.target.value)} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-serif text-xl font-semibold text-brand-graphite">Página inicial</h2>
        <div className="space-y-4">
          <Input label="Título do herói" required value={data.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} />
          <Input label="Subtítulo do herói" required value={data.heroSubtitle} onChange={(e) => set("heroSubtitle", e.target.value)} />
          <Textarea label="Texto do herói" rows={3} value={data.heroText} onChange={(e) => set("heroText", e.target.value)} />
          <Textarea label="Frase institucional (seção de destaque)" rows={3} value={data.institutionalPhrase} onChange={(e) => set("institutionalPhrase", e.target.value)} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-serif text-xl font-semibold text-brand-graphite">Advogado(a) — página &ldquo;Quem somos&rdquo;</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Nome completo" value={data.lawyerName} onChange={(e) => set("lawyerName", e.target.value)} />
          <Input label="Foto (URL)" value={data.lawyerPhoto} onChange={(e) => set("lawyerPhoto", e.target.value)} />
        </div>
        <div className="mt-4 space-y-4">
          <Textarea label="Biografia" rows={4} value={data.lawyerBio} onChange={(e) => set("lawyerBio", e.target.value)} />
          <Textarea label="Formação (uma por linha)" rows={4} value={data.lawyerFormation} onChange={(e) => set("lawyerFormation", e.target.value)} />
          <Textarea label="Especializações (uma por linha)" rows={4} value={data.lawyerSpecializations} onChange={(e) => set("lawyerSpecializations", e.target.value)} />
          <Textarea label="Experiência" rows={4} value={data.lawyerExperience} onChange={(e) => set("lawyerExperience", e.target.value)} />
          <Textarea label="Trajetória" rows={4} value={data.lawyerTrajectory} onChange={(e) => set("lawyerTrajectory", e.target.value)} />
        </div>
      </section>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? "Salvando…" : "SALVAR CONFIGURAÇÕES"}
        </button>
      </div>
    </form>
  );
}
