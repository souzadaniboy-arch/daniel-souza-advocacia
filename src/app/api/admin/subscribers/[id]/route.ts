import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiAdmin } from "@/lib/api";
import { writeAuditLog } from "@/lib/audit";

interface Params {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: Request, { params }: Params) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  await prisma.subscriber.delete({ where: { id } });
  await writeAuditLog({ userId: auth.user.id, action: "SUBSCRIBER_DELETED", entityType: "Subscriber", entityId: id, req });
  return NextResponse.json({ ok: true });
}
