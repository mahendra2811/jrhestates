import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  images: { qualities: [75, 90] },
  allowedDevOrigins: ["127.0.0.1"],
};
export default config;
