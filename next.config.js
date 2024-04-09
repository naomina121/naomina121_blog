/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.notion.so', 's3.us-west-2.amazonaws.com', 'mint-note.com', 'localhost'],
  },
  experimental: {
    appDir: false,
  },
}

module.exports = nextConfig
