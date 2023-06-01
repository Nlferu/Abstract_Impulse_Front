/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  env: {
    RECAPTCHA_KEY: process.env.RECAPTCHA_KEY,
  },
}
