import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/estudio", destination: "/proyectos", permanent: true },
      { source: "/docs", destination: "/", permanent: true },
      { source: "/docs/:path*", destination: "/", permanent: true },
      { source: "/dashboard", destination: "/", permanent: true },
      { source: "/dashboard/:path*", destination: "/", permanent: true },
      { source: "/login", destination: "/", permanent: true },
      { source: "/forgot-password", destination: "/", permanent: true },
      { source: "/reset-password", destination: "/", permanent: true },
      { source: "/verify-email", destination: "/", permanent: true },
      { source: "/servicios", destination: "/", permanent: true },
      { source: "/consultoria", destination: "/", permanent: true },
      { source: "/matecitodb", destination: "/", permanent: true },
      { source: "/apps", destination: "/", permanent: true },
      { source: "/web", destination: "/", permanent: true },
      { source: "/api/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
