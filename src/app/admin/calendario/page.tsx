import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateShort } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Calendário Editorial | Administração",
  robots: { index: false, follow: false },
};

export default async function AdminCalendarioPage() {
  const articles = await prisma.article.findMany({
    where: { status: { in: ["SCHEDULED", "PUBLISHED"] } },
    select: {
      id: true,
      title: true,
      status: true,
      publishedAt: true,
      scheduledAt: true,
      createdAt: true,
      category: { select: { name: true } },
    },
    orderBy: [{ scheduledAt: "asc" }, { publishedAt: "asc" }],
    take: 200,
  });

  const now = new Date();
  const scheduled = articles
    .filter((a) => a.status === "SCHEDULED" && a.scheduledAt)
    .map((a) => ({ ...a, date: a.scheduledAt as Date }));
  const published = articles.filter((a) => a.status === "PUBLISHED");

  const upcoming = scheduled.filter((a) => a.date > now).sort((x, y) => x.date.getTime() - y.date.getTime());
  const overdue = scheduled.filter((a) => a.date <= now).sort((x, y) => x.date.getTime() - y.date.getTime());

  const months = new Map<string, typeof published>();
  for (const a of published) {
    const d = a.publishedAt ?? a.createdAt;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!months.has(key)) months.set(key, []);
    months.get(key)?.push(a);
  }
  const monthList = Array.from(months.entries()).sort((a, b) => b[0].localeCompare(a[0]));

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold text-brand-graphite">Calendário Editorial</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-sm border border-brand-sand bg-white p-5">
          <h2 className="mb-3 font-serif text-xl font-semibold text-brand-graphite">Próximas publicações</h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-brand-gray">Nenhum artigo programado.</p>
          ) : (
            <ul className="space-y-2">
              {upcoming.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <Link href={`/admin/artigos/${a.id}`} className="font-medium text-brand-deep hover:underline">
                      {a.title}
                    </Link>
                    <span className="ml-2 text-xs text-brand-gray">{a.category?.name}</span>
                  </div>
                  <span className="whitespace-nowrap rounded-full bg-brand-terracotta/10 px-2 py-1 text-xs text-brand-terracotta">
                    {formatDateShort(a.date)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-sm border border-brand-sand bg-white p-5">
          <h2 className="mb-3 font-serif text-xl font-semibold text-brand-graphite">Programações atrasadas</h2>
          {overdue.length === 0 ? (
            <p className="text-sm text-brand-gray">Nenhum artigo atrasado.</p>
          ) : (
            <ul className="space-y-2">
              {overdue.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <Link href={`/admin/artigos/${a.id}`} className="font-medium text-brand-deep hover:underline">
                      {a.title}
                    </Link>
                    <span className="ml-2 text-xs text-brand-gray">{a.category?.name}</span>
                  </div>
                  <span className="whitespace-nowrap rounded-full bg-brand-deep/10 px-2 py-1 text-xs text-brand-deep">
                    {formatDateShort(a.date)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-sm border border-brand-sand bg-white p-5">
        <h2 className="mb-4 font-serif text-xl font-semibold text-brand-graphite">Histórico de publicações</h2>
        {monthList.length === 0 ? (
          <p className="text-sm text-brand-gray">Nenhum artigo publicado ainda.</p>
        ) : (
          <div className="space-y-6">
            {monthList.map(([key, items]) => {
              const [year, month] = key.split("-");
              const label = new Date(Number(year), Number(month) - 1, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
              return (
                <div key={key}>
                  <h3 className="mb-2 font-serif text-lg font-semibold capitalize text-brand-graphite">{label}</h3>
                  <ul className="space-y-1.5">
                    {items.map((a) => (
                      <li key={a.id} className="flex items-center justify-between gap-3 text-sm">
                        <Link href={`/admin/artigos/${a.id}`} className="font-medium text-brand-graphite hover:text-brand-deep">
                          {a.title}
                        </Link>
                        <span className="whitespace-nowrap text-xs text-brand-gray">
                          {a.publishedAt ? formatDateShort(a.publishedAt) : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
