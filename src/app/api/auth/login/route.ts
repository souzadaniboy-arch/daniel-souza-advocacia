import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession, destroySession } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { assertSameOrigin } from "@/lib/security";
import { getClientIp } from "@/lib/utils";
import { writeAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  const limited = await rateLimit(req);
  if (!limited.ok) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde e tente novamente." }, { status: 429 });
  }
  if (!assertSameOrigin(req)) {
    return NextResponse.json({ error: "Origem inválida." }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user || !user.active) {
    await writeAuditLog({ action: "LOGIN_FAILED", details: parsed.data.email, req });
    return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) {
    await writeAuditLog({ action: "LOGIN_FAILED", userId: user.id, req });
    return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
  }

  await createSession(user, { ip: getClientIp(req), userAgent: req.headers.get("user-agent") ?? undefined });
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await writeAuditLog({ action: "LOGIN", userId: user.id, req });

  return NextResponse.json({ ok: true, user: { name: user.name, email: user.email, role: user.role } });
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ ok: true });
}
