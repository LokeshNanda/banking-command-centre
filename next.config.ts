import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enables standalone output for Docker — reduces image size significantly
  output: "standalone",
};

export default nextConfig;
