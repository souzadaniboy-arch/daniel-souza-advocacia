import { SectionTitle } from "@/components/ui/SectionTitle";

const PILLARS = [
  {
    title: "Análise Individualizada",
    text: "Cada situação possui fatos, documentos e circunstâncias próprias.",
  },
  {
    title: "Estratégia",
    text: "A atuação jurídica deve considerar alternativas, riscos e consequências.",
  },
  {
    title: "Conhecimento",
    text: "Informação jurídica clara é parte fundamental de uma boa orientação.",
  },
  {
    title: "Proximidade",
    text: "Comunicação transparente e acessível durante o atendimento.",
  },
];

export function Pillars() {
  return (
    <section className="section-pad bg-brand-sand/30">
      <div className="container-page">
        <SectionTitle
          title="Uma atuação jurídica baseada em quatro pilares"
          className="mb-14"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar, index) => (
            <div
              key={pillar.title}
              className="group relative rounded-sm bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="font-serif text-5xl font-light text-brand-sand transition-colors group-hover:text-brand-terracotta" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-serif text-xl font-semibold text-brand-graphite">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-gray">{pillar.text}</p>
              <span className="mt-6 block h-0.5 w-10 bg-brand-terracotta" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
