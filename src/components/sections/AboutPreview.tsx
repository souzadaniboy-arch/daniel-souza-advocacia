import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/icons";

interface AboutPreviewProps {
  name: string;
  lawyerName?: string | null;
  formation?: string | null;
  specializations?: string | null;
  oab?: string | null;
  photo?: string | null;
}

export function AboutPreview({ name, lawyerName, formation, specializations, oab, photo }: AboutPreviewProps) {
  return (
    <section className="section-pad bg-brand-off-white">
      <div className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-terracotta">Quem Somos</p>
          <h2 className="font-serif text-3xl font-semibold leading-tight text-brand-graphite sm:text-4xl">
            {name}
          </h2>
          {lawyerName && lawyerName !== "[INSERIR NOME DO ADVOGADO]" && (
            <p className="mt-2 font-serif text-xl text-brand-terracotta">{lawyerName}</p>
          )}
          <div className="mt-6 space-y-4 text-base leading-relaxed text-brand-gray sm:text-lg">
            <p>
              {name} atua na orientação e defesa de direitos, oferecendo uma abordagem baseada em conhecimento
              jurídico, análise individualizada e estratégia.
            </p>
            <p>
              O escritório busca transformar questões jurídicas complexas em informações claras, permitindo que
              cada pessoa compreenda melhor suas possibilidades, riscos e caminhos jurídicos.
            </p>
          </div>

          <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {oab && oab !== "[INSERIR OAB]" && (
              <div className="rounded-sm bg-white p-4">
                <dt className="text-xs uppercase tracking-wider text-brand-terracotta">OAB</dt>
                <dd className="mt-1 font-serif text-lg text-brand-graphite">{oab}</dd>
              </div>
            )}
            {formation && formation !== "[INSERIR FORMAÇÃO]" && (
              <div className="rounded-sm bg-white p-4">
                <dt className="text-xs uppercase tracking-wider text-brand-terracotta">Formação</dt>
                <dd className="mt-1 font-serif text-lg text-brand-graphite">{formation}</dd>
              </div>
            )}
            {specializations && specializations !== "[INSERIR ESPECIALIZAÇÕES]" && (
              <div className="rounded-sm bg-white p-4 sm:col-span-2">
                <dt className="text-xs uppercase tracking-wider text-brand-terracotta">Especializações</dt>
                <dd className="mt-1 font-serif text-lg text-brand-graphite">{specializations}</dd>
              </div>
            )}
          </dl>

          <div className="mt-10">
            <Button href="/quem-somos" variant="dark">
              CONHEÇA O ESCRITÓRIO
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[4/5] w-full overflow-hidden rounded-sm bg-gradient-to-br from-brand-sand to-brand-off-white">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="Fotografia profissional do advogado" className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
                <span className="font-serif text-6xl text-brand-terracotta">DS</span>
                <p className="mt-4 text-sm text-brand-gray">[INSERIR FOTOGRAFIA PROFISSIONAL]</p>
              </div>
            )}
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-sm bg-brand-terracotta px-6 py-4 text-white shadow-lg sm:block">
            <CheckIcon className="mb-1 h-5 w-5" aria-hidden="true" />
            <p className="font-serif text-sm">Análise individualizada</p>
            <p className="text-xs text-white/80">de cada situação</p>
          </div>
        </div>
      </div>
    </section>
  );
}
