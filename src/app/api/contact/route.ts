import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { assertSameOrigin, isLikelySpam } from "@/lib/security";
import { getClientIp, sanitizeText } from "@/lib/utils";

export async function POST(req: Request) {
  const limited = await rateLimit(req);
  if (!limited.ok) {
    return NextResponse.json({ error: "Muitas mensagens enviadas. Aguarde e tente novamente." }, { status: 429 });
  }
  if (!assertSameOrigin(req)) {
    return NextResponse.json({ error: "Origem inválida." }, { status: 403 });
  }

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });

  if (isLikelySpam(form)) {
    // Resposta neutra para não confirmar a detecção
    return NextResponse.json({ ok: true });
  }

  const parsed = contactSchema.safeParse({
    name: form.get("name"),
    email: form.get("email"),
    phone: form.get("phone"),
    subject: form.get("subject"),
    message: form.get("message"),
    consent: form.get("consent") === "on",
    honeypot: form.get("empresa_website"),
  });

  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors).flat()[0];
    return NextResponse.json({ error: firstError ?? "Dados inválidos." }, { status: 400 });
  }

  const { name, email, phone, subject, message } = parsed.data;

  await prisma.contactMessage.create({
    data: {
      name: sanitizeText(name),
      email: sanitizeText(email).toLowerCase(),
      phone: phone ? sanitizeText(phone) : null,
      subject: subject ? sanitizeText(subject) : null,
      message: sanitizeText(message),
      consent: true,
      ip: getClientIp(req),
    },
  });

  return NextResponse.json({ ok: true });
}
