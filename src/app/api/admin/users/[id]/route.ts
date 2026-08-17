import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiAdmin } from "@/lib/api";
import { writeAuditLog } from "@/lib/audit";
import { hashPassword } from "@/lib/auth";
import { z } from "zod";

interface Params {
  params: Promise<{ id: string }>;
}

const updateUserSchema = z.object({
  name: z.string().trim().min(3).max(120),
  email: z.string().trim().email(),
  role: z.enum(["ADMIN", "EDITOR"]),
  active: z.boolean(),
  password: z.string().min(8, "A senha deve ter ao menos 8 caracteres").optional().or(z.literal("")),
});

export async function PUT(req: Request, { params }: Params) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const parsed = updateUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos.", details: parsed.error.flatten() }, { status: 400 });
  }

  if (id === auth.user.id && (!parsed.data.active || parsed.data.role !== "ADMIN")) {
    return NextResponse.json({ error: "Você não pode desativar ou rebaixar seu próprio usuário." }, { status: 400 });
  }

  const data: Record<string, unknown> = {
    name: parsed.data.name,
    email: parsed.data.email,
    role: parsed.data.role,
    active: parsed.data.active,
  };
  if (parsed.data.password) data.passwordHash = await hashPassword(parsed.data.password);

  const user = await prisma.user.update({ where: { id }, data });
  await writeAuditLog({ userId: auth.user.id, action: "USER_UPDATED", entityType: "User", entityId: id, req });
  return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role, active: user.active } });
}

export async function DELETE(req: Request, { params }: Params) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  if (id === auth.user.id) return NextResponse.json({ error: "Você não pode excluir seu próprio usuário." }, { status: 400 });

  await prisma.user.delete({ where: { id } });
  await writeAuditLog({ userId: auth.user.id, action: "USER_DELETED", entityType: "User", entityId: id, req });
  return NextResponse.json({ ok: true });
}
