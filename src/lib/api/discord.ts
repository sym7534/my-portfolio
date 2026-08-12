/**
 * Discord webhook notifications for the API routes.
 * Requires DISCORD_WEBHOOK_URL; DISCORD_MENTION_ID is optional and enables
 * the @mention prefix used for high-signal pings.
 */

export function isWebhookConfigured(): boolean {
  return Boolean(process.env.DISCORD_WEBHOOK_URL);
}

/** `<@id> ` prefix when DISCORD_MENTION_ID is set, else empty string. */
export function mentionPrefix(): string {
  const id = process.env.DISCORD_MENTION_ID;
  return id ? `<@${id}> ` : "";
}

/** Posts a message to the webhook. Returns whether Discord accepted it. */
export async function sendDiscordMessage(content: string): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return false;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  return response.ok;
}
