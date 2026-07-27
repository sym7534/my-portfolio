"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * SSR-safe media query hook. Server render and the hydration render both
 * report false; the real value applies immediately after hydration and
 * stays subscribed to changes.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onStoreChange);
      return () => mql.removeEventListener("change", onStoreChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

/** Below the lg breakpoint — matches the original per-component hooks. */
export function useIsMobile() {
  return useMediaQuery("(max-width: 1023px)");
}
