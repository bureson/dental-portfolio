import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Static HTML export — the whole site is client-side, so Firebase Hosting
   * can serve the `out/` directory directly without a server runtime.
   */
  output: "export",
  // The export target has no Next.js image optimizer.
  images: { unoptimized: true },
  // Firebase Hosting is configured with `cleanUrls`, so `/vocabulary.html`
  // is served at `/vocabulary`.
  trailingSlash: false,
};

export default nextConfig;
