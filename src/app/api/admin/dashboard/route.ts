import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiAdmin } from "@/lib/api";

export async function GET(req: Request) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const now = new Date();

  const [published, scheduled, drafts, subscribers, messages, faqs, recentMessages, recentArticles, recentActivity] =
    await Promise.all([
      prisma.article.count({ where: { status: "PUBLISHED" } }),
      prisma.article.count({ where: { status: "SCHEDULED" } }),
      prisma.article.count({ where: { status: "DRAFT" } }),
      prisma.subscriber.count({ where: { status: "ACTIVE" } }),
      prisma.contactMessage.count({ where: { status: "NEW" } }),
      prisma.faq.count({ where: { active: true } }),
      prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.article.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 5,
        select: { id: true, title: true, slug: true, status: true, publishedAt: true },
      }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { user: { select: { name: true } } },
      }),
    ]);

  const [publishedThisMonth, subscribersThisMonth, messagesThisMonth] = await Promise.all([
    prisma.article.count({ where: { status: "PUBLISHED", publishedAt: { gte: startOfMonth } } }),
    prisma.subscriber.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.contactMessage.count({ where: { createdAt: { gte: startOfMonth } } }),
  ]);

  const scheduledUpcoming = await prisma.article.findMany({
    where: { status: "SCHEDULED", scheduledAt: { gt: now } },
    orderBy: { scheduledAt: "asc" },
    take: 5,
    select: { id: true, title: true, scheduledAt: true },
  });

  return NextResponse.json({
    stats: {
      published,
      scheduled,
      drafts,
      subscribers,
      messages,
      faqs,
      publishedThisMonth,
      subscribersThisMonth,
      messagesThisMonth,
    },
    recentMessages,
    recentArticles,
    scheduledUpcoming,
    recentActivity,
    now: now.toISOString(),
  });
}
