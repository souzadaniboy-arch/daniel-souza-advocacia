import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiAdmin } from "@/lib/api";
import { faqSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";

export async function GET(req: Request) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const url = new URL(req.url);
  const categoryId = url.searchParams.get("categoryId") ?? undefined;

  const faqs = await prisma.faq.findMany({
    where: categoryId ? { categoryId } : undefined,
    include: { category: { select: { name: true } } },
    orderBy: [{ order: "asc" }, { question: "asc" }],
    take: 300,
  });
  return NextResponse.json({ faqs });
}

export async function POST(req: Request) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => ({}));
  const parsed = faqSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos.", details: parsed.error.flatten() }, { status: 400 });
  }

  const { question, answer, categoryId, order, active } = parsed.data;
  const maxOrder = await prisma.faq.aggregate({ _max: { order: true } });

  const faq = await prisma.faq.create({
    data: {
      question,
      answer,
      categoryId: categoryId || null,
      order: order ?? (maxOrder._max.order ?? 0) + 1,
      active: active ?? true,
    },
  });

  await writeAuditLog({ userId: auth.user.id, action: "FAQ_CREATED", entityType: "Faq", entityId: faq.id, req });
  return NextResponse.json({ ok: true, faq }, { status: 201 });
}
