/** @type {import('next').NextConfig} */

process.env.NEXT_PUBLIC_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
process.env.NEXT_PUBLIC_PORT = process.env.PORT || 3000;

const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  output: "export",
  trailingSlash: true,
  transpilePackages: [
    'swagger-ui-react',
    'swagger-client',
    'react-syntax-highlighter',    
  ],
};

module.exports = nextConfig;
