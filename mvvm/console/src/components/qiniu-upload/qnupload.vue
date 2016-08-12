<template>
    <div :id="uploadContainer">
        <!--:id="uploadContainer" id="qnupload-container"-->
        <div class="qnupload-container">
            <a class="btn btn-default btn-lg " id="pickfiles" href="#">
                <i class="glyphicon glyphicon-plus"></i>
                <span>选择文件</span>
            </a>
        </div>
        <div style="display:none" :class="uploadContainer" id="success" class="col-md-12" v-show="isSuccess">
            <div class="alert-success">
                队列全部文件处理完毕
            </div>
        </div>
        <div class="item-main">
            <table class="table table-striped table-hover text-left" v-show="isShow">
                <thead>
                <tr>
                    <th class="col-md-2">文件名</th>
                    <th class="col-md-2">大小</th>
                    <th class="col-md-7">进度</th>
                    <th class="col-md-1">操作</th>
                </tr>
                </thead>
                <tbody id="fsUploadProgress">
                <tr track-by="id" :class="{up_error:file.isError}" v-for="file of files">
                    <td class="progressName col-md-2" v-if="file.status!==5">{{file.name}}</td>
                    <td class="progressName col-md-2" v-if="file.status===5 && file.isImage">{{file.name}}
                        <div class="Wrapper">
                            <div class="imgWrapper">
                                <a class="linkWrapper" target="_blank" :href="file.url" title="查看原图">
                                    <img :src="file.url+imageView"></a>
                            </div>
                        </div>
                    </td>
                    <td class="progressName col-md-2" v-if="file.status===5 && !file.isImage">{{file.name}}
                        <div class="Wrapper">
                            <div class="imgWrapper">
                                <img src="images/default.png">
                            </div>
                        </div>
                    </td>
                    <td class="progressFileSize col-md-2">{{file.size}}</td>
                    <td class="col-md-7">
                        <div class="info" v-if="file.status!==5">
                            <div class="progress">
                                <div class="progress-bar progress-bar-info" role="progressbar" :style="{width:file.percent+'%'}"></div>
                            </div>
                            <div :class="{'status':true, 'text-left':true,'errTxt':file.isError }">{{file.statusText}}</div>
                        </div>
                        <!--上传完成时状态为5-->
                        <div class="info" v-if="file.status===5">
                            <div><span class="link_tit">链接:</span><br><a :href="file.url" target="_blank">{{file.url}}</a></div>
                            <span class="sr-only">{{file.size}}</span>
                        </div>
                    </td>
                    <td class="col-md-1">
                        <a href="javascript:;" class="up_delete" @click="deleteItem(file,up)" style="display: inline;">×</a>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div v-show="isManual">
            <button type="button" class="btn btn-default">手动上传</button>
            <button type="button" id="stopBtn">停止上传</button>
            <button type="button" @click="validateData"></button>
        </div>
    </div>
