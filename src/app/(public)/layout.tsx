import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CookieBanner } from "@/components/CookieBanner";
import { prisma } from "@/lib/prisma";
import { getSiteData } from "@/lib/settings";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const { settings } = await getSiteData();
  const areas = await prisma.category.findMany({
    where: { type: "AREA", active: true },
    select: { slug: true, whatsappMessage: true },
    orderBy: { order: "asc" },
  });

  const areaMessages = areas
    .filter((a) => a.whatsappMessage)
    .map((a) => ({
      path: `/areas/${a.slug}`,
      message: a.whatsappMessage ?? "",
    }));

  const bannerText = (await prisma.config.findUnique({ where: { key: "cookies.bannerText" } }))?.value;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        name={settings?.name ?? "Daniel de Souza Advocacia e Consultoria Jurídica"}
        shortName={settings?.shortName ?? "DS Advocacia"}
        logoUrl={settings?.logo}
        whatsapp={settings?.whatsapp}
        whatsappMessage={settings?.whatsappMessage ?? ""}
      />
      <main id="conteudo" className="flex-1">
        {children}
      </main>
      <Footer
        name={settings?.name ?? "Daniel de Souza Advocacia e Consultoria Jurídica"}
        shortName={settings?.shortName ?? "DS Advocacia"}
        logoUrl={settings?.logo}
        oab={settings?.oab}
        phone={settings?.phone}
        whatsapp={settings?.whatsapp}
        whatsappMessage={settings?.whatsappMessage ?? ""}
        instagram={settings?.instagram}
        email={settings?.email}
        address={settings?.address}
        hours={settings?.hours}
      />
      <WhatsAppButton
        whatsapp={settings?.whatsapp}
        defaultMessage={settings?.whatsappMessage ?? ""}
        areaMessages={areaMessages}
      />
      <CookieBanner bannerText={bannerText ?? "Este site utiliza cookies para garantir seu funcionamento e, quando autorizado, melhorar sua experiência."} />
    </div>
  );
}
