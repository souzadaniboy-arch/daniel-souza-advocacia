import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

interface LegalPageProps {
  title: string;
  breadcrumbName: string;
  lastUpdated?: string;
  children: ReactNode;
}

export function LegalPage({ title, breadcrumbName, lastUpdated, children }: LegalPageProps) {
  return (
    <>
      <section className="bg-brand-off-white">
        <div className="container-page py-14 sm:py-16">
          <div className="mb-8">
            <Breadcrumb items={[{ name: "Início", path: "/" }, { name: breadcrumbName }]} />
          </div>
          <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-tight text-brand-graphite sm:text-5xl">
            {title}
          </h1>
          {lastUpdated && <p className="mt-3 text-sm text-brand-gray">Última atualização: {lastUpdated}</p>}
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="container-page max-w-3xl">
          <div className="prose-article">{children}</div>
        </div>
      </section>
    </>
  );
}
