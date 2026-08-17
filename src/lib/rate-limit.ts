import { getClientIp } from "./utils";

interface Bucket {
  hits: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60_000;
const LIMITS: Record<string, number> = {
  default: 60,
  "/api/contact": 5,
  "/api/newsletter": 5,
  "/api/auth/login": 5,
};

function cleanup() {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}

export async function rateLimit(req: Request): Promise<{ ok: boolean; retryAfter?: number }> {
  cleanup();
  const ip = getClientIp(req);
  const url = new URL(req.url);
  const limit = LIMITS[url.pathname] ?? LIMITS.default;
  const key = `${ip}:${url.pathname}`;

  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { hits: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }

  bucket.hits += 1;
  if (bucket.hits > limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true };
}
