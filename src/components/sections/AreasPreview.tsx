import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ArrowRightIcon } from "@/components/icons";

export interface AreaCardData {
  slug: string;
  name: string;
  description?: string | null;
}

export function AreasPreview({ areas }: { areas: AreaCardData[] }) {
  return (
    <section className="section-pad bg-brand-off-white">
      <div className="container-page">
        <SectionTitle
          eyebrow="Áreas de Atuação"
          title="Áreas de Atuação"
          subtitle="Conhecimento jurídico aplicado a diferentes desafios da vida profissional, patrimonial e familiar."
          className="mb-14"
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <Link
              key={area.slug}
              href={`/areas/${area.slug}`}
              className="group flex flex-col rounded-sm border border-brand-sand bg-white p-8 transition-all hover:border-brand-terracotta hover:shadow-md"
            >
              <span className="font-serif text-3xl text-brand-terracotta" aria-hidden="true">
                {area.name.charAt(0)}
              </span>
              <h3 className="mt-4 font-serif text-xl font-semibold leading-snug text-brand-graphite">
                {area.name}
              </h3>
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
        <div className="mt-12 text-center">
          <Link href="/areas-de-atuacao" className="btn-secondary">
            VER TODAS AS ÁREAS
          </Link>
        </div>
      </div>
    </section>
  );
}
