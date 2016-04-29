//config
jSharp && jSharp.config({
    baseUrl: "http://static.gmmtour.com/",
    srcPathName: "pc",
    distPathName: "pc",
    　　paths: {　　　
    	"jquery": "common/js/jquery1.9.1.min",//
    	"browser":"common/plugins/browser/browser-amd",
        "bootstrap": "common/js/bootstrap-amd",
        "slider": "common/plugins/jQuery.slider/js/jQuery.silder.amd",//轮播
        "dialog": "common/plugins/artdialog/jquery.artDialog.amd",//弹窗
        "eDialog": "common/plugins/eDialog/eDialog",//新弹窗
        "eDate": "common/plugins/eDate/eDate",//日期选择控件
        "eTable": "common/plugins/eTable/eTable",//
        "e97Date": "common/plugins/e97Date/WdatePicker",//97日期选择控件
        "eCalendar": "common/plugins/eCalendar/eCalendar",//日历控件
        "cookie": "common/plugins/jQuery.cookie/jQuery.cookie.amd",
        "template": "common/plugins/template/template.amd",//模版引擎
        "flyer": "common/plugins/compare/jquery.fly.min.amd",//动画插件
        "compare": "common/plugins/compare/compare.amd",//对比
        "zclip": "common/plugins/zclip/jquery.zclip.amd",//复制粘贴
        "tools": "m/pc/packages/tools",//自定义扩展工具
        "tinytooltip":"common/plugins/tinytooltip/jquery.tinytooltip.amd",//对比 显示更多信息弹窗
        "eValidate":"common/plugins/eValidate/eValidate"//验证控件
    }
});