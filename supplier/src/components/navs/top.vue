<template>
    <div class="page-title clearfix" id="page-title-viewport">
        <div class="pull-left">
            <button type="button" class="btn btn-default" id="nav-button"><i class="gm-icon gm-menu"></i></button>
            <h2>
                供应商管理中心 - {{breadcrumbInfo.supplierName}}
                {{ b | capitalize }}
                <small>
                    <template v-if="breadcrumbInfo.distributorInfo && breadcrumbInfo.distributorInfo!=''">
                        <i class="fa fa-retweet"></i><a href="{{WEB_DISTRIBUTOR }}">分销商管理中心</a>
                    </template>
                    <template v-if="breadcrumbInfo.supplierStaff && breadcrumbInfo.supplierStaff!='' && !breadcrumbInfo.supplierStaff.admin">
                        <i class="gm-icon gm-switch"></i><a title="您已经是供应商员工，不能成为分销商">分销商管理中心</a>
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
                    {{breadcrumbInfo.userInfo && breadcrumbInfo.userInfo.phone}}
                    <i class="fa fa-angle-down"></i>
                </div>
                <ul class="dropdown-menu">
                    <li><a href="{{WEB_SUPPLIER }}"><i class="gm-icon gm-supplier"></i>供应商中心</a></li>
                    <template v-if="breadcrumbInfo.distributorInfo && breadcrumbInfo.distributorInfo != ''">
                        <li><a href="{{WEB_DISTRIBUTOR }}"><i class="gm-icon gm-distributor"></i>分销商中心</a></li>
                    </template>
                    <template v-if="breadcrumbInfo.supplierStaff && breadcrumbInfo.supplierStaff!='' && !breadcrumbInfo.supplierStaff.admin">
                        <li><a style="color:#e6e6e6 !important;" title="您已经是供应商员工，不能成为分销商"><i class="gm-icon gm-distributor"></i>分销商中心</a></li>
                    </template>
                    <template>
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
    import {loadBreadCrumb} from "../../vuex/actions"
    export default{
        vuex: {
            getters: {
                breadcrumbInfo: ({breadcrumb})=>{
                    return breadcrumb.breadcrumbInfo
                }
            },
            actions: {
                loadBreadCrumb
            }
        },
        created: function () {
//            this.loadBreadCrumb()
        },
        computed: {
            b: {
//                get: ()=>{
//                    console.log(444,this)
//                    return Math.random()
//                    },
                get:  function () {
                  //  return this.tt + Math.random()
                },
                set: function (newValue) {
                  //  this.tt=newValue
                }
            }
        }
    }
</script>