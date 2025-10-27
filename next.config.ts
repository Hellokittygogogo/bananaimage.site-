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
};

export default nextConfig;
