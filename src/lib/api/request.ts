/**
 * Best-effort client IP from proxy headers (Vercel sets x-forwarded-for).
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

/** Vercel geo headers, normalized with "unknown" fallbacks. */
export function getGeo(request: Request) {
  return {
    city: request.headers.get("x-vercel-ip-city") ?? "unknown",
    region: request.headers.get("x-vercel-ip-country-region") ?? "unknown",
    country: request.headers.get("x-vercel-ip-country") ?? "unknown",
    latitude: request.headers.get("x-vercel-ip-latitude") ?? "unknown",
    longitude: request.headers.get("x-vercel-ip-longitude") ?? "unknown",
  };
}
