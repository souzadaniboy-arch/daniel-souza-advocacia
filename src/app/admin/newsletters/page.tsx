import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { NewsletterList } from "@/components/admin/NewsletterList";

export const metadata: Metadata = {
  title: "Newsletter | Administração",
  robots: { index: false, follow: false },
};

export default async function AdminNewslettersPage() {
  const newsletters = (
    await prisma.newsletter.findMany({
      include: { _count: { select: { articles: true } } },
      orderBy: { updatedAt: "desc" },
      take: 200,
    })
  ).map((n) => ({
    ...n,
    scheduledAt: n.scheduledAt?.toISOString() ?? null,
    sentAt: n.sentAt?.toISOString() ?? null,
    updatedAt: n.updatedAt.toISOString(),
  }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold text-brand-graphite">Newsletter</h1>
        <a href="/admin/newsletters/novo" className="btn-primary px-4 py-2 text-xs">
          Nova newsletter
        </a>
      </div>
      <NewsletterList initial={newsletters} />
    </div>
  );
}
