var path = require('path')
var sysConfig=require('./parms');
console.log('输出目录：',sysConfig.devConfig.devServer.publicPath)
console.log('系统名：',sysConfig.options.sys)
module.exports = {
    entry: {
        app: './oldVersion/mvvm/'+sysConfig.options.sys+'/src/main.js'
    },
    output: {
        path: path.resolve(__dirname, '../dist/static/'+sysConfig.options.sys),
        publicPath: sysConfig.devConfig.devServer.publicPath,
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
