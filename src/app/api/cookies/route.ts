import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const limited = await rateLimit(req);
  if (!limited.ok) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const body = await req.json().catch(() => ({}));
  const { visitorKey, necessary = true, preferences = false, statistics = false, marketing = false } = body;
  if (!visitorKey || typeof visitorKey !== "string") {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  await prisma.cookieConsent.upsert({
    where: { visitorKey },
    update: { necessary: Boolean(necessary), preferences: Boolean(preferences), statistics: Boolean(statistics), marketing: Boolean(marketing) },
    create: {
      visitorKey: visitorKey.slice(0, 200),
      necessary: Boolean(necessary),
      preferences: Boolean(preferences),
      statistics: Boolean(statistics),
      marketing: Boolean(marketing),
    },
  });

  return NextResponse.json({ ok: true });
}
