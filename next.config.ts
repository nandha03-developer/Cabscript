import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [100, 75, 70],
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cabscript.com',
      },
    ],
  },
  
  // Security Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
        ],
      },
    ];
  },

  // Experimental features
  experimental: {
    // Skip API routes during static generation
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Turbopack configuration (Next.js 16+)
  turbopack: {},

  // Webpack optimization (fallback for webpack mode)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Mark optional email packages as external to avoid bundling errors
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push({
        'resend': 'commonjs resend',
        '@sendgrid/mail': 'commonjs @sendgrid/mail',
      });
    }
    
    return config;
  },
};

export default nextConfig;
