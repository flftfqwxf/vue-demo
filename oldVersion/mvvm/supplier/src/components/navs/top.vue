<template>
    <div class="page-title clearfix" id="page-title-viewport">
        <div class="pull-left">
            <button type="button" class="btn btn-default" id="nav-button"><i class="gm-icon gm-menu"></i></button>
            <h2>
                供应商管理中心 - {{userInfo.supplier && userInfo.supplier.name}}
                <small>
                    <template v-if="userInfo.distributor">
                        <i class="fa fa-retweet"></i><a href="{{WEB_DISTRIBUTOR }}">分销商管理中心</a>
                    </template>
                    <template v-else>
                        <i class="gm-icon gm-switch"></i><a href="{{WEB_WWW}}/register-detail">分销商管理中心</a>
                    </template>
                </small>
            </h2>
        </div>
        <ul class="pull-right login-state">
            <li class="dropdown" data-toggle="mouseenter">
                <div href="#" class="dropdown-toggle">
                    <i class="gm-icon gm-user"></i>
                    {{phone}}
                    <i class="fa fa-angle-down"></i>
                </div>
                <ul class="dropdown-menu">
                    <li><a href="{{WEB_SUPPLIER }}"><i class="gm-icon gm-supplier"></i>供应商中心</a></li>
                    <template v-if="userInfo.distributor">
                        <li><a href="{{WEB_DISTRIBUTOR }}"><i class="gm-icon gm-distributor"></i>分销商中心</a></li>
                    </template>
                    <template v-else>
                        <li><a href="{{WEB_WWW }}/register-detail"><i class="gm-icon gm-distributor"></i>申请分销商</a></li>
                    </template>
                    <li><a href="{{WEB_WWW }}/user/password"><i class="gm-icon gm-modify-pwd"></i>修改密码</a></li>
                    <li role="separator" class="divider"></li>
                    <li><a href="/logout"><i class="gm-icon gm-logout"></i>退出登录</a></li>
                </ul>
            </li>
        </ul>
    </div>
</template>
<script type="text/ecmascript-6">
    import {loadUserInfo} from "../../vuex/actions"
    export default{
        vuex: {
            getters: {
                userInfo: ({top})=> {
                    return top.userInfo
                }
            },
            actions: {
                loadUserInfo
            }
        },
        data(){
            return {
                WEB_DISTRIBUTOR: WEB_DISTRIBUTOR,
                WEB_SUPPLIER: WEB_SUPPLIER,
                WEB_WWW: WEB_WWW
            }
        },
        created: function () {
            this.loadUserInfo()
        },
        computed: {
            phone: {
                get: function () {
//                    console.log('dddd',userInfo)
                    let userInfo = this.userInfo.user;
                    if (userInfo && userInfo.phone) {
                        let replacestr = userInfo.phone.substring(3, 7)
                        return userInfo.phone.replace(replacestr, '****')
                    }
                    return '***********'
                }
            }
        }
    }
</script>