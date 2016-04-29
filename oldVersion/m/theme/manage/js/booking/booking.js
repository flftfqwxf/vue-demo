		/*隐藏提示信息*/	
		function warginInfo(obj){
			$(".order_item").removeClass("error");
			obj.parent().addClass("error");
			setTimeout(function(){
				$(".waring_info").hide();
				obj.focus();
			},1000);
		}
		/*判断是否含有中文*/
		function  isChina(s){  
	        var  index = escape(s).indexOf("%u");  
	        if(index < 0){return false;}else{return true;}  
	    }  
		//表单验证
		function checkForm(){
			var name="";
			var phone="";
			var cus_date="";
			var num="";
			var flag=false;
			name=$("#user_name").val();
			phone=$("#phone").val();
			cus_date=$("#departure_date").val();
			/*验证手机号是否合法*/
			var regex= /^0?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/;
			if(phone!="" && !regex.test(phone)){
				$(".waring_desc").html("您的手机号有误，请重新输入");
				$(".waring_info").show();
				warginInfo($("#phone"));
				flag= false;
			}
			if(phone==""){
				$(".waring_desc").html("手机号不能为空");
				$(".waring_info").show();
				warginInfo($("#phone"));
				flag= false;
			}
			if(name =="" || !isChina(name)){
				$(".waring_desc").html("请输入正确的姓名");
				$(".waring_info").show();
				warginInfo($("#user_name"));
				flag= false;
			}
			if(cus_date==""){
				$(".waring_desc").html("出发时间不能为空");
				$(".waring_info").show();
				warginInfo($("#departure_date1"));
				flag= false;
			}
			if(cus_date != '' && isChina(name) && regex.test(phone)){
				flag=true;
			}
			return flag;
		}
		
		$(function(){
			$(".btn_ok").click(function(){
				$(".message_info").hide();
			});
			$("#departure_date1").click(function(){
				$("#order_form").attr("action","/booking/date");
				$("#order_form").submit();
			});
			
			$("#user_price").click(function(){
				$("#order_form").attr("action","/booking/date");
				$("#order_form").submit();
			});
			
			$(".btn_ok").click(function(){
				$(".message_info").hide();
			});
			var $desc=$("textarea[name='remark']");
			$desc.keyup(function(){
				var le=$(this).val().length;
				$(".tips").text("还剩"+(200-le)+"字可输入");
				if(le==200){
					return false;
				}
			});
			
			$("#submit_btn").click(function(){
				var fl=checkForm();
				if(!fl){
					return false;
				}
				if(fl){
					$("#order_form").submit();
					$("#submit_btn").attr("disabled","disabled");  
				}
			});
			
		})