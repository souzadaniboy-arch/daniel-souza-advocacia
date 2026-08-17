import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { NewsletterForm } from "@/components/admin/NewsletterForm";

export const metadata: Metadata = {
  title: "Nova newsletter | Administração",
  robots: { index: false, follow: false },
};

export default async function NovaNewsletterPage() {
  const articles = await prisma.article.findMany({
    where: { status: { in: ["PUBLISHED", "SCHEDULED", "DRAFT"] } },
    orderBy: { title: "asc" },
    select: { id: true, title: true },
    take: 200,
  });

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold text-brand-graphite">Nova newsletter</h1>
      <NewsletterForm articles={articles} />
    </div>
  );
}
