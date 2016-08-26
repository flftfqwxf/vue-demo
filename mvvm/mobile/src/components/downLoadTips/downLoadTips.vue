<template>
    <div class="openApp" v-show="isShow">
        <i class="wl-iconfont wl-close downClose" @click="close"></i>
        <div class="downLogo">
        </div>
        <div class="downSummary">
            <p class="downName">物联网安全</p>
            <p class="downDesc">聚合物联网专业人士</p>
        </div>
        <a @click="openApp" class="btn btn-default btn-sm downBtn">立即打开</a>
    </div>
</template>
<script type="text/ecmascript-6">
    const Scheme = "ironhide://article?source_id=26";
    const baseLink = "ironhide://article?source_id=26";
    const options = {
        source_id: 26
    }
    var openApp = require('../openApp/openApp')
    export default{
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
                location.href=Scheme;
//                openApp(Scheme, baseLink,options);
            }
        }
    }
</script>