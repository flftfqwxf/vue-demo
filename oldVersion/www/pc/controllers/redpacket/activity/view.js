;!function(controller) {
	//use strict
	'use strict';
	controller.using("jquery");
	controller.using("tools");

	controller.modules={
			init : function(){

				this.event();

				this.scrollTop($(".J-scroll-top"));

		    },
		    /**
		     * [scrollTop description]back to top
		     * @param  {[type]} obj [description] parameter object  $(".J-scroll-top")
		     * @return {[type]}     [description]
		     */
		    scrollTop:function(obj){
		    	$(document).scroll(function(){
		    		var scrollTop = $(window).scrollTop();
		    		if (scrollTop > 300) {
		    			obj.show();
		    		}else{
		    			obj.hide();
		    		}
		    	});
		    	//trigger 触发事件 for example：input select event
		    	$(window).resize(function(){
		    		var winW = $(window).width();
		    		obj.css("right",(winW/2-560+"px"));
		    	}).resize();

		    },
		    event:function(){
		    	var _this = this;
		    	var num;
		    	$(".J-discount-btn").click(function() {
		    		var $this = $(this);
		    		var val = $("#activityId").val();
		    		if ($(this).hasClass('disable')) {
		    			return false;
		    		}else{
		    			$.ajax({
		    				url: '/redpacket/activity/receive',
		    				type: 'post',
		    				dataType: 'json',
		    				data: {activityId: val},
		    			})
		    			.done(function(data) {
		    				var obj = Boolean(data.result);
		    				if (obj) {
		    					window.location.href = "/login";
		    				}else{
		    					var success = data.success;

		    					if (success === true) {
		    						var money = data.money;
		    						$(".discount-dialog").fadeIn(300);
					    			num = setInterval(function(){
					    				$(".J-num").text(parseInt(Math.random()*10000));
					    			},80);

					    			setTimeout(function(){
					    				clearInterval(num);
					    				$(".J-num").text(money);
					    			},3000);
		    					}else if(success === false){
		    						var errMsg = data.errMsg;
		    						$.showMsg(errMsg,"success");
		    					}
		    				}
		    				
		    				
		    			})
		    			.fail(function() {
		    				$.showMsg("领取红包失败，请重新点击");
		    			})

		    		}	
		    	});
		    	$(".J-close").click(function(){
		    		clearInterval(num);
		    		$(".discount-dialog").fadeOut(300);

		    	});
		    	$(".J-scroll-top").click(function(){
		    		$("html,body").animate({scrollTop:0},400,function(){
		    			$(".J-scroll-top").hide();
		    		})
		    	})
		    }
	};
	
	controller.call();

}(new this.jSharp.controller());

