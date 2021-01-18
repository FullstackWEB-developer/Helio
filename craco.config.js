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
            process.env.NODE_ENV === "production" ? ["babel-plugin-jsx-remove-data-test-id", {
                "attributes": ["data-test-id"]
            }] : [() => { return [] }]
        ]
    },
}