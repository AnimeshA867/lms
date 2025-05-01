import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  images: {
    domains: ["utfs.io", "5uvyweo7tg.ufs.sh"],
  },
};

export default nextConfig;
