;(function($){
	
	var $ul = $loading = $("#loading").on("click", loadData), 
	$noMore = $("#noMore"),
	$noResult = $("#noResult"),
	$total = $("#total"),
	$lineSelet = $("#lineSelet"),
	$playOptionSelect = $("#playOptionSelect"),
	maxCookieKeywordNum = 8,
	cityCookieKey = "city-his-keyword",
	initPageSize = 12,
	initCurrentPage = 1,
	// 初始化列表，使用默认排序
	params = {size:initPageSize, page:initCurrentPage};
	loadData(true);	

	listTourPlans();
	
	/* 禁止输入框聚焦 */
	$(".send-input").focus(function(e){
		e.preventDefault();
		return false;
	})
	$('.departure-place-name').on('click',function(){	
		$("#J_seleTc").show();	
		$("#J_funScreen").hide();
		$(".returnTop").css({'z-index':'-1'});
		
		showPlanHis();
	});
	$("#J_plan").on('click','.J_filter',function(){
		var J_fileterH= $(this).height();		
		var side = $("#J_plan").find("#J_funScreen");
		side.animate({"right":'0'},'slow');
		// listTourPlans();
		var height = side.height() - $("#search-noone").height();
		$("#body-contents").css({height:height }).addClass("overflow-hidden");
	}).on('click','.J_exit',function(){
		$("#body-contents").css({height: "auto"}).removeClass("overflow-hidden");
		sidefout()
	}).on('click','.name-dl dd',function(){		
		var nameTxt = $(this).html();
		$(".send-input").val(nameTxt);
		$(".departure-place-name").text(nameTxt);
		$("#J_funScreen").show();
		$(this).parents("#J_seleTc").hide();
	}).on('click','.J_ensure',function(){
		var min=$("#minPrice").val();
		var max=$("#maxPrice").val();
		if(parseInt(max)<parseInt(min)){
			$(".erroPrice").text("最高价不能低于最低价！");
			return;
		}
		else{
			$(".erroPrice").text("");
			sidefout();
			setDefaultOrder();
			reloadData();
			$("#body-contents").css({height: "auto"}).removeClass("overflow-hidden");
		}
	}).on('click','.clear-btn',function(){
		$(".erroPrice").text("");
		clearFrom();
	}).on('click','.ensure-btn',function(){
		var min=$.trim($("#minPrice").val());
		var max=$.trim($("#maxPrice").val());
		if(parseInt(max)<parseInt(min)){
			$(".erroPrice").text("最高价不能低于最低价！");
			return;
		}else{
		sidefout();
		setDefaultOrder();
		reloadData();
		$("#body-contents").css({height: "auto"}).removeClass("overflow-hidden");
		}
	}).on('click','#defaultOrder',function(){
		$(".top-ul").find("#priceOrder i").removeClass();
		$(this).find('span').css({'color':'#6599ff'})
		$(".top-ul").find('#priceOrder .list-s').css({'color':'#4a4a4a'});
		var tmpOrder = $("#orderby").attr("value");
		if(tmpOrder != 1 ) {
			$('#priceOrder').next().find('i').removeClass();
			$("#orderby").attr({"value":1})
			params["order"] = 1;
			reloadData();
		}
	}).on('click','#priceOrder',function(){	
		$(this).find('span.list-s').css({'color':'#6599ff'});
		$('.top-ul').find('.zonghesele').removeClass();
		$('.top-ul').find('#defaultOrder span').css({'color':'#4a4a4a'});
		var tmpOrder = $("#orderby").attr("value");
		$(this).find('i').removeClass();
		if(tmpOrder == 5) {
			tmpOrder = 4;
			$(this).find('i').addClass('total-ico');
		}else {
			tmpOrder = 5;
			$(this).find('i').addClass('total-ico1');
		}
		params["order"] = tmpOrder;
		$("#orderby").attr({"value":tmpOrder})
		reloadData();
	}).on('change','#lineSelet',function() {
		$("#playOption").empty();
		var tempLineSelet = $("#lineSelet option:selected").val();
		if(tempLineSelet == undefined || tempLineSelet == '') {
			$playOptionSelect.hide();		
		}else {
			findPlayOptions(tempLineSelet);
			$playOptionSelect.show();
		}
	}).on('click','.history span',function(){		
		var _hostHtml = $(this).html();
		var _sendIpt = $('.send-input');
		_sendIpt.val(_hostHtml);
		$(".departure-place-name").text(_hostHtml);
		$("#J_seleTc").hide();
		$("#J_funScreen").show();
	}).on('click','.host-ico',function(){
		$("#J_seleTc").hide();
		$("#J_funScreen").show();
		$('.returnTop').css({'z-index':'38'});
	}).on("click",'.dl-item dt i',function(){
		
		var value = $(this).attr('data-value');
		var ddHeight = $(".dl-item dd").height();
		if (value == 1 ){			
			if(ddHeight >=35 ){
				$(this).parents('.dl-item').find('dd').css('height','auto');
				$(this).removeClass('dt-ico1').addClass('dt-ico');				
			};
			$(this).attr('data-value', 2);
		}else {				
			if( ddHeight=35){
				$(this).parents('.dl-item').find('dd').css('height','40');
				$(this).removeClass('dt-ico').addClass('dt-ico1');				
			};
			$(this).attr('data-value', 1);
		}
	});	
	
	function setDefaultOrder() {
		var tmpOrder = $("#orderby").attr("value");
		$(".top-ul").find("#priceOrder i").removeClass();
		$("#defaultOrder").find('span').css({'color':'#6599ff'})
		$(".top-ul").find('#priceOrder .list-s').css({'color':'#4a4a4a'});
		$("#orderby").attr({"value":1})
		params["order"] = 1;
	}
	
	$('#checkAllPlan').on('click',function(){
		clearFrom();
		reloadData();	
	});
	
	function sidefout(){
		var side = $("#J_plan").find("#J_funScreen");
		side.animate({"right":'-1000'},'slow');
	}
	$(".allCity").on('click', '.citydd', function() {
		var city = $(this).html();
		putHis2Cookie(cityCookieKey, city);
		showPlanHis();
		$("#J_funScreen").show();
		$('.returnTop').css({'z-index':'38'});
	});
	
	
	
	// TODO 将查询关键字放入cookie
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
	
	// TODO 显示历史搜索
	function showPlanHis() {
		var hisList = $.cookie(cityCookieKey);
		if(hisList == null || hisList.trim() == '') {
			return;
		}
		// TODO 历史列表
		$(".host-box").hide();
		$(".host-box dd").empty();
		hisList = hisList.split(",");
		for(var i = 0; i < hisList.length; i++) {
			if(i > maxCookieKeywordNum-1) {
				break;
			}
			// TODO 历史列表
			$(".host-box dd").append("<span>" + hisList[i] + "</span>");
		}
		$(".host-box").show();;
	}
	var timeout;
	$('.zm-box a').on('click',function(e){
		var t=$(this).text();
		$("#J_funScreen").hide();
		timeout=setTimeout(function(){
			$("body").animate({scrollTop:$("#"+t).position().top}, 1000,function(){
				//$("#J_funScreen").show();
			});
		},200);
		e.preventDefault();
		return false;
	});
	/* 吸磁效果 */
	$(".dl-item").on("click",'dd a',function(){
		var text = $(this).html();
		var title = $(".J_daysele");
		$(this).addClass('daysele').siblings().removeClass('daysele');
		title.html(text);
		$("#tripDays").attr({"minTripDays":""});
		$("#tripDays").attr({"maxTripDays":""});
		$("#tripDays").attr({"minTripDays":$(this).attr("min")});
		$("#tripDays").attr({"maxTripDays":$(this).attr("max")});
	});	
	
	// 获取所有专线列表
	function listTourPlans() {
		$.ajax({
			type : "get",
			url  :'/touristLine.json',
			dataType :'json',
			success   :function(data) {
				$lineSelet.empty();
				var tempLineSelect = '';
				tempLineSelect +='<option value="">点击选择</option>';
				
				$.each(data.lines,function(i,v) {
					tempLineSelect +='<option value="'+ v.id +'">' + v.name + '</option>';
				})
				$lineSelet.append(tempLineSelect);	
				$lineSelet.change();
			}
		})
	}
	
	// 根据专线id获取玩法
	function findPlayOptions(lineId) {
		$.ajax({
			type : "get",
			url  :'/touristLine/' + lineId + '/playOption.json',
			dataType :'json',
			success   :function(data) {
				var playOptions = '';
				playOptions +='<option value="">点击选择</option>';
				
				$.each(data.playOptions,function(i,v) {
					playOptions +='<option value="'+ v.id +'">' + v.name + '</option>';
				})
				$("#playOption").append(playOptions);	
			}
		})
	}
	
	// 重新设置筛选列表参数（分页参数初始化）
	function setQueryParam() {
		// 目前全是ajax请求，且不会改变页面上的初始化分页数据
		params["size"] = initPageSize;
		params["page"] = initCurrentPage;
		params["line"] = $("#lineSelet option:selected").val();
		params["playOption"] = $("#playOption option:selected").val();
		params["departurePlaceName"] = $("#departurePlaceName").val();
		params["minPrice"] = $("#minPrice").val();
		params["maxPrice"] = $("#maxPrice").val();
		params["startDate"] = $("#startDate").val();
		params["endDate"] = $("#endDate").val();
		params["minTripDays"] = $("#tripDays").attr("minTripDays");
		params["maxTripDays"] = $("#tripDays").attr("maxTripDays");
	}
	
	function clearFrom() {
		$('#lineSelet option:eq(0)').prop('selected',true);
		$('#lineSelet').change();
		$('#departurePlaceName').val('');
		$('.departure-place-name').text('');
		$("#minPrice").val('');
		$("#maxPrice").val('');
		$("#startDate").val('');
		$("#endDate").val('');
		
		$("#tripDays").attr({'minTripDays':''});
		$("#tripDays").attr({'maxTripDays':''});
		$("#tripDaysDD a").addClass('daysele').siblings().removeClass('daysele');
		$("#tripDays").text('');
	}
	
	function reloadData() {
		$("#plan-content").empty();
		setQueryParam();
		loadData(true);
	}
	
	// 查询列表
	function loadData(query){
		if($loading.hasClass("loading")) {
			return false;
		}
		
		$noResult.find("b").html('抱歉，没有相关计划').show();
		$noResult.find("#checkAllPlan").html('查看全部出团计划').show();
		
		$loading.show().addClass("loading");
		$('#search-noone').show();
		$noResult.hide();
		$noMore.hide();
		
		if(query === true){
			params["page"] = 1;
		}else {
			params["page"] += 1;
		}
		
		$.ajax({
		type : "get",
		url  :'/product/list.json',
		data : params,
		dataType :'json',
		error	  :function(request) {
			$total.text('共-条计划');
			$loading.removeClass("loading");
			$ul.add($loading).add($noMore).hide();
			$("#plan-content").html("");	
			$noResult.find("b").html('抱歉，系统繁忙,请点击重新加载试试').show();
			$noResult.find("#checkAllPlan").html('重新加载').show();
        },
		success   :function(data){
			$loading.removeClass("loading");
			if(data.result && data.result.success == false) {
				alert(data.result.message);
				return;
				
			}
			//alert("页面效果测试");
			$total.text('共' + data.pagination.count + '条计划');
			if(data.pagination.pageCount <= params["page"]) {
				$loading.hide();				
				if(params["page"] == 1 && (data.tourPlanList == undefined || data.tourPlanList.length == 0)) {
					$('#search-noone').hide();
					$('.no-serach').find('.no-seabox').css({
						'margin':'0 auto 15px',
						'border-top':'1px solid #ccc'
					});
					$noResult.show();					
				}else {
					$noMore.show();
				}
			}
			var list ='';
			$.each(data.tourPlanList,function(i,v){
				var name = v.name;
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
				list +='<a href="/product/' + v.id + '" class="product_item">';
				list +='<div class="box clearfix">';
                list +=		'<div class="texts">';   
              	list +=        '<div class="title">'+ name + '</div>';
                list +=            '<div class="date">';
                list +=					'<strong class="color-strong">￥'+ v.minPrice + ' 起</strong>';
                list +=					'<span>' + v.recentDates + '</span>';
                list +=				'</div>';
                list +=			'<div class="info-shuoming">' + playOptionName + playDay + v.supplier.name + '</div>';
                list +=		'</div>';
            	list +='</div>';   
            	list +='</a>';
			})
			$("#plan-content").append(list);	
		}
	})
	}
	
	(function() {
		var scrollTimer;
		function onScroll() {
			scrollTimer && clearTimeout(scrollTimer);
			if($loading.is(":visible")){
				scrollTimer = setTimeout(function() {
					var bottom = $loading.offset().top;
					var scrollTop = $(window).scrollTop();
					var windowHeight = $(window).height();
					if (scrollTop >= bottom - windowHeight) {
						// 现在又不要加载更多了的提示了， 直接手动滑 
						loadData();
						/*if(params["page"] < 4) {
							loadData();
						}	
						else {
							$loading.show().addClass("load-more");
							$loading.text("点击加载更多");
						}	*/
					}
				},400);
			}
		}
		$(window).on("scroll", onScroll)
	})();
	
})(jQuery);
		