</template>
<style scoped lang="sass">
    .table{ margin-top: 20px;
    .up_error{ background: #fff7eb; }
    .errTxt{ color: #F00; }
    }
    .item-main{ padding: 0; }
    .Wrapper{
        /*width: 200px;*/
    }
    .up_delete{ font-size: 20px }
    .link_tit{ font-weight: 700; white-space: nowrap; }
    .linkWrapper{ width: 100px; float: left; }
    .imgWrapper{ width: 100px; float: left; }
    .imgWrapper img{ width: 100px; }
    .infoWrapper{ padding-left: 10px; float: left }
</style>
<script>
    function isEmpty(obj) {
        for (var name in obj) {
            return false;
        }
        return true;
    }
    ;
    //       require('./moxie.js');
    require('jquery')
    //    var loading=require('./images/loading.gif');
    //测试环境调用
    //引用 moxie.js或 plupload.full.min.js 需要在webpack中配置
    //    require("./moxie.js")
    //    require('./plupload.dev.js');
    //线上环境调用
    require('./plupload.full.min.js')
    //语言包
    require('./i18n/zh_CN.js')
    //    var FileProgress = require('./ui')
    require('./qiniu.js');
    var uploadContainer = document.querySelector('#qnupload-container .qnupload-container')
    module.exports = {
        data(){
            var _this = this;
            return {
//                uploadContainer:'qnupload-container',
                isShow: false,
                isSuccess: false,
                //图片预览尺寸
                imageView: '?imageView2/1/w/100/h/100',
                files: {},
                defaultOptions: {
                    runtimes: 'html5,flash,html4',    //上传模式,依次退化
                    browse_button: 'pickfiles',       //上传选择的点选按钮，**必需**
                    /*uptoken_func: function (file) {
                     console.log(file)
                     },*/
                    //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
                    /*uptoken_url: 'http://192.168.28.218/api/mobile/v1/settings/uptoken',*/
                    // Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
//                    uptoken: '7kSE98xxxk4hgFufkUgx2vsVU1Pw0hTfZCOQP61S:96yONwpqVitMwHG4aOeBPYwrsKY=:eyJzY29wZSI6Imlyb25oaWRlIiwiZGVhZGxpbmUiOjE0NzA5MTAxNjR9',
                    unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
                    // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
                    domain: 'http://o8eatr2zr.bkt.clouddn.com/',   //bucket 域名，下载资源时用到，**必需**
                    get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
                    container: uploadContainer,           //上传区域DOM ID，默认是browser_button的父元素，
                    max_file_size: '100mb',           //最大文件体积限制
                    flash_swf_url: './Moxie.swf',  //引入flash,相对路径
                    max_retries: 3,                   //上传失败最大重试次数
                    dragdrop: true,                   //开启可拖曳上传
                    drop_element: uploadContainer,    //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                    chunk_size: '0mb',                //分块上传时，每片的体积
                    auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                    // 可以使用该参数来限制上传文件的类型，大小等，该参数以对象的形式传入，它包括三个属性：
                    /* filters: {
                     max_file_size: '100mb',
                     prevent_duplicates: true,//不允许选取重复文件
                     // Specify what files to browse for
                     mime_types: [
                     {title: "flv files", extensions: "flv"},// 限定flv后缀上传格式上传
                     {title: "Video files", extensions: "flv,mpg,mpeg,avi,wmv,mov,asf,rm,rmvb,mkv,m4v,mp4"}, // 限定flv,mpg,mpeg,avi,wmv,mov,asf,rm,rmvb,mkv,m4v,mp4后缀格式上传
                     {title: "Image files", extensions: "jpg,gif,png"}, // 限定jpg,gif,png后缀上传
                     {title: "Zip files", extensions: "zip"} // 限定zip后缀上传
                     ]
                     },*/
                    init: {
                        'FilesAdded': function (up, files) {
                            _this.isShow = true;
                            _this.isSucess = false;
                            plupload.each(files, function (file) {
                                _this.$set('files.' + file.id, {
                                    id: file.id,
                                    name: file.name,
                                    loaded: file.loaded,
                                    origSize: file.origSize,
                                    percent: file.percent,
                                    size: plupload.formatSize(file.size).toUpperCase(),
                                    status: file.status,
                                    type: file.type,
                                    statusText: '等待中',
                                    up: up
                                })
                            });
                        },
                        'BeforeUpload': function (up, file) {
                        },
                        'UploadProgress': function (up, file) {
                            var obj = _this.getFile(file.id)
                            obj.class = "progressContainer green";
                            var size = plupload.formatSize(file.loaded).toUpperCase();
                            obj.formatSpeed = plupload.formatSize(file.speed).toUpperCase();
//                        if (this.statusText !== '取消上传') {
//
//                        }
                            obj.statusText = "已上传: " + size + " 上传速度： " + obj.formatSpeed + '/秒';
                            obj.percent = parseInt(file.percent, 10);
                            if (file.status !== plupload.DONE && obj.percent === 100) {
                                obj.percent = 99;
                            }
                            _this.setFile(file.id, obj);
                        },
                        'UploadComplete': function () {
                            _this.isSucess = true;
                        },
                        'FileUploaded': function (up, file, info) {
                            var res = $.parseJSON(info);
                            var obj = _this.getFile(file.id);
                            obj.status = file.status;
                            obj.filename = file.target_name;
                            if (res.url) {
                                obj.url = res.url;
                            } else {
                                var domain = up.getOption('domain');
                                obj.url = domain + encodeURI(res.key);
                            }
                            obj.hash = res.hash;
                            obj.isImage = _this.isImage(obj.url);
                            _this.setFile(file.id, obj);
                            _this.setFileNames();
                        },
                        'Error': function (up, err, errTip) {
                            var obj = _this.getFile(err.file.id);
                            //如果返回为FALSE,表示,未执行ADD直接报错,否则,则需要将该条数据删除
                            if (!obj) {
                                alert(errTip)
                            } else {
                                obj.statusText = errTip;
                                obj.isError = true;
                                _this.setFile(err.file.id, obj);
                            }
//                        $('table').show();
//                        var progress = new FileProgress(err.file, 'fsUploadProgress');
//                        progress.setError();
//                        progress.setStatus(errTip);
                        }
                        // ,
                        // 'Key': function(up, file) {
                        //     var key = "";
                        //     // do something with key
                        //     return key
                        // }
                    }
                }
            }
        },
        towWay: true,
        props: {
            fileNames: {
                type: Array,
                towWay: true
            },
            uploadContainer: {
                type: String,
                require: true,
                default: function () {
                    return 'qnupload-container';
                }
            },
            options: {
                type: Object,
                require:true,
                deep:true,
                default: function () {
                    return {}
                }
            }
        },
        computed: {
            curOptions: function () {
                var uploadContainer = document.querySelector('#' + this.uploadContainer + ' .qnupload-container')
                this.options.container = uploadContainer
                this.options.drop_element = uploadContainer
                return Object.assign({}, this.defaultOptions, this.options);
            }
        },
        methods: {
            validateData: function () {
                for (var file in this.files) {
                    console.log(file);
                }
            },
            deleteItem(file, up){
                if (up) {
                    up.removeFile(file);
                }
                var obj = JSON.parse(JSON.stringify(this.files))
                delete obj[file.id];
                this.$set('files', obj);
                if (isEmpty(obj)) {
                    this.isShow = false
                }
                this.setFileNames();
//                alert(id)
            },
            getFile: function (fileid) {
                if (this.$get('files.' + fileid)) {
                    return JSON.parse(JSON.stringify(this.$get('files.' + fileid)))
                } else {
                    return false
                }
            },
            setFile: function (fileid, obj) {
                this.$set('files.' + fileid, obj);
            },
            setFileNames: function () {
                var files = this.$get('files');
                var tempList = []
                for (var file in files) {
//                    console.log(file)
                    if (files[file].status === 5) {
                        tempList.push(file);
                    }
                }
                this.fileNames = tempList;
//                })
            },
            isImage: function (url) {
                var res, suffix = "";
                var imageSuffixes = ["png", "jpg", "jpeg", "gif", "bmp"];
                var suffixMatch = /\.([a-zA-Z0-9]+)(\?|\@|$)/;
                if (!url || !suffixMatch.test(url)) {
                    return false;
                }
                res = suffixMatch.exec(url);
                suffix = res[1].toLowerCase();
                for (var i = 0, l = imageSuffixes.length; i < l; i++) {
                    if (suffix === imageSuffixes[i]) {
                        return true;
                    }
                }
                return false;
            }
        },
        attached: function () {
            var _this = this;
            var uploadContainer = document.querySelector('#' + _this.uploadContainer + ' .qnupload-container');
            var options = _this.curOptions;
            var uploader = Qiniu.uploader(options);
            uploader.bind('FileUploaded', function () {
                console.log('hello man,a file is uploaded');
            });
            $('#upBtn').on('click', function () {
                uploader.start();
            });
            $('#stopBtn').on('click', function () {
                uploader.stop();
            });
        }
    }
    ;
</script>


