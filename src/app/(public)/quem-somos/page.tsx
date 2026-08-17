import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteData } from "@/lib/settings";
import { buildMetadata, jsonLdScript, breadcrumbSchema, personSchema } from "@/lib/seo";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CheckIcon } from "@/components/icons";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Quem Somos",
    description:
      "Conheça o Daniel de Souza Advocacia e Consultoria Jurídica: atuação baseada em conhecimento jurídico, análise individualizada e estratégia.",
    path: "/quem-somos",
  });
}

const PRINCIPLES = [
  { title: "Ética", text: "Conduta pautada pelos deveres da advocacia e pelo respeito à confiança depositada." },
  { title: "Responsabilidade", text: "Cada orientação é formulada com seriedade e fundamento técnico." },
  { title: "Conhecimento", text: "Atualização contínua para oferecer orientação técnica e qualificada." },
  { title: "Transparência", text: "Comunicação clara sobre caminhos, riscos e possibilidades." },
  { title: "Estratégia", text: "Análise cuidadosa de alternativas antes de qualquer decisão." },
  { title: "Respeito", text: "Acolhimento da história e das necessidades de cada pessoa." },
];

export default async function QuemSomosPage() {
  const { settings } = await getSiteData();
  const [historiaConfig, atuacaoConfig, encerramentoConfig] = await Promise.all([
    prisma.config.findUnique({ where: { key: "quemSomos.historia" } }),
    prisma.config.findUnique({ where: { key: "quemSomos.atuacao" } }),
    prisma.config.findUnique({ where: { key: "quemSomos.encerramento" } }),
  ]);

  const historia =
    historiaConfig?.value ??
    "[INSERIR HISTÓRIA DO ESCRITÓRIO — edite em Configurações no painel administrativo]";
  const atuacao =
    atuacaoConfig?.value ??
    "[INSERIR DESCRIÇÃO DA ATUAÇÃO — edite em Configurações no painel administrativo]";

  const crumbSchema = breadcrumbSchema([
    { name: "Início", path: "/" },
    { name: "Quem Somos", path: "/quem-somos" },
  ]);

  const lawyerName = settings?.lawyerName || "Daniel de Souza";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(crumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(personSchema(lawyerName)) }} />

      {/* Hero */}
      <section className="bg-brand-off-white">
        <div className="container-page py-14 sm:py-20">
          <div className="mb-8">
            <Breadcrumb items={[{ name: "Início", path: "/" }, { name: "Quem Somos" }]} />
          </div>
          <div className="max-w-3xl">
            <Badge tone="sand" className="mb-4">Institucional</Badge>
            <h1 className="font-serif text-4xl font-semibold leading-tight text-brand-graphite sm:text-5xl">
              Quem Somos
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-brand-gray">
              {settings?.name ?? "Daniel de Souza Advocacia e Consultoria Jurídica"} atua na orientação e defesa
              de direitos, oferecendo uma abordagem baseada em conhecimento jurídico, análise individualizada e
              estratégia.
            </p>
          </div>
        </div>
      </section>

      {/* História */}
      <section className="section-pad bg-white">
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionTitle eyebrow="História" title="A trajetória do escritório" align="left" />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-brand-gray sm:text-lg">
              {historia.split("\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] w-full rounded-sm bg-gradient-to-br from-brand-sand to-brand-off-white">
              {settings?.lawyerPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.lawyerPhoto}
                  alt={`Fotografia profissional — ${lawyerName}`}
                  className="h-full w-full rounded-sm object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
                  <span className="font-serif text-6xl text-brand-terracotta">DS</span>
                  <p className="mt-4 text-sm text-brand-gray">[INSERIR FOTOGRAFIA PROFISSIONAL]</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* O Advogado */}
      <section className="section-pad bg-brand-sand/30">
        <div className="container-page">
          <SectionTitle eyebrow="O Advogado" title={lawyerName} className="mb-12" />
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 font-serif text-xl font-semibold text-brand-graphite">Trajetória profissional</h3>
                <p className="text-base leading-relaxed text-brand-gray">
                  {settings?.lawyerTrajectory || "[INSERIR TRAJETÓRIA PROFISSIONAL]"}
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-serif text-xl font-semibold text-brand-graphite">Atuação</h3>
                <p className="text-base leading-relaxed text-brand-gray">{atuacao}</p>
              </div>
              <div>
                <h3 className="mb-2 font-serif text-xl font-semibold text-brand-graphite">Biografia</h3>
                <p className="text-base leading-relaxed text-brand-gray">
                  {settings?.lawyerBio || "[INSERIR BIOGRAFIA]"}
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-sm bg-white p-6 shadow-sm">
                <h3 className="mb-2 font-serif text-xl font-semibold text-brand-graphite">Formação</h3>
                <p className="text-base leading-relaxed text-brand-gray">
                  {settings?.lawyerFormation || "[INSERIR FORMAÇÃO]"}
                </p>
              </div>
              <div className="rounded-sm bg-white p-6 shadow-sm">
                <h3 className="mb-2 font-serif text-xl font-semibold text-brand-graphite">Especializações</h3>
                <p className="text-base leading-relaxed text-brand-gray">
                  {settings?.lawyerSpecializations || "[INSERIR ESPECIALIZAÇÕES]"}
                </p>
              </div>
              <div className="rounded-sm bg-white p-6 shadow-sm">
                <h3 className="mb-2 font-serif text-xl font-semibold text-brand-graphite">Experiência</h3>
                <p className="text-base leading-relaxed text-brand-gray">
                  {settings?.lawyerExperience || "[INSERIR EXPERIÊNCIA]"}
                </p>
              </div>
              {settings?.oab && (
                <div className="rounded-sm bg-white p-6 shadow-sm">
                  <h3 className="mb-2 font-serif text-xl font-semibold text-brand-graphite">OAB</h3>
                  <p className="text-base text-brand-gray">{settings.oab}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Princípios */}
      <section className="section-pad bg-white">
        <div className="container-page">
          <SectionTitle
            eyebrow="Princípios"
            title="Princípios que orientam a atuação"
            subtitle="O exercício da advocacia é guiado por valores que sustentam a relação de confiança com cada cliente."
            className="mb-12"
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((principle) => (
              <div key={principle.title} className="rounded-sm border border-brand-sand bg-brand-off-white p-6">
                <CheckIcon className="mb-3 h-6 w-6 text-brand-terracotta" aria-hidden="true" />
                <h3 className="font-serif text-lg font-semibold text-brand-graphite">{principle.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-gray">{principle.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Encerramento */}
      <section className="bg-brand-deep py-16 text-center">
        <div className="container-page max-w-3xl">
          <p className="font-serif text-2xl font-medium leading-relaxed text-white sm:text-3xl">
            Conhecimento jurídico deve estar acompanhado de responsabilidade, clareza e respeito pela história
            de cada pessoa.
          </p>
        </div>
      </section>
    </>
  );
}
