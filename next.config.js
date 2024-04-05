/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_AUTH_COOKIE_KEY: process.env.NEXT_PUBLIC_AUTH_COOKIE_KEY
  },
  compiler: {
    styledComponents: true,
  },
  output: 'standalone'
};
