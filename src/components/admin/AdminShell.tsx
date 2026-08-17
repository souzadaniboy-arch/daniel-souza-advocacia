"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogoMark } from "@/components/Logo";
import { MenuIcon, CloseIcon } from "@/components/icons";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/artigos", label: "Artigos" },
  { href: "/admin/calendario", label: "Calendário Editorial" },
  { href: "/admin/faq", label: "Perguntas Frequentes" },
  { href: "/admin/newsletters", label: "Newsletter" },
  { href: "/admin/inscritos", label: "Inscritos" },
  { href: "/admin/mensagens", label: "Mensagens" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/usuarios", label: "Usuários" },
  { href: "/admin/configuracoes", label: "Configurações" },
  { href: "/admin/seo", label: "SEO" },
  { href: "/admin/cookies", label: "Cookies & LGPD" },
  { href: "/admin/auditoria", label: "Auditoria" },
];

interface AdminShellProps {
  user: { name: string; email: string; role: string };
  children: React.ReactNode;
}

export function AdminShell({ user, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-brand-off-white">
      {/* Barra superior */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-brand-sand bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label={sidebarOpen ? "Fechar menu lateral" : "Abrir menu lateral"}
            className="flex h-10 w-10 items-center justify-center rounded-sm text-brand-graphite lg:hidden"
          >
            {sidebarOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
          <LogoMark className="h-9 w-9 text-brand-terracotta" />
          <span className="font-serif text-lg font-semibold text-brand-graphite">Painel Administrativo</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" target="_blank" className="btn-secondary px-4 py-2 text-xs">
            Ver site
          </Link>
          <button
            type="button"
            onClick={logout}
            className="rounded-sm px-3 py-2 text-sm text-brand-gray transition-colors hover:text-brand-deep"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 top-[57px] z-30 w-64 transform overflow-y-auto border-r border-brand-sand bg-white transition-transform lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-label="Navegação do painel"
        >
          <nav className="p-3">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`block rounded-sm px-4 py-2.5 text-sm transition-colors ${
                        isActive
                          ? "bg-brand-terracotta text-white"
                          : "text-brand-graphite hover:bg-brand-sand/50 hover:text-brand-deep"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Conteúdo */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <p className="text-sm text-brand-gray">Conectado como</p>
            <p className="font-serif text-lg text-brand-graphite">
              {user.name} <span className="text-xs uppercase tracking-wider text-brand-terracotta">({user.role})</span>
            </p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
