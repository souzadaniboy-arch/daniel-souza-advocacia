import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiAdmin } from "@/lib/api";

export async function GET(req: Request) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const url = new URL(req.url);
  const status = url.searchParams.get("status") ?? undefined;
  const search = url.searchParams.get("search") ?? "";
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const take = 25;

  const where = {
    ...(status ? { status } : {}),
    ...(search ? { OR: [{ name: { contains: search } }, { email: { contains: search } }] } : {}),
  };

  const [total, subscribers] = await Promise.all([
    prisma.subscriber.count({ where }),
    prisma.subscriber.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * take,
      take,
    }),
  ]);

  return NextResponse.json({ subscribers, total, page, totalPages: Math.ceil(total / take) });
}
