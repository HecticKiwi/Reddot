/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com'
      },
      {
        hostname: 'hk-reddot.s3.us-west-2.amazonaws.com'
      }
    ]
  }
}

module.exports = nextConfig
