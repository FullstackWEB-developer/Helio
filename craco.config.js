const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          webpackConfig.resolve.plugins.push(new TsconfigPathsPlugin({}));
          return webpackConfig;
        },
      },
    },
  ],
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  babel: {
    ignore: ["craco.config.js"],
      plugins: [
        "@babel/plugin-proposal-nullish-coalescing-operator"
    ],
  },
  webpack: {
    configure: {
      module: {
        rules: [
          {
            test: /react-spring/,
            sideEffects: true,
          },
        ],
      },
    },
  },
};
