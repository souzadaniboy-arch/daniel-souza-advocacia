import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiAdmin } from "@/lib/api";
import { writeAuditLog } from "@/lib/audit";
import { hashPassword } from "@/lib/auth";
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().trim().min(3).max(120),
  email: z.string().trim().email(),
  password: z.string().min(8, "A senha deve ter ao menos 8 caracteres"),
  role: z.enum(["ADMIN", "EDITOR"]),
});

export async function GET() {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      lastLoginAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => ({}));
  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos.", details: parsed.error.flatten() }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) return NextResponse.json({ error: "Já existe um usuário com este e-mail." }, { status: 409 });

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: await hashPassword(parsed.data.password),
      role: parsed.data.role,
    },
  });

  await writeAuditLog({ userId: auth.user.id, action: "USER_CREATED", entityType: "User", entityId: user.id, req });
  return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } }, { status: 201 });
}
