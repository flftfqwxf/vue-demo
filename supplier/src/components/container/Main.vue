<template>
    <div class="page-content-wrapper">
        <top></top>
        <div class="page-content-outer">
            <div class="page-content-inner">
                <div class="page-content">
                    <breadcrumb :current-menu="currentMenu"></breadcrumb>
                    <div class="page-main" id="manApp">
                        <router-view class="view" transition="test" transition-mode="out-in" keep-alive></router-view>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
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
                currentMenu: ({breadcrumb})=> {
//                    console.log(breadcrumb.breadcrumbInfo.currentMenu)
                    return breadcrumb.breadcrumbInfo.currentMenu
                }
            },
            actions:{
                loadBreadCrumb
            }
        },
        ready: function () {
            console.log(this.$route.fullPath)
            this.loadBreadCrumb( this.$route.fullPath)
        }
    }
</script>