/**
 * Created by leixianhua on 16/8/25.
 */
const UA = window.navigator.userAgent.toLowerCase()
const isAndroid = UA && UA.indexOf('android') > 0
const isChrome = UA && UA.indexOf('chrome') > 0
const isIos = UA && /(iphone|ipad|ipod|ios)/i.test(UA)
const iosVersionMatch = isIos && UA.match(/os ([\d_]+)/)
const iosVersion = iosVersionMatch && iosVersionMatch[1].split('_')[0]
//实际上就是新建一个iframe的生成器
const createIframe = (function () {
    // document.body.removeChild()
    var iframe;
    return function (src) {
        if (iframe) {
            return iframe;
        } else {
            iframe = document.createElement('iframe');
            iframe.id = 'openAppIframe'
            iframe.style.display = 'none';
            iframe.src = src;
            iframe.onerror = function () {
                alert('error');
            }
            document.body.appendChild(iframe);
            return iframe;
        }
    }
})()
const canOpenApp = {
    android: 'MQQBrowser|ucbrowser|weibo|micromessenger|AliApp|article',
    ios: 'MQQBrowser|ucbrowser|weibo|QHBrowser|micromessenger|AliApp|article',
    noIntent: 'MQQBrowser|ucbrowser|baidubrowser|sogouMobilebrowser|mxbrowser|360 APhone|mz',
//            noIntent: 'MQQBrowser|ucbrowser|baidubrowser|sogouMobilebrowser|mxbrowser|LieBao|360 APhone',
    iosNoUN: 'Crios|Fxios|baidubrowser|sogouMobilebrowser|QHBrowser|Mxios'
};
let openIframe;
window.appLaunch = false;
var appLaunchFun = function () {
    window.appLaunch = true;//唤起成功
}
document.removeEventListener("visibilitychange", appLaunchFun);
document.addEventListener("visibilitychange", appLaunchFun);
//增加通用链接的生成,
var createScheme = function (options) {
    var urlScheme = baseLink ? baseLink : baseScheme;
    for (var item in options) {
        urlScheme = urlScheme + item + '=' + encodeURIComponent(options[item]) + "&";
    }
    urlScheme = urlScheme.substring(0, urlScheme.length - 1);
    return baseLink ? urlScheme : encodeURIComponent(urlScheme);
}
var createIntentUrl = function (options) {
    var intentUrl = "intent://" + options.host + options.hostPath;
    intentUrl += "#Intent;scheme=" + options.scheme + ";package=" + options.package + ";end;";
    return intentUrl;
}
var openTimeout;
var locationDownLoad = function (androidDownLoadUrl, iosDownLoadUrl, startTime) {
    var downLoadUrl = androidDownLoadUrl;
    if (isIos) {
        downLoadUrl = iosDownLoadUrl;
    }
    clearTimeout(openTimeout);
    openTimeout = setTimeout(function () {
        var timeOutDateTime = Date.now();
        // alert(startTime)
        if (timeOutDateTime - startTime < 3000) {

            // alert(downLoadUrl)
            window.location.href = downLoadUrl;
        }
    }, 2500);
}
window.onblur = function () {
    // alert('timeout');
    clearTimeout(openTimeout);
}
var openApp = function (schemeLink, baseLink, intentLink, iosDownLoadLink, androidDownLoadLink) {
    //生成你的scheme你也可以选择外部传入
    // var localUrl = createScheme({type: 1, id: "sdsdewe2122"});
    // var localUrl = encodeURIComponent(bashScheme);
    var regexp = new RegExp(canOpenApp.noIntent, 'i');
    var startTime = Date.now();
    if (baseLink && (window.navigator.userAgent.match(/OS 9/i) != null || (window.navigator.userAgent.match(/OS/i) != null && window.navigator.userAgent.match(/CriOS/i) != null))) {
        window.location.href = baseLink;
        // locationDownLoad(androidDownLoadLink, iosDownLoadLink, startTime);
    } else {
        if (isIos) {
            locationDownLoad(androidDownLoadLink, iosDownLoadLink, startTime);
            window.location.href = schemeLink;
        } else if (!openIframe) {
            // alert(2)
            openIframe = createIframe(schemeLink);
        } else {
            openIframe.src = schemeLink
        }
        setTimeout(function () {
            // alert(UA)
            if (window.appLaunch == false && window.navigator.userAgent.match(/Android/i) != null && window.navigator.userAgent.match(regexp) == null) {//唤起但不支持vilibilitychange不需要进这个逻辑,或者未唤起且不支持youku://协议需要进入逻辑
                // var chromeUrl = "intent://play?vid="+videoIdEn+callAppFidEn+callAppRefer+callAppTuid+callAppUa+"&source="+tsource+"&cookieid="+cookieid+cookiePlus+"#Intent;scheme=youku;package=com.youku.phone;end;";
                // window.location.href = "intent://play?vid=XMTY5OTEzODI4MA==&ua=other&source=mplaypage2&cookieid=1472114969039HpoihU|l4Xifn#Intent;scheme=youku;package=com.youku.phone;end;";
                window.location.href = intentLink;
                locationDownLoad(androidDownLoadLink, iosDownLoadLink, startTime);
            }else{
                locationDownLoad(androidDownLoadLink, iosDownLoadLink,startTime)

            }
        }, 200);
        // setTimeout(function () {
        //     locationDownLoad(androidDownLoadLink, iosDownLoadLink)
        // }, 400);
    }
}
module.exports = openApp;