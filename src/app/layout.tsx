import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blog Platform",
  description: "A modern blog platform built with Next.js, TailwindCSS, and Zustand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
