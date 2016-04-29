var target = null;
var first = true;
var update = false;
var defaultUrl = WEB_STATIC_DISTRIBUTOR + "/theme/manage/blue/images/blank.png";
var maxlen = 20;
var checkupdate = false;
var maxrecommend = 20;
var drag = false;
$(function(){
	if(message!="" && message!="null"){
		$.gmMessage(message,false);
	}
	
	$(document.body).on("keydown",null,function(e){
		if(e.keyCode==13){
			e.returnValue=false;
			return false;
		}
	})
	
	$(".changeImg").each(function(){
		$(this).on("click",null,function(){
			var $this = $(this);
			target = $(this).parent();
			var lineId = target.find("input[data-name=lineId]").val();
			$("#lineObj").val(lineId);
			var disabled = $(this).hasClass("disabled");
			if(first==true && !disabled){
				$("input[name=gmbutton]").gmgallery({
					showUploadBut:true,
					showUserUploadList:true,
					url : '/gallery/search.json',
					selfListUrl:"/gallery/uploaded.json?format=json&queryType=d_sitebg",
					multiSelect:false,
					touristLineId:'',
					touristLineObj:$("#lineObj"),
					imageType:"d_sitebg",
					operateType:"other_image",
					options_id:new Date().getTime(),
					mainPageImage:"modifyMainIamge",
					onOk:function(response){
						if(response && target){
							update = true;
							changeValid(target);
							target.parent().find(".pro_img").find(".set_pro_img").prop("src",response.url+"@180w_302h")
							target.parent().find(".pro_img").find(".img_notice").text("");
							target.find("input[data-name=imageUrl]").val(response.url);
							target.parent().find(".changeImg").text("更改图片");
						}
				},zIndex:'900999'})
			}
			if(lineId!="0" && !disabled){
					$("input[name=gmbutton]").click();
					$(this).blur();
			}
		})
	})
	var noImageEvent=function(target){
		target.focus(function(){
			target.parent().find(".query_warning").remove();
			var $this = target;
			//target.parent().parent().parent().parent().find(".del_pro").removeClass("delhide");
			target.parent().css({"box-shadow":"2px 2px 2px grey"});
			var len=target.parent().find(".query_pro").length;
			if(len==0){
				target.parent().append($(".query_template").html());
				target.parent().find(".query_pro").click(function(){
					checkProdcutNoImage(target,function(){
						setTimeout(function(){
							target.parent().find(".query_loading").remove();
						},100)
					});
				});
			}
		}).blur(function(){
			target.parent().css({"box-shadow":"none"});
		}).on("keyup",null,function(){
			target.val($(this).val().replace(/\D/g,''));
			$(this).parent().parent().removeClass("warning").removeClass("none");
		}).on("afterpaste",null,function(){
			target.val($(this).val().replace(/\D/g,''));
		});;
	
	}
	$(".pro_text_noimage input").each(function(){
		noImageEvent($(this));
	});
	

	//拖动排序
    $(".edit_pro .pro_list").sortable({cursor:"move",stop:function(){
    	update = true;
    	drag = true;
    	//编号
    	number();
    }});
	$("#list_name").change(function(){
		var val=$.trim($(this).val());
		update = true;
		if(val!=''){
			$(".list_title").text($(this).val());
		}else{
			$(this).val("当季热卖");
			$(".list_title").text("当季热卖");
		}
	});
	
	/** **/
	var pro_length=$("li.pro_item").length;
	if(pro_length==maxrecommend){
		$(".add_pro").hide();
	}
	
	$(".del_pro").each(function(){
		if($(".del_pro").length==1){
			$(".del_pro").hide();
		}if($(".del_pro").length!=1){
			$(".del_pro").show();
		}
		$(this).click(function(){
			$(this).parent().remove();
			pro_length=$("li.pro_item").length;
			if(pro_length==1){
				console.log("remove_class");
				$(".pro_item:eq(0)").find("input[name=noimageinput]").removeClass("validate[required]");
			}
			if(pro_length<maxrecommend){
				$(".add_pro").show();
			}
			//编号
			number();
		});		
	});
	if($(".del_pro").length==1){
		$(".del_pro").hide();
	}
	$(".add_pro").click(function(){		   	
		$(".pro_list").append($("#pro_item").html());
		$(".pro_text_noimage input").each(function(){
			noImageEvent($(this));
		});
		setListName();
		//编号
		number();
		if($(".del_pro").length==1){
			$(".del_pro").hide();
		}
		if($(".del_pro").length!=1){
			$(".del_pro").show();
		}
		$(".del_pro").each(function(){
			$(this).click(function(){
				if($(".del_pro").length!=1){
					$(".del_pro").show();
					$(this).parent().remove();
					if($(".del_pro").length==1){
						$(".del_pro").hide();
					}
					pro_length=$("li.pro_item").length;
					if(pro_length==1){
						$(".pro_item:eq(0)").find("input[name=noimageinput]").removeClass("validate[required]");
					}
					if(pro_length<maxrecommend){
						$(".add_pro").show();
					}
				}else{
					$(".del_pro").hide();
				}
				//编号
				number();
			});
		});
		
		pro_length=$("li.pro_item").length;
		if(pro_length>1){
			$(".pro_item").each(function(){
				console.log("add_class");
				var input = $(this).find("input[name=noimageinput]");
				if(input.hasClass("validate[required]")==false){
					input.addClass("validate[required]");
				}
			})
		}else if(pro_length==1){
			$(".pro_item:eq(0)").find("input[name=noimageinput]").removeClass("validate[required]");
		}
		if(pro_length==maxrecommend){
			$(".add_pro").hide();
		}
	});
	
	
	//主页图片
	$(".pro_text_image").find("input").each(function(){
		var target = $(this);
		$(this).focus(function(){
			target.parent().find(".query_warning").remove();
			var $this = $(this);
			$(this).parent().css({"box-shadow":"2px 2px 2px grey"});
			var len=$(this).parent().find(".query_pro").length;
			if(len==0){
				$(this).parent().append($(".query_template").html());
				$(this).parent().find(".query_pro").click(function(){
					checkProdcutImage(target,function(){
							setTimeout(function(){
								target.parent().find(".query_loading").remove();
							},100)
						});
					
				});
			}
		}).blur(function(){
			$(this).parent().css({"box-shadow":"none"});
			//if($.trim($(this).val())==""){
			//	$(this).parent().find(".query_pro").remove();
			//}
		}).on("keyup",null,function(){
			$(this).val($(this).val().replace(/\D/g,''));
			$(this).parent().parent().removeClass("warning").removeClass("none");
		}).on("afterpaste",null,function(){
			$(this).val($(this).val().replace(/\D/g,''));
		});
		
		//$(this).change(function(){
		//	var val=$.trim($(this).val());
		//});
	});

	
	
	$("#validateform").validationEngine({
		validateNonVisibleFields : true,
		validationEventTrigger : "",
		showOneMessage : false,
		maxErrorsPerField : 1,
		promptPosition : "topRight:0,6",
		scroll : true,
		scrollOffset : 100,
		autoHidePrompt : true,
		autoHideDelay : 2000,
		focusFirstField : true
	});

	$("#savebtn").on("click",null,function(){
		$("#validateform").submit();
	})
	//编号
	number();	
})

