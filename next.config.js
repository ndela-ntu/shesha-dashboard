/** @type {import('next').NextConfig} */
const nextConfig = {
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
