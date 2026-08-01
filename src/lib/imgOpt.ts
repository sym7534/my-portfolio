/**
 * URL for a resized/re-encoded copy of a public image via Next's image
 * optimizer (same endpoint next/image uses). For the plain <img> spots —
 * modal hero, carousel cells, canvas sampling — where next/image's layout
 * behavior isn't wanted but shipping multi-MB PNGs is absurd.
 * Widths must exist in the optimizer's default allowlist.
 */
export function imgOpt(
  src: string,
  width: 384 | 640 | 1080 | 1920 = 1080,
  quality = 75
): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}
