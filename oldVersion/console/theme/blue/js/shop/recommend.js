var maxlen = 20;
var checkupdate = true;
var update = false;
$(function(){
		if(message!="" && message!="null"){
			$.gmMessage(message,false);
		}
		
		var columntype = $("input[name=columntype]").val();
		var type_index = 2;
		if(columntype==""){
			var recommendValue = $("input[name=recommendValue]");
			var r_value = recommendValue.val();
			var arr = r_value.split("#");
			if(arr.length>3){
				r_value = arr[0]+"#"+arr[1]+"#"+arr[2]+"#"+arr[arr.length-1];
				type_index = arr[arr.length-1];
			}
			recommendValue.val(r_value);
		}else{
			if(columntype==0 || columntype==1 || columntype==2){
				type_index = columntype;
			}
		}
		
	
		//tab event
		$("#J-recommend-setting .recommend-right a").click(function(){
			// if(!$("#validateform").validationEngine('validate')){
			// 	return false;
			// }
			getActiveType().removeClass("active");
			$(this).addClass("active");
			
			var item=$(".recommend-right ul").hide().eq($(this).index()),
				data={},
				index=0,
				typeName="";
			
			$("li",item).each(function(){
				if($(this).attr("picurl")&&$(this).attr("title")){
					data.picurl=$(this).attr("picurl");
					data.title=$(this).attr("title");
					index=$(this).index();
					return false;
				}
			});

			item.show();
			preview(data,index,getActiveType().text());
		});
		
	
		//主页图片
		$("input[name=input-value]").each(function(){
			var target = $(this);
			$(this).on("keyup",null,function(){
				$(this).val($(this).val().replace(/\D/g,''));
			}).on("afterpaste",null,function(){
				$(this).val($(this).val().replace(/\D/g,''));
			}).on("change",function(){
			})
			});
		
	
		$(".checkvalid").each(function(i){
			if($(this).find(".query_warning").html()){
				type_index = (($(".checkvalid").length-1)-i);
				return false;
			}
		});
		
		//第一次进入触发tab第一项显示左边预览
		getActiveType(type_index+"").click();
		
		//确定按钮
		$(".check-btn").click(function(){
			var input=$(this).prev(),
				item=$(this).parents("li"),
				title=$(this).parents("li").find("h4"),
				index=$(this).parents("li").index();
				checkProdcutImage(input);
		});
		
		$("#validateform").validationEngine({
			validateNonVisibleFields : true,
			validationEventTrigger : "",
			showOneMessage : false,
			maxErrorsPerField : 1,
			promptPosition : "topRight:2,0",
			scroll : true,
			scrollOffset : 100,
			autoHidePrompt : true,
			autoHideDelay : 2000,
			focusFirstField : true
		});

		$("#submitbtn").on("click",null,function(){
			var ul=$(".recommend-right ul");
			setTimeout(function(){
				for(var i=0;i<ul.size();i++){
					if($(".formError",ul.eq(i)).size()>0){
						$(".recommend-right h3 a").eq(i).click();
						break;
					}
				}
			},20);
		})

	});

function preview(data,index,type){
	index=index?index:0;
	if(type) $(".iphone h1").text(type);
	if(!data || (!data.picurl)||(!data.title)){
		$(".preview").hide();
		return;
	}
	$(".preview img").attr("src",data.picurl);
	$(".preview .title").text(data.title);
	$(".preview .index a").removeClass("active").eq(index).addClass("active");
	$(".preview").show();
}

