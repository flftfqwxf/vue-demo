var target = null;
var first = true;
var update = false;
var defaultUrl = WEB_STATIC_CONSOLE+"/theme/blue/images/blank.png";
var maxlen = 20;
var checkupdate = false;
var  maxrecommend = 20;
var drag = false;
var list_index =0;
var noImageEvent=function(target){
	target.focus(function(){
		target.parent().find(".query_warning").remove();
		var $this = target;
		var len=target.parent().find(".query_pro").length;
		if(len==0){
			target.parent().append($(".query_template").html());
			target.parent().find(".query_pro").click(function(){
				target.val(target.val().replace(/\D/g,''));
				queryProdcut(target,function(){});
				setTimeout(function(){
					target.parent().find(".query_loading").remove();
				},100)
				target.parent().append($(".loading_template").html());
				target.parent().find(".query_pro").remove();
			});
		}
	}).blur(function(){
	}).on("keyup",null,function(){
		target.val($(this).val().replace(/\D/g,''));
		$(this).parent().parent().removeClass("warning").removeClass("none");
	}).on("afterpaste",null,function(){
		target.val($(this).val().replace(/\D/g,''));
	});;

}

/*绑定图库*/
function controllPro(target){
	/*判断添加一组和添加一个是不是父元素的第一个*/
	var add_two = $(".add_pro_items"),add_none=$(".add_pro_item"),del_pro=$(".del_pro");
	if(target){
		add_two = target.find(".add_pro_items:last");
		add_none=target.find(".add_pro_item:last");
	}
	//添加一组小图产品
	add_two.each(function(){
		$(this).click(function(){
			$(this).parent().find(".pro_list").append($("#pro_items").html());
			var $obj=$(this).parent().find(".pro_list").find("li:last-child");
		    $obj.find(".del_pro").click(function(){
				$(this).parent().remove();
			});
			$(".pro_text input").each(function(){
		    	noImageEvent($(this));
			});
		});
	})
	
	//添加大图产品
	add_none.click(function(){
		$(this).parent().find(".pro_list").append($("#pro_item").html());
		var $obj=$(this).parent().find(".pro_list").find("li:last-child");
	    $obj.find(".del_pro").click(function(){
			$(this).parent().remove();
		});
		$(".pro_text input").each(function(){
	    	noImageEvent($(this));
		});
	});
	
	/*改变栏目标题*/
	$(".list_name").change(function(){
		var text=$.trim($(this).val());
		if(text != ""){
			$(this).parent().parent().find(".hot_title").text(text);
			$(this).parent().find(".group_hidden_Info").find("[data-name=recommendAlias]").val(text);
		}
		else{
			$(this).val("店家推荐");
			$(this).parent().parent().find(".hot_title").text("店家推荐");
			$(this).parent().find(".group_hidden_Info").find("[data-name=recommendAlias]").val("店家推荐");
		}
	});

	//删除一组产品或一个
	del_pro.each(function(){
		var $this=$(this);
		$this.click(function(){
			var count=$(this).parent().parent().find(".del_pro").length;
			if(count<=1){
				$this.parent().find(".pro_order").validationEngine('showPrompt',"至少保留一个产品或一组产品",'error',null,true);
				return;
			}else{
				var del_group=$.confirm("删除后不可恢复，是否确认？","确认提示", function(){
					//删除操作
					$this.parent().remove();
					del_group.close();
				},function(){
					//取消
				});
			}
		});
	});
	
	//删除栏目
	$(".del_group").each(function(){
		var $this=$(this);
		$(this).click(function(){
			var len=$this.parent().parent(".edit_proList").find(".pro_list").find("li").length;
			if(len!=0){
				var del_group=$.confirm("删除后不可恢复，是否确认？","确认提示", function(){
					//删除操作
					del_group.close();
					$this.parent().parent(".edit_proList").remove();
				},function(){
					//取消
				});
			}else{
				$this.parent().parent(".edit_proList").remove();
			}
		});
	});
}

