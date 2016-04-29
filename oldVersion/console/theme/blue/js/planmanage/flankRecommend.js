var target = null;
var first = true;
var update = false;
var defaultUrl = WEB_STATIC_CONSOLE + "/common/image/gm.png";
var maxlen = 11;
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
	$(".imgBtn").each(function(){
		$(this).on("click",null,function(){
			var $this = $(this);
			target = $(this).parent();
			var lineId = target.find(".input-value:eq(2)").val();
			$("#lineObj").val(lineId);
			if(first==true){
				$("input[name=gmbutton]").gmgallery({alwaysReInit:true,clearKeyWord:true,multiSelect:false,touristLineId:null,touristLineObj:$("#lineObj"),imageTypeObj:$("#galleryImageType"),operateType:"other_image",options_id:new Date().getTime(),onOk:function(response){
					if(response && target){
						update = true;
						target.find(".product_img").prop("src",response.url)
						target.find(".input-value:eq(1)").val(response.url);
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
	
	//$(".imgBtn mt5").attr("disabled",true).css("background","#ccc");

	$(".recommend_input").focus(function(){
		$(this).parent().find(".checkBtn").show();
	}).blur(function(){
		if($(this).val()==""){
			//$(this).parent().find(".checkBtn mt5").hide();
		}
	}).on("keyup",null,function(){
		$(this).val($(this).val().replace(/\D/g,''));
	}).on("afterpaste",null,function(){
		$(this).val($(this).val().replace(/\D/g,''));
	});
	
	$(".checkBtn").click(function(){
		var $this = $(this);
		var value = $(this).prev().val();
		var thisname = $(this).parent().parent().find(".check-input").prop("name");
		var parent = $(this).parent().parent();
		var slide_pv=$this.parent().nextAll(".slide_pv").find("span");
		if(value!=""){
			var toset = true;
			/**
			var check_check = $(".check-input");
			$.each(check_check,function(index,ele){
				if($(ele).prop("name") !=thisname  && $(ele).val()==value){
					toset = false;
					$this.validationEngine('showPrompt',"该产品已设置",'error',null,true);
					return false;
				}
			})
			**/
			if(toset){
				var id = value;
				var oldValue = parent.find(".input-value:eq(0)").val();
				var oldLineId = parent.find(".input-value:eq(2)").val();
				if(oldValue!=value){
					update = true;
					// 清空左侧感叹号
					$this.parent().find(".tips").hide();
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
							if(json.product){
								var product = json.product;
								slide_pv.text(product.statistics.itemPageViewWeek+product.statistics.productPageViewWeek);         //侧栏pv数
								if(json.productValid && json.productValid==true){
									parent.find(".input-valid").val(true);
									parent.find(".input-value:eq(0)").val(product.id);
									parent.find(".input-value:eq(2)").val(product.touristLine.id);
									//和上一次专线不一样
									if(oldLineId!=product.touristLine.id){
										parent.find(".input-value:eq(1)").val("");
										parent.find(".product_img").prop("src",defaultUrl)
										parent.find(".imgBtn").attr("disabled","true").css("background","#ccc").val("选择图片");
									}
									parent.find(".input-value:eq(3)").val(product.name);
									if(product.name.length>maxlen){
										parent.find(".checkInfo").removeClass("waring").html("<span title='"+product.name+"'>" +product.name.substring(0,maxlen)+"...</span>");
									}else{
										parent.find(".checkInfo").removeClass("waring").html("<span title='"+product.name+"'>" +product.name+"</span>");
									}
									parent.find(".imgBtn").removeAttr("disabled").css("background","#fff");
									$this.hide();
								}else{
									clearSet(parent,"产品无效")
								}
							}else{
								clearSet(parent,"产品不存在")
							}
							}
						})
				}else if(oldValue!=""){
					parent.find(".imgBtn").removeAttr("disabled").css("background","#fff");
					$this.hide();
				}
			}
		}else{
			update = true;
			clearSet(parent);
			$this.parent().find(".tips").hide();
		}
		$(this).blur();
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

	$(".theme_but").on("click",null,function(){
		$("#validateform").submit();
	})
})

function clearSet(parent,text){
	parent.find(".input-value:eq(0)").val("");
	parent.find(".input-value:eq(1)").val("");
	parent.find(".input-value:eq(2)").val("");
	parent.find(".input-value:eq(3)").val("");
	parent.find(".product_img").prop("src",defaultUrl)
	if(text){
		parent.find(".checkInfo").addClass("waring").text(text);
		setTimeout(function(){
			parent.find(".checkInfo").removeClass("waring").text("");
		},2000);
	}else{
		parent.find(".checkInfo").removeClass("waring").text("");
	}
	parent.find(".imgBtn").attr("disabled","true").css("background","#ccc").val("选择图片");
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
	var item =form.find (".product");
	var success = true;
	$.each(item,function(index,element){
		var ele = $(element);
		var input = ele.find(".input-value");
		var thisinput = $(ele).find(".recommend_input");
		var noerror = true;
		$.each(input,function(index2,inputEle){
			var input_ele = $(inputEle);
			if(input_ele.val()=="" && thisinput.val()!=""){
				if(index2==0){
					thisinput.validationEngine('showPrompt',"请设置产品信息",'error',null,true);
					noerror = false;
					return false;
				}else if(index2==1){
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
	
	/*if(success && update==false){
		success = false;
		$(".theme_but").validationEngine('showPrompt',"当前没做任何修改",'error',null,true);
	}*/
	return success;
}
