
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
//备注弹框
function remark(id){
     var remarkInfo = $.dialog({
		title: '备注',
		width: 560,
		height:"auto",
		padding : '5px 20px',
		content:'<div class="father_d"><span class="float_L">备注&nbsp;&nbsp;&nbsp;</span><textarea name="" id="" cols="30" rows="10" placeholder="请填写备注信息" class="remark_text float_L" maxlength="250"></textarea></div>',
		lock: true,
		fixed: true,
		resize: false,
		cancel:function(){
			if($(".remark_text").val()!=="" && $(".remark_text").val()!==null){
		 	    if(window.confirm("取消将清空已录入的内容，是否确认？")){
                  return true; 
		 	    }else{
                  return false;
		 	    }
			}
		},
		okVal:"提交",
		ok: function(){
			var a=true;
			var b=$(".remark_text").val();
			if(b!=="" && b!==null){
				// console.log(b);
				$.ajax({
					type:"POST",
					url:"/order/"+id+"/remark",	//接口和url还没添加		
					data:{"content":b},		
					dataType:"json",
					async:false,
					success:function(response){	
						a=true;
					},
					error:function(response){
						a=true;
						alert("失败");
					}			         				          
				 });
			}else{
				a=false;
				$(".remark_text").validationEngine('showPrompt',"请填写备注",'error',null,true);
			}			
			return a;
		},		
		init:function(){
			//初始化一些弹窗内部方法或者其他
		}
	});
}
//退款弹框
function refund(id){
     var refundInfo = $.dialog({
		title: '退款',
		width: 560,
		height:"auto",
		content:' <form id="refundform" action="" method="POST"><div class="father_d" id="return">'+
		'<div class="padd_up"><span>退款原因&nbsp;&nbsp;&nbsp;</span><input type="checkbox" name="" class="pos_relative" value="1"  id="J_returnReson1"/>&nbsp;&nbsp;协商一致<br><input type="checkbox" name="" class="pos_relative margin_lef" value="2" id="J_returnReson2"/>&nbsp;&nbsp;其他</div>'+
		'<div class="padd_up"><span>退款金额&nbsp;&nbsp;&nbsp;</span><input type="text" name="" class="input_wh validate[custom[integer]]" id="J_returnCount" data-errormessage="请输入整数"/></div>'+
		'<div class="padd_up"><span class="float_L comment_span">备注&nbsp;&nbsp;&nbsp;</span><textarea name="" id="" cols="30" rows="10" placeholder="请填写备注信息" class="float_L refund_text" data-errormessage="此处不可留白"></textarea></div>'+
		'</div></form>',
		lock: true,
		fixed: true,
		resize: false,
		cancel:function(){
			if($(".refund_text").val()!=="" || $("#J_returnCount").val()!=="" || $("#J_returnReson1").prop("checked") || $("#J_returnReson2").prop("checked")){
		 	    if(window.confirm("取消将清空已录入的内容，是否确认？")){
                  return true; 
		 	    }else{
                  return false;
		 	    }
			}
		},
		okVal:"退款",
		ok: function(){
			var b=$(".refund_text").val();
			var c=$("#J_returnCount").val();
			//操作
            var validRetrun = isValidRetrun();
            if(validRetrun){
				$.ajax({
					type:"POST",
					url:"/product/"+b+"/valid.json",	//接口和url还没添加				
					dataType:"json",
					async:false,
					success:function(response){	
						alert("成功");
					},
					error:function(response){
						alert("失败");
					}			         				          
				});
			}			
			return validRetrun;            
		},		
		init:function(){
			//初始化一些弹窗内部方法或者其他
		}
	});
}
//退款验证	
function isValidRetrun(){
	var flag = $("#refundform").validationEngine('validate');
	if(!$("#J_returnReson1").prop("checked") && !$("#J_returnReson2").prop("checked")){
       $("#J_returnReson1").validationEngine('showPrompt',"请选择退款金额",'error',null,true);
	   flag = false;
	}
	if(flag && $("#J_returnCount").val()==""){
		$("#J_returnCount").validationEngine('showPrompt',"请输入金额",'error',null,true);
		flag = false;
	}
	if(flag && $(".refund_text").val()==""){
       $(".refund_text").validationEngine('showPrompt',"请输入备注",'error',null,true);
	   flag = false;
	}	                  
  	return flag; 		
}
//驳回申述弹框
function complaint(id){
     var complaintInfo=$.confirm("确定驳回申述？","确认提示", function(){
		//置顶操作
		$.ajax({
			url:"/news/"+id+"/top?format=json",
			type:"PUT",
			async:false,
			dataType:"json",
			success:function(json){
				alert("成功");
			},
			error:function(){
				alert("失败");
			}
		});
		complaintInfo.close();
	},function(){
		//取消
	});
}
//导出EXCEL
$(".down_excel").on("click", function () {
	var orderId = $('#orderId').val();
	var productId = $('#productId').val();
	var phone = $('#phone').val();
	var supplierName = $('#supplierName').val();
	var distributorName = $('#distributorName').val();
	var createTimeBegin = $('#createStartTime').val();
	var createTimeEnd = $('#createEndTime').val();
	var status = $('#orderStatus').val();
	var orderType = $('#orderType').val();
	
	var url = "/order/export?format=xls";
	if (null != orderId && "" != orderId) {
		url += "&orderId=" + orderId;
	}
	if (null != productId && "" != productId) {
		url += "&productId=" + productId;
	}
	if (null != phone && "" != phone) {
		url += "&phone=" + phone;
	}
	if (null != supplierName && "" != supplierName) {
		url += "&supplierName=" + supplierName;
	}
	if (null != distributorName && "" != distributorName) {
		url += "&distributorName=" + distributorName;
	}
	if (null != createTimeBegin && "" != createTimeBegin) {
		url += "&createTimeBegin=" + createTimeBegin;
	}
	if (null != createTimeEnd && "" != createTimeEnd) {
		url += "&createTimeEnd=" + createTimeEnd;
	}
	if (null != status && "" != status) {
		url += "&status=" + status;
	}
	if (null != orderType && "" != orderType) {
		url += "&orderType=" + orderType;
	}
	
	window.location.href = url;
});

//排序
$("#order_sort").click(function(){
	if($(this).attr("data-sort")==="up"){
		$("#sort").val("descCreate");
		$(this).removeClass("ord_up").addClass("ord_down").attr("data-sort","down");
	}else{
		$("#sort").val("ascCreate");
		$(this).removeClass("ord_down").addClass("ord_up").attr("data-sort","up");
	}
	$("#searchForm").submit();
})

	

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
function sort(sortParam) {
	   $('#sort').val(sortParam);
	   $('#searchForm').submit();
}	
