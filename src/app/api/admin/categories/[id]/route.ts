import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiAdmin } from "@/lib/api";
import { categorySchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(req: Request, { params }: Params) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos.", details: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const category = await prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      whatsappMessage: data.whatsappMessage || null,
      type: data.type,
      order: data.order ?? 0,
      active: data.active ?? true,
    },
  });

  await writeAuditLog({ userId: auth.user.id, action: "CATEGORY_UPDATED", entityType: "Category", entityId: id, req });
  return NextResponse.json({ ok: true, category });
}

export async function DELETE(req: Request, { params }: Params) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const count = await prisma.article.count({ where: { categoryId: id } });
  if (count > 0) {
    return NextResponse.json(
      { error: `Não é possível excluir: existem ${count} artigo(s) nesta categoria.` },
      { status: 409 }
    );
  }
  await prisma.category.delete({ where: { id } });
  await writeAuditLog({ userId: auth.user.id, action: "CATEGORY_DELETED", entityType: "Category", entityId: id, req });
  return NextResponse.json({ ok: true });
}
