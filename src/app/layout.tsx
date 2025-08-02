import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blog Platform",
  description:
    "A modern blog platform built with Next.js, TailwindCSS, and Zustand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme-storage');
                  if (theme) {
                    const parsed = JSON.parse(theme);
                    const effectiveTheme = parsed.state?.theme === 'system' 
                      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                      : parsed.state?.theme || 'light';
                    
                    // Remove all theme classes first
                    document.documentElement.classList.remove('dark', 'theme-light', 'theme-dark');
                    document.body.classList.remove('theme-light', 'theme-dark');
                    
                    if (effectiveTheme === 'dark') {
                      document.documentElement.classList.add('dark');
                      document.body.classList.add('theme-dark');
                    } else {
                      document.body.classList.add('theme-light');
                    }
                    
                    // Dispatch custom event for theme change
                    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: effectiveTheme } }));
                  }
                } catch (e) {
                  console.warn('Theme initialization failed:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
