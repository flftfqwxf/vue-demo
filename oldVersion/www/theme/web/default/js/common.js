$(function(){
	$("#nav-list li").click(function(){
		$(this).addClass("selected").siblings().removeClass("selected");
	});
	
	$(".pull-right").mouseenter(function(){
		$('.dropdown-menu').parent().addClass("open");
	}).mouseleave(function(){
		$('.dropdown-menu').parent().removeClass("open");	
	});	
	
	$(document).find(".linkGmService").unbind("click");
	$(document).on("click" , ".linkGmService", function(){
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
            init: function(here){
                api = this;
                wrap = api.DOM.wrap;
                //$(".aui_titleBar",wrap).parent().parent().remove();
                wrap.find('.aui_inner').css({
                    'border':'none',
                    '-moz-border-radius':'5px',
                    '-webkit-border-radius':'5px',
                    'border-radius':'5px'
                });
                //$(".aui_footer",wrap).remove();
                wrap.find('.aui_main').css({
                    'padding-top': '0px'
                });
                wrap.find('.aui_content').css({
                    'margin': '-3px',
                    'border':'4px solid #fff',
                    '-moz-border-radius':'5px',
                    '-webkit-border-radius':'5px',
                    'border-radius':'5px'
                });
                wrap.find('.aui_outer').css({
                    'box-shadow': '0px 0px 10px rgba(2, 37, 69, .6)'
                });
                wrap.find('.aui_close').css({
                    'top': '5px',
                    'right': '16px'
                });
            },
            close: function(){
            	wrap.find('.aui_inner').removeAttr("style");
            	wrap.find('.aui_main').removeAttr("style");
            	wrap.find('.aui_content').removeAttr("style");
            	wrap.find('.aui_outer').removeAttr("style");
            	wrap.find('.aui_close').removeAttr("style");
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
                +                '<div>028-65100023</div>'
                +                '<div>028-65100051</div>'
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
                +                 '<img alt="港马微信" title="港马微信" src="http://static.gmmtour.com/common/image/gmlinks/gm-weixin.png" />'
                +                 '<div>港马微信</div>'
                +            '</div>'
                +            '<div class="content-right">'
                +                 '<img alt="港马微博" title="港马微博" src="http://static.gmmtour.com/common/image/gmlinks/gm-weibo.png" />'
                +                 '<div>港马微博</div>'
                +            '</div>'
                +        '</div>'
                +    '</div>'
                +'</div>',
            lock: false,
            fixed: true,
            drag: true
        });
	});
	/*港马二维码*/
	$(document).on("hover" , ".linkGmQrcode", function(){
		var html='<div class="weixinImg"><img class="logo-img left" src="http://static.gmmtour.com/common/image/gmlinks/gm-weixin.png" /></div>';
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
/*头部导航*/
$(function(){
	
	//未登录时弹窗关闭事件
	$(".tips-but-close").click(function(){
		$("#show-not-login").animate({bottom:-$("#show-not-login").height()}, 500, function(){
			$("#show-not-login").css({bottom:0}).hide();
		});
	});
	
	/*登录注册切换背景和字体颜色*/
	$(".registerBtn").bind("mouseover",function(){
		$(".registerBtn").addClass("btn-active");
	}).bind("mouseout",function(){
		$(".registerBtn").removeClass("btn-active");
	});
	$(".loginBtn").bind("mouseover",function(){
		$(".loginBtn").addClass("btn-active");
	}).bind("mouseout",function(){
		$(".loginBtn").removeClass("btn-active");
	});
	$(".user").mouseover(function(){
		$(".downBtn").addClass("hidden");
		$(".downUpBtn").removeClass("hidden");
		$(".choice").removeClass("hidden");
		$('.block').hide() ; 
	});
	$(".user").mouseout(function(){
		$(".downUpBtn").addClass("hidden");
		$(".downBtn").removeClass("hidden");
		$(".choice").addClass("hidden");
	});

	var user=$(".login-user2").text();
	var time;
	if($.cookie("time"+user)==null){
		$.cookie("time"+user,0);
	}
	if($.cookie("time"+user)!=null){
		time=0;
		if(!$.cookie("time"+user).isNaN){
			time=parseInt($.cookie("time"+user));
		}
		var div=$(".block");
		if(time<5){
			$(".block").show();
			div.animate({left:'-20px',top:'200px'},"slow");
			div.animate({left:'-20px',top:'-16px'},"slow");
		}
		if(time>=5) {
			$(".block").hide();
		}
		time=parseInt(time+1);
		$.cookie('time'+user,time);
	}
});