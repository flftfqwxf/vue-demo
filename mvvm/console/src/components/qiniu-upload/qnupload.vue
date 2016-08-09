<template>
    <div id="qnupload-container">
        <a class="btn btn-default btn-lg " id="pickfiles" href="#">
            <i class="glyphicon glyphicon-plus"></i>
            <span>选择文件</span>
        </a>
    </div>
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

            </tbody>

        </table>
    </div>
    <div>
        <button type="button" id="upBtn">手动上传</button>
        <button type="button" id="stopBtn">停止上传</button>
    </div>
</template>
<script>
    //       require('./moxie.js');
    require('jquery')

//    var loading=require('./images/loading.gif');

    //测试环境调用
//    require("./moxie.js")
//    require('./plupload.dev.js');
    //线上环境调用
    require('./plupload.full.min.js')
    var FileProgress=require('./ui')

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
                files: []
            }
        },
        ready: function () {
            const _this = this;
//            console.log($('#pickfiles').html());
            var uploader = Qiniu.uploader({
//                idx: 123,
                runtimes: 'html5,flash,html4',    //上传模式,依次退化
                browse_button: 'pickfiles',       //上传选择的点选按钮，**必需**
//            uptoken_func: function (file) {
//                console.log(file)
//            },
//            uptoken_url: 'http://192.168.28.218/api/mobile/v1/settings/uptoken',
// Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
                uptoken: '7kSE98xxxk4hgFufkUgx2vsVU1Pw0hTfZCOQP61S:cBzptabSJPutYa9q_IHWr1RIOdM=:eyJzY29wZSI6Imlyb25oaWRlIiwiZGVhZGxpbmUiOjE0NzA3MzY4NTB9', //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
                // unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
                // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
                domain: 'http://o8eatr2zr.bkt.clouddn.com/',   //bucket 域名，下载资源时用到，**必需**
                get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
                container: 'qnupload-container',           //上传区域DOM ID，默认是browser_button的父元素，
                max_file_size: '100mb',           //最大文件体积限制
                flash_swf_url: './Moxie.swf',  //引入flash,相对路径
                max_retries: 3,                   //上传失败最大重试次数
                dragdrop: true,                   //开启可拖曳上传
                drop_element: 'qnupload-container',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                chunk_size: '4mb',                //分块上传时，每片的体积
                auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                init: {
                    'FilesAdded': function (up, files) {
                        $('table').show();
                        $('#success').hide();
                        plupload.each(files, function (file) {
                            var progress = new FileProgress(file, 'fsUploadProgress');
                            progress.setStatus("等待...");
                            progress.bindUploadCancel(up);
                        });
                    },
                    'BeforeUpload': function (up, file) {
                        var progress = new FileProgress(file, 'fsUploadProgress');
                        var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                        if (up.runtime === 'html5' && chunk_size) {
                            progress.setChunkProgess(chunk_size);
                        }
                    },
                    'UploadProgress': function (up, file) {
                        var progress = new FileProgress(file, 'fsUploadProgress');
                        var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                        progress.setProgress(file.percent + "%", file.speed, chunk_size);
                    },
                    'UploadComplete': function () {
                        $('#success').show();
                    },
                    'FileUploaded': function (up, file, info) {
                        var progress = new FileProgress(file, 'fsUploadProgress');
                        progress.setComplete(up, info);
                    },
                    'Error': function (up, err, errTip) {
                        $('table').show();
                        var progress = new FileProgress(err.file, 'fsUploadProgress');
                        progress.setError();
                        progress.setStatus(errTip);
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


