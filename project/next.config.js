/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    logging: {
      level: 'warn'  // Hide CSP noise
    }
  },
};

module.exports = nextConfig;
