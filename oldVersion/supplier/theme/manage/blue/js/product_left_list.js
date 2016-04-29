//heyadong
$(function () {
	var $lineId = Product.utils.getUrlParam("lineId");
	var $left = $(".left-list");
	var $copyTour = null;
	var $pagesize = 5;
	
	var $defaultParams = {line: $lineId, size: $pagesize};
	var $url = null;
	var $currentParams = $.extend({}, $defaultParams);
	var $msg = {
			change_tour : "现在切换将导致当前内容丢失，是否确认?"
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
		console.log(tours);
		
		var html = "";
		$.each(tours, function(i, e){
			html += template("tmp_left_tour", e);
		});
		console.log(html);
		ul.html(html);
		
		//分页
		var p = data.pagination;
		if (p.pageCount > 1) {
			$(ul).next(".pager").remove();
			
			var pre = p.currentPage == 1 ? 0 : p.currentPage-1;
			var next = p.currentPage < p.pageCount ? p.currentPage + 1 : 0;
			$(ul).parent().append(template("tmp_left_pagination", {pre:pre, next:next}));
			
			var pagination = $(ul).next(".pager")
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
				Product.load(id, true);
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
	               url: "/supplier/tour/" + id + ".json",
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
				Product.load();
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
			Product.load(); 
		});
	}).click();
	
	
	$(".minetour", $left).click(function(){
		var ul = $(this).closest(".mine").find("ul");
		switchMenu.call(this, function(){
			$(".copytip").show();
			$url = "/supplier/tour/list/supplier.json?_="+Math.random();
			$currentParams = $.extend({},$defaultParams);
			$.getJSON($url, $currentParams, function(data){
				addTourItem.call(ul, data);
				
			});
		});
	}).parent().find(".icon-search").click(function(){
		var _this = $(this);
		var callback = function(){
			$copyTour = null;
			var ul = _this.closest(".mine").find("ul.items");
			var keyword = _this.prev("input.content").val();
			$(".copytip").show();
			$url = "/supplier/tour/list/supplier.json?_="+Math.random();
			$currentParams = $.extend({},$defaultParams);
			$currentParams.name = keyword;
			$.getJSON($url, $currentParams, function(data){
				addTourItem.call(ul, data);
			});
			
		}
		
		if ($copyTour) {
			$.confirm($msg.change_tour , "操作提示", callback, $.noop);
		} else {
			callback();
		}
		
		
	});
	
	
	$(".systour", $left).click(function(){
		var ul = $(this).closest(".system").find("ul.items");
		switchMenu.call(this, function(){
			$(".copytip").show();
			$url = "/supplier/tour/list/system.json?_="+Math.random();
			$currentParams = $.extend({},$defaultParams);
			$.getJSON($url, $defaultParams, function(data){
				addTourItem.call(ul, data);
			});
		});
	}).parent().find(".icon-search").click(function(){
		var _this = $(this);
		var callback = function(){
			$copyTour = null;
			var ul = _this.closest(".system").find("ul.items");
			var keyword = _this.prev("input.content").val();
			$(".copytip").show();
			$url = "/supplier/tour/list/system.json?_="+Math.random();
			$currentParams = $.extend({},$defaultParams);
			$currentParams.name = keyword;
			$.getJSON($url, $currentParams, function(data){
				addTourItem.call(ul, data);
			});
			
		}
		
		if ($copyTour) {
			$.confirm($msg.change_tour , "操作提示", callback, $.noop);
		} else {
			callback();
		}
	});;
	
	
