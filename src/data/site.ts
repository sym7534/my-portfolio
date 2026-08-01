/**
 * Site-wide strings and config, extracted from page.tsx so design
 * branches can restructure layout without touching content.
 */

export const TYPED_PREFIX = "hey, i'm ";
export const TYPED_NAME = "Ryan Wang";
export const TYPED_SMILEY = " :)";

export const BIO =
  "full-stack robotics engineer — from ROS 2 to firmware to CAD to manufactured parts. I love taking systems from shower thought to fully fleshed autonomy.";

/** Longer bio variant (previously commented out in page.tsx) — available for branches that want it. */
export const BIO_LONG =
  "I'm a full-stack engineer for robotics: ROS 2 to embedded firmware to CAD to manufactured parts. My philosophy is that depth in one layer makes you sharper in every other — you design better hardware when you know how it'll be controlled, and write better software when you've machined the thing it runs on. I've taken autonomy systems from concept to working robot, and diagnosed failures that turned out to be mechanical, electrical, and software problems all at once.";

export const RESUME_PATH = "/ryanwang_roboticsresume.pdf";
export const UWATERLOO_URL = "https://uwaterloo.ca";

export const WEBRING_SITE = "wangdynasty.ca";
export const WEBRING_BASE_URL =
  process.env.NEXT_PUBLIC_WEBRING_BASE_URL ?? "https://tronring.com";
