/**
 * Minimal in-memory per-key rate limiter. State lives in module scope, so
 * limits are per serverless instance — a best-effort backstop, not a
 * security boundary (same behavior the routes had before extraction).
 */
export function createRateLimiter(windowMs: number) {
  const lastSeen = new Map<string, number>();

  return {
    /** Records the hit and returns true when the key is over the limit. */
    isLimited(key: string): boolean {
      const now = Date.now();
      const last = lastSeen.get(key);
      if (last && now - last < windowMs) {
        return true;
      }
      lastSeen.set(key, now);
      return false;
    },
  };
}
