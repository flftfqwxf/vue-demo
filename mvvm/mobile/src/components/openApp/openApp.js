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
    var iframe;
    return function (src) {
        if (iframe) {
            return iframe;
        } else {
            iframe = document.createElement('iframe');
            iframe.id = 'openAppIframe'
            iframe.style.display = 'none';
            iframe.src=src;
            iframe.onerror=function () {
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
    noIntent: 'MQQBrowser|ucbrowser|baidubrowser|sogouMobilebrowser|mxbrowser|360 APhone',
//            noIntent: 'MQQBrowser|ucbrowser|baidubrowser|sogouMobilebrowser|mxbrowser|LieBao|360 APhone',
    iosNoUN: 'Crios|Fxios|baidubrowser|sogouMobilebrowser|QHBrowser|Mxios'
};
let openIframe;
window.appLaunch=false;
var appLaunchFun=function () {
    window.appLaunch = true;//唤起成功
}
document.removeEventListener("visibilitychange",appLaunchFun);
document.addEventListener("visibilitychange",appLaunchFun);


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

var locationDownLoad=function (downLoadUrl) {
    var loadDateTime = Date.now();
    setTimeout(function () {
        var timeOutDateTime = Date.now();
        if (timeOutDateTime - loadDateTime < 1000) {
            window.location.href = downLoadUrl;
        }
    }, 25);
}
var openApp = function (schemeLink, baseLink,intentLink, iOSdownLoadLink, androidDownLoadLink) {
    //生成你的scheme你也可以选择外部传入
    // var localUrl = createScheme({type: 1, id: "sdsdewe2122"});
    // var localUrl = encodeURIComponent(bashScheme);
    var regexp = new RegExp(canOpenApp.noIntent, 'i');
    if (window.navigator.userAgent.match(/OS 9/i) != null || (window.navigator.userAgent.match(/OS/i) != null && window.navigator.userAgent.match(/CriOS/i) != null)) {
        window.location.href = baseLink;
        locationDownLoad(iOSdownLoadLink);

    } else {
        if (!openIframe) {
            openIframe = createIframe(schemeLink);
        } else {
            openIframe.src = schemeLink
        }
        setTimeout(function () {
            if (window.appLaunch == false && window.navigator.userAgent.match(/Android/i) != null && window.navigator.userAgent.match(regexp) == null) {//唤起但不支持vilibilitychange不需要进这个逻辑,或者未唤起且不支持youku://协议需要进入逻辑
                // var chromeUrl = "intent://play?vid="+videoIdEn+callAppFidEn+callAppRefer+callAppTuid+callAppUa+"&source="+tsource+"&cookieid="+cookieid+cookiePlus+"#Intent;scheme=youku;package=com.youku.phone;end;";
                window.location.href = "intent://play?vid=XMTY5OTEzODI4MA==&ua=other&source=mplaypage2&cookieid=1472114969039HpoihU|l4Xifn#Intent;scheme=youku;package=com.youku.phone;end;";
                // alert(intentLink)
                locationDownLoad(androidDownLoadLink)
            }else{
                locationDownLoad(androidDownLoadLink)
            }
        }, 500);
        // setTimeout(function () {
        //     window.location.href = androidDownLoadLink;
        // }, 1000);
    }
}
module.exports = openApp;