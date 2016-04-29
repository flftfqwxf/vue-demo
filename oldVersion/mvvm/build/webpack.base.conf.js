var path = require('path')
var devConfig = require('./devConfig.json')
var devServer=devConfig.devServer.isIP ? devConfig.devServer.ip :devConfig.devServer.domain
console.log(devServer.publicPath)
module.exports = {
    entry: {
        app: './oldVersion/mvvm/supplier/src/main.js'
    },
    output: {
        path: path.resolve(__dirname, '../dist/static'),
        publicPath: devServer.publicPath,
        filename: '[name].js',
        chunkFilename: "[name]-[chunkhash].js"
    },
    resolve: {
        extensions: ['', '.js', '.vue'],
        alias: {
            'pagination': path.resolve(__dirname, '../../common/plugins/pagination/pagination.css')
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
