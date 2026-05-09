import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin Turbopack root to this project so Next doesn't accidentally pick up
  // a parent lockfile when the user has other JS projects nearby.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
