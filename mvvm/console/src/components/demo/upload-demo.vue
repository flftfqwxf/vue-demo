<template>
    <div class="page-content-outer">
        <div class="page-content-inner">
            <div class="page-content">
                <div class="page-main">

                    <div class="row">
                        <div class="col-md-8">


                            <div class="row">
                                <div class="col-md-12">
                                    <div class="item">
                                        <h4> 上传组件样式
                                        </h4>
                                        <div class="item-main">
                                            <form class="form-horizontal" id="formId">
                                                <div class="form-group-dashed">
                                                    <div class="form-group">
                                                        <label class="col-sm-2 control-label">上传 vue组件</label>
                                                        <div class="col-sm-6">
                                                            <file-upload post-action="/post.method" put-action="/put.method"></file-upload>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="form-group-dashed">
                                                    <div class="form-group">
                                                        <label class="col-sm-2 control-label">上传 input</label>
                                                        <div class="col-sm-6">
                                                            <span class="btn btn-default btn-file">Browse <input type="file"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="form-group-dashed">
                                                    <div class="form-group">
                                                        <label class="col-sm-2 control-label">上传 input</label>
                                                        <div class="col-sm-10">
                                                            <qnupload v-if="isInit" :file-names.sync="fileNames" :options="options" upload-container="qnupload-container"></qnupload>
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
    import components from 'vue-strap'
    import FileUpload from '../upload/vue-upload-component'
    import qnupload from '../qiniu-upload/qnupload.vue'
    export default{
        data(){
            return {
                isInit:false,
                showModal: false,
                show:false,
                type:"datetime", //date datetime
                value:"2015-12-11",
                begin:"2015-12-20",
                end:"2015-12-25",
                x:0,
                y:0,
                range:false,//是否多选
                fileNames:[],
                options:{
                    uptoken:'7kSE98xxxk4hgFufkUgffx2vsVU1Pw0hTfZCOQP61S:l1VIeTDEE8Yd0tUYL7i-Vc1JgL0=:eyJzY29wZSI6Imlyb25oaWRlIiwiZGVhZGxpbmUiOjE0NzA5OTEwNjN9',
                    filters: {
                        max_file_size: '100mb',
                        prevent_duplicates: true,//不允许选取重复文件
                        // Specify what files to browse for
                        mime_types: [
//                        {title: "flv files", extensions: "flv"},// 限定flv后缀上传格式上传
//                        {title: "Video files", extensions: "flv,mpg,mpeg,avi,wmv,mov,asf,rm,rmvb,mkv,m4v,mp4"}, // 限定flv,mpg,mpeg,avi,wmv,mov,asf,rm,rmvb,mkv,m4v,mp4后缀格式上传
                            {title: "Image files", extensions: "jpg,gif,png"}, // 限定jpg,gif,png后缀上传
//                        {title: "Zip files", extensions: "zip"} // 限定zip后缀上传
                        ]
                    },
                }
            }
        },
        computed: {

        },
        ready:function () {
            var _this=this;
            this.$http.get('http://192.168.28.218/api/mobile/v1/settings/uptoken').then(function (res) {
                if (res.ok && res.data) {
                    _this.options.uptoken=res.data.data.uptoken;
                    console.log(_this.options.uptoken);
                    _this.isInit=true;
                }
            }, function (res) {
                alert('请求错误')
            })
        },
        components: {
            'modal': components.modal,
            'alert':components.alert,
            FileUpload,
            calendar: require('../calendar/calendar.vue'),
            qnupload
        },
        methods:{
            showCalendar:function(e){
                e.stopPropagation();
                var that=this;
                that.show=true;
                that.x=e.target.offsetLeft;
                that.y=e.target.offsetTop+e.target.offsetHeight+8;
                var bindHide=function(e){
                    e.stopPropagation();
                    that.show=false;
                    document.removeEventListener('click',bindHide,false);
                };
                setTimeout(function(){
                    document.addEventListener('click',bindHide,false);
                },500);
            }
        }

    }
</script>
