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
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Important: return the modified config
    config.resolve.fallback = {
      fs: false,
    };

    // // Allow CommonJS and ES6 module syntax to be mixed
    // config.module.rules.push({
    //   test: /\.m?js/,
    //   resolve: {
    //     fullySpecified: false,
    //   },
    //   include: /node_modules/,
    //   use: {
    //     loader: 'babel-loader',
    //     options: {
    //       presets: [
    //         [
    //           'next/babel',
    //           {
    //             'preset-env': {
    //               modules: 'commonjs',
    //             },
    //           },
    //         ],
    //       ],
    //     },
    //   },
    // });

    return config;
  },
};
