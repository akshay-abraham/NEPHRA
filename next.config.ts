import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // In a future major version of Next.js, you will need to explicitly configure "allowedDevOrigins" in next.config to allow this.
  // Read more: https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins
  allowedDevOrigins: ['https://*.cluster-ikxjzjhlifcwuroomfkjrx437g.cloudworkstations.dev'],
};

export default nextConfig;
