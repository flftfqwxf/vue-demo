;!function(controller) {
	//use strict
	'use strict';
	controller.using("tools");
	controller.modules={
		init : function(){
			var leaveTimer=$(".rema-time");
			if(leaveTimer.size()>0&&parseInt(leaveTimer.attr("timemillis"))>0){
			    $(".rema-time span").countDown({
			        leaveTime:parseInt(leaveTimer.attr("timemillis"))/1000,
			        format:"hh时mm分ss秒",
			        onEnd:function(){
			    	    leaveTimer.remove();
			        }
			    });
			}
			else{
			    leaveTimer.remove();
			}
		}
	};
	
	controller.call();

}(new this.jSharp.controller());