/**
 * cookie操作
 * 设置 $.cookie('the_cookie', 'the_value');
 * 获取 $.cookie('the_cookie');
 * 删除 $.cookie('the_cookie', null);
 *     $.cookie('the_cookie', '', {expires:-1,path:'指定path'});
 */
$.cookie = jQuery.cookie = function (name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        var path = options.path ? '; path=' + options.path : '';
        var domain = options.domain ? '; domain=' + options.domain : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};
var _IE = (function () {
    var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
    while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
            all[0]
        );
    return v > 4 ? v : 10;
}());
$.event.special.valuechange = {
    teardown: function (namespaces) {
        $(this).unbind('.valuechange');
    },
    handler: function (e) {
        $.event.special.valuechange.triggerChanged($(this));
    },
    add: function (obj) {
        $(this).on('keyup.valuechange cut.valuechange paste.valuechange input.valuechange', obj.selector, $.event.special.valuechange.handler)
    },
    triggerChanged: function (element) {
        var current = element[0].contentEditable === 'true' ? element.html() : element.val()
            , previous = typeof element.data('previous') === 'undefined' ? element[0].defaultValue : element.data('previous')
        if (current !== previous) {
            element.trigger('valuechange', [element.data('previous')]);
            element.data('previous', current);
        }
    }
}
function getBodyHeight() {
    if (document.compatMode == "BackCompat") {
        var Node = document.body;
    } else {
        var Node = document.documentElement;
    }
    var h = Math.max(Node.scrollHeight, Node.clientHeight);
    if (h > window.screen.height) {
        h = window.screen.height;
    }
    if (h > window.screen.availHeight) {
        h = window.screen.availHeight;
    }
    return h;
}
function getBodyWidth() {
    if (document.compatMode == "BackCompat") {
        var Node = document.body;
    } else {
        var Node = document.documentElement;
    }
    var w = Math.max(Node.scrollHeight, Node.clientWidth);
    if (w > window.screen.width) {
        w = window.screen.width;
    }
    if (w > window.screen.availWidth) {
        w = window.screen.availWidth;
    }
    return w;
}
Array.prototype.in_array = function (e) {
    for (i = 0; i < this.length; i++) {
        if (this[i] == e) {
            return i;
        }
    }
    return -1;
}
String.prototype.Trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.LTrim = function () {
    return this.replace(/(^\s*)/g, "");
}
String.prototype.RTrim = function () {
    return this.replace(/(\s*$)/g, "");
}
function isIe() {
    var SysIe = false;
    var ua = navigator.userAgent.toLowerCase();
    if (window.ActiveXObject) {
        SysIe = ua.match(/msie ([\d.]+)/)[1];
    }
    return SysIe;
}
//单图片上传
function simpleUpload(obj, callback, url, maxFileSize) {
    var debug = false;
    $res = $(obj).find(".result");
    maxFileSize = (maxFileSize || 2);
    getUploadPlugin();
    $(obj).dmUploader({
        url: url || '/gallery?format=json',
        dataType: 'json',
        allowedTypes: 'image/*',
        maxFileSize: maxFileSize * 1024 * 1024,
        /* extFilter: 'jpg;png;gif', */
        onInit: function () {
            log('upload plugin initialized :)');
        },
        onBeforeUpload: function (id) {
            log('Starting the upload of #' + id);
        },
        onNewFile: function (id, file) {
            log('New file added to queue #' + id);
            $res.html("<div class='bar'><div class='progress'></div></div>");
        },
        onUploadProgress: function (id, percent) {
            var percentStr = percent + '%';
            $(obj).find('div.progress').width(percent);
        },
        onUploadSuccess: function (id, data) {
            if (typeof data === "string") {
                data = eval('(' + data + ')');
            }
            log('Upload of file #' + id + ' completed');
            log('Server Response for file #' + id + ': ' + JSON.stringify(data));
            $(obj).find('.progress').width('100%');
            if (data.success) {
                if (typeof callback === 'function') {
                    callback.call($(obj), data);
                }
                $(obj).find('.upload_title').hide();
                showInfo("√上传成功", true);
            } else {
                $(obj).find('.upload_title').hide();
                showInfo("上传失败：" + (data.message || data.result.message));
            }
        },
        onUploadError: function (id, message) {
            $(obj).find('.upload_title').hide();
            showInfo("上传失败：" + message)
        },
        onFileTypeError: function (file) {
            $(obj).find('.upload_title').hide();
            showInfo("只能上传图片格式")
        },
        onFileSizeError: function (file) {
            $(obj).find('.upload_title').hide();
            showInfo("文件大小不能超过" + maxFileSize + "M")
        },
        onFallbackMode: function (message) {
            $(obj).find('.upload_title').hide();
            showInfo('您的浏览器暂不支持，建议使用chrome浏览器: ' + message);
        }
    });
    function showInfo(info, right) {
        setTimeout(function () {
            $res.html("");
            $(obj).find('.upload_title').show();
        }, 3000);
        $res.html("<span style='font-size:12px;' class='" + (right ? "success" : "error") + "'>" + info + "</span>");
    }

    function log(msg) {
        if (debug) {
            console.log(msg);
        }
    }

    function getScript(url, callback) {
        $.ajax({
            url: url,
            dataType: "script",
            async: false,
            success: callback || $.noop,
            error: function () {
                alert(url + "未找到！")
            }
        });
    }

    function getUploadPlugin() {
        $.fn.dmUploader === undefined && getScript("/common/plugins/dmuploader/dmuploader.min.js");
    }
}
/*多图上传*/
function multiUpload(id, callback, url, path, maxNum) {
    var options = {
        toolbars: [['insertimage']],
        serverUrl: "/gallery.json",
        areaPath: path ? path : '',
        imageMaxNum: maxNum || 20
    };
    if (url) options.serverUrl = url;
    var _editor = _editor || window.UE.getEditor(id, options);
    _editor.ready(function () {
        //设置编辑器不可用
        _editor.setDisabled();
        //隐藏编辑器，因为不会用到这个编辑器实例，所以要隐藏
        _editor.hide();
        //侦听图片上传
        if ($("#" + id).attr("uploadedInit") != "true") {
            _editor.addListener('afterUploaded', function (t, args) {
                if (typeof callback === 'function') {
                    callback.call(this, t, args)
                }
                // 必须销毁对象
                //window.UE.delEditor(id);
            });
            $("#" + id).attr("uploadedInit", "true");
        }
    });
    var _dialog = _editor.ui._dialogs['insertimageDialog'];
    _dialog.oncancel = function () {
        // 必须销毁对象
        //window.UE.delEditor(id);
    }
    _dialog.open();
    // 2015-08-21 wfq dialog BUG修复
    $("." + _dialog.className).find(".edui-dialog-body").css({width: 'auto', height: '100%'});
}
/*地图坐标拾取*/
function mapCoordinate(id, callback, point) {
    var options = {toolbars: [['mapcoordinate']], point: point};
    var _editor = window.UE.getEditor(id, options);
    _editor.ready(function () {
        //设置编辑器不可用
        _editor.setDisabled();
        //隐藏编辑器，因为不会用到这个编辑器实例，所以要隐藏
        _editor.hide();
        _editor.addListener('afterClickMap', function (t, e) {
            if (typeof callback === 'function') {
                callback.call(this, t, e)
            }
            //_dialog.close();
            // 必须销毁对象
            window.UE.delEditor(id);
        });
    });
    var _dialog = _editor.ui._dialogs['mapcoordinateDialog'];
    _dialog.oncancel = function () {
        // 必须销毁对象
        window.UE.delEditor(id);
    }
    _dialog.open();
}
//文件上传
function jqfileUpload(obj, callback, url, maxFileSize) {
    fileUploadT(obj, callback, url, maxFileSize);
}
function fileUploadT(obj, callback, url, maxFileSize) {
    var debug = false;
    $res = $(obj).find(".message");
    maxFileSize = (maxFileSize || 100);
    getUploadPlugin();
    $(obj).dmUploader({
        url: url || '/attachment?format=json',
        dataType: 'json',
        allowedTypes: '*',
        maxFileSize: maxFileSize * 1024 * 1024,
        /* extFilter: 'jpg;png;gif', */
        onInit: function () {
            log('upload plugin initialized :)');
        },
        onBeforeUpload: function (id) {
            log('Starting the upload of #' + id);
        },
        onNewFile: function (id, file) {
            log('New file added to queue #' + id);
            addItem(id);
        },
        onUploadProgress: function (id, percent) {
            var percentStr = percent + '%';
            $(obj).parent().find('#file-item' + id).find('.progress_bar').width(percent);
        },
        onUploadSuccess: function (id, data) {
            console.log(data);
            if (typeof data === "string") {
                data = eval('(' + data + ')');
            }
            log('Upload of file #' + id + ' completed');
            log('Server Response for file #' + id + ': ' + JSON.stringify(data));
            if (data.success) {
                if (typeof callback === 'function') {
                    callback.call($(obj), data);
                }
                $(obj).parent().find('#file-item' + id).find('.progress_bar').width('0%');
                $(obj).parent().find('#file-item' + id).find('.file_title').text(data.name);
                $(obj).parent().find('#file-item' + id).find('input').val(data.id);
                $(obj).find('.upload_title').hide();
                showInfo("√上传成功", true);
            } else {
                $(obj).find('.upload_title').hide();
                showInfo("上传失败：" + data.message);
                removeItem(id);
            }
        },
        onUploadError: function (id, message) {
            $(obj).find('.upload_title').hide();
            showInfo("上传失败：" + message);
            removeItem(id);
        },
        onFileTypeError: function (file) {
            $(obj).find('.upload_title').hide();
            showInfo("文件格式不正确");
        },
        onFileSizeError: function (file) {
            $(obj).find('.upload_title').hide();
            showInfo("文件大小不能超过" + maxFileSize + "M");
        },
        onFallbackMode: function (message) {
            $(obj).find('.upload_title').hide();
            showInfo('您的浏览器暂不支持，建议使用chrome浏览器: ' + message);
        }
    });
    function addItem(id) {
        var item = '<div id="file-item' + id + '" class="attachment_item" pname="attachments">'
            + '<div class="result">'
            + '<div class="file_title"></div>'
            + '<input type="hidden" name="id" value="' + id + '"/>'
            + '<div class="progress_bar"></div>'
            + '<a class="del_file"></a>'
            + '</div>'
            + '</div>';
        $(obj).parent().append(item);
    }

    function removeItem(id) {
        $(obj).parent().find('#file-item' + id).remove();
    }

    function showInfo(info, right) {
        setTimeout(function () {
            $res.html("");
            $(obj).find('.upload_title').show();
        }, 3000);
        $res.html("<span style='font-size:12px;' class='" + (right ? "success" : "error") + "'>" + info + "</span>");
    }

    function log(msg) {
        if (debug) {
            console.log(msg);
        }
    }

    function getScript(url, callback) {
        $.ajax({
            url: url,
            dataType: "script",
            async: false,
            success: callback || $.noop,
            error: function () {
                alert(url + "未找到！")
            }
        });
    }

    function getUploadPlugin() {
        $.fn.dmUploader === undefined && getScript("/common/plugins/dmuploader/dmuploader.min.js");
    }
}
function fileUpload(objE, callback, url, maxFileSize) {
    var debug = false;
    var option = {};
    if (_IE <= 9) {
        $.extend(option, {contentType: "text/html,application/xhtml+xml,multipart/*,application/json; charset=utf-8"})
    }
    maxFileSize = (maxFileSize || 100);
    console.log(maxFileSize);
    $(objE).fileupload($.extend(option, {
        url: url || '/attachment?format=json',
        dataType: 'json',
        sequentialUploads: false,
        maxFileSize: maxFileSize,
        done: function (e, data) {
            var dataResult = data.result;
            if (typeof data.result === "string") {
                dataResult = eval('(' + data.result + ')');
            }
            if (dataResult.success) {
                $(e.target).parent().parent().find(".message").text(dataResult.name);
                callback(e.target, dataResult);
            } else {
                $.alert("上传失败!" + dataResult.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (413 == jqXHR.status) {
                $.alert("上传文件超出服务器限制范围!");
            }
        }
    }));
}
function initPlugins() {
    $(".gm-UEditor").each(function () {
        var id = $(this).attr("id");
        initUEditor(id);
//        initKindEditor($(this));
    });
    $(".gm-datepicker").each(function () {
        initDatepicker(this);
    });
    $(".gm-datetimepicker").each(function () {
        initDatetimepicker(this);
    });
}
function initUEditor(obj, textlength, zIndex, touristLineId, maxScaleEnaledWidth, maxScaleEnaledHeight) {
    window.editorIds = window.editorIds || 0;
    var templateObj = $(obj);
    obj = templateObj.length ? templateObj : $('#' + obj);
    var text = obj.text(), editorId = obj[0].id;
    if (!editorId) {
        window.editorIds++;
        obj.attr({'id': 'myEditor' + window.editorIds, 'editorId': 'myEditor' + window.editorIds, 'isInit': '1'});
    }
    var recentlyuse_url = obj.attr("recentlyuse");
    if (!textlength) {
        textlength = obj.attr("maxlength");
    }
    var ue = window.UE.getEditor(obj[0].id, {
        //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
        toolbars: ((null != recentlyuse_url && "" != recentlyuse_url) ?
            [['FullScreen', 'Source', 'Undo', 'Redo', 'Bold', 'italic', 'underline', 'forecolor', 'insertorderedlist', 'insertunorderedlist', 'diyupload', 'cleardoc', 'recentlyuse']]
            : [['FullScreen', 'Source', 'Undo', 'Redo', 'Bold', 'italic', 'underline', 'forecolor', 'insertorderedlist', 'insertunorderedlist', 'diyupload', 'cleardoc']]),
        //focus时自动清空初始化时的内容
        autoClearinitialContent: false,
        //关闭elementPath
        elementPathEnabled: false,
        retainOnlyLabelPasted: true, //粘贴只保留标签，去除标签所有属性
        pasteplain: true,//纯文本粘贴
        autoTransWordToList: true,//禁止word中粘贴进来的列表自动变成列表标签
        imageScaleEnabled: false,//禁止图片缩放大小
        scaleEnabled: (maxScaleEnaledHeight > 0 || maxScaleEnaledWidth > 0) ? true : false,
        enableAutoSave: false,
        saveInterval: 10000000,
        maxScaleEnaledWidth: maxScaleEnaledWidth && maxScaleEnaledWidth > 0 ? maxScaleEnaledWidth : 900,
        maxScaleEnaledHeight: maxScaleEnaledHeight > 0 ? maxScaleEnaledHeight : 600,
        zIndex: zIndex && zIndex > 0 ? zIndex : 1,
        recentlyuseUrl: recentlyuse_url,
        touristLineId: touristLineId,
        wordCount: true,        //是否开启字数统计
        maximumWords: textlength && textlength > 0 ? textlength : 2000,
        wordOverFlowMsg: '<span style="color:red;">你输入的字符个数已经超出最大允许值,最多输入' + (textlength && textlength > 0 ? textlength : 2000) + '个字符</span>',
        removeFormat: true,
        removeFormatTags: 'b,big,code,del,dfn,em,font,i,ins,kbd,q,samp,small,span,strike,strong,sub,sup,tt,u,var,script',
        removeFormatAttributes: 'class,style,lang,width,height,align,hspace,valign',
        pasteplain: true,
        filterRules: function () {
            return {
                span: function (node) {
                    if (/Wingdings|Symbol/.test(node.getStyle('font-family'))) {
                        return true;
                    } else {
                        node.parentNode.removeChild(node, true);
                    }
                },
                p: function (node) {
                    var listTag;
                    if (node.getAttr('class') == 'MsoListParagraph') {
                        listTag = 'MsoListParagraph';
                    }
                    node.setAttr();
                    if (listTag) {
                        node.setAttr('class', 'MsoListParagraph');
                    }
                    if (!node.firstChild()) {
                        node.innerHTML(UE.browser.ie ? '&nbsp;' : '<br>');
                    }
                },
                div: function (node) {
                    var tmpNode, p = UE.uNode.createElement('p');
                    while (tmpNode = node.firstChild()) {
                        if (tmpNode.type == 'text' || !UE.dom.dtd.$block[tmpNode.tagName]) {
                            p.appendChild(tmpNode);
                        } else {
                            if (p.firstChild()) {
                                node.parentNode.insertBefore(p, node);
                                p = UE.uNode.createElement('p');
                            } else {
                                node.parentNode.insertBefore(tmpNode, node);
                            }
                        }
                    }
                    if (p.firstChild()) {
                        node.parentNode.insertBefore(p, node);
                    }
                    node.parentNode.removeChild(node);
                },
                //$:{}表示不保留任何属性
                br: {$: {}},
//                a: function (node) {
//                    if(!node.firstChild()){
//                        node.parentNode.removeChild(node);
//                        return;
//                    }
//                    node.setAttr();
//                    node.setAttr('href', '#')
//                },
//                strong: {$: {}},
//                b:function(node){
//                    node.tagName = 'strong'
//                },
//                i:function(node){
//                    node.tagName = 'em'
//                },
//                em: {$: {}},
//                img: function (node) {
//                    var src = node.getAttr('src');
//                    node.setAttr();
//                    node.setAttr({'src':src})
//                },
                ol: {$: {}},
                ul: {$: {}},
                dl: function (node) {
                    node.tagName = 'ul';
                    node.setAttr()
                },
                dt: function (node) {
                    node.tagName = 'li';
                    node.setAttr()
                },
                dd: function (node) {
                    node.tagName = 'li';
                    node.setAttr()
                },
                li: function (node) {
                    var className = node.getAttr('class');
                    if (!className || !/list\-/.test(className)) {
                        node.setAttr()
                    }
                    var tmpNodes = node.getNodesByTagName('ol ul');
                    UE.utils.each(tmpNodes, function (n) {
                        node.parentNode.insertAfter(n, node);
                    });
                },
                table: function (node) {
                    UE.utils.each(node.getNodesByTagName('table'), function (t) {
                        UE.utils.each(t.getNodesByTagName('tr'), function (tr) {
                            var p = UE.uNode.createElement('p'), child, html = [];
                            while (child = tr.firstChild()) {
                                html.push(child.innerHTML());
                                tr.removeChild(child);
                            }
                            p.innerHTML(html.join('&nbsp;&nbsp;'));
                            t.parentNode.insertBefore(p, t);
                        })
                        t.parentNode.removeChild(t);
                    });
                    var val = node.getAttr('width');
                    node.setAttr();
                    if (val) {
                        node.setAttr('width', val);
                    }
                },
                tbody: {$: {}},
                caption: {$: {}},
                th: {$: {}},
                td: {$: {valign: 1, align: 1, rowspan: 1, colspan: 1, width: 1, height: 1}},
                tr: {$: {}},
                h3: {$: {}},
                h2: {$: {}},
                img: {},
                script: {$: {}},
                //黑名单，以下标签及其子节点都会被过滤掉
                '-': 'script style meta iframe embed object'
            }
        }()
    });
    return ue;
}
function initKindEditor(obj, textlength, zIndex, touristLineId, maxScaleEnaledWidth, maxScaleEnaledHeight) {
    var recentlyuse = obj.attr("recentlyuse");
    var placeholder = obj.attr("placeholder");
    var kindeditor = KindEditor.create(obj, {
        filterMode: true,
        pasteType: 1,
        resizeType: 1,
        autoHeightMode: false,
        recentlyuseUrl: null != recentlyuse && "" != recentlyuse ? recentlyuse : "",
        maxTextLength: textlength && textlength > 0 ? textlength : 20000,
        touristLineId: touristLineId,
        zIndex: zIndex ? zIndex : 1,
        minWidth: 300,
        width: maxScaleEnaledWidth && maxScaleEnaledWidth > 0 ? maxScaleEnaledWidth : '100%',
        height: maxScaleEnaledHeight > 0 ? maxScaleEnaledHeight : 300,
        placeholder: "" != placeholder && null != placeholder ? placeholder : "",
        langType: 'zh_CN',
        afterCreate: function () {
            var text = this.text();
            if (("" == text || null == text) && this.options.placeholder) {
                $(this.cmd.doc.body).append('<p class="editor-default-value" style="color:#ccc;">' + this.options.placeholder + '</p>');
            }
            var statusBar = this.statusbar.get();
            $(statusBar).append('<span class="status-text" style="float:right;margin-right:20px;color:red;line-height:18px;">最多输入' + this.maxTextLength + '个字符</span>');
        },
        afterChange: function () {
            var statusBar = this.statusbar.get();
            var limitNum = this.maxTextLength;
//	    	var textLength = this.count('text');
            var textLength = this.count();
            var pattern = '还可以输入' + limitNum + '字';
            if (textLength > limitNum) {
                pattern = '你输入的字符个数已经超出最大允许值,最多输入' + limitNum + '个字符';
//	    		var strValue = this.text();
//	    	    strValue = strValue.substring(0,limitNum);
//	    	    this.text(strValue);
            } else {
                var result = limitNum - textLength;
                pattern = '还可以输入' + result + '字符';
            }
            $(statusBar).find(".status-text").text(pattern);
            this.sync();
        },
        afterBlur: function () {
            this.sync();
            var text = this.text();
            if (("" == text || null == text) && this.options.placeholder && null != this.options.placeholder) {
                if ($(this.cmd.doc.body).find(".editor-default-value") && null != $(this.cmd.doc.body).find(".editor-default-value")[0]) {
                    $(this.cmd.doc.body).find(".editor-default-value").show();
                } else {
                    $(this.cmd.doc.body).html('<p class="editor-default-value" style="color:#ccc;">' + this.options.placeholder + '</p>');
                }
            }
        },
        afterFocus: function () {
            if ($(this.cmd.doc.body).find(".editor-default-value") && null != $(this.cmd.doc.body).find(".editor-default-value")[0]) {
                $(this.cmd.doc.body).find(".editor-default-value").remove();
            }
        },
        items: null != recentlyuse && "" != recentlyuse ? ['source', 'undo', '|', 'plainpaste', 'bold', 'forecolor', 'insertorderedlist',
            'insertunorderedlist', 'diyupload', 'recentlyuse', 'cleartexts', 'fullscreen'] :
            ['source', 'undo', '|', 'plainpaste', 'bold', 'forecolor', 'insertorderedlist',
                'insertunorderedlist', 'diyupload', 'cleartexts', 'fullscreen'],
        htmlTags: {
            font: ['color', 'size', 'face', '.background-color'],
            span: [
                '.color', '.background-color', '.font-size', '.font-family', '.background',
                '.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.line-height'
            ],
            div: [
                'align', '.border', '.margin', '.padding', '.text-align', '.color',
                '.background-color', '.font-size', '.font-family', '.font-weight', '.background',
                '.font-style', '.text-decoration', '.vertical-align', '.margin-left'
            ],
            table: [
                'border', 'cellspacing', 'cellpadding', 'align', 'bordercolor',
                '.border', 'bgcolor', '.text-align', '.color', '.background-color',
                '.font-size', '.font-family', '.font-weight', '.font-style', '.text-decoration', '.background',
                '.border-collapse'
            ],
            'td,th': [
                'align', 'valign', 'colspan', 'rowspan', 'bgcolor',
                '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.font-weight',
                '.font-style', '.text-decoration', '.vertical-align', '.background', '.border'
            ],
            //a : ['href', 'target', 'name'],
            embed: ['src', 'width', 'height', 'type', 'loop', 'autostart', 'quality', '.width', '.height', 'align', 'allowscriptaccess'],
            img: ['src', 'width', 'height', 'border', 'alt', 'title', 'align', '.width', '.height', '.border'],
            'p,h1,h2,h3,h4,h5,h6': [
                'align', '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.background',
                '.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.text-indent', '.margin-left'
            ],
            'br,tbody,tr': []
        }
    });
    return kindeditor;
}
function checkEditour() {
    var valid = true;
    $("textarea[tag=edit]").each(function () {
        var placeholder = $(this).attr("placeholder");
        KindEditor.removePlaceholder($(this));
        KindEditor.sync($(this));
        var value = KindEditor($(this)).val();
        if (value == placeholder) {
            value = "";
        }
        var max = $(this).attr("maxlength") || 20000;
        var $tar = $(this).is(":visible") ? $(this) : $(this).parent();
        var requiredVal = $(this).attr("required");
        var required = requiredVal && requiredVal == "required";
        if (required && (null == value || "" == value)) {
            showValidError($tar, "* 不能为空");
            valid = false;
            KindEditor($(this)).focus();
            return false;
        }
        if (value.length > max) {
            showValidError($tar, "* 最多 " + max + " 个字符");
            valid = false;
            KindEditor($(this)).focus();
            return false;
        }
    });
    return valid;
}
function checkUEditour() {
    var valid = true;
    $("textarea[tag=edit]").each(function () {
        //KindEditor.removePlaceholder($(this));
        //KindEditor.sync($(this));
        var editorId = $(this).attr('editorId'), currEditor = UE.getEditor(editorId), placeholder = $(this).attr("placeholder");
        currEditor.sync();
        var value = currEditor.getContentTxt();
        if (value == placeholder) {
            value = "";
        }
        //console.log($(this).attr('editorId'));
        var max = $(this).attr("maxlength") || 20000;
        var $tar = $(this).is(":visible") ? $(this) : $(this).parent();
        var requiredVal = $(this).attr("required");
        var required = requiredVal && requiredVal == "required";
        if (required && !currEditor.hasContents()) {
            showValidError($tar, "* 不能为空");
            valid = false;
            currEditor.focus();
            return false;
        }
        if (value.length > max) {
            showValidError($tar, "* 最多 " + max + " 个字符");
            valid = false;
            currEditor.focus();
            return false;
        }
    });
    return valid;
}
function showValidError($tar, msg, pos) {
    $tar.validationEngine('showPrompt', msg, 'error', pos, true);
    $('html,body').animate({scrollTop: $tar.offset().top - 200});
}
function initDatepicker(obj) {
    $(obj).datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: "yy-mm-dd"
    });
}
function initDatetimepicker(obj) {
    $(obj).datetimepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: "yy-mm-dd"
    });
}
function initSupplier(id, data, callback) {
    $("#" + id).gmAutoComplete($.extend({}, {
        uri: "/vendor/supplier/select?keyword=",
        nothingClear: true,
        callback: callback
    }, data));
}
function initDistributor(id, data, callback) {
    $("#" + id).gmAutoComplete($.extend({}, {
        uri: "/vendor/distributor/select?keyword=",
        nothingClear: true,
        callback: callback
    }, data));
}
function initSight(obj, data, callback) {
    var uri = "/sight-select?keyword=";
    if (typeof obj == "string") {
        $("#" + obj).gmAutoComplete($.extend({}, {
            uri: uri,
            nothingClear: false,
            lineSet: true,
            callback: callback
        }, data));
    } else {
        $(obj).gmAutoComplete($.extend({}, {
            uri: uri,
            nothingClear: false,
            lineSet: true,
            callback: callback
        }, data));
    }
}
function initHotel(obj, data, callback) {
    var uri = "/hotel-select?keyword=";
    if (typeof obj == "string") {
        $("#" + obj).gmAutoComplete({
            uri: uri,
            nothingClear: false,
            lineSet: true,
            callback: callback
        });
    } else {
        $(obj).gmAutoComplete($.extend({}, {
            uri: uri,
            nothingClear: false,
            lineSet: true,
            callback: callback
        }, data));
    }
}
/**
 *
 * @param id
 * @param data {lineSet: false, def_data:{areaParent: '10'}}
 *                {lineSet: true, lineObjId: "touristLineId"}
 * @param callback
 */
