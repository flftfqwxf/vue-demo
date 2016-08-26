/**
 * Created by leixianhua on 16/8/25.
 */
const UA = window.navigator.userAgent.toLowerCase()
const isAndroid = UA && UA.indexOf('android') > 0
const isChrome = UA && UA.indexOf('chrome') > 0
const isIos = UA && /(iphone|ipad|ipod|ios)/i.test(UA)
const iosVersionMatch = isIos && UA.match(/os ([\d_]+)/)
const iosVersion = iosVersionMatch && iosVersionMatch[1].split('_')
//实际上就是新建一个iframe的生成器
var createIframe = (function () {
    var iframe;
    return function () {
        if (iframe) {
            return iframe;
        } else {
            iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            return iframe;
        }
    }
})()
//增加通用链接的生成,
var baseScheme = "ironhide://";
var Scheme = "ironhide://article?source_id=26";
var baseLink = "http://m.xxxx.com?";
var createScheme = function (options, isLink) {
    var urlScheme = isLink ? baseLink : baseScheme;
    for (var item in options) {
        urlScheme = urlScheme + item + '=' + encodeURIComponent(options[item]) + "&";
    }
    urlScheme = urlScheme.substring(0, urlScheme.length - 1);
    return isLink ? urlScheme : encodeURIComponent(urlScheme);
}
var openApp = function (bashScheme, baseLink, options, iOSdownLoadLink, androidDownLoadLink) {
    //生成你的scheme你也可以选择外部传入
    // var localUrl = createScheme({type: 1, id: "sdsdewe2122"});
    var localUrl = createScheme(options);
    var openIframe = createIframe();
    if (isIos) {
        //判断是否是ios,具体的判断函数自行百度
        if (iosVersion > 8) {
            //判断是否为ios9以上的版本,跟其他判断一样navigator.userAgent判断,ios会有带版本号
            localUrl = createScheme(options, true);//代码还可以优化一下
            location.href = localUrl;//实际上不少产品会选择一开始将链接写入到用户需要点击的a标签里
            return;
        }
        window.location.href = localUrl;
        var loadDateTime = Date.now();
        setTimeout(function () {
            var timeOutDateTime = Date.now();
            if (timeOutDateTime - loadDateTime < 1000) {
                window.location.href = iOSdownLoadLink;
            }
        }, 25);
    } else if (isAndroid) {
        //判断是否是android，具体的判断函数自行百度
        if (isChrome) {
            //chrome浏览器用iframe打不开得直接去打开，算一个坑
            window.location.href = localUrl;
        } else {
            //抛出你的scheme
            openIframe.src = localUrl;
        }
        setTimeout(function () {
            window.location.href = androidDownLoadLink;
        }, 500);
    } else {
        // //主要是给winphone的用户准备的,实际都没测过，现在winphone不好找啊
        // openIframe.src = localUrl;
        // setTimeout(function () {
        //     window.location.href = "你的下载页面";
        // }, 500);
    }
}
module.exports = openApp;