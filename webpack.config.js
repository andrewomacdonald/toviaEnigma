const path = require('path');

module.exports = {
    context: path.join(__dirname + '/src'),
    entry: [
        './main.js'
    ],
    output: {
        path: path.join(__dirname + '/www'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            sourceMap: true,
                            importLoaders: 1,
                            localIdentName: "[name]--[local]--[hash:base64:8]"
                        }
                    }
                    // "postcss-loader" // has separate config, see postcss.config.js nearby
                ]
            },
        ],
    },
    resolve: {
        modules: [
            path.join(__dirname + '/node_modules')
        ],
    },
};