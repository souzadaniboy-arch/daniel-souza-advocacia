import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiAdmin } from "@/lib/api";
import { articleSchema } from "@/lib/validation";
import { estimateReadingTime, slugify } from "@/lib/utils";
import { writeAuditLog } from "@/lib/audit";

const LIST_TAKE = 50;

export async function GET(req: Request) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const search = url.searchParams.get("q");
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10) || 1);

  const where = {
    ...(status ? { status } : {}),
    ...(search ? { title: { contains: search } } : {}),
  };

  const [total, articles] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        publishedAt: true,
        scheduledAt: true,
        updatedAt: true,
        featured: true,
        category: { select: { name: true } },
      },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * LIST_TAKE,
      take: LIST_TAKE,
    }),
  ]);

  return NextResponse.json({ articles, total, page, totalPages: Math.ceil(total / LIST_TAKE) });
}

export async function POST(req: Request) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => ({}));
  const parsed = articleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos.", details: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const slug = data.slug || slugify(data.title);
  const existing = await prisma.article.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Já existe um artigo com este slug. Escolha outro." }, { status: 409 });
  }

  const now = new Date();
  const status = data.status;
  let publishedAt = data.publishedAt ? new Date(data.publishedAt) : null;
  let scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : null;

  if (status === "PUBLISHED") {
    publishedAt = publishedAt ?? now;
    scheduledAt = null;
  } else if (status === "SCHEDULED") {
    scheduledAt = scheduledAt ?? publishedAt ?? now;
    publishedAt = null;
  } else {
    publishedAt = null;
    scheduledAt = null;
  }

  const article = await prisma.article.create({
    data: {
      title: data.title,
      subtitle: data.subtitle || null,
      slug,
      summary: data.summary || null,
      content: data.content,
      coverImage: data.coverImage || null,
      ogImage: data.ogImage || null,
      keywords: data.keywords || null,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      readingTime: estimateReadingTime(data.content),
      status,
      publishedAt,
      scheduledAt,
      featured: data.featured ?? false,
      categoryId: data.categoryId,
      authorId: data.authorId ?? null,
    },
  });

  await writeAuditLog({
    userId: auth.user.id,
    action: "ARTICLE_CREATED",
    entityType: "Article",
    entityId: article.id,
    details: article.title,
    req,
  });

  return NextResponse.json({ ok: true, article }, { status: 201 });
}
