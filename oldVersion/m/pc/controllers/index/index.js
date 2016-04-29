;!function(controller) {
	//use strict
	'use strict';
	controller.using("slider");
	
	controller.modules={

			init : function(){
				$(".J-search-city-ul").show();
				$(".J-hot-city-list i.fa-caret-down").hide();
				$(".hot-city-list .search-city-ul-bg").css("opacity","0.9");

				//首页轮播图				
				this.slide(); 

				this.event();
		    },
		    slide:function(){
		    	$("#temp9").Slide({
	                effect: "fade",
	                speed: "normal",
	                lr_click: true,
	                showNum:false,
	                timer: 3000,
	                chooseNav: 'JQ-slide-nav-show',
	            });
		    },
		    event:function(){
		    	var num = 1;
		    	var $proList = $(".J-change").siblings('.pro-list').find("ul"),
		    		_len = $proList.size();
		    		if (_len === 1) {
		    			$(".J-change").find('a').css("cursor","not-allowed")
		    		}else{
		    			$(document).on("click",".J-change",function(){
				    		$proList.fadeOut().eq(num).fadeIn();
				    		if (num === _len-1) {
				    			num = 0;
				    		}else{
				    			num ++;
				    		}
				    	});
		    		}
		    	
		    }
	};
	
	controller.call();

}(new this.jSharp.controller());		