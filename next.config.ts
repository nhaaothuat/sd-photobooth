import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports:['@mantine/core', '@mantine/hooks', '@mantine/charts']
  }
};

export default nextConfig;
