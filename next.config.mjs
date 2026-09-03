/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  ...(isGitHubPages
    ? {
        basePath: "/cpm-end",
        assetPrefix: "/cpm-end/",
      }
    : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
