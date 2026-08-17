import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { LogoMark } from "@/components/Logo";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Acesso Restrito",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-off-white px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-sm bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <LogoMark className="mx-auto h-14 w-14 text-brand-terracotta" />
            <h1 className="mt-4 font-serif text-2xl font-semibold text-brand-graphite">Área administrativa</h1>
            <p className="mt-2 text-sm text-brand-gray">Acesso restrito à equipe do escritório.</p>
          </div>
          <LoginForm />
          <p className="mt-6 text-center text-xs text-brand-gray">
            Acesso DEMO: admin@example.com / Trocar123! (altere após o primeiro acesso)
          </p>
        </div>
      </div>
    </div>
  );
}
