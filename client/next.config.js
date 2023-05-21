/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    CHANNEL_PRIVATE_KEY:
      "",
    // BACKEND_ENDPOINT: "https://cognizance-bit-bots-backend.vercel.app",
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "ipfs.io", port: "" }],
  },
};

module.exports = nextConfig;
