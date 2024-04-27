const path = require('path');

module.exports = {

    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                "style-loader",
                "css-loader",
                "sass-loader",
                ],
            },
        ],
    },
    entry: './src/index.js',
    output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    },
};
