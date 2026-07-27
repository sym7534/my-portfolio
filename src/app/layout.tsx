import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Archivo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo-var",
  axes: ["wdth"],
});

export const metadata: Metadata = {
  title: "Ryan Wang | Portfolio",
  description: "Mechatronics engineering @ UWaterloo",
  metadataBase: new URL("https://wangdynasty.ca"),
  openGraph: {
    title: "Ryan Wang | Portfolio",
    description: "Mechatronics engineering @ UWaterloo",
    siteName: "Ryan Wang",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ryan Wang | Portfolio",
    description: "Mechatronics engineering @ UWaterloo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${archivo.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
