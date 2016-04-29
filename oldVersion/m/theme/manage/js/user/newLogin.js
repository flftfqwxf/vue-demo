
        var timeOut=null;
        /*计时60秒*/
        var interval = null;
        var fla=false;//标记是否点击过发送验证码

        var phone=$.trim($("#userName").val());      
        var register=false;
        var first=true;
        var locat=$("[name='login_type']").val();
       
        /*验证码计时*/
       var time=function(obj,n){
            n--;
            obj.text("已发送("+n+"s)");
        	fla=true;
            if (n>0) {
            	$("body").on("click",".J_getCode",function(){return;});
                clearInterval(interval);
                interval=setInterval(function(){time(obj,n)},1000);
            }else{
                obj.text("再次发送");
                fla=false;
                clearInterval(interval);
            }
            return fla;
        }
        //显示报错信息
        function showErro(msg){
            clearTimeout(timeOut);
        	$(".erro-group").show();
            $("#diy_Validform_checktip").text(msg);
            timeOut=setTimeout(function(){
            	$(".erro-group").hide();
            },1500);
        }

        //判断用户是否注册
        function checkRegister(phone,fn){
            var register=false;
	            $.ajax({
	                url: 'http://www.gmmtour.com/user/validate.json',
	                type: 'GET',
	                dataType: 'json',
	                data: {phone: phone}
	            })
	            .done(function(data) {
	                register=data.isExisted;
	                if(phone !="" && phone.length == 11){
	                    if(!register && $(".phoneL").is(":visible")){
	                        showErro("该手机号未注册");
	                        $("#userName").focus();
	                    }else if(!register && $(".userL").is(":visible")){
	                        showErro("该账号未注册");
	                        $("#userName").focus();
	                    }
	                }
	                fn(register);
	            })
	            .fail(function() {
	                alert("请求失败！");
	            })
	            .always(function() {
	            });
            return register;

        }
        //获取验证码
        function getCode(){
            clearTimeout(timeOut);
            phone=$.trim($("#userName").val());
            var shopName=$('[name="shopName"]').val();
            if(phone.length == 11){
            	checkRegister(phone,function(regs){
                	fla=true;
                    if(regs){
                       $.ajax({
                            url: 'http://www.gmmtour.com/sms/verifycode.json',
                            type: 'POST',
                            dataType: 'json',
                            data: {templateName: 'validate_login_code', phone:phone, 'model["distributorName"]':shopName, 'model["notUseGmPrefix"]':'true'},
                        }).done(function(data) {
                            if(data.result.success){
                                 time($(".J_getCode"),60);
                             }else{
                                 //返回错误信息
                                 showErro(data.result.message);
                                 time($(".J_getCode"),0);
                                 return;
                             }
                        }).fail(function() {
                            time($(".J_getCode"),0);
        	                alert("请求失败！请重试");
                            return;
                        });
                    }
                });    
                
            }else{
            	showErro("请先输入手机号");                 
                $("#userName").focus();
                return;    
            }
        }
        function userLogin(){
        	 var userlogin = $("#login_DIV").Validform({ 
             	tiptype:function(msg,o,cssctl){
                     if(msg != ""){
                     	cssctl($("#diy_Validform_checktip"),o.type);
                     	$("#diy_Validform_checktip").text(msg);
                     	$(".erro-group").show();
                         clearTimeout(timeOut);
                         timeOut=setTimeout(function(){
                         	$(".erro-group").hide();
                         },1500);
                     }
                 }
             });
        	$(".J_eye_pwd").click(function(){//查看密码
            	if(first){
            		$(this).removeClass("gm-eyes-o").addClass("gm-eyes");
            		document.getElementById("userPassword").type="text";
            		first=false;
            	}else{
            		$(this).removeClass("gm-eyes").addClass("gm-eyes-o");
            		document.getElementById("userPassword").type="password";
            		first=true;
            	}
            });
            $(".verify_show").click(function(){//点击验证码图片更换验证码
            	var url = '/login/verifycode?t='+Date.parse(new Date());
                $("#verify_show").find("img").remove();
                $("#verify_show").append('<img src="'+url+'" />');
            });
            $(".J_loginBtn").click(function(){//点击登录
                phone=$.trim($("#userName").val());
                checkRegister(phone,function(regs){
                    if(regs){
                    	 $("#login").attr("action","/login");
                    	$("#login").submit();
                    }
                });           
            });
        }
        
        
        function phoneLogin(){
        	 var phonelogin = $("#login_DIV").Validform({ 
             	tiptype:function(msg,o,cssctl){
                     if(msg != ""){
                     	cssctl($("#diy_Validform_checktip"),o.type);
                     	$("#diy_Validform_checktip").text(msg);
                     	$(".erro-group").show();
                         clearTimeout(timeOut);
                         timeOut=setTimeout(function(){
                         	$(".erro-group").hide();
                         },1500);
                     }
                 }
             });
        	 $(".J_getCode").click(function(){//获取验证码
             	if(fla==false){
             		getCode();
             	}
             });
             $("#userName").on("input",function (){
             	time($(".J_getCode"),0);
                 $(".J_getCode").text("点击获取");
             });
        	 $(".J_loginBtn").click(function(){//点击登录
                 phone=$.trim($("#userName").val());
                 checkRegister(phone,function(regs){
                     if(regs){
                     	 $("#login").attr("action","/login");
                     	$("#login").submit();
                     }
                 });           
             });
        }
        
    (function(){ 
        var $objtip=$("#diy_Validform_checktip");
        if(locat == "sms"){
            $("#login_DIV").append($("#phoneLogin").html());
            $(".J_phoneLogin").addClass("on");
            $(".J_userLogin").removeClass("on");
            phoneLogin();
        }else{
            $("#login_DIV").append($("#userLogin").html());
            userLogin();
        }
        
        $(".J_userLogin").click(function(){//注册用户登录
        	$("#login_DIV").find("form").remove();
        	$("#login_DIV").append($("#userLogin").html());
        	$(".J_userLogin").addClass("on");
        	$(".J_phoneLogin").removeClass("on");      
        	userLogin();
        });
        
        $(".J_phoneLogin").click(function(){//手机动态登录
            $("#login_DIV").find("form").remove();
            $("#login_DIV").append($("#phoneLogin").html());
            $(".J_phoneLogin").addClass("on");
            $(".J_userLogin").removeClass("on");
            phoneLogin();
        });

        if($.trim($("#diy_Validform_checktip").text()) != ""){
            clearTimeout(timeOut);
            $(".erro-group").show();
            timeOut=setTimeout(function(){
            	$(".erro-group").hide();
            },1500);
        }
    })();
   
    (function(){
        var h=$(window).height()-$(document.body).height();
        var foot=$("footer").height();
        var height=$(window).height()-111;
        if(h >= 0){
            $(".main").height(height);
        }
    })();