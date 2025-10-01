import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My App",
  description: "md2slide viewer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.css"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js" strategy="beforeInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/go.min.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/marked-highlight/lib/index.umd.js" strategy="beforeInteractive" />
        <Script id="hljs-init" strategy="afterInteractive">
          {`hljs.highlightAll();`}
        </Script>
        <Script src="/md2slide.js" strategy="afterInteractive" />
        <Script id="trigger-load" strategy="afterInteractive">
          {`try { window.dispatchEvent(new Event('load')); } catch (e) { console.error(e); }`}
        </Script>
      </body>
    </html>
  );
}
