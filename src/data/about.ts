import type { AboutIconKey } from "@/types/about";

/**
 * A sentence is a sequence of segments: plain text, or an inline icon
 * followed by its label (rendered together in an inline-flex wrapper).
 * Exact strings matter — spacing is reproduced verbatim from the original markup.
 */
export type AboutSegment = string | { icon: AboutIconKey; label: string };

export interface AboutItem {
  segments: AboutSegment[];
  subline?: string;
}

export const aboutItems: AboutItem[] = [
  {
    segments: ["Proud", { icon: "canada", label: "Canadian citizen." }],
    subline: "↳ Currently in Waterloo, grew up in Calgary.",
  },
  {
    segments: [
      "Favorite game:",
      { icon: "minecraft", label: "Minecraft" },
      "; currently playing",
      { icon: "balatro", label: "Balatro" },
      ".",
    ],
  },
  {
    segments: [
      "I have more hours on",
      { icon: "solidworks", label: "SolidWorks" },
      " than in class.",
    ],
  },
  {
    segments: ["Skilled in 🎹 piano, 🎻 violin, 🪈 flute, and 🎷 alto sax."],
  },
  {
    segments: [{ icon: "ib", label: "IB" }, " Diploma Programme graduate."],
  },
  {
    segments: [
      "My favourite model is",
      { icon: "claude", label: "Claude Sonnet 4.5" },
      ".",
    ],
  },
  {
    segments: [
      "My current goal is to contribute to",
      { icon: "neuralink", label: "Neuralink" },
      ".",
    ],
  },
  // {
  //   segments: ["When I have time, I like to 🎨 paint."],
  // },
];
