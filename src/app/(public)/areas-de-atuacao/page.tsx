import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildMetadata, jsonLdScript, breadcrumbSchema } from "@/lib/seo";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ArrowRightIcon } from "@/components/icons";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Áreas de Atuação",
    description:
      "Conheça as áreas de atuação do escritório: Direito Previdenciário, Trabalhista, Tributário, Bancário e Direitos das Pessoas Autistas.",
    path: "/areas-de-atuacao",
  });
}

export default async function AreasPage() {
  const areas = await prisma.category.findMany({
    where: { type: "AREA", active: true },
    select: {
      slug: true,
      name: true,
      description: true,
      _count: { select: { articles: { where: { status: "PUBLISHED" } } } },
    },
    orderBy: { order: "asc" },
  });

  const crumbSchema = breadcrumbSchema([
    { name: "Início", path: "/" },
    { name: "Áreas de Atuação", path: "/areas-de-atuacao" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(crumbSchema) }} />
      <section className="bg-brand-off-white">
        <div className="container-page py-14 sm:py-20">
          <div className="mb-8">
            <Breadcrumb items={[{ name: "Início", path: "/" }, { name: "Áreas de Atuação" }]} />
          </div>
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-terracotta">
              Áreas de Atuação
            </p>
            <h1 className="font-serif text-4xl font-semibold leading-tight text-brand-graphite sm:text-5xl">
              Áreas de Atuação
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-brand-gray">
              Conhecimento jurídico aplicado a diferentes desafios da vida profissional, patrimonial e familiar.
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-page">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {areas.map((area) => (
              <Link
                key={area.slug}
                href={`/areas/${area.slug}`}
                className="group flex flex-col rounded-sm border border-brand-sand bg-brand-off-white p-8 transition-all hover:border-brand-terracotta hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-serif text-5xl font-light text-brand-terracotta" aria-hidden="true">
                    {area.name.charAt(0)}
                  </span>
                  {area._count.articles > 0 && (
                    <span className="rounded-full bg-brand-sand px-3 py-1 text-xs text-brand-gray">
                      {area._count.articles} artigo{area._count.articles > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <h2 className="mt-4 font-serif text-2xl font-semibold text-brand-graphite">{area.name}</h2>
                {area.description && (
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-gray">{area.description}</p>
                )}
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand-terracotta transition-colors group-hover:text-brand-deep">
                  Conheça esta área
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-14 rounded-sm border border-brand-sand bg-brand-sand/30 p-8">
            <h2 className="font-serif text-2xl font-semibold text-brand-graphite">Como escolher a área certa?</h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-gray">
              Muitas situações envolvem mais de uma área do Direito. A orientação jurídica pode identificar quais
              questões estão presentes e os caminhos mais adequados. A análise é individual e começa pela
              compreensão cuidadosa dos fatos e documentos de cada caso.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
