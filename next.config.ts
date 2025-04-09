import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import withBundleAnalyzer from '@next/bundle-analyzer';
const withNextIntl = createNextIntlPlugin();

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/**", 
      },
      
    ],
  },
 
  experimental: {
    optimizePackageImports:['@mantine/core', '@mantine/hooks', '@mantine/charts']
  },
  
};

export default withNextIntl(withAnalyzer(nextConfig));
