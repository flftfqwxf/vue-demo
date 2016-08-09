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
                                                        <div class="col-sm-6">
                                                            <qnupload></qnupload>
                                                        </div>
                                                    </div>
                                                </div>





                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--table-->
                            <!--table end-->
                            <!--table 空列表-->
                            <!--table end-->
                            <!-- form step start-->
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
                showModal: false,
                show:false,
                type:"datetime", //date datetime
                value:"2015-12-11",
                begin:"2015-12-20",
                end:"2015-12-25",
                x:0,
                y:0,
                range:false,//是否多选
            }
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
