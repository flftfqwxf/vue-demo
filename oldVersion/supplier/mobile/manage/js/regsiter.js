$(function(){

	/* 创建更多资质 */
	$('.J_adddate').click(function(){
		var box = $('.j_form-boxzz');
		var boxlength = $('.form-box').find('.j_form-boxzz input').length;
		var _html ='<div class="form-dom">' 
						+'<input type="text" value="" data-value="" placeholder="如加盟了其他旅行社，请在这里输入旅行社名称" maxlength="50" id="J_aptitude" value="更多资质  如加盟了其他旅行社，请在这里输入旅行社名称" class="dom-input" name="certificates" class="input small-ipt Validform_error" datatype="*" nullmsg="" errormsg="">'
						+'<i class="close j_close"></i>'
						+'</div>'
		if(boxlength <=4 ){
			box.append(_html);	
			if(boxlength ==4){
				$(this).hide();
			}			
		}else{			
			$(this).hide();
		}
	})
	
	/* 删除资质 */
	$(".j_form-boxzz").on('click','.j_close',function(){
		var dom = $(this).parent();
		var iptLeng = $(".form-dom").find('input').length;		
		dom.remove();
		if(iptLeng >=2 ){
			$(".J_adddate").show();
		}
	});
	
	/* 检查地址 */
    function checkAddress(){
        $(".j_textauto").off().on('input',function(){
            checkAll();
        });
    }
    
    function checkCity(){
        $("#J_city").off().on('input',function(){
            checkAll();
        });
    }
    
    function checkTel(){
        $("#J_tel1").off().on('input',function(){
            checkAll();
        });
    }
    
    function checkCompany(){
        $("#J_companyname").off().on('input',function(){
            checkAll();
        });
    }

    function checkAll(){
        var $company = regform.check(true, $("#J_companyname"));
        var $Jtel = regform.check(true, $("#J_tel1"));
        var city = regform.check(true, $("#J_city"));       
        var textValid=true;
        var cityValid=true;
        textValid=regform.check(true, $('.j_textauto'));       
        if($company && textValid && $Jtel && city){
            $("#ensure").removeAttr("disabled");
            $("#ensure").css({"background":"#6599ff","border":"1px solid #6599FF"});
        }else{
            if(!$("#ensure").attr("disabled")){
                $("#ensure").attr("disabled","disabled");
                $("#ensure").css({"background":"#b6b7b7"})
            }
        }
    }
    checkAddress();
    checkCity();
    checkTel();
    checkCompany();
	$(".add-btn").on('click','.J_adddate1',function(){
		var box = $('.form-boxdz');
		var boxlength = $('.form-box').find('.form-boxdz textarea').length;
		var _html ='<div class="form-dom">' 
						+'<textarea type="text" value="" data-value="" placeholder="详细地址      必填" name="address" class="j_textauto textauto input small-ipt" datatype="*" nullmsg="" errormsg="" maxlength="100"></textarea>'
						+'<i class="close j_close"></i>'
						+'<div class="J_textMoni textMoni" contenteditable="true"></div>'
						+'</div>'
		if(boxlength <=4 ){
			box.append(_html);			
			$('#ensure').attr("disabled","disabled");
			$("#ensure").css({"background":"#b6b7b7"});

			if(boxlength ==4){
				$(this).hide();
			}
		}else{			
			$(this).hide();
		}
        checkAddress();
	})	
	
	$(".form-boxdz").on('click','.j_close',function(){
		var dom = $(this).parent();
		var addLeng = $(".form-dom").find('.j_textauto').length;		
		dom.remove();
		if(addLeng >=2 ){
			$(".J_adddate1").show();
		}
        checkAll();
	});
	
	$('.J_changeArear').click(function(){
		var side = $(".sendTc");
		var bodyH = $('body').height();
		side.animate({"left":'0'},'10000');
		$("#J_seleTc").show();
		$("#J_seleTc").css({'height':bodyH})		
		getArea();
	});
	
		
	$(".name-dl dt").click(function(){
		var value = $(this).attr('data-value');
		var ddHeight = $(".dl-item").height();
		if (value == 1 ){			
			$(this).parents('.dl-item').find('dd').css('display','block');
			$(this).attr('data-value', 2);
		}else {				
			$(this).parents('.dl-item').find('dd').css('display','none');				
			$(this).attr('data-value', 1);
		}
		$(this).parent().find("dd").show();
	});
	
	/* 返回 省  */
	$(".queyu-jiantou").click(function(){
		
		var cityDd = $(".name-dl dd").length;
		var sheng = $(".name-dl dt").length;
		if(cityDd){
			getArea();
		}else if(sheng){
			$("#J_seleTc").hide();
		};
		
	});
	
	/*$(".return_block").click(function() {
		if($("#registStep").val() == 2) {
			backRegistStep1();
		}
	});
	*/
	
	
	// 进入注册第二步
	function gotoRegistStep2() {
		$("#registStep").val(2);
		//$("#register-step1").hide();
		$("#smsInput").show();
		$(".next").find("span").text("2/3");
	}
	
	// 返回注册第一步
	function backRegistStep1() {
		$("#registStep").val(1);
		$("#smsInput").hide();
		$("#register-step1").show();
		$(".next").find("span").text("1/3");
	}
	
	 function getArea(id){
		 
		 var totalLength = hostArea['childrens'].length;
		 var totalChildrens = hostArea['childrens'];
		 //console.log(totalLength)
		 var shenName,cityName,str='',cn;
		 
		  for (var i = 0; i < totalLength; i++) {
			  shenName = totalChildrens[i].cn_name;
			  if(id && id==totalChildrens[i].id){
				  str+="<dt class='citydd bold' id='"+totalChildrens[i].id+"'>"+shenName+"</dt>";
				  for ( var item in  totalChildrens[i].childrens){
					  cn=totalChildrens[i].childrens[item];
					  str+="<dd class='citydd' cnName='"+cn.cn_name+"' cnId='"+cn.id+"'>"+cn.cn_name+"</dd>";
				}
				 
			  }else if(!id){
				  str+="<dt class='citydd' id='"+totalChildrens[i].id+"'>"+shenName+"</dt>";
			  }
	        	 
	       }
		  $(".name-dl").html(str);
		  bindArea();
		  
	 }
	 
	 //事件绑定
	 function bindArea(){
		 $(".name-dl dt").off().on('click',function(){
			 var $this=$(this);
			 getArea($this.attr('id'));			 
			 $(".name-dl dt").css({'position':'fixed','top':'36px','width':'100%','background-color':'#D5D5D5'});			 
		 });
		 $(".name-dl dd").off().on('click',function(){			 
			 var PraAddr = $(this).parent(".name-dl").find("dt").html();
			 var $this=$(this);
			 var nameTxt = $(this).html();		 
			 var side = $(".sendTc");			 
			 //console.log(PraAddr);
				//side.animate({"right":'-1000'},'10000');
			 //$(this).show();
			 $("#J_city").val(PraAddr+nameTxt);		
			 $("#areaId").val($(this).attr("cnid"));			 	 	
			 $('#J_seleTc').hide();
			 checkAll();
		 });
	 }
	 
	 /* 滚动 */
	 function onScroll() {
		
		scrollTimer = setTimeout(function() {				
			var scrollTop = $(window).scrollTop();
			var windowHeight = $(window).height();
			fix($(".sendTc-box .title"));
		},400);
	}
	$(window).on("scroll", onScroll);
	 
	 function fix(obj){
		 obj.addClass("fix");
	 }	 

	 
	 var regform = $("#J_register").Validform({
			tiptype:function(msg,o,cssctl){
				if(!o.obj.is("form")){//验证表单元素时o.obj为该表单元素，全部验证通过提交表单时o.obj为该表单对象;
					var objtip=o.obj.parent().next(".Validform_checktip");
					cssctl(objtip,o.type);
					objtip.text(msg);
				}
			}
		});
		
		regform.addRule([
      			{
      				ele:"#J_tel",
      				datatype:"m",
      				nullmsg:"请输入11位数字",	
      				errormsg:"请输入11位数字"
      			},
      			{
      				ele:"#J_tel1",
      				datatype:"m",
      				nullmsg:"请输入手机号",	
      				errormsg:"请输入11到20位字符"
      			},
      			{
      				ele:"#J_psw",
      				datatype:"*6-15",
      				nullmsg:"请设置一个密码",
      				errormsg:"请输入密码最少6位，最多15位"
      			},
      			{
      				ele:"#J_yanzeng",
      				datatype:"*4-6",
      				nullmsg:"请输入验证码",				
      				errormsg:"验证码输入错误"
      			},
      			{
      				ele:"#J_companyname",
      				datatype:"*",
      				nullmsg:"请输入公司名字"
      			},
      			{
      				ele:".j_textauto",
      				datatype:"*",
      				nullmsg:"请填写地址"
      			},
      			{
      				ele:"#J_city",
      				datatype:"*",
      				nullmsg:"请选择城市"
      			}
     	]);
	
	/* 检查电话号码 */	
	$("#J_tel").on('input',function(){
		var checkTel = regform.check(false, $("#J_tel"));
		var checkPwd = regform.check(true, $("#J_psw"));
		if(checkTel && checkPwd){
			$("#submit_btn").removeAttr("disabled");
			//$("#submit_btn").css({"background":"#e23738"})
		}else{
			if(!$("#submit_btn").attr("disabled")){
				$("#submit_btn").attr("disabled","disabled");
				$("#submit_btn").css({"background":"#b6b7b7"})
			}
		}
	});
    function checkShow(isChcecked) {
        if(isChcecked){
            $("#submit_btn").removeAttr("disabled");
            $("#submit_btn").css({"background":"#6599ff","border":"1px solid #6599FF"});
        }else{
            //console.log($("#submit_btn").attr("disabled"))
            if(!$("#submit_btn").attr("disabled")){
                $("#submit_btn").attr("disabled","disabled");
                $("#submit_btn").css({"background":"#b6b7b7"})
            }
        }
    }

    /* 检查密码 */
	$("#J_psw").on('input',function(){
		var checkTel = regform.check(true, $("#J_tel"));
		var checkPwd = regform.check(false, $("#J_psw"));
        checkShow(checkTel && checkPwd);
	});
	
	/* 检查验证码 */
	$("#J_yanzeng").on('input',function(){
		var len = $(this).val().length;
		if(len==6){
			var J_yanzeng = regform.check(false, $("#J_yanzeng"));
			if(J_yanzeng){
				$("#J_larginput").removeAttr("disabled");
				$("#J_larginput").css({"background":"#6599ff","border":"1px solid #6599FF"});
			}else{		
				if(!$("#J_larginput").attr("disabled")){
					$("#J_larginput").attr("disabled","disabled");
					$("#J_larginput").css({"background":"#b6b7b7"})
				}
			}
		}else{
			$("#J_larginput").attr("disabled","disabled");
			$("#J_larginput").css({"background":"#b6b7b7"})
		}
	});
			
	$(".form-boxdz").on('keyup','.j_textauto',function(){
		var $txtMon = $(".form-boxdz .J_textMoni");
		var $txtMoniH = $(".form-boxdz .J_textMoni").height();
		var $cont = $(".form-boxdz .j_textauto");
		var $contVal = $cont.val();
		$txtMon.html($contVal);
		$cont.height($txtMoniH);
	});

	$("#gotoRegisterUser").click(function() {
		var checkTel = regform.check(false, $("#J_tel"));
		var checkPwd = regform.check(false, $("#J_psw"));
		if(checkTel && checkPwd){
			$(".J_larginput").css("background","#fff")
			$('#J_register').submit();
		}
	});
	
	$("#gotoRegisterDistributor").click(function() {
		var checkCode = regform.check(false, $("#J_yanzeng"));
		if(checkCode) {
			$('#J_register').submit();
		}
	});

	var wait = 60,
		yzval = $(".yanzhan-tipsbox");
		/* 手机验证码 */
		$(".J_sendCode").on('click',function(){			
			var phone = $("#userPhone").val();
			if(phone == '' || phone == undefined) {
				alert("手机号码不能为空");
				return;
			}
			sendVerifycode(phone);
			time(this);			
			$(this).parents(".form-input").find(".code-box").show();
			yzval.text("请点击'发送验证码'按钮进行验证");
			$('.j_checkphone').hide();
			$("#J_yanzeng").removeAttr("disabled");
		});
	function time(btn) {
		if (wait == 0) {			
			btn.value = "重新发送";
			$('.J_sendCode').removeAttr("disabled");
			wait = 60;
		} else {		
			btn.value = "重新发送"+wait;
			wait--;
			setTimeout(function () {
				time(btn);				
			},
			1000)
		}
	}
	
	function sendVerifycode(phone) {
		$.ajax({
    		url : '/message/verifycode?vd='+Date.parse(new Date()),
    		type:"POST",
    		dataType: "json",
    		data : {'phone': phone},
    		success : function(data){
    			if (typeof data === "string") {
    				data = eval('(' + data + ')');
    			}
    			$('.J_sendCode').attr("disabled",true);
    			alert(data.message);
    			$(".sendcode-notice").show();
    		},
    		error: function(){
    			alert("验证码发送失败，请稍后重试");
			}
    	});
	}
});
