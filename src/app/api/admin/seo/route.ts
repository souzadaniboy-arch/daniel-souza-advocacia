import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiAdmin } from "@/lib/api";
import { seoSettingsSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { clearSiteDataCache } from "@/lib/settings";

export async function GET() {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const seo = await prisma.seoSettings.findUnique({ where: { id: 1 } });
  return NextResponse.json({ seo });
}

export async function PUT(req: Request) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => ({}));
  const parsed = seoSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos.", details: parsed.error.flatten() }, { status: 400 });
  }

  const d = parsed.data;
  const seo = await prisma.seoSettings.upsert({
    where: { id: 1 },
    update: { ...d },
    create: { id: 1, ...d },
  });

  clearSiteDataCache();
  await writeAuditLog({ userId: auth.user.id, action: "SEO_UPDATED", entityType: "SeoSettings", entityId: "1", req });
  return NextResponse.json({ ok: true, seo });
}
