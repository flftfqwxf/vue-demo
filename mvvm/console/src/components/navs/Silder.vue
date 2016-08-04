<template>
    <div class="page-sidebar">
        <a href="index.html" class="logo"></a>
        <ul class="nav" id="nav">
            <template v-for="(index,nav) in navList">
                <template v-if="nav.children.length==0">
                    <li v-link="{path:nav.href,activeClass: 'open' ,exact: true }" @click="changeUrl(nav.href)">
                        <a href="{{nav.href}}">
                            <i class="{{nav.iconClass}}"></i>
                            <span>{{nav.name}}</span>
                            <span v-if="nav.id===27" id="pendingStaffCount" class="label label-info" data-toggle="tooltip" data-placement="right"></span>
                            <span v-if="nav.id===23" id="expiredTourPlanCount" class="label label-info" data-toggle="tooltip" data-placement="right"></span>
                            <span v-if="nav.id===86" id="orderCount" class="label label-info" data-toggle="tooltip" data-placement="right"></span>
                        </a>
                    </li>
                </template>
                <template v-else>
                    <li>
                        <a href="#nav{{nav.id}}" data-toggle="collapse" data-parent="#nav" aria-expanded="{{navCurrent ? 'true' : 'false'}}">
                            <i class="{{nav.iconClass}}"></i>
                            <span>{{nav.name}}</span>
                                <template v-if="nav.id==28">
                                    <span class="label label-info pull-right orderTotal" title="网站订单总数" data-toggle="tooltip" data-placement="right" style="right:28px;top:10px;"></span>
                                </template>
                            <span class="fa fa-angle-down"></span>
                        </a>
                        <ul class="collapse {{navCurrent ? 'in' : ''}}" id="nav{{nav.id}}" aria-expanded="{{navCurrent ? 'true' : 'false'}}">
                            <li v-for="subNav in nav.children"  v-link="{path:subNav.href,activeClass: 'open' ,exact: true }">
                                <a href="{{subNav.href}}" @click="changeUrl(subNav.href)">{{subNav.name}}
                                    <template v-if="subNav.id==75">
                                            <span class="label label-info pull-right" title="今日同行订单数" data-toggle="tooltip" data-placement="right" id="dtodayCount"></span>
                                        </template>
                                        <template v-if="subNav.id==76">
                                            <span class="label label-info pull-right" title="今日网站订单数" data-toggle="tooltip" data-placement="right" id="stodayCount"></span>
                                        </template>
                            </a></li>
                        </ul>
                    </li>
                </template>
            </template>
        </ul>
    </div>
</template>
<script type="text/ecmascript-6">
    import {loadNavList, loadBreadCrumb} from "../../vuex/actions"
    export default {
        vuex: {
            getters: {
                navList: ({nav})=>nav.navList,
            },
            actions: {
                loadNavList,
                loadBreadCrumb
            }
        },
        data(){
            return {
                navCurrent:false
            }
        },
        created: function () {
            var _self = this;
            this.loadNavList()
        },
        methods: {
            changeBreadCrumb: function (url) {
                this.loadBreadCrumb(url)
            },
            changeParentNav: function (id) {

                if ('parentNav' + id === this.$route.name) {
                    return 'true'
                }
                return 'false'
            },
            location: function (url) {
                if (url!=='/mvvm/message') {
                  location.href = url

                }
            },
            changeUrl: function (url) {
                this.changeBreadCrumb(url);
                this.location(url)
            }
        }
    }
</script>