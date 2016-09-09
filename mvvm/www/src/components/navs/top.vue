<template>
    <div class="page-title clearfix" id="page-title-viewport">
        <div class="header_wrap">
            <div class="pull-left">
                <i class="wl-web-iconfont wl-font-logo logo"></i>
                <h2>
                    专注物联网安全
                    <small>
                        <template v-if="userInfo.supplier">
                            <i class="fa fa-mobile"></i><a href="{{WEB_DISTRIBUTOR }}">手机版</a>
                        </template>
                        <template v-else>
                            <!--<i class="gm-icon gm-switch"></i><a href="{{WEB_WWW}}/register-detail">供应商管理中心</a>-->
                        </template>
                    </small>
                </h2>
            </div>
            <ul class="pull-right login-state" v-if="isLogin">
                <!--<div class="tooltip left" role="tooltip"> <div class="tooltip-arrow"></div> <div class="tooltip-inner">3</div> </div>-->
                <dropdown v-if="isInit && userName" :text="userName">
                    <li><a @click="loginOut">退出</a></li>
                </dropdown>


            </ul>

        </div>
    </div>
</template>
<style  lang="sass">
    @import "~wwwVariablesScss";
    @import "top.scss";
</style>

<script type="text/ecmascript-6">
    import {loadUserInfo} from "../../vuex/actions"
    import {clearToken,checkLogin} from '../../checkLogin'
    import dropdown from 'strap/Dropdown.vue'
    export default{
        vuex: {
            getters: {
                userInfo: ({user})=> {
                    return user.userInfo
                }
            },
            actions: {
                loadUserInfo
            }
        },
        components: {
            dropdown
        },
        data(){
            return {
                isLogin:false,
                isInit:false,
            }
        },
        ready: function () {
            this.isLogin=checkLogin()
            if (this.isLogin) {
                this.loadUserInfo();
                this.isInit=true;
            }
        },
        computed:{
            userName:function () {
                return this.userInfo.user_name;
            }
        },
        methods: {
            open(){
                this.showNav = true;
            },
            loginOut(){
                clearToken();
                location.reload()
            }
        }

    }
</script>