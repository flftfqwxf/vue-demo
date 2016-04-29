/*头部导航*/
$(function(){
	//获取登录人电话，并隐藏中间电话号码几位数字
	var phone=$(".phones").text();
	var mphone =phone.substr(3,4);
    var lphone = phone.replace(mphone,"****");
    $(".phones2").text(lphone); 
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
