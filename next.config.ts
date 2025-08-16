// This file configures the settings for the Next.js application.
// Next.js is the React framework we are using to build the app's user interface.
import type {NextConfig} from 'next';

// The nextConfig object holds all the custom configuration for our app.
const nextConfig: NextConfig = {
  /* config options here */

  // This is a new feature in Next.js to allow cross-origin requests in development.
  // It is needed for the Firebase Studio environment to work correctly.
  experimental: {
    allowedDevOrigins: [
      'https://*.cloudworkstations.dev',
    ],
  },
  
  // TypeScript configuration
  typescript: {
    // This option tells Next.js to ignore TypeScript errors during the build process.
    // This is useful for development, but should be used with caution in production.
    ignoreBuildErrors: true,
  },

  // ESLint configuration
  eslint: {
    // This option tells Next.js to ignore ESLint warnings during the build process.
    // ESLint helps find and fix problems in JavaScript code.
    ignoreDuringBuilds: true,
  },
  
  // Image optimization configuration
  images: {
    // This setting allows Next.js to optimize images from external domains.
    // We are allowing images from 'placehold.co' which is used for placeholder images.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

// We export the configuration object so Next.js can use it.
export default nextConfig;
