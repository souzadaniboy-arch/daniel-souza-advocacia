import { NewsletterForm } from "@/components/NewsletterForm";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function NewsletterSection() {
  return (
    <section className="relative overflow-hidden bg-brand-deep py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-brand-sand blur-3xl" />
      </div>
      <div className="container-page relative grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-sand">Newsletter</p>
          <h2 className="font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Informação jurídica diretamente no seu e-mail.
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/80">
            Receba novos artigos e conteúdos jurídicos produzidos pelo escritório.
          </p>
        </div>
        <div className="rounded-sm bg-white p-6 shadow-lg sm:p-8">
          <NewsletterForm source="home" />
        </div>
      </div>
    </section>
  );
}
