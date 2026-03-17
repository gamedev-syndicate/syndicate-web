import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "spillprisen.gamedevsyndicate.com" }],
        destination: "https://encirclegames.com/spillprisen/:path*",
      },
    ];
  },
  /* config options here */
  experimental: {
    // Disable CSS optimization that might tree-shake dynamic styles
    optimizeCss: false,
  },
  // Ensure CSS variables and inline styles are preserved
  compiler: {
    // Remove console logs in production but keep styles
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
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
