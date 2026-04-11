import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Ryan Wang | Portfolio",
  description: "Mechatronics engineering @ UWaterloo",
  metadataBase: new URL("https://wangdynasty.ca"),
  openGraph: {
    title: "Ryan Wang | Portfolio",
    description: "Mechatronics engineering @ UWaterloo",
    siteName: "Ryan Wang",
    type: "website",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Ryan Wang | Portfolio",
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
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