function getActiveType(type){
	if(type){
		return $(".recommend-right a[type="+type+"]"); 
	}
	return $(".recommend-right a.active");
}
function checkProdcutImage(target,call){
	var value = target.val();
	var parent = target.parent().parent();
	var productIdInput = parent.find("input[data-name=productId]");
	var thisname = productIdInput.prop("name");
	var oldValue = productIdInput.val();
	var recommended_set_pv=target.parent().next(".recommended_set_pv").find("span");
	if(value!=""){
		var toset = true;
		/**
		var check_check = $("input[data-name=productId]");
		$.each(check_check,function(index,ele){
			if($(ele).prop("name") !=thisname  && $(ele).val()==value){
				toset = false;
				target.validationEngine('showPrompt',"该产品已设置",'error',null,true);
				target.val(oldValue);
				return false;
			}
		})**/
		if(toset){
			var id = value;
			var productNameInput= parent.find("input[data-name=productName]");
			var validInput= parent.find("input[data-name=valid]")
			var imageUrl= parent.find("input[data-name=imageUrl]")
			if(oldValue!=value){
				update = true;
				getProdcut(id,function(json){
					parent.find(".query_warning").remove();
					if(json.product){
						if (json.productValid && json.productValid==true) {
							var type = getActiveType().attr("type");
							var product = json.product;
							var region = product.touristLine.region;
							var lineId = product.touristLine.id;
							if(json.siteProductValid && json.siteProductValid ==true){
								var success = false;
								if(type=="0"){
									success = json.around;
								}else if(type=="1"){
									success = json.domestic;
								}else if(type=="2"){
									success = json.abroad;
								}
								if(success){
									recommended_set_pv.text(product.statistics.itemPageViewWeek+product.statistics.productPageViewWeek);     //微网站推荐设置pv数
									
									validInput.val("true");
									productIdInput.val(product.id);
									productNameInput.val(product.name);
									parent.removeClass("warning").removeClass("none");
									var productName = product.name;
									if(productName.length>maxlen){
										parent.find("h4").text(productName.substring(0,maxlen)+"...");
									}else{
										parent.find("h4").text(productName);
									}
									product.title = productName;
									product.picurl = product.coverImage.url;
									imageUrl.val(product.picurl);
									parent.attr("picurl",product.picurl).attr("title",productName);
									preview(product,target.attr("index"),getActiveType().text());
								}else{
									clearSetNoImage(parent,"产品无效,确认该产品是否是"+getActiveType().text()+"产品","warning")
								}
							}else{
								clearSetNoImage(parent,"产品无效，确认产品是否是该站点下产品","warning");
							}
						} else {
							clearSetNoImage(parent,"产品无效","warning")
						}
					}else{
						clearSetNoImage(parent,"产品不存在","none")
					}
					if(call){
						call()
					}
				
				},function(){
					clearSetNoImage(parent,"查询失败")
					if(call){
						call()
					}
				})
			}else if(oldValue!=""){
				 var data = {};
				 data.picurl= parent.attr("picurl");
				 data.title=parent.attr("title");
				 preview(data,target.attr("index"),getActiveType().text());
			}
		}
	}else{
		update = true;
		clearSetNoImage(parent,"")
	}
	target.blur();
}


function clearSetNoImage(parent,text,classname){
	parent.find(".set-input-value").val("");
	parent.attr("picurl","").attr("title","");
	parent.find(".query_warning").remove();
	if(text!=""){
		if(classname){
			parent.addClass(classname);
		}
		parent.find("h4").html(text);
	}else{
		if(classname){
			parent.removeClass(classname);
		}
		parent.find("h4").html("&nbsp;输入编号后产品名称将显示在这里");
	}
	preview(null,parent.find("input[name=input-value]").attr("index"),getActiveType().text());
}

function getProdcut(id,call,callError){
	$.ajax({
		url:"/recommend/site-product/"+id+"?format=json&m="+Math.random(),
		type:"GET",
		async:false,
		data:{siteId:$("#site").val()},
		dataType:"json",
		success:function(json){
			if(json.result && json.result.success !="undefined" && json.result.success==false && json.result.isReload==true){
				callError();
				$.gmMessage(json.result.message,false);
			}else{
				call(json);
			}
		},
		error:function(){
			callError();
		}
	})
}


function checkForm(){
	
	var form = $("#validateform");
	if (window.Placeholders && !Placeholders.nativeSupport) {
		Placeholders.disable( $("#validateform"));
	}
	var flag = form.validationEngine('validate');
	if (window.Placeholders && !Placeholders.nativeSupport) {
		Placeholders.enable( $("#validateform"));
	}
	
	var item =form.find (".itemlarge");
	var success = flag;
	if(success){
		$.each(item,function(index,element){
			var ele = $(element);
			var input = ele.find(".set-input-value");
			var thisinput = $(ele).find("input[name=input-value]");//当前input
			var noerror = true;
			$.each(input,function(index2,inputEle){
				var input_ele = $(inputEle);
				if(input_ele.val()=="" && thisinput.val()!=""){
					if(input_ele.attr("data-name")=="productId"){
						thisinput.validationEngine('showPrompt',"请设置产品信息",'error',null,true);
						noerror = false;
						return false;
					}
				}
			})
			if(!noerror){
				success = false;
			}
			return noerror;
		})
	}
	
	$("input[data-name=valid]").each(function(){
		if($(this).val()==""){
			$(this).val("true");
		}
	})
	
	if(success && checkupdate && update==false){
		//success = false;
		//$(".saveBtn").validationEngine('showPrompt',"当前没做任何修改",'error',null,true);
	}
	var type = getActiveType().attr("type");
	var recommendValue = $("input[name=recommendValue]");
	recommendValue.val(recommendValue.val()+"#"+type)
	$("input[name=success]").val($("input[name=success]").val()+"&type="+type);
	return success;
}