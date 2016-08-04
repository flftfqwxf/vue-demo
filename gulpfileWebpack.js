var gulp = require('gulp');
var gutil = require('gulp-util');
//var uncss = require('gulp-uncss');
//var concat = require('gulp-concat');
var pkg = require('./package.json');
var webpack = require('webpack');
var prodConfig = require('./mvvm/build/webpack.prod.conf');
// var devConfig = require('./mvvm/build/webpack.dev.conf');
var buildBaseConfig = require('./buildConfig');
console.log(buildBaseConfig)
if (!buildBaseConfig) {
    console.log('----------------------------------/n')
    console.log('未获取到配置')
    console.log('----------------------------------/n')

    return false

}
var gulpSequence = require('gulp-sequence');
var rimraf = require('gulp-rimraf');
var WebpackDevServer = require('webpack-dev-server');
/**
 * 清除：webpack生成的文件
 */
gulp.task('cleanWebpackDist', function (cb) {
    console.log('----------------------------------/n')
    console.log('被清空的目录:' + buildBaseConfig.outPutPath)
    console.log('----------------------------------/n')
    return gulp.src(buildBaseConfig.outPutPath, {read: false})
        .pipe(rimraf({force: true}));
})
/**
 * 构建系统：webpack生成的文件
 */
gulp.task('webpack:bulid', function (cb) {
    prodConfig.devtool = false;
    var myConfig = Object.create(prodConfig);
    myConfig.modules = false;
    //myConfig.entry=
    webpack(myConfig, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack:build", err);
        gutil.log("[webpack:build]", stats.toString({
            colors: true
        }));
        cb();
    })
})
//将生成的入口页移动到后台目录 通过设置 --sys [supplier|distributor]来区分不同项目
// gulp.task('moveEntry', function () {
//     return gulp.src(webpackConfig[options.sys].entryPath).pipe(gulp.dest(webpackConfig[options.sys].jspPath))
// })
// gulp.task('webpack:dev', function (cb) {
//     var myConfig = Object.create(devConfig);
//     myConfig.entry.app.unshift("webpack-dev-server/client?http://localhost:9093/");
//     var server = new WebpackDevServer(compiler, {
//         // webpack-dev-server options
//         contentBase: "oldVersion/",
//         // or: contentBase: "http://localhost/",
//         hot: true,
//         // Enable special support for Hot Module Replacement
//         // Page is no longer updated, but a "webpackHotUpdate" message is send to the content
//         // Use "webpack/hot/dev-server" as additional module in your entry point
//         // Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI option does.
//
//         // Set this as true if you want to access dev server from arbitrary url.
//         // This is handy if you are using a html5 router.
//         historyApiFallback: false,
//
//         // Set this if you want webpack-dev-server to delegate a single path to an arbitrary server.
//         // Use "*" to proxy all paths to the specified server.
//         // This is useful if you want to get rid of 'http://localhost:8080/' in script[src],
//         // and has many other use cases (see https://github.com/webpack/webpack-dev-server/pull/127 ).
//         proxy: {
//             "*": "http://localhost:9090"
//         },
//
//         // webpack-dev-middleware options
//         quiet: false,
//         noInfo: false,
//         lazy: true,
//         filename: "bundle.js",
//         watchOptions: {
//             aggregateTimeout: 300,
//             poll: 1000
//         },
//         publicPath: "/assets/",
//         headers: { "X-Custom-Header": "yes" },
//         stats: { colors: true },
//     });
//     server.listen(8080, "localhost", function() {});
// })
gulp.task('default', gulpSequence('cleanWebpackDist', 'webpack:bulid'));
var webserver = require('gulp-webserver');
var cors = require('cors');
gulp.task('webserver', function () {
    return gulp.src('./')
        .pipe(webserver({
            host: '127.0.0.1',
            directoryListing: {
                enable: true,
                path: './',
                options: {
                    // icons:true
                }
            },
            open: true,
            port: 9053,
            middleware: [cors()]
        }));
});