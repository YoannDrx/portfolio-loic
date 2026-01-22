const withNextIntl = require('next-intl/plugin')('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i1.sndcdn.com",
      },
      {
        protocol: "https",
        hostname: "i2.sndcdn.com",
      },
      {
        protocol: "https",
        hostname: "i3.sndcdn.com",
      },
      {
        protocol: "https",
        hostname: "i4.sndcdn.com",
      },
    ],
  },
};

module.exports = withNextIntl(nextConfig);
