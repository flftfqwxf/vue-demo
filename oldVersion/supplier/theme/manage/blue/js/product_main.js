$(function(){
	Product.path = "/supplier";
	Product.load = function(id,sys){
		if(id){
			$.ajax({
				url:Product.path + "/tour/"+id+".json",
				async:false,
				cache:false,
				dataType:"json",
				success:function(d){
					if(!d){
						$.alert("行程不存在！")
						window.close();
						return false;
					}
					Product.data = d.tour;
					Product.lineId = d.tour.touristLine.id;
					reset();
				}
			})
			Product.sys = !!sys;
		}else{
			Product.data = null;
			Product.lineId = Product.utils.getUrlParam("lineId");
			if(!Product.lineId){
				$.alert("参数错误","警告","error",function(){
					window.close();
				})
				return false;
			}
			
			reset();
		}
		
		function reset(){
			$("#step_body>div").empty();
			$("#step_btn").find(".step").data("formData",null).eq(0).click();
		}
	}
	
	Product.$form = $("#form").validationEngine({validateNonVisibleFields:false,scroll:true,scrollOffset:100,autoHidePrompt:true,autoHideDelay:10000,focusFirstField:true});
	$("#step_btn").on("click",".step",function(e,d){
		var $this = $(this), className = "current",
			$current = $this.closest("#step_btn").find("."+className), 
			$old = $("#"+$current.attr("rel"));
		if(!d){
			var res = $old.triggerHandler("hide");
			if(res === false)
				return false;
			$current.data("formData",res).removeClass(className)
		}
		$current.removeClass(className);
		$old.hide();
		var c = $this.addClass(className).attr("rel"), $tar = $("#"+c);
		if($tar.html()==""){
			    //start
			    
				$(".mask").show();
				$(".loading-wrap").show();
			$tar.load(Product.path + "/tour/"+c,function(){
				Product[c].init(Product.data||{});
				//load over
//				return false;
				$(".loading-wrap").hide();
				$(".mask").hide();

			})
			
			
		}
		$tar.show().trigger("show");
	})
	
	$(document).on("click","[tourid]",function(){
		var id = $(this).attr("tourid");
		Product.load(id);
	}).on("click",".new-trip-bt",function(){
		$.confirm(
				"您未保存的内容将会丢失！", 
				"确认新建行程？", 
				function() {
					Product.load();
				},
				function(){}
			)
		return false;
	})
	
	function initFormEvents(){
		var submitForm = function(url){
			var data = [];
			$(".step","#step_btn").each(function(){
				var $t = $(this);
				if($t.is(".current")){
					var res = $("#"+$t.attr("rel")).triggerHandler("hide");
					if(res === false){
						data = null;
						return false;
					}
					$t.data("formData",res);
					data = data.concat(res);
				}else{
					var d = $t.data("formData");
					if(!d){
						if(Product.data){
							d = [];
							$.each(Product.data.dailyTrips,function(i){
								d = d.concat(jsonToInput(this,"dailyTrips["+i+"]"));
							})
						}else{
							data = null;
							return false;
						}
					}
					data = data.concat(d);
				}
			})
			if(data == null)
				return false;
			Product.lineId && data.push({name:"touristLine.id",value:Product.lineId})
			var dialog = $.dialog({
				isClose: false,
			    title: false,
			    //lock:true,
			    zIndex:12000,
			    content: '正在提交，请稍候。。。'
			});
			$.post(url,data,function(d){
				if(typeof d == "string")
					d = JSON.parse(d);
				if(d.result && d.result.success == false){
					$.gmMessage(d.result.message,true);
					return;
				}
				$.unbindbeforeout();
				$.gmMessage("操作成功",true);
				setTimeout(function(){
					window.close();
				},1000)
				opener && opener.Plan.afterAddTour(d.tour);
			}).fail(function(){
				$.gmMessage("保存失败，请稍后重试");
			}).always(function(){
					dialog.close()
			});
			//form.submit();
		}
		
		$('#btnSave').click(function(){
			var $next = $(".current","#step_btn").next(".step");
			if($next.length){
				$next.click();
			}else{
				submitForm(Product.path+"/tour/group-tour/input.json")
			}
		});
		
	}
	function jsonToInput(json,p){
		var data = [];
		$.each(json,function(k,v){
			if(v == null)
				return;
			var o = {},n = (p?(p+"."):"")+k.replace("_",".");
			if($.isArray(v)){
				$.each(v,function(i){
					data = data.concat(jsonToInput(this,n+"["+i+"]"))
				})
			}else if($.isPlainObject(v)){
				data = data.concat(jsonToInput(this,n))
			}else{
				o.name = n;
				o.value = v;
				data.push(o);
			}
		})
		return data;
	}

	var tourId = Product.utils.getUrlParam("id");
	tourId && Product.load(tourId);
	initFormEvents();
	$.bindbeforeout();
})