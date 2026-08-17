import { createHash } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import type { User } from "@prisma/client";

const COOKIE_NAME = "ds_auth";
const SESSION_DURATION_DAYS = 7;

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET ausente ou muito curto. Configure no arquivo .env");
  }
  return new TextEncoder().encode(secret);
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function createSession(
  user: User,
  meta?: { ip?: string; userAgent?: string }
): Promise<string> {
  const secret = getSecret();
  const token = await new SignJWT({ sub: user.id, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_DAYS}d`)
    .sign(secret);

  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 86400000);
  await prisma.session.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt,
      ip: meta?.ip,
      userAgent: meta?.userAgent,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_DAYS * 86400,
  });

  return token;
}

export async function getSessionUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const session = await prisma.session.findUnique({
      where: { tokenHash: hashToken(token) },
      include: { user: true },
    });
    if (!session || session.expiresAt < new Date() || !session.user.active) return null;
    return session.user;
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getSessionUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth();
  if (user.role !== "ADMIN") throw new Error("FORBIDDEN");
  return user;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionUserSafe(): Promise<User | null> {
  try {
    return await getSessionUser();
  } catch {
    return null;
  }
}
