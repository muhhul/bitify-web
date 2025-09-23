import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: [],

  // Configure headers for CORS if needed
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },

  // Configure rewrites for API proxy if needed
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${
          process.env.BACKEND_URL || "http://localhost:8000"
        }/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
