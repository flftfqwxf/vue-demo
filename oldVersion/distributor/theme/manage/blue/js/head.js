/*头部导航*/
$(function(){
	$(".login-on .user").mouseover(function(){
		$(".login-on .downBtn").addClass("hidden");
		$(".login-on .downUpBtn").removeClass("hidden");
		$(".login-on .choice").removeClass("hidden");
		$('.login-on .block').hide() ; 
	});
	$(".login-on .user").mouseout(function(){
		$(".login-on .downUpBtn").addClass("hidden");
		$(".login-on .downBtn").removeClass("hidden");
		$(".choice").addClass("hidden");
	});
	
})
