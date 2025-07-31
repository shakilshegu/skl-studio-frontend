/** @type {import('next').NextConfig} */
const nextConfig = {
     experimental: {
    turbo: false,
  },
  eslint: {
      ignoreDuringBuilds: true,
  },
  productionBrowserSourceMaps: false, // Disable source maps in production
  webpack: (config, { dev }) => {
      if (dev) {
          config.devtool = 'source-map'; // Use source maps only in development
      }
      return config;
  },
};

export default nextConfig;
