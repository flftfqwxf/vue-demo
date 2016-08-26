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
            //移动站全局CSS wulianaq
            'bootstrapMobileCss': path.resolve(__dirname, '../mobile/src/style/scss/bootstrap-mobile.scss'),

            'indexCss': path.resolve(__dirname, '../mobile/src/style/index.scss'),
            'detailCss': path.resolve(__dirname, '../mobile/src/style/detail.scss'),
            'cssUrl': path.resolve(__dirname, '../mobile/src/style'),
            'topic': path.resolve(__dirname, '../mobile/src/style/topic.scss'),
            'homepage': path.resolve(__dirname, '../mobile/src/style/homepage.scss'),

            'jquery': path.resolve(__dirname, '../../common/js/jquery1.9.1.min.js'),
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
                // loaders: ["style", "css", "sass"],
                loaders: ['style', 'css', 'sass'],
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
                test: /\.(png|jpg|gif|svg|woff|woff2|svg|eot|ttf)$/,
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
