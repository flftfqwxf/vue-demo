var path = require('path')
var baseConfig = require('../../buildConfig');
var outputPath = path.resolve(__dirname, baseConfig.outPutPath)
console.log('物理输出路径:', outputPath)
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
            'datepicker': path.resolve(__dirname, '../console/src/components/datepicker/datepicker.js'),
            'bootstrap': path.resolve(__dirname, '../../common/js/bootstrap.js'),
            'bootstrapCss': path.resolve(__dirname, '../../common/bootstrap/scss/bootstrap-system.scss'),
            //物联 WEB 全局CSS
            'webScss': path.resolve(__dirname, '../../mvvm/www/src/style/bootstrap/scss/bootstrap-system.scss'),

            //移动站全局CSS wulianaq
            'bootstrapMobileCss': path.resolve(__dirname, '../mobile/src/style/common.scss'),

            'indexCss': path.resolve(__dirname, '../mobile/src/style/index.scss'),
            'detailCss': path.resolve(__dirname, '../mobile/src/style/detail.scss'),
            'cssUrl': path.resolve(__dirname, '../mobile/src/style'),
            'topic': path.resolve(__dirname, '../mobile/src/style/topic.scss'),
            'homepage': path.resolve(__dirname, '../mobile/src/style/homepage.scss'),

            'wwwVariablesScss':path.resolve(__dirname, '../www/src/style/bootstrap/scss/bootstrap/_variables.scss'),

            'wwwV':            path.resolve(__dirname, '../www/src/style/bootstrap/scss/_customer_variables.scss'),
            'jquery': path.resolve(__dirname, '../../common/js/jquery1.9.1.min.js'),
            'www-pagination': path.resolve(__dirname, '../../common/plugins/pagination/pagination.scss'),

            'strap': path.resolve(__dirname, '../www/src/components/vue-strap1.0.11/src'),
            // 'strap': path.resolve(__dirname, '../www/src/components/vue-strap/src'),

            alias: {
                'vux-components': 'vux/src/components/'
            }

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
                query: {compact: false},
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"],
                //加上sourceMap后,方便调试,
                // 但是加上后,刷新页面时会出现,先没有样式,然后再有样式的情况
                // loaders: ['style', "css?sourceMap", "sass?sourceMap"],
                exclude: /node_modules/,
            },
            //todo:将jquery暴露到全局,暂时无效,后续再测试使用
            // { test: require.resolve("jquery"), loader: "expose?$!expose?jQuery" },
            /**
             *  设置UI.js的 module.exports=FileProgress
             *  在页面中,就可以使用 require引用时,就可以获取到 FileProgress方法
             */

            {test: require.resolve('../console/src/components/qiniu-upload/ui.js'),
                loader: "exports?FileProgress"},
            {
                test: require.resolve("../console/src/components/qiniu-upload/plupload.full.min.js"),
                loader: "imports?this=>window"
            },
            {
                test: require.resolve("../console/src/components/qiniu-upload/moxie.js"),
                loader: "imports?this=>window"
            },
            {
                test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf)$/,
                //这里不能写成loaders
                loader: 'url',
                query: {
                    limit: 10000,
                    name: '[name].[ext]?[hash]'
                }
            },
            //vux UI库 编译
            {
                test: /vux.src.*?js$/,
                loader: 'babel'
            }
        ]
    },
    vue: {
        loaders: {
            js: 'babel',
            // sass: 'style!css?sourceMap!resolve-url!sass?sourceMap'
        }
    },
    eslint: {
        formatter: require('eslint-friendly-formatter')
    }
}
