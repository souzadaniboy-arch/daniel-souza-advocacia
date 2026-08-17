import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CategoryManager } from "@/components/admin/CategoryManager";

export const metadata: Metadata = {
  title: "Categorias | Administração",
  robots: { index: false, follow: false },
};

export default async function AdminCategoriasPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { articles: true, faqs: true } } },
    orderBy: [{ type: "asc" }, { order: "asc" }],
  });

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold text-brand-graphite">Categorias</h1>
      <CategoryManager initial={categories} />
    </div>
  );
}
