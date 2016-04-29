$(function(){
   /* 初始化验证框架  */
	$form=$("#defaultForm").validationEngine({
		validateNonVisibleFields : true,
		validationEventTrigger : "",
		showOneMessage : false,
		maxErrorsPerField : 1,
		promptPosition : "topLeft:0,6",
		scroll : true,
		scrollOffset : 100,
		autoHidePrompt : true,
		autoHideDelay : 1000,
		focusFirstField : true
	});
	
    var arrTwo=new Array();  //存二维数组
    var result=true;
	var common={
		init:function(){
            this.drawAjax();
		},
		drawAjax:function(){
			$.ajax({
				url:"/redpacket/default.json",
				type:"get",
				async:false,
				dataType:"json",
				success:function(json){
					if(json){
						console.log(json)
                       $(".ruleBox").append(template("ruleList_draw",json));
                       common.arrPush();
					}
					common.countdraw();
				},
				erro:function(){
                    alert("错误");
				}
		    })
		},
		countdraw:function(){ //页面加载时百分比计算
			$(".J_per").each(function(){
				common.count($(this));
			});
		},
		itemSort:function(){
			$(".ruleList").not(".del").each(function(index){
                $(this).find(".items").find("span").html(index+1);			
			});
		},
		isValid:function(){			
			var flag = $form.validationEngine('validate');
			if (window.Placeholders && !Placeholders.nativeSupport) {
				Placeholders.disable($("#defaultForm"));
			};				
			if (window.Placeholders && !Placeholders.nativeSupport) {
				Placeholders.enable($("#defaultForm"));
			};
			if(flag){
				var reg=/^[1-9]\d*$/;
				$(".priceStart").not(".del").each(function(){
					var _self=$(this);
					if(!reg.test(_self.val())){
                        _self.validationEngine('showPrompt',"请输入不小于1的正整数",'error',null,true);
                        flag=false;
					};
				});
				$(".priceEnd").not(".del").each(function(){
					var _self=$(this);
					if(!reg.test(_self.val())){
                        _self.validationEngine('showPrompt',"请输入不小于1的正整数",'error',null,true);
                        flag=false;
					};
				});
			};
			if(flag){
				$(".priceStart").not(".del").each(function(){//结束值必须大于开始值					
					if(parseInt($(this).val())>parseInt($(this).siblings(".priceEnd").val()) || parseInt($(this).val())===parseInt($(this).siblings(".priceEnd").val())){
						$(this).validationEngine('showPrompt',"开始值必须小于结束值",'error',null,true).focus();
						flag=false;
					};
				});
			};
            var judge=common.sectionmax();
			if(flag && !judge){
				$(".myTips").css("opacity","1");
				setTimeout(function(){
					$(".myTips").css("opacity","0");
				},1000)
				flag=false;		
			}
			return flag;
		},
		count:function(obj){//SMALL INPUT 百分比计算方法
			var _self=obj;
			var a=_self.parent("li").parent("ul").find("li:first").find(".priceStart");
			var b=_self.parent("li").parent("ul").find("li:first").find(".priceEnd");
			if(a.val()!=="" && a.val()!==undefined && b.val()!=="" && b.val()!==undefined){
				var regs=/^([1-9]\d|\d)*$/;
				if(regs.test(_self.val()) && _self.val()<=99){
					var c=_self.val()/100;
					var d=Math.round(c*a.val());
					var e=Math.round(c*b.val());
		            _self.parent("li").find(".redStart").html(d);
		            _self.parent("li").find(".redEnd").html(e);
				}else{
				   _self.validationEngine('showPrompt',"请输入0-99整数",'error',null,true);	
				};						
			}else{
	           a.validationEngine('showPrompt',"请先补齐区间价格",'error',null,true);
			};
		},
		arrPush:function(){//页面加载完成后，将所有的开始值和结束值push到二维数组。	
		    arrTwo.length=0
			$(".ruleList").each(function(){
				if(!$(this).is(":hidden")){
					var arr=new Array(); 
					var startVal=$(this).find(".priceStart").val(); 
					var endVal=$(this).find(".priceEnd").val();   
					if(endVal!=="" && endVal!==undefined && startVal!=="" && startVal!==undefined){
	                    arr.push(startVal);	
	                    arr.push(endVal);
	                    arrTwo.push(arr);					
					};
				}								
			});
		},
		compare:function(val1,val2,index,obj){//价格区间不可重复
			var sign=true;
			var q=val1;
			var w=val2;
			var cachearrTwo=arrTwo.concat();		
            cachearrTwo.splice(index,1);
			var arrcom=new Array();
			arrcom.push(parseInt(q));
			arrcom.push(parseInt(w));
			for(var j=0;j<cachearrTwo.length;j++){				
                if(arrcom[0]>=cachearrTwo[j][0] && arrcom[1]<=cachearrTwo[j][1]){
                   // common.message(obj);
                   sign=false;
                }else if(arrcom[0]>=cachearrTwo[j][0] && arrcom[0]<=cachearrTwo[j][1]){
                   // common.message(obj);
                   sign=false;
                }else if(arrcom[1]>=cachearrTwo[j][0] && arrcom[1]<=cachearrTwo[j][1]){
                   // common.message(obj);
                   sign=false;
                }else if(arrcom[0]<=cachearrTwo[j][0] && arrcom[1]>=cachearrTwo[j][1]){
                   // common.message(obj);
                   sign=false;
                };
                if(sign===false){
                   break;
                }
			};
			return sign;			
		},
		message:function(obj){
             obj.validationEngine('showPrompt',"价格区间不可重合",'error',null,true).focus();
		},
		order:function(){  //排序赋值
            $(".ruleList").each(function(index){
				// $(this).find(".grouphidden").attr("name","rules["+index+"].id").val();//id
				$(this).find(".groupdel").attr("name","rules["+index+"].deleted"); //是否删除
				$(this).find(".groupmin").attr("name","rules["+index+"].details[0].type").val("PRODUCT_MIN_PRICE"); //最小值type
				$(this).find(".priceStart").attr("name","rules["+index+"].details[0].content"); //最小值
				$(this).find(".groupmax").attr("name","rules["+index+"].details[1].type").val("PRODUCT_MAX_PRICE"); //最大值type
				$(this).find(".priceEnd").attr("name","rules["+index+"].details[1].content"); //最大值
				$(this).find(".J_per").eq(0).attr("name","rules["+index+"].deductionPercentage"); //下单可用红包
				$(this).find(".J_per").eq(1).attr("name","rules["+index+"].rebatePercentage"); //下单赠送红包                
			});
		},
		sectionmax:function(){ //提交时验证是否有价格区间重复
			var result=true;
			common.arrPush();
			$(".ruleList").not(".del").each(function(index){
                var priceStart=$(this).find(".priceStart").val();
                var priceEnd=$(this).find(".priceEnd").val();
                result=common.compare(priceStart,priceEnd,index,$(this));
                if(!result){
                   return false;
                }	               
			});
			return result;
		}
	};

	common.init();


	$(document).on("click",".save",function(){        
		common.order();//重新给表单排序赋值
		var valid = common.isValid();			
		if(valid){
			$("#defaultForm").submit();
		};
		return valid;
		
	}).on("click",".add",function(){//添加一条
		 $(".ruleBox").append(template("ruleList"));
         common.itemSort();

	}).on("click",".del",function(){
		var _self=$(this);
		if(_self.parent(".ruleList").hasClass("newAdd")){
           _self.parent(".ruleList").remove();
		}else{
	        _self.parent(".ruleList").find(".groupdel").val("true");
	        _self.parent(".ruleList").hide().addClass("del");
	        //取消元素上的验证
	        _self.parent(".ruleList").find(".priceStart").addClass("del").removeClass("validate[required,min[1],custom[number]]");
	        _self.parent(".ruleList").find(".priceEnd").addClass("del").removeClass("validate[required,custom[number]]");
	        _self.parent(".ruleList").find(".J_per").eq(0).addClass("del").removeClass("validate[required,min[0],max[99],custom[number]]");
	        _self.parent(".ruleList").find(".J_per").eq(0).addClass("del").removeClass("validate[required,min[0],max[99],custom[number]]");			
			common.arrPush(); //重新取数组
		};
		common.itemSort();

	}).on("input propertychange",".J_per",function(){ //百分比计算
		
		common.count($(this));
				
	}).on("input propertychange",".priceStart",function(){
        var _target=$(this);//百分比计算
        var l=_target.val();
        var g=_target.parent("li").parent("ul").find(".J_per").eq(0).val();
        var h=_target.parent("li").parent("ul").find(".J_per").eq(1).val();       
        if(g!=="" && g!==undefined){
        	var j=g/100;
        	_target.parent("li").parent("ul").find(".redStart").eq(0).html(Math.round(j*l)); 
        };
        if(h!=="" && h!==undefined){
        	var k=h/100;
        	_target.parent("li").parent("ul").find(".redStart").eq(1).html(Math.round(k*l));  
        };
        var r=_target.siblings(".priceEnd").val(); //开始值和结束值得比较
		if(parseInt(_target.val())>parseInt(r) || parseInt(_target.val())===parseInt(r)){
           _target.validationEngine('showPrompt',"开始值必须小于结束值",'error',null,true);
		};     
	}).on("input propertychange",".priceEnd",function(){
        var _target=$(this);//百分比计算
        var l=_target.val();
        var g=_target.parent("li").parent("ul").find(".J_per").eq(0).val();
        var h=_target.parent("li").parent("ul").find(".J_per").eq(1).val();       
        if(g!=="" && g!==undefined){
        	var j=g/100;
        	_target.parent("li").parent("ul").find(".redEnd").eq(0).html(Math.round(j*l)); 
        };
        if(h!=="" && h!==undefined){
        	var k=h/100;
        	_target.parent("li").parent("ul").find(".redEnd").eq(1).html(Math.round(k*l));  
        };
        var r=_target.siblings(".priceStart").val(); //开始值和结束值得比较
        if(parseInt(_target.val())<parseInt(r) || parseInt(_target.val())===parseInt(r)){
           _target.validationEngine('showPrompt',"开始值必须小于结束值",'error',null,true);
		};                 
	})


})