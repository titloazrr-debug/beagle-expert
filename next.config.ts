import type { NextConfig } from "next";

/**
 * Protections de base, identiques sur toutes les pages.
 * CSP limitée à frame-ancestors : pas de script-src, pour laisser
 * fonctionner Affilae, le chatbot et le bandeau cookies.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
];

const nextConfig: NextConfig = {
  // Inclut le contenu MDX/JSON dans le bundle de production (fs loaders)
  outputFileTracingIncludes: {
    "/*": ["./content/**/*"],
  },
  async headers() {
    return [
      { source: "/", headers: securityHeaders },
      { source: "/:path*", headers: securityHeaders },
    ];
  },
};

export default nextConfig;
