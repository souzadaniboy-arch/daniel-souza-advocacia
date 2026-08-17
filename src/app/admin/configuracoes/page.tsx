import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const metadata: Metadata = {
  title: "Configurações | Administração",
  robots: { index: false, follow: false },
};

export default async function AdminConfiguracoesPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  const initial = settings
    ? Object.fromEntries(
        Object.entries(settings).map(([key, value]) => [key, value === null ? "" : value])
      )
    : {};

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl font-semibold text-brand-graphite">Configurações do site</h1>
      <p className="mb-6 text-sm text-brand-gray">
        Estes dados alimentam o site público (menu, rodapé, página inicial e &ldquo;Quem somos&rdquo;).
      </p>
      <SettingsForm initial={initial} />
    </div>
  );
}
