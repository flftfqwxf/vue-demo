<template>
    <div class="page-wrapper">
        <silder>
        </silder>
        <div class="page-content-wrapper">
            <div class="page-title clearfix">
                <div class="pull-left">
                    <button type="button" class="btn btn-info btn-xs" onclick="$('body').toggleClass('sidebar-mini');"><i class="gm-icon gm-menu"></i></button>
                    <h2>
                        分销商管理中心 - 成都青旅
                        <small>
                            <a href="#"><i class="gm-icon gm-switch"></i>供应商管理中心</a>
                        </small>
                    </h2>
                </div>
                <ul class="pull-right login-state">
                    <li class="common-notice">
                        <a href="#">
                            <i class="gm-icon gm-notice"></i>
                            <span class="label label-warning">8</span>
                        </a>
                    </li>
                    <li class="dropdown">
                        <div id="drop1" href="#" class="dropdown-toggle" data-toggle="dropdown">
                            <i class="gm-icon gm-user"></i>
                            183****1324
                            <i class="gm-icon gm-arrow"></i>
                        </div>
                        <ul class="dropdown-menu" aria-labelledby="drop1">
                            <li><a href="#"><i class="gm-icon gm-supplier"></i>供应商中心</a></li>
                            <li><a href="#"><i class="gm-icon gm-distributor"></i>分销商中心</a></li>
                            <li><a href="#"><i class="gm-icon gm-modify-pwd"></i>修改密码</a></li>
                            <li role="separator" class="divider"></li>
                            <li><a href="#"><i class="gm-icon gm-logout"></i>退出登录</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="page-content-outer">
                <div class="page-content-inner">
                    <div class="page-content">
                        <div class="sub-title">
                            <h2>当前模块</h2>
                            <ol class="breadcrumb">
                                <li><a href="#">首页</a></li>
                                <li><a href="#">供应商中心</a></li>
                                <li class="active">当前模块</li>
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
                        <div class="page-main" id="manApp">
                            <router-view class="view" transition="test" transition-mode="out-in" keep-alive></router-view>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Silder from './components/Silder'
    export default {
        components: {
            Silder
        }
    }
</script>