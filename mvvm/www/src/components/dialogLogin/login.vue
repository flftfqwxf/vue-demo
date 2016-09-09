<template>
    <div class="login-container">
        <modal :show.sync="showModal" :backdrop="false">
            <login slot="modal-body"></login>
        </modal>

    </div>
</template>
<style lang="sass">
    .loginWrap {
        height: 100%;
    body {
        color: #FFF;
        background-size: cover;
        background: #FF9B16;
        height: 100%;
        overflow-y: hidden;
        background: url("login-bg.png") no-repeat center;
    }
    .login-container{
        width:100%;
        height:100%;
    }
    .footer{
        position: fixed;
        bottom:0;
    }
    .modal-content{
        border: transparent !important; background: transparent!important; -webkit-box-shadow: none!important; box-shadow: none!important;
    }
    .modal-header, .modal-footer{ display: none; }
    }
</style>
<script>
    //    import Validator from 'vue-validator';
    import {setToken} from '../../checkLogin'
    import modal from 'strap/Modal.vue'

    import login from '../../components/login/login.vue'
    export default {
        data(){
            return {
                username: null,
                password: null,
                showModal: false
            }
        },
        methods: {
            validateLogin: function () {
                var self = this
                this.$validate(true, function (e) {
                    if (self.$validation1.valid) {
                        self.$http.get('/api/login').then(function (res) {
                            if (res.ok && res.data) {
                                if (res.data.access_token) {
                                    setToken(res.data.access_token);
                                    location.reload();
                                } else {
                                    alert(res.data.message)
                                }
                            }
                        }, function (res) {
                            alert(res)
                        })
                    }
                })
//                console.log(this.$validation1)
            }
        },
        components: {
            modal,
            login
        },
        ready(){
            var _this=this;
            $('html').addClass('loginWrap')
            setTimeout(function () {
                _this.showModal = true
            },500)
        },

        beforeDestroy(){
            $('html').removeClass('loginWrap')
        }
    }
</script>
