import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiAdmin } from "@/lib/api";
import { faqSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(req: Request, { params }: Params) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const parsed = faqSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos.", details: parsed.error.flatten() }, { status: 400 });
  }

  const { question, answer, categoryId, order, active } = parsed.data;
  const faq = await prisma.faq.update({
    where: { id },
    data: {
      question,
      answer,
      categoryId: categoryId || null,
      order: order ?? 0,
      active: active ?? true,
    },
  });

  await writeAuditLog({ userId: auth.user.id, action: "FAQ_UPDATED", entityType: "Faq", entityId: id, req });
  return NextResponse.json({ ok: true, faq });
}

export async function DELETE(req: Request, { params }: Params) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  await prisma.faq.delete({ where: { id } });
  await writeAuditLog({ userId: auth.user.id, action: "FAQ_DELETED", entityType: "Faq", entityId: id, req });
  return NextResponse.json({ ok: true });
}
