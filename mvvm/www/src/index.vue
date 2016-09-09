<template>
    <top></top>
    <div class="page-wrapper">
        <silder>
        </silder>
        <main></main>
    </div>
    <Foot></Foot>
    <alert-tips :is-alert.sync="alertTipsData.isAlert" :type="alertTipsData.alertType" :placement="alertTipsData.top" :duration="alertTipsData.duration"
                :tips-msg="alertTipsData.tipsMsg"></alert-tips>
</template>
<script type="text/ecmascript-6">
    import Silder from './components/navs/Silder'
    import Main from './components/container/Main.vue'
    import store from './vuex/store'
    import Top from './components/navs/top.vue'
    import Foot from './components/footer/footer.vue'
    import alertTips from './components/alertTips/alertTips.vue'
    import {setAlertTips} from './vuex/actions'
    import checkUrl from './checkUrl'
    export default {
        store: store,
        vuex: {
            actions: {
                setAlertTips
            },
            getters: {
                is_expert: ({user})=> {
                    return user.userInfo.is_expert
                }
            }
        },
        watch: {
            'is_expert': function (val, oldVal) {
                var path=this.$route.path;
                console.log(this.$route.path)
                if (val === 0) {
                    checkUrl.map((item)=>{
                        if (path.indexOf(item)!==-1) {
                            this.$route.router.go('/')
                            return false;
                        }
                    })

                }
            }
        },
        data(){
            return {
                alertTipsData: {
                    isAlert: false,
                    alertType: 'success',
                    placement: 'top',
                    duration: 3000,
                    tipsMsg: ''
                }
            }
        },
//        watch: {
//            'is_expert': function (val, oldVal) {
//                console.log(val, oldVal)
//                if (val === 0) {
//                    this.$route.router.go('/')
//                }
//            }
//        },
        components: {
            Top,
            Silder,
            Main,
            store,
            Foot,
            alertTips
        },
        events: {
            openTips(opts){
                opts.isAlert = true;
                Object.assign(this.alertTipsData, opts)
            }
        }
    }
</script>