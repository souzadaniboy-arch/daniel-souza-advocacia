import { prisma } from "./prisma";
import { getClientIp } from "./utils";

export async function writeAuditLog(params: {
  userId?: string | null;
  action: string;
  entityType?: string;
  entityId?: string;
  details?: string;
  req?: Request;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId ?? null,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        details: params.details ?? null,
        ip: params.req ? getClientIp(params.req) : null,
      },
    });
  } catch {
    // Log de auditoria nunca deve interromper a operação principal
  }
}
