import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiAdmin } from "@/lib/api";

export async function GET(req: Request) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const url = new URL(req.url);
  const action = url.searchParams.get("action") ?? "";
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const take = 30;

  const where = action ? { action } : {};
  const [total, logs] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * take,
      take,
    }),
  ]);

  return NextResponse.json({ logs, total, page, totalPages: Math.ceil(total / take) });
}
