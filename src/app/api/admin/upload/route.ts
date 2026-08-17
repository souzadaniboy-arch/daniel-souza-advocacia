import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { apiAdmin } from "@/lib/api";
import { writeAuditLog } from "@/lib/audit";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["image/svg+xml", ".svg"],
  ["image/avif", ".avif"],
]);

export async function POST(req: Request) {
  const auth = await apiAdmin();
  if (auth instanceof NextResponse) return auth;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!form || !(file instanceof File)) {
    return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
  }

  const ext = ALLOWED.get(file.type);
  if (!ext) return NextResponse.json({ error: "Formato de imagem não permitido (JPG, PNG, WEBP, GIF, SVG, AVIF)." }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "Imagem maior que 5 MB." }, { status: 413 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${randomUUID()}${ext}`;

  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(path.join(UPLOAD_DIR, filename), buffer);
  } catch {
    return NextResponse.json({ error: "Não foi possível salvar o arquivo." }, { status: 500 });
  }

  const url = `/uploads/${filename}`;
  const media = await prisma.media.create({
    data: {
      filename,
      alt: (form.get("alt") as string | null) || null,
      mimeType: file.type,
      size: file.size,
      url,
      uploadedBy: auth.user.id,
    },
  });

  await writeAuditLog({ userId: auth.user.id, action: "MEDIA_UPLOADED", entityType: "Media", entityId: media.id, req, details: `tamanho ${file.size}` });
  return NextResponse.json({ ok: true, url, media }, { status: 201 });
}
