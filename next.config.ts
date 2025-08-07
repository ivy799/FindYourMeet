import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png')],
  },
};

export default nextConfig;
