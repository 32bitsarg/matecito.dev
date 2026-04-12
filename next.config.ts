import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://api.matecito.dev/api/v1/:path*',
      },
      {
        source: '/api/v2/:path*',
        destination: 'https://api.matecito.dev/api/v2/:path*',
      },
    ];
  },
};

export default nextConfig;
