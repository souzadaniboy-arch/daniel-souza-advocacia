import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { SectionTitle } from "@/components/ui/SectionTitle";

export interface FaqPreviewItem {
  question: string;
  answer: string;
}

interface FaqPreviewProps {
  items: FaqPreviewItem[];
}

export function FaqPreview({ items }: FaqPreviewProps) {
  if (items.length === 0) return null;
  return (
    <section className="section-pad bg-brand-off-white">
      <div className="container-page max-w-4xl">
        <SectionTitle eyebrow="Perguntas frequentes" title="Dúvidas frequentes" className="mb-12" />
        <Accordion
          items={items.map((item, index) => ({
            id: `home-faq-${index}`,
            question: item.question,
            answer: <p>{item.answer}</p>,
          }))}
        />
        <div className="mt-10 text-center">
          <Link href="/faq" className="btn-secondary">
            VER TODAS AS PERGUNTAS
          </Link>
        </div>
      </div>
    </section>
  );
}
