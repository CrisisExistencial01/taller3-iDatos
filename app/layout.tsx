import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "World Happiness Dashboard",
  description: "Global happiness metrics and insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}

