/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com','lh3.googleusercontent.com','res.cloudinary.com'],
    experimental: {
      serverComponentsExternalPackages: ['cloudinary', 'apollo/client']
    },
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
