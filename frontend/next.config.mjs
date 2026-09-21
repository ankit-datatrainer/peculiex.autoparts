/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Emits .next/standalone so the Docker image ships only what it needs.
  output: 'standalone',

  // pdfkit ships binary font metrics that must not go through webpack; keep it
  // as a plain runtime require from node_modules.
  experimental: {
    serverComponentsExternalPackages: ['pdfkit']
  },

  images: {
    unoptimized: true
  },

  // Product photos come from Supabase Storage and the source CDN.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' }
        ]
      }
    ];
  },

  // The legacy Express API is optional; only proxy to it when a URL is set.
  async rewrites() {
    const legacy = process.env.LEGACY_API_URL;
    return legacy ? [{ source: '/api/:path*', destination: `${legacy}/api/:path*` }] : [];
  }
};

export default nextConfig;
