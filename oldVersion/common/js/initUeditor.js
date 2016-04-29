/**
 * Created by Administrator on 2015/11/17.
 */
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