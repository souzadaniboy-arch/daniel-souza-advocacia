import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ConfigManager } from "@/components/admin/ConfigManager";

export const metadata: Metadata = {
  title: "Cookies & LGPD | Administração",
  robots: { index: false, follow: false },
};

const PREFIXES = [
  { value: "cookies", label: "cookies.*" },
  { value: "politica", label: "politicaPrivacidade.* / politicaCookies.*" },
  { value: "legal", label: "legal.*" },
  { value: "area", label: "area.* (tópicos das áreas)" },
];

export default async function AdminCookiesPage() {
  const configs = (
    await prisma.config.findMany({
      where: {
        OR: [{ key: { startsWith: "cookies" } }, { key: { startsWith: "politica" } }, { key: { startsWith: "legal" } }, { key: { startsWith: "area" } }],
      },
      orderBy: { key: "asc" },
    })
  ).map((c) => ({ ...c, updatedAt: c.updatedAt.toISOString() }));

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl font-semibold text-brand-graphite">Cookies & LGPD</h1>
      <p className="mb-6 text-sm text-brand-gray">
        Textos do banner de cookies, das páginas de Política de Privacidade/Cookies, Aviso Jurídico e tópicos das áreas de atuação.
      </p>
      <ConfigManager initial={configs} prefixes={PREFIXES} defaultPrefix="cookies" />
    </div>
  );
}
