import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SeoForm } from "@/components/admin/SeoForm";

export const metadata: Metadata = {
  title: "SEO | Administração",
  robots: { index: false, follow: false },
};

export default async function AdminSeoPage() {
  const seo = await prisma.seoSettings.findUnique({ where: { id: 1 } });

  const initial = seo
    ? Object.fromEntries(Object.entries(seo).map(([key, value]) => [key, value === null ? "" : value]))
    : {};

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl font-semibold text-brand-graphite">SEO</h1>
      <p className="mb-6 text-sm text-brand-gray">
        Configurações globais de SEO. As páginas individuais (artigos, áreas) também têm campos próprios.
      </p>
      <SeoForm initial={initial} />
    </div>
  );
}