function changeValid(target){
	//target.find(".input-data-valid:eq(0)").val("true");
	//if(target.hasClass("warning")){
	//	target.find(".input-data-valid:eq(0)").val("true");
	//}else{
	//	target.find(".input-data-valid:eq(0)").val("true");
	//}
}
function clearSet(parent,text,classname){
	parent.find(".set-input-value").val("");
	parent.parent().find(".pro_img").find(".set_pro_img").prop("src",defaultUrl);
	parent.parent().find(".pro_img").find(".img_notice").text("请添加图片");
	parent.removeClass("warning").removeClass("none");
	parent.parent().find(".changeImg").text("选择图片");
	if(text!=""){
		if(classname){
			parent.addClass(classname);
		}
		parent.find(".pro_name").text(text);
	}else{
		if(classname){
			parent.removeClass(classname);
		}
		parent.find(".pro_name").text("输入编号后产品名称将显示在这里");
	}
	parent.find(".changeImg").addClass("disabled");
	changeValid(parent);
}

function checkProdcutImage(target,call){
	var value = target.val();
	var parent = target.parent().parent();			 
	var productIdInput = parent.find("input[data-name=productId]");
	var thisname = productIdInput.prop("name");
	var oldValue = productIdInput.val();
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
			var lineInput = parent.find("input[data-name=lineId]");
			var imageUrlInput= parent.find("input[data-name=imageUrl]");
			var productNameInput= parent.find("input[data-name=productName]");
			var validInput= parent.find("input[data-name=valid]");
			var oldLineId = lineInput.val();
			if(oldValue!=value){
				update = true;
				target.parent().append($(".loading_template").html());
				target.parent().find(".query_pro").remove();
				getProdcut(id,function(json){
					if(json.product){
						var product = json.product;
						//console.log(product.product.deadline)
						if(product.available==true && product.onShelf==true && product.deadline==false){
							validInput.val("true");
							productIdInput.val(product.id);
							lineInput.val(product.touristLine.id);
							console.log(json.imageUrl)
							if(json.imageUrl && json.imageUrl!=""){
									imageUrlInput.val(json.imageUrl);
									target.parent().parent().parent().find(".pro_img").find(".set_pro_img").prop("src",json.imageUrl)
									target.parent().parent().parent().find(".pro_img").find(".img_notice").text("");
									target.parent().parent().parent().find(".changeImg").text("更改图片");
								}else{
									//和上一次专线不一样
									if(oldLineId!=product.touristLine.id){
										imageUrlInput.val("");
										parent.parent().find(".pro_img").find(".set_pro_img").prop("src",defaultUrl);
									}
								}
							productNameInput.val(product.name);
							parent.removeClass("warning").removeClass("none");
							if(product.name.length>maxlen){
								parent.find(".pro_name").text(product.name.substring(0,maxlen)+"...");
							}else{
								parent.find(".pro_name").text(product.name);
							}
							parent.find(".pro_name").attr("title",function(){
								var b=product.name;
								return b;
							});
							parent.find(".changeImg").removeClass("disabled");
							changeValid(parent);
						}else{
							clearSet(parent,"产品无效","warning")
						}
					}else{
						clearSet(parent,"产品不存在","none")
					}
					if(call){
						call()
					}
				},function(){
					clearSet(parent,"查询失败")
					if(call){
						call()
					}
				},"true")
			}else if(oldValue!=""){
				parent.find(".changeImg").removeClass("disabled");
			}
		}
	}else{
		update = true;
		clearSet(parent,"")
	}
	target.blur();
}


