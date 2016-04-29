$(function(){
	//init date
	$("#minDepartureDate").datepicker({
	    changeMonth: true,
	   changeYear: true,
	    dateFormat: "yy-mm-dd",
	    onClose: function( selectedDate ) {
//	      $( "#maxDepartureDate" ).datepicker( "option", "minDate", selectedDate );
	    }
	  });
	$("#maxDepartureDate").datepicker({
	    changeMonth: true,
	    changeYear: true,
	    dateFormat: "yy-mm-dd",
	    onClose: function( selectedDate ) {
	//      $( "#minDepartureDate" ).datepicker( "option", "maxDate", selectedDate );
	    }
    });
	
	
	
	var func_line_change = function(id){
		var line = $("#line").val();
		var po = $('#playOption');
		if (line == "") {
			po.html("<option value=''>选择路线</option>");
			po.select2({disabled:true});
		} else {
			$.getJSON('/line/play/' + line + '.json?_='+Math.random(),{},function(json){
				var html = "<option value=''>选择路线</option>";
				$(json.list).each(function(i, e){
					//if (id && id == e.id) {
						//html += "<option selected value="+e.id+">"+e.name+"</option>";
//					} else {
						html += "<option value="+e.id+">"+e.name+"</option>";
//					}
					
				});
				po.html(html);
				po.select2({disabled:false});
			});
		}
	};
	$("#line").change(func_line_change);
	func_line_change();
	//func_line_change();
	
	
	
	var $form = $("#form").validationEngine({binded:false, validateNonVisibleFields:false,promptPosition:"bottomLeft",scroll:true,scrollOffset:100,autoHidePrompt:true,autoHideDelay:3000,focusFirstField:true});
	var isValid = function(){
		if (!$form.validationEngine('validate')) {
			return false;
		} else {
			var maxPrice = $('#maxPrice');
			var minPrice = $('#minPrice');
			var minV = minPrice.val();
			var maxV = maxPrice.val();
			if (minV != "" && maxV !="" && parseInt(maxV) < parseInt(minV)) {
				maxPrice.validationEngine('showPrompt', '最高价不能小于最低价','error', null,true);
				return false;
			}
			
			
			return true;
		}
	}
	
	var func_submit = function(){
		if(window.Placeholders && !Placeholders.nativeSupport) {
			Placeholders.disable($form[0]);
		}
		if (isValid()) {
			$form.submit();
		}
		if(window.Placeholders && !Placeholders.nativeSupport) {
			Placeholders.enable($form[0]);
		}
	};
	
	$("#submit").click(func_submit);
	
	
	var productOrders = $("span[order]");
	productOrders.click(function(){
		productOrders.removeClass("active");
		$(this).addClass("active");
		$('#order').val($(this).attr("order"));
		func_submit();
	});
});