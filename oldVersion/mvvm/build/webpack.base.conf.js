var path = require('path')
var sysConfig = require('./parms');
console.log('输出目录：', sysConfig.devConfig.devServer.publicPath)
console.log('系统名：', sysConfig.options.sys)
module.exports = {
    entry: {
        app: './oldVersion/mvvm/' + sysConfig.options.sys + '/src/main.js'
    },
    output: {
        path: path.resolve(__dirname, '../../dist/' + sysConfig.options.sys),
        publicPath: sysConfig.devConfig.devServer.publicPath,
        filename: '[name].js',
        chunkFilename: "[name]-[chunkhash].js"
    },
    resolve: {
        extensions: ['', '.js', '.vue'],
        alias: {
            'pagination': path.resolve(__dirname, '../../common/plugins/pagination/pagination.css'),
            'paginationPlugin': path.resolve(__dirname, '../../common/plugins/pagination/pagination.js'),
            'bootstrap': path.resolve(__dirname, '../../common/js/bootstrap.js'),
            'bootstrapCss': path.resolve(__dirname, '../../common/bootstrap/scss/bootstrap-system.scss'),
            'jquery': path.resolve(__dirname, '../../common/js/jquery1.9.1.min.js'),
        }
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue',
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
                test: /\.scss$/,
                // loaders: ["style", "css", "sass"],
                loaders: ['style', 'css', 'sass'],
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpg|gif|svg|woff|woff2|svg|eot|ttf)$/,
                //这里不能写成loaders
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
            js: 'babel',
            sass: 'style!css!resolve-url!sass'
        }
    },
    eslint: {
        formatter: require('eslint-friendly-formatter')
    }
}
