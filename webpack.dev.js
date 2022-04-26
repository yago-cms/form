const path = require('path');
const { DllReferencePlugin } = require('webpack');

module.exports = {
    entry: path.join(__dirname, 'resources', 'js', 'index.js'),
    mode: 'development',
    devtool: 'eval',
    module: {
        rules: [
            {
                test: /\.?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            [
                                '@babel/preset-react',
                                { runtime: 'automatic' }
                            ]
                        ]
                    }
                }
            },
        ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'resources', 'dist', 'js'),
    },
    plugins: [
        new DllReferencePlugin({
            context: path.resolve(__dirname, '..', 'cms'),
            manifest: require('../cms/resources/dist/js/vendor-manifest.json')
        }),
    ]
};