interface InstitutionalPhraseProps {
  phrase?: string | null;
}

export function InstitutionalPhrase({ phrase }: InstitutionalPhraseProps) {
  const defaultPhrase =
    "Cada questão jurídica possui uma história, um contexto e consequências próprias.\nPor isso, a atuação jurídica começa pela compreensão cuidadosa dos fatos, documentos e objetivos envolvidos.";

  const text = phrase ?? defaultPhrase;
  const [first, ...rest] = text.split("\n");

  return (
    <section className="border-y border-brand-sand bg-white">
      <div className="container-page py-16 text-center sm:py-20">
        <span className="mx-auto mb-6 block h-px w-16 bg-brand-terracotta" aria-hidden="true" />
        <p className="mx-auto max-w-3xl font-serif text-2xl font-medium leading-relaxed text-brand-graphite sm:text-3xl">
          {first}
        </p>
        {rest.length > 0 && (
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-brand-gray sm:text-lg">
            {rest.join("\n")}
          </p>
        )}
      </div>
    </section>
  );
}
