<template>
    <div class="page-content-outer">
        <div class="page-content-inner">
            <div class="page-content">
                <div class="page-main">
                    <div class="row">
                        <div class="row">
                            <div class="col-md-10">
                                <div class="item">
                                    <h4> 编辑器组件样式
                                    </h4>
                                    <div class="item-main">
                                        <form class="form-horizontal" id="formId">
                                            <div class="form-group-dashed">
                                                <div class="form-group">
                                                    <label class="col-sm-2 control-label">上传 input</label>
                                                    <div class="col-sm-10">
                                                        <ueditor :height="height" v-if="isInit" :file-names.sync="fileNames" :options="options"
                                                                 upload-container="qnupload-container"></ueditor>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--table-->
                        <!-- form step end-->
                    </div>
                </div>
            </div>
            <div class="page-footer">
                <ul class="pull-left">
                    <li class="weixin linkGmQrcode">港马微信</li>
                    <li class="hot_phone linkGmService">港马微博</li>
                    <li>客服热线：400-028-7828</li>
                </ul>
                <span class="pull-right">Copyright ©&nbsp;2013-2015 gmmtour.com</span>
            </div>
        </div>
    </div>
</template>
<style>
    body{
        background-color: #f00;
    }
</style>
<script>
    require('jquery')
    import ueditor from '../ueditor/ueditor.vue'
    export default{
        data(){
            return {
                isInit: false,
                options: {
                    uptoken: '',
                    enableContextMenu:false
                    //工具栏上的所有的功能按钮和下拉框，可以在new编辑器的实例时选择自己需要的重新定义
                    , toolbars: [[
                        // 'fullscreen', 'source', '|', 'undo', 'redo', '|',
                         'bold', 'italic', 'underline',  'strikethrough',  'blockquote','hstyle', 'insertorderedlist', 'insertunorderedlist',
                         'link', 'horizontal','|',
                        'insertimage', 'removeFormat'
                    ]]
                }, height: '400px'
            }
        },
        components: {
            ueditor
        },
        ready: function () {
            var _this = this;
            this.$http.get('http://192.168.28.218/api/mobile/v1/settings/uptoken').then(function (res) {
                if (res.ok && res.data) {
                    _this.options.uptoken = res.data.data.uptoken;
                    console.log(_this.options.uptoken)
                    _this.isInit = true;
                }
            }, function (res) {
                alert('请求错误')
            })
        },
        methods: {}
    }
</script>
