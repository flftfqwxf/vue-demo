function useTemp(id){
	$.ajax({
		url : '/product/pcpage/' + id +"?_=" + Date.parse(new Date()),
		type: "GET",
		async:false,
		dataType: "html",
		success:function(datahtml){
			var tmpllist = $.dialog({
				title:false,
				width: 680,
		        height: 600,
		        padding : '5px 20px',
		        isOuterBoxShadow: false,
		        isClose: false,
		        content: datahtml,
		        lock: true,
		        fixed: true,
		        ok: function () {
		            var setTemplateIds = $("#setTemplateIds").val();
		            $.ajax({
		            	url : '/product/pcpage/' + id + "?_=" + Date.parse(new Date()),
		        		type: "POST",
		        		data:{templateIds:setTemplateIds},
		        		async:false,
		        		dataType: "json",
		        		success:function(data){
		        			if (typeof data === "string") {
		        				data = JSON.parse(data);
		        			}
		        			$.gmMessage(data.message);
		        		},error:function(){
		        			$.gmMessage("保存失败,请刷新重试");
		        		}
		            });
		        },
		        okVal: '保存',
		        okCssClass: 'btn-save',
		        cancel: function () {},
		        cancelVal: '取消',
		        cancelCssClass: 'btn-cancel'
			});
		}
	});
}
function showConutInfo(id, pageviewCount, imageCount, linkCount, fileDownloadCount){
	// product/{id}/statistics
	var content = '<div class="product_count_show">'+
			'<div class="pt_count_show_title">'+
				'<span class="btn"><span id="showAllDate" class="ct_show_title_li on">全部</span><span id="showSetDate" class="ct_show_title_li">指定时间段</span></span>'+
				'<span id="showSetDateInput" class="form-inline showSetDateInput"><input type="text" class="form-control show_date_set" name="" id="showStartDate" value="" placeholder="开始日期"/><span class="gap">-</span>'+
					'<input type="text" class="form-control show_date_set solidBorder-borderColor" name="" id="showEndDate" value="" placeholder="结束日期"/>'+
			'</div>'+
			'<div class="show_count_contnet">'+
				'<div class="show_count_ct_li"><span id="pageviewCount">'+pageviewCount+'</span>次<br>产品浏览量</div>'+
				'<div class="show_count_ct_li"><span id="imageCount">'+imageCount+'</span>次<br>图片广告浏览量</div>'+
				'<div class="show_count_ct_li"><span id="linkCount">'+linkCount+'</span>次<br>链接广告浏览量</div>'+
				'<div class="show_count_ct_li"><span id="fileDownloadCount">'+fileDownloadCount+'</span>次<br>行程附件下载量</div>'+
			'</div>'+
		'</div>';
	var countInfo = $.dialog({
		title: '详情统计',
		//title: false,
		//width: 520,
		//height: 220,
		padding : '0 20px 20px',
		isOuterBoxShadow: false,
		//isClose: false,
		content: content,
		lock: true,
		fixed: true,
		ok: false,
		//cancelCssClass: 'btn-process',
		cancel: function () {},
		cancelVal: '关闭'
	});
	$("#showAllDate").click(function(){
		$(this).addClass("on");
		$("#showSetDate").removeClass("on");
		$("#showSetDateInput").hide();
		
		$("#pageviewCount").text(pageviewCount);
		$("#imageCount").text(imageCount);
		$("#linkCount").text(linkCount);
		$("#fileDownloadCount").text(fileDownloadCount);
	});
	$("#showSetDate").click(function(){
		$(this).addClass("on");
		$("#showAllDate").removeClass("on");
		$("#showSetDateInput").show();
	});
	var dateSearchDeferred = null;
	var dateRangeSearch = function() {
		var data = {start: (new Date($("#showStartDate").val())).Format("yyyy-MM-dd"),end: (new Date($("#showEndDate").val())).Format("yyyy-MM-dd")};
		if (/[^0-9-]/.test(data.start) || /[^0-9-]/.test(data.end)) {
			return;
		}
		if (dateSearchDeferred) {
			dateSearchDeferred.abort();
			dateSearchDeferred = null;
		}
		dateSearchDeferred = $.ajax({
        url : '/product/'+id+'/statistics.json?_='+Date.parse(new Date()),
    		type: "GET",
    		data: data,
    		dataType: "json"
		});
		dateSearchDeferred
		.always(function() {
			dateSearchDeferred = null;
		})
		.then(function(data) {
			$("#pageviewCount").text(data.statistics.pageview);
			$("#imageCount").text(data.statistics.image);
			$("#linkCount").text(data.statistics.link);
			$("#fileDownloadCount").text(data.statistics.fileDownload);
		});
	};
	$("#showStartDate").datepicker({onSelect: dateRangeSearch});
	$("#showEndDate").datepicker({onSelect: dateRangeSearch});
}
function setProductSaleStatus(obj, id){
	var st = $(obj).attr("attr_st");
	var text = $(obj).text();
	var url = '/product/'+id+'/onshelves.json?_='+Date.parse(new Date());
	if('ON' == st){
		url = '/product/'+id+'/offshelves.json?_='+Date.parse(new Date());
		st = 'OFF';
		text = '上架';
	}else{
		st = 'ON';
		text = '下架';
	}

	var updateStatus = function() {
		$.ajax({
			url : url,
			type: "GET",
			dataType: "json",
			success:function(data){
				$.gmMessage(data.result.message, true);
				if(data.result.success){
					$(obj).attr("attr_st", st);
					$(obj).text(text);
					$($(obj).parent().parent().find("td").get(1)).html("已"+(('ON' == st)?"上架":"下架"));
				}
			}
		});
	}

	if (st === "OFF") {
		$.dialog({
			title: false,
			width: 400,
			height: 120,
			padding : '0 20px',
			isOuterBoxShadow: false,
			content: '<p>产品下架后不能被分销商搜索到，且会自动从所有分销商的网站中自动下架，是否确认?</p>',
			lock: true,
			fixed: true,
			ok: false,
			//cancelCssClass: 'btn-process',
			cancel: function () {},
			cancelVal: '取消',
			button: [
				{
					name: '下架',
					className: 'btn-important',
					callback: function () {
						updateStatus();
					}
				}
			]
		});
	} else {
		updateStatus();
	}
}
function copyLink(id){
	$.ajax({
		url : '/product/sharelist/' + id + "?_=" + Date.parse(new Date()),
		type: "GET",
		dataType: "html",
		success:function(data){
			var showShareInfo = $.dialog({
		        title: '查看模板详情',
		        width: 680,
		        height: 300,
		        padding : '5px 20px',
		        isOuterBoxShadow: false,
		        isClose: false,
		        content: data,
		        lock: true,
		        fixed: true,
		        ok: false,
		        cancel: function () {},
		        cancelVal: '关闭',
		        cancelCssClass: 'btn-cancel'
		    });
		}
	});
}

