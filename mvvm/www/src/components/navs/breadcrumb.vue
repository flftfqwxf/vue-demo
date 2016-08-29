<template>
    <div class="sub-title">
        <h2 v-if="currentMenu">
            {{breadcrumbInfo && breadcrumbInfo.currentChildMenu ? breadcrumbInfo.currentChildMenu : breadcrumbInfo.currentMenu}}
        </h2>
        <h2 v-else>
            供应商中心
        </h2>
        <ol class="breadcrumb">
            <li><a href="{{WEB_WWW }}">首页</a></li>
            <li><a href="{{WEB_SUPPLIER }}">供应商中心</a></li>
            <template v-if="breadcrumbInfo && breadcrumbInfo.currentMenu && breadcrumbInfo.currentChildMenu">
                <li>{{breadcrumbInfo.currentMenu }}</li>
                <li class="active">{{breadcrumbInfo.currentChildMenu }}</li>
            </template>
            <template v-else>
                <li class="active">{{breadcrumbInfo ? breadcrumbInfo.currentMenu :'我的首页' }}</li>
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
        props:['breadcrumbInfo'],
        data(){
            return {
                WEB_WWW:WEB_WWW,
                WEB_SUPPLIER:WEB_SUPPLIER
            }
        },
        methods:{

        }
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