;!function(controller) {
	//use strict
	'use strict';
	
	controller.using(["jquery"]);
	
	controller.modules={
		init : function(){
			
			var goTop=$("#J-goTop");
			goTop.click(function(){
	    		$("html,body").animate({scrollTop:0},400,function(){
		    		goTop.hide();
		    	});
	    	});
			
			//resize事件
	    	$(window).resize(function(){
	    		var winW=$(window).width();
	    		$(window).trigger("scroll");
	    		goTop.css("right",((winW-1170)/2)+110+"px");
	    	}).resize();
	    	
	    	$(window).scroll(function(){
	    		var scrollTop=$(window).scrollTop();
	    		
	    		//go to top btn
	    		if(scrollTop>250){
	    			goTop.fadeIn(300);
	    		}
	    		else{
	    			goTop.hide();
	    		}
	    	});
		}
	};
	
	controller.call();

}(new this.jSharp.controller());

