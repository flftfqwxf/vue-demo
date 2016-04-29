/**
 * [ShowCountDown description] 倒计时循环
 * @param {[type]} timeArray [description] 二维数组
 */
function ShowCountDown(timeArray) {
	var _len = timeArray.length;
	var interval=setInterval(function () {
		for (var n = 0; n < _len; n++) {
			if (timeArray[n][1]>0) {
				timeArray[n][1] = parseInt(timeArray[n][1]) - 1000;
				/*var day1 = Math.floor(timeArray[n] / (1000 * 60 * 60 * 24));*/
				var hour = Math.floor((timeArray[n][1]) / (1000 * 3600));
				var minute = Math.floor((timeArray[n][1] - hour * 3600 * 1000) / (1000 * 60) );
				var second = Math.floor((timeArray[n][1] - hour * 3600 * 1000 - minute * 1000 * 60)/ 1000);
				timeArray[n][0].html(hour + "时" + minute + "分" + second + "秒");

			}else if (timeArray[n][1] == 0) {
				timeArray[n][2].find('.status').empty().html("已取消").addClass("done");
				timeArray[n][2].find('.status-btn').empty().append("<a href=\"/order/"+timeArray[n][3]+"\">订单详情</a>");
				timeArray.splice(n,n+1);
				if (timeArray.length === 0) {
					clearInterval(interval);
				}
				//console.log(timeArray);
				//console.log(timeArray.length);
			}
		}
	}, 1000)
	
}
			
(function(){
	var obj = $(".J-order-list li[timeMillis]");
	if (obj.size()>0) { 
		var timeArray = [];
		for (var i = 0; i < obj.length; i++) {
			timeArray[i] = []; 
			timeArray[i][0] = obj.eq(i).find('.outtime');
			timeArray[i][1] = obj.eq(i).attr('timeMillis');
			timeArray[i][2] = obj.eq(i);
			timeArray[i][3] = parseInt(obj.eq(i).find('.order-num').find('em').html());

		}

		ShowCountDown(timeArray);
		
	}
	if ($(".J-order-list li").length == 0) {
		$(".order-null").show();
	}
	$(".J-no").click(function() {
		//取消订单选择否
		$(".artDialog").hide();

	});	
	$(".J-artDialog").click(function(){
		var dataHref = $(this).parent("a").attr("dataHref");
		//弹层
		$(".artDialog").show();
		$(".J-yes a").attr("href",dataHref);
	})


	$(".J-order-pay").click(function(){

		$(".J-order-list li").hide();
		$(this).addClass("active").siblings().removeClass("active");
		if ($(".J-order-list li").hasClass('pay')) {
			$(".order-null").hide();
			$(".J-order-list").find('.pay').show();
		}else{
			$(".order-null").show();
		}

	})

	$(".J-order-all").click(function(){

		$(this).addClass("active").siblings().removeClass("active");
		if ($(".J-order-list li").length > 0) {
			$(".order-null").hide();
			$(".J-order-list li").show();
		}else{
			$(".order-null").show();
		}

	})
	
})()