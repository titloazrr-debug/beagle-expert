import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Inclut le contenu MDX/JSON dans le bundle de production (fs loaders)
  outputFileTracingIncludes: {
    "/*": ["./content/**/*"],
  },
};

export default nextConfig;
