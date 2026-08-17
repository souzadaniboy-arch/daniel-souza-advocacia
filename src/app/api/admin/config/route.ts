import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiAdmin } from "@/lib/api";
import { configSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { clearSiteDataCache } from "@/lib/settings";

export async function GET(req: Request) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const url = new URL(req.url);
  const prefix = url.searchParams.get("prefix") ?? "";
  const configs = await prisma.config.findMany({
    where: prefix ? { key: { startsWith: prefix } } : undefined,
    orderBy: { key: "asc" },
  });
  return NextResponse.json({ configs });
}

export async function PUT(req: Request) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => ({}));
  const parsed = configSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos.", details: parsed.error.flatten() }, { status: 400 });
  }

  const { key, value } = parsed.data;
  const config = await prisma.config.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });

  clearSiteDataCache();
  await writeAuditLog({ userId: auth.user.id, action: "CONFIG_UPDATED", entityType: "Config", entityId: key, req });
  return NextResponse.json({ ok: true, config });
}
