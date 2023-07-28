/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXTJS_BASE_PATH || "",
  output: "export",
  trailingSlash: true,
};

module.exports = nextConfig;
