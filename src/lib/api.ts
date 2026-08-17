import { NextResponse } from "next/server";
import { getSessionUser } from "./auth";
import type { User } from "@prisma/client";

export function jsonOk(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, { status: 200, ...init });
}

export function jsonError(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { error: message, ...(details ? { details } : {}) },
    { status }
  );
}

export async function apiAuth(): Promise<{ user: User } | NextResponse> {
  const user = await getSessionUser();
  if (!user) return jsonError("Não autenticado.", 401);
  return { user };
}

export async function apiAdmin(): Promise<{ user: User } | NextResponse> {
  const result = await apiAuth();
  if (result instanceof NextResponse) return result;
  if (result.user.role !== "ADMIN") return jsonError("Acesso restrito.", 403);
  return result;
}
