;!function(controller) {
	//use strict
	'use strict';
	controller.using("tools");

	controller.modules={
		init : function(){
			
			this.settime();

			this.event();

		},
		settime:function(){

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
							$(".time-txt").html("订单超时已取消，请重新购买!");
							$(".pay-type a").attr('href', 'javascript:void(0)').css("cursor","not-allowed");
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

			var obj = $(".J-time[timeMillis]");
			if (obj.size()>0) { 
				var timeArray = [];
				for (var i = 0; i < obj.length; i++) {
					timeArray[i] = []; 
					timeArray[i][0] = obj.eq(i);
					timeArray[i][1] = obj.eq(i).attr('timeMillis');
					
				}

				ShowCountDown(timeArray);
				
			}
		},
		event:function(){

			
		}
	};
	
	controller.call();

}(new this.jSharp.controller());