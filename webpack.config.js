'use strict';
var path = require('path');
var wwwUrl = './oldVersion/www/src';
var commonUrl = './oldVersion/common';
var AssetsPlugin = require('assets-webpack-plugin');
var map=path.join(__dirname,'../','gmmtour-web-www/WebContent/page/common/web/','assets-map.json');
var assetsPluginInstance = new AssetsPlugin({filename: path.join(__dirname, 'oldVersion/dist/assets-map.json'), update: true, prettyPrint: true});
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    module: {
        loaders: [
             //Extract css files
            {
                test: /\.css$/,exclude: /node_modules/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            // Optionally extract less files
            // or any other compile-to-css language
            {
                test: /\.scss$/,exclude: /node_modules/,
                loader: ExtractTextPlugin.extract("style-loader!sass-loader", "css-loader!sass-loader")
            },
            {test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192'},
            //{test: /\.css$/, exclude: /node_modules/, loaders: ['style', 'css']},
            //{test: /\.scss$/, exclude: /node_modules/, loaders: ['style', 'css', 'sass']}
        ]
    },
    entry: {
        'global': wwwUrl + '/controllers/global-webpack.js',
        'list': wwwUrl + '/controllers/product/list-webpack.js'

    },
    output: {
        path: path.join(__dirname, 'oldVersion/dist'),
        filename: "[name].js",
        //filename: "[name]-[chunkhash].js",
        chunkFilename: "[name]-[chunkhash].js"
    },
    resolve: {
        alias: {
            jquery: path.join(__dirname, commonUrl, "js/jquery1.9.1.min"),
            "bootstrap": path.join(__dirname, commonUrl, "/js/bootstrap-amd"),
            "slider": path.join(__dirname, commonUrl, "/plugins/jQuery.slider/js/jQuery.silder.amd.js"),
            "dialog": path.join(__dirname, commonUrl, "/plugins/artdialog/jquery.artDialog.webpack.js"),
            "97Date": path.join(__dirname, commonUrl, "/plugins/eDate/WdatePicker.js"),
            "flyer": path.join(__dirname, commonUrl, "/plugins/compare/jquery.fly.min.amd.js"),
            "compare": path.join(__dirname, commonUrl, "/plugins/compare/compare.amd.js"),
            "zclip": path.join(__dirname, commonUrl, "/plugins/zclip/jquery.zclip.amd"),
            jQCookie: path.join(__dirname, commonUrl, "/plugins/jQuery.cookie/jQuery.cookie"),
            "tools": path.join(__dirname, wwwUrl, "/packages/tools/tools-webpack")
        },
        extensions: ['', '.js', '.css', '.scss']
    },
    //externals: {
    //    "97Date": true
    //},
    plugins: [assetsPluginInstance
    //,new ExtractTextPlugin("style33.css", {
    //        allChunks: true
    //    })
        ,new ExtractTextPlugin("[name].css")
    ]
};
