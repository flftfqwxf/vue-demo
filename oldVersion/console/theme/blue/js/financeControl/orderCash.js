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
	//降序
	function sort(sortParam) {
		   $('#sort').val(sortParam);
		   $('#searchForm').submit();
	}
});
//退款弹窗
function qureyAccount(){
    var qureyInfo = $.dialog({
		title: '确认到账',
		width: 560,
		height:"auto",
		padding : '5px 20px',
		content:'',
		lock: true,
		fixed: true,
		resize: false,
		cancel:true,
		okVal:"确认到账",
		ok: function(){
			var qureyAccountInfo=$.confirm("确定资金已到账？","确认提示", function(){
				$.ajax({
					url:"/news/top?format=json",   //还未添加url
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
			qureyAccountInfo.close();
			},function(){
				//取消
			});
		}		
    });
    // $.getJSON("test.js", function(json){
	   qureyInfo.content('<div class="account_box">收款金额：￥111111111<br>订单号：99999999999</div>')
	// });
};
