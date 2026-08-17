import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiAdmin } from "@/lib/api";
import { newsletterEditSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: Params) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const newsletter = await prisma.newsletter.findUnique({
    where: { id },
    include: { articles: { include: { article: { select: { id: true, title: true, slug: true } } } } },
  });
  if (!newsletter) return NextResponse.json({ error: "Newsletter não encontrada." }, { status: 404 });
  return NextResponse.json({ newsletter });
}

export async function PUT(req: Request, { params }: Params) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const parsed = newsletterEditSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos.", details: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const newsletter = await prisma.$transaction(async (tx) => {
    await tx.newsletterArticle.deleteMany({ where: { newsletterId: id } });
    return tx.newsletter.update({
      where: { id },
      data: {
        subject: data.subject,
        title: data.title,
        intro: data.intro || null,
        content: data.content,
        ctaLabel: data.ctaLabel || null,
        ctaUrl: data.ctaUrl || null,
        status: data.status,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        articles: data.articleIds?.length
          ? { create: data.articleIds.map((articleId) => ({ articleId })) }
          : undefined,
      },
    });
  });

  await writeAuditLog({ userId: auth.user.id, action: "NEWSLETTER_UPDATED", entityType: "Newsletter", entityId: id, req });
  return NextResponse.json({ ok: true, newsletter });
}

export async function DELETE(req: Request, { params }: Params) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  await prisma.newsletter.delete({ where: { id } });
  await writeAuditLog({ userId: auth.user.id, action: "NEWSLETTER_DELETED", entityType: "Newsletter", entityId: id, req });
  return NextResponse.json({ ok: true });
}
