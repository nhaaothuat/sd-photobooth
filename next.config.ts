import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();
const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports:['@mantine/core', '@mantine/hooks', '@mantine/charts']
  }
};

export default withNextIntl(nextConfig);
