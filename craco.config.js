module.exports = {
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
            }] : [() => { return [] }]
        ]
    },
}