/*设置页面最小高度*/
function setMinHeight(){
	var h=$(".page-content").height()-$(".sub-title").height()-$(".page-footer").height()-42;
	$(".product-list").css({"min-height":h+"px"});
}

/**
*展示订单详情
*/
function show(id,width) {
	$.dialog({
		title: '订单详情',
		minWidth:520,
		maxWidth:760,
		maxHeight:500,
		padding : '0px 20px',
		isOuterBoxShadow: false,
		isClose: true,
		content:$("#order_dialog")[0],
		lock: true,
		fixed: true,
		ok: false,
		cancel:false,
		init:function(){
			var self = this;

			$.getJSON("/booking/" + id, function(json) {
				self.content(template("show_booking", json));

				$(".aui_footer").hide();
				$(".aui_main").css({"padding-bottom":"20px","width":width+"px"});
			});
		}
	});
	
}


/**
*验证手机号
*/
function checkPhone(newPhone){
	/*验证合法手机的正则表达式*/
	var regex= /^0?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/;
	/*验证手机号是否合法*/
	var newPhone=$("#newPhone").val();
	var mes="";
	var flag=true;
	if(newPhone != ''){
		if(newPhone.length != 11){
			mes="请输入11位的手机号";
			flag=false;
		}
		if(!regex.test(newPhone)){
			mes="您输入的手机号有误，请重新输入";
			flag=false;
		}
	}
	if(newPhone == ""){
		mes="手机号不能为空";
		flag=false;
	}
	if(!flag){
		validationPhone($("#phone_mes"),$("#newPhone"),mes);
	}
	return flag;
}
/**
*显示提示信息
*/
function validationPhone(obj,input,mes){
	obj.find(".formErrorContent").text(mes);	
	obj.show();
	input.focus();
	setTimeout(function(){
		obj.fadeOut(1000);
	},800);
}

//检验验证码的长度和纯数字
function checkCode(code){
	var regex= /^[0-9]{6}$/;
	var flag=true;
	var mes="";
	if(code == ""){
		mes="验证码不能为空";
		flag=false;
	}
	if(code.length != 6){
		mes="请输入长度为6的验证码";
		flag=false;
	}
	if(!flag){
		validationPhone($("#code_mes"),$("#checkCode"),mes);
	}
	return flag;
}

/*禁止输入非数字*/
function keyNum(obj){
	obj.on("keyup",null,function(){
		obj.val(obj.val().replace(/\D/g,''));
	}).on("afterpaste",null,function(){
		obj.val(obj.val().replace(/\D/g,''));
	});
}/**
 * 发送验证码
 */

/*计时60秒*/
var interval = null;
var J_sendCode=$(".JsendCode");
var flag=false;//标记是否点击过发送验证码
/*验证码计时*/
time=function(obj,n){
	n--;
	obj.val("已发送（"+n+"s）");
	obj.attr("disabled","disabled")
	if (n>0) {
		clearInterval(interval);
		interval=setInterval(function(){time(obj,n)},1000);
	}else{
		obj.val("再次发送");
		obj.removeAttr("disabled");
		clearInterval(interval);
	}
}

//发送验证码
function sendCode(phone){
       flag=true;
	$.ajax({
		  type: "GET",
		  url: "http://www.gmmtour.com/sms/verifycode",
		  data:  { format : "jsonp", phone: $("#newPhone").val()  } ,//传递的参数新手机号
		  dataType: "jsonp",
		  jsonp: "callback",
		  success: function(data){
			 $(".JsendCode").removeAttr("disabled");
			 if(data.result.success){
				 time(J_sendCode,60);
				  //请求成功
				 $.gmMessage("验证码发送成功，请注意查收！",true);
			 }else{
				 //返回错误信息
				 $.gmMessage(data.result.message,false);
				 time(J_sendCode,0);
				 return;
			 }
		  },    
		  error : function() {    
			  time(J_sendCode,0);
			  return;
		  } 
	});
}
//设置手机号接收短信
function setNewPhone(requestUrl){
	$("#JsetPhone").click(function(){
		var phoneInfo = $.dialog({
			title: '设置接收短信的手机号',
			width: 500,
			padding : '5px',
			isOuterBoxShadow: false,
			isClose: true,
			content:$("#setPhone_dialog")[0],
			lock: true,
			fixed: true,
			button: [
			         {
			        	 name: '取消',
			        	 className: 'btn-default',
			        	 callback: function () {
			        		 if(!flag){
			        			 $(".JsendCode").val("发送短信验证码");
			        		 }
			        		 else{
			        			 time(J_sendCode,0);
			        		 }
			        		 $("#setPhone_dialog").find("input[type=text]").each(function(){
			        			 $(this).val("");
			        		 }); 
			        		 phoneInfo.close();
			        	 }
			         },
			         {
			        	 name: '确认提交',
			        	 className: 'btn-process',
			        	 callback: function () {
			        		 if(!flag){
			        			 $(".JsendCode").val("发送短信验证码");
			        		 }
			        		 else{
			        			 time(J_sendCode,0);
			        		 }
			        		 var code=checkCode($("#checkCode").val());
			        		 var phone=checkPhone($("#newPhone").val());
			        		 if(phone && code){
			        			 //设置手机号
			        			 $.ajax({
			        				 type: 'POST',
			        				 url: requestUrl,//请求的url
			        				 data: {format : "json", noticePhone: $("#newPhone").val(),verifyCode:$("#checkCode").val()},//传递的参数新手机号
			        				 dataType: 'json',
			        				 success: function(data){
			        					 if(data.result.success){
			        						 //修改手机号成功
			        						 $.gmMessage("修改成功",true);
			        						 $("#currentPhone").text($("#newPhone").val());
			        						 $("#setPhone_dialog").find("input[type=text]").each(function(){
			        							 $(this).val("");
			        						 });
			        						 setTimeout(function(){
			        						     location.reload();
			        						 },1500);
			        					 }else{
			        						 $.gmMessage(data.result.message,false);
			        						 return false;
			        					 }
			        				 },    
			        				 error : function() {    
			        					 //修改手机号失败
			        					 $.gmMessage("修改失败");
			        					 return false;
			        				 } 
			        			 });
			        		 }
			        		 return false;
			        	 },
			        	 focus: true
			         }
			         ],
			         cancel:false,
			         ok:false,
			         init:function(){
			        	 $(".aui_footer").show();
			         }
		});
		
		//点击发送验证码
		$(".JsendCode").click(function(){
			var phone=$("#newPhone").val()
			var check=checkPhone(phone);
			if(check){
				sendCode(phone);
			}
		});
	});
}