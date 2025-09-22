import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['localhost'], // Add any external image domains here
  },
  // Increase payload size limit for file uploads
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  // Add webpack config to handle larger files
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
};

export default nextConfig;