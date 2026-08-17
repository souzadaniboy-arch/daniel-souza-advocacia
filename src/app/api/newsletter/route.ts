import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { assertSameOrigin, isLikelySpam } from "@/lib/security";
import { sanitizeText } from "@/lib/utils";

export async function POST(req: Request) {
  const limited = await rateLimit(req);
  if (!limited.ok) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde e tente novamente." }, { status: 429 });
  }
  if (!assertSameOrigin(req)) {
    return NextResponse.json({ error: "Origem inválida." }, { status: 403 });
  }

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });

  if (isLikelySpam(form)) {
    return NextResponse.json({ ok: true });
  }

  const parsed = newsletterSchema.safeParse({
    name: form.get("name"),
    email: form.get("email"),
    consent: form.get("consent") === "on",
    honeypot: form.get("empresa_website"),
  });

  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors).flat()[0];
    return NextResponse.json({ error: firstError ?? "Dados inválidos." }, { status: 400 });
  }

  const { name, email } = parsed.data;
  const cleanEmail = sanitizeText(email).toLowerCase();
  const source = form.get("source")?.toString() || "newsletter";

  const existing = await prisma.subscriber.findUnique({ where: { email: cleanEmail } });
  if (existing) {
    if (existing.status === "UNSUBSCRIBED") {
      await prisma.subscriber.update({
        where: { email: cleanEmail },
        data: { status: "ACTIVE", consentAt: new Date(), unsubscribeToken: randomUUID() },
      });
    }
    return NextResponse.json({ ok: true });
  }

  await prisma.subscriber.create({
    data: {
      name: sanitizeText(name),
      email: cleanEmail,
      consent: true,
      consentAt: new Date(),
      source: source.slice(0, 100),
      unsubscribeToken: randomUUID(),
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const email = url.searchParams.get("email");

  if (token) {
    await prisma.subscriber.updateMany({
      where: { unsubscribeToken: token, status: "ACTIVE" },
      data: { status: "UNSUBSCRIBED", unsubscribedAt: new Date() },
    });
    return NextResponse.json({ ok: true });
  }
  if (email) {
    await prisma.subscriber.updateMany({
      where: { email: email.toLowerCase(), status: "ACTIVE" },
      data: { status: "UNSUBSCRIBED", unsubscribedAt: new Date() },
    });
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Parâmetros ausentes." }, { status: 400 });
}
