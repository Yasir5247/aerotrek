import type { NextConfig } from "next";
import checkEnvVariables from "./check-env-variables";

if (process.env.NODE_ENV !== "test") {
  checkEnvVariables();
}

const DEFAULT_REGION = (
  process.env.NEXT_PUBLIC_DEFAULT_REGION || "mv"
).toLowerCase();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/home",
        destination: `/${DEFAULT_REGION}`,
        permanent: true,
      },
      {
        source: "/shop-list-two-column",
        destination: `/${DEFAULT_REGION}/shop`,
        permanent: true,
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "aiminaabee-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "aiminaabee-server-testing.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "aiminaabee-server-testing.s3.us-east-1.amazonaws.com",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
