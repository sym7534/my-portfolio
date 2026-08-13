"use client";

import { useEffect, useState } from "react";

/**
 * Secret-link unlock via a discreet subdomain: visiting
 * `https://portfolio.wangdynasty.ca` (which just looks like a normal URL)
 * reveals the projects flagged `hidden` and pings Discord once per session.
 * The apex domain (wangdynasty.ca) always shows the normal set.
 *
 * Client-side easter egg: the host check ships in the JS bundle, so it's
 * discoverable by a determined snoop — fine for this, not for private data.
 */
export const UNLOCK_HOST = "portfolio.wangdynasty.ca";
const PING_KEY = "wd_pinged";

export function useUnlock(): boolean {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    // Local development always reveals the full set (including projects
    // flagged `hidden`) so the whole grid is reviewable on localhost:3000.
    // Production behavior is unchanged: only the secret host unlocks.
    const isDev = process.env.NODE_ENV === "development";

    if (!isDev) {
      if (window.location.hostname !== UNLOCK_HOST) return;

      // ping Discord once per browser session so refresh/navigation doesn't spam
      let pinged = false;
      try {
        pinged = sessionStorage.getItem(PING_KEY) === "1";
      } catch {}
      if (!pinged) {
        try {
          sessionStorage.setItem(PING_KEY, "1");
        } catch {}
        void fetch("/api/unlock", { method: "POST" }).catch(() => {});
      }
    }

    // reveal must happen post-mount (window) — matching SSR (locked) first
    // keeps hydration consistent
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUnlocked(true);
  }, []);

  return unlocked;
}