$(function(){
	//验证产品是否过期
	checkProdcut();
	//为元素添加事件
	controllPro();
	
	//绑定图库事件
	$(".add_img").each(function(index){
		list_index=index;
		$(this).on("click",null,function(){
			var $this = $(this);
			target = $(this).parent();
			$("input[name=gmbutton]").click();
			$(this).blur();
		})
	})
	$("[data-name=imageUrl]").each(function(){
		if($(this).val() !=""){
			$(this).parent().parent().parent().find(".add_img").text("更换栏目图");
		}
	});
	$("input[name=gmbutton]").gmgallery({
		showUploadBut:true,
		showUserUploadList:true,
		multiSelect:false,
		imageTypeObj:$("#galleryImageType"),
		operateType:"other_image",
		options_id:new Date().getTime(),
		onOk:function(response){
			if(response && target){
				target.find(".img_name").find("img").prop({"src":response.url+"@434w_140h_1e_60q"});
				target.parent().parent().parent().find(".group_hidden_Info").find("[data-name='imageUrl']").val(response.url);
				target.find(".add_img").text("更换栏目图");
			}
		},zIndex:'900999'})
	
	//保存
	$(".saveBtn").on("click",null,function(){
		$("#validateform").submit();
	})
	
	//拖动排序
    $(".edit_pro .pro_list").sortable({cursor:"move",stop:function(){
    	
    }});
   
    $(".pro_text input").each(function(){
    	noImageEvent($(this));
	});
	//添加一个栏目
	$(".add_group").click(function(){
		$(".edit").append($("#hot_group").html());
		//添加操作
		controllPro($(this).parent().parent());
		//绑定图库事件
		$(".add_img").each(function(index){
			$(this).on("click",null,function(){
				list_index=index;
				var $this = $(this);
				target = $(this).parent();
				$("input[name=gmbutton]").click();
				$(this).blur();
			})
		})
	});
})

/*页面加载数据时检验产品是否过期*/
function checkProdcut(){
	$("input[data-name=valid]").each(function(){
		var valid=$(this).val();
		var tag=$(this).parent().parent().find(".pro_id");
		if(valid=="false"){
			$(this).parent().parent().addClass("warning");
			tag.append($($(".warning_template")).html());
		}
	});
}


