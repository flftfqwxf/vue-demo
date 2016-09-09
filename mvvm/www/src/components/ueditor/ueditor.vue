<template>
    <div>
        <div :id="id" :style="{'width': width,'height':height}">
        </div>
    </div>
</template>
<style scoped lang="sass">
    .image-package{ margin: 0 auto 20px; text-align: center; }
    .image-package img{ max-width: 100%; width: auto \9; height: auto; vertical-align: middle; border: 0; -ms-interpolation-mode: bicubic; }
    .image-package .image-caption{ min-width: 20%; min-height: 22px; display: inline-block; padding: 10px; margin: 0 auto; border-bottom: 1px solid #d9d9d9; font-size: 13px; color: #999; font-style: italic; line-height: 1.7; }
</style>
<script>



    export default{
        data(){
            return {
                editor: null
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
            id: {
                type: String,
                require: true,
                default: 'container'
            },
            value:{
                type:String,
                default:''
            }
        },
        ready(){

//                window.UEDITOR_HOME_URL='/src/components/ueditor/ueditor-1.4.3.3/dist/utf8-php/'
//            window.UEDITOR_CONFIG.token = this.uptoken
            //
//            window.UEDITOR_CONFIG = Object.assign({}, window.UEDITOR_CONFIG, this.options);
            require('./ueditor-1.4.3.3/dist/utf8-php/ueditor.config');
            require('./ueditor-1.4.3.3/dist/utf8-php/ueditor.all')
            require('./ueditor-1.4.3.3/dist/utf8-php/lang/zh-cn/zh-cn');

//            console.log('ueditor:',window.UEDITOR_CONFIG.uptoken)
            var ue = UE.getEditor(this.id, this.options);
            var _this = this;

            ue.ready(function () {
//                console.log('isReady')
                setTimeout(()=>{
                    ue.setContent(_this.value);
                },200)

                ue.addListener('blur', function () {
                    _this.$dispatch('ueditor-blur', ue);
                });
            })
            this.ueditor = ue;
//            ue.setOpt('uptoken',window.UEDITOR_CONFIG.uptoken)
        },
        beforeDestroy(){
            this.ueditor.destroy()
        },
        methods: {
            getContent(){
                return this.ueditor.getContent();
            },
            getEditor(){
                return this.ueditor;
            }
        },
//        computed: {
//            curOptions: function () {
//                return Object.assign({}, window.UEDITOR_CONFIG, this.options);
//            }
//        },
        components: {}
    }
</script>
