import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiAdmin } from "@/lib/api";
import { writeAuditLog } from "@/lib/audit";

interface Params {
  params: Promise<{ id: string }>;
}

const STATUSES = new Set(["NEW", "READ", "ARCHIVED"]);

export async function PATCH(req: Request, { params }: Params) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const status = body?.status;

  if (!status || !STATUSES.has(status)) {
    return NextResponse.json({ error: "Status inválido." }, { status: 400 });
  }

  const message = await prisma.contactMessage.update({
    where: { id },
    data: { status },
  });

  await writeAuditLog({ userId: auth.user.id, action: `MESSAGE_${status}`, entityType: "ContactMessage", entityId: id, req });
  return NextResponse.json({ ok: true, message });
}

export async function DELETE(req: Request, { params }: Params) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  await prisma.contactMessage.delete({ where: { id } });
  await writeAuditLog({ userId: auth.user.id, action: "MESSAGE_DELETED", entityType: "ContactMessage", entityId: id, req });
  return NextResponse.json({ ok: true });
}
