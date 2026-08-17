import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiAdmin } from "@/lib/api";
import { articleSchema } from "@/lib/validation";
import { estimateReadingTime } from "@/lib/utils";
import { writeAuditLog } from "@/lib/audit";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true } },
      author: { select: { id: true, name: true } },
      faqs: { select: { faq: { select: { id: true, question: true } } } },
      relatedFrom: { select: { articleB: { select: { id: true, title: true } } } },
      relatedTo: { select: { articleA: { select: { id: true, title: true } } } },
    },
  });
  if (!article) return NextResponse.json({ error: "Artigo não encontrado." }, { status: 404 });
  return NextResponse.json({ article });
}

export async function PUT(req: Request, { params }: Params) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const parsed = articleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos.", details: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Artigo não encontrado." }, { status: 404 });

  const data = parsed.data;
  const now = new Date();
  let publishedAt = existing.publishedAt;
  let scheduledAt = existing.scheduledAt;

  if (data.status === "PUBLISHED") {
    publishedAt = publishedAt ?? now;
    scheduledAt = null;
  } else if (data.status === "SCHEDULED") {
    scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : existing.scheduledAt ?? now;
    publishedAt = null;
  } else {
    publishedAt = null;
    scheduledAt = null;
  }

  const article = await prisma.article.update({
    where: { id },
    data: {
      title: data.title,
      subtitle: data.subtitle || null,
      slug: data.slug,
      summary: data.summary || null,
      content: data.content,
      coverImage: data.coverImage || null,
      ogImage: data.ogImage || null,
      keywords: data.keywords || null,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      readingTime: estimateReadingTime(data.content),
      status: data.status,
      publishedAt,
      scheduledAt,
      featured: data.featured ?? existing.featured,
      categoryId: data.categoryId,
      authorId: data.authorId ?? null,
    },
  });

  // Artigos relacionados (se enviados)
  if (Array.isArray(body.relatedIds)) {
    await prisma.relatedArticle.deleteMany({
      where: { OR: [{ articleAId: id }, { articleBId: id }] },
    });
    for (const otherId of body.relatedIds.slice(0, 6)) {
      if (otherId === id) continue;
      const [a, b] = [id, otherId].sort();
      await prisma.relatedArticle.upsert({
        where: { articleAId_articleBId: { articleAId: a, articleBId: b } },
        update: {},
        create: { articleAId: a, articleBId: b },
      });
    }
  }

  // FAQ relacionadas (se enviadas)
  if (Array.isArray(body.faqIds)) {
    await prisma.articleFAQ.deleteMany({ where: { articleId: id } });
    for (const faqId of body.faqIds.slice(0, 10)) {
      await prisma.articleFAQ.create({ data: { articleId: id, faqId } });
    }
  }

  await writeAuditLog({
    userId: auth.user.id,
    action: "ARTICLE_UPDATED",
    entityType: "Article",
    entityId: id,
    details: article.title,
    req,
  });

  return NextResponse.json({ ok: true, article });
}

export async function DELETE(req: Request, { params }: Params) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return NextResponse.json({ error: "Artigo não encontrado." }, { status: 404 });

  await prisma.article.delete({ where: { id } });

  await writeAuditLog({
    userId: auth.user.id,
    action: "ARTICLE_DELETED",
    entityType: "Article",
    entityId: id,
    details: article.title,
    req,
  });

  return NextResponse.json({ ok: true });
}
