import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiAdmin } from "@/lib/api";
import { categorySchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { slugify } from "@/lib/utils";

export async function GET(req: Request) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { articles: true, faqs: true } },
    },
    orderBy: [{ type: "asc" }, { order: "asc" }],
  });
  return NextResponse.json({ categories });
}

export async function POST(req: Request) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => ({}));
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos.", details: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const slug = data.slug || slugify(data.name);

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) return NextResponse.json({ error: "Já existe uma categoria com este slug." }, { status: 409 });

  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug,
      description: data.description || null,
      whatsappMessage: data.whatsappMessage || null,
      type: data.type,
      order: data.order ?? 0,
      active: data.active ?? true,
    },
  });

  await writeAuditLog({ userId: auth.user.id, action: "CATEGORY_CREATED", entityType: "Category", entityId: category.id, req });
  return NextResponse.json({ ok: true, category }, { status: 201 });
}
