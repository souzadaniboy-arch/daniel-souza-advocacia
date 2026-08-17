import Link from "next/link";
import { Logo } from "./Logo";
import {
  WhatsAppIcon,
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
} from "./icons";
import { buildWhatsAppUrl, buildInstagramUrl } from "@/lib/utils";
import { CookiePrefsLink } from "./CookieBanner";

interface FooterProps {
  name: string;
  shortName: string;
  logoUrl?: string | null;
  oab?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  whatsappMessage: string;
  instagram?: string | null;
  email?: string | null;
  address?: string | null;
  hours?: string | null;
}

const institutionalLinks = [
  { href: "/quem-somos", label: "Quem Somos" },
  { href: "/contato", label: "Contato" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/politica-de-privacidade", label: "Política de Privacidade" },
];

const areaLinks = [
  { href: "/areas/direito-previdenciario", label: "Direito Previdenciário" },
  { href: "/areas/direito-trabalhista", label: "Direito Trabalhista" },
  { href: "/areas/direito-tributario", label: "Direito Tributário" },
  { href: "/areas/direito-bancario", label: "Direito Bancário" },
  { href: "/areas/direitos-pessoas-autistas", label: "Direitos das Pessoas Autistas" },
];

const contentLinks = [
  { href: "/artigos", label: "Artigos" },
  { href: "/faq", label: "Perguntas Frequentes" },
  { href: "/areas-de-atuacao", label: "Áreas de Atuação" },
];

export function Footer({
  name,
  shortName,
  logoUrl,
  oab,
  phone,
  whatsapp,
  whatsappMessage,
  instagram,
  email,
  address,
  hours,
}: FooterProps) {
  const waUrl = whatsapp ? buildWhatsAppUrl(whatsapp, whatsappMessage) : "#";
  const igUrl = buildInstagramUrl(instagram ?? "");

  return (
    <footer className="bg-brand-graphite text-brand-off-white">
      <div className="container-page grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-5 lg:py-20">
        {/* Coluna 1 */}
        <div className="lg:col-span-2">
          <Logo name={name} shortName={shortName} logoUrl={logoUrl} variant="light" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-brand-off-white/70">
            {name}. Direito com estratégia, conhecimento e proximidade.
          </p>
          {oab ? <p className="mt-3 text-xs uppercase tracking-wider text-brand-sand/70">OAB {oab}</p> : null}
        </div>

        {/* Coluna 2 — Institucional */}
        <nav aria-label="Links institucionais">
          <h2 className="mb-4 font-serif text-lg text-white">Institucional</h2>
          <ul className="space-y-2.5 text-sm">
            {institutionalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-brand-off-white/70 transition-colors hover:text-brand-sand">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Coluna 3 — Áreas */}
        <nav aria-label="Áreas de atuação">
          <h2 className="mb-4 font-serif text-lg text-white">Áreas de Atuação</h2>
          <ul className="space-y-2.5 text-sm">
            {areaLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-brand-off-white/70 transition-colors hover:text-brand-sand">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Coluna 4 — Conteúdo */}
        <nav aria-label="Conteúdo">
          <h2 className="mb-4 font-serif text-lg text-white">Conteúdo</h2>
          <ul className="space-y-2.5 text-sm">
            {contentLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-brand-off-white/70 transition-colors hover:text-brand-sand">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Coluna 5 — Contato (linha adicional) */}
      <div className="border-t border-white/10">
        <div className="container-page grid grid-cols-1 gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {phone && (
            <p className="flex items-center gap-3 text-sm text-brand-off-white/80">
              <PhoneIcon className="h-4 w-4 shrink-0 text-brand-terracotta" aria-hidden="true" />
              {phone}
            </p>
          )}
          {email && (
            <p className="flex items-center gap-3 text-sm text-brand-off-white/80">
              <MailIcon className="h-4 w-4 shrink-0 text-brand-terracotta" aria-hidden="true" />
              {email}
            </p>
          )}
          {address && (
            <p className="flex items-center gap-3 text-sm text-brand-off-white/80">
              <MapPinIcon className="h-4 w-4 shrink-0 text-brand-terracotta" aria-hidden="true" />
              {address}
            </p>
          )}
          {hours && (
            <p className="flex items-center gap-3 text-sm text-brand-off-white/80">
              <ClockIcon className="h-4 w-4 shrink-0 text-brand-terracotta" aria-hidden="true" />
              {hours}
            </p>
          )}
        </div>
      </div>

      {/* Rodapé inferior */}
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-brand-off-white/50">
            © {new Date().getFullYear()} {name}. Todos os direitos reservados.
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-4 text-xs text-brand-off-white/60">
            <li>
              <Link href="/politica-de-privacidade" className="hover:text-brand-sand">
                Política de Privacidade
              </Link>
            </li>
            <li>
              <Link href="/politica-de-cookies" className="hover:text-brand-sand">
                Política de Cookies
              </Link>
            </li>
            <li>
              <Link href="/aviso-juridico" className="hover:text-brand-sand">
                Aviso Jurídico
              </Link>
            </li>
            <li>
              <CookiePrefsLink />
            </li>
            {instagram && instagram !== "[INSERIR INSTAGRAM]" && (
              <li>
                <a
                  href={igUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram do escritório"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-brand-off-white/70 hover:text-brand-sand"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
              </li>
            )}
            {whatsapp && (
              <li>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp do escritório"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-brand-off-white/70 hover:text-brand-sand"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                </a>
              </li>
            )}
          </ul>
        </div>
        <div className="border-t border-white/10">
          <p className="container-page py-4 text-center text-xs leading-relaxed text-brand-off-white/40">
            Os conteúdos publicados neste site possuem caráter exclusivamente informativo e não substituem a
            análise jurídica individualizada de situações concretas.
          </p>
        </div>
      </div>
    </footer>
  );
}
