$("#J-withdraw").click(function(){
    	if($(this).attr("bank")=="true"){
    	    	$(".aui_footer").parent().show();
        	$("#J-withdraw-dialog").window({
        		title:"提现",
        		 width:480,
        		 init:function(){
        		     $(".JsendCode").click(function(){
        			 var _this=$(this);
        			 $.ajax({
        			     url:"http://www.gmmtour.com/sms/verifycode.json?templateName=withdraw_apply&phone="+$("#J-mobile-number").text(),
        			     type:"get",
        			     dataType:"json",
        			     success:function(serverData){
        				 if(serverData.result&&serverData.result.success){
                				 _this.val("60秒").attr("disabled",true);
                        			 _this.countDown({
                        			     leaveTime:60,
                        			     format:"ss秒",
                        			     onEnd:function(){
                        				 _this.val("获取验证码");
                        				 _this.attr("disabled",false);
                        			     }
                        			 });
        				 }
        				 else{
        				     $.showMsg(serverData.result.message,"danger");
        				 }
        			     },
        			     error:function(){
        				 $.showMsg("短信发送失败","danger");
        			     }
        			 })
        		     });
        		 },
        		 button:[
        		       {
        			     name:"取消"
        		       },
        		       {
        		         name:"确认提现",
        		         className: 'btn-process',
        		         callback:function(){
        		             var code=$.trim($("#checkCode").val());
        		             if(code&&/^[0-9]{6}$/.test(code)){
        		        	$(".aui_buttons .btn-process").attr("disabled",true);
        		        	$.ajax({
        		        	    url:"/account/withdrawal.json",
        		        	    data:{smsCode:code},
        		        	    type:"post",
        		        	    dataType:"json",
        		        	    success:function(serverData){
        		        		if(serverData&&serverData.isSuccess){
        		        		    $(".dialog-form").hide();
                        		            $(".withdraw-success").show();
                        		            $(".aui_footer").parent().hide();
                        		            setTimeout(function(){
                   		        		 window.location.href=window.location.href;
                   		        	    },2000);
        		        		}
        		        		else{
        		        		    $.showMsg(serverData.msg,"danger");
        		        		    setTimeout(function(){
                		        		 $(".aui_buttons .btn-process").attr("disabled",false);
                		        	    },500);
        		        		}
        		        		
        		        	    },
        		        	    error:function(){
        		        		setTimeout(function(){
        		        		    $(".aui_buttons .btn-process").attr("disabled",false);
        		        		},500);
        		        		
        		        	    }
        		        	});
        		             }
        		             else if(!code){
        		        	 $.showMsg("请输入短信验证码","danger");
        		             }
        		             else{
        		        	 $.showMsg("请输入长度为6的验证码","danger");
        		             }
        		             return false;
        		         }
        		       }
        		  ]
        	 });
    	}
    	else{
    	    $.dialog({
    		title:"提现",
                width: 400,
                height: 100,
                padding: 0,
                isOuterBoxShadow:false,
                init:function(){
                    $(".aui_close").blur();
                },
                content:"您尚未设置结款账户",
                lock:true,
                fixed: true,
                button:[{
                    name:"去设置",
                    className: 'btn-process',
                    callback: function() {
                	window.location.href="/account/bank";
                    }
                }]
    	    });
    	}
});

//导出功能
$("#J-export").click(function(){
    window.location.href="/account/bill?format=xls&page=1&size=2000&startCreateTime="+$("#J-startDate").val()+"&endCreateTime="+$("#J-endDate").val();
});