var target = null;
var first = true;
var update = false;
var defaultUrl = WEB_STATIC_DISTRIBUTOR + "/theme/manage/blue/images/blank.png";
var maxlen = 20;
var checkupdate = false;
var maxrecommend = 30;
var drag = false;
var arrayObj = new Array("abroad","domestic","around");//创建一个数组并赋值

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
	
	var type_index = $("input[name=recommendAlias]").val();
	if(type_index!=""){
		var correct = false;
		for(var i=0;i<arrayObj.length;i++){
			if(type_index==arrayObj[i]){
				correct = true;
				break;
			}
		}
		if(correct==false){
			type_index = "";
		}
	}
	    //切换国内境外周边游
    $(".title-ul li").each(function(i){
    	var $showObj;
        $(this).click(function(){
            $(this).addClass('select').siblings().removeClass('select');
            if($(this).index()==0){
            	$(".under_line").css("left","9px")
            }else if($(this).index()==1){
                $(".under_line").css("left","160px")
            }else if($(this).index()==2){
                $(".under_line").css("left","314px")
            }
            var type = $(this).attr('type');
            var tbBox = $(".tb-box").addClass("tb-box-hide").eq(i);
            tbBox.removeClass("tb-box-hide");
            $(".f5:eq("+i+")").attr("type",type).click();
        });
    });
    
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
	
	$(".j_add_pro").each(function(){
		
		var addthis = $(this);
		var pro_length = $(this).parent().find("ul").find("li.pro_item").length;
		if(pro_length==maxrecommend){
			$(this).hide();
		}
		
		$(this).on("click",null,function(){
			$(this).parent().find("ul").append($("#pro_item").html());
			$(this).parent().find("ul").find(".pro_text_noimage input:last").each(function(){
				noImageEvent($(this));
			});
			//编号
			number();
			var del_pro = $(this).parent().find(".del_pro");
			del_pro.each(function(){
				$(this).click(function(){
					$(this).parent().remove();
					var pro_length = addthis.parent().find("ul").find("li.pro_item").length;
					if(pro_length<maxrecommend){
						addthis.show();
					}
					//编号
					number();
				});
			});
			
			var pro_length = $(this).parent().find("ul").find("li.pro_item").length;
			if(pro_length==maxrecommend){
				addthis.hide();
			}
		})
		
		var del_pro = $(this).parent().find(".del_pro");
		del_pro.each(function(){
			$(this).click(function(){
				$(this).parent().remove();
				var pro_length = addthis.parent().find("ul").find("li.pro_item").length;
				if(pro_length<maxrecommend){
					addthis.show();
				}
				//编号
				number();
			});
		});
	})
	
	//拖动排序
    $(".edit_pro .pro_list").sortable({cursor:"move",stop:function(){
    	update = true;
    	drag = true;
    	//编号
	    number();
    }});
	
    var url;
    $('.f5').each(function(){
    	$(this).click(function(){
        	var type = $(this).attr("type");
        	var countCover = 0;
            var countList = 0;
            var dataList = {};
            dataList["column"] = type;
            var parentObj = null;
           
            if(type==arrayObj[0]){
            	parentObj = $(".out-box");
            }
            if(type==arrayObj[1]){
            	parentObj = $(".in-box");
            }
            if(type==arrayObj[2]){
            	parentObj = $(".local-box");
            }
            parentObj.find(".pro_list_up").find("input[name=itemid]").each(function(i){
                if($(this).val()!==""){
                    dataList["coverItems["+(countCover)+"].id"]=$(this).val();
                    countCover++;
                }
            });
            parentObj.find(".pro_list").find("input[name=itemid]").each(function(i){
                if($(this).val()!==""){
                    dataList["listItems["+(countList)+"].id"]=$(this).val();
                    countList++;
                }
            });
            url = "http://" + $('input[name="shopDomain"]').val() + "/"+dataList['column']+"?client=pc&_=" + Math.random();
    		$.each(dataList,function(k,v){
    			if(k!='column'){
    				url += "&"+ k + "=" + encodeURI(v);
    			}
    		});
    		$('#previewFrame').attr('src', url);
        });
    })
    //$('.f5:eq(0)').attr("type",$(".title-ul li:eq(0)").attr("type")).click();
	if(type_index==""){
		$(".tb-box").each(function(i){
			if($(this).find(".query_warning").html()){
				type_index =$(".title-ul li:eq("+i+")").attr("type");
				return false;
			}
		});
	}
    
    if(type_index==""){
    	type_index = type_index =$(".title-ul li:eq(0)").attr("type");
    }
    
	getActiveType(type_index).click();
	
	$("#subBtn").on("click",null,function(){
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


function clearSetNoImage(parent,text,classname){
	parent.find("input[name=itemid]").val("");
	parent.find(".set-input-value").val("");
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
}

function checkProdcutNoImage(target,call){
	var value = target.val();
	var parent = target.parent().parent();
	var itemInput = parent.find("input[name=itemid]");
	var validInput= parent.find("input[data-name=valid]");
	var availableInput= parent.find("input[data-name=available]");
	var productIdnoimageInput = parent.find("input[data-name=productId]");
	var productNamenoimageInput = parent.find("input[data-name=productName]");
	var thisname =productIdnoimageInput.prop("name");
	
	if(value!=""){
		var toset = true;
		var oldValue = productIdnoimageInput.val();
		if(toset){
			var id = value;
			if(oldValue!=value){
				update = true;
				target.parent().append($(".loading_template").html());
				target.parent().find(".query_pro").remove();
				getProdcut(id,function(json){
					if(json.product){
						var success = false;
						var product = json.product;
						var region = product.touristLine.region;
						var lineId = product.touristLine.id;
						var type = getActiveType().attr("type");
						if(type==arrayObj[2]){
							//四川
							if(lineId==1){
								success = true;
							}
						}else if(type==arrayObj[1]){
							//国内
							if(region==1){
								success = true;
							}
						}else if(type==arrayObj[0]){
							//出境
							if(region==2 || region==4){
								success = true;
							}
						}
						if(success){
							if(product.available==true && product.onShelf==true && product.deadline==false){
								itemInput.val(json.itemId);
								validInput.val("true");
								availableInput.val("true");
								productIdnoimageInput.val(product.id);
								productNamenoimageInput.val(product.name);
								parent.removeClass("warning").removeClass("none");
								if(product.name.length>maxlen){
									parent.find(".pro_name").text(product.name.substring(0,maxlen)+"...");
								}else{
									parent.find(".pro_name").text(product.name);
								}
								parent.find(".pro_name").attr("title",function(){
									return product.name;
								});
								changeValid(parent);
							}else{
								clearSetNoImage(parent,"产品无效","warning")
							}
						}else{
							clearSetNoImage(parent,"产品无效,确认该产品是否是"+getActiveType().text()+"产品","warning")
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


function getActiveType(index){
	if(index){
		return $(".title-ul li[type="+index+"]"); 
	}
	return $(".title-ul li.select"); 
}

function setListName(){
	$(".pro_list").each(function(index){
		var type = $(this).attr("data-type");
		var typevalue = $(this).attr("data-value");
		$(this).find(".drag-ele").each(function(subindex){
			$(this).find("input").each(function(){
				var dataname = $(this).attr("data-name");
				if(dataname){
					$(this).prop("name",type+"["+(subindex+4)+"]."+dataname);
					if(dataname=="productIndex"){
						$(this).val(subindex);
					}else if(dataname=="recommendType"){
						$(this).val(typevalue);
					}
				}
			})
		})
	});
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

function setValid(){
	$("input[data-name=valid]").each(function(){
		if($(this).val()==""){
			$(this).val("true");
		}
	})
	$("input[data-name=available]").each(function(){
		if($(this).val()==""){
			$(this).val("true");
		}
	})
}

function checkForm(){
	$("input[name=recommendAlias]").val(getActiveType().attr("type"));
	setValid();
	setListName();
	return true;
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
