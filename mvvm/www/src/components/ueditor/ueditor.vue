<template>
    <div id="container" style="width: 100%">
    </div>
</template>
<style>
</style>
<script>
    require('./ueditor-1.4.3.3/dist/utf8-php/ueditor.config')


    export default{
        data(){
            return {
                msg: 'hello vue'
            }
        },
        props: {
            options: {
                type: Object,
                deep: true,
                require: true
            }
        },
        ready(){
//            window.UEDITOR_CONFIG.token = this.uptoken
            window.UEDITOR_CONFIG = Object.assign({}, window.UEDITOR_CONFIG, this.options);
            require('./ueditor-1.4.3.3/dist/utf8-php/ueditor.all')
            console.log('ueditor:',window.UEDITOR_CONFIG.uptoken)
            var ue = UE.getEditor('container');
            ue.setOpt('uptoken',window.UEDITOR_CONFIG.uptoken)
        },
//        computed: {
//            curOptions: function () {
//                return Object.assign({}, window.UEDITOR_CONFIG, this.options);
//            }
//        },
        components: {}
    }
</script>
