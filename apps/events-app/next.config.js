module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ddsckwslfyjnhcythyko.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  transpilePackages: ['ui'],
  compiler: {
    styledComponents: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
    };
    return config;
  },
};
