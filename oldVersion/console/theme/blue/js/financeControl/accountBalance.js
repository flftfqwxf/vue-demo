$(function() {
	var datepicker_CurrentInput;
	$.datepicker.setDefaults({
		showButtonPanel: true,
		closeText: '清空',
		beforeShow: function(input, inst) {
			datepicker_CurrentInput = input;
		}
	});
	$(document).on("click", ".ui-datepicker-close", function (){  
	    datepicker_CurrentInput.value = "";  
	});
	/* 初始化验证框架 */
	$("#searchForm").validationEngine({
		validateNonVisibleFields : true,
		validationEventTrigger : "",
		showOneMessage : false,
		maxErrorsPerField : 1,
		promptPosition : "bottomRight:0,6",
		scroll : true,
		scrollOffset : 100,
		autoHidePrompt : true,
		autoHideDelay : 1000,
		focusFirstField : true
	});
	/* 开始日期与结束日期比较 */
	var $startDate =$("#createStartTime").datepicker({
		changeMonth: true,
		changeYear: true,
		maxDate: new Date(),
		dateFormat: "yy-mm-dd",
		onSelect  : function(){			
			var startDate = $startDate.datepicker('getDate');
			var endDate = $endtDate.datepicker('getDate');
			if(endDate != null && endDate < startDate){
				$("#createEndTime").validationEngine('showPrompt',"结束时间不能小于开始时间",'error',null,true);
				$(".theme_but").show();
				return false;
			}
				
		}
	});
	var $endtDate = $("#createEndTime").datepicker({
		changeMonth: true,
		changeYear: true,
		maxDate: new Date(),
		dateFormat: "yy-mm-dd",
		onSelect  : function(){		
			var startDate = $startDate.datepicker('getDate');
			var endDate = $endtDate.datepicker('getDate');
			if(startDate != null && endDate < startDate){
				$("#createEndTime").validationEngine('showPrompt',"结束时间不能小于开始时间",'error',null,true);
				return false;
			}
		}	
	});

	//导出EXCEL
	$(".down_excel").on("click", function () {
		var createTimeBegin = $('#createStartTime').val();
		var createTimeEnd = $('#createEndTime').val();		
		var outerTradeType=$("#outerTradeTypes").val();
		var moneyType=$("#moneyType").val();

	var url = "/finance/trade.xls?size=2000";    //后台添加URL           
		if (null != createTimeBegin && "" != createTimeBegin) {
			url += "&startCreateTime=" + createTimeBegin;
		}
		if (null != createTimeEnd && "" != createTimeEnd) {
			url += "&endCreateTime=" + createTimeEnd;
		}
		if (null != moneyType && "" != moneyType) {
			url += "&types=" + moneyType;
		}
		if (null != outerTradeType && "" != outerTradeType) {
			url += "&outerTradeTypes=" + outerTradeType;
		}
		window.location.href = url;
	});
	//交易类型+资金流向的选择、
	$(function(){
        var a=$("input[name='outerTradeTypes']").val();
        var b=$("input[name='types']").val();
        if(a==="WITHDRAWAL"){
           $(".outerTradeType").find("a").eq(0).addClass("type_bg");
        }else if(a==="ORDER_DEPOSIT"){
           $(".outerTradeType").find("a").eq(1).addClass("type_bg");
        }
        if(b==="deposit"){
           $(".moneyType").find("a").eq(0).addClass("type_bg");  
        }else if(b==="withdrawal"){
           $(".moneyType").find("a").eq(1).addClass("type_bg");
        }
        //点击事件
        $(document).on("click",".type_choice a",function(){
			if($(this).hasClass("type_bg")){
				$(this).removeClass("type_bg").parent(".type_choice").next("input[type='hidden']").val('');
			}else{
				var a=$(this).data("value");
				$(this).addClass("type_bg").siblings("a").removeClass("type_bg").end().parent(".type_choice").next("input[type='hidden']").val(a);

			}		
	    })
	}())
	
})