(function($,w){
	var domain = "http://m.gmmtour.com/preview", distributorId = $('input[id="distibutorId"]').val(), 
		param={templateId: $('input[id="templateId"]').val(), 
			backgroundId: $('input[id="backgroundId"]').val(), 
			title: $('input[id="title"]').val(), 
			titleMargin: $('input[id="titleMargin"]').val()
		}, 
		$iframe = $("#previewFrame"), sUrl = domain + '?distributorId=' + distributorId;
	
	$(document).on("click",".cancel_btn",function(){
		window.location.href = "/shop/install";
	});
	$(document).on("click",".next_btn",function(){
		if(window.Placeholders && !Placeholders.nativeSupport){
			Placeholders.disable($('#shopForm')[0]);
		}
		var valid = $('#shopForm').validationEngine('validate');
		if (!valid) {
			if(window.Placeholders && !Placeholders.nativeSupport){
				Placeholders.enable($('#shopForm')[0]);
			}
		} else {
			$('#shopForm').submit();
		}
	});
	
	function reloadFrame(){
		var url = sUrl;
		$.each(param,function(k,v){
			url += "&"+ k + "=" + escape(v);
		})
		$iframe.attr("src",url);
	}
	reloadFrame();
})(jQuery,window);

function log(){
	if(!window.console) { 
	    window.console = {};
	    console.log = function() {};
	}
    console.log.apply(console, arguments);
}