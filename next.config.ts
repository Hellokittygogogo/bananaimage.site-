import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // disable legacy indicator option
  devIndicators: undefined as any,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  webpack: (config: any) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/Chinesename.club/**', '**/node_modules/**'],
    };
    return config;
  },
  images: { remotePatterns: [ { protocol: 'https', hostname: 'pub-c529a27bb6e243c5969285be8a31424f.r2.dev' } ] },
  async rewrites() {
    return [
      { source: '/:locale(en|zh)', destination: '/' },
      { source: '/:locale(en|zh)/:path*', destination: '/:path*' },
    ];
  },
};

export default nextConfig;

