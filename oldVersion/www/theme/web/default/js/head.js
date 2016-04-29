/*头部导航*/
$(function(){
	/*登录注册切换背景和字体颜色*/
	$(".registerBtn").bind("mouseover",function(){
		$(".registerBtn").addClass("btn-active");
	}).bind("mouseout",function(){
		$(".registerBtn").removeClass("btn-active");
	});
	$(".loginBtn").bind("mouseover",function(){
		$(".loginBtn").addClass("btn-active");
	}).bind("mouseout",function(){
		$(".loginBtn").removeClass("btn-active");
	});
	$(".user").mouseover(function(){
		$(".downBtn").addClass("hidden");
		$(".downUpBtn").removeClass("hidden");
		$(".choice").removeClass("hidden");
		$('.block').hide() ; 
	});
	$(".user").mouseout(function(){
		$(".downUpBtn").addClass("hidden");
		$(".downBtn").removeClass("hidden");
		$(".choice").addClass("hidden");
	});
	$.cookie('user', '${userInfo}');
	var time;
	if($.cookie("time")==null){
		$.cookie("time",0);
	}
	if($.cookie("time")!=null){
		time=0;
		if(!$.cookie("time").isNaN){
			time=parseInt($.cookie("time"));
		}
		var div=$(".block");
		if(time<5){
			div.animate({left:'-20px',top:'200px'},"slow");
			div.animate({left:'-20px',top:'-16px'},"slow");
		}
		if(time>=5) {
			$(".block").css({"display":"none"});
		}
		time=parseInt(time+1);
		$.cookie('time',time);
	}
	/*导航切换*/
	$(".menu-li").click(function(){
		$(this).find("a").find("span").addClass("color-orange");
		$(this).siblings().find("a").find("span").removeClass("color-orange");
	});
})