/*查询产品*/
function queryProdcut(target,call){
	var value = target.val();
	var parent = target.parent().parent();
	var productIdInput = parent.find("input[data-name=productId]");
	var thisname = productIdInput.prop("name");
	var oldValue = productIdInput.val();
	var edithot_pv_one=target.parent().parent().parent().nextAll(".edithot_pv").find("span");
	var edithot_pv_leftRight=target.parent().parent().next(".edithot_pv").find("span");
	if(value!=""){
		var toset = true;
		if(toset){
			update = true;
			var id = value;
			var productNameInput= parent.find("input[data-name=productName]");
			var validInput= parent.find("input[data-name=valid]");
			if(oldValue!=value){
				target.parent().append($(".loading_template").html());
				target.parent().find(".query_pro").remove();
				getProdcut(id,function(json){
					if(json.product){
						if (json.productValid && json.productValid==true) {
							var product = json.product;
							if(json.siteProductValid && json.siteProductValid ==true){
								edithot_pv_one.text(product.statistics.itemPageViewWeek+product.statistics.productPageViewWeek);    //顶部轮播pv+店家推荐pv（爆品）
								edithot_pv_leftRight.text(product.statistics.itemPageViewWeek+product.statistics.productPageViewWeek); //店家推荐1pv（爆品）
							
								validInput.val("true");
								productIdInput.val(product.id);
								productNameInput.val(product.name);
								parent.removeClass("warning").removeClass("none");
								parent.find(".pro_name").attr("title",product.name);
								if(product.name.length>maxlen){
									parent.find(".pro_name").text(product.name.substring(0,maxlen)+"...");
								}else{
									parent.find(".pro_name").text(product.name);
								}
							}else{
								clearSet(parent,"产品无效，确认产品是否是该站点下产品","none")
							}
						} else {
							clearSet(parent,"产品无效","none")
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
				})
			}else if(oldValue!=""){
			
			}
		}
	}else{
		update = true;
		clearSet(parent,"")
	}
	target.blur();
}


function getProdcut(id,call,callError){
	$.ajax({
		url:"/recommend/site-product/"+id+"?format=json&m="+Math.random(),
		type:"GET",
		async:false,
		dataType:"json",
		data:{siteId:$("#site").val()},
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
	//添加验证插件
	$("#validateform").validationEngine({
		validateNonVisibleFields : true,
		validationEventTrigger : "",
		showOneMessage : false,
		maxErrorsPerField : 1,
		promptPosition : "topLeft:0,26",
		scroll : true,
		scrollOffset : 100,
		autoHidePrompt : true,
		autoHideDelay : 2000,
		focusFirstField : true
	});
	
	/*重新设置产品的信息*/
	$('.J_sildeSort .item_infos [data-name="productIndex"]').each(function(index,val){
		$(this).val(index);
	});
	$('.J_hotList').each(function(index){
		var $this=$(this),parentIndex=index;
		$this.find('.group_hidden_Info > input').each(function(){
			$(this).prop({'name':'recommendSecondList['+parentIndex+'].'+$(this).attr('data-name')})
			if($(this).attr('data-name')=='productIndex'){
				$(this).prop({'value':parentIndex});
			}
		});
		$this.find('.drag-ele input[data-name="productIndex"]').each(function(index,val){
			var childrenIndex=index;
			$(this).parent().find('input').each(function(index){
				var inputThis=$(this);
				inputThis.prop({'name':'recommendSecondList['+parentIndex+'].children['+childrenIndex+'].'+$(this).attr('data-name')})
			});
			$(this).val(index);
		});
	});
	var form = $("#validateform");
	if (window.Placeholders && !Placeholders.nativeSupport) {
		Placeholders.disable( $("#validateform"));
	}
	var flag = form.validationEngine('validate');
	if (window.Placeholders && !Placeholders.nativeSupport) {
		Placeholders.enable($("#validateform"));
	}
	
	var success = flag;
	

	$("input[data-name=valid]").each(function(){
		var valid=$(this).val();
		var tag=$(this).parent().find("[data-name='productId']");
		if(valid === "false"){
			message="产品编号"+tag.val()+"无效";
			$.gmMessage(message,false);
			success=false;
		}
	});
	
	if(success){
		$(".drag-ele").each(function(i,ele){
			$(ele).find("input").each(function(index2){
				if($(this).attr("data-name")=="productId"){
					if($(this).val()==""){
						$(this).parent().parent().find("input[name=no_product]").validationEngine('showPrompt',"请输入有效产品编号",'error',null,true).focus();
						success=false;
					}
				}
			})
		})
	}
	if(success){
		var scrollTop = $(window).scrollTop();  
		var h=0;
		$(".J_hotList").each(function(){
			h+=$(this).height();
			var len=$(this).find(".pro_list .pro_item").length;
			if(len==0){
				$(this).find(".list_name").validationEngine('showPrompt',"至少设置一个产品，或删除整个该栏目",'error',null,true);
				$(window).scrollTop(scrollTop+h,300);
				success=false;
			}else{
				var imgUrl=$(this).find(".group_hidden_Info").find("input[data-name=imageUrl]");
				if(imgUrl.val()==""){
					$(window).scrollTop(scrollTop+h,300);
					$(this).find(".up_img").validationEngine('showPrompt',"请设置栏目图",'error',null,true);
					success=false;
				}
			}
		})
	}
	return success;
}

/*产品无效，重置元素*/
function clearSet(parent,text,classname){
	parent.find(".set-input-value").val("");
	parent.removeClass("warning").removeClass("none");
	if(text!=""){
		if(classname){
			parent.addClass(classname);
		}
		parent.find(".pro_name").text(text);
	}else{
		if(classname){
			parent.removeClass(classname);
		}
		parent.find(".pro_name").text("产品名称将显示在这里");
	}
}