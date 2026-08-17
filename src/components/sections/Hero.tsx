import { Button } from "@/components/ui/Button";

interface HeroProps {
  title: string;
  subtitle: string;
  text: string;
}

export function Hero({ title, subtitle, text }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-brand-sand/50 blur-3xl" />
        <div className="absolute -bottom-48 -left-32 h-[420px] w-[420px] rounded-full bg-brand-sand/30 blur-3xl" />
      </div>
      <div className="container-page relative flex flex-col items-center py-24 text-center sm:py-32 lg:py-40">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-brand-terracotta">
          Advocacia e Consultoria Jurídica
        </p>
        <h1 className="max-w-4xl font-serif text-4xl font-semibold leading-[1.1] text-brand-graphite sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-6 font-serif text-xl text-brand-terracotta sm:text-2xl">{subtitle}</p>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-brand-gray sm:text-lg">{text}</p>
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
          <Button href="/areas-de-atuacao" variant="primary" size="lg">
            CONHEÇA NOSSAS ÁREAS
          </Button>
          <Button href="/contato" variant="secondary" size="lg">
            FALE CONOSCO
          </Button>
        </div>
      </div>
    </section>
  );
}
