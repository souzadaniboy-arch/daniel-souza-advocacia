import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { LogoMark } from "@/components/Logo";
import { LoginForm } from "@/components/admin/LoginForm";
import { getSiteData } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Acesso Restrito",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/admin");

  let logoUrl: string | null = null;
  try {
    const data = await getSiteData();
    logoUrl = data.settings?.logo ?? null;
  } catch {
    // Banco indisponível — usa o monograma padrão
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-off-white px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-sm bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Logo do escritório" className="mx-auto h-14 w-auto max-w-40 object-contain" />
            ) : (
              <LogoMark className="mx-auto h-14 w-14 text-brand-terracotta" />
            )}
            <h1 className="mt-4 font-serif text-2xl font-semibold text-brand-graphite">Área administrativa</h1>
            <p className="mt-2 text-sm text-brand-gray">Acesso restrito à equipe do escritório.</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
