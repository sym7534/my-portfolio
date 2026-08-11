import { NextResponse } from "next/server";
import { getClientIp, getGeo } from "@/lib/api/request";
import { createRateLimiter } from "@/lib/api/rate-limit";
import { isWebhookConfigured, sendDiscordMessage } from "@/lib/api/discord";

// 30 minutes per IP
const rateLimiter = createRateLimiter(30 * 60 * 1000);

export async function POST(request: Request) {
  if (!isWebhookConfigured()) {
    return NextResponse.json({ error: "Discord webhook not configured." }, { status: 500 });
  }

  const ip = getClientIp(request);
  if (rateLimiter.isLimited(ip)) {
    return NextResponse.json({ ok: true }); // silently ignore
  }

  const { city, region, country } = getGeo(request);
  const referrer = request.headers.get("referer") || "direct";
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const timestamp = new Date().toISOString();

  await sendDiscordMessage(
    `Site visit\nTime: ${timestamp}\nLocation: ${city}, ${region}, ${country}\nReferrer: ${referrer}\nBrowser: ${userAgent}\nIP: ${ip}`
  );

  return NextResponse.json({ ok: true });
}
