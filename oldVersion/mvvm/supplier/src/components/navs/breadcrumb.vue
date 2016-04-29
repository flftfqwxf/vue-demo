<template>
    <div class="sub-title">
        <h2 v-if="currentMenu">
            {{currentChildMenu ?currentChildMenu : currentMenu}}
        </h2>
        <h2 v-else>
            供应商中心
        </h2>
        <ol class="breadcrumb">
            <li><a href="{{WEB_WWW }}">首页</a></li>
            <li><a href="{{WEB_SUPPLIER }}">供应商中心</a></li>
            <template v-if="currentMenu && currentChildMenu">
                <li>{{currentMenu }}</li>
                <li class="active">{{currentChildMenu }}</li>
            </template>
            <template v-else>
                <li class="active">{{currentMenu }}</li>
            </template>
        </ol>
        <div class="page-tool">
            <button class="btn btn-default" type="button" onclick="history.go(-1);">
                <i class="gm-icon gm-back"></i>返回
            </button>
            <button class="btn btn-default" type="button" onclick="location.reload();">
                <i class="gm-icon gm-refresh"></i>
                刷新
            </button>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
        props:['currentMenu']
//        vuex:{
//            getters:{
//                currentMenu:({breadcrumb})=>breadcrumb.breadcrumbInfo.currentMenu
//            }
//
//        }
//        data(){
//            currentMenu
//        }
    }
</script>