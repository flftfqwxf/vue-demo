//heyadong
$(function () {
	var $lineId = Tour.current.lineId;
	var $left = $(".left-list");
	var $copyTour = null;
	var $pagesize = 10;
	
	var $defaultParams = {line: $lineId, size: $pagesize};
	var $url = null;
	var $currentParams = $.extend({}, $defaultParams);
	var $msg = {
			change_tour : "现在切换将导致当前内容丢失.是否确认?"
	}
	
	template.helper('subdate', function (date) {
		if(!date || date.length < 10) {
			return "";
		} else {
			return date.substring(0,10);
		}
	});
	template.helper('maxstring', function(str, max, suffix){
		
		max = max || 10;
		suffix = suffix || "...";
		if (str && str.length > max) {
			return str.substring(0, max) + suffix;
		} else if (!str) {
			return "";
		} else {
			return str;
		}
	});
	var addTourItem = function(data){
		var ul = $(this);
		
		ul.closest(".submenu").show();
		var tours = data.tours;
		
		
		var html = "";
		$.each(tours, function(i, e){
			html += template("tmp_left_tour", e);
		});

		ul.html(html);
		
		//分页
		var p = data.pagination;
		$(ul).parent().find(".pager").remove();
		if (p.pageCount > 1) {
			
			var pre = p.currentPage == 1 ? 0 : p.currentPage-1;
			var next = p.currentPage < p.pageCount ? p.currentPage + 1 : 0;
			$(ul).parent().append(template("tmp_left_pagination", {pre:pre, next:next}));
			
			var pagination = $(ul).parent().find(".pager");
			$(".page", pagination).click(function(){
				var n = $(this).attr("page");
				if (n != 0) {
					$currentParams = $.extend($currentParams, {"page": n });
					$.getJSON($url, $currentParams, function(data){
						addTourItem.call(ul, data);
						$("li[tour="+$copyTour+"]", ul).find("div[class=tour]").addClass("selected");
					});
				}
			});
			
		}
		
		
		$(".show", ul).click(function(){
			var _this = $(this);
			var callback = function(){
				var id = _this.closest("li").attr("tour");
				$copyTour = id;
				Tour.load(id, true);
				$(".tour", ul).removeClass("selected");
				_this.closest(".tour").addClass("selected");
			}
			
			
			if ($copyTour) {
				$.confirm($msg.change_tour , "操作提示", callback, $.noop);
			} else {
				callback();
			}
		});
		
		$(".del", ul).click(function(){
			var _this = this;
			var li = $(_this).closest("li");
			var id = li.attr("tour");
			$.confirm("是否确认删除该行程", "操作提示", function(){
				 $.ajax({
	               url: "/tour/" + id + ".json",
	               type: "delete",
	               success: function (data) {
	                   if(data.result.success){
	                       $(_this).closest("li").remove();
	                       $.alert(data.result.message,"删除结果提示");
	                   }else{
	                       $.alert(data.result.message,"删除结果提示");
	                   }
	               }
				 });
			},function(){});
		});
	}
	var activeMenu = function() {
		$(".menu", $left).removeClass("active");
		$(".submenu", $left).hide();
		$(this).addClass("active");
	} 
	
	var switchMenu = function(ok, cancel){
		
		var thisMenu = $(this);
		if ($copyTour || $(".newtour.active", $left).length > 0) {
			$.confirm($msg.change_tour, "操作提示", function(){
				activeMenu.call(thisMenu);
				$copyTour = null;
				Tour.load();
				if (ok) {
					ok();
				}
			}, function(){
				if(cancel) {
					cancel();
				}
			});
		} else {
			if (ok) {
				ok();
				activeMenu.call(thisMenu);
			}
		}
	}
	
	$(".newtour", $left).click(function(){
		switchMenu.call(this, function(){
			$(".copytip").hide();
			Tour.load(); 
		});
	});
	
	
	$(".minetour", $left).click(function(){
		var $mine = $(this).closest(".mine");
		var ul = $mine.find("ul");
		switchMenu.call(this, function(){
			$copyTour = null;
			$(".copytip").show();
			$url = "/tour/list/supplier.json?_="+Math.random();
			$currentParams = $.extend({},$defaultParams);
			$(".search-empty", $mine).hide();
			$.getJSON($url, $currentParams, function(data){
				addTourItem.call(ul, data);
				if (data.tours.length == 0) {
					$(".mine .search").hide();
					$(".mine .tour-empty").show();
				} else {
					$(".mine .tour-empty").hide();
				}
			});
		});
	}).parent().find(".icon-search").click(function(){
		var _this = $(this);
		var callback = function(){
			
			var ul = _this.closest(".mine").find("ul.items");
			var keyword = _this.prev("input.content").val();
			$(".copytip").show();
			$url = "/tour/list/supplier.json?_="+Math.random();
			$currentParams = $.extend({},$defaultParams);
			$currentParams.name = keyword;
			$.getJSON($url, $currentParams, function(data){
				addTourItem.call(ul, data);
				$(".mine .tour-empty").hide();
				if (data.tours.length == 0) {
					$(_this).closest(".submenu").find(".search-empty").show();
				} else {
					$(_this).closest(".submenu").find(".search-empty").hide();
					if ($copyTour) {
						$("li[tour="+$copyTour+"]", ul).find("div[class=tour]").addClass("selected");
					}
				}
			});
			
		}
		

			callback();

		
		
	});
	
	
	$(".systour", $left).click(function(){
		var $sys = $(this).closest(".system");
		var ul = $sys.find("ul.items");
		switchMenu.call(this, function(){
			$copyTour = null;
			$(".search-empty", $sys).hide();
			$(".copytip").show();
			$url = "/tour/list/system.json?_="+Math.random();
			$currentParams = $.extend({},$defaultParams);
			$.getJSON($url, $defaultParams, function(data){
				addTourItem.call(ul, data);
			});
			
		});
	}).parent().find(".icon-search").click(function(){
		var _this = $(this);
		var callback = function(){
			
			var ul = _this.closest(".system").find("ul.items");
			var keyword = _this.prev("input.content").val();
			$(".copytip").show();
			$url = "/tour/list/system.json?_="+Math.random();
			$currentParams = $.extend({},$defaultParams);
			$currentParams.name = keyword;
			$.getJSON($url, $currentParams, function(data){
				addTourItem.call(ul, data);
				if (data.tours.length == 0) {
					$(_this).closest(".submenu").find(".search-empty").show();
				} else {
					$(_this).closest(".submenu").find(".search-empty").hide();
					if ($copyTour) {
						$("li[tour="+$copyTour+"]", ul).find("div[class=tour]").addClass("selected");
					}
				}
			});
			
		}
		
			callback();
	});
	
	 
	var type = Tour.utils.getUrlParam("type");
	if (type=="mine") {
		Tour.load();
		$(".minetour", $left).click();
	} else if (type=="sys") {
		Tour.load();
		$(".systour", $left).click();
	} else {
		$(".newtour", $left).click();
	}
});