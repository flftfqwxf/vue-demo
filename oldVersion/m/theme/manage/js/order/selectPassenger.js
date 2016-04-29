
//后端报错提示和隐藏
if ($(".waring_info")) {
	var waring_txt = $(".waring_desc").html();
	if (waring_txt !== "") {
		$(".waring_info").show();
	}
	setTimeout(function(){
		$(".waring_info").hide();
	},1500);
};
function telJudge(){
	var checked = $(".J-select-info li input:checked");
	//var selectedStr='';
	var selectedList=[];
	checked.each(function(){
		selectedList.push($(this).attr("telValue"));
	});
	var telResult = selectedList.every(function(val){
		return val == 0;
	})
	return telResult;
};
$(".J-paddenger").click(function(){
	var check = $(this).siblings("input[type=\"checkbox\"]");
	if (check.prop("checked") == true) {
		check.removeAttr("checked");
	}else{
		check.attr("checked","true");
	}
});
$(".J-sure-btn").click(function(){
	var formInfo=$('#form-info');
	var num = $("input[name=\"passengerNum\"]").attr('value'),
		checked = $(".J-select-info li input:checked");
		var selectedList=[];
	checked.each(function(){
		selectedList.push($(this).attr("value"));
	});

	$('#selectedTraver').val(selectedList.join(','));
	$("input[name=\"passenger-id\"]").attr('value',selectedList);

	if (selectedList.length < num) {
		$(".J-input").addClass("error");
		var n = num - selectedList.length,
			_text = "您还需要再选择"+n+"个出行人信息才可以提交";
		
		warginInfo(_text);
		return false;

	}else if (selectedList.length > num) {
		$(".J-input").addClass("error");
		var n = selectedList.length - num,
			_text = "您需要取消"+n+"个出行人信息才可以提交";
		warginInfo(_text);
		return false;

	}else if (telJudge() == true) {

		var _text = "请填写至少一位旅客的手机号码以方便联系您";
		warginInfo(_text);
		return false;

	}else{
		formInfo.attr('action',"/"+formInfo.attr('chooseaction')).attr('method','post').submit();
	}
});
/*隐藏提示信息*/
var timer;	
function warginInfo(text){
	clearTimeout(timer);
	$(".waring_desc").html("").append(text);
	$(".waring_info").show();
	timer = setTimeout(function(){
		$(".waring_info").hide();
	},1000);

}

$(".J-add-btn").click(function(){
	//添加旅客点击事件
	var checked = $(".J-select-info li input:checked");
	//var selectedStr='';
	var selectedList=[];
	checked.each(function(){
		selectedList.push($(this).attr("value"));
	});
	var formInfo=$('#form-info');
	$('#selectedTraver').val(selectedList.join(','));
	formInfo.attr('action',formInfo.attr('addaction')).attr('method','get').submit();
});

$(".J-edit").click(function(){
	//编辑旅客点击事件
	var _val = $(this).attr('value');
	var checked = $(".J-select-info li input:checked");
	//var selectedStr='';
	var selectedList=[];
	checked.each(function(){
		selectedList.push($(this).attr("value"));
	});
	var formInfo=$('#form-info');
	$('#selectedTraver').val(selectedList.join(','));
	$(".passengerId").attr("value",_val);
	formInfo.attr('action',formInfo.attr('addaction')).attr('method','get').submit();
});

$(".J-checked").click(function(){
	//选择旅客点击事件
	//移除未选样式
	$this = $(this);
	$(".J-input").removeClass("error");
	var liValue = $(this).parent("li").attr("info");
	if (liValue == "false") {
		$(".artDialog").show();
		$(".J-no").click(function() {
			//取消订单选择否
			$(".artDialog").hide();
			$this.find(".J-input").removeAttr('checked');
		});
		$(".J-yes").click(function(){
			$this.find(".J-input").removeAttr('checked');
			var _val = $this.siblings(".J-edit").attr('value');
			var checked = $(".J-select-info li input:checked");
			//var selectedStr='';
			var selectedList=[];
			checked.each(function(){
				selectedList.push($(this).attr("value"));
			});
			var formInfo=$('#form-info');
			$('#selectedTraver').val(selectedList.join(','));
			$(".passengerId").attr("value",_val);
			formInfo.attr('action',formInfo.attr('addaction')).attr('method','get').submit();
		})
	}
})
