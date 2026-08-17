/**
 * SETUP DE PRODUÇÃO
 * ============================================================
 * Cria apenas o essencial: admin, settings e SEO.
 * Rode com: npx tsx prisma/setup.ts
 *
 * Variáveis de ambiente necessárias:
 *   DATABASE_URL, AUTH_SECRET, CONTACT_EMAIL, NEXT_PUBLIC_SITE_URL
 *
 * O usuário admin é criado com email/senha:
 *   admin@seudominio.com.br / Admin@2025!
 *   ALTERE A SENHA IMEDIATAMENTE APÓS O PRIMEIRO ACESSO.
 * ============================================================
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("=== SETUP DE PRODUÇÃO — Daniel de Souza Advocacia ===\n");

  // 1. Admin user
  const adminEmail = "admin@seudominio.com.br";
  const adminPassword = "Admin@2025!";

  const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existingUser) {
    console.log(`  Usuário admin já existe: ${adminEmail}`);
  } else {
    const hash = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: {
        name: "Administrador",
        email: adminEmail,
        passwordHash: hash,
        role: "ADMIN",
        active: true,
      },
    });
    console.log(`  Usuário admin criado: ${adminEmail}`);
    console.log(`  Senha: ${adminPassword}`);
    console.log("  >>> ALTERE A SENHA APÓS O PRIMEIRO ACESSO <<<\n");
  }

  // 2. Site settings (defaults)
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Daniel de Souza Advocacia e Consultoria Jurídica",
      shortName: "DS Advocacia",
      tagline: "Direito com estratégia, conhecimento e proximidade.",
      heroTitle: "Direito com estratégia, conhecimento e proximidade.",
      heroSubtitle: "Daniel de Souza Advocacia e Consultoria Jurídica",
      whatsappMessage: "Olá, gostaria de obter informações sobre o atendimento do escritório.",
    },
  });
  console.log("  Site settings inicializados");

  // 3. SEO settings
  await prisma.seoSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteTitle: "Daniel de Souza Advocacia e Consultoria Jurídica",
      siteDescription:
        "Advocacia e consultoria jurídica nas áreas Previdenciária, Trabalhista, Tributária, Bancária e Direitos das Pessoas Autistas.",
    },
  });
  console.log("  SEO settings inicializados");

  // 4. Configs básicas (cookies, LGPD)
  const configs: Record<string, string> = {
    "cookies.bannerText":
      "Este site utiliza cookies para garantir seu funcionamento e, quando autorizado, melhorar sua experiência.",
    "cookies.necessaryText":
      "São essenciais para o funcionamento básico do site, como navegação e segurança. Não podem ser desativados.",
    "cookies.preferencesText":
      "Permitem lembrar preferências e escolhas realizadas no site, melhorando a experiência de navegação.",
    "cookies.statisticsText":
      "Auxiliam na compreensão de como o site é utilizado, de forma anônima, para melhorias de conteúdo e desempenho.",
    "cookies.marketingText":
      "São utilizados para exibir conteúdo e comunicações mais relevantes, respeitando a escolha do usuário.",
    "legal.avisoJuridico":
      "Os conteúdos publicados neste site possuem caráter exclusivamente informativo e não substituem a análise jurídica individualizada de situações concretas.",
    "legal.avisoTitulo": "Aviso Jurídico",
    "politicaPrivacidade.titulo": "Política de Privacidade",
    "politicaPrivacidade.texto":
      "Em breve — política de privacidade completa em conformidade com a LGPD.",
    "politicaCookies.titulo": "Política de Cookies",
    "politicaCookies.texto":
      "Em breve — política de cookies detalhada em conformidade com a LGPD.",
  };
  for (const [key, value] of Object.entries(configs)) {
    await prisma.config.upsert({
      where: { key },
      update: { value },
      create: { key, value, type: "text" },
    });
  }
  console.log("  Configs de cookies/LGPD inicializadas");

  // 5. Categorias das áreas de atuação
  const areas = [
    { name: "Direito Previdenciário", slug: "direito-previdenciario", order: 1 },
    { name: "Direito Trabalhista", slug: "direito-trabalhista", order: 2 },
    { name: "Direito Tributário", slug: "direito-tributario", order: 3 },
    { name: "Direito Bancário", slug: "direito-bancario", order: 4 },
    { name: "Direitos das Pessoas Autistas", slug: "direitos-pessoas-autistas", order: 5 },
  ];
  for (const area of areas) {
    await prisma.category.upsert({
      where: { slug: area.slug },
      update: {},
      create: {
        name: area.name,
        slug: area.slug,
        type: "AREA",
        order: area.order,
        active: true,
      },
    });
  }
  console.log("  5 áreas de atuação criadas");

  // 6. Categorias de conteúdo
  const contentCats = [
    { name: "Artigos", slug: "artigos" },
    { name: "Novidades", slug: "novidades" },
  ];
  for (const cat of contentCats) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        type: "ARTICLE",
        active: true,
      },
    });
  }
  console.log("  2 categorias de conteúdo criadas");

  // 7. Author padrão
  await prisma.author.upsert({
    where: { slug: "daniel-de-souza" },
    update: {},
    create: {
      name: "Daniel de Souza",
      slug: "daniel-de-souza",
      active: true,
    },
  });
  console.log("  Author padrão criado");

  console.log("\n=== SETUP CONCLUÍDO ===");
  console.log("Acesse /admin para configurar o site com os dados reais.\n");
}

main()
  .catch((e) => {
    console.error("ERRO no setup:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