function initAreas(id, data, callback, noDataButCall) {
    $("#" + id).gmAutoComplete($.extend({}, {
        uri: "/area-select?keyword=",
        nothingClear: false,
        lineSet: false,
        def_data: {areaParent: 10},
        callback: callback
    }, data));
}
function getMaxZIndex(obj, zIndex) {
    var objZ = obj.css("z-index");
    if (objZ && objZ != "auto" && objZ * 1 > zIndex) {
        zIndex = objZ * 1;
    }
    if (obj.parent() && obj.parent().get(0).tagName != "html" && "" != obj.parent().get(0).tagName && null != obj.parent().get(0).tagName && "undefined" != obj.parent().get(0).tagName) {
        zIndex = getMaxZIndex(obj.parent(), zIndex);
    }
    return zIndex;
}
String.prototype.template = function (json) {
    var s = this;
    for (var v in json) {
        s = s.replace(/{(\w+)}/g, function (w) {
            var s = w.substring(1, w.length - 1);
            return json[s] || ""
        });
    }
    return s;
}
function initMap(obj) {
    obj.focus(function () {
        var that = this;
        var v = (null != $(that).val() && "" != $(that).val()) ? $(that).val() : "104.071216|30.576279";
        var mapDialog = $.dialog({
            title: '地图选择',
            width: 580, height: 400, padding: "0px", zIndex: '1002',
            isOuterBoxShadow: false, isClose: false, lock: true, fixed: true,
            content: '<div style="width:580px;height:400px;padding-bottom:10px;"><input id="set-search-value" type="hidden" value="' + v + '"/>' +
            '<iframe id="map_iframe" class="%%-iframe" height="100%" width="100%" frameborder="0" src="/common/plugins/map/mapcoordinate.html"></iframe></div>',
            ok: function () {
                $(that).val($("#set-search-value").val());
            },
            okVal: '确认',
            okCssClass: 'btn-save',
            cancel: function () {
            },
            cancelVal: '取消',
            cancelCssClass: 'btn-cancel'
        });
    });
}