$(function() {
	$("#J_print").click(function(){
		var title=document.title;
	      document.title="结算详情打印";
		$(".information_content").jqprint({
			operaSupport:false
		});
		setTimeout(function(){document.title=title;},1000);
	})
})