// 删除产品
function deleteProduct(productId) {
	var deleteFun = function() {
		$.ajax({
			url : "/product/" + productId + ".json?_method=DELETE&_=" + Date.parse(new Date()),
			type: "DELETE",
			dataType: "json",
			success:function(data){
				$.gmMessage(data.result.message, true);
				window.location.href = window.location.href;
			}
		});
	}
	$.dialog({
		title: false,
		width: 400,
		height: 120,
		padding : '0 20px',
		isOuterBoxShadow: false,
		content: '<p>产品删除后不可恢复，是否确认?</p>',
		lock: true,
		fixed: true,
		ok: false,
		cancel: function () {},
		cancelVal: '取消',
		button: [
			{
				name: '删除',
				className: 'btn-important',
				callback: function () {
					deleteFun();
				}
			}
		]
	});
}
function sortLine(data) {
	$.post("/product/line-sort.json?_=" + Math.random(), data, function(d) {
		if (d && d.result && d.result.success) {
			loadData();
		}
	});
}

function loadData() {
	var $searchName = $("#prodcutForm").find("input[name='name']");
	if ($searchName.val() == $searchName.attr("placeholder")) {
		$searchName.val("");
	}
	$("#prodcutForm").submit();
}
$(function(){
	$("#dropdown-statefields").on("click", "label", function() {
		var st = $(this).find("[attr_st]").attr("attr_st");
		$("#saleStatus").val(st);
		$("#prodcutForm").submit();
	});
	$("#dropdown-timingfields").on("click", "label", function(){
		$("#orderParam").val($(this).find("[attr_st]").attr("attr_st"));
		$("#prodcutForm").submit();
	});
	$(".list_search_but").click(function(){
		$("input[name='lineId']").val("");
		$("#prodcutForm").submit();
	});
	$(".list_search_but_cloes").click(function(){
		$("#likeName").val("");
		$("#prodcutForm").submit();
	});
	$(".tips_cloass").click(function(){
		$(this).parent().remove();
	});
	if($.cookie("productShowNumber") > 5){
		$("#product_title_tips").remove();
	}else{
		$.cookie("productShowNumber", $.cookie("productShowNumber")*1 + 1);
	}
	$(document).on("click", ".search-btn", function() {
		loadData();
	}).on("click", "#menu-line li:not('.dropdown')", function() {
		var lineId = $(this).find("a").attr("data-line-id");
		if (lineId) {
			$(":input[name='lineId']").val(lineId);
			$("input[name='lineIdSelect']").val(lineId);
			$(".J_add").attr("data-line-id", lineId);
			$("#curentLineName").text($(this).find("a").attr("data-title"));
		} else {
			$(":input[name='lineId']").val("");
			$("input[name='lineIdSelect']").val("");
		}
		var parent = $(this).parent();
		if(parent.hasClass("dropdown-menu") && 1 == parent.attr("data-order")) {
			var datas = {
				'lineId': $(":input[name='lineId']").val()
			};
			sortLine(datas);
		} else {
			loadData();
		}
	}).on("click", ".input-group .J_clearSearch", function(){
		$("#likeName").val("");
		$("#prodcutForm").submit();
	}).on("click", "#btn-new-product,.add-product", function(){
		var lineId = $("input[name='lineId']").val();
		location.href = "/product/input?lineId=" + lineId;
	});
});