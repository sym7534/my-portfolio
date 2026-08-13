/**
 * verify-prod-gate.mjs — behavioural proof that the dev-only unhide does not
 * change PRODUCTION behaviour.
 *
 * recheck.mjs proves the NODE_ENV branch is compiled out by scanning chunks.
 * That is static evidence. This is the behavioural counterpart: run a real
 * browser against a production server and count the project cards actually
 * rendered, first as an ordinary visitor and then as a visitor arriving on the
 * secret unlock host.
 *
 * Expected, if my change is correctly scoped to dev:
 *   ordinary visitor  -> only non-hidden projects render
 *   unlock host       -> the full set renders
 *
 * If both showed the full set, my dev bypass would have leaked and every
 * deliberately-gated project would be publicly visible.
 *
 * Usage: node tools/verify-prod-gate.mjs [port]
 */
import { chromium } from "./vendor/node_modules/playwright-core/index.mjs";

const PORT = process.argv[2] || "3200";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
  // Map the secret host to the local prod server so window.location.hostname
  // is genuinely "portfolio.wangdynasty.ca". Patching window.location from a
  // page script does not work: it is non-configurable in Chrome.
  args: [`--host-resolver-rules=MAP portfolio.wangdynasty.ca 127.0.0.1`],
});

async function countCards(hostHeader) {
  const ctx = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    // Rewriting Host lets us present as the secret subdomain without DNS.
    extraHTTPHeaders: hostHeader ? { Host: hostHeader } : {},
  });
  const page = await ctx.newPage();
  await page.goto(`http://localhost:${PORT}`, { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForTimeout(2500);
  const n = await page.evaluate(
    () => document.querySelectorAll('figure[aria-label^="Open project:"]').length
  );
  const titles = await page.evaluate(() =>
    [...document.querySelectorAll('figure[aria-label^="Open project:"]')].map((f) =>
      f.getAttribute("aria-label").replace("Open project: ", "")
    )
  );
  await ctx.close();
  return { n, titles };
}

// Ordinary visitor on the production build.
const plain = await countCards(null);

// Visit the real unlock hostname (resolved to the local prod server above).
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
const page = await ctx.newPage();
await page.goto(`http://portfolio.wangdynasty.ca:${PORT}`, {
  waitUntil: "domcontentloaded",
  timeout: 120000,
});
await page.waitForTimeout(2500);
const unlockedTitles = await page.evaluate(() =>
  [...document.querySelectorAll('figure[aria-label^="Open project:"]')].map((f) =>
    f.getAttribute("aria-label").replace("Open project: ", "")
  )
);
const seenHost = await page.evaluate(() => window.location.hostname);
await ctx.close();
await browser.close();

console.log(`PRODUCTION build (next start, port ${PORT})\n`);
console.log(`ordinary visitor : ${plain.n} card(s)`);
console.log(`  ${plain.titles.join(", ") || "(none)"}\n`);
console.log(`unlock host (${seenHost}) : ${unlockedTitles.length} card(s)`);
console.log(`  ${unlockedTitles.join(", ") || "(none)"}\n`);

const gateWorks = plain.n < unlockedTitles.length;
console.log(
  gateWorks
    ? `PASS — the gate still discriminates in production (${plain.n} vs ${unlockedTitles.length}). ` +
      `The dev-only unhide did NOT leak.`
    : `FAIL — production shows the same set either way (${plain.n} vs ${unlockedTitles.length}). ` +
      `The dev bypass may have leaked into the production bundle.`
);
process.exit(gateWorks ? 0 : 1);
