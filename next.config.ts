import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const cspProd = [
  "default-src 'self'",
  // Next.js が挿入する一部のインラインスクリプトを許可（必要最小限の 'unsafe-inline'）
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
  "img-src 'self' https: data:",
  "connect-src 'self' https:",
  "font-src 'self' https://cdnjs.cloudflare.com data:",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join("; ");

// 開発時は Next.js の HMR/Dev overlay のため一時的に緩める
const cspDev = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
  "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
  "img-src 'self' https: data:",
  "connect-src 'self' https: http: ws:",
  "font-src 'self' https://cdnjs.cloudflare.com data:",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: isDev ? cspDev : cspProd,
  },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
