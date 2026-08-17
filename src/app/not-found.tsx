import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-serif text-8xl font-light text-brand-terracotta">404</p>
      <h1 className="mt-6 font-serif text-3xl font-semibold text-brand-graphite">Página não encontrada</h1>
      <p className="mt-4 max-w-md text-brand-gray">
        A página que você procura não existe ou foi movida. Utilize o menu para continuar navegando.
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Button href="/">IR PARA A PÁGINA INICIAL</Button>
        <Button href="/contato" variant="secondary">
          FALAR COM O ESCRITÓRIO
        </Button>
      </div>
    </div>
  );
}
