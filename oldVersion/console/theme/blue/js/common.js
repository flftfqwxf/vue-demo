$(window).load(function(){
	// 页面最小高度设置
	//TODO:BUG  getBodyHeight()
	$("#contents").css("min-height", getBodyHeight());
	$("#leftBody,#rightBody").css("min-height", $("#contents").height());
	// 左边子菜单打开事件
	$("#leftBody .open_child").bind("click", function(){
		var cl = $(this).parent().attr("attr_class");
		if($("#"+cl+"_child").is(":visible")){
			$(this).parent().find(".right_icon").addClass("shut");
			$(this).parent().find(".right_icon").removeClass("open");
			$("#"+cl+"_child").hide();
		}else{
			$(this).parent().find(".right_icon").removeClass("shut");
			$(this).parent().find(".right_icon").addClass("open");
			$("#"+cl+"_child").show();
		}
	});
});

//全局超时处理 
$.ajaxSetup({
    complete:function(xhr){
        var responseText = xhr.responseText,
            res;

        if(this.dataType != 'script'){
            res = (typeof responseText === 'string' && /^\{/.test(responseText)) ? JSON.parse(responseText) : responseText;
            if(res && res.result && res.result.isReload){
            	$.unbindbeforeout && $.unbindbeforeout();
            	location.reload();
            }
        }
    }
});

function showLinkGmService(zIndex){
	var linkGmService = $.dialog({
		title: '联系方式',
        width: 300,
        height: 200,
        isOuterBoxShadow: false,
        zIndex: (zIndex&& zIndex> 0)?zIndex:999,
        isClose: false,
        content: '<div class="linksGmService">'+
        				'<div class="serviceLi"><div class="serviceLiLeft">客服QQ：</div><div class="serviceLiRight">'+
	        				'<div class="serviceLiCt"><a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=2850726006&site=qq&menu=yes"><img border="0" src="http://wpa.qq.com/pa?p=2:2850726006:41" alt="点击联系港马客服01" title="点击联系港马客服01"/></a></div>'+
	        				'<div class="serviceLiCt"><a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=2850726014&site=qq&menu=yes"><img border="0" src="http://wpa.qq.com/pa?p=2:2850726014:41" alt="点击联系港马客服01" title="点击联系港马客服01"/></a></div>'+
        				'</div></div>'+
        				'<div class="serviceLi"><div class="serviceLiLeft">联系电话：</div><div class="serviceLiRight">'+
	        				'<div class="serviceLiCt">65100025</div>'+
        				'</div></div>'+
        		'</div>',
        lock: false,
        fixed: true,
        drag: true,
        cancel: function () {},
        cancelVal: '关闭',
        cancelCssClass: 'btn-cancel'
	});
	return linkGmService;
}