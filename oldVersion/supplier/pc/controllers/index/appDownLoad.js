;!function(controller) {
	//use strict
	'use strict';
	controller.using("jquery");

	controller.modules={

			init : function(){				

                this.bannar();		        
		    },

		    bannar:function(){
		    	$(".nav_mobile").on("hover",function(){
		   //  		$(".nav_mobile").each(function(){
					// 	$(this).css({"background-color":"#FFFFFF"}).find(".fa").css({"color":"#666666"});;
					// })
					if($(this).index()==0){
						$(".bannar_content").eq(0).siblings(".bannar_content").css("opacity","0");
                        $(".bannar_content").eq(0).css({"opacity":"1"});

					}else if($(this).index()==1){
						$(".bannar_content").eq(1).siblings(".bannar_content").css("opacity","0");
                        $(".bannar_content").eq(1).css({"opacity":"1"});
					}else if($(this).index()==2){
						$(".bannar_content").eq(2).siblings(".bannar_content").css("opacity","0");
                        $(".bannar_content").eq(2).css({"opacity":"1"});
					}
					// $(this).css({"background-color":"#F6F6F6"}).find(".fa").css({"color":"#ff7e1d"});
				})
		    }		    
	};
	
	controller.call();

}(new this.jSharp.controller());	