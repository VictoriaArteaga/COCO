import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Output standalone build for Docker deployment
  // output: 'standalone',

  // Strict mode for better development experience
  reactStrictMode: true,
}

export default nextConfig
