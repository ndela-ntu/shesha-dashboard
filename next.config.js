/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qoubgqnkwmjdfuvcvqbk.supabase.co",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
