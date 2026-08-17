import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/LegalPage";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Política de Cookies",
    path: "/politica-de-cookies",
  });
}

export default async function PoliticaCookiesPage() {
  const [tituloConfig, textoConfig] = await Promise.all([
    prisma.config.findUnique({ where: { key: "politicaCookies.titulo" } }),
    prisma.config.findUnique({ where: { key: "politicaCookies.texto" } }),
  ]);

  const title = tituloConfig?.value ?? "Política de Cookies";
  const text = textoConfig?.value ?? "[INSERIR CONTEÚDO DA POLÍTICA DE COOKIES]";

  return (
    <LegalPage title={title} breadcrumbName="Política de Cookies">
      {text.split("\n").map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
      <p>
        Você pode modificar suas preferências de cookies a qualquer momento pelo link &ldquo;Alterar
        preferências de cookies&rdquo;, disponível no rodapé do site.
      </p>
    </LegalPage>
  );
}
