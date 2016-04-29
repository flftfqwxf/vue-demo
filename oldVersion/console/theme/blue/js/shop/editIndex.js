var target = null;
var targetadv = null;
var first = true;
var firstbanner = true;
var update = false;
var defaultUrl = WEB_STATIC_CONSOLE+"/theme/blue/images/blank.png";
var maxlen = 20;
var checkupdate = false;
var  maxrecommend = 20;
var drag = false;
var urlReg =/^(http):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
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
	
	/**
	var datas =$("#validateform").find (".input-data-id");
	$.each(datas,function(index,element){
		if($(this).val()!="" && $(this).val()!="0"){
			checkupdate = true;
		}
	});
	**/
	
	$(".changeImg").each(function(){
		$(this).on("click",null,function(){
			var $this = $(this);
			target = $(this).parent();
			var lineId = target.find("input[data-name=lineId]").val();
			$("#lineObj").val(lineId);
			var disabled = $(this).hasClass("disabled");			
			var a=$this.hasClass("move_img");
			if(a){
				$("#galleryImageType").val("siterecbig");
			}else{
				$("#galleryImageType").val("sitebg");
			}
			initgmgallery(function(response){
				if(response && target){
					update = true;
					changeValid(target);
					var index = 0;
					if($("#galleryImageType").val()=="siterecbig"){
						index =1;
					}
					target.parent().find(".pro_img").eq(index).find(".set_pro_img").prop("src",response.url+"@180w_302h");
					target.parent().find(".pro_img").eq(index).find(".img_notice").text("");
					if(index==0){
						target.find("input[data-name=imageUrl]").val(response.url);
					}else if(index==1){
						target.find("input[data-name=pcImageUrl]").val(response.url);
					}
					//target.parent().find(".changeImg").val("更换图片");
				}
				target.find(".imgBtn").blur();
			});
			if(lineId!="0" && !disabled){
					$("input[name=gmbutton]").click();
					$(this).blur();
			}
		})
	})
	
	//设置广告
	$(".btn_set").each(function(i){
		$(this).on("click",null,function(){
			var $this = $(this);
			targetadv = $this;
			$("#galleryImageTypebanner").val($this.prop("id"));
			console.log($("#galleryImageTypebanner").val())
			initgmgallerybanner(function(response){
				if(response){
					console.log($(targetadv).html())
					$(targetadv).parent().parent().find("input[data-name=advertisement]").val(response.url);
					$(targetadv).parent().find("img").prop("src",response.url);
				}
			});
		    $("input[name=bannerBtn]").click();
		})
	})
	
	$(".list_title").text($("#list_name").val());
	
	//拖动排序
    $(".edit_pro .pro_list").sortable({cursor:"move",stop:function(){
    	update = true;
    	drag = true;
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
	
	//主页图片
	$(".pro_text_image").find("input").each(function(){
		var target = $(this);
		$(this).focus(function(){
			target.parent().find(".query_warning").remove();
			var $this = $(this);
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
			$(this).parent().parent().removeClass("warning").removeClass("none");
			$(this).val($(this).val().replace(/\D/g,''));
		}).on("afterpaste",null,function(){
			$(this).val($(this).val().replace(/\D/g,''));
		}).on("change",function(){
			
		});
		
		//$(this).change(function(){
		//	var val=$.trim($(this).val());
		//});
	});

	$(".pro_text_noimage input").each(function(){
		var target = $(this);
		$(this).focus(function(){
			target.parent().find(".query_warning").remove();
			var $this = $(this);
			var len=$(this).parent().find(".query_pro").length;
			if(len==0){
				$(this).parent().append($(".query_template").html());
				$(this).parent().find(".query_pro").click(function(){
					checkProdcutNoImage(target,function(){
						setTimeout(function(){
							target.parent().find(".query_loading").remove();
						},100)
					});
				});
			}
		}).blur(function(){
			$(this).parent().css({"box-shadow":"none"});
		}).on("keyup",null,function(){
			$(this).val($(this).val().replace(/\D/g,''));
			$(this).parent().parent().removeClass("warning").removeClass("none");
		}).on("paste",null,function(){
			$(this).val($(this).val().replace(/\D/g,''));
		});;
	});
	
	
	$(".edit .bannerUrl").each(function(){
		$(this).blur(function(){
			var this_val=$.trim($(this).val());
			if(this_val != ""){
				$(this).addClass("validate[required]");
				checkUrl($(this));
			}else{
				$(this).removeClass("validate[required]");
				$(this).parent().parent().find(".imgBanner").val("");
				$(this).parent().parent().find('[data-name="advertisement"]').val("");
				$(this).parent().parent().find("img").attr("src","");
			}
		}).on("afterpaste",null,function(){
			var this_val=$.trim($(this).val());
			if(this_val == ""){
				$(this).removeClass("validate[required]");
				$(this).parent().parent().find(".imgBanner").val("");
				$(this).parent().parent().find('[data-name="advertisement"]').val("");
				$(this).parent().parent().find("img").attr("src","");
			}
		});
	});
	
	$("#validateform").validationEngine({
		validateNonVisibleFields : true,
		validationEventTrigger : "",
		showOneMessage : false,
		maxErrorsPerField : 1,
		promptPosition : "topLeft:0,6",
		scroll : true,
		scrollOffset : 100,
		autoHidePrompt : true,
		autoHideDelay : 5000,
		focusFirstField : true
	});

	$(".saveBtn").on("click",null,function(){
		$("#validateform").submit();
	});
	//tab切换
	$(".tab_cut ul li").on("click",function(){
		var _self=$(this);
		if(_self.index()===0){
			$(".pro_list").eq(0).show();
		}else if(_self.index()===1){
            $(".pro_list").eq(1).show();
		}else if(_self.index()===2){
            $(".pro_list").eq(2).show();
		}
		_self.addClass("tab_active")
		_self.siblings("li").removeClass("tab_active");
		$(".pro_list").eq(_self.index()).siblings(".pro_list").hide();
	})
})


function changeValid(target){
	//target.find(".input-data-valid:eq(0)").val("true");
}

function clearSet(parent,text,classname){
	parent.find(".set-input-value").val("");
	parent.parent().find(".pro_img").find(".set_pro_img").prop("src",defaultUrl);
	parent.parent().find(".pro_img").find(".img_notice").text("请添加图片");
	parent.removeClass("warning").removeClass("none");
	//parent.parent().find(".changeImg").eq(0).text("选择图片");
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
}
//主页首图
function checkProdcutImage(target,call){
	var value = target.val();
	var parent = target.parent().parent();
	var productIdInput = parent.find("input[data-name=productId]");
	var thisname = productIdInput.prop("name");
	var oldValue = productIdInput.val();
    var editIndex_pv=target.parent().parent().next(".editIndex_pv").find("span");         //主页设置
	if(value!=""){
		var toset = true;
		if(toset){
			var id = value;
			var lineInput = parent.find("input[data-name=lineId]");
			var imageUrlInput= parent.find("input[data-name=imageUrl]");
			var pcImageUrlInput= parent.find("input[data-name=pcImageUrl]");
			var productNameInput= parent.find("input[data-name=productName]");
			var validInput= parent.find("input[data-name=valid]")
			var oldLineId = lineInput.val();
			if(oldValue!=value){
				update = true;
				target.parent().append($(".loading_template").html());
				target.parent().find(".query_pro").remove();
				getProdcut(id,function(json){
					changeValid(target);
					if(json.product){
						if (json.productValid && json.productValid==true) {
							var product = json.product;
	                        console.log(json.siteProductValid == true)
	                        if(json.siteProductValid && json.siteProductValid == true){
	                        	editIndex_pv.text(product.statistics.itemPageViewWeek+product.statistics.productPageViewWeek);              //pv数
								
	                        	validInput.val("true");
								productIdInput.val(product.id);
								lineInput.val(product.touristLine.id);
								//和上一次专线不一样
								if(oldLineId!=product.touristLine.id){
									imageUrlInput.val("");
									pcImageUrlInput.val("");
									parent.parent().find(".pro_img").find(".set_pro_img").prop("src",defaultUrl);
									parent.parent().find(".pro_img").find(".img_notice").text("请添加图片");
								}
								productNameInput.val(product.name);
								parent.removeClass("warning").removeClass("none");
								parent.find(".pro_name").attr("title",product.name);
								if(product.name.length>maxlen){
									parent.find(".pro_name").text(product.name.substring(0,maxlen)+"...");								
								}else{
									parent.find(".pro_name").text(product.name);
								}
								parent.find(".changeImg").removeClass("disabled");
							}else{
								clearSet(parent,"产品无效，确认产品是否是该站点下产品","none");
								parent.find(".pro_name").attr("title","产品无效，确认产品是否是该站点下产品");
							}
						} else {
							clearSet(parent,"产品无效","warning");
						}
					}else{
						clearSet(parent,"产品不存在","none")
					}
					if(call){
						call()
					}
				
				},function(){
					changeValid(target);
					clearSet(parent,"查询失败")
					if(call){
						call()
					}
				})
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
}
//当季热卖
function checkProdcutNoImage(target,call){
	var value = target.val();
	var parent = target.parent().parent();
	var productIdnoimageInput = parent.find("input[data-name=productIdnoimage]");
	var productNamenoimageInput = parent.find("input[data-name=productNamenoimage]");
	var validInput= parent.find("input[data-name=validnoimage]")
	var thisname =productIdnoimageInput.prop("name");
	var oldValue = productIdnoimageInput.val();
	var home_set_pv=target.parent().parent().parent().next(".home_set_pv").find("span");      //主页设置

	if(value!=""){
		var toset = true;
		if(toset){
			var id = value;
			if(oldValue!=value){
				update = true;
				target.parent().append($(".loading_template").html());
				target.parent().find(".query_pro").remove();
				getProdcut(id,function(json){
					changeValid(target);
					if(json.product){
						if (json.productValid && json.productValid==true) {
							var product = json.product;
							var b=$(".tab_active").html();							
							//console.log(product.deadline)
							if(json.siteProductValid && json.siteProductValid ==true){
								var success = false;
								if(b==="跟团游"){
									if(!product.groupTour){
	                                    clearSetNoImage(parent,"请输入跟团游产品有效id","none");
									}else{
										success = true;
										validInput.val("true");
										productIdnoimageInput.val(product.id);
										productNamenoimageInput.val(product.name);
										parent.removeClass("warning").removeClass("none");
										parent.find(".pro_name").attr("title",product.name);
										if(product.name.length>maxlen){
											parent.find(".pro_name").text(product.name.substring(0,maxlen)+"...");
										}else{
											parent.find(".pro_name").text(product.name);
										}
									}
								}
								if(b==="自由行"){
									if(!product.freeWalkerTour){
	                                   clearSetNoImage(parent,"请输入自由行产品有效id","none");
									}else{
										success = true;
										validInput.val("true");
										productIdnoimageInput.val(product.id);
										productNamenoimageInput.val(product.name);
										parent.removeClass("warning").removeClass("none");
										parent.find(".pro_name").attr("title",product.name);
										if(product.name.length>maxlen){
											parent.find(".pro_name").text(product.name.substring(0,maxlen)+"...");
										}else{
											parent.find(".pro_name").text(product.name);
										}
									}

								}
								if(b==="邮轮"){
									if(!product.shipTour){
	                                   clearSetNoImage(parent,"请输入邮轮产品有效id","none");
									}else{
										success = true;
										validInput.val("true");
										productIdnoimageInput.val(product.id);
										productNamenoimageInput.val(product.name);
										parent.removeClass("warning").removeClass("none");
										parent.find(".pro_name").attr("title",product.name);
										if(product.name.length>maxlen){
											parent.find(".pro_name").text(product.name.substring(0,maxlen)+"...");
										}else{
											parent.find(".pro_name").text(product.name);
										}
									}

								}
									
								if(success) {
									home_set_pv.text(product.statistics.itemPageViewWeek+product.statistics.productPageViewWeek)     //微网站主页设置pv数
								}
							}else{
								clearSetNoImage(parent,"产品无效，确认产品是否是该站点下产品","none");
								parent.find(".pro_name").attr("title","产品无效，确认产品是否是该站点下产品");
							}
						} else {
							clearSetNoImage(parent,"产品无效","warning");
						}
					}else{
						clearSetNoImage(parent,"产品不存在","none")
					}
					if(call){
						call()
					}
				
				},function(){
					changeValid(target);
					clearSetNoImage(parent,"查询失败")
					if(call){
						call()
					}
				})
			}
		}
	}else{
		update = true;
		clearSetNoImage(parent,"")
	}
	target.blur();
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

function initgmgallery(call) {
	//手机设置图片
	if(first==true){
		var dialog = $("input[name=gmbutton]").gmgallery({
					showUploadBut:true,
					showUserUploadList:true,
					url : '/gallery/search.json',
					multiSelect:false,
//					imageType:"sitebg",
					touristLineId:'',
					touristLineObj:$("#lineObj"),
					imageTypeObj:$("#galleryImageType"),
					operateType:"other_image",
					alwaysReInit:true,
					clearKeyWord:true,
					options_id:new Date().getTime(),
					onOk:function(response){
						if(call){
							call(response);
						}
					},zIndex:'900999'})
		first =false;
	}
}

/*检查输入的广告url是否正确*/
function checkUrl($obj){
	var value=$.trim($obj.val());
	if(!urlReg.test(value) && value !=""){
		$("html,body").animate({scrollTop:$obj.offset().top-400},200);
		$obj.addClass("input_erro");
		return false;
	}else{
		$obj.removeClass("input_erro");
		return true;
	}
}

//广告图
function initgmgallerybanner(call) {
	//手机设置图片
	if(firstbanner==true){
		var dialog = $("input[name=bannerBtn]").gmgallery({
					showUploadBut:true,
					showUserUploadList:true,
					url : '/gallery/search.json',
					multiSelect:false,
//					imageType:"sitebg",
					touristLineId:'',
					imageTypeObj:$("#galleryImageTypebanner"),
					operateType:"other_image",
					alwaysReInit:true,
					clearKeyWord:true,
					options_id:new Date().getTime(),
					onOk:function(response){
						if(call){
							call(response);
						}
					},zIndex:'900999'})
		firstbanner =false;
	}
}
function btnc(obj){
	var result1=true;
	$(".pro_list").eq(0).find(".pro_li").each(function(){
	    if($(this).find(".setnoimage-input-value").eq(0).val()===""){
	    	result1=false;
	    };
	});
	var result2=true;
	$(".pro_list").eq(1).find(".pro_li").each(function(){
	    if($(this).find(".setnoimage-input-value").eq(0).val()===""){
	    	result2=false;
	    };
	});
	var result3=true;
	$(".pro_list").eq(2).find(".pro_li").each(function(){
	    if($(this).find(".setnoimage-input-value").eq(0).val()===""){
	    	result3=false;
	    };
	});
    var a=obj.parents(".pro_list").index();
    if(a===4){
    	$(".tab_cut ul li").eq(0).click();
    }else if(a===5){
    	if(result1){
    		$(".tab_cut ul li").eq(1).click();
    	}        
    }else if(a===6){
    	if(result1 && result2){
           $(".tab_cut ul li").eq(2).click();
    	}       
    }
}

function checkForm(){
	//重新设置排序
	if(drag){
		//跟团游
		$(".pro_list").eq(0).find(".pro_text_noimage").each(function(index){
			var subindex = index;
			$(this).parent().find(".drag-ele").find("input").each(function(index2){
				var dataname = $(this).attr("data-name");
				if(dataname=="validnoimage"){
                    $(this).prop("name","groupRecommendList["+subindex+"].valid");
				}else if(dataname=="indexnoimage"){
					$(this).prop("name","groupRecommendList["+subindex+"].productIndex").val(index);
				}else if(dataname=="typenoimage"){
					$(this).prop("name","groupRecommendList["+subindex+"].recommendType")
				}else if(dataname=="imagevalidnoimage"){
					$(this).prop("name","groupRecommendList["+subindex+"].imageUrlValid")
				}else if(dataname=="idnoimage"){
					$(this).prop("name","groupRecommendList["+subindex+"].id")
				}else if(dataname=="productIdnoimage"){
					$(this).prop("name","groupRecommendList["+subindex+"].productId")
				}else if(dataname=="aliasnoimage"){
					$(this).prop("name","groupRecommendList["+subindex+"].recommendAlias")
				}else if(dataname=="productNamenoimage"){
					$(this).prop("name","groupRecommendList["+subindex+"].productName")
				}
			})
		});
		//自由行
		$(".pro_list").eq(1).find(".pro_text_noimage").each(function(index){
			var subindex = index;
			$(this).parent().find(".drag-ele").find("input").each(function(index2){
				var dataname = $(this).attr("data-name");
				if(dataname=="validnoimage"){
                    $(this).prop("name","freeRecommendList["+subindex+"].valid");
				}else if(dataname=="indexnoimage"){
					$(this).prop("name","freeRecommendList["+subindex+"].productIndex").val(index);
				}else if(dataname=="typenoimage"){
					$(this).prop("name","freeRecommendList["+subindex+"].recommendType")
				}else if(dataname=="imagevalidnoimage"){
					$(this).prop("name","freeRecommendList["+subindex+"].imageUrlValid")
				}else if(dataname=="idnoimage"){
					$(this).prop("name","freeRecommendList["+subindex+"].id")
				}else if(dataname=="productIdnoimage"){
					$(this).prop("name","freeRecommendList["+subindex+"].productId")
				}else if(dataname=="aliasnoimage"){
					$(this).prop("name","freeRecommendList["+subindex+"].recommendAlias")
				}else if(dataname=="productNamenoimage"){
					$(this).prop("name","freeRecommendList["+subindex+"].productName")
				}
			})
		});
		//邮轮
		$(".pro_list").eq(2).find(".pro_text_noimage").each(function(index){
			var subindex = index;
			$(this).parent().find(".drag-ele").find("input").each(function(index2){
				var dataname = $(this).attr("data-name");
				if(dataname=="validnoimage"){
                    $(this).prop("name","shipRecommendList["+subindex+"].valid");
				}else if(dataname=="indexnoimage"){
					$(this).prop("name","shipRecommendList["+subindex+"].productIndex").val(index);
				}else if(dataname=="typenoimage"){
					$(this).prop("name","shipRecommendList["+subindex+"].recommendType")
				}else if(dataname=="imagevalidnoimage"){
					$(this).prop("name","shipRecommendList["+subindex+"].imageUrlValid")
				}else if(dataname=="idnoimage"){
					$(this).prop("name","shipRecommendList["+subindex+"].id")
				}else if(dataname=="productIdnoimage"){
					$(this).prop("name","shipRecommendList["+subindex+"].productId")
				}else if(dataname=="aliasnoimage"){
					$(this).prop("name","shipRecommendList["+subindex+"].recommendAlias")
				}else if(dataname=="productNamenoimage"){
					$(this).prop("name","shipRecommendList["+subindex+"].productName")
				}
			})
		});
	}
	
	var form = $("#validateform");
	if (window.Placeholders && !Placeholders.nativeSupport) {
		Placeholders.disable( $("#validateform"));
	}
	var flag = form.validationEngine('validate');
	if (window.Placeholders && !Placeholders.nativeSupport) {
		Placeholders.enable( $("#validateform"));
	}
	
	form.find(".input-data-alias").val(form.find(".list_title").text());
	var item =form.find (".itemlarge");
	var success = flag;
	/*验证输入的广告链接是否正确*/
	$(".edit .bannerUrl").each(function(){
		if($.trim($(this).val()) != ""){
			success=checkUrl($(this));
		}else{
			success=true;
		}
	});
	if(success){
		var inputM = $("input[name=advertisementMobileInput]");
		var inputPC = $("input[name=advertisementPcInput]");
		var oldVM = $.trim(inputM.attr("datavalue"));
		var vM = $.trim(inputM.val());
		var oldVPC = $.trim(inputPC.attr("datavalue"));
		var vPC = $.trim(inputPC.val());
		var pcImg=$.trim($('[name="advertisementPc.pcImageUrl"]').val());
		var mImg=$.trim($('[name="advertisementMobile.imageUrl"]').val());
		//设置pc的广告链接未设置图片
		if(vPC != "" && pcImg ==""){
			$(".set_banner1").validationEngine('showPrompt',"请设置广告图片",'error',null,true);
			success = false;
		}
		//设置pc未设置图片的广告链接
		if(vPC == "" && pcImg !=""){
			$(".set_banner1").validationEngine('showPrompt',"请设置广告链接",'error',null,true);
			success = false;
		}
		//设置手机的广告链接未设置图片
		if(vM == "" && mImg !=""){
			$(".set_banner2").validationEngine('showPrompt',"请设置广告链接",'error',null,true);
			success = false;
		}
		//设置手机设置图片 未设置广告链接
		if(vM != "" && mImg ==""){
			$(".set_banner2").find(".btn_set").validationEngine('showPrompt',"请设置广告图片",'error',null,true);
			success = false;
		}
		if(vPC.indexOf("?randomtime=")>0) {
			inputPC.validationEngine('showPrompt',"链接含有非法参数",'error',null,true);
			success = false;
		}
		if(vM.indexOf("?randomtime=")>0) {
			inputM.validationEngine('showPrompt',"链接含有非法参数",'error',null,true);
			success = false;
		}
		if(vPC == "" && $('[id="advertisementPcurl"]') ==""){
			$("#advertisementPcurl").val("");
			success=true;
		}
		if(vM == "" && $('[id="advertisementMobileurl"]') ==""){
			$("#advertisementMobileurl").val("");
			success=true;
		}
		
		if(oldVM != vM && vM!="") {
			$("#advertisementMobileurl").val(vM);
			success = true;
		}
		if(oldVPC != vPC && vPC!="") {
			$("#advertisementPcurl").val(vPC);
			success = true;
		}
	}
	
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
						thisinput.validationEngine('showPrompt',"请设置手机图",'error',null,true);
						noerror = false;
						return false;
					}else if(input_ele.attr("data-name")=="pcImageUrl"){
						thisinput.validationEngine('showPrompt',"请设置电脑图",'error',null,true);
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
	// if(success){
	// 	$(".drag-ele").each(function(i,ele){
	// 		$(ele).find("input").each(function(index2){
	// 			if($(this).attr("data-name")=="productIdnoimage"){
	// 				if($(this).val()==""){
 //                        btnc($(this))
	// 					$(this).parent().parent().find("input[name=noimageinput]").validationEngine('showPrompt',"请设置产品信息",'error',null,true).focus();
	// 					success=false;
	// 					return false;
	// 				}
	// 			}
	// 		})
	// 	})
	// }
	
	$("input[data-name=valid]").each(function(){
		if($(this).val()==""){
			$(this).val("true");
		}
	})
	
	if(success && checkupdate && update==false){
		//success = false;
		//$(".saveBtn").validationEngine('showPrompt',"当前没做任何修改",'error',null,true);
	}
	
	return success;
}