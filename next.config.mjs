/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    MONGODB_URI: process.env.MONGODB_URI,
    NEXT_AUTH_SECRET : process.env.NEXT_AUTH_SECRET
  },
};

export default nextConfig;
