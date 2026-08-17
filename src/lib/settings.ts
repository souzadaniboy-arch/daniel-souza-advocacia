import { prisma } from "./prisma";

let cache: {
  settings?: Awaited<ReturnType<typeof loadSettings>>;
  at?: number;
} = {};

const TTL = 60_000;

async function loadSettings() {
  const [settings, seo, configs] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    prisma.seoSettings.findUnique({ where: { id: 1 } }),
    prisma.config.findMany(),
  ]);

  const configMap: Record<string, string> = {};
  for (const c of configs) configMap[c.key] = c.value ?? "";

  return { settings, seo, configs: configMap };
}

export async function getSiteData(): Promise<Awaited<ReturnType<typeof loadSettings>>> {
  if (cache.settings && cache.at && Date.now() - cache.at < TTL) {
    return cache.settings;
  }
  cache.settings = await loadSettings();
  cache.at = Date.now();
  return cache.settings;
}

export async function getSetting(key: string): Promise<string> {
  const config = await prisma.config.findUnique({ where: { key } });
  return config?.value ?? "";
}

export function clearSiteDataCache(): void {
  cache = {};
}