function clearSetNoImage(parent,text,classname){
	parent.find(".setnoimage-input-value").val("");
	//parent.removeClass("warning").removeClass("none");
	if(text!=""){
		if(classname){
			parent.addClass(classname);
		}
		parent.find(".pro_name").html(text);
	}else{
		if(classname){
			parent.removeClass(classname);
		}
		parent.find(".pro_name").html("&nbsp;输入编号后产品名称将显示在这里");
	}
	changeValid(parent);
		var pro_length=$("li.pro_item").length;
		console.log("remove_class"+pro_length);
			if(pro_length==1){
				
				console.log("remove_class");
				$(".pro_item:eq(0)").find("input[name=noimageinput]").removeClass("validate[required]");
			}
}

function checkProdcutNoImage(target,call){
	var value = target.val();
	var parent = target.parent().parent();
	var validInput= parent.find("input[data-name=validnoimage]");
	var productIdnoimageInput = parent.find("input[data-name=productIdnoimage]");
	var productNamenoimageInput = parent.find("input[data-name=productNamenoimage]");
	var thisname =productIdnoimageInput.prop("name");
	
	if(value!=""){
		var toset = true;
		var check_check = $("input[data-name=productIdnoimage]");
		var oldValue = productIdnoimageInput.val();
		if(toset){
			var id = value;
			if(oldValue!=value){
				update = true;
				target.parent().append($(".loading_template").html());
				target.parent().find(".query_pro").remove();
				getProdcut(id,function(json){
					if(json.product){
						var product = json.product;
						if(product.available==true && product.onShelf==true && product.deadline==false){
							validInput.val("true");
							productIdnoimageInput.val(product.id);
							productNamenoimageInput.val(product.name);
							parent.removeClass("warning").removeClass("none");
							if(product.name.length>maxlen){
								parent.find(".pro_name").text(product.name.substring(0,maxlen)+"...");
							}else{
								parent.find(".pro_name").text(product.name);
							}
							parent.find(".pro_name").attr("title",function(){
								var b=product.name;
								return b;
							});
							changeValid(parent);
						}else{
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
				},"")
			}
		}
	}else{
		update = true;
		clearSetNoImage(parent,"")
	}
	target.blur();
}

function setListName(){
	var add = 4;
	var len = $(".drag-ele").length;
	if(len>1){
		$(".pro_text_noimage").each(function(index){
			var subindex = index+add;
			$(this).parent().find(".drag-ele").find("input").each(function(index2){
				if(index2==0){
					$(this).prop("name","recommendList["+subindex+"].valid")
				}else if(index2==1){
					$(this).prop("name","recommendList["+subindex+"].productId")
				}else if(index2==2){
					$(this).prop("name","recommendList["+subindex+"].productName")
				}
			})
		});
	}else if(len==1){
		var pro_text_noimage = $("input[name=noimageinput]:eq(0)");
		if($.trim(pro_text_noimage.val())==""){
			$(".drag-ele:eq(0)").find("input").each(function(index2){
				if(index2==0){
					$(this).prop("name","")
				}else if(index2==1){
					$(this).prop("name","")
				}else if(index2==2){
					$(this).prop("name","")
				}
			})
		}else{
			$(".drag-ele:eq(0)").find("input").each(function(index2){
				var subindex = add;
				if(index2==0){
					$(this).prop("name","recommendList["+subindex+"].valid")
				}else if(index2==1){
					$(this).prop("name","recommendList["+subindex+"].productId")
				}else if(index2==2){
					$(this).prop("name","recommendList["+subindex+"].productName")
				}
			})
		}
		
	}
}
function getProdcut(id,call,callError,image){
	$.ajax({
		url:"/shop/product/"+id+"?format=json&image="+image+"&m="+Math.random(),
		type:"GET",
		async:false,
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
	//重新设置排序
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
					}else if(input_ele.attr("data-name")=="imageUrl"){
						thisinput.validationEngine('showPrompt',"请设置产品封面",'error',null,true);
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
		
	if(success){
		var len = $(".drag-ele").length;
		var check=false;
		if(len==1){
			var pro_text_noimage = $("input[name=noimageinput]");
			if($.trim(pro_text_noimage.val())!=""){
				check = true;
			}
		}
		if(len>1){
			check = true;
		}
		if(check){
			$(".drag-ele").each(function(i,ele){
				$(ele).find("input").each(function(index2){
					if($(this).attr("data-name")=="productIdnoimage"){
						if($(this).val()==""){
							$(this).parent().parent().find("input[name=noimageinput]").validationEngine('showPrompt',"请设置产品信息",'error',null,true);
							success=false;
							return false;
						}
					}
				})
			})
		}
	}
	
	$("input[data-name=valid]").each(function(){
		if($(this).val()==""){
			$(this).val("true");
		}
	})
	
	$("input[data-name=validnoimage]").each(function(){
		if($(this).val()==""){
			$(this).val("true");
		}
	})
	
	setListName();
	
	if(success && checkupdate && update==false){
		//success = false;
		//$(".saveBtn").validationEngine('showPrompt',"当前没做任何修改",'error',null,true);
	}
	return success;
}

//编号
function number(){
	$(".pro_item").each(function(){
		if($(this).index()<9){
           $(this).find(".pro_order").html("<span class='number_index'>"+"0"+($(this).index()+1)+"</span>")
		}else{
			$(this).find(".pro_order").html("<span class='number_index'>"+($(this).index()+1)+"</span>")
		}
		
	})
}
