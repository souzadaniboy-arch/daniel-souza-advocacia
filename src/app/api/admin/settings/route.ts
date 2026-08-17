import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiAdmin } from "@/lib/api";
import { settingsSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { clearSiteDataCache } from "@/lib/settings";

export async function GET() {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => ({}));
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos.", details: parsed.error.flatten() }, { status: 400 });
  }

  const d = parsed.data;
  const settings = await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: { ...d },
    create: { id: 1, ...d },
  });

  clearSiteDataCache();
  await writeAuditLog({ userId: auth.user.id, action: "SETTINGS_UPDATED", entityType: "SiteSettings", entityId: "1", req });
  return NextResponse.json({ ok: true, settings });
}
