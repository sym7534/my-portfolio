import { NextResponse } from "next/server";
import { getClientIp, getGeo } from "@/lib/api/request";
import { createRateLimiter } from "@/lib/api/rate-limit";
import { isWebhookConfigured, mentionPrefix, sendDiscordMessage } from "@/lib/api/discord";

const MAX_MESSAGE_LENGTH = 500;

const rateLimiter = createRateLimiter(5_000);

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

  if (!isWebhookConfigured()) {
    return NextResponse.json({ error: "Discord webhook not configured." }, { status: 500 });
  }

  const ip = getClientIp(request);
  const { city, region, country, latitude, longitude } = getGeo(request);
  if (rateLimiter.isLimited(ip)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const ok = await sendDiscordMessage(
    `${mentionPrefix()}New message:\n${message}\nIP: ${ip}\nLocation: ${city}, ${region}, ${country}\nCoords: ${latitude}, ${longitude}`
  );

  if (!ok) {
    return NextResponse.json({ error: "Discord webhook failed." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
