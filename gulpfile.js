var gulp = require('gulp'),
    fs = require('fs'),
    sequence = require("gulp-sequence"),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    clean = require("gulp-clean"),
    publishConf=require('./publish.json'),
    path=require('path'),
    updateJsp=false;



//var uncss = require('gulp-uncss');
//var concat = require('gulp-concat');
var pkg = require('./package.json');
//var colors = require('colors');
//var imagemin = require('gulp-imagemin');
//var pngcrush = require('imagemin-pngcrush');
//var jpegtran = require('imagemin-jpegtran');
//var debug = require('gulp-debug');
//var gulpif = require('gulp-if');
var rimraf=require('gulp-rimraf');
var sass = require('gulp-ruby-sass');
var gulpSequence=require('gulp-sequence');
var gulpFilter=require('gulp-filter');

/*var iconfont = require('gulp-iconfont');
 var runTimestamp = Math.round(Date.now()/1000);
 var iconfontCss=require('gulp-iconfont-css');
 var iconfontCssAndTemplate=require('gulp-iconfont-css-and-template');*/

var getConf=function(project){
        return publishConf[project]||{};
    },
    updateConfig=function(conf,jsp){
        var dir=path.join(__dirname,jsp);
        if(!fs.existsSync(dir)){
            dir=dir.replace("gmmtour-web-","");
        }

        var config=fs.readFileSync(dir).toString('utf8');
        config=config.replace(/value=\"(\d+(\.\d+){0,2})\"/, "value=\"" + conf.version+"\"");
        fs.writeFile(dir ,config , 'utf8', function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("project:"+jsp+", version:"+conf.version);
            }
        });
    },
    staticPublish=function(project){
        //gulp.src("./oldVersion/dist/"+project+"/").pipe(clean());
        var conf=getConf(project);
        gulp.src(["./oldVersion/"+project+"/**/*.*"]).pipe(gulp.dest("./oldVersion/dist/"+conf.version+"/"+project+"/"));

        //gulp.src(["./oldVersion/"+project+"/**/*.js"]).pipe(gulp.dest("./oldVersion/dist/"+conf.version+"/"+project+"/"));
        //gulp.src(["./oldVersion/"+project+"/**/*.css"]).pipe(minifyCSS({keepBreaks: false})).pipe(gulp.dest("./oldVersion/dist/"+conf.version+"/"+project+"/"));

        if(updateJsp){
            if(typeof conf.jsp=="object"){
                for(var i=0;i<conf.jsp.length;i++){
                    updateConfig(conf,conf.jsp[i]);
                }
            }
            else{
                updateConfig(conf,conf.jsp);
            }
        }
    };

/**
 * 编译公共bootstrap SASS
 */
gulp.task('bootstrapScss',['cleanBootStrapScss'],function () {
    return sass(pkg.bootstrap_scss_dir,{
        precision: 6,
        verbose:true,
        stopOnError: true,
        cacheLocation: './.scss-cache',
        //style:'compressed',
        loadPath:'oldVersion'
    }).on('error', sass.logError)
        .pipe(gulp.dest(pkg.bootstrap_scss_dist_dir));
});

/**
 * 编译分销商PC站SCSS
 */
gulp.task('mPcScss', function () {
    return sass("./oldVersion/m/pc/skin/css/**/*.scss",{
        verbose:true,
        precision: 6,
        stopOnError: true,
        cacheLocation: './.scss-cache',
        style:'expanded',
        loadPath:'oldVersion'
    }).on('error', sass.logError).pipe(gulp.dest("./oldVersion/m/pc/skin/css/"));
});

/**
 * 编译供应商PC站SCSS
 */
gulp.task('sPcScss', function () {
    return sass("./oldVersion/supplier/pc/skin/css/**/*.scss",{
        verbose:true,
        precision: 6,
        stopOnError: true,
        cacheLocation: './.scss-cache',
        style:'expanded',
        loadPath:'oldVersion'
    }).on('error', sass.logError).pipe(gulp.dest("./oldVersion/supplier/pc/skin/css/"));
});

