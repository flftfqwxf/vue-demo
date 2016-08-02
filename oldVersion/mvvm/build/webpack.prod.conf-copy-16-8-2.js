var webpack = require('webpack')
var config = require('./webpack.base.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var sysConfig = require('./parms');
// naming output files with hashes for better caching.
// dist/index.html will be auto-generated with correct URLs.
config.output.filename = '[name].[chunkhash].js'
config.output.chunkFilename = '[id].[chunkhash].js'
//config.
//prodConfig
//--progress --hide-modules
// whether to generate source map for production files.
// disabling this can speed up the build.
var SOURCE_MAP = false
config.devtool = SOURCE_MAP ? 'source-map' : false
// generate loader string to be used with extract text plugin
function generateExtractLoaders(loaders) {
    return loaders.map(function (loader) {
        return loader + '-loader' + (SOURCE_MAP ? '?sourceMap' : '')
    }).join('!')
}
sysConfig.devConfig.devServer
//publickPath路径的最后必须含有【/】否则生成的路径将会是【http:\static.gmmtour.com\mvvm\dist\static\aa.js】格式
var publicPath = "http://static.gmmtour.com/mvvm/dist/static/" + sysConfig.options.sys;

publicPath=sysConfig.devConfig.devServer.publicPath
//devServer.publicPath = 'http://' + sysConfig.devConfig.devServer + devServer.publicPath + devServer.sys

publicPath = publicPath.lastIndexOf('/') + 1 !== publicPath.length ? publicPath += "/" : publicPath;
config.output.publicPath = publicPath
config.vue.loaders = {
    js: 'babel',
    // http://vuejs.github.io/vue-loader/configurations/extract-css.html
    css: ExtractTextPlugin.extract('vue-style-loader', generateExtractLoaders(['css'])),
    //less: ExtractTextPlugin.extract('vue-style-loader', generateExtractLoaders(['css', 'less'])),
    sass: ExtractTextPlugin.extract('vue-style-loader', generateExtractLoaders(['css', 'sass'])),
    //stylus: ExtractTextPlugin.extract('vue-style-loader', generateExtractLoaders(['css', 'stylus']))
}
config.plugins = (config.plugins || []).concat([
    // http://vuejs.github.io/vue-loader/workflow/production.html
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '"production"'
        }
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    // extract css into its own file
    new ExtractTextPlugin('[name].[contenthash].css'),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /build/index.template.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'oldVersion/mvvm/build/index.template.' + sysConfig.options.sys + '.html'
    })
])
module.exports = config
