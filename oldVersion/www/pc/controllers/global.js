;
!function(controller) {
    //use strict
    'use strict';

    if(document.getElementById("J-login-mark")){
	return false;
    }
    
    controller.using("jquery");
    controller.using("bootstrap");

    controller.modules = {
	init : function() {
	    
	   //兼容性提示
	   jSharp.using(["browser"]);
	    	
	    //图片处理
	    this.imgHander();

	    //header处理
	    this.headerHander();

	    //百度统计
	    this.statistics();

	    //事件
	    this.event();

	    this.globalError();
	},
	/**
	 * [globalError description] 全局报错提示
	 * @return {[type]} [description]
	 */
	globalError:function(){
		if ($.trim($(".global-error p").find("span").text()) !== "") {
			$(".global-error").fadeIn();
			setTimeout(function(){
				$(".global-error").fadeOut();
			},2000);
		};
	},
	imgHander : function() {
	    $("img[url]").each(function() {
		$(this).attr("src", $(this).attr("url"));
	    });
	},
	headerHander : function() {
	    $(".pull-right").mouseenter(function() {
		$('.dropdown-menu').parent().addClass("open");
	    }).mouseleave(function() {
		$('.dropdown-menu').parent().removeClass("open");
	    });
	},
	statistics : function() {
	    $(function() {
		var url = window.location.href;
		//url = url.replace(/([^?]+[^/]).*/,"$1");
		//不能使用AJAX..跨域AJAX不会带上cookie
		var request = "http://www.gmmtour.com/statistics?url=" + url;
		var img = new Image();
		img.src = request;
	    });
	},
	event : function() {
	    var i = this;

	    $(document).on("click", "a.tips-but-close", function() {
		$("#show-not-login").slideUp("slow");
	    }).on("click", ".p-service, .linkGmService", function() {
		i.gmService();
	    });

	    $(".linkGmQrcode")
		    .hover(
			    function() {
				var html = '<div class="weixinImg"><img class="logo-img left" src="http://static.gmmtour.com/common/image/gmlinks/gm-weixin.png" /></div>';
				$(".linkGmQrcode").parent().append(html);
			    }, function() {
				$(".weixinImg").remove();
			    });
	},
	gmService : function() {
	    var content = $('<div id=\"J-linksGmService\"><div class="linksGmService">'
		    + '<div class="service-date border-bottom">'
		    + '<div class="service-date-title"><i class="gm-icon gm-times"></i>服务时间</div>'
		    + '<div class="service-date-content">'
		    + '<div>工作日 9:00-18:00</div>'
		    + '</div>'
		    + '</div>'
		    + '<div class="service-fankui border-bottom">'
		    + '<div class="service-fankui-title"><i class="gm-icon gm-question"></i>问题反馈与咨询</div>'
		    + '<div class="service-fankui-content">'
		    + '<div class="content-left w65">客服QQ：</div>'
		    + '<div class="content-right w215">'
		    + '<div>2850726015<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=2850726015&site=qq&menu=yes"><i class="gm-icon gm-qq3 ml10"></i></a></div>'
		    + '<div>2850726006<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=2850726006&site=qq&menu=yes"><i class="gm-icon gm-qq3 ml10"></i></a></div>'
		    + '</div>'
		    + '<div class="content-left w65">客服热线：</div>'
		    + '<div class="content-right w215">'
		    + '<div>400-028-7828</div>'
		    + '</div>'
		    + '</div>'
		    + '</div>'
		    + '<div class="service-fankui border-bottom">'
		    + '<div class="service-fankui-title"><i class="gm-icon gm-shakeHands"></i>商务推广与合作</div>'
		    + '<div class="service-fankui-content">'
		    + '<div class="content-left w60">张先生：</div>'
		    + '<div class="content-right w215">139 8072 2340<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=2853220120&site=qq&menu=yes"><i class="gm-icon gm-qq3 ml10"></i></a></div>'
		    + '<div class="content-left w60">何先生：</div>'
		    + '<div class="content-right w215">139 8338 6742<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=2850726014&site=qq&menu=yes"><i class="gm-icon gm-qq3 ml10"></i></a></div>'
		    + '</div>'
		    + '</div>'
		    + '<div class="service-saoyisao">'
		    + '<div class="service-saoyisao-title"><i class="gm-icon gm-scanCode"></i>关注我们</div>'
		    + '<div class="service-saoyisao-content">'
		    + '<div class="content-left mr25">'
		    + '<img alt="港马微信" title="港马微信" src="'
		    + WEB_STATIC
		    + '/common/image/gmlinks/gm-weixin.png" />'
		    + '<div>港马微信</div>'
		    + '</div>'
		    + '<div class="content-right">'
		    + '<img alt="港马微博" title="港马微博" src="'
		    + WEB_STATIC
		    + '/common/image/gmlinks/gm-weibo.png" />'
		    + '<div>港马微博</div>'
		    + '</div>'
		    + '</div>'
		    + '</div>'
		    + '</div></div>');

	    content.window({
		title : "联系港马",
		width : "auto",
		footer : false,
		lock : false
	    });
	}
    };

    controller.call();

}(new this.jSharp.controller());