;!function(controller) {
	//use strict
	'use strict';
	//设置、读取、修改url的参数方法 请勿删除
	function objURL(url){
				 var ourl=url||window.location.href;
				 var href="";//?前面部分
				 var params={};//url参数对象
				 var jing="";//#及后面部分
				 var init=function(){
				  var str=ourl;
				  var index=str.indexOf("#");
				  if(index>0){
				   jing=str.substr(index);
				   str=str.substring(0,index);
				  }
				  index=str.indexOf("?");
				  if(index>0){
				   href=str.substring(0,index);
				   str=str.substr(index+1);
				   var parts=str.split("&");
				   for(var i=0;i<parts.length;i++){
				    var kv=parts[i].split("=");
				    params[kv[0]]=kv[1];
				   }
				  }else{
				   href=ourl;
				   params={};
				  }
				 };
				 this.set=function(key,val){
				  params[key]=encodeURIComponent(val);

				 };
				 this.remove=function(key){
				  if(key in params) params[key]=undefined;
				 };
				 this.get=function(key){
				  return params[key];
				 };
				 this.url=function(key){
				  var strurl=href;
				        var objps=[];
				        for(var k in params){
				            if(params[k]){
				                objps.push(k+"="+params[k]);
				            }
				        }
				        if(objps.length>0){
				            strurl+="?"+objps.join("&");
				        }
				        if(jing.length>0){
				            strurl+=jing;
				        }
				        return strurl;
				 };
				 this.debug=function(){
				  // 以下调试代码自由设置
				  var objps=[];
				  for(var k in params){
				   objps.push(k+"="+params[k]);
				  }
				  alert(objps);//输出params的所有值
				 };
				 init();
				}
	controller.using(["jquery","tools","bootstrap","cookie","eValidate","template"]);
	controller.modules={
			init : function(){
			    
			    	//兼容性提示
			    	jSharp.using(["browser"]);
			    	
			    //登录、注册
				this.signIn();
				
				//图片处理
				this.imgHander();

				//事件
				this.event();
				
				//百度统计
			    this.statistics();
			    //初始化出发地
			    this.initDeparture();

			    //初始化目的地
			    //this.destinationCity();
				//ipsearch
				//this.ipSearch();
			},
			signIn:function(){
			    var validator;
			    $(document).on("click","[signin=login], [signin=register]",function(){
				var _this=$(this);
				$(".aui_state_focus,body>div[style]:last").hide();
				
				if(_this.attr("signin")=="login"){
				    //登录弹窗
				    if(_this.attr("page")=="newLogin"){
					$("#J-login").window({
					    title:false,
				            footer:false
					});
				    }
				    else{
					$("#J-login").window({
					     title:"用户登录",
					     footer:false
					});
				    }
				    
				    if($("[name=forward]").val()){
					var backUrl=$("[name=forward]").val(),
					    click="";
					$("form[signin=login-form] .open-login a").each(function(){
					    click=$(this).attr("onclick");
					    $(this).attr("onclick",click.replace("'+location.href;",backUrl+"';"));
					});
				    }
				    
				    
				}
				else{
				    //注册弹窗
				    $("#J-register").window({
					title:"新用户注册",
					footer:false
				    });
				}
				
				//验证
				validator=$("[signin=login-form]").eValidate({
				    submit:function(data,form){
					//提交时禁用按钮
					var btn=$("button[type!=button]:visible",form),
					    codeGroup,
					    img;
					btn.attr("disabled",true);
					
					if(_this.attr("signin")=="login"){
					    
					    codeGroup=$(".login-tab:visible .code-group",form),
					    img=$("img",codeGroup);
					    
    					     //登录提交
    					     $.post("/login.json",data,function(serverData){
    					        if(serverData.success){
    					            if($("[name=forward]").size()>0){
    					        	location.href=$("[name=forward]").val();
    					            }
    					            else{
    					        	if(_this.attr("ajax")!=undefined){
    					        	    $.showMsg("登录成功","success");
    					        	    $(".aui_close:visible").click();
    					        	    var phoneNumber="";
    					        	    if(serverData.loginUser&&serverData.loginUser.phone){
    					        		phoneNumber=serverData.loginUser.phone;
    					        		phoneNumber=phoneNumber.replace(phoneNumber.slice(3,7),"****");
    					        	    }
    					        	    $("#J-distributor-pc").html('<a href="/booking" class="login_hover"><span style="color:#999999;">您好!</span>&nbsp; '+phoneNumber+' </a> <a href="/logout" class="login_hover">退出</a> <a href="/order">我的订单</a>');
    					        	}
    					        	else{
    					        	    location.reload();
    					        	}
    					            }
    					        }
    					        else{
    						  if(serverData.showVerify){
    						      codeGroup.show();
    						      img.attr("src",img.attr("url")+"?"+Math.random());
    						  }
    						  $(".login-tab:visible .form-group:visible:last input:visible",form).showMsg(serverData.message);
    					        }
    					         btn.attr("disabled",false);
    					     }).error(function(){
    					         $.showMsg("登录失败，请刷新重试");
    					     });
					}
					else{
					    codeGroup=$(".code-group",form),
					    img=$("img",codeGroup);
					    
					    //注册提交
					    data["userPhone"]=data["userName"];
					    $.post("/register/customer.json",data,function(serverData){
					       if(serverData.success){
						  location.reload();
				               }
					       else{
						   $(".has-feedback-left:visible:last input:visible",form).showMsg(serverData.message);
				               }
					       btn.attr("disabled",false); 
					     }).error(function(){
					       $.showMsg("注册失败，请刷新重试");
				             });
					}
					return false;
				    }
				});
				
			    }).on("click",".login-wrap .login-nav>span",function(){
				//登录导航
				if(!$(this).hasClass("active")){
				    validator&&validator.resetForm();
    				    $(".login-wrap .login-nav>span").removeClass("active");
    				    $(this).addClass("active");
    				    $(".login-wrap .login-tab").hide().eq($(this).index()).show();
				}
			    }).on("click",".login-wrap .form-group img",function(){
				
				//刷新图片验证码
				$(this).attr("src",$(this).attr("url")+"?"+Math.random());
				
			    }).on("click","[signin=getSms]",function(){
				
				var phone=$("[signin=login-form] [name=userName]:visible"),
				    _this=$(this),
				    data={};
				
				data["format"]="jsonp";
				data["phone"]=phone.val();
				data["templateName"]=(_this.parents(".login-tab").size()>0?'validate_login_code':"register_verify");
				if(_this.parents(".login-tab").size()>0){
				    data['model["distributorName"]']=$("#shopName").val();
				    data['model["notUseGmPrefix"]']="true";
				}
	
				//获取手机短信
				if(validator.element(phone[0])){
				    $.ajax({
					  url: "http://www.gmmtour.com/sms/verifycode",
					  data: data,
					  dataType: "jsonp",
					  jsonp: "callback",
					  success: function(data){
						 if(data.result.success){
						     $.showMsg("短信发送成功，请注意查收","success");
						     //倒计时
						     _this.attr("disabled",true).countDown({
							    leaveTime:60,
							    defaultText:"60秒",
							    format:"ss秒",
							    onEnd:function(_this){
								_this.attr("disabled",false).text(_this.attr("text"));
							    }
						     });
						     
						 }else{
						    //返回错误信息
						    $.showMsg(data.result.message);
						 }
					  },    
					  error : function() {    
						 $.showMsg("验证码发送失败，请刷新页面重试");
					  }
				    });
				}
			    });
			},
			imgHander:function(){
				$("img[url]").each(function(){
					$(this).attr("src",$(this).attr("url"));
				});
			},
			statistics:function(){
					var url = window.location.href;
		    		//url = url.replace(/([^?]+[^/]).*/,"$1");
		    		//不能使用AJAX..跨域AJAX不会带上cookie
		    		var request = "http://www.gmmtour.com/statistics?url=" + url;
		    		var img = new Image();
		    		img.src = request;
			    	
		    		var telCount1=true,calendarCount1=true;
			    	//统计咨询点击次数代码
			    	function telCount(){
			    	   var request=encodeURIComponent(location.href.split('#')[0]+"/tel");
			    	   request="http://www.gmmtour.com/statistics?url="+request;
			    	   var img = new Image();
			    	   img.src = request;
			    	}
			    	//统计日历控件点击次数代码
			    	function calendarCount(){
			    	   var request=encodeURIComponent(location.href.split('#')[0]+"/calendar");
			    	   request="http://www.gmmtour.com/statistics?url="+request;
			    	   var img = new Image();
			    	   img.src = request;
			    	}
			    	
			    	/*统计点击日期的次数*/
		    	    $("#J-nCalendar").click(function(){
		    	        if(calendarCount1){
		    	            calendarCount();
		    	            calendarCount1=false;
		    	        }
		    	    });
		    	    /*统计咨询的次数*/
		    	    $(".cus-service").click(function(){
		    	        if(telCount1){
		    	            telCount();
		    	            telCount1=false;
		    	        }
		    	    });
			},
			initDeparture:function(){
				$.ajax({
					url: '/departure-place.json',
					type: 'get',
					dataType: 'json'
				})
				.done(function(result) {
					$(".J-set-out").attr("data-value",result.homeArea.id);
					$(".J-set-out .txt").text(result.homeArea.cnName);
					$(".city-dropdown").append(template("cityList",result));
				})
				.fail(function() {
				});
			},
			/*
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
									_dataValue = parseInt($(this).find(".city").attr('data-value'));
									if (remoteArea.id === _dataValue) {
										$(".J-set-out .txt").text($(this).find(".city").text());
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
			},*/
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
					_inputValue = $("input[name=keyword]").val(),
					_cityId = $(".J-set-out").attr("data-value"),
					_inputId = $("input[name=siteArea]").val();					
				if (_value !== _inputValue) {
					$("input[name=keyword]").val($(".J-search-txt").val());
					$("input[name=siteArea]").val($(".J-set-out").attr('data-value'));
					$("#form-search").submit();
				}
			},
			departureSearch:function(){
				var _value = $(".J-search-txt").val(),
					_inputValue = $("input[name=keyword]").val(),
					_cityId = $(".J-set-out").attr("data-value"),
					_inputId = $("input[name=siteArea]").val();
					var myurl=new objURL();
					myurl.set("siteArea",_inputId)
					var loct=myurl.url(),
					i=loct.indexOf('.com/?');
					if(i>0){
						loct=loct.replace('.com/?','.com?');
					}
					window.location.href = loct;
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
					$(".J-hot-city").hide();

				}).on('click', '.J-search-btn', function() {
					//搜索按钮点击事件
					var _value = $(".J-search-txt").val();
					if (_value) {
						i.search();
					}
					
				}).on('keydown', function(event) {
					//enter 的快捷键监听
					if(event.keyCode == 13){ 
						$(".J-search-btn").click();
					}
				})/*.on("click",".J-set-out",function(){
					//出发地下拉框
					if ($(".city-dropdown").hasClass("city-on")) {
						$(".J-set-out .fa").removeClass('fa-angle-up').addClass('fa-angle-down')
						$(".city-dropdown").removeClass("city-on");
					}else{
						$(".city-dropdown").addClass("city-on");
						$(".J-set-out .fa").removeClass('fa-angle-down').addClass('fa-angle-up')
					}
					
				})*/
				.on("mouseover",".city-dropdown",function(){
					//出发地下拉框
					$(".city-dropdown").addClass("city-on");
					$(".J-set-out .fa").removeClass('fa-angle-down').addClass('fa-angle-up')
					
				})
				.on("mouseout",".city-dropdown",function(){
					//出发地下拉框
					$(".J-set-out .fa").removeClass('fa-angle-up').addClass('fa-angle-down')
					$(".city-dropdown").removeClass("city-on");
					
				})
				.on('click', '.J-search-list .city', function() {
					//出发地选择
					var _txt = $(this).text(),
						_value = $(this).attr("data-value");
						_txt = _txt;
						$(".J-set-out .txt").text(_txt);
						$.cookie("name",_txt);
					$.cookie("id",_value);
					$(".J-set-out").attr("data-value",_value);
					$("input[name=siteArea]").val(_value);
					$(this).parents().removeClass("city-on");
					i.departureSearch();

				}).on('focus', '.J-search-txt', function() {
					//热门城市下拉框
					var keyword=$(this).val();
					if(!keyword){
						$(".J-hot-city").slideDown();
					}
					$(".J-search-list").removeClass("open");

				}).on('click', '.J-fa-close', function() {
					//input的值删除
					$(".J-search-txt").val("");
					$(this).hide();

				}).on('click', '.J-hot-close', function() {
					//热门城市下拉框关闭
					$(".J-hot-city").slideUp();

				}).on('click', '.J-city-con-right a,.J-search-city-ul a,.J-hot-destination a', function() {
					//热门城市下拉框，左侧栏城市选择，热门目的地的选择
					var _name = $(this).text();
					$(".J-search-txt").val(_name);
					$(".J-hot-city").slideUp();
					i.search();

				}).on('click', function(target) {
					//隐藏下拉框等等
					if($(target.target).parents(".search-input").size()==0){
						$(".J-hot-city").slideUp();
					}
					if ($(target.target).parents(".city-dropdown").size()==0) {
						$(".J-set-out .fa").removeClass('fa-angle-up').addClass('fa-angle-down')
						$(".city-dropdown").removeClass("city-on");
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
		    	}).on('mouseenter', '.J-search-city-ul li', function() {
		    		//左侧热门目的地的显示与边框处理
		    		$(this).find('.city-con-hover').show();
		    		$(this).prev().find(".city-con-box>div").css("border-color","transparent");
		    		$(this).find(".city-con-box>div").css("border-color","transparent");
		    	}).on('mouseleave', '.J-search-city-ul li', function() {
		    		//左侧热门目的地的隐藏与边框处理
		    		$(this).find('.city-con-hover').hide();
		    		$(this).prev().find(".city-con-box>div").css("border-color","#e0e1e2");
		    		$(this).find(".city-con-box>div").css("border-color","#e0e1e2");

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