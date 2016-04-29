var $startDate;
var $endtDate;
$(function(){
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
	$startDate =$("#createStartTime").datepicker({
		changeMonth: true,
		changeYear: true,
		maxDate: new Date(),
		dateFormat: "yy-mm-dd",
		onSelect  : function(){			
			var startDate = $startDate.datepicker('getDate');
			var endDate = $endtDate.datepicker('getDate');
			if(endDate != null && endDate < startDate){
				$("#createEndTime").validationEngine('showPrompt',"结束时间不能小于开始时间",'error',null,true);
				$(".theme_but_fix").show();
				return false;
			}
				
		}
	});
	$endtDate = $("#createEndTime").datepicker({
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
	
	$(".td_type span").each(function(){
		$(this).click(function(){
			var value = $(this).attr("data-value");
			$("#hiddenType").val(value);
			$("#searchForm").submit();
		})
	})
	
	$("#cleartime").click(function(){
		$("#createEndTime").val("");
		$("#createStartTime").val(""); 
		$("#searchForm").submit();
	})
});

function changetype($type) {
	var v = $type.value;
	var keyValue = $("input[name=keyValue]")
	if (v=="") {
		keyValue.attr("disabled",true).val("");
	} else {
		keyValue.attr("disabled",false);
	}
}
function auditedViewAccount(id) {
	$.ajax({
		url:"/redpacket/account-distributor/"+id+".json",
		type:"get",
		data:{m:Math.random()},
		success:function(result){
			if(result && result.distributor && result.distributor.id) {
				//window.open("/distributor/audited?id="+result.distributor.id)
				auditedView(result.distributor.id);
			} else {
				alert("该分销商不存在或未通过审核")
			}
		},
		error:function() {
			alert("error");
		}
	})
}
function check(){
	var startDate = $startDate.datepicker('getDate');
	var endDate = $endtDate.datepicker('getDate');
	if(startDate != "" && startDate != null && endDate !=""  && endDate != null && endDate < startDate){
		$("#createEndTime").validationEngine('showPrompt',"结束时间不能小于开始时间",'error',null,true);
		return false;
	}
	return true;
}
