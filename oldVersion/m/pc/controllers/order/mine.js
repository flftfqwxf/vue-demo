;!function(controller) {
	//use strict
	'use strict';
	controller.using("e97Date");
	controller.using("tools");
	controller.using("compare");
	controller.using("template");
	controller.using("dialog");

	controller.modules={
		init : function(){
			//倒计时
			this.settime();
			//事件
			this.event();
			//初始化订单状态
			this.orderListStatus($(".J-order-list li"),$(".J-all"))
			//初始化mie-list的高度
			this.eleheight();
		},
		eleheight:function(){
			var hei = $(".mine").height();
			$(".mine-list").height(hei);
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
		},
		orderListStatus:function(obj1,obj2){

			obj2.addClass('active').siblings().removeClass('active');

			var _len = obj1.length;

			if (_len == 0) {

				$(".J-order-list li").hide();
				$(".order-null").show();

			}else{

				$(".J-order-list li").hide();
				$(".order-null").hide();
				obj1.show();
				
			}
		},
		event:function(){
			var _this = this;
			$(document).on("click",".J-all",function(){

				var obj = $(".J-order-list li");
				var ele = $(this);
				
				_this.orderListStatus(obj,ele)
				
			}).on("click",".J-pay",function(){

				var obj = $(".J-order-list li.pay");
				var ele = $(this);
				_this.orderListStatus(obj,ele)
				
			}).on('click', '.J-order-cancel', function() {
				var $this = $(this);
				$.dialog({
		            /*title:"取消订单",*/
		            title: false,
		            width: 400,
		            height: 150,
		            padding: 0,
		            isOuterBoxShadow: true,
		            //isClose: false,
		            init:function(){
		            	$(".aui_buttons button").eq(1).addClass('btn-save').html("确定取消");
		            	var _orderId = parseInt($this.parents("li").find(".order-num").find("em").text());
		            	$(".btn-save").click(function(){
		            		/*window.location.href=url;*/

		            		$.ajax({
		            			url: '/order/'+_orderId+'/cancel.json',
		            			type: 'GET',
		            			dataType: 'json',
		            		})
		            		.done(function(data) {
		            			var _status = data.success;
		            			if (_status == true) {
		            				$this.parents("li").find('.status').removeClass('orange').text("已取消");
		            				$this.prev('.J-order-details').siblings('a').remove();
		            			}else{
		            				$.showMsg("取消失败,请重新取消");
		            			}
		            		})
		            		.fail(function() {

		            			$.showMsg("取消失败,请重新取消");
		            		})
		            		
		            	})
		            },
		            content: "订单成功取消后无法恢复，您确定取消该订单？",
		            lock: true,
		            fixed: true,
		            ok: true,
		            //cancelCssClass: 'btn-process',
		            cancel: function () {

		            },
		            cancelVal: '暂不取消',
		        });


			});											
		}
	};
	
	controller.call();

}(new this.jSharp.controller());