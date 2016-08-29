<template>
    <div class="openApp" v-show="isShow">
        <i class="wl-iconfont wl-close downClose" @click="close"></i>
        <div class="downLogo">
        </div>
        <div class="downSummary">
            <p class="downName">物联网安全</p>
            <p class="downDesc">聚合物联网专业人士</p>
        </div>
        <button href="javascript:;" @click.stop.prevent="openApp" class="btn btn-default btn-sm downBtn">立即打开</button>
    </div>
</template>
<script type="text/ecmascript-6">
    const schemeLink = "ironhide://article?source_id=26";
    const baseLink = "ironhide://article?source_id=26";
    //    const intentLink = "intent://article/#Intent;scheme=ironhide;package=com.istuary.ironhide;end";
    const intentLink = "intent://play?vid=XMTY5OTEzODI4MA==&ua=other&source=mplaypage2&cookieid=1472114969039HpoihU|l4Xifn#Intent;scheme=youku;package=com.youku.phone;end;"

    const iOSdownLoadLink = "http://www.wulianaq.com";
    const androidDownLoadLink = "http://www.wulianaq.com"

    var openApp = require('../openApp/openApp')
    export default{
        props:['schemeLink','baseLink','intentLink','iOSdownLoadLink','androidDownLoadLink'],
        data(){
            return {
                isShow: true
            }
        },
        methods: {
            close(){
                this.isShow = false;
            },
            openApp(){
//                location.href=Scheme;
                openApp(schemeLink, baseLink, intentLink, iOSdownLoadLink, androidDownLoadLink);
            }
        }
    }
</script>