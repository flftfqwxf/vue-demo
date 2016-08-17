var gulp = require('gulp'),
    fs = require('fs'),
    sequence = require("gulp-sequence"),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    clean = require("gulp-clean"),
    publishConf = require('./publish.json'),
    path = require('path'),
    updateJsp = false;
//var uncss = require('gulp-uncss');
//var concat = require('gulp-concat');
var pkg = require('./package.json');
//var colors = require('colors');
//var imagemin = require('gulp-imagemin');
//var pngcrush = require('imagemin-pngcrush');
//var jpegtran = require('imagemin-jpegtran');
//var debug = require('gulp-debug');
//var gulpif = require('gulp-if');
var rimraf = require('gulp-rimraf');
var sass = require('gulp-ruby-sass');
var gulpSequence = require('gulp-sequence');
var gulpFilter = require('gulp-filter');
var iconfont = require('gulp-iconfont');
var runTimestamp = Math.round(Date.now() / 1000);
var iconfontCss = require('gulp-iconfont-css');
var iconfontCssAndTemplate = require('gulp-iconfont-css-and-template');
/**
 * 生成 字体图标 iconFont
 */
var fontName = 'wl';
gulp.task('iconFontCssAndTemplate', function () {
    gulp.src([pkg.iconfont_dir])
        .pipe(iconfontCssAndTemplate({
            fontName: fontName,
            cssClass: 'wlIcon',
            cssTargetPath: 'iconFont.css'
        }))
        .pipe(iconfont({
            fontName: fontName,
            prependUnicode: true, // recommended option
            normalize:true,
            fontHeight: 1500,
            formats: ['ttf', 'eot', 'woff','woff2', 'svg']
        }))
        .pipe(gulp.dest(pkg.iconfont_dist_dir));
});
gulp.task('iconFontScss', function () {
    return sass(pkg.iconfont_dist_dir + '/*.scss', {
        verbose: true,
        precision: 6,
        stopOnError: true,
        cacheLocation: './.scss-cache',
        //style:'compressed',
        loadPath: 'oldVersion'
    }).on('error', sass.logError)
        .pipe(gulp.dest(pkg.iconfont_dist_dir));
});
gulp.task('iconFont', gulpSequence('iconFontCssAndTemplate', 'iconFontScss'));
/*
 var gulp = require('gulp');
 var webserver = require('gulp-webserver');

 gulp.task('webserver', function() {
 return  gulp.src('oldVersion/')
 .pipe(webserver({
 host:'static.gmmtour.com',
 directoryListing: true,
 open: true,
 //path:'/oldVersion',
 port:80,
 }));
 });*/
