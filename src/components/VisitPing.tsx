"use client";

import { useEffect } from "react";
import { UNLOCK_HOST } from "@/lib/useUnlock";

/**
 * Fire-and-forget visit notification — but not on the recruiter subdomain,
 * which sends its own "PORTFOLIO VISITED BY RECRUITER" ping (avoids a dupe).
 * Renders nothing.
 */
export function VisitPing() {
  useEffect(() => {
    if (window.location.hostname === UNLOCK_HOST) return;
    fetch("/api/visit", { method: "POST" });
  }, []);

  return null;
}
