;!function(controller) {
	//use strict
	'use strict';
	
	controller.using(["slider","tools"]);
	
	controller.modules={
			init : function(){
				//slider
				this.slider();
		    },
		    slider:function(){
		    	$("#temp7").Slide({
		    		effect: "fade",
                    speed: "normal",
                    autoPlay:true,
                    showNum:false,
                    timer: 4000,
                    chooseNav: 'JQ-slide-nav-show'
				});
		    }
	};
	
	controller.call();

}(new this.jSharp.controller());

