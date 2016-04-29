;(function($){
	
	var $ul = $planLoading = $("#plan-loading").on("click", loadData4PlanSearch),
	$supplierLoading = $("#supplier-loading").on("click", loadData4SupplierSearch),
	$planNoMore = $("#plan-noMore"),
	$planNoResult = $("#planNoResult"),
	$supplierNoResult = $("#supplierNoResult"),
	$planTotal = $("#plan-total"),
	$supplierNoMore = $("#supplier-noMore"),
	$supplierTotal = $("#supplier-total"),
	$planHisUl = $("#plan-his-keyword"),
	$supplierHisUl = $("#supplier-his-keyword"),
	planCookieKey = "plan-his-keyword",
	supplierCookieKey = "supplier-his-keyword",
	maxCookieKeywordNum = 5,
	initPageSize = 12,
	initCurrentPage = 1,
	initPlanOrder = $("#plan-priceOrder").attr("value"),
	initSupplierOrder = $("#plan-priceOrder").attr("value"),
	// 初始化列表，使用默认排序
	planParams = {size:initPageSize, page:initCurrentPage, order:initPlanOrder};
	supplierParams = {size:initPageSize, page:initCurrentPage, order:initSupplierOrder};
	
	showPlanHis();
	showSupplierHis();
	$("#planSearch").on('click', function() {
		putHis2Cookie(planCookieKey, $("#planName").val());
		// 初始化排序
		$("#plan-priceOrder").attr({"value":initPlanOrder});
		$("#plan-priceOrder").find('i').removeClass().addClass('total-ico1');
		reloadData4Plan();	
	});
	$("#supplierSearch").on('click', function() {
		putHis2Cookie(supplierCookieKey, $("#supplierName").val());
		// 初始化排序
		$("#supplier-priceOrder").attr({"value":initPlanOrder});
		$("#supplier-priceOrder").find('i').removeClass().addClass('total-ico1');
		reloadData4Supplier();
	});
	$("#clearPlanHis").on('click', function() {
		$.cookie(planCookieKey, null);
		$planHisUl.empty();
		showPlanHis();
	});
	$("#clearSupplierHis").on('click', function() {
		$.cookie(supplierCookieKey, null);
		$supplierHisUl.empty();
		showSupplierHis();
	});
	$("#loadAll2Plan").on('click', function() {
		$("#planName").val('');
		reloadData4Plan();
	});
	$("#loadAll2Supplier").on('click', function() {
		$("#supplierName").val('');
		reloadData4Supplier();
	});
	
	$planHisUl.on('click', ".plan-his-li", function() {
		$("#planName").val($(this).text());
		
	});
	$supplierHisUl.on('click', ".supplier-his-li", function() {
		$("#supplierName").val($(this).text());		
	});
	$("#plan-priceOrder").on('click',function(){
		var tmpOrder = $("#plan-priceOrder").attr("value");
		if(tmpOrder == 5) {
			tmpOrder = 4;	
			$(this).find('i').removeClass('total-ico1').addClass('total-ico');
		}else {
			tmpOrder = 5;
			$(this).find('i').removeClass('total-ico1').addClass('total-ico1');
		}
		$("#plan-priceOrder").attr({"value":tmpOrder})
		reloadData4Plan();	
	});
	$("#supplier-priceOrder").on('click',function(){
		var tmpOrder = $("#supplier-priceOrder").attr("value");
		if(tmpOrder == 5) {
			tmpOrder = 4;
			$(this).find('i').removeClass('total-ico1').addClass('total-ico');
		}else {
			tmpOrder = 5;
			$(this).find('i').removeClass('total-ico1').addClass('total-ico1');
		}
		$("#supplier-priceOrder").attr({"value":tmpOrder})
		reloadData4Supplier();	
	});
	
	
	
	// 显示历史搜索
	function showPlanHis() {
		var hisList = $.cookie(planCookieKey);
		if(hisList == null || hisList.trim() == '') {
			return;
		}
		$planHisUl.empty();
		hisList = hisList.split(",");
		for(var i = 0; i < hisList.length; i++) {
			if(i > maxCookieKeywordNum-1) {
				break;
			}
			$planHisUl.append("<li class='plan-his-li'>" + hisList[i] + "</li>");
		}
		$("#plan-tourPlan-history").removeClass('hide');
	}
	function showSupplierHis() {
		var hisList = $.cookie(supplierCookieKey);
		if(hisList == null || hisList.trim() == '') {
			return;
		}
		
		$supplierHisUl.empty();
		hisList = hisList.split(",");
		for(var i = 0; i < hisList.length; i++) {
			if(i > maxCookieKeywordNum-1) {
				break;
			}
			$supplierHisUl.append("<li class='supplier-his-li'>" + hisList[i] + "</li>");
		}
		$("#supplier-tourPlan-history").removeClass('hide');
	}
	// 将查询关键字放入cookie
	function putHis2Cookie(hisCookieKey, keyword) {
		if(keyword == null || keyword.trim() == '') {
			return;
		}
		
		var hisKeywordCookie = $.cookie(hisCookieKey);
		if(hisKeywordCookie == null || hisKeywordCookie.trim() == '') {
			hisKeywordCookie = keyword; 
		}else {
			hisKeywordCookie = hisKeywordCookie.split(",");
			// 当关键字存在，把这个关键字放在最前面
			var existIndex = hisKeywordCookie.indexOf(keyword);
			if(existIndex != -1) {
				hisKeywordCookie.splice(existIndex, 1);
			}else if(hisKeywordCookie.length >= maxCookieKeywordNum) {
				hisKeywordCookie.splice(maxCookieKeywordNum-1, 1);
			}
			hisKeywordCookie.splice(0, 0, keyword);
		}
		$.cookie(hisCookieKey, hisKeywordCookie);
	}
	
	function reloadData4Supplier() {
		$("#supplier-tourPlan-List").empty();
		setQueryParam4SupplierSearch();
		loadData4SupplierSearch(true);
	}
	function setQueryParam4SupplierSearch() {
		supplierParams["order"] = $("#supplier-priceOrder").attr("value");
		supplierParams["size"] = initPageSize;
		supplierParams["page"] = initCurrentPage;
		supplierParams["supplierName"] = $("#supplierName").val();
	}
	function loadData4SupplierSearch(query) {
		if($supplierLoading.hasClass("loading")) {
			return false;
		}
		
		$supplierNoResult.find("b").html('抱歉，没有相关计划').show();
		$supplierNoResult.find("#checkAllPlan").html('查看全部出团计划').show();
		
		$supplierLoading.show().addClass("loading");
		$supplierNoResult.hide();
		$supplierNoMore.hide();
		$("#supplier-tourPlan-history").addClass('hide');
		if(query === true){
			supplierParams["page"] = 1;
		}else {
			supplierParams["page"] += 1;
		}
		$.ajax({
		type : "get",
		url  :'/product/list.json',
		data : supplierParams,
		dataType :'json',
		error	  :function(request) {
			$supplierLoading.removeClass("loading");
			$planTotal.text('共-条计划');
			$("#supplier-content").hide();
			
			$supplierNoResult.find("b").html('抱歉，系统繁忙,请点击重新加载试试').show();
			$supplierNoResult.find("#checkAllPlan").html('重新加载').show();
        },
		success   :function(data) {
			$supplierLoading.removeClass("loading");
			if(data.result && data.result.success == false) {
				alert(data.result.message);
				return;
			}
			$("#supplier-content").show();
			
			$supplierTotal.text('共' + data.pagination.count + '条计划');
			
			if(data.pagination.pageCount <= supplierParams["page"]) {
				$supplierLoading.hide();
				if(supplierParams["page"] == 1 && (data.tourPlanList == undefined || data.tourPlanList.length == 0)) {
					$("#supplier-content").hide();
					$supplierNoResult.show();
				}else {
					$supplierNoMore.show();
				}
			}
			
			var list = '';
			var tempSupplierName = $("#supplierName").val().trim();
			$.each(data.tourPlanList,function(i,v){
				var name = v.name;
				var returnSupplierName = v.supplier.name;
				// 高亮关键字
				if(tempSupplierName != '' && returnSupplierName != '') {
					returnSupplierName = returnSupplierName.replace(tempSupplierName,'<span style="color:#ffb400;">'+tempSupplierName+'</span>');
				}
				var playOptionName = "";
				var playDay = "";
				if(v.tour) {
					playOptionName = v.tour.playOption.name + '&nbsp;&nbsp;&nbsp;&nbsp;';
					var tripDays = "";
					var nights = "";
					if(v.tour.tripDays) {
						tripDays = v.tour.tripDays + "天";
					}
					if(v.tour.nights) {
						nights = v.tour.nights + "夜";
					}
					playDay = tripDays + nights;
					if(playDay != "") {
						playDay += '&nbsp;&nbsp;&nbsp;&nbsp;';
					}
				}
				// TODO 这样做是不是效率有点慢，最后再检查下
				list +='<a href="/product/' + v.id + '">';
				list +='<div class="box clearfix">';
                list +=		'<div class="texts">';   
              	list +=        '<div class="title">'+ name + '</div>';
                list +=            '<div class="date">';
                list +=					'<strong class="color-strong">￥'+ v.minPrice + ' 起</strong>';
                list +=					'<span>' + v.recentDates + '</span>';
                list +=				'</div>';
                list +=			'<div class="info-shuoming">' + playOptionName + playDay + returnSupplierName + '</div>';
                list +=		'</div>';
            	list +='</div>'; 
            	list +='</a>'; 
			})
			$("#supplier-tourPlan-List").append(list);	
		}
	})
	}	
	
	function reloadData4Plan() {
		$("#plan-tourPlan-List").empty();
		setQueryParam4PlanSearch();
		loadData4PlanSearch(true);
	}
	function setQueryParam4PlanSearch() {
		planParams["order"] = $("#plan-priceOrder").attr("value");
		planParams["size"] = initPageSize;
		planParams["page"] = initCurrentPage;
		planParams["likeName"] = $("#planName").val();
	}
	function loadData4PlanSearch(query) {
		if($planLoading.hasClass("loading")) {
			return false;
		}
		
		$planNoResult.find("b").html('抱歉，没有相关计划').show();
		$planNoResult.find("#checkAllPlan").html('查看全部出团计划').show();
		
		$planLoading.show().addClass("loading");
		$planNoResult.hide();
		$planNoMore.hide();
		$("#plan-tourPlan-history").addClass('hide');
		$("#plan-content").removeClass('hide');	
		if(query === true){
			planParams["page"] = 1;
		}else {
			planParams["page"] += 1;
		}
		
		$.ajax({
		type : "get",
		url  :'/product/list.json',
		data : planParams,
		dataType :'json',
		error	  :function(request) {
			$planLoading.removeClass("loading");
			$planTotal.text('共-条计划');
			$("#plan-content").hide();
			$planNoResult.find("b").html('抱歉，系统繁忙,请点击重新加载试试').show();
			$planNoResult.find("#checkAllPlan").html('重新加载').show();
        },
		success   :function(data) {
			$planLoading.removeClass("loading");
			if(data.result && data.result.success == false) {
				alert(data.result.message);
				return;
			}
			
			$("#plan-content").show();
			
			$planTotal.text('共' + data.pagination.count + '条计划');
			
			if(data.pagination.pageCount <= planParams["page"]) {
				$planLoading.hide();
				if(planParams["page"] == 1 && (data.tourPlanList == undefined || data.tourPlanList.length == 0)) {
					$("#plan-content").hide();
					$planNoResult.show();
				}else {
					$planNoMore.show();
				}
			}
			
			var list = '';
			var tempPlanName = $("#planName").val().trim();
			$.each(data.tourPlanList,function(i,v) {
				var name = v.name;
				// 高亮关键字
				if(tempPlanName != '' && name != '') {
					name = name.replace(tempPlanName,'<span style="color:#ffb400;">'+tempPlanName +'</span>');
				}
				var playOptionName = "";
				var playDay = "";
				if(v.tour) {
					playOptionName = v.tour.playOption.name + '&nbsp;&nbsp;&nbsp;&nbsp;';
					var tripDays = "";
					var nights = "";
					if(v.tour.tripDays) {
						tripDays = v.tour.tripDays + "天";
					}
					if(v.tour.nights) {
						nights = v.tour.nights + "夜";
					}
					playDay = tripDays + nights;
					if(playDay != "") {
						playDay += '&nbsp;&nbsp;&nbsp;&nbsp;';
					}
				}
				list +='<a href="/product/' + v.id + '">';
				list +='<div class="box clearfix">';
                list +=		'<div class="texts">';   
              	list +=        '<div class="title">' + name +'</div>';
                list +=            '<div class="date">';
                list +=					'<strong class="color-strong">￥'+ v.minPrice + ' 起</strong>';
                list +=					'<span>' + v.recentDates + '</span>';
                list +=				'</div>';
                list +=			'<div class="info-shuoming">' + playOptionName + playDay +  v.supplier.name + '</div>';
                list +=		'</div>';
            	list +='</div>';
            	list +='</a>';
			})
			$("#plan-tourPlan-List").append(list);
		}
	})
	}	
	
	(function() {
		var scrollTimer;
		function onScroll() {
			scrollTimer && clearTimeout(scrollTimer);
			
			if($planLoading.is(":visible") && $("#plan-tourPlan-history").is(":hidden")){
				scrollTimer = setTimeout(function() {
					var bottom = $planLoading.offset().top;
					var scrollTop = $(window).scrollTop();
					var windowHeight = $(window).height();
					if (scrollTop >= bottom - windowHeight) {
						// 现在又不要加载更多了的提示了， 直接手动滑 
						loadData4PlanSearch();
						/*if(params["page"] < 4) {
							loadData4PlanSearch();
						}else {
							$planLoading.show().addClass("load-more");
							$planLoading.text("点击加载更多");
						}	*/
					}
				},400);
			}
			if($supplierLoading.is(":visible") && $("#supplier-tourPlan-history").is(":hidden")){
				scrollTimer = setTimeout(function() {
					var bottom = $supplierLoading.offset().top;
					var scrollTop = $(window).scrollTop();
					var windowHeight = $(window).height();
					if (scrollTop >= bottom - windowHeight) {
						// 现在又不要加载更多了的提示了， 直接手动滑 
						loadData4SupplierSearch();
						/*if(params["page"] < 4) {
							loadData4SupplierSearch();
						}else {
							$supplierLoading.show().addClass("load-more");
							$planLo$supplierLoadingading.text("点击加载更多");
						}	*/
					}
				},400);
			}
		}
		$(window).on("scroll", onScroll)
	})();
	
})(jQuery);
		