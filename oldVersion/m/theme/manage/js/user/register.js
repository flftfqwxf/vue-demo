function KeyDown(){
    var e = window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 13){
        e.returnValue=false;
        e.cancel = true;
        $(".J_loginBtn").click();
    }
}
 var timeOut=null;
 //显示报错信息
 function showErro(msg){
     clearTimeout(timeOut);
 	$(".erro-group").show();
     $("#diy_Validform_checktip").text(msg);
     timeOut=setTimeout(function(){
     	$(".erro-group").hide();
     },1500);
 }
$(function(){
	var objtip=$("#diy_Validform_checktip");
    var loginForm = $("#register").Validform({ 
    	tiptype:function(msg,o,cssctl){
            if(msg != ""){
            	$(".erro-group").show();
                cssctl(objtip,o.type);
                objtip.text(msg);
                clearTimeout(timeOut);
                timeOut=setTimeout(function(){
                	$(".erro-group").hide();
                },1500);
            }
        }
    });
    if($.trim(objtip.text()) != ""){
        clearTimeout(timeOut);
        $(".erro-group").show();
        timeOut=setTimeout(function(){
        	$(".erro-group").hide();
        },1500);
    }
    //查看密码
    var first=true;
    $(".J_eye_pwd").click(function(){
        if(first){
            $(this).removeClass("gm-eyes").addClass("gm-eyes-o");
            document.getElementById("userPassword").type="password";
            first=false;
        }else{
            $(this).removeClass("gm-eyes-o").addClass("gm-eyes");
            document.getElementById("userPassword").type="text";
            first=true;
        }
    });

   
    /*计时60秒*/
    var interval = null;
    var fla=false;//标记是否点击过发送验证码
    /*验证码计时*/
   var time=function(obj,n){
        n--;
        obj.text("已发送("+n+"s)");
        if (n>0) {
            clearInterval(interval);
            interval=setInterval(function(){time(obj,n)},1000);
        }else{
            obj.text("再次发送");
            obj.click(function(event) {return;});
            clearInterval(interval);
        }
    }
    $('body').on("input","#userPhone",function (){
            $("#userPhone").click(function(event) {return;});
             time($(".J_getCode"),0);
             $(".J_getCode").text("点击获取");
        });

    //发送验证码
    //获取手机动态验证码
    $(".J_getCode").click(function(){       
        var phone=$.trim($("#userPhone").val());
        var shopName=$('[name="shopName"]').val();
        if(phone ==""){
            showErro("请先输入手机号");           
            $("#userPhone").focus();
            return;
        }else{
            $.ajax({
                url: 'http://www.gmmtour.com/user/validate.json',
                type: 'GET',
                dataType: 'json',
                data: {phone: phone}
            })
            .done(function(data) {
                if(!data.isExisted){
                    $.ajax({
                        url: 'http://www.gmmtour.com/sms/verifycode.json?',
                        type: 'POST',
                        dataType: 'json',
                        data: {templateName: 'register_verify', phone:phone}
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
                            showErro("发送失败，请重试");
                            time($(".J_getCode"),0);
                            return;
                        });
                }else{
                    showErro("该手机号已注册");
                    $("#userPhone").focus();
                }
            })
            .fail(function() {
                
            });          
        }
    });
})
