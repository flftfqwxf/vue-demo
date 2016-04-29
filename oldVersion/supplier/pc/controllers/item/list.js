;!function(controller) {
	//use strict
	'use strict';
	
	controller.using("e97Date");
	controller.using("tools");
	controller.using("compare");
	controller.using("template");
	

	controller.modules={
		init : function(){
			this.sortValueDom=$("#J-order-search").prev().find("span");

			this.event();
		},
		request:function(query){
		   
			var _this=this;
			query=query||{};
			query["line"]=$("[name=line]").val();
			query["departurePlaceId"]=$("[name=departurePlaceId]").val();
			query["keyWord"]=$("[name=keyWord]").val();
			query["line"]=$("[name=line]").val();
			query["sort"]=_this.sortValueDom.attr("data-id");
	
			query["startDate"]=$("#J-startDate").attr("data-value")||"";
			query["endDate"]=$("#J-endDate").attr("data-value")||"";

			query["days"]=$("tr[name=days] .active").attr("data-id")||"";
			query["tourType"]=$("tr[name=tourType] .active").attr("data-id")||"";

			query["page"]=query["page"]||1;

			$("#J-startDate").val(query["startDate"]);
			$("#J-endDate").val(query["endDate"]);
	
			if(query["startDate"]||query["endDate"]){
				$("tr[name=months] a").removeClass("active");
			}
			
			query["months"]=$("tr[name=months] .active").attr("data-id")||"";
			
			var minPrice=$("#J-minPrice"),
			    maxPrice=$("#J-maxPrice"),
			    airlineCode=$("#J-airlineCode");
			minPrice.val(minPrice.attr("data-value")||"");
			maxPrice.val(maxPrice.attr("data-value")||"");
			airlineCode.val(airlineCode.attr("data-value")||"");

			query["minPrice"]=minPrice.attr("data-value")||"";
			query["maxPrice"]=maxPrice.attr("data-value")||"";
			query["airlineCode"]=airlineCode.attr("data-value")||"";

			var form=query["keyWord"] == '' ? $("<form method=\"get\" action=\"/product\"></form>"):$("<form method=\"get\" action=\"/search-input\"></form>");
			for(var key in query){
				if(query[key]){
					form.append("<input type=\"hidden\" name=\""+key+"\" value=\""+query[key]+"\"/>");
				}
			}
			$("body").append(form);
			form.submit();
			form.remove();

		},
		event:function(){
			var _this=this;
			
			//价格输入框限制
	    	$("#validateform input[name=minPrice], #validateform input[name=maxPrice]").keyup(function(e){
			$(this).val($(this).val().replace(/\D/g,''));
			if(e.keyCode==13){
		    		$("#J-price-search").click();
		    	}
		});
	    		
		$(document).on("click",".p-search-box a",function(){
				if(!$(this).hasClass("active")){
					var lineDom=$(this).parents("tr").find("a");
					lineDom.removeClass("active");
					$(this).addClass("active");
				}
				else if(!$(this).parent().hasClass("all")){
					$(this).removeClass("active");
					$(this).parents("tr").find(".all a").addClass("active");
				}

				if($(this).parents("tr[name=months]").size()>0){
					$("#J-startDate, #J-endDate").val("").attr("data-value","");
				}

				_this.request();

			}).on("click",".p-search-box .gm-arrow",function(){
				var box=$(this).parents(".show-box");
				if(box.hasClass("box-open")){
					$(".p-search-box .show-box").scrollTop(0);
					box.removeClass("box-open");
				}
				else{
					box.addClass("box-open");
				}
			}).on("click",".pagination [page]",function(){
			    	if($(this).hasClass("disabled")||$(this).hasClass("active")) return false;
				var page=parseInt($(this).attr("page"));
				_this.request({"page":page});
				$("html,body").animate({scrollTop:0},400);
			}).on("click","#J-order-search li",function(){
				var sort=$(this).attr("data-id");
				var temp=$("#J-order-search");
				temp.hide();
				setTimeout(function(){
		    			temp.removeAttr("style");
				},100);
				_this.sortValueDom.text($(this).text()).attr("data-id",sort);
				_this.request({page:$("li[page].active").attr("page")});
			}).on("click","#J-price-search",function(){
				var minPrice=$("#J-minPrice").val(),
					maxPrice=$("#J-maxPrice").val(),
					minPrice_value=$("#J-minPrice").attr("data-value")||"",
					maxPrice_value=$("#J-maxPrice").attr("data-value")||"";

				if(minPrice!=minPrice_value||maxPrice!=maxPrice_value){
					
					if((!isNaN(minPrice))&&(!isNaN(maxPrice))&&(parseInt(minPrice)>parseInt(maxPrice))){
        			    		$.showMsg("最低价不能高于最高价。");
        			    		return false;
					}
					
        				if(minPrice!=minPrice_value){
        					minPrice_value=minPrice;
        					$("#J-minPrice").attr("data-value",minPrice_value);
        				}
        				if(maxPrice_value!=maxPrice){
        					maxPrice_value=maxPrice;
        					$("#J-maxPrice").attr("data-value",maxPrice_value);
        				}
        				
        			    	_this.request();
				}
				
			}).on("click", "#J-airplane-search",function() {
		                var airline = $("[name=airlineCode]").val(),
		                airline_value = $("[name=airlineCode]").attr("data-value");
		                if (airline != airline_value) {
		                    $("[name=airlineCode]").attr("data-value", airline);
		                    airline_value = airline;
		                    _this.request();
		                }

			}).on("click",".list-search [action=clear]",function(){
				
				if($(this).prev("#J-airlineCode").size()>0){
				    $("[name=airlineCode]").val("").attr("data-value","");
				}
				else{
				    $("[name=minPrice], [name=maxPrice]").val("").attr("data-value","");
				}
				$(this).remove();
				_this.request();
			}).on("click","a[action=go]",function(){
				var input=$(this).parent().prev().find("input"),
					value=$.trim(input.val()),
					max=parseInt(input.attr("max"));
				if(!isNaN(value)){
					value=parseInt(value);
					value=value>0?value:1;
					value=value<=max?value:max;
					_this.request({page:value});
				}
				else input.val("");
			}).on("click",".J-date-btn",function(){
				var startDate=$("#J-startDate").val(),
					endDate=$("#J-endDate").val(),
					startDate_value=$("#J-startDate").attr("data-value")||"",
					endDate_value=$("#J-endDate").attr("data-value")||"";

				if(((startDate!=startDate_value||$("#J-startDate").attr("data-value")!=undefined)||(endDate!=endDate_value||$("#J-endDate").attr("data-value")!=undefined))){
					if(startDate!=startDate_value){
						startDate_value=startDate;
						$("#J-startDate").attr("data-value",startDate_value);
					}
					if(endDate_value!=endDate){
						endDate_value=endDate;
						$("#J-endDate").attr("data-value",endDate_value);
					}
					_this.request();
				}
				
			});
		}
	};
	
	controller.call();

}(new this.jSharp.controller());