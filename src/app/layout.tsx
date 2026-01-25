import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ryan Wang | Portfolio",
  description: "Mechatronics engineering @ UWaterloo",
  icons: {
    icon: "/cat.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-serif antialiased">{children}</body>
    </html>
  );
}
