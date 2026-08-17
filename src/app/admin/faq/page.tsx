import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { FaqManager } from "@/components/admin/FaqManager";

export const metadata: Metadata = {
  title: "Perguntas Frequentes | Administração",
  robots: { index: false, follow: false },
};

export default async function AdminFaqPage() {
  const [faqs, categories] = await Promise.all([
    prisma.faq.findMany({
      include: { category: { select: { name: true } } },
      orderBy: [{ order: "asc" }, { question: "asc" }],
      take: 300,
    }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold text-brand-graphite">Perguntas Frequentes</h1>
      <FaqManager initial={faqs} categories={categories} />
    </div>
  );
}
