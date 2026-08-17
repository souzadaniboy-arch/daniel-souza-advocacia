import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/LegalPage";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Política de Privacidade",
    path: "/politica-de-privacidade",
  });
}

export default async function PoliticaPrivacidadePage() {
  const [tituloConfig, textoConfig] = await Promise.all([
    prisma.config.findUnique({ where: { key: "politicaPrivacidade.titulo" } }),
    prisma.config.findUnique({ where: { key: "politicaPrivacidade.texto" } }),
  ]);

  const title = tituloConfig?.value ?? "Política de Privacidade";
  const text = textoConfig?.value ?? "[INSERIR CONTEÚDO DA POLÍTICA DE PRIVACIDADE]";

  return (
    <LegalPage title={title} breadcrumbName="Política de Privacidade">
      {text.split("\n").map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
      <p>
        Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), esta política será detalhada
        com a identificação do controlador, as finalidades do tratamento, os direitos dos titulares e o canal de
        contato com o Encarregado (DPO).
      </p>
    </LegalPage>
  );
}
