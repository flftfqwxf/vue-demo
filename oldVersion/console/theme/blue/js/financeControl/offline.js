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
				$(".theme_but").show();
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
	//降序
	function sort(sortParam) {
		   //$('#sort').val(sortParam);
		 $('#searchForm').submit();
	}
	
	$("#exporttoexcel").click(function(){
		 var params = $('#searchForm').serialize();
		 window.open($('#searchForm').prop("action")+".xls?"+params);
	})
});

function check(){
	var startDate = $startDate.datepicker('getDate');
	var endDate = $endtDate.datepicker('getDate');
	if(startDate != "" && endDate !="" && endDate < startDate){
		$("#createEndTime").validationEngine('showPrompt',"结束时间不能小于开始时间",'error',null,true);
		return false;
	}
	return true;
}
//退款弹窗
function qureyAccount(id,name,money,orderId){
    var qureyInfo = $.dialog({
		title: '确认到款',
		width: 400,
		height:"auto",
		padding : '5px 20px',
		content:'<div class="account_box">确定收到'+name+' ￥ '+money+'的汇款 ？<p/><input title="请输入流水号" placeholder="请输入到账流水号" id="query_input"/></div>',
		lock: true,
		fixed: true,
		resize: false,
		cancel:true,
		okVal:"确认到款",
		ok: function(){
			if($("#query_input").val()!=="" && $("#query_input").val()!==undefined){
			   var sum=$("#query_input").val();
               var qureyAccountInfo=$.confirm("确定收到"+name+" ￥"+money+" 的汇款 ？","确认提示", function(){
				$.ajax({
					url:"/finance/pay?orderId="+orderId+"&outerTradeNo="+sum+"&format=json",   
					type:"GET",
					async:false,
					dataType:"json",
					success:function(json){
						$.gmMessage("成功",true);
						window.location.reload();
					},
					error:function(){
						$.gmMessage("失败",true);
					}
				});
			       qureyAccountInfo.close();
			    },function(){
				   //取消
			    });
			}else{
                if(window.confirm("请填写输入框内流水号")){
                     return false;
                }else{
                     return true;
                }
			}
			
		}		
    });
};
