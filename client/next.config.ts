import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow all remote images (from any domain)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allows all domains
      },
      {
        protocol: "http",
        hostname: "**", // optional: include http as well
      },
    ],
    // Enable serving local images from /public
    unoptimized: false,
  },
};

export default nextConfig;