/**
 * 编译分销商mobile站SCSS
 */
gulp.task('mMobileScss', function () {
    return sass("./oldVersion/m/theme/**/*.scss",{
        verbose:true,
        precision: 6,
        stopOnError: true,
        cacheLocation: './.scss-cache',
        style:'expanded',
        loadPath:'oldVersion'
    }).on('error', sass.logError).pipe(gulp.dest("./oldVersion/m/theme/"));
});

/**
 * 编译供应商mobile站SCSS
 */
gulp.task('sMobileScss', function () {
    return sass("./oldVersion/supplier/mobile/**/*.scss",{
        verbose:true,
        precision: 6,
        stopOnError: true,
        cacheLocation: './.scss-cache',
        style:'expanded',
        loadPath:'oldVersion'
    }).on('error', sass.logError).pipe(gulp.dest("./oldVersion/supplier/mobile/"));
});

/**
 * 编译主站PC站SCSS
 */
gulp.task("wwwPcScss", function () {
    return sass("./oldVersion/www/pc/skin/css/**/*.scss",{
        verbose:true,
        precision: 6,
        stopOnError: true,
        cacheLocation: './.scss-cache',
        style:'expanded',
        loadPath:'oldVersion'
    }).on('error', sass.logError).pipe(gulp.dest("./oldVersion/www/pc/skin/css/"));
});

/**
 * 编译供应商SCSS
 */
gulp.task('supplierScss', function () {
    return sass(pkg.supplier_scss_dir,{
        precision: 6,
        verbose:true,
        stopOnError: true,
        cacheLocation: './.scss-cache',
        //style:'compressed',
        loadPath:'oldVersion'
    }).on('error', sass.logError)
        .pipe(gulp.dest(pkg.supplier_scss_dist_dir));
});

/**
 * 编译分销商SCSS
 */
gulp.task('distributorScss', function () {
    return sass(pkg.distributor_scss_dir,{
        verbose:true,
        precision: 6,
        stopOnError: true,
        cacheLocation: './.scss-cache',
        //style:'compressed',
        loadPath:'oldVersion'
    }).on('error', sass.logError)
        .pipe(gulp.dest(pkg.distributor_scss_dist_dir));
});
/**
 * 编译公共组件SCSS
 */
gulp.task('pluginsScss', function () {
    return sass(pkg.plugins_scss_dir,{
        verbose:true,
        precision: 6,
        stopOnError: true,
        cacheLocation: './.scss-cache',
        //style:'compressed',
        loadPath:'oldVersion'
    }).on('error', sass.logError)
        .pipe(gulp.dest(pkg.plugins_scss_dist_dir));
});
/**
 * 编译公共业务模块SCSS
 */
gulp.task('moduleScss', function () {
    return sass(pkg.module_scss_dir,{
        verbose:true,
        precision: 6,
        stopOnError: true,
        cacheLocation: './.scss-cache',
        //style:'compressed',
        loadPath:'oldVersion'
    }).on('error', sass.logError)
        .pipe(gulp.dest(pkg.module_scss_dist_dir));
});
//编译SCSS
//gulp.task('default',['bootstrapScss','supplierScss'], function () {
//});
gulp.task('allScss', gulpSequence('bootstrapScss','supplierScss','distributorScss','pluginsScss','moduleScss','sPcScss','mPcScss','wwwPcScss','mMobileScss','sMobileScss'));

gulp.task('default', ['allScss'],function(cb){
    sequence("build",cb);
}).on('stop',function(){
    console.log('正在copy文件中，等待几十秒...');
});
/**
 * 只压缩CSS
 */
gulp.task('onlymincss', function () {
    return gulp.src(pkg.css_dir)
        .pipe(minifyCSS({keepBreaks: false}))
        .pipe(gulp.dest(pkg.css_dist_dir + pkg.css_version))
});
/**
 * 清除BOOTSTRAP 编译的多余文件
 */
