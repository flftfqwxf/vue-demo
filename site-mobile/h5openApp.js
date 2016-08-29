var startDate = '2015/11/14 00:00:00'; //播放器播后唤起开始时间
var endDate = '2015/11/15 00:00:00';	//播放器播后唤起结束时间
var onPlayBtn = 0;//播后无条件唤起开关 ==2是独播
var opCookie = function(name, value, options) {
    if (typeof value != 'undefined') {
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; ex2pires=' + date.toUTCString();
        }
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    try{
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    }catch(ex){
                        cookieValue = "";
                    }
                    break;
                }
            }
        }
        return cookieValue;
    }
};
var cookieid = opCookie("__ysuid") || '';
if(cookieid == '' || cookieid.length == 16){
    cookieid = tGetPvid(6);
    opCookie("__ysuid", cookieid, {expires:1,domain:'youku.com',path:'/'});
}
sendLog();    //发送上一页面日志
var canOpenApp = {
    android:'MQQBrowser|ucbrowser|weibo|micromessenger|AliApp|article',
    ios:'MQQBrowser|ucbrowser|weibo|QHBrowser|micromessenger|AliApp|article',
    noIntent:'MQQBrowser|ucbrowser|baidubrowser|sogouMobilebrowser|mxbrowser|LieBao|360 APhone',
    iosNoUN:'Crios|Fxios|baidubrowser|sogouMobilebrowser|QHBrowser|Mxios'
};
var pinzhuan = new Array("baidu_pinzhuan","mofangzhuomian","360yingshi","360sousuo","sougousousuo","souhushipin","sougouvr","2345yingshi","tianqitong","zhuia","chuizi","leshirili","test1","test2","test3","test4","test5");		//自动唤起白名单
var appLaunch = false;
document.addEventListener("visibilitychange", function() {
    window.appLaunch = true;//唤起成功
});
var H5OpenApp = {
    init:function(ts,tTime,cp,cpp,op){		//ts:春节统计source值,tTime:唤起延迟时间,cp:HZ统计cp值,cpp:HZ统计cpp值,op:唤起方式选择参数
        if(!ts){
            ts = 'mplaypage2';
        }
        var cookiePlus = '';
        if(op != 1){		//春节日志发送
            cookiePlus = tGetPvid(6,1);
            recallAppLog(ts,cookiePlus);
        }
        if(cp && cpp){
            var hzurl = 'http://hz.youku.com/red/click.php?tp=1&cp='+cp+'&cpp='+cpp+'&='+Math.floor(Math.random()*1000000);
            H5OpenApp.clickLog(hzurl);
        }

        if(!tTime){
            tTime = 100;
        }
        if(op == 3){
            H5OpenApp.universalLinkCallApp(ts,cookiePlus);
        }else{
            setTimeout(function(){
                if(op == 1){
                    H5OpenApp.weiboCallApp(ts);
                }
                else{
                    H5OpenApp.callApp(ts,op,cookiePlus);
                }
            },tTime);
        }
    },
    callApp:function(ts,op,cp){
        var tsource = 'mplaypage2';
        if(ts){
            tsource = ts;
        }
        var cookiePlus = '';
        if(cp){
            cookiePlus = '|'+cp;
        }
        var playUrl = "youku://play?vid="+videoIdEn+callAppFidEn+callAppRefer+callAppTuid+callAppUa+"&source="+tsource+"&cookieid="+cookieid+cookiePlus;
        var regexp = new RegExp(canOpenApp.noIntent,'i');

        if(window.navigator.userAgent.match(/OS 9/i) != null || (op == 2  && window.navigator.userAgent.match(/OS/i) != null && window.navigator.userAgent.match(/CriOS/i) != null)){
            window.location.href = playUrl;
        }else{
            var iframe = document.createElement("iframe");
            iframe.height = 0;
            iframe.width = 0;
            iframe.src = playUrl;
            document.body.appendChild(iframe);
            setTimeout(function(){
                if(window.appLaunch == false && window.navigator.userAgent.match(/Android/i) != null && window.navigator.userAgent.match(regexp) == null){//唤起但不支持vilibilitychange不需要进这个逻辑,或者未唤起且不支持youku://协议需要进入逻辑
                    var chromeUrl = "intent://play?vid="+videoIdEn+callAppFidEn+callAppRefer+callAppTuid+callAppUa+"&source="+tsource+"&cookieid="+cookieid+cookiePlus+"#Intent;scheme=youku;package=com.youku.phone;end;";
                    window.location = chromeUrl;
                }
            },1000);
        }
    },
    weiboCallApp:function(ts){
        var launcher = new Launcher();
        launcher.launch({
            vid:window.videoIdEn,
            source:ts
        });
    },
    universalLinkCallApp:function(tsource,cp){
        var cookiePlus = '';
        if(cp){
            cookiePlus = '%7C'+cp;
        }
        var fua = /Safari\/\d+(\.\d+)*$/.test(navigator.userAgent) ? "safari" : "other";
        var fallback_url = encodeURIComponent(location.href);
        //window.location.href = 'http://link-jump.youku.com/a/play?ts='+new Date().getTime()+"&fallback_url=http://www.youku.com";
        window.location.href = 'http://link-jump.youku.com/a/play?vid='+videoIdEn+callAppFidEn+callAppRefer+callAppTuid+"&source="+tsource+"&action=play&webSocketEnabled=false&ua="+fua+"&cookieid="+cookieid+cookiePlus+"&ccts="+new Date().getTime()+"&fallback_url="+fallback_url+'&fua='+fua+"&special=1&ts="+new Date().getTime();
    },
    clickLog:function(url){
        if(url != ''){
            var img = new Image();
            img.src = url+'&r='+ Math.random();
            img.onload = img.onerror = function(){img = null;}
        }
    }
};
//进入页面发统计or唤起
var startSendTime = Date.parse('2016/08/19 19:00:00');
var endSendTime = Date.parse('2016/08/22 00:00:00');
var tSendTime = Date.parse(new Date());
if(tSendTime>startSendTime && tSendTime<endSendTime){
    //独播自动唤起  WIRELESS-56388
    if(window.navigator.userAgent.match(/ucbrowser/i) == null){
        var regexp = new RegExp(canOpenApp.iosNoUN,'i');
        var tMatch = window.navigator.userAgent.match(regexp);

        if(window.navigator.userAgent.match(/android/i) != null || (window.navigator.userAgent.match(/OS/i) != null && tMatch != null)){
            H5OpenApp.init('exclusive-pageload',200,null,null,2);
        }else if(window.navigator.userAgent.match(/OS 9/i) != null){ //播后唤起
            onPlayBtn = 2;
    }
        }
}

