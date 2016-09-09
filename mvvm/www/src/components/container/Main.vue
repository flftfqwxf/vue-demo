<template>
    <div class="page-content-wrapper">
        <div class="page-content-outer">
            <div class="page-content-inner">
                <div class="page-content">
                        <router-view class="view" transition="fade" transition-mode="out-in"></router-view>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
    .page-content-wrapper {
        margin-left:20px;
        position: relative;
        float: left;
        width:960px;

    }
    .page-content-outer {
        right: 0;
        bottom: 0;
        left: 0;
    }
    .page-content-inner {
        width: 100%;
        height: 100%;
        overflow: auto;
    }
    .page-content {

        width: 100%;
        display: inline-block;
    }
    .fade-transition {
        transition: opacity .3s ease;
    }
    .fade-enter, .fade-leave {
        opacity: 0;
    }
</style>
<script type="text/ecmascript-6">
//    import {loadBreadCrumb} from '../../vuex/actions'

    export default {
        components: {
        },
        vuex: {
            getters: {
//                breadcrumbInfo: ({breadcrumb})=> {
////                    console.log(breadcrumb.breadcrumbInfo.currentMenu)
//                    return breadcrumb.breadcrumbInfo
//                }
            },
            actions:{
//                loadBreadCrumb
            }
        },
        ready: function () {
//            console.log(this.$route.fullPath)
//            this.loadBreadCrumb( this.$route.fullPath)
        }
    }
</script>