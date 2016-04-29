$(function() {
	//初始化表单验证插件
	$form=$("#discountForm").validationEngine({
		validateNonVisibleFields : true,
		validationEventTrigger : "",
		showOneMessage : false,
		maxErrorsPerField : 1,
		promptPosition : "topLeft:0,6",
		scroll : true,
		scrollOffset : 20,
		autoHidePrompt : true,
		autoHideDelay : 1500,
		focusFirstField : true
	});
	//可用时间的开始时间与结束时间比较
	var dateresult=null;    //判断日期选择是否正确的全局变量
	var $startDate =$("#startTime").datetimepicker({ //开始时间
		showSecond: true,
	    timeFormat: 'hh:mm:ss',
	    language: 'zh-CN',
		onSelect  : function(){		
			var startDate = $startDate.datepicker('getDate');
			var endDate = $endDate.datepicker('getDate');
			if(endDate != null && endDate < startDate){
				dateresult=false;
				$("#startTime").validationEngine('showPrompt',"结束时间不能小于开始时间",'error',null,true);
				return false;
			}else{
				dateresult=true;
			}					
		}
	});
	var $endDate = $("#endTime").datetimepicker({ //结束时间
		showSecond: true,
	    timeFormat: 'hh:mm:ss',
	    language: 'zh-CN',
		onSelect  : function(){		
			var startDate = $startDate.datepicker('getDate');
			var endDate = $endDate.datepicker('getDate');
			if(startDate != null && endDate < startDate){
				dateresult=false;
				$("#endTime").validationEngine('showPrompt',"结束时间不能小于开始时间",'error',null,true);
				return false;
			}else{
				dateresult=true;
			}
		}	
	});
	//显示时间
	var $showDate = $("#showTime").datetimepicker({ 
		showSecond: true,
	    timeFormat: 'hh:mm:ss',
	    language: 'zh-CN'	
	});
	//公用模块
	var textarVal=$(".textar").val();
	var common={
		init:function(){
           
		},
		isValid:function(){
			var flag = $form.validationEngine('validate');
			if(window.Placeholders && !Placeholders.nativeSupport){
				Placeholders.disable($("#discountForm"));
			};				
			if(window.Placeholders && !Placeholders.nativeSupport){
				Placeholders.enable($("#discountForm"));
			};
			if(flag && dateresult===false){
                $("#endTime").validationEngine('showPrompt',"结束时间不能小于开始时间",'error',null,true).focus();   //日期判断
                flag=false;
			};
			var reg=/^[0-9]\d*([.][1-9])?$/; //验证浮点数	
			var b=$(".favor").eq(1).val(); //减（优惠金额）		
			if(flag){//优惠金额
				var a=$(".favor").eq(0).val(); //满								
				if(!reg.test(a)){
                   $(".favor").eq(0).validationEngine('showPrompt',"请输入正整数或者小数位一位的小数",'error',null,true).focus();
                   flag=false;
				};
				if(!reg.test(b)){
                   $(".favor").eq(1).validationEngine('showPrompt',"请输入正整数或者小数位一位的小数",'error',null,true).focus();
                   flag=false;
				};
				if(parseFloat(a)<=parseFloat(b)){
                   $(".favor").eq(1).validationEngine('showPrompt',"订单价至少大于优惠0.1元",'error',null,true).focus();
                   flag=false;
				};
			};
			if(flag){//优惠承担方
				var c=$(".favor_bear").eq(0).val(); //分销商
				var e=$(".favor_bear").eq(1).val(); //供应商
				var f=$(".favor_bear").eq(2).val(); //港马
				if(c!=="" && !reg.test(c)){
					$(".favor_bear").eq(0).validationEngine('showPrompt',"请输入正整数或者小数位一位的小数",'error',null,true).focus();
                    flag=false;
				};
				if(e!=="" && !reg.test(e)){
					$(".favor_bear").eq(1).validationEngine('showPrompt',"请输入正整数或者小数位一位的小数",'error',null,true).focus();
                    flag=false;
				};
				if(f!=="" && !reg.test(f)){
					$(".favor_bear").eq(2).validationEngine('showPrompt',"请输入正整数或者小数位一位的小数",'error',null,true).focus();
                    flag=false;
				};
                var price=0;
				$(".favor_bear").each(function(){
					if($(this).val()!=="" && $(this).val()!==undefined){
                      price=price+parseFloat($(this).val());
                   }
				});
				if(parseFloat(price)!==parseFloat(b)){
                  $(".favor_bear").eq(0).validationEngine('showPrompt',"优惠金额和优惠承担方的总金额不相等",'error',null,true).focus();
                  flag=false;
				};

			};
			if(flag){ //适用产品，强制点击确认。（拦截）
               if(common.arr(textarVal).toString()!==common.arr($(".textar").val()).toString()){
                  $("#apply_btn").click();  
                  //拦截后判断是否符合规则                
               }

			}

			return flag;

		},
		arr:function(obj){
            var proIdArr=obj.replace(/\r/ig,",").replace(/\n/ig,",").trim().split(","); 
            var newarr=[];           
            for(var i=0,a=proIdArr.length;i<a;i++){
            	if(proIdArr[i] !== "" &&  proIdArr[i] !== undefined){
                   newarr.push(proIdArr[i]); 
	            }
            }
            return newarr;
		}


	}
	common.init();
	//适用产品测试假数据
	var json={
		result:[
		  {a:"回电话哈哈哈哈哈哈哈哈哈哈哈哈",b:"跟团游",c:"零上20度"},
		  {a:"回电话哈哈哈哈哈哈哈哈哈哈哈哈",b:"跟团游",c:"零上20度"},
		  {a:"回电话哈哈哈哈哈哈哈哈哈哈哈哈",b:"跟团游",c:"零上20度"},
		  {a:"回电话哈哈哈哈哈哈哈哈哈哈哈哈",b:"跟团游",c:"零上20度"},
		  {a:"回电话哈哈哈哈哈哈哈哈哈哈哈哈",b:"跟团游",c:"零上20度"},
		  {a:"回电话哈哈哈哈哈哈哈哈哈哈哈哈",b:"跟团游",c:"零上20度"},
		  {a:"回电话哈哈哈哈哈哈哈哈哈哈哈哈",b:"跟团游",c:"零上20度"},
		]
	}
	//适用产品
	$("#apply_btn").on("click",function(){
		alert(1);
		var str=$(".textar").val();
		if(str){
		   var b=common.arr(str);
		   $.ajax({
	        	url:"1111111",
				type:"GET",
				async:false,			
				dataType:"json",
				success:function(json){
					if(json){
                      //调模板
					}   
				},
				error:function(){
					// alert("错误");
					$(".result_box").html(template("result",json))
				}
            })

		}else{
           alert("请填写ID")
		}		
	})

	//其他配置-关联专题验证编号的有效性
	$('.special_num').on('input propertychange', function() {
		var _self=$(this);
		var regs=/^[1-9]\d*$/;
		var special_num=_self.val();
	    if(regs.test(special_num)){
	    	$.ajax({
	        	url:"1111111",
				type:"GET",
				async:false,			
				dataType:"json",
				success:function(json){
					if(json){
                      _self.validationEngine('showPrompt',"✔编号有效",'pass',null,true); //编号有效时的提示
					}   
				},
				error:function(){
					// alert("错误");
					
				}
            })
	    }else{
	    	_self.validationEngine('showPrompt',"请输入正确格式的专题编号",'success',null,true);
	    }
	});

	// 创建优惠券
	$("#creat").on("click",function(){	
		var valid=common.isValid();		
		if(valid){
			$.confirm("开始发放后，优惠券将不能修改<br/>是否确认创建？","确认提示",function(){
				
                $("#discountForm").submit();
			},function(){
				//取消
			})
		}
		return valid;		
	})



	

})