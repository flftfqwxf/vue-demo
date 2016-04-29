$(function(){
	$('.showInfo[templateId]').each(function(i, e){
		e = $(e);
		var templateId = e.attr("templateId");
		
		
		(function(){
			var dayList = $("#rollText_" + templateId);
			var lis = dayList.find("a");
			var discount = 4;
			var currIndex = discount - 1;
			var len = lis.length;
			
			$("#rollText_up_" + templateId).click(function(){
				if (len > discount && currIndex + 1 > discount) {
					lis.hide();
					currIndex -= 1;
					for (var i = 0; i < discount; i++){
						lis.eq(currIndex - i).show();
					}
				}
			});
			
			$("#rollText_down_" + templateId).click(function(){
				if (len > discount && currIndex + 1 < len) {
					lis.hide();
					currIndex += 1;
					for (var i = 0; i < discount;i++){
						lis.eq(currIndex - i).show();
					}
				}
			});
			
		})();
		
		
	});
})