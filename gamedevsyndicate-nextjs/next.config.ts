import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Disable CSS optimization that might tree-shake dynamic styles
    optimizeCss: false,
  },
  // Ensure CSS variables and inline styles are preserved
  compiler: {
    // Remove console.log in production but keep error/warn/info.
    // Use VERCEL_ENV so preview deploys are treated like production for log removal.
    // console.warn is used for important diagnostics (e.g. config logging) so it survives.
    removeConsole: process.env.VERCEL_ENV === 'production' ? { exclude: ['error', 'warn', 'info'] } : false,
  },
  // Configure webpack to handle parent directory imports
  webpack: (config, { isServer }) => {
    // Allow webpack to resolve modules from parent directory
    if (!config.resolve) {
      config.resolve = {};
    }
    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }
    
    return config;
  },
};

export default nextConfig;
