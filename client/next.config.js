/** @type {import('next').NextConfig} */

if (!process.env.NEXT_PUBLIC_BASE_PATH) {
  process.env.NEXT_PUBLIC_BASE_PATH = "";
}

const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  output: "export",
  trailingSlash: true,
};

module.exports = nextConfig;
