var path = require('path')
module.exports = {
    entry: {
        app: './MVVM/supplier/src/main.js'
    },
    output: {
        path: path.resolve(__dirname, '../dist/static'),
        publicPath: 'http://staticdev.gmmtour.com/',
        filename: '[name].js',
        chunkFilename:"[name]-[chunkhash].js"
    },
    resolve: {
        extensions: ['', '.js', '.vue'],
        alias: {
            'src': path.resolve(__dirname, '../src')
        }
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    vue: {
        loaders: {
            js: 'babel'
        }
    },
    eslint: {
        formatter: require('eslint-friendly-formatter')
    }
}
