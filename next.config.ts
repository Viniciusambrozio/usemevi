import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "thecgmdcjzoulzgxsmss.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" }
    ]
  }
};

export default nextConfig;
