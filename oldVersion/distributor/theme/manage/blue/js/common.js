String.prototype.toBankStr=function(){
    var result="";
    if(this){
	var temp=this.replace(/\s/g,"").replace(/[^\d]/g,"").split("");
	for(var i=0;i<temp.length;i++){
	    if(i!=0&&i%4==0){
		result+=" ";
	    }
	    result+=[temp[i]];
	}
    }
    return result;
};


$(function(){
    	
    	$(".page-tool .gm-back").parent().removeAttr("onclick").click(function(){
        	if($(".nav-step-wrap").size()>0){
    		    window.location.href="/product";
    	    	}
        	else if($(".schedule-list").size()>0){
        	    window.location.href="/order";
        	}
    	    	else{
    	    	    window.location.href=document.referrer;
    	    	}
        	return false;
	});
    
        $("#setPageNum").keyup(function(){
	    $(this).val($(this).val().replace(/[^\d]/g,""));
	}).blur(function(){
	    $(this).val($(this).val().replace(/[^\d]/g,""));
	});
    
	getTodayOrderCount();
	getOrderCount();
	// 每隔5分钟请求一次今日订单数量
	setInterval(function(){
	        getOrderCount();
		getTodayOrderCount();
	}, 300000);
    $("#left_navs").height($(".ct_body_right").height());
    $(document).find(".linkGmService").unbind("click");
    $(".linkGmService").unbind("click").click(function(){
        showLinkGmService();
    });
    /*港马二维码*/
    $(document).on("hover" , ".linkGmQrcode", function(){
        var html='<div class="weixinImg"><img class="logo-img left" src="'+WEB_STATIC+'/common/image/gmlinks/gm-weixin.png" /></div>';
        $(".linkGmQrcode").parent().append(html);
    });
    $(document).on("mouseout",".linkGmQrcode",function(){
        $(".weixinImg").remove();
    }).on("hover", ".linksGmService .gm-qq3", function(){
		$(this).addClass("gm-qq2").removeClass("gm-qq3");
	}).on("mouseout", ".linksGmService .gm-qq2", function(){
		$(this).addClass("gm-qq3").removeClass("gm-qq2");
	});
});

//获取今日订单数量
function getTodayOrderCount(){
	$.ajax({
		url:'/booking/count',
		type: "GET",
		async:false,
		dataType: "json",
		data: {format:'json',t:new Date()},
		success:function(json){
			if (json && json.count && json.count.today) {
				$('#todayOrderCount').text(json.count.today);
				$('#todayOrderCount').show();
			} else {
				$('#todayOrderCount').hide();
				$('#todayOrderCount').text('');
			}
		},
		error: function(){
			$('#todayOrderCount').hide();
			$('#todayOrderCount').text('');
		}
	});
}

function getOrderCount(){
	$.ajax({
		url:'/order/count.json',
		type: "GET",
		async:false,
		dataType: "json",
		data: {format:'json',t:Date.now()},
		success:function(json){
			if (json.count) {
				$('#orderCount').text(json.count);
				$('#orderCount').attr("data-original-title", json.count + "个新订单，请及时处理");
				$('#orderCount').show();
			} else {
				$('#orderCount').hide();
				$('#orderCount').text('');
			}
		}
	});
}

function showLinkGmService(zIndex){
    var api, wrap, linkGmService = artDialog.get('linksGmService');
    if (linkGmService) {
        linkGmService.close();
    }
    linkGmService = $.dialog({
        id: "linksGmService",
        title: false,
        width: 332,
        height: 500,
        isOuterBoxShadow: true,
        isClose: true,
        padding: '0px 0px',
        isNotScroll: true,
        zIndex: (zIndex && zIndex> 0) ? zIndex : 1937,
        init: function(here){
            api = this;
            wrap = api.DOM.wrap;
            wrap.find('.aui_inner').css({
                'border':'none',
                '-moz-border-radius':'5px',
                '-webkit-border-radius':'5px',
                'border-radius':'5px'
            });
            wrap.find('.aui_main').css({
                'padding-top': '0px'
            });
            wrap.find('.aui_content').css({
                'margin': '-3px',
                'border':'4px solid #fff',
                '-moz-border-radius':'5px',
                '-webkit-border-radius':'5px',
                'border-radius':'5px',
                'overflow': 'hidden'
            });
            wrap.find('.aui_outer').css({
                'box-shadow': '0px 0px 10px rgba(2, 37, 69, .6)'
            });
            wrap.find('.aui_close').css({
                'top': '-2px',
                'right': '2px',
                'color': '#ccc',
                'font-size': '24px',
                'display': 'block'
            });
            wrap.find('.aui_footer').css({
                'height': 'auto',
                'border-top': 'none'
            });
        },
        close: function(){
            wrap.find('.aui_inner').removeAttr("style");
            wrap.find('.aui_main').removeAttr("style");
            wrap.find('.aui_content').removeAttr("style");
            wrap.find('.aui_outer').removeAttr("style");
            wrap.find('.aui_close').removeAttr("style");
            wrap.find('.aui_footer').removeAttr("style");
        },
        content: '<div class="linksGmService">'
                 +    '<div class="title">联系港马</div>'
                 +    '<div class="service-date border-bottom">'
                 +        '<div class="service-date-title"><i class="gm-icon gm-times"></i>服务时间</div>'
                 +        '<div class="service-date-content">'
                 +            '<div>工作日 9:00-18:00</div>'
                 +        '</div>'
                 +    '</div>'
                 +    '<div class="service-fankui border-bottom">'
                 +        '<div class="service-fankui-title"><i class="gm-icon gm-question"></i>问题反馈与咨询</div>'
                 +        '<div class="service-fankui-content">'
                 +            '<div class="content-left w65">客服QQ：</div>'
                 +            '<div class="content-right w215">'
                 +                '<div>2850726015<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=2850726015&site=qq&menu=yes"><i class="gm-icon gm-qq3 ml10"></i></a></div>'
                 +                '<div>2850726006<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=2850726006&site=qq&menu=yes"><i class="gm-icon gm-qq3 ml10"></i></a></div>'
                 +            '</div>'
                 +            '<div class="content-left w65">客服热线：</div>'
                 +            '<div class="content-right w215">'
                 +                '<div>400-028-7828</div>'
                 +            '</div>'
                 +        '</div>'
                 +    '</div>'
                 +    '<div class="service-fankui border-bottom">'
                 +        '<div class="service-fankui-title"><i class="gm-icon gm-shakeHands"></i>商务推广与合作</div>'
                 +        '<div class="service-fankui-content">'
                 +            '<div class="content-left w60">张先生：</div>'
                 +            '<div class="content-right w215">139 8072 2340<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=2853220120&site=qq&menu=yes"><i class="gm-icon gm-qq3 ml10"></i></a></div>'
                 +            '<div class="content-left w60">何先生：</div>'
                 +            '<div class="content-right w215">139 8338 6742<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=2850726014&site=qq&menu=yes"><i class="gm-icon gm-qq3 ml10"></i></a></div>'
                 +        '</div>'
                 +    '</div>'
                 +    '<div class="service-saoyisao">'
                 +        '<div class="service-saoyisao-title"><i class="gm-icon gm-scanCode"></i>关注我们</div>'
                 +        '<div class="service-saoyisao-content">'
                 +            '<div class="content-left mr25">'
                 +                 '<img alt="港马微信" title="港马微信" src="'+WEB_STATIC+'/common/image/gmlinks/gm-weixin.png" />'
                 +                 '<div>港马微信</div>'
                 +            '</div>'
                 +            '<div class="content-right">'
                 +                 '<img alt="港马微博" title="港马微博" src="'+WEB_STATIC+'/common/image/gmlinks/gm-weibo.png" />'
                 +                 '<div>港马微博</div>'
                 +            '</div>'
                 +        '</div>'
                 +    '</div>'
                 +'</div>',
        lock: false,
        fixed: true,
        drag: true
    });
    return linkGmService;
}

$.fn.window=function(options){
	var content=$(this).html(),
		id=$(this).attr("id")+"_dialog";
		content=$(content).attr("id",id).prop('outerHTML');
		
	$.dialog({
		title:options.title||false,
            width: options.width||"auto",
            height: options.height||"auto",
            padding: 0,
            isOuterBoxShadow:false,
            init:function(){
                $(".aui_close").blur();
                options.init&&options.init();
            },
            content:content,
            lock: (options.lock==false?false:true),
            fixed: true,
            button:options.button||[{name:"取消",callback:function(){}}]
    });
};

$.fn.select=function(options){
    var _this=$(this);
    $.getJSON(options.api,function(json){
	
	var selected=_this.attr("data-value"),
	    optionsHtml="<option value=\"\">"+options.defaultText+"</option>"+$(json.area.items).map(function(){ return "<option value=\""+this.id+"\" "+((this.id==selected)?"selected":"")+">"+this.name+"</option>"}).get().join("");
	_this.html(optionsHtml);
	options.onInit&&options.onInit();
    });
    _this.change(function(){
	options.onSelect&&options.onSelect(_this.val());
    });
};

$.fn.countDown=function(options){
    return this.each(function() { 
        var startTime=options.startTime?new Date(options.startTime.replace(/\-/ig,"\/")).getTime():0,
            endTime=options.endTime?new Date(options.endTime.replace(/\-/ig,"\/")).getTime():0,
            leaveTime=options.leaveTime?options.leaveTime:(endTime-startTime)/1000,
            _this=$(this),
            format=options.format?options.format:"hh:mm:ss",
            h,
            m,
            s;
        var timer=setInterval(function(){
            leaveTime=leaveTime-1;
            h=parseInt(leaveTime/3600),
            m=parseInt((leaveTime-h*3600)/60),
            s=parseInt((leaveTime-h*3600)%60);
            
            h=(h>9?h:"0"+h);
            m=(m>9?m:"0"+m);
            s=(s>9?s:"0"+s);
            
        var text=(options.text||"")+" "+format.replace("hh",h).replace("mm",m).replace("ss",s)
            _this.attr("type")?_this.val(text):_this.text(text);
            if(leaveTime<=0){
        	(typeof options.onEnd=="function")&&options.onEnd(_this);
        	clearInterval(timer);
            }
        },1000);
    });
};

//showMsg
$.showMsg=function(msg,type){
	 type=type?type:"warning";
	 var tpl=$('<span class="common-tips btn btn-'+type+'" type="msg" style="visibility: hidden;z-index:999999;">'+
         		'<i class="gm-icon gm-info-remind"></i>'+msg+
         	'</span>');
	 if($(".common-tips[type=msg]").size()==0){
		$("body").append(tpl);
		tpl.css({"position":"fixed","top":"3px","left":"50%","margin-left":"-"+(tpl.outerWidth(true)/2)+"px"});
		tpl.css("visibility","visible");
		setTimeout(function(){tpl.fadeOut("slow",function(){tpl.remove();})},2000);
	 }
};