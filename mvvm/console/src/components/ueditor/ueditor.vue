<template>
    <div :id="id" :style="{'width': width,'height':height}">
    </div>
</template>
<style>
</style>
<script>
    require('./ueditor-1.4.3.3/dist/utf8-php/ueditor.config');

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
            },
            height: {
                default: '100%'
            },
            width: {
                default: '100%'
            },
            id:{
                type:String,
                require:true,
                default:'container'
            }
        },
        ready(){
//            window.UEDITOR_CONFIG.token = this.uptoken
            //
//            window.UEDITOR_CONFIG = Object.assign({}, window.UEDITOR_CONFIG, this.options);

            require('./ueditor-1.4.3.3/dist/utf8-php/ueditor.all')
//            console.log('ueditor:',window.UEDITOR_CONFIG.uptoken)
            var ue = UE.getEditor(this.id,this.options);
//            ue.setOpt('uptoken',window.UEDITOR_CONFIG.uptoken)
        },
//        computed: {
//            curOptions: function () {
//                return Object.assign({}, window.UEDITOR_CONFIG, this.options);
//            }
//        },
        components: {}
    }
</script>
