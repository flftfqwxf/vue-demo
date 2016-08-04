<template>
    <div class="page-content-wrapper">
        <top></top>
        <div class="page-content-outer">
            <div class="page-content-inner">
                <div class="page-content">
                    <breadcrumb :breadcrumb-info="breadcrumbInfo"></breadcrumb>
                        <router-view class="view" transition="fade" transition-mode="out-in" keep-alive></router-view>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
    .fade-transition {
        transition: opacity .3s ease;
    }
    .fade-enter, .fade-leave {
        opacity: 0;
    }
</style>
<script type="text/ecmascript-6">
    import Breadcrumb from '../../components/navs/breadcrumb.vue'
    import {loadBreadCrumb} from '../../vuex/actions'
    import Top from '../../components/navs/top.vue'
    export default {
        components: {
            Top,
            Breadcrumb
        },
        vuex: {
            getters: {
                breadcrumbInfo: ({breadcrumb})=> {
//                    console.log(breadcrumb.breadcrumbInfo.currentMenu)
                    return breadcrumb.breadcrumbInfo
                }
            },
            actions:{
                loadBreadCrumb
            }
        },
        ready: function () {
//            console.log(this.$route.fullPath)
            this.loadBreadCrumb( this.$route.fullPath)
        }
    }
</script>