<template>
    <div class="login-container">
        <div class="item">
            <h4>登录
            </h4>
            <div class="item-main">
                <validator name="validation1">
                    <form class="form-horizontal" id="formId" novalidate>
                        <div class="form-group-dashed">
                            <div class="form-group  has-feedback-left">
                                <input type="text" v-model="mobile" id="mobile" initial="off" placeholder="请输入手机号" class="form-control input-lg"
                                       v-validate:mobile="['required']">
                                <span class="fa fa-user form-control-feedback"></span>
                            </div>
                            <div class="form-group  has-feedback-left">
                                <input type="password" v-model="password" id="password" initial="off" placeholder="请输入密码" class="form-control input-lg"
                                       v-validate:password="['required']">
                                <span class="fa fa-lock form-control-feedback"></span>
                            </div>
                            <div class="form-group text-center">
                                <button class="btn btn-info loginBtn" @click.prevent="validateLogin" type="submit">登录</button>
                            </div>
                        </div>
                        <div class="errors">
                            <div v-if="$validation1.mobile.required" class="alert alert-danger alert-dismissible" role="alert">
                                <i class="fa fa-times-circle"></i>
                                请输入手机号
                            </div>
                            <div v-if="$validation1.password.required" class="alert alert-danger alert-dismissible" role="alert">
                                <i class="fa fa-times-circle"></i>
                                请输入密码
                            </div>
                            <div v-if="loginError && !$validation1.mobile.required && !$validation1.password.required"
                                 class="alert alert-danger alert-dismissible" role="alert">
                                <i class="fa fa-times-circle"></i>
                                {{loginError}}
                            </div>
                        </div>
                    </form>
                </validator>
            </div>
        </div>
    </div>
</template>
<style src="./css/style.css" scoped></style>
<script>
    //    import Validator from 'vue-validator';
    import {setToken} from '../../checkLogin'
    import {login} from '../../vuex/actions'
    export default {
        vuex: {
            actions: {
                login
            }
        },
        data(){
            return {
                mobile: null,
                password: null,
                loginError: null
            }
        },
        methods: {
            validateLogin: function () {
                var self = this
                this.$validate(true, function (e) {
                    if (self.$validation1.valid) {
                        self.login(self.mobile, self.password, self)
                    }
                })
//                console.log(this.$validation1)
            }
        }

//        components:{
//            Validator
//        }
    }
</script>
