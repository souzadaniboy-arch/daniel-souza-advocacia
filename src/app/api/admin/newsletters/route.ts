import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiAdmin } from "@/lib/api";
import { newsletterEditSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";

export async function GET() {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const newsletters = await prisma.newsletter.findMany({
    include: {
      _count: { select: { articles: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ newsletters });
}

export async function POST(req: Request) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => ({}));
  const parsed = newsletterEditSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos.", details: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const newsletter = await prisma.newsletter.create({
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

  await writeAuditLog({ userId: auth.user.id, action: "NEWSLETTER_CREATED", entityType: "Newsletter", entityId: newsletter.id, req });
  return NextResponse.json({ ok: true, newsletter }, { status: 201 });
}
