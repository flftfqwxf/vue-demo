<template>
    <div class="page-sidebar">
        <ul class="nav" id="nav">
            <template v-for="(index,nav) in navList">
                <template v-if="nav.children.length==0">
                    <li v-link="{path:nav.href,activeClass: 'open' ,exact: true }" >
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
                                <span class="label label-info pull-right orderTotal" title="网站订单总数" data-toggle="tooltip" data-placement="right"
                                      style="right:28px;top:10px;"></span>
                            </template>
                            <span class="fa fa-angle-down"></span>
                        </a>
                        <ul class="collapse {{navCurrent ? 'in' : ''}}" id="nav{{nav.id}}" aria-expanded="{{navCurrent ? 'true' : 'false'}}">
                            <li v-for="subNav in nav.children" v-link="{path:subNav.href,activeClass: 'open' ,exact: true }">
                                <a href="{{subNav.href}}" >{{subNav.name}}
                                    <template v-if="subNav.id==75">
                                        <span class="label label-info pull-right" title="今日同行订单数" data-toggle="tooltip" data-placement="right"
                                              id="dtodayCount"></span>
                                    </template>
                                    <template v-if="subNav.id==76">
                                        <span class="label label-info pull-right" title="今日网站订单数" data-toggle="tooltip" data-placement="right"
                                              id="stodayCount"></span>
                                    </template>
                                </a></li>
                        </ul>
                    </li>
                </template>
            </template>
            <div class="loginOut_wrap" @click="loginOut">退出帐号</div>
        </ul>
    </div>
</template>
<style lang="sass">
    @import "Silder.scss";
</style>
<script type="text/ecmascript-6">
    require('jquery')
    import {loadNavList, loadBreadCrumb} from "../../vuex/actions"
    import {clearToken} from '../../checkLogin'

    $(function () {
        var _sidebar_mini_class = 'sidebar-mini';
        localStorage.__navStatus && $('html').addClass(_sidebar_mini_class);
        if (localStorage.__navStatus) {
            $('#nav-button').addClass('btn-info');
        }
        $('#nav-button').on('click', function () {
            $('html').toggleClass(_sidebar_mini_class);
            $(this).toggleClass('btn-info');
            localStorage.__navStatus = $('html').hasClass(_sidebar_mini_class) ? 1 : '';
        });
    })

    export default {
//        vuex: {
//            getters: {
//                navList: ({nav})=>nav.navList,
//            },
//            actions: {
//                loadNavList,
//                loadBreadCrumb
//            }
//        },
        data(){
            return {
                navCurrent: false,
            }
        },
        props: {
            navList: {
                default:function () {
                    return [
                        {
                            "children": [],
                            "degree": 1,
                            "href": "\/",
                            "iconClass": "gm-icon gm-home",
                            "id": 73,
                            "name": "文章"
                        }


                    ]
                }
            }
        },
        created: function () {
        },
        methods: {
            loginOut(){
                clearToken();
                location.reload()
            }
        }
    }
</script>