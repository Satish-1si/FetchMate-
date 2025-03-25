/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export", // Enables static export
    images: {
      unoptimized: true, // Prevents image optimization issues
    },
  };
  
  module.exports = nextConfig;
  