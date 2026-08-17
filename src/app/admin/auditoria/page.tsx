import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AuditLogs } from "@/components/admin/AuditLogs";

export const metadata: Metadata = {
  title: "Auditoria | Administração",
  robots: { index: false, follow: false },
};

export default async function AdminAuditoriaPage() {
  const logs = (
    await prisma.auditLog.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 30,
    })
  ).map((l) => ({ ...l, createdAt: l.createdAt.toISOString() }));
  const total = await prisma.auditLog.count();
  const distinct = await prisma.auditLog.findMany({ distinct: ["action"], select: { action: true } });

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold text-brand-graphite">Auditoria</h1>
      <AuditLogs
        initial={{ logs, total, page: 1, totalPages: Math.ceil(total / 30) }}
        actions={distinct.map((d) => d.action).sort()}
      />
    </div>
  );
}
