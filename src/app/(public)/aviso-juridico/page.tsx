import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/LegalPage";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Aviso Jurídico",
    path: "/aviso-juridico",
  });
}

export default async function AvisoJuridicoPage() {
  const avisoConfig = await prisma.config.findUnique({ where: { key: "legal.avisoJuridico" } });
  const aviso = avisoConfig?.value ?? "";

  return (
    <LegalPage title="Aviso Jurídico" breadcrumbName="Aviso Jurídico">
      <p>{aviso}</p>
      <h2>Natureza informativa do conteúdo</h2>
      <p>
        Os conteúdos publicados neste site (artigos, perguntas frequentes e demais materiais) possuem caráter
        exclusivamente informativo e educacional. Eles não constituem parecer, aconselhamento ou promessa de
        resultado e não substituem a análise jurídica individualizada de situações concretas.
      </p>
      <h2>Atendimento jurídico</h2>
      <p>
        A prestação de serviços jurídicos ocorre somente após a análise individualizada do caso e a formalização
        da contratação, nos termos da legislação e das normas da Ordem dos Advogados do Brasil.
      </p>
      <h2>Responsabilidade</h2>
      <p>
        Este site não se responsabiliza por decisões tomadas com base exclusivamente nos conteúdos informativos
        publicados. Em caso de dúvida sobre uma situação concreta, procure orientação jurídica qualificada.
      </p>
    </LegalPage>
  );
}
