const withNextIntl = require('next-intl/plugin')('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
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
