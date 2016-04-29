var target = null;
var first = true;
var update = false;
var defaultUrl = WEB_STATIC_CONSOLE+"/common/image/gm.png";
var maxlen = 20;
var checkupdate = false;
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
	
	$(".imgBtn").each(function(){
		$(this).on("click",null,function(){
			var $this = $(this);
			target = $(this).parent();
			var lineId = target.find("input[data-name=lineId]").val();
			$("#lineObj").val(lineId);
			$("#galleryImageType").val($(this).attr("attr_type"));
			if(first==true){
				$("input[name=gmbutton]").gmgallery({alwaysReInit:true,clearKeyWord:true,multiSelect:false,touristLineId:"",touristLineObj:$("#lineObj"),imageTypeObj:$("#galleryImageType"),operateType:"other_image",options_id:new Date().getTime(),onOk:function(response){
					if(response && target){
						changeValid(target);
						update = true;
						target.find(".pro_img").prop("src",response.url+"@240w_200h")
						target.find("input[data-name=imageUrl]").val(response.url);
						$this.val("更换图片");
					}
					target.find(".imgBtn").blur();
				},zIndex:'900999'})
				first =false;
			}
			if(lineId!="0"){
				$("input[name=gmbutton]").click();
				$(this).blur();
			}
			if(update){
                $this.val("更换图片");
			}
		})
	})
	
	var hasf = false;
	//$(".imgBtn").attr("disabled",true).css("background","#ccc");
	$(".rec_input").focus(function(){
		$(this).parent().find(".checkBtn").show();
		hasf = true;
	}).blur(function(){
		if($(this).val()==""){
//			var productId = $(this).parent().parent().find("input[data-name=productId]").val();
//			if(productId!=""){
//				$(this).val(productId);
//			}
			hasf = false;
		}
	}).on("keyup",null,function(){
		$(this).val($(this).val().replace(/\D/g,''));
	}).on("afterpaste",null,function(){
		$(this).val($(this).val().replace(/\D/g,''));
	});
	
	$(".checkBtn").click(function(){
		var $this = $(this);
		var input = $(this).prev();
	
		input.val(input.val().replace(/\D/g,''));
		var value = input.val();
		var parent = $(this).parent().parent();
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
					$this.validationEngine('showPrompt',"该产品已设置",'error',null,true);
					input.val(oldValue);
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
					$this.parent().find(".gm-warning").remove();
					$this.hide();
					$.ajax({
						url:"/recommend/product/"+id+"?format=json&m="+Math.random(),
						type:"GET",
						async:false,
						dataType:"json",
						success:function(json){
							if(json.result && json.result.success !="undefined" && json.result.success==false && json.result.isReload==true){
								$.gmMessage(json.result.message,false);
								return;
							}else{
							}
							//$this.show();
							changeValid(parent);
							if(json.product){
								var product = json.product;
								//console.log(product.deadline)
								if(json.productValid && json.productValid==true){
									validInput.val("true");
									productIdInput.val(product.id);
									lineInput.val(product.touristLine.id);
									//和上一次专线不一样
									if(oldLineId!=product.touristLine.id){
										imageUrlInput.val("");
										parent.find(".pro_img").prop("src",defaultUrl)
										parent.find(".imgBtn").attr("disabled","true").css("background","#ccc").val("选择图片");
									}
									productNameInput.val(product.name);
									if(product.name.length>maxlen){
										parent.find(".checkInfo").removeClass("waring").prop("title",product.name).text(product.name.substring(0,maxlen)+"...");
									}else{
										parent.find(".checkInfo").removeClass("waring").prop("title",product.name).text(product.name);
									}
									parent.find(".imgBtn").removeAttr("disabled").css("background","#fff");
									
									$this.hide();
								}else{
									clearSet(parent,"产品无效")
								}
							}else{
								clearSet(parent,"产品不存在")
							}
							},error:function(){
								//$this.show();
							}
						})
				}else if(oldValue!=""){
					parent.find(".imgBtn").removeAttr("disabled").css("background","#fff");
					$this.hide();
				}
			}
		}else{
			update = true;
			clearSet(parent)
			$this.parent().find(".gm-warning").remove();
		}
		$(this).blur();
		
	});
	
	$("#validateform").validationEngine({
		validateNonVisibleFields : true,
		validationEventTrigger : "",
		showOneMessage : false,
		maxErrorsPerField : 1,
		promptPosition : "topLeft:0,0",
		scroll : false,
		scrollOffset : 100,
		autoHidePrompt : true,
		autoHideDelay : 2000,
		focusFirstField : true
	});

	$(".rec_but").on("click",null,function(){
		$("#validateform").submit();
	})
})

function clearSet(parent,text){
	parent.find(".set-input-value").val("");
	parent.find(".pro_img").prop("src",defaultUrl)
	if(text){
		parent.find(".checkInfo").prop("title","").addClass("waring").text(text);
		setTimeout(function(){
			parent.find(".checkInfo").removeClass("waring").text("");
		},2000);
	}else{
		parent.find(".checkInfo").prop("title","").removeClass("waring").text("");
	}
	parent.find(".imgBtn").attr("disabled","true").css("background","#ccc").val("选择图片");
}


function changeValid(target){
	//target.find(".input-data-valid:eq(0)").val("true");
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
	var success = true;
	
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
						thisinput.focus();
						noerror = false;
						return false;
					}else if(input_ele.attr("data-name")=="imageUrl"){
						thisinput.validationEngine('showPrompt',"请设置产品封面",'error',null,true);
						thisinput.focus();
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
		var item =form.find (".itemsmall");
		$.each(item,function(index,element){
			var ele = $(element);
			var input = ele.find(".set-input-value");
			var thisinput = $(ele).find("input[name=input-value]");//当前input
			var noerror = true;
			$.each(input,function(index2,inputEle){
				var input_ele = $(inputEle);
					if(input_ele.attr("data-name")=="productId"){
						input_ele_next = $(inputEle).next().val();
						if(input_ele.val()!="" && input_ele_next==""){
							thisinput.validationEngine('showPrompt',"请设置产品封面",'error',null,true);
							thisinput.focus();
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
		
	
	if(success && checkupdate && update==false){
		//success = false;
		//$(".rec_but").validationEngine('showPrompt',"当前没做任何修改",'error',null,true);
	}
	return success;
}