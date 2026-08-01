import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Ryan Wang",
  description: "Mechatronics engineering @ UWaterloo",
  metadataBase: new URL("https://wangdynasty.ca"),
  openGraph: {
    title: "Ryan Wang",
    description: "Mechatronics engineering @ UWaterloo",
    siteName: "Ryan Wang",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ryan Wang",
    description: "Mechatronics engineering @ UWaterloo",
  },
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
