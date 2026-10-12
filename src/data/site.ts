/**
 * Site-wide strings and config, extracted from page.tsx so design
 * branches can restructure layout without touching content.
 */

export const TYPED_PREFIX = "hey, i'm ";
export const TYPED_NAME = "Ryan Wang";
export const TYPED_SMILEY = " :)";

/** Temporarily unlinked — the resume link is removed from LinksRow for now. */
export const RESUME_PATH = "/ryanwang_roboticsresume.pdf";
export const UWATERLOO_URL = "https://uwaterloo.ca";

export const WEBRING_SITE = "wangdynasty.ca";
export const WEBRING_BASE_URL =
  process.env.NEXT_PUBLIC_WEBRING_BASE_URL ?? "https://tronring.com";
