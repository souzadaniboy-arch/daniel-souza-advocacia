import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { UsersManager } from "@/components/admin/UsersManager";

export const metadata: Metadata = {
  title: "Usuários | Administração",
  robots: { index: false, follow: false },
};

export default async function AdminUsuariosPage() {
  const [usersRaw, user] = await Promise.all([
    prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, active: true, lastLoginAt: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    getSessionUser(),
  ]);

  const users = usersRaw.map((u) => ({
    ...u,
    lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold text-brand-graphite">Usuários</h1>
      <UsersManager initial={users} currentUserId={user?.id ?? ""} />
    </div>
  );
}
