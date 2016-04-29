$(function(){
	//后端报错提示和隐藏
	var timer;
	if ($(".waring_info")) {
		var waring_txt = $(".waring_desc").html();
		if (waring_txt !== "") {
			$(".waring_info").show();
		}
		setTimeout(function(){
			$(".waring_info").hide();
		},1000);
	};
	$(".J-sure-btn").click(function(){
		var formInfo=$('#form-info');
		var num = parseInt($("#passengerNum").attr('value'));
		var traId = $("#selected").val();
		if (traId == "") {
			traArrayNum = 0;
		}else{
			var traArray = traId.split(",");
			var traArrayNum = traArray.length;
		}
		if (traArrayNum < num) {
			clearTimeout(timer);
			$(".waring_desc").html("");
			var n = num - traArrayNum,
				_text = "您还需要再选择"+n+"个出行人信息才可以提交";
			$(".waring_desc").append(_text); 
			$(".waring_info").show();
			timer = setTimeout(function(){
				$(".waring_info").hide();
			},1000);
			return false;

		}else{
			formInfo.attr('method','post').submit();
		}
	})
})