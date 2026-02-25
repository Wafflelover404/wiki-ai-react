/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Handle browser extension interference and hydration issues
  experimental: {
    optimizeCss: true,
  },
}

export default nextConfig
