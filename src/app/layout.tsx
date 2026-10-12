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

// Link previews: the image comes from opengraph-image.tsx (Next adds the
// og:image tags for it). Title is just the name; description is one flat line.
export const metadata: Metadata = {
  title: "Ryan Wang",
  description: DESCRIPTION,
  metadataBase: new URL("https://wangdynasty.ca"),
  openGraph: {
    title: "Ryan Wang",
    description: DESCRIPTION,
    siteName: "Ryan Wang",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ryan Wang",
    description: DESCRIPTION,
  },
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
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
