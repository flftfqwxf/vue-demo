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

});
//去结算弹窗
function goSet(id, money){
	
    var qureyInfo = $.dialog({
		title: '结算',
		width: 560,
		height:"auto",
		padding : '5px 20px',
		content:'<div class="goset_box">打款金额：￥' + money + '&nbsp;元</div>',
		lock: true,
		fixed: true,
		resize: false,
		cancel:true,
		okVal:"已打款",
		ok: function(){
			$.ajax({
				url:"/finance/withdraw/"+id+"/process.json",   //还未添加url
				type:"POST",
				async:false,
				dataType:"json",
				success:function(json){
					window.location.reload();//刷新当前页面.
					$("body").append("<div class='message_box'>"+json.result.message+"</div>");
					$(".message_box").animate(
						{top:"60px"},
						300,function(){
							setTimeout(function(){
								$(".message_box").hide(300);
							},1000);
					});
				
					
					
				},
				error:function(){
					alert("失败");
				}
			});						     				        
		}		
    });
};