//品专白名单自动唤起start WIRELESS-53506
var inArray = function(arr, item) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == item) {
            return true;
        }
    }
    return false;
};
var fromValue = getQueryString('from');
//只有安卓唤起 WIRELESS-56313
if(fromValue && inArray(pinzhuan,fromValue) && window.navigator.userAgent.match(/android/i) != null){
    H5OpenApp.init('h5-auto',100,null,null,0);
}
//品专白名单自动唤起end WIRELESS-53506

if(window.navigator.userAgent.match(/QQLive/i) != null){
    H5OpenApp.init('mplaypages',100,'4010662','1000962',0);
}
if(window.navigator.userAgent.match(/iphone/i) != null){
    if(window.navigator.userAgent.match(/SohuVideo/i) != null){
        H5OpenApp.init('mplaypages',100,'4010663','1000962',0);
    }
    if(window.navigator.userAgent.match(/Letv/i) != null){
        H5OpenApp.init('mplaypages',100,'4010664','1000962',0);
    }
}
var playFlag = true
function onPlayStartOpenApp(vdata){
    if(playFlag){
        playFlag = false;
        var canCallApp = garyToCallApp();
        if(canCallApp){
            var cp =  '4010700';
            var cpp = '1000962';
            if(window.navigator.userAgent.match(/android/i) != null){
                cp = '4010699';
            }
            var op = 0;
            var tsource = 'h5-auto';
            if(window.navigator.userAgent.match(/weibo/i) != null || (window.navigator.userAgent.match(/android/i) != null && window.navigator.userAgent.match(/MQQBrowser/i) != null)){
                op = 1;
            }else if(onPlayBtn == 2){
                op = 3;
                tsource = 'exclusive-player';
            }
            H5OpenApp.init(tsource,600,cp,cpp,op);
        }
        //延迟显示
        if(typeof(showPlayerNoti) != "undefined"&& vdata && showPlayerNoti){
            setTimeout(function(){
                showPlayerNoti(vdata);
            },3000);
        }
    }

}
function garyToCallApp(){
    //带tuid的播后唤起
    var tuid = getQueryString('tuid');
    if(tuid){
        return true;
    }
    if(onPlayBtn != 0){
        try{
            var today = new Date().getDate();
            var logPlus = localStorage.openAPPKey || 0;
            if(logPlus != today){
                localStorage.openAPPKey =today;
                return true;
            }
        }catch(e){
        }
        return false;
    }

    var startTime = Date.parse(startDate);
    var endTime = Date.parse(endDate);
    var tTime = Date.parse(new Date());
    var regexp = new RegExp(canOpenApp.ios,'i');
    if(window.navigator.userAgent.match(/android/i) != null){
        regexp = new RegExp(canOpenApp.android,'i');
    }
    var tMatch = window.navigator.userAgent.match(regexp);
    if(tTime>startTime && tTime<endTime && tMatch == null ){ //黑名单浏览器+规定时间段之外不可唤起
        return true;
    }
    return false;
}

