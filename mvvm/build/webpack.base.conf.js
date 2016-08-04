var path = require('path')
var baseConfig = require('../../buildConfig');

var outputPath=path.resolve(__dirname, baseConfig.outPutPath)
console.log('物理输出路径:',outputPath)
console.log('输出目录：', baseConfig.publicPath)
console.log('系统名：', baseConfig.sysName)
module.exports = {
    entry: {
        app: './mvvm/' + baseConfig.sysName + '/src/main.js'
    },
    output: {
        path: outputPath,
        publicPath: baseConfig.publicPath,
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