gulp.task('cleanBootStrapScss', function () {
    return gulp.src(pkg.bootstrap_scss_dist_dir,{read:false})
        .pipe(rimraf({ force: true }));
})

//执行顺序
// 编译SASS
//生成background-image MD5版本号
//压缩CSS
gulp.task('mincss', function () {
    return gulp.src(pkg.scss_dir)
        .pipe(sass({sourcemap: false}))
        .on('error', function (err) { console.log('error:',err.message); })
        //.pipe(minifyCSS({keepBreaks: false}))
        .pipe(gulp.dest(pkg.css_dist_dir + pkg.css_version));
});
//var newBuffer=require('newBuffer');

//gulp.task('default', ['mincss', 'uglify'], function () {
//});

/**
 * 压缩JS
 */
gulp.task('uglify', function () {
    gulp.src(pkg.js_dir)
        .pipe(uglify())
        .pipe(gulp.dest(pkg.js_dist_dir + pkg.js_version))
});






/**
 * 前端资源处理 start *************************************
 * */
gulp.task("console",function(){
    return staticPublish("console");
});
gulp.task("supplier",function(){
    return staticPublish("supplier");
});
gulp.task("distributor",function(){
    return staticPublish("distributor");
});
gulp.task("www",function(){
    return staticPublish("www");
});
gulp.task("m",function(){
    return staticPublish("m");
});
gulp.task("common",function(){
    var versionAttr={};

    versionAttr[getConf("m").version]=getConf("m").version;
    versionAttr[getConf("www").version]=getConf("www").version;
    versionAttr[getConf("distributor").version]=getConf("distributor").version;
    versionAttr[getConf("supplier").version]=getConf("supplier").version;
    versionAttr[getConf("console").version]=getConf("console").version;

    for(var key in versionAttr){
        gulp.src(["./oldVersion/common/**/*.*","!**/*.js","!**/*.css","!**/*.scss"]).pipe(gulp.dest("./oldVersion/dist/"+key+"/common/"));
        gulp.src(["./oldVersion/common/**/*.js"]).pipe(uglify()).pipe(gulp.dest("./oldVersion/dist/"+key+"/common/"));
        gulp.src(["./oldVersion/common/**/*.css"]).pipe(minifyCSS({keepBreaks: false})).pipe(gulp.dest("./oldVersion/dist/"+key+"/common/"));
    }
});

gulp.task("staticPublish",["console","supplier","distributor","www","m"],function(cb){
    sequence("common",cb);
});

gulp.task("clean:dist",function(){
    return gulp.src("./oldVersion/dist/").pipe(clean());
});

gulp.task("build",["clean:dist"],function(cb){
    sequence(["staticPublish"],cb);
});

gulp.task('publish', ['allScss'],function(cb){
    updateJsp=true;
    sequence("build",cb);
});
/**
 * 前端资源处理 end *****************************************
 * */






/**
 * 生成 字体图标 iconFont
 */
/*
 var fontName = 'gm';

 gulp.task('iconFontCssAndTemplate', function(){
 gulp.src([pkg.iconfont_dir])
 .pipe(iconfontCssAndTemplate({
 fontName: fontName,
 cssClass:'gmIcon',
 cssTargetPath:'iconFont.css'
 }))
 .pipe(iconfont({
 fontName: fontName,
 formats: ['ttf', 'eot', 'woff','svg']
 }))
 .pipe(gulp.dest(pkg.iconfont_dist_dir));

 });
 gulp.task('iconFontScss', function () {
 return sass(pkg.iconfont_dist_dir+'/*.scss',{
 verbose:true,
 precision: 6,
 stopOnError: true,
 cacheLocation: './.scss-cache',
 //style:'compressed',
 loadPath:'oldVersion'
 }).on('error', sass.logError)
 .pipe(gulp.dest(pkg.iconfont_dist_dir));
 });
 gulp.task('iconFont',gulpSequence('iconFontCssAndTemplate','iconFontScss'));*/

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
