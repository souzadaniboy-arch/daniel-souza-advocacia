import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function Authority() {
  return (
    <section className="relative overflow-hidden bg-brand-graphite py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-brand-terracotta blur-3xl" />
      </div>
      <div className="container-page relative text-center">
        <SectionTitle
          eyebrow="Central de Conhecimento Jurídico"
          title="Informação jurídica para decisões mais conscientes."
          subtitle="O Direito está presente em diferentes momentos da vida. Informação de qualidade pode ajudar a compreender direitos, deveres, riscos e possibilidades. Por isso, o escritório mantém uma produção contínua de conteúdos jurídicos sobre temas relevantes das suas áreas de atuação."
          dark
          className="mx-auto"
        />
        <div className="mt-10">
          <Button href="/artigos" variant="primary" size="lg">
            ACESSAR ARTIGOS
          </Button>
        </div>
      </div>
    </section>
  );
}
