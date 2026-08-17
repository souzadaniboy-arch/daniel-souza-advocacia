/**
 * SEED DE DADOS DEMONSTRATIVOS
 * ============================================================
 * Todos os conteúdos institucionais criados abaixo são
 * claramente identificados como DEMO e DEVEM ser substituídos
 * pelas informações reais do escritório no painel administrativo
 * (/admin) antes da publicação.
 *
 * O usuário administrador criado é DEMO:
 *   e-mail:    admin@example.com
 *   senha:     Trocar123!
 * Altere imediatamente após o primeiro acesso.
 * ============================================================
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function main() {
  console.log("=== SEED DEMO — Daniel de Souza Advocacia ===");

  // ---------- SETTINGS PADRÃO ----------
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Daniel de Souza Advocacia e Consultoria Jurídica",
      shortName: "DS Advocacia",
      tagline: "Direito com estratégia, conhecimento e proximidade.",
      oab: "[INSERIR OAB]",
      whatsapp: "[INSERIR WHATSAPP]",
      whatsappMessage: "Olá, gostaria de obter informações sobre o atendimento do escritório.",
      instagram: "[INSERIR INSTAGRAM]",
      instagramProfile: "[INSERIR INSTAGRAM]",
      email: "[INSERIR E-MAIL]",
      address: "[INSERIR ENDEREÇO]",
      hours: "[INSERIR HORÁRIO DE ATENDIMENTO]",
      heroTitle: "Direito com estratégia, conhecimento e proximidade.",
      heroSubtitle: "Daniel de Souza Advocacia e Consultoria Jurídica",
      heroText:
        "Atuação jurídica nas áreas Previdenciária, Trabalhista, Tributária, Bancária e na proteção dos direitos das pessoas autistas.",
      institutionalPhrase:
        "Cada questão jurídica possui uma história, um contexto e consequências próprias.\nPor isso, a atuação jurídica começa pela compreensão cuidadosa dos fatos, documentos e objetivos envolvidos.",
      lawyerName: "[INSERIR NOME DO ADVOGADO]",
      lawyerBio: "[INSERIR BIOGRAFIA]",
      lawyerFormation: "[INSERIR FORMAÇÃO]",
      lawyerSpecializations: "[INSERIR ESPECIALIZAÇÕES]",
      lawyerExperience: "[INSERIR EXPERIÊNCIA]",
      lawyerTrajectory: "[INSERIR TRAJETÓRIA PROFISSIONAL]",
    },
  });

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

  // Configurações de texto (LGPD, cookies, aviso jurídico) — DEMO
  const configs: Record<string, string> = {
    "legal.avisoJuridico":
      "Os conteúdos publicados neste site possuem caráter exclusivamente informativo e não substituem a análise jurídica individualizada de situações concretas.",
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
    "politicaPrivacidade.titulo": "Política de Privacidade",
    "politicaPrivacidade.texto":
      "Esta página está em preparação. Os textos institucionais serão preenchidos com as informações reais do escritório, incluindo a identificação do controlador, as finalidades do tratamento de dados, os direitos dos titulares previstos na Lei Geral de Proteção de Dados (Lei nº 13.709/2018) e os canais de contato com o Encarregado (DPO).",
    "politicaCookies.titulo": "Política de Cookies",
    "politicaCookies.texto":
      "Esta página está em preparação. Serão detalhadas as categorias de cookies utilizadas no site, suas finalidades, o tempo de armazenamento e a forma de gerir as preferências, em conformidade com a LGPD.",
    "legal.avisoTitulo": "Aviso Jurídico",
  };
  for (const [key, value] of Object.entries(configs)) {
    await prisma.config.upsert({
      where: { key },
      update: { value },
      create: { key, value, type: "text" },
    });
  }

  // ---------- CATEGORIAS (ÁREAS + CONTEÚDO) ----------
  const areas = [
    {
      name: "Direito Previdenciário",
      slug: "direito-previdenciario",
      description:
        "Orientação jurídica para compreender direitos previdenciários, regras de aposentadoria e questões relacionadas ao INSS.",
      whatsappMessage:
        "Olá, estou buscando informações sobre Direito Previdenciário.",
      order: 1,
    },
    {
      name: "Direito Trabalhista",
      slug: "direito-trabalhista",
      description:
        "Orientação jurídica sobre relações de trabalho e direitos decorrentes da relação entre empregado e empregador.",
      whatsappMessage: "Olá, estou buscando informações sobre Direito Trabalhista.",
      order: 2,
    },
    {
      name: "Direito Tributário",
      slug: "direito-tributario",
      description:
        "Orientação jurídica para questões relacionadas à tributação e às obrigações fiscais.",
      whatsappMessage: "Olá, estou buscando informações sobre uma questão tributária.",
      order: 3,
    },
    {
      name: "Direito Bancário",
      slug: "direito-bancario",
      description:
        "Análise jurídica de relações contratuais e conflitos envolvendo instituições financeiras.",
      whatsappMessage: "Olá, estou buscando informações sobre uma questão bancária.",
      order: 4,
    },
    {
      name: "Direitos das Pessoas Autistas",
      slug: "direitos-pessoas-autistas",
      description:
        "Informação e orientação jurídica para a proteção de direitos e promoção da inclusão.",
      whatsappMessage:
        "Olá, estou buscando informações sobre os direitos das pessoas autistas.",
      order: 5,
    },
  ];

  const areaMap: Record<string, string> = {};
  for (const area of areas) {
    const cat = await prisma.category.upsert({
      where: { slug: area.slug },
      update: area,
      create: { ...area, type: "AREA" },
    });
    areaMap[area.slug] = cat.id;
  }

  const contentCategories = [
    { name: "Notícias Jurídicas", slug: "noticias-juridicas", order: 6 },
    { name: "Orientação Jurídica", slug: "orientacao-juridica", order: 7 },
  ];
  for (const c of contentCategories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: c,
      create: { ...c, type: "ARTICLE" },
    });
  }

  // ---------- AUTOR (DEMO) ----------
  const author = await prisma.author.upsert({
    where: { slug: "daniel-de-souza" },
    update: {},
    create: {
      name: "Daniel de Souza",
      slug: "daniel-de-souza",
      bio: "Advogado — biografia em preparação [INSERIR BIOGRAFIA].",
      email: "[INSERIR E-MAIL]",
    },
  });

  // ---------- ADMIN DEMO ----------
  const passwordHash = await bcrypt.hash("Trocar123!", 12);
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Administrador (DEMO)",
      email: "admin@example.com",
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log("Usuário DEMO criado: admin@example.com / Trocar123!");

  // ---------- FAQ (30 perguntas) ----------
  const faqs: { q: string; a: string; area?: string }[] = [
    {
      q: "Como saber se já posso me aposentar?",
      a: "A possibilidade de aposentadoria depende de requisitos como idade, tempo de contribuição e regras aplicáveis no momento do pedido. A análise é individual, com base no histórico do Cadastro Nacional de Informações Sociais (CNIS) e demais documentos. Uma avaliação previdenciária pode indicar quais requisitos estão preenchidos.",
      area: "direito-previdenciario",
    },
    {
      q: "Qual regra de aposentadoria pode ser aplicável ao meu caso?",
      a: "Podem existir diferentes regras e formas de cálculo de acordo com a data de filiação e os períodos contribuídos. A regra aplicável depende de uma análise individual do histórico contributivo. Não é possível afirmar qual regra se aplica sem essa análise.",
      area: "direito-previdenciario",
    },
    {
      q: "O CNIS pode apresentar informações incorretas?",
      a: "O CNIS pode conter divergências, como vínculos ou contribuições não registrados ou registrados incorretamente. Quando há erro ou omissão, podem ser necessários documentos comprobatórios e, em alguns casos, procedimentos administrativos ou judiciais para correção.",
      area: "direito-previdenciario",
    },
    {
      q: "É possível revisar uma aposentadoria?",
      a: "Em determinadas situações, uma aposentadoria pode ser objeto de revisão, especialmente quando ocorre erro no cálculo, na concessão ou quando são identificados períodos contributivos não considerados. A viabilidade depende do caso concreto e do prazo legal.",
      area: "direito-previdenciario",
    },
    {
      q: "Quais documentos são importantes para uma análise previdenciária?",
      a: "São relevantes, entre outros: CNIS, documentos de identificação, carteiras de trabalho, carnês de contribuição, comprovantes de vínculos e guias de recolhimento. A lista completa depende da situação analisada.",
      area: "direito-previdenciario",
    },
    {
      q: "O planejamento previdenciário pode ajudar antes de pedir a aposentadoria?",
      a: "O planejamento previdenciário estuda o histórico contributivo e as regras possíveis para identificar, com responsabilidade, qual pode ser o melhor momento e a forma de requerer o benefício. É uma ferramenta de organização e informação, não de garantia de resultado.",
      area: "direito-previdenciario",
    },
    {
      q: "Quando pode existir vínculo de emprego?",
      a: "O vínculo de emprego pressupõe, entre outros requisitos, a pessoalidade, a subordinação, a habitualidade e a onerosidade. A análise é feita caso a caso, com base nos fatos e documentos da relação mantida.",
      area: "direito-trabalhista",
    },
    {
      q: "Como funcionam as horas extras?",
      a: "O trabalho em jornada superior à contratada pode gerar pagamento de horas extras, normalmente com adicional. A caracterização e o cálculo dependem da jornada, do regime aplicável e das condições do contrato de trabalho.",
      area: "direito-trabalhista",
    },
    {
      q: "Quais verbas podem ser devidas em uma rescisão?",
      a: "Na rescisão podem ser devidas verbas como saldo de salário, férias proporcionais ou vencidas, 13º salário proporcional e, conforme o tipo de desligamento, aviso prévio e multa sobre o FGTS. O cálculo depende do caso concreto.",
      area: "direito-trabalhista",
    },
    {
      q: "O trabalhador sem registro pode ter direitos trabalhistas?",
      a: "A ausência de registro na carteira de trabalho não retira, por si só, os direitos trabalhistas. Quando presentes os requisitos do vínculo de emprego, podem ser devidos os direitos correspondentes, que podem ser buscados administrativamente ou judicialmente.",
      area: "direito-trabalhista",
    },
    {
      q: "Como funciona o FGTS?",
      a: "O FGTS é um depósito mensal feito pelo empregador em conta vinculada do trabalhador. Em situações como demissão sem justa causa ou determinadas aquisições, é possível o saque. A regularidade dos depósitos deve ser verificada no extrato.",
      area: "direito-trabalhista",
    },
    {
      q: "Quando pode existir adicional de insalubridade ou periculosidade?",
      a: "O adicional de insalubridade está ligado a condições de trabalho nocivas à saúde, e o de periculosidade a atividades com risco acentuado, conforme normas técnicas. A caracterização depende de perícia e da atividade exercida.",
      area: "direito-trabalhista",
    },
    {
      q: "Um contrato bancário pode ser questionado judicialmente?",
      a: "Cláusulas e práticas contratuais podem ser objeto de análise e, quando houver ilegalidade, abusividade ou desrespeito à relação de consumo, a questão pode ser discutida judicialmente. Cada contrato deve ser examinado individualmente.",
      area: "direito-bancario",
    },
    {
      q: "Como analisar um contrato de empréstimo?",
      a: "A análise envolve a conferência de taxas, encargos, tarifas, amortizações, seguros e demais condições. A leitura cuidadosa e a comparação com as regras do mercado e com a legislação ajudam a identificar eventuais irregularidades.",
      area: "direito-bancario",
    },
    {
      q: "O que fazer diante de uma cobrança bancária que parece incorreta?",
      a: "É recomendável reunir os documentos do contrato e das cobranças e verificar os valores com atenção. A divergência pode ser questionada junto à instituição e, se necessário, por meios administrativos ou judiciais.",
      area: "direito-bancario",
    },
    {
      q: "Como funciona uma revisão de contrato bancário?",
      a: "A revisão contratual analisa as condições pactuadas e pode questionar cláusulas ou encargos que desrespeitem a legislação. A viabilidade depende do contrato e da situação concreta do consumidor.",
      area: "direito-bancario",
    },
    {
      q: "O banco pode realizar determinadas cobranças e tarifas?",
      a: "A cobrança de tarifas e encargos deve observar as regras aplicáveis às instituições financeiras. Quando a cobrança não encontra fundamento, é possível discuti-la com base na análise individual do contrato.",
      area: "direito-bancario",
    },
    {
      q: "O que fazer em caso de fraude bancária?",
      a: "Em caso de suspeita de fraude, é importante registrar a ocorrência, comunicar a instituição financeira e reunir comprovantes. A análise jurídica pode indicar os caminhos para buscar o reconhecimento do prejuízo e a responsabilização adequada.",
      area: "direito-bancario",
    },
    {
      q: "Uma cobrança tributária pode ser questionada?",
      a: "Cobranças tributárias podem ser discutidas administrativamente ou judicialmente quando não encontrarem fundamento legal ou quando houver vícios no lançamento. A análise depende do tributo e do caso concreto.",
      area: "direito-tributario",
    },
    {
      q: "Como funciona uma discussão administrativa tributária?",
      a: "A discussão administrativa ocorre perante os órgãos de julgamento do ente tributante e permite apresentar defesa e recursos antes da via judicial. Possui regras e prazos próprios, que devem ser observados.",
      area: "direito-tributario",
    },
    {
      q: "Quando uma questão tributária pode chegar ao Judiciário?",
      a: "Quando a questão não é resolvida na esfera administrativa ou quando há necessidade de discussão da legalidade da cobrança, o Poder Judiciário pode ser acionado, respeitados os requisitos e prazos legais.",
      area: "direito-tributario",
    },
    {
      q: "O planejamento tributário é permitido?",
      a: "O planejamento tributário, quando realizado dentro dos limites da lei e da boa-fé, é instrumento legítimo de organização das atividades. Ele não se confunde com práticas de simulação ou fraude, que são ilícitas.",
      area: "direito-tributario",
    },
    {
      q: "Quais documentos podem ser importantes em uma análise tributária?",
      a: "São relevantes documentos fiscais, contratos, notas fiscais, guias de recolhimento, autos de infração e comunicações dos órgãos tributantes. A necessidade depende da questão analisada.",
      area: "direito-tributario",
    },
    {
      q: "Como funciona uma cobrança fiscal?",
      a: "A cobrança fiscal segue o procedimento de lançamento do tributo e, na inadimplência, pode resultar em inscrição em dívida ativa e execução fiscal. Existindo questionamento, são possíveis defesas administrativas e judiciais.",
      area: "direito-tributario",
    },
    {
      q: "Quais são alguns dos principais direitos das pessoas autistas?",
      a: "As pessoas autistas possuem direitos em diferentes áreas, como saúde, educação, inclusão social e acesso a benefícios. A Lei nº 12.764/2012 instituiu a Política Nacional de Proteção dos Direitos da Pessoa com Transtorno do Espectro Autista. A aplicação depende do caso concreto.",
      area: "direitos-pessoas-autistas",
    },
    {
      q: "Quais direitos podem existir na área da educação?",
      a: "A pessoa autista tem direito à educação em todos os níveis, com as adaptações razoáveis necessárias, vedada a recusa de matrícula. O acompanhamento especializado e o suporte adequado podem ser garantidos conforme o caso.",
      area: "direitos-pessoas-autistas",
    },
    {
      q: "Quais questões relacionadas à saúde podem exigir análise jurídica?",
      a: "Situações como recusa de cobertura por planos de saúde, dificuldades de acesso a terapias e tratamentos multidisciplinares e questões envolvendo atendimento adequado podem exigir análise jurídica individual.",
      area: "direitos-pessoas-autistas",
    },
    {
      q: "O que fazer diante de uma situação de discriminação?",
      a: "A discriminação é vedada por lei. É importante registrar os fatos, reunir provas e buscar orientação jurídica para avaliar as medidas adequadas, que podem incluir procedimentos administrativos ou judiciais.",
      area: "direitos-pessoas-autistas",
    },
    {
      q: "Quais documentos são importantes para analisar uma situação envolvendo direitos da pessoa autista?",
      a: "Laudos e relatórios médicos e terapêuticos, documentos escolares, planos de saúde, contratos e comunicações com instituições podem ser relevantes para a análise. A necessidade depende do caso.",
      area: "direitos-pessoas-autistas",
    },
    {
      q: "Quando procurar orientação jurídica?",
      a: "A orientação jurídica é útil quando há dúvida sobre direitos, dificuldades de acesso a serviços, recusas ou situações de violação. A análise individualizada ajuda a compreender as possibilidades e os caminhos jurídicos.",
      area: "direitos-pessoas-autistas",
    },
  ];

  for (const [index, faq] of faqs.entries()) {
    await prisma.faq.upsert({
      where: { id: `demo-faq-${index + 1}` },
      update: {},
      create: {
        id: `demo-faq-${index + 1}`,
        question: faq.q,
        answer: faq.a,
        categoryId: faq.area ? areaMap[faq.area] : null,
        order: index + 1,
        active: true,
      },
    });
  }
  console.log("FAQ DEMO criada: 30 perguntas");

  // ---------- ARTIGOS DEMO ----------
  const demoTitles: { title: string; subtitle: string; area: string }[] = [
    {
      title: "[DEMO] Como saber qual regra de aposentadoria pode ser aplicável?",
      subtitle: "Entenda os pontos iniciais de uma análise previdenciária individual.",
      area: "direito-previdenciario",
    },
    {
      title: "[DEMO] Quais documentos podem ser importantes em uma reclamação trabalhista?",
      subtitle: "Uma orientação sobre organização de informações antes da análise jurídica.",
      area: "direito-trabalhista",
    },
    {
      title: "[DEMO] O que observar antes de questionar um contrato bancário?",
      subtitle: "Pontos de atenção na leitura de contratos e cobranças bancárias.",
      area: "direito-bancario",
    },
    {
      title: "[DEMO] Direitos das pessoas autistas na educação: o que a lei garante?",
      subtitle: "Um panorama informativo sobre inclusão escolar e adaptações razoáveis.",
      area: "direitos-pessoas-autistas",
    },
    {
      title: "[DEMO] Cobranças tributárias podem ser questionadas?",
      subtitle: "Noções iniciais sobre discussões administrativas e judiciais.",
      area: "direito-tributario",
    },
    {
      title: "[DEMO] O que é planejamento previdenciário?",
      subtitle: "Compreenda como a organização do histórico contributivo pode auxiliar.",
      area: "direito-previdenciario",
    },
  ];

  const now = new Date();
  for (const [index, item] of demoTitles.entries()) {
    const slug = slugify(item.title.replace(/\[DEMO\]\s*/g, ""));
    await prisma.article.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        title: item.title,
        subtitle: item.subtitle,
        summary:
          "[DEMO] Artigo demonstrativo. O conteúdo completo será substituído pela produção editorial real do escritório.",
        content: [
          "# " + item.title,
          "",
          "> **Aviso informativo:** este artigo é um exemplo demonstrativo (DEMO) e possui caráter exclusivamente informativo, não constituindo aconselhamento jurídico individualizado.",
          "",
          "## Introdução",
          "",
          "O objetivo deste conteúdo demonstrativo é ilustrar a estrutura padrão de publicação do site. Textos definitivos serão produzidos com responsabilidade editorial.",
          "",
          "## Desenvolvimento",
          "",
          "A atuação jurídica responsável começa pela compreensão cuidadosa dos fatos, dos documentos e dos objetivos envolvidos em cada situação.",
          "",
          "## Aspectos jurídicos",
          "",
          "Cada tema é tratado a partir de informações gerais e objetivas. A análise de casos concretos exige avaliação individualizada por profissional habilitado.",
          "",
          "## Conclusão",
          "",
          "Este é um conteúdo informativo. Para orientação sobre situações concretas, entre em contato com o escritório.",
        ].join("\n"),
        keywords: "demostração, conteúdo informativo",
        metaTitle: item.title,
        metaDescription: item.subtitle,
        coverImage: null,
        ogImage: null,
        readingTime: 3,
        status: "PUBLISHED",
        publishedAt: new Date(now.getTime() - index * 86400000),
        categoryId: areaMap[item.area],
        authorId: author.id,
        featured: index < 3,
      },
    });
  }
  console.log("Artigos DEMO criados: 6");

  // ---------- TÓPICOS POR ÁREA (config editável) ----------
  const areaTopics: Record<string, string[]> = {
    "direito-previdenciario": [
      "Aposentadorias",
      "Planejamento Previdenciário",
      "Revisão de Benefícios",
      "Benefícios Previdenciários",
      "Questões Administrativas",
      "Questões Judiciais",
    ],
    "direito-trabalhista": [
      "Vínculo de emprego",
      "Jornada de trabalho",
      "Horas extras",
      "Verbas rescisórias",
      "Férias",
      "FGTS",
      "Adicionais",
      "Rescisão",
      "Reclamações trabalhistas",
    ],
    "direito-tributario": [
      "Obrigações tributárias",
      "Cobranças",
      "Discussões administrativas",
      "Discussões judiciais",
      "Planejamento tributário",
      "Questões fiscais",
    ],
    "direito-bancario": [
      "Empréstimos",
      "Financiamentos",
      "Contratos bancários",
      "Cartões",
      "Cobranças",
      "Revisão contratual",
      "Relações de consumo",
      "Fraudes bancárias",
    ],
    "direitos-pessoas-autistas": [
      "Educação",
      "Saúde",
      "Inclusão",
      "Direitos fundamentais",
      "Relações com instituições de ensino",
      "Questões relacionadas a planos de saúde",
      "Benefícios e direitos sociais",
      "Proteção contra discriminação",
    ],
  };
  for (const [slug, topics] of Object.entries(areaTopics)) {
    await prisma.config.upsert({
      where: { key: `area.${slug}.topics` },
      update: { value: JSON.stringify(topics) },
      create: { key: `area.${slug}.topics`, value: JSON.stringify(topics), type: "json" },
    });
  }
  console.log("Tópicos por área criados: 5");

  console.log("=== SEED CONCLUÍDO ===");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