//H5唤起APP接口日志
function recallAppLog(source,cp){
    if(source){
        if(window.navigator.userAgent.match(/weibo/i) != null){
            var ua = 'weibo';
        }else if(window.navigator.userAgent.match(/ucbrowser/i) != null){
            var ua = 'uc';
        }else{
            var ua = 'other';
        }
        var pid = window.navigator.userAgent.match(/iphone/i) != null ? '69b81504767483cf' : '0d7c3ff41d42fcd9';
        var datetime = Date.parse(new Date())/1000;
        var refer = getQueryString('refer') || '';
        var tuid = getQueryString('tuid') || '';
        var cookiePlus = '';
        if(cp){
            cookiePlus = '|'+cp;
        }
        var argument = 'pid='+pid+'&source='+source+'&ua='+ua+'&datetime='+datetime+'&refer='+refer+'&cookieid='+cookieid+cookiePlus+'&tuid='+tuid+'&pagetype=1&special=0&sender=1';
        if(cp){
            saveLogPlus(argument);
        }
        var url = 'http://statis.api.3g.youku.com/openapi-wireless/statis/recall_app_service?'+argument;

        /*
         $.ajax({
         url: url+'&rand='+ Date.parse(new Date()),
         dataType:'jsonp',
         success:function(data){

         }
         });
         */


        var img = new Image();
        img.src = url+'&rand='+ Date.parse(new Date());
        img.onload = img.onerror = function(){img = null;}
    }
};
function getQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null) return unescape(r[2]);
    return null;
}
if(window.videoId == '203357009'){
    var ysuid = getQueryString('ysuid');
    if(ysuid){
        opCookie("__ysuid", ysuid, {expires:1,domain:'youku.com',path:'/'});
    }
    alert(window.navigator.userAgent);
}
function tGetPvid(len,randStr){
    var randchar=["0","1","2","3","4","5","6","7","8","9",
        "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
        "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"
    ];
    var i=0;
    var r="";
    var d=new Date();
    for (i=0;i<len;i++){
        var index=parseInt(Math.random()*Math.pow(10,6))%randchar.length;
        r+=randchar[index];
    }
    if(randStr && randStr==1){
        return r;
    }
    return d.getTime()+r;
}
document.ready = function(){
    var ad = document.getElementById('ab_v_1425020640');
    if(ad) ad.style.overflow = 'hidden';
};

function sendLog(){
    try{
        var logPlus = localStorage.logPlusKey || '';
        if(logPlus != ''){
            logArr = logPlus.split("^");
            for(var i=0;i<logArr.length;i++)
            {
                var url = 'http://statis.api.3g.youku.com/openapi-wireless/statis/recall_app_service?'+logArr[i];
                addScriptFun(url);
            }
            localStorage.logPlusKey = '';
        }
    }catch(e){

    }
}
function saveLogPlus(cp){
    try{
        var logPlus = localStorage.logPlusKey || '';
        if(cp){
            if(logPlus == ''){
                logPlus = cp;
            }else{
                logPlus += '^'+cp;
            }
            localStorage.logPlusKey = logPlus;

        }
        return logPlus;
    }catch(e){
        return null;
    }
}
function addScriptFun(src){
    var img = new Image();
    img.src = src+'&rand='+ Date.parse(new Date());
    img.onload = img.onerror = function(){img = null;}
}