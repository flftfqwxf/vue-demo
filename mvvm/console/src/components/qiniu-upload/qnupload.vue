<template>
    <div id="qnupload-container">
        <a class="btn btn-default btn-lg " id="pickfiles" href="#">
            <i class="glyphicon glyphicon-plus"></i>
            <span>选择文件</span>
        </a>
    </div>
    <!--<table class="table table-striped table-hover text-left mt" v-show="">-->
    <!--<thead>-->
    <!--<tr>-->
    <!--<th class="col-md-4">文件名</th>-->
    <!--<th class="col-md-2">大小</th>-->
    <!--<th class="col-md-6">进度</th>-->
    <!--</tr>-->
    <!--</thead>-->
    <!--<tbody>-->
    <!--<tr id="{{file.id}}" class="progressContainer" v-for="file in files">-->
    <!--<td class="progressName">{{files[file]}}</td>-->
    <!--<td class="progressFileSize">62 KB</td>-->
    <!--<td>-->
    <!--<div class="info">-->
    <!--<div class="progress">-->
    <!--<div class="progress-bar progress-bar-info" role="progressbar" style="width: 60%"></div>-->
    <!--</div>-->
    <!--<span class="sr-only">62 KB</span>-->
    <!--<a href="javascript:;" class="progressCancel" style="display: inline;">×</a>-->
    <!--<div class="status text-left">等待中...</div>-->
    <!--</div>-->
    <!--</td>-->
    <!--</tr>-->
    <!--&lt;!&ndash;<tr id="{{file}}" class="progressContainer">&ndash;&gt;-->
    <!--&lt;!&ndash;<td class="progressName">反馈详情.png</td>&ndash;&gt;-->
    <!--&lt;!&ndash;<td class="progressFileSize">62 KB</td>&ndash;&gt;-->
    <!--&lt;!&ndash;<td>&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="info">&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="progress">&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="progress-bar progress-bar-info" role="progressbar" style="width: 60%"></div>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;<span class="sr-only">62 KB</span>&ndash;&gt;-->
    <!--&lt;!&ndash;<a href="javascript:;" class="progressCancel" style="display: inline;">×</a>&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="status text-left">已上传: 52 KB 上传速度： 7 KB/s</div>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;</td>&ndash;&gt;-->
    <!--&lt;!&ndash;</tr>&ndash;&gt;-->
    <!--&lt;!&ndash;<tr id="{{file}}" class="progressContainer">&ndash;&gt;-->
    <!--&lt;!&ndash;<td class="progressName">反馈详情.png</td>&ndash;&gt;-->
    <!--&lt;!&ndash;<td class="progressFileSize">62 KB</td>&ndash;&gt;-->
    <!--&lt;!&ndash;<td>&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="info">&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="progress">&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="progress-bar progress-bar-info" role="progressbar" style="width: 60%"></div>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;<span class="sr-only">62 KB</span>&ndash;&gt;-->
    <!--&lt;!&ndash;<a href="javascript:;" class="progressCancel" style="display: inline;">×</a>&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="status text-left">已取消上传</div>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;</td>&ndash;&gt;-->
    <!--&lt;!&ndash;</tr>&ndash;&gt;-->
    <!--&lt;!&ndash;<tr id="{{file}}" class="progressContainer">&ndash;&gt;-->
    <!--&lt;!&ndash;<td class="progressName">反馈详情.png</td>&ndash;&gt;-->
    <!--&lt;!&ndash;<td class="progressFileSize">62 KB</td>&ndash;&gt;-->
    <!--&lt;!&ndash;<td>&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="info">&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="progress">&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="progress-bar progress-bar-info" role="progressbar" style="width: 60%"></div>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;<span class="sr-only">62 KB</span>&ndash;&gt;-->
    <!--&lt;!&ndash;<a href="javascript:;" class="progressCancel" style="display: inline;">×</a>&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="status text-left">客户端认证授权失败。请重试或提交反馈。(401：expired token)</div>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;</td>&ndash;&gt;-->
    <!--&lt;!&ndash;</tr>&ndash;&gt;-->
    <!--&lt;!&ndash;<tr id="{{file}}" class="progressContainer">&ndash;&gt;-->
    <!--&lt;!&ndash;<td class="progressName">反馈详情.png</td>&ndash;&gt;-->
    <!--&lt;!&ndash;<td class="progressFileSize">62 KB</td>&ndash;&gt;-->
    <!--&lt;!&ndash;<td>&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="info">&ndash;&gt;-->
    <!--&lt;!&ndash;<div><strong>Link:</strong><a href="http://o8eatr2zr.bkt.clouddn.com/%E7%89%88%E6%9C%AC%E8%AF%A6%E6%83%85.png" target="_blank">&ndash;&gt;-->
    <!--&lt;!&ndash;http://o8eatr2zr.bkt.clouddn.com/版本详情.png</a></div>&ndash;&gt;-->
    <!--&lt;!&ndash;<span class="sr-only">62 KB</span>&ndash;&gt;-->
    <!--&lt;!&ndash;<a href="javascript:;" class="progressCancel" style="display: inline;">×</a>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;</td>&ndash;&gt;-->
    <!--&lt;!&ndash;</tr>&ndash;&gt;-->
    <!--&lt;!&ndash;<tr id="{{file}}" class="progressContainer">&ndash;&gt;-->
    <!--&lt;!&ndash;<td class="progressName">反馈详情.png&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="Wrapper">&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="imgWrapper">&ndash;&gt;-->
    <!--&lt;!&ndash;<a class="linkWrapper" target="_blank"&ndash;&gt;-->
    <!--&lt;!&ndash;href="http://o8eatr2zr.bkt.clouddn.com/%E5%8F%8D%E9%A6%88%E8%AF%A6%E6%83%85.png?imageView2/1/w/100/h/100" title="查看原图"><img&ndash;&gt;-->
    <!--&lt;!&ndash;src="http://o8eatr2zr.bkt.clouddn.com/%E5%8F%8D%E9%A6%88%E8%AF%A6%E6%83%85.png?imageView2/1/w/100/h/100"></a></div>&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="infoWrapper"><a class="fopLink" data-key="反馈详情.png">查看处理效果</a>&ndash;&gt;-->
    <!--&lt;!&ndash;<div>&ndash;&gt;-->
    <!--&lt;!&ndash;<div>格式：<span class="origin-format">png</span></div>&ndash;&gt;-->
    <!--&lt;!&ndash;<div>宽度：<span class="orgin-width">1920px</span></div>&ndash;&gt;-->
    <!--&lt;!&ndash;<div>高度：<span class="origin-height">1275px</span></div>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;</td>&ndash;&gt;-->
    <!--&lt;!&ndash;<td class="progressFileSize">62 KB</td>&ndash;&gt;-->
    <!--&lt;!&ndash;<td>&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="info">&ndash;&gt;-->
    <!--&lt;!&ndash;<div><strong>Link:</strong><a href="http://o8eatr2zr.bkt.clouddn.com/%E7%89%88%E6%9C%AC%E8%AF%A6%E6%83%85.png" target="_blank">&ndash;&gt;-->
    <!--&lt;!&ndash;http://o8eatr2zr.bkt.clouddn.com/版本详情.png</a></div>&ndash;&gt;-->
    <!--&lt;!&ndash;<span class="sr-only">62 KB</span>&ndash;&gt;-->
    <!--&lt;!&ndash;<a href="javascript:;" class="progressCancel" style="display: inline;">×</a>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;</td>&ndash;&gt;-->
    <!--&lt;!&ndash;</tr>&ndash;&gt;-->
    <!--</tbody>-->
    <!--</table>-->
    <div style="display:none" id="success" class="col-md-12" v-show="isSuccess">
        <div class="alert-success">
            队列全部文件处理完毕
        </div>
    </div>
    <div>
        <table class="table table-striped table-hover text-left mt" v-show="isShow">
            <thead>
            <tr>
                <th class="col-md-4">文件名</th>
                <th class="col-md-4">大小</th>
                <th class="col-md-2">进度</th>
            </tr>
            </thead>
            <tbody id="fsUploadProgress">
            <tr track-by="id" class="progressContainer" v-for="file of files">
                <td class="progressName">{{file.name}}</td>
                <td class="progressFileSize">{{file.size}}</td>
                <td>
                    <div class="info">
                        <div class="progress">
                            <div class="progress-bar progress-bar-info" role="progressbar" :style="{width:file.percent+'%'}"></div>
                        </div>
                        <a href="javascript:;" class="progressCancel" @click="deleteItem(file.id)" style="display: inline;">×</a>
                        <div class="status text-left">等待中...</div>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
    <div>
        <button type="button" id="upBtn">手动上传</button>
        <button type="button" id="stopBtn">停止上传</button>
        <button type="button" @click="validateData"></button>
    </div>
</template>
<style scoped>
    .Wrapper{
        width: 200px;
    }
    .linkWrapper{ width: 100px; float: left; }
    .imgWrapper{ width: 100px; float: left; }
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
    //    var FileProgress = require('./ui')
    require('./qiniu.js');
    module.exports = {
        data(){
            return {
                message: {
                    "Stop Upload": "停止上传",
                    "Upload URL might be wrong or doesn't exist.": "上传的URL可能是错误的或不存在。",
                    "tb": "tb",
                    "Size": "大小",
                    "Close": "关闭",
                    "You must specify either browse_button or drop_element.": "您必须指定 browse_button 或者 drop_element。",
                    "Init error.": "初始化错误。",
                    "Add files to the upload queue and click the start button.": "将文件添加到上传队列，然后点击”开始上传“按钮。",
                    "List": "列表",
                    "Filename": "文件名",
                    "%s specified, but cannot be found.": "%s 已指定，但是没有找到。",
                    "Image format either wrong or not supported.": "图片格式错误或者不支持。",
                    "Status": "状态",
                    "HTTP Error.": "HTTP 错误。",
                    "Start Upload": "开始上传",
                    "Error: File too large:": "错误: 文件太大:",
                    "kb": "kb",
                    "Duplicate file error.": "重复文件错误。",
                    "File size error.": "文件大小错误。",
                    "N/A": "N/A",
                    "gb": "gb",
                    "Error: Invalid file extension:": "错误：无效的文件扩展名:",
                    "Select files": "选择文件",
                    "%s already present in the queue.": "%s 已经在当前队列里。",
                    "Resoultion out of boundaries! <b>%s</b> runtime supports images only up to %wx%hpx.": "超限。<b>%s</b> 支持最大 %wx%hpx 的图片。",
                    "File: %s": "文件: %s",
                    "b": "b",
                    "Uploaded %d/%d files": "已上传 %d/%d 个文件",
                    "Upload element accepts only %d file(s) at a time. Extra files were stripped.": "每次只接受同时上传 %d 个文件，多余的文件将会被删除。",
                    "%d files queued": "%d 个文件加入到队列",
                    "File: %s, size: %d, max file size: %d": "文件: %s, 大小: %d, 最大文件大小: %d",
                    "Thumbnails": "缩略图",
                    "Drag files here.": "把文件拖到这里。",
                    "Runtime ran out of available memory.": "运行时已消耗所有可用内存。",
                    "File count error.": "文件数量错误。",
                    "File extension error.": "文件扩展名错误。",
                    "mb": "mb",
                    "Add Files": "增加文件"
                },
                status: {
                    1: '等待...',
                    2: '上传中...'
                },
                isShow: false,
                isSuccess: false,
                files: {},
            }
        },
        towWay: true,
        props: ['fileNames'],
        methods: {
            validateData: function () {
                for (var file in this.files) {
                    console.log(file);
                }
            },
            deleteItem(id){
                var obj = JSON.parse(JSON.stringify(this.files))
                delete obj[id];
                this.$set('files', obj);
                if (isEmpty(obj)) {
                    this.isShow = false
                }
//                alert(id)
            }
        },
        ready: function () {
            var _this = this;
//            console.log($('#pickfiles').html());
            var filesAddList = [];
            var uploader = Qiniu.uploader({
//                idx: 123,
                runtimes: 'html5,flash,html4',    //上传模式,依次退化
                browse_button: 'pickfiles',       //上传选择的点选按钮，**必需**
//            uptoken_func: function (file) {
//                console.log(file)
//            },
//            uptoken_url: 'http://192.168.28.218/api/mobile/v1/settings/uptoken',
// Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
                uptoken: '7kSE98xxxk4hgFufkUgx2vsVU1Pw0hTfZCOQP61S:GdN3Cn5iULG0ycJPIix3KnVBY2k=:eyJzY29wZSI6Imlyb25oaWRlIiwiZGVhZGxpbmUiOjE0NzA3OTgyMjR9', //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
                unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
                // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
                domain: 'http://o8eatr2zr.bkt.clouddn.com/',   //bucket 域名，下载资源时用到，**必需**
                get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
                container: 'qnupload-container',           //上传区域DOM ID，默认是browser_button的父元素，
                max_file_size: '100mb',           //最大文件体积限制
                flash_swf_url: './Moxie.swf',  //引入flash,相对路径
                max_retries: 3,                   //上传失败最大重试次数
                dragdrop: true,                   //开启可拖曳上传
                drop_element: 'qnupload-container',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                chunk_size: '0mb',                //分块上传时，每片的体积
                auto_start: false,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
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
                            })
                        });
                        //                        window.rrrr = _this.files;
//                        window.eee = filesAddList;
                    },
                    'BeforeUpload': function (up, file) {
//                        var progress = new FileProgress(file, 'fsUploadProgress');
//                        var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
//                        if (up.runtime === 'html5' && chunk_size) {
//                            progress.setChunkProgess(chunk_size);
//                        }
                    },
                    'UploadProgress': function (up, file) {
//                        var progress = new FileProgress(file, 'fsUploadProgress');
//                        var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
//                        progress.setProgress(file.percent + "%", file.speed, chunk_size);
                    },
                    'UploadComplete': function () {
//                        $('#success').show();
                    },
                    'FileUploaded': function (up, file, info) {
//                        var progress = new FileProgress(file, 'fsUploadProgress');
//                        _this.fileNames.push(file.target_name);
//                        progress.setComplete(up, info);
                    },
                    'Error': function (up, err, errTip) {
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
            });
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
    };
</script>


