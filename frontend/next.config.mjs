process.env.TZ = 'Asia/Jakarta';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    const backendUrl =
      process.env.INTERNAL_BACKEND_URL ||
      (process.env.NODE_ENV === 'production' ? 'http://backend:4001' : 'http://localhost:4001');

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${backendUrl}/uploads/:path*`,
      },
      {
        source: '/health',
        destination: `${backendUrl}/health`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/syarat-ketentuan',
        destination: '/terms',
        permanent: true,
      },
      {
        source: '/ketentuan',
        destination: '/terms',
        permanent: true,
      },
      {
        source: '/kebijakan-privasi',
        destination: '/privacy',
        permanent: true,
      },
      {
        source: '/ulasan',
        destination: '/reviews',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
