// JavaScript Document

(function(){
	$.fn.tabUI = function(options){
		
		var defaults ={			
			subElement  :'span',
			tabElement 	:'.tab-content',
			selectedsty : 'selected',
			event       : 'hover'
			};
		
		var ops = $.extend(defaults,options);
		this.each(function(){			
			var _this = $(this);
			$(ops.subElement).bind('click',function(){
				$(this).addClass(ops.selectedsty).siblings().removeClass(ops.selectedsty);				
				$(ops.tabElement).eq($(this).index(ops.subElement)).css('display','block').siblings(ops.tabElement).css('display','none');				
			});		
		});
	};
	
	
})(jQuery);

