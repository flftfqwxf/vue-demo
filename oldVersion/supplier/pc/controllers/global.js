;!function(controller) {
	//use strict
	'use strict';
	
	controller.using(["jquery","bootstrap","cookie"]);
	controller.modules={
			init : function(){
			    	//兼容性提示
			    	jSharp.using(["browser"]);
			    	
				//图片处理
				this.imgHander();

				//事件
				this.event();

				//ipsearch
				this.ipSearch();
				this.out();
			},
			//退出登录URL拼接
			out:function(){
		        var a=$(".login_hover");				
				var b=a.attr("href")&&a.attr("href").split("?")[0];
				var c=b+"?from="+window.location.href;
				a.attr("href",c);
			},
			imgHander:function(){
				$("img[url]").each(function(){
					$(this).attr("src",$(this).attr("url"));
				});
			},
			ipSearch:function(){
				var i = this;
				if((!$.cookie("id"))&&(!$.cookie("name"))){
					$.ajax({
						type:"get",
						url:"http://www.gmmtour.com/area/ip.json",
						dataType:"json",
						success:function(data){
							var remoteArea = data.remoteArea,
								isCdRange = data.isCdRange;
							if (data.remoteArea) {
								var _dataValue;
								$(".J-search-list li").each(function(){
									_dataValue = parseInt($(this).find("a").attr('data-value'));
									if (remoteArea.id === _dataValue) {
										$(".J-set-out .txt").text($(this).find("a").text());
										$(".J-set-out").attr('data-value', _dataValue);
									}
								})
							}
						}
					});
				}
				else{
					$(".J-set-out .txt").text($.cookie("name"));
					$(".J-set-out").attr('data-value', $.cookie("id"));
				}
				i.ipvalue();
			},
			ipvalue:function(){
				//judge cd ip
				var _dataValue = parseInt($(".J-set-out").attr('data-value'));
				if (_dataValue === 2294) {
					/*$(".J-not-cd-ip").hide();*/
					$(".J-cd-ip").show();
				}else{
					/*$(".J-not-cd-ip").show();*/
					$(".J-cd-ip").hide();
				}
			},
			search:function(){
				var _value = $(".J-search-txt").val(),
					_inputValue = $("input[name=keyWord]").val(),
					_idValue = $(".J-set-out").attr("data-value"),
					_departurePlaceId = $("input[name=departurePlaceId]").val();
				if (_value !== "") {
					if (_value !== _inputValue||_idValue !== _departurePlaceId) {
						$("input[name=keyWord]").val(_value);
						$("input[name=departurePlaceId]").val(_idValue);
						$("#form-search").submit();
					}
				}
			},
			event:function(){
				var i=this,
					inputValue,
		    		goTop = $(".J-scroll-top");
				$(document).on("click","a.tips-but-close",function(){
					$("#show-not-login").slideUp("slow");

				}).on("click",".p-service, .linkGmService",function(){
					i.gmService();

				}).on('keyup', '.J-search-txt', function() {
					//循环input是否有值
					clearTimeout(inputValue);
					inputValue = setTimeout(function(){
						var _value = $(".J-search-txt").val();
						if (_value){
							$(".J-fa-close").show();
						}else{
							$(".J-fa-close").hide();
						}
					},300);

				}).on('click', '.J-search-btn', function() {
					//搜索按钮点击事件
					i.search();

				}).on('keydown', function(event) {
					//enter 的快捷键监听
					if(event.keyCode == 13){ 
						$(".J-search-btn").click();
					}
				}).on("click",".J-set-out",function(){
					//出发地下拉框
					if ($(".J-search-list").hasClass("open")) {
						$(".J-search-list").removeClass("open");
					}else{
						$(".J-search-list").addClass("open");
					}
					
				}).on('click', '.J-search-list li', function() {
					//出发地选择
					var _txt = $(this).text(),
						_value = $(this).find("a").attr("data-value");
					if (_txt === "全部出发地") {
						$(".J-set-out .txt").text(_txt);
						$.cookie("name",_txt);
					}else{
						_txt = _txt+"出发";
						$(".J-set-out .txt").text(_txt);
						$.cookie("name",_txt);
					}
					$.cookie("id",_value);
					$(".J-set-out").attr("data-value",_value);
					$(this).parents().removeClass("open");
					i.ipvalue();

				}).on('click', '.J-fa-close', function() {
					//input的值删除
					$(".J-search-txt").val("");
					$(this).hide();

				}).on('click', function(target) {
					//隐藏出发地选择
					if ($(target.target).parents(".city-dropdown").size()==0) {
						$(".J-search-list").removeClass('open');
					}
					
				}).scroll(function(){
		    		var scrollTop=$(window).scrollTop();
		    		//go to top btn
		    		if(scrollTop>250){
		    			goTop.fadeIn(300);
		    		}
		    		else{
		    			goTop.hide();
		    		}
		    	}).on('click', '.J-scroll-top', function() {
		    		//回到顶部
		    		$("html,body").animate({scrollTop:0},400,function(){
			    		goTop.hide();
			    	});
		    	});
		    	$(window).resize(function(){
		    		//resize事件
		    		var winW=$(window).width();
		    		$(window).trigger("scroll");
		    		$(".J-go-top").css("right",(winW/2-660+"px"));
		    		$(".J-go-top").show();
		    	}).resize();

				$(".linkGmQrcode").hover(function(){
					var html='<div class="weixinImg"><img class="logo-img left" src="http://static.gmmtour.com/common/image/gmlinks/gm-weixin.png" /></div>';
					$(".linkGmQrcode").parent().append(html);
				},function(){
					$(".weixinImg").remove();
				});
			},
			gmService:function(){
				var content=$('<div id=\"J-linksGmService\"><div class="linksGmService">'
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
					+                 '<img alt="港马微信" title="港马微信" src="/common/image/gmlinks/gm-weixin.png" />'
					+                 '<div>港马微信</div>'
					+            '</div>'
					+            '<div class="content-right">'
					+                 '<img alt="港马微博" title="港马微博" src="/common/image/gmlinks/gm-weibo.png" />'
					+                 '<div>港马微博</div>'
					+            '</div>'
					+        '</div>'
					+    '</div>'
					+'</div></div>');

				content.window({
					title:"联系港马",
					width:"auto",
					footer:false,
					lock:false
				});
			}
	};
	
	controller.call();

}(new this.jSharp.controller());