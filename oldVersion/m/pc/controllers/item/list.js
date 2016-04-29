;!function(controller) {
	//use strict
	'use strict';
	controller.using("e97Date");
	controller.using("tools");
	controller.using("compare");
	controller.using("template");
	//周边游目的地
	var weekend_areas=[
           	{"areaName":"四川","areaId":2293,"areaItem":[{"cityName":"稻城","cityPinyin":"DaoCheng","cityJianpin":""},{"cityName":"甘孜","cityPinyin":"GanZi","cityJianpin":""},{"cityName":"黄龙","cityPinyin":"HuangLong","cityJianpin":""},{"cityName":"九寨沟","cityPinyin":"JiuZhaiGou","cityJianpin":""},{"cityName":"毕棚沟","cityPinyin":"BiPengGou","cityJianpin":""},{"cityName":"海螺沟","cityPinyin":"HaiLuoGou","cityJianpin":""},{"cityName":"峨眉山","cityPinyin":"EMeiShan","cityJianpin":""},{"cityName":"武隆","cityPinyin":"WuLong","cityJianpin":""},{"cityName":"西岭雪山","cityPinyin":"XiLingXueShan","cityJianpin":""},{"cityName":"都江堰","cityPinyin":"DuJiangYan","cityJianpin":""},{"cityName":"乐山","cityPinyin":"LeShan","cityJianpin":""},{"cityName":"熊猫基地","cityPinyin":"XiongMiaoJiDi","cityJianpin":""},{"cityName":"泸沽湖","cityPinyin":"LuGuHu","cityJianpin":""},{"cityName":"蜀南竹海","cityPinyin":"ShuNanZhuHai","cityJianpin":""}]},
           	{"areaName":"北京","areaId":12,"areaItem":[{"cityName":"鸟巢水立方","cityPinyin":"","cityJianpin":""},{"cityName":"古北水镇","cityPinyin":"","cityJianpin":""},{"cityName":"五台山","cityPinyin":"","cityJianpin":""},{"cityName":"承德","cityPinyin":"","cityJianpin":""},{"cityName":"杜莎夫人蜡像馆","cityPinyin":"","cityJianpin":""},{"cityName":"天安门","cityPinyin":"","cityJianpin":""},{"cityName":"圆明园","cityPinyin":"","cityJianpin":""},{"cityName":"故宫","cityPinyin":"","cityJianpin":""},{"cityName":"八达岭长城","cityPinyin":"","cityJianpin":""},{"cityName":"慕田峪长城","cityPinyin":"","cityJianpin":""},{"cityName":"颐和园","cityPinyin":"","cityJianpin":""},{"cityName":"天坛","cityPinyin":"","cityJianpin":""},{"cityName":"南锣鼓巷","cityPinyin":"","cityJianpin":""},{"cityName":"天津","cityPinyin":"","cityJianpin":""},{"cityName":"秦皇岛","cityPinyin":"","cityJianpin":""},{"cityName":"石家庄","cityPinyin":"","cityJianpin":""}]},
           	{"areaName":"上海","areaId":802,"areaItem":[{"cityName":"迪斯尼","cityPinyin":"","cityJianpin":""},{"cityName":"东方明珠","cityPinyin":"","cityJianpin":""},{"cityName":"野生动物园","cityPinyin":"","cityJianpin":""},{"cityName":"横店影视城","cityPinyin":"","cityJianpin":""},{"cityName":"西塘","cityPinyin":"","cityJianpin":""},{"cityName":"乌镇","cityPinyin":"","cityJianpin":""},{"cityName":"千岛湖","cityPinyin":"","cityJianpin":""},{"cityName":"绍兴","cityPinyin":"","cityJianpin":""},{"cityName":"南京","cityPinyin":"","cityJianpin":""},{"cityName":"华山","cityPinyin":"","cityJianpin":""},{"cityName":"景德镇","cityPinyin":"","cityJianpin":""},{"cityName":"青岛","cityPinyin":"","cityJianpin":""},{"cityName":"合肥","cityPinyin":"","cityJianpin":""},{"cityName":"宁波","cityPinyin":"","cityJianpin":""}]},
           	{"areaName":"广东","areaId":1958,"areaItem":[{"cityName":"黄埔军校","cityPinyin":"","cityJianpin":""},{"cityName":"中山纪念堂","cityPinyin":"","cityJianpin":""},{"cityName":"深圳","cityPinyin":"","cityJianpin":""},{"cityName":"珠海","cityPinyin":"","cityJianpin":""},{"cityName":"长隆","cityPinyin":"","cityJianpin":""},{"cityName":"佛山","cityPinyin":"","cityJianpin":""},{"cityName":"江门","cityPinyin":"","cityJianpin":""},{"cityName":"佛冈","cityPinyin":"","cityJianpin":""},{"cityName":"台山","cityPinyin":"","cityJianpin":""},{"cityName":"韶关","cityPinyin":"","cityJianpin":""},{"cityName":"惠州","cityPinyin":"","cityJianpin":""}]},
           	{"areaName":"重庆","areaId":2251,"areaItem":[{"cityName":"野生动物园","cityPinyin":"","cityJianpin":""},{"cityName":"乐和乐都主题公园","cityPinyin":"","cityJianpin":""},{"cityName":"仙女山","cityPinyin":"","cityJianpin":""},{"cityName":"乌江画廊","cityPinyin":"","cityJianpin":""},{"cityName":"黑山谷","cityPinyin":"","cityJianpin":""},{"cityName":"四川","cityPinyin":"","cityJianpin":""},{"cityName":"大足石刻","cityPinyin":"","cityJianpin":""},{"cityName":"蜀南竹海","cityPinyin":"","cityJianpin":""},{"cityName":"九寨黄龙","cityPinyin":"","cityJianpin":""}]},
           	{"areaName":"浙江","areaId":939,"areaItem":[{"cityName":"千岛湖","cityPinyin":"","cityJianpin":""},{"cityName":"横店影视城","cityPinyin":"","cityJianpin":""},{"cityName":"乌镇","cityPinyin":"","cityJianpin":""},{"cityName":"西溪湿地","cityPinyin":"","cityJianpin":""},{"cityName":"天目湖","cityPinyin":"","cityJianpin":""},{"cityName":"西塘","cityPinyin":"","cityJianpin":""},{"cityName":"莫干山","cityPinyin":"","cityJianpin":""},{"cityName":"上海","cityPinyin":"","cityJianpin":""},{"cityName":"黄山","cityPinyin":"","cityJianpin":""},{"cityName":"庐山","cityPinyin":"","cityJianpin":""},{"cityName":"无锡","cityPinyin":"","cityJianpin":""},{"cityName":"绍兴","cityPinyin":"","cityJianpin":""}]},
           	{"areaName":"江苏","areaId":821,"areaItem":[{"cityName":"总统府","cityPinyin":"","cityJianpin":""},{"cityName":"中山陵","cityPinyin":"","cityJianpin":""},{"cityName":"扬州","cityPinyin":"","cityJianpin":""},{"cityName":"太湖湿地公园","cityPinyin":"","cityJianpin":""},{"cityName":"上海","cityPinyin":"","cityJianpin":""},{"cityName":"夫子庙","cityPinyin":"","cityJianpin":""},{"cityName":"周庄古镇","cityPinyin":"","cityJianpin":""},{"cityName":"九华山","cityPinyin":"","cityJianpin":""},{"cityName":"南京","cityPinyin":"","cityJianpin":""},{"cityName":"杭州","cityPinyin":"","cityJianpin":""},{"cityName":"无锡","cityPinyin":"","cityJianpin":""},{"cityName":"镇江","cityPinyin":"","cityJianpin":""},{"cityName":"南通","cityPinyin":"","cityJianpin":""}]}
           					];
	controller.modules={
		init : function(){
			this.sortValueDom=$("#J-order-search").prev().find("span");
			this.destinationCity();
			this.request();
			this.event();

		},
		destinationCity:function(){
			var provinceID=$("#provinceID").val();
			if(provinceID){
				var id=parseInt(provinceID),
				len= weekend_areas.length,
				html="",
				i=0,j=0;
				for (i = 0; i < len; i++) {
					if(weekend_areas[i].areaId == id){
						var count=weekend_areas[i].areaItem.length;
						for (j = 0; j < count; j++) {
							html+="<a>"+weekend_areas[i].areaItem[j].cityName+"</a>";
						}
					}
				}
				$(".destination_city").append(html);
			}else{
				return;
			}
		},
		request:function(query){
			var _this=this;
			query=query||{};
			query["column"]=$("input[name=column]").val();
			if($("[name=siteArea]").val() !=""){
				query["siteArea"]=$("[name=siteArea]").val();
			}
			query["keyword"]=$("[name=keyword]").val();
			query["sort"]=_this.sortValueDom.attr("data-id");
			query["departureTime"]=$("tr[name=departureTime] .active").attr("data-id")||"";
			
			query["earliestDepartureTime"]=$("#J-startDate").attr("data-value")||"";
			query["latestDepartureTime"]=$("#J-endDate").attr("data-value")||"";

			query["destination"]=$("tr[name=destination]:visible .active").text()||"";
			query["destination"]=(query["destination"]=="不限"?"":query["destination"]);
			
			query["lineId"]=$("tr[name=lineIds] .active").attr("data-id")||"";//根据单个专线查询
			
			query["tripDays"]=$("tr[name=tripDays] .active").attr("data-id")||"";
			query["tourType"]=$("tr[name=tourType] .active").attr("data-id")||"";
			
			query["page"]=query["page"]||1;

			$("#J-startDate").val(query["earliestDepartureTime"]);
			$("#J-endDate").val(query["latestDepartureTime"]);
			$("#J-list").parents().removeClass("loaded");

			if(query["earliestDepartureTime"]||query["latestDepartureTime"]){
				$("tr[name=departureTime] a").removeClass("active");
			}
			if(query["earliestDepartureTime"]==""&&query["latestDepartureTime"]==""&&query["departureTime"]==""){
				$("tr[name=departureTime] .all a").addClass("active");
			}
			var minPrice=$("#J-minPrice"),
				maxPrice=$("#J-maxPrice");
			minPrice.val(minPrice.attr("data-value")||"");
			maxPrice.val(maxPrice.attr("data-value")||"");

			query["minPrice"]=minPrice.attr("data-value")||"";
			query["maxPrice"]=maxPrice.attr("data-value")||"";
			
			if($(".p-counter").is(":visible")){
        			var pageUrl=window.location.pathname;
        			for(var key in query){
        			       if(query[key]){
        				   pageUrl+="&"+key+"="+(query[key]||"");
        			       }
        			}
        			pageUrl=pageUrl.replace("&","?");
        			window._hmt.push(['_trackPageview',pageUrl]);
			}
			
			$(".p-counter").hide();
			$.ajax({
				url:"/search.json",
				type:"get",
				data:query,
				dataType:"json",
				success:function(serverData){
					if(serverData.pagination.pageCount>0){
						var result=_this.pageHandler(serverData.pagination.currentPage,serverData.pagination.pageCount);
						serverData["prev"]=result.prev;
						serverData["next"]=result.next;
						serverData["pageList"]=result.pageList;
						serverData["logined"]=$(".login_hover").size()>0?true:false;
					}
					_this.listBuild(serverData);
					
					if($(".compare-toolbar").size()==0){
					    _this.compare();
					}
					
					//compare btn update
					_this.compareBtnUpdate();
				}
			});
		},
		compare:function(){
			var box=$(".list-box");
			box.compare({
				addBtn:"compare-btn",
				addText:"+ 加入对比",
				cancelText:"- 取消对比",
				mode:"list",
				getData:function($this){
					var data={},
						li=$this.parents("li");
					
					data.pic=li.attr("data-pic")||"";
					data.id=li.attr("data-id")||"";
					data.title=li.attr("data-title")||"";
					data.startPlace=li.attr("data-startPlace")||"";
					data.price=li.attr("data-price")||"";
					return data;
				},
				actionUrl:"/item-compare",
				postDataName:"itemIds",
				productUrl:"/item/",
				direction:(box.attr("type")=="manage"?"right":"center")
			});
		},
		compareBtnUpdate:function(){
	    	var id;
	    	$(".compare-btn").each(function(){
	    		id=$(this).parents("li").attr("data-id");
	    		if($(".compare-data[data-id="+id+"]").size()>0){
		    		$(this).text("- 取消对比");
	    		}
	    	});
	    },
		listBuild:function(serverData){
			if(serverData.pagination.count==0&&$("body").hasClass("searching")){
				$("body.searching").removeClass("searching").addClass("no-result");
				return false;
			}
			else{
				$("body.searching").removeClass("searching");
			}
			$(".p-counter strong").text(serverData.pagination.count).parent().show();
			$("#J-list").parents().addClass("loaded");
			$("#J-list").html(template("J-list-tpl",serverData));

		},
		pageHandler:function(currentPage,pageCount){
			var pageList="",
				prev=(currentPage-1>0?currentPage-1:1),
		    	next=(currentPage+1>pageCount?pageCount:currentPage+1),
		    	spaceNum=5,
		    	spaceIndex=currentPage%5==0?parseInt(currentPage/5-1)*5+1:parseInt(currentPage/5)*5+1,
		    	maxIndex=(spaceIndex+5)>pageCount?pageCount:(spaceIndex+5);
			for(var i=spaceIndex;i<=maxIndex;i++){
				if(i!=pageCount&&i==maxIndex){
				    pageList+="<li page=\""+i+"\"><a>...</a></li>";
				}
				else if(i==spaceIndex&&i!=1){
				    pageList+="<li page=\""+(i-1)+"\"><a>...</a></li>";
				    pageList+="<li page=\""+i+"\" "+((currentPage==i)?"class=\"active\"":"")+"><a>"+i+"</a></li>";
				}
				else{
				   pageList+="<li page=\""+i+"\" "+((currentPage==i)?"class=\"active\"":"")+"><a>"+i+"</a></li>";
				}    		
			}
			return {pageList:pageList,prev:prev,next:next};
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
				if($(this).hasClass("disabled")){
		    	    return false;
		    	}
				
				if(!$(this).hasClass("active")){
					var lineDom=$(this).parents("tr").find("a");
					lineDom.removeClass("active");
					$(this).addClass("active");
				}
				else if(!$(this).parent().hasClass("all")){
					$(this).removeClass("active");
					$(this).parents("tr").find(".all a").addClass("active");
				}

				if($(this).parents("tr[name=departureTime]").size()>0){
					$("#J-startDate, #J-endDate").val("").attr("data-value","");
				}

				if($(this).parents("tr[name=lineIds]").size()>0){
				    $(".area-data").hide();
				    $(".area-data .active").removeClass("active");
				    $(".area-data .all a").addClass("active");
				    $(".area-data[data-name=\""+$(this).text()+"\"]").show();
				}
				if($("tr[name=lineIds] a.active").text()=="游轮"){
				    $("tr[name=tourType] .all a").removeClass("active").addClass("disabled");
				    $("a[data-id=group]").removeClass("active").addClass("disabled");
				    $("a[data-id=freewalker]").removeClass("active").addClass("disabled");
				    $("a[data-id=ship]").removeClass("disabled").addClass("active");
				}
				else if($(this).parents("tr[name=tourType]").size()==0&&$("tr[name=tourType] a.active").text()=="游轮"){
				    $("a[data-id=group]").removeClass("disabled");
				    $("a[data-id=freewalker]").removeClass("disabled");
				    $("a[data-id=ship]").removeClass("active");
				    $("tr[name=tourType] .all a").removeClass("disabled").addClass("active");;
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
				
			    	if($(this).prev("[action=clear]").size()==0){
			    		$(this).before("<a action=\"clear\">清除</a>");
			    	}
			    	else if((!minPrice_value)&&(!minPrice_value)){
			    		$(this).prev("[action=clear]").remove();
			    	}
			    	_this.request();
				}
				
			}).on("click",".list-search [action=clear]",function(){
				$(this).remove();
				$("[name=minPrice], [name=maxPrice]").val("").attr("data-value","");
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