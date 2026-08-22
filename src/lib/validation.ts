import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(3, "Informe seu nome completo").max(120),
  email: z.string().trim().email("Informe um e-mail válido").max(160),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  subject: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Escreva uma mensagem com mais detalhes").max(5000),
  consent: z.literal(true, {
    errorMap: () => ({ message: "É necessário autorizar o tratamento de dados." }),
  }),
  honeypot: z.string().max(0).optional().or(z.literal("")),
});

export const newsletterSchema = z.object({
  name: z.string().trim().min(3, "Informe seu nome").max(120),
  email: z.string().trim().email("Informe um e-mail válido").max(160),
  consent: z.literal(true, {
    errorMap: () => ({ message: "É necessário autorizar o recebimento de conteúdos." }),
  }),
  honeypot: z.string().max(0).optional().or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido"),
  password: z.string().min(8, "A senha deve ter ao menos 8 caracteres"),
});

export const articleSchema = z.object({
  title: z.string().trim().min(5).max(200),
  subtitle: z.string().trim().max(300).optional().or(z.literal("")),
  slug: z.string().trim().min(3).max(200).regex(/^[a-z0-9-]+$/, "Slug inválido (apenas letras minúsculas, números e hífens)"),
  summary: z.string().trim().max(500).optional().or(z.literal("")),
  content: z.string().trim().min(20),
  coverImage: z.string().trim().max(500).optional().or(z.literal("")),
  ogImage: z.string().trim().max(500).optional().or(z.literal("")),
  keywords: z.string().trim().max(300).optional().or(z.literal("")),
  metaTitle: z.string().trim().max(200).optional().or(z.literal("")),
  metaDescription: z.string().trim().max(300).optional().or(z.literal("")),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]),
  categoryId: z.string().min(1),
  authorId: z.string().optional().nullable(),
  featured: z.boolean().optional(),
  publishedAt: z.string().optional().nullable(),
  scheduledAt: z.string().optional().nullable(),
});

export const faqSchema = z.object({
  question: z.string().trim().min(5).max(300),
  answer: z.string().trim().min(10).max(5000),
  categoryId: z.string().optional().nullable(),
  order: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
});

export const categorySchema = z.object({
  name: z.string().trim().min(3).max(120),
  slug: z.string().trim().min(3).max(120).regex(/^[a-z0-9-]+$/, "Slug inválido"),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  whatsappMessage: z.string().trim().max(500).optional().or(z.literal("")),
  type: z.enum(["AREA", "ARTICLE"]),
  order: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
});

export const newsletterEditSchema = z.object({
  subject: z.string().trim().min(3).max(200),
  title: z.string().trim().min(3).max(200),
  intro: z.string().trim().max(500).optional().or(z.literal("")),
  content: z.string().trim().min(10),
  ctaLabel: z.string().trim().max(100).optional().or(z.literal("")),
  ctaUrl: z.string().trim().max(300).optional().or(z.literal("")),
  status: z.enum(["DRAFT", "SCHEDULED", "SENT"]),
  scheduledAt: z.string().optional().nullable(),
  articleIds: z.array(z.string()).optional(),
});

export const settingsSchema = z.object({
  name: z.string().trim().min(3).max(200),
  shortName: z.string().trim().max(60),
  tagline: z.string().trim().max(200),
  logo: z.string().trim().max(500).optional().or(z.literal("")),
  favicon: z.string().trim().max(500).optional().or(z.literal("")),
  oab: z.string().trim().max(60).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  whatsapp: z.string().trim().max(40).optional().or(z.literal("")),
  whatsappMessage: z.string().trim().max(500).optional().or(z.literal("")),
  instagram: z.string().trim().max(200).optional().or(z.literal("")),
  instagramProfile: z.string().trim().max(200).optional().or(z.literal("")),
  email: z.string().trim().email().optional().or(z.literal("")),
  address: z.string().trim().max(300).optional().or(z.literal("")),
  hours: z.string().trim().max(200).optional().or(z.literal("")),
  heroTitle: z.string().trim().min(5).max(200),
  heroSubtitle: z.string().trim().max(200),
  heroText: z.string().trim().max(600).optional().or(z.literal("")),
  institutionalPhrase: z.string().trim().max(1000).optional().or(z.literal("")),
  lawyerName: z.string().trim().max(200).optional().or(z.literal("")),
  lawyerPhoto: z.string().trim().max(500).optional().or(z.literal("")),
  lawyerBio: z.string().trim().max(5000).optional().or(z.literal("")),
  lawyerFormation: z.string().trim().max(1000).optional().or(z.literal("")),
  lawyerSpecializations: z.string().trim().max(2000).optional().or(z.literal("")),
  lawyerExperience: z.string().trim().max(5000).optional().or(z.literal("")),
  lawyerTrajectory: z.string().trim().max(5000).optional().or(z.literal("")),
});

export const seoSettingsSchema = z.object({
  siteTitle: z.string().trim().min(3).max(200),
  siteDescription: z.string().trim().min(10).max(300),
  ogImage: z.string().trim().max(500).optional().or(z.literal("")),
  twitterHandle: z.string().trim().max(60).optional().or(z.literal("")),
  robots: z.string().trim().max(100),
});

export const configSchema = z.object({
  key: z.string().trim().min(2).max(120),
  value: z.string().max(50000),
});
