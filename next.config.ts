import createNextIntlPlugin from 'next-intl/plugin';
import withBundleAnalyzer from '@next/bundle-analyzer';

// Khởi tạo plugin next-intl
const withNextIntl = createNextIntlPlugin();

// Cấu hình Bundle Analyzer
const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

// Cấu hình Next.js
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks', '@mantine/charts'],
  },

  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};

export default withNextIntl(withAnalyzer(nextConfig));
