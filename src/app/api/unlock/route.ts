import { NextResponse } from "next/server";

const RATE_LIMIT_MS = 60 * 1000; // 1 min per IP (backstop against rapid re-hits)
const rateLimitByIp = new Map<string, number>();

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

// Pinged (with a mention) when someone visits via the secret recruiter subdomain.
export async function POST(request: Request) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: "Discord webhook not configured." }, { status: 500 });
  }

  const ip = getClientIp(request);
  const now = Date.now();
  const last = rateLimitByIp.get(ip);
  if (last && now - last < RATE_LIMIT_MS) {
    return NextResponse.json({ ok: true }); // silently ignore rapid re-hits
  }
  rateLimitByIp.set(ip, now);

  const city = request.headers.get("x-vercel-ip-city") ?? "unknown";
  const region = request.headers.get("x-vercel-ip-country-region") ?? "unknown";
  const country = request.headers.get("x-vercel-ip-country") ?? "unknown";
  const referrer = request.headers.get("referer") || "direct";
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const timestamp = new Date(now).toISOString();

  const content = `<@713211567893774487> **PORTFOLIO VISITED BY RECRUITER**\nTime: ${timestamp}\nLocation: ${city}, ${region}, ${country}\nReferrer: ${referrer}\nBrowser: ${userAgent}\nIP: ${ip}`;

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  return NextResponse.json({ ok: true });
}
