var gulp = require('gulp');
var fs = require('fs');
var gutil = require('gulp-util');
//var uncss = require('gulp-uncss');
//var concat = require('gulp-concat');
var pkg = require('./package.json');
var path = require('path')
var webpack = require('webpack');
var prodConfig = require('./mvvm/build/webpack.prod.conf');
// var devConfig = require('./mvvm/build/webpack.dev.conf');
var buildBaseConfig = require('./buildConfig');
var gulpCopy = require('gulp-file-copy')
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
    var clearPath = buildBaseConfig.outPutPath
    console.log('----------------------------------/n')
    console.log('被清空的目录:' + clearPath);
    console.log('----------------------------------/n')
    return gulp.src(clearPath, {read: false})
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
gulp.task('copyFolder', function () {
    if (buildBaseConfig.copyFolder) {
        // var copyFolderList = buildBaseConfig.copyFolder.split(',');
        // var copyPath = [], copyBase = [];
        // copyFolderList.forEach(function (val) {
        //     if (val) {
        //         var curpath = path.resolve(__dirname, val)
        //         copyPath.push(curpath + '/**/*');
        //         copyBase.push(curpath.substring(0, curpath.lastIndexOf('/')))
        //     }
        // })
        // // var copyBase = copyPath.substring(0, copyPath.lastIndexOf('/'))
        var toPath = path.resolve(__dirname, buildBaseConfig.outPutPath);
        // console.log('要复制的目录:', copyPath)
        // console.log('复制到:', toPath)
        // console.log('base:', copyBase)
        // gulp.src(copyPath+,{base: './'})
        //     .pipe(gulpCopy(toPath, {
        //         start: copyPath
        //     }))
        buildBaseConfig.copyFolder.forEach(function (item,index) {
            var toPath = path.resolve(__dirname, buildBaseConfig.outPutPath);
            console.log('要复制的目录:', item.dir)
            console.log('复制到:', toPath+='/'+item.toDir)
            // console.log('base:', copyBase[index])
            gulp.src(item.dir).pipe(gulp.dest(toPath))

        })

    }
    return false;

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
gulp.task('default', function (cb) {
    return gulpSequence('cleanWebpackDist', 'webpack:bulid','copyFolder', cb)
});
// gulp.task('default', gulpSequence('cleanWebpackDist'));
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
gulp.task('mobile', function () {
    return gulp.src('./site-mobile')
        .pipe(webserver({
            host: '192.168.29.33',
            directoryListing: {
                enable: true,
                path: './site-mobile',
                options: {
                    // icons:true
                }
            },
            open: true,
            port: 9054,
            middleware: [cors()]
        }));
});
gulp.task('web', function () {
    return gulp.src('./web')
        .pipe(webserver({
            host: '192.168.29.33',
            directoryListing: {
                enable: true,
                path: './web',
                options: {
                    // icons:true
                }
            },
            open: true,
            port: 9053,
            middleware: [cors()]
        }));
});
gulp.task('wulianMobile', function () {
    return gulp.src('./wulianMobile')
        .pipe(webserver({
            host: '192.168.29.33',
            directoryListing: {
                enable: true,
                path: './wulianMobile',
                options: {
                    // icons:true
                }
            },
            open: true,
            port: 9055,
            middleware: [cors()]
        }));
});