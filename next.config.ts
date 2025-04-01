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
        source: '/confirm-payment-payos',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://pay.payos.vn',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS',
          },
        ],
      },
    ]
  },
};

export default withNextIntl(withAnalyzer(nextConfig));