//
//    var getList = function (targetObj, url, container,isSearch, isMine) {
//     if($(targetObj).find("div").length>0){
//            $(targetObj).pagination("destroy");
//        }
//
//        $(targetObj).pagination({
//            //dataSource:data,//"/sight-select.json?limit=10&keyword=a&timestamp=1428630672795&lineId=22&size=10&count=100",
//            dataSource: url,
//            locator: "tours",
//            triggerPagingOnInit: true,
//            hideWhenLessThanOnePage: false,
//            alias: {
//                pageNumber: 'page',
//                pageSize: 'size'
//            },
//            getTotalPageByResponse: function (data) {
//                return data.pagination.pageCount;
//            },
//            pageSize: 8,
//            callback: function (d, p) {
//                //d=[];
//                var liDom = "";
//                //p.totalPage=0;
//                if (p.totalPage) {
//                    liDom+="";
//                    for (var i = 0; i < d.length; i++) {
//                        liDom += ' <li class="list-one li-selected">';
//                        liDom += ' <div class="li-left">';
//                        liDom += ' <div class="li-title">' + d[i].name + '</div>';
//                        liDom += '<div class="time-cus">';
//                        liDom += ' <span class="li-time">' + d[i].createTime + '</span>';
//                        liDom += ' <span class="li-cus">' + (d[i]["user"] == null ? "--" : d[i]["user"].name == null ? "--" : d[i]["user"].name) + '</span>';
//                        liDom += ' </div>';
//                        liDom += ' </div>';
//                        liDom += ' <div class="li-right">';
//                        liDom += ' <a class="detail-bt view" tourid="' + d[i].id + '">查看' + (isMine ? "<span  class='delete-bt'>删除" : "") + '</span>' + '</a>';
//                        liDom += ' </div>';
//                        liDom += ' </li>';
//                    }
//                }else{
//                    liDom = "";
//                    isMine?$(".mine-list-page").hide():$(".sys-list-page").hide();
//                    liDom+=isSearch?"<div class='no-result-search result-search'>无结果，请调整搜索条件后再试</div>":"<div class='no-result-load result-search'><p>暂无行程，您可以:</p><li>新建一条行程</li><li>使用系统行程</li></div>";
//                }
//
//                $(container).empty();
//                $(liDom).appendTo($(container));
//                //showFirst(isMine ? $(".mine-t") : $(".sys-t"));
//                //if(isMine){
//                //    showFirst($(".mine-t"));
//                //}
//
//                if(!isMine&&isSearch){
//                    showFirst($(".sys-t"));
//                }else{
//                    showFirst($(".mine-t"));
//                }
//
//            }
//        });
//    }
//
//    var lineId = Product.utils.getUrlParam("lineId");
//    getList(".mine-list-page", "/supplier/tour/list/supplier.json?line=" + lineId, ".mine-list-ul",false, true);
//    getList(".sys-list-page", "/supplier/tour/list/system.json?line=" + lineId, ".sys-list-ul",false, false);
//
//
//    $(".mine").click(function () {
//        //getList(".mine-list-page", "/supplier/tour/list/supplier.json?line=" + lineId, ".mine-list-ul",false, true);
//        $(".search-bt").attr("kind", "supplier");
//        $(this).addClass("selected-style");
//        $(".sys").removeClass("selected-style")
//        $(".mine-t").show();
//        $(".sys-t").css("display", "none");
//        showFirst($(".mine-t"));
//        return false;
//    })
//
//    $(".sys").click(function () {
//        $(".search-bt").attr("kind", "system");
//        $(this).addClass("selected-style");
//        $(".mine").removeClass("selected-style")
//        $(".sys-t").css("display", "block");
//        $(".mine-t").css("display", "none");
//        $(".del_but").css("display", "none");
//        showFirst($(".sys-t"));
//        return false;
//    })
//
//
//    //显示删除按钮
//    $(".left-list").on("mouseover", ".detail-bt", function () {
//        $(this).find(".delete-bt").css("display", "block");
//    }).on("mouseout", ".detail-bt", function () {
//        $(this).find(".delete-bt").css("display", "none");
//    }).on("click", ".view", function () {
//    	
//    	if($(".sys").hasClass("selected-style")){
//    		Product.load($(this).attr("tourid"),1)
//    	}else{
//    		Product.load($(this).attr("tourid"))
//    	}
//        
//        
//    }).on("click", ".delete-bt", function (e) {
//        e.stopPropagation();
//        var that = $(this);
//        var tourId = $(this).parent().attr("tourid");
//        deleteAction(
//            function () {
//                that.parents(".list-one").remove();
//            },
//            tourId
//        )
//    }).on("click", ".list-one", function () {
//
//        $(".list-one").removeClass("li-selected");
//        $(this).addClass("li-selected");
//        
//        if($(".sys").hasClass("selected-style")){
//        	Product.load($(this).find(".view").attr("tourid"), true);
//    	}else{
//    		
//    		Product.load($(this).find(".view").attr("tourid"), true);
//    	}
//        
//       
//
//    }).on("click", ".mine-t .list-one", function () {
//        $(".del_but").attr("tourid", $(this).find(".view").eq(0).attr("tourid")).css("display", "inline-block");
//    })
//
//    var showFirst = function (prarentObj) {
//        //alert(prarentObj.selector)
//        if(prarentObj.selector==".mine-t"){
//            $(".del_but").attr("tourid", $(".li-selected").find(".view").eq(0).attr("tourid")).css("display", "inline-block");
//        }
//        prarentObj.find(".list-one").removeClass("li-selected");
//        prarentObj.find(".list-one").eq(0).addClass("li-selected");
//        Product.load(prarentObj.find(".list-one").find(".view").eq(0).attr("tourid"), true)
//    }
//
//    var deleteAction = function (callback, tid) {
//        $.confirm(
//            "确认要删除该行程吗？",
//            "删除行程",
//            function () {
//                $.ajax({
//                    url: "/supplier/tour/" + tid + ".json",
//                    type: "delete",
//                    success: function (data) {
//                        //return false;
//                        //$(".li-selected").remove();
//
//                        //$.alert("xxx","ddddd")
//
//                        if(data.result.success){
//                            callback();
//                            $.alert(data.result.message,"删除结果提示");
//                        }else{
//                            $.alert(data.result.message,"删除结果提示");
//                        }
//                        //callback();
//                    }
//                })
//            },
//            function () {
//                //取消回调
//            }
//        )
//    }
//
//
//    //点击右上角删除
//    $(".del_but").click(function () {
//        var tourId = $(this).attr("tourid");
//
//        deleteAction(
//            function () {
//                $(".li-selected").remove();
//            }
//            , tourId)
//    })
//
//    //点击搜索
//
//    $(".search-bt").click(function () {
//        var lineId = Product.utils.getUrlParam("lineId");
//        var kind = $(this).attr("kind");
//        var name = $(".search-input").val()=="输入行程名称来搜索"?"":$(".search-input").val();
//        //getList(".mine-list-page", "/supplier/tour/list/" + kind + ".json?line=" + lineId + "&name=" + name, (kind == "supplier" ? ".mine-list-ul" : ".sys-list-ul"),true, (kind == "supplier" ? true : false));
//        getList((kind == "supplier" ? ".mine-list-page" : ".sys-list-page"), "/supplier/tour/list/" + kind + ".json?line=" + lineId + "&name=" + encodeURI(name), (kind == "supplier" ? ".mine-list-ul" : ".sys-list-ul"),true, (kind == "supplier" ? true : false));
//    })

})