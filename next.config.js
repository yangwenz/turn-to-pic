/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [
            "upcdn.io",
            "replicate.delivery",
            "lh3.googleusercontent.com",
            "robohash.org"
        ],
        unoptimized: true,
    }
}

module.exports = nextConfig
