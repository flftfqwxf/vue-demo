<template>
    <div class="page-sidebar">
        <a href="index.html" class="logo"></a>
        <ul class="nav" id="nav">
            <li v-link="{path:nav.path,activeClass: 'open' ,exact: true }" v-for="(inde2x,nav) in navList" @click="changeBreadCrumb(nav.path)">
                <a href="{{nav.path}}">
                    <i class="gm-icon gm-peer-plan"></i>
                    <span>{{inde2x}}{{nav.navName}}</span>
                    <span class="label label-info pull-right" data-toggle="tooltip" data-placement="right" data-original-title="中文中文那种爱上空间等哈说肯定会阿卡还是啊">3</span>
                </a>
            </li>
        </ul>
    </div>
</template>
<script type="text/ecmascript-6">
    import {loadNavList,loadBreadCrumb} from "../../vuex/actions"
    export default {
        vuex: {
            getters: {
                navList:({nav})=>nav.navList
            },
            actions:{
                loadNavList,
                loadBreadCrumb
            }
        },
        created:function() {
            var _self=this;
            this.loadNavList()
        },
        methods:{
            changeBreadCrumb: function (url) {
                this.loadBreadCrumb(url)
            }
        }
    }
</script>