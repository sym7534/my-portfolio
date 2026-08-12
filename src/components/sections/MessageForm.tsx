"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Section } from "@/components/ui/Section";
import { useSendMessage } from "@/lib/useSendMessage";
import { cn } from "@/lib/utils";

/**
 * "Leave me a message" box. Client component: form state plus the
 * whoosh-out animation of the submitted text.
 */
export function MessageForm() {
  const { message, setMessage, isSending, handleSendMessage } = useSendMessage();
  const [sent, setSent] = useState(false);
  // text captured on submit that "whooshes" out of the input (slide + blur)
  const [flying, setFlying] = useState<{ key: number; text: string } | null>(null);
  const flyKeyRef = useRef(0);

  const send = async () => {
    const ok = await handleSendMessage();
    if (ok) {
      setSent(true);
      window.setTimeout(() => setSent(false), 2500);
    }
  };

  return (
    <Section className="mt-[clamp(1.25rem,3.5vh,2.5rem)]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const raw = message;
          const hasText = message.trim().length > 0;
          void send(); // captures + sends the current text synchronously
          if (hasText) {
            flyKeyRef.current += 1;
            setFlying({ key: flyKeyRef.current, text: raw });
            setMessage(""); // clear the field so only the flying copy shows
          }
        }}
      >
        <div className="relative w-full max-w-[280px] overflow-hidden">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={sent ? "sent :)" : "leave me a message"}
            maxLength={500}
            aria-label="Leave a message"
            aria-busy={isSending}
            className={cn(
              "w-full border-0 border-b border-border-card bg-transparent py-1.5",
              "font-serif text-[15px] italic text-text-primary",
              "placeholder:text-text-muted/70 focus:border-text-muted focus:outline-none",
              "transition-colors"
            )}
          />
          {flying && (
            <motion.span
              key={flying.key}
              aria-hidden="true"
              initial={{ x: 0, opacity: 1, filter: "blur(0px)" }}
              animate={{ x: 220, opacity: 0, filter: "blur(12px)" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onAnimationComplete={() =>
                setFlying((f) => (f && f.key === flying.key ? null : f))
              }
              className="pointer-events-none absolute inset-0 flex items-center whitespace-nowrap font-serif text-[15px] italic text-text-primary"
            >
              {flying.text}
            </motion.span>
          )}
        </div>
      </form>
    </Section>
  );
}
