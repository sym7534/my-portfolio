import type { AboutIconKey } from "@/types/about";
import { UWATERLOO_URL } from "@/data/site";

/**
 * The handwritten intro under the name. Replaces the old bio line, the
 * experience cards and the about list with one short first-person passage.
 * A paragraph is a list of segments: plain text, or a span with an optional
 * link and/or inline logo. A plain link keeps the surrounding text style
 * (no underline, same colour) while staying clickable.
 */
export type IntroSegment =
  | string
  | { text: string; href?: string; icon?: AboutIconKey; plain?: boolean };

export const intro: IntroSegment[][] = [
  [
    "I'm a robotics engineer studying Mechatronics at ",
    { text: "Waterloo", href: UWATERLOO_URL },
    ". I lead the humanoid team at ",
    { text: "WATonomous", href: "https://www.watonomous.ca" },
    ", where we're building Pioneer, Waterloo's first humanoid. Previously, I worked on humanoids, hands, and data-collection rigs at ",
    { text: "AXIBO", href: "https://www.axibo.com/" },
    ".",
  ],
  [
    "I have an obsession with enhancing the human form factor: building things that make us more capable, and robots that don't just mimic, but are stronger, faster, and better than us. Reflex, an exoskeleton glove that lets AI teach you skills, won Hack the North.",
  ],
  [
    "Outside of robots, I play piano and violin. Someday I'd like to build a hand better than my own.",
  ],
];

/** Lead-in for the goals list. */
export const LIFETIME_LEAD = "In my lifetime I want to:";

export const lifetimeGoals: IntroSegment[][] = [
  ["Put a humanoid in every home."],
  ["Build a hand better than a human's."],
  ["Wire a brain to a machine at Neuralink."],
  ["Own a mech. A real one."],
];

/** Closing line after the goals; replaces the email link in the links row. */
export const contact: IntroSegment[] = [
  "You can reach me at ",
  { text: "ryanmuxiwang at gmail dot com", href: "mailto:ryan.muxiwang@gmail.com", plain: true },
  ".",
];
