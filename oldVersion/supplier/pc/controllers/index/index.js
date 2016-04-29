;!function(controller) {
	//use strict
	'use strict';
	controller.using("slider");
	
	controller.modules={
			staticVars:function(){
				//初始化定义
				this.staticVars={
					page_len:$(".J-destination-list li").size()
				}
			},
			init : function(){

				//static vars
				this.staticVars();

				//首页轮播图				
				this.slide(); 

				//点击按钮的默认样式处理判断
				this.pageDefault();

				//事件的加载
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
		    pageDefault:function(){
		    	var i = this,
		    		vars = i.staticVars,
		    		_num = Math.ceil(vars.page_len/4);
		    	if (_num <= 1) {
		    		$(".J-next").addClass('disable');
		    	}
		    },
		    event:function(){
		    	var i = this,
		    		vars = i.staticVars,
		    		_num = Math.ceil(vars.page_len/4),
		    		_n = 1;
		    	//获取JQ-slide-nav-show的绝对定位
		    	$(window).resize(function(){
		    		var _width = $(".JQ-slide-nav-show").width(),
		    		_winWidth = $(document).width();
		    		$(".JQ-slide-nav-show").css('right',(_winWidth-_width)/2);
		    	});
		    	$(document).on("click",".J-pre",function(){
		    		//甄选目的地上一页点击事件
		    		if(_n >= 2){
		    			$(".J-destination-list ul").animate({left: -1048*(_n-2)}, "slow");
		    			$(".J-next").removeClass("disable");
		    			_n--;
		    			if (_n == 1 ) {
		    				$(".J-pre").addClass('disable');
		    			}
		    		}
		    	}).on("click",".J-next",function(){
		    		//甄选目的地下一页点击事件
		    		if (_num >= 2) {
		    			if (_n < _num) {
		    				$(".J-destination-list ul").animate({left: -1048*_n}, "slow");
		    				$(".J-pre").removeClass("disable");
		    				_n++;
		    				if(_n == _num){
		    					$(".J-next").addClass('disable');
		    				}
		    			}
		    		}
		    	})
		    }
	};
	
	controller.call();

}(new this.jSharp.controller());		