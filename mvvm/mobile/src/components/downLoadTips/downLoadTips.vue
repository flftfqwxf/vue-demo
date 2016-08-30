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


    var openApp = require('../openApp/openApp')
    export default{
        props:['schemeLink','baseLink','intentLink','iosDownLoadLink','androidDownLoadLink'],
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
                openApp(this.schemeLink, this.baseLink, this.intentLink, this.iosDownLoadLink, this.androidDownLoadLink);
            }
        }
    }
</script>