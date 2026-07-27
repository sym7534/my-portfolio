"use client";

import { useState } from "react";

/**
 * State + submit handler for the "leave me a message" box (Discord webhook).
 * Resolves true when the message was accepted, so callers can show a confirmation.
 */
export function useSendMessage() {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (): Promise<boolean> => {
    if (isSending) {
      return false;
    }

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return false;
    }

    setIsSending(true);
    try {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedMessage }),
      });

      if (!response.ok) {
        throw new Error(`Message send failed: ${response.status}`);
      }

      setMessage("");
      return true;
    } catch (error) {
      console.error("Failed to send message", error);
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return { message, setMessage, isSending, handleSendMessage };
}
