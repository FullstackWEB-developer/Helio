const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    plugins: [
        {
            plugin: {
                overrideWebpackConfig: ({ webpackConfig }) => {
                    webpackConfig.resolve.plugins.push(new TsconfigPathsPlugin({}));
                    return webpackConfig;
                }
            },
        }
    ],
    style: {
        postcss: {
            plugins: [
                require('tailwindcss'),
                require('autoprefixer'),
            ],
        },
    },
    babel: {
        ignore: ['craco.config.js'],
        plugins: [
            process.env.REACT_APP_REMOVE_TEST_ID === "true" ? ["babel-plugin-jsx-remove-data-test-id", {
                "attributes": ["data-test-id"]
            }] : [() => {
                return []
            }]
        ]
    },
    webpack: {
        configure: {
            module: {
                rules: [
                    {
                        test: /react-spring/,
                        sideEffects: true
                    }
                ]
            }
        }
    }
}
