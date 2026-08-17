import { getSiteData } from "./settings";

export const HONEYPOT_FIELD = "empresa_website";

export function assertSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    const expected = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").origin;
    return new URL(origin).origin === expected;
  } catch {
    return false;
  }
}

export function isLikelySpam(formData: FormData): boolean {
  const honeypot = formData.get(HONEYPOT_FIELD)?.toString() ?? "";
  if (honeypot.length > 0) return true;

  const email = (formData.get("email")?.toString() ?? "").toLowerCase();
  const message = (formData.get("message")?.toString() ?? formData.get("name")?.toString() ?? "").toLowerCase();

  const blockedTokens = [
    "http://", "https://", "www.",
    "viagra", "crypto", "bitcoin", "casino",
    "seo service", "backlink", "buy now",
    "cheap", "discount 90%",
  ];
  for (const token of blockedTokens) {
    if (message.includes(token)) return true;
  }

  const disposableDomains = [
    "mailinator.com", "guerrillamail.com", "temp-mail.org",
    "10minutemail.com", "yopmail.com", "trashmail.com",
  ];
  for (const domain of disposableDomains) {
    if (email.endsWith(`@${domain}`)) return true;
  }

  return false;
}

export async function getWhatsAppContext(path: string): Promise<string> {
  const { settings } = await getSiteData();
  const defaultMessage = settings?.whatsappMessage ?? "Olá, gostaria de obter informações sobre o atendimento do escritório.";

  const areaRoutes: { prefix: string; message: string }[] = [
    { prefix: "/areas/direito-previdenciario", message: "Olá, estou buscando informações sobre Direito Previdenciário." },
    { prefix: "/areas/direito-trabalhista", message: "Olá, estou buscando informações sobre Direito Trabalhista." },
    { prefix: "/areas/direito-tributario", message: "Olá, estou buscando informações sobre uma questão tributária." },
    { prefix: "/areas/direito-bancario", message: "Olá, estou buscando informações sobre uma questão bancária." },
    { prefix: "/areas/direitos-pessoas-autistas", message: "Olá, estou buscando informações sobre os direitos das pessoas autistas." },
  ];

  for (const route of areaRoutes) {
    if (path.startsWith(route.prefix)) return route.message;
  }
  return defaultMessage;
}
