"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { LogoMark } from "./Logo";
import { WhatsAppIcon, MenuIcon, CloseIcon } from "./icons";
import { buildWhatsAppUrl } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Início" },
  { href: "/quem-somos", label: "Quem Somos" },
  { href: "/areas-de-atuacao", label: "Áreas de Atuação" },
  { href: "/artigos", label: "Artigos" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/contato", label: "Contato" },
];

interface NavbarProps {
  name: string;
  shortName: string;
  logoUrl?: string | null;
  whatsapp?: string | null;
  whatsappMessage: string;
}

export function Navbar({ name, shortName, logoUrl, whatsapp, whatsappMessage }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const waUrl = whatsapp ? buildWhatsAppUrl(whatsapp, whatsappMessage) : "#";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen ? "bg-brand-off-white/95 shadow-sm backdrop-blur" : "bg-brand-off-white"
      }`}
    >
      <nav aria-label="Navegação principal" className="container-page flex items-center justify-between py-3">
        <Logo name={name} shortName={shortName} logoUrl={logoUrl} />

        {/* Desktop */}
        <div className="hidden items-center gap-7 lg:flex">
          <ul className="flex items-center gap-6">
            {NAV_ITEMS.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`text-sm font-medium tracking-wide transition-colors ${
                      isActive ? "text-brand-terracotta" : "text-brand-graphite hover:text-brand-terracotta"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          {whatsapp && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp px-5 py-2.5 text-xs"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>
          )}
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-3 lg:hidden">
          {whatsapp && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir conversa no WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white"
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
          )}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            className="flex h-10 w-10 items-center justify-center rounded-sm text-brand-graphite hover:text-brand-terracotta"
          >
            {mobileOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div id="mobile-menu" className="border-t border-brand-sand bg-brand-off-white lg:hidden">
          <div className="container-page py-4">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`block rounded-sm px-3 py-3 font-serif text-lg ${
                        isActive ? "text-brand-terracotta" : "text-brand-graphite hover:text-brand-terracotta"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            {whatsapp && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp mt-4 w-full"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Falar no WhatsApp
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
