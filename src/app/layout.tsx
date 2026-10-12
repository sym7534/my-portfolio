import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GeistSans } from "geist/font/sans";
import { Lora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

const lora = Lora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lora",
  style: ["normal", "italic"],
});

const DESCRIPTION =
  "Robotics engineer. Humanoids, hands, and data-collection rigs.";

// Link previews stay minimal on purpose: no Open Graph or Twitter tags, so
// apps that make previews optional (Discord) show only this title and
// description as a small text card. Apps that always show an image
// (Instagram) take the first <img> on the page; see the placeholder in <body>.
export const metadata: Metadata = {
  title: "Ryan Wang",
  description: DESCRIPTION,
  metadataBase: new URL("https://wangdynasty.ca"),
};

// Colours the stripe on Discord embeds and the mobile browser bar.
export const viewport: Viewport = {
  themeColor: "#0f0f0f",
};

// Blocking script to prevent flash of wrong theme (FOUC)
const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${lora.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-serif antialiased">
        {/* Link-preview placeholder: a plain dark 1200x630 image, first in
            the page so scrapers that must show an image (Instagram) pick it
            instead of the album art. Hidden and lazy, so browsers never load it. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/link-preview.png"
          alt=""
          aria-hidden="true"
          width={1200}
          height={630}
          loading="lazy"
          hidden
        />
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
