import { NextResponse } from "next/server";

const RATE_LIMIT_MS = 5_000;
const MAX_MESSAGE_LENGTH = 500;

const rateLimitByIp = new Map<string, number>();

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  let body: { message?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof body.message !== "string") {
    return NextResponse.json({ error: "Message must be a string." }, { status: 400 });
  }

  const message = body.message.trim();
  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message must be under ${MAX_MESSAGE_LENGTH} characters.` },
      { status: 400 }
    );
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: "Discord webhook not configured." }, { status: 500 });
  }

  const ip = getClientIp(request);
  const country = request.headers.get("x-vercel-ip-country") ?? "unknown";
  const region = request.headers.get("x-vercel-ip-country-region") ?? "unknown";
  const city = request.headers.get("x-vercel-ip-city") ?? "unknown";
  const latitude = request.headers.get("x-vercel-ip-latitude") ?? "unknown";
  const longitude = request.headers.get("x-vercel-ip-longitude") ?? "unknown";
  const now = Date.now();
  const lastSentAt = rateLimitByIp.get(ip);
  if (lastSentAt && now - lastSentAt < RATE_LIMIT_MS) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }
  rateLimitByIp.set(ip, now);

  const discordResponse = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: `<@713211567893774487> New message:\n${message}\nIP: ${ip}\nLocation: ${city}, ${region}, ${country}\nCoords: ${latitude}, ${longitude}`,
    }),
  });

  if (!discordResponse.ok) {
    return NextResponse.json({ error: "Discord webhook failed." